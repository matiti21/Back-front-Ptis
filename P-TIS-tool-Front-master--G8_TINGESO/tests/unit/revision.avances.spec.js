import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RevisionAvances from '@/components/RevisionAvances.vue'

const store = createStore({
  state() {
    return {
      apiUrl: '127.0.0.1:3000',
      jornadaActual: 'Diurna'
    }
  }
})

describe('RevisionAvances.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RevisionAvances, {
      global: {
        plugins: [store]
      }
    })
  })

  const avances = [
    {
      id: 5345,
      minuta: {
        id: 63453,
        bitacora_estado: {
          id: 9643,
          tipo_estado: {
            id: 6435,
            abreviacion: 'CER'
          }
        }
      }
    }
  ]
  const grupo = {id: 9453, nombre: 'Grupo de prueba'}
  const bitacora = {id: 9543, minuta: {id: 64353, codigo: 'MINUTA_G02_04_2020'}}

  it('variable "grupoSeleccionado" se inicializa correctamente', () => {
    expect(wrapper.vm.grupoSeleccionado).toEqual({})
  })

  it('variable "listaAvances" se inicializa correctamente', () => {
    expect(wrapper.vm.listaAvances).toEqual([])
  })

  it('variable "revisarMinuta" se inicializa correctamente en "false"', () => {
    expect(wrapper.vm.revisarMinuta).toBeFalsy()
  })

  it('variable "bitacora" se inicializa correctamente', () => {
    expect(wrapper.vm.bitacora).toEqual({})
  })

  it('propiedad computada "grupoElegido" funciona correctamente con "true"', () => {
    wrapper.vm.grupoSeleccionado = {id: 96345, nombre: 'Grupo de prueba'}
    expect(wrapper.vm.grupoElegido).toBeTruthy()
  })

  it('propiedad computada "grupoElegido" funciona correctamente con "false"', () => {
    expect(wrapper.vm.grupoElegido).toBeFalsy()
  })

  it('propiedad computada "mostrarMinutas" funciona correctamente con "true"', () => {
    wrapper.vm.listaAvances = avances
    expect(wrapper.vm.mostrarMinutas).toBeTruthy()
  })

  it('propiedad computada "mostrarMinutas" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarMinutas).toBeFalsy()
  })

  it('propiedad computada "listaFiltrada" funciona correctamente', () => {
    wrapper.vm.listaAvances = avances
    expect(wrapper.vm.listaFiltrada).toEqual(avances)
    expect(wrapper.vm.listaFiltrada.length).toEqual(1)
  })

  it('método "convertirFecha" funciona correctamente', () => {
    expect(wrapper.vm.convertirFecha('2021-01-15')).toEqual('15-01-2021')
  })

  it('método "seleccionarGrupo" funciona correctamente', () => {
    wrapper.vm.seleccionarGrupo(grupo)
    expect(wrapper.vm.grupoSeleccionado).toEqual(grupo)
  })

  it('método "revisarAvance" funciona correctamente', () => {
    wrapper.vm.revisarAvance(bitacora)
    expect(wrapper.vm.bitacora).toEqual(bitacora)
    expect(wrapper.vm.revisarMinuta).toBeTruthy()
  })

  it('método "cerrarRevision" funciona correctamente', () => {
    wrapper.vm.revisarMinuta = true
    wrapper.vm.grupoSeleccionado = grupo
    wrapper.vm.listaAvances = avances
    wrapper.vm.bitacora = bitacora
    wrapper.vm.cerrarRevision()
    expect(wrapper.vm.revisarMinuta).toBeFalsy()
    expect(wrapper.vm.grupoSeleccionado).toEqual({})
    expect(wrapper.vm.listaAvances).toEqual([])
    expect(wrapper.vm.bitacora).toEqual({})
  })
})
