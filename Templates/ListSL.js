/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />

var dataModel = {
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    errormessage: ko.observable(),
    errorcode: ko.observable(),
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),
    user: ko.observable(),

    sllist: ko.observableArray([]), // task sl list
    selectedSL: ko.observable(),
    tasks: ko.observableArray([]),
    newSLName: ko.observable(),
    newKocMaxTime: ko.observable(),
    newBayiMaxTime: ko.observable(),

    selectedKocSTasks: ko.observableArray([]),
    selectedKocETasks: ko.observableArray([]),
    selectedBayiSTasks: ko.observableArray([]),
    selectedBayiETasks: ko.observableArray([]),
    kaydetButonEnable: ko.pureComputed(function () {
        return true
    }),

    queryButtonClick: function () {
        var self = this;
        self.getFilter(1, dataModel.rowsPerPage());
    },
    getTasks: function () {
        var self = this;
        var data = {
            task: { fieldName: "taskname", op: 6, value: "" },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.tasks(a);
            $("#newKocSTask,#editKocSTask,#newKocETask,#editKocETask,#newBayiSTask,#editBayiSTask,#newBayiETask,#editBayiETask").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Task Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    getFilter: function (pageno, rowsperpage) {
        var self = this;
        self.errormessage(null);
        self.errorcode(null);
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
        };
        crmAPI.getSL(data, function (a, b, c) {
            self.sllist(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.errormessage(null);
            self.errorcode(null);
            $(".edit").click(function () {
                self.getEditSL($(this).val());
            });
        }, null, null);
    },
    getEditSL: function (SLID) {
        var self = this;
        var data = {
            SLID: { fieldName: 'SLID', op: 2, value: SLID },
        };
        crmAPI.getSL(data, function (a, b, c) {
            self.selectedSL(a.data.rows[0]);
            $("#editKocSTask,#editKocETask,#editBayiSTask,#editBayiETask").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Task Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#editKocSTask').multiselect('select', self.selectedKocSTasks()).multiselect('rebuild');
            $('#editKocETask').multiselect('select', self.selectedKocETasks()).multiselect('rebuild');
            $('#editBayiSTask').multiselect('select', self.selectedBayiSTasks()).multiselect('rebuild');
            $('#editBayiETask').multiselect('select', self.selectedBayiETasks()).multiselect('rebuild');
        }, null, null);
    },
    redirect: function () {
        window.location.href = "app.html";
    },
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
        }, null, null)
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
        },
        gotoFirstPage: function () {
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage: function () {
            dataModel.navigate.gotoPage(dataModel.pageCount());
        },
        gotoNextPage: function () {
            var pc = dataModel.pageNo() + 1;
            if (pc >= dataModel.pageCount()) return;
            dataModel.navigate.gotoPage(pc);
        },
        gotoBackPage: function () {
            var pc = dataModel.pageNo() - 1;
            if (pc <= 0) return;
            dataModel.navigate.gotoPage(pc);
        },
    },
    cleannewsl: function () {
        var self = this;
        self.newKocMaxTime(null),
        self.newBayiMaxTime(null)
        self.newSLName(null)
        //$('#offpersonel,#closedtasktype,#closedtask,#appointedpersonel,#formedtask,#formedtasktype').multiselect('rebuild');
        window.setTimeout(function () {
            $('#newap').modal('hide');
        }, 2000);
    },
    insertSL: function () {
        var self = this;
        var data = {
            SLName: self.newSLName(),
            KocMaxTime: self.newKocMaxTime(),
            KocSTask: $("#newKocSTask").val() ? $("#newKocSTask").val().toString() : null,
            KocETask: $("#newKocETask").val() ? $("#newKocETask").val().toString() : null,
            BayiSTask: $("#newBayiSTask").val() ? $("#newBayiSTask").val().toString() : null,
            BayiETask: $("#newBayiETask").val() ? $("#newBayiETask").val().toString() : null,
            BayiMaxTime: self.newBayiMaxTime(),
        };
        crmAPI.insertSL(data, function (a, b, c) {
            self.errormessage(a[Object.keys(a)[1]]);
            self.errorcode(a[Object.keys(a)[0]]);
            if (self.errorcode() == 1) {
                $('label[id=info]').css({ 'color': '#006400' });
                window.setTimeout(function () {
                    $('#newap').modal('hide');
                    self.getFilter(1, dataModel.rowsPerPage());
                }, 2000);
                self.cleannewsl();
            }
            else if (self.errorcode() == 2) {
                $('label[id=info]').css({ 'color': '#B22222' });
            }
        }, null, null);
    },
    saveSL: function () {
        var self = this;
        self.selectedSL().KocSTask = $("#editKocSTask").val() ? $("#editKocSTask").val().toString() : null;
        self.selectedSL().KocETask = $("#editKocETask").val() ? $("#editKocETask").val().toString() : null;
        self.selectedSL().BayiSTask = $("#editBayiSTask").val() ? $("#editBayiSTask").val().toString() : null;
        self.selectedSL().BayiETask = $("#editBayiETask").val() ? $("#editBayiETask").val().toString() : null;
        var data = self.selectedSL();
        crmAPI.updateSL(data, function (a, b, c) {
            self.errormessage(a[Object.keys(a)[1]]);
            self.errorcode(a[Object.keys(a)[0]]);
            if (self.errorcode() == 1) {
                $('label[id=editinfo]').css({ 'color': '#006400' });
                window.setTimeout(function () {
                    $('#editap').modal('hide');
                    self.errormessage(null),
                    self.errorcode(null),
                    self.getFilter(1, dataModel.rowsPerPage());
                }, 2000);
            }
            else if (self.errorcode() == 2) {
                $('label[id=editinfo]').css({ 'color': '#B22222' });
            }
        }, null, null);
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        self.getTasks();
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    },
}

dataModel.selectedSL.subscribe(function (v) {
    if (v.KocSTask != null)
        dataModel.selectedKocSTasks(v.KocSTask.split(","));
    else
        dataModel.selectedKocSTasks(null);
    if (v.KocETask != null)
        dataModel.selectedKocETasks(v.KocETask.split(","));
    else
        dataModel.selectedKocETasks(null);
    if (v.BayiSTask != null)
        dataModel.selectedBayiSTasks(v.BayiSTask.split(","));
    else
        dataModel.selectedBayiSTasks(null);
    if (v.BayiETask != null)
        dataModel.selectedBayiETasks(v.BayiETask.split(","));
    else
        dataModel.selectedBayiETasks(null);
});