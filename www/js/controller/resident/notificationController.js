app.controller('NotificationCtrl', function($scope, $ionicModal, $rootScope, $cordovaActionSheet, $filter, $ionicActionSheet, $cordovaSocialSharing, $cordovaContacts, $cordovaDatePicker, $cordovaEmailComposer, $state, $cordovaBadge, $ionicHistory, $ionicLoading, $localStorage, $ionicPopup, CONFIG, existingNotifyService, $ionicScrollDelegate) {
    $scope.page_number = "0";
    $scope.msgLength = 0;
    $scope.loadContent = 0;
    $scope.existingNotify = [];



    //Set MobiScroll Theme according to device type

    if (ionic.Platform.platform() == 'ios') {
        $scope.datesettings = {
            theme: 'ios-dark',
            display: 'bottom'
        };

    } else if (ionic.Platform.platform() == 'android') {
        $scope.datesettings = {
            theme: 'android-holo',
            display: 'bottom'
        };

    } else if (ionic.Platform.platform() == 'macintel') {
        $scope.datesettings = {
            theme: 'ios-dark',
            display: 'bottom'
        };

    } else {
        $scope.datesettings = {
            theme: 'material-dark',
            display: 'bottom'
        };

    }


    /* @function : showsheet()
     *  @Creator  :yogini 
     *  @created  : 19052017
     *  @purpose : to show the guest selection
     */

    $scope.showsheet = function() {
        var options = {
            title: 'Manage Pre-Authorized Guests',
            buttonLabels: ['Select From Contacts', 'Enter Manually'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
            winphoneEnableCancelButton: true
        };

        $cordovaActionSheet.show(options)
            .then(function(btnIndex) {
                if (btnIndex == 1) {
                    $scope.getAllContacts();
                } else if (btnIndex == 2) {
                    $state.go("addguest");
                    // $state.go("preauth");

                } else {

                }

            });

    }

    /* @function : toggletype()
     *  @Creator  :yogini 
     *  @created  : 05062017
     *  @purpose : select scheduling type
     */

    $scope.showchecktoday = true;
    $scope.showcheckother = false;
    $scope.showcheckindefinite = false;
    $scope.toggletype = function(value) {
        $scope.guest = {};
        if (value == 1) {
            $scope.showchecktoday = true;
            $scope.showcheckother = false;
            $scope.showcheckindefinite = false;
            $scope.showchecknotes = false;

            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;

        } else if (value == 2) {
            $scope.showcheckother = true;
            $scope.showcheckindefinite = false;
            $scope.showchecktoday = false;
            $scope.showchecknotes = false;

            $scope.showtypedaily = true;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;


        } else if (value == 3) {
            $scope.showcheckindefinite = true;
            $scope.showchecktoday = false;
            $scope.showcheckother = false;
            $scope.showchecknotes = false;

            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;


        } else {
            $scope.showcheckindefinite = false;
            $scope.showchecktoday = false;
            $scope.showcheckother = false;
            $scope.showchecknotes = true;

            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;

        }
    }




    /* @function : toggletypeedit()
     *  @Creator  :yogini 
     *  @created  : 05062017
     *  @purpose : select scheduling type on edit
     */
    $scope.toggletypeedit = function(value) {
        $scope.selectstartdate = false;
        $scope.selectenddate = false;
        console.log("$scope.guest", $scope.guest);
        if (value == 1) {
            $scope.showchecktoday = true;
            $scope.showcheckother = false;
            $scope.showcheckindefinite = false;
            $scope.showchecknotes = false;

            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;

        } else if (value == 2) {
            $scope.showcheckother = true;
            $scope.showcheckindefinite = false;
            $scope.showchecktoday = false;
            $scope.showchecknotes = false;

            $scope.showtypedaily = true;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;


        } else if (value == 3) {
            $scope.showcheckindefinite = true;
            $scope.showchecktoday = false;
            $scope.showcheckother = false;
            $scope.showchecknotes = false;

            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;


        } else {
            $scope.showcheckindefinite = false;
            $scope.showchecktoday = false;
            $scope.showcheckother = false;
            $scope.showchecknotes = true;

            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;

        }
    }




    /* @function : selectday()
     *  @Creator  :yogini 
     *  @created  : 05062017
     *  @purpose : select day of week
     */

    $scope.mon = true;
    $scope.tue = false;
    $scope.wed = false;
    $scope.thi = false;
    $scope.fri = false;
    $scope.sat = false;
    $scope.sund = false;

    $rootScope.dayslist = [{
        "day": "Monday",
        "count": 1
    }];

    $scope.selectday = function(value) {
        // $scope.day = value;
        console.log("value", value);
        if (value == 1 || value == -1) {
            $scope.mon = $scope.mon === false ? true : false;
            console.log("$scope.mon", $scope.mon);
            if (value == 1) {
                $rootScope.dayslist.push({
                    "day": "Monday",
                    "count": 1
                });
            }

            if (value == -1) {
                $rootScope.dayslist = $rootScope.dayslist.filter(function(obj) {
                    return obj.day !== 'Monday';
                });
            }

        } else if (value == 2 || value == -2) {
            $scope.tue = $scope.tue === false ? true : false;
            if (value == 2) {
                $rootScope.dayslist.push({
                    "day": "Tuesday",
                    "count": 2
                });
            }

            if (value == -2) {
                $rootScope.dayslist = $rootScope.dayslist.filter(function(obj) {
                    return obj.day !== 'Tuesday';
                });
            }

        } else if (value == 3 || value == -3) {
            $scope.wed = $scope.wed === false ? true : false;
            if (value == 3) {
                $rootScope.dayslist.push({
                    "day": "Wednesday",
                    "count": 3
                });
            }

            if (value == -3) {
                $rootScope.dayslist = $rootScope.dayslist.filter(function(obj) {
                    return obj.day !== 'Wednesday';
                });

            }

        } else if (value == 4 || value == -4) {
            $scope.thi = $scope.thi === false ? true : false;
            if (value == 4) {
                $rootScope.dayslist.push({
                    "day": "Thursday",
                    "count": 4
                });
            }
            if (value == -4) {
                $rootScope.dayslist = $rootScope.dayslist.filter(function(obj) {
                    return obj.day !== 'Thursday';
                });
            }
        } else if (value == 5 || value == -5) {
            $scope.fri = $scope.fri === false ? true : false;
            if (value == 5) {
                $rootScope.dayslist.push({
                    "day": "Friday",
                    "count": 5
                });
            }

            if (value == -5) {

                $rootScope.dayslist = $rootScope.dayslist.filter(function(obj) {
                    return obj.day !== 'Friday';
                });
            }

        } else if (value == 6 || value == -6) {
            $scope.sat = $scope.sat === false ? true : false;
            if (value == 6) {
                $rootScope.dayslist.push({
                    "day": "Saturday",
                    "count": 6
                });
            }

            if (value == -6) {
                $rootScope.dayslist = $rootScope.dayslist.filter(function(obj) {
                    return obj.day !== 'Saturday';
                });

            }

        } else if (value == 7 || value == -7) {

            $scope.sund = $scope.sund === false ? true : false;
            if (value == 7) {
                $rootScope.dayslist.push({
                    "day": "Sunday",
                    "count": 7
                });
            }
            if (value == -7) {
                $rootScope.dayslist = $rootScope.dayslist.filter(function(obj) {
                    return obj.day !== 'Sunday';
                });
            }
        } else {
            $rootScope.days = [];
            $rootScope.dayslist = [];
        }

        console.log("$rootScope.dayslist", $rootScope.dayslist);
        sort_days($rootScope.dayslist);

    }


    /* @function : sort_days()
     *  @Creator  :yogini 
     *  @created  : 27072017
     *  @purpose : sort weekdays
     */


    function sort_days(days) {
        $rootScope.daysitem = [];

        $scope.weekDays = days;

        $scope.result = $filter('orderBy')($scope.weekDays, 'count');

        console.log("$scope.result", $scope.result);
        angular.forEach($scope.result, function(item, key) {
            $rootScope.daysitem.push(item.day);
        });

        $rootScope.days = $rootScope.daysitem.filter(function(item, index, inputArray) {
            return inputArray.indexOf(item) == index;
        });
        console.log("$rootScope.days", $rootScope.days);
        // $rootScope.days = $scope.result.day;

    }

    $scope.showcheck = true;
    $scope.selectrecuring = function() {
        $scope.showcheck = $scope.showcheck === false ? true : false;

    }

    $scope.showtypedaily = true;
    $scope.showtypeweekly = false;
    $scope.showtypemonthly = false;


    $scope.sheduletype = function(value) {
        if (value == 1) {
            $scope.showtypedaily = true;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;


        } else if (value == 2) {
            $scope.showtypeweekly = true;
            $scope.showtypemonthly = false;
            $scope.showtypedaily = false;


        } else {
            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = true;

        }
    }

    $scope.sheduletypeedit = function(value) {
        $scope.selectstartdate = false;
        $scope.selectenddate = false;

        if (value == 1) {
            $scope.showtypedaily = true;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = false;


        } else if (value == 2) {
            $scope.showtypeweekly = true;
            $scope.showtypemonthly = false;
            $scope.showtypedaily = false;


        } else {
            $scope.showtypedaily = false;
            $scope.showtypeweekly = false;
            $scope.showtypemonthly = true;

        }

        // $scope.maintaineditdata();
    }




    $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
        step: 15, //Optional
        format: 12, //Optional
        titleLabel: 'Start Time', //Optional
        setLabel: 'Set', //Optional
        closeLabel: 'Close', //Optional
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function(val) {

            timePickerCallback(val);
        }
    };

    function timePickerCallback(val) {
        console.log(val);
        if (typeof(val) === 'undefined') {} else {
            var selectedTime = new Date(val * 1000);
            var hours = selectedTime.getUTCHours();
            var mintues = selectedTime.getUTCMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            mintues = mintues < 10 ? '0' + mintues : mintues;
            $scope.guest.starttime = hours + ':' + mintues + ' ' + ampm;

        }
    }

    $scope.timePickerObjectend = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
        step: 15, //Optional
        format: 12, //Optional
        titleLabel: 'Time from', //Optional
        setLabel: 'Set', //Optional
        closeLabel: 'Close', //Optional
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function(val) {

            timePickerCallbackend(val);
        }
    };

    function timePickerCallbackend(val) {
        console.log(val);
        if (typeof(val) === 'undefined') {} else {
            var selectedTime = new Date(val * 1000);
            var hours = selectedTime.getUTCHours();
            var mintues = selectedTime.getUTCMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            mintues = mintues < 10 ? '0' + mintues : mintues;
            $scope.guest.endtime = hours + ':' + mintues + ' ' + ampm;

        }
    }


    $scope.monthdataold = [
        { text: "1", value: "1", },
        { text: "2", value: "2" },
        { text: "3", value: "3" },
        { text: "4", value: "4" },
        { text: "5", value: "5" },
        { text: "6", value: "6" },
        { text: "7", value: "7" },
        { text: "8", value: "8" },
        { text: "9", value: "9" },
        { text: "10", value: "10" },
        { text: "11", value: "11" },
        { text: "12", value: "12" },
        { text: "13", value: "13" },
        { text: "14", value: "14" },
        { text: "15", value: "15" },
        { text: "16", value: "16" },
        { text: "17", value: "17" },
        { text: "18", value: "18" },
        { text: "19", value: "19" },
        { text: "20", value: "20" },
        { text: "21", value: "21" },
        { text: "22", value: "22" },
        { text: "23", value: "23" },
        { text: "24", value: "24" },
        { text: "25", value: "25" },
        { text: "26", value: "26" },
        { text: "27", value: "27" },
        { text: "28", value: "28" },
        { text: "29", value: "29" },
        { text: "30", value: "30" },
        { text: "31", value: "31" }
    ];

    /* @function : selectdayofmonth()
     *  @Creator  :yogini 
     *  @created  : 19052017
     *  @purpose : to show the days of month
     */

    $scope.selectdayofmonth = function() {
        var data = {
            numbers: [
                { description: "1" },
                { description: "2" },
                { description: "3" },
                { description: "4" },
                { description: "5" },
                { description: "6" },
                { description: "7" },
                { description: "8" },
                { description: "9" },
                { description: "10" },
                { description: "11" },
                { description: "12" },
                { description: "13" },
                { description: "14" },
                { description: "15" },
                { description: "16" },
                { description: "17" },
                { description: "18" },
                { description: "19" },
                { description: "20" },
                { description: "21" },
                { description: "22" },
                { description: "23" },
                { description: "24" },
                { description: "25" },
                { description: "26" },
                { description: "27" },
                { description: "28" },
                { description: "29" },
                { description: "30" },
                { description: "31" }

            ]
        };

        var config = {
            title: "Please select a day of month",
            items: [
                [data.numbers]
            ],
            positiveButtonText: "Done",
            negativeButtonText: "Cancel",
            theme: "light | dark"
        };
        window.SelectorCordovaPlugin.showSelector(config, function(result) {
            $scope.guest.day_of_month = result[0].description;
            $scope.$apply();
        }, function() {
            console.log('Canceled');
        });

    }
    $scope.showemail = false;
    $scope.showphone = true;
    $scope.toggledetails = function(value) {
        if (value == 1) {
            $scope.showemail = false;
            $scope.showphone = true;
        } else {
            $scope.showemail = true;
            $scope.showphone = false;
        }


    }


    $scope.shownotes = false;
    $scope.showcat = true;
    $scope.togglecategory = function(value) {
        if (value == 1) {
            $scope.shownotes = false;
            $scope.showcat = true;
        } else {
            $scope.shownotes = true;
            $scope.showcat = false;
        }


    }

    $scope.categories = [{ "name": "Guest", "selected": true },
        { "name": "Service", "selected": false },
        { "name": "Contractor", "selected": false },
        { "name": "Delivery", "selected": false }
    ]

    $scope.changecategory = function(data) {
        $scope.guest.category = data;
        console.log("scdsv", data);

    }

    $scope.addcatnotes = function(data) {
        console.log("value", data, $scope.guest.category);
        $rootScope.notesdata = data;
        if ($scope.guest.category) {
            $rootScope.category = $scope.guest.category;
        } else {
            $scope.alertPopResi('Alert', 'Please select a category');
            return;
        }

        $scope.alertPopResi('Alert', "Data saved. Proceed to enter pass validity time", 'preauth');

    }


    /* @function : getAllContacts()
     *  @Creator  :yogini 
     *  @created  : 19052017
     *  @purpose : to get and pick the contacts from contact book
     */
    $scope.data = {
        selectedContacts: []
    };


    $scope.getAllContacts = function() {
        var template = 'templates/Resident/contactsdetail.html';

        var opts = { //search options
            multiple: true // Yes, return any contact that matches criteria
        };
        $cordovaContacts.pickContact(opts).then(function(result) {
            $scope.contact = result;
            $scope.data.selectedContacts.push(result);
            $scope.guest.firstname = $scope.contact.name.givenName;
            $scope.guest.lastname = $scope.contact.name.familyName;
            console.log("$scope.contact", JSON.stringify($scope.contact));
            $scope.phonedetail = {
                "phone": $scope.contact.phoneNumbers
            }

            $scope.emaildetail = {
                "email": $scope.contact.emails
            }

            if ($scope.contact.phoneNumbers !== null && $scope.contact.phoneNumbers.length > 1 || $scope.contact.emails !== null && $scope.contact.emails.length > 1) {
                $ionicModal.fromTemplateUrl(template, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
                return;

            }

            if ($scope.contact.phoneNumbers !== null) {
                if ($scope.contact.phoneNumbers.length > 1) {} else {
                    /*Remove space and slice the phone number*/
                    var phone = $scope.contact.phoneNumbers[0].value.replace(/[^\d]/g, '');
                    if (phone.length > 10) {
                        $scope.guest.phonenumber = phone.substring(1);
                    } else {
                        $scope.guest.phonenumber = $scope.contact.phoneNumbers[0].value;

                    }

                }
            }

            if ($scope.contact.emails !== null) {
                if ($scope.contact.emails.length > 1) {} else {
                    $scope.guest.email = $scope.contact.emails[0].value;
                }
            }
            $scope.addguest();
            // Contact saved
        }, function(err) {
            // Contact error
        });
    };


    $scope.guestinfo = function(data, key) {
        if (key == 1) {
            /*Remove space and slice the phone number*/
            $scope.oldvalue = data;
            var phone = data.replace(/[^\d]/g, '');
            if (phone.length > 10) {
                $scope.guest.phonenumber = phone.substring(1);
            } else {
                $scope.guest.phonenumber = data;

            }
        } else {
            $scope.guest.email = data;
        }
        console.log("$scope.guest", JSON.stringify($scope.guest));

    }

    $scope.choosecontactdata = function() {
        console.log("$scope.guest", JSON.stringify($scope.guest));
        $scope.modal.hide();
        $scope.addguest();


    }


    $scope.closeModal = function() {
        $scope.modal.hide();

    };

    $scope.selectstartdate = false;
    $scope.selectenddate = false;

    $scope.shownative = function(start, end) {
        if (start) {
            $scope.selectstartdate = true;

        } else if (end) {
            $scope.selectenddate = true;

        } else {
            $scope.selectstartdate = false;
            $scope.selectenddate = false;
        }
    }

    $scope.changeformat = function(value, end, whichtype) {

        if (value && end) {
            $scope.guest.day_of_month = moment(value).format('YYYY-MM-DD');
        } else if (value) {
            $scope.startdate1 = moment(value).format('MMMM Do YYYY');
            $scope.startdate = moment(value).format('YYYY-MM-DD');
            $scope.guest.startdate = moment(value).format('YYYY-MM-DD');
            console.log("$scope.startdate", $scope.startdate);
            //MMMM Do YYYY
        } else if (end) {
            $scope.enddate = moment(end).format('YYYY-MM-DD');
            $scope.enddate1 = moment(end).format('MMMM Do YYYY');
            $scope.guest.enddate = moment(end).format('YYYY-MM-DD');
            console.log("$scope.enddate", $scope.enddate);

        } else {

        }
    }

    $scope.updatenotes = function(data) {
        $scope.notes = data;

    };

    /* @function : addguest()
     *  @Creator  :yogini 
     *  @created  : 31052017
     *  @purpose : to add the details of guest
     */

    $scope.guest = {};

    $scope.addguest = function() {
        if ($scope.guest.phonenumber) {
            $scope.guest.phonenumber = $scope.guest.phonenumber.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');
            if ($scope.guest.phonenumber.length === 11) {
                $scope.guest.phonenumber = $scope.guest.phonenumber.substring(0, 9);
            } else if ($scope.guest.phonenumber.length < 10 || $scope.guest.phonenumber.length > 11) {
                $scope.alertPopResi('Alert', 'Please select or enter a 10 digit phone number');
                return;
            }
        }
        $ionicLoading.show();
        if ($rootScope.authoriedUser == true) {
            var guestData = {
                "property_id": $localStorage.User.property_id,
                "resident_id": $localStorage.User.user_id,
                "units_id": $localStorage.User.units_id,
                "email": $scope.guest.email,
                "firstname": $scope.guest.firstname,
                "lastname": $scope.guest.lastname,
                "phone_no": $scope.guest.phonenumber,
                "unit_number": $localStorage.User.units_number,
                "resident_firstname": $localStorage.User.firstname,
                "resident_lastname": $localStorage.User.lastname,
                "residentEmail": $localStorage.User.email

            }

            console.log("While Adding", JSON.stringify(guestData));
            existingNotifyService.addguest().save(guestData, function(res) {
                console.log("res", JSON.stringify(res));
                $rootScope.authguestid = res.guest_id;
                $scope.guestprofilelink = res.schedule_id;
                $ionicLoading.hide();
                if (res.code == 200) {
                    $scope.alertPopResi('Alert', 'Guest contact details added succesfully. Please select authorization time in the next screen', 'addcategoryvisitors');
                } else if (res.code == 401) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: res.message,
                        cssClass: 'my-custom-popup-resi',
                        buttons: [{
                            text: 'Ok',
                            type: 'button-full'
                        }]
                    })
                    alertPopup.then(function(res) {
                        $scope.goToDetails($scope.guestprofilelink);
                    });

                } else {
                    $scope.alertPopResi('Alert', res.message);
                }

            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else { $scope.logout() }
    }

    $scope.timePickerCallback = function(val) {
        if (val) {
            $scope.timeselect = true;
            var selectedTime = new Date(val);
            var hours = selectedTime.getHours();
            var mintues = selectedTime.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            mintues = mintues < 10 ? '0' + mintues : mintues;
            $scope.guest.starttime = hours + ':' + mintues + ' ' + ampm;
            $scope.starttime_take = val;
        } else {
            $scope.timeselect = false;
        }

    }


    $scope.timePickerCallbackend = function(val) {

        if (val) {
            $scope.timeselect = true;
            $scope.timeselectend = true;
            var selectedTime = new Date(val);
            var hours = selectedTime.getHours();
            var mintues = selectedTime.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            mintues = mintues < 10 ? '0' + mintues : mintues;
            $scope.guest.endtime = hours + ':' + mintues + ' ' + ampm;
            $scope.endtime_take = val;
        } else {
            $scope.timeselectend = false;

        }
    }




    /* @function : addauthorization()
     *  @Creator  :yogini 
     *  @created  : 07062017
     *  @purpose : to add the authorization  to the guest
     */

    $scope.guest.days = [];
    $scope.saveddata = false;

    $scope.addauthorization = function() {
        $ionicLoading.show();

        if ($scope.showchecktoday) {
            $scope.guest.scheduling_type = 1;

        }
        if ($scope.showcheckother) {
            $scope.guest.scheduling_type = 2;

            if ($scope.showtypedaily) {
                $scope.guest.option = 1;
            }
            if ($scope.showtypeweekly) {
                $scope.guest.option = 2;
                if ($rootScope.days.length == 0) {
                    $ionicLoading.hide();
                    $scope.alertPopResi('Alert', 'Please select a day');
                    return;
                }
                $scope.guest.days = $rootScope.days;
                $scope.guest.recuring = $scope.showcheck;
            }
            if ($scope.showtypemonthly) {
                $scope.guest.option = 3;
                console.log(" $scope.guest.day_of_month", $scope.guest.day_of_month);
                if ($scope.guest.day_of_month == undefined) {
                    $ionicLoading.hide();
                    $scope.alertPopResi('Alert', 'Please select one');
                    return;
                }
                $scope.guest.recuring = $scope.showcheck;
            }
        }
        if ($scope.showcheckindefinite) {
            $scope.guest.scheduling_type = 3;

        }

        if ($scope.guest.startdate && $scope.guest.enddate) {
            $ionicLoading.hide();
            if (moment($scope.guest.enddate).format() < moment($scope.guest.startdate).format()) {
                $scope.alertPopResi('Alert', 'Please select a valid date');
                return;
            }
        }

        if ($scope.guest.starttime && $scope.guest.endtime) {
            $ionicLoading.hide();
            var beginningTime = moment($scope.guest.starttime, 'h:mma');
            var endTime = moment($scope.guest.endtime, 'h:mma');
            var condition = beginningTime.isBefore(endTime);
            console.log("condition", $scope.guest.starttime, $scope.guest.endtime, beginningTime, endTime, condition);
            if (!condition) {
                $scope.alertPopResi('Alert', 'Please select a valid time');
                return;
            }
        }

        // if ($rootScope.authoriedUser == true) {
        var guestData = {
            "property_id": $localStorage.User.property_id,
            "resident_id": $localStorage.User.user_id,
            "guest_id": $rootScope.authguestid,
            "units_id": $localStorage.User.units_id,
            "unit_number": $localStorage.User.units_number,
            "resident_firstname": $localStorage.User.firstname,
            "resident_lastname": $localStorage.User.lastname,
            "category": $rootScope.category,
            "notes": $rootScope.notesdata,
            "scheduling_type": $scope.guest.scheduling_type,
            "option": $scope.guest.option,
            "days": $scope.guest.days,
            "day_of_month": $scope.guest.day_of_month,
            "start_date": $scope.guest.startdate,
            "end_date": $scope.guest.enddate,
            "start_time": $scope.guest.starttime,
            "end_time": $scope.guest.endtime,

        }
        console.log("guestData", JSON.stringify(guestData));
        existingNotifyService.addGuestScheduling().save(guestData, function(res) {
                console.log("res8888888888888", JSON.stringify(res));
                $ionicLoading.hide();
                if (res.code == 200) {
                    $scope.saveddata = true;

                    var startdate = (typeof res.SMS_data.pass_valid_start_date !== 'undefined') ? res.SMS_data.pass_valid_start_date : '';
                    var enddate = (typeof res.SMS_data.pass_valid_end_date !== 'undefined') ? res.SMS_data.pass_valid_end_date : '';
                    var starttime = (typeof res.SMS_data.pass_valid_start_time !== 'undefined') ? res.SMS_data.pass_valid_start_time : '';
                    var endtime = (typeof res.SMS_data.pass_valid_end_time !== 'undefined') ? res.SMS_data.pass_valid_end_time : '';
                    $scope.phonenumber = res.SMS_data.guestPhone;
                    $scope.email = res.SMS_data.guestEmail;
                    var name = res.SMS_data.guestFirstName;
                    var message = "Hello" + ' ' + name + ',' + ' ' + res.SMS_data.residentFirstName +
                        " has invited you as a guest, please click on the link to get additional details. \n" + res.SMS_data.profile_link;
                    // var message = "Hello" + ' ' + name + ',' + 'You are invited as guest from' + ' ' + res.SMS_data.residentFirstName +
                    //    ' ' + res.SMS_data.residentLastName + ' ' + 'Please find details of invitation ,' + ' ' + res.SMS_data.residentAddress + ' ' + res.SMS_data.QR_image + ' ' + startdate + ' ' + enddate + ' ' + starttime + ' ' + endtime;
                    if ($scope.phonenumber && $scope.email) {
                        var alertPopupguest = $ionicPopup.confirm({
                            title: 'Alert',
                            cssClass: 'WoMngrPopHead',
                            okText: 'Message',
                            cancelText: 'Email',
                            template: 'Authorization time added succesfully. Invite your guest either via Email or Message'

                        });
                    } else if ($scope.phonenumber) {
                        var alertPopupguest = $ionicPopup.confirm({
                            title: 'Alert',
                            cssClass: 'my-custom-popup-resi',
                            buttons: [{
                                text: 'Send Message',
                                type: 'button-full'
                            }],
                            template: 'Authorization time added succesfully. Invite your guest via Message'

                        });
                    } else if ($scope.email) {
                        var alertPopupguest = $ionicPopup.confirm({
                            title: 'Alert',
                            cssClass: 'my-custom-popup-resi',
                            buttons: [{
                                text: 'Send Email',
                                type: 'button-full'
                            }],
                            template: 'Authorization time added succesfully. Invite your guest via Email'

                        });
                    } else {

                    }
                    alertPopupguest.then(function(res) {
                        // Custom functionality....
                        if (res) {
                            if ($scope.phonenumber) {
                                $scope.sendsmstoguest(message, $scope.phonenumber, $scope.email);

                            } else {
                                $scope.sendemailtoguest(message, $scope.phonenumber, $scope.email);

                            }

                        } else {
                            if ($scope.phonenumber) {
                                $scope.sendsmstoguest(message, $scope.phonenumber, $scope.email);

                            } else {
                                $scope.sendemailtoguest(message, $scope.phonenumber, $scope.email);

                            }
                        }
                    });
                } else {
                    $scope.saveddata = false;

                    $scope.alertPopResi('Alert', res.message);
                }

            }, function(err) {
                $scope.saveddata = false;
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
            // } else { $scope.logout() }
    }


    /* @function : searchdata()
     *  @Creator  :yogini 
     *  @created  : 23062017
     *  @purpose : to search the guest
     */


    $scope.searchdata = function(searchFilter, guestname, guestemail, gusetphone) {
        $rootScope.searching = true;

        $scope.guestname = guestname;
        $scope.guestphone = gusetphone;
        $scope.guestemail = guestemail;
        console.log(" $scope.guestphone", $scope.guestphone, $scope.guestemail);

        setTimeout(function() {
            $scope.searchUsingService($rootScope.unitvalue);
        }, 100);

        $ionicScrollDelegate.anchorScroll();

    }

    /* @function : searchUsingService()
     *  @Creator  :yogini 
     *  @created  : 23062017
     *  @purpose : to search the guest data
     */

    $scope.searchUsingService = function(item) {
        if (item) {
            $scope.search1 = { 'unit_number': item.unit_number };
            $scope.searchKeyWord = item.unit_number;
            $scope.searchThisUnit = item._id;
            // $scope.messagesJson.currentSearchID = item._id;
        } else {
            console.log("in else part");
            $scope.searchThisUnit = '';
        }

        $scope.page_number = "0";
        $scope.guestNotify = [];
        $scope.currentRecordCount = 0;
        $scope.msgLength = 0;


        setTimeout(function() {
            $scope.getguestsList();
        }, 100);

    }


    /* @function : getguestsList()
     *  @Creator  :yogini 
     *  @created  : 31052017
     *  @purpose : to show the list of guest
     */


    $scope.getguestsList = function() {
        var pos = $ionicScrollDelegate.getScrollPosition();
        $scope.hideInfiniteContent = false;
        if ($rootScope.authoriedUser == true) {
            var guestlistData = {
                "resident_id": $localStorage.User.user_id,
                "property_id": $localStorage.User.property_id,
                "guest_name": $scope.guestname,
                "phone_number": $scope.guestphone,
                "email": $scope.guestemail,
                "page_number": $scope.page_number
            }
            $ionicLoading.show();
            existingNotifyService.guestlist().save(guestlistData, function(res) {
                $ionicLoading.hide();
                if ($rootScope.searching) {
                    $rootScope.totalrecords = res.list_count;
                    $scope.closeModal();
                }
                if (res) {
                    $scope.gotresponse = true;
                }
                localStorage.setItem('infiCount', res.list_count);
                $scope.loadContent = localStorage.getItem('infiCount');
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

                $scope.page_number = parseInt($scope.page_number) + 1;
                if (res.results.length > 0) {

                    angular.forEach(res.results, function(item) {
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;
                        $scope.guestNotify.push(item);
                        $rootScope.notilist = $scope.guestNotify;


                        // if (item.users_id._id == $localStorage.User.user_id) {
                        //     $localStorage.User.profile_img = item.users_id.profile_img;
                        // }

                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    // $scope.noNotiText = "You have no existing reservations"
                }
                //$scope.$broadcast('scroll.refreshComplete');
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout()
        }
    }


    if ($rootScope.searching) {
        $scope.guestNotify = $rootScope.notilist;
        $scope.guestname = $scope.guestname;
        $scope.guestphone = $scope.guestphone;
        $scope.guestemail = $scope.guestemail;
        console.log("inside searching", $rootScope.notilist);
    } else {
        $scope.guestNotify = [];
        $scope.getguestsList();
        console.log("outside searching");


    }


    $scope.gotoedit = function(id) {
        $rootScope.guestId = id;
        $state.go("editpreauth");
    }

    $scope.editcatnotes = function(data, id) {
        console.log("value", data, $scope.guest.category);
        $rootScope.notesdata = data;
        if ($scope.guest.category) {
            $rootScope.category = $scope.guest.category;
        } else {
            $scope.alertPopResi('Alert', 'Please select a category');
            return;
        }

        $scope.editauthorization(id);

    }


    $scope.editauthorization = function(id) {
        $ionicLoading.show();
        if ($scope.showchecktoday) {
            $scope.guest.scheduling_type = 1;

        }
        if ($scope.showcheckother) {
            $scope.guest.scheduling_type = 2;

            if ($scope.showtypedaily) {
                $scope.guest.option = 1;
                $scope.guest.day_of_month = '';
                $scope.guest.days = '';

            }
            if ($scope.showtypeweekly) {
                $scope.guest.option = 2;
                if ($rootScope.days && $rootScope.days.length == 0) {
                    $ionicLoading.hide();
                    $scope.alertPopResi('Alert', 'Please select a day');
                    return;
                }
                $scope.guest.days = $rootScope.days;
                $scope.guest.recuring = $scope.showcheck;
                $scope.guest.day_of_month = '';
            }
            if ($scope.showtypemonthly) {
                $scope.guest.option = 3;
                console.log("$scope.guest.day_of_month", $scope.guest.day_of_month);
                if ($scope.guest.day_of_month == undefined || $scope.guest.day_of_month == '') {
                    $ionicLoading.hide();
                    $scope.alertPopResi('Alert', 'Please select a day of month');
                    return;
                }
                $scope.guest.recuring = $scope.showcheck;
                $scope.guest.days = '';

            }
        }
        if ($scope.showcheckindefinite) {
            $scope.guest.scheduling_type = 3;

        }

        if ($scope.guest.startdate && $scope.guest.enddate) {
            $ionicLoading.hide();
            if (moment($scope.guest.enddate).format() < moment($scope.guest.startdate).format()) {
                $scope.alertPopResi('Alert', 'Please select valid dates');
                return;
            }
        }

        if ($scope.guest.starttime && $scope.guest.endtime) {
            $ionicLoading.hide();
            var beginningTime = moment($scope.guest.starttime, 'h:mma');
            var endTime = moment($scope.guest.endtime, 'h:mma');
            var condition = beginningTime.isBefore(endTime);
            console.log("condition", $scope.guest.starttime, $scope.guest.endtime, condition);
            if (!condition) {
                $scope.alertPopResi('Alert', 'Please select valid times');
                return;
            }
        }

        if ($rootScope.authoriedUser == true) {
            var guestData = {
                "guest_schedule_id": id,
                "scheduling_type": $scope.guest.scheduling_type,
                "option": $scope.guest.option,
                "days": $scope.guest.days,
                "start_date": $scope.guest.startdate,
                "end_date": $scope.guest.enddate,
                "start_time": $scope.guest.starttime,
                "day_of_month": $scope.guest.day_of_month,
                "end_time": $scope.guest.endtime,
                "category": $rootScope.category,
                "notes": $rootScope.notesdata
            }

            console.log("editdata", JSON.stringify(guestData));

            existingNotifyService.editguest().save(guestData, function(res) {
                console.log("res", JSON.stringify(res));
                $rootScope.authguestid = res.guest_id;
                $ionicLoading.hide();
                if (res.code == 200) {
                    $scope.alertPopResi('Alert', 'Guest details updated succesfully.', 'guestlist');
                } else {
                    $scope.alertPopResi('Alert', res.message);
                }

            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else { $scope.logout() }
    }

    /* @function : goToDetails()
     *  @Creator  :yogini 
     *  @created  : 31052017
     *  @purpose : to go to details page of guest
     */

    $scope.goToDetails = function(id) {
        $state.go("guestdetails");
        $rootScope.guestId = id;
    }


    /* @function : showguestdetails()
     *  @Creator  :yogini 
     *  @created  : 31052017
     *  @purpose : to show the details of guest
     */


    $scope.showguestdetails = function() {
        $ionicLoading.show();
        console.log("*****", localStorage.getItem("guestdetails"));
        if (!$scope.guestId) {
            $scope.guestId = localStorage.getItem("guestdetails");
        }
        if ($rootScope.authoriedUser == true) {
            var inputjson = {
                "schedule_id": $scope.guestId,

            }
            existingNotifyService.showguest().save(inputjson, function(res) {
                $scope.guestdetail = res.results;
                // Firstname validation
                if ($scope.guestdetail.firstname != undefined && $scope.guestdetail.firstname != undefined) {
                    $scope.guestdetail.initials = $scope.guestdetail.firstname.charAt(0);
                }
                // Lastname validation
                if ($scope.guestdetail.lastname != undefined && $scope.guestdetail.lastname != undefined) {
                    $scope.guestdetail.initials += $scope.guestdetail.lastname.charAt(0);
                }
                console.log($scope.guestdetail.initials);
                $ionicLoading.hide();
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else { $scope.logout() }
    }


    /* @function : getsmsdata()
     *  @Creator  :yogini 
     *  @created  : 20062017
     *  @purpose : to get the sms or email content
     */


    $scope.getsmsdata = function(id, value) {
        $ionicLoading.show();
        if ($rootScope.authoriedUser == true) {
            var inputjson = {
                "schedule_id": id,

            }
            existingNotifyService.showguest().save(inputjson, function(res) {
                var startdate = (typeof res.results.SMS_data.pass_valid_start_date !== 'undefined') ? res.results.SMS_data.pass_valid_start_date : '';
                var enddate = (typeof res.results.SMS_data.pass_valid_end_date !== 'undefined') ? res.results.SMS_data.pass_valid_end_date : '';
                var starttime = (typeof res.results.SMS_data.pass_valid_start_time !== 'undefined') ? res.results.SMS_data.pass_valid_start_time : '';
                var endtime = (typeof res.results.SMS_data.pass_valid_end_time !== 'undefined') ? res.results.SMS_data.pass_valid_end_time : '';
                $scope.phonenumber = res.results.SMS_data.guestPhone;
                $scope.email = res.results.SMS_data.guestEmail;
                var name = res.results.SMS_data.guestFirstName;
                var message = "Hello" + ' ' + name + ',' + ' ' + res.results.SMS_data.residentFirstName +
                    " has invited you as a guest, please click on the link to get additional details. \n" + res.results.SMS_data.profile_link;
                //  var message = "Hello" + ' ' + name + ',' + 'You are invited as guest from' + ' ' + res.results.SMS_data.residentFirstName +
                //     ' ' + res.results.SMS_data.residentLastName + ' ' + 'Please find details of invitation ,' + ' ' + res.results.SMS_data.residentAddress + ' ' + res.results.SMS_data.QR_image + ' ' + startdate + ' ' + enddate + ' ' + starttime + ' ' + endtime;
                console.log("message", message);
                $ionicLoading.hide();
                if (value == 1) {
                    $scope.sendsmstoguest(message, $scope.phonenumber, $scope.email);

                } else {
                    $scope.sendemailtoguest(message, $scope.phonenumber, $scope.email);

                }
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else { $scope.logout() }
    }


    /* @function : loadauthdetail()
     *  @Creator  :yogini 
     *  @created  : 14062017
     *  @purpose : to show the details of guest on edit page
     */


    $scope.loadauthdetail = function() {
        $ionicLoading.show();
        console.log("*****", localStorage.getItem("guestdetails"));
        if (!$scope.guestId) {
            $scope.guestId = localStorage.getItem("guestdetails");
        }
        if ($rootScope.authoriedUser == true) {
            var inputjson = {
                "schedule_id": $scope.guestId,

            }
            existingNotifyService.showguest().save(inputjson, function(res) {
                $ionicLoading.hide();
                $scope.guest = res.results;
                var start_time = (res.results.pass_valid_start_date && res.results.pass_valid_start_time) ? res.results.pass_valid_start_date + ' ' + res.results.pass_valid_start_time : '';
                var end_time = (res.results.pass_valid_end_date && res.results.pass_valid_end_time) ? res.results.pass_valid_end_date + ' ' + res.results.pass_valid_end_time : '';
                $scope.starttime_take = res.results.pass_valid_start_time ? new Date(start_time) : '';
                $scope.endtime_take = res.results.pass_valid_end_time ? new Date(end_time) : '';
                $scope.guest.starttime = res.results.pass_valid_start_time;
                $scope.guest.endtime = res.results.pass_valid_end_time;
                $scope.guest.startdate = res.results.pass_valid_start_date ? res.results.pass_valid_start_date : '';
                $scope.guest.enddate = res.results.pass_valid_end_date ? res.results.pass_valid_end_date : '';
                $scope.startdate = res.results.pass_valid_start_date ? new Date(res.results.pass_valid_start_date) : ''; //moment(res.results.pass_valid_start_date).format('dd-mm-yyyy');                                
                $scope.enddate = res.results.pass_valid_end_date ? new Date(res.results.pass_valid_end_date) : '';
                console.log("check: ", $scope.startdate + ' ' + $scope.enddate)
                $scope.startdate1 = res.results.pass_valid_start_date ? moment(res.results.pass_valid_start_date).format('MMMM Do YYYY') : '';
                $scope.enddate1 = res.results.pass_valid_end_date ? moment(res.results.pass_valid_end_date).format('MMMM Do YYYY') : '';
                $scope.guest.day_of_month = res.results.day_of_month;
                $scope.showcheck = res.results.recurring;
                $scope.guest.notes = res.results.notes;

                if ($scope.guest.scheduling_type == 1) {
                    $scope.showchecktoday = true;
                    $scope.showcheckother = false;
                    $scope.showcheckindefinite = false;
                } else if ($scope.guest.scheduling_type == 2) {
                    $scope.showchecktoday = false;
                    $scope.showcheckother = true;
                    $scope.showcheckindefinite = false;
                    if ($scope.guest.option == 1) {
                        $scope.showtypedaily = true;
                        $scope.showtypeweekly = false;
                        $scope.showtypemonthly = false;
                    } else if ($scope.guest.option == 2) {
                        $scope.mangeweekdaysonedit($scope.guest.days);
                        $scope.showtypedaily = false;
                        $scope.showtypeweekly = true;
                        $scope.showtypemonthly = false;
                    } else if ($scope.guest.option == 3) {
                        $scope.showtypedaily = false;
                        $scope.showtypeweekly = false;
                        $scope.showtypemonthly = true;
                    }
                } else if ($scope.guest.scheduling_type == 3) {
                    $scope.showchecktoday = false;
                    $scope.showcheckother = false;
                    $scope.showcheckindefinite = true;
                }

            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else { $scope.logout() }
    }



    $scope.maintaineditdata = function() {
        $ionicLoading.show();
        if (!$scope.guestId) {
            $scope.guestId = localStorage.getItem("guestdetails");
        }
        if ($rootScope.authoriedUser == true) {
            var inputjson = {
                "schedule_id": $scope.guestId,

            }
            existingNotifyService.showguest().save(inputjson, function(res) {
                $ionicLoading.hide();
                console.log("res.results called", res.results);
                $scope.guest = res.results;
                var start_time = (res.results.pass_valid_start_date && res.results.pass_valid_start_time) ? res.results.pass_valid_start_date + ' ' + res.results.pass_valid_start_time : '';
                var end_time = (res.results.pass_valid_end_date && res.results.pass_valid_end_time) ? res.results.pass_valid_end_date + ' ' + res.results.pass_valid_end_time : '';
                $scope.starttime_take = res.results.pass_valid_start_time ? new Date(start_time) : '';
                $scope.endtime_take = res.results.pass_valid_end_time ? new Date(end_time) : '';
                $scope.guest.starttime = res.results.pass_valid_start_time;
                $scope.guest.endtime = res.results.pass_valid_end_time;
                $scope.guest.startdate = res.results.pass_valid_start_date ? res.results.pass_valid_start_date : '';
                $scope.guest.enddate = res.results.pass_valid_end_date ? res.results.pass_valid_end_date : '';
                $scope.startdate = res.results.pass_valid_start_date ? new Date(res.results.pass_valid_start_date) : ''; //moment(res.results.pass_valid_start_date).format('dd-mm-yyyy');                                
                $scope.enddate = res.results.pass_valid_end_date ? new Date(res.results.pass_valid_end_date) : '';
                console.log("check: ", $scope.startdate + ' ' + $scope.enddate)
                $scope.startdate1 = res.results.pass_valid_start_date ? moment(res.results.pass_valid_start_date).format('MMMM Do YYYY') : '';
                $scope.enddate1 = res.results.pass_valid_end_date ? moment(res.results.pass_valid_end_date).format('MMMM Do YYYY') : '';
                // $scope.startdate = moment(res.results.pass_valid_start_date).format('MMMM Do YYYY');
                // $scope.enddate = moment(res.results.pass_valid_end_date).format('MMMM Do YYYY');
                console.log("$scope.startdate", $scope.startdate, $scope.startdate)
                $scope.guest.day_of_month = res.results.day_of_month;
                $scope.showcheck = res.results.recurring;
                $scope.notes = res.results.notes;



            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

            })
        } else { $scope.logout() }
    }



    $scope.mangeweekdaysonedit = function(dayArr) {
        console.log("weekdays manage", dayArr);
        if (dayArr.indexOf("Monday") != -1) {
            $scope.mon = true;
            $rootScope.dayslist.push({
                "day": "Monday",
                "count": 1
            });
        } else {
            $scope.mon = false;
        }
        if (dayArr.indexOf("Tuesday") != -1) {
            $scope.tue = true;
            $rootScope.dayslist.push({
                "day": "Tuesday",
                "count": 2
            });
        } else {
            $scope.tue = false;
        }
        if (dayArr.indexOf("Wednesday") != -1) {
            $scope.wed = true;
            $rootScope.dayslist.push({
                "day": "Wednesday",
                "count": 3
            });
        } else {
            $scope.wed = false;
        }
        if (dayArr.indexOf("Thursday") != -1) {
            $scope.thi = true;
            $rootScope.dayslist.push({
                "day": "Thursday",
                "count": 4
            });
        } else {
            $scope.thi = false;
        }
        if (dayArr.indexOf("Friday") != -1) {
            $scope.fri = true;
            $rootScope.dayslist.push({
                "day": "Friday",
                "count": 5
            });
        } else {
            $scope.fri = false;
        }
        if (dayArr.indexOf("Saturday") != -1) {
            $scope.sat = true;
            $rootScope.dayslist.push({
                "day": "Saturday",
                "count": 6
            });
        } else {
            $scope.sat = false;
        }
        if (dayArr.indexOf("Sunday") != -1) {
            $scope.sund = true;
            $rootScope.dayslist.push({
                "day": "Sunday",
                "count": 7
            });
        } else {
            $scope.sund = false;
        }

        console.log("new", $rootScope.dayslist);
    }


    $scope.showdate = false;

    $scope.showdates = function(value) {
        console.log("value", value);

    }




    /* @function : doRefreshguestsList()
     *  @Creator  :yogini 
     *  @created  : 31052017
     *  @purpose : to refresh the list of guest
     */


    $scope.doRefreshguestsList = function() {
        $scope.guestNotify = [];
        $rootScope.searching = false;

        var pos = $ionicScrollDelegate.getScrollPosition();
        $scope.hideInfiniteContent = false;
        if ($rootScope.authoriedUser == true) {
            var guestlistData = {
                "resident_id": $localStorage.User.user_id,
                "property_id": $localStorage.User.property_id,
                "guest_name": $scope.guestname,
                "phone_number": $scope.guestphone,
                "email": $scope.guestemail,
                "page_number": 0,

            }
            $ionicLoading.show();
            existingNotifyService.guestlist().save(guestlistData, function(res) {
                $ionicLoading.hide()
                if (res) {
                    $scope.gotresponse = true;
                }
                localStorage.setItem('infiCount', res.list_count);
                $scope.loadContent = localStorage.getItem('infiCount');
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

                $scope.page_number = parseInt($scope.page_number) + 1;
                if (res.results.length > 0) {

                    angular.forEach(res.results, function(item) {
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;
                        $scope.guestNotify.push(item);

                        // if (item.users_id._id == $localStorage.User.user_id) {
                        //     $localStorage.User.profile_img = item.users_id.profile_img;
                        // }

                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    // $scope.noNotiText = "You have no existing reservations"
                }
                //$scope.$broadcast('scroll.refreshComplete');
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout()
        }
    }


    /* @function : sendsmstoguest()
     *  @Creator  :yogini 
     *  @created  : 31052017
     *  @purpose : to send the sms to guest
     */

    $scope.sendsmstoguest = function(message, phonenumber, email) {
        console.log("messagesssssssssssss", message);
        $cordovaSocialSharing
            .shareViaSMS(message, phonenumber)
            .then(function(result) {
                $state.go('guestlist');
                // Success!
            }, function(err) {
                // An error occurred. Show a message to the user
            });

    }


    /* @function : doRefreshguestsList()
     *  @Creator  :yogini 
     *  @created  : 31052017
     *  @purpose : to refresh the list of guest
     */


    $scope.sendemailtoguest = function(message, phonenumber, email) {
        $cordovaSocialSharing
            .shareViaEmail(message, "Invitation", email, null, null, null)
            .then(function(result) {
                $state.go('guestlist');

                // Success!
            }, function(err) {
                // An error occurred. Show a message to the user
            });
    }

    /* @function : deleteguest()
     *  @Creator  :yogini 
     *  @created  : 01062017
     *  @purpose : to delete the guest
     */

    $scope.deleteguest = function(id) {
        if ($rootScope.authoriedUser == true) {
            $scope.closeWoPop = $ionicPopup.confirm({
                title: 'Confirm',
                cssClass: 'WoMngrPopHead',
                template: 'Are you sure you want to delete the Guest?'
            });
            $scope.closeWoPop.then(function(res) {
                if (res) {
                    var inputjson = {
                        "schedule_id": id

                    }
                    existingNotifyService.deleteguest().save(inputjson, function(res) {
                        $ionicLoading.hide();

                        if (res.code == 200) {
                            $scope.alertPopResi("Alert", res.message, 'guestlist');
                        } else {
                            $scope.alertPopResi("Alert", res.message);
                        }

                    }, function(err) {
                        $ionicLoading.hide();
                        $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);

                    })

                } else {}
            });
        } else { $scope.logout() }

    }


    $scope.blur = false;

    $scope.showIt = function() {
        $scope.blur = true;
        var template = 'templates/Resident/searchguestresi.html';
        $ionicModal.fromTemplateUrl(template, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        $scope.blur = false;

        // Execute action
        console.log("hidden");

    });

    $scope.closeModal = function() {
        $scope.blur = false;
        $rootScope.closing = true;
        if ($scope.modal) {
            $scope.modal.hide();

        }
    };

    /* @function : generateAvtarOnimageLoadError()
     *  @Creator  :Shivansh 
     *  @created  : 19012017
     */


    $scope.showErrorImg = false; // for show & hide error avatar img on img load- Shivansh
    $scope.generateAvtarOnimageLoadError = function() {
            $scope.showErrorImg = true;
        }
        /****************sorting of list ***********/
    $scope.sortComment = function(message) {
            var date = new Date(message.created);
            return date;
        }
        /****************sorting of list ends ***********/
    $scope.doRefresh = function() {
        if ($rootScope.authoriedUser == true) {
            var existingNotiData = {
                "token": $localStorage.User.token,
                "users_id": $localStorage.User.user_id,
                "services_category_id": localStorage.getItem('currentFeature_id'),
                "property_id": $localStorage.User.property_id,
                "page_number": "0",
                "units_id": $localStorage.User.units_id
            }
            existingNotifyService.existNotify().save(existingNotiData, function(res) {
                if (res) {
                    $scope.gotresponse = true;
                }
                $scope.msgLength = res.results.length;
                if (res.results.length > 0) {
                    $scope.page_number = parseInt($scope.page_number) + 1;
                    angular.forEach(res.results, function(item) {
                        var timefromtz = moment(item.service_id.timefrom).tz(localStorage.getItem('timezone'));


                        item.timeFromFormatted = timefromtz.format('MMM Do, YYYY');
                        item.timefromCal = timefromtz.format("hh:mm A");
                        var timeTotz = moment(item.service_id.timeto).tz(localStorage.getItem('timezone'));
                        item.timetoCal = timeTotz.add(1, 'minutes').format("hh:mm A");
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;
                    });
                    setTimeout(function() {
                        $scope.existingNotify = res.results;
                    });
                }
                $scope.$broadcast('scroll.refreshComplete');
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout();
        }
    }

    if (localStorage.getItem('slugNamewo') == "ewo") {
        $scope.headertext = 'Emergency Work Order';
    } else if (localStorage.getItem('slugNamewo') == "nwo") {
        $scope.headertext = 'Normal Work Order';
    } else if (localStorage.getItem('slugNamewo') == "bgfd") {
        $scope.headertext = 'Visitors';
    } else if (localStorage.getItem('slugNamewo') == "pckg") {
        $scope.headertext = 'Package Delivery';
    } else if (localStorage.getItem('slugNamewo') == "cl") {
        $scope.headertext = 'Valet';
    } else if (localStorage.getItem('slugNamewo') == "rsvt") {
        $scope.headertext = 'Reservation';
    }

    $scope.getNotifyList = function() {
        $scope.hideInfiniteContent = false;
        if ($rootScope.authoriedUser == true) {
            var existingNotiData = {
                "token": $localStorage.User.token,
                "users_id": $localStorage.User.user_id,
                "services_category_id": localStorage.getItem('currentFeature_id'),
                "property_id": $localStorage.User.property_id,
                "page_number": $scope.page_number,
                "units_id": $localStorage.User.units_id
            }
            $ionicLoading.show();
            existingNotifyService.existNotify().save(existingNotiData, function(res) {
                $ionicLoading.hide()
                if (res) {
                    $scope.gotresponse = true;
                }
                localStorage.setItem('infiCount', res.list_count);
                $scope.loadContent = localStorage.getItem('infiCount');
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

                // if ($scope.msgLength == ($scope.loadContent-1) ) {
                //   $scope.noMoreItemsAvailable = true;
                // } else {
                //   $scope.noMoreItemsAvailable = false;
                // }
                $scope.page_number = parseInt($scope.page_number) + 1;
                if (res.results.length > 0) {

                    angular.forEach(res.results, function(item) {

                        var timefromtz = moment(item.service_id.timefrom).tz(localStorage.getItem('timezone'));
                        item.timeFromFormatted = timefromtz.format('MMM Do, YYYY');
                        item.timefromCal = timefromtz.format("hh:mm A");
                        var timeTotz = moment(item.service_id.timeto).tz(localStorage.getItem('timezone'));
                        item.timetoCal = timeTotz.add(1, 'minutes').format("hh:mm A");
                        var count = 0;
                        angular.forEach(res.count_data, function(val) {
                            if (item._id == val._id) {
                                count = val.count;
                            }
                        });
                        item.unreadthreadVal = count;
                        $scope.existingNotify.push(item);

                        if (item.users_id._id == $localStorage.User.user_id) {
                            $localStorage.User.profile_img = item.users_id.profile_img;
                        }

                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    // $scope.noNotiText = "You have no existing reservations"
                }
                //$scope.$broadcast('scroll.refreshComplete');
            }, function(err) {
                $ionicLoading.hide();
                $scope.alertPopResi(CONFIG.servererr, CONFIG.servererrmsg);
            })
        } else {
            $scope.logout()
        }
    }

    $scope.getNotificationthread = function(value) {
        localStorage.setItem('rvstHeaderID', value.services_category_id);
        if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
            $cordovaBadge.decrease(value.unreadthreadVal).then(function(res) {
                // alert("clear badge", res);
                // You have permission, badge decreased.
            }, function(err) {
                // You do not have permission.
            });
        }
        for (i = 0; i < value.to_users_id.length; i++) {
            if (value.to_users_id[i].is_read == true && value.to_users_id[i].users_id == $localStorage.User.user_id) {
                localStorage.setItem('makeTrue', false);
            } else if (value.to_users_id[i].is_read != true && value.to_users_id[i].users_id == $localStorage.User.user_id) {
                localStorage.setItem('makeTrue', true)
            }
        }
        var service_id = value._id;
        localStorage.setItem("service_id", service_id);
        if (value.services_category_id == '5629c4763949c780667d5c5c' || value.services_category_id == '5629c4a03949c780667d5c5d') {
            $state.go("woDetailspgResi");
        } else {
            $state.go("woNoitfythrd");

        }
    }

    $scope.getNotificationthread = function(value) {
        if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
            $cordovaBadge.decrease(value.unreadthreadVal).then(function(res) {
                //alert("clear badge", res);
                // You have permission, badge decreased.
            }, function(err) {
                // You do not have permission.
            });
        }
        for (i = 0; i < value.to_users_id.length; i++) {
            if (value.to_users_id[i].is_read == true && value.to_users_id[i].users_id == $localStorage.User.user_id) {
                localStorage.setItem('makeTrue', false);
            } else if (value.to_users_id[i].is_read != true && value.to_users_id[i].users_id == $localStorage.User.user_id) {
                localStorage.setItem('makeTrue', true)
            }
        }
        var service_id = value._id;
        localStorage.setItem("service_id", service_id);
        if (value.services_category_id == '5629c4763949c780667d5c5c' || value.services_category_id == '5629c4a03949c780667d5c5d') {
            $state.go("woDetailspgResi");
        } else if (value.services_category_id == '5629c38a3949c780667d5c59' || value.services_category_id == '5629c3cc3949c780667d5c5a') {
            localStorage.setItem('rvstHeaderID', value.services_category_id);
            $state.go("DetailspgResiVp");
        } else {
            $state.go("woNoitfythrd");

        }
    }

    /* @function : callphone()
     *  @Creator  :sidjain
     *  @created  : Jul 25 2017
     *  @purpose : to show call popup when phone number is clicked on guest list/details screens
     */
    $scope.callphone = function(data) {
        window.plugins.CallNumber.callNumber(onSuccess, onError, data, false);

        function onSuccess(result) {
            console.log("Success:" + result);
        }

        function onError(result) {
            console.log("Error:" + result);
        }
    };

    /* @function : emailContact()
     *  @Creator  :sidjain
     *  @created  : Jul 25 2017
     *  @purpose : to open email composer when email is clicked on guest list/details screens
     */
    $scope.emailContact = function(emailaddress) {

        $cordovaEmailComposer.isAvailable().then(function() {
            // is available
        }, function() {
            // not available
        });

        var email = {
            to: emailaddress,
            subject: 'Hey There!',
            body: 'Hello,<br><br>',
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function() {
            // user cancelled email
        });
    };


    /********on scroll loading data ******/
    $scope.loadMore = function() {
        //calling("load more")
        $scope.getNotifyList();
    }

    $scope.loadGuest = function() {
            //calling("load more")
            $scope.getguestsList();
        }
        /********on scroll loading data ends******/
})
