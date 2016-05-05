
var dataModel = {
    newmovement: ko.observable(false), // müşteri üzerinde modem yoksa yeni stok hareketi başlat
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
    serial: ko.observable(), // müşteri üzerinde modem bulunduysa (Hüseyin KOZ)
    serialtext: ko.observable(), // müşteri üzerinde modem bulunamadıysa Text olarak girilip alınması için
    newserial: ko.observable(), // işlem modem değişimi ise işlem yapan personel üzerinden modem seç
    movement: ko.observable(),
    loadingmessage: ko.observable(0),
    loadinghomepage: ko.observable(0),
    isTcValid: ko.observable(),
    krmcheck: ko.observable(false),
    processList: ko.observableArray([]), // başlangıçta işlemler dizisi olarak yapılabilecek işlemler listesi oluşur değiştirilmemesi veya sıfırlanmaması gerek
    serialList: ko.observableArray([]), // müşteri üzerinde modem bulunuyorsa liste halinde kullanıcıya sun hangisi ile yapacaksa seçsin
    newSerialList: ko.observableArray([]), // modemdeğişiminde personel üzerindeki modem listesi
    selectedProcess: ko.observable(), // hangi işlem seçildi (Modem iade || Modem Değişimi vs.)
    newcustomer: ko.observable(),
    returnHomePage : ko.observable(),
    kaydetEnable: ko.pureComputed(function () { // kaydet butonunu aktif etmek için gerekli şartlar !
        if (dataModel.selectedProcess() != null && (dataModel.serial() != null || dataModel.serialtext() != null) && ((dataModel.selectedProcess() == 1 && dataModel.newserial() != null) || dataModel.selectedProcess() == 2) && (dataModel.confirmedCustomer() != null || (dataModel.customername() != null && dataModel.gsm() != null && dataModel.selectedMahalle() != null && dataModel.fulladdress() != null)))
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
    insertStockMovements: function (fromtype,fromobject,tootype,toobject,serial,newmove) {
        var self = this;
        var data = {
            amount: 1,
            serialno: serial,
            fromobjecttype: fromtype,
            fromobject: fromobject,
            toobjecttype: tootype,
            toobject: toobject,
            stockcardid: 1117,
            deleted: newmove,
        };
        crmAPI.InsertStock(data, function (a, b, c) {
            if (self.newserial()) {
                var dat = {
                    stockcardid: 1117,
                    fromobject: self.confirmMessage() == null ? self.confirmedCustomer().customerid : self.newcustomer().customer.customerid,
                };
                crmAPI.getSerialOnCustomer(dat, function (a, b, c) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] == self.newserial())
                            window.setTimeout(function () {
                                self.loadinghomepage(1);
                                window.location.href = "app.html#ListTaskqueue";
                                window.location.reload();
                            }, 1000);
                    }
                }, null, null);
            }
            else {
                var d = {
                    stockcardid: 1117,
                    fromobject: self.user().userId,
                }
                crmAPI.getSerialOnPersonel(d, function (a, b, c) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] == self.serial() || a[i] == self.serialtext())
                            window.setTimeout(function () {
                                self.loadinghomepage(1);
                                window.location.href = "app.html#ListTaskqueue";
                                window.location.reload();
                            }, 1000);
                    }
                }, null, null);
            }
        }, null, null);
    },
    insert: function () {
        var self = this;
        if (self.confirmMessage() == null) {
            if (self.newmovement() == true) {
                self.insertStockMovements(16777217, self.confirmedCustomer().customerid, self.user().userRole, self.user().userId, self.serialtext(), true);
                if (self.newserial()) {
                    self.insertStockMovements(self.user().userRole, self.user().userId, 16777217, self.confirmedCustomer().customerid, self.newserial(), false);
                }
            }
            else {
                self.insertStockMovements(16777217, self.confirmedCustomer().customerid, self.user().userRole, self.user().userId, self.serial(), false);
                if (self.newserial()) {
                    self.insertStockMovements(self.user().userRole, self.user().userId, 16777217, self.confirmedCustomer().customerid, self.newserial(), false);
                }
            }
        }
        else {
            var data = {
                tc: self.tckimlikno(),
                customername: self.customername(),
                gsm: self.gsm(),
                phone: self.phone(),
                ilKimlikNo: self.selectedIl(),
                ilceKimlikNo: self.selectedIlce(),
                bucakKimlikNo: self.selectedBucak(),
                mahalleKimlikNo: self.selectedMahalle(),
                description: self.fulladdress(),
                email: self.email(),
            };
            crmAPI.insertCustomer(data, function (a, b, c) {
                self.newcustomer(a);
                if (a.errormessage.errorCode == 1) {
                    if (self.newmovement() == true) {
                        self.insertStockMovements(16777217, self.newcustomer().customer.customerid, self.user().userRole, self.user().userId, self.serialtext(), true);
                        if (self.newserial()) {
                            self.insertStockMovements(self.user().userRole, self.user().userId, 16777217, self.newcustomer().customer.customerid, self.newserial(), false);
                        }
                    }
                    else {
                        self.insertStockMovements(16777217, self.newcustomer().customer.customerid, self.user().userRole, self.user().userId, self.serial(), false);
                        if (self.newserial()) {
                            self.insertStockMovements(self.user().userRole, self.user().userId, 16777217, self.newcustomer().customer.customerid, self.newserial(), false);
                        }
                    }
                }
                else
                    alert("Müşteri Kaydedilemedi ! \r\n Tc Numarasını Kontrol Ettiriniz !");
            }, null, null);
        }
    },
    save: function () {
        var self = this;
        if (self.confirmedCustomer() != null) {
            if (self.serial() != null) {
                self.newmovement(false);
                self.insert();
            }
            else if (self.serialtext() != null) {
                self.newmovement(true);
                self.insert();
            }
            else
                alert("Seri No Giriniz !");
        }
        else {
            var data = {
                serialno: { value: self.serialtext() },
            };
            crmAPI.getStock(data, function (a, b, c) {
                self.movement(a.data.rows[0]);
                if (self.movement() && self.movement().movementid != 0) {
                    alert("Seri No Kontrol Ediniz !");
                }
                else {
                    self.newmovement(true); // satın almadan -> depoya -> müşteriye stok hareketi
                    self.insert();
                }
            }, null, null);
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
        $("#optionIl,#optionIlce,#optionBucak,#optionMahalle,#process,#serialno,#serialnoex").multiselect({
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
        $('#vergino').maxlength({
            threshold: 9,
            warningClass: "label label-danger",
            limitReachedClass: "label label-success",
            separator: ' / ',
            validate: true,
            customMaxAttribute: "10"
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
    if (v != null) {
        if (dataModel.krmcheck())
            v.length == 10 ? dataModel.isTcValid(true) : dataModel.isTcValid(false);
        else
            v.length > 10 ? dataModel.isTcValid(true) : dataModel.isTcValid(false);
    }
});
dataModel.krmcheck.subscribe(function (v) {
    dataModel.tckimlikno(null);
    dataModel.isTcValid(false)
}); dataModel.selectedProcess.subscribe(function (v) {
    if (v == "" || v == null) {
        dataModel.serial(null);
        dataModel.newserial(null);
        dataModel.serialtext(null);
        dataModel.newSerialList([]);
        dataModel.serialList([]);
        $("#serialnoex").multiselect("setOptions", dataModel.serialList()).multiselect("rebuild");
        $("#serialno").multiselect("setOptions", dataModel.newSerialList()).multiselect("rebuild");
    }
    else if (v == 2) {
        dataModel.newserial(null);
        dataModel.newSerialList([]);
        $("#serialno").multiselect("setOptions", dataModel.newSerialList()).multiselect("rebuild");
        var data = {
            stockcardid: 1117,
            fromobject: dataModel.confirmMessage() == null ? dataModel.confirmedCustomer().customerid : -1,
        }
        crmAPI.getSerialOnCustomer(data, function (a, b, c) {
            dataModel.serialList(a);
            $("#serialnoex").multiselect("setOptions", dataModel.serialList()).multiselect("rebuild");
        }, null, null);
    }
    else if (v == 1) {
        var data = {
            stockcardid: 1117,
            fromobject: dataModel.confirmMessage() == null ? dataModel.confirmedCustomer().customerid : -1,
        }
        crmAPI.getSerialOnCustomer(data, function (a, b, c) {
            dataModel.serialList(a);
            $("#serialnoex").multiselect("setOptions", dataModel.serialList()).multiselect("rebuild");
        }, null, null);

        var d = {
            stockcardid: 1117,
            fromobject: dataModel.user().userId,
        }
        crmAPI.getSerialOnPersonel(d, function (a, b, c) {
            dataModel.newSerialList(a);
            $("#serialno").multiselect("setOptions", dataModel.newSerialList()).multiselect("rebuild");
        }, null, null);
    }
});
dataModel.confirmedCustomer.subscribe(function (v) {
    dataModel.selectedProcess(null);
    $("#process").multiselect("setOptions", dataModel.processList()).multiselect("rebuild");
});
dataModel.serialList.subscribe(function (v) {
    if (v.length > 0)
        dataModel.serialtext(null);
});