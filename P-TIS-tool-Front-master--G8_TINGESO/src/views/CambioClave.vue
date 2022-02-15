<template>
  <div>

    <Header/>

    <div class="container">
      <Cambio/>
    </div>

    <Footer/>

  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Cambio from '@/components/views/CambioClave.vue'

export default {
  name: 'CambioClave',
  components: {
    Header,
    Footer,
    Cambio
  }
}
</script>
