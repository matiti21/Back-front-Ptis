import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import GestionGrupos from '@/components/GestionGrupos.vue'

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      jornadaActual: 'Diurna'
    }
  },
  mutations: {
    setJornadaActual (state, valor) {
      state.jornadaActual = valor
    }
  }
})

// Variables globales
const idGrupo = 93453

const grupos = [
  {
    id: idGrupo,
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
  }
]

const listaEstudiantes = [
  {
    id: 29353,
    run_est: '11222333-4',
    nombre_est: 'Abel',
    apellido1: 'Becerra',
    apellido2: 'Contreras',
    codigo_seccion: 'A1',
    jornada: 'Diurna'
  },
  {
    id: 9534,
    run_est: '22333444-5',
    nombre_est: 'Carla',
    apellido1: 'Mandiola',
    apellido2: 'Pereira',
    codigo_seccion: 'A1',
    jornada: 'Diurna'
  },
  {
    id: 926364,
    run_est: '33444555-K',
    nombre_est: 'Mateo',
    apellido1: 'Bermudes',
    apellido2: 'Chacón',
    codigo_seccion: 'V21',
    jornada: 'Vespertina'
  }
]

const agregado = [{
  id: 92345,
  nombre_est: 'Alberto',
  apellido1: 'Becerra',
  apellido2: 'Castro',
  run_est: '11111111-1',
  codigo_seccion: 'Act',
  jornada: 'Diurna'
}]

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case '127.0.0.1:3000/grupos':
      return Promise.resolve({data: grupos})
    case '127.0.0.1:3000/estudiantes/asignacion/sin_grupo':
      return Promise.resolve({data: listaEstudiantes})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/grupos':
      return Promise.resolve()
    case apiUrl + '/grupos/ultimo_grupo':
      return Promise.resolve({data: {correlativo: 13}})
    default:
      return Promise.reject(new Error('not found'))
  } /*
  if (url === apiUrl + '/grupos/ultimo_grupo' && valor === {jornada: 'Diurna'}) {
    return Promise.resolve({data: null})
  } else if (url === apiUrl + '/grupos/ultimo_grupo' && valor === {jornada: 'Vespertina'}) {
    return Promise.resolve({data: {correlativo: 6}})
  } else if (url === apiUrl + '/grupos/ultimo_grupo' && valor === {jornada: 'Prueba'}) {
    return Promise.resolve({data: {correlativo: 13}})
  } else {
    return Promise.reject(new Error('not found'))
  } */
})

