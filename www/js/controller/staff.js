angular
  .module("staff.controllers", [])
  /*******************************HeaderController for  Staff section******************************************/

  .controller("HeaderStaffCtrl", function(
    $scope,
    $window,
    staffFeatureList,
    notificationStaffList,
    notificationStaffTaskList,
    $ionicModal,
    $ionicScrollDelegate,
    $cordovaBadge,
    notifyCount,
    loginService,
    $cordovaNetwork,
    getFeatures,
    $rootScope,
    logoutService,
    $rootScope,
    $ionicActionSheet,
    $ionicPopup,
    CONFIG,
    $state,
    $localStorage,
    buzzaguessService,
    $ionicHistory,
    getNotificationstaff,
    $ionicLoading,
    $cordovaDevice,
    $ionicConfig
  ) {
    /* @function : for search criteria()
     *  @Creator  :yogini 
     *  @created  : 20022017
     */
    /********************code for search criteris templates starts*************/

    $scope.data = {
      show: false
    };
    /*modified condition to make searchfilter empty*/

    if (localStorage.getItem("unitIds") != 0) {
      console.log("hey yogini", $rootScope.clearsall);
      $scope.searchFilter = {};
      if ($rootScope.clearsall != true) {
        $scope.searchFilter = {
          unit_number: localStorage.getItem("unit_Number")
        };
      } else {
        $scope.searchFilter = { unit_number: "" };
      }
    } else {
      $scope.searchFilter = {};
      localStorage.setItem("unit_Number", "");
      $scope.searchFilter = { unit_number: "" };
      console.log($scope.searchFilter.unit_number);
    }
    $scope.scrollTop = function(filterText) {
      console.log(filterText.length);
      if (filterText.length > 0) {
        $scope.data.show = true;
      }
      if (filterText.length == 0) {
        localStorage.setItem("unit_Number", "");
        $scope.data.show = false;
      }
      $ionicScrollDelegate.resize();
    };
    $scope.showToggle = function() {
      console.log("**************8685");
      $scope.searchFilter = { unit_number: "" };
      localStorage.setItem("unit_Number", "");
      if ($scope.data.show == false) $scope.data.show = true;
      else $scope.data.show = false;
    };
    $scope.data = {
      show: false
    };
    $scope.clickedItem = function(item) {
      console.log(item);
      $scope.searchFilter.unit_number = item.unit_number;
      localStorage.setItem("unit_Number", item.unit_number);
      localStorage.setItem("unitIds", item._id);
      $scope.GuestNameObject.unit_id = item.unit_number;
      $scope.data.show = false;
    };
    $scope.clickedItem1 = function(item) {
      if ($rootScope.clearsall) {
        $rootScope.clearsall = false;
      }
     
      $rootScope.unitvalue = item;
      $localStorage.uid = item._id;
      $scope.searchFilter.unit_number = item.unit_number;
      localStorage.setItem("unit_Number", item.unit_number);
      localStorage.setItem("unitIds", item._id);
      $scope.data.show = false;
    };

    /* @function : showresponsedata()
     *  @Creator  :yogini
     *  @created  : 29032017
     *  @purpose : navigate to edit package 
     */

    $scope.showresponsedata = function() {
      if ($rootScope.editpackagedata) {
        $scope.searchFilter.unit_number =
          $rootScope.editpackagedata.data.units_id.unit_number;
        $rootScope.unitid = $rootScope.editpackagedata.data.units_id._id;
        $rootScope.unitno =
          $rootScope.editpackagedata.data.units_id.unit_number;
        $scope.resident.name =
          $rootScope.editpackagedata.data.firstname +
          " " +
          $rootScope.editpackagedata.data.lastname;
        $rootScope.package_img = $rootScope.editpackagedata.package_image;
        if ($rootScope.editpackagedata.carrier) {
          $scope.resident.carrier = $rootScope.editpackagedata.carrier;
        } else {
          $scope.resident.carrier = "General";
        }
        console.log("showng2", JSON.stringify($scope.resident, null, 4));
      }
    };

    // milestone v2.2
    $scope.moveToStaffClearNoti = function() {
      console.log("go");
      $state.go("staffClearNoti");
    };

    $rootScope.clearsall = false;

    $scope.clearAll = function(searchFilter) {
      $scope.allStatus.all = false;
      $rootScope.clearsall = true;
      $localStorage.clearAll = true;
      $rootScope.$emit("resetList", {});
      console.log("clearing");
      localStorage.setItem("unitIds", 0);

      // $scope.startdate = '';
      // $scope.enddate = '';
      searchFilter.serviceid = "";
      searchFilter.unit_number = "";
      $scope.searchFilter.unit_number = "";
      $scope.guestname = "";
      $scope.searchThisUnit = "";
      $rootScope.closing = true;
      $localStorage.uid = null;
      $rootScope.start = "";
      $rootScope.end = "";
      $rootScope.startdate = "";
      $rootScope.enddate = "";
      $rootScope.serviceid = "";
      $rootScope.packstatus = "";
      $rootScope.work_order_status = "";
      $scope.packagestatus.pickedup = false;
      $scope.packagestatus.notpickedup = false;
      $rootScope.unitvalue = "";

      /* to make reservation status false */
      if ($scope.reservationstatus) {
        $scope.reservationstatus.pending = false;
        $scope.reservationstatus.confirmed = false;
        $scope.reservationstatus.declined = false;
        $scope.reservationstatus.canceled = false;
        $scope.reservationstatus.requestCanceled = false;
      }

      /* to make workorder status false */
      if ($scope.taskstatus) {
        $scope.taskstatus.progress = false;
        $scope.taskstatus.completed = false;
        $scope.taskstatus.closed = false;
      }

      /*To manage task mangement status*/
      if ($scope.taskmanger) {
        $scope.taskmanger.progress = false;
        $scope.taskmanger.completed = false;
        $scope.taskmanger.closed = false;
      }
    };

    $scope.reset = function(value) {
      $localStorage.uid = null;
      $rootScope.start = "";
      $rootScope.end = "";
      $rootScope.startdate = "";
      $rootScope.enddate = "";
      $scope.serviceid = "";
      $scope.searchFilter.unit_number = "";
      localStorage.setItem("unitIds", 0);
      $rootScope.clearsall = false;
      $rootScope.unitvalue = "";
      $rootScope.reset = true;
      if (value == "package") {
        $scope.packagestatus.pickedup = false;
        $scope.packagestatus.notpickedup = true;
        $localStorage.packstatus = 1;
      } else if (value == "reserve") {
        $scope.reservationstatus.pending = true;
        $scope.reservationstatus.confirmed = false;
        $scope.reservationstatus.declined = false;
        $scope.reservationstatus.canceled = false;
        $scope.reservationstatus.requestCanceled = true;
      } else if (value == "workorder") {
        $scope.taskstatus.progress = true;
        $scope.taskstatus.completed = true;
        $scope.taskstatus.closed = false;
      } else if (value == "task") {
        $scope.taskmanger.progress = true;
        $scope.taskmanger.completed = true;
        $scope.taskmanger.closed = false;
      }
    };

    $scope.taskstatus = {};
    if ($rootScope.searching) {
      $scope.taskstatus = $rootScope.storetstaus;
    } else {
      $scope.taskstatus.progress = true;
      $scope.taskstatus.completed = true;
      $scope.taskstatus.closed = false;
    }

    /* @function : checkAllreservation,checkpendingres,checkconfirmedres,checkdeclinedres
     *  @Creator  :yogini 
     *  @created  : 20022017
     *  @purpose : to toggle reservation status on click
     */
    $scope.reservationstatus = {};

    if ($rootScope.searching) {
      $scope.reservationstatus = $rootScope.storerstaus;
    } else {
      $scope.reservationstatus.pending = true;
      $scope.reservationstatus.confirmed = false;
      $scope.reservationstatus.declined = false;
      $scope.reservationstatus.canceled = false;
      $scope.reservationstatus.requestCanceled = true;
    }

    $scope.checkAllreservation = function(value) {
      $rootScope.clearsall = false;
      if (value) {
        $scope.reservationstatus.pending = true;
        $scope.reservationstatus.confirmed = true;
        $scope.reservationstatus.declined = true;
        $scope.reservationstatus.canceled = true;
        $scope.reservationstatus.requestCanceled = true;
        $scope.rstaus = $scope.reservationstatus;
      } else {
        $scope.reservationstatus.pending = false;
        $scope.reservationstatus.confirmed = false;
        $scope.reservationstatus.declined = false;
        $scope.reservationstatus.canceled = false;
        $scope.reservationstatus.requestCanceled = false;
        $scope.rstaus = $scope.reservationstatus;
      }

      $scope.managereservationstatus();
    };

    $scope.checkpendingres = function(value, type) {
      $rootScope.clearsall = false;

      if (value.pending == false && type == 1) {
        $scope.reservationstatus.pending = true;
        $scope.rstaus = $scope.reservationstatus;
      } else {
        $scope.reservationstatus.pending = false;
        $scope.rstaus = $scope.reservationstatus;
      }

      $scope.managereservationstatus();
    };

    $scope.checkconfirmedres = function(value, type) {
      $rootScope.clearsall = false;

      if (value.confirmed == false && type == 2) {
        $scope.reservationstatus.confirmed = true;
        $scope.rstaus = $scope.reservationstatus;
      } else {
        $scope.reservationstatus.confirmed = false;
        $scope.rstaus = $scope.reservationstatus;
      }

      $scope.managereservationstatus();
    };

    $scope.checkdeclinedres = function(value, type) {
      $rootScope.clearsall = false;

      console.log("value", value, type);
      if (value.declined == false && type == 3) {
        $scope.reservationstatus.declined = true;
        $scope.rstaus = $scope.reservationstatus;
      } else {
        $scope.reservationstatus.declined = false;
        $scope.rstaus = $scope.reservationstatus;
      }

      $scope.managereservationstatus();
    };

    $scope.checkCanceled = function(value, type) {
      $rootScope.clearsall = false;

      if (value.canceled == false && type == 5) {
        $scope.reservationstatus.canceled = true;
        $scope.rstaus = $scope.reservationstatus;
      } else {
        $scope.reservationstatus.canceled = false;
        $scope.rstaus = $scope.reservationstatus;
      }

      $scope.managereservationstatus();
    };

    $scope.checkrequestCanceled = function(value, type) {
      $rootScope.clearsall = false;
      if (value.requestCanceled == false && type == 4) {
        $scope.reservationstatus.requestCanceled = true;
        $scope.rstaus = $scope.reservationstatus;
      } else {
        $scope.reservationstatus.requestCanceled = false;
        $scope.rstaus = $scope.reservationstatus;
      }

      $scope.managereservationstatus();
    };

    $scope.rstaus = {};

    $scope.managereservationstatus = function() {
      if (
        $scope.rstaus.pending &&
        $scope.rstaus.confirmed &&
        $scope.rstaus.declined &&
        $scope.reservationstatus.canceled &&
        $scope.reservationstatus.requestCanceled
      ) {
        $rootScope.reservation_status = [1, 2, 3, 4, 5];
      } else if (
        $scope.rstaus.pending == false &&
        $scope.rstaus.confirmed == false &&
        $scope.rstaus.declined == false &&
        $scope.reservationstatus.canceled == false &&
        $scope.reservationstatus.requestCanceled == false
      ) {
        $rootScope.reservation_status = "";
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.confirmed &&
        $scope.rstaus.declined &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [1, 2, 3, 5];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.confirmed &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [1, 2, 5, 4];
      } else if (
        $scope.rstaus.confirmed &&
        $scope.rstaus.declined &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [2, 3, 5, 4];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.declined &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [1, 3, 5, 4];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.confirmed &&
        $scope.rstaus.declined
      ) {
        $rootScope.reservation_status = [1, 2, 3];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [1, 4, 5];
      } else if (
        $scope.rstaus.confirmed &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [2, 4, 5];
      } else if (
        $scope.rstaus.confirmed &&
        $scope.rstaus.declined &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [2, 3, 5];
      } else if (
        $scope.rstaus.declined &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [3, 4, 5];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.confirmed
      ) {
        $rootScope.reservation_status = [1, 4, 2];
      } else if (
        $scope.rstaus.confirmed &&
        $scope.rstaus.requestCanceled &&
        $scope.rstaus.declined
      ) {
        $rootScope.reservation_status = [2, 4, 3];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.confirmed &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [1, 2, 5];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.declined &&
        $scope.rstaus.requestCanceled
      ) {
        $rootScope.reservation_status = [1, 3, 4];
      } else if (
        $scope.rstaus.pending &&
        $scope.rstaus.declined &&
        $scope.rstaus.canceled
      ) {
        $rootScope.reservation_status = [1, 3, 5];
      } else if ($scope.rstaus.requestCanceled && $scope.rstaus.pending) {
        $rootScope.reservation_status = [1, 4];
      } else if ($scope.rstaus.canceled && $scope.rstaus.pending) {
        $rootScope.reservation_status = [1, 5];
      } else if ($scope.rstaus.confirmed && $scope.rstaus.requestCanceled) {
        $rootScope.reservation_status = [2, 4];
      } else if ($scope.rstaus.confirmed && $scope.rstaus.canceled) {
        $rootScope.reservation_status = [2, 5];
      } else if ($scope.rstaus.declined && $scope.rstaus.canceled) {
        $rootScope.reservation_status = [3, 5];
      } else if ($scope.rstaus.declined && $scope.rstaus.requestCanceled) {
        $rootScope.reservation_status = [3, 4];
      } else if ($scope.rstaus.canceled && $scope.rstaus.requestCanceled) {
        $rootScope.reservation_status = [5, 4];
      } else if ($scope.rstaus.confirmed && $scope.rstaus.pending) {
        $rootScope.reservation_status = [1, 2];
      } else if ($scope.rstaus.declined && $scope.rstaus.pending) {
        $rootScope.reservation_status = [1, 3];
      } else if ($scope.rstaus.declined && $scope.rstaus.confirmed) {
        $rootScope.reservation_status = [3, 2];
      } else if ($scope.rstaus.pending && $scope.rstaus.declined) {
        $rootScope.reservation_status = [1, 3];
      } else if ($scope.rstaus.confirmed && $scope.rstaus.declined) {
        $rootScope.reservation_status = [2, 3];
      } else if ($scope.rstaus.confirmed) {
        $rootScope.reservation_status = [2];
      } else if ($scope.rstaus.declined) {
        $rootScope.reservation_status = [3];
      } else if ($scope.rstaus.pending) {
        $rootScope.reservation_status = [1];
      } else if ($scope.rstaus.canceled) {
        $rootScope.reservation_status = [5];
      } else if ($scope.rstaus.requestCanceled) {
        $rootScope.reservation_status = [4];
      } else {
        console.log("else****************");
        $rootScope.reservation_status = [1, 4];
      }

      if ($rootScope.clearsall) {
        $rootScope.reservation_status = "";
      }

      console.log(
        "$rootScope.reservation_status",
        $rootScope.reservation_status
      );

      $rootScope.storerstaus = $scope.reservationstatus;

      $scope.allStatus.all =
        $scope.rstaus.pending &&
        $scope.rstaus.confirmed &&
        $scope.rstaus.declined &&
        $scope.reservationstatus.canceled &&
        $scope.reservationstatus.requestCanceled;
    };

    /* @function : checkpackagestatus ,checkpackagestatusnot
     *  @Creator  :yogini 
     *  @created  : 20022017
     *  @purpose : to toggle packages radio button on click
     */

    $scope.packagestatus = {};
    if ($rootScope.searching) {
      console.log("$rootScope.packstatus", $rootScope.packstatus);
      /*To manage package status after search*/
      if ($rootScope.packstatus == 2) {
        $scope.packagestatus.pickedup = true;
        $localStorage.packstatus = $rootScope.packstatus;
      } else if ($rootScope.packstatus == 1) {
        $scope.packagestatus.notpickedup = true;
        $localStorage.packstatus = 1;
      } else {
        $scope.packagestatus.notpickedup = false;
        $scope.packagestatus.pickedup = false;

        $localStorage.packstatus = "";
      }
    } else if ($rootScope.clearsall) {
      console.log("After clearAll");
    } else {
      $scope.packagestatus.pickedup = false;
      $scope.packagestatus.notpickedup = true;
      $localStorage.packstatus = 1;
    }

    $scope.checkpackagestatus = function(value) {
      console.log("value", value);
      $rootScope.clearsall = false;
      $scope.packagestatus.notpickedup = false;
      if (value.pickedup) {
        $scope.packagestatus.pickedup = false;
      } else if (!value.pickedup) {
        $localStorage.packstatus = 2;
        $scope.packagestatus.pickedup = true;
      } else {
      }
    };

    $scope.checkpackagestatusnot = function(value) {
      $rootScope.clearsall = false;

      $scope.packagestatus.pickedup = false;
      if (value.notpickedup) {
        $scope.packagestatus.notpickedup = false;
      } else if (!value.notpickedup) {
        $localStorage.packstatus = 1;
        console.log("$localStorage.packstatus", $localStorage.packstatus);
        $scope.packagestatus.notpickedup = true;
      } else {
      }
    };

    // $scope.checkstatus = function(value) {
    //     console.log("checkstatus", value);
    // }

    $localStorage.clearAll = false;

    $scope.all = false;
    if ($localStorage.clearAll == true) {
      console.log("inside check all");
      $scope.taskstatus.progress = false;
      $scope.taskstatus.completed = false;
      $scope.taskstatus.closed = false;
    }

    $scope.checkAll = function(value) {
      if (value) {
        $scope.all = true;
        $scope.taskstatus.progress = true;
        $scope.taskstatus.completed = true;
        $scope.taskstatus.closed = true;
        $scope.tstaus = $scope.taskstatus;
      } else {
        $scope.taskstatus.progress = false;
        $scope.taskstatus.completed = false;
        $scope.taskstatus.closed = false;
        $scope.tstaus = $scope.taskstatus;
      }

      $scope.manageworkstatus();
    };

    /* @function : checkstatus ,checkcompleted,checkclosed,manageworkstatus
     *  @Creator  :yogini 
     *  @created  : 20022017
     *  @purpose : to toggle checkboxes on click
     */

    $scope.tstaus = {};
    $scope.checkstatus = function(value, type) {
      $rootScope.clearsall = false;
      if (value.progress == false && type == 1) {
        $scope.taskstatus.progress = true;
        $scope.tstaus = $scope.taskstatus;
      } else {
        $scope.taskstatus.progress = false;
        $scope.tstaus = $scope.taskstatus;
      }

      $scope.manageworkstatus();
    };

    $scope.checkcompleted = function(value, type) {
      $rootScope.clearsall = false;

      if (value.completed == false && type == 2) {
        $scope.taskstatus.completed = true;
        $scope.tstaus = $scope.taskstatus;
      } else {
        $scope.taskstatus.completed = false;
        $scope.tstaus = $scope.taskstatus;
      }

      $scope.manageworkstatus();
    };

    $scope.checkclosed = function(value, type) {
      $rootScope.clearsall = false;

      // $scope.manageworkstatus();
      if (value.closed == false && type == 3) {
        $scope.taskstatus.closed = true;
        $scope.tstaus = $scope.taskstatus;
      } else {
        $scope.taskstatus.closed = false;
        $scope.tstaus = $scope.taskstatus;
      }

      $scope.manageworkstatus();
    };

    $scope.manageworkstatus = function() {
      console.log("6666", $scope.tstaus);
      if (
        $scope.tstaus.progress &&
        $scope.tstaus.completed &&
        $scope.tstaus.closed
      ) {
        $rootScope.work_order_status = [1, 2, 3];
      } else if (
        $scope.tstaus.progress == false &&
        $scope.tstaus.completed == false &&
        $scope.tstaus.closed == false
      ) {
        $rootScope.work_order_status = "";
      } else if ($scope.tstaus.completed && $scope.tstaus.progress) {
        $rootScope.work_order_status = [1, 2];
      } else if ($scope.tstaus.closed && $scope.tstaus.progress) {
        $rootScope.work_order_status = [2, 3];
      } else if ($scope.tstaus.progress && $scope.tstaus.completed) {
        $rootScope.work_order_status = [1, 2];
      } else if ($scope.tstaus.closed && $scope.tstaus.completed) {
        $rootScope.work_order_status = [1, 3];
      } else if ($scope.tstaus.progress && $scope.tstaus.closed) {
        $rootScope.work_order_status = [2, 3];
      } else if ($scope.tstaus.completed && $scope.tstaus.closed) {
        $rootScope.work_order_status = [1, 3];
      } else if ($scope.tstaus.progress) {
        $rootScope.work_order_status = [2];
      } else if ($scope.tstaus.completed) {
        $rootScope.work_order_status = [1];
      } else if ($scope.tstaus.closed) {
        $rootScope.work_order_status = [3];
      } else if ($scope.tstaus.progress) {
        $rootScope.work_order_status = [2];
      } else {
        $rootScope.work_order_status = [1, 2];
      }

      if ($rootScope.clearsall) {
        $rootScope.work_order_status = "";
      }

      $rootScope.storetstaus = $scope.taskstatus;

      $scope.allStatus.all =
        $scope.tstaus.progress &&
        $scope.tstaus.completed &&
        $scope.tstaus.closed;
    };

    $scope.taskmanger = {};
    if ($rootScope.searching) {
      $scope.taskmanger = $scope.storetmangerstaus;
    } else {
      $scope.taskmanger.progress = true;
      $scope.taskmanger.completed = true;
      $scope.taskmanger.closed = false;
    }

    $scope.tmangerstaus = {};

    $scope.checktaskmangerprogress = function(value, type) {
      if (value.progress == false && type == 1) {
        $scope.taskmanger.progress = true;
        $scope.tmangerstaus = $scope.taskmanger;
      } else {
        $scope.taskmanger.progress = false;
        $scope.tmangerstaus = $scope.taskmanger;
      }

      $scope.managetaskmanger();
    };

    $scope.checktaskmangercompleted = function(value, type) {
      if (value.completed == false && type == 2) {
        $scope.taskmanger.completed = true;
        $scope.tmangerstaus = $scope.taskmanger;
      } else {
        $scope.taskmanger.completed = false;
        $scope.tmangerstaus = $scope.taskmanger;
      }

      $scope.managetaskmanger();
    };

    $scope.checktaskmangerclosed = function(value, type) {
      if (value.closed == false && type == 3) {
        $scope.taskmanger.closed = true;
        $scope.tmangerstaus = $scope.taskmanger;
      } else {
        $scope.taskmanger.closed = false;
        $scope.tmangerstaus = $scope.taskmanger;
      }

      $scope.managetaskmanger();
    };

    $scope.managetaskmanger = function() {
      /* to toggle all field */

      console.log("6666", $scope.tmangerstaus);
      if (
        $scope.tmangerstaus.progress &&
        $scope.tmangerstaus.completed &&
        $scope.tmangerstaus.closed
      ) {
        $rootScope.task_status = [1, 2, 3];
      } else if (
        $scope.tmangerstaus.progress == false &&
        $scope.tmangerstaus.completed == false &&
        $scope.tmangerstaus.closed == false
      ) {
        $rootScope.task_status = undefined;
      } else if (
        $scope.tmangerstaus.completed &&
        $scope.tmangerstaus.progress
      ) {
        $rootScope.task_status = [1, 2];
      } else if ($scope.tmangerstaus.closed && $scope.tmangerstaus.progress) {
        $rootScope.task_status = [1, 3];
      } else if (
        $scope.tmangerstaus.progress &&
        $scope.tmangerstaus.completed
      ) {
        $rootScope.task_status = [1, 2];
      } else if ($scope.tmangerstaus.closed && $scope.tmangerstaus.completed) {
        $rootScope.task_status = [2, 3];
      } else if ($scope.tmangerstaus.progress && $scope.tmangerstaus.closed) {
        $rootScope.task_status = [1, 3];
      } else if ($scope.tmangerstaus.completed && $scope.tmangerstaus.closed) {
        $rootScope.task_status = [2, 3];
      } else if ($scope.tmangerstaus.progress) {
        $rootScope.task_status = [1];
      } else if ($scope.tmangerstaus.completed) {
        $rootScope.task_status = [2];
      } else if ($scope.tmangerstaus.closed) {
        $rootScope.task_status = [3];
      } else {
        $rootScope.task_status = [1, 2];
      }

      $rootScope.storetmangerstaus = $scope.taskmanger;

      $scope.allStatus.all =
        $scope.tmangerstaus.progress &&
        $scope.tmangerstaus.completed &&
        $scope.tmangerstaus.closed;
    };

    $scope.allStatus = {
      all: false
    };
    $scope.checkAlltaskmanger = function(value) {
      $scope.all = value;
      $scope.allStatus.all = value;
      if (value) {
        $scope.taskmanger.progress = true;
        $scope.taskmanger.completed = true;
        $scope.taskmanger.closed = true;
        $scope.tmangerstaus = $scope.taskmanger;
      } else {
        $scope.taskmanger.progress = false;
        $scope.taskmanger.completed = false;
        $scope.taskmanger.closed = false;
        $scope.tmangerstaus = $scope.taskmanger;
      }

      if (
        $scope.$root.$$phase != "$apply" &&
        $scope.$root.$$phase != "$digest"
      ) {
        $scope.$apply();
      }

      $scope.managetaskmanger();
    };

    /* to make search filter empty */

    var currentstate = $ionicHistory.currentStateName();

    if (currentstate == "sideMenuStaff.features") {
      $rootScope.searching = false;
      $scope.searchThisUnit = "";
      $localStorage.uid = null;
      $rootScope.start = "";
      $rootScope.end = "";
      $rootScope.serviceid = "";
      $rootScope.packstatus = "";
      $rootScope.work_order_status = "";
      $rootScope.startdate = "";
      $rootScope.enddate = "";

      /* to make unit id  empty */
      $scope.searchFilter.unit_number = "";
    }

    /********************code for search criteris templates ends here*************/

    $scope.bgColour = $localStorage.User.color;
    $scope.userimg = $localStorage.User.profile_img;
    $scope.firstName = $localStorage.User.firstname;
    $scope.lastName = $localStorage.User.lastname;
    console.log("$scope.userimg", $scope.userimg);
    $rootScope.isAuthorized = function() {
      var isAuthorized = {
        device_info: $scope.ConstantsInfo(),
        user_id: $localStorage.User.user_id,
        token: $localStorage.User.token,
        property_id: $localStorage.User.property_id,
        version: $localStorage.appversion,
        staff_roles_id: $localStorage.User.staff_roles_id
      };
      // $rootScope.authoriedUser = false;
      console.log($rootScope.authoriedUser);
      loginService.isAuthorized().save(isAuthorized, function(res) {
        if (res.code == 200) {
          console.log("authoriedUser res", res.status);
          $rootScope.authoriedUser = res.status;
          $rootScope.packagetype = res.data.property_id.scanner_status;
          console.log($rootScope.authoriedUser);
        } else if (res.code == 201) {
          $scope.logout();
        } else if (res.code == 401) {
          $scope.logout();
        } else if (res.code == 301) {
          $ionicLoading.hide();
          var currentPlatform = ionic.Platform.platform();

          $scope.bellalertPopup = $ionicPopup.alert({
            title: "Update App",
            templateUrl: "templates/Resident/appUpdateNotiPopup.html"
          });

          $scope.bellalertPopup.then(function(res) {
            if (res) {
              console.log("currentPlatform", currentPlatform);
              if (currentPlatform == "android") {
                window.open(
                  "https://play.google.com/store/apps/details?id=com.riseliving.rise&hl=en",
                  "_system"
                );
                console.log("if opening");
              } else {
                window.open(
                  "https://itunes.apple.com/us/app/rise-living/id1117019183?ls=1&mt=8",
                  "_system"
                );
              }
            } else {
              console.log("else");
            }
          });
        }
      });
    };
    $rootScope.isAuthorized();
    $rootScope.authoriedUser = true;
    $rootScope.notifycount = "" | 0;
    $scope.messagesJson = notificationStaffList;

    //   $scope.goback = function(val) {
    //     $rootScope.maintainpageflag = false;
    //     $rootScope.scrollflag = false;
    //     if ($rootScope.entertaskdetails) {

    //     } else {
    //         $localStorage.notiobject = null;
    //         /* to make search modal empty */
    //         $rootScope.searching = false;
    //         $scope.searchThisUnit = '';
    //         $localStorage.uid = null;
    //         $rootScope.start = '';
    //         $rootScope.end = '';
    //         $rootScope.serviceid = '';
    //         $rootScope.packstatus = '';
    //         $rootScope.work_order_status = '';

    //         /* to make unit id  empty */
    //         $scope.searchFilter.unit_number = '';
    //         $rootScope.entertaskdetails = false;
    //     }

    //     // $rootScope.start = '';
    //     // $rootScope.end = '';
    //     // $rootScope.serviceid = '';
    //     // $rootScope.packstatus = '';
    //     // $rootScope.work_order_status = '';
    //     $ionicConfig.views.forwardCache(false);
    //     var PlatformForBackBtn = ionic.Platform.platform();
    //     if (PlatformForBackBtn == 'android') {

    //         $ionicConfig.views.transition('android');
    //     } else if (PlatformForBackBtn == 'ios') {

    //         $ionicConfig.views.transition('ios');
    //     }
    //     $ionicConfig.views.maxCache(0);
    //     var backpage = $ionicHistory.forwardView();
    //     if (backpage == null) {
    //         window.history.back(-1);

    //     } else if (val == 1 && backpage.stateName == 'staffnotificationthread') {
    //         if ($localStorage.User.user_type_id == 3) {
    //             $state.go('sideMenuStaff.features');
    //         }
    //     } else {
    //         window.history.back(-1);
    //     }
    //     screen.unlockOrientation();
    // }

    $scope.goback = function(val) {
      console.log("$rootScope.workorderflag", $rootScope.workorderflag);
      $rootScope.maintainpageflag = false;
      $rootScope.scrollflag = false;
      if ($rootScope.entertaskdetails) {
      } else {
        $localStorage.notiobject = null;
        /* to make search modal empty */
        $rootScope.searching = false;
        $scope.searchThisUnit = "";
        $localStorage.uid = null;
        $rootScope.start = "";
        $rootScope.end = "";
        $rootScope.serviceid = "";
        $rootScope.packstatus = "";
        $rootScope.work_order_status = "";
        localStorage.setItem("unitIds", 0);
        /* to make unit id  empty */
        $scope.searchFilter.unit_number = "";
        $rootScope.entertaskdetails = false;
      }

      // $rootScope.start = '';
      // $rootScope.end = '';
      // $rootScope.serviceid = '';
      // $rootScope.packstatus = '';
      // $rootScope.work_order_status = '';
      $ionicConfig.views.forwardCache(false);
      var PlatformForBackBtn = ionic.Platform.platform();
      if (PlatformForBackBtn == "android") {
        $ionicConfig.views.transition("android");
      } else if (PlatformForBackBtn == "ios") {
        $ionicConfig.views.transition("ios");
      }
      $ionicConfig.views.maxCache(0);
      var backpage = $ionicHistory.forwardView();
      console.log("backpage", backpage);
      if (backpage == null) {
        /*case for search parameter*/
        if ($rootScope.workorderflag) {
          window.history.back(-1);
        } else {
          console.log("reloadd part");
          /*to call the function of notificationlist*/
          notificationStaffTaskList.emptyIt = true;
          notificationStaffList.emptyIt = true;
          window.history.back(-1);
        }
      } else if (val == 1 && backpage.stateName == "staffnotificationthread") {
        if ($localStorage.User.user_type_id == 3) {
          $state.go("sideMenuStaff.features");
        }
      } else {
        console.log("else part executing");
        $rootScope.entertaskdetails = false;
        window.history.back(-1);
      }
      //  screen.unlockOrientation();
    };

    $scope.featurePage = function() {
      $state.go("sideMenuStaff.features");
    };
    $scope.gobackStafNotificationList = function(slug) {
      //$ionicHistory.goBack(-1);
      // $scope.getNotificationstaff();
      if (slug == "pckg") {
        $state.go("staffnotification", {}, { reload: true });
      } else if (slug == "rsvt") {
        $state.go("staffReservationListing");
      } else {
        $ionicConfig.views.maxCache(0);
        window.history.back(-1);
        //  screen.unlockOrientation();
      }
    };
    $scope.gobackStaffFeature = function() {
      $localStorage.notiobject = null;
      $localStorage.uid = null;
      $rootScope.start = "";
      $rootScope.end = "";
      $rootScope.serviceid = "";
      $rootScope.packstatus = "";
      $rootScope.work_order_status = "";
      $rootScope.task_status = "";
      var PlatformForBackBtn = ionic.Platform.platform();
      if (PlatformForBackBtn == "android") {
        $ionicConfig.views.transition("android");
      } else if (PlatformForBackBtn == "ios") {
        $ionicConfig.views.transition("ios");
      }
      $ionicConfig.views.maxCache(0);
      // screen.unlockOrientation();
      $state.go("sideMenuStaff.features");
    };

    $scope.showActionsheet = function() {
      $state.go("sideMenuStaff.features");

      /*  $scope.count1 = [];
        $scope.featuresList = staffFeatureList.features;
        console.log("staffFeatureList.features", $scope.featuresList);
        var actionsheetchangeclass = ($localStorage.User.user_type_id == 4) ? 'custom-action-sheet' : 'custom-action-sheet_staff';

        var temp = [];
        temp.push({
            cat_slug: 'home',
            text: ' <div class="' + actionsheetchangeclass + '"> <i class="ion-home actionSheetIcon"></i>&nbsp&nbsp Home</div>'
        });
        $scope.featuresList.forEach(function(data, index) {
                if (data.service_category_id.slug != 'cl' && data.service_category_id.slug != 'tasks' && data.service_category_id.slug != 'ewo' && data.service_category_id.slug != 'nwo' && data.service_category_id.slug != 'news' && data.service_category_id.slug != 'poll' && data.service_category_id.slug != 'emrgncy' && data.service_category_id.slug != 'rsdnt' && data.service_category_id.slug != 'gnrl' && data.service_category_id.slug != 'mngmnt' && data.service_category_id.slug != 'rsdnt' && data.service_category_id.slug != 'mrktplc') {

                    temp.push({
                        cat_slug: data.service_category_id.slug,
                        text: ' <div class="' + actionsheetchangeclass + '"> <i class="' + data.service_category_id.icon + ' actionSheetIcon "></i><span>&nbsp&nbsp ' + data.service_category_id.name + ' </span></div>'
                    });
                }
            })
        
        $ionicActionSheet.show({
            buttons: temp,
            buttonClicked: function(index) {
                $rootScope.maintainpageflag = false;

                $rootScope.searching = false;
                $scope.searchThisUnit = '';
                $localStorage.uid = null;
                $rootScope.start = '';
                $rootScope.end = '';
                $rootScope.serviceid = '';
                $rootScope.packstatus = '';
                $rootScope.work_order_status = '';
                localStorage.setItem('unitIds', 0);
                $rootScope.startdate = '';
                $rootScope.enddate = '';

                $scope.searchFilter.unit_number = '';

                var statename = $ionicHistory.currentStateName();
                console.log("statename", statename);

                if (temp[index].cat_slug == 'bgfd') {
                    if (statename == 'buzzandfood_firstpage') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'bgfd');
                        localStorage.setItem('feature_id', '5629c38a3949c780667d5c59')
                        $state.go('buzzandfood_firstpage');
                    }

                } else if (temp[index].cat_slug == 'pckg') {
                    console.log("temp[index].cat_slug", temp[index].cat_slug);
                    if (statename == 'package_firstpage') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'pckg');
                        localStorage.setItem('feature_id', '5629c3cc3949c780667d5c5a')
                        $state.go('package_firstpage');
                    }
                } else if (temp[index].cat_slug == 'wo') {
                    if (statename == 'staff_workorderView') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'wo');
                        localStorage.setItem('feature_id', '5629c4143949c780667d5c5b')
                        $state.go('staff_workorderView');
                    }

                } else if (temp[index].cat_slug == 'cl') {
                    if (statename == 'staffnotification') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'cl');
                        localStorage.setItem('feature_id', '5629c4de3949c780667d5c5e')
                        $state.go('staffnotification');
                    }

                } else if (temp[index].cat_slug == 'tasks') {
                    if (statename == 'task.high') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'tasks');
                        localStorage.setItem('feature_id', '566fdf5d3949c780667d72d5')
                        $state.go('task.high');
                    }

                } else if (temp[index].cat_slug == 'polls') {
                    if (statename == "staff-poll") {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'poll');
                        $state.go('staff-poll');
                    }

                } else if (temp[index].cat_slug == 'news') {
                    if (statename == 'staffnewsfeeds') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'staffnewsfeeds');
                        $state.go('staffnewsfeeds');
                    }

                } else if (temp[index].cat_slug == 'rsvt') {
                    if (statename == "staffrvstStartpg") {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'rsvt');
                        localStorage.setItem('feature_id', '5629c5583949c780667d5c5f')
                        $state.go('staffrvstStartpg');
                    }

                } else if (temp[index].cat_slug == 'home') {
                    if (statename == 'sideMenuStaff.features') {
                        $state.reload();
                    } else {
                        $state.go('sideMenuStaff.features');

                    }
                } else if (temp[index].cat_slug == 'cmng') {
                    if (statename == "staffcmng.resident") {
                        $state.reload();
                    } else {
                        $state.go('staffcmng.resident');
                    }
                } else if (temp[index].cat_slug == 'newsfeed') {
                    if (statename == "staffnewsfeeds") {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'newsfeed');
                        localStorage.setItem('feature_id', '5787357a61f925afa18240c1')
                        $state.go('staffnewsfeeds');
                    }

                } else if (temp[index].cat_slug == 'bgfd') {
                    if (statename == "buzzandfood_firstpage") {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'bgfd');
                        localStorage.setItem('feature_id', '5629c38a3949c780667d5c59')
                        $state.go('buzzandfood_firstpage');
                    }

                } else if (temp[index].cat_slug == 'wom') {
                    if (statename == 'staff_workorder') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'wom');
                        localStorage.setItem('feature_id', '58328576fd9c8fb813d75cdb')
                        console.log("WO Manager")
                        $state.go('staff_workorder');
                    }

                } else if (temp[index].cat_slug == 'tm') {
                    if (statename == 'taskManger.high') {
                        $state.reload();
                    } else {
                        localStorage.setItem('notifySpecific', 'tm');
                        localStorage.setItem('feature_id', '566fdf5d3949c780667d72d5')
                        $state.go('taskManger.high');
                    }

                }
            },
            cssClass: 'custom-action-sheet4',
            destructiveButtonClicked: function() {
                console.log('DESTRUCT');
                return true;
            }
        });
*/
    };
  })
  /*******************************Controller for  Buzz & Package section******************************************/
  .controller("searchCtrl", function($scope, $ionicScrollDelegate) {
    $scope.data = {
      show: false
    };
    if (localStorage.getItem("unitIds") != 0) {
      $scope.searchFilter = {};
      $scope.searchFilter = {
        unit_number: localStorage.getItem("unit_Number")
      };
    } else {
      console.log("jj");
      $scope.searchFilter = {};
      localStorage.setItem("unit_Number", "");
      $scope.searchFilter = { unit_number: "" };
      console.log($scope.searchFilter.unit_number);
    }
    $scope.scrollTop = function(filterText) {
      console.log(filterText.length);
      if (filterText.length > 0) {
        $scope.data.show = true;
      }
      if (filterText.length == 0) {
        localStorage.setItem("unit_Number", "");
        $scope.data.show = false;
      }
      $ionicScrollDelegate.resize();
    };
    $scope.showToggle = function() {
      $scope.showlist = false;
      console.log("**************");
      $scope.searchFilter = { unit_number: "" };
      localStorage.setItem("unit_Number", "");
      if ($scope.data.show == false) $scope.data.show = true;
      else $scope.data.show = false;
    };
    $scope.data = {
      show: false
    };
    $scope.clickedItem = function(item) {
      console.log(item);
      $scope.searchFilter.unit_number = item.unit_number;
      localStorage.setItem("unit_Number", item.unit_number);
      localStorage.setItem("unitIds", item._id);
      $scope.GuestNameObject.unit_id = item.unit_number;
      $scope.data.show = false;
    };
    $scope.clickedItem1 = function(item) {
      console.log("item", item);
      $scope.searchFilter.unit_number = item.unit_number;
      localStorage.setItem("unit_Number", item.unit_number);
      localStorage.setItem("unitIds", item._id);
      //$scope.GuestNameObject.unit_id = item.units_id.unit_number;
      $scope.data.show = false;
    };
    // milestone v2.2
    $scope.moveToStaffClearNoti = function() {
      console.log("go");
      $state.go("staffClearNoti");
    };
  });
