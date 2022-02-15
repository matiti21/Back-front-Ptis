import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import GestionClientes from '@/components/GestionClientes.vue'

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state () {
    return {
      apiUrl: apiUrl,
      jornadaActual: 'Diurna'
    }
  }
})

// Variables globales
const listaStakeholders = [
  {
    id: 6354,
    grupos: [{
      nombre: 'G01',
      jornada: 'Diurna'
    }],
    nombre: 'Juan',
    apellido_paterno: 'Garmendia',
    apellido_materno: 'Solis',
    email: 'juan.garmendia@algo.com'
  },
  {
    id: 6435343,
    grupos: [{
      nombre: 'G02',
      jornada: 'Vespertina'
    }],
    nombre: 'Mercedes',
    apellido_paterno: 'Hernandez',
    apellido_materno: 'Fuenzalida',
    email: 'mercedes.hernandes@algo.com'
  }
]

const idStakeholder = 1963434

const grupos = [
  {
    id: 346345,
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
    stakeholders: [
      {
        id: idStakeholder,
        iniciales: 'PGS',
        usuario: {
          nombre: 'Pedro',
          apellido_paterno: 'Garmendia',
          apellido_materno: 'Soto',
          email: 'pedro.garmendia@algo.com'
        }
      }
    ]
  },
  {
    id: 934534,
    nombre: 'G02',
    proyecto: 'Segundo proyecto',
    correlativo: 94,
    jornada: 'Vespertina',
    estudiantes: [{
      id: 146345,
      iniciales: 'PAG',
      usuario: {
        nombre: 'Patricio',
        apellido_paterno: 'Alvarez',
        apellido_materno: 'Gonzalez',
        run: '22333444-5',
        email: 'patricio.alvarez@algo.com'
      }
    }],
    stakeholders: [
      {
        id: idStakeholder,
        iniciales: 'PGS',
        usuario: {
          nombre: 'Pedro',
          apellido_paterno: 'Garmendia',
          apellido_materno: 'Soto',
          email: 'pedro.garmendia@algo.com'
        }
      }
    ]
  }
]

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/stakeholders/asignacion/grupos':
      return Promise.resolve({data: listaStakeholders})
    case apiUrl + '/grupos':
      return Promise.resolve({data: grupos})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/stakeholders':
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.patch.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/stakeholders/' + idStakeholder:
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('GestionClientes.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(GestionClientes, {
      global: {
        plugins: [store]
      }
    })
  })

  it('variable verFormulario se inicializa en false', () => {
    expect(wrapper.vm.verFormulario).toBeFalsy()
  })

  it('variable verAsignaciones se inicializa en false', () => {
    expect(wrapper.vm.verAsignaciones).toBeFalsy()
  })

  it('variable stakeholder se inicializa correctamente', () => {
    const esperado = {
      usuario: {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: ''
      },
      grupo_id: null
    }
    expect(wrapper.vm.stakeholder).toEqual(esperado)
  })

  it('variable listaStakeholders se inicializa vacía', () => {
    expect(wrapper.vm.listaStakeholders).toEqual([])
  })

  it('variable listaGrupos se inicializa correctamente', () => {
    expect(wrapper.vm.listaGrupos).toEqual([])
  })

  it('variable entradas se inicializa correctamente', () => {
    const esperado = {
      nombre: {
        error: false,
        mensaje: ''
      },
      apellido_paterno: {
        error: false,
        mensaje: ''
      },
      apellido_materno: {
        error: false,
        mensaje: ''
      },
      correo_elec: {
        error: false,
        mensaje: ''
      },
      grupo: false
    }
    expect(wrapper.vm.entradas).toEqual(esperado)
  })

  it('variable mensajes se inicializa correctamente', () => {
    const esperado = {
      sin_nombre: 'Debe ingresar el nombre del cliente',
      sin_apellido: 'Debe ingresar el apellido del cliente',
      sin_correo: 'Debe ingresar el correo electrónico del cliente',
      sin_especiales: 'Sólo letras. Verificar que no tenga caracteres especiales',
      correo_mal: 'El correo ingresado no es válido',
      correo_repetido: 'El correo ingresado ya se encuentra en el sistema'
    }
    expect(wrapper.vm.mensajes).toEqual(esperado)
  })

  it('variable "actualizarStakeholder" se inicializa correctamente', () => {
    expect(wrapper.vm.actualizarStakeholder).toBeFalsy()
  })

  it('variable "idStakeholder" se inicializa correctamente', () => {
    expect(wrapper.vm.idStakeholder).toEqual(0)
  })

  it('propiedad computada listaFiltrada funciona correctamente', () => {
    const wrapper = shallowMount(GestionClientes, {
      data() {
        return {
          listaGrupos: [
            {
              id: 4653,
              jornada: 'Diurna'
            },
            {
              id: 24534,
              jornada: 'Vespertina'
            }
          ],
          jornadaActual: 'Diurna'
        }
      },
      global: {
        plugins: [store]
      }
    })
    const esperado = [{
        id: 4653,
        jornada: 'Diurna'
    }]
    expect(wrapper.vm.listaFiltrada).toEqual(esperado)
  })

