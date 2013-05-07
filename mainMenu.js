function MainMenu(buttons)
{
	var titleHeight = 128;
	this.buttons = buttons || [];
	var loopTimeout;
	var grd = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	grd.addColorStop(0, '005');
	grd.addColorStop(1, '05F');
	this.loop = Clear(grd);

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
}