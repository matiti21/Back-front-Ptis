import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import Minuta from '@/components/Minuta.vue'

// Variables globales
const apiUrl = '127.0.0.1:3000'

const tipoItems = [
  {id: 1, tipo: 'Agenda', descripcion: 'tipo agenda'},
  {id: 2, tipo: 'Hecho', descripcion: 'tipo hecho'},
  {id: 3, tipo: 'Compromiso', descripcion: 'tipo compromiso'}
]

const tipoAsistencias = [
  { id: 1, tipo: 'PRE'},
  { id: 2, tipo: 'AUS'},
  { id: 3, tipo: 'ACA'}
]

const tipoEstados = [
  { id: 62343, abreviacion: 'BOR', descripcion: 'Borrador'},
  { id: 16345, abreviacion: 'EMI', descripcion: 'Emitida'},
  { id: 34535, abreviacion: 'CIG', descripcion: 'Comentada por integrante del grupo'},
  { id: 43434, abreviacion: 'CSK', descripcion: 'Comentada por stakeholder'},
  { id: 98345, abreviacion: 'RIG', descripcion: 'Respondida por integrante del grupo'},
  { id: 78453, abreviacion: 'CER', descripcion: 'Cerrada'}
]

const idUsuario = 91345

const idGrupo = 462353

const grupo = {
  id: idGrupo,
  nombre: 'Proyecto de prueba',
  proyecto: 'Pagina web de prueba',
  correlativo: 46234543,
  estudiantes: [
    {
      id: 5,
      iniciales: 'CGL',
      usuario: {
        id: idUsuario,
        nombre: 'Carlos',
        apellido_paterno: 'Gonzalez',
        apellido_materno: 'Lopez'
      }
    },
    {
      id: 6,
      iniciales: 'FDT',
      usuario: {
        id: 134534,
        nombre: 'Fernanda',
        apellido_paterno: 'Díaz',
        apellido_materno: 'Torres'
      }
    }
  ],
  stakeholders: [
    {
      id: 5,
      iniciales: 'CGL',
      usuario: {
        id: 23543,
        nombre: 'Carlos',
        apellido_paterno: 'Gonzalez',
        apellido_materno: 'Lopez'
      }
    },
    {
      id: 6,
      iniciales: 'FDT',
      usuario: {
        id: 923453,
        nombre: 'Fernanda',
        apellido_paterno: 'Díaz',
        apellido_materno: 'Torres'
      }
    }
  ]
}

const estudiante = {
  id: 23534,
  iniciales: 'CGL',
  usuario_id: idUsuario,
  seccion_id: 1345343,
  grupo_id: idGrupo,
  usuario: {
    id: idUsuario,
    nombre: 'Carlos',
    apellido_paterno: 'Gonzalez',
    apellido_materno: 'Lopez',
    run: '11222333-4',
    email: 'carlos.gonzalez@algo.com',
    rol_id: 83453
  }
}

const semestre = {
  id: 184353,
  numero: 2,
  agno: 2020,
  activo: true,
  inicio: '2020-09-28T00:00:00.000Z',
  fin: '2021-01-29T00:00:00.000Z'
}

const nuevoCorrelativo = 1345

const idBitacora = 146343

const bitacora = {
  id: idBitacora,
  revision: 'J',
  motivo: 'Emitida para revision del cliente',
  identificador: 'ERC',
  minuta: {
    id: 9453453,
    codigo: 'MINUTA_G02_04_2020-2_0821',
    correlativo: 93453,
    tema: 'Esto es una prueba',
    creada_por: 'CGL',
    creada_el: '2020-08-21T08:16:00.000Z',
    tipo: 'Cliente',
    fecha_reunion: '2020-08-21T00:00:00.000Z',
    h_inicio: '2000-01-01T07:00:00.000Z',
    h_termino: '2000-01-01T08:00:00.000Z',
    clasificacion: {
      informativa: false,
      avance: true,
      coordinacion: false,
      decision: true,
      otro: false
    },
    objetivos: [
      { id: 63454, descripcion: 'Obj1' },
      { id: 34534, descripcion: 'Obj2' }
    ],
    conclusiones: [
      { id: 14534, descripcion: 'Con1' },
      { id: 89453, descripcion: 'Con2' }
    ],
    asistencia: [
      {
        id: 913453,
        iniciales: 'CGL',
        id_estudiante: 5,
        id_stakeholder: null,
        tipo: 'PRE',
        descripcion: 'Presente'
      },
      {
        id: 3453445,
        iniciales: 'FDT',
        id_estudiante: null,
        id_stakeholder: 6,
        tipo: 'ACA',
        descripcion: 'Ausente con aviso'
      }
    ],
    items: [
      {
        id: 9213453,
        tipo: 'Compromiso',
        correlativo: 91345,
        descripcion: 'Compromiso de prueba',
        fecha: '2020-08-29T00:00:00.000Z',
        responsables: [
          {
            id: 782345,
            asistencia_id: 913453
          }
        ]
      },
      {
        id: 734534,
        tipo: 'Hecho',
        correlativo: 13453,
        descripcion: 'Hecho de prueba',
        fecha: '',
        responsables: []
      },
      {
        id: 23453,
        tipo: 'Agenda',
        correlativo: 345342,
        descripcion: 'Agenda de prueba',
        fecha: '2020-09-12T00:00:00.000Z',
        responsables: [
          {
            id: 434534,
            asistencia_id: 3453445
          }
        ]
      }
    ]
  }
}

const asistenciaEst = [
  {estudiante: 5, stakeholder: '', asistencia: 1},
  {estudiante: 6, stakeholder: '', asistencia: 0}
]

const asistenciaStk = [
  {estudiante: '', stakeholder: 5, asistencia: 0},
  {estudiante: '', stakeholder: 6, asistencia: 3}
]

const clasificacion = {
  informativa: false,
  avance: true,
  coordinacion: false,
  decision: true,
  otro: false
}

const objetivos = [
  { id: 63454, descripcion: 'Obj1' },
  { id: 34534, descripcion: 'Obj2' }
]

const conclusiones = [
  { id: 14534, descripcion: 'Con1' },
  { id: 89453, descripcion: 'Con2' }
]

