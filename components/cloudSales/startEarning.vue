<template>
  <div class='cloud_sales_believe-cooperation'>
    <div class='content' v-if='type===0'>
      <p>{{ $t(`今天就注册并开始赚钱吧`) }}!</p>
    </div>

    <div class='_bottom' v-if='type===0'>
      <div class=' indexBob' style='cursor: pointer' @click='bingTapClick'>
        <div>{{ $t(`立即注册`) }}</div>
        <img src='@/assets/images/icon_iconVIew.png'
             style='width: 24px;height: 24px;margin-left:8px '
             alt='' />
      </div>

    </div>
    <div class='content' v-if='type===1'>
      <p>{{ $t(`关于我们`) }}</p>
    </div>
    <div class='aboutView' v-if='type===1'>
      <p>Pandadelivero{{ $t(`是西班牙本地值得信赖的同城快递与外卖配送服务公司`) }}!</p>
      <p>{{ $t(`我们的配送团队经验丰富`) }}。</p>
      <p>{{ $t(`无论您身在何处`) }}。</p>
    </div>
  </div>
</template>

<script>

export default {
  props: ['type'],
  methods: {
    bingTapClick() {
      window.location.href = '/creation';
    }
  }
};
</script>

<style lang='scss' scoped>
.indexBob {
  border-radius: 39px;
  border: 1px solid rgba(255, 255, 255, 0.30);
  background: #FFF;
  width: 168px;
  height: 54px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: flex;

  div {
    color: #FABE1D;
    font-size: 18px;
    line-height: 54px;
    font-weight: 500;
  }
}

.cloud_sales_believe-cooperation {
  position: relative;
  display: flex;
  //background: #254969;
  background-image: url("@/assets/images/cloudSales/home/iconBackONe.png");
  background-size: cover;
  background-position: center;

  > .content {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;

    p {
      font-size: 54px;
      color: #FFF;
      font-weight: bold;
      margin: 0 auto 10px;
      letter-spacing: 1px;
      max-width: 800px;
    }

  }

  > ._bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 300px auto 120px;
    height: 54px;

    img {
      width: 176px;
      height: 54px;
    }

  }

  .aboutView {
    margin: 300px auto 120px;

    p {
      font-size: 28px;
      color: #FFF;
      font-weight: bold;
      margin: 0 auto 10px;
      letter-spacing: 1px;
      max-width: 1200px;
      //text-indent: 2em;
    }
  }
}


/* 中屏幕*/
@media screen and(max-width: $big-pc-width) {
  .cloud_sales_believe-cooperation {
    > .content {
      p {
        font-size: 25px;
      }
    }

    > ._bottom {
      height: 350px;

      ._left, ._right {
        dl {
          dd {
            p {
              font-size: 16px;
            }

            div {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

/** 平板屏幕 */
@media screen and (max-width: $pad-max-width) {
  .cloud_sales_believe-cooperation {
    > .content {
      top: 30px;

      p {
        font-size: 18px;
        margin-bottom: 5px;
        max-width: 70vw;
      }
    }

    > ._bottom {
      height: 300px;
      margin: 170px auto 80px;

      > img {
        display: none;
      }

      ._left, ._right {
        margin: 0 30px;

        dl {
          dd {
            &:hover {
              p {
                color: #383E3F;
              }

              div {
                color: #959A9C;
              }
            }

            p {
              font-size: 15px;
            }
          }
        }
      }
    }
  }
}

/** 手机屏幕 */
@media screen and (max-width: $phone-max-width) {
  .cloud_sales_believe-cooperation {
    > .content {
      top: 25px;
      padding: 0 20px;

      p {
        font-size: 16px;
        max-width: 80vw;
      }
    }

    > ._bottom {
      height: auto;
      flex-direction: column;
      margin: 130px auto 60px;

      img {
        display: block;
        width: 70vw;
        margin: 8px auto;
      }

      ._right {
        margin-top: 20px;
      }

      ._left, ._right {
        margin: 0;

        dl {
          align-items: center;

          dd {
            margin: 10px 0;

            p {
              font-size: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
