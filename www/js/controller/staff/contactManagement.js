app.controller("ContactManagementCtrl", function(
  $scope,
  contactManagementServicesStaff,
  $ionicPopup,
  $cordovaBadge,
  $state,
  notificationStaffList,
  unitIdsList,
  $ionicHistory,
  $ionicFilterBar,
  $ionicPopup,
  CONFIG,
  $localStorage,
  $ionicLoading,
  getNotificationstaff,
  $rootScope,
  $ionicScrollDelegate
) {
  /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh
     *  @created  : 19012017
     */

  $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
  $scope.generateAvtarOnimageLoadError = function() {
    console.log("on error image called");
    $scope.showErrorImg = true;
  };
  $scope.passUserType = function(userType) {
    $scope.contactFunction(userType);
  };
  $scope.clicked = false;

  $scope.onTap = function(val) {
    console.log("_____", val);
    if (val) {
      $scope.clicked = true;
      $ionicScrollDelegate.anchorScroll();
    } else {
      $scope.clicked = false;
    }
  };
  $scope.contactFunction = function(type) {
    $ionicLoading.show();
    var contactData = {
      property_id: $localStorage.User.property_id,
      user_type_id: type
    };
    $scope.show = false;

    if (localStorage.getItem("unit_Number")) {
      $scope.search = {
        units_id: { unit_number: localStorage.getItem("unit_Number") }
      };
    } else {
      $scope.search = {
        units_id: { unit_number: localStorage.getItem("searchUnitNo") }
      };
    }

    $scope.$watch("search.units_id.unit_number", function(value) {
      console.log("gfdgfw");
      localStorage.setItem("searchUnitNo", value);
    });

    $scope.gotresponse = false;

    $scope.contactListing = [];
    contactManagementServicesStaff.contactListing().save(
      contactData,
      function(res) {
        $ionicLoading.hide();
        console.log("1. Data: ", res);
        if (res) {
          $scope.gotresponse = true;
        }
        angular.forEach(res.result, function(obj) {
          obj.fullname = obj.firstname + " " + obj.lastname;
        });
        $scope.contactListing = res.result;
        console.log("***********", $scope.contactListing);
      },
      function(err) {
        $ionicLoading.hide();
        console.log(err);
        $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
      }
    );
  };
  $scope.callresi = function(data) {
    console.log(data);
    $scope.phonenumber = data;

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
            cssClass: 'my-custom-popup-staff'
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
  };

  $scope.clear = function(data) {
    console.log(data);
    $scope.data = "";
  };

  $scope.residentDetails = function(data) {
    console.log("REsi Data: ", data);
    localStorage.setItem("contactImg", data.profile_img);
    localStorage.setItem("contactName", data.firstname);
    localStorage.setItem("contactLastName", data.lastname);
    localStorage.setItem("contactPhoneNo", data.phone_no);
    localStorage.setItem("contactEmgno", data.emergency_contact);
    localStorage.setItem("contactUnitNo", data.units_id.unit_number);
    localStorage.setItem("userTypeId", data.user_type_id);
    localStorage.setItem("bgcolor", data.colour);
    //localStorage.setItem('searchUnitNo', data.units_id.unit_number);
    localStorage.setItem("unit_Number", "");
    $state.go("contactDetails");
  };
  $scope.staffContactsDetails = function(data) {
    console.log("Contact Data: ", data);
    localStorage.setItem("contactImg", data.profile_img);
    localStorage.setItem("contactName", data.firstname);
    localStorage.setItem("contactLastName", data.lastname);
    localStorage.setItem("contactPhoneNo", data.phone_no);
    localStorage.setItem("contactEmgno", data.emergency_contact);
    localStorage.setItem("userTypeId", data.user_type_id);
    localStorage.setItem("bgcolor", data.colour);
    //localStorage.setItem('contactUnitNo', data.units_id.unit_number);
    //localStorage.setItem('searchUnitNo', data.units_id.unit_number);
    localStorage.setItem("unit_Number", "");
    $state.go("contactDetails");
  };
  $scope.firstNamel = localStorage.getItem("contactName");
  console.log("$scope.firstName", $scope.firstNamel);
  $scope.contactLastName = localStorage.getItem("contactLastName");
  $scope.contactPhoneNo = localStorage.getItem("contactPhoneNo");
  $scope.contactImg = localStorage.getItem("contactImg");
  $scope.contactEmgno = localStorage.getItem("contactEmgno");
  $scope.contactUnitNo = localStorage.getItem("contactUnitNo");
  $scope.userTypeId = localStorage.getItem("userTypeId");
  $scope.bgcolor = localStorage.getItem("bgcolor");

  $scope.clearContactSearch = function() {
    console.log("clear it ");
    $scope.search.units_id.unit_number = "";
  };
});
app.filter("nodata", function(data) {
  console.log("++++++++++", data);
});
