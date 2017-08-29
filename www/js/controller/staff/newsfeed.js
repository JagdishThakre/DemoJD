app.controller('StaffNewsfeedCtrl', function($scope, $state, $ionicListDelegate, $ionicModal, CONFIG, $cordovaImagePicker, newsFeedServices, $ionicHistory, $ionicPopup, $ionicFilterBar, $localStorage, $cordovaCamera, $ionicLoading, $ionicScrollDelegate, $timeout, PollService, $ionicSlideBoxDelegate, $cordovaFileTransfer, $cordovaFileOpener2, $rootScope, getDynamicFeatures, $ionicActionSheet, $ionicPlatform, staffFeatureList) {
    $scope.nsfeedcmntlist = [{ name: 'jasica', show: false }, { name: 'Doreman', show: false }, { name: 'jasica', show: false }, { name: 'jasica', show: false }];
    $scope.replay_comment = '';
    $scope.topic = { title: '', description: '', photos: [], existinImages: [] };
    $scope.imageSrc = '';
    $scope.news = { category: localStorage.getItem('newsIndex') };
    // $scope.host_url = CONFIG.HTTP_HOST;
    $scope.host_url = $localStorage.baseURL;
    $scope.data = { poll_vote: '' };
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
    $scope.replyObj = { replytext: '' };
    $scope.sentText = [];
    $scope.sentDate = [];
    $scope.deletedNewsImages = [];
    // $scope.search = { title: localStorage.getItem('searchValue') };
    $scope.search = {};

    $scope.commentimg = { 'caption': '' };
    $scope.activeUser = $localStorage.User.user_id;
    $scope.comment_id = '';
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
            console.log("on error image called");
            $scope.showErrorImg = true;
        }
        //This function used for filter the post. by seach box
    $scope.scrollopt = function() {
        if ($scope.search.title == '' && localStorage.getItem('searchValue') != '') {
            $scope.searchResult();
            $scope.searchShow = false;
        }
    }

    $scope.clearsearchfield = function() {
        console.log("clearing it");
        $scope.search.title = '';

    }

    $scope.goTab = function(goTab) {
        localStorage.setItem('searchValue', '');
        console.log("Clcicked on go")
        console.log("goTab", goTab)
        if (goTab.service_category_id.slug == 'rsdnt') {
            $state.go("staffNewsResident");
        } else if (goTab.service_category_id.slug == 'mngmnt') {

            $state.go("staffNewsManagement");
        } else {
            console.log("Something went wrong")
        }
    }
    $scope.toggleSearch = function() {
        $scope.searchShow = !$scope.searchShow;
    }
    $scope.newsHome = 0;
    $scope.newsResiSub = 0;
    $scope.newsMangSub = 0;
    $scope.staffNewsSubFeatureDatas = [];
    $scope.staffDynamicFeature = function() {
        console.log("DynamicstaffFeatureList", staffFeatureList);
        angular.forEach(staffFeatureList.features, function(item) {
            if (item.service_category_id._id == '578737d961f925afa18240c3' || item.service_category_id._id == '578737b261f925afa18240c2') {
                $scope.newsHome += 1;
            }
            if (item.service_category_id._id == '5787389761f925afa18240c5' || item.service_category_id._id == '578738bc61f925afa18240c6') {
                $scope.newsResiSub += 1;
            }
            if (item.service_category_id._id == '5787386661f925afa18240c4' || item.service_category_id._id == '56ab40b8d42aba0fd731b1e4' || item.service_category_id._id == '56a9e78bd42aba0fd731b1df') {
                $scope.newsMangSub += 1;
            }
     
            console.log("===="+item.service_category_id.name+"====");
            if (item.service_category_id._id == "578737d961f925afa18240c3") {
              if ($rootScope.user_permissions.Resident) {
                item.service_category_id.name = $rootScope.rise_property;
                $scope.staffNewsSubFeatureDatas.push(item);
                console.log('Resident');
              }
            }else if (item.service_category_id._id == "578737b261f925afa18240c2") {
              if ($rootScope.user_permissions.Management) {
                $scope.staffNewsSubFeatureDatas.push(item);
                console.log('Management');
              }
            }else if (item.service_category_id._id == "578738bc61f925afa18240c6") {
              if ($rootScope.user_permissions.Marketplace) {
                $scope.staffNewsSubFeatureDatas.push(item);
                console.log('Marketplace');
              }
            }else if (item.service_category_id._id == "56ab40b8d42aba0fd731b1e4") {
              if ($rootScope.user_permissions.Polls) {
                $scope.staffNewsSubFeatureDatas.push(item);
                console.log('Polls');
              }
            }else if (item.service_category_id._id == "5787389761f925afa18240c5") {
              if ($rootScope.user_permissions.General) {
                $scope.staffNewsSubFeatureDatas.push(item);
                console.log('General');
              }
            }else if (item.service_category_id._id == "5787386661f925afa18240c4") {
              if ($rootScope.user_permissions.Emergency) {
                $scope.staffNewsSubFeatureDatas.push(item);
                console.log('Emergency');
              }
            }else if (item.service_category_id._id == "56a9e78bd42aba0fd731b1df") {
              if ($rootScope.user_permissions.News) {
                $scope.staffNewsSubFeatureDatas.push(item);
                console.log('News');
              }
            }

        });
        console.log("$scope.newsHome: " + $scope.newsHome + " $scope.newsResiSub: " + $scope.newsResiSub + " $scope.newsMangSub: " + $scope.newsMangSub);
        // $scope.staffNewsSubFeatureDatas = staffFeatureList.features;
        $scope.showStaffCheckBoxes = staffFeatureList.features;

    }
    $scope.getStaffDynamicFeature = function() {
        if ($rootScope.authoriedUser == true) {
            $scope.refreshDiv = false;
            $ionicLoading.show();
            var featureData = {
                "users_id": $localStorage.User.user_id,
                "user_type": $localStorage.User.user_type_id,
                "token": $localStorage.User.token
            }
            getDynamicFeatures.features().save(featureData, function(res) {
                console.log("DynamicFeatures", res)
                if (res.code == 200) {
                    $scope.showStaffCheckBoxes = res.data;
                    $ionicLoading.hide();
                } else {
                    $scope.alertPop('Alert', res.message);
                    $ionicLoading.hide();
                }
            }, function(err) {
                setTimeout(function() {
                    $ionicLoading.hide();
                    $scope.refreshDiv = true;
                }, 3000);
            })
        } else { $scope.logout() }
    }

    $scope.searchResult = function() {
        console.log(localStorage.getItem('mypost'));
        $scope.page_number = "0";
        $scope.msgLength = 0;
        $ionicLoading.show();
        localStorage.setItem('searchValue', $scope.search.title);
        if (localStorage.getItem('newsIndex') == 4) {
            $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
        } else if (localStorage.getItem('newsIndex') == 3) {
            $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
        } else if (localStorage.getItem('newsIndex') == 1) {
            $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
        } else if (localStorage.getItem('newsIndex') == 2) {
            $scope.newsResiSubfeaureId = "5787386661f925afa18240c4"
        }
        var getNewsData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "user_type_id": localStorage.getItem('usertype'),
            "category": localStorage.getItem('newsIndex'),
            "page_number": $scope.page_number,
            "my_posts": (localStorage.getItem('mypost') == 'true') ? true : false,
            // "search_title": localStorage.getItem('searchValue'),
            "search_title": $scope.search.title,
            "services_category_id": $scope.newsResiSubfeaureId
        }

        $scope.news_list = [];
        $scope.getNewsList(getNewsData);
    }

    ///////////////////////////////////////////////////////////////////////////////////
    /////////////////////This is starting point for Poll section ///////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    $scope.doRefresh = function() {
        $scope.page_number = "0";
        $scope.msgLength = 0;
        var pollData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "page_number": $scope.page_number
        }
        if ($scope.isOnline() == true) {
            PollService.getPollList().save(pollData, function(res) {
                console.log("Poll res Do refresh: ", res)
                $ionicLoading.hide();
                if (res.code == 200) {
                    $scope.polls_list = res.result;
                    if (res.result.length != 0) {
                        //$scope.polls_list = res.result;

                        angular.forEach(res.result, function(item) {
                            var pollCount = 0;
                            angular.forEach(res.count_data, function(val) {
                                if (item._id == val._id) {
                                    pollCount = val.count;
                                }
                            })
                            item.unreadthreadPollVal = pollCount;


                        })
                        localStorage.setItem('infiCount', res.list_count);
                        $scope.loadContent = localStorage.getItem('infiCount');
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
                    $scope.alertPop('Alert', res.message, 'staff_features');
                }
                $scope.$broadcast('scroll.refreshComplete');
                setTimeout(function() {
                    $scope.page_number = parseInt($scope.page_number) + 1;
                });
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        }
    };

    $scope.loadPollList = function() {
        $ionicLoading.show();
        var pollData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "page_number": $scope.page_number
        }
        PollService.getPollList().save(pollData, function(res) {
            console.log("poll res 1: ", res)
            $ionicLoading.hide();
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
                    });
                } else {
                    $scope.alertPop('Alert', 'Sorry you have no Polls');
                }

                localStorage.setItem('infiCount', res.list_count);
                $scope.loadContent = localStorage.getItem('infiCount');
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

                $scope.$broadcast('scroll.infiniteScrollComplete');
                setTimeout(function() {
                    $scope.page_number = parseInt($scope.page_number) + 1;
                });
            } else if (res.code == 201) {
                $scope.alertPop('Alert', res.message, 'staff_features');
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    };

    $scope.poll_vote = false;

    $scope.checkfiled = function(value) {
        console.log("value", value);
        $scope.data.poll_vote = value;
    }

    $scope.submitPollAnswer = function() {
        var selectedAnswer = [];
        console.log("$scope.data.poll_vote", $scope.data.poll_vote);
        if ($scope.poll_details.is_multiple) {
            angular.forEach($scope.multiOption, function(val, key) {
                if (val.isChecked) {
                    selectedAnswer.push({ ans_id: val._id, answer: val.answer });
                }
            });
        } else {
            console.log("else");
            angular.forEach($scope.poll_details.options, function(val, key) {
                // if (val._id == $scope.data.poll_vote) {
                //     selectedAnswer.push({ ans_id: val._id, answer: val.answer });
                // }

                console.log("$scope.poll_vote", $scope.poll_vote);

                if (val._id == $scope.data.poll_vote) {
                    selectedAnswer.push({ ans_id: val._id, answer: val.answer });
                }
            });
        }
        var submitPoll = {
            "polls_id": $scope.poll_details._id,
            "token": $localStorage.User.token,
            "users_id": $localStorage.User.user_id,
            "selectedAnswer": selectedAnswer
        }
        console.log("submitPoll.selectedAnswer.length", submitPoll.selectedAnswer.length);
        console.log("submitPoll", submitPoll);
        if (submitPoll.selectedAnswer.length <= 0) {
            $scope.alertPop('Alert', 'please select any of the option');
        } else {
            $ionicLoading.show();
            //console.log("submitPoll",submitPoll)
            PollService.submitPoll().save(submitPoll, function(res) {
                if (res.code == 200) {
                    $scope.getPollDetails();
                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            })
        }
    }

    $scope.showPollDetails = function(poll) {
        localStorage.setItem('pollDetails', poll._id);
        console.log(JSON.parse(localStorage.getItem('mid')));
        var parnt = JSON.parse(localStorage.getItem('mid'));
        if (poll.unreadthreadPollVal > 0) {
          for (var i = 0; i < staffFeatureList.features.length; i++) {
            console.log(staffFeatureList.features[i]);
            if (parnt.service_category_id.parent_id == staffFeatureList.features[i]._id) {
              if (staffFeatureList.features[i].notiCount != undefined && staffFeatureList.features[i].notiCount != null && staffFeatureList.features[i].notiCount > 0) {
                staffFeatureList.features[i].notiCount = staffFeatureList.features[i].notiCount - poll.unreadthreadPollVal;
              }
            }
            if (parnt.service_category_id._id == staffFeatureList.features[i].service_category_id
              ._id) {
              if (staffFeatureList.features[i].notiCount != undefined && staffFeatureList.features[i].notiCount != null && staffFeatureList.features[i].notiCount > 0) {
                staffFeatureList.features[i].notiCount = staffFeatureList.features[i].notiCount - poll.unreadthreadPollVal;
              }
            }
          }
        }
        console.log("================================");
        $state.go('staff-poll-details');
    }

    //This function is usded for get the poll details
    $scope.getPollDetails = function() {
        $ionicLoading.show();
        var pollDetails = {
            "polls_id": localStorage.getItem('pollDetails'),
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "make_true": true

        }
        console.log("pollDetails: ", pollDetails);
        PollService.getpollDetails().save(pollDetails, function(res) {
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
                        $scope.statisticsData.push([data.answer + ' - ' + count, count]);
                    });
                }
            } else {
                console.log("Found some error");
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    }

    $scope.loadMore = function() {
        $scope.loadPollList();
    };
    ///////////////////////////////////////////////////////////////////////////////////
    /////////////////////This is end point for Poll section ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////
    /////////////////////This is Start point for News section /////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////


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
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.topic.photos.push("data:image/jpeg;base64," + imageData);
            $ionicScrollDelegate.scrollBottom(true);
        }, function(err) {});
    }

    //This function used for get picture from galery
    $scope.getselect = function() {
        //var results = ['/img/logo2.png','/img/logo.png'];
        var option = {
            maximumImagesCount: 4,
            width: 800,
            height: 800,
            quality: 80
        };
        $cordovaImagePicker.getPictures(option).then(function(results) {
            for (var i = 0; i < results.length; i++) {
                $ionicLoading.show();
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
                    $scope.topic.photos.push(dataURL);
                    $ionicScrollDelegate.scrollBottom(true);
                    $ionicScrollDelegate.scrollBottom(true);
                    $ionicLoading.hide();
                }
                img.src = results[i];
            }
        }, function(error) {
            $ionicLoading.hide();
        });
    };

    //This function used for open image on modal

    //Close the modal
    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal = '';
    };

    //This is used for remove an image from list
    $scope.removeImg = function(index) {
        $ionicPopup.confirm({
            title: 'Alert',
            template: 'Are you sure you want to delete this image?',
            cssClass: 'my-custom-popup-staff'
        }).then(function(res) {
            if (res == true) {
                $scope.topic.photos.splice(index, 1);
                $ionicScrollDelegate.scrollBottom(true);
            }
        });
    };

    //This function is used for sending the News details
    $scope.submitNews = function() {
        $ionicLoading.show();
        if ($scope.news.category == 1) {
            $scope.postNewsPostId = "5787389761f925afa18240c5";
        } else if ($scope.news.category == 3) {
            $scope.postNewsPostId = "578738bc61f925afa18240c6";
        } else {
            console.log("didnt select any category")
        }
        var newsData = {
            "title": $scope.topic.title,
            "content": $scope.topic.description,
            "images": $scope.topic.photos,
            "category": $scope.news.category,
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "user_type_id": "3",
            "firstname": $localStorage.User.firstname,
            "lastname": $localStorage.User.lastname,
            "services_category_id": $scope.postNewsPostId
        }
        console.log(newsData);
        newsFeedServices.postNews().save(newsData, function(res) {
            if (res.code == 200) {
                $ionicLoading.hide();
                $scope.alertPop('Alert', res.message, 'staffnewsfeeds');
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    };

    //This function is used for Cancelling the News
    $scope.cancelNews = function() {
        $ionicHistory.goBack(-1);
    };
    //Function name : changeTab
    //Use: This function is called after change the tab in news feed section
    $scope.changeTab = function(index, usertype, mypost) {
            $scope.searchShow = (localStorage.getItem('searchValue') != '') ? true : false;
            $ionicLoading.show();
            if (index == 4) {
                $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
            } else if (index == 3) {
                $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
            } else if (index == 1) {
                $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
            } else if (index == 2) {
                $scope.newsResiSubfeaureId = "5787386661f925afa18240c4"
            }
            var getNewsData = {
                "token": $localStorage.User.token,
                "property_id": $localStorage.User.property_id,
                "users_id": $localStorage.User.user_id,
                "user_type_id": usertype,
                "category": index,
                "page_number": $scope.page_number,
                "my_posts": mypost,
                // "search_title": localStorage.getItem('searchValue'),
                "search_title": $scope.search.title,

                "services_category_id": $scope.newsResiSubfeaureId
            }
            localStorage.setItem('newsIndex', index);
            localStorage.setItem('usertype', usertype);
            localStorage.setItem('mypost', mypost);
            $scope.getNewsList(getNewsData);
        }
        //Function name : getGeneralNews
        //Use: This is use for get all the new for general category
    $scope.getNewsList = function(data) {
            console.log("data", data);
            newsFeedServices.getNewsList().save(data, function(res) {
                console.log("getNewsList", res);
                if (res.code == 200) {
                    $ionicLoading.hide();
                    if (res.result.length > 0) {
                        angular.forEach(res.result, function(item) {
                            var newsListCount = 0;
                            angular.forEach(res.count_data, function(val) {
                                if (item._id == val._id) {
                                    newsListCount = val.count;
                                }
                            })
                            item.unreadthreadNewListVal = newsListCount;
                            $scope.news_list.push(item);
                        })
                    } else {
                        $scope.alertPop('Alert', 'Sorry you have no news');
                    }

                    localStorage.setItem('infiCount', res.list_count);
                    $scope.loadContent = localStorage.getItem('infiCount');
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

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    setTimeout(function() {
                        $scope.page_number = parseInt($scope.page_number) + 1;
                    });
                } else {

                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        }
        //Function name : refreshNews
        //Use: This is use for Refresh the news list
    $scope.refreshNews = function() {
        $scope.page_number = "0";
        $scope.msgLength = 0;
        if (localStorage.getItem('newsIndex') == 4) {
            $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
        } else if (localStorage.getItem('newsIndex') == 3) {
            $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
        } else if (localStorage.getItem('newsIndex') == 1) {
            $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
        } else if (localStorage.getItem('newsIndex') == 2) {
            $scope.newsResiSubfeaureId = "5787386661f925afa18240c4"
        }
        var getNewsData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "user_type_id": localStorage.getItem('usertype'),
            "category": localStorage.getItem('newsIndex'),
            "page_number": $scope.page_number,
            "my_posts": (localStorage.getItem('mypost') == 'true') ? true : false,
            "search_title": localStorage.getItem('searchValue'),
            "services_category_id": $scope.newsResiSubfeaureId
        }
        if ($scope.isOnline() == true) {
            newsFeedServices.getNewsList().save(getNewsData, function(res) {
                $ionicLoading.hide();
                if (res.code == 200) {
                    console.log(res);
                    if (res.result.length != 0) {
                        //$scope.news_list = res.result;
                        angular.forEach(res.result, function(item) {
                            var newsListCount = 0;
                            angular.forEach(res.count_data, function(val) {
                                if (item._id == val._id) {
                                    newsListCount = val.count;
                                }
                            })
                            item.unreadthreadNewListVal = newsListCount;
                            $scope.news_list.push(item);
                        })
                        localStorage.setItem('infiCount', res.list_count);
                        $scope.loadContent = localStorage.getItem('infiCount');

                        if ($scope.msgLength == 0) {
                            $scope.msgLength = res.result.length;
                        } else {
                            $scope.msgLength = $scope.msgLength + res.result.length;
                        }
                        console.log($scope.msgLength);
                        if ($scope.msgLength == $scope.loadContent) {
                            $scope.noMoreItemsAvailable = true;
                        } else {
                            $scope.noMoreItemsAvailable = false;
                        }
                    }
                } else if (res.code == 201) {
                    $scope.alertPop('Alert', res.message, 'features');
                }
                $scope.$broadcast('scroll.refreshComplete');
                setTimeout(function() {
                    $scope.page_number = parseInt($scope.page_number) + 1;
                });
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        }
    };
    //Function name : loadMoreNews
    //Use: This is use for Load more news

    $scope.loadMoreNews = function() {

        var index = localStorage.getItem('newsIndex');
        if (index == 4) {
            $scope.newsResiSubfeaureId = "5787389761f925afa18240c5";
        } else if (index == 3) {
            $scope.newsResiSubfeaureId = "578738bc61f925afa18240c6";
        } else if (index == 1) {
            $scope.newsResiSubfeaureId = "56a9e78bd42aba0fd731b1df";
        } else if (index == 2) {
            $scope.newsResiSubfeaureId = "5787386661f925afa18240c4"
        }
        var getNewsData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "user_type_id": localStorage.getItem('usertype'),
            "category": index,
            "page_number": $scope.page_number,
            "my_posts": (localStorage.getItem('mypost') == 'true') ? true : false,
            "search_title": localStorage.getItem('searchValue'),
            "services_category_id": $scope.newsResiSubfeaureId
        }
        $scope.getNewsList(getNewsData);
    }

    //Function name : showNewsDetails
    //Use: This is use for changed the state to newsDetails
    $scope.showNewsDetails = function(news) {
        localStorage.setItem('news_id', news._id);

        console.log("================================");
        console.log(news);
        localStorage.setItem('news_id', news._id);
        console.log(JSON.parse(localStorage.getItem('mid')));
        var parnt = JSON.parse(localStorage.getItem('mid'));
        if (news.unreadthreadNewListVal > 0) {
          for (var i = 0; i < staffFeatureList.features.length; i++) {
            console.log(staffFeatureList.features[i]);
            if (parnt.service_category_id.parent_id == staffFeatureList.features[i]._id) {
              if (staffFeatureList.features[i].notiCount != undefined && staffFeatureList.features[i].notiCount != null && staffFeatureList.features[i].notiCount > 0) {
                staffFeatureList.features[i].notiCount = staffFeatureList.features[i].notiCount - news.unreadthreadNewListVal;
              }
            }
            if (parnt.service_category_id._id == staffFeatureList.features[i].service_category_id
              ._id) {
              if (staffFeatureList.features[i].notiCount != undefined && staffFeatureList.features[i].notiCount != null && staffFeatureList.features[i].notiCount > 0) {
                staffFeatureList.features[i].notiCount = staffFeatureList.features[i].notiCount - news.unreadthreadNewListVal;
              }
            }
          }
        }
        console.log("================================");

        $state.go('staff-comment-details');
    };
    //Function name : LoadNewsDetails
    //Use: This is use for load the news details of a particular news
    $scope.LoadNewsDetails = function() {
            $scope.show = true;
            $ionicLoading.show();
            var newsData = {
                "token": $localStorage.User.token,
                "news_id": localStorage.getItem('news_id'),
                "property_id": $localStorage.User.property_id,
                "users_id": $localStorage.User.user_id,
                "make_true": true
            }
            newsFeedServices.getNewsDetails().save(newsData, function(res) {
                $ionicLoading.hide();
                $scope.newsDetails = res.result;
                angular.forEach(res.result.pdfs, function(item) {
                    $scope.pdfUrl = item.url;
                    $scope.pdfTitleName = item.pdf_title;
                });
                console.log('$scope.newsDetails', $scope.newsDetails);
                angular.forEach($scope.newsDetails.images, function(item) {
                    item.url = $scope.host_url + '/' + item.url;
                });
                switch ($scope.newsDetails.category) {
                    case 1:
                        $scope.category_name = 'General';
                        localStorage.setItem('news_category', 'General');
                        break;
                    case 2:
                        $scope.category_name = 'Emergency';
                        localStorage.setItem('news_category', 'Emergency');
                        break;
                    case 3:
                        $scope.category_name = 'Market Place'
                        localStorage.setItem('news_category', 'MarketPlace');
                        break;
                }

                $scope.commentData = res.comments;
                angular.forEach($scope.commentData, function(item) {
                    var date = moment(item.created).format("MMM Do, YYYY");
                    item.createdDate = date;
                });
                $ionicScrollDelegate.scrollBottom(true);
                $timeout(function() {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 300);
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });

        }
        //Function name : reply
        //Use: This is use for replay comments
    $scope.reply = function(index) {
            $ionicLoading.show();
            var newsData = {
                "token": $localStorage.User.token,
                "news_id": localStorage.getItem('news_id'),
                "comment": $scope.replyObj.replytext,
                "users_id": $localStorage.User.user_id,
                "firstname": $localStorage.User.firstname,
                "lastname": $localStorage.User.lastname
            }
            newsFeedServices.replyNewsComments().save(newsData, function(res) {
                if (res.code == 200) {
                    $ionicLoading.hide();
                    $scope.LoadNewsDetails();
                    $scope.replyObj.replytext = '';
                    $ionicScrollDelegate.scrollBottom(true);
                    $timeout(function() {
                        $ionicScrollDelegate.scrollBottom(true);
                    }, 300);
                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        }
        //Function name : newsEdit
        //Use: This is use for Edit the news from my post tab
    $scope.newsEdit = function(news) {
        localStorage.setItem('news_obj', JSON.stringify(news));
        $state.go('staffEditNews');
    }

    //Function name : newsDelete
    //Use: This is use for delete the news from my post tab
    $scope.newsDelete = function(news, index) {
            var news_data = {
                "id": news._id
            }
            $ionicPopup.confirm({
                title: 'Alert',
                template: 'Are you sure you want to delete this News ?',
                cssClass: 'my-custom-popup-staff'
            }).then(function(res) {
                if (res == true) {
                    $ionicLoading.show();
                    newsFeedServices.deleteNews().save(news_data, function(res) {
                        if (res.code == 200) {
                            $ionicLoading.hide();
                            $scope.news_list.splice(index, 1);
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    });
                }
            });
        }
        //Function name : loadNewsEdit
        //Use: This is use for load the news details on editing page
    $scope.loadNewsEdit = function() {
        var news = JSON.parse(localStorage.getItem('news_obj'));
        localStorage.setItem('news_id', news._id);
        $scope.topic.title = news.title;
        $scope.topic.description = news.content;
        $scope.news.category = news.category;
        $scope.topic.existinImages = news.images;
        $scope.deletedNewsImages = [];
    }

    //Function name : UpdateNews
    //Use: This Function is use for update the news
    $scope.UpdateNews = function() {
            $ionicLoading.show();
            var news_data = {
                "news_id": localStorage.getItem('news_id'),
                "category": $scope.news.category,
                "content": $scope.topic.description,
                "title": $scope.topic.title,
                "deleted_images": $scope.deletedNewsImages,
                "new_images": $scope.topic.photos,
                "property_id": $localStorage.User.property_id,
                "users_id": $localStorage.User.user_id,
                "token": $localStorage.User.token
            }
            newsFeedServices.updateNews().save(news_data, function(res) {
                if (res.code == 200) {
                    var image_data = {
                        "news_id": localStorage.getItem('news_id'),
                        "images": $scope.topic.photos
                    }
                    newsFeedServices.addnewsImages().save(image_data, function(response) {
                        if (response.code == 200) {
                            $ionicLoading.hide();
                            if (news_data.category == 4) {

                                $scope.alertPop('Alert', res.message, 'tab-general-staff.mypost');
                            } else if (news_data.category == 3) {
                                $scope.alertPop('Alert', res.message, 'tab-marketplacestaff.mypost');

                            }
                        }
                    });
                } else if (res.code == 401) {

                } else if (res.code == 201) {

                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        }
        //Function name : deleteImg
        //Use: This Function is remove the images
    $scope.deleteImg = function(index, id) {
            $ionicPopup.confirm({
                title: 'Alert',
                template: 'Are you sure you want to delete this image?',
                cssClass: 'my-custom-popup-staff'
            }).then(function(res) {
                if (res == true) {
                    $scope.topic.existinImages.splice(index, 1);
                    $scope.deletedNewsImages.push(id);
                    $ionicScrollDelegate.scrollBottom(true);
                }
            });
        }
        //Function name : editComment
        //Use: This Function is to open the edit comment box
    $scope.editComment = { text: '', id: '', oldText: '' };
    $scope.editcomment = function(id, text) {
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
        $ionicListDelegate.closeOptionButtons();
        $scope.commentModal.hide();
        $scope.commentModal = '';
    };
    // //Function name : sendEditComment
    //Use: This Function is update the edited comment
    $scope.sendEditComment = function(text, id, oldText, sent) {
            $scope.closeEditModal();
            var news_data = {
                "news_id": localStorage.getItem('news_id'),
                "comment": text,
                "news_comments_id": id,
                "users_id": $localStorage.User.user_id,
                "token": $localStorage.User.token
            }
            if (oldText != text) {
                $ionicLoading.show();
                newsFeedServices.editComment().save(news_data, function(res) {
                    $ionicListDelegate.closeOptionButtons();
                    if (res.code == 200) {
                        $scope.LoadNewsDetails();
                    } else if (res.code == 401) {

                    } else if (res.code == 201) {

                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                });
            } else {
                angular.forEach($scope.commentData, function(item, key) {
                    if (id == item._id) {
                        item.isEdit = false;
                    }
                });
            }
        }
        //Function name : deleteComment
        //Use: This Function is use to delete a particular comment
    $scope.deleteComment = function(id, sent) {
            $ionicPopup.confirm({
                title: 'Alert',
                template: 'Are you sure you want to delete this comment ?',
                cssClass: 'my-custom-popup-staff'
            }).then(function(res) {
                if (res == true) {
                    $ionicLoading.show();
                    var newsData = {
                        "token": $localStorage.User.token,
                        "news_id": localStorage.getItem('news_id'),
                        "news_comments_id": id,
                        "users_id": $localStorage.User.user_id,
                    }
                    newsFeedServices.deleteComment().save(newsData, function(res) {
                        if (res.code == 200) {
                            $ionicLoading.hide();
                            $scope.alertPop('Alert', res.message);
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
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    });
                }
            });
        }
        //Function name : deleteComment
        //Use: This Function is use to delete a particular comment
    $scope.deletePrivateComment = function(id, index) {
        $ionicPopup.confirm({
            title: 'Alert',
            template: 'Are you sure you want to delete this comment ?',
            cssClass: 'my-custom-popup-staff'
        }).then(function(res) {
            if (res == true) {
                $ionicLoading.show();
                var newsData = {
                    "news_subcomments_id": id,
                    "news_comment_id": $scope.comment_id,
                    "token": $localStorage.User.token,
                    "users_id": $localStorage.User.user_id,
                    "action": 2
                }
                newsFeedServices.updatePrivateComment().save(newsData, function(res) {
                    if (res.code == 200) {
                        $scope.alertPop('Alert', res.message);
                        if (index == 2) {
                            $scope.loadConversation();
                        } else {
                            $scope.LoadMarketPlaceDetails();
                        }
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                });
            }
        });
    }

    //Function name : editComment
    //Use: This Function is to open the edit comment box
    $scope.editComment = { text: '', id: '', oldText: '' };
    $scope.editPrivateComment = function(id, text, index) {
        $scope.editIndex = index;
        $ionicModal.fromTemplateUrl('templates/Staff/newsfeed/editPrivateComment.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.commentprivateModal = modal;
            $scope.editComment.text = text;
            $scope.editComment.id = id;
            $scope.editComment.oldText = text;
            $scope.commentprivateModal.show();
        });
    }

    $scope.closePrivateEditModal = function() {
        $scope.commentprivateModal.hide();
        $scope.commentprivateModal = '';
    };
    //Function name : sendEditComment
    //Use: This Function is update the edited comment
    $scope.sendEditPrivateComment = function(text, id, oldText, sent) {

        $scope.closePrivateEditModal();
        var newsData = {
            "news_subcomments_id": id,
            "news_comment_id": $scope.comment_id,
            "token": $localStorage.User.token,
            "users_id": $localStorage.User.user_id,
            "action": 1,
            "comment": text
        }
        if (oldText != text) {
            $ionicLoading.show();
            newsFeedServices.updatePrivateComment().save(newsData, function(res) {
                if (res.code == 200) {
                    if ($scope.editIndex == 2) {
                        $scope.loadConversation();
                    } else {
                        $scope.LoadMarketPlaceDetails();
                    }
                } else if (res.code == 401) {
                    $ionicLoading.hide();
                    $scope.alertPop('Alert', res.message);
                } else if (res.code == 201) {
                    $ionicLoading.hide();
                    $scope.alertPop('Alert', res.message);
                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        } else {
            angular.forEach($scope.commentData, function(item, key) {
                if (id == item._id) {
                    item.isEdit = false;
                }
            });
        }
    }

    $scope.openimage = function(index) {
        $scope.previewImages = [];
        angular.forEach($scope.newsDetails.images, function(item) {
            $scope.previewImages.push(item.url);
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
    $scope.closeGaleryModal = function() {
            $scope.attachmentModal1.hide();
        }
        // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

    $scope.openAttachment = function() {
        $ionicModal.fromTemplateUrl('templates/Staff/newsfeed/openAttachment.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.attachmentModal = modal;
            $scope.attachmentModal.show();
        });
    }
    $scope.openAttachmentmarketPlace = function(index) {
        $scope.marketPlace = index;
        $ionicModal.fromTemplateUrl('templates/Staff/newsfeed/openAttachment.html', {
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
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.commentImages.push("data:image/jpeg;base64," + imageData);
            $scope.sendcommentImages();
        }, function(err) {});
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
            template: 'Are you sure you want to send this message ?',
            cssClass: 'my-custom-popup-staff'
        }).then(function(res) {
            if (res == true) {
                $scope.closecommentGallery();
                $ionicLoading.show();
                if (localStorage.getItem('news_category') == 'MarketPlace') {
                    var newsData = {
                        "token": $localStorage.User.token,
                        "news_id": localStorage.getItem('news_id'),
                        "comment": $scope.commentimg.caption,
                        "users_id": $localStorage.User.user_id,
                        "news_comment_id": $scope.comment_id,
                        "images": $scope.commentImages
                    }
                    newsFeedServices.replyMarketPlaceComments().save(newsData, function(res) {
                        if (res.code == 200) {
                            if ($scope.marketPlace == 2) {
                                $scope.loadConversation();
                            } else {
                                $scope.LoadMarketPlaceDetails();
                            }
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    });
                } else {
                    var newsData = {
                        "token": $localStorage.User.token,
                        "news_id": localStorage.getItem('news_id'),
                        "comment": $scope.commentimg.caption,
                        "users_id": $localStorage.User.user_id,
                        "firstname": $localStorage.User.firstname,
                        "lastname": $localStorage.User.lastname,
                        "images": $scope.commentImages
                    }
                    newsFeedServices.replyNewsComments().save(newsData, function(res) {
                        if (res.code == 200) {
                            $scope.LoadNewsDetails();
                            $scope.commentimg = { 'caption': '' };
                            $ionicScrollDelegate.scrollBottom(true);
                            $timeout(function() {
                                $ionicScrollDelegate.scrollBottom(true);
                            }, 300);
                        }
                    }, function(err) {
                        $ionicLoading.hide();
                        console.log(err);
                        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    });
                }
            }
        });
    }
    $scope.closecommentGallery = function() {
        $scope.commentGallery.hide();
        $scope.commentGallery = '';
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

    $scope.getScrollPosition = function() {
        $scope.topic = $scope.topic;
        $scope.$apply();
    }

    ///**********************************************8************************************
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
        } else {
            scroller.style.bottom = newFooterHeight + 'px';
        }
        $ionicScrollDelegate.scrollBottom(true);
    });

    ///**********************************************8************************************
    //******************************Footer end******************************************
    //************************************************************************************

    ///**********************************************8************************************
    //******************************Market Place start************************************
    //************************************************************************************
    //Function name : showNewsDetails
    //Use: This is use for changed the state to newsDetails
    $scope.showNewsDetailsMarketPlace = function(news_id) {
        console.log(news_id);
        localStorage.setItem('news_id', news_id);

        $state.go('staffmarket-unit-comments');
    };
    //Function name : LoadNewsDetails
    //Use: This is use for load the news details of a particular news
    $scope.LoadMarketPlaceDetails = function() {
        $ionicLoading.show();
        var newsData = {
            "token": $localStorage.User.token,
            "news_id": localStorage.getItem('news_id'),
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "make_true": true
        }
        newsFeedServices.getMarketNewsDetails().save(newsData, function(res) {
            $ionicLoading.hide();
            $scope.newsDetails = res.result;
            console.log(res);
            angular.forEach($scope.newsDetails.images, function(item) {
                item.url = $scope.host_url + '/' + item.url;
            });
            switch ($scope.newsDetails.category) {
                case 1:
                    $scope.category_name = 'General';
                    localStorage.setItem('news_category', 'General');
                    break;
                case 2:
                    $scope.category_name = 'Emergency';
                    localStorage.setItem('news_category', 'Emergency');
                    break;
                case 3:
                    $scope.category_name = 'Market Place'
                    localStorage.setItem('news_category', 'MarketPlace');
                    break;
            }
            $scope.commentData = res.comments;
            console.log(res);
            if ($scope.commentData.length > 0) {
                $scope.comment_id = res.comments[0]._id
                if ($scope.newsDetails.users_id._id != $scope.activeUser) {
                    angular.forEach($scope.commentData[0].group_comments, function(item) {
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
            $ionicScrollDelegate.scrollBottom(true);
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    }
    $scope.showConversation = function(comment_id) {
        localStorage.setItem('comment_id', comment_id);
        $state.go('staff-private-conversation');
    }
    $scope.loadConversation = function() {
            $ionicLoading.show();
            var newsData = {
                "token": $localStorage.User.token,
                "news_id": localStorage.getItem('news_id'),
                "news_comment_id": localStorage.getItem('comment_id'),
                "users_id": $localStorage.User.user_id
            }
            newsFeedServices.getPrivateConversation().save(newsData, function(res) {
                $ionicLoading.hide();
                $scope.comment_id = res.comments[0]._id;
                $scope.conversationList = res.comments[0].group_comments;
                angular.forEach($scope.conversationList, function(item) {
                    var date = moment(item.created).format("Do MMM,YYYY");
                    item.createdDate = date;
                });
                $ionicScrollDelegate.scrollBottom(true);
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            });
        }
        //Function name : reply
        //Use: This is use for replay comment on a particular post.
    $scope.marketplaceUnitComment = function(index) {
        $ionicLoading.show();
        var newsData = {
            "token": $localStorage.User.token,
            "news_id": localStorage.getItem('news_id'),
            "comment": $scope.replyObj.replytext,
            "users_id": $localStorage.User.user_id,
            "news_comment_id": $scope.comment_id
        }
        newsFeedServices.replyMarketPlaceComments().save(newsData, function(res) {
            $scope.replyObj.replytext = '';
            if (res.code == 200) {
                if (index == 2)
                    $scope.loadConversation();
                else {
                    $scope.LoadMarketPlaceDetails();
                }
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    }
    $scope.showMypost = function(news) {
        if (news.category == 3) {
            $scope.showNewsDetailsMarketPlace(news._id);
        } else {
            $scope.showNewsDetails(news);
        }
    }


    // pdf downloading and open function
    $scope.downloadAndOpen = function() {
        angular.forEach($scope.newsDetails.pdfs, function(item) {
            console.log(item.url)
            $scope.downloadURL = CONFIG.HTTP_HOST + "/" + item.url
            $scope.downloadURL = $localStorage.baseURL + "/" + item.url
        })
        console.log($scope.downloadURL)
        var url = $scope.downloadURL;
        var fileName = url.substr(url.lastIndexOf('/') + 1);
        document.addEventListener("deviceready", function() {
            console.log("calling1")
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function onFileSystemSuccess(fileSystem) {
                console.log("fileSystem", fileSystem.root.nativeURL);
                var targetPath = fileSystem.root.nativeURL + fileName;
                fileSystem.root.getFile(
                    "dummy.html", {
                        create: true,
                        exclusive: false
                    },
                    function gotFileEntry(fileEntry) {
                        $ionicLoading.show({
                            template: 'Opening PDF file...'
                        });
                        console.log("targetPath", targetPath)
                        $ionicPlatform.ready(function() {
                            var currentPlatform = ionic.Platform.platform();
                            if (currentPlatform == 'android') {
                                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function(result) {
                                    console.log('result', result);
                                    $cordovaFileOpener2.open(
                                        '/sdcard/' + fileName, // Any system location, you CAN'T use your appliaction assets folder
                                        'application/pdf'
                                    ).then(function() {
                                        console.log('Success');
                                        $ionicLoading.hide();
                                    }, function(err) {
                                        $ionicLoading.hide();
                                        console.log('An error occurred: ' + JSON.stringify(err));
                                    });

                                }, function(error) {
                                    console.log('Error', error);
                                    $ionicLoading.hide();
                                }, function(progress) {
                                    console.log('Downloading..');


                                });
                            } else {
                                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function(result) {
                                    console.log('result', result);
                                    console.log("targetPath", targetPath)
                                    $cordovaFileOpener2.open(targetPath).then(function() {
                                        console.log('Success');
                                        $ionicLoading.hide();
                                    }, function(err) {
                                        $ionicLoading.hide();
                                        console.log('An error occurred: ' + JSON.stringify(err));
                                    });

                                }, function(error) {
                                    console.log('Error', error);
                                    $ionicLoading.hide();
                                }, function(progress) {
                                    console.log('Downloading..');


                                });
                            }

                        })


                    }, fail);
            }, fail);

        }, true);

        function fail(evt) {
            $ionicLoading.hide();
            alert(evt);
        }

    }
    $scope.subNewsMangmt = function(data) {
        console.log(data);
        localStorage.setItem('mid', JSON.stringify(data));
        if (data.service_category_id._id == "56a9e78bd42aba0fd731b1df") {
            console.log(data.service_category_id._id)
            $state.go('staffnews');
        } else if (data.service_category_id._id == "56ab40b8d42aba0fd731b1e4") {
            console.log(data.service_category_id._id)
            $state.go('staffpoll');
        } else if (data.service_category_id._id == "5787386661f925afa18240c4") {
            console.log(data.service_category_id._id)
            $state.go('staffemergency');

        }

    }
    $scope.subNewsResi = function(data) {
        console.log("subNewsResi", data)
        localStorage.setItem('mid', JSON.stringify(data));
        if (data.service_category_id._id == '5787389761f925afa18240c5') {
            $state.go("tab-general-staff.general")
        } else {
            $state.go("tab-marketplacestaff.marketplace")
        }

    }
    $scope.backToGnrlNws = function() {
        $state.go('staffNewsResident');
        console.log("go GnrlNws")
    }
    $scope.goToResdntMngmnt = function() {
        $state.go('staffnewsfeeds')
        console.log("go redi mngmnt")
    }
    $scope.goHome = function() {
        $state.go('sideMenuStaff.features')
        console.log("go home")
    }
})
