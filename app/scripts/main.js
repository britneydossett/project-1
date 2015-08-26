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
        onUpdate: detectAcornCollision;
      // console.log('acorn: bottom=' + acorn.offset().bottom + ', class=' + acorn.attr('class'));

      // TODO: check for a caught acorn (collision detection)
}
  });
}
// function collision(acorn, basket){
//     var hw = basket.style.width >> 1; // half width of object
//     var hh = basket.style.height >> 1; // (bit shift is faster than / 2)
//     var cx = basket.style.left + hw; // centre point in x
//     var cy = basket.style.top + hh; // and in y

//     var hw1 = acorn.style.width >> 1; // half width of object
//     var hh1 = acorn.style.height >> 1; // (bit shift is faster than / 2)
//     var cx1 = acorn.style.left + hw1; // centre point in x
//     var cy1 = acorn.style.top + hh1; // and in y

//     var xDif = Math.abs(cx - cx1); // where cx1 is centre of object to check against

//     if(xDif > hw + hw1) return false; // there is no possibility of a collision!

//     var yDif = Math.abs(cy - cy1);

//     if(yDif > hh + hh1) return false; // no collision - bug out.
//     else {
//       numCaught++
// }
// }

// function doObjectsCollide(acorn, basket) { // a and b are your objects
//     // console.log(acorn.offset().top,acorn.position().top, basket.position().top, acorn.width(),acorn.height(), basket.width(),basket.height());
//     var aTop = acorn.offset().top;
//     var aLeft = acorn.offset().left;
//     var bTop = basket.offset().top;
//     var bLeft = basket.offset().left;

//     return !(
//         ((aTop + acorn.height()) < (bTop)) ||
//         (aTop > (bTop + basket.height())) ||
//         ((aLeft + acorn.width()) < bLeft) ||
//         (aLeft > (bLeft + basket.width()))
//     );
// }

// function doObjectsCollide(acorn, basket) { // a and b are your objects
//    return !(
//     ((acorn.getY() + acorn.getHeight()) < (basket.getY())) ||
//     (acorn.getY() > (basket.y() + basket.getHeight())) ||
//     ((acorn.getX() + acorn.getWidth()) < basket.getX()) ||
//     (acorn.getX() > (basket.getX() + basket.getWidth()))
//    );
//    if (caughtAcorns === true) {
//       numCaught++;
//     }
// }

function detectAcornCollision($acorn){
    $("#basket").each(function(index){
        var $e = $(this);
        if(!(
            $e.position().left > ($acorn.position().left + $acorn.width())
         || ($e.position().left + $e.width()) < $acorn.position().left
         || $e.position().top > ($acorn.position().top + $acorn.height())
         || ($e.position().top + $e.height()) < $acorn.position().top)
        ){
            console.log('collision');
        }
    });
}

// function collides(acorn, basket) {
//     var acorn.height = 60;
//     var acorn.width = 60;
//     var acorn.x = acorn.offset().left
//     var acorn.y = acorn.offset().top

//     var basket.height = 90;
//     var basket.width = 200;
//     var basket.x = acorn.offset().left
//     var basket.y = acorn.offset().top

//   return acorn.x < basket.x + basket.width &&
//          acorn.x + acorn.width > basket.x &&
//          acorn.y < basket.y + basket.height &&
//          acorn.y + acorn.height > basket.y;
// }
// function handleCollisions() {
//   fallingAcorn.forEach(function(acorn) {
//     basket.forEach(function(basket) {
//       if (collides(acorn, basket)) {
//         basket.keepScore();
//         acorn.active = false;
//       }
//     });
//   });
// }
// function collision($basket, $acorn) {
//       var x1 = $basket.offset().left;
//       var y1 = $basket.offset().top;
//       var h1 = $basket.outerHeight(true);
//       var w1 = $basket.outerWidth(true);
//       var b1 = y1 + h1;
//       var r1 = x1 + w1;
//       var x2 = $acorn.offset().left;
//       var y2 = $acorn.offset().top;
//       var h2 = $acorn.outerHeight(true);
//       var w2 = $acorn.outerWidth(true);
//       var b2 = y2 + h2;
//       var r2 = x2 + w2;

//       if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
//         numCaught++;
      // }
      // else {
      //   return keepScore(numCaught++);
//       }
// }
// function collision(){
//     var caughtAcorns = $('#basket').collision('.acorn');

//     if (caughtAcorns === true) {
//       numCaught++;
//     }
// }
// collision();

// once page loads, call fallingAcorn function
$(function() {
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

