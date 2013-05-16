function Grid(x, y, width, height, difficulty)
{
	this.world = [];
	this.level = 1;
	this.width = width || 640;
	this.height = height || 640;
	this.x = x || 0;
	this.y = y || 0;

	this.size = 0;

	this.cellMargin = 4;

	var COLOURS = [[255, 0, 0],
                    [255, 128, 0],
                    [160, 96, 0],
                    [64, 150, 0],
                    [0, 255, 64],
                    [0, 255, 255],
                    [0, 128, 255],
                    [0, 0, 255],
                    [128, 0, 255],
                    [255, 0, 255],
                    ];

	this.colours = [];
	switch (difficulty)
	{
		case 0:
			//easy
			this.colours = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[6], COLOURS[8]];
			this.size = 8;
			break;
		case 1:
			//medium
			this.colours = [COLOURS[0], COLOURS[1], COLOURS[2], COLOURS[3], COLOURS[6], COLOURS[8], COLOURS[9]];
			this.size = 16;
			showChecks = false;
			break;
		case 2:
			//hard
			this.colours = COLOURS;
			this.cellMargin = 2;
			this.size = 32;
			showChecks = false;
			showOptions = false;
			break;
	}

	var that = this;

	this.buildWorld();
}

Grid.prototype.buildWorld = function()
{
	var solution = [];
	//try to build a solved level, then add random extra data to make it harder
	for (var i = 0; i < this.size; i++)
	{
		solution.push([]);
		for (var j = 0; j < this.size; j++)
		{
			solution[i].push(-1);
		}
	}
	//now work out from there
	for (var x = 0; x < this.size; x++)
	{
		for (var y = 0; y < this.size; y++)
		{
			var allowedColours;
			if (x - 1 < 0)
			{
				if (y - 1 < 0)
				{
					//First block is set to a random colour
					allowedColours = this.colours.pick();
				}
				else
				{
					//Only have top for reference
					var same = solution[x][y - 1];
					var up = Math.loop(same, 1, this.colours.length);
					var down = Math.loop(same, -1, this.colours.length);
					allowedColours = [same, up, down];
				}
			}
			else
			{
				if (y - 1 < 0)
				{
					//Only have left for reference
					var same = solution[x - 1][y];
					var up = Math.loop(same, 1, this.colours.length);
					var down = Math.loop(same, -1, this.colours.length);
					allowedColours = [same, up, down];
				}
				else
				{
					//Have both for reference
					var top = solution[x][y - 1];
					var left = solution[x - 1][y];
					if (top == left)
					{
						var up = Math.loop(top, 1, this.colours.length);
						var down = Math.loop(top, -1, this.colours.length);
						allowedColours = [top, up, down];
					}
					else
					{
						//find the colours in common to the two surrounding colours
						var up1 = Math.loop(top, 1, this.colours.length);
						var down1 = Math.loop(top, -1, this.colours.length);
						var up2 = Math.loop(left, 1, this.colours.length);
						var down2 = Math.loop(left, -1, this.colours.length);
						allowedColours = [];
						if (up1 == left || up1 == down2)
						{
							allowedColours.push(up1);
						}
						if (down1 == left || down1 == up2)
						{
							allowedColours.push(down1);
						}
						if (top == up2 || top == down2)
						{
							allowedColours.push(top);
						}
					}
				}
			}
			var result = allowedColours.pick();
			solution[x][y] = result;
		}
	}
	this.world = [];
	//Now that we have a solution, populate the level with random choices and pick one of them for our starting grid
	for (var i = 0; i < this.size; i++)
	{
		this.world.push([]);

		for (var j = 0; j < this.size; j++)
		{
			this.world[i].push(new Cell(solution[i][j], this.colours));
		}
	}
};

Grid.prototype.draw = function(showSolution)
{
	var cellWidth = this.width / this.size;
	var cellHeight = this.height / this.size;

	context.save();
	context.shadowColor = 'rgba(0,0,0,0.25)';
	context.shadowOffsetX = 16;
	context.shadowOffsetY = 16;
	context.shadowBlur = 32;
	context.fillStyle = 'FFF';
	context.fillRect(this.x, this.y, this.width, this.height);
	context.restore();

	//draw cells
	var bounds = this.getBounds();


	for (var a = bounds.begin; a < bounds.end; a++)
	{
		for (var b = bounds.begin; b < bounds.end; b++)
		{
			var cell = this.world[a][b];
			cell.draw(this.x + a * cellWidth + this.cellMargin,
			this.y + b * cellHeight + this.cellMargin,
			cellWidth - 2 * this.cellMargin,
			cellHeight - 2 * this.cellMargin,
			showSolution);
		}
	}
};
Grid.prototype.update = function(deltaTime)
{
	if (this._completed())
	{
		this.level++;
	}
}

Grid.prototype._completed = function()
{
	var bounds = this.getBounds();

	var adjacents = [[-1, 0],
                        [1, 0],
                        [0, -1],
                        [0, 1]];

	for (var x = bounds.begin; x < bounds.end; x++)
	{
		for (var y = bounds.begin; y < bounds.end; y++)
		{
			var cell = this.world[x][y];
			for (var i = 0; i < adjacents.length; i++)
			{
				var x2 = x + adjacents[i][0];
				var y2 = y + adjacents[i][1];
				if (x2 >= bounds.begin && y2 >= bounds.begin && x2 < bounds.end && y2 < bounds.end)
				{
					//Check if adjacent block follows the rules
					var cell2 = this.world[x2][y2];
					if (!(Math.loop(cell2.value, 1, this.colours.length) == cell.value || Math.loop(cell2.value, -1, this.colours.length) == cell.value || cell2.value == cell.value))
					{
						return false;
					}
				}
			};
		}
	}

	return true;
}

Grid.prototype.getBounds = function()
{
	var begin = this.size / 2 - Math.min(this.level, this.size / 2);
	var end = this.size / 2 + Math.min(this.level, this.size / 2);
	return {
		begin: begin,
		end: end
	};
}

Grid.prototype.getCell = function(mouseX, mouseY)
{
	var bounds = this.getBounds();
	if (mouseX < this.x + (this.width / this.size) * bounds.end && mouseX >= this.x + (this.width / this.size) * bounds.begin && mouseY < this.y + (this.height / this.size) * bounds.end && mouseY >= this.y + (this.height / this.size) * bounds.begin)
	{
		var cellRow = Math.floor(((mouseX - this.x) / this.width) * this.size);
		var cellColumn = Math.floor(((mouseY - this.y) / this.height) * this.size);
		return this.world[cellRow][cellColumn];
	}
	else
	{
		return -1;
	}
};