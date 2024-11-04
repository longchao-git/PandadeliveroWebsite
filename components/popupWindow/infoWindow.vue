<template>
  <div class='info-window'>
    <v-row justify='center'>
      <v-dialog v-model='isShow' persistent max-width='800'>
        <v-card class='info-window_v-card'>
          <div class='info-window_close-icon'>
            <img @click='handleDialogState(false)' src='../../assets/images/cloudSales/popupWindow/icon_delet_h.png'
                 alt='' />
          </div>
          <div class='info-window_view'>
            <p class='pone'>{{ $t('home.lengua')}}</p>
            <div class='languageView'>
              <div @click='handleSelectLang(item)' v-for='(item, index) in languageList' :key='item.value'
                   :class='{ setView: setIndex === item.value }'>
                <div>{{ item.label }}</div>
                <span>{{ item.description }}</span>
              </div>
            </div>
            <div class='flex_center'>
              <div @click='handleConfirmSubbit' class='button_info'>{{ $t(`save`) }}</div>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import CollectionMixin from '../../mixins/collection-mixin.vue';
import { mapGetters } from 'vuex'

export default {
  props: ['isShow'],
  mixins: [CollectionMixin],
  data() {
    return {
      languageList: [

        {
          label: '简体中文',
          value: 'zh',
          description: '中国'
        },
        {
          label: 'spanish',
          value: 'es',
          description: 'Spain'
        }
      ],
      setIndex: 'es'
    };
  },
  computed: {
    ...mapGetters({
      locale: 'getLocale'
    })
  },
  mounted() {
    this.setIndex = this.locale;
  },
  methods: {
    /** 处理点击确认提交按钮 */
    handleConfirmSubbit() {
      this.$store.commit('SET_LANG', this.setIndex); // set store
      localStorage.setItem('locale', this.setIndex);
      this.$i18n.locale = this.setIndex;
      this.handleDialogState(false);
    },

    /** 处理关闭弹窗 */
    handleDialogState(value) {
      this.$emit('handleClose', value);
    },
    /**点击选择语言 */
    handleSelectLang(item) {
      this.setIndex = item.value;
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep .info-window_v-card {
  position: relative;
  text-align: center;
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(238, 128, 128, 0.2) 0%, rgba(10, 218, 254, 0) 100%), #fff;

  .info-window_close-icon {
    position: absolute;
    top: 0;
    z-index: 3;
    right: 0;

    img {
      width: 50px;
      height: 50px;
      cursor: pointer;
    }
  }

  .info-window_view {
    position: relative;
    z-index: 2;
    overflow: hidden;

    .pone {
      padding: 24px 0;
      font-size: 24px;
      color: #181818;
    }

    .name {
      margin-top: 8px;
      color: #1d2129;
      font-size: 20px;
      font-weight: 500;
      margin-left: 48px;
      text-align: left;
    }

    .languageView {
      padding: 0 48px;
      margin-top: 12px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 16px;

      // flex-direction: row;
      // align-items: center;
      // justify-content: space-between;
      flex-wrap: wrap;
      cursor: pointer;

      .setView {
        border: 1px solid #ee8080 !important;

        > div {
          color: #ee8080 !important;
        }
      }

      > div {
        border-radius: 2px;
        border: 1px solid #fff;
        width: 154px;
        padding: 8px 16px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 16px;

        > div {
          font-size: 18px;
          color: #383838;
          font-weight: 500;
          margin-bottom: 4px;
          line-height: 27px;
        }

        > span {
          color: #8b8b8b;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }

  .flex_center {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 32px 0;
  }

  .button_info {
    width: 304px;
    height: 53px;
    background: #ee8080;
    border-radius: 4px 4px 4px 4px;
    text-align: center;
    line-height: 53px;
    color: #ffffff;
    font-size: 17px;
    font-weight: bold;
  }
}

/* 中屏幕*/
@media screen and(max-width: $big-pc-width) {

}

/** 平板屏幕 */
@media screen and (max-width: $pad-max-width) {
}

/** 手机屏幕 */
@media screen and (max-width: $phone-max-width) {
  .flex_info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    dd {
      width: 100% !important;
    }
  }
  .pone {
    font-weight: 600 !important;
    font-size: 24px !important;
    line-height: 36px !important;
  }
  .pTwo {
    font-weight: 500 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    text-align: center;
    margin: 0 40px;
  }
  dd {
    margin: 16px 40px 0 !important;
  }
}
</style>
