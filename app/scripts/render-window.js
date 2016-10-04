var container, camera, scene, renderer, css3d_renderer, LeePerryMesh, controls, group;
/*var WIDTH = 3/4 * screen.width;*/
var LENGTH = screen.height;
var WIDTH = screen.width * .75;
if (screen.width <= 960) {
    WIDTH = screen.width * .50;
}

var CAMERA_DISTANCE = -20;

var camcounter =0;
var camPLcounter = 0;
var numOfAnnotations = 4;
var annotcounter = 0;
var tour_counter=0;

var AkeyIsDown;

//JSON Loader's variables for files paths
var object_to_load_obj_path = '../models/Homo_Erectus/Low_180.json';
var object_to_load_colormap_path = '../models/Homo_Erectus/ALBEDO1k.jpg';
var object_to_load_specmap_path = '../models/Homo_Erectus/SPEC1K.jpg';
var object_to_load_normalmap_path = '../models/Homo_Erectus/NORMAL1K.jpg';


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
camlookatpoints[3] = new THREE.Vector3(0,0,20);

var campositions = [];
//campositions[0] = new THREE.Vector3(119, 116, 303);
campositions[0] = new THREE.Vector3(10, -6, -24);
campositions[1] = new THREE.Vector3(24.227563973893602, 19.614504700896756, 2.0647939439520857);
//24.227563973893602, y: 19.614504700896756, z: 2.0647939439520857
//68, 67, 54
campositions[2] = new THREE.Vector3(-1.0199619000466296,20.45148443807288, 31.86847483897232);
//x: -1.0199619000466296, y: 20.45148443807288, z: 31.86847483897232
campositions[3] = new THREE.Vector3(0,0,20);

//Configuration variables set in edit mode
var AnnotSpheres = [];
var AnnotCamPos = [];
var AnnotCamLookatPts = [];
//Configuration variables set in edit mode

var textureLoader = new THREE.TextureLoader();


//Variables for Raycaster
var x;
var y;
var raycaster;
var mesh;
var stl_1 = new THREE.Mesh();
// var cube;
var cameraTarget = new THREE.Mesh( new THREE.CubeGeometry(0,0,0));
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

//Variables for annotation sphere
var SphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
var SphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var Sphere = new THREE.Mesh( SphereGeometry, SphereMaterial );

var CurrSphereData = [];

var tooltiptext = [];
var pTagArray = [];
//Variables for annotation sphere

//GUI Controls
var camcounter_gui = 0;
var cameraGUI = new function () {
  this.message = 'cameraGUI';
  this.explode = function() { ChangeCameraView(); };
  this.playtour = function() { PlayTour(); };
  this.nextview = function() { NextView(); };
  this.previousview = function() { PreviousView(); };
  this.changeorder = function() { ChangeAnnotOrder(); };
  this.EditMode  = false;
  this.SelectSphere = 0;
  this.Annot = new Array();
  this.Tips = new Array();


};

cameraGUI.annotcampos = 0;

var ViewMenu;

var datGUI = new dat.GUI();

datGUI.add(cameraGUI, 'message');
datGUI.add(cameraGUI, 'explode');
datGUI.add(cameraGUI, 'EditMode').onChange(function(newValue){
  console.log("Value changed to:  ", newValue);
  ChangeEditMode(newValue);
  if(newValue ==true){
    ViewMenu = datGUI.addFolder('ViewMenu');
  }


});
datGUI.add(cameraGUI, 'SelectSphere').onChange(function(newValue){
  console.log("cameraGUI.SelectSphere = ", cameraGUI.SelectSphere );
  camcounter_gui =  newValue;
  console.log("camcounter_gui = ", camcounter_gui);





});
datGUI.add(cameraGUI, 'playtour');

var InEditMode = true;
function ChangeEditMode(newValue){
  InEditMode = newValue;
  console.log("InEditMode changed to: ", InEditMode);
}
datGUI.add(cameraGUI, 'changeorder');
//GUI Controls


