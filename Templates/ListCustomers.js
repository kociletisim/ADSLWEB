
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    // filtreleme start
    custid: ko.observable(),
    custname: ko.observable(),
    tc: ko.observable(),
    gsm: ko.observable(),
    smno: ko.observable(), // süperonline müşteri no 

    // filtreleme finish

    customerList: ko.observableArray([]),
    selectedCustomer: ko.observable(),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray(),
    selectedIl: ko.observable(),
    selectedIlce: ko.observable(),
    selectil: ko.observable(),
    selectilce: ko.observable(),

    user: ko.observable(),
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            if (!self.user() || self.user().userRole != 2147483647)
                window.location.href = "app.html";
        }, null, null)
    },
    getFilter: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            customer: self.custname() ? { fieldName: 'customername', op: 6, value: self.custname() } : { fieldName: 'customername', op: 6, value: '' },
        };
        crmAPI.getCustomer(data, function (a, b, c) {
            self.customerList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getCustomerCard($(this).val());
            });
        }, null, null);
    },
    getCustomerCard: function (customerid) {
        var self = this;
        var data = {
            customer: { fieldName: 'customerid', op: 2, value: customerid },
        };
        crmAPI.getCustomer(data, function (a, b, c) {
            self.selectedCustomer(a.data.rows[0]);
            self.getIl();
            self.getIlce(a.data.rows[0].ilKimlikNo);
            $("#yonetici2,#kurulumbayi2").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Satır Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    saveCustomer: function () {
        var self = this;
        var data = self.selectedCustomer();
        crmAPI.saveCustomerCard(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value: "" },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);
            $("#editil,#newil,#sorguil").multiselect({
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
            $("#editil,#newil").multiselect("setOptions", self.ilList()).multiselect("rebuild");
        }, null, null)
    },
    getIlce: function (x) {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op: x ? 2 : 6, value: x ? x : '' },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilceList(a);
            $("#editilce,#newilce,#sorguilce").multiselect({
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
            $("#editilce,#newilce").multiselect("setOptions", self.ilceList()).multiselect("rebuild");
        }, null, null)
    },

    clean: function () {
        var self = this;
        self.selectil(null);
        self.selectilce(null);
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
        }
        return true;
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
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
        self.getUserInfo();
        //self.getIl();
        //self.getIlce();
        //self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}
