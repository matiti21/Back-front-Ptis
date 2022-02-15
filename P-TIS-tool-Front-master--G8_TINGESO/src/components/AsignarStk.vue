<template>
  <div>

    <SelectorGrupo @eleccion="seleccionarGrupo"/>

    <div v-if="mostrarStakeholders">
      <br>
      <br>
      <div class="columns">
        <div class="column is-10 is-offset-1">
          <div v-if="mostrarTabla">

            <div class="field">
              <div class="control">
                <label id="stakeholders" class="label">Clientes</label>
              </div>
            </div>

            <div>
              <table class="table is-bordered is-fullwidth is-narrow" aria-describedby="stakeholders">
                <thead>
                  <tr class="has-background-light">
                    <th scope="col" class="has-text-centered">N°</th>
                    <th scope="col" class="has-text-centered">Nombre cliente</th>
                    <th scope="col" class="has-text-centered">Correo electrónico</th>
                    <th scope="col" class="has-text-centered"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(stakeholder, index) in listaStakeholders" :key="stakeholder.id">
                    <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
                    <td class="has-text-left">{{ nombreCompleto(stakeholder.usuario) }}</td>
                    <td class="has-text-centered">{{ stakeholder.usuario.email }}</td>
                    <td class="has-text-centered"><input type="checkbox" v-model="asignados" :value="stakeholder.id"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br>
            <br>
            <div class="columns is-centered">
              <div class="column is-half" v-if="mostrarAsignar">
                <div class="columns">
                  <div class="column is-5 is-offset-1">
                    <div class="field">
                      <div class="control">
                        <button class="button is-secondary-usach is-fullwidth" @click="cambiarAsignacion">Asignar</button>
                      </div>
                    </div>
                  </div>
                  <div class="column is-1"></div>
                  <div class="column is-5">
                    <div class="field">
                      <div class="control">
                        <button class="button is-info-usach is-fullwidth" @click="cerrar">Volver</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-half" v-else>
                <div class="field">
                  <div class="control">
                    <button class="button is-info-usach is-fullwidth" @click="cerrar">Volver</button>
                  </div>
                </div>
              </div>
            </div>

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

import SelectorGrupo from '@/components/SelectorGrupo.vue'

export default {
  name: 'AsignarStk',
  components: {
    SelectorGrupo
  },
  data () {
    return {
      grupoSeleccionado: {},
      mostrarStakeholders: false,
      asignados: [],
      listaStakeholders: []
    }
  },
  computed: {
    ...mapState(['apiUrl', 'jornadaActual']),

    mostrarTabla: function () {
      return this.listaStakeholders.length > 0
    },
    mostrarAsignar: function () {
      return this.asignados.length > 0
    }
  },
  methods: {
    seleccionarGrupo: function (grupo) {
      this.grupoSeleccionado = grupo
      this.mostrarStakeholders = true
      this.stakeholdersAsignados()
    },
    nombreCompleto: function (cliente) {
      return Funciones.nombreCompleto(cliente)
    },
    buscarIndex: function (lista, id) {
      return Funciones.buscarIndexPorId(lista, id)
    },
    stakeholdersAsignados: function () {
      var aux = 0
      this.asignados = []
      var lista = this.grupoSeleccionado.stakeholders
      for (var i = 0; i < lista.length; i++) {
        aux = this.buscarIndex(this.listaStakeholders, lista[i].id)
        if (aux !== -1) {
          this.asignados[aux] = lista[i].id
        }
      }
    },
    async obtenerStakeholders () {
      try {
        const response = await axios.get(this.apiUrl + '/stakeholders', { headers: Auth.authHeader() })
        this.listaStakeholders = response.data
      } catch (e) {
        console.log('No fue posible obtener el listado de stakeholders del sistema')
        console.log(e)
      }
    },
    async cambiarAsignacion () {
      const asignacion = {
        stakeholders: this.asignados
      }
      try {
        await axios.put(this.apiUrl + '/grupos/asignacion/stakeholders/' + this.grupoSeleccionado.id, asignacion, { headers: Auth.postHeader() })
        this.$emit('actualizar')
      } catch (e) {
        console.log('No fue posible actualizar la asignación de clientes al grupo seleccionado')
        console.log(e)
      }
    },
    cerrar: function () {
      this.$emit('cerrar')
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerStakeholders()
    }
  }
}
</script>
