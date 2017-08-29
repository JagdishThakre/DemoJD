//This is used for cab light module
app.controller('CabLightCtrl', function($scope, $state, $ionicHistory, $localStorage, $rootScope, $ionicPopup, cablghtService, $ionicLoading,CONFIG) {
    /* @function : generateAvtarOnimageLoadError()
    *  @Creator  :Shivansh 
    *  @created  : 19012017
    */

    $scope.showErrorImg=false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError=function(){
        console.log("on error image called");
        $scope.showErrorImg=true;
    }
    $scope.cablight = { messageBody: 'Hello, please bring out my car, I will be down in' };

    $scope.chnageCblgPg = function() {
        $state.go('cablight')
    }

    $scope.changetonotify = function() {
        $state.go("resi-notification");
    }

    $scope.cabLightOntime = function(paramTime) {
        $ionicPopup.confirm({
            title: 'Confirm your valet',
            template: 'Are you sure you want to confirm this time?',
            cssClass: 'my-custom-popup-resi'
        }).then(function(res) {
            if (res) {
                $ionicLoading.show();
                var cablghtData = {
                    "units_id": $localStorage.User.units_id,
                    "users_id": $localStorage.User.user_id,
                    "property_id": $localStorage.User.property_id,
                    "token": $localStorage.User.token,
                    "minutes": paramTime,
                    "message": $scope.cablight.messageBody,
                    "firstname": $localStorage.User.firstname,
                    "lastname": $localStorage.User.lastname
                }
                if ($rootScope.authoriedUser == true) {
                    console.log($rootScope.authoriedUser)
                    cablghtService.cblg().save(cablghtData, function(res) {
                        $ionicLoading.hide()
                        if (res.code = 200) {
                            $scope.alertPopResi('Alert', res.message, 'cablightfrstpg');
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                    })
                } else { $scope.logout(); }
            }
        });
    }


})
