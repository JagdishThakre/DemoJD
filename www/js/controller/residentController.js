angular
  .module("resident.controllers", [])
  .controller("HeaderCtrl", function(
    $scope,
    $rootScope,
    $window,
    $ionicModal,
    $ionicConfig,
    loginService,
    getDynamicFeatures,
    $cordovaBadge,
    $ionicConfig,
    $ionicActionSheet,
    CONFIG,
    $state,
    $localStorage,
    $cordovaNetwork,
    buzzaguessService,
    $ionicHistory,
    $ionicLoading,
    logoutService,
    $cordovaDevice,
    $ionicPopup,
    notifyCount,
    staffFeatureList,
    residentActionSheet
  ) {
    var platform = ionic.Platform.platform();
    $scope.userimg = $localStorage.User.profile_img;
    $scope.bgColour = $localStorage.User.color;
    $scope.firstName = $localStorage.User.firstname;
    $scope.lastName = $localStorage.User.lastname;
    $ionicConfig.views.transition(platform);
    $rootScope.isAuthorized = function() {
      var currentPlatform = ionic.Platform.platform();
      if (currentPlatform == "android" || currentPlatform == "ios") {
        //console.log("Taking device info in headerCtrl")
        var homeData = {
          device_info: $scope.ConstantsInfo(),
          user_id: $localStorage.User.user_id,
          token: $localStorage.User.token,
          units_id: $localStorage.User.units_id,
          property_id: $localStorage.User.property_id,
          resident_roles_id: $localStorage.User.resident_roles_id
        };
      } else {
        //console.log("Taking hardcode device info in headerCtrl")
        var device_info = {
          uuid: "83E75D61-6B1B-45CA-AC51-632F24DCD192",
          model: "iPhone7.1",
          platform: "iOS",
          device_token:
            "6c042ba9c5d9737f424e2d83dd2b45ce9c4953fdc023c9fab992ac74e3c282c9"
        };
        var homeData = {
          device_info: device_info,
          user_id: $localStorage.User.user_id,
          token: $localStorage.User.token,
          units_id: $localStorage.User.units_id,
          property_id: $localStorage.User.property_id,
          resident_roles_id: $localStorage.User.resident_roles_id
        };
      }

      // $rootScope.authoriedUser = false;
      console.log($rootScope.authoriedUser);
      loginService.isAuthorized().save(homeData, function(res) {
        console.log("isAuthorized", res);
        if (res.code == 200) {
          $rootScope.authoriedUser = res.status;
          console.log($scope.authoriedUser);
        } else if (res.code == 201) {
          $ionicLoading.hide();
          $scope.alertPopResi(
            "Alert",
            "Your account has been de-activated, please contact your Property Manager for activation. Logging Out"
          );
          $scope.logout();
        } else if (res.code == 401) {
          $ionicLoading.hide();
          $scope.alertPopResi("Alert", res.message);
          $scope.logout();
        }
      });
    };
    //$rootScope.isAuthorized();
    $rootScope.authoriedUser = true;

    var user_type_id = $localStorage.User.user_type_id;
    $rootScope.notifycount = "" | 0;
    $scope.countforGuests = "";
    $scope.countforPkgs = "";

    $scope.gofeature = function() {
      $state.go("sideMenu.features");
      $ionicLoading.hide();
    };

    $scope.goback = function(slug) {
      $rootScope.searching = false;
      $ionicConfig.views.forwardCache(false);
      var PlatformForBackBtn = ionic.Platform.platform();
      var lastpage = $ionicHistory.backView();

      var backpage = $ionicHistory.forwardView();

      if (PlatformForBackBtn == "android") {
        $ionicConfig.views.transition("android");
      } else if (PlatformForBackBtn == "ios") {
        $ionicConfig.views.transition("ios");
      }
      if (slug == "rsvt") {
        if ($localStorage.notiobject) {
          $localStorage.notiobject = null;
          $state.go("sideMenu.features");
        } else {
          $state.go("rvstListingPg");
        }
      } else {
        $ionicConfig.views.maxCache(0);
        // window.history.back(-1);
        if (backpage == null) {
          if (lastpage == null) {
            window.history.back(-1);
          } else if (lastpage.stateName == "preauth") {
            console.log("guestss");
            $state.go("sideMenu.features");
          } else if (lastpage.stateName == "editpreauth") {
            console.log("guestss editpreauth");
            $state.go("sideMenu.features");
          } else {
            window.history.back(-1);
          }
        } else if (slug == 1 && backpage.stateName == "woNoitfythrd") {
          if ($localStorage.User.user_type_id == 4) {
            $state.go("sideMenu.features");
          }
        } else {
          console.log("else");
          window.history.back(-1);
        }
      }
      // screen.unlockOrientation();
    };

    $scope.clearAll = function(searchFilter) {
      console.log("$scope.guestname", $rootScope.guestname, searchFilter);
      $scope.guestname = "";
      $scope.guestphone = "";
      $scope.guestemail = "";
    };

    $scope.globalNote = function() {
      $rootScope.notifycount;
      console.log($rootScope.notifycount);
    };

    $scope.reslist = [];
    $scope.getfeatures = (function() {
      var featureData = {
        users_id: $localStorage.User.user_id,
        user_type: $localStorage.User.user_type_id,
        version: $localStorage.appversion,
        token: $localStorage.User.token
      };
      console.log("featureData******************", JSON.stringify(featureData));
      $ionicLoading.show();
      getDynamicFeatures.features().save(
        featureData,
        function(res) {
          $ionicLoading.hide();
          if (res.code == 200) {
            angular.forEach(res.data, function(item) {
              /*if(item.service_category_id._id == '5629c38a3949c780667d5c59' || item.service_category_id._id == '5629c3cc3949c780667d5c5a' || item.service_category_id._id == '5629c4de3949c780667d5c5e'
                        || item.service_category_id._id == '5629c5583949c780667d5c5f' || item.service_category_id._id == '5629c5a53949c780667d5c60' || item.service_category_id._id == '58294041dead7337120f5d9b' ||
                        item.service_category_id._id == '5832b815fd9c8fb813d75cdd' || item.service_category_id._id == '5787357a61f925afa18240c1' || item.service_category_id._id == '5629c4143949c780667d5c5b'){
                        $scope.cnt = $scope.cnt + 1;
                        $scope.featuresListarr.push(item);
                    }*/
              if (
                item.service_category_id._id === "5629c38a3949c780667d5c59" ||
                item.service_category_id._id === "5629c3cc3949c780667d5c5a" ||
                item.service_category_id._id === "5629c4de3949c780667d5c5e" ||
                item.service_category_id._id === "5629c5583949c780667d5c5f" ||
                item.service_category_id._id === "5629c5a53949c780667d5c60" ||
                item.service_category_id._id === "58294041dead7337120f5d9b" ||
                item.service_category_id._id === "5832b815fd9c8fb813d75cdd" ||
                item.service_category_id._id === "5787357a61f925afa18240c1" ||
                item.service_category_id._id === "5629c4143949c780667d5c5b"
              ) {
                //$scope.cnt = $scope.cnt + 1;
                $scope.reslist.push(item);
              }
            });
          } else if (res.code == 301) {
            $ionicLoading.hide();
            var currentPlatform = ionic.Platform.platform();

            $scope.bellalertPopup = $ionicPopup.alert({
              title: "Update App",
              templateUrl: "templates/Resident/appUpdateNotiPopup.html"
            });

            $scope.bellalertPopup.then(function(res) {
              if (res) {
                console.log("currentPlatform", currentPlatform);
                if (currentPlatform == "android") {
                  $window.open(
                    "https://play.google.com/store/apps/details?id=com.riseliving.rise&hl=en",
                    "_system"
                  );
                  console.log("if");
                  $scope.bellalertPopup.close();
                } else {
                  $window.open(
                    "https://itunes.apple.com/us/app/rise-living/id1117019183?ls=1&mt=8",
                    "_system"
                  );
                }
              } else {
                console.log("else");
              }
            });
          }
        },
        function(err) {
          console.log("err", err);
          $ionicLoading.hide();
          $scope.refreshDiv = true;
          console.log(err);
        }
      );
    })();

    // $scope.features = function() {

    //     if ($scope.isOnline() == true) {
    //         if ($rootScope.authoriedUser == true) {
    //             $scope.refreshDiv = false;
    //             var featureData = {
    //                 "users_id": $localStorage.User.user_id,
    //                 "user_type": $localStorage.User.user_type_id,
    //                 "token": $localStorage.User.token
    //             }
    //             $ionicLoading.show();
    //             getDynamicFeatures.features().save(featureData, function(res) {
    //                 console.log("$scope.featuresList: ",res.data);
    //                 $ionicLoading.hide();
    //                 residentActionSheet.data = res.data;
    //                 console.log("residentActionSheet.data: ",residentActionSheet.data);
    //                 angular.forEach(res.data, function(item){
    //                     /*if(item.service_category_id._id == '5629c38a3949c780667d5c59' || item.service_category_id._id == '5629c3cc3949c780667d5c5a' || item.service_category_id._id == '5629c4de3949c780667d5c5e'
    //                         || item.service_category_id._id == '5629c5583949c780667d5c5f' || item.service_category_id._id == '5629c5a53949c780667d5c60' || item.service_category_id._id == '58294041dead7337120f5d9b' ||
    //                         item.service_category_id._id == '5832b815fd9c8fb813d75cdd' || item.service_category_id._id == '5787357a61f925afa18240c1' || item.service_category_id._id == '5629c4143949c780667d5c5b'){
    //                         $scope.cnt = $scope.cnt + 1;
    //                         $scope.featuresListarr.push(item);
    //                     }*/
    //                     console.log("ITEM: ",item);
    //                     if(item.service_category_id._id === '5629c38a3949c780667d5c59' || item.service_category_id._id ===  '5629c3cc3949c780667d5c5a' || item.service_category_id._id === '5629c4de3949c780667d5c5e' || item.service_category_id._id === '5629c5583949c780667d5c5f' || item.service_category_id._id === '5629c5a53949c780667d5c60' || item.service_category_id._id === '58294041dead7337120f5d9b' || item.service_category_id._id === '5832b815fd9c8fb813d75cdd' || item.service_category_id._id === '5787357a61f925afa18240c1' || item.service_category_id._id === '5629c4143949c780667d5c5b' ){
    //                         $scope.cnt = $scope.cnt + 1;
    //                         $scope.featuresListarr.push(item);
    //                     }
    //                 });
    //                 //console.log("$scope.featuresListarr: ",$scope.featuresListarr);
    //                 console.log("$scope.cnt: ",$scope.cnt);
    //                 $scope.featuresList = res.data;
    //                 var serviceIdforprofile = $scope.featuresList[0]._id;
    //                 localStorage.setItem('currentFeature_idForProfile', serviceIdforprofile);
    //                 for (var i = 0; i < $scope.featuresList.length; i++) {
    //                     $scope.featuresList[i]._id;

    //                 };
    //                 $ionicLoading.hide();

    //                 $scope.featureNote(false);

    //             }, function(err) {
    //                 console.log("err", err);
    //                 $ionicLoading.hide();
    //                 $scope.refreshDiv = true;
    //                 console.log(err);

    //             })

    //         } else {
    //             $scope.logout();
    //         }
    //     } else {
    //         $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
    //     }
    //     console.log("$scope.featuresListarr: ",$scope.featuresListarr.length);
    // }

    /*$scope.featureNote = function() {
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
                         var badgeSetCount=res.totalcount;
                        $cordovaBadge.set(badgeSetCount).then(function() {
                            // You have permission, badge set.
                        }, function(err) {
                            console.log("Error occurred in badge count",err)
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
                setTimeout(function() {
                })
                $scope.$broadcast('scroll.refreshComplete');
            })
        } else { $scope.logout() }
    }*/
    $scope.showActionsheet = function() {
      $state.go("sideMenu.features");
      /*
                $scope.count1 = [];
                $scope.featuresList = $scope.reslist;
                var actionsheetchangeclass = (user_type_id == 4) ? 'custom-action-sheet' : 'custom-action-sheet_staff';

                var temp = [];
                temp.push({
                    cat_slug: 'home',
                    text: ' <div class="' + actionsheetchangeclass + '"> <i class="ion-home actionSheetIcon"></i>&nbsp&nbsp Home</div>'
                });
                angular.forEach($scope.featuresList, function(data, index) {
                    //$scope.featuresList.forEach(function(data, index) {
                    if (data.service_category_id.slug != 'tasks' && data.service_category_id.slug != 'ewo' && data.service_category_id.slug != 'nwo' && data.service_category_id.slug != 'news' && data.service_category_id.slug != 'poll' && data.service_category_id.slug != 'emrgncy' && data.service_category_id.slug != 'rsdnt' && data.service_category_id.slug != 'mngmnt' && data.service_category_id.slug != 'gnrl' && data.service_category_id.slug != 'mrktplc' && data.service_category_id.slug != 'rsdnt') {
                        temp.push({
                            cat_slug: data.service_category_id.slug,
                            text: ' <div class="' + actionsheetchangeclass + '"> <i class="' + data.service_category_id.icon + ' actionSheetIcon "></i><span>&nbsp&nbsp ' + data.service_category_id.name + ' </span></div>'
                        });
                    }
                })
                $ionicActionSheet.show({
                    buttons: temp,
                    buttonClicked: function(index) {
                        //screen.unlockOrientation();
                        var statename = $ionicHistory.currentStateName();
                        console.log("temp[index]", index)
                        console.log("temp[index].cat_slug", temp[index].cat_slug);
                        if (temp[index].cat_slug == 'wo') {
                            if (statename == 'workorder') {
                                $state.reload();
                            } else {
                                localStorage.setItem('currentFeature_id', '5629c4143949c780667d5c5b');
                                localStorage.setItem('currentFeature', 'wo');
                                localStorage.setItem('slugNamewo', 'wo');
                                $state.go('workorder');
                            }

                        } else if (temp[index].cat_slug == 'newsfeed') {
                            if (statename == 'newsfeeds') {
                                $state.reload();

                            } else {
                                localStorage.setItem('currentFeature', 'nsfeed');
                                localStorage.setItem('slugNamewo', 'nsfeed');
                                $state.go('newsfeeds');
                            }

                        } else if (temp[index].cat_slug == 'rsvt') {
                            if (statename == 'rvstStartPg') {
                                $state.reload();
                            } else {
                                localStorage.setItem('currentFeature_id', '5629c5583949c780667d5c5f');
                                localStorage.setItem('currentFeature', 'rsvt');
                                localStorage.setItem('slugNamewo', 'rsvt');
                                $state.go('rvstStartPg');
                            }

                        } else if (temp[index].cat_slug == 'home') {
                            if (statename == 'sideMenu.features') {
                                $state.reload();
                            } else {
                                $state.go('sideMenu.features');

                            }
                        } else if (temp[index].cat_slug == 'cmng') {
                            if (statename == "cm-frstg") {
                                $state.reload();

                            } else {
                                $state.go('cm-frstg');

                            }
                        } else if (temp[index].cat_slug == 'cl') {
                            if (statename == "cablightfrstpg") {
                                $state.reload();

                            } else {
                                $state.go('cablightfrstpg');

                            }
                        } else if (temp[index].cat_slug == 'pckg') {
                            if (statename == 'resi-notification-package') {
                                $state.reload();

                            } else {
                                localStorage.setItem('currentFeature_id', '5629c3cc3949c780667d5c5a');
                                localStorage.setItem('currentFeature', 'pckg');
                                localStorage.setItem('slugNamewo', 'pckg');
                                $state.go('resi-notification-package');
                            }

                        } else if (temp[index].cat_slug == 'bgfd') {
                            if (statename == 'resi-notification') {
                                $state.reload();
                            } else {
                                localStorage.setItem('currentFeature_id', '5629c38a3949c780667d5c59');
                                localStorage.setItem('currentFeature', 'bgfd');
                                localStorage.setItem('slugNamewo', 'bgfd');
                                $state.go('resi-notification');
                            }

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
  });
