<template>
	<div class="home">
		<NavBar @nav-click="handleNavChange" :active-nav="activeList"></NavBar>
		<router-view class="sys-content"></router-view>
	</div>
</template>

<script>
    import NavBar from './Nav';

    export default {
        name: 'home',
        data() {
            return {
                activeList: ''
            };
        },
        components: {
            NavBar
        },
        computed: {
            systemInfo() {
                return this.$store.state.systemInfo;
            }
        },
        methods: {
            handleNavChange(val) {
                if (val === 'system') val = 'import';
                this.activeList = val;
                this.$router.push({
                    path: val
                });
            },
            getSystemInfo() {
                this.$ajax.system().then((rsp) => {
                    if (rsp.status === 200 && rsp.data.success) {
                        this.$store.commit('systemInfo', rsp.data.data);
                    }
                });
            }
        },
        created() {
            this.getSystemInfo();
        }
    };

</script>

<style lang="scss">
    @import '../scss/common.scss';

    .home {
        height: calc(100% - #{$headerh});
    }

    .sys-content {
        margin-left: $navw;
        margin-top: $headerh;
        height: 100%;
        padding: 16px 22px;
        overflow: auto;
        position: relative;
    }

</style>
