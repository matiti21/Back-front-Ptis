import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import Comentarios from '@/components/comentarios/ComentarMinuta.vue'

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      grupo: {
        id: 93453,
        nombre: 'G01',
        proyecto: 'Proyecto de prueba unitario',
        correlativo: 34,
        jornada: 'Diurna',
        estudiantes: [{
          id: 92345,
          iniciales: 'ABC',
          usuario: {
            nombre: 'Alberto',
            apellido_paterno: 'Becerra',
            apellido_materno: 'Castro',
            run: '11111111-1',
            email: 'alberto.becerra@algo.com'
          }
        }],
        stakeholders: []
      },
      tipoAprobaciones: [
        {
          id: 14534,
          identificador: 'A',
          descripcion: 'Aprobada',
          rango: 1
        },
        {
          id: 34534,
          identificador: 'AC',
          descripcion: 'Aprobada con comentarios',
          rango: 2
        },
        {
          id: 94534,
          identificador: 'R',
          descripcion: 'Rechazada',
          rango: 3
        },
        {
          id: 84534,
          identificador: 'RC',
          descripcion: 'Rechazada con comentarios',
          rango: 4
        }
      ]
    }
  }
})

// Variables globales
const bitacora = {
  id: 663462,
  revision: 'Z',
  minuta: {
    id: 242345345,
    correlativo: 6345,
    tema: 'Esto es una prueba',
    fecha_reunion: '2020-12-14T00:00:00.000Z',
    h_inicio: '2020-12-14T23:00:00.000Z',
    h_termino: '2020-12-14T23:59:00.000Z',
    clasificacion: {
      informativa: false,
      avance: false,
      decision: true,
      coordinacion: false,
      otro: false
    },
    asistencia: [
      {
        iniciales: 'GER',
        descripcion: 'Presente'
      }
    ]
  }
}

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/minutas/663462':
      return Promise.resolve({data: bitacora})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/comentarios':
      return Promise.resolve(201)
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('ComentarMinuta.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Comentarios, {
      propsData: {
        idBitacora: 1353
      },
      global: {
        plugins: [store]
      }
    })
  })

  it('se asigna props idBitacora adecuadamente', () => {
    expect(wrapper.props().idBitacora).toEqual(1353)
  })

  it('variable id se inicializa correctamente', () => {
    expect(wrapper.vm.id).toEqual(1353)
  })

  it('variable bitacora se inicializa correctamente', () => {
    expect(wrapper.vm.bitacora).toEqual({})
  })

  it('variable comentarios se inicializa correctamente', () => {
    expect(wrapper.vm.comentarios).toEqual([])
  })

  it('variable mostrarAprobacion se inicializa correctamente', () => {
    expect(wrapper.vm.mostrarAprobacion).toBeFalsy()
  })

  it('variable aprobacion se inicializa correctamente', () => {
    expect(wrapper.vm.aprobacion).toEqual(0)
  })

  it('variable "error" se inicializa correctamente', () => {
    expect(wrapper.vm.error).toBeFalsy()
  })

  it('propiedad computada "mostrarMinuta" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarMinuta).toBeFalsy()
  })