//3D Web content initialization
var Element = function ( id, x, y, z, ry ) {

				var div = document.createElement( 'div' );
				div.style.width = '480px';
				div.style.height = '360px';
				div.style.backgroundColor = '#000';

				var iframe = document.createElement( 'iframe' );
				iframe.style.width = '480px';
				iframe.style.height = '360px';
				iframe.style.border = '0px';
				iframe.src = [ 'http://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
				div.appendChild( iframe );

				var object = new THREE.CSS3DObject( div );
				object.position.set( x, y, z );
				object.rotation.y = ry;

				return object;

};
//3D Web content initialization


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

    // scene
    scene = new THREE.Scene();

    // renderer
    renderer = new THREE.WebGLRenderer({canvas: canvas3D} );
    renderer.setSize( WIDTH,LENGTH );
    renderer.setClearColor( 0xF2F2F2, 1);

    // CSS3D Renderer
    css3d_renderer = new THREE.CSS3DRenderer( {canvas: canvas3D} );
		css3d_renderer.setSize( window.innerWidth, window.innerHeight);
		css3d_renderer.domElement.style.position = 'absolute';
		css3d_renderer.domElement.style.top = 0;
    canvas3D.appendChild( css3d_renderer.domElement );
    // CSS3D Renderer




    // camera
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 5000 );
    camera.position.set(500, 350, 750);

    scene.add( camera ); // required, because we are adding a light as a child of the camera

    // var cube = new THREE.Mesh( new THREE.CubeGeometry(1,1,1), new THREE.MeshNormalMaterial() );
    // scene.add(cube);

    //Add annotation sphere
    scene.add( Sphere );
    Sphere.visible = false;

    //3D Web content
    group = new THREE.Group();
		group.add( new Element( 'njCDZWTI-xg', 0, 0, 240, 0 ) );
		group.add( new Element( 'HDh4uK9PvJU', 240, 0, 0, Math.PI / 2 ) );
		group.add( new Element( 'OX9I1KyNa8M', 0, 0, - 240, Math.PI ) );
		group.add( new Element( 'nhORZ6Ep_jE', - 240, 0, 0, - Math.PI / 2 ) );
		scene.add( group );
    console.log('added group')
    console.log(group);

    var blocker = document.getElementById( 'blocker' );
		blocker.style.display = 'none';

		document.addEventListener( 'mousedown', function () { blocker.style.display = ''; } );
		document.addEventListener( 'mouseup', function () { blocker.style.display = 'none'; } );
    //3D Web content



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

    // TODO Remove dead code block
    //Loading a .stl file
    //var loader = new THREE.STLLoader();

    //loader.load( '../models/kaplan.STL', function ( geometry ) {

    //    var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
    //    mesh = new THREE.Mesh( geometry, material );
    //    stl_1 = mesh.clone();
    //    scene.add( stl_1 );

    //   }
    //  );

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

    // TODO: Remove dead code block
