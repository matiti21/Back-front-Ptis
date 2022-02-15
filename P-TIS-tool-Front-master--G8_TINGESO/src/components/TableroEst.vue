<template>
  <div>

    <div class="tabs is-centered is-toggle is-toggle-rounded">
      <ul>
        <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.borradores}">
          <a @click="elegirTab(nombreTabs.borradores)">
            <span>Borradores</span>
          </a>
        </li>
        <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.emitidas}">
          <a @click="elegirTab(nombreTabs.emitidas)">
            <span>Emitidas</span>
          </a>
        </li>
        <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.revision}">
          <a @click="elegirTab(nombreTabs.revision)">
            <span>Para revisar</span>
          </a>
        </li>
        <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.comentadas}">
          <a @click="elegirTab(nombreTabs.comentadas)">
            <span>Comentadas</span>
          </a>
        </li>
        <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.respondidas}">
          <a @click="elegirTab(nombreTabs.respondidas)">
            <span>Respondidas</span>
          </a>
        </li>
        <li :class="{ 'is-active-usach' : nombreTab === nombreTabs.cerradas}">
          <a @click="elegirTab(nombreTabs.cerradas)">
            <span>Cerradas</span>
          </a>
        </li>
      </ul>
    </div>

    <div v-if="nombreTab === nombreTabs.borradores">
      <section class="new-section">
        <div class="container">
          <p id="borradores" class="title is-5">Borradores</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarBorradores" aria-describedby="borradores">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Tipo de minuta</th>
                <th class="has-text-centered" scope="col">Fase de revisión</th>
                <th class="has-text-centered" scope="col">Realizado por</th>
                <th class="has-text-centered" scope="col">Iniciada el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in listaBorradores" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1 }}</th>
                <td><a @click="editarBorrador(bitacora.id)">{{ bitacora.minuta.codigo}}_{{ bitacora.revision }}</a></td>
                <td class="has-text-centered">{{ actualizarTipo(bitacora.minuta.tipo_minuta) }}</td>
                <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.minuta.creada_el) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas que has guardado como borradores antes de ser emitidas.</p>
            <p class="subtitle is-5">En este momento no hay borradores para mostrar.</p>
          </div>
        </div>
      </section>
      <hr>
      <section class="new-section">
        <div class="container">
          <p id="avances" class="title is-5">Borradores avances semanales</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarBorrAvances" aria-describedby="avances">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Sprint</th>
                <th class="has-text-centered" scope="col">Iniciada el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in borradoresAvances" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1 }}</th>
                <td><a @click="editarAvance(bitacora)">{{ bitacora.minuta.codigo }}</a></td>
                <td class="has-text-centered">{{ bitacora.minuta.numero_sprint }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.minuta.creada_el) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas de avance semanal que aún no han sido llenadas por todos los integrantes del grupo y aún no han sido emitidas.</p>
            <p class="subtitle is-5">En este momento no hay borradores de avance semanal para mostrar.</p>
          </div>
        </div>
      </section>
    </div>

    <div v-if="nombreTab === nombreTabs.emitidas">
      <section class="new-section">
        <div class="container">
          <p id="emitidas" class="title is-5">Emitidas</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarEmitidas" aria-describedby="emitidas">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Tipo de minuta</th>
                <th class="has-text-centered" scope="col">Fase de revisión</th>
                <th class="has-text-centered" scope="col">Realizada por</th>
                <th class="has-text-centered" scope="col">Emitida el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in listaEmitidas" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1 }}</th>
                <td><a @click="verMinuta(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                <td class="has-text-centered">{{ actualizarTipo(bitacora.minuta.tipo_minuta) }}</td>
                <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas de reunión que has emitido y que se encuentran en revisión.</p>
            <p class="subtitle is-5">En este momento no hay minutas emitidas para mostrar.</p>
          </div>
        </div>
      </section>
    </div>

    <div v-if="nombreTab === nombreTabs.comentadas">
      <section class="new-section">
        <div class="container">
          <p id="comentadas" class="title is-5">Comentadas por integrantes del grupo</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarComentadasGrupo" aria-describedby="comentadas">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Tipo de minuta</th>
                <th class="has-text-centered" scope="col">Fase de revisión</th>
                <th class="has-text-centered" scope="col">Realizada por</th>
                <th class="has-text-centered" scope="col">Emitida el</th>
                <th class="has-text-centered" scope="col">Comentada el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in listaComentadasGrupo" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1 }}</th>
                <td><a @click="revisarComentarios(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                <td class="has-text-centered">{{ actualizarTipo(bitacora.minuta.tipo_minuta) }}</td>
                <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.estado.inicia_el )}}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas que te han comentado los integrantes de tu grupo.</p>
            <p class="subtitle is-5">Ahora no hay minutas comentadas para mostrar.</p>
          </div>
        </div>
      </section>
      <hr>
      <section class="new-section">
        <div class="container">
          <p id="cliente" class="title is-5">Comentadas por el Cliente</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarComentadasCliente" aria-describedby="cliente">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Tipo de minuta</th>
                <th class="has-text-centered" scope="col">Fase de revisión</th>
                <th class="has-text-centered" scope="col">Realizada por</th>
                <th class="has-text-centered" scope="col">Emitida el</th>
                <th class="has-text-centered" scope="col">Comentada el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in listaComentadasCliente" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1 }}</th>
                <td><a @click="revisarComentarios(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                <td class="has-text-centered">{{ actualizarTipo(bitacora.minuta.tipo_minuta) }}</td>
                <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.estado.inicia_el) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas que ha comentado el cliente.</p>
            <p class="subtitle is-5">Ahora no hay minutas comentadas para mostrar.</p>
          </div>
        </div>
      </section>
      <hr>
      <section class="new-section">
        <div class="container">
          <p id="cliente" class="title is-5">Comentadas por el Profesor</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarComAvances" aria-describedby="cliente">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Sprint</th>
                <th class="has-text-centered" scope="col">Iniciada el</th>
                <th class="has-text-centered" scope="col">Emitida el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in comentadasAvances" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1}}</th>
                <td><a @click="revisarAvance(bitacora)">{{ bitacora.minuta.codigo }}</a></td>
                <td class="has-text-centered">{{ bitacora.minuta.numero_sprint }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.minuta.creada_el)}}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision )}}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas semanales que han sido comentadas con observaciones de parte del Profesor</p>
            <p class="subtitle is-5">Ahora no hay minutas de avance comentadas para mostrar.</p>
          </div>
        </div>
      </section>
    </div>

    <div v-if="nombreTab === nombreTabs.respondidas">
      <section class="new-section">
        <div class="container">
          <p id="respondidas" class="title is-5">Respondidas por integrantes del grupo</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarRespondidasGrupo" aria-describedby="respondidas">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Tipo de minuta</th>
                <th class="has-text-centered" scope="col">Fase de revisión</th>
                <th class="has-text-centered" scope="col">Realizada por</th>
                <th class="has-text-centered" scope="col">Emitida el</th>
                <th class="has-text-centered" scope="col">Respondida el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in listaRespondidasGrupo" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1 }}</th>
                <td><a @click="revisarRespuestas(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                <td class="has-text-centered">{{ actualizarTipo(bitacora.minuta.tipo_minuta) }}</td>
                <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.estado.inicia_el) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas comentadas por ti y que fueron respondidas por tus compañeros de grupo.</p>
            <p class="subtitle is-5">En estos momentos no hay minutas respondidas para mostrar.</p>
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
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Tipo de minuta</th>
                <th class="has-text-centered" scope="col">Fase de revisión</th>
                <th class="has-text-centered" scope="col">Realizada por</th>
                <th class="has-text-centered" scope="col">Emitida el</th>
                <th class="has-text-centered" scope="col">Cerrada el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in listaCerradas" :key="bitacora.id">
                <th class="has-text-centered" scope="row" :class="{ 'is-selected-usach' : minutaActual === bitacora.id }">{{ index + 1 }}</th>
                <td :class="{ 'is-selected-usach' : minutaActual === bitacora.id }" @click="nuevaEmision(bitacora.id)"><a>{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                <td class="has-text-centered" :class="{ 'is-selected-usach' : minutaActual === bitacora.id }" @click="nuevaEmision(bitacora.id)">{{ actualizarTipo(bitacora.minuta.tipo_minuta) }}</td>
                <td class="has-text-centered" :class="{ 'is-selected-usach' : minutaActual === bitacora.id }" @click="nuevaEmision(bitacora.id)">{{ revisionEstado(bitacora.identificador) }}</td>
                <td class="has-text-centered" :class="{ 'is-selected-usach' : minutaActual === bitacora.id }" @click="nuevaEmision(bitacora.id)">{{ bitacora.minuta.creada_por }}</td>
                <td class="has-text-centered" :class="{ 'is-selected-usach' : minutaActual === bitacora.id }" @click="nuevaEmision(bitacora.id)">{{ convertirFecha(bitacora.fecha_emision) }}</td>
                <td class="has-text-centered" :class="{ 'is-selected-usach' : minutaActual === bitacora.id }" @click="nuevaEmision(bitacora.id)">{{ convertirFecha(bitacora.estado.inicia_el )}}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas de reunión creadas por ti y que ya han sido revisadas por tus compañeros de grupo y/o por el cliente.</p>
            <p class="subtitle is-5">Por ahora no hay minutas cerradas a mostrar.</p>
          </div>
        </div>
      </section>
      <hr>
      <section class="new-section">
        <div class="container">
          <p id="semanales" class="title is-5">Avances semanales cerrados</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarCerrAvances">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Sprint</th>
                <th class="has-text-centered" scope="col">Iniciada el</th>
                <th class="has-text-centered" scope="col">Emitida el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in cerradasAvances" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1}}</th>
                <td><a @click="revisarAvance(bitacora)">{{ bitacora.minuta.codigo }}</a></td>
                <td class="has-text-centered">{{ bitacora.minuta.numero_sprint }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.minuta.creada_el)}}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.fecha_emision )}}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">Aquí se presentan las minutas de avance semanal que han sido emitidas por tu grupo.</p>
            <p class="subtitle is-5">En estos momentos no hay minutas de avance semanal para mostrar.</p>
          </div>
        </div>
      </section>
    </div>

    <div v-if="nombreTab === nombreTabs.revision">
      <section class="new-section">
        <div class="container">
          <p id="revisar" class="title is-5">Minutas para revisar</p>
          <table class="table is-fullwidth is-bordered is-narrow" v-if="mostrarRevision" aria-describedby="revisar">
            <thead>
              <tr class="has-background-light">
                <th class="has-text-centered" scope="col">N°</th>
                <th class="has-text-centered" scope="col">Código</th>
                <th class="has-text-centered" scope="col">Tipo de minuta</th>
                <th class="has-text-centered" scope="col">Fase de revisión</th>
                <th class="has-text-centered" scope="col">Creada por</th>
                <th class="has-text-centered" scope="col">Creada el</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bitacora, index) in listaRevision" :key="bitacora.id">
                <th class="has-text-centered" scope="row">{{ index + 1 }}</th>
                <td><a @click="revisarMinuta(bitacora.id)">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</a></td>
                <td class="has-text-centered">{{ actualizarTipo(bitacora.minuta.tipo_minuta) }}</td>
                <td class="has-text-centered">{{ revisionEstado(bitacora.identificador) }}</td>
                <td class="has-text-centered">{{ bitacora.minuta.creada_por }}</td>
                <td class="has-text-centered">{{ convertirFecha(bitacora.minuta.creada_el) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p class="subtitle is-5">En esta sección se presentan las minutas de reunión emitidas por tus compañeros de grupo para tu revisión.</p>
            <p class="subtitle is-5">Actualmente no hay minutas pendientes que revisar.</p>
          </div>
        </div>
      </section>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import { mapState } from 'vuex'

const nombreTabs = {
  borradores: 'Borradores',
  emitidas: 'Emitidas',
  revision: 'Revision',
  comentadas: 'Comentadas',
  respondidas: 'Respondidas',
  cerradas: 'Cerradas'
}

export default {
  name: 'TableroEst',
  props: ['seleccionado', 'contador'],
  data () {
    return {
      nombreTab: 'Borradores',
      nombreTabs,
      listaMinutas: [],
      listaBorradores: [],
      listaComentadasGrupo: [],
      listaComentadasCliente: [],
      listaRespondidasGrupo: [],
      listaCerradas: [],
      listaEmitidas: [],
      listaRevision: [],
      listaAvances: [],
      borradoresAvances: [],
      cerradasAvances: [],
      comentadasAvances: [],
      contar: this.contador,
      minutaActual: this.seleccionado
    }
  },
  computed: {
    ...mapState(['apiUrl', 'grupo']),

    mostrarBorradores: function () {
      return this.listaBorradores.length > 0
    },
    mostrarEmitidas: function () {
      return this.listaEmitidas.length > 0
    },
    mostrarCerradas: function () {
      return this.listaCerradas.length > 0
    },
    mostrarComentadasGrupo: function () {
      return this.listaComentadasGrupo.length > 0
    },
    mostrarComentadasCliente: function () {
      return this.listaComentadasCliente.length > 0
    },
    mostrarRespondidasGrupo: function () {
      return this.listaRespondidasGrupo.length > 0
    },
    mostrarRevision: function () {
      return this.listaRevision.length > 0
    },
    mostrarBorrAvances: function () {
      return this.borradoresAvances.length > 0
    },
    mostrarCerrAvances: function () {
      return this.cerradasAvances.length > 0
    },
    mostrarComAvances: function () {
      return this.comentadasAvances.length > 0
    }
  },
  methods: {
    elegirTab: function (nombreTab) {
      this.nombreTab = nombreTab
      this.minutaActual = 0
      this.$emit('cambiar')
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
        this.listaBorradores = []
        this.listaComentadasGrupo = []
        this.listaComentadasCliente = []
        this.listaCerradas = []
        this.listaEmitidas = []
        for (var i = 0; i < this.listaMinutas.length; i++) {
          if (this.listaMinutas[i].estado.abreviacion === 'BOR') {
            this.listaBorradores.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'CIG') {
            this.listaComentadasGrupo.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'CSK') {
            this.listaComentadasCliente.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'CER') {
            this.listaCerradas.push(this.listaMinutas[i])
          } else if (this.listaMinutas[i].estado.abreviacion === 'EMI') {
            this.listaEmitidas.push(this.listaMinutas[i])
          }
        }
      }
    },
    categorizarAvances: function () {
      if (this.listaAvances.length > 0) {
        this.borradoresAvances = []
        this.cerradasAvances = []
        for (var i = 0; i < this.listaAvances.length; i++) {
          if (this.listaAvances[i].minuta.bitacora_estado.tipo_estado.abreviacion === 'BOR') {
            this.borradoresAvances.push(this.listaAvances[i])
          } else if (this.listaAvances[i].minuta.bitacora_estado.tipo_estado.abreviacion === 'CER') {
            this.cerradasAvances.push(this.listaAvances[i])
          } else if (this.listaAvances[i].minuta.bitacora_estado.tipo_estado.abreviacion === 'CPF') {
            this.comentadasAvances.push(this.listaAvances[i])
          }
        }
      }
    },
    async obtenerMinutas () {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/revision/estados', { headers: Auth.authHeader() })
        this.listaMinutas = response.data
        this.categorizarMinutas()
      } catch (e) {
        console.log('No se han obtenido las minutas a mostrar')
        console.log(e)
      }
    },
    async obtenerParaRevisar () {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/revision/grupo', { headers: Auth.authHeader() })
        this.listaRevision = response.data
      } catch (e) {
        console.log('No se han podido obtener las minutas a revisar')
        console.log(e)
      }
    },
    async obtenerRespondidas () {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/revision/respondidas', { headers: Auth.authHeader() })
        this.listaRespondidasGrupo = response.data
      } catch (e) {
        console.log('No se ha podido obtener las minutas respondidas')
        console.log(e)
      }
    },
    async obtenerAvances () {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/avances/semanales/grupo/' + await this.grupo.id, { headers: Auth.authHeader() })
        this.listaAvances = response.data
        this.categorizarAvances()
      } catch (e) {
        console.log('No se han obtenido las minutas de avance semanal')
        console.log(e)
      }
    },
    editarBorrador: function (id) {
      this.$emit('bitacora', id)
    },
    revisarMinuta: function (id) {
      this.$emit('revision', id)
    },
    revisarComentarios: function (id) {
      this.$emit('comentarios', id)
    },
    revisarRespuestas: function (id) {
      this.$emit('respuestas', id)
    },
    nuevaEmision: function (id) {
      this.minutaActual = id
      this.$emit('emitir', id)
    },
    editarAvance: function (bitacora) {
      this.$emit('avance', bitacora)
    },
    revisarAvance: function (bitacora) {
      this.$emit('revisar-avance', bitacora)
    },
    verMinuta: function (id) {
      this.$emit('ver-minuta', id)
    },
    revisionEstado: function (identificador) {
      return Funciones.convertirRevisionAEstado(identificador)
    },
    actualizarTipo: function (tipo) {
      return Funciones.actualizarTipo(tipo)
    }
  },
  watch: {
    contar: function () {
      this.obtenerMinutas()
      this.obtenerParaRevisar()
      this.obtenerRespondidas()
      this.obtenerAvances()
    },
    grupo: function () {
      this.obtenerAvances()
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerMinutas()
      this.obtenerParaRevisar()
      this.obtenerRespondidas()
      if (Object.keys(this.grupo).length > 0) {
        this.obtenerAvances()
      }
    }
  }
}
</script>

<style lang="css" scoped>
.new-section {
  padding: 1rem 1.5rem;
}
</style>
