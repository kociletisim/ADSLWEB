
var dataModel = {
    newmovement: ko.observable(false), // Bağlantı problemi seçildiğinde girilen müşteri bizde yoksa kontrolü için oluşturuldu
    tckimlikno: ko.observable(),
    customername: ko.observable(),
    gsm: ko.observable(),
    phone: ko.observable(),
    email:ko.observable(),
    fulladdress: ko.observable(),
    user:ko.observable(),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    bucakList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    selectedIl: ko.observable(),
    selectedIlce: ko.observable(),
    selectedBucak: ko.observable(),
    selectedMahalle: ko.observable(),
    isAutorized: ko.observable(),
    confirmMessage: ko.observable(),
    confirmedCustomer: ko.observable(),
    ccname: ko.observable(),
    cil: ko.observable(),
    cilce: ko.observable(),
    serial: ko.observable(), // bağlanti problemi taskı seçilirse geri alınacak modem serisi girilmesi gerekmektedir (Hüseyin KOZ)
    newserial: ko.observable(),
    movement: ko.observable(),
    loadingmessage: ko.observable(0),
    isTcValid: ko.observable(),
    processList: ko.observableArray([]),
    selectedProcess: ko.observable(),
    kaydetEnable: ko.pureComputed(function () { // kaydet butonunu aktif etmek için gerekli şartlar !
        if (dataModel.selectedProcess() != null && dataModel.serial() != null && ((dataModel.selectedProcess() == 1 && dataModel.newserial() != null) || dataModel.selectedProcess() == 2) && (dataModel.confirmedCustomer() != null || (dataModel.customername() != null && dataModel.gsm() != null && dataModel.selectedMahalle() != null && dataModel.fulladdress() != null)))
            return true;
        else return false;
    }),

    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.isAutorized((a.userRole & 67108896) == 67108896);
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
    confirmCustomer: function () {
        var self = this;
        var data = {
            tc:self.tckimlikno(),
        };
        crmAPI.confirmCustomer(data, function (a, b, c) {
            $("#process").multiselect("setOptions", self.processList()).multiselect("rebuild");
            if (a == "-1") {
                self.confirmMessage(a);
                self.confirmedCustomer(null);
            }
            else {
                self.confirmedCustomer(a);
                self.ccname(a.customername);
                self.cil(a.il.ad);
                self.cilce(a.ilce.ad);
                self.confirmMessage(null);
            }
        })
    },
    insertStockMovements: function (fromtype,fromobject,tootype,toobject) {
        var self = this;
        var data = {
            amount: 1,
            serialno: self.serial(),
            fromobjecttype: fromtype,
            fromobject: fromobject,
            toobjecttype: tootype,
            toobject: toobject,
            stockcardid: 1117,
        };
        crmAPI.InsertStock(data, function (a, b, c) {
        }, null, null);
    },
    insert: function () {
        var self = this;
        if (self.confirmMessage() == null) {
            //if (self.newmovement()) {
            //    self.insertStockMovements(33554433, 33554433, 2, 1007);
            //    self.insertStockMovements(2, 1007, 16777217, self.confirmedCustomer().customerid);
            //}
            //else
            //    self.returntaskorderno(a);
        }
        //else {
        //    var data = {
        //        tc: self.tckimlikno(),
        //        customername: self.customername(),
        //        gsm: self.gsm(),
        //        phone: self.phone(),
        //        ilKimlikNo: self.selectedIl(),
        //        ilceKimlikNo: self.selectedIlce(),
        //        bucakKimlikNo: self.selectedBucak(),
        //        mahalleKimlikNo: self.selectedMahalle(),
        //        description: self.fulladdress(),
        //        taskid: self.taskid(),
        //        email: self.email(),
        //    };
        //    crmAPI.saveAdslSalesTask(data, function (a, b, c) {
        //        if (self.newmovement()) {
        //            var data = {
        //                tc: { fieldName: 'tc', op: 2, value: self.tckimlikno() },
        //            }
        //            crmAPI.getCustomer(data, function (a, b, c) {
        //                self.insertStockMovements(33554433, 33554433, 2, 1007);
        //                self.insertStockMovements(2, 1007, 16777217, a.data.rows[0].customerid);
        //            }, null, null);
        //        }
        //        else
        //            self.returntaskorderno(a);
        //        self.geciciton(a)
        //    }, null, null);
        //}
    },
    save: function () {
        var self = this;
        if (self.serial() != null) {
            if (self.confirmedCustomer() != null) {
                var data = {
                    product: { fieldName: 'stockid', op: 2, value: 1117 },
                    toobjectid: { value: self.confirmedCustomer().customerid },
                };
                crmAPI.getSerialOnCustomer(data, function (a, b, c) {
                    self.movement(a);
                    if (self.movement()) {
                        if (self.movement().serialno == self.serial()) {
                            self.newmovement(false);
                            self.insert();
                        }
                        else
                            alert("Seri No Eşleştirilemedi. Doğru Seri No Girdiğinizden Emin Olun ! \r\n Eminseniz Sistem Yöneticinize Başvurunuz !");
                    }
                    else {
                        self.newmovement(true); // satın almadan -> depoya -> müşteriye stok hareketi
                        self.insert();
                    }
                }, null, null);
            }
            else {
                var data = {
                    serialno: { value: self.serial() },
                };
                crmAPI.getStock(data, function (a, b, c) {
                    self.movement(a.data.rows[0]);
                    if (self.movement()) {
                        alert("Seri No Kontrol Ediniz !");
                    }
                    else {
                        self.newmovement(true);
                        self.insert();
                        // satın almadan depoya seriyi aldır sonra o seriyi olusan müşteriye at sonra task olustur 
                    }
                }, null, null);
            }
        }
        else {
            alert("Seri No Giriniz !");
        }
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.confirmCustomer();
        }
        return true;
    },
    clean: function () { // ana ekrandan yeni işlem bir kere olusturularak kapanıp tekrar oluşturulmak istenirse önceki bilgiler sıfırlanması gerek (Hüseyin KOZ)
        var self = this;
        self.customername(null);
        self.gsm(null);
        self.phone(null);
        self.email(null);
        self.fulladdress(null);
        self.confirmedCustomer(null);
        self.serial(null);
        self.movement(null);
    },
    renderBindings: function () {
        var self = this;
        $("#optionIl,#optionIlce,#optionBucak,#optionMahalle,#process").multiselect({
            includeSelectAllOption: false,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            nonSelectedText: 'Seçiniz',
            nSelectedText: 'Seçildi!',
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
        var elmn1 = { id: 1, name: "Modem Değişimi" };
        var elmn2 = { id: 2, name: "Modem İade" };
        self.processList().push(elmn1);
        self.processList().push(elmn2);
        $("#process").multiselect("setOptions", self.processList()).multiselect("rebuild");
        self.clean();
        self.getUserInfo();
        self.getIl();
        ko.applyBindings(dataModel, $("#bindingmodal")[0]);
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
dataModel.tckimlikno.subscribe(function (v) {
    v.length > 10 ? dataModel.isTcValid(true) : dataModel.isTcValid(false);
});
dataModel.selectedProcess.subscribe(function (v) {
    if (v == "" || v == null) {
        dataModel.serial(null);
        dataModel.newserial(null);
    }
    else if (v == 2)
        dataModel.newserial(null);
});