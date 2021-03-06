﻿
/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />

var dataModel = {
    tasklist: ko.observableArray([]),
    taskCombo: ko.observableArray([]),
    selectedTask:ko.observable(),
    taskname:ko.observable(),
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    selectedTaskid: ko.observableArray([]),
    selectedTypeId: ko.observable(),
    typeControl: ko.observable(),
    objectTypeList: ko.observableArray([]),
    selectedObjectType: ko.observable(),
    personelTypeList:ko.observableArray([]),
    selectedPersonelType: ko.observable(),
    taskTypeList: ko.observableArray([]),
    savemessage: ko.observable(),
    saveerrorcode:ko.observable(),
    newtaskname: ko.observable(),
    newtaskscore: ko.observable(),
    newpersoneltype: ko.observable(),
    newobjecttype: ko.observable(),
    newtasktype: ko.observable(),
    newtaskdesc: ko.observable(),
    taskTypeList: ko.observableArray([]),

    user: ko.observable(),
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            if (!self.user() || self.user().userRole != 2147483647)
                window.location.href = "app.html";
        }, null, null)
    },
    //combo için
    getTaskList: function () {
        var self = this;
        var data = {
            task: { fieldName: "taskname", op: 6, value: "" },
        };
        crmAPI.getTaskDefination(data, function (a, b, c) {
            self.taskCombo(a);
            $('#taskadi').multiselect({
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
            $('#taskadi').multiselect('select', self.taskCombo()).multiselect('rebuild');
        }, null, null);

    },
    //sayfadaki tablo için
    getTask: function (pageno,rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.typeControl(null)
        if (self.selectedTypeId() == 0) self.typeControl(99);
        self.selectedTaskid($("#taskadi").val() ? $("#taskadi").val() : '');
        var data = {
            pageNo:pageno,
            rowsPerPage:rowsperpage,
            task: self.selectedTaskid().length>0 ? { fieldName: 'taskid', op: 7, value: self.selectedTaskid() } : { fieldName: 'taskname', op: 6, value: '' },
            taskType: self.selectedTypeId() ? { fieldName: 'TaskTypeId', op: 2, value: self.selectedTypeId() } : (self.typeControl() == 99 ? { fieldName: 'TaskTypeId', op: 2, value: 0 } : null),
        };
        crmAPI.getTaskDefination(data, function (a, b, c) {
            self.tasklist(a);
            self.savemessage(null);
            self.saveerrorcode(null);
            $(".edit").click(function () {
                self.getTaskCard($(this).val());
            });
            $("#new").click(function () {
                self.getObjectType();
                self.getPersonelType();
            });
            $('#taskturu').multiselect('rebuild');
        }, null, null);
    },
    getObjectType: function () {
        var self = this;
        var data = {
            objecttype: { fieldName: 'typname', op: 6, value: '' },
        };
        crmAPI.getTaskFilter(data,function (a, b, c) {
            self.objectTypeList(a);
            $("#ilgi,#newilgi").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'

            });
        }, null, null)
    },
    getPersonelType: function () {
        var self = this;
        crmAPI.getObjectType( function (a, b, c) {
            self.personelTypeList(a);
            $("#gorevli,#newgorevli").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
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
            $("#newtaskturu,#edittaskturu,#taskturu").multiselect({
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
            $('#newtaskturu,#edittaskturu,#taskturu').multiselect('select', self.taskTypeList()).multiselect('rebuild');
        }, null, null)
    },
    getTaskCard: function (taskid) {
        var self = this;
        var data = {
            task: {fieldname:'taskid',op:2,value:taskid}
        };
        crmAPI.getTaskDefination(data, function (a, b, c) {
            self.getObjectType();
            self.getPersonelType();
            self.selectedTask(a[0]);
        }, null, null);
    },
    getGTypes: ko.pureComputed(function () {
        var roles = [];
        for (var i = 0; i < dataModel.personelTypeList().length; i++) {
            if ((dataModel.selectedTask().attachablepersoneltype & dataModel.personelTypeList()[i].typeid) == dataModel.personelTypeList()[i].typeid)
                roles.push(dataModel.personelTypeList()[i].typeid);
        }
        return roles;
    }),
    getITypes: ko.pureComputed(function () {
        var roles = [];
        for (var i = 0; i < dataModel.personelTypeList().length; i++) {
            if ((dataModel.selectedTask().attachablepersoneltype & dataModel.personelTypeList()[i].typeid) == dataModel.personelTypeList()[i].typeid)
                roles.push(dataModel.personelTypeList()[i].typeid);
        }
        return roles;
    }),
    saveTask: function () {
        var self = this;
        if ($("#gorevli").val() && $("#gorevli").val().length > 1) {
            self.selectedTask().personeltypes = { typeid: parseInt($("#gorevli").val()[0] | $("#gorevli").val()[1]) };
        }
        else
            self.selectedTask().personeltypes = { typeid: parseInt($("#gorevli").val()[0]) };
        if ($("#ilgi").val() && $("#ilgi").val().length > 1) {
            self.selectedTask().objecttypes = { typeid: parseInt($("#ilgi").val()[0] | $("#ilgi").val()[1]) };
        }
        else
            self.selectedTask().objecttypes = { typeid: parseInt($("#ilgi").val()[0]) };
        self.selectedTask().tasktypes = { TaskTypeId: parseInt($('#edittaskturu').val()) };
        var data = self.selectedTask();
        crmAPI.saveTask(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.saveerrorcode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getTask(1, dataModel.rowsPerPage());
            }, 1000);
        },null,null);
    },
    insertTask: function () {
        var self = this;
        if ($("#newgorevli").val() && $("#newgorevli").val().length > 1) 
            self.newpersoneltype(parseInt($("#newgorevli").val()[0] | $("#newgorevli").val()[1]));
        else
            self.newpersoneltype(parseInt($("#newgorevli").val()[0]));
        if ($("#newilgi").val() && $("#newilgi").val().length > 1) 
            self.newobjecttype(parseInt(("#newilgi").val()[0] | $("#newilgi").val()[1]));
        else
            self.newobjecttype(parseInt($("#newilgi").val()[0]));
        var data = {
            taskname: self.newtaskname(),
            description: self.newtaskdesc(),
            tasktypes: { TaskTypeId: $("#newtaskturu").val() },
            objecttypes: { typeid: self.newobjecttype() },
            personeltypes: { typeid: self.newpersoneltype() },
            performancescore:self.newtaskscore(),
        };
        crmAPI.insertTask(data, function (a, b, c) {
            self.saveerrorcode(a.errorCode);
            self.savemessage(a.errorMessage);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getTask(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getTask(pageNo, dataModel.rowsPerPage());
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
    clean: function () {
        var self = this;
        self.selectedTaskid(null);
        self.taskCombo(null);
        self.selectedTypeId(null);
        self.getTaskList();
        self.getTaskType();
        self.getTask(self.pageNo(), self.rowsPerPage());
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        self.getTask(dataModel.pageNo(), dataModel.rowsPerPage());
        self.getTaskList();
        self.getTaskType();
        self.getObjectType();
        self.getPersonelType();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    },
}

$('#myModal').on('shown.bs.modal', function () {
    dataModel.getTaskType();
})