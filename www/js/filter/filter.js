app.filter('thumb', [function() {
    return function(name) {
        if (name) {
            return name.replace("_full", "_thumb");
        } else {
            return name;
        }
    };
}]);
app.filter('small', ['$filter', function($filter) {
    return function(name) {
        if (name) {
            return name.replace("_full", "_small");
        } else {
            return name;
        }
    };
}]);
app.filter('truncate', function() {
    return function(text, length, end) {
        if (isNaN(length))
            length = 10;
        if (end === undefined)
            end = "...";
        if (text) {
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            } else {
                return String(text).substring(0, length - end.length) + end;
            }

        }
    };
});
app.value('HTMLIZE_CONVERSIONS', [
    { expr: /\n+?/g, value: '<br>' }
]);

app.filter('htmlize', function(HTMLIZE_CONVERSIONS) {
    return function(string) {
        //console.log(string);
        return HTMLIZE_CONVERSIONS.reduce(function(result, conversion) {
            return result.replace(conversion.expr, conversion.value);
            console.log(result.replace(conversion.expr, conversion.value))
        }, string || '');
    };
});

app.filter('tel', function() {
    return function(tel) {
        if (!tel) {
            return '';
        }
        var value = tel.toString().trim().replace(/^\+/, '');
        if (value.match(/[^0-9]/)) {
            return tel;
        }
        var country, city, number;
        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;
            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }
        if (number) {
            if (number.length > 3) {
                number = number.slice(0, 3) + '-' + number.slice(3, 7);
            } else {
                number = number;
            }
            return ("(" + city + ") " + number).trim();
        } else {
            return "(" + city;
        }
    };
});
app.filter('dateformat', [function() {
    return function(dateandtime) {
        if (dateandtime) {
            return moment(dateandtime).format("hh:mm A -  MMM Do, YYYY");
        }
    };
}]);
app.filter('dateformatdetails', [function() {
    return function(dateandtime) {
        if (dateandtime) {
            return moment(dateandtime).format("hh:mm A [on]  MMM Do, YYYY");
        }
    };
}]);
app.filter('dateformatnotifcation', [function() {
    return function(dateandtime) {
        if (dateandtime) {
            return moment(dateandtime).format("hh:mm A - MMM Do, YYYY");
        }
    };
}]);
app.filter('dateformatnotifcationguest', [function() {
    return function(dateandtime) {
        if (dateandtime) {
            return moment(dateandtime).format("MMM Do, YYYY");
        }
    };
}]);
app.filter('dateformat1', [function() {
    return function(dateandtime) {
        if (dateandtime) {
            return moment(dateandtime).format("MMM Do, YYYY");
        }
    };
}]);
app.filter('dateformatnews', [function() {
    return function(dateandtime) {
        if (dateandtime) {
            return moment(dateandtime).tz(localStorage.getItem('timezone')).format("MMM Do, YYYY [at] hh:mm A");
        }
    };
}]);
app.filter('substring', function() {
    return function(string, index) {
        if (string) {
            return string.slice(index);
        }
    };
});

app.filter('dateSuffix', function($filter) { // 25072016 to provide th, st etc while showing date
    var suffixes = ["th", "st", "nd", "rd"];
    return function(input) {
        var dtfilter = $filter('date')(input, 'dd');
        var day = parseInt(dtfilter, 10);
        var relevantDigits = (day < 30) ? day % 20 : day % 30;
        var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
        return suffix;
    };
});
app.filter('titleCase', function() {
    return function(input) {
        input = input || '';
        return input.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
})


/*******************************Linky Filter Start*******************************/
app.filter('convertLinks', function($sce) {
    return function(input) {
        // exp1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
        // exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
        var exp = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/ig;
        tweet = input.replace(exp, '<a onclick="goToLinkFunc(\'$1\')">$1</a>');
        return $sce.trustAsHtml(tweet);
    };
});
/*******************************Linky Filter Ends*******************************/


// /*******************************Phone Click Filter Start*******************************/
// app.filter('phoneClick', function ($sce) {
//     return function(input) {
//         console.log(input);
//     var resx = input.match(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gm);
//         //var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
//         var tweet = input.replace(resx,'<a onclick="goToPhoneNumber(\'$1\')">$1</a>');
//       return $sce.trustAsHtml(tweet);
//     };
//   });
/*******************************Phone Click Ends*******************************/
