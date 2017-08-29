var goToLinkFunc = function(link) {
    console.log("link", link);
    if (!(link.match("http://") || link.match("https://"))) {
        link = "http://" + link;
    }
    window.open(link, "_blank");
};

var goToPhoneNumber = function(number) {
    console.log(number);
};

var isEmptyObject = function(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
};
angular
    .module("starter.controllers", [])
    .controller("mainCtrl", function(
        $scope,
        CONFIG,
        logoutService,
        $ionicLoading,
        $localStorage,
        $ionicPlatform,
        $state,
        $cordovaNetwork,
        $timeout,
        $window,
        $location,
        $ionicPopup,
        $rootScope,
        $localStorage,
        $ionicHistory,
        loginService,
        $cordovaDevice,
        $cordovaBadge,
        $ionicConfig,
        $cordovaFile,
        $ionicPlatform,
        $cordovaNativeAudio,
        $cordovaBadge,
        dynamicBaseUrlService,
        $cordovaAppVersion,
        $ionicModal,
        $timeout,
        $ionicBackdrop
    ) {
        dynamicBaseUrlService.urls = $localStorage.baseURL;
        $scope.GuestNamesObject = [];
        $rootScope.host_url_global = $localStorage.baseURL;

        $timeout(function() {
            $scope.height = window.innerHeight + "px";
            $localStorage.height = window.innerHeight + "px";
        }, 1000);

        $scope.global_bg = {
            background: "url(" + localStorage.getItem("bgImg") + ") no-repeat",
            "background-size": "100% 100%",
            height: window.innerHeight + "px",
            overflow: "hidden "
        };

        $rootScope.$on("changeBG", function(event, data) {
            console.log("changeBG", data);
            $scope.global_bg = {
                background: "url(" + localStorage.getItem("bgImg") + ") no-repeat",
                "background-size": "100% 100%",
                height: window.innerHeight + "px",
                overflow: "hidden "
            };
            document.getElementById("changeBg").style.background =
                "url(" + localStorage.getItem("bgImg") + ") no-repeat";
            document.getElementById("changeBg").style.backgroundSize = "100% 100%";
            document.getElementById("changeBg").style.height =
                window.innerHeight + "px";
            // $scope.doOnOrientationChange();
        });

        $scope.Loginstate = function() {
            $state.go("login");
        };
        // localStorage.setItem("propert_imgL", 'img/bg-img-land.jpg');
        // localStorage.setItem("propert_imgP", 'img/bg-img.jpg');

        function doOnOrientationChange() {
            var currentPlatform = ionic.Platform.platform();
            if (currentPlatform == "android") {
                //Setting height specifically on Android Devices
                if (window.orientation == 0) {
                    document.getElementById("changeBg").style.backgroundImage =
                        "url(" + localStorage.getItem("propert_imgP") + ")";
                    document.getElementById("changeBg").style.backgroundSize = "cover";
                    document.getElementById("changeBg").style.backgroundRepeat =
                        "no repeat";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                    document.getElementById("changeBg").style.height =
                        $localStorage.height;
                } else {
                    console.log("else image");
                    document.getElementById("changeBg").style.background =
                        "url(" + localStorage.getItem("propert_imgL") + ") no-repeat";
                    document.getElementById("changeBg").style.backgroundSize =
                        "100% 100%";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                }
            } else {
                if (window.orientation == 0) {
                    document.getElementById("changeBg").style.background =
                        "url(" + localStorage.getItem("propert_imgP") + ") no-repeat";
                    document.getElementById("changeBg").style.backgroundSize =
                        "100% 100%";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                    document.getElementById("changeBg").style.height =
                        $window.innerHeight + "px";
                } else {
                    document.getElementById("changeBg").style.background =
                        "url(" + localStorage.getItem("propert_imgL") + ") no-repeat";
                    document.getElementById("changeBg").style.backgroundSize =
                        "100% 100%";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                }
            }
        }
        //Call to set background picture
        doOnOrientationChange();

        function gotFS(fileSystem) {
            fileSystem.root.getDirectory(
                "Android/data/com.ionicframework.rise536767", {
                    create: false
                },
                gotDir,
                allll
            );
            uuu = fileSystem.root.toNativeURL();
        }

        function gotFSl(fileSystem) {
            fileSystem.root.getDirectory(
                "Android/data/com.ionicframework.rise536767", {
                    create: false
                },
                gotDirl,
                landfail
            );
            uuu = fileSystem.root.toNativeURL();
        }

        function gotDir(dirEntry) {
            dirEntry.getFile(
                "Rise-p.jpg", {
                    create: false,
                    exclusive: false
                },
                gotFile,
                allll
            );
        }

        function gotDirl(dirEntry) {
            dirEntry.getFile(
                "Rise-l.jpg", {
                    create: false,
                    exclusive: false
                },
                gotFile,
                landfail
            );
        }

        function allll() {
            downloadImage($scope.backgroundPrptyImage);
        }

        function landfail() {
            downloadImage($scope.backgroundPrptyLandImage);
        }

        function gotFile(fileEntry) {
            $ionicLoading.hide();
            if (
                $localStorage.User.is_new == true &&
                localStorage.getItem("user_type_id") == 4
            ) {
                $timeout(function() {
                    $ionicConfig.views.transition("android");
                    $state.go("editProfile");
                    $scope.alertPopResi("Alert", "Please verify your profile details");
                    $localStorage.User.is_new = false;
                }, 4000);
            } else {
                console.log("called in time out");
                $timeout(function() {
                    $ionicConfig.views.transition("android");
                    console.log("Got File is Called");
                    console.log("$rootScope.isRedirect1", $rootScope.isRedirect);
                    if (!$rootScope.isRedirect || $rootScope.isRedirect == undefined) {
                        if (localStorage.getItem("user_type_id") == 3) {
                            $state.go("sideMenuStaff.features");
                        } else {
                            $state.go("sideMenu.features");
                        }
                    } else {
                        console.log("came to false are");
                        $rootScope.isRedirect = false;
                    }
                }, 4000);
            }
            document.getElementById("changeBg").style.background =
                "url(" + fileEntry.toURL() + ") no-repeat";
            document.getElementById("changeBg").style.backgroundSize = "100% 100%";
            document.getElementById("changeBg").style.height =
                $window.innerHeight + "px";
        }
        window.addEventListener("orientationchange", doOnOrientationChange);
        doOnOrientationChange();
        $scope.image = "";

        //Function Name : ConstantsInfo()
        // Use : This Function is used for get the device info for login logout seding ,replay etc.
        $scope.ConstantsInfo = function() {
            if (localStorage.getItem("platform") == "mobile") {
                return JSON.parse(localStorage.getItem("device_info"));
            } else {
                return (device_info = {
                    uuid: "83E75D2525-6B1B-45CA-AC51-632F24DCD192",
                    //model: "iPhone7.1",
                    model: "iPhone7,1",
                    platform: "iOS",
                    device_token: "12345678sasad78789111"
                });
            }
        };

        //Function Name : isOnline()
        // Use : This Function is used to check the device is connected with internet.
        $scope.isOnline = function() {
            if (localStorage.getItem("platform") == "mobile") {
                if ($cordovaNetwork.isOnline() == true) return true;
                else return false;
            } else {
                return true;
            }
        };

        $ionicPlatform.registerBackButtonAction(function() {
            if ($location.path() == "/login") {
                navigator.app.exitApp();
            } else if (
                $location.path() == "/sideMenu/features" ||
                $location.path() == "/sideMenuStaff/stafffeatures"
            ) {
                var confirmPopup = $ionicPopup.confirm({
                    title: "Alert",
                    template: "The application will be closed",
                    okType: "button-assertive"
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        navigator.app.exitApp();
                    } else {}
                });
            } else {
                $ionicHistory.goBack(-1);
            }
        }, 100);

        $scope.alertPop = function(title, msg, state) {
            if ($rootScope.confirmPopup) {
                $rootScope.confirmPopup.close();
                $rootScope.confirmPopup = "";
            }
            $rootScope.shownpop = true;
            console.log("title, msg, state", title, msg, state);
            $rootScope.alertPopup = $ionicPopup.alert({
                title: title || "Alert",
                template: msg,
                cssClass: "my-custom-popup-staff",
                buttons: [{
                    text: "Ok",
                    type: "button-full"
                }],
                scope: $scope
            });
            $rootScope.alertPopup.then(function(res) {
                if (state != undefined) {
                    $state.go(state, {
                        reload: true
                    });
                } else {
                    $rootScope.alertPopup.close(); //close the popup after 3 seconds for some reason
                    // $ionicBackdrop.release();
                    //$state.reload();
                }
            });
        };

        $scope.alertPoppackage = function(title, msg, state) {
            console.log("title, msg, state", title, msg, state);
            alertPopuppack = $ionicPopup.alert({
                title: title || "Alert",
                template: msg,
                cssClass: "my-custom-popup-staff",
                buttons: [{
                    text: "Ok",
                    type: "button-full"
                }]
            });
            alertPopuppack.then(function(res) {
                if (state != undefined) {
                    $state.go(state);
                } else {
                    alertPopuppack.close(); //close the popup after 3 seconds for some reason
                }
            });
        };

        $scope.alertPopResi = function(title, msg, state, whatIs) {
            var alertPopup = $ionicPopup.alert({
                title: title || "Alert",
                template: msg,
                cssClass: "my-custom-popup-resi",
                buttons: [{
                    text: "Ok",
                    type: "button-full"
                }]
            });
            alertPopup.then(function(res) {
                if (state != undefined) {
                    if (whatIs == "store") {
                        window.open(state, "_system", "location=yes");
                    } else {
                        $state.go(state);
                    }
                }
            });
        };

        /*Logout Function */
        $scope.logout = function() {
            var logoutClass =
                $localStorage.User.user_type_id == 4 ? "my-custom-popup-resi" : "my-custom-popup-staff";
            setTimeout(function() {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Logging Out..."
                });
                var logoutData = {
                    user_id: $localStorage.User.user_id,
                    token: $localStorage.User.token,
                    device_info: $scope.ConstantsInfo()
                };
                if ($scope.isOnline() == true) {
                    logoutService.logout().save(
                        logoutData,
                        function(res) {
                            $ionicLoading.hide();
                            if (res.code == 200) {
                                delete $localStorage.User;
                                $rootScope.email = "";
                                localStorage.setItem("emailInRoot", $rootScope.email);
                                localStorage.setItem("validToken", "not valid");
                                /*******clear the badge count when logout from app*******/
                                var currentPlatform = ionic.Platform.platform();
                                if (currentPlatform == "android" || currentPlatform == "ios") {
                                    $cordovaBadge.clear().then(
                                        function() {},
                                        function(err) {
                                            console.log(err);
                                        }
                                    );
                                }
                                /*******clear the badge ends here *******/
                                $state.go("login");
                            }
                        },
                        function(err) {
                            $ionicLoading.hide();
                            console.log(err);
                            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                        }
                    );
                } else {
                    $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
                }
            }, 3000);
        };

        localStorage.removeItem("landscapeBG");
        document.addEventListener(
            "deviceready",
            function() {
                $cordovaAppVersion.getVersionNumber().then(function(version) {
                    var appVersion = version;
                    $localStorage.appversion = version;
                    console.log("appVersion", $localStorage.appversion);
                });
            },
            false
        );
    })
    .controller("LoginCntrl", function(
        $scope,
        $state,
        loginService,
        $ionicPopup,
        CONFIG,
        $cordovaNetwork,
        $cordovaDevice,
        $rootScope,
        $localStorage,
        $ionicLoading,
        $ionicHistory,
        $timeout,
        $ionicUser,
        $ionicPush,
        $window,
        $cordovaBadge
    ) {
        $scope.data = {
            email: localStorage.getItem("emailInRoot"),
            password: ""
        };

        $scope.emailInRoot = function(data) {
            $rootScope.email = data.email;
            if ($rootScope.email == undefined)
                localStorage.setItem("emailInRoot", "");
            else localStorage.setItem("emailInRoot", $rootScope.email);
        };

        //Function Name : login()
        // Use : This Function is used for login the application
        $rootScope.devicesInfo = "";
        $scope.login = function(data) {
            var options = {
                location: "yes",
                clearcache: "yes",
                toolbar: "no"
            };
            $rootScope.isRedirect = true;
            if (data.email == "" || data.password == "") {
                $scope.alertPopResi("Alert", "Enter Email and Password");
            } else if (data.email == undefined) {
                $scope.alertPopResi("Alert", "Please enter valid email");
            } else {
                var loginData = {
                    email: data.email,
                    password: data.password,
                    version: $localStorage.appversion,
                    app_key: localStorage.getItem("app_type"),
                    bundle_identifier: localStorage.getItem("bundle_identifier"),
                    device_info: $scope.ConstantsInfo()
                };
                console.log("loginData: ", loginData);
                var e = data.email;
                var atpos = e.indexOf("@");
                var dotpos = e.lastIndexOf(".");
                if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= e.length) {
                    $scope.alertPopResi("Alert", "Please enter valid email");
                } else if ($scope.isOnline() == true) {
                    $ionicLoading.show({
                        template: "Signing In..."
                    });
                    loginService.signin().save(
                        loginData,
                        function(res) {
                            if (res.code == 200) {
                                console.log("Login User Data: ", res);

                                // Check for App version
                                var app_version = $localStorage.appversion;
                                var currentPlatform = ionic.Platform.platform();
                                if (currentPlatform == "android") {
                                    if (res.data.android_version != app_version) {
                                        console.log("Not updated");
                                    }
                                } else {
                                    console.log("else", app_version);
                                    if (res.data.ios_version != app_version) {
                                        console.log("Not updated");
                                    }
                                }

                                // This will be fetched from login service - Not implemented from Server side yet
                                var property_type = res.data.app_key;
                                localStorage.setItem("app_key", res.data.app_key);

                                // Check for app type and change all labels accordingly
                                if (property_type == "com.risesoftware.riseoffice") {
                                    $rootScope.rise_property = "Office Manager";
                                    $rootScope.rise_property_multiple = "Office Managers";
                                    $rootScope.rise_unit = "Suites";
                                    $rootScope.rise_unit_singleton = "Suite";
                                    console.log("Text set to Suites");
                                } else if (property_type == "com.risesoftware.riseliving") {
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

                                if (res.data.permissions != undefined) {
                                    $rootScope.user_permissions = {};
                                    for (var i = 0; i < res.data.permissions.length; i++) {
                                        if (
                                            res.data.permissions[i].id == "5629c38a3949c780667d5c59"
                                        ) {
                                            $rootScope.user_permissions.Visitors = true;
                                        } else if (
                                            res.data.permissions[i].id == "5629c3cc3949c780667d5c5a"
                                        ) {
                                            $rootScope.user_permissions.Packages = true;
                                        } else if (
                                            res.data.permissions[i].id == "5629c5a53949c780667d5c60"
                                        ) {
                                            $rootScope.user_permissions.Contacts = true;
                                        } else if (
                                            res.data.permissions[i].id == "5629c4763949c780667d5c5c"
                                        ) {
                                            $rootScope.user_permissions.Emergency_Work_Order = true;
                                            // $rootScope.user_permissions.Work_Orders = true;
                                        } else if (
                                            res.data.permissions[i].id == "5629c4a03949c780667d5c5d"
                                        ) {
                                            $rootScope.user_permissions.Normal_Work_Order = true;
                                            // $rootScope.user_permissions.Work_Orders = true;
                                        } else if (
                                            res.data.permissions[i].id == "5629c4de3949c780667d5c5e"
                                        ) {
                                            $rootScope.user_permissions.Valet = true;
                                        } else if (
                                            res.data.permissions[i].id == "5629c5583949c780667d5c5f"
                                        ) {
                                            $rootScope.user_permissions.Reservations = true;
                                        } else if (
                                            res.data.permissions[i].id == "56a9e78bd42aba0fd731b1df"
                                        ) {
                                            $rootScope.user_permissions.News = true;
                                            $rootScope.user_permissions.Newsfeed = true;
                                            $rootScope.user_permissions.Management = true;
                                        } else if (
                                            res.data.permissions[i].id == "56ab40b8d42aba0fd731b1e4"
                                        ) {
                                            $rootScope.user_permissions.Polls = true;
                                            $rootScope.user_permissions.Newsfeed = true;
                                            $rootScope.user_permissions.Management = true;
                                        } else if (
                                            res.data.permissions[i].id == "5787386661f925afa18240c4"
                                        ) {
                                            $rootScope.user_permissions.Emergency = true;
                                            $rootScope.user_permissions.Newsfeed = true;
                                            $rootScope.user_permissions.Management = true;
                                        } else if (
                                            res.data.permissions[i].id == "5787389761f925afa18240c5"
                                        ) {
                                            $rootScope.user_permissions.General = true;
                                            $rootScope.user_permissions.Newsfeed = true;
                                            $rootScope.user_permissions.Resident = true;
                                        } else if (
                                            res.data.permissions[i].id == "578738bc61f925afa18240c6"
                                        ) {
                                            $rootScope.user_permissions.Marketplace = true;
                                            $rootScope.user_permissions.Resident = true;
                                            $rootScope.user_permissions.Newsfeed = true;
                                        } else if (
                                            res.data.permissions[i].id == "58294041dead7337120f5d9b"
                                        ) {
                                            $rootScope.user_permissions.Work_Orders = true;
                                        } else if (res.data.permissions[i].name == "Newsfeed") {
                                            $rootScope.user_permissions.Newsfeed = true;
                                        } else if (res.data.permissions[i].name == "Resident") {
                                            $rootScope.user_permissions.Resident = true;
                                            $rootScope.user_permissions.Newsfeed = true;
                                        } else if (res.data.permissions[i].name == "Management") {
                                            $rootScope.user_permissions.Management = true;
                                            $rootScope.user_permissions.Newsfeed = true;
                                        } else if (
                                            res.data.permissions[i].id == "566fdf5d3949c780667d72d5"
                                        ) {
                                            $rootScope.user_permissions.Tasks = true;
                                        } else if (
                                            res.data.permissions[i].id == "598043eaba0297a60a765647"
                                        ) {
                                            $rootScope.user_permissions.Activity_User = true;
                                        } else if (
                                            res.data.permissions[i].id == "59968018535167e485f8b12c"
                                        ) {
                                            $rootScope.user_permissions.Activity_Manager = true;
                                        }
                                    }

                                    console.log("==============================");
                                    console.log(res.data.permissions);
                                    console.log($rootScope.user_permissions);
                                    console.log("==============================");
                                    localStorage.setItem(
                                        "user_permissions",
                                        JSON.stringify($rootScope.user_permissions)
                                    );
                                } else {
                                    res.data.permissions = {
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
                                        Management: true,
                                        Activity_Log: true
                                    };
                                    localStorage.setItem(
                                        "user_permissions",
                                        JSON.stringify(res.data.user_permissions)
                                    );
                                    $rootScope.user_permissions = res.data.user_permissions;
                                }
                                console.log(
                                    "$rootScope.user_permissions",
                                    $rootScope.user_permissions
                                );
                                if (res.data.units_id == undefined) {
                                    res.data.units_id = {
                                        _id: ""
                                    };
                                }
                                if (isEmptyObject(res.device_data)) {
                                    $rootScope.devicesInfo = JSON.parse(
                                        localStorage.getItem("device_info")
                                    );
                                    console.log(
                                        "If $rootScope.devicesInfo: ",
                                        $rootScope.devicesInfo
                                    );
                                } else {
                                    $rootScope.devicesInfo = res.device_data;
                                    console.log(
                                        "Else $rootScope.devicesInfo: ",
                                        $rootScope.devicesInfo
                                    );
                                }
                                localStorage.setItem("bgImg", $rootScope.BGImages[0].propert_imgL);
                                localStorage.setItem("propert_imgL", $rootScope.BGImages[0].propert_imgL);
                                localStorage.setItem("propert_imgP", $rootScope.BGImages[0].propert_imgP);
                                localStorage.setItem("emailInRoot", "");
                                $scope.currentDate = new Date();
                                $ionicLoading.hide();
                                $localStorage.User = {
                                    token: res.data.token,
                                    property_id: res.data.property_id._id,
                                    property_img: res.data.property_id.property_img,
                                    user_type_id: res.data.user_type_id,
                                    user_id: res.data.user_id,
                                    profile_img: res.data.profile_img,
                                    firstname: res.data.firstname,
                                    lastname: res.data.lastname,
                                    phone_no: res.data.phone_no,
                                    emergency_contact: res.data.emergency_contact,
                                    units_id: res.data.units_id._id,
                                    units_number: res.data.units_id.unit_number,
                                    staff_roles_id: res.data.staff_roles_id,
                                    resident_roles_id: res.data1.resident_roles_id,
                                    property_name: res.data.property_id.name,
                                    is_new: res.data.is_new,
                                    email: res.data.email,
                                    color: res.data1.colour
                                };
                                console.log(
                                    "$localStorage.User.units_number",
                                    $localStorage.User
                                );
                                localStorage.setItem("user_type_id", res.data.user_type_id);
                                localStorage.setItem("validToken", res.data.token);
                                localStorage.setItem("timezone", res.data.property_id.timezone);
                                console.log(1111, localStorage.getItem("timezone"));
                                $rootScope.userDetails = $localStorage.User;
                                switch (res.data.user_type_id) {
                                    case "3":
                                        $state.go("staff_home_page");
                                        break;
                                    case "4":
                                        $state.go("landing_page");
                                        break;
                                    default:
                                        break;
                                }
                                $scope.data = {
                                    email: "",
                                    password: ""
                                };
                            } else if (res.code == 401) {
                                $ionicLoading.hide();
                                $scope.alertPopResi("Alert", "Please try again");
                                $scope.data.password = "";
                            } else if (res.code == 201) {
                                $ionicLoading.hide();
                                $scope.alertPopResi(
                                    "Alert",
                                    res.message,
                                    res.play_store_url,
                                    "store"
                                );
                                $scope.data.password = "";
                            } else if (res.code == 301) {
                                $ionicLoading.hide();
                                console.log("gsdgfg");

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
                            $ionicLoading.hide();
                            console.log(JSON.stringify(err));
                            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                        }
                    );
                } else {
                    $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
                }
            }
        };

        $scope.emptyfield = function(index) {
            console.log("i am called");
            if (index == 1) $scope.data.email = "";
            else $scope.data.password = "";
        };
        $scope.forgotpasswordstate = function() {
            $state.go("forgot_password");
        };
        $scope.signUpstate = function() {
            $state.go("signUpSelctPropty");
        };
        if (ionic.Platform.platform() == "ios") {
            $scope.preventKeyboard = function(e) {
                cordova.plugins.Keyboard.disableScroll(true);
                e.preventDefault();
                e.stopPropagation();
                window.scrollTo(0, 0);
            };
        }

        $scope.opentc = function() {
            // Open in app browser
            window.open("http://riseliving.co/terms-conditions", "_blank");
        };
        $scope.openpp = function() {
            // Open in app browser
            window.open("http://riseliving.co/privacy-policy", "_blank");
        };
    })
    .controller("HomeCtrl", function(
        $state,
        $rootScope,
        $ionicPopup,
        $ionicModal,
        $scope,
        CONFIG,
        $ionicConfig,
        $cordovaBadge,
        $cordovaFile,
        $ionicHistory,
        $cordovaDevice,
        logoutService,
        $window,
        $timeout,
        $ionicLoading,
        $localStorage,
        loginService,
        $ionicPlatform
    ) {
        $scope.bgColor = $localStorage.User.color;
        $scope.callBillableTimer = 5;
        var directory = "Rise";
        var filename = "rise-bg.jpg";
        //$scope.host_url_global = CONFIG.HTTP_HOST;
        $rootScope.host_url_global = $localStorage.baseURL;
        /******Good Morning/Good Evening/Good Afternoon******/
        var myDate = new Date();
        var hrs = myDate.getHours();
        $scope.greet;
        if (hrs < 12) {
            $scope.greet = "Good Morning";
        } else if (hrs >= 12 && hrs < 17) {
            $scope.greet = "Good Afternoon";
        } else if (hrs >= 17 && hrs < 24) {
            $scope.greet = "Good Evening";
        }

        /*****Good Morning/Good Evening/Good Afternoon Ends******/

        function doOnOrientationChange() {
            var currentPlatform = ionic.Platform.platform();
            if (currentPlatform == "android") {
                //Setting height specifically on Android Devices
                if (window.orientation == 0) {
                    document.getElementById("changeBg").style.backgroundImage =
                        "url(" + localStorage.getItem("propert_imgP") + ")";
                    document.getElementById("changeBg").style.backgroundSize = "cover";
                    document.getElementById("changeBg").style.backgroundRepeat =
                        "no repeat";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                    document.getElementById("changeBg").style.height =
                        $localStorage.height;
                } else {
                    console.log("else image");
                    document.getElementById("changeBg").style.background =
                        "url(" + localStorage.getItem("propert_imgL") + ") no-repeat";
                    document.getElementById("changeBg").style.backgroundSize =
                        "100% 100%";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                }
            } else {
                if (window.orientation == 0) {
                    document.getElementById("changeBg").style.background =
                        "url(" + localStorage.getItem("propert_imgP") + ") no-repeat";
                    document.getElementById("changeBg").style.backgroundSize =
                        "100% 100%";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                    document.getElementById("changeBg").style.height =
                        $window.innerHeight + "px";
                } else {
                    document.getElementById("changeBg").style.background =
                        "url(" + localStorage.getItem("propert_imgL") + ") no-repeat";
                    document.getElementById("changeBg").style.backgroundSize =
                        "100% 100%";
                    document.getElementById("changeBg").style.overflow =
                        "hidden !important";
                }
            }
        }
        //Call to set background picture
        doOnOrientationChange();

        $scope.firstName = $localStorage.User.firstname;
        $scope.lastName = $localStorage.User.lastname;
        $scope.profileImg = $localStorage.User.profile_img;
        $rootScope.deviceInfo = {};

        if (localStorage.getItem("platform") == "mobile") {
            console.log("taking device info");
            var device_info = JSON.parse(localStorage.getItem("device_info"));
        } else {
            console.log("taking hardcode device info");
            var device_info = {
                uuid: "83E75D2525-6B1B-45CA-AC51-632F24DCD192",
                model: "iPhone7,1",
                platform: "iOS",
                device_token: "12345678sasad78789111"
            };
        }
        var homeData = {
            device_info: device_info,
            user_id: $localStorage.User.user_id,
            version: $localStorage.appversion,
            token: $localStorage.User.token
        };
        console.log("homeData", homeData);
        loginService.homeCheck().save(
            homeData,
            function(res) {
                console.log("homeCheck", res);
                if (res.data != null) {
                    $rootScope.deviceInfo = res.data;
                } else {
                    $rootScope.deviceInfo = JSON.parse(
                        localStorage.getItem("device_info")
                    );
                }
                console.log("$rootScope.deviceInfo: ", $rootScope.deviceInfo);
                if (res.code == 200) {
                    $localStorage.User.profile_img = res.users_data.profile_img;
                    $localStorage.User.usrColor = {
                        background: res.users_data.colour
                    };
                    $scope.backgroundPrptyImage = "";
                    $scope.profileImg = $localStorage.User.profile_img;

                    // Check for App version
                    var app_version = $localStorage.appversion;
                    var currentPlatform = ionic.Platform.platform();
                    if (currentPlatform == "android") {
                        if (res.android_version != app_version) {
                            console.log("Not updated");
                        }
                    } else {
                        console.log("else", app_version);
                        if (res.ios_version != app_version) {
                            console.log("Not updated");
                        }
                    }

                    // This will be fetched from login service - Not implemented from Server side yet
                    var property_type = res.app_key;
                    localStorage.setItem("app_key", res.app_key);

                    // Check for app type and change all labels accordingly
                    if (property_type == "com.risesoftware.riseoffice") {
                        $rootScope.rise_property = "Office Manager";
                        $rootScope.rise_property_multiple = "Office Managers";
                        $rootScope.rise_unit = "Suites";
                        $rootScope.rise_unit_singleton = "Suite";
                        console.log("Text set to Suites");
                    } else if (property_type == "com.risesoftware.riseliving") {
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

                    if (res.users_data.permissions != undefined) {
                        $rootScope.user_permissions = {};
                        for (var i = 0; i < res.users_data.permissions.length; i++) {
                            if (
                                res.users_data.permissions[i].id == "5629c38a3949c780667d5c59"
                            ) {
                                $rootScope.user_permissions.Visitors = true;
                            } else if (
                                res.users_data.permissions[i].id == "5629c3cc3949c780667d5c5a"
                            ) {
                                $rootScope.user_permissions.Packages = true;
                            } else if (
                                res.users_data.permissions[i].id == "5629c5a53949c780667d5c60"
                            ) {
                                $rootScope.user_permissions.Contacts = true;
                            } else if (
                                res.users_data.permissions[i].id == "5629c4763949c780667d5c5c"
                            ) {
                                $rootScope.user_permissions.Emergency_Work_Order = true;
                                $rootScope.user_permissions.Work_Orders = true;
                            } else if (
                                res.users_data.permissions[i].id == "5629c4a03949c780667d5c5d"
                            ) {
                                $rootScope.user_permissions.Normal_Work_Order = true;
                                $rootScope.user_permissions.Work_Orders = true;
                            } else if (
                                res.users_data.permissions[i].id == "5629c4de3949c780667d5c5e"
                            ) {
                                $rootScope.user_permissions.Valet = true;
                            } else if (
                                res.users_data.permissions[i].id == "5629c5583949c780667d5c5f"
                            ) {
                                $rootScope.user_permissions.Reservations = true;
                            } else if (
                                res.users_data.permissions[i].id == "56a9e78bd42aba0fd731b1df"
                            ) {
                                $rootScope.user_permissions.News = true;
                                $rootScope.user_permissions.Newsfeed = true;
                                $rootScope.user_permissions.Management = true;
                            } else if (
                                res.users_data.permissions[i].id == "56ab40b8d42aba0fd731b1e4"
                            ) {
                                $rootScope.user_permissions.Polls = true;
                                $rootScope.user_permissions.Newsfeed = true;
                                $rootScope.user_permissions.Management = true;
                            } else if (
                                res.users_data.permissions[i].id == "5787386661f925afa18240c4"
                            ) {
                                $rootScope.user_permissions.Emergency = true;
                                $rootScope.user_permissions.Newsfeed = true;
                                $rootScope.user_permissions.Management = true;
                            } else if (
                                res.users_data.permissions[i].id == "5787389761f925afa18240c5"
                            ) {
                                $rootScope.user_permissions.General = true;
                                $rootScope.user_permissions.Newsfeed = true;
                                $rootScope.user_permissions.Resident = true;
                            } else if (
                                res.users_data.permissions[i].id == "578738bc61f925afa18240c6"
                            ) {
                                $rootScope.user_permissions.Marketplace = true;
                                $rootScope.user_permissions.Resident = true;
                                $rootScope.user_permissions.Newsfeed = true;
                            } else if (
                                res.users_data.permissions[i].id == "58294041dead7337120f5d9b"
                            ) {
                                $rootScope.user_permissions.Work_Orders = true;
                            } else if (res.users_data.permissions[i].name == "Newsfeed") {
                                $rootScope.user_permissions.Newsfeed = true;
                            } else if (res.users_data.permissions[i].name == "Resident") {
                                $rootScope.user_permissions.Resident = true;
                                $rootScope.user_permissions.Newsfeed = true;
                            } else if (res.users_data.permissions[i].name == "Management") {
                                $rootScope.user_permissions.Management = true;
                                $rootScope.user_permissions.Newsfeed = true;
                            } else if (
                                res.users_data.permissions[i].id == "566fdf5d3949c780667d72d5"
                            ) {
                                $rootScope.user_permissions.Tasks = true;
                            } else if (
                                res.users_data.permissions[i].id == "598043eaba0297a60a765647"
                            ) {
                                $rootScope.user_permissions.Activity_User = true;
                            } else if (
                                res.users_data.permissions[i].id == "59968018535167e485f8b12c"
                            ) {
                                $rootScope.user_permissions.Activity_Manager = true;
                            }
                        }

                        console.log("==============================");
                        console.log(res.users_data.permissions);
                        console.log($rootScope.user_permissions);
                        console.log("==============================");
                        localStorage.setItem(
                            "user_permissions",
                            JSON.stringify($rootScope.user_permissions)
                        );
                    } else {
                        res.data.permissions = {
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
                        localStorage.setItem(
                            "user_permissions",
                            JSON.stringify(res.data.user_permissions)
                        );
                        $rootScope.user_permissions = res.data.user_permissions;
                    }

                    if (localStorage.getItem("platform") == "mobile") {
                        if (
                            $localStorage.User.is_new == true &&
                            localStorage.getItem("user_type_id") == 4
                        ) {
                            $timeout(function() {
                                $ionicConfig.views.transition("android");
                                $state.go("editProfile");
                                $scope.alertPopResi(
                                    "Alert",
                                    "Please verify your profile details"
                                );
                                $localStorage.User.is_new = false;
                            }, 4000);
                        } else {
                            $timeout(function() {
                                $ionicConfig.views.transition("android");
                                if (
                                    $rootScope.isRedirect ||
                                    $rootScope.isRedirect == undefined
                                ) {
                                    if (localStorage.getItem("user_type_id") == 3) {
                                        console.log("called in time out NONE Mobile");
                                        $state.go("sideMenuStaff.features");
                                    } else {
                                        $state.go("sideMenu.features");
                                    }
                                } else {
                                    $rootScope.isRedirect = true;
                                }
                            }, 4000);
                        }
                    }

                    /*Code runs in web starts*/
                    if (localStorage.getItem("platform") != "mobile") {
                        if (
                            $localStorage.User.is_new == true &&
                            localStorage.getItem("user_type_id") == 4
                        ) {
                            $timeout(function() {
                                $ionicConfig.views.transition("android");
                                $state.go("editProfile");
                                $scope.alertPopResi(
                                    "Alert",
                                    "Please verify your profile details"
                                );
                                $localStorage.User.is_new = false;
                            }, 4000);
                        } else {
                            $timeout(function() {
                                $ionicConfig.views.transition("android");
                                if (
                                    $rootScope.isRedirect ||
                                    $rootScope.isRedirect == undefined
                                ) {
                                    if (localStorage.getItem("user_type_id") == 3) {
                                        console.log("called in time out NONE Web");
                                        $state.go("sideMenuStaff.features");
                                    } else {
                                        $state.go("sideMenu.features");
                                    }
                                } else {
                                    $rootScope.isRedirect = true;
                                }
                            }, 4000);
                        }
                    }

                    /*Code runs in web end*/
                } else if (res.code == 201) {
                    var logoutData = {
                        user_id: $localStorage.User.user_id,
                        token: $localStorage.User.token,
                        device_info: $scope.ConstantsInfo()
                    };
                    logoutService.logout().save(logoutData, function(res) {
                        if (res.code == 200) {
                            $ionicLoading.hide();
                            delete $localStorage.User;
                            $rootScope.email = "";
                            localStorage.setItem("emailInRoot", $rootScope.email);
                            localStorage.setItem("validToken", "not valid");
                            /*******clear the badge count when logout from app*******/
                            var currentPlatform = ionic.Platform.platform();
                            if (currentPlatform == "android" || currentPlatform == "ios") {
                                $cordovaBadge.clear().then(
                                    function() {},
                                    function(err) {
                                        alert(err);
                                    }
                                );
                            }
                            /*******clear the badge ends here *******/
                            $state.go("login");
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
                                console.log("if closed");
                            } else {
                                $window.open(
                                    "https://itunes.apple.com/us/app/rise-living/id1117019183?ls=1&mt=8",
                                    "_system"
                                );
                                console.log("going in ios else");
                            }
                        } else {
                            console.log("else");
                        }
                    });
                }
            },
            function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            }
        );

        /*******Accesing the Image File Strats******/
        function gotFS(fileSystem) {
            fileSystem.root.getDirectory(
                "Android/data/com.ionicframework.rise536767", {
                    create: false
                },
                gotDir,
                allll
            );
            uuu = fileSystem.root.toNativeURL();
        }

        function gotFSl(fileSystem) {
            fileSystem.root.getDirectory(
                "Android/data/com.ionicframework.rise536767", {
                    create: false
                },
                gotDirl,
                landfail
            );
            uuu = fileSystem.root.toNativeURL();
        }

        function gotDir(dirEntry) {
            dirEntry.getFile(
                "Rise-p.jpg", {
                    create: false,
                    exclusive: false
                },
                gotFile,
                allll
            );
        }

        function gotDirl(dirEntry) {
            dirEntry.getFile(
                "Rise-l.jpg", {
                    create: false,
                    exclusive: false
                },
                gotFile,
                landfail
            );
        }

        function allll() {
            downloadImage($scope.backgroundPrptyImage);
        }

        function landfail() {
            downloadImage($scope.backgroundPrptyLandImage);
        }

        /*Function use to Get File Image*/

        function gotFile(fileEntry) {
            $ionicLoading.hide();
            if (
                $localStorage.User.is_new == true &&
                localStorage.getItem("user_type_id") == 4
            ) {
                $timeout(function() {
                    $ionicConfig.views.transition("android");
                    $state.go("editProfile");
                    $scope.alertPopResi("Alert", "Please verify your profile details");
                    $localStorage.User.is_new = false;
                    //alert($localStorage.User.is_new);
                }, 4000);
            } else {
                console.log("called in time out");
                $timeout(function() {
                    console.log("$rootScope.isRedirect ", $rootScope.isRedirect);
                    // console.log("$rootScope.isRedirect ",$rootScope.isRedirect )
                    $ionicConfig.views.transition("android");
                    if ($rootScope.isRedirect || $rootScope.isRedirect == undefined) {
                        console.log("called got file");
                        if (localStorage.getItem("user_type_id") == 3) {
                            console.log("go for staff");
                            $state.go("sideMenuStaff.features");
                        } else {
                            console.log("go for resid");
                            $state.go("sideMenu.features");
                        }
                    } else {
                        console.log("isRedirect true area");
                        $rootScope.isRedirect = true;
                    }
                }, 4000);
            }
            localStorage.setItem("propert_imgP", $scope.backgroundPrptyImage);
            document.getElementById("changeBg").style.background =
                "url(" + fileEntry.toURL() + ") no-repeat";
            document.getElementById("changeBg").style.backgroundSize = "100% 100%";
            document.getElementById("changeBg").style.height =
                $window.innerHeight + "px";
        }

        /*Function use to Download Image*/

        function downloadImage(backgroundPrptyImage, orientation) {
            window.requestFileSystem(
                LocalFileSystem.PERSISTENT,
                0,
                function onFileSystemSuccess(fileSystem) {
                    var nturl = fileSystem.root.toNativeURL();
                    fileSystem.root.getFile(
                        "dummy.html", {
                            create: true,
                            exclusive: false
                        },
                        function gotFileEntry(fileEntry) {
                            appCachePath = fileEntry.toURL();
                            sPath = fileEntry.fullPath.replace("dummy.html", appCachePath);
                            res = sPath.substring(1, sPath.length - 10);
                            fileTransfer = new FileTransfer();
                            if (orientation == "p") {
                                $scope.orientation = orientation;
                                extendedPath =
                                    "Android/data/com.ionicframework.rise536767/Rise-p.jpg";
                            } else {
                                $scope.orientation = orientation;
                                extendedPath =
                                    "Android/data/com.ionicframework.rise536767/Rise-l.jpg";
                            }
                            $ionicLoading.show({
                                template: "Downloading Background..."
                            });
                            //alert(res + extendedPath);
                            fileTransfer.download(
                                backgroundPrptyImage,
                                res + extendedPath,
                                function(theFile) {
                                    if (orientation == "p") {
                                        window.requestFileSystem(
                                            LocalFileSystem.PERSISTENT,
                                            0,
                                            gotFS,
                                            allll
                                        );
                                    } else {
                                        localStorage.setItem(
                                            "propert_imgL",
                                            $scope.backgroundPrptyLandImage
                                        );
                                    }
                                },
                                function(error) {
                                    //alert(JSON.stringify(error));
                                    localStorage.setItem(
                                        "propert_img",
                                        $scope.backgroundPrptyImage
                                    );
                                    localStorage.setItem(
                                        "propert_img",
                                        $scope.backgroundPrptyLandImage
                                    );
                                    document.getElementById("changeBg").style.background =
                                        "url(" + localStorage.getItem("bgImg") + ") no-repeat";
                                    document.getElementById("changeBg").style.backgroundSize =
                                        "100% 100%";
                                    document.getElementById("changeBg").style.overflow =
                                        "hidden !important";
                                    if (
                                        $localStorage.User.is_new == true &&
                                        localStorage.getItem("user_type_id") == 4
                                    ) {
                                        $timeout(function() {
                                            $ionicConfig.views.transition("android");
                                            $state.go("editProfile");
                                            $scope.alertPopResi(
                                                "Alert",
                                                "Please verify your profile details"
                                            );
                                            $localStorage.User.is_new = false;
                                        }, 4000);
                                    } else {
                                        console.log("called in time out");
                                        $timeout(function() {
                                            $ionicConfig.views.transition("android");
                                            if (
                                                $rootScope.isRedirect ||
                                                $rootScope.isRedirect == undefined
                                            ) {
                                                if (localStorage.getItem("user_type_id") == 3) {
                                                    $state.go("sideMenuStaff.features");
                                                    //alert($localStorage.User.is_new);
                                                } else {
                                                    $state.go("sideMenu.features");
                                                }
                                            } else {
                                                $rootScope.isRedirect = true;
                                            }
                                        }, 4000);
                                    }
                                }
                            );
                        }
                    );
                }
            );
        }
        /*******Accesing the Image File Stop******/
    })
    .controller("forgotPassCtrl", function(
        $scope,
        $state,
        $rootScope,
        $ionicPopup,
        forgotpasswordService,
        CONFIG,
        $ionicLoading,
        $ionicHistory,
        $cordovaNetwork
    ) {
        var email = $rootScope.email ? $rootScope.email : "";
        $scope.data = {
            email: "",
            password: ""
        };
        $scope.data.email = localStorage.getItem("emailInRoot");
        console.log(localStorage.getItem("emailInRoot"));

        $scope.forgotpass = function(data) {
            var forgotData = {
                email: data.email,
                bundle_identifier: localStorage.getItem("bundle_identifier"),
                is_app: true
            };
            if (forgotData.email == "") {
                $scope.alertPopResi("Alert", "Enter Your Email");
            } else {
                if ($scope.isOnline() == true) {
                    $ionicLoading.show();
                    console.log("password", forgotData);
                    forgotpasswordService.forgotpassword().save(
                        forgotData,
                        function(res) {
                            console.log("res", res);
                            if (res.code == 200) {
                                localStorage.setItem("emailInRoot", data.email);
                                $scope.alertPopResi("Alert", res.message, "login");
                                data.email = "";
                                $rootScope.email = "";
                                $ionicLoading.hide();
                            } else if (res.code == 401) {
                                $scope.alertPopResi("Alert", res.message);
                                $ionicLoading.hide();
                            } else {
                                $scope.alertPopResi("Alert", res.message);
                                $ionicLoading.hide();
                            }
                        },
                        function(err) {
                            $ionicLoading.hide();
                            console.log(err);
                            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                        }
                    );
                } else {
                    $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
                }
            }
        };
        $scope.Loginstate = function() {
            $state.go("login");
        };
        $scope.emptyfield = function(index) {
            console.log("i am called");
            $scope.data.email = "";
            localStorage.setItem("emailInRoot", "");
        };
    })
    /*******Change Password**************/
    .controller("changePassword", function(
        $scope,
        $state,
        $localStorage,
        chagePasswordService,
        $rootScope,
        $ionicPopup,
        forgotpasswordService,
        CONFIG,
        $ionicLoading,
        $ionicHistory,
        $cordovaNetwork
    ) {
        $scope.changePassword = function(data) {
            console.log(data);
            $ionicLoading.show();
            var cahangePasswordData = {
                users_id: $localStorage.User.user_id,
                password: data.newPwd,
                current_password: data.curPwd
            };
            console.log(cahangePasswordData);
            chagePasswordService.chagePassword().save(
                cahangePasswordData,
                function(res) {
                    $ionicLoading.hide();
                    console.log("res", res);
                    if (localStorage.getItem("user_type_id") == 3) {
                        if (res.code == 200) {
                            $scope.alertPop("Alert", res.message, "sideMenuStaff.features");
                        } else {
                            $scope.alertPop("Alert", res.message);
                        }
                    } else {
                        if (res.code == 200) {
                            $scope.alertPopResi("Alert", res.message, "sideMenu.features");
                        } else {
                            $scope.alertPopResi("Alert", res.message);
                        }
                    }
                },
                function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                }
            );
        };
    })
    /**********signup property name select controller******************/
    .controller("signUpSelctProptyCtrl", function(
        $scope,
        $ionicPopover,
        wrkOrdService,
        $localStorage,
        signUpService,
        $ionicLoading,
        $state,
        CONFIG,
        dynamicBaseUrlService,
        $rootScope
    ) {
        $scope.data = {};

        /**** changing the base URL fucntion starts ****/
        dynamicBaseUrlService.urls = {};
        console.log("$localStorage.baseURL", $localStorage.baseURL);
        if (
            $rootScope.urlChangeBtnName == undefined ||
            $rootScope.urlChangeBtnName == "now prod"
        ) {
            $localStorage.baseURL = "https://admin.riseliving.co";
            console.log("urlChangeBtnName", $scope.urlChangeBtnName);
            $rootScope.urlChangeBtnName = "now prod";
            dynamicBaseUrlService.urls = $localStorage.baseURL;
            console.log("IF");
        } else {
            $localStorage.baseURL == "http://staging.riseliving.co:3000";
            $rootScope.urlChangeBtnName = "now test";
            dynamicBaseUrlService.urls = $localStorage.baseURL;
            console.log("ELSE");
        }
        $scope.changeBaseURl = function() {
            if ($localStorage.baseURL == "http://staging.riseliving.co:3000") {
                console.log("Now its production");
                $localStorage.baseURL = CONFIG.HTTP_HOSTPro;
                dynamicBaseUrlService.urls = $localStorage.baseURL;
                $rootScope.urlChangeBtnName = "now prod";
                $scope.predectiveCall();
            } else {
                console.log("Now its staging");
                $localStorage.baseURL = CONFIG.HTTP_HOSTStaging;
                dynamicBaseUrlService.urls = $localStorage.baseURL;
                $rootScope.urlChangeBtnName = "now test";
                $scope.predectiveCall();
            }
        };
        /**** changing the base URL fucntion ends  ****/
        if (ionic.Platform.platform() == "ios") {
            $scope.preventKeyboard = function(e) {
                cordova.plugins.Keyboard.disableScroll(true);
                e.preventDefault();
                e.stopPropagation();
                window.scrollTo(0, 0);
            };
        }

        $ionicPopover
            .fromTemplateUrl("templates/Resident/predectiveTextForPropery.html", {
                scope: $scope
            })
            .then(function(popover) {
                $scope.popover = popover;
            });

        //service for getting propery list
        $scope.predectiveCall = function() {
            signUpService.getProperyList().get(function(res) {
                if (res.code == 200) {
                    $scope.predectiveText = res.result;
                }
            });
        };

        //To get user selected propery name detials from popover
        $scope.setPromptText = function(text) {
            $scope.selectedProperyId = text.text_id;
            localStorage.setItem("registerProprtyID", $scope.selectedProperyId);
            $scope.data.signUpProperyName = text.text_name;
            $scope.popover.hide();
        };
        $scope.openPredicts = function() {
            $scope.popover.show();
        };

        //compare the user input text with service return data of propery list names.
        $scope.compareText = function(text) {
            var selectedProperyName = text;
            console.log("text", text);
            if (text.length >= 3) {
                console.log($scope.predectiveText);
                angular.forEach($scope.predectiveText, function(item) {
                    var predectiveName = item.name;
                    var resSubString = predectiveName.substring(-1, 3);
                    console.log("resSubString", resSubString);
                    if (resSubString.toUpperCase() === text.toUpperCase()) {
                        console.log("Matched");
                        $scope.showpredictivePropery = true;
                        $scope.filteredText = [];
                        $scope.filteredText.push({
                            text_name: item.name,
                            text_id: item._id
                        });
                    } else {
                        console.log("NOt matching", $scope.filteredText);
                    }
                });
            } else {
                $scope.showpredictivePropery = false;
                $scope.filteredText = [];
            }
        };
        $scope.goToproperyList = function() {
            if (!$scope.selectedProperyId) {
                $scope.alertPopResi("Alert", "Please select the property name");
            } else {
                $state.go("signUpSelctProperyUnit");
            }
        };
    })
    /*******signup units selection controller*********/
    .controller("signUpSelctProptyUnitCtrl", function(
        $scope,
        $stateParams,
        $state,
        signUpService,
        $ionicLoading,
        $ionicScrollDelegate,
        filterFilter
    ) {
        if (ionic.Platform.platform() == "ios") {
            $scope.preventKeyboard = function(e) {
                cordova.plugins.Keyboard.disableScroll(true);
                e.preventDefault();
                e.stopPropagation();
                window.scrollTo(0, 0);
            };
        }

        $scope.showUnitList = true;
        var signUpPopertyId = {
            property_id: localStorage.getItem("registerProprtyID")
        };
        $ionicLoading.show();

        //getting the units based on the property ID
        signUpService.getProperyUnit().save(
            signUpPopertyId,
            function(res) {
                $ionicLoading.hide();
                if (res.code == 200) {
                    if (res.result.length < 1) {
                        $scope.alertPopResi(
                            "Warning",
                            "Sorry ,No '+$rootScope.rise_unit+' avilable on this propery name!",
                            "signUpSelctPropty"
                        );
                    } else {
                        console.log("getProperyUnit", res);
                        $scope.item = res.result;
                    }
                } else {
                    $scope.alertPopResi("Error", "Something went wrong");
                }
            },
            function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPopResi("Error", "Something went wrong");
            }
        );

        //get units based on the property id
        $scope.filterUnits = function(data) {
            signUpService.getProperyUnit().save(
                signUpPopertyId,
                function(res) {
                    $ionicLoading.hide();
                    $scope.item = res.result;
                    if (data) {
                        console.log("show dropdown");
                        $scope.showUnitList = true;
                    } else {
                        $scope.showUnitList = false;
                        console.log("dont show dropdown");
                    }
                    console.log("$scope.item", $scope.item);
                    $scope.UnitsArray = filterFilter($scope.item);
                    console.log("$scope.UnitsArray", $scope.UnitsArray);
                },
                function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPopResi("Error", "Something went wrong!");
                }
            );
        };

        //get the data of units which user select
        $scope.unitData = {};
        $scope.selectUnitId = function(data) {
            localStorage.setItem("registeredUnitId", data._id);
            $scope.unitData.unit_number = data.unit_number;
            if (data) {
                console.log("show dropdown");
                $scope.showUnitList = false;
            } else {
                $scope.showUnitList = true;
                console.log("dont show dropdown");
            }
            return data;
        };

        var dmsg =
            "Please select the " + $rootScope.rise_unit_singleton + " number";
        $scope.goToSignUp = function(unitData) {
            if (!$scope.unitData.unit_number) {
                $scope.alertPopResi("Alert", dmsg);
            } else {
                $state.go("signUp");
            }
        };
        $scope.backToProperyName = function() {
            $state.go("signUpSelctPropty");
        };
    })
    /*******************signup controller*************/
    .controller("signUpCtrl", function(
        $scope,
        $state,
        $http,
        signUpService,
        $ionicLoading,
        $ionicPopup
    ) {
        console.log("sign up ctrl");
        $scope.Loginstate = function() {
            $state.go("login");
        };
        if (ionic.Platform.platform() == "ios") {
            $scope.preventKeyboard = function(e) {
                cordova.plugins.Keyboard.disableScroll(true);
                e.preventDefault();
                e.stopPropagation();
                window.scrollTo(0, 0);
            };
        }
        $scope.MoveToProperyName = function() {
            $state.go("signUpSelctPropty");
        };

        $scope.signUp = function(data) {
            if (!data) {
                $scope.alertPopResi("Alert", "Please enter some data");
            } else {
                if (!data.firstname) {
                    $scope.alertPopResi("Alert", "Please enter valid first name");
                } else if (!data.lastname) {
                    $scope.alertPopResi("Alert", "Please enter valid last name");
                } else if (!data.email) {
                    $scope.alertPopResi("Alert", "Please enter valid email");
                } else if (!data.mobile ||
                    (data.mobile.length < 10 || data.mobile.length > 10)
                ) {
                    $scope.alertPopResi("Alert", "Please enter valid mobile number");
                } else {
                    var signUpdata = {
                        user_type_id: "4",
                        property_id: localStorage.getItem("registerProprtyID"),
                        email: data.email,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        unit_number: localStorage.getItem("registeredUnitId"),
                        app_type: localStorage.getItem("app_type"),
                        phone_no: data.mobile
                    };
                    $ionicLoading.show();
                    console.log("signUpdata", signUpdata);
                    signUpService.registerUser().save(
                        signUpdata,
                        function(res) {
                            console.log("registrationRes", res);
                            $scope.item = res.result;
                            if (res.code == 200) {
                                $scope.alertPopResi("Alert", res.message, "login");
                                $ionicLoading.hide();
                            } else if (res.code == 400) {
                                $scope.alertPopResi("Alert", res.message);
                                $ionicLoading.hide();
                            } else {
                                $scope.alertPopResi("Alert", res.message);
                                $ionicLoading.hide();
                            }
                        },
                        function(err) {
                            $ionicLoading.hide();
                            console.log(err);
                            $scope.alertPopResi("Error", "Something went wrong!");
                        }
                    );
                }
            }
        };
        $scope.toProperyUnit = function() {
            $state.go("signUpSelctProperyUnit");
        };
    });
