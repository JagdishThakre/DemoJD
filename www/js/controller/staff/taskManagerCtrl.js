app.controller("taskManagerCtrl", function(
  $scope,
  $rootScope,
  $cordovaKeyboard,
  unitIdsList,
  $morphCarousel,
  $ionicModal,
  $cordovaBadge,
  notificationStaffTaskList,
  $state,
  $ionicHistory,
  $window,
  $ionicFilterBar,
  $ionicLoading,
  $ionicHistory,
  $ionicScrollDelegate,
  $timeout,
  $localStorage,
  $ionicPopup,
  CONFIG,
  $ionicLoading,
  $cordovaDevice,
  getNotificationstaff,
  $cordovaCamera,
  $cordovaImagePicker,
  contactManagementServicesStaff,
  globalShareService,
  $ionicPlatform,
  $base64
) {
  // =============================================================================
  // Generate Avatar on Image Load Error Begins
  // =============================================================================

  $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
  $scope.generateAvtarOnimageLoadError = function() {
    $scope.showErrorImg = true;
  };

  // =============================================================================
  // Generate Avatar on Image Load Error Ends
  // =============================================================================

  // =============================================================================
  // Define MobiScroll Settings for Task Pages Begins
  // =============================================================================
  $ionicPlatform.ready(function() {
    //Initialize time to 00:00
    var taskDate = new Date();
    taskDate.setHours(0);
    taskDate.setMinutes(0);
    $scope.currentDateTime = taskDate;

    // Add 1 day automatically when Finish Before is clicked

    var addDay = moment().add(1, "days");
    $scope.datetimeValueDefault = new Date(addDay);

    var subtractDate = moment().subtract(1, "days");
    $scope.DateEnd = new Date(subtractDate);

    if (ionic.Platform.platform() == "ios") {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      }
      $scope.taskformsettings = { theme: "ios-dark", tap: false };

      $scope.taskdatetimesettings = {
        theme: "ios-dark",
        animate: "slideup",
        defaultValue: $scope.datetimeValueDefault
      };
      $scope.taskselectsettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom"
      };
      $scope.taskcurrencysettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom",
        preset: "decimal",
        min: 0.0,
        max: 1000000.0,
        prefix: "$"
      };
      $scope.tasktimespansettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom",
        wheelOrder: "hhii"
      };
    } else if (ionic.Platform.platform() == "android") {
      $scope.taskformsettings = { theme: "android-holo", tap: false };
      $scope.taskdatetimesettings = {
        theme: "android-holo",
        animate: "slideup",
        defaultValue: $scope.datetimeValueDefault
      };
      $scope.taskselectsettings = {
        theme: "android-holo",
        animate: "slideup",
        display: "bottom"
      };
      $scope.taskcurrencysettings = {
        theme: "android-holo",
        animate: "slideup",
        display: "bottom",
        preset: "decimal",
        min: 0.0,
        max: 1000000.0,
        prefix: "$"
      };
      $scope.tasktimespansettings = {
        theme: "android-holo",
        animate: "slideup",
        display: "bottom",
        wheelOrder: "hhii"
      };
    } else if (ionic.Platform.platform() == "macintel") {
      $scope.taskformsettings = { theme: "ios-dark", tap: false };
      $scope.taskdatetimesettings = {
        theme: "ios-dark",
        animate: "slideup",
        defaultValue: $scope.datetimeValueDefault
      };
      $scope.taskselectsettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom"
      };
      $scope.taskcurrencysettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom",
        preset: "decimal",
        min: 0.0,
        max: 1000000.0,
        prefix: "$"
      };
      $scope.tasktimespansettings = {
        theme: "ios-dark",
        animate: "slideup",
        display: "bottom",
        wheelOrder: "hhii"
      };
    } else {
      $scope.taskformsettings = { theme: "material-dark", tap: false };
      $scope.taskdatetimesettings = {
        theme: "material-dark",
        tap: false,
        animate: "slideup",
        defaultValue: $scope.datetimeValueDefault
      };
      $scope.taskselectsettings = {
        theme: "material-dark",
        animate: "slideup",
        display: "bottom"
      };
      $scope.taskcurrencysettings = {
        theme: "material-dark",
        animate: "slideup",
        display: "bottom",
        preset: "decimal",
        min: 0.0,
        max: 1000000.0,
        prefix: "$"
      };
      $scope.tasktimespansettings = {
        theme: "material-dark",
        animate: "slideup",
        display: "bottom",
        wheelOrder: "hhii"
      };
    }
  });

  // =============================================================================
  // Define MobiScroll Settings for Task Pages Ends
  // =============================================================================
  $scope.isManager = $localStorage.User.isManager;
  $scope.showNumericKeyboard = false;
  $scope.costValue = 0;
  $scope.deletedNewsImages = [];
  if ($rootScope.editTaskDetails1 == undefined) {
    $rootScope.editTaskDetails1 = { cost: "", hours: "" };
  }
  $scope.topic = { photos: [] };
  $scope.number = "";
  $scope.editTaskDetails = {};
  $scope.messagesJson = notificationStaffTaskList;
  $scope.sortComment = function(message) {
    var date = new Date(message.tasks_id.finish_before);
    return date;
  };
  $scope.priorSort = function(message) {
    var prior = message.tasks_id.priority;
    return prior;
  };
  $scope.replyObj = {};
  $scope.tasks_id = "";
  $scope.taskDetails = {};
  $scope.data = {};

  // =============================================================================
  // Function to Refresh Task List Begins
  // =============================================================================

  /*************task list refresh *************/
  $scope.refreshTaskManagerList = function() {
    $scope.dosearch = false;
    if ($rootScope.task_status == undefined) {
      $rootScope.task_status = "";
    } else if ($rootScope.task_status) {
      $rootScope.task_status = $rootScope.task_status;
    } else {
      $rootScope.task_status = [1, 2];
    }
    if ($rootScope.authoriedUser == true) {
      $scope.messagesJson.msgList = [];
      $scope.messagesJson.unitNumber = "";
      $scope.messagesJson.pageNo = "";
      $scope.msgLength = 0;
      $scope.page_number = "0";
      $scope.priority = parseInt(localStorage.getItem("taskPriority"));
      if ($state.current.name == "taskManger.high") {
        $scope.priority = 1;
      } else if ($state.current.name == "taskManger.medium") {
        $scope.priority = 2;
      } else if ($state.current.name == "taskManger.normal") {
        $scope.priority = 3;
      }
      var taskData = {
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        services_category_id: localStorage.getItem("feature_id"),
        staff_roles_id: $localStorage.User.staff_roles_id,
        page_number: $scope.page_number,
        units_id: $scope.searchThisUnit,
        priority: $scope.priority,
        startdate: $rootScope.start,
        enddate: $rootScope.end,
        service_number: $rootScope.serviceid,
        task_status: $rootScope.task_status,
        created_by: $scope.createbuserlist
      };

      if ($scope.isOnline() == true) {
        getNotificationstaff.listAllStaffsTasks().save(
          taskData,
          function(res) {
            angular.forEach(res.results, function(item) {
              item.created = moment(item.created).format(
                "hh:mm A - MMM Do, YYYY"
              );
              item.tasks_id.finish_before = moment(
                item.tasks_id.finish_before
              ).format("ddd, MMM Do, YYYY [at] hh:mm A");
              if (item.tasks_id.task_complete_date) {
                item.tasks_id.task_complete_date = moment(
                  item.tasks_id.task_complete_date
                ).format("ddd, MMM Do, YYYY [at] hh:mm A");
              }
              if (item.tasks_id.task_close_date) {
                item.tasks_id.task_close_date = moment(
                  item.tasks_id.task_close_date
                ).format("ddd, MMM Do, YYYY [at] hh:mm A");
              }
            });
            $scope.messagesJson.msgList = [];
            $scope.messagesJson.unitNumber = "";
            $scope.messagesJson.pageNo = "";
            localStorage.setItem("infiCount1", res.list_count);
            $scope.loadContent = localStorage.getItem("infiCount1");
            if ($scope.msgLength == 0) {
              $scope.msgLength = res.results.length;
            } else {
              $scope.msgLength = $scope.msgLength + res.results.length;
            }
            if ($scope.msgLength == $scope.loadContent) {
              $scope.noMoreItemsAvailable = true;
            } else {
              $scope.noMoreItemsAvailable = false;
            }

            if (res.results.length > 0) {
              angular.forEach(res.results, function(item) {
                var count = 0;
                angular.forEach(res.count_data, function(val) {
                  if (item._id == val._id) {
                    count = val.count;
                  }
                });
                item.unreadthreadVal = count;
              });
              setTimeout(function() {
                $scope.messages = res.results;
              });
              setTimeout(function() {
                if ($scope.searchThisUnit == "") {
                  $scope.page_number = parseInt($scope.page_number) + 1;
                  $scope.messagesJson.globalCount = $scope.loadContent;
                  $scope.messagesJson.defaultCount = $scope.msgLength;
                  $scope.messagesJson.globalPageCount = $scope.page_number;
                  $scope.messagesJson.pageNo = $scope.page_number;
                  $scope.messagesJson.msgAllList = $scope.messages;
                  $scope.messagesJson.emptyIt = false;
                } else {
                  $scope.messagesJson.msgList = $scope.messages;
                  $scope.messagesJson.globalCount = $scope.loadContent;
                  $scope.messagesJson.defaultCount = $scope.msgLength;
                  $scope.page_number = parseInt($scope.page_number) + 1;
                  $scope.messagesJson.unitNumber = $scope.unitNumberKeyWord;
                  $scope.messagesJson.pageNo = $scope.page_number;
                  $scope.messagesJson.emptyIt = false;
                }
              });
            }
            $scope.$broadcast("scroll.refreshComplete");
          },
          function(err) {
            $ionicLoading.hide();
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      } else {
      }
    } else {
      $scope.logout();
    }
  };
  /****************task list refresh ends ****************/

  // =============================================================================
  // Function to Refresh Task List Ends
  // =============================================================================

  // =============================================================================
  // Worker Function To Get Data For Task List Begins
  // =============================================================================

  $scope.getTaskManagerListStaff = function() {
    if ($rootScope.task_status == undefined) {
      $rootScope.task_status = "";
    } else if ($rootScope.task_status) {
      $rootScope.task_status = $rootScope.task_status;
    } else {
      $rootScope.task_status = [1, 2];
    }
    $rootScope.pageno = $scope.page_number;

    if ($rootScope.authoriedUser == true) {
      var taskData = {
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        users_id: $localStorage.User.user_id,
        services_category_id: localStorage.getItem("feature_id"),
        staff_roles_id: $localStorage.User.staff_roles_id,
        page_number: $scope.page_number,
        units_id: $scope.searchThisUnit,
        priority: parseInt($scope.priorValue),
        startdate: $rootScope.start,
        enddate: $rootScope.end,
        service_number: $rootScope.serviceid,
        task_status: $rootScope.task_status,
        created_by: $scope.createbuserlist
      };

      if ($scope.isOnline() == true) {
        $ionicLoading.show();
        getNotificationstaff.listAllStaffsTasks().save(
          taskData,
          function(res) {
            if ($rootScope.searching) {
              $rootScope.totalrecords = res.list_count;
              $scope.closeModal();
            }
            if (res.code == 200) {
              angular.forEach(res.results, function(item) {
                item.created = moment(item.created).format(
                  "hh:mm A - MMM Do, YYYY"
                );
                if (item.tasks_id.finish_before) {
                  item.tasks_id.finish_before = moment(
                    item.tasks_id.finish_before
                  ).format("ddd, MMM Do, YYYY [at] hh:mm A");
                }
                if (item.tasks_id.task_complete_date) {
                  item.tasks_id.task_complete_date = moment(
                    item.tasks_id.task_complete_date
                  ).format("ddd, MMM Do, YYYY [at] hh:mm A");
                }
                if (item.tasks_id.task_close_date) {
                  item.tasks_id.task_close_date = moment(
                    item.tasks_id.task_close_date
                  ).format("ddd, MMM Do, YYYY [at] hh:mm A");
                }
                localStorage.setItem("taskPriority", item.tasks_id.priority);
              });
              $scope.messagesJson.msgList = [];
              $scope.messagesJson.unitNumber = "";
              $scope.messagesJson.pageNo = "";
              $ionicLoading.hide();
              localStorage.setItem("infiCount1", res.list_count);
              $scope.loadContent = localStorage.getItem("infiCount1");

              if ($scope.msgLength == 0) {
                $scope.msgLength = res.results.length;
              } else {
                $scope.msgLength = $scope.msgLength + res.results.length;
              }
              $rootScope.mlength = $scope.msgLength;
              if ($scope.msgLength == $scope.loadContent) {
                $scope.noMoreItemsAvailable = true;
              } else {
                $scope.noMoreItemsAvailable = false;
              }

              if (res.results.length > 0) {
                angular.forEach(res.results, function(item) {
                  var count = 0;
                  angular.forEach(res.count_data, function(val) {
                    if (item._id == val._id) {
                      count = val.count;
                    }
                  });
                  item.unreadthreadVal = count;
                  $scope.messages.push(item);
                });
              }
              $scope.$broadcast("scroll.infiniteScrollComplete");
              setTimeout(function() {
                if ($scope.searchThisUnit == "") {
                  $scope.page_number = parseInt($scope.page_number) + 1;
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
                  $scope.messagesJson.unitNumber = $scope.unitNumberKeyWord;
                  $scope.messagesJson.pageNo = $scope.page_number;
                  $scope.messagesJson.emptyIt = false;
                }
              });
            } else if (res.code == 201) {
              $ionicLoading.hide();
              $scope.alertPop("Alert", res.message);
              $scope.loadContent = 0;
              $scope.msgLength = 0;
              if ($scope.msgLength == $scope.loadContent) {
                $scope.noMoreItemsAvailable = true;
              } else {
                $scope.noMoreItemsAvailable = false;
              }
              $scope.$broadcast("scroll.infiniteScrollComplete");
            }
          },
          function(err) {
            $ionicLoading.hide();
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            $scope.$broadcast("scroll.refreshComplete");
          }
        );
      } else {
        $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
      }
    } else {
      $scope.logout();
    }
  };

  // =============================================================================
  // Worker Function To Get Data For Task List Ends
  // =============================================================================

  // =============================================================================
  // Begins. This Function Is Called Whenever A Tab On Task List Is Clicked
  // =============================================================================

  $scope.sendPriority = function(priority) {
    if ($scope.messagesJson.backToHere == false) {
      $scope.messagesJson.emptyIt = true;
      $scope.messagesJson.priority = priority;
      $scope.loaded = 1;
    } else {
      $scope.loaded = 1;
      $scope.messagesJson.backToHere = false;
    }
  };

  // =============================================================================
  // Ends. This Function Is Called Whenever A Tab On Task List Is Clicked
  // =============================================================================

  // =============================================================================
  // Set Parameters Before Calling Worker Task List Function Begins
  // =============================================================================

  if ($scope.loaded == 1) {
    $scope.loaded = 0;

    if ($scope.messagesJson.emptyIt == true) {
      /*to make the value empty on tab change */
      $localStorage.uid = null;
      $rootScope.start = "";
      $rootScope.end = "";
      $rootScope.serviceid = "";
      $rootScope.packstatus = "";
      $rootScope.work_order_status = "";
      $rootScope.task_status = "";

      $scope.page_number = "0";
      $scope.msgLength = 0;

      $scope.messages = [];
      $scope.searchThisUnit = "";
      $scope.priorValue = $scope.messagesJson.priority;
      localStorage.setItem("taskPriority", $scope.messagesJson.priority);
      $scope.noMoreItemsAvailable = false;
      $scope.loaded == 1;
      $scope.search1 = {
        unit_number: ""
      };
      $scope.show = false;
      $scope.data = {
        show: false
      };
      setTimeout(function() {
        $scope.getTaskManagerListStaff();
      });
    } else {
      if (
        $scope.messagesJson.unitNumber != undefined &&
        $scope.messagesJson.unitNumber != ""
      ) {
        $scope.loadContent = $scope.messagesJson.globalSearchCount;
        $scope.msgLength = $scope.messagesJson.defaultSearchCount;
        if ($scope.msgLength == $scope.loadContent)
          $scope.noMoreItemsAvailable = true;
        else $scope.noMoreItemsAvailable = false;
        $scope.searchThisUnit = $scope.messagesJson.unitID;
        $scope.data = {
          show: false
        };
        if ($scope.messagesJson.unitNumber.length != 0) {
          $scope.show = true;
        }
        $scope.search1 = {
          unit_number: $scope.messagesJson.unitNumber
        };
      } else {
        $scope.search1 = {
          unit_number: ""
        };
        $scope.show = false;
        $scope.searchThisUnit = "";
        $scope.loadContent = $scope.messagesJson.globalCount;
        $scope.msgLength = $scope.messagesJson.defaultCount;
        if ($scope.msgLength == $scope.loadContent)
          $scope.noMoreItemsAvailable = true;
        else $scope.noMoreItemsAvailable = false;
        $scope.messages = $scope.messagesJson.msgAllList;
        $scope.page_number = $scope.messagesJson.globalPageCount;
        $scope.data = {
          show: false
        };
      }
      if (
        $scope.messagesJson.msgList != undefined &&
        $scope.messagesJson.msgList.length != 0
      ) {
        $scope.messages = $scope.messagesJson.msgList;
        $scope.page_number = $scope.messagesJson.pageNo;
      }
    }
  }

  // =============================================================================
  // Set Parameters Before Calling Worker Task List Function Ends
  // =============================================================================

  // =============================================================================
  // Function To Load More Content For List Pages Begins
  // =============================================================================
  $scope.loadMore = function() {
    $scope.getTaskManagerListStaff();
  };

  // =============================================================================
  // Function To Load More Content For List Pages Ends
  // =============================================================================

  $scope.resetpageflag = function() {
    $rootScope.maintainpageflagtask = false;
  };

  // ===========================================================================================
  // TODO Begins: Commenting Out Count As It's Jerky During Tab Navigation. Re-Check In Future.
  // ===========================================================================================

  // /** To display the count for High priority in tabs starts****/
  // $scope.getMyTskManagerTabHighCount = function() {
  //   console.log("High Count");
  //   if ($rootScope.authoriedUser == true) {
  //     var taskData = {
  //       token: $localStorage.User.token,
  //       property_id: $localStorage.User.property_id,
  //       users_id: $localStorage.User.user_id,
  //       services_category_id: localStorage.getItem("feature_id"),
  //       staff_roles_id: $localStorage.User.staff_roles_id,
  //       page_number: "0",
  //       units_id: $scope.searchThisUnit,
  //       priority: 1
  //     };
  //     if ($scope.isOnline() == true) {
  //       $ionicLoading.show();
  //       getNotificationstaff.listAllStaffsTasks().save(
  //         taskData,
  //         function(res) {
  //           if (res.code == 200) {
  //             $ionicLoading.hide();
  //             if (res.results.length > 0) {
  //               var cnt = 0;
  //               angular.forEach(res.results, function(item) {
  //                 var count = 0;
  //                 angular.forEach(res.count_data, function(val) {
  //                   if (item._id == val._id) {
  //                     count = val.count;
  //                     cnt = cnt + count;
  //                   }
  //                 });
  //                 item.unreadthreadVal = count;
  //                 //$scope.messages.push(item);
  //               });
  //               if (cnt > 0) {
  //                 $rootScope.highCount = cnt;
  //               } else {
  //                 $rootScope.highCount = "";
  //               }
  //             }
  //           } else if (res.code == 201) {
  //             $ionicLoading.hide();
  //           }
  //         },
  //         function(err) {
  //           $ionicLoading.hide();
  //           console.log(err);
  //           $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
  //           $scope.$broadcast("scroll.refreshComplete");
  //         }
  //       );
  //     } else {
  //       $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
  //     }
  //   } else {
  //     $scope.logout();
  //   }
  // };

  // /**** To display the count for High priority in tabs ends****/

  // /** To display the count for Medium priority in tabs starts****/
  // $scope.getMyTskManagerTabMediumCount = function() {
  //   console.log("Medium Count");
  //   if ($rootScope.authoriedUser == true) {
  //     var taskData = {
  //       token: $localStorage.User.token,
  //       property_id: $localStorage.User.property_id,
  //       users_id: $localStorage.User.user_id,
  //       services_category_id: localStorage.getItem("feature_id"),
  //       staff_roles_id: $localStorage.User.staff_roles_id,
  //       page_number: "0",
  //       units_id: $scope.searchThisUnit,
  //       priority: 2
  //     };
  //     if ($scope.isOnline() == true) {
  //       $ionicLoading.show();
  //       getNotificationstaff.listAllStaffsTasks().save(
  //         taskData,
  //         function(res) {
  //           if (res.code == 200) {
  //             $ionicLoading.hide();
  //             if (res.results.length > 0) {
  //               var cnt = 0;
  //               angular.forEach(res.results, function(item) {
  //                 var count = 0;
  //                 angular.forEach(res.count_data, function(val) {
  //                   if (item._id == val._id) {
  //                     count = val.count;
  //                     cnt = cnt + count;
  //                   }
  //                 });
  //                 item.unreadthreadVal = count;
  //               });
  //               if (cnt > 0) {
  //                 $rootScope.midiumCount = cnt;
  //               } else {
  //                 $rootScope.midiumCount = "";
  //               }
  //             }
  //           } else if (res.code == 201) {
  //             $ionicLoading.hide();
  //           }
  //         },
  //         function(err) {
  //           $ionicLoading.hide();
  //           console.log(err);
  //           $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
  //           $scope.$broadcast("scroll.refreshComplete");
  //         }
  //       );
  //     } else {
  //       $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
  //     }
  //   } else {
  //     $scope.logout();
  //   }
  // };

  // /**** To display the count for Medium priority in tabs ends****/

  // /** To display the count for normal priority in tabs starts****/
  // $scope.getMyTskManagerTabNormalCount = function() {
  //   console.log("Normal Count");
  //   if ($rootScope.authoriedUser == true) {
  //     var taskData = {
  //       token: $localStorage.User.token,
  //       property_id: $localStorage.User.property_id,
  //       users_id: $localStorage.User.user_id,
  //       services_category_id: localStorage.getItem("feature_id"),
  //       staff_roles_id: $localStorage.User.staff_roles_id,
  //       page_number: "0",
  //       units_id: $scope.searchThisUnit,
  //       priority: 3
  //     };
  //     if ($scope.isOnline() == true) {
  //       $ionicLoading.show();
  //       getNotificationstaff.listAllStaffsTasks().save(
  //         taskData,
  //         function(res) {
  //           if (res.code == 200) {
  //             $ionicLoading.hide();
  //             if (res.results.length > 0) {
  //               var cnt = 0;
  //               angular.forEach(res.results, function(item) {
  //                 var count = 0;
  //                 angular.forEach(res.count_data, function(val) {
  //                   if (item._id == val._id) {
  //                     count = val.count;
  //                     cnt = cnt + count;
  //                   }
  //                 });
  //                 item.unreadthreadVal = count;
  //               });
  //               if (cnt > 0) {
  //                 $rootScope.lowCount = cnt;
  //               } else {
  //                 $rootScope.lowCount = "";
  //               }
  //             }
  //           } else if (res.code == 201) {
  //             $ionicLoading.hide();
  //           }
  //         },
  //         function(err) {
  //           $ionicLoading.hide();
  //           console.log(err);
  //           $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
  //           $scope.$broadcast("scroll.refreshComplete");
  //         }
  //       );
  //     } else {
  //       $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
  //     }
  //   } else {
  //     $scope.logout();
  //   }
  // };

  /**** To display the count for normal priority in tabs ends****/

  // =========================================================================================
  // TODO Ends: Commenting Out Count As It's Jerky During Tab Navigation. Re-Check In Future.
  // =========================================================================================

  // =========================================================================================
  // Search Functions Begins
  // =========================================================================================

  //Get List Of Units From Service
  $scope.items = unitIdsList.units_id;

  /* @function : getlistofcreatedby()
     *  @Creator  : yogini 
     *  @created  : 23032017
     */

  /*To get list of created by user*/

  $scope.getlistofcreatedby = function() {
    var createddata = {
      property_id: $localStorage.User.property_id
      // "services_category_id": localStorage.getItem('feature_id')
    };
    getNotificationstaff.createdBy().save(
      createddata,
      function(res) {
        $scope.cityLocation = [];
        angular.forEach(res.results, function(item, key) {
          item.fullname = item.firstname + " " + item.lastname;
          // if($rootScope.clearsall){
          // }
          if ($scope.createbuserlist)
            console.log(
              $scope.createbuserlist.indexOf({ _id: item.id }),
              "is exists"
            );

          var obj = {
            text: item.fullname,
            id: item._id,
            checked:
              $scope.createbuserlist &&
              $scope.createbuserlist.indexOf({ _id: item.id }) > -1
                ? true
                : false
          };

          $scope.cityLocation.push(obj);
        });
      },
      function(err) {}
    );
  };

  $scope.getlistofcreatedby();

  $rootScope.$on("resetList", function() {
    $scope.getlistofcreatedby();
    setTimeout(function() {
      $rootScope.$emit("callValidate", {});
    }, 1000);
  });
  /*To push the values of created by user in search */

  $scope.onValueChanged = function(value) {
    $scope.createbuserlist = [];

    angular.forEach(value, function(item) {
      $scope.createbuserlist.push({ _id: item.id });
    });
  };

  $scope.blur = false;
  $scope.showIt = function(what) {
    $scope.blur = true;
    $ionicModal
      .fromTemplateUrl("templates/Staff/task/searchmodal.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
  };

  $scope.closeModal = function() {
    $scope.blur = false;
    $rootScope.closing = true;
    if ($scope.modal) {
      $scope.modal.hide();
    }
  };

  // Execute action on hide modal
  $scope.$on("modal.hidden", function() {
    $scope.blur = false;
    // Execute action
  });

  $scope.changeformat = function(start, end) {
    if (start) {
      $rootScope.startdate = moment(start).format("MMMM Do YYYY");
    }
    if (end) {
      $rootScope.enddate = moment(end).format("MMMM Do YYYY");
    }
  };

  $rootScope.closing = false;
  $scope.datevalue = "";
  $scope.endvalue = "";

  $scope.searchdata = function(searchFilter, serviceid, startdate, enddate) {
    $rootScope.searching = true;
    $rootScope.workorderflag = true;

    if (searchFilter) {
      $rootScope.serviceid = serviceid;
    }

    if (startdate) {
      var d = moment(startdate, "MMMM Do YYYY");
      $rootScope.start = d.toISOString();

      if ((startdate && enddate == undefined) || (startdate && enddate == "")) {
        $scope.alertPop("Alert", "Please select Start Date and End Date");
        return;
      }
    }
    if (enddate) {
      if (startdate == enddate) {
        $rootScope.end = moment(enddate).endOf("day");
      } else {
        var e = moment(enddate, "MMMM Do YYYY");
        $rootScope.end = e.toISOString();
      }
    }

    if (startdate && enddate) {
      if (moment($rootScope.end).format() < moment($rootScope.start).format()) {
        $scope.alertPop("Alert", "Invalid date.");
        return;
      }
    }

    $scope.dosearch = true;

    if ($rootScope.unitvalue) {
      $scope.unitNumberKeyWord = $rootScope.unitvalue.unit_number;
      $scope.searchThisUnit = $rootScope.unitvalue._id;
      $scope.messagesJson.unitID = $rootScope.unitvalue._id;
    } else {
      $scope.unitNumberKeyWord = "";
      $scope.searchThisUnit = "";
      $scope.messagesJson.unitID = "";
    }

    $scope.page_number = "0";
    $scope.messages = [];
    $scope.msgLength = 0;
    setTimeout(function() {
      $scope.getTaskManagerListStaff();
    });
  };

  $scope.dosearch = false;

  // =========================================================================================
  // Search Functions Ends
  // =========================================================================================

  // =============================================================================
  // Function to populate Task Details from Task List Begins
  // =============================================================================

  /************************Task Details Function***********/
  $scope.taskDetails = function(value) {
    $rootScope.maintainpageflagtask = true;
    $rootScope.entertaskdetails = true;
    if (
      ionic.Platform.platform() == "ios" ||
      ionic.Platform.platform() == "android"
    ) {
      $cordovaBadge
        .decrease(value.unreadthreadVal)
        .then(function(res) {}, function(err) {});
    }

    $scope.messagesJson.backToHere = true;
    for (i = 0; i < value.to_users_id.length; i++) {
      if (
        value.to_users_id[i].is_read == true &&
        value.to_users_id[i].users_id == $localStorage.User.user_id
      ) {
        localStorage.setItem("makeTrue", false);
      } else if (
        value.to_users_id[i].is_read != true &&
        value.to_users_id[i].users_id == $localStorage.User.user_id
      ) {
        localStorage.setItem("makeTrue", true);
        if ($scope.searchThisUnit != "") {
          angular.forEach($scope.messagesJson.msgList, function(item) {
            var count = 0;
            if (value._id == item._id) {
              item.unreadthreadVal = count;
            }
          });
          angular.forEach($scope.messagesJson.msgAllList, function(item) {
            var count = 0;
            if (value._id == item._id) {
              item.unreadthreadVal = count;
            }
          });
        } else {
          angular.forEach($scope.messagesJson.msgAllList, function(item) {
            var count = 0;
            if (value._id == item._id) {
              item.unreadthreadVal = count;
            }
          });
        }
      }
    }
    localStorage.setItem("taskManagerDetails", value._id);
    localStorage.setItem("taskPriority", value.tasks_id.priority);
    localStorage.setItem("service_id", value.service_id);
    $state.go("taskManagerDetails");
  };

  // =============================================================================
  // Function to populate Task Details from Task List Ends
  // =============================================================================

  $scope.doRefresh = function() {
    $scope.getTaskDetail();
  };

  // ======================================================================================
  // Function to initialize Task Details page Begins. Called From Task Details View HTML
  // ======================================================================================

  $scope.getTaskDetail = function() {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var taskDetailsData = {
        tasks_id: localStorage.getItem("taskManagerDetails"),
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        make_true: localStorage.getItem("makeTrue"),
        users_id: $localStorage.User.user_id
      };

      getNotificationstaff.getTaskDetails().save(
        taskDetailsData,
        function(res) {
          $ionicLoading.hide();
          if (res.code == 200) {
            var assignToFirstName = res.details.assigned_to.firstname;
            var assignToLastName = res.details.assigned_to.lastname;
            var assignToFullName = assignToFirstName + " " + assignToLastName;
            var loclStorageFirstname = $localStorage.User.firstname;
            var loclStorageLastname = $localStorage.User.lastname;
            var loclStorageFullName =
              loclStorageFirstname + " " + loclStorageLastname;
            var taskStatus = res.details.task_status;
            var taskType = res.details.task_type;
            //Show Complete Task Button
            if (
              loclStorageFullName == assignToFullName &&
              taskType == 1 &&
              taskStatus == 1
            ) {
              $scope.showCompleteBtn = true;
            } else {
              $scope.showCompleteBtn = false;
            }
            //Show Edit Entry Buttons
            if (
              loclStorageFullName == assignToFullName &&
              taskType == 1 &&
              taskStatus == 2
            ) {
              $scope.showEditEntry = true;
            } else {
              $scope.showEditEntry = false;
            }
            //Show Enter Estimate Button
            if (
              loclStorageFullName == assignToFullName &&
              taskType == 2 &&
              taskStatus == 1
            ) {
              $scope.showEstimateBtn = true;
            } else {
              $scope.showEstimateBtn = false;
            }
            //Show Edit Estimate Button
            if (
              loclStorageFullName == assignToFullName &&
              taskType == 2 &&
              taskStatus == 2
            ) {
              $scope.showEditEstimate = true;
            } else {
              $scope.showEditEstimate = false;
            }
            //Show Edit & Delete Task Button
            if ($scope.isManager && taskStatus == 1) {
              $scope.showEditBtn = true;
              $scope.showDeleteBtn = true;
            } else {
              $scope.showEditBtn = false;
              $scope.showDeleteBtn = false;
            }
            //Show Close Task Button
            if ($scope.isManager && taskStatus == 2) {
              $scope.showCloseBtn = true;
            } else {
              $scope.showCloseBtn = false;
            }

            $scope.taskDetails = res.details;

            $scope.createdDate = moment(res.details.created).format(
              "ddd, MMM Do, YYYY [at] hh:mm A"
            );
            $scope.finish_before = moment(res.details.finish_before).format(
              "ddd, MMM Do, YYYY [at] hh:mm A"
            );
            if (res.details.task_complete_date) {
              $scope.completeDate = moment(
                res.details.task_complete_date
              ).format("ddd, MMM Do, YYYY [at] hh:mm A");
            }
            if (res.details.task_close_date) {
              $scope.closedDate = moment(res.details.task_close_date).format(
                "ddd, MMM Do, YYYY [at] hh:mm A"
              );
            }

            $scope.threadData = res.thread_data;
            angular.forEach($scope.threadData, function(item) {
              var date = moment(item.created).format("MMM Do, YYYY");
              item.createdDate = date;
            });
          } else {
            $scope.alertPop("Alert", res.message, "sideMenuStaff.features");
          }
        },
        function(err) {
          $ionicLoading.hide();
          $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
      $scope.$broadcast("scroll.refreshComplete");
    } else {
      $scope.logout();
    }
  };

  // ====================================================================================
  // Function to initialize Task Details page Begins. Called From Task Details View HTML
  // ====================================================================================

  // =============================================================================
  // List All Staff Members in Task Add Begins
  // =============================================================================
  $scope.listAllStaffs = function() {
    $ionicLoading.show();
    var listStaffsData = {
      property_id: $localStorage.User.property_id,
      user_type_id: $localStorage.User.user_type_id
    };
    $scope.listStaffsDatas = [];
    contactManagementServicesStaff.contactListing().save(
      listStaffsData,
      function(res) {
        $ionicLoading.hide();
        if (res.code == 200) {
          $scope.listStaffsDatas = res.result;
        } else {
          $scope.alertPop("Alert", "Something went wrong!");
        }
      },
      function(err) {
        $ionicLoading.hide();
        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
      }
    );
  };
  // =============================================================================
  // List All Staff Members in Task Add Ends
  // =============================================================================

  $scope.addTaskData = {};

  // =============================================================================
  // Add Task Begins
  // =============================================================================
  $scope.addTask = function(addTaskData, datetimeValue) {
    var addTaskFinishB4Time = new Date(datetimeValue).toISOString();
    var addTaskData = {
      property_id: $localStorage.User.property_id,
      user_type_id: $localStorage.User.user_type_id,
      service_id: globalShareService.globalShareVars.addTaskServiceId,
      firstname: $localStorage.User.firstname,
      lastname: $localStorage.User.lastname,
      users_id: $localStorage.User.user_id,
      assigned_to_staff_id: addTaskData.assigned_to_staff_id,
      task_type: addTaskData.task_type,
      finish_before: addTaskFinishB4Time,
      description: addTaskData.description,
      title: addTaskData.title,
      priority: addTaskData.priority,
      private_note: addTaskData.private_note
    };
    $ionicLoading.show();
    getNotificationstaff.addStaffsTaskByManager().save(
      addTaskData,
      function(res) {
        $ionicLoading.hide();
        if (res.code == 200) {
          $scope.listStaffsDatas = res.result;
          $scope.alertPop("Alert", res.message);
          localStorage.setItem("taskManagerDetails", res.data._id);
          $scope.getTaskDetail();
          $state.go("taskManagerDetails");
        } else {
          $scope.alertPop("Alert", res.message);
        }
      },
      function(err) {
        $ionicLoading.hide();
        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
      }
    );
  };

  // =============================================================================
  // Add Task Ends
  // =============================================================================

  // =============================================================================
  // Delete Task Begins
  // =============================================================================

  /**** delete the task by manager ****/
  $scope.deleteTaskByManager = function(taskId, estimateAccptStatus) {
    if (estimateAccptStatus == 1) {
      $scope.alertPop(
        "Alert",
        "Can't delete Task because the estimate is already approved !"
      );
    } else {
      $scope.closeWoPop = $ionicPopup.confirm({
        title: "Confirm",
        cssClass: "WoMngrPopHead",
        template: "Are you sure you want to delete the Task?"
      });
      $scope.closeWoPop.then(function(res) {
        if (res) {
          var deleteTaskData = {
            tasks_id: taskId,
            users_id: $localStorage.User.user_id,
            firstname: $localStorage.User.firstname,
            lastname: $localStorage.User.lastname,
            property_id: $localStorage.User.property_id
          };
          $ionicLoading.show();
          getNotificationstaff.deleteStaffsTaskByManager().save(
            deleteTaskData,
            function(res) {
              $ionicLoading.hide();
              if (res.code == 200) {
                $scope.alertPop("Alert", res.message, "woDetailspgStaff");
              } else {
                $scope.alertPop("Alert", res.message);
              }
            },
            function(err) {
              $ionicLoading.hide();
              $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            }
          );
        } else {
          console.log("You are not sure");
        }
      });
    }
  };

  // =============================================================================
  // Delete Task Ends
  // =============================================================================

  // =============================================================================
  // Interim Function Call from Details to Edit Task Begins
  // =============================================================================
  $scope.goToEditTask = function(editTaskData) {
    $rootScope.datetimeValue = new Date(editTaskData.finish_before);
    $rootScope.editedTaskData = {};

    for (var k in editTaskData) $rootScope.editedTaskData[k] = editTaskData[k];

    $state.go("editTaskManager");
  };

  // =============================================================================
  // Interim Function Call from Details to Edit Task Ends
  // =============================================================================

  // =============================================================================
  // Edit Task Begins
  // =============================================================================

  $scope.editTask = function(editedTaskData, datetimeValueEdit) {
    var editTaskFinishB4Time = new Date(datetimeValueEdit).toISOString();
    $scope.assignByName =
      $localStorage.User.firstname + " " + $localStorage.User.lastname;
    var editPostData = {
      tasks_id: editedTaskData._id,
      title: editedTaskData.title,
      assigned_to: editedTaskData.assigned_to._id,
      task_type: editedTaskData.task_type,
      finish_before: editTaskFinishB4Time,
      description: editedTaskData.description,
      priority: editedTaskData.priority,
      private_note: editedTaskData.private_note,
      assigned_by: $localStorage.User.user_id,
      assigned_by_name: $scope.assignByName
    };
    $ionicLoading.show();
    getNotificationstaff.editStaffsTaskByManager().save(
      editPostData,
      function(res) {
        $ionicLoading.hide();
        if (res.code == 200) {
          $scope.alertPop("Alert", res.message, "taskManagerDetails");
        } else if (res.code == 501) {
          $scope.alertPop("Alert", res.message);
        } else {
          $scope.alertPop("Alert", "Something went wrong!");
        }
      },
      function(err) {
        $ionicLoading.hide();
        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
      }
    );
  };

  // =============================================================================
  // Edit Task Ends
  // =============================================================================

  // =============================================================================
  // Interim Function From Details To Complete Work Task Begins
  // =============================================================================

  $scope.cmpltWrkod = function(index) {
    localStorage.setItem("task_id1", index._id);
    localStorage.setItem("service_id", index.service_id._id);
    localStorage.setItem("priority", index.priority);
    $state.go("completeTaskByManager");
  };

  // =============================================================================
  // Interim Function From Details To Complete Work Task Ends
  // =============================================================================

  // =============================================================================
  // Complete Work Task Begins
  // =============================================================================

  $scope.closeWorkData = {};

  $scope.sendclsreq = function(data) {
    if (data.hours == undefined || data.hours == "") data.hours = 0;

    if (data.cost == undefined || data.cost == "") data.cost = 0;

    var val = data.hours;
    var hours = 0;
    var mins = 0;

    if (val > 0) {
      val = val / 1000; //convert to secs from millisecs
      hours = Math.floor(val / 3600); //get hrs string
      mins = val % 3600 / 60; // get mins string
    }

    var timestring = "";
    if (mins < 10) timestring = hours + ":0" + mins;
    else timestring = hours + ":" + mins;

    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var cmpltWkData = {
        tasks_id: localStorage.getItem("task_id1"),
        users_id: $localStorage.User.user_id,
        details: data.details,
        hours_effort: timestring,
        parts_used: data.tools,
        cost: data.cost.toString(),
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname,
        service_id: localStorage.getItem("service_id"),
        priority: localStorage.getItem("priority"),
        imagesa: $scope.topic.photos,
        task_complete_date: Date.now(),
        property_id: $localStorage.User.property_id
      };
      getNotificationstaff.taskcmplt().save(
        cmpltWkData,
        function(res) {
          if ((res.code = 200)) {
            $ionicLoading.hide();
            $scope.alertPop("Alert", res.message, "taskManagerDetails");
            $rootScope.editTaskDetails1 = {};
          }
        },
        function(err) {
          $ionicLoading.hide();
          $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
    } else {
      $scope.logout();
    }
  };
  // =============================================================================
  // Complete Work Task Ends
  // =============================================================================

  // =============================================================================
  // Interim Function Call from Details to Edit Entry for Work Task Begins
  // =============================================================================

  $scope.editEntryByManager = function(taskDetails) {
    $rootScope.closeTaskDetails = {};

    localStorage.setItem("taskServiceId", taskDetails.service_id._id);
    localStorage.setItem("taskId", taskDetails._id);
    localStorage.setItem("priority", taskDetails.priority);

    if (taskDetails.closure[0]) {
      //Copy all attributes
      for (var k in taskDetails.closure[0]) {
        $rootScope.closeTaskDetails[k] = taskDetails.closure[0][k];
      }
      //Convert hours string to milliseconds
      var hours = taskDetails.closure[0].hours;
      if (hours.includes(":")) {
        var hourstr = hours.split(":", 2)[0];
        var minstr = hours.split(":", 2)[1];
        $rootScope.closeTaskDetails.hours =
          (parseInt(hourstr) * 3600 + parseInt(minstr) * 60) * 1000;
      } else {
        $rootScope.closeTaskDetails.hours = 0;
      }
    }
    $state.go("editEntryForWorkTask");
  };

  // =============================================================================
  // Interim Function Call from Details to Edit Entry for Work Task Ends
  // =============================================================================

  // =============================================================================
  // Update Entry For Work Task Begins
  // =============================================================================
  $scope.updateEntryForWorkTask = function(updateEntry) {
    var workTask = {};
    $scope.oldImg = [];
    if (updateEntry.images) {
      if (updateEntry.images.length > 0) {
        $scope.oldImg = updateEntry.images;
      }
    } else {
      $scope.oldImg = [];
    }

    if (updateEntry.hours == undefined || updateEntry.hours == "")
      updateEntry.hours = 0;

    if (updateEntry.cost == undefined || updateEntry.cost == "")
      updateEntry.cost = 0;

    var val = updateEntry.hours;
    var hours = 0;
    var mins = 0;

    if (val > 0) {
      val = val / 1000; //convert to secs from millisecs
      hours = Math.floor(val / 3600); //get hrs string
      mins = val % 3600 / 60; // get mins string
    }

    var timestring = "";
    if (mins < 10) timestring = hours + ":0" + mins;
    else timestring = hours + ":" + mins;

    //Setting Task ID To Route To Task Manager Details After Edit Success
    localStorage.setItem("taskManagerDetails", localStorage.getItem("taskId"));

    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      workTask = {
        tasks_id: localStorage.getItem("taskId"),
        users_id: $localStorage.User.user_id,
        details: updateEntry.notes,
        hours_effort: timestring,
        parts_used: updateEntry.parts,
        cost: updateEntry.cost,
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname,
        service_id: localStorage.getItem("taskServiceId"),
        priority: localStorage.getItem("priority"),
        is_edit: true,
        old_images: $scope.oldImg,
        imagesa: $scope.topic.photos,
        deleted_images: $scope.deletedNewsImages,
        property_id: $localStorage.User.property_id
      };

      getNotificationstaff.taskcmplt().save(
        workTask,
        function(res) {
          $ionicLoading.hide();
          if (res.code == 200) {
            $rootScope.closeTaskDetails = {};

            $scope.alertPop("Alert", res.message, "taskManagerDetails");
          } else {
            $scope.alertPop("Alert", res.message);
          }
        },
        function(err) {
          $ionicLoading.hide();
          $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
    } else {
      $scope.logout();
    }
  };

  // =============================================================================
  // Update Entry For Work Task Ends
  // =============================================================================

  // =============================================================================
  // Interim Function From Details To Complete Estimate Task Begins
  // =============================================================================

  $scope.estimateTask = function(index) {
    $rootScope.editTaskDetails1 = { cost: "", hours: "" };
    localStorage.setItem("task_id1", index._id);
    localStorage.setItem("service_id", index.service_id._id);
    localStorage.setItem("priority", index.priority);
    $state.go("estimateTaskManager");
  };

  // =============================================================================
  // Interim Function From Details To Complete Estimate Task Ends
  // =============================================================================

  // =============================================================================
  // Send Estimate Begins
  // =============================================================================

  $scope.sendestimation = function(data) {
    if (data.hours == undefined || data.hours == "") data.hours = 0;

    if (data.cost == undefined || data.cost == "") data.cost = 0;

    var val = data.hours;
    var hours = 0;
    var mins = 0;

    if (val > 0) {
      val = val / 1000; //convert to secs from millisecs
      hours = Math.floor(val / 3600); //get hrs string
      mins = val % 3600 / 60; // get mins string
    }

    var timestring = "";
    if (mins < 10) timestring = hours + ":0" + mins;
    else timestring = hours + ":" + mins;

    //Setting Task ID To Route To Task Manager Details After Edit Success
    localStorage.setItem(
      "taskManagerDetails",
      localStorage.getItem("task_id1")
    );

    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var estimatedTaskData = {
        tasks_id: localStorage.getItem("task_id1"),
        users_id: $localStorage.User.user_id,
        details: data.details,
        hours_effort: timestring,
        parts_used: data.tools,
        cost: data.cost,
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname,
        service_id: localStorage.getItem("service_id"),
        priority: localStorage.getItem("priority"),
        imagesa: $scope.topic.photos,
        task_complete_date: Date.now(),
        property_id: $localStorage.User.property_id
      };

      getNotificationstaff.taskestimate().save(
        estimatedTaskData,
        function(res) {
          $ionicLoading.hide();
          if ((res.code = 200)) {
            $rootScope.editTaskDetails1 = { cost: "", hours: "" };
            $scope.alertPop("Alert", res.message, "taskManagerDetails");
          }
        },
        function(err) {
          $ionicLoading.hide();
          $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
    } else {
      $scope.logout();
    }
  };

  // =============================================================================
  // Send Estimate Ends
  // =============================================================================

  // =============================================================================
  // Interim Function From Details To Edit Entry for Estimate Task Begins
  // =============================================================================

  $scope.editEstimateByManager = function(taskDetails) {
    localStorage.setItem("taskServiceId", taskDetails.service_id._id);
    localStorage.setItem("taskId", taskDetails._id);
    $rootScope.editTaskDetails1 = taskDetails.estimation[0];
    //Convert hours string to milliseconds
    var hours = $rootScope.editTaskDetails1.hours;
    if (hours.includes(":")) {
      var hourstr = hours.split(":", 2)[0];
      var minstr = hours.split(":", 2)[1];
      $rootScope.editTaskDetails1.hours =
        (parseInt(hourstr) * 3600 + parseInt(minstr) * 60) * 1000;
    } else {
      $rootScope.editTaskDetails1.hours = 0;
    }
    $state.go("editestimateTaskManager");
  };

  // =============================================================================
  // Interim Function From Details To Edit Entry for Estimate Task Ends
  // =============================================================================

  // =============================================================================
  // Update Entry For Estimate Begins
  // =============================================================================

  $scope.updateEstimate = function(updateEstimation) {
    $scope.editedImages = [];
    $scope.oldImg = [];

    if (updateEstimation.images) {
      if (updateEstimation.images.length > 0) {
        $scope.oldImg = updateEstimation.images;
      }
    } else {
      $scope.oldImg = [];
    }

    if (updateEstimation.hours == undefined || updateEstimation.hours == "")
      updateEstimation.hours = 0;

    if (updateEstimation.cost == undefined || updateEstimation.cost == "")
      updateEstimation.cost = 0;

    var val = updateEstimation.hours;
    var hours = 0;
    var mins = 0;

    if (val > 0) {
      val = val / 1000; //convert to secs from millisecs
      hours = Math.floor(val / 3600); //get hrs string
      mins = val % 3600 / 60; // get mins string
    }

    var timestring = "";
    if (mins < 10) timestring = hours + ":0" + mins;
    else timestring = hours + ":" + mins;
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      editEsitmate = {
        tasks_id: localStorage.getItem("taskId"),
        users_id: $localStorage.User.user_id,
        details: updateEstimation.notes,
        hours_effort: timestring,
        parts_used: updateEstimation.parts,
        cost: updateEstimation.cost,
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname,
        service_id: localStorage.getItem("taskServiceId"),
        priority: localStorage.getItem("priority"),
        is_edit: true,
        old_images: $scope.oldImg,
        imagesa: $scope.topic.photos,
        deleted_images: $scope.deletedNewsImages,
        property_id: $localStorage.User.property_id
      };

      getNotificationstaff.taskestimate().save(
        editEsitmate,
        function(res) {
          $ionicLoading.hide();
          if (res.code == 200) {
            $rootScope.editTaskDetails1 = {};
            $scope.alertPop("Alert", res.message, "taskManagerDetails");
          } else {
            $scope.alertPop("Alert", res.message);
          }
        },
        function(err) {
          $ionicLoading.hide();
          $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        }
      );
    } else {
      $scope.logout();
    }
  };
  // =============================================================================
  // Update Entry For Estimate Ends
  // =============================================================================

  // =============================================================================
  // Close Task Begins
  // =============================================================================

  $scope.closeTaskByMngr = function(closeTaskId) {
    $scope.closeWoPop = $ionicPopup.confirm({
      title: "Confirm",
      cssClass: "WoMngrPopHead",
      template: "Are you sure you want to Close the Task?"
    });
    $scope.closeWoPop.then(function(res) {
      var loclStorageFirstname = $localStorage.User.firstname;
      var loclStorageLastname = $localStorage.User.lastname;
      if (res) {
        var closeTaskData = {
          tasks_id: closeTaskId,
          users_id: $localStorage.User.user_id,
          firstname: $localStorage.User.firstname,
          lastname: $localStorage.User.lastname,
          task_close_date: Date.now()
        };
        $ionicLoading.show();
        getNotificationstaff.closeStaffsTaskByManager().save(
          closeTaskData,
          function(res) {
            $ionicLoading.hide();
            if (res.code == 200) {
              $scope.alertPop("Alert", res.message);
              $scope.getTaskDetail();
              $state.go("taskManagerDetails");
            } else {
              $scope.alertPop("Alert", res.message);
              $scope.getTaskDetail();
              $state.go("taskManagerDetails");
            }
          },
          function(err) {
            $ionicLoading.hide();
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      } else {
        console.log("You are not sure");
      }
    });
  };

  // =============================================================================
  // Close Task Ends
  // =============================================================================

  $scope.clearclsreq = function(data) {
    $rootScope.editTaskDetails1 = {};
    $rootScope.closeTaskDetails = {};
  };

  /*******************task detaisl***********/
  $scope.goTaskMngrDetails = function(id) {
    localStorage.setItem("service_id", id);
    $state.go("woDetailspgStaff");
  };

  // =============================================================================
  // Images Section Begins
  // =============================================================================

  $scope.openImageZoom = function(images, index) {
    $scope.previewImages = [];
    angular.forEach(images, function(item) {
      $scope.previewImages.push($rootScope.host_url_global + "/" + item.url);
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

  /*Get Clicked Image Start */
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
  /*Get Clicked Image Ends */
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
  //Function name: openImageZoom1
  //use: This function is use for open image as with gallery image.
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
  //use for close the gallery image modal
  $scope.closeGaleryModal = function() {
    $scope.attachmentModal1.hide();
  };
  //This is used for remove an image from list
  $scope.removeImg = function(index) {
    $ionicPopup
      .confirm({
        title: "Alert",
        template: "Are you sure you want to delete this image?",
        cssClass: "my-custom-popup-staff"
      })
      .then(function(res) {
        if (res == true) {
          $scope.topic.photos.splice(index, 1);
          $ionicScrollDelegate.scrollBottom(true);
        }
      });
  };
  $scope.removeEditImage = function(index, id) {
    $ionicPopup
      .confirm({
        title: "Alert",
        template: "Are you sure you want to delete this image?",
        cssClass: "my-custom-popup-staff"
      })
      .then(function(res) {
        if (res == true) {
          if ($rootScope.closeTaskDetails) {
            $rootScope.closeTaskDetails.images.splice(index, 1);
          }
          if ($rootScope.editTaskDetails1) {
            $rootScope.editTaskDetails1.images.splice(index, 1);
          }
          $scope.deletedNewsImages.push(id);
          $ionicScrollDelegate.scrollBottom(true);
        }
      });
  };

  // =============================================================================
  // Images Section Ends
  // =============================================================================

  // =============================================================================
  // Close Open Popups On Push Notifications Begins
  // =============================================================================

  /* @purpose : handle event on alert
     *  @Creator :yogini 
     *  @created  : 06042017
     */

  $rootScope.$on("child", function(event, data) {
    if ($scope.closeWoPop) {
      $scope.closeWoPop.close();
    }
  });
  /**** delete the task by manager ends here ****/

  // =============================================================================
  // Close Open Popups On Push Notifications Ends
  // =============================================================================

  // =============================================================================
  // Footer Section Begins
  // =============================================================================
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

  /****************************task thread Reply********************/
  $scope.replyObj = {};
  $scope.staffName = $localStorage.User.firstname;
  $scope.sentText = new Array();
  $scope.retrievedText = new Array();
  $scope.retrievedDate = new Array();
  $scope.residentName = [];
  $scope.retrievedId = [];
  $scope.residentLastName = [];
  $scope.staff_id = $localStorage.User.user_id;
  $scope.sentDate = new Array();
  $scope.srcImages = [];
  $scope.reply = function(text, index) {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var replydata = {
        message: text,
        users_id: $localStorage.User.user_id,
        token: $localStorage.User.token,
        device_info: $scope.ConstantsInfo(),
        user_type_id: $localStorage.User.user_type_id,
        property_id: $localStorage.User.property_id,
        tasks_id: localStorage.getItem("taskManagerDetails"),
        user_type_id: $localStorage.User.user_type_id,
        priority: localStorage.getItem("taskPriority"),
        service_id: localStorage.getItem("service_id"),
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname
      };
      if ($scope.isOnline() == true) {
        getNotificationstaff.taskReply().save(
          replydata,
          function(res) {
            $ionicLoading.hide();
            angular.forEach($scope.messagesJson.msgList, function(item) {
              var count = 0;
              if ($scope.taskDetails._id == item._id) {
                item.message = text;
              }
            });
            angular.forEach($scope.messagesJson.msgAllList, function(item) {
              var count = 0;
              if ($scope.taskDetails._id == item._id) {
                item.message = text;
              }
            });
            $scope.sentText[index] = text;
            $scope.staffName = $localStorage.User.firstname;
            $scope.staffLastName = $localStorage.User.lastname;
            $scope.prflImg = $localStorage.User.profile_img;
            $scope.bgColor = $localStorage.User.color;
            $scope.user_type_id = $localStorage.User.user_type_id;
            $scope.sentDate[index] = Date.now();
            $scope.staff = true;
            $scope.resident = false;
            $scope.replyObj.replytext = "";
            $ionicScrollDelegate.scrollBottom(true);
            $timeout(function() {
              $ionicScrollDelegate.scrollBottom(true);
            }, 300);
          },
          function(err) {
            $ionicLoading.hide();
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
          }
        );
      } else {
        $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
      }
    } else {
      $scope.logout();
    }
  };

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
  // Footer Section Ends
  // =============================================================================
});