//      var manager = new THREE.LoadingManager();
//      // model
//				var loader = new THREE.OBJLoader( manager );
//				loader.load( '../models/Trott_life_tentacules_with_colors_smooth_E_texture.obj', function ( object ) {
//
//          object.traverse( function ( child ) {
//						if ( child instanceof THREE.Mesh ) {
//							child.material.map = texture;
//						}
//					} );
//					object.position.y = - 95;
//					scene.add( object );
//				}, onProgress, onError );

        //Load JSON 3D object
        loadJSON();


        //Code for Raycaster

        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );


        controls = new THREE.TrackballControls( camera, canvas3D );
      	controls.minDistance = 20;
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

        window.addEventListener("keydown", AkeyDown, false);

        window.addEventListener( 'mouseup', function() {
          checkIntersection();
          // if ( ! moved ){
          //   FreezeSphere(CurrSphereData[0], CurrSphereData[1]);
          // }
        });
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

          console.log('This is mouse x real '+event.clientX);
          console.log('This is mouse y real '+event.clientY);

          mouse.x = ( x / window.innerWidth ) * 2 - 1;
          mouse.y = - ( y / window.innerHeight ) * 2 + 1;


          console.log('This is mouse x relative '+mouse.x);
          console.log('This is mouse y relative '+mouse.y);
          checkIntersection(mouse.y);
        }

        function checkIntersection() {
          // if ( ! LeePerryMesh ) return;
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
            CurrSphereData[0] = camlookatpoint;
            CurrSphereData[1] = camposalongnormal;
            if(InEditMode == true){
              Sphere.position.copy(camlookatpoint);
              Sphere.visible = true;
              // if(AkeyIsDown==true){
              //   console.log("CAAAALLLLING FREEZZZZZEEEEE");
                // FreezeSphere(camlookatpoint, camposalongnormal);
              // }
            }
            else{
              Sphere.visible= false;
            }

          }
          else {
            intersection.intersects = false;
            Sphere.visible = false;
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
    else if(keyCode ==39) {
      camera.lookAt(camlookat_start);
      camera.position.x = camposition_start.x;
      camera.position.x = camposition_start.y;
      camera.position.x = camposition_start.z;
      console.log('Reset camera');
    }

    else if(keyCode ==38) {
      console.log("keycode 38 pressed up arrow, camera_gui= ", camcounter_gui);
      console.log("AnnotCamLookatPts[camcounter_gui] =" , AnnotCamLookatPts[camcounter_gui]);
      console.log("  camera.position.x=AnnotCamPos[camcounter_gui];",   AnnotCamPos[camcounter_gui]);
      camera.position.x=AnnotCamPos[camcounter_gui].x;
      camera.position.y=AnnotCamPos[camcounter_gui].y;
      camera.position.z=AnnotCamPos[camcounter_gui].z;

      console.log("camera.up=",camera.up);
      // camera.lookAt(AnnotCamLookatPts[camcounter_gui]);
      controls.target=AnnotCamLookatPts[camcounter_gui];
      camera.up = new THREE.Vector3(0,1,0);


      // cameraTarget.position.x=AnnotCamLookatPts[camcounter_gui].x;
      // cameraTarget.position.y=AnnotCamLookatPts[camcounter_gui].y;
      // cameraTarget.position.z=AnnotCamLookatPts[camcounter_gui].z;

    }
    // else {
    // console.log("Oh no you didn't.");
    // }
}

//Same function as leftArrowKeyDown, modified to satisfy datGUI with no error handling
function ChangeCameraView() {

    console.log("Changed Camera View");
    console.log("Group.position = ",group.position);
    // console.log(camlookatpoints[camcounter]);
    console.log(campositions[camcounter]);
    // camera.lookAt(camlookatpoints[camcounter]);
    // controls.target(camlookatpoints[camcounter]);
    camera.position.x=campositions[camcounter].x;
    camera.position.y=campositions[camcounter].y;
    camera.position.z=campositions[camcounter].z;
    console.log('cam counter');
    console.log(camcounter);
  //  controls.target = camlookatpoints[camcounter];




    if (camcounter != numOfAnnotations -1) {
      camcounter+= 1;
    }
    else {
      camcounter = 0;
    }
    if(annotcounter != 0){
      var element = document.getElementById("newdiv");
      element.parentNode.removeChild(element);
      console.log('remove');
    }
    var mydiv = document.getElementById('mydiv');
    console.log(mydiv);
    var newdiv = document.createElement("div");
    //var tooltip = '<div class="tooltip"><p>This is a tooltip. It is typically used to explain something to a user without taking up space on the page.</p></div>'
      newdiv.innerHTML = "<p>This is a tooltip. It is typically used to explain something to a user without taking up space on the page.</p>"
      newdiv.setAttribute("class", "bubble");
      newdiv.setAttribute("id", "newdiv");
      mydiv.appendChild(newdiv);
      console.log('Im fine');

      //Change annotation
      var color = window.getComputedStyle(
        document.querySelector('.bubble'), ':after'
      ).getPropertyValue('left');
      console.log(color);
      color = "30px";

      console.log(color);

      console.log(annotcounter);

      var list = document.getElementsByClassName("bubble")[0];
      list.style.top = "10px";
      list.style.left = "1px";
        annotcounter+= 1;

      //ChangeAnnotation


}

