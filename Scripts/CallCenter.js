﻿/// <reference path="crmwebapi.js" />

$(document).ready(function () {
    dataModel.renderBindings();
});

var dataModel = {
    checkUrl: ko.observable(false),
    returntaskorderno: ko.observable(),
    tckimlikno: ko.observable(""),
    customername: ko.observable(""),
    confirmedCustomer: ko.observable(),
    gsm: ko.observable(""),
    phone: ko.observable(),
    isSmnoValid: ko.observable(),
    somn: ko.observable(),
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
    fault: ko.observable("Çağrı Merkezi"),

    adsl: ko.observable(),
    vdsl: ko.observable(),
    fiber: ko.observable(),
    mobil: ko.observable(),

    yalin: ko.observable(),
    churn: ko.observable(),

    donanim: ko.observable(),
    internet: ko.observable(),

    taskid: ko.observable(),
    user: ko.observable(),
    taskdescription: ko.observable(),
    salespersonel: ko.observable(),
    loadingmessage: ko.observable(0),
    subcategorylist: ko.observableArray([]),
    categorylist: ko.observableArray([]),
    campaignlist: ko.observableArray([]),
    geciciListe: ko.observableArray([]),
    category: ko.observable(),
    subcategory: ko.observable(),
    campaignid: ko.observable(),
    customerProductList: ko.observableArray([]),
    productlist: ko.observableArray([]),
    pids: ko.observableArray([]),
    isSelectedKaynak: ko.pureComputed(function () {
        return (dataModel.donanim() && dataModel.somn() && dataModel.campaignid() && ((dataModel.confirmedCustomer() && dataModel.confirmedCustomer() != "-1") || (dataModel.tckimlikno() && dataModel.customername() && dataModel.selectedIlce() && dataModel.fulladdress()))) || (dataModel.internet() && dataModel.tckimlikno() && dataModel.gsm() && dataModel.fulladdress() && dataModel.customername() && dataModel.selectedIlce() && dataModel.campaignid());
    }),
    errorControl: ko.pureComputed(function () {
        return (dataModel.mahalleList() && dataModel.mahalleList() == "-1") || (dataModel.bucakList() && dataModel.bucakList() == "-1");
    }),

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
    confirmCustomer: function () {
        var self = this;
        var data = {
            superonlineCustNo: self.somn(),
        };
        crmcallAPI.confirmCustomer(data, function (a, b, c) {
            if (!a) {
                window.location.href = "http://adsl.kociletisim.com.tr";
            }
            self.confirmedCustomer(a);
        })
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
        self.subcategorylist([]);
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmcallAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategorylist(a);
            self.campaignid(null);
            if (self.internet()) {
                $("#urun").multiselect("setOptions", self.subcategorylist()).multiselect("rebuild");
                self.subcategory(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.subcategory : null);
                $("#urun").multiselect("refresh");
            }
        }, null, null)
    },
    getcamapign: function () {
        var self = this;
        self.campaignlist([]);
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'name', op: 6, value: '' }
        },
        crmcallAPI.getCampaignInfo(data, function (a, b, c) {
            if (self.internet()) {
                var list = a;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id == 7124) {
                        self.geciciListe().push({ id: list[i].id, name: list[i].name, disable: ko.observable(true) });
                    }
                    else {
                        self.geciciListe().push({ id: list[i].id, name: list[i].name, disable: ko.observable(false) });
                    }
                }
                self.campaignlist(self.geciciListe());
            }
            else
                self.campaignlist(a);
            $("#kampanya").multiselect("setOptions", self.campaignlist()).multiselect("rebuild");
            self.campaignid(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.id : null);
            $("#kampanya").multiselect("refresh");
            if (self.donanim()) {
                self.campaignid(7124);
                $("#kampanya").multiselect("refresh");
                $("#kampanya").attr("disabled", true);
                //$("#kampanya").prop('disabled', true);
            }
        }, null, null)
    },
    setOptionDisable: function (option, item) {
        if (dataModel.campaignlist().length > 0 && dataModel.internet() && item != null && item != undefined) {
            ko.applyBindingsToNode(option, { disable: item.disable }, item);
        }
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
            self.productlist(a);
        }, null, null)
    },
    insertAdslSalesTask: function () {
        var self = this;
        self.returntaskorderno(null);
        $('.btn-success').prop('disabled', true);
        self.pids([]);
        var kontrol = true;
        for (i = 0; i < self.productlist().length; i++) {
            if (self.productlist()[i].selectedProduct == "" || self.productlist()[i].selectedProduct == null)
                kontrol = false;
            else {
                self.pids().push(self.productlist()[i].selectedProduct);
            }
        }

        // yeni oluşan tasklar yazılacak (gönderilen tasklar bölge içi olacak bölge dışı olduğuna apide karar vercem)
        if (self.yalin()) {
            self.taskid(119); // Satış-Çağrı Yalın İç (Dış'sa apide karar verilecek)
        }
        else if (self.churn()) {
            self.taskid(122); // Satış-Çağrı Churn İç (Dış'sa apide karar verilecek)
        }

        if (self.donanim())
            self.taskid(131); // İkinci Donanım Çağrı (Dış'sa apide karar verilecek)

        if (self.fiber())
            self.taskid(139); // Fiber Satış Taskı

        if (self.subcategory() == "RETENTION")
            self.taskid(193);

        if (self.confirmedCustomer() && self.confirmedCustomer() != "-1")
            self.selectedIl(self.confirmedCustomer().ilKimlikNo);

        var data = {
            customerid: self.donanim() ? self.confirmedCustomer() ? self.confirmedCustomer() != "-1" ? self.confirmedCustomer().customerid : 0 : 0 : 0,
            tc: self.tckimlikno(),
            customername: self.customername(),
            superonlineCustNo: self.somn() ? self.somn() : null,
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
            fault: self.taskid() != 131 ? self.fault() : null,
        };
        if (data.campaignid != null && self.pids().length > 0 && kontrol == true && data.taskid != null && ((self.confirmedCustomer() && self.confirmedCustomer() != "-1") || (data.tc != null && data.gsm != null && self.selectedIlce())))
            crmcallAPI.saveAdslSalesTask(data, function (a, b, c) {
                if (!a) {
                    window.location.href = "http://adsl.kociletisim.com.tr";
                }
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
        else if (self.returntaskorderno() == "Tamamlandı")
            alert("Satış Yapıldı !");
        else
            alert("Hata Oluştu. Satışı Tekrar Giriniz ! \r\n Hata Mesajı = " + self.returntaskorderno());
    },
    renderBindings: function () {
        var self = this;
        var hashSearches = document.URL.split("?agent=");
        if (hashSearches.length > 1) {
            var info = hashSearches[1].split("&gsm=%22");
            if (info.length > 1) {
                self.salespersonel(info[0]);
                self.gsm(info[1].split("%22")[0]);
                self.checkUrl(true);
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
                $("#kampanya,#product,#ses,#kampanyaturu,#internetturu,#satisturu").multiselect({
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
                $('#smno').maxlength({
                    threshold: 7,
                    warningClass: "label label-danger",
                    limitReachedClass: "label label-success",
                    separator: ' / ',
                    validate: true,
                    customMaxAttribute: "8"
                });
                $('#satisturu').on('change', function () {
                    self.confirmedCustomer(null);
                    self.somn(null);
                    self.campaignlist([]);
                    self.category(null);
                    self.yalin(false);
                    self.churn(false);
                    self.internet(this.value == 1 ? true : false);
                    self.donanim(this.value == 2 ? true : false);
                });
                $('#kampanyaturu').on('change', function () {
                    self.yalin(this.value == 1 ? true : false);
                    self.churn(this.value == 2 ? true : false);
                });
                ko.applyBindings(dataModel, $("#Container")[0]);
            }
            else {
                self.checkUrl(false);
                alert("...?agent=****&gsm=**** şeklinde adres oluşturunuz !");
            }
        }
        else {
            self.checkUrl(false);
            alert("...?agent=****&gsm=**** şeklinde adres oluşturunuz !");
        }
    }
}
dataModel.somn.subscribe(function (v) {
    if (v != null) {
        v.length == 8 ? dataModel.isSmnoValid(true) : dataModel.isSmnoValid(false);
    }
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
    dataModel.tckimlikno($("#tc").val());
    return true;
});
dataModel.category.subscribe(function (v) {
    $("#kampanyaturu").val('');
    $("#kampanyaturu").multiselect("refresh");
    dataModel.subcategory(null);
    if (v == 'ADSL') {
        dataModel.adsl(true);
        dataModel.vdsl(false);
        dataModel.fiber(false);
        dataModel.yalin(false);
        dataModel.churn(false);
    }
    else if (v == 'VDSL') {
        dataModel.adsl(false);
        dataModel.vdsl(true);
        dataModel.fiber(false);
        dataModel.yalin(false);
        dataModel.churn(false);
    }
    else if (v == 'FİBER') {
        dataModel.fiber(true);
        dataModel.adsl(false);
        dataModel.vdsl(false);
        dataModel.yalin(false);
        dataModel.churn(false);
    }
    else if (v == 'MOBİL') {
        dataModel.adsl(false);
        dataModel.vdsl(false);
        dataModel.fiber(false);
        dataModel.yalin(false);
        dataModel.churn(false);
    }
    $("#kategori").multiselect("refresh");
    dataModel.getsubcategory();
});
dataModel.donanim.subscribe(function (v) {
    if (v) {
        dataModel.category("ADSL");
        $("#kategori").multiselect("rebuild");
    }
    else {
        $("#kategori").multiselect("rebuild");
    }
});
dataModel.subcategorylist.subscribe(function (v) {
    if (dataModel.adsl() && dataModel.donanim()) {
        dataModel.subcategory("ADSL");
        $("#urun").multiselect("rebuild");
    }
});
dataModel.subcategory.subscribe(function (v) {
    dataModel.productlist([]);
    dataModel.campaignid(null);
    if (v)
        dataModel.getcamapign();
});
dataModel.campaignid.subscribe(function (v) {
    dataModel.productlist([]);
    if (v)
        dataModel.getproduct();
});