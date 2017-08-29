app.controller("WorkOrderCtrl", function(
  $scope,
  notifyCount,
  $state,
  $ionicPopover,
  $rootScope,
  $ionicModal,
  $cordovaImagePicker,
  $ionicHistory,
  $localStorage,
  $ionicPopup,
  $localStorage,
  wrkOrdService,
  emwCallService,
  $cordovaCamera,
  $ionicLoading,
  $ionicScrollDelegate,
  $timeout,
  getDynamicFeatures,
  residentActionSheet
) {
  $scope.woClear = {};
  $scope.data = {};
  $scope.countforNwo = "";
  $scope.countforEwo = "";
  $scope.filteredText = [];
  $scope.imageSrc = "";
  $scope.wodata = {location:""};
  $scope.problem =  "";
  $scope.description = "";
  $scope.note = "";
  $scope.choice = false;
  $scope.estimate = false;
  $scope.permission = false;

    /* @function : generateAvtarOnimageLoadError()
       *  @Creator  :Shivansh
       *  @created  : 19012017
       */

  $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
  $scope.generateAvtarOnimageLoadError = function() {
    console.log("on error image called");
    $scope.showErrorImg = true;
  };

  if (ionic.Platform.platform() == "ios") {
    // $scope.preventKeyboard = function(e) {
    //   cordova.plugins.Keyboard.disableScroll(true);
    //   e.preventDefault();
    //   e.stopPropagation();
    //   window.scrollTo(0, 0);
    // };

    $scope.woformsettings = {
      theme: "ios-dark",
      tap: false
    };
  } else if (ionic.Platform.platform() == "android") {
    $scope.woformsettings = {
      theme: "android-holo",
      tap: false
    };
  } else if (ionic.Platform.platform() == "macintel") {
    $scope.woformsettings = {
      theme: "ios-dark",
      tap: false
    };
    console.log("Default Mac Browser Theme");
  } else {
    $scope.woformsettings = {
      theme: "material-dark",
      tap: false
    };
    console.log("Default Theme");
  }

  $ionicPopover
    .fromTemplateUrl("templates/Resident/predectiveText.html", {
      scope: $scope
    })
    .then(function(popover) {
      console.log("popover", popover);
      $scope.popover = popover;
    });

  //Cleanup the popover when we're done with it!
  $scope.$on("$destroy", function() {
    $scope.popover.remove();
  });
  // Execute action on hidden popover
  $scope.$on("popover.hidden", function() {
    //angular.element(document.body).removeClass('popover-open');
    console.log("Hiding PopOver");
  });

  // Execute action on remove popover
  $scope.$on("popover.removed", function() {
    angular.element(document.body).removeClass("popover-open");
    console.log("Removing PopOver");
  });

  $scope.predectiveCall = function() {
    var predectiveData = {
      property_id: $localStorage.User.property_id
    };
    wrkOrdService.predectiveText().save(predectiveData, function(res) {
      if (res.code == 200) {
        $scope.predectiveText = res.result;
      }
    });
  };

  $scope.setPromptText = function(text) {
    $scope.wodata.location = text;
    $scope.popover.hide();
  };
  $scope.openPredicts = function() {
    $scope.popover.show();
  };
  $scope.compareText = function(text) {
    if (text != undefined) {
      if (text.length != 0) {
        $scope.filteredText = [];
        angular.forEach($scope.predectiveText, function(item) {
          if (item.text_name.indexOf(text) >= 0) {
            $scope.filteredText.push({
              text_name: item.text_name
            });
            $scope.showwoPopup = true;
          } else {
            $scope.showwoPopup = false;
          }
        });
      } else {
        $scope.filteredText = [];
      }
    } else {
      $scope.filteredText = [];
    }
  };
  $scope.featureNote = function() {
    console.log("********");
    console.log("residentActionSheet", residentActionSheet.data);

    $scope.subWorkorderFeatures = [];
    for (var i = 0; i < residentActionSheet.data.length; i++) {
      // if (residentActionSheet.data[i]._id==='5629c4a03949c780667d5c5d' || residentActionSheet.data[i]._id==='5629c4763949c780667d5c5c') {
      if (
        residentActionSheet.data[i].service_category_id._id ==
        "5629c4763949c780667d5c5c"
      ) {
        if ($rootScope.user_permissions.Emergency_Work_Order) {
          $scope.subWorkorderFeatures.push(residentActionSheet.data[i]);
          console.log("Emergency_Work_Order");
        }
      } else if (
        residentActionSheet.data[i].service_category_id._id ==
        "5629c4a03949c780667d5c5d"
      ) {
        if ($rootScope.user_permissions.Normal_Work_Order) {
          $scope.subWorkorderFeatures.push(residentActionSheet.data[i]);
          console.log("Normal_Work_Order");
        }
      }
      // }
    }
  };

  $scope.openModal = function(img) {
    $ionicModal
      .fromTemplateUrl("templates/Resident/openImgfull.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
        $scope.imageSrc = img;
        $scope.modal.show();
      });
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal = "";
  };

  localStorage.setItem("kvalue", "10");
  console.log(localStorage.getItem("slugNamewo"));
  $scope.data = {};
  $scope.headerPage = function() {
    if (localStorage.getItem("slugNamewo") == "ewo")
      $scope.heading = "Emergency Work Order";
    if (localStorage.getItem("slugNamewo") == "nwo")
      $scope.heading = "Normal Work Order";
  };

  $scope.goback = function() {
    $ionicHistory.goBack(-1);
  };

  $scope.changeworkorder = function(data) {
    localStorage.setItem("services_cat_id", data._id);
    console.log(localStorage.getItem("services_cat_id"));
    if (data.slug == "ewo") {
      localStorage.setItem("slugNamewo", "ewo");
      $state.go("frstpgworkorder");
    }
    if (data.slug == "nwo") {
      localStorage.setItem("slugNamewo", "nwo");
      $state.go("frstpgworkorder");
    }
  };

  $scope.chnagewopage = function(index) {
    if (localStorage.getItem("slugNamewo") == "ewo") {
      $state.go("emworkorder");
    } else {
      $state.go("nmworkorder");
    }
  };

  $scope.changetonotify = function() {
    if (localStorage.getItem("slugNamewo") == "ewo") {
      localStorage.setItem("currentFeature_id", "5629c4763949c780667d5c5c");
      localStorage.setItem("services_cat_id", "5629c4763949c780667d5c5c");
      $state.go("emWoExistingList");
    } else {
      localStorage.setItem("currentFeature_id", "5629c4a03949c780667d5c5d");
      localStorage.setItem("services_cat_id", "5629c4763949c780667d5c5c");
      $state.go("nwoExistingList");
    }
  };

  $scope.sendRequestpage = function() {
    $state.go("emworkorderNotify");
  };

  /***********************Function for sending Nrml-Work-order***************/
  $scope.sendnw = function(location,problem,description,choice,estimate,permission,note) {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var freshImageList = [];
      angular.forEach($scope.GuestNameObject, function(val, key) {
        freshImageList.push(val);
      });
      $timeout(function() {


        if (permission == undefined) {
          permission = false;
        }
        if (choice == undefined) {
          choice = false;
        }
        if (estimate == undefined) {
         estimate = false;
        }
        var nwData = {
          units_id: $localStorage.User.units_id,
          users_id: $localStorage.User.user_id,
          property_id: $localStorage.User.property_id,
          token: $localStorage.User.token,
          cat_slug: localStorage.getItem("slugNamewo"),
          description: description,
          location: location,
          problem: problem,
          have_pet: choice,
          cat_slug: localStorage.getItem("slugNamewo"),
          imagesa: freshImageList,
          firstname: $localStorage.User.firstname,
          lastname: $localStorage.User.lastname,
          estimate_needed: estimate,
          permission_to_enter: permission,
          entry_note: note,
          firstname: $localStorage.User.firstname,
          lastname: $localStorage.User.lastname
        };
        wrkOrdService.nWo().save(nwData, function(res) {
          if ((res.code = 200)) {
            $ionicLoading.hide();
            localStorage.setItem("service_id", res.details._id);
            $scope.alertPopResi("Alert", res.message, "woDetailspgResi");
          } else {
            $ionicLoading.hide();
            $scope.alertPopResi("Alert", res.message);
          }
        });
      });
    } else {
      $scope.logout();
    }
  };

  $scope.clearnw = function() {
    console.log("Clearing Form");
    $scope.wodata = {};
  };

  $scope.getScrollPosition = function() {
    $scope.GuestNameObject = $scope.GuestNameObject;
    $scope.$apply();
  };

  $scope.GuestNameObject = {};

  $scope.getclicked = function() {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    //if platform is android then  accessing permission
    var isAndroid = ionic.Platform.isAndroid();
    if (isAndroid) {
      var permissions = cordova.plugins.permissions;
      permissions.hasPermission(
        permissions.CAMERA,
        checkPermissionCallback,
        null
      );

      function checkPermissionCallback(status) {
        console.log("status", JSON.stringify(status));
        if (!status.hasPermission) {
          var errorCallback = function() {
            console.warn("Camera permission is not turned on");
          };
          permissions.requestPermission(
            permissions.CAMERA,
            function(status) {
              if (!status.hasPermission) {
                errorCallback();
              } else {
                $cordovaCamera.getPicture(options).then(
                  function(imageData) {
                    $scope.GuestNameObject[
                      localStorage.getItem("kvalue") +
                        localStorage.getItem("kvalue")
                    ] =
                      "data:image/jpeg;base64," + imageData;
                    console.log(
                      $scope.GuestNameObject[
                        localStorage.getItem("kvalue") +
                          localStorage.getItem("kvalue")
                      ]
                    );
                    localStorage.setItem(
                      "kvalue",
                      localStorage.getItem("kvalue") +
                        localStorage.getItem("kvalue")
                    );
                    $ionicScrollDelegate.scrollBottom(true);
                  },
                  function(err) {}
                );
              }
            },
            errorCallback
          );
        } else {
          $cordovaCamera.getPicture(options).then(
            function(imageData) {
              $scope.GuestNameObject[
                localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
              ] =
                "data:image/jpeg;base64," + imageData;
              console.log(
                $scope.GuestNameObject[
                  localStorage.getItem("kvalue") +
                    localStorage.getItem("kvalue")
                ]
              );
              localStorage.setItem(
                "kvalue",
                localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
              );
              $ionicScrollDelegate.scrollBottom(true);
            },
            function(err) {}
          );
        }
      }
    } else {
      $cordovaCamera.getPicture(options).then(
        function(imageData) {
          $scope.GuestNameObject[
            localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
          ] =
            "data:image/jpeg;base64," + imageData;
          console.log(
            $scope.GuestNameObject[
              localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
            ]
          );
          localStorage.setItem(
            "kvalue",
            localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
          );
          $ionicScrollDelegate.scrollBottom(true);
        },
        function(err) {}
      );
    }
    //if platform is android then  accessing permission ends here
  };

  $scope.convertImgToDataURLviaCanvas = function(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  };

  $scope.getselect = function() {
    console.log("getselect");
    //var results = ['/img/logo2.png','/img/logo.png'];
    var option = {
      maximumImagesCount: 5,
      width: 800,
      height: 800,
      quality: 80
    };
    $cordovaImagePicker.getPictures(option).then(
      function(results) {
        console.log("results", results);
        for (var i = 0; i < results.length; i++) {
          $ionicLoading.show();
          var img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = function() {
            console.log("onload");
            var canvas = document.createElement("CANVAS");
            var ctx = canvas.getContext("2d");
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL("image/jpeg");
            $scope.GuestNameObject[
              localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
            ] = dataURL;
            console.log(
              $scope.GuestNameObject[
                localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
              ]
            );
            localStorage.setItem(
              "kvalue",
              localStorage.getItem("kvalue") + localStorage.getItem("kvalue")
            );
            console.log("*****", $scope.GuestNameObject);
            $ionicScrollDelegate.scrollBottom(true);
            $ionicScrollDelegate.scrollBottom(true);
            $ionicLoading.hide();
          };
          img.src = results[i];
          console.log("img", img);
          // }
        }
      },
      function(error) {
        $ionicLoading.hide();
      }
    );
  };

  $scope.removeImg = function(deleteImg) {
    var imgkeys = Object.keys($scope.GuestNameObject);
    console.log(imgkeys);
    var key = null;
    for (var i = 0; i < imgkeys.length; i++) {
      if ($scope.GuestNameObject[imgkeys[i]] == deleteImg) {
        key = imgkeys[i];
        var confirmPopup = $ionicPopup.confirm({
          title: "Alert",
          template: "Are you sure you want to delete this image?",
          cssClass: "my-custom-popup-resi"
        });
        confirmPopup.then(function(res) {
          if (res == true) {
            console.log(key);
            delete $scope.GuestNameObject[key];
            $ionicScrollDelegate.scrollBottom(true);
          }
        });
      }
    }
  };
  /***********************Function for sending Eme-Work-order***************/
  $scope.sendemw = function(text) {
    if ($rootScope.authoriedUser == true) {
      $scope.emdata = text;
      console.log($scope.emdata);
      var emwData = {
        units_id: $localStorage.User.units_id,
        users_id: $localStorage.User.user_id,
        property_id: $localStorage.User.property_id,
        message: $scope.emdata,
        token: $localStorage.User.token,
        cat_slug: localStorage.getItem("slugNamewo"),
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname
      };
      console.log(emwData);
      $ionicLoading.show();
      wrkOrdService.emWo().save(
        emwData,
        function(res) {
          console.log(res);
          if ((res.code = 200)) {
            $ionicLoading.hide();
            $scope.alertPopResi("Alert", res.message, "frstpgworkorder");
          }
          $scope.emdata = "";
        },
        function(err) {
          $ionicLoading.hide();
          console.log(err);
          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
    } else {
      $scope.logout();
    }
  };
  $scope.clearemw = function(text) {
    console.log(text);
    console.log("i ma called");
    $scope.woClear.text = "";
  };
  /***********************Function for calling emergency wo***************/
  $scope.callRequest = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var calReqData = {
        property_id: $localStorage.User.property_id
      };
      emwCallService.emWoPhn().save(
        calReqData,
        function(res) {
          $ionicLoading.hide();
          $scope.phonenumber = res.data.call_emergency;

          window.plugins.CallNumber.callNumber(
            onSuccess,
            onError,
            $scope.phonenumber,
            false
          );

          function onSuccess(result) {
            console.log("Success:" + result);
          }

          function onError(result) {
            console.log("Error:" + result);
          }
          /*
                           $ionicPopup.confirm({
                           title: 'Confirm to call',
                           template: 'Are you sure you want to call on ' + $scope.phonenumber + ' ?',
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
                           });
                           */
        },
        function(err) {
          $ionicLoading.hide();
          console.log(err);
          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
    } else {
      $scope.logout();
    }
  };

  $scope.openImageZoom1 = function(images, index) {
    $scope.activeImageSlide = index;
    $ionicModal
      .fromTemplateUrl("templates/openGalleryImage.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.attachmentModal1 = modal;
        $scope.previewImages = [];
        $scope.previewImages = images;
        $scope.attachmentModal1.show();
      });
  };
  $scope.closeGaleryModal = function() {
    $scope.attachmentModal1.hide();
  };

// =============================================================================
// Footer Section and Keyboard Behavior Begin
// =============================================================================

var keyboardHeight = 0;
window.addEventListener("native.keyboardshow", keyboardShowHandler);
window.addEventListener("native.keyboardhide", keyboardHideHandler);

function keyboardShowHandler(e) {
  keyboardHeight = e.keyboardHeight;
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
}

function keyboardHideHandler(e) {
  keyboardHeight = 0;
  $timeout(function() {
    cordova.plugins.Keyboard.close();
  }, 0);
}

// I emit this event from the monospaced.elastic directive, read line 480
// For iOS you will need to add the keyboardHeight to the scroller.style.bottom
$scope.$on("taResize", function(e, ta) {
  if (!ta) return;
  var taHeight = ta[0].offsetHeight;
  if (!footerBar) return;
  var newFooterHeight = taHeight + 10;
  newFooterHeight = newFooterHeight > 44 ? newFooterHeight : 44;
  footerBar.style.height = newFooterHeight + "px";
  if (ionic.Platform.platform() == "ios") {
    scroller.style.bottom = newFooterHeight + keyboardHeight + "px";
  } else {
    scroller.style.bottom = newFooterHeight + "px";
  }
  $ionicScrollDelegate.scrollBottom(true);
});


// =============================================================================
// Footer Section and Keyboard Behavior Ends
// =============================================================================


});
