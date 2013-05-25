/**
 * A single Cell in the
 * @constructor
 * @param {number} solution The index of the colour which is a correct answer for this cell
 * @param {Array} colours  The set of colours used in this grid
 */

function Cell(solution, colours)
{
	this.options = [];
	this.solution = solution || 0;

	this._colours = colours;

	//pick random optional colours
	for (var k = 0; k < this._colours.length; k++)
	{
		if (k == this.solution || Math.floor(Math.random() * 3))
		{
			this.options.push(k);
		}
	}

	this._optionIndex = Math.floor(Math.random() * this.options.length);
	this.value = this.options[this._optionIndex];
	this.locked = (this.options.length == 1)
	this.certain = false;
}
/**
 * Changes the cell's colour to the next available option. The options are a circular queue.
 */
Cell.prototype.cycle = function()
{
	this._optionIndex = Math.loop(this._optionIndex, 1, this.options.length);
	this.value = this.options[this._optionIndex];
};
/**
 * Draws the cell on the canvas
 * @param  {number} x        The x coordinate of the top-left corner of the Cell
 * @param  {number} y        The y coordinate of the top-left corner of the Cell
 * @param  {number} width    The width of the Cell
 * @param  {number} height   The height of the Cell
 * @param  {boolean|undefined} [solution] Whether to show the solution or the cell's colour
 */
Cell.prototype.draw = function(x, y, width, height, solution)
{
	context.save();
	context.shadowColor = 'rgba(0,0,0,0.25)';
	context.shadowOffsetX = 4;
	context.shadowOffsetY = 4;
	context.shadowBlur = 8;

	context.fillStyle = this.getFillStyle(solution,
		x + width / 2,
		y + height / 2,
		width,
		height);

	context.fillRect(x, y, width, height);
	context.lineWidth = 1;
	context.strokeStyle = '888';
	context.strokeRect(x, y, width, height);
	if (this.options.length == 1)
	{
		context.shadowColor = 'rgba(0,0,0,0.65)';
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowBlur = 2;
		icons[0].draw(context, x + 8, y + 8, width - 16, height - 16);
	}
	context.restore();
};
/**
 * Returns a fillStyle composed of a radial gradient on the Cell's colour.
 * @param  {boolean|undefined} solution Whether to use the solution's colour or the Cell's colour.
 * @param  {number} x        The x coordinate of the top-left corner of the Cell.
 * @param  {number} y        The y coordinate of the top-left corner of the Cell.
 * @param  {number} width    The width of the Cell.
 * @param  {number} height   The height of the Cell.
 * @return {Object}          The gradient built from the colour
 */
Cell.prototype.getFillStyle = function(solution, x, y, width, height)
{
	var colour = solution ? this._colours[this.solution] : this._colours[this.value];
	var delta = 48;
	var lighter = helpr.extend(colour);
	var darker = helpr.extend(colour);
	for (var i = 0; i < 3; i++)
	{
		lighter[i] = Math.min(lighter[i] + delta, 255);
		darker[i] = Math.max(darker[i] - delta, 0);
	}

	var grd = context.createRadialGradient(x, y, 1, x, y, width);
	grd.addColorStop(0, getColour(lighter));
	grd.addColorStop(1, getColour(darker));
	return grd;
};

//Loop through values. Much easier than dealing with silly things

Math.loop = function(value, change, maxValue)
{
	var result = value + change;
	while (result < 0)
	{
		result += maxValue;
	}
	return result % maxValue;
};