<template>
  <div>

    <div class="columns is-centered">
      <div class="column is-8">
        <p class="title is-5 has-text-centered">Acuerdos / Compromisos</p>
      </div>
    </div>
    <table class="table is-hoverable is-fullwidth" summary="Items">
      <thead>
        <tr class="has-text-centered">
          <th scope="col" class="is-narrow">N°</th>
          <th scope="col"><abbr title="Tipo de actividad">Item</abbr></th>
          <th scope="col"><abbr title="Descripción de la actividad realizada">Descripción</abbr></th>
          <th scope="col"><abbr title="Fecha comprometida para la actividad">Fecha</abbr></th>
          <th scope="col"><abbr title="Responsable de realizarla">Responsable</abbr></th>
          <th scope="col" v-if="comentarios"></th>
          <th scope="col" v-else-if="respuestas"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in listaOrdenada" :key="item.id">
          <th scope="row" class="is-vcentered">{{ item.correlativo }}</th>
          <td class="is-vcentered">{{ item.tipo }}</td>
          <td class="is-vcentered has-text-left">{{ item.descripcion }}</td>
          <td class="is-vcentered">{{ fechaItem(item.fecha) }}</td>
          <td class="is-vcentered has-text-centered">{{ obtenerIniciales(item.responsables) }}</td>
          <td v-if="comentarios || respuestas">
            <div v-if="comentarios">
              <div v-if="!this.mostrarComentar[index]">
                <a @click="abrirComentario(index, item.id)">comentar</a>
              </div>
              <div v-else>
                <div class="card">
                  <div class="card-content">
                    <div class="content">
                      <textarea v-model="this.listaComentarios[index].comentario" class="textarea is-small is-extend" :class="{ 'is-danger' : this.listaEntradas[index].error }" @input="limpiarErrorItem(index)"></textarea>
                    </div>
                    <p v-if="this.listaEntradas[index].error" class="is-danger help">{{ this.listaEntradas[index].mensaje }}</p>
                  </div>
                  <footer class="card-footer">
                    <a class="card-footer-item" @click="cerrarComentario(index)">Cancelar</a>
                  </footer>
                </div>
              </div>
            </div>
            <div v-else-if="respuestas">
              <div v-for="(comentario, ind) in comentariosPorItem[index]" :key="comentario.id">
                <article class="message is-small">
                  <div class="message-header">
                    <p>{{ buscarIniciales(comentario.asistencia_id) }}</p>
                  </div>
                  <div class="message-body">
                    <p>{{ comentario.comentario }}</p>
                    <div v-if="!verRespuestas">
                      <div v-if="!this.verRespuestasItems[index][ind]">
                        <a @click="abrirRespuestaItem(index, ind)"><strong>responder</strong></a>
                      </div>
                      <div v-else>
                        <div class="card">
                          <div class="card-content">
                            <div class="content">
                              <textarea v-model="this.respuestasItems[index][ind].respuesta" class="textarea is-small is-extend" :class="{ 'is-danger' : this.responderEntradasItems[index][ind].error }" @input="limpiarErrorRespItem(index, ind)"></textarea>
                            </div>
                            <p v-if="this.responderEntradasItems[index][ind].error" class="is-danger help">{{ this.responderEntradasItems[index][ind].mensaje }}</p>
                          </div>
                          <footer class="card-footer">
                            <a class="card-footer-item" @click="cerrarRespuestaItem(index, ind)">Cancelar</a>
                          </footer>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <br>
                      <div v-for="respuesta in comentario.respuestas" :key="respuesta.id">
                        <article class="message is-info is-small">
                          <div class="message-header">
                            <p>{{ buscarIniciales(respuesta.asistencia_id) }}</p>
                          </div>
                          <div class="message-body">
                            <p>{{ respuesta.respuesta }}</p>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="comentarios">

      <div class="columns">
        <div class="column is-half is-offset-3">
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <a class="button is-info-usach" @click="agregaComentario">Agregar comentario</a>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-10 is-offset-1">
          <div class="content has-text-left">
            <ul>
              <li v-for="(comentario, index) in listaGenerales" :key="index">
                <div class="field is-grouped">
                  <p class="control is-expanded has-icons-right">
                    <input v-model="listaGenerales[index].comentario" class="input"  :class="{ 'is-danger' : this.entradas.comentarios }" type="text" @input="limpiarErrorGeneral">
                    <span class="icon is-right">
                      <button class="delete" @click="removerComentario(comentario)"></button>
                    </span>
                  </p>
                </div>
              </li>
            </ul>
            <p class="is-danger help" v-if="entradas.comentarios">No se han ingresado todos los comentarios</p>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-half is-offset-3">
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <a class="button is-primary-usach" @click="enviarComentarios">{{ sinComentarios ? 'Terminar revisión' : 'Guardar comentarios' }}</a>
            </div>
            <div class="control">
              <a class="button is-light-usach" @click="cancelarEnvio"><strong>Cancelar</strong></a>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else-if="respuestas">

      <div class="columns is-multiline is-desktop">
        <div class="column is-3" v-for="(comentario, index) in comentariosGenerales" :key="comentario.id">
          <article class="message">
            <div class="message-header">
              <p>{{ buscarIniciales(comentario.asistencia_id) }}</p>
            </div>
            <div class="message-body">
              <p>{{ comentario.comentario }}</p>
              <div v-if="!verRespuestas">
                <div v-if="!this.verRespuestasGenerales[index]">
                  <a @click="abrirRespuestaGeneral(index)"><strong>responder</strong></a>
                </div>
                <div v-else>
                  <div class="card">
                    <div class="card-content">
                      <div class="content">
                        <textarea v-model="this.respuestasGenerales[index].respuesta" class="textarea is-small is-extend" :class="{ 'is-danger' : this.responderEntradasGenerales[index].error }" @input="limpiarErrorRespGeneral(index)"></textarea>
                      </div>
                      <p v-if="this.responderEntradasGenerales[index].error" class="is-danger help">{{ this.responderEntradasGenerales[index].mensaje }}</p>
                    </div>
                    <footer class="card-footer">
                      <a class="card-footer-item" @click="cerrarRespuestaGeneral(index)">Cancelar</a>
                    </footer>
                  </div>
                </div>
              </div>
              <div v-else>
                <br>
                <div v-for="respuesta in comentario.respuestas" :key="respuesta.id">
                  <article class="message is-info">
                    <div class="message-header">
                      <p>{{ buscarIniciales(respuesta.asistencia_id) }}</p>
                    </div>
                    <div class="message-body">
                      <p>{{ respuesta.respuesta }}</p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-if="!verRespuestas">
        <div class="columns">
          <div class="column is-half is-offset-3">
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <a class="button is-primary-usach" @click="enviarRespuestas">{{ mostrarGuardar ? 'Guardar respuestas' : 'Aceptar comentarios' }}</a>
              </div>
              <div class="control">
                <a class="button is-light-usach" @click="cancelarEnvioRespuestas">Cancelar</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import Funciones from '@/services/funciones.js'

