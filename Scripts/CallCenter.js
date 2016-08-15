﻿/// <reference path="crmwebapi.js" />

$(document).ready(function () {
    dataModel.renderBindings();
});

var dataModel = {
    returntaskorderno: ko.observable(),
    tckimlikno: ko.observable(""),
    superonlineCustNo: ko.observable(),
    customername: ko.observable(""),
    gsm: ko.observable(""),
    phone: ko.observable(),
    email: ko.observable(),
    fulladdress: ko.observable(""),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    bucakList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    selectedIl: ko.observable(),
    selectedIlce: ko.observable(),
    selectedBucak: ko.observable(),
    selectedMahalle: ko.observable(),
    kampanyaTuruList: ko.observableArray(["YALIN", "CHURN"]),
    fault: ko.observable("Bayi"),

    adsl: ko.observable(),
    vdsl: ko.observable(),

    yalin: ko.observable(),
    churn: ko.observable(),

    yalinadsl: ko.observable(),
    churnyalin: ko.observable(),
    taskid: ko.observable(),
    user: ko.observable(),
    taskdescription: ko.observable(),
    personellist: ko.observableArray([]),
    salespersonel: ko.observable(),
    loadingmessage: ko.observable(0),
    subcategorylist: ko.observableArray([]),
    categorylist: ko.observableArray([]),
    campaignlist: ko.observableArray([]),
    category: ko.observable(),
    subcategory: ko.observable(),
    campaignid: ko.observable(),
    customerProductList: ko.observableArray([]),
    productlist: ko.observableArray([]),
    pids: ko.observableArray([]),
    sesList: ko.observableArray([]),
    selectedNet: ko.observable(""),
    selectedSes: ko.observable(),
    isSelectedKaynak: ko.pureComputed(function () {
        return (dataModel.salespersonel() > 0 && dataModel.tckimlikno() != "" && dataModel.gsm() != "" && dataModel.fulladdress() != "" && dataModel.customername() != "" && dataModel.selectedNet() > 0 && dataModel.selectedMahalle() != "" && dataModel.selectedMahalle() != null);
    }),
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
    getpersonel: function () {
        var self = this;
        crmcallAPI.getPersonel(function (a, b, c) {
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
            $('#salesPersonel').multiselect('select', self.personellist()).multiselect('rebuild');
        }, null, null)
    },
    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value: "" },
        };
        crmcallAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);
            $("#optionIl").multiselect("setOptions", self.ilList()).multiselect("rebuild");
        }, null, null)
    },
    getIlce: function (ilKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op: 2, value: ilKimlikNo },
        };
        crmcallAPI.getAdress(data, function (a, b, c) {
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
        crmcallAPI.getAdress(data, function (a, b, c) {
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
        crmcallAPI.getAdress(data, function (a, b, c) {
            self.mahalleList(a);
            self.loadingmessage(0);
            $("#optionMahalle").multiselect("setOptions", self.mahalleList()).multiselect("rebuild");

        }, null, null)
    },

    getcategory: function () {
        var self = this;
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmcallAPI.getCampaignInfo(data, function (a, b, c) {
            self.categorylist(a);
            $("#kategori").multiselect("setOptions", self.categorylist()).multiselect("rebuild");
            self.category(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.category : null);
            $("#kategori").multiselect("rebuild");
        }, null, null)
    },
    getsubcategory: function () {
        var self = this;
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmcallAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategorylist(a);
            $("#urun").multiselect("setOptions", self.subcategorylist()).multiselect("rebuild");
            self.subcategory(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.subcategory : null);
            $("#urun").multiselect("refresh");
        }, null, null)
    },
    getcamapign: function () {
        var self = this;
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'name', op: 6, value: '' }
        },
        crmcallAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignlist(a);
            $("#kampanya").multiselect("setOptions", self.campaignlist()).multiselect("rebuild");
            self.campaignid(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.id : null);
            $("#kampanya").multiselect("refresh");
        }, null, null)
    },
    getproduct: function () {
        var self = this;
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'id', op: 2, value: self.campaignid() },
            products: { fieldName: 'productname', op: 6, value: '' }
        },
        crmcallAPI.getCampaignInfo(data, function (a, b, c) {
            self.productlist(a[0].products);
            if (a[1])
                self.sesList(a[1].products);
            $("#product").multiselect("setOptions", self.productlist()).multiselect("rebuild");
            $("#product").multiselect("refresh");
            $("#ses").multiselect("setOptions", self.sesList()).multiselect("rebuild");
            $("#ses").multiselect("refresh");
        }, null, null)
    },
    insertAdslSalesTask: function () {
        var self = this;
        self.returntaskorderno(null);
        $('.btn-success').prop('disabled', true);
        if (self.selectedNet()) self.pids().push(self.selectedNet());
        if (self.selectedSes()) self.pids().push(self.selectedSes());

        if (self.adsl()) {
            if (self.yalin()) {
                self.taskid(30);
            }
            else {
                self.taskid(31);
            }
        }
        else {
            if (self.yalin()) {
                self.taskid(58);
            }
            else {
                self.taskid(63);
            }
        }

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
            salespersonel: self.salespersonel(),
            productids: self.pids(),
            campaignid: self.campaignid(),
            fault: self.fault(),
        };
        if (data.tc != null && data.gsm != null && self.selectedIl() && self.selectedIlce() && (self.yalin() || self.churn()))
            crmcallAPI.saveAdslSalesTask(data, function (a, b, c) {
                self.returntaskorderno(a);
                self.redirect();
            }, null, null);
        else alert("Eksik Bilgi Girdiniz.!");
    },
    redirect: function () {
        var self = this;
        if (self.returntaskorderno() == "Girilen TC Numarası Başkasına Aittir") {
            $('.btn-success').prop('disabled', false);
            alert(self.returntaskorderno());
        }
        else
            alert("Satış Yapıldı !");
    },
    renderBindings: function () {
        var self = this;
        var hashSearches = document.location.hash.split("?agent=");
        if (hashSearches.length > 1) {
            var info = hashSearches[1].split("&gsm=");
            if (info.length > 1) {
                console.log("agent = " + info[0]);
                console.log("gsm = " + info[1]);
                self.getpersonel();
                self.getIl();
                self.getcategory();
                $("#kategori").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'select-all-value',
                    maxHeight: 250,
                    buttonWidth: '100%',
                    nonSelectedText: ' Seçiniz',
                    nSelectedText: ' Seçildi!',
                    numberDisplayed: 2,
                    selectAllText: 'Tümünü Seç!',
                    enableFiltering: true,
                    filterPlaceholder: 'Ara'
                });
                $("#urun").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'select-all-value',
                    maxHeight: 250,
                    buttonWidth: '100%',
                    nonSelectedText: ' Seçiniz',
                    nSelectedText: ' Seçildi!',
                    numberDisplayed: 2,
                    selectAllText: 'Tümünü Seç!',
                    enableFiltering: true,
                    filterPlaceholder: 'Ara'
                });
                $("#kampanya,#product,#ses,#kampanyaturu,#internetturu").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'select-all-value',
                    maxHeight: 250,
                    buttonWidth: '100%',
                    nonSelectedText: ' Seçiniz',
                    nSelectedText: ' Seçildi!',
                    numberDisplayed: 2,
                    selectAllText: 'Tümünü Seç!',
                    enableFiltering: true,
                    filterPlaceholder: 'Ara'
                });
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
                $('#tc').maxlength({
                    threshold: 10,
                    warningClass: "label label-danger",
                    limitReachedClass: "label label-success",
                    separator: ' / ',
                    validate: true,
                    customMaxAttribute: "11"
                });
                $('#kampanyaturu').on('change', function () {
                    self.yalin(this.value == 1 ? true : false);
                    self.churn(this.value == 2 ? true : false);
                });
                ko.applyBindings(dataModel, $("#Container")[0]);
            }
            else
                alert("...?agent=****&gsm=**** şeklinde adres oluşturunuz !");
        }
        else
            alert("...?agent=****&gsm=**** şeklinde adres oluşturunuz !");
    }
}
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
dataModel.category.subscribe(function (v) {
    $("#kampanyaturu").val('');
    $("#kampanyaturu").multiselect("refresh");
    if (v == 'ADSL') {
        dataModel.adsl(true);
        dataModel.vdsl(false);
    }
    else if (v == 'VDSL') {
        dataModel.adsl(false);
        dataModel.vdsl(true);
    }
    dataModel.getsubcategory();
});
dataModel.subcategory.subscribe(function (v) {
    dataModel.productlist([]);
    if (v)
        dataModel.getcamapign();
});
dataModel.campaignid.subscribe(function (v) {
    dataModel.productlist([]);
    dataModel.sesList([]);
    if (v)
        dataModel.getproduct();
});