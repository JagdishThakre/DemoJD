angular
  .module("starter.directive", [])
  /* @directive : imageonload, will call on image load complete event 
*  @Creator  :Shivansh 
*  @created  : 19012017
*/
  .directive("imageonload", function() {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        element.bind("load", function() {
          // console.log('image is loaded');
        });
        element.bind("error", function() {
          // console.log('image could not be loaded');
          scope.$apply(attrs.imageonload);
        });
      }
    };
  })
  .directive("focusMe", function($timeout) {
    return {
      scope: {
        trigger: "@focusMe"
      },
      link: function(scope, element) {
        scope.$watch("trigger", function(value) {
          if (value === "true") {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
      }
    };
  })
  .directive("ionSelect", function() {
    return {
      restrict: "EAC",
      scope: {
        label: "@",
        labelField: "@",
        provider: "=",
        ngModel: "=?",
        ngValue: "=?"
      },
      require: "?ngModel",
      transclude: false,
      replace: false,
      template:
        '<div class="selectContainer">' +
        '<label class="item item-input item-stacked-label">' +
        '<span class="input-label">{{label}}</span>' +
        '<div class="item item-input-inset">' +
        '<label class="item-input-wrapper">' +
        '<i class="icon ion-ios7-search placeholder-icon"></i>' +
        '<input id="filtro" type="search"  ng-model="ngModel" ng-value="ngValue" ng-keydown="onKeyDown()"/>' +
        "</label>" +
        '<button class="button button-small button-clear" ng-click="open()">' +
        '<i class="icon ion-chevron-down"></i>' +
        "</button>" +
        "</div>" +
        "</label>" +
        '<div class="optionList padding-left padding-right" ng-show="showHide">' +
        "<ion-scroll>" +
        '<ul class="list">' +
        '<li class="item" ng-click="selecionar(item)" ng-repeat="item in provider | filter:ngModel">{{item[labelField]}}</li>' +
        "</ul>" +
        "</ion-scroll>" +
        "</div>" +
        "</div>",
      link: function(scope, element, attrs, ngModel) {
        scope.ngValue = scope.ngValue !== undefined ? scope.ngValue : "item";

        scope.selecionar = function(item) {
          ngModel.$setViewValue(item);
          scope.showHide = false;
        };

        element.bind("click", function() {
          element.find("input").focus();
        });

        scope.open = function() {
          scope.ngModel = "";
          return (scope.showHide = !scope.showHide);
        };

        scope.onKeyDown = function() {
          scope.showHide = true;
          if (!scope.ngModel) {
            scope.showHide = false;
          }
        };

        scope.$watch("ngModel", function(newValue) {
          if (newValue) element.find("input").val(newValue[scope.labelField]);
        });
      }
    };
  })
  .directive("contenteditable", function() {
    return {
      restrict: "A", // only activate on element attribute
      require: "?ngModel", // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model
        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html(ngModel.$viewValue || "");
        };

        // Listen for change events to enable binding
        element.on("blur keyup change", function() {
          scope.$apply(readViewText);
        });

        // No need to initialize, AngularJS will initialize the text based on ng-model attribute

        // Write data to the model
        function readViewText() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if (attrs.stripBr && html == "<br>") {
            html = "";
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  })
  .directive("elastic", [
    "$timeout",
    function($timeout) {
      return {
        restrict: "A",
        require: "?ngModel",
        link: function($scope, element, attrs) {
          $scope.initialHeight =
            $scope.initialHeight || element[0].style.height;
          $scope.initialbottom =
            $scope.initialbottom || element[0].style.bottom;

          var resize = function() {
            element[0].style.height = $scope.initialHeight;
            element[0].style.height = element[0].scrollHeight + "px";
            var padding =
              element[0].scrollHeight <= 100
                ? element[0].scrollHeight - 32
                : 68;
            var height =
              element[0].scrollHeight <= 100 ? element[0].scrollHeight - 4 : 96;

            var elem = element
              .parent()[0]
              .querySelectorAll(".iClsNoteicon-list");
            if (elem.length > 0) {
              angular.forEach(elem, function(item) {
                angular.element(item).css("padding-top", padding + "px");
                item.style.height = height + "px";
              });
            }
          };
          $scope.$watch(attrs.ngModel, resize);
          $timeout(resize, 0);
        }
      };
    }
  ])
  .directive("standardTimeMeridian", function() {
    return {
      restrict: "AE",
      replace: true,
      scope: {
        etime: "=etime"
      },
      template: "<strong>{{stime}}</strong>",
      link: function(scope, elem, attrs) {
        scope.stime = epochParser(scope.etime, "time");

        function prependZero(param) {
          if (String(param).length < 2) {
            return "0" + String(param);
          }
          return param;
        }

        function epochParser(val, opType) {
          if (val === null) {
            return "00:00";
          } else {
            var meridian = ["AM", "PM"];

            if (opType === "time") {
              var hours = parseInt(val / 3600);
              var minutes = val / 60 % 60;
              var hoursRes = hours > 12 ? hours - 12 : hours;

              var currentMeridian = meridian[parseInt(hours / 12)];

              return (
                prependZero(hoursRes) +
                ":" +
                prependZero(minutes) +
                " " +
                currentMeridian
              );
            }
          }
        }

        scope.$watch("etime", function(newValue, oldValue) {
          scope.stime = epochParser(scope.etime, "time");
        });
      }
    };
  })
  .directive("focus", function() {
    return {
      restrict: "A",
      link: function($scope, elem, attrs) {
        elem.bind("keydown", function(e) {
          var code = e.keyCode || e.which;
          if (code === 13) {
            e.preventDefault();
            elem.next().focus();
          }
        });
      }
    };
  })
  .directive("hcPie", function() {
    return {
      restrict: "C",
      replace: true,
      scope: {
        items: "="
      },
      controller: function($scope, $element, $attrs) {
        console.log(2);
      },
      template: '<div id="container" style="margin: 0 auto">not working</div>',
      link: function(scope, element, attrs) {
        var chart = new Highcharts.Chart({
          //colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
          colors: [
            "#7266ba",
            "#23b7e5",
            "#27c24c",
            "#fad733",
            "#f05050",
            "#64E572",
            "#FF9655",
            "#FFF263",
            "#6AF9C4"
          ],
          chart: {
            renderTo: "container",
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            options3d: {
              enabled: true,
              alpha: 45
            }
          },
          title: {
            text: ""
          },
          tooltip: {
            enabled: false
          },
          plotOptions: {
            pie: {
              innerSize: 100,
              depth: 40,
              allowPointSelect: true,
              cursor: "none",
              dataLabels: {
                enabled: false,
                formatter: function() {
                  return this.percentage.toFixed(2) + "%";
                }
              },
              showInLegend: true
            },
            series: {
              point: {
                events: {
                  legendItemClick: function() {
                    return false; // <== returning false will cancel the default action
                  }
                }
              }
            }
          },
          // legend: {
          //     enabled: true,
          //     layout: 'horizontal',
          //     align: 'bottom',
          //     width: 100,
          //     y:15,
          //     x:30,
          //     verticalAlign: 'bottom',
          //     labelFormatter: function() {
          //         return this.name+" "+this.percentage.toFixed(2) + '%';
          //     }
          // },
          series: [
            {
              type: "pie",
              name: "",
              data: scope.items
            }
          ]
        });
        scope.$watch(
          "items",
          function(newValue) {
            chart.series[0].setData(newValue, true);
          },
          true
        );
      }
    };
  })
  .directive("elasticReplay", [
    "$timeout",
    "$window",
    function($timeout, $window) {
      return {
        restrict: "A",
        require: "?ngModel",
        link: function($scope, element, attrs) {
          $scope.initialHeight =
            $scope.initialHeight || element[0].style.height;
          var resize = function() {
            element[0].style.height = $scope.initialHeight;
            element[0].style.height = element[0].scrollHeight + "px";
            var height =
              element[0].scrollHeight <= 100
                ? element[0].scrollHeight + 10
                : 110;
            console.log("height", height);
            $scope.updateHeight(height);

            var padding =
              element[0].scrollHeight <= 100
                ? element[0].scrollHeight - 32
                : 68;
            var height =
              element[0].scrollHeight <= 100 ? element[0].scrollHeight - 4 : 96;
            var temp = height;

            var elem = element
              .parent()[0]
              .querySelectorAll(".iClsNoteicon-list");
            if (elem.length > 0) {
              angular.forEach(elem, function(item) {
                angular.element(item).css("padding-top", padding + "px");
                item.style.height = height + "px";
              });
            }
          };
          $scope.$watch(attrs.ngModel, resize);
          angular.element($window).bind("resize", function() {
            resize();
          });
          $timeout(resize, 0);
        },
        scope: true
      };
    }
  ])
  .directive("showonload", function() {
    return {
      restrict: "A",
      scope: { showonload: "@" },
      link: function(scope, element, attrs) {
        element.one("load", function() {
          element.attr("src", scope.showonload);
        });
      }
    };
  })
  .directive("myDir", [
    "$document",
    function($document) {
      return {
        restrict: "A",
        scope: true,
        link: function(scope, element, attrs) {
          element.on("click", function(e) {
            scope.$apply(function() {
              console.log(e.target);
              console.log(scope.showNumericKeyboard);
              if (
                angular.element(e.target).hasClass("key") ||
                angular.element(e.target).hasClass("costClassBase")
              ) {
                console.log("my task");
                var ionContentElem = element.parent().find("ion-content");
                console.log(ionContentElem);
                if (ionContentElem) {
                  ionContentElem.addClass("has-ion-numeric-keyboard");
                }
                scope.showNumericKeyboard = true;
              } else {
                var ionContentElem = element.parent().find("ion-content");
                console.log(ionContentElem);
                if (ionContentElem) {
                  ionContentElem.removeClass("has-ion-numeric-keyboard");
                  scope.showNumericKeyboard = false;
                  console.log(scope.showNumericKeyboard);
                }
              }
            });
            e.stopPropagation(); //stop event from bubbling up to document object
          });
        }
      };
    }
  ])
  .directive("myDirEditPrfl", [
    "$document",
    function($document) {
      return {
        restrict: "A",
        scope: true,
        link: function(scope, element, attrs) {
          element.on("click", function(e) {
            scope.$apply(function() {
              if (
                (angular.element(e.target).hasClass("key") ||
                  angular.element(e.target).hasClass("costClassBase")) &&
                !angular.element(e.target).hasClass("left-control-key")
              ) {
                var ionContentElem = element.parent().find("ion-content");
                if (ionContentElem) {
                  ionContentElem.addClass("has-ion-numeric-keyboard");
                }
                scope.showNumericKeyboard = true;
                if (scope.currentTarget == "nml") scope.activeNumber = true;
                else scope.activeEmernumber = true;
              } else {
                var ionContentElem = element.parent().find("ion-content");
                if (ionContentElem) {
                  if (scope.keyBoardbutton == "Cancel") {
                    scope.activeNumber = false;
                    scope.activeEmernumber = false;
                    console.log(" scope.isEnabled ", scope.isEnabled);
                    console.log("keyBoardbutton", scope.keyBoardbutton);
                  } else {
                    console.log("keyBoardbuttonElse", scope.keyBoardbutton);
                    if (scope.isDirEnabled) {
                      scope.isEnabled = false;
                      if (scope.currentTarget == "nml")
                        scope.activeNumber = true;
                      else scope.activeEmernumber = true;
                    } else {
                      console.log(scope.isEnabled);
                      scope.isEnabled = true;
                      scope.activeNumber = false;
                      scope.activeEmernumber = false;
                    }
                  }
                  ionContentElem.removeClass("has-ion-numeric-keyboard");
                  scope.showNumericKeyboard = false;
                }
              }
            });
            e.stopPropagation(); //stop event from bubbling up to document object
          });
        }
      };
    }
  ])
  .constant("msdElasticConfig", {
    append: ""
  })
  .directive("msdElastic", [
    "$timeout",
    "$window",
    "msdElasticConfig",
    function($timeout, $window, config) {
      "use strict";

      return {
        require: "ngModel",
        restrict: "A, C",
        link: function(scope, element, attrs, ngModel) {
          // cache a reference to the DOM element
          var ta = element[0],
            $ta = element;

          // ensure the element is a textarea, and browser is capable
          if (ta.nodeName !== "TEXTAREA" || !$window.getComputedStyle) {
            return;
          }

          // set these properties before measuring dimensions
          $ta.css({
            overflow: "hidden",
            "overflow-y": "scroll",
            "word-wrap": "break-word"
          });

          // force text reflow
          var text = ta.value;
          ta.value = "";
          ta.value = text;

          var append = attrs.msdElastic
              ? attrs.msdElastic.replace(/\\n/g, "\n")
              : config.append,
            $win = angular.element($window),
            mirrorInitStyle =
              "position: absolute; top: -999px; right: auto; bottom: auto;" +
              "left: 0; overflow: hidden; -webkit-box-sizing: content-box;" +
              "-moz-box-sizing: content-box; box-sizing: content-box;" +
              "min-height: 0 !important; height: 0 !important; padding: 0;" +
              "word-wrap: break-word; border: 0;",
            $mirror = angular
              .element(
                '<textarea tabindex="-1" ' + 'style="' + mirrorInitStyle + '"/>'
              )
              .data("elastic", true),
            mirror = $mirror[0],
            taStyle = getComputedStyle(ta),
            resize = taStyle.getPropertyValue("resize"),
            borderBox =
              taStyle.getPropertyValue("box-sizing") === "border-box" ||
              taStyle.getPropertyValue("-moz-box-sizing") === "border-box" ||
              taStyle.getPropertyValue("-webkit-box-sizing") === "border-box",
            boxOuter = !borderBox
              ? {
                  width: 0,
                  height: 0
                }
              : {
                  width:
                    parseInt(
                      taStyle.getPropertyValue("border-right-width"),
                      10
                    ) +
                    parseInt(taStyle.getPropertyValue("padding-right"), 10) +
                    parseInt(taStyle.getPropertyValue("padding-left"), 10) +
                    parseInt(taStyle.getPropertyValue("border-left-width"), 10),
                  height:
                    parseInt(taStyle.getPropertyValue("border-top-width"), 10) +
                    parseInt(taStyle.getPropertyValue("padding-top"), 10) +
                    parseInt(taStyle.getPropertyValue("padding-bottom"), 10) +
                    parseInt(
                      taStyle.getPropertyValue("border-bottom-width"),
                      10
                    )
                },
            minHeightValue = parseInt(
              taStyle.getPropertyValue("min-height"),
              10
            ),
            heightValue = parseInt(taStyle.getPropertyValue("height"), 10),
            minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
            maxHeight = parseInt(taStyle.getPropertyValue("max-height"), 10),
            mirrored,
            active,
            copyStyle = [
              "font-family",
              "font-size",
              "font-weight",
              "font-style",
              "letter-spacing",
              "line-height",
              "text-transform",
              "word-spacing",
              "text-indent"
            ];

          // exit if elastic already applied (or is the mirror element)
          if ($ta.data("elastic")) {
            return;
          }

          // Opera returns max-height of -1 if not set
          maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

          // append mirror to the DOM
          if (mirror.parentNode !== document.body) {
            angular.element(document.body).append(mirror);
          }

          // set resize and apply elastic
          $ta
            .css({
              resize:
                resize === "none" || resize === "vertical"
                  ? "none"
                  : "horizontal"
            })
            .data("elastic", true);

          /*
                     * methods
                     */

          function initMirror() {
            var mirrorStyle = mirrorInitStyle;

            mirrored = ta;
            // copy the essential styles from the textarea to the mirror
            taStyle = getComputedStyle(ta);
            angular.forEach(copyStyle, function(val) {
              mirrorStyle += val + ":" + taStyle.getPropertyValue(val) + ";";
            });
            mirror.setAttribute("style", mirrorStyle);
          }

          function adjust() {
            var taHeight, taComputedStyleWidth, mirrorHeight, width, overflow;

            if (mirrored !== ta) {
              initMirror();
            }

            // active flag prevents actions in function from calling adjust again
            if (!active) {
              active = true;

              mirror.value = ta.value + append; // optional whitespace to improve animation
              mirror.style.overflowY = ta.style.overflowY;

              taHeight =
                ta.style.height === "" ? "auto" : parseInt(ta.style.height, 10);

              taComputedStyleWidth = getComputedStyle(ta).getPropertyValue(
                "width"
              );

              // ensure getComputedStyle has returned a readable 'used value' pixel width
              if (
                taComputedStyleWidth.substr(
                  taComputedStyleWidth.length - 2,
                  2
                ) === "px"
              ) {
                // update mirror width in case the textarea width has changed
                width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                mirror.style.width = width + "px";
              }

              mirrorHeight = mirror.scrollHeight;

              if (mirrorHeight > maxHeight) {
                mirrorHeight = maxHeight;
                overflow = "scroll";
              } else if (mirrorHeight < minHeight) {
                mirrorHeight = minHeight;
              }
              mirrorHeight += boxOuter.height;
              ta.style.overflowY = overflow || "hidden";

              if (taHeight !== mirrorHeight) {
                ta.style.height = mirrorHeight + "px";
                scope.$emit("elastic:resize", $ta);
              }

              scope.$emit("taResize", $ta); // listen to this in the UserMessagesCtrl

              // small delay to prevent an infinite loop
              $timeout(function() {
                active = false;
              }, 1);
            }
          }

          function forceAdjust() {
            active = false;
            adjust();
          }

          /*
                     * initialise
                     */

          // listen
          if ("onpropertychange" in ta && "oninput" in ta) {
            // IE9
            ta["oninput"] = ta.onkeyup = adjust;
          } else {
            ta["oninput"] = adjust;
          }

          $win.bind("resize", forceAdjust);

          scope.$watch(
            function() {
              return ngModel.$modelValue;
            },
            function(newValue) {
              forceAdjust();
            }
          );

          scope.$on("elastic:adjust", function() {
            initMirror();
            forceAdjust();
          });

          $timeout(adjust);

          /*
                     * destroy
                     */

          scope.$on("$destroy", function() {
            $mirror.remove();
            $win.unbind("resize", forceAdjust);
          });
        }
      };
    }
  ]);
app.directive("scrollHeight", function($window) {
  return {
    link: function(scope, element, attrs) {
      scope.onResize = function() {
        var winHeight = $window.innerHeight - 50;
        console.log(winHeight);
        var form = angular.element(document.querySelector(".login-form"))[0];
        var formHeight = form.scrollHeight;
        console.log(formHeight);
        var scrollHeight = winHeight - formHeight;
        console.log(element);
        element.css("height", scrollHeight + "px");
      };
      scope.onResize();

      angular.element($window).bind("resize", function() {
        scope.onResize();
      });
      element.bind("load scroll", function() {
        scope.onResize();
      });
    }
  };
});

app.directive("makeWidthZero", function($window) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("datazero", function(newValue, oldValue) {
        scope.makeWidthZeroResize();
      });

      callelement = element.parent().find("ion-side-menu-content");
      // callelement.addClass('')
      scope.makeWidthZeroResize = function() {
        //  console.log(attrs.width);
        // console.log(attrs.makeWidthZero);
        attrs.width = attrs.makeWidthZero;
        // element.css({
        // '-webkit-transition': 'width 500ms ease',
        // '-moz-transition': 'width 500ms ease',
        // '-o-transition': 'width 500ms ease',
        // 'transition': 'width 500ms ease',
        //  'width':attrs.width + 'px'
        // });
        var widthTranform = 275;
        var thisCss = {};
        if (attrs.width == 0) {
          widthTranform = 275;
          thisCss = {
            "-webkit-transition":
              "-webkit-transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4),width 300ms linear",
            "-moz-transition":
              "transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4),width 300ms linear",
            "-o-transition":
              "transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4),width 300ms linear",
            transition:
              "transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4),width 300ms linear",
            width: attrs.width + "px",
            transform: "translate3d(" + widthTranform + "px, 0px, 0px)",
            "-webkit-transform":
              "translate3d(" + widthTranform + "px, 0px, 0px)"
          };
        } else {
          widthTranform = 0;
          thisCss = {
            "-webkit-transition":
              "-webkit-transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4)",
            "-moz-transition":
              "transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4)",
            "-o-transition": "transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4)",
            transition: "transform 300ms cubic-bezier(0.4, 0.5, 0.4, 0.4)",
            width: attrs.width + "px",
            transform: "translate3d(" + widthTranform + "px, 0px, 0px)",
            "-webkit-transform":
              "translate3d(" + widthTranform + "px, 0px, 0px)"
          };
        }
        element.css(thisCss);
      };
      scope.makeWidthZeroResize();
      angular.element($window).bind("resize", function() {
        scope.makeWidthZeroResize();
      });
      /* property duration timing-function delay */
    }
  };
});

app.directive("phoneInput", function($filter, $browser) {
  return {
    require: "ngModel",
    link: function($scope, $element, $attrs, ngModelCtrl) {
      var listener = function() {
        var value = $element.val().replace(/[^0-9]/g, "");
        $element.val($filter("tel")(value, false));
      };
      // This runs when we update the text field
      ngModelCtrl.$parsers.push(function(viewValue) {
        return viewValue.replace(/[^0-9]/g, "").slice(0, 10);
      });
      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = function() {
        $element.val($filter("tel")(ngModelCtrl.$viewValue, false));
      };
      $element.bind("change", listener);
      $element.ready(listener);
      $element.bind("keydown", function(event) {
        var key = event.keyCode;
        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        // This lets us support copy and paste too
        if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
          return;
        }
        $browser.defer(listener); // Have to do this or changes don't get picked up properly
      });
      $element.bind("paste cut", function() {
        $browser.defer(listener);
      });
    }
  };
});

