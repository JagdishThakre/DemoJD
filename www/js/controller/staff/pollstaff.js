app.controller('PollCtrl', function($scope, $state, $ionicFilterBar, $ionicLoading, $ionicScrollDelegate, $timeout, $localStorage, $ionicPopup, CONFIG, $ionicLoading, $cordovaDevice, getNotificationstaff, PollService, limitToFilter) {
    // $scope.host_url = CONFIG.HTTP_HOST;
    $scope.host_url = $localStorage.baseURL;
    $scope.data = { poll_vote: '' };
    $scope.multiOption = [];
    $scope.globalMessages = [];
    $scope.resultedMsgs = [];
    $scope.initCount = 0;
    $scope.msgLength = 0;
    $scope.noMoreItemsAvailable = false;
    $scope.page_number = "0";
    $scope.polls_list = [];

    $scope.isStatistics = true;
    /* @function : generateAvtarOnimageLoadError()
    *  @Creator  :Shivansh 
    *  @created  : 19012017
    */

    $scope.showErrorImg=false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError=function(){
        console.log("on error image called");
        $scope.showErrorImg=true;
    };
    //this function is used to refresh the page
    $scope.doRefresh = function() {
        $scope.page_number = "0";
        $scope.msgLength = 0;
        var pollData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "page_number": $scope.page_number
        };
        if ($scope.isOnline() == true) {
            PollService.getPollList().save(pollData, function(res) {
                $ionicLoading.hide();
                if (res.code == 200) {
                    if (res.result.length != 0) {
                        $scope.polls_list = res.result;
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

    //This function is used for loading the poll list from management.
    $scope.loadPollList = function() {
        $ionicLoading.show();
        var pollData = {
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
            "page_number": $scope.page_number
        };
        PollService.getPollList().save(pollData, function(res) {
            $ionicLoading.hide();
            if (res.code == 200) {
                angular.forEach(res.result, function(item) {
                    $scope.polls_list.push(item);
                });
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
                setTimeout(function() { $scope.page_number = $scope.page_number + 1; });
            } else if (res.code == 201) {
                $scope.alertPop('Alert', res.message, 'staff_features');
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        });
    };

    //This function is used for get the details of poll item
    $scope.showPollDetails = function(poll_id) {
        console.log(poll_id);
        localStorage.setItem('pollDetails', poll_id);
        $state.go('staff-pollDetails');
    };

    //This function is usded for get the poll details
    $scope.getPollDetails = function() {
        $ionicLoading.show();
        var pollDetails = {
            "polls_id": localStorage.getItem('pollDetails'),
            "token": $localStorage.User.token,
            "property_id": $localStorage.User.property_id,
            "users_id": $localStorage.User.user_id,
        };

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
    };

    $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.unitArray,
            update: function(filteredItems, filterText) {
                $scope.filterText = filterText;
                console.log($scope.filterText);
            }
        });
    };
    //This function used for submiting the answer
    $scope.submitPollAnswer = function(data) {
        var selectedAnswer = [];
        if ($scope.poll_details.is_multiple) {
            angular.forEach($scope.multiOption, function(val, key) {
                if (val.isChecked) {
                    selectedAnswer.push({ ans_id: val._id, answer: val.answer });
                }
            });
        } else {
            angular.forEach($scope.poll_details.options, function(val, key) {
                console.log('value', val);
                if (val._id == $scope.data.poll_vote) {
                    selectedAnswer.push({ ans_id: val._id, answer: val.answer });
                }
            });
        }
        console.log('selectedAnswer', selectedAnswer);
        var submitPoll = {
            "polls_id": $scope.poll_details._id,
            "token": $localStorage.User.token,
            "users_id": $localStorage.User.user_id,
            "selectedAnswer": selectedAnswer
        };
        PollService.submitPoll().save(submitPoll, function(res) {
            if (res.code == 200) {
                $scope.getPollDetails();
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        })
    };

    $scope.loadMore = function() {
        $scope.loadPollList();
    };
});
