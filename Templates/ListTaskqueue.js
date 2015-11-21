﻿/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///

var dataModel = {
    multiSelectTagIds: "#blokadi,#taskNameFilter,#servissaglayici,#abonedurumu,#personel,#taskdurumu",
    typeHeadTagIds: "#site",
    flag: ko.observable(),
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    querytime: ko.observable(0),
    errormessage: ko.observable(),
    errorcode: ko.observable(),
    isLoading: ko.observable(),
    selectedTaskname: ko.observable(),
    selectedtaskorderno: ko.observableArray([]),
    selectedTaskRole: ko.observable(),
    sitename: ko.observable(),
    blockname: ko.observable(),
    customername: ko.observable(),
    customerstatus: ko.observable(),
    selectedIss: ko.observable(),
    selectedPersonelname: ko.observable(),
    selectedAttachmentPersonelname: ko.observable(),
    attachmentDate: ko.observable(),
    appointmentDate: ko.observable(),
    consummationDate: ko.observable(),
    selectedTaskstatus: ko.observable(),
    selectedCustomerstatus: ko.observable(),
    description: ko.observable(),
    tasks: ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    isslist: ko.observableArray([]),
    taskstatuslist: ko.observableArray([]),
    personellist: ko.observableArray([]),
    personellist: ko.observableArray([]),
    attacheablePersonelList: ko.observableArray([]),
    taskqueuelist: ko.observableArray([]),
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),
    il: ko.observable(),
    ilce: ko.observable(),
    user: ko.observable(),
   

    getTasks: function() {
        var self = this;
        var data = {
            task: { fieldName: "taskname", op: 6, value: "" },
        };
        crmAPI.getTaskFilter(data, function(a, b, c) {
            self.tasks(a);
            $("#taskNameFilter").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Adını Seçiniz',
                nSelectedText: 'Task Adı Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);

    },
    getCustomerStatus: function() {
        var self = this;
        crmAPI.getCustomerStatus(function(a, b, c) {
            self.ctstatuslist(a);
            $("#abonedurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Abone Durumunu Seçiniz',
                nSelectedText: 'Abone Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getisslist: function() {
        var self = this;
        crmAPI.getIssStatus(function(a, b, c) {
            self.isslist(a);
            $("#servissaglayici").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'ISS Seçiniz',
                nSelectedText: 'ISS Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    gettaskstatus: function() {
        var self = this;
        var data = {
            taskstate: { fieldName: "taskstate", op: 6, value: "" },
        };
        crmAPI.getTaskStatus(data, function(a, b, c) {
            self.taskstatuslist(a);
            $("#taskdurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Durumunu Seçiniz',
                nSelectedText: 'Task Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#taskdurumu').multiselect('select', 'AÇIK');
        }, null, null)
    },
    getpersonel: function() {
        var self = this;
        crmAPI.getPersonel(function(a, b, c) {
            self.personellist(a);
            $("#personel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Personel Seçiniz',
                nSelectedText: 'Personel Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getAttachablePersonelList: function() {
        var self = this;
        var data = {
            taskorderno: parseInt(self.selectedtaskorderno()[0]),
        };
        crmAPI.getAttacheablePersonel(data, function(a, b, c) {
            self.attacheablePersonelList(a);
            $("#personelatamacombo").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Personel Seçiniz',
                nSelectedText: 'Personel Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);

    },
    attacheablecontrol: function() {
        var self = this;
        var data = {
            ids: self.selectedtaskorderno(),
            personelname: self.selectedAttachmentPersonelname(),
        };
        crmAPI.personelattachment(data, function(a, b, c) {
            self.errormessage(a.errorMessage);
            self.errorcode(a.errorCode);
            self.getAttachablePersonelList();
        }, null, null);
    },
    attachmentpersonel: function() {
        var self = this;
        var data = {
            ids: self.selectedtaskorderno(),
            personelname: self.selectedAttachmentPersonelname(),
        };
        crmAPI.personelattachment(data, function(a, b, c) {
            self.errormessage(a.errorMessage);
            self.errorcode(a.errorCode);
            self.flag(true);
            window.setTimeout(function() {
                $('#personelatama').modal('hide');
                self.getFilter(1, dataModel.rowsPerPage());
            }, 1000);
            self.selectedAttachmentPersonelname(null);
        }, null, null);
    },
    clean: function() {
        var self = this;
        self.appointmentDate(null);
        self.il(null);
        self.ilce(null);
        self.attachmentDate(null);
        self.customername(null);
        self.consummationDate(null);
        self.sitename(null);
        self.selectedCustomerstatus(null);
        $("#taskNameFilter,#abonedurumu,#servissaglayici,#taskdurumu,#personel,#personelatamacombo").multiselect('deselectAll', false);
        $("#taskNameFilter,#abonedurumu,#servissaglayici,#taskdurumu,#personel,#personelatamacombo").multiselect('refresh');
        self.selectedPersonelname(null);
        self.selectedIss(null);
        self.selectedTaskname(null);
        self.selectedTaskstatus(null);
    },
    enterfilter: function(d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getFilter(1, self.rowsPerPage());
        }
        return true;
    },
    getFilter: function(pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.isLoading(true);
        self.errormessage(null);
        self.errorcode(null);
        self.flag(null);
        self.selectedAttachmentPersonelname(null);


        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            site: self.sitename() ? { fieldName: "sitename", op: 6, value: self.sitename() } : null,
            il: self.il() ? { fieldName: "ad", op: 6, value: self.il() } : null,
            ilce: self.ilce() ? { fieldName: "ad", op: 6, value: self.ilce() } : null,
            customer: self.customername() ? { fieldName: "customername", op: 6, value: self.customername() } : null,
            task: self.selectedTaskname() ? { fieldName: "taskname", op: 2, value: self.selectedTaskname() } : null,
            personel: self.selectedPersonelname() ? (self.selectedPersonelname() == "Atanmamış" ? { fieldName: "personelname", op: 8, value: null } : { fieldName: "personelname", op: 6, value: self.selectedPersonelname() }) : null,
            taskstate: self.selectedTaskstatus() ? (self.selectedTaskstatus() == 'AÇIK' ? { fieldName: "taskstate", op: 8, value: null } : { fieldName: "taskstate", op: 2, value: self.selectedTaskstatus() }) : { fieldName: "taskstate", op: 8, value: null },
            iss: self.selectedIss() ? { fieldName: "issText", op: 6, value: self.selectedIss() } : null,
            customerstatus: self.selectedCustomerstatus() ? { fieldName: "Text", op: 6, value: self.selectedCustomerstatus() } : null,
            attachmentDate: self.attachmentDate() ? self.attachmentDate() : null,
            appointmentDate: self.appointmentDate() ? self.appointmentDate() : null,
            consummationDate: self.consummationDate() ? self.consummationDate() : null,
        };

        crmAPI.getTaskQueues(data, function(a, b, c) {
            self.taskqueuelist(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.querytime(a.performance.TotalResponseDuration);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.isLoading(false);
            self.errormessage(null);
            self.errorcode(null);
            $('.sel').change(function() {
                var ids = [];
                $('.sel').each(function() {
                    if ($(this).is(':checked')) {
                        var id = $(this).val();
                        ids.push(id);
                        console.log("Seçim: " + id + "");
                    }
                });
                self.selectedtaskorderno(ids);
            });

        }, null, null)

    },
    select: function(d, e) {
        var self = this;
        $("#taskquetable tr").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        console.log("seçilen " + d.taskorderno);
        self.selectedtaskorderno(d.taskorderno);

    },
    redirect: function() {
        window.location.href = "app.html";
    },
    getUserInfo: function() {
        var self = this;
        crmAPI.userInfo(function(a, b, c) {
            self.user(a);
        }, null, null)
    },
    navigate: {
        gotoPage: function(pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
            dataModel.isLoading(false);
        },
        gotoFirstPage: function() {
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage: function() {
            dataModel.navigate.gotoPage(dataModel.pageCount());
        },
        gotoNextPage: function() {
            var pc = dataModel.pageNo() + 1;
            if (pc >= dataModel.pageCount()) return;
            dataModel.navigate.gotoPage(pc);
        },
        gotoBackPage: function() {
            var pc = dataModel.pageNo() - 1;
            if (pc <= 0) return;
            dataModel.navigate.gotoPage(pc);
        },
    },
  


    renderBindings: function() {
        var self = this;
        $("#blokadi").multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            nonSelectedText: 'Blok Seçiniz',
            nSelectedText: 'Blok Seçildi!',
            numberDisplayed: 2,
            selectAllText: 'Tümünü Seç!',
            enableFiltering: true,
            filterPlaceholder: 'Ara'

        });
        $(function() {
            $('#datetimepicker1,#datetimepicker2,#datetimepicker3').datetimepicker();
        });
        $('#daterangepicker1,#daterangepicker2,#daterangepicker3').daterangepicker({
            "timePicker": true,
            ranges: {
                'Bugün': [moment(), moment().add(1, 'days')],
                'Dün': [moment().subtract(1, 'days'), moment()],
                'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
                'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
                'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
                'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });
        $('#randevutarihi').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
        });

        self.getUserInfo();
        self.getisslist();
        self.gettaskstatus();
        self.getTasks();
        self.getpersonel();
        self.getCustomerStatus();
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());

        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    },

}

dataModel.flag.subscribe(function(v) {
    if (v == null)
        return true;
    else {
        $("#personelatamacombo").multiselect('deselect', dataModel.selectedAttachmentPersonelname());
        dataModel.selectedAttachmentPersonelname(null);
    }
});