const ajax = {
    login(params) {
        return axios.post('/api/v1/login', params);
    },
    logout() {
        return axios.get('/api/v1/logout');
    },
    loginCheck() {
        return axios.get('/api/v1/login/check');
    },
    register() {
        return axios.post('/api/v1/register', params);
    },
    getCurrentUser() {
        return axios.get('/api/v1/user');
    },
    getUserByName(params) {
        return axios.post('/api/v1/user/name', params);
    },
    getUsers() {
        return axios.get('/api/v1/users');
    },
    updateUserAvator(params) {
        return axios.put('/api/v1/user/avator', params);
    },
    removeUser(params) {
        return axios.put('/api/v1/user/remove', params);
    },
    addUser(params) {
        return axios.put('/api/v1/user/add', params);
    },
    editUser(params) {
        return axios.put('/api/v1/user/edit', params);
    },
    initUser(params) {
        return axios.put('/api/v1/user/init', params);
    },
    userUpdate(params) {
        return axios.put('/api/v1/user/update', params);
    },
    setAdmin(params) {
        return axios.put('/api/v1/user/setadmin', params);
    },
    sendEmail(params) {
        return axios.put('/api/v1/system/email/send', params);
    },
    sendEmailTime(params) {
        return axios.put('/api/v1/system/email/time', params);
    },
    system() {
        return axios.get('/api/v1/system');
    },
    shareInit(params) {
        return axios.put('/api/v1/system/shareinit', params);
    },
    shareList() {
        return axios.get('/api/v1/system/sharelist');
    },
    sortRules(params) {
        return axios.put('/api/v1/system/sortrules', params);
    },
    setHoliday(params) {
        return axios.put('/api/v1/system/holiday', params);
    },
    setOutWorkDay(params) {
        return axios.put('/api/v1/user/setoutworkday', params);
    },
    replaceShare(params) {
        return axios.put('/api/v1/user/replaceshare', params);
    },
    uptoken() {
        return axios.get('/api/v1/uptoken');
    }
};

export default ajax;
