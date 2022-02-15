<template>
  <div>

    <Header/>

    <div class="container">
      <Stakeholders/>
    </div>

    <Footer/>

  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Stakeholders from '@/components/views/Stakeholder.vue'

export default {
  name: 'Stakeholder',
  components: {
    Header,
    Footer,
    Stakeholders
  }
}
</script>
