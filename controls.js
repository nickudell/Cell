/**
 * Enumerated animation states for controls
 * @type {Object}
 * @enum {number}
 */
var CONTROL_STATES = Object.freeze(
{
	IDLE: 0,
	HOVER: 1,
	PRESSED: 2
});

/**
 * Base class for all controls. Handles rendering a box and animation states.
 * @constructor
 * @param {number} x          The x coordinate of the top left point of the control
 * @param {number} y          The y coordinate of the top left point of the control
 * @param {number} width      The width of the control
 * @param {number} height     The height of the control
 * @param {Object} [background] The fillstyle to apply to the background of the object. If no background is supplied, no background is drawn.
 * @param {Object} [border]     The fillstyle to apply to the border of the object. If no border is supplied, no border is drawn.
 * @param {number} margin     The amount of distance between this control and surrounding or parent controls
 */

function Control(x, y, width, height, background, border, margin)
{
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	if (background)
	{
		this.background = background;
		this.drawBackground = true;
	}
	else
	{
		this.drawBackground = false;
	}

	this.border = border || '#000000';
	this.margin = margin || 0;

	this.state = CONTROL_STATES.IDLE;
	this._msSinceClick = 0;
	this._msSinceHover = 0;
};
/**
 * Handles mouse position updates
 * @param  {number} mouseX The x coordinate of the mouse cursor
 * @param  {number} mouseY The y coordinate of the mouse cursor
 */
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
/**
 * Runs animations for control state changes.
 * @param  {number} deltaTime The amount of time passed since last update call, in milliseconds.
 */
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
/**
 * Checks if mouse position is inside the control
 * @param  {number} mouseX The x coordinate of the mouse cursor.
 * @param  {number} mouseY The y coordinate of the mouse cursor.
 * @return {boolean}        True if mouseX and mouseY are inside the bounds of the control, else false.
 */
Control.prototype.hitTest = function(mouseX, mouseY)
{
	return (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height);
};
/**
 * Draws the control as a rectangle with optional background and border
 * @param  {CanvasRenderingContext2D} context The canvas context to draw to
 */
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
/**
 * A class that contains text printing functions
 * @constructor
 * @param {string} text       The text to print on the control
 * @param {string} [font]       The font style and size to apply to the text
 * @param {number} textHeight Estimated height of a line of text
 * @param {Object} [foreground] The fill style to apply to the text
 * @param {number} x          The x coordinate of the top-left corner of the control.
 * @param {number} y          The y coordinate of the top-left corner of the control.
 * @param {number} width      The width of the control
 * @param {number} height     The height of the control
 * @param {Object} [background] The fill style to apply to the background of the control.
 * @param {Object} [border]     The fill style to apply to the border of the control
 * @param {number} margin     The space between this control and surrounding or parent controls
 */

function Label(text, font, textHeight, foreground, x, y, width, height, background, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.text = text || "";
	this.foreground = foreground || '#000000';
	this.font = font || "24pt Arial";
	this.textHeight = textHeight || 24;
};
Label.prototype = Object.create(Control.prototype);
Label.prototype.constructor = Label;
/**
 * Draw the label
 * @param  {CanvasRenderingContext2D} context The canvas rendering context to draw to.
 */
Label.prototype.draw = function(context)
{
	Control.prototype.draw.call(this, context);
	context.save();
	context.fillStyle = this.foreground;
	context.textAlign = "center";
	context.font = this.font;
	context.textBaseline = 'middle';
	this.metrics = helpr.measureText(context, this.text, this.width, this.textHeight);
	var x = this.x + this.width / 2;
	var y = this.y + this.height / 2 - (this.metrics.height * (this.metrics.lines.length - 1)) / 2;
	var that = this;
	this.metrics.lines.forEach(function(line)
	{
		context.fillText(line, x, y);
		y += that.metrics.height;
	});
	context.restore();
};

/**
 * Renders text and handles click and touch events
 * @constructor
 * @param {Function} [delegate]   The function to call when the user clicks or touches this button
 * @param {string} [text]       The text to display on this button
 ** @param {string} [font]       The font style and size to apply to the text
 * @param {number} textHeight Estimated height of a line of text
 * @param {Object} [foreground] The fill style to apply to the text
 * @param {number} x          The x coordinate of the top-left corner of the control.
 * @param {number} y          The y coordinate of the top-left corner of the control.
 * @param {number} width      The width of the control
 * @param {number} height     The height of the control
 * @param {Object} [background] The fill style to apply to the background of the control.
 * @param {Object} [border]     The fill style to apply to the border of the control
 * @param {number} margin     The space between this control and surrounding or parent controls
 */

function Button(delegate, text, font, textHeight, foreground, x, y, width, height, background, border, margin)
{
	Label.call(this, text, font, textHeight, foreground, x, y, width, height, background, border, margin);
	this.delegate = delegate ||
	{};
}
Button.prototype = Object.create(Label.prototype);
Button.prototype.constructor = Button;
/**
 * Executes this button's click delegate
 * @return {boolean} True if this button handled the click event, else false.
 */
