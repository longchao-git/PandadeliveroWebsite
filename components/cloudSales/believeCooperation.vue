<template>
  <div class='cloud_sales_believe-cooperation'>
    <div class='content'>
      <p>{{ $t('becomeRiderMaximizeIncome') }}</p>
      <div>{{ $t('recruitElite') }} {{ $t('salaryMotivatesYou') }}</div>
    </div>

    <div class='_bottom'>
      <div class='_left'>
        <dl>
          <img src='@/assets/images/cloudSales/home/icon_peixun.png' class='icon60' alt=''
               style='width: 60px;height: 60px'>
          <dd>
            <p>{{ $t('competitiveEarnings') }}</p>
            <div>{{ $t('earnDailyIncomeThroughPandaDelivero') }}</div>
          </dd>

        </dl>
      </div>
      <div class='_right'>
        <dl>
          <img src='@/assets/images/cloudSales/home/icon_peixun.png' class='icon60' alt=''
               style='width: 60px;height: 60px'>
          <dd>
            <p>{{ $t('flexibleSchedule') }}</p>
            <div>{{ $t('deliverAnytimeEarnWhatYouNeed') }}</div>
          </dd>
        </dl>
      </div>
      <div class='_right'>
        <dl>
          <img src='@/assets/images/cloudSales/home/icon_peixun.png' class='icon60' alt=''
               style='width: 60px;height: 60px'>
          <dd>
            <p>{{ $t('insuranceAndBenefits') }}</p>
            <div>{{ $t('rideSafelyWithPandaDeliveroEnjoyExclusiveOffers') }}</div>
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
  //background: #254969;
  background-image: url("@/assets/images/cloudSales/home/iconVIewView.png");
  background-size: cover;
  background-position: center;

  > .content {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    padding: 0 20px;
    box-sizing: border-box;
    max-width: 1400px;
    z-index: 1;

    p {
      font-size: 54px;
      color: #000;
      font-weight: bold;
      margin: 0 auto 10px;
      letter-spacing: 1px;
      max-width: 1300px;
      word-wrap: break-word;
      line-height: 1.3;
    }

    div {
      color: #777;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 26px;
      margin: 0 auto 10px;
      max-width: 800px;
      word-wrap: break-word;
    }
  }

  > ._bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 420px auto 120px;
    height: 120px;
    position: relative;
    z-index: 2;


    ._left, ._right {
      height: 100%;
      background: #FFFFFF;
      padding: 24px 20px;
      border-radius: 16px;
      margin: 0 12px;
      width: 424px;

      dl {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        //justify-content: space-between;

        dd {
          margin-left: 12px;

          &:hover {
            p, div {
              color: #f9c13e;
            }
          }

          p {
            font-size: 24px;
            font-weight: bold;
            color: #181818;
            margin-bottom: 6px;
          }

          div {
            font-size: 16px;
            color: #8B8B8B;
            max-width: 600px;
            font-weight: 500;
            display: flex;

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
      margin: 200px auto 80px;

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
      margin: 160px auto 60px;

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