//Second part of leftArrowKeyDown function to reset camera, but satisfying datGUI    else if (keyCode ==39) {
function ResetCamera() {

      camera.lookAt(camlookat_start);
      camera.position.x = camposition_start.x;
      camera.position.x = camposition_start.y;
      camera.position.x = camposition_start.z;
      console.log('Reset camera');
}

function AkeyDown(event){
  AkeyIsDown = true;
  var keyCode = event.keyCode;
  console.log(keyCode);
  if(keyCode==65){
    AkeyIsDown = true;
    console.log("AkeyDownCheckIntersection", AkeyIsDown);
    FreezeSphere(CurrSphereData[0], CurrSphereData[1]);

    console.log("Freeze Sphere fctn camcounter = ", camcounter);
  }
  //Press S if A key has been pressed
  //TODO:This elseif statement should be a SaveView function called if in EditMode and New View fucntion was called
    //  Save View should be:
    //Create NewView then Select New View to edit it
  else if (keyCode==83 && AkeyIsDown==true){


    console.log("INSIDE 83--------S Key Down");
    console.log("camcounter at CamPosEdit", camcounter);
    var CurrCamPos = new THREE.Vector3();
    // console.log("camera.position = ", camera.position)
    CurrCamPos.set(camera.position.x, camera.position.y, camera.position.z);
    console.log("CurrCamPos = ", CurrCamPos);
    AnnotCamPos.push(CurrCamPos);
    cameraGUI.Annot[camcounter] = AnnotCamPos[camcounter].x;
    ViewMenu.add(cameraGUI.Annot, camcounter, cameraGUI.Annot[camcounter]).listen();
    for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
      if(i!=camcounter){
        document.getElementById("tooltip"+i).style.visibility='hidden';
      }
    }

    cameraGUI.Tips[camcounter] = 'Tip'+camcounter;
    ViewMenu.add(cameraGUI.Tips, camcounter, cameraGUI.Tips[camcounter]).onChange(function(newValue){
      var Tips_array_current_index = this.property;
      console.log('-------Previous tooltip text = ', Tips_array_current_index);
      tooltiptext[Tips_array_current_index] = newValue;
      console.log('-------New tooltip text ', tooltiptext[Tips_array_current_index]);
      console.log('-------On Change TOOLTIP_ID ', "tooltip"+Tips_array_current_index );
      // for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
      //   if(i!=tour_counter){
      //     document.getElementById("tooltip"+i).style.visibility='hidden';
      //   }
      // }
      ChangeToolTipText(tooltiptext[Tips_array_current_index], "tooltip"+Tips_array_current_index);

    });

    CreateToolTip(tooltiptext[camcounter], camcounter);
    // ViewMenu.add(cameraGUI, 'annotcampos').listen();
    camcounter += 1;
    console.log("AnnotCamPos=  ", AnnotCamPos[camcounter -1]);

  }
  console.log("AkeyIsDOOOOOOWWWNN", AkeyIsDown);

}

