function Button(text, delegate, x, y, width, height, background, foreground, border)
{
	this.text = text || "";
	this.delegate = delegate || {};
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	this.background = background || 'FFF';
	this.foreground = foreground || '000';
	this.border = border || '000';
	var STATES = Object.freeze(
	{
		IDLE: 0,
		HOVER: 1,
		PRESSED: 2
	});
	this.state = STATES.IDLE;
	var msSinceClick = 0;
	var msSinceHover = 0;
	this.draw = function(context)
	{
		context.save();
		context.fillStyle = this.background;
		context.shadowColor = 'rgba(0,0,0,0.25)';
		context.shadowOffsetX = 12;
		context.shadowOffsetY = 12;
		context.shadowBlur = 16;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.restore();
		context.save();
		context.strokeStyle = this.border;
		context.strokeRect(this.x, this.y, this.width, this.height);
		context.restore();

		context.save();
		context.fillStyle = this.foreground;
		context.textAlign = "center";
		context.font = "48pt Open Sans Condensed";
		context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 24);
		context.restore();
	};

	this.click = function()
	{
		if (delegate)
		{
			delegate();
		}
	}

	this.mouseMoved = function(mouseX, mouseY)
	{
		if (this.hitTest(mouseX, mouseY))
		{
			//mouse is over button
			this.state = STATES.HOVER;
			msSinceHover = 0;
		}
		else
		{
			this.state = STATES.IDLE;
		}
	}

	this.hitTest = function(mouseX, mouseY)
	{
		return (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height);
	}
	this.update = function(deltaTime)
	{
		//Put animations here for hovering, etc.
		if (this.state != STATES.PRESSED && msSinceClick < 100)
		{
			msSinceClick += deltaTime;
		}
		if (this.state == STATES.IDLE && msSinceHover < 100)
		{
			msSinceHover += deltaTime;
		}
	}
}