<template>
  <div>

    <br>
    <InfoAvance :grupo="grupoSeleccionado" :minuta="bitacora"/>
    <br>

    <div v-for="estudiante in grupoSeleccionado.estudiantes" :key="estudiante.id" >

    <br>
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <p class="title is-5 has-text-centered">Avance de {{ nombreCompleto(estudiante.usuario) }} - ({{ estudiante.iniciales }})</p>
      </div>
      <div class="column is-2"></div>
    </div>

    <div class="columns is-centered">
      <div class="column is-10">
        <p class="title is-6 has-text-left">Impedimentos:</p>
        <div class="content has-text-left">
          <ol type="1">
            <li v-for="(impedimento, index) in impedimentosPorEstudiante(estudiante.id)" :key="index">
              <p>{{ impedimento.descripcion }}</p>
              <div v-if="usuario.rol.rango !== '3' && comentariosProfesor.length === 0">
                <div v-if="!comentarioAbierto(index,estudiante.id,'impedimentos')">
                  <a @click="abrirComentario(index, impedimento.id, estudiante.id, 'impedimentos')">comentar</a>
                </div>
                <div v-else class="columns">
                  <div class="column is-12">
                    <div class="content has-text-left">
                      <div class="field is-grouped">
                        <p class="control is-expanded has-icons-right">
                          <input v-model="listaComentarios[encontrarIndice(index,estudiante.id,'impedimentos')].comentario" class="input is-normal" type="text">
                          <span class="icon is-right">
                            <button class="delete" @click="cerrarComentario(index,estudiante.id,'impedimentos')"></button>
                          </span>
                        </p>
                      </div>
                      <p v-if="this.listaEntradas[encontrarIndice(index,estudiante.id,'impedimentos')].error" class="is-danger help">{{ this.listaEntradas[encontrarIndice(index,estudiante.id,'impedimentos')].mensaje }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="buscarComentarioItem(impedimento.id)">
                <article class="message is-commentary">
                  <div class="message-header">
                    <p>Comentario del profesor</p>
                  </div>
                  <div class="message-body">
                    <p>{{ buscarComentarioItem(impedimento.id).comentario }}</p>
                  </div>
                </article>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-10">
        <p class="title is-6 has-text-left">Logros:</p>
        <div class="content has-text-left">
          <ol type="1">
            <li v-for="(logro, index) in logrosPorEstudiante(estudiante.id)" :key="index">
              <p>{{ logro.descripcion }}</p>
              <div v-if="usuario.rol.rango !== '3' && comentariosProfesor.length === 0">
                <div v-if="!comentarioAbierto(index,estudiante.id,'logros')">
                  <a @click="abrirComentario(index, logro.id, estudiante.id,'logros')">comentar</a>
                </div>
                <div v-else class="columns">
                  <div class="column is-12">
                    <div class="content has-text-left">
                      <div class="field is-grouped">
                        <p class="control is-expanded has-icons-right">
                          <input v-model="listaComentarios[encontrarIndice(index,estudiante.id,'logros')].comentario" class="input is-normal" type="text">
                          <span class="icon is-right">
                            <button class="delete" @click="cerrarComentario(index,estudiante.id,'logros')"></button>
                          </span>
                        </p>
                      </div>
                      <p v-if="this.listaEntradas[encontrarIndice(index,estudiante.id,'impedimentos')].error" class="is-danger help">{{ this.listaEntradas[encontrarIndice(index,estudiante.id,'impedimentos')].mensaje }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="buscarComentarioItem(logro.id)">
                <article class="message is-commentary">
                    <div class="message-header">
                      <p>Comentario del profesor</p>
                    </div>
                    <div class="message-body">
                      <p>{{ buscarComentarioItem(logro.id).comentario }}</p>
                    </div>
                  </article>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-10">
        <p class="title is-6 has-text-left">Metas:</p>
        <div class="content has-text-left">
          <ol type="1">
            <li v-for="(meta, index) in metasPorEstudiante(estudiante.id)" :key="index">
              <p>{{ meta.descripcion }}</p>
              <div v-if="usuario.rol.rango !== '3' && comentariosProfesor.length === 0">
                <div v-if="!comentarioAbierto(index,estudiante.id,'metas')">
                  <a @click="abrirComentario(index, meta.id,estudiante.id,'metas')">comentar</a>
                </div>
                <div v-else class="columns">
                <div class="column is-12">
                  <div class="content has-text-left">
                    <div class="field is-grouped">
                      <p class="control is-expanded has-icons-right">
                        <input v-model="listaComentarios[encontrarIndice(index,estudiante.id,'metas')].comentario" class="input is-normal" type="text" >
                        <span class="icon is-right">
                          <button class="delete" @click="cerrarComentario(index,estudiante.id,'metas')"></button>
                        </span>
                      </p>
                    </div>
                    <p v-if="this.listaEntradas[encontrarIndice(index,estudiante.id,'impedimentos')].error" class="is-danger help">{{ this.listaEntradas[encontrarIndice(index,estudiante.id,'impedimentos')].mensaje }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="buscarComentarioItem(meta.id)">
              <article class="message is-commentary">
                  <div class="message-header">
                    <p>Comentario del profesor</p>
                  </div>
                  <div class="message-body">
                    <p>{{ buscarComentarioItem(meta.id).comentario }}</p>
                  </div>
                </article>
            </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <br>

  </div>

  <div v-if="comented" class="columns">
    <div class="column is-half is-offset-3">
      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <a class="button is-primary-usach" @click="enviarComentarios">Enviar comentarios</a>
        </div>
        <div class="control">
          <a class="button is-light-usach" @click="cerrarRevision">Cancelar</a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="columns is-centered">
      <div class="column is-5">
        <div class="field">
          <div class="control">
            <button class="button is-primary-usach is-fullwidth" @click="cerrarRevision">Volver</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-for="estudiante in grupoSeleccionado.estudiantes" :key="estudiante.id">
      <VisorEstudiante :est="estudiante" :logros="logrosPorEstudiante(estudiante.id)" :metas="metasPorEstudiante(estudiante.id)" :impedimentos="impedimentosPorEstudiante(estudiante.id)" :listaCom ="comentariosPorEstudiante(estudiante.id)"/>
      <br>
    </div> -->

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import axios from 'axios'
import { mapState } from 'vuex'

import InfoAvance from '@/components/semanal/InfoAvance.vue'
// import VisorEstudiante from '@/components/semanal/VisorEstudiante.vue'

import Funciones from '@/services/funciones.js'

export default {
  name: 'RevisionSemanal',
  components: {
    InfoAvance
    // VisorEstudiante
  },
  props: ['grupo', 'minuta', 'usuario'],
  data () {
    return {
      grupoSeleccionado: this.grupo,
      comentada: false,
      bitacora: this.minuta,
      itemsLogros: [],
      itemsMetas: [],
      itemsImpedimentos: [],
      comented: false,
      listaGenerales: [],
      listaEntradas: [],
      listaComentarios: [],
      comentario: {
        comentario: '',
        es_item: true,
        id_item: 0
      },
      entradas: {
        error: false,
        mensaje: '',
        id_item: 0
      },
      mostrarComentar: [],
      mostrar: {
        id_est: 0,
        index_apartado: 0,
        apartado: '',
        state: false
      },
      comentariosProfesor: [],
      verComentarios: []
    }
  },
  computed: {
    ...mapState(['apiUrl']),

    mostrarBitacora: function () {
      return Object.keys(this.bitacora).length > 0
    }
  },
  methods: {
    separarItems: function (listaItems) {
      for (var i = 0; i < listaItems.length; i++) {
        if (listaItems[i].tipo_item.tipo === 'Logro') {
          this.itemsLogros.push(listaItems[i])
        } else if (listaItems[i].tipo_item.tipo === 'Meta') {
          this.itemsMetas.push(listaItems[i])
        } else if (listaItems[i].tipo_item.tipo === 'Impedimento') {
          this.itemsImpedimentos.push(listaItems[i])
        }
      }
    },
    buscarIdAsistencia: function (idEstudiante) {
      if (this.mostrarBitacora) {
        return Funciones.buscarIdAsistencia(this.bitacora, idEstudiante)
      }
    },
    logrosPorEstudiante: function (idEstudiante) {
      return Funciones.separarPorEstudiante(this.itemsLogros, this.buscarIdAsistencia(idEstudiante))
    },
    metasPorEstudiante: function (idEstudiante) {
      return Funciones.separarPorEstudiante(this.itemsMetas, this.buscarIdAsistencia(idEstudiante))
    },
    impedimentosPorEstudiante: function (idEstudiante) {
      return Funciones.separarPorEstudiante(this.itemsImpedimentos, this.buscarIdAsistencia(idEstudiante))
    },
    nombreCompleto: function (usuario) {
      return Funciones.nombreCompleto(usuario)
    },
    abrirComentario: function (index, id, estudianteId, apartado) {
      var i = this.mostrarComentar.findIndex(item => item.id_est === estudianteId && item.index_apartado === index && item.apartado === apartado)
      this.mostrarComentar[i].state = true
      // this.listaComentarios[index].id_item = id
      this.comented = true
    },
    cerrarComentario: function (index, estudianteId, apartado) {
      var i = this.mostrarComentar.findIndex(item => item.id_est === estudianteId && item.index_apartado === index && item.apartado === apartado)
      this.mostrarComentar[i].state = false
      this.listaComentarios[i].comentario = ''
      this.listaEntradas[i].error = false
      var open = 0
      for (var j = 0; j < this.mostrarComentar.length; j++) {
        if (this.mostrarComentar[j].state) {
          open++
        }
      }
      if (open === 0) {
        this.comented = false
      }
    },

    comentarioAbierto: function (index, estudianteId, apartado) {
      var i = this.mostrarComentar.findIndex(item => item.id_est === estudianteId && item.index_apartado === index && item.apartado === apartado)

      return this.mostrarComentar[i].state
    },
    limpiarCampos: function () {
      this.mostrarComentar = []
      this.listaComentarios = []
      this.listaGenerales = []
    },
    limpiarErrorItem: function (index) {
      this.listaEntradas[index].error = false
      this.listaEntradas[index].mensaje = ''
    },
    crearListas: function () {
      this.limpiarCampos()
      for (const estudiante of this.grupoSeleccionado.estudiantes) {
        var objectMostrar
        var objectComentario
        var impedimentos = this.impedimentosPorEstudiante(estudiante.id)
        for (var i = 0; i < impedimentos.length; i++) {
          objectMostrar = Object.assign({}, this.mostrar)
          objectMostrar.id_est = estudiante.id
          objectMostrar.index_apartado = i
          objectMostrar.apartado = 'impedimentos'
          this.mostrarComentar.push(objectMostrar)
          objectComentario = Object.assign({}, this.comentario)
          objectComentario.id_item = impedimentos[i].id
          this.listaComentarios.push(objectComentario)
        }
        var logros = this.logrosPorEstudiante(estudiante.id)
        for (var j = 0; j < logros.length; j++) {
          objectMostrar = Object.assign({}, this.mostrar)
          objectMostrar.id_est = estudiante.id
          objectMostrar.index_apartado = j
          objectMostrar.apartado = 'logros'
          this.mostrarComentar.push(objectMostrar)
          objectComentario = Object.assign({}, this.comentario)
          objectComentario.id_item = logros[j].id
          this.listaComentarios.push(objectComentario)
        }
        var metas = this.metasPorEstudiante(estudiante.id)
        for (var k = 0; k < metas.length; k++) {
          objectMostrar = Object.assign({}, this.mostrar)
          objectMostrar.id_est = estudiante.id
          objectMostrar.index_apartado = k
          objectMostrar.apartado = 'metas'
          this.mostrarComentar.push(objectMostrar)
          objectComentario = Object.assign({}, this.comentario)
          objectComentario.id_item = metas[k].id
          this.listaComentarios.push(objectComentario)
        }
      }
      for (var l = 0; l < this.bitacora.minuta.items.length; l++) {
        // this.listaComentarios.push(Object.assign({}, this.comentario))
        this.listaEntradas.push(Object.assign({}, this.entradas))
      }
    },
    cancelarEnvio: function () {
      this.$emit('cerrar')
      this.limpiarCampos()
      this.limpiarErrorGeneral()
      for (var i = 0; i < this.listaEntradas.length; i++) {
        this.listaEntradas[i].error = false
        this.listaEntradas[i].mensaje = ''
      }
    },
    validarComentarioItem: function (index) {
      if (this.mostrarComentar[index].state) {
        if (this.listaComentarios[index].comentario === '' || this.listaComentarios[index].comentario === undefined) {
          this.listaEntradas[index].error = true
          this.listaEntradas[index].mensaje = 'Falta ingresar el comentario'
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    validarListaComentarios: function () {
      const comentarios = this.listaComentarios
      var validacion = true
      for (var i = 0; i < comentarios.length; i++) {
        validacion = validacion && this.validarComentarioItem(i)
      }
      return validacion
    },
    enviarComentarios: function () {
      for (var i = 0; i < this.listaComentarios.length; i++) {
        this.listaComentarios[i].comentario = this.listaComentarios[i].comentario.trim()
      }
      if (this.validarListaComentarios()) {
        var comentarios = this.listaComentarios.filter(item => item.comentario !== '')
        this.$emit('comentar', comentarios)
      }
    },
    ordenarItemsPorEstudiante: function () {
      var listaItems = []
      for (const estudiante of this.grupoSeleccionado.estudiantes) {
        listaItems = listaItems.concat(this.impedimentosPorEstudiante(estudiante.id), this.logrosPorEstudiante(estudiante.id), this.metasPorEstudiante(estudiante.id))
      }
      this.bitacora.minuta.items = listaItems
    },
    cerrarRevision: function () {
      this.$emit('cerrar')
    },
    encontrarIndice: function (index, estudianteId, apartado) {
      this.ayuda = this.mostrarComentar.findIndex(item => item.id_est === estudianteId && item.index_apartado === index && item.apartado === apartado)
      return this.mostrarComentar.findIndex(item => item.id_est === estudianteId && item.index_apartado === index && item.apartado === apartado)
    },
    async obtenerComentarios (bitacoraId) {
      console.log(bitacoraId)
      try {
        const response = await axios.get(this.apiUrl + '/comentarios/' + bitacoraId, { headers: Auth.authHeader() })
        this.comentariosProfesor = response.data
      } catch (e) {
        console.log('No fue posible obtener los comentarios de la minuta')
        console.log(e)
      }
    },
    buscarIniciales: function (asistenciaId) {
      console.log(asistenciaId)
      return Funciones.buscarIniciales(this.bitacora.minuta.asistencia, asistenciaId)
    },
    buscarComentarioItem: function (idItem) {
      return this.comentariosProfesor.find(item => item.id_item === idItem)
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.separarItems(this.bitacora.minuta.items)
      this.obtenerComentarios(this.bitacora.id)
      this.crearListas()
    }
  },
  mounted () {
    if (this.mostrarBitacora) {
      this.ordenarItemsPorEstudiante()
    }
  }
}
</script>
