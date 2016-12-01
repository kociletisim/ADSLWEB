/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />

var tqlFilter = crmAPI.getCookie("tqlFilter");

var dataModel = {
    multiSelectTagIds: "#blokadi,#taskNameFilter,#servissaglayici,#abonedurumu,#personel,#taskdurumu",
    lastStatusList: ko.observableArray([{ id: null, name: "Süreç Durumu Seçiniz" }, { id: 0, name: "Bekleyen" }, { id: 1, name: "Tamamlanan" }, { id: 2, name: "İptal Edilen" }, { id: 3, name: "Ertelenen" }]),
    rankingList: ko.observableArray([{ id: "taskorderno", name: "Oluşma Tarihi" }, { id: "lastupdated", name: "Son Güncelleme Tarihi" }, { id: "attachmentdate", name: "Atanma Tarihi" }]),
    selectedRanking: ko.observable(),
    lastStatus: ko.observable(),
    typeHeadTagIds: "#site",
    flag: ko.observable(),
    firstLoad: ko.observable(),
    pageCount: ko.observable(),
    pageNo: ko.observable(tqlFilter.pageNo || 1),
    rowsPerPage: ko.observable(tqlFilter.rowsPerPage || 20),
    querytime: ko.observable(0),
    errormessage: ko.observable(),
    errorcode: ko.observable(),
    isLoading: ko.observable(),
    selectedTaskname: ko.observableArray([]),
    selectedtaskorderno: ko.observableArray([]),
    selectedTaskRole: ko.observable(),
    customername: ko.observable(tqlFilter.customer && tqlFilter.customer.value),
    custid: ko.observable(),
    superonlineNo: ko.observable(),
    customerstatus: ko.observable(),
    selectedIss: ko.observable(),
    selectedPersonelname: ko.observable(),
    selectedAttachmentPersonelid: ko.observable(),
    attachmentDate: ko.observable(),
    appointmentDate: ko.observable(),
    consummationDate: ko.observable(),
    selectedTaskstatus: ko.observable(),
    defaultstatus: ko.observableArray(['0', '9159', '9165']),
    selectedCustomerstatus: ko.observable(),
    description: ko.observable(),
    tasks: ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    isslist: ko.observableArray([]),
    taskstatuslist: ko.observableArray([]),
    taskstatuslistforcollective: ko.observableArray([{ taskstateid: -1, taskstate: "Bekleyiniz" }]),
    personellist: ko.observableArray([]),
    personellist: ko.observableArray([]),
    attacheablePersonelList: ko.observableArray([]),
    attachedobjectid: ko.observable(),
    sureclist: ko.observableArray([]),
    taskqueuelist: ko.observableArray([]),
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),
    il: ko.observable(tqlFilter.il && tqlFilter.il.value),
    ilce: ko.observable(tqlFilter.ilce && tqlFilter.ilce.value),
    ilKimlik: ko.observable(),
    ilceKimlik: ko.observable(),
    regionKimlik: ko.observable(),
    mahalleKimlik: ko.observable(),
    isSelection: ko.observable(false), // müşteri adres bilgileri doldurulma işlemi sağlıklı olabilmesi için oluşturuldu
    ilList: ko.observableArray(),
    ilceList: ko.observableArray(),
    bucakList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    selectedCustomer: ko.observable(),
    user: ko.observable(),
    perOfBayiOrKoc: ko.observable(false), // Sayfada işlem yapan personel bayi mi yoksa şirket personeli mi ? false : bayi --  true : koc personeli
    BayiOrKoc: function () {
        var self = this;
        if (self.user() != null || self.user() != "") {
            var arr = self.user().userName.split('@');
            if (arr[1] == 'kociletisim.com.tr')
                self.perOfBayiOrKoc(true);
            else
                self.perOfBayiOrKoc(false);
        }
    },
    readyCollectiveList: ko.observableArray([]), // toplu sonlandırılacaklar listesi

    queryButtonClick: function () {
        var self = this;
        self.getFilter(1, self.rowsPerPage());
    },
    getTasks: function () {
        var self = this;
        var data = {
            task: { fieldName: "taskname", op: 6, value: "" },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.tasks(a);
            var select = [];
            for (var i = 0; i < self.tasks().length; i++) {
                if (self.tasks()[i].taskid != 43)
                    select.push(self.tasks()[i].taskid);
            }
            $("#taskNameFilter").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Adını Seçiniz',
                nSelectedText: 'Task Adı Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#taskNameFilter").multiselect('select', select);
        }, null, null);

    },
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus(function (a, b, c) {
            self.ctstatuslist(a);
            $("#abonedurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Abone Durumunu Seçiniz',
                nSelectedText: 'Abone Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getisslist: function () {
        var self = this;
        crmAPI.getIssStatus(function (a, b, c) {
            self.isslist(a);
            $("#servissaglayici").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'ISS Seçiniz',
                nSelectedText: 'ISS Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    gettaskstatus: function () {
        var self = this;
        var data = {
            taskstate: { fieldName: "taskstate", op: 6, value: "" },
        };
        crmAPI.getTaskStatus(data, function (a, b, c) {
            self.taskstatuslist(a);
            //self.defaultstatus('0');
            $("#taskdurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Durumunu Seçiniz',
                nSelectedText: 'Task Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#taskdurumu").multiselect('select', ['0', '9159', '9165']);
            $("#laststate").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Süreç Durumunu Seçiniz',
                nSelectedText: 'Süreç Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#ranking").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Süreç Durumunu Seçiniz',
                nSelectedText: 'Süreç Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            }).multiselect('rebuild');
        }, null, null)
    },
    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#personel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Personel Seçiniz',
                nSelectedText: 'Personel Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getAttachablePersonelList: function () {
        var self = this;
        var data = {
            taskorderno: parseInt(self.selectedtaskorderno()[0]),
        };
        crmAPI.getAttacheablePersonel(data, function (a, b, c) {
            self.attacheablePersonelList(a);
            $('#personelatamacombo').multiselect('select', self.attacheablePersonelList()).multiselect('rebuild');
        }, null, null);

    },
    attacheablecontrol: function () {
        var self = this;
        var data = {
            ids: self.selectedtaskorderno(),
            personelid: self.selectedAttachmentPersonelid(),
        };
        crmAPI.personelattachment(data, function (a, b, c) {
            self.errormessage(a.errorMessage);
            self.errorcode(a.errorCode);
            if (a.errorCode != 0)
                window.setTimeout(function () {
                    $('#personelata').modal('hide');
                    self.getFilter(1, dataModel.rowsPerPage());
                }, 1000);
            self.getAttachablePersonelList();

        }, null, null);
    },
    attachmentpersonel: function () {
        var self = this;
        var data = {
            ids: self.selectedtaskorderno(),
            personelid: self.selectedAttachmentPersonelid(),
        };
        crmAPI.personelattachment(data, function (a, b, c) {
            self.errormessage(a.errorMessage);
            self.errorcode(a.errorCode);
            self.flag(true);
            window.setTimeout(function () {
                $('#personelata').modal('hide');
                self.getFilter(1, dataModel.rowsPerPage());
            }, 1000);
            self.selectedAttachmentPersonelid(null);
            $("#personelatamacombo").multiselect('deselect', dataModel.selectedAttachmentPersonelid());
            $("#personelatamacombo").multiselect('refresh');
        }, null, null);
    },
    getCustomerCard: function (customerid) {
        var self = this;
        var data = {
            customername: { fieldName: 'customerid', op: 2, value: customerid },
        };
        crmAPI.getCustomer(data, function (a, b, c) {
            self.selectedCustomer(a.data.rows[0]);
            self.ilKimlik(a.data.rows[0].ilKimlikNo);
            if (a.data.rows[0].ilKimlikNo != null)
                self.getIlce();
            else
                self.isSelection(true);
            self.ilceKimlik(a.data.rows[0].ilKimlikNo && a.data.rows[0].ilceKimlikNo);
            if (self.ilceKimlik() != null)
                self.getBucak();
            self.regionKimlik(self.ilceKimlik() && a.data.rows[0].bucakKimlikNo);
            if (self.regionKimlik() != null)
                self.getMahalle();
            self.mahalleKimlik(self.regionKimlik() && a.data.rows[0].mahalleKimlikNo);
            $("#ilcombo").multiselect({
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    saveCustomer: function () {
        var self = this;
        self.selectedCustomer().ilKimlikNo = self.ilKimlik();
        self.selectedCustomer().ilceKimlikNo = self.ilceKimlik();
        self.selectedCustomer().superonlineCustNo = $.trim(self.selectedCustomer().superonlineCustNo);
        self.selectedCustomer().bucakKimlikNo = $("#bucakcombo").val() ? $("#bucakcombo").val() : null;
        self.selectedCustomer().mahalleKimlikNo = $("#mahallecombo").val() ? $("#mahallecombo").val() : null;
        var data = self.selectedCustomer();
        crmAPI.saveCustomerCard(data, function (a, b, c) {
            if (a == "ok") {
                window.setTimeout(function () {
                    $('#customerinfo').modal('hide');
                    self.getFilter(1, dataModel.rowsPerPage());
                }, 2000);
            }
        }, null, null);
    },
    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value: "" },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);
            $("#ilcombo").multiselect("setOptions", self.ilList()).multiselect("rebuild");
        }, null, null)
    },
    getIlce: function () {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op: 2, value: self.ilKimlik() },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilceList(a);
            $("#ilcecombo").multiselect({
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#ilcecombo").multiselect("setOptions", self.ilceList()).multiselect("rebuild");
            if (self.ilceKimlik() != null)
                $("#ilcecombo").multiselect('select', self.ilceKimlik());
            else
                self.isSelection(true);
            $("#ilcecombo").multiselect("refresh");
        }, null, null)
    },
    ilceChanged: function () {
        dataModel.ilceKimlik($("#ilcecombo").val());
        return true;
    },
    getBucak: function () {
        self = this;
        var data = {
            adres: { fieldName: "ilceKimlikNo", op: 2, value: self.ilceKimlik() },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.bucakList(a);
            $("#bucakcombo").multiselect({
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#bucakcombo").multiselect("setOptions", self.bucakList()).multiselect("rebuild");
            if (self.regionKimlik() != null)
                $("#bucakcombo").multiselect('select', self.regionKimlik());
            else
                self.isSelection(true);
            $("#bucakcombo").multiselect("refresh");
        }, null, null)
    },
    regionChanged: function () {
        dataModel.regionKimlik($("#bucakcombo").val());
        return true;
    },
    getMahalle: function () {
        self = this;
        var data = {
            adres: { fieldName: "bucakKimlikNo", op: 2, value: self.regionKimlik() },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.mahalleList(a);
            $("#mahallecombo").multiselect({
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#mahallecombo").multiselect("setOptions", self.mahalleList()).multiselect("rebuild");
            if (self.mahalleKimlik() != null)
                $("#mahallecombo").multiselect('select', self.mahalleKimlik());
            self.isSelection(true);
            $("#mahallecombo").multiselect("refresh");
        }, null, null)
    },
    mahalleChanged: function () {
        dataModel.mahalleKimlik($("#mahallecombo").val());
        return true;
    },
    clean: function () {
        var self = this;
        self.pageNo(1);
        self.rowsPerPage(20);
        self.appointmentDate(null);
        self.il(null);
        self.lastStatus(null);
        self.custid(null),
        self.ilce(null);
        self.attachmentDate(null);
        self.customername(null);
        self.superonlineNo(null);
        self.consummationDate(null);
        self.selectedCustomerstatus(null);
        self.selectedRanking("taskorderno");
        $("#taskNameFilter,#abonedurumu,#servissaglayici,#taskdurumu,#personel,#personelatamacombo").multiselect('deselectAll', false);
        $("#taskNameFilter,#abonedurumu,#servissaglayici,#ranking,#taskdurumu,#laststate,#personel,#personelatamacombo").multiselect('refresh');
        self.selectedPersonelname(null);
        self.selectedIss(null);
        self.selectedTaskname('');
        self.selectedTaskstatus('');
        self.getFilter(self.pageNo(), self.rowsPerPage());
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getFilter(1, self.rowsPerPage());
        }
        return true;
    },
    getFilter: function (pageno, rowsperpage) {
        var self = this;
        self.errormessage(null);
        self.errorcode(null);
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.isLoading(true);
        self.flag(null);
        self.customername($.trim(self.customername()));
        self.superonlineNo($.trim(self.superonlineNo()));
        self.il($.trim(self.il()));
        self.ilce($.trim(self.ilce()));
        self.selectedAttachmentPersonelid(null);
        self.selectedTaskname($("#taskNameFilter").val() ? $("#taskNameFilter").val() : '');
        self.selectedTaskstatus($("#taskdurumu").val() ? $("#taskdurumu").val() : null);
        self.selectedPersonelname($("#personel").val() ? $("#personel").val() : '');
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            il: self.il() ? { fieldName: "ad", op: 6, value: self.il() } : null,
            ilce: self.ilce() ? { fieldName: "ad", op: 6, value: self.ilce() } : null,
            customer: self.custid() ? { fieldName: "customerid", op: 2, value: self.custid() } : self.customername() ? { fieldName: "customername", op: 6, value: self.customername() } : null,
            superonline: self.superonlineNo() ? { fieldName: 'superonlineCustNo', op: 2, value: self.superonlineNo() } : null,
            task: self.selectedTaskname().length > 0 ? { fieldName: "taskid", op: 7, value: self.selectedTaskname() } : null,
            personel: self.selectedPersonelname().length > 0 ? (self.selectedPersonelname() == "0" ? { fieldName: "personelname", op: 8, value: null } : { fieldName: "personelid", op: 7, value: self.selectedPersonelname() }) : null,
            taskstate: self.selectedTaskstatus() ? (self.selectedTaskstatus() == '0' ? { fieldName: "taskstate", op: 8, value: null } : { fieldName: "taskstateid", op: 7, value: self.selectedTaskstatus() }) : (self.firstLoad() == true ? { fieldName: "taskstateid", op: 7, value: self.defaultstatus() } : null),
            iss: self.selectedIss() ? { fieldName: "issText", op: 6, value: self.selectedIss() } : null,
            customerstatus: self.selectedCustomerstatus() ? { fieldName: "Text", op: 6, value: self.selectedCustomerstatus() } : null,
            attachmentDate: self.attachmentDate() ? self.attachmentDate() : null,
            appointmentDate: self.appointmentDate() ? self.appointmentDate() : null,
            consummationDate: self.consummationDate() ? self.consummationDate() : null,
            laststatus: self.lastStatus(),
            ranking: self.selectedRanking(), // task listesinin sıralanması için database'deki alan isimlerini yaz
        };

        crmAPI.setCookie("tqlFilter", data);
        crmAPI.getTaskQueues(data, function (a, b, c) {
            var list = a.data.rows;
            self.pageCount(a.data.pagingInfo.pageCount);
            self.querytime(a.performance.TotalResponseDuration);
            for (var i = 0; i < list.length; i++) {
                if (list[i].description && list[i].description.length > 50)
                    list[i].desc = list[i].description.substring(0, 50) + "....";
                else
                    list[i].desc = list[i].description;
            }  // taskqueuelist açıklamanın bir kısmını göster üzerine gelince tamamı görünsün (Hüseyin KOZ) 29.10.2016
            self.taskqueuelist(list);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.isLoading(false);
            self.errormessage(null);
            self.errorcode(null);
            self.firstLoad(false);
            //self.defaultstatus(0);
            $('.sel').change(function () {
                var ids = [];
                $('.sel').each(function () {
                    if ($(this).is(':checked')) {
                        var id = $(this).val();
                        ids.push(id);
                    }
                });
                self.selectedtaskorderno(ids);
            });
            $('.satir').click(function () {
                var checkedids = [];
                var id = $(this).index();
                if ($(".sel")[id - 1].checked != true) {
                    $(".sel")[id - 1].checked = true;
                    $(".sel").change();
                    checkedids.push(id);
                }
                else {
                    $(".sel")[id - 1].checked = false;
                    $(".sel").change();
                }
            });
            $(".customer").click(function () {
                self.getCustomerCard($(this).val());
            });
        }, null, null);
    },
    select: function (d, e) {
        var self = this;
        $("#taskquetable tr").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        self.selectedtaskorderno(d.taskorderno);

    },
    redirect: function () {
        window.location.href = "app.html";
    },
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.BayiOrKoc();
        }, null, null)
    },
    ara: function (custid) {
        var self = this;
        var data = {
            pageNo: 1,
            rowsPerPage: 100,
            customer: { fieldName: 'customerid', op: 2, value: custid },
        };
        crmAPI.getTaskqueuesForBayi(data, function (a, b, c) {
            self.sureclist(a.data.rows);
        }, null, null);
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo === dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
            dataModel.isLoading(false);
        },
        gotoFirstPage: function () {
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage: function () {
            dataModel.navigate.gotoPage(dataModel.pageCount());
        },
        gotoNextPage: function () {
            var pc = dataModel.pageNo() + 1;
            if (pc >= dataModel.pageCount()) return;
            dataModel.navigate.gotoPage(pc);
        },
        gotoBackPage: function () {
            var pc = dataModel.pageNo() - 1;
            if (pc <= 0) return;
            dataModel.navigate.gotoPage(pc);
        },
    },
    setOptionDisable: function (option, item) {
        if (dataModel.taskstatuslistforcollective().length > 0 && item != null && item != undefined) {
            ko.applyBindingsToNode(option, { disable: item.disable }, item);
        }
    },
    gettaskstatusForCollective: function (taskid) {
        var self = this;
        self.taskstatuslistforcollective([]);
        var select = [];
        var data = {
            task: { fieldName: "taskid", op: 2, value: taskid },
            taskstate: { fieldName: "taskstate", op: 6, value: '' },
        };
        crmAPI.getTaskStatus(data, function (a, b, c) {
            var list = a;
            for (var i = 0; i < list.length; i++) {
                if (!self.perOfBayiOrKoc() && (list[i].taskstateid == 9169 || list[i].taskstateid == 9171)) // ata akışından geldi || koç personel onayı
                    select.push({ taskstateid: list[i].taskstateid, taskstate: list[i].taskstate, statetype: list[i].statetype, disable: ko.observable(true) });
                else
                    select.push({ taskstateid: list[i].taskstateid, taskstate: list[i].taskstate, statetype: list[i].statetype, disable: ko.observable(false) });
            }
            self.taskstatuslistforcollective(select);
            $("#statecombo").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            }).multiselect('refresh');
        }, null, null)
    },
    readyCollective: function () {
        document.getElementById("uyari_state").style.display = 'none';
        document.getElementById("uyari_ayni").style.display = 'none';
        document.getElementById("uyari_bekle").style.display = 'none';
        document.getElementById("uyari_surec").style.display = 'none';
        document.getElementById("tamam").style.display = 'none';
        var self = this;
        self.readyCollectiveList([]);
        var select = [];
        var taskid = 0;
        for (var i = 0; i < self.taskqueuelist().length; i++) {
            for (var j = 0; j < self.selectedtaskorderno().length; j++) {
                if (self.taskqueuelist()[i].taskorderno == self.selectedtaskorderno()[j] && self.taskqueuelist()[i].task.tasktypes.TaskTypeId == 0) {
                    if (taskid != 0 && self.taskqueuelist()[i].task.taskid != taskid) {
                        $('#kaydetcol').prop('disabled', true);
                        document.getElementById("uyari_ayni").style.display = 'block';
                        window.setTimeout(function () {
                            $('#sonlandir').modal('hide');
                            $('#kaydetcol').prop('disabled', false);
                        }, 2000);
                        return;
                    }
                    taskid = self.taskqueuelist()[i].task.taskid;
                    select.push(self.taskqueuelist()[i]);
                }
            }
        } // tipi diğer olan tasklardan aynı taskid'li tasklar toplu kapatılabilsin.
        if (select.length == 0) {
            $('#kaydetcol').prop('disabled', true);
            document.getElementById("uyari_surec").style.display = 'block';
            window.setTimeout(function () {
                $('#sonlandir').modal('hide');
                $('#kaydetcol').prop('disabled', false);
            }, 2000);
            return;
        }
        else if (taskid != 0) {
            self.readyCollectiveList(select);
            self.gettaskstatusForCollective(taskid);
        }
    },
    saveTaskCollective: function () {
        var self = this;
        document.getElementById("uyari_state").style.display = 'none';
        document.getElementById("uyari_bekle").style.display = 'none';
        document.getElementById("tamam").style.display = 'none';
        $('#kaydetcol').prop('disabled', true);
        if ($('#statecombo').val() == "") {
            document.getElementById("uyari_state").style.display = 'block';
            $('#kaydetcol').prop('disabled', false);
            return;
        }
        else {
            document.getElementById("uyari_bekle").style.display = 'block';
            var list = [];
            for (var i = 0; i < self.readyCollectiveList().length; i++) {
                var desc = self.readyCollectiveList()[i].description ? (self.readyCollectiveList()[i].description + " Çoklu task kapama ile kaydedildi. " + moment().format('DD MMMM, h:mm') + "(" + self.user().userFullName + ")") : ("Çoklu task kapama ile kaydedildi. " + moment().format('DD MMMM, h:mm') + "(" + self.user().userFullName + ")");
                var data = {
                    taskorderno: self.readyCollectiveList()[i].taskorderno,
                    task: { taskid: self.readyCollectiveList()[i].task.taskid },
                    taskstatepool: { taskstateid: $('#statecombo').val(), taskstate: $("#statecombo option:selected").text() ? $("#statecombo option:selected").text() : null },
                    stockmovement: [],
                    description: desc,
                    // eğer müşterinin kampanyası varsa campanya id gönderiyorum kampanyasına döküman tanımlı mı öğrenmek için (Hüseyin KOZ) 03.11.2016
                    customerproduct: self.readyCollectiveList()[i].customerproduct.length > 0 ? [self.readyCollectiveList()[i].customerproduct[0].campaignid] : [],
                }
                list.push(data);
            }
            crmAPI.saveTaskCollective(list, function (a, b, c) {
                document.getElementById("uyari_bekle").style.display = 'none';
                document.getElementById("tamam").style.display = 'block';
                window.setTimeout(function () {
                    $('#sonlandir').modal('hide');
                    $('#kaydetcol').prop('disabled', false);
                    self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
                }, 2000);
            }, null, null);
        }
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        self.firstLoad(true);
        $("#ranking").multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            nonSelectedText: 'Seçiniz',
            nSelectedText: 'Seçildi!',
            numberDisplayed: 2,
            selectAllText: 'Tümünü Seç!',
            enableFiltering: true,
            filterPlaceholder: 'Ara'
        });
        $(function () {
            $('#datetimepicker1,#datetimepicker2,#datetimepicker3').datetimepicker();
        });
        $('#daterangepicker1,#daterangepicker2,#daterangepicker3').daterangepicker({
            "timePicker": true,
            ranges: {
                'Bugün': [moment(), moment().add(1, 'days')],
                'Dün': [moment().subtract(1, 'days'), moment()],
                'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
                'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
                'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
                'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });
        $('#randevutarihi').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
        });
        self.getisslist();
        self.gettaskstatus();
        self.getTasks();
        self.getpersonel();
        self.getCustomerStatus();
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
        $("#personelatamacombo").multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            nonSelectedText: 'Personel Seçiniz',
            nSelectedText: 'Personel Seçildi!',
            numberDisplayed: 2,
            selectAllText: 'Tümünü Seç!',
            enableFiltering: true,
            filterPlaceholder: 'Ara'
        });
        self.getIl();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    },
}
dataModel.flag.subscribe(function(v) {
    if (v == null)
        return true;
    else {
        $("#personelatamacombo").multiselect('deselect', dataModel.selectedAttachmentPersonelid());
        dataModel.selectedAttachmentPersonelid(null);
    }
});
dataModel.ilKimlik.subscribe(function (v) {
    if (dataModel.isSelection()) {
        dataModel.ilceKimlik(null);
        dataModel.regionKimlik(null);
        dataModel.mahalleKimlik(null);
        if (v != null && v != "")
            dataModel.getIlce();
    }
});
dataModel.ilceKimlik.subscribe(function (v) {
    if (dataModel.isSelection()) {
        dataModel.regionKimlik(null);
        dataModel.mahalleKimlik(null);
        if (v != null && v != "")
            dataModel.getBucak();
    }
});
dataModel.regionKimlik.subscribe(function (v) {
    if (dataModel.isSelection()) {
        dataModel.mahalleKimlik(null);
        if (v != null && v != "")
            dataModel.getMahalle();
    }
});