<template>
  <div>

    <div class="dropdown is-hoverable is-right">
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span>{{ this.nombreCompleto(this.usuario) }}</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a class="dropdown-item" @click="cambiarClave">Cambiar clave</a>
          <a class="dropdown-item" @click="cerrarSesion">Cerrar sesión</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import { mapState } from 'vuex'

export default {
  name: 'MenuOpciones',
  data () {
    return {
      mostrarMenu: false
    }
  },
  computed: {
    ...mapState(['usuario', 'authenticated']),

    sesionIniciada: function () {
      return this.authenticated || !!localStorage.user_tk
    }
  },
  methods: {
    nombreCompleto: function (usuario) {
      return Funciones.nombreCompleto(usuario)
    },
    cambiarClave: function () {
      this.$router.push({ path: '/usuario/cambio/clave' })
    },
    cerrarSesion: function () {
      localStorage.removeItem('user_tk')
      this.$store.commit('setAutenticacion', false)
      this.$store.commit('setUsuario', {})
      Auth.deleteCookie('userLogged')
      Auth.deleteCookie('range')
      return this.$router.push('/')
    }
  },
  mounted () {
    try {
      if (this.sesionIniciada && Object.keys(this.usuario).length === 0) {
        const datosUsuario = Auth.getCookie('userLogged').split(';')
        const datosRango = Auth.getCookie('range').split(';')
        const usuario = {
          id: datosUsuario[0],
          nombre: datosUsuario[1],
          apellido_paterno: datosUsuario[2],
          apellido_materno: datosUsuario[3],
          run: null,
          email: datosUsuario[5],
          rol_id: datosUsuario[6],
          rol: {
            id: datosRango[0],
            rol: datosRango[1],
            rango: datosRango[2]
          }
        }
        if (datosUsuario[4] !== 'null') {
          usuario.run = datosUsuario[4]
        }
        this.$store.commit('setUsuario', usuario)
        this.$store.commit('setAutenticacion', true)
      }
    } catch {
      this.cerrarSesion()
    }
  }
}
</script>
