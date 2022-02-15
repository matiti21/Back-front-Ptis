import { shallowMount } from '@vue/test-utils'
import RevisionSemanal from '@/components/semanal/RevisionSemanal.vue'

describe('RevisionSemanal.vue', () => {
  const avance = {
    id: 8539453,
    emitida: false,
    activa: true,
    fecha_emision: '2020-12-28T20:34:45.945Z',
    minuta: {
      id: 2453,
      estudiante_id: 94534,
      correlativo: 1845,
      codigo: 'MINUTA_G04_03_2020',
      fecha_reunion: '2020-12-27T20:34:45.945Z',
      numero_sprint: 34,
      creada_el: '2020-12-27T20:34:45.945Z',
      asistencia: [
        {
          id: 4953,
          id_estudiante: 94534
        },
        {
          id: 9453,
          id_estudiante: 45334
        }
      ],
      items: [
        {
          id: 94534,
          descripcion: 'Item para la prueba',
          correlativo: 9453,
          tipo_item: {
            id: 9534,
            tipo: 'Logro'
          },
          responsables: {
            id: 945,
            asistencia_id: 4953
          }
        },
        {
          id: 2345345,
          descripcion: 'Otro item para la prueba',
          correlativo: 23534,
          tipo_item: {
            id: 54343,
            tipo: 'Meta'
          },
          responsables: {
            id: 13453,
            asistencia_id: 4953
          }
        },
        {
          id: 14513,
          descripcion: 'Este es un impedimento de prueba',
          correlativo: 143453,
          tipo_item: {
            id: 134543,
            tipo: 'Impedimento'
          },
          responsables: {
            id: 1934534,
            asistencia_id: 4953
          }
        }
      ],
      bitacora_estado: {
        id: 324534,
        tipo_estado: {
          id:4534,
          abreviacion: 'BOR'
        }
      }
    }
  }

  const grupo = {
    id: 94534,
    nombre: 'G08',
    proyecto: 'Proyecto para pruebas',
    correlativo: 8,
    estudiantes: [
      {
        id: 45334,
        iniciales: 'LMN',
        usuario: {
          id: 79435,
          nombre: 'Luisa',
          apellido_paterno: 'Martinez',
          apellido_materno: 'Norambuena',
          run: '11111111-1',
          email: 'luisa.martinez@algo.com'
        }
      },
      {
        id: 94534,
        iniciales: 'ABC',
        usuario: {
          id: 9543,
          nombre: 'Alberto',
          apellido_paterno: 'Becerra',
          apellido_materno: 'Cabrera',
          run: '12345678-9',
          email: 'alberto.becerra@algo.com',
        }
      }
    ],
    stakeholders: []
  }

  // Precarga del componente
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RevisionSemanal, {
      propsData: {
        grupo: grupo,
        minuta: avance
      }
    })
  })

  // Comienzo de test unitarios

  it('se asigna prop "grupo" correctamente', () => {
    expect(wrapper.props().grupo).toEqual(grupo)
  })

  it('se asigna prop "minuta" correctamente', () => {
    expect(wrapper.props().minuta).toEqual(avance)
  })

  it('variable "grupoSeleccionado" se inicializa correctamente con props', () => {
    expect(wrapper.vm.grupoSeleccionado).toEqual(grupo)
  })

  it('variable "bitacora" se inicializa correctamente con props', () => {
    expect(wrapper.vm.bitacora).toEqual(avance)
  })

  it('variable "itemsLogros" se inicializa correctamente', () => {
    const wrapper = shallowMount(RevisionSemanal, {
      propsData: {
        minuta: {},
        grupo: grupo
      }
    })
    expect(wrapper.vm.itemsLogros).toEqual([])
  })

  it('variable "itemsLogros" se inicializa correctamente con props', () => {
    expect(wrapper.vm.itemsLogros).toEqual([avance.minuta.items[0]])
  })

  it('variable "itemsMetas" se inicializa correctamente', () => {
    const wrapper = shallowMount(RevisionSemanal, {
      propsData: {
        minuta: {},
        grupo: grupo
      }
    })
    expect(wrapper.vm.itemsMetas).toEqual([])
  })

  it('variable "itemsMetas" se inicializa correctamente con props', () => {
    expect(wrapper.vm.itemsMetas).toEqual([avance.minuta.items[1]])
  })

  it('variable "itemsImpedimentos" se inicializa correctamente', () => {
    const wrapper = shallowMount(RevisionSemanal, {
      propsData: {
        minuta: {},
        grupo: grupo
      }
    })
    expect(wrapper.vm.itemsImpedimentos).toEqual([])
  })

  it('variable "itemsImpedimentos" se inicializa correctamente con props', () => {
    expect(wrapper.vm.itemsImpedimentos).toEqual([avance.minuta.items[2]])
  })

  it('propiedad computada "mostrarBitacora" funciona correctamente con "true"', () => {
    expect(wrapper.vm.mostrarBitacora).toBeTruthy()
  })

  it('propiedad computada "mostrarBitacora" funciona correctamente con "true"', () => {
    wrapper.vm.bitacora = {}
    expect(wrapper.vm.mostrarBitacora).toBeFalsy()
  })

  it('método "separarItems" funciona correctamente', () => {
    const items = [
      {id: 4534, tipo_item: {tipo: 'Logro'}},
      {id: 2353, tipo_item: {tipo: 'Logro'}},
      {id: 3434, tipo_item: {tipo: 'Meta'}},
      {id: 9323, tipo_item: {tipo: 'Meta'}},
      {id: 46345, tipo_item: {tipo: 'Impedimento'}},
      {id: 68923, tipo_item: {tipo: 'Impedimento'}}
    ]
    const logrosEsperados = [
      {id: 4534, tipo_item: {tipo: 'Logro'}},
      {id: 2353, tipo_item: {tipo: 'Logro'}}
    ]
    const metasEsperadas = [
      {id: 3434, tipo_item: {tipo: 'Meta'}},
      {id: 9323, tipo_item: {tipo: 'Meta'}}
    ]
    const impedimentosEsperados = [
      {id: 46345, tipo_item: {tipo: 'Impedimento'}},
      {id: 68923, tipo_item: {tipo: 'Impedimento'}}
    ]
    wrapper.vm.itemsLogros = []
    wrapper.vm.itemsMetas = []
    wrapper.vm.itemsImpedimentos = []
    wrapper.vm.separarItems(items)
    expect(wrapper.vm.itemsLogros.length).toEqual(2)
    expect(wrapper.vm.itemsMetas.length).toEqual(2)
    expect(wrapper.vm.itemsImpedimentos.length).toEqual(2)
    expect(wrapper.vm.itemsLogros).toEqual(logrosEsperados)
    expect(wrapper.vm.itemsMetas).toEqual(metasEsperadas)
    expect(wrapper.vm.itemsImpedimentos).toEqual(impedimentosEsperados)
  })

  it('método "buscarIdAsistencia" funciona correctamente', () => {
    expect(wrapper.vm.buscarIdAsistencia(94534)).toEqual(4953)
  })
  
  it('método "logrosPorEstudiante" funciona correctamente', () => {
    const esperado = [
      {
        id: 94534,
        descripcion: 'Item para la prueba',
        correlativo: 9453,
        tipo_item: {
          id: 9534,
          tipo: 'Logro'
        },
        responsables: {
          id: 945,
          asistencia_id: 4953
        }
      }
    ]
    expect(wrapper.vm.logrosPorEstudiante(94534)).toEqual(esperado)
  })

  it('método "metasPorEstudiante" funciona correctamente', () => {
    const esperado = [
      {
        id: 2345345,
        descripcion: 'Otro item para la prueba',
        correlativo: 23534,
        tipo_item: {
          id: 54343,
          tipo: 'Meta'
        },
        responsables: {
          id: 13453,
          asistencia_id: 4953
        }
      }
    ]
    expect(wrapper.vm.metasPorEstudiante(94534)).toEqual(esperado)
  })

  it('método "impedimentosPorEstudiante" funciona correctamente', () => {
    const esperado = [
      {
        id: 14513,
        descripcion: 'Este es un impedimento de prueba',
        correlativo: 143453,
        tipo_item: {
          id: 134543,
          tipo: 'Impedimento'
        },
        responsables: {
          id: 1934534,
          asistencia_id: 4953
        }
      }
    ]
    expect(wrapper.vm.impedimentosPorEstudiante(94534)).toEqual(esperado)
  })
})
