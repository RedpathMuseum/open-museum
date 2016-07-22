var container, camera, scene, renderer,LeePerryMesh, controls;
var WIDTH = 800;
var LENGTH = 800;
var CAMERA_DISTANCE = -20;

var camcounter =0;
var camPLcounter = 0;
var numOfAnnotations = 3;


var camlookat_start = new THREE.Vector3(0.018518396076858696, 0.08320761783954866,-0.9963601669693058);
var camposition_start = new THREE.Vector3(-5.488823519163917, 4.861637666233516, 221.22000845737145);

var camlookatpoints = [];
// camlookatpoints[0] = new THREE.Vector3(119, 116, 293);
camlookatpoints[0] = new THREE.Vector3(7, -12, -17);
camlookatpoints[1] = new THREE.Vector3(14.486004686585296, 20.973093793771437, 0.260283392977336);
//x: 14.486004686585296, y: 20.973093793771437, z: 0.260283392977336}
//75, 73, 57
camlookatpoints[2] = new THREE.Vector3(-1.7851443607485407, 21.50316117649372, 21.947977163593784);
//x: -1.7851443607485407, y: 21.50316117649372, z: 21.947977163593784

var campositions = [];
//campositions[0] = new THREE.Vector3(119, 116, 303);
campositions[0] = new THREE.Vector3(10, -6, -24);
campositions[1] = new THREE.Vector3(24.227563973893602, 19.614504700896756, 2.0647939439520857);
//24.227563973893602, y: 19.614504700896756, z: 2.0647939439520857
//68, 67, 54
campositions[2] = new THREE.Vector3(-1.0199619000466296,20.45148443807288, 31.86847483897232);
//x: -1.0199619000466296, y: 20.45148443807288, z: 31.86847483897232

var textureLoader = new THREE.TextureLoader();


//Variables for Raycaster
var x;
var y;
var raycaster;
var mesh;
var stl_1 = new THREE.Mesh();
var cube;
var line;
var mouseHelper;
var mouse = new THREE.Vector2();

var intersection = {
intersects: false,
point: new THREE.Vector3(),
normal: new THREE.Vector3()
};

var camlookatpoint = THREE.Vector3();
var camposalongnormal = THREE.Vector3();

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

    // var cube = new THREE.Mesh( new THREE.CubeGeometry(1,1,1), new THREE.MeshNormalMaterial() );
    // scene.add(cube);



    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    // Controlls
    //controls = new THREE.TrackballControls( camera, canvas3D );

    // lights
    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var light = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( light );

    // camera.lookAt(mesh.position)
    // camera.position.x=mesh.position.x;
    // camera.position.y=mesh.position.y;
    // camera.position.z=CAMERA_DISTANCE;

  //Loading a .stl file
    var loader = new THREE.STLLoader();

    loader.load( '../models/kaplan.STL', function ( geometry ) {

        var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
        mesh = new THREE.Mesh( geometry, material );
        stl_1 = mesh.clone();
        scene.add( stl_1 );

       }
      );

      // camera.lookAt(stl_1.position)
      // camera.position.x=stl_1.position.x - 40;
      // camera.position.y=stl_1.position.y + 40 ;
      // camera.position.z=CAMERA_DISTANCE+20;
      //
      // controls.target = new THREE.Vector3(stl_1.position.x, stl_1.position.y, CAMERA_DISTANCE);
      // controls.minDistance = 50;
      // controls.maxDistance = 200;

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

        //JSON LOADER

        loadLeePerrySmith();

        //JSON LOADER


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

        window.addEventListener("keydown", leftArrowKeyDown, false);


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
          if ( ! LeePerryMesh ) return;
          raycaster.setFromCamera( mouse, camera );
          var intersects = raycaster.intersectObjects( [ LeePerryMesh ] );
          if ( intersects.length > 0 ) {
            var p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );
            var n = intersects[ 0 ].face.normal.clone();
            console.log("before mult scalar");
            console.log(n);
            n.multiplyScalar( 10 );
            console.log("Ater multscalar before adding p");
            console.log(n);
            n.add( intersects[ 0 ].point );
            intersection.normal.copy( intersects[ 0 ].face.normal );
            mouseHelper.lookAt( n );
            line.geometry.vertices[ 0 ].copy( intersection.point );
            line.geometry.vertices[ 1 ].copy( n );
            line.geometry.verticesNeedUpdate = true;
            intersection.intersects = true;
            console.log("interesect normal after mult scalar ");
            console.log(n);
            console.log("intersect point ");
            console.log(p);
            camlookatpoint = line.geometry.vertices[ 0 ].copy( intersection.point );
            console.log("camlookatpoint");
            console.log(camlookatpoint);
            camposalongnormal = line.geometry.vertices[ 1 ].copy( n );
            console.log("camposalongnormal");
            console.log(camposalongnormal);
            console.log('camcurrentlook');
            console.log(camera.getWorldDirection());
            console.log('camcurrentposition');
            console.log(camera.position);

          }
          else {
            intersection.intersects = false;
          }
      }




      //Code for Raycaster


}


