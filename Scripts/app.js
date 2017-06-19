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
    $("#newtask").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/Task.html");
    });
    $("#mid").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/ModemChangeReturn.html");
    });
    $("#akillinkt").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/InfoTask.html");
    });
    $("#worklist").click(function () {
        $("#templateContainer").loadTemplate("Templates/Worklist.html");
    });
    $("#newcorporatesales").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/NewCorporateSales.html");
    });
    
    $("#slrep").click(function () {
        window.location.href = 'http://crmapitest.kociletisim.com.tr/api/Adsl/Reports/SLBayiGet?BayiId=' + perId;
        //window.location.href = 'http://localhost:50752/api/Adsl/Reports/SLBayiGet?BayiId=' + perId;
    });
    $("#gslrep").click(function () {
        window.location.href = 'http://crmapitest.kociletisim.com.tr/api/Adsl/Reports/GSLBayiGet?BayiId=' + perId;
        //window.location.href = 'http://localhost:50752/api/Adsl/Reports/GSLBayiGet?BayiId=' + perId;
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
            perId = pid;
            $("#username").text(a.userFullName);
            var role = a.userRole;
            if (a.userRole != 2147483647) {
                $("#tanimlamalar").hide(true);
                $("#musteriler").hide(true);
                $("#kocslort").hide(true);
                $("#bayisldetay").show();
                var id = { BayiID: pid };
                crmAPI.BSLOrt(id, function (a, b, c) {
                    var ort = a;
                    $("#sl").text("SL'iniz = " + ort[0]);
                    $("#gsl").text("Geçen Ay SL'iniz = " + ort[1]);
                }, null, null);
            }
            else {
                $("#bayislort").hide(true);
                $("#bayisldetay").hide();
                crmAPI.KSLOrt(function (a, b, c) {
                    $("#ksl").text("Koç SL = " + a[0]);
                    $("#kgsl").text("Geçen Ay Koç SL = " + a[1]);
                }, null, null);
            }
            console.log(a.userRole);
            console.log("Rol " + (a.userRole & 256));
            if ((a.userRole & 256) == 256 && a.userRole != 2147483647) {
                console.log("sdsd");
                // Akıllı Nokta girişinde sadece kendi taskı açılacak
                $("#tanimlamalar").hide(true);
                $("#musteriler").hide(true);
                $("#kocslort").hide(true);
                $("#bayisldetay").hide(true);
                $("#stkhrk").hide(true);
                $("#newadslsatis").hide(true);
                $("#newcorporatesales").hide(true);
                $("#newtask").hide(true);
                $("#mid").hide(true);
                $("#apk").hide(true);
                $("#akillinkt").show();
            }
            else { $("#akillinkt").hide(true) };
            //var arr = a.userName.split('@');
            //if (arr[1] == 'kociletisim.com.tr') {
            //    $("#newtask").show();
            //}
            //else {
            //    $("#newtask").hide();
            //}
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
