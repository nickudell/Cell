function Sprite()
{
  this.x = 0; //the position on the image that this sprite begins
  this.y = 0; //the position on the image that this sprite begins
  this.centerX = 0;
  this.centerY = 0;
}
Sprite.prototype.setUp = function(image, spriteParams)
{
  this.width = spriteParams.width; //the width of the subset of the image to use for our sprite
  this.height = spriteParams.height; //the height of the subset of the image to use for our sprite
  this.x = spriteParams.x || 0; //the position on the image that this sprite begins
  this.y = spriteParams.y || 0; //the position on the image that this sprite begins
  this.centerX = spriteParams.centerx || this.x + this.width / 2;
  this.centerY = spriteParams.centery || this.y + this.height / 2;
  this.test = Math.random();
  this.image = image;
}

Sprite.prototype.draw = function(context, x, y, width, height, opacity)
{
  var width = width || this.width;
  var height = height || this.height;
  var scaleX = width / this.width;
  var scaleY = height / this.height;
  var x = x - this.centerX * scaleX || 0;
  var y = y - this.centerY * scaleY || 0;
  context.save();
  context.globalAlpha = opacity || 1;
  context.drawImage(this.image,
  this.x,
  this.y,
  this.width,
  this.height,
  x + width / 2,
  y + width / 2,
  width,
  height);
  context.restore();
};