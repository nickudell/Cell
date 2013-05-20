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
	this.background = background || '#FFFFFF';
	this.border = border || '#000000';
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

function Label(text,font,textHeight,foreground,x, y, width, height, background, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.text = text || "";
	this.foreground = foreground || '#000000';
	this.font = font || "24pt Arial";
	this.textHeight = textHeight || 24;
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
	context.textBaseline = 'middle';
	this.metrics = context.measureText2(this.text, this.width,this.textHeight);
	var x = this.x + this.width / 2;
	var y = this.y + this.height / 2 - (this.metrics.height * (this.metrics.lines.length-1)) / 2;
	var that = this;
	this.metrics.lines.forEach(function(line)
	{
		context.fillText(line, x, y);
		y += that.metrics.height;
	});
	context.restore();
};

function Button(delegate, text,font,textHeight,foreground,x, y, width, height, background, border, margin)
{
	Label.call(this, text,font,textHeight,foreground,x, y, width, height, background, border, margin);
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

function Graphic(image, x, y, width, height, background, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.image = image || {};
}
Graphic.prototype = Object.create(Control.prototype);
Graphic.prototype.constructor = Graphic;
Graphic.prototype.draw = function(context)
{

	Control.prototype.draw.call(this, context);
	context.drawImage(this.image,
	this.x,
	this.y,
	this.width,
	this.height);
}

function Stack(controls, horizontal, x, y, width, height, background, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.horizontal = horizontal || false;
	this.controls = controls || [];
	this.arrange();
}
Stack.prototype = Object.create(Control.prototype);
Stack.prototype.constructor = Stack;
Stack.prototype.arrange = function()
{
	var that = this;
	//position controls
	if (this.horizontal)
	{
		var centerY = this.y + this.height / 2;
		var centerX = this.x + this.margin;
		this.controls.forEach(function(control)
		{
			control.x = centerX - control.width / 2;
			control.y = centerY - control.height / 2;
			centerX += control.width + control.margin;
		})
	}
	else
	{
		var centerX = this.x + this.width / 2;
		var centerY = this.y + this.margin;
		this.controls.forEach(function(control)
		{
			control.x = centerX - control.width / 2;
			control.y = centerY - control.height / 2;
			centerY += control.height + control.margin;
		});
	}
};
Stack.prototype.draw = function(context)
{
	//draw background
	Control.prototype.draw.call(this, context);
	this.controls.forEach(function(control)
	{
		control.draw(context);
	});
};
Stack.prototype.update = function(deltaTime)
{
	Control.prototype.update.call(this, deltaTime);
	this.controls.forEach(function(control)
	{
		control.update(deltaTime);
	});
}
Stack.prototype.click = function(mouse)
{
	var handled = false;
	this.controls.forEach(function(control)
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

function ScrollStack(controls, horizontal, speed, loop, startOffscreen, x, y, width, height, background, border, margin)
{
	Stack.call(this, controls, horizontal, x, y, width, height, background, border, margin);
	this.speed = speed || 0;
	this.loop = loop || false;
	this.startOffscreen = startOffscreen || false;
}
ScrollStack.prototype = Object.create(Stack.prototype);
ScrollStack.prototype.constructor = ScrollStack;
ScrollStack.prototype.arrange = function()
{
	//arrange using typical system
	Stack.prototype.arrange.call(this);
	if (this.startOffscreen)
	{
		var that = this;
		this.controls.forEach(function(control)
		{
			if (this.horizontal)
			{
				control.x += that.width;
			}
			else
			{
				control.y += that.height;
			}
		})
	}
}
ScrollStack.prototype.update = function(deltaTime)
{
	//move each control by the speed * deltaTime in pixels/millisecond
	var that = this;
	var furthest = 0; //the coordinate of the furthest point
	this.controls.forEach(function(control)
	{
		if (that.horizontal)
		{
			furthest = Math.max(furthest, control.x + control.width);
		}
		else
		{
			furthest = Math.max(furthest, control.y + control.height);
		}
	});
	this.controls.forEach(function(control)
	{
		if (that.horizontal)
		{
			control.x -= that.speed * deltaTime;
			if (control.x < that.x - control.width)
			{
				control.x += furthest + that.margin;
				furthest = control.x + control.width;
			}
		}
		else
		{
			control.y -= that.speed * deltaTime;
			if (control.y < that.y - control.height)
			{
				control.y = control.y - (that.y - control.height)+ furthest + control.margin;
				furthest = control.y + control.height;
			}
		}
	});
}
ScrollStack.prototype.draw = function(context)
{
	Control.prototype.draw.call(this,context);
	context.save();
	context.beginPath();
	context.moveTo(this.x, this.y);
	context.lineTo(this.x + this.width, this.y);
	context.lineTo(this.x + this.width, this.y + this.height);
	context.lineTo(this.x, this.y + this.height);
	context.closePath();
	context.clip();
	this.controls.forEach(function(control)
	{
		control.draw(context);
	});
	context.restore();
}