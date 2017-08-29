<div ng-app="app">
    <form name="theForm" ng-controller="FormCtrl" novalidate="novalidate" autocomplete="off">
        <input type="text" ng-model="form.tel" rpattern="/\d{3}[- ]?\d{3}[- ]?\d{4}/" ng-required="form.requireTel" /> 
         <!-- /\d{2}[- ]?\d{3}[- ]?\d{5}$/ -->
     <!-- /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/ -->
   <!-- /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/ -->
        <input type="checkbox" ng-model="form.requireTel" />
        <button ng-disabled="theForm.$invalid" ng-click="action()">Action</button> {{form.tel}}
    </form>
</div>


/** This is the example model */
function Form() {
    this.tel = null;
    this.requireTel = true;
}


var app = angular.module("app",[]);

app.controller("FormCtrl", function($scope) {
    angular.extend($scope, {
        form: new Form(),
        action: action
    });
    
    function action() {
        console.log($scope.form);
    }
});

app.directive("rpattern", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, el, attrs, ngModel) {
            var validator, patternValidator,
                pattern = attrs.rpattern,
                required = true;

            if( pattern ) {
                if (pattern.match(/^\/(.*)\/$/)) {
                    pattern = new RegExp(pattern.substr(1, pattern.length -2));
                    patternValidator = function(value) {
                        return validate(pattern, value)
                    };
                }
                else {
                    patternValidator = function(value) {
                        var patternObj = scope.$eval(pattern);
                        if (!patternObj || !patternObj.test) {
                            throw new Error('Expected ' + pattern + ' to be a RegExp but was ' + patternObj);
                        }
                        return validate(patternObj, value);
                    };
                }
            }
            
            ngModel.$formatters.push(patternValidator);
            ngModel.$parsers.push(patternValidator);
            
            attrs.$observe("required", function(newval) {
                required = newval;
                patternValidator(ngModel.$viewValue);
            });
            
            function validate(regexp, value) {
           
                if( value == null || value === "" || !required || regexp.test(value) ) {
                    ngModel.$setValidity('pattern', true);
                    return value;
                }
                else {
                    ngModel.$setValidity('pattern', false);
                    return;
                }
            }
        }
    };
});
