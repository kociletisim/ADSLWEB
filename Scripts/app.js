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

var perId;

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
    
    $("#slrep").click(function () {
        window.location.href = 'http://crmapitest.kociletisim.com.tr/api/Adsl/Reports/SLBayiGet?BayiId=' + perId;
    });
    $("#gslrep").click(function () {
        window.location.href = 'http://crmapitest.kociletisim.com.tr/api/Adsl/Reports/GSLBayiGet?BayiId=' + perId;
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
        var pid = 0;
        crmAPI.userInfo(function (a, b, c) {
            pid = a.userId;
            $("#username").text(a.userFullName);
            var role = a.userRole;
            if (a.userRole != 2147483647) {
                $("#tanimlamalar").hide(true);
                $("#musteriler").hide(true);
                $("#kocslort").hide(true);
                var id = { BayiID: pid };
                crmAPI.BSLOrt(id, function (a, b, c) {
                    var ort = a;
                    $("#sl").text("SL'iniz = " + ort[0]);
                    $("#gsl").text("Geçen Ay SL'iniz = " + ort[1]);
                }, null, null);
            }
            else {
                $("#bayislort").hide(true);
                crmAPI.KSLOrt(function (a, b, c) {
                    $("#ksl").text("Koç SL = " + a[0]);
                    $("#kgsl").text("Geçen Ay Koç SL = " + a[1]);
                }, null, null);
            }
            var arr = a.userName.split('@');
            if (arr[1] == 'kociletisim.com.tr') {
                $("#newtask").show();
                $("#bayisldetay").hide();
            }
            else {
                $("#newtask").hide();
                $("#bayisldetay").show();
                perId = pid;
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
