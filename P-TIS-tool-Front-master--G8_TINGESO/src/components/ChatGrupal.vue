<template>
<div>
  <div class="column is-8 is-offset-2">
    <div class="card" >
      <header class="card-header">
        <div class="column is-6">
          <span class="icon-text">
            <span class="icon" style=" vertical-align: middle; font-size:22px; color:#757575; margin-right: 15px; margin-left: 15px">
              <i class="fas fa-users fa-lg"></i>
            </span>
            <span style="color:#F9952D; font-weight: bold; font-size:110%">{{grupo.nombre}}</span>
          </span>
        </div>
      </header>
      <div class="card-content" style="background-color:#F9F9F9; overflow-y: scroll; max-height: 550px">
        <!--Mostrar mensajes-->
        <ul v-for="mensajeExistente in mensajes" :key="mensajeExistente.id">
          <!--Mensajes de otros usuarios-->
          <div class="column is-6">
            <div v-if="usuario.id != mensajeExistente.usuario_id" class="box" style="padding:10px">
                  <p style="color:#F9952D; font-weight: bold">{{obtenerNombreUsuario(mensajeExistente.usuario_id)}}</p>
                  <p>{{mensajeExistente.texto}}</p>
                  <div class="content has-text-right">
                    <p style="font-size:75%">{{darFormatoFecha(mensajeExistente.fecha)}}</p>
                  </div>
            </div>
          </div>
          <!--Mensajes de usuario actual-->
          <div v-if="usuario.id == mensajeExistente.usuario_id" class="column is-6 is-offset-6">
            <div class="box" style="padding:10px">
                  <p style="color:#F9952D; font-weight: bold">{{usuario.nombre}} {{usuario.apellido_paterno}}</p>
                  <p>{{mensajeExistente.texto}}</p>
                  <div class="content has-text-right">
                    <p style="font-size:75%">{{darFormatoFecha(mensajeExistente.fecha)}}</p>
                  </div>
            </div>
          </div>
        </ul>
      </div>
      <footer class="card-footer">
        <div class="column is-11">
          <div class="control">
            <input class="input" @keyup.enter="crearMensaje()" v-model="texto" type="text" style="background-color:#F9F9F9" placeholder="Escribe un mensaje aquí...">
          </div>
        </div>
        <div class="column is-1">
          <button class="button is-rounded ">
            <span @click="crearMensaje()" class="icon" style="color:#757575">
              <i class="fas fa-paper-plane fa-lg"></i>
            </span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import Auth from '@/services/auth.js'
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: 'ChatGrupal',
  data () {
    return {
      stakeholders: [],
      estudiantes: [],
      mensajes: [],
      texto: '',
      fecha: {},
      grupoActual: {
        id: 0,
        nombre: '',
        proyecto: ''
      },
      chat: {
        id: 0,
        grupo_id: 0
      },
      mensaje: {
        texto: '',
        chat_id: 0,
        usuario_id: 0
      }
    }
  },
  computed: {
    ...mapState(['apiUrl', 'usuario', 'estudiante', 'grupo', 'faqs', 'stakeholder'])

  },
  methods: {
    async obtenerChat () {
      try {
        if (this.usuario.rol_id === 3) {
          const response = await axios.get(this.apiUrl + '/chats/' + this.estudiante.grupo_id, { headers: Auth.authHeader() })
          const chat = response.data
          this.chat.id = chat[0].id
          this.chat.grupo_id = chat[0].grupo_id
        } else {
          const response = await axios.get(this.apiUrl + '/chats/' + this.grupo.id, { headers: Auth.authHeader() })
          const chat = response.data
          this.chat.id = chat[0].id
          this.chat.grupo_id = chat[0].grupo_id
        }
      } catch {
        console.log('No fue posible obtener el chat')
      }
    },
    async obtenerGrupo () {
      try {
        const response = await axios.get(this.apiUrl + '/grupos/' + this.grupo.id, { headers: Auth.authHeader() })
        const grupo = response.data
        this.grupoActual.id = grupo.id
        this.grupoActual.nombre = grupo.nombre
        this.grupoActual.proyecto = grupo.proyecto
        this.estudiantes = grupo.estudiantes
        this.stakeholders = grupo.stakeholders
      } catch {
        console.log('No se ha obtenido la información del grupo')
      }
    },
    async obtenerMensajes () {
      try {
        const response = await axios.get(this.apiUrl + '/mensajes/' + this.grupo.id, { headers: Auth.authHeader() })
        const mensajes = response.data
        this.mensajes = mensajes
      } catch {
        console.log('No se ha obtenido la información de los mensajes')
      }
    },
    async crearMensaje () {
      if (this.texto.length > 0) {
        try {
          const nuevoMensaje = {
            texto: this.texto,
            chat_id: this.chat.id,
            usuario_id: this.usuario.id
          }
          await axios.post(this.apiUrl + '/mensajes', nuevoMensaje, { headers: Auth.postHeader() })
          this.obtenerMensajes()
        } catch {
          console.log('No se ha obtenido crear el mensaje')
        }
      }
      this.texto = []
    },
    obtenerNombreUsuario: function (idUsuario) {
      for (var i = 0; i < this.stakeholders.length; i++) {
        if (this.stakeholders[i].usuario.id === idUsuario) {
          return (this.stakeholders[i].usuario.nombre +
          ' ' +
          this.stakeholders[i].usuario.apellido_paterno)
        }
      }
      for (var j = 0; j < this.estudiantes.length; j++) {
        if (this.estudiantes[j].usuario.id === idUsuario) {
          return (this.estudiantes[j].usuario.nombre +
          ' ' +
          this.estudiantes[j].usuario.apellido_paterno)
        }
      }
    },
    convertTZ: function (date) {
      if (typeof date !== 'undefined') {
        return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', { timeZone: 'America/Santiago' }))
      }
    },
    darFormatoFecha: function (fecha) {
      var fechaConvertida = this.convertTZ(fecha)
      return (fechaConvertida.getHours() +
        ':' +
        this.darFormatoMinutos(fechaConvertida.getMinutes()) +
        ' ' +
        fechaConvertida.getDate() +
        '/' +
        (fechaConvertida.getMonth() + 1) +
        '/' +
        fechaConvertida.getFullYear()
      )
    },
    darFormatoMinutos: function (minutos) {
      var minutosAux = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      var minutosStr = minutos.toString()
      if (minutosAux.includes(minutosStr)) {
        return ('0' + minutosStr)
      } else {
        return minutosStr
      }
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerGrupo()
      this.obtenerChat()
      this.obtenerMensajes()
    }
  }
}
</script>
