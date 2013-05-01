function AssetLoader(imageFiles, soundFiles)
{
	this.sounds = [];
	this.images = [];
	var totalAssets = 0;
	var assetsLoaded = 0;
	var queuedFinished = false;
	var finished = false;
	var that = this;

	this.isFinished = function()
	{
		return finished;
	};

	this.totalAssets = function()
	{
		return totalAssets;
	};

	this.assetsLoaded = function()
	{
		return assetsLoaded;
	};

	function Init()
	{
		imageFiles.forEach(function(item)
		{
			totalAssets++;
			var img = new Image();
			img.onload = loaded;
			img.src = item;
			that.images.push(img);
		});

		queuedFinished = true;
	};

	function loaded()
	{
		assetsLoaded++;
		if (queuedFinished && assetsLoaded == totalAssets)
		{
			finished = true;
		}
	}

	Init();
}