import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import TableroEst from '@/components/TableroEst.vue'

const apiUrl = '127.0.0.1:3000'

const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      grupo: {
        id: 93453,
        nombre: 'G01',
        proyecto: 'Proyecto de prueba unitario',
        correlativo: 34,
        jornada: 'Diurna',
        estudiantes: [{
          id: 92345,
          iniciales: 'ABC',
          usuario: {
            nombre: 'Alberto',
            apellido_paterno: 'Becerra',
            apellido_materno: 'Castro',
            run: '11111111-1',
            email: 'alberto.becerra@algo.com'
          }
        }],
        stakeholders: []
      }
    }
  }
})

jest.mock('axios')

const estados = [
  {
    id: 96345,
    motivo: 'Emitida para pruebas',
    revision: '0',
    fecha_emision: '2020-01-18T03:53:34.394Z',
    minuta: {
      id: 913453,
      codigo: 'MINUTA_G02_04_2020',
      correlativo: 9,
      fecha_reunion: '2021-01-12T00:00:00.000Z',
      tipo_minuta: 'Cliente',
      creada_por: 'ABC',
      creada_el: '2021-01-22T04:23:53.945Z'
    },
    estado: {
      id: 194534,
      abreviacion: 'CER',
      descripcion: 'Cerrada'
    }
  },
  {
    id: 13534,
    motivo: 'Emitida para pruebas',
    revision: 'A',
    fecha_emision: '2020-01-18T03:53:34.394Z',
    minuta: {
      id: 34593,
      codigo: 'MINUTA_G02_05_2020',
      correlativo: 10,
      fecha_reunion: '2021-01-12T00:00:00.000Z',
      tipo_minuta: 'Coordinacion',
      creada_por: 'ABC',
      creada_el: '2021-01-22T04:23:53.945Z'
    },
    estado: {
      id: 23543,
      abreviacion: 'BOR',
      descripcion: 'Borrador'
    }
  }
]

const revision = [
  {
    id: 13239,
    motivo: 'Emitida para pruebas',
    revision: 'C',
    fecha_emision: '2020-01-18T03:53:34.394Z',
    minuta: {
      id: 34593,
      codigo: 'MINUTA_G02_05_2020',
      correlativo: 10,
      fecha_reunion: '2021-01-12T00:00:00.000Z',
      tipo_minuta: 'Coordinacion',
      creada_por: 'ABC',
      creada_el: '2021-01-22T04:23:53.945Z'
    },
    estado: {
      id: 23543,
      abreviacion: 'CIG',
      descripcion: 'Comentada por integrante del grupo'
    }
  }
]

const respondidas = [
  {
    id: 194534,
    motivo: 'Emitida para pruebas',
    revision: 'D',
    fecha_emision: '2020-01-18T03:53:34.394Z',
    minuta: {
      id: 34593,
      codigo: 'MINUTA_G02_05_2020',
      correlativo: 10,
      fecha_reunion: '2021-01-12T00:00:00.000Z',
      tipo_minuta: 'Coordinacion',
      creada_por: 'ABC',
      creada_el: '2021-01-22T04:23:53.945Z'
    },
    estado: {
      id: 23543,
      abreviacion: 'RIG',
      descripcion: 'Respondida por integrante del grupo'
    }
  }
]

