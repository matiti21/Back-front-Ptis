import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import GestionProfesores from '@/components/GestionProfesores.vue'

// Variables globales
const idProfesor = 6234534

const listaProfesores = [
  {
    id: 62345,
    usuario: {
      id: 23463,
      nombre: 'José',
      apellido_paterno: 'Venegas',
      apellido_materno: 'Cepeda',
      email: 'jose.venegas@algo.com'
    },
    secciones: [
      {
        id: 934345,
        codigo: 'A1',
        jornada: {
          id: 81345,
          nombre: 'Diurna',
          identificador: 1
        }
      }
    ]
  },
  {
    id: idProfesor,
    usuario: {
      nombre: 'Daniel',
      apellido_paterno: 'Castro',
      apellido_materno: 'Zamorano',
      email: 'daniel.castro@algo.com'
    },
    secciones: [
      {
        id: 45348,
        codigo: 'V21',
        jornada: {
          id: 1453,
          nombre: 'Vespertina',
          identificador: 2
        }
      }
    ]
  }
]

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

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      secciones: secciones
    }
  },
  mutations: {
    setSecciones (state, valor) {
      state.secciones = valor
    }
  }
})

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/profesores':
      return Promise.resolve({data: listaProfesores})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/profesores':
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.put.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/profesores/' + idProfesor:
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('GestionProfesores.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(GestionProfesores, {
      global: {
        plugins: [store]
      }
    })
  })

  it('variable verFormulario se inicializa correctamente', () => {
    expect(wrapper.vm.verFormulario).toBeFalsy()
  })

  it('variable usuario se inicializa correctamente', () => {
    const esperado = {
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      email: ''
    }
    expect(wrapper.vm.usuario).toEqual(esperado)
  })

  it('variable seccionesAsignadas se inicializa correctamente', () => {
    expect(wrapper.vm.seccionesAsignadas).toEqual([])
  })

  it('variable listaProfesores se inicializa correctamente', () => {
    expect(wrapper.vm.listaProfesores).toEqual([])
  })

  it('variable entradas se inicializa correctamente', () => {
    const esperado = {
      nombre: {error: false, mensaje: ''},
      apellidoPaterno: {error: false, mensaje: ''},
      apellidoMaterno: {error: false, mensaje: ''},
      correo_elec: {error: false, mensaje: ''},
      secciones: false
    }
    expect(wrapper.vm.entradas).toEqual(esperado)
  })

  it('variable mensajes se inicializa correctamente', () => {
    const esperado = {
      sin_nombre: 'Debe ingresar el nombre del/la profesor/a',
      sin_apellido: 'Debe ingresar el apellido del/la profesor/a',
      sin_correo: 'Debe ingresar el correo electrónico del/la profesor/a',
      sin_especiales: 'Sólo letras. Verificar que no tenga caracteres especiales',
      correo_mal: 'El correo ingresado no es válido',
      correo_repetido: 'El correo ingresado ya se encuentra en el sistema'
    }
    expect(wrapper.vm.mensajes).toEqual(esperado)
  })

  it('variable "actualizarProfesor" se inicializa correctamente', () => {
    expect(wrapper.vm.actualizarProfesor).toBeFalsy()
  })

  it('variable "idProfesor" se inicializa correctamente', () => {
    expect(wrapper.vm.idProfesor).toEqual(0)
  })

  it('propiedad computada "mostrarLista" funciona correctamente con "true"', () => {
    expect(wrapper.vm.mostrarLista).toBeTruthy()
  })

  it('propiedad computada "mostrarLista" funciona correctamente con "false"', () => {
    wrapper.vm.$store.commit('setSecciones', [])
    expect(wrapper.vm.mostrarLista).toBeFalsy()
  })

  it('propiedad computada mostrarProfesores funciona correctamente con true', () => {
    const wrapper = shallowMount(GestionProfesores, {
      data() {
        return {
          listaProfesores: [
            {id: 1, secciones: [{
              id: 2,
              codigo: 'V21',
              jornada: { id: 2, nombre: 'Vespertina'}
            }],
            usuario: {
              id: 2,
              nombre: 'Elizabeth',
              apellido_paterno: 'Inostroza',
              apellido_materno: 'Del Solar',
              email: 'elizabeth.inostroza@gmail.com'
            }
          },
            {id: 2, secciones: [{
              id: 1,
              codigo: 'V35',
              jornada: { id: 1, nombre: 'Diurna'}
            }],
            usuario: {
              id: 3,
              nombre: 'Pedro',
              apellido_paterno: 'Garmendia',
              apellido_materno: 'Soto',
              email: 'pedro.garmendia@gmail.com'
            }
          }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarProfesores).toBeTruthy()
  })

  it('propiedad computada mostrarProfesores funciona correctamente con false', () => {
    expect(wrapper.vm.mostrarProfesores).toBeFalsy()
  })

  it('método nombreCompleto funciona correctamente', () => {
    const profesor = {
      nombre: 'Mateo',
      apellido_paterno: 'Iglesias',
      apellido_materno: 'Del Campo'
    }
    expect(wrapper.vm.nombreCompleto(profesor)).toEqual('Mateo Iglesias Del Campo')
  })

  it('método agregarProfesor funciona correctamente', () => {
    wrapper.vm.agregarProfesor()
    expect(wrapper.vm.verFormulario).toBeTruthy()
  })

  it('método nuevoProfesor funciona correctamente', () => {
    const wrapper = shallowMount(GestionProfesores, {
      data() {
        return {
          usuario: {
            nombre: 'Mateo',
            apellido_paterno: 'Iglesias',
            apellido_paterno: 'Del Campo',
            email: 'mateo.iglesias@gmail.com'
          },
          seccionesAsignadas: [1, 2]
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.nuevoProfesor()
    expect(wrapper.vm.usuario.nombre).toEqual('')
    expect(wrapper.vm.usuario.apellido_paterno).toEqual('')
    expect(wrapper.vm.usuario.apellido_materno).toEqual('')
    expect(wrapper.vm.usuario.email).toEqual('')
    expect(wrapper.vm.seccionesAsignadas).toEqual([])
  })

  it('método "obtenerProfesores" funciona correctamente', async () => {
    wrapper.vm.obtenerProfesores()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaProfesores).toEqual(listaProfesores)
  })

  // Falta 'agregar'
  it('método "agregar" funciona correctamente con nuevo profesor', async () => {
    wrapper.vm.verFormulario = true
    wrapper.vm.usuario = {
      nombre: 'Juan',
      apellido_paterno: 'Chacón',
      apellido_materno: 'Arévalo',
      email: 'juan.chacon@algo.com'
    }
    wrapper.vm.seccionesAsignadas = [146345, 614534, 161396, 9614]
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.actualizarProfesor).toBeFalsy()
    expect(wrapper.vm.listaProfesores).toEqual(listaProfesores)
    expect(wrapper.vm.verFormulario).toBeFalsy()
  })

  it('método "agregar" funciona correctamente con actualizar profesor', async () => {
    wrapper.vm.verFormulario = true
    wrapper.vm.usuario = {
      nombre: 'Juan',
      apellido_paterno: 'Chacón',
      apellido_materno: 'Arévalo',
      email: 'juan.chacon@algo.com'
    }
    wrapper.vm.seccionesAsignadas = [146345, 614534, 161396, 9614]
    wrapper.vm.idProfesor = idProfesor
    wrapper.vm.actualizarProfesor = true
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaProfesores).toEqual(listaProfesores)
    expect(wrapper.vm.actualizarProfesor).toBeFalsy()
    expect(wrapper.vm.idProfesor).toEqual(0)
    expect(wrapper.vm.verFormulario).toBeFalsy()
  })

  it('método "noAgregar" funciona correctamente', () => {
    wrapper.vm.verFormulario = true
    wrapper.vm.entradas.nombre.error = true
    wrapper.vm.entradas.apellidoPaterno.error = true
    wrapper.vm.entradas.apellidoMaterno.error = true
    wrapper.vm.entradas.correo_elec.error = true
    wrapper.vm.entradas.secciones = true
    wrapper.vm.noAgregar()
    expect(wrapper.vm.verFormulario).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoPaterno.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoMaterno.error).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeFalsy()
    expect(wrapper.vm.entradas.secciones).toBeFalsy()
  })

  it('método "validarNombre" funciona correctamente con nombre igual a "null"', () => {
    wrapper.vm.usuario.nombre = null
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre ""', () => {
    wrapper.vm.usuario.nombre = ''
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre "undefined"', () => {
    wrapper.vm.usuario.nombre = undefined
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre distinto de "regExp"', () => {
    wrapper.vm.usuario.nombre = 'Carolina14963##&$'
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarNombre" funciona correctamente con nombre con "regExp" correcto', () => {
    wrapper.vm.usuario.nombre = 'Fernanda'
    expect(wrapper.vm.validarNombre()).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.error).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual('')
  })

  it('método "validarApellido" funciona correctamente con apellido "null"', () => {
    var entradas = {
      error: null,
      mensaje: null
    }
    expect(wrapper.vm.validarApellido(null, entradas)).toBeFalsy()
    expect(entradas.error).toBeTruthy()
    expect(entradas.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellido" funciona correctamente con apellido "undefined"', () => {
    var entradas = {
      error: null,
      mensaje: null
    }
    expect(wrapper.vm.validarApellido(undefined, entradas)).toBeFalsy()
    expect(entradas.error).toBeTruthy()
    expect(entradas.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellido" funciona correctamente con apellido igual a ""', () => {
    var entradas = {
      error: null,
      mensaje: null
    }
    expect(wrapper.vm.validarApellido('', entradas)).toBeFalsy()
    expect(entradas.error).toBeTruthy()
    expect(entradas.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellido" funciona correctamente con apellido distinto de "regExp"', () => {
    var entradas = {
      error: null,
      mensaje: null
    }
    expect(wrapper.vm.validarApellido('#b@r$Tolomeo', entradas)).toBeFalsy()
    expect(entradas.error).toBeTruthy()
    expect(entradas.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarApellido" funciona correctamente con apellido con "regExp" correcto', () => {
    var entradas = {
      error: null,
      mensaje: null
    }
    expect(wrapper.vm.validarApellido('Faundez', entradas)).toBeTruthy()
    expect(entradas.error).toBeFalsy()
    expect(entradas.mensaje).toEqual('')
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a "null"', () => {
    wrapper.vm.usuario.apellido_paterno = null
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoPaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoPaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a "undefined"', () => {
    wrapper.vm.usuario.apellido_paterno = undefined
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoPaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoPaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a ""', () => {
    wrapper.vm.usuario.apellido_paterno = ''
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoPaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoPaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno distinto de "regExp"', () => {
    wrapper.vm.usuario.apellido_paterno = 'C@stro#45'
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoPaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoPaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno con "regExp" correcto', () => {
    wrapper.vm.usuario.apellido_paterno = 'Castro'
    expect(wrapper.vm.validarApellidoP()).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoPaterno.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoPaterno.mensaje).toEqual('')
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a "null"', () => {
    wrapper.vm.usuario.apellido_materno = null
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoMaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoMaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a "undefined"', () => {
    wrapper.vm.usuario.apellido_materno = undefined
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoMaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoMaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a ""', () => {
    wrapper.vm.usuario.apellido_materno = ''
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoMaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoMaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno distinto de "regExp"', () => {
    wrapper.vm.usuario.apellido_materno = 'Gaeg"&3kasisr'
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoMaterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoMaterno.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno con "regExp" correcto', () => {
    wrapper.vm.usuario.apellido_materno = 'Mendez'
    expect(wrapper.vm.validarApellidoM()).toBeTruthy()
    expect(wrapper.vm.entradas.apellidoMaterno.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellidoMaterno.mensaje).toEqual('')
  })

  it('método "validarEmail" funciona correctamente con email igual a "null"', () => {
    wrapper.vm.usuario.email = null
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email igual a "undefined"', () => {
    wrapper.vm.usuario.email = undefined
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email igual a ""', () => {
    wrapper.vm.usuario.email = ''
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email distinto a "regExp"', () => {
    wrapper.vm.usuario.email = '&3kasti,6ka0ds9gaib9asr.b9as025'
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.correo_mal)
  })

  it('método "validarEmail" funciona correctamente con email con dos "@"', () => {
    wrapper.vm.usuario.email = 'sebastian@ingenieria.cl@usach.com'
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.correo_mal)
  })

  it('método "validarEmail" funciona correctamente con email con "regExp" correcto', () => {
    wrapper.vm.usuario.email = 'gonzalo.dominguez@gmail.com'
    expect(wrapper.vm.validarEmail()).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual('')
  })

  it('método "validarSecciones" funciona correctamente con "true"', () => {
    wrapper.vm.seccionesAsignadas = [9603453, 69353945, 6943963, 92934534]
    expect(wrapper.vm.validarSecciones()).toBeTruthy()
    expect(wrapper.vm.entradas.secciones).toBeFalsy()
  })

  it('método "validarSecciones" funciona correctamente con "false"', () => {
    wrapper.vm.seccionesAsignadas = []
    expect(wrapper.vm.validarSecciones()).toBeFalsy()
    expect(wrapper.vm.entradas.secciones).toBeTruthy()
  })

  it('método "existeProfesor" funciona correctamente con true', () => {
    const usuario = {
      email: 'jose.venegas@algo.com'
    }
    wrapper.vm.listaProfesores = listaProfesores
    wrapper.vm.usuario = usuario
    expect(wrapper.vm.existeProfesor()).toBeTruthy()
  })

  it('método "existeProfesor" funciona correctamente con false', () => {
    const usuario = {
      email: 'maria.maldonado@algo.com'
    }
    wrapper.vm.listaProfesores = listaProfesores
    wrapper.vm.usuario = usuario
    expect(wrapper.vm.existeProfesor()).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente con "true"', () => {
    wrapper.vm.listaProfesores = listaProfesores
    wrapper.vm.usuario.nombre = 'Mateo'
    wrapper.vm.usuario.apellido_paterno = 'Concha'
    wrapper.vm.usuario.apellido_materno = 'Díaz'
    wrapper.vm.usuario.email = 'mateo.concha@udech.cl'
    wrapper.vm.seccionesAsignadas = [9534, 25633, 493046, 91363]
    expect(wrapper.vm.validarFormulario()).toBeTruthy()
  })

  it('método "validarFormulario" funciona correctamente con "false"', () => {
    wrapper.vm.listaProfesores = listaProfesores
    wrapper.vm.usuario.nombre = 'Mateo'
    wrapper.vm.usuario.apellido_paterno = undefined
    wrapper.vm.usuario.apellido_materno = 'Díaz'
    wrapper.vm.usuario.email = 'mateo.concha@udech.cl'
    wrapper.vm.seccionesAsignadas = []
    expect(wrapper.vm.validarFormulario()).toBeFalsy()
  })

  it('método "convertirSecciones" funciona correctamente', () => {
    const esperado = [934345, 45348]
    expect(wrapper.vm.convertirSecciones(secciones)).toEqual(esperado)
  })

  it('método "editarProfesor" funciona correctamente', () => {
    wrapper.vm.editarProfesor(listaProfesores[0])
    expect(wrapper.vm.usuario.nombre).toEqual('José')
    expect(wrapper.vm.usuario.apellido_paterno).toEqual('Venegas')
    expect(wrapper.vm.usuario.apellido_materno).toEqual('Cepeda')
    expect(wrapper.vm.usuario.email).toEqual('jose.venegas@algo.com')
    expect(wrapper.vm.idProfesor).toEqual(62345)
    expect(wrapper.vm.seccionesAsignadas).toEqual([934345])
    expect(wrapper.vm.actualizarProfesor).toBeTruthy()
    expect(wrapper.vm.verFormulario).toBeTruthy()
  })
})
