<template>
    <div class="cloud_sales_home p-relative">
        <template>
            <!-- 热门VLOG -->
            <expansion-market />
        </template>

    </div>
</template>

<script>
import ExpansionMarket from './expansionMarket';

export default {
    components: {
        ExpansionMarket
    },
};
</script>

<style lang="scss" scoped>
.cloud_sales_home {
}

/* 中屏幕*/
@media screen and(max-width: $big-pc-width) {
}

/** 平板屏幕 */
@media screen and (max-width: $pad-max-width) {
}

/** 手机屏幕 */
@media screen and (max-width: $phone-max-width) {
}
</style>
