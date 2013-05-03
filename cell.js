function cell(solution)
{
	this.options = [];
	this.solution = solution || 0;
	for (var k = 0; k < GRID_COLOURS.length; k++)
	{
		if (k == this.solution || Math.floor(Math.random() * 2))
		{
			this.options.push(k);
		}
	}
	var optionIndex = Math.floor(Math.random() * this.options.length);
	this.value = this.options[optionIndex];
	this.locked = (this.options.length == 1)
	this.certain = false;


	this.draw = function(x, y, width, height, solution)
	{
		context.save();
		context.shadowColor = 'rgba(0,0,0,0.25)';
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowBlur = 8;
		if (solution)
		{
			context.fillStyle = getFillStyle(GRID_COLOURS[this.solution],
			x + width / 2,
			y + height / 2,
			width);
		}
		else
		{
			context.fillStyle = getFillStyle(GRID_COLOURS[this.value],
			x + width / 2,
			y + height / 2,
			width);
		}

		//context.fillRect(x + CELL_MARGIN, y + CELL_MARGIN, width - 2 * CELL_MARGIN, height - 2 * CELL_MARGIN);
		context.lineWidth = 1;
		context.strokeStyle = '888';
		context.roundRect(x + CELL_MARGIN, y + CELL_MARGIN, width - 2 * CELL_MARGIN, height - 2 * CELL_MARGIN, 2, true, true);
		//context.strokeRect(x + CELL_MARGIN, y + CELL_MARGIN, width - 2 * CELL_MARGIN, height - 2 * CELL_MARGIN);
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

	this.cycle = function()
	{
		optionIndex = loop(optionIndex, 1, this.options.length);
		this.value = this.options[optionIndex];
	}
}