var CONTROL_STATES = Object.freeze(
{
	IDLE: 0,
	HOVER: 1,
	PRESSED: 2
});

function Control(x, y, width, height, background, border, margin)
{
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	this.background = background || 'FFF';
	this.border = border || '000';
	this.margin = margin || 0;

	this.state = CONTROL_STATES.IDLE;
	this._msSinceClick = 0;
	this._msSinceHover = 0;
};

Control.prototype.mouseMoved = function(mouseX, mouseY)
{
	if (this.hitTest(mouseX, mouseY))
	{
		//mouse is over button
		this.state = CONTROL_STATES.HOVER;
		this_msSinceHover = 0;
	}
	else
	{
		this.state = CONTROL_STATES.IDLE;
	}
};

Control.prototype.update = function(deltaTime)
{
	//Put animations here for hovering, etc.
	if (this.state != CONTROL_STATES.PRESSED && this._msSinceClick < 100)
	{
		this._msSinceClick += deltaTime;
	}
	if (this.state == CONTROL_STATES.IDLE && this._msSinceHover < 100)
	{
		this._msSinceHover += deltaTime;
	}
};

Control.prototype.hitTest = function(mouseX, mouseY)
{
	return (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height);
};

//draw the box around the control
Control.prototype.draw = function(context)
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
};

function Label(text, font, x, y, width, height, background, foreground, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.text = text || "";
	this.foreground = foreground || '000';
	this.font = font || "24pt Arial";
};
Label.prototype = Object.create(Control.prototype);
Label.prototype.constructor = Label;
Label.prototype.draw = function(context)
{
	Control.prototype.draw.call(this, context);

	context.save();
	context.fillStyle = this.foreground;
	context.textAlign = "center";
	context.font = this.font;
	context.textBaseline = 'top';
	var measure = context.measureText2(this.text, this.width);
	context.wrapText(this.text, this.x + this.width / 2, this.y + (this.height / 2) - (measure.height / 2), this.width);
	context.restore();
};

function Button(text, font, delegate, x, y, width, height, background, foreground, border, margin)
{
	Label.call(this, text, font, x, y, width, height, background, foreground, border, margin);
	this.delegate = delegate || {};
}
Button.prototype = Object.create(Label.prototype);
Button.prototype.constructor = Button;

Button.prototype.click = function()
{
	if (this.delegate)
	{
		this.delegate();
	}
	return true;
};

function Stack(controls, x, y, width, height, background, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.controls = controls || [];
	this.arrange();
}
Stack.prototype = Object.create(Control.prototype);
Stack.prototype.constructor = Stack;

Stack.prototype.arrange = function()
{
	var that = this;
	var centerX = this.width / 2;
	var centerY = this.margin;

	//position controls
	this.controls.forEach(function(control)
	{
		control.x = centerX - control.width / 2;
		control.y = centerY - control.height / 2;
		centerY += control.height + control.margin;
	});
};
Stack.prototype.draw = function(context)
{
	//draw background
	Control.prototype.draw.call(this, context);
	controls.forEach(function(control)
	{
		control.draw(context);
	});
};
Stack.prototype.click = function(mouse)
{
	var handled = false;
	controls.forEach(function(control)
	{
		if (control.hitTest(mouse.x, mouse.y))
		{
			if (typeof control.click == 'function')
			{
				handled |= control.click(mouse);
			}
		}
	});
	if (handled)
	{
		e.stopPropagation();
	}
};

function ScrollStack(controls, x, y, width, height, background, border, margin)
{
	Stack.call(this, controls, x, y, width, height, background, border, margin);

}