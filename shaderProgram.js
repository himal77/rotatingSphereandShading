//vertex shader
var vertexShaderText=[
	'precision mediump float;',
	'attribute vec3 aVertexPosition;',
	'attribute vec3 aVertexNormal;',

	'uniform mat4 uWorldMatrix;',
	'uniform mat4 uViewMatrix;',
	'uniform mat4 uProjectionMatrix;',

	'uniform vec3 uLightPosition;',
	'uniform vec3 uCameraPosition;',
	'uniform mat4 uLightMatrix;',

	'uniform float uShadingSelect;',

	'varying vec3 vVertexPosition;',
	'varying vec3 vVertexNormal;',
	'varying vec4 vColor;',


	'void main(){',

		//to select the shading type if 1 and 2 is selected then phong shading and illumunation is used
		'if(uShadingSelect == 1.0 || uShadingSelect == 2.0){',
			//making normal and vertex w.r.t world
			'vVertexNormal = vec3(uWorldMatrix * vec4(aVertexNormal, 1.0));',
			'vVertexPosition = vec3(uWorldMatrix * vec4(aVertexPosition, 1.0));',

			'gl_Position =  uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);',
		
		'}else{',
				//normal and vertex w.r.t world and light in world when rotateded
				'vec3 nVertexNormal = normalize(vec3(uWorldMatrix * vec4(aVertexNormal, 1.0)));',
				'vec3 wVertexPosition = vec3(uWorldMatrix * vec4(aVertexPosition, 1.0));',
				'vec3 wLightPosition = vec3(uLightMatrix * vec4(uLightPosition, 1));',

				//normalizing the light to vertex and vertex to eye/camera where we are looking from
				'vec3 nLightToVertex = normalize(wVertexPosition - wLightPosition);',
				'vec3 nCameraToVertex = normalize(wVertexPosition - uCameraPosition);',

				//calculating intensity of light in each vertex
				'float lightIntensity = dot(-nVertexNormal, nLightToVertex);',
				'float specularIntensity = 0.0;',

				'vec3 diffuseColor = vec3(0.07, 0.12, 0.83);',
				
				//if light is there the giving it specular if selected specular of gouraud specular
				'if(uShadingSelect == 3.0){',
					'if(lightIntensity > 0.0){',
						'vec3 nReflectedRay = normalize(reflect(nLightToVertex, nVertexNormal));',
						'specularIntensity = pow(dot(nReflectedRay, nCameraToVertex), 300.0);',
					'}',

					'vec3 specularColor = vec3(0.80, 0.81, 0.85);',
					'vColor = vec4(diffuseColor * lightIntensity + specularColor * specularIntensity, 1.0);',
				
				'}else{',
				//only gouraud diffuse
					'vColor = vec4(diffuseColor * lightIntensity, 1.0);',
				'}',

				'gl_Position =  uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);',
		'}',
'}'
].join('\n');

//fragment shader
var fragmentShaderText = [
'precision mediump float;',

'varying vec3 vVertexPosition;',
'varying vec3 vVertexNormal;',
'varying vec4 vColor;',

'uniform vec3 uLightPosition;',
'uniform vec3 uCameraPosition;',
'uniform mat4 uLightMatrix;',

'uniform float uShadingSelect;',

'void main(){',	
			
			//normalizing normals value taken from vertex shader, when rotating light matrix is use for light transfromation
			'vec3 nVertexNormal = normalize(vVertexNormal);',
			'vec3 wLightPosition = vec3(uLightMatrix * vec4(uLightPosition, 1));',

			//normalizing light to vertex and vertex to eye/camera
			'vec3 nLightToVertex = normalize(vVertexPosition - wLightPosition);',
			'vec3 nCameraToVertex = normalize(vVertexPosition - uCameraPosition);',

			//if light falls on surface, then calculating how much
			'float lightIntensity = dot(-nLightToVertex, nVertexNormal);',
			'float specularIntensity = 0.0;',

			'vec3 diffuseColor = vec3(0.07, 0.12, 0.83);',

			//if specular is selected calculating specular for that model
			'if(uShadingSelect == 1.0){',					
				
				'if(lightIntensity > 0.0){',
					'vec3 nReflectedRay = normalize(reflect(-nLightToVertex, nVertexNormal));',
					'specularIntensity = pow(dot(nReflectedRay, nCameraToVertex), 300.0);',
				'}',

				
				'vec3 specularColor = vec3(0.80, 0.81, 0.85);',
				'gl_FragColor = vec4(diffuseColor * lightIntensity + specularColor * specularIntensity, 1.0);',
			
			'}else if(uShadingSelect == 2.0){',
				'gl_FragColor = vec4(diffuseColor * lightIntensity,1.0);',
			
			'}else{',
				'gl_FragColor = vColor;',
			'}',
	'}'

].join('\n');

