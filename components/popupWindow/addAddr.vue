<template>
  <div v-if='type===4' class='login-window'>
    <div class='login-tan-card' :class="type===4?'login-class':''">
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(-1)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png'
               alt='' />
        </div>
        <p>{{ $t('addAddr.name') }}</p>
        <div class='loginClass'>
          <div class='login_input'>
            <div>{{ $t('searchaddress') }}</div>

            <el-autocomplete
              class='inline-input'
              v-model='addr'   :trigger-on-focus="false"
              :fetch-suggestions='querySearch'
              placeholder='请输入内容'
              style='width: 330px'
              @select='handleSelect'
            ></el-autocomplete>
          </div>
          <div class='mapContainer' ref='mapContainer'></div>

          <div class='login_input'>
            <div>门牌号</div>
            <input
              v-model='house'
              :placeholder="$t('addAddr.ingrese')"
              class='c-input' />
          </div>
          <div class='login_input'>
            <div>联系人</div>
            <input
              v-model='contact'
              :placeholder="$t('addAddr.ingrese')"
              class='c-input' />

          </div>
          <div class='login_input'>
            <div>电话号码</div>
            <el-input @mousewheel.native.prevent
                      v-model='mobile' type='number' style='width: 330px'
                      :placeholder="$t('addAddr.ingrese')"
            >
            </el-input>
          </div>
          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'>{{ $t(`asentar`) }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type'],
  data() {
    return {
      contact: '',
      mobile: '',
      house: '',
      addr: '',
      googleMap: null,
      service: '',
      list: '',
      nameId: '',
      marker: null,

      city_id: ''
    };
  },
  watch: {
    type(newVal, oldVal) {
      if (newVal === 4) {
        this.elements();
      }
    }
  },
  methods: {
    elements() {
      const location = { lat: 40.4202472, lng: -3.7160397 };
      this.$nextTick(() => {
        this.googleMap = new window.google.maps.Map(this.$refs.mapContainer, {
          center: location,
          zoom: 10
        });

        this.service = new window.google.maps.places.PlacesService(this.googleMap);
      });

    },
    handleSelect(item) {

      this.addr = item.value;
      // 在地图上生成仓库的标记，仓库图标自定义
      this.marker = new window.google.maps.Marker({
        position: { lat: Number(item.lat) , lng: Number(item.lng) },
        map:this.googleMap,
        title: item.value,
      });

    },
    querySearch(queryString, cb) {
      let request = {};
      let list = [];
      let pyrmont = new window.google.maps.LatLng(40.4202472, -3.7160397);
      if (queryString) {
        request = {
          query: queryString,
          location: pyrmont,
          radius: '500'
        };
        this.service.textSearch(request, async (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i in results) {
              let code = await this.nnewsa(results[i].geometry.location);
              if (code) {
                list.push({
                  id: 'id' + i,
                  value: results[i].name + ' ' + code,
                  lat: results[i].geometry.location.lat(),
                  lng: results[i].geometry.location.lng()
                });
              }
            }
            cb(list);
          } else {
            cb(list);
          }
        });
      } else {
        cb(list);
      }
    },

    nnewsa(data) {
      let gcode = new window.google.maps.Geocoder();
      return new Promise((resove, reject) => {
        gcode.geocode({
          'latLng': data
        }, function(results, status) {
          if (results && results.length > 0 && results[0]
              .address_components.length >= 8 &&
            results[0].address_components[7].long_name) {
            resove(results[0].address_components[7].long_name);
          } else {
            resove('');
          }
        });
      });
    },

    /** 处理呼叫父级 - 设置type状态 */
    handleChangeType(value) {
      if (value === 2) {
        if (!this.contact) {
          this.$message.info(this.$t(`home.ingrese`) + this.$t(`loginPopup.fromTree`));
          return;
        }
        if (!this.mobile) {
          this.$message.info(this.$t(`home.ingrese`) + this.$t(`loginPopup.fromFour`));
          return;
        }
        if (!this.house) {
          this.$message.info(this.$t(`home.ingrese`) + this.$t(`loginPopup.fromTwo`));
          return;
        }
        if (!this.nameId) {
          this.$message.info(this.$t('loginOrRegister.placeholder')[1] + this.$t(`loginPopup.fromOne`));
          return;
        }
        if (!this.city_id) {
          this.$message.info(this.$t('loginOrRegister.placeholder')[1] + this.$t(`city`));
          return;
        }
        const params = {
          data: {
            'contact': this.contact,
            'mobile': this.mobile,
            'house': this.house,
            'city_id': this.city_id,
            'addr': '',
            'lng': '',
            'lat': '',
            'page': 1,
            'type': 0
          }
        };
        for (let i in this.list) {

          if (this.list[i].id == this.nameId) {
            params.data.addr = this.list[i].name;
            params.data.lat = this.list[i].lat;
            params.data.lng = this.list[i].lng;
          }
        }
        this.$axios.post('/client/member/addr/create', params).then(res => {
          this.$message.success(this.$t(`Guardar`));
          this.$emit('handleCloseLoginDialog', -2);
        }).catch(err => {
          this.$message.info(err.message);
        });
      } else {
        this.$emit('handleCloseLoginDialog', value);
      }
    }
  }
};
</script>
<style lang='scss'>
.mapContainer {
  width: 400px;
  height: 200px;
  margin-left: 45px;
}

