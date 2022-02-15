<template>
  <div>
    <div class="modal animate__animated animate__fadeIn" :class="help ? 'is-active': ''" >
      <div class="modal-background" @click="modificarModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title title is-4">Gestión de clientes</p>
          <button class="modal-close" aria-label="close" @click="modificarModal"></button>
        </header>
        <div class="columns modal-decoration">
          <div class="header-nav-blue column is-5"></div>
          <div class="header-nav-orange column is-7"></div>
        </div>
        <section class="modal-card-body has-text-left">
          <div class="content" v-for="faq in faqsProfesor.sort((a, b) => (a.id > b.id ? 1 : -1))" :key="faq.id">
            <div class="columns">
              <div class="column is-11"><h2 class="title is-5" style="white-space: pre-line">{{faq.pregunta}}</h2></div>
              <div class="column is-1" v-if="!faqs_open.includes(faq.id)" @click="modificarArray(faq.id)">
                <button class="delete fas fa-angle-down"></button>
              </div>
              <div class="column is-2" v-else @click="removerDeArray(faqs_open, faq.id)">
                <button class="delete fas fa-angle-up" ></button>
              </div>
            </div>
            <transition name="fade" tag="ul" >
            <p v-if="faqs_open.includes(faq.id)"><span v-html="transformarPregunta(faq.respuesta).outerHTML" ></span></p>
            </transition>
          </div>
        </section>
      </div>
    </div>
    <br>

    <SelectorJornada/>

    <div v-if="!verAsignaciones">
      <div class="columns">
        <div class="column is-8"></div>
        <div class="column is-4" v-if="verFormulario"></div>
        <div class="column is-4" v-else>
          <div class="control">
            <div class="field is-grouped is-grouped-right">
              <p class="control">
                <a class="button is-light-usach" @click="modificarModal">Ayuda</a>
              </p>
              <p class="control">
                <a class="button is-info-usach" @click="agregarCliente">Agregar Cliente</a>
              </p>
              <div class="control" v-if="mostrarLista">
              <button class="button is-secondary-usach" @click="editarAsignaciones">Editar asignaciones</button>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="verFormulario">
        <form class="form">
          <div class="columns has-text-left">
            <div class="column is-4">
              <div class="field">
                <label class="label">Nombre:</label>
                <div class="control">
                  <input v-model="stakeholder.usuario.nombre" @input="validarNombre" class="input" :class="{ 'is-danger' : entradas.nombre.error }" type="text" placeholder="ej.: Sergio">
                </div>
                <p class="is-danger help" v-if="entradas.nombre.error">{{ entradas.nombre.mensaje }}</p>
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <label class="label">Apellido paterno:</label>
                <div class="control">
                  <input v-model="stakeholder.usuario.apellido_paterno" @input="validarApellidoP" class="input" :class="{ 'is-danger' : entradas.apellido_paterno.error }" type="text" placeholder="ej.: Maldonado">
                </div>
                <p class="is-danger help" v-if="entradas.apellido_paterno.error">{{ entradas.apellido_paterno.mensaje }}</p>
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <label class="label">Apellido materno:</label>
                <div class="control">
                  <input v-model="stakeholder.usuario.apellido_materno" @input="validarApellidoM" class="input" :class="{ 'is-danger' : entradas.apellido_materno.error }" type="text" placeholder="ej.: Zamorano">
                </div>
                <p class="is-danger help" v-if="entradas.apellido_materno.error">{{ entradas.apellido_materno.mensaje }}</p>
              </div>
            </div>
          </div>

          <div class="columns has-text-left">
            <div class="column is-4">
              <div class="field">
                <label class="label">Correo electrónico:</label>
                <div class="control">
                  <input v-model="stakeholder.usuario.email" @input="validarEmail" class="input" :class="{ 'is-danger' : entradas.correo_elec.error }" type="text" placeholder="ej.: sergio.maldonado@gmail.com">
                </div>
                <p class="is-danger help" v-if="entradas.correo_elec.error">{{ entradas.correo_elec.mensaje }}</p>
              </div>
            </div>
            <div class="column is-8">
              <div class="field">
                <label class="label-ayuda">Grupo a asignar:</label>
                <span id="icono-ayuda" ayuda="Grupo que trabajará con el cliente" class="icon is-large">
                  <i class="far fa-question-circle"></i>
                </span>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="stakeholder.grupo_id" @change="validarGrupo" :class="{ 'is-danger' : entradas.grupo.error}" :disabled="actualizarStakeholder">
                      <option v-for="grupo in listaFiltrada" :key="grupo.id" :value="grupo.id">
                        {{ grupo.nombre }} - {{ grupo.proyecto }}
                      </option>
                    </select>
                  </div>
                </div>
                <p class="is-danger help" v-if="entradas.grupo">No ha seleccionado el grupo a asignar</p>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column is-12">
              <div class="field is-grouped is-grouped-centered">
                <div class="control">
                  <a class="button is-primary-usach" @click="agregar">{{ actualizarStakeholder ? 'Actualizar' : 'Agregar'}}</a>
                </div>
                <div class="control">
                  <a class="button is-light-usach" @click="noAgregar"><strong>Cancelar</strong></a>
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr>
      </div>

      <br>
      <div v-if="mostrarLista">
        <table class="table is-bordered is-narrow is-fullwidth" summary="Lista Clientes">
          <thead>
            <tr class="has-background-light">
              <th scope="col" class="has-text-centered">N°</th>
              <th scope="col" class="has-text-centered">Nombre cliente</th>
              <th scope="col" class="has-text-centered">Correo electrónico</th>
              <th scope="col" class="has-text-centered">Grupo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stakeholder, index) in stakeholdersPorJornada" :key="stakeholder.id">
              <th scope="row" class="is-vcentered has-text-centered">{{ index + 1 }}</th>
              <td class="is-vcentered has-text-left"><a @click="editarStakeholder(stakeholder)">{{ nombreCompleto(stakeholder) }}</a></td>
              <td class="is-vcentered has-text-centered">{{ stakeholder.email }}</td>
              <td>
                <div v-for="grupo in stakeholder.grupos" :key="grupo.id">
                  <p class="has-text-centered">{{ grupo.nombre }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else>
      <AsignarStk @actualizar="actualizarAsignaciones" @cerrar="cerrarAsignaciones"/>
    </div>
    <br>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import axios from 'axios'
import { mapState } from 'vuex'

import SelectorJornada from '@/components/SelectorJornada.vue'
import AsignarStk from '@/components/AsignarStk.vue'

export default {
  name: 'GestionClientes',
  components: {
    SelectorJornada,
    AsignarStk
  },
  data () {
    return {
      help: false,
      verFormulario: false,
      verAsignaciones: false,
      stakeholder: {
        usuario: {
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          email: ''
        },
        grupo_id: null
      },
      listaStakeholders: [],
      listaGrupos: [],
      entradas: {
        nombre: {
          error: false,
          mensaje: ''
        },
        apellido_paterno: {
          error: false,
          mensaje: ''
        },
        apellido_materno: {
          error: false,
          mensaje: ''
        },
        correo_elec: {
          error: false,
          mensaje: ''
        },
        grupo: false
      },
      mensajes: {
        sin_nombre: 'Debe ingresar el nombre del cliente',
        sin_apellido: 'Debe ingresar el apellido del cliente',
        sin_correo: 'Debe ingresar el correo electrónico del cliente',
        sin_especiales: 'Sólo letras. Verificar que no tenga caracteres especiales',
        correo_mal: 'El correo ingresado no es válido',
        correo_repetido: 'El correo ingresado ya se encuentra en el sistema'
      },
      actualizarStakeholder: false,
      idStakeholder: 0,
      faqs_open: []
    }
  },
  computed: {
    ...mapState(['apiUrl', 'jornadaActual', 'faqsProfesor']),

    listaFiltrada: function () {
      var lista = []
      for (var i = 0; i < this.listaGrupos.length; i++) {
        if (this.listaGrupos[i].jornada === this.jornadaActual) {
          lista.push(this.listaGrupos[i])
        }
      }
      return lista
    },
    stakeholdersPorJornada: function () {
      var lista = []
      var grupos = []
      var cliente = {}
      for (var i = 0; i < this.listaStakeholders.length; i++) {
        grupos = []
        cliente = {}
        for (var j = 0; j < this.listaStakeholders[i].grupos.length; j++) {
          if (this.listaStakeholders[i].grupos[j].jornada === this.jornadaActual) {
            grupos.push(this.listaStakeholders[i].grupos[j])
          }
        }
        if (grupos.length > 0) {
          cliente = {
            id: this.listaStakeholders[i].id,
            nombre: this.listaStakeholders[i].nombre,
            apellido_paterno: this.listaStakeholders[i].apellido_paterno,
            apellido_materno: this.listaStakeholders[i].apellido_materno,
            email: this.listaStakeholders[i].email,
            grupos: grupos
          }
          lista.push(cliente)
        }
      }
      return lista
    },
    mostrarLista: function () {
      return this.stakeholdersPorJornada.length > 0
    }
  },
  methods: {
    nombreCompleto (estudiante) {
      return Funciones.nombreCompleto(estudiante)
    },
    agregarCliente: function () {
      this.verFormulario = true
      this.nuevoStakeholder()
    },
    nuevoStakeholder: function () {
      this.stakeholder.usuario.nombre = ''
      this.stakeholder.usuario.apellido_paterno = ''
      this.stakeholder.usuario.apellido_materno = ''
      this.stakeholder.usuario.email = ''
      this.stakeholder.grupo_id = null
    },
    async obtenerStakeholders () {
      try {
        const response = await axios.get(this.apiUrl + '/stakeholders/asignacion/grupos', { headers: Auth.authHeader() })
        this.listaStakeholders = response.data
      } catch {
        console.log('No fue posible obtener la lista de Clientes')
      }
    },
    async obtenerAyuda () {
      try {
        const response = await axios.get(this.apiUrl + '/faqs/profesor/clientes', { headers: Auth.authHeader() })
        this.$store.commit('setFaqsProfesor', response.data)
      } catch {
        console.log('No fue posible obtener las faqs')
      }
    },
    async agregar () {
      if (this.validarFormulario()) {
        const nuevo = {
          stakeholder: {
            usuario_attributes: this.stakeholder.usuario
          },
          grupo: {
            id: this.stakeholder.grupo_id
          }
        }
        if (!this.actualizarStakeholder) {
          try {
            await axios.post(this.apiUrl + '/stakeholders', nuevo, { headers: Auth.postHeader() })
            this.obtenerStakeholders()
          } catch {
            console.log('No fue posible crear el nuevo cliente')
          }
        } else {
          try {
            await axios.patch(this.apiUrl + '/stakeholders/' + this.idStakeholder, nuevo, { headers: Auth.postHeader() })
            this.obtenerStakeholders()
          } catch {
            console.log('No fue posible actualizar la información del cliente')
          }
          this.actualizarStakeholder = false
          this.idStakeholder = 0
        }
        this.verFormulario = false
      }
    },
    noAgregar: function () {
      this.nuevoStakeholder()
      this.verFormulario = false
      this.entradas.nombre.error = false
      this.entradas.apellido_paterno.error = false
      this.entradas.apellido_materno.error = false
      this.entradas.correo_elec.error = false
      this.entradas.grupo = false
      this.actualizarStakeholder = false
    },
    async obtenerGrupos () {
      try {
        const response = await axios.get(this.apiUrl + '/grupos', { headers: Auth.authHeader() })
        this.listaGrupos = response.data
      } catch {
        console.log('No se han obtenido los grupos')
      }
    },
    validarNombre: function () {
      const regExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
      const nombre = this.stakeholder.usuario.nombre
      try {
        if (nombre === null || nombre === undefined || nombre.length === 0 || nombre === '') {
          this.entradas.nombre.error = true
          this.entradas.nombre.mensaje = this.mensajes.sin_nombre
          return false
        } else if (!regExp.test(nombre)) {
          this.entradas.nombre.error = true
          this.entradas.nombre.mensaje = this.mensajes.sin_especiales
          return false
        } else {
          this.entradas.nombre.error = false
          this.entradas.nombre.mensaje = ''
          return true
        }
      } catch {
        this.entradas.nombre.error = true
        this.entradas.nombre.mensaje = ''
        return false
      }
    },
    validarApellido: function (apellido, entradas) {
      const regExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
      try {
        if (apellido === null || apellido === undefined || apellido === '' || apellido.length === 0) {
          entradas.error = true
          entradas.mensaje = this.mensajes.sin_apellido
          return false
        } else if (!regExp.test(apellido)) {
          entradas.error = true
          entradas.mensaje = this.mensajes.sin_especiales
          return false
        } else {
          entradas.error = false
          entradas.mensaje = ''
          return true
        }
      } catch {
        entradas.error = true
        entradas.mensaje = ''
        return false
      }
    },
    validarApellidoP: function () {
      return this.validarApellido(this.stakeholder.usuario.apellido_paterno, this.entradas.apellido_paterno)
    },
    validarApellidoM: function () {
      return this.validarApellido(this.stakeholder.usuario.apellido_materno, this.entradas.apellido_materno)
    },
    validarEmail: function () {
      const regExp = /^([a-z0-9_.-]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/
      const correo = this.stakeholder.usuario.email
      var separarCorreo = []
      if (correo !== null && correo !== undefined) {
        separarCorreo = correo.split('@')
      }
      try {
        if (correo === null || correo === undefined || correo === '' || correo.length === 0) {
          this.entradas.correo_elec.error = true
          this.entradas.correo_elec.mensaje = this.mensajes.sin_correo
          return false
        } else if (!regExp.test(correo) || separarCorreo.length !== 2) {
          this.entradas.correo_elec.error = true
          this.entradas.correo_elec.mensaje = this.mensajes.correo_mal
          return false
        } else {
          this.entradas.correo_elec.error = false
          this.entradas.correo_elec.mensaje = ''
          return true
        }
      } catch {
        this.entradas.correo_elec.error = true
        this.entradas.correo_elec.mensaje = ''
        return false
      }
    },
    validarGrupo: function () {
      const seleccion = this.stakeholder.grupo_id
      if (seleccion === null || seleccion === undefined || seleccion === '' || seleccion === 0) {
        this.entradas.grupo = true
        return false
      } else {
        this.entradas.grupo = false
        return true
      }
    },
    existeStakeholder: function () {
      let existe = false
      let aux = false
      for (var i = 0; i < this.listaStakeholders.length; i++) {
        aux = (this.listaStakeholders[i].email === this.stakeholder.usuario.email)
        existe = aux || existe
      }
      if (existe) {
        this.entradas.correo_elec.error = true
        this.entradas.correo_elec.mensaje = this.mensajes.correo_repetido
      }
      return existe
    },
    validarFormulario: function () {
      var esValido = true
      esValido = esValido && this.validarNombre()
      esValido = esValido && this.validarApellidoP()
      esValido = esValido && this.validarApellidoM()
      esValido = esValido && this.validarEmail()
      if (!this.actualizarStakeholder) {
        esValido = esValido && this.validarGrupo()
        esValido = esValido && !this.existeStakeholder()
      }
      return esValido
    },
    editarAsignaciones: function () {
      this.verAsignaciones = true
    },
    cerrarAsignaciones: function () {
      this.verAsignaciones = false
    },
    actualizarAsignaciones: function () {
      this.verAsignaciones = false
      this.obtenerGrupos()
      this.obtenerStakeholders()
    },
    editarStakeholder: function (stakeholder) {
      this.actualizarStakeholder = true
      this.idStakeholder = stakeholder.id
      this.stakeholder.usuario.nombre = stakeholder.nombre
      this.stakeholder.usuario.apellido_paterno = stakeholder.apellido_paterno
      this.stakeholder.usuario.apellido_materno = stakeholder.apellido_materno
      this.stakeholder.usuario.email = stakeholder.email
      this.stakeholder.grupo_id = 0
      this.verFormulario = true
    },
    modificarModal: function () {
      if (!this.help) {
        this.help = true
      } else {
        this.help = false
      }
    },
    removerDeArray: function (arr, valor) {
      return Funciones.removeFromArray(arr, valor)
    },
    modificarArray: function (element) {
      this.faqs_open.push(element)
    },
    transformarPregunta: function (valor) {
      return Funciones.stringToHTML(valor)
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerGrupos()
      this.obtenerStakeholders()
      this.obtenerAyuda()
    }
  }
}
</script>
