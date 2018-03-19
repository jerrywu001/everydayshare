<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item href="#/import">系统设置</mu-breadcrumb-item>
			<mu-breadcrumb-item>人员导入</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
		<div class="ht7">
   			<mu-icon class="title-tip" value="file_upload"/>请选择excel文件导入
  		</div>
		<div class="mu-text-field-content xlsx-wrap">
			<div class="mu-text-field-label" style="margin-bottom: 12px;">只支持.xlsx格式，大小500kb以内；格式“序号-姓名-工号-邮箱”</div>
			<div class="mu-text-field-hint show">
				<el-upload
					class="avatar-uploader"
					action="/api/v1/xlsx"
					:disabled="uploadDisabled"
					:show-file-list="false"
					:on-error="handleAvatarError"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload">
					<i class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</div>
		</div>
	</div>
</template>

<script>
    import elUpload from 'element-ui/lib/upload.js';

    export default {
        name: 'import',
        data() {
            return {
                msg: '',
                snackbar: false,
                uploadDisabled: false
            };
        },
        computed: {
            name() {
                return this.$store.state.userInfo.name;
            },
            username() {
                return this.$store.state.userInfo.username;
            }
        },
        components: {
            elUpload
        },
        methods: {
            showSysTip(msg) {
                this.snackbar = true;
                this.msg = msg;
                if (this.snackTimer) clearTimeout(this.snackTimer);
                this.snackTimer = setTimeout(() => {
                    this.snackbar = false
                }, this.sysTipTime);
            },
            handleAvatarError() {
                this.showSysTip('导入失败！');
                this.hideLoading();
                this.uploadDisabled = false;
            },
            handleAvatarSuccess(res, file) {
                this.hideLoading();
                this.uploadDisabled = false;

                if (file.response && file.response.success) {
                    let avator = file.response.url;
                    this.$ajax.updateUserAvator({
                        username: this.username,
                        avator: avator
                    }).then((rsp) => {
                        if (rsp.status === 200 && rsp.data.success) {
                            let _this = this;
                            _this.showSysTip('人员导入成功！');
                            setTimeout(function() {
                                _this.$router.push({
                                    path: '/peoples'
                                });
                            }, 500);
                        } else {
                            this.showSysTip(rsp.data.msg);
                        }
                    });
                } else {
                    let msg = file.response.msg || '网络错误，请稍后再试！';
                    this.showSysTip(msg);
                }
            },
            beforeAvatarUpload(file) {
                let type = file.name.substring(file.name.lastIndexOf('.') + 1);
                console.log(type);
                const isExcel = ['xlsx'].indexOf(type) > -1;
                console.log(isExcel);
                const isLt500 = file.size / 1024 / 1024 <= 0.5;

                if (this.isShowLoading()) {
                    return false;
                }

                if (!isExcel) {
                    this.showSysTip('只能上传xlsx格式！');
                    return false;
                }

                if (!isLt500) {
                    this.showSysTip('上传xlsx文件大小不能超过500KB！');
                    return false;
                }

                this.showLoading();
                this.uploadDisabled = true;

                return true;
            }
        }
    };

</script>

<style lang="scss">
    .el-upload {
        display: inline-block;
        text-align: center;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        height: 120px;
        width: 120px;
        input {
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            color: inherit;
            display: none;
        }
        img {
            width: 120px;
            height: 120px;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 118px;
            height: 118px;
            line-height: 118px;
            text-align: center;
            font-family: element-icons!important;
            speak: none;
            font-style: normal;
            font-weight: 400;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            vertical-align: baseline;
            display: inline-block;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            position: relative;
            &:before,
            &:after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                width: 30px;
                height: 3px;
                background-color: #8c939d;
                margin-top: -1px;
                margin-left: -15px;
            }
            &:after {
                -webkit-transform: rotate(90deg);
                transform: rotate(90deg);
            }
        }
    }

    .xlsx-wrap {
        padding: 15px 27px;
        height: auto!important;
    }

</style>
