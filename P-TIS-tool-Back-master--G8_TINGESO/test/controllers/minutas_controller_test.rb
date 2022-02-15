require 'test_helper'

class MinutasControllerTest < ActionDispatch::IntegrationTest

  # Revisión del funcionamiento del servicio 'create'

  test "Debería obtener código '401' al tratar de crear una minuta sin autenticación" do
    assert_difference 'Minuta.count', 0 do
      post minutas_url, params: {
        minuta: {
          estudiante_id: estudiantes(:uno).id,
          correlativo: 1,
          codigo: 'MINUTA_G01_05_2020-2_1112',
          fecha_reunion: '2020-11-12',
          h_inicio: '13:00',
          h_termino: '14:00',
          tipo_minuta_id: tipo_minutas(:one).id
        },
        clasificacion: {
          informativa: false,
          avance: false,
          coordinacion: true,
          decision: true,
          otro: false
        },
        tema: 'Minuta de prueba',
        objetivos: ['Este es el primer objetivo', 'Este es el segundo objetivo'],
        conclusiones: ['Esta es la primera conclusión', 'Esta es la segunda conclusion'],
        items: [{
          correlativo: 1,
          descripcion: 'Primer item',
          fecha: '',
          tipo_item_id: tipo_items(:one).id,
          responsables: [0]
          },
          {
            correlativo: 2,
            descripcion: 'Segundo item',
            fecha: '2020-12-05',
            tipo_item_id: tipo_items(:two).id,
            responsables: [asistencias(:Pablo).id]
          }
        ],
        bitacora_revision: {
          revision: 'A',
          motivo_id: motivos(:one).id
        },
        asistencia: [
          {estudiante: estudiantes(:one).id, asistencia: tipo_asistencias(:one).id},
          {estudiante: estudiantes(:two).id, asistencia: tipo_asistencias(:two).id}
        ],
        tipo_estado: tipo_estados(:one).id
      }
    end
  end

  test "Debería poder crear una minuta" do
    assert_difference 'BitacoraEstado.count', 1 do
      assert_difference 'Registro.count', 13 do
        assert_difference 'Asistencia.count', 2 do
          assert_difference 'Item.count', 2 do
            assert_difference 'Responsable.count', 1 do
              assert_difference 'Objetivo.count', 2 do
                assert_difference 'Conclusion.count', 2 do
                  assert_difference 'BitacoraRevision.count', 1 do
                    assert_difference 'Tema.count', 1 do
                      assert_difference 'Clasificacion.count', 1 do
                        assert_difference 'Minuta.count', 1 do
                          post minutas_url, params: {
                            minuta: {
                              estudiante_id: estudiantes(:uno).id,
                              correlativo: 1,
                              codigo: 'MINUTA_G01_05_2020-2_1112',
                              fecha_reunion: '2020-11-12',
                              h_inicio: '13:00',
                              h_termino: '14:00',
                              tipo_minuta_id: tipo_minutas(:one).id
                            },
                            clasificacion: {
                              informativa: false,
                              avance: false,
                              coordinacion: true,
                              decision: true,
                              otro: false
                            },
                            tema: 'Minuta de prueba',
                            objetivos: [
                              {id: 0, descripcion: 'Este es el primer objetivo'},
                              {id: 0, descripcion: 'Este es el segundo objetivo'}
                            ],
                            conclusiones: [
                              {id: 0, descripcion: 'Esta es la primera conclusión'},
                              {id: 0, descripcion: 'Esta es la segunda conclusion'}
                            ],
                            items: [{
                              correlativo: 1,
                              descripcion: 'Primer item',
                              fecha: '',
                              tipo_item_id: tipo_items(:one).id,
                              responsables: [{tipo: '', id: 0}]
                              },
                              {
                                correlativo: 2,
                                descripcion: 'Segundo item',
                                fecha: '2020-12-05',
                                tipo_item_id: tipo_items(:two).id,
                                responsables: [{tipo: 'est', id: estudiantes(:uno).id}]
                              }
                            ],
                            bitacora_revision: {
                              revision: 'A',
                              motivo_id: motivos(:one).id
                            },
                            asistencia: [
                              {estudiante: estudiantes(:uno).id, asistencia: tipo_asistencias(:one).id},
                              {estudiante: estudiantes(:two).id, asistencia: tipo_asistencias(:two).id}
                            ],
                            tipo_estado: tipo_estados(:one).id
                          }, headers: authenticated_header(usuarios(:Pablo), 'pablo123')
                        end
                      end
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end


  # Revisión de funcionamiento del servicio 'show'

  test "Debería obtener código '401' al tratar de obtener 'show'" do
    get minuta_url(id: minutas(:one).id)
    assert_response 401
  end

  test "Debería poder obtener la minuta seleccionada" do
    get minuta_url(id: bitacora_revisiones(:one).id), headers: authenticated_header(usuarios(:coordinador), 'coordinacion')
    assert_response :success
  end


  # Revisión del funcionamiento del servicio 'update'

  test "Debería obtener código '401' al tratar de obtener 'update' sin autenticación" do
    patch '/minutas/' + bitacora_revisiones(:one).id.to_s, params: {
      id: bitacora_revisiones(:one).id,
      minuta: {
        estudiante_id: estudiantes(:uno).id,
        correlativo: 1,
        codigo: 'MINUTA_G01_05_2020-2_1112',
        fecha_reunion: '2020-11-12',
        h_inicio: '13:00',
        h_termino: '14:00',
        tipo_minuta_id: tipo_minutas(:one).id
      },
      clasificacion: {
        informativa: false,
        avance: false,
        coordinacion: true,
        decision: true,
        otro: false
      },
      tema: 'Minuta de prueba',
      objetivos: [
        {id: 0, descripcion: 'Este es el primer objetivo'},
        {id: 0, descripcion: 'Este es el segundo objetivo'}
      ],
      conclusiones: [
        {id: 0, descripcion: 'Esta es la primera conclusión'},
        {id: 0, descripcion: 'Esta es la segunda conclusion'}
      ],
      items: [{
        correlativo: 1,
        descripcion: 'Primer item',
        fecha: '',
        tipo_item_id: tipo_items(:one).id,
        responsables: [{tipo: '', id: 0}]
        },
        {
          correlativo: 2,
          descripcion: 'Segundo item',
          fecha: '2020-12-05',
          tipo_item_id: tipo_items(:two).id,
          responsables: [{tipo: 'est', id: estudiantes(:uno).id}]
        }
      ],
      bitacora_revision: {
        revision: 'A',
        motivo_id: motivos(:one).id
      },
      asistencia: [
        {estudiante: estudiantes(:uno).id, asistencia: tipo_asistencias(:one).id},
        {estudiante: estudiantes(:two).id, asistencia: tipo_asistencias(:two).id}
      ],
      tipo_estado: tipo_estados(:one).id
    }
    assert_response 401
  end

  test "Debería poder actualizar la información de una minuta de reunión" do
    @bitacora = bitacora_revisiones(:three)
    patch '/minutas/' + bitacora_revisiones(:three).id.to_s, params: {
      id: bitacora_revisiones(:three).id,
      minuta: {
        estudiante_id: estudiantes(:uno).id,
        correlativo: 1,
        codigo: 'MINUTA_G01_05_2020-2_1112',
        fecha_reunion: '2020-11-12',
        h_inicio: '13:00',
        h_termino: '14:00',
        tipo_minuta_id: tipo_minutas(:one).id
      },
      clasificacion: {
        informativa: false,
        avance: false,
        coordinacion: true,
        decision: true,
        otro: false
      },
      tema: 'Minuta de prueba',
      objetivos: [
        {id: objetivos(:three).id, descripcion: 'Este es el primer objetivo'},
        {id: objetivos(:four).id, descripcion: 'Este es el segundo objetivo'}
      ],
      conclusiones: [
        {id: conclusiones(:three).id, descripcion: 'Esta es la primera conclusión'},
        {id: conclusiones(:four).id, descripcion: 'Esta es la segunda conclusion'}
      ],
      items: [{
        correlativo: 1,
        descripcion: 'Primer item',
        fecha: '',
        tipo_item_id: tipo_items(:one).id,
        responsables: [{tipo: '', id: 0}]
        },
        {
          correlativo: 2,
          descripcion: 'Segundo item',
          fecha: '2020-12-05',
          tipo_item_id: tipo_items(:two).id,
          responsables: [{tipo: 'est', id: estudiantes(:uno).id}]
        }
      ],
      bitacora_revision: {
        revision: 'A',
        motivo_id: motivos(:one).id
      },
      asistencia: [
        {estudiante: estudiantes(:uno).id, asistencia: tipo_asistencias(:one).id},
        {estudiante: estudiantes(:two).id, asistencia: tipo_asistencias(:two).id}
      ],
      tipo_estado: tipo_estados(:one).id
    }, headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    @bitacora.reload
    assert_equal @bitacora.minuta.codigo, 'MINUTA_G01_05_2020-2_1112'
    assert_equal @bitacora.minuta.fecha_reunion, Date.new(2020,11,12)
    assert_equal @bitacora.minuta.h_inicio, Time.utc(2000,1,1,13,0)
    assert_equal @bitacora.minuta.h_termino, Time.utc(2000,1,1,14,0)
    assert_equal @bitacora.minuta.clasificacion.informativa, false
    assert_equal @bitacora.minuta.clasificacion.avance, false
    assert_equal @bitacora.minuta.clasificacion.coordinacion, true
    assert_equal @bitacora.minuta.clasificacion.decision, true
    assert_equal @bitacora.minuta.clasificacion.otro, false
    assert_equal @bitacora.tema.tema, 'Minuta de prueba'
    assert_equal @bitacora.objetivos[0].descripcion, 'Este es el primer objetivo'
    assert_equal @bitacora.objetivos[1].descripcion, 'Este es el segundo objetivo'
    assert_equal @bitacora.conclusiones[0].descripcion, 'Esta es la primera conclusión'
    assert_equal @bitacora.conclusiones[1].descripcion, 'Esta es la segunda conclusion'
    assert_equal @bitacora.items.find_by(correlativo: 1).descripcion, 'Primer item'
    assert_equal @bitacora.items.find_by(correlativo: 2).descripcion, 'Segundo item'
    assert_equal @bitacora.items.find_by(correlativo: 2).fecha, Date.new(2020,12,5)
    assert_response :success
  end


  # Revisión del funcionamiento del servicio 'correlativo'

  test "Debería obtener código '401' al tratar de obtener correlativo sin autenticación" do
    get '/minutas/correlativo/' + grupos(:one).id.to_s
    assert_response 401
  end

  test "Debería obtener el número correlativo siguiente para el grupo" do
    get '/minutas/correlativo/' + grupos(:one).id.to_s,
      headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    assert_response :success
  end


  # Revisión del funcionamiento del servicio 'por_grupo'

  test "Debería obtener código '401' al tratar de obtener las minutas de un grupo sin autenticación" do
    get '/minutas/grupo/' + grupos(:one).id.to_s
    assert_response 401
  end

  test "Debería obtener el listado de minutas de un grupo" do
    get '/minutas/grupo/' + grupos(:one).id.to_s,
      headers: authenticated_header(usuarios(:coordinador), 'coordinacion')
    assert_response :success
  end


  # Revisión del funcionamiento del servicion 'por_estados'

  test "Debería obtener código '401' al tratar de obtener 'por_estados' sin autenticación" do
    get '/minutas/revision/estados'
    assert_response 401
  end

  test "Debería obtener código '422' al tratar de obtener 'por_estados' como coodinador" do
    get '/minutas/revision/estados', headers: authenticated_header(usuarios(:coordinador), 'coordinacion')
    assert_response 422
  end

  test "Debería obtener código '422' al tratar de obtener 'por_estados' como profesor" do
    get '/minutas/revision/estados', headers: authenticated_header(usuarios(:profesor), 'profe')
    assert_response 422
  end

  test "Debería obtener código '422' al tratar de obtener 'por_estados' como stakeholder" do
    get '/minutas/revision/estados', headers: authenticated_header(usuarios(:stakeholder), 'cliente')
    assert_response 422
  end

  test "Debería obener el listado de minutas de un estudiante" do
    get '/minutas/revision/estados', headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    assert_response :success
  end


  # Revision del funcionamiento del servicio 'revision_grupo'

  test "Debería obtener código '401' al tratar de obtener 'revision_grupo' sin autenticación" do
    get '/minutas/revision/grupo'
    assert_response 401
  end

  test "Debería obtener código '422' al tratar de obtener 'revision_grupo' como coordinador" do
    get '/minutas/revision/grupo', headers: authenticated_header(usuarios(:coordinador), 'coordinacion')
    assert_response 422
  end

  test "Debería obtener código '422' al tratar de obtener 'revision_grupo' como profesor" do
    get '/minutas/revision/grupo', headers: authenticated_header(usuarios(:profesor), 'profe')
    assert_response 422
  end

  test "Debería obtener código '422' al tratar de obtener 'revision_grupo' como stakeholder" do
    get '/minutas/revision/grupo', headers: authenticated_header(usuarios(:stakeholder), 'cliente')
    assert_response 422
  end

  test "Debería obtener el listado de minutas a revisar por un estudiante" do
    get '/minutas/revision/grupo', headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    assert_response :success
  end


  # Revisión del funcionamiento del servicio 'revision_cliente'

  test "Debería obtener código '401' al tratar de obtener 'revision_cliente' sin autenticación" do
    get '/minutas/revision/cliente/' + grupos(:one).id.to_s
    assert_response 401
  end

  test "Debería obtener código '422' al tratar de obtener 'revision_cliente' como 'estudiante'" do
    get '/minutas/revision/cliente/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    assert_response 422
  end

  test "Debería obtener código '422' al tratar de obtener 'revision_cliente' como 'profeosr'" do
    get '/minutas/revision/cliente/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:profesor), 'profe')
    assert_response 422
  end

  test "Debería obtener código '422' al tratar de obtener 'revision_cliente' como 'coordinador'" do
    get '/minutas/revision/cliente/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:coordinador), 'coordinacion')
    assert_response 422
  end

  test "Debería obtener el listado de minutas a revisar por un stakeholder" do
    get '/minutas/revision/cliente/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:stakeholder), 'cliente')
    assert_response :success
  end


  # Revision del funcionamiento del servicio 'por_respuestas'

  test "Debería obtener código 401 al tratar de obtener 'por_respuestas' sin autenticación" do
    get minutas_revision_respondidas_url
    assert_response 401
  end

  test "Debería obtener código 422 al tratar de obtener 'por_respuestas' como coordinador" do
    get minutas_revision_respondidas_url, headers: authenticated_header(usuarios(:coordinador), 'coordinacion')
    assert_response 422
  end

  test "Debería obtener código 422 al tratar de obtener 'por_respuestas' como profesor" do
    get minutas_revision_respondidas_url, headers: authenticated_header(usuarios(:profesor), 'profe')
    assert_response 422
  end

  test "Debería obtener código 422 al tratar de obtener 'por_respuestas' como stakeholder" do
    get minutas_revision_respondidas_url, headers: authenticated_header(usuarios(:stakeholder), 'cliente')
    assert_response 422
  end

  test "Debería obtener el listado de minutas respondidas como estudiante" do
    get minutas_revision_respondidas_url, headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    assert_response :success
  end


  # Revisión del funcionamiento del serivicio 'crear_avance'

  test "Debería obtener código 401 al tratar de crear un avance sin autenticación" do
    post minutas_avance_semanal_url(params: {
      minuta: {
        estudiante_id: estudiantes(:uno).id,
        codigo: 'MINUTA_G01_05_2020-2_0105',
        correlativo: 9534,
        fecha_avance: '2021-01-05',
        tipo_minuta_id: tipo_minutas(:one).id
      },
      numero_sprint: 9454,
      logros: [
        {id: 94534, descripcion: 'Esto es un logro de prueba', correlativo: 82345},
        {id: 46334, descripcion: 'Este es otro logro de prueba', correlativo: 94513}
      ],
      metas: [
        {id: 34534, descripcion: 'Esta es una meta de prueba', correlativo: 345413},
        {id: 11345, descripcion: 'Esta es otra meta de prueba', correlativo: 45343}
      ]
    })
    assert_response 401
  end

  test "Debería poder crear una minuta de avance semanal" do
    assert_difference 'BitacoraEstado.count', 1 do
      assert_difference 'Registro.count', 7 do
        assert_difference 'Item.count', 6 do
          assert_difference 'Responsable.count', 1 do
            assert_difference 'Asistencia.count', 1 do
              assert_difference 'BitacoraRevision.count', 1 do
                post minutas_avance_semanal_url(params: {
                  minuta: {
                    estudiante_id: estudiantes(:uno).id,
                    codigo: 'MINUTA_G01_05_2020-2_0105',
                    correlativo: 9534,
                    fecha_avance: '2021-01-05',
                    tipo_minuta_id: tipo_minutas(:one).id
                  },
                  numero_sprint: 9454,
                  logros: [
                    {id: 94534, descripcion: 'Esto es un logro de prueba', correlativo: 82345},
                    {id: 46334, descripcion: 'Este es otro logro de prueba', correlativo: 94513}
                  ],
                  metas: [
                    {id: 34534, descripcion: 'Esta es una meta de prueba', correlativo: 345413},
                    {id: 11345, descripcion: 'Esta es otra meta de prueba', correlativo: 45343}
                  ],
                  impedimentos: [
                    {id: 923453, descripcion: 'Este es un impedimento de prueba', correlativo: 8534},
                    {id: 72453, descripcion: 'Este es otro impedimento de prueba', correlativo: 493453}
                  ]
                }), headers: authenticated_header(usuarios(:Pablo), 'pablo123')
              end
            end
          end
        end
      end
    end
  end


  # Revisión del funcionamiento del servicio 'correlativo_semanal'

  test "Debería obtener código 401 al tratar de obtener 'correlativo_semanal' sin autenticación" do
    get '/minutas/correlativo/semanal/' + grupos(:one).id.to_s
    assert_response 401
  end

  test "Debería obtener el nuevo correlativo de minutas de avance semanal para el grupo" do
    get '/minutas/correlativo/semanal/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    assert_response :success
  end


  # Revisión del funcionamiento del servicio 'avances_por_grupo'

  test "Debería obtener código 401 al tratar de obtener 'avances_por_grupo' sin autenticación" do
    get '/minutas/avances/semanales/grupo/' + grupos(:one).id.to_s
    assert_response 401
  end

  test "Debería obtener el listado de minutas de avance de un grupo como coordinador" do
    get '/minutas/avances/semanales/grupo/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:coordinador), 'coordinacion')
    assert_response :success
  end

  test "Debería obtener el listado de minutas de avance de un grupo como profesor" do
    get '/minutas/avances/semanales/grupo/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:profesor), 'profe')
    assert_response :success
  end

  test "Debería obtener el listado de minutas de avance de un grupo como estudiante" do
    get '/minutas/avances/semanales/grupo/' + grupos(:one).id.to_s, headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    assert_response :success
  end


  # Revision del funcionamiento del servicio 'actualizar_avance'

  test "Debería obtener código 401 al tratar de actualizar una minuta de avance sin autenticación" do
    post minutas_actualizar_avance_semanal_url, params: {
      id: bitacora_revisiones(:avance).id,
      minuta: {
        estudiante_id: estudiantes(:uno).id,
        codigo: 'MINUTA_G01_05_2020-2_0105',
        correlativo: 9534,
        fecha_avance: '2021-01-05',
        tipo_minuta_id: tipo_minutas(:one).id
      },
      numero_sprint: 9454,
      logros: [
        {id: 94534, descripcion: 'Esto es un logro de prueba', correlativo: 82345},
        {id: 46334, descripcion: 'Este es otro logro de prueba', correlativo: 94513}
      ],
      metas: [
        {id: 34534, descripcion: 'Esta es una meta de prueba', correlativo: 345413},
        {id: 11345, descripcion: 'Esta es otra meta de prueba', correlativo: 45343}
      ],
      emitir: false
    }
    assert_response 401
  end

