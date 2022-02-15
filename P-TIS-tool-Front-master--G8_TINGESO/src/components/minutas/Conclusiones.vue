<template>
  <div>

    <div class="columns">
      <div class="column is-8 is-offset-2">
        <p class="title is-5 has-text-centered">Resultados / Conclusiones</p>
      </div>
      <div class="column"></div>
    </div>

    <div class="columns">
      <div class="column is-10 is-offset-1">
        <div class="content has-text-left">
          <ul>
            <li v-for="conclusion in conclusiones" :key="conclusion.id">
              <input class="input is-static" type="text" :value="conclusion.descripcion">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <br>

  </div>
</template>

<script>
export default {
  name: 'Conclusiones',
  props: ['lista'],
  data () {
    return {
      conclusiones: this.lista
    }
  }
}
</script>
