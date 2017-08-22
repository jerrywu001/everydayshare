<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item href="#/import">系统设置</mu-breadcrumb-item>
			<mu-breadcrumb-item>法定假期</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
  		<div class="sys-table days" v-if="!isEmpty">
  			<mu-table :selectable="false" :showCheckbox="false" ref="table">
				<mu-thead slot="header">
					<mu-tr>
						<mu-th>假期开始时间</mu-th>
						<mu-th>假期天数</mu-th>
					</mu-tr>
				</mu-thead>
				<mu-tbody>
					<mu-tr v-for="(value, key) in holidays" :key="key">
						<mu-td>{{ key }}</mu-td>
						<mu-td>{{ value }}天</mu-td>
					</mu-tr>
				</mu-tbody>
			</mu-table>
  		</div>
  		<div class="empty" v-if="isEmpty">
  			<p>还未设置法定假期</p>
  		</div>
	</div>
</template>

<script>
    export default {
        name: 'holiday',
        data() {
            return {
                msg: '',
                snackbar: false,
                datas: null,
                isEmpty: false
            };
        },
        computed: {
            holidays() {
                let holidays = this.$store.state.systemInfo.holiday;
                return holidays && holidays.length ? holidays[0] : {};
            }
        },
        watch: {
            holidays: function(newval) {
                console.log(newval);
                this.isEmpty = !(newval && Object.keys(newval).length);
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
            saveData() {
                if (this.disabled) return false;
                this.disabled = true;
                this.showLoading();
                this.$ajax.setHoliday({
                    data: this.datas
                }).then((rsp) => {
                    this.hideLoading();
                    this.disabled = false;
                    if (rsp.status === 200 && rsp.data.success) {
                        let data = this.$store.state.systemInfo;
                        data.holiday = this.datas;
                        this.$store.commit('systemInfo', data);
                        this.showSysTip('更新成功！');
                    }
                });
            }
        }
    };

</script>

<style lang="scss">
    .days {
        margin: 20px 20% 0 26px;
    }

    .empty {
        font-size: 16px;
        padding: 0 0 12px 0;
    }

</style>
