<template>
  <div>

    <div v-if="mostrarMinuta">
      <Informacion :proyecto="grupo" :minuta="bitacora"/>
      <Objetivos :lista="bitacora.minuta.objetivos"/>
      <Conclusiones :lista="bitacora.minuta.conclusiones"/>
      <Items :lista="bitacora.minuta.items" :asistentes="bitacora.minuta.asistencia" :comentar="true" :responder="false" :lista-com="[]" :ver-respuestas="false" @comentar="recibirComentarios" @cerrar="cerrarRevision"/>
    </div>

    <div v-if="mostrarAprobacion">
      <br>
      <br>
      <div class="columns">
        <div class="column is-7 is-offset-2">
          <div class="field is-horizontal">
            <div class="field-label-2c is-normal">
              <label class="label">Estado de aprobación: </label>
            </div>
            <div class="field-body">
              <div class="field has-addons has-addons-right">
                <p class="control is-expanded">
                  <span class="select is-fullwidth">
                    <select v-model="aprobacion" @change="validarAprobacion">
                      <option v-for="(aprobacion, index) in aprobacionesFiltradas" :key="aprobacion.id" :value="aprobacion.id">{{ index + 1 }} - {{ aprobacion.descripcion }}</option>
                    </select>
                  </span>
                </p>
                <p class="control">
                  <a class="button is-secondary-usach" @click="establecerEstado">Establecer estado</a>
                </p>
              </div>
            </div>
          </div>
          <p v-if="error" class="is-danger help select-centered">No se ha seleccionado un estado de evaluación</p>
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

import Informacion from '@/components/minutas/Informacion.vue'
import Objetivos from '@/components/minutas/Objetivos.vue'
import Conclusiones from '@/components/minutas/Conclusiones.vue'
import Items from '@/components/minutas/Items.vue'

export default {
  name: 'ComentarMinuta',
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
      bitacora: {},
      comentarios: [],
      mostrarAprobacion: false,
      aprobacion: 0,
      error: false
    }
  },
  computed: {
    ...mapState(['apiUrl', 'grupo', 'tipoAprobaciones']),

    mostrarMinuta: function () {
      return Object.keys(this.bitacora).length > 0
    },
    sinComentarios: function () {
      return Funciones.sinComentarios(this.comentarios)
    },
    aprobacionesFiltradas: function () {
      var lista = []
      for (var i = 0; i < this.tipoAprobaciones.length; i++) {
        if (this.sinComentarios) {
          if (this.tipoAprobaciones[i].identificador.length === 1) {
            lista.push(this.tipoAprobaciones[i])
          }
        } else {
          if (this.tipoAprobaciones[i].identificador.length === 2) {
            lista.push(this.tipoAprobaciones[i])
          }
        }
      }
      return lista
    }
  },
  methods: {
    async obtenerMinuta (bitacoraId) {
      try {
        const response = await axios.get(this.apiUrl + '/minutas/' + bitacoraId, { headers: Auth.authHeader() })
        this.bitacora = response.data
      } catch (e) {
        console.log('No fue posible obtener la información de la minuta seleccionada')
        console.log(e)
      }
    },
    async VerificarAprobaciones () {
      try {
        await axios.get(this.apiUrl + '/verificar/' + this.idBitacora, { headers: Auth.postHeader() })
      } catch (e) {
        console.log('No fue posible verificar las aprobaciones')
        console.log(e)
      }
    },
    async enviarComentarios () {
      const comentarios = {
        id: this.id,
        comentarios: this.comentarios,
        tipo_aprobacion_id: this.aprobacion
      }
      console.log(comentarios)
      try {
        await axios.post(this.apiUrl + '/comentarios', comentarios, { headers: Auth.postHeader() })
      } catch (e) {
        console.log('No fue posible enviar los comentarios')
        console.log(e)
      }
    },
    recibirComentarios: function (comentarios) {
      this.comentarios = comentarios
      this.mostrarAprobacion = true
    },
    cerrarRevision: function () {
      this.$emit('cerrar')
    },
    establecerEstado: function () {
      if (this.validarAprobacion()) {
        this.enviarComentarios()
        if (this.aprobacion === 1 || this.aprobacion === 2) {
          this.VerificarAprobaciones()
        }
        this.$emit('refrescar')
        this.$emit('cerrar')
        this.mostrarAprobacion = false
      }
    },
    limpiarCampos: function () {
      this.bitacora = {}
      this.comentarios = []
      this.aprobacion = 0
    },
    validarAprobacion: function () {
      if (this.aprobacion === 0) {
        this.error = true
        return false
      } else {
        this.error = false
        return true
      }
    }
  },
  mounted () {
    if (localStorage.user_tk) {
      this.obtenerMinuta(this.id)
    }
  }
}
</script>

<style lang="css" scoped>
  .select-centered {
    margin-left: 2.5rem;
    text-align: center;
  }
</style>
