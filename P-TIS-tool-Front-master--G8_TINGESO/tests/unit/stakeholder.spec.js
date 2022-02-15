import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import Stakeholder from '@/components/views/Stakeholder.vue'

const apiUrl = '127.0.0.1:3000'

// Mock store
const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      usuario: {
        id: 345,
        nombre: 'Manuel',
        apellido_paterno: 'Aravena',
        apellido_materno: 'Hernandez',
        run: '12345678-9',
        email: 'manuel.aravena@algo.com',
        rol_id: 6493,
        rol: {
          id: 6493,
          rol: 'Stakeholder',
          rango: 4
        }
      },
      stakeholder: {},
      grupo: {},
      jornadaActual: 'Diurna',
      tipoAprobaciones: []
    }
  },
  mutations: {
    setStakeholder(state, valor) {
      state.stakeholder = valor
    },
    setGrupo(state, valor) {
      state.grupo = valor
    },
    setTipoAprobaciones(state, valor) {
      state.tipoAprobaciones = valor
    },
    setJornadaActual(state, valor) {
      state.jornadaActual = valor
    }
  }
})

// Variables globales
const stakeholder = {
  id: 964,
  iniciales: 'MAH',
  usuario_id: 345,
  usuario: {
    id: 345,
    nombre: 'Manuel',
    apellido_paterno: 'Aravena',
    apellido_materno: 'Hernandez',
    run: '12345678-9',
    email: 'manuel.aravena@algo.com',
    rol_id: 6493
  },
  grupos: [
    {
      id: 123,
      nombre: 'G05',
      proyecto: 'Prueba de estudiantes',
      correlativo: 5
    }
  ]
}

const grupo = {
  id: 123,
  nombre: 'G05',
  proyecto: 'Prueba de estudiantes',
  correlativo: 5,
  stakeholders: [
    {
      id: 964,
      iniciales: 'MAH',
      usuario: {
        nombre: 'Manuel',
        apellido_paterno: 'Aravena',
        apellido_materno: 'Hernandez',
        run: '12345678-9',
        email: 'manuel.aravena@algo.com'
      }
    }
  ]
}

const tipoAprobaciones = [
  {id: 9643, identificador: 'A', descripcion: 'Aprobada', rango: 1},
  {id: 2353, identificador: 'AC', descripcion: 'Aprobada con comentarios', rango: 2},
  {id: 4613, identificador: 'R', descripcion: 'Rechazada', rango: 3},
  {id: 963, identificador: 'RC', descripcion: 'Rechazada con comentarios', rango: 4}
]