export default {
  name: 'Item',
  props: ['lista', 'asistentes', 'comentar', 'responder', 'listaCom', 'verRespuestas'],
  data () {
    return {
      listaItems: this.lista,
      asistencia: this.asistentes,
      comentarios: this.comentar,
      respuestas: this.responder,
      mostrarComentar: [],
      listaComentarios: [],
      listaGenerales: [],
      comentario: {
        comentario: '',
        es_item: true,
        id_item: 0
      },
      entrada: {
        error: false,
        mensaje: ''
      },
      listaEntradas: [],
      entradas: {
        comentarios: false
      },
      comentariosMinuta: this.listaCom,
      comentariosItems: [],
      comentariosGenerales: [],
      respuestasItems: [],
      respuestasGenerales: [],
      verRespuestasItems: [],
      verRespuestasGenerales: [],
      responderEntradasItems: [],
      responderEntradasGenerales: []
    }
  },
  computed: {
    listaOrdenada: function () {
      var lista = this.listaItems
      return lista.sort((a, b) => {
        if (a.correlativo < b.correlativo) {
          return -1
        } else {
          return 1
        }
      })
    },
    comentariosPorItem: function () {
      var lista = []
      for (var i = 0; i < this.listaOrdenada.length; i++) {
        lista.push(this.buscarComentarios(this.listaOrdenada[i].id))
      }
      return lista
    },
    mostrarGuardar: function () {
      for (var i = 0; i < this.respuestasItems.length; i++) {
        for (var k = 0; k < this.respuestasItems[i].length; k++) {
          if (this.respuestasItems[i][k].respuesta.length > 0) {
            return true
          }
        }
      }
      for (var j = 0; j < this.respuestasGenerales.length; j++) {
        if (Object.keys(this.respuestasGenerales[j]).length > 0) {
          if (this.respuestasGenerales[j].respuesta.length > 0) {
            return true
          }
        }
      }
      return false
    },
    sinComentarios: function () {
      return Funciones.sinComentarios(this.listaComentarios.concat(this.listaGenerales))
    }
  },
  methods: {
    fechaItem: function (cadena) {
      return Funciones.obtenerFecha(cadena)
    },
    obtenerIniciales: function (listaResponsables) {
      var resp = []
      for (var i = 0; i < listaResponsables.length; i++) {
        for (var j = 0; j < this.asistencia.length; j++) {
          if (listaResponsables[i].asistencia_id === this.asistencia[j].id) {
            resp.push(this.asistencia[j].iniciales)
          }
        }
      }
      return resp.join(' / ')
    },
    crearListas: function () {
      this.limpiarCampos()
      for (var i = 0; i < this.listaItems.length; i++) {
        this.mostrarComentar.push(false)
        this.listaComentarios.push(Object.assign({}, this.comentario))
        this.listaEntradas.push(Object.assign({}, this.entrada))
      }
    },
    abrirComentario: function (index, id) {
      this.mostrarComentar[index] = true
      this.listaComentarios[index].id_item = id
    },
    cerrarComentario: function (index) {
      this.mostrarComentar[index] = false
      this.listaComentarios[index].comentario = ''
      this.listaEntradas[index].error = false
    },
    agregaComentario: function () {
      var comentario = Object.assign({}, this.comentario)
      comentario.es_item = false
      this.listaGenerales.push(comentario)
    },
    removerComentario: function (comentario) {
      return Funciones.removeFromArray(this.listaGenerales, comentario)
    },
    limpiarCampos: function () {
      this.mostrarComentar = []
      this.listaComentarios = []
      this.listaGenerales = []
      this.comentariosItems = []
      this.comentariosGenerales = []
      this.respuestasItems = []
      this.respuestasGenerales = []
      this.verRespuestasItems = []
      this.verRespuestasGenerales = []
      this.responderEntradasItems = []
      this.responderEntradasGenerales = []
    },
    enviarComentarios: function () {
      if (this.validarComentarios()) {
        var comentarios = this.listaComentarios.concat(this.listaGenerales)
        this.$emit('comentar', comentarios)
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
      if (this.mostrarComentar[index]) {
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
    validarListaGenerales: function () {
      if (this.listaGenerales.length > 0) {
        var validar = true
        for (var i = 0; i < this.listaGenerales.length; i++) {
          if (this.listaGenerales[i].comentario === '') {
            validar = false
            this.entradas.comentarios = true
          }
        }
        return validar
      } else {
        return true
      }
    },
    validarComentarios: function () {
      return this.validarListaComentarios() && this.validarListaGenerales()
    },
    limpiarErrorItem: function (index) {
      this.listaEntradas[index].error = false
      this.listaEntradas[index].mensaje = ''
    },
    limpiarErrorGeneral: function () {
      this.entradas.comentarios = false
    },
    categorizarComentarios: function () {
      if (this.comentariosMinuta.length > 0) {
        for (var i = 0; i < this.comentariosMinuta.length; i++) {
          if (this.comentariosMinuta[i].es_item) {
            this.comentariosItems.push(this.comentariosMinuta[i])
          } else {
            this.comentariosGenerales.push(this.comentariosMinuta[i])
            this.respuestasGenerales.push({
              comentario_id: this.comentariosMinuta[i].id,
              respuesta: ''
            })
            this.verRespuestasGenerales.push(false)
            this.responderEntradasGenerales.push(Object.assign({}, this.entrada))
          }
        }
      }
    },
    enviarRespuestas: function () {
      if (this.validarRespuestas()) {
        var respuestas = []
        for (var i = 0; i < this.respuestasItems.length; i++) {
          for (var j = 0; j < this.respuestasItems[i].length; j++) {
            respuestas.push(this.respuestasItems[i][j])
          }
        }
        respuestas = respuestas.concat(this.respuestasGenerales)
        this.$emit('responder', respuestas)
      }
    },
    cancelarEnvioRespuestas: function () {
      this.$emit('cerrar')
      this.limpiarCampos()
    },
    buscarComentarios: function (itemId) {
      var lista = []
      if (this.comentariosItems.length > 0) {
        for (var i = 0; i < this.comentariosItems.length; i++) {
          if (this.comentariosItems[i].id_item === itemId) {
            lista.push(this.comentariosItems[i])
          }
        }
      }
      return lista
    },
    crearRespuestasItems: function () {
      if (this.comentariosPorItem.length > this.respuestasItems.length || this.comentariosPorItem.length > this.verRespuestasItems.length) {
        this.respuestasItems = []
        this.verRespuestasItems = []
        this.responderEntradasItems = []
        var lista = []
        var respuestas = []
        var entradas = []
        for (var i = 0; i < this.comentariosPorItem.length; i++) {
          for (var j = 0; j < this.comentariosPorItem[i].length; j++) {
            lista.push({ comentario_id: this.comentariosPorItem[i][j].id, respuesta: '' })
            respuestas.push(false)
            entradas.push(Object.assign({}, this.entrada))
          }
          this.respuestasItems.push(lista)
          this.verRespuestasItems.push(respuestas)
          this.responderEntradasItems.push(entradas)
          lista = []
          respuestas = []
          entradas = []
        }
      }
    },
    abrirRespuestaGeneral: function (index) {
      this.verRespuestasGenerales[index] = true
    },
    cerrarRespuestaGeneral: function (index) {
      this.verRespuestasGenerales[index] = false
      this.respuestasGenerales[index].respuesta = ''
    },
    abrirRespuestaItem: function (index, ind) {
      this.verRespuestasItems[index][ind] = true
    },
    cerrarRespuestaItem: function (index, ind) {
      this.verRespuestasItems[index][ind] = false
      this.respuestasItems[index][ind].respuesta = ''
    },
    validarRespuestaItem: function (index, ind) {
      if (this.verRespuestasItems[index][ind]) {
        if (this.respuestasItems[index][ind].respuesta === '' || this.respuestasItems[index][ind].respuesta === undefined) {
          this.responderEntradasItems[index][ind].error = true
          this.responderEntradasItems[index][ind].mensaje = 'Falta ingresar la respuesta al comentario'
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    validarListaRespuestas: function () {
      var validacion = true
      for (var i = 0; i < this.responderEntradasItems.length; i++) {
        for (var j = 0; j < this.responderEntradasItems[i].length; j++) {
          validacion = validacion && this.validarRespuestaItem(i, j)
        }
      }
      return validacion
    },
    validarRespuestaGeneral: function (index) {
      if (this.verRespuestasGenerales[index]) {
        if (this.respuestasGenerales[index].respuesta === '' || this.respuestasGenerales[index].respuesta === undefined) {
          this.responderEntradasGenerales[index].error = true
          this.responderEntradasGenerales[index].mensaje = 'Falta ingresar la respuesta al comentario'
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    validarListaRespGenerales: function () {
      var validacion = true
      for (var i = 0; i < this.responderEntradasGenerales.length; i++) {
        validacion = validacion && this.validarRespuestaGeneral(i)
      }
      return validacion
    },
    validarRespuestas: function () {
      return this.validarListaRespuestas() && this.validarListaRespGenerales()
    },
    limpiarErrorRespItem: function (index, ind) {
      this.responderEntradasItems[index][ind].error = false
      this.responderEntradasItems[index][ind].mensaje = ''
    },
    limpiarErrorRespGeneral: function (index) {
      this.responderEntradasGenerales[index].error = false
      this.responderEntradasGenerales[index].mensaje = ''
    },
    cerrarRespuestas: function () {
      this.$emit('cerrar')
    },
    buscarIniciales: function (asistenciaId) {
      return Funciones.buscarIniciales(this.asistencia, asistenciaId)
    }
  },
  watch: {
    comentariosMinuta: function () {
      this.categorizarComentarios()
      this.crearRespuestasItems()
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.crearListas()
      this.categorizarComentarios()
      this.crearRespuestasItems()
    }
  }
}
</script>
