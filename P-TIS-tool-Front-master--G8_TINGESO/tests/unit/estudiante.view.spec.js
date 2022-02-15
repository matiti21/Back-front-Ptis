import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import axios from 'axios'
import Estudiante from '@/components/views/Estudiante.vue'

const apiUrl = '127.0.0.1:3000'

// Mock store
const store = createStore({
  state() {
    return {
      apiUrl: apiUrl,
      tipoMinutas: [],
      usuario: {
        id: 345,
        nombre: 'Manuel',
        apellido_paterno: 'Aravena',
        apellido_materno: 'Hernandez',
        run: '12345678-9',
        email: 'manuel.aravena@algo.com',
        rol_id: 6493,
        rol: {
          id: 6493,
          rol: 'Estudiante',
          rango: 3
        }
      },
      estudiante: {},
      grupo: {},
      motivos: [],
      tipoAprobaciones: []
    }
  },
  mutations: {
    setTipoMinutas(state, valor) {
      state.tipoMinutas = valor
    },
    setEstudiante(state, valor) {
      state.estudiante = valor
    },
    setGrupo(state, valor) {
      state.grupo = valor
    },
    setTipoAprobaciones(state, valor) {
      state.tipoAprobaciones = valor
    },
    setMotivos(state, valor) {
      state.motivos = valor
    }
  }
})

// Variables globales
const tipoMinutas = [
  {id: 463, tipo: 'Coordinacion'},
  {id: 6921, tipo: 'Cliente'},
  {id: 631, tipo: 'Semanal'}
]

const estudiante = {
  id: 964,
  iniciales: 'MAH',
  usuario_id: 345,
  seccion_id: 5,
  grupo_id: 123,
  usuario: {
    id: 345,
    nombre: 'Manuel',
    apellido_paterno: 'Aravena',
    apellido_materno: 'Hernandez',
    run: '12345678-9',
    email: 'manuel.aravena@algo.com',
    rol_id: 6493
  }
}

const grupo = {
  id: 123,
  nombre: 'G05',
  proyecto: 'Prueba de estudiantes',
  correlativo: 5,
  estudiantes: [
    {
      id: 964,
      iniciales: 'MAH',
      usuario: {
        nombre: 'Manuel',
        apellido_paterno: 'Aravena',
        apellido_materno: 'Hernandez',
        run: '12345678-9',
        email: 'manuel.aravena@algo.com'
      }
    }
  ]
}

const tipoAprobaciones = [
  {id: 9643, identificador: 'A', descripcion: 'Aprobada', rango: 1},
  {id: 2353, identificador: 'AC', descripcion: 'Aprobada con comentarios', rango: 2},
  {id: 4613, identificador: 'R', descripcion: 'Rechazada', rango: 3},
  {id: 963, identificador: 'RC', descripcion: 'Rechazada con comentarios', rango: 4}
]

const motivos = [
  {id: 9643, motivo: 'Coordinacion interna', identificador: 'ECI'},
  {id: 9436, motivo: 'Para aprobacion', identificador: 'PA'},
  {id: 9233, motivo: 'Emision final', identificador: 'EF'}
]

const bitacora = {
  id: 23453,
  emitida: false,
  activa: true,
  fecha_emision: null,
  minuta: {
    id: 5342,
    estudiante_id: 6342,
    correlativo: 3,
    codigo: 'MINUTA_G04_03_2020-2_0108',
    fecha_reunion: '2020-01-10T00:00:00.000Z',
    numero_sprint: 34,
    creada_el: '2020-01-10T08:45:34.000Z',
    asistencia: [
      {
        id: 434,
        id_estudiante: 6342,
        id_stakeholder: null,
        minuta_id: 5432,
        tipo_asistencia_id: 1
      }
    ],
    items: [
      {
        id: 93463,
        descripcion: 'Esto es un logro de prueba',
        correlativo: 32,
        tipo_item: {
          id: 34523,
          tipo: 'Logro',
          descripcion: 'Logro conseguido'
        },
        responsables: {
          id: 234,
          asistencia_id: 134
        }
      }
    ],
    bicatora_estado: {
      id: 42324,
      tipo_estado: {
        id: 234,
        abreviacion: 'BOR',
        descripcion: 'Borrador'
      }
    }
  }
}

// Mock axios
jest.mock('axios')

