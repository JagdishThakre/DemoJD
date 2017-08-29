app.controller('StaffPrflCtrl', function ( $scope, $state, $cordovaNetwork, $rootScope, $ionicPopup, $ionicPopup, CONFIG, $rootScope, $localStorage, $ionicLoading, $ionicHistory, updateProfileService, $cordovaFile, $ionicActionSheet, $cordovaCamera, updateProfileImageService, logoutService, $cordovaDevice ) {
    /* @function : generateAvtarOnimageLoadError()
    *  @Creator  :Shivansh 
    *  @created  : 19012017
    */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function () {
        console.log("on error image called");
        $scope.showErrorImg = true;
    };
    $scope.showNumericKeyboard = false;
    $scope.bgColor = $localStorage.User.color;
    /*******Code Start For Numeric Keypad plugin******/
    $scope.NumericKeypadShow = function ( index, value ) {
        $scope.showNumericKeyboard = index;
    };
    $scope.options = {
        leftControl: 'Cancel',
        rightControl: '<i class="icon ion-close-round"></i></button>',
        onKeyPress: function ( value, source ) {
            if (source === 'RIGHT_CONTROL') {
                $scope.userDetailsProfile.phone_no = $scope.userDetailsProfile.phone_no.substr(0, $scope.userDetailsProfile.phone_no.length - 1);
            } else if (source === 'NUMERIC_KEY') {
                $scope.userDetailsProfile.phone_no += value;
                console.log($scope.userDetailsProfile.phone_no);
            } else if (source === 'LEFT_CONTROL') {
                console.log("I am called");
                $scope.showNumericKeyboard = false;
                $scope.activeNumber = true;
                // $scope.cancelUser();
            }
        }
    };


    /*******Code End For Numeric Keypad plugin******/



    $scope.isEnabled = true;
    $scope.data = {curPwd: '', newPwd: '', confirmPwd: ''};
    $scope.callProfile = function () {
        $scope.userDetailsProfile = {
            "firstname": $localStorage.User.firstname,
            "lastname": $localStorage.User.lastname,
            "phone_no": $localStorage.User.phone_no,
            "emergency_contact": $localStorage.User.emergency_contact,
            "profile_img": $localStorage.User.profile_img,
            "user_type_id": $localStorage.User.user_type_id
        }
    };
    $scope.edit = function ( x ) {

        $scope.isEnabled = false;
        if (x == 'firstname') {
            $scope.activeName = true;
        } else if (x == 'lastname') {
            $scope.activelName = true;
        } else if (x == 'phone_no') {
            $scope.showNumericKeyboard = true;
            $scope.activeNumber = true;
        } else if (x == 'emergency_contact') {
            $scope.activeEmernumber = true;
        } else {
            $scope.activePassword = true;
        }
    };

    $scope.update = function ( userUpdatedData ) {
        $ionicLoading.show({
            template: 'Updating <br><ion-spinner icon="lines"></ion-spinner>'
        });
        var updatedUserDetails = {
            "token": $localStorage.User.token,
            "user_id": $localStorage.User.user_id,
            "firstname": userUpdatedData.firstname,
            "lastname": userUpdatedData.lastname,
            "phone_no": userUpdatedData.phone_no,
            "emergency_contact": userUpdatedData.emergency_contact
        };
        if ($scope.isOnline() == true) {
            updateProfileService.updateData().save(updatedUserDetails, function ( res ) {
                $ionicLoading.hide();
                if (res.code == 200) {
                    $scope.alertPopResi('Alert', res.message);
                    $localStorage.User.firstname = userUpdatedData.firstname;
                    $localStorage.User.lastname = userUpdatedData.lastname;
                    $localStorage.User.phone_no = userUpdatedData.phone_no;
                    $localStorage.User.emergency_contact = userUpdatedData.emergency_contact;

                } else {
                    $scope.alertPopResi('Alert', res.message);
                }
            }, function ( err ) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else {
            $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);

        }
        $scope.activeName = false;
        $scope.activelName = false;
        $scope.activeNumber = false;
        $scope.activeEmernumber = false;
        $scope.activePassword = false;
    };

    $scope.goback = function () {
        // $ionicHistory.nextViewOptions({
        //   disableAnimate: true,
        // });
        $ionicHistory.goBack(-1);
    };

    $scope.cancelUser = function () {
        console.log($localStorage.User);
        $scope.activeName = false;
        $scope.activelName = false;
        $scope.activeNumber = false;
        $scope.activeEmernumber = false;
        $scope.activePassword = false;
        $scope.isEnabled = true;
        $scope.userDetailsProfile = {
            "firstname": $localStorage.User.firstname,
            "lastname": $localStorage.User.lastname,
            "phone_no": $localStorage.User.phone_no,
            "emergency_contact": $localStorage.User.emergency_contact,
            "profile_img": $localStorage.User.profile_img
        }

    };

    $scope.editphoto = function () {
        $scope.hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<center><i class="icon ion-camera" ng-click="takeImage()"></i> <div class="custom-action-sheet">Take photo</div></center>'
            }, {
                text: '<center><i class="icon ion-share" ng-click="takeImagefromlib()"></i> <div class="custom-action-sheet">Photo from library</div></center>'
            }],
            buttonClicked: function ( index ) {
                var options = {
                    quality: 80,
                    destinationType: Camera.DestinationType.DATA_URL,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 250,
                    targetHeight: 250,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
                switch (index) {
                    case 0:
                        options['sourceType'] = Camera.PictureSourceType.CAMERA;
                        break;
                    case 1:
                        options['sourceType'] = Camera.PictureSourceType.PHOTOLIBRARY;
                        break;
                    default:

                        options['sourceType'] = Camera.PictureSourceType.PHOTOLIBRARY;
                        break;
                }
                $cordovaCamera.getPicture(options).then(function ( imageData ) {
                    $scope.srcImage = "data:image/jpeg;base64," + imageData;
                    updateduUserImage = {
                        "token": $localStorage.User.token,
                        "user_id": $localStorage.User.user_id,
                        "imagedata": $scope.srcImage
                    };
                    updateProfileImageService.updateImage().save(updateduUserImage, function ( res ) {
                        if (res.code == 200) {
                            $scope.alertPopResi('Alert', res.message);
                            // alert("from update service"+ localStorage.User);

                            var profile_img = res.path;
                            $localStorage.User.profile_img = profile_img;
                        } else {
                            $scope.alertPopResi('Alert', res.message);
                        }
                    }, function ( err ) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                    })
                });
            }
        });
    }
});
