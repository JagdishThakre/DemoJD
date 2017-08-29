app.controller("FeaturesCtrl", function($scope, $state, $cordovaNativeAudio, $ionicPlatform, sideMenuLinkService, $cordovaEmailComposer, $ionicSideMenuDelegate, $cordovaBadge, staffFeatureList, getUnitIdServices, unitIdsList, notificationStaffList, notificationStaffTaskList, $ionicHistory, notifyCount, guestsInputs, $ionicPopup, CONFIG, $localStorage, getFeatures, $ionicLoading, $cordovaDevice, logoutService, $rootScope, getDynamicFeatures, globalShareService) {
    guestsInputs.id = null;
    $scope.unitIdsList = unitIdsList;
    $scope.freshListCreate = notificationStaffList;
    $scope.freshListCreate.emptyIt = true;
    $scope.freshTaskListCreate = notificationStaffTaskList;
    $scope.freshTaskListCreate.emptyIt = true;
    $scope.freshTaskListCreate.priority = 1;
    $scope.freshTaskListCreate.backToHere = false;
    localStorage.setItem("unitIds", 0);
    localStorage.setItem("unit_Number", "");

    $rootScope.searching = false;
    $scope.featuresList = "";
    $rootScope.notifycount = 0;
    $scope.noteCountewo = "";
    $scope.noteCountewo = "";
    $scope.profileImg = $localStorage.User.profile_img;
    $scope.firstName = $localStorage.User.firstname;
    $scope.lastName = $localStorage.User.lastname;
    $scope.bgColor = $localStorage.User.color;
    $rootScope.searchData = {};
    $scope.property_name = $localStorage.User.property_name;
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */
    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    };
    localStorage.setItem("searchUnitNo", "");
    var myDate = new Date();
    var device_info = $scope.ConstantsInfo();
    var hrs = myDate.getHours();
    $scope.greet;
    if (hrs < 12) {
        $scope.greet = "Good Morning";
    } else if (hrs >= 12 && hrs < 17) {
        $scope.greet = "Good Afternoon";
    } else if (hrs >= 17 && hrs < 24) {
        $scope.greet = "Good Evening";
    }
    /******Linking Service*****/
    $scope.linkFunction = function() {
        if ($rootScope.authoriedUser == true) {
            var linkData = {
                device_info: $scope.ConstantsInfo()
            };
            sideMenuLinkService.linkFunc().get(linkData, function(res) {
                angular.forEach(res.result, function(item) {
                    if (item.link_slug == "faq") {
                        $scope.faq = item.link_url;
                    } else if (item.link_slug == "submit_your_idea") {
                        $scope.SubmitYourIdea = item.link_url;
                    } else if (item.link_slug == "privacy_policy") {
                        $scope.privacypolicy = item.link_url;
                    } else if (item.link_slug == "terms_conditions") {
                        $scope.termsconditions = item.link_url;
                    } else if (item.link_slug == "terms_conditions") {
                        $scope.termsconditions = item.link_url;
                    } else if (item.link_slug == "provide_feedback") {
                        $scope.email = item.link_url;
                    }
                });
            });
        } else {
            $scope.logout();
        }
    };
    /*****Linking Services*****/
    /******Linking Service*****/
    $scope.linkfunctionpm = function() {
        if ($rootScope.authoriedUser == true) {
            sideMenuLinkService.linkFunc().get({
                property_id: $localStorage.User.property_id,
                staff_role_id: $localStorage.User.staff_roles_id,
                link_slug: "document_vault"
            }, function(res) {
                angular.forEach(res.result, function(item) {
                    $scope.DocumentVault = item.link_url;
                });
                sideMenuLinkService.linkFunc().get({
                    property_id: $localStorage.User.property_id,
                    staff_role_id: $localStorage.User.staff_roles_id,
                    link_slug: "management_office"
                }, function(res) {
                    angular.forEach(res.result, function(item) {
                        $scope.ManagementOffice = item.link_url;
                    });
                });
            });
        } else {
            $scope.logout();
        }
    };
    /*****Linking Services*****/
    /*********Feed Back Controller Start************/
    $scope.sendfeedback = function() {
        //alert(JSON.stringify(device_info));
        var deviceData = localStorage.getItem("device_info");
        console.log("deviceData: ", deviceData);
        sideMenuLinkService.bckendData().save(deviceData, function(res) {
            if (res.code == 200) {
                console.log("Data Get Support Staff: ", res.AppleData);
                $scope.apple_data = res.AppleData;
            } else {
                console.log("No Data Found");
                $scope.not_apple_data = localStorage.getItem("device_info");
            }
        });
        $cordovaEmailComposer.isAvailable().then(function() {
            // is available
        }, function() {
            $scope.alertPop("Alert", "Please configure your mailbox"); // not available
        });
        var modelName = "";
        if ($scope.apple_data) {
            modelName = $scope.apple_data.Apple_Device;
        } else if ($scope.not_apple_data) {
            modelName = $scope.not_apple_data.model;
        } else {
            modelName = device_info.model;
        }
        var email = {
            to: $scope.email,
            subject: "Rise Question",
            body: "Hello Rise Team,<br><br><br><br><br>Setup Information:<br>Model: " + modelName + "<br>UUID: " + device_info.uuid + "<br>Platform: " + device_info.platform + "<br>Rise App Version : 3.0.0",
            // body: 'Hello Rise Team,<br><br><br><br><br>Setup Information:<br>Model: '+device_info.model+'<br>UUID: '+device_info.uuid+'<br>Platform: '+device_info.platform+'',
            isHtml: true
        };
        $cordovaEmailComposer.open(email).then(null, function() {
            // user cancelled email
        });
    };
    /*********Feed Back Controller Ends************/
    /**************Open Browser Start***********/
    $scope.opendocumentvault = function() {
        // Open in app browser
        window.open($scope.DocumentVault, "_blank");
    };
    /**************End***********/
    /**************Open Browser Start for  Management Office***********/
    $scope.managementoffice = function() {
        // Open in app browser
        window.open($scope.ManagementOffice, "_blank");
    };
    /**************Open Browser End***********/
    /**************Open Browser Start FAQ***********/
    $scope.openfaq = function() {
        // Open in app browser
        window.open($scope.faq, "_blank");
    };
    /**************Open Browser ends***********/
    /**************Open Browser Start Submit Your Idea***********/
    $scope.submityouridea = function() {
        // Open in app browser
        window.open($scope.SubmitYourIdea, "_blank");
    };
    /**************Open Browser End***********/
    /**************Open Browser Start Privacy Policy***********/
    $scope.ppolicy = function() {
        // Open in app browser
        window.open($scope.privacypolicy, "_blank");
    };
    /**************Open Browser Start***********/
    /**************Open Browser Start Terms & Conditions***********/
    $scope.termscondtn = function() {
        window.open($scope.termsconditions, "_blank");
    };
    /**************Open Browser Start***********/
    /********Logout Service****************/
    $scope.logoutByUser = function() {
        $ionicLoading.show({
            template: "Logging Out"
        });
        var logoutData = {
            user_id: $localStorage.User.user_id,
            token: $localStorage.User.token,
            device_info: $scope.ConstantsInfo()
        };
        logoutService.logout().save(logoutData, function(res) {
            $ionicLoading.hide();
            delete $localStorage.User;
            $rootScope.email = "";
            localStorage.setItem("bgImg", "");
            localStorage.setItem("propert_imgL", "");
            localStorage.setItem("propert_imgP", "");
            localStorage.setItem("emailInRoot", $rootScope.email);
            localStorage.setItem("validToken", "not valid");
            /*******clear the badge count when logout from app*******/
            var currentPlatform = ionic.Platform.platform();
            if (currentPlatform == "android" || currentPlatform == "ios") {
                $cordovaBadge.clear().then(function() {}, function(err) {
                    alert(err);
                });
            }
            /*******clear the badge ends here *******/
            $state.go("login");
            setTimeout(function() {
                $scope.alertPop("Alert", "You Have Successfully Logged Out");
            }, 500);
            $ionicLoading.hide();
        }, function(err) {
            $ionicLoading.hide();
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    };
    /**************Logout Service Ends******************/
    //for saving data of task details
    console.log("staffFeatureList", staffFeatureList);
    $scope.featuresListStaff = staffFeatureList;
    $scope.featuresCnt = 0;
    $scope.featuresListarr = [];
    $scope.features = function() {
        if ($rootScope.authoriedUser == true) {
            $scope.refreshDiv = false;
            $ionicLoading.show();
            var featureData = {
                users_id: $localStorage.User.user_id,
                user_type: $localStorage.User.user_type_id,
                token: $localStorage.User.token
            };
            getDynamicFeatures.features().save(featureData, function(res) {
                console.log("DynamicFeatures", res);
                if (res.code == 200) {
                    $scope.featuresList = res.data;
                    console.log("res.data: ", res.data);
                    angular.forEach($scope.featuresList, function(item) {
                        if (item.service_category_id._id === "5629c38a3949c780667d5c59" || item.service_category_id._id === "5629c3cc3949c780667d5c5a" || item.service_category_id._id === "5629c4de3949c780667d5c5e" || item.service_category_id._id === "5629c5583949c780667d5c5f" || item.service_category_id._id === "5629c5a53949c780667d5c60" || item.service_category_id._id === "58294041dead7337120f5d9b" || item.service_category_id._id === "5832b815fd9c8fb813d75cdd" || item.service_category_id._id === "5787357a61f925afa18240c1" || item.service_category_id._id === "5629c4143949c780667d5c5b" || item.service_category_id._id === "598043eaba0297a60a765647" || item.service_category_id._id === "59968018535167e485f8b12c") {
                            if ($rootScope.user_permissions) {
                                if (item.service_category_id._id == "5629c38a3949c780667d5c59") {
                                    if ($rootScope.user_permissions.Visitors) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Visitors");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c3cc3949c780667d5c5a") {
                                    if ($rootScope.user_permissions.Packages) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Packages");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c5a53949c780667d5c60") {
                                    if ($rootScope.user_permissions.Contacts) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Contacts");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c4763949c780667d5c5c") {
                                    if ($rootScope.user_permissions.Emergency_Work_Order) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Emergency_Work_Order");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c4a03949c780667d5c5d") {
                                    if ($rootScope.user_permissions.Normal_Work_Order) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Normal_Work_Order");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c4de3949c780667d5c5e") {
                                    if ($rootScope.user_permissions.Valet) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Valet");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c5583949c780667d5c5f") {
                                    if ($rootScope.user_permissions.Reservations) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Reservations");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "56a9e78bd42aba0fd731b1df") {
                                    if ($rootScope.user_permissions.News) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("News");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "56ab40b8d42aba0fd731b1e4") {
                                    if ($rootScope.user_permissions.Polls) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Polls");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5787386661f925afa18240c4") {
                                    if ($rootScope.user_permissions.Emergency) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Emergency");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5787389761f925afa18240c5") {
                                    if ($rootScope.user_permissions.General) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("General");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "58294041dead7337120f5d9b" || item.service_category_id._id == "5629c4143949c780667d5c5b") {
                                    if ($rootScope.user_permissions.Work_Orders) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Work_Orders");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5787357a61f925afa18240c1") {
                                    if ($rootScope.user_permissions.Newsfeed) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Newsfeed");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "578737d961f925afa18240c3") {
                                    if ($rootScope.user_permissions.Resident) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Resident");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "578737b261f925afa18240c2") {
                                    if ($rootScope.user_permissions.Management) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Management");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5832b815fd9c8fb813d75cdd") {
                                    if ($rootScope.user_permissions.Management) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Tasks");
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "598043eaba0297a60a765647") {
                                    if ($rootScope.user_permissions.Activity_User) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Activity_User");
                                        localStorage.setItem("userID", $localStorage.User.user_id);
                                        localStorage.setItem("services_category_id", item.service_category_id._id);
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "59968018535167e485f8b12c") {
                                    if ($rootScope.user_permissions.Activity_Manager) {
                                        $scope.featuresCnt = $scope.featuresCnt + 1;
                                        console.log("Activity_Manager");
                                        localStorage.setItem("userID", null);
                                        localStorage.setItem("services_category_id", item.service_category_id._id);
                                        $scope.featuresListarr.push(item);
                                    }
                                }
                            } else {
                                $scope.featuresCnt = $scope.featuresCnt + 1;
                                $scope.featuresListarr.push(item);
                            }
                        }
                    });
console.log("$scope.featuresCnt: ", $scope.featuresCnt);
console.log("$scope.featuresListarr: ", $scope.featuresListarr);
$scope.featuresListStaff.features = [];
$scope.featuresList.forEach(function(item, index) {
    if (item.service_category_id.slug == "tm") {
        $localStorage.User.isManager = true;
    }
    $scope.featuresListStaff.features.push(item);
});
$ionicLoading.hide();
$scope.featureNote();
} else {
    $scope.alertPop("Alert", res.message);
    $ionicLoading.hide();
}
}, function(err) {
    setTimeout(function() {
        $ionicLoading.hide();
        $scope.refreshDiv = true;
    }, 3000);
});
} else {
    $scope.logout();
}
};
$scope.myTask = function() {
    $ionicLoading.show();
    if ($scope.featuresListStaff.features) {
        angular.forEach($scope.featuresListStaff.features, function(taskData) {
            if (taskData.service_category_id.slug == "tasks") {
                $ionicLoading.hide();
                $scope.changestate(taskData);
            }
        });
    } else {
        $scope.alertPop("Alert", "something went wrong!");
    }
    $ionicLoading.hide();
};
$scope.doRefresh = function() {
    $ionicLoading.hide();
    $rootScope.isAuthorized();
    angular.forEach($scope.featuresList, function(item) {
        item.notiCount = undefined;
    });
    $scope.featureNote();
};
$scope.featureNote = function() {
    if ($rootScope.authoriedUser == true) {
        var notifycountData = {
            users_id: $localStorage.User.user_id,
            property_id: $localStorage.User.property_id,
            token: $localStorage.User.token
        };
        $scope.noteCountewo = "";
        $scope.noteCountnwo = "";
        $rootScope.notifycount = 0;
        console.log("notifycountData", notifycountData);
        notifyCount.notifyCount().save(notifycountData, function(res) {
            if (res.code == 200) {
                console.log("tota noti", res);
                var currentPlatform = ionic.Platform.platform();
                if (currentPlatform == "android" || currentPlatform == "ios") {
                    var badgeSetCount = res.totalcount;
                    $cordovaBadge.set(badgeSetCount).then(function() {
                            // You have permission, badge set.
                        }, function(err) {
                            //$scope.alertPopResi("Error", "Error occurred in badge count");
                            console.log(err);
                        });
                }
                if (res.countmytask.length > 0) {
                    angular.forEach(res.countmytask, function(Mycounts) {
                        $scope.tabTaskCount = Mycounts.count;
                    });
                }
            }
            for (var i = 0; i < res.results.length; i++) {
                if ($scope.featuresList != undefined) {
                    for (var j = 0; j < $scope.featuresList.length; j++) {
                        if (res.results[i].services_category_id.slug == "ewo") {
                            $scope.noteCountewo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "wo") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountewo;
                                $rootScope.notifycount += parseInt($scope.noteCountewo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "nwo") {
                            $scope.noteCountewo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "wo") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountewo;
                                $rootScope.notifycount += parseInt($scope.noteCountewo);
                            }
                        }
                        /**** adding the noti count of EMO+ NWO and showing in to Workorder manger in dashboard starts ****/
                        if (res.results[i].services_category_id.slug == "ewo") {
                            $scope.noteCountewo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "wom") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountewo;
                                $rootScope.notifycount += parseInt($scope.noteCountewo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "nwo") {
                            $scope.noteCountewo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "wom") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountewo;
                                $rootScope.notifycount += parseInt($scope.noteCountewo);
                            }
                        }
                        /**** adding the noti count of EMO+ NWO and showing in to Workorder manger in dashboard ends here ****/
                        if (res.results[i].services_category_id.slug == "gnrl") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "newsfeed") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "mrktplc") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "newsfeed") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "news") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "newsfeed") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "poll") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "newsfeed") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "emrgncy") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "newsfeed") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "gnrl") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "rsdnt") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "mrktplc") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "rsdnt") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "news") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "mngmnt") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "poll") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "mngmnt") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if (res.results[i].services_category_id.slug == "emrgncy") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "mngmnt") {
                                if ($scope.featuresList[j].notiCount == undefined) $scope.featuresList[j].notiCount = 0;
                                $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                $rootScope.notifycount += parseInt($scope.noteCountnwo);
                            }
                        }
                        if ($scope.featuresList[j].service_category_id.slug == res.results[i].services_category_id.slug) {
                            $scope.featuresList[j].notiCount = res.results[i].count;
                            $rootScope.notifycount += parseInt($scope.featuresList[j].notiCount);
                        }
                        if (res.results[i].services_category_id.slug == "tasks") {
                            $scope.noteCountnwo = res.results[i].count;
                            if ($scope.featuresList[j].service_category_id.slug == "tasks") {
                                    // if ($scope.featuresList[j].notiCount == undefined)
                                    //     $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount = $scope.tabTaskCount;
                                    // $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == "tasks") {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == "tm") {
                                    // if ($scope.featuresList[j].notiCount == undefined)
                                    //     $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount = $scope.noteCountnwo;
                                    // $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == "actl") {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == "actl") {
                                    // if ($scope.featuresList[j].notiCount == undefined)
                                    //     $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount = $scope.noteCountnwo;
                                    // $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == "actm") {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == "actm") {
                                    // if ($scope.featuresList[j].notiCount == undefined)
                                    //     $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount = $scope.noteCountnwo;
                                    // $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                        }
                    }
                }
                $scope.$broadcast("scroll.refreshComplete");
            });
} else {
    $scope.logout();
}
};
/*Side Menu Start*/
$scope.$watch("dataConzero", function(newValue, oldValue) {
    var thisElem = angular.element(document.querySelectorAll("ion-side-menu-content"));
    if ($scope.toggleIt == true) {
        thisElem.removeClass("alphaNot");
        thisElem.addClass("alpha");
    } else {
        thisElem.removeClass("alpha");
        thisElem.addClass("alphaNot");
    }
});
$scope.datazero = 0;
$scope.dataConzero = 0;
$scope.toggleIt = false;
$scope.addWidth = function() {
    $scope.toggleIt = !$scope.toggleIt;
    if ($scope.toggleIt == true) {
        $scope.datazero = 275;
        $scope.dataConzero = 275;
    } else {
        $scope.datazero = 0;
        $scope.dataConzero = 0;
    }
};
$scope.closeSideMenu = function() {
    if ($scope.toggleIt == true) {
        $scope.datazero = 0;
        $scope.dataConzero = 0;
        $scope.toggleIt = !$scope.toggleIt;
    }
};
/*Side Menu Ends*/
    //var user_type_id = $localStorage.User.user_type_id;
    $scope.changestate = function(featuresdata) {
        console.log("Calling change state", featuresdata);
        if ($rootScope.authoriedUser == true) {
            localStorage.setItem("notifySpecific", featuresdata.service_category_id.slug);
            var unitId = {
                property_id: $localStorage.User.property_id,
                token: $localStorage.User.token,
                cat_slug: localStorage.getItem("notifySpecific")
            };
            if ($scope.isOnline() == true) {
                $ionicLoading.show();
                console.log("unitIdReqData", unitId);
                getUnitIdServices.getUnitId().save(unitId, function(res) {
                    if (res.code == 200) {
                        $ionicLoading.hide();
                        console.log("unitId res", res);
                        var service_msg = res.service_message;
                        localStorage.setItem("service_msg", service_msg);
                        $scope.unitIdsList.units_id = [];
                        $scope.obj_id = {};
                        for (var i = 0; i < res.result.length; i++) {
                            $scope.unitIdsList.units_id.push({
                                _id: res.result[i]._id,
                                unit_number: res.result[i].unit_number
                            });
                        }
                        if (featuresdata.service_category_id.slug == "tm") {
                            localStorage.setItem("feature_id", "566fdf5d3949c780667d72d5");
                        } else {
                            localStorage.setItem("feature_id", featuresdata.service_category_id._id);
                        }
                        if (featuresdata.service_category_id.slug == "bgfd") {
                            $state.go("buzzandfood_firstpage");
                        } else if (featuresdata.service_category_id.slug == "pckg") {
                            $state.go("package_firstpage");
                        } else if (featuresdata.service_category_id.slug == "wo") {
                            $state.go("staff_workorderView");
                        } else if (featuresdata.service_category_id.slug == "cl") {
                            $state.go("staffnotification");
                        } else if (featuresdata.service_category_id.slug == "tasks") {
                            $state.go("task.high");
                        } else if (featuresdata.service_category_id.slug == "rsvt") {
                            $state.go("staffrvstStartpg");
                        } else if (featuresdata.service_category_id.slug == "cmng") {
                            $state.go("staffcmng.resident");
                        } else if (featuresdata.service_category_id.slug == "newsfeed") {
                            $state.go("staffnewsfeeds");
                        } else if (featuresdata.service_category_id.slug == "wom") {
                            $state.go("staff_workorder");
                        } else if (featuresdata.service_category_id.slug == "tm") {
                            $state.go("taskManger.high");
                        } else if (featuresdata.service_category_id.slug == "actl" || featuresdata.service_category_id.slug == "actm") {
                            $state.go("activityLogsList");
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
        } else {
            $scope.logout();
        }
    };
    // MileStone v2.2
    $scope.goToClearNoti = function() {
        $state.go("staffClearNoti");
    };
    $scope.goToActivity = function() {
        $state.go("activityLogsList");
    };
    $scope.notiSound = globalShareService.data;
    $scope.notiSoundStatus = function(status) {
        globalShareService.data = status;
        console.log("globalShareService", globalShareService.data);
    };
}).controller("staffClearNotiCtrl", function(staffFeatureList, $scope, $ionicLoading, clearNotiService, residentActionSheet, $localStorage, notifyCount) {
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */
    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    };
    $scope.stafClearNotiDatas = staffFeatureList.features;
    console.log("Staff clear noti", $scope.stafClearNotiDatas);
    $scope.selectAll = function(value) {
        console.log(value);
        angular.forEach($scope.stafClearNotiDatas, function(item) {
            // console.log(item.service_category_id.slug=='wo')
            if (value) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        });
    };
    $scope.checkNotiData = function() {
        var notifycountData = {
            users_id: $localStorage.User.user_id,
            property_id: $localStorage.User.property_id,
            token: $localStorage.User.token
        };
        console.log("notifycountData", notifycountData);
        notifyCount.notifyCount().save(notifycountData, function(res) {
            console.log(" noti count ", res);
            if (res.results.length == 0) {
                console.log("Count is not there");
                $scope.disableClearBtn = true;
                $ionicLoading.hide();
            } else {
                angular.forEach(res.results, function(item) {
                    if (item.services_category_id._id == "56a9e78bd42aba0fd731b1df") {
                        $scope.disableClearBtn = true;
                        console.log("Count is there but its news");
                    } else {
                        $scope.disableClearBtn = false;
                    }
                });
                $ionicLoading.hide();
            }
        });
    };
    $scope.passClearNotiData = function() {
        $ionicLoading.show();
        $scope.selectedArray = [];
        angular.forEach($scope.stafClearNotiDatas, function(item) {
            // console.log(item.service_category_id.slug=='wo')
            if (item.selected) {
                console.log("item.selected", item);
                if (item.service_category_id.slug == "tasks") {
                    $scope.isMyTask = true;
                } else {
                    $scope.isMyTask = false;
                }
                if (item.service_category_id.slug == "wo" || item.service_category_id.slug == "wom") {
                    $scope.selectedArray.push("5629c4763949c780667d5c5c", "5629c4a03949c780667d5c5d");
                } else if (item.service_category_id.slug == "newsfeed") {
                    console.log("Going to clear newsfeeds");
                    $scope.selectedArray.push("578737b261f925afa18240c2", "578737d961f925afa18240c3", "578738bc61f925afa18240c6", "5787389761f925afa18240c5", "5787386661f925afa18240c4", "56ab40b8d42aba0fd731b1e4", "56a9e78bd42aba0fd731b1df");
                } else if (item.service_category_id.slug == "tm") {
                    console.log("TM: ");
                    $scope.selectedArray.push("566fdf5d3949c780667d72d5");
                } else {
                    $scope.selectedArray.push(item.service_category_id._id);
                }
            }
        });
        console.log("$scope.stafClearNotiDatas", $scope.stafClearNotiDatas);
        $scope.cleatNotiData = {
            users_id: $localStorage.User.user_id,
            isMyTask: $scope.isMyTask,
            services_category_id: $scope.selectedArray
        };
        console.log("$scope.cleatNotiData", $scope.cleatNotiData);
        if ($scope.cleatNotiData.services_category_id.length == 0) {
            $scope.alertPopResi("Alert", "please select any feature to clear");
            $ionicLoading.hide();
        } else {
            clearNotiService.clearNoti().save($scope.cleatNotiData, function(res) {
                console.log("clearNotiRes", res);
                $ionicLoading.hide();
                if (res.code == 200) {
                    $scope.alertPop("Alert", res.message, "sideMenuStaff.features");
                } else {
                    $scope.alertPop("Alert", "Something went wrong");
                }
            });
        }
    };
});
