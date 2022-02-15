import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import EstadisticasGrupo from '@/components/EstadisticasGrupo.vue'

// Creación del store
const store = createStore({
  state() {
    return {
      apiUrl: '127.0.0.1:3000'
    }
  }
})

// Variables
const grupo = {
  id: 945,
  nombre: 'G01',
  proyecto: 'Pruebas unitarias',
  correlativo: 1,
  jornada: 'Diurna',
  estudiantes: [
    {
      id: 4634,
      iniciales: 'ABC',
      usuario: {
        nombre: 'Juan',
        apellido_paterno: 'Castro',
        apellido_materno: 'Gonzalez',
        run: '12345678-9',
        email: 'juan.gonzales@algo.com'
      }
    }
  ]
}

const registros = [
  {
    id: 4634,
    iniciales: 'ABC',
    usuario: {
      id: 9433,
      nombre: 'Juan',
      apellido_paterno: 'Castro',
      apellido_materno: 'Gonzalez',
      run: '12345678-9',
      registros: {
        minutas: 43,
        tema: 2,
        objetivos: 13,
        conclusiones: 7,
        items: 131,
        comentarios: 0,
        respuestas: 83
      }
    }
  }
]

// Mock Axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case '127.0.0.1:3000/registros/grupo/945':
      return Promise.resolve({data: registros})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('EstadisticasGrupo.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(EstadisticasGrupo, {
      global: {
        plugins: [store]
      }
    })
  })

  // Comienzo de test unitarios
  it('variable "grupoSeleccionado" se inicializa correctamente', () => {
    expect(wrapper.vm.grupoSeleccionado).toEqual({})
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

  it('propiedad computada "totalRegistros" funciona correctamente con "registros" inicial', () => {
    expect(wrapper.vm.totalRegistros).toEqual(0)
  })

  it('propiedad computada "totalRegistros" funciona correctamente con "registros" distinto a inicial', () => {
    wrapper.vm.registros = registros
    expect(wrapper.vm.totalRegistros).toEqual(279)
  })

  it('método "nombreCompleto" funciona correctamente', () => {
    expect(wrapper.vm.nombreCompleto(registros[0].usuario)).toEqual('Juan Castro Gonzalez')
  })

  it('método "visualizarRun" funciona correctamente', () => {
    expect(wrapper.vm.visualizarRun('12345678-9')).toEqual('12.345.678-9')
  })

  it('método "seleccionGrupo" funciona correctamente', async () => {
    wrapper.vm.seleccionGrupo(grupo)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupoSeleccionado).toEqual(grupo)
    expect(wrapper.vm.registros).toEqual(registros)
  })

  it('método "obtenerRegistros" funciona correctamente', async () => {
    wrapper.vm.obtenerRegistros(945)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.registros).toEqual(registros)
  })

  it('método "subTotalRegistros" funciona correctamente', () => {
    expect(wrapper.vm.subTotalRegistros(registros[0])).toEqual(279)
  })

  it('método "porcentajeParcial" funciona correctamente con valores mayores a cero', () => {
    wrapper.vm.registros = registros
    expect(wrapper.vm.porcentajeParcial(registros[0])).toEqual('100.0')
  })

  it('método "porcentajeParcial" funciona correctamente con "registros" vacío', () => {
    expect(wrapper.vm.porcentajeParcial(registros[0])).toEqual(0)
  })

  it('método "porcentajeParcial" funciona correctamente con "registros" igual a cero', () => {
    const estudiante = [{
      id: 4634,
      iniciales: 'ABC',
      usuario: {
        id: 9433,
        nombre: 'Juan',
        apellido_paterno: 'Castro',
        apellido_materno: 'Gonzalez',
        run: '12345678-9',
        registros: {
          minutas: 0,
          tema: 0,
          objetivos: 0,
          conclusiones: 0,
          items: 0,
          comentarios: 0,
          respuestas: 0
        }
      }
    }]
    wrapper.vm.registros = estudiante
    expect(wrapper.vm.porcentajeParcial(estudiante[0])).toEqual('0.0')
  })
})
