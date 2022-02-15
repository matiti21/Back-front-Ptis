import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import AsignarStk from '@/components/AsignarStk.vue'

// Variables globales
const listaStakeholders = [
  {
    id: 62345,
    email: 'jose.venegas@algo.com'
  },
  {
    id: 6234534,
    email: 'daniel.castro@algo.com'
  }
]

const idGrupo = 934634

const grupo = {
  id: idGrupo, nombre: 'G02',
  stakeholders: [{id: 962345}, {id: 7463945}, {id: 62345}]
}

const apiUrl = '127.0.0.1:3000'

// Mock store
const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      jornadaActual: 'Diurna'
    }
  },
  mutations: {
    setJornadaActual(state, valor) {
      state.jornadaActual = valor
    }
  }
})

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/stakeholders':
      return Promise.resolve({data: listaStakeholders})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.put.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/grupos/asignacion/stakeholders/' + idGrupo:
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('AsignarStk.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AsignarStk, {
      global: {
        plugins: [store]
      }
    })
  })

  it('variable "grupoSeleccionado" se inicializa correctamente', () => {
    expect(wrapper.vm.grupoSeleccionado).toEqual({})
  })

  it('variable "mostrarStakeholders" se inicializa correctamente', () => {
    expect(wrapper.vm.mostrarStakeholders).toBeFalsy()
  })

  it('variable "asignados" se inicializa correctamente', () => {
    expect(wrapper.vm.asignados).toEqual([])
  })

  it('variable "listaStakeholders" se inicializa correctamente', () => {
    expect(wrapper.vm.listaStakeholders).toEqual([])
  })

  it('propiedad computada "mostrarTabla" funciona correctamente con "true"', () => {
    wrapper.vm.listaStakeholders = listaStakeholders
    expect(wrapper.vm.mostrarTabla).toBeTruthy()
  })

  it('propiedad computada "mostrarTabla" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarTabla).toBeFalsy()
  })

  it('propiedad computada "mostrarAsignar" funciona correctamente con "true"', () => {
    wrapper.vm.asignados = [1, 2, 3, 4, 5]
    expect(wrapper.vm.mostrarAsignar).toBeTruthy()
  })

  it('propiedad computada "mostrarAsignar" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarAsignar).toBeFalsy()
  })

  it('método "seleccionarGrupo" funciona correctamente', () => {
    wrapper.vm.seleccionarGrupo(grupo)
    expect(wrapper.vm.grupoSeleccionado).toEqual(grupo)
    expect(wrapper.vm.mostrarStakeholders).toBeTruthy()
  })

  it('método "nombreCompleto" funciona correctamente', () => {
    const cliente = {
      nombre: 'Mateo',
      apellido_paterno: 'Iglesias',
      apellido_materno: 'Del Campo'
    }
    expect(wrapper.vm.nombreCompleto(cliente)).toEqual('Mateo Iglesias Del Campo')
  })

  it('método "buscarIndex" funciona correctamente', () => {
    const lista = [
      {id: 29353}, {id: 9534}, {id: 926364}
    ]
    expect(wrapper.vm.buscarIndex(lista, 9534)).toEqual(1)
  })

  it('método "stakeholdersAsignados" funciona correctamente', () => {
    wrapper.vm.grupoSeleccionado = grupo
    wrapper.vm.listaStakeholders = listaStakeholders
    wrapper.vm.stakeholdersAsignados()
    expect(wrapper.vm.asignados[0]).toEqual(62345)
  })

  it('método "obtenerStakeholders" funciona correctamente', async () => {
    wrapper.vm.obtenerStakeholders()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaStakeholders).toEqual(listaStakeholders)
  })

  it('método "cambiarAsignacion" funciona correctamente', async () => {
    wrapper.vm.asignados = [63423, 914653]
    wrapper.vm.grupoSeleccionado = grupo
    wrapper.vm.cambiarAsignacion()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().actualizar).toBeTruthy()
    expect(wrapper.emitted().actualizar.length).toEqual(1)
    expect(wrapper.emitted().actualizar[0]).toEqual([])
  })

  it('método "cerrar" funciona correctamente', async () => {
    wrapper.vm.cerrar()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })
})
