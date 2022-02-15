<template>
  <div>

    <div class="modal" :class="{ 'is-active' : activo }">
      <div class="modal-background"></div>
      <div class="modal-content">

        <div class="box">
          <div class="columns">
            <div class="column is-full">
              <p class="title is-5">{{ mensaje }}</p>
              <div class="columns is-centered">
                <div class="column is-3">
                  <div class="field is-grouped is-grouped-centered">
                    <div class="control">
                      <a class="button is-info-usach is-rounded" @click="confirmarAccion">Aceptar</a>
                    </div>
                  </div>
                </div>
                <div class="column is-1"></div>
                <div class="column is-3">
                  <div class="control">
                    <a class="button is-light-usach is-rounded" @click="cancelarAccion">Cancelar</a>
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
export default {
  name: 'Confirmacion',
  props: ['mostrar', 'texto'],
  data () {
    return {
      activo: this.mostrar,
      mensaje: this.texto
    }
  },
  methods: {
    confirmarAccion: function () {
      this.$emit('accion')
    },
    cancelarAccion: function () {
      this.$emit('cerrar')
    }
  }
}
</script>
