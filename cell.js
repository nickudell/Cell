function Cell(solution, colours)
{
	this.options = [];
	this.solution = solution || 0;

	this._colours = colours;

	for (var k = 0; k < this._colours.length; k++)
	{
		if (k == this.solution || Math.floor(Math.random() * 2))
		{
			this.options.push(k);
		}
	}

	this._optionIndex = Math.floor(Math.random() * this.options.length);
	this.value = this.options[this._optionIndex];
	this.locked = (this.options.length == 1)
	this.certain = false;
}
Cell.prototype.cycle = function()
{
	this._optionIndex = Math.loop(this._optionIndex, 1, this.options.length);
	this.value = this.options[this._optionIndex];
};
Cell.prototype.draw = function(x, y, width, height, solution)
{
	context.save();
	context.shadowColor = 'rgba(0,0,0,0.25)';
	context.shadowOffsetX = 4;
	context.shadowOffsetY = 4;
	context.shadowBlur = 8;

	var colour = solution ? this.solution : this.value;
	context.fillStyle = this.getFillStyle(this._colours[colour],
	x + width / 2,
	y + height / 2,
	width);

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
Cell.prototype.getFillStyle = function(colour, x, y, width, height)
{
	var delta = 32;
	var lighter = extend(colour);
	var darker = extend(colour);
	lighter.forEach(function(colour)
	{
		colour = Math.min(colour + delta, 255);
	});
	darker.forEach(function(colour)
	{
		colour = Math.max(colour - delta, 0);
	});

	var grd = context.createRadialGradient(x, y, 1, x, y, width);
	grd.addColorStop(0, getColour(lighter));
	grd.addColorStop(1, getColour(darker));
	return grd;
};