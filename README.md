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
``
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
# o
yarn serve
```
# Back-front-Ptis
