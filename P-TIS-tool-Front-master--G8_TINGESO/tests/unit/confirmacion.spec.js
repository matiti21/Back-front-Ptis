import { shallowMount } from '@vue/test-utils'
import Confirmacion from '@/components/Confirmacion.vue'

describe('Confirmacion.vue', () => {
  const mensaje = 'Mensaje de prueba'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Confirmacion, {
      propsData: {
        mostrar: true,
        texto: mensaje
      }
    })
  })

  it('se asigna prop "mostrar" correctamente', () => {
    expect(wrapper.props().mostrar).toBeTruthy()
  })

  it('se asigna prop "text" correctamente', () => {
    expect(wrapper.props().texto).toEqual(mensaje)
  })

  it('variable "activo" se inicializa correctamente', () => {
    expect(wrapper.vm.activo).toBeTruthy()
  })

  it('variable "mensaje" se inicializa correctamente', () => {
    expect(wrapper.vm.mensaje).toEqual(mensaje)
  })

  it('método "confirmarAccion" funciona correctamente', async () => {
    wrapper.vm.confirmarAccion()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().accion).toBeTruthy()
    expect(wrapper.emitted().accion.length).toEqual(1)
    expect(wrapper.emitted().accion[0]).toEqual([])
  })

  it('método "cancelarAccion" funciona correctamente', async () => {
    wrapper.vm.cancelarAccion()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })
})
