<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item href="#/import">系统设置</mu-breadcrumb-item>
			<mu-breadcrumb-item>其他/临时假期</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
		<div class="ht7" style="margin: 20px 20% 0 26px;">
   			<mu-icon class="title-tip" value="edit"/>点击添加假期
  		</div>
  		<div class="mu-text-field-label" style="margin: 16px 50px 0 50px;">不允许添加重复假期（包含法定假期）</div>
  		<div class="switchbox fl" style="margin: 30px 55px 16px 55px;">
  			<mu-date-picker v-model="time" hintText="选择日期"/>
  		</div>
  		<div class="switchbox fl" style="margin: 0 55px;width: 256px;">
  			<mu-text-field fullWidth label="设置假期天数" hintText="填写假期天数" v-model="days"/>
  		</div>
  		<mu-raised-button label="保存" primary @click="saveData" style="margin: 22px 30px 0 55px;"/>
  		<div class="sys-table days" v-if="!isEmpty">
  			<mu-table :selectable="false" :showCheckbox="false" ref="table">
				<mu-thead slot="header">
					<mu-tr>
						<mu-th>假期开始时间</mu-th>
						<mu-th>假期天数</mu-th>
						<mu-th>操作</mu-th>
					</mu-tr>
				</mu-thead>
				<mu-tbody>
					<mu-tr v-for="(value, key) in holidays" :key="key">
						<mu-td>{{ key }}</mu-td>
						<mu-td>{{ value }}天</mu-td>
						<mu-td>
							<mu-flat-button label="删除" secondary @click="toggleDelConfirm(key, value, $event)"/>
						</mu-td>
					</mu-tr>
				</mu-tbody>
			</mu-table>
  		</div>
  		<div class="empty" v-if="isEmpty">
  			<p>还未设置其他/临时假期</p>
  		</div>
		<!-- 确认对话框 -->
		<mu-dialog :open="showDelConfirm" title="友情提示" @close="toggleDelConfirm">
			确定删除选中假期？
			<mu-flat-button slot="actions" @click="toggleDelConfirm" primary label="取消"/>
			<mu-flat-button slot="actions" primary @click="remove" label="确定"/>
		</mu-dialog>
	</div>
</template>

<script>
    export default {
        name: 'work',
        data() {
            return {
                msg: '',
                time: '',
                days: '',
                snackbar: false,
                datas: null,
                isEmpty: false,
                showDelConfirm: false,
                selectedDate: {},
                outWorkDays: []
            };
        },
        computed: {
            holidays() {
                let holidays = this.$store.state.systemInfo.outworkday;
                holidays = holidays && holidays.length ? holidays[0] : {};
                this.isEmpty = !(holidays && Object.keys(holidays).length);
                return holidays;
            }
        },
        watch: {
            holidays: function(newval) {
                this.isEmpty = !(newval && Object.keys(newval).length);
                this.setOutWorkDays();
            }
        },
        methods: {
            toggleDelConfirm(key, value, e) {
                if (key) {
                    this.selectedDate = {};
                    this.selectedDate[key] = value;
                }
                this.showDelConfirm = !this.showDelConfirm;
            },
            showSysTip(msg) {
                this.snackbar = true;
                this.msg = msg;
                if (this.snackTimer) clearTimeout(this.snackTimer);
                this.snackTimer = setTimeout(() => {
                    this.snackbar = false
                }, this.sysTipTime);
            },
            setOutWorkDays() {
                let result = [];
                let day = 0;
                let systemInfo = this.$store.state.systemInfo;
                let holiday = {};
                let outworkday = {};

                if (!systemInfo || !Object.keys(systemInfo).length) {
                    return false;
                }

                holiday = systemInfo.holiday;
                outworkday = systemInfo.outworkday;
                holiday = holiday && holiday.length ? holiday[0] : {};
                outworkday = outworkday && outworkday.length ? outworkday[0] : {};

                for (let i in holiday) {
                    day = this.dateStrToDate(i).getTime() + 24 * 60 * 60 * 1000 * (holiday[i] - 1);
                    result.push({
                        start: i,
                        end: this.format(new Date(day), 'yyyy-MM-dd')
                    })
                }

                for (let j in outworkday) {
                    day = this.dateStrToDate(j).getTime() + 24 * 60 * 60 * 1000 * (outworkday[j] - 1);
                    result.push({
                        start: j,
                        end: this.format(new Date(day), 'yyyy-MM-dd')
                    })
                }
                this.outWorkDays = result;
            },
            checkRepeat(date, endDate) {
                let flag = false;
                let days = this.outWorkDays;
                for (let k = 0, len0 = days.length; k < len0; k++) {
                    if (date <= days[k].end && date >= days[k].start) {
                        flag = true;
                        break;
                    }
                }

                if (endDate) {
                    for (let i = 0, len = days.length; i < len; i++) {
                        if ((endDate <= days[i].end && endDate >= days[i].start) || (date <= days[i].start && endDate >= days[i].end)) {
                            flag = true;
                            break;
                        }
                    }
                }
                return flag;
            },
            saveData() {
                let days = this.trim(this.days.toString());
                let endDate = '';
                let nowDate = this.format(new Date(), 'yyyy-MM-dd');
                endDate = this.time ? this.format(new Date(this.dateStrToDate(this.time).getTime() + 24 * 60 * 60 * 1000 * (days - 1)), 'yyyy-MM-dd') : void 0;

                if (!this.time) {
                    this.showSysTip('请选择日期！');
                    return false;
                }

                if (this.time <= nowDate) {
                    this.showSysTip('请设置今天以后的日期！');
                    return false;
                }

                if (!/^[0-9][0-9]*$/.test(days)) {
                    this.showSysTip('假期天数为正整数！');
                    return false;
                }

                if (days < 1) {
                    this.showSysTip('假期天数必须大于0！');
                    return false;
                }

                if (days > 20) {
                    this.showSysTip('假期天数最多20天！');
                    return false;
                }

                if (this.checkRepeat(this.time, endDate)) {
                    this.showSysTip('假期重复，请重新设置！');
                    return false;
                }

                this.datas = this.holidays || {};
                this.datas[this.time] = parseInt(days);
                this.postData(this.datas);
            },
            postData(datas) {
                if (this.disabled) return false;
                this.disabled = true;
                this.showLoading();
                this.$ajax.setHoliday({
                    data: datas,
                    type: 'outworkday'
                }).then((rsp) => {
                    this.hideLoading();
                    this.disabled = false;
                    if (rsp.status === 200 && rsp.data.success) {
                        let data = this.$store.state.systemInfo;
                        data.outworkday = [datas];
                        this.time = '';
                        this.days = '';
                        this.$store.commit('systemInfo', data);
                        this.showSysTip('更新成功！');
                    } else {
                        this.showSysTip(rsp.data.msg);
                    }
                });
            },
            remove() {
                let selectedDate = '';
                let days = this.holidays;
                let date = {};

                for (let i in this.selectedDate) {
                    selectedDate = i;
                }

                for (let j in days) {
                    if (selectedDate !== j) {
                        date[j] = days[j];
                    }
                }
                this.postData(date);
                this.toggleDelConfirm();
            }
        },
        mounted() {
            this.setOutWorkDays();
        }
    };

</script>

<style lang="scss">
    .days {
        margin: 20px 20% 0 26px;
        height: auto!important;
    }

    .empty {
        font-size: 16px;
        padding: 0 0 12px 55px;
        margin-top: 22px;
        clear: both;
    }

</style>
