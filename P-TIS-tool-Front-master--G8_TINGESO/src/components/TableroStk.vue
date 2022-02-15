<template>
  <div>

    <div v-if="mostrarTablero">

      <div class="tabs is-centered is-toggle is-toggle-rounded">
        <ul>
          <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.revision }">
            <a @click="elegirTab(nombreTabs.revision)">
              <span>Para revisión</span>
            </a>
          </li>
          <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.comentadas }">
            <a @click="elegirTab(nombreTabs.comentadas)">
              <span>Comentadas</span>
            </a>
          </li>
          <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.respondidas }">
            <a @click="elegirTab(nombreTabs.respondidas)">
              <span>Respondidas</span>
            </a>
          </li>
          <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.cerradas }">
            <a @click="elegirTab(nombreTabs.cerradas)">
              <span>Cerradas</span>
            </a>
          </li>
        </ul>
      </div>

      <div v-if="nombreTab === nombreTabs.revision">
        <section class="new-section">
          <div class="container">
            <p id="revision" class="title is-5">Para revisar</p>
            <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarRevision" aria-describedby="revision">
              <thead>
                <tr class="has-background-light">
                  <th scope="col" class="has-text-centered">N°</th>
                  <th scope="col" class="has-text-centered">Código</th>
                  <th scope="col" class="has-text-centered">Revisión</th>
                  <th scope="col" class="has-text-centered">Realizada por</th>
                  <th scope="col" class="has-text-centered">Emitida el</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bitacora, index) in listaRevision" :key="bitacora.id">
                  <th scope="row" class="has-text-centered">{{ index + 1}}</th>
                  <td><a @click="revisarMinuta(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision}}</a></td>
                  <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                  <td class="has-text-centered">{{ bitacora.minuta.creada_por}}</td>
                  <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <br>
              <p class="subtitle is-5">En esta sección se muestran las minutas emitidas por los estudiantes para su revisión.</p>
              <p class="subtitle is-5">Actualmente no hay minutas para revisar.</p>
            </div>
          </div>
        </section>
      </div>

      <div v-if="nombreTab === nombreTabs.comentadas">
        <section class="new-section">
          <div class="container">
            <p id="comentadas" class="title is-5">Comentadas</p>
            <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarComentadas" aria-describedby="comentadas">
              <thead>
                <tr class="has-background-light">
                  <th scope="col" class="has-text-centered">N°</th>
                  <th scope="col" class="has-text-centered">Código</th>
                  <th scope="col" class="has-text-centered">Revisión</th>
                  <th scope="col" class="has-text-centered">Realizada por</th>
                  <th scope="col" class="has-text-centered">Emitida el</th>
                  <th scope="col" class="has-text-centered">Comentada el</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bitacora, index) in listaComentadas" :key="bitacora.id">
                  <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
                  <td>{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</td>
                  <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                  <td class="has-text-centered">{{ bitacora.minuta.creada_por}}</td>
                  <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                  <td class="has-text-centered">{{ convertirFecha(bitacora.estado.inicia_el) }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <br>
              <p class="subtitle is-5">En esta sección se muestran las minutas comentadas por usted.</p>
              <p class="subtitle is-5">Actualmente no hay minutas para mostrar.</p>
            </div>
          </div>
        </section>
      </div>

      <div v-if="nombreTab === nombreTabs.respondidas">
        <section class="new-section">
          <div class="container">
            <p id="respondidas" class="title is-5">Respondidas por los estudiantes</p>
            <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarRespondidasGrupo" aria-describedby="respondidas">
              <thead>
                <tr class="has-background-light">
                  <th scope="col" class="has-text-centered">N°</th>
                  <th scope="col" class="has-text-centered">Código</th>
                  <th scope="col" class="has-text-centered">Revision</th>
                  <th scope="col" class="has-text-centered">Realizada por</th>
                  <th scope="col" class="has-text-centered">Emitida el</th>
                  <th scope="col" class="has-text-centered">Respondida el</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bitacora, index) in listaRespondidasGrupo" :key="bitacora.id">
                  <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
                  <td><a @click="revisarRespuestas(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                  <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                  <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                  <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                  <td class="has-text-centered">{{ convertirFecha(bitacora.estado.inicia_el) }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <p class="subtitle is-5">En esta sección se presentan las minutas comentadas por usted cuyos comentarios fueron respondidos por los estudiantes.</p>
              <p class="subtitle is-5">Actualmente no hay minutas de esta sección para mostrar.</p>
            </div>
          </div>
        </section>
      </div>

      <div v-if="nombreTab === nombreTabs.cerradas">
        <section class="new-section">
          <div class="container">
            <p id="cerradas" class="title is-5">Minutas cerradas</p>
            <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarCerradas" aria-describedby="cerradas">
              <thead>
                <tr class="has-background-light">
                  <th scope="col" class="has-text-centered">N°</th>
                  <th scope="col" class="has-text-centered">Código</th>
                  <th scope="col" class="has-text-centered">Revisión</th>
                  <th scope="col" class="has-text-centered">Realizada por</th>
                  <th scope="col" class="has-text-centered">Emitida el</th>
                  <th scope="col" class="has-text-centered">Cerrada el</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bitacora, index) in listaCerradas" :key="bitacora.id">
                  <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
                  <td><a @click="verMinuta(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                  <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                  <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                  <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                  <td class="has-text-centered">{{ convertirFecha(bitacora.estado.inicia_el) }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <br>
              <p class="subtitle is-5">En esta sección se presentan las minutas que han concluido su revisión.</p>
              <p class="subtitle is-5">Actualmente no hay minutas de esta sección para mostrar</p>
            </div>
          </div>
        </section>
      </div>

    </div>

    <div v-else>
      <p class="subtitle is-4 has-text-centered">No ha seleccionado grupo para mostrar</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import { mapState } from 'vuex'

