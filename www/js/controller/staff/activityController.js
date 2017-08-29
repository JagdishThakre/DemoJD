app.controller("activityLogCtrl", function($rootScope, $scope, $http, $location, $state, $ionicLoading, $localStorage, $ionicModal, CONFIG, activityService, getUnitIdServices, $cordovaImagePicker, $cordovaCamera, $ionicPopover, wrkOrdService, $ionicPopup, $timeout) {
  /**************************************/
  /**********Define constants************/
  /**************************************/
  $scope.pages = 10;
  $scope.current_page = 1;
  $scope.searchFilter = {};
  if (isEmpty($rootScope.searchData)) {
    $rootScope.searching = false;
  }else{
    $rootScope.searching = true;
  }

  console.log("$rootScope.searchData", $rootScope.searchData);
  $scope.data = {
    show: false
  };
  $scope.activityUser = true;
  if (localStorage.getItem("userID") != null && localStorage.getItem("userID") != "null" && localStorage.getItem("userID") != undefined) {
    $scope.activityUser = false;
  }
  $scope.userIDLocal = $localStorage.User.user_id;
  console.log("$state", $state);

    // ========================================
    // Define MobiScroll Settings for Task Pages Begins
    // ========================================

    if (ionic.Platform.platform() == "ios") {
      $scope.activityformsettings = {
        theme: "ios-dark",
        tap: false
      };
      $scope.selectsettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom"
      };
    } else if (ionic.Platform.platform() == "android") {
      $scope.activityformsettings = {
        theme: "android-holo",
        tap: false
      };
      $scope.selectsettings = {
        theme: "android-holo",
        animate: "slideup",
        display: "bottom"
      };
    } else if (ionic.Platform.platform() == "macintel") {
      $scope.activityformsettings = {
        theme: "ios-dark",
        tap: false
      };
      $scope.selectsettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom"
      };
    } else {
      $scope.activityformsettings = {
        theme: "material-dark",
        tap: false
      };
      $scope.selectsettings = {
        theme: "material-dark",
        animate: "slideup",
        display: "bottom"
      };
    }
    // ============================================
    // Define MobiScroll Settings for Task Pages Ends
    // ============================================


    /*============================================
      =            Get the filter modal            =
      ============================================*/



      /**Filter modal */
      $scope.showFilter = function(what) {
        $scope.blur = true;
        var template = "templates/Staff/Activity/searchactivity.html";
        $ionicModal.fromTemplateUrl(template, {
          scope: $scope,
          animation: "slide-in-up"
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };
      /*=====  End of Get the filter modal  ======*/


    /*==================================================
      =            Get filtered activity list            =
      ==================================================*/

      $scope.categoryFilter = function(val) {
        if ($rootScope.clearsall) {
          $rootScope.clearsall = false;
        }
        $scope.searchFilter.category = val;
        $scope.data.show = false;
      };
      /*=====  End of Get filtered activity list  ======*/


    /*=========================================
      =            Get activity list            =
      =========================================*/

      $scope.getList = function(a, b, refresh) {
        $ionicLoading.show();

        $scope.page_number = a;

        $scope.noMoreItemsAvailable = false;
        var data = {
          number_of_pages: a,
          current_page: b,
          property_id: $localStorage.User.property_id,
          users_id: $localStorage.User.user_id,
          services_category_id: localStorage.getItem("services_category_id"),
          title: $rootScope.searchData.title,
          type: $rootScope.searchData.type,
          created_by: $rootScope.searchData.created_by,
          startdate: $rootScope.searchData.startdate,
          enddate: $rootScope.searchData.enddate
        };

        if (localStorage.getItem("userID") != null && localStorage.getItem("userID") != "null" && localStorage.getItem("userID") != undefined) {
          data.created_by= localStorage.getItem("userID");
        }
        activityService.activityList().save(data, function(result) {
          $scope.$broadcast("scroll.refreshComplete");
          $ionicLoading.hide();
          console.log(result);
            try{$scope.modal.hide();}catch(e){}
          if (result.result.length < 9) {
            $scope.noMoreItemsAvailable = true;
          }

          if (refresh) {
            $scope.activities = [];
          }

          $rootScope.totalrecords = result.list_count;
          if ($scope.activities != undefined) {
            for (var i = 0; i < result.result.length; i++) {
              if (result.count_data.length) {
                angular.forEach(result.count_data, function(val) {
                  if (result.result[i]._id == val._id) {
                    result.result[i].count = val.count;
                  }
                });
              }
              $scope.activities.push(result.result[i]);
            }
          }else{
            $scope.activities = [];
            for (var i = 0; i < result.result.length; i++) {
              if (result.count_data.length) {
                angular.forEach(result.count_data, function(val) {
                  if (result.result[i]._id == val._id) {
                    result.result[i].count = val.count;
                  }
                });
              }
              $scope.activities.push(result.result[i]);
            }
          }

        }, function(error) {
          $scope.$broadcast("scroll.refreshComplete");
          console.log(error);
          $ionicLoading.hide();
          $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
        });
      };
      /*=====  End of Get activity list  ======*/

    /*===============================================
      =            Image click from camera            =
      ===============================================*/

      $scope.getclicked = function() {
        console.log("clicked");
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
        $cordovaCamera.getPicture(options).then(function(imageData) {
          var img = "data:image/jpeg;base64," + imageData;
          if ($scope.addImages != undefined || $scope.addImages != null) {
            $scope.addImages.push(img);
          } else {
            $scope.addImages = [];
            $scope.addImages.push(img);
          }
        }, function(err) {});
      };
      /*=====  End of Image click from camera  ======*/

    /*==================================================
      =            Select images from Gallery            =
      ==================================================*/

      $scope.addImages = [];
      $scope.getselect = function() {
        $scope.commentImages = [];
        var option = {
          maximumImagesCount: 10,
          width: 800,
          height: 800,
          quality: 80
        };
        var count = 0;
        $cordovaImagePicker.getPictures(option).then(function(results) {
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
              dataURwL = canvas.toDataURL("image/png");
              $scope.addImages.push(dataURL);
              console.log($scope.addImages);
              console.log(dataURwL);
            };
            img.src = results[i];
            console.log(img);
          }
        }, function(error) {});
      };
      $scope.removeImg = function(index) {
        var confirmPopup = $ionicPopup.confirm({
          title: "Alert",
          template: "Are you sure you want to delete this image?",
          cssClass: "my-custom-popup-resi"
        });
        confirmPopup.then(function(res) {
          if (res == true) {
            $scope.addImages.splice(index, 1);
          }
        });
      };
      $scope.openImageZoom1 = function(images, index) {
        $scope.activeImageSlide = index;
        $ionicModal.fromTemplateUrl("templates/openGalleryImage.html", {
          scope: $scope,
          animation: "slide-in-up"
        }).then(function(modal) {
          $scope.attachmentModal1 = modal;
          $scope.previewImages = [];
          $scope.previewImages = images;
          $scope.attachmentModal1.show();
        });
      };
      $scope.closeGaleryModal = function() {
        $scope.attachmentModal1.hide();
      };
      $scope.clearnw = function() {
        $scope.activity = {};
        $scope.addImages = [];
      };
      /*=====  End of Select images from Gallery  ======*/