Button.prototype.click = function()
{
	if (this.delegate)
	{
		this.delegate();
		return true;
	}
	return false;
};

/**
 * Renders images
 * @constructor
 * @param {Image} image      The image to draw
 * @param {number} x          The x coordinate of the top-left corner of the control
 * @param {number} y          The y coordinate of the top-left corner of the control
 * @param {number} width      The width of the control
 * @param {number} height     The height of the control
 * @param {Object} background The fill style of the control's background
 * @param {Object} border     The fill style of the control's border
 * @param {number} margin     The space between this control and parent or sibling controls.
 */

function Graphic(image, x, y, width, height, background, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.image = image ||
	{};
}
Graphic.prototype = Object.create(Control.prototype);
Graphic.prototype.constructor = Graphic;
/**
 * Renders the graphic
 * @param  {CanvasRenderingContext2D} context The canvas rendering context to draw to
 */
Graphic.prototype.draw = function(context)
{

	Control.prototype.draw.call(this, context);
	context.drawImage(this.image,
		this.x,
		this.y,
		this.width,
		this.height);
}

/**
 * Layout panel that presents an array of controls as a vertical or horizontal list
 * @constructor
 * @param {Array} controls   The controls this panel will hold
 * @param {boolean} horizontal Whether this panel should lay the controls out horizontally or vertically
 * @param {number} x          The x coordinate of the top-left corner of the control
 * @param {number} y          The y coordinate of the top-left corner of the control
 * @param {number} width      The width of the control
 * @param {number} height     The height of the control
 * @param {Object} background The fill style of the control's background
 * @param {Object} border     The fill style of the control's border
 * @param {number} margin     The space between this control and parent or sibling controls.
 */

function Stack(controls, horizontal, x, y, width, height, background, border, margin)
{
	Control.call(this, x, y, width, height, background, border, margin);
	this.horizontal = horizontal || false;
	this.controls = controls || [];
	this.arrange();
}
Stack.prototype = Object.create(Control.prototype);
Stack.prototype.constructor = Stack;
/**
 * Rearrange the contents of the panel. Call this after adding or removing items to the controls array
 */
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
/**
 * Render the panel and containing controls
 * @param  {CanvasRenderingContext2D} context The canvas rendering context to draw the panel to
 */
Stack.prototype.draw = function(context)
{
	//draw background
	Control.prototype.draw.call(this, context);
	this.controls.forEach(function(control)
	{
		control.draw(context);
	});
};
/**
 * Update the contained controls and the animation state of the panel
 * @param  {number} deltaTime How many milliseconds have passed since the last update.
 */
Stack.prototype.update = function(deltaTime)
{
	Control.prototype.update.call(this, deltaTime);
	this.controls.forEach(function(control)
	{
		control.update(deltaTime);
	});
};
/**
 * Handle click events on this control. Fire click events on controls in this panel
 * @param  {Object} mouse Mouse x and y positions
 */
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
};

/**
 * Layout panel that presents a Stack that scrolls its contents
 * @param {Array} controls   The controls this panel will hold
 * @param {boolean} horizontal Whether this panel should lay the controls out horizontally or vertically
 * @param {number} speed          How quickly the scroll stack scrolls
 * @param {boolean} loop           Whether the scroll stack should loop controls or just scroll them once
 * @param {boolean} startOffscreen Whether the scroll stack should start with the controls off the screen
 * @param {number} x          The x coordinate of the top-left corner of the control
 * @param {number} y          The y coordinate of the top-left corner of the control
 * @param {number} width      The width of the control
 * @param {number} height     The height of the control
 * @param {Object} background The fill style of the control's background
 * @param {Object} border     The fill style of the control's border
 * @param {number} margin     The space between this control and parent or sibling controls.
 */

function ScrollStack(controls, horizontal, speed, loop, startOffscreen, x, y, width, height, background, border, margin)
{
	Stack.call(this, controls, horizontal, x, y, width, height, background, border, margin);
	this.speed = speed || 0;
	this.loop = loop || false;
	this.startOffscreen = startOffscreen || false;
}
ScrollStack.prototype = Object.create(Stack.prototype);
ScrollStack.prototype.constructor = ScrollStack;
/**
 * Rearrange the contents of the panel. Call this after adding or removing items to the controls array
 */
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
/**
 * Update the panel and the panel's controls and move the scrolling controls
 * @param  {number} deltaTime The number of milliseconds that have passed since the last update
 */
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
				control.y = control.y - (that.y - control.height) + furthest + control.margin;
				furthest = control.y + control.height;
			}
		}
	});
}
/**
 * Draw this panel and the panel's controls
 * @param  {CanvasRenderingContext2D} context The context to render to
 */
ScrollStack.prototype.draw = function(context)
{
	Control.prototype.draw.call(this, context);
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