<template>
  <div class="submit-order-page">
    <div class="order-info-box">
      <div class="order-info-title">订单信息</div>
      <div class="order-info-list">
        <div>收货地址：小明子 +86-13999999999 天津市 河区 中山路100号xxx大厦xxx单元 000000</div>
        <div>订单编号：32131643132162132</div>
        <div>供应商信息：电子现货</div>
      </div>
    </div>
    <div class="order-table-box">
      <table class="order-table">
        <thead>
          <tr>
            <th><div class="custom-checkbox"><img src="~/assets/images/icon_nofuxuan.png" class="checkbox-icon" /></div></th>
            <th>订单编号</th>
            <th>图片</th>
            <th>名称</th>
            <th>数量</th>
            <th>金额</th>
            <th>积分</th>
            <th>状态</th>
            <th>下单日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><div class="custom-checkbox"><img src="~/assets/images/icon_nofuxuan.png" class="checkbox-icon" /></div></td>
            <td>D123456789</td>
            <td><img src="~/assets/images/iconYuan.png" class="order-img" /></td>
            <td>ouis Vuitton Neverfull PM</td>
            <td>1</td>
            <td class="order-amount">€12.00</td>
            <td class="order-points">
                <div class="order-points-box">
                    <img src="~/assets/images/icon_jfien.png" class="price-icon" />
                    1800
                </div>
            </td>
            <td>待确认</td>
            <td>2024-04-29 15:00:00</td>
            <td><span class="order-delete">删除</span> <span class="order-detail">评价</span></td>
          </tr>
        </tbody>
      </table>
    </div>  
    <div class="order-summary-box">
      <div class="font18">总重量(kg)：1.965</div>
      <div class="order-summary-right">
        <div class="font18">实付价：456.9€</div>
        <div class="font18">运费：1.00€</div>
        <div class="font18">应付价：<span class="order-summary-pay font20">457.9€</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubmitOrderPage'
}
</script>

<style scoped lang="scss">
.submit-order-page {
  background: #fff;
  min-height: 100vh;
  padding: 160px 0;
}
.order-info-box {
  background: #fdf7ee;
  padding: 32px 40px;
  margin: 32px auto 0 auto;
  width: 80%;
  border-radius: 4px;
}
.order-info-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 18px;
}
.order-info-list > div {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}
.order-table-box {
  margin: 32px auto 0 auto;
  width: 80%;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}
.order-table th, .order-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
}
.order-table th {
  background: #fafafa;
  font-weight: 600;
  color: #383838;
}
.order-img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}
.order-amount {
  color: #FFB84D;
  font-weight: 600;
}
.order-points-box {
  color: #7AC554;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  .price-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    margin-right: 4px;
  }
}
.order-delete {
  color: #f44336;
  cursor: pointer;
  margin-right: 8px;
}
.order-detail {
  color: #888;
  cursor: pointer;
}
.custom-checkbox {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
.order-summary-box {
  margin: 32px auto 0 auto;
  width: 80%;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  font-size: 18px !important;
  color: #222;
}
.order-summary-right > div {
  margin-bottom: 6px;
  text-align: right;
}
.order-summary-pay {
  color: #f57c00;
  font-weight: 700;
}
</style> 