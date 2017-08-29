app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider', 'multiselectProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, multiselectProvider) {
     $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.position('bottom');
    multiselectProvider.setTemplateUrl('lib/ionic-multiselect/dist/templates/item-template.html');
    multiselectProvider.setModalTemplateUrl('lib/ionic-multiselect/dist/templates/modal-template.html');
    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCntrl'
    })
    .state('forgot_password', {
        url: '/forgotpassword',
        templateUrl: 'templates/forgotpassword.html',
        controller: 'forgotPassCtrl'
    })

    .state('landing_page', {
        url: '/landing_page',
        templateUrl: 'templates/Resident/landing_page.html',
        controller: 'HomeCtrl'
    })
    .state('editProfile', {
        url: '/editProfile',
        templateUrl: 'templates/Resident/editProfile.html',
        controller: 'EditPrflCtrl'
    })
    .state('changePassword', {
        url: '/changePassword',
        templateUrl: 'templates/Resident/changePassword.html',
        controller: 'changePassword'
    })
    .state('sideMenu', {
        url: '/sideMenu',
        abstract: true,
        templateUrl: 'templates/Resident/sidemenuResident.html',
        controller: 'FeaturesResiCtrl'
    })
    .state('sideMenu.features', {
        url: '/features',
        views: {
            'menuContent': {
                templateUrl: 'templates/Resident/feature.html'
            }
        }
    })
    .state('resi-notification', {
        url: "/notification",
        templateUrl: 'templates/Resident/notification.html',
        controller: 'NotificationCtrl'
    })

    .state('addguest', {
        url: "/addguest",
        templateUrl: 'templates/Resident/visitors/addguest.html',
        controller: 'NotificationCtrl'
    })

    .state('addcategoryvisitors', {
        url: "/addcategoryvisitors",
        templateUrl: 'templates/Resident/visitors/selectcategory.html',
        controller: 'NotificationCtrl'
    })

    .state('editcategory', {
        url: "/editcategory",
        templateUrl: 'templates/Resident/visitors/editcategory.html',
        controller: 'NotificationCtrl'
    })

    .state('guestdetails', {
        url: "/guestdetails",
        templateUrl: 'templates/Resident/visitors/guestdetails.html',
        controller: 'NotificationCtrl'
    })

    .state('preauth', {
        url: "/preauth",
        templateUrl: 'templates/Resident/visitors/preauth.html',
        controller: 'NotificationCtrl'
    })

    .state('editpreauth', {
        url: "/editpreauth",
        templateUrl: 'templates/Resident/visitors/editpreauth.html',
        controller: 'NotificationCtrl'
    })

    .state('guestlist', {
        url: "/guestlist",
        templateUrl: 'templates/Resident/visitors//guestlist.html',
        controller: 'NotificationCtrl'
    })

    .state('resi-notification-package', {
        url: "/notificationPackage",
        templateUrl: 'templates/Resident/notificationPackage.html',
        controller: 'NotificationCtrl'
    })
    .state('workorder', {
        url: "/workorder",
        templateUrl: 'templates/Resident/workorder/workorder.html',
        controller: 'WorkOrderCtrl'
    })
    .state('frstpgworkorder', {
        url: "/frstpgworkorder",
        templateUrl: 'templates/Resident/workorder/wofirstpage.html',
        controller: 'WorkOrderCtrl'
    })
    .state('emworkorder', {
        url: "/emworkorder",
        templateUrl: 'templates/Resident/workorder/emworkorder.html',
        controller: 'WorkOrderCtrl'
    })

    .state('emWoExistingList', {
        url: "/emWoExistingList",
        templateUrl: 'templates/Resident/workorder/emWoExistingList.html',
        controller: 'NotificationCtrl'
    })

    .state('nmworkorder', {
        url: "/nwworkorder",
        templateUrl: 'templates/Resident/workorder/nmworkorder.html',
        controller: 'WorkOrderCtrl'
    })
    .state('nwoExistingList', {
        url: "/nwoExistingList",
        templateUrl: 'templates/Resident/workorder/nwoExistingList.html',
        controller: 'NotificationCtrl'
    })
    .state('cablight', {
        url: "/cablight",
        templateUrl: 'templates/Resident/cablight/cablight.html',
        controller: 'CabLightCtrl'
    })
    .state('cablightfrstpg', {
        url: "/cablightfrstpg",
        templateUrl: 'templates/Resident/cablight/cablightfrstpg.html',
        controller: 'CabLightCtrl'
    })
    .state('woNoitfythrd', {
        url: "/woNoitfythrd",
        templateUrl: 'templates/Resident/wonotificationthrd.html',
        controller: 'NotificationThreadCtrl'
    })
    .state('woDetailspgResi', {
        url: "/woDetailspg",
        templateUrl: 'templates/Resident/workorder/workorderDetails.html',
        controller: 'NotificationThreadCtrl'
    })
    .state('DetailspgResiVp', {
        url: "/vpDetailspg",
        templateUrl: 'templates/Resident/notificationThreadVp.html',
        controller: 'NotificationThreadCtrl'
    })
    .state('rvstStartPg', {
        url: "/rvstStartPg",
        templateUrl: 'templates/Resident/reservation/rvstStartPg.html',
        controller: 'RvstCtrl'
    })
    .state('rvstfrstpg', {
        url: "/rvstfrstpg",
        templateUrl: 'templates/Resident/reservation/rvstfirstpg.html',
        controller: 'RvstCtrl'
    })
    .state('rvstCalItemDtls', {
        url: "/rvstCalItemDtls",
        templateUrl: 'templates/Resident/reservation/rvstCalItemDtls.html',
        controller: 'RvstCtrl'
    })
    .state('rvstscndpg', {
        url: "/rvstscndpg",
        templateUrl: 'templates/Resident/reservation/rvstscndpg.html'
    })
    .state('bookingPage', {
        url: "/bookingPage",
        templateUrl: 'templates/Resident/reservation/bookingPage.html',
        controller: 'RvstCtrl'
    })
    .state('rvstListingPg', {
        url: "/rvstListingPg",
        templateUrl: 'templates/Resident/reservation/rvstListingPg.html',
        controller: 'NotificationCtrl'
    })

    .state('rvstItem', {
        url: "/rvstItem",
        templateUrl: 'templates/Resident/reservation/rvstItemListing.html',
        controller: 'RvstCtrl'
    })
    .state('rvstItemDetails', {
        url: "/rvstItemDetails",
        templateUrl: 'templates/Resident/reservation/rvstItemDetails.html',
        controller: 'RvstCtrl'
    })
    .state('newsfeeds', {
        url: "/newsfeeds",
        templateUrl: 'templates/Resident/newsfeed/news_feeds.html',
        controller: 'NewsfeedCtrl'
    })
    .state('management', {
        url: "/management",
        templateUrl: 'templates/Resident/newsfeed/management.html',
        controller: 'NewsfeedCtrl'
    })

    .state('managementNews', {
        url: "/news",
        templateUrl: "templates/Resident/newsfeed/management-news.html",
        controller: 'NewsfeedCtrl'

    })
    .state('managementPoll', {
        url: "/poll",
        templateUrl: "templates/Resident/newsfeed/management-poll.html",
        controller: 'NewsfeedCtrl'


    })
    .state('managementEmergency', {
        url: "/emergency",
        templateUrl: "templates/Resident/newsfeed/management-emergency.html",
        controller: 'NewsfeedCtrl'
    })

    .state('resident', {
        url: "/resident",
        templateUrl: 'templates/Resident/newsfeed/resident.html',
        controller: 'NewsfeedCtrl'
    })

    .state('tab-general', {
        url: "/tabgeneral",
        abstract: true,
        templateUrl: "templates/Resident/newsfeed/tabmain-general.html"
    })

    .state('tab-general.general', {
        url: "/general",
        views: {
            'tab-resident-general': {
                templateUrl: "templates/Resident/newsfeed/tab-resident-general.html",
                controller: "NewsfeedCtrl"
            }
        }
    })

    .state('tab-general.mypost', {
        url: "/mypostgeneral",
        views: {
            'tab-residentgeneral-mypost': {
                templateUrl: "templates/Resident/newsfeed/tab-resident-generalMypost.html",
                controller: "NewsfeedCtrl"
            }
        }
    })


    .state('tab-marketplace', {
        url: "/tabmarketplace",
        abstract: true,
        templateUrl: "templates/Resident/newsfeed/tabmain-marketplace.html"
    })

    .state('tab-marketplace.marketplace', {
        url: "/marketplace",
        views: {
            'tab-resident-marketplace': {
                templateUrl: "templates/Resident/newsfeed/tab-resident-marketplace.html",
                controller: "NewsfeedCtrl"
            }
        }
    })

    .state('tab-marketplace.mypost', {
        url: "/mypostmarket",
        views: {
            'tab-residentmarket-mypost': {
                templateUrl: "templates/Resident/newsfeed/tab-resident-marketmypost.html",
                controller: "NewsfeedCtrl"
            }
        }
    })
    .state('postNews', {
        url: "/postNews",
        templateUrl: 'templates/Resident/newsfeed/postNews.html',
        controller: 'NewsfeedCtrl'
    })
    .state('resident-general-details', {
        url: "/resident-general-details",
        templateUrl: 'templates/Resident/newsfeed/resident-general-details.html',
        controller: 'NewsfeedCtrl'
    })
    .state('resident-marketplace-details', {
        url: "/resident-marketplace-details",
        templateUrl: 'templates/Resident/newsfeed/resident-marketplace-details.html',
        controller: 'NewsfeedCtrl'
    })
    .state('private-conversation', {
        url: "/private-conversation",
        templateUrl: 'templates/Resident/newsfeed/privateChat.html',
        controller: 'NewsfeedCtrl'
    })
    .state('poll-details', {
        url: "/poll-details",
        templateUrl: 'templates/Resident/newsfeed/management-pollDetails.html',
        controller: 'NewsfeedCtrl'
    })
    .state('cm-frstg', {
        url: "/cmfrstpg",
        templateUrl: 'templates/Resident/contactManagement/contMangFrst.html',
        controller: 'ContactManagement'
    })
    .state('residentEditNews', {
        url: "/residentEditNews",
        templateUrl: 'templates/Resident/newsfeed/updateNews.html',
        controller: 'NewsfeedCtrl'
    })
    .state('resiClearNoti', {
        url: '/resiClearNoti',
        templateUrl: 'templates/Resident/resiClearNoti.html',
        controller: "resiClearNotiCtrl"
    })
    .state('resident_changeBG', {
        url: '/resident_changeBG',
        templateUrl: 'templates/Resident/changeBG.html',
        controller: 'residentChangeBGCtrl'
    })

        /*@Routes:Staff
         * @created :14/10/2015
         * @creator:Sagar
         * @modified : Manu Mathew
         * @purpose : Routing Of Staff
         */


         .state('staff_home_page', {
            cache: false,
            url: '/staffhomepage',
            templateUrl: 'templates/Staff/staff_home_page.html',
            controller: 'HeaderStaffCtrl'
        })
         .state('staff_profile', {
            url: '/staff_profile',
            templateUrl: 'templates/Staff/staff_profile.html',
            controller: 'StaffPrflCtrl'
        })
         .state('staff_changeBG', {
            url: '/staff_changeBG',
            templateUrl: 'templates/Staff/changeBG.html',
            controller: 'staffChangeBGCtrl'
        })
         .state('sideMenuStaff', {
            url: '/sideMenuStaff',
            abstract: true,
            templateUrl: 'templates/Staff/sideMenuStaff.html',
            controller: 'FeaturesCtrl'
        })
         .state('sideMenuStaff.features', {
            url: '/stafffeatures',
            views: {
                'menuContent': {
                    templateUrl: 'templates/Staff/staff_features.html',
                }
            }
        })
         .state('buzzandfood_firstpage', {
            url: '/buzzandfood_firstpage',
            templateUrl: 'templates/Staff/BuzzGuest&Food/buzzguestfirstpg.html',
            controller: 'BuzzCtrl'
        })

         .state('staffguestlist', {
            url: "/staffguestlist",
            templateUrl: 'templates/Staff/BuzzGuest&Food/staffguestlist.html',
            controller: 'BuzzCtrl'
        })

         .state('staffguestdetails', {
            url: "/staffguestdetails",
            templateUrl: 'templates/Staff/BuzzGuest&Food/staffguestdetails.html',
            controller: 'BuzzCtrl'
        })

         .state('scanqrcode', {
            url: '/scanqrcode',
            templateUrl: 'templates/Staff/BuzzGuest&Food/scanqrcode.html',
            controller: 'BuzzCtrl'
        })

         .state('buzzandfood', {
            url: '/buzzandfood',
            templateUrl: 'templates/Staff/BuzzGuest&Food/buzz_guess_food.html',
            controller: 'BuzzCtrl'
        })
         .state('buzz&foodlist', {
            url: '/buzzandfoodlist',
            templateUrl: 'templates/Staff/BuzzGuest&Food/buzz_guess_food_list.html',
            controller: 'BuzzCtrl'
        })
         .state('buzz&foodreview', {
            url: '/buzzandfoodreview',
            templateUrl: 'templates/Staff/BuzzGuest&Food/buzz_guess_review.html',
            controller: 'BuzzCtrlReview'
        })
         .state('package_firstpage', {
            url: '/packagefirtspg',
            templateUrl: 'templates/Staff/Package/packagefirtspg.html',
            controller: 'BuzzCtrl'
        })
         .state('package', {
            url: '/package',
            templateUrl: 'templates/Staff/Package/package.html',
            controller: 'BuzzCtrl'

        })
         .state('packagelist', {
            url: '/packagelist',
            templateUrl: 'templates/Staff/Package/package_list.html',
            controller: 'BuzzCtrl'

        })
         .state('packagereview', {
            url: '/packagereview',
            templateUrl: 'templates/Staff/Package/package_review.html',
            controller: 'PackageCtrlReview'
        })

         .state('editpackage', {
            url: '/editpackage',
            templateUrl: 'templates/Staff/Package/editpackage.html',
            controller: 'BuzzCtrl'
        })
         /******Staff Workorder viewer starts******/
         .state('staff_workorderView', {
            url: '/staff-workorderView',
            params: {
                'parentWoType': 'woViewer',
            },
            templateUrl: 'templates/Staff/workorderViewer/workorder.html',
            controller: 'WorkOrderCtrlStaff'
        })
         .state('woDetailspgStaffView', {
            url: "/woDetailspgStaffView",
            templateUrl: 'templates/Staff/workorderViewer/staffWoDetailPg.html',
            controller: 'staffnotificationThrdCtrl'
        })
         /******Staff Workorder viewer ends******/
         /******Staff Workorder manager starts******/
         .state('staff_workorder', {
            url: '/staff-workorder',
            params: {
                'parentWoType': 'woManager',
            },
            templateUrl: 'templates/Staff/workorderManager/workorder.html',
            controller: 'WorkOrderCtrlStaff'
        })
         .state('woDetailspgStaff', {
            url: "/woDetailspgStaff",
            templateUrl: 'templates/Staff/workorderManager/staffWoDetailPg.html',
            controller: 'staffnotificationThrdCtrl'
        })
         /******Staff Workorder manager  ends here******/

         .state('staffnotification', {
            // cache: false,
            url: '/staffnotification',
            templateUrl: 'templates/Staff/staffnotification.html',
            controller: 'staffnotificationCtrl'
        })
         .state('staffReservationListing', {
            url: '/staffReservationListing',
            templateUrl: 'templates/Staff/reservation/staffReservationListing.html',
            controller: 'staffnotificationCtrl',
        })
         .state('staffnotificationthread', {
            url: '/staffnotificationthread',
            templateUrl: 'templates/Staff/staffnotificationthread.html',
            controller: 'staffnotificationThrdCtrl',
        })
         .state('signature', {
            url: '/signature',
            templateUrl: 'templates/Staff/Package/sign.html',
            controller: 'SignatureCtrl'

        })
         .state('staff-poll', {
            url: "/staff-poll",
            templateUrl: 'templates/Staff/poll.html',
            controller: 'PollCtrl'
        })
         .state('staff-pollDetails', {
            url: "/staff-pollDetails",
            templateUrl: 'templates/Staff/pollDetails.html',
            controller: 'PollCtrl'
        })

         /****Staff Reservation Page****/
         .state('staffrvstStartpg', {
            url: "/staffrvstStartpg",
            templateUrl: 'templates/Staff/reservation/staffrvstStartpg.html',
            controller: 'StaffRvstCtrl'
        })
         .state('staffrvstfrstpg', {
            url: "/staffrvstfrstpg",
            templateUrl: 'templates/Staff/reservation/staffrvstfirstpg.html',
            controller: 'StaffRvstCtrl'
        })
         .state('staffrvstscndpg', {
            url: "/staffrvstscndpg",
            templateUrl: 'templates/Staff/reservation/staffrvstscndpg.html'
        })
         .state('staffbookingPage', {
            url: "/staffbookingPage",
            templateUrl: 'templates/Staff/reservation/staffbookingPage.html',
            controller: 'StaffRvstCtrl'
        })
         .state('staffrvstListingPg', {
            url: "/staffrvstListingPg",
            templateUrl: 'templates/Staff/reservation/staffrvstListingPg.html',
            controller: 'StaffRvstCtrl'
        })
         .state('staffItemListingPg', {
            url: "/staffItemListingPg",
            templateUrl: 'templates/Staff/reservation/staffItemListingPg.html',
            controller: 'StaffRvstCtrl'
        })
         .state('StaffRvstItemDetails', {
            url: "/StaffRvstItemDetails",
            templateUrl: 'templates/Staff/reservation/StaffRvstItemDetails.html',
            controller: 'StaffRvstCtrl'
        })
         .state('StaffRvstCalItemDetails', {
            url: "/StaffRvstCalItemDetails",
            templateUrl: 'templates/Staff/reservation/StaffRvstCalItemDetails.html',
            controller: 'StaffRvstCtrl'
        })
         .state('StaffRvstSlctUnit', {
            url: "/StaffRvstSlctUnit",
            templateUrl: 'templates/Staff/reservation/SelectUnitReservation.html',
            controller: 'StaffRvstCtrl'
        })

        /****Staff Reservation Section ends
        /****Staff Emergency Workorder Viewer section start****/
        .state('EwoExistListView', {
            url: "/EwoExistListView",
            params: {
                'parentWoType': 'woViewer',
            },
            templateUrl: 'templates/Staff/workorderViewer/EwoExistList.html',
            controller: 'staffnotificationCtrl'
        })
        /****Staff Emergency Workorder Viewer section ends****/
        /****Staff Emergency Workorder Manager section start****/
        .state('emergencyWo', {
            url: "/staffemergencyWo",
            templateUrl: 'templates/Staff/workorderManager/emergencyWo.html',
            controller: 'WorkOrderCtrlStaff'
        })
        .state('EwoExistList', {
            url: "/EwoExistList",
            params: {
                'parentWoType': 'woManager',
            },
            templateUrl: 'templates/Staff/workorderManager/EwoExistList.html',
            controller: 'staffnotificationCtrl'
        })

        .state('emergencyWoUnitSlct', {
            url: "/staffemergencyWoUnitSlct",
            templateUrl: 'templates/Staff/workorderManager/emergencyWoUnitSlct.html',
            controller: 'WorkOrderCtrlStaff'
        })
        .state('sendEmergency', {
            url: "/staffsendEmergencyWoManager",
            templateUrl: 'templates/Staff/workorderManager/sendEmergencyWo.html',
            controller: 'WorkOrderCtrlStaff'
        })
        /****Staff Emergency Workorder Manager section ends****/

        /****Staff Normal Workorder Viewer section start****/
        .state('NwoExistListView', {
            url: "/NwoExistListView",
            params: {
                'parentWoType': 'woViewer',
            },
            templateUrl: 'templates/Staff/workorderViewer/NwoExistList.html',
            controller: 'staffnotificationCtrl'
        })
        /****Staff Normal Workorder Viewer section ends****/
        /****Staff Normal Workorder Manager section start****/
        .state('nwNewExist', {
            url: "/nwNewExist",
            templateUrl: 'templates/Staff/workorderManager/nwNewExist.html',
            controller: 'WorkOrderCtrlStaff'
        })
        .state('NwoExistList', {
            url: "/NwoExistList",
            params: {
                'parentWoType': 'woManager',
            },
            templateUrl: 'templates/Staff/workorderManager/NwoExistList.html',
            controller: 'staffnotificationCtrl'
        })
        .state('nwUnitSelect', {
            url: "/nwUnitSelect",
            templateUrl: 'templates/Staff/workorderManager/nwUnitSelect.html',
            controller: 'WorkOrderCtrlStaff'
        })
        .state('nwNewReqForm', {
            url: "/nwNewReqFormManager",
            templateUrl: 'templates/Staff/workorderManager/nwNewReqForm.html',
            controller: 'WorkOrderCtrlStaff'
        })
        /****Staff Normal Workorder Manager section ends****/
        /****Staff news feed section start****/
        .state('staffnewsfeeds', {
            url: "/staffnewsfeeds",
            templateUrl: 'templates/Staff/newsfeed/news_feeds.html',
            controller: 'StaffNewsfeedCtrl'
        })

        .state('staffnews', {
            url: "/staffnews",
            templateUrl: "templates/Staff/newsfeed/tab-management-news.html",
            controller: 'StaffNewsfeedCtrl'

        })
        .state('staffpoll', {
            url: "/staffpoll",
            templateUrl: "templates/Staff/newsfeed/management-poll.html",
            controller: 'StaffNewsfeedCtrl'

        })
        .state('staffemergency', {
            url: "/staffemergency",
            templateUrl: "templates/Staff/newsfeed/tab-management-emergency.html",
            controller: 'StaffNewsfeedCtrl'
        })
        .state('staffNewsResident', {
            url: "/staffNewsResident",
            templateUrl: 'templates/Staff/newsfeed/staffNewsResident.html',
            controller: 'StaffNewsfeedCtrl'
        })
        .state('staffNewsManagement', {
            url: "/staffNewsManagement",
            templateUrl: 'templates/Staff/newsfeed/staffNewsManagement.html',
            controller: 'StaffNewsfeedCtrl'
        })
        .state('tab-general-staff', {
            url: "/tabgeneralstaff",
            abstract: true,
            templateUrl: "templates/Staff/newsfeed/tabmain-general.html"
        })

        .state('tab-general-staff.general', {
            url: "/generalstaff",
            views: {
                'tab-staff-general': {
                    templateUrl: "templates/Staff/newsfeed/tab-staff-general.html",
                    controller: "StaffNewsfeedCtrl"
                }
            }
        })

        .state('tab-general-staff.mypost', {
            url: "/mypostgeneralsatff",
            views: {
                'tab-staffgeneral-mypost': {
                    templateUrl: "templates/Staff/newsfeed/tab-staff-mypost.html",
                    controller: "StaffNewsfeedCtrl"
                }
            }
        })
        .state('tab-marketplacestaff', {
            url: "/tabmarketplacestaff",
            abstract: true,
            templateUrl: "templates/Staff/newsfeed/tabmain-marketplace.html"
        })

        .state('tab-marketplacestaff.marketplace', {
            url: "/marketplacestaff",
            views: {
                'tab-staff-marketplace': {
                    templateUrl: "templates/Staff/newsfeed/tab-staff-marketplace.html",
                    controller: "StaffNewsfeedCtrl"
                }
            }
        })

        .state('tab-marketplacestaff.mypost', {
            url: "/mypostmarketstaff",
            views: {
                'tab-staffmarket-mypost': {
                    templateUrl: "templates/Staff/newsfeed/tab-staff-marketmypost.html",
                    controller: "StaffNewsfeedCtrl"
                }
            }
        })
        .state('staffpostNews', {
            url: "/staffpostNews",
            templateUrl: 'templates/Staff/newsfeed/postNews.html',
            controller: 'StaffNewsfeedCtrl'
        })
        .state('staff-comment-details', {
            url: "/staff-comment-details",
            templateUrl: 'templates/Staff/newsfeed/comment-details.html',
            controller: 'StaffNewsfeedCtrl'
        })
        //till here checked from top
        .state('staffmarket-unit-comments', {
            url: "/staffmarket-unit-comments",
            templateUrl: 'templates/Staff/newsfeed/mrktplaceUnitcmt.html',
            controller: 'StaffNewsfeedCtrl'
        })
        .state('staff-private-conversation', {
            url: "/staff-private-conversation",
            templateUrl: 'templates/Staff/newsfeed/privateChat.html',
            controller: 'StaffNewsfeedCtrl'
        })
        .state('staff-poll-details', {
            url: "/staff-poll-details",
            templateUrl: 'templates/Staff/newsfeed/management-pollDetails.html',
            controller: 'StaffNewsfeedCtrl'
        })
        .state('staffEditNews', {
            url: "/staffEditNews",
            templateUrl: 'templates/Staff/newsfeed/updateNews.html',
            controller: 'StaffNewsfeedCtrl'
        })
        /****Staff news feed section end****/
        .state('staffChangePassword', {
            url: "/staffChangePassword",
            templateUrl: 'templates/Staff/changepasswordStaff.html',
            controller: 'changePassword'
        })


        /******Task Section*********/
        .state('task', {
            url: '/task',
            templateUrl: 'templates/Staff/task/taskList.html',
            abstract: true,
            controller: 'TaskCtrlStaff'
        })
        .state('task.high', {
            url: "/taskHighPriority",
            views: {
                'highPriority-task': {
                    templateUrl: "templates/Staff/task/HighPriority.html",
                    controller: 'TaskCtrlStaff'
                }
            }
        })
        .state('task.medium', {
            url: "/taskMediumPriority",
            views: {
                'mediumPriority-task': {
                    templateUrl: "templates/Staff/task/MediumPriority.html",
                    controller: 'TaskCtrlStaff'
                }
            }
        })
        .state('task.normal', {
            url: "/taskNormalPriority",
            views: {
                'normalPriority-task': {
                    templateUrl: "templates/Staff/task/NormalPriority.html",
                    controller: 'TaskCtrlStaff'
                }
            }
        })
        .state('taskDetails', {
            url: '/taskDetails',
            templateUrl: 'templates/Staff/task/taskDetails.html',
            controller: 'TaskCtrlStaff'
        })
        /* Edit Entry My Task Start*/
        .state('editEntryMyTask', {
            url: '/editEntryMyTask',
            templateUrl: 'templates/Staff/task/editEntry.html',
            controller: 'TaskCtrlStaff'
        })
        /* Edit Entry My Task Ends*/
        .state('editMyTask', {
            url: '/editMyTask',
            templateUrl: 'templates/Staff/task/editTask.html',
            controller: 'editMyTaskCtrl'
        })
        .state('completeTask', {
            url: '/completeTask',
            templateUrl: 'templates/Staff/task/completeTask.html',
            controller: 'TaskCtrlStaff'
        })
        .state('estimateTask', {
            url: '/estimateTask',
            templateUrl: 'templates/Staff/task/estimateTask.html',
            controller: 'TaskCtrlStaff'
        })
        /* Edit Estimate My Task Start*/
        .state('editestimateTask', {
            url: '/editestimateTask',
            templateUrl: 'templates/Staff/task/editEstimate.html',
            controller: 'TaskCtrlStaff'
        })
        /* Edit Estimate My Task Ends*/


        /******Task manger routes starts******/
        .state('taskManger', {
            url: '/taskManger',
            templateUrl: 'templates/Staff/taskManager/taskList.html',
            abstract: true,
            controller: 'taskManagerCtrl'
        })
        .state('taskManger.high', {
            url: "/taskMangerHighPriority",
            views: {
                'taskMngrHighPriority': {
                    templateUrl: "templates/Staff/taskManager/HighPriority.html",
                    controller: 'taskManagerCtrl'
                }
            }
        })
        .state('taskManger.medium', {
            url: "/taskMangerMediumPriority",
            views: {
                'taskMngrMediumPriority': {
                    templateUrl: "templates/Staff/taskManager/MediumPriority.html",
                    controller: 'taskManagerCtrl'
                }
            }
        })
        .state('taskManger.normal', {
            url: "/taskMangerNormalPriority",
            views: {
                'taskMngrNormalPriority': {
                    templateUrl: "templates/Staff/taskManager/NormalPriority.html",
                    controller: 'taskManagerCtrl'
                }
            }
        })
        .state('addTaskByManager', {
            url: '/addTaskByManager',
            templateUrl: 'templates/Staff/taskManager/addTask.html',
            controller: 'taskManagerCtrl'
        })
        .state('editTaskManager', {
            url: '/editTaskManager',
            templateUrl: 'templates/Staff/taskManager/editTask.html',
            controller: 'taskManagerCtrl'
        })

        .state('taskManagerDetails', {
            url: '/taskManagerDetails',
            templateUrl: 'templates/Staff/taskManager/taskDetails.html',
            controller: 'taskManagerCtrl'
        })
        .state('completeTaskByManager', {
            url: '/completeTaskByManager',
            templateUrl: 'templates/Staff/task/completeTask.html',
            controller: 'taskManagerCtrl'
        })
        /* Edit Estimate Task Manager Start*/
        .state('editestimateTaskManager', {
            url: '/editestimateTaskManager',
            templateUrl: 'templates/Staff/taskManager/editEstimate.html',
            controller: 'taskManagerCtrl'
        })
        /* Edit Estimate Task Manager Ends*/
        .state('estimateTaskManager', {
            url: '/estimateTaskManager',
            templateUrl: 'templates/Staff/taskManager/estimateTask.html',
            controller: 'taskManagerCtrl'
        })
        /******Task manger routes ends here******/

        /* Edit Entry For Work Task Start*/
        .state('editEntryForWorkTask', {
            url: '/editentryforworktask',
            templateUrl: 'templates/Staff/taskManager/editEntryForWorkTask.html',
            controller: 'taskManagerCtrl'
        })
        /* Edit Entry Task Manager Ends*/

        .state('staffcmng', {
            url: '/staffcmng',
            templateUrl: 'templates/Staff/ContactManagement/contactManagement.html',
            abstract: true,
            controller: 'ContactManagementCtrl'
        })
        .state('staffcmng.resident', {
            url: "/resiContacts",
            views: {
                'resiContacts-contact': {
                    templateUrl: "templates/Staff/ContactManagement/resiContactsList.html",
                    controller: 'ContactManagementCtrl'
                }
            }
        })
        .state('staffcmng.staff', {
            url: "/staffContacts",
            views: {
                'staffContacts-contact': {
                    templateUrl: "templates/Staff/ContactManagement/staffContactsList.html",
                    controller: 'ContactManagementCtrl'
                }
            }
        })

        .state('contactDetails', {
            url: '/contactDetails',
            templateUrl: 'templates/Staff/ContactManagement/contactDetails.html',
            controller: 'ContactManagementCtrl'
        })
        .state('staffClearNoti', {
            url: '/staffClearNoti',
            templateUrl: 'templates/Staff/staffClearNoti.html',
            controller: 'staffClearNotiCtrl'
        })
        .state('signUpSelctPropty', {
            url: '/signUpSelctPropty',
            templateUrl: 'templates/signupSelctPrprty.html',
            controller: "signUpSelctProptyCtrl"
        })
        .state('signUpSelctProperyUnit', {
            url: '/signUpSelctProperyUnit',
            templateUrl: 'templates/signUpSelctProperyUnit.html',
            controller: "signUpSelctProptyUnitCtrl"
        })
        .state('signUp', {
            url: '/signUp',
            templateUrl: 'templates/signUp.html',
            controller: "signUpCtrl"
        })

         /*===========================================
         =            Activity log states            =
         ===========================================*/
         
         .state('activityLogsList', {
            url: '/activityLogsList',
            templateUrl: 'templates/Staff/Activity/activitylogslist.html',
            controller: 'activityLogCtrl'
        })
         .state('addActivity', {
            url: '/addActivity',
            templateUrl: 'templates/Staff/Activity/addactivity.html',
            controller: 'activityLogCtrl'
        })
         .state('activityDetails', {
            url: '/activityDetails/:activity',
            templateUrl: 'templates/Staff/Activity/activitydetail.html',
            controller: 'activityDetailLogCtrl'
        })
         
         /*=====  End of Activity log states  ======*/
         

         if (localStorage.getItem('validToken') == null || localStorage.getItem('validToken') == "not valid") {
            localStorage.setItem('emailInRoot', '');
            $urlRouterProvider.otherwise('/login');
        } else {
            if (localStorage.getItem('user_type_id') == 4)
                $urlRouterProvider.otherwise('/landing_page');
            else
                $urlRouterProvider.otherwise('/staffhomepage');
        }
    //$ionicConfigProvider.navBar.transition('none');

}])
