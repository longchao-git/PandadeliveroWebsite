<template>
  <div class='cloud_sales_believe-cooperation'>
    <div class='content' v-if="type===0">
      <p>今天就注册并开始赚钱吧!</p>
    </div>

    <div class='_bottom' v-if="type===0">
      <img src='@/assets/images/viewAddBUtton.png' alt='' @click='bingTapClick' style='cursor: pointer'>
    </div>
    <div class='content' v-if="type===1">
      <p>关于我们</p>
    </div>
    <div class='aboutView' v-if="type===1">
      <p>Pandadelivero 是西班牙本地值得信赖的同城快递与外卖配送服务公司。我们致力于为客户提供快速、高效和可靠的配送体验。无论是餐馆外卖、文件递送，还是包裹运输，我们的服务都覆盖整个城市，确保您的每一件物品能够以最快的速度、安全地到达目的地。!</p>
      <p>我们的配送团队经验丰富，利用先进的物流技术进行实时追踪，让您随时掌控配送动态。Pandadelivero 不仅仅是配送，我们关注每一个细节，力求为客户提供卓越的用户体验。</p>
      <p>无论您身在何处，Pandadelivero 始终在您身边，为您传递美味和便利。</p>
    </div>


  </div>
</template>

<script>

export default {
  props: ['type'],
  methods:{
    bingTapClick(){
      window.location.href = '/creation'
    }
  }
};
</script>

<style lang='scss' scoped>
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
    img{
      width: 176px;
      height: 54px;
    }

  }
  .aboutView{
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
