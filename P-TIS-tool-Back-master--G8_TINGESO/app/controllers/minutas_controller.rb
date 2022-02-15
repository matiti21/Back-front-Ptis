class MinutasController < ApplicationController
  before_action :authenticate_usuario
  include JsonFormat
  include Funciones

  def join_seccion
    seccion_estudiante = Estudiante.find_by(usuario_id: current_usuario.id).seccion_id
    secciones = Seccion.find_by(id: seccion_estudiante)
    return secciones.profesores.ids[0]
  end

  # Servicio que crea una minuta en el sistema
  def create
    bitacora = BitacoraRevision.new
    bitacora.build_minuta(minuta_params)
    bitacora.minuta.build_clasificacion(clasificacion_params)
    bitacora.build_tema
    bitacora.tema.tema = params[:tema].to_s
    bitacora.assign_attributes(revision_params)
    tipo_estado = TipoEstado.find(params[:tipo_estado])
    estudiantesArreglo=[]
    if tipo_estado.abreviacion.eql?('EMI')
      bitacora.emitida = true
      bitacora.fecha_emision = Time.now
    end
    if bitacora.valid?
      bitacora.save!
      nueva_actividad(bitacora.minuta_id, 'M1')
      nueva_actividad(bitacora.minuta_id, 'M2')
      nueva_actividad(bitacora.minuta_id, 'T1')
      nueva_actividad(bitacora.minuta_id, 'M4')
      params[:objetivos].each do |obj|
        objetivo = Objetivo.new
        objetivo.descripcion = obj[:descripcion]
        objetivo.bitacora_revision_id = bitacora.id
        if objetivo.valid?
          objetivo.save!
          nueva_actividad(bitacora.minuta_id, 'O1')
        end
      end
      params[:conclusiones].each do |con|
        conclusion = Conclusion.new
        conclusion.descripcion = con[:descripcion]
        conclusion.bitacora_revision_id = bitacora.id
        if conclusion.valid?
          conclusion.save!
          nueva_actividad(bitacora.minuta_id, 'C1')
        end
      end
      params[:asistencia].each do |a|
        asistencia = Asistencia.new
        asistencia.minuta_id = bitacora.minuta.id
        unless a[:estudiante] == ''
          asistencia.id_estudiante = a[:estudiante]
          estudiantesArreglo << a
        end
        unless a[:stakeholder] == ''
          asistencia.id_stakeholder = a[:stakeholder]
        end
        asistencia.tipo_asistencia_id = a[:asistencia]
        if asistencia.valid?
          asistencia.save!
        end
      end
      nueva_actividad(bitacora.minuta_id, 'M3')
      asistencias = Asistencia.where('minuta_id = ?', bitacora.minuta.id)
      params[:items].each do |i|
        item = Item.new
        item.descripcion = i[:descripcion]
        item.correlativo = i[:correlativo]
        item.bitacora_revision_id = bitacora.id
        item.tipo_item_id = i[:tipo_item_id]
        unless i[:fecha] == ''
          item.fecha = i[:fecha]
        end
        i[:responsables].each do |resp|
          unless (resp.nil? || resp == '' || resp[:id] == 0)
            responsable = Responsable.new
            if resp[:tipo] == 'est'
              responsable.asistencia_id = asistencias.find_by(id_estudiante: resp[:id]).id
            elsif resp[:tipo] == 'stk'
              responsable.asistencia_id = asistencias.find_by(id_stakeholder: resp[:id]).id
            end
            if responsable.valid?
              responsable.save!
              item.responsables << responsable
              nueva_actividad(bitacora.minuta_id, 'R1')
            end
          end
        end
        if item.valid?
          item.save!
          nueva_actividad(bitacora.minuta_id, 'M5')
          unless i[:fecha] == ''
            nueva_actividad(bitacora.minuta_id, 'F1')
          end
        end
      end
      bitacora_estado = BitacoraEstado.new
      bitacora_estado.minuta_id = bitacora.minuta.id
      bitacora_estado.tipo_estado_id = tipo_estado.id
      if bitacora_estado.valid?
        bitacora_estado.save!
      end
      if tipo_estado.abreviacion.eql?('EMI')
       # if estudiantesArreglo.length == 1
        #  EstudiantesMailer.revisionCliente(bitacora).deliver_later
          #EstudiantesMailer.revisionProfesor(bitacora).deliver_later
        #end
        case bitacora.motivo.identificador
        when 'ECI'
          EstudiantesMailer.nuevaMinutaCoordinacion(bitacora).deliver_later
        when 'ERC'
          EstudiantesMailer.revisionCliente(bitacora).deliver_later
          EstudiantesMailer.avisoAestudiantes(bitacora).deliver_later
          EstudiantesMailer.revisionProfesorCliente(bitacora).deliver_later
        end
      end
    else
      render json: ['error': 'Información de la minuta no es válida'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega la información de una minuta a partir del 'id' de su bitácora de revisión
  def show
    bitacora = BitacoraRevision.joins(minuta: {estudiante: :grupo}).joins(minuta: :tipo_minuta).joins(minuta: :clasificacion).joins(:motivo).joins(:tema).select('
      bitacora_revisiones.id AS id_bitacora,
      bitacora_revisiones.revision AS rev_min,
      motivos.motivo AS motivo_min,
      motivos.identificador AS motivo_ident,
      temas.tema AS tema_min,
      minutas.id AS id_minuta,
      minutas.codigo AS codigo_min,
      minutas.correlativo AS correlativo_min,
      minutas.fecha_reunion AS fecha_min,
      minutas.h_inicio AS hora_ini,
      minutas.h_termino AS hora_ter,
      minutas.created_at AS creada_el,
      estudiantes.iniciales AS iniciales_est,
      tipo_minutas.tipo AS tipo_min,
      clasificaciones.informativa AS informativa_min,
      clasificaciones.avance AS avance_min,
      clasificaciones.coordinacion AS coordinacion_min,
      clasificaciones.decision AS decision_min,
      clasificaciones.otro AS otro_min
      ').find(params[:id])
    asistencia = Asistencia.joins(:tipo_asistencia).select('
      asistencias.id,
      asistencias.id_estudiante AS id_est,
      asistencias.id_stakeholder AS id_stake,
      tipo_asistencias.tipo AS tipo_abrev,
      tipo_asistencias.descripcion AS tipo_desc
      ').where('minuta_id = ?', bitacora.id_minuta)
    lista_asistencia = []
    asistencia.each do |asis|
      unless asis.id_est.nil?
        participante = Estudiante.find(asis.id_est)
        a = {id: asis.id, iniciales: participante.iniciales, id_estudiante: participante.id, id_stakeholder: nil, tipo: asis.tipo_abrev, descripcion: asis.tipo_desc}
      else
        unless asis.id_stake.nil?
          participante = Stakeholder.find(asis.id_stake)
          a = {id: asis.id, iniciales: participante.iniciales, id_estudiante: nil, id_stakeholder: participante.id, tipo: asis.tipo_abrev, descripcion: asis.tipo_desc}
        else
          participante = nil
        end
      end
      if participante.nil?
        a = {id: asis.id, iniciales: nil, id_estudiante: nil, id_stakeholder: nil, tipo: asis.tipo_abrev, descripcion: asis.tipo_desc}
      end
      lista_asistencia << a
    end
    objetivos = Objetivo.where(bitacora_revision_id: bitacora.id_bitacora, borrado: false)
    objetivos_json = objetivos.as_json(json_data)
    conclusiones = Conclusion.where(bitacora_revision_id: bitacora.id_bitacora, borrado: false)
    conclusiones_json = conclusiones.as_json(json_data)
    items = Item.joins(:tipo_item).select('
      items.id,
      tipo_items.tipo AS item_tipo,
      items.correlativo AS corr_item,
      items.descripcion AS cuerpo_item,
      items.fecha AS fecha_item').where(bitacora_revision_id: bitacora.id_bitacora, borrado: false)
    lista_items = []
    items.each do |i|
      responsables = i.responsables.as_json(json_data)
      item = {id: i.id, tipo: i.item_tipo, correlativo: i.corr_item, descripcion: i.cuerpo_item, fecha: i.fecha_item, responsables: responsables}
      lista_items << item
    end
    h = {
      id: bitacora.id_bitacora, revision: bitacora.rev_min, motivo: bitacora.motivo_min, identificador: bitacora.motivo_ident,
      minuta: {
        id: bitacora.id_minuta, codigo: bitacora.codigo_min, correlativo: bitacora.correlativo_min, tema: bitacora.tema_min, creada_por: bitacora.iniciales_est,
        creada_el: bitacora.creada_el, tipo: bitacora.tipo_min, fecha_reunion: bitacora.fecha_min, h_inicio: bitacora.hora_ini, h_termino: bitacora.hora_ter,
        clasificacion: {
          informativa: bitacora.informativa_min, avance: bitacora.avance_min, coordinacion: bitacora.coordinacion_min, decision: bitacora.decision_min, otro: bitacora.otro_min
        }, objetivos: objetivos_json, conclusiones: conclusiones_json, asistencia: lista_asistencia, items: lista_items
      }
    }
    render json: h.as_json
  end

  # Servicio que permite actualizar la información de una minuta de reunión
  def update
    bitacora = BitacoraRevision.find(params[:id])
    bitacora.minuta.assign_attributes(minuta_params)
    bitacora.minuta.clasificacion.assign_attributes(clasificacion_params)
    bitacora.tema.tema = params[:tema].to_s
    tipo_estado = TipoEstado.find(params[:tipo_estado])
    if tipo_estado.abreviacion.eql?('EMI')
      bitacora.emitida = true
      bitacora.fecha_emision = Time.now
    end
    if bitacora.minuta.clasificacion.valid?
      if clasificacion_cambio?(bitacora.minuta.clasificacion)
        bitacora.minuta.clasificacion.save!
        nueva_actividad(bitacora.minuta_id, 'M9')
      end
    end
    if bitacora.minuta.valid?
      if minuta_cambio?(bitacora.minuta)
        bitacora.minuta.save
        nueva_actividad(bitacora.minuta_id, 'M8')
      end
    end
    if bitacora.tema.valid?
      if bitacora.tema.tema_changed?
        bitacora.tema.save!
        nueva_actividad(bitacora.minuta_id, 'T2')
      end
    end
    if bitacora.valid?
      bitacora.save!
      bitacora.objetivos.where(borrado: false).each do |objetivo|
        contador = 0
        params[:objetivos].each do |obj|
          if objetivo.id == obj[:id]
            contador += 1
          end
        end
        if contador == 0
          objetivo.borrado = true
          objetivo.deleted_at = Time.now
          if objetivo.save!
            nueva_actividad(bitacora.minuta_id, 'O3')
          end
        end
      end
      params[:objetivos].each do |obj|
        if obj[:id] != 0
          objetivo = bitacora.objetivos.find(obj[:id])
          objetivo.descripcion = obj[:descripcion]
          if objetivo.valid?
            if objetivo.descripcion_changed?
              objetivo.save!
              nueva_actividad(bitacora.minuta_id, 'O2')
            end
          end
        else
          objetivo = Objetivo.new
          objetivo.descripcion = obj[:descripcion]
          objetivo.bitacora_revision_id = bitacora.id
          if objetivo.valid?
            objetivo.save!
            nueva_actividad(bitacora.minuta_id, 'O1')
          end
        end
      end
      bitacora.conclusiones.where(borrado: false).each do |conclusion|
        contador = 0
        params[:conclusiones].each do |con|
          if conclusion.id == con[:id]
            contador += 1
          end
        end
        if contador == 0
          conclusion.borrado = true
          conclusion.deleted_at = Time.now
          if conclusion.save
            nueva_actividad(bitacora.minuta_id, 'C3')
          end
        end
      end
      params[:conclusiones].each do |con|
        if con[:id] != 0
          conclusion = bitacora.conclusiones.find(con[:id])
          conclusion.descripcion = con[:descripcion]
          if conclusion.valid?
            if conclusion.descripcion_changed?
              conclusion.save!
              nueva_actividad(bitacora.minuta_id, 'C2')
            end
          end
        else
          conclusion = Conclusion.new
          conclusion.descripcion = con[:descripcion]
          conclusion.bitacora_revision_id = bitacora.id
          if conclusion.valid?
            conclusion.save!
            nueva_actividad(bitacora.minuta_id, 'C1')
          end
        end
      end
      bitacora.minuta.asistencias.each do |asistencia|
        if asistencia.id_estudiante != ''
          params[:asistencia].each do |a|
            if asistencia.id_estudiante == a[:estudiante]
              asistencia.tipo_asistencia_id = a[:asistencia]
              if asistencia.tipo_asistencia_id_changed?
                asistencia.save!
                nueva_actividad(bitacora.minuta_id, 'M10')
              end
            end
          end
        else
          if asistencia.id_stakeholder != ''
            params[:asistencia].each do |a|
              if asistencia.id_stakeholder == a[:stakeholder]
                asistencia.tipo_asistencia_id = a[:asistencia]
                if asistencia.tipo_asistencia_id_changed?
                  asistencia.save!
                  nueva_actividad(bitacora.minuta_id, 'M10')
                end
              end
            end
          end
        end
      end
      bitacora.items.each do |item|
        contador = 0
        params[:items].each do |i|
          if item.correlativo == i[:correlativo]
            contador += 1
          end
        end
        if contador == 0
          item.borrado = true
          item.deleted_at = Time.now
          if item.save
            nueva_actividad(bitacora.minuta_id, 'M7')
          end
        end
      end
      params[:items].each do |i|
        aux = bitacora.items.where(correlativo: i[:correlativo], borrado: false).last
        if aux.nil?
          item = Item.new
          item.descripcion = i[:descripcion]
          item.correlativo = i[:correlativo]
          item.bitacora_revision_id = bitacora.id
          item.tipo_item_id = i[:tipo_item_id]
          unless i[:fecha] == ''
            item.fecha = i[:fecha]
          end
          i[:responsables].each do |resp|
            unless (resp.nil? || resp == '' || resp[:id] == 0)
              responsable = Responsable.new
              if resp[:tipo] == 'est'
                responsable.asistencia_id = bitacora.minuta.asistencias.find_by(id_estudiante: resp[:id]).id
              elsif resp[:tipo] == 'stk'
                responsable.asistencia_id = bitacora.minuta.asistencias.find_by(id_stakeholder: resp[:id]).id
              end
              if responsable.valid?
                responsable.save!
                item.responsables << responsable
                nueva_actividad(bitacora.minuta_id, 'R1')
              end
            end
          end
          if item.valid?
            item.save!
            nueva_actividad(bitacora.minuta_id, 'M5')
            unless i[:fecha] == ''
              nueva_actividad(bitacora.minuta_id, 'F1')
            end
          end
        else
          aux.descripcion = i[:descripcion]
          if aux.valid?
            if aux.descripcion_changed?
              aux.save!
              nueva_actividad(bitacora.minuta_id, 'M6')
            end
          end
          aux.tipo_item_id = i[:tipo_item_id]
          aux.save
          unless i[:fecha] == ''
            aux.fecha = i[:fecha]
            if aux.valid?
              if aux.fecha_changed?
                aux.save!
                nueva_actividad(bitacora.minuta_id, 'F2')
              end
            end
          else
            if aux.fecha != nil
              aux.fecha = nil
              if aux.valid?
                if aux.save
                  nueva_actividad(bitacora.minuta_id, 'F3')
                end
              end
            end
          end
          i[:responsables].each do |resp|
            unless (resp.nil? || resp == '' || resp[:id] == 0)
              if aux.responsables.last.nil?
                responsable = Responsable.new
                if resp[:tipo] == 'est'
                  responsable.asistencia_id = bitacora.minuta.asistencias.find_by(id_estudiante: resp[:id]).id
                elsif resp[:tipo] == 'stk'
                  responsable.asistencia_id = bitacora.minuta.asistencias.find_by(id_stakeholder: resp[:id]).id
                end
                if responsable.valid?
                  responsable.save!
                  aux.responsables << responsable
                  if aux.save
                    nueva_actividad(bitacora.minuta_id, 'R1')
                  end
                end
              else
                if resp[:tipo] == 'est'
                  aux.responsables.last.asistencia_id = bitacora.minuta.asistencias.find_by(id_estudiante: resp[:id]).id
                elsif resp[:tipo] == 'stk'
                  aux.responsables.last.asistencia_id = bitacora.minuta.asistencias.find_by(id_stakeholder: resp[:id]).id
                end
                if aux.responsables.last.asistencia_id_changed?
                  aux.save!
                  nueva_actividad(bitacora.minuta_id, 'R2')
                end
              end
            else
              unless aux.responsables.last.nil?
                aux.responsables.delete(aux.responsables.last)
                nueva_actividad(bitacora.minuta_id, 'R3')
              end
            end
          end
        end
      end
      unless bitacora.minuta.bitacora_estados.where(activo: true).last.tipo_estado_id == tipo_estado.id
        bitacora.minuta.bitacora_estados.each do |bit|
          bit.activo = false
          bit.save!
        end
        bitacora_estado = BitacoraEstado.new
        bitacora_estado.minuta_id = bitacora.minuta_id
        bitacora_estado.tipo_estado_id = tipo_estado.id
        if bitacora_estado.valid?
          bitacora_estado.save!
        end
      end
      if tipo_estado.abreviacion.eql?('EMI')
        case bitacora.motivo.identificador
        when 'ECI'
          EstudiantesMailer.nuevaMinutaCoordinacion(bitacora).deliver_later
        when 'ERC'
          EstudiantesMailer.revisionCliente(bitacora).deliver_later
        end
      end
    else
      render json: ['error': 'Información de la minuta no es válida'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega el número correlativo siguiente para la nueva minuta del grupo
  def correlativo
    ultima = Minuta.joins(estudiante: :grupo).joins(:tipo_minuta).where('grupos.id = ? AND minutas.borrado = ?', params[:id], false).where.not('tipo_minutas.tipo = ?', 'Semanal').order('minutas.correlativo').last
    if ultima.nil?
      correlativo = 1
    else
      correlativo = ultima.correlativo + 1
    end
    render json: correlativo.as_json
  end

  # Servicio que entrega la lista de minutas emitidas por un grupo
  def por_grupo
    bitacoras = BitacoraRevision.joins(minuta: {estudiante: :grupo}).joins(minuta: :tipo_minuta).joins(:motivo).select('
      bitacora_revisiones.id AS id_bitacora,
      bitacora_revisiones.revision AS rev_min,
      motivos.motivo AS motivo_min,
      motivos.identificador AS motivo_ident,
      minutas.id AS id_minuta,
      minutas.codigo AS codigo_min,
      minutas.created_at AS creada_el,
      estudiantes.iniciales AS iniciales_est,
      tipo_minutas.tipo AS tipo_min
      ').where('grupos.id = ? AND minutas.borrado = ? AND bitacora_revisiones.emitida = ?', params[:id], false, true).where.not('tipo_minutas.tipo = ?', 'Semanal')
    minutas = []
    bitacoras.each do |bit|
      pos_min = 0
      auxiliar = 0
      codigo_rep = false
      if minutas.length() == 0
        h = {
          id_rev: [[bit.id_bitacora, bit.rev_min]], motivo: bit.motivo_min, identificador: bit.motivo_ident,
          minuta: {
            id: [bit.id_minuta], codigo: bit.codigo_min, creada_por: [bit.iniciales_est], creada_el: [bit.creada_el], tipo: bit.tipo_min,
          }
        }
        minutas << h
      else
        minutas.each do |min|
          if min[:minuta][:codigo] == bit.codigo_min && min[:minuta][:tipo] == bit.tipo_min
            pos_min = auxiliar
            codigo_rep = true
            break if codigo_rep
          end
          auxiliar = auxiliar + 1
        end
        if codigo_rep
          minutas[pos_min][:id_rev].unshift([bit.id_bitacora, bit.rev_min])
          minutas[pos_min][:minuta][:id].unshift(bit.id_minuta)
          minutas[pos_min][:minuta][:creada_por].unshift(bit.iniciales_est)
          minutas[pos_min][:minuta][:creada_el].unshift(bit.creada_el)
        else
          h = {
            id_rev: [[bit.id_bitacora, bit.rev_min]], motivo: bit.motivo_min, identificador: bit.motivo_ident,
            minuta: {
              id: [bit.id_minuta], codigo: bit.codigo_min, creada_por: [bit.iniciales_est], creada_el: [bit.creada_el], tipo: bit.tipo_min,
            }
          }
          minutas << h
        end
      end
    end
    render json: minutas.as_json
  end

  # Servicio que entrega el listado de minutas de un estudiante según sus estados de revisión
  def por_estados
    if current_usuario.rol.rango == 3
      bitacoras = BitacoraRevision.joins('INNER JOIN motivos ON motivos.id = bitacora_revisiones.motivo_id INNER JOIN minutas ON bitacora_revisiones.minuta_id = minutas.id
        INNER JOIN bitacora_estados ON bitacora_estados.minuta_id = minutas.id INNER JOIN tipo_estados ON tipo_estados.id = bitacora_estados.tipo_estado_id
        INNER JOIN tipo_minutas ON tipo_minutas.id = minutas.tipo_minuta_id INNER JOIN estudiantes ON estudiantes.id = minutas.estudiante_id').where('
        minutas.borrado = ? AND estudiantes.usuario_id = ? AND bitacora_revisiones.activa = ? AND tipo_minutas.tipo <> ? AND bitacora_estados.activo = ?
        AND tipo_estados.abreviacion <> ?', false, current_usuario.id, true, 'Semanal', true, 'RIG').select('
          bitacora_revisiones.id,
          bitacora_revisiones.revision AS revision_min,
          bitacora_revisiones.fecha_emision AS fecha_emi,
          motivos.motivo AS motivo_min,
          motivos.identificador AS motivo_ident,
          tipo_minutas.tipo AS tipo_min,
          minutas.id AS id_minuta,
          minutas.codigo AS codigo_min,
          minutas.correlativo AS correlativo_min,
          minutas.fecha_reunion AS fecha_min,
          minutas.created_at AS creada_el,
          bitacora_estados.id AS id_estado,
          bitacora_estados.created_at AS cambia_estado_el,
          tipo_estados.abreviacion AS abrev_estado,
          tipo_estados.descripcion AS desc_estado,
          estudiantes.iniciales AS iniciales_est
        ')
      lista_bitacoras = bitacoras_json(bitacoras)
      render json: lista_bitacoras.as_json(json_data)
    else
      render json: ['error': 'No es un usuario autorizado para este servicio'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega las minutas creadas por los integrantes del grupo para la revisión del estudiante
  def revision_grupo
    if current_usuario.rol.rango == 3
      estudiante = Estudiante.find_by(usuario_id: current_usuario.id)
      bitacoras = BitacoraRevision.joins('INNER JOIN motivos ON motivos.id = bitacora_revisiones.motivo_id INNER JOIN minutas ON bitacora_revisiones.minuta_id = minutas.id
        INNER JOIN bitacora_estados ON bitacora_estados.minuta_id = minutas.id INNER JOIN tipo_estados ON tipo_estados.id = bitacora_estados.tipo_estado_id
        INNER JOIN tipo_minutas ON tipo_minutas.id = minutas.tipo_minuta_id INNER JOIN estudiantes ON estudiantes.id = minutas.estudiante_id
        INNER JOIN grupos ON grupos.id = estudiantes.grupo_id').where('minutas.borrado = ? AND estudiantes.usuario_id <> ? AND bitacora_revisiones.activa = ? AND
        grupos.id = ? AND motivos.identificador = ? AND tipo_minutas.tipo <> ? AND bitacora_revisiones.emitida = ? AND tipo_estados.abreviacion = ?',
        false, current_usuario.id, true, estudiante.grupo_id, 'ECI', 'Semanal', true, 'EMI').select('
          bitacora_revisiones.id,
          bitacora_revisiones.revision AS revision_min,
          bitacora_revisiones.fecha_emision AS fecha_emi,
          motivos.motivo AS motivo_min,
          motivos.identificador AS motivo_ident,
          tipo_minutas.tipo AS tipo_min,
          minutas.id AS id_minuta,
          minutas.codigo AS codigo_min,
          minutas.correlativo AS correlativo_min,
          minutas.fecha_reunion AS fecha_min,
          minutas.created_at AS creada_el,
          bitacora_estados.id AS id_estado,
          bitacora_estados.created_at AS cambia_estado_el,
          tipo_estados.abreviacion AS abrev_estado,
          tipo_estados.descripcion AS desc_estado,
          estudiantes.iniciales AS iniciales_est
        ').order(created_at: 'asc')
      revisadas = BitacoraRevision.joins(aprobaciones: :asistencia).where('asistencias.id_estudiante = ?', estudiante.id)
      unless revisadas.size == 0
        filtradas = bitacoras
        revisadas.each do |r|
          filtradas = filtradas.select{|b| b.id != r.id}
        end
      else
        filtradas = bitacoras
      end
      lista_bitacoras = bitacoras_json(filtradas)
      render json: lista_bitacoras.as_json(json_data)
    else
      render json: ['error': 'No es un usuario autorizado para este servicio'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega las minutas a revisar por un stakeholder según el 'id' de un grupo asignado
  def revision_cliente
    if current_usuario.rol.rango == 4
      stakeholder = Stakeholder.find_by(usuario_id: current_usuario.id)
      bitacoras = BitacoraRevision.joins(:motivo).joins(minuta: {bitacora_estados: :tipo_estado}).joins(minuta: :tipo_minuta).joins(minuta: {estudiante: [grupo: :stakeholders]}).joins(
        minuta: {estudiante: [seccion: :jornada]}).where('minutas.borrado = ? AND bitacora_revisiones.activa = ? AND stakeholders.id = ? AND motivos.identificador <> ?
        AND tipo_minutas.tipo <> ? AND bitacora_revisiones.emitida = ? AND bitacora_estados.activo = ? AND grupos.id = ?',
        false, true, stakeholder.id, 'ECI', 'Semanal', true, true, params[:id]).where.not('tipo_estados.abreviacion = ?', 'BOR').select('
          bitacora_revisiones.id,
          bitacora_revisiones.revision AS revision_min,
          bitacora_revisiones.fecha_emision AS fecha_emi,
          motivos.motivo AS motivo_min,
          motivos.identificador AS motivo_ident,
          tipo_minutas.tipo AS tipo_min,
          minutas.id AS id_minuta,
          minutas.codigo AS codigo_min,
          minutas.correlativo AS correlativo_min,
          minutas.fecha_reunion AS fecha_min,
          minutas.created_at AS creada_el,
          bitacora_estados.id AS id_estado,
          bitacora_estados.created_at AS cambia_estado_el,
          tipo_estados.abreviacion AS abrev_estado,
          tipo_estados.descripcion AS desc_estado,
          estudiantes.iniciales AS iniciales_est,
          grupos.id AS grupo_id,
          grupos.nombre AS nombre_grupo,
          jornadas.nombre AS jornada
        ')
      lista_bitacoras = []
      bitacoras.each do |bit|
        h = {id: bit.id, motivo: bit.motivo_min, identificador: bit.motivo_ident, revision: bit.revision_min, fecha_emision: bit.fecha_emi,
          minuta: {
            id: bit.id_minuta, codigo: bit.codigo_min, correlativo: bit.correlativo_min, fecha_reunion: bit.fecha_min, tipo_minuta: bit.tipo_min, creada_por: bit.iniciales_est, creada_el: bit.creada_el
          },
          estado: {
            id: bit.id_estado, abreviacion: bit.abrev_estado, descripcion: bit.desc_estado, inicia_el: bit.cambia_estado_el
          },
          grupo: {
            id: bit.grupo_id, nombre: bit.nombre_grupo, jornada: bit.jornada
          }
        }
        lista_bitacoras << h
      end
      render json: lista_bitacoras.as_json(json_data)
    else
      render json: ['error': 'No es un usuario autorizado para este servicio'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega el listado de minutas respondidas por los estudiantes creadores de minutas
  def por_respuestas
    if current_usuario.rol.rango == 3
      estudiante = Estudiante.find_by(usuario_id: current_usuario.id)
      bitacoras = BitacoraRevision.joins(:motivo).joins(minuta: {bitacora_estados: :tipo_estado}).joins(minuta: :tipo_minuta).joins(minuta: {estudiante: :grupo}).where('
        minutas.borrado = ? AND estudiantes.usuario_id <> ? AND bitacora_revisiones.activa = ? AND tipo_minutas.tipo <> ? AND bitacora_estados.activo = ? AND
        tipo_estados.abreviacion = ? AND grupos.id = ?', false, current_usuario.id, true, 'Semanal', true, 'RIG', estudiante.grupo_id).select('
          bitacora_revisiones.id,
          bitacora_revisiones.revision AS revision_min,
          bitacora_revisiones.fecha_emision AS fecha_emi,
          motivos.motivo AS motivo_min,
          motivos.identificador AS motivo_ident,
          tipo_minutas.tipo AS tipo_min,
          minutas.id AS id_minuta,
          minutas.codigo AS codigo_min,
          minutas.correlativo AS correlativo_min,
          minutas.fecha_reunion AS fecha_min,
          minutas.created_at AS creada_el,
          bitacora_estados.id AS id_estado,
          bitacora_estados.created_at AS cambia_estado_el,
          tipo_estados.abreviacion AS abrev_estado,
          tipo_estados.descripcion AS desc_estado,
          estudiantes.iniciales AS iniciales_est
        ')
      lista_bitacoras = bitacoras_json(bitacoras)
      render json: lista_bitacoras.as_json(json_data)
    else
      render json: ['error': 'No es un usuario autorizado para este servicio'], status: :unprocessable_entity
    end
  end

  # Servicio que permite guardar los logros y metas de una minuta de avance semanal
  def crear_avance
    bitacora = BitacoraRevision.new
    bitacora.build_minuta(semanal_params)
    bitacora.minuta.build_clasificacion()
    bitacora.minuta.fecha_reunion = params[:minuta][:fecha_avance]
    bitacora.minuta.h_inicio = Time.now()
    bitacora.minuta.h_termino = Time.now()
    bitacora.minuta.numero_sprint = params[:numero_sprint]
    bitacora.revision = '0'
    bitacora.motivo_id = Motivo.find_by(identificador: 'ES').id
    tipo_estado = TipoEstado.find_by(abreviacion: 'BOR')
    if bitacora.valid?
      bitacora.save
      nueva_actividad(bitacora.minuta_id, 'A1')
      asistencia = Asistencia.new
      asistencia.tipo_asistencia_id = TipoAsistencia.find_by(tipo: 'PRE').id
      asistencia.minuta_id = bitacora.minuta_id
      asistencia.id_estudiante = Estudiante.find_by(usuario_id: current_usuario.id).id
      asistencia.save!
      asistencia_profesor = Asistencia.new
      asistencia_profesor.tipo_asistencia_id = TipoAsistencia.find_by(tipo: 'PRE').id
      asistencia_profesor.minuta_id = bitacora.minuta_id
      seccion_estudiante = Estudiante.find_by(usuario_id: current_usuario.id).seccion_id
      secciones = Seccion.find_by(id: seccion_estudiante)
      asistencia_profesor.profesor_id = secciones.profesores.ids[0]
      asistencia_profesor.save!
      responsable = Responsable.new
      responsable.asistencia_id = asistencia.id
      responsable.save
      params[:logros].each do |l|
        logro = Item.new
        logro.descripcion = l[:descripcion]
        logro.correlativo = l[:correlativo]
        logro.bitacora_revision_id = bitacora.id
        logro.tipo_item_id = TipoItem.find_by(tipo: 'Logro').id
        logro.responsables << responsable
        if logro.valid?
          logro.save
          nueva_actividad(bitacora.minuta_id, 'L1')
        end
      end
      params[:metas].each do |m|
        meta = Item.new
        meta.descripcion = m[:descripcion]
        meta.correlativo = m[:correlativo]
        meta.bitacora_revision_id = bitacora.id
        meta.tipo_item_id = TipoItem.find_by(tipo: 'Meta').id
        meta.responsables << responsable
        if meta.valid?
          meta.save
          nueva_actividad(bitacora.minuta_id, 'MT1')
        end
      end
      params[:impedimentos].each do |i|
        impedimento = Item.new
        impedimento.descripcion = i[:descripcion]
        impedimento.correlativo = i[:correlativo]
        impedimento.bitacora_revision_id = bitacora.id
        impedimento.tipo_item_id = TipoItem.find_by(tipo: 'Impedimento').id
        impedimento.responsables << responsable
        if impedimento.valid?
          impedimento.save
          nueva_actividad(bitacora.minuta_id, 'I1')
        end
      end
      bitacora_estado = BitacoraEstado.new
      bitacora_estado.minuta_id = bitacora.minuta_id
      bitacora_estado.tipo_estado_id = tipo_estado.id
      if bitacora_estado.valid?
        bitacora_estado.save
      end
    else
      render json: ['error': 'Información de la minuta de avance no es válida'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega el correlativo correspondiente a una minuta de avance semanal según el 'id' del grupo
  def correlativo_semanal
    ultima = Minuta.joins(estudiante: :grupo).joins(:tipo_minuta).where('grupos.id = ? AND minutas.borrado = ? AND tipo_minutas.tipo = ?', params[:id], false, 'Semanal').last
    if ultima.nil?
      correlativo = 1
    else
      correlativo = ultima.correlativo + 1
    end
    render json: correlativo.as_json
  end

  # Servicio que entrega las minutas de avance semanal del grupo identificado por su 'id'
  def avances_por_grupo
    if current_usuario.rol.rango < 3
      bitacoras = BitacoraRevision.joins(minuta: :tipo_minuta).joins(minuta: {estudiante: :grupo}).joins(minuta: {bitacora_estados: :tipo_estado}).where(
        'minutas.borrado = ? AND tipo_minutas.tipo = ? AND grupos.id = ? AND bitacora_estados.activo = ?', false, 'Semanal', params[:id], true).select('
          bitacora_revisiones.id,
          bitacora_revisiones.emitida AS bit_emitida,
          bitacora_revisiones.activa AS bit_activa,
          bitacora_revisiones.fecha_emision AS bit_fecha,
          minutas.id AS id_minuta,
          minutas.estudiante_id AS id_estudiante,
          minutas.correlativo AS minuta_correlativo,
          minutas.codigo AS codigo_min,
          minutas.fecha_reunion AS fecha_min,
          minutas.numero_sprint AS num_sprint,
          minutas.created_at AS creada_el,
          bitacora_estados.id AS estado_id,
          tipo_estados.id AS tipo_id,
          tipo_estados.abreviacion AS tipo_abrev,
          tipo_estados.descripcion AS tipo_desc
      ').order(created_at: 'desc')
    else
      bitacoras = BitacoraRevision.joins(minuta: :tipo_minuta).joins(minuta: {estudiante: :grupo}).joins(minuta: {bitacora_estados: :tipo_estado}).where(
        'minutas.borrado = ? AND tipo_minutas.tipo = ? AND grupos.id = ? AND bitacora_estados.activo = ?', false, 'Semanal', params[:id], true).select('
          bitacora_revisiones.id,
          bitacora_revisiones.emitida AS bit_emitida,
          bitacora_revisiones.activa AS bit_activa,
          bitacora_revisiones.fecha_emision AS bit_fecha,
          minutas.id AS id_minuta,
          minutas.estudiante_id AS id_estudiante,
          minutas.correlativo AS minuta_correlativo,
          minutas.codigo AS codigo_min,
          minutas.fecha_reunion AS fecha_min,
          minutas.numero_sprint AS num_sprint,
          minutas.created_at AS creada_el,
          bitacora_estados.id AS estado_id,
          tipo_estados.id AS tipo_id,
          tipo_estados.abreviacion AS tipo_abrev,
          tipo_estados.descripcion AS tipo_desc
      ')
    end
    lista = []
    bitacoras.each do |bit|
      items = Item.joins(:tipo_item).joins(:responsables).where(bitacora_revision_id: bit.id, borrado: false).select('
        items.id,
        items.descripcion AS descripcion_item,
        items.correlativo AS correlativo_item,
        tipo_items.id AS tipo_id,
        tipo_items.tipo AS item_tipo,
        tipo_items.descripcion AS descripcion_tipo,
        responsables.id AS id_resp,
        responsables.asistencia_id AS asistencia_resp
        ')
      asistencias = Asistencia.where(minuta_id: bit.id_minuta)
      lista_items = []
      items.each do |i|
        item = {id: i.id, descripcion: i.descripcion_item, correlativo: i.correlativo_item, tipo_item: {
          id: i.tipo_id, tipo: i.item_tipo, descripcion: i.descripcion_tipo}, responsables: {
          id: i.id_resp, asistencia_id: i.asistencia_resp}
          }
        lista_items << item
      end
      h = {id: bit.id, emitida: bit.bit_emitida, activa: bit.bit_activa, fecha_emision: bit.bit_fecha, minuta: {
        id: bit.id_minuta, estudiante_id: bit.id_estudiante, correlativo: bit.minuta_correlativo, codigo: bit.codigo_min, fecha_reunion: bit.fecha_min,
        numero_sprint: bit.num_sprint, creada_el: bit.creada_el, asistencia: asistencias.as_json(json_data), items: lista_items,
        bitacora_estado: {id: bit.estado_id, tipo_estado: {id: bit.tipo_id, abreviacion: bit.tipo_abrev, descripcion: bit.tipo_desc}}
        }
      }
      lista << h
    end
    render json: lista.as_json
  end
  # realiza verificaciones para que cuando se emita una minuta llegue al cliente y/o profesor
  def verificarAprobaciones
    bitacora = BitacoraRevision.joins(minuta: {estudiante: :grupo}).joins(minuta: :tipo_minuta).joins(minuta: :clasificacion).joins(:motivo).joins(:tema).select('
      bitacora_revisiones.id,
      bitacora_revisiones.revision AS rev_min,
      motivos.motivo AS motivo_min,
      motivos.identificador AS motivo_ident,
      temas.tema AS tema_min,
      minutas.id AS id_minuta,
      minutas.codigo AS codigo_min,
      minutas.correlativo AS correlativo_min,
      minutas.fecha_reunion AS fecha_min,
      minutas.h_inicio AS hora_ini,
      minutas.h_termino AS hora_ter,
      minutas.created_at AS creada_el,
      estudiantes.iniciales AS iniciales_est,
      tipo_minutas.tipo AS tipo_min,
      clasificaciones.informativa AS informativa_min,
      clasificaciones.avance AS avance_min,
      clasificaciones.coordinacion AS coordinacion_min,
      clasificaciones.decision AS decision_min,
      clasificaciones.otro AS otro_min
      ').find(params[:id])
      asistencia = Asistencia.joins(:tipo_asistencia).select('
      asistencias.id,
      asistencias.id_estudiante AS id_est,
      asistencias.id_stakeholder AS id_stake,
      tipo_asistencias.tipo AS tipo_abrev,
      tipo_asistencias.descripcion AS tipo_desc
      ').where('minuta_id = ?', bitacora.id_minuta)
    aprobadas=[]
    aprobadasAux= Aprobacion.where(bitacora_revision_id: params[:id])
    aprobadasAux.each do |aprobacion|
      if aprobacion.tipo_aprobacion_id == 1 or aprobacion.tipo_aprobacion_id == 2
        aprobadas << aprobacion
      end
    end
    numeroAprobaciones= aprobadas.length
    lista_asistencia = []
    asistencia.each do |asis|
      unless asis.id_est.nil?
        participante = Estudiante.find(asis.id_est)
        a = {id: asis.id, iniciales: participante.iniciales, id_estudiante: participante.id, id_stakeholder: nil, tipo: asis.tipo_abrev, descripcion: asis.tipo_desc}
        lista_asistencia << a
      else
        unless asis.id_stake.nil?
          participante = Stakeholder.find(asis.id_stake)
          a = {id: asis.id, iniciales: participante.iniciales, id_estudiante: nil, id_stakeholder: participante.id, tipo: asis.tipo_abrev, descripcion: asis.tipo_desc}
        else
          participante = nil
        end
      end
      if participante.nil?
        a = {id: asis.id, iniciales: nil, id_estudiante: nil, id_stakeholder: nil, tipo: asis.tipo_abrev, descripcion: asis.tipo_desc}
      end
    end
      if(numeroAprobaciones + 1) == (lista_asistencia.length - 1)
        if(bitacora.tipo_min== "Coordinacion")
          EstudiantesMailer.confirmacionMinutaInterna(bitacora).deliver_later
        elsif(bitacora.tipo_min== "Cliente")
          EstudiantesMailer.confirmacionMinutaCliente(bitacora).deliver_later
        else
          EstudiantesMailer.nuevaMinutaSemanal(bitacora).deliver_later
        end
        
      end
  end
  # Servicio que permite actualizar los logros y metas de un estudiante e ingresar nuevos logros y metas para los otros estudiantes del grupo
  def actualizar_avance
    bitacora = BitacoraRevision.find(params[:id])
    bitacora.minuta.numero_sprint = params[:numero_sprint]
    if bitacora.minuta.numero_sprint_changed?
      bitacora.minuta.save
      nueva_actividad(bitacora.minuta_id, 'NS1')
    end
    bitacora.minuta.fecha_reunion = params[:minuta][:fecha_avance]
    if bitacora.minuta.fecha_reunion_changed?
      bitacora.minuta.save
      nueva_actividad(bitacora.minuta_id, 'F4')
    end
    estudiante = Estudiante.find_by(usuario_id: current_usuario.id)
    asistencia = Asistencia.where(id_estudiante: estudiante.id, minuta_id: bitacora.minuta_id).last
    if asistencia.nil?
      asistencia = Asistencia.new
      asistencia.tipo_asistencia_id = TipoAsistencia.find_by(tipo: 'PRE').id
      asistencia.minuta_id = bitacora.minuta_id
      asistencia.id_estudiante = estudiante.id
      asistencia.save
      responsable = Responsable.new
      responsable.asistencia_id = asistencia.id
      responsable.save
      nuevos_items(params[:logros], bitacora, 'Logro', responsable)
      nuevos_items(params[:metas], bitacora, 'Meta', responsable)
      nuevos_items(params[:impedimentos], bitacora, 'Impedimento', responsable)
    else
      responsable = Responsable.find_by(asistencia_id: asistencia.id)
      items = Item.joins(:responsables).where('items.bitacora_revision_id = ? AND responsables.id = ? AND items.borrado = ?', bitacora.id, responsable.id, false)
      items.each do |item|
        if item.tipo_item.tipo == 'Logro'
          unless params_include(params[:logros], item.id)
            borrar_objeto(item)
          end
        elsif item.tipo_item.tipo == 'Meta'
          unless params_include(params[:metas], item.id)
            borrar_objeto(item)
          end
        elsif item.tipo_item.tipo == 'Impedimento'
          unless params_include(params[:impedimentos], item.id)
            borrar_objeto(item)
          end
        end
      end
      nuevos_logros = []
      params[:logros].each do |p|
        if p[:id] != 0
          actualizar_item(p)
        else
          nuevos_logros << p
        end
      end
      nuevas_metas = []
      params[:metas].each do |m|
        if m[:id] != 0
          actualizar_item(m)
        else
          nuevas_metas << m
        end
      end
      nuevos_impedimentos = []
      params[:impedimentos].each do |i|
        if i[:id] != 0
          actualizar_item(i)
        else
          nuevos_impedimentos << i
        end
      end
      nuevos_items(nuevos_logros, bitacora, 'Logro', responsable)
      nuevos_items(nuevas_metas, bitacora, 'Meta', responsable)
      nuevos_items(nuevos_impedimentos, bitacora, 'Impedimento', responsable)
    end
    if to_boolean(params[:emitir])
      bitacora.minuta.bitacora_estados.each do |bit|
        bit.activo = false
        bit.save
      end
      bitacora_estado = BitacoraEstado.new
      bitacora_estado.minuta_id = bitacora.minuta_id
      bitacora_estado.tipo_estado_id = TipoEstado.find_by(abreviacion: 'CER').id
      if bitacora_estado.valid?
        bitacora_estado.save!
        bitacora.emitida = true
        bitacora.fecha_emision = Time.now()
        bitacora.save
      end
    end
  end

  private
  def minuta_params
    params.require(:minuta).permit(:estudiante_id, :correlativo, :codigo, :fecha_reunion, :h_inicio, :h_termino, :tipo_minuta_id)
  end

  def clasificacion_params
    params.require(:clasificacion).permit(:informativa, :avance, :coordinacion, :decision, :otro)
  end

  def revision_params
    params.require(:bitacora_revision).permit(:revision, :motivo_id)
  end

  def semanal_params
    params.require(:minuta).permit(:estudiante_id, :correlativo, :codigo, :tipo_minuta_id)
  end

  def clasificacion_cambio?(clasificacion)
    cambio = false
    cambio = cambio || clasificacion.informativa_changed?
    cambio = cambio || clasificacion.avance_changed?
    cambio = cambio || clasificacion.coordinacion_changed?
    cambio = cambio || clasificacion.decision_changed?
    cambio = cambio || clasificacion.otro_changed?
    return cambio
  end

  def minuta_cambio?(minuta)
    cambio = false
    cambio = cambio || minuta.codigo_clengthhanged?
    cambio = cambio || minuta.fecha_reunion_changed?
    cambio = cambio || minuta.h_inicio_changed?
    cambio = cambio || minuta.h_termino_changed?
    return cambio
  end

  def nuevos_items(params, bitacora, tipo, responsable)
    params.each do |p|
      item = Item.new
      item.descripcion = p[:descripcion]
      item.correlativo = p[:correlativo]
      item.bitacora_revision_id = bitacora.id
      item.tipo_item_id = TipoItem.find_by(tipo: tipo).id
      item.responsables << responsable
      if item.valid?
        item.save
        if tipo == 'Logro'
          nueva_actividad(bitacora.minuta_id, 'L1')
        elsif tipo == 'Meta'
          nueva_actividad(bitacora.minuta_id, 'MT1')
        elsif tipo == 'Impedimento'
          nueva_actividad(bitacora.minuta_id, 'I1')
        end
      end
    end
  end

  def params_include(params, id_item)
    presente = false
    params.each do |p|
      if p[:id] == id_item
        presente = true
      end
    end
    return presente
  end

  def actualizar_item(params)
    item = Item.find(params[:id].to_i)
    item.descripcion = params[:descripcion]
    item.correlativo = params[:correlativo]
    item.save
  end
  

end



