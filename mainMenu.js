function MainMenu(title, controls)
{
	this.titleHeight = 192;
	this.title = title || "";

	this.controls = controls || [];

	this._prevTime = Date.now();
	this._loopTimeout = null;

	this._mousePos = {
		x: 0,
		y: 0
	};

	var that = this;

	//create background gradient
	this.background = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	this.background.addColorStop(0, '005');
	this.background.addColorStop(1, '05F');

	this.loop = function()
	{
		Clear(that.background);

		//Update time difference
		var now = Date.now();
		var deltaTime = now - that._prevTime;
		that._prevTime = now;

		that.update(deltaTime);
		that.draw();

		that._loopTimeout = setTimeout(MainMenu.prototype.loop, 1000 / FPS);
	};

	var centerX = CANVAS_WIDTH / 2;
	var centerY = this.titleHeight + 96;

	//position controls
	this.controls.forEach(function(control)
	{
		control.x = centerX - control.width / 2;
		control.y = centerY - control.height / 2;
		centerY += control.height + control.margin;
	});

	this.clicked = function(e)
	{
		var handled = false;
		controls.forEach(function(control)
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
			e.stopPropagation();
		}
	};

	this.mouseMoved = function(e)
	{
		that._mousePos.x = e.offsetX;
		that._mousePos.y = e.offsetY;
	};

	this.registerEvents(canvas);

};

MainMenu.prototype.stop = function()
{
	clearTimeout(this._loopTimeout);
	this.deregisterEvents(canvas);
};

MainMenu.prototype.draw = function()
{
	//draw the title
	context.save();
	context.fillStyle = 'FFF';
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
	target.addEventListener('click', this.clicked, true);
	target.addEventListener('mousemove', this.mouseMoved, true);
}

MainMenu.prototype.deregisterEvents = function(target)
{
	target.removeEventListener('click', this.clicked, true);
	target.removeEventListener('mousemove', this.mouseMoved, true);
}

MainMenu.prototype.update = function(deltaTime)
{
	//do anim stuff
	this.controls.forEach(function(control)
	{
		control.update(deltaTime);
	});
}