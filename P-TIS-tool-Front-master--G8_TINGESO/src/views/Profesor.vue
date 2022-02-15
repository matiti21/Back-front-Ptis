<template>
  <div>

    <Header/>

    <div class="container">
      <Profesores/>
    </div>

    <Footer/>

  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Profesores from '@/components/views/Profesor.vue'

export default {
  name: 'Profesor.vue',
  components: {
    Header,
    Footer,
    Profesores
  }
}
</script>
