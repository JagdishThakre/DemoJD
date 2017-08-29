app.controller('staffnotificationThrdCtrl', function($scope, reservationStaffServices, $rootScope, $ionicSlideBoxDelegate, $cordovaImagePicker, notificationStaffList, $ionicScrollDelegate, $timeout, $state, $cordovaDevice, $ionicModal, $ionicActionSheet, $ionicPopup, CONFIG, $cordovaCamera, $ionicPopup, $localStorage, $ionicHistory, getThread, $ionicLoading, replymessage, wrkOrdService, globalShareService) {
    console.log('staffnotificationThrdCtrl')
    $scope.commentimg = { 'caption': '' };
    $scope.host_url = $localStorage.baseURL;
    console.log(' $scope.host_url', $scope.host_url);
    $scope.editComment = { text: '', id: '', oldText: '' };
    $scope.activeUser = $localStorage.User.user_id;
    $scope.editComment = { text: '', id: '', oldText: '' };
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

    //Function name : editComment
    //Use: This Function is to open the edit comment box
    $scope.editComment = function(id, text) {
        $ionicModal.fromTemplateUrl('templates/Staff/newsfeed/editComment.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.commentModal = modal;
            $scope.editComment.text = text;
            $scope.editComment.id = id;
            $scope.editComment.oldText = text;
            $scope.commentModal.show();
        });
    }

    $scope.closeEditModal = function() {
        $scope.commentModal.hide();
        $scope.commentModal = '';
    };
    //Function name : sendEditComment
    //Use: This Function is update the edited comment
    $scope.sendEditComment = function(text, id, oldText) {
            $scope.closeEditModal();
            var comment_data = {
                "service_id": $scope.notifythread._id,
                "comment": text,
                "service_comments_id": id,
                "users_id": $localStorage.User.user_id,
                "token": $localStorage.User.token,
            }
            if (oldText != text) {
                $ionicLoading.show();
                replymessage.editComment().save(comment_data, function(res) {
                    if (res.code == 200) {
                        $ionicLoading.hide();
                        angular.forEach($scope.threadData, function(item, key) {
                            if (id == item._id) {
                                item.message = text;
                            }
                        });
                    } else if (res.code == 401) {

                    } else if (res.code == 201) {

                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                });
            }
        }
        //Function name : deleteComment
        //Use: This Function is use to delete a particular comment
    $scope.deleteComment = function(id) {
        $ionicPopup.confirm({
            title: 'Alert',
            template: 'Are you sure you want to delete this comment ?',
            cssClass: 'my-custom-popup-staff'
        }).then(function(res) {
            if (res == true) {
                $ionicLoading.show();
                var comment_data = {
                    "service_id": $scope.notifythread._id,
                    "service_comments_id": id,
                    "users_id": $localStorage.User.user_id,
                    "token": $localStorage.User.token,
                }
                replymessage.deleteComment().save(comment_data, function(res) {
                    if (res.code == 200) {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', res.message);
                        var index;
                        angular.forEach($scope.threadData, function(item, key) {
                            if (id == item._id) {
                                index = key;
                            }
                        });
                        $scope.threadData.splice(index, 1);
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                });
            }
        });
    }



    $scope.openAttachment = function() {
        $ionicModal.fromTemplateUrl('templates/Staff/newsfeed/openAttachment.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.attachmentModal = modal;
            $scope.attachmentModal.show();
        });
    }
    $scope.closeAttachmentModal = function() {
        $scope.attachmentModal.hide();
        $scope.attachmentModal = '';
    };
    $scope.openCommentCamera = function() {
        $scope.commentImages = [];
        var options = {
            quality: 75,
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
                if (!status.hasPermission) {
                    var errorCallback = function() {
                        console.warn('Camera permission is not turned on');
                    }
                    permissions.requestPermission(
                        permissions.CAMERA,
                        function(status) {
                            if (!status.hasPermission) {
                                errorCallback();
                            } else {
                                $cordovaCamera.getPicture(options).then(function(imageData) {
                                    $scope.commentImages.push("data:image/jpeg;base64," + imageData);
                                    $scope.sendcommentImages();
                                }, function(err) {
                                    console.log("error", err)
                                });
                            }
                        },
                        errorCallback);
                } else {
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        $scope.commentImages.push("data:image/jpeg;base64," + imageData);
                        $scope.sendcommentImages();
                    }, function(err) {
                        console.log("error", err)
                    });

                }
            }

        } else {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.commentImages.push("data:image/jpeg;base64," + imageData);
                $scope.sendcommentImages();
            }, function(err) {
                console.log("error", err)
            });
        }
        //if android version is morethan 6  or equal then  accessing permission ends here
    }

    $scope.openCommentGallery = function() {
        $scope.commentImages = [];
        var option = {
            maximumImagesCount: 4,
            width: 800,
            height: 800,
            quality: 80
        };
        var count = 0;
        $cordovaImagePicker.getPictures(option).then(function(results) {
            for (var i = 0; i < results.length; i++) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function() {
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    var dataURL;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    dataURL = canvas.toDataURL('image/jpeg');
                    $scope.commentImages.push(dataURL);
                    count++;
                    if (i == count) {
                        $scope.sendcommentImages();
                        count = 0;
                    }
                }
                img.src = results[i];
            }

        }, function(error) {});
    }
    $scope.sendcommentImages = function() {
        $scope.closeAttachmentModal();
        $ionicModal.fromTemplateUrl('templates/commentGallery.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.commentGallery = modal;
            $scope.commentGallery.show();
        });
    }
    $scope.replaycommentImages = function() {
        $ionicPopup.confirm({
            title: 'Alert',
            template: 'Are you sure you want to send this message ?',
            cssClass: 'my-custom-popup-staff'
        }).then(function(res) {
            if (res == true) {
                $scope.closecommentGallery();
                $ionicLoading.show();
                var replydata = {
                    "service_id": $scope.notifythread._id,
                    "message": $scope.commentimg.caption,
                    "users_id": $localStorage.User.user_id,
                    "token": $localStorage.User.token,
                    "device_info": $scope.ConstantsInfo(),
                    "images": $scope.commentImages,
                    "user_type_id": $localStorage.User.user_type_id,
                    "property_id": $localStorage.User.property_id,
                    "services_category_id": localStorage.getItem("services_cat_id"),
                    "units_id": localStorage.getItem('partThrdUntId'),
                    "firstname": $localStorage.User.firstname,
                    "lastname": $localStorage.User.lastname
                }
                if ($scope.isOnline() == true) {
                    replymessage.replymessage().save(replydata, function(res) {
                        $ionicLoading.hide();
                        var sendObj = {};
                        sendObj.text = $scope.commentimg.caption;
                        sendObj.sendingDate = Date.now();
                        sendObj.images = $scope.commentImages;
                        $scope.sentText.push(sendObj);
                        $scope.staffName = $localStorage.User.firstname;
                        $scope.prflImg = $localStorage.User.profile_img;
                        $scope.bgColor = $localStorage.User.colour;
                        $scope.user_type_id = $localStorage.User.user_type_id;
                        $scope.staff = true;
                        $scope.resident = false;
                        $scope.commentimg = { 'caption': '' };
                        $ionicScrollDelegate.scrollBottom(true);
                        $timeout(function() {
                            $ionicScrollDelegate.scrollBottom(true);
                        }, 300);
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    })
                } else {
                    $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
                }
            } else {
                $scope.commentimg = { 'caption': '' };
                $ionicScrollDelegate.scrollBottom(true);
                $timeout(function() {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 300);
            }
        });
    }
    $scope.closecommentGallery = function() {
        $scope.commentGallery.hide();
        $scope.commentGallery = '';
    }
    $scope.closeGaleryModal = function() {
        $scope.attachmentModal1.hide();
    }
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
    }
    $scope.openImageZoom = function(images, index) {
        $scope.previewImages = [];
        angular.forEach(images, function(item) {
            $scope.previewImages.push($scope.host_url + '/' + item.url);
        });
        $scope.activeImageSlide = index;
        $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.attachmentModal1 = modal;
            $scope.attachmentModal1.show();
        });
    }
    $scope.openimage = function(index) {
        $scope.previewImages = [];
        angular.forEach($scope.notifythread.images, function(item) {
            $scope.previewImages.push(item.url);
        });
        if ($scope.packimg) {
            $scope.previewImages.push($scope.packimg);

        }
        $scope.activeImageSlide = index;
        $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.attachmentModal1 = modal;
            $scope.attachmentModal1.show();
        });
    }



    //**********************************************8************************************
    //******************************Footer start******************************************
    //************************************************************************************
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    $scope.$on('$ionicView.enter', function() {
        $timeout(function() {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            scroller = document.body.querySelector('#userMessagesView .scroll-content');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);
    });
    var keyboardHeight = 0;
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardShowHandler(e) {
        keyboardHeight = e.keyboardHeight;
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }

    function keyboardHideHandler(e) {
        keyboardHeight = 0;
        $timeout(function() {
            cordova.plugins.Keyboard.close()
        }, 0);
    }

    // I emit this event from the monospaced.elastic directive, read line 480
    // For iOS you will need to add the keyboardHeight to the scroller.style.bottom
    $scope.$on('taResize', function(e, ta) {
        if (!ta) return;
        var taHeight = ta[0].offsetHeight;
        if (!footerBar) return;
        var newFooterHeight = taHeight + 10;
        newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
        footerBar.style.height = newFooterHeight + 'px';
        if (ionic.Platform.platform() == 'ios') {

            scroller.style.bottom = newFooterHeight + keyboardHeight + 'px';
            //  alert(scroller.style.bottom);
        } else {
            scroller.style.bottom = newFooterHeight + 'px';
        }
        $ionicScrollDelegate.scrollBottom(true);
    });

    ///**********************************************8************************************
    //******************************Footer end******************************************
    //************************************************************************************

    $ionicScrollDelegate.scrollBottom(true);
    window.addEventListener("orientationchange", function() {
        $ionicScrollDelegate.scrollBottom(true);
    }, false);

    $scope.slug = localStorage.getItem('notifySpecific');

    $scope.imageSrc = '';
    $scope.openModal = function(img) {
        $scope.previewImages = [];
        $scope.previewImages.push($scope.host_url + '/' + img);
        $scope.activeImageSlide = 0;
        $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.attachmentModal1 = modal;
            $scope.attachmentModal1.show();
        });
    };

    $scope.doRefresh = function() {
        callthread();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal = '';
    };
    $scope.replyObj = {};
    $scope.staffName = $localStorage.User.firstname;
    $scope.bgColor = $localStorage.User.colour;
    $scope.user_type_id = $localStorage.User.user_type_id;
    $scope.sentText = new Array();
    $scope.retrievedText = new Array();
    $scope.retrievedDate = new Array();
    $scope.residentName = [];
    $scope.residentLastName = [];
    $scope.retrievedId = [];
    $scope.residentImg = [];
    $scope.staff_id = $localStorage.User.user_type_id;
    $scope.sentDate = new Array();
    $scope.srcImages = [];
    //$scope.replytext = '';
    $scope.residentSign = [];

    $scope.callthread = function() {

        var threadData = {
                "token": $localStorage.User.token,
                "service_id": localStorage.getItem("service_id"),
                "make_true": localStorage.getItem('makeTrue'),
                "property_id": $localStorage.User.property_id,
                "users_id": $localStorage.User.user_id
            }

        if ($scope.isOnline() == true) {
            $ionicLoading.show();
            getThread.thread().save(threadData, function(res) {
                console.log("thread res", res)
                $ionicScrollDelegate.scrollBottom(true);
                $ionicLoading.hide();
                //console.log("hello", res);
                $scope.notifythread = res.service_data;
                if (res.service_data.package_images) {
                    $scope.packimg = $scope.host_url + '/' + res.service_data.package_images;

                }

                $scope.taskdata = res.task_data;
                localStorage.setItem('partThrdUntId', res.service_data.units_id._id);
                localStorage.setItem('partThrdUntNum', res.service_data.units_id.unit_number);
                if (res.service_data.amount_paid >= 0) {
                    $scope.notifythread.amount_due = res.service_data.total_price - res.service_data.amount_paid;
                } else {
                    $scope.closeWoData.amount_due = res.service_data.total_price;
                }
                localStorage.setItem("services_cat_id", res.service_data.services_category_id._id);
                $scope.threadData = res.thread_data;
                var tempCtn = 0;
                angular.forEach($scope.threadData, function(item) {
                    //console.log("threadData Item: ",item);
                    if (item.resident_signature) {
                        console.log("Signature");
                        tempCtn += 1;
                    } else {
                        console.log("!Signature");
                    }
                });

                $scope.showSignBtn = false;
                if (tempCtn >= 1 && $scope.slug == 'pckg') {
                    $scope.showSignBtn = false;
                } else if (tempCtn == 0 && $scope.slug == 'pckg') {
                    $scope.showSignBtn = true;
                }
                console.log("tempCtn: ", tempCtn, $scope.showSignBtn);
                console.log("$scope.threadData", $scope.threadData);
                $scope.taskdata = res.task_data;
                if (res.service_data.services_category_id.name == "Reservations") {
                    $scope.stafnotiHead = 'Reservation Details';
                    console.log($scope.stafnotiHead);
                } else {
                    $scope.stafnotiHead = 'Service Details';
                }
                //$scope.serviceCreatedDate = moment(res.service_data.created).format("hh:mm A [on] MMM Do, YYYY");
                $scope.serviceCreatedDate = moment(res.service_data.created).format("ddd, MMM Do, YYYY [at] hh:mm A");

                var timefromtz = moment($scope.notifythread.timefrom).tz(localStorage.getItem('timezone'));
                $scope.timeFromFormatted = timefromtz.format('MMM Do, YYYY');
                $scope.timefromCal = timefromtz.format("hh:mm A");
                var timeTotz = moment($scope.notifythread.timeto).tz(localStorage.getItem('timezone'));
                $scope.timetoCal = timeTotz.add(1, 'minutes').format("hh:mm A");
                //$scope.timetoCal = moment($scope.notifythread.timeto).add(1, 'minutes').format("hh:mm A");

                angular.forEach($scope.notifythread.images, function(item) {
                    item.url = $scope.host_url + '/' + item.url;
                });
                angular.forEach($scope.threadData, function(item) {
                    var date = moment(item.created).format("MMM Do, YYYY");
                    item.createdDate = date;
                });
                //console.log($scope.residentImg,1234);
                $ionicLoading.hide();
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                $scope.$broadcast('scroll.refreshComplete');
            })
        } else {
            $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
        }
    };
    /*******************WorkorderDetailsPage********************************/

    $scope.workOrderDetails = function() {
        var workOrderDetailData = {
            "token": $localStorage.User.token,
            "service_id": localStorage.getItem("service_id"),
            "make_true": localStorage.getItem('makeTrue'),
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id
        }
        console.log("workOrderDetailData123", workOrderDetailData)
        $ionicLoading.show();
        if ($scope.isOnline() == true) {
            getThread.woThreadData().save(workOrderDetailData, function(res) {
                console.log("WODetail res", res);
                $ionicLoading.hide();
                $scope.services_category_id = res.service_data.services_category_id;
                //$scope.serviceCreatedDate = moment(res.service_data.created).format("hh:mm A [on] MMM Do, YYYY");
                $scope.serviceCreatedDate = moment(res.service_data.created).format("ddd, MMM Do, YYYY [at] hh:mm A");
                $scope.notifythread = res.service_data;
                $scope.amount = (res.service_data.estimation.length > 0) ? res.service_data.estimation[0].cost : 0;
                $scope.taskdata = res.task_data;
                angular.forEach($scope.taskdata, function(status) {
                    // if(status.is_completed==false){
                    //     console.log("status.is_closed",status.is_closed)
                    //     $scope.allTaskIsclosed=false;
                    //     return  $scope.allTaskIsclosed

                    // }
                    if (status.is_closed == false) {
                        console.log("status.is_closed", status.is_closed)
                        $scope.allTaskIsclosed = false;
                        return $scope.allTaskIsclosed

                    }

                })
                console.log($scope.notifythread);
                if ($scope.notifythread.Started_Date) { $scope.Started_Date = moment($scope.notifythread.Started_Date).format("ddd, MMM Do, YYYY [at] hh:mm A"); }
                if ($scope.notifythread.service_close_date) { $scope.service_close_date = moment($scope.notifythread.service_close_date).format("ddd, MMM Do, YYYY [at] hh:mm A"); }
                if ($scope.notifythread.Re_Opened_Date) { $scope.Re_Opened_Date = moment($scope.notifythread.Re_Opened_Date).format("ddd, MMM Do, YYYY [at] hh:mm A"); }
                $scope.threadData = res.thread_data;
                angular.forEach($scope.notifythread.images, function(item) {
                    item.url = $scope.host_url + '/' + item.url;
                });
                angular.forEach($scope.threadData, function(item) {
                    var date = moment(item.created).format("MMM Do, YYYY");
                    item.createdDate = date;
                });

                //Service Rating Begin
                $scope.ratingArr = [{
                    value: 1,
                    icon: 'ion-ios-star-outline'
                }, {
                    value: 2,
                    icon: 'ion-ios-star-outline'
                }, {
                    value: 3,
                    icon: 'ion-ios-star-outline'
                }, {
                    value: 4,
                    icon: 'ion-ios-star-outline'
                }, {
                    value: 5,
                    icon: 'ion-ios-star-outline'
                }];

                if ($scope.notifythread.rating) {
                    var rating = parseInt($scope.notifythread.rating);
                    var rtgs = $scope.ratingArr;
                    for (var i = 0; i < rating; i++) {
                        if (i < rating) {
                            rtgs[i].icon = 'ion-ios-star';
                        } else {
                            rtgs[i].icon = 'ion-ios-star-outline';
                        }
                    };
                }
                //Service Rating End
                $ionicLoading.hide();
                $ionicScrollDelegate.scrollBottom(true);
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                $scope.$broadcast('scroll.refreshComplete');
            })
        } else {
            $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
        }
    }

    /************Mark Return start********/
    $scope.markedReturn = function(bookDetails) {
            $ionicLoading.show();
            console.log(bookDetails);
            var markedItem = {
                "item_id": bookDetails.item_id._id,
                "service_id": bookDetails._id,
                "user_id": $localStorage.User.user_id,
                "token": $localStorage.User.token
            }
            reservationStaffServices.markedReturn().save(markedItem, function(res) {
                $ionicLoading.hide();
                console.log(res);
                if (res.code == 200) {
                    $ionicLoading.hide();
                    $scope.alertPop('Alert', res.message, 'staffrvstStartpg');
                }
                if (res.code == 401) {
                    $ionicLoading.hide();
                    $scope.alertPop('Alert', res.message, 'staffrvstStartpg');
                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            })
        }
        /********Mark Return Ends*********/


    $scope.notifyResident = function(bookDetails) {
        console.log(bookDetails)
        $ionicLoading.show();
        var notifyResi = {
            "item_id": bookDetails.item_id._id,
            "service_id": bookDetails._id,
            "item_name": bookDetails.item_id.name
        }
        reservationStaffServices.notifyResiReturnItem().save(notifyResi, function(res) {
            $ionicLoading.hide();
            console.log(res);
            if (res.code == 200) {
                $ionicLoading.hide();
                $scope.alertPop('Alert', res.message);
            }
            if (res.code == 401) {
                $scope.alertPop('Alert', res.message);
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        })
    }



    /*******************WorkorderDetailsPage Function Ends********************************/

    $scope.goback = function() {
        $ionicHistory.goBack(-1);
    }
    $scope.goSignature = function() {
        localStorage.setItem("is_Signed", false);
        $state.go('signature');
    }

    $scope.reply = function(text, index) {
        $ionicLoading.show();
        var replydata = {
            "service_id": $scope.notifythread._id,
            "message": text,
            "users_id": $localStorage.User.user_id,
            "token": $localStorage.User.token,
            "device_info": $scope.ConstantsInfo(),
            "images": [],
            "user_type_id": $localStorage.User.user_type_id,
            "property_id": $localStorage.User.property_id,
            "services_category_id": localStorage.getItem("services_cat_id"),
            "units_id": $scope.notifythread.units_id._id,
            "firstname": $localStorage.User.firstname,
            "lastname": $localStorage.User.lastname
        }
        console.log(replydata, "123");
        if ($scope.isOnline() == true) {
            replymessage.replymessage().save(replydata, function(res) {
                $ionicLoading.hide();
                angular.forEach(notificationStaffList.msgList, function(item) {
                    var count = 0;
                    if ($scope.notifythread._id == item._id) {
                        item.message = text;
                    }
                });
                angular.forEach(notificationStaffList.msgAllList, function(item) {
                    var count = 0;
                    if ($scope.notifythread._id == item._id) {
                        console.log($scope.notifythread._id);
                        item.message = text;
                    }
                });
                console.log(res);
                $ionicLoading.hide();
                var sendObj = {};
                sendObj.text = $scope.replyObj.replytext;
                sendObj.sendingDate = Date.now();
                sendObj.images = [];
                $scope.sentText.push(sendObj);
                $scope.staffName = $localStorage.User.firstname;
                $scope.staffLastName = $localStorage.User.lastname;
                $scope.prflImg = $localStorage.User.profile_img;
                $scope.bgColor = $localStorage.User.color;
                $scope.user_type_id = $localStorage.User.user_type_id;
                $scope.staff = true;
                $scope.resident = false;
                $scope.replyObj.replytext = '';
                $ionicScrollDelegate.scrollBottom(true);
                $timeout(function() {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 300);
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {

            $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
        }
        $ionicScrollDelegate.scrollBottom(true);
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);
    }
    $scope.startWoStaff = function() {
        $rootScope.showing = true;
        $scope.closeWoPop = $ionicPopup.confirm({
            title: 'Confirm',
            cssClass: 'WoMngrPopHead',
            template: 'Are you sure you want to Start this Work Order?'
        });
        $scope.closeWoPop.then(function(res) {
            if (res) {
                $ionicLoading.show();
                var startWoData = {
                    "service_id": $scope.notifythread._id,
                    "user_type_id": $localStorage.User.user_type_id,
                    "firstname": $localStorage.User.firstname,
                    "lastname": $localStorage.User.lastname,
                    "users_id": $localStorage.User.user_id
                }
                console.log("startWoData", startWoData)
                wrkOrdService.startWo().save(startWoData, function(res) {
                    console.log("startWores", res)
                    $ionicLoading.hide();
                    if (res.code == 200) {
                        $scope.workOrderDetails();
                        $timeout(function() {
                            $scope.alertPop('Alert', res.message);
                        }, 500);
                    } else if (res.code == 501) {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', res.message);
                        $scope.workOrderDetails();
                    } else {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', "Something went wrong");
                    }
                })
            } else {
                console.log('You are not sure');
            }
        });
    }



    $scope.closeWoData = {};

    $scope.closeWoStaff = function(WoStaus, data, isEdit) {
        $rootScope.showing = true;
        var closure_type = 'add';
        if (isEdit == true) {
            closure_type = 'edit';
        }
        console.log("*******", WoStaus);
        var popupTitle = 'Payment Details';
        if (WoStaus == false) {
            $scope.alertPop('Alert', "There are open tasks in this workorder, please close them before attempting to close this workorder");

        } else {
            if (WoStaus == undefined && (data.amount_due == undefined)) {
                console.log("Called 0/0");
                $scope.closeWoData = {};
                $scope.closeWoData.amount_paid = 0;
                $scope.closeWoData.amount_due = 0;
                popupTitle = 'Close Workorder';
            } else if (data.amount_paid != undefined) {

                $scope.closeWoData.amount_paid = data.amount_paid;
                $scope.closeWoData.amount_due = data.amount_due;
            }
            /*if (closeData == undefined) {
                //$scope.closeWoData = {};
                var closeData = {}
                $scope.closeWoData.closure_type = "add";
            } else {
                $scope.closeWoData.closure_type="";
                //this part for while edit reports,then send null data
                //$scope.closeWoData.closure_type = null;
            }*/
            $scope.closeWoPop = $ionicPopup.show({
                title: popupTitle,
                // subTitle: 'Stars represend Mantatory',
                templateUrl: 'templates/Staff/workorderManager/closeWorkorder.html',
                scope: $scope,
                cssClass: 'WoMngrPopHead',
                buttons: [
                    { text: 'Cancel' }, {
                        text: 'Save',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.closeWoData.amount_paid || !$scope.closeWoData.amount_due) {
                                console.log("!$scope");
                                //don't allow the user to save unless mandatory  fileds entered
                                //e.preventDefault();
                                return $scope.closeWoData;
                            } else {
                                console.log("$scope");
                                return $scope.closeWoData;
                            }
                        }
                    }
                ]
            });

            $scope.closeWoPop.then(function(res) {
                if (res) {
                    console.log("WO-Stat res: ", res);
                    $ionicLoading.show();
                    if (WoStaus != undefined) {

                        var closeData = {
                            "service_id": $scope.notifythread._id,
                            "property_id": $localStorage.User.property_id,
                            "amount_due": res.amount_due,
                            "closure_note": res.closure_note,
                            "amount_paid": res.amount_paid,
                            "user_type_id": $localStorage.User.user_type_id,
                            "users_id": $localStorage.User.user_id
                        }
                        console.log("Undefine: ", closeData);
                    } else {
                        var closeData = {
                            "service_id": $scope.notifythread._id,
                            "property_id": $localStorage.User.property_id,
                            "amount_due": res.amount_due,
                            "closure_note": res.closure_note,
                            "closure_type": closure_type,
                            "amount_paid": res.amount_paid,
                            "user_type_id": $localStorage.User.user_type_id,
                            "users_id": $localStorage.User.user_id
                        }
                        console.log("Define: ", closeData);
                    }
                    console.log('close WO data!', closeData);
                    wrkOrdService.closeWo().save(closeData, function(res) {
                        $ionicLoading.hide();
                        console.log("closeWores", res)
                        if (res.code == 200) {
                            $scope.workOrderDetails();
                            $timeout(function() {
                                $scope.alertPop('Alert', res.message);
                            }, 500);

                        } else if (res.code == 501) {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', res.message);
                            $scope.workOrderDetails();
                        } else if (res.code == 201) {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', res.message);
                            $scope.workOrderDetails();
                        } else {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', "Something went wrong");
                        }
                    })
                } else {
                    console.log("Data is not received")
                }
            });
        }
    }
    $scope.reOpenWO = function() {
        $scope.closeWoPop = $ionicPopup.confirm({
            title: 'Confirm',
            cssClass: 'WoMngrPopHead',
            template: 'Are you sure you want to Re-Open this work order?'
        });
        $scope.closeWoPop.then(function(res) {
            if (res) {
                $ionicLoading.show();
                var reOpenWoData = {
                    "service_id": $scope.notifythread._id,
                    "user_type_id": $localStorage.User.user_type_id,
                    "firstname": $localStorage.User.firstname,
                    "lastname": $localStorage.User.lastname,
                    "users_id": $localStorage.User.user_id
                }
                console.log('reOpen WO data!', reOpenWoData);
                wrkOrdService.reOpenWO().save(reOpenWoData, function(res) {
                    $ionicLoading.hide();
                    console.log("reOpenWores", res)
                    if (res.code == 200) {
                        $scope.workOrderDetails();
                        $timeout(function() {
                            $scope.alertPop('Alert', res.message);
                        }, 500);
                    } else if (res.code == 501) {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', res.message);
                        $scope.workOrderDetails();
                    } else {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', "Something went wrong");
                    }
                })
            } else {
                console.log("Not sure.");
            }
        });
    }

    $scope.editWoReport = function(data) {
        console.log("edit report data", data)
        $scope.closeWoData.amount_paid = data.amount_paid;
        $scope.closeWoData.amount_due = data.amount_due;
        $scope.closeWoData.closure_note = data.closure_note;
        console.log("Close WO Task Close Status: ", $scope.allTaskIsclosed);
        $scope.closeWoStaff($scope.allTaskIsclosed, $scope.closeWoData, true);
    }
    $scope.goToTaskView = function(notifythread) {
        console.log("notifythread", notifythread)
        if (notifythread.work_order_status == 1 || notifythread.work_order_status == 3) {
            $scope.alertPop('Alert', "Tasks can only be added once Workorder is started");
        } else {
            globalShareService.globalShareVars = {
                "addTaskServiceId": notifythread._id
            };
            $state.go('addTaskByManager')
        }
    }

    $scope.goToTaskMangerDetails = function(taskDetails) {
        console.log(taskDetails);
        localStorage.setItem('taskManagerDetails', taskDetails._id);
        localStorage.setItem('taskPriority', taskDetails.priority);
        localStorage.setItem('service_id', taskDetails.service_id)
        console.log(localStorage.getItem('taskPriority'))
        $state.go('taskManagerDetails');
    }

    /**
     * Name: Abhijit Agrawal
     * Functionality: For Conferming of Reservation by Staff
     * Date: 27-12-2016
     * Start
     **/

    $scope.confirmReservationByStaff = function(data) {
        $rootScope.showing = true;

        console.log("Confirm Called!", data);
        var amtPaid = 0;
        $scope.closeWoData.amount_paid = 0;
        $scope.closeWoData.amount_due = data.amount_due;
        if (data.amount_paid >= 0) {
            $scope.closeWoData.amount_due = data.total_price - data.amount_paid;
            console.log("If, Amount Due: ", $scope.closeWoData.amount_due);
        } else {
            $scope.closeWoData.amount_due = data.total_price;
            console.log("Else, Amount Due: ", $scope.closeWoData.amount_due);
        }
        var popupTitle = 'Reservation Details';
        $scope.closeWoPop = $ionicPopup.show({
            title: popupTitle,
            // subTitle: 'Stars represend Mantatory',
            templateUrl: 'templates/Staff/reservation/confirmReservation.html',
            scope: $scope,
            cssClass: 'WoMngrPopHead',
            buttons: [
                { text: 'Cancel' }, {
                    text: 'Save',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.closeWoData.amount_paid || !$scope.closeWoData.amount_due) {
                            console.log("!$scope");
                            //don't allow the user to save unless mandatory  fileds entered
                            //e.preventDefault();
                            return $scope.closeWoData;
                        } else {
                            console.log("$scope");
                            return $scope.closeWoData;
                        }
                    }
                }
            ]
        });

        $scope.closeWoPop.then(function(res) {
            if (res) {
                console.log("WO-Stat res: ", res);
                $ionicLoading.show();
                var confirmReservationData = {
                    "service_id": data._id,
                    "user_type_id": $localStorage.User.user_type_id,
                    "property_id": data.property_id,
                    "amount_paid": res.amount_paid,
                    "amount_due": res.amount_due,
                    "closure_note": res.closure_note,
                    "timezone": localStorage.getItem('timezone'),
                    "firstname": $localStorage.User.firstname,
                    "lastname": $localStorage.User.lastname,
                    "users_id": $localStorage.User.user_id
                };
                wrkOrdService.confirmReservation().save(confirmReservationData, function(res) {
                    $ionicLoading.hide();
                    console.log("confirmReservation: ", res)
                    if (res.code == 200) {
                        $scope.callthread();
                        $timeout(function() {
                            $scope.alertPop('Alert', res.message);
                        }, 500);
                    } else if (res.code == 501) {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', res.message);
                        $scope.callthread();
                    } else {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', "Something went wrong");
                    }
                });
            } else {
                console.log("Data is not received")
            }
        });
    }

    /* @purpose : handle event on alert
     *  @Creator :yogini 
     *  @created  : 06042017
     */

    $rootScope.$on('child', function(event, data) {
        console.log("child*****", data); // 'Some data'
        console.log("$rootScope.showing", $rootScope.showing);
        if($scope.closeWoPop) {
            $scope.closeWoPop.close();
        }
    });

    /** Functionality: For Conferming of Reservation by Staff. End **/

    /**
     * Name: Abhijit Agrawal
     * Functionality: For Canceling Reservation by Staff
     * Date: 27-12-2016
     * Start
     **/

    $scope.cancelReservationByStaff = function(data) {
        $rootScope.showing = true;
        console.log("Cancel Called!", data);
        $scope.closeWoPop = $ionicPopup.confirm({
            title: 'Alert',
            template: 'Are you sure you want to cancel this reservation ?',
            cssClass: 'my-custom-popup-staff'
        });

        $scope.closeWoPop.then(function(res) {
            if (res == true) {
                $ionicLoading.show();
                var cancelReservationData = {
                    "service_id": data._id,
                    "user_type_id": $localStorage.User.user_type_id,
                    "property_id": data.property_id,
                    "timezone": localStorage.getItem('timezone'),
                    "firstname": $localStorage.User.firstname,
                    "lastname": $localStorage.User.lastname,
                    "users_id": $localStorage.User.user_id
                };
                wrkOrdService.cancleReservation().save(cancelReservationData, function(res) {
                    $ionicLoading.hide();
                    console.log("cancelReservationData: ", res)
                    if (res.code == 200) {
                        $scope.callthread();
                        $timeout(function() {
                            $scope.alertPop('Alert', res.message);
                        }, 500);
                    } else if (res.code == 501) {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', res.message);
                        $scope.callthread();
                    } else {
                        $ionicLoading.hide();
                        $scope.alertPop('Alert', "Something went wrong");
                    }
                });
            } else {
                console.log("Data is not received")
            }
        });
    }

    /** Functionality: For Canceling Reservation by Staff. End **/

    /**
     * Name: Abhijit Agrawal
     * Functionality: For Rejecting Reservation by Staff
     * Date: 27-12-2016
     * Start
     **/

    $scope.rejectReservationByStaff = function(data) {
        $rootScope.showing = true;
        var popupTitle = 'Rejection Details';
        $scope.closeWoPop = $ionicPopup.show({
            title: popupTitle,
            // subTitle: 'Stars represend Mantatory',
            templateUrl: 'templates/Staff/reservation/rejectReservation.html',
            scope: $scope,
            cssClass: 'WoMngrPopHead',
            buttons: [
                { text: 'Cancel' }, {
                    text: 'Save',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.closeWoData.reason) {
                            console.log("!$scope");
                            //don't allow the user to save unless mandatory  fileds entered
                            //e.preventDefault();
                            return $scope.closeWoData;
                        } else {
                            console.log("***************");
                            return $scope.closeWoData;
                        }
                    }
                }
            ]
        });

        $scope.closeWoPop.then(function(res) {
            if (res) {
                console.log("rejectReservationData: ", res);
                $ionicLoading.show();
                var rejectReservationData = {
                    "service_id": data._id,
                    "user_type_id": $localStorage.User.user_type_id,
                    "property_id": data.property_id,
                    "timezone": localStorage.getItem('timezone'),
                    "firstname": $localStorage.User.firstname,
                    "lastname": $localStorage.User.lastname,
                    "users_id": $localStorage.User.user_id,
                    "reason": res.reason
                };
                console.log("rejectReservationData", rejectReservationData);
                if (rejectReservationData.reason) {
                    wrkOrdService.rejectReservation().save(rejectReservationData, function(res) {
                        $ionicLoading.hide();
                        console.log("rejectReservationData: ", res)
                        if (res.code == 200) {
                            $scope.callthread();
                            $timeout(function() {
                                $scope.alertPop('Alert', res.message);
                            }, 500);
                        } else if (res.code == 501) {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', res.message);
                            $scope.callthread();
                        } else {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', "Something went wrong");
                        }
                    });
                } else {
                    $ionicLoading.hide();
                    $scope.alertPop('Alert', "Please enter the reason.");

                }

            } else {
                console.log("Data is not received")
            }
        });
    }

    /** Functionality: For Rejecting Reservation by Staff. End **/

    /**
     * Name: Abhijit Agrawal
     * Functionality: For Edit Conferming of Reservation by Staff
     * Date: 27-12-2016
     * Start
     **/

    $scope.editReservationDetails = function(data, isEdit) {
        console.log("Confirm Called!", data);
        if (data.amount_paid != undefined || isEdit == true) {
            $scope.closeWoData.amount_paid = data.amount_paid;
            if (data.amount_due < 0) {
                $scope.closeWoData.amount_due = 0;
            } else {
                $scope.closeWoData.amount_due = data.amount_due;
            }
            $scope.closeWoData.closure_note = data.closure_note;
            var popupTitle = 'Reservation Details';
            var closeWoPop = $ionicPopup.show({
                title: popupTitle,
                // subTitle: 'Stars represend Mantatory',
                templateUrl: 'templates/Staff/reservation/confirmReservation.html',
                scope: $scope,
                cssClass: 'WoMngrPopHead',
                buttons: [
                    { text: 'Cancel' }, {
                        text: 'Save',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.closeWoData.amount_paid || !$scope.closeWoData.amount_due) {
                                console.log("!$scope");
                                //don't allow the user to save unless mandatory  fileds entered
                                //e.preventDefault();
                                return $scope.closeWoData;
                            } else {
                                console.log("$scope");
                                return $scope.closeWoData;
                            }
                        }
                    }
                ]
            });

            closeWoPop.then(function(res) {
                if (res) {
                    console.log("WO-Stat res: ", res);
                    $ionicLoading.show();
                    var editReservationData = {
                        "_id": data._id,
                        "amount_paid": res.amount_paid,
                        "amount_due": res.amount_due,
                        "closure_note": res.closure_note,
                        "firstname": $localStorage.User.firstname,
                        "lastname": $localStorage.User.lastname,
                        "users_id": $localStorage.User.user_id
                    };
                    console.log("editReservationData: ", editReservationData);
                    wrkOrdService.editReservationDetail().save(editReservationData, function(res) {
                        $ionicLoading.hide();
                        console.log("editReservationDetail: ", res)
                        if (res.code == 200) {
                            $scope.callthread();
                            $timeout(function() {
                                $scope.alertPop('Alert', res.message);
                            }, 500);
                        } else if (res.code == 501) {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', res.message);
                            $scope.callthread();
                        } else {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', "Something went wrong");
                        }
                    });
                } else {
                    console.log("Data is not received")
                }
            });
        } else {
            $scope.alertPop('Alert', "Something went wrong");
        }
    }

    /** Functionality: For Edit Conferming of Reservation by Staff. End **/

})
