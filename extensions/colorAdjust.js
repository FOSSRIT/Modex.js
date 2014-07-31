var ColorAdjust = function(){
	var toReturn = {};



	//R, G, and B range from 0 to 255, Sprite is the sprite module you want to change.
	toReturn.multiplyFilter = function(r, g, b, Sprite)
	{
		//Only works on sprites.
		if(Sprite.type = "Sprite") {
			//Get relevant data
			var data = Sprite.getData();
			if(data.width != 0 && data.height != 0) {

				//Set up the virtual canvas
				var filter = document.createElement("canvas");
				filter.width = data.width;
				filter.height = data.height;
				var ctx = filter.getContext("2d");

				//Draw on the virtual canvas.
				ctx.drawImage(data.image, 0, 0);
				var imgData = ctx.getImageData(0, 0, filter.width, filter.height);
				var pix = imgData.data;


				//If there is a previous filter, remove it
				if(Sprite.lastFilter) {
					for (var i=0, n = pix.length; i < n; i += 4) {
						pix[i] = pix[i]*255/Sprite.lastFilter.r;
						pix[i+1] = pix[i+1]*255/Sprite.lastFilter.g;
						pix[i+2] = pix[i+2]*255/Sprite.lastFilter.b;
						//And alpha, which we can safely ignore.
					}
				}

				//And set the new data.
				Sprite.lastFilter = {"r":r, "g":g, "b":b };


				//And apply the new filter.
				for(i = 0, n = pix.length; i < n; i += 4) {
					pix[i] = r*pix[i]/255; //r
					pix[i+1] = g*pix[i+1]/255//g
					pix[i+2] = b*pix[i+2]/255//b
					//alpha (ingore this)
				}

				ctx.putImageData(imgData, 0, 0);

				//Convert back to image.
				var img = new Image();
				img.src = filter.toDataURL();
				img.onload = function(){
					Sprite.setImage(img, true);
				}
			}
		}
	}



	return toReturn;

}(); //Calls itself.