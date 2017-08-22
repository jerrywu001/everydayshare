<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item href="#/import">系统设置</mu-breadcrumb-item>
			<mu-breadcrumb-item>分享初始化</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
		<div class="ht7" style="margin: 0 0 12px 0;">
   			<mu-icon class="title-tip" value="person_outline"/>请选择初始分享人员（默认第一个）
  		</div>
		<div class="peoples" style="margin: 0 0 32px 0; padding: 12px 0 0 25px;">
			<mu-radio v-for="item, _id in datas" :key="_id" :label="item.name" name="share" :nativeValue="item._id" v-model="startShareUid" class="share"/>
		</div>
		<div class="ht7">
   			<mu-icon class="title-tip" value="date_range"/>请初始分享日期
  		</div>
  		<div class="share-time">
  			<mu-date-picker v-model="startShareDate" hintText=""/>
  		</div>
  		<mu-raised-button label="保存" primary @click="saveData" style="margin: 42px 30px 0 30px;"/>
	</div>
</template>

<script>
    export default {
        name: 'init',
        data() {
            return {
                msg: '',
                datas: [],
                snackbar: false,
                isSaved: false,
                startShareUid: '',
                startShareDate: null,
                startSharePeople: {}
            };
        },
        computed: {
            systemInfo() {
                return this.$store.state.systemInfo;
            },
            shareDate() {
                let startShareDate = this.$store.state.systemInfo.startsharetime;
                return this.format(new Date(startShareDate), 'yyyy-MM-dd');
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
            initData(val) {
                this.showLoading();
                this.$ajax.getUsers().then((rsp) => {
                    this.hideLoading();
                    if (rsp.status === 200 && rsp.data.success) {
                        let result = [];
                        let datas = rsp.data.data || [];
                        for (var i = 0, len = datas.length; i < len; i++) {
                            if (datas[i].username !== 'admin') {
                                result.push(datas[i]);
                            }
                        }
                        this.datas = result;
                        this.setStartSharePeople();
                        if (!this.startShareDate) {
                            this.startShareDate = this.shareDate;
                        }
                    }
                });
            },
            setStartSharePeople() {
                for (var i = 0, len = this.datas.length; i < len; i++) {
                    if (this.datas[i]._id === this.systemInfo.startuserid) {
                        this.startSharePeople = this.datas[i];
                    }
                }
                this.startShareUid = this.startSharePeople._id;
            },
            saveData() {
                let flag = false;
                let rules = this.$store.state.systemInfo.sortrules || [];
                let startShareDate = this.dateStrToDate(this.startShareDate);

                if (this.isSaved) return false;
                
                for (let i = 0, len = rules.length; i < len; i++) {
                    if (startShareDate.getDay() === rules[i]) {
                        flag = true;
                    }
                }
                
                if (!flag) {
                    this.showSysTip('选择的日期不是分享日，请重新选择！');
                    return false;
                }

                this.showLoading();
                this.isSaved = true;
                this.$ajax.shareInit({
                    startuserid: this.startShareUid,
                    startsharetime: startShareDate
                }).then((rsp) => {
                    let _this = this;
                    this.hideLoading();
                    setTimeout(function() {
                        _this.isSaved = false;
                    }, 1000);
                    if (rsp.status === 200 && rsp.data.success) {
                        let systemInfo = this.$store.state.systemInfo;
                        systemInfo.startuserid = this.startShareUid;
                        systemInfo.startsharetime = startShareDate;
                        this.$store.commit('systemInfo', systemInfo);
                        this.showSysTip('更新成功！');
                    }
                });
            }
        },
        created() {
            this.initData();
        }
    };

</script>

<style lang="scss">
    .mu-radio.share {
        margin-right: 32px!important;
        .mu-radio-icon {
            margin-right: 5px!important;
        }
    }

    .share-time {
        padding: 20px 0 0 29px;
    }

</style>
