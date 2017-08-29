app.controller("RvstCtrl", function(
  $scope,
  $state,
  $filter,
  $ionicHistory,
  $rootScope,
  reservationDataService,
  $ionicLoading,
  $localStorage,
  $ionicPopup,
  CONFIG,
  reservationServices,
  $ionicModal
) {
  /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

  $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
  $scope.generateAvtarOnimageLoadError = function() {
    $scope.showErrorImg = true;
  };
  /**********Change Page Function************/
  console.log(localStorage.getItem("timezone"));
  localStorage.getItem("timezone");
  $scope.chnageNewRqst = function() {
    $state.go("rvstfrstpg");
  };
  $scope.changetonotify = function() {
    $state.go("rvstListingPg");
  };
  /*********Change Page Function Ends********/
  $scope.headerTime = moment().format("hh:mm:ss a");
  $scope.reservationData = reservationDataService;
  $scope.reservationset = {};
  $scope.reservation = {};
  $scope.list_amenity = [];
  // $scope.reservationData.start_time = "";
  // $scope.reservationData.end_time = "";

  // =============================================================================
  // Get List of Amenities Begins
  // =============================================================================
  /*******Get List aminity function********/
  $scope.getList = function() {
    console.log("I am called to get list");
    if ($rootScope.authoriedUser == true) {
      var getListdata = {
        property_id: $localStorage.User.property_id,
        token: $localStorage.User.token
      };
      $ionicLoading.show();
      reservationServices.rvstList().save(
        getListdata,
        function(res) {
          $ionicLoading.hide();
          if (res.result.length > 0) {
            $scope.reservationData.list_amenity = [];
            for (var i = 0; i < res.result.length; i++) {
              $scope.list_amenity[i] = res.result[i];
              $scope.reservationData.list_amenity[i] = $scope.list_amenity[i];
              if($scope.list_amenity[i].amenity_img)
                $scope.list_amenity[i].backgroundImg = $localStorage.baseURL + "/" + $scope.list_amenity[i].amenity_img;
            }
          } else {
            $scope.alertPopResi(
              "Alert",
              "Sorry, there are no amenities configured yet. Please contact your Management Company"
            );
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

  // =============================================================================
  // Get List of Amenities Ends
  // =============================================================================

  // =============================================================================
  // Get Amenity Details And Redirect To Amenity Details Page Begins
  // =============================================================================

  /***************Go to calender with aminety************/
  $scope.goSpecficRvst = function(index) {
    console.log(index);
    $scope.reservationData.detailItem = {};

    //Invalid Days For MobiScroll Calendar Date Selection
    $scope.reservationData.invalid_days = [];

    $scope.backgroundImg = $localStorage.baseURL + "/" + index.amenity_img;
    localStorage.setItem("amenity_id", index._id);
    $scope.isCalender = index.is_calendar;
    angular.forEach($scope.reservationData.list_amenity, function(item) {
      if (localStorage.getItem("amenity_id") == item._id) {
        $scope.reservationData.detailItem = item;
      }
    });
    localStorage.setItem(
      "aminety_name",
      $scope.reservationData.detailItem.name
    );
    if ($scope.isCalender) {
      $ionicLoading.show();
      $scope.reservationData.existingBookings = [];
      $scope.reservationData.allowedDateTimes = [];

      //Populate List of Holidays
      for (var i = 0; i < index.holidays.length; i++) {
        var indexdate = new moment(index.holidays[i]).tz(
          localStorage.getItem("timezone")
        );

        // var setKeyDate = new Date();
        // setKeyDate.setDate(indexdate.date());
        // setKeyDate.setMonth(indexdate.month());

        //Set list of holidays to list of invalid days for reservation calendar
        $scope.reservationData.invalid_days.push(
          indexdate.month() +
            1 +
            "/" +
            indexdate.date() +
            "/" +
            indexdate.year()
        );

        // $scope.reservationData.existingBookings[i] = {
        //   foo: "holiday",
        //   date: setKeyDate,
        //   eventClass: "holiday"
        // };
      }

      //Populate List of Days with Open/Close Times
      var DateTimeArray = [];

      angular.forEach(index.days, function(item) {
        var dayNumber = 0;
        var timefrom = new moment(item.timefrom).tz(
          localStorage.getItem("timezone")
        );
        var timeto = new moment(item.timeto).tz(
          localStorage.getItem("timezone")
        );

        var duration = timeto.diff(timefrom, "minutes");

        switch (item.day) {
          case "Sunday":
            dayNumber = 0;
            if (item.is_holiday) $scope.reservationData.invalid_days.push("w0");
            break;
          case "Monday":
            dayNumber = 1;
            if (item.is_holiday) $scope.reservationData.invalid_days.push("w1");
            break;
          case "Tuesday":
            dayNumber = 2;
            if (item.is_holiday) $scope.reservationData.invalid_days.push("w2");
            break;
          case "Wednesday":
            dayNumber = 3;
            if (item.is_holiday) $scope.reservationData.invalid_days.push("w3");
            break;
          case "Thursday":
            dayNumber = 4;
            if (item.is_holiday) $scope.reservationData.invalid_days.push("w4");
            break;
          case "Friday":
            dayNumber = 5;
            if (item.is_holiday) $scope.reservationData.invalid_days.push("w5");
            break;
          case "Saturday":
            dayNumber = 6;
            if (item.is_holiday) $scope.reservationData.invalid_days.push("w6");
            break;
        }

        $scope.reservationData.allowedDateTimes.push({
          dayNumber: dayNumber,
          timeFrom: timefrom,
          timeTo: timeto,
          duration: duration
        });
      });

      //   $scope.reservationData.allowedDateTimes = index.days;

      var bookingdata = {
        property_id: $localStorage.User.property_id,
        token: $localStorage.User.token,
        amenity_id: index._id
      };
      if ($rootScope.authoriedUser == true) {
        reservationServices.booklist().save(
          bookingdata,
          function(res) {
            var time_from = new Date();
            var time_to = new Date();
            var indexdatetemp = new Date();
            var indexdate = "";

            angular.forEach(res.result, function(item) {
              indexdatetemp = new moment(item.timefrom).tz(
                localStorage.getItem("timezone")
              );
              indexdate =
                indexdatetemp.get("month") +
                1 +
                "/" +
                indexdatetemp.get("date") +
                "/" +
                indexdatetemp.get("year");

              time_from = new moment(item.timefrom).tz(
                localStorage.getItem("timezone")
              );
              time_to = new moment(item.timeto).tz(
                localStorage.getItem("timezone")
              );

              $scope.reservationData.existingBookings.push({
                indexdate: indexdate,
                timeFrom: time_from,
                timeTo: time_to,
                firstName: item.users_id.firstname,
                lastName: item.users_id.lastname,
                profileImg: item.users_id.profile_img,
                users_id: item.users_id,
                units_id: item.units_id
              });
            });

            $ionicLoading.hide();

            // var indexdate = new moment(item.timefrom).tz(
            //   localStorage.getItem("timezone")
            // );

            // var groupedObj = [];
            // var excludeArray = [];
            // $ionicLoading.hide();
            // console.log(bookingdata);
            // $scope.reservationData.bookedDates = [];
            // angular.forEach(res.result, function(item, index) {
            //   var indexdate = new moment(item.timefrom).tz(
            //     localStorage.getItem("timezone")
            //   );
            //   var DateTimeArray = [];
            //   if (excludeArray.indexOf(indexdate.format("YYYY-MM-DD")) == -1) {
            //     angular.forEach(res.result, function(item1) {
            //       var indexfromDate = new moment(item1.timefrom).tz(
            //         localStorage.getItem("timezone")
            //       );
            //       indexfromDate.seconds(0);
            //       indexfromDate.milliseconds(0);
            //       var indextoDate = new moment(item1.timeto).tz(
            //         localStorage.getItem("timezone")
            //       );
            //       indextoDate.add(1, "minutes");
            //       if (indexdate.isSame(indexfromDate, "day")) {
            //         DateTimeArray.push({
            //           day: indexfromDate,
            //           minutes: indextoDate.diff(indexfromDate, "minutes")
            //         });
            //       }
            //     });
            //     groupedObj.push({
            //       DateTimeObject: DateTimeArray,
            //       whichDate: indexdate
            //     });
            //     excludeArray.push(indexdate.format("YYYY-MM-DD"));
            //   }
            // });
            // angular.forEach(groupedObj, function(item) {
            //   console.log("in", item);
            //   var itemDate = item.whichDate;
            //   var itemDayNumber = itemDate.day();
            //   item.totalMinutes = 0;
            //   switch (itemDayNumber) {
            //     case 0:
            //       item.dayName = "Sunday";
            //       break;
            //     case 1:
            //       item.dayName = "Monday";
            //       break;
            //     case 2:
            //       item.dayName = "Tuesday";
            //       break;
            //     case 3:
            //       item.dayName = "Wednesday";
            //       break;
            //     case 4:
            //       item.dayName = "Thursday";
            //       break;
            //     case 5:
            //       item.dayName = "Friday";
            //       break;
            //     case 6:
            //       item.dayName = "Saturday";
            //       break;
            //   }
            //   angular.forEach(item.DateTimeObject, function(item1) {
            //     item.totalMinutes += item1.minutes;
            //   });
            //   angular.forEach(DateTimeArray, function(DateTimeArrayItem) {
            //     if (
            //       item.totalMinutes >= DateTimeArrayItem.duration &&
            //       item.dayName == DateTimeArrayItem.dayName
            //     ) {
            //       item.styleToApply = "completeBook";
            //     }
            //   });
            // });
            // console.log(groupedObj);
            // for (
            //   var i = index.holidays.length;
            //   i < index.holidays.length + res.result.length;
            //   i++
            // ) {
            //   //console.log(i - index.holidays.length);
            //   var indexdate = new moment(
            //     res.result[i - index.holidays.length].timefrom
            //   ).tz(localStorage.getItem("timezone"));
            //   var styleToApply = "partialBook";
            //   var setKeyDate = new Date();
            //   setKeyDate.setDate(indexdate.date());
            //   setKeyDate.setMonth(indexdate.month());
            //   angular.forEach(groupedObj, function(item) {
            //     if (item.styleToApply != undefined) {
            //       if (
            //         item.styleToApply == "completeBook" &&
            //         indexdate.isSame(item.whichDate, "day")
            //       )
            //         styleToApply = item.styleToApply;
            //     }
            //   });
            //   $scope.reservationData.existingBookings[i] = {
            //     foo: "partial-book",
            //     date: setKeyDate,
            //     datefrom: res.result[i - index.holidays.length].timefrom,
            //     dateTo: res.result[i - index.holidays.length].timeto,
            //     firstName:
            //       res.result[i - index.holidays.length].users_id.firstname,
            //     lastName:
            //       res.result[i - index.holidays.length].users_id.lastname,
            //     profileImg:
            //       res.result[i - index.holidays.length].users_id.profile_img,
            //     users_id: res.result[i - index.holidays.length].users_id,
            //     units_id: res.result[i - index.holidays.length].units_id,
            //     eventClass: styleToApply
            //   };
            //   //  alert(JSON.stringify($scope.reservationData.existingBookings[i]));
            // }

            $state.go("rvstCalItemDtls");
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
      $state.go("rvstItem");
    }
  };

  // =============================================================================
  // Get Amenity Details And Redirect To Amenity Details Page Ends
  // =============================================================================

  // =============================================================================
  // Set Values Before Going To Booking Page Begins
  // =============================================================================

  var goToBookingPage = function(dateSelected) {
    localStorage.setItem("setCurrentDate", new Date(dateSelected.valueText));
    $scope.reservationData.selectedDate = "";
    localStorage.setItem("timeFrom", "");
    localStorage.setItem("timeTo", "");
    $scope.reservationData.selectedDate = dateSelected.valueText;
    console.log($scope.reservationData.selectedDate);
    $state.go("bookingPage");
  };

  // =============================================================================
  // Set Values Before Going To Booking Page Ends
  // =============================================================================

  // =============================================================================
  // Set MobiScroll Settings To Display Reservation Calendar Begins
  // =============================================================================

  //Set MobiScroll Theme according to device type

  if (ionic.Platform.platform() == "ios") {
    $scope.calsettings = {
      theme: "ios-dark",
      display: "bottom",
      min: new Date(),
      invalid: $scope.reservationData.invalid_days,
      onSet: function(dateselected, inst) {
        goToBookingPage(dateselected);
      }
    };
    $scope.starttimesettings = {
      theme: "ios-dark",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackStart(timeselected, inst);
      }
    };
    $scope.endtimesettings = {
      theme: "ios-dark",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackEnd(timeselected, inst);
      }
    };
    $scope.bookformsettings = {
      theme: "ios-dark",
      tap: false
    };
  } else if (ionic.Platform.platform() == "android") {
    $scope.calsettings = {
      theme: "android-holo",
      display: "bottom",
      min: new Date(),
      invalid: $scope.reservationData.invalid_days,
      onSet: function(dateselected, inst) {
        goToBookingPage(dateselected, inst);
      }
    };
    $scope.starttimesettings = {
      theme: "android-holo",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackStart(timeselected, inst);
      }
    };
    $scope.endtimesettings = {
      theme: "android-holo",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackEnd(timeselected, inst);
      }
    };
    $scope.bookformsettings = {
      theme: "android-holo",
      tap: false
    };
  } else if (ionic.Platform.platform() == "macintel") {
    $scope.calsettings = {
      theme: "ios-dark",
      display: "bottom",
      min: new Date(),
      invalid: $scope.reservationData.invalid_days,
      onSet: function(dateselected, inst) {
        goToBookingPage(dateselected);
      }
    };
    $scope.starttimesettings = {
      theme: "ios-dark",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackStart(timeselected, inst);
      }
    };
    $scope.endtimesettings = {
      theme: "ios-dark",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackEnd(timeselected, inst);
      }
    };
    $scope.bookformsettings = {
      theme: "ios-dark",
      tap: false
    };
  } else {
    $scope.calsettings = {
      theme: "material-dark",
      display: "bottom",
      min: new Date(),
      invalid: $scope.reservationData.invalid_days,
      onSet: function(dateselected, inst) {
        goToBookingPage(dateselected);
      }
    };
    $scope.starttimesettings = {
      theme: "material-dark",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackStart(timeselected, inst);
      }
    };
    $scope.endtimesettings = {
      theme: "material-dark",
      display: "bottom",
      steps: {
        minute: 15
      },
      onSet: function(timeselected, inst) {
        timePickerCallBackEnd(timeselected, inst);
      }
    };
    $scope.bookformsettings = {
      theme: "material-dark",
      tap: false
    };
  }

  // =============================================================================
  // Set MobiScroll Settings To Display Reservation Calendar Ends
  // =============================================================================

  if ($scope.reservationData.list_amenity != undefined) {
    $scope.amenityDetails = $scope.reservationData.list_amenity;
  }
  if ($scope.reservationData.detailItem != undefined) {
    $scope.detailItem = $scope.reservationData.detailItem;
  }
  if ($scope.reservationData.existingBookings != undefined) {
    $scope.events = $scope.reservationData.existingBookings;
    console.log($scope.events);
  }
  $scope.availDay = true;
  $scope.bookingFound = true;
  if ($scope.reservationData.selectedDate != undefined) {
    $scope.bookedTime = [];
    $scope.timeFrom = new Date();
    $scope.timeTo = new Date();

    angular.forEach($scope.reservationData.existingBookings, function(item) {
      if (
        new Date(item.indexdate).setHours(0, 0, 0, 0) ==
        new Date($scope.reservationData.selectedDate).setHours(0, 0, 0, 0)
      ) {
        $scope.bookedTime.push(item);
      }
    });

    var day = new moment($scope.reservationData.selectedDate)
      .tz(localStorage.getItem("timezone"))
      .weekday();

    angular.forEach($scope.reservationData.allowedDateTimes, function(item) {
      if (item.dayNumber == day) {
        $scope.timeFrom = new moment(item.timeFrom).tz(
          localStorage.getItem("timezone")
        );
        $scope.timeTo = new moment(item.timeTo).tz(
          localStorage.getItem("timezone")
        );
      }
    });

    $scope.timingsFrom = $scope.timeFrom.format("hh:mm A");

    $scope.timingsTo = $scope.timeTo.format("hh:mm A");

    $scope.selectedDate = moment($scope.reservationData.selectedDate).tz(
      localStorage.getItem("timezone")
    );
    $scope.selectedDate.hours(0).minutes(0).seconds(0);
    localStorage.setItem("selectedDate", $scope.selectedDate);

    //Calculate time slot///////////////////////////////////////////////
    var settings = {
      startOfWeek: 0, //0 = Sunday, 1 = Monday
      timeSlotGap: 15,
      subSlotsGap: 15,
      minTime: $scope.timeFrom.format("HH:mm:ss"),
      maxTime: $scope.timeTo.format("HH:mm:ss"),
      numSlots: 0
    };
    $scope.slots = getTimeSlots(
      getTimeDate(settings.minTime),
      getTimeDate(settings.maxTime),
      settings.timeSlotGap
    );
    console.log($scope.bookedTime);
    angular.forEach($scope.bookedTime, function(item, index) {
      var count = 0;
      var slotsIndex;
      angular.forEach($scope.slots, function(val, key) {
        var checkVal = moment(val.bookCheck).tz(
          localStorage.getItem("timezone")
        );
        var checkItemFrom = moment(item.timeFrom).tz(
          localStorage.getItem("timezone")
        );
        var checkItemTo = moment(item.timeTo).tz(
          localStorage.getItem("timezone")
        );

        if (
          (checkVal.isSame(checkItemFrom, "hour") ||
            checkVal.isAfter(checkItemFrom, "hour")) &&
          (checkVal.isSame(checkItemTo, "hour") ||
            checkVal.isBefore(checkItemTo, "hour"))
        ) {
          if (
            (checkVal.isSame(checkItemFrom, "minute") ||
              checkVal.isAfter(checkItemFrom, "minute")) &&
            (checkVal.isSame(checkItemTo, "minute") ||
              checkVal.isBefore(checkItemTo, "minute"))
          ) {
            count++;
            if (count == 1) {
              slotsIndex = key;
              val.startTime = moment(item.timeFrom).tz(
                localStorage.getItem("timezone")
              );
              val.endTime = moment(item.timeTo).tz(
                localStorage.getItem("timezone")
              );
              val.firstname = item.firstName;
              val.lastname = item.lastName;
              val.profile_img = item.profileImg;
              val.users_id = item.users_id;
              val.units_id = item.units_id;
            }
            val.addClass = "markedTime";
          }
        }
      });
      if (count > 0) {
        $scope.slots[slotsIndex].bookSlots = true;
        $scope.slots[slotsIndex].rowspan = count;
      }
    });
    //End of Calculate time slot /////////////////////////////////////////////////////////
  }

  function getTimeSlots(startDate, endDate, interval) {
    var slots = [];
    var intervalMillis = interval * 60 * 1000;
    while (startDate <= endDate) {
      var mins = (startDate.minutes() + "0").slice(0, 2);
      slots.push({
        hourSlot: moment(startDate.minutes(mins)).format("HH:mm"),
        bookCheck: moment(startDate.minutes(mins))
      });
      startDate.milliseconds(startDate.milliseconds() + intervalMillis);
    }
    return slots;
  }

  function getTimeDate(time) {
    var timeParts = time.split(":");
    var currentDate = localStorage.getItem("selectedDate");
    var d = new moment(currentDate).tz(localStorage.getItem("timezone"));
    d.hours(timeParts[0]);
    d.minutes(timeParts[1]);
    d.seconds(timeParts[2]);
    return d;
  }

  /***************************end***********************/
  $scope.bookCalenderitem = function() {
    $state.go("rvstscndpg");
  };

  $scope.getStatus = function() {
    $state.go("rvstListingPg");
  };

  /*****************end ***************/

  var datePickerCallback = function(val) {
    if (typeof val === "undefined") {
      console.log("No date selected");
    } else {
      $scope.currentDate = moment(val).format("MMM Do YY");
    }
  };

  function timePickerCallBackStart(timeselected, inst) {
    if (typeof timeselected === "undefined") {
    } else {
      console.log("timeselected ", timeselected);
      //Split 11:45 AM into 11 45 AM
      var val = timeselected.valueText.split(":");
      var hours = val[0];
      var min_ampm = val[1].split(" ");
      var min = min_ampm[0];
      var ampm = min_ampm[1];
      console.log(hours + "," + min + "," + ampm);

      var selectedTime = moment(
        $scope.reservationData.selectedDate +
          " " +
          hours +
          ":" +
          min +
          ":00 " +
          ampm
      ).tz(localStorage.getItem("timezone"));
      var compareSelectedStartTime = new Date(
        $scope.reservationData.selectedDate +
          " " +
          selectedTime.get("hour") +
          ":" +
          selectedTime.get("minute") +
          ":00 "
      );

      var timeFrom = moment($scope.timeFrom).tz(
        localStorage.getItem("timezone")
      );
      var compareTimeFrom = new Date(
        $scope.reservationData.selectedDate +
          " " +
          timeFrom.get("hour") +
          ":" +
          timeFrom.get("minute") +
          ":00 "
      );

      var timeTo = moment($scope.timeTo).tz(localStorage.getItem("timezone"));
      var compareTimeto = new Date(
        $scope.reservationData.selectedDate +
          " " +
          timeTo.get("hour") +
          ":" +
          timeTo.get("minute") +
          ":00 "
      );
      
      if (
        moment(compareSelectedStartTime).isBefore(compareTimeFrom) ||
        moment(compareSelectedStartTime).isAfter(compareTimeto)
      ) {
        setTimeout(function() {
          $scope.alertPopResi(
            "Alert",
            "The time that you have selected is not available, please try again"
          );
        });
        //Start Time is out of range. Set start time as From Time
        $scope.reservation.start_time =
          timeFrom.get("hour") + ":" + timeFrom.get("minute") + ":00 ";
         
      } else {
        //Start Time is good. Set end time as Start Time + 15 mins

          console.log("$selectedTime ",selectedTime);
          var finaltime = hours +":" +min +":00 " +ampm;
          var date = moment(finaltime, 'h:mm:ss A')
        .add(15, 'minutes')
        .format('h:mm A');
        
          console.log("$selectedTime 15 ",date);
        // selectedTime;
        // var minstr = parseInt(selectedTime.get("minute")) + 15;
        $scope.reservation.end_time = date;
          // selectedTime.get("hour") + ":" + minstr + ":00 ";
          console.log("$scope.reservation.end_time ",$scope.reservation.end_time);
        $scope.reservationData.compareSelectedStartTime = compareSelectedStartTime;
        $scope.reservationData.compareTimeFrom = compareTimeFrom;
        $scope.reservationData.compareTimeto = compareTimeto;
      }
    }
  }

  function timePickerCallBackEnd(timeselected, inst) {
    if (typeof timeselected === "undefined") {
    } else {
      var timeFrom = moment($scope.timeFrom).tz(
        localStorage.getItem("timezone")
      );

      var maxTimeAllowedMins =
        $scope.reservationData.detailItem.max_time_allowed;
      var compareSelectedStartTime =
        $scope.reservationData.compareSelectedStartTime;
      var compareMaxEndTimeAllowed = moment(compareSelectedStartTime).add(
        maxTimeAllowedMins,
        "minutes"
      );
      var compareTimeFrom = $scope.reservationData.compareTimeFrom;
      var compareTimeto = $scope.reservationData.compareTimeto;

      //Modify Selected End Time For Comparison
      //Split 11:45 AM into 11 45 AM
      var val = timeselected.valueText.split(":");
      var hours = val[0];
      var min_ampm = val[1].split(" ");
      var min = min_ampm[0];
      var ampm = min_ampm[1];
      console.log(hours + "," + min + "," + ampm);

      var selectedEndTime = moment(
        $scope.reservationData.selectedDate +
          " " +
          hours +
          ":" +
          min +
          ":00 " +
          ampm
      ).tz(localStorage.getItem("timezone"));
      var compareSelectedEndTime = new Date(
        $scope.reservationData.selectedDate +
          " " +
          selectedEndTime.get("hour") +
          ":" +
          selectedEndTime.get("minute") +
          ":00 "
      );

      if (
        moment(compareSelectedEndTime).isBefore(compareSelectedStartTime) ||
        moment(compareSelectedEndTime).isBefore(compareTimeFrom) ||
        moment(compareSelectedEndTime).isAfter(compareTimeto) ||
        moment(compareSelectedEndTime).isAfter(compareMaxEndTimeAllowed)
      ) {
        setTimeout(function() {
          $scope.alertPopResi(
            "Alert",
            "The time that you have selected is not available, please try again"
          );
        });

        // End Time is out of range. Set End Time as Start Time + 15 mins
        var setEndTimeTemp = new Date(compareSelectedStartTime);
        var minstr = parseInt(setEndTimeTemp.getMinutes()) + 15;
        $scope.reservation.end_time =
          setEndTimeTemp.getHours() + ":" + minstr + ":00 ";
      } else {
        // End Time is good
        $scope.reservationData.end_time = timeselected.valueText;
      }
    }
  }

   //   /********************Time Picker***************/
  //   $scope.timePickerObject = {
  //     inputEpochTime: new Date().getHours() * 60 * 60, //Optional
  //     step: 15, //Optional
  //     format: 12, //Optional
  //     titleLabel: "Time from", //Optional
  //     setLabel: "Set", //Optional
  //     closeLabel: "Close", //Optional
  //     setButtonType: "button-positive", //Optional
  //     closeButtonType: "button-stable", //Optional
  //     callback: function(val) {
  //       timePickerCallback(val);
  //     }
  //   };

  //   function timePickerCallback(val) {
  //     console.log(val);
  //     if (typeof val === "undefined") {
  //       console.log("Time not selected");
  //     } else {
  //       var currentDate = localStorage.getItem("selectedDate");
  //       var selectedT = new Date(val * 1000);
  //       var selectedTime = new Date(currentDate);
  //       selectedTime.setHours(selectedT.getUTCHours());
  //       selectedTime.setMinutes(selectedT.getUTCMinutes());
  //       var timeVal = $scope.timingsFrom.split(":");
  //       var minVal = timeVal[1].split(" ");
  //       if (minVal[1] == "PM") {
  //         if (timeVal[0] == 12) {
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(timeVal[0])
  //             .minutes(minVal[0]);
  //         } else {
  //           var hourVal = parseInt(timeVal[0]) + 12;
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(hourVal)
  //             .minutes(minVal[0]);
  //         }
  //       } else {
  //         if (timeVal[0] == 12)
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(0)
  //             .minutes(minVal[0]);
  //         else
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(timeVal[0])
  //             .minutes(minVal[0]);
  //       }

  //       var timeVal1 = $scope.timingsTo.split(":");
  //       var minVal1 = timeVal1[1].split(" ");
  //       if (minVal1[1] == "PM") {
  //         if (timeVal1[0] == 12)
  //           var toTimings = moment(new Date(currentDate))
  //             .hours(timeVal1[0])
  //             .minutes(minVal1[0]);
  //         else {
  //           var hourVal = parseInt(timeVal1[0]) + 12;
  //           var toTimings = moment(new Date(currentDate))
  //             .hours(hourVal)
  //             .minutes(minVal1[0]);
  //         }
  //       } else
  //         var toTimings = moment(new Date(currentDate))
  //           .hours(timeVal1[0])
  //           .minutes(minVal1[0]);
  //       if (
  //         moment(selectedTime).isBefore(fromTimings) ||
  //         moment(selectedTime).isAfter(toTimings) ||
  //         moment(selectedTime).isSame(toTimings, "minutes")
  //       ) {
  //         $scope.timePickerObject.inputEpochTime =
  //           new Date().getHours() * 60 * 60;
  //         setTimeout(function() {
  //           $scope.alertPopResi(
  //             "Alert",
  //             "The time that you have selected is not available, please try again"
  //           );
  //         });
  //       } else {
  //         $scope.timePickerObject.inputEpochTime = val;
  //         $scope.timePickerObject1.inputEpochTime = val + 900;
  //         var maxValue = $scope.reservationData.detailItem.max_time_allowed * 60;
  //         var maxSeconds = val + maxValue;
  //         var maxTime = new Date(maxSeconds * 1000);
  //         var maxTimeTo = new Date(currentDate);
  //         maxTimeTo.setHours(maxTime.getUTCHours());
  //         maxTimeTo.setMinutes(maxTime.getUTCMinutes());
  //         var selectedT2 = new Date(
  //           $scope.timePickerObject1.inputEpochTime * 1000
  //         );
  //         var selectedTimeTo = new Date(currentDate);
  //         selectedTimeTo.setHours(selectedT2.getUTCHours());
  //         selectedTimeTo.setMinutes(selectedT2.getUTCMinutes());
  //         //   alert(selectedTime); alert(selectedTimeTo);
  //         localStorage.setItem(
  //           "timeFrom",
  //           moment(selectedTime).tz(localStorage.getItem("timezone"))
  //         );
  //         localStorage.setItem(
  //           "timeTo",
  //           moment(selectedTimeTo).tz(localStorage.getItem("timezone"))
  //         );
  //         localStorage.setItem("maxTo", maxTimeTo);
  //       }
  //     }
  //   }

  //   $scope.timePickerObject1 = {
  //     inputEpochTime: new Date().getHours() * 60 * 60, //Optional
  //     step: 15, //Optional
  //     format: 12, //Optional
  //     titleLabel: "Time to", //Optional
  //     setLabel: "Set", //Optional
  //     closeLabel: "Close", //Optional
  //     setButtonType: "button-positive", //Optional
  //     closeButtonType: "button-stable", //Optional
  //     callback: function(val) {
  //       //Mandatory

  //       timePickerCallback1(val);
  //     }
  //   };

  //   function timePickerCallback1(val) {
  //     if (typeof val === "undefined") {
  //       console.log("Time not selected");
  //     } else {
  //       var currentDate = localStorage.getItem("selectedDate");
  //       var selectedFromTime = localStorage.getItem("timeFrom");
  //       var availMaxTime = localStorage.getItem("maxTo");
  //       var selectedT = new Date(val * 1000);
  //       var selectedTime1 = new Date(currentDate);
  //       selectedTime1.setHours(selectedT.getUTCHours());
  //       selectedTime1.setMinutes(selectedT.getUTCMinutes());
  //       var timeVal = $scope.timingsTo.split(":");
  //       var minVal = timeVal[1].split(" ");
  //       if (minVal[1] == "PM") {
  //         if (timeVal[0] == 12)
  //           var toTimings = moment(new Date(currentDate))
  //             .hours(timeVal[0])
  //             .minutes(minVal[0]);
  //         else {
  //           var hourVal = parseInt(timeVal[0]) + 12;
  //           var toTimings = moment(new Date(currentDate))
  //             .hours(hourVal)
  //             .minutes(minVal[0]);
  //         }
  //       } else
  //         var toTimings = moment(new Date(currentDate))
  //           .hours(timeVal[0])
  //           .minutes(minVal[0]);
  //       var momentFromTime = moment(new Date(selectedFromTime));
  //       var maxToTime = moment(new Date(availMaxTime));
  //       if (
  //         moment(selectedTime1).isAfter(toTimings) ||
  //         moment(selectedTime1).isBefore(momentFromTime) ||
  //         moment(selectedTime1).isSame(momentFromTime, "minutes")
  //       ) {
  //         $scope.timePickerObject1.inputEpochTime =
  //           $scope.timePickerObject.inputEpochTime + 900;
  //         var selectedT2 = new Date(
  //           $scope.timePickerObject1.inputEpochTime * 1000
  //         );
  //         var selectedTimeTo = new Date(currentDate);
  //         selectedTimeTo.setHours(selectedT2.getUTCHours());
  //         selectedTimeTo.setMinutes(selectedT2.getUTCMinutes());
  //         localStorage.setItem(
  //           "timeTo",
  //           moment(selectedTimeTo).tz(localStorage.getItem("timezone"))
  //         );
  //         setTimeout(function() {
  //           $scope.alertPopResi(
  //             "Alert",
  //             "The time that you have selected is not available, please try again"
  //           );
  //         });
  //       } else {
  //         if (maxToTime.isBetween(momentFromTime, moment(selectedTime1))) {
  //           $scope.timePickerObject1.inputEpochTime =
  //             $scope.timePickerObject.inputEpochTime + 900;
  //           var selectedT2 = new Date(
  //             $scope.timePickerObject1.inputEpochTime * 1000
  //           );
  //           var selectedTimeTo = new Date(currentDate);
  //           selectedTimeTo.setHours(selectedT2.getUTCHours());
  //           selectedTimeTo.setMinutes(selectedT2.getUTCMinutes());

  //           localStorage.setItem(
  //             "timeTo",
  //             moment(selectedTimeTo).tz(localStorage.getItem("timezone"))
  //           );
  //           //localStorage.setItem("timeTo", moment(selectedTimeTo));

  //           setTimeout(function() {
  //             $scope.alertPopResi(
  //               "Alert",
  //               "Maximum allowed booking time is " +
  //                 $scope.reservationData.detailItem.max_time_allowed +
  //                 " minutes, please try again"
  //             );
  //           });
  //         } else {
  //           $scope.timePickerObject1.inputEpochTime = val;
  //           localStorage.setItem(
  //             "timeTo",
  //             moment(selectedTime1).tz(localStorage.getItem("timezone"))
  //           );
  //         }
  //       }
  //     }
  //   }

  //   function timePickerCallBackStart(val) {
  //     console.log(val);
  //     // if (typeof(val) === 'undefined') {} else {
  //     //     var selectedTime = new Date(val * 1000);
  //     //     var hours = selectedTime.getUTCHours();
  //     //     var mintues = selectedTime.getUTCMinutes();
  //     //     var ampm = hours >= 12 ? 'PM' : 'AM';
  //     //     hours = hours % 12;
  //     //     hours = hours ? hours : 12; // the hour '0' should be '12'
  //     //     mintues = mintues < 10 ? '0' + mintues : mintues;
  //     //     $scope.reservation.start_time = hours + ':' + mintues + ' ' + ampm;

  //     console.log(val);
  //     if (typeof val === "undefined") {
  //       console.log("Time not selected");
  //     } else {
  //       var currentDate = localStorage.getItem("selectedDate");
  //       var selectedT = new Date(val * 1000);
  //       var selectedTime = new Date(currentDate);
  //       selectedTime.setHours(selectedT.getUTCHours());
  //       selectedTime.setMinutes(selectedT.getUTCMinutes());
  //       var timeVal = $scope.timingsFrom.split(":");
  //       var minVal = timeVal[1].split(" ");
  //       if (minVal[1] == "PM") {
  //         if (timeVal[0] == 12) {
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(timeVal[0])
  //             .minutes(minVal[0]);
  //         } else {
  //           var hourVal = parseInt(timeVal[0]) + 12;
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(hourVal)
  //             .minutes(minVal[0]);
  //         }
  //       } else {
  //         if (timeVal[0] == 12)
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(0)
  //             .minutes(minVal[0]);
  //         else
  //           var fromTimings = moment(new Date(currentDate))
  //             .hours(timeVal[0])
  //             .minutes(minVal[0]);
  //       }

  //       var timeVal1 = $scope.timingsTo.split(":");
  //       var minVal1 = timeVal1[1].split(" ");
  //       if (minVal1[1] == "PM") {
  //         if (timeVal1[0] == 12)
  //           var toTimings = moment(new Date(currentDate))
  //             .hours(timeVal1[0])
  //             .minutes(minVal1[0]);
  //         else {
  //           var hourVal = parseInt(timeVal1[0]) + 12;
  //           var toTimings = moment(new Date(currentDate))
  //             .hours(hourVal)
  //             .minutes(minVal1[0]);
  //         }
  //       } else
  //         var toTimings = moment(new Date(currentDate))
  //           .hours(timeVal1[0])
  //           .minutes(minVal1[0]);
  //       if (
  //         moment(selectedTime).isBefore(fromTimings) ||
  //         moment(selectedTime).isAfter(toTimings) ||
  //         moment(selectedTime).isSame(toTimings, "minutes")
  //       ) {
  //         setTimeout(function() {
  //           $scope.alertPopResi(
  //             "Alert",
  //             "The time that you have selected is not available, please try again"
  //           );
  //         });
  //       } else {
  //         var maxValue = $scope.reservationData.detailItem.max_time_allowed * 60;
  //         var maxSeconds = val + maxValue;
  //         var maxTime = new Date(maxSeconds * 1000);
  //         var maxTimeTo = new Date(currentDate);
  //         maxTimeTo.setHours(maxTime.getUTCHours());
  //         maxTimeTo.setMinutes(maxTime.getUTCMinutes());
  //         // var selectedT2 = new Date(
  //         //   $scope.timePickerObject1.inputEpochTime * 1000
  //         // );
  //         var selectedTimeTo = new Date(currentDate);
  //         selectedTimeTo.setHours(selectedTime.getUTCHours());
  //         selectedTimeTo.setMinutes(selectedTime.getUTCMinutes() + 15);
  //         //   alert(selectedTime); alert(selectedTimeTo);
  //         localStorage.setItem(
  //           "timeFrom",
  //           moment(selectedTime).tz(localStorage.getItem("timezone"))
  //         );
  //         localStorage.setItem(
  //           "timeTo",
  //           moment(selectedTimeTo).tz(localStorage.getItem("timezone"))
  //         );
  //         localStorage.setItem("maxTo", maxTimeTo);
  //       }
  //     }
  //   }

  /*******book resevation*******/

  $scope.bookRvst = function(data) {
    var costPerMinute = $scope.reservationData.detailItem.cost_per_hour / 60;
    var fromMinutes =
      new Date(localStorage.getItem("timeFrom")).getHours() * 60 +
      new Date(localStorage.getItem("timeFrom")).getMinutes();
    var toMinutes =
      new Date(localStorage.getItem("timeTo")).getHours() * 60 +
      new Date(localStorage.getItem("timeTo")).getMinutes();
    var minutesToCalculate = toMinutes - fromMinutes;
    $scope.bookTimeFrom = new Date(localStorage.getItem("timeFrom"));
    $scope.bookTimeTo = new Date(localStorage.getItem("timeTo"));
    $scope.currentDate = new Date(localStorage.getItem("selectedDate"));
    $scope.currentDate.setDate(localStorage.getItem("setCurrentDate"));
    $scope.aminetyName = localStorage.getItem("aminety_name");
    $scope.costPerReserved = Math.round(
      minutesToCalculate * costPerMinute +
        $scope.reservationData.detailItem.additional_flat_price
    );
    //    alert(localStorage.getItem("timeFrom"));
    //   alert(localStorage.getItem("timeTo"));
    var dateTime = new Date(localStorage.getItem("timeFrom"));
    var formtime = new Date(localStorage.getItem("timeFrom"));
    var totime = new Date(localStorage.getItem("timeTo"));
    //alert(formtime);alert(totime);

    var date = localStorage.getItem("setCurrentDate");
    var month = dateTime.getMonth();
    var year = dateTime.getFullYear();
    var time1hr = totime.getHours();
    var time2hr = formtime.getHours();
    var time1min = totime.getMinutes();
    var time2min = formtime.getMinutes();
    var newTimeTo = new Date(year, month, date, time1hr, time1min);
    var newTimeFrom = new Date(year, month, date, time2hr, time2min);

    $scope.timetos = moment
      .tz(localStorage.getItem("timezone"))
      .date(date)
      .month(month)
      .year(year)
      .hours(time1hr)
      .minutes(time1min);
    $scope.timefroms = moment
      .tz(localStorage.getItem("timezone"))
      .date(date)
      .month(month)
      .year(year)
      .hours(time2hr)
      .minutes(time2min);
    //   alert($scope.timetos);alert($scope.timefroms);
    var confirmPopup = $ionicPopup.confirm({
      title: "Are you sure want to reserve",
      scope: $scope,
      cssClass: "resiCnfrmReservationPopup",
      templateUrl: "templates/costCheckout.html",
      okType: "button button-balanced ok",
      okText: "Yes",
      cancelType: "button button-assertive cancel",
      cancelText: "Back"
    });
    confirmPopup.then(function(res) {
      if (res) {
        if ($rootScope.authoriedUser == true) {
          $ionicLoading.show();
          var bookingData = {
            timefrom: $scope.timefroms,
            timeto: $scope.timetos,
            amenity_id: localStorage.getItem("amenity_id"),
            property_id: $localStorage.User.property_id,
            user_id: $localStorage.User.user_id,
            units_id: $localStorage.User.units_id,
            total_price: $scope.costPerReserved,
            firstname: $localStorage.User.firstname,
            lastname: $localStorage.User.lastname,
            services_category_id: localStorage.getItem("currentFeature_id"),
            property_name: $scope.aminetyName,
            timezone: localStorage.getItem("timezone"),
            unit_number: $localStorage.User.units_number,
            reservation_note: data
          };
          /*var bookingData = {
                                "timefrom": $scope.timefroms,
                                "timeto": $scope.timetos,
                                "amenity_id": localStorage.getItem('amenity_id'),
                                "property_id": $localStorage.User.property_id,
                                "user_id": $localStorage.User.user_id,
                                "units_id": $localStorage.User.units_id,
                                "total_price": $scope.costPerReserved,
                                "firstname": $localStorage.User.firstname,
                                "lastname": $localStorage.User.lastname,
                                "services_category_id": localStorage.getItem('currentFeature_id'),
                                "property_name": $scope.aminetyName,
                                "timezone": localStorage.getItem('timezone'),
                                "unit_number": $localStorage.User.units_number
                            }*/
          console.log("bookingData : ", bookingData);
          reservationServices.addRvst().save(
            bookingData,
            function(res) {
              $ionicLoading.hide();
              if (res.code == 200) {
                console.log("Resi Reservation Res: ", res);
                $scope.modal.hide();
                $scope.modal = "";
                localStorage.setItem(
                  "currentFeature_id",
                  "5629c5583949c780667d5c5f"
                );
                localStorage.setItem("service_id", res.data._id);
                //$scope.alertPopResi('Alert', res.message, 'rvstStartPg');
                $scope.alertPopResi("Alert", res.message, "woNoitfythrd");
              } else if (res.code == 401) {
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
          $scope.logout();
        }
      } else {
        console.log("You are not sure");
      }
    });
  };
  /*******book resevation Ends*******/
  /*******Listing resevation start*******/
  $scope.listRvst = function() {
    $scope.firstname = $localStorage.User.firstname;
    $scope.lastname = $localStorage.User.lastname;
    $scope.img = $localStorage.User.profile_img;
    if ($rootScope.authoriedUser == true) {
      var listData = {
        users_id: $localStorage.User.user_id,
        amenity_id: localStorage.getItem("amenity_id")
      };
      reservationServices.listRvst().save(
        listData,
        function(res) {
          $scope.BookingData = res.result;
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

  $scope.showDetails = function(bookDetails) {
    $scope.bookdetails = bookDetails;
    $scope.bookdetailsFromtime = moment(bookDetails.startTime).format(
      "hh:mm A"
    );
    $scope.bookdetailsTotime = moment(bookDetails.endTime)
      .add(1, "minutes")
      .format("hh:mm A");
    if (bookDetails.users_id._id == $localStorage.User.user_id) {
      var alertPopup = $ionicPopup.alert({
        title: "Booking Details",
        scope: $scope,
        cssClass: "resiCnfrmReservationPopup",
        templateUrl: "templates/bookingDetails.html"
      });
      alertPopup.then(function(res) {});
    } else {
      $scope.bookdetailsEndTime = moment(bookDetails.endTime)
        .add(1, "minutes")
        .format("hh:mm A");

      var alertPopup = $ionicPopup.alert({
        title: "Book Details",
        template:
          "<h5>From " +
          moment(bookDetails.startTime).format("hh:mm a") +
          " To " +
          $scope.bookdetailsEndTime +
          "</h5>",
        cssClass: "my-custom-popup-resi"
      });
      alertPopup.then(function(res) {});
    }
  };

  /*******Listing resevation Ends*******/
  /************Item Listing*************/
  // $ionicHistory.nextViewOptions({
  //     disableAnimate: true,
  //   });

  $scope.rvstItem = function() {
    $ionicLoading.show();
    if ($rootScope.authoriedUser == true) {
      var itemdata = {
        property_id: $localStorage.User.property_id,
        token: $localStorage.User.token,
        amenity_id: localStorage.getItem("amenity_id")
      };
      reservationServices.getItem().save(
        itemdata,
        function(res) {
          $ionicLoading.hide();
          if (res.result.length > 0) {
            $scope.rvstItem = res.result;
            console.log($scope.rvstItem);
          } else {
            $scope.alertPopResi(
              "Alert",
              "Sorry, there are no items configured to reserve. Please ask your Management Company to add items"
            );
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
  /************Item Listing Ends*************/
  $scope.goItemRvst = function(index) {
    localStorage.setItem("itemId", index._id);
    $state.go("rvstItemDetails");
  };

  $scope.itemDetails = function(argument) {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var itemData = {
        item_id: localStorage.getItem("itemId"),
        token: $localStorage.User.token
      };
      reservationServices.getItemDetails().save(itemData, function(res) {
        $ionicLoading.hide();
        $scope.getItemDetails = res.result;
        $scope.maxTimeItem = res.result[0].max_time_reservation;
      });
    } else {
      $scope.logout();
    }
  };
  $scope.openModal = function(img) {
    $scope.previewImages = [];
    $scope.previewImages.push($rootScope.host_url_global + "/" + img);
    $scope.activeImageSlide = 0;
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

  $scope.bookItem = function(index) {
    if ($rootScope.authoriedUser == true) {
      $ionicLoading.show();
      var bookItem = {
        item_id: index._id,
        users_id: $localStorage.User.user_id,
        amenity_id: localStorage.getItem("amenity_id"),
        property_id: $localStorage.User.property_id,
        user_id: $localStorage.User.user_id,
        units_id: $localStorage.User.units_id,
        firstname: $localStorage.User.firstname,
        lastname: $localStorage.User.lastname,
        unit_number: $localStorage.User.units_number
      };
      reservationServices.bookItem().save(
        bookItem,
        function(res) {
          $ionicLoading.hide();
          //   console.log(res)
          if (res.code == 200) {
            localStorage.setItem(
              "currentFeature_id",
              "5629c5583949c780667d5c5f"
            );
            $scope.alertPopResi("Alert", res.message, "rvstStartPg");
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

  $scope.showBookingSheet = function() {
    $ionicModal
      .fromTemplateUrl("templates/Resident/reservation/bookingModal.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal = "";
  };

  $scope.countdown = { inSeconds: 6400 };
  $scope.countdownPickerObject = {
    useSeconds: true,
    value: $scope.countdown,
    callback: function(val) {
      countdownPickerCallback(val);
    }
  };

  function countdownPickerCallback(val) {
    if (typeof val !== "undefined") {
      $scope.countdown.inSeconds = val;
    }
  }
});
