var container, camera, scene, renderer, mesh, controls;
var WIDTH = 800;
var LENGTH = 800;
var CAMERA_DISTANCE = -20;


//Variables for Raycaster
var x;
var y;
var raycaster;
var mesh;
var line;
var mouseHelper;
var mouse = new THREE.Vector2();

var intersection = {
intersects: false,
point: new THREE.Vector3(),
normal: new THREE.Vector3()
};

var p = new THREE.Vector3( 0, 0, 0 );
var r = new THREE.Vector3( 0, 0, 0 );
var s = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );
var check = new THREE.Vector3( 1, 1, 1 );

//Variables for Raycaster



init();
animate();

function init() {

    // HTML Container for the 3D widget
    var canvas3D = document.getElementById('canvas3D');

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

    var mesh = new THREE.Mesh( new THREE.CubeGeometry(1,1,1), new THREE.MeshNormalMaterial() );
    scene.add(mesh);



    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    // Controlls
    controls = new THREE.TrackballControls( camera, canvas3D );

    // lights
    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var light = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( light );

    camera.lookAt(mesh.position)
    camera.position.x=mesh.position.x;
    camera.position.y=mesh.position.y;
    camera.position.z=CAMERA_DISTANCE;

  //Loading a .stl file
    var loader = new THREE.STLLoader();

    loader.load( '../models/kaplan.STL', function ( geometry ) {

        var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );
        camera.lookAt(mesh.position)
        camera.position.x=mesh.position.x;
        camera.position.y=mesh.position.y;
        camera.position.z=CAMERA_DISTANCE;

       }
      );

      //Loading a .obj file
      //TODO:
      //Successfully load the original texture

      var texture = new THREE.Texture();
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};
				var onError = function ( xhr ) {
				};

      var manager = new THREE.LoadingManager();
      // model
				var loader = new THREE.OBJLoader( manager );
				loader.load( '../models/Trott_life_tentacules_with_colors_smooth_E_texture.obj', function ( object ) {

          object.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							child.material.map = texture;
						}
					} );
					object.position.y = - 95;
					scene.add( object );
				}, onProgress, onError );



        //Code for Raycaster

        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );
        

        controls = new THREE.TrackballControls( camera, canvas3D );
      	controls.minDistance = 50;
      	controls.maxDistance = 200;

        raycaster = new THREE.Raycaster()

        mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
        mouseHelper.visible = false;
        scene.add( mouseHelper );

        line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 4 } ) );
      	scene.add( line );

        window.addEventListener( 'resize', onWindowResize, false );
        var moved = false;
        controls.addEventListener( 'change', function() {
          moved = true;
        } );
        window.addEventListener( 'mousedown', function () {
          moved = false;
        }, false );
        window.addEventListener( 'mouseup', function() {
          checkIntersection();
          if ( ! moved ) shoot();
        } );
        window.addEventListener( 'mousemove', onTouchMove );
        window.addEventListener( 'touchmove', onTouchMove );
        function onTouchMove( event ) {
          if ( event.changedTouches ) {
            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;
          } else {
            x = event.clientX;
            y = event.clientY;
          }
          mouse.x = ( x / window.innerWidth ) * 2 - 1;
          mouse.y = - ( y / window.innerHeight ) * 2 + 1;
          checkIntersection();
        }
        function checkIntersection() {
          if ( ! mesh ) return;
          raycaster.setFromCamera( mouse, camera );
          var intersects = raycaster.intersectObjects( [ mesh ] );
          if ( intersects.length > 0 ) {
            var p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );
            var n = intersects[ 0 ].face.normal.clone();
            n.multiplyScalar( 10 );
            n.add( intersects[ 0 ].point );
            intersection.normal.copy( intersects[ 0 ].face.normal );
            mouseHelper.lookAt( n );
            line.geometry.vertices[ 0 ].copy( intersection.point );
            line.geometry.vertices[ 1 ].copy( n );
            line.geometry.verticesNeedUpdate = true;
            intersection.intersects = true;
          }
          else {
            intersection.intersects = false;
          }
      }


      //Code for Raycaster


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
