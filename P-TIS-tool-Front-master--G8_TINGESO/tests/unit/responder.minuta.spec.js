import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import Responder from '@/components/comentarios/ResponderMinuta.vue'

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      grupo: {},
      tipoAprobaciones: []
    }
  }
})

// Variables globales
const idMinuta = 43535

const minuta = {
  id: idMinuta,
  revision: 'J',
  motivo: 'Emitida para una prueba',
  identificador: 'EPP',
  minuta: {
    id: 943543,
    codigo: 'MINUTA_G10_08_2020-2_1119',
    correlativo: 8,
    tema: 'Esta es una minuta para las pruebas',
    creada_por: 'ABC',
    creada_el: '2020-11-30T06:43:32.000Z',
    tipo: 'Coordinacion',
    fecha_reunion: '2020-11-30T00:00:00.000Z',
    h_inicio: '2020-11-30T10:00:00.000Z',
    h_termino: '2020-11-30T11:00:00.000Z',
    clasificacion: {
      informativa: true,
      avance: false,
      coordinacion: false,
      decision: false,
      otro: true
    },
    objetivos: [
      {
        id: 95343,
        descripcion: 'Es un objetivo para la prueba',
        bitacora_revision_id: idMinuta
      },
      {
        id: 934534,
        descripcion: 'Otro objetivo para la prueba',
        bitacora_revision_id: idMinuta
      }
    ],
    conclusiones: [
      {
        id: 453453,
        descripcion: 'Una conclusión para la prueba',
        bitacora_revision_id: idMinuta
      },
      {
        id: 85344,
        descripcion: 'Otra conclusión para la prueba',
        bitacora_revision_id: idMinuta
      }
    ],
    asistencia: [
      {
        id: 94534,
        iniciales: 'ABC',
        id_estudiante: 134593,
        id_stakeholder: null,
        tipo: 'ACA',
        descripcion: 'Ausente con aviso'
      },
      {
        id: 745934,
        iniciales: 'GER',
        id_estudiante: 24534,
        id_stakeholder: null,
        tipo: 'PRE',
        descripcion: 'Presente'
      }
    ],
    items: [
      {
        id: 4539453,
        tipo: 'Compromiso',
        correlativo: 3,
        descripcion: 'Este es un item para la prueba',
        fecha: '2020-12-09T00:00:00.000Z',
        responsables: [
          {
            id: 923453,
            asistencia_id: 94534
          }
        ]
      }
    ]
  }
}

const comentarios = [
  {
    id: 9453453,
    comentario: 'Este es un comentario de prueba',
    es_item: true,
    id_item: 4539453,
    asistencia_id: 745934,
    bitacora_revision_id: idMinuta
  },
  {
    id: 7453453,
    comentario: 'Este es un comentario adicional para la prueba',
    es_item: false,
    id_item: null,
    asistencia_id: 745934,
    bitacora_revision_id: idMinuta
  }
]

const respuestas = [
  { id: 9453453, respuesta: 'Una respuesta de prueba' },
  { id: 9824534, respuesta: 'Otra respuesta de prueba' }
]

// Mock Axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/minutas/' + idMinuta:
      return Promise.resolve({data: minuta})
    case apiUrl + '/comentarios/' + idMinuta:
      return Promise.resolve({data: comentarios})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/respuestas':
      return Promise.resolve(201)
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('ResponderMinuta.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Responder, {
      propsData: {
        idBitacora: idMinuta
      },
      global: {
        plugins: [store]
      }
    })
  })

  it('se asigna prop "idBitacora" correctamente', () => {
    expect(wrapper.props().idBitacora).toEqual(43535)
  })

  it('variable "bitacora" se inicializa vacía', () => {
    expect(wrapper.vm.bitacora).toEqual({})
  })

  it('variable "bitacora" se inicializa correctamente', async () => {
    wrapper.vm.obtenerMinuta(idMinuta)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.bitacora).toEqual(minuta)
  })

  it('variable "comentarios" se inicializa vacía', () => {
    expect(wrapper.vm.comentarios).toEqual([])
  })

  it('variable "comentarios" se inicializa correctamente', async () => {
    wrapper.vm.obtenerComentarios(idMinuta)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.comentarios).toEqual(comentarios)
  })

  it('propiedad computada "mostrarMinuta" funciona correctamente con "false"', () => {
    wrapper.vm.bitacora = {}
    expect(wrapper.vm.mostrarMinuta).toBeFalsy()
  })

  it('propiedad computada "mostrarMinuta" funciona correctamente con "true"', async () => {
    wrapper.vm.obtenerMinuta(idMinuta)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.mostrarMinuta).toBeTruthy()
  })

  it('método "obtenerMinuta" funciona correctamente', async () => {
    wrapper.vm.bitacora = {}
    wrapper.vm.obtenerMinuta(idMinuta)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.bitacora).toEqual(minuta)
  })

  it('método "obtenerComentarios" funciona correctamente', async () => {
    wrapper.vm.comentarios = []
    wrapper.vm.obtenerComentarios(idMinuta)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.comentarios).toEqual(comentarios)
  })

  it('método "enviarRespuestas" funciona correctamente', async () => {
    wrapper.vm.enviarRespuestas(respuestas)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })

  it('método "recibirRespuestas" funciona correctamente', async () => {
    wrapper.vm.recibirRespuestas(respuestas)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })

  it('método "cerrarRespuestas" funciona correctamente', async () => {
    wrapper.vm.cerrarRespuestas()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })
})
