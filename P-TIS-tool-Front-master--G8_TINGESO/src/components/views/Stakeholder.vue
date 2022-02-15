<template>
  <div class="has-text-left">
    <div class="modal animate__animated animate__fadeIn" :class="help ? 'is-active': ''" >
      <div class="modal-background" @click="modificarModal" ></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title title is-4">Preguntas Frecuentes del uso de la herramienta</p>
          <button class="modal-close" aria-label="close" @click="modificarModal"></button>
        </header>
        <div class="columns modal-decoration">
          <div class="header-nav-blue column is-5"></div>
          <div class="header-nav-orange column is-7"></div>
        </div>
        <section class="modal-card-body">
          <div class="content" v-for="faq in faqs.sort((a, b) => (a.id > b.id ? 1 : -1))" :key="faq.id">
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

    <div v-if="verTablero">

      <SelectorJornada/>

      <div class="columns">
          <div class="column is-10"></div>
          <div class="column is-1">
            <button class="button" v-if="grupo.nombre != 'SG'" @click="verificarChat()">Chat</button>
          </div>
          <div class="column is-1">
            <button class="button is-light-usach" @click="modificarModal" >Ayuda</button>
          </div>
        </div>
      <div v-if="verSelectorGrupo">
        <div class="columns">
          <div class="column is-three-fifths">
            <div v-if="mostrarGrupos">
              <div class="field">
                <div class="control">
                  <label id="grupos" class="label">Listado de grupos</label>
                </div>
              </div>
              <table class="table is-fullwidth" aria-describedby="grupos">
                <thead>
                  <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Grupo</th>
                    <th scope="col">Proyecto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(grupo, index) in gruposJornada" :key="grupo.id">
                    <th scope="row" :class="{ 'is-selected-usach' : grupoActual === grupo.id }">{{ index + 1}}</th>
                    <td :class="{ 'is-selected-usach' : grupoActual === grupo.id }" @click="seleccionarGrupo(grupo.id)">{{ grupo.nombre }}</td>
                    <td :class="{ 'is-selected-usach' : grupoActual === grupo.id }" @click="seleccionarGrupo(grupo.id)"><a>{{ grupo.proyecto }}</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="column is-1"></div>
          <div class="column">
            <div v-if="grupoActual !== 0">
              <div class="field">
                <div class="control">
                  <label id="estudiantes" class="label">Estudiantes</label>
                </div>
              </div>
              <div>
                <table class="table is-fullwidth" aria-describedby="estudiantes">
                  <thead>
                    <tr>
                      <th scope="col">R.U.N.</th>
                      <th scope="col">Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="estudiante in grupoSeleccionado.estudiantes" :key="estudiante.id">
                      <td>{{ visualizarRun(estudiante.usuario.run) }}</td>
                      <td>{{ nombreCompleto(estudiante.usuario) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <hr>
      </div>
      <div v-if="!verChatGrupal">
        <Tablero :contador="tableroStk" :tarjeta="nombreTab" @revision="establecerRevision" @respuestas="revisarRespuestas" @ver-minuta="mostrarMinuta"/>
      </div>
    </div>

    <div v-else-if="verRevision">
      <Comentar :id-bitacora="idRevision" @cerrar="mostrarTablero('Revision')"/>
    </div>

    <div v-else-if="verRespuestas">
      <Respuestas :id-bitacora="idRespuestas" @cerrar="mostrarTablero('Revision')"/>
    </div>

    <div v-else-if="verMinuta">
      <RevisarMinuta :id-bitacora="idMinuta" @cerrar="verCerradas"/>
    </div>
    <div v-if="verChatGrupal">
      <ChatGrupal />
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import { mapState } from 'vuex'

import Tablero from '@/components/TableroStk.vue'
import Comentar from '@/components/comentarios/ComentarMinuta.vue'
import Respuestas from '@/components/comentarios/RespuestasMinuta.vue'
import SelectorJornada from '@/components/SelectorJornada.vue'
import RevisarMinuta from '@/components/comentarios/RevisarMinuta.vue'
import ChatGrupal from '@/components/ChatGrupal.vue'

export default {
  name: 'Stakeholder',
  components: {
    Tablero,
    Comentar,
    Respuestas,
    SelectorJornada,
    RevisarMinuta,
    ChatGrupal
  },
  data () {
    return {
      nombreTab: 'Revision',
      idRevision: 0,
      idRespuestas: 0,
      idMinuta: 0,
      verTablero: true,
      verRevision: false,
      verRespuestas: false,
      verMinuta: false,
      verChatGrupal: false,
      listaGrupos: [],
      grupoActual: 0,
      grupoSeleccionado: {},
      verSelectorGrupo: true,
      tableroStk: 0,
      help: false,
      faqs_open: [],
      chat: {
        id: 0,
        grupo_id: 0
      }
    }
  },
  computed: {
    ...mapState(['apiUrl', 'usuario', 'stakeholder', 'jornadaActual', 'grupo', 'tipoAprobaciones', 'faqs']),

    gruposFiltrados: function () {
      var lista = []
      for (var i = 0; i < this.listaGrupos.length; i++) {
        if (this.stakeholder.grupos.length === undefined) {
          if (this.listaGrupos[i].id === this.stakeholder.grupos.id) {
            lista.push(this.listaGrupos[i])
          }
        } else {
          for (var j = 0; j < this.stakeholder.grupos.length; j++) {
            if (this.listaGrupos[i].id === this.stakeholder.grupos[j].id) {
              lista.push(this.listaGrupos[i])
            }
          }
        }
      }
      return lista
    },
    gruposJornada: function () {
      var lista = []
      for (var i = 0; i < this.gruposFiltrados.length; i++) {
        if (this.gruposFiltrados[i].jornada === this.jornadaActual) {
          lista.push(this.gruposFiltrados[i])
        }
      }
      return lista
    },
    mostrarGrupos: function () {
      return this.gruposJornada.length > 0
    }
  },
  methods: {
    establecerRevision: function (id) {
      this.idRevision = id
      this.verRevision = true
      this.verTablero = false
    },
    mostrarTablero: function (tarjeta) {
      this.verTablero = true
      this.verRevision = false
      this.idRevision = 0
      this.verRespuestas = false
      this.idRespuestas = 0
      this.tableroStk++
      this.nombreTab = tarjeta
    },
    revisarRespuestas: function (id) {
      this.verTablero = false
      this.verRevision = false
      this.verRespuestas = true
      this.idRespuestas = id
    },
    mostrarMinuta: function (id) {
      this.verTablero = false
      this.verRevision = false
      this.verMinuta = true
      this.idMinuta = id
    },
    verCerradas: function () {
      this.mostrarTablero('Cerradas')
      this.verMinuta = false
      this.idMinuta = 0
    },
    async obtenerStakeholder () {
      try {
        const response = await axios.get(this.apiUrl + '/stakeholders/' + this.usuario.id, { headers: Auth.authHeader() })
        this.$store.commit('setStakeholder', response.data)
      } catch (e) {
        console.log('No se ha obtenido la información del Stakeholder')
        console.log(e)
      }
    },
    async obtenerGrupo (grupoId) {
      try {
        const response = await axios.get(this.apiUrl + '/grupos/' + grupoId, { headers: Auth.authHeader() })
        this.$store.commit('setGrupo', response.data)
      } catch (e) {
        console.log('No se ha obtenido la información del grupo')
        console.log(e)
      }
    },
    async obtenerGrupos () {
      try {
        const response = await axios.get(this.apiUrl + '/grupos', { headers: Auth.authHeader() })
        this.listaGrupos = response.data
        if (this.gruposFiltrados.length === 1) {
          this.grupoActual = this.gruposFiltrados[0].id
          this.grupoSeleccionado = this.gruposFiltrados[0]
          this.$store.commit('setGrupo', this.grupoSeleccionado)
          this.verSelectorGrupo = false
          this.tableroStk++
        }
      } catch (e) {
        console.log('No se ha obtenido la lista de grupos')
        console.log(e)
      }
    },
    async obtenerFaqs () {
      try {
        const response = await axios.get(this.apiUrl + '/faqs/rol', { headers: Auth.authHeader() })
        this.$store.commit('setFaqs', response.data)
      } catch {
        console.log('No fue posible obtener las faqs')
      }
    },
    async obtenerAprobaciones () {
      try {
        const response = await axios.get(this.apiUrl + '/tipo_aprobaciones', { headers: Auth.authHeader() })
        this.$store.commit('setTipoAprobaciones', response.data)
      } catch (e) {
        console.log(e)
      }
    },
    async verificarChat () {
      try {
        const response = await axios.get(this.apiUrl + '/chats/' + this.grupo.id, { headers: Auth.authHeader() })
        const chat = response.data
        if (chat.length === 0) {
          const nuevoChat = {
            grupo_id: this.grupo.id
          }
          await axios.post(this.apiUrl + '/chats/crear_grupo', nuevoChat, { headers: Auth.postHeader() })
        } else {
          this.chat.id = chat.id
          this.chat.grupo_id = chat.grupo_id
        }
        this.abrirChat()
      } catch {
        console.log('No fue posible obtener el chat')
      }
    },
    nombreCompleto: function (usuario) {
      return Funciones.nombreCompleto(usuario)
    },
    visualizarRun: function (run) {
      return Funciones.visualizarRun(run)
    },
    buscarPorId: function (lista, id) {
      return Funciones.busquedaPorId(lista, id)
    },
    transformarPregunta: function (valor) {
      return Funciones.stringToHTML(valor)
    },
    seleccionarGrupo: function (id) {
      this.grupoActual = id
      this.grupoSeleccionado = this.buscarPorId(this.gruposFiltrados, id)
      this.$store.commit('setGrupo', this.grupoSeleccionado)
      this.tableroStk++
    },
    modificarModal: function () {
      if (!this.help) {
        this.help = true
      } else {
        this.help = false
      }
      this.faqs_open = []
    },
    removerDeArray: function (arr, valor) {
      console.log(valor)
      return Funciones.removeFromArray(arr, valor)
    },
    modificarArray: function (element) {
      console.log(element)
      this.faqs_open.push(element)
    },
    abrirChat: function () {
      if (this.verChatGrupal === false) {
        this.verChatGrupal = true
      } else {
        this.verChatGrupal = false
      }
    }
  },
  watch: {
    jornadaActual: function () {
      this.grupoActual = 0
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerStakeholder()
      this.obtenerGrupos()
      this.obtenerAprobaciones()
      this.obtenerFaqs()
    }
  }
}
</script>
