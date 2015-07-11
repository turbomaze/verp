var VerpVis = (function() {
    'use strict';

    /**********
     * config */
    var DIMS = [960, 500];
    var NUM_DIMS = 2; //dimensionality of the vectors to vis
    var NUM_VECS = 6;
    var MAX_VAL = 40;

    /*************
     * constants */
    var sphereGeo = new THREE.SphereGeometry(0.5, 12, 12);
    var redMat = new THREE.MeshLambertMaterial({
        color: 0xFF0000
    });

    /*********************
     * working variables */
    var scene, camera, controls, renderer;

    /******************
     * work functions */
    function initVerpVis() {
        //set up the three.js scene
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            35, DIMS[0]/DIMS[1], 1, 10000
        );
        controls = new THREE.GodControls(
            camera, scene, $s('#canvas-container'), {
                moveSpd: 0.24,
                rotSpd: 0.017
            }
        );
        controls.setCameraPosition(0, 10, 50);

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(DIMS[0], DIMS[1]);
        renderer.setClearColor(0xF0FAFC);
        $s('#canvas-container').appendChild(renderer.domElement);

        //lights
        var l1 = new THREE.DirectionalLight(0x707070, 2);
        l1.position.set(-0.3, 4, 4);
        scene.add(l1);
        var l2 = new THREE.DirectionalLight(0x707070, 1.1);
        l2.position.set(0.3, -2, -3);
        scene.add(l2);

        //environment
        addFloor();
        drawAxes();

        //add some spheres
        if (NUM_DIMS === 1) {
            var vs = [];
            var qs = [];
            for (var ai = 0; ai < NUM_VECS; ai++) {
                vs.push(Verp.Vec(MAX_VAL*Math.random()));
                qs.push(MAX_VAL*Math.random());
            }

            var delta = 1;
            for (var x = 0; x < MAX_VAL; x+=delta) {
                var c = Verp.Vec(x);
                var qc = Verp.burp(vs, qs, c);
                plotSphere(c('and')(qc, 0));
            }

            for (var ai = 0; ai < NUM_VECS; ai++) {
                plotSphere(vs[ai]('and')(qs[ai], 0), 0.5, 0xFFFF00);
            }
        } else if (NUM_DIMS === 2) {
            var vs = [];
            var qs = [];
            for (var ai = 0; ai < NUM_VECS; ai++) {
                vs.push(Verp.Vec(
                    MAX_VAL*Math.random(),
                    MAX_VAL*Math.random()
                ));
                qs.push(MAX_VAL*Math.random());
            }

            var delta = 1;
            for (var x = 0; x < MAX_VAL; x+=delta) {
                for (var z = 0; z < MAX_VAL; z+=delta) {
                    var c = Verp.Vec(x, z);
                    var qc = Verp.burp(vs, qs, c);
                    plotSphere(c('ins')(1, qc));
                }
            }

            for (var ai = 0; ai < NUM_VECS; ai++) {
                plotSphere(vs[ai]('ins')(1, qs[ai]), 0.5, 0xFFFF00);
            }
        } else { //3 and up
            var vs = [];
            var qs = [];
            for (var ai = 0; ai < NUM_VECS; ai++) {
                vs.push(Verp.Vec(
                    MAX_VAL*Math.random(),
                    MAX_VAL*Math.random(),
                    MAX_VAL*Math.random()
                ));
                qs.push(MAX_VAL*Math.random());
            }

            var minQ = qs.reduce(function(ret, q) {
                return Math.min(ret, q);
            }, qs[0]);
            var maxQ = qs.reduce(function(ret, q) {
                return Math.max(ret, q);
            }, qs[0]);

            var delta = 4.5;
            for (var x = 0; x < MAX_VAL; x+=delta) {
                for (var y = 0; y < MAX_VAL; y+=delta) {
                    for (var z = 0; z < MAX_VAL; z+=delta) {
                        var c = Verp.Vec(x, y, z);
                        var qc = Verp.burp(vs, qs, c);
                        var size = 0.1 + 1.4*(qc-minQ)/maxQ;
                        plotSphere(c, size);
                    }
                }
            }

            for (var ai = 0; ai < NUM_VECS; ai++) {
                plotSphere(vs[ai], 0.5, 0xFFFF00);
            }
        }

        //render
        requestAnimationFrame(render);
    }

    function plotSphere(vec, rad, color) {
        var sphere = null;
        if (arguments.length === 3) {
            var geo = new THREE.SphereGeometry(rad, 16, 16);
            var mat = new THREE.MeshLambertMaterial({
                color: color || 0xFF0000
            });
            sphere = new THREE.Mesh(geo, mat);
        } else if (arguments.length === 2) {
            var geo = new THREE.SphereGeometry(rad, 16, 16);
            sphere = new THREE.Mesh(geo, redMat);
        } else {
            sphere = new THREE.Mesh(sphereGeo, redMat);
        }
        sphere.position.x = vec(0);
        sphere.position.y = vec(1);
        sphere.position.z = vec(2);
        scene.add(sphere);
    }

    function addFloor() {
        var floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({
                color: 0x3FCDCD, side: THREE.DoubleSide
            })
        );
        floor.rotation.x = -Math.PI/2;
        floor.position.y = -10;
        scene.add(floor);
    }

    function drawAxes() {
        var cellSize = 50; //how long the axes are
        var plankThickness = 0.08; //how thick the barrier planks are
        var xAxis = getPlank(0xFFFF00, {
            x: cellSize, y: plankThickness, z: plankThickness
        });
        var yAxis = getPlank(0x00FFFF, {
            x: plankThickness, y: cellSize, z: plankThickness
        });
        var zAxis = getPlank(0xFF00FF, {
            x: plankThickness, y: plankThickness, z: cellSize
        });
        xAxis.position.x = 0.5*plankThickness+0.5*cellSize;
        xAxis.position.y = 0;
        xAxis.position.z = 0;
        yAxis.position.x = 0;
        yAxis.position.y = 0.5*plankThickness+0.5*cellSize;
        yAxis.position.z = 0;
        zAxis.position.x = 0;
        zAxis.position.y = 0;
        zAxis.position.z = 0.5*plankThickness+0.5*cellSize;
        scene.add(xAxis);
        scene.add(yAxis);
        scene.add(zAxis);
    }

    function getPlank(clr, sizes) {
        var material =  new THREE.MeshLambertMaterial({
            color: clr, shading: THREE.FlatShading
        });
        var geometry = new THREE.BoxGeometry(sizes.x, sizes.y, sizes.z);
        var plank = new THREE.Mesh(geometry, material);
        return plank;
    }

    function render() {
        controls.update(); //camera controller
        renderer.render(scene, camera); //render the scene
        requestAnimationFrame(render); //next frame
    }

    /***********
     * objects */

    /********************
     * helper functions */
    function $s(id) { //for convenience
        if (id.charAt(0) !== '#') return false;
        return document.getElementById(id.substring(1));
    }

    function getRandInt(low, high) { //output is in [low, high)
        return Math.floor(low + Math.random()*(high-low));
    }

    function round(n, places) {
        var mult = Math.pow(10, places);
        return Math.round(mult*n)/mult;
    }

    return {
        init: initVerpVis
    };
})();

window.addEventListener('load', VerpVis.init);
