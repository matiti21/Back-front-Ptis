<template>
  <div>

    <div v-if="mostrarMinuta">
      <Informacion :proyecto="grupo" :minuta="bitacora"/>
      <Objetivos :lista="bitacora.minuta.objetivos"/>
      <Conclusiones :lista="bitacora.minuta.conclusiones"/>
      <Items :lista="bitacora.minuta.items" :asistentes="bitacora.minuta.asistencia" :comentar="false" :responder="false" :lista-com="[]" :ver-respuestas="false"/>
    </div>

    <br>
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <div class="field">
          <div class="control">
            <a class="button is-primary-usach  is-fullwidth" @click="cerrar">Volver</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import axios from 'axios'
import { mapState } from 'vuex'

import Informacion from '@/components/minutas/Informacion.vue'
import Objetivos from '@/components/minutas/Objetivos.vue'
import Conclusiones from '@/components/minutas/Conclusiones.vue'
import Items from '@/components/minutas/Items.vue'

export default {
  name: 'RevisarMinuta',
  props: ['idBitacora'],
  components: {
    Informacion,
    Objetivos,
    Conclusiones,
    Items
  },
  data () {
    return {
      id: this.idBitacora,
      bitacora: {}
    }
  },
  computed: {
    ...mapState(['apiUrl', 'grupo']),

    mostrarMinuta: function () {
      return Object.keys(this.bitacora).length > 0
    }
  },
  methods: {
    async obtenerMinuta (bitacoraId) {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/' + bitacoraId, { headers: Auth.authHeader() })
        this.bitacora = response.data
      } catch (e) {
        console.log('No fue posible obtener los datos de la minuta seleccionada')
        console.log(e)
      }
    },
    cerrar: function () {
      this.$emit('cerrar')
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerMinuta(this.id)
    }
  }
}
</script>
