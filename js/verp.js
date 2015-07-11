/******************\
|      Vector      |
|   Interpolation  |
| @author Anthony  |
| @version 0.1     |
| @date 2015/07/10 |
| @edit 2015/07/10 |
\******************/

var Verp = (function() {
    'use strict';

    /**********
     * config */

    /*************
     * constants */

    /*********************
     * working variables */

    /******************
     * work functions */

    /***********
     * objects */
    function Vec(components) {
        //set components from an array or from an argument list
        var comps = [];
        if (typeof components === 'object') {
            comps = components.slice(0);
        } else {
            comps = Array.prototype.slice.call(arguments, 0);
        }

        //this "object's" properties and methods
        var fieldsAndMethods = {
            comps: comps,
            mag: Math.sqrt(comps.reduce(function(a, b) {
                return a + b*b;
            }, 0)),

            plus: function(a) {
                var sum = comps.map(function(comp, idx) {
                    return comp + a(idx);
                });
                return Vec(sum);
            },
            minus: function(a) {
                var diff = comps.map(function(comp, idx) {
                    return comp - a(idx);
                });
                return Vec(diff);
            },
            times: function(a) {
                var prod = comps.map(function(comp, idx) {
                    if (typeof a === 'function') {
                        return a(idx)*comp; //component-wise product
                    } else {
                        return a*comp; //scalar product
                    }
                });
                return Vec(prod);
            },
            set: function(compIdx, val) {
                var newComps = comps.slice(0);
                newComps[compIdx] = val;
                return Vec(newComps);
            }
        };

        //the powerhouse function that does all the work
        return function(cmd) {
            if (typeof cmd === 'number') { //syntactic sugar
                if (cmd >= 0 && cmd < comps.length) return comps[cmd];
                else return false;
            } else if (fieldsAndMethods.hasOwnProperty(cmd)) {
                return fieldsAndMethods[cmd];
            } else {
                return false;
            }
        };
    }

    /********************
     * helper functions */

    return {
        Vec: Vec
    };
})();
