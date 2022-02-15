class GruposController < ApplicationController
  before_action :authenticate_usuario
  include JsonFormat

  # Servicio que muestra el listado de grupos en el sistema y los estudiantes asignados
  def index
    grupos = Grupo.where('borrado = ? AND nombre <> ?', false, 'SG')
    estudiantes = Estudiante.joins(:grupo).joins(:usuario).joins(seccion: :jornada).where('grupos.borrado = ? AND grupos.nombre <> ?', false, 'SG').select('
      estudiantes.id,
      estudiantes.iniciales AS iniciales_est,
      usuarios.nombre AS nombre_est,
      usuarios.apellido_paterno AS apellido1,
      usuarios.apellido_materno AS apellido2,
      usuarios.run AS run_est,
      usuarios.email AS email_est,
      jornadas.nombre AS jornada,
      grupos.id AS id_grupo
    ')
    @grupos = []
    grupos.each do |g|
      est_asignados = asignados(g.id, estudiantes)
      lista_est = []
      est_asignados.each do |e|
        h = {id: e.id, iniciales: e.iniciales_est, usuario: {nombre: e.nombre_est, apellido_paterno: e.apellido1, apellido_materno: e.apellido2, run: e.run_est, email: e.email_est}}
        lista_est << h
      end
      stakeholders = g.stakeholders
      if est_asignados.size > 0
        jornada = est_asignados[0].jornada
      else
        jornada = ''
      end
      h = {id: g.id, nombre: g.nombre, proyecto: g.proyecto, correlativo: g.correlativo, jornada: jornada, estudiantes: lista_est, stakeholders: stakeholders.as_json(
        {except: %i[usuario_id grupo_id created_at deleted_at], :include => {:usuario => user_data}}
        )}
      @grupos << h
    end
    render json: @grupos.as_json
  end

  # Servicio para crear un nuevo grupo de estudiantes en el sistema
  def create
    grupo = Grupo.new(grupo_params)
    if grupo.valid?
      grupo.save!
      estudiantes = Estudiante.where(id: params[:estudiantes])
      estudiantes.each do |e|
        e.grupo_id = grupo.id
        e.save!
      end
    else
      render json: ['error': 'Información del grupo no es válida'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega los estudiantes de un grupo en particular
  def show
    grupo = Grupo.find(params[:id])
    unless grupo.nil?
      estudiantes = Estudiante.joins(:grupo).joins(:usuario).where('grupos.id = ?', grupo.id).select('
        estudiantes.id AS id_est,
        estudiantes.iniciales AS iniciales_est,
        usuarios.id AS id_usr,
        usuarios.nombre AS nombre_est,
        usuarios.apellido_paterno AS apellido1,
        usuarios.apellido_materno AS apellido2,
        usuarios.run AS run_est,
        usuarios.email AS email_est')
      asignados = []
      estudiantes.each do |e|
        h = {id: e.id_est, iniciales: e.iniciales_est, usuario: {id: e.id_usr, nombre: e.nombre_est, apellido_paterno: e.apellido1, apellido_materno: e.apellido2, run: e.run_est, email: e.email_est}}
        asignados << h
      end
      clientes = []
      grupo.stakeholders.each do |stk|
        h = {id: stk.id, iniciales: stk.iniciales, usuario: {id:stk.usuario_id, nombre: stk.usuario.nombre, apellido_paterno: stk.usuario.apellido_paterno, apellido_materno: stk.usuario.apellido_materno, email: stk.usuario.email}}
        clientes << h
      end
      datos = {id: grupo.id, nombre: grupo.nombre, proyecto: grupo.proyecto, correlativo: grupo.correlativo, estudiantes: asignados, stakeholders: clientes}
    else
      datos = []
    end
    render json: datos.as_json
  end

  # Servicio que permite borrar un grupo de trabajo
  def destroy
    grupo = Grupo.find(params[:id])
    grupo_defecto = Grupo.find_by(nombre: 'SG')
    grupo.estudiantes.each do |e|
      e.grupo_id = grupo_defecto.id
      e.save
    end
    grupo.stakeholders.clear
    grupo.borrado = true
    grupo.deleted_at = Time.now()
    grupo.save
  end

  # Servicio que permite actualizar un grupo de trabajo
  def update
    if current_usuario.rol.rango < 3
      grupo = Grupo.find(params[:id])
      sin_asignacion = Grupo.find_by(nombre: 'SG')
      estudiantes = grupo.estudiantes
      nuevos_estudiantes = Estudiante.where(id: params[:estudiantes])
      unless grupo.nil?
        grupo.assign_attributes(grupo_params)
        unless nuevos_estudiantes.size == 0
          estudiantes.each do |est|
            est.grupo_id = sin_asignacion.id
            est.save
          end
          grupo.estudiantes << nuevos_estudiantes
        end
        if grupo.valid?
          grupo.save!
        else
          render json: ['error': 'Los datos del grupo no son válidos'], status: :unprocessable_entity
        end
      else
        render json: ['error': 'No existe el grupo a editar'], status: :unprocessable_entity
      end
    else
      render json: ['error': 'Servicio no disponible para este usuario'], status: :unprocessable_entity
    end
  end

  # Servicio que entrega los estudiantes y stakeholder del grupo del usuario
  def grupo_actual
    usuario = Usuario.find(current_usuario.id)
    if(usuario.rol.rango == 3)
      estudiante = Estudiante.find_by(usuario_id: current_usuario.id)
      grupo = Grupo.find(estudiante.grupo_id)
      unless grupo.nil? 
        estudiantes = Estudiante.joins(:grupo).joins(:usuario).where('grupos.id = ?', grupo.id).select('
        estudiantes.id AS id_est,
        estudiantes.iniciales AS iniciales_est,
        usuarios.nombre AS nombre_est,
        usuarios.apellido_paterno AS apellido1,
        usuarios.apellido_materno AS apellido2,
        usuarios.run AS run_est,
        usuarios.email AS email_est')
        estudiantes.each do |e|
          h = {id: e.id_est, iniciales: e.iniciales_est, usuario: {nombre: e.nombre_est, apellido_paterno: e.apellido1, apellido_materno: e.apellido2, run: e.run_est, email: e.email_est}}
          asignados << h
        end
        clientes = []
        grupo.stakeholders.each do |stk|
        h = {id: stk.id, iniciales: stk.iniciales, usuario: {nombre: stk.usuario.nombre, apellido_paterno: stk.usuario.apellido_paterno, apellido_materno: stk.usuario.apellido_materno, email: stk.usuario.email}}
        clientes << h
        end
      datos = {id: grupo.id, nombre: grupo.nombre, proyecto: grupo.proyecto, correlativo: grupo.correlativo, estudiantes: asignados, stakeholders: clientes}
      end
    else
      datos = []
    end
    render json: datos.as_json
  end 

  # Servicio que entrega el último grupo de estudiantes disponibles asociados a una jornada
  def ultimo_grupo
    grupo = Estudiante.joins(:grupo).joins(seccion: :jornada).where('grupos.borrado = ? AND grupos.nombre <> ? AND jornadas.nombre = ?', false, 'SG', params[:jornada]).select('
      grupos.id,
      grupos.nombre,
      grupos.correlativo
      ').order('grupos.correlativo DESC').limit(1)
    render json: grupo[0].as_json(json_data)
  end

  # Servicio que permite editar la asignación de stakeholders de un grupo identificado por su 'id'
  def cambiar_asignacion
    grupo = Grupo.find(params[:id])
    stakeholders = Stakeholder.where(id: params[:stakeholders])
    unless stakeholders.size == 0
      grupo.stakeholders.clear
      grupo.stakeholders << stakeholders
      grupo.save
    else
      render json: ['Error': 'No se han agregado stakeholders al grupo seleccionado'], status: :unprocessable_entity
    end
  end

  private
  def grupo_params
    params.require(:grupo).permit(:nombre, :proyecto, :correlativo)
  end

  def asignados(grupo_id, estudiantes)
    lista = []
    estudiantes.each do |e|
      if e.id_grupo == grupo_id
        lista << e
      end
    end
    return lista
  end

end
