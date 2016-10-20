
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    personelList: ko.observableArray([]),
    responseIlces: ko.observableArray([]),
    personelname: ko.observable(),
    objectList:ko.observableArray([]),
    selectedPersonel: ko.observable(),
    rolesList:ko.observableArray([]),
    ilList: ko.observableArray([]),
    ilceList:ko.observableArray([]),
    ilceResList: ko.observableArray([]),
    selectedIl: ko.observable(),
    selectedIlce:ko.observable(),
    selectil: ko.observable(),
    selectilce:ko.observable(),

    newpersonelname: ko.observable(),
    newcategory: ko.observable(),
    newpassword: ko.observable(),
    newmobile: ko.observable(),
    newemail: ko.observable(),
    newnotes: ko.observable(),
    newkurulumbayi: ko.observable(),
    yoneticiList: ko.observableArray([]),
    yoneticiId: ko.observable(),
    user: ko.observable(),

    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            if (!self.user() || self.user().userRole != 2147483647)
                window.location.href = "app.html";
        }, null, null)
    },
    getyonetici: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.yoneticiList(a);
            $("#yonetici,#kurulumbayi").multiselect({
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
    getPersonelCard: function (personelid) {
        var self = this;
        var data = {
            personel: { fieldName: 'personelid', op: 2, value: personelid },
        };
        crmAPI.getPersonels(data, function (a, b, c) {
            self.getObjects();
            self.selectedPersonel(a.data.rows[0]);
            self.getIl();
            self.getIlce(a.data.rows[0].ilKimlikNo);
            $("#yonetici2,#kurulumbayi2").multiselect({
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
            $("#editilceres").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#editilceres").multiselect("select", self.responseIlces()).multiselect('rebuild')
        }, null, null);
    },
    getObjects: function () {
        var self = this;
        crmAPI.getObjectType(function (a,b,c) {
            self.objectList(a);
            $("#object").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#newcategory").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    savePersonel: function () {
        var self = this;
        var rol = 0;
        if ($("#object").val()) {
            for (var i = 0; i < $("#object").val().length; i++) {
                rol |= $("#object").val()[i];
            }
        }
        self.selectedPersonel().category = rol;
        self.selectedPersonel().roles = rol;
        self.selectedPersonel().responseregions = $("#editilceres").val() ? $("#editilceres").val().toString() : null;
                
        var data = self.selectedPersonel();
        crmAPI.savePersonel(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getPersonels(dataModel.pageNo(), dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertPersonel: function () {
        var self = this;
        var rol = 0;
            for (var i = 0; i < $("#newcategory").val().length; i++) {
                rol = rol | $("#newcategory").val()[i];
            }
            self.newcategory(rol);
        var data = {
            personelname: self.newpersonelname(),
            category: self.newcategory(),
            relatedpersonelid: self.yoneticiId(),
            kurulumpersonelid: self.newkurulumbayi(),
            password: self.newpassword(),
            mobile: self.newmobile(),
            email: self.newemail(),
            notes: self.newnotes(),
            ilKimlikNo: self.selectedIl(),
            ilceKimlikNo:self.selectedIlce(),
        };
        crmAPI.insertPersonel(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getPersonels(dataModel.pageNo(), dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    getRoles: ko.pureComputed(function(){
        var roles = [];
        for (var i = 0; i < dataModel.objectList().length; i++) {
            if ((dataModel.selectedPersonel().category & dataModel.objectList()[i].typeid) == dataModel.objectList()[i].typeid)
                roles.push(dataModel.objectList()[i].typeid);
        }
        return roles;
    }),
    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value: "" },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);
            $("#editil,#newil,#sorguil").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#editil,#newil").multiselect("setOptions", self.ilList()).multiselect("rebuild");
        }, null, null)
    },
    getIlce: function (x) {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op: x?2:6, value: x?x:''},
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilceList(a);
            $("#editilce,#newilce,#sorguilce").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#editilce,#newilce").multiselect("setOptions", self.ilceList()).multiselect("rebuild");
        }, null, null)
    },
    getResIlce: function () {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op: 6, value: '' },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilceResList(a);
            //$("#editilceres").multiselect("setOptions", self.ilceResList()).multiselect("rebuild");
        }, null, null)
    },

    clean: function () {
        var self = this;
        self.personelname(null);
        self.selectil(null);
        self.selectilce(null);
        self.getPersonels(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getPersonels(dataModel.pageNo(), dataModel.rowsPerPage());
        }
        return true;
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getPersonels(pageNo, dataModel.rowsPerPage());
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
        self.getPersonels(dataModel.pageNo(), dataModel.rowsPerPage());
        $('#new').click(function () {
            self.getObjects();
            self.getIl();
            self.getIlce();
            $("#newilceres").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        });
        self.getIl();
        self.getIlce();
        self.getResIlce();
        self.getyonetici();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}
dataModel.selectedPersonel.subscribe(function (v) {
    dataModel.responseIlces([]);
    if (v != null && v.responseregions != null)
        dataModel.responseIlces(v.responseregions.split(","));
    else
        dataModel.responseIlces(null);
});
dataModel.ilceResList.subscribe(function (v) {
    if (v != null && v.length > 0) {
        for (var i = 0; i < v.length; i++) {
            if (v[i].ilKimlikNo < 82) {
                var ad = v[i].ad;
                v[i].ad = dataModel.ilList()[(v[i].ilKimlikNo) - 1].ad + "/" + ad;
            }
            else {
                for (var j = 81; j < dataModel.ilList().length; j++) {
                    if (dataModel.ilList()[j].kimlikNo == v[i].ilKimlikNo) {
                        var ad = v[i].ad;
                        v[i].ad = dataModel.ilList()[j].ad + "/" + ad;
                    }
                }
            }
        }
    }
});