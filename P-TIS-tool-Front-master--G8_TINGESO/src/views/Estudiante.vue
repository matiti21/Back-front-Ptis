<template>
  <div>

    <Header/>

    <div class="container">
      <Estudiantes/>
    </div>

    <Footer/>

  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Estudiantes from '@/components/views/Estudiante.vue'

export default {
  name: 'Estudiante',
  components: {
    Header,
    Footer,
    Estudiantes
  }
}
</script>
