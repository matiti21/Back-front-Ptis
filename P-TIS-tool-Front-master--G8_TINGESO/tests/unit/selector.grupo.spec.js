import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import SelectorGrupo from '@/components/SelectorGrupo.vue'

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      jornadaActual: 'Diurna'
    }
  }
})

// Variables globales
const grupos = [
  {id: 962353, jornada: 'Diurna'},
  {id: 345309, jornada: 'Diurna'},
  {id: 23453, jornada: 'Vespertina'}
]

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/grupos':
      return Promise.resolve({data: []})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('SelectorGrupo.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SelectorGrupo, {
      global: {
        plugins: [store]
      }
    })
  })

  it('variable "grupoActual" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupoActual).toEqual(0)
  })

  it('variable "grupoSeleccionado" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupoSeleccionado).toEqual({})
  })

  it('variable "listaGrupos" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaGrupos).toEqual([])
  })

/* Depende del 'state'  */

  it('propiedad computada "gruposJornada" funciona correctamente', async () => {
    const esperado = [
      {id: 962353, jornada: 'Diurna'},
      {id: 345309, jornada: 'Diurna'}
    ]
    await wrapper.vm.$nextTick()
    wrapper.vm.listaGrupos = grupos
    expect(wrapper.vm.gruposJornada).toEqual(esperado)
  })

  it('propiedad computada "mostrarGrupos" funciona correctamente con "true"', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.listaGrupos = grupos
    expect(wrapper.vm.mostrarGrupos).toBeTruthy()
  })

  it('propiedad computada "mostrarGrupos" funciona correctamente con "false"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.mostrarGrupos).toBeFalsy()
  })

  it('método "nombreCompleto" funciona correctamente', async () => {
    const estudiante = {
      nombre: 'Mateo',
      apellido_paterno: 'Iglesias',
      apellido_materno: 'Del Campo'
    }
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nombreCompleto(estudiante)).toEqual('Mateo Iglesias Del Campo')
  })

  it('método "visualizarRun" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.visualizarRun('12345678-9')).toEqual('12.345.678-9')
  })

  it('método "buscarPorId" funciona correctamente', async () => {
    const lista = [{id: 1, campo: 'manzana'}, {id: 2, campo: 'naranja'}]
    const esperado = {id: 2, campo: 'naranja'}
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.buscarPorId(lista, 2)).toEqual(esperado)
  })

/* Depende del 'state' */

  it('método "seleccionarGrupo" funciona correctamente', async () => {
    const listaGrupos = [
      {id: 1, nombre: 'G01'}, {id: 2, nombre: 'G02'}, {id: 3, nombre: 'G03'}
    ]
    const esperado = {id:2, nombre: 'G02'}
    wrapper.vm.listaGrupos = listaGrupos
    wrapper.vm.seleccionarGrupo(2)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupoActual).toEqual(2)
    expect(wrapper.vm.grupoSeleccionado).toEqual(esperado)
    expect(wrapper.emitted().eleccion).toBeTruthy()
    expect(wrapper.emitted().eleccion.length).toEqual(1)
    expect(wrapper.emitted().eleccion[0]).toEqual([esperado])
  })

})
