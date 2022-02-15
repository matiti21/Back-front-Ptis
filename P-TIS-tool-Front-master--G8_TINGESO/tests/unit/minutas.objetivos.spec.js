import { shallowMount } from '@vue/test-utils'
import Objetivos from '@/components/minutas/Objetivos.vue'

describe('Objetivos.vue', () => {
  const lista = [
    {
      id: 2345,
      descripcion: 'Este es un objetivo n° 1'
    },
    {
      id: 2463,
      descripcion: 'Este es un objetivo n° 2'
    }
  ]

  it('se asigna prop lista adecuadamente', () => {
    const wrapper = shallowMount(Objetivos, {
      propsData: {
        lista: lista
      }
    })
    expect(wrapper.props().lista).toEqual(lista)
  })

  it('variable objetivos se inicializa correctamente', () => {
    const wrapper = shallowMount(Objetivos, {
      propsData: {
        lista: lista
      }
    })
    expect(wrapper.vm.objetivos).toEqual(lista)
  })
})
