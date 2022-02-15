import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import GestionEstudiantes from '@/components/GestionEstudiantes.vue'

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      secciones: []
    }
  },
  mutations: {
    setSecciones (state, valor) {
      state.secciones = valor
    }
  }
})

// Variables globales
const entrada = {
  error: false,
  mensaje: ''
}

const semestre = {
  id: 184353,
  numero: 2,
  agno: 2020,
  activo: true,
  inicio: '2020-09-28T00:00:00.000Z',
  fin: '2021-01-29T00:00:00.000Z'
}

const secciones = [
  {
    id: 934345,
    codigo: 'A1',
    curso: {
      id: 92345,
      nombre: 'Curso diurno para la prueba',
      codigo: '13168'
    },
    jornada: {
      id: 81345,
      nombre: 'Diurna',
      identificador: 1
    },
    semestre: semestre
  },
  {
    id: 45348,
    codigo: 'V21',
    curso: {
      id: 134543,
      nombre: 'Curso vespertino para la prueba',
      codigo: '13270'
    },
    jornada: {
      id: 1453,
      nombre: 'Vespertina',
      identificador: 2
    },
    semestre: semestre
  }
]

const estudiantes = [
  {
    id: 1345934,
    run_est: '11222333-4',
    nombre_est: 'Andrea',
    apellido1: 'Zambrano',
    apellido2: 'Saldaña',
    correo: 'andrea.zambrano@usach.cl',
    codigo_seccion: 'A1',
    jornada: 'Diurna'
  },
  {
    id: 14534,
    run_est: '12345678-5',
    nombre_est: 'Ernesto',
    apellido1: 'Poblete',
    apellido2: 'Fernandez',
    correo: 'ernesto.poblete@usach.cl',
    codigo_seccion: 'V21',
    jornada: 'Vespertina'
  }
]

const nuevoEstudiante = {
  id: 19453,
  usuario: {
    nombre: 'Ernesto',
    apellido_paterno: 'Poblete',
    apellido_materno: 'Fernandez',
    run: '12345678-5',
    email: 'ernesto.poblete@usach.cl'
  },
  seccion_id: 45348
}

