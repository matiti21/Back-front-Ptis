<template>
  <div>

    <div v-if="mostrarJornadas">
      <section>
        <div class="tabs is-toggle is-toggle-rounded is-centered">
          <ul>
            <li :class="{ 'is-active-usach' : jornadaActual === nombreTabs.diurna }" @click="elegirTab(nombreTabs.diurna)"><a><span>Diurnos</span></a></li>
            <li :class="{ 'is-active-usach' : jornadaActual === nombreTabs.vespertina }" @click="elegirTab(nombreTabs.vespertina)"><a><span>Vespertinos</span></a></li>
          </ul>
        </div>
      </section>
    </div>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import axios from 'axios'
import { mapState } from 'vuex'

const nombreTabs = {
  diurna: 'Diurna',
  vespertina: 'Vespertina'
}

export default {
  name: 'SelectorJornada',
  data () {
    return {
      mostrarJornadas: false,
      jornadasProfesor: [],
      nombreTabs
    }
  },
  computed: {
    ...mapState(['apiUrl', 'jornadaActual'])
  },
  methods: {
    async obtenerJornadas () {
      try {
        const response = await axios.get(this.apiUrl + '/jornadas', { headers: Auth.authHeader() })
        var datos = response.data
        if (Object.keys(datos).length > 0) {
          var aux = 0
          for (var i = 0; i < Object.keys(datos).length; i++) {
            if (this.jornadasProfesor.indexOf(datos[i].nombre) === -1) {
              aux = this.jornadasProfesor.push(datos[i].nombre)
            }
          }
          if (aux === 2) {
            this.mostrarJornadas = true
          } else if (aux === 1) {
            this.$store.commit('setJornadaActual', this.jornadasProfesor[0])
          } else {
            this.mostrarJornadas = false
          }
        }
      } catch {
        console.log('No fue posible obtener las jornadas del profesor')
      }
    },
    elegirTab: function (nombreTab) {
      this.$store.commit('setJornadaActual', nombreTab)
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerJornadas()
    }
  }
}
</script>
