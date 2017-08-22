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
            initCalendar() {
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev, next today',
                        center: 'title',
                        right: 'month,agendaWeek'
                    },
                    height: 'parent',
                    locale: 'zh-cn',
                    editable: false,
                    events: [{
                            title: '吴超',
                            start: '2017-08-02',
                            color: '#f00'
                        },
                        {
                            title: '吴超',
                            start: '2017-08-03',
                            color: '#a19fa5'
                        },
                        {
                            title: '吴超',
                            start: '2017-08-04',
                            color: '#a19fa5'
                        },
                        {
                            title: '吴超',
                            start: '2017-08-05',
                            color: '#a19fa5'
                        },
                        {
                            title: '吴超',
                            start: '2017-08-06',
                            color: '#a19fa5'
                        }
                    ]
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
                    _this.initCalendar();
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