const listaItems = [
  {
    correlativo: 13453,
    descripcion: 'Hecho de prueba',
    fecha: '',
    tipo_item_id: 2,
    responsables: 0,
    entradas: {
      descripcion: false,
      fecha: false,
      tipo_item: false,
      responsables: false
    }
  },
  {
    correlativo: 91345,
    descripcion: 'Compromiso de prueba',
    fecha: '2020-08-29',
    tipo_item_id: 3,
    responsables: {tipo: 'est', id: 5},
    entradas: {
      descripcion: false,
      fecha: false,
      tipo_item: false,
      responsables: false
    }
  },
  {
    correlativo: 345342,
    descripcion: 'Agenda de prueba',
    fecha: '2020-09-12',
    tipo_item_id: 1,
    responsables: {tipo: 'stk', id: 6},
    entradas: {
      descripcion: false,
      fecha: false,
      tipo_item: false,
      responsables: false
    }
  }
]

// Mock store
const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      usuario: {
        id: idUsuario,
        nombre: 'Carlos',
        apellido_paterno: 'Gonzalez',
        apellido_materno: 'Lopez',
        run: '11222333-4',
        email: 'carlos.gonzalez@algo.com',
        rol: {
          id: 83453,
          rol: 'Estudiante',
          rango: 3
        }
      },
      tipoMinutas: [
        {id: 14634, tipo: 'Coordinacion', descripcion: 'Minuta entre estudiantes'},
        {id: 63453, tipo: 'Cliente', descripcion: 'Minuta con el cliente'},
        {id: 23534, tipo: 'Semanal', descripcion: 'Minuta avance semanal'}
      ]
    }
  }
})


// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/tipo_items':
      return Promise.resolve({data: tipoItems})
    case apiUrl + '/tipo_asistencias':
      return Promise.resolve({data: tipoAsistencias})
    case apiUrl + '/tipo_estados':
      return Promise.resolve({data: tipoEstados})
    case apiUrl + '/estudiantes/' + idUsuario:
      return Promise.resolve({data: estudiante})
    case apiUrl + '/grupos/' + idGrupo:
      return Promise.resolve({data: grupo})
    case apiUrl + '/semestres':
      return Promise.resolve({data: semestre})
    case apiUrl + '/minutas/correlativo/' + idGrupo:
      return Promise.resolve({data: nuevoCorrelativo})
    case apiUrl + '/minutas/' + idBitacora:
      return Promise.resolve({data: bitacora})
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.post.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/minutas':
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.patch.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/minutas/' + idMinuta:
      return Promise.resolve()
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('Minuta.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Minuta, {
      propsData: {
        idBitacora: 0,
        tipoMinuta: 63453
      },
      global: {
        plugins: [store]
      }
    })
  })

  it('se asigna prop "tipoMinuta" adecuadamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        tipoMinuta: 2
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().tipoMinuta).toBe(2)
  })

  it('se asigna prop "idBitacora" adecuadamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        idBitacora: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().idBitacora).toBe(3)
  })

  it('se asigna prop "idMotivo" adecuadamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        idMotivo: 5
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().idMotivo).toBe(5)
  })

  it('se asigna prop "letraRevision" adecuadamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        letraRevision: 'Q'
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().letraRevision).toBe('Q')
  })

  it('se asigna prop "reEmitir" adecuadamente como "true"', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        reEmitir: true
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().reEmitir).toBeTruthy()
  })

  it('se asigna prop "reEmitir" adecuadamente como "false"', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        reEmitir: false
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().reEmitir).toBeFalsy()
  })

  it('se asigna prop "estado" adecuadamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        estado: 'Esto es una prueba'
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.props().estado).toEqual('Esto es una prueba')
  })

  it('variable "bitacora" se inicializa correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        idBitacora: 345
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.bitacora).toEqual(345)
  })

  it('variable minuta se inicializa correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        tipoMinuta: 2
      },
      global: {
        plugins: [store]
      }
    })
    const minuta = {
      estudiante_id: 0,
      codigo: '',
      correlativo: 0,
      fecha_reunion: '',
      h_inicio: '',
      h_termino: '',
      tipo_minuta_id: 2,
      tipo: ''
    }
    expect(wrapper.vm.minuta).toEqual(minuta)
  })

  it('variable clasificacion se inicializa correctamente', () => {
    const clasificacion = {
      informativa: false,
      avance: false,
      coordinacion: false,
      decision: false,
      otro: false
    }
    expect(wrapper.vm.clasificacion).toEqual(clasificacion)
  })

  it('variable tema se inicializa correctamente', () => {
    expect(wrapper.vm.tema).toEqual('')
  })

  it('variable revision se inicializa correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        tipoMinuta: 1,
        idBitacora: 0,
        idMotivo: 1,
        letraRevision: 'A',
        reEmitir: false
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.revision).toEqual('A')
  })

  it('variable asistenciaEst se inicializa correctamente', () => {
    expect(wrapper.vm.asistenciaEst).toEqual([])
  })

  it('variable asistenciaStk se inicializa correctamente', () => {
    expect(wrapper.vm.asistenciaStk).toEqual([])
  })

  it('variable objetivos se inicializa correctamente', () => {
    expect(wrapper.vm.objetivos).toEqual([{id: 0, descripcion: ''}])
  })

  it('variable conclusiones se inicializa correctamente', () => {
    expect(wrapper.vm.conclusiones).toEqual([{id: 0, descripcion: ''}])
  })

  it('variable item se inicializa correctamente', () => {
    const item = {
      correlativo: 0,
      descripcion: '',
      fecha: '',
      tipo_item_id: 0,
      responsables: {tipo: '', id: 0},
      entradas: {
        descripcion: false,
        fecha: false,
        tipo_item: false,
        responsables: false
      }
    }
    expect(wrapper.vm.item).toEqual(item)
  })

  it('variable motivo_id se inicializa correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        tipoMinuta: 1,
        idBitacora: 0,
        idMotivo: 6,
        letraRevision: 'A',
        reEmitir: false
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.motivo_id).toEqual(6)
  })

  it('variable listaItems se inicializa correctamente', () => {
    const lista = [{
      correlativo: 1,
      descripcion: '',
      fecha: '',
      tipo_item_id: 0,
      responsables: {tipo: '', id: 0},
      entradas: {
        descripcion: false,
        fecha: false,
        tipo_item: false,
        responsables: false
      }
    }]
    expect(wrapper.vm.listaItems).toEqual(lista)
  })

  it('variable tipo_items se inicializa correctamente', () => {
    expect(wrapper.vm.tipo_items).toEqual([])
  })

  it('variable tipo_asistencias se inicializa correctamente', () => {
    expect(wrapper.vm.tipo_asistencias).toEqual([])
  })

  it('variable tipo_estados se inicializa correctamente', () => {
    expect(wrapper.vm.tipo_estados).toEqual([])
  })

  it('variable motivos se inicializa correctamente', () => {
    expect(wrapper.vm.motivos).toEqual([])
  })

  it('variable listaClasificacion se inicializa correctamente', () => {
    expect(wrapper.vm.listaClasificacion).toEqual([])
  })

  it('variable estudiante se inicializa correctamente', () => {
    expect(wrapper.vm.estudiante).toEqual({})
  })

  it('variable grupo se inicializa correctamente', () => {
    expect(wrapper.vm.grupo).toEqual({})
  })

  it('variable semestre se inicializa correctamente', () => {
    expect(wrapper.vm.semestre).toEqual({})
  })

  it('variable entradas se inicializa correctamente', () => {
    const entrada = {
      revision: {
        error: false,
        mensaje: ''
      },
      fecha_reunion: false,
      tema: false,
      h_inicio: false,
      h_termino: false,
      asistencias: false,
      clasificacion: false,
      objetivos: false,
      conclusiones: false
    }
    expect(wrapper.vm.entradas).toEqual(entrada)
  })

  it('variable "nuevaEmision" se inicializa correctamente con "true"', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        tipoMinuta: 1,
        idBitacora: 0,
        idMotivo: 6,
        letraRevision: 'A',
        reEmitir: true
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.nuevaEmision).toBeTruthy()
  })

  it('variable "nuevaEmision" se inicializa correctamente con "false"', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        tipoMinuta: 1,
        idBitacora: 0,
        idMotivo: 6,
        letraRevision: 'A',
        reEmitir: false
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.nuevaEmision).toBeFalsy()
  })

  it('variable "revisionEstado" se inicializa correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        tipoMinuta: 1,
        idBitacora: 0,
        idMotivo: 6,
        letraRevision: 'A',
        reEmitir: false,
        estado: 'Esto es una prueba'
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.revisionEstado).toEqual('Esto es una prueba')
  })

  it('propiedad computada esBorrador funciona correctamente con true', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        idBitacora: 3
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.esBorrador).toBeTruthy()
  })

  it('propiedad computada esBorrador funciona correctamente con false', () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        idBitacora: 0
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.esBorrador).toBeFalsy()
  })

  it('método removeFromArray funciona correctamente', () => {
    const array = ['Papa', 'Manzana', 'Naranja']
    const resultado = ['Manzana', 'Naranja']
    wrapper.vm.removeFromArray(array, 'Papa')
    expect(array).toEqual(resultado)
  })

  it('método nombreCompleto funciona correctamente', () => {
    const estudiante = {
      nombre: 'Pablo',
      apellido_paterno: 'Mackena',
      apellido_materno: 'Saldias'
    }
    expect(wrapper.vm.nombreCompleto(estudiante)).toEqual('Pablo Mackena Saldias')
  })

  it('método convertirFecha funciona correctamente', () => {
    const fecha = '2020-12-04T13:03:50.000Z'
    expect(wrapper.vm.convertirFecha(fecha)).toEqual('2020-12-04')
  })

  it('método buscarIdEnLista funciona correctamente', () => {
    const array = [{
      id: 1,
      abreviacion: 'BO'
    },
    {
      id: 2,
      abreviacion: 'QU'
    }]
    expect(wrapper.vm.buscarIdEnLista(array, 'abreviacion', 'QU')).toEqual(2)
  })

  it('método obtenerTipoMinuta funciona correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta:{
            tipo_minuta_id: 1,
            tipo: ''
          },
          tipoMinutas: [
          {
            id: 1,
            tipo: 'Coordinacion'
          },
          {
            id: 2,
            tipo: 'Cliente'
          }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.obtenerTipoMinuta()
    expect(wrapper.vm.minuta.tipo).toEqual('Coordinacion')
  })

  it('método obtenerTipoMinuta funciona correctamente con tipo_minuta_id null', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta:{
            tipo_minuta_id: null,
            tipo: ''
          },
          tipoMinutas: [
          {
            id: 1,
            tipo: 'Coordinacion'
          },
          {
            id: 2,
            tipo: 'Cliente'
          }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.obtenerTipoMinuta()
    expect(wrapper.vm.minuta.tipo).toEqual('')
  })

  it('método obtenerTipoMinuta funciona correctamente con tipo_minuta_id igual a "undefined"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta:{
            tipo_minuta_id: undefined,
            tipo: ''
          },
          tipoMinutas: [
          {
            id: 1,
            tipo: 'Coordinacion'
          },
          {
            id: 2,
            tipo: 'Cliente'
          }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.obtenerTipoMinuta()
    expect(wrapper.vm.minuta.tipo).toEqual('')
  })

  it('método convertirClasificacion funciona correctamente', () => {
    const clasificacion = {
      informativa: false,
      avance: true,
      coordinacion: false,
      decision: true,
      otro: false
    }
    expect(wrapper.vm.convertirClasificacion(clasificacion)).toEqual(['avance', 'decision'])
  })

  it('método convertirResponsable funciona correctamente para estudiantes', () => {
    const lista = [
      {
        id: 8,
        iniciales: 'FDT',
        id_estudiante: 6,
        id_stakeholder: null,
        tipo: 'PRE',
        descripcion: 'Presente'
      },
      {
        id: 7,
        iniciales: 'CGL',
        id_estudiante: 5,
        id_stakeholder: null,
        tipo: 'ACA',
        descripcion: 'Ausente con aviso'
      }
    ]
    const responsable = {
      id: 7,
      asistencia_id: 8
    }
    expect(wrapper.vm.convertirResponsable(lista, responsable)).toEqual({tipo: 'est', id: 6})
  })

  it('método convertirResponsable funciona correctamente para stakeholders', () => {
    const lista = [
      {
        id: 8,
        iniciales: 'FDT',
        id_estudiante: null,
        id_stakeholder: 6,
        tipo: 'PRE',
        descripcion: 'Presente'
      },
      {
        id: 7,
        iniciales: 'CGL',
        id_estudiante: null,
        id_stakeholder: 5,
        tipo: 'ACA',
        descripcion: 'Ausente con aviso'
      }
    ]
    const responsable = {
      id: 7,
      asistencia_id: 8
    }
    expect(wrapper.vm.convertirResponsable(lista, responsable)).toEqual({tipo: 'stk', id: 6})
  })

  it('método convertirResponsable funciona correctamente para estudiantes y stakeholders null', () => {
    const lista = [
      {
        id: 8,
        iniciales: 'FDT',
        id_estudiante: null,
        id_stakeholder: null,
        tipo: 'PRE',
        descripcion: 'Presente'
      },
      {
        id: 7,
        iniciales: 'CGL',
        id_estudiante: 5,
        id_stakeholder: null,
        tipo: 'ACA',
        descripcion: 'Ausente con aviso'
      }
    ]
    const responsable = {
      id: 7,
      asistencia_id: 8
    }
    expect(wrapper.vm.convertirResponsable(lista, responsable)).toEqual({tipo: '', id: 0})
  })

  it('método convertirItems funciona correctamente', () => {
    const lista = [
      {
        id: 5,
        tipo: 'Info',
        correlativo: 2,
        descripcion: 'Item de prueba 1',
        fecha: null,
        responsables: [
          {
            id: 3,
            asistencia_id: 8
          }
        ]
      },
      {
        id: 6,
        tipo: 'Info',
        correlativo: 1,
        descripcion: 'Item de prueba 2',
        fecha: '2020-11-18T00:00:00.000Z',
        responsables: []
      }
    ]
    const asistencia = [
      {
        id: 8,
        iniciales: 'FDT',
        id_estudiante: 6,
        id_stakeholder: null,
        tipo: 'PRE',
        descripcion: 'Presente'
      },
      {
        id: 7,
        iniciales: 'CGL',
        id_estudiante: 5,
        id_stakeholder: null,
        tipo: 'ACA',
        descripcion: 'Ausente con aviso'
      }
    ]
    const esperado = [
      {
        correlativo: 1,
        descripcion: 'Item de prueba 2',
        fecha: '2020-11-18',
        tipo_item_id: 2,
        responsables: 0,
        entradas: {
          descripcion: false,
          fecha: false,
          tipo_item: false,
          responsables: false
        }
      },
      {
        correlativo: 2,
        descripcion: 'Item de prueba 1',
        fecha: '',
        tipo_item_id: 2,
        responsables: {tipo: 'est', id: 6},
        entradas: {
          descripcion: false,
          fecha: false,
          tipo_item: false,
          responsables: false
        }
      }
    ]
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          tipo_items: [
            {
              id: 2,
              tipo: 'Info'
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.convertirItems(lista, asistencia)).toEqual(esperado)
  })

  it('método convertirAsistenciaEst funciona correctamente', () => {
    const array = [
      {
        id: 8,
        iniciales: 'FDT',
        id_estudiante: 6,
        id_stakeholder: null,
        tipo: 'PRE',
      },
      {
        id: 7,
        iniciales: 'CGL',
        id_estudiante: 5,
        id_stakeholder: null,
        tipo: 'ACA'
      }
    ]
    const esperado = [
      {estudiante: 5, stakeholder: '', asistencia: 3},
      {estudiante: 6, stakeholder: '', asistencia: 1}
    ]
    wrapper.vm.tipo_asistencias = tipoAsistencias
    wrapper.vm.grupo = grupo
    expect(wrapper.vm.convertirAsistenciaEst(array)).toEqual(esperado)
  })

  it('método convertirAsistenciaStk funciona correctamente', () => {
    const array = [
      {
        id: 8,
        iniciales: 'FDT',
        id_estudiante: null,
        id_stakeholder: 6,
        tipo: 'PRE',
      },
      {
        id: 7,
        iniciales: 'CGL',
        id_estudiante: null,
        id_stakeholder: 5,
        tipo: 'ACA'
      }
    ]
    const esperado = [
      {estudiante: '', stakeholder: 5, asistencia: 3},
      {estudiante: '', stakeholder: 6, asistencia: 1}
    ]
    wrapper.vm.tipo_asistencias = tipoAsistencias
    wrapper.vm.grupo = grupo
    expect(wrapper.vm.convertirAsistenciaStk(array)).toEqual(esperado)
  })

  it('método agregarItem funciona correctamente', () => {
    const nuevo = {
      correlativo: 2,
      descripcion: '',
      fecha: '',
      tipo_item_id: 0,
      responsables: {tipo: '', id: 0},
      entradas: {
        descripcion: false,
        fecha: false,
        tipo_item: false,
        responsables: false
      }
    }
    wrapper.vm.agregarItem()
    expect(wrapper.vm.listaItems[1]).toEqual(nuevo)
  })

  it('método removerItem funciona correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaItems: [
            {
              correlativo: 1,
              descripcion: '',
              fecha: '',
              tipo_item_id: 0,
              responsables: 0,
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            },
            {
              correlativo: 2,
              descripcion: '',
              fecha: '',
              tipo_item_id: 0,
              responsables: 0,
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.removerItem(wrapper.vm.listaItems[0])
    expect(wrapper.vm.listaItems.length).toEqual(1)
    expect(wrapper.vm.listaItems[0].correlativo).toEqual(2)
  })

  it('método agregarObjetivo funciona correctamente', () => {
    const objetivo = {id: 0, descripcion: ''}
    wrapper.vm.agregarObjetivo()
    expect(wrapper.vm.objetivos.length).toEqual(2)
    expect(wrapper.vm.objetivos[0]).toEqual(objetivo)
    expect(wrapper.vm.objetivos[1]).toEqual(objetivo)
  })

  it('método removerObjetivo funciona correctamente', () => {
    wrapper.vm.objetivos = ['Obj1', 'Obj2']
    wrapper.vm.removerObjetivo(wrapper.vm.objetivos[0])
    expect(wrapper.vm.objetivos.length).toEqual(1)
    expect(wrapper.vm.objetivos[0]).toEqual('Obj2')
  })

  it('método agregarConclusion funciona correctamente', () => {
    const conclusion = {id: 0, descripcion: ''}
    wrapper.vm.agregarConclusion()
    expect(wrapper.vm.conclusiones.length).toEqual(2)
    expect(wrapper.vm.conclusiones[0]).toEqual(conclusion)
    expect(wrapper.vm.conclusiones[1]).toEqual(conclusion)
  })

  it('método removerConclusion funciona correctamente', () => {
    wrapper.vm.conclusiones = ['Con1', 'Con2']
    wrapper.vm.removerConclusion(wrapper.vm.conclusiones[0])
    expect(wrapper.vm.conclusiones.length).toEqual(1)
    expect(wrapper.vm.conclusiones[0]).toEqual('Con2')
  })

  it('método limpiarCampos funciona correctamente', () => {
    const minuta = {
      estudiante_id: 0,
      codigo: '',
      correlativo: 0,
      fecha_reunion: '',
      h_inicio: '',
      h_termino: '',
      tipo_minuta_id: 2
    }
    const clasificacion = {
      informativa: false,
      avance: false,
      coordinacion: false,
      decision: false,
      otro: false
    }
    const listaItems = [
      {
        correlativo: 1,
        descripcion: '',
        fecha: '',
        tipo_item_id: 0,
        responsables: 0,
        entradas: {
          descripcion: false,
          fecha: false,
          tipo_item: false,
          responsables: false
        }
      }
    ]
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            estudiante_id: 5,
            codigo: 'Cualquiercosa',
            correlativo: 20,
            fecha_reunion: '2020-11-12',
            h_inicio: '10:30',
            h_termino: '11:30',
            tipo_minuta_id: 1
          },
          clasificacion: {
            informativa: false,
            avance: true,
            coordinacion: false,
            decision: true,
            otro: false
          },
          tema: 'Esto es una prueba',
          revision: 'T',
          asistenciaEst: [
            {estudiante: 5, asistencia: 3}
          ],
          asistenciaStk: [
            {stakeholder: 3, asistencia: 2}
          ],
          objetivos: ['Obj1', 'Obj2'],
          conclusiones: ['Con1', 'Con2'],
          motivo_id: 5,
          listaItems: [
            {
              correlativo: 1,
              descripcion: '',
              fecha: '',
              tipo_item_id: 0,
              responsables: 0,
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            },
            {
              correlativo: 2,
              descripcion: '',
              fecha: '',
              tipo_item_id: 0,
              responsables: 0,
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ]
        }
      },
      propsData: {
        tipoMinuta: 2
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.limpiarCampos()
    expect(wrapper.vm.minuta).toEqual(minuta)
    expect(wrapper.vm.clasificacion).toEqual(clasificacion)
    expect(wrapper.vm.tema).toEqual('')
    expect(wrapper.vm.revision).toEqual('')
    expect(wrapper.vm.asistenciaEst).toEqual([])
    expect(wrapper.vm.asistenciaStk).toEqual([])
    expect(wrapper.vm.objetivos).toEqual([''])
    expect(wrapper.vm.conclusiones).toEqual([''])
    expect(wrapper.vm.motivo_id).toEqual(1)
    expect(wrapper.vm.listaItems).toEqual(listaItems)
  })

  // Faltan métodos que incluyen 'axios'
  it('método "obtenerTiposItem" funciona correctamente', async () => {
    wrapper.vm.obtenerTiposItem()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tipo_items).toEqual(tipoItems)
  })

  it('método "obtenerTiposAsistencia" funciona correctamente', async () => {
    wrapper.vm.obtenerTiposAsistencia()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tipo_asistencias).toEqual(tipoAsistencias)
  })

  it('método "obtenerTiposEstado" funciona correctamente', async () => {
    wrapper.vm.obtenerTiposEstado()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tipo_estados).toEqual(tipoEstados)
  })

  it('método "obtenerInfoEstudiante" funciona correctamente para nueva minuta', async () => {
    debugger
    wrapper.vm.obtenerInfoEstudiante()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.estudiante).toEqual(estudiante)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupo).toEqual(grupo)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.minuta.correlativo).toEqual(nuevoCorrelativo)
  })

  it('método "obtenerSemestre" funciona correctamente', async () => {
    wrapper.vm.obtenerSemestre()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.semestre).toEqual(semestre)
  })

  it('método "obtenerCorrelativo" funciona correctamente con nueva minuta', async () => {
    wrapper.vm.grupo = grupo
    wrapper.vm.obtenerCorrelativo()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.minuta.correlativo).toEqual(nuevoCorrelativo)
    expect(wrapper.vm.minuta.tipo).toEqual('Cliente')
  })

  it('método "obtenerCorrelativo" funciona correctamente con minuta existente', async () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        idBitacora: idBitacora,
        tipoMinuta: 63453,
        reEmitir: false
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.tipo_asistencias = tipoAsistencias
    wrapper.vm.tipo_items = tipoItems
    wrapper.vm.grupo = grupo
    wrapper.vm.obtenerCorrelativo()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.minuta.codigo).toEqual('MINUTA_G02_04_2020-2_0821')
    expect(wrapper.vm.minuta.correlativo).toEqual(93453)
    expect(wrapper.vm.minuta.fecha_reunion).toEqual('2020-08-21')
    expect(wrapper.vm.minuta.h_inicio).toEqual('07:00')
    expect(wrapper.vm.minuta.h_termino).toEqual('08:00')
    expect(wrapper.vm.minuta.tipo_minuta_id).toEqual(63453)
    expect(wrapper.vm.asistenciaEst).toEqual(asistenciaEst)
    expect(wrapper.vm.asistenciaStk).toEqual(asistenciaStk)
    expect(wrapper.vm.clasificacion).toEqual(clasificacion)
    expect(wrapper.vm.listaClasificacion).toEqual(['avance', 'decision'])
    expect(wrapper.vm.tema).toEqual('Esto es una prueba')
    expect(wrapper.vm.revision).toEqual('J')
    expect(wrapper.vm.objetivos).toEqual(objetivos)
    expect(wrapper.vm.conclusiones).toEqual(conclusiones)
    expect(wrapper.vm.listaItems).toEqual(listaItems)
    expect(wrapper.vm.minuta.tipo).toEqual('Cliente')
  })

  it('método "obtenerMinuta" funciona correctamente', async () => {
    const wrapper = shallowMount(Minuta, {
      propsData: {
        idBitacora: idBitacora,
        tipoMinuta: 63453,
        reEmitir: false
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.tipo_asistencias = tipoAsistencias
    wrapper.vm.tipo_items = tipoItems
    wrapper.vm.grupo = grupo
    wrapper.vm.obtenerMinuta()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.minuta.codigo).toEqual('MINUTA_G02_04_2020-2_0821')
    expect(wrapper.vm.minuta.correlativo).toEqual(93453)
    expect(wrapper.vm.minuta.fecha_reunion).toEqual('2020-08-21')
    expect(wrapper.vm.minuta.h_inicio).toEqual('07:00')
    expect(wrapper.vm.minuta.h_termino).toEqual('08:00')
    expect(wrapper.vm.minuta.tipo_minuta_id).toEqual(63453)
    expect(wrapper.vm.asistenciaEst).toEqual(asistenciaEst)
    expect(wrapper.vm.asistenciaStk).toEqual(asistenciaStk)
    expect(wrapper.vm.clasificacion).toEqual(clasificacion)
    expect(wrapper.vm.listaClasificacion).toEqual(['avance', 'decision'])
    expect(wrapper.vm.tema).toEqual('Esto es una prueba')
    expect(wrapper.vm.revision).toEqual('J')
    expect(wrapper.vm.objetivos).toEqual(objetivos)
    expect(wrapper.vm.conclusiones).toEqual(conclusiones)
    expect(wrapper.vm.listaItems).toEqual(listaItems)
    expect(wrapper.vm.minuta.tipo).toEqual('Cliente')
  })

  it('método establecerId funciona correctamente', () => {
    wrapper.vm.estudiante = {id: 5}
    wrapper.vm.establecerId()
    expect(wrapper.vm.minuta.estudiante_id).toEqual(5)
  })

  it('método establecerClasificacion funciona correctamente', () => {
    wrapper.vm.listaClasificacion = ['informativa', 'otro']
    wrapper.vm.establecerClasificacion()
    expect(wrapper.vm.clasificacion.informativa).toBeTruthy()
    expect(wrapper.vm.clasificacion.avance).toBeFalsy()
    expect(wrapper.vm.clasificacion.decision).toBeFalsy()
    expect(wrapper.vm.clasificacion.coordinacion).toBeFalsy()
    expect(wrapper.vm.clasificacion.otro).toBeTruthy()
  })

  it('método establecerCodigo funciona correctamente', () => {
    const codigo = 'MINUTA_G02_04_2020-2_1112'
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            correlativo: 4,
            fecha_reunion: '2020-11-12'
          },
          semestre: {
            agno: 2020,
            numero: 2
          },
          grupo: {
            nombre: 'G02'
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.establecerCodigo()).toEqual(codigo)
  })

  it('método "validarRevision" funciona correctamente para "revision" igual a ""', () => {
    wrapper.vm.revision = ''
    expect(wrapper.vm.validarRevision()).toBeFalsy()
    expect(wrapper.vm.entradas.revision.error).toBeTruthy()
    expect(wrapper.vm.entradas.revision.mensaje).toEqual('No se ha ingresado la revisión de la minuta')
  })

  it('método "validarRevision" funciona correctamente para "revision" igual a "undefined"', () => {
    wrapper.vm.revision = undefined
    expect(wrapper.vm.validarRevision()).toBeFalsy()
    expect(wrapper.vm.entradas.revision.error).toBeTruthy()
    expect(wrapper.vm.entradas.revision.mensaje).toEqual('No se ha ingresado la revisión de la minuta')
  })

  it('método "validarRevision" funciona correctamente para "revision" distinto a regExp', () => {
    wrapper.vm.revision = 'Abc'
    expect(wrapper.vm.validarRevision()).toBeFalsy()
    expect(wrapper.vm.entradas.revision.error).toBeTruthy()
    expect(wrapper.vm.entradas.revision.mensaje).toEqual('Sólo letras mayúsculas o números')
  })

  it('método "validarRevision" funciona correctamente para "revision" con letra mayúscula', () => {
    wrapper.vm.revision = 'Z'
    expect(wrapper.vm.validarRevision()).toBeTruthy()
    expect(wrapper.vm.entradas.revision.error).toBeFalsy()
    expect(wrapper.vm.entradas.revision.mensaje).toEqual('')
  })

  it('método "validarRevision" funciona correctamente para "revision" con número', () => {
    wrapper.vm.revision = 5
    expect(wrapper.vm.validarRevision()).toBeTruthy()
    expect(wrapper.vm.entradas.revision.error).toBeFalsy()
    expect(wrapper.vm.entradas.revision.mensaje).toEqual('')
  })

  it('método "validarFecha" funciona correctamente para "fecha_reunion" igual a ""', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            fecha_reunion: ''
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarFecha()).toBeFalsy()
    expect(wrapper.vm.entradas.fecha_reunion).toBeTruthy()
  })

  it('método "validarFecha" funciona correctamente para "fecha_reunion" igual a undefined', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            fecha_reunion: undefined
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarFecha()).toBeFalsy()
    expect(wrapper.vm.entradas.fecha_reunion).toBeTruthy()
  })

  it('método "validarFecha" funciona correctamente para "fecha_reunion" distinto a regExp', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            fecha_reunion: '642345-6345-1346'
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarFecha()).toBeFalsy()
    expect(wrapper.vm.entradas.fecha_reunion).toBeTruthy()
  })

  it('método "validarFecha" funciona correctamente para "fecha_reunion" con regExp correcto', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            fecha_reunion: '2020-03-13'
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarFecha()).toBeTruthy()
    expect(wrapper.vm.entradas.fecha_reunion).toBeFalsy()
  })

  it('método "validarHora" funciona correctamente para "hora" distinta a regExp', () => {
    expect(wrapper.vm.validarHora('46345:622523')).toBeFalsy()
  })

  it('método "validarHora" funciona correctamente para "hora" con regExp correcto', () => {
    expect(wrapper.vm.validarHora('12:23')).toBeTruthy()
  })

  it('método "validarHinicio" funciona correctamente para "h_inicio" distinta a regExp', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            h_inicio: '46345:622523'
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarHinicio()).toBeFalsy()
    expect(wrapper.vm.entradas.h_inicio).toBeTruthy()
  })

  it('método "validarHinicio" funciona correctamente para "h_inicio" con regExp correcto', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            h_inicio: '13:23'
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarHinicio()).toBeTruthy()
    expect(wrapper.vm.entradas.h_inicio).toBeFalsy()
  })

  it('método "validarHtermino" funciona correctamente para "h_termino" distinta a regExp', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            h_termino: '46345:622523'
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarHtermino()).toBeFalsy()
    expect(wrapper.vm.entradas.h_termino).toBeTruthy()
  })

  it('método "validarHtermino" funciona correctamente para "h_termino" con regExp correcto', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          minuta: {
            h_termino: '13:23'
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarHtermino()).toBeTruthy()
    expect(wrapper.vm.entradas.h_termino).toBeFalsy()
  })

  it('método "validarTema" funciona correctamente para "tema" igual a ""', () => {
    wrapper.vm.tema = ''
    expect(wrapper.vm.validarTema()).toBeFalsy()
    expect(wrapper.vm.entradas.tema).toBeTruthy()
  })

  it('método "validarTema" funciona correctamente para "tema" distinto a ""', () => {
    wrapper.vm.tema = 'Es un tema de prueba'
    expect(wrapper.vm.validarTema()).toBeTruthy()
    expect(wrapper.vm.entradas.tema).toBeFalsy()
  })

  it('método "limpiarAsistencias" funciona correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: true,
            clasificacion: false,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.limpiarAsistencias()
    expect(wrapper.vm.entradas.asistencias).toBeFalsy()
  })

  it('método "validarAsistencia" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          grupo: {
            id: 462353,
            nombre: 'Proyecto de prueba',
            proyecto: 'Pagina web de prueba',
            correlativo: 46234543,
            estudiantes: [
              { id: 5, iniciales: 'CGL', usuario: {
                nombre: 'Carlos',
                apellido_paterno: 'Gonzalez',
                apellido_materno: 'Lopez'
              }
            },
              { id: 6, iniciales: 'FDT', usuario: {
                nombre: 'Fernanda',
                apellido_paterno: 'Díaz',
                apellido_materno: 'Torres'
              }
            }
            ]
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarAsistencia()).toBeFalsy()
    expect(wrapper.vm.entradas.asistencias).toBeTruthy()
  })

  it('método "validarAsistencia" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          grupo: {
            id: 462353,
            nombre: 'Proyecto de prueba',
            proyecto: 'Pagina web de prueba',
            correlativo: 46234543,
            estudiantes: [
              { id: 5, iniciales: 'CGL', usuario: {
                nombre: 'Carlos',
                apellido_paterno: 'Gonzalez',
                apellido_materno: 'Lopez'
              }
            },
              { id: 6, iniciales: 'FDT', usuario: {
                nombre: 'Fernanda',
                apellido_paterno: 'Díaz',
                apellido_materno: 'Torres'
              }
            }
            ]
          },
          asistenciaEst: [
            {estudiante: 46345, stakeholder: '', asistencia: 46345},
            {estudiante: 668694, stakeholder: '', asistencia: 161434}
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarAsistencia()).toBeTruthy()
    expect(wrapper.vm.entradas.asistencias).toBeFalsy()
  })

  it('método "limpiarClasificacion" funciona correctamente', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: true,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    wrapper.vm.limpiarClasificacion()
    expect(wrapper.vm.entradas.clasificacion).toBeFalsy()
  })

  it('método "validarClasificacion" funciona correctamente para false', () => {
    expect(wrapper.vm.validarClasificacion()).toBeFalsy()
    expect(wrapper.vm.entradas.clasificacion).toBeTruthy()
  })

  it('método "validarClasificacion" funciona correctamente para false', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaClasificacion: ['informativa', 'decisión'],
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: true,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarClasificacion()).toBeTruthy()
    expect(wrapper.vm.entradas.clasificacion).toBeFalsy()
  })

  it('método "validarObjetivos" funciona correctamente para largo igual a 1 y valor "false"', () => {
    expect(wrapper.vm.validarObjetivos()).toBeFalsy()
    expect(wrapper.vm.entradas.objetivos).toBeTruthy()
  })

  it('método "validarObjetivos" funciona correctamente para largo igual a 1 y valor "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          objetivos: [{id: 0, descripcion: 'Objetivo de prueba'}],
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: false,
            objetivos: true,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarObjetivos()).toBeTruthy()
    expect(wrapper.vm.entradas.objetivos).toBeFalsy()
  })

  it('método "validarObjetivos" funciona correctamente para largo mayor a 1 y valor "false"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          objetivos: [{id: 0, descripcion: 'Objetivo de prueba'},
        {id:0, descripcion: ''}],
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: false,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarObjetivos()).toBeFalsy()
    expect(wrapper.vm.entradas.objetivos).toBeTruthy()
  })

  it('método "validarObjetivos" funciona correctamente para largo mayor a 1 y valor "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          objetivos: [{id: 0, descripcion: 'Objetivo de prueba'},
        {id: 0, descripcion: 'Otro objetivo de prueba'}],
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: false,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarObjetivos()).toBeTruthy()
    expect(wrapper.vm.entradas.objetivos).toBeFalsy()
  })

  it('método "validarConclusiones" funciona correctamente para largo igual a 1 y valor "false"', () => {
    expect(wrapper.vm.validarConclusiones()).toBeFalsy()
    expect(wrapper.vm.entradas.conclusiones).toBeTruthy()
  })

  it('método "validarConclusiones" funciona correctamente para largo igual a 1 y valor "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          conclusiones: [{id: 0, descripcion: 'Objetivo de prueba'}],
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: false,
            objetivos: false,
            conclusiones: true
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarConclusiones()).toBeTruthy()
    expect(wrapper.vm.entradas.conclusiones).toBeFalsy()
  })

  it('método "validarConclusiones" funciona correctamente para largo mayor a 1 y valor "false"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          conclusiones: [{id: 0, descripcion: 'Objetivo de prueba'},
        {id:0, descripcion: ''}],
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: false,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarConclusiones()).toBeFalsy()
    expect(wrapper.vm.entradas.conclusiones).toBeTruthy()
  })

  it('método "validarConclusiones" funciona correctamente para largo mayor a 1 y valor "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          conclusiones: [{id: 0, descripcion: 'Objetivo de prueba'},
        {id: 0, descripcion: 'Otro objetivo de prueba'}],
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: false,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarConclusiones()).toBeTruthy()
    expect(wrapper.vm.entradas.conclusiones).toBeFalsy()
  })

  it('método "validarItem" funciona correctamente con valor "false"', () => {
    expect(wrapper.vm.validarItem(0)).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.descripcion).toBeTruthy()
    expect(wrapper.vm.listaItems[0].entradas.tipo_item).toBeTruthy()
  })

  it('método "validarItem" funciona correctamente con valor "false" y descripcion igual a "undefined"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaItems: [
            {
              correlativo: 1,
              descripcion: undefined,
              fecha: '',
              tipo_item_id: 0,
              responsables: { tipo: '', id: 0 },
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ]
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarItem(0)).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.descripcion).toBeTruthy()
    expect(wrapper.vm.listaItems[0].entradas.tipo_item).toBeTruthy()
  })

  it('método "validarItem" funciona correctamente con valor "false" y fecha igual a ""', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaItems: [
            {
              correlativo: 1,
              descripcion: 'Item de prueba',
              fecha: '',
              tipo_item_id: 1,
              responsables: { tipo: '', id: 0 },
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ],
          tipo_items: tipoItems
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarItem(0)).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.descripcion).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.tipo_item).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.fecha).toBeTruthy()
  })

  it('método "validarItem" funciona correctamente con valor "false" y responsables igual a 0', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaItems: [
            {
              correlativo: 1,
              descripcion: 'Item de prueba',
              fecha: '',
              tipo_item_id: 2,
              responsables: 0,
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ],
          tipo_items: tipoItems
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarItem(0)).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.descripcion).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.tipo_item).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.responsables).toBeTruthy()
  })

  it('método "validarItem" funciona correctamente con valor "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaItems: [
            {
              correlativo: 1,
              descripcion: 'Item de prueba',
              fecha: '2020-12-28',
              tipo_item_id: 3,
              responsables: { tipo: '', id: 0 },
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ],
          tipo_items: tipoItems
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarItem(0)).toBeTruthy()
    expect(wrapper.vm.listaItems[0].entradas.descripcion).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.tipo_item).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.fecha).toBeFalsy()
    expect(wrapper.vm.listaItems[0].entradas.responsables).toBeFalsy()
  })

  it('método "validarListaItems" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaItems: [
            {
              correlativo: 1,
              descripcion: 'Item de prueba',
              fecha: '2020-12-28',
              tipo_item_id: 3,
              responsables: { tipo: '', id: 0 },
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ],
          tipo_items: tipoItems
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarListaItems()).toBeTruthy()
  })

  it('método "validarListaItems" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          listaItems: [
            {
              correlativo: 1,
              descripcion: '',
              fecha: '',
              tipo_item_id: 0,
              responsables: { tipo: '', id: 0 },
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ],
          tipo_items: tipoItems
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarListaItems()).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente con "false"', () => {
    expect(wrapper.vm.validarFormulario()).toBeFalsy()
  })

  it('método "validarFormulario" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Minuta, {
      data() {
        return {
          revision: 'Z',
          tema: 'Este es un tema de prueba',
          minuta: {
            h_inicio: '13:23',
            h_termino: '14:00',
            fecha_reunion: '2020-03-13'
          },
          listaClasificacion: ['informativa', 'decisión'],
          objetivos: [
            {id: 0, descripcion: 'Objetivo de prueba'},
            {id: 0, descripcion: 'Otro objetivo de prueba'}
          ],
          conclusiones: [
            {id: 0, descripcion: 'Objetivo de prueba'},
            {id: 0, descripcion: 'Otro objetivo de prueba'}
          ],
          listaItems: [
            {
              correlativo: 1,
              descripcion: 'Item de prueba',
              fecha: '2020-12-28',
              tipo_item_id: 3,
              responsables: { tipo: '', id: 0 },
              entradas: {
                descripcion: false,
                fecha: false,
                tipo_item: false,
                responsables: false
              }
            }
          ],
          grupo: {
            id: 462353,
            nombre: 'Proyecto de prueba',
            proyecto: 'Pagina web de prueba',
            correlativo: 46234543,
            estudiantes: [
              { id: 5, iniciales: 'CGL', usuario: {
                nombre: 'Carlos',
                apellido_paterno: 'Gonzalez',
                apellido_materno: 'Lopez'
              }
            },
              { id: 6, iniciales: 'FDT', usuario: {
                nombre: 'Fernanda',
                apellido_paterno: 'Díaz',
                apellido_materno: 'Torres'
              }
            }
            ]
          },
          asistenciaEst: [
            {estudiante: 46345, stakeholder: '', asistencia: 46345},
            {estudiante: 668694, stakeholder: '', asistencia: 161434}
          ],
          tipo_items: tipoItems,
          entradas: {
            revision: {
              error: false,
              mensaje: ''
            },
            fecha_reunion: false,
            tema: false,
            h_inicio: false,
            h_termino: false,
            asistencias: false,
            clasificacion: false,
            objetivos: false,
            conclusiones: false
          }
        }
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.vm.validarFormulario()).toBeTruthy()
  })
})
