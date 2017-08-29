app.controller('StaffRvstCtrl', function($scope, unitIdsList, getUnitIdServices, $rootScope, notificationStaffList, $state, $ionicModal, $filter, reservationStaffServices, $ionicHistory, reservationDataService, $ionicLoading, $localStorage, $ionicPopup, CONFIG, reservationServices) {
    $scope.freshListCreate = notificationStaffList;
    $scope.items = [];
    $scope.items = unitIdsList.units_id;
    console.log($scope.items);
    $scope.freshListCreate.emptyIt = true;
    $scope.headerTime = moment().format('hh:mm:ss a');
    $scope.reservationData = reservationDataService;
    $scope.list_amenity = [];
    $scope.unitIdsList = unitIdsList;
    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */

    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
            console.log("on error image called");
            $scope.showErrorImg = true;
        };
        /**********Change Page Function************/
    $scope.chnageNewRqst = function() {
        if ($rootScope.authoriedUser == true) {
            var unitId = {
                "property_id": $localStorage.User.property_id,
                "token": $localStorage.User.token,
                "cat_slug": localStorage.getItem('notifySpecific')
            };
            if ($scope.isOnline() == true) {
                $ionicLoading.show();
                getUnitIdServices.getUnitId().save(unitId, function(res) {
                    if (res.code == 200) {
                        $ionicLoading.hide();
                        var service_msg = res.service_message;
                        localStorage.setItem("service_msg", service_msg);
                        $scope.unitIdsList.units_id = [];
                        $scope.obj_id = {};
                        for (var i = 0; i < res.result.length; i++) {
                            $scope.unitIdsList.units_id.push({
                                _id: res.result[i]._id,
                                unit_number: res.result[i].unit_number
                            });
                        }
                        $state.go('staffrvstfrstpg');
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                });
            } else {
                $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
            }
        } else { $scope.logout() }
    };


    $scope.changetonotify = function() {
            var unitId = {
                "property_id": $localStorage.User.property_id,
                "token": $localStorage.User.token,
                "cat_slug": localStorage.getItem('notifySpecific')
            };
            if ($scope.isOnline() == true) {
                $ionicLoading.show();
                getUnitIdServices.getUnitId().save(unitId, function(res) {
                    if (res.code == 200) {
                        $ionicLoading.hide();
                        var service_msg = res.service_message;
                        localStorage.setItem("service_msg", service_msg);
                        $scope.unitIdsList.units_id = [];
                        $scope.obj_id = {};
                        for (var i = 0; i < res.result.length; i++) {
                            $scope.unitIdsList.units_id.push({
                                _id: res.result[i]._id,
                                unit_number: res.result[i].unit_number
                            });
                        }
                        $state.go('staffReservationListing');
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                });
            } else {
                $scope.alertPop(CONFIG.connecterr, CONFIG.connerrmsg);
            }
        };
        /*********Change Page Function Ends********/

    /********Calender & Time Picker Code*****/

    // "use strict";
    // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
    $scope.options = {
        // defaultDate: new Date(),
        //minDate: new Date(), 
        //maxDate: "2015-12-31",
        /* disabledDates: [
             "2016-01-21",
             "2016-01-25",
             "2015-08-13",
             "2015-08-15"
         ],*/
        dayNamesLength: 3, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
        mondayIsFirstDay: true, //set monday as first day of week. Default is false
        eventClick: function(date) { // called before dateClick and only if clicked day has events
            console.log(date);
        },
        dateClick: function(date) {
            var curDate = new Date();
            var current = moment(curDate).format('MMM DD, YYYY');

            var bookDate = moment(date).format('MMM DD, YYYY');
            localStorage.setItem('setCurrentDate', moment(date).date());
            if (moment(bookDate).isBefore(current)) {
                $scope.alertPop('Alert', 'You can not book on past date');
            } else {
                $scope.reservationData.selectedDate = '';
                localStorage.setItem("timeFrom", '');
                localStorage.setItem("timeTo", '');
                $scope.reservationData.selectedDate = date;
                $state.go("staffbookingPage")
            }
        },
        changeMonth: function(month, year) {
            console.log(month, year);
        },
        filteredEventsChange: function(filteredEvents) {
            //  console.log(filteredEvents);
        },
    };
    if ($scope.reservationData.list_amenity != undefined) {
        $scope.amenityDetails = $scope.reservationData.list_amenity;
        console.log($scope.amenityDetails);
    }
    if ($scope.reservationData.detailItem != undefined) {
        $scope.detailItem = $scope.reservationData.detailItem;
        console.log($scope.detailItem);
    }
    if ($scope.reservationData.holidayDates != undefined) {
        $scope.events = $scope.reservationData.holidayDates;
    }
    $scope.availDay = true;
    $scope.bookingFound = true;
    if ($scope.reservationData.selectedDate != undefined) {

        $scope.bookedTime = $scope.reservationData.selectedDate.event;
        angular.forEach($scope.bookedTime, function(item, index) {
            if (item.eventClass == 'holiday') {
                $scope.availDay = false;
                $scope.bookingFound = false;
                console.log($scope.availDay);
            }
        });
        if ($scope.bookedTime.length == 0) {
            $scope.bookingFound = false;
        }
        var selDate = $scope.reservationData.selectedDate;
        $scope.timeFrom = moment(selDate.timings.timefrom).tz(localStorage.getItem('timezone'));
        $scope.timingsFrom = $scope.timeFrom.format('hh:mm A');
        $scope.timeTo = moment(selDate.timings.timeto).tz(localStorage.getItem('timezone'));
        $scope.timingsTo = $scope.timeTo.format('hh:mm A');
        $scope.selectedDate = moment(selDate).tz(localStorage.getItem('timezone')); //moment(selDate).format('MMMM Do YYYY');
        $scope.selectedDate.date(selDate.day).month(selDate.month).hours(0).minutes(0).seconds(0);
        $scope.selectedDate1 = moment(selDate).format('MMM DD, YYYY');
        localStorage.setItem('selectedDate', $scope.selectedDate);

        //Calculate time slot///////////////////////////////////////////////
        var settings = {
            startOfWeek: 0, //0 = Sunday, 1 = Monday
            timeSlotGap: 15,
            subSlotsGap: 15,
            //minTime: moment(selDate.timings.timefrom).format('HH:mm:ss'),
            //maxTime: moment(selDate.timings.timeto).format('HH:mm:ss'),
            minTime: $scope.timeFrom.format('HH:mm:ss'),
            maxTime: $scope.timeTo.format('HH:mm:ss'),
            numSlots: 0
        };
        $scope.slots = getTimeSlots(getTimeDate(settings.minTime), getTimeDate(settings.maxTime), settings.timeSlotGap);
        angular.forEach($scope.bookedTime, function(item, index) {
            var count = 0;
            var slotsIndex;
            angular.forEach($scope.slots, function(val, key) {
                //  console.log(val);
                var checkVal = moment(val.bookCheck).tz(localStorage.getItem('timezone'));
                var checkItemFrom = moment(item.datefrom).tz(localStorage.getItem('timezone'));
                var checkItemTo = moment(item.dateTo).tz(localStorage.getItem('timezone'));

                if ((checkVal.isSame(checkItemFrom, 'hour') || checkVal.isAfter(checkItemFrom, 'hour')) && (checkVal.isSame(checkItemTo, 'hour') || checkVal.isBefore(checkItemTo, 'hour'))) {

                    if ((checkVal.isSame(checkItemFrom, 'minute') || checkVal.isAfter(checkItemFrom, 'minute')) && (checkVal.isSame(checkItemTo, 'minute') || checkVal.isBefore(checkItemTo, 'minute'))) {
                        count++;
                        if (count == 1) {
                            slotsIndex = key;
                            val.startTime = moment(item.datefrom).tz(localStorage.getItem('timezone'));
                            val.endTime = moment(item.dateTo).tz(localStorage.getItem('timezone'));
                            val.firstname = item.firstName;
                            val.lastname = item.lastName;
                            val.profile_img = item.profileImg;
                            val.users_id = item.users_id;
                            val.units_id = item.units_id;
                        }
                        val.addClass = 'markedTime';


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
            var mins = (startDate.minutes() + '0').slice(0, 2);
            slots.push({ 'hourSlot': moment(startDate.minutes(mins)).format('HH:mm'), 'bookCheck': moment(startDate.minutes(mins)) });
            startDate.milliseconds(startDate.milliseconds() + intervalMillis);
        }
        return slots;
    }

    function getTimeDate(time) {
        var timeParts = time.split(':');
        var currentDate = localStorage.getItem('selectedDate');
        // alert(currentDate);
        var d = new moment(currentDate).tz(localStorage.getItem('timezone'));
        d.hours(timeParts[0]);
        d.minutes(timeParts[1]);
        d.seconds(timeParts[2]);
        return d;
    }
    /********************Time Picker***************/
    $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
        step: 15, //Optional
        format: 12, //Optional
        titleLabel: 'Select Time From', //Optional
        setLabel: 'Set', //Optional
        closeLabel: 'Close', //Optional
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function(val) {

            timePickerCallback(val);
        }
    };

    function timePickerCallback(val) {
        if (typeof(val) === 'undefined') {
            console.log('Time not selected');
        } else {
            var currentDate = localStorage.getItem('selectedDate');
            var selectedT = new Date(val * 1000);
            var selectedTime = new Date(currentDate);
            selectedTime.setHours(selectedT.getUTCHours());
            selectedTime.setMinutes(selectedT.getUTCMinutes());
            var timeVal = $scope.timingsFrom.split(':');
            var minVal = timeVal[1].split(' ');

            if (minVal[1] == 'PM') {
                if (timeVal[0] == 12) {
                    var fromTimings = moment(new Date(currentDate)).hours(timeVal[0]).minutes(minVal[0]);
                    //alert(1);
                } else {
                    var hourVal = parseInt(timeVal[0]) + 12;
                    var fromTimings = moment(new Date(currentDate)).hours(hourVal).minutes(minVal[0]);
                }
            } else {
                if (timeVal[0] == 12)
                    var fromTimings = moment(new Date(currentDate)).hours(0).minutes(minVal[0]);
                else
                    var fromTimings = moment(new Date(currentDate)).hours(timeVal[0]).minutes(minVal[0]);
            }


            var timeVal1 = $scope.timingsTo.split(':');
            var minVal1 = timeVal1[1].split(' ');
            if (minVal1[1] == 'PM') {
                if (timeVal1[0] == 12)
                    var toTimings = moment(new Date(currentDate)).hours(timeVal1[0]).minutes(minVal1[0]);
                else {
                    var hourVal = parseInt(timeVal1[0]) + 12;
                    var toTimings = moment(new Date(currentDate)).hours(hourVal).minutes(minVal1[0]);
                }
            } else
                var toTimings = moment(new Date(currentDate)).hours(timeVal1[0]).minutes(minVal1[0]);

            if (moment(selectedTime).isBefore(fromTimings) || moment(selectedTime).isAfter(toTimings) || moment(selectedTime).isSame(toTimings, 'minutes')) {
                $scope.timePickerObject.inputEpochTime = ((new Date()).getHours() * 60 * 60);
                setTimeout(function() {
                    $scope.alertPop('Alert', 'The time that you have selected is not available, please try again');
                })
            } else {
                $scope.timePickerObject.inputEpochTime = val;
                $scope.timePickerObject1.inputEpochTime = val + 900;
                var maxValue = $scope.reservationData.detailItem.max_time_allowed * 60;
                var maxSeconds = val + maxValue;
                console.log(val);
                console.log(maxSeconds);
                var maxTime = new Date(maxSeconds * 1000);
                var maxTimeTo = new Date(currentDate);
                maxTimeTo.setHours(maxTime.getUTCHours());
                maxTimeTo.setMinutes(maxTime.getUTCMinutes());
                console.log(maxTimeTo);
                var selectedT2 = new Date($scope.timePickerObject1.inputEpochTime * 1000);
                var selectedTimeTo = new Date(currentDate);
                selectedTimeTo.setHours(selectedT2.getUTCHours());
                selectedTimeTo.setMinutes(selectedT2.getUTCMinutes());
                localStorage.setItem("timeFrom", moment(selectedTime));
                localStorage.setItem("timeTo", moment(selectedTimeTo));
                localStorage.setItem("maxTo", maxTimeTo);

            }
        }
    }

    $scope.timePickerObject1 = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
        step: 15, //Optional
        format: 12, //Optional
        titleLabel: 'Select Time To', //Optional
        setLabel: 'Set', //Optional
        closeLabel: 'Close', //Optional
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function(val) { //Mandatory

            timePickerCallback1(val);
        }
    };

    function timePickerCallback1(val) {
        if (typeof(val) === 'undefined') {
            console.log('Time not selected');
        } else {
            var currentDate = localStorage.getItem('selectedDate');
            var selectedFromTime = localStorage.getItem("timeFrom");
            var availMaxTime = localStorage.getItem("maxTo");
            var selectedT = new Date(val * 1000);
            var selectedTime1 = new Date(currentDate);
            selectedTime1.setHours(selectedT.getUTCHours());
            selectedTime1.setMinutes(selectedT.getUTCMinutes());
            var timeVal = $scope.timingsTo.split(':');
            var minVal = timeVal[1].split(' ');
            if (minVal[1] == 'PM') {
                if (timeVal[0] == 12)
                    var toTimings = moment(new Date(currentDate)).hours(timeVal[0]).minutes(minVal[0]);
                else {
                    var hourVal = parseInt(timeVal[0]) + 12;
                    var toTimings = moment(new Date(currentDate)).hours(hourVal).minutes(minVal[0]);
                }
            } else
                var toTimings = moment(new Date(currentDate)).hours(timeVal[0]).minutes(minVal[0]);
            var momentFromTime = moment(new Date(selectedFromTime));
            var maxToTime = moment(new Date(availMaxTime));
            if (moment(selectedTime1).isAfter(toTimings) || moment(selectedTime1).isBefore(momentFromTime) || moment(selectedTime1).isSame(momentFromTime, 'minutes')) {
                $scope.timePickerObject1.inputEpochTime = $scope.timePickerObject.inputEpochTime + 900;
                var selectedT2 = new Date($scope.timePickerObject1.inputEpochTime * 1000);
                var selectedTimeTo = new Date(currentDate);
                selectedTimeTo.setHours(selectedT2.getUTCHours());
                selectedTimeTo.setMinutes(selectedT2.getUTCMinutes());
                localStorage.setItem("timeTo", moment(selectedTimeTo));
                setTimeout(function() {
                    $scope.alertPop('Alert', 'The time that you have selected is not available, please try again');
                })
            } else {

                if (maxToTime.isBetween(momentFromTime, moment(selectedTime1))) {
                    $scope.timePickerObject1.inputEpochTime = $scope.timePickerObject.inputEpochTime + 900;
                    var selectedT2 = new Date($scope.timePickerObject1.inputEpochTime * 1000);
                    var selectedTimeTo = new Date(currentDate);
                    selectedTimeTo.setHours(selectedT2.getUTCHours());
                    selectedTimeTo.setMinutes(selectedT2.getUTCMinutes());
                    localStorage.setItem("timeTo", moment(selectedTimeTo));
                    setTimeout(function() {
                        $scope.alertPop('Alert', 'Maximum allowed booking time is ' + $scope.reservationData.detailItem.max_time_allowed + ' minutes, please try again');
                    });
                } else {

                    $scope.timePickerObject1.inputEpochTime = val;
                    localStorage.setItem("timeTo", moment(selectedTime1));
                }
            }
        }
    }

    /*Calender Time Picker Code Ends*/




    /*******Get List aminity function********/
    $scope.getList = function() {
            if ($rootScope.authoriedUser == true) {
                var getListdata = {
                    "property_id": $localStorage.User.property_id,
                    "token": $localStorage.User.token
                };
                $ionicLoading.show();
                reservationServices.rvstList().save(getListdata, function(res) {
                    $ionicLoading.hide();
                    if (res.result.length > 0) {
                        $scope.reservationData.list_amenity = [];
                        for (var i = 0; i < res.result.length; i++) {
                            $scope.list_amenity[i] = res.result[i];
                            $scope.reservationData.list_amenity[i] = $scope.list_amenity[i];
                        }
                    } else {
                        $scope.alertPop('Alert', 'Sorry, there are no amenities configured yet. Please contact your Management Company');
                    }

                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);

                })
            } else { $scope.logout(); }
        };
        /***************************end***********************/

    $scope.bookCalenderitem = function() {
        $state.go('staffrvstscndpg');
    };


    /***************Go to calender with aminety************/

    $scope.goSpecficRvst = function(index) {
        console.log(index);
        $scope.reservationData.detailItem = {};
        // $scope.backgroundImg = CONFIG.HTTP_HOST + '/' + index.amenity_img;
        $scope.backgroundImg = $localStorage.baseURL + '/' + index.amenity_img;
        localStorage.setItem("amenity_id", index._id);
        $scope.isCalender = index.is_calendar;
        angular.forEach($scope.reservationData.list_amenity, function(item) {
                if (localStorage.getItem("amenity_id") == item._id) {
                    $scope.reservationData.detailItem = item;
                }

            });
            // console.log($scope.reservationData.detailItem);
        localStorage.setItem('aminety_name', $scope.reservationData.detailItem.name);

        if ($scope.isCalender) {
            $ionicLoading.show();
            $scope.reservationData.holidayDates = [];
            $scope.reservationData.bookingTimes = [];
            for (var i = 0; i < index.holidays.length; i++) {
                var indexdate = new moment(index.holidays[i]).tz(localStorage.getItem('timezone'));
                //alert(indexdate);
                var setKeyDate = new Date();
                setKeyDate.setDate(indexdate.date());
                setKeyDate.setMonth(indexdate.month());
                $scope.reservationData.holidayDates[i] = {
                    foo: 'holiday',
                    date: setKeyDate,
                    eventClass: 'holiday'
                };
            }
            var timeArray = [];
            angular.forEach(index.days, function(item) {
                var eachDaytimingsFrom = new moment(item.timefrom).tz(localStorage.getItem('timezone'));
                var eachDaytimingsTo = new moment(item.timeto).tz(localStorage.getItem('timezone'));
                var duration = eachDaytimingsTo.diff(eachDaytimingsFrom, 'minutes');
                timeArray.push({ 'dayName': item.day, 'duration': duration })
            });
            console.log(timeArray);
            $scope.reservationData.bookingTimes = index.days;


            var bookingdata = {
                "property_id": $localStorage.User.property_id,
                "token": $localStorage.User.token,
                "amenity_id": index._id
            };
            reservationServices.booklist().save(bookingdata, function(res) {
                var groupedObj = [];
                var excludeArray = [];
                $ionicLoading.hide();
                console.log(bookingdata);
                $scope.reservationData.bookedDates = [];
                angular.forEach(res.result, function(item, index) {
                    var indexdate = new moment(item.timefrom).tz(localStorage.getItem('timezone'));
                    var tempArray = [];
                    if (excludeArray.indexOf(indexdate.format('YYYY-MM-DD')) == -1) {
                        angular.forEach(res.result, function(item1, index1) {
                            var indexfromDate = new moment(item1.timefrom).tz(localStorage.getItem('timezone'));
                            indexfromDate.seconds(0);
                            indexfromDate.milliseconds(0);
                            var indextoDate = new moment(item1.timeto).tz(localStorage.getItem('timezone'));
                            indextoDate.add(1, 'minutes');
                            if (indexdate.isSame(indexfromDate, 'day')) {
                                tempArray.push({ 'day': indexfromDate, 'minutes': indextoDate.diff(indexfromDate, 'minutes') });
                            }
                        });
                        groupedObj.push({ 'sameDayObj': tempArray, 'bulkDate': indexdate });
                        excludeArray.push(indexdate.format('YYYY-MM-DD'));
                    }
                });
                angular.forEach(groupedObj, function(item) {
                    console.log('in', item);
                    var itemDate = item.bulkDate;
                    var itemDayNumber = itemDate.day();
                    item.totalMinutes = 0;
                    switch (itemDayNumber) {
                        case 0:
                            item.dayName = 'Sunday';
                            break;
                        case 1:
                            item.dayName = 'Monday';
                            break;
                        case 2:
                            item.dayName = 'Tuesday';
                            break;
                        case 3:
                            item.dayName = 'Wednesday';
                            break;
                        case 4:
                            item.dayName = 'Thursday';
                            break;
                        case 5:
                            item.dayName = 'Friday';
                            break;
                        case 6:
                            item.dayName = 'Saturday';
                            break;
                    }
                    angular.forEach(item.sameDayObj, function(item1) {
                        item.totalMinutes += item1.minutes;
                    });
                    angular.forEach(timeArray, function(timeArrayItem) {
                        if (item.totalMinutes >= timeArrayItem.duration && item.dayName == timeArrayItem.dayName) {
                            item.styleToApply = 'completeBook';
                        }
                    })
                });
                console.log(groupedObj);
                for (var i = index.holidays.length; i < index.holidays.length + res.result.length; i++) {
                    var indexdate = new moment(res.result[i - index.holidays.length].timefrom).tz(localStorage.getItem('timezone'));
                    var styleToApply = 'partialBook';
                    var setKeyDate = new Date();
                    setKeyDate.setDate(indexdate.date());
                    setKeyDate.setMonth(indexdate.month());
                    angular.forEach(groupedObj, function(item) {
                        if (item.styleToApply != undefined) {

                            if (item.styleToApply == 'completeBook' && indexdate.isSame(item.bulkDate, 'day'))
                                styleToApply = item.styleToApply;
                        }
                    });
                    $scope.reservationData.holidayDates[i] = {
                        foo: 'partial-book',
                        date: setKeyDate,
                        datefrom: res.result[i - index.holidays.length].timefrom,
                        dateTo: res.result[i - index.holidays.length].timeto,
                        firstName: res.result[i - index.holidays.length].users_id.firstname,
                        lastName: res.result[i - index.holidays.length].users_id.lastname,
                        profileImg: res.result[i - index.holidays.length].users_id.profile_img,
                        users_id: res.result[i - index.holidays.length].users_id,
                        units_id: res.result[i - index.holidays.length].units_id,
                        eventClass: styleToApply
                    };
                }
                $state.go('StaffRvstCalItemDetails');
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $state.go('staffItemListingPg')
        }

    };

    /*****************end ***************/
    $scope.rvstItem = function() {
        $ionicLoading.show();
        var itemdata = {
            "property_id": $localStorage.User.property_id,
            "token": $localStorage.User.token,
            "amenity_id": localStorage.getItem("amenity_id")
        };
        reservationServices.getItem().save(itemdata, function(res) {
            $ionicLoading.hide();
            if (res.result.length > 0) {
                $scope.rvstItem = res.result;
                console.log($scope.rvstItem);
            } else {
                console.log("no item");
                //$scope.noItem = true;
                $scope.alertPop('Alert', 'Sorry, there are no items configured to reserve. Please ask your Management Company to add items');
            }
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        })
    };

    $scope.goItemRvst = function(index) {
        console.log(index);
        localStorage.setItem('itemId', index._id);
        $state.go('StaffRvstItemDetails');
    };

    $scope.itemDetails = function(argument) {
        $ionicLoading.show();
        var itemData = {
            "item_id": localStorage.getItem('itemId'),
            "token": $localStorage.User.token
        };
        reservationServices.getItemDetails().save(itemData, function(res) {
            $ionicLoading.hide();
            console.log(res);
            $scope.getItemDetails = res.result;
            console.log("test", $scope.getItemDetails);
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
        })
    };

    /*******Listing resevation start*******/

    $scope.showDetails = function(bookDetails) {
        console.log(bookDetails);
        $scope.bookdetails = bookDetails;
        $scope.bookdetailsFromtime = moment(bookDetails.startTime).format("hh:mm A");
        $scope.bookdetailsTotime = moment(bookDetails.endTime).add(1, 'minutes').format("hh:mm A");
        var alertPopup = $ionicPopup.alert({
            title: "Booking Details",
            scope: $scope,
            cssClass: 'staffCnfrmReservationPopup',
            templateUrl: 'templates/bookingDetails.html',
        });
        alertPopup.then(function(res) {});


    };
    /*******Listing resevation Ends*******/
    $scope.showItemDetails = function(bookDetails) {
        console.log(bookDetails.users_id);
        var alertPopup = $ionicPopup.alert({
            title: "Book Details",
            template: '<h4>Booked by ' + bookDetails.users_id.firstname + ' ' + bookDetails.users_id.lastname + '</h4>',
            cssClass: 'my-custom-popup-staff'
        });
        alertPopup.then(function(res) {});
    };


    /******Item Booking staff*****/
    $scope.MoveTobook = function(index) {
        console.log(index);
        localStorage.setItem('propRvstId', index.property_reservation_id);
        $state.go('StaffRvstSlctUnit');
    };
    $scope.bookItem = function() {
            $scope.aminetyName = localStorage.getItem('aminety_name');
            $scope.unitNumber = localStorage.getItem('unit_Number');
            $scope.aminetyName = localStorage.getItem('aminety_name');
            var bookItemDetails = {
                "item_id": localStorage.getItem('itemId'),
                "users_id": $localStorage.User.user_id,
                "units_id": localStorage.getItem('unitIds'),
                "property_id": $localStorage.User.property_id,
                "amenity_id": localStorage.getItem('propRvstId'),
                "firstname": $localStorage.User.firstname,
                "lastname": $localStorage.User.lastname,
                "unit_number": localStorage.getItem('unit_Number'),
                "property_name": $scope.aminetyName,


            };
            console.log(bookItemDetails);
            $ionicLoading.show();
            reservationServices.bookItem().save(bookItemDetails, function(res) {
                $ionicLoading.hide();
                console.log(res);
                if (res.code == 200) {
                    localStorage.setItem('unitIds', '');
                    localStorage.setItem('unit_Number', '');
                    console.log("RESERVATION RES: ", res);
                    //$scope.alertPop('Alert', res.message, 'staffrvstStartpg');
                    localStorage.setItem("service_id", res.data._id);
                    $scope.alertPop('Alert', res.message, 'staffnotificationthread');
                }
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
                $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
            })
        };
        /*************Item Booking ends*******/
        /****Calender Booking Start***********/
    $scope.showBookingSheet = function() {
        $ionicModal.fromTemplateUrl('templates/Staff/reservation/bookingModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal = '';
    };

    /* @purpose : handle event on alert
     *  @Creator :yogini 
     *  @created  : 06042017
     */

    $rootScope.$on('child', function(event, data) {
        console.log("res", data); // 'Some data'
        console.log("$rootScope.showing", $rootScope.showing);
        if($scope.closeWoPop) {
            $scope.closeWoPop.close();
        }
    });


    /*******book resevation*******/

    $scope.bookRvst = function(data) {
        $rootScope.showing = true;
        var costPerMinute = $scope.reservationData.detailItem.cost_per_hour / 60;
        var fromMinutes = (new Date(localStorage.getItem("timeFrom")).getHours() * 60) + new Date(localStorage.getItem("timeFrom")).getMinutes();
        var toMinutes = (new Date(localStorage.getItem("timeTo")).getHours() * 60) + new Date(localStorage.getItem("timeTo")).getMinutes();
        var minutesToCalculate = toMinutes - fromMinutes;
        $scope.bookTimeFrom = new Date(localStorage.getItem("timeFrom"));
        $scope.bookTimeTo = new Date(localStorage.getItem("timeTo"));
        $scope.currentDate = new Date(localStorage.getItem('selectedDate'));
        $scope.currentDate.setDate(localStorage.getItem('setCurrentDate'));
        $scope.aminetyName = localStorage.getItem('aminety_name');
        $scope.unitNumber = localStorage.getItem('unit_Number');
        $scope.aminetyName = localStorage.getItem('aminety_name');
        var dateTime = (new Date(localStorage.getItem("timeFrom")));
        var formtime = (new Date(localStorage.getItem("timeFrom")));
        var totime = (new Date(localStorage.getItem("timeTo")));
        var date = localStorage.getItem('setCurrentDate');
        var month = dateTime.getMonth();
        var year = dateTime.getFullYear();
        var time1hr = totime.getHours();
        var time2hr = formtime.getHours();
        var time1min = totime.getMinutes();
        var time2min = formtime.getMinutes();
        var newTimeTo = new Date(year, month, date, time1hr, time1min);
        var newTimeFrom = new Date(year, month, date, time2hr, time2min);
        $scope.timetos = moment.tz(localStorage.getItem('timezone')).date(date).month(month).year(year).hours(time1hr).minutes(time1min);
        $scope.timefroms = moment.tz(localStorage.getItem('timezone')).date(date).month(month).year(year).hours(time2hr).minutes(time2min);

        $scope.costPerReserved = Math.round((minutesToCalculate * costPerMinute) + $scope.reservationData.detailItem.additional_flat_price);

        $scope.closeWoPop = $ionicPopup.confirm({
            title: 'Are you sure want to reserve',
            scope: $scope,
            cssClass: 'staffEnsureReservationPopup',
            templateUrl: 'templates/costCheckout.html',
            okType: 'button button-balanced ok',
            okText: 'Yes',
            cancelType: 'button button-assertive cancel',
            cancelText: 'Back'
        });

        $scope.closeWoPop.then(function(res) {
            if (res) {
                $ionicLoading.show();
                var bookingData = {
                        "timefrom": $scope.timefroms,
                        "timeto": $scope.timetos,
                        "amenity_id": localStorage.getItem('amenity_id'),
                        "property_id": $localStorage.User.property_id,
                        "user_id": $localStorage.User.user_id,
                        "units_id": localStorage.getItem('unitIds'),
                        "services_category_id": localStorage.getItem('feature_id'),
                        "total_price": $scope.costPerReserved,
                        "firstname": $localStorage.User.firstname,
                        "lastname": $localStorage.User.lastname,
                        "timezone": localStorage.getItem('timezone'),
                        "unit_number": localStorage.getItem('unit_Number'),
                        "property_name": $scope.aminetyName,
                        "reservation_note": data
                    };
                    /*var bookingData = {
                        "timefrom": $scope.timefroms,
                        "timeto": $scope.timetos,
                        "amenity_id": localStorage.getItem('amenity_id'),
                        "property_id": $localStorage.User.property_id,
                        "user_id": $localStorage.User.user_id,
                        "units_id": localStorage.getItem('unitIds'),
                        "services_category_id": localStorage.getItem('feature_id'),
                        "total_price": $scope.costPerReserved,
                        "firstname": $localStorage.User.firstname,
                        "lastname": $localStorage.User.lastname,
                        "timezone": localStorage.getItem('timezone'),
                        "unit_number": localStorage.getItem('unit_Number'),
                        "property_name": $scope.aminetyName
                    }*/
                console.log(bookingData);
                reservationServices.addRvst().save(bookingData, function(res) {
                    $ionicLoading.hide();
                    if (res.code == 200) {
                        console.log("Reservation Res: ", res);
                        $scope.modal.hide();
                        $scope.modal = '';
                        localStorage.setItem('unitIds', '');
                        localStorage.setItem('unit_Number', '');
                        localStorage.setItem("service_id", res.data._id);
                        //$scope.alertPop('Alert', res.message, 'staffrvstStartpg');
                        $scope.alertPop('Alert', res.message, 'staffnotificationthread');
                    } else if (res.code == 401) {
                        $scope.alertPop('Alert', res.message, 'staffrvstStartpg');
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    $scope.alertPop(CONFIG.servererr, CONFIG.servererrmsg);
                })
            } else {
                console.log('You are not sure');
            }
        });
    };



    $scope.openModal = function(img) {
        $scope.previewImages = [];
        $scope.previewImages.push($rootScope.host_url_global + '/' + img);
        $scope.activeImageSlide = 0;
        $ionicModal.fromTemplateUrl('templates/openGalleryImage.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.attachmentModal1 = modal;
            $scope.attachmentModal1.show();
        });
    };
    $scope.closeGaleryModal = function() {
        $scope.attachmentModal1.hide();
    }
});
