<template>
  <div>

      <div class="columns">
        <div class="column is-full">
          <p class="title is-4 has-text-centered">MINUTA DE REUNIÓN</p>
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
        <div class="field-label-2c">
          <label class="label">Grupo:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input v-model="grupo.correlativo" class="input has-text-centered" type="text" disabled>
            </p>
          </div>
        </div>
        <div class="field-label-2c">
          <label class="label">N° de reunión:</label>
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
        <div class="field-label-2c">
          <label class="label">Revisión:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <input v-model="revisionEstado" class="input has-text-centered" type="text" disabled>
          </div>
          <p class="is-danger help" v-if="entradas.revision.error">{{ entradas.revision.mensaje }}</p>
        </div>
        <div class="field-label-2c">
          <label class="label">Fecha de la reunión:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <input class="input has-text-centered" v-model="minuta.fecha_reunion" type="date" v-on:input="validarFecha">
          </div>
          <p class="is-danger help" v-if="entradas.fecha_reunion">No se ha ingresado fecha de la reunión</p>
        </div>
      </div>
      <div class="field is-horizontal is-grouped">
        <div class="field-label-2c">
          <label class="label">Hora de inicio:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input is-normal has-text-centered" v-model="minuta.h_inicio" type="time" v-on:input="validarHinicio">
            </p>
          </div>
          <p class="is-danger help" v-if="entradas.h_inicio">No se ha ingresado la hora de inicio</p>
        </div>
        <div class="field-label-2c">
          <label class="label">Hora de término:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input is-normal has-text-centered" v-model="minuta.h_termino" type="time" @input="validarHtermino">
            </p>
          </div>
          <p class="is-danger help" v-if="entradas.h_termino">No se ha ingresado la hora de término</p>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label-ayuda">Tema:</label>
          <span id="icono-ayuda" ayuda="Propósito general de la reunión" class="icon is-large">
            <i class="far fa-question-circle"></i>
          </span>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input" v-model="tema" type="text" @input="validarTema">
            </p>
          </div>
        </div>
        <p class="is-danger help" v-if="entradas.tema">No se ha ingresado el tema de la reunión</p>
      </div>

      <div class="columns">
        <div class="column is-11 is-offset-1">
          <br>
          <table class="table is-fullwidth" summary="Asistencia participantes">
            <thead>
              <tr>
                <th scope="col">Participantes</th>
                <th scope="col"></th>
                <th scope="col" class="has-text-centered">Iniciales</th>
                <th scope="col" class="has-text-centered">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(estudiante, index) in grupo.estudiantes" :key="estudiante.id">
                <td class="has-text-info has-text-weight-semibold">{{ nombreCompleto(estudiante.usuario) }}</td>
                <td></td>
                <td class="has-text-centered">{{ estudiante.iniciales }}</td>
                <td class="has-text-centered">
                  <div class="select control is-small is-expanded">
                    <select v-model="asistenciaEst[index]" @change="limpiarAsistencias">
                      <option class="is-fullwidth" v-for="asistencia in tipo_asistencias" :key="asistencia.id" :value="{ 'estudiante': estudiante.id, 'stakeholder': '', 'asistencia': asistencia.id}">{{ asistencia.descripcion }}</option>
                    </select>
                  </div>
                </td>
              </tr>
              <tr v-for="(cliente, index) in grupo.stakeholders" :key="cliente.id" v-show="minuta.tipo === 'Cliente'">
                <td class="has-text-link has-text-weight-semibold">{{ nombreCompleto(cliente.usuario) }}</td>
                <td></td>
                <td class="has-text-centered">{{ cliente.iniciales }}</td>
                <td class="has-text-centered">
                  <div class="select control is-small is-expanded">
                    <select v-model="asistenciaStk[index]" @change="limpiarAsistencias">
                      <option class="is-fullwidth" v-for="asistencia in tipo_asistencias" :key="asistencia.id" :value="{ 'estudiante': '', 'stakeholder': cliente.id, 'asistencia': asistencia.id}">{{ asistencia.descripcion }}</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="is-danger help" v-if="entradas.asistencias">No se han ingresado todas las asistencias a esta reunión</p>
        </div>
      </div>

      <div class="columns">
        <div id="ayuda-div" class="column is-full">
          <p class="title is-5 has-text-centered">
            <label class="label-ayuda">
               CLASIFICACIÓN
              <span id="icono-ayuda" ayuda="Clasificación según lo tratado en la reunión" class="icon is-large">
                <i class="far fa-question-circle"></i>
              </span>
          </label>
          </p>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth is-offset-1">
          <div class="field is-grouped is-grouped-centered">
            <p class="control">Informativa</p>
            <div class="control">
              <input type="checkbox" v-model="listaClasificacion" value="informativa" @change="limpiarClasificacion">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field is-grouped is-grouped-centered">
            <p class="control">Control de Avance</p>
            <div class="control">
              <input type="checkbox" v-model="listaClasificacion" value="avance" @change="limpiarClasificacion">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field is-grouped is-grouped-centered">
            <p class="control">Coordinación</p>
            <div class="control">
              <input type="checkbox" v-model="listaClasificacion" value="coordinacion" @change="limpiarClasificacion">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field is-grouped is-grouped-centered">
            <p class="control">Decisión</p>
            <div class="control">
              <input type="checkbox" v-model="listaClasificacion" value="decision" @change="limpiarClasificacion">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field is-grouped is-grouped-centered">
            <p class="control">Otros</p>
            <div class="control">
              <input type="checkbox" v-model="listaClasificacion" value="otro" @change="limpiarClasificacion">
            </div>
          </div>
        </div>
      </div>
      <div class="columns" v-if="entradas.clasificacion">
        <div class="column is-4 is-offset-4">
          <p class="is-danger help has-text-centered">No se ha ingresado la clasificación de la reunión</p>
        </div>
      </div>

      <br>
      <div class="columns">
        <div class="column is-8 is-offset-2">
          <p class="title is-5 has-text-centered">Objetivos</p>
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-2 is-offset-3">
              <a class="button is-small is-info-usach is-rounded" @click="agregarObjetivo"><strong>+</strong></a>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-10 is-offset-1">
          <div class="content has-text-left">
            <ul>
              <li v-for="(objetivo, index) in objetivos" :key="index">
                <div class="field is-grouped">
                  <p class="control is-expanded has-icons-right">
                    <input v-model="objetivos[index].descripcion" class="input is-normal" type="text" @input="validarObjetivos">
                    <span class="icon is-right">
                      <button class="delete" @click="removerObjetivo(objetivo)"></button>
                    </span>
                  </p>
                </div>
              </li>
            </ul>
            <p class="is-danger help" v-if="entradas.objetivos">No se han llenado todos los objetivos</p>
          </div>
        </div>
      </div>

      <br>
      <div class="columns">
        <div class="column is-8 is-offset-2">
          <p class="title is-5 has-text-centered">Resultados / Conclusiones</p>
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-2 is-offset-3">
              <a class="button is-small is-info-usach is-rounded" @click="agregarConclusion"><strong>+</strong></a>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-10 is-offset-1">
          <div class="content has-text-left">
            <ul>
              <li v-for="(conclusion, index) in conclusiones" :key="index">
                <div class="field is-grouped">
                  <p class="control is-expanded has-icons-right">
                    <input v-model="conclusiones[index].descripcion" class="input is-normal" type="text" @input="validarConclusiones">
                    <span class="icon is-right">
                      <button class="delete" @click="removerConclusion(conclusion)"></button>
                    </span>
                  </p>
                </div>
              </li>
            </ul>
            <p class="is-danger help" v-if="entradas.conclusiones">No se han ingresado todas las conclusiones</p>
          </div>
        </div>
      </div>

      <div>
        <br>
        <div class="columns is-centered">
          <div class="column is-8">
            <p class="title is-5 has-text-centered">Acuerdos / Compromisos</p>
          </div>
        </div>
        <table class="table is-hoverable is-fullwidth" summary="Items de la minuta">
          <thead>
            <tr>
              <th scope="col" class="is-narrow has-text-centered">
                N°
              </th>
              <th scope="col" class="has-text-centered">
                Item
                <span id="icono-ayuda" ayuda="Tipo de Actividad" class="icon is-large">
                  <i class="far fa-question-circle"></i>
                </span>
              </th>
              <th scope="col" class="has-text-centered">
                Descripción
                <span id="icono-ayuda" ayuda="Descripción de la actividad realizada" class="icon is-large">
                  <i class="far fa-question-circle"></i>
                </span>
              </th>
              <th scope="col" class="has-text-centered">
                Fecha
                <span id="icono-ayuda" ayuda="Fecha comprometida para la actividad" class="icon is-large">
                  <i class="far fa-question-circle"></i>
                </span>
              </th>
              <th scope="col" class="has-text-centered">
                Responsable
                <span id="icono-ayuda" ayuda="Responsable a realizarla" class="icon is-large">
                  <i class="far fa-question-circle"></i>
                </span>
              </th>
              <th scope="col" class="has-text-centered"><a class="button is-rounded is-info-usach is-small" @click="agregarItem"><strong>+</strong></a></th>
            </tr>
          </thead>
          <tbody>
            <tr class="is-vcentered" v-for="(item, index) in listaItems" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td class="has-text-centered">
                <div class="select is-small">
                  <select v-model="item.tipo_item_id" @change="validarItem(index)">
                    <option v-for="item in tipoItemsFiltrada" :key="item.id" :value="item.id">{{ item.tipo }}</option>
                  </select>
                </div>
                <p class="is-danger help" v-if="item.entradas.tipo_item">No se ha ingresado el tipo de ítem</p>
              </td>
              <td>
                <textarea class="textarea is-small is-extend" v-model="item.descripcion" @input="validarItem(index)"></textarea>
                <p class="is-danger help" v-if="item.entradas.descripcion">No se ha ingresado la descripción del ítem</p>
              </td>
              <td>
                <input class="input is-small has-text-centered" type="date" v-model="item.fecha" @input="validarItem(index)">
                <p class="is-danger help" v-if="item.entradas.fecha">No se ha ingresado la fecha</p>
              </td>
              <td class="has-text-centered">
                <div class="select is-small">
                  <select v-model="item.responsables" @change="validarItem(index)">
                    <option :value="{'tipo': '', 'id': 0}" selected>- Sin Asig -</option>
                    <option v-for="integrante in grupo.estudiantes" :key="integrante.id" :value="{'tipo': 'est', 'id': integrante.id}">{{ integrante.iniciales }}</option>
                    <option v-for="integrante in grupo.stakeholders" :key="integrante.id" :value="{'tipo': 'stk', 'id': integrante.id}" v-show="minuta.tipo === 'Cliente'">{{ integrante.iniciales }}</option>
                  </select>
                </div>
                <p class="is-danger help" v-if="item.entradas.responsables">Falta asignar responsable</p>
              </td>
              <td class="has-text-centered">
                <button class="delete is-medium" @click="removerItem(item)"></button>
              </td>
            </tr>
          </tbody>
        </table>
        <br>
      </div>

      <div class="columns">
        <div class="column is-half is-offset-3">
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <a class="button is-primary-usach" @click="guardarMinuta">Guardar borrador</a>
            </div>
            <div class="control">
              <a class="button is-secondary-usach" @click="emitirMinuta">Emitir minuta</a>
            </div>
            <div class="control">
              <a class="button is-light-usach" @click="cancelarEnvio">Cancelar</a>
            </div>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'Minuta',
  props: ['tipoMinuta', 'idBitacora', 'idMotivo', 'letraRevision', 'reEmitir', 'estado'],
  data () {
    return {
      bitacora: this.idBitacora,
      minuta: {
        estudiante_id: 0,
        codigo: '',
        correlativo: 0,
        fecha_reunion: '',
        h_inicio: '',
        h_termino: '',
        tipo_minuta_id: this.tipoMinuta,
        tipo: ''
      },
      clasificacion: {
        informativa: false,
        avance: false,
        coordinacion: false,
        decision: false,
        otro: false
      },
      tema: '',
      revision: this.letraRevision,
      asistenciaEst: [],
      asistenciaStk: [],
      objetivos: [{ id: 0, descripcion: '' }],
      conclusiones: [{ id: 0, descripcion: '' }],
      item: {
        correlativo: 0,
        descripcion: '',
        fecha: '',
        tipo_item_id: 0,
        responsables: { tipo: '', id: 0 },
        entradas: {
          descripcion: false,
          fecha: false,
          tipo_item: false,
          responsables: false
        }
      },
      motivo_id: this.idMotivo,
      listaItems: [
        {
          correlativo: 1,
          descripcion: '',
          fecha: '',
          tipo_item_id: 0,
          responsables: { tipo: '', id: 0 },
          entradas: {
            descripcion: false,
            fecha: false,
            tipo_item: false,
            responsables: false
          }
        }
      ],
      tipo_items: [],
      tipo_asistencias: [],
      tipo_estados: [],
      motivos: [],
      listaClasificacion: [],
      estudiante: {},
      grupo: {},
      semestre: {},
      entradas: {
        revision: {
          error: false,
          mensaje: ''
        },
        fecha_reunion: false,
        tema: false,
        h_inicio: false,
        h_termino: false,
        asistencias: false,
        clasificacion: false,
        objetivos: false,
        conclusiones: false
      },
      nuevaEmision: this.reEmitir,
      revisionEstado: this.estado
    }
  },
  computed: {
    ...mapState(['apiUrl', 'usuario', 'tipoMinutas']),

    esBorrador: function () {
      return this.bitacora !== 0
    },
    tipoItemsFiltrada: function () {
      var lista = []
      for (var i = 0; i < this.tipo_items.length; i++) {
        if (this.tipo_items[i].rango === 1) {
          lista.push(this.tipo_items[i])
        }
      }
      return lista
    }
  },
  methods: {
    removeFromArray: function (arr, item) {
      var i = arr.indexOf(item)
      i !== -1 && arr.splice(i, 1)
    },
    nombreCompleto (estudiante) {
      return Funciones.nombreCompleto(estudiante)
    },
    convertirFecha: function (timestamp) {
      return Funciones.convertirFecha(timestamp)
    },
    buscarIdEnLista: function (array, llave, busqueda) {
      return Funciones.obtenerIdDeLista(array, llave, busqueda)
    },
    obtenerTipoMinuta: function () {
      if (this.minuta.tipo_minuta_id === null || this.minuta.tipo_minuta_id === undefined) {
        this.minuta.tipo = ''
      } else {
        var tipo = Funciones.busquedaPorId(this.tipoMinutas, this.minuta.tipo_minuta_id)
        this.minuta.tipo = tipo.tipo
      }
    },
    convertirClasificacion: function (obj) {
      var lista = []
      var llaves = Object.keys(obj)
      for (var i = 0; i < llaves.length; i++) {
        if (obj[llaves[i]]) {
          lista.push(llaves[i])
        }
      }
      return lista
    },
    convertirResponsable: function (listaAsistencia, obj) {
      var asistencia = Funciones.busquedaPorId(listaAsistencia, obj.asistencia_id)
      if (asistencia.id_estudiante !== null) {
        return { tipo: 'est', id: asistencia.id_estudiante }
      } else if (asistencia.id_stakeholder !== null) {
        return { tipo: 'stk', id: asistencia.id_stakeholder }
      } else {
        return { tipo: '', id: 0 }
      }
    },
    convertirItems: function (array, asistencia) {
      var lista = []
      for (var i = 0; i < array.length; i++) {
        var aux = {
          correlativo: 1,
          descripcion: '',
          fecha: '',
          tipo_item_id: 0,
          responsables: 0,
          entradas: {
            descripcion: false,
            fecha: false,
            tipo_item: false,
            responsables: false
          }
        }
        aux.correlativo = array[i].correlativo
        aux.descripcion = array[i].descripcion
        if (array[i].fecha !== null) {
          aux.fecha = this.convertirFecha(array[i].fecha)
        }
        if (array[i].responsables.length > 0) {
          aux.responsables = this.convertirResponsable(asistencia, array[i].responsables[0])
        }
        aux.tipo_item_id = this.buscarIdEnLista(this.tipo_items, 'tipo', array[i].tipo)
        lista.push(aux)
      }
      return lista.sort((a, b) => {
        if (a.correlativo < b.correlativo) {
          return -1
        } else {
          return 1
        }
      })
    },
    convertirAsistenciaEst: function (array) {
      var lista = []
      for (var i = 0; i < this.grupo.estudiantes.length; i++) {
        var obj = { estudiante: this.grupo.estudiantes[i].id, stakeholder: '', asistencia: 0 }
        for (var j = 0; j < array.length; j++) {
          if (array[j].id_estudiante !== null) {
            if (this.grupo.estudiantes[i].iniciales === array[j].iniciales) {
              obj.asistencia = this.buscarIdEnLista(this.tipo_asistencias, 'tipo', array[j].tipo)
            }
          }
        }
        lista.push(obj)
      }
      return lista
    },
    convertirAsistenciaStk: function (array) {
      var lista = []
      for (var i = 0; i < this.grupo.stakeholders.length; i++) {
        var obj = { estudiante: '', stakeholder: this.grupo.stakeholders[i].id, asistencia: 0 }
        for (var j = 0; j < array.length; j++) {
          if (array[j].id_stakeholder !== null) {
            if (this.grupo.stakeholders[i].iniciales === array[j].iniciales) {
              obj.asistencia = this.buscarIdEnLista(this.tipo_asistencias, 'tipo', array[j].tipo)
            }
          }
        }
        lista.push(obj)
      }
      return lista
    },
    agregarItem: function () {
      var nuevoItem = Object.assign({}, this.item)
      const anterior = this.listaItems[this.listaItems.length - 1].correlativo
      nuevoItem.correlativo = anterior + 1
      this.listaItems.push(nuevoItem)
    },
    removerItem: function (item) {
      if (this.listaItems.length > 1) {
        this.removeFromArray(this.listaItems, item)
      }
    },
    agregarObjetivo: function () {
      this.objetivos.push({ id: 0, descripcion: '' })
    },
    removerObjetivo: function (objetivo) {
      if (this.objetivos.length > 1) {
        this.removeFromArray(this.objetivos, objetivo)
      }
    },
    agregarConclusion: function () {
      this.conclusiones.push({ id: 0, descripcion: '' })
    },
    removerConclusion: function (conclusion) {
      if (this.conclusiones.length > 1) {
        this.removeFromArray(this.conclusiones, conclusion)
      }
    },
    limpiarCampos: function () {
      this.minuta = {
        estudiante_id: 0,
        codigo: '',
        correlativo: 0,
        fecha_reunion: '',
        h_inicio: '',
        h_termino: '',
        tipo_minuta_id: this.tipoMinuta
      }
      this.clasificacion = {
        informativa: false,
        avance: false,
        coordinacion: false,
        decision: false,
        otro: false
      }
      this.tema = ''
      this.revision = ''
      this.asistenciaEst = []
      this.asistenciaStk = []
      this.objetivos = ['']
      this.conclusiones = ['']
      this.motivo_id = 1
      this.listaItems = [
        {
          correlativo: 1,
          descripcion: '',
          fecha: '',
          tipo_item_id: 0,
          responsables: 0,
          entradas: {
            descripcion: false,
            fecha: false,
            tipo_item: false,
            responsables: false
          }
        }
      ]
    },
    async obtenerTiposItem () {
      try {
        const response = await axios.get(this.apiUrl + '/tipo_items', { headers: Auth.authHeader() })
        this.tipo_items = response.data
      } catch {
        console.log('No fue posible obtener los tipos de items')
      }
    },
    async obtenerTiposAsistencia () {
      try {
        const response = await axios.get(this.apiUrl + '/tipo_asistencias', { headers: Auth.authHeader() })
        this.tipo_asistencias = response.data
      } catch {
        console.log('No fue posible obtener los tipos de asistencia')
      }
    },
    async obtenerTiposEstado () {
      try {
        const response = await axios.get(this.apiUrl + '/tipo_estados', { headers: Auth.authHeader() })
        this.tipo_estados = response.data
      } catch {
        console.log('No fue posible obtener los tipos de estados')
      }
    },
    async obtenerInfoEstudiante () {
      try {
        const response = await axios.get(this.apiUrl + '/estudiantes/' + this.usuario.id, { headers: Auth.authHeader() })
        this.estudiante = response.data
        try {
          const respuesta = await axios.get(this.apiUrl + '/grupos/' + this.estudiante.grupo_id, { headers: Auth.authHeader() })
          this.grupo = respuesta.data
          this.obtenerCorrelativo()
        } catch {
          console.log('No fue posible obtener la información del grupo del estudiante')
        }
      } catch {
        console.log('No fue posible obtener la información del estudiante')
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
    async obtenerCorrelativo () {
      try {
        if (this.idBitacora === 0) {
          const response = await axios.get(this.apiUrl + '/minutas/correlativo/' + this.grupo.id.toString(), { headers: Auth.authHeader() })
          this.minuta.correlativo = response.data
          this.obtenerTipoMinuta()
        } else {
          this.obtenerMinuta()
        }
      } catch (e) {
        console.log('No fue posible obtener el correlativo')
      }
    },
    async obtenerMinuta () {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/' + this.bitacora.toString(), { headers: Auth.authHeader() })
        this.minuta.codigo = response.data.minuta.codigo
        this.minuta.correlativo = response.data.minuta.correlativo
        this.minuta.fecha_reunion = this.convertirFecha(response.data.minuta.fecha_reunion)
        this.minuta.h_inicio = Funciones.obtenerHora(response.data.minuta.h_inicio)
        this.minuta.h_termino = Funciones.obtenerHora(response.data.minuta.h_termino)
        this.minuta.tipo_minuta_id = this.buscarIdEnLista(this.tipoMinutas, 'tipo', response.data.minuta.tipo)
        this.asistenciaEst = this.convertirAsistenciaEst(response.data.minuta.asistencia)
        this.asistenciaStk = this.convertirAsistenciaStk(response.data.minuta.asistencia)
        this.clasificacion = response.data.minuta.clasificacion
        this.listaClasificacion = this.convertirClasificacion(response.data.minuta.clasificacion)
        this.tema = response.data.minuta.tema
        if (!this.nuevaEmision) {
          this.revision = response.data.revision
        }
        this.objetivos = response.data.minuta.objetivos
        this.conclusiones = response.data.minuta.conclusiones
        this.listaItems = this.convertirItems(response.data.minuta.items, response.data.minuta.asistencia)
        this.minuta.tipo = response.data.minuta.tipo
      } catch (e) {
        console.log(e)
      }
    },
    establecerId: function () {
      this.minuta.estudiante_id = this.estudiante.id
    },
    establecerClasificacion: function () {
      for (var i = 0; i < this.listaClasificacion.length; i++) {
        if (this.listaClasificacion[i] === 'informativa') {
          this.clasificacion.informativa = true
        } else if (this.listaClasificacion[i] === 'avance') {
          this.clasificacion.avance = true
        } else if (this.listaClasificacion[i] === 'decision') {
          this.clasificacion.decision = true
        } else if (this.listaClasificacion[i] === 'coordinacion') {
          this.clasificacion.coordinacion = true
        } else if (this.listaClasificacion[i] === 'otro') {
          this.clasificacion.otro = true
        }
      }
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
      var fecha = this.minuta.fecha_reunion.split('-')
      codigo += this.grupo.nombre + '_' + correlativo + '_' + semestre + '_' + fecha[1] + fecha[2]
      return codigo
    },
    async enviarMinuta (estado) {
      if (this.validarFormulario()) {
        this.establecerId()
        this.establecerClasificacion()
        const lista = []
        for (var i = 0; i < this.listaItems.length; i++) {
          var listaResp = []
          if (this.listaItems[i].responsables.length === undefined) {
            if (this.listaItems[i].responsables === 0) {
              listaResp.push({ tipo: '', id: 0 })
            } else {
              listaResp.push(this.listaItems[i].responsables)
            }
          } else {
            listaResp = this.listaItems[i].responsables
          }
          var item = {
            correlativo: this.listaItems[i].correlativo,
            descripcion: this.listaItems[i].descripcion,
            fecha: this.listaItems[i].fecha,
            tipo_item_id: this.listaItems[i].tipo_item_id,
            responsables: listaResp
          }
          lista.push(item)
        }
        const nuevaMinuta = {
          id: this.bitacora,
          minuta: {
            estudiante_id: this.minuta.estudiante_id,
            codigo: this.establecerCodigo(),
            correlativo: this.minuta.correlativo,
            fecha_reunion: this.minuta.fecha_reunion,
            h_inicio: this.minuta.h_inicio,
            h_termino: this.minuta.h_termino,
            tipo_minuta_id: this.minuta.tipo_minuta_id
          },
          clasificacion: this.clasificacion,
          tema: this.tema,
          objetivos: this.objetivos,
          conclusiones: this.conclusiones,
          items: lista,
          bitacora_revision: {
            revision: this.revision,
            motivo_id: this.motivo_id
          },
          asistencia: this.asistenciaEst.concat(this.asistenciaStk),
          tipo_estado: this.buscarIdEnLista(this.tipo_estados, 'abreviacion', estado)
        }
        if (this.bitacora === 0 || this.nuevaEmision) {
          try {
            await axios.post(this.apiUrl + '/minutas', nuevaMinuta, { headers: Auth.postHeader() })
            this.$emit('cerrar')
            this.limpiarCampos()
          } catch {
            if (estado === 'BOR') {
              console.log('No se pudo guardar la minuta')
            } else {
              console.log('No se pudo emitir la minuta')
            }
          }
        } else {
          try {
            await axios.patch(this.apiUrl + '/minutas/' + this.bitacora, nuevaMinuta, { headers: Auth.postHeader() })
            this.$emit('cerrar')
            this.limpiarCampos()
          } catch {
            if (estado === 'BOR') {
              console.log('No se pudo actualizar la información de la minuta')
            } else {
              console.log('No se pudo emitir la minuta')
            }
          }
        }
      }
    },
    guardarMinuta: function () {
      this.enviarMinuta('BOR')
    },
    emitirMinuta: function () {
      this.enviarMinuta('EMI')
    },
    cancelarEnvio: function () {
      this.$emit('cerrar')
      this.limpiarCampos()
    },
    validarRevision: function () {
      const regExp = /^([A-Z0-9]{1})$/
      const revision = this.revision
      if (revision === '' || revision === undefined) {
        this.entradas.revision.error = true
        this.entradas.revision.mensaje = 'No se ha ingresado la revisión de la minuta'
        return false
      } else if (!regExp.test(revision)) {
        this.entradas.revision.error = true
        this.entradas.revision.mensaje = 'Sólo letras mayúsculas o números'
        return false
      } else {
        this.entradas.revision.error = false
        this.entradas.revision.mensaje = ''
        return true
      }
    },
    validarFecha: function () {
      const regExp = /^(\d{4})-(\d{2})-(\d{2})$/
      const fecha = this.minuta.fecha_reunion
      if (fecha === '' || fecha === undefined || !regExp.test(fecha)) {
        this.entradas.fecha_reunion = true
        return false
      } else {
        this.entradas.fecha_reunion = false
        return true
      }
    },
    validarHora: function (hora) {
      const regExp = /^(\d{2}):(\d{2})$/
      return regExp.test(hora)
    },
    validarHinicio: function () {
      const validacion = this.validarHora(this.minuta.h_inicio)
      if (validacion) {
        this.entradas.h_inicio = false
        return true
      } else {
        this.entradas.h_inicio = true
        return false
      }
    },
    validarHtermino: function () {
      const validacion = this.validarHora(this.minuta.h_termino)
      if (validacion) {
        this.entradas.h_termino = false
        return true
      } else {
        this.entradas.h_termino = true
        return false
      }
    },
    validarTema: function () {
      if (this.tema === '') {
        this.entradas.tema = true
        return false
      } else {
        this.entradas.tema = false
        return true
      }
    },
    limpiarAsistencias: function () {
      this.entradas.asistencias = false
    },
    validarAsistencia: function () {
      if (this.asistenciaEst.length < this.grupo.estudiantes.length) {
        this.entradas.asistencias = true
        return false
      } else {
        this.entradas.asistencias = false
        return true
      }
    },
    limpiarClasificacion: function () {
      this.entradas.clasificacion = false
    },
    validarClasificacion: function () {
      if (this.listaClasificacion.length === 0) {
        this.entradas.clasificacion = true
        return false
      } else {
        this.entradas.clasificacion = false
        return true
      }
    },
    validarObjetivos: function () {
      if (this.objetivos.length === 1) {
        if (this.objetivos[0].descripcion === '') {
          this.entradas.objetivos = true
          return false
        } else {
          this.entradas.objetivos = false
          return true
        }
      } else {
        var validar = true
        for (var i = 0; i < this.objetivos.length; i++) {
          if (this.objetivos[i].descripcion === '') {
            validar = false
            this.entradas.objetivos = true
          }
        }
        return validar
      }
    },
    validarConclusiones: function () {
      if (this.conclusiones.length === 1) {
        if (this.conclusiones[0].descripcion === '') {
          this.entradas.conclusiones = true
          return false
        } else {
          this.entradas.conclusiones = false
          return true
        }
      } else {
        var validar = true
        for (var i = 0; i < this.conclusiones.length; i++) {
          if (this.conclusiones[i].descripcion === '') {
            validar = false
            this.entradas.conclusiones = true
          }
        }
        return validar
      }
    },
    obtenerIdTipoItem: function (tipo) {
      for (var i = 0; i < this.tipo_items.length; i++) {
        if (this.tipo_items[i].tipo === tipo) {
          return this.tipo_items[i].id
        }
      }
    },
    validarItem: function (index) {
      var validacion = true
      if (this.listaItems[index].descripcion === '' || this.listaItems[index].descripcion === undefined) {
        this.listaItems[index].entradas.descripcion = true
        validacion = validacion && false
      } else {
        this.listaItems[index].entradas.descripcion = false
      }
      if (this.listaItems[index].tipo_item_id === 0) {
        this.listaItems[index].entradas.tipo_item = true
        validacion = validacion && false
      } else if (this.listaItems[index].tipo_item_id === this.obtenerIdTipoItem('Agenda') || this.listaItems[index].tipo_item_id === this.obtenerIdTipoItem('Por hacer') || this.listaItems[index].tipo_item_id === this.obtenerIdTipoItem('Compromiso')) {
        this.listaItems[index].entradas.tipo_item = false
        if (this.listaItems[index].fecha === '') {
          this.listaItems[index].entradas.fecha = true
          validacion = validacion && false
        } else {
          this.listaItems[index].entradas.fecha = false
        }
      } else if (this.listaItems[index].tipo_item_id === this.obtenerIdTipoItem('Hecho') || this.listaItems[index].tipo_item_id === this.obtenerIdTipoItem('Idea') || this.listaItems[index].tipo_item_id === this.obtenerIdTipoItem('Compromiso')) {
        this.listaItems[index].entradas.tipo_item = false
        if (this.listaItems[index].responsables === 0) {
          this.listaItems[index].entradas.responsables = true
          validacion = validacion && false
        } else {
          this.listaItems[index].entradas.responsables = false
        }
      } else {
        this.listaItems[index].entradas.tipo_item = false
      }
      return validacion
    },
    validarListaItems: function () {
      const items = this.listaItems
      var validacion = true
      for (var i = 0; i < items.length; i++) {
        validacion = validacion && this.validarItem(i)
      }
      return validacion
    },
    validarFormulario: function () {
      var validacion = true
      validacion = validacion && this.validarFecha()
      validacion = validacion && this.validarHinicio()
      validacion = validacion && this.validarHtermino()
      validacion = validacion && this.validarTema()
      validacion = validacion && this.validarAsistencia()
      validacion = validacion && this.validarClasificacion()
      validacion = validacion && this.validarObjetivos()
      validacion = validacion && this.validarConclusiones()
      validacion = validacion && this.validarListaItems()
      return validacion
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerTiposItem()
      this.obtenerTiposAsistencia()
      this.obtenerTiposEstado()
      this.obtenerInfoEstudiante()
      this.obtenerSemestre()
    }
  }
}
</script>
<style scoped>
</style>
