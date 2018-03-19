<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item href="#/import">系统设置</mu-breadcrumb-item>
			<mu-breadcrumb-item>管理员设置</mu-breadcrumb-item>
			<mu-icon-button icon="build" class="delete-button" title="批量设置" @click="setAllAsAdmin"/>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
  		<div class="sys-table">
  			<mu-table enableSelectAll multiSelectable showCheckbox :fixedHeader="fixedHeader" :height="tblHeight" ref="table">
				<mu-thead>
					<mu-tr>
						<mu-th>工号</mu-th>
						<mu-th>姓名</mu-th>
						<mu-th>邮箱</mu-th>
						<mu-th>角色</mu-th>
						<mu-th style="text-align: center;">操作</mu-th>
					</mu-tr>
				</mu-thead>
				<mu-tbody>
					<mu-tr v-for="item in datas" :key="item._id" :selectable="item.selectable">
						<mu-td>{{ item.worknumber }}</mu-td>
						<mu-td>{{ item.name }}</mu-td>
						<mu-td>{{ item.email }}</mu-td>
						<mu-td>{{ item.role == 1? '管理员': '用户' }}</mu-td>
						<mu-td style="text-align: center;">
							<span v-if="!item.selectable && (item.username === 'admin' || uid === item._id)">-</span>
							<mu-flat-button v-if="!item.selectable && item.username !== 'admin' && uid !== item._id" label="解除" secondary @click="showSetDailog(item, 0, $event)"/>
							<mu-flat-button v-if="item.selectable" label="设置" secondary @click="showSetDailog(item, 1, $event)"/>
						</mu-td>
					</mu-tr>
				</mu-tbody>
			</mu-table>
  		</div>
		<!-- 确认对话框 -->
		<mu-dialog :open="showConfirm" title="友情提示" @close="toggleConfirm">
			{{ action? '确认设置选中人员为管理员？': '确认解除选中人员为管理员？' }}
			<mu-flat-button slot="actions" @click="toggleConfirm" primary label="取消"/>
			<mu-flat-button slot="actions" primary @click="setAsAdmin" label="确定"/>
		</mu-dialog>
	</div>
</template>

<script>
    export default {
        name: 'admins',
        data() {
            return {
                msg: '',
                datas: [],
                action: 1,
                tblHeight: (window.innerHeight - 172) + 'px',
                selectItem: null,
                seted: false,
                showConfirm: false,
                fixedHeader: true,
                snackbar: false,
                multiSelectable: false
            };
        },
        computed: {
            uid() {
                return this.$store.state.userInfo.uid;
            },
            role() {
                return this.$store.state.userInfo.role;
            }
        },
        methods: {
            toggleConfirm() {
                this.showConfirm = !this.showConfirm;
            },
            setAllAsAdmin() {
                let indexs = this.$refs.table.getTbody().convertSelectedRows();
                if (!indexs || !indexs.length) {
                    this.showSysTip('请选择要更新的数据！');
                    return false;
                }
                this.action = 1;
                this.selectItem = null;
                this.toggleConfirm();
            },
            showSetDailog(item, role, e) {
                e.preventDefault();
                e.stopPropagation();
                this.action = role;
                this.selectItem = item;
                this.toggleConfirm();
            },
            showSysTip(msg) {
                this.snackbar = true;
                this.msg = msg;
                if (this.snackTimer) clearTimeout(this.snackTimer);
                this.snackTimer = setTimeout(() => {
                    this.snackbar = false
                }, this.sysTipTime);
            },
            getUsers() {
                this.showLoading();
                this.$ajax.getUsers().then((rsp) => {
                    this.hideLoading();
                    if (rsp.status === 200 && rsp.data.success) {
                        let result = [];
                        let datas = rsp.data.data || [];
                        for (var i = 0, len = datas.length; i < len; i++) {
                            datas[i].selectable = true;
                            if (datas[i].role === 1) {
                                datas[i].selectable = false;
                            }
                            result.push(datas[i]);
                        }
                        this.datas = [].concat(result);
                    }
                });
            },
            setAsAdmin() {
                let selectIndex = this.$refs.table.getTbody().convertSelectedRows();
                let uids = [];

                if (this.seted) return false;

                if (!selectIndex) {
                    this.toggleConfirm();
                    return false;
                }

                if (!selectIndex.length && this.selectItem) {
                    uids = [this.selectItem._id];
                } else {
                    uids = this.getUids(selectIndex);
                }

                this.showLoading();
                this.seted = true;
                this.$ajax.setAdmin({
                    ids: uids,
                    role: this.action
                }).then((rsp) => {
                    this.hideLoading();
                    this.seted = false;
                    this.toggleConfirm();
                    if (rsp.status === 200 && rsp.data.success) {
                        this.showSysTip('更新成功！');
                        this.resetDataStatus(uids);
                    } else {
                        this.showSysTip(rsp.data.msg);
                    }
                });
            },
            getUids(indexs) {
                let result = [];
                for (var i = 0, len = indexs.length; i < len; i++) {
                    result.push(this.datas[indexs[i]]._id);
                }
                return result;
            },
            resetDataStatus(uids) {
                let datas = [].concat(this.datas);
                for (var i = 0, len = uids.length; i < len; i++) {
                    for (var j = 0, len1 = datas.length; j < len1; j++) {
                        if (datas[j]._id === uids[i]) {
                            datas[j].selectable = this.action ? false : true;
                            datas[j].role = this.action;
                        }
                    }
                }
                this.datas = [].concat(datas);
                this.selectItem = null;
                if (this.action) {
                    this.$refs.table.unSelectAll();
                }
            }
        },
        mounted() {
            this.getUsers();
        }
    };

</script>

<style lang="scss">
    .sys-table {
        height: calc(100% - 80px);
    }

    .delete-button {
        float: right;
        position: absolute;
        padding: 0;
        right: 23px;
        top: 4px;
        &:hover {
            color: #f60;
        }
    }

</style>
