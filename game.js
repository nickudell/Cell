//Canvas properties
var CANVAS_WIDTH = 704;
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

var GRID_SIZE = 4;

var grid = [];

var GRID_COLOURS = [[255, 0, 0],
                    [255, 128, 0],
                    [255, 255, 0],
                    [0, 255, 0],
                    [0, 128, 255],
                    [128, 0, 255],
                    [255, 0, 255]];

var imageURLS = ["images/tick.png"];

var assets = new AssetLoader(imageURLS);

var clicks = 0;

var level = 1;

var tick = 0;
var messageTick = -1;
var loadingStrings = ["Doing something or other.", "Testing flux.", "Establishing link to the thunder cloud.", "Regretting.", "Saying what I'm doing."]
var winStrings = ["You are the awesomest. Is that a word? Awesomest?", "Way to go there, buddy.", "At long last, your father is proud.", "Son and/or daughter, I am appoint.", "I guess you can go about your life now, huh?."]
var icons = [];
var message = Math.floor(Math.random() * loadingStrings.length);

var showSolution = false;

var mouse = {
	x: 0,
	y: 0,
	currentCell: -1
};

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
	canvas.addEventListener('mousemove', function(e)
	{
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
		mouse.currentCell = getCell(mouse.x, mouse.y);
	})

	context = canvas.getContext("2d");

	canvases.appendTo('body');

	buildWorld();

	//Start game loop
	awaitAssets(Tick);
	console.log("Initialization exited.")
};

function awaitAssets()
{
	var BAR_WIDTH = 200;
	var BAR_HEIGHT = 32;
	var barX = CANVAS_WIDTH / 2 - BAR_WIDTH / 2;
	var barY = CANVAS_HEIGHT / 2 - BAR_HEIGHT / 2;
	var grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	grd.addColorStop(0, '005');
	grd.addColorStop(1, '05F');
	//var grd = 'FFF';
	var BAR_COLOUR = 'FFF';
	if (assets.isFinished())
	{
		for (index in assets.images)
		{
			var image = assets.images[index];
			var sprite = new Sprite();
			sprite.setUp(image,
			{
				x: 0,
				y: 0,
				width: 128,
				height: 128,
				centerX: 64,
				centerY: 64
			});
			icons.push(sprite);
		}
		//Start game loop
		Tick();
	}
	else
	{
		Clear(grd);
		context.fillStyle = BAR_COLOUR;
		context.fillRect(barX, barY, BAR_WIDTH * (assets.assetsLoaded() / assets.totalAssets()), BAR_HEIGHT);
		var loadText = "LOADING";
		var numPips = 0;
		for (var i = FPS; i < tick; i += FPS)
		{
			loadText += ".";
			numPips++;
		}
		if (numPips != messageTick)
		{
			messageTick = numPips;
			message = loop(message, 1, loadingStrings.length);
		}
		context.save();
		context.textAlign = "left";
		context.font = "64pt Open Sans Condensed";
		context.fillText(loadText, CANVAS_WIDTH / 2 - context.measureText("LOADING").width / 2, barY - 32);
		context.restore();

		context.save();
		context.textAlign = "center";
		context.font = "16pt Roboto";
		context.fillText(loadingStrings[message], CANVAS_WIDTH / 2, barY + 96);
		context.restore();
		loopTimeout = setTimeout(awaitAssets, 1000 / FPS);


	}
};


function getCell(mouseX, mouseY)
{
	var begin = GRID_SIZE / 2 - Math.min(level, GRID_SIZE / 2);
	var end = GRID_SIZE / 2 + Math.min(level, GRID_SIZE / 2);
	if (mouseX < (BOX_WIDTH / GRID_SIZE) * end && mouseX >= (BOX_WIDTH / GRID_SIZE) * begin && mouseY < (BOX_HEIGHT / GRID_SIZE) * end && mouseY >= (BOX_HEIGHT / GRID_SIZE) * begin)
	{
		var cellRow = Math.floor((mouseX / BOX_WIDTH) * GRID_SIZE);
		var cellColumn = Math.floor((mouseY / BOX_HEIGHT) * GRID_SIZE);
		return grid[cellRow][cellColumn];
	}
	else
	{
		return -1;
	}
}

