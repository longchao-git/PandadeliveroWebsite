<template>
  <div class="detail_container">
    <expansion-market :lists='lists'/>
    <div class="flex flex-a-c flex-j-c mt3" style="cursor: pointer" @click='bindTapCilck'>
      <span class=" font18 " style='font-weight: 500;color: #ee8080'>{{morehidden? $t('creation.title') : $t('creation.oneTitle')}}</span>
    </div>
  </div>
</template>

<script>
import config from '../config';
import { mapMutations } from 'vuex';

import ExpansionMarket from '@/components/cloudSales/expansionMarket';
export default {
  components: {
    ExpansionMarket
  },
  data() {
    return {
      page:1,
      lists:[],
      keywords:'',
      morehidden:true
    };
  },

  async fetch() {},
  methods: {
    ...mapMutations(['SET_KEYWORDS']),
    handleAuthor(){
      window.location.href = '/authorIndex'
    },
    bindTapCilck(){
      this.page++
      this.shopSearch()
    },
    shopSearch(){
      this.morehidden = true
      const params = {
        data: {'page': this.page, "type":"shops","title":this.keywords, }
      };

      this.$axios.post('/client/waimai/shop/search', params,).then(res => {
        if(res.items.length==0){
          this.morehidden = false
        }else {
          this.morehidden = true
        }
        if(this.page == 1 ){
          this.lists = res.items
        }else {
          this.lists = this.lists.concat(res.items)
        }
      }).catch(err => {
        this.$message.info(err.message);
      });
    }
  },
  mounted() {
    if (this.$route.query.keywords) {
      this.keywords = this.$route.query.keywords
      this.SET_KEYWORDS(this.$route.query.keywords);
    }
    this.shopSearch()
  },
};
</script>
<style>
.main-content {
  background-color: #f5f5f5;
}
</style>
<style scoped lang="scss">
.detail_container {
  width: 90%;
  margin: 0 auto;
  padding: 24px 0;

}

</style>
