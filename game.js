//Canvas properties
var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 720;

var GRID_WIDTH = 640;
var GRID_HEIGHT = 640;

var GRID_MARGIN = 16;

var canvas;
var context;

//Game loop properties
var loopTimeout;
var isPlaying = true;
var FPS = 20;
var prevTime = Date.now();

var timeString;



var imageURLS = ["images/tick.png"];

var assets = new AssetLoader(imageURLS);

var clicks = 0;

var tick = 0;
var messageTick = -1;

var DIFFICULTIES = {
	EASY: 0,
	MEDIUM: 1,
	HARD: 2
};
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
                        "Solving world hunger."]
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

var menu;

function gameStart(difficulty)
{
	menu.stop();
	//initialise a new game
	grid = new Grid(GRID_MARGIN, GRID_MARGIN, GRID_WIDTH, GRID_HEIGHT, difficulty);
	/*canvas.addEventListener('click', canvasClicked, true); //add non-menu click event listener
	canvas.addEventListener('mousemove', function(e)
	{
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
		mouse.currentCell = grid.getCell(mouse.x, mouse.y);
	});*/
		$('#game').bind('click',this,canvasClicked);
	$('#game').bind('mousemove',function(event)
	{
		mouse = getRelativePosition(event.pageX,event.pageY);
		mouse.currentCell = grid.getCell(mouse.x, mouse.y);
	});
	Tick();
}

function getRelativePosition(pageX,pageY)
{
	var offset = $("#game").offset();
	return {x: pageX - offset.left,y:pageY - offset.top};
}

//Initialize variables and start the game
var Init = function()
{

	console.log("Initialization entered.")
	//Get the canvas
	var canvases = $("<canvas id='game' width='" + CANVAS_WIDTH +
		"' height='" + CANVAS_HEIGHT + "'></canvas");
	canvas = canvases[0];
	canvas.addEventListener('selectstart', function(e)
	{
		e.preventDefault();
		return false;
	});


	context = canvas.getContext("2d");

	canvases.insertAfter('h1');

	//Create main menu
	var controls = [new Button(newGame,"New game"),
                        new Button(instructions,"How to play"),
                        new Button(credits,"Credits")];
	controls.forEach(function(control)
	{
		control.width = CANVAS_WIDTH * 0.5;
		control.height = 96;
		control.background = '#FFFFFF';
		control.foreground = '#444444';
		control.margin = 32;
		control.font='48pt Open Sans Condensed';
		control.textHeight=40;
	})
	menu = new MainMenu(controls,"Cell");

	//Start game loop
	awaitAssets();
	console.log("Initialization exited.")
};

function newGame()
{
	//Show the difficulty selection menu
	menu.stop();
	var controls = [new Button(function()
	{
		gameStart(DIFFICULTIES.EASY);
	},"Sponge"),
                    new Button(function()
	{
		gameStart(DIFFICULTIES.MEDIUM);
	},"Rock"),
                    new Button(function()
	{
		gameStart(DIFFICULTIES.HARD);
	},"Diamond")];
	controls.forEach(function(control)
	{
		control.width = CANVAS_WIDTH * 0.5;
		control.height = 96;
		control.background = '#FFFFFF';
		control.foreground = '#444444';
		control.font= '48pt Open Sans Condensed';
		control.margin = 32;
	})
	menu = new MainMenu(controls,"How hard are you?");
	menu.loop();
}

function instructions()
{
	//Tell newbies how to play
	menu.stop();

	var controls = [new Label("Each cell has a colour. The colour can be changed by clicking on it."),
                        new Label("A cell can be changed only to a set number of colours."),
                        new Label("The colour guide on the right of the grid shows the order of the colours."),
                        new Label("You can see which colours are available for the current cell on the colour guide."),
                        new Label("Colours from one end of the guide will wrap around to the other."),
                        new Label("To win, each cell must have either the same colour as its surrounding cells"),
                        new Label("or one colour above or below the colours of its surrounding cells."),
                        new Label("Sounds easy right?"),
                        new Button(newGame,"Let's play")];

	controls.forEach(function(control)
	{
		control.width = CANVAS_WIDTH * 0.75;
		control.height = 96;
		control.font = '24pt Roboto';
		control.background = '#FFFFFF';
		control.foreground = '#444444';
		control.textHeight=30;
		control.margin = 32;
	});
	var panel = new ScrollStack(controls, false, 0.05, true, false);
	//panel.background = '#FFFFFF';
	//panel.margin='#00000000';
	panel.width = CANVAS_WIDTH * 0.75 + 40;
	panel.height = CANVAS_HEIGHT * 0.75;
	menu = new MainMenu(panel,"How to play");
	menu.loop();
}

