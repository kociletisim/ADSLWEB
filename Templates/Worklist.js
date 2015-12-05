
var dataModel = {

   
    workList: ko.observableArray([]),
    user: ko.observable(),
    getPersonelWork: function () {
        var self = this;
        var data = {
            personelid:self.user().userId,
        };
        crmAPI.getPersonelWorkList(data, function (a, b, c) {
            self.workList(a);
            if(self.workList().length==0)
            {
                alert("Üzerinize ait bir iş emri bulunmamaktadır.")
                    window.location.href = "app.html";
            }
        }, null, null);
    },
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.getPersonelWork();
        }, null, null)
    },

    printWorkList:function()
    {
        var divToPrint = document.getElementById("worklisttable");
        newWin= window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}