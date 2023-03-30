# Backend
Clonar proyecto
## Instalación en desarrollo
### RVM
RVM es una herramienta que permite tener multiples instalaciones de Ruby en el sistema. Para su instalación, se debe contar con cURL instalado:
```
sudo apt install curl
```
Instalar RVM haciendo uso de cURL:
```
\curl -sSL https://get.rvm.io | bash
```
Modificar el bash para que reconozca las instrucciones de RVM:
```
echo 'source "$HOME/.rvm/scripts/rvm"' >> ~/.bashrc
```
Cerrar sesión para que los cambios al bash se apliquen a partir de nuevas sesiones.
Abrir la terminal y completar la instalación solicitando las partes de RVM que faltan:
```
rvm requirements
```
### Ruby
Con RVM instalado, la instalación de Ruby en la versión necesaria se realiza con el siguiente comando:
```
rvm install ruby-2.6.6
```
Dejar la instalación de Ruby v2.6.6 como por defecto:
```
rvm --default use 2.6.6
```
### Rails
Una vez instalado Ruby, la instalación de Rails se realiza a través de la instalación de la gema 'rails':
```
gem install rails
```
Para comprobar la instalación y versión de Rails:
```
rails -v
```
### Node.js
Agregar repositorio de origen de la descarga:
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```
Luego, instalar:
```
sudo apt install -y nodejs
sudo apt install gcc g++ make
```
### Yarn
```
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```
### Postgres
Instalar postgres en el sistema:
```
sudo apt install postgresql postgresql-contrib libpq-dev
```
ingresar como usuario postgres
```
sudo su - postgres
psql
```
crear un rol para tu usuario actual, su base de datos por defecto y su password de acceso:
```
create role 'tu_usuario' with createdb login password 'tu_password';
```
salir de la consola
```
\q
```
### Instalar gema bundler
```
gem update --system
gem install bundler
```
### instalar dependencias y desplegar
Ingresar a directorio del backend:
```
cd P-TIS-tool-Back-master--G8_TINGESO
```
Generar archivo de variables de entorno para la aplicación copiando archivo .env.example a .env y editarlo:
```
cp .env.example .env
nano .env
```
cambiar valores de variables de entorno, ejemplo:
```
DB_USERNAME='tu_usuario_BD'
DB_PASSWORD='tu_password_BD'
DB_HOST='el_host_de_tu_BD' # ejemplo: localhost
CORS_ORIGINS='' # Origenes permitidos para el uso de la API separados por coma, ejemplo: *
```
Instalar las dependencias:
```
bundle install
```
Generar la base de datos:
```
rails db:create db:migrate db:seed
```
Desplegar la aplicación en entorno de desarrollo:
```
rails server
```
# Frontend
## Instalacion en desarrollo
### Node.js
Agregar repositorio de origen de la descarga:
```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```
Instalar:
```
sudo apt install -y nodejs
```
Verificar instalación de nodejs:
```
nodejs --version
```
Verificar instalación de npm:
```
npm --version
```

### Yarn
```
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

### Vue cli
Instalación con npm:
```
npm install -g @vue/cli
```
Instalación con yarn:
```
yarn global add @vue/cli
```

### Clonar repositorio, instalar dependencias y desplegar
ingresar al directorio del frontend:
```
cd P-TIS-tool-Front-master--G8_TINGESO 
```
Instalar las dependencias:
```
npm install
# o
yarn install
```
Copiar archivo .env.example a .env y editarlo
```
cp .env.example .env
nano .env
```
Ingresar la dirección de la API de la aplicación:
```
VUE_APP_API_URL='tu-direccion-de-la-api'
```
Desplegar en entorno de desarrollo:
```
npm run serve
o
yarn serve
```