axios.patch.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/grupos/' + idGrupo:
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.delete.mockImplementation((url) => {
  switch (url) {
    case '127.0.0.1:3000/grupos/10':
      return Promise.resolve(201)
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('GestionGrupos.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(GestionGrupos, {
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.$store.commit('setJornadaActual', 'Diurna')
  })

  it('variable verFormulario se inicializa en false', () => {
    expect(wrapper.vm.verFormulario).toBeFalsy()
  })

  it('variable estudiantes se inicializa vacía', () => {
    expect(wrapper.vm.estudiantes).toEqual([])
  })

  it('variable entradas se inicializa correctamente', () => {
    const entradas = {
      proyecto: {
        error: false,
        mensaje: ''
      },
      estudiantes: {
        error: false,
        mensaje: ''
      }
    }
    expect(wrapper.vm.entradas).toEqual(entradas)
  })

  it('variable grupo se inicializa correctamente', () => {
    const nuevo = {
      nombre: '',
      proyecto: '',
      correlativo: 0
    }
    expect(wrapper.vm.grupo).toEqual(nuevo)
  })

  it('variable listaEstudiantes se inicializa vacía', () => {
    expect(wrapper.vm.listaEstudiantes).toEqual([])
  })

  it('variable listaGrupos se inicializa correctamente', () => {
    expect(wrapper.vm.listaGrupos).toEqual([])
  })

  it('variable "notificar" se inicializa correctamente', () => {
    expect(wrapper.vm.notificar.id).toEqual(0)
    expect(wrapper.vm.notificar.mostrar).toBeFalsy()
    expect(wrapper.vm.notificar.mensaje).toEqual('¿Confirma la eliminación del grupo?')
  })

  it('variable "actualizarGrupo" se inicializa correctamente en "false"', () => {
    expect(wrapper.vm.actualizarGrupo).toBeFalsy()
  })

  it('variable "idGrupo" se inicializa correctamente', () => {
    expect(wrapper.vm.idGrupo).toEqual(0)
  })

  it('propiedad computada "sinAsignar" funciona correctamente', () => {
    const esperado = [
      {
        id: 29353,
        run_est: '11222333-4',
        nombre_est: 'Abel',
        apellido1: 'Becerra',
        apellido2: 'Contreras',
        codigo_seccion: 'A1',
        jornada: 'Diurna'
      },
      {
        id: 9534,
        run_est: '22333444-5',
        nombre_est: 'Carla',
        apellido1: 'Mandiola',
        apellido2: 'Pereira',
        codigo_seccion: 'A1',
        jornada: 'Diurna'
      },
    ]
    wrapper.vm.listaEstudiantes = listaEstudiantes
    expect(wrapper.vm.sinAsignar).toEqual(esperado)
  })

  it('propiedad computada "mostrarLista" funciona correctamente con "true"', () => {
    wrapper.vm.listaEstudiantes = listaEstudiantes
    expect(wrapper.vm.mostrarLista).toBeTruthy()
  })

  it('propiedad computada "mostrarLista" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarLista).toBeFalsy()
  })

  it('propiedad computada "gruposJornada" funciona correctamente con jornada "Diurna"', async () => {
    const esperado = [
      {
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
      }
    ]
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.gruposJornada).toEqual(esperado)
  })

  it('propiedad computada "gruposJornada" funciona correctamente con jornada "Vespertina"', async () => {
    wrapper.vm.$store.commit('setJornadaActual', "Vespertina")
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.gruposJornada).toEqual([])
  })

  it('método "concatenarNombre" funciona correctamente', () => {
    const estudiante = {
      nombre_est: 'Mateo',
      apellido1: 'Iglesias',
      apellido2: 'Del Campo'
    }
    expect(wrapper.vm.concatenarNombre(estudiante)).toEqual('Mateo Iglesias Del Campo')
  })

  it('método "nombreCompleto" funciona correctamente', () => {
    const estudiante = {
      nombre: 'Mateo',
      apellido_paterno: 'Iglesias',
      apellido_materno: 'Del Campo'
    }
    expect(wrapper.vm.nombreCompleto(estudiante)).toEqual('Mateo Iglesias Del Campo')
  })

  it('método "visualizarRun" funciona correctamente', () => {
    expect(wrapper.vm.visualizarRun('12345678-9')).toEqual('12.345.678-9')
  })

  it('método "mostrarClientes" funciona correctamente con "true"', () => {
    const grupo = {
      stakeholders: [{id: 962354}, {id: 6235345}, {id: 63453}]
    }
    expect(wrapper.vm.mostrarClientes(grupo)).toBeTruthy()
  })

  it('método "mostrarClientes" funciona correctamente con "false"', () => {
    const grupo = {
      stakeholders: []
    }
    expect(wrapper.vm.mostrarClientes(grupo)).toBeFalsy()
  })

  it('método "agregarGrupo" funciona correctamente', async () => {
    wrapper.vm.verFormulario = false
    wrapper.vm.grupo = {
      nombre: 'G34',
      proyecto: 'Proyecto de prueba',
      correlativo: 34
    }
    wrapper.vm.estudiantes = [4634, 6234, 34533]
    wrapper.vm.agregarGrupo()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verFormulario).toBeTruthy()
    expect(wrapper.vm.grupo.nombre).toEqual('G14')
    expect(wrapper.vm.grupo.proyecto).toEqual('')
    expect(wrapper.vm.grupo.correlativo).toEqual(14)
    expect(wrapper.vm.estudiantes).toEqual([])
    expect(wrapper.vm.listaEstudiantes).toEqual(listaEstudiantes)
  })

