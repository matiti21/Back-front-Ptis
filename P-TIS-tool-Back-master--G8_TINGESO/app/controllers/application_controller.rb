class ApplicationController < ActionController::API

  def encode_token(payload)
    JWT.encode(payload, 'Ptis2020')
  end

  def auth_header
    # { Authorization: 'Bearer <token>'}
    request.headers['Authorization']
  end

  def decoded_token
    if auth_header
      token = auth_header.split(' ')[1]
      # header: { 'Authorization': 'Bearer <token>' }
      begin
        JWT.decode(token, 'Ptis2020', true, algorithm: 'HS256')
      rescue JWT::DecodeError
        nil
      end
    end
  end

  def current_usuario
    if decoded_token
      user_id = decoded_token[0]['usuario_id']
      @usuario = Usuario.find_by(id: user_id)
    end
  end

  def logged_in?
    !!current_usuario
  end

  def authenticate_usuario
    render json: {message: 'Por favor, ingresa a la aplicación'}, status: :unauthorized unless logged_in?
  end
end
