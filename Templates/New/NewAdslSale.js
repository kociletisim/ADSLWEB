var dataModel = {
    appointmentdate: ko.observable(""),
    returntaskorderno:ko.observable(),
    tckimlikno: ko.observable(""),
    superonlineCustNo: ko.observable(),
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
    isSelectedKaynak: ko.pureComputed(function () {
        return (((dataModel.isSirketPersonel() == true && (!dataModel.isAutorized() || dataModel.salespersonel() > 0) && dataModel.fault() != '' && dataModel.fault() != null && (dataModel.cc() == true && dataModel.appointmentdate() != "" || dataModel.cc() == false)) || dataModel.isSirketPersonel() == false) && dataModel.tckimlikno() != "" && dataModel.gsm() != "" && dataModel.fulladdress() != "" && dataModel.customername() != "" && dataModel.selectedMahalle() != "" && dataModel.selectedMahalle() != null);
    }),
    errorControl:ko.pureComputed(function(){
        return  (dataModel.mahalleList() && dataModel.mahalleList() == "-1") || (dataModel.bucakList() && dataModel.bucakList() == "-1");
    }),

    isBayi: function () {
        var self = this;
        self.fault("Bayi");
        self.bayi(true);
        self.cc(false);
    },
    isCC: function () {
        var self = this;
        self.fault(null);
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
            else {
                self.isSirketPersonel(false);
                self.fault("Bayi");
            }
            self.isAutorized((a.userRole & 67108896) == 67108896);
            if (!self.isAutorized())
                self.fault("Bayi");
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
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.categorylist([{ category: 'ADSL' }, { category: 'VDSL' }]);
            $("#kategorinat").multiselect("setOptions", self.categorylist()).multiselect("rebuild");

            self.category(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.category : null);
            $("#kategorinat").multiselect("rebuild");


        }, null, null)
    },
    getsubcategory: function () {
        var self = this;
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategorylist(a);
            $("#urunnat").multiselect("setOptions", self.subcategorylist()).multiselect("rebuild");
            self.subcategory(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.subcategory : null);
            $("#urunnat").multiselect("refresh");
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
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignlist(a);
            $("#kampanyanat").multiselect("setOptions", self.campaignlist()).multiselect("rebuild");
            self.campaignid(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.id : null);
            $("#kampanyanat").multiselect("refresh");
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
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.productlist(a);
        }, null, null)
    },
    insertAdslSalesTask: function () {
        var self = this;
        self.returntaskorderno(null);
        $('.btn-success').prop('disabled', true);
        self.pids([]);
        for (i = 0; i < self.productlist().length; i++) {
            if (self.productlist()[i].selectedProduct == "" || self.productlist()[i].selectedProduct == null) {
                $('.btn-success').prop('disabled', false);
                alert("Ürünleri Seçiniz...");
                return;
            }
            else {
                self.pids().push(self.productlist()[i].selectedProduct);
            }
        }

        if (self.bayi()) {
            if (self.adsl()) {
                if (self.yalin()) {
                    if (self.campaignid() == 7160)
                        self.taskid(173); // Mobil kampanya seçildiyse mobil adsl yalın satış aç
                    else
                        self.taskid(30);
                }
                else {
                    if (self.campaignid() == 7161)
                        self.taskid(174); // Mobil kampanya seçildiyse mobil adsl churn satış aç
                    else
                        self.taskid(31);
                }
            }
            else {
                if (self.yalin()) {
                    if (self.campaignid() == 7160)
                        self.taskid(183); // Mobil kampanya seçildiyse mobil vdsl yalın satış aç
                    else
                        self.taskid(58);
                }
                else {
                    if (self.campaignid() == 7161)
                        self.taskid(184); // Mobil kampanya seçildiyse mobil vdsl churn satış aç
                    else
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
            binaKimlikNo: 61,
            daire: 61,
            taskdescription: self.taskdescription(),
            description: self.fulladdress(),
            taskid: self.taskid(),
            salespersonel: self.salespersonel(),
            productids: self.pids(),
            campaignid: self.campaignid(),
            fault: self.fault(),
            superonlineCustNo: $.trim(self.superonlineCustNo()),
            appointmentdate: self.appointmentdate() == "" ? null : self.appointmentdate(),
        };
        if (data.tc != null && data.gsm != null && data.productids.length > 0 && self.selectedIl() && self.selectedIlce() && (self.yalin() || self.churn()))
            crmAPI.saveAdslSalesTask(data, function (a, b, c) {
                self.returntaskorderno(a);
                self.redirect();
            }, null, null);
        else {
            $('.btn-success').prop('disabled', false);
            alert("Eksik Bilgi Girdiniz.!");
        }
    },
    redirect: function () 
    {
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
        $("#kategorinat").multiselect({
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
        $("#urunnat,#kaynak").multiselect({
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
        $("#kampanyanat,#kampanyaturu,#internetturu").multiselect({
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
        self.getcategory();
        $('#kampanyaturu').on('change', function () {
            self.yalin(this.value==1? true : false);
            self.churn(this.value == 2 ? true : false);
        });
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
    dataModel.tckimlikno($("#tc").val());
    if (v)
        dataModel.getproduct();
});