/*  "mostrarMinuta" con "true" depende del "state" */

  it('propiedad computada "mostrarMinuta" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Comentarios, {
      propsData: {
        idBitacora: 1353
      },
      data() {
        return {
          bitacora: bitacora
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarMinuta).toBeTruthy()
  })

  it('propiedad computada "sinComentarios" funciona correctamente con "true" y lista vacía', () => {
    expect(wrapper.vm.sinComentarios).toBeTruthy()
  })

  it('propiedad computada "sinComentarios" funciona correctamente con "true" y comentarios vacíos', () => {
    wrapper.vm.comentarios = [
      {comentario: '', es_item: true, id_item: 0},
      {comentario: '', es_item: true, id_item: 0}
    ]
    expect(wrapper.vm.sinComentarios).toBeTruthy()
  })

  it('propiedad computada "sinComentarios" funciona correctamente con "false"', () => {
    wrapper.vm.comentarios = [
      {comentario: 'abc', es_item: true, id_item: 0},
      {comentario: 'abc', es_item: true, id_item: 0}
    ]
    expect(wrapper.vm.sinComentarios).toBeFalsy()
  })

  it('propiedad computada "aprobacionesFiltradas" funciona correctamente con "sinComentarios" en "true"', () => {
    const esperado = [
      {
        id: 14534,
        identificador: 'A',
        descripcion: 'Aprobada',
        rango: 1
      },
      {
        id: 94534,
        identificador: 'R',
        descripcion: 'Rechazada',
        rango: 3
      }
    ]
    expect(wrapper.vm.aprobacionesFiltradas).toEqual(esperado)
  })

  it('propiedad computada "aprobacionesFiltradas" funciona correctamente con "sinCometnarios" en "false"', () => {
    const esperado = [
      {
        id: 34534,
        identificador: 'AC',
        descripcion: 'Aprobada con comentarios',
        rango: 2
      },
      {
        id: 84534,
        identificador: 'RC',
        descripcion: 'Rechazada con comentarios',
        rango: 4
      }
    ]
    wrapper.vm.comentarios = [
      {comentario: 'abc', es_item: true, id_item: 0},
      {comentario: 'abc', es_item: true, id_item: 0}
    ]
    expect(wrapper.vm.aprobacionesFiltradas).toEqual(esperado)
  })

  it('método "obtenerMinuta" funciona correctamente', async () => {
    wrapper.vm.obtenerMinuta(663462)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.bitacora).toEqual(bitacora)
  })

/*
  it('método "enviarComentarios" funciona correctamente', async () => {
    wrapper.vm.enviarComentarios()
    expect(await wrapper.vm.$nextTick()).toEqual(201)
  })
*/

  it('método recibirComentarios funciona correctamente', () => {
    const comentarios = [
      {comentario: 'comentario de item', es_item: true, id_item: 6345},
      {comentario: 'comentario general', es_item: false, id_item: 0}
    ]
    wrapper.vm.recibirComentarios(comentarios)
    expect(wrapper.vm.comentarios).toEqual(comentarios)
    expect(wrapper.vm.mostrarAprobacion).toBeTruthy()
  })

  it('método "cerrarRevision" funciona correctamente', async () => {
    wrapper.vm.cerrarRevision()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })

  it('método "establecerEstado" funciona correctamente con aprobación correcta', async () => {
    wrapper.vm.aprobacion = 14534
    wrapper.vm.establecerEstado()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
    expect(wrapper.vm.mostrarAprobacion).toBeFalsy()
  })

  it('método "establecerEstado" funciona correctamente con aprobación no válida', async () => {
    wrapper.vm.aprobacion = 0
    wrapper.vm.mostrarAprobacion = true
    wrapper.vm.establecerEstado()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeFalsy()
    expect(wrapper.vm.mostrarAprobacion).toBeTruthy()
  })

/*   método "limpiarCampos" depende del "state" */

  it('método "limpiarCampos" funciona correctamente', () => {
    const wrapper = shallowMount(Comentarios, {
      propsData: {
        idBitacora: 1353
      },
      data() {
        return {
          bitacora: bitacora,
          comentarios: [
            {comentario: 'comentario de item', es_item: true, id_item: 6345},
            {comentario: 'comentario general', es_item: false, id_item: 0}
          ],
          aprobacion: 62345
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.limpiarCampos()
    expect(wrapper.vm.bitacora).toEqual({})
    expect(wrapper.vm.comentarios).toEqual([])
    expect(wrapper.vm.aprobacion).toEqual(0)
  })

  it('método "validarAprobacion" funciona correctamente con "true"', () => {
    wrapper.vm.aprobacion = 91345
    expect(wrapper.vm.validarAprobacion()).toBeTruthy()
    expect(wrapper.vm.error).toBeFalsy()
  })

  it('método "validarAprobacion" funciona correctamente con "false"', () => {
    wrapper.vm.aprobacion = 0
    expect(wrapper.vm.validarAprobacion()).toBeFalsy()
    expect(wrapper.vm.error).toBeTruthy()
  })
})
