$(document).ready(function () {

  var symbols = ['🍎', '🍕', '🎸', '⚽', '🚀', '🌸', '🐬', '🎩'];
  var cards = symbols.concat(symbols);
  var flipped = [];
  var moves = 0;
  var matched = 0;
  var timer = 0;
  var timerInterval = null;
  var locked = false;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function buildBoard() {
    $('#gameBoard').empty();
    shuffle(cards);

    $.each(cards, function (i, symbol) {
      var card = $('<div class="card"></div>').attr('data-symbol', symbol).text(symbol);
      $('#gameBoard').append(card);
    });
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(function () {
      timer++;
      $('#timer').text(timer);
    }, 1000);
  }

  function playSound(id) {
    $('#' + id)[0].play().catch(function () {});
  }

  $('#gameBoard').on('click', '.card', function () {
    var card = $(this);

    if (locked || card.hasClass('flipped') || card.hasClass('matched')) return;

    startTimer();
    card.addClass('flipped');
    flipped.push(card);

    if (flipped.length === 2) {
      locked = true;
      moves++;
      $('#moves').text(moves);

      var a = flipped[0];
      var b = flipped[1];

      if (a.data('symbol') === b.data('symbol')) {
        a.addClass('matched');
        b.addClass('matched');
        playSound('matchSound');
        matched++;
        flipped = [];
        locked = false;

        if (matched === symbols.length) {
          clearInterval(timerInterval);
          $('#winStats').text('Moves: ' + moves + '  |  Time: ' + timer + 's');
          $('#winMessage').fadeIn();
        }

      } else {
        playSound('wrongSound');
        setTimeout(function () {
          a.removeClass('flipped');
          b.removeClass('flipped');
          flipped = [];
          locked = false;
        }, 1000);
      }
    }
  });

  $('#restartBtn').on('click', function () {
    moves = 0;
    matched = 0;
    timer = 0;
    flipped = [];
    locked = false;
    clearInterval(timerInterval);
    timerInterval = null;
    $('#moves').text(0);
    $('#timer').text(0);
    $('#winMessage').hide();
    buildBoard();
  });

  buildBoard();

});