import { shallowMount } from '@vue/test-utils'
import Items from '@/components/minutas/Items.vue'

describe('Items.vue', () => {
  const lista = [
    {
      id: 14635,
      tipo: 'Info',
      correlativo: 2453,
      descripcion: 'Este es un item de prueba',
      fecha: null,
      responsables: []
    },
    {
      id: 46245,
      tipo: 'Compromiso',
      correlativo: 2445,
      descripcion: 'Este es otro item de prueba',
      fecha: '2020-06-15T00:00:00.000Z',
      responsables: [
        {
          id: 454,
          asistencia_id: 43
        }
      ]
    }
  ]
  const presentes = [
    {
      id: 43,
      iniciales: 'BRG',
      tipo: 'PRE',
      descripcion: 'Presente'
    }
  ]
  const mostrar = [true, true]
  const comentarios = [
    {comentario: 'abc', es_item: true, id_item: 0},
    {comentario: 'abc', es_item: true, id_item: 0}
  ]
  const entradas = [
    {error: true, mensaje: ''},
    {error: true, mensaje: ''}
  ]
  const listaComentarios = [
    {id: 236345, comentario: 'Este es un comentario de prueba', es_item: true, id_item: 46245, asistencia: {
      id: 2463453, estudiante: {id: 462462345, iniciales: 'ABC'}
    }},
    {id: 6923495, comentario: 'Otro comentario de prueba', es_item: false, id_item: null, asistencia: {
      id: 2463453, estudiante: {id: 462462345, iniciales: 'ABC'}
    }}
  ]

  it('se asigna prop lista correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.props().lista).toEqual(lista)
  })

  it('se asigna prop asistentes correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.props().asistentes).toEqual(presentes)
  })

  it('se asigna prop "comentar" correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.props().comentar).toBeFalsy()
  })

  it('se asigna prop "comentar" correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.props().comentar).toBeTruthy()
  })

  it('se asigna prop "responder" correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.props().responder).toBeFalsy()
  })

  it('se asigna prop "responder" correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: []
      }
    })
    expect(wrapper.props().responder).toBeTruthy()
  })

  it('se asigna prop "listaCom" correctamente con arreglo vacío', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.props().listaCom).toEqual([])
  })

  it('se asigna prop "listaCom" correctamente con arreglo no vacío', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    expect(wrapper.props().listaCom).toEqual(listaComentarios)
  })

  it('se asigna prop "verRespuestas" correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios,
        verRespuestas: true
      }
    })
    expect(wrapper.props().verRespuestas).toBeTruthy()
  })

  it('se asigna prop "verRespuestas" correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios,
        verRespuestas: false
      }
    })
    expect(wrapper.props().verRespuestas).toBeFalsy()
  })

  it('variable listaItems se inicializa correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.listaItems).toEqual(lista)
  })

  it('variable asistencia se inicializa correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.asistencia).toEqual(presentes)
  })

  it('variable "comentarios" se inicializa correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.comentarios).toBeFalsy()
  })

  it('variable "respuestas" se inicializa correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.respuestas).toBeFalsy()
  })

  it('variable "mostrarComentar" se inicializa correctamente', () => {
    const esperado = [false, false]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.mostrarComentar).toEqual(esperado)
  })

  it('variable "listaComentarios" se inicializa correctamente', () => {
    const esperado = [
      {comentario: '', es_item: true, id_item: 0},
      {comentario: '', es_item: true, id_item: 0}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.listaComentarios).toEqual(esperado)
  })

  it('variable "listaGenerales" se inicializa correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.listaGenerales).toEqual([])
  })

  it('variable "comentario" se inicializa correctamente', () => {
    const esperado = {comentario: '', es_item: true, id_item: 0}
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.comentario).toEqual(esperado)
  })

  it('variable "entrada" se inicializa correctamente', () => {
    const esperado = {error: false, mensaje: ''}
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.entrada).toEqual(esperado)
  })

  it('variable "listaEntradas" se inicializa correctamente', () => {
    const esperado = [
      {error: false, mensaje: ''}, {error: false, mensaje: ''}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.listaEntradas).toEqual(esperado)
  })

  it('variable "entradas" se inicializa correctamente', () => {
    const esperado = {comentarios: false}
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.entradas).toEqual(esperado)
  })

  it('variable "comentariosMinuta" se inicializa correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    expect(wrapper.vm.comentariosMinuta).toEqual(listaComentarios)
  })

  it('variable "comentariosItems" se inicializa correctamente sin "comentarios"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.comentariosItems).toEqual([])
  })

  it('variable "comentariosItems" se inicializa correctamente con "comentarios"', () => {
    const esperado = [
      {id: 236345, comentario: 'Este es un comentario de prueba', es_item: true, id_item: 46245, asistencia: {
        id: 2463453, estudiante: {id: 462462345, iniciales: 'ABC'}
      }}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.comentariosItems).toEqual(esperado)
  })

  it('variable "comentariosGenerales" se inicializa correctamente sin "comentarios"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.comentariosGenerales).toEqual([])
  })

  it('variable "comentariosGenerales" se inicializa correctamente con "comentarios"', () => {
    const esperado = [
      {id: 6923495, comentario: 'Otro comentario de prueba', es_item: false, id_item: null, asistencia: {
        id: 2463453, estudiante: {id: 462462345, iniciales: 'ABC'}
      }}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.comentariosGenerales).toEqual(esperado)
  })

  it('variable "respuestasItems" se inicializa correctamente', () => {
    const esperado = [
      [{comentario_id: 236345, respuesta: ''}],
      []
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.respuestasItems).toEqual(esperado)
  })

  it('variable "respuestasGenerales" se inicializa correctamente sin "comentarios"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.respuestasGenerales).toEqual([])
  })

  it('variable "respuestasGenerales" se inicializa correctamente con "comentarios"', () => {
    const esperado = [
      {comentario_id: 6923495, respuesta: ''}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.respuestasGenerales).toEqual(esperado)
  })

  it('variable "verRespuestasItems" se inicializa correctamente sin "comentarios"', () => {
    const esperado = [[], []]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.verRespuestasItems).toEqual(esperado)
  })

  it('variable "verRespuestasItems" se inicializa correctamente con "comentarios"', () => {
    const esperado = [[false], []]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.verRespuestasItems).toEqual(esperado)
  })

  it('variable "verRespuestasGenerales" se inicializa correctamente sin "comentarios"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.verRespuestasGenerales).toEqual([])
  })

  it('variable "verRespuestasGenerales" se inicializa correctamente con "comentarios"', () => {
    const esperado = [false]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.verRespuestasGenerales).toEqual(esperado)
  })

  it('variable "responderEntradasItems" se inicializa correctamente sin "comentarios"', () => {
    const esperado = [[], []]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.responderEntradasItems).toEqual(esperado)
  })

  it('variable "responderEntradasItems" se inicializa correctamente con "comentarios"', () => {
    const esperado = [
      [{error: false, mensaje: ''}],
      []
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.responderEntradasItems).toEqual(esperado)
  })

  it('variable "responderEntradasGenerales" se inicializa correctamente sin "comentarios"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.responderEntradasGenerales).toEqual([])
  })

  it('variable "responderEntradasGenerales" se inicializa correctamente con "comentarios"', () => {
    const esperado = [{error: false, mensaje: ''}]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.responderEntradasGenerales).toEqual(esperado)
  })

  it('propiedad computada listaOrdenada funciona correctamente', () => {
    const esperado = [
      {
        id: 46245,
        tipo: 'Compromiso',
        correlativo: 2445,
        descripcion: 'Este es otro item de prueba',
        fecha: '2020-06-15T00:00:00.000Z',
        responsables: [
          {
            id: 454,
            asistencia_id: 43
          }
        ]
      },
      {
        id: 14635,
        tipo: 'Info',
        correlativo: 2453,
        descripcion: 'Este es un item de prueba',
        fecha: null,
        responsables: []
      }
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.listaOrdenada).toEqual(esperado)
  })

  it('propiedad computada "comentariosPorItem" funciona correctamente sin "comentarios"', () => {
    const esperado = [[], []]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.comentariosPorItem).toEqual(esperado)
  })

  it('propiedad computada "comentariosPorItem" funciona correctamente con "comentarios"', () => {
    const esperado = [
      [{id: 236345, comentario: 'Este es un comentario de prueba', es_item: true, id_item: 46245, asistencia: {
        id: 2463453, estudiante: {id: 462462345, iniciales: 'ABC'}
      }}],
      []
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: true,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.comentariosPorItem).toEqual(esperado)
  })

  it('propiedad computada "sinComentarios" funciona correctamente con "true" con comentarios vacios', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.sinComentarios).toBeTruthy()
  })

  it('propiedad computada "sinComentarios" funciona correctamente con "true" con comentarios', () => {
    const comentarios = [
      {comentario: '', es_item: true, id_item: 0},
      {comentario: '', es_item: true, id_item: 0}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.listaComentarios = comentarios
    expect(wrapper.vm.sinComentarios).toBeTruthy()
  })

  it('propiedad computada "sinComentarios" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.listaComentarios = comentarios
    expect(wrapper.vm.sinComentarios).toBeFalsy()
  })

  it('método fechaItem funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.fechaItem('2020-06-15T00:00:00.000Z')).toEqual('15-06-2020')
  })

  it('método fechaItem con entrada null funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.fechaItem(null)).toEqual('')
  })

  it('método obtenerIniciales funciona correctamente', () => {
    const resp = [
      {
        id: 454,
        asistencia_id: 43
      }
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    expect(wrapper.vm.obtenerIniciales(resp)).toEqual('BRG')
  })

  it('método crearListas funciona correctamente', () => {
    const esperadoMostrar = [false, false]
    const esperadoComentarios = [
      {comentario: '', es_item: true, id_item: 0},
      {comentario: '', es_item: true, id_item: 0}
    ]
    const esperadoEntradas = [
      {error: false, mensaje: ''},
      {error: false, mensaje: ''}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: [],
        verRespuestas: false
      }
    })
    wrapper.vm.crearListas()
    expect(wrapper.vm.mostrarComentar).toEqual(esperadoMostrar)
    expect(wrapper.vm.listaComentarios).toEqual(esperadoComentarios)
    expect(wrapper.vm.listaEntradas).toEqual(esperadoEntradas)
  })

  it('método abrirComentario funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.abrirComentario(1, 36345)
    expect(wrapper.vm.mostrarComentar[1]).toBeTruthy()
    expect(wrapper.vm.listaComentarios[1].id_item).toEqual(36345)
  })

  it('método cerrarComentario funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          mostrarComentar: mostrar,
          listaComentarios: comentarios,
          listaEntradas: entradas
        }
      }
    })
    wrapper.vm.cerrarComentario(1)
    expect(wrapper.vm.mostrarComentar[1]).toBeFalsy()
    expect(wrapper.vm.listaComentarios[1].comentario).toEqual('')
    expect(wrapper.vm.listaEntradas[1].error).toBeFalsy()
  })

  it('método agregaComentario funciona correctamente', () => {
    const esperado = [{
      comentario: '',
      es_item: false,
      id_item: 0
    }]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.agregaComentario()
    expect(wrapper.vm.listaGenerales).toEqual(esperado)
  })

  it('método removerComentario funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          listaGenerales: [{
            comentario: '',
            es_item: false,
            id_item: 0
          }]
        }
      }
    })
    wrapper.vm.removerComentario(wrapper.vm.listaGenerales[0])
    expect(wrapper.vm.listaGenerales).toEqual([])
  })

  it('método limpiarCampos funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          mostrarComentar: mostrar,
          listaComentarios: comentarios,
          listaGenerales: [{
            comentario: '',
            es_item: false,
            id_item: 0
          }]
        }
      }
    })
    wrapper.vm.limpiarCampos()
    expect(wrapper.vm.mostrarComentar).toEqual([])
    expect(wrapper.vm.listaComentarios).toEqual([])
    expect(wrapper.vm.listaGenerales).toEqual([])
    expect(wrapper.vm.comentariosItems).toEqual([])
    expect(wrapper.vm.comentariosGenerales).toEqual([])
    expect(wrapper.vm.respuestasItems).toEqual([])
    expect(wrapper.vm.respuestasGenerales).toEqual([])
    expect(wrapper.vm.verRespuestasItems).toEqual([])
    expect(wrapper.vm.verRespuestasGenerales).toEqual([])
    expect(wrapper.vm.responderEntradasItems).toEqual([])
    expect(wrapper.vm.responderEntradasGenerales).toEqual([])
  })

  it('método "enviarComentarios" funciona correctamente con "true"', async () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: [],
        verRespuestas: false
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirComentario(0, 3453)
    wrapper.vm.listaComentarios[0].comentario = 'Comentario de prueba'
    wrapper.vm.agregaComentario()
    wrapper.vm.listaGenerales[0].comentario = 'Otro comentario de prueba'
    const comentarios = wrapper.vm.listaComentarios.concat(wrapper.vm.listaGenerales)
    wrapper.vm.enviarComentarios()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().comentar).toBeTruthy()
    expect(wrapper.emitted().comentar.length).toEqual(1)
    expect(wrapper.emitted().comentar[0]).toEqual([comentarios])
  })

  it('método "enviarComentarios" funciona correctamente con "false"', async () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: [],
        verRespuestas: false
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirComentario(0, 3453)
    wrapper.vm.listaComentarios[0].comentario = 'Comentario de prueba'
    wrapper.vm.agregaComentario()
    wrapper.vm.listaGenerales[0].comentario = ''
    wrapper.vm.enviarComentarios()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().comentar).toBeFalsy()
  })

  it('método "cancelarEnvio" funciona correctamente', async () => {
    const esperado = [
      {error: false, mensaje: ''},
      {error: false, mensaje: ''}
    ]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          mostrarComentar: mostrar,
          listaComentarios: comentarios,
          listaGenerales: [{
            comentario: '',
            es_item: false,
            id_item: 0
          }],
          entradas: {
            comentarios: true
          }
        }
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.listaEntradas[0].error = true
    wrapper.vm.listaEntradas[0].mensaje = 'Este es un mensaje de prueba'
    wrapper.vm.cancelarEnvio()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
    expect(wrapper.vm.mostrarComentar).toEqual([])
    expect(wrapper.vm.listaComentarios).toEqual([])
    expect(wrapper.vm.listaGenerales).toEqual([])
    expect(wrapper.vm.comentariosItems).toEqual([])
    expect(wrapper.vm.comentariosGenerales).toEqual([])
    expect(wrapper.vm.respuestasItems).toEqual([])
    expect(wrapper.vm.respuestasGenerales).toEqual([])
    expect(wrapper.vm.verRespuestasItems).toEqual([])
    expect(wrapper.vm.verRespuestasGenerales).toEqual([])
    expect(wrapper.vm.responderEntradasItems).toEqual([])
    expect(wrapper.vm.responderEntradasGenerales).toEqual([])
    expect(wrapper.vm.entradas.comentarios).toBeFalsy()
    expect(wrapper.vm.listaEntradas).toEqual(esperado)
  })

  it('método "validarComentarioItem" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.validarComentarioItem(0)).toBeTruthy()
    expect(wrapper.vm.listaEntradas[0].error).toBeFalsy()
    expect(wrapper.vm.listaEntradas[0].mensaje).toEqual('')
  })

  it('método "validarComentarioItem" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          listaComentarios: [
            {comentario: '', es_item: true, id_item: 0},
            {comentario: '', es_item: true, id_item: 0}
          ],
          listaEntradas: [
            {error: false, mensaje: ''},
            {error: false, mensaje: ''}
          ]
        }
      }
    })
    wrapper.vm.abrirComentario(0, 3453)
    expect(wrapper.vm.validarComentarioItem(0)).toBeFalsy()
    expect(wrapper.vm.listaEntradas[0].error).toBeTruthy()
    expect(wrapper.vm.listaEntradas[0].mensaje).toEqual('Falta ingresar el comentario')
  })

  it('método "validarComentarioItem" funciona correctamente con "true" y comentario', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirComentario(0, 3453)
    wrapper.vm.listaComentarios[0].comentario = 'Comentario de prueba'
    expect(wrapper.vm.validarComentarioItem(0)).toBeTruthy()
    expect(wrapper.vm.listaEntradas[0].error).toBeFalsy()
    expect(wrapper.vm.listaEntradas[0].mensaje).toEqual('')
  })

  it('método "validarListaComentarios" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirComentario(0, 3453)
    wrapper.vm.abrirComentario(1, 4534)
    wrapper.vm.listaComentarios[0].comentario = 'Comentario de prueba'
    wrapper.vm.listaComentarios[1].comentario = 'Otro comentario de prueba'
    expect(wrapper.vm.validarComentarioItem(0)).toBeTruthy()
    expect(wrapper.vm.validarComentarioItem(1)).toBeTruthy()
    expect(wrapper.vm.validarListaComentarios()).toBeTruthy()
  })

  it('método "validarListaComentarios" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirComentario(0, 3453)
    wrapper.vm.abrirComentario(1, 4534)
    wrapper.vm.listaComentarios[0].comentario = 'Comentario de prueba'
    expect(wrapper.vm.validarComentarioItem(0)).toBeTruthy()
    expect(wrapper.vm.validarComentarioItem(1)).toBeFalsy()
    expect(wrapper.vm.listaEntradas[1].error).toBeTruthy()
    expect(wrapper.vm.listaEntradas[1].mensaje).toEqual('Falta ingresar el comentario')
    expect(wrapper.vm.validarListaComentarios()).toBeFalsy()
  })

  it('método "validarListaGenerales" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.agregaComentario()
    wrapper.vm.listaGenerales[0].comentario = 'Comentario de prueba'
    expect(wrapper.vm.validarListaGenerales()).toBeTruthy()
    expect(wrapper.vm.entradas.comentarios).toBeFalsy()
  })

  it('método "validarListaGenerales" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.agregaComentario()
    wrapper.vm.agregaComentario()
    wrapper.vm.listaGenerales[0].comentario = 'Comentario de prueba'
    expect(wrapper.vm.validarListaGenerales()).toBeFalsy()
    expect(wrapper.vm.entradas.comentarios).toBeTruthy()
  })

  it('método "validarComentarios" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirComentario(0, 3453)
    wrapper.vm.listaComentarios[0].comentario = 'Comentario de prueba'
    wrapper.vm.agregaComentario()
    wrapper.vm.listaGenerales[0].comentario = 'Otro comentario de prueba'
    expect(wrapper.vm.validarListaGenerales()).toBeTruthy()
    expect(wrapper.vm.validarListaComentarios()).toBeTruthy()
    expect(wrapper.vm.validarComentarios()).toBeTruthy()
  })

  it('método "validarComentarios" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: true,
        responder: false,
        listaCom: []
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirComentario(0, 3453)
    wrapper.vm.abrirComentario(1, 4534)
    wrapper.vm.listaComentarios[0].comentario = 'Comentario de prueba'
    wrapper.vm.agregaComentario()
    wrapper.vm.listaGenerales[0].comentario = 'Otro comentario de prueba'
    expect(wrapper.vm.validarListaComentarios()).toBeFalsy()
    expect(wrapper.vm.validarListaGenerales()).toBeTruthy()
    expect(wrapper.vm.validarComentarios()).toBeFalsy()
  })

  it('método limpiarErrorItem funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          listaEntradas: [{
            error: true,
            mensaje: 'Es un error de la prueba'
          }]
        }
      }
    })
    wrapper.vm.limpiarErrorItem(0)
    expect(wrapper.vm.listaEntradas[0].error).toBeFalsy()
    expect(wrapper.vm.listaEntradas[0].mensaje).toEqual('')
  })

  it('método limpiarErrorGeneral funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          entradas: {
            comentarios: true
          }
        }
      }
    })
    wrapper.vm.limpiarErrorGeneral()
    expect(wrapper.vm.entradas.comentarios).toBeFalsy()
  })

  it('método "categorizarComentarios" funciona correctamente', () => {
    const respuestas = [{comentario_id: listaComentarios[1].id, respuesta: ''}]
    const ver = [false]
    const entradas = [{error: false, mensaje: ''}]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.comentariosItems).toEqual([listaComentarios[0]])
    expect(wrapper.vm.comentariosGenerales).toEqual([listaComentarios[1]])
    expect(wrapper.vm.respuestasGenerales).toEqual(respuestas)
    expect(wrapper.vm.verRespuestasGenerales).toEqual(ver)
    expect(wrapper.vm.responderEntradasGenerales).toEqual(entradas)
  })

  it('método "enviarRespuestas" funciona correctamente con "true"', async () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    wrapper.vm.respuestasItems[0][0].respuesta = 'respuesta de prueba'
    wrapper.vm.verRespuestasGenerales[0] = true
    wrapper.vm.respuestasGenerales[0].respuesta = 'respuesta de prueba'
    debugger
    let esperado = []
    esperado.push(wrapper.vm.respuestasItems[0][0])
    esperado = esperado.concat(wrapper.vm.respuestasGenerales)
    wrapper.vm.enviarRespuestas()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().responder).toBeTruthy()
    expect(wrapper.emitted().responder.length).toEqual(1)
    expect(wrapper.emitted().responder[0]).toEqual([esperado])
  })

  it('método "enviarRespuestas" funciona correctamente con "false"', async () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    wrapper.vm.respuestasItems[0][0].respuesta = 'respuesta de prueba'
    wrapper.vm.verRespuestasGenerales[0] = true
    wrapper.vm.respuestasGenerales[0].respuesta = ''
    wrapper.vm.enviarRespuestas()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().responder).toBeFalsy()
  })

  it('método "cancelarEnvioRespuestas" funciona correctamente', async () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: []
      },
      data () {
        return {
          mostrarComentar: mostrar,
          listaComentarios: comentarios,
          listaGenerales: [{
            comentario: '',
            es_item: false,
            id_item: 0
          }]
        }
      }
    })
    wrapper.vm.cancelarEnvioRespuestas()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
    expect(wrapper.vm.mostrarComentar).toEqual([])
    expect(wrapper.vm.listaComentarios).toEqual([])
    expect(wrapper.vm.listaGenerales).toEqual([])
    expect(wrapper.vm.comentariosItems).toEqual([])
    expect(wrapper.vm.comentariosGenerales).toEqual([])
    expect(wrapper.vm.respuestasItems).toEqual([])
    expect(wrapper.vm.respuestasGenerales).toEqual([])
    expect(wrapper.vm.verRespuestasItems).toEqual([])
    expect(wrapper.vm.verRespuestasGenerales).toEqual([])
    expect(wrapper.vm.responderEntradasItems).toEqual([])
    expect(wrapper.vm.responderEntradasGenerales).toEqual([])
    expect(wrapper.vm.entradas.comentarios).toBeFalsy()
  })

  it('método "buscarComentarios" funciona correctamente', () => {
    const esperado = [listaComentarios[0]]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.buscarComentarios(46245)).toEqual(esperado)
  })

  it('método "crearRespuestasItems" funciona correctamente', () => {
    const esperado = [[{comentario_id: listaComentarios[0].id, respuesta: ''}], []]
    const entrada = [[{error: false, mensaje: ''}], []]
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.respuestasItems).toEqual(esperado)
    expect(wrapper.vm.verRespuestasItems).toEqual([[false], []])
    expect(wrapper.vm.responderEntradasItems).toEqual(entrada)
  })

  it('método "abrirRespuestaGeneral" funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.abrirRespuestaGeneral(0)
    expect(wrapper.vm.verRespuestasGenerales[0]).toBeTruthy()
  })

  it('método "cerrarRespuestaGeneral" funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaGeneral(0)
    wrapper.vm.respuestasGenerales[0].respuesta = 'respuesta de prueba'
    wrapper.vm.cerrarRespuestaGeneral(0)
    expect(wrapper.vm.verRespuestasGenerales[0]).toBeFalsy()
    expect(wrapper.vm.respuestasGenerales[0].respuesta).toEqual('')
  })

  it('método "abrirRespuestaItem" funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    expect(wrapper.vm.verRespuestasItems[0][0]).toBeTruthy()
  })

  it('método "cerrarRespuestaItem" funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    wrapper.vm.respuestasItems[0][0].respuesta = 'respuesta de prueba'
    wrapper.vm.cerrarRespuestaItem(0, 0)
    expect(wrapper.vm.verRespuestasItems[0][0]).toBeFalsy()
    expect(wrapper.vm.respuestasItems[0][0].respuesta).toEqual('')
  })

  it('método "validarRespuestaItem" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    expect(wrapper.vm.validarRespuestaItem(0, 0)).toBeFalsy()
    expect(wrapper.vm.responderEntradasItems[0][0].error).toBeTruthy()
    expect(wrapper.vm.responderEntradasItems[0][0].mensaje).toEqual('Falta ingresar la respuesta al comentario')
  })

  it('método "validarRespuestaItem" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.validarRespuestaItem(0, 0)).toBeTruthy()
    expect(wrapper.vm.responderEntradasItems[0][0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasItems[0][0].mensaje).toEqual('')
  })

  it('método "validarRespuestaItem" funciona correctamente con "true" y respuesta', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    wrapper.vm.respuestasItems[0][0].respuesta = 'respuesta de prueba'
    expect(wrapper.vm.validarRespuestaItem(0, 0)).toBeTruthy()
    expect(wrapper.vm.responderEntradasItems[0][0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasItems[0][0].mensaje).toEqual('')
  })

  it('método "validarListaRespuestas" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    wrapper.vm.respuestasItems[0][0].respuesta = 'respuesta de prueba'
    expect(wrapper.vm.validarListaRespuestas()).toBeTruthy()
    expect(wrapper.vm.responderEntradasItems[0][0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasItems[0][0].mensaje).toEqual('')
  })

  it('método "validarListaRespuestas" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    expect(wrapper.vm.validarListaRespuestas()).toBeFalsy()
    expect(wrapper.vm.responderEntradasItems[0][0].error).toBeTruthy()
    expect(wrapper.vm.responderEntradasItems[0][0].mensaje).toEqual('Falta ingresar la respuesta al comentario')
  })

  it('método "validarRespuestaGeneral" funciona correctamente con "true" con respuesta', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.verRespuestasGenerales[0] = true
    wrapper.vm.respuestasGenerales[0].respuesta = 'respuesta de prueba'
    expect(wrapper.vm.validarRespuestaGeneral(0)).toBeTruthy()
    expect(wrapper.vm.responderEntradasGenerales[0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasGenerales[0].mensaje).toEqual('')
  })

  it('método "validarRespuestaGeneral" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    expect(wrapper.vm.validarRespuestaGeneral(0)).toBeTruthy()
    expect(wrapper.vm.responderEntradasGenerales[0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasGenerales[0].mensaje).toEqual('')
  })

  it('método "validarRespuestaGeneral" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.verRespuestasGenerales[0] = true
    expect(wrapper.vm.validarRespuestaGeneral(0)).toBeFalsy()
    expect(wrapper.vm.responderEntradasGenerales[0].error).toBeTruthy()
    expect(wrapper.vm.responderEntradasGenerales[0].mensaje).toEqual('Falta ingresar la respuesta al comentario')
  })

  it('método "validarListaRespGenerales" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.verRespuestasGenerales[0] = true
    wrapper.vm.respuestasGenerales[0].respuesta = 'respuesta de prueba'
    expect(wrapper.vm.validarListaRespGenerales()).toBeTruthy()
    expect(wrapper.vm.responderEntradasGenerales[0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasGenerales[0].mensaje).toEqual('')
  })

  it('método "validarListaRespGenerales" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.verRespuestasGenerales[0] = true
    expect(wrapper.vm.validarListaRespGenerales()).toBeFalsy()
    expect(wrapper.vm.responderEntradasGenerales[0].error).toBeTruthy()
    expect(wrapper.vm.responderEntradasGenerales[0].mensaje).toEqual('Falta ingresar la respuesta al comentario')
  })

  it('método "validarRespuestas" funciona correctamente con "true"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    wrapper.vm.respuestasItems[0][0].respuesta = 'respuesta de prueba'
    wrapper.vm.verRespuestasGenerales[0] = true
    wrapper.vm.respuestasGenerales[0].respuesta = 'respuesta de prueba'
    expect(wrapper.vm.validarRespuestas()).toBeTruthy()
  })

  it('método "validarRespuestas" funciona correctamente con "false"', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.abrirRespuestaItem(0, 0)
    wrapper.vm.verRespuestasGenerales[0] = true
    expect(wrapper.vm.validarRespuestas()).toBeFalsy()
  })

  it('método "limpiarErrorRespItem" funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.responderEntradasItems[0][0].error = true
    wrapper.vm.responderEntradasItems[0][0].mensaje = 'mensaje de error de prueba'
    wrapper.vm.limpiarErrorRespItem(0, 0)
    expect(wrapper.vm.responderEntradasItems[0][0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasItems[0][0].mensaje).toEqual('')
  })

  it('método "limpiarErrorRespGeneral" funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.crearListas()
    wrapper.vm.categorizarComentarios()
    wrapper.vm.crearRespuestasItems()
    wrapper.vm.responderEntradasGenerales[0].error = true
    wrapper.vm.responderEntradasGenerales[0].mensaje = 'mensaje de error de prueba'
    wrapper.vm.limpiarErrorRespGeneral(0)
    expect(wrapper.vm.responderEntradasGenerales[0].error).toBeFalsy()
    expect(wrapper.vm.responderEntradasGenerales[0].mensaje).toEqual('')
  })

  it('método "cerrarRespuestas" funciona correctamente', async () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    wrapper.vm.cerrarRespuestas()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().cerrar).toBeTruthy()
    expect(wrapper.emitted().cerrar.length).toEqual(1)
    expect(wrapper.emitted().cerrar[0]).toEqual([])
  })

  it('método "buscarIniciales" funciona correctamente', () => {
    const wrapper = shallowMount(Items, {
      propsData: {
        lista: lista,
        asistentes: presentes,
        comentar: false,
        responder: false,
        listaCom: listaComentarios
      }
    })
    expect(wrapper.vm.buscarIniciales(43)).toEqual('BRG')
  })
})
