import { shallowMount } from '@vue/test-utils'
import Informacion from '@/components/minutas/Informacion.vue'

describe('Informacion.vue', () => {

  const proyecto = {
    id: 62363,
    nombre: 'G04',
    proyecto: 'Proyecto de prueba',
    correlativo: 345,
    jornada: 'Diurna',
    estudiantes: [
      {
        id: 9,
        iniciales: 'GPP',
        usuario: {
          nombre: 'Gonzalo',
          apellido_paterno: 'Perez',
          apellido_materno: 'Parada',
          run: '12345678-9',
          email: 'gonzalo.perez@usach.cl'
        }
      }
    ],
    stakeholders: [
      {
        id: 56,
        iniciales: 'MAC',
        usuario: {
          nombre: 'Macarena',
          apellido_paterno: 'Astorga',
          apellido_materno: 'Castro',
          run: '12345678-9',
          email: 'macarena.astorga@puch.cl'
        }
      }
    ]
  }

  const bitacora = {
    id: 663462,
    revision: 'Z',
    identificador: 'ERC',
    minuta: {
      id: 242345345,
      correlativo: 6345,
      tema: 'Esto es una prueba',
      fecha_reunion: '2020-12-14T00:00:00.000Z',
      h_inicio: '2020-12-14T23:00:00.000Z',
      h_termino: '2020-12-14T23:59:00.000Z',
      clasificacion: {
        informativa: false,
        avance: false,
        decision: true,
        coordinacion: false,
        otro: false
      },
      asistencia: [
        {
          iniciales: 'GER',
          descripcion: 'Presente'
        },
        {
          iniciales: 'MAC',
          descripcion: 'Presente'
        }
      ]
    }
  }

  it('se asigna prop proyecto adecuadamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    const esperado = {
      id: 62363,
      nombre: 'G04',
      proyecto: 'Proyecto de prueba',
      correlativo: 345,
      jornada: 'Diurna',
      estudiantes: [
        {
          id: 9,
          iniciales: 'GPP',
          usuario: {
            nombre: 'Gonzalo',
            apellido_paterno: 'Perez',
            apellido_materno: 'Parada',
            run: '12345678-9',
            email: 'gonzalo.perez@usach.cl',
          }
        }
      ],
      stakeholders: [
        {
          id: 56,
          iniciales: 'MAC',
          usuario: {
            nombre: 'Macarena',
            apellido_paterno: 'Astorga',
            apellido_materno: 'Castro',
            run: '12345678-9',
            email: 'macarena.astorga@puch.cl'
          }
        }
      ]
    }
    expect(wrapper.props().proyecto).toEqual(esperado)
  })

  it('se asigna prop minuta adecuadamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    const esperado = {
      id: 663462,
      revision: 'Z',
      identificador: 'ERC',
      minuta: {
        id: 242345345,
        correlativo: 6345,
        tema: 'Esto es una prueba',
        fecha_reunion: '2020-12-14T00:00:00.000Z',
        h_inicio: '2020-12-14T23:00:00.000Z',
        h_termino: '2020-12-14T23:59:00.000Z',
        clasificacion: {
          informativa: false,
          avance: false,
          decision: true,
          coordinacion: false,
          otro: false
        },
        asistencia: [
          {
            iniciales: 'GER',
            descripcion: 'Presente'
          },
          {
            iniciales: 'MAC',
            descripcion: 'Presente'
          }
        ]
      }
    }
    expect(wrapper.props().minuta).toEqual(esperado)
  })

  it('variable grupo se inicializa correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    const esperado = {
      id: 62363,
      nombre: 'G04',
      proyecto: 'Proyecto de prueba',
      correlativo: 345,
      jornada: 'Diurna',
      estudiantes: [
        {
          id: 9,
          iniciales: 'GPP',
          usuario: {
            nombre: 'Gonzalo',
            apellido_paterno: 'Perez',
            apellido_materno: 'Parada',
            run: '12345678-9',
            email: 'gonzalo.perez@usach.cl'
          }
        }
      ],
      stakeholders: [
        {
          id: 56,
          iniciales: 'MAC',
          usuario: {
            nombre: 'Macarena',
            apellido_paterno: 'Astorga',
            apellido_materno: 'Castro',
            run: '12345678-9',
            email: 'macarena.astorga@puch.cl'
          }
        }
      ]
    }
    expect(wrapper.vm.grupo).toEqual(esperado)
  })

  it('variable bitacora se inicializa correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    const esperado = {
      id: 663462,
      revision: 'Z',
      identificador: 'ERC',
      minuta: {
        id: 242345345,
        correlativo: 6345,
        tema: 'Esto es una prueba',
        fecha_reunion: '2020-12-14T00:00:00.000Z',
        h_inicio: '2020-12-14T23:00:00.000Z',
        h_termino: '2020-12-14T23:59:00.000Z',
        clasificacion: {
          informativa: false,
          avance: false,
          decision: true,
          coordinacion: false,
          otro: false
        },
        asistencia: [
          {
            iniciales: 'GER',
            descripcion: 'Presente'
          },
          {
            iniciales: 'MAC',
            descripcion: 'Presente'
          }
        ]
      }
    }
    expect(wrapper.vm.bitacora).toEqual(esperado)
  })

  it('propiedad computada fechaReunion funciona correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.fechaReunion).toEqual('14-12-2020')
  })

  it('método obtenerHora funciona correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.obtenerHora('2020-12-14T23:00:00.000Z')).toEqual('23:00')
  })

  it('propiedad computada horaInicio funciona correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.horaInicio).toEqual('23:00')
  })

  it('propiedad computada horaTermino funciona correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.horaTermino).toEqual('23:59')
  })

  it('propiedad computada "revisionEstado" funciona correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.revisionEstado).toEqual('Para el cliente')
  })

  it('propiedad computada "revisionEstado" funciona correctamente con "bitacora" vacía', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    wrapper.vm.bitacora = {}
    expect(wrapper.vm.revisionEstado).toEqual('')
  })

  it('método nombreCompleto funciona correctamente', () => {
    const estudiante = {
      nombre: 'Marcelo',
      apellido_paterno: 'Farias',
      apellido_materno: 'Venegas'
    }
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.nombreCompleto(estudiante)).toEqual('Marcelo Farias Venegas')
  })

  it('método asistenciaEstudiante funciona correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.asistenciaEstudiante('GER')).toEqual('Presente')
  })

  it('método asistenciaStakeholder funciona correctamente', () => {
    const wrapper = shallowMount(Informacion, {
      propsData: {
        proyecto: proyecto,
        minuta: bitacora
      }
    })
    expect(wrapper.vm.asistenciaStakeholder('MAC')).toEqual('Presente')
  })
})