const listaGrupos = [
  {
    id: 62343,
    nombre: 'G01',
    proyecto: 'Pagina web de prueba',
    correlativo: 1,
    jornada: 'Vespertina',
    estudiantes: [
      {
        id: 1343,
        iniciales: 'ABC',
        usuario: {
          nombre: 'Andrea',
          apellido_paterno: 'Becerra',
          apellido_materno: 'Contreras',
          run: '19876543-2',
          email: 'andrea.becerra@algo.com'
        }
      },
      {
        id: 3453,
        iniciales: 'DEF',
        usuario: {
          nombre: 'Daniel',
          apellido_paterno: 'Espinoza',
          apellido_materno: 'Faundez',
          run: '112223333-4',
          email: 'daniel.espinoza@algo.com'
        }
      }
    ],
    stakeholder: []
  },
  {
    id: 123,
    nombre: 'G05',
    proyecto: 'Prueba de estudiantes',
    correlativo: 5,
    jornada: 'Diurna',
    estudiantes: [
      {
        id: 4634,
        inicales: 'GHI',
        usuario: {
          nombre: 'Gabriela',
          apellido_paterno: 'Hernandez',
          apellido_materno: 'Ibarra',
          run: '11333444-5',
          email: 'gabriela.hernadez@algo.com'
        }
      },
      {
        id: 5423463,
        inicales: 'JKL',
        usuario: {
          nombre: 'José',
          apellido_paterno: 'Kast',
          apellido_materno: 'López',
          run: '11444555-6',
          email: 'jose.kast@algo.com'
        }
      }
    ],
    stakeholders: [
      {
        id: 964,
        iniciales: 'MAH',
        usuario: {
          nombre: 'Manuel',
          apellido_paterno: 'Aravena',
          apellido_materno: 'Hernandez',
          run: '12345678-9',
          email: 'manuel.aravena@algo.com'
        }
      }
    ]
  }
]

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/stakeholders/345':
      return Promise.resolve({data: stakeholder})
    case apiUrl + '/grupos/123':
      return Promise.resolve({data: grupo})
    case apiUrl + '/grupos':
      return Promise.resolve({data: listaGrupos})
    case apiUrl + '/tipo_aprobaciones':
      return Promise.resolve({data: tipoAprobaciones})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('Stakeholder.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Stakeholder, {
      global: {
        plugins: [store]
      }
    })
  })

  // Comienzo de pruebas unitarias
  it('variable "nombreTab" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nombreTab).toEqual('Revision')
  })

  it('variable "idRevision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idRevision).toEqual(0)
  })

  it('variable "idRespuestas" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idRespuestas).toEqual(0)
  })

  it('variable "idMinuta" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idMinuta).toEqual(0)
  })

  it('variable "verTablero" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verTablero).toBeTruthy()
  })

  it('variable "verRevision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verRevision).toBeFalsy()
  })

  it('variable "verRespuestas" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verRespuestas).toBeFalsy()
  })

  it('variable "verMinuta" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verMinuta).toBeFalsy()
  })

  it('variable "listaGrupos" se inicializa vacía', () => {
    expect(wrapper.vm.listaGrupos).toEqual([])
  })

  it('variable "listaGrupos" se inicializa correctamente', async () => {
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaGrupos).toEqual(listaGrupos)
  })

  it('variable "grupoActual" se inicializa correctamente con cero', () => {
    expect(wrapper.vm.grupoActual).toEqual(0)
  })

  it('variable "grupoActual" se inicializa correctamente', async () => {
    wrapper.vm.obtenerStakeholder()
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupoActual).toEqual(123)
  })

  it('variable "grupoSeleccionado" se inicializa vacío', () => {
    expect(wrapper.vm.grupoSeleccionado).toEqual({})
  })

  it('variable "grupoSeleccionado" se inicializa correctamente', async () => {
    wrapper.vm.obtenerStakeholder()
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupoSeleccionado).toEqual(listaGrupos[1])
  })

  it('variable "verSelectorGrupo" se inicializa correctamente con "true"', () => {
    expect(wrapper.vm.verSelectorGrupo).toBeTruthy()
  })

  it('variable "verSelectorGrupo" se inicializa correctamente con "false"', async () => {
    wrapper.vm.obtenerStakeholder()
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verSelectorGrupo).toBeFalsy()
  })

  it('variable "tableroStk" se inicializa correctamente con "cero"', () => {
    expect(wrapper.vm.tableroStk).toEqual(0)
  })

  it('propiedad computada "gruposFiltrados" funciona correctamente con "undefined"', async () => {
    const cliente = {
      id: 964,
      iniciales: 'MAH',
      usuario_id: 345,
      usuario: {
        id: 345,
        nombre: 'Manuel',
        apellido_paterno: 'Aravena',
        apellido_materno: 'Hernandez',
        run: '12345678-9',
        email: 'manuel.aravena@algo.com',
        rol_id: 6493
      },
      grupos: {
        id: 123,
        nombre: 'G05',
        proyecto: 'Prueba de estudiantes',
        correlativo: 5
      }
    }
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    wrapper.vm.$store.commit('setStakeholder',cliente)
    expect(wrapper.vm.gruposFiltrados.length).toEqual(1)
    expect(wrapper.vm.gruposFiltrados[0]).toEqual(listaGrupos[1])
  })

  it('propiedad computada "gruposFiltrados" funciona correctamente sin "undefined"', async () => {
    wrapper.vm.obtenerStakeholder()
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.gruposFiltrados.length).toEqual(1)
    expect(wrapper.vm.gruposFiltrados[0]).toEqual(listaGrupos[1])
  })

  it('propiedad computada "gruposJornada" funciona correctamente con jornada "Diurna"', async () => {
    wrapper.vm.obtenerStakeholder()
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.gruposJornada.length).toEqual(1)
    expect(wrapper.vm.gruposJornada[0]).toEqual(listaGrupos[1])
  })

  it('propiedad computada "gruposJornada" funciona correctamente con jornada "Vespertina"', async () => {
    wrapper.vm.obtenerStakeholder()
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    wrapper.vm.$store.commit('setJornadaActual', 'Vespertina')
    expect(wrapper.vm.gruposJornada.length).toEqual(0)
    expect(wrapper.vm.gruposJornada).toEqual([])
  })

  it('método "establecerRevision" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verRevision = false
    wrapper.vm.verTablero = true
    wrapper.vm.establecerRevision(453463)
    expect(wrapper.vm.idRevision).toEqual(453463)
    expect(wrapper.vm.verRevision).toBeTruthy()
    expect(wrapper.vm.verTablero).toBeFalsy()
  })

  it('método "mostrarTablero" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verTablero = false
    wrapper.vm.verRevision = true
    wrapper.vm.idRevision = 46345
    wrapper.vm.verRespuestas = true
    wrapper.vm.idRespuestas = 63453
    wrapper.vm.tableroStk = 0
    wrapper.vm.mostrarTablero('Comentadas')
    expect(wrapper.vm.verTablero).toBeTruthy()
    expect(wrapper.vm.verRevision).toBeFalsy()
    expect(wrapper.vm.idRevision).toEqual(0)
    expect(wrapper.vm.verRespuestas).toBeFalsy()
    expect(wrapper.vm.idRespuestas).toEqual(0)
    expect(wrapper.vm.tableroStk).toEqual(1)
    expect(wrapper.vm.nombreTab).toEqual('Comentadas')
  })

  it('método "revisarRespuestas" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verTablero = true
    wrapper.vm.verRevision = true
    wrapper.vm.verRespuestas = false
    wrapper.vm.idRespuestas = 0
    wrapper.vm.revisarRespuestas(643534)
    expect(wrapper.vm.verTablero).toBeFalsy()
    expect(wrapper.vm.verRevision).toBeFalsy()
    expect(wrapper.vm.verRespuestas).toBeTruthy()
    expect(wrapper.vm.idRespuestas).toEqual(643534)
  })

  it('método "mostrarMinuta" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verTablero = true
    wrapper.vm.verRevision = true
    wrapper.vm.verMinuta = false
    wrapper.vm.idMinuta = 0
    wrapper.vm.mostrarMinuta(46145)
    expect(wrapper.vm.verTablero).toBeFalsy()
    expect(wrapper.vm.verRevision).toBeFalsy()
    expect(wrapper.vm.verMinuta).toBeTruthy()
    expect(wrapper.vm.idMinuta).toEqual(46145)
  })

  it('método "verCerradas" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verMinuta = true
    wrapper.vm.idMinuta = 46345
    wrapper.vm.verCerradas()
    expect(wrapper.vm.nombreTab).toEqual('Cerradas')
    expect(wrapper.vm.verMinuta).toBeFalsy()
    expect(wrapper.vm.idMinuta).toEqual(0)
  })

  it('método "obtenerStakeholder" funciona correctamente', async () => {
    wrapper.vm.obtenerStakeholder()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.stakeholder).toEqual(stakeholder)
  })
