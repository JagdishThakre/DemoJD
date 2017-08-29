app.controller("WorkOrderCtrlStaff", function(
    $scope,
    workOrderStaff,
    $rootScope,
    getUnitIdServices,
    notificationStaffList,
    $state,
    unitIdsList,
    $ionicHistory,
    notifyCount,
    $window,
    $localStorage,
    $ionicPopup,
    CONFIG,
    $ionicLoading,
    addSign,
    $cordovaDevice,
    $cordovaCapture,
    $cordovaFileTransfer,
    getFeatures,
    $ionicPopover,
    wrkOrdService,
    uploadService,
    $timeout,
    $cordovaImagePicker,
    $ionicModal,
    $cordovaCamera,
    $ionicScrollDelegate,
    $stateParams
) {
    $scope.items = [];
    $scope.woClear = {};
    var freshImageList = [];
    $scope.items = unitIdsList.units_id;
    $scope.unitIdsList = unitIdsList;
    $scope.data = {};
    $scope.datanew = {};
    $scope.filteredText = [];
    $scope.imageSrc = "";
    // $scope.location = "";
    $scope.problem = "";
    $scope.description = "";
    $scope.note = "";
    $scope.choice = false;
    $scope.estimate = false;
    $scope.permission = false;

    var msg = "Please select the " + $rootScope.rise_unit_singleton + " id";
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    };
    /***************Work Order Count ******************/
    $scope.featureNote1 = function() {
        if ($rootScope.authoriedUser == true) {
            var notifycountData = {
                users_id: $localStorage.User.user_id,
                property_id: $localStorage.User.property_id,
                token: $localStorage.User.token
            };
            notifyCount.notifyCount().save(notifycountData, function(res) {
                console.log(res.results);
                for (var j = 0; j < res.results.length; j++) {
                    for (var i = 0; i < $scope.featuresData1.length; i++) {
                        if (
                            res.results[j].services_category_id.slug ==
                            $scope.featuresData1[i].slug
                        ) {
                            $scope.featuresData1[i].notiCount = res.results[j].count;
                        }
                    }
                }
            });
        } else {
            $scope.logout();
        }
    };

    if (ionic.Platform.platform() == "ios") {
        // $scope.preventKeyboard = function(e) {
        //     cordova.plugins.Keyboard.disableScroll(true);
        //     e.preventDefault();
        //     e.stopPropagation();
        //     window.scrollTo(0, 0);
        // };

        $scope.woformsettings = {
            theme: "ios-dark",
            tap: false
        };
    } else if (ionic.Platform.platform() == "android") {
        $scope.woformsettings = {
            theme: "android-holo",
            tap: false
        };
    } else if (ionic.Platform.platform() == "macintel") {
        $scope.woformsettings = {
            theme: "ios-dark",
            tap: false
        };
        console.log("Default Mac Browser Theme");
    } else {
        $scope.woformsettings = {
            theme: "material-dark",
            tap: false
        };
        console.log("Default Theme");
    }

    /***********************WorkOrder List************/

    var workordData = {
        users_id: $localStorage.User.user_id
    };
    $scope.featuresData1 = [];
    $scope.getWoList = function() {
        if ($rootScope.authoriedUser == true) {
            $ionicLoading.show();
            getFeatures.wofeature().save(
                workordData,
                function(res) {
                    console.log(res);
                    $ionicLoading.hide();
                    for (var i = 0; i < res.data.length; i++) {
                        console.log(res.data[i].service_category_id);
                        $scope.featuresData1[i] = res.data[i].service_category_id;
                    }
                    console.log(
                        "$scope.featuresData1.length: ",
                        $scope.featuresData1.length
                    );
                },
                function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                }
            );
        } else {
            $scope.logout();
        }
    };
    /****Wor order manger feature listing fucntion starts here *****/
    var workordData = {
        users_id: $localStorage.User.user_id
    };
    $scope.getWoManagerList = function() {
        $scope.featuresData1 = [];
        if ($rootScope.authoriedUser == true) {
            $ionicLoading.show();
            getFeatures.woManagerfeature().save(
                workordData,
                function(res) {
                    console.log("Wo mange res", res);
                    $ionicLoading.hide();
                    for (var i = 0; i < res.data.length; i++) {
                        console.log(res.data[i]);
                        $scope.featuresData1[i] = res.data[i];
                    }
                },
                function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                }
            );
        } else {
            $scope.logout();
        }
    };

    /****Wor order manger feature listing fucntion ends here *****/
    console.log("$stateParams.parentWoType", $stateParams.parentWoType);
    $scope.changestate = function(index, id, count) {
        console.log(index, id, count);
        if ($rootScope.authoriedUser == true) {
            $scope.freshListCreate = notificationStaffList;
            $scope.freshListCreate.emptyIt = true;
            localStorage.setItem("feature_id", id);
            localStorage.setItem("notifySpecific", index);

            var unitId = {
                property_id: $localStorage.User.property_id,
                token: $localStorage.User.token,
                cat_slug: localStorage.getItem("notifySpecific")
            };
            if ($scope.isOnline() == true) {
                $ionicLoading.show();
                getUnitIdServices.getUnitId().save(
                    unitId,
                    function(res) {
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

                            if ($stateParams.parentWoType == "woManager") {
                                if (index == "ewo") {
                                    $state.go("emergencyWo");
                                } else if (index == "nwo") {
                                    $state.go("nwNewExist");
                                } else {
                                    console.log("no state");
                                }
                            } else if ($stateParams.parentWoType == "woViewer") {
                                if (index == "ewo") {
                                    $state.go("EwoExistListView");
                                } else if (index == "nwo") {
                                    $state.go("NwoExistListView");
                                } else {
                                    console.log("no state");
                                }
                            }
                        }
                    },
                    function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    }
                );
            } else {
                $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
            }
        } else {
            $scope.logout();
        }
    };

    $scope.makeEwo = function() {
        $state.go("emergencyWoUnitSlct");
    };
    $scope.listingEwo = function() {
        $state.go("EwoExistList");
    };

    $scope.crtWo = function() {
        if (localStorage.getItem("unit_Number") != "") {
            $state.go("sendEmergency");
        } else {
            $scope.alertPop("Alert", msg);
        }
    };

    $scope.sendemw = function(text) {
        if ($rootScope.authoriedUser == true) {
            $scope.emdata = text;
            var emwData = {
                units_id: localStorage.getItem("unitIds"),
                users_id: $localStorage.User.user_id,
                property_id: $localStorage.User.property_id,
                subject: "",
                message: $scope.emdata,
                token: $localStorage.User.token,
                cat_slug: "ewo",
                unitname: localStorage.getItem("unit_Number"),
                firstname: $localStorage.User.firstname,
                lastname: $localStorage.User.lastname
            };
            console.log(emwData);
            $ionicLoading.show();
            workOrderStaff.sendEwoStaff().save(
                emwData,
                function(res) {
                    console.log(res);
                    if ((res.code = 200)) {
                        localStorage.getItem("unitIds", "");
                        $ionicLoading.hide();
                        $scope.alertPop("Alert", res.message, "emergencyWo");
                    } else if ((res.code = 404)) {
                        $ionicLoading.hide();
                        $scope.alertPop(
                            "Alert",
                            "Please try after some time",
                            "staff_workorder"
                        );
                    } else {
                        $ionicLoading.hide();
                        $scope.alertPop("Alert", "Please try after some time");
                    }
                    $scope.emdata = "";
                },
                function(err) {
                    $ionicLoading.hide();
                    $scope.alertPop(
                        "Alert",
                        "Please try after some time",
                        "staff_workorder"
                    );
                }
            );
        } else {
            $scope.logout();
        }
    };

    $scope.clearemw = function(text) {
        console.log(text);
        //console.log("i ma called");
        $scope.woClear.text = "";
    };
    $scope.workOrderCancel = function() {
        $ionicHistory.goBack(-1);
    };
    $scope.makeNwo = function() {
        $state.go("nwUnitSelect");
    };
    $scope.listingNwo = function() {
        console.log("MOve staff notification");
        $state.go("NwoExistList");
    };
    $scope.goTonWoForm = function(data) {
        if (localStorage.getItem("unit_Number") != "") {
            $state.go("nwNewReqForm");
        } else {
            $scope.alertPop("Alert", msg);
        }
    };

    $ionicPopover
        .fromTemplateUrl(
            "templates/Staff/workorderManager/nwNewFormPredectiveText.html", {
                scope: $scope
            }
        )
        .then(function(popover) {
            console.log("popover", popover);
            $scope.popover = popover;
        });

    //Cleanup the popover when we're done with it!
    $scope.$on("$destroy", function() {
        $scope.popover.remove();
    });
    // Execute action on hidden popover
    $scope.$on("popover.hidden", function() {
        //angular.element(document.body).removeClass('popover-open');
        console.log("Hiding PopOver");
    });

    // Execute action on remove popover
    $scope.$on("popover.removed", function() {
        angular.element(document.body).removeClass("popover-open");
        console.log("Removing PopOver");
    });

    $scope.predectiveCall = function() {
        var predectiveData = {
            property_id: $localStorage.User.property_id
        };
        wrkOrdService.predectiveText().save(predectiveData, function(res) {
            console.log("wrkOrdService", res);
            if (res.code == 200) {
                $scope.predectiveText = res.result;
            } else {
                $scope.alertPop("Alert", "Something went wrong");
            }
        });
    };

    $scope.setPromptText = function(text) {
        $scope.location = text;
        $scope.datanew.location = text;
        $scope.popover.hide();
    };

    $scope.openPredicts = function() {
        $scope.popover.show();
    };
    $scope.compareText = function(text) {
        console.log("newloc", text);
        if (text != undefined) {
            if (text.length != 0) {
                $scope.filteredText = [];
                angular.forEach($scope.predectiveText, function(item) {
                    if (item.text_name.indexOf(text) >= 0) {
                        $scope.filteredText.push({
                            text_name: item.text_name
                        });
                    }
                });
            } else {
                $scope.filteredText = [];
            }
        } else {
            $scope.filteredText = [];
        }
    };
    $scope.featureNote = function() {
        console.log("residentActionSheet", residentActionSheet.data);
        // $scope.subWorkorderFeatures = residentActionSheet.data;

        $scope.subWorkorderFeatures = [];
        for (var i = 0; i < residentActionSheet.data.length; i++) {
            // if (residentActionSheet.data[i]._id==='5629c4a03949c780667d5c5d' || residentActionSheet.data[i]._id==='5629c4763949c780667d5c5c') {
            if (
                residentActionSheet.data[i].service_category_id.name ==
                "5629c4763949c780667d5c5c"
            ) {
                if ($rootScope.user_permissions.Emergency_Work_Order) {
                    $scope.subWorkorderFeatures.push(residentActionSheet.data[i]);
                    console.log("Emergency_Work_Order");
                }
            } else if (
                residentActionSheet.data[i].service_category_id.name ==
                "5629c4a03949c780667d5c5d"
            ) {
                if ($rootScope.user_permissions.Normal_Work_Order) {
                    $scope.subWorkorderFeatures.push(residentActionSheet.data[i]);
                    console.log("Normal_Work_Order");
                }
            }
            // }
        }
    };

    $scope.openModal = function(img) {
        $ionicModal
            .fromTemplateUrl("templates/Staff/workorder/openImgfull.html", {
                scope: $scope,
                animation: "slide-in-up"
            })
            .then(function(modal) {
                $scope.modal = modal;
                $scope.imageSrc = img;
                $scope.modal.show();
            });
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal = "";
    };
    /***********************Function for sending Nrml-Work-order***************/
    $scope.sendStaffNwForm = function(location, problem, description, choice, estimate, permission, note) {
        if ($rootScope.authoriedUser == true) {
            $ionicLoading.show();
            var freshImageList = [];
            angular.forEach($scope.GuestNameObject, function(val, key) {
                freshImageList.push(val);
            });
            $timeout(function() {
                console.log("freshImageList", freshImageList);
                if (permission == undefined) {
                    permission = false;
                }
                if (permission == undefined) {
                    permission = false;
                }
                if (estimate == undefined) {
                    estimate = false;
                }
                var nwData = {
                    units_id: localStorage.getItem("unitIds"),
                    users_id: $localStorage.User.user_id,
                    property_id: $localStorage.User.property_id,
                    token: $localStorage.User.token,
                    cat_slug: "nwo",
                    description: description,
                    location: location,
                    problem: problem,
                    have_pet: choice,
                    imagesa: freshImageList,
                    firstname: $localStorage.User.firstname,
                    lastname: $localStorage.User.lastname,
                    estimate_needed: estimate,
                    permission_to_enter: permission,
                    entry_note: note,
                    firstname: $localStorage.User.firstname,
                    lastname: $localStorage.User.lastname
                };
                console.log(nwData);
                wrkOrdService.nWoStaff().save(nwData, function(res) {
                    if ((res.code = 200)) {
                        localStorage.setItem("service_id", res.details._id);

                        //if video file path exists, execute upload video
                        if ($scope.videoFilePath) {
                            //Upload Video
                            var headers = {
                                //set property and service ID in header
                                // so we can form the path in the backend to upload the file
                                propertyid: $localStorage.User.property_id,
                                serviceid: res.details._id
                            };

                            var videoOptions = {
                                fileName: $scope.videoFilePath.substr(
                                    $scope.videoFilePath.lastIndexOf("/") + 1
                                ),
                                headers: headers,
                                chunkedMode: true,
                                mimeType: "video/" +
                                    $scope.videoFilePath.substr(
                                        $scope.videoFilePath.lastIndexOf(".") + 1
                                    )
                            };

                            console.log("Video filename is:", videoOptions.fileName);
                            console.log("Video file type is:", videoOptions.mimeType);
                            $cordovaFileTransfer
                                .upload(
                                    $localStorage.baseURL + "/upload_files",
                                    $scope.videoFilePath,
                                    videoOptions
                                )
                                //Uploading video here
                                // uploadService.upload($cordovaFileTransfer,$scope.videoFilePath, videoOptions)
                                .then(
                                    function(result) {
                                        $ionicLoading.hide();
                                        $scope.alertPop(
                                            "Alert",
                                            res.message,
                                            "woDetailspgStaffView"
                                        );
                                    },
                                    function(err) {
                                        $ionicLoading.hide();
                                        $scope.alertPop(
                                            "Alert",
                                            "We had trouble uploading video but workorder was " +
                                            "created successfully",
                                            "woDetailspgStaffView"
                                        );
                                    }
                                );
                        } else {
                            $ionicLoading.hide();
                            $scope.alertPop("Alert", res.message, "woDetailspgStaffView");
                        }
                    }
                });
            });
        } else {
            $scope.logout();
        }
    };

    $scope.clearnw = function() {
        $scope.datanew = {};
    };

    $scope.getScrollPosition = function() {
        $scope.GuestNameObject = $scope.GuestNameObject;
        $scope.$apply();
        //console.log($ionicScrollDelegate.getScrollPosition().top);
    };

    $scope.GuestNameObject = {};

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

        //if platform is android then  accessing permission
        var isAndroid = ionic.Platform.isAndroid();
        if (isAndroid) {
            var permissions = cordova.plugins.permissions;
            permissions.hasPermission(
                permissions.CAMERA,
                checkPermissionCallback,
                null
            );

            function checkPermissionCallback(status) {
                console.log("status", JSON.stringify(status));
                if (!status.hasPermission) {
                    var errorCallback = function() {
                        console.warn("Camera permission is not turned on");
                    };
                    permissions.requestPermission(
                        permissions.CAMERA,
                        function(status) {
                            if (!status.hasPermission) {
                                errorCallback();
                            } else {
                                $cordovaCamera.getPicture(options).then(
                                    function(imageData) {
                                        $scope.GuestNameObject[
                                                localStorage.getItem("kvalue") +
                                                localStorage.getItem("kvalue")
                                            ] =
                                            "data:image/jpeg;base64," + imageData;
                                        console.log(
                                            $scope.GuestNameObject[
                                                localStorage.getItem("kvalue") +
                                                localStorage.getItem("kvalue")
                                            ]
                                        );
                                        localStorage.setItem(
                                            "kvalue",
                                            localStorage.getItem("kvalue") +
                                            localStorage.getItem("kvalue")
                                        );
                                        $ionicScrollDelegate.scrollBottom(true);
                                    },
                                    function(err) {}
                                );
                            }
                        },
                        errorCallback
                    );
                } else {
                    $cordovaCamera.getPicture(options).then(
                        function(imageData) {
                            $scope.GuestNameObject[
                                    localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
                                ] =
                                "data:image/jpeg;base64," + imageData;
                            console.log(
                                $scope.GuestNameObject[
                                    localStorage.getItem("kvalue") +
                                    localStorage.getItem("kvalue")
                                ]
                            );
                            localStorage.setItem(
                                "kvalue",
                                localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
                            );
                            $ionicScrollDelegate.scrollBottom(true);
                        },
                        function(err) {}
                    );
                }
            }
        } else {
            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $scope.GuestNameObject[
                            localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
                        ] =
                        "data:image/jpeg;base64," + imageData;
                    console.log(
                        $scope.GuestNameObject[
                            localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
                        ]
                    );
                    localStorage.setItem(
                        "kvalue",
                        localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
                    );
                    $ionicScrollDelegate.scrollBottom(true);
                },
                function(err) {}
            );
        }
        //if platform is android then  accessing permission ends here
    };

    // Usage
    /*  $scope.convertImgToDataURLviaCanvas = function(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        }
        */

    // $scope.getselect = function() {
    //   //var results = ['/img/logo2.png','/img/logo.png'];
    //   var option = {
    //     maximumImagesCount: 5,
    //     width: 800,
    //     height: 800,
    //     quality: 80
    //   };
    //   $cordovaImagePicker.getPictures(option).then(
    //     function(results) {
    //       for (var i = 0; i < results.length; i++) {
    //         $ionicLoading.show();
    //         var img = new Image();
    //         img.crossOrigin = "Anonymous";
    //         img.onload = function() {
    //           var canvas = document.createElement("CANVAS");
    //           var ctx = canvas.getContext("2d");
    //           var dataURL;
    //           canvas.height = this.height;
    //           canvas.width = this.width;
    //           ctx.drawImage(this, 0, 0);
    //           dataURL = canvas.toDataURL("image/jpeg");
    //           $scope.GuestNameObject[
    //             localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
    //           ] = dataURL;
    //           console.log(
    //             $scope.GuestNameObject[
    //               localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
    //             ]
    //           );
    //           localStorage.setItem(
    //             "kvalue",
    //             localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
    //           );
    //           console.log($scope.GuestNameObject);
    //           $ionicScrollDelegate.scrollBottom(true);
    //           $ionicLoading.hide();
    //         };
    //         img.src = results[i];
    //         // }
    //       }
    //     },
    //     function(error) {
    //       $ionicLoading.hide();
    //     }
    //   );
    // };


    $scope.getselect = function() {
        //var results = ['/img/logo2.png','/img/logo.png'];
        $scope.GuestNameObject = [];
        var option = {
            maximumImagesCount: 5,
            width: 800,
            height: 800,
            quality: 80
        };
        $cordovaImagePicker.getPictures(option).then(function(results) {
            console.log("length", results.length);
            console.log(results);
            $ionicLoading.show();
            for (var i = 0; i < results.length; i++) {
                if ((i % 2) === 0) {
                    var img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = function() {
                      console.log("onload");
                        var canvas = document.createElement('CANVAS');
                        var ctx = canvas.getContext('2d');
                        var dataURL;
                        canvas.height = this.height;
                        canvas.width = this.width;
                        ctx.drawImage(this, 0, 0);
                        dataURL = canvas.toDataURL('image/jpeg');
                        $scope.GuestNameObject.push(dataURL);
                        $ionicScrollDelegate.scrollBottom(true);
                        $ionicLoading.hide();
                    }
                    img.src = results[i];
                }
            }

        }, function(error) {});
    };

    //Capture Video
    var videoFilePath = "";
    $scope.getvideo = function() {
        var options = {
            // number of video clips allowed
            limit: 1,
            //max duration (secs)
            duration: 10
        };

        var confirmPopup = $ionicPopup.confirm({
            title: "Info",
            template: "You can record a video upto 10 secs long",
            cssClass: "my-custom-popup-staff"
        });
        confirmPopup.then(function(res) {
            if (res == true) {
                $cordovaCapture.captureVideo(options).then(
                    function(videoData) {
                        $scope.videoFilePath = videoData[0].fullPath;
                        //Create thumbnail image to display
                        var name = $scope.videoFilePath.slice(0, -4) + ".jpeg";
                        var options = { mode: "base64" }; //specify option to create base64 image string instead of image path
                        $window.PKVideoThumbnail
                            .createThumbnail($scope.videoFilePath, name, options)
                            .then(
                                function(result) {
                                    $scope.videoClipImg = "data:image/jpeg;base64," + result; //base64 image created
                                    $scope.$apply();
                                    $ionicScrollDelegate.scrollBottom(true);
                                },
                                function(err) {
                                    console.log("Error", err);
                                }
                            );
                    },
                    function(err) {
                        var confirmPopup = $ionicPopup.confirm({
                            title: "Alert",
                            template: "Sorry, we're having trouble capturing video at this time",
                            cssClass: "my-custom-popup-staff"
                        });
                        confirmPopup.then(function(res) {
                            if (res == true) {
                                $ionicScrollDelegate.scrollBottom(true);
                            }
                        });
                    }
                );
            }
        });
    };

    $scope.removeVideoClip = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: "Alert",
            template: "Are you sure you want to delete this video?",
            cssClass: "my-custom-popup-staff"
        });
        confirmPopup.then(function(res) {
            if (res == true) {
                delete $scope.videoClipImg;
                delete $scope.videoFilePath;
                $ionicScrollDelegate.scrollBottom(true);
            }
        });
    };

    $scope.removeImg = function(deleteImg) {
        var imgkeys = Object.keys($scope.GuestNameObject);
        console.log(imgkeys);
        var key = null;
        for (var i = 0; i < imgkeys.length; i++) {
            if ($scope.GuestNameObject[imgkeys[i]] == deleteImg) {
                key = imgkeys[i];
                var confirmPopup = $ionicPopup.confirm({
                    title: "Alert",
                    template: "Are you sure you want to delete this image?",
                    cssClass: "my-custom-popup-resi"
                });
                confirmPopup.then(function(res) {
                    if (res == true) {
                        console.log(key);
                        delete $scope.GuestNameObject[key];
                        $ionicScrollDelegate.scrollBottom(true);
                    }
                });
            }
        }
    };

    $scope.openImageZoom1 = function(images, index) {
        $scope.activeImageSlide = index;
        $ionicModal
            .fromTemplateUrl("templates/openGalleryImage.html", {
                scope: $scope,
                animation: "slide-in-up"
            })
            .then(function(modal) {
                $scope.attachmentModal1 = modal;
                $scope.previewImages = [];
                $scope.previewImages = images;
                $scope.attachmentModal1.show();
            });
    };
    $scope.closeGaleryModal = function() {
        $scope.attachmentModal1.hide();
    };

