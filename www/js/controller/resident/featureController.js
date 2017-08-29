app.controller('FeaturesResiCtrl', function($scope, existingNotifyService, $ionicModal, $cordovaAppVersion, sideMenuLinkService, $cordovaEmailComposer, $ionicConfig, $cordovaEmailComposer, logoutService, $localStorage, $cordovaBadge, $state, $rootScope, $ionicHistory, notifyCount, $cordovaDevice, $localStorage, getFeatures, $ionicLoading, $cordovaNetwork, $ionicPopup, CONFIG, residentActionSheet, getDynamicFeatures, loginService, globalShareService) {

    $scope.bgColor = $localStorage.User.color;
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    }
    $scope.$watch('dataConzero', function(newValue, oldValue) {
        console.log(newValue)
        var thisElem = angular.element(document.querySelectorAll("ion-side-menu-content"));
        console.log(thisElem);
        if ($scope.toggleIt == true) {
            thisElem.removeClass('alphaNot');
            thisElem.addClass('alpha');
        } else {
            thisElem.removeClass('alpha');
            thisElem.addClass('alphaNot');
        }
        var homeData = {
            "device_info": device_info,
            "user_id": $localStorage.User.user_id,
            "version": $localStorage.appversion,
            "token": $localStorage.User.token,

        }
        $rootScope.deviceInfo = '';
        console.log("homeData", homeData)
        $ionicLoading.show();
        loginService.homeCheck().save(homeData, function(res) {
            console.log("homeCheck", res);
            if (res.data != null) {
                $rootScope.deviceInfo = res.data;
            } else {
                $rootScope.deviceInfo = JSON.parse(localStorage.getItem('device_info'));
            }
            console.log("$rootScope.deviceInfo: ", $rootScope.deviceInfo);
            $ionicLoading.hide();
            if (res.code == 200) {
                $localStorage.User.profile_img = res.users_data.profile_img;
                $scope.profileImg = $localStorage.User.profile_img;
                $scope.color = { 'background': res.users_data.colour };
                //localStorage.setItem('color', res.users_data.colour);
                $localStorage.User.usrColor = $scope.color;
            } else if (res.code == 201) {
                var logoutData = {
                    "user_id": $localStorage.User.user_id,
                    "token": $localStorage.User.token,
                    "device_info": $scope.ConstantsInfo()
                }
                logoutService.logout().save(logoutData, function(res) {
                    if (res.code == 200) {
                        $ionicLoading.hide();
                        delete $localStorage.User;
                        $rootScope.email = '';
                        localStorage.setItem('emailInRoot', $rootScope.email);
                        localStorage.setItem('validToken', 'not valid');

                        /*******clear the badge count when logout from app*******/
                        var currentPlatform = ionic.Platform.platform();
                        if (currentPlatform == 'android' || currentPlatform == 'ios') {

                            $cordovaBadge.clear().then(function() {

                            }, function(err) {
                                alert(err)

                            });
                        }
                        /*******clear the badge ends here *******/
                        $state.go('login');
                    }
                })
            } else if (res.code == 301) {
                $ionicLoading.hide();
                console.log("gsdgfg");
                var currentPlatform = ionic.Platform.platform();

                $scope.bellalertPopup = $ionicPopup.alert({
                    title: 'Update App',
                    templateUrl: 'templates/Resident/appUpdateNotiPopup.html'
                });

                $scope.bellalertPopup.then(function(res) {
                    if (res) {
                        console.log("currentPlatform", currentPlatform);
                        if (currentPlatform == 'android') {
                            $window.open('https://play.google.com/store/apps/details?id=com.riseliving.rise&hl=en', '_system');
                            console.log("if")

                        } else {
                            $window.open('https://itunes.apple.com/us/app/rise-living/id1117019183?ls=1&mt=8', '_system');

                        }

                    } else {
                        console.log("else");
                    }

                });
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
        })
    });
    localStorage.setItem('showGeneral', false);
    localStorage.setItem('showMarketPlace', false);
    $scope.featuresList = '';
    $scope.show = false;
    $scope.profileImg = $localStorage.User.profile_img;
    $scope.firstName = $localStorage.User.firstname;
    $scope.lastName = $localStorage.User.lastname;
    $scope.property_name = $localStorage.User.property_name;
    var myDate = new Date();
    var hrs = myDate.getHours();
    var device_info = $scope.ConstantsInfo();
    $scope.greet;

    if (hrs < 12) {
        $scope.greet = 'Good Morning';
        console.log($scope.greet)
    } else if (hrs >= 12 && hrs < 17) {
        $scope.greet = 'Good Afternoon';
        console.log($scope.greet)
    } else if (hrs >= 17 && hrs < 24) {
        $scope.greet = 'Good Evening';
        console.log($scope.greet)
    }

    /******Linking Service*****/
    $scope.linkFunction = function() {
            var linkData = {
                "device_info": $scope.ConstantsInfo()
            }
            sideMenuLinkService.linkFunc().get(linkData, function(res) {
                angular.forEach(res.result, function(item) {
                    if (item.link_slug == 'faq') {
                        $scope.faq = item.link_url;
                    } else if (item.link_slug == 'submit_your_idea') {
                        $scope.SubmitYourIdea = item.link_url;
                    } else if (item.link_slug == 'privacy_policy') {
                        $scope.privacypolicy = item.link_url;
                    } else if (item.link_slug == 'terms_conditions') {
                        $scope.termsconditions = item.link_url;
                    } else if (item.link_slug == 'terms_conditions') {
                        $scope.termsconditions = item.link_url;
                    } else if (item.link_slug == 'provide_feedback') {
                        $scope.email = item.link_url;
                    }
                })
            })
        }
        /*****Linking Services*****/



    /******Linking Service*****/
    $scope.linkfunctionpm = function() {
            //console.log($localStorage.User.property_id);
            sideMenuLinkService.linkFunc().get({ property_id: $localStorage.User.property_id, resident_role_id: $localStorage.User.resident_roles_id, link_slug: 'document_vault' }, function(res) {
                angular.forEach(res.result, function(item) {
                    $scope.DocumentVault = item.link_url;
                })

                sideMenuLinkService.linkFunc().get({ property_id: $localStorage.User.property_id, resident_role_id: $localStorage.User.resident_roles_id, link_slug: 'management_office' }, function(res) {
                    angular.forEach(res.result, function(item) {
                        $scope.ManagementOffice = item.link_url;
                    })
                });
            });
        }
        /*****Linking Services*****/


    /*********Feed Back Controller Start************/
    $scope.sendfeedback = function() {
            //alert(JSON.stringify(device_info));
            var deviceData = localStorage.getItem('device_info');
            console.log("deviceData: ", deviceData);
            sideMenuLinkService.bckendData().save(deviceData, function(res) {
                if (res.code == 200) {
                    console.log("Data Get Support Staff: ", res.AppleData);
                    $scope.apple_data = res.AppleData;
                } else {
                    console.log("No Data Found");
                    $scope.not_apple_data = localStorage.getItem('device_info');
                }
            });
            $cordovaEmailComposer.isAvailable().then(function() {
                // is available
            }, function() {
                $scope.alertPop('Alert', 'Please configure your mailbox'); // not available
            });
            var modelName = '';
            if ($scope.apple_data) {
                modelName = $scope.apple_data.Apple_Device;
            } else if ($scope.not_apple_data) {
                modelName = $scope.not_apple_data.model;
            } else {
                modelName = device_info.model;
            }
            var email = {
                to: $scope.email,
                subject: 'Rise Question',
                body: 'Hello Rise Team,<br><br><br><br><br>Setup Information:<br>Model: ' + modelName + '<br>UUID: ' + device_info.uuid + '<br>Platform: ' + device_info.platform + '<br>Rise App Version : 3.0.0',
                // body: 'Hello Rise Team,<br><br><br><br><br>Setup Information:<br>Model: '+device_info.model+'<br>UUID: '+device_info.uuid+'<br>Platform: '+device_info.platform+'',
                isHtml: true
            };

            $cordovaEmailComposer.open(email).then(null, function() {
                // user cancelled email
            });
        }
        /*********Feed Back Controller Ends************/
        /**************Open Browser Start***********/
        // Open in app browser
    $scope.opendocumentvault = function() {
        console.log(012, $scope.DocumentVault)
        window.open($scope.DocumentVault, '_blank');
    };
    /**************End***********/

    /**************Open Browser Start for  Management Office***********/
    $scope.managementoffice = function() {
        // Open in app browser
        window.open($scope.ManagementOffice, '_blank');
    };
    /**************Open Browser End***********/

    /**************Open Browser Start FAQ***********/
    $scope.openfaq = function() {
        // Open in app browser
        window.open($scope.faq, '_blank');
    };
    /**************Open Browser ends***********/

    /**************Open Browser Start Submit Your Idea***********/
    $scope.submityouridea = function() {
        // Open in app browser
        window.open($scope.SubmitYourIdea, '_blank');
    };
    /**************Open Browser End***********/

    /**************Open Browser Start Privacy Policy***********/
    $scope.ppolicy = function() {
        // Open in app browser
        window.open($scope.privacypolicy, '_blank');
    };
    /**************Open Browser Start***********/

    /**************Open Browser Start Terms & Conditions***********/
    $scope.termscondtn = function() {
        // Open in app browser
        window.open($scope.termsconditions, '_blank');
    };
    /**************Open Browser Start***********/



    /*Logout Function starts*/
    $scope.logoutByUser = function() {
            $rootScope.searching = false;
            $ionicLoading.show({
                template: 'Logging Out'
            });
            var logoutData = {
                "user_id": $localStorage.User.user_id,
                "token": $localStorage.User.token,
                "device_info": $scope.ConstantsInfo()
            }
            if ($scope.isOnline() == true) {
                logoutService.logout().save(logoutData, function(res) {
                    $ionicLoading.hide();
                    if (res.code == 200) {
                        delete $localStorage.User;
                        $rootScope.email = '';
                        localStorage.setItem("bgImg", "");
                        localStorage.setItem("propert_imgL", "");
                        localStorage.setItem("propert_imgP", "");
                        localStorage.setItem('emailInRoot', $rootScope.email);
                        console.log("delete", $localStorage);
                        console.log(12546, localStorage.getItem("propert_img"));
                        localStorage.setItem('validToken', 'not valid');
                        /*******clear the badge count when logout from app*******/
                        var currentPlatform = ionic.Platform.platform();
                        if (currentPlatform == 'android' || currentPlatform == 'ios') {

                            $cordovaBadge.clear().then(function() {

                            }, function(err) {
                                alert(err)

                            });
                        }
                        /*******clear the badge ends here *******/
                        $state.go('login');
                        setTimeout(function() {
                            $scope.alertPopResi('Alert', 'You Have Successfully Logged Out');
                        }, 500);
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                })
            } else {
                $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);

            }
        }
        /*Logout Function ends*/



    /*Side Menu Start*/


    $scope.datazero = 0;
    $scope.dataConzero = 0;
    $scope.toggleIt = false;
    $scope.addWidth = function() {
        $scope.toggleIt = !$scope.toggleIt;
        console.log($scope.toggleIt)
        if ($scope.toggleIt == true) {
            $scope.datazero = 275;
            $scope.dataConzero = 275;
        } else {
            console.log($scope.toggleIt);
            $scope.datazero = 0;
            $scope.dataConzero = 0;
        }


    }

    $scope.closeSideMenu = function() {
            if ($scope.toggleIt == true) {
                $scope.datazero = 0;
                $scope.dataConzero = 0;
                $scope.toggleIt = !$scope.toggleIt;
            }
        }
        /*Side Menu Ends*/



    var user_type_id = $localStorage.User.user_type_id;

    $scope.doRefresh = function() {
        $rootScope.isAuthorized();
        angular.forEach($scope.featuresList, function(item) {
            item.notiCount = undefined;
        });
        //$scope.featureNote();
        $scope.cnt = 0;
        $scope.featuresListarr = [];
        $scope.features();
    };

    $scope.featureNote = function() {
        if ($rootScope.authoriedUser == true) {
            var notifycountData = {
                "users_id": $localStorage.User.user_id,
                "property_id": $localStorage.User.property_id,
                "token": $localStorage.User.token
            }
            $scope.noteCountewo = '';
            $scope.noteCountnwo = '';
            $rootScope.notifycount = 0;
            notifyCount.notifyCount().save(notifycountData, function(res) {
                console.log(" noti count ", res)
                if (res.code == 200) {
                    console.log("tota noticount in app.js", $rootScope.totalAppNotiCount)
                    var currentPlatform = ionic.Platform.platform();
                    if (currentPlatform == 'android' || currentPlatform == 'ios') {
                        var badgeSetCount = res.totalcount;
                        $cordovaBadge.set(badgeSetCount).then(function() {
                            // You have permission, badge set.
                        }, function(err) {
                            console.log("Error occurred in badge count", err)
                        });
                    }
                }
                if (res.results.length == 0) {
                    $scope.noResiClearNotiData = "No Notifications to clear!"
                }
                for (var i = 0; i < res.results.length; i++) {
                    if ($scope.featuresList != undefined) {
                        for (var j = 0; j < $scope.featuresList.length; j++) {
                            if (res.results[i].services_category_id.slug == 'ewo') {
                                $scope.noteCountewo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'wo') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountewo;
                                    $rootScope.notifycount += parseInt($scope.noteCountewo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'nwo') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'wo') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'gnrl') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'newsfeed') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'mrktplc') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'newsfeed') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }

                            if (res.results[i].services_category_id.slug == 'news') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'newsfeed') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'poll') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'newsfeed') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'emrgncy') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'newsfeed') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'gnrl') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'rsdnt') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'mrktplc') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'rsdnt') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'news') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'mngmnt') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'poll') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'mngmnt') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }
                            if (res.results[i].services_category_id.slug == 'emrgncy') {
                                $scope.noteCountnwo = res.results[i].count;
                                if ($scope.featuresList[j].service_category_id.slug == 'mngmnt') {
                                    if ($scope.featuresList[j].notiCount == undefined)
                                        $scope.featuresList[j].notiCount = 0;
                                    $scope.featuresList[j].notiCount += $scope.noteCountnwo;
                                    $rootScope.notifycount += parseInt($scope.noteCountnwo);
                                }
                            }


                            if ($scope.featuresList[j].service_category_id.slug == res.results[i].services_category_id.slug) {
                                $scope.featuresList[j].notiCount = res.results[i].count;
                                $rootScope.notifycount += parseInt($scope.featuresList[j].notiCount);

                            }
                        }
                    }
                }
                setTimeout(function() {})
                $scope.$broadcast('scroll.refreshComplete');
            })
        } else { $scope.logout() }
    }

    residentActionSheet.data = {};
    $scope.cnt = 0;
    $scope.featuresListarr = [];
    $scope.features = function() {

        if ($scope.isOnline() == true) {
            if ($rootScope.authoriedUser == true) {
                $scope.refreshDiv = false;
                var featureData = {
                    "users_id": $localStorage.User.user_id,
                    "user_type": $localStorage.User.user_type_id,
                    "token": $localStorage.User.token
                }
                $ionicLoading.show();
                getDynamicFeatures.features().save(featureData, function(res) {
                    console.log("$scope.featuresList: ", res.data);
                    $ionicLoading.hide();
                    residentActionSheet.data = res.data;
                    console.log("residentActionSheet.data: ", residentActionSheet.data);
                    angular.forEach(res.data, function(item) {

                        if (item.service_category_id._id === '5629c38a3949c780667d5c59' || item.service_category_id._id === '5629c3cc3949c780667d5c5a' || item.service_category_id._id === '5629c4de3949c780667d5c5e' || item.service_category_id._id === '5629c5583949c780667d5c5f' || item.service_category_id._id === '5629c5a53949c780667d5c60' || item.service_category_id._id === '58294041dead7337120f5d9b' || item.service_category_id._id === '5832b815fd9c8fb813d75cdd' || item.service_category_id._id === '5787357a61f925afa18240c1' || item.service_category_id._id === '5629c4143949c780667d5c5b') {
                            if ($rootScope.user_permissions) {
                                if (item.service_category_id._id == '5629c38a3949c780667d5c59') {
                                    if ($rootScope.user_permissions.Visitors) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Visitors');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5629c3cc3949c780667d5c5a') {
                                    if ($rootScope.user_permissions.Packages) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Packages');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5629c5a53949c780667d5c60') {
                                    if ($rootScope.user_permissions.Contacts) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Contacts');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c4763949c780667d5c5c") {
                                    if ($rootScope.user_permissions.Emergency_Work_Order) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Emergency_Work_Order');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == "5629c4a03949c780667d5c5d") {
                                    if ($rootScope.user_permissions.Normal_Work_Order) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Normal_Work_Order');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5629c4de3949c780667d5c5e') {
                                    if ($rootScope.user_permissions.Valet) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Valet');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5629c5583949c780667d5c5f') {
                                    if ($rootScope.user_permissions.Reservations) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Reservations');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '56a9e78bd42aba0fd731b1df') {
                                    if ($rootScope.user_permissions.News) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('News');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '56ab40b8d42aba0fd731b1e4') {
                                    if ($rootScope.user_permissions.Polls) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Polls');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5787386661f925afa18240c4') {
                                    if ($rootScope.user_permissions.Emergency) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Emergency');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5787389761f925afa18240c5') {
                                    if ($rootScope.user_permissions.General) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('General');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '58294041dead7337120f5d9b' || item.service_category_id._id == '5629c4143949c780667d5c5b') {
                                    if ($rootScope.user_permissions.Work_Orders) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Work');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5787357a61f925afa18240c1') {
                                    if ($rootScope.user_permissions.Newsfeed) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Newsfeed');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '578737d961f925afa18240c3') {
                                    if ($rootScope.user_permissions.Resident) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Resident');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '578737b261f925afa18240c2') {
                                    if ($rootScope.user_permissions.Management) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Management');
                                        $scope.featuresListarr.push(item);
                                    }
                                } else if (item.service_category_id._id == '5832b815fd9c8fb813d75cdd') {
                                    if ($rootScope.user_permissions.Management) {
                                        $scope.cnt = $scope.cnt + 1;
                                        console.log('Tasks');
                                        $scope.featuresListarr.push(item);
                                    }
                                }
                            } else {
                                $scope.cnt = $scope.cnt + 1;
                                $scope.featuresListarr.push(item);
                            }

                        }
                    });
                    //console.log("$scope.featuresListarr: ",$scope.featuresListarr);
                    console.log("$scope.cnt: ", $scope.cnt);
                    $scope.featuresList = res.data;
                    var serviceIdforprofile = $scope.featuresList[0]._id;
                    localStorage.setItem('currentFeature_idForProfile', serviceIdforprofile);
                    for (var i = 0; i < $scope.featuresList.length; i++) {
                        $scope.featuresList[i]._id;

                    };
                    $ionicLoading.hide();

                    $scope.featureNote(false);

                }, function(err) {
                    console.log("err", err);
                    $ionicLoading.hide();
                    $scope.refreshDiv = true;
                    console.log(err);

                })

            } else {
                $scope.logout();
            }
        } else {
            $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
        }
        console.log("$scope.featuresListarr: ", $scope.featuresListarr.length);
    }

    $scope.goProfile = function() {
        if (user_type_id == "4") {
            $state.go("editProfile");
        } else {
            $state.go("staff_profile");
        }
    }

    $scope.goback = function() {
        $ionicHistory.goBack(-1)
    }

    $scope.gofeatures = function(slug, id) {
        $ionicConfig.views.forwardCache(false);
        localStorage.setItem('currentFeature_id', id);
        localStorage.setItem('hideSlug', slug);
        if (slug == 'bgfd') {
            localStorage.setItem('currentFeature', 'bgfd');
            localStorage.setItem('slugNamewo', 'bgfd');
            $state.go("resi-notification");
            console.log("buzzzz")
        } else if (slug == 'pckg') {
            localStorage.setItem('currentFeature', 'pckg');
            localStorage.setItem('slugNamewo', 'pckg');
            $state.go("resi-notification-package")
            console.log("package")
        } else if (slug == 'wo') {
            localStorage.setItem('currentFeature', 'wo');
            $state.go('workorder');
        } else if (slug == 'cl') {
            localStorage.setItem('currentFeature', 'cl');
            localStorage.setItem('slugNamewo', 'cl');
            $state.go('cablightfrstpg');
        } else if (slug == 'rsvt') {
            localStorage.setItem('currentFeature', 'rsvt');
            localStorage.setItem('slugNamewo', 'rsvt');
            $state.go('rvstStartPg');
        } else if (slug == 'cmng') {
            // localStorage.setItem('currentFeature', 'cmng');
            // $state.go('cm-frstg');
        } else if (slug == 'newsfeed') {
            //localStorage.setItem('currentFeature', 'cmng');
            $state.go('newsfeeds');
        }
    }
    $scope.goToResiClearNoti = function() {
            $state.go('resiClearNoti')
        }
        // Milestone  2
    $scope.tabDocumentvault = function() {
        $scope.alertPopResi('Info', 'This feature is under progress...');
    }
    $scope.tabContact = function() {
        localStorage.setItem('currentFeature', 'cmng');
        $state.go('cm-frstg');

    }
    $scope.notiSound = globalShareService.data;
    $scope.notiSoundStatus = function(status) {
        globalShareService.data = status;
        console.log("globalShareService", globalShareService.data)


    }
})

