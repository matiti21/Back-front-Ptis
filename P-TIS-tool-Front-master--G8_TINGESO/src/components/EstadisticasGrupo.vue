<template>
  <div>
    <br>

    <div>
      <SelectorJornada/>
      <SelectorGrupo @eleccion="seleccionGrupo"/>
    </div>

    <br>
    <br>
    <div v-if="mostrarRegistros">
      <div class="field">
        <div class="control">
          <label id="participacion" class="label">Participación de estudiantes en confección de minutas de reunión</label>
        </div>
      </div>
      <table class="table is-fullwidth" aria-describedby="participacion">
        <thead>
          <tr class="has-background-light">
            <th scope="col" class="has-text-centered">R.U.N.</th>
            <th scope="col" class="has-text-centered">Estudiante</th>
            <th scope="col" class="has-text-centered"><abbr title="Definición de los datos de las minutas como: hora de inicio, hora de término, clasificación y asistencia">Minutas</abbr></th>
            <th scope="col" class="has-text-centered"><abbr title="Definición del tema a tratar en las minutas">Tema</abbr></th>
            <th scope="col" class="has-text-centered"><abbr title="Definición de los objetivos de las minutas">Objetivos</abbr></th>
            <th scope="col" class="has-text-centered"><abbr title="Definición de las conclusiones de las minutas">Conclusiones</abbr></th>
            <th scope="col" class="has-text-centered"><abbr title="Definición de los ítems de las minutas, estableciendo los responsables y fechas de los compromisos">Ítems</abbr></th>
            <th scope="col" class="has-text-centered"><abbr title="Ingreso de comentarios a las minutas realizadas">Comentarios</abbr></th>
            <th scope="col" class="has-text-centered"><abbr title="Ingreso de respuestas a los comentarios realizados a las minutas">Respuestas</abbr></th>
            <th scope="col" class="has-text-centered">Subtotal</th>
            <th scope="col" class="has-text-centered">Participación</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col" class="has-text-right">Total:</th>
            <th scope="col" class="has-text-centered">{{totalRegistros}}</th>
            <th scope="col"></th>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="estudiante in registros" :key="estudiante.id">
            <td class="has-text-centered">{{visualizarRun(estudiante.usuario.run)}}</td>
            <td>{{nombreCompleto(estudiante.usuario)}}</td>
            <td class="has-text-centered">{{estudiante.usuario.registros.minutas}}</td>
            <td class="has-text-centered">{{estudiante.usuario.registros.tema}}</td>
            <td class="has-text-centered">{{estudiante.usuario.registros.objetivos}}</td>
            <td class="has-text-centered">{{estudiante.usuario.registros.conclusiones}}</td>
            <td class="has-text-centered">{{estudiante.usuario.registros.items}}</td>
            <td class="has-text-centered">{{estudiante.usuario.registros.comentarios}}</td>
            <td class="has-text-centered">{{estudiante.usuario.registros.respuestas}}</td>
            <th scope="row" class="has-text-centered">{{subTotalRegistros(estudiante)}}</th>
            <th scope="row" class="has-text-right">{{porcentajeParcial(estudiante)}} %</th>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import axios from 'axios'
import { mapState } from 'vuex'
import Funciones from '@/services/funciones.js'

import SelectorJornada from '@/components/SelectorJornada.vue'
import SelectorGrupo from '@/components/SelectorGrupo.vue'

export default {
  name: 'EstadisticasGrupo',
  components: {
    SelectorJornada,
    SelectorGrupo
  },
  data () {
    return {
      grupoSeleccionado: {},
      registros: []
    }
  },
  computed: {
    ...mapState(['apiUrl', 'jornadaActual']),

    mostrarRegistros: function () {
      return this.registros.length > 0
    },
    totalRegistros: function () {
      if (this.registros.length > 0) {
        var total = 0
        for (var i = 0; i < this.registros.length; i++) {
          total = total + this.subTotalRegistros(this.registros[i])
        }
        return total
      } else {
        return 0
      }
    }
  },
  methods: {
    nombreCompleto: function (usuario) {
      return Funciones.nombreCompleto(usuario)
    },
    visualizarRun: function (run) {
      return Funciones.visualizarRun(run)
    },
    seleccionGrupo: function (grupo) {
      this.grupoSeleccionado = grupo
      this.obtenerRegistros(grupo.id)
    },
    async obtenerRegistros (id) {
      try {
        const response = await axios.get(this.apiUrl + '/registros/grupo/' + id, { headers: Auth.authHeader() })
        this.registros = response.data
      } catch (e) {
        console.log(e)
      }
    },
    subTotalRegistros: function (estudiante) {
      var suma = 0
      var arreglo = Object.keys(estudiante.usuario.registros)
      for (var i = 0; i < arreglo.length; i++) {
        suma = suma + estudiante.usuario.registros[arreglo[i]]
      }
      return suma
    },
    porcentajeParcial: function (estudiante) {
      if (this.registros.length > 0) {
        var subTotal = this.subTotalRegistros(estudiante)
        var porcentaje = 0
        if (this.totalRegistros > 0) {
          porcentaje = (subTotal / this.totalRegistros) * 100
        }
        return porcentaje.toFixed(1)
      } else {
        return 0
      }
    }
  },
  watch: {
    jornadaActual: function () {
      this.registros = []
    }
  }
}
</script>
