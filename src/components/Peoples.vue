<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item>人员列表</mu-breadcrumb-item>
			<mu-icon-button v-if="role" icon="person_add" class="delete-button" title="添加" @click="toggleDialog(1);" style="right: 66px!important;"/>
			<mu-icon-button v-if="role" icon="delete" class="delete-button" title="删除" @click="toggleConfirm"/>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
  		<div class="sys-table">
  			<mu-table enableSelectAll multiSelectable :selectable="role === 1" :showCheckbox="role === 1" :fixedHeader="fixedHeader" :height="tblHeight" ref="table">
				<mu-thead slot="header">
					<mu-tr>
						<mu-th v-if="uid && role">工号</mu-th>
						<mu-th>姓名</mu-th>
						<mu-th>邮箱</mu-th>
						<mu-th v-if="uid" style="text-align: center;">操作</mu-th>
					</mu-tr>
				</mu-thead>
				<mu-tbody>
					<mu-tr v-for="item,_id in datas" :key="_id" :selected="item.selected">
						<mu-td v-if="uid && role">{{ item.worknumber }}</mu-td>
						<mu-td>{{ item.name }}</mu-td>
						<mu-td>{{ item.email }}</mu-td>
						<mu-td v-if="uid" style="text-align: center;">
							<span v-if="!role && uid !== item._id">-</span>
							<mu-flat-button v-if="role || (!role && uid === item._id)" label="编辑" secondary @click="editPeople(item, $event)"/>
						</mu-td>
					</mu-tr>
				</mu-tbody>
			</mu-table>
  		</div>
  		<!-- 编辑对话框 -->
  		<mu-dialog :open="showDialog" @close="toggleDialog" title="基本信息编辑">
			<div class="dialog-box" style="padding: 0 12px 0 0;">
				<mu-text-field fullWidth label="工号" hintText="请填写工号" v-model="worknumber"/>
				<mu-text-field fullWidth label="姓名" hintText="请填写姓名" v-model="name"/>
				<mu-text-field fullWidth label="邮箱" hintText="请填写邮箱" v-model="email"/>
			</div>
			<mu-flat-button primary label="保存" @click="saveData" slot="actions"/>
			<mu-flat-button label="关闭" @click="toggleDialog" slot="actions" style="margin-right: 30px;"/>
		</mu-dialog>
		<!-- 确认对话框 -->
		<mu-dialog :open="showConfirm" title="友情提示" @close="toggleConfirm">
			确定删除选中项？
			<mu-flat-button slot="actions" @click="toggleConfirm" primary label="取消"/>
			<mu-flat-button slot="actions" primary @click="remove" label="确定"/>
		</mu-dialog>
	</div>
</template>

