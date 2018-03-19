<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item href="#/import">系统设置</mu-breadcrumb-item>
			<mu-breadcrumb-item>分享规则</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
		<div class="ht7">
   			<mu-icon class="title-tip" value="today"/>请选择分享日期，进行设置
  		</div>
        <div class="date-list">
            <mu-checkbox v-for="i in labels" :key="i" name="group" :label="i" :nativeValue="i" v-model="list" class="date"/>
        </div>
		<div class="ht7" style="margin-top: 30px;">
   			<mu-icon class="title-tip" value="sort"/>请选择分享排序方式（默认为“入职顺序”）
  		</div>
        <div class="date-list">
            <mu-radio name="sorttype" label="入职顺序" nativeValue="normal" v-model="selectedSortType" class="date" style="margin-right: 28px;"/>
            <mu-radio name="sorttype" label="工号" nativeValue="worknumber" v-model="selectedSortType" class="date"/>
        </div>
  		<mu-raised-button label="保存" primary @click="saveData" style="margin: 42px 30px 0 30px;"/>
	</div>
</template>

<script>
    export default {
        name: 'rules',
        data() {
            return {
                msg: '',
                snackbar: false,
                isSaved: false,
                selectedSortType: '',
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                list: []
            };
        },
        computed: {
            uid() {
                return this.$store.state.userInfo.uid;
            },
            role() {
                return this.$store.state.userInfo.role;
            },
            systemInfo() {
                return this.$store.state.systemInfo;
            },
            sorttype() {
                return this.$store.state.systemInfo.sorttype;
            },
            sortrules() {
                return this.$store.state.systemInfo.sortrules;
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
            initSelectedLabels(sortrules) {
                let result = [];
                if (sortrules && sortrules.length) {
                    for (var i = 0, len = sortrules.length; i < len; i++) {
                        result.push(this.labels[sortrules[i] - 1]);
                    }
                }
                this.list = [].concat(result);
            },
            saveData() {
                let selectDates = [];
                if (!this.list || !this.list.length) {
                    this.showSysTip('至少选择一条数据！');
                    return false;
                }
                if (this.isSaved) return false;

                selectDates = this.getSelectDates();
                this.showLoading();
                this.isSaved = true;
                this.$ajax.sortRules({
                    sortrules: selectDates,
                    sorttype: this.selectedSortType
                }).then((rsp) => {
                    let _this = this;
                    setTimeout(function() { //1s钟之内只能点击一次
                        _this.isSaved = false;
                    }, 1000);
                    this.hideLoading();
                    if (rsp.status === 200 && rsp.data.success) {
                        let systemInfo = this.$store.state.systemInfo;
                        systemInfo.sortrules = selectDates;
                        this.$store.commit('systemInfo', systemInfo);
                        this.showSysTip('更新成功！');
                    } else {
                        this.showSysTip(rsp.data.msg);
                    }
                });
            },
            getSelectDates() {
                let result = [];
                let lists = this.list;
                let labels = this.labels;
                for (var i = 0, len = lists.length; i < len; i++) {
                    for (var j = 0, len1 = labels.length; j < len1; j++) {
                        if (lists[i] === labels[j]) {
                            result.push(j + 1);
                        }
                    }
                }
                return result;
            }
        },
        created() {
            if (this.sortrules) {
                this.selectedSortType = this.sorttype;
                this.initSelectedLabels(this.sortrules);
            } else {
                this.showLoading();
                this.$ajax.system().then((rsp) => {
                    this.hideLoading();
                    if (rsp.status === 200 && rsp.data.success) {
                        this.selectedSortType = rsp.data.data.sorttype;
                        this.initSelectedLabels(rsp.data.data.sortrules);
                    }
                });
            }
        }
    };

</script>

<style lang="scss">
    .date-list {
        padding: 20px 0 0 29px;
        .mu-checkbox.date {
            margin-right: 32px!important;
            .mu-checkbox-icon {
                margin-right: 5px!important;
            }
        }
        .mu-radio-icon {
            margin-right: 5px!important;
        }
    }

</style>
