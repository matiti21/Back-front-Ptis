<template >
  <div>
    <div class="modal animate__animated animate__fadeIn" :class="help ? 'is-active': ''" >
      <div class="modal-background" @click="modificarModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title title is-4">Revisión de minutas con clientes</p>
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

    <div v-if="!mostrarFormulario">
      <div class="columns">
        <div class="column is-8"></div>
        <div class="column is-4">
          <div class="control">
            <div class="field is-grouped is-grouped-right">
              <p class="control">
                <a v-if="!mostrarMinutas" class="button is-light-usach" @click="modificarModal" >Ayuda</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <SelectorJornada/>

      <SelectorGrupo @eleccion="seleccionarGrupo"/>

      <div v-if="mostrarMinutas">
        <br>
        <div class="columns">
          <div class="column is-10 is-offset-1">
            <div v-if="listaMinutas.length > 0">
              <div class="field">
                <div class="control">
                  <label id="minutas" class="label">Minutas</label>
                </div>
              </div>
              <div >
                <table class="table is-bordered is-fullwidth is-narrow" aria-describedby="minutas">
                  <thead>
                    <tr class="has-background-light">
                      <th scope="col" class="has-text-centered">N°</th>
                      <th scope="col" class="has-text-centered">Código minuta</th>
                      <th scope="col" class="has-text-centered">Tipo de minuta</th>
                      <th scope="col" class="has-text-centered">Fase de revisión</th>
                      <th scope="col" class="has-text-centered">Creada por</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(bitacora, index) in listaMinutas" :key="bitacora.id">
                      <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
                      <td><a @click="traerMinuta(bitacora.id_rev[0][0], bitacora.id_rev)">{{ bitacora.minuta.codigo }}</a></td>
                      <td class="has-text-centered">{{ actualizarTipo(bitacora.minuta.tipo) }}</td>
                      <td class="has-text-centered">{{ convertirRevision(bitacora.identificador) }}</td>
                      <td class="has-text-centered">{{ bitacora.minuta.creada_por[0] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else>
              <br>
              <p class="subtitle is-5">No hay minutas emitidas para revisar</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else>
      <div class=" columns">
        <div class="column is-4 is-offset-8">
          <div class="box">
            <div v-if="mostrarVersiones">
              <div class="columns">
                <div class="column">
                  <label id="estudiantes" class="label">Lista de versiones</label>
                </div>
                <div class="column">
                    <div class="select">
                      <select class="is-hovered" v-model="versionSeleccionada">
                        <option v-for="version in versiones" :key="version" :value="version"> Versión {{ version[1] }}</option>
                      </select>
                    </div>
                </div>
                <div class="column">
                  <button class="button is-info-usach" @click="cambiarMinuta">Ver</button>
                </div>
              </div>
              <div v-if="cambiarMinutaEstado === 0">
                <strong>Usted está en la versión {{ versiones[0][1] }}</strong>
              </div>
              <div v-else>
                <strong>Usted está en la versión {{ verVersion }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Informacion :grupo="grupoSeleccionado" :bitacora="bitacora" :key="cambiarMinutaEstado"/>
      <Objetivos :listaObjetivos="bitacora.minuta.objetivos" :key="cambiarMinutaEstado"/>
      <Conclusiones :listaConclusiones="bitacora.minuta.conclusiones" :key="cambiarMinutaEstado"/>
      <Items :listaItems="bitacora.minuta.items" :asistencia="bitacora.minuta.asistencia" :comentarios="false" :respuestas="false" :comentariosMinuta="[]" :verRespuestas="false" :key="cambiarMinutaEstado"/>

      <br>
      <div class="columns">
        <div class="column is-4 is-offset-2">
          <div class="field">
            <div class="control">
              <a class="button is-primary-usach is-fullwidth" @click="cerrarFormulario">Volver</a>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="field">
            <div class="control">
              <a class="button is-dark is-fullwidth" @click="verRegistros">Ver registro</a>
            </div>
          </div>
        </div>
      </div>

      <br>
      <div v-if="mostrarRegistros">
        <Registros :id-bitacora="bitacora.id" @cerrar="cerrarRegistros"/>
      </div>

    </div>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import axios from 'axios'
import { mapState } from 'vuex'

import SelectorJornada from '@/components/SelectorJornada.vue'
import SelectorGrupo from '@/components/SelectorGrupo.vue'
import Informacion from '@/components/minutas/RevisionProfesor/Informacion.vue'
import Objetivos from '@/components/minutas/RevisionProfesor/Objetivos.vue'
import Conclusiones from '@/components/minutas/RevisionProfesor/Conclusiones.vue'
import Items from '@/components/minutas/RevisionProfesor/Items.vue'
import Registros from '@/components/RegistroMinuta.vue'

export default {
  name: 'RevisionMinutas',
  components: {
    SelectorJornada,
    SelectorGrupo,
    Informacion,
    Objetivos,
    Conclusiones,
    Items,
    Registros
  },
  data () {
    return {
      help: false,
      mostrarFormulario: false,
      mostrarMinutas: false,
      mostrarRegistros: false,
      mostrarVersiones: false,
      verVersion: '',
      grupoSeleccionado: {},
      listaMinutas: [],
      bitacora: {},
      versiones: [],
      versionSeleccionada: [],
      cambiarMinutaEstado: 0,
      faqs_open: []
    }
  },
  computed: {
    ...mapState(['apiUrl', 'jornadaActual', 'faqsProfesor'])
  },
  methods: {
    seleccionarGrupo: function (grupo) {
      this.grupoSeleccionado = grupo
      this.obtenerMinutas(grupo.id)
      this.mostrarMinutas = true
    },
    cambiarMinuta: function () {
      this.traerMinuta(this.versionSeleccionada[0], this.versiones)
      this.verVersion = this.versionSeleccionada[1]
      this.cambiarMinutaEstado += 1
    },
    async obtenerMinutas (grupoId) {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/grupo/' + grupoId, { headers: Auth.authHeader() })
        this.listaMinutas = response.data
      } catch {
        console.log('No fue posible obtener las minutas')
      }
    },
    async obtenerAyuda () {
      try {
        const response = await axios.get(this.apiUrl + '/faqs/profesor/minutas', { headers: Auth.authHeader() })
        this.$store.commit('setFaqsProfesor', response.data)
      } catch {
        console.log('No fue posible obtener las faqs')
      }
    },
    async traerMinuta (bitacoraId, listaVersiones) {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/' + bitacoraId, { headers: Auth.authHeader() })
        this.bitacora = response.data
        this.versiones = listaVersiones
        this.mostrarFormulario = true
        this.mostrarVersiones = true
      } catch {
        console.log('No fue posible obtener la información de la minuta seleccionada')
      }
    },
    cerrarFormulario: function () {
      this.mostrarFormulario = false
      this.mostrarRegistros = false
    },
    verRegistros: function () {
      this.mostrarRegistros = true
    },
    cerrarRegistros: function () {
      this.mostrarRegistros = false
    },
    convertirRevision: function (identificador) {
      return Funciones.convertirRevisionAEstado(identificador)
    },
    actualizarTipo: function (tipo) {
      return Funciones.actualizarTipo(tipo)
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
      this.obtenerAyuda()
    }
  },
  watch: {
    jornadaActual: function () {
      this.mostrarMinutas = false
    }
  }
}

</script>
