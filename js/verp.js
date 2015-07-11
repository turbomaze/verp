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
    /* interp2(v1, q1, v2, q2, v3)
     * Given two vectors and two corresponding values, this function returns an
     * estimate of a third vector's value. Uses linear interpolation.
     */
    function interp2(v1, q1, v2, q2, v3) {
        var v2subv1 = v2('minus')(v1);
        var k = v3('minus')(v1)('dot')(v2subv1)/Math.pow(v2subv1('mag'), 2);
        var q3 = q1 + k*(q2-q1);
        return q3;
    }

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
        var self = {
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
            dot: function(a) {
                var ret = comps.reduce(function(accum, comp, idx) {
                    return accum + a(idx)*comp;
                }, 0);
                return ret;
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
            } else if (self.hasOwnProperty(cmd)) {
                return self[cmd];
            } else {
                return false;
            }
        };
    }

    /********************
     * helper functions */

    return {
        Vec: Vec,
        interp2: interp2
    };
})();
