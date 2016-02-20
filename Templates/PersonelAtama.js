/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />

var tqlFilter = crmAPI.getCookie("tqlFilter");

var dataModel = {
    pageCount: ko.observable(),
    pageNo: ko.observable(tqlFilter.pageNo || 1),
    rowsPerPage: ko.observable(tqlFilter.rowsPerPage || 20),
    errormessage: ko.observable(),
    errorcode: ko.observable(),
    selectedTaskname: ko.observableArray([]),
    selectedid: ko.observableArray([]),
    customername: ko.observable(tqlFilter.customer && tqlFilter.customer.value),
    selectedPersonelname: ko.observable(),
    selectedAttachmentPersonelid: ko.observable(),
    description: ko.observable(),
    tasks: ko.observableArray([]),
    taskTypeList: ko.observableArray([]),
    personellist: ko.observableArray([]),
    appointlist: ko.observableArray([]), // atanan task list
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),
    selectedAtama: ko.observable(),
    user: ko.observable(),

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
            $("#taskNameFilter,#closedtask,#formedtask").multiselect({
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
    getTaskType: function () {
        var self = this;
        crmAPI.getTaskType(function (a, b, c) {
            self.taskTypeList(a);
            $("#closedtasktype,#formedtasktype").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Türünü Seçiniz',
                nSelectedText: 'Task Adı Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#personel,#appointedpersonel,#offpersonel").multiselect({
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
    getPersonels: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            personel: self.personelname() ? { fieldName: 'personelname', op: 6, value: self.personelname() } : { fieldName: 'personelname', op: 6, value: '' },
            il: self.selectil() ? { fieldName: 'ilKimlikNo', op: 2, value: self.selectil() } : null,
            ilce: self.selectilce() ? { fieldName: 'ilceKimlikNo', op: 2, value: self.selectilce() } : null,
        };
        crmAPI.getPersonels(data, function (a, b, c) {
            self.personelList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getPersonelCard($(this).val());
            });
        }, null, null);
    },
    clean: function () {
        var self = this;
        $("#taskNameFilter,#personel").multiselect('deselectAll', false);
        $("#taskNameFilter,#personel").multiselect('refresh');
        self.selectedPersonelname(null);
        self.selectedTaskname('');
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getFilter(1, self.rowsPerPage());
        }
        return true;
    },
    getFilter: function (pageno, rowsperpage) {
        var self = this;
        self.errormessage(null);
        self.errorcode(null);
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.selectedTaskname($("#taskNameFilter").val() ? $("#taskNameFilter").val() : '');
        self.selectedPersonelname($("#personel").val() ? $("#personel").val() : '');
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            task: self.selectedTaskname().length > 0 ? { fieldName: "taskid", op: 7, value: self.selectedTaskname() } : null,
            personel: self.selectedPersonelname().length > 0 ? (self.selectedPersonelname() == "0" ? { fieldName: "personelname", op: 8, value: null } : { fieldName: "personelid", op: 7, value: self.selectedPersonelname() }) : null,
        };
        crmAPI.setCookie("tqlFilter", data);
        crmAPI.getTaskQueues(data, function (a, b, c) {
            self.appointlist(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.errormessage(null);
            self.errorcode(null);
            $('.sel').change(function () {
                var ids = [];
                $('.sel').each(function () {
                    if ($(this).is(':checked')) {
                        var id = $(this).val();
                        ids.push(id);
                        console.log("Seçim: " + id + "");
                    }
                });
                self.selectedid(ids);
            });
        }, null, null);

    },
    select: function (d, e) {    //seçilen atama idsi alınarak işlem yapılacak
        var self = this;
        $("#aptable tr").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        console.log("seçilen " + d.id);
        self.selectedid(d.id);
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
            if (pageNo === dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
            dataModel.isLoading(false);
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
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        self.getTasks();
        self.getpersonel();
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    },
}

$('#newap').on('shown.bs.modal', function (e) {
    dataModel.getTaskType();
})
$('#editap').on('shown.bs.modal', function (e) {
    dataModel.getTaskType();
})