/*Masking Number Directive Start*/

app.directive("phoneInput", function($filter, $browser) {
  return {
    require: "ngModel",
    link: function($scope, $element, $attrs, ngModelCtrl) {
      var listener = function() {
        var value = $element.val().replace(/[^0-9]/g, "");
        $element.val($filter("tel")(value, false));
      };
      // This runs when we update the text field
      ngModelCtrl.$parsers.push(function(viewValue) {
        return viewValue.replace(/[^0-9]/g, "").slice(0, 10);
      });
      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = function() {
        $element.val($filter("tel")(ngModelCtrl.$viewValue, false));
      };
      $element.bind("change", listener);
      $element.ready(listener);
      $element.bind("keydown", function(event) {
        var key = event.keyCode;
        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        // This lets us support copy and paste too
        if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
          return;
        }
        $browser.defer(listener); // Have to do this or changes don't get picked up properly
      });
      $element.bind("paste cut", function() {
        $browser.defer(listener);
      });
    }
  };
});

/**** for close IOS keyboard while peress return button ****/
app.directive("input", function($timeout) {
  return {
    restrict: "E",
    scope: {
      returnClose: "=",
      onReturn: "&"
    },
    link: function(scope, element, attr) {
      element.bind("keydown", function(e) {
        if (e.which == 13) {
          element[0].blur();

          /*** for future if input value return true only hit the submit button ****/
          // if(scope.returnClose){
          //     console.log('return-close true: closing keyboard');
          //     alert('return-close true: closing keyboard'+scope.returnClose);

          // }
          // if(scope.onReturn){
          //     console.log('on-return set: executing');
          //     alert('on-return set: executing'+ scope.onReturn);
          //     $timeout(function(){
          //         scope.onReturn();
          //     });
          // }
          /*** for future if input value return true only hit the submit button ****/
        }
      });
    }
  };
});