<script>
    export default {
        name: 'peoples',
        data() {
            return {
                msg: '',
                datas: [],
                tblHeight: (window.innerHeight - 212) + 'px',
                showDialog: false,
                showConfirm: false,
                fixedHeader: true,
                snackbar: false,
                multiSelectable: false,
                deleted: false,
                isAdd: false,
                selectedItem: {},
                //form field
                worknumber: '',
                name: '',
                email: ''
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
            toggleDialog(isAdd) {
                if (isAdd) {
                    this.isAdd = true;
                    this.worknumber = '';
                    this.name = '';
                    this.email = '';
                } else {
                    this.isAdd = false;
                }
                this.showDialog = !this.showDialog;
            },
            toggleConfirm() {
                let indexs = this.$refs.table.getTbody().convertSelectedRows();
                if (!indexs || !indexs.length) {
                    this.showSysTip('请选择要删除的数据！');
                    return false;
                }
                this.showConfirm = !this.showConfirm;
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
                            if (datas[i].username !== 'admin') {
                                result.push(datas[i]);
                            }
                        }
                        this.datas = [].concat(result);
                    }
                });
            },
            editPeople(item, e) {
                e.preventDefault();
                e.stopPropagation();
                this.worknumber = item.worknumber;
                this.name = item.name;
                this.email = item.email;
                this.selectedItem = item;
                this.toggleDialog();
            },
            saveData() {
                let name = this.trim(this.name);
                let email = this.trim(this.email);
                let worknumber = this.trim(this.worknumber);

                if (!worknumber) {
                    this.showSysTip('请输入工号！');
                    return false;
                }

                if (!worknumber.startsWith('sx') && !/^[0-9][0-9]*$/.test(worknumber)) {
                    this.showSysTip('工号为数字！');
                    return false;
                }

                if (!name) {
                    this.showSysTip('请输入姓名！');
                    return false;
                }

                if (!email) {
                    this.showSysTip('请输入邮箱！');
                    return false;
                }

                if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
                    this.showSysTip('邮箱格式错误！');
                    return false;
                }

                this.showLoading();
                if (this.isAdd) {
                    this.$ajax.addUser({
                        uid: this.selectedItem._id,
                        worknumber: worknumber,
                        replaceworknumber: this.selectedItem.worknumber,
                        name: name,
                        email: email
                    }).then((rsp) => {
                        this.hideLoading();
                        if (rsp.status === 200 && rsp.data.success) {
                            this.showSysTip(this.isAdd ? '添加成功！' : '更新成功！');
                            this.updateDatas();
                            this.toggleDialog();
                        } else {
                            this.showSysTip(rsp.data.msg);
                        }
                    });
                } else {
                    this.$ajax.editUser({
                        uid: this.selectedItem._id,
                        worknumber: this.worknumber,
                        replaceworknumber: this.selectedItem.worknumber,
                        name: this.name,
                        email: this.email
                    }).then((rsp) => {
                        this.hideLoading();
                        if (rsp.status === 200 && rsp.data.success) {
                            this.showSysTip(this.isAdd ? '添加成功！' : '更新成功！');
                            this.updateDatas();
                            this.toggleDialog();
                        } else {
                            this.showSysTip(rsp.data.msg);
                        }
                    });
                }
            },
            updateDatas() {
                if (this.isAdd) {
                    this.getUsers();
                } else {
                    for (var i = 0, len = this.datas.length; i < len; i++) {
                        let item = this.datas[i];
                        if (item._id === this.selectedItem._id) {
                            item.email = this.email;
                            item.name = this.name;
                            item.worknumber = this.worknumber;
                            break;
                        }
                    }
                }
            },
            remove() {
                let selectIndex = this.$refs.table.getTbody().convertSelectedRows();
                let uids = [];

                if (this.deleted) return false;

                if (!selectIndex || !selectIndex.length) {
                    this.toggleConfirm();
                    return false;
                }

                uids = this.getUids(selectIndex);
                this.showLoading();
                this.deleted = true;
                this.$ajax.removeUser({
                    ids: uids
                }).then((rsp) => {
                    this.hideLoading();
                    this.deleted = false;
                    this.toggleConfirm();
                    if (rsp.status === 200 && rsp.data.success) {
                        this.showSysTip('删除成功！');
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
                let flag = false;
                let result = [];
                let datas = [].concat(this.datas);
                for (var i = 0, len = datas.length; i < len; i++) {
                    for (var j = 0, len1 = uids.length; j < len1; j++) {
                        if (datas[i]._id === uids[j]) {
                            flag = true;
                        }
                    }

                    if (!flag) {
                        result.push(datas[i]);
                    }

                    flag = false;
                }
                this.datas = [].concat(result);
                this.selectedItem = {};
                this.$refs.table.unSelectAll();
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

    .mu-dialog {
        padding: 0 0 12px 0!important;
    }

    .delete-button {
        position: absolute!important;
        padding: 0!important;
        right: 23px!important;
        top: 4px!important;
        &:hover {
            color: #f60!important;
        }
    }

</style>
