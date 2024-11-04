<template>
  <v-app>
    <!--头部控件-->
    <header-control/>

    <div class="main-content">
      <nuxt/>
    </div>

    <!--底部控件-->
    <footer-control/>
  </v-app>
</template>

<script>

import HeaderControl from '../components/common/header-control'
import FooterControl from '../components/common/footer-control'

export default {
	name: 'default.vue',
	components: {
		FooterControl,
		HeaderControl
	}
}
</script>

<style scoped lang="scss">
  .main-content {
    width: 100%;
  }
</style>