function credits()
{
	//Show my name literally thousands of times
	menu.stop();

	var controls = [new Label("Director:      Nick Udell"),
                        new Label("Senior Programmer:      Nick Udell"),
                        new Label("Lead Art:      Nick Udell"),
                        new Label("QA Head:      Nick Udell"),
                        new Label("Quality Assurance:"),
                        new Label("Nick Udell, Nick Udell, Nick 'noodles' Udell, Nick Udell, Nicholas Udell, Nick Udell"),
                        new Label("Sound:      Nick Udell"),
                        new Label("Accounts:      Nick Udell"),
                        new Label("Assistant to Mr. Udell:      Nick Udell"),
                        new Label("Wardrobe:      Nick Udell"),
                        new Label("Catering:      Nick Udell"),
                        new Label("No animals were harmed in the making of this game.")];

	controls.forEach(function(control)
	{
		control.width = CANVAS_WIDTH * 0.75;
		control.height = 96;
		control.font = '24pt Roboto';
		control.background = '#FFFFFF';
		control.foreground = '#444444';
		control.textHeight=30;
		control.margin = 32;
	});
	controls[5].height+=30;
	var panel = new ScrollStack(controls, false, 0.05, true, false);
	panel.width = CANVAS_WIDTH * 0.75 + 40;
	panel.height = CANVAS_HEIGHT * 0.75;
	menu = new MainMenu(panel,"Credits");
	menu.loop();
}

function awaitAssets()
{
	var BAR_WIDTH = 200;
	var BAR_HEIGHT = 32;
	var barX = CANVAS_WIDTH / 2 - BAR_WIDTH / 2;
	var barY = CANVAS_HEIGHT / 2 - BAR_HEIGHT / 2;
	var grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	grd.addColorStop(0, '#000055');
	grd.addColorStop(1, '#0055FF');
	//var grd = 'FFF';
	var BAR_COLOUR = '#FFFFFF';
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
		menu.loop();
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
		message = Math.loop(message, 1, loadingStrings.length);
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
		tick = Math.loop(tick, 1, 4);
		loopTimeout = setTimeout(awaitAssets, 2000);
	}
};



function canvasClicked(e)
{
	//Get which cell was clicked
	var cell = mouse.currentCell;
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
	grd.addColorStop(0, '#FFFFFF');
	grd.addColorStop(1, '#DDDDDD');
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
	if (grid.level > grid.size / 2)
	{
		clearTimeout(loopTimeout);
		isPlaying = false;
		win();
	}
};

function win()
{

	var grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	grd.addColorStop(0, '#000055');
	grd.addColorStop(1, '#0055FF');
	Clear(grd);
	context.save();
	context.fillStyle = '#FFFFFF';
	context.textAlign = "center";
	context.font = "78pt Open Sans Condensed";
	context.fillText("YOU WIN", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
	context.restore();

	context.save();
	context.fillStyle = '#FFFFFF';
	context.textAlign = "center";
	context.font = "16pt Roboto";
	context.fillText(winStrings.pick(), CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 96);
	context.restore();

	context.fillText("Clicks: " + clicks, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 64);
}

function getColour(colour)
{
	return 'rgb(' + colour[0] + ',' + colour[1] + ',' + colour[2] + ')';
}

var Draw = function()
{
	//draw grid
	grid.draw();
	//Add colour guide:

	var guideX = GRID_MARGIN + GRID_WIDTH + 16;
	var guideY = GRID_MARGIN + 16;
	context.strokeStyle = '#000000';
	context.lineWidth = 2;
	context.save();

	for (var i = 0; i < grid.colours.length; i++)
	{
		drawGuide(i, guideX, guideY);
		guideY += 48;
	}

	context.restore();

	context.fillStyle = "#000000"
	context.font = "18pt Roboto";
	context.textAlign = "center";

	var textX = GRID_MARGIN + GRID_WIDTH / 2;
	var textY = GRID_MARGIN + GRID_HEIGHT + 40;
	context.fillText("Clicks: " + clicks, textX, textY);

};

function getFillStyle(colour, x, y, width, height)
{
	var delta = 32;
	var lighter = extend(colour);
	var darker = extend(colour);
	for(var i =0;i<3;i++)
	{
		lighter[i] = Math.min(lighter[i]+ delta, 255);
		darker[i] = Math.max(darker[i] - delta, 0);
	}

	var grd = context.createRadialGradient(x, y, 1, x, y, width);
	grd.addColorStop(0, getColour(lighter));
	grd.addColorStop(1, getColour(darker));
	return grd;
}

function drawGuide(colour, guideX, guideY)
{
	context.shadowColor = '#444444';
	context.shadowOffsetX = 2;
	context.shadowOffsetY = 2;
	context.shadowBlur = 4;
	if (mouse.currentCell != -1)
	{
		if (mouse.currentCell.value == colour)
		{
			context.lineWidth = 3;
			context.strokeStyle = '#FFFFFF';
		}
		else
		{
			context.strokeStyle = '#000000';
			context.lineWidth = 2;
		}

		context.fillStyle = getFillStyle(grid.colours[colour], guideX, guideY, 32, 0);
		context.fillRect(guideX, guideY, 32, 32);
		context.shadowColor = 'rgba(0,0,0,0)';
		context.strokeRect(guideX, guideY, 32, 32);

		var isOption = false;

		for (var j = 0; j < mouse.currentCell.options.length; j++)
		{
			if (mouse.currentCell.options[j] == colour)
			{
				isOption = true;
				break;
			}
		}

		if (!isOption)
		{
			///context.shadowColor = '444';
			context.fillStyle = 'rgba(0,0,0,0.7)';
			context.fillRect(guideX, guideY, 32, 32);
		}
	}
	else
	{
		context.fillStyle = getFillStyle(grid.colours[colour], guideX, guideY, 32, 0);
		context.fillRect(guideX, guideY, 32, 32);
		context.shadowColor = 'rgba(0,0,0,0)';
		context.strokeRect(guideX, guideY, 32, 32);
	}
}

$(function(){
	Init();	
});
