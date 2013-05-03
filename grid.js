function Grid(x, y, difficulty)
{
	var world;
	var level = 1;
	var BOX_WIDTH = 640;
	var BOX_HEIGHT = 640;
	var BOX_MARGIN = 16;
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


	var GRID_SIZE;

	var CELL_MARGIN = 4;

	var COLOURS = [[255, 0, 0],
                    [255, 128, 0],
                    [128, 64, 0],
                    [64, 150, 0],
                    [0, 255, 64],
                    [0, 255, 255],
                    [0, 128, 255],
                    [0, 0, 255],
                    [128, 0, 255],
                    [255, 0, 255],
                    ];

	var GRID_COLOURS;
	switch (difficulty)
	{
		case 0:
			//easy
			GRID_COLOURS = [COLOURS[0], COLOURS[2], COLOURS[3], COLOURS[6], COLOURS[8]];
			GRID_SIZE = 8;
			break;
		case 1:
			//medium
			GRID_COLOURS = [COLOURS[0], COLOURS[1], COLOURS[2], COLOURS[3], COLOURS[6], COLOURS[8], COLOURS[9]];
			var GRID_SIZE = 16;
			showChecks = false;
			break;
		case 2:
			//hard
			GRID_COLOURS = COLOURS;
			CELL_MARGIN = 2;
			var GRID_SIZE = 32;
			showChecks = false;
			showOptions = false;
			break;
	}

	this.buildWorld = function()
	{
		var solution = [];
		//try to build a solved level, then add random extra data to make it harder
		for (var i = 0; i < GRID_SIZE; i++)
		{
			solution.push([]);
			for (var j = 0; j < GRID_SIZE; j++)
			{
				solution[i].push(-1);
			}
		}
		//now work out from there
		for (var x = 0; x < GRID_SIZE; x++)
		{
			for (var y = 0; y < GRID_SIZE; y++)
			{
				var allowedColours;
				if (x - 1 < 0)
				{
					if (y - 1 < 0)
					{
						//First block is set to a random colour
						allowedColours = [Math.floor(Math.random() * GRID_COLOURS.length)];
					}
					else
					{
						//Only have top for reference
						var same = solution[x][y - 1];
						var up = loop(same, 1, GRID_COLOURS.length);
						var down = loop(same, -1, GRID_COLOURS.length);
						allowedColours = [same, up, down];
					}
				}
				else
				{
					if (y - 1 < 0)
					{
						//Only have left for reference
						var same = solution[x - 1][y];
						var up = loop(same, 1, GRID_COLOURS.length);
						var down = loop(same, -1, GRID_COLOURS.length);
						allowedColours = [same, up, down];
					}
					else
					{
						//Have both for reference
						var top = solution[x][y - 1];
						var left = solution[x - 1][y];
						if (top == left)
						{
							var up = loop(top, 1, GRID_COLOURS.length);
							var down = loop(top, -1, GRID_COLOURS.length);
							allowedColours = [top, up, down];
						}
						else
						{
							//find the colours in common to the two surrounding colours
							var up1 = loop(top, 1, GRID_COLOURS.length);
							var down1 = loop(top, -1, GRID_COLOURS.length);
							var up2 = loop(left, 1, GRID_COLOURS.length);
							var down2 = loop(left, -1, GRID_COLOURS.length);
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
				var result = allowedColours[Math.floor(Math.random() * allowedColours.length)];
				solution[x][y] = result;
			}
		}
		world = [];
		//Now that we have a solution, populate the level with random choices and pick one of them for our starting grid
		for (var i = 0; i < GRID_SIZE; i++)
		{
			world.push([]);

			for (var j = 0; j < GRID_SIZE; j++)
			{
				world[i].push(new cell(solution[i][j]));
			}
		}
	};

	this.draw = function()
	{
		var cellWidth = BOX_WIDTH / GRID_SIZE;
		var cellHeight = BOX_HEIGHT / GRID_SIZE;

		context.save();
		context.shadowColor = 'rgba(0,0,0,0.25)';
		context.shadowOffsetX = 16;
		context.shadowOffsetY = 16;
		context.shadowBlur = 32;
		context.fillStyle = 'FFF';
		context.fillRect(BOX_MARGIN, BOX_MARGIN, BOX_WIDTH, BOX_HEIGHT);
		context.restore();

		//draw cells
		var begin = GRID_SIZE / 2 - level;
		var end = GRID_SIZE / 2 + level;


		for (var a = begin; a < end; a++)
		{
			for (var b = begin; b < end; b++)
			{
				var cell = world[a][b];
				cell.draw(BOX_MARGIN + a * cellWidth,
				BOX_MARGIN + b * cellHeight,
				cellWidth,
				cellHeight,
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
		var begin = GRID_SIZE / 2 - Math.min(level, GRID_SIZE / 2);
		var end = GRID_SIZE / 2 + Math.min(level, GRID_SIZE / 2);
		if (mouseX < this.x + (BOX_WIDTH / GRID_SIZE) * end && mouseX >= this.x + (BOX_WIDTH / GRID_SIZE) * begin && mouseY < this.y + (BOX_HEIGHT / GRID_SIZE) * end && mouseY >= this.y + (BOX_HEIGHT / GRID_SIZE) * begin)
		{
			var cellRow = Math.floor(((mouseX - BOX_MARGIN) / BOX_WIDTH) * GRID_SIZE);
			var cellColumn = Math.floor(((mouseY - BOX_MARGIN) / BOX_HEIGHT) * GRID_SIZE);
			return grid[cellRow][cellColumn];
		}
		else
		{
			return -1;
		}
	};

	function completed()
	{
		var begin = GRID_SIZE / 2 - Math.min(level, GRID_SIZE / 2);
		var end = GRID_SIZE / 2 + Math.min(level, GRID_SIZE / 2);

		var adjacents = [[-1, 0],
                        [1, 0],
                        [0, -1],
                        [0, 1]];

		for (var x = begin; x < end; x++)
		{
			for (var y = begin; y < end; y++)
			{
				var cell = grid[x][y];
				for (var i = 0; i < adjacents.length; i++)
				{
					var x2 = x + adjacents[i][0];
					var y2 = y + adjacents[i][1];
					if (x2 >= begin && y2 >= begin && x2 < end && y2 < end)
					{
						//Check if adjacent block follows the rules
						var cell2 = world[x2][y2];
						if (!(loop(cell2.value, 1, GRID_COLOURS.length) == cell.value || loop(cell2.value, -1, GRID_COLOURS.length) == cell.value || cell2.value == cell.value))
						{
							return false;
						}
					}
				}
			}
		}
		return true;
	}
}