var VerpVis = (function() {
    'use strict';

    /**********
     * config */
    var DIMS = [960, 500];

    /*************
     * constants */

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
        var v1 = Verp.Vec(0, 10, 0), q1 = 29;
        var v2 = Verp.Vec(12, 4, 20), q2 = 7;
        var v3 = Verp.Vec(30, 24, 8), q3 = 14;
        var v4 = Verp.Vec(28, 19, 36), q4 = 0;

        var maxVal = 40;
        var delta = 4;
        for (var x = 0; x < maxVal; x+=delta) {
            for (var y = 0; y < maxVal; y+=delta) {
                for (var z = 0; z < maxVal; z+=delta) {
                    var c = Verp.Vec(x, y, z);
                    var qc = Verp.burp(
                        [v1,v2,v3,v4], [q1,q2,q3,q4], c
                    );
                    var size = 0.1 + 1.4*qc/29;
                    plotSphere(c, size);
                }
            }
        }

        plotSphere(v1, 0.5, 0xFFFF00);
        plotSphere(v2, 0.5, 0xFFFF00);
        plotSphere(v3, 0.5, 0xFFFF00);
        plotSphere(v4, 0.5, 0xFFFF00);

        //render
        requestAnimationFrame(render);
    }

    function plotSphere(vec, rad, color) {
        var mat = new THREE.MeshLambertMaterial({
            color: color || 0xFF0000
        });
        var geo = new THREE.SphereGeometry(rad, 16, 16);
        var sphere = new THREE.Mesh(geo, mat);
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
