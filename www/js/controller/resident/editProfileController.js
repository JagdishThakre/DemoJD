app.controller('EditPrflCtrl', function($scope, $state, $cordovaNetwork, $rootScope, $ionicPopup, $ionicPopup, CONFIG, $rootScope, $localStorage, $ionicLoading, $ionicHistory, updateProfileService, $cordovaFile, $ionicActionSheet, $cordovaCamera, updateProfileImageService, logoutService, $cordovaDevice, $ionicModal) {
    $scope.showNumericKeyboard = false;
    $scope.keyBoardbutton = 'Cancel';
    $scope.isEnabled = true;
    $scope.isDirEnabled = true;
    $scope.data = { curPwd: '', newPwd: '', confirmPwd: '' };
    $scope.color = $localStorage.User.usrColor;
    /* @function : generateAvtarOnimageLoadError()
    *  @Creator  :Shivansh 
    *  @created  : 19012017
    */

    $scope.showErrorImg=false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError=function(){
        $scope.showErrorImg=true;
    }
    if($localStorage.User.profile_img != ''){
        $scope.profileImg = true;
    }else{
        $scope.profileImg = false;
    }
    console.log("Color: ",$scope.color);
    console.log("Img-: ",$localStorage.User.profile_img);
    $scope.callProfile = function() {
        $scope.userDetailsProfile = {
            "firstname": $localStorage.User.firstname,
            "lastname": $localStorage.User.lastname,
            "phone_no": $localStorage.User.phone_no,
            "emergency_contact": $localStorage.User.emergency_contact,
            "profile_img": $localStorage.User.profile_img,
            "unit_number": $localStorage.User.units_number,
            "email": $localStorage.User.email,
            "bgColor": $localStorage.User.color
        }
    }
    $scope.edit = function(x) {
        $scope.isEnabled = false;
        if (x == 'firstname') {
            $scope.activeName = true;
            console.log($scope.isEnabled)
        } else if (x == 'lastname') {
            $scope.activelName = true;
        } else if (x == 'phone_no') {
            $scope.showNumericKeyboard = true;
            $scope.activeNumber = true;
        } else if (x == 'emergency_contact') {
            $scope.activeEmernumber = true;
        } else if (x == 'emergency_contact') {
            $scope.activeUN = true;
        } else if (x == 'email') {
            $scope.activeEmail = true;
        }
         else {
            $scope.activePassword = true;
        }
    };

    $scope.update = function(userUpdatedData) {
        console.log("userUpdatedData.phone: ",userUpdatedData.phone_no.length);
        if( (userUpdatedData.phone_no.length <= 0) && ( (userUpdatedData.phone_no.length < 7) || (userUpdatedData.phone_no.length > 10) ) ){
            $scope.alertPopResi('Alert', 'Please enter valid phone number ');
        } else if (userUpdatedData.emergency_contact && (userUpdatedData.emergency_contact.length < 7 ||  userUpdatedData.emergency_contact.length > 10)) {
            $scope.alertPopResi('Alert', 'Please enter valid alternate number ');
        } else if(!userUpdatedData.email){
            $scope.alertPopResi('Alert', 'Please enter valid email');
        } else {
            if ($rootScope.authoriedUser == true) {
                $scope.isDirEnabled = false;
                $ionicLoading.show({
                    template: 'Updating <br><ion-spinner icon="lines"></ion-spinner>'
                });
                var updatedUserDetails = {
                    "token": $localStorage.User.token,
                    "user_id": $localStorage.User.user_id,
                    "firstname": userUpdatedData.firstname,
                    "lastname": userUpdatedData.lastname,
                    "phone_no": userUpdatedData.phone_no,
                    "emergency_contact": userUpdatedData.emergency_contact,
                    "email": userUpdatedData.email,
                    "property_id": $localStorage.User.property_id
                }
                if ($scope.isOnline() == true) {
                    updateProfileService.updateData().save(updatedUserDetails, function(res) {
                        console.log("Update resp",res)
                        $ionicLoading.hide();
                        if (res.code == 200) {
                            setTimeout(function() {
                                $scope.activeName = false;
                                $scope.activelName = false;
                                $scope.activeNumber = false;
                                $scope.activeEmernumber = false;
                                $scope.isEnabled = true;
                                $scope.activeUN = false;
                                $scope.activeEmail = false;
                                console.log($scope.isEnabled);
                            }, 500)
                            $localStorage.User.firstname = userUpdatedData.firstname;
                            $localStorage.User.lastname = userUpdatedData.lastname;
                            $localStorage.User.phone_no = userUpdatedData.phone_no;
                            $localStorage.User.emergency_contact = userUpdatedData.emergency_contact;
                            $localStorage.User.email = userUpdatedData.email;
                            $scope.alertPopResi('Alert', res.message, 'sideMenu.features');
                        /*email already exist in database*/
                        }else if(res.code == 201){
                            $scope.alertPopResi('Alert', res.message);
                        } else {
                            $scope.alertPopResi('Alert', "Something went wrong");
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                    })
                } else {
                    $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);

                }
            } else {
                $scope.logout();
            }
        }
    };

    $scope.goback = function() {
        // $ionicHistory.nextViewOptions({
        //   disableAnimate: true,
        // });
        $ionicHistory.goBack(-1);
    }

    $scope.cancelUser = function() {

        console.log($localStorage.User);
        $scope.activeName = false;
        $scope.activelName = false;
        $scope.activeNumber = false;
        $scope.activeEmernumber = false;
        $scope.activeUN = false;
        $scope.activeEmail = false;
        $scope.isEnabled = true;
        $scope.userDetailsProfile = {
            "firstname": $localStorage.User.firstname,
            "lastname": $localStorage.User.lastname,
            "phone_no": $localStorage.User.phone_no,
            "emergency_contact": $localStorage.User.emergency_contact,
            "profile_img": $localStorage.User.profile_img,
            "unit_number": $localStorage.User.units_number,
            "email": $localStorage.User.email
        }
        console.log($scope.userDetailsProfile);
    }

    $scope.editphoto = function() {
        $scope.hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<center><i class="icon ion-camera" ng-click="takeImage()"></i> <div class="custom-action-sheet">Take photo</div></center>'
            }, {
                text: '<center><i class="icon ion-share" ng-click="takeImagefromlib()"></i> <div class="custom-action-sheet">Photo from library</div></center>'
            }],
            buttonClicked: function(index) {
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
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.srcImage = "data:image/jpeg;base64," + imageData;
                    updateduUserImage = {
                        "token": $localStorage.User.token,
                        "user_id": $localStorage.User.user_id,
                        "imagedata": $scope.srcImage
                    }
                    if ($rootScope.authoriedUser == true) {
                        $ionicLoading.show({
                            template: 'Updating Profile Image <br><ion-spinner icon="lines"></ion-spinner>'
                        });
                        console.log("updateduUserdata", updateduUserImage)
                        updateProfileImageService.updateImage().save(updateduUserImage, function(res) {
                            if (res.code == 200) {
                                $ionicLoading.hide();
                                $scope.alertPopResi('Alert', res.message);
                                var profile_img = res.path;
                                $localStorage.User.profile_img = profile_img;
                                $state.go('editProfile',{},{reload:true});
                            } else {
                                $ionicLoading.hide();
                                $scope.alertPopResi('Alert', res.message);
                            }
                        }, function(err) {
                            $ionicLoading.hide();
                            console.log(err);
                            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                        })
                    } else {
                        $scope.logout();
                    }
                });
            }
        });
    }
})
