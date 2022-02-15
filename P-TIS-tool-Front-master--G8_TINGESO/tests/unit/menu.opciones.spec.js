import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import MenuOpciones from '@/components/MenuOpciones.vue'

// Mock store
const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      authenticated: true,
      usuario: {
        id: 345634,
        nombre: 'Pedro',
        apellido_paterno: 'Gacitua',
        apellido_materno: 'Ortega',
        run: '11222333-4',
        email: 'pedro.gacitua@algo.com',
        rol_id: 3453,
        rol: {
          id: 3453,
          rol: 'Estudiante',
          rango: 3
        }
      }
    }
  },
  mutations: {
    setAutenticacion (state, valor) {
      state.authenticated = valor
    },
    setUsuario (state, valor) {
      state.usuario = valor
    }
  }
})

// Mock router
const mockRouter = {
  push: jest.fn()
}

// Inicio test unitarios
describe('MenuOpciones.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(MenuOpciones, {
      global: {
        plugins: [store],
        mocks: {
          $router: mockRouter
        }
      }
    })
    jest.clearAllMocks()
  })

  it('variable "mostrarMenu" se inicializa correctamente', () => {
    expect(wrapper.vm.mostrarMenu).toBeFalsy()
  })

  it('propiedad computada "sesionIniciada" funciona correctamente con "true"', () => {
    expect(wrapper.vm.sesionIniciada).toBeTruthy()
  })

  it('propiedad computada "sesionIniciada" funciona correctamente con "false"', () => {
    wrapper.vm.$store.commit('setAutenticacion', false)
    expect(wrapper.vm.sesionIniciada).toBeFalsy()
  })

  it('método "nombreCompleto" funciona correctamente', () => {
    expect(wrapper.vm.nombreCompleto(wrapper.vm.usuario)).toEqual('Pedro Gacitua Ortega')
  })

  it('método "cambiarClave" funciona correctamente', () => {
    wrapper.vm.cambiarClave()
    expect(mockRouter.push).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith({ path: '/usuario/cambio/clave'})
  })

  it('método "cerrarSesion" funciona correctamente', () => {
    wrapper.vm.cerrarSesion()
    expect(wrapper.vm.authenticated).toBeFalsy()
    expect(wrapper.vm.usuario).toEqual({})
    expect(mockRouter.push).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })
})
