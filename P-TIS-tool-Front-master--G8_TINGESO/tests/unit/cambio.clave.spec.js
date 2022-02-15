import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import CambioClave from '@/components/views/CambioClave.vue'

const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      usuario: {
        id: 4363,
        nombre: 'Juan',
        apellido_paterno: 'Castro',
        apellido_materno: 'Campos',
        run: null,
        email: 'juan.castro@algo.com',
        rol_id: 346,
        rol: {
          id: 346,
          rol: 'Profesor',
          rango: 2
        }
      }
    }
  }
})

const mockRouter = {
  push: jest.fn()
}

jest.mock('axios')

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/auth/login':
      return Promise.resolve({ data: { jwt: 'token' }})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('CambioClave.vue', () => {
  it('variable "actual" se inicializa correctamente', () => {
    const wrapper = shallowMount(CambioClave)
    expect(wrapper.vm.actual).toEqual('')
  })

  it('variable "nueva" se inicializa correctamente', () => {
    const wrapper = shallowMount(CambioClave)
    expect(wrapper.vm.nueva).toEqual('')
  })

  it('variable "repetirNueva" se inicializa correctamente', () => {
    const wrapper = shallowMount(CambioClave)
    expect(wrapper.vm.repetirNueva).toEqual('')
  })

  it('variable "entradas" se inicializa correctamente', () => {
    const esperado = {
      actual: {error: false, mensaje: ''},
      nueva: {error: false, mensaje: ''},
      repetir: {error: false, mensaje: ''}
    }
    const wrapper = shallowMount(CambioClave)
    expect(wrapper.vm.entradas).toEqual(esperado)
  })

  it('método "validarActual" funciona correctamente para "actual" igual a "undefined"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          actual: undefined
        }
      }
    })
    expect(wrapper.vm.validarActual()).toBeFalsy()
    expect(wrapper.vm.entradas.actual.error).toBeTruthy()
    expect(wrapper.vm.entradas.actual.mensaje).toEqual('Este campo no puede estar vacío')
  })

  it('método "validarActual" funciona correctamente para "actual" igual a ""', () => {
    const wrapper = shallowMount(CambioClave)
    expect(wrapper.vm.validarActual()).toBeFalsy()
    expect(wrapper.vm.entradas.actual.error).toBeTruthy()
    expect(wrapper.vm.entradas.actual.mensaje).toEqual('No se ha ingresado la clave actual')
  })

  it('método "validarActual" funciona correctamente para "actual" igual a "abc"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          actual: 'abc'
        }
      }
    })
    expect(wrapper.vm.validarActual()).toBeTruthy()
    expect(wrapper.vm.entradas.actual.error).toBeFalsy()
    expect(wrapper.vm.entradas.actual.mensaje).toEqual('')
  })

  it('método "validarNueva" funciona correctamente para "nueva" igual a "undefined"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          nueva: undefined
        }
      }
    })
    expect(wrapper.vm.validarNueva()).toBeFalsy()
    expect(wrapper.vm.entradas.nueva.error).toBeTruthy()
    expect(wrapper.vm.entradas.nueva.mensaje).toEqual('Este campo no puede estar vacío')
  })

  it('método "validarNueva" funciona correctamente para "nueva" igual a ""', () => {
    const wrapper = shallowMount(CambioClave)
    expect(wrapper.vm.validarNueva()).toBeFalsy()
    expect(wrapper.vm.entradas.nueva.error).toBeTruthy()
    expect(wrapper.vm.entradas.nueva.mensaje).toEqual('No se ha ingresado la nueva clave')
  })

  it('método "validarNueva" funciona correctamente para "nueva" igual a "abc"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          nueva: 'abc'
        }
      }
    })
    expect(wrapper.vm.validarNueva()).toBeTruthy()
    expect(wrapper.vm.entradas.nueva.error).toBeFalsy()
    expect(wrapper.vm.entradas.nueva.mensaje).toEqual('')
  })

  it('métdo "validarPass" funciona correctamente para "nueva" igual a "undefinded"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          nueva: undefined
        }
      }
    })
    expect(wrapper.vm.validarPass()).toBeFalsy()
    expect(wrapper.vm.entradas.nueva.error).toBeTruthy()
    expect(wrapper.vm.entradas.nueva.mensaje).toEqual('Falta ingresar la nueva contraseña')
  })

  it('métdo "validarPass" funciona correctamente para "repetirNueva" igual a "undefinded"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          repetirNueva: undefined
        }
      }
    })
    expect(wrapper.vm.validarPass()).toBeFalsy()
    expect(wrapper.vm.entradas.repetir.error).toBeTruthy()
    expect(wrapper.vm.entradas.repetir.mensaje).toEqual('Falta reingresar la nueva contraseña')
  })

  it('métdo "validarPass" funciona correctamente para "nueva" igual a ""', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          nueva: ''
        }
      }
    })
    expect(wrapper.vm.validarPass()).toBeFalsy()
    expect(wrapper.vm.entradas.nueva.error).toBeTruthy()
    expect(wrapper.vm.entradas.nueva.mensaje).toEqual('No se ha ingresado la nueva contraseña')
  })

  it('métdo "validarPass" funciona correctamente para "repetirNueva" igual a ""', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          nueva: 'abc',
          repetirNueva: ''
        }
      }
    })
    expect(wrapper.vm.validarPass()).toBeFalsy()
    expect(wrapper.vm.entradas.repetir.error).toBeTruthy()
    expect(wrapper.vm.entradas.repetir.mensaje).toEqual('No se ha reingresado la nueva contraseña')
  })

  it('métdo "validarPass" funciona correctamente para "nueva" distinto a "repetirNueva"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          nueva: 'abc',
          repetirNueva: 'def'
        }
      }
    })
    expect(wrapper.vm.validarPass()).toBeFalsy()
    expect(wrapper.vm.entradas.nueva.error).toBeTruthy()
    expect(wrapper.vm.entradas.nueva.mensaje).toEqual('')
    expect(wrapper.vm.entradas.repetir.error).toBeTruthy()
    expect(wrapper.vm.entradas.repetir.mensaje).toEqual('Las contraseñas no coinciden')
  })

  it('métdo "validarPass" funciona correctamente para "nueva" igual a "repetirNueva"', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          nueva: 'abc',
          repetirNueva: 'abc'
        }
      }
    })
    expect(wrapper.vm.validarPass()).toBeTruthy()
    expect(wrapper.vm.entradas.nueva.error).toBeFalsy()
    expect(wrapper.vm.entradas.repetir.error).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente para valores iniciales', () => {
    const wrapper = shallowMount(CambioClave)
    expect(wrapper.vm.validarFormulario()).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente para valores correctos', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          actual: 'pass',
          nueva: 'abc',
          repetirNueva: 'abc'
        }
      }
    })
    expect(wrapper.vm.validarFormulario()).toBeTruthy()
  })

