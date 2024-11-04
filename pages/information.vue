<template>
    <div class="personal_information">
        <div class="information_title flex flex-a-c">
            <img class="title_icon" src="~/assets/images/icon_information.png" alt="" />
            <div class="title_text">个人信息</div>
        </div>
        <div class="info_form">
            <div class="form_item flex-a-c">
                <div class="form_label">头像</div>
                <div class="form_content"></div>
            </div>
            <div class="form_item flex-a-c">
                <div class="form_label">昵称</div>
                <div class="form_content">
                    <el-input placeholder="请输入"></el-input>
                </div>
            </div>
            <div class="form_item flex-a-c">
                <div class="form_label">性别</div>
                <div class="form_content">
                    <el-select style="width: 100%">
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="form_item flex-a-c">
                <div class="form_label">生日</div>
                <div class="form_content">
                    <el-date-picker style="width: 100%" placeholder="请选择"></el-date-picker>
                </div>
            </div>
            <div class="form_item flex-a-c">
                <div class="form_label">手机号码</div>
                <div class="form_content">
                    <el-input placeholder="请输入"></el-input>
                </div>
            </div>
            <div class="form_item flex-a-c">
                <div class="form_label">邮箱</div>
                <div class="form_content">
                    <div>
                        <el-input placeholder="请输入"></el-input>
                    </div>
                </div>
            </div>
            <div class="form_item">
                <div class="form_label">地区</div>
                <div class="form_content">
                    <el-select style="width: 100%">
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                    </el-select>
                    <div class="flex flex-a-c" style="width: 100%; margin-top: 4px">
                        <el-cascader style="width: 40%"></el-cascader>
                        <el-select style="width: 60%">
                            <el-option label="男" :value="1"></el-option>
                            <el-option label="女" :value="2"></el-option>
                        </el-select>
                    </div>
                    <el-input placeholder="请输入详细地址" style="margin-top: 4px"></el-input>
                </div>
            </div>
            <div class="form_item">
                <div class="form_label">个人简介</div>
                <div class="form_content">
                    <el-input type="textarea" placeholder="请输入"></el-input>
                </div>
            </div>
            <div class="form_item">
                <div class="form_label"></div>
                <div class="form_content">
                    <el-button class="save_btn" color="#09236c" type="primary">保存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '../config';
import { mapMutations } from 'vuex';

export default {
    components: {},
    data() {
        return {
            journeyContent: '<h1 style="color: red;" >我是行程记录</h1>',
            rating: 4,
            isComment: true,
        };
    },

    async fetch() {},
    methods: {
        handleAuthor() {
            window.location.href = '/authorIndex';
        },
    },
    mounted() {},
};
</script>
<style>
.main-content {
    background-color: #f5f5f5;
}
</style>
<style scoped lang="scss">
.information_title {
    margin-bottom: 24px;
    .title_icon {
        width: 40px;
        height: 40px;
        margin-right: 12px;
    }
    .title_text {
        color: #1c222b;
        font-size: 20px;
        font-weight: bold;
    }
}
.info_form {
    .form_item {
        display: flex;
        margin-bottom: 16px;
        .form_label {
            color: #2c2c2c;
            width: 80px;
            margin-right: 12px;
            font-weight: bold;
            text-align: right;
        }
        .form_content {
            width: 300px;
            .save_btn {
                width: 154px;
            }
        }
    }
}
/*中屏幕*/
@media screen and(max-width: $big-pc-width) {
}

@media screen and (max-width: $pad-max-width) {

}

@media screen and (max-width: $phone-max-width) {
    .information_title {
        margin-bottom: 12px;
        .title_icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }
        .title_text {
            font-size: 16px;
        }
    }
    .info_form {
        .form_item {
            display: block;
            margin-bottom: 8px;
            .form_label {
                width: fit-content;
                margin-right: 12px;
                margin-bottom: 4px;
            }
            .form_content {
                width: 100%;
                .save_btn {
                    width: 120px;
                }
            }
        }
    }
}
</style>