//keys values
var scalex = 1, scaleX = 1, scaley = 1, scaleY = 1, scalez = 1, scaleZ = 1;
var wRotCWx = 0, sRotACWx = 0, eRotCWy = 0, qRotACWy = 0, dRotCWz = 0, aRotACWz = 0;
var transLeft = 0, transRight = 0, transUp = 0, transDown = 0, transForward = 0, transBackward = 0;
var capslockKey = false;
var shiftKey = false;
var objectSelection = -1;
var keySelection = -1;
var cameraKey = false;
var worldRotation = false;
var lightButton = false;
var selectShading = 1;


var numberOfCube = 9;
var localMatrixOfEachCube = new Array(numberOfCube);
var gl;

//program starts here
var start = function(){

	console.log("WebGL Started");

	var canvas = document.getElementById('HCanvas');
	gl = canvas.getContext('webgl');

	if(!gl){
		alert("WebGL not supported!");
		return;
	}
	
	//************* CREATE SHADER COMPILE AND LINK IN PROGRAM ************//

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.log("vertexShader compiled error" + gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);

	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.log('fragmentShader compile error' + gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
				console.log('Error linking program' + gl.getProgramInfoLog(program));
		}
	
	gl.validateProgram(program);
		if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
			console.log('Error validating program' + gl.getProgramInfoLog(program));
		}

	//******************* linking and compileing program finish ******************************//
	
	//using program to set uniform value down
	gl.useProgram(program);
	
	var unifromProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
	var uniformViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
	var uniformLightPosition = gl.getUniformLocation(program, 'uLightPosition');
	var uniformCameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
	var uniformLightMatrix = gl.getUniformLocation(program, 'uLightMatrix');

	var uniformSelectLocation = gl.getUniformLocation(program, 'uShadingSelect');

	var uniMatView = glMatrix.mat4.create();
	var uniMatProjection = glMatrix.mat4.create();

	var cameraPosition = [50, 100, 150];
	var lightPosition = [0, 10, 0];

	
	gl.uniform3fv(uniformLightPosition, lightPosition);
	gl.uniform3fv(uniformCameraPosition, cameraPosition);


	glMatrix.mat4.lookAt(uniMatView, cameraPosition, [0, 0, 0], [0, 2, 0]);    //view matrix
	gl.uniformMatrix4fv(uniformViewMatrix, gl.false, uniMatView);

	glMatrix.mat4.perspective(uniMatProjection, glMatrix.glMatrix.toRadian(40), canvas.width / canvas.height, 0.1, 500.0); //projection matrix
	gl.uniformMatrix4fv(unifromProjectionMatrix, gl.false, uniMatProjection);

	//***************Main Render Loop**************//

	gl.clear(gl.COLOUR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//gl.clearColor(0.0, 0.0, 0.0, 1.0);	

	for(var i = 0; i < numberOfCube; i++){
		localMatrixOfEachCube[i] = glMatrix.mat4.create();
		localMatrixOfEachCube[i] = translateEachCube(localMatrixOfEachCube[i], i);
	}

	var lightPosMatrix = glMatrix.mat4.create();

	var loop = function(){
		//key listener for up and down keys and function are define in intractionWithKey.js
		window.addEventListener("keydown", checkDownKey, false);
		window.addEventListener("keyup", checkUpKey, false);

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		gl.uniform1f(uniformSelectLocation, selectShading);

		//movement of camera
		camera(uniformViewMatrix);
		if(lightButton == false){
			globalCoordinate(gl, program); //transformation wrt world coordinate system
		}

		//using light position and matrix when transformation is made
		gl.uniformMatrix4fv(uniformLightMatrix, false ,lightPosMatrix);
		if(lightButton == true){
			lightPosition = glMatrix.vec3.add(lightPosition, lightPosition, [transLeft * 2, transUp * 2, transForward * 2]);
			lightPosition = glMatrix.vec3.add(lightPosition, lightPosition, [transRight * 2, transDown * 2, transBackward * 2]);
			rotationWorldAndLight(lightPosMatrix);
			gl.uniform3fv(uniformLightPosition, lightPosition);

		}
		//drawing cube
		for(i = 0; i < 9; i++){	
			drawSphere(gl, program, localMatrixOfEachCube[i], i);	
		}

		requestAnimationFrame(loop);	
	}
	loop();
	
};	





