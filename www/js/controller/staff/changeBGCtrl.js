app.controller('staffChangeBGCtrl', function($scope, $ionicSlideBoxDelegate, $cordovaActionSheet, existingNotifyService, $cordovaBarcodeScanner, $cordovaEmailComposer, loginService, usersForUnitId, $rootScope, buzzaguessService, getUnitIdServices, $timeout, $state, unitIdsList, notificationStaffList, $ionicModal, $cordovaCamera, $ionicScrollDelegate, Guestslist, $ionicHistory, $ionicPopup, CONFIG, guestsInputs, getUnitIdServices, $localStorage, $ionicLoading, packageService) {


    $scope.BGImages = JSON.parse(localStorage.getItem('BGImages'));


    $scope.setImage = function(img){
        localStorage.setItem('bgImg', img.propert_imgP);
        localStorage.setItem("propert_imgL", img.propert_imgL);
        localStorage.setItem("propert_imgP", img.propert_imgP);
        // $state.go($state.current, {}, {reload: true}); 
        $rootScope.$emit('changeBG', img)
        $timeout(function() {
            $scope.alertPopResi('Success', 'Background successfully changed', 'sideMenuStaff.features');
        }, 300);

    }

});