function canvasClicked(e)
{
	//Get which cell was clicked
	var relX = e.offsetX;
	var relY = e.offsetY;
	var cell = getCell(relX, relY);
	//check that a cell has been clicked
	if (cell != -1)
	{
		clicks++;
		cell.cycle();
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

	if (isPlaying)
	{
		Draw()
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
					var cell2 = grid[x2][y2];
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
		isPlaying = false;
		win();
	}
};

function win()
{

	var grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	grd.addColorStop(0, '005');
	grd.addColorStop(1, '05F');
	Clear(grd);
	context.save();
	context.fillStyle = 'FFF';
	context.textAlign = "center";
	context.font = "78pt Open Sans Condensed";
	context.fillText("YOU WIN", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
	context.restore();

	context.save();
	context.fillStyle = 'FFF';
	context.textAlign = "center";
	context.font = "16pt Roboto";
	context.fillText(winStrings[Math.floor(Math.random() * winStrings.length)], CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 96);
	context.restore();

	context.fillText("Clicks: " + clicks, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 64);

	//loopTimeout = setTimeout(win, 2000);
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

	grd = context.createLinearGradient(BOX_WIDTH, 0, CANVAS_WIDTH, 0);
	grd.addColorStop(0, 'FFF');
	grd.addColorStop(0.4, 'FFE');
	grd.addColorStop(0.6, 'DDC');
	context.fillStyle = grd;
	context.fillRect(BOX_WIDTH, 0, CANVAS_WIDTH - BOX_WIDTH, CANVAS_HEIGHT - 64);

	//draw cells

	var begin = GRID_SIZE / 2 - level;
	var end = GRID_SIZE / 2 + level;


	for (var a = begin; a < end; a++)
	{
		for (var b = begin; b < end; b++)
		{
			var cell = grid[a][b];
			cell.draw(a * cellWidth, b * cellHeight, cellWidth, cellHeight, showSolution);
		}
	}

	//draw grid
	context.save();
	context.shadowColor = '444';
	context.shadowOffsetX = 2;
	context.shadowOffsetY = 2;
	context.shadowBlur = 4;
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
	context.restore();

	//Add colour guide:

	var guideX = BOX_WIDTH + 16;
	var guideY = 16;
	context.strokeStyle = '000';
	context.lineWidth = 2;
	context.save();

	for (var i = 0; i < GRID_COLOURS.length; i++)
	{
		context.shadowColor = '444';
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowBlur = 4;
		if (mouse.currentCell != -1)
		{
			if (mouse.currentCell.value == i)
			{
				context.lineWidth = 3;
				context.strokeStyle = 'FFF';
			}
			else
			{
				context.strokeStyle = '000';
				context.lineWidth = 2;
			}
			context.fillStyle = getFillStyle(GRID_COLOURS[i], guideX, guideY, 32, 0);
			context.fillRect(guideX, guideY, 32, 32);
			context.shadowColor = 'rgba(0,0,0,0)';
			context.strokeRect(guideX, guideY, 32, 32);
			var isOption = false;
			for (var j = 0; j < mouse.currentCell.options.length; j++)
			{
				if (mouse.currentCell.options[j] == i)
				{
					isOption = true;
					break;
				}
			}

			if (!isOption)
			{
				context.shadowColor = '444';
				context.fillStyle = 'rgba(0,0,0,0.75)';
				context.fillRect(guideX, guideY, 32, 32);
			}

		}
		else
		{

			context.fillStyle = getFillStyle(GRID_COLOURS[i], guideX, guideY, 32, 0);
			context.fillRect(guideX, guideY, 32, 32);
			context.shadowColor = 'rgba(0,0,0,0)';
			context.strokeRect(guideX, guideY, 32, 32);
		}
		guideY += 48;

	}
	context.restore();
	context.fillStyle = getFillStyle(GRID_COLOURS[0], guideX, guideY, 32, 0);;
	context.fillRect(guideX, guideY, 32, 32);
	context.strokeRect(guideX, guideY, 32, 32);

	context.fillStyle = "000"
	context.font = "18pt Noto";
	context.textAlign = "center";
	var textX = BOX_WIDTH / 2;
	var textY = BOX_HEIGHT + 40;
	context.fillText("Clicks: " + clicks, textX, textY);

};

Init();