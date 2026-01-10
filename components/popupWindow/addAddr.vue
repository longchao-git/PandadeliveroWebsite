<template>
  <div v-if='type===4' class='login-window'>
    <div class='login-tan-card' :class="type===4?'login-class':''">
      <div>
        <div class='loginView'>
          <img @click='handleChangeType(-1)' src='../../assets/images/cloudSales/popupWindow/icon_delet.png'
               alt='' />
        </div>
        <p>{{ addr_id ? $t('editAddress') : $t('addAddress') }}</p>
        <div class='loginClass'>
          <div class='login_input'>
            <div>{{ $t('detailedAddress') }}</div>

            <el-autocomplete
              class='inline-input'
              v-model='addr' :trigger-on-focus='false'
              :fetch-suggestions='handClickSerch'
              :placeholder='$t("detailedAddress")'
              style='width: 330px'
              @select='handleSelect'
            ></el-autocomplete>
            
          </div>
          <div class='mapContainer' ref='mapContainer'></div>

          <div class='login_input'>
            <div>{{ $t('houseNumber') }}</div>
            <input
              v-model='house'
              :placeholder='$t("houseNumber")'
              class='c-input' />
          </div>
          <div class='login_input'>
            <div>{{ $t('contactPerson') }}</div>
            <input
              v-model='contact'
              :placeholder='$t("contactPerson")'
              class='c-input' />

          </div>
          <div class='login_input'>
            <div>{{ $t('phoneNumber') }}</div>
            <el-input @mousewheel.native.prevent
                      v-model='mobile' type='number' style='width: 330px'
                      :placeholder='$t("phoneNumber")'
            >
            </el-input>
          </div>
          <div class='login_input' v-if="!addr_id || is_default == 0">
            <div></div>
            <label class="checkbox-label">
              <input type="checkbox" v-model="is_default" :true-value="1" :false-value="0" />
              <span>{{ $t('setAsDefaultAddress') }}</span>
            </label>
          </div>
          <v-btn width='100%' height='48px' class='try-out-bt mt3' @click='handleChangeType(2)'>{{ $t('save') }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: 0
    },
    editData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      contact: '',
      mobile: '',
      house: '',
      addr: '马德里',
      lng: '-3.7160397',
      lat: '40.4202472',
      is_default: 0,
      addr_id: null, // 编辑时的地址ID
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
        this.initFormData();
        this.elements();
      }
    },
    editData: {
      handler(newVal) {
        if (newVal && this.type === 4) {
          this.initFormData();
        }
      },
      immediate: true
    }
  },
  methods: {
    /* 初始化表单数据 */
    initFormData() {
      if (this.editData) {
        // 编辑模式：填充已有数据
        this.contact = this.editData.contact || ''
        this.mobile = this.editData.mobile || ''
        this.house = this.editData.house || ''
        this.addr = this.editData.addr || ''
        this.lng = this.editData.lng || ''
        this.lat = this.editData.lat || ''
        // 确保 is_default 是数字类型
        this.is_default = this.editData.is_default === 1 || this.editData.is_default === '1' ? 1 : 0
        this.addr_id = this.editData.addr_id || null
      } else {
        // 新增模式：清空数据
        this.contact = ''
        this.mobile = ''
        this.house = ''
        this.addr = '马德里'
        this.lng = '-3.7160397'
        this.lat = '40.4202472'
        this.is_default = 0
        this.addr_id = null
      }
    },
    elements() {
      // 如果有编辑数据，使用编辑数据的经纬度，否则使用默认位置
      const defaultLat = this.lat ? parseFloat(this.lat) : 40.4202472
      const defaultLng = this.lng ? parseFloat(this.lng) : -3.7160397
      const location = { lat: defaultLat, lng: defaultLng };
      
      this.$nextTick(() => {
        this.googleMap = new window.google.maps.Map(this.$refs.mapContainer, {
          center: location,
          zoom: 16
        });

        this.service = new window.google.maps.places.PlacesService(this.googleMap);
      });
    },
    handleSelect(item) {
      this.addr = item.value;
      this.lat = item.lat.toString();
      this.lng = item.lng.toString();
      
      // 清除旧标记
      if (this.marker) {
        this.marker.setMap(null);
      }
      
      this.$nextTick(() => {
        let newPyrmont = new window.google.maps.LatLng(item.lat, item.lng);
        // 在地图上生成标记
        this.marker = new window.google.maps.Marker({
          position: newPyrmont,
          map: this.googleMap,
          title: item.value || this.$t('marker') || '标记'
        });
        
        // 居中显示
        this.googleMap.setCenter(newPyrmont);
        this.googleMap.setZoom(16);
      });

    },
    handClickSerch(queryString, cb) {
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
        // 表单验证
        if (!this.contact) {
          this.$message.info(this.$t('pleaseInput') + this.$t('contactPerson'));
          return;
        }
        if (!this.mobile) {
          this.$message.info(this.$t('pleaseInput') + this.$t('phoneNumber'));
          return;
        }
        if (!this.addr) {
          this.$message.info(this.$t('pleaseInput') + this.$t('detailedAddress'));
          return;
        }
        if (!this.lat || !this.lng) {
          this.$message.info(this.$t('pleaseSelect') + this.$t('detailedAddress'));
          return;
        }
        
        // 构建请求参数，字段与接口要求匹配
        const params = {
          contact: this.contact,
          mobile: this.mobile,
          house: this.house || '',
          addr: this.addr,
          lng: this.lng.toString(),
          lat: this.lat.toString(),
          is_default: this.is_default === 1 || this.is_default === '1' ? 1 : 0
        };
        
        // 判断是新增还是编辑
        const isEdit = this.addr_id !== null && this.addr_id !== undefined;
        const apiUrl = isEdit ? '/staff/jifen/addr/edit' : '/staff/jifen/addr/create';
        
        // 编辑时需要传递 addr_id
        if (isEdit) {
          params.addr_id = this.addr_id;
        }
        
        this.$axios.post(apiUrl, params).then(res => {
          this.$message.success(this.$t('saveSuccess'));
          this.$emit('handleCloseLoginDialog', -2);
          // 清空表单
          this.initFormData();
        }).catch(err => {
          this.$message.error(err.msg || err.message || this.$t('saveError'));
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
  background: radial-gradient(50% 26.6% at 50% 3.77%, rgba(249, 193, 62, 0.2) 0%, rgba(10, 218, 254, 0) 100%), #fff;
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
        
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            cursor: pointer;
          }
          
          span {
            font-size: 14px;
            color: #2C2C2C;
          }
        }

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
          line-clamp: 3;
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