/*  Intento fallido de prueba función de autenticación con axios.post

  it('método "autenticar" funciona correctamente con "true"', async () => {
    process.env.VUE_APP_API_URL = apiUrl
    const user = {
      auth: {
        email: 'juan.castro@algo.com',
        password: 'prueba1'
      }
    }
    const wrapper = shallowMount(CambioClave, {
      global: {
        plugins: [store]
      }
    })

    axios.post.mockImplementation((url) => {
      switch (url) {
        case apiUrl + '/auth/login':
          return Promise.resolve(200)
        default:
          return Promise.reject(new Error('not found'))
      }
    })

    wrapper.vm.actual = 'prueba1'
    const respuesta = wrapper.vm.autenticar()
    await wrapper.vm.$nextTick()
    debugger
    expect(respuesta).toBeTruthy()
    expect(wrapper.vm.entradas.actual.error).toBeFalsy()
    expect(wrapper.vm.entradas.actual.mensaje).toEqual('')
  })
*/

  it('método "limpiarActual" funciona correctamente', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          entradas: {
            actual: {error: true, mensaje: 'Mensaje de prueba'},
            nueva: {error: false, mensaje: ''},
            repetir: {error: false, mensaje: ''}
          }
        }
      }
    })
    wrapper.vm.limpiarActual()
    expect(wrapper.vm.entradas.actual.error).toBeFalsy()
    expect(wrapper.vm.entradas.actual.mensaje).toEqual('')
  })

  it('método "limpiarNueva" funciona correctamente', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          entradas: {
            actual: {error: false, mensaje: ''},
            nueva: {error: true, mensaje: 'Mensaje de prueba'},
            repetir: {error: false, mensaje: ''}
          }
        }
      }
    })
    wrapper.vm.limpiarNueva()
    expect(wrapper.vm.entradas.nueva.error).toBeFalsy()
    expect(wrapper.vm.entradas.nueva.mensaje).toEqual('')
  })

  it('método "limpiarRepetir" funciona correctamente', () => {
    const wrapper = shallowMount(CambioClave, {
      data() {
        return {
          entradas: {
            actual: {error: false, mensaje: ''},
            nueva: {error: false, mensaje: ''},
            repetir: {error: true, mensaje: 'Mensaje de prueba'}
          }
        }
      }
    })
    wrapper.vm.limpiarRepetir()
    expect(wrapper.vm.entradas.repetir.error).toBeFalsy()
    expect(wrapper.vm.entradas.repetir.mensaje).toEqual('')
  })

  it('método "redirigirUsuario" funciona correctamente', () => {
    const wrapper = shallowMount(CambioClave, {
      global: {
        plugins: [store],
        mocks: {
          $router: mockRouter
        }
      }
    })
    wrapper.vm.redirigirUsuario()
    expect(mockRouter.push).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith({ path: '/profesor' })
  })

  it('método "cancelarCambio" funciona correctamente', () => {
    const wrapper = shallowMount(CambioClave, {
      global: {
        plugins: [store],
        mocks: {
          $router: mockRouter
        }
      }
    })
    wrapper.vm.actual = 'prueba'
    wrapper.vm.nueva = 'otra prueba'
    wrapper.vm.repetirNueva = 'otra prueba'
    wrapper.vm.cancelarCambio()
    expect(wrapper.vm.actual).toEqual('')
    expect(wrapper.vm.nueva).toEqual('')
    expect(wrapper.vm.repetirNueva).toEqual('')
  })
})
