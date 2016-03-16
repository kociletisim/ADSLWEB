var dataModel = {

    returntaskorderno:ko.observable(),
    tckimlikno: ko.observable(""),
    customername: ko.observable(""),
    gsm: ko.observable(""),
    phone: ko.observable(),
    email: ko.observable(),
    fulladdress: ko.observable(""),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    bucakList:ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    caddeList: ko.observableArray([]),
    binaList: ko.observableArray([]),
    daireList: ko.observableArray([]),
    selectedIl:ko.observable(),
    selectedIlce: ko.observable(),
    selectedBucak: ko.observable(),
    selectedMahalle:ko.observable(),
    selectedCadde:ko.observable(),
    selectedBina:ko.observable(),
    selectedDaire: ko.observable(),
    kampanyaTuruList: ko.observableArray(["YALIN", "CHURN"]),
    fault:ko.observable(),
    /////
    bayi: ko.observable(),
    cc: ko.observable(),

    adsl: ko.observable(),
    vdsl: ko.observable(),

    yalin: ko.observable(),    
    churn: ko.observable(),

    yalinadsl: ko.observable(),
    ntyalinadsl: ko.observable(),
    churnyalin: ko.observable(),
    churnsesli:ko.observable(),
    taskid: ko.observable(),
    user: ko.observable(),
    mail: ko.observable(),
    isSirketPersonel: ko.observable(),
    taskdescription:ko.observable(),
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
        return ((dataModel.isSirketPersonel() == true && dataModel.salespersonel() > 0 && dataModel.fault() != '' || dataModel.isSirketPersonel() == false) && dataModel.tckimlikno() != "" && dataModel.gsm() != "" && dataModel.fulladdress() != "" && dataModel.customername() != "" && dataModel.selectedNet() > 0);
    }),
    errorControl:ko.pureComputed(function(){
        return  (dataModel.mahalleList() && dataModel.mahalleList() == "-1") || (dataModel.bucakList() && dataModel.bucakList() == "-1");
    }),

    isBayi: function () {
        var self = this;
        self.bayi(true);
        self.cc(false);
    },
    isCC: function () {
        var self = this;
        self.cc(true);
        self.bayi(false);
    },

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
            var arr = self.user().userName.split('@');
            if (arr[1] == 'kociletisim.com.tr') {
                self.isSirketPersonel(true);
            }
            else
                self.isSirketPersonel(false);
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
            $('#salesPersonel').multiselect('select', self.personellist()).multiselect('rebuild');
        }, null, null)
    },
    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value:"" },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);
            $("#optionIl").multiselect("setOptions", self.ilList()).multiselect("rebuild");
        }, null, null)
    },
    getIlce: function (ilKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op:2, value: ilKimlikNo},
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

    getcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.categorylist(a);
            $("#kategori").multiselect("setOptions", self.categorylist()).multiselect("rebuild");

            self.category(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.category : null);
            $("#kategori").multiselect("refresh");


        }, null, null)
    },
    getsubcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategorylist(a);
            $("#urun").multiselect("setOptions", self.subcategorylist()).multiselect("rebuild");
            self.subcategory(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.subcategory : null);
            $("#urun").multiselect("refresh");
        }, null, null)
    },
    getcamapign: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'name', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignlist(a);
            $("#kampanya").multiselect("setOptions", self.campaignlist()).multiselect("rebuild");
            self.campaignid(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.id : null);
            $("#kampanya").multiselect("refresh");
        }, null, null)
    },
    getproduct: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'id', op: 2, value: self.campaignid() },
            products: { fieldName: 'productname', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
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
        if (self.selectedNet()) self.pids().push(self.selectedNet());
        if (self.selectedSes()) self.pids().push(self.selectedSes());

        if (self.bayi()) {
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
        }
        else {
            if (self.adsl()) {
                if (self.yalin()) {
                    self.taskid(32);
                }
                else {
                    self.taskid(33);
                }
            }
            else {
                if (self.yalin()) {
                    self.taskid(57);
                }
                else {
                    self.taskid(64);
                }
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
            binaKimlikNo:61,
            daire: 61,
            taskdescription: self.taskdescription(),
            description: self.fulladdress(),
            taskid: self.taskid(),
            salespersonel: self.salespersonel(),
            productids: self.pids(),
            campaignid: self.campaignid(),
            fault:self.fault(),
        };
        if (data.tc != null && data.gsm != null &&(self.yalin()||self.churn()))
            crmAPI.saveAdslSalesTask(data, function (a, b, c) { self.returntaskorderno(a) }, null, null);
        else alert("Eksik Bilgi Girdiniz.!");
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
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
        $("#urun,#kaynak").multiselect({
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
        self.getIl();
        self.getcategory();
        $('#kampanyaturu').on('change', function () {
            self.yalin(this.value==1? true : false);
            self.churn(this.value == 2 ? true : false);
        });
        ko.applyBindings(dataModel, $("#bindingmodal")[0]);

    }
}
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
    if(v!=null)
        dataModel.getMahalle(v);
    return true;
});
dataModel.category.subscribe(function (v) {
    $("#kampanyaturu").val('');
    $("#kampanyaturu").multiselect("refresh");
    if (v=='ADSL') {
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