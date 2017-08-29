//This is used for Contact Management Module
app.controller('ContactManagement', function($scope, contactManagementService, $state, emwCallService, $ionicHistory, $cordovaEmailComposer, $localStorage, $ionicPopup, cablghtService, $ionicLoading, $rootScope) {
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh
     *  @created  : 19012017
     */

    $scope.showErrorImg=false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError=function(){
        $scope.showErrorImg=true;
    }
    $scope.emailToManagment = function() {
        $ionicLoading.show();
        var emailReqData = {
            "property_id": $localStorage.User.property_id,
            "token": $localStorage.User.token
        }
        if ($rootScope.authoriedUser == true) {
            contactManagementService.emailProperty().save(emailReqData, function(res) {
                if (res.code = 200) {
                    var ccArray = [];
                    var toArray = [];
                    angular.forEach(res.data.cc, function(item) {
                        ccArray.push(item.email);
                    })
                    angular.forEach(res.data.to, function(item) {
                        toArray.push(item.email);
                    })
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                }
                $cordovaEmailComposer.isAvailable().then(function() {
                    // is available
                }, function() {
                    // not available
                });

                var email = {
                    to: toArray,
                    cc: ccArray,
                    subject: 'Message To Management',
                    body: 'Hello,<br><br>',
                    isHtml: true
                };
                $cordovaEmailComposer.open(email).then(null, function() {
                    // user cancelled email
                });
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout();
        }
    }



    $scope.callRequestToManagement = function() {
        if ($rootScope.authoriedUser == true) {
            var calReqData = {
                "property_id": $localStorage.User.property_id
            }
            emwCallService.emWoPhn().save(calReqData, function(res) {
                $scope.phonenumber = res.data.call_management;

                window.plugins.CallNumber.callNumber(onSuccess, onError,  $scope.phonenumber, false);

                function onSuccess(result){
                }

                function onError(result) {
                }

                //Removing Ionic Popup and Handling natively on device
                /*
                 $ionicPopup.confirm({
                 title: 'Confirm to call',
                 template: 'Are you sure you want to call ' + $scope.phonenumber + ' ?',
                 cssClass: 'my-custom-popup-resi'
                 }).then(function(res) {
                 if (res) {
                 window.plugins.CallNumber.callNumber(onSuccess, onError,  $scope.phonenumber, false);

                 function onSuccess(result){
                 console.log("Success:"+result);
                 }

                 function onError(result) {
                 console.log("Error:"+result);
                 }

                 phonedialer.dial(
                 $scope.phonenumber,
                 function(err) {
                 if (err == "empty") alert("Unknown phone number");
                 else alert("Dialer Error:" + err);
                 },
                 function(success) {}
                 );
                 } else {
                 console.log('You are not sure');
                 }
                 }); */
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout();
        }
    }

    $scope.callRequestToDoorman = function() {
        if ($rootScope.authoriedUser == true) {
            var calReqData = {
                "property_id": $localStorage.User.property_id
            }
            emwCallService.emWoPhn().save(calReqData, function(res) {
                $scope.phonenumber = res.data.call_doorman;

                window.plugins.CallNumber.callNumber(onSuccess, onError,  $scope.phonenumber, false);

                function onSuccess(result){
                }

                function onError(result) {
                }

                /*
                 $ionicPopup.confirm({
                 title: 'Confirm to call',
                 template: 'Are you sure you want to call ' + $scope.phonenumber + ' ?',
                 cssClass: 'my-custom-popup-resi'
                 }).then(function(res) {
                 if (res) {
                 phonedialer.dial(
                 $scope.phonenumber,
                 function(err) {
                 if (err == "empty") alert("Unknown phone number");
                 else alert("Dialer Error:" + err);
                 },
                 function(success) {}
                 );
                 } else {
                 console.log('You are not sure');
                 }
                 }); */
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout();
        }
    }
})