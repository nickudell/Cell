//Canvas properties
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 704;

var BOX_WIDTH = 640;
var BOX_HEIGHT = 640;

var canvas;
var context;

//Game loop properties
var loopTimeout;
var isPlaying = true;
var FPS = 50;
var prevTime = Date.now();

var timeString;

var GRID_SIZE = 16;

var grid = [];

var GRID_COLOURS = [[255, 0, 0],
                    [255, 128, 0],
                    [255, 255, 0],
                    [0, 255, 0],
                    [0, 0, 255],
                    [128, 0, 255],
                    [255, 0, 255]];

var clicks = 0;

var level = 1;

var showSolution = false;

//Initialize variables and start the game
var Init = function()
{
	console.log("Initialization entered.")
	//Get the canvas
	var canvases = $("<canvas id='canvas' width='" + CANVAS_WIDTH +
		"' height='" + CANVAS_HEIGHT + "'></canvas");
	canvas = canvases[0];
	canvas.addEventListener('click', canvasClicked, true);
	canvas.addEventListener('selectstart', function(e)
	{
		e.preventDefault();
		return false;
	});

	context = canvas.getContext("2d");

	canvases.appendTo('body');

	buildWorld();

	//Start game loop
	Tick();
	console.log("Initialization exited.")
};

function canvasClicked(e)
{
	//Get which cell was clicked
	var relX = e.offsetX;
	var relY = e.offsetY;
	//check that a cell has been clicked
	if (relX < BOX_WIDTH && relX >= 0 && relY < BOX_HEIGHT && relY >= 0)
	{
		var cellRow = Math.floor((relX / BOX_WIDTH) * GRID_SIZE);
		var cellHeight = Math.floor((relY / BOX_HEIGHT) * GRID_SIZE);
		clicks++;
		grid[cellRow][cellHeight].cycle();
	}
	else
	{
		showSolution = !showSolution;
	}
}

//The game loop
var Tick = function()
{
	//Update time difference
	var now = Date.now();
	var deltaTime = now - prevTime;
	prevTime = now;

	var grd = context.createLinearGradient(0, 0, 0, BOX_HEIGHT);
	grd.addColorStop(0, '222');
	grd.addColorStop(0.5, '555');

	Clear(grd);
	Update(deltaTime);
	Draw()

	if (isPlaying)
	{
		loopTimeout = setTimeout(Tick, 1000 / FPS);
	}
	else
	{
		console.log('Exiting normally.');
	}
};

//Clear the screen
var Clear = function(colour)
{
	//Set active colour to specified parameter
	context.fillStyle = colour;
	//start drawing
	context.beginPath();
	//draw rectangle from point (0,0) to (width, height)
	context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	//end drawing
	context.closePath();
	//Fill the rectangle with the active colour
	context.fill();
};

function completed()
{
	var begin = GRID_SIZE / 2 - level;
	var end = GRID_SIZE / 2 + level;

	var adjacents = [[-1, -1],
                        [-1, 1],
                        [1, -1],
                        [1, 1]];

	var colour1 = grid[begin][begin];
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
					var cell2 = grid[x2][y2];
					if (Math.abs(cell2.value - cell.value) > 1)
					{
						return false;
					}
				}
			}
		}
	}
	return true;
}

function buildWorld()
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
	grid = [];
	world = [];
	//Now that we have a solution, populate the level with random choices and pick one of them for our starting grid
	for (var i = 0; i < GRID_SIZE; i++)
	{
		grid.push([]);

		for (var j = 0; j < GRID_SIZE; j++)
		{
			grid[i].push(new cell(solution[i][j]));
		}
	}
}

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

		context.fillRect(x, y, width, height);
		context.restore();
	};

	this.cycle = function()
	{
		optionIndex = loop(optionIndex, 1, this.options.length);
		this.value = this.options[optionIndex];
	}
}

function loop(value, change, maxValue)
{
	var result = value + change;
	while (result < 0)
	{
		result += maxValue;
	}
	return result % maxValue;
}

var Update = function(deltaTime)
{
	if (completed())
	{
		level++;
	}
	if (level > GRID_SIZE / 2)
	{
		clearTimeout(loopTimeout);
		win();
	}
};

function win()
{
	Clear('F60');

	context.fillStyle = "000"
	context.font = "72pt Helvetica";
	context.textAlign = "center";
	context.fillText("YOU WIN!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 64);
	context.fillText("Clicks: " + clicks, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 64);

	loopTimeout = setTimeout(win, 1000 / FPS);
}

function getColour(colour)
{
	return 'rgb(' + colour[0] + ',' + colour[1] + ',' + colour[2] + ')';
}

function getFillStyle(colour, x, y, width, height)
{
	var delta = 32;
	var lighter = extend(colour);
	var darker = extend(colour);
	for (var j = 0; j < lighter.length; j++)
	{
		if (lighter[j] < (255 - delta))
		{
			lighter[j] += delta;
		}
		else
		{
			lighter[j] = 255;
		}

		if (darker[j] > delta)
		{
			darker[j] -= delta;
		}
		else
		{
			darker[j] = 0;
		}
	}

	var grd = context.createRadialGradient(x, y, 1, x, y, width);
	grd.addColorStop(0, getColour(lighter));
	grd.addColorStop(1, getColour(darker));
	return grd;
}

var Draw = function()
{
	var cellWidth = BOX_WIDTH / GRID_SIZE;
	var cellHeight = BOX_HEIGHT / GRID_SIZE;

	var grd = context.createLinearGradient(0, BOX_HEIGHT, 0, CANVAS_HEIGHT);
	grd.addColorStop(0, 'FFF');
	grd.addColorStop(0.4, 'FFE');
	grd.addColorStop(0.6, 'DDC');
	context.fillStyle = grd;
	context.fillRect(0, BOX_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT - BOX_HEIGHT);

	//draw cells

	var begin = GRID_SIZE / 2 - level;
	var end = GRID_SIZE / 2 + level;


	for (var a = begin; a < end; a++)
	{
		for (var b = begin; b < end; b++)
		{
			grid[a][b].draw(a * cellWidth, b * cellHeight, cellWidth, cellHeight, showSolution);
		}
	}

	//draw grid
	context.strokeStyle = 'FFF';
	context.lineWidth = 3;
	for (var i = 1; i < GRID_SIZE; i++)
	{
		var x = cellWidth * i;
		var y = cellHeight * i;

		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, BOX_HEIGHT);
		context.stroke();

		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(BOX_WIDTH, y);
		context.stroke();
	}
	var y = cellHeight * GRID_SIZE;
	context.beginPath();
	context.moveTo(0, y);
	context.lineTo(BOX_WIDTH, y);
	context.stroke();

	//Add colour guide:

	var guideX = 16;
	var guideY = BOX_HEIGHT + 16;
	context.strokeStyle = '000';
	for (var i = 0; i < GRID_COLOURS.length; i++)
	{
		context.fillStyle = getFillStyle(GRID_COLOURS[i], guideX, guideY, 32, 0);
		context.fillRect(guideX, guideY, 32, 32);
		context.strokeRect(guideX, guideY, 32, 32);
		guideX += 48;
	}

	context.fillStyle = getFillStyle(GRID_COLOURS[0], guideX, guideY, 32, 0);;
	context.fillRect(guideX, guideY, 32, 32);
	context.strokeRect(guideX, guideY, 32, 32);

	context.fillStyle = "000"
	context.font = "18pt Noto";
	context.textAlign = "center";
	guideX += 48;
	context.fillText("Clicks: " + clicks, guideX + (CANVAS_WIDTH - guideX) / 2, guideY + 24);

};

Init();