/* Falta implementar función axios mock por única vez

  const url = '127.0.0.1:3000/estudiantes/asignacion/sin_grupo'
  axios.get.mockImplementationOnce((url) => Promise.resolve({data: listaEstudiantes}))
*/
  it('método "obtenerEstudiantes" funciona correctamente', async () => {
    wrapper.vm.obtenerEstudiantes()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaEstudiantes).toEqual(listaEstudiantes)
  })

  it('método "obtenerGrupos" funciona correctamente', async () => {
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaGrupos).toEqual(grupos)
  })

  // Test método 'agregar'
  it('método "agregar" funciona correctamente con agregar grupo', async () => {
    wrapper.vm.grupo.nombre = 'G01'
    wrapper.vm.grupo.proyecto = 'Proyecto de prueba unitario'
    wrapper.vm.grupo.correlativo = 34
    wrapper.vm.estudiantes = [92345]
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaGrupos).toEqual(grupos)
  })

  it('método "agregar" funciona correctamente con actualizar grupo', async () => {
    wrapper.vm.idGrupo = idGrupo
    wrapper.vm.grupo.nombre = 'G01'
    wrapper.vm.grupo.proyecto = 'Proyecto de prueba unitario'
    wrapper.vm.grupo.correlativo = 34
    wrapper.vm.estudiantes = [92345]
    wrapper.vm.actualizarGrupo = true
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaGrupos).toEqual(grupos)
    expect(wrapper.vm.actualizarGrupo).toBeFalsy()
  })

  it('método "noAgregar" funciona correctamente', () => {
    wrapper.vm.verFormulario = true
    wrapper.vm.entradas.proyecto.error = true
    wrapper.vm.entradas.estudiantes.error = true
    wrapper.vm.noAgregar()
    expect(wrapper.vm.verFormulario).toBeFalsy()
    expect(wrapper.vm.entradas.proyecto.error).toBeFalsy()
    expect(wrapper.vm.entradas.estudiantes.error).toBeFalsy()
  })

  it('método "nuevoGrupo" funciona correctamente', () => {
    wrapper.vm.grupo.nombre = 'Grupo de prueba'
    wrapper.vm.grupo.proyecto = 'Pruebas de código'
    wrapper.vm.grupo.correlativo = 623534
    wrapper.vm.estudiantes = [{id: 962345}, {id: 9629353}]
    wrapper.vm.nuevoGrupo()
    expect(wrapper.vm.grupo.nombre).toEqual('')
    expect(wrapper.vm.grupo.proyecto).toEqual('')
    expect(wrapper.vm.grupo.correlativo).toEqual(0)
    expect(wrapper.vm.estudiantes).toEqual([])
  })

  it('método "obtenerCorrelativo" funciona correctamente', async () => {
    wrapper.vm.obtenerCorrelativo('Diurna')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupo.correlativo).toEqual(14)
    expect(wrapper.vm.grupo.nombre).toEqual('G14')
  })

  it('método "validarProyecto" funciona correctamente con proyecto igual a "null"', () => {
    wrapper.vm.grupo.proyecto = null
    expect(wrapper.vm.validarProyecto()).toBeFalsy()
    expect(wrapper.vm.entradas.proyecto.error).toBeTruthy()
    expect(wrapper.vm.entradas.proyecto.mensaje).toEqual('Se debe ingresar el nombre del proyecto a realizar')
  })

  it('método "validarProyecto" funciona correctamente con proyecto igual a "undefined"', () => {
    wrapper.vm.grupo.proyecto = undefined
    expect(wrapper.vm.validarProyecto()).toBeFalsy()
    expect(wrapper.vm.entradas.proyecto.error).toBeTruthy()
    expect(wrapper.vm.entradas.proyecto.mensaje).toEqual('Se debe ingresar el nombre del proyecto a realizar')
  })

  it('método "validarProyecto" funciona correctamente con proyecto igual a ""', () => {
    wrapper.vm.grupo.proyecto = ''
    expect(wrapper.vm.validarProyecto()).toBeFalsy()
    expect(wrapper.vm.entradas.proyecto.error).toBeTruthy()
    expect(wrapper.vm.entradas.proyecto.mensaje).toEqual('Se debe ingresar el nombre del proyecto a realizar')
  })

  it('método "validarProyecto" funciona correctamente con proyecto distinto a "regExp"', () => {
    wrapper.vm.grupo.proyecto = 'Gistdc,ast346#&#adis'
    expect(wrapper.vm.validarProyecto()).toBeFalsy()
    expect(wrapper.vm.entradas.proyecto.error).toBeTruthy()
    expect(wrapper.vm.entradas.proyecto.mensaje).toEqual('Sólo se admiten letras. Verificar que no tenga caracteres especiales.')
  })

  it('método "validarProyecto" funciona correctamente con proyecto con "regExp" correcto', () => {
    wrapper.vm.grupo.proyecto = 'Proyecto de Prueba'
    expect(wrapper.vm.validarProyecto()).toBeTruthy()
    expect(wrapper.vm.entradas.proyecto.error).toBeFalsy()
    expect(wrapper.vm.entradas.proyecto.mensaje).toEqual('')
  })

  it('método "validarAsignacion" funciona correctamente para "true"', () => {
    wrapper.vm.estudiantes = [{id: 943453}, {id: 9249345}]
    expect(wrapper.vm.validarAsignacion()).toBeTruthy()
    expect(wrapper.vm.entradas.estudiantes.error).toBeFalsy()
    expect(wrapper.vm.entradas.estudiantes.mensaje).toEqual('')
  })

  it('método "validarAsignacion" funciona correctamente para "false"', () => {
    wrapper.vm.estudiantes = []
    expect(wrapper.vm.validarAsignacion()).toBeFalsy()
    expect(wrapper.vm.entradas.estudiantes.error).toBeTruthy()
    expect(wrapper.vm.entradas.estudiantes.mensaje).toEqual('No se han asignado estudiantes al grupo')
  })

  it('método "validarDatos" funciona correctamente para "true"', () => {
    wrapper.vm.grupo.proyecto = 'Proyecto de Prueba'
    wrapper.vm.estudiantes = [{id: 943453}, {id: 9249345}]
    expect(wrapper.vm.validarDatos()).toBeTruthy()
  })

  it('método "validarDatos" funciona correctamente para "false"', () => {
    wrapper.vm.grupo.proyecto = undefined
    wrapper.vm.estudiantes = [{id: 943453}, {id: 9249345}]
    expect(wrapper.vm.validarDatos()).toBeFalsy()
  })

  it('método "borrarGrupo" funciona correctamente', () => {
    wrapper.vm.borrarGrupo(10)
    expect(wrapper.vm.notificar.mostrar).toBeTruthy()
    expect(wrapper.vm.notificar.id).toEqual(10)
  })

  it('método "confirmarBorrado" funciona correctamente', async () => {
    wrapper.vm.notificar.mostrar = true
    wrapper.vm.notificar.id = 10
    wrapper.vm.confirmarBorrado()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.notificar.mostrar).toBeFalsy()
    expect(wrapper.vm.notificar.id).toEqual(0)
  })

  it('método "cerrarNotificacion" funciona correctamente', () => {
    wrapper.vm.notificar.mostrar = true
    wrapper.vm.cerrarNotificacion()
    expect(wrapper.vm.notificar.mostrar).toBeFalsy()
  })

  it('método "convertirEstudiantes" funciona correctamente', () => {
    const esperado = [92345]
    expect(wrapper.vm.convertirEstudiantes(grupos[0])).toEqual(esperado)
  })

  it('método "existeEstudiante" funciona correctamente con "true"', () => {
    wrapper.vm.listaEstudiantes = listaEstudiantes
    expect(wrapper.vm.existeEstudiante(29353)).toBeTruthy()
  })

  it('método "existeEstudiante" funciona correctamente con "false"', () => {
    wrapper.vm.listaEstudiantes = listaEstudiantes
    expect(wrapper.vm.existeEstudiante(53)).toBeFalsy()
  })

  it('método "agregarEstudiantesGrupo" funciona correctamente', () => {
    expect(wrapper.vm.agregarEstudiantesGrupo(grupos[0])).toEqual(agregado)
  })

  it('método "quitarEstudiantesGrupo" funciona correctamente', () => {
    wrapper.vm.listaEstudiantes = listaEstudiantes.concat(agregado)
    wrapper.vm.quitarEstudiantesGrupo()
    expect(wrapper.vm.listaEstudiantes).toEqual(listaEstudiantes)
  })

  it('método "editarGrupo" funciona correctamente', () => {
    const esperado = {
      nombre: 'G01',
      proyecto: 'Proyecto de prueba unitario',
      correlativo: 34
    }
    wrapper.vm.editarGrupo(grupos[0])
    expect(wrapper.vm.idGrupo).toEqual(93453)
    expect(wrapper.vm.grupo).toEqual(esperado)
    expect(wrapper.vm.estudiantes).toEqual([92345])
    expect(wrapper.vm.listaEstudiantes).toEqual(agregado)
    expect(wrapper.vm.verFormulario).toBeTruthy()
    expect(wrapper.vm.actualizarGrupo).toBeTruthy()
  })
})
