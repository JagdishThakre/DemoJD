var app = angular.module('starter', ['ionic', 'ionic.service.core', 'ngIOS9UIWebViewPatch', 'starter.controllers', 'staff.controllers', 'resident.controllers', 'userServices', 'ngStorage', 'starter.directive', 'ionic.service.push', 'ngCordova', 'jett.ionic.filter.bar', 'ionic-timepicker', 'flexcalendar', 'ngAnimate', 'ionic-countdown-picker', 'angular.filter', 'morphCarousel', 'dbaq.ionNumericKeyboard', 'naturalSort','ion-datetime-picker','base64','ionic-letter-avatar','ionic.closePopup']);

app.run(function($ionicPlatform, $ionicPush, $state, $cordovaKeyboard, $ionicPopup, $localStorage, $window, $timeout, $rootScope, $cordovaDevice, notifyCount, $cordovaNativeAudio, $cordovaBadge, globalShareService, IonicClosePopupService) {
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var whiteOverlay = document.querySelector('div.pane[nav-view="entering"]');
        if (whiteOverlay) {
            whiteOverlay.setAttribute('nav-view', 'cache');
        }
    });
    localStorage.setItem('bgImg', 'img/bg-img.jpg');
    $ionicPlatform.ready(function() {
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 100);
        var currentPlatform = ionic.Platform.platform();
        if (currentPlatform == 'android' || currentPlatform == 'ios') {
            localStorage.setItem('platform', 'mobile');
            var device_info = {
                uuid: $cordovaDevice.getUUID(),
                model: $cordovaDevice.getModel(),
                platform: $cordovaDevice.getPlatform(),
                device_token: localStorage.getItem("pushToken"),
                version: $cordovaDevice.getVersion()
            }
            localStorage.setItem('device_info', JSON.stringify(device_info));

        } else {
            localStorage.setItem('platform', 'web');
        }
        var isminiMized = false;
        cordova.plugins.Keyboard.disableScroll(true);
        document.addEventListener("pause", function() {
            isminiMized = true;
        });
        document.addEventListener("resume", function() {
            $timeout(function() {
                isminiMized = false;
            }, 2000);

        }, false);

        Ionic.io();
        var confirmPopup = '';
        $rootScope.isRedirect = true;

        var newsUserId = '';
        var state_id = [];

        var push = new Ionic.Push({
            pluginConfig: {
                "ios": {
                    "sound": true,
                    "badge": true
                },
                "android": {
                    "sound": true,
                    "badge": true
                }
            },
            onNotification: function(notification) {
                //alert(JSON.stringify(notification));
                    console.log(" on notification from serv",notification)
                var goTo = function(state, goState) {
                        if (state == 'service_details') {
                            localStorage.setItem("service_id", notification._raw.additionalData.state_id);
                        } else if (state == 'task_details') {
                            localStorage.setItem("taskDetails", notification._raw.additionalData.state_id);
                        }else if (state == 'task_manager_details') {
                            localStorage.setItem("taskManagerDetails", notification._raw.additionalData.state_id);
                        } else if (state == 'news_details') {
                            localStorage.setItem("news_id", notification._raw.additionalData.state_id);
                        } else if (state == 'workorder_details') {
                            localStorage.setItem("service_id", notification._raw.additionalData.state_id);
                        } else if (state == 'private_conversation') {
                            localStorage.setItem("news_id", state_id[0]);
                            localStorage.setItem("comment_id", state_id[1]);
                        } else if (state == 'visitorpckg_details') {
                            localStorage.setItem("service_id", notification._raw.additionalData.state_id);
                        }else if (state == 'workorder_manager_details') {
                            localStorage.setItem("service_id", notification._raw.additionalData.state_id);
                        }else if(state == 'poll_details'){
                            console.log("staff-poll-details ",goState);
                            localStorage.setItem("pollDetails", notification._raw.additionalData.state_id);
                        }
                        $rootScope.isRedirect = false;
                        if (localStorage.getItem('user_type_id') == 3) {
                            $state.go('sideMenuStaff.features');
                        } else {
                            $state.go('sideMenu.features');
                        }
                        $timeout(function() {
                            $state.go(goState);
                            console.log("App.js Timeout..!");
                        }, 400);
                    }
                    //Function Name : notificationCtrl
                    //Use: This function is used for controll the notification with different states
                var notificationCtrl = function() {

                    console.log("notification from serv",notification)
                        if ($localStorage.User.user_type_id == 3) {
                            if (notification._raw.additionalData.$state == 'service_details') {
                                goTo(notification._raw.additionalData.$state, 'staffnotificationthread');
                            } else if (notification._raw.additionalData.$state == 'task_details') {
                                goTo(notification._raw.additionalData.$state, 'taskDetails');
                            }
                             else if (notification._raw.additionalData.$state == 'task_manager_details') {
                                goTo(notification._raw.additionalData.$state, 'taskManagerDetails');
                            } else if (notification._raw.additionalData.$state == 'news_details') {
                                goTo(notification._raw.additionalData.$state, 'staff-comment-details');
                            } else if (notification._raw.additionalData.$state == 'private_conversation') {
                                state_id = notification._raw.additionalData.state_id.split('-');
                                if ($localStorage.User.user_id == state_id[2])
                                    goTo(notification._raw.additionalData.$state, 'staff-private-conversation');
                                else
                                    goTo(notification._raw.additionalData.$state, 'staffmarket-unit-comments');
                            } else if (notification._raw.additionalData.$state == 'workorder_details') {
                                goTo(notification._raw.additionalData.$state, 'woDetailspgStaffView');
                            }
                            else if (notification._raw.additionalData.$state == 'workorder_manager_details') {
                                goTo(notification._raw.additionalData.$state, 'woDetailspgStaff');
                            } else if (notification._raw.additionalData.$state == 'visitorpckg_details') {
                                goTo(notification._raw.additionalData.$state, 'staffnotificationthread');
                            } else if (notification._raw.additionalData.$state == 'poll_details') {
                                console.log("notificationCtrl -- Serve");
                                goTo(notification._raw.additionalData.$state, 'staff-poll-details');
                            }
                        } else if ($localStorage.User.user_type_id == 4) {
                            if (notification._raw.additionalData.$state == 'service_details') {
                                goTo(notification._raw.additionalData.$state, 'woNoitfythrd');
                            } else if (notification._raw.additionalData.$state == 'news_details') {
                                goTo(notification._raw.additionalData.$state, 'comment-details');
                            } else if (notification._raw.additionalData.$state == 'private_conversation') {
                                state_id = notification._raw.additionalData.state_id.split('-');
                                if ($localStorage.User.user_id == state_id[2])
                                    goTo(notification._raw.additionalData.$state, 'private-conversation');
                                else
                                    goTo(notification._raw.additionalData.$state, 'market-unit-comments');
                            } else if (notification._raw.additionalData.$state == 'workorder_details') {
                                goTo(notification._raw.additionalData.$state, 'woDetailspgResi');
                            } else if (notification._raw.additionalData.$state == 'visitorpckg_details') {
                                goTo(notification._raw.additionalData.$state, 'DetailspgResiVp');
                            } else if (notification._raw.additionalData.$state == 'poll_details') {
                                goTo(notification._raw.additionalData.$state, 'poll-details');
                            }
                        }
                    }
                    /************Push notification conform popup*******/
                var notificationObj = {
                    title: notification._raw.additionalData.category,
                    template: notification.text,
                    okText: 'View',
                    cancelText: 'Dismiss',
                    cssClass: ''
                }

                var notificationObj1 = {
                    title: notification._raw.additionalData.category,
                    template: notification.text,
                    okText: 'View',
                    cancelText: 'Dismiss',
                    cssClass: ''
                }
                notificationObj.cssClass = ($localStorage.User.user_type_id == 3) ? 'my-custom-popup-staff' : 'my-custom-popup-resi';
                notificationObj1.cssClass = ($localStorage.User.user_type_id == 3) ? 'my-custom-popup-staff' : 'my-custom-popup-resi';

                if ($state.current.name.indexOf('staff_home_page') != -1 || $state.current.name.indexOf('landing_page') != -1) {
                    notificationCtrl();
                } else if ($state.current.name.indexOf('woNoitfythrd') != -1 || $state.current.name.indexOf('taskDetails') != -1 || $state.current.name.indexOf('staffnotificationthread') != -1 || $state.current.name.indexOf('woDetailspgStaff') != -1 || $state.current.name.indexOf('woDetailspgResi') != -1) {
                    if (isminiMized == false) {
                        if (confirmPopup != '') {
                            confirmPopup.close();
                            confirmPopup = '';
                        }

                        if($localStorage.hidepopup){
                            console.log("inside hide poupup");
                        IonicClosePopupService.register(confirmPopup);
                         
                        }

                        //*****make beep sound on notification arivial while app is in foreground mode*****//
                        $ionicPlatform.ready(function() {
                            $cordovaNativeAudio.preloadSimple('beep', 'audio/beep.wav')
                                .then(function(msg) { console.log(msg); })
                                .catch(function(error) { console.error(error); });

                        });

                        function play(sound) {
                            $cordovaNativeAudio.play(sound)
                                .then(function(msg) { console.log(msg); })
                                .catch(function(error) { console.error(error); });
                        };

                        //*****make beep sound on notification arivial while app is in foreground mode ends here*****//
                        setTimeout(function() {
                            if (globalShareService.data) {
                                play('beep')
                            } else {
                                console.log("beep sound is disabled")
                            }
                            confirmPopup = $ionicPopup.confirm(notificationObj1);
                            confirmPopup.then(function(res) {
                                console.log("333333333333333333333333",res);
                                if(res==true){
                                IonicClosePopupService.register(confirmPopup);

                                    if($localStorage.hidepopup){
                               console.log("inside hide poupup");
                              confirmPopup.close();
                             }

                                console.log("00000000000000000000")
                                confirmPopup.close();
                                console.log("******************");
    
                                }
                                if (res) {
                                    /*push routing for visitor and package start*/
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'visitorpckg_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("service_id")) {
                                            $state.reload('staffnotificationthread');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'staffnotificationthread');
                                        }
                                    }

                                    if ($localStorage.User.user_type_id == 4 && notification._raw.additionalData.$state == 'visitorpckg_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("service_id")) {
                                            $state.reload('DetailspgResiVp');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'DetailspgResiVp');
                                        }
                                    }
                                    /*push routing for visitor and package ends */


                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'service_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("service_id")) {
                                            $state.reload('staffnotificationthread');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'staffnotificationthread');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 4 && notification._raw.additionalData.$state == 'service_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("service_id")) {
                                            $state.reload('woNoitfythrd');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'woNoitfythrd');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'task_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("service_id")) {
                                            $state.reload('taskDetails');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'taskDetails');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'task_manager_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("service_id")) {
                                            $state.reload('taskManagerDetails');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'taskManagerDetails');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'news_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("news_id")) {
                                            $state.reload('staff-comment-details');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'staff-comment-details');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'private_conversation') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("news_id") && notification._raw.additionalData.comment_id == localStorage.getItem("news_comment_id")) {
                                            $state.reload('staff-private-conversation');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'staff-private-conversation');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 4 && notification._raw.additionalData.$state == 'news_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("news_id")) {
                                            $state.reload('comment-details');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'comment-details');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 4 && notification._raw.additionalData.$state == 'private_conversation') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("news_id") && notification._raw.additionalData.comment_id == localStorage.getItem("news_comment_id")) {
                                            $state.reload('private-conversation');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'private-conversation');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'workorder_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("taskDetails")) {
                                            $state.reload('woDetailspgStaffView');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'woDetailspgStaffView');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'workorder_manager_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("taskManagerDetails")) {
                                            $state.reload('woDetailspgStaff');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'woDetailspgStaff');
                                        }
                                    }

                                    if ($localStorage.User.user_type_id == 4 && notification._raw.additionalData.$state == 'workorder_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("service_id")) {
                                            $state.reload('woDetailspgResi');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'woDetailspgResi');
                                        }
                                    }
                                    if ($localStorage.User.user_type_id == 3 && notification._raw.additionalData.$state == 'poll_details') {
                                        if (notification._raw.additionalData.state_id == localStorage.getItem("pollDetails")) {
                                            $state.reload('staff-poll-details');
                                        } else {
                                            goTo(notification._raw.additionalData.$state, 'staff-poll-details');
                                        }
                                    }
                                }
                            });
                        }, 200);

                    } else {
                        notificationCtrl();
                    }
                } else {
                    if (isminiMized == false) {
                        if (confirmPopup != '') {
                            confirmPopup.close();
                            confirmPopup = '';
                        }
                        //*****make beep sound on notification arivial while app is in foreground mode*****//
                        $ionicPlatform.ready(function() {
                            $cordovaNativeAudio.preloadSimple('beep', 'audio/beep.wav')
                                .then(function(msg) { console.log(msg); })
                                .catch(function(error) { console.error(error); });

                        });

                        function play(sound) {
                            $cordovaNativeAudio.play(sound)
                                .then(function(msg) { console.log(msg); })
                                .catch(function(error) { console.error(error); });
                        };

                        //*****make beep sound on notification arivial while app is in foreground mode ends here*****//
                        setTimeout(function() {
                            if (globalShareService.data) {
                                play('beep')
                            } else {
                                console.log("beep sound is disabled")
                            }
                            confirmPopup = $ionicPopup.confirm(notificationObj);
                            confirmPopup.then(function(res) {
                                console.log("res0000000000000000",res);
                                if (res) {
                                    notificationCtrl();
                                }
                            });
                        }, 200);

                    } else {
                        notificationCtrl();
                    }

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
            }
            localStorage.setItem('device_info', JSON.stringify(device_info));
        });


        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }


        // checking the app is newly installed then clear the badge count
        if (!$localStorage.User) {
            $cordovaBadge.hasPermission().then(function(yes) {
                $cordovaBadge.clear().then(function() {
                    // You have permission, badge cleared.
                }, function(err) {
                    // You do not have permission.
                });
            }, function(no) {
                // You do not have permission
            });

        }
        // if android version is morethan 6 or above provide permissions starts
        var isAndroid;
        var androidVersion;
        isAndroid = ionic.Platform.isAndroid();
        androidVersion = ionic.Platform.version()
        if ((isAndroid==true) && (androidVersion  >= 6) ){
            var permissions = cordova.plugins.permissions;
            permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

            function checkPermissionCallback(status) {
                if (!status.hasPermission) {
                    var errorCallback = function() {
                        console.warn('Storage permission is not turned on');
                    }
                    permissions.requestPermission(
                        permissions.READ_EXTERNAL_STORAGE,
                        function(status) {
                            if (!status.hasPermission) {
                                errorCallback();
                            } else {
                                console.log("permission after request")
                            }
                        },
                        errorCallback);
                } else {
                    console.log("ALready have permission")
                }
            }
        }     
        //if android version is morethan 6 or above provide permissions starts ends here
    });

});
