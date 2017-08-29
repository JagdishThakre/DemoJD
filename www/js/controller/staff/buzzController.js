app.controller('BuzzCtrl', function($scope, $ionicSlideBoxDelegate, $cordovaActionSheet, existingNotifyService, $cordovaBarcodeScanner, $cordovaEmailComposer, loginService, usersForUnitId, $rootScope, buzzaguessService, getUnitIdServices, $timeout, $state, unitIdsList, notificationStaffList, $ionicModal, $cordovaCamera, $ionicScrollDelegate, Guestslist, $ionicHistory, $ionicPopup, CONFIG, guestsInputs, getUnitIdServices, $localStorage, $ionicLoading, packageService) {
    $scope.freshListCreate = notificationStaffList;
    $scope.freshListCreate.emptyIt = true;
    $scope.items = [];
    $scope.items = unitIdsList.units_id;
    $scope.GuestNameObject = Guestslist;
    $scope.GuestNamesListHold = guestsInputs;
    $scope.wordList = [{ word: '' }];
    $scope.curValue = 0;
    $scope.test = {};
    $scope.unitIdsList = unitIdsList;

    console.log(" $scope.items ", $scope.items);

    /* send image while edit package */

    if (Guestslist.imgURI == undefined)
        $scope.guestImages = "";
    else
        $scope.guestImages = Guestslist.imgURI;
    var freshImageList = [];
    var GuestsImagesList = Object.keys($scope.guestImages);
    for (var $z = 0; $z < GuestsImagesList.length; $z++) {
        if ($scope.guestImages[GuestsImagesList[$z]] != "")
            freshImageList.push($scope.guestImages[GuestsImagesList[$z]]);
    }

    /************code for package scanner starts*****************/

    /* @function : takepackagephoto()
     *  @Creator  :yogini
     *  @created  : 07032017
     */

    $scope.packagemethod = $rootScope.packagetype;

    $scope.takepackagephoto = function() {

        //Check Android Permissions
        var isAndroid = ionic.Platform.isAndroid();

        var takePackagePicture = function() {

            console.log("Taking Picture");
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1024,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.packageImage = "data:image/jpeg;base64," + imageData;
                $scope.pack = imageData;
                var packagedata = {
                    "property_id": $localStorage.User.property_id,
                    "imagesa": $scope.pack,
                };
                if ($rootScope.authoriedUser == true) {
                    $ionicLoading.show({
                        template: 'Scanning Package <br><ion-spinner icon="lines"></ion-spinner>'
                    });
                    console.log("packagedata", packagedata);
                    /*scan package and match the unit id*/
                    packageService.matchunitid().save(packagedata, function(res) {
                        $scope.editpackagedata = res;
                        // $rootScope.editpackagedata = res;
                        console.log("**************", JSON.stringify(res));
                        if (res.code == 200) {
                            console.log("response", JSON.stringify(res));
                            $scope.unitidpack = res.data.units_id._id;
                            $scope.subjectToGuest = "Hello Unit " + res.data.units_id.unit_number + ",";
                            $scope.unitNumber = res.data.units_id.unit_number;
                            $scope.residentname = res.data.firstname + ' ' + res.data.lastname;
                            $scope.phone = res.data.phone_no;
                            $scope.carrier = res.carrier;
                            $scope.image = res.package_image;
                            localStorage.setItem('searchUnitNo', res.data.units_id.unit_number);
                            $ionicLoading.hide();
                            var confirmPopuppack = $ionicPopup.confirm({
                                title: 'Are you sure you want to send this package to Resident ?',
                                scope: $scope,
                                cssClass: 'staffEnsureReservationPopup',
                                templateUrl: 'templates/packagepopup.html',
                                okType: 'button button-balanced ok',
                                okText: 'Ok',
                                cancelType: 'button button-assertive cancel',
                                cancelText: 'Edit'
                            });

                            /*staff confirms for resident whether he wants send or not*/

                            confirmPopuppack.then(function(response) {
                                if (response) {
                                    console.log("Staff confirms");
                                    var packageData = {
                                        "units_id": $scope.unitidpack,
                                        "users_id": $localStorage.User.user_id,
                                        "property_id": $localStorage.User.property_id,
                                        "subject": $scope.subjectToGuest,
                                        "image": $scope.image,
                                        "property_id": $localStorage.User.property_id,
                                        "token": $localStorage.User.token,
                                        "carrier": $scope.carrier,
                                        "resident_name": $scope.residentname,
                                        "items": 1,
                                        "package_type": 1,
                                        "cat_slug": "pckg"

                                    };
                                    $ionicLoading.show();
                                    /*if staff confirm yes then*/

                                    buzzaguessService.buzzaguess().save(packageData, function(res) {
                                        console.log("package", JSON.stringify(res));
                                        if (res.code == 200) {
                                            console.log("Package Res: ", res);
                                            $ionicLoading.hide();
                                            // $scope.alertPop('Alert', res.message, 'package_firstpage');
                                            $scope.alertPop('Alert', res.message);
                                            $state.reload();
                                        } else if (res.code == 201) {
                                            console.log(localStorage.getItem('searchUnitNo'));
                                            //$scope.alertPop('Alert',res.message ,'staffcmng');
                                            $scope.alertPop('Alert', res.message, 'staffcmng.resident');
                                        } else {
                                            $ionicLoading.hide();
                                            $scope.alertPop('Alert', res.message);
                                        }
                                    }, function(err) {
                                        $ionicLoading.hide();
                                        console.log(err);
                                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                                    })
                                } else {
                                    /*if staff confirm cancel then*/
                                    $rootScope.editpackagedata = $scope.editpackagedata;
                                    $state.go('editpackage');
                                    console.log("Staff do not confirm");

                                }
                            });

                        } else {
                            $rootScope.package_img = res.package_image;
                            console.log("coming", $rootScope.package_img);
                            $ionicLoading.hide();
                            var confirmPopuppackfail = $ionicPopup.confirm({
                                title: 'Alert',
                                scope: $scope,
                                cssClass: 'staffEnsureReservationPopup',
                                template: res.message,
                                okText: 'Ok',
                                cancelText: 'Cancel'
                            });
                            confirmPopuppackfail.then(function(response) {
                                if (response) {
                                    $state.go('editpackage');
                                } else {
                                    $state.reload();
                                }
                            });
                            // $scope.alertPoppackage('Alert', res.message);
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPoppackage(CONFIG.servererr, CONFIG.servererrmsg);

                    })
                } else {
                    $scope.logout();
                }
            });
        }

        if (isAndroid) {
            console.log("inside android");
            var permissions = cordova.plugins.permissions;
            permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null);

            function checkPermissionCallback(status) {
                console.log("status", JSON.stringify(status));
                if (!status.hasPermission) {
                    var errorCallback = function() {
                        console.warn('Camera permission is not turned on');
                    };
                    permissions.requestPermission(
                        permissions.CAMERA,
                        function(status) {
                            if (!status.hasPermission) {
                                errorCallback();
                            } else {
                                takePackagePicture();
                            }
                        },
                        errorCallback);
                } else {
                    console.log("else camera");
                    takePackagePicture();

                }
            }
        } else {
            console.log("already have permissions");
            takePackagePicture();
        }

    };


    /* @function : gotoeditpackage()
     *  @Creator  :yogini
     *  @created  : 16032017
     *  @purpose : navigate to edit package 
     */

    $scope.gotoeditpackage = function() {
        $state.go('editpackage');
    };


    /* @function : getresidentlist()
     *  @Creator  :yogini
     *  @created  : 28032017
     *  @purpose : navigate to edit package 
     */
    $scope.showlist = true;
    $scope.getlist = function() {
        if ($scope.showlist) {
            $scope.getlistofresident($rootScope.unitid);

        }
    }

    $scope.getlistofresident = function(unitid) {
        $scope.resident.name = '';
        $scope.unitid = unitid;

        // if ($rootScope.unitid) {
        //     $scope.unitid = $rootScope.unitid;

        // }
        console.log("$rootScope.unitid", $rootScope.unitid);
        console.log("unitid", unitid);                    
        var unit_id = {
            "units_id": unitid,
            "property_id": $localStorage.User.property_id
        };          
        usersForUnitId.getUserIds().save(unit_id, function(res) {                        
            if (res.code == 200) {                            
                $ionicLoading.hide();
                if (res.users.length) {
                    $scope.residentlist = res.users; 
                    console.log("Resident First Name: ", $scope.residentlist);    
                } else {
                    $scope.alertPop('Alert', 'No ' + $rootScope.rise_property_multiple + ' found');   
                }                                              
            }                            

                                
        }, function(err) {                        
            $ionicLoading.hide();                        
            console.log(err);                        
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);                    
        });
    }

    $scope.resident = {};
    $scope.showunregisterresi = false;

    $scope.getresidentlist = function(unitid) {
        $scope.resident.name = '';
        $scope.unitid = unitid;
        $rootScope.newuid = unitid;

        // if ($rootScope.unitid) {
        //     $scope.unitid = $rootScope.unitid;

        // }
        console.log("$rootScope.unitid", $rootScope.unitid);
        console.log("unitid", unitid);                    
        var unit_id = {
            "units_id": unitid,
            "property_id": $localStorage.User.property_id
        };          
        usersForUnitId.getUserIds().save(unit_id, function(res) {                        
            if (res.code == 200) {                            
                $ionicLoading.hide();
                if (res.users.length) {
                    $scope.residentlist = res.users; 
                    console.log("Resident First Name: ", $scope.residentlist);    
                } else {
                    $scope.alertPop('Alert', 'No ' + $rootScope.rise_property_multiple + ' Found'); 
                    $scope.showunregisterresi = true;  
                    $scope.resident.name = "Unregistered Resident";
                }                                              
            }                            

                                
        }, function(err) {                        
            $ionicLoading.hide();                        
            console.log(err);                        
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);                    
        });

        $rootScope.unitid = '';
        $rootScope.unitno = '';

    };


    /* @function : editpackage()
     *  @Creator  :yogini
     *  @created  : 16032017
     *  @purpose : Add package manually if invalid response or staff do not confirm 
     */

    $scope.editpackage = function(resident) {
        console.log("$rootScope.newuid", $rootScope.newuid);
        if ($rootScope.unitid) {
            $scope.unitid = $rootScope.unitid;
        }
        if ($rootScope.newuid) {
            $scope.unitid = $rootScope.newuid;
        }
        if ($rootScope.unitno) {
            $scope.unitno = $rootScope.unitno;
        } else {
            $scope.unitno = localStorage.getItem('unit_Number');
        }
        console.log("resident.name", resident.name);
        console.log("resident.carrier", resident.carrier);
        console.log("$scope.unitid", $scope.unitid);
        $scope.uid = localStorage.getItem('unitIds');
        $scope.subjectToGuest = "Hello Unit " + $scope.unitno + ",";
        console.log("  $scope.subjectToGuest", $scope.subjectToGuest);
        $scope.unitNumber = $scope.unitno;
        if ($scope.unitid && resident.name && resident.carrier) {
            var packageData = {
                "units_id": $scope.unitid,
                "users_id": $localStorage.User.user_id,
                "property_id": $localStorage.User.property_id,
                "subject": $scope.subjectToGuest,
                "items": 1,
                "package_type": 2,
                "image": $rootScope.package_img,
                "property_id": $localStorage.User.property_id,
                // "package_desc": package_desc,
                // "guest_names": $scope.guestNames,
                "imagesa": freshImageList,
                "token": $localStorage.User.token,
                "resident_name": resident.name,
                "carrier": resident.carrier,
                "cat_slug": "pckg"
            };
            console.log("&&&&&&&&&&&&&&&&", JSON.stringify(packageData));
            if ($scope.isOnline() == true) {

                $ionicLoading.show();
                buzzaguessService.buzzaguess().save(packageData, function(res) {
                    if (res.code == 200) {
                        /*To make the fields empty after submit*/
                        $rootScope.editpackagedata = '';
                        $rootScope.unitid = '';
                        $rootScope.unitno = '';
                        $rootScope.package_img = '';
                        console.log("Package Res: ", res);
                        guestsInputs.id = null;
                        $scope.uid = '';
                        guestsInputs.names = [];
                        localStorage.setItem('unitIds', 0);
                        localStorage.setItem('unit_Number', '');
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', res.message, 'package_firstpage');
                    } else if (res.code == 201) {
                        /*To make the fields empty after submit*/
                        $rootScope.editpackagedata = '';
                        $rootScope.unitid = '';
                        $rootScope.unitno = '';
                        $rootScope.package_img = '';
                        guestsInputs.id = null;
                        guestsInputs.names = [];
                        $ionicLoading.hide();
                        console.log(localStorage.getItem('searchUnitNo'));
                        //$scope.alertPop('Alert',res.message ,'staffcmng');
                        $scope.alertPop('Alert', res.message, 'staffcmng.resident');
                    } else {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', res.message);
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                })
            } else {

                $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
            }
        } else {
            console.log("outside");
            $scope.alertPop('Alert', 'Please select all required fields.');

        }


    };

    $scope.showToggle = function() {
        console.log("**************");
        $scope.searchFilter = { 'unit_number': '' }
        localStorage.setItem('unit_Number', '');
        if ($scope.data.show == false)
            $scope.data.show = true;
        else
            $scope.data.show = false;
    }

    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    };
    console.log("items", $scope.items);
    $scope.firstpagechngnoti = function() {
        var unitId = {
            "property_id": $localStorage.User.property_id,
            "token": $localStorage.User.token,
            "cat_slug": localStorage.getItem('notifySpecific')
        };
        if ($scope.isOnline() == true) {
            $ionicLoading.show();
            getUnitIdServices.getUnitId().save(unitId, function(res) {
                if (res.code == 200) {
                    $ionicLoading.hide();
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
                    $state.go("staffnotification");
                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        } else {
            $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
        }
    };


    /* @function : chooseentry()
     *  @Creator  :yogini 
     *  @created  : 30052017
     *  @purpose : to show the guest selection
     */

    $scope.chooseentry = function() {
        var options = {
            title: 'Select New Request',
            buttonLabels: ['Manual Entry', 'Scan Pass', 'Lookup PreAuthorized Visitor'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
            winphoneEnableCancelButton: true
        };

        $cordovaActionSheet.show(options)
            .then(function(btnIndex) {
                if (btnIndex == 1) {
                    $scope.firstpagechngnew(1);
                } else if (btnIndex == 2) {
                    console.log("fdhd")
                    $scope.scanqrcode();
                    // $state.go("scanqrcode");
                } else if (btnIndex == 3) {
                    $state.go("staffguestlist");
                } else {

                }

            });

    }

    /* @function : searchdata()
     *  @Creator  :yogini 
     *  @created  : 23062017
     *  @purpose : to search the guest
     */


    $scope.searchdata = function(searchFilter, guestname) {
        $rootScope.searching = true;

        $scope.guestname = guestname;

        setTimeout(function() {
            $scope.searchUsingService($rootScope.unitvalue);
        }, 100);

        $ionicScrollDelegate.anchorScroll();

    }

    /* @function : searchUsingService()
     *  @Creator  :yogini 
     *  @created  : 23062017
     *  @purpose : to search the guest data
     */

    $scope.searchUsingService = function(item) {
        if (item) {
            $scope.search1 = { 'unit_number': item.unit_number };
            $scope.searchKeyWord = item.unit_number;
            $scope.searchThisUnit = item._id;
            // $scope.messagesJson.currentSearchID = item._id;
        } else {
            console.log("in else part");
            $scope.searchThisUnit = '';
        }

        $scope.page_number = "0";
        $scope.guestNotify = [];
        $scope.currentRecordCount = 0;
        $scope.msgLength = 0;


        setTimeout(function() {
            $scope.getguestlistforstaff();
        }, 100);

    }

    /* @function : getguestlistforstaff()
     *  @Creator  :yogini 
     *  @created  : 22062017
     *  @purpose : to show the list of guest
     */
    $scope.page_number = "0";
    $scope.msgLength = 0;
    $scope.loadContent = 0;


    $scope.getguestlistforstaff = function() {
        $scope.hideInfiniteContent = false;
        if ($rootScope.authoriedUser == true) {
            var guestlistData = {
                "property_id": $localStorage.User.property_id,
                "page_number": $scope.page_number,
                "guest_name": $scope.guestname,
                "units_id": $scope.searchThisUnit
            }
            $ionicLoading.show();
            buzzaguessService.getguestliststaff().save(guestlistData, function(res) {
                console.log("res", res);
                $ionicLoading.hide()
                if ($rootScope.searching) {
                    $rootScope.totalrecords = res.list_count;
                    $rootScope.entertaskdetails = true;
                    $scope.closeModal();
                }
                if (res) {
                    $scope.gotresponse = true;
                }
                localStorage.setItem('infiCount', res.list_count);
                $scope.loadContent = localStorage.getItem('infiCount');
                if ($scope.msgLength == 0) {
                    $scope.msgLength = res.results.length;
                } else {
                    $scope.msgLength = $scope.msgLength + res.results.length;
                }
                console.log("$scope.msgLength ", $scope.msgLength);
                console.log("$scope.loadContent ", $scope.loadContent);

                if ($scope.msgLength == $scope.loadContent) {
                    $scope.noMoreItemsAvailable = true;
                } else {
                    $scope.noMoreItemsAvailable = false;
                }

                $scope.page_number = parseInt($scope.page_number) + 1;
                if (res.results.length > 0) {

                    angular.forEach(res.results, function(item) {
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;
                        $scope.guestNotify.push(item);
                        $rootScope.notilist = $scope.guestNotify;

                        // if (item.users_id._id == $localStorage.User.user_id) {
                        //     $localStorage.User.profile_img = item.users_id.profile_img;
                        // }

                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    // $scope.noNotiText = "You have no existing reservations"
                }
                //$scope.$broadcast('scroll.refreshComplete');
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout()
        }
    }


    if ($rootScope.searching) {
        $scope.guestNotify = $rootScope.notilist;
        console.log("inside searching", $rootScope.notilist);
    } else {
        $scope.guestNotify = [];
        $scope.getguestlistforstaff();
        console.log("outside searching");


    }


    $scope.loadGuest = function() {
        //calling("load more")
        $scope.getguestlistforstaff();
    }



    $scope.blur = false;

    $scope.showIt = function() {
        $scope.blur = true;
        var template = 'templates/Staff/BuzzGuest&Food/searchguest.html';
        $ionicModal.fromTemplateUrl(template, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        $scope.blur = false;

        // Execute action
        console.log("hidden");

    });

    $scope.closeModal = function() {
        $scope.blur = false;
        $rootScope.closing = true;
        if ($scope.modal) {
            $scope.modal.hide();

        }
    };

    /* @function : callphone()
     *  @Creator  :sidjain
     *  @created  : Jul 25 2017
     *  @purpose : to show call popup when phone number is clicked on guest list/details screens
     */


    $scope.callphone = function(data) {
        window.plugins.CallNumber.callNumber(onSuccess, onError, data, false);

        function onSuccess(result) {
            console.log("Success:" + result);
        }

        function onError(result) {
            console.log("Error:" + result);
        }
    };

    /* @function : emailContact()
     *  @Creator  :sidjain
     *  @created  : Jul 25 2017
     *  @purpose : to open email composer when email is clicked on guest list/details screens
     */
    $scope.emailContact = function(emailaddress) {

        $cordovaEmailComposer.isAvailable().then(function() {
            // is available
        }, function() {
            // not available
        });

        var email = {
            to: emailaddress,
            subject: 'Hey There!',
            body: 'Hello,<br><br>',
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function() {
            // user cancelled email
        });
    };

    /* @function : doRefreshguestsListstaff()
     *  @Creator  :yogini 
     *  @created  : 22062017
     *  @purpose : to show the  refresh list of guest
     */

    $scope.doRefreshguestsListstaff = function() {
        $scope.guestNotify = [];
        $rootScope.searching = false;
        var pos = $ionicScrollDelegate.getScrollPosition();
        $scope.hideInfiniteContent = false;
        if ($rootScope.authoriedUser == true) {
            var guestlistData = {
                "property_id": $localStorage.User.property_id,
                "units_id": $scope.searchThisUnit,
                "guest_name": $scope.guestname,
                "page_number": 0
            }
            $ionicLoading.show();
            buzzaguessService.getguestliststaff().save(guestlistData, function(res) {
                console.log("res", res);
                $ionicLoading.hide()
                if (res) {
                    $scope.gotresponse = true;
                }
                localStorage.setItem('infiCount', res.list_count);
                $scope.loadContent = localStorage.getItem('infiCount');
                if ($scope.msgLength == 0) {
                    $scope.msgLength = res.results.length;
                } else {
                    $scope.msgLength = $scope.msgLength + res.results.length;
                }
                if ($scope.msgLength == $scope.loadContent) {
                    $scope.noMoreItemsAvailable = true;
                } else {
                    $scope.noMoreItemsAvailable = false;
                }

                $scope.page_number = parseInt($scope.page_number) + 1;
                if (res.results.length > 0) {

                    angular.forEach(res.results, function(item) {
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;
                        $scope.guestNotify.push(item);

                        // if (item.users_id._id == $localStorage.User.user_id) {
                        //     $localStorage.User.profile_img = item.users_id.profile_img;
                        // }

                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    // $scope.noNotiText = "You have no existing reservations"
                }
                //$scope.$broadcast('scroll.refreshComplete');
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout()
        }
    }


    $scope.goToDetails = function(id, scanflag) {
        if (scanflag) {
            $rootScope.scaning = true;
        } else {
            $rootScope.scaning = false;

        }
        $state.go("staffguestdetails");
        $rootScope.guestId = id;
    }



    /* @function : showstaffguestdetails()
     *  @Creator  :yogini 
     *  @created  : 22062017
     *  @purpose : to show the details of guest and verify the guest is authorized or not
     */
    $scope.staffQRcolor = {
        "background": "#000;"
    };

    $scope.approved = false;

    $scope.red = false;

    $scope.showstaffguestdetails = function() {
        $ionicLoading.show();
        console.log("$scope.scaning", $rootScope.scaning, $rootScope.flag);
        console.log("*****", localStorage.getItem("guestdetails"));
        if (!$scope.guestId) {
            $scope.guestId = localStorage.getItem("guestdetails");
        }

        if ($rootScope.scaning) {

            if ($rootScope.flag == true) {
                $scope.approved = true;
                $scope.staffQRcolor = {
                    "background": "rgba(61, 136, 61, 0.70)"
                };

            } else if ($rootScope.flag == false) {
                $scope.staffQRcolor = {
                    "background": "rgba(232, 28, 28, 0.70)"
                };
            } else {
                $scope.staffQRcolor = {
                    "background": "#000;"
                };
            }

            if ($rootScope.authoriedUser == true) {
                var inputjson = {
                    "schedule_id": $scope.guestId,
                    "loggedinuserid": $localStorage.User.user_id
                }
                console.log("dataa", JSON.stringify(inputjson));

                existingNotifyService.showguest().save(inputjson, function(res) {
                    $scope.guestdetail = res.results;
                    $rootScope.schedule_id = res.results.schedule_id;
                    // Firstname validation
                    if ($scope.guestdetail.firstname != undefined && $scope.guestdetail.firstname != undefined) {
                        $scope.guestdetail.initials = $scope.guestdetail.firstname.charAt(0);
                    }
                    // Lastname validation
                    if ($scope.guestdetail.lastname != undefined && $scope.guestdetail.lastname != undefined) {
                        $scope.guestdetail.initials += $scope.guestdetail.lastname.charAt(0);
                    }
                    $scope.valid = $rootScope.flag;
                    $ionicLoading.hide();

                }, function(err) {
                    $ionicLoading.hide();
                    $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                })
            } else { $scope.logout() }

        } else {
            if ($rootScope.authoriedUser == true) {
                var inputjson = {
                    "schedule_id": $scope.guestId,
                    "loggedinuserid": $localStorage.User.user_id,
                    "notification": true

                }
                console.log("dataa", JSON.stringify(inputjson));
                existingNotifyService.showguest().save(inputjson, function(res) {
                    $scope.guestdetail = res.results;
                    // Firstname validation
                    if ($scope.guestdetail.firstname != undefined && $scope.guestdetail.firstname != undefined) {
                        $scope.guestdetail.initials = $scope.guestdetail.firstname.charAt(0);
                    }
                    // Lastname validation
                    if ($scope.guestdetail.lastname != undefined && $scope.guestdetail.lastname != undefined) {
                        $scope.guestdetail.initials += $scope.guestdetail.lastname.charAt(0);
                    }

                    $scope.valid = false;
                    $ionicLoading.hide();
                    if (res.code == 200) {
                        $scope.staffQRcolor = {
                            "background": "rgba(61, 136, 61, 0.70)"
                        };
                        $scope.approved = true;
                        $scope.firstname = res.results.SMS_data.guestFirstName;
                        $scope.lastname = res.results.SMS_data.guestLastName;
                        $scope.profileimg = res.results.profile_img;
                        $scope.phone_no = res.results.SMS_data.guestPhone;
                        $scope.email = res.results.SMS_data.guestEmail;
                        $scope.unitno = res.results.unit_number;
                        $scope.starttime = res.results.pass_valid_start_time;
                        $scope.endtime = res.results.pass_valid_end_time;
                        $rootScope.schedule_id = res.results.schedule_id;
                        $scope.validtext = "Valid Times Today";
                        var service_id = res.service_id;
                        console.log("service_id****", res, service_id);
                        localStorage.setItem("service_id", service_id);

                        $scope.valid = true;

                    } else if (res.code == 401) {
                        $scope.red = true;
                        $scope.staffQRcolor = {
                            "background": "rgba(232, 28, 28, 0.70)"
                        };

                        $scope.firstname = res.results.SMS_data.guestFirstName;
                        $scope.lastname = res.results.SMS_data.guestLastName;
                        $scope.profileimg = res.results.profile_img;
                        $scope.phone_no = res.results.SMS_data.guestPhone;
                        $scope.email = res.results.SMS_data.guestEmail;
                        $scope.unitno = res.results.unit_number;
                        $scope.starttime = '';
                        $scope.endtime = '';
                        $rootScope.schedule_id = res.results.schedule_id;
                        $scope.validtext = "Invalid Pass!";

                        $scope.valid = false;

                    }
                }, function(err) {
                    $ionicLoading.hide();
                    $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                })
            } else { $scope.logout() }
        }

    }


    $scope.sendToStaffNotificationThreadOK = function() {
        // $state.go("staffnotificationthread");
        var expData = {
            "schedule_id": $rootScope.schedule_id,
            "loggedinuserid": $localStorage.User.user_id,
            "flag": true
        }
        $ionicLoading.show();
        buzzaguessService.expireguestpass().save(expData, function(res) {
            console.log("sendtrue*******", res);
            var service_id = res.service_id;
            localStorage.setItem("service_id", service_id);
            $scope.staffQRcolor = {
                "background": "#000"
            };
            $ionicLoading.hide();
            $state.go("staffnotificationthread");

        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    }


    $scope.sendToStaffNotificationThreadExpired = function() {
        var expData = {
            "schedule_id": $rootScope.schedule_id,
            "loggedinuserid": $localStorage.User.user_id,
            "flag": false
        }
        $ionicLoading.show();
        buzzaguessService.expireguestpass().save(expData, function(res) {
            console.log("send*******", res);
            var service_id = res.service_id;
            localStorage.setItem("service_id", service_id);
            $scope.staffQRcolor = {
                "background": "#000"
            };
            $ionicLoading.hide();
            $state.go("staffnotificationthread");

        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    }



    $scope.afterscandetails = function() {
        $ionicLoading.show();
        console.log("*****", localStorage.getItem("guestdetails"));
        if (!$scope.guestId) {
            $scope.guestId = localStorage.getItem("guestdetails");
        }
        if ($rootScope.authoriedUser == true) {
            var inputjson = {
                "schedule_id": $scope.guestId,
                "loggedinuserid": $localStorage.User.user_id

            }
            existingNotifyService.showguest().save(inputjson, function(res) {
                $scope.guestdetail = res.results;
                // Firstname validation
                if ($scope.guestdetail.firstname != undefined && $scope.guestdetail.firstname != undefined) {
                    $scope.guestdetail.initials = $scope.guestdetail.firstname.charAt(0);
                }
                // Lastname validation
                if ($scope.guestdetail.lastname != undefined && $scope.guestdetail.lastname != undefined) {
                    $scope.guestdetail.initials += $scope.guestdetail.lastname.charAt(0);
                }

                $scope.valid = false;
                $ionicLoading.hide();

            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else { $scope.logout() }
    }

    /* @function : sortComment()
     *  @Creator  :yogini 
     *  @created  : 23062017
     *  @purpose : to sort the guest list according to created dates
     */

    $scope.sortComment = function(message) {
        var date = new Date(message.SMS_data.created);
        return date;
    }


    /* @function : scanqrcode()
     *  @Creator  :yogini 
     *  @created  : 08062017
     *  @purpose : to scan the QR code
     */
    $scope.QRcolor = {
        "background": "rgba(0, 0, 0, 0.7)"
    };

    $scope.passdelete = false;
    $scope.scanqrcode = function() {
        $cordovaBarcodeScanner
            .scan()
            .then(function(barcodeData) {
                console.log("barcodeData", JSON.stringify(barcodeData));
                if (barcodeData.text) {
                    var qrcodeData = {
                        "qr_code": barcodeData.text,
                        "loggedinuserid": $localStorage.User.user_id

                    }
                    console.log("qrcodeData", JSON.stringify(qrcodeData))
                    buzzaguessService.scanqrcode().save(qrcodeData, function(res) {
                        console.log("resscanqrcode", JSON.stringify(res));
                        $rootScope.schedule_id = res.results[0].schedule_id;
                        $rootScope.flag = res.flag;

                        $ionicLoading.hide();
                        if (res.code == 200 && res.is_deleted == false) {
                            $scope.goToDetails($rootScope.schedule_id, 'scanflag');
                            $scope.QRcolor = {
                                "background": "rgba(61, 136, 61, 0.68)"
                            };
                            $scope.approved = true;


                        } else if (res.code == 200 && res.is_deleted == true) {
                            // $scope.goToDetails($rootScope.schedule_id, 'scanflag');

                            $scope.QRcolor = {
                                "background": "rgba(0, 0, 0, 0.7)"
                            };
                            var confirmPopuppackfail = $ionicPopup.confirm({
                                title: 'Alert',
                                scope: $scope,
                                template: 'This pass has been deleted by the invitee',
                                cssClass: 'WoMngrPopHead',
                                okType: 'button button-balanced ok',
                                okText: 'Get Approval',
                                cancelType: 'button button-assertive cancel',
                                cancelText: 'Cancel'
                            });
                            confirmPopuppackfail.then(function(response) {
                                if (response) {
                                    $scope.senddeletenotification();
                                } else {

                                }
                            });
                            // $scope.alertPop('Alert', 'This pass has been deleted by the invitee', 'staffguestlist');

                        } else if (res.code == 401) {
                            $scope.goToDetails($rootScope.schedule_id, 'scanflag');
                            $scope.red = true;
                            $scope.QRcolor = {
                                "background": "rgba(232, 28, 28, 0.46)"
                            };

                        } else {
                            $scope.alertPop('Alert', res.msg);
                        }

                    }, function(err) {
                        $ionicLoading.hide();
                        $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                    })

                }

            }, function(err) {

            })
    }


    $scope.senddeletenotification = function() {
        var expData = {
            "schedule_id": $rootScope.schedule_id,
            "loggedinuserid": $localStorage.User.user_id,
            "is_pass_deleted": true
        }
        $ionicLoading.show();
        buzzaguessService.expireguestpass().save(expData, function(res) {
            console.log("sendtrue*******", res);
            var service_id = res.service_id;
            localStorage.setItem("service_id", service_id);
            $scope.staffQRcolor = {
                "background": "#000"
            };
            $ionicLoading.hide();
            $state.go("staffnotificationthread");

        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    }


    $scope.firstpagechngnew = function(index) {
        var unitId = {
            "property_id": $localStorage.User.property_id,
            "token": $localStorage.User.token,
            "cat_slug": localStorage.getItem('notifySpecific')
        };
        if ($scope.isOnline() == true) {
            $ionicLoading.show();
            getUnitIdServices.getUnitId().save(unitId, function(res) {
                if (res.code == 200) {
                    $ionicLoading.hide();
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
                    if (index == 1) {
                        $state.go("buzzandfood");
                    } else if (index == 2) {
                        $state.go("package");
                    }
                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        } else {
            $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
        }
    };

    if (guestsInputs.id == null) {
        $scope.wordList = [{
            word: ''
        }];
        $scope.GuestNamesListHold.imgHold = {};
        $scope.GuestNameObject.imgURI = {};
    } else {
        $scope.curValue = 10;
        $scope.word = guestsInputs.names;
        $scope.GuestNameObject.imgURI = guestsInputs.imgHold;
        $scope.wordList = [];
        angular.forEach(guestsInputs.names, function(val, key) {
            $scope.wordList.push({
                word: val
            });
        });
    }
    $scope.somefunction = function(val) {
        console.log(val.unit_number);
    };

    $scope.someMethod = function(isword, index) {
        var value = index + 1;
        if (isword.length == 1 && value == $scope.wordList.length) {
            $scope.wordList.push({
                word: ''
            });
        }
        if (isword.length == 0) {
            if ($scope.wordList.length - 1 == index + 1)
                $scope.wordList.pop();
        }
        if ($scope.curValue == 10) {
            $scope.wordList.push({
                word: ''
            });
            $scope.curValue = 0;
        }
    };
    $scope.removeBuzz = function(index) {
        $scope.wordList.splice(index, 1);
    };
    $scope.leavePage = function() {
        $scope.GuestNamesListHold.id = null;
        $ionicHistory.goBack(-1);
    };
    var msg = "Please select the " + $rootScope.rise_unit_singleton + " id";
    $scope.takePicture = function(index) {
        console.log(localStorage.getItem('unit_Number'));
        $scope.GuestNameObject.resColor = localStorage.getItem('unitIds');
        $ionicLoading.hide();
        if ($scope.GuestNameObject.resColor != undefined) {
            if ($scope.GuestNameObject.resColor != 0 && localStorage.getItem('unit_Number') != '') {
                if (index == 1) {
                    $state.go('buzz&foodlist');
                } else if (index == 2) {
                    $state.go('packagelist');
                } else {
                    $scope.alertPop('Alert', msg);
                }
            } else {
                $scope.alertPop('Alert', msg);
            }
        } else {
            $scope.alertPop('Alert', msg);
        }
    };
    $scope.getclicked = function() {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        //if android version is morethan 6  or equal then  accessing permission
        var isAndroid = ionic.Platform.isAndroid();
        if (isAndroid && ionic.Platform.version() >= 6) {
            var permissions = cordova.plugins.permissions;
            permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null);

            function checkPermissionCallback(status) {
                console.log("status", JSON.stringify(status));
                if (!status.hasPermission) {
                    var errorCallback = function() {
                        console.warn('Camera permission is not turned on');
                    };
                    permissions.requestPermission(
                        permissions.CAMERA,
                        function(status) {
                            if (!status.hasPermission) {
                                errorCallback();
                            } else {
                                $cordovaCamera.getPicture(options).then(function(imageData) {
                                    $scope.mul = $scope.mul + 1;
                                    $scope.GuestNamesListHold = guestsInputs;
                                    $scope.GuestNameObject.imgURI[localStorage.getItem("ivalue") + localStorage.getItem("ivalue")] = "data:image/jpeg;base64," + imageData;
                                    $scope.GuestNamesListHold.imgHold = $scope.GuestNameObject.imgURI;
                                    console.log($scope.GuestNamesListHold.imgHold[localStorage.getItem("ivalue") + localStorage.getItem("ivalue")]);
                                    localStorage.setItem("ivalue", localStorage.getItem("ivalue") + localStorage.getItem("ivalue"));
                                }, function(err) {});
                            }
                        },
                        errorCallback);
                } else {
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        $scope.mul = $scope.mul + 1;
                        $scope.GuestNamesListHold = guestsInputs;
                        $scope.GuestNameObject.imgURI[localStorage.getItem("ivalue") + localStorage.getItem("ivalue")] = "data:image/jpeg;base64," + imageData;
                        $scope.GuestNamesListHold.imgHold = $scope.GuestNameObject.imgURI;
                        console.log($scope.GuestNamesListHold.imgHold[localStorage.getItem("ivalue") + localStorage.getItem("ivalue")]);
                        localStorage.setItem("ivalue", localStorage.getItem("ivalue") + localStorage.getItem("ivalue"));
                    }, function(err) {});

                }
            }

        } else {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.mul = $scope.mul + 1;
                $scope.GuestNamesListHold = guestsInputs;
                $scope.GuestNameObject.imgURI[localStorage.getItem("ivalue") + localStorage.getItem("ivalue")] = "data:image/jpeg;base64," + imageData;
                $scope.GuestNamesListHold.imgHold = $scope.GuestNameObject.imgURI;
                console.log($scope.GuestNamesListHold.imgHold[localStorage.getItem("ivalue") + localStorage.getItem("ivalue")]);
                localStorage.setItem("ivalue", localStorage.getItem("ivalue") + localStorage.getItem("ivalue"));
            }, function(err) {});
        }
        //if android version is morethan 6  or equal then  accessing permission ends here

    };

    $scope.removeImg = function(deleteImg) {
        var imgkeys = Object.keys($scope.GuestNameObject.imgURI);
        var key = null;
        for (var i = 0; i < imgkeys.length; i++) {
            if ($scope.GuestNameObject.imgURI[imgkeys[i]] == deleteImg) {
                key = imgkeys[i];
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Alert',
                    cssClass: 'staffPopup',
                    template: 'Are you sure you want to delete this image?'
                });
                confirmPopup.then(function(res) {
                    if (res == true) {
                        console.log(key);
                        delete $scope.GuestNameObject.imgURI[key];
                    }
                });
            }
        }
    };
    $scope.showData = function(index) {
        console.log(index);
        var freshGuestList = [];
        angular.forEach($scope.wordList, function(val, key) {
            if (val.word != '') freshGuestList.push(val.word);
        });
        $scope.GuestNameObject.GuestNames = freshGuestList;
        $scope.GuestNamesListHold.names = $scope.guestNames;
        $scope.GuestNamesListHold.id = 1;
        // $ionicHistory.nextViewOptions({
        //   disableAnimate: true,
        // });
        if (freshGuestList.length) {
            if (index == 1) {
                $state.go('buzz&foodreview');
            } else if (index == 2) {
                console.log("123");
                $state.go('packagereview');
            } else {
                $scope.alertPop('Alert', "Sorry!!");
            }
        } else {
            if (index == 1) {
                $scope.alertPop('Alert', 'Please enter the guest names to continue');
            } else {
                $scope.alertPop('Alert', 'Please enter package details to continue');

            }
        }
    };
    $scope.buzzlistcancel = function() {
        var freshGuestList = [];
        angular.forEach($scope.wordList, function(val, key) {
            if (val.word != '') freshGuestList.push(val.word);
        });
        if (freshGuestList.length > 0) {
            $scope.GuestNamesListHold.names = freshGuestList;
            $scope.GuestNamesListHold.id = 1;
        } else
            guestsInputs.id = null;
        $ionicHistory.goBack(-1);
    };

    $scope.openImageZoom1 = function(images, index) {
        $scope.activeImageSlide = index;
        $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.attachmentModal1 = modal;
            $scope.previewImages = [];
            $scope.previewImages = images;
            $scope.attachmentModal1.show();
        });
    };
    $scope.closeGaleryModal = function() {
        $scope.attachmentModal1.hide();
    }
});
