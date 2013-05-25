function MainMenu(controls, title, background)
{
	this.titleHeight = 192;
	this.title = title || "";

	this.controls = controls || [];
	if (typeof this.controls.forEach == 'undefined')
	{
		this.controls = [this.controls];
	}

	this._prevTime = Date.now();
	this._loopTimeout = null;

	this._mousePos = {
		x: 0,
		y: 0
	};

	var that = this;

	//create background gradient
	this.background = background || 'black';

	this.loop = function()
	{

		//Update time difference
		var now = Date.now();
		var deltaTime = now - that._prevTime;
		that._prevTime = now;

		that.update(deltaTime);
		that.draw();

		that._loopTimeout = setTimeout(that.loop, 1000 / FPS);
	};

	var centerX = CANVAS_WIDTH / 2;
	var centerY = (this.titleHeight);

	//position controls
	this.controls.forEach(function(control)
	{
		control.x = centerX - control.width / 2;
		control.y = centerY;
		centerY += control.height + control.margin;
		//if we've moved a panel, rearrange it.
		if (typeof control.arrange != 'undefined')
		{
			control.arrange();
		}
	});

	this.registerEvents("#game");
};

MainMenu.prototype.stop = function()
{
	clearTimeout(this._loopTimeout);
	this.deregisterEvents("#game");
};

MainMenu.prototype.clicked = function(event)
{
	console.log("Tap fired");
	var handled = false;
	var that = event.data;
	that.controls.forEach(function(control)
	{
		if (control.hitTest(that._mousePos.x, that._mousePos.y))
		{
			if (typeof control.click == 'function')
			{
				handled |= control.click(that._mousePos);
			}
		}
	});
	if (handled)
	{
		event.stopPropagation();
	}
};

MainMenu.prototype.mouseMoved = function(event)
{
	var that = event.data;
	that._mousePos = getRelativePosition(event.pageX, event.pageY);
};

MainMenu.prototype.draw = function()
{
	helpr.clear(context, this.background, CANVAS_WIDTH, CANVAS_HEIGHT);
	//draw the title
	context.save();
	context.fillStyle = '#FFFFFF';
	context.textAlign = "center";
	context.font = "78pt Open Sans Condensed";
	context.fillText(this.title, CANVAS_WIDTH / 2, 3 * this.titleHeight / 4);
	context.restore();

	//draw the controls
	this.controls.forEach(function(control)
	{
		control.draw(context);
	})
}
MainMenu.prototype.touched = function(e)
{
	console.log("Touch fired");
	e.data._mousePos = getRelativePosition(e.gesture.center.pageX, e.gesture.center.pageY);
}

MainMenu.prototype.registerEvents = function(target)
{
	var that = this;
	//Workaround for the fact that hammer.js does not allow additional parameters
	this._funcClick = function(e)
	{
		e.data = that;
		that.clicked(e);
	};
	this._funcTouch = function(e)
	{
		e.data = that;
		that.touched(e)
	};

	//$(target).bind('click',this,this.clicked);
	$(target)
		.bind('mousemove', this, this.mouseMoved);
	var hammertime = $(target)
		.hammer();
	hammertime.on("tap", this._funcClick);
	hammertime.on("touch", this._funcTouch);
}

MainMenu.prototype.deregisterEvents = function(target)
{
	//$(target).unbind('click',this.clicked);
	$(target)
		.unbind('mousemove', this.mouseMoved);
	var hammertime = $(target)
		.hammer();
	hammertime.off("tap", this._funcClick);
	hammertime.off("touch", this._funcTouch);
}

MainMenu.prototype.update = function(deltaTime)
{
	//do anim stuff
	this.controls.forEach(function(control)
	{
		control.update(deltaTime);
	});
}