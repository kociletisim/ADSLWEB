/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" />
/// <reference path="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" />
/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js" />

 var convertToObservable = function(object) {
     var t = {}, i;
     if (typeof object.valueOf() === "object") {
         for (i in object) {
             object.hasOwnProperty(i) && object[i] && (t[i] = object[i].toObservable());
         }
         return t;
     }
     return typeof object.valueOf() === "array" ? ko.observable([object.valueOf()]) : ko.observable(object.valueOf());
 }

 var crmAPI = (function () {
     var getCookie = function (cname) {
         var name = cname + "=";
         var ca = document.cookie.split(';');
         for (var i = 0; i < ca.length; i++) {
             var c = ca[i];
             while (c.charAt(0) == ' ') c = c.substring(1);
             if (c.indexOf(name) == 0) {
                 try{
                     return JSON.parse(c.substring(name.length, c.length));
                 }
                 catch(e){
                     return c.substring(name.length, c.length);
                 }
             }
         }
         return {};
     };

     var setCookie = function (key, keyvalue, value) {
         var cookieObj;
         try {
             cookieObj = JSON.parse(getCookie(key));
         } catch (e) {
             cookieObj = getCookie(key) || {}
         }
         if (value) cookieObj[keyvalue] = value;
         else cookieObj = keyvalue;
         document.cookie = key + "=" + JSON.stringify(cookieObj);
     };
    
     var getData = function (callType, path, sendData, onsuccess, onerror, before) {
         //var baseURL = "http://crmapitest.kociletisim.com.tr/api/Adsl/";
         var baseURL = "http://localhost:50752/api/Adsl/";
         $.ajax({
             method: callType,
             url: baseURL + path,
             data: JSON.stringify(sendData),
             contentType: "application/json",
             async: true,
             beforeSend: function (xhr) {
                 //Download progress
                 //$.mobile.loading('show');
               
                 if (sendData && sendData.username) {
                     xhr.setRequestHeader("X-KOC-UserName", sendData.username);
                     xhr.setRequestHeader("X-KOC-Pass", sendData.password);
                     xhr.setRequestHeader("X-KOC-UserType", sendData.userType);
                 } else {
                     var x = document.cookie;

                     var token = getCookie("token");
                     xhr.setRequestHeader("X-KOC-Token", token);
                 }

                 if (before) before();
             }
         }).success(function (data, status, xhr) {
             if (sendData && sendData.username) {
                 var token = xhr.getResponseHeader("X-KOC-Token"); // Cooki'ye yaz
                 document.cookie = "token=" + token;
                 if (!token)
                     alert("Kullanıcı Bilgileri Hatalı");
             } else {
                 if (data.loginError)
                     window.location.href = "Login.html"; // hata var token geçersiz ,login sayfasına yönlendir. Ama önce süreli bir ekranda hata görünsün.
                 //document.location.href = document.location.host;
             }
             if (onsuccess) onsuccess(data);
         }).fail(function (xhr, status, error) {
             if (onerror)
                 onerror(error);
         });
     }

     return {
         getCookie: function (key) { return getCookie(key); },
         setCookie: function (key, keyvalue, value) { setCookie(key, keyvalue, value); },
         login: function (data, onsuccess, onerror, before) {
             getData("POST", "Authorize/getToken", data, onsuccess, onerror, before);
         },
         userInfo: function (onsuccess, onerror, before) {
             getData("POST", "Authorize/getUserInfo", {}, onsuccess, onerror, before);
         },
         getTaskFilter: function (data, onsuccess, onerror, before) {
             getData("POST", "Filter/getTasks", data, onsuccess, onerror, before);
         },
         saveTask: function (data, onsuccess, onerror, before) {
             getData("POST", "Task/saveTask", data, onsuccess, onerror, before);
         },
         insertTask: function (data, onsuccess, onerror, before) {
             getData("POST", "Task/insertTask", data, onsuccess, onerror, before);
         },
         getTSPFilter: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskStatePool/getTaskState", data, onsuccess, onerror, before);
         },
         saveTaskState: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskStatePool/saveTaskState", data, onsuccess, onerror, before);
         },
         insertTaskState: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskStatePool/insertTaskState", data, onsuccess, onerror, before);
         },
         getTaskStateMatches: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskStateMatches/getTaskStateMatches", data, onsuccess, onerror, before);
         },
         saveTaskStateMatches: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskStateMatches/saveTaskStateMatches", data, onsuccess, onerror, before);
         },
         insertTaskStateMatches: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskStateMatches/insertTaskStateMatches", data, onsuccess, onerror, before);
         },
         getDocuments: function (data, onsuccess, onerror, before) {
             getData("POST", "Document/getDocuments", data, onsuccess, onerror, before);
         },
         saveDocument: function (data, onsuccess, onerror, before) {
             getData("Document", "Task/saveDocument", data, onsuccess, onerror, before);
         },
         insertDocument: function (data, onsuccess, onerror, before) {
             getData("POST", "Document/insertDocument", data, onsuccess, onerror, before);
         },
         getCampaigns: function (data, onsuccess, onerror, before) {
             getData("POST", "Campaign/getCampaigns", data, onsuccess, onerror, before);
         },
         saveCampaigns: function (data, onsuccess, onerror, before) {
             getData("POST", "Campaign/saveCampaigns", data, onsuccess, onerror, before);
         },
         insertCampaigns: function (data, onsuccess, onerror, before) {
             getData("POST", "Campaign/insertCampaigns", data, onsuccess, onerror, before);
         },
         getSiteFilter: function (data, onsuccess, onerror, before) {
             getData("POST", "Filter/getCSB", data, onsuccess, onerror, before)
         },
         getCustomerStatus: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getCustomerStatus", null, onsuccess, onerror, before)
         },
         getIssStatus: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getIssStatus", {}, onsuccess, onerror, before)
         },
         getNetStatus: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getNetStatus", {}, onsuccess, onerror, before)
         },
         getTelStatus: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getTelStatus", {}, onsuccess, onerror, before)
         },
         getTvKullanımıStatus: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getTvKullanımıStatus", {}, onsuccess, onerror, before)
         },
         getTurkcellTvStatus: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getTurkcellTvStatus", {}, onsuccess, onerror, before)
         },
         getGsmStatus: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getGsmStatus", {}, onsuccess, onerror, before)
         },
         getTaskStatus: function (data, onsuccess, onerror, before) {
             getData("POST", "Filter/getTasks", data, onsuccess, onerror, before)
         },
         getPersonel: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getPersonel", {}, onsuccess, onerror, before)
         },
         getAttacheablePersonel: function (data, onsuccess, onerror, before) {
             getData("POST", "Filter/getAttacheablePersonel", data, onsuccess, onerror, before)
         },
         getProductList: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getProductList", {}, onsuccess, onerror, before)
         },
         getTaskQueues: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/getTaskQueues", data, onsuccess, onerror, before)
         },
         closeTaskQueues: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/closeTaskQueues", data, onsuccess, onerror, before)
         },
         saveTaskQueues: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/saveTaskQueues", data, onsuccess, onerror, before)
         },
         download: function ( onsuccess, onerror, before) {
             getData("POST", "TaskQueues/download", onsuccess, onerror, before)
         },
         saveAdslSalesTask: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/saveAdslSalesTask", data, onsuccess, onerror, before)
         },
         insertTaskqueue: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/insertTaskqueue", data, onsuccess, onerror, before)
         },
         confirmCustomer: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/confirmCustomer", data, onsuccess, onerror, before)
         },
         saveFaultTask: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/saveFaultTask", data, onsuccess, onerror, before)
         },
         personelattachment: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/personelattachment", data, onsuccess, onerror, before)
         },
         getTQStockMovements: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/getTQStockMovements", data, onsuccess, onerror, before)
         },
         getTQDocuments: function (data, onsuccess, onerror, before) {
             getData("POST", "TaskQueues/getTQDocuments", data, onsuccess, onerror, before)
         },
         getCampaignInfo: function (data, onsuccess, onerror, before) {
             getData("POST", "Filter/getCampaignInfo", data, onsuccess, onerror, before)
         },
         getBlockList: function (data, onsucces, onerror, before) {
             getData("POST", "SiteBlock/getBlocks", data, onsucces, onerror, before)
         },
         editBlock: function (data, onsucces, onerror, before) {
             getData("POST", "SiteBlock/editBlock", data, onsucces, onerror, before)
         },
         getSiteList: function (data, onsucces, onerror, before) {
             getData("POST", "SiteBlock/getSites", data, onsucces, onerror, before)
         },
         editSite: function (data, onsuccess, onerror, before) {
             getData("POST", "SiteBlock/editSite", data, onsuccess, onerror, before)
         },
         getTaskDefination: function (data, onsucces, onerror, before) {
             getData("POST", "Task/getTaskList", data, onsucces, onerror, before)
         },
         getObjectType: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getObjectType", {}, onsuccess, onerror, before)
         },
         getTaskType: function (onsuccess, onerror, before) {
             getData("POST", "Filter/getTaskType", {}, onsuccess, onerror, before)
         },
         getObject: function (data, onsuccess, onerror, before) {
             getData("POST", "Filter/getObject", data, onsuccess, onerror, before)
         },
         getStockMovements: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/getStockMovements", data, onsucces, onerror, before)
         },
         SaveStockMovementMultiple: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/SaveStockMovementMultiple", data, onsucces, onerror, before)
         },
         InsertStockMovement: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/InsertStockMovement", data, onsucces, onerror, before)
         },
         confirmSM: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/confirmSM", data, onsucces, onerror, before)
         },
         getAdress: function (data, onsucces, onerror, before) {
             getData("POST", "Address/getAdress", data, onsucces, onerror, before)
         },
         getProducts: function (data, onsucces, onerror, before) {
             getData("POST", "Product/getProducts", data, onsucces, onerror, before)
         },
         saveProduct: function (data, onsucces, onerror, before) {
             getData("POST", "Product/saveProduct", data, onsucces, onerror, before)
         },
         insertProduct: function (data, onsucces, onerror, before) {
             getData("POST", "Product/insertProduct", data, onsucces, onerror, before)
         },
         getPersonels: function (data, onsucces, onerror, before) {
             getData("POST", "Personel/getPersonels", data, onsucces, onerror, before)
         },
         savePersonel: function (data, onsucces, onerror, before) {
             getData("POST", "Personel/savePersonel", data, onsucces, onerror, before)
         },
         insertPersonel: function (data, onsucces, onerror, before) {
             getData("POST", "Personel/insertPersonel", data, onsucces, onerror, before)
         },
         getStockCards: function (data, onsucces, onerror, before) {
             getData("POST", "StockCard/getStockCards", data, onsucces, onerror, before)
         },
         saveStockCard: function (data, onsucces, onerror, before) {
             getData("POST", "StockCard/saveStockCard", data, onsucces, onerror, before)
         },
         insertStockCard: function (data, onsucces, onerror, before) {
             getData("POST", "StockCard/insertStockCard", data, onsucces, onerror, before)
         },
         getPersonelStock: function (data, onsucces, onerror, before) {
             getData("POST", "Filter/getPersonelStock", data, onsucces, onerror, before)
         },
         getSerialsOnPersonel: function (data, onsucces, onerror, before) {
             getData("POST", "Filter/getSerialsOnPersonel", data, onsucces, onerror, before)
         },
         getDocumentIds: function (data, onsucces, onerror, before) {
             getData("POST", "Document/getDocumentIds", data, onsucces, onerror, before)
         },
         getCustomer: function (data, onsucces, onerror, before) {
             getData("POST", "Customer/getCustomer", data, onsucces, onerror, before)
         },
         saveCustomerCard: function (data, onsuccess, onerror, before) {
             getData("POST", "Customer/saveCustomerCard", data, onsuccess, onerror, before)
         },
         getPersonelWorkList: function (data, onsuccess, onerror, before) {
             getData("POST", "Reports/getPersonelWorks", data, onsuccess, onerror, before)
         },
         SKR: function (data, onsuccess, onerror, before) {
             getData("POST", "Reports/SKR", data, onsuccess, onerror, before)
         },
         Taskqueues: function (data, onsuccess, onerror, before) {
             getData("POST", "Reports/Taskqueues", data, onsuccess, onerror, before)
         },
         getTaskPersonelAtama: function (data, onsuccess, onerror, before) {
             getData("POST", "Atama/getTaskPersonelAtama", data, onsuccess, onerror, before)
         },
         insertPersonelAtama: function (data, onsuccess, onerror, before) {
             getData("POST", "Atama/insertPersonelAtama", data, onsuccess, onerror, before)
         },
         updatePersonelAtama: function (data, onsuccess, onerror, before) {
             getData("POST", "Atama/updatePersonelAtama", data, onsuccess, onerror, before)
         },
         deletePersonelAtama: function (data, onsuccess, onerror, before) {
             getData("POST", "Atama/deletePersonelAtama", data, onsuccess, onerror, before)
         },
         getSL: function (data, onsuccess, onerror, before) {
             getData("POST", "SL/getSL", data, onsuccess, onerror, before)
         },
         insertSL: function (data, onsuccess, onerror, before) {
             getData("POST", "SL/insertSL", data, onsuccess, onerror, before)
         },
         updateSL: function (data, onsuccess, onerror, before) {
             getData("POST", "SL/updateSL", data, onsuccess, onerror, before)
         },
         BSLOrt: function (data, onsuccess, onerror, before) {
             getData("POST", "Reports/BSLOrt", data, onsuccess, onerror, before)
         },
         KSLOrt: function (onsuccess, onerror, before) {
             getData("POST", "Reports/KSLOrt", {} ,onsuccess, onerror, before)
         },
         InsertStock: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/InsertStock", data, onsucces, onerror, before)
         },
         getStock: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/getStock", data, onsucces, onerror, before)
         },
         getSerialOnCustomer: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/getSerialOnCustomer", data, onsucces, onerror, before)
         },
         getSerialOnPersonel: function (data, onsucces, onerror, before) {
             getData("POST", "Stock/getSerialOnPersonel", data, onsucces, onerror, before)
         },
         insertCustomer: function (data, onsucces, onerror, before) {
             getData("POST", "Customer/insertCustomer", data, onsucces, onerror, before)
         },
     }
 })();