<template>
	<div class="email">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<mu-breadcrumb style="font-size: 16px;">
			<mu-breadcrumb-item href="#/import">系统设置</mu-breadcrumb-item>
			<mu-breadcrumb-item>邮件通知</mu-breadcrumb-item>
		</mu-breadcrumb>
		<mu-divider style="margin: 12px 0px 22px 0px"/>
		<div class="ht7">
   			<mu-icon class="title-tip" value="mail_outline"/>请设置邮件通知开启/关闭
  		</div>
  		<div class="switchbox" style="margin: 30px 25px;">
  			<mu-switch :label="switchLabel" v-model="toggle" @change="switchChange" class="demo-switch" :disabled="disabled" />
  		</div>
		<div class="ht7" v-if="toggle">
   			<mu-icon class="title-tip" value="access_time"/>请设置每天邮件通知的时间点
  		</div>
  		<div class="switchbox" style="margin: 30px 25px;" v-if="toggle">
  			<mu-time-picker id="picker" hintText="" v-model="sendEmailTime" format="24hr" @change="sendTimeChange"/>
  		</div>
	</div>
</template>

<script>
    export default {
        name: 'email',
        data() {
            return {
                msg: '',
                snackbar: false,
                disabled: false
            };
        },
        computed: {
            toggle() {
                return this.$store.state.systemInfo.sendemail;
            },
            switchLabel() {
                return this.$store.state.systemInfo.sendemail ? '开启' : '关闭'
            },
            sendEmailTime() {
                return this.$store.state.systemInfo.sendemailtime;
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
            switchChange(val) {
                if (this.disabled) return false;
                this.disabled = true;
                this.showLoading();
                this.$ajax.sendEmail({
                    sendemail: val
                }).then((rsp) => {
                    this.hideLoading();
                    this.disabled = false;
                    if (rsp.status === 200 && rsp.data.success) {
                        let data = this.$store.state.systemInfo;
                        data.sendemail = val;
                        this.$store.commit('systemInfo', data);
                        this.showSysTip('更新成功！');
                    }
                });
            },
            sendTimeChange(val, v) {
                if (val > '19:00' || val < '09:00') {
                    let _this = this;
                    this.showSysTip('邮件发送时间段为09:00至19:00！');
                    setTimeout(function() {
                        _this.sendEmailTime = _this.$store.state.systemInfo.sendemailtime;
                        $('#picker .mu-text-field-input').val(_this.$store.state.systemInfo.sendemailtime);
                    }, 150);
                    return false;
                }
                this.showLoading();
                this.$ajax.sendEmailTime({
                    sendEmailTime: val
                }).then((rsp) => {
                    this.hideLoading();
                    if (rsp.status === 200 && rsp.data.success) {
                        let data = this.$store.state.systemInfo;
                        data.sendemailtime = val;
                        this.$store.commit('systemInfo', data);
                        this.showSysTip('更新成功！');
                    }
                });
            }
        }
    };

</script>

<style lang="scss">


</style>
