<template>
	<mu-list @change="handleListChange" :value="activeNav">
		<mu-list-item title="分享月视图" value="view" >
			<mu-icon slot="left" value="date_range" />
		</mu-list-item>
		<mu-list-item title="人员列表" value="peoples">
			<mu-icon slot="left" value="group"/>
		</mu-list-item>
		<mu-list-item title="账号设置" value="account" v-if="!username">
			<mu-icon slot="left" value="settings"/>
		</mu-list-item>
		<mu-list-item title="个人资料" value="user" v-if="username">
			<mu-icon slot="left" value="settings"/>
		</mu-list-item>
		<mu-list-item title="我要休假" value="leave" v-if="username">
			<mu-icon slot="left" value="directions_bike"/>
		</mu-list-item>
		<mu-list-item title="系统设置" toggleNested value="system" v-if="role">
			<mu-icon slot="left" value="menu"/>
			<mu-list-item slot="nested" title="管理员设置" value="admins" v-if="role && username === 'admin'">
				<mu-icon slot="left" value="build"/>
			</mu-list-item>
			<mu-list-item slot="nested" title="人员导入" value="import">
				<mu-icon slot="left" value="person_add"/>
			</mu-list-item>
			<mu-list-item slot="nested" title="邮件通知" value="email">
				<mu-icon slot="left" value="contact_mail"/>
			</mu-list-item>
			<mu-list-item slot="nested" title="分享规则" value="rules">
				<mu-icon slot="left" value="description"/>
			</mu-list-item>
			<mu-list-item slot="nested" title="分享初始化" value="init">
				<mu-icon slot="left" value="create"/>
			</mu-list-item>
			<mu-list-item slot="nested" title="法定假期" value="holiday">
				<mu-icon slot="left" value="flight"/>
			</mu-list-item>
			<mu-list-item slot="nested" title="其他/临时假期" value="work">
				<mu-icon slot="left" value="directions_bike"/>
			</mu-list-item>
		</mu-list-item>
	</mu-list>
</template>

<script>
    export default {
        name: 'nav',
        data() {
            return {};
        },
        computed: {
            role() {
                return this.$store.state.userInfo.role;
            },
            username() {
                return this.$store.state.userInfo.username;
            }
        },
        props: {
            activeNav: String
        },
        methods: {
            handleListChange(val) {
                this.$emit('nav-click', val);
            }
        }
    };

</script>

<style lang="scss" scoped>
    @import '../scss/common.scss';

    .mu-list {
        background-color: #fafafa;
        width: 260px;
        padding: 0;
        position: absolute;
        left: 0;
        top: $headerh;
        height: calc(100% - #{$headerh});
    }

</style>

<style>
    @import '../scss/nav.css';

</style>
