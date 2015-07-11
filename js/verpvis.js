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
        controls.setCameraPosition(2, 0, 0);

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

        //floor
        addFloor();

        //add some spheres
        plotSphere(Verp.Vec(-5, -5, -30), 1);
        plotSphere(Verp.Vec(0, 0, -30), 1);
        plotSphere(Verp.Vec(5, 5, -30), 1);

        //render
        requestAnimationFrame(render);
    }

    function plotSphere(vec, val) {
        var mat = new THREE.MeshLambertMaterial({
            color: 0xFF0000
        });
        var geo = new THREE.SphereGeometry(val, 16, 16);
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
