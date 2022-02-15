<template>
  <div class="has-text-left">

    <div class="modal animate__animated animate__fadeIn" :class="help ? 'is-active': ''" >
      <div class="modal-background" @click="modificarModal"></div>
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title title is-4">Preguntas Frecuentes del uso de la herramienta</p>
          <button class="modal-close" aria-label="close" @click="modificarModal"></button>
        </div>
        <div class="columns modal-decoration">
          <div class="header-nav-blue column is-5"></div>
          <div class="header-nav-orange column is-7"></div>
        </div>
        <section class="modal-card-body">
          <div class="content" v-for="faq in faqs.sort((a, b) => (a.id > b.id ? 1 : -1))" :key="faq.id">
            <div class="columns is-info-usach">
              <div class="column is-11"><h2 class="title is-5">{{faq.pregunta}}</h2></div>
              <div class="column is-1" v-if="!faqs_open.includes(faq.id)" @click="modificarArray(faq.id)">
                <button class="delete fas fa-angle-down"></button>
              </div>
              <div class="column is-1" v-else @click="removerDeArray(faqs_open, faq.id)">
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

    <div v-if="crearMinuta">

      <Minuta :tipo-minuta="tipo" :id-bitacora="idBitacora" :id-motivo="idMotivo" :re-emitir="esNuevaEmision" :letra-revision="nuevaRevision" :estado="revisionEstado" v-if="verFormulario" @cerrar="cerrarFormulario"/>

      <div v-else-if="verSemanal">
        <Semanal :avance="bitacoraAvance" :tipo-minuta="tipo"  @cerrar="cerrarSemanal"/>
      </div>

      <div v-else>

        <div class="columns is-gapless">
          <div class="column is-8"></div>
          <div class="column is-1">
            <button class="button" v-if="grupo.nombre != 'SG'" @click="verificarChat()">Chat</button>
          </div>
          <div class="column is-1">
            <button class="button is-light-usach" @click="modificarModal">Ayuda</button>
          </div>
          <div class="column is-2">
            <button class="button is-info-usach" @click="nuevaMinuta">Nueva Minuta</button>
          </div>
        </div>
        <div v-if="seleccionarMinuta">
          <div class="columns">
            <div class="column is-8 is-offset-1">
              <div class="field is-horizontal">
                <div class="field-label-2c is-normal">
                  <label class="label">Elegir tipo minuta:</label>
                </div>
                <div class="field-body">
                  <div class="field is-grouped">
                    <div class="control is-expanded">
                      <div class="select is-fullwidth">
                        <select v-model="tipo">
                          <option v-for="item in tipoMinutas" :key="item.id" :value="item.id">{{ item.tipo }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="control">
                      <a class="button is-info-usach" @click="elegirTipo">Elegir</a>
                    </div>
                    <div class="control">
                      <a class="button is-light-usach" @click="cancelarMinuta">Cancelar</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br>
        </div>
        <div v-if="!verChatGrupal">
          <Tablero :seleccionado="valorActual" :contador="tableroEst" @cambiar="cambiarTab" @bitacora="establecerBitacora" @revision="establecerRevision" @comentarios="revisarComentarios" @respuestas="revisarRespuestas" @emitir="nuevaVersion" @avance="editarAvance" @revisar-avance="revisarAvance" @ver-minuta="mostrarMinuta"/>
        </div>
      </div>

    </div>

    <div v-else-if="verRevision">
      <Comentar :id-bitacora="idRevision" @cerrar="mostrarTablero" @refrescar="refrescarPagina"/>
    </div>

    <div v-else-if="verComentarios">
      <Responder :id-bitacora="idComentarios" @cerrar="mostrarTablero"/>
    </div>

    <div v-else-if="verRespuestas">
      <Respuestas :id-bitacora="idRespuestas" @cerrar="mostrarTablero"/>
    </div>

    <div v-if="verEmision">
      <Emision :id-bitacora="idEmision" @cerrar="nuevaEmision" @revisar="revisarAprobacion" @cancelar="mostrarTablero"/>
    </div>

    <div v-else-if="revisarSemanal">
      <RevisionSemanal :grupo="grupo" :minuta="bitacoraAvance" :usuario="usuario" @cerrar="cerrarAvance"/>
    </div>

    <div v-else-if="verMinuta">
      <RevisarMinuta :id-bitacora="idVerMinuta" @cerrar="cerrarMinuta"/>
    </div>
    <div v-else-if="verChatGrupal">
      <ChatGrupal />
    </div>
  </div>
</template>

<script>
import Minuta from '@/components/Minuta.vue'
import Tablero from '@/components/TableroEst.vue'
import Comentar from '@/components/comentarios/ComentarMinuta.vue'
import Responder from '@/components/comentarios/ResponderMinuta.vue'
import Respuestas from '@/components/comentarios/RespuestasMinuta.vue'
import Emision from '@/components/comentarios/NuevaMinuta.vue'
import Semanal from '@/components/semanal/Semanal.vue'
import RevisionSemanal from '@/components/semanal/RevisionSemanal.vue'
import RevisarMinuta from '@/components/comentarios/RevisarMinuta.vue'
import ChatGrupal from '@/components/ChatGrupal.vue'

import axios from 'axios'
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import { mapState } from 'vuex'

export default {
  name: 'Estudiante',
  components: {
    Minuta,
    Tablero,
    Comentar,
    Responder,
    Respuestas,
    Emision,
    Semanal,
    RevisionSemanal,
    RevisarMinuta,
    ChatGrupal
  },
  data () {
    return {
      verFormulario: false,
      tipo: 0,
      seleccionarMinuta: false,
      idBitacora: 0,
      idRevision: 0,
      idComentarios: 0,
      idRespuestas: 0,
      idEmision: 0,
      idVerMinuta: 0,
      help: false,
      crearMinuta: true,
      verRevision: false,
      verComentarios: false,
      verRespuestas: false,
      verEmision: false,
      verSemanal: false,
      verMinuta: false,
      revisarSemanal: false,
      verChatGrupal: false,
      idMotivo: 0,
      nuevaRevision: '',
      esNuevaEmision: false,
      valorActual: 0,
      tableroEst: 0,
      bitacoraAvance: {},
      revisionEstado: '',
      faqs_open: [],
      chat: {
        id: 0,
        grupo_id: 0
      }
    }
  },
  computed: {
    ...mapState(['apiUrl', 'tipoMinutas', 'usuario', 'estudiante', 'grupo', 'motivos', 'faqs']),

    minutasFiltradas: function () {
      var lista = []
      for (var i = 0; i < this.tipoMinutas.length; i++) {
        if (this.tipoMinutas[i].tipo !== 'Semanal') {
          lista.push(this.tipoMinutas[i])
        }
      }
      return lista
    }
  },
  methods: {
    nuevaMinuta: function () {
      this.seleccionarMinuta = true
    },
    cancelarMinuta: function () {
      this.seleccionarMinuta = false
      this.tipo = 0
    },
    elegirTipo: function () {
      if (this.tipo === this.buscarIdTipoMinuta('Semanal')) {
        this.verSemanal = true
        this.seleccionarMinuta = false
      } else {
        this.verFormulario = true
        this.seleccionarMinuta = false
        this.idMotivo = this.buscarIdMotivo('ECI')
        this.nuevaRevision = 'A'
        this.revisionEstado = 'Coordinación de Grupo'
      }
    },
    cerrarFormulario: function () {
      this.verFormulario = false
      this.tipo = 0
      this.idBitacora = 0
      this.esNuevaEmision = false
      this.tableroEst++
    },
    async obtenerTipoMinutas () {
      try {
        const response = await axios.get(this.apiUrl + '/tipo_minutas', { headers: Auth.authHeader() })
        this.$store.commit('setTipoMinutas', response.data)
      } catch {
        console.log('No se han obtenido los tipos de minutas')
      }
    },
    async obtenerEstudiante () {
      try {
        const response = await axios.get(this.apiUrl + '/estudiantes/' + this.usuario.id, { headers: Auth.authHeader() })
        this.$store.commit('setEstudiante', response.data)
        this.obtenerGrupo()
      } catch {
        console.log('No se ha obtenido la infomración del estudiante')
      }
    },
    async obtenerGrupo () {
      try {
        const response = await axios.get(this.apiUrl + '/grupos/' + this.estudiante.grupo_id, { headers: Auth.authHeader() })
        this.$store.commit('setGrupo', response.data)
      } catch {
        console.log('No se ha obtenido la información del grupo')
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
    async obtenerMotivos () {
      try {
        const response = await axios.get(this.apiUrl + '/motivos', { headers: Auth.authHeader() })
        this.$store.commit('setMotivos', response.data)
      } catch {
        console.log('No fue posible obtener los motivos de emisión')
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
    async verificarChat () {
      try {
        const response = await axios.get(this.apiUrl + '/chats/' + this.estudiante.grupo_id, { headers: Auth.authHeader() })
        const chat = response.data
        if (chat.length === 0) {
          const nuevoChat = {
            grupo_id: this.estudiante.grupo_id
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
    cambiarTab: function () {
      this.verEmision = false
    },
    establecerBitacora: function (id) {
      this.idBitacora = id
      this.verFormulario = true
      this.verEmision = false
    },
    establecerRevision: function (id) {
      this.idRevision = id
      this.verRevision = true
      this.crearMinuta = false
      this.verEmision = false
    },
    mostrarTablero: function () {
      this.verRevision = false
      this.verComentarios = false
      this.verRespuestas = false
      this.crearMinuta = true
      this.idRevision = 0
      this.idEmision = 0
      this.verEmision = false
      this.valorActual = 0
      this.tableroEst++
    },
    refrescarPagina: function () {
      location.reload()
    },
    revisarComentarios: function (id) {
      this.idComentarios = id
      this.verComentarios = true
      this.crearMinuta = false
    },
    revisarRespuestas: function (id) {
      this.idRespuestas = id
      this.verRespuestas = true
      this.crearMinuta = false
      this.verEmision = false
    },
    nuevaVersion: function (id) {
      this.idEmision = id
      this.verEmision = true
    },
    revisarAprobacion: function () {
      this.crearMinuta = false
      this.valorActual = 0
    },
    buscarIdMotivo: function (valor) {
      return Funciones.obtenerIdDeLista(this.motivos, 'identificador', valor)
    },
    buscarIdTipoMinuta: function (valor) {
      return Funciones.obtenerIdDeLista(this.tipoMinutas, 'tipo', valor)
    },
    transformarPregunta: function (valor) {
      return Funciones.stringToHTML(valor)
    },
    removerDeArray: function (arr, valor) {
      return Funciones.removeFromArray(arr, valor)
    },
    nuevaEmision: function (identificador, revision) {
      this.verRevision = false
      this.verComentarios = false
      this.verEmision = false
      this.crearMinuta = true
      this.verFormulario = true
      this.idRevision = 0
      this.idMotivo = this.buscarIdMotivo(identificador)
      this.revisionesPorEstados(identificador)
      this.nuevaRevision = revision
      this.idBitacora = this.idEmision
      this.esNuevaEmision = true
      this.valorActual = 0
      this.tableroEst++
    },
    cerrarSemanal: function () {
      this.bitacoraAvance = {}
      this.verSemanal = false
      this.mostrarTablero()
    },
    editarAvance: function (bitacora) {
      this.bitacoraAvance = bitacora
      this.verSemanal = true
      this.seleccionarMinuta = false
    },
    revisarAvance: function (bitacora) {
      this.bitacoraAvance = bitacora
      this.revisarSemanal = true
      this.crearMinuta = false
    },
    cerrarAvance: function () {
      this.revisarSemanal = false
      this.mostrarTablero()
    },
    mostrarMinuta: function (id) {
      this.idVerMinuta = id
      this.verMinuta = true
      this.crearMinuta = false
    },
    cerrarMinuta: function () {
      this.verMinuta = false
      this.idVerMinuta = 0
      this.mostrarTablero()
    },
    abrirChat: function () {
      if (this.verChatGrupal === false) {
        this.verChatGrupal = true
        this.seleccionarMinuta = false
      } else {
        this.verChatGrupal = false
      }
    },
    revisionesPorEstados: function (identificador) {
      this.revisionEstado = Funciones.convertirRevisionAEstado(identificador)
    },
    modificarModal: function () {
      if (!this.help) {
        this.help = true
      } else {
        this.help = false
      }
      this.faqs_open = []
    },
    modificarArray: function (element) {
      this.faqs_open.push(element)
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerTipoMinutas()
      this.obtenerEstudiante()
      this.obtenerAprobaciones()
      this.obtenerMotivos()
      this.obtenerFaqs()
    }
    console.log('re-render')
  }
}
</script>

<style lang="css" scoped>
.new-section {
  padding: 1rem 1.5rem;
}

</style>
