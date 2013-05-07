//Canvas properties
var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 720;



var canvas;
var context;

//Game loop properties
var loopTimeout;
var isPlaying = true;
var FPS = 10;
var prevTime = Date.now();

var timeString;


var difficulty = 1;
var showOptions = true;
var showChecks = true;



var imageURLS = ["images/tick.png"];

var assets = new AssetLoader(imageURLS);

var clicks = 0;

var tick = 0;
var messageTick = -1;
var loadingStrings = ["Doing something or other.",
                        "Testing flux.",
                        "Establishing link to the thunder cloud.",
                        "Regretting.",
                        "Saying what I'm doing.",
                        "Splining reticulates.",
                        "Selling your details to large corporations.",
                        "Rubbing two dollar bills together to start a fire.",
                        "Having a snack.",
                        "Hitting nails with things that look like hammers.",
                        "Hitting hammers with nails.",
                        "Making the best Moroccan tagine you've ever seen.",
                        "Crying and watching Rom Coms.",
                        "Manscaping.",
                        "Solving world hunger.",
                        "Don't tell Notch or he'll be mad."]
var winStrings = ["You are the awesomest. Is that a word? Awesomest?",
                        "Way to go there, buddy.",
                        "At long last, your [INSERT FATHER FIGURE HERE] is proud.",
                        "Son and/or daughter, I am appoint.",
                        "I guess you can go about your life now, huh?.",
                        "They should make caffeine that you can breath.",
                        "If you start seeing a lot of coloured boxes in your dreams. My bad.",
                        "This one's going on the fridge.",
                        "Tell your friends! Have fewer friends!",
                        "You should celebrate by eating like a whole jar of mayonnaise.",
                        "The sunlight, it burns!",
                        "While you were playing this, the zombies won. Sorry.",
                        "Excelsior!"]
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

	grid = new Grid(BOX_MARGIN,BOX_MARGIN,difficulty);

	//Start game loop
	awaitAssets();
	console.log("Initialization exited.")
};

function newGame()
{
	var titleHeight = 128;
	var grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	grd.addColorStop(0, '005');
	grd.addColorStop(1, '05F');
	Clear(grd);

	context.save();
	context.fillStyle = 'FFF';
	context.textAlign = "center";
	context.font = "78pt Open Sans Condensed";
	context.fillText("Cell", CANVAS_WIDTH / 2, titleHeight);
	context.restore();

	var centerX = CANVAS_WIDTH / 2;
	var centerY = titleHeight + 96;
	var buttonWidth = 320;
	var buttonHeight = 96;
	var buttonMargin = 32;
	var buttonFill = 'FFF'
	var textFill = '444';

	drawButton(context, 'New Game', centerX, centerY, buttonWidth, buttonHeight, buttonFill, textFill);
	centerY += buttonHeight + buttonMargin;
	drawButton(context, 'Instructions', centerX, centerY, buttonWidth, buttonHeight, buttonFill, textFill);
	centerY += buttonHeight + buttonMargin;
	drawButton(context, 'Options', centerX, centerY, buttonWidth, buttonHeight, buttonFill, textFill);
	centerY += buttonHeight + buttonMargin;
	drawButton(context, 'Credits', centerX, centerY, buttonWidth, buttonHeight, buttonFill, textFill);
	centerY += buttonHeight + buttonMargin;

	loopTimeout = setTimeout(newGame, 1000 / FPS);
};

function drawButton(context, text, centerX, centerY, width, height, buttonFill, textFill, buttonStroke)
{
	context.save();
	context.fillStyle = buttonFill;
	context.shadowColor = 'rgba(0,0,0,0.25)';
	context.shadowOffsetX = 12;
	context.shadowOffsetY = 12;
	context.shadowBlur = 16;
	context.fillRect(centerX - width / 2, centerY - height / 2, width, height);
	context.restore();
	context.save();
	context.strokeStyle = buttonStroke;
	context.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
	context.restore();

	context.save();
	context.fillStyle = textFill;
	context.textAlign = "center";
	context.font = "48pt Open Sans Condensed";
	context.fillText(text, centerX, centerY + 24);
	context.restore();
}

function credits()
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
}

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
		//newGame();
	}
	else
	{
		Clear(grd);
		context.fillStyle = BAR_COLOUR;
		context.fillRect(barX, barY, BAR_WIDTH * (assets.assetsLoaded() / assets.totalAssets()), BAR_HEIGHT);
		var loadText = "LOADING";
		var numPips = 0;
		for (var i = 0; i < tick; i++)
		{
			loadText += ".";
			numPips++;
		}
		message = loop(message, 1, loadingStrings.length);
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
		tick = loop(tick, 1, 4);
		loopTimeout = setTimeout(awaitAssets, 2000);
	}
};



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
	var grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	grd.addColorStop(0, 'FFF');
	grd.addColorStop(1, 'DDD');
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


var Update = function(deltaTime)
{
	grid.update(deltaTime);
	if (grid.getLevel > GRID_SIZE / 2)
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

	context.save();
	context.shadowColor = 'rgba(0,0,0,0.25)';
	context.shadowOffsetX = 16;
	context.shadowOffsetY = 16;
	context.shadowBlur = 32;
	context.fillStyle = 'FFF';
	context.fillRect(BOX_MARGIN, BOX_MARGIN, BOX_WIDTH, BOX_HEIGHT);
	context.restore();

	//draw cells
	grid.draw();
	//Add colour guide:

	var guideX = BOX_MARGIN + BOX_WIDTH + 16;
	var guideY = BOX_MARGIN + 16;
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
				///context.shadowColor = '444';
				context.fillStyle = 'rgba(0,0,0,0.5)';
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

	context.fillStyle = "000"
	context.font = "18pt Roboto";
	context.textAlign = "center";

	var textX = BOX_MARGIN + BOX_WIDTH / 2;
	var textY = BOX_MARGIN + BOX_HEIGHT + 40;
	context.fillText("Clicks: " + clicks, textX, textY);

};

Init();