function Button(text, delegate, x, y, width, height, background, foreground, border)
{
	this.text = text || "";
	this.delegate = delegate || {};
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	var centerX = this.x + this.width / 2;
	var centerY = this.y + this.height / 2;
	this.background = background || 'FFF';
	this.foreground = foreground || '000';
	this.border = border || '000';
	var STATES = Object.freeze(
	{
		IDLE: 0;
		HOVER: 1;
		PRESSED: 2
	});
	this.state = STATES.IDLE;
	var msSinceClick = 0;
	var msSinceHover = 0;
	this.draw = function()
	{
		context.save();
		context.fillStyle = background;
		context.shadowColor = 'rgba(0,0,0,0.25)';
		context.shadowOffsetX = 12;
		context.shadowOffsetY = 12;
		context.shadowBlur = 16;
		context.fillRect(centerX - width / 2, centerY - height / 2, width, height);
		context.restore();
		context.save();
		context.strokeStyle = buttonStroke;
		context.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
		context.restore();

		context.save();
		context.fillStyle = textFill;
		context.textAlign = "center";
		context.font = "48pt Open Sans Condensed";
		context.fillText(text, centerX, centerY + 24);
		context.restore();
	};

	this.click = function()
	{
		if (delegate)
		{
			delegate();
		}
	}

	function hitTest(mouse)
	{
		return (mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this.y && mouse.y <= this.y + this.height);
	}
	this.update = function(deltaTime)
	{
		//Put animations here for hovering, etc.
		if (this.state != STATES.PRESSED && msSinceClick > 0)
		{
			msSinceClick = Math.max(0, msSinceClick - deltaTime);
		}
		if (this.state == STATES.IDLE && msSinceHover > 0)
		{
			msSinceHover = Math.max(0, msSinceHover - deltaTime);
		}
	}
}