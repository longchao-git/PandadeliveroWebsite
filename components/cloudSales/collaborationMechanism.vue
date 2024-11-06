<template>
  <div class='cloud_sales_sales-collaboration-mechanism'>
    <div class='_bottom'>

      <div class='_right'>
        <div class='content'>
          <p>{{ $t(`成为骑手，最大化您的收入`) }}</p>
          <div>{{ $t(`诚聘精英`) }} {{ $t(`薪动你就来`) }}</div>
        </div>
        <dl>
          <dd @mouseover='currentStepsIndex = 0' @click='currentStepsIndex = 0'
              :class="[currentStepsIndex === 0 ? 'selected' : '']">
            <div>
              <div>
                <span>{{ $t(`快速简便的申请流程`) }}</span>
              </div>
            </div>
          </dd>
          <dd @mouseover='currentStepsIndex = 1' @click='currentStepsIndex = 1'
              :class="[currentStepsIndex === 1 ? 'selected' : '']">
            <div>
              <div>
                <span>{{ $t(`在适合您的时候交付`) }}</span>
              </div>
            </div>
          </dd>
          <dd @mouseover='currentStepsIndex = 2' @click='currentStepsIndex = 2'
              :class="[currentStepsIndex === 2 ? 'selected' : '']">
            <div>
              <div>
                <span>{{ $t(`享受每周收入`) }}</span>
              </div>
            </div>
          </dd>
          <dd @mouseover='currentStepsIndex = 3' @click='curraentStepsIndex = 3'
              :class="[currentStepsIndex === 3 ? 'selected' : '']">
            <div>
              <div>
                <span>{{ $t(`PandaDelivero快递员的独家优惠`) }}</span>
              </div>
            </div>
          </dd>
        </dl>
      </div>
      <div class='_left'>
        <img src='../../assets/images/cloudSales/home/about2-image.png' alt='' />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前选择的步骤
      currentStepsIndex: 0

    };
  }
};
</script>

<style lang='scss' scoped>
.cloud_sales_sales-collaboration-mechanism {
  position: relative;
  background: #fff;
  display: flex;

  .content {
    width: 100%;
    letter-spacing: 1px;
    margin-bottom: 36px;

    p {
      font-size: 54px;
      color: #000;
      font-weight: bold;
      line-height: 52px;
      max-width: 660px;
    }

    div {
      color: #777;
      font-size: 20px;
      font-weight: 400;
      line-height: normal;
    }
  }

  > ._bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 200px auto 130px;

    ._right, ._left {
      //align-self: flex-start;
    }

    ._right {
      margin-right: 30px;
      width: 40%;

      dl {
        dd {

          > div {
            height: 65px;
            border-left: 5px solid transparent;
            display: flex;
            align-items: center;
            letter-spacing: 1px;
            cursor: pointer;
            transition: .3s;

            &:hover {
              transition: .3s;
              border-color: #f9c13e;
              background: linear-gradient(90deg, #e1ecfc, #f6f9ff, #ffffff);
            }

            > div {
              p {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
              }

              span {
                font-size: 20px;
                color: #2C2C2C;
                font-weight: 500;
              }
            }

            &::before {
              background: #f9c13e;
              color: #fff;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              line-height: 40px;
              text-align: center;
              flex-shrink: 0;
              font-size: 16px;
              margin: 15px 20px 0;
              align-self: flex-start;
            }
          }

          @for $i from 1 to 6 {
            &:nth-of-type(#{$i}) > div::before {
              content: "#{$i}";
            }
          }
        }

        .selected {
          > div {
            border-color: #f9c13e !important;
            background: linear-gradient(90deg, #f9c13e, #ecf3ff, #ffffff) !important;

            &::before {
              background: #fff !important;
              color: #f9c13e !important;
            }
          }
        }

      }
    }

    ._left {
      img {
        width: 500px;
      }
    }
  }
}


/* 中屏幕*/
@media screen and(max-width: $big-pc-width) {
  .cloud_sales_sales-collaboration-mechanism {
    > .content {
      top: 20px;

      p {
        font-size: 24px;
      }
    }
  }
}

/** 平板屏幕 */
@media screen and (max-width: $pad-max-width) {
  .cloud_sales_sales-collaboration-mechanism {
    > .content {
      p {
        font-size: 20px;
        margin: auto;
        max-width: 70vw;
      }
    }

    > ._bottom {

      width: initial;
      margin: 160px auto 80px;

      ._right {
        order: -1;
        width: auto;
        max-width: 600px;
        padding: 0 40px;

        dl {
          dd {
            > img {
              display: block;
              max-width: 500px;
            }

            > div {
              height: 110px;
              transition: initial;

              &:hover {
                transition: initial;
                border-color: #fff;
                background: initial;
              }

              > div {
                p {
                  font-size: 14px;
                }

                span {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }

      ._left {
        margin: 10px auto 0;

        img {
          //display: none;
          width: auto;
          max-width: 500px;
          padding: 0 40px;
        }
      }
    }
  }
}

/** 手机屏幕 */
@media screen and (max-width: $phone-max-width) {
  .cloud_sales_sales-collaboration-mechanism {
    > .content {
      top: 40px;
      padding: 0 20px;

      p {
        font-size: 16px;
        max-width: 80vw;
      }
    }

    > ._bottom {
      margin: 140px auto 60px;

      ._right {
        width: 100vw;
        max-width: initial;
        padding: 0;

        dl {
          dd {
            > img {
              max-width: 100vw;
            }

            > div {
              height: auto;
              min-height: 95px;
              padding: 8px 0;

              > div {
                margin-right: 20px;
              }

              &::before {
                margin: 5px 10px 0;
                width: 35px;
                height: 35px;
                line-height: 35px;
                font-size: 14px;
              }
            }
          }
        }
      }

      ._left {
        img {
          width: 100vw;
          max-width: initial;
          padding: 0 40px;
        }
      }
    }
  }
}
</style>