/*========================
=            "To Activity Sub Category Page"            =
========================*/

$scope.goToAddActivity = function(type) {
  localStorage.setItem("act_category", type);
  $state.go("addActivity");
};

/*=====  End of "To Activity Sub Category Page"  ======*/

/*=============================================
=            "To Activity List Page"            =
=============================================*/

$scope.goToActivityList = function(userID) {
  localStorage.setItem("userID", userID);
  $state.go("activityLogsList");
};

if ($state.current.url == "/acitivitylogs") {
  localStorage.setItem("userID", null);
}


/*=====  End of "To Activity List Page"  ======*/



    // Date format adjust
    $scope.changeformat = function(value, end) {
      if (value) {
        $rootScope.startdate = moment(value).format("MMMM Do YYYY");
      }
      if (end) {
        $rootScope.enddate = moment(end).format("MMMM Do YYYY");
      }
    };
    // Clear activity data
    $scope.clearAll = function() {
      $scope.activity = {};
    };
    // Search data list
    $scope.searchdata = function(data) {
      console.log(data);
      $ionicLoading.hide();
      $scope.activities = [];

      if (isEmpty($rootScope.searchData)) {
        $rootScope.searching = false;
      }else{
        $rootScope.searching = true;
        $rootScope.workorderflag = true;
        $rootScope.refresh = false;
      }

      if (data.startdate != undefined && data.enddate == undefined) {
        $scope.alertPop("Alert", 'Please select End Date');
        return;
      }

      if (data.startdate == undefined && data.enddate != undefined) {
        $scope.alertPop("Alert", 'Please select Start Date');
        return;
      }

      if (data.startdate != undefined && data.enddate != undefined) {
        var d = moment(data.startdate).diff(moment(data.enddate), 'days')
        if (d > 0) {            
          $scope.alertPop("Alert", 'Invalid date.'); 
          return;
        }
        data.startdate = new Date(data.startdate).toISOString();
        data.enddate = new Date(data.enddate).toISOString();
      }

        // data.number_of_pages = 10;
        // data.current_page = 1;

        if ($rootScope.searchData == undefined) {
          $rootScope.searchData = {
            "title" : data.title,
            "type" : data.type,
            "created_by" : data.created_by,
            "startdate" : data.startdate,
            "enddate" : data.enddate
          };
        }

        data.property_id = $localStorage.User.property_id,
        data.user_id = $localStorage.User.user_id,
        data.services_category_id = "59968018535167e485f8b12c"

        $scope.getList(10, 1);
      };
    // Load More List
    $scope.loadMoreList = function() {
      $scope.current_page++;
      $scope.getList(10, $scope.current_page);
    };
    // Get activity list
    $scope.getList(10, 1);
    $scope.showMyactivity = function(activity) {
      $location.path("activityDetails/" + activity);
    };
    console.log("Inside activity");
    $scope.goActivity = function() {
      $state.go("activityLogsList");
    };


  // Clear activity data
  $scope.clearAllData = function() {
    // $scope.modal.hide();
    $ionicLoading.hide();
    $scope.activity = {};
    $rootScope.searchData = {};    
    $rootScope.searching = false;
    $rootScope.startdate = '';
    $rootScope.enddate = '';
  };

  // Clear activity data
  $scope.resetData = function() {
    $scope.activities = [];
    $rootScope.searchData = {};
    $ionicLoading.hide();
    $scope.activity = {};
    $rootScope.searching = false;
    $rootScope.startdate = '';
    $rootScope.enddate = '';
    $scope.modal.hide();
    $scope.getList(10, 1);
  };


    /*========================================
    =            Get all unit IDs            =
    ========================================*/

    $scope.unitsList = [];
    $scope.predectiveTextList = [];
    var unitId = {
      property_id: $localStorage.User.property_id,
      token: $localStorage.User.token,
      cat_slug: localStorage.getItem("notifySpecific")
    };
    getUnitIdServices.getUnitId().save(unitId, function(res) {
      if (res.code == 200) {
        console.log(res);
        for (var i = 0; i < res.result.length; i++) {
          var data = {
            text: res.result[i].unit_number,
            value: res.result[i]._id
          }
          $scope.unitsList.push(data);
        }

        /*----------  Apply Natural Sort  ----------*/
        $scope.unitsList.sort(function (a,b) {
          return a.text.localeCompare(b.text, undefined, { numeric: true, sensitivity: 'base' });
        });

      } else if (res.code == 201) {
        $scope.alertPop("Alert", res.message, "staff_features");
      }
    }, function(err) {
      $ionicLoading.hide();
      console.log(err);
      $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
    });
    $scope.settings = {
      data: $scope.unitsList,
      filter: true,
      placeholder: 'Please Select ' + $rootScope.rise_unit_singleton + ' Number',
      theme: "ios-dark",
      animate: "slideup",
      display: "top"
    };
    $scope.settingspredectiveText = {
      data: $scope.predectiveTextList,
      filter: true,
      placeholder: 'Please Select Location',
      theme: "ios-dark",
      animate: "slideup",
      display: "bottom"
    };
    /*=====  End of Get all unit IDs  ======*/

    /*==========================================
}
=            Get all staff list            =
==========================================*/

