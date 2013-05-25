var helpr = new(
/**
 * Helper object with useful functions!
 * @constructor
 * @return {Object} The helper object
 */

function()
{
	/**
	 * Clamps a value between a minimum and maximum
	 * @param  {number} value The value to clamp
	 * @param  {number} [max]   The maximum number for the value. No clamping at this range occurs if this argument is not defined.
	 * @param  {number} [min]   The minimum number for the value. No clamping at this range occurs if this argument is not defined.
	 * @return {number}       The clamped number.
	 */
	this.clamp = function(value, max, min)
	{
		if (typeof min != 'undefined')
		{
			if (value < min)
			{
				return min;
			}
		}
		if (typeof max != 'undefined')
		{
			if (value > max)
			{
				return max;
			}
		}
		return value;
	};
	/**
	 * Checks for collision between two objects
	 * @param  {Object} a [description]
	 * @param  {Object} b [description]
	 * @return {boolean}   True if one is inside the other, else false.
	 */
	this.collides = function(a, b)
	{
		return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
	};

	/**
	 * Picks a random item from an Array
	 * @param  {Array} array The array to pick from
	 * @param  {number} [min]   The minimum index to pick from. Defaults to 0.
	 * @param  {number} [max]   The maximum index to pick from. Defaults to {@code array.length-1}.
	 * @return {Object}       The randomly picked value from the array
	 */
	this.pick = function(array, min, max)
	{
		var minIndex = min;
		if (typeof min == 'undefined' || min < 0 || min > array.length)
		{
			minIndex = 0;
		}
		var maxIndex = max;
		if (typeof max == 'undefined' || max > array.length || max < min)
		{
			maxIndex = array.length;
		}
		return array[minIndex + Math.floor(Math.random() * (maxIndex - minIndex))];
	};

	/**
	 * extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned.
	 * @param  {Object} from The original object
	 * @param  {Object} [to]   The destination object
	 * @return {Object}      Deep clone of from if to is null or undefined, else to adorned with the properties and members of from.
	 */
	this.extend = function(from, to)
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

	/**
	 * Increments a value and loops it around between the minimum and maximum values specified
	 * @param  {number} value    The value to increment
	 * @param  {number} change   The amount to increment
	 * @param  {number} max The maximum value of the number
	 * @param  {number} [min] The minimum value of the number. Defaults to 0
	 * @return {number}          The looped value.
	 */
	this.loop = function(value, change, max, min)
	{
		var result = value + change;
		var minValue = min || 0;
		while (result < minValue)
		{
			result += max;
		}
		return result % max;
	};

	/**
	 * Measures multiline text and splits it for you
	 * @param  {CanvasRenderingContext2D} context    The 2D context to measure the text against
	 * @param  {string} text       The text to measure
	 * @param  {number|undefined} [maxWidth]   The maximum width of any line of text
	 * @param  {number} [textHeight] The height of each line
	 * @return {Object}            Metrics from the text including height, width and the individual lines it was split into
	 */
	this.measureText = function(context, text, maxWidth, textHeight)
	{
		var result = context.measureText(text);
		result.height = textHeight;

		if (typeof maxWidth != 'undefined')
		{
			result.width = 0;
			var words = text.split(' ');
			var line = '';
			result.lines = [];

			for (var n = 0; n < words.length; n++)
			{
				var testLine = line + words[n] + ' ';
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth)
				{
					result.lines.push(line);
					line = words[n] + ' ';
					if (testWidth > result.width)
					{
						result.width = testWidth;
					}
				}
				else
				{
					line = testLine;
				}
			}
			if (line.length > 0)
			{
				result.lines.push(line);
			}
		}
		else
		{
			result.lines = [text];
		}
		return result;
	};

	/**
	 * Clears the context by painting a big rectangle over it.
	 * @param  {CanvasRenderingContext2D} context The rendering context to clear.
	 * @param  {Object} colour  The colour or gradient or pattern to draw.
	 * @param  {number} width   The width of the area to clear
	 * @param  {number} height  The height of the area to clear
	 */
	this.clear = function(context, colour, width, height)
	{
		context.save();
		context.fillStyle = colour;
		context.fillRect(0, 0, width, height);
		context.restore();
	};

	return this;
})();