/// <reference path="crmwebapi.js" />



jQuery.fn.extend({
    loadTemplate: function (url, onload) {
        return this.load(url, function () {
            if (dataModel && dataModel.renderBindings) {
                ko.cleanNode("ModalContainer");
                dataModel.renderBindings();
            }
            if (onload) onload();
        });
    }
});



$(window).bind("hashchange", function () {
    document.location.reload();
}).load(function () {
    var tempPage = document.location.hash.replace("#", "").split("?")[0];
    $("#templateContainer").loadTemplate("Templates/" + (tempPage || "ListTaskqueue") + ".html");

    $("#newadslsatis").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/NewAdslSales.html");
    });
    $("#newccsales").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/CCSales.html");
    });
    $("#worklist").click(function () {
        $("#templateContainer").loadTemplate("Templates/Worklist.html");
    });
    

    //$("#fibersatis").click(function () {
    //    $("#ModalContainer").loadTemplate("Templates/New/FiberSales.html");
    //});
    //$("#yanindaekurun").click(function () {
    //    $("#ModalContainer").loadTemplate("Templates/New/YanindaEkUrun.html");
    //});
    //$("#retentionsatis").click(function () {
    //    $("#ModalContainer").loadTemplate("Templates/New/RetentionSatis.html");
    //});
    //$("#caymabedeli").click(function () {
    //    $("#ModalContainer").loadTemplate("Templates/New/Cayma.html");
    //});
    //$("#yonetimodasi").click(function () {
    //    $("#ModalContainer").loadTemplate("Templates/New/YonetimOdasi.html");
    //});
    //$("#arizataski").click(function () {
    //    $("#ModalContainer").loadTemplate("Templates/New/ArizaTaski.html");
    //});

    $("#exit").click(function () {
        document.cookie = "token=;";
        window.location.href = "Login.html";

    });

    $(document).ready(function () {
        crmAPI.userInfo(function (a, b, c) {
            $("#username").text(a.userFullName);
            if (a.userRole != 2147483647) {
                $("#tanimlamalar").hide(true);
                $("#musteriler").hide(true);
            }     
        }, null, null);
       
    });
});

