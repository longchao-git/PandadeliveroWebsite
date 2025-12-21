<template>
  <div class='cloud_sales_believe-cooperation'>
    <div class='content'>
      <p>{{ $t('requirementsToBecomeRider') }}</p>
    </div>

    <div class='_bottom'>
      <div class='_left'>
        <dl>
          <img src='@/assets/images/cloudSales/home/header2-img1.png' class='icon60' alt=''
               style='width: 280px;height: 174px;border-radius: 12px'>
          <dd>
            <p>18+ & {{ $t('workPermit') }}</p>
            <div>{{ $t('mustBeAtLeast18YearsOld') }}<br>
              {{ $t('haveRightToWorkInSpain') }}
            </div>
          </dd>
        </dl>
      </div>
      <div class='_right'>
        <dl>
          <img src='@/assets/images/cloudSales/home/header2-img2.png' class='icon60' alt=''
               style='width: 280px;height: 174px;border-radius: 12px'>
          <dd>
            <p> {{ $t('smartphone') }} </p>
            <div> {{ $t('iphoneWithIos10OrAndroid5') }}</div>
          </dd>
        </dl>
      </div>
      <div class='_right'>
        <dl>
          <img src='@/assets/images/cloudSales/home/header2-img3.png' class='icon60' alt=''
               style='width: 280px;height: 174px;border-radius: 12px'>
          <dd>
            <p>{{ $t('bicycleMopedOrElectricVehicle') }} </p>
            <div>{{ $t('chooseYourPreferredTransportAndStartDelivering') }}
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss' scoped>
.cloud_sales_believe-cooperation {
  position: relative;
  display: flex;
  background: #FFFFFF;
  //background-image: url("@/assets/images/cloudSales/home/iconVIewView.png");
  //background-size: cover;
  //background-position: center;

  > .content {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;

    p {
      font-size: 54px;
      color: #000;
      font-weight: bold;
      margin: 0 auto 10px;
      letter-spacing: 1px;
      max-width: 800px;
    }

    div {
      color: #777;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 26px;
      margin: 0 auto 10px;
      max-width: 800px;
    }
  }

  > ._bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 260px auto 120px;
    height: 358px;


    ._left, ._right {
      height: 100%;
      background: #fefbfb;
      border-radius: 12px;
      margin: 0 40px;
      width: 280px;

      dl {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        dd {


          &:hover {
            p, div {
              color: #f9c13e;
            }
          }

          p {
            font-size: 18px;
            font-weight: 500;
            color: #000;
            margin-top: 24px;
            margin-bottom: 24px;
            text-align: center;
          }

          div {
            font-size: 14px;
            color: #2C2C2C;
            line-height: 22px;
            width: 232px;
            text-align: center;
          }
        }
      }
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