axios.get.mockImplementation((url) => {
  switch (url) {
    case apiUrl + '/tipo_minutas':
      return Promise.resolve({data: tipoMinutas})
    case apiUrl + '/estudiantes/345':
      return Promise.resolve({data: estudiante})
    case apiUrl + '/grupos/123':
      return Promise.resolve({data: grupo})
    case apiUrl + '/tipo_aprobaciones':
      return Promise.resolve({data: tipoAprobaciones})
    case apiUrl + '/motivos':
      return Promise.resolve({data: motivos})
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('Estudiante.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Estudiante, {
      global: {
        plugins: [store]
      }
    })
  })

  // Comienzo de pruebas unitarias
  it('variable "verFormulario" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verFormulario).toBeFalsy()
  })

  it('variable "tipo" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tipo).toEqual(0)
  })

  it('variable "seleccionarMinuta" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.seleccionarMinuta).toBeFalsy()
  })

  it('variable "idBitacora" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idBitacora).toEqual(0)
  })

  it('variable "idRevision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idRevision).toEqual(0)
  })

  it('variable "idComentarios" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idComentarios).toEqual(0)
  })

  it('variable "idRespuestas" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idRespuestas).toEqual(0)
  })

  it('variable "idEmision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idEmision).toEqual(0)
  })

  it('variable "idVerMinuta" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idVerMinuta).toEqual(0)
  })

  it('variable "crearMinuta" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.crearMinuta).toBeTruthy()
  })

  it('variable "verRevision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verRevision).toBeFalsy()
  })

  it('variable "verComentarios" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verComentarios).toBeFalsy()
  })

  it('variable "verRespuestas" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verRespuestas).toBeFalsy()
  })

  it('variable "verEmision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verEmision).toBeFalsy()
  })

  it('variable "verSemanal" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.verSemanal).toBeFalsy()
  })

  it('variable "revisarSemanal" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.revisarSemanal).toBeFalsy()
  })

  it('variable "idMotivo" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.idMotivo).toEqual(0)
  })

  it('variable "nuevaRevision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nuevaRevision).toEqual('')
  })

  it('variable "esNuevaEmision" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.esNuevaEmision).toBeFalsy()
  })

  it('variable "valorActual" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.valorActual).toEqual(0)
  })

  it('variable "tableroEst" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableroEst).toEqual(0)
  })

  it('variable "bitacoraAvance" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.bitacoraAvance).toEqual({})
  })

  it('variable "revisionEstado" se inicializa correctamente', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.revisionEstado).toEqual('')
  })

  it('propiedad computada "minutasFiltradas" funciona correctamente', async () => {
    const esperado = [
      {id: 463, tipo: 'Coordinacion'},
      {id: 6921, tipo: 'Cliente'}
    ]
    wrapper.vm.obtenerTipoMinutas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.minutasFiltradas).toEqual(esperado)
  })

  it('método "nuevaMinuta" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.nuevaMinuta()
    expect(wrapper.vm.seleccionarMinuta).toBeTruthy()
  })

  it('método "cancelarMinuta" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.seleccionarMinuta = true
    wrapper.vm.tipo = 5
    wrapper.vm.cancelarMinuta()
    expect(wrapper.vm.seleccionarMinuta).toBeFalsy()
    expect(wrapper.vm.tipo).toEqual(0)
  })

  it('método "elegirTipo" funciona correctamente con tipo "Semanal"', async () => {
    wrapper.vm.obtenerTipoMinutas()
    wrapper.vm.obtenerMotivos()
    await wrapper.vm.$nextTick()
    wrapper.vm.verSemanal = false
    wrapper.vm.seleccionarMinuta = true
    wrapper.vm.tipo = 631
    wrapper.vm.elegirTipo()
    expect(wrapper.vm.verSemanal).toBeTruthy()
    expect(wrapper.vm.seleccionarMinuta).toBeFalsy()
  })

  it('método "elegirTipo" funciona correctamente con tipo distinto a "Semanal"', async () => {
    wrapper.vm.obtenerTipoMinutas()
    wrapper.vm.obtenerMotivos()
    await wrapper.vm.$nextTick()
    wrapper.vm.verFormulario = false
    wrapper.vm.seleccionarMinuta = true
    wrapper.vm.tipo = 463
    wrapper.vm.elegirTipo()
    expect(wrapper.vm.verFormulario).toBeTruthy()
    expect(wrapper.vm.seleccionarMinuta).toBeFalsy()
    expect(wrapper.vm.idMotivo).toEqual(9643)
    expect(wrapper.vm.nuevaRevision).toEqual('A')
  })

  it('método "cerrarFormulario" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verFormulario = true
    wrapper.vm.tipo = 5
    wrapper.vm.idBitacora = 960345
    wrapper.vm.esNuevaEmision = true
    wrapper.vm.cerrarFormulario()
    expect(wrapper.vm.verFormulario).toBeFalsy()
    expect(wrapper.vm.tipo).toEqual(0)
    expect(wrapper.vm.idBitacora).toEqual(0)
    expect(wrapper.vm.esNuevaEmision).toBeFalsy()
    expect(wrapper.vm.tableroEst).toEqual(1)
  })

  it('método "obtenerTipoMinutas" funciona correctamente', async () => {
    wrapper.vm.obtenerTipoMinutas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tipoMinutas).toEqual(tipoMinutas)
  })

  it('método "obtenerEstudiante" funciona correctamente', async () => {
    wrapper.vm.obtenerEstudiante()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.estudiante).toEqual(estudiante)
    expect(wrapper.vm.grupo).toEqual(grupo)
  })

  it('método "obtenerGrupo" funciona correctamente', async () => {
    wrapper.vm.obtenerGrupo()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.grupo).toEqual(grupo)
  })

  it('método "obtenerAprobaciones" funciona correctamente', async () => {
    wrapper.vm.obtenerAprobaciones()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$store.state.tipoAprobaciones).toEqual(tipoAprobaciones)
  })

  it('método "obtenerMotivos" funciona correctamente', async () => {
    wrapper.vm.obtenerMotivos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.motivos).toEqual(motivos)
  })

  it('método "cambiarTab" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verEmision = true
    wrapper.vm.cambiarTab()
    expect(wrapper.vm.verEmision).toBeFalsy()
  })

  it('método "establecerBitacora" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verFormulario = false
    wrapper.vm.verEmision = true
    wrapper.vm.establecerBitacora(32)
    expect(wrapper.vm.idBitacora).toEqual(32)
    expect(wrapper.vm.verFormulario).toBeTruthy()
    expect(wrapper.vm.verEmision).toBeFalsy()
  })

  it('método "establecerRevision" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verRevision = false
    wrapper.vm.crearMinuta = true
    wrapper.vm.verEmision = true
    wrapper.vm.establecerRevision(943)
    expect(wrapper.vm.idRevision).toEqual(943)
    expect(wrapper.vm.verRevision).toBeTruthy()
    expect(wrapper.vm.crearMinuta).toBeFalsy()
    expect(wrapper.vm.verEmision).toBeFalsy()
  })

  it('método "mostrarTablero" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verRevision = true
    wrapper.vm.verComentarios = true
    wrapper.vm.crearMinuta = false
    wrapper.vm.idRevision = 493
    wrapper.vm.idEmision = 39453
    wrapper.vm.verEmision = true
    wrapper.vm.valorActual = 9433
    wrapper.vm.mostrarTablero()
    expect(wrapper.vm.verRevision).toBeFalsy()
    expect(wrapper.vm.verComentarios).toBeFalsy()
    expect(wrapper.vm.crearMinuta).toBeTruthy()
    expect(wrapper.vm.idRevision).toEqual(0)
    expect(wrapper.vm.idEmision).toEqual(0)
    expect(wrapper.vm.verEmision).toBeFalsy()
    expect(wrapper.vm.valorActual).toEqual(0)
    expect(wrapper.vm.tableroEst).toEqual(1)
  })

  it('método "revisarComentarios" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verComentarios = false
    wrapper.vm.crearMinuta = true
    wrapper.vm.revisarComentarios(634)
    expect(wrapper.vm.idComentarios).toEqual(634)
    expect(wrapper.vm.verComentarios).toBeTruthy()
    expect(wrapper.vm.crearMinuta).toBeFalsy()
  })

  it('método "revisarRespuestas" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verRespuestas = false
    wrapper.vm.crearMinuta = true
    wrapper.vm.verEmision = true
    wrapper.vm.revisarRespuestas(9643)
    expect(wrapper.vm.idRespuestas).toEqual(9643)
    expect(wrapper.vm.verRespuestas).toBeTruthy()
    expect(wrapper.vm.crearMinuta).toBeFalsy()
    expect(wrapper.vm.verEmision).toBeFalsy()
  })

  it('método "nuevaVersion" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verEmision = false
    wrapper.vm.nuevaVersion(9463)
    expect(wrapper.vm.idEmision).toEqual(9463)
    expect(wrapper.vm.verEmision).toBeTruthy()
  })

  it('método "revisarAprobacion" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.crearMinuta = true
    wrapper.vm.valorActual = 96342
    wrapper.vm.revisarAprobacion()
    expect(wrapper.vm.crearMinuta).toBeFalsy()
    expect(wrapper.vm.valorActual).toEqual(0)
  })

  it('método "buscarIdMotivo" funciona correctamente', async () => {
    wrapper.vm.obtenerMotivos()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.buscarIdMotivo('ECI')).toEqual(9643)
  })

  it('método "buscarIdTipoMinuta" funciona correctamente', async () => {
    wrapper.vm.obtenerTipoMinutas()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.buscarIdTipoMinuta('Coordinacion')).toEqual(463)
  })

  it('método "nuevaEmision" funciona correctamente', async () => {
    wrapper.vm.obtenerTipoMinutas()
    wrapper.vm.obtenerEstudiante()
    wrapper.vm.obtenerAprobaciones()
    wrapper.vm.obtenerMotivos()
    await wrapper.vm.$nextTick()
    wrapper.vm.verRevision = true
    wrapper.vm.verComentarios = true
    wrapper.vm.verEmision = true
    wrapper.vm.crearMinuta = false
    wrapper.vm.verFormulario = false
    wrapper.vm.idRevision = 9634
    wrapper.vm.esNuevaEmision = false
    wrapper.vm.valorActual = 96432
    wrapper.vm.idEmision = 2234
    wrapper.vm.nuevaEmision('PA', 'B')
    expect(wrapper.vm.verRevision).toBeFalsy()
    expect(wrapper.vm.verComentarios).toBeFalsy()
    expect(wrapper.vm.verEmision).toBeFalsy()
    expect(wrapper.vm.crearMinuta).toBeTruthy()
    expect(wrapper.vm.verFormulario).toBeTruthy()
    expect(wrapper.vm.idRevision).toEqual(0)
    expect(wrapper.vm.idMotivo).toEqual(9436)
    expect(wrapper.vm.nuevaRevision).toEqual('B')
    expect(wrapper.vm.revisionEstado).toEqual('Sin estado')
    expect(wrapper.vm.idBitacora).toEqual(2234)
    expect(wrapper.vm.esNuevaEmision).toBeTruthy()
    expect(wrapper.vm.valorActual).toEqual(0)
    expect(wrapper.vm.tableroEst).toEqual(1)
  })

  it('método "cerrarSemanal" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verSemanal = true
    wrapper.vm.cerrarSemanal()
    expect(wrapper.vm.verSemanal).toBeFalsy()
  })

  it('método "editarAvance" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verSemanal = false
    wrapper.vm.seleccionarMinuta = true
    wrapper.vm.editarAvance(bitacora)
    expect(wrapper.vm.bitacoraAvance).toEqual(bitacora)
    expect(wrapper.vm.verSemanal).toBeTruthy()
    expect(wrapper.vm.seleccionarMinuta).toBeFalsy()
  })

  it('método "revisarAvance" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.revisarSemanal = false
    wrapper.vm.crearMinuta = true
    wrapper.vm.revisarAvance(bitacora)
    expect(wrapper.vm.bitacoraAvance).toEqual(bitacora)
    expect(wrapper.vm.revisarSemanal).toBeTruthy()
    expect(wrapper.vm.crearMinuta).toBeFalsy()
  })

  it('método "cerrarAvance" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.revisarSemanal = true
    wrapper.vm.cerrarAvance()
    expect(wrapper.vm.revisarSemanal).toBeFalsy()
  })

  it('método "mostrarMinuta" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verMinuta = false
    wrapper.vm.crearMinuta = true
    wrapper.vm.mostrarMinuta(64353)
    expect(wrapper.vm.verMinuta).toBeTruthy()
    expect(wrapper.vm.crearMinuta).toBeFalsy()
    expect(wrapper.vm.idVerMinuta).toEqual(64353)
  })

  it('método "cerrarMinuta" funciona correctamente', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.verMinuta = true
    wrapper.vm.idVerMinuta = 96345
    wrapper.vm.cerrarMinuta()
    expect(wrapper.vm.verMinuta).toBeFalsy()
    expect(wrapper.vm.idVerMinuta).toEqual(0)
  })

  it('método "revisionesPorEstados" funciona correctamente con "ECI"', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.revisionesPorEstados('ECI')
    expect(wrapper.vm.revisionEstado).toEqual('Coordinación de grupo')
  })

  it('método "revisionesPorEstados" funciona correctamente con "ERC"', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.revisionesPorEstados('ERC')
    expect(wrapper.vm.revisionEstado).toEqual('Para el cliente')
  })

  it('método "revisionesPorEstados" funciona correctamente con "EAC"', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.revisionesPorEstados('EAC')
    expect(wrapper.vm.revisionEstado).toEqual('Para aprobación')
  })

  it('método "revisionesPorEstados" funciona correctamente con "EF"', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.revisionesPorEstados('EF')
    expect(wrapper.vm.revisionEstado).toEqual('Emisión final')
  })

  it('método "revisionesPorEstados" funciona correctamente con identificador distinto', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.revisionesPorEstados('PA')
    expect(wrapper.vm.revisionEstado).toEqual('Sin estado')
  })
})