const avance = [
  {
    id: 72534,
    emitida: true,
    activa: true,
    fecha_emision: '2020-01-18T03:53:34.394Z',
    minuta: {
      id: 13459343,
      estudiante_id: 9435,
      codigo: 'MINUTA_G02_04_2020',
      correlativo: 13,
      fecha_reunion: '2021-01-12T00:00:00.000Z',
      numero_sprint: 3,
      creada_el: '2021-01-22T04:23:53.945Z',
      asistencia: [
        {
          id: 9453,
          id_estudiante: 643
        },
        {
          id: 2345,
          id_estudiante: 345
        }
      ],
      items: []
    },
    estado: {
      id: 194534,
      abreviacion: 'CER',
      descripcion: 'Cerrada'
    }
  }
]

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/minutas/revision/estados':
      return Promise.resolve({ data: estados })
    case apiUrl + '/minutas/revision/grupo':
      return Promise.resolve({ data: revision })
    case apiUrl + '/minutas/revision/respondidas':
      return Promise.resolve({ data: respondidas })
    case apiUrl + '/minutas/avances/semanales/grupo/93453':
      return Promise.resolve({ data: avance })
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('TableroEst.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TableroEst, {
      global: {
        plugins: [store]
      }
    })
  })

  it('se asigna prop "seleccionado" correctamente', () => {
    const wrapper = shallowMount(TableroEst, {
      propsData: {
        seleccionado: 4534515
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().seleccionado).toEqual(4534515)
  })

  it('se asigna prop "contador" correctamente', () => {
    const wrapper = shallowMount(TableroEst, {
      propsData: {
        contador: 94045923
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().contador).toEqual(94045923)
  })

  it('variable nombreTab de inicializa correctamente', () => {
    expect(wrapper.vm.nombreTab).toEqual('Borradores')
  })

  it('variable nombreTabs se inicializa correctamente', () => {
    const esperado = {
      borradores: 'Borradores',
      emitidas: 'Emitidas',
      revision: 'Revision',
      comentadas: 'Comentadas',
      respondidas: 'Respondidas',
      cerradas: 'Cerradas'
    }
    expect(wrapper.vm.nombreTabs).toEqual(esperado)
  })

  it('variable listaMinutas se inicializa correctamente', async () => {
    wrapper.vm.obtenerMinutas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaMinutas).toEqual(estados)
  })

  it('variable listaBorradores se inicializa correctamente', async () => {
    wrapper.vm.obtenerMinutas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaBorradores).toEqual([estados[1]])
  })

  it('variable listaComentadasGrupo se inicializa correctamente', () => {
    expect(wrapper.vm.listaComentadasGrupo).toEqual([])
  })

  it('variable listaComentadasCliente se inicializa correctamente', () => {
    expect(wrapper.vm.listaComentadasCliente).toEqual([])
  })

  it('variable listaRespondidasGrupo se inicializa correctamente', async () => {
    wrapper.vm.obtenerRespondidas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaRespondidasGrupo).toEqual(respondidas)
  })

  it('variable listaCerradas se inicializa correctamente', async () => {
    wrapper.vm.obtenerMinutas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaCerradas).toEqual([estados[0]])
  })

  it('variable listaEmitidas se inicializa correctamente', () => {
    expect(wrapper.vm.listaEmitidas).toEqual([])
  })

  it('variable listaRevision se inicializa correctamente', async () => {
    wrapper.vm.obtenerParaRevisar()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaRevision).toEqual(revision)
  })

  it('variable "listaAvances" se inicializa correctamente', async () => {
    wrapper.vm.obtenerAvances()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaAvances).toEqual(avance)
  })

  it('variable "borradoresAvances" se inicializa correctamente', () => {
    expect(wrapper.vm.borradoresAvances).toEqual([])
  })

  it('variable "cerradasAvances" se inicializa correctamente', () => {
    expect(wrapper.vm.cerradasAvances).toEqual([])
  })

  it('variable "contar" se asigna con props correctamente', () => {
    const wrapper = shallowMount(TableroEst, {
      propsData: {
        contador: 0
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.contar).toEqual(0)
  })

  it('variable "minutaActual" se inicializa con props correctamente', () => {
    const wrapper = shallowMount(TableroEst, {
      propsData: {
        seleccionado: 462345
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.minutaActual).toEqual(462345)
  })

  it('propiedad computada mostrarBorradores funciona correctamente con true', () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaBorradores: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'BOR',
                descripcion: 'Borrador'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarBorradores).toBeTruthy()
  })

  it('propiedad computada mostrarBorradores funciona correctamente con false', () => {
    wrapper.vm.listaBorradores = []
    expect(wrapper.vm.mostrarBorradores).toBeFalsy()
  })

  it('propiedad computada mostrarEmitidas funciona correctamente con true', () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaEmitidas: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'EMI',
                descripcion: 'Emitida'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarEmitidas).toBeTruthy()
  })

  it('propiedad computada mostrarEmitidas funciona correctamente con false', () => {
    expect(wrapper.vm.mostrarEmitidas).toBeFalsy()
  })

  it('propiedad computada mostrarCerradas funciona correctamente con true', () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaCerradas: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'CER',
                descripcion: 'Cerrada'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarCerradas).toBeTruthy()
  })

  it('propiedad computada mostrarCerradas funciona correctamente con false', () => {
    wrapper.vm.listaCerradas = []
    expect(wrapper.vm.mostrarCerradas).toBeFalsy()
  })

  it('propiedad computada mostrarComentadasGrupo funciona correctamente con true', () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaComentadasGrupo: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'CIG',
                descripcion: 'Comentada por integrante del grupo'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarComentadasGrupo).toBeTruthy()
  })

  it('propiedad computada mostrarComentadasGrupo funciona correctamente con false', () => {
    expect(wrapper.vm.mostrarComentadasGrupo).toBeFalsy()
  })

  it('propiedad computada mostrarComentadasCliente funciona correctamente con true', () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaComentadasCliente: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'CSK',
                descripcion: 'Comentadas por el cliente'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarComentadasCliente).toBeTruthy()
  })

  it('propiedad computada mostrarComentadasCliente funciona correctamente con false', () => {
    expect(wrapper.vm.mostrarComentadasCliente).toBeFalsy()
  })

  it('propiedad computada mostrarRespondidasGrupo funciona correctamente con true', () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaRespondidasGrupo: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'RIG',
                descripcion: 'Respondida por un integrante del grupo'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarRespondidasGrupo).toBeTruthy()
  })

  it('propiedad computada mostrarRespondidasGrupo funciona correctamente con false', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.listaRespondidasGrupo = []
    expect(wrapper.vm.mostrarRespondidasGrupo).toBeFalsy()
  })

  it('propiedad computada mostrarRevision funciona correctamente con true', () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaRevision: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'EMI',
                descripcion: 'Emitida'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.mostrarRevision).toBeTruthy()
  })

  it('propiedad computada mostrarRevision funciona correctamente con false', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.listaRevision = []
    expect(wrapper.vm.mostrarRevision).toBeFalsy()
  })

  it('propiedad computada "mostrarBorrAvances" funciona correctamente con true', () => {
    wrapper.vm.borradoresAvances = [
      {
        id: 72534,
        emitida: true,
        activa: true,
        fecha_emision: '2020-01-18T03:53:34.394Z',
        minuta: {
          id: 13459343,
          estudiante_id: 9435,
          codigo: 'MINUTA_G02_04_2020',
          correlativo: 13,
          fecha_reunion: '2021-01-12T00:00:00.000Z',
          numero_sprint: 3,
          creada_el: '2021-01-22T04:23:53.945Z',
          asistencia: [
            {
              id: 9453,
              id_estudiante: 643
            },
            {
              id: 2345,
              id_estudiante: 345
            }
          ],
          items: []
        },
        estado: {
          id: 194534,
          abreviacion: 'BOR',
          descripcion: 'Borrador'
        }
      }
    ]
  })

  it('propiedad computada "mostrarBorrAvances" funciona correctamente con false', () => {
    expect(wrapper.vm.mostrarBorrAvances).toBeFalsy()
  })

  it('propiedad computada "mostrarCerrAvances" funciona correctamente con true', () => {
    wrapper.vm.cerradasAvances = [
      {
        id: 72534,
        emitida: true,
        activa: true,
        fecha_emision: '2020-01-18T03:53:34.394Z',
        minuta: {
          id: 13459343,
          estudiante_id: 9435,
          codigo: 'MINUTA_G02_04_2020',
          correlativo: 13,
          fecha_reunion: '2021-01-12T00:00:00.000Z',
          numero_sprint: 3,
          creada_el: '2021-01-22T04:23:53.945Z',
          asistencia: [
            {
              id: 9453,
              id_estudiante: 643
            },
            {
              id: 2345,
              id_estudiante: 345
            }
          ],
          items: []
        },
        estado: {
          id: 194534,
          abreviacion: 'CER',
          descripcion: 'Cerrada'
        }
      }
    ]
  })

  it('propiedad computada "mostrarCerrAvances" funciona correctamente con false', () => {
    expect(wrapper.vm.mostrarCerrAvances).toBeFalsy()
  })

  it('método elegirTab funciona correctamente', () => {
    wrapper.vm.elegirTab('Revision')
    expect(wrapper.vm.nombreTab).toEqual('Revision')
  })

  it('método convertirFecha funciona correctamente', () => {
    expect(wrapper.vm.convertirFecha('2020-11-19T17:45:00.000Z')).toEqual('19-11-2020')
  })

  it('método convertirFecha funciona correctamente con entrada null', () => {
    expect(wrapper.vm.convertirFecha(null)).toEqual('')
  })

  it('método convertirFecha funciona correctamente con entrada undefined', () => {
    expect(wrapper.vm.convertirFecha(undefined)).toEqual('')
  })

  it('método categorizarMinutas funciona correctamente' , () => {
    const wrapper = shallowMount(TableroEst, {
      data() {
        return {
          listaMinutas: [
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_04_2020-2_1207',
                creada_por: 'ABC',
                creada_el: '2020-11-16T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'BOR',
                descripcion: 'Borrador'
              }
            },
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_05_2020-2_1107',
                creada_por: 'ABC',
                creada_el: '2020-10-07T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'EMI',
                descripcion: 'Emitida'
              }
            },
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_05_2020-2_1107',
                creada_por: 'ABC',
                creada_el: '2020-10-07T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'CIG',
                descripcion: 'Comentada integrante del grupo'
              }
            },
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_05_2020-2_1107',
                creada_por: 'ABC',
                creada_el: '2020-10-07T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'CSK',
                descripcion: 'Comentada por el cliente'
              }
            },
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_05_2020-2_1107',
                creada_por: 'ABC',
                creada_el: '2020-10-07T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'RIG',
                descripcion: 'Respondida por integrante del grupo'
              }
            },
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_05_2020-2_1107',
                creada_por: 'ABC',
                creada_el: '2020-10-07T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'RSK',
                descripcion: 'Respondida por el cliente'
              }
            },
            {
              id: 46234,
              revision: 'A',
              minuta: {
                id: 42345,
                codigo: 'MINUTA_G02_05_2020-2_1107',
                creada_por: 'ABC',
                creada_el: '2020-10-07T17:29:00.000Z'
              },
              estado: {
                id: 46345,
                abreviacion: 'CER',
                descripcion: 'Cerrada'
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.categorizarMinutas()
    expect(wrapper.vm.listaBorradores.length).toEqual(1)
    expect(wrapper.vm.listaEmitidas.length).toEqual(1)
    expect(wrapper.vm.listaCerradas.length).toEqual(1)
    expect(wrapper.vm.listaComentadasGrupo.length).toEqual(1)
    expect(wrapper.vm.listaComentadasCliente.length).toEqual(1)
    expect(wrapper.vm.listaRespondidasGrupo.length).toEqual(0)
  })

  it('método "categorizarAvances" funciona correctamente', () => {
    wrapper.vm.listaAvances = [
      {
        id: 93453,
        emitida: true,
        activa: true,
        fecha_emision: '2020-01-18T03:53:34.394Z',
        minuta: {
          id: 23453,
          estudiante_id: 9435,
          codigo: 'MINUTA_G02_04_2020',
          correlativo: 13,
          fecha_reunion: '2021-01-12T00:00:00.000Z',
          numero_sprint: 3,
          creada_el: '2021-01-22T04:23:53.945Z',
          asistencia: [
            {
              id: 9453,
              id_estudiante: 643
            },
            {
              id: 2345,
              id_estudiante: 345
            }
          ],
          items: [],
          bitacora_estado: {
            id: 942345,
            tipo_estado: {
              id: 1,
              abreviacion: 'BOR',
              descripcion: 'Borrador'
            }
          }
        }
      },
      {
        id: 72534,
        emitida: true,
        activa: true,
        fecha_emision: '2020-01-18T03:53:34.394Z',
        minuta: {
          id: 13459343,
          estudiante_id: 9435,
          codigo: 'MINUTA_G02_04_2020',
          correlativo: 13,
          fecha_reunion: '2021-01-12T00:00:00.000Z',
          numero_sprint: 3,
          creada_el: '2021-01-22T04:23:53.945Z',
          asistencia: [
            {
              id: 9453,
              id_estudiante: 643
            },
            {
              id: 2345,
              id_estudiante: 345
            }
          ],
          items: [],
          bitacora_estado: {
            id: 194534,
            tipo_estado: {
              id: 3453,
              abreviacion: 'CER',
              descripcion: 'Cerrada'
            }
          }
        }
      }
    ]
    wrapper.vm.categorizarAvances()
    expect(wrapper.vm.borradoresAvances.length).toEqual(1)
    expect(wrapper.vm.cerradasAvances.length).toEqual(1)
  })

  it('método "obtenerMinutas" funciona correctamente', async () => {
    wrapper.vm.obtenerMinutas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaMinutas).toEqual(estados)
    expect(wrapper.vm.listaBorradores.length).toEqual(1)
    expect(wrapper.vm.listaBorradores[0]).toEqual(estados[1])
    expect(wrapper.vm.listaComentadasGrupo.length).toEqual(0)
    expect(wrapper.vm.listaComentadasCliente.length).toEqual(0)
    expect(wrapper.vm.listaCerradas.length).toEqual(1)
    expect(wrapper.vm.listaCerradas[0]).toEqual(estados[0])
    expect(wrapper.vm.listaEmitidas.length).toEqual(0)
  })

  it('método "obtenerParaRevisar" funciona correctamente', async () => {
    wrapper.vm.obtenerParaRevisar()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaRevision).toEqual(revision)
    expect(wrapper.vm.listaRevision.length).toEqual(1)
  })

  it('método "obtenerRespondidas" funciona correctamente', async () => {
    wrapper.vm.obtenerRespondidas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.listaRespondidasGrupo).toEqual(respondidas)
    expect(wrapper.vm.listaRespondidasGrupo.length).toEqual(1)
  })

  it('método "editarBorrador" funciona correctamente', async () => {
    wrapper.vm.editarBorrador(3459)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().bitacora).toBeTruthy()
    expect(wrapper.emitted().bitacora.length).toEqual(1)
    expect(wrapper.emitted().bitacora[0]).toEqual([3459])
  })

  it('método "revisarMinuta" funciona correctamente', async () => {
    wrapper.vm.revisarMinuta(94353)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().revision).toBeTruthy()
    expect(wrapper.emitted().revision.length).toEqual(1)
    expect(wrapper.emitted().revision[0]).toEqual([94353])
  })

  it('método "revisarComentarios" funciona correctamente', async () => {
    wrapper.vm.revisarComentarios(9453)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().comentarios).toBeTruthy()
    expect(wrapper.emitted().comentarios.length).toEqual(1)
    expect(wrapper.emitted().comentarios[0]).toEqual([9453])
  })

  it('método "revisarRespuestas" funciona correctamente', async () => {
    wrapper.vm.revisarRespuestas(9453)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().respuestas).toBeTruthy()
    expect(wrapper.emitted().respuestas.length).toEqual(1)
    expect(wrapper.emitted().respuestas[0]).toEqual([9453])
  })

  it('método "nuevaEmision" funciona correctamente', async () => {
    wrapper.vm.nuevaEmision(9453)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.minutaActual).toEqual(9453)
    expect(wrapper.emitted().emitir).toBeTruthy()
    expect(wrapper.emitted().emitir.length).toEqual(1)
    expect(wrapper.emitted().emitir[0]).toEqual([9453])
  })

  it('método "editarAvance" funciona correctamente', async () => {
    wrapper.vm.editarAvance(9453)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().avance).toBeTruthy()
    expect(wrapper.emitted().avance.length).toEqual(1)
    expect(wrapper.emitted().avance[0]).toEqual([9453])
  })

  it('método "revisarAvance" funciona correctamente', async () => {
    wrapper.vm.revisarAvance(9453)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted()['revisar-avance']).toBeTruthy()
    expect(wrapper.emitted()['revisar-avance'].length).toEqual(1)
    expect(wrapper.emitted()['revisar-avance'][0]).toEqual([9453])
  })

  it('método "verMinuta" funciona correctamente', async () => {
    wrapper.vm.verMinuta(63453)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted()['ver-minuta']).toBeTruthy()
    expect(wrapper.emitted()['ver-minuta'].length).toEqual(1)
    expect(wrapper.emitted()['ver-minuta'][0]).toEqual([63453])
  })

  it('método "revisionEstado" funciona correctamente con "ECI"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.revisionEstado('ECI')).toEqual('Coordinación de grupo')
  })

  it('método "revisionEstado" funciona correctamente con "ERC"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.revisionEstado('ERC')).toEqual('Para el cliente')
  })

  it('método "revisionEstado" funciona correctamente con "EAC"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.revisionEstado('EAC')).toEqual('Para aprobación')
  })

  it('método "revisionEstado" funciona correctamente con "EF"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.revisionEstado('EF')).toEqual('Emisión final')
  })

  it('método "revisionEstado" funciona correctamente con "PA"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.revisionEstado('PA')).toEqual('Sin estado')
  })

  it('método "actualizarTipo" funciona correctamente con tipo igual a "Coordinacion"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.actualizarTipo('Coordinacion')).toEqual('Coordinación')
  })

  it('método "actualizarTipo" funciona correctamente con tipo distinto a "Coordinacion"', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.actualizarTipo('algo')).toEqual('algo')
  })
})
