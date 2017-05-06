var dataModel = {
    returntaskorderno: ko.observable(),
    tckimlikno: ko.observable(""),
    customername: ko.observable(""),
    gsm: ko.observable(""),
    phone: ko.observable(),
    email: ko.observable(),
    fulladdress: ko.observable(""),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    bucakList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
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
    fault: ko.observable("Akıllı Nokta"),
    taskid: ko.observable(1219), // Akıllı Nokta Satış Bilgilendirme
    user: ko.observable(),
    mail: ko.observable(),
    taskdescription: ko.observable(),
    loadingmessage: ko.observable(0),
    errorControl: ko.pureComputed(function () {
        return (dataModel.mahalleList() && dataModel.mahalleList() == "-1") || (dataModel.bucakList() && dataModel.bucakList() == "-1");
    }),

    isAutorized: ko.observable(),
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
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

    insertAdslSalesTask: function () {
        var self = this;
        self.returntaskorderno(null);
        $('.btn-success').prop('disabled', true);

        var data = {
            tc: self.tckimlikno(),
            customername: self.customername(),
            gsm: self.gsm(),
            phone: self.phone(),
            ilKimlikNo: self.selectedIl(),
            ilceKimlikNo: self.selectedIlce(),
            bucakKimlikNo: self.selectedBucak(),
            mahalleKimlikNo: self.selectedMahalle(),
            email: self.email(),
            yolKimlikNo: 61,
            binaKimlikNo: 61,
            daire: 61,
            taskdescription: self.taskdescription(),
            description: self.fulladdress(),
            taskid: self.taskid(),
            salespersonel: self.user().userId,
            fault: self.fault(),
        };
        if (data.tc != null && data.gsm != null && self.selectedIl() && self.selectedIlce())
            crmAPI.saveAdslSalesTask(data, function (a, b, c) {
                self.returntaskorderno(a);
                self.redirect();
            }, null, null);
        else {
            $('.btn-success').prop('disabled', false);
            alert("Eksik Bilgi Girdiniz.!");
        }
    },
    redirect: function () {
        var self = this;
        if (self.returntaskorderno() == "Girilen TC Numarası Başkasına Aittir") {
            $('.btn-success').prop('disabled', false);
            alert(self.returntaskorderno());
        }
        else {
            window.location.href = "app.html#TaskQueueEditForm?" + self.returntaskorderno();
        }

    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        $("#optionIl,#optionIlce,#optionBucak,#optionMahalle").multiselect({
            includeSelectAllOption: false,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            nonSelectedText: ' Yükleniyor',
            nSelectedText: ' Seçildi!',
            numberDisplayed: 2,
            selectAllText: 'Tümünü Seç!',
            enableFiltering: true,
            filterPlaceholder: 'Ara'
        });
        $('#daterangepicker4').daterangepicker({
            "singleDatePicker": true,
            "autoApply": false,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
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
    dataModel.tckimlikno($("#tc").val());
});
dataModel.selectedIlce.subscribe(function (v) {
    if (v != null) {
        dataModel.bucakList(null);
        dataModel.mahalleList(null);
        dataModel.selectedBucak(null);
        dataModel.selectedMahalle(null);
        dataModel.getBucak(v);
    }
    dataModel.tckimlikno($("#tc").val());
    return true;
});
dataModel.selectedBucak.subscribe(function (v) {
    if (v != null)
        dataModel.getMahalle(v);
    return true;
});