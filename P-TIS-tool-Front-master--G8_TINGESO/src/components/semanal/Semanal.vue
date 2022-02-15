<template>
  <div>

    <div class="columns is-centered">
      <div class="column is-half">
        <p class="title is-4 has-text-centered">MINUTA DE AVANCE SEMANAL</p>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Proyecto:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="grupo.proyecto" class="input" type="text" disabled>
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label-2c is-normal">
        <label class="label">Grupo:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="grupo.correlativo" class="input has-text-centered" type="text" disabled>
          </p>
        </div>
      </div>
      <div class="field-label-2c is-normal">
        <label class="label">N° de avance:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="minuta.correlativo" class="input has-text-centered" type="text" disabled>
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label-2c is-normal">
        <label class="label">N° de Sprint:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="numeroSprint" class="input has-text-centered" :class="{ 'is-danger' : entradas.numeroSprint.error }" type="text" @input="validarSprint">
          </p>
        </div>
        <p class="is-danger help" v-if="entradas.numeroSprint.error">{{ entradas.numeroSprint.mensaje }}</p>
      </div>
      <div class="field-label-2c is-normal">
        <label class="label">Fecha avance:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="minuta.fecha_avance" class="input has-text-centered" :class="{ 'is-danger' : entradas.fechaAvance }" type="date" @input="validarFecha">
          </p>
        </div>
        <p class="is-danger help" v-if="entradas.fechaAvance">No se ha ingresado la fecha del avance</p>
      </div>
    </div>

    <br>
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <p class="title is-5 has-text-centered">Impedimentos de la semana anterior</p>
      </div>
      <div class="column">
        <div class="columns">
          <div class="column is-2 is-offset-3">
            <a class="button is-small is-info-usach is-rounded" @click="agregarImpedimento">
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-10">
        <div class="content has-text-left">
          <ul>
            <li v-for="(impedimento, index) in impedimentos" :key="index">
              <div class="field is-grouped">
                <p class="control is-expanded has-icons-right">
                  <input v-model="impedimentos[index].descripcion" class="input is-normal" :class="{ 'is-danger' : entradas.impedimentos }" type="text" @input="validarImpedimentos">
                  <span class="icon is-right">
                    <button class="delete" @click="removerImpedimento(impedimento)"></button>
                  </span>
                </p>
              </div>
            </li>
          </ul>
          <p class="is-danger help" v-if="entradas.impedimentos">Faltan los impedimentos. Si no hubo, colocar "No tuve impedimentos"</p>
        </div>
      </div>
    </div>

    <br>
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <p class="title is-5 has-text-centered">Logros de la semana anterior</p>
      </div>
      <div class="column">
        <div class="columns">
          <div class="column is-2 is-offset-3">
            <a class="button is-small is-info-usach is-rounded" @click="agregarLogro">
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-10">
        <div class="content has-text-left">
          <ul>
            <li v-for="(logro, index) in logros" :key="index">
              <div class="field is-grouepd">
                <p class="control is-expanded has-icons-right">
                  <input v-model="logros[index].descripcion" class="input is-normal" :class="{ 'is-danger' : entradas.logros }" type="text" @input="validarLogros">
                  <span class="icon is-right">
                    <button class="delete" @click="removerLogro(logro)"></button>
                  </span>
                </p>
              </div>
            </li>
          </ul>
          <p class="is-danger help" v-if="entradas.logros">No se han llenado todos los logros</p>
        </div>
      </div>
    </div>

    <br>
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <p class="title is-5 has-text-centered">Metas para la nueva semana</p>
      </div>
      <div class="column">
        <div class="columns">
          <div class="column is-2 is-offset-3">
            <a class="button is-small is-info-usach is-rounded" @click="agregarMeta">
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-10 is-offset-1">
        <div class="content has-text-left">
          <ul>
            <li v-for="(meta, index) in metas" :key="index">
              <div class="field is-grouped">
                <p class="control is-expanded has-icons-right">
                  <input v-model="metas[index].descripcion" class="input is-normal" :class="{ 'is-danger' : entradas.metas }" type="text" @input="validarMetas">
                  <span class="icon is-right">
                    <button class="delete" @click="removerMeta(meta)"></button>
                  </span>
                </p>
              </div>
            </li>
          </ul>
          <p class="is-danger help" v-if="entradas.metas">No se han agregado todas las metas</p>
        </div>
      </div>
    </div>

    <br>
    <br>
    <div class="columns is-centered">
      <div class="column is-3">
        <div class="field">
          <div class="control">
            <a class="button is-primary-usach is-fullwidth" @click="guardar">Guardar</a>
          </div>
        </div>
      </div>
      <div class="column is-3" v-if="mostrarEmitir">
        <div class="field">
          <div class="control">
            <a class="button is-secondary-usach is-fullwidth" @click="emitirMinuta">Emitir</a>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="control">
          <a class="button is-light-usach is-fullwidth" @click="cerrar">Cancelar</a>
        </div>
      </div>
    </div>

    <br>
    <hr>
    <div v-if="actualizarAvance">
      <div v-for="estudiante in compagnerosGrupo" :key="estudiante.id">
        <VisorEstudiante :est="estudiante" :logros="logrosPorEstudiante(estudiante.id)" :metas="metasPorEstudiante(estudiante.id)" :impedimentos="impedimentosPorEstudiante(estudiante.id)" v-show="mostrarAvance(estudiante.id)"/>
      </div>
    </div>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import axios from 'axios'
