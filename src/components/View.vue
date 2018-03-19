<template>
	<div class="view">
		<mu-snackbar class="sys-tips" v-if="snackbar" :message="msg"/>
		<div id="calendar" class="calendar"></div>
	</div>
</template>

<script>
    export default {
        name: 'view',
        data() {
            return {
                msg: '',
                snackbar: false
            };
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
            initCalendar(datas) {
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev, next today',
                        center: 'title',
                        right: 'month,agendaWeek'
                    },
                    height: 'parent',
                    locale: 'zh-cn',
                    editable: false,
                    events: datas || []
                });
                this.hideLoading();
            }
        },
        created() {
            this.showLoading();
            this.addStyleLink('/src/assets/css/fullcalendar.min.css', 'fullCalendar');
        },
        mounted() {
            let _this = this;
            $LAB.script('/src/assets/js/moment.min.js')
                .script('/src/assets/js/fullcalendar.min.js')
                .script('/src/assets/js/zh-cn.js')
                .wait(function() {
                    _this.$ajax.shareList().then((rsp) => {
                        if (rsp.status === 200 && rsp.data.success && rsp.data.data && rsp.data.data.length) {
                            _this.initCalendar(rsp.data.data);
                        } else {
                            _this.showSysTip(rsp.data.msg);
                            _this.initCalendar([]);
                        }
                    });
                });
        }
    };

</script>

<style lang="scss">
    .view {
        padding: 20px 0 0 0;
    }
    
    .calendar {
        height: 100%;
        .fc-toolbar.fc-header-toolbar {
            padding: 0 20px;
        }
    }
    
    .fc-basic-view {
        .fc-day-number {
            color: #24292e;
            padding: 5px 10px!important;
        }
    }
    
    .fc-unthemed {
        td.fc-today {
            background: #f5f5f5!important;
        }
    }
    
    tr:first-child>td>.fc-day-grid-event {
        width: 85%;
    }

</style>
