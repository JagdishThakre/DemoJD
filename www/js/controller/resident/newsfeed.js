app.controller("NewsfeedCtrl", function(
  $scope,
  $state,
  $rootScope,
  $ionicListDelegate,
  $ionicModal,
  CONFIG,
  $cordovaImagePicker,
  newsFeedServices,
  $ionicHistory,
  $ionicPopup,
  $ionicFilterBar,
  $localStorage,
  $cordovaCamera,
  $ionicLoading,
  $ionicScrollDelegate,
  $ionicPopover,
  $timeout,
  PollService,
  $ionicSlideBoxDelegate,
  getDynamicFeatures,
  $cordovaFileTransfer,
  $cordovaFileOpener2,
  residentActionSheet,
  $ionicActionSheet,
  $ionicPlatform
) {
  $scope.settings = {
    theme: "ios-dark"
  };

  if (ionic.Platform.platform() == "ios") {
    $scope.newsformsettings = {
      theme: "ios-dark",
      tap: false
    };
  } else if (ionic.Platform.platform() == "android") {
    $scope.newsformsettings = {
      theme: "android-holo",
      tap: false
    };
  } else if (ionic.Platform.platform() == "macintel") {
    $scope.newsformsettings = {
      theme: "ios-dark",
      tap: false
    };
    console.log("Default Mac Browser Theme");
  } else {
    $scope.newsformsettings = {
      theme: "material-dark",
      tap: false
    };
    console.log("Default Theme");
  }

  $scope.nsfeedcmntlist = [
    { name: "jasica", show: false },
    { name: "Doreman", show: false },
    { name: "jasica", show: false },
    { name: "jasica", show: false }
  ];
  $scope.replay_comment = "";
  $scope.topic = { title: "", description: "", photos: [], existinImages: [] };
  $scope.imageSrc = "";
  $scope.news = { category: localStorage.getItem("newsIndex") };
  $scope.host_url = $localStorage.baseURL;
  $scope.data = { poll_vote: "" };
  $scope.multiOption = [];
  $scope.isStatistics = true;
  $scope.globalMessages = [];
  $scope.resultedMsgs = [];
  $scope.initCount = 0;
  $scope.msgLength = 0;
  $scope.noMoreItemsAvailable = false;
  $scope.page_number = "0";
  $scope.polls_list = [];
  $scope.news_list = [];
  $scope.newsDetails;
  $scope.replyObj = { replytext: "" };
  $scope.sentText = [];
  $scope.sentDate = [];
  $scope.deletedNewsImages = [];
  $scope.activeUser = $localStorage.User.user_id;
  $scope.commentimg = { caption: "" };
  // $scope.search = { title: localStorage.getItem('searchValue') };
  $scope.search = {};

  $scope.comment_id = "";
  /* @function : generateAvtarOnimageLoadError()
       *  @Creator  :Shivansh 
       *  @created  : 19012017
       */

  $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
  $scope.generateAvtarOnimageLoadError = function() {
    console.log("on error image called");
    $scope.showErrorImg = true;
  };
  $scope.scrollopt = function() {
    if (
      $scope.search.title == "" &&
      localStorage.getItem("searchValue") != ""
    ) {
      $scope.searchResult();
      $scope.searchShow = false;
    }
  };

  $scope.clearsearchfield = function() {
    console.log("clearing it");
    $scope.search.title = "";
  };

  /*Function to get feature*/
  $scope.featureNote = function() {
    $ionicLoading.show();

    if (localStorage.getItem("newsfeedcategoryforpost"))
      $scope.newsfeedcategoryforpost = localStorage.getItem(
        "newsfeedcategoryforpost"
      );

    if ($rootScope.authoriedUser == true) {
      var featureData = {
        users_id: $localStorage.User.user_id,
        user_type: $localStorage.User.user_type_id,
        token: $localStorage.User.token
      };
      console.log("featureData", featureData);
      getDynamicFeatures.features().save(
        featureData,
        function(res) {
          console.log("dynamic feature", res);
          $ionicLoading.hide();
          if (res.code == 200) {
            $scope.subNewsFeatures = res.data;
            console.log("$scope.subNewsFeatures", $scope.subNewsFeatures);
          } else {
            console.log("Error happened");
            $scope.alertPopResi("Error", "Some thing went wrong");
          }
        },
        function(err) {
          $ionicLoading.hide();
          console.log("err", err);
        }
      );
    } else {
      $scope.logout();
    }
  };

  $scope.changeNewsFeed = function(note) {
    localStorage.setItem("mid", JSON.stringify(note));
    if (note._id == "56a9e78bd42aba0fd731b1df") {
      console.log(note._id);
      $state.go("managementNews");
    } else if (note._id == "56ab40b8d42aba0fd731b1e4") {
      console.log(note._id);
      $state.go("managementPoll");
    } else if (note._id == "5787386661f925afa18240c4") {
      console.log(note._id);
      $state.go("managementEmergency");
    }
  };

  $scope.changeNewsFeedResident = function(note) {
    localStorage.setItem("mid", JSON.stringify(note));
    if (note._id == "5787389761f925afa18240c5") {
      localStorage.setItem("newsfeedcategoryforpost", "1");
      $state.go("tab-general.general");
    } else if (note._id == "578738bc61f925afa18240c6") {
      localStorage.setItem("newsfeedcategoryforpost", "2");
      $state.go("tab-marketplace.marketplace");
    }
  };

  $scope.newsHome = 0;
  $scope.newsResiSub = 0;
  $scope.newsMangSub = 0;
  // function to get dynamicfeturelist service
  $scope.subNewsFeeds = function() {
    $ionicLoading.show();
    if ($rootScope.authoriedUser == true) {
      console.log("residentActionSheet", residentActionSheet);
      $scope.newsfeedSubFetures = [];
      angular.forEach(residentActionSheet.data, function(item) {
        if (
          item.service_category_id._id == "578737d961f925afa18240c3" ||
          item.service_category_id._id == "578737b261f925afa18240c2"
        ) {
          $scope.newsHome += 1;
        }
        if (
          item.service_category_id._id == "5787389761f925afa18240c5" ||
          item.service_category_id._id == "578738bc61f925afa18240c6"
        ) {
          $scope.newsResiSub += 1;
        }
        if (
          item.service_category_id._id == "5787386661f925afa18240c4" ||
          item.service_category_id._id == "56ab40b8d42aba0fd731b1e4" ||
          item.service_category_id._id == "56a9e78bd42aba0fd731b1df"
        ) {
          $scope.newsMangSub += 1;
        }

        console.log("====" + item.service_category_id.name + "====");
        if (item.service_category_id._id == "578737d961f925afa18240c3") {
          if ($rootScope.user_permissions.Resident) {
            item.service_category_id.name = $rootScope.rise_property;
            $scope.newsfeedSubFetures.push(item);
            console.log("Resident");
          }
        } else if (item.service_category_id._id == "578737b261f925afa18240c2") {
          if ($rootScope.user_permissions.Management) {
            $scope.newsfeedSubFetures.push(item);
            console.log("Management");
          }
        } else if (item.service_category_id._id == "578738bc61f925afa18240c6") {
          if ($rootScope.user_permissions.Marketplace) {
            $scope.newsfeedSubFetures.push(item);
            console.log("Marketplace");
          }
        } else if (item.service_category_id._id == "56ab40b8d42aba0fd731b1e4") {
          if ($rootScope.user_permissions.Polls) {
            $scope.newsfeedSubFetures.push(item);
            console.log("Polls");
          }
        } else if (item.service_category_id._id == "5787389761f925afa18240c5") {
          if ($rootScope.user_permissions.General) {
            $scope.newsfeedSubFetures.push(item);
            console.log("General");
          }
        } else if (item.service_category_id._id == "5787386661f925afa18240c4") {
          if ($rootScope.user_permissions.Emergency) {
            $scope.newsfeedSubFetures.push(item);
            console.log("Emergency");
          }
        } else if (item.service_category_id._id == "56a9e78bd42aba0fd731b1df") {
          if ($rootScope.user_permissions.News) {
            $scope.newsfeedSubFetures.push(item);
            console.log("News");
          }
        }
      });
      console.log(
        $scope.newsHome +
          " -- " +
          $scope.newsResiSub +
          "--" +
          $scope.newsMangSub
      );
      // $scope.newsfeedSubFetures = residentActionSheet.data;

      $ionicLoading.hide();
    } else {
      $scope.logout();
      $ionicLoading.hide();
    }
  };
  // function to get dynamicfeturelist service ends here
  $scope.callTabs = function() {
    $scope.showMarketPlace = localStorage.getItem("showMarketPlace");
    $scope.showGeneral = localStorage.getItem("showGeneral");
    //alert($scope.showMarketPlace);
    //alert($scope.showGeneral);
  };

  $scope.goTab = function(stateGo) {
    console.log("stateGo", stateGo);
    if (stateGo.slug == "rsdnt") {
      $state.go("resident");
    } else if (stateGo.slug == "mngmnt") {
      $state.go("management");
    }
    $ionicLoading.show();
    localStorage.setItem("searchValue", "");
    var featureData = {
      users_id: $localStorage.User.user_id,
      user_type: $localStorage.User.user_type_id,
      token: $localStorage.User.token
    };
    console.log("featureData", featureData);
    getDynamicFeatures.features().save(
      featureData,
      function(res) {
        console.log("ToshowTabdata", res);
        $scope.showTabdats = res.data;
        $ionicLoading.hide();
        angular.forEach(res.data, function(item) {
          if (item.service_category_id.name == "General") {
            localStorage.setItem("showGeneral", true);

            $scope.showGeneral = localStorage.getItem("showGeneral");
            // console.log("Have genereal");

            $scope.myFunctionName = function() {
              if (item.service_category_id.name == "General") {
                return "ng-show='false'";
              } else {
                return "ng-hide='true'";
              }
            };
          } else {
            // console.log("No  genereal");
          }
          if (item.service_category_id.name == "Marketplace") {
            localStorage.setItem("showMarketPlace", true);
            $scope.showMarketPlace = localStorage.getItem("showMarketPlace");
            console.log("Have Marketplace");
          } else {
            // console.log("No Marketplace")
          }
        });
        setTimeout(function() {
          $scope.callTabs();
          $scope.showPost = true;
          $state.go(stateGo);
        });
      },
      function(err) {
        $ionicLoading.hide();
        console.log("err", err);
      }
    );
  };
  $scope.toggleSearch = function() {
    $scope.searchShow = !$scope.searchShow;
  };
  $scope.searchResult = function() {
    $scope.page_number = "0";
    $scope.msgLength = 0;
    $ionicLoading.show();
    localStorage.setItem("searchValue", $scope.search.title);
    if (localStorage.getItem("newsIndex") == 4) {
      $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
    } else if (localStorage.getItem("newsIndex") == 3) {
      $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
    } else if (localStorage.getItem("newsIndex") == 1) {
      $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
    } else if (localStorage.getItem("newsIndex") == 2) {
      $scope.newsResiSubfeaureId = "5787386661f925afa18240c4";
    }
    var getNewsData = {
      token: $localStorage.User.token,
      property_id: $localStorage.User.property_id,
      users_id: $localStorage.User.user_id,
      user_type_id: localStorage.getItem("usertype"),
      category: localStorage.getItem("newsIndex"),
      page_number: $scope.page_number,
      my_posts: localStorage.getItem("mypost") == "true" ? true : false,
      // "search_title": localStorage.getItem('searchValue'),
      search_title: $scope.search.title,

      services_category_id: $scope.newsResiSubfeaureId
    };

    $scope.news_list = [];
    $scope.getNewsList(getNewsData);
  };
  ///////////////////////////////////////////////////////////////////////////////////
  /////////////////////This is starting point for Poll section ///////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  //Function Name: doRefresh
  //It is used for refresh the poll list
  $scope.doRefresh = function() {
    if ($rootScope.authoriedUser == true) {
      $scope.page_number = "0";
      $scope.msgLength = 0;
      var pollData = {
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        page_number: $scope.page_number
      };
      if ($scope.isOnline() == true) {
        PollService.getPollList().save(
          pollData,
          function(res) {
            $ionicLoading.hide();
            if (res.code == 200) {
              if (res.result.length != 0) {
                //$scope.polls_list = res.result;
                angular.forEach(res.result, function(item) {
                  var pollCount = 0;
                  angular.forEach(res.count_data, function(val) {
                    if (item._id == val._id) {
                      pollCount = val.count;
                    }
                  });
                  item.unreadthreadPollVal = pollCount;
                  $scope.polls_list.push(item);
                });
                localStorage.setItem("infiCount", res.list_count);
                $scope.loadContent = localStorage.getItem("infiCount");
                if ($scope.msgLength == undefined) {
                  $scope.msgLength = res.result.length;
                } else {
                  $scope.msgLength = $scope.msgLength + res.result.length;
                }
                if ($scope.msgLength == $scope.loadContent) {
                  $scope.noMoreItemsAvailable = true;
                } else {
                  $scope.noMoreItemsAvailable = false;
                }
              }
            } else if (res.code == 201) {
              $scope.alertPopResi("Alert", res.message, "features");
            }
            $scope.$broadcast("scroll.refreshComplete");
            setTimeout(function() {
              $scope.page_number = parseInt($scope.page_number) + 1;
            });
          },
          function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      }
    } else {
      $scope.logout();
    }
  };

  //Function Name: loadPollList
  //It is used for load the poll list
  $scope.loadPollList = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var pollData = {
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        page_number: $scope.page_number
      };
      PollService.getPollList().save(
        pollData,
        function(res) {
          $ionicLoading.hide();
          console.log("polllist", res);
          if (res.code == 200) {
            if (res.result.length > 0) {
              angular.forEach(res.result, function(item) {
                var pollCount = 0;
                angular.forEach(res.count_data, function(val) {
                  if (item._id == val._id) {
                    pollCount = val.count;
                  }
                });
                item.unreadthreadPollVal = pollCount;
                $scope.polls_list.push(item);
                //$scope.polls_list.push(item);
              });
            } else {
              $scope.alertPopResi("Alert", "Sorry you have no Polls");
            }
            localStorage.setItem("infiCount", res.list_count);
            $scope.loadContent = localStorage.getItem("infiCount");
            if ($scope.msgLength == undefined) {
              $scope.msgLength = res.result.length;
            } else {
              $scope.msgLength = $scope.msgLength + res.result.length;
            }
            if ($scope.msgLength == $scope.loadContent) {
              $scope.noMoreItemsAvailable = true;
            } else {
              $scope.noMoreItemsAvailable = false;
            }

            $scope.$broadcast("scroll.infiniteScrollComplete");
            setTimeout(function() {
              $scope.page_number = parseInt($scope.page_number) + 1;
            });
          } else if (res.code == 201) {
            $scope.alertPopResi("Alert", res.message, "features");
          }
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

  //Function Name: submitPollAnswer
  //It is used submiting the poll answer
  $scope.submitPollAnswer = function() {
    var selectedAnswer = [];
    if ($scope.poll_details.is_multiple) {
      angular.forEach($scope.multiOption, function(val, key) {
        if (val.isChecked) {
          selectedAnswer.push({ ans_id: val._id, answer: val.answer });
        }
      });
    } else {
      angular.forEach($scope.poll_details.options, function(val, key) {
        if (val._id == $scope.data.poll_vote) {
          selectedAnswer.push({ ans_id: val._id, answer: val.answer });
        }
      });
    }
    if ($rootScope.authoriedUser == true) {
      var submitPoll = {
        polls_id: $scope.poll_details._id,
        token: $localStorage.User.token,
        users_id: $localStorage.User.user_id,
        selectedAnswer: selectedAnswer
      };
      if (submitPoll.selectedAnswer.length <= 0) {
        $scope.alertPopResi("Alert", "please select any of the option");
      } else {
        $ionicLoading.show();
        //console.log("submitPoll",submitPoll)
        PollService.submitPoll().save(
          submitPoll,
          function(res) {
            if (res.code == 200) {
              $ionicLoading.hide();
              $scope.getPollDetails();
            }
          },
          function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      }
    } else {
      $scope.logout();
    }
  };

  //Function Name: showPollDetails
  //It is used to view the details of a poll
  $scope.showPollDetails = function(poll) {
    localStorage.setItem("pollDetails", poll._id);
    console.log(JSON.parse(localStorage.getItem("mid")));
    var parnt = JSON.parse(localStorage.getItem("mid"));
    if (poll.unreadthreadPollVal > 0) {
      for (var i = 0; i < residentActionSheet.data.length; i++) {
        console.log(residentActionSheet.data[i]);
        if (parnt.parent_id == residentActionSheet.data[i]._id) {
          if (
            residentActionSheet.data[i].notiCount != undefined &&
            residentActionSheet.data[i].notiCount != null &&
            residentActionSheet.data[i].notiCount > 0
          ) {
            residentActionSheet.data[i].notiCount =
              residentActionSheet.data[i].notiCount - poll.unreadthreadPollVal;
          }
        }
        if (parnt._id == residentActionSheet.data[i].service_category_id._id) {
          if (
            residentActionSheet.data[i].notiCount != undefined &&
            residentActionSheet.data[i].notiCount != null &&
            residentActionSheet.data[i].notiCount > 0
          ) {
            residentActionSheet.data[i].notiCount =
              residentActionSheet.data[i].notiCount - poll.unreadthreadPollVal;
          }
        }
      }
    }
    console.log("================================");
    $state.go("poll-details");
  };
  //Function Name: getPollDetails
  //This function is usded for get the poll details
  $scope.getPollDetails = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var pollDetails = {
        polls_id: localStorage.getItem("pollDetails"),
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        make_true: true
      };

      PollService.getpollDetails().save(
        pollDetails,
        function(res) {
          if (res.code == 200) {
            $ionicLoading.hide();
            $scope.isStatistics = res.statistics;
            if (!res.statistics) {
              $scope.poll_details = res.data;
              $scope.multiOption = [];
              angular.forEach($scope.poll_details.options, function(val, key) {
                val.isChecked = false;
                $scope.multiOption.push(val);
              });
            } else {
              $scope.statisticsData = [];
              $scope.staticQuestion = res.data.questions;
              angular.forEach(res.data.options, function(data) {
                var count = 0;
                angular.forEach(res.results, function(val) {
                  if (val._id == data._id) {
                    count = val.count;
                  }
                });
                $scope.statisticsData.push([
                  data.answer + " - " + count,
                  count
                ]);
              });
            }
          } else {
            console.log("Found some error");
          }
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
  //Function Name: loadMore
  //This function is load the more poll list just like pagination
  $scope.loadMore = function() {
    $scope.loadPollList();
  };
  ///////////////////////////////////////////////////////////////////////////////////
  /////////////////////This is end point for Poll section ///////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////
  /////////////////////This is Start point for News section /////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  //Function name : getclicked
  //this function used for open camera and click picture
  $scope.getclicked = function() {
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
        $scope.topic.photos.push("data:image/jpeg;base64," + imageData);
        $ionicScrollDelegate.scrollBottom(true);
      },
      function(err) {}
    );
  };
  //Function name : getselect
  //This function used for get picture from galery
  $scope.getselect = function() {
    var option = {
      maximumImagesCount: 4,
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

  //Function name : removeImg
  //This is used for remove an image from list
  $scope.removeImg = function(index) {
    $ionicPopup
      .confirm({
        title: "Alert",
        template: "Are you sure you want to delete this image?",
        cssClass: "my-custom-popup-resi"
      })
      .then(function(res) {
        if (res == true) {
          $scope.topic.photos.splice(index, 1);
          $ionicScrollDelegate.scrollBottom(true);
        }
      });
  };

  //Function name : submitNews
  //This function is used for sending the News details
  $scope.submitNews = function(newsfeedcategoryforpost) {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      if (newsfeedcategoryforpost == 1) {
        $scope.postNewsPostId = "5787389761f925afa18240c5";
      } else if (newsfeedcategoryforpost == 2) {
        $scope.postNewsPostId = "578738bc61f925afa18240c6";
      } else {
        console.log("didnt select any category");
      }
      var newsData = {
        title: $scope.topic.title,
        content: $scope.topic.description,
        images: $scope.topic.photos,
        category: $scope.news.category,
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        user_type_id: $localStorage.User.user_type_id,
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname,
        services_category_id: $scope.postNewsPostId
      };
      console.log("newsData", newsData);
      newsFeedServices.postNews().save(
        newsData,
        function(res) {
          if (res.code == 200) {
            $ionicLoading.hide();
            $scope.alertPopResi("Alert", res.message, "newsfeeds");
          }
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

  //Function name : cancelNews
  //This function is used for Cancelling the News
  $scope.cancelNews = function() {
    $ionicHistory.goBack(-1);
  };

  //Function name : changeTab
  //Use: This function is called after change the tab in news feed section
  $scope.changeTab = function(index, usertype, mypost) {
    $scope.searchShow =
      localStorage.getItem("searchValue") != "" ? true : false;
    $ionicLoading.show();
    if (index == 4) {
      $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
    } else if (index == 3) {
      $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
    } else if (index == 1) {
      $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
    } else if (index == 2) {
      $scope.newsResiSubfeaureId = "5787386661f925afa18240c4";
    }
    var getNewsData = {
      token: $localStorage.User.token,
      property_id: $localStorage.User.property_id,
      users_id: $localStorage.User.user_id,
      user_type_id: usertype,
      category: index,
      page_number: $scope.page_number,
      my_posts: mypost,
      // "search_title": localStorage.getItem('searchValue'),
      search_title: $scope.search.title,
      services_category_id: $scope.newsResiSubfeaureId
    };
    localStorage.setItem("newsIndex", index);
    localStorage.setItem("usertype", usertype);
    localStorage.setItem("mypost", mypost);
    $scope.getNewsList(getNewsData);
  };
  //Function name : getNewsList
  //Use: This is use for get all the new for general category
  $scope.getNewsList = function(data) {
    if ($rootScope.authoriedUser == true) {
      //console.log("reqFOr newlist", data)
      newsFeedServices.getNewsList().save(
        data,
        function(res) {
          console.log("newlist", res);
          if (res.code == 200) {
            $ionicLoading.hide();
            if (res.result.length > 0) {
              angular.forEach(res.result, function(item) {
                var newsListCount = 0;
                angular.forEach(res.count_data, function(val) {
                  if (item._id == val._id) {
                    console.log("val title", val.title);
                    newsListCount = val.count;
                  }
                });
                item.unreadthreadNewListVal = newsListCount;
                angular.forEach(item.images, function(item) {
                  item.url = $scope.host_url + "/" + item.url;
                });
                $scope.news_list.push(item);
              });
              // angular.forEach(res.result, function(item) {
              //     $scope.news_list.push(item);
              // });
              //console.log($scope.news_list);
            } else {
              $scope.alertPopResi("Alert", "Sorry you have no news");
            }
            localStorage.setItem("infiCount", res.list_count);
            $scope.loadContent = localStorage.getItem("infiCount");
            if ($scope.msgLength == undefined) {
              $scope.msgLength = res.result.length;
            } else {
              $scope.msgLength = $scope.msgLength + res.result.length;
            }
            if ($scope.msgLength == $scope.loadContent) {
              $scope.noMoreItemsAvailable = true;
            } else {
              $scope.noMoreItemsAvailable = false;
            }
            $scope.$broadcast("scroll.infiniteScrollComplete");
            setTimeout(function() {
              $scope.page_number = parseInt($scope.page_number) + 1;
            });
          } else {
          }
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
  //Function name : refreshNews
  //Use: This is use for Refresh the news list
  $scope.refreshNews = function() {
    if ($rootScope.authoriedUser == true) {
      $scope.news_list = [];
      $scope.page_number = "0";
      $scope.msgLength = 0;
      if (localStorage.getItem("newsIndex") == 4) {
        $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
      } else if (localStorage.getItem("newsIndex") == 3) {
        $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
      } else if (localStorage.getItem("newsIndex") == 1) {
        $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
      } else if (localStorage.getItem("newsIndex") == 2) {
        $scope.newsResiSubfeaureId = "5787386661f925afa18240c4";
      }
      var getNewsData = {
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        user_type_id: localStorage.getItem("usertype"),
        category: localStorage.getItem("newsIndex"),
        page_number: $scope.page_number,
        my_posts: localStorage.getItem("mypost") == "true" ? true : false,
        search_title: localStorage.getItem("searchValue"),
        services_category_id: $scope.newsResiSubfeaureId
      };
      if ($scope.isOnline() == true) {
        newsFeedServices.getNewsList().save(
          getNewsData,
          function(res) {
            $ionicLoading.hide();
            if (res.code == 200) {
              if (res.result.length != 0) {
                //$scope.news_list = res.result;
                angular.forEach(res.result, function(item) {
                  var newsListCount = 0;
                  angular.forEach(res.count_data, function(val) {
                    if (item._id == val._id) {
                      newsListCount = val.count;
                    }
                  });
                  angular.forEach(item.images, function(item) {
                    item.url = $scope.host_url + "/" + item.url;
                  });
                  item.unreadthreadNewListVal = newsListCount;
                  $scope.news_list.push(item);
                });
                localStorage.setItem("infiCount", res.list_count);
                $scope.loadContent = localStorage.getItem("infiCount");
                if ($scope.msgLength == undefined) {
                  $scope.msgLength = res.result.length;
                } else {
                  $scope.msgLength = $scope.msgLength + res.result.length;
                }
                if ($scope.msgLength == $scope.loadContent) {
                  $scope.noMoreItemsAvailable = true;
                } else {
                  $scope.noMoreItemsAvailable = false;
                }
              }
            } else if (res.code == 201) {
              $scope.alertPopResi("Alert", res.message, "features");
            }
            $scope.$broadcast("scroll.refreshComplete");
            setTimeout(function() {
              $scope.page_number = parseInt($scope.page_number) + 1;
            });
          },
          function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      }
    } else {
      $scope.logout();
    }
  };

  //Function name : loadMoreNews
  //Use: This is use for Load more news
  $scope.loadMoreNews = function() {
    var index = localStorage.getItem("newsIndex");
    if (index == 4) {
      $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
    } else if (index == 3) {
      $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
    } else if (index == 1) {
      $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
    } else if (index == 2) {
      $scope.newsResiSubfeaureId = "5787386661f925afa18240c4";
    }
    var getNewsData = {
      token: $localStorage.User.token,
      property_id: $localStorage.User.property_id,
      users_id: $localStorage.User.user_id,
      user_type_id: localStorage.getItem("usertype"),
      category: index,
      page_number: $scope.page_number,
      my_posts: localStorage.getItem("mypost") == "true" ? true : false,
      search_title: localStorage.getItem("searchValue"),
      services_category_id: $scope.newsResiSubfeaureId
    };
    $scope.getNewsList(getNewsData);
  };

  //Function name : showNewsDetails
  //Use: This is use for changed the state to newsDetails
  $scope.showNewsDetails = function(news) {
    console.log("================================");
    console.log(news);
    localStorage.setItem("news_id", news._id);
    console.log(JSON.parse(localStorage.getItem("mid")));
    var parnt = JSON.parse(localStorage.getItem("mid"));
    if (news.unreadthreadNewListVal > 0) {
      for (var i = 0; i < residentActionSheet.data.length; i++) {
        console.log(residentActionSheet.data[i]);
        if (parnt.parent_id == residentActionSheet.data[i]._id) {
          if (
            residentActionSheet.data[i].notiCount != undefined &&
            residentActionSheet.data[i].notiCount != null &&
            residentActionSheet.data[i].notiCount > 0
          ) {
            residentActionSheet.data[i].notiCount =
              residentActionSheet.data[i].notiCount -
              news.unreadthreadNewListVal;
          }
        }
        if (parnt._id == residentActionSheet.data[i].service_category_id._id) {
          if (
            residentActionSheet.data[i].notiCount != undefined &&
            residentActionSheet.data[i].notiCount != null &&
            residentActionSheet.data[i].notiCount > 0
          ) {
            residentActionSheet.data[i].notiCount =
              residentActionSheet.data[i].notiCount -
              news.unreadthreadNewListVal;
          }
        }
      }
    }
    console.log("================================");
    $state.go("resident-general-details");
  };
  //Function name : showNewsDetails
  //Use: This is use for changed the state to newsDetails
  $scope.showNewsDetailsMarketPlace = function(news_id) {
    localStorage.setItem("news_id", news_id);
    $state.go("resident-marketplace-details");
  };
  //Function name : LoadNewsDetails
  //Use: This is use for load the news details of a particular news
  $scope.LoadNewsDetails = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var newsData = {
        token: $localStorage.User.token,
        news_id: localStorage.getItem("news_id"),
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        make_true: true
      };
      newsFeedServices.getNewsDetails().save(
        newsData,
        function(res) {
          console.log(res);
          $ionicLoading.hide();
          angular.forEach(res.result.pdfs, function(item) {
            $scope.pdfUrl = item.url;
            $scope.pdfTitleName = item.pdf_title;
          });
          $scope.newsDetails = res.result;
          angular.forEach($scope.newsDetails.images, function(item) {
            item.url = $scope.host_url + "/" + item.url;
          });
          switch ($scope.newsDetails.category) {
            case 1:
              $scope.category_name = "General";
              localStorage.setItem("news_category", "General");
              break;
            case 2:
              $scope.category_name = "Emergency";
              localStorage.setItem("news_category", "Emergency");
              break;
            case 3:
              $scope.category_name = "Market Place";
              localStorage.setItem("news_category", "MarketPlace");
              break;
          }

          $scope.commentData = res.comments;
          console.log("$scope.commentData", $scope.commentData);
          angular.forEach($scope.commentData, function(item) {
            var date = moment(item.created).format("MMM Do, YYYY");
            item.createdDate = date;
            item.isEdit = false;
          });
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
  //Function name : reply
  //Use: This is use for replay comment on a particular post.
  $scope.reply = function(index) {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var newsData = {
        token: $localStorage.User.token,
        news_id: localStorage.getItem("news_id"),
        comment: $scope.replyObj.replytext,
        users_id: $localStorage.User.user_id,
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname
      };
      newsFeedServices.replyNewsComments().save(
        newsData,
        function(res) {
          console.log(res);
          if (res.code == 200) {
            $scope.LoadNewsDetails();
            $scope.replyObj.replytext = "";
            $ionicScrollDelegate.scrollBottom(true);
            $timeout(function() {
              $ionicScrollDelegate.scrollBottom(true);
            }, 300);
          }
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

  //Function name : newsDelete
  //Use: This is use for delete the news from my post tab
  $scope.newsDelete = function(news) {
    $scope.closePopover();
    var news_data = {
      id: news._id
    };
    $ionicPopup
      .confirm({
        title: "Alert",
        template: "Are you sure you want to delete this post?",
        cssClass: "my-custom-popup-resi"
      })
      .then(function(res) {
        if ($rootScope.authoriedUser == true) {
          if (res == true) {
            $ionicLoading.show();
            newsFeedServices.deleteNews().save(
              news_data,
              function(res) {
                if (res.code == 200) {
                  $ionicLoading.hide();
                  // $scope.news_list.splice(index, 1);
                  if (news.category == 4) {
                    $scope.alertPopResi(
                      "Alert",
                      res.message,
                      "tab-general.mypost"
                    );
                  } else if (news.category == 3) {
                    $scope.alertPopResi(
                      "Alert",
                      res.message,
                      "tab-marketplace.mypost"
                    );
                  }
                }
              },
              function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
              }
            );
          }
        } else {
          $scope.logout();
        }
      });
  };

  //Function name : newsEdit
  //Use: This is use for Edit the news from my post tab
  $scope.newsEdit = function(news) {
    $scope.closePopover();
    localStorage.setItem("news_obj", JSON.stringify(news));
    $state.go("residentEditNews");
  };

  //Function name : loadNewsEdit
  //Use: This is use for load the news details on editing page
  $scope.loadNewsEdit = function() {
    var news = JSON.parse(localStorage.getItem("news_obj"));
    console.log("newsEdit", news);
    localStorage.setItem("news_id", news._id);
    $scope.topic.title = news.title;
    $scope.topic.description = news.content;
    $scope.news.category = news.category;
    $scope.topic.existinImages = news.images;
    $scope.deletedNewsImages = [];
  };

  //Function name : deleteImg
  //Use: This Function is remove the images
  $scope.deleteImg = function(index, id) {
    $ionicPopup
      .confirm({
        title: "Alert",
        template: "Are you sure you want to delete this image?",
        cssClass: "my-custom-popup-resi"
      })
      .then(function(res) {
        if (res == true) {
          $scope.topic.existinImages.splice(index, 1);
          $scope.deletedNewsImages.push(id);
        }
      });
  };

  //Function name : UpdateNews
  //Use: This Function is use for update the news
  $scope.UpdateNews = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var news_data = {
        news_id: localStorage.getItem("news_id"),
        category: $scope.news.category,
        content: $scope.topic.description,
        title: $scope.topic.title,
        deleted_images: $scope.deletedNewsImages,
        new_images: $scope.topic.photos,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        token: $localStorage.User.token
      };
      console.log("Edit newsData", news_data);
      newsFeedServices.updateNews().save(
        news_data,
        function(res) {
          console.log("res edit news", res);
          if (res.code == 200) {
            var image_data = {
              news_id: localStorage.getItem("news_id"),
              images: $scope.topic.photos
            };
            newsFeedServices
              .addnewsImages()
              .save(image_data, function(response) {
                if (response.code == 200) {
                  $ionicLoading.hide();
                  if (news_data.category == 4) {
                    $scope.alertPopResi(
                      "Alert",
                      res.message,
                      "tab-general.mypost"
                    );
                  } else if (news_data.category == 3) {
                    $scope.alertPopResi(
                      "Alert",
                      res.message,
                      "tab-marketplace.mypost"
                    );
                  }
                }
              });
          } else if (res.code == 401) {
          } else if (res.code == 201) {
          }
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

  //Function name : editComment
  //Use: This Function is to open the edit comment box
  $scope.editComment = { text: "", id: "", oldText: "" };
  $scope.editcomment = function(id, text) {
    $ionicModal
      .fromTemplateUrl("templates/Resident/newsfeed/editComment.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.commentModal = modal;
        $scope.editComment.text = text;
        $scope.editComment.id = id;
        $scope.editComment.oldText = text;
        $scope.commentModal.show();
      });
  };

  $scope.closeEditModal = function() {
    $ionicListDelegate.closeOptionButtons();
    $scope.commentModal.hide();
    $scope.commentModal = "";
  };
  //Function name : sendEditComment
  //Use: This Function is update the edited comment
  $scope.sendEditComment = function(text, id, oldText, sent) {
    $scope.closeEditModal();
    if ($rootScope.authoriedUser == true) {
      var news_data = {
        news_id: localStorage.getItem("news_id"),
        comment: text,
        news_comments_id: id,
        users_id: $localStorage.User.user_id,
        token: $localStorage.User.token
      };
      if (oldText != text) {
        $ionicLoading.show();
        newsFeedServices.editComment().save(
          news_data,
          function(res) {
            $ionicListDelegate.closeOptionButtons();
            if (res.code == 200) {
              // $ionicLoading.hide();
              $scope.LoadNewsDetails();
            } else if (res.code == 401) {
            } else if (res.code == 201) {
            }
          },
          function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      } else {
        angular.forEach($scope.commentData, function(item, key) {
          if (id == item._id) {
            item.isEdit = false;
          }
        });
      }
    } else {
      $scope.logout();
    }
  };
  //Function name : deleteComment
  //Use: This Function is use to delete a particular comment
  $scope.deleteComment = function(id, sent) {
    $ionicPopup
      .confirm({
        title: "Alert",
        template: "Are you sure you want to delete this comment ?",
        cssClass: "my-custom-popup-resi"
      })
      .then(function(res) {
        if (res == true) {
          if ($rootScope.authoriedUser == true) {
            $ionicLoading.show();
            var newsData = {
              token: $localStorage.User.token,
              news_id: localStorage.getItem("news_id"),
              news_comments_id: id,
              users_id: $localStorage.User.user_id
            };
            newsFeedServices.deleteComment().save(
              newsData,
              function(res) {
                if (res.code == 200) {
                  $ionicLoading.hide();
                  $scope.alertPopResi("Alert", res.message);
                  var index;
                  if (sent == false) {
                    angular.forEach($scope.commentData, function(item, key) {
                      if (id == item._id) {
                        index = key;
                      }
                    });
                    $scope.commentData.splice(index, 1);
                  } else {
                    angular.forEach($scope.sentText, function(item, key) {
                      if (id == item.cmt_id) {
                        index = key;
                      }
                    });
                    $scope.sentText.splice(index, 1);
                  }
                }
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
        }
      });
  };

  //Function name : deleteComment
  //Use: This Function is use to delete a particular comment
  $scope.deletePrivateComment = function(id, index) {
    $ionicPopup
      .confirm({
        title: "Alert",
        template: "Are you sure you want to delete this comment ?",
        cssClass: "my-custom-popup-resi"
      })
      .then(function(res) {
        if (res == true) {
          if ($rootScope.authoriedUser == true) {
            $ionicLoading.show();
            var newsData = {
              news_subcomments_id: id,
              news_comment_id: $scope.comment_id,
              token: $localStorage.User.token,
              users_id: $localStorage.User.user_id,
              action: 2
            };
            newsFeedServices.updatePrivateComment().save(
              newsData,
              function(res) {
                if (res.code == 200) {
                  $ionicLoading.hide();
                  $scope.alertPopResi("Alert", res.message);
                  if (index == 2) {
                    $scope.loadConversation();
                  } else {
                    $scope.LoadMarketPlaceDetails();
                  }
                }
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
        }
      });
  };

  //Function name : editComment
  //Use: This Function is to open the edit comment box
  $scope.editComment = { text: "", id: "", oldText: "" };
  $scope.editPrivateComment = function(id, text, index) {
    $scope.editIndex = index;
    $ionicModal
      .fromTemplateUrl("templates/Resident/newsfeed/editPrivateComment.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.commentprivateModal = modal;
        $scope.editComment.text = text;
        $scope.editComment.id = id;
        $scope.editComment.oldText = text;
        $scope.commentprivateModal.show();
      });
  };

  $scope.closePrivateEditModal = function() {
    $scope.commentprivateModal.hide();
    $scope.commentprivateModal = "";
  };
  //Function name : sendEditComment
  //Use: This Function is update the edited comment
  $scope.sendEditPrivateComment = function(text, id, oldText, sent) {
    $scope.closePrivateEditModal();
    if ($rootScope.authoriedUser == true) {
      var newsData = {
        news_subcomments_id: id,
        news_comment_id: $scope.comment_id,
        token: $localStorage.User.token,
        users_id: $localStorage.User.user_id,
        action: 1,
        comment: text
      };
      if (oldText != text) {
        $ionicLoading.show();
        newsFeedServices.updatePrivateComment().save(
          newsData,
          function(res) {
            if (res.code == 200) {
              if ($scope.editIndex == 2) {
                $scope.loadConversation();
              } else {
                $scope.LoadMarketPlaceDetails();
              }
            } else if (res.code == 401) {
              $ionicLoading.hide();
              $scope.alertPopResi("Alert", res.message);
            } else if (res.code == 201) {
              $ionicLoading.hide();
              $scope.alertPopResi("Alert", res.message);
            }
          },
          function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      } else {
        angular.forEach($scope.commentData, function(item, key) {
          if (id == item._id) {
            item.isEdit = false;
          }
        });
      }
    } else {
      $scope.logout();
    }
  };

  //Function name : openimage
  //Use: This Function is use to open the image as a gallery box
  $scope.openimage = function(index) {
    $scope.previewImages = [];
    angular.forEach($scope.newsDetails.images, function(item) {
      $scope.previewImages.push(item.url);
    });
    $scope.activeImageSlide = index;
    $ionicModal
      .fromTemplateUrl("templates/openGalleryImage.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.attachmentModal1 = modal;
        $scope.attachmentModal1.show();
      });
  };

  $scope.closeGaleryModal = function() {
    $scope.attachmentModal1.hide();
  };
  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  //Function name : openAttachment
  //Use: This Function is use to chooase the attach ment for commenting.
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
  $scope.openAttachmentmarketPlace = function(index) {
    $scope.marketPlace = index;
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
  $scope.closeAttachmentModal = function() {
    $scope.attachmentModal.hide();
    $scope.attachmentModal = "";
  };

  //Function name : openCommentCamera
  //Use: This Function is use to chooase the attach ment for commenting.
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
  $scope.replaycommentImages = function() {
    $scope.closecommentGallery();
    $ionicLoading.show();
    if (localStorage.getItem("news_category") == "MarketPlace") {
      if ($rootScope.authoriedUser == true) {
        var newsData = {
          token: $localStorage.User.token,
          news_id: localStorage.getItem("news_id"),
          comment: $scope.commentimg.caption,
          users_id: $localStorage.User.user_id,
          news_comment_id: $scope.comment_id,
          images: $scope.commentImages
        };
        newsFeedServices.replyMarketPlaceComments().save(
          newsData,
          function(res) {
            if (res.code == 200) {
              if ($scope.marketPlace == 2) {
                $scope.loadConversation();
              } else {
                $scope.LoadMarketPlaceDetails();
              }
            }
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
    } else {
      if ($rootScope.authoriedUser == true) {
        var newsData = {
          token: $localStorage.User.token,
          news_id: localStorage.getItem("news_id"),
          comment: $scope.commentimg.caption,
          users_id: $localStorage.User.user_id,
          firstname: $localStorage.User.firstname,
          lastname: $localStorage.User.lastname,
          images: $scope.commentImages
        };
        newsFeedServices.replyNewsComments().save(
          newsData,
          function(res) {
            if (res.code == 200) {
              $scope.LoadNewsDetails();
              $scope.commentimg = { caption: "" };
              $ionicScrollDelegate.scrollBottom(true);
              $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
              }, 300);
            }
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
    }
  };

  $scope.closecommentGallery = function() {
    $scope.commentGallery.hide();
    $scope.commentGallery = "";
  };

  $scope.openImageZoom = function(images, index) {
    $scope.previewImages = [];
    angular.forEach(images, function(item) {
      $scope.previewImages.push($scope.host_url + "/" + item.url);
    });
    $scope.activeImageSlide = index;
    $ionicModal
      .fromTemplateUrl("templates/openGalleryImage.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.attachmentModal1 = modal;
        $scope.attachmentModal1.show();
      });
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

  $scope.getScrollPosition = function() {
    $scope.topic = $scope.topic;
    $scope.$apply();
  };

  ///**********************************************8************************************
  //******************************Footer start******************************************
  //************************************************************************************
  var footerBar; // gets set in $ionicView.enter
  var scroller;
  var txtInput; // ^^^

  $scope.loadtaskView = function() {
    $timeout(function() {
      footerBar = document.body.querySelector("#userMessagesView .bar-footer");
      scroller = document.body.querySelector(
        "#userMessagesView .scroll-content"
      );
      txtInput = angular.element(footerBar.querySelector("textarea"));
    }, 0);
  };

  var keyboardHeight = 0;
  window.addEventListener("native.keyboardshow", keyboardShowHandler);
  window.addEventListener("native.keyboardhide", keyboardHideHandler);

  function keyboardShowHandler(e) {
    keyboardHeight = e.keyboardHeight;
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
  }

  function keyboardHideHandler(e) {
    console.log("Hiding Keyboard from Resident Newsfeed Controller");
    keyboardHeight = 0;
    $timeout(function() {
      //scroller.style.bottom = footerBar.clientHeight + 'px';
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
      //  alert(scroller.style.bottom);
    } else {
      scroller.style.bottom = newFooterHeight + "px";
    }
    // $ionicScrollDelegate.scrollBottom(true);
  });
  ///**********************************************8************************************
  //******************************Footer end******************************************
  //************************************************************************************

  ///**********************************************8************************************
  //******************************Market Place start************************************
  //************************************************************************************
  //Function name : reply
  //Use: This is use for replay comment on a particular post.
  $scope.marketplaceUnitComment = function(index) {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var newsData = {
        token: $localStorage.User.token,
        news_id: localStorage.getItem("news_id"),
        comment: $scope.replyObj.replytext,
        users_id: $localStorage.User.user_id,
        news_comment_id: $scope.comment_id
      };
      newsFeedServices.replyMarketPlaceComments().save(
        newsData,
        function(res) {
          $scope.replyObj.replytext = "";
          if (res.code == 200) {
            if (index == 2) $scope.loadConversation();
            else {
              $scope.LoadMarketPlaceDetails();
            }
          }
        },
        function(err) {
          $ionicLoading.hide();
          console.log(err);
          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
      //   }
      // });
    } else {
      $scope.logout();
    }
  };

  //Function name : LoadNewsDetails
  //Use: This is use for load the news details of a particular news
  $scope.LoadMarketPlaceDetails = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var newsData = {
        token: $localStorage.User.token,
        news_id: localStorage.getItem("news_id"),
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        make_true: true
      };
      newsFeedServices.getMarketNewsDetails().save(
        newsData,
        function(res) {
          $ionicLoading.hide();
          $scope.newsDetails = res.result;
          angular.forEach($scope.newsDetails.images, function(item) {
            item.url = $scope.host_url + "/" + item.url;
          });
          switch ($scope.newsDetails.category) {
            case 1:
              $scope.category_name = "General";
              localStorage.setItem("news_category", "General");
              break;
            case 2:
              $scope.category_name = "Emergency";
              localStorage.setItem("news_category", "Emergency");
              break;
            case 3:
              $scope.category_name = "Market Place";
              localStorage.setItem("news_category", "MarketPlace");
              break;
          }
          $scope.commentData = res.comments;
          if ($scope.commentData.length > 0) {
            $scope.comment_id = res.comments[0]._id;
            if ($scope.newsDetails.users_id._id != $scope.activeUser) {
              angular.forEach($scope.commentData[0].group_comments, function(
                item
              ) {
                var date = moment(item.created).format("Do MMM,YYYY");
                item.createdDate = date;
              });
            } else {
              angular.forEach($scope.commentData, function(item) {
                var date = moment(item.created).format("Do MMM,YYYY");
                item.createdDate = date;
              });
            }
          }
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

  $scope.showConversation = function(comment_id) {
    localStorage.setItem("comment_id", comment_id);
    $state.go("private-conversation");
  };

  $scope.loadConversation = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var newsData = {
        token: $localStorage.User.token,
        news_id: localStorage.getItem("news_id"),
        news_comment_id: localStorage.getItem("comment_id"),
        users_id: $localStorage.User.user_id
      };
      //alert(JSON.stringify(newsData))
      newsFeedServices.getPrivateConversation().save(
        newsData,
        function(res) {
          //alert(JSON.stringify(res.comments));
          $ionicLoading.hide();
          $scope.comment_id = res.comments[0]._id;
          $scope.conversationList = res.comments[0].group_comments;
          angular.forEach($scope.conversationList, function(item) {
            var date = moment(item.created).format("Do MMM,YYYY");
            item.createdDate = date;
          });
          $ionicScrollDelegate.scrollBottom(true);
        },
        function(err) {
          $ionicLoading.hide();
          console.log(err);
          $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
    } else {
      $scope.logout;
    }
  };

  ///**********************************************8************************************
  //******************************Market Place end  ************************************
  //************************************************************************************
  $scope.showMypost = function(news) {
    if (news.category == 3) {
      $scope.showNewsDetailsMarketPlace(news._id);
    } else {
      $scope.showNewsDetails(news);
    }
  };

  //milestone 1 aug 18-08-16
  // pdf downloading and open
  $scope.downloadAndOpen = function() {
    angular.forEach($scope.newsDetails.pdfs, function(item) {
      console.log(item.url);
      // $scope.downloadURL = CONFIG.HTTP_HOST + "/" + item.url
      $scope.downloadURL = $localStorage.baseURL + "/" + item.url;
    });
    //var url = "http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf";
    console.log($scope.downloadURL);
    var url = $scope.downloadURL;
    var fileName = url.substr(url.lastIndexOf("/") + 1);
    document.addEventListener(
      "deviceready",
      function() {
        console.log("calling1");
        window.requestFileSystem(
          LocalFileSystem.PERSISTENT,
          0,
          function onFileSystemSuccess(fileSystem) {
            console.log("fileSystem", fileSystem.root.nativeURL);
            var targetPath = fileSystem.root.nativeURL + fileName;
            fileSystem.root.getFile(
              "dummy.html",
              {
                create: true,
                exclusive: false
              },
              function gotFileEntry(fileEntry) {
                $ionicLoading.show({
                  template: "Opening PDF file..."
                });
                console.log("targetPath", targetPath);
                $ionicPlatform.ready(function() {
                  var currentPlatform = ionic.Platform.platform();
                  if (currentPlatform == "android") {
                    $cordovaFileTransfer
                      .download(url, targetPath, {}, true)
                      .then(
                        function(result) {
                          console.log("result", result);
                          $cordovaFileOpener2
                            .open(
                              "/sdcard/" + fileName, // Any system location, you CAN'T use your appliaction assets folder
                              "application/pdf"
                            )
                            .then(
                              function() {
                                console.log("Success");
                                $ionicLoading.hide();
                              },
                              function(err) {
                                $ionicLoading.hide();
                                console.log(
                                  "An error occurred: " + JSON.stringify(err)
                                );
                              }
                            );
                        },
                        function(error) {
                          console.log("Error", error);
                          $ionicLoading.hide();
                        },
                        function(progress) {
                          console.log("Downloading..");
                        }
                      );
                  } else {
                    $cordovaFileTransfer
                      .download(url, targetPath, {}, true)
                      .then(
                        function(result) {
                          console.log("result", result);
                          console.log("targetPath", targetPath);
                          $cordovaFileOpener2.open(targetPath).then(
                            function() {
                              console.log("Success");
                              $ionicLoading.hide();
                            },
                            function(err) {
                              $ionicLoading.hide();
                              console.log(
                                "An error occurred: " + JSON.stringify(err)
                              );
                            }
                          );
                        },
                        function(error) {
                          console.log("Error", error);
                          $ionicLoading.hide();
                        },
                        function(progress) {
                          console.log("Downloading..");
                        }
                      );
                  }
                });
              },
              fail
            );
          },
          fail
        );
      },
      true
    );

    function fail(evt) {
      $ionicLoading.hide();
      alert(evt);
    }
  };

  $scope.backToGnrlMarkt = function() {
    $state.go("resident");
  };
  $scope.backToResidMngmnt = function() {
    $state.go("newsfeeds");
  };
  $scope.gobackToHome = function() {
    $state.go("sideMenu.features");
  };
  $scope.goback = function() {
    $ionicHistory.goBack(-1);
  };

  $ionicPopover
    .fromTemplateUrl("templates/Resident/newsfeed/editDeletePopover.html", {
      scope: $scope
    })
    .then(function(popover) {
      $scope.popover = popover;
    });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
    //  $ionicScrollDelegate.scrollTop(true);
  };

  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  //Cleanup the popover when we're done with it!
  $scope.$on("$destroy", function() {
    $scope.popover.remove();
  });

  // Execute action on hide popover
  $scope.$on("popover.hidden", function() {
    // Execute action
  });

  // Execute action on remove popover
  $scope.$on("popover.removed", function() {
    // Execute action
  });
});
