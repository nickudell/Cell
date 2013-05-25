/**
 * Loading screen
 * @constructor
 * @param {CanvasRenderingContext2D} context    The canvas context to render to
 * @param {Array} assets     List of URLs of assets to loead
 * @param {Function} delegate   Callback function to call when loading is complete
 * @param {Object} background Background style
 */

function LoadingScreen(context, assets, delegate, background, foreground)
{
	this.loadingStrings = ["Doing something or other.",
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
			"Solving world hunger."
	]
	this.assets = assets;
	this.delegate = delegate;
	this.background = background || 'black';
	this.foreground = foreground || 'white';
	this.icons = [];
	this.loopTimeout;
	this.barWidth = 200;
	this.barHeight = 32;
	this.barX = CANVAS_WIDTH / 2 - this.barWidth / 2;
	this.barY = CANVAS_HEIGHT / 2 - this.barHeight / 2;
	this.tick = 0;
	this.message = Math.floor(Math.random() * this.loadingStrings.length);

	var that = this;

	/**
	 * Checks the files have been loaded, and if not calls Draw(). Has to be defined like this to preserve this on timeout
	 */
	this.loop = function()
	{
		if (that.assets.isFinished())
		{
			for (index in that.assets.images)
			{
				clearTimeout(that.loopTimeout);
				var image = that.assets.images[index];
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
				that.icons.push(sprite);
			}
			//Start game loop
			if (typeof that.delegate != 'undefined')
			{
				that.delegate(that.icons);
			}
		}
		else
		{
			that.draw(context);
			that.loopTimeout = setTimeout(this.loop, 2000);
		}
	};
}
/**
 * Draw the loading screen
 * @param  {CanvasRenderingContext2D} context The context to draw to
 */
LoadingScreen.prototype.draw = function(context)
{
	helpr.clear(context, this.background, CANVAS_WIDTH, CANVAS_HEIGHT);
	context.fillStyle = this.foreground;
	context.fillRect(this.barX, this.barY, this.barWidth * (this.assets.assetsLoaded() / this.assets.totalAssets()), this.barHeight);
	var loadText = "LOADING";
	for (var i = 0; i < this.tick; i++)
	{
		loadText += ".";
	}
	this.message = Math.loop(this.message, 1, this.loadingStrings.length);
	context.save();
	context.textAlign = "left";
	context.font = "64pt Open Sans Condensed";
	context.fillText(loadText, CANVAS_WIDTH / 2 - context.measureText("LOADING")
		.width / 2, this.barY - 32);
	context.restore();

	context.save();
	context.textAlign = "center";
	context.font = "16pt Roboto";
	context.fillText(this.loadingStrings[this.message], CANVAS_WIDTH / 2, this.barY + 96);
	context.restore();
	this.tick = Math.loop(this.tick, 1, 4);
}