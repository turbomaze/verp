Verp - Vector Interpolation
==================

Let's say you had two points `(4, 13)` and `(24, 41)` and some x-coordinate
between them like `x = 15`. If you wanted to find the corresponding y-value, the
technique you would use is linear interpolation, "lerp".

More generally, let's say you had two vector-value pairings `<v1, q1>` and
`<v2, q2>`, where the `v`'s are vectors and the `q`'s are scalars. Given a third
vector, how would you find its corresponding value? I don't know if there's an
official name for this, but it seems reasonable to me to call that vector
interpolation, or "verp".

Finding an equation for verp is straightforward enough if you know how to lerp,
but only for the specific case of interpolating between *two vectors* (I
call this "2-verp"). Ideally, we'd be able to interpolate between `n` vectors
to leverage all of the information we have. You can think of n-lerp as
regression with one independent variable. Under this lens, n-verp is a
way of estimating a vector to scalar function with just a handful of example
points. This project implements one method of n-verp-ing. (please oh please
if this thing has a proper name let me know)

### Usage

To use Verp in your project, first include the `verp.js` file somewhere.
```html
<script src="js/verp.js"></script>
<script>
    //manipulating vectors in verp.js
    var v1 = Verp.Vec(1, 2, 3); //creates the 3-component vector <1,2,3>
    var v2 = Verp.Vec([4, 5, 6]); //also creates a 3-component vector
    var x = v1(0), y = v1(1), z = v1(2); //access individual components

    var sum = v1('add')(v2); //component-wise addition
    var diff = v1('minus')(v2); //component-wise subtraction
    var prod = v1('dot')(v2); //performs the dot product operation

    var mag = sum('mag'); //returns the magnitude
    var dist = v1('dist')(v2); //distance between vectors v1 and v2
    var components = diff('comps'); //get an array of the components

    //performing vector interpolation with two known vectors
    var v3 = Verp.Vec(10, -4, 2); //a vector
    var q3 = 41; //corresponding value
    var v4 = Verp.Vec(3, 17, 9);
    var q4 = -14;
    var u = Verp.Vec(22, 3, 14); //vector with an unknown value
    var est = Verp.interp2(v3, q3, v4, q4, u); //uses 2-verp to estimate

    //but let's say you knew more vector-value pairs
    var v5 = Verp.Vec(18, -31, 1);
    var q5 = 3;
    var betterEst = Verp.burp(
        [v3, v4, v5], //array of the known vectors
        [q3, q4, q5], //array of their corresponding values
        u //the unknown vector
    );
</script>
```
