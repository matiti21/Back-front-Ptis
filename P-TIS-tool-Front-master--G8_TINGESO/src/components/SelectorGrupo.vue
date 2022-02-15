<template>
  <div>

    <div class="columns">
      <div class="column is-three-fifths">
        <div v-if="mostrarGrupos">
          <div class="field">
            <div class="control">
              <label id="grupos" class="label">Listado de grupos</label>
            </div>
          </div>
          <table class="table is-fullwidth" aria-describedby="grupos">
            <thead>
              <tr>
                <th scope="col">N°</th>
                <th scope="col">Grupo</th>
                <th scope="col">Proyecto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(grupo, index) in gruposJornada" :key="grupo.id">
                <th scope="row" :class="{ 'is-selected-usach' : grupoActual === grupo.id}">{{ index + 1 }}</th>
                <td :class="{ 'is-selected-usach' : grupoActual === grupo.id}" @click="seleccionarGrupo(grupo.id)">{{ grupo.nombre }}</td>
                <td :class="{ 'is-selected-usach' : grupoActual === grupo.id}" @click="seleccionarGrupo(grupo.id)"><a>{{ grupo.proyecto }}</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <div v-if="grupoActual !== 0">
          <div class="field">
            <div class="control">
              <label id="estudiantes" class="label">Estudiantes</label>
            </div>
          </div>
          <div>
            <table class="table is-fullwidth" aria-describedby="estudiantes">
              <thead>
                <tr>
                  <th scope="col">R.U.N.</th>
                  <th scope="col">Nombre</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="estudiante in grupoSeleccionado.estudiantes" :key="estudiante.id">
                  <td class="is-vcentered">{{ visualizarRun(estudiante.usuario.run) }}</td>
                  <td>{{ nombreCompleto(estudiante.usuario) }}</td>
                </tr>
              </tbody>
            </table>
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
  name: 'SelectorGrupo',
  data () {
    return {
      grupoActual: 0,
      grupoSeleccionado: {},
      listaGrupos: []
    }
  },
  computed: {
    ...mapState(['apiUrl', 'jornadaActual']),

    gruposJornada: function () {
      var lista = []
      for (var i = 0; i < this.listaGrupos.length; i++) {
        if (this.listaGrupos[i].jornada === this.jornadaActual) {
          lista.push(this.listaGrupos[i])
        }
      }
      return lista
    },
    mostrarGrupos: function () {
      return this.gruposJornada.length > 0
    }
  },
  methods: {
    nombreCompleto: function (estudiante) {
      return Funciones.nombreCompleto(estudiante)
    },
    visualizarRun: function (run) {
      return Funciones.visualizarRun(run)
    },
    buscarPorId: function (lista, id) {
      return Funciones.busquedaPorId(lista, id)
    },
    async obtenerGrupos () {
      try {
        const response = await axios.get(this.apiUrl + '/grupos', { headers: Auth.authHeader() })
        this.listaGrupos = response.data
      } catch (e) {
        console.log('No se han obtenido los grupos')
        console.log(e)
      }
    },
    seleccionarGrupo: function (id) {
      this.grupoActual = id
      this.grupoSeleccionado = this.buscarPorId(this.listaGrupos, id)
      this.$emit('eleccion', this.grupoSeleccionado)
    }
  },
  watch: {
    jornadaActual: function () {
      this.grupoActual = 0
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerGrupos()
    }
  }
}
</script>
