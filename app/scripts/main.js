'use strict';

var numCaught = 0;
var NUM_ACORNS = 8;    // TODO: change back to 8
var MAX_NUM_FALLING = 3;

// Timing in ms
var TIMING_FACTOR = 1000;  // was 1000
var MIN_FALLING_RANDOM_DELAY = 0.75 * TIMING_FACTOR;
var MAX_FALLING_RANDOM_DELAY = 2    * TIMING_FACTOR;
var GAME_SPEED = 0.5 * TIMING_FACTOR;
var ACORN_FADE_TIME = 1 * TIMING_FACTOR;
var ACORN_MANAGER_SPEED = 0.75 * TIMING_FACTOR;

function fallingAcorn(acorn) {
  return acorn.hasClass('falling')
}

function keepScore() {
  $(".score").html("Score: " + numCaught);
}

//Basket move left & right
$(document).keydown(function(e){
    switch (e.which){
    case 37:    //left arrow key
        $("#basket").finish().animate({
            left: "-=25"
        });
        break;
    case 39:    //right arrow key
        $("#basket").finish().animate({
            left: "+=25"
        });
        break;
  }
});

function updateAcorn(acorn) {
  // console.log('acorn.offset(): ' + JSON.stringify(acorn.offset()));
  // var newTop = acorn.offset().top - $(document).height(); //could be top
  var newTop = acorn.offset().top + 200;
  // console.log('newTop: ' + newTop);
  acorn.css('top', newTop);

// Timing in ms
  console.log('acorn.offset().top: ' + acorn.offset().top);
  console.log('document height: ' + $(document).height());
  if (!acorn.hasClass('fading') && acorn.offset().top > $(document).height() - 200) {
    console.log('Fading out acorn');
    acorn.addClass('fading');
    acorn.fadeOut(ACORN_FADE_TIME, function() {
      acorn.removeClass('fading');
      acorn.removeClass('falling');
      recycle(acorn);
    });
  }
}

function recycle(acorn) {
  console.log('recycle acorn: ' + acorn.attr('id'));
  var newLeft = Math.floor(Math.random() * $(document).width() - 300); //randomizes duck position
  acorn.css('left', newLeft);
  acorn.css('top', 0);

  if (Math.random() > 0.5) { //50/50 chance of going left or going right
    acorn.removeClass('falling').show().addClass('left'); //gets new recycled ducks
  }
  else {
    acorn.removeClass('falling').show().addClass('right');
  }
}

function getNonFallingAcorn() {
  var nonFallingAcorns = $('.acorn').not(".falling");
  var numNotFalling = nonFallingAcorns.length;
  var randomNumber = Math.floor(Math.random() * numNotFalling);
  var randomAcorn = $(nonFallingAcorns[randomNumber]);
  console.log('returning non-falling acorn id: ' + randomAcorn.attr('id'));
  return randomAcorn;
}

function getRandomInteger(min, max) {
  return min + Math.round(Math.random() * (max - min));
}

var pending_falling_update = false;

function fallingAcornManager() {
  var numFallingAcorns = $('.falling').length;
  console.log('numFallingAcorns: ' + numFallingAcorns);

  if (numFallingAcorns < MAX_NUM_FALLING && pending_falling_update === false) {
    pending_falling_update = true;

    var acorn = getNonFallingAcorn();
    var randomDelay = getRandomInteger(MIN_FALLING_RANDOM_DELAY, MAX_FALLING_RANDOM_DELAY);

    console.log('randomDelay: ' + randomDelay);

    setTimeout(function() {
      console.log('adding falling');
      acorn.addClass('falling');
      pending_falling_update = false;
    }, randomDelay);
  }
}

function step() {

  keepScore();

  $('.acorn').each(function (i, acorn) {
    acorn = $(acorn);
    if (fallingAcorn(acorn)) {
      updateAcorn(acorn);
      // console.log('acorn: bottom=' + acorn.offset().bottom + ', class=' + acorn.attr('class'));

      // TODO: check for a caught acorn (collision detection)
}
  });
}

function collision($basket, $acorn) {
      var x1 = $basket.offset().left;
      var y1 = $basket.offset().top;
      var h1 = $basket.outerHeight(true);
      var w1 = $basket.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      var x2 = $acorn.offset().left;
      var y2 = $acorn.offset().top;
      var h2 = $acorn.outerHeight(true);
      var w2 = $acorn.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;

      if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return numCaught;
      return ++numCaught;
    }

// once page loads, call fallingAcorn function
$(function() {
  setInterval(function() {
    $('keepScore').text(collision($('#basket'), $('.acorn')));
  }, 100);
  setInterval(step, GAME_SPEED);
  setInterval(fallingAcornManager, ACORN_MANAGER_SPEED);
});

// // function step() {

// // updateScore();

//   $(".acorn").each(function (i, acorn) {
//     acorn = $(acorn);
//     if (fallingAcorn(acorn)) {
//       updateAcorn(acorn);
//     }
//     else {
//       console.log('Acorn falling');
//     }
//     console.log('acorn: bottom=' + acorn.offset().bottom + ', class=' + acorn.attr('class'));
//   });
// }

// $('.acorn').each(function (i, acorn) {
//     acorn = $(acorn);
//     acorn.css('bottom', duck.offset().bottom + 30);
//   });

