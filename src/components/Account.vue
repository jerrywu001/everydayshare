<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item>账号设置</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
  		<div class="demo-step-container">
			<mu-stepper :activeStep="activeStep" style="margin: 0 auto; width: 78%;">
				<mu-step>
					<mu-step-label>输入姓名、工号</mu-step-label>
				</mu-step>
				<mu-step>
					<mu-step-label>设置账号、密码</mu-step-label>
				</mu-step>
				<mu-step>
					<mu-step-label>账号设置成功</mu-step-label>
				</mu-step>
			</mu-stepper>
			<div class="demo-step-content">
				<div class="step" v-if="finished">
					<p style="font-size: 16px;">账号设置成功！<router-link to="login">点这里</router-link>登录</p>
				</div>
				<template v-if="!finished">
					<div class="step" v-if="activeStep === 0">
						<mu-text-field fullWidth label="工号" hintText="请填写工号" v-model="worknumber"/>
						<mu-text-field fullWidth label="姓名" hintText="请填写姓名" v-model="name"/>
					</div>
					<div class="step" v-if="activeStep === 1">
						<mu-text-field fullWidth label="用户名" hintText="请设置用户名" v-model="username"/>
						<mu-text-field fullWidth label="密码" hintText="请输入密码" v-model="password"/>
						<mu-text-field fullWidth label="确认密码" hintText="请再次输入密码" v-model="rePassword"/>
					</div>
					<div v-if="!finished" class="step" style="margin: 10px auto 0px auto;">
						<mu-flat-button v-if="activeStep > 0" class="demo-step-button" label="上一步" primary @click="handlePrev" style="margin-right: 20px;"/>
						<mu-raised-button class="demo-step-button" :label="'下一步'" primary @click="handleNext"/>
					</div>
				</template>
</div>
</div>
</div>
</template>

<script>
    export default {
        name: 'account',
        data() {
            return {
                msg: '',
                snackbar: false,
                activeStep: 0,
                worknumber: null,
                name: '',
                username: '',
                password: '',
                rePassword: ''
            };
        },
        computed: {
            finished() {
                return this.activeStep > 1;
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
            switchChange(val) {
                if (this.disabled) return false;
                this.disabled = true;
                this.showLoading();
                this.$ajax.sendEmail({
                    sendemail: val
                }).then((rsp) => {
                    this.hideLoading();
                    this.disabled = false;
                    if (rsp.status === 200 && rsp.data.success) {
                        let data = this.$store.state.systemInfo;
                        data.sendemail = val;
                        this.$store.commit('systemInfo', data);
                        this.showSysTip('更新成功！');
                    }
                });
            },
            handleNext() {
                if (this.activeStep === 0) {
                    let name = this.trim(this.name);
                    let worknumber = this.trim(this.worknumber);

                    if (!worknumber) {
                        this.showSysTip('请输入工号！');
                        return false;
                    }
                    if (!name) {
                        this.showSysTip('请输入姓名！');
                        return false;
                    }
                    if (name === '管理员' && worknumber >= 100000) {
                        this.showSysTip('管理员账号不允许修改！');
                        return false;
                    }
                    this.$ajax.getUserByName({
                        worknumber: worknumber,
                        name: name
                    }).then((rsp) => {
                        if (rsp.status === 200 && rsp.data.success) {
                            this.activeStep++;
                        } else {
                            this.showSysTip(rsp.data.msg);
                        }
                    });
                }

                if (this.activeStep === 1) {
                    let username = this.trim(this.username);
                    let password = this.trim(this.password);
                    let rePassword = this.trim(this.rePassword);

                    if (!username) {
                        this.showSysTip('请输入用户名！');
                        return false;
                    }
                    if (username.toLocaleLowerCase() === 'admin') {
                        this.showSysTip('请设置“admin”以外的用户名！');
                        return false;
                    }
                    if (!password) {
                        this.showSysTip('请输入密码！');
                        return false;
                    }
                    if (password !== rePassword) {
                        this.showSysTip('两次密码输入不一致！');
                        return false;
                    }
                    this.$ajax.initUser({
                        worknumber: this.worknumber,
                        username: username,
                        password: password,
                        rePassword: rePassword
                    }).then((rsp) => {
                        if (rsp.status === 200 && rsp.data.success) {
                            this.activeStep++;
                        } else {
                            this.showSysTip(rsp.data.msg);
                        }
                    });
                }
            },
            handlePrev() {
                this.activeStep--;
            },
            reset() {
                this.activeStep = 0;
            }
        }
    };

</script>

<style lang="scss">
    .step {
        width: 70%;
        margin: 60px auto 0px auto;
    }

</style>
