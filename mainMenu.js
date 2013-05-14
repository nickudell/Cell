function MainMenu(title, controls)
{
	this.titleHeight = 192;
	this.title = title || "";

	this.controls = controls || [];

	var prevTime = Date.now();
	var loopTimeout;

	var grd;

	var mouse = {
		x: 0,
		y: 0
	};

	var that = this;

	this.loop = function()
	{
		Clear(grd);

		//Update time difference
		var now = Date.now();
		var deltaTime = now - prevTime;
		prevTime = now;

		that.update(deltaTime);
		that.draw();

		loopTimeout = setTimeout(that.loop, 1000 / FPS);
	};

	function clicked()
	{
		controls.forEach(function(control)
		{
			if (control.hitTest(mouse.x, mouse.y))
			{
				control.click(mouse);
			}
		});
	}

	this.draw = function()
	{
		//draw the title
		context.save();
		context.fillStyle = 'FFF';
		context.textAlign = "center";
		context.font = "78pt Open Sans Condensed";
		context.fillText(this.title, CANVAS_WIDTH / 2, 3 * this.titleHeight / 4);
		context.restore();

		//draw the controls
		controls.forEach(function(control)
		{
			control.draw(context);
		})
	}

	this.registerEvents = function(target)
	{
		target.addEventListener('click', clicked, true);
		target.addEventListener('mousemove', mouseMoved, true);
	}

	function mouseMoved(event)
	{
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
	};

	this.deregisterEvents = function(target)
	{
		target.removeEventListener('click', clicked, true);
		target.removeEventListener('mousemove', mouseMoved, true);
	}

	this.stop = function()
	{
		clearTimeout(loopTimeout);
		this.deregisterEvents(canvas);
	}

	this.init = function()
	{
		this.registerEvents(canvas);

		var centerX = CANVAS_WIDTH / 2;
		var centerY = this.titleHeight + 96;
		var controlWidth = 320;
		var controlHeight = 96;
		var controlMargin = 32;
		var controlFill = 'FFF'
		var textFill = '444';

		//position controls
		controls.forEach(function(control)
		{
			control.x = centerX - controlWidth / 2;
			control.y = centerY - controlHeight / 2;
			control.height = controlHeight;
			control.width = controlWidth;
			control.background = controlFill;
			control.foreground = textFill;
			centerY += controlHeight + controlMargin;
		});

		//create background gradient
		grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		grd.addColorStop(0, '005');
		grd.addColorStop(1, '05F');
	}

	this.update = function(deltaTime)
	{
		//do anim stuff
		controls.forEach(function(control)
		{
			control.update(deltaTime);
		});
	}

	this.init();

}