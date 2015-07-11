/******************\
|      Vector      |
|   Interpolation  |
| @author Anthony  |
| @version 0.2     |
| @date 2015/07/10 |
| @edit 2015/07/10 |
\******************/

var Verp = (function() {
    'use strict';

    /**********
     * config */
    var WEIGHT_FUNC = function(d1, d2) {
        var wt1 = 1/Math.max(d1+d2, 0.1);
        var wt2 = 1/Math.max(d1, 0.1) + 1/Math.max(d2, 0.1);
        return 0.75*wt1 + 0.25*wt2;
    };

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

    /* burp(vecs, qs, c)
     * Given n vector-value pairs and another vector c, this function estimates
     * c's cooresponding value.
     */
    function burp(vecs, qs, c) {
        var qcs = []; //qc estimates
        var wts = []; //weights
        for (var i = 0; i < vecs.length; i++) {
            for (var j = i+1; j < vecs.length; j++) {
                qcs.push(interp2(vecs[i], qs[i], vecs[j], qs[j], c));
                wts.push(
                    WEIGHT_FUNC(c('dist')(vecs[i]), c('dist')(vecs[j]))
                );
            }
        }
        var wtSum = wts.reduce(function(a, b) {return a+b});
        var qc = qcs.reduce(function(accum, est, idx) {
            return accum + est*wts[idx]/wtSum;
        }, 0);
        return qc;
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
            },
            and: function(val) {
                var newComps = comps.slice(0);
                if (typeof val === 'function') {
                    newComps = newComps.concat(val('comps'));
                } else {
                    newComps = newComps.concat(
                        Array.prototype.slice.call(arguments, 0)
                    );
                }
                return Vec(newComps);
            },
            ins: function(compIdx, val) {
                var newComps = comps.slice(0);
                newComps.splice(compIdx, 0, val)
                return Vec(newComps);
            },
            dist: function(a) {
                return self.minus(a)('mag');
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
        interp2: interp2,
        burp: burp
    };
})();
