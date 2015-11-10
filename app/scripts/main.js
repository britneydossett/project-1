'use strict';

var numCaught = 0;
var maxNumFalling = 3;
var $myModal2 = false;
var $myModal3 = false;

// Timing in ms
var minDelay = 750;
var maxDelay = 2000;
var gameSpeed = 500;
var acornFadeTime = 500;
var acornManagerSpeed = 750;

function fallingAcorn(acorn) {
    return acorn.hasClass('falling');
}

function keepScore() {
  $('.score').html('Score: ' + numCaught);
  if (numCaught === 10 && $myModal2 == false) {
    $myModal2 = true;
    $("#myModal2").modal("show");
  }
  else if (numCaught === 20 && $myModal3 == false) {
    $myModal3 = true;
    $("#myModal3").modal("show");
  }
  else {
  }
}

//Basket move left & right
$(document).keydown(function(e) {
  switch (e.which) {
    case 37: //left arrow key
      $('#basket').finish().animate({
        left: '-=30'
      });
      break;
    case 39: //right arrow key
      $('#basket').finish().animate({
        left: '+=30'
      });
      break;
  }
});

function recycle(acorn) {
  console.log('recycle acorn: ' + acorn.attr('id'));
  var newLeft = Math.floor(Math.random() * $(document).width() - 300); //randomizes acorn position
  acorn.css('left', newLeft);
  acorn.css('top', 0);

  if (Math.random() > 0.5) { //50/50 chance of going left or going right
    acorn.removeClass('falling').show().addClass('left'); //gets new recycled ducks
  }
  else {
    acorn.removeClass('falling').show().addClass('right');
  }
}

function updateAcorn(acorn) {
  var newTop = acorn.offset().top + 220;
  acorn.css('top', newTop);

  // Timing in ms
  console.log('acorn.offset().top: ' + acorn.offset().top);
  console.log('document height: ' + $(document).height());
  if (!acorn.hasClass('fading') && acorn.offset().top > $(document).height() - 220) {
    console.log('Fading out acorn');
    acorn.addClass('fading'); //had to add fading class for proper recycling
    acorn.fadeOut(acornFadeTime, function() {
      acorn.removeClass('fading');
      acorn.removeClass('falling');
      recycle(acorn);
    });
  }
}

function getNonFallingAcorn() {
  var nonFallingAcorns = $('.acorn').not('.falling');
  var numNotFalling = nonFallingAcorns.length;
  var randomNumber = Math.floor(Math.random() * numNotFalling);
  var randomAcorn = $(nonFallingAcorns[randomNumber]);
  console.log('returning non-falling acorn id: ' + randomAcorn.attr('id'));
  return randomAcorn;
}

function getRandomInteger(min, max) {
  return min + Math.round(Math.random() * (max - min));
}

var pendingUpdate = false;

function fallingAcornManager() {
  var numFallingAcorns = $('.falling').length;
  console.log('numFallingAcorns: ' + numFallingAcorns);

  if (numFallingAcorns < maxNumFalling && pendingUpdate === false) {
    pendingUpdate = true;

    var acorn = getNonFallingAcorn();
    var randomDelay = getRandomInteger(minDelay, maxDelay);

    console.log('randomDelay: ' + randomDelay);

    setTimeout(function() {
      console.log('adding falling');
      acorn.addClass('falling');
      pendingUpdate = false;
    }, randomDelay);
  }
}

function step() {
  keepScore();

  $('.acorn').each(function(i, acorn) {
    acorn = $(acorn);
    if (fallingAcorn(acorn)) {
      updateAcorn(acorn);
    }
  });
}

function collision() {
  var left = $('#basket').position().left;
  var width = $('#basket').width();
  var right = left + width;
  var height = $('#basket').position().top;
  for (var i = 1; i < 9; i++) {
    var aLeft = $('#acorn' + i).position().left;
    var aBottom = $('#acorn' + i).position().top - $('#acorn' + i).height();

    if ((aLeft > left && aLeft < right) &&
      (aBottom >= height)) {
      $('#acorn' + i).removeClass('fading');
      $('#acorn' + i).removeClass('falling');
      recycle($('#acorn' + i));
      numCaught++;
    }
    else {
      console.log(false);
    }
  }
}

$('#myModal').modal('show')

// once page loads, call fallingAcorn function
$(function() {
  setInterval(collision, 100);
  setInterval(step, gameSpeed);
  setInterval(fallingAcornManager, acornManagerSpeed);
});