const nombreTabs = {
  revision: 'Revision',
  comentadas: 'Comentadas',
  respondidas: 'Respondidas',
  cerradas: 'Cerradas'
}

export default {
  name: 'TableroStk',
  props: ['contador', 'tarjeta'],
  data () {
    return {
      nombreTab: this.tarjeta,
      listaMinutas: [],
      listaRevision: [],
      listaComentadas: [],
      listaRespondidasGrupo: [],
      listaRespondidasCliente: [],
      listaCerradas: [],
      nombreTabs,
      contar: this.contador,
      mostrarTablero: true
    }
  },
  computed: {
    ...mapState(['apiUrl', 'stakeholder', 'grupo', 'jornadaActual']),

    mostrarRevision: function () {
      return this.listaRevision.length > 0
    },
    mostrarComentadas: function () {
      return this.listaComentadas.length > 0
    },
    mostrarRespondidasGrupo: function () {
      return this.listaRespondidasGrupo.length > 0
    },
    mostrarRespondidasCliente: function () {
      return this.listaRespondidasCliente.length > 0
    },
    mostrarCerradas: function () {
      return this.listaCerradas.length > 0
    }
  },
  methods: {
    elegirTab: function (nombreTab) {
      this.nombreTab = nombreTab
    },
    convertirFecha: function (timestamp) {
      if (timestamp === null || timestamp === undefined) {
        return ''
      } else {
        return Funciones.obtenerFecha(timestamp)
      }
    },
    categorizarMinutas: function () {
      if (this.listaMinutas.length > 0) {
        this.listaRevision = []
        this.listaComentadas = []
        this.listaRepondidiasGrupo = []
        this.listaRepondidiasCliente = []
        this.listaCerradas = []
        for (var i = 0; i < this.listaMinutas.length; i++) {
          if (this.listaMinutas[i].estado.abreviacion === 'EMI') {
            this.listaRevision.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'CSK') {
            this.listaComentadas.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'RIG') {
            this.listaRespondidasGrupo.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'RSK') {
            this.listaRespondidasCliente.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'CER') {
            this.listaCerradas.push(this.listaMinutas[i])
          }
        }
      }
    },
    reiniciarTablero: function () {
      this.listaRevision = []
      this.listaComentadas = []
      this.listaRespondidasGrupo = []
      this.listaRespondidasCliente = []
      this.listaCerradas = []
    },
    async obtenerMinutas () {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/revision/cliente/' + this.grupo.id, { headers: Auth.authHeader() })
        this.listaMinutas = response.data
        this.categorizarMinutas()
      } catch {
        console.log('No se han obtenido las minutas a mostrar')
      }
    },
    revisarMinuta: function (id) {
      this.$emit('revision', id)
    },
    revisarRespuestas: function (id) {
      this.$emit('respuestas', id)
    },
    revisionEstado: function (identificador) {
      return Funciones.convertirRevisionAEstado(identificador)
    },
    verMinuta: function (id) {
      this.$emit('ver-minuta', id)
    }
  },
  watch: {
    contar: function () {
      this.reiniciarTablero()
      this.obtenerMinutas()
      this.mostrarTablero = true
    },
    grupo: function () {
      this.reiniciarTablero()
      this.obtenerMinutas()
      this.mostrarTablero = true
    },
    jornadaActual: function () {
      this.mostrarTablero = false
      this.reiniciarTablero()
    },
    stakeholder: function () {
      if (this.stakeholder.grupos.length > 1) {
        this.mostrarTablero = false
      }
    }
  },
  mounted () {
    if (Object.keys(this.grupo).length > 0 && localStorage.user_tk) {
      this.obtenerMinutas()
    }
  }
}
</script>

<style lang="css" scoped>
.new-section {
  padding: 1rem 1.5rem;
}
</style>