// =============================================================================
// Footer Section and Keyboard Behavior Begin
// =============================================================================

    var keyboardHeight = 0;
    window.addEventListener("native.keyboardshow", keyboardShowHandler);
    window.addEventListener("native.keyboardhide", keyboardHideHandler);
  
    function keyboardShowHandler(e) {
      keyboardHeight = e.keyboardHeight;
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
  
    function keyboardHideHandler(e) {
      keyboardHeight = 0;
      $timeout(function() {
        cordova.plugins.Keyboard.close();
      }, 0);
    }
  
    // I emit this event from the monospaced.elastic directive, read line 480
    // For iOS you will need to add the keyboardHeight to the scroller.style.bottom
    $scope.$on("taResize", function(e, ta) {
      if (!ta) return;
      var taHeight = ta[0].offsetHeight;
      if (!footerBar) return;
      var newFooterHeight = taHeight + 10;
      newFooterHeight = newFooterHeight > 44 ? newFooterHeight : 44;
      footerBar.style.height = newFooterHeight + "px";
      if (ionic.Platform.platform() == "ios") {
        scroller.style.bottom = newFooterHeight + keyboardHeight + "px";
      } else {
        scroller.style.bottom = newFooterHeight + "px";
      }
      $ionicScrollDelegate.scrollBottom(true);
    });
  
   
// =============================================================================
// Footer Section and Keyboard Behavior Ends
// =============================================================================


});
