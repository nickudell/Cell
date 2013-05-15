function Button(text, delegate, x, y, width, height, background, foreground, border)
{
	this.prototype = new Label(text, x, y, width, height, background, foreground, border);
	this.text = text || "";
	this.delegate = delegate || {};
	this.draw = function(context)
	{
		this.prototype.draw(context);

		context.save();
		context.fillStyle = this.foreground;
		context.textAlign = "center";
		context.font = "48pt Open Sans Condensed";
		context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 24);
		context.restore();
	};

	this.click = function()
	{
		if (delegate)
		{
			delegate();
		}
		return true;
	}
	this.update = function(deltaTime)
	{
		this.prototype.update();
	}
}