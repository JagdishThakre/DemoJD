  app.controller('NotificationThreadCtrl', function($scope, $ionicListDelegate, $ionicSlideBoxDelegate, $cordovaImagePicker, reservationServices, $ionicPopover, wrkOrdService, $timeout, $state, $ionicModal, $ionicActionSheet, $cordovaCamera, $cordovaNetwork, $ionicPopup, $localStorage, $ionicHistory, getThread, $ionicLoading, replymessage, CONFIG, $cordovaDevice, $ionicScrollDelegate, $rootScope) {

      $scope.accepted = { status: "", ishide: true }
      $scope.commentimg = { 'caption': '' };
      // $scope.host_url = CONFIG.HTTP_HOST;
      $scope.host_url = $localStorage.baseURL;
      $scope.editComment = { text: '', id: '', oldText: '' };
      $scope.activeUser = $localStorage.User.user_id;
      $scope.editComment = { text: '', id: '', oldText: '' };
      $scope.hidePlus = localStorage.getItem('hideSlug');
      console.log("hhhhhh", localStorage.getItem('hideSlug'));
      $scope.isCancelrvst = false;

      /* @function : generateAvtarOnimageLoadError()
       *  @Creator  :Shivansh 
       *  @created  : 19012017
       */

      $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
      $scope.generateAvtarOnimageLoadError = function() {
              console.log("on error image called");
              $scope.showErrorImg = true;
          }
          //Function name : editComment
          //Use: This Function is to open the edit comment box
      $scope.editComment = function(id, text) {
          $ionicModal.fromTemplateUrl('templates/Staff/newsfeed/editComment.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.commentModal = modal;
              $scope.editComment.text = text;
              $scope.editComment.id = id;
              $scope.editComment.oldText = text;
              $scope.commentModal.show();
          });
      }

      $scope.closeEditModal = function() {
          $scope.commentModal.hide();
          $scope.commentModal = '';
      };
      //Function name : sendEditComment
      //Use: This Function is update the edited comment
      $scope.sendEditComment = function(text, id, oldText) {
              $scope.closeEditModal();
              if ($rootScope.authoriedUser == true) {
                  var comment_data = {
                      "service_id": $scope.notifythread._id,
                      "comment": text,
                      "service_comments_id": id,
                      "users_id": $localStorage.User.user_id,
                      "token": $localStorage.User.token,
                  }
                  if (oldText != text) {
                      $ionicLoading.show();
                      replymessage.editComment().save(comment_data, function(res) {
                          if (res.code == 200) {
                              $ionicLoading.hide();
                              $ionicListDelegate.closeOptionButtons();
                              angular.forEach($scope.threadData, function(item, key) {
                                  if (id == item._id) {
                                      item.message = text;
                                  }
                              });
                          } else if (res.code == 401) {

                          } else if (res.code == 201) {

                          }
                      }, function(err) { $ionicLoading.hide(); });
                  }
              } else {
                  $scope.logout();
              }
          }
          //Function name : deleteComment
          //Use: This Function is use to delete a particular comment
      $scope.deleteComment = function(id) {
          $ionicPopup.confirm({
              title: 'Alert',
              template: 'Are you sure you want to delete this comment ?',
              cssClass: 'my-custom-popup-staff'
          }).then(function(res) {
              if (res == true) {
                  if ($rootScope.authoriedUser == true) {
                      $ionicLoading.show();
                      var comment_data = {
                          "service_id": $scope.notifythread._id,
                          "service_comments_id": id,
                          "users_id": $localStorage.User.user_id,
                          "token": $localStorage.User.token,
                      }
                      replymessage.deleteComment().save(comment_data, function(res) {
                          if (res.code == 200) {
                              $ionicLoading.hide();
                              $scope.alertPop('Alert', res.message);
                              var index;
                              angular.forEach($scope.threadData, function(item, key) {
                                  if (id == item._id) {
                                      index = key;
                                  }
                              });
                              $scope.threadData.splice(index, 1);
                          }
                      }, function(err) {
                          $ionicLoading.hide();
                          console.log(err);
                          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                      });
                  } else {
                      $scope.logout();
                  }
              }
          });
      }

      $scope.openAttachment = function() {
          $ionicModal.fromTemplateUrl('templates/Resident/newsfeed/openAttachment.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.attachmentModal = modal;
              $scope.attachmentModal.show();
          });
      }
      $scope.closeAttachmentModal = function() {
          $scope.attachmentModal.hide();
          $scope.attachmentModal = '';
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
              }
              //if android version is morethan 6  or equal then  accessing permission
          var isAndroid = ionic.Platform.isAndroid();
          if (isAndroid && ionic.Platform.version() >= 6) {
              var permissions = cordova.plugins.permissions;
              permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null);

              function checkPermissionCallback(status) {
                  if (!status.hasPermission) {
                      var errorCallback = function() {
                          console.warn('Camera permission is not turned on');
                      }
                      permissions.requestPermission(
                          permissions.CAMERA,
                          function(status) {
                              if (!status.hasPermission) {
                                  errorCallback();
                              } else {
                                  $cordovaCamera.getPicture(options).then(function(imageData) {
                                      $scope.commentImages.push("data:image/jpeg;base64," + imageData);
                                      $scope.sendcommentImages();
                                  }, function(err) {
                                      console.log("error", err)
                                  });
                              }
                          },
                          errorCallback);
                  } else {
                      $cordovaCamera.getPicture(options).then(function(imageData) {
                          $scope.commentImages.push("data:image/jpeg;base64," + imageData);
                          $scope.sendcommentImages();
                      }, function(err) {
                          console.log("error", err)
                      });

                  }
              }

          } else {
              $cordovaCamera.getPicture(options).then(function(imageData) {
                  $scope.commentImages.push("data:image/jpeg;base64," + imageData);
                  $scope.sendcommentImages();
              }, function(err) {
                  console.log("error", err)
              });
          }
          //if android version is morethan 6  or equal then  accessing permission ends here
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
          $cordovaImagePicker.getPictures(option).then(function(results) {
              for (var i = 0; i < results.length; i++) {
                  var img = new Image();
                  img.crossOrigin = 'Anonymous';
                  img.onload = function() {
                      var canvas = document.createElement('CANVAS');
                      var ctx = canvas.getContext('2d');
                      var dataURL;
                      canvas.height = this.height;
                      canvas.width = this.width;
                      ctx.drawImage(this, 0, 0);
                      dataURL = canvas.toDataURL('image/jpeg');
                      $scope.commentImages.push(dataURL);
                      count++;
                      if (i == count) {
                          $scope.sendcommentImages();
                          count = 0;
                      }
                  }
                  img.src = results[i];
              }

          }, function(error) {});
      }
      $scope.sendcommentImages = function() {
          $scope.closeAttachmentModal();
          $ionicModal.fromTemplateUrl('templates/commentGallery.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.commentGallery = modal;
              $scope.commentGallery.show();
          });
      }
      $scope.replaycommentImages = function() {
          $ionicPopup.confirm({
              title: 'Alert',
              template: 'Are you sure you want to send this message?',
              cssClass: 'my-custom-popup-resi'
          }).then(function(res) {
              if (res == true) {
                  if ($rootScope.authoriedUser == true) {
                      $scope.closecommentGallery();
                      $ionicLoading.show();
                      var replydata = {
                          "service_id": $scope.notifythread._id,
                          "message": $scope.commentimg.caption,
                          "users_id": $localStorage.User.user_id,
                          "token": $localStorage.User.token,
                          "device_info": $scope.ConstantsInfo(),
                          "images": $scope.commentImages,
                          "user_type_id": $localStorage.User.user_type_id,
                          "property_id": $localStorage.User.property_id,
                          "services_category_id": localStorage.getItem("services_cat_id"),
                          "units_id": localStorage.getItem('partThrdUntId'),
                          "firstname": $localStorage.User.firstname,
                          "lastname": $localStorage.User.lastname
                      }
                      if ($scope.isOnline() == true) {
                          replymessage.replymessage().save(replydata, function(res) {
                              $ionicLoading.hide();
                              var sendObj = {};
                              sendObj.text = $scope.commentimg.caption;
                              sendObj.sendingDate = Date.now();
                              sendObj.images = $scope.commentImages;
                              $scope.sentText.push(sendObj);
                              $scope.staffName = $localStorage.User.firstname;
                              $scope.staffLastName = $localStorage.User.lastname;
                              $scope.prflImg = $localStorage.User.profile_img;
                              $scope.bgColor = $localStorage.User.color;
                              $scope.user_type_id = $localStorage.User.user_type_id;
                              $scope.prflImg = $localStorage.User.profile_img
                              $scope.staff = true;
                              $scope.resident = false;
                              $scope.commentimg = { 'caption': '' };
                              $ionicScrollDelegate.scrollTop(true);
                              $timeout(function() {
                                  $ionicScrollDelegate.scrollTop(true);
                              }, 300);
                          }, function(err) {
                              $ionicLoading.hide();
                              console.log(err);
                              $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                          })
                      } else {
                          $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
                      }
                  } else {
                      $scope.logout();
                  }
              } else {
                  $scope.commentimg = { 'caption': '' };
                  $ionicScrollDelegate.scrollTop(true);
                  $timeout(function() {
                      $ionicScrollDelegate.scrollTop(true);
                  }, 300);
              }
          });
      }
      $scope.closecommentGallery = function() {
          $scope.commentGallery.hide();
          $scope.commentGallery = '';
      }
      $scope.closeGaleryModal = function() {
          $scope.attachmentModal1.hide();
      }
      $scope.openImageZoom1 = function(images, index) {
          $scope.activeImageSlide = index;
          $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.attachmentModal1 = modal;
              $scope.previewImages = [];
              $scope.previewImages = images;
              $scope.attachmentModal1.show();
          });
      }
      $scope.openImageZoom = function(images, index) {
          $scope.previewImages = [];
          angular.forEach(images, function(item) {
              $scope.previewImages.push($scope.host_url + '/' + item.url);
          });
          $scope.activeImageSlide = index;
          $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.attachmentModal1 = modal;
              $scope.attachmentModal1.show();
          });
      }
      $scope.openimage = function(index) {
          $scope.previewImages = [];
          angular.forEach($scope.notifythread.images, function(item) {
              $scope.previewImages.push(item.url);
          });
          if ($scope.packimg) {
              $scope.previewImages.push($scope.packimg);

          }
          $scope.activeImageSlide = index;
          $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.attachmentModal1 = modal;
              $scope.attachmentModal1.show();
          });
      }


      //**********************************************8************************************
      //******************************Footer start******************************************
      //************************************************************************************
      var footerBar; // gets set in $ionicView.enter
      var scroller;
      var txtInput; // ^^^

      $scope.loadtaskView = function() {
          $timeout(function() {
              footerBar = document.body.querySelector('#userMessagesView .bar-footer');
              scroller = document.body.querySelector('#userMessagesView .scroll-content');
              txtInput = angular.element(footerBar.querySelector('textarea'));
          }, 0);
      }
      var keyboardHeight = 0;
      window.addEventListener('native.keyboardshow', keyboardShowHandler);
      window.addEventListener('native.keyboardhide', keyboardHideHandler);

      function keyboardShowHandler(e) {
          keyboardHeight = e.keyboardHeight;
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      }

      function keyboardHideHandler(e) {
          keyboardHeight = 0;
          $timeout(function() {
              cordova.plugins.Keyboard.close()
          }, 0);
      }

      // I emit this event from the monospaced.elastic directive, read line 480
      // For iOS you will need to add the keyboardHeight to the scroller.style.bottom
      $scope.$on('taResize', function(e, ta) {
          if (!ta) return;
          var taHeight = ta[0].offsetHeight;
          if (!footerBar) return;
          var newFooterHeight = taHeight + 10;
          newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
          footerBar.style.height = newFooterHeight + 'px';
          if (ionic.Platform.platform() == 'ios') {

              scroller.style.bottom = newFooterHeight + keyboardHeight + 'px';
              //  alert(scroller.style.bottom);
          } else {
              scroller.style.bottom = newFooterHeight + 'px';
          }
          $ionicScrollDelegate.scrollTop(true);
      });

      ///**********************************************8************************************
      //******************************Footer end******************************************
      //************************************************************************************


      $ionicScrollDelegate.scrollTop(true);


      $ionicPopover.fromTemplateUrl('templates/Resident/quicktext.html', {
          scope: $scope,
      }).then(function(popover) {
          $scope.popover = popover;
      });
      //   $scope.replyMsgs = [{text:'Ok let them in'},{text:'Please send them after 5 mins'},{text:'I am not at home'},{text:'Will collect tommorow '},{text:'Please deliver to my place'}];
      $scope.replyMsgs = [];
      $scope.imageSrc = '';
      $scope.openModal = function(img) {
          $scope.previewImages = [];
          $scope.previewImages.push($scope.host_url + '/' + img);
          $scope.activeImageSlide = 0;
          $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.attachmentModal1 = modal;
              $scope.attachmentModal1.show();
          });
      };

      $scope.closeModal = function() {
          $scope.modal.hide();
          $scope.modal = '';
      };

      $scope.replyObj = {};
      $scope.sentText = new Array();
      $scope.retrievedText = new Array();
      $scope.retrievedDate = new Array();
      $scope.residentName = [];
      $scope.residentLastName = []
      $scope.retrievedId = [];
      $scope.residentImage = [];
      $scope.staff_id = $localStorage.User.user_type_id;
      $scope.sentDate = new Array();
      $scope.notifythread = {};
      $scope.srcImages = [];
      $scope.promptmsg = [];

      $scope.callthread = function() {
          if ($rootScope.authoriedUser == true) {
              var threadData = {
                  "token": $localStorage.User.token,
                  "service_id": localStorage.getItem("service_id"),
                  "make_true": localStorage.getItem('makeTrue'),
                  "property_id": $localStorage.User.property_id,
                  "users_id": $localStorage.User.user_id,
                  "service": true
              }
              if ($scope.isOnline() == true) {
                  $ionicLoading.show();
                  getThread.thread().save(threadData, function(res) {
                      console.log("RES: ", res);

                      if (res.service_data.services_category_id.name == "Reservations") {
                          $scope.header = 'Reservation Details';
                          console.log($scope.header);
                      } else {
                          $scope.header = 'Service Details';
                      }
                      $ionicLoading.hide();
                      $scope.services_category_id = res.service_data.services_category_id;
                      $ionicLoading.show();
                      $scope.notifythread = res.service_data;
                      if (res.service_data.package_images) {
                          $scope.packimg = $scope.host_url + '/' + res.service_data.package_images;

                      }
                      console.log("$scope.packimg", $scope.packimg);


                      console.log($scope.header + ": ", $scope.notifythread);
                      var currenttime = new Date();
                      if (moment(currenttime).isAfter(moment($scope.notifythread.item_estimated_time))) {
                          $scope.exceedtime = true;
                      } else {
                          $scope.exceedtime = false;
                      }
                      $scope.serviceCreatedDate = moment(res.service_data.created).format("hh:mm A [on] MMM Do, YYYY");
                      $scope.taskdata = res.task_data;

                      var timefromtz = moment($scope.notifythread.timefrom).tz(localStorage.getItem('timezone'));
                      $scope.timeFromFormatted = timefromtz.format('MMM Do, YYYY');
                      $scope.timefromCal = timefromtz.format("hh:mm A");
                      var timeTotz = moment($scope.notifythread.timeto).tz(localStorage.getItem('timezone'));
                      $scope.timetoCal = timeTotz.add(1, 'minutes').format("hh:mm A");

                      //Service Rating Begin
                      $scope.ratingArr = [{
                          value: 1,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 2,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 3,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 4,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 5,
                          icon: 'ion-ios-star-outline'
                      }];

                      if ($scope.notifythread.rating) {
                          var rating = parseInt($scope.notifythread.rating);
                          var rtgs = $scope.ratingArr;
                          for (var i = 0; i < rating; i++) {
                              if (i < rating) {
                                  rtgs[i].icon = 'ion-ios-star';
                              } else {
                                  rtgs[i].icon = 'ion-ios-star-outline';
                              }
                          };
                      }
                      //Service Rating End

                      //$scope.timetoCal = moment($scope.notifythread.timeto).add(1, 'minutes').format("hh:mm A");
                      $scope.threadData = res.thread_data;
                      angular.forEach($scope.notifythread.images, function(item) {
                          item.url = $scope.host_url + '/' + item.url;
                      });
                      angular.forEach($scope.threadData, function(item) {
                          var date = moment(item.created).format("MMM Do, YYYY");
                          item.createdDate = date;
                      });
                      for (var $i = 0; $i < res.prompt_messages.length; $i++) {
                          $scope.replyMsgs[$i] = res.prompt_messages[$i];
                          console.log($scope.replyMsgs[$i]);
                      };
                      $ionicLoading.hide();
                      $ionicScrollDelegate.scrollTop(true);
                  }, function(err) {
                      $ionicLoading.hide();
                      $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                      $scope.$broadcast('scroll.refreshComplete');
                  })
              } else {
                  $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
              }
          } else {
              $scope.logout();
          }
      };

      /*******************WorkorderDetailsPage********************************/

      $scope.workOrderDetails = function() {
          if ($rootScope.authoriedUser == true) {
              var workOrderDetailData = {
                  "token": $localStorage.User.token,
                  "service_id": localStorage.getItem("service_id"),
                  "make_true": localStorage.getItem('makeTrue'),
                  "property_id": $localStorage.User.property_id,
                  "users_id": $localStorage.User.user_id
              }
              if ($scope.isOnline() == true) {
                  $ionicLoading.show();
                  getThread.woThreadData().save(workOrderDetailData, function(res) {
                      console.log("WODetails Res", res);
                      $ionicLoading.hide();
                      $scope.services_category_id = res.service_data.services_category_id;

                      $scope.notifythread = res.service_data;
                      $scope.amount = (res.service_data.estimation.length > 0) ? res.service_data.estimation[0].cost : 0;
                      $scope.serviceCreatedDate = moment(res.service_data.created).format("hh:mm A [on] MMM Do, YYYY");
                      $scope.taskdata = res.task_data;
                      console.log($scope.notifythread.estimation[0]);
                      if ($scope.notifythread.estimation.length > 0) {
                          if ($scope.notifythread.estimation[0].accepted == 1 || $scope.notifythread.estimation[0].accepted == 2) {
                              $scope.accepted.ishide = true;
                              console.log('test', $scope.accepted.ishide);
                          } else {
                              $scope.accepted.ishide = false;
                          }
                      } else {
                          $scope.accepted.ishide = true;
                      }

                      console.log($scope.notifythread);
                      if ($scope.notifythread.Started_Date) { $scope.Started_Date = moment($scope.notifythread.Started_Date).format("ddd, MMM Do, YYYY [at] hh:mm A"); }
                      if ($scope.notifythread.service_close_date) { $scope.service_close_date = moment($scope.notifythread.service_close_date).format("ddd, MMM Do, YYYY [at] hh:mm A"); }
                      if ($scope.notifythread.Re_Opened_Date) { $scope.Re_Opened_Date = moment($scope.notifythread.Re_Opened_Date).format("ddd, MMM Do, YYYY [at] hh:mm A"); }
                      $scope.threadData = res.thread_data;
                      angular.forEach($scope.notifythread.images, function(item) {
                          item.url = $scope.host_url + '/' + item.url;
                      });
                      angular.forEach($scope.threadData, function(item) {
                          var date = moment(item.created).format("MMM Do, YYYY");
                          item.createdDate = date;
                      });

                      //Service Rating Begin
                      $scope.ratingArr = [{
                          value: 1,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 2,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 3,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 4,
                          icon: 'ion-ios-star-outline'
                      }, {
                          value: 5,
                          icon: 'ion-ios-star-outline'
                      }];

                      $scope.showRatingMessage = false;
                      if ($scope.notifythread.rating) {
                          $scope.showRatingMessage = true;
                          var rating = parseInt($scope.notifythread.rating);
                          var rtgs = $scope.ratingArr;
                          for (var i = 0; i < rating; i++) {
                              if (i < rating) {
                                  rtgs[i].icon = 'ion-ios-star';
                              } else {
                                  rtgs[i].icon = 'ion-ios-star-outline';
                              }
                          };
                      }
                      //Service Rating End

                      $ionicLoading.hide();
                      $ionicScrollDelegate.scrollTop(true);
                  }, function(err) {
                      $ionicLoading.hide();
                      console.log(err);
                      $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                      $scope.$broadcast('scroll.refreshComplete');
                  })
              } else {
                  $scope.alertPopResi(CONFIG.connecterr, CONFIG.connerrmsg);
              }
          } else {
              $scope.logout();
          }
      }

      //Workorder rating begin


      //Set the rating in scope and save in backend when resident selects a rating
      $scope.setRating = function(val, data) {
          var rtgs = $scope.ratingArr;
          var ratingData = {
              "service_id": data._id,
              "rating": val
          };
          wrkOrdService.addRating().save(ratingData, function(res) {
              $ionicLoading.show();
              console.log(res.message);
              if (res.code === 200) {
                  $ionicLoading.hide();
                  for (var i = 0; i < rtgs.length; i++) {
                      if (i < val) {
                          rtgs[i].icon = 'ion-ios-star';
                      } else {
                          rtgs[i].icon = 'ion-ios-star-outline';
                      }
                  };
                  $scope.showRatingMessage = true;
              }
              if (res.code === 401) {
                  $scope.alertPop('Alert', res.message);
              }
          }, function(err) {
              $ionicLoading.hide();
              console.log(err);
              $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
          })
      }

      //Set rating end

      $scope.approveEstimate = function(data) {
          $ionicPopup.confirm({
              title: 'Alert',
              cssClass: 'my-custom-popup-resi',
              template: 'Are you sure you want to approve this estimate?'
          }).then(function(res) {
              if (res) {
                  if ($rootScope.authoriedUser == true) {
                      $ionicLoading.show();
                      console.log("Data: ", data);
                      var approveData = {
                          "tasks_id": data.estimation[0].tasks_id,
                          "service_id": data._id,
                          "users_id": $localStorage.User.user_id,
                          "token": $localStorage.User.token,
                          "accepted": 1,
                          "firstname": $localStorage.User.firstname,
                          "lastname": $localStorage.User.lastname
                      }
                      console.log("approveData", approveData);
                      wrkOrdService.approveEstimate().save(approveData, function(res) {
                          $ionicLoading.hide();
                          console.log(res);
                          $scope.alertPopResi('Alert', res.message);
                          $scope.accepted.status = "yes";
                          $scope.accepted.ishide = true;
                      }, function(err) {
                          $ionicLoading.hide();
                          console.log(err);
                          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                      })
                  } else {
                      $scope.logout();
                  }
              }
          });

      }
      $scope.denyEstimate = function(data) {
          $ionicPopup.confirm({
              title: 'Alert',
              cssClass: 'my-custom-popup-resi',
              template: 'Are you sure you want to reject this estimate and request closing the workorder?'
          }).then(function(res) {
              if (res) {
                  if ($rootScope.authoriedUser == true) {
                      $ionicLoading.show();
                      console.log(data)
                      var approveData = {
                          "tasks_id": data.estimation[0].tasks_id,
                          "service_id": data._id,
                          "users_id": $localStorage.User.user_id,
                          "token": $localStorage.User.token,
                          "accepted": 2,
                          "firstname": $localStorage.User.firstname,
                          "lastname": $localStorage.User.lastname
                      }
                      wrkOrdService.approveEstimate().save(approveData, function(res) {
                          $ionicLoading.hide();
                          console.log(res);
                          $scope.alertPopResi('Alert', res.message);
                          $scope.accepted.status = "no";
                          $scope.accepted.ishide = true;
                      }, function(err) {
                          $ionicLoading.hide();
                          console.log(err);
                          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                      })
                  } else {
                      $scope.logout();
                  }
              }
          });
      }

      /*******************WorkorderDetailsPage Function Ends********************************/



      $scope.goback = function(slug) {
          $ionicHistory.goBack(-1);
      }


      $scope.setPromptText = function(text) {
          $scope.replyObj.replytext = text;
          $scope.popover.hide();
      }

      $scope.reply = function(text, index) {
          if ($rootScope.authoriedUser == true) {
              $ionicLoading.show();
              var replydata = {
                  "service_id": $scope.notifythread._id,
                  "message": text,
                  "users_id": $localStorage.User.user_id,
                  "token": $localStorage.User.token,
                  "device_info": $scope.ConstantsInfo(),
                  "images": [],
                  "user_type_id": $localStorage.User.user_type_id,
                  "property_id": $localStorage.User.property_id,
                  "services_category_id": $scope.services_category_id._id,
                  "units_id": $localStorage.User.units_id,
                  "firstname": $localStorage.User.firstname,
                  "lastname": $localStorage.User.lastname
              }
              console.log(replydata);
              replymessage.replymessage().save(replydata, function(res) {
                      $ionicLoading.hide();
                      //$scope.updateEditor($scope.replyObj.replytext);
                      $ionicScrollDelegate.scrollTop(true);
                      $timeout(function() {
                          $ionicScrollDelegate.scrollTop(true);
                      }, 300);
                      var sendObj = {};
                      sendObj.text = $scope.replyObj.replytext;
                      sendObj.sendingDate = Date.now();
                      sendObj.images = [];
                      $scope.sentText.push(sendObj);
                      $scope.replyObj.replytext = '';
                      //$scope.sentText[index] = text;
                      $scope.staffName = $localStorage.User.firstname;
                      $scope.staffLastName = $localStorage.User.lastname;
                      $scope.prflImg = $localStorage.User.profile_img;
                      $scope.bgColor = $localStorage.User.color;
                      $scope.user_type_id = $localStorage.User.user_type_id;
                      //$scope.sentDate[index] = Date.now();
                      $scope.staff = true;
                      $scope.resident = false;
                  }, function(err) {
                      $ionicLoading.hide();
                      console.log(err);
                      $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                  })
                  //$scope.replyObj.replytext = '';
              $ionicScrollDelegate.scrollTop(true);
              $timeout(function() {
                  $ionicScrollDelegate.scrollTop(true);
              }, 300);

          } else {
              $scope.logout();
          }
      }

      $scope.cancelReservation = function(data) {
          $ionicPopup.confirm({
              title: 'Alert',
              cssClass: 'my-custom-popup-resi',
              template: 'Are you sure you want to request cancellation for this reservation?'
          }).then(function(res) {
              if (res) {
                  if ($rootScope.authoriedUser == true) {
                      $ionicLoading.show();
                      var cancelData = {
                          "id": data._id,
                          "firstname": $localStorage.User.firstname,
                          "lastname": $localStorage.User.lastname,
                          "timefrom": data.timefrom,
                          "timeto": data.timeto,
                          "unit_number": data.units_id.unit_number,
                          "property_name": data.property_reservation_id.name,
                          "users_id": $localStorage.User.user_id,
                          "timezone": localStorage.getItem('timezone')
                      }
                      console.log(cancelData);
                      reservationServices.reservationCancel().save(cancelData, function(res) {
                          $ionicLoading.hide();
                          if (res.code = 200) {
                              $scope.alertPopResi('Alert', res.message, "rvstStartPg");
                              $scope.isCancelrvst = true;
                          } else {
                              console.log(sorry);
                          }
                      }, function(err) {
                          $ionicLoading.hide();
                          console.log(err);
                          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
                      })
                  } else {
                      $scope.logout();
                  }
              } else {}
          });
      }
  })
