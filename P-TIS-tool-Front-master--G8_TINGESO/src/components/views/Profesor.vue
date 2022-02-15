<template>
  <div>

    <nav>
      <div class="tabs">
        <ul>
          <li v-bind:class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Estudiantes }" v-on:click="elegirTab(nombreTabs.Estudiantes)"><a><strong>Estudiantes</strong></a></li>
          <li v-bind:class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Grupos }" v-on:click="elegirTab(nombreTabs.Grupos)"><a><strong>Grupos</strong></a></li>
          <li v-bind:class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Secciones }" v-on:click="elegirTab(nombreTabs.Secciones)"><a><strong>Secciones</strong></a></li>
          <li v-bind:class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Stakeholders}" v-on:click="elegirTab(nombreTabs.Stakeholders)"><a><strong>Clientes</strong></a></li>
          <li v-bind:class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Minutas}" v-on:click="elegirTab(nombreTabs.Minutas)"><a><strong>Revisar Minutas</strong></a></li>
          <li v-bind:class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Avances}" v-on:click="elegirTab(nombreTabs.Avances)"><a><strong>Revisar Avances</strong></a></li>
          <li v-bind:class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Estadisticas}" v-on:click="elegirTab(nombreTabs.Estadisticas)"><a><strong>Estadísticas</strong></a></li>
        </ul>
      </div>
    </nav>
    <GestionEstudiantes v-if="nombreTabActiva === nombreTabs.Estudiantes"/>
    <GestionGrupos v-else-if="nombreTabActiva === nombreTabs.Grupos"/>
    <GestionSecciones v-else-if="nombreTabActiva === nombreTabs.Secciones"/>
    <RevisionMinutas v-else-if="nombreTabActiva === nombreTabs.Minutas"/>
    <GestionClientes v-else-if="nombreTabActiva === nombreTabs.Stakeholders"/>
    <RevisionAvances v-else-if="nombreTabActiva === nombreTabs.Avances"/>
    <EstadisticasGrupo v-else-if="nombreTabActiva === nombreTabs.Estadisticas"/>
    <br>

  </div>
</template>

<script>
import GestionEstudiantes from '@/components/GestionEstudiantes.vue'
import GestionGrupos from '@/components/GestionGrupos.vue'
import GestionSecciones from '@/components/GestionSecciones.vue'
import RevisionMinutas from '@/components/RevisionMinutas.vue'
import GestionClientes from '@/components/GestionClientes.vue'
import RevisionAvances from '@/components/RevisionAvances.vue'
import EstadisticasGrupo from '@/components/EstadisticasGrupo.vue'

const nombreTabs = {
  Estudiantes: 'estudiantes',
  Grupos: 'grupos',
  Secciones: 'secciones',
  Minutas: 'minutas',
  Stakeholders: 'clientes',
  Avances: 'avances',
  Estadisticas: 'estadisticas'
}

export default {
  name: 'Profesor',
  components: {
    GestionEstudiantes,
    GestionGrupos,
    GestionSecciones,
    RevisionMinutas,
    GestionClientes,
    RevisionAvances,
    EstadisticasGrupo
  },
  data () {
    return {
      nombreTabActiva: 'estudiantes',
      nombreTabs
    }
  },
  methods: {
    elegirTab: function (nombreTab) {
      this.nombreTabActiva = nombreTab
    }
  }
}
</script>
