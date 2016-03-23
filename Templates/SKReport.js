/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///
var dataModel = {
    report: ko.observableArray([]),

    getReport: function () {
        var self = this;
        var data = {
            start: '2015-11-17 12:36:52',
            end: '2015-11-28 15:37:52',
            //start: '2016-01-17 12:36:52',
            //end: '2016-01-28 15:37:52',
        };
        crmAPI.SKR(data, function (a, b, c) {
            self.report(a);
            //console.log(report);
        }, null, null);

    },
    renderBindings: function () {
        var self = this;
        //self.getReport();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}