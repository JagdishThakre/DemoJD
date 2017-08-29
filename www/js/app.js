var app = angular.module("starter", [
  "ionic",
  "ionic.service.core",
  "ngIOS9UIWebViewPatch",
  "starter.controllers",
  "staff.controllers",
  "resident.controllers",
  "userServices",
  "ngStorage",
  "starter.directive",
  "ionic.service.push",
  "ngCordova",
  "jett.ionic.filter.bar",
  "ionic-timepicker",
  "flexcalendar",
  "ngAnimate",
  "ionic-countdown-picker",
  "angular.filter",
  "morphCarousel",
  "dbaq.ionNumericKeyboard",
  "naturalSort",
  "ion-datetime-picker",
  "base64",
  "ionic-letter-avatar",
  "ionic-multiselect",
  "ionic.closePopup",
  "mobiscroll-form",
  "mobiscroll-calendar",
  "mobiscroll-color",
  "mobiscroll-datetime",
  "mobiscroll-eventcalendar",
  "mobiscroll-image",
  "mobiscroll-listview",
  "mobiscroll-measurement",
  "mobiscroll-menustrip",
  "mobiscroll-number",
  "mobiscroll-numpad",
  "mobiscroll-page",
  "mobiscroll-range",
  "mobiscroll-rating",
  "mobiscroll-scroller",
  "mobiscroll-select",
  "mobiscroll-timer",
  "mobiscroll-timespan",
  "mobiscroll-list",
  "mobiscroll-widget"
]);
app.run(function(
  $ionicPlatform,
  $ionicPush,
  IonicClosePopupService,
  $state,
  $cordovaKeyboard,
  $ionicPopup,
  $localStorage,
  $window,
  $timeout,
  $rootScope,
  $cordovaDevice,
  notifyCount,
  $cordovaNativeAudio,
  $cordovaBadge,
  globalShareService,
  $cordovaAppVersion
) {
  $rootScope.$on("$ionicView.beforeEnter", function() {
    var whiteOverlay = document.querySelector('div.pane[nav-view="entering"]');
    if (whiteOverlay) {
      whiteOverlay.setAttribute("nav-view", "cache");
    }
  });
  // Invoke on device ready
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    // Set bundle_identifier in local storage
    localStorage.setItem("bundle_identifier", BuildInfo.packageName);
    // Set app_type in local storage
    localStorage.setItem("app_type", BuildInfo.packageName);
    $rootScope.bundle_identifier = BuildInfo.packageName;
    // Set the BG image here
    // localStorage.setItem('bgImg', 'img/bg-img.jpg');
    // Get the Background Images URL here

    // localStorage.setItem('bgImg', 'img/bg-img.jpg');
    // localStorage.setItem("propert_imgL", 'img/bg-img-land.jpg');
    // localStorage.setItem("propert_imgP", 'img/bg-img.jpg');
    // Get user permissions from local storage
    $rootScope.user_permissions = JSON.parse(
      localStorage.getItem("user_permissions")
    );
    // Get bundle_identifier from local storage
    $rootScope.bundle_identifier = localStorage.getItem("bundle_identifier");
    // Check for null permissions
    if (
      $rootScope.user_permissions == null ||
      $rootScope.user_permissions == undefined
    ) {
      var perm = {
        Visitors: true,
        Packages: true,
        Contacts: true,
        Valet: true,
        Reservations: true,
        News: true,
        Polls: true,
        Emergency: true,
        General: true,
        News: true,
        Emergency_Work_Order: true,
        Normal_Work_Order: true,
        Work_Orders: true,
        Newsfeed: true,
        Resident: true,
        Management: true
      };
      localStorage.setItem("user_permissions", JSON.stringify(perm));
      $rootScope.user_permissions = perm;
    }
    // localStorage.setItem('app_type', 'rise_work');
    //localStorage.setItem('app_type', 'rise_living');
    // Get the app type from login service and change the text according to it
    var property_type = localStorage.getItem("bundle_identifier");
    // localStorage.setItem("service_id", response.data.property_type);
    // Set labels for living now - They are changed as per app category in controller.js in login function
    var property_type = localStorage.getItem("app_key");
    if (
      property_type == undefined ||
      property_type == null ||
      property_type == ""
    ) {
      property_type = "rise_living";
    }
    // Check for app type and change all labels accordingly
    if (property_type == "rise_office") {
      $rootScope.rise_property = "Office Manager";
      $rootScope.rise_property_multiple = "Office Managers";
      $rootScope.rise_unit = "Suites";
      $rootScope.rise_unit_singleton = "Suite";
      console.log("Text set to Suites");
    } else if (property_type == "rise_living") {
      $rootScope.rise_property = "Resident";
      $rootScope.rise_property_multiple = "Residents";
      $rootScope.rise_unit = "Units";
      $rootScope.rise_unit_singleton = "Unit";
      console.log("Text set to Units");
    } else {
      $rootScope.rise_property = "Resident";
      $rootScope.rise_property_multiple = "Residents";
      $rootScope.rise_unit = "Units";
      $rootScope.rise_unit_singleton = "Unit";
      console.log("Text set to Units");
    }
  }
  $ionicPlatform.ready(function() {
    $rootScope.BGImages = [
      {
        id: 1,
        propert_imgP: "img/bg-img.jpg",
        propert_imgL: "img/bg-img-land.jpg"
      },
      {
        id: 2,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic1.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic1.jpg"
      },
      {
        id: 3,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic3.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic3.jpg"
      },
      {
        id: 4,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic4.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic4.jpg"
      },
      {
        id: 5,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic5.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic5.jpg"
      },
      {
        id: 6,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic6.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic6.jpg"
      },
      {
        id: 7,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic7.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic7.jpg"
      },
      {
        id: 8,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic2.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic2.jpg"
      },
      {
        id: 9,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic9.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic9.jpg"
      },
      {
        id: 10,
        propert_imgL:
          "https://admin.riseliving.co/assets/img/background/pic10.jpg",
        propert_imgP:
          "https://admin.riseliving.co/assets/img/background/pic10.jpg"
      }
    ];
    localStorage.setItem("BGImages", JSON.stringify($rootScope.BGImages));
    var bgImg = localStorage.getItem("bgImg");
    var propert_imgL = localStorage.getItem("propert_imgL");
    var propert_imgP = localStorage.getItem("propert_imgP");
    if (!bgImg) {
      localStorage.setItem("bgImg", $rootScope.BGImages[0].propert_imgL);
    }
    if (!propert_imgL) {
      localStorage.setItem("propert_imgL", $rootScope.BGImages[0].propert_imgL);
    }
    if (!propert_imgP) {
      localStorage.setItem("propert_imgP", $rootScope.BGImages[0].propert_imgP);
    }
    setTimeout(function() {
      navigator.splashscreen.hide();
    }, 100);
    var currentPlatform = ionic.Platform.platform();
    if (currentPlatform == "android" || currentPlatform == "ios") {
      localStorage.setItem("platform", "mobile");
      var device_info = {
        uuid: $cordovaDevice.getUUID(),
        model: $cordovaDevice.getModel(),
        platform: $cordovaDevice.getPlatform(),
        device_token: localStorage.getItem("pushToken"),
        version: $cordovaDevice.getVersion()
      };
      localStorage.setItem("device_info", JSON.stringify(device_info));
    } else {
      localStorage.setItem("platform", "web");
    }
    var isminiMized = false;
    cordova.plugins.Keyboard.disableScroll(true);
    document.addEventListener("pause", function() {
      isminiMized = true;
    });
    document.addEventListener(
      "resume",
      function() {
        $timeout(function() {
          isminiMized = false;
        }, 2000);
      },
      false
    );
    //Lock screen to portrait
    screen.orientation.lock("portrait");
    Ionic.io();
    // var confirmPopup = '';
    $rootScope.confirmPopup = "";
    $rootScope.isRedirect = true;
    var newsUserId = "";
    var state_id = [];
    var push = new Ionic.Push({
      pluginConfig: {
        ios: {
          sound: true,
          badge: true
        },
        android: {
          sound: true,
          badge: true
        }
      },
      onNotification: function(notification) {
        console.log(
          "on notification from serv",
          notification._raw.additionalData.$state,
          notification
        );
        console.log(" $rootScope.alertPopup", $rootScope.alertPopup);
        if ($rootScope.alertPopup) {
          $rootScope.alertPopup.close();
          $rootScope.alertPopup = "";
          console.log("closed", $rootScope.alertPopup);
        }
        $rootScope.$emit("parent", "popupdestroy");
        $rootScope.$emit("child", "Some data");
        // Goto function start
        var goTo = function(state, goState) {
          if (state == "service_details") {
            localStorage.setItem(
              "service_id",
              notification._raw.additionalData.state_id
            );
          } else if (state == "task_details") {
            localStorage.setItem(
              "taskDetails",
              notification._raw.additionalData.state_id
            );
          } else if (state == "task_manager_details") {
            localStorage.setItem(
              "taskManagerDetails",
              notification._raw.additionalData.state_id
            );
          } else if (state == "news_details") {
            localStorage.setItem(
              "news_id",
              notification._raw.additionalData.state_id
            );
          } else if (state == "workorder_details") {
            localStorage.setItem(
              "service_id",
              notification._raw.additionalData.state_id
            );
          } else if (state == "private_conversation") {
            localStorage.setItem("news_id", state_id[0]);
            localStorage.setItem("comment_id", state_id[1]);
          } else if (state == "visitorpckg_details") {
            localStorage.setItem(
              "service_id",
              notification._raw.additionalData.state_id
            );
          } else if (state == "workorder_manager_details") {
            localStorage.setItem(
              "service_id",
              notification._raw.additionalData.state_id
            );
          } else if (state == "poll_details") {
            console.log("staff-poll-details ", goState);
            localStorage.setItem(
              "pollDetails",
              notification._raw.additionalData.state_id
            );
          } else if (state == "guestdetails") {
            console.log("guestdetails ", goState);
            localStorage.setItem(
              "guestdetails",
              notification._raw.additionalData.state_id
            );
          }
          $rootScope.isRedirect = false;
          if (localStorage.getItem("user_type_id") == 3) {
            $state.go("sideMenuStaff.features");
          } else {
            $state.go("sideMenu.features");
          }
          $timeout(function() {
            $state.go(goState);
            console.log("Going to State Now..");
          }, 400);
        };
        // Goto function END
        //Function Name : notificationCtrl
        //Use: This function is used for controll the notification with different states
        var notificationCtrl = function() {
          console.log("notification from serv", notification);
          $localStorage.notiobject = notification;
          if ($localStorage.User.user_type_id == 3) {
            if (notification._raw.additionalData.$state == "activity_details") {
              // goTo(notification._raw.additionalData.$state, "staffnotificationthread");
              $state.go("activityDetails", {
                activity: notification._raw.additionalData.state_id
              });
            } else if (
              notification._raw.additionalData.$state == "service_details"
            ) {
              goTo(
                notification._raw.additionalData.$state,
                "staffnotificationthread"
              );
            } else if (
              notification._raw.additionalData.$state == "task_details"
            ) {
              goTo(notification._raw.additionalData.$state, "taskDetails");
            } else if (
              notification._raw.additionalData.$state == "task_manager_details"
            ) {
              goTo(
                notification._raw.additionalData.$state,
                "taskManagerDetails"
              );
            } else if (
              notification._raw.additionalData.$state == "news_details"
            ) {
              goTo(
                notification._raw.additionalData.$state,
                "staff-comment-details"
              );
            } else if (
              notification._raw.additionalData.$state == "private_conversation"
            ) {
              state_id = notification._raw.additionalData.state_id.split("-");
              if ($localStorage.User.user_id == state_id[2])
                goTo(
                  notification._raw.additionalData.$state,
                  "staff-private-conversation"
                );
              else
                goTo(
                  notification._raw.additionalData.$state,
                  "staffmarket-unit-comments"
                );
            } else if (
              notification._raw.additionalData.$state == "workorder_details"
            ) {
              goTo(
                notification._raw.additionalData.$state,
                "woDetailspgStaffView"
              );
            } else if (
              notification._raw.additionalData.$state ==
              "workorder_manager_details"
            ) {
              goTo(notification._raw.additionalData.$state, "woDetailspgStaff");
            } else if (
              notification._raw.additionalData.$state == "visitorpckg_details"
            ) {
              goTo(
                notification._raw.additionalData.$state,
                "staffnotificationthread"
              );
            } else if (
              notification._raw.additionalData.$state == "poll_details"
            ) {
              console.log("notificationCtrl -- Serve");
              goTo(
                notification._raw.additionalData.$state,
                "staff-poll-details"
              );
            }
          }
          if ($localStorage.User.user_type_id == 4) {
            if (notification._raw.additionalData.$state == "service_details") {
              goTo(notification._raw.additionalData.$state, "woNoitfythrd");
            } else if (
              notification._raw.additionalData.$state == "news_details"
            ) {
              goTo(notification._raw.additionalData.$state, "comment-details");
            } else if (
              notification._raw.additionalData.$state == "private_conversation"
            ) {
              state_id = notification._raw.additionalData.state_id.split("-");
              if ($localStorage.User.user_id == state_id[2])
                goTo(
                  notification._raw.additionalData.$state,
                  "private-conversation"
                );
              else
                goTo(
                  notification._raw.additionalData.$state,
                  "resident-marketplace-details"
                );
            } else if (
              notification._raw.additionalData.$state == "workorder_details"
            ) {
              goTo(notification._raw.additionalData.$state, "woDetailspgResi");
            } else if (
              notification._raw.additionalData.$state == "visitorpckg_details"
            ) {
              goTo(notification._raw.additionalData.$state, "DetailspgResiVp");
            } else if (
              notification._raw.additionalData.$state == "poll_details"
            ) {
              goTo(notification._raw.additionalData.$state, "poll-details");
            } else if (
              notification._raw.additionalData.$state == "guestdetails"
            ) {
              goTo(notification._raw.additionalData.$state, "guestdetails");
            }
          }
        };
        /************Push notification conform popup*******/
        var notificationObj = {
          title: notification._raw.additionalData.category,
          template: notification.text,
          okText: "View",
          cancelText: "Dismiss",
          cssClass: ""
        };
        notificationObj.cssClass =
          $localStorage.User.user_type_id == 3
            ? "my-custom-popup-staff"
            : "my-custom-popup-resi";
        if (
          $state.current.name.indexOf("staff_home_page") != -1 ||
          $state.current.name.indexOf("landing_page") != -1
        ) {
          notificationCtrl();
        } else if (
          $state.current.name.indexOf("woNoitfythrd") != -1 ||
          $state.current.name.indexOf("taskDetails") != -1 ||
          $state.current.name.indexOf("staffnotificationthread") != -1 ||
          $state.current.name.indexOf("woDetailspgStaff") != -1 ||
          $state.current.name.indexOf("woDetailspgResi") != -1
        ) {
          console.log("elseif first check of final pop up code");
          if (isminiMized == false) {
            if ($rootScope.confirmPopup != "") {
              $rootScope.confirmPopup.close();
              $rootScope.confirmPopup = "";
            }
            //*****make beep sound on notification arivial while app is in foreground mode*****//
            // $ionicPlatform.ready(function () {
            //     $cordovaNativeAudio.preloadSimple('beep', 'audio/beep.wav')
            //         .then(function (msg) { console.log(msg); })
            //         .catch(function (error) { console.error(error); });
            // });
            function play1(sound) {
              $cordovaNativeAudio
                .play(sound)
                .then(function(msg) {
                  console.log(msg);
                })
                .catch(function(error) {
                  console.error(error);
                });
            }
            //*****make beep sound on notification arivial while app is in foreground mode ends here*****//
            setTimeout(function() {
              /*if (globalShareService.data) {
                                              play1('beep')
                                          } else {
                                              console.log("beep sound is disabled")
                                            }*/
              $rootScope.confirmPopup = $ionicPopup.confirm(notificationObj);
              $rootScope.confirmPopup.then(function(res) {
                console.log(res);
                if (res) {
                  console.log("View more button confirm box");
                  /*push routing for visitor and package start*/
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state ==
                      "visitorpckg_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("service_id")
                    ) {
                      $state.reload("staffnotificationthread");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "staffnotificationthread"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 4 &&
                    notification._raw.additionalData.$state ==
                      "visitorpckg_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("service_id")
                    ) {
                      $state.reload("DetailspgResiVp");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "DetailspgResiVp"
                      );
                    }
                  }
                  /*push routing for visitor and package ends */
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state == "service_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("service_id")
                    ) {
                      $state.reload("staffnotificationthread");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "staffnotificationthread"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 4 &&
                    notification._raw.additionalData.$state == "service_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("service_id")
                    ) {
                      $state.reload("woNoitfythrd");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "woNoitfythrd"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state == "task_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("service_id")
                    ) {
                      $state.reload("taskDetails");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "taskDetails"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state ==
                      "task_manager_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("service_id")
                    ) {
                      $state.reload("taskManagerDetails");
                    } else {
                      // $state.go('taskManagerDetails');
                      goTo(
                        notification._raw.additionalData.$state,
                        "taskManagerDetails"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state == "news_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("news_id")
                    ) {
                      $state.reload("staff-comment-details");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "staff-comment-details"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state ==
                      "private_conversation"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                        localStorage.getItem("news_id") &&
                      notification._raw.additionalData.comment_id ==
                        localStorage.getItem("news_comment_id")
                    ) {
                      $state.reload("staff-private-conversation");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "staff-private-conversation"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 4 &&
                    notification._raw.additionalData.$state == "news_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("news_id")
                    ) {
                      $state.reload("resident-general-details");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "resident-general-details"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 4 &&
                    notification._raw.additionalData.$state ==
                      "private_conversation"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                        localStorage.getItem("news_id") &&
                      notification._raw.additionalData.comment_id ==
                        localStorage.getItem("news_comment_id")
                    ) {
                      $state.reload("private-conversation");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "private-conversation"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state ==
                      "workorder_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("taskDetails")
                    ) {
                      $state.reload("woDetailspgStaffView");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "woDetailspgStaffView"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state ==
                      "workorder_manager_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("taskManagerDetails")
                    ) {
                      $state.reload("woDetailspgStaff");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "woDetailspgStaff"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 4 &&
                    notification._raw.additionalData.$state ==
                      "workorder_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("service_id")
                    ) {
                      $state.reload("woDetailspgResi");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "woDetailspgResi"
                      );
                    }
                  }
                  if (
                    $localStorage.User.user_type_id == 3 &&
                    notification._raw.additionalData.$state == "poll_details"
                  ) {
                    if (
                      notification._raw.additionalData.state_id ==
                      localStorage.getItem("pollDetails")
                    ) {
                      $state.reload("staff-poll-details");
                    } else {
                      goTo(
                        notification._raw.additionalData.$state,
                        "staff-poll-details"
                      );
                    }
                  }
                  console.log("inside view");
                } else {
                  console.log("cancle confirm box", "inside dismiss");
                  $localStorage.notiobject = null;
                  $rootScope.confirmPopup.close();
                  isminiMized == true;
                }
              });
            }, 200);
          } else {
            console.log(
              "else of second else if condition except home page n all pop up code"
            );
            notificationCtrl();
          }
        } else {
          if (isminiMized == false) {
            if ($rootScope.confirmPopup != "") {
              $rootScope.confirmPopup.close();
              $rootScope.confirmPopup = "";
            }
            //*****make beep sound on notification arivial while app is in foreground mode*****//
            $ionicPlatform.ready(function() {
              // $cordovaNativeAudio.preloadSimple('beep', 'audio/beep.wav')
              //     .then(function (msg) { console.log(msg);
              //     play2('beep');})
              //     .catch(function (error) { console.error(error); });
              openpopup();
            });

            function play2(sound) {
              $cordovaNativeAudio
                .play(sound)
                .then(function(msg) {
                  console.log(msg);
                  openpopup();
                })
                .catch(function(error) {
                  console.error(error);
                });
            }
            // if (globalShareService.data) {
            //         alert("play beep");
            //         play('beep')
            //     } else {
            //         console.log("beep sound is disabled")
            //     }
            function openpopup() {
              console.log("ccsdcv");
              $rootScope.confirmPopup = $ionicPopup.confirm(notificationObj);
              $rootScope.confirmPopup.then(function(res) {
                console.log("res", res);
                if (res) {
                  notificationCtrl();
                } else {
                  console.log(
                    "$rootScope.confirmPopupapp.js",
                    $rootScope.confirmPopup
                  );
                  IonicClosePopupService.register($rootScope.confirmPopup);
                  // $rootScope.$on('parent', function(event, data) {
                  //     console.log("parent*****", data); // 'Some data'
                  //     $rootScope.confirmPopup.close();
                  // });
                  // $state.reload();
                  // $rootScope.confirmPopup.close();
                  // $rootScope.confirmPopup = '';
                  // console.log("reload");
                }
              });
            }
            //*****make beep sound on notification arivial while app is in foreground mode ends here*****//
            // setTimeout(function () {
            //     if (globalShareService.data) {
            //         alert("play beep");
            //         play('beep')
            //     } else {
            //         console.log("beep sound is disabled")
            //     }
            //     confirmPopup = $ionicPopup.confirm(notificationObj);
            //     alert("popup",confirmPopup);
            //     confirmPopup.then(function (res) {
            //         if (res) {
            //             notificationCtrl();
            //         }
            //     });
            // }, 2000);
          } else {
            console.log("else of final pop up code");
            notificationCtrl();
          }
        }
        if ($ionicPopup._popupStack.length > 0) {
          console.log("inside _popupStack");
          $ionicPopup._popupStack.forEach(function(popup, index) {
            console.log("popup", popup);
            console.log("index", index);
            console.log("outside isShown", popup.isShown);
            // if (popup.isShown === true) {
            //     return popup.hide();
            // }
            if (popup.isShown === true) {
              console.log("inside isShown", popup.isShown);
              popup.remove();
              popupStack.pop();
            }
          });
        }
      }
    });
    push.register(function(token) {
      console.log("Device token:", token.token);
      localStorage.setItem("pushToken", token.token);
      var device_info = {
        uuid: $cordovaDevice.getUUID(),
        model: $cordovaDevice.getModel(),
        platform: $cordovaDevice.getPlatform(),
        device_token: localStorage.getItem("pushToken"),
        version: $cordovaDevice.getVersion()
      };
      localStorage.setItem("device_info", JSON.stringify(device_info));
    });
    if (
      window.cordova &&
      window.cordova.plugins &&
      window.cordova.plugins.Keyboard
    ) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
    // checking the app is newly installed then clear the badge count
    if (!$localStorage.User) {
      $cordovaBadge.hasPermission().then(
        function(yes) {
          $cordovaBadge.clear().then(
            function() {
              // You have permission, badge cleared.
            },
            function(err) {
              // You do not have permission.
            }
          );
        },
        function(no) {
          // You do not have permission
        }
      );
    }
    // if android version is morethan 6 or above provide permissions starts
    var isAndroid;
    var androidVersion;
    isAndroid = ionic.Platform.isAndroid();
    androidVersion = ionic.Platform.version();
    if (isAndroid == true && androidVersion >= 6) {
      var permissions = cordova.plugins.permissions;
      permissions.hasPermission(
        permissions.READ_EXTERNAL_STORAGE,
        checkPermissionCallback,
        null
      );

      function checkPermissionCallback(status) {
        if (!status.hasPermission) {
          var errorCallback = function() {
            console.warn("Storage permission is not turned on");
          };
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function(status) {
              if (!status.hasPermission) {
                errorCallback();
              } else {
                console.log("permission after request");
              }
            },
            errorCallback
          );
        } else {
          console.log("ALready have permission");
        }
      }
    }
    //if android version is morethan 6 or above provide permissions starts ends here
  });
});
