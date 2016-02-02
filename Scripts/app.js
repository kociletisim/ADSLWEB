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
    $("#newtask").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/Task.html");
    });
    $("#worklist").click(function () {
        $("#templateContainer").loadTemplate("Templates/Worklist.html");
    });
    $("#newcorporatesales").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/NewCorporateSales.html");
    });
    
    $("#username,#notice").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/Profil.html");
    });


    $("#exit").click(function () {
        document.cookie = "token=;";
        crmAPI.setCookie("tqlFilter", "");
        window.location.href = "Login.html";

    });

    $(document).ready(function () {
        crmAPI.userInfo(function (a, b, c) {
             var pid = a.userId;
            $("#username").text(a.userFullName);
            if (a.userRole != 2147483647) {
                $("#tanimlamalar").hide(true);
                $("#musteriler").hide(true);
            }
            var data = {
                personel: { fieldName: 'personelid', op: 2, value: pid },
            };
            crmAPI.getPersonels(data, function (a, b, c) {
                var pass = a.data.rows[0].password;
                if (pass == "123456") {
                    $("#notice").text("Güvenliğiniz için Şifrenizi değiştiriniz!");
                }
            }, null, null);
        }, null, null);
       
    });
});

