function clamp(value, min, max)
{
	if (value < min)
	{
		return min;
	}
	if (value > max)
	{
		return max;
	}
	return value;
};

function collides(a, b)
{
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

// extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned

function extend(from, to)
{
	if (from == null || typeof from != "object") return from;
	//if (from.constructor != Object && from.constructor != Array) return from;
	if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || from.constructor == String || from.constructor == Number || from.constructor == Boolean) return new from.constructor(from);
	try
	{
		to = to || new from.constructor();

		for (var name in from)
		{
			to[name] = extend(from[name], null);
		}
		if (to.setThat)
		{
			to.setThat();
		}
	}
	catch (err)
	{
		return from;
	}

	return to;
};

//Loop through values. Much easier than dealing with silly things

function loop(value, change, maxValue)
{
	var result = value + change;
	while (result < 0)
	{
		result += maxValue;
	}
	return result % maxValue;
}

//add a rounded rectangle function to context2Ds
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, fill, stroke)
{
	if (typeof stroke == "undefined")
	{
		stroke = false;
	}
	/*
	if (typeof fill == "undefined")
	{
		fill = false;
	}*/
	if (typeof radius === "undefined")
	{
		radius = 5;
	}
	this.beginPath();
	this.moveTo(x + radius, y);
	this.lineTo(x + width - radius, y);
	this.quadraticCurveTo(x + width, y, x + width, y + radius);
	this.lineTo(x + width, y + height - radius);
	this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	this.lineTo(x + radius, y + height);
	this.quadraticCurveTo(x, y + height, x, y + height - radius);
	this.lineTo(x, y + radius);
	this.quadraticCurveTo(x, y, x + radius, y);
	this.closePath();
	if (stroke)
	{
		//this.stroke(stroke);
		this.stroke();
	}
	if (fill)
	{
		this.fill();
	}
};