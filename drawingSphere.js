
//function use to draw cube,
function drawSphere(gl, program, localMatrix, i){

	 //after pressing the button 0-9 this satatement use to display coordinate line as well 	
	if(objectSelection == 49 + i || objectSelection == 48){
				var uniformWorldMatrix = gl.getUniformLocation(program, 'uWorldMatrix');
				if(objectSelection != 48 && lightButton == false){ localMatrix = translationLocal(localMatrix);}
				gl.uniformMatrix4fv(uniformWorldMatrix, false, localMatrix);

				sphereVertices(gl, program);
				
			if(objectSelection == 49 + i){
				drawLine(gl, program);
				gl.drawArrays(gl.LINES, 0, 6);
			} 
		} else{
				var uniformWorldMatrix = gl.getUniformLocation(program, 'uWorldMatrix');
				gl.uniformMatrix4fv(uniformWorldMatrix, false, localMatrix);
			
				sphereVertices(gl, program);
			
				
		}
	}



//function to draw coordinate system in local as well as for global position
function drawLine(gl, program){
	var lineVertices = [
            0.0 ,0.0,0.0,  1.0, 0.0, 0.0, 
            0.0 ,0.0,5.0,  1.0, 0.0, 0.0,
            0.0 ,0.0,0.0,  0.0, 1.0, 0.0,
            0.0 ,5.0,0.0,  0.0, 1.0, 0.0,
            0.0 ,0.0,0.0,  0.0, 0.0, 1.0,
            5.0 ,0.0,0.0,  0.0, 0.0, 1.0
    ];

    //creating buffer, inserting value, use the same attribute to pass value for line as above

    var positionAttribLocation = gl.getAttribLocation(program, 'aVertexPosition');
	var normalAttribLocation = gl.getAttribLocation(program, 'aVertexNormal');

    var bufferAttribVertex = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferAttribVertex);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVertices), gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(	positionAttribLocation,	3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT,	3 * Float32Array.BYTES_PER_ELEMENT);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(normalAttribLocation);
}

function sphereVertices(gl, program){
	
	//Reduce the horizental line to see the effect of diffuse between phong and gouraud
	var r = 1.5;
	var horizentalLine = 10;
	var verticalLine = horizentalLine * 2;
	
	var vertex = [];
	var normal = [];

	var horizentalNum = 0;
	while(horizentalNum <= horizentalLine){
      var hSin = Math.sin(horizentalNum * Math.PI / horizentalLine);
      var hCos = Math.cos(horizentalNum * Math.PI / horizentalLine);
      var verticalNum = 0;
      while( verticalNum <= verticalLine){
        var vSin = Math.sin(verticalNum * 2 * Math.PI / verticalLine);
        var vCos = Math.cos(verticalNum * 2 * Math.PI / verticalLine);
        var x = vCos * hSin;
        var y = hCos;
        var z = vSin * hSin;

  		normal.push(x);
        vertex.push(x * r);
 		
 		normal.push(y);
        vertex.push(y * r);
        
        normal.push(z);
        vertex.push(z * r);
 
        verticalNum++;
      }
      horizentalNum++;
    }
     var index = new Uint16Array(getPlaneIndices(r, horizentalLine, verticalLine));

     var positionAttribLocation = gl.getAttribLocation(program, 'aVertexPosition');
     var normalAttribLocation = gl.getAttribLocation(program, 'aVertexNormal');

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(normalAttribLocation);
	
	var verticesBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	var indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

	gl.vertexAttribPointer(
		positionAttribLocation , //attribute location
		3,	//num of element per attribute
		gl.FLOAT, //type of element
		false, 
		0 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
		0 //offset from the begin of a single vertex of this attribute
	);

	var colorBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(
		normalAttribLocation , //attribute location
		3,	//num of element per attribute
		gl.FLOAT, //type of element
		false, 
		0 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
		0 //offset from the begin of a single vertex of this attribute
	);

	gl.drawElements(gl.TRIANGLES, index.length , gl.UNSIGNED_SHORT, 0);

}

function getPlaneIndices(r, horizentalLine, verticalLine){
	var index = [];

	var horizentalNum = 0;
	 while(horizentalNum < horizentalLine) {
	 	 var verticalNum = 0;
      while(verticalNum< verticalLine) {
        let f = (horizentalNum * (verticalLine + 1)) + verticalNum;
        let s = f + verticalLine + 1;
        index.push(f);
        index.push(s);
        index.push(f + 1);
        index.push(s);
        index.push(s + 1);
        index.push(f + 1);

        verticalNum++;
      }
      horizentalNum++;
    }
	return index;
}