function leftArrowKeyDown(event) {
  var keyCode = event.keyCode;
  if(keyCode==37) {
    console.log("You hit the left arrow key.");
    // console.log(camlookatpoints[camcounter]);
    console.log(campositions[camcounter]);
    camera.lookAt(camlookatpoints[camcounter]);
      camera.position.x=campositions[camcounter].x;
      camera.position.y=campositions[camcounter].y;
      camera.position.z=campositions[camcounter].z;
    console.log(camcounter);
  //  controls.target = camlookatpoints[camcounter];




      if (camcounter != numOfAnnotations -1) {
        camcounter+= 1;
      }
      else {
        camcounter = 0;
      }

    }
    else if (keyCode ==39) {
      camera.lookAt(camlookat_start);
      camera.position.x = camposition_start.x;
      camera.position.x = camposition_start.y;
      camera.position.x = camposition_start.z;
      console.log('Reset camera');
    }
    else {
    console.log("Oh no you didn't.");
    }
}


function shoot() {

  console.log('shooting');
  // var camlookatpoints = {
  //   look1: new THREE.Vector3(119, 116, 293),
  //   look2: new THREE.Vector3(75, 73, 57),
  //   look3: new THREE.Vector3(105, 95, 2)
  // };
  // var camposition = {
  //   pos1: new THREE.Vector3(119, 116, 303),
  //   pos2: new THREE.Vector3(68, 67, 54),
  //   pos3: new THREE.Vector3(103, 93, -7)
  // };

  // var look = new THREE.Vector3(119, 116, 293 );
  // var pos = new THREE.Vector3(119, 116, 303);
  //
  // camera.lookAt(stl_1.position);
  // camera.position.x=stl_1.position.x - camcounter*10;
  // camera.position.y=stl_1.position.y + camcounter*10 ;
  // camera.position.z=CAMERA_DISTANCE+20*camcounter;

  // camera.lookAt(look);
  // camera.position.x=pos.x ;
  // camera.position.y=pos.y ;
  // camera.position.z=pos.z + 100*camcounter;


  //camcounter += 1;
  //console.log(camcounter);
}


function loadLeePerrySmith( callback ) {
  var loader = new THREE.JSONLoader();
  loader.load( '../models/leeperrysmith/LeePerrySmith.js', function( geometry ) {
    var material = new THREE.MeshPhongMaterial( {
      specular: 0x111111,
      map: textureLoader.load( '../models/leeperrysmith/Map-COL.jpg' ),
      specularMap: textureLoader.load( '../models/leeperrysmith/Map-SPEC.jpg' ),
      normalMap: textureLoader.load( '../models/leeperrysmith/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
      normalScale: new THREE.Vector2( 0.75, 0.75 ),
      shininess: 25
    } );
    LeePerryMesh = new THREE.Mesh( geometry, material );
    scene.add( LeePerryMesh );
    LeePerryMesh.scale.set( 10, 10, 10 );
    //scene.add( new THREE.FaceNormalsHelper( mesh, 1 ) );
    //scene.add( new THREE.VertexNormalsHelper( mesh, 1 ) );
    console.log('Loaded Perry Smith')
  } );
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

    //camera.lookAt( scene.position );
    renderer.render( scene, camera );

    var intersects = raycaster.intersectObjects(scene.children);
    //console.log(intersects);

    // camera.lookAt(stl_1.position)
    // camera.position.x=stl_1.position.x - camcounter*10;
    // camera.position.y=stl_1.position.y + camcounter*10 ;
    // camera.position.z=CAMERA_DISTANCE+20;
    //
    // camcounter += 1;
    // console.log(camcounter);
}
