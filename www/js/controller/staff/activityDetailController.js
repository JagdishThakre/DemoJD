app.controller("activityDetailLogCtrl", function(
  $cordovaImagePicker,
  $ionicPopup,
  $cordovaCamera,
  $rootScope,
  $scope,
  $http,
  $location,
  $state,
  $ionicLoading,
  $localStorage,
  CONFIG,
  activityService,
  $http,
  $stateParams,
  $ionicModal
  ) {
  /* @controller : activityLogCtrl 
     *  @created  : 01082017
     */
      $scope.loading = true;
     console.log("$stateParams$stateParams$stateParams");
     console.log($stateParams);
     $scope.getDetails = function() {
      $ionicLoading.show();
      $scope.loading = true;
      var data = {
        user_id: $localStorage.User.user_id,
        activityID: $stateParams.activity
      };
      activityService.activityDetails($stateParams.activity).save(
        data,
        function(result) {
          $scope.loading = false;
          $scope.$broadcast("scroll.refreshComplete");
          console.log(result);
          $ionicLoading.hide();
          $scope.activityDetail = result.result;
        },
        function(error) {
          $scope.loading = false;
          $scope.$broadcast("scroll.refreshComplete");
          console.log(error);
          $ionicLoading.hide();
        }
        );
      console.log("activity detail");
    };
    $scope.openAttachment = function() {
      $ionicModal
      .fromTemplateUrl("templates/Resident/newsfeed/openAttachment.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.attachmentModal = modal;
        $scope.attachmentModal.show();
      });
    };
    $scope.openImageZoom1ss = function(images, index) {
      $scope.activeImageSlide = index;
      $ionicModal
      .fromTemplateUrl("templates/openGalleryImageDetails.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.attachmentModal1 = modal;
        $scope.previewImages = [];
        $scope.previewImages = images;
        $scope.previewImageIndex = index;
        $scope.attachmentModal1.show();
      });
    };
    $scope.closeGaleryModal = function() {
      $scope.attachmentModal1.hide();
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
      $cordovaCamera.getPicture(options).then(
        function(imageData) {
          $scope.commentImages.push("data:image/jpeg;base64," + imageData);
          $scope.sendcommentImages();
        },
        function(err) {}
        );
    };
    if (ionic.Platform.platform() == "ios") {
      $scope.activityformsettings = {
        theme: "ios-dark",
        tap: false
      };
    } else if (ionic.Platform.platform() == "android") {
      $scope.activityformsettings = {
        theme: "android-holo",
        tap: false
      };
    } else if (ionic.Platform.platform() == "macintel") {
      $scope.activityformsettings = {
        theme: "ios-dark",
        tap: false
      };
      console.log("Default Mac Browser Theme");
    } else {
      $scope.activityformsettings = {
        theme: "material-dark",
        tap: false
      };
      console.log("Default Theme");
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
      $cordovaImagePicker.getPictures(option).then(
        function(results) {
          for (var i = 0; i < results.length; i++) {
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function() {
              var canvas = document.createElement("CANVAS");
              var ctx = canvas.getContext("2d");
              var dataURL;
              canvas.height = this.height;
              canvas.width = this.width;
              ctx.drawImage(this, 0, 0);
              dataURL = canvas.toDataURL("image/jpeg");
              $scope.commentImages.push(dataURL);
              count++;
              if (i == count) {
                $scope.sendcommentImages();
                count = 0;
              }
            };
            img.src = results[i];
          }
        },
        function(error) {}
        );
    };
    $scope.sendcommentImages = function() {
      $scope.closeAttachmentModal();
      $ionicModal
      .fromTemplateUrl("templates/commentGallery.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.commentGallery = modal;
        $scope.commentGallery.show();
      });
    };
    $scope.closeAttachmentModal = function() {
      $scope.attachmentModal.hide();
      $scope.attachmentModal = "";
    };
    $scope.closecommentGallery = function() {
      $scope.commentGallery.hide();
      $scope.commentGallery = "";
    };
    $scope.getselect = function() {
      var option = {
        maximumImagesCount: 10,
        width: 800,
        height: 800,
        quality: 80
      };
      $cordovaImagePicker.getPictures(option).then(
        function(results) {
          for (var i = 0; i < results.length; i++) {
            $ionicLoading.show();
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function() {
              var canvas = document.createElement("CANVAS");
              var ctx = canvas.getContext("2d");
              var dataURL;
              canvas.height = this.height;
              canvas.width = this.width;
              ctx.drawImage(this, 0, 0);
              dataURL = canvas.toDataURL("image/jpeg");
              $scope.topic.photos.push(dataURL);
              $ionicScrollDelegate.scrollBottom(true);
              $ionicScrollDelegate.scrollBottom(true);
              $ionicLoading.hide();
            };
            img.src = results[i];
          }
        },
        function(error) {
          $ionicLoading.hide();
        }
        );
    };
  //Function name : openModal
  //This function used for open image on modal
  //Function name : closeModal
  //Close the modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal = "";
  };
  $scope.replaycommentImages = function() {
    $ionicPopup
    .confirm({
      title: "Alert",
      template: "Are you sure you want to send this message ?",
      cssClass: "my-custom-popup-resi"
    })
    .then(function(res) {
      if (res == true) {
        $scope.closecommentGallery();
      } else {
      }
    });
  };
  $scope.getDetails();
  //**Add comment function**//
  $scope.commentObj = {};
  $scope.addComment = function(length) {
    console.log("Add comment");
    if ($scope.isOnline() == true) {
      if ($rootScope.authoriedUser == true) {
        console.log("calling add comment service");
        $ionicLoading.show();
        $scope.commentObj.activity_id = $scope.activityDetail._id;
        $scope.commentObj.user_id = $localStorage.User.user_id;
        $scope.commentObj.created_by = $localStorage.User.user_id;
        $scope.commentObj.firstname = $localStorage.User.firstname;
        $scope.commentObj.lastname = $localStorage.User.lastname;
        if ($scope.commentImages != undefined && $scope.commentImages != null) {
          $scope.commentObj.image = $scope.commentImages[0];
        }
        activityService.addComments().save(
          $scope.commentObj,
          function(result) {
            console.log("add comment result- ", result);
            $ionicLoading.hide();
            if (result.code == 200) {
              $scope.commentObj = {};
              $scope.activityDetail = result.result;
            } else {
              $scope.alertPop("Message", "Failed.");
            }
          },
          function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
          }
          );
      } else {
        $ionicLoading.hide();
        $scope.logout();
      }
    } else {
      $ionicLoading.hide();
      $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
    }
  };
});