=begin

    ### NO es posible testear la actualización de miutas de avance por problemas de asignación de 'ids' de rails test

  test "Debería poder actualizar una minuta de avance" do
    @bitacora = bitacora_revisiones(:avance)
    assert_difference 'Registro.count', 2 do
      post minutas_actualizar_avance_semanal_url, params: {
        id: bitacora_revisiones(:avance).id,
        minuta: {
          estudiante_id: estudiantes(:uno).id,
          codigo: 'MINUTA_G01_05_2020-2_0105',
          correlativo: 9534,
          fecha_avance: '2021-01-05',
          tipo_minuta_id: tipo_minutas(:one).id
        },
        numero_sprint: 9454,
        logros: [
          {id: 1000, descripcion: 'Esto es un logro de prueba', correlativo: 82345},
          {id: 2000, descripcion: 'Este es otro logro de prueba', correlativo: 94513}
        ],
        metas: [
          {id: 3000, descripcion: 'Esta es una meta de prueba', correlativo: 345413},
          {id: 4000, descripcion: 'Esta es otra meta de prueba', correlativo: 45343}
        ],
        emitir: false
      }, headers: authenticated_header(usuarios(:Pablo), 'pablo123')
    end
    @bitacora.reload
    assert_equal Date.new(2021,1,5), @bitacora.minuta.fecha_reunion
    assert_equal 9454, @bitacora.minuta.numero_sprint
    assert_equal 4, @bitacora.items.size
    assert_equal 'Esto es un logro de prueba', @bitacora.items.find(1000).descripcion
    assert_equal 'Este es otro logro de prueba', @bitacora.items.find(2000).descripcion
    assert_equal 'Esta es una meta de prueba', @bitacora.items.find(3000).descripcion
    assert_equal 'Esta es otra meta de prueba', @bitacora.items.find(4000).descripcion
    assert_response :success
  end

  test "Debería poder agrega logros y metas a una minuta de avance" do
    @bitacora = bitacora_revisiones(:avance)
    @minuta = minutas(:avance)
    post minutas_actualizar_avance_semanal_url, params: {
      id: bitacora_revisiones(:avance).id,
      minuta: {
        estudiante_id: estudiantes(:uno).id,
        codigo: 'MINUTA_G01_05_2020-2_0105',
        correlativo: 9534,
        fecha_avance: '2021-01-05',
        tipo_minuta_id: tipo_minutas(:one).id
      },
      numero_sprint: 9454,
      logros: [
        {id: 0, descripcion: 'Esto es un logro de prueba', correlativo: 82345},
        {id: 0, descripcion: 'Este es otro logro de prueba', correlativo: 94513}
      ],
      metas: [
        {id: 0, descripcion: 'Esta es una meta de prueba', correlativo: 345413},
        {id: 0, descripcion: 'Esta es otra meta de prueba', correlativo: 45343}
      ],
      emitir: true
    }, headers: authenticated_header(usuarios(:Maria), 'maria123')
    @bitacora.reload
    @minuta.reload
    assert_response :success
  end
=end

end