import { mapState } from 'vuex'

import VisorEstudiante from '@/components/semanal/VisorEstudiante.vue'

export default {
  name: 'Semanal',
  components: {
    VisorEstudiante
  },
  props: ['avance', 'tipoMinuta'],
  data () {
    return {
      id: 0,
      bitacora: this.avance,
      minuta: {
        estudiante_id: 0,
        codigo: '',
        correlativo: '',
        fecha_avance: '',
        tipo_minuta_id: this.tipoMinuta
      },
      numeroSprint: '',
      logros: [{ id: 0, descripcion: '', correlativo: 1 }],
      metas: [{ id: 0, descripcion: '', correlativo: 1 }],
      impedimentos: [{ id: 0, descripcion: '', correlativo: 1 }],
      semestre: {},
      entradas: {
        numeroSprint: { error: false, mensaje: '' },
        fechaAvance: false,
        logros: false,
        metas: false,
        impedimentos: false
      },
      itemsLogros: [],
      itemsMetas: [],
      itemsImpedimentos: [],
      emitir: false
    }
  },
  computed: {
    ...mapState(['apiUrl', 'estudiante', 'grupo']),

    actualizarAvance: function () {
      return Object.keys(this.bitacora).length > 0
    },
    compagnerosGrupo: function () {
      var lista = []
      for (var i = 0; i < this.grupo.estudiantes.length; i++) {
        if (this.grupo.estudiantes[i].id !== this.estudiante.id) {
          lista.push(this.grupo.estudiantes[i])
        }
      }
      return lista
    },
    mostrarEmitir: function () {
      if (this.actualizarAvance) {
        if (this.bitacora.minuta.estudiante_id === this.estudiante.id) {
          return this.bitacora.minuta.asistencia.length - 1 === this.grupo.estudiantes.length
        } else {
          return this.bitacora.minuta.asistencia.length - 1 >= this.grupo.estudiantes.length
        }
      } else {
        return false
      }
    }
  },
  methods: {
    removeFromArray: function (arreglo, item) {
      return Funciones.removeFromArray(arreglo, item)
    },
    agregarLogro: function () {
      var nuevoLogro = { id: 0, descripcion: '', correlativo: 0 }
      const anterior = this.logros[this.logros.length - 1].correlativo
      nuevoLogro.correlativo = anterior + 1
      this.logros.push(nuevoLogro)
    },
    removerLogro: function (logro) {
      if (this.logros.length > 1) {
        this.removeFromArray(this.logros, logro)
      }
    },
    agregarMeta: function () {
      var nuevaMeta = { id: 0, descripcion: '', correlativo: 0 }
      const anterior = this.metas[this.metas.length - 1].correlativo
      nuevaMeta.correlativo = anterior + 1
      this.metas.push(nuevaMeta)
    },
    removerMeta: function (meta) {
      if (this.metas.length > 1) {
        this.removeFromArray(this.metas, meta)
      }
    },
    agregarImpedimento: function () {
      var nuevoImpedimento = { id: 0, descripcion: '', correlativo: 0 }
      const anterior = this.impedimentos[this.impedimentos.length - 1].correlativo
      nuevoImpedimento.correlativo = anterior + 1
      this.impedimentos.push(nuevoImpedimento)
    },
    removerImpedimento: function (impedimento) {
      if (this.impedimentos.length > 1) {
        this.removeFromArray(this.impedimentos, impedimento)
      }
    },
    establecerId: function () {
      this.minuta.estudiante_id = this.estudiante.id
    },
    establecerCodigo: function () {
      var codigo = 'MINUTA_'
      var correlativo = ''
      if (this.minuta.correlativo < 10) {
        correlativo = '0' + this.minuta.correlativo
      } else {
        correlativo = this.minuta.correlativo
      }
      var semestre = this.semestre.agno + '-' + this.semestre.numero
      var fecha = this.minuta.fecha_avance.split('-')
      codigo += this.grupo.nombre + '_' + correlativo + '_' + semestre + '_' + fecha[1] + fecha[2]
      return codigo
    },
    async obtenerCorrelativo () {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/correlativo/semanal/' + this.grupo.id, { headers: Auth.authHeader() })
        this.minuta.correlativo = response.data
      } catch (e) {
        console.log('No fue posible obtener el correlativo de la minuta')
        console.log(e)
      }
    },
    async obtenerSemestre () {
      try {
        const response = await axios.get(this.apiUrl + '/semestres', { headers: Auth.authHeader() })
        this.semestre = response.data
      } catch {
        console.log('No se obtuvo la información del semestre')
      }
    },
    async guardar () {
      if (this.validarFormulario()) {
        if (!this.actualizarAvance) {
          this.establecerId()
          this.minuta.codigo = this.establecerCodigo()
          const items = {
            minuta: this.minuta,
            numero_sprint: this.numeroSprint,
            logros: this.logros,
            metas: this.metas,
            impedimentos: this.impedimentos
          }
          try {
            await axios.post(this.apiUrl + '/minutas/avance/semanal', items, { headers: Auth.postHeader() })
            this.$emit('cerrar')
          } catch (e) {
            console.log('No fue posible guardar los logros y metas de la semana')
            console.log(e)
          }
        } else {
          this.actualizar()
        }
      }
    },
    async actualizar () {
      const items = {
        id: this.bitacora.id,
        minuta: this.minuta,
        numero_sprint: this.numeroSprint,
        logros: this.logros,
        metas: this.metas,
        impedimentos: this.impedimentos,
        emitir: this.emitir
      }
      try {
        await axios.post(this.apiUrl + '/minutas/actualizar/avance/semanal', items, { headers: Auth.postHeader() })
        this.$emit('cerrar')
      } catch (e) {
        console.log('No fue posible actualizar los logros y metas de la semana')
        console.log(e)
      }
    },
    emitirMinuta: function () {
      this.emitir = true
      this.guardar()
    },
    cerrar: function () {
      this.$emit('cerrar')
    },
    convertirFecha: function (timestamp) {
      return Funciones.convertirFecha(timestamp)
    },
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
      if (this.actualizarAvance) {
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
    mostrarAvance: function (idEstudiante) {
      return this.logrosPorEstudiante(idEstudiante).length > 0 && this.metasPorEstudiante(idEstudiante).length > 0 && this.impedimentosPorEstudiante(idEstudiante).length > 0
    },
    convertirItems: function (listaAconvertir) {
      const listaItems = listaAconvertir
      var lista = []
      const obj = { id: 0, descripcion: '', correlativo: 1 }
      var aux = {}
      if (listaItems.length > 0) {
        for (var i = 0; i < listaItems.length; i++) {
          aux = Object.assign({}, obj)
          aux.id = listaItems[i].id
          aux.descripcion = listaItems[i].descripcion
          aux.correlativo = listaItems[i].correlativo
          lista.push(aux)
        }
      } else {
        lista.push(obj)
      }
      return lista
    },
    convertirLogros: function () {
      return this.convertirItems(this.logrosPorEstudiante(this.estudiante.id))
    },
    convertirMetas: function () {
      return this.convertirItems(this.metasPorEstudiante(this.estudiante.id))
    },
    convertirImpedimentos: function () {
      return this.convertirItems(this.impedimentosPorEstudiante(this.estudiante.id))
    },
    convertirBitacora: function () {
      if (this.actualizarAvance) {
        this.separarItems(this.bitacora.minuta.items)
        this.minuta.estudiante_id = this.bitacora.minuta.estudiante_id
        this.minuta.codigo = this.bitacora.minuta.codigo
        this.minuta.correlativo = this.bitacora.minuta.correlativo
        this.minuta.fecha_avance = this.convertirFecha(this.bitacora.minuta.fecha_reunion)
        this.numeroSprint = this.bitacora.minuta.numero_sprint
        this.logros = this.convertirLogros()
        this.metas = this.convertirMetas()
        this.impedimentos = this.convertirImpedimentos()
      }
    },
    validarSprint: function () {
      const numero = this.numeroSprint
      if (numero === null || numero === undefined || numero === '') {
        this.entradas.numeroSprint.error = true
        this.entradas.numeroSprint.mensaje = 'No se ha ingresado el núermo del Sprint'
        return false
      } else {
        if (isNaN(parseInt(numero))) {
          this.entradas.numeroSprint.error = true
          this.entradas.numeroSprint.mensaje = 'Error de entrada. Por favor, sólo números enteros.'
          return false
        } else {
          this.numeroSprint = parseInt(numero)
          if (numero < 0) {
            this.entradas.numeroSprint.error = true
            this.entradas.numeroSprint.mensaje = 'No se aceptan valores menores a cero'
            return false
          } else {
            this.entradas.numeroSprint.error = false
            this.entradas.numeroSprint.mensaje = ''
            return true
          }
        }
      }
    },
    validarFecha: function () {
      const regExp = /^(\d{4})-(\d{2})-(\d{2})$/
      const fecha = this.minuta.fecha_avance
      if (fecha === '' || fecha === undefined || !regExp.test(fecha)) {
        this.entradas.fechaAvance = true
        return false
      } else {
        this.entradas.fechaAvance = false
        return true
      }
    },
    validarLista: function (lista, llave, entrada) {
      if (lista.length === 1) {
        if (lista[0].descripcion === '') {
          entrada[llave] = true
          return false
        } else {
          entrada[llave] = false
          return true
        }
      } else {
        var validar = true
        for (var i = 0; i < lista.length; i++) {
          if (lista[i].descripcion === '') {
            validar = false
            entrada[llave] = true
          }
        }
        if (validar) {
          entrada[llave] = false
        }
        return validar
      }
    },
    validarLogros: function () {
      return this.validarLista(this.logros, 'logros', this.entradas)
    },
    validarMetas: function () {
      return this.validarLista(this.metas, 'metas', this.entradas)
    },
    validarImpedimentos: function () {
      return this.validarLista(this.impedimentos, 'impedimentos', this.entradas)
    },
    validarFormulario: function () {
      var validar = true
      validar = validar && this.validarSprint()
      validar = validar && this.validarFecha()
      validar = validar && this.validarImpedimentos()
      validar = validar && this.validarLogros()
      validar = validar && this.validarMetas()
      return validar
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      if (!this.actualizarAvance) {
        this.obtenerCorrelativo()
        this.obtenerSemestre()
      }
      this.convertirBitacora()
    }
  }
}
</script>
