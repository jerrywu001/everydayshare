<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item>个人资料</mu-breadcrumb-item>
		</mu-breadcrumb>
        <mu-divider style="margin: 26px 0px 28px"/>
  		<div class="user-form step">
			<mu-text-field fullWidth label="姓名" hintText="请设置用户名" v-model="name" disabled/>
			<mu-text-field fullWidth label="用户名" hintText="请设置用户名" v-model="username" disabled/>
			<mu-text-field fullWidth label="旧密码" hintText="请输入旧密码" v-model="oldPassword"/>
			<mu-text-field fullWidth label="新密码" hintText="请输入密码" v-model="password"/>
			<mu-text-field fullWidth label="确认新密码" hintText="请再次输入密码" v-model="rePassword"/>
			<div class="save-button" style="margin: 10px auto 0px auto;">
				<mu-raised-button label="保存" primary @click="saveData"/>
			</div>
		</div>
		<div class="mu-text-field-content avator-wrap">
			<div class="mu-text-field-label" style="margin-bottom: 12px;">头像（点击修改）</div>
			<div class="mu-text-field-hint show">
				<el-upload
					class="avatar-uploader"
					action="/api/v1/uploadAvator"
					accept=".jpg,.jpeg,.gif,.png"
					:disabled="uploadDisabled"
					:show-file-list="false"
					:on-error="handleAvatarError"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload">
					<img v-if="avator" :src="avator" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</div>
		</div>
	</div>
</template>

<script>
    import elUpload from 'element-ui/lib/upload.js';
    export default {
        name: 'account',
        data() {
            return {
                msg: '',
                snackbar: false,
                uploadDisabled: false,
                avator: '',
                oldPassword: '',
                password: '',
                rePassword: ''
            };
        },
        components: {
            elUpload
        },
        computed: {
            name() {
                return this.$store.state.userInfo.name;
            },
            username() {
                return this.$store.state.userInfo.username;
            }
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
            saveData() {
                let password = this.trim(this.password);
                let oldPassword = this.trim(this.oldPassword);
                let rePassword = this.trim(this.rePassword);

                if (!oldPassword) {
                    this.showSysTip('请输入旧密码！');
                    return false;
                }
                if (!password) {
                    this.showSysTip('请输入新密码！');
                    return false;
                }
                if (password !== rePassword) {
                    this.showSysTip('两次密码输入不一致！');
                    return false;
                }
                this.$ajax.userUpdate({
                    username: this.username,
                    avator: this.avator,
                    oldPassword: this.oldPassword,
                    password: this.password
                }).then((rsp) => {
                    if (rsp.status === 200 && rsp.data.success) {
                        this.showSysTip('更新成功！');
                        if (this.password) {
                            this.$ajax.logout().then((rsp) => {
                                let _this = this;
                                setTimeout(() => {
                                    _this.$router.push({
                                        path: '/login?next_url=%2Fuser'
                                    });
                                }, 1000);
                            });
                        }
                    } else {
                        this.showSysTip(rsp.data.msg);
                    }
                });
            },
            handleAvatarError() {
                this.showSysTip('上传失败！');
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
                            let userInfo = this.$store.state.userInfo;
                            userInfo.avator = avator;
                            this.showSysTip('更新成功！');
                            this.avator = avator;
                            this.$store.commit('userInfo', userInfo);
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
                const isImage = ['image/jpg', 'image/jpeg', 'image/png'].indexOf(file.type) > -1;
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (this.isShowLoading()) {
                    return false;
                }

                if (!isImage) {
                    this.showSysTip('只能上传图片格式！');
                }

                if (!isLt2M) {
                    this.showSysTip('上传头像图片大小不能超过 2MB！');
                }

                if (isImage && isLt2M) {
                    this.showLoading();
                    this.uploadDisabled = true;
                }

                return isImage && isLt2M;
            }
        },
        created() {
            this.avator = this.$store.state.userInfo.avator || '/src/assets/imgs/default.jpg';
        }
    };

</script>

<style lang="scss">
    .user-form {
        margin: 0 0 0 36px!important;
        width: 465px!important;
        float: left;
    }

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

    .avator-wrap {
        float: left;
        margin-left: 150px;
        border-left: 1px #dedddd dashed;
        height: 450px!important;
        padding-left: 50px;
    }

</style>
