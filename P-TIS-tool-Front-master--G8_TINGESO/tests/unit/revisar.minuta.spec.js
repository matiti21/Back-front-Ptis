import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import RevisarMinuta from '@/components/comentarios/RevisarMinuta.vue'

const apiUrl = '127.0.0.1:3000'

// Mock store
const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      grupo: {
        id: 946346,
        nombre: 'G03',
        proyecto: 'Pruebas unitarias',
        correlativo: 3,
        estudiantes: [
          {
            id: 63245,
            iniciales: 'CGL',
            usuario: {
              nombre: 'Carlos',
              apellido_paterno: 'Gonzalez',
              apellido_materno: 'León',
              run: '19000111-3',
              email: 'carlos.gonzalez@algo.com'
            }
          },
          {
            id: 14613,
            iniciales: 'FDT',
            usuario: {
              nombre: 'Francisco',
              apellido_paterno: 'Dominguez',
              apellido_materno: 'Toloza',
              run: '10234567-3',
              email: 'francisco.dominguez@algo.com'
            }
          }
        ],
        stakeholders: [
          {
            id: 894534,
            iniciales: 'MFP',
            usuario: {
              nombre: 'María',
              apellido_paterno: 'Fernandez',
              apellido_materno: 'Pérez',
              email: 'maria.fernandez@algo.com'
            }
          },
          {
            id: 463453,
            iniciales: 'CPM',
            usuario: {
              nombre: 'Carlos',
              apellido_paterno: 'Palacios',
              apellido_materno: 'Mendez',
              email: 'carlos.palacios@algo.com'
            }
          }
        ]
      }
    }
  }
})

// Variables globales
const minuta = {
  id: 194623,
  revision: 'C',
  motivo: 'Emitida para coordinación interna',
  identificador: 'ECI',
  minuta: {
    id: 9463,
    codigo: 'MINUTA_G03_04_2020-2_1119',
    correlativo: 4,
    tema: 'Esto es una prueba',
    creada_por: 'CGL',
    creada_el: '2020-11-30T06:43:32.000Z',
    tipo: 'Coordinación',
    fecha_reunion: '2020-11-19T00:00:00.000Z',
    h_inicio: '2000-01-01T11:20:00.000Z',
    h_termino: '2000-01-01T12:20:00.000Z',
    clasificacion: {
      informativa: true,
      avance: false,
      coordinacion: false,
      decision: false,
      otro: true
    },
    objetivos: [
      {
        id: 962353,
        descripcion: 'Este es un objetivo para la prueba',
        bitacora_revision_id: 194623
      },
      {
        id: 2345434,
        descripcion: 'Otro objetivo para la prueba',
        bitacora_revision_id: 194623
      }
    ],
    conclusiones: [
      {
        id: 4634533,
        descripcion: 'Esta es una coclusión para la prueba',
        bitacora_revision_id: 194623
      }
    ],
    asistencia: [
      {
        id: 9434634,
        iniciales: 'FDT',
        id_estudiante: 14613,
        id_stakeholder: null,
        tipo: 'PRE',
        descripcion: 'Presente'
      },
      {
        id: 1563453,
        iniciales: 'CGL',
        id_estudiante: 63245,
        id_stakeholder: null,
        tipo: 'ACA',
        descripcion: 'Ausente con aviso'
      }
    ],
    items: [
      {
        id: 134634,
        tipo: 'Info',
        correlativo: 1,
        descripcion: 'Este es un item para la prueba',
        fecha: null,
        responsables: [
          {
            id: 23463,
            asistencia_id: 1563453
          }
        ]
      },
      {
        id: 134534,
        tipo: 'Info',
        correlativo: 2,
        descripcion: 'Otro item para la prueba',
        fecha: '2020-11-18T00:00:00.000Z',
        responsables: []
      }
    ]
  }
}

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/minutas/194623':
      return Promise.resolve({data: minuta})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('RevisarMinuta.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RevisarMinuta, {
      propsData: {
        idBitacora: 923453
      },
      global: {
        plugins: [store]
      }
    })
  })

  // Cominezo de pruebas unitarias
  it('se asigna props "idBitacora" adecuadamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.props().idBitacora).toEqual(923453)
  })

  it('variable "id" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.id).toEqual(923453)
  })

  it('variable "bitacora" se inicializa correctamente', async () => {
    const wrapper = shallowMount(RevisarMinuta, {
      propsData: {
        idBitacora: 194623
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.obtenerMinuta(194623)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.bitacora).toEqual(minuta)
  })

  it('método "obtenerMinuta" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.bitacora = {}
    wrapper.vm.obtenerMinuta(194623)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.bitacora).toEqual(minuta)
  })

  it('método "cerrar" funciona correctamente', async () => {
    wrapper.vm.cerrar()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })
})
