import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        systemInfo: {},
        userInfo: {}
    },
    mutations: {
        userInfo(state, val) {
            state.userInfo = val;
        },
        systemInfo(state, val) {
            state.systemInfo = val;
        },
    }
});

export default store;
