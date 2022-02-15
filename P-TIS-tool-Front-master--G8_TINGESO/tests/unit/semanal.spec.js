import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import Semanal from '@/components/semanal/Semanal.vue'

const estudiante = {
  id: 94534,
  iniciales: 'ABC',
  usuario_id: 9543,
  seccion_id: 93453,
  grupo_id: 925353,
  usuario: {
    id: 13452,
    nombre: 'Alberto',
    apellido_paterno: 'Becerra',
    apellido_materno: 'Cabrera',
    run: '12345678-9',
    email: 'alberto.becerra@algo.com',
    rol_id: 25925
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

const store = createStore({
  state() {
    return {
      apiUrl: '127.0.0.1:3000',
      estudiante: estudiante,
      grupo: grupo
    }
  }
})

const semestre = {
  id: 24538,
  numero: 1,
  agno: 2021,
  activo: true,
  inicio: '2021-03-05T00:00:00.000Z',
  fin: '2021-07-15T00:00:00.000Z'
}

jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case '127.0.0.1:3000/minutas/correlativo/semanal/94534':
      return Promise.resolve({data: 2945})
    case '127.0.0.1:3000/semestres':
      return Promise.resolve({data: semestre})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('Semanal.vue', () => {
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

  const item = [{id: 0, descripcion: '', correlativo: 1}]

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Semanal, {
      propsData: {
        avance: avance,
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
  })


  it('se asigna prop "avance" correctamente', () => {
    expect(wrapper.props().avance).toEqual(avance)
  })

  it('se asigna prop "tipoMinuta" correctamente', () => {
    expect(wrapper.props().tipoMinuta).toEqual(3)
  })

  it('variable "id" se inicializa correctamente', () => {
    expect(wrapper.vm.id).toEqual(0)
  })

  it('variable "bitacora" se inicializa correctamente con prop', () => {
    expect(wrapper.vm.bitacora).toEqual(avance)
  })

  it('variable "minuta" se inicializa correctamente sin props', () => {
    const esperado = {
      estudiante_id: 0,
      codigo: '',
      correlativo: '',
      fecha_avance: '',
      tipo_minuta_id: 3
    }
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.minuta).toEqual(esperado)
  })

  it('variable "minuta" se inicializa correctamente con props', () => {
    const esperado = {
      estudiante_id: 94534,
      codigo: 'MINUTA_G04_03_2020',
      correlativo: 1845,
      fecha_avance: '2020-12-27',
      tipo_minuta_id: 3
    }
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.minuta).toEqual(esperado)
  })

  it('variable "numeroSprint" se inicializa correctamente sin props', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.numeroSprint).toEqual('')
  })

  it('variable "numeroSprint" se inicializa correctamente con props', () => {
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.numeroSprint).toEqual(34)
  })

  it('variable "logros" se inicializa correctamente sin props', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.logros).toEqual(item)
  })

  it('variable "logros" se inicializa correctamente con props', () => {
    const esperado = [{
      id: 94534,
      descripcion: 'Item para la prueba',
      correlativo: 9453
    }]
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.logros).toEqual(esperado)
  })

  it('variable "metas" se inicializa correctamente sin props', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.metas).toEqual(item)
  })

  it('variable "metas" se inicializa correctamente con props', () => {
    const esperado = [{
      id: 2345345,
      descripcion: 'Otro item para la prueba',
      correlativo: 23534
    }]
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.metas).toEqual(esperado)
  })

  it('variable "semestre" se inicializa correctamente', () => {
    expect(wrapper.vm.semestre).toEqual({})
  })

  it('variable "entradas" se inicializa correctamente', () => {
    const esperado = {
      numeroSprint: {error: false, mensaje: ''},
      fechaAvance: false,
      logros: false,
      metas: false,
      impedimentos: false
    }
    expect(wrapper.vm.entradas).toEqual(esperado)
  })

  it('variable "itemsLogros" se inicializa correctamente sin props', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.itemsLogros).toEqual([])
  })

  it('variable "itemsLogros" se inicializa correctamente con props', () => {
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
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.itemsLogros).toEqual(esperado)
  })

  it('variable "itemsMetas" se inicializa correctamente sin props', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipo_minuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.itemsMetas).toEqual([])
  })

  it('variable "itemsMetas" se inicializa correctamente con props', () => {
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
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.itemsMetas).toEqual(esperado)
  })

  it('variable "itemsImpedimentos" se inicializa correctamente sin props', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipo_minuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.itemsMetas).toEqual([])
  })

  it('variable "itemsImpedimentos" se inicializa correctamente con props', () => {
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
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.itemsImpedimentos).toEqual(esperado)
  })

  it('variable "emitir" se inicializa correctamente', () => {
    expect(wrapper.vm.emitir).toBeFalsy()
  })

  it('propiedad computada "actualizarAvance" funciona correctamente con "true"', () => {
    expect(wrapper.vm.actualizarAvance).toBeTruthy()
  })

  it('propiedad computada "actualizarAvance" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.actualizarAvance).toBeFalsy()
  })

  it('propiedad computada "compagnerosGrupo" funciona correctamente', () => {
    const esperado = [
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
      }
    ]
    expect(wrapper.vm.compagnerosGrupo).toEqual(esperado)
  })

  it('propiedad computada "mostrarEmitir" funciona correctamente con "true"', () => {
    expect(wrapper.vm.mostrarEmitir).toBeTruthy()
  })

  it('propiedad computada "mostrarEmitir" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarEmitir).toBeFalsy()
  })

  it('método "removeFromArray" funciona correctamente', () => {
    const array = ['Papa', 'Manzana', 'Naranja']
    const resultado = ['Manzana', 'Naranja']
    wrapper.vm.removeFromArray(array, 'Papa')
    expect(array).toEqual(resultado)
  })

  it('método "agregarLogro" funciona correctamente', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.agregarLogro()
    expect(wrapper.vm.logros.length).toEqual(2)
    expect(wrapper.vm.logros[0]).toEqual(item[0])
    expect(wrapper.vm.logros[1]).toEqual({id: 0, descripcion: '', correlativo: 2})
  })

  it('método "removerLogro" funciona correctamente con largo "logros" igual a uno', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.removerLogro(wrapper.vm.logros[0])
    expect(wrapper.vm.logros).toEqual(item)
  })

  it('método "removerLogro" funciona correctamente con largo "logros" mayor a uno', () => {
    const esperado = [
      {id: 0, descripcion: '', correlativo: 1},
      {id: 0, descripcion: '', correlativo: 3}
    ]
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.agregarLogro()
    wrapper.vm.agregarLogro()
    wrapper.vm.removerLogro(wrapper.vm.logros[1])
    expect(wrapper.vm.logros).toEqual(esperado)
  })

  it('método "agregarMeta" funciona correctamente', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.agregarMeta()
    expect(wrapper.vm.metas.length).toEqual(2)
    expect(wrapper.vm.metas[0]).toEqual(item[0])
    expect(wrapper.vm.metas[1]).toEqual({id: 0, descripcion: '', correlativo: 2})
  })

  it('método "removerMeta" funciona correctamente con largo "metas" igual a uno', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.removerMeta(wrapper.vm.metas[0])
    expect(wrapper.vm.metas).toEqual(item)
  })

  it('método "removerMeta" funciona correctamente con largo "metas" mayor a uno', () => {
    const esperado = [
      {id: 0, descripcion: '', correlativo: 1},
      {id: 0, descripcion: '', correlativo: 3}
    ]
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.agregarMeta()
    wrapper.vm.agregarMeta()
    wrapper.vm.removerMeta(wrapper.vm.metas[1])
    expect(wrapper.vm.metas).toEqual(esperado)
  })

  it('método "establecerId" funciona correctamente', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.establecerId()
    expect(wrapper.vm.minuta.estudiante_id).toEqual(94534)
  })

  it('método "establecerCodigo" funciona correctamente', async () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    await wrapper.vm.$nextTick()
    wrapper.vm.minuta.correlativo = 9
    wrapper.vm.minuta.fecha_avance = '2021-01-14'
    expect(wrapper.vm.establecerCodigo()).toEqual('MINUTA_G08_09_2021-1_0114')
  })

  it('método "obtenerCorrelativo" funciona correctamente', async () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.minuta.correlativo).toEqual(2945)
  })

  it('método "obtenerSemestre" funciona correctamente', async () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.semestre).toEqual(semestre)
  })

  it('método "emitirMinuta" funciona correctamente', () => {
    wrapper.vm.emitirMinuta()
    expect(wrapper.vm.emitir).toBeTruthy()
  })

  it('método "cerrar" funciona correctamente', async () => {
    wrapper.vm.cerrar()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })

  it('método "convertirFecha" funciona correctamente', () => {
    expect(wrapper.vm.convertirFecha('2021-01-15T00:00:00.000Z')).toEqual('2021-01-15')
  })

  it('método "separarItems" funciona correctamente', () => {
    const items = [
      {id: 4534, tipo_item: {tipo: 'Logro'}},
      {id: 2353, tipo_item: {tipo: 'Logro'}},
      {id: 3434, tipo_item: {tipo: 'Meta'}},
      {id: 9323, tipo_item: {tipo: 'Meta'}},
      {id: 13453, tipo_item: {tipo: 'Impedimento'}},
      {id: 64345, tipo_item: {tipo: 'Impedimento'}}
    ]
    const logrosEsperados = [
      {id: 4534, tipo_item: {tipo: 'Logro'}},
      {id: 2353, tipo_item: {tipo: 'Logro'}}
    ]
    const metasEsperadas =   [
      {id: 3434, tipo_item: {tipo: 'Meta'}},
      {id: 9323, tipo_item: {tipo: 'Meta'}}
    ]
    const impedimentosEsperados = [
      {id: 13453, tipo_item: {tipo: 'Impedimento'}},
      {id: 64345, tipo_item: {tipo: 'Impedimento'}}
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
    wrapper.vm.convertirBitacora()
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
    wrapper.vm.convertirBitacora()
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
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.impedimentosPorEstudiante(94534)).toEqual(esperado)
  })

  it('método "mostrarAvance" funciona correctamente con "true"', () => {
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.mostrarAvance(94534)).toBeTruthy()
  })

  it('método "mostrarAvance" funciona correctamente con "false"', () => {
    expect(wrapper.vm.mostrarAvance(45334)).toBeFalsy()
  })

  it('método "convertirItems" funciona correctamente', () => {
    const esperado = [
      {id: 94534, descripcion: 'Item para la prueba', correlativo: 9453},
      {id: 2345345, descripcion: 'Otro item para la prueba', correlativo: 23534},
      {id: 14513, descripcion: 'Este es un impedimento de prueba', correlativo: 143453}
    ]
    expect(wrapper.vm.convertirItems(wrapper.vm.bitacora.minuta.items)).toEqual(esperado)
  })

  it('método "convertirLogros" funciona correctamente', () => {
    const esperado = [{id: 94534, descripcion: 'Item para la prueba', correlativo: 9453}]
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.convertirLogros()).toEqual(esperado)
  })

  it('método "convertirMetas" funciona correctamente', () => {
    const esperado = [{id: 2345345, descripcion: 'Otro item para la prueba', correlativo: 23534}]
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.convertirMetas()).toEqual(esperado)
  })

  it('método "convertirImpedimentos" funciona correctamente', () => {
    const esperado = [{id: 14513, descripcion: 'Este es un impedimento de prueba', correlativo: 143453}]
    wrapper.vm.obtenerCorrelativo()
    wrapper.vm.obtenerSemestre()
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.convertirImpedimentos()).toEqual(esperado)
  })

  it('método "convertirBitacora" funciona correctamente', () => {
    const logros = [{id: 94534, descripcion: 'Item para la prueba', correlativo: 9453}]
    const metas = [{id: 2345345, descripcion: 'Otro item para la prueba', correlativo: 23534}]
    const impedimentos = [{id: 14513, descripcion: 'Este es un impedimento de prueba', correlativo: 143453}]
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.bitacora = avance
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.minuta.estudiante_id).toEqual(94534)
    expect(wrapper.vm.minuta.codigo).toEqual('MINUTA_G04_03_2020')
    expect(wrapper.vm.minuta.correlativo).toEqual(1845)
    expect(wrapper.vm.minuta.fecha_avance).toEqual('2020-12-27')
    expect(wrapper.vm.numeroSprint).toEqual(34)
    expect(wrapper.vm.logros).toEqual(logros)
    expect(wrapper.vm.metas).toEqual(metas)
    expect(wrapper.vm.impedimentos).toEqual(impedimentos)
  })

  it('método "validarSprint" funciona correctamente con "numeroSprint" con valor "null"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = null
    expect(wrapper.vm.validarSprint()).toBeFalsy()
    expect(wrapper.vm.entradas.numeroSprint.error).toBeTruthy()
    expect(wrapper.vm.entradas.numeroSprint.mensaje).toEqual('No se ha ingresado el núermo del Sprint')
  })

  it('método "validarSprint" funciona correctamente con "numeroSprint" con valor "undefined"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = undefined
    expect(wrapper.vm.validarSprint()).toBeFalsy()
    expect(wrapper.vm.entradas.numeroSprint.error).toBeTruthy()
    expect(wrapper.vm.entradas.numeroSprint.mensaje).toEqual('No se ha ingresado el núermo del Sprint')
  })

  it('método "validarSprint" funciona correctamente con "numeroSprint" con valor ""', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = ''
    expect(wrapper.vm.validarSprint()).toBeFalsy()
    expect(wrapper.vm.entradas.numeroSprint.error).toBeTruthy()
    expect(wrapper.vm.entradas.numeroSprint.mensaje).toEqual('No se ha ingresado el núermo del Sprint')
  })

  it('método "validarSprint" funciona correctamente con "numeroSprint" con letras', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = 'Abc'
    expect(wrapper.vm.validarSprint()).toBeFalsy()
    expect(wrapper.vm.entradas.numeroSprint.error).toBeTruthy()
    expect(wrapper.vm.entradas.numeroSprint.mensaje).toEqual('Error de entrada. Por favor, sólo números enteros.')
  })

  it('método "validarSprint" funciona correctamente con "numeroSprint" con números negativos', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = -4
    expect(wrapper.vm.validarSprint()).toBeFalsy()
    expect(wrapper.vm.entradas.numeroSprint.error).toBeTruthy()
    expect(wrapper.vm.entradas.numeroSprint.mensaje).toEqual('No se aceptan valores menores a cero')
  })

  it('método "validarSprint" funciona correctamente con "numeroSprint" con número decimal', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = 2.5
    expect(wrapper.vm.validarSprint()).toBeTruthy()
    expect(wrapper.vm.numeroSprint).toEqual(2)
    expect(wrapper.vm.entradas.numeroSprint.error).toBeFalsy()
    expect(wrapper.vm.entradas.numeroSprint.mensaje).toEqual('')
  })

  it('método "validarSprint" funciona correctamente con "numeroSprint" con número enteros', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = 5
    expect(wrapper.vm.validarSprint()).toBeTruthy()
    expect(wrapper.vm.entradas.numeroSprint.error).toBeFalsy()
    expect(wrapper.vm.entradas.numeroSprint.mensaje).toEqual('')
  })

  it('método "validarFecha" funciona correctamente con "fecha_avance" igual a "null"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.minuta.fecha_avance = null
    expect(wrapper.vm.validarFecha()).toBeFalsy()
    expect(wrapper.vm.entradas.fechaAvance).toBeTruthy()
  })

  it('método "validarFecha" funciona correctamente con "fecha_avance" igual a "undefined"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.minuta.fecha_avance = undefined
    expect(wrapper.vm.validarFecha()).toBeFalsy()
    expect(wrapper.vm.entradas.fechaAvance).toBeTruthy()
  })

  it('método "validarFecha" funciona correctamente con "fecha_avance" igual a ""', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.minuta.fecha_avance = ''
    expect(wrapper.vm.validarFecha()).toBeFalsy()
    expect(wrapper.vm.entradas.fechaAvance).toBeTruthy()
  })

  it('método "validarFecha" funciona correctamente con "fecha_avance" distinto a "regExp"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.minuta.fecha_avance = '6453-623452-62345324'
    expect(wrapper.vm.validarFecha()).toBeFalsy()
    expect(wrapper.vm.entradas.fechaAvance).toBeTruthy()
  })

  it('método "validarFecha" funciona correctamente con "fecha_avance" con "regExp"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.minuta.fecha_avance = '1933-91-51'
    expect(wrapper.vm.validarFecha()).toBeTruthy()
    expect(wrapper.vm.entradas.fechaAvance).toBeFalsy()
  })

  it('método "validarLista" funciona correctamente con lista de largo igual a uno y descripcion igual a ""', () => {
    const lista = [{descripcion: ''}]
    let entrada = {error: ''}
    expect(wrapper.vm.validarLista(lista, 'error', entrada)).toBeFalsy()
    expect(entrada.error).toBeTruthy()
  })

  it('método "validarLista" funciona correctamente con lista de largo igual a uno y descripcion distinto a ""', () => {
    const lista = [{descripcion: 'Esto es una prueba'}]
    let entrada = {error: ''}
    expect(wrapper.vm.validarLista(lista, 'error', entrada)).toBeTruthy()
    expect(entrada.error).toBeFalsy()
  })

  it('método "validarLista" funciona correctamente con lista de largo mayor a uno y descripcion igual a ""', () => {
    const lista = [{descripcion: 'Esto es una prueba'}, {descripcion: ''}]
    let entrada = {error: ''}
    expect(wrapper.vm.validarLista(lista, 'error', entrada)).toBeFalsy()
    expect(entrada.error).toBeTruthy()
  })

  it('método "validarLista" funciona correctamente con lista de largo mayor a uno y descripcion distinto a ""', () => {
    const lista = [{descripcion: 'Esto es una prueba'}, {descripcion: 'Otra prueba'}]
    let entrada = {error: ''}
    expect(wrapper.vm.validarLista(lista, 'error', entrada)).toBeTruthy()
    expect(entrada.error).toBeFalsy()
  })

  it('método "validarLogros" funciona correctamente con "true"', () => {
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.validarLogros()).toBeTruthy()
    expect(wrapper.vm.entradas.logros).toBeFalsy()
  })

  it('método "validarLogros" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarLogros()).toBeFalsy()
    expect(wrapper.vm.entradas.logros).toBeTruthy()
  })

  it('método "validarMetas" funciona correctamente con "true"', () => {
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.validarMetas()).toBeTruthy()
    expect(wrapper.vm.entradas.metas).toBeFalsy()
  })

  it('método "validarMetas" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarMetas()).toBeFalsy()
    expect(wrapper.vm.entradas.metas).toBeTruthy()
  })

  it('método "validarImpedimentos" funciona correctamente con "true"', () => {
    wrapper.vm.convertirBitacora()
    expect(wrapper.vm.validarImpedimentos()).toBeTruthy()
    expect(wrapper.vm.entradas.impedimentos).toBeFalsy()
  })

  it('método "validarImpedimentos" funciona correctamente con false', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarImpedimentos()).toBeFalsy()
    expect(wrapper.vm.entradas.impedimentos).toBeTruthy()
  })

  it('método "validarFormulario" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = 6
    wrapper.vm.minuta.fecha_avance = '2021-02-15'
    wrapper.vm.logros = [{id: 534, descripcion: 'Esto es una prueba', correlativo: 5234}]
    wrapper.vm.metas = [{id: 954, descripcion: 'Esta es una meta de prueba', correlativo: 9453}]
    wrapper.vm.impedimentos = [{id: 14513, descripcion: 'Este es un impedimento de prueba', correlativo: 143453}]
    expect(wrapper.vm.validarFormulario()).toBeTruthy()
  })

  it('método "validarFormulario" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Semanal, {
      propsData: {
        avance: {},
        tipoMinuta: 3
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.numeroSprint = 6
    wrapper.vm.minuta.fecha_avance = '2021-02-15'
    wrapper.vm.logros = [{id: 534, descripcion: '', correlativo: 5234}]
    wrapper.vm.metas = [{id: 954, descripcion: 'Esta es una meta de prueba', correlativo: 9453}]
    expect(wrapper.vm.validarFormulario()).toBeFalsy()
  })
})
