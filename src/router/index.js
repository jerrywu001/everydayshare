import Vue from 'vue';
import Header from '@/components/Header';
import Router from 'vue-router';
import Home from '@/components/Home';
import Login from '@/components/Login';
import UserInfo from '@/components/UserInfo';
import View from '@/components/View';
import Peoples from '@/components/Peoples';
import Account from '@/components/Account';
import Import from '@/components/Import';
import Admins from '@/components/Admins';
import Init from '@/components/Init';
import Holiday from '@/components/Holiday';
import Work from '@/components/Work';
import Email from '@/components/Email';
import Rules from '@/components/Rules';
import Leave from '@/components/Leave';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            components: {
                header: Header,
                default: Home
            },
            redirect: {
                name: 'view'
            },
            meta: {
                needLogin: false
            },
            children: [
                {
                    path: 'view',
                    name: 'view',
                    component: View,
                    meta: {
                        needLogin: false
                    }
				},
                {
                    path: 'peoples',
                    name: 'Peoples',
                    component: Peoples,
                    meta: {
                        needLogin: false
                    }
				},
                {
                    path: 'admins',
                    name: 'Admins',
                    component: Admins
				},
                {
                    path: 'account',
                    name: 'Account',
                    component: Account,
                    meta: {
                        needLogin: false
                    }
				},
                {
                    path: 'user',
                    name: 'UserInfo',
                    component: UserInfo
				},
                {
                    path: 'import',
                    name: 'Import',
                    component: Import
				},
                {
                    path: 'init',
                    name: 'Init',
                    component: Init
				},
                {
                    path: 'email',
                    name: 'Email',
                    component: Email
				},
                {
                    path: 'rules',
                    name: 'Rules',
                    component: Rules
				},
                {
                    path: 'holiday',
                    name: 'Holiday',
                    component: Holiday
				},
                {
                    path: 'work',
                    name: 'Work',
                    component: Work
				},
                {
                    path: 'leave',
                    name: 'Leave',
                    component: Leave
				}
		    ]
    	},
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                needLogin: false
            }
    	}
  	]
});
