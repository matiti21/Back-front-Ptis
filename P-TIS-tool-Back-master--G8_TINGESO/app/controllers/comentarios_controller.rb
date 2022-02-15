class ComentariosController < ApplicationController
  before_action :authenticate_usuario
  include JsonFormat
  include Funciones

  # Servicio que permite guardar los comentarios realizados a una minuta de reunión
  def create
    bitacora = BitacoraRevision.find(params[:id])
    if current_usuario.rol.rango == 3
      asistencia = bitacora.minuta.asistencias.find_by(id_estudiante: Estudiante.find_by(usuario_id: current_usuario.id).id)
      es_estudiante = true
    elsif current_usuario.rol.rango == 4
      asistencia = bitacora.minuta.asistencias.find_by(id_stakeholder: Stakeholder.find_by(usuario_id: current_usuario.id).id)
      es_estudiante = false
    elsif current_usuario.rol.rango == 2
      asistencia = bitacora.minuta.asistencias.find_by(profesor_id: Profesor.find_by(usuario_id: current_usuario.id).id)
      es_estudiante = false
    else
      asistencia = nil
    end
    unless asistencia.nil?
      contador = 0
      params[:comentarios].each do |c|
        if c[:comentario].to_s != ''
          comentario = Comentario.new
          comentario.comentario = c[:comentario]
          comentario.asistencia_id = asistencia.id
          comentario.bitacora_revision_id = bitacora.id
          if to_boolean(c[:es_item])
            comentario.es_item = true
            comentario.id_item = c[:id_item]
          end
          if comentario.valid?
            comentario.save!
            nueva_actividad(bitacora.minuta_id, 'COM1')
            contador += 1
          end
        end
      end
      aprobacion = Aprobacion.new
      aprobacion.bitacora_revision_id = bitacora.id
      aprobacion.asistencia_id = asistencia.id
      aprobacion.tipo_aprobacion_id = params[:tipo_aprobacion_id]
      if aprobacion.valid?
        aprobacion.save!
      end
      revisores = calcular_revisores(bitacora.id)
      revisiones = bitacora.aprobaciones.size
      if revisiones == revisores
        aprobadas_con_com = bitacora.aprobaciones.joins(:tipo_aprobacion).where('tipo_aprobaciones.identificador = ?', 'AC').size
        rechazadas_con_com = bitacora.aprobaciones.joins(:tipo_aprobacion).where('tipo_aprobaciones.identificador = ?', 'RC').size
        bitacora.minuta.bitacora_estados.where(activo: true).each do |bit|
          bit.activo = false
          bit.save
        end
        bitacora_estado = BitacoraEstado.new
        bitacora_estado.minuta_id = bitacora.minuta_id
        if aprobadas_con_com > 0 || rechazadas_con_com > 0
          if bitacora.motivo.identificador == 'ECI'
            bitacora_estado.tipo_estado_id = TipoEstado.find_by(abreviacion: 'CIG').id
          elsif bitacora.motivo.identificador == 'ERC'
            bitacora_estado.tipo_estado_id = TipoEstado.find_by(abreviacion: 'CSK').id
          end
        elsif bitacora.motivo.identificador == 'ES'
          bitacora_estado.tipo_estado_id = TipoEstado.find_by(abreviacion: 'CPF').id
        else
          bitacora_estado.tipo_estado_id = TipoEstado.find_by(abreviacion: 'CER').id
        end
        if bitacora_estado.valid?
          bitacora_estado.save!
        end
        if es_estudiante == false
          if es_numero?(bitacora.revision) && bitacora.revision.to_i > 0
            aprobaciones = Aprobacion.where(bitacora_revision_id: bitacora.id)
            aprobado = true
            aprobaciones.each do |a|
              aprobado = aprobado && a.tipo_aprobacion.identificador.eql?('A')
            end
            if aprobado
              bitacora.motivo_id = Motivo.find_by(identificador: 'EF').id
            end
          else
            StakeholdersMailer.comentariosMinuta(bitacora, current_usuario).deliver_later
          end
        end
      end
    else
      render json: ['error': 'Servicio no permitido para este usuario'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega los comentarios de una minuta identificada por su 'bitacora_revision_id'
  def show
    comentarios = Comentario.where(bitacora_revision_id: params[:id].to_i)
    render json: comentarios.as_json(json_data)
  end

  private
  def expresion_regular(dato)
    reg_exp = Regexp.new('[0-9]')
    return reg_exp.match(dato)
  end

  def es_numero?(revision)
    return !expresion_regular(revision).nil?
  end
end
