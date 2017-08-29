  app.controller('residentChangeBGCtrl', function($scope, $state, $rootScope, $ionicListDelegate, $ionicModal, CONFIG, $cordovaImagePicker, newsFeedServices, $ionicHistory, $ionicPopup, $ionicFilterBar, $localStorage, $cordovaCamera, $ionicLoading, $ionicScrollDelegate, $timeout, PollService, $ionicSlideBoxDelegate, getDynamicFeatures, $cordovaFileTransfer, $cordovaFileOpener2, residentActionSheet, $ionicActionSheet, $ionicPlatform) {


    $scope.BGImages = JSON.parse(localStorage.getItem('BGImages'));


    $scope.setImage = function(img){
        localStorage.setItem('bgImg', img.propert_imgP);
        localStorage.setItem("propert_imgL", img.propert_imgL);
        localStorage.setItem("propert_imgP", img.propert_imgP);
        // $state.go($state.current, {}, {reload: true}); 
        $rootScope.$emit('changeBG', img);
        $timeout(function() {
            $scope.alertPopResi('Success', 'Background successfully changed', 'sideMenu.features');
        }, 300);


    }

});
