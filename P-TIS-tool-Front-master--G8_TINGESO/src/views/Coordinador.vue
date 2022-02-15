<template>
  <div>

    <Header/>

    <div class="container">
      <Coordinacion/>
    </div>

    <Footer/>

  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Coordinacion from '@/components/views/Coordinador.vue'

export default {
  name: 'Coordinador',
  components: {
    Header,
    Footer,
    Coordinacion
  }
}

</script>
