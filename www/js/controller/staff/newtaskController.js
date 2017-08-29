app.controller('newtaskCtrl', function($scope, $rootScope, $cordovaKeyboard, unitIdsList, $morphCarousel, $ionicModal, $cordovaBadge, notificationStaffTaskList, $state, $ionicHistory, $window, $ionicFilterBar, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $timeout, $localStorage, $ionicPopup, CONFIG, $ionicLoading, $cordovaDevice, getNotificationstaff, $cordovaCamera, $cordovaImagePicker, contactManagementServicesStaff, globalShareService, $ionicPlatform, $base64) {
  

  $scope.messages1 = [];
    $scope.getTaskLisstaff = function(searchFilter, startdate, enddate) {
        console.log("$rootScope.task_status", $rootScope.task_status);
        if (searchFilter) {
            $rootScope.serviceid = searchFilter.serviceid
        }
        if (startdate) {
            var d = new Date(startdate);
            $rootScope.start = d.toISOString();
        }
        if (enddate) {
            var e = new Date(enddate);
            $rootScope.end = e.toISOString();
        }
        if ($rootScope.authoriedUser == true) {
            var taskData = {
                "token": $localStorage.User.token,
                "property_id": $localStorage.User.property_id,
                "users_id": $localStorage.User.user_id,
                "services_category_id": localStorage.getItem('feature_id'),
                "staff_roles_id": $localStorage.User.staff_roles_id,
                "page_number": 0,
                "units_id": $scope.searchThisUnit,
                "startdate": $rootScope.start,
                "enddate": $rootScope.end,
                "service_number": $rootScope.serviceid,
                "task_status": $rootScope.task_status,
                "priority": 1
            }
            console.log("taskData", taskData);
            if ($scope.isOnline() == true) {
                $ionicLoading.show();
                getNotificationstaff.listAllStaffsTasks().save(taskData, function(res) {
                    if (searchFilter) {
                        $scope.closeModal();
                        $ionicScrollDelegate.anchorScroll();
                    }
                    console.log("response", res);
                    if (res.code == 200) {
                        angular.forEach(res.results, function(item) {
                            item.created = moment(item.created).format("hh:mm A - MMM Do, YYYY");
                            //item.tasks_id.finish_before = moment(item.tasks_id.finish_before).format("MMM Do, YYYY");
                            item.tasks_id.finish_before = moment(item.tasks_id.finish_before).format("ddd, MMM Do, YYYY [at] hh:mm A");
                            if (item.tasks_id.task_complete_date) {
                                //item.tasks_id.task_complete_date = moment(item.tasks_id.task_complete_date).format("MMM Do, YYYY");
                                item.tasks_id.task_complete_date = moment(item.tasks_id.task_complete_date).format("ddd, MMM Do, YYYY [at] hh:mm A");
                            }
                            if (item.tasks_id.task_close_date) {
                                //item.tasks_id.task_close_date = moment(item.tasks_id.task_close_date).format("MMM Do, YYYY");
                                item.tasks_id.task_close_date = moment(item.tasks_id.task_close_date).format("ddd, MMM Do, YYYY [at] hh:mm A");
                            }
                            localStorage.setItem('taskPriority', item.tasks_id.priority)
                        })
                        $scope.messagesJson.msgList = [];
                        $scope.messagesJson.currentId = '';
                        $scope.messagesJson.pageNo = "";
                        $ionicLoading.hide();
                        localStorage.setItem('infiCount1', res.list_count);
                        $scope.loadContent = localStorage.getItem('infiCount1');
                        console.log($scope.msgLength);
                        if ($scope.msgLength == 0) {
                            $scope.msgLength = res.results.length;
                        } else {
                            $scope.msgLength = $scope.msgLength + res.results.length;
                        }
                        console.log("$scope.msgLength == $scope.loadContent",$scope.msgLength == $scope.loadContent);
                        if ($scope.msgLength == $scope.loadContent) {
                            $scope.noMoreItemsAvailable = true;
                        } else {
                            $scope.noMoreItemsAvailable = false;
                        }
                        console.log("listCount", $scope.loadContent);
                        console.log("msgLength", $scope.msgLength);
                        if (res.results.length > 0) {
                            angular.forEach(res.results, function(item) {
                                var count = 0;
                                angular.forEach(res.count_data, function(val) {
                                    if (item._id == val._id) {
                                        count = val.count;
                                    }
                                });
                                item.unreadthreadVal = count;
                                $scope.messages1.push(item);
                            });
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        setTimeout(function() {
                            console.log($scope.messages)
                            if ($scope.searchThisUnit == '') {
                                console.log('ss');
                                $scope.page_number = parseInt($scope.page_number) + 1;
                                // console.log($scope.page_number);
                                $scope.messagesJson.globalCount = $scope.loadContent;
                                $scope.messagesJson.defaultCount = $scope.msgLength;
                                $scope.messagesJson.globalPageCount = $scope.page_number;
                                $scope.messagesJson.pageNo = $scope.page_number;
                                $scope.messagesJson.msgAllList = $scope.messages;
                                $scope.messagesJson.emptyIt = false;
                            } else {
                                $scope.messagesJson.msgList = $scope.messages;
                                $scope.messagesJson.globalSearchCount = $scope.loadContent;
                                $scope.messagesJson.defaultSearchCount = $scope.msgLength;
                                $scope.page_number = parseInt($scope.page_number) + 1;
                                $scope.messagesJson.currentId = $scope.searchKeyWord;
                                $scope.messagesJson.pageNo = $scope.page_number;
                                $scope.messagesJson.emptyIt = false;
                                console.log(notificationStaffTaskList);
                            }
                        });
                    } else if (res.code == 201) {
                        console.log("no results found", res);
                        $ionicLoading.hide();
                        $scope.loadContent = 0;
                        $scope.msgLength = 0;
                        console.log("$scope.msgLength == $scope.loadContent", $scope.msgLength == $scope.loadContent);
                        if ($scope.msgLength == $scope.loadContent) {
                            console.log("in if");
                            $scope.noMoreItemsAvailable = true;
                        } else {
                            $scope.noMoreItemsAvailable = false;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.alertPop("Alert", res.message);

                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                    $scope.$broadcast('scroll.refreshComplete');
                })
            } else {
                $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
            }
        } else { $scope.logout(); }
    }
});