<template>
  <div class='personal_information'>
    <div class='information_title flex flex-a-c'>
      <img class='title_icon' src='~/assets/images/icon_information.png' alt='' />
      <div class='title_text'>{{ $t(`个人信息`) }}</div>
    </div>
    <div class='info_form'>
      <div class='form_item flex-a-c'>
        <div class='form_label'>{{ $t(`头像`) }}</div>
        <div class='form_content'>
          <el-upload
            class='avatar-uploader'
            :action='action'
            :show-file-list='false'
            :on-success='handleAvatarSuccess'
          >
            <el-image v-if='imageUrl' :src='imageUrl' fit='cover' class='avatarUrl'></el-image>
          </el-upload>
        </div>
      </div>
      <div class='form_item flex-a-c'>
        <div class='form_label'>{{ $t(`昵称`) }}</div>
        <div class='form_content'>
          <el-input placeholder='请输入' v-model='nickname'></el-input>
        </div>
      </div>

      <div class='form_item flex-a-c'>
        <div class='form_label'>{{ $t(`手机号码`) }}</div>
        <div class='form_content'>
          <el-input placeholder='请输入' v-model='getUserInfo.mobile' disabled></el-input>
        </div>
      </div>
      <div class='form_item flex-a-c'>
        <div class='form_label'>{{ $t(`余额`) }}</div>
        <div class='form_content'>
          <div>
            <el-input placeholder='0' v-model='getUserInfo.money' disabled></el-input>
          </div>
        </div>
      </div>
      <div class='form_item'>
        <div class='form_label'></div>
        <div class='form_content'>
          <el-button class='save_btn' color='#09236c' type='primary' @click='bindtaoCikc()'>{{ $t(`保存`) }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {},
  computed: {
    ...mapGetters({
      getUserInfo: 'getUserInfo'
    })
  },
  data() {
    return {

      rating: 4,
      isComment: true,
      action: '',
      imageUrl: '',
      nickname: ''
    };
  },

  async fetch() {
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data;
    },
    bindtaoCikc() {
      let data = {
        avatar: this.imageUrl,
        nick_name: this.nickname
      };
      this.$axios.post('/client/member/member/edit', data).then(res => {
        this.$axios.post('/client/member/member/index', data).then(res => {
          localStorage.setItem('userInfo', JSON.stringify(res));
          this.$store.commit('SET_USERINFO', res);
          this.$message.success(this.$t('保存成功'));
        }).catch(err => {
          this.$message.info(err.message);
        });
      }).catch(err => {
        this.$message.info(err.message);
      });
    }
  },
  mounted() {
    this.action = config.BASE_URL + 'magic/upload';
    this.imageUrl = this.getUserInfo.face;
    this.nickname = this.getUserInfo.nickname;

  }
};
</script>
<style>
.main-content {
  background-color: #f5f5f5;
}
</style>
<style scoped lang='scss'>
.avatarUrl {
  width: 120px;
  height: 120px;
}

.personal_information {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 140px 0 160px;
  background: white;
}

.information_title {
  width: 360px;
  margin-bottom: 24px;

  .title_icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  .title_text {
    color: #1c222b;
    font-size: 20px;
    font-weight: bold;
  }
}

.info_form {
  .form_item {
    display: flex;
    margin-bottom: 16px;

    .form_label {
      color: #2c2c2c;
      width: 80px;
      margin-right: 12px;
      font-weight: bold;
      text-align: right;
    }

    .form_content {
      width: 300px;

      .save_btn {
        width: 154px;
      }
    }
  }
}

/*中屏幕*/
@media screen and(max-width: $big-pc-width) {
}

@media screen and (max-width: $pad-max-width) {

}

@media screen and (max-width: $phone-max-width) {
  .information_title {
    margin-bottom: 12px;

    .title_icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .title_text {
      font-size: 16px;
    }
  }
  .info_form {
    .form_item {
      display: block;
      margin-bottom: 8px;

      .form_label {
        width: fit-content;
        margin-right: 12px;
        margin-bottom: 4px;
      }

      .form_content {
        width: 100%;

        .save_btn {
          width: 120px;
        }
      }
    }
  }
}
</style>
