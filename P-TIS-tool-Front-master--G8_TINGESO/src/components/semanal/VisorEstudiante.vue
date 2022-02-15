<template>
  <div>

    <br>
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <p class="title is-5 has-text-centered">Avance de {{ nombreCompleto(estudiante.usuario) }} - ({{ estudiante.iniciales }})</p>
      </div>
      <div class="column is-2"></div>
    </div>

    <div class="columns is-centered">
      <div class="column is-10">
        <p class="title is-6 has-text-left">Impedimentos:</p>
        <div class="content has-text-left">
          <ol type="1">
            <li v-for="(impedimento, index) in impedimentos" :key="index">
              <p>{{ impedimento.descripcion }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-10">
        <p class="title is-6 has-text-left">Logros:</p>
        <div class="content has-text-left">
          <ol type="1">
            <li v-for="(logro, index) in logros" :key="index">
              <p>{{ logro.descripcion }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-10">
        <p class="title is-6 has-text-left">Metas:</p>
        <div class="content has-text-left">
          <ol type="1">
            <li v-for="(meta, index) in metas" :key="index">
              <p>{{ meta.descripcion }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <br>

  </div>
</template>

<script>
import Funciones from '@/services/funciones.js'

export default {
  name: 'VisorEstudiante',
  props: ['est', 'logros', 'metas', 'impedimentos', 'listaCom'],
  data () {
    return {
      estudiante: this.est,
      listaLogros: this.logros,
      listaMetas: this.metas,
      listaImpedimentos: this.impedimentos,
      comentariosMinuta: this.listaCom
    }
  },
  methods: {
    nombreCompleto: function (usuario) {
      return Funciones.nombreCompleto(usuario)
    }
  }
}
</script>
