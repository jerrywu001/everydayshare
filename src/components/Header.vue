<template>
	<div class="header">
		<div class="nav fixed">
			<div class="title">每日分享</div>
			<div class="user abs" href="javascript:;" v-if="name" @click="showDropMenuFun">
				<img :src="avator"/>
				<span></span>
			</div>
		</div>
		<router-link class="login abs" to="login" v-if="!name">登录</router-link>
		<div class="dropdown-menu dropdown-menu-sw" v-if="name && showDropMenu">
	        <div class="dropdown-header header-nav-current-user css-truncate">
	          欢迎 <strong class="css-truncate-target">{{ name }}</strong>
	        </div>
			<div class="dropdown-divider"></div>
			<a class="dropdown-item" href="javascript:;" @click="linkTo('user');">账号设置</a>
			<div class="dropdown-divider"></div>
			<a class="dropdown-item" href="javascript:;" @click="logout">退出</a>
		</div>
	</div>
</template>

<script>
    export default {
        name: 'header',
        data() {
            return {
                invalid: false,
                showDropMenu: false
            };
        },
        methods: {
            logout() {
                if (this.invalid) return false;
                this.invalid = true;
                this.showLoading();
                this.$ajax.logout().then((rsp) => {
                    this.hideLoading();
                    this.invalid = false;
                    this.showDropMenu = false
                    if (rsp.status === 200 && rsp.data.success) {
                        this.name = '';
                        this.$store.commit('userInfo', {});
                        this.$router.push({
                            path: '/login'
                        });
                    }
                });
            },
            showDropMenuFun() {
                this.showDropMenu = !this.showDropMenu;
            },
            handleHideMenu(e) {
                if (!this.isParent(e.target, $('.user')[0]) && !this.isParent(e.target, $('.dropdown-menu')[0])) {
                    this.showDropMenu = false;
                }
            },
            linkTo(val) {
                this.showDropMenu = false;
                this.$router.push({
                    path: val
                });
            }
        },
        computed: {
            name() {
                return this.$store.state.userInfo.name;
            },
            avator() {
                return this.$store.state.userInfo.avator || '/src/assets/imgs/default.jpg';
            }
        },
        mounted() {
            document.body.addEventListener('click', this.handleHideMenu, false);
        },
        destroyed() {
            document.body.removeEventListener('click', this.handleHideMenu, false);
        }
    };

</script>

<style lang="scss" scoped>
    @import '../scss/Header.scss';

</style>
