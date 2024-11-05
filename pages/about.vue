<template>
  <div>
    <startEarning :type="1"></startEarning>
  </div>
</template>

<script>


import startEarning from '@/components/cloudSales/startEarning.vue'

export default {
  components: { startEarning },

  data() {
    return {


      page: 1
    };
  },

  methods: {

  },

  mounted() {

  }
};
</script>
