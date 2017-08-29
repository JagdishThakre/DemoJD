app.controller('BuzzCtrlReview', function($scope, $state, guestsInputs, $cordovaBarcodeScanner, Guestslist, $ionicPopup, CONFIG, buzzaguessService, $localStorage, $ionicPopup, $ionicLoading, $ionicHistory, packageService) {
    $scope.staffName = $localStorage.User.firstname;
    $scope.date = Date.now();
    $scope.guestslistModified = guestsInputs;
    $scope.objId = Guestslist.resColor;
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
        console.log("on error image called");
        $scope.showErrorImg = true;
    }
    var freshImageList = [];
    if (Guestslist.imgURI == undefined)
        $scope.guestImages = "";
    else
        $scope.guestImages = Guestslist.imgURI;
    var GuestsImagesList = Object.keys($scope.guestImages);
    for (var $z = 0; $z < GuestsImagesList.length; $z++) {
        console.log($scope.guestImages[GuestsImagesList[$z]]);
        if ($scope.guestImages[GuestsImagesList[$z]] != "")
            freshImageList.push($scope.guestImages[GuestsImagesList[$z]]);
    }
    $scope.unitId = Guestslist.unit_id;
    console.log($scope.unitId);
    $scope.guestNames = Guestslist.GuestNames;
    $scope.guestslistModified.names = $scope.guestNames;
    $scope.guestslistModified.id = 1;
    $scope.GuestNamesLength = Guestslist.GuestNames.length;
    $scope.subjectToGuest = "Hello Unit " + $scope.unitId + ",";
    console.log(localStorage.getItem("service_msg"), "review");

    $scope.messageToGuest = localStorage.getItem("service_msg").replace(/\[items]/g, $scope.GuestNamesLength);



    $scope.sendData = function(value) {
        console.log("in send Data");
        // $ionicHistory.nextViewOptions({
        //   disableAnimate: true,
        //   //disableBack: true
        // });
        var guestData = {
            "units_id": $scope.objId,
            "users_id": $localStorage.User.user_id,
            "property_id": $localStorage.User.property_id,
            "subject": $scope.subjectToGuest,
            "items": $scope.GuestNamesLength,
            "guest_names": $scope.guestNames,
            "imagesa": freshImageList,
            "token": $localStorage.User.token,
            "package_type": value,
            "cat_slug": localStorage.getItem('notifySpecific')
        }
        console.log("guestData", guestData);
        if ($scope.isOnline() == true) {
            $ionicLoading.show();
            buzzaguessService.buzzaguess().save(guestData, function(res) {
                if (res.code == 200) {

                    guestsInputs.id = null;
                    guestsInputs.names = [];
                    localStorage.setItem('unitIds', 0);
                    localStorage.setItem('unit_Number', '');
                    $ionicLoading.hide();
                    if (localStorage.getItem('notifySpecific') == 'bgfd') {
                        $scope.alertPop('Alert', res.message, 'buzzandfood_firstpage');
                    } else {
                        $scope.alertPop('Alert', res.message, 'package_firstpage');
                    }
                } else if (res.code == 201) {
                    console.log("shout redirect to  staf", res.code);
                    guestsInputs.id = null;
                    guestsInputs.names = [];
                    $ionicLoading.hide();
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

    }
    $scope.buzzrevcancel = function() {
        $ionicHistory.goBack(-1);
    }

})
