app.controller('staffnotificationCtrl', function($scope, $cordovaBadge, $rootScope, $timeout, $state, notificationStaffList, unitIdsList, $ionicHistory, $ionicFilterBar, $ionicPopup, CONFIG, $localStorage, $ionicLoading, getNotificationstaff, $stateParams, $ionicConfig, staffFeatureList, $ionicActionSheet, $window, $ionicScrollDelegate, $location, $ionicModal) {
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */


    console.log("Inside staffpa");

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    }

    $scope.page_number = "0";
    $scope.searchThisUnit = '';
    $scope.messagesJson = notificationStaffList;
    $scope.sortComment = function(message) {
        var date = new Date(message.created);
        return date;
    }


    $scope.gobackStafNotificationList12 = function(slug) {
        // $localStorage.uid = null;
        $rootScope.maintainpageflag = true;

        $location.hash(slug);
        $ionicScrollDelegate.anchorScroll();
        if (slug == 'pckg') {
            if ($localStorage.notiobject) {
                $localStorage.notiobject = null;
                $state.go('sideMenuStaff.features');
            } else {
                $state.go("staffnotification");
                if ($rootScope.searching) {

                } else {
                    notificationStaffList.emptyIt = true;
                    $scope.getNotificationstaff();
                }

            }
        } else if (slug == 'rsvt') {
            if ($localStorage.notiobject) {
                $localStorage.notiobject = null;
                $state.go('sideMenuStaff.features');
            } else {
                $state.go("staffReservationListing");
                if ($rootScope.searching) {

                } else {
                    notificationStaffList.emptyIt = true;
                }
            }
        } else {
            console.log("hasdh");
            $ionicConfig.views.maxCache(0);
            if ($rootScope.searching) {
                $ionicHistory.goBack();

            } else {
                notificationStaffList.emptyIt = true;
                $ionicHistory.goBack();

            }

        }
    }


    $scope.getserviceid = function(featuresdata) {
        console.log("Calling change state", featuresdata)
        if ($rootScope.authoriedUser == true) {
            localStorage.setItem('notifySpecific', featuresdata.service_category_id.slug);
            var unitId = {
                "property_id": $localStorage.User.property_id,
                "token": $localStorage.User.token,
                "cat_slug": localStorage.getItem('notifySpecific')
            }
            if ($scope.isOnline() == true) {
                $ionicLoading.show();
                console.log("unitIdReqData", unitId)
                getUnitIdServices.getUnitId().save(unitId, function(res) {
                    if (res.code == 200) {
                        $ionicLoading.hide();
                        console.log("unitId res", res)
                        var service_msg = res.service_message
                        localStorage.setItem("service_msg", service_msg);
                        $scope.unitIdsList.units_id = [];
                        $scope.obj_id = {}
                        for (var i = 0; i < res.result.length; i++) {
                            $scope.unitIdsList.units_id.push({
                                _id: res.result[i]._id,
                                unit_number: res.result[i].unit_number
                            });
                        }
                        if (featuresdata.service_category_id.slug == "tm") {

                            localStorage.setItem('feature_id', "566fdf5d3949c780667d72d5");
                        } else {
                            localStorage.setItem('feature_id', featuresdata.service_category_id._id);

                        }
                        if (featuresdata.service_category_id.slug == 'bgfd') {
                            $state.go("buzzandfood_firstpage");
                        } else if (featuresdata.service_category_id.slug == 'pckg') {
                            $state.go("package_firstpage");
                        } else if (featuresdata.service_category_id.slug == 'wo') {
                            $state.go("staff_workorderView");
                        } else if (featuresdata.service_category_id.slug == 'cl') {
                            $state.go("staffnotification");
                        } else if (featuresdata.service_category_id.slug == 'tasks') {
                            $state.go("task.high");
                        } else if (featuresdata.service_category_id.slug == 'rsvt') {
                            $state.go('staffrvstStartpg');
                        } else if (featuresdata.service_category_id.slug == 'cmng') {
                            $state.go('staffcmng.resident');
                        } else if (featuresdata.service_category_id.slug == 'newsfeed') {
                            $state.go('staffnewsfeeds');
                        } else if (featuresdata.service_category_id.slug == 'wom') {
                            $state.go('staff_workorder');

                        } else if (featuresdata.service_category_id.slug == 'tm') {
                            $state.go('taskManger.high');

                        }

                    } else {
                        $ionicLoading.hide();
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                });
            } else {
                $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
            }
        } else { $scope.logout() }
    }


    $scope.reserve = function(value) {
        $scope.reserve = value;
        console.log("*******", value);
    }



    $scope.getNotificationstaff = function() {

        $ionicLoading.show();
        if ($rootScope.searching) {
            $rootScope.work_order_status = $rootScope.work_order_status;
            $rootScope.reservation_status = $rootScope.reservation_status;
            if ($rootScope.clearsall) {
                $rootScope.packstatus = '';
            } else {
                $rootScope.packstatus = $rootScope.packstatus;

            }
        } else {
            $rootScope.work_order_status = '';
            if ($scope.reserve == 1) {
                $rootScope.reservation_status = [1, 4];
            } else {
                $rootScope.reservation_status = '';
            }
            if ($scope.reserve == 2) {
                $rootScope.work_order_status = [1, 2];

            } else {
                $rootScope.work_order_status = '';
            }
            $rootScope.packstatus = [1];
        }

        if ($rootScope.clearsall) {
            $scope.searchThisUnit = '';
        }

        if (localStorage.getItem('unitIds') == 0) {
            $scope.searchThisUnit = '';
        }

        $rootScope.pageno = $scope.page_number;
        $scope.messagesJson.msgList = [];
        $scope.messagesJson.currentId = '';
        $scope.messagesJson.pageNo = "";
        var notificationData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "services_category_id": localStorage.getItem('feature_id'),
            // "services_category_id":'566fdf5d3949c780667d72d5',
            "staff_roles_id": $localStorage.User.staff_roles_id,
            "page_number": $scope.page_number,
            "units_id": $scope.searchThisUnit,
            "startdate": $rootScope.start,
            "enddate": $rootScope.end,
            "service_number": $rootScope.serviceid,
            "package_status": $rootScope.packstatus,
            "work_order_status": $rootScope.work_order_status,
            "reservation_status": $rootScope.reservation_status,
            "created_by": $scope.createbuserlist


        }
        if ($scope.isOnline() == true) {
            console.log("notificationData*********", notificationData)
            getNotificationstaff.notificationstaff().save(notificationData, function(res) {

                if ($rootScope.searching) {
                    $rootScope.totalrecords = res.list_count;
                    $scope.closeModal();
                }

                console.log("notification list", res)
                angular.forEach(res.results, function(item) {
                    var timefromtz = moment(item.service_id.timefrom).tz(localStorage.getItem('timezone'));
                    item.timeFromFormatted = timefromtz.format('MMM Do, YYYY');
                    item.timefromCal = timefromtz.format("hh:mm A");
                    var timeTotz = moment(item.service_id.timeto).tz(localStorage.getItem('timezone'));
                    item.timetoCal = timeTotz.add(1, 'minutes').format("hh:mm A");
                })
                $ionicLoading.hide();
                localStorage.setItem('totalRecordCount', res.list_count);
                $scope.totalCount = localStorage.getItem('totalRecordCount');

                if ($scope.currentRecordCount == 0) {
                    $scope.currentRecordCount = res.results.length;
                } else {
                    $scope.currentRecordCount = $scope.currentRecordCount + res.results.length;
                }

                //$rootScope.mlength = $scope.currentRecordCount

                if ($scope.currentRecordCount >= $scope.totalCount) {
                    $scope.noMoreItemsAvailable = true;
                } else {
                    $scope.noMoreItemsAvailable = false;

                }

                console.log("Total Record Count", $scope.totalCount);
                console.log("Current Record Count", $scope.currentRecordCount);

                localStorage.setItem('page_number', $scope.page_number);

                if (res.results.length > 0) {
                    angular.forEach(res.results, function(item) {
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;

                        if ($scope.messages) {

                            if ($scope.messages.length === 0)
                                $scope.messages.push(item);
                            var messagecomp = $scope.messages;
                            var isExist = false;

                            for (var i = 0; i < messagecomp.length; i++) {
                                if (messagecomp[i]._id === item._id) {
                                    isExist = true;
                                    break;
                                }
                            }
                            if (!isExist)
                                $scope.messages.push(item);
                        } else {
                            $scope.messages = [];
                        }
                    });

                    console.log("$scope.messages: ", $scope.messages.length);
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
                setTimeout(function() {
                    console.log("$scope.searchThisUnit", $scope.searchThisUnit);
                    if ($scope.searchThisUnit == '') {
                        $scope.page_number = parseInt($scope.page_number) + 1;
                        console.log($scope.page_number);
                        $scope.messagesJson.globalCount = $scope.totalCount;
                        $scope.messagesJson.defaultCount = $scope.currentRecordCount;
                        $scope.messagesJson.globalPageCount = $scope.page_number;
                        $scope.messagesJson.pageNo = $scope.page_number;
                        $scope.messagesJson.msgAllList = $scope.messages;
                        $scope.messagesJson.emptyIt = false;
                    } else {
                        $scope.messagesJson.msgList = $scope.messages;
                        $scope.messagesJson.globalSearchCount = $scope.totalCount;
                        $scope.messagesJson.defaultSearchCount = $scope.currentRecordCount;
                        $scope.page_number = parseInt($scope.page_number) + 1;
                        $scope.messagesJson.currentId = $scope.searchKeyWord;

                        $scope.messagesJson.pageNo = $scope.page_number;
                        $scope.messagesJson.emptyIt = false;
                        console.log(notificationStaffList);
                    }
                });
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                $scope.$broadcast('scroll.refreshComplete');
            })
        } else {
            $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
        }
    }


    if (notificationStaffList.emptyIt == true) {
        console.log("empty it page", $scope.page_number);
        $scope.page_number = "0";
        $scope.currentRecordCount = 0;
        $scope.messages = [];
        $scope.searchThisUnit = '';
        $scope.noMoreItemsAvailable = false;
        $scope.search1 = { 'unit_number': '' };
        $scope.show = false;
        $scope.data = { 'show': false };
        setTimeout(function() {
            $scope.getNotificationstaff()

        });
    } else {
        if (notificationStaffList.currentId != undefined && notificationStaffList.currentId != '') {
            $scope.totalCount = notificationStaffList.globalSearchCount;
            $scope.currentRecordCount = notificationStaffList.defaultSearchCount;
            if ($scope.currentRecordCount == $scope.totalCount)
                $scope.noMoreItemsAvailable = true;
            else
                $scope.noMoreItemsAvailable = false;
            console.log($scope.currentRecordCount);
            console.log($scope.totalCount);
            $scope.searchThisUnit = notificationStaffList.currentSearchID;
            $scope.data = { 'show': false };
            if (notificationStaffList.currentId.length != 0) {
                $scope.show = true;
            }
            $scope.search1 = { 'unit_number': notificationStaffList.currentId };
        } else {
            console.log("calling ")
            $scope.search1 = { 'unit_number': '' };
            $scope.show = false;
            $scope.searchThisUnit = '';
            $scope.totalCount = notificationStaffList.globalCount;
            $scope.currentRecordCount = notificationStaffList.defaultCount;
            if ($scope.currentRecordCount == $scope.totalCount)
                $scope.noMoreItemsAvailable = true;
            else
                $scope.noMoreItemsAvailable = false;
            console.log($scope.currentRecordCount);
            console.log($scope.totalCount);
            $scope.messages = notificationStaffList.msgAllList;
            $scope.page_number = notificationStaffList.globalPageCount;
            console.log($scope.messages);

            $scope.data = { 'show': false };
        }
        if (notificationStaffList.msgList != undefined && notificationStaffList.msgList.length != 0) {
            console.log('ff');
            $scope.messages = notificationStaffList.msgList;
            $scope.page_number = notificationStaffList.pageNo;
        }
    }


    /* @function : getlistofcreatedby()
     *  @Creator  : yogini 
     *  @created  : 23032017
     */

    /*To get list of created by user*/

    $scope.getlistofcreatedby = function() {
        console.log("getlistofcreatedby");
        var createddata = {
            "property_id": $localStorage.User.property_id
                // "services_category_id": localStorage.getItem('feature_id')
        }
        getNotificationstaff.createdBy().save(createddata, function(res) {
                $scope.cityLocation = [];
                angular.forEach(res.results, function(item, key) {
                    item.fullname = item.firstname + ' ' + item.lastname;
                    // if($rootScope.clearsall){
                    // }
                    if ($scope.createbuserlist)
                        console.log($scope.createbuserlist.indexOf({ _id: item.id }), "is exists");

                    var obj = {
                        text: item.fullname,
                        id: item._id,
                        checked: ($scope.createbuserlist && $scope.createbuserlist.indexOf({ _id: item.id }) > -1) ? true : false
                    }

                    $scope.cityLocation.push(obj);

                });

            },
            function(err) {

            })

    }

    $scope.getlistofcreatedby();

    $rootScope.$on("resetList", function() {
        // $scope.createbuserlist = [];
        $scope.getlistofcreatedby();
        setTimeout(function() { $rootScope.$emit("callValidate", {}) }, 1000)
        console.log("changed");
    });

    /*To push the values of created by user in search */


    $scope.onValueChanged = function(value) {
        $scope.createbuserlist = [];

        angular.forEach(value, function(item) {
            $scope.createbuserlist.push({ _id: item.id });
        })
        console.log("$scope.createbuserlist", $scope.createbuserlist);

    }




    /* @function : searchdata()
     *  @Creator  : yogini 
     *  @created  : 09032017
     */


    $scope.searchdata = function(searchFilter, serviceid, startdate, enddate, packageser, reserve) {
    
        var date = moment(startdate, "MMMM Do YYYY");
        console.log("******",date.toISOString());

        $rootScope.searching = true;
        $rootScope.workorderflag = true;
        $rootScope.refresh = false;

        if (searchFilter) {
            $rootScope.serviceid = serviceid
        }
        if (packageser) {
            $rootScope.packstatus = $localStorage.packstatus;
        }
        if (startdate) {
            var d = moment(startdate, "MMMM Do YYYY");
            $rootScope.start = d.toISOString();

            if (startdate && enddate == undefined || startdate && enddate == '') {
                $scope.alertPop("Alert", 'Please select Start Date and End Date');
                return;
            }
        }

        if (enddate) {
            if (startdate == enddate) {
                $rootScope.end = moment(enddate).endOf('day');
            } else {
                var e = moment(enddate, "MMMM Do YYYY");
                $rootScope.end = e.toISOString();
            }
        }


        if (startdate && enddate) {
            if (moment($rootScope.end).format() < moment($rootScope.start).format()) {
                $scope.alertPop("Alert", 'Invalid date.');
                return;
            }
        }

        setTimeout(function() {
            $scope.searchUsingService($rootScope.unitvalue);
        }, 100);

        $ionicScrollDelegate.anchorScroll();
        console.log("END SEARCH DATA");

    }


    $scope.items = [];
    $scope.items = unitIdsList.units_id;
    $scope.unitIdsList = unitIdsList;


    $scope.searchUsingService = function(item) {
        if (item) {
            $scope.search1 = { 'unit_number': item.unit_number };
            $scope.searchKeyWord = item.unit_number;
            $scope.searchThisUnit = item._id;
            $scope.messagesJson.currentSearchID = item._id;
        } else {
            console.log("in else part");
            $scope.searchThisUnit = '';
        }

        $scope.page_number = "0";
        $scope.messages = [];
        $scope.currentRecordCount = 0;

        setTimeout(function() {
            $scope.getNotificationstaff();
        }, 100);
        $scope.data = { show: false };
    }

    $rootScope.refresh = false;

    $scope.doRefresh = function() {
        $rootScope.refresh = true;
        if ($rootScope.searching) {
            $rootScope.work_order_status = $rootScope.work_order_status;
            $rootScope.reservation_status = $rootScope.reservation_status;
            if ($rootScope.clearsall) {
                $rootScope.packstatus = '';
            } else {
                $rootScope.packstatus = $rootScope.packstatus;

            }
        } else {
            $rootScope.work_order_status = '';
            if ($scope.reserve == 1) {
                $rootScope.reservation_status = [1, 4];
            } else {
                $rootScope.reservation_status = '';
            }
            if ($scope.reserve == 2) {
                $rootScope.work_order_status = [1, 2];

            } else {
                $rootScope.work_order_status = '';
            }
            $rootScope.packstatus = [1]
        }

        if ($rootScope.clearsall) {
            $scope.searchThisUnit = '';
        }
        $scope.messagesJson.msgList = [];
        $scope.messagesJson.currentId = '';
        $scope.messagesJson.pageNo = "";
        $scope.currentRecordCount = 0;
        $scope.page_number = "0";
        var notificationData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "services_category_id": localStorage.getItem('feature_id'),
            "staff_roles_id": $localStorage.User.staff_roles_id,
            "page_number": $scope.page_number,
            "units_id": $scope.searchThisUnit,
            "startdate": $rootScope.start,
            "enddate": $rootScope.end,
            "service_number": $rootScope.serviceid,
            "package_status": $rootScope.packstatus,
            "work_order_status": $rootScope.work_order_status,
            "reservation_status": $rootScope.reservation_status,
            "created_by": $scope.createbuserlist

        }
        console.log("notificationData", notificationData);
        if ($scope.isOnline() == true) {
            getNotificationstaff.notificationstaff().save(notificationData, function(res) {
                console.log("notificationstaff", res);
                angular.forEach(res.results, function(item) {
                    var timefromtz = moment(item.service_id.timefrom).tz(localStorage.getItem('timezone'));
                    item.timeFromFormatted = timefromtz.format('MMM Do, YYYY');
                    item.timefromCal = timefromtz.format("hh:mm A");
                    var timeTotz = moment(item.service_id.timeto).tz(localStorage.getItem('timezone'));
                    item.timetoCal = timeTotz.add(1, 'minutes').format("hh:mm A");
                })
                localStorage.setItem('totalRecordCount', res.list_count);
                $scope.totalCount = localStorage.getItem('totalRecordCount');
                console.log($scope.currentRecordCount);
                if ($scope.currentRecordCount == 0) {
                    $scope.currentRecordCount = res.results.length;
                } else {
                    $scope.currentRecordCount = $scope.currentRecordCount + res.results.length;
                }
                if ($scope.currentRecordCount == $scope.totalCount) {
                    $scope.noMoreItemsAvailable = true;
                } else {
                    $scope.noMoreItemsAvailable = false;
                }

                console.log("listCount", $scope.totalCount);
                console.log("currentRecordCount", $scope.currentRecordCount);
                if (res.results.length > 0) {
                    angular.forEach(res.results, function(item) {
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;
                    });
                    setTimeout(function() { $scope.messages = res.results; });
                    setTimeout(function() {
                        if ($scope.searchThisUnit == '') {

                            $scope.page_number = parseInt($scope.page_number) + 1;
                            console.log($scope.page_number);
                            $scope.messagesJson.globalCount = $scope.totalCount;
                            $scope.messagesJson.defaultCount = $scope.currentRecordCount;
                            $scope.messagesJson.globalPageCount = $scope.page_number;
                            $scope.messagesJson.pageNo = $scope.page_number;
                            $scope.messagesJson.msgAllList = $scope.messages;
                            $scope.messagesJson.emptyIt = false;
                        } else {
                            $scope.messagesJson.msgList = $scope.messages;
                            $scope.messagesJson.globalCount = $scope.totalCount;
                            $scope.messagesJson.defaultCount = $scope.currentRecordCount;
                            $scope.page_number = parseInt($scope.page_number) + 1;
                            $scope.messagesJson.currentId = $scope.searchKeyWord;
                            $scope.messagesJson.pageNo = $scope.page_number;
                            $scope.messagesJson.emptyIt = false;
                            console.log(notificationStaffList);
                        }

                    });
                }
                $scope.$broadcast('scroll.refreshComplete');
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        } else {}
    }

    if (localStorage.getItem('notifySpecific') == 'bgfd')
        $scope.headerSpec = 'Visitors';
    else if (localStorage.getItem('notifySpecific') == 'pckg') {
        $scope.headerSpec = 'Packages';
    } else if (localStorage.getItem('notifySpecific') == 'ewo') {
        $scope.headerSpec = 'Emergency Workorder';
    } else if (localStorage.getItem('notifySpecific') == 'nwo') {
        $scope.headerSpec = 'Normal Work Order';
    } else if (localStorage.getItem('notifySpecific') == 'cl') {
        $scope.headerSpec = 'Valet';
    } else if (localStorage.getItem('notifySpecific') == 'tasks') {
        $scope.headerSpec = 'Task List';
    } else if (localStorage.getItem('notifySpecific') == 'rsvt') {
        $scope.headerSpec = 'Reservation';
    }
    $scope.messagesHold = [];
    $scope.unitArray = [];
    $scope.unitArray1 = [];
    $scope.globalMessages = [];
    $scope.resultedMsgs = [];
    $scope.initCount = 0;
    $scope.filterText = null;
    /********on scroll loading data ******/
    $scope.loadMore = function() {
        setTimeout(function() {
            $scope.getNotificationstaff();
        });

    };

    /********on scroll loading data ******/
    $scope.loadMorepackages = function() {
        console.log("pacakagesSearch");
        setTimeout(function() { $scope.pacakagesSearch() });
    };

    $scope.showActionsheet = function() {

        $state.go('sideMenuStaff.features');

        /*
        console.log("hey");
        $scope.count1 = [];
        $scope.featuresList = staffFeatureList.features;
        console.log("staffFeatureList.features", $scope.featuresList);
        var actionsheetchangeclass = ($localStorage.User.user_type_id == 4) ? 'custom-action-sheet' : 'custom-action-sheet_staff';

        var temp = [];
        temp.push({
            cat_slug: 'home',
            text: ' <div class="' + actionsheetchangeclass + '"> <i class="ion-home actionSheetIcon"></i>&nbsp&nbsp Home</div>'
        });
        $scope.featuresList.forEach(function(data, index) {
                if (data.service_category_id.slug != 'cl' && data.service_category_id.slug != 'tasks' && data.service_category_id.slug != 'ewo' && data.service_category_id.slug != 'nwo' && data.service_category_id.slug != 'news' && data.service_category_id.slug != 'poll' && data.service_category_id.slug != 'emrgncy' && data.service_category_id.slug != 'rsdnt' && data.service_category_id.slug != 'gnrl' && data.service_category_id.slug != 'mngmnt' && data.service_category_id.slug != 'rsdnt' && data.service_category_id.slug != 'mrktplc') {

                    temp.push({
                        cat_slug: data.service_category_id.slug,
                        text: ' <div class="' + actionsheetchangeclass + '"> <i class="' + data.service_category_id.icon + ' actionSheetIcon "></i><span>&nbsp&nbsp ' + data.service_category_id.name + ' </span></div>'
                    });
                }
            })
            // temp.push({
            //   cat_slug: 'staffnewsfeeds',
            //   text: ' <div class="' + actionsheetchangeclass + '"> <i class="ion-ios-paper actionSheetIcon"></i>&nbsp&nbsp News Feeds</div>'
            // });
        $ionicActionSheet.show({
            buttons: temp,
            buttonClicked: function(index) {
                //screen.unlockOrientation();
                if (temp[index].cat_slug == 'bgfd') {
                    localStorage.setItem('notifySpecific', 'bgfd');
                    localStorage.setItem('feature_id', '5629c38a3949c780667d5c59')
                    $state.go('buzzandfood_firstpage');
                } else if (temp[index].cat_slug == 'pckg') {
                    localStorage.setItem('notifySpecific', 'pckg');
                    localStorage.setItem('feature_id', '5629c3cc3949c780667d5c5a')
                    $state.go('package_firstpage');
                } else if (temp[index].cat_slug == 'wo') {
                    localStorage.setItem('notifySpecific', 'wo');
                    localStorage.setItem('feature_id', '5629c4143949c780667d5c5b')
                    $state.go('staff_workorderView');
                } else if (temp[index].cat_slug == 'cl') {
                    localStorage.setItem('notifySpecific', 'cl');
                    localStorage.setItem('feature_id', '5629c4de3949c780667d5c5e')
                    $state.go('staffnotification');
                } else if (temp[index].cat_slug == 'tasks') {
                    localStorage.setItem('notifySpecific', 'tasks');
                    localStorage.setItem('feature_id', '566fdf5d3949c780667d72d5')
                    $state.go('task.high');
                } else if (temp[index].cat_slug == 'polls') {
                    localStorage.setItem('notifySpecific', 'poll');
                    $state.go('staff-poll');
                } else if (temp[index].cat_slug == 'news') {
                    localStorage.setItem('notifySpecific', 'staffnewsfeeds');
                    $state.go('staffnewsfeeds');
                } else if (temp[index].cat_slug == 'rsvt') {
                    localStorage.setItem('notifySpecific', 'rsvt');
                    localStorage.setItem('feature_id', '5629c5583949c780667d5c5f')
                    $state.go('staffrvstStartpg');
                } else if (temp[index].cat_slug == 'home') {
                    $state.go('sideMenuStaff.features');
                } else if (temp[index].cat_slug == 'cmng') {
                    $state.go('staffcmng.resident');
                } else if (temp[index].cat_slug == 'newsfeed') {
                    localStorage.setItem('notifySpecific', 'newsfeed');
                    localStorage.setItem('feature_id', '5787357a61f925afa18240c1')
                    $state.go('staffnewsfeeds');
                } else if (temp[index].cat_slug == 'bgfd') {
                    localStorage.setItem('notifySpecific', 'bgfd');
                    localStorage.setItem('feature_id', '5629c38a3949c780667d5c59')
                    $state.go('buzzandfood_firstpage');
                } else if (temp[index].cat_slug == 'wom') {
                    localStorage.setItem('notifySpecific', 'wom');
                    localStorage.setItem('feature_id', '58328576fd9c8fb813d75cdb')
                    console.log("WO Manager")
                    $state.go('staff_workorder');
                } else if (temp[index].cat_slug == 'tm') {
                    localStorage.setItem('notifySpecific', 'tm');
                    localStorage.setItem('feature_id', '566fdf5d3949c780667d72d5')
                    $state.go('taskManger.high');
                }
            },
            cssClass: 'custom-action-sheet4',
            destructiveButtonClicked: function() {
                console.log('DESTRUCT');
                return true;
            }
        });

        */
    };
    /********on scroll loading data ends******/
    $scope.StaffNotificationthread = function(value) {
        $rootScope.scrollflag = true;
        console.log("value111111111111", value);
        $rootScope.entertaskdetails = true;
        if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
            $cordovaBadge.decrease(value.unreadthreadVal).then(function(res) {
                // You have permission, badge decreased.
            }, function(err) {
                // You do not have permission.
            });
        }
        console.log("StaffNotificationthread", value);
        console.log(localStorage.getItem('page_number'));
        $scope.notifythread = value;

        for (i = 0; i < value.to_users_id.length; i++) {
            if (value.to_users_id[i].is_read == true && value.to_users_id[i].users_id == $localStorage.User.user_id) {
                localStorage.setItem('makeTrue', false)
            } else if (value.to_users_id[i].is_read != true && value.to_users_id[i].users_id == $localStorage.User.user_id) {
                localStorage.setItem('makeTrue', true);
                if ($scope.searchThisUnit != '') {
                    angular.forEach(notificationStaffList.msgList, function(item) {
                        var count = 0;
                        if (value._id == item._id) {
                            item.unreadthreadVal = count;
                        }
                    });
                    angular.forEach(notificationStaffList.msgAllList, function(item) {
                        var count = 0;
                        if (value._id == item._id) {
                            item.unreadthreadVal = count;
                        }
                    });
                } else {
                    angular.forEach(notificationStaffList.msgAllList, function(item) {
                        var count = 0;
                        if (value._id == item._id) {
                            item.unreadthreadVal = count;
                        }
                    });
                }
            }
        }
        var service_id = value._id
        console.log('i am called in service_id', value.services_category_id)
        localStorage.setItem("service_id", service_id);
        if (value.services_category_id == '5629c4763949c780667d5c5c' || value.services_category_id == '5629c4a03949c780667d5c5d') {
            if ($stateParams.parentWoType == 'woViewer') {
                $state.go("woDetailspgStaffView");
            } else if ($stateParams.parentWoType == 'woManager') {
                $state.go("woDetailspgStaff");
            }
        } else {
            console.log("else StaffNotificationthread")
            $state.go("staffnotificationthread");
        }
    }

    /***************************Search Filter***************************/
    $scope.scrollopt = function(value) {
        console.log(value);
        if (value.length == 0)
            $scope.data.show = false;
        else {
            $scope.searchThisUnit = '';
            $scope.page_number = notificationStaffList.globalPageCount;
            $scope.totalCount = notificationStaffList.globalCount;
            $scope.currentRecordCount = notificationStaffList.defaultCount;
            $scope.messagesJson.currentId = '';
            $scope.messagesJson.currentSearchID = '';
            $scope.messagesJson.msgList = [];
            if ($scope.currentRecordCount == $scope.totalCount) {
                $scope.noMoreItemsAvailable = true;
            } else {
                $scope.noMoreItemsAvailable = false;
            }
            $scope.messages = notificationStaffList.msgAllList;
            $scope.data.show = true;
        }
    }
    $scope.blur = false;
    $scope.showIt = function(what) {
        $scope.blur = true;
        var featuresId = localStorage.getItem('feature_id');
        var template = 'templates/Staff/Package/searchpackage.html';
        console.log("called", featuresId);
        if (featuresId == '5629c38a3949c780667d5c59') {
            // For visitor
            template = 'templates/Staff/searchvisitor.html';
        } else if (featuresId == '5629c3cc3949c780667d5c5a') {
            // For Packages
            template = 'templates/Staff/Package/searchpackage.html';
        } else if (featuresId == '5629c5583949c780667d5c5f') {
            // For Rerservation
            template = 'templates/Staff/reservation/searchreservation.html';
        } else if (featuresId == '5629c4de3949c780667d5c5e') {
            // For Cablight
            template = 'templates/Staff/searchcablight.html';
        } else if (featuresId == '5629c4763949c780667d5c5c') {
            // For Emergency WO-M
            template = 'templates/Staff/workorderManager/searchewom.html';
        } else if (featuresId == '5629c4a03949c780667d5c5d') {
            // For Normal WO-M
            template = 'templates/Staff/workorderManager/searchnwom.html';
        } else if (featuresId == '5629c5583949c780667d5c5f') {
            // For Rerservation
            template = 'templates/Staff/reservation/searchreservation.html';
        }
        $ionicModal.fromTemplateUrl(template, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });



    }
    $scope.filterText = null;
    $scope.changefun = function(unit_number) {
        if ($scope.unitArray1.length == 0 && $scope.filterText == null)
            return true;
        for (var i = 0; i < $scope.unitArray1.length; i++) {
            if ($scope.unitArray1[i] == unit_number) {
                return true;
            }
        }
    }

    $scope.showToggle = function() {
        console.log("**************");
        $scope.searchFilter = { 'unit_number': '' }
        localStorage.setItem('unit_Number', '');
        if ($scope.data.show == false)
            $scope.data.show = true;
        else
            $scope.data.show = false;
    }

    $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.unitArray,
            update: function(filteredItems, filterText) {

                $scope.filterText = filterText;
                if (filterText != undefined) {
                    if (filterText != '') {
                        if (filteredItems.length != 0) {
                            $scope.unitArray1 = filteredItems;
                            $scope.messages = $scope.messages;
                        } else
                            $scope.unitArray1 = [];
                    } else {
                        $scope.filterText = null;
                        $scope.messages = $scope.messages;
                    }
                } else {
                    $scope.filterText = null;
                    $scope.unitArray1 = [];
                }
                if (filterText) {
                    console.log(filterText);
                    console.log('filteredItems', filteredItems);
                }
            }
        });
    };
    /***************************Search Filter Ends***************************/

    $scope.changeformat = function(value, end) {
        if (value) {
            $rootScope.startdate = moment(value).format('MMMM Do YYYY');
        }
        if (end) {
            $rootScope.enddate = moment(end).format('MMMM Do YYYY');

        }
    }



    $rootScope.closing = false;
    $scope.datevalue = '';
    $scope.endvalue = ''
    $scope.closeModal = function() {
        $scope.blur = false;
        // $scope.startdate = '';
        // $scope.enddate = '';
        // $rootScope.unitvalue = '';
        $rootScope.closing = true;
        // $scope.searchThisUnit = '';
        // $localStorage.uid = null;
        // $rootScope.start = '';
        // $rootScope.end = '';
        // $rootScope.serviceid = '';
        // $rootScope.packstatus = '';
        // $rootScope.work_order_status = '';
        if ($scope.modal) {
            $scope.modal.hide();

        }
    };


    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        $scope.blur = false;

        // Execute action
        console.log("hidden");

    });

})
