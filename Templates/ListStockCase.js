
var dataModel = {
    user:ko.observable(),
    stockOnPersonel: ko.observable(),
    movementList: ko.observableArray([]),
    getPersonelStock: function (personelid) {
        var self = this;
        var data = {
            personelid: personelid,
        };
        crmAPI.getPersonelStock(data, function (a, b, c) {
            self.stockOnPersonel(a)
        }, null, null);
    },
    getUser: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.getPersonelStock(a.userId);
        }, null, null);
    },
    getStockCases: function () {
        var self = this;
        var data = {
            personelid: self.user() != null ? self.user().userId : null,
        };
        crmAPI.getStocksOnPersonel(data, function (a, b, c) {
            console.log(a);
            self.movementList(a);
        }, null, null);
    },
    renderBindings: function () {
        var self = this;
        self.getUser();
        self.getStockCases();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}