<template>
  <div class="global-partners-box">
    <div class="global-map-box">
      <div class="disflex ju-center al-center">
        <DvFlylineChartEnhanced
          :config="config" class="global-map"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'global-partners',

  data() {
    return {
      config: {
        // bgImgSrc: require('~/assets/images/global-map.png'),
        halo: {
          show: true,
          duration: [30, 30],
          color: '#133ba0',
          radius: 30
        },
        text: {
          color: '#133ba0'
        },


      },
    }
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.global-partners-box {
  width: 100%;

  .global-map-box {
    padding: 56px 0 0;

    .global-map {
      width: 900px;
      height: 473px;
      margin-right: 30px;
      margin-bottom: 61px;
    }
  }
}

/*中屏幕*/
@media screen and(max-width: $big-pc-width) {
  body .global-partners-box {
    .global-map-box {
      padding: 73px 0 0;

      .global-map {
        width: 716px;
        height: 355px;
        margin-right: 14px;
        margin-bottom: 46px;
      }
    }
  }
}

/*小屏幕*/
@media screen and (max-width: $pad-max-width) {
  body .global-partners-box {
    .global-map-box {
      padding: 20px 0 0;

      .global-map {
        width: 100vw;
        height: 50vw;
      }

    }
  }
}
</style>
