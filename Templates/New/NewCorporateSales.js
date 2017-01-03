
var dataModel = {
    perOfBayiOrKoc: ko.observable(false), // Sayfada işlem yapan personel bayi mi yoksa şirket personeli mi ? false : bayi --  true : koc personeli
    BayiOrKoc: function () {
        var self = this;
        if (self.user() != null || self.user() != "") {
            var arr = self.user().userName.split('@');
            if (arr[1] == 'kociletisim.com.tr')
                self.perOfBayiOrKoc(true);
            else
                self.fault("Bayi");
        }
    },
    appointmentdate: ko.observable(""),
    fault: ko.observable(),
    returntaskorderno: ko.observable(),
    tckimlikno: ko.observable(),
    customername: ko.observable(),
    gsm: ko.observable(),
    phone: ko.observable(),
    fulladdress: ko.observable(),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    bucakList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    selectedIl: ko.observable(),
    selectedIlce: ko.observable(),
    selectedBucak: ko.observable(),
    selectedMahalle: ko.observable(),
    taskid: ko.observable(null),
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
    skaynak: ko.observable(),
    skaynakList: ko.observableArray([]),
    errorControl: ko.pureComputed(function () {
        return (dataModel.mahalleList() && dataModel.mahalleList() == "-1") || (dataModel.bucakList() && dataModel.bucakList() == "-1");
    }),
    kaydetEnable: ko.pureComputed(function () {
        return dataModel.fault() && dataModel.fulladdress() && dataModel.selectedMahalle() && dataModel.gsm() && dataModel.customername() && dataModel.tckimlikno() && dataModel.yalin() != null && ((dataModel.perOfBayiOrKoc() == false) || ((!dataModel.isAutorized() || (dataModel.salespersonel() > 0 && dataModel.skaynak())) && ((dataModel.skaynak() == 2 && dataModel.smno() && dataModel.appointmentdate() && dataModel.appointmentdate() != "") || dataModel.skaynak() == 1)));
    }),

    smno: ko.observable(), // süperonline müşteri no 
    yalin: ko.observable(),
    churn: ko.observable(),
    isYalin: function () {
        var self = this;
        self.yalin(true);
        self.churn(false);
        $('#adsl').css({ width: '71%' });
        $('#churn').css({ width: '25%' });
        self.setTaskid();
    },
    isChurn: function () {
        var self = this;
        self.churn(true);
        self.yalin(false);
        $('#adsl').css({ width: '25%' });
        $('#churn').css({ width: '71%' });
        self.setTaskid();
    },
    setTaskid: function () {
        var self = this;
        if (self.perOfBayiOrKoc() == true) {
            if (self.skaynak() == 1) {
                if (self.yalin() == true)
                    self.taskid(112); // satış adsl kurumsal
                else if (self.churn() == true)
                    self.taskid(113); // satış churn kurumsal 
            }
            else if (self.skaynak() == 2) {
                if (self.yalin() == true)
                    self.taskid(56); // satış CC adsl kurumsal
                else if (self.churn() == true)
                    self.taskid(114); // satış CC churn kurumsal
            }
        }
        else {
            if (self.yalin() == true)
                self.taskid(112); // satış adsl kurumsal
            else if (self.churn() == true)
                self.taskid(113); // satış churn kurumsal 
        }
    },
    isAutorized: ko.observable(),
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.BayiOrKoc();
            self.isAutorized((a.userRole & 67108896) == 67108896);
            if (!self.isAutorized()) {
                self.skaynak(1);
                $("#satisk").prop('disabled', true);
                self.getpersonel();
                self.fault("Bayi");
                self.salespersonel(self.user().userId);
            }
        }, null, null)
    },
    getpersonel: function () {
        var self = this;
        $("#satisk").multiselect("setOptions", self.skaynakList()).multiselect("rebuild");
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            if (!self.isAutorized()) {
                self.salespersonel(self.user().userId);
                $("#salesPersonel").prop('disabled', true);
            }
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
            }).multiselect('refresh');
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

    getcategory: function () {
        var self = this;
        data = {
            deleted: { fieldName: "deleted", op: 2, value: 0 },
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.categorylist([{ category: 'ADSL' }, { category: 'VDSL' }, { category: 'MOBİL' }]);
            $("#kategorinat").multiselect("setOptions", self.categorylist()).multiselect("rebuild");

            self.category(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.category : null);
            $("#kategorinat").multiselect("refresh");


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
        $('.btn').prop('disabled', true);
        self.pids([]);
        for (i = 0; i < self.productlist().length; i++) {
            if (self.productlist()[i].selectedProduct == "" || self.productlist()[i].selectedProduct == null) {
                $('.btn').prop('disabled', false);
                alert("Ürünleri Seçiniz...");
                return;
            }
            else {
                self.pids().push(self.productlist()[i].selectedProduct);
            }
        }

        var data = {
            tc: self.tckimlikno(),
            customername: self.customername(),
            superonlineCustNo: $.trim(self.smno()),
            gsm: self.gsm(),
            phone: self.phone(),
            ilKimlikNo: self.selectedIl(),
            ilceKimlikNo: self.selectedIlce(),
            bucakKimlikNo: self.selectedBucak(),
            mahalleKimlikNo: self.selectedMahalle(),
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
            appointmentdate: self.appointmentdate() == "" ? null : self.appointmentdate(),
        };
        if (data.tc != null && data.gsm != null && data.productids.length > 0 && self.selectedIl() && self.selectedIlce() && self.taskid() != null && self.taskid() != "")
            crmAPI.saveAdslSalesTask(data, function (a, b, c) {
                self.returntaskorderno(a)
                self.redirect();
            }, null, null);
        else {
            $('.btn').prop('disabled', false);
            alert("Eksik Bilgi Girdiniz.! Bilgileri Kontrol Ediniz veya Tarayıcı Geçmişini Temizleyerek Tekrar Deneyiniz !");
        }
    },
    redirect: function () {
        var self = this;
        if (self.returntaskorderno() == "Girilen TC Numarası Başkasına Aittir") {
            $('.btn').prop('disabled', false);
            alert(self.returntaskorderno());
        }
        else {
            window.location.href = "app.html#TaskQueueEditForm?" + self.returntaskorderno();
        }

    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        $('#adsl').css({ width: '48%' });
        $('#churn').css({ width: '48%' });
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
        $("#kampanyanat,#satisk").multiselect({
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
        var elmn1 = { id: 1, name: "Koç İletişim" };
        var elmn2 = { id: 2, name: "CC" };
        self.skaynakList().push(elmn1);
        self.skaynakList().push(elmn2);
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
            threshold: 9,
            warningClass: "label label-danger",
            limitReachedClass: "label label-success",
            separator: ' / ',
            validate: true,
            customMaxAttribute: "10"
        });
        self.getIl();
        self.getcategory();
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

    return true;
});
dataModel.selectedBucak.subscribe(function (v) {
    if (v != null)
        dataModel.getMahalle(v);
    return true;
});
dataModel.category.subscribe(function (v) {
    dataModel.getsubcategory();
});
dataModel.subcategory.subscribe(function (v) {
    dataModel.productlist([]);
    if (v)
        dataModel.getcamapign();
    dataModel.tckimlikno($("#tc").val());
});
dataModel.campaignid.subscribe(function (v) {
    dataModel.productlist([]);
    if (v)
        dataModel.getproduct();
    dataModel.tckimlikno($("#tc").val());
});
dataModel.skaynak.subscribe(function (v) {
    if (v == 1) // Koç kurumsal Satılı
    {
        dataModel.yalin(null);
        dataModel.churn(null);
        dataModel.smno(null);
        dataModel.fault("Bayi");
        dataModel.appointmentdate("");
        $('#adsl').css({ width: '48%' });
        $('#churn').css({ width: '48%' });
    }
    else if (v == 2) // satış CC kurumsal
    {
        dataModel.fault(null);
        dataModel.yalin(null);
        dataModel.churn(null);
        $('#adsl').css({ width: '48%' });
        $('#churn').css({ width: '48%' });
    }
});