.controller('resiClearNotiCtrl', function($scope, residentActionSheet, $ionicLoading, $localStorage, getFeatures, notifyCount, clearNotiService, $rootScope, staffFeatureList) {


    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    }
    $scope.clearNotiLabels = residentActionSheet.data;
    $ionicLoading.show();
    $scope.checkResiNotiData = function() {

        var notifycountData = {
            "users_id": $localStorage.User.user_id,
            "property_id": $localStorage.User.property_id,
            "token": $localStorage.User.token
        }

        notifyCount.notifyCount().save(notifycountData, function(res) {
            console.log("noti count ", res)
            $ionicLoading.hide()
            if (res.results.length == 0) {
                $scope.disableClearBtn = true;
            } else {
                $scope.disableClearBtn = false;
            }


        })
    }

    $scope.selectAll = function(value) {
        console.log(value)
        angular.forEach($scope.clearNotiLabels, function(item) {
            // console.log(item.service_category_id.slug=='wo')
            if (value) {
                item.selected = true;

            } else {
                item.selected = false;

            }

        });
    }
    $scope.passClearNotiData = function() {
        $ionicLoading.show();
        $scope.selectedArray = [];
        angular.forEach($scope.clearNotiLabels, function(item) {
            if (item.selected) {
                if (item.service_category_id.slug == 'wo') {
                    $scope.selectedArray.push("5629c4763949c780667d5c5c", "5629c4a03949c780667d5c5d");
                } else if (item.service_category_id.slug == 'newsfeed') {
                    console.log("Going to clear newsfeeds")
                    $scope.selectedArray.push("578737b261f925afa18240c2", "578737d961f925afa18240c3", "578738bc61f925afa18240c6", "5787389761f925afa18240c5", "5787386661f925afa18240c4", "56ab40b8d42aba0fd731b1e4", "56a9e78bd42aba0fd731b1df");
                } else {
                    $scope.selectedArray.push(item.service_category_id._id);
                }
            }

        });
        $scope.cleatNotiData = {
            "users_id": $localStorage.User.user_id,
            "services_category_id": $scope.selectedArray
        }
        console.log("final req data", $scope.cleatNotiData);
        if ($scope.cleatNotiData.services_category_id.length == 0) {
            $scope.alertPopResi('Alert', 'please select any feature to clear');
            $ionicLoading.hide();
        } else {

            clearNotiService.clearNoti().save($scope.cleatNotiData, function(res) {
                console.log("clearNotiRes", res);
                $ionicLoading.hide();
                if (res.code == 200) {
                    $scope.alertPopResi('Alert', res.message, 'sideMenu.features');
                } else {

                    $scope.alertPopResi('Alert', "Something went wrong");

                }

            })


        }

    }
})
