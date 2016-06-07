var container, camera, scene, renderer, mesh, controls;
var WIDTH = 800;
var LENGTH = 800;
var CAMERA_DISTANCE = -20;



init();
animate();

function init() {

    // HTML Container for the 3D widget
    var canvas3D = document.getElementById("canvas3D");

    //Uncomment or place in main.css to set the canvas parameters
    // creaeting canvas for render window
    // var canvas3D = document.createElement( 'div' );
    // canvas3D.style.position = 'static';
    // canvas3D.style.top = '100px';
    // canvas3D.style.width = '200px';
    // //canvas3D.style.backgroundColor = #0000;
    // document.body.appendChild( canvas3D );

    // renderer
    renderer = new THREE.WebGLRenderer( {canvas: canvas3D} );
    renderer.setSize( WIDTH,LENGTH );
    renderer.setClearColor( 0xF2F2F2, 1);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( 35, WIDTH / LENGTH, 1, 10000 );

    scene.add( camera ); // required, because we are adding a light as a child of the camera

    // var cube = new THREE.Mesh( new THREE.CubeGeometry(1,1,1), new THREE.MeshNormalMaterial() );
    // scene.add(cube);



    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    // Controlls
    controls = new THREE.TrackballControls( camera, canvas3D );

    // lights
    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var light = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( light );

    // camera.lookAt(cube.position)
    // camera.position.x=cube.position.x;
    // camera.position.y=cube.position.y;
    // camera.position.z=CAMERA_DISTANCE;

    //Uncomment when STLLoader.js will be usuable
    var loader = new THREE.STLLoader();

    loader.load( 'app/models/kaplan.STL', function ( geometry ) {

        var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );
        camera.lookAt(mesh.position)
        camera.position.x=mesh.position.x;
        camera.position.y=mesh.position.y;
        camera.position.z=CAMERA_DISTANCE;

       }



      );

}




function onWindowResize() {


      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    controls.update();
    render();

}

function render() {

    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}
