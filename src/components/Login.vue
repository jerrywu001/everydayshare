<template>
	<div class="login">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<div class="login-title">
			<h1>每日分享</h1>
		</div>
		<div class="htmleaf-container">
			<div class="wrapper">
				<div class="container">
					<div class="form">
						<input type="text" v-model="username" placeholder="用户名" autocomplete="false">
						<input type="password" v-model="password" placeholder="密码" autocomplete="false">
						<button type="submit" id="login-button" @click="login" :disabled="invalid">登录</button>
					</div>
				</div>
				
				<ul class="bg-bubbles">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                msg: '',
                snackbar: false,
                invalid: false,
                username: '',
                password: ''
            };
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
            login() {
                let query = this.$route.query;
                let next_url = query && query.next_url ? query.next_url : '/';

                if (this.invalid) {
                    return false;
                }
                if (!this.username) {
                    this.showSysTip('请输入用户名！');
                    return false;
                }
                if (!this.password) {
                    this.showSysTip('请输入密码！');
                    return false;
                }
                this.invalid = true;
                this.showLoading();
                this.$ajax.login({
                    username: this.username,
                    password: this.password
                }).then((rsp) => {
                    this.hideLoading();
                    this.invalid = false;
                    if (rsp.status === 200) {
                        if (rsp.data.success) {
                            this.msg = '';
                            this.username = '';
                            this.password = '';
                            this.$router.push({
                                path: decodeURIComponent(next_url)
                            });
                        } else {
                            this.showSysTip(rsp.data.msg);
                        }
                    } else {
                        this.showSysTip('网络错误，请稍后再试！');
                    }
                });
            }
        },
        created() {
            this.$ajax.loginCheck().then((rsp) => {
                if (rsp.status === 200 && rsp.data.success) {
                    this.$router.push({
                        path: '/'
                    });
                }
            });
        }
    };

</script>

<style lang="css" scoped>
    @import '../scss/login.css';

</style>