$scope.stafflist = function() {
  if ($scope.isOnline() == true) {
    if ($rootScope.authoriedUser == true) {
      console.log("calling add activity service");
      $ionicLoading.show();
      activityService.staffList($localStorage.User.property_id).get(function(result) {
        console.log("staff list result- ", result);
        $ionicLoading.hide();
        if (result.code == 200) {
          console.log("staff results", result);
          $scope.stafflistData = result.data;
        } else {}
      }, function(err) {
        $ionicLoading.hide();
        console.log(err);
        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
      });
    } else {
      $ionicLoading.hide();
      $scope.logout();
    }
  } else {
    $ionicLoading.hide();
    $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
  }
};
if (true) {
  $scope.stafflist();
}
/*=====  End of Get all staff list  ======*/

$ionicPopover.fromTemplateUrl("templates/Staff/workorderManager/nwNewFormPredectiveText.html", {
  scope: $scope
}).then(function(popover) {
  console.log("popover", popover);
  $scope.popover = popover;
});
    //Cleanup the popover when we're done with it!
    $scope.$on("$destroy", function() {
      if ($scope.popover != undefined) {
        $scope.popover.remove();
      }
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
        console.log("wrkOrdService", res);
        if (res.code == 200) {
          $scope.predectiveText = res.result;
          for (var i = 0; i < res.result.length; i++) {
            var data = {
              text: res.result[i].text_name,
              value: res.result[i]._id
            }
            $scope.predectiveTextList.push(data);
          }
        } else {
          $scope.alertPop("Alert", "Something went wrong");
        }
      });
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal = "";
    };
    $scope.predectiveCall();
    $scope.setPromptText = function(text) {
      $scope.location = text;
      if ($scope.activity == null || $scope.activity == undefined) {
        $scope.activity = {
          location: text
        };
      } else {
        try {
          $scope.activity.location = text;
        } catch (e) {
          $scope.activity = {
            location: text
          };
        }
      }
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
                    //  var tempText = item.text_name.toLowerCase();
                    if (item.text_name.indexOf(text) >= 0) {
                      $scope.filteredText.push({
                        text_name: item.text_name
                      });
                    }
                  });
        } else {
          $scope.filteredText = [];
        }
      } else {
        $scope.filteredText = [];
      }
    };
    $scope.typeOptions = [{
      name: "Normal",
      value: 1
    }, {
      name: "Incident",
      value: 2
    }];
    $scope.activity = {
      // type: $scope.typeOptions[0].value
    };
    $scope.addActivity = function($isValid) {
      console.log("Add Activity");
      if ($isValid) {
        if ($scope.isOnline() == true) {
          if ($rootScope.authoriedUser == true) {
            console.log("calling add activity service");
            $ionicLoading.show();
                    // var data = {};
                    $scope.activity.content = $scope.activity.description;
                    $scope.activity.property_id = $localStorage.User.property_id;
                    $scope.activity.user_id = $localStorage.User.user_id;
                    if ($scope.activity.type == undefined || $scope.activity.type == '' || $scope.activity.type == null) {
                      $scope.activity.type = 1;
                    }
                    if ($scope.activity.type == 2) {
                      var data = {
                        property_id: $localStorage.User.property_id,
                        users_id: $localStorage.User.user_id,
                        created_by: $localStorage.User.user_id,
                        type: parseInt($scope.activity.type),
                        title: $scope.activity.title,
                        content: $scope.activity.description,
                        category: parseInt($scope.activity.category),
                        unit_id: $scope.activity.unit_id,
                        location: $scope.activity.location,
                        services_category_id: localStorage.getItem("services_category_id")
                      };
                    } else {
                      var data = {
                        property_id: $localStorage.User.property_id,
                        users_id: $localStorage.User.user_id,
                        created_by: $localStorage.User.user_id,
                        type: parseInt($scope.activity.type),
                        title: $scope.activity.title,
                        content: $scope.activity.description,
                        services_category_id: localStorage.getItem("services_category_id")
                      };
                    }
                    if ($scope.addImages != undefined && $scope.addImages != null) {
                      data.images = $scope.addImages;
                    }
                    activityService.addActivity().save(data, function(result) {
                      console.log("add activity result- ", result);
                      $ionicLoading.hide();
                      if (result.code == 200) {
                        $state.go("activityLogsList");
                      } else {
                        $scope.alertPop("Message", result.message ? result.message : "Failed");
                      }
                    }, function(err) {
                      $ionicLoading.hide();
                      console.log(err);
                      $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    });
                  } else {
                    $ionicLoading.hide();
                    $scope.logout();
                  }
                } else {
                  $ionicLoading.hide();
                  $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
                }
              }
            };
            $scope.showMyactivityDetails = function(activity) {
              $state.go("activityDetails", {
                activity: activity._id
              });
            };
    // =============================================================================
    // Keyboard Section Begins
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
    // =============================================================================
    // Keyboard Section Ends
    // =============================================================================
  });


function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}