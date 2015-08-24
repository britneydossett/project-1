'use strict';

var numCaught = 0;
var NUM_ACORNS = 8;    // TODO: change back to 8
var MAX_NUM_FALLING = 3;

// Timing in ms
var MIN_FALLING_RANDOM_DELAY = 1000;
var MAX_FALLING_RANDOM_DELAY = 3000;
var GAME_SPEED = 100;
var ACORN_FADE_TIME = 250;

function fallingAcorn(acorn) {
  return acorn.hasClass("falling")
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

// function fallingAcorn() {

//     var qt = 30;

//     $('.acorn').each(function(i, acorn) {
//         acorn = $(acorn);

//         var x = (- Math.random() * $(document).height()) + 'px';
//         var y = Math.round(Math.random() * $(document).width());
//         console.log('new x, y = ' + x + ', ' + y);
//         // acorn.css({
//         //     ,
//         //     'top': ,
//         // });

//         // add this acorn to the set of acorns
//         // $acorn = $acorn.add($acorn);
//     }

    // $('.acorn').prepend($acorn);

    // $acorn.animate({
    //     top: "4000px",
    // }, Math.random() + 4000, function(){
    //     $(this).remove();
    //     // run again when all 20 acorns hit the floor
    //     if (--qt < 1) {
    //         fallingAcorn();
    //     }
    // });
// }

// once page loads, call fallingAcorn function
$(function() {
  setInterval(step, GAME_SPEED);
  setInterval(fallingAcornManager, 1000);
});

// function recycle(acorn) {
//   console.log('recycle: acorn = ' + acorn.append($acorn));

// var newLeft = Math.round(Math.random() * $(document).height());
//   acorn.css('left', newLeft);
//   acorn.css('top', 0);

// if (Math.random() > 0.5) { //50/50 chance of going left or going right
//   acorn.removeClass('caught').show().addClass('left'); //gets new recycled ducks
// }
// else {
//   acorn.removeClass('caught').show().addClass('right');
// }
//  }

function updateAcorn(acorn) {
  // console.log('acorn.offset(): ' + JSON.stringify(acorn.offset()));
  // var newTop = acorn.offset().top - $(document).height(); //could be top
  var newTop = acorn.offset().top + 100;
  // console.log('newTop: ' + newTop);
  acorn.css('top', newTop);


// Timing in ms
  if (acorn.offset().bottom < $(document).height()) {
    console.log('Fading out acorn');
    acorn.fadeOut(ACORN_FADE_TIME, function() {
      acorn.removeClass('falling');
      // TODO: recycle the duck
    });
  }
}
// function updateAcorn(acorn) {

//   if (acorn.offset().bottom < 1100) {
//     acorn.removeClass("left").addClass("left");
//   }

//   if (acorn.offset().left < $(document).height() + 200) {
//     acorn.removeClass("right").addClass("right");
//   }
// }

// var newTop = $(document).he

// Timing in msight() + acorn.offset().bottom;
//   acorn.css("top", newTop);
// if (acorn.offset().bottom < 1100) {
//   acorn.fadeOut(ACORN_FADE_TIME, function() {
//     acorn.removeClass("left right");
//     recycle(acorn);
//   });
// }

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

  $('.acorn').each(function (i, acorn) {
    acorn = $(acorn);
    if (fallingAcorn(acorn)) {
      updateAcorn(acorn);
      // console.log('acorn: bottom=' + acorn.offset().bottom + ', class=' + acorn.attr('class'));

      // TODO: check for a caught acorn (collision detection)
    }
  });
}

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


// $(function() {
//   setInterval(step, GAME_SPEED);
// });