# Despliegue con docker
## Crear y modificar archivos necesarios
### Crear .env en Front
Acceder a:
```
cd P-TIS-tool-Front-master--G8_TINGESO
```
Luego :
Generar archivo de variables de entorno para la aplicación copiando archivo .env.example a .env y editarlo:
```
cp .env.example .env
nano .env
```
En el .env editar y colocar ip de la api
### Editar Dockerfile de Backend
Debe estar en la caprta raiz del proyecto y acceder a:
```
cd P-TIS-tool-Back-master--G8_TINGESO
```
Luego editar Cors origin con el ip de donde se recibiran las consultas:
```
22 RUN echo "DB_USERNAME='root'\nDB_PASSWORD='ptis2021'\nDB_HOST='database'\nCORS_ORIGINS='*'" > .env
```
## instalar dependencias del front
debe estar en la carpeta raiz del proyecto y acceder a:
```
cd P-TIS-tool-Front-master--G8_TINGESO
```
Luego instalar lo siguiente:
### Node.js
Agregar repositorio de origen de la descarga:
```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```
Instalar:
```
sudo apt install -y nodejs
```
Verificar instalación de nodejs:
```
nodejs --version
```
Verificar instalación de npm:
```
npm --version
```

### Yarn
```
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

### Vue cli
Instalación con npm:
```
npm install -g @vue/cli
```
Instalación con yarn:
```
yarn global add @vue/cli
```
Por ultimo realizar con yarn:
```
yarn install
```
```
yarn build
```
## Configurar y realizar despliegue
Debe estar en la carpeta raiz del proyecto, luego abrir el archivo docker-compose.yml
### Caso 1
Si puede abrir el puerto 8080. Debera copiar y pegar lo siguiente (Eliminando lo anterior):
```
version: '2.2'

services:
  database:
    image: postgres:10.14
    container_name: ptis-tool-db
    restart: always
    volumes:
      - db-data:/var/lib/postgresql/data
    expose:
      - 5432
    environment:
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD='ptis2021'
      - POSTGRES_HOST_AUTH_METHOD=trust
    networks:
      - app-network
  api:
    build: ./P-TIS-tool-Back-master--G8_TINGESO
    command: bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p 8080 -b '0.0.0.0'"
    container_name: ptis-tool-api
    restart: always
    ports:
      - 8080:8080
    environment:
      - RAILS_ENV=production
      - DISABLE_SPRING=1
      - BUNDLE_PATH=vendor/bundle
    depends_on:
      - database
    networks:
      - app-network
  tingeso:
    build: ./P-TIS-tool-Front-master--G8_TINGESO
    container_name: TINGESOFRONT
    restart: always
    ports:
      - 80:80
    networks:
      - app-network
    depends_on:
      - nginx-proxy
volumes:
  db-data:
networks:
  app-network:
    driver: bridge
```
### Caso 2
Si solo puede mantener el puerto 80 abierto (Como fue en el caso en el momento que se realizo esto), entonces debe solicitar al administrador de la red que les genere 2 subdominios o Url que apunte a su IP y luego copiar todo lo que viene a continuación en el Docker-compose.yml, cambiando las URL:

```
  version: '2.2'

services:
  database:
    image: postgres:10.14
    container_name: ptis-tool-db
    restart: always
    volumes:
      - db-data:/var/lib/postgresql/data
    expose:
      - 5432
    environment:
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD='ptis2021'
      - POSTGRES_HOST_AUTH_METHOD=trust
    networks:
      - app-network
  api:
    build: ./P-TIS-tool-Back-master--G8_TINGESO
    command: bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p 8080 -b '0.0.0.0'"
    container_name: ptis-tool-api
    restart: always
    ports:
      - 8080:8080
    environment:
      - RAILS_ENV=production
      - DISABLE_SPRING=1
      - BUNDLE_PATH=vendor/bundle
      - VIRTUAL_HOST=api-minutas.diinf.usach.cl
      - VIRTUAL_PORT=8080
    depends_on:
      - database
    networks:
      - app-network
  tingeso:
    build: ./P-TIS-tool-Front-master--G8_TINGESO
    container_name: TINGESOFRONT
    restart: always
    ports:
      - 81:81
    environment:
      - VIRTUAL_HOST=vminutas.diinf.usach.cl
      - VIRTUAL_PORT=80
    networks:
      - app-network
    depends_on:
      - nginx-proxy
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
    networks:
      - app-network
volumes:
  db-data:
networks:
  app-network:
    driver: bridge  
      
```
## Instalacion y generacion de DB
### Despliegue por docker-compose
Debe estar en la carpeta raiz del proyecto y realizar:
```
docker-compose up -d
```
## Generacion DB
```
docker exec -it ptis-tool-api bundle exec rails db:create db:migrate db:seed RAILS_ENV=production        
```
Listo ya esta en desplegada la aplicación

Nota: en caso de dudas contactar.
# Back-front-Ptis
