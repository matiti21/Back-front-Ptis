<template>
  <div>

    <div class="columns">
      <div class="column is-full">
        <p class="title is-4 has-text-centered">MINUTA DE REUNIÓN</p>
        <p class="subtitle is-6 has-text-centered">{{ bitacora.minuta.codigo }}_{{ bitacora.revision }}</p>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Proyecto:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input is-static" type="text" :value="grupo.proyecto">
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
            <input class="input has-text-centered is-static" type="text" :value="grupo.correlativo">
          </p>
        </div>
      </div>
      <div class="field-label-2c is-normal">
        <label class="label">N° de reunión:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input has-text-centered is-static" type="text" :value="bitacora.minuta.correlativo">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label-2c is-normal">
        <label class="label">Revisión:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input has-text-centered is-static" type="text" :value="revisionEstado">
          </p>
        </div>
      </div>
      <div class="field-label-2c is-normal">
        <label class="label">Fecha de la reunión:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input has-text-centered is-static" type="text" :value="fechaReunion">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label-2c is-normal">
        <label class="label">Hora de inicio:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input has-text-centered is-static" type="text" :value="horaInicio">
          </p>
        </div>
      </div>
      <div class="field-label-2c is-normal">
        <label class="label">Hora de término:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input has-text-centered is-static" type="text" :value="horaTermino">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Tema:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input is-static" type="text" :value="bitacora.minuta.tema">
          </p>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-11 is-offset-1">
        <br>
        <table class="table is-fullwidth" summary="Asistencia">
          <thead>
            <tr>
              <th scope="col">Participantes</th>
              <th scope="col"></th>
              <th scope="col" class="has-text-centered">Iniciales</th>
              <th scope="col" class="has-text-centered">Asistencia</th>
            </tr>
          </thead>
          <tbody class="has-text-centered">
            <tr v-for="estudiante in grupo.estudiantes" :key="estudiante.id">
              <td class="has-text-left has-text-info has-text-wight-semibold">{{ nombreCompleto(estudiante.usuario) }}</td>
              <td></td>
              <td class="has-text-centered">{{ estudiante.iniciales }}</td>
              <td class="has-text-centered">{{ asistenciaEstudiante(estudiante.iniciales) }}</td>
            </tr>
            <tr v-for="cliente in grupo.stakeholders" :key="cliente.id" v-show="bitacora.minuta.tipo === 'Cliente'">
              <td class="has-text-link has-text-weight-semibold">{{ nombreCompleto(cliente.usuario) }}</td>
              <td></td>
              <td class="has-text-centered">{{ cliente.iniciales }}</td>
              <td class="has-text-centered">{{ asistenciaStakeholder(cliente.iniciales) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="columns">
      <div class="column is-full">
        <p class="title is-5 has-text-centered">CLASIFICACIÓN</p>
      </div>
    </div>
    <div class="columns">
      <div class="column is-2 is-offset-1">
        <div class="tags are-medium has-addons">
          <span class="tag is-medium">Informativa</span>
          <span class="tag is-medium" :class="bitacora.minuta.clasificacion.informativa ? 'is-info' : 'is-danger is-light'">{{ bitacora.minuta.clasificacion.informativa ? 'Si' : 'No'}}</span>
        </div>
      </div>
      <div class="column">
        <div class="tags are-medium has-addons">
          <span class="tag">Control de Avance</span>
          <span class="tag" :class="bitacora.minuta.clasificacion.avance ? 'is-info' : 'is-danger is-light'">{{ bitacora.minuta.clasificacion.avance ? 'Si' : 'No' }}</span>
        </div>
      </div>
      <div class="column">
        <div class="tags are-medium has-addons">
          <span class="tag">Coordinación</span>
          <span class="tag" :class="bitacora.minuta.clasificacion.coordinacion ? 'is-info' : 'is-danger is-light'">{{ bitacora.minuta.clasificacion.coordinacion ? 'Si' : 'No' }}</span>
        </div>
      </div>
      <div class="column">
        <div class="tags are-medium has-addons">
          <span class="tag">Decisión</span>
          <span class="tag" :class="bitacora.minuta.clasificacion.decision ? 'is-info' : 'is-danger is-light'">{{ bitacora.minuta.clasificacion.decision ? 'Si' : 'No'}}</span>
        </div>
      </div>
      <div class="column">
        <div class="tags are-medium has-addons">
          <span class="tag">Otros</span>
          <span class="tag" :class="bitacora.minuta.clasificacion.otro ? 'is-info' : 'is-danger is-light'">{{ bitacora.minuta.clasificacion.otro ? 'Si' : 'No'}}</span>
        </div>
      </div>
    </div>
    <br>

  </div>
</template>

<script>
import Funciones from '@/services/funciones.js'

export default {
  name: 'Informacion',
  props: ['proyecto', 'minuta'],
  data () {
    return {
      grupo: this.proyecto,
      bitacora: this.minuta
    }
  },
  computed: {
    horaInicio: function () {
      return this.obtenerHora(this.bitacora.minuta.h_inicio)
    },
    horaTermino: function () {
      return this.obtenerHora(this.bitacora.minuta.h_termino)
    },
    fechaReunion: function () {
      var fecha = this.bitacora.minuta.fecha_reunion.split('T')
      var separar = fecha[0].split('-')
      return separar[2] + '-' + separar[1] + '-' + separar[0]
    },
    revisionEstado: function () {
      if (Object.keys(this.bitacora).length > 0) {
        return Funciones.convertirRevisionAEstado(this.bitacora.identificador)
      } else {
        return ''
      }
    }
  },
  methods: {
    nombreCompleto: function (estudiante) {
      return Funciones.nombreCompleto(estudiante)
    },
    obtenerHora: function (timestamp) {
      var separar = timestamp.split('T')
      var tiempo = separar[1].split(':')
      return tiempo[0] + ':' + tiempo[1]
    },
    asistenciaEstudiante: function (iniciales) {
      return Funciones.asistenciaParticipante(this.bitacora.minuta.asistencia, 'id_estudiante', iniciales)
    },
    asistenciaStakeholder: function (iniciales) {
      return Funciones.asistenciaParticipante(this.bitacora.minuta.asistencia, 'id_stakeholder', iniciales)
    }
  }
}
</script>
