import { shallowMount } from '@vue/test-utils'
import InfoAvance from '@/components/semanal/InfoAvance.vue'

describe('InfoAvance.vue', () => {
  const grupo = {id: 94543, proyecto: 'Grupo de prueba'}

  const minuta = {
    id: 9453,
    minuta: {
      id: 9543,
      numero_sprint: 9453,
      correlativo: 9434,
      codigo: 'MINUTA_G02_05_2020',
      fecha_reunion: '2020-10-21T05:23:54.946Z'
    }
  }

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InfoAvance, {
      propsData: {
        grupo: grupo,
        minuta: minuta
      }
    })
  })

  it('se asigna prop "grupo" correctamente', () => {
    expect(wrapper.props().grupo).toEqual(grupo)
  })

  it('se asigna prop "minuta" correctamente', () => {
    expect(wrapper.props().minuta).toEqual(minuta)
  })

  it('variable "bitacora" se inicializa correctamente', () => {
    expect(wrapper.vm.bitacora).toEqual(minuta)
  })

  it('variable "grupoSeleccionado" se inicializa correctamente', () => {
    expect(wrapper.vm.grupoSeleccionado).toEqual(grupo)
  })

  it('método "extraerFecha" funciona correctamente', () => {
    expect(wrapper.vm.extraerFecha('2020-10-21T05:23:54.946Z')).toEqual('21-10-2020')
  })
})
