<template>
  <div class="box">
    <div v-if="mostrarVersiones">
      <div class="field">
        <div class="control">
          <label id="estudiantes" class="label">Lista de versiones</label>
        </div>
      </div>
      <div class="columns is-1">
        <div class="column">
            <div class="select">
              <select class="is-hovered">
                <option v-for="version in listadoVersiones" :key="version" :value="version"> Version {{ version[1] }}</option>
              </select>
              <!--<table class="table is-striped is-hoverable is-fullwidth" aria-describedby="estudiantes">
                <tbody>
                  <tr v-for="version in listadoVersiones" :key="version">
                    <td class="is-vcentered">Versión {{ version }}</td>
                  </tr>
                </tbody>-+
              </table>-->
            </div>
        </div>
        <div class="column">
          <button class="button is-info-usach" @click="c">Ver</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SelectorVersion',
  props: ['listaVersiones'],
  data () {
    return {
      mostrarVersiones: true,
      listadoVersiones: this.listaVersiones
    }
  }
}
</script>
