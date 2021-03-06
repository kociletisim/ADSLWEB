﻿
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    selectedmovementid:ko.observableArray([]),
    user: ko.observable(),
    newinputserial:ko.observable(),
    serialArray:ko.observableArray([]),
    fromobject: ko.observable(),
    movementList: ko.observableArray([]),
    selectedMovementCard: ko.observable(),
    personellist: ko.observable(),
    fromObjectName: ko.observable(),
    selectedFromObjectType: ko.observable(),
    toObjectName: ko.observable(),
    productName: ko.observable(),
    serialNo: ko.observable(),
    isconfirmed:ko.observable(),
    movementdate: ko.observable(),
    objectList: ko.observableArray([]),
    objectsList: ko.observableArray([]),
    stockCardList: ko.observableArray([]),
    personelStockList: ko.observableArray([]),
    stockOnPersonel:ko.observable(),
    serialList: ko.observableArray([]),
    stockSerialControl: ko.observable(),
    amount: ko.observable(),
    newamount: ko.observable(),
    newserialno: ko.observable(),
    newtoobjecttype: ko.observable(),
    newtoobject: ko.observable(),
    newselectedproduct: ko.observable(),
    isSatinalma: ko.observable(),
    amountmessage: ko.observable('Elinizde yeterli Miktarda Yok'),
    amountcontrol: ko.pureComputed(function () {
        return dataModel.newamount() > dataModel.amount() ? true : false;
    }),
    confirmable: ko.pureComputed(function () {
        return dataModel.user().userId == dataModel.selectedMovementCard().toobject && dataModel.selectedMovementCard().confirmationdate == null ? true : false;
    }),
    getStockMovements: function (pageno, rowsperpage) {
        var self = this;
        self.savemessage(null);
        self.savemessagecode(null);
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            fromobject: { value: self.fromObjectName() ? self.fromObjectName() : null, },
            toobject: { value: self.toObjectName() ? self.toObjectName() : null },
            product: self.productName() ? { fieldName: 'productname', op: 6, value: self.productName() } : null,
            serialno: self.serialNo() ? { value: self.serialNo() } : null,
            isconfirmed: self.isconfirmed() ? { value: self.isconfirmed() } : null,
            movementdate: self.movementdate() ? ($("#movementdate").val() ? { value: self.movementdate() } : null) : null,
        };
        crmAPI.getStockMovements(data, function (a, b, c) {
            self.movementList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            $(".edit").click(function () {
                self.getStockCards();
                self.getpersonel();
                self.getStockMovementCard($(this).val());
            });
            $('.sel').change(function () {
                var ids = [];
                $('.sel').each(function () {
                    if ($(this).is(':checked')) {
                        var id = $(this).val();
                        ids.push(id);
                    }
                });
                self.selectedmovementid(ids);
            });
        }, null, null);
    },

    getObjectTypes: function () {
        var self = this;
        crmAPI.getObjectType(function (a, b, c) { self.objectList(a); }, null, null)
    },
    getObjects: function () {
        var self = this;
        var data = {
            objecttype: { value: self.selectedFromObjectType() },
        };
        crmAPI.getObject(data, function (a, b, c) {
            self.objectsList(a);
        }, null, null);
    },
    getStockCards: function () {
        var self = this;
        var data = {
            stockcard: { fieldName: 'productname', op: 6, value: '' },
        };
        crmAPI.getStockCards(data, function (a, b, c) {
            self.stockCardList(a.data.rows);
            $("#newproduct,#newobject,#editobject,#editproduct").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#newproduct").multiselect("setOptions", dataModel.stockCardList()).multiselect("rebuild");
            $("#editproduct,#editobject").multiselect("setOptions", dataModel.stockCardList()).multiselect("rebuild");
        }, null, null);
    },
    getPersonelStock: function () {
        var self = this;
        var data = {
            personelid:self.fromobject(),
        };
        crmAPI.getPersonelStock(data, function (a, b, c) {
            self.personelStockList(a);
            self.stockOnPersonel(a),
            $("#newobject,#newserial").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
           // $("#newproduct").multiselect("setOptions", dataModel.personelStockList()).multiselect("rebuild");
        }, null, null);
    },
    getSerialsOnPersonel: function () {
        var self = this;
        var data = {
            personelid: self.fromobject(),
            stockcardid: self.newselectedproduct(),
        };
        crmAPI.getSerialsOnPersonel(data, function (a, b, c) {
            self.serialList(a);
            $("#newserial").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#newserial").multiselect("setOptions", dataModel.serialList()).multiselect("rebuild");
        }, null, null);
    },
    getpersonel: function () {
        var self = this;
        var data = { personel: self.newtoobjecttype() ? { fieldName: "roles", op: 10, value: self.newtoobjecttype(), } : { fieldName: "personelname", op: 6, value: '', } };
        crmAPI.getPersonels(data, function (a, b, c) {
            self.personellist(a.data.rows);
            $("#newpersonel,#editpersonel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#newpersonel,#editpersonel").multiselect("setOptions", dataModel.personellist()).multiselect("rebuild");
        }, null, null)
    },
    getStockMovementCard: function (movementid) {
        var self = this;
        var data = { movement: { value: movementid } };
        crmAPI.getStockMovements(data, function (a, b, c) {
            self.selectedMovementCard(a.data.rows[0]);
            $("#editpersonel,#editobject,#editproduct").multiselect({
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
            if (a.data.rows[0].toobjecttype != 16777217 && ($('#editpersonel').val() == "") || ($('#editpersonel').val() == null))
                self.getStockMovementCard(movementid);
            $("#editpersonel,#editobject,#editproduct").multiselect("rebuild");
        }, null, null);
    },
    getSerialControl: function (stockid) {
        var self = this;
        var data = {
            stockcard: stockid ? { fieldName: 'stockid', op: 2, value: stockid } : null,
        };
        if (stockid != null)
            crmAPI.getStockCards(data, function (a, b, c) {
                self.stockSerialControl(a.data.rows[0].hasserial);
            }, null, null);
        return false;
    },
    saveStockMovement: function () {
        var self = this;
        var data = self.selectedMovementCard();
        var postdata = [];
        var pd = {
            movementid:self.selectedMovementCard().movementid,
            amount: self.selectedMovementCard().amount,
            serialno: self.selectedMovementCard().serialno,
            fromobjecttype: self.selectedMovementCard().frompersonel.roles,
            fromobject: self.selectedMovementCard().frompersonel.personelid,
            toobjecttype: self.selectedMovementCard().topersonel.roles,
            toobject: self.selectedMovementCard().topersonel.personelid,
            stockcardid: self.selectedMovementCard().stockcardid,
            confirmationdate:self.selectedMovementCard().confirmationdate?moment().format():null,
        };
        postdata.push(pd);
        crmAPI.SaveStockMovementMultiple(postdata, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getStockMovements(1, dataModel.rowsPerPage());
                self.selectedMovementCard(null);
                self.savemessage(null);
                self.savemessagecode(null);
            }, 1000);
        }, null, null);
    },
    getUser: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.fromobject(a.userId);
            self.getPersonelStock();
        }, null, null);
    },
    addSerialList: function (d,e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.serialArray.push(self.newinputserial());
            self.newinputserial(null);
        }     
        return true;
    },
    insertStockMovements: function () {
        var self = this;
        var postdata = [];
        var pd = {
            amount: self.isSatinalma() ? (self.newserialno() == null ? self.newamount() : 1) : (self.newserialno() ? 1 : parseInt(self.newamount())),
            serialno:self.isSatinalma()? self.serialArray().toString() : self.newserialno(),
            fromobjecttype: self.user().userRole,
            fromobject: self.user().userId,
            toobjecttype:  self.newtoobjecttype(),
            toobject: self.newtoobject(),
            stockcardid: self.newselectedproduct(),
        };
        postdata.push(pd);
        crmAPI.SaveStockMovementMultiple(postdata, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.selectedMovementCard(null);
                self.getStockMovements(1, dataModel.rowsPerPage());
                self.savemessage(null);
                self.savemessagecode(null);
            }, 1000);
        }, null, null);
    },
    confirmAll: function () {
        var self = this;
        crmAPI.confirmSM(self.selectedmovementid(), function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal2').modal('hide');
                self.getStockMovements(1, dataModel.rowsPerPage());
                window.location.reload();
            }, 1000);
        });
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getStockMovements(1, dataModel.rowsPerPage());
        }
        return true;
    },
    clean: function () {
        var self = this;
        self.fromObjectName(null);
        self.toObjectName(null);
        self.serialNo(null);
        self.movementdate(null);
        self.productName(null);
        self.getStockMovements(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getStockMovements(pageNo, dataModel.rowsPerPage());
        },
        gotoFirstPage: function () {
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage: function () {
            dataModel.navigate.gotoPage(dataModel.pageCount());
        },
        gotoNextPage: function () {
            var pc = dataModel.pageNo() + 1;
            if (pc >= dataModel.pageCount()) return;
            dataModel.navigate.gotoPage(pc);
        },
        gotoBackPage: function () {
            var pc = dataModel.pageNo() - 1;
            if (pc <= 0) return;
            dataModel.navigate.gotoPage(pc);
        },
    },
    renderBindings: function () {
        var self = this;
        $('#movementdate').daterangepicker({
            "timePicker": true,
            ranges: {
                'Bugün': [moment(), moment().add(1, 'days')],
                'Dün': [moment().subtract(1, 'days'), moment()],
                'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
                'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
                'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
                'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });
        self.getStockMovements(dataModel.pageNo(), dataModel.rowsPerPage());
        self.getObjectTypes();
        $('#new').click(function () {
            self.getpersonel();
            self.getPersonelStock();
        });        
        self.getUser();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}

dataModel.newtoobjecttype.subscribe(function (v) {
    dataModel.getpersonel();
});
dataModel.newselectedproduct.subscribe(function (v) {
    dataModel.getSerialControl(v);
    dataModel.getSerialsOnPersonel();

    dataModel.amount(dataModel.personelStockList()[$("#newproduct")[0].selectedIndex-1] ?
        dataModel.personelStockList()[$("#newproduct")[0].selectedIndex - 1].amount : "Sıfır");
});
dataModel.newtoobject.subscribe(function () {
    dataModel.isSatinalma(dataModel.user().userRole == 2);
    dataModel.getStockCards();
});
