<template>
  <div>

    <div v-if="mostrarRegistros">
      <table class="table is-bordered is-fullwidth" summary="Registro de actividades">
        <thead>
          <tr class="has-background-light">
            <th scope="col" class="has-text-centered">N°</th>
            <th scope="col" class="has-text-centered">Realizada por</th>
            <th scope="col" class="has-text-centered">Actividad</th>
            <th scope="col" class="has-text-centered">Realizada el</th>
            <th scope="col" class="has-text-centered">Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(registro, index) in registros" :key="registro.id">
            <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
            <td class="has-text-centered">{{ registro.usuario.iniciales }}</td>
            <td>{{ registro.tipo_actividad.descripcion }}</td>
            <td class="has-text-centered">{{ obtenerFecha(registro.created_at) }}</td>
            <td class="has-text-centered">{{ obtenerHora(registro.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <br>
    <br>
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <div class="field">
          <div class="control">
            <a class="button is-info-usach is-fullwidth" @click="cerrar">Cerrar registro</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import { mapState } from 'vuex'

export default {
  name: 'RegistroMinuta',
  props: ['idBitacora'],
  data () {
    return {
      id: this.idBitacora,
      registros: []
    }
  },
  computed: {
    ...mapState(['apiUrl']),

    mostrarRegistros: function () {
      return this.registros.length > 0
    }
  },
  methods: {
    obtenerFecha: function (fecha) {
      return Funciones.obtenerFecha(fecha)
    },
    obtenerHora: function (timestamp) {
      return Funciones.obtenerHora(timestamp)
    },
    async obtenerRegistros () {
      try {
        const response = await axios.get(this.apiUrl + '/registros/' + this.id, { headers: Auth.authHeader() })
        this.registros = response.data
      } catch (e) {
        console.log('No fue posible obtener los registros')
        console.log(e)
      }
    },
    cerrar: function () {
      this.$emit('cerrar')
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerRegistros()
    }
  }
}
</script>
