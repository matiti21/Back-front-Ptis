import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import RevisionMinutas from '@/components/RevisionMinutas.vue'

// Variables globales
const apiUrl = '127.0.0.1:3000'

const listaGrupos = [
  {
    id: 1, jornada: 'Diurna'
  },
  {
    id: 2, jornada: 'Vespertina'
  },
  {
    id: 3, jornada: 'Vespertina'
  },
  {
    id: 4, jornada: 'Diurna'
  }
]

const idGrupo = 345343

// Mock store
const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      jornadaActual: 'Diurna'
    }
  }
})

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/minutas/grupo/' + idGrupo:
      return Promise.resolve({data: []})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('RevisionMinutas.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RevisionMinutas, {
      global: {
        plugins: [store]
      }
    })
  })

  it('variable mostrarFormulario se inicializa correctamente', () => {
    expect(wrapper.vm.mostrarFormulario).toBeFalsy()
  })

  it('variable mostrarMinutas se inicializa correctamente', () => {
    expect(wrapper.vm.mostrarMinutas).toBeFalsy()
  })

  it('variable "mostrarRegistros" se inicializa correctamente', () => {
    expect(wrapper.vm.mostrarRegistros).toBeFalsy()
  })

  it('variable grupoSeleccionado se inicializa correctamente', () => {
    expect(wrapper.vm.grupoSeleccionado).toEqual({})
  })

  it('variable listaMinutas se inicializa correctamente', () => {
    expect(wrapper.vm.listaMinutas).toEqual([])
  })

  it('variable bitacora se inicializa correctamente', () => {
    expect(wrapper.vm.bitacora).toEqual({})
  })

  it('método "seleccionarGrupo" funciona correctamente', () => {
    const grupo = {id: 93453, nombre: 'G01'}
    wrapper.vm.seleccionarGrupo(grupo)
    expect(wrapper.vm.grupoSeleccionado).toEqual(grupo)
    expect(wrapper.vm.mostrarMinutas).toBeTruthy()
  })

  it('método cerrarFormulario funciona correctamente', () => {
    const wrapper = shallowMount(RevisionMinutas, {
      data() {
        return {
          mostrarFormulario: true,
          bitacora: {
            minuta: {
              objetivos: [],
              conclusiones: [],
              items: []
            }
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.cerrarFormulario()
    expect(wrapper.vm.mostrarFormulario).toBeFalsy()
  })

  it('método "verRegistros" funciona correctamente', () => {
    wrapper.vm.verRegistros()
    expect(wrapper.vm.mostrarRegistros).toBeTruthy()
  })

  it('método "cerrarRegistros" funciona correctamente', () => {
    const wrapper = shallowMount(RevisionMinutas, {
      data() {
        return {
          mostrarRegistros: true
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.cerrarRegistros()
    expect(wrapper.vm.mostrarRegistros).toBeFalsy()
  })
})