/*    Depende del 'state' */
  it('propiedad computada stakeholdersPorJornada funciona correctamente', () => {
    const wrapper = shallowMount(GestionClientes, {
      data() {
        return {
          listaStakeholders: [
            {
              id: 6354,
              grupos: [{
                nombre: 'G01',
                jornada: 'Diurna'
              }],
              nombre: 'Juan',
              apellido_paterno: 'Garmendia',
              apellido_materno: 'Solis',
              email: 'juan.garmendia@algo.com'
            },
            {
              id: 6435343,
              grupos: [{
                nombre: 'G02',
                jornada: 'Vespertina'
              }],
              nombre: 'Mercedes',
              apellido_paterno: 'Hernandez',
              apellido_materno: 'Fuenzalida',
              email: 'mercedes.hernandes@algo.com'
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    const esperado = [{
      id: 6354,
      grupos: [{
        nombre: 'G01',
        jornada: 'Diurna',
      }],
      nombre: 'Juan',
      apellido_paterno: 'Garmendia',
      apellido_materno: 'Solis',
      email: 'juan.garmendia@algo.com'
    }]
    expect(wrapper.vm.stakeholdersPorJornada).toEqual(esperado)
  })

  it('propiedad computada mostrarLista funciona correctamente con true', () => {
    wrapper.vm.listaStakeholders = listaStakeholders
    expect(wrapper.vm.mostrarLista).toBeTruthy()
  })

  it('propiedad computada mostrarLista funciona correctamente con false', () => {
    wrapper.vm.listaStakeholders = []
    expect(wrapper.vm.mostrarLista).toBeFalsy()
  })

  it('método nombreCompleto funciona correctamente', () => {
    const estudiante = {
      nombre: 'Juan',
      apellido_paterno: 'Gonzalez',
      apellido_materno: 'Soto'
    }
    expect(wrapper.vm.nombreCompleto(estudiante)).toEqual('Juan Gonzalez Soto')
  })

  it('método agregarCliente funciona correctamente', () => {
    wrapper.vm.agregarCliente()
    expect(wrapper.vm.verFormulario).toBeTruthy()
  })

  it('método nuevoStakeholder funciona correctamente', () => {
    const wrapper = shallowMount(GestionClientes, {
      data () {
        return {
          stakeholder: {
            usuario: {
              nombre: 'Pablo',
              apellido_paterno: 'Mestre',
              apellido_materno: 'Feliú',
              email: 'pablo.mestre@algo.com'
            },
            grupo_id: 543623
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.nuevoStakeholder()
    expect(wrapper.vm.stakeholder.usuario.nombre).toEqual('')
    expect(wrapper.vm.stakeholder.usuario.apellido_paterno).toEqual('')
    expect(wrapper.vm.stakeholder.usuario.apellido_materno).toEqual('')
    expect(wrapper.vm.stakeholder.usuario.email).toEqual('')
    expect(wrapper.vm.stakeholder.grupo_id).toEqual(null)
  })

  it('método "obtenerStakeholders" funciona correctamente', async () => {
    wrapper.vm.obtenerStakeholders()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaStakeholders).toEqual(listaStakeholders)
  })

  // test método 'agregar'
  it('método "agregar" funciona correctamente para crear un nuevo stakeholder', async () => {
    wrapper.vm.stakeholder = {
      usuario: {
        nombre: 'Mauricio',
        apellido_paterno: 'Soto',
        apellido_materno: 'Venegas',
        email: 'mauricio.soto@algo.com'
      },
      grupo_id: 14634
    }
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaStakeholders).toEqual(listaStakeholders)
    expect(wrapper.vm.actualizarStakeholder).toBeFalsy()
  })

  it('método "agregar" funciona correctamente para actualizar un stakeholder', async () => {
    wrapper.vm.stakeholder = {
      usuario: {
        nombre: 'Mauricio',
        apellido_paterno: 'Soto',
        apellido_materno: 'Venegas',
        email: 'mauricio.soto@algo.com'
      },
      grupo_id: 0
    }
    wrapper.vm.idStakeholder = idStakeholder
    wrapper.vm.actualizarStakeholder = true
    wrapper.vm.agregar()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaStakeholders).toEqual(listaStakeholders)
    expect(wrapper.vm.actualizarStakeholder).toBeFalsy()
    expect(wrapper.vm.idStakeholder).toEqual(0)
  })

  it('método noAgregar funciona correctamente', () => {
    const wrapper = shallowMount(GestionClientes, {
      data() {
        return {
          verFormulario: true,
          entradas: {
            nombre: {
              error: true
            },
            apellido_paterno: {
              error: true
            },
            apellido_materno: {
              error: true
            },
            correo_elec: {
              error: true
            },
            grupo: true
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.noAgregar()
    expect(wrapper.vm.verFormulario).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_paterno.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_materno.error).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeFalsy()
    expect(wrapper.vm.entradas.grupo).toBeFalsy()
    expect(wrapper.vm.actualizarStakeholder).toBeFalsy()
  })

  it('método "obtenerGrupos" funciona correctamente', async () => {
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaGrupos).toEqual(grupos)
  })

  it('método "validarNombre" funciona correctamente con nombre "null"', () => {
    wrapper.vm.stakeholder.usuario.nombre = null
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre ""', () => {
    wrapper.vm.stakeholder.usuario.nombre = ''
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre "undefined"', () => {
    wrapper.vm.stakeholder.usuario.nombre = undefined
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_nombre)
  })

  it('método "validarNombre" funciona correctamente con nombre distinto de "regExp"', () => {
    wrapper.vm.stakeholder.usuario.nombre = 'Carolina14963##&$'
    expect(wrapper.vm.validarNombre()).toBeFalsy()
    expect(wrapper.vm.entradas.nombre.error).toBeTruthy()
    expect(wrapper.vm.entradas.nombre.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarNombre" funciona correctamente con nombre con "regExp" correcto', () => {
    wrapper.vm.stakeholder.usuario.nombre = 'Fernanda'
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
    wrapper.vm.stakeholder.usuario.apellido_paterno = null
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_paterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_paterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a "undefined"', () => {
    wrapper.vm.stakeholder.usuario.apellido_paterno = undefined
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_paterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_paterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno igual a ""', () => {
    wrapper.vm.stakeholder.usuario.apellido_paterno = ''
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_paterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_paterno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno distinto de "regExp"', () => {
    wrapper.vm.stakeholder.usuario.apellido_paterno = 'C@stro#45'
    expect(wrapper.vm.validarApellidoP()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_paterno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_paterno.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarApellidoP" funciona correctamente con apellido_paterno con "regExp" correcto', () => {
    wrapper.vm.stakeholder.usuario.apellido_paterno = 'Castro'
    expect(wrapper.vm.validarApellidoP()).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_paterno.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_paterno.mensaje).toEqual('')
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a "null"', () => {
    wrapper.vm.stakeholder.usuario.apellido_materno = null
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_materno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_materno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a "undefined"', () => {
    wrapper.vm.stakeholder.usuario.apellido_materno = undefined
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_materno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_materno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno igual a ""', () => {
    wrapper.vm.stakeholder.usuario.apellido_materno = ''
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_materno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_materno.mensaje).toEqual(wrapper.vm.mensajes.sin_apellido)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno distinto de "regExp"', () => {
    wrapper.vm.stakeholder.usuario.apellido_materno = 'Gaeg"&3kasisr'
    expect(wrapper.vm.validarApellidoM()).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_materno.error).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_materno.mensaje).toEqual(wrapper.vm.mensajes.sin_especiales)
  })

  it('método "validarApellidoM" funciona correctamente con apellido_materno con "regExp" correcto', () => {
    wrapper.vm.stakeholder.usuario.apellido_materno = 'Mendez'
    expect(wrapper.vm.validarApellidoM()).toBeTruthy()
    expect(wrapper.vm.entradas.apellido_materno.error).toBeFalsy()
    expect(wrapper.vm.entradas.apellido_materno.mensaje).toEqual('')
  })

  it('método "validarEmail" funciona correctamente con email igual a "null"', () => {
    wrapper.vm.stakeholder.usuario.email = null
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email igual a "undefined"', () => {
    wrapper.vm.stakeholder.usuario.email = undefined
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email igual a ""', () => {
    wrapper.vm.stakeholder.usuario.email = ''
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.sin_correo)
  })

  it('método "validarEmail" funciona correctamente con email distinto a "regExp"', () => {
    wrapper.vm.stakeholder.usuario.email = '&3kasti,6ka0ds9gaib9asr.b9as025'
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.correo_mal)
  })

  it('método "validarEmail" funciona correctamente con email con dos "@"', () => {
    wrapper.vm.stakeholder.usuario.email = 'sebastian@ingenieria.cl@usach.com'
    expect(wrapper.vm.validarEmail()).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual(wrapper.vm.mensajes.correo_mal)
  })

  it('método "validarEmail" funciona correctamente con email con "regExp" correcto', () => {
    wrapper.vm.stakeholder.usuario.email = 'gonzalo.dominguez@gmail.com'
    expect(wrapper.vm.validarEmail()).toBeTruthy()
    expect(wrapper.vm.entradas.correo_elec.error).toBeFalsy()
    expect(wrapper.vm.entradas.correo_elec.mensaje).toEqual('')
  })

  it('método "validarGrupo" funciona correctamente para valor "null"', () => {
    wrapper.vm.stakeholder.grupo_id = null
    expect(wrapper.vm.validarGrupo()).toBeFalsy()
    expect(wrapper.vm.entradas.grupo).toBeTruthy()
  })

  it('método "validarGrupo" funciona correctamente para valor "undefined"', () => {
    wrapper.vm.stakeholder.grupo_id = undefined
    expect(wrapper.vm.validarGrupo()).toBeFalsy()
    expect(wrapper.vm.entradas.grupo).toBeTruthy()
  })

  it('método "validarGrupo" funciona correctamente para valor ""', () => {
    wrapper.vm.stakeholder.grupo_id = ''
    expect(wrapper.vm.validarGrupo()).toBeFalsy()
    expect(wrapper.vm.entradas.grupo).toBeTruthy()
  })

  it('método "validarGrupo" funciona correctamente para valor igual a "0"', () => {
    wrapper.vm.stakeholder.grupo_id = 0
    expect(wrapper.vm.validarGrupo()).toBeFalsy()
    expect(wrapper.vm.entradas.grupo).toBeTruthy()
  })

  it('método "validarGrupo" funciona correctamente para valor correcto', () => {
    wrapper.vm.stakeholder.grupo_id = 64245
    expect(wrapper.vm.validarGrupo()).toBeTruthy()
    expect(wrapper.vm.entradas.grupo).toBeFalsy()
  })

  it('método existeStakeholder funciona correctamente con true', () => {
    const cliente = {
      usuario: {
        email: 'juan.garmendia@algo.com'
      }
    }
    wrapper.vm.listaStakeholders = listaStakeholders
    wrapper.vm.stakeholder = cliente
    expect(wrapper.vm.existeStakeholder()).toBeTruthy()
  })

  it('método existeStakeholder funciona correctamente con false', () => {
    const cliente = {
      usuario: {
        email: 'maria.maldonado@algo.com'
      }
    }
    wrapper.vm.listaStakeholders = listaStakeholders
    wrapper.vm.stakeholder = cliente
    expect(wrapper.vm.existeStakeholder()).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente con "true"', () => {
    wrapper.vm.listaStakeholders = listaStakeholders
    wrapper.vm.stakeholder.usuario.nombre = 'Mateo'
    wrapper.vm.stakeholder.usuario.apellido_paterno = 'Concha'
    wrapper.vm.stakeholder.usuario.apellido_materno = 'Díaz'
    wrapper.vm.stakeholder.usuario.email = 'mateo.concha@udech.cl'
    wrapper.vm.stakeholder.grupo_id = 9534
    expect(wrapper.vm.validarFormulario()).toBeTruthy()
  })

  it('método "validarFormulario" funciona correctamente con "false"', () => {
    wrapper.vm.listaStakeholders = listaStakeholders
    wrapper.vm.stakeholder.usuario.nombre = 'Mateo'
    wrapper.vm.stakeholder.usuario.apellido_paterno = undefined
    wrapper.vm.stakeholder.usuario.apellido_materno = 'Díaz'
    wrapper.vm.stakeholder.usuario.email = 'mateo.concha@udech.cl'
    wrapper.vm.stakeholder.grupo_id = 9534
    expect(wrapper.vm.validarFormulario()).toBeFalsy()
  })

  it('método "editarAsignaciones" funciona correctamente', () => {
    wrapper.vm.verAsignaciones = false
    wrapper.vm.editarAsignaciones()
    expect(wrapper.vm.verAsignaciones).toBeTruthy()
  })

  it('método "cerrarAsignaciones" funciona correctamente', () => {
    wrapper.vm.verAsignaciones = true
    wrapper.vm.cerrarAsignaciones()
    expect(wrapper.vm.verAsignaciones).toBeFalsy()
  })

  it('método "actualizarAsignaciones" funciona correctamente', async () => {
    wrapper.vm.verAsignaciones = true
    wrapper.vm.actualizarAsignaciones()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verAsignaciones).toBeFalsy()
  })

  it('método "editarStakeholder" funciona correctamente', () => {
    wrapper.vm.editarStakeholder(listaStakeholders[0])
    expect(wrapper.vm.actualizarStakeholder).toBeTruthy()
    expect(wrapper.vm.idStakeholder).toEqual(listaStakeholders[0].id)
    expect(wrapper.vm.stakeholder.usuario.nombre).toEqual(listaStakeholders[0].nombre)
    expect(wrapper.vm.stakeholder.usuario.apellido_paterno).toEqual(listaStakeholders[0].apellido_paterno)
    expect(wrapper.vm.stakeholder.usuario.apellido_materno).toEqual(listaStakeholders[0].apellido_materno)
    expect(wrapper.vm.stakeholder.usuario.email).toEqual(listaStakeholders[0].email)
    expect(wrapper.vm.stakeholder.grupo_id).toEqual(0)
    expect(wrapper.vm.verFormulario).toBeTruthy()
  })
})
