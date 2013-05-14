function Grid(x, y, width, height, difficulty)
{
	var world;
	var level = 1;
	var BOX_WIDTH = width || 640;
	var BOX_HEIGHT = height || 640;
	this.x = x || 0;
	this.y = y || 0;

	this.getWidth = function()
	{
		return BOX_WIDTH;
	};

	this.getHeight = function()
	{
		return BOX_HEIGHT;
	};

	this.size = 0;

	var CELL_MARGIN = 4;

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
			CELL_MARGIN = 2;
			this.size = 32;
			showChecks = false;
			showOptions = false;
			break;
	}

	var that = this;

	this.buildWorld = function()
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
		world = [];
		//Now that we have a solution, populate the level with random choices and pick one of them for our starting grid
		for (var i = 0; i < this.size; i++)
		{
			world.push([]);

			for (var j = 0; j < this.size; j++)
			{
				world[i].push(new cell(solution[i][j], this.colours));
			}
		}
	};

	this.buildWorld();

	this.getLevel = function()
	{
		return level;
	}

	this.draw = function(showSolution)
	{
		var cellWidth = BOX_WIDTH / this.size;
		var cellHeight = BOX_HEIGHT / this.size;

		context.save();
		context.shadowColor = 'rgba(0,0,0,0.25)';
		context.shadowOffsetX = 16;
		context.shadowOffsetY = 16;
		context.shadowBlur = 32;
		context.fillStyle = 'FFF';
		context.fillRect(this.x, this.y, BOX_WIDTH, BOX_HEIGHT);
		context.restore();

		//draw cells
		var begin = this.size / 2 - level;
		var end = this.size / 2 + level;


		for (var a = begin; a < end; a++)
		{
			for (var b = begin; b < end; b++)
			{
				var cell = world[a][b];
				cell.draw(this.x + a * cellWidth + CELL_MARGIN,
				this.y + b * cellHeight + CELL_MARGIN,
				cellWidth - 2 * CELL_MARGIN,
				cellHeight - 2 * CELL_MARGIN,
				showSolution);
			}
		}
	};

	this.update = function(deltaTime)
	{
		if (completed())
		{
			level++;
		}
	}

	this.getCell = function(mouseX, mouseY)
	{
		var begin = this.size / 2 - Math.min(level, this.size / 2);
		var end = this.size / 2 + Math.min(level, this.size / 2);
		if (mouseX < this.x + (BOX_WIDTH / this.size) * end && mouseX >= this.x + (BOX_WIDTH / this.size) * begin && mouseY < this.y + (BOX_HEIGHT / this.size) * end && mouseY >= this.y + (BOX_HEIGHT / this.size) * begin)
		{
			var cellRow = Math.floor(((mouseX - this.x) / BOX_WIDTH) * this.size);
			var cellColumn = Math.floor(((mouseY - this.y) / BOX_HEIGHT) * this.size);
			return world[cellRow][cellColumn];
		}
		else
		{
			return -1;
		}
	};

	function completed()
	{
		var begin = that.size / 2 - Math.min(level, that.size / 2);
		var end = that.size / 2 + Math.min(level, that.size / 2);

		var adjacents = [[-1, 0],
                        [1, 0],
                        [0, -1],
                        [0, 1]];

		for (var x = begin; x < end; x++)
		{
			for (var y = begin; y < end; y++)
			{
				var cell = world[x][y];
				for (var i = 0; i < adjacents.length; i++)
				{
					var x2 = x + adjacents[i][0];
					var y2 = y + adjacents[i][1];
					if (x2 >= begin && y2 >= begin && x2 < end && y2 < end)
					{
						//Check if adjacent block follows the rules
						var cell2 = world[x2][y2];
						if (!(Math.loop(cell2.value, 1, that.colours.length) == cell.value || Math.loop(cell2.value, -1, that.colours.length) == cell.value || cell2.value == cell.value))
						{
							return false;
						}
					}
				};
			}
		}

		return true;
	}
}