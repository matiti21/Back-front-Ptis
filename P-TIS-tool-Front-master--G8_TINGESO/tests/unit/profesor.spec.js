import { shallowMount } from '@vue/test-utils'
import Profesor from '@/components/views/Profesor.vue'

describe('Profesor.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Profesor)
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
