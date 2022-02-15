<template>
  <div>

    <nav>
      <div class="tabs">
        <ul>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Estudiantes }" @click="elegirTab(nombreTabs.Estudiantes)"><a><strong>Estudiantes</strong></a></li>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Grupos }" @click="elegirTab(nombreTabs.Grupos)"><a><strong>Grupos</strong></a></li>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Stakeholders }" @click="elegirTab(nombreTabs.Stakeholders)"><a><strong>Clientes</strong></a></li>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Minutas}" @click="elegirTab(nombreTabs.Minutas)"><a><strong>Revisar Minutas</strong></a></li>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Avances}" @click="elegirTab(nombreTabs.Avances)"><a><strong>Revisar Avances</strong></a></li>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Estadisticas}" @click="elegirTab(nombreTabs.Estadisticas)"><a><strong>Estadísticas</strong></a></li>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Profesores }" @click="elegirTab(nombreTabs.Profesores)"><a><strong>Profesores</strong></a></li>
          <li :class="{ 'is-active-usach' : nombreTabActiva === nombreTabs.Seccciones }" @click="elegirTab(nombreTabs.Secciones)"><a><strong>Secciones</strong></a></li>
        </ul>
      </div>
    </nav>
    <GestionEstudiantes v-if="nombreTabActiva === nombreTabs.Estudiantes"/>
    <GestionGrupos v-else-if="nombreTabActiva === nombreTabs.Grupos"/>
    <RevisionMinutas v-else-if="nombreTabActiva === nombreTabs.Minutas"/>
    <RevisionAvances v-else-if="nombreTabActiva === nombreTabs.Avances"/>
    <GestionClientes v-else-if="nombreTabActiva === nombreTabs.Stakeholders"/>
    <GestionProfesores v-else-if="nombreTabActiva === nombreTabs.Profesores"/>
    <EstadisticasGrupo v-else-if="nombreTabActiva === nombreTabs.Estadisticas"/>
    <GestionSeccionesCoordinador v-else-if="nombreTabActiva === nombreTabs.Secciones"/>

  </div>
</template>

<script>
import GestionEstudiantes from '@/components/GestionEstudiantes.vue'
import GestionGrupos from '@/components/GestionGrupos.vue'
import RevisionMinutas from '@/components/RevisionMinutas.vue'
import GestionClientes from '@/components/GestionClientes.vue'
import GestionProfesores from '@/components/GestionProfesores.vue'
import GestionSeccionesCoordinador from '@/components/GestionSeccionesCoordinador.vue'
import RevisionAvances from '@/components/RevisionAvances.vue'
import EstadisticasGrupo from '@/components/EstadisticasGrupo.vue'

const nombreTabs = {
  Estudiantes: 'estudiantes',
  Grupos: 'grupos',
  Minutas: 'minutas',
  Stakeholders: 'clientes',
  Profesores: 'profesores',
  Avances: 'avances',
  Estadisticas: 'estadisticas',
  Secciones: 'secciones'
}

export default {
  name: 'Coordinador',
  components: {
    GestionEstudiantes,
    GestionGrupos,
    RevisionMinutas,
    GestionClientes,
    GestionProfesores,
    RevisionAvances,
    EstadisticasGrupo,
    GestionSeccionesCoordinador
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

<style lang="css" scoped>
</style>
