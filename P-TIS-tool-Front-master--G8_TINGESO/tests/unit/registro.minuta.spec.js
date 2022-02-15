import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import Registro from '@/components/RegistroMinuta.vue'

// Variables globales
const apiUrl = '127.0.0.1:3000'

const registros = [
  {
    id: 623453,
    realizada_por: 4345,
    minuta_id: 62353,
    created_at: '2020-12-13T21:56:48.14TZ',
    tipo_actividad: {
      id: 62345,
      actividad: 'Alguna actividad',
      descripcion: 'Alguna descripcion',
      identificador: 'A1'
    },
    usuario: {
      id: 692345,
      nombre: 'Federico',
      apellido_paterno: 'Costa',
      apellido_materno: 'Undurraga',
      iniciales: 'FCU'
    }
  },
  {
    id: 96235,
    realizada_por: 9245,
    minuta_id: 96245,
    created_at: '2020-12-14T16:40:36.14TZ',
    tipo_actividad: {
      id: 952345,
      actividad: 'Otra actividad',
      descripcion: 'Otra descripcion',
      identificador: 'A2'
    },
    usuario: {
      id: 95245,
      nombre: 'Marcela',
      apellido_paterno: 'Negrete',
      apellido_materno: 'Jorquera',
      iniciales: 'MNJ'
    }
  }
]


// Mock store
const store = createStore({
  state() {
    return {
      apiUrl: apiUrl
    }
  }
})


// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/registros/6':
      return Promise.resolve({data: registros})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('RegistroMinuta.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Registro, {
      propsData: {
        idBitacora: 6
      },
      global: {
        plugins: [store]
      }
    })
  })

  it('se asigna prop "idBitacora" adecuadamente', () => {
    expect(wrapper.props().idBitacora).toEqual(6)
  })

  it('variable "id" se inicializa correctamente con prop', () => {
    expect(wrapper.vm.id).toEqual(6)
  })

  it('variable "registros" se inicializa correctamente', () => {
    expect(wrapper.vm.registros).toEqual([])
  })

  it('propiedad computada "mostrarRegistros" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarRegistros).toBeFalsy()
  })

  it('propiedad computada "mostrarRegistros" funciona correctamente con "true"', () => {
    wrapper.vm.registros = registros
    expect(wrapper.vm.mostrarRegistros).toBeTruthy()
  })

  it('método "obtenerFecha" funciona correctamente', () => {
    expect(wrapper.vm.obtenerFecha(registros[0].created_at)).toEqual('13-12-2020')
  })

  it('método "obtenerHora" funciona correctamente', () => {
    expect(wrapper.vm.obtenerHora(registros[0].created_at)).toEqual('21:56')
  })

  it('método "obtenerRegistros" funciona correctamente', async () => {
    wrapper.vm.obtenerRegistros()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.registros).toEqual(registros)
  })

  it('método "cerrar" funciona correctamente', async () => {
    wrapper.vm.cerrar()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })
})
