//All the keyboard intraction are in this class

function checkDownKey(key){
	var pressedKey = key.keyCode;
	if(pressedKey == 9){
		if(capslockKey == true){ capslockKey = false; } else { capslockKey = true;}
	}

	if(pressedKey == 16){
		shiftKey = true;
	}

	if(pressedKey == 67){
		if(cameraKey == true){
				cameraKey = false;
		}else{
			cameraKey = true;
		}
	}

	if(pressedKey <= 57 && pressedKey >= 48){
			objectSelection = pressedKey;
		}

		if(pressedKey >= 37 && pressedKey <= 40 || pressedKey >=65){
			downIntraction(pressedKey);
		}

	
	if(pressedKey == 76){
		if(lightButton == false){
			lightButton = true;

		}else{
			lightButton = false;
		}
	}

	if(pressedKey == 85){
		selectShading = 4;
	}else if(pressedKey == 73){
		selectShading = 3;
	}else if(pressedKey == 79){
		selectShading = 2;
	}else if(pressedKey == 80){
		selectShading = 1;
	}
		
}

function checkUpKey(key){
	var upKey = key.keyCode;
		if(upKey == 16){
			shiftKey = false;
		}

		if(upKey >= 37 && upKey <= 40 || upKey >=65){
			upIntraction(upKey);
		} 
		
}

function downIntraction(pressedKey){
	switch(pressedKey){
		case 87: wRotCWx = 0.1; worldRotation = true;
			break;
		case 83: sRotACWx = -0.1; worldRotation = true;
			break;	
		case 69: eRotCWy = 0.1; worldRotation = true;
			break;
		case 81: qRotACWy =- 0.1; worldRotation = true;
			break;
		case 68: dRotCWz = 0.1; worldRotation = true;
			break;
		case 65: aRotACWz = -0.1; worldRotation = true;
			break;

		case 88: if((shiftKey == true || capslockKey == true)) {
						scaleX = 1.1;
					}else{
						scalex = 0.9;
					}
			break;
		case 89: if(shiftKey == true || capslockKey == true) {
						scaleY = 1.1;
					}else{
						scaley = 0.9;
					}
			break;
		case 90: if(shiftKey == true || capslockKey == true) {
						scaleZ = 1.1;
					}else{
						scalez = 0.9;
					}
			break;

		case 37: transLeft = 0.1;
			break;
		case 39: transRight = -0.1;
			break;
		case 38: transUp = 0.1;
			break;
		case 40: transDown = -0.1;
			break;
		case 188: transForward = 0.1;
			break;
		case 190: transBackward = -0.1;
			break;

	}
}

function upIntraction(upKey){
	switch(upKey){
		case 87: wRotCWx = 0; worldRotation = false;
			break;
		case 83: sRotACWx = 0; worldRotation = false;
			break;	
		case 69: eRotCWy = 0; worldRotation = false;
			break;
		case 81: qRotACWy = 0; worldRotation = false;
			break;
		case 68: dRotCWz = 0; worldRotation = false;
			break;
		case 65: aRotACWz = 0; worldRotation = false;
			break;

		case 88: 
						scaleX = 1.0;	
						scalex = 1.0;	
			break;
		case 89: 
						scaleY = 1.0;
						scaley = 1.0;
					
			break;
		case 90: 
						scaleZ = 1.0;
						scalez = 1.0;
					
			break;

		case 37: transLeft = 0.0;
			break;
		case 39: transRight = 0.0;
			break;
		case 38: transUp = 0.0;
			break;
		case 40: transDown = 0.0;
			break;
		case 188: transForward = 0.0;
			break;
		case 190: transBackward = 0.0;
			break;

	}
}