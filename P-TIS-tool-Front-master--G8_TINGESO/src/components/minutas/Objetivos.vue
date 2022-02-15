<template>
  <div>

    <div class="columns">
      <div class="column is-8 is-offset-2">
        <p class="title is-5 has-text-centered">Objetivos</p>
      </div>
      <div class="column"></div>
    </div>

    <div class="columns">
      <div class="column is-10 is-offset-1">
        <div class="content has-text-left">
          <ul>
            <li v-for="objetivo in objetivos" :key="objetivo.id">
              <input class="input is-static" type="text" :value="objetivo.descripcion">
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
  name: 'Objetivos',
  props: ['lista'],
  data () {
    return {
      objetivos: this.lista
    }
  }
}
</script>
