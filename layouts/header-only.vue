<template>
  <v-app>
    <header-control/>
    <v-main>
      <div class="main-content">
        <nuxt/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import HeaderControl from '../components/common/header-control'

export default {
  name: 'header-only',
  components: {
    HeaderControl
  }
}
</script>

<style>
.main-content {
  padding-top: 100px;
  min-height: 100vh;
}
</style>
