/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///
var dataModel = {
    report: ko.observableArray([]),
    tqs: ko.observableArray([]),
    startDate: ko.observable(),
    endDate: ko.observable(),

    clean: function () {
        var self = this;
        self.startDate(null);
        self.endDate(null);
        self.getReport();
    },
    getReport: function () {
        var self = this;
        var data = {
            start: self.startDate() ? self.startDate() : '2012-01-01',
            end: self.endDate() ? self.endDate() : '2025-01-01',
        };
        crmAPI.SKR(data, function (a, b, c) {
            self.report(a);
        }, null, null);
    },
    getTQ: function () {
        var self = this;
        var data = {
            start: '2015-11-10 12:36:52',
            end: '2016-3-22 15:37:52',
        };
        crmAPI.Taskqueues(data, function (a, b, c) {
            self.tqs(a);
        }, null, null);
    },
    renderBindings: function () {
        var self = this;
        $('#daterangepicker1,#daterangepicker2').daterangepicker({
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
}

dataModel.endDate.subscribe(function (v) {
    if (dataModel.endDate() < dataModel.startDate())
    {
        alert("Tarih Aralığı Seçimini Yanlış Ayarladınız. Lütfen Tekrar Giriniz !");
        dataModel.endDate(null);
        dataModel.startDate(null);
    }
});
dataModel.startDate.subscribe(function (v) {
    if (dataModel.endDate() < dataModel.startDate()) {
        alert("Tarih Aralığı Seçimini Yanlış Ayarladınız. Lütfen Tekrar Giriniz !");
        dataModel.endDate(null);
        dataModel.startDate(null);
    }
});
