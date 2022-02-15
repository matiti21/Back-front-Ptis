<template>
  <div>

    <div v-if="!verAprobacion">
      <br>
      <br>
      <div class="columns">
        <div class="column is-half is-offset-3">
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <a class="button is-primary-usach" @click="emitir">Emitir nueva versión</a>
            </div>
            <div class="control">
              <a class="button is-secondary-usach" @click="revisar">Revisar aprobación</a>
            </div>
            <div class="control">
              <a class="button is-light-usach" @click="cancelar">Cancelar</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="mostrarMinuta">
        <Informacion :proyecto="grupo" :minuta="bitacora"/>
        <Objetivos :lista="bitacora.minuta.objetivos"/>
        <Conclusiones :lista="bitacora.minuta.conclusiones"/>
        <Items :lista="bitacora.minuta.items" :asistentes="bitacora.minuta.asistencia" :comentar="false" :responder="true" :lista-com="comentarios" :ver-respuestas="true"/>
      </div>

      <br>
      <div class="columns">
        <div class="column is-half is-offset-3">
          <p class="title is-4 has-text-centered">Estado de revisión de la minuta</p>
        </div>
      </div>

      <div class="columns is-multiline is-centered">
        <div class="column is-1"></div>
        <div class="column is-3" v-for="aprobacion in aprobaciones" :key="aprobacion.id">
          <div class="tags are-medium has-addons">
            <span class="tag"><strong>{{ buscarIniciales(aprobacion.asistencia_id) }}</strong></span>
            <span class="tag" :class="aprobacion.tipo_aprobacion.identificador === 'A' ? 'is-info' : 'is-danger'">{{ aprobacion.tipo_aprobacion.descripcion }}</span>
          </div>
        </div>
      </div>

      <br>
      <br>
      <div class="columns">
        <div class="column is-half is-offset-3">
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <a class="button is-primary-usach" @click="emitir">Emitir nueva versión</a>
            </div>
            <div class="control">
              <a class="button is-light-usach" @click="cancelar"><strong>Cancelar</strong></a>
            </div>
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

import Informacion from '@/components/minutas/Informacion.vue'
import Objetivos from '@/components/minutas/Objetivos.vue'
import Conclusiones from '@/components/minutas/Conclusiones.vue'
import Items from '@/components/minutas/Items.vue'

export default {
  name: 'NuevaMinuta',
  components: {
    Informacion,
    Objetivos,
    Conclusiones,
    Items
  },
  props: ['idBitacora'],
  data () {
    return {
      id: this.idBitacora,
      bitacora: {},
      comentarios: [],
      aprobaciones: [],
      verAprobacion: false,
      nuevoMotivo: '',
      nuevaRevision: '',
      abc: 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'
    }
  },
  computed: {
    ...mapState(['apiUrl', 'grupo', 'motivos']),

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
        console.log('No fue posible obtener la información de la minuta seleccionada')
        console.log(e)
      }
    },
    async obtenerRespuestas (bitacoraId) {
      try {
        const response = await axios.get(this.apiUrl + '/respuestas/' + bitacoraId, { headers: Auth.authHeader() })
        this.comentarios = response.data
      } catch (e) {
        console.log('No fue posible obtener los comentarios y respuestas de la minuta')
        console.log(e)
      }
    },
    async obtenerAprobaciones (bitacoraId) {
      try {
        const response = await axios.get(this.apiUrl + '/aprobaciones/' + bitacoraId, { headers: Auth.authHeader() })
        this.aprobaciones = response.data
      } catch (e) {
        console.log('No fue posible obtener las aprobaciones de la minuta')
        console.log(e)
      }
    },
    buscarIniciales: function (id) {
      return Funciones.buscarIniciales(this.bitacora.minuta.asistencia, id)
    },
    obtenerNuevoMotivo: function () {
      if (this.bitacora.identificador === 'EF') {
        if (this.bitacora.minuta.tipo === 'Coordinacion') {
          this.nuevoMotivo = 'ECI'
        } else if (this.bitacora.minuta.tipo === 'Cliente') {
          this.nuevoMotivo = 'EAC'
        } else {
          this.nuevoMotivo = 'EF'
        }
      } else {
        var revisores = 0
        var aprobaciones = 0
        if (this.bitacora.minuta.tipo === 'Coordinacion') {
          revisores = this.grupo.estudiantes.length - 1
        } else if (this.bitacora.minuta.tipo === 'Cliente') {
          if (this.bitacora.identificador === 'ECI') {
            revisores = this.grupo.estudiantes.length - 1
          } else if (this.bitacora.identificador !== 'EF') {
            revisores = this.grupo.stakeholders.length
          }
        }
        for (var i = 0; i < this.aprobaciones.length; i++) {
          if (this.aprobaciones[i].tipo_aprobacion.identificador === 'A') {
            aprobaciones++
          }
        }
        if (aprobaciones === revisores) {
          if (this.bitacora.minuta.tipo === 'Coordinacion') {
            this.nuevoMotivo = 'EF'
          } else if (this.bitacora.minuta.tipo === 'Cliente') {
            if (this.bitacora.identificador === 'ECI') {
              this.nuevoMotivo = 'ERC'
            } else {
              this.nuevoMotivo = 'EF'
            }
          } else {
            this.nuevoMotivo = 'EF'
          }
        } else {
          if (this.bitacora.minuta.tipo === 'Coordinacion') {
            this.nuevoMotivo = 'ECI'
          } else if (this.bitacora.minuta.tipo === 'Cliente') {
            if (this.bitacora.identificador === 'ECI') {
              this.nuevoMotivo = 'ECI'
            } else {
              this.nuevoMotivo = 'EAC'
            }
          } else {
            this.nuevoMotivo = 'EAC'
          }
        }
      }
    },
    establecerNuevaRevision: function () {
      if (this.nuevoMotivo === 'EF') {
        if (!isNaN(parseInt(this.bitacora.revision))) {
          this.nuevaRevision = parseInt(this.bitacora.revision) + 1
        } else {
          this.nuevaRevision = 0
        }
      } else {
        if (this.bitacora.identificador === 'EF') {
          this.nuevaRevision = parseInt(this.bitacora.revision) + 1
        } else {
          this.nuevaRevision = this.abc.charAt(this.abc.indexOf(this.bitacora.revision) + 2)
        }
      }
    },
    emitir: function () {
      this.obtenerNuevoMotivo()
      this.establecerNuevaRevision()
      this.$emit('cerrar', this.nuevoMotivo, this.nuevaRevision)
      this.verAprobacion = false
    },
    revisar: function () {
      this.verAprobacion = true
      this.$emit('revisar')
    },
    cancelar: function () {
      this.$emit('cancelar')
      this.verAprobacion = false
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerMinuta(this.id)
      this.obtenerRespuestas(this.id)
      this.obtenerAprobaciones(this.id)
    }
  }
}
</script>