function CreateToolTip(tooltiptext, camcounter){
  //Function to remove a div
  // if(annotcounter != 0){
  //   var element = document.getElementById("newdiv");
  //   element.parentNode.removeChild(element);
  //   console.log('remove');
  // }
  var mydiv = document.getElementById('mydiv');
  console.log(mydiv);
  var newdiv = document.createElement("div");

  pTagArray[0] = "<p>";
  pTagArray[1] = tooltiptext;
  pTagArray[2] = "</p>";
  var newPTag = pTagArray.join("");

  newdiv.innerHTML = newPTag;
  newdiv.setAttribute("class", "bubble");
  var div_id = "tooltip"+camcounter;
  newdiv.setAttribute("id", div_id);
  mydiv.appendChild(newdiv);
  console.log('Im fine');

  //Change annotation
  var color = window.getComputedStyle(
    document.querySelector('.bubble'), ':after'
  ).getPropertyValue('left');
  console.log(color);
  color = "30px";

  console.log(color);

  console.log(annotcounter);

  var list = document.getElementsByClassName("bubble")[0];
  list.style.top = "10px";
  list.style.left = "1px";
  annotcounter+= 1;

}

function ChangeToolTipText(tooltiptext, tooltip_id){

  pTagArray[0] = "<p>";
  pTagArray[1] = tooltiptext;
  pTagArray[2] = "</p>";
  var newPTag = pTagArray.join("");

  var selected_div = document.getElementById(tooltip_id);
  console.log('----Selected DIV------', selected_div);
  selected_div.innerHTML = newPTag;
}

function FreezeSphere(camlookatpoint, camposalongnormal) {



  console.log('FreezingSphere');
  var dummySphereGeo = new THREE.SphereGeometry( 5, 32, 32 );
  var dummyMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var dummySphere = new THREE.Mesh( dummySphereGeo, dummyMaterial );
  dummySphere.position.copy(camlookatpoint);

  var dummycamposnormal = new THREE.Vector3();
  dummycamposnormal.copy(camposalongnormal);
  scene.add(dummySphere);

  AnnotSpheres.push(dummySphere);
  // AnnotCamPos.push(dummycamposnormal);
  AnnotCamLookatPts.push(dummySphere.position);
  // console.log("AnnotCamPos = ", AnnotCamPos[camcounter]);
  // camera.lookAt(AnnotCamLookatPts[camcounter]);

  console.log("camera.up=",camera.up);
  controls.target=AnnotCamLookatPts[camcounter];
  camera.up = new THREE.Vector3(0,1,0);

  // camera.position.x=AnnotCamPos[camcounter].x;
  // camera.position.y=AnnotCamPos[camcounter].y;
  // camera.position.z=AnnotCamPos[camcounter].z;
  camera.position.x=dummycamposnormal.x;
  camera.position.y=dummycamposnormal.y;
  camera.position.z=dummycamposnormal.z;

  console.log("CurrentCamPos object", camera.position.x);



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


var playing_tour = true;
function PlayTour(){

  if(playing_tour==true){
    tour_counter=0;
    camera.position.x=AnnotCamPos[tour_counter].x;
    camera.position.y=AnnotCamPos[tour_counter].y;
    camera.position.z=AnnotCamPos[tour_counter].z;

    console.log("camera.up=",camera.up);
    // camera.lookAt(AnnotCamLookatPts[camcounter_gui]);
    controls.target=AnnotCamLookatPts[tour_counter];
    camera.up = new THREE.Vector3(0,1,0);

    datGUI.add(cameraGUI, 'nextview');
    datGUI.add(cameraGUI, 'previousview');

    playing_tour=false;
  }



}

function SelectViewFromIndex(view_index){

  camera.position.x=AnnotCamPos[view_index].x;
  camera.position.y=AnnotCamPos[view_index].y;
  camera.position.z=AnnotCamPos[view_index].z;
  controls.target=AnnotCamLookatPts[view_index];
  camera.up = new THREE.Vector3(0,1,0);
  for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
    if(i!=tour_counter){
      document.getElementById("tooltip"+i).style.visibility='hidden';
    }
    else{
      document.getElementById("tooltip"+i).style.visibility='visible';
    }
  }
}

//TODO:Should be a variation of SelectView function
  //Should just slect next view in the Queue
