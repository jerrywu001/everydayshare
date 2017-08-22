<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item>人员替换</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
		<div class="ht7" style="margin: 0 0 12px 0; position: relative;">
   			<mu-icon class="title-tip" value="person_outline"/>请选择替换人员
			<mu-icon-button icon="cancel" class="cancel-rpl" title="取消设置" @click="cancelReplace()"/>
  		</div>
		<div class="peoples" style="margin: 0 0 32px 0; padding: 12px 0 0 25px;">
			<mu-radio v-for="item, _id in datas" :key="_id" :label="item.name" name="share" :nativeValue="item._id" v-model="replaceShareUid" class="share"/>
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
                replaceShareUid: ''
            };
        },
        computed: {
            uid() {
                return this.$store.state.userInfo.uid;
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
                this.$ajax.getCurrentUser().then((rsp) => {
                    if (rsp.data.success) {
                        let _d = rsp.data.data;
                        this.replaceShareUid = _d.replaceno || '';
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
                            }
                        });
                    } else {
                        let _this = this;
                        _this.showSysTip('session失效！');
                        setTimeout(function() {
                            _this.$router.push({
                                path: '/login?next_url=%2Freplace'
                            });
                        }, 500);
                    }
                });
            },
            saveData() {
                if (this.isSaved) return false;
                if (this.uid === this.replaceShareUid) {
                    this.showSysTip('不能选择自己！');
                    return false;
                }

                this.showLoading();
                this.isSaved = true;
                this.$ajax.replaceShare({
                    replaceno: this.replaceShareUid
                }).then((rsp) => {
                    let _this = this;
                    this.hideLoading();
                    setTimeout(function() {
                        _this.isSaved = false;
                    }, 1000);
                    if (rsp.status === 200 && rsp.data.success) {
                        this.showSysTip('更新成功！');
                    }
                });
            },
            cancelReplace() {
                this.replaceShareUid = 'cancel';
                this.saveData();
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

    .cancel-rpl {
        position: absolute !important;
        padding: 0 !important;
        left: 147px !important;
        top: -8px !important;
    }

</style>