.loginClass {
  .login_input {

    .v-input__slot {
      border-radius: 6px;
      border: 1px solid #DCDCDC !important;
      height: 48px;

      margin-bottom: 0;
    }

    .c-input {
      border-radius: 6px;
      border: 1px solid #DCDCDC !important;
      height: 48px;
      margin-bottom: 0;
      flex: 1;
      padding-left: 12px;
      margin-right: 12px;
    }

    .v-text-field__details {
      display: none;
    }
  }
}

</style>
<style lang='scss' scoped>
.login-window {
  position: fixed;
  background: rgba(0, 0, 0, .4);
  top: 0;
  right: 0;
  bottom: 0;

  min-width: 100vw;
  width: 100%;
  z-index: 5;
  display: flex;
}

.login-class {
  height: 760px !important;
}

/** 登录卡片样式 */
.login-tan-card {
  border-radius: 8px;
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(238, 128, 128, 0.20) 0%, rgba(10, 218, 254, 0.00) 100%), #FFF;
  margin: auto;
  width: 540px;
  height: 740px;
  position: relative;

  > div {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    height: 100%;

    > .loginView {
      position: absolute;
      width: 55px;
      height: 55px;
      text-align: right;
      right: 0;
      top: 0;

      img {
        width: 55px;
        height: 55px;
        cursor: pointer;
      }
    }

    p {
      font-size: 24px;
      padding: 24px 0;
    }

    .loginClass {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      padding: 0 48px;

      .logoCard {
        width: 72px;
        height: 72px;
      }

      .name {
        margin-top: 12px;
        font-size: 24px;
        color: #2C2C2C;
        font-weight: 500;
        margin-bottom: 12px;
      }

      .login_input {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 12px;

        .button {
          color: #f9c13e;
          font-size: 14px;
          position: absolute;
          right: 24px;
        }

        .v-input__slot {
          border-radius: 6px;
          border: 1px solid #DCDCDC;
          height: 48px;
        }

        > div {
          width: 120px;
          flex-shrink: 0;
          text-align: right;
          color: #2C2C2C;
          font-size: 16px;
          padding-right: 12px;
          padding-top: 8px;
        }
      }

      .viewSetTion {
        margin-top: 16px;
        display: flex;
        flex-direction: row;

        > img {
          margin: 5px;
          height: 24px;
          width: 24px;
        }

        > div {
          line-height: 22px;
          font-size: 14px;
          color: #1D2129;
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          width: 100%;

          > span {
            color: #f9c13e;
          }
        }
      }

      .viewXian {
        padding: 16px 0;
        width: 100%;
        display: flex;
        align-items: center;

        > div {
          flex: 1;
          border-top: 1px #C5C5C5 dashed;
        }

        span {
          color: #4B4B4B;
          flex-shrink: 0;
          padding: 0 8px;
        }
      }
    }

  }

}

/* 中屏幕*/
@media screen and(max-width: $big-pc-width) {

  /** 登录卡片样式 */
  .login-tan-card {
    width: 600px;

    > div {
      > div {
        img {
          width: 45px;
          height: 45px;
        }
      }

      p {
        font-size: 20px;
      }

      span {
        font-size: 14px;
      }
    }

  }
}

/** 平板屏幕 */
@media screen and (max-width: $pad-max-width) {

}

/** 手机屏幕 */
@media screen and (max-width: $phone-max-width) {
  .login-class {
    height: 590px !important;
  }
  /** 登录卡片样式 */
  .login-tan-card {
    width: 300px;
    height: 540px !important;

    > div {

      p {
        font-size: 16px;
        padding: 16px 0;
        margin-bottom: 0 !important;
      }

      .loginClass {
        margin-top: 0px;
        padding: 0 16px;

        .logoCard {
          width: 48px;
          height: 48px;
        }

        .name {
          font-size: 16px;
          margin-bottom: 6px;
        }

        .login_input {
          margin-top: 6px;

          .v-input__slot {
            border-radius: 6px;
            border: 1px solid #DCDCDC;
            height: 48px;
          }

          > div {
            width: 72px;
            text-align: right;
            color: #2C2C2C;
            font-size: 12px;
            padding-right: 12px;
            padding-top: 8px;
          }
        }

        .viewSetTion {
          margin-top: 16px;
          display: flex;
          flex-direction: row;

          > img {
            margin: 2px;
            height: 18px;
            width: 18px;
          }

          > div {
            line-height: 16px;
            font-size: 12px;
            color: #1D2129;

            > span {
              font-size: 12px;
              color: #f9c13e;
            }
          }
        }

        .viewXian {
          padding: 4px 0;
          width: 100%;
          display: flex;
          align-items: center;

          > div {
            flex: 1;
            border-top: 1px #C5C5C5 dashed;
          }

          span {
            color: #4B4B4B;
            flex-shrink: 0;
            padding: 0 8px;
          }
        }
      }

    }

  }
}
</style>
