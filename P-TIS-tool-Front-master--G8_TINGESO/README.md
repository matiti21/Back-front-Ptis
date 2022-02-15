# Aplicación Frontend Herramienta de apoyo a los cursos de Proyecto y Taller de Ingeniería de Software del Departamento de Ingeniería Informática de la USACH

## Entorno de desarrollo
* nodejs 10.23
* npm 6.14.8
* vue-cli 4.5.8

## Instalación

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
Clonar el repositorio e ingresar al directorio de la aplicación:
```
git clone https://github.com/RodrigoCC-dev/P-TIS-tool-Front.git ptis-front
cd ptis-front
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

## Testeo
### Test unitarios
En el directorio de la aplicación, ejecutar:
```
npm test:unit
# o
yarn test:unit
```

### Test e2e
En el directorio de la apliación, ejecutar:
```
npm test:e2e
# o
yarn test:e2e
```

## Despliegue para producción
La descripción realizada a continuación se describe para la instalación en un servidor con Ubuntu 18.04. Esta descripción puede variar para otras distribuciones de sistemas operativos. Esta descripción considera que ya se encuentran instaladas las dependencias indicadas en la sección __Instalación__. 
### Instalación de Nginx
Instalar Nginx en el servidor:
```
sudo apt update
sudo apt install nginx
```
Habilitar Nginx en el firewall de ubuntu para conexiones __http__:
```
sudo ufw allow 'Nginx HTTP'
```
O habilitar Nginx para conexiones __https__:
```
sudo ufw allow 'Nginx HTTPS'
```
Verificar funcionamiento de Nginx:
```
sudo service status nginx
```
### Clonar repositorio y desplegar
Clonar el repositorio en la carpeta 'Home' del usuario e ingresar a la carpeta del proyecto:
```
git clone https://github.com/RodrigoCC-dev/P-TIS-tool-Front.git ptis-front
cd ptis-front
```
Generar archivo de variables de entorno:
```
cp .env.example .env
```
Editar archivo de variables de entorno y definir dirección de API:
```
nano .env
```
Ejemplo archivo .env:
```
VUE_APP_API_URL='tu-direccion-api'
```
Instalar las dependencias:
```
npm install
```
Construir la aplicación:
```
npm build
```
Copiar archivo de configuración de Nginx a directorio de configuración y reemplazar configuración por defecto:
```
cp nginx.conf /etc/nginx/conf.d/default.conf
```
Copiar aplicación construida a directorio de Nginx:
```
cp dist /usr/share/nginx/html
```
Revisar funcionamiento de Ngnix:
```
sudo service nginx status
```
Si no está activo, inicializarlo:
```
nginx -g daemon off
```