function NextView(){
  console.log('----------NEXT VIEW------------');
  tour_counter+=1;
  if(tour_counter>AnnotCamPos.length-1){ tour_counter=AnnotCamPos.length -1; }
  camera.position.x=AnnotCamPos[tour_counter].x;
  camera.position.y=AnnotCamPos[tour_counter].y;
  camera.position.z=AnnotCamPos[tour_counter].z;

  console.log("camera.up=",camera.up);
  // camera.lookAt(AnnotCamLookatPts[camcounter_gui]);
  controls.target=AnnotCamLookatPts[tour_counter];
  camera.up = new THREE.Vector3(0,1,0);
  console.log('------TOUR COUNTER---- =', tour_counter);
  for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
    if(i!=tour_counter){
      document.getElementById("tooltip"+i).style.visibility='hidden';
    }
    else{
      document.getElementById("tooltip"+i).style.visibility='visible';
    }
  }


}

function PreviousView(){

  tour_counter-=1;
  if (tour_counter<0){ tour_counter=0; }
  camera.position.x=AnnotCamPos[tour_counter].x;
  camera.position.y=AnnotCamPos[tour_counter].y;
  camera.position.z=AnnotCamPos[tour_counter].z;

  console.log("camera.up=",camera.up);
  // camera.lookAt(AnnotCamLookatPts[camcounter_gui]);
  controls.target=AnnotCamLookatPts[tour_counter];
  camera.up = new THREE.Vector3(0,1,0);
  console.log('------TOUR COUNTER---- =', tour_counter);
  for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
    if(i!=tour_counter){
      document.getElementById("tooltip"+i).style.visibility='hidden';
    }
    else{
      document.getElementById("tooltip"+i).style.visibility='visible';
    }
  }


}
//TODO: Make EraseTour function and EditSlectedView function

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

function ChangeAnnotOrder(){
  console.log("-----Before Move AnnotCamPos =",AnnotCamPos[0]);
  console.log("-----Before Move AnnotCamPos =",AnnotCamPos[1]);
  AnnotCamPos.move(0, 1);
  AnnotCamLookatPts.move(0,1);
  console.log("-----After Move AnnotCamPos =",AnnotCamPos[0]);
  console.log("-----After Move AnnotCamPos =",AnnotCamPos[1]);

}


function loadLeePerrySmith( callback ) {
  var loader = new THREE.JSONLoader();
  loader.load( '../models/Homo_Erectus/Low.js', function( geometry ) {
    var material = new THREE.MeshPhongMaterial( {
      specular: 0x111111,
      map: textureLoader.load( '../models/Homo_Erectus/ALBEDO1k.jpg' ),
      specularMap: textureLoader.load( '../models/Homo_Erectus/SPEC1K.jpg' ),
      normalMap: textureLoader.load( '../models/Homo_Erectus/NORMAL1K.jpg' ),
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

//JSON Loader
function loadJSON( callback ) {
  var loader = new THREE.JSONLoader();
  loader.load( object_to_load_obj_path, function( geometry ) {
    var material = new THREE.MeshPhongMaterial( {
      specular: 0x111111,
      map: textureLoader.load( object_to_load_colormap_path ),
      specularMap: textureLoader.load( object_to_load_specmap_path ),
      normalMap: textureLoader.load( object_to_load_normalmap_path),
      normalScale: new THREE.Vector2( 0.75, 0.75 ),
      shininess: 25
    } );
    LeePerryMesh = new THREE.Mesh( geometry, material );
    scene.add( LeePerryMesh );
    LeePerryMesh.scale.set( 3, 3, 3 );
    //scene.add( new THREE.FaceNormalsHelper( mesh, 1 ) );
    //scene.add( new THREE.VertexNormalsHelper( mesh, 1 ) );
    console.log('Loaded Perry Smith')
  } );
}
//JSON Loader

function onWindowResize() {


      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      //renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    controls.update();
    render();

}

function render() {

    // camera.lookAt(cameraTarget.position);
    renderer.render( scene, camera );
  // css3d_renderer.render ( scene, camera);

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
