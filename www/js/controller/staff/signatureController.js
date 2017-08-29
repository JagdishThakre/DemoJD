app.controller('SignatureCtrl', function($scope, $state, $window, $rootScope, $localStorage, $ionicPopup, $ionicHistory, CONFIG, $ionicLoading, addSign, $cordovaDevice) {
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        $scope.showErrorImg = true;
    };

    var orientation = window.orientation;

    screen.orientation.lock('landscape');

    var canvas = document.getElementById('signatureCanvas');
    canvas.width = (orientation == 90 || orientation == -90) ? $window.innerWidth : $window.innerHeight + 30;
    canvas.style.width = (orientation == 90 || orientation == -90) ? $window.innerWidth + 'px' : $window.innerHeight + 30 + 'px';
    canvas.height = '180';
    canvas.style.height = '180px';

    $scope.unitnumber = localStorage.getItem('partThrdUntNum');
    var signaturePad = new SignaturePad(canvas);


    $scope.signature = [];
    $scope.clearCanvas = function() {
        signaturePad.clear();
    }

    $scope.gobackpckgdetails = function() {
        screen.orientation.lock('portrait');
        $ionicHistory.goBack(-1);
    }

    $scope.saveCanvas = function(err) {
        $rootScope.searching = false;
        $scope.nosign = signaturePad.isEmpty();
        if ($scope.isOnline() == true) {
            $ionicLoading.show();
            if (localStorage.getItem("is_Signed") == 'false') {

                if ($scope.nosign) {
                    $ionicLoading.hide();
                    $scope.alertPop('Alert', "Please sign the package");
                } else {

                    var singnatureData = {
                        "token": $localStorage.User.token,
                        "users_id": $localStorage.User.user_id,
                        "service_id": localStorage.getItem("service_id"),
                        "signature_image": $scope.signature,
                        "device_info": $scope.ConstantsInfo(),
                        "property_id": $localStorage.User.property_id,
                        "services_category_id": localStorage.getItem("services_cat_id"),
                        "user_type_id": $localStorage.User.user_type_id,
                        "staff_id": $localStorage.User.user_id,
                        "units_id": localStorage.getItem('partThrdUntId')
                    }

                    var sigImg = signaturePad.toDataURL();
                    $scope.signature.push(sigImg);


                    addSign.signature().save(singnatureData, function(res) {
                        if (res.code == 200) {
                            $ionicLoading.hide();
                            screen.orientation.lock('portrait');
                            localStorage.setItem("is_Signed", true);
                            $scope.alertPop('Alert', res.message, 'staffnotificationthread');
                        } else if (res.code == 401) {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', res.message);
                        } else {
                            $scope.alertPop('Alert', res.message);
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    })
                }


            } else {
                //screen.orientation.unlock();
                screen.orientation.lock('portrait');
                $scope.alertPop('Alert', "You have already signed for this package", 'staffnotification');
            }
        } else {
            $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
        }
    }

})
