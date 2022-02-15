<template>
  <div>
    <Header/>
    <div class="container">
      <div id="init-container" class="columns is-vcentered is-fullheight">
        <img src="@/assets/images/eao-usach.png" class="is-tablet" style="z-index: 1" alt="Patio EAO"/>
        <div class="column is-3" style="z-index: 999"></div>
        <div class="column is-6 bg-semitransparent px-5 py-5" style="z-index: 999" @keyup.enter=disteClick>
          <div class="title is-2">Módulo de minutas de reunión</div>
          <div class="subtitle is-5 my-3">
            <p>Herramienta de apoyo a las actividades de desarrollo de proyectos de software de los cursos Proyecto y Taller de Ingeniería de Software</p>
          </div>

          <div class="is-vcentered">

            <div class="field">
              <label class="label has-text-left">Correo electrónico</label>
              <div class="control has-icons-left">
                <input v-model="correo" class="input" type="text" v-bind:class="{ 'is-danger' : passError }" placeholder="nombre.apellido@usach.cl" v-on:click="noError">
                <span class="icon is-small is-left">
                  <i class="fas fa-id-card" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <br>
            <div class="field has-text-left">
              <label class="label">Clave de acceso</label>
            </div>
            <div class="field has-addons">
              <div id="clave" class="control has-icons-left is-expanded">
                <span class="icon is-small is-left">
                  <i class="fas fa-key" aria-hidden="true"></i>
                </span>
                <input  id="inputClave" v-model="password" class="input" :type="passwordFieldType" v-bind:class="{ 'is-danger' : passError }" v-on:click="noError">
              </div>
              <button id="botonMostrarClave" type="password" style="float: right" @click="mostrarClave">
                <span v-if="passwordFieldType==='text'" class="icon">
                  <i class="far fa-eye"></i>
                </span>
                <span v-if="passwordFieldType==='password'" class="icon">
                  <i class="far fa-eye-slash"></i>
                </span>
              </button>
            </div>
            <p class="help is-danger" v-bind:style="{ display: displayText }">Usuario o contraseña incorrectos</p>
            <br>
          </div>

          <div class="columns">
            <div class="column is-3"></div>
            <div class="column is-6">
              <div class="field">
                <div class="control">
                  <button class="button is-primary-usach is-fullwidth" v-on:click="disteClick">Acceder</button>
                </div>
              </div>
            </div>
            <div class="column is-3"></div>
          </div>

        </div>
        <div class="column is-3" style="z-index: 999"></div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Auth from '@/services/auth.js'

import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'Inicio',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      correo: '',
      password: '',
      passwordFieldType: 'password',
      passError: false,
      displayText: 'none'
    }
  },
  computed: {
    ...mapState(['apiUrl', 'authenticated', 'usuario']),

    registrarAutenticacion: {
      get: function () {
        return this.$store.state.authenticated
      },
      set: function (valor) {
        return this.$store.commit('setAutenticacion', valor)
      }
    }
  },
  methods: {
    noError: function () {
      this.passError = false
      this.ocultarError()
      return 0
    },
    mostrarError: function () {
      this.displayText = 'inline'
      return true
    },
    ocultarError: function () {
      this.displayText = 'none'
      return true
    },
    redirigirUsuario () {
      if (this.usuario.rol.rango === 1) {
        this.$router.push('/coordinador')
      } else if (this.usuario.rol.rango === 2) {
        this.$router.push('/profesor')
      } else if (this.usuario.rol.rango === 3) {
        this.$router.push('/estudiante')
      } else if (this.usuario.rol.rango === 4) {
        this.$router.push('/cliente')
      } else {
        this.$router.push('/')
      }
    },

    async disteClick () {
      try {
        await Auth.login(this.correo, this.password)
        try {
          const usuario = await axios.get(this.apiUrl + '/login/user', { headers: Auth.authHeader() })
          this.$store.commit('setUsuario', usuario.data)
          this.redirigirUsuario()
          Auth.setCookie('userLogged', this.usuarioACadena(usuario.data))
          Auth.setCookie('range', this.usuarioACadena(usuario.data.rol))
        } catch (e1) {
          console.log(e1)
          console.log('No se ha cargado la información del usuario')
        }
        this.registrarAutenticacion = true
      } catch (e2) {
        this.passError = true
        this.mostrarError()
      }
    },
    usuarioACadena: function (usuario) {
      var cadena = ''
      var llaves = Object.keys(usuario)
      for (var i = 0; i < llaves.length; i++) {
        cadena += usuario[llaves[i]] + ';'
      }
      return cadena
    },
    mostrarClave: function () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      if (parseInt(this.usuario.rol.rango) === 1) {
        this.$router.push('coordinador')
      } else if (parseInt(this.usuario.rol.rango) === 2) {
        this.$router.push('profesor')
      } else if (parseInt(this.usuario.rol.rango) === 3) {
        this.$router.push('estudiante')
      } else if (parseInt(this.usuario.rol.rango) === 4) {
        this.$router.push('cliente')
      } else {
        this.$router.push('/')
      }
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="css" scoped>
#init-container {
  height: 585px;
  width: 100%;
  margin: 0;
  padding: 0;
}

.bg-semitransparent {
  background-color: rgba(255, 255, 255, .8);
}

.has-textline-through {
  text-decoration: line-through;
}

#init-container img {
  position: absolute;
  height: 585px;
  object-fit: cover;
}

#botonMostrarClave{
  border:none;
  background:#5C7380;
  color:white;
}
</style>
