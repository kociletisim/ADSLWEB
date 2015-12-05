﻿
var dataModel = {

    returntaskorderno: ko.observable(),
    tckimlikno: ko.observable(),
    customername: ko.observable(),
    gsm: ko.observable(),
    phone: ko.observable(),
    fulladdress: ko.observable(),
    taskdescription: ko.observable(),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    bucakList:ko.observableArray([]),
    caddeList: ko.observableArray([]),
    binaList: ko.observableArray([]),
    daireList: ko.observableArray([]),
    selectedIl: ko.observable(),
    selectedIlce: ko.observable(),
    selectedBucak: ko.observable(),
    selectedMahalle: ko.observable(),
    selectedCadde: ko.observable(),
    selectedBina: ko.observable(),
    selectedDaire: ko.observable(),
    yalin: ko.observable(),
    yalinadsl: ko.observable(),
    ntyalinadsl: ko.observable(),
    churn: ko.observable(),
    churnyalin: ko.observable(),
    churnsesli: ko.observable(),
    taskid: ko.observable(),
    user: ko.observable(),
    personellist: ko.observableArray([]),
    salespersonel: ko.observable(),
    loadingmessage: ko.observable(0),
    errorControl: ko.pureComputed(function () {
        return (dataModel.mahalleList() && dataModel.mahalleList() == "-1") || (dataModel.bucakList() && dataModel.bucakList() == "-1");
    }),

    isYalin: function () {
        var self = this;
        self.yalin(true);
        self.churn(false);
    },
    isChurn: function () {
        var self = this;
        self.churn(true);
        self.yalin(false);
    },
    isAutorized: ko.observable(),
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.isAutorized((a.userRole & 67108896) == 67108896);
        }, null, null)
    },
    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#salesPersonel").multiselect({
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
    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value: "" },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);
            $("#optionIl").multiselect("setOptions", self.ilList()).multiselect("rebuild");
        }, null, null)
    },
    getIlce: function (ilKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op: 2, value: ilKimlikNo },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilceList(a);
            $("#optionIlce").multiselect("setOptions", self.ilceList()).multiselect("rebuild");
        }, null, null)
    },
    getBucak: function (ilceKimlikNo) {
        var self = this;
        self.loadingmessage(1);
        var data = {
            adres: { fieldName: "ilceKimlikNo", op: 2, value: ilceKimlikNo },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.bucakList(a);
            self.loadingmessage(0);
            $("#optionBucak").multiselect("setOptions", self.bucakList()).multiselect("rebuild");
        }, null, null)
    },
    getMahalle: function (bucakKimlikNo) {
        var self = this;
        self.loadingmessage(1);
        var data = {
            adres: { fieldName: "bucakKimlikNo", op: 2, value: bucakKimlikNo },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.mahalleList(a);
            self.loadingmessage(0);
            $("#optionMahalle").multiselect("setOptions", self.mahalleList()).multiselect("rebuild");

        }, null, null)
    },
    //getMahalle: function (ilceKimlikNo) {
    //    var self = this;
    //    var data = {
    //        adres: { fieldName: "ilceKimlikNo", op: 2, value: ilceKimlikNo },
    //    };
    //    crmAPI.getAdress(data, function (a, b, c) {
    //        self.mahalleList(a);
    //    }, null, null)
    //},
    //getCadde: function (mahalleKoyBaglisiKimlikNo) {
    //    var self = this;
    //    var data = {
    //        adres: { fieldName: "mahalleKoyBaglisiKimlikNo", op: 2, value: mahalleKoyBaglisiKimlikNo },
    //    };
    //    crmAPI.getAdress(data, function (a, b, c) {
    //        self.caddeList(a);
    //    }, null, null);
    //},
    //getBina: function (mahalleKoyBaglisiKimlikNo,yolKimlikNo) {
    //    var self = this;
    //    var data = {
    //        adres: { fieldName: "mahalleKoyBaglisiKimlikNo", op: 2, value: mahalleKoyBaglisiKimlikNo },
    //        subAdres: { fieldName: "yolKimlikNo", op: 2, value: yolKimlikNo },
    //    };
    //    crmAPI.getAdress(data, function (a, b, c) {
    //        self.binaList(a);
    //    }, null, null);
    //},
    //getDaire: function (mahalleKoyBaglisiKimlikNo, binaKimlikNo) {
    //    var self = this;
    //    var data = {
    //        adres: { fieldName: "mahalleKoyBaglisiKimlikNo", op: 2, value: mahalleKoyBaglisiKimlikNo },
    //        subAdres: { fieldName: "yolKimlikNo", op: 2, value: binaKimlikNo },
    //    };
    //    crmAPI.getAdress(data, function (a, b, c) {
    //        self.daireList(a);
    //    }, null, null);
    //},
    insertAdslSalesTask: function () {
        var self = this;
        if (self.yalin()) self.taskid(32);
        else if (self.churn()) self.taskid(33);
        var data = {
            tc: self.tckimlikno(),
            customername: self.customername(),
            gsm: self.gsm(),
            phone: self.phone(),
            ilKimlikNo: self.selectedIl(),
            ilceKimlikNo: self.selectedIlce(),
            bucakKimlikNo: self.selectedBucak(),
            mahalleKimlikNo: self.selectedMahalle(),
            yolKimlikNo: 61,
            binaKimlikNo: 61,
            daire: 61,
            description:self.fulladdress(),
            taskdescription: self.taskdescription(),
            taskid: self.taskid(),
            salespersonel:self.salespersonel(),
        };
        if (data.tc != null && data.gsm != null && (self.yalin() || self.churn()))
            crmAPI.saveAdslSalesTask(data, function (a, b, c) { self.returntaskorderno(a) }, null, null);
        else alert("Eksik Bilgi Girdiniz.!");
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        $("#optionIl,#optionIlce,#optionBucak,#optionMahalle").multiselect({
            includeSelectAllOption: false,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            nonSelectedText: 'İlçe Seçiniz',
            nSelectedText: 'İlçe Seçildi!',
            numberDisplayed: 2,
            selectAllText: 'Tümünü Seç!',
            enableFiltering: true,
            filterPlaceholder: 'Ara'
        });
        $('#tc').maxlength({
            threshold: 10,
            warningClass: "label label-danger",
            limitReachedClass: "label label-success",
            separator: ' / ',
            validate: true,
            customMaxAttribute: "11"
        });
        self.getIl();
        ko.applyBindings(dataModel, $("#bindingmodal")[0]);

    }
}
//dataModel.selectedIl.subscribe(function (v) {
//    dataModel.getIlce(v);
//});
//dataModel.selectedIlce.subscribe(function (v) {
//    dataModel.getMahalle(v);
//});
//dataModel.selectedMahalle.subscribe(function (v) {
//    dataModel.getCadde(v);
//});
//dataModel.selectedCadde.subscribe(function (v) {
//    dataModel.getBina(selectedMahalle,v);
//});
//dataModel.selectedBina.subscribe(function (v) {
//    dataModel.getBina(selectedMahalle, v);
//});
dataModel.returntaskorderno.subscribe(function (v) {
    if (v == "Girilen TC Numarası Başkasına Aittir") {
        alert(v);
    }
    else {
            window.location.href = "app.html#TaskQueueEditForm?" + v;
    }
});
dataModel.isAutorized.subscribe(function (v) {
    if (v == true) dataModel.getpersonel();
    else return true;
});
dataModel.selectedIl.subscribe(function (v) {
    dataModel.ilceList(null);
    dataModel.bucakList(null);
    dataModel.mahalleList(null);
    dataModel.selectedIlce(null);
    dataModel.selectedBucak(null);
    dataModel.selectedMahalle(null);
    dataModel.getIlce(v);
});
dataModel.selectedIlce.subscribe(function (v) {
    if (v != null) {
        dataModel.bucakList(null);
        dataModel.mahalleList(null);
        dataModel.selectedBucak(null);
        dataModel.selectedMahalle(null);
        dataModel.getBucak(v);
    }

    return true;
});
dataModel.selectedBucak.subscribe(function (v) {
    if (v != null)
        dataModel.getMahalle(v);
    return true;
});