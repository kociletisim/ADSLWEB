/// <reference path="../Scripts/_references.js" />

var dataModel = {
    perOfBayiOrKoc: ko.observable(false), // Sayfada işlem yapan personel bayi mi yoksa şirket personeli mi ? false : bayi --  true : koc personeli
    BayiOrKoc: function () {
        var self = this;
        if (self.user() != null || self.user() != "") {
            var arr = self.user().userName.split('@');
            if (arr[1] == 'kociletisim.com.tr') 
                self.perOfBayiOrKoc(true);
        }
    },
    isNetflowDate: ko.observable(false), // Task NetFlowdan CRM'e giriş gerektiriyorsa Randevu Tarih Alanı Netflow tarihi olarak sadece bizim personele gösterilecek (dateoption -> duruma göre değişecek)  false : Randevu Tarihi -- true : NetFlow Tarihi
    NetFlowOrRand: function() {
        var self = this;
        self.isNetflowDate(false);
        if (self.taskid() == 32 || self.taskid() == 57 || self.taskid() == 34 || self.taskid() == 33 || self.taskid() == 36 || self.taskid() == 64 || self.taskid() == 97 || self.taskid() == 88 || self.taskid() == 56 || self.taskid() == 54 || self.taskid() == 53 || self.taskid() == 93 || self.taskid() == 51 || self.taskid() == 48 || self.taskid() == 91 || self.taskid() == 92) {
            self.isNetflowDate(true);
            self.dateoption("Netflow Tarihi");
        }
        else if (self.tasktype() == 1 || self.tasktype() == 8 || self.tasktype() == 9) 
            self.dateoption("Satış Tarihi");
        else if (self.tasktype() == 3)
            self.dateoption("Kurulum Tarihi");
        else if (self.tasktype() == 5)
            self.dateoption("Kapatma Tarihi");
        else self.dateoption("Randevu Tarihi");
    },
    isEnableDateOption: ko.pureComputed(function () {
        if (dataModel.perOfBayiOrKoc() == true || (dataModel.perOfBayiOrKoc() == false && dataModel.isNetflowDate() == false))
            return true;
        else
            return false;
    }),
    isEnterDateOption: ko.pureComputed(function () {
        if (dataModel.perOfBayiOrKoc() == true && dataModel.isNetflowDate() == true && (dataModel.appointmentdate() == "" || dataModel.appointmentdate() == null))
            return false;
        else
            return true;
    }),
    isEnterSmno: ko.pureComputed(function () {
        return dataModel.perOfBayiOrKoc() == false || (dataModel.taskid() != 47 && dataModel.taskid() != 90 && dataModel.taskid() != 35) || (dataModel.smno() != null && dataModel.smno() != "");
    }), // süperonline müş. no girilmesi zorunludur
    ff: function () { // netflow tarih seçilip silindiğinde tarih nesnesini temizle
        window.setTimeout(function () {
            dataModel.appointmentdate($('#daterangepicker2').val());
        }, 50);
    },
    eskiserial: ko.observable(null), // modem değiştirilecek olan tasklarda kullanılacak olan iade modem seri
    smno: ko.observable(), // süperonline müşteri no
    isClickKaydet: ko.observable(false),
    movement: ko.observable(),
    taskorderno: ko.observable(),
    taskname: ko.observable(),
    taskid: ko.observable(),
    taskstatetype:ko.observable(),
    previoustask: ko.observable(),
    relatedtask: ko.observable(),
    taskstatus: ko.observable(),
    creationdate: ko.observable(),
    attachmentdate: ko.observable(),
    appointmentdate: ko.observable(),
    consummationdate: ko.observable(),
    personelname: ko.observable(),
    personelid: ko.observable(),
    assistantpersonel: ko.observable(),
    il: ko.observable(),
    ilce: ko.observable(),
    region: ko.observable(),
    customername: ko.observable(),
    customerid: ko.observable(),
    flat:ko.observable(),
    locationid: ko.observable(),
    customer: ko.observableArray([]),
    selectedCustomer: ko.observable(),
    smnoCustomer: ko.observable(),
    customergsm: ko.observable(),
    customerstatus: ko.observable(),
    description: ko.observable(),
    descriptionControl:ko.observable(),
    dateoption: ko.observable(),
    taskstatuslist: ko.observableArray([]),
    personellist:ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    message: ko.observable(),
    flag: ko.observable(true),
    customerdocument:ko.observableArray([]),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    bucakList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    editable: ko.observable(),
    tasktype: ko.observable(),
    errormessage: ko.observable(),
    productlist: ko.observableArray([]),
    dosya: ko.observable(),
    campaignEditable: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.productlist(), function (index, cp) {
            b &= cp.selectedProduct() == 0;
        });
        return (dataModel.editable() || b) && ((dataModel.tasktype() === 1) || (dataModel.tasktype() === 8) || (dataModel.tasktype() === 9));
    }),
    campaignIsValid: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.productlist(), function (index, cp) {
            b &= cp.selectedProduct() > 0;
        });
        return !dataModel.campaignEditable() || (b && dataModel.productlist().length > 0);
    }),
    smEditable: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.stockmovement(), function (index, sm) {
            b &= sm.movementid == 0;
        });
        return b || dataModel.editable();
    }),
    smIsValid: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.stockmovement(), function (index, sm) {
            b &= sm.used() > 0;
        });
        return !dataModel.smEditable() || b;
    }),
    cdEditable: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.customerdocument(), function (index, cd) {
            b &= cd.id == 0;
        });
        return b || dataModel.editable();
    }),
    cdIsValid: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.customerdocument(), function (index, cd) {
            b &= cd.documenturl() && cd.documenturl().length > 0;
        });
        return !dataModel.cdEditable() || b;
    }),
    modelIsValid: ko.pureComputed(function () {
        return dataModel.campaignIsValid() && dataModel.smIsValid() && dataModel.cdIsValid()==1;
    }),

    selectedProducts: ko.pureComputed(function () {
        var self = dataModel;
        var res = [];
        for (var i = 0; i < self.productlist().length; i++) {
            res.push({
                productid: self.productlist()[i].selectedProduct(),
                campaignid: self.campaignid(),
                taskid: self.taskorderno(),
                customerid: self.customerid()
            });
        }
        return res;
    }),
    selectedProductIds: ko.pureComputed(function () {
        var self = dataModel;
        var res = [];
        for (var i = 0; i < self.selectedProducts().length; i++) {
            res.push(self.selectedProducts()[i].productid);
        }
        return res;
    }),
    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value: "" },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);        
            $("#ilcombo").multiselect("setOptions", self.ilList()).multiselect("rebuild");
        }, null, null)
    },
    getIlce: function () {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op: 6, value: '' },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilceList(a);         
            $("#ilcecombo").multiselect("setOptions", self.ilceList()).multiselect("rebuild");
        }, null, null)
    },
    getBucak: function (ilce) {
        self = this;
        var data = {
            adres: { fieldName: "ilceKimlikNo", op: 2, value: ilce },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.bucakList(a);
            $("#bucakcombo").multiselect({
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
            $("#bucakcombo").multiselect("setOptions", self.bucakList()).multiselect("rebuild");
            $("#bucakcombo").multiselect('select', dataModel.selectedCustomer().bucakKimlikNo);
        }, null, null)
    },
    getMahalle: function (x) {
        self = this;
        var data = {
            adres: { fieldName: "bucakKimlikNo", op: 2, value: x },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.mahalleList(a);
            $("#mahallecombo").multiselect({
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
            $("#mahallecombo").multiselect("setOptions", self.mahalleList()).multiselect("rebuild");
            $("#mahallecombo").multiselect('select', dataModel.selectedCustomer().mahalleKimlikNo);
        }, null, null)
    },
    getCustomerCard : function () {
       var self = this;
       var data = {
           customername:{fieldName:'customerid',op:2,value:self.customerid()},
       };
       crmAPI.getCustomer(data, function (a, b, c) {
           self.selectedCustomer(a.data.rows[0]);
           self.getMahalle(a.data.rows[0].bucakKimlikNo);
           self.getBucak(a.data.rows[0].ilceKimlikNo);
           self.smno(a.data.rows[0].superonlineCustNo);
           $("#ilcombo,#ilcecombo").multiselect({
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
       },null,null);
    },
    getCustomerSmno: function () {
        // taskın içerisinde Süperonline m. no değişmek için çağrılıp kaydedildiğinde adres bilgilerinde hataya yok açıyor yeni müşteri object'i ve fonksiyonu
        var self = this;
        var data = {
            customername: { fieldName: 'customerid', op: 2, value: self.customerid() },
        };
        crmAPI.getCustomer(data, function (a, b, c) {
            self.smnoCustomer(a.data.rows[0]);
            self.smno(a.data.rows[0].superonlineCustNo);
        }, null, null);
    },
    saveCustomer: function () {
        var self = this;
        var data = self.selectedCustomer();
        if (self.isClickKaydet() == true) {
            self.smnoCustomer().superonlineCustNo = self.smno();
            data = self.smnoCustomer();
        }
        else {
            self.selectedCustomer().bucakKimlikNo = $("#bucakcombo").val() ? $("#bucakcombo").val() : null;
            self.selectedCustomer().mahalleKimlikNo = $("#mahallecombo").val() ? $("#mahallecombo").val() : null;
            data = self.selectedCustomer();
        }
       crmAPI.saveCustomerCard(data, function (a, b, c) {
           if (a == "ok" && !self.isClickKaydet()) {
               self.refresh();
           }
       }, null, null);
   },
    subcategorylist: ko.observableArray([]),
    categorylist: ko.observableArray([]),
    campaignlist: ko.observableArray([]),
    category: ko.observable(),
    subcategory: ko.observable(),
    campaignid: ko.observable(),
    customerProductList: ko.observableArray([]),
    info:ko.observable(),//eğer müşterinin dökümanları geliyorsa kaydet butonunu disable yapalım
    closedTaskqueueResponseMessage: ko.observable(),
    user:ko.observable(),
    docIds: ko.observableArray(),
    uploadControl:ko.observable(),
    xx:ko.observable(),

    getcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.categorylist(a);
            $("#kategori").multiselect("setOptions", self.categorylist()).multiselect("rebuild");
           
            self.category(self.customerProductList()[0]? self.customerProductList()[0].campaigns.category:null);
                $("#kategori").multiselect("refresh");
            
           
        }, null, null)
    },
    getsubcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category()?self.category() :'' },
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategorylist(a);
            $("#urun").multiselect("setOptions", self.subcategorylist()).multiselect("rebuild");
            self.subcategory(self.customerProductList()[0] ?self.customerProductList()[0].campaigns.subcategory:null);
            $("#urun").multiselect("refresh");
        }, null, null)
    },
    getcamapign: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory()?self.subcategory():'' },
            campaign: { fieldName: 'name', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignlist(a);
            $("#kampanya").multiselect("setOptions", self.campaignlist()).multiselect("rebuild");
            self.campaignid(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.id :null);
            $("#kampanya").multiselect("refresh");
        }, null, null)
    },
    getproduct: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'id', op: 2, value: self.campaignid() },
            products:{fieldName:'productname',op:6,value:''}
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            $.each(a, function (index, category) {
                category.selectedProduct = ko.observable("0");
                $.each(category.products, function (pindex, product) {
                    $.each(self.customerProductList(), function (cpIndex, customerProduct) {
                        if (product.productid === customerProduct.productid)
                        {
                            category.selectedProduct(product.productid + "");
                        } 
                    });
                });
            });
            self.productlist(a);
            if (self.taskstatetype() == 1) {
                dataModel.getTQDocuments();
            }
        }, null, null)
    },
    stockcardlist: ko.observableArray([]),
    stockmovement:ko.observableArray([]),

    gettaskstatus: function (statusVal) {
        var self = this;
        var data = {
            task: { fieldName: "taskid", op: 2, value:self.taskid()},
            taskstate: { fieldName: "taskstate", op: 6, value: '' },
        };
        crmAPI.getTaskStatus(data, function (a, b, c) {
             self.taskstatuslist(a);
             self.taskstatus(statusVal);
             $("#taskdurumu").multiselect({
                 includeSelectAllOption: true,
                 selectAllValue: 'select-all-value',
                 maxHeight: 250,
                 buttonWidth: '100%',
                 nonSelectedText: 'Seçiniz',
                 numberDisplayed: 2,
                 selectAllText: 'Tümünü Seç!',
                 enableFiltering: true,
                 filterPlaceholder: 'Ara'
             });
         }, null, null)
    },
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.BayiOrKoc();
        }, null, null)
    },
    refresh: function () {
        var self = this;
        window.location.reload();
    },
    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#assistantPersonel").multiselect({
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
            $('#assistantPersonel').multiselect('select', self.personellist()).multiselect('rebuild');
        }, null, null)
    },
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus(function (a, b, c) {
            self.ctstatuslist(a);
            $("#abonedurumu,#abonedurumuinfo").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Abone Durumunu Seçiniz',
                nSelectedText: 'Abone Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getTQDocuments: function () {
        var self = this;
        var data = {
            taskorderno: dataModel.taskorderno(),
            taskid: dataModel.taskid(),
            stateid: dataModel.taskstatus(),
            campaignid: dataModel.campaignid(),
            customerproducts: dataModel.selectedProductIds(),
            isSalesTask: (dataModel.tasktype() == 1 || dataModel.tasktype() == 8 || dataModel.tasktype() == 9)
        };
        crmAPI.getTQDocuments(data, function (a, b, c) {
            $.each(a, function (index, doc) {
                doc.documenturl = ko.observable(doc.documenturl);
            });
            self.customerdocument(a);
        });
    },
    insertStockMovements: function (fromtype,fromobject,tootype,toobject,seri) {
        // taskda geri modem alınacak tasklar için oluşturuldu
        var self = this;
        var data = {
            amount: 1,
            serialno: seri,
            fromobjecttype: fromtype,
            fromobject: fromobject,
            toobjecttype: tootype,
            toobject: toobject,
            stockcardid: 1117,
            deleted: false, // yeni stok hareketi değil
        };
        crmAPI.InsertStock(data, function (a, b, c) {
        }, null, null);
    },
    save: function () {
        var self = this;
        self.flag(false);
        if (!dataModel.modelIsValid())
            crmAPI.saveTaskQueues(data, function (a, b, c) {
                self.message(a);
                window.setTimeout(function () {
                    $("#id_alert").alert('close');
                    window.location.href = "app.html";
                }, 2000);
            }, null, null);
        data = {
            taskorderno: self.taskorderno(),
            task: { taskid: self.taskid() },
            taskstatepool:
                {
                    taskstateid: self.taskstatus() ? self.taskstatus() : null,
                    taskstate: $("#taskdurumu option:selected").text() ? $("#taskdurumu option:selected").text() : null
                },
            customerdocument: self.customerdocument(),
            stockmovement: self.stockmovement(),
            customerproduct: self.campaignEditable() == true ? self.selectedProducts() : null,
            description: self.description() ? self.description() == "" ? null : (self.description() + " " + moment().format('DD MMMM, h:mm') + "(" + self.user().userFullName + ")") : null,
            asistanPersonel: { personelid: self.assistantpersonel() > 0 ? self.assistantpersonel() : null },
            appointmentdate: self.appointmentdate() ? moment(self.appointmentdate()).format() : null,
            consummationdate: self.consummationdate() ? moment(self.consummationdate()).format() : null,
            creationdate: self.creationdate() ? moment(self.creationdate()).format() : null,
            attachmentdate: self.attachmentdate() ? moment(self.attachmentdate()).format() : null,
        };
        if (dataModel.cdEditable()) {
            var fi = $('#fileUpload').data().fileinput;
            var fu = $('#fileUpload')[0];
            fu.multiple = true;
            fi.filestack = [];
            if (fi.kocData) {
                var b = true;
                $.each(dataModel.customerdocument(), function (index, doc) {
                    b &= fi.kocData.hasOwnProperty("_" + doc.documentid);
                    if (b) fi.filestack.push(fi.kocData["_" + doc.documentid]);
                })
                if (!b) return alert("Tüm Belgeleri Yükleyiniz");
            }
            else {
                b = false;
                $.each(dataModel.customerdocument(), function (index, doc) {
                    b |= doc.id = 0;
                })
                if (b)
                    return alert("Tüm Belgeleri Yükleyiniz...");
                else
                    crmAPI.saveTaskQueues(data, function (a, b, c) {
                        self.message(a);
                        window.setTimeout(function () {
                            $("#id_alert").alert('close');
                            window.location.href = "app.html";
                        }, 2000);
                    }, null, null);
            }

            $("#fileUpload").fileinput("upload");
        }
        else {
            crmAPI.saveTaskQueues(data, function (a, b, c) {
                self.message(a);
                window.setTimeout(function () {
                    $("#id_alert").alert('close');
                    window.location.href = "app.html";
                }, 2000);
            }, null, null);
        }
    },
    saveTaskQueues: function () {
        var self = this;
        self.isClickKaydet(false);
        $('.btn').prop('disabled', true);
        if (self.perOfBayiOrKoc() == true && self.smnoCustomer() && self.smno()) {
            self.isClickKaydet(true);
            self.saveCustomer();
        }
        if (self.taskid() == 66 && self.stockmovement().length > 0) {
            if (self.eskiserial()) { // bağlantı problemi taskında modem değiştirildi sonucunda müşteri üzerinde eski modem varsa işlem yap
                if (self.stockmovement()[0].frompersonel != null && self.stockmovement()[0].frompersonel != "") {
                    self.insertStockMovements(16777217, self.customer().customerid, self.stockmovement()[0].frompersonel.roles, self.stockmovement()[0].frompersonel.personelid, self.eskiserial());
                    self.save();
                }
                else if (self.stockmovement()[0].fromobject != null && self.stockmovement()[0].fromobject != "") {
                    self.insertStockMovements(16777217, self.customer().customerid, self.stockmovement()[0].fromobjecttype, self.stockmovement()[0].fromobject, self.eskiserial());
                    self.save();
                }
                else
                    alert("Personel Bilgileri Okunamadı !");
            }
            else
                alert("Müşterinin Eski Modem Bilgisinde Hata !");
        }
        else
            self.save();
    },
    saveTaskQueueDescription: function () {
        var self = this;
        self.isClickKaydet(false);
        $('.btn').prop('disabled', true);
        if (self.perOfBayiOrKoc() == true && self.smnoCustomer() && self.smno()) {
            self.isClickKaydet(true);
            self.saveCustomer();
        }
        data = {
            taskorderno: self.taskorderno(),
            task: { taskid: self.taskid() },
            taskstatepool:
                {
                    taskstateid: 0,
                    taskstate: "AÇIK"
                },
            stockmovement: self.stockmovement(),
            description: self.description() ? self.description() == "" ? null : (self.description() + " " + moment().format('DD MMMM, h:mm') + "(" + self.user().userFullName + ")") : null,
            customerdocument: self.customerdocument(),
            customerproduct: self.selectedProducts(),
            asistanPersonel: { personelid: self.assistantpersonel() > 0 ? self.assistantpersonel() : null },
        };
         crmAPI.saveTaskQueues(data, function (a, b, c) {
                self.message(a);
                window.setTimeout(function () {
                    $("#id_alert").alert('close');
                    window.location.href = "app.html";
                }, 1250);
            }, null, null);
    },
    download: function () {
        var self = this;
        crmAPI.download(function (a, b, c) {
        }, null, null);
    },
    selectFile: function(documentid){
        var fu = $("#fileUpload")[0];
        fu.documentid = documentid;
        $(fu).trigger('click');
    },
    renderBindings: function () {
        var self = this; var i = 0;
        var hashSearches = document.location.hash.split("?");
        if (hashSearches.length > 1) {
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
            $("#kampanya").multiselect({
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
            $("#fileUpload").fileinput({
               //uploadUrl: "http://localhost:50752/api/Adsl/TaskQueues/upload", // server upload action
               uploadUrl: "http://crmapitest.kociletisim.com.tr/api/Adsl/TaskQueues/upload", // server upload action
                uploadAsync: false,
                minFileCount: 1,
                maxFileCount: 10,
                showUpload: true,
                overwriteInitial: false,
                uploadExtraData: function () {
                    return {
                        customer: self.customerid() + "-" + self.customername(),
                        il: self.il(),
                        ilce: self.ilce(),
                        documentids: (function () {
                            var res = [];
                            $.each(dataModel.customerdocument(), function (index, doc) {
                                res.push(doc.documentid);
                            });
                            return JSON.stringify(res);
                        })(),
                        tq: JSON.stringify({
                            taskorderno: self.taskorderno(),
                            task: { taskid: self.taskid() },
                            taskstatepool:
                                {
                                    taskstateid: self.taskstatus() ? self.taskstatus() : null,
                                    taskstate: $("#taskdurumu option:selected").text() ? $("#taskdurumu option:selected").text() : null
                                },
                            customerdocument: self.customerdocument(),
                            stockmovement: self.stockmovement(),
                            customerproduct: self.selectedProducts(),
                            description: self.description() ? self.description() : null,
                            asistanPersonel: { personelid: self.assistantpersonel() > 0 ? self.assistantpersonel() : 0 },
                            appointmentdate: self.appointmentdate() ? self.appointmentdate() : null,
                            consummationdate: self.consummationdate() ?self.consummationdate() : null,
                            creationdate: self.creationdate() ? self.creationdate(): null,
                            attachmentdate: self.attachmentdate() ? self.attachmentdate() : null,
                        })
                    };
                }
            });
            $('#fileUpload').on('fileloaded', function (event, file, previewId, index, reader) {
                var fi = $('#fileUpload').data().fileinput;
                var fu = $('#fileUpload')[0];
                var files = fi.filestack;
                var filenames = fi.filenames;
                fi.kocData = fi.kocData || {};
                fi.kocData["_" + fu.documentid] = files[i];
                i++;
                $.each(self.customerdocument(), function (index, doc) {
                    if (doc.documentid === fu.documentid) doc.documenturl(file.name);
                });
            });
            $('#fileUpload').on('filebatchpreupload', function (event, data, previewId, index) {
                data.jqXHR.setRequestHeader("X-KOC-Token", crmAPI.getCookie("token"));
            });
            $('#fileUpload').on('filebatchuploadsuccess', function (event, data, previewId, index) {
                dataModel.message("ok");
            });
            var data = { taskOrderNo: hashSearches[1] };
            crmAPI.getTaskQueues(data, function (a, b, c) {
                self.taskorderno(a.data.rows[0].taskorderno);               
                self.taskname(a.data.rows[0].task.taskname);
                self.taskid(a.data.rows[0].task.taskid);
                self.tasktype(a.data.rows[0].task.tasktypes.TaskTypeId);
                self.NetFlowOrRand();
                self.taskstatetype(a.data.rows[0].taskstatepool && a.data.rows[0].taskstatepool.statetype || null)
                var status = a.data.rows[0].taskstatepool && a.data.rows[0].taskstatepool.taskstateid || null;
                self.gettaskstatus(status);
                $("#abonedurumu").multiselect("refresh");
                self.previoustask(a.data.rows[0].previoustaskorderid);
                self.relatedtask(a.data.rows[0].relatedtaskorderid);
                self.creationdate(a.data.rows[0].creationdate);
                self.attachmentdate(a.data.rows[0].attachmentdate && a.data.rows[0].attachmentdate || null);
                self.appointmentdate(a.data.rows[0].appointmentdate ? a.data.rows[0].appointmentdate : null);
                self.consummationdate(a.data.rows[0].consummationdate && a.data.rows[0].consummationdate || null);
                self.personelname(a.data.rows[0].attachedpersonel && a.data.rows[0].attachedpersonel.personelname || 'atanmamış');
                self.personelid(a.data.rows[0].attachedpersonel && a.data.rows[0].attachedpersonel.personelid || 0);
                self.assistantpersonel(a.data.rows[0].asistanPersonel ? a.data.rows[0].asistanPersonel.personelid : 'atanmamış');
                self.il(a.data.rows[0].attachedcustomer.il && a.data.rows[0].attachedcustomer.il.ad || '');
                self.ilce(a.data.rows[0].attachedcustomer.ilce && a.data.rows[0].attachedcustomer.ilce.ad || '');
                self.customername(a.data.rows[0].attachedcustomer.customername && (a.data.rows[0].attachedcustomer.customername) || '');
                self.customerid(a.data.rows[0].attachedcustomer.customerid && (a.data.rows[0].attachedcustomer.customerid) || '');
                self.getCustomerSmno();
                self.customer(a.data.rows[0].attachedcustomer);
                self.flat(a.data.rows[0].attachedcustomer && (a.data.rows[0].attachedcustomer.daire) || '');
                self.customergsm(a.data.rows[0].attachedcustomer && a.data.rows[0].attachedcustomer.gsm || '');
                self.description(a.data.rows[0].description);
                self.descriptionControl(false);
                self.customerProductList(a.data.rows[0].customerproduct);
                $.each(a.data.rows[0].customerdocument, function (index, doc) {
                    doc.documenturl = ko.observable(doc.documenturl);
                });
                self.customerdocument(a.data.rows[0].customerdocument);
                self.info(a.data.rows[0].customerproduct[0] ?a.data.rows[0].customerproduct[0].campaigns.category:null);
                self.getcategory();

                $.each(a.data.rows[0].stockmovement, function (index, stockmovement) {
                    var ssAmount = (stockmovement.stockStatus ? stockmovement.stockStatus.amount : 0);
                    var ssSerials = (stockmovement.stockStatus ? stockmovement.stockStatus.serials : []);
                    stockmovement.used = ko.observable(stockmovement.amount);
                    stockmovement.max = ko.observable(stockmovement.amount + ssAmount);
                    stockmovement.available = ko.observable(ssAmount);
                    stockmovement.serial = ko.observable(stockmovement.serialno);
                    stockmovement.serials = ko.observableArray(ssSerials);
                    stockmovement.serial.subscribe(function (v) {
                        stockmovement.used(v ? 1 : 0);
                        stockmovement.serialno = v;
                        stockmovement.amount=1;
                        return v;
                    });
                    stockmovement.used.subscribe(function (v) {
                        if (v > stockmovement.max())
                            stockmovement.used(stockmovement.max());
                        else if (v < 0)
                            stockmovement.used(0);
                        stockmovement.available(stockmovement.max() - stockmovement.used());
                        return v;
                    });
                });
                self.editable(a.data.rows[0].editable);
                self.stockmovement(a.data.rows[0].stockmovement);
                self.stockcardlist(a.data.rows[0].stockcardlist);
            }, null, null);
            self.getpersonel();
            self.getCustomerStatus();
            $('#daterangepicker1,#daterangepicker2,#daterangepicker3,#daterangepicker4').daterangepicker({
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
            ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        }
        self.getIl();
        self.getIlce();
    }
}

dataModel.category.subscribe(function (v) {
    dataModel.getsubcategory();
});
dataModel.subcategory.subscribe(function (v) {
    dataModel.productlist([]);
    if(v)
        dataModel.getcamapign();
});
dataModel.campaignid.subscribe(function (v) {
    dataModel.productlist([]);
    if(v)
    dataModel.getproduct();
});
dataModel.taskstatus.subscribe(function (v) {
    dataModel.errormessage(null);
    var data = {
        taskorderno: dataModel.taskorderno(),
        taskid: dataModel.taskid(),
        stateid: dataModel.taskstatus(),
        campaignid: dataModel.campaignid(),
        customerproducts: dataModel.selectedProductIds(),
        isSalesTask: (dataModel.tasktype() == 1 || dataModel.tasktype() == 8 || dataModel.tasktype() == 9)
    };
    crmAPI.getTQStockMovements(data, function (a, b, c) {
        if (a.errorMessage) dataModel.errormessage(a.errorMessage);
        $.each(a, function (index, stockmovement) {
            var ssAmount = (stockmovement.stockStatus ? stockmovement.stockStatus.amount : 0);
            var ssSerials = (stockmovement.stockStatus ? stockmovement.stockStatus.serials : []);
            stockmovement.used = ko.observable(stockmovement.amount);
            stockmovement.max = ko.observable(stockmovement.amount + ssAmount);
            stockmovement.available = ko.observable(ssAmount);
            stockmovement.serial = ko.observable(stockmovement.serialno);
            stockmovement.serials = ko.observableArray(ssSerials);
            stockmovement.serial.subscribe(function (v) {
                stockmovement.used(v ? 1 : 0);
                stockmovement.serialno = v;
                stockmovement.amount = 1;
                return v;
            });
            stockmovement.used.subscribe(function (v) {
                if (v > stockmovement.max())
                    stockmovement.used(stockmovement.max());
                else if (v < 0)
                    stockmovement.used(0);
                stockmovement.available(stockmovement.max() - stockmovement.used());
                return v;
            });
        });
        dataModel.stockmovement(a);
    });
    dataModel.customerdocument([]);
    dataModel.taskstatuslist().forEach(function (entry) {
        if (entry.taskstateid == v && entry.statetype == 1) {
            dataModel.getTQDocuments();
        }
    });
});
dataModel.stockmovement.subscribe(function (v) {
    if (dataModel.taskid() == 66 && dataModel.stockmovement().length > 0 && dataModel.stockmovement().serialno != "") { // Bağlantı problemi taskı modem geri almak için
        dataModel.movement(null);
        var data = {
            stockcardid: 1117,
            fromobject: dataModel.customer().customerid,
        };
        crmAPI.getSerialOnCustomer(data, function (a, b, c) {
            dataModel.movement(a[0]);
            if (dataModel.movement()) {
                dataModel.eskiserial(dataModel.movement());
            }
            else
                alert("Müşteride Sisteme Kayıtlı Modem Bulunamadı. Sistem Yöneticinize Başvurunuz !");
        }, null, null);
    }
    else {
        dataModel.eskiserial(null);
    }
});
dataModel.uploadControl.subscribe(function (v) {
    if(v==true)
        $('.fileinput-upload-button').click()
});
dataModel.description.subscribe(function () {
    dataModel.descriptionControl() == false ? dataModel.descriptionControl(true) : dataModel.descriptionControl(false);
});