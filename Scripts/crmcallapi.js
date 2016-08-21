/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js" />
/// <reference path="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" />
/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js" />

var crmcallAPI = (function () {
    var getData = function (callType, path, sendData, onsuccess, onerror, before) {
        var baseURL = "http://crmapitest.kociletisim.com.tr/api/Adsl/";
        //var baseURL = "http://192.168.1.201/api/Adsl/"; // bu ip üzerinden yayın yapılacak sistem tamamlanınca
        //var baseURL = "http://192.168.1.94:50752/api/Adsl/";
        $.ajax({
            method: callType,
            url: baseURL + path,
            data: JSON.stringify(sendData),
            contentType: "application/json",
            async: true,
            beforeSend: function () {
                if (before) before();
            }
        }).success(function (data, status, xhr) {
            if (onsuccess) onsuccess(data);
        }).fail(function (xhr, status, error) {
            if (onerror)
                onerror(error);
        });
    }

    return {
        Callip: function (onsuccess, onerror, before) {
            getData("POST", "CallCenter/Callip", {}, onsuccess, onerror, before);
        },
        saveAdslSalesTask: function (data, onsuccess, onerror, before) {
            getData("POST", "CallCenter/saveAdslSalesTask", data, onsuccess, onerror, before)
        },
        getAdress: function (data, onsucces, onerror, before) {
            getData("POST", "CallCenter/getAdress", data, onsucces, onerror, before)
        },
        getCampaignInfo: function (data, onsuccess, onerror, before) {
            getData("POST", "CallCenter/getCampaignInfo", data, onsuccess, onerror, before)
        },
        getPersonel: function (onsuccess, onerror, before) {
            getData("POST", "CallCenter/getPersonel", {}, onsuccess, onerror, before)
        },
        confirmCustomer: function (data, onsuccess, onerror, before) {
            getData("POST", "CallCenter/confirmCustomer", data, onsuccess, onerror, before)
        },
    }
})();