/*
  it('método "obtenerGrupo" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.obtenerGrupo(123)
    expect(wrapper.vm.grupo).toEqual(grupo)
  })
*/
  it('método "obtenerGrupos" funciona correctamente', async () => {
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaGrupos).toEqual(listaGrupos)
  })

  it('método "obtenerAprobaciones" funciona correctamente', async () => {
    wrapper.vm.obtenerAprobaciones()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tipoAprobaciones).toEqual(tipoAprobaciones)
  })

  it('método "nombreCompleto" funciona correctamente', async () =>  {
    const usuario = {
      nombre: 'Pamela',
      apellido_paterno: 'Venegas',
      apellido_materno: 'Bastías'
    }
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nombreCompleto(usuario)).toEqual('Pamela Venegas Bastías')
  })

  it('método "buscarPorId" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.buscarPorId(listaGrupos, 123)).toEqual(listaGrupos[1])
  })

  it('método "seleccionarGrupo" funciona correctamente', async () => {
    wrapper.vm.obtenerStakeholder()
    wrapper.vm.obtenerGrupos()
    await wrapper.vm.$nextTick()
    wrapper.vm.$store.commit('setGrupo', {})
    wrapper.vm.tableroStk = 10
    wrapper.vm.seleccionarGrupo(123)
    expect(wrapper.vm.grupoActual).toEqual(123)
    expect(wrapper.vm.grupoSeleccionado).toEqual(listaGrupos[1])
    expect(wrapper.vm.grupo).toEqual(listaGrupos[1])
    expect(wrapper.vm.tableroStk).toEqual(11)
  })
})
