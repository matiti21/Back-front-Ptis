import { shallowMount } from '@vue/test-utils'
import VisorEstudiante from '@/components/semanal/VisorEstudiante.vue'

describe('VisorEstudiante.vue', () => {
  const est = {
    id: 94534,
    iniciales: 'ABC',
    usuario: {
      id: 235934,
      nombre: 'Alberto',
      apellido_paterno: 'Becerra',
      apellido_materno: 'Cabrera',
    }
  }

  const logros = [
    {id: 94534, descripcion: 'Primer logro de prueba'},
    {id: 23549, descripcion: 'Segundo logro de prueba'}
  ]

  const metas = [
    {id: 79453, descripcion: 'Primera meta de prueba'},
    {id: 23532, descripcion: 'Segunda meta de prueba'}
  ]

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(VisorEstudiante, {
      propsData: {
        est: est,
        logros: logros,
        metas: metas
      }
    })
  })

  it('se asiga prop "est" correctamente', () => {
    expect(wrapper.props().est).toEqual(est)
  })

  it('se asigna prop "logros" correctamente', () => {
    expect(wrapper.props().logros).toEqual(logros)
  })

  it('se asigna prop "metas" correctamente', () => {
    expect(wrapper.props().metas).toEqual(metas)
  })

  it('variable "estudiante" se inicializa correctamente', () => {
    expect(wrapper.vm.estudiante).toEqual(est)
  })

  it('variable "listaLogros" se inicializa correctamente', () => {
    expect(wrapper.vm.listaLogros).toEqual(logros)
  })

  it('variable "listaMetas" se inicializa correctamente', () => {
    expect(wrapper.vm.listaMetas).toEqual(metas)
  })

  it('método "nombreCompleto" funciona correctamente', () => {
    expect(wrapper.vm.nombreCompleto(est.usuario)).toEqual('Alberto Becerra Cabrera')
  })
})
