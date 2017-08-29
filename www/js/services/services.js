angular
  .module("userServices", ["ngResource"])
  .factory("loginService", function(
    $resource,
    CONFIG,
    $rootScope,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      signin: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/login_app", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      homeCheck: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/homeCheck", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      deviceCheck: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/deviceCheck", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      isAuthorized: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/isActive", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      }
    };
  })
  .factory("logoutService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      logout: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/logout_app", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("forgotpasswordService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      forgotpassword: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/forgotpassword", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      }
    };
  })
  .factory("updateProfileService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      updateData: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/updateAppUser", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      }
    };
  })
  .factory("updateProfileImageService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      updateImage: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/updateProfilePic", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("existingNotifyService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      existNotify: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/notifications", {
          save: { method: "POST" }
        });
      },
      addguest: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_guest", {
          save: { method: "POST" }
        });
      },
      editguest: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/editGuestScheduling", {
          save: { method: "POST" }
        });
      },

      addGuestScheduling: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/addGuestScheduling", {
          save: { method: "POST" }
        });
      },

      showguest: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/guestDetail", {
          save: { method: "POST" }
        });
      },
      deleteguest: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/deleteGuestAuthorization",
          {
            save: { method: "POST" }
          }
        );
      },
      guestlist: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/VisitorsListForProperty",
          {
            save: { method: "POST" }
          }
        );
      },
      reservationListing: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/notifications_reservation_resident",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("getThread", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      thread: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/service_details", {
          save: { method: "POST" }
        });
      },
      woThreadData: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/work_order_details", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("replymessage", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      replymessage: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_thread", {
          save: { method: "POST" }
        });
      },
      editComment: function() {
        // for v1 app existing users,save production url into localstorage
        console.log(
          "dynamicBaseUrlService.urls",
          dynamicBaseUrlService.urls,
          $localStorage
        );
        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/edit_comment_service", {
          save: { method: "POST" }
        });
      },
      deleteComment: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/delete_comment_service",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("wrkOrdService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      emWo: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_em_workorder", {
          save: { method: "POST" }
        });
      },
      nWo: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_nm_workorder", {
          save: { method: "POST" }
        });
      },
      nWoStaff: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/add_nm_workorderStaff",
          {
            save: { method: "POST" }
          }
        );
      },
      predectiveText: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/list_predictive_text", {
          save: { method: "POST" }
        });
      },
      approveEstimate: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/approve_estimate", {
          save: { method: "POST" }
        });
      },
      //provide ability to  start WO by staff
      startWo: function() {
        return $resource(
          dynamicBaseUrlService.urls + "/start_workorder_staff",
          {
            save: { method: "POST" }
          }
        );
      },
      //provide ability to  close WO by staff
      closeWo: function() {
        return $resource(
          dynamicBaseUrlService.urls + "/close_workorder_staff",
          {
            save: { method: "POST" }
          }
        );
      },
      //provide ablility to re-open wo by staff
      reOpenWO: function() {
        return $resource(
          dynamicBaseUrlService.urls + "/reopen_workorder_staff",
          {
            save: { method: "POST" }
          }
        );
      },
      confirmReservation: function() {
        return $resource(
          dynamicBaseUrlService.urls + "/confirm_booking_staff",
          {
            save: { method: "POST" }
          }
        );
      },
      rejectReservation: function() {
        return $resource(dynamicBaseUrlService.urls + "/reject_booking_staff", {
          save: { method: "POST" }
        });
      },
      cancleReservation: function() {
        return $resource(dynamicBaseUrlService.urls + "/cancel_bookingStaff", {
          save: { method: "POST" }
        });
      },
      editReservationDetail: function() {
        return $resource(
          dynamicBaseUrlService.urls + "/edit_reservation_post",
          {
            save: { method: "POST" }
          }
        );
      },
      //Save rating submitted by Resident
      addRating: function() {
        return $resource(dynamicBaseUrlService.urls + "/add_rating", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("emwCallService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      emWoPhn: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/get_property_contact_number",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("cablghtService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      cblg: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_cab_light", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("notifyCount", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      notifyCount: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/notifications_count", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("reservationServices", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      rvstList: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/list_amenity", {
          save: { method: "POST" }
        });
      },
      booklist: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/booking_list", {
          save: { method: "POST" }
        });
      },
      addRvst: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_resevationEvent", {
          save: { method: "POST" }
        });
      },
      listRvst: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/list_user_booking_list",
          {
            save: { method: "POST" }
          }
        );
      },
      getItem: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/list_rvst_itemList", {
          save: { method: "POST" }
        });
      },
      getItemDetails: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/amenityitem_details", {
          save: { method: "POST" }
        });
      },
      bookItem: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/item_booking", {
          save: { method: "POST" }
        });
      },
      reservationCancel: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/cancel_booking_resident",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("contactManagementService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      emailProperty: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/property_contact_management_emails",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  /*@Services:Staff 
 * @created :19/10/2015
 * @creator:Sagar 
 * @modified :
 * @purpose : Services Used for staff
 */

  .factory("getUnitIdServices", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      getUnitId: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/units_list_app", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      }
    };
  })
  .factory("buzzaguessService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      buzzaguess: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_bffd", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      scanqrcode: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/recognozedQRViaDoorman",
          {
            save: { method: "POST" }
          }
        ); //send the post request to the server for sign in
      },
      getguestliststaff: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/VisitorsListForProperty",
          {
            save: { method: "POST" }
          }
        ); //send the post request to the server for sign in
      },
      expireguestpass: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/passValidityNotification",
          {
            save: { method: "POST" }
          }
        ); //send the post request to the server for sign in
      }
    };
  })
  .factory("packageService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      packagefun: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_packages", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      matchunitid: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/match_unit_packages", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      }
    };
  })
  .factory("getFeatures", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      wofeature: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/work_orders", {
          save: { method: "POST" }
        });
      },
      woManagerfeature: function() {
        return $resource(dynamicBaseUrlService.urls + "/wom_work_orders", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("getDynamicFeatures", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      features: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/features_list_resident",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("getNotificationstaff", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      notificationstaff: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/notifications_staff", {
          save: { method: "POST" }
        });
      },
      createdBy: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/services_createdby_list",
          {
            save: { method: "POST" }
          }
        );
      },
      taskListstaff: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/notifications_task_staff",
          {
            save: { method: "POST" }
          }
        );
      },
      getTaskDetails: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/task_details", {
          save: { method: "POST" }
        });
      },
      taskReply: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_thread_task", {
          save: { method: "POST" }
        });
      },
      taskcmplt: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/complete_task", {
          save: { method: "POST" }
        });
      },
      taskestimate: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/estimate_task", {
          save: { method: "POST" }
        });
      },
      updateestimate: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/edit_estimate_task", {
          save: { method: "POST" }
        });
      },

      listAllStaffsTasks: function() {
        return $resource(dynamicBaseUrlService.urls + "/task_listing_staff", {
          save: { method: "POST" }
        });
      },

      addStaffsTaskByManager: function() {
        return $resource(dynamicBaseUrlService.urls + "/add_task_staff", {
          save: { method: "POST" }
        });
      },
      editStaffsTaskByManager: function() {
        return $resource(dynamicBaseUrlService.urls + "/edit_tasks", {
          save: { method: "POST" }
        });
      },
      editStaffsMyTask: function() {
        return $resource(dynamicBaseUrlService.urls + "/edit_tasks", {
          save: { method: "POST" }
        });
      },
      closeStaffsTaskByManager: function() {
        return $resource(dynamicBaseUrlService.urls + "/closeTaskstaff", {
          save: { method: "POST" }
        });
      },
      deleteStaffsTaskByManager: function() {
        return $resource(dynamicBaseUrlService.urls + "/delete_taskStaff", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("addSign", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      signature: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_signature", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("PollService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      getPollList: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/polls_listing_app", {
          save: { method: "GET" }
        });
      },
      getpollDetails: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/poll_details", {
          save: { method: "POST" }
        });
      },
      submitPoll: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/submit_poll_app", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("newsFeedServices", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      postNews: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_news_app", {
          save: {
            method: "POST"
          }
        });
      },
      getNewsList: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/news_listing_app",
          function() {
            save: {
              method: "GET";
            }
          }
        );
      },
      getNewsDetails: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/news_details",
          function() {
            save: {
              method: "GET";
            }
          }
        );
      },
      replyNewsComments: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/add_comment_app",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      },
      replyMarketPlaceComments: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/add_comment_marketplace_app",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      },
      getPrivateConversation: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/marketplace_subcomments",
          function() {
            save: {
              method: "GET";
            }
          }
        );
      },
      getMarketNewsDetails: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/marketplace_details",
          function() {
            save: {
              method: "GET";
            }
          }
        );
      },
      deleteNews: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/delete_news",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      },
      updateNews: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/edit_news_app",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      },
      editComment: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/edit_comment",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      },
      deleteComment: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/delete_comment",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      },
      updatePrivateComment: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/edit_sub_comment",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      },
      addnewsImages: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/add_images_news",
          function() {
            save: {
              method: "POST";
            }
          }
        );
      }
    };
  })
  .factory("workOrderStaff", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      sendEwoStaff: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/add_em_workorder_staff",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("reservationStaffServices", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      markedReturn: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/markedReturn_staff", {
          save: { method: "POST" }
        });
      },
      notifyResiReturnItem: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/notify_resident_item_return",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("contactManagementServicesStaff", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      contactListing: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        // all_residents
        return $resource(dynamicBaseUrlService.urls + "/all_user_contact", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("chagePasswordService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      chagePassword: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/updateAppUserPassword",
          {
            save: { method: "POST" }
          }
        );
      }
    };
  })
  .factory("sideMenuLinkService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      linkFunc: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/listing_link",
          {
            //get:{method:'POST'}
          }
        );
      },
      bckendData: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/get_device_info", {
          save: { method: "POST" }
        });
      }
    };
  })
  // Milestone 1

  .factory("signUpService", function(
    $resource,
    CONFIG,
    $rootScope,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      getProperyList: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/list_property", {
          save: { method: "GET" }
        }); //send the get request to the server for properylist
      },
      getProperyUnit: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/getunits_app_for_reg", {
          save: { method: "POST" }
        }); //send the post request to the server for propertyUnit
      },
      registerUser: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_user_app", {
          save: { method: "POST" }
        }); //send the post request to the server for register the resident user
      }
    };
  })
  .factory("clearNotiService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      clearNoti: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/clearnotification", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("usersForUnitId", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      getUserIds: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/usersForUnitId", {
          save: { method: "POST" }
        });
      }
    };
  })
  .factory("uploadService", function(
    $cordovaFileTransfer,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      upload: function($cordovaFileTransfer, filePath, options) {
        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }

        var server = dynamicBaseUrlService.urls + "/upload_files";

        return $cordovaFileTransfer.upload(server, filePath, options);
      }
    };
  })
  /******************************services to get data **************************/
  .service("Guestslist", function() {
    return {};
  })
  .service("packageslist", function() {
    return {};
  })
  .service("guestsInputs", function() {
    return { id: null };
  })
  .service("reservationDataService", function() {
    return {};
  })
  .service("unitIdsList", function() {
    return {};
  })
  .service("notificationStaffList", function() {
    return {};
  })
  .service("notificationStaffTaskList", function() {
    return {};
  })
  .service("staffFeatureList", function() {
    return {};
  })
  .service("residentActionSheet", function() {
    return {};
  })
  // Milestone 2
  .service("dynamicBaseUrlService", function() {
    return {};
  })
  // =============================================================================
  // Service to share data across controllers and states
  // =============================================================================
  .service("globalShareService", function() {
    var globalShareVars = {};
    globalShareVars.data = true;
    return globalShareVars;
  })
  /*Activity*/
  .factory("activityService", function(
    $resource,
    CONFIG,
    dynamicBaseUrlService,
    $localStorage
  ) {
    return {
      activityList: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        // return $resource(dynamicBaseUrlService.urls + "/activitiesList", {
        return $resource(dynamicBaseUrlService.urls + "/activitiesListApp", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      activityDetails: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        // return $resource(dynamicBaseUrlService.urls + "/activitiesList", {
        return $resource(dynamicBaseUrlService.urls + "/activity_detail_app", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      activityDetails2: function(id) {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/activity_details/" + id
        ); //send the get request to the server for properylist
      },
      addActivity: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        // return $resource(dynamicBaseUrlService.urls + "/add_activity", {
        return $resource(dynamicBaseUrlService.urls + "/addActivityApp", {
          save: { method: "POST" }
        }); //send the post request to the server for sign in
      },
      addComments: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/add_acitivity_comment",
          {
            save: { method: "POST" }
          }
        ); //send the post request to the server for sign in
      },
      sendReadStatus: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(
          dynamicBaseUrlService.urls + "/add_acitivity_comment",
          {
            save: { method: "POST" }
          }
        ); //send the post request to the server for sign in
      },
      getUnitsList: function() {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/add_unit_Resident", {
          save: { method: "GET" }
        }); //send the post request to the server for sign in
      },

      staffList: function(id) {
        // for v1 app existing users,save production url into localstorage

        if (dynamicBaseUrlService.urls == undefined) {
          $localStorage.baseURL = "https://admin.riseliving.co";
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        } else {
          dynamicBaseUrlService.urls = $localStorage.baseURL;
        }
        return $resource(dynamicBaseUrlService.urls + "/staff_list_app/" + id); //send the post request to the server for sign in
      }
    };
  });
