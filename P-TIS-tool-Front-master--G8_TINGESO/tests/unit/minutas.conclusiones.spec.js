import { shallowMount } from '@vue/test-utils'
import Conclusiones from '@/components/minutas/Conclusiones.vue'

describe('Conclusiones.vue', () => {
  const lista = [
    {
      id: 2345,
      descripcion: 'Esta es una conclusion n° 1'
    },
    {
      id: 2463,
      descripcion: 'Esta es una conclusion n° 2'
    }
  ]

  it('se asigna prop lista adecuadamente', () => {
    const wrapper = shallowMount(Conclusiones, {
      propsData: {
        lista: lista
      }
    })
    expect(wrapper.props().lista).toEqual(lista)
  })

  it('variable conclusiones se inicializa correctamente', () => {
    const wrapper = shallowMount(Conclusiones, {
      propsData: {
        lista: lista
      }
    })
    expect(wrapper.vm.conclusiones).toEqual(lista)
  })
})
