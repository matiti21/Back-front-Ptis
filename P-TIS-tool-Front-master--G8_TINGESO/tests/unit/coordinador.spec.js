import { shallowMount } from '@vue/test-utils'
import Coordinador from '@/components/views/Coordinador.vue'

describe('Coordinador.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Coordinador)
  })

  // Comienzo de test unitarios
  it('variable "nombreTabActiva" se inicializa correctamente', () => {
    expect(wrapper.vm.nombreTabActiva).toEqual('estudiantes')
  })

  it('variable "nombreTabs" se inicializa correctamente', () => {
    const esperado = {
      Estudiantes: 'estudiantes',
      Grupos: 'grupos',
      Minutas: 'minutas',
      Stakeholders: 'clientes',
      Profesores: 'profesores',
      Avances: 'avances',
      Estadisticas: 'estadisticas'
    }
    expect(wrapper.vm.nombreTabs).toEqual(esperado)
  })

  it('método "elegirTab" funciona correctamente', () => {
    wrapper.vm.elegirTab('minutas')
    expect(wrapper.vm.nombreTabActiva).toEqual('minutas')
  })
})