const listaEstudiantes = [
  {id: 29353}, {id: 9534}, {id: 926364}
]

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/secciones':
      return Promise.resolve({data: secciones})
    case apiUrl + '/estudiantes':
      return Promise.resolve({data: estudiantes})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/estudiantes':
      return Promise.resolve()
    case apiUrl + '/estudiantes/eliminar':
      return Promise.resolve()
    case apiUrl + '/estudiantes/archivo/nuevos':
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.patch.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/estudiantes/' + nuevoEstudiante.id:
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('GestionEstudiantes.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(GestionEstudiantes, {
      global: {
        plugins: [store]
      }
    })
  })

  it('variable verFormulario se inicializa en false', () => {
    expect(wrapper.vm.verFormulario).toBeFalsy()
  })

  it('variable estudiante se inicializa correctamente', () => {
    const estudiante = {
      id: 0,
      usuario: {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        run: '',
        email: ''
      },
      seccion_id: null
    }
    expect(wrapper.vm.estudiante).toEqual(estudiante)
  })

  it('variable listaEstudiantes se inicializa vacía', () => {
    expect(wrapper.vm.listaEstudiantes).toEqual([])
  })

  it('variable mostrarLista se inicializa con false', () => {
    expect(wrapper.vm.mostrarLista).toBeFalsy()
  })

  it('variable runEntrada se inicializa correctamente', () => {
    expect(wrapper.vm.runEntrada).toEqual(entrada)
  })

  it('variable nombreEntrada se inicializa correctamente', () => {
    expect(wrapper.vm.nombreEntrada).toEqual(entrada)
  })

  it('variable apellidoPaternoEntrada se inicializa correctamente', () => {
    expect(wrapper.vm.apellidoPaternoEntrada).toEqual(entrada)
  })

  it('variable apellidoMaternoEntrada se inicializa correctamente', () => {
    expect(wrapper.vm.apellidoMaternoEntrada).toEqual(entrada)
  })

  it('variable emailEntrada se inicializa correctamente', () => {
    expect(wrapper.vm.emailEntrada).toEqual(entrada)
  })

  it('variable seccionEntrada se inicializa en false', () => {
    expect(wrapper.vm.seccionEntrada).toBeFalsy()
  })

  it('variable "mensajes" se inicializa correctamente', () => {
    const esperado = {
      sin_nombre: 'Debe ingresar el nombre del estudiante',
      sin_apellido: 'Debe ingresar el apellido del estudiante',
      sin_correo: 'Debe ingresar el correo electrónico del estudiante',
      sin_especiales: 'Sólo letras. Verificar que no tenga caracteres especiales.',
      correo_mal: 'El correo ingresado no es válido',
      sin_usach: 'El correo ingresado no es corporativo (@usach.cl)',
      sin_run: 'No se ha ingresado R.U.N. del estudiante',
      run_error: 'No es un R.U.N. válido',
      run_repetido: 'Usuario ya se encuentra en el sistema'
    }
    expect(wrapper.vm.mensajes).toEqual(esperado)
  })

  it('varialbe "eliminados" se inicializa correctamente', () => {
    expect(wrapper.vm.eliminados).toEqual([])
  })

  it('varialbe "notificar" se inicializa correctamente', () => {
    expect(wrapper.vm.notificar).toBeFalsy()
  })

  it('variable "mostrarNomina" se inicializa correctamente', () => {
    expect(wrapper.vm.mostrarNomina).toBeFalsy()
  })

  it('variable "archivo" se inicializa correctamente', () => {
    expect(wrapper.vm.archivo).toEqual('')
  })

  it('variable "nombreArchivo" se inicializa correctamente', () => {
    expect(wrapper.vm.nombreArchivo).toEqual('No se ha subido el archivo')
  })

  it('variable "agregaArchivo" se inicializa correctamente', () => {
    expect(wrapper.vm.agregaArchivo).toBeFalsy()
  })

  it('variable "actualizarEstudiante" se inicializa correctamente en "false"', () => {
    expect(wrapper.vm.actualizarEstudiante).toBeFalsy()
  })

  it('propiedad computada "mostrarEliminar" funciona correctamente con "true"', () => {
    wrapper.vm.eliminados = [2453, 938534]
    expect(wrapper.vm.mostrarEliminar).toBeTruthy()
  })

  it('propiedad computada "mostrarEliminar" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarEliminar).toBeFalsy()
  })

  it('propiedad computada "numeroEst" funciona correctamente', () => {
    wrapper.vm.eliminados = [2453, 938534]
    expect(wrapper.vm.numeroEst).toEqual(2)
  })

  it('método "obtenerSecciones" funciona correctamente', async () => {
    wrapper.vm.obtenerSecciones()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.secciones).toEqual(secciones)
  })

  it('método "nombreCompleto" funciona correctamente', () => {
    const estudiante = {
      nombre_est: 'Mauricio',
      apellido1: 'Cobarrubias',
      apellido2: 'Celedón'
    }
    expect(wrapper.vm.nombreCompleto(estudiante)).toEqual('Mauricio Cobarrubias Celedón')
  })

  it('método "visualizarRun" funciona correctamente', () => {
    expect(wrapper.vm.visualizarRun('12345678-9')).toEqual('12.345.678-9')
  })

  it('método "obtenerEstudiantes" funciona correctamente', async () => {
    wrapper.vm.obtenerEstudiantes()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaEstudiantes).toEqual(estudiantes)
    expect(wrapper.vm.mostrarLista).toBeTruthy()
  })

  it('método "nuevoEstudiante" funciona correctamente', () => {
    const wrapper = shallowMount(GestionEstudiantes, {
      data() {
        return {
          estudiante: {
            usuario: {
              nombre: 'Mauricio',
              apellido_paterno: 'Cobarrubias',
              apellido_materno: 'Celedón',
              run: '1345633-9',
              email: 'mauricio.cobarrubias@gmail.com'
            },
            seccion_id: 62345234
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.nuevoEstudiante()
    expect(wrapper.vm.estudiante.usuario.nombre).toEqual('')
    expect(wrapper.vm.estudiante.usuario.apellido_paterno).toEqual('')
    expect(wrapper.vm.estudiante.usuario.apellido_materno).toEqual('')
    expect(wrapper.vm.estudiante.usuario.run).toEqual('')
    expect(wrapper.vm.estudiante.usuario.email).toEqual('')
    expect(wrapper.vm.estudiante.seccion_id).toEqual(null)
  })

  it('método "agregarEstudiante" funciona correctamente', () => {
    const wrapper = shallowMount(GestionEstudiantes, {
      data() {
        return {
          estudiante: {
            usuario: {
              nombre: 'Mauricio',
              apellido_paterno: 'Cobarrubias',
              apellido_materno: 'Celedón',
              run: '1345633-9',
              email: 'mauricio.cobarrubias@gmail.com'
            },
            seccion_id: 62345234
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.agregarEstudiante()
    expect(wrapper.vm.verFormulario).toBeTruthy()
    expect(wrapper.vm.estudiante.usuario.nombre).toEqual('')
    expect(wrapper.vm.estudiante.usuario.apellido_paterno).toEqual('')
    expect(wrapper.vm.estudiante.usuario.apellido_materno).toEqual('')
    expect(wrapper.vm.estudiante.usuario.run).toEqual('')
    expect(wrapper.vm.estudiante.usuario.email).toEqual('')
    expect(wrapper.vm.estudiante.seccion_id).toEqual(null)
  })

  it('método "existeEstudiante" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(GestionEstudiantes, {
      data() {
        return {
          estudiante: {
            usuario: {
              nombre: 'Mauricio',
              apellido_paterno: 'Cobarrubias',
              apellido_materno: 'Celedón',
              run: '1345633-9',
              email: 'mauricio.cobarrubias@gmail.com'
            },
            seccion_id: 62345234
          },
          listaEstudiantes: [
            {run_est: '62345345-k'},
            {run_est: '62456624-2'},
            {run_est: '1345633-9'}
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.existeEstudiante()).toBeTruthy()
    expect(wrapper.vm.runEntrada.error).toBeTruthy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual(wrapper.vm.mensajes.run_repetido)
  })

  it('método "existeEstudiante" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(GestionEstudiantes, {
      data() {
        return {
          estudiante: {
            usuario: {
              nombre: 'Mauricio',
              apellido_paterno: 'Cobarrubias',
              apellido_materno: 'Celedón',
              run: '1345633-9',
              email: 'mauricio.cobarrubias@gmail.com'
            },
            seccion_id: 62345234
          },
          listaEstudiantes: [
            {run_est: '62345345-k'},
            {run_est: '62456624-2'}
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.existeEstudiante()).toBeFalsy()
    expect(wrapper.vm.runEntrada.error).toBeFalsy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual('')
  })

  it('método "agregar" funciona correctamente para estudiante nuevo', async () => {
    wrapper.vm.estudiante = nuevoEstudiante
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.actualizarEstudiante).toBeFalsy()
    expect(wrapper.vm.existeEstudiante()).toBeFalsy()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaEstudiantes).toEqual(estudiantes)
  })

  it('método "agregar" funciona correctamente con estudiante existente', async () => {
    wrapper.vm.estudiante = nuevoEstudiante
    wrapper.vm.obtenerEstudiantes()
    await wrapper.vm.$nextTick()
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.actualizarEstudiante).toBeFalsy()
    expect(wrapper.vm.existeEstudiante()).toBeTruthy()
    expect(wrapper.vm.listaEstudiantes).toEqual(estudiantes)
  })

  it('método "agregar" funciona correctamente con actualización de estudiante', async () => {
    debugger
    wrapper.vm.estudiante = nuevoEstudiante
    wrapper.vm.actualizarEstudiante = true
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaEstudiantes).toEqual(estudiantes)
  })

  it('método "noAgregar" funciona correctamente', () => {
    const wrapper = shallowMount(GestionEstudiantes, {
      data() {
        return {
          estudiante: {
            usuario: {
              nombre: 'Mauricio',
              apellido_paterno: 'Cobarrubias',
              apellido_materno: 'Celedón',
              run: '1345633-9',
              email: 'mauricio.cobarrubias@gmail.com'
            },
            seccion_id: 62345234
          },
          verFormulario: true,
          nombreEntrada: {error: true},
          apellidoMaternoEntrada: {error: true},
          apellidoMaternoEntrada: {error: true},
          runEntrada: {error: true},
          emailEntrada: {error: true},
          seccionEntrada: true
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.noAgregar()
    expect(wrapper.vm.estudiante.usuario.nombre).toEqual('')
    expect(wrapper.vm.estudiante.usuario.apellido_paterno).toEqual('')
    expect(wrapper.vm.estudiante.usuario.apellido_materno).toEqual('')
    expect(wrapper.vm.estudiante.usuario.run).toEqual('')
    expect(wrapper.vm.estudiante.usuario.email).toEqual('')
    expect(wrapper.vm.estudiante.seccion_id).toEqual(null)
    expect(wrapper.vm.verFormulario).toBeFalsy()
    expect(wrapper.vm.nombreEntrada.error).toBeFalsy()
    expect(wrapper.vm.apellidoPaternoEntrada.error).toBeFalsy()
    expect(wrapper.vm.apellidoMaternoEntrada.error).toBeFalsy()
    expect(wrapper.vm.runEntrada.error).toBeFalsy()
    expect(wrapper.vm.emailEntrada.error).toBeFalsy()
    expect(wrapper.vm.seccionEntrada).toBeFalsy()
  })

  it('método "validarNombre" funciona correctamente con nombre igual a "null"', () => {
    wrapper.vm.estudiante.usuario.nombre = null
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.nombreEntrada.error).toBeTruthy()
    expect(wrapper.vm.nombreEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre ""', () => {
    wrapper.vm.estudiante.usuario.nombre = ''
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.nombreEntrada.error).toBeTruthy()
    expect(wrapper.vm.nombreEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre "undefined"', () => {
    wrapper.vm.estudiante.usuario.nombre = undefined
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.nombreEntrada.error).toBeTruthy()
    expect(wrapper.vm.nombreEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre distinto de "regExp"', () => {
    wrapper.vm.estudiante.usuario.nombre = 'Carolina14963##&$'
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.nombreEntrada.error).toBeTruthy()
    expect(wrapper.vm.nombreEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarNombre" funciona correctamente con nombre con "regExp" correcto', () => {
    wrapper.vm.estudiante.usuario.nombre = 'Fernanda'
    expect(wrapper.vm.validarNombre()).toBeTruthy()
    expect(wrapper.vm.nombreEntrada.error).toBeFalsy()
    expect(wrapper.vm.nombreEntrada.mensaje).toEqual('')
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a "null"', () => {
    wrapper.vm.estudiante.usuario.apellido_paterno = null
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.apellidoPaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoPaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a "undefined"', () => {
    wrapper.vm.estudiante.usuario.apellido_paterno = undefined
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.apellidoPaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoPaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a ""', () => {
    wrapper.vm.estudiante.usuario.apellido_paterno = ''
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.apellidoPaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoPaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno distinto de "regExp"', () => {
    wrapper.vm.estudiante.usuario.apellido_paterno = 'C@stro#45'
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.apellidoPaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoPaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno con "regExp" correcto', () => {
    wrapper.vm.estudiante.usuario.apellido_paterno = 'Castro'
    expect(wrapper.vm.validarApellidoP()).toBeTruthy()
    expect(wrapper.vm.apellidoPaternoEntrada.error).toBeFalsy()
    expect(wrapper.vm.apellidoPaternoEntrada.mensaje).toEqual('')
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a "null"', () => {
    wrapper.vm.estudiante.usuario.apellido_materno = null
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.apellidoMaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoMaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a "undefined"', () => {
    wrapper.vm.estudiante.usuario.apellido_materno = undefined
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.apellidoMaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoMaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a ""', () => {
    wrapper.vm.estudiante.usuario.apellido_materno = ''
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.apellidoMaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoMaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno distinto de "regExp"', () => {
    wrapper.vm.estudiante.usuario.apellido_materno = 'Gaeg"&3kasisr'
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.apellidoMaternoEntrada.error).toBeTruthy()
    expect(wrapper.vm.apellidoMaternoEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno con "regExp" correcto', () => {
    wrapper.vm.estudiante.usuario.apellido_materno = 'Mendez'
    expect(wrapper.vm.validarApellidoM()).toBeTruthy()
    expect(wrapper.vm.apellidoMaternoEntrada.error).toBeFalsy()
    expect(wrapper.vm.apellidoMaternoEntrada.mensaje).toEqual('')
  })

  it('método "validarEmail" funciona correctamente con email igual a "null"', () => {
    wrapper.vm.estudiante.usuario.email = null
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.emailEntrada.error).toBeTruthy()
    expect(wrapper.vm.emailEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email igual a "undefined"', () => {
    wrapper.vm.estudiante.usuario.email = undefined
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.emailEntrada.error).toBeTruthy()
    expect(wrapper.vm.emailEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email igual a ""', () => {
    wrapper.vm.estudiante.usuario.email = ''
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.emailEntrada.error).toBeTruthy()
    expect(wrapper.vm.emailEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email distinto a "regExp"', () => {
    wrapper.vm.estudiante.usuario.email = '&3kasti,6ka0ds9gaib9asr.b9as025'
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.emailEntrada.error).toBeTruthy()
    expect(wrapper.vm.emailEntrada.mensaje).toEqual(wrapper.vm.mensajes.correo_mal)
  })

  it('método "validarEmail" funciona correctamente con email con dos "@"', () => {
    wrapper.vm.estudiante.usuario.email = 'sebastian@ingenieria.cl@usach.com'
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.emailEntrada.error).toBeTruthy()
    expect(wrapper.vm.emailEntrada.mensaje).toEqual(wrapper.vm.mensajes.correo_mal)
  })

  it('método "validarEmail" funciona correctamente con email sin "@usach.cl"', () => {
    wrapper.vm.estudiante.usuario.email = 'gonzalo.dominguez@gmail.com'
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.emailEntrada.error).toBeTruthy()
    expect(wrapper.vm.emailEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_usach)
  })

  it('método "validarEmail" funciona correctamente con email con "regExp" correcto', () => {
    wrapper.vm.estudiante.usuario.email = 'gonzalo.dominguez@usach.cl'
    expect(wrapper.vm.validarEmail()).toBeTruthy()
    expect(wrapper.vm.emailEntrada.error).toBeFalsy()
    expect(wrapper.vm.emailEntrada.mensaje).toEqual('')
  })

  it('método "validarRun" funciona correctamente con run igual a "null"', () => {
    wrapper.vm.estudiante.usuario.run = null
    expect(wrapper.vm.validarRun()).toBeFalsy()
    expect(wrapper.vm.runEntrada.error).toBeTruthy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_run)
  })

  it('método "validarRun" funciona correctamente con run igual a "undefined"', () => {
    wrapper.vm.estudiante.usuario.run = undefined
    expect(wrapper.vm.validarRun()).toBeFalsy()
    expect(wrapper.vm.runEntrada.error).toBeTruthy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_run)
  })

  it('método "validarRun" funciona correctamente con run igual a ""', () => {
    wrapper.vm.estudiante.usuario.run = ''
    expect(wrapper.vm.validarRun()).toBeFalsy()
    expect(wrapper.vm.runEntrada.error).toBeTruthy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual(wrapper.vm.mensajes.sin_run)
  })

  it('método "validarRun" funciona correctamente con run distinto a "regExp"', () => {
    wrapper.vm.estudiante.usuario.run = '19sler0-9345'
    expect(wrapper.vm.validarRun()).toBeFalsy()
    expect(wrapper.vm.runEntrada.error).toBeTruthy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual(wrapper.vm.mensajes.run_error)
  })

  it('método "validarRun" funciona correctamente con run con dígito verificador erróneo', () => {
    wrapper.vm.estudiante.usuario.run = '11223344-8'
    expect(wrapper.vm.validarRun()).toBeFalsy()
    expect(wrapper.vm.runEntrada.error).toBeTruthy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual(wrapper.vm.mensajes.run_error)
  })

  it('método "validarRun" funciona correctamente con run con dígito verificador correcto', () => {
    wrapper.vm.estudiante.usuario.run = '11223344-K'
    expect(wrapper.vm.validarRun()).toBeTruthy()
    expect(wrapper.vm.runEntrada.error).toBeFalsy()
    expect(wrapper.vm.runEntrada.mensaje).toEqual('')
  })

  it('método "validarSeccion" funciona correctamente con seccion igual a "null"', () => {
    wrapper.vm.estudiante.seccion_id = null
    expect(wrapper.vm.validarSeccion()).toBeFalsy()
    expect(wrapper.vm.seccionEntrada).toBeTruthy()
  })

  it('método "validarSeccion" funciona correctamente con seccion igual a "undefined"', () => {
    wrapper.vm.estudiante.seccion_id = undefined
    expect(wrapper.vm.validarSeccion()).toBeFalsy()
    expect(wrapper.vm.seccionEntrada).toBeTruthy()
  })

  it('método "validarSeccion" funciona correctamente con seccion igual a ""', () => {
    wrapper.vm.estudiante.seccion_id = ''
    expect(wrapper.vm.validarSeccion()).toBeFalsy()
    expect(wrapper.vm.seccionEntrada).toBeTruthy()
  })

  it('método "validarSeccion" funciona correctamente con seccion igual a cero', () => {
    wrapper.vm.estudiante.seccion_id = 0
    expect(wrapper.vm.validarSeccion()).toBeFalsy()
    expect(wrapper.vm.seccionEntrada).toBeTruthy()
  })

  it('método "validarSeccion" funciona correctamente con seccion mayor a cero', () => {
    wrapper.vm.estudiante.seccion_id = 92453
    expect(wrapper.vm.validarSeccion()).toBeTruthy()
    expect(wrapper.vm.seccionEntrada).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(GestionEstudiantes, {
      data() {
        return {
          estudiante: {
            usuario: {
              nombre: 'Mauricio',
              apellido_paterno: 'Cobarrubias',
              apellido_materno: 'Celedón',
              run: '1345633-9',
              email: 'mauricio.cobarrubias@gmail.com'
            },
            seccion_id: 62345234
          },
          listaEstudiantes: [
            {run_est: '62345345-k'},
            {run_est: '62456624-2'}
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarFormulario()).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(GestionEstudiantes, {
      data() {
        return {
          estudiante: {
            usuario: {
              nombre: 'Mauricio',
              apellido_paterno: 'Cobarrubias',
              apellido_materno: 'Celedón',
              run: '13456334-6',
              email: 'mauricio.cobarrubias@usach.cl'
            },
            seccion_id: 62345234
          },
          listaEstudiantes: [
            {run_est: '62345345-k'},
            {run_est: '62456624-2'}
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarFormulario()).toBeTruthy()
  })

  it('método "seleccionarTodos" funciona correctamente con "selección de todos"', () => {
    wrapper.vm.listaEstudiantes = listaEstudiantes
    wrapper.vm.eliminados = [9534]
    wrapper.vm.seleccionarTodos()
    expect(wrapper.vm.eliminados).toEqual([29353, 9534, 926364])
  })

  it('método "seleccionarTodos" funciona correctamente con "deselección"', () => {
    wrapper.vm.listaEstudiantes = listaEstudiantes
    wrapper.vm.eliminados = [29353, 9534, 926364]
    wrapper.vm.seleccionarTodos()
    expect(wrapper.vm.eliminados).toEqual([])
  })

  it('método "eliminarEstudiantes" funciona correctamente', () => {
    wrapper.vm.notificar = null
    wrapper.vm.eliminarEstudiantes()
    expect(wrapper.vm.notificar).toBeTruthy()
  })

  it('método "cancelarEliminacion" funciona correctamente', () => {
    wrapper.vm.notificar = null
    wrapper.vm.cancelarEliminacion()
    expect(wrapper.vm.notificar).toBeFalsy()
  })

  it('método "confirmarEliminacion" funcioan correctamente', async () => {
    wrapper.vm.eliminados = [29353, 9534, 926364]
    wrapper.vm.notificar = true
    wrapper.vm.confirmarEliminacion()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.notificar).toBeFalsy()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaEstudiantes).toEqual(estudiantes)
    expect(wrapper.vm.eliminados).toEqual([])
  })

  it('método "cargarNomina" funciona correctamente', () => {
    wrapper.vm.cargarNomina()
    expect(wrapper.vm.mostrarNomina).toBeTruthy()
  })

  // Faltan test unitarios a manejo de archivos

  it('método "enviarArchivo" funciona correctamente', async () => {
    wrapper.vm.archivo = 'Archivo de prueba'
    wrapper.vm.estudiante.seccion_id = 94534
    wrapper.vm.mostrarNomina = true
    wrapper.vm.nombreArchivo = 'prueba.txt'
    wrapper.vm.agregaArchivo = true
    wrapper.vm.enviarArchivo()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaEstudiantes).toEqual(estudiantes)
    expect(wrapper.vm.mostrarNomina).toBeFalsy()
    expect(wrapper.vm.estudiante.seccion_id).toEqual(null)
    expect(wrapper.vm.archivo).toEqual('')
    expect(wrapper.vm.nombreArchivo).toEqual('No se ha subido el archivo')
    expect(wrapper.vm.agregaArchivo).toBeFalsy()
  })

  it('método "limpiarNomina" funciona correctamente',  () => {
    wrapper.vm.mostrarNomina = true
    wrapper.vm.estudiante.seccion_id = 234
    wrapper.vm.archivo = 'Archivo de prueba'
    wrapper.vm.nombreArchivo = 'prueba.txt'
    wrapper.agregaArchivo = true
    wrapper.vm.limpiarNomina()
    expect(wrapper.vm.mostrarNomina).toBeFalsy()
    expect(wrapper.vm.estudiante.seccion_id).toEqual(null)
    expect(wrapper.vm.archivo).toEqual('')
    expect(wrapper.vm.nombreArchivo).toEqual('No se ha subido el archivo')
    expect(wrapper.vm.agregaArchivo).toBeFalsy()
  })

  it('método "validarArchivo" funciona correctamente con "archivo" igual a "null"', () => {
    wrapper.vm.archivo = null
    expect(wrapper.vm.validarArchivo()).toBeFalsy()
    expect(wrapper.vm.agregaArchivo).toBeTruthy()
  })

  it('método "validarArchivo" funciona correctamente con "archivo" igual a "undefined"', () => {
    wrapper.vm.archivo = undefined
    expect(wrapper.vm.validarArchivo()).toBeFalsy()
    expect(wrapper.vm.agregaArchivo).toBeTruthy()
  })

  it('método "validarArchivo" funciona correctamente con "archivo" igual a ""', () => {
    wrapper.vm.archivo = ''
    expect(wrapper.vm.validarArchivo()).toBeFalsy()
    expect(wrapper.vm.agregaArchivo).toBeTruthy()
  })

  it('método "validarArchivo" funciona correctamente con "archivo" distinto a ""', () => {
    wrapper.vm.archivo = 'Archivo de prueba'
    expect(wrapper.vm.validarArchivo()).toBeTruthy()
    expect(wrapper.vm.agregaArchivo).toBeFalsy()
  })

  it('método "validarIngresoNomina" funciona correctamente con "true"', () => {
    wrapper.vm.estudiante.seccion_id = 92453
    wrapper.vm.archivo = 'Archivo.de prueba'
    expect(wrapper.vm.validarIngresoNomina()).toBeTruthy()
  })

  it('método "validarIngresoNomina" funciona correctamente con "false"', () => {
    wrapper.vm.estudiante.seccion_id = 92453
    wrapper.vm.archivo = ''
    expect(wrapper.vm.validarIngresoNomina()).toBeFalsy()
  })

  // Falta test unitario a método 'obtenerPlantilla'

  it('método "buscarIdSeccion" funciona correctamente con código existente', async () => {
    wrapper.vm.obtenerSecciones()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.buscarIdSeccion('A1')).toEqual(secciones[0].id)
  })

  it('método "buscarIdSeccion" funciona correctamente con código inexistente', async () => {
    wrapper.vm.obtenerSecciones()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.buscarIdSeccion('P21')).toEqual(0)
  })

  it('método "cargarEstudiante" funciona correctamente', async () => {
    wrapper.vm.obtenerSecciones()
    await wrapper.vm.$nextTick()
    wrapper.vm.cargarEstudiante(estudiantes[1])
    expect(wrapper.vm.estudiante.id).toEqual(estudiantes[1].id)
    expect(wrapper.vm.estudiante.usuario.nombre).toEqual(estudiantes[1].nombre_est)
    expect(wrapper.vm.estudiante.usuario.apellido_paterno).toEqual(estudiantes[1].apellido1)
    expect(wrapper.vm.estudiante.usuario.apellido_materno).toEqual(estudiantes[1].apellido2)
    expect(wrapper.vm.estudiante.usuario.run).toEqual(estudiantes[1].run_est)
    expect(wrapper.vm.estudiante.usuario.email).toEqual(estudiantes[1].correo)
    expect(wrapper.vm.estudiante.seccion_id).toEqual(secciones[1].id)
    expect(wrapper.vm.actualizarEstudiante).toBeTruthy()
    expect(wrapper.vm.verFormulario).toBeTruthy()
  })
})
