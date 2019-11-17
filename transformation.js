//use to translate local coordinate system

function translationLocal(matrix){
	glMatrix.mat4.rotateX(matrix, matrix, wRotCWx);
	glMatrix.mat4.rotateX(matrix, matrix, sRotACWx);
	glMatrix.mat4.rotateY(matrix, matrix, eRotCWy);
	glMatrix.mat4.rotateY(matrix, matrix, qRotACWy);
	glMatrix.mat4.rotateZ(matrix, matrix, dRotCWz);
 	glMatrix.mat4.rotateZ(matrix, matrix, aRotACWz);
	glMatrix.mat4.translate(matrix, matrix, [transLeft, transUp, transForward]);
	glMatrix.mat4.translate(matrix, matrix, [transRight, transDown, transBackward]);
	glMatrix.mat4.scale(matrix, matrix, [scalex, scaley, scalez]);
	glMatrix.mat4.scale(matrix, matrix, [scaleX, scaleY, scaleZ]);
	
	return matrix;
}


//use to rotate wrt world-coordinate system
function rotationWorldAndLight(matrix){
	glMatrix.mat4.rotateZ(matrix, matrix, dRotCWz);
	glMatrix.mat4.rotateZ(matrix, matrix, aRotACWz);
	glMatrix.mat4.rotateX(matrix, matrix, wRotCWx);
	glMatrix.mat4.rotateX(matrix, matrix, sRotACWx);
	glMatrix.mat4.rotateY(matrix, matrix, eRotCWy);
	glMatrix.mat4.rotateY(matrix, matrix, qRotACWy);
	
	return matrix;
}

//use to scale and translate wrt world-corrdinate system
function scaleTranslate(matrix){
	glMatrix.mat4.translate(matrix, matrix, [transLeft, transUp, transForward]);
	glMatrix.mat4.translate(matrix, matrix, [transRight, transDown, transBackward]);
	glMatrix.mat4.scale(matrix, matrix, [scalex, scaley, scalez]);
	glMatrix.mat4.scale(matrix, matrix, [scaleX, scaleY, scaleZ]);

	return matrix;
}


//this function move the camera when c is pressed and stops when again c is pressed
var positiveX = 0;
var negativeX = 0;
var uniMatView = glMatrix.mat4.create();
function camera(uniformViewMatrix){
	if(cameraKey == true){
			positiveX += 0.2;
			 if(positiveX < 20){
				glMatrix.mat4.lookAt(uniMatView, [0, 0, -15], [positiveX, 0, 0], [0, 1, 0]);
				gl.uniformMatrix4fv(uniformViewMatrix, gl.false, uniMatView);
				negativeX = positiveX;
			}else {
				glMatrix.mat4.lookAt(uniMatView, [0, 0, -15], [negativeX, 0, 0], [0, 1, 0]);
				gl.uniformMatrix4fv(uniformViewMatrix, gl.false, uniMatView);
				negativeX -= 0.2;
				if(negativeX <= -20){
					positiveX = negativeX;
				}
			}
		}else{
				glMatrix.mat4.lookAt(uniMatView, [0, 0, -15], [negativeX, 0, 0], [0, 1, 0]);
				gl.uniformMatrix4fv(uniformViewMatrix, gl.false, uniMatView);
		}
			
}

//this function will be used when user press 0 and the transformation should be wrt world coordinate
var worldLineCoordinateMatrix = glMatrix.mat4.create();	
var worldCoordinateMatrix = glMatrix.mat4.create();
function globalCoordinate(gl, program){
if(objectSelection == 48){
				var uniformWorldMatrix = gl.getUniformLocation(program, 'uWorldMatrix');
				gl.uniformMatrix4fv(uniformWorldMatrix, false, worldLineCoordinateMatrix);
				drawLine(gl, program, 0);
				gl.drawArrays(gl.LINES, 0, 6);
			if(worldRotation == true){
				worldCoordinateMatrix = rotationWorldAndLight(worldCoordinateMatrix);
				for(i = 0; i < 9; i++){
					glMatrix.mat4.multiply(localMatrixOfEachCube[i], worldCoordinateMatrix, localMatrixOfEachCube[i]);
				}
				worldCoordinateMatrix = glMatrix.mat4.create();
			}else{
				worldCoordinateMatrix = scaleTranslate(worldCoordinateMatrix);
				for(i = 0; i < 9; i++){
					glMatrix.mat4.multiply(localMatrixOfEachCube[i], worldCoordinateMatrix, localMatrixOfEachCube[i]);
				}
				worldCoordinateMatrix = glMatrix.mat4.create();
			}
		}
	}

//use just one time to show 9 cube differenty
function translateEachCube(matrix, i){
	if(i % 3 == 0){
		glMatrix.mat4.translate(matrix, matrix, [i, 1, 0]);
	}else if(i % 3 == 1){
		glMatrix.mat4.translate(matrix, matrix, [-i, 1, 0]);
	}else if(i % 3 == 2){
		glMatrix.mat4.translate(matrix, matrix, [-1, -i, 0]);
	}else{
		glMatrix.mat4.translate(matrix, matrix, [1, 1, 1]);
	}
	return matrix;
}
