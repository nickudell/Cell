function MainMenu(controls,title)
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
	this.background = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	this.background.addColorStop(0, '#000055');
	this.background.addColorStop(1, '#0055FF');

	this.loop = function()
	{
		Clear(that.background);

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

	this.clicked = function(event)
	{
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

	this.mouseMoved = function(event)
	{
		var that = event.data;
		that._mousePos = getRelativePosition(event.pageX,event.pageY);
	};

	this.registerEvents("#game");
};

MainMenu.prototype.stop = function()
{
	clearTimeout(this._loopTimeout);
	this.deregisterEvents("#game");
};

MainMenu.prototype.draw = function()
{
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

MainMenu.prototype.registerEvents = function(target)
{
	var that = this;
	$(target).bind('click',this,this.clicked);
	$(target).bind('mousemove',this,this.mouseMoved);
}

MainMenu.prototype.deregisterEvents = function(target)
{
	$(target).unbind('click',this.clicked);
	$(target).unbind('mousemove',this.mouseMoved);
}

MainMenu.prototype.update = function(deltaTime)
{
	//do anim stuff
	this.controls.forEach(function(control)
	{
		control.update(deltaTime);
	});
}