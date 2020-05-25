/*
 * Create a list that holds all of your cards
 */

 /*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


//variables and constants
const cards = ['fa-diamond', 'fa-diamond',
			'fa-bomb', 'fa-bomb',
			'fa-paper-plane-o', 'fa-paper-plane-o',
			'fa-anchor', 'fa-anchor',
			'fa-bolt', 'fa-bolt',
			'fa-cube', 'fa-cube',
			'fa-leaf', 'fa-leaf',
			'fa-bicycle', 'fa-bicycle'
];

let movesCounter = 0;
let time = 0;
let clockId;
let starCounter = 3;
let matchedPairs = 0;
const deck = document.querySelector(".deck");
let moves = document.querySelector(".moves");
const restart = document.querySelector(".restart");
const stars = document.querySelectorAll('.stars');
let clock = document.querySelector(".clock");
const modalTime = document.querySelector(".modal_time");
const modalStars = document.querySelector(".modal_stars");
const modalMoves = document.querySelector(".modal_moves");
let toggledCards = []
let timerOff = true;


//event listener for game reset button
restart.addEventListener('click', event => {
	resetGame();
});



//event listener for when a card is clicked on
deck.addEventListener('click', event => {

	const clickTarget = event.target;

	if (isClickValid(clickTarget)) 
	{

		//starts the timer on first valid card that is clicked
		if (timerOff) {
			startTimer();
			timerOff = false;
		}

		toggleCard(clickTarget);
		addToggleCard(clickTarget);
		

		if (toggledCards.length === 2) {

			if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
				toggleMatch(toggledCards);
				incrementMatchedPairs();
				checkForWin();
			}
			else {
				setTimeout(toggleIncorrectCards, 700, toggledCards);
			}

			//resets the toggled cards array
			toggledCards = [];
			incrementMoves();
			checkStars(); //fix this
		};
	};
});

//event listener for modal cancel button. designed to just clear the modal
document.querySelector(".modal_cancel").addEventListener('click', () => {
	toggleModal();
});


//event listener for modal replay button
document.querySelector(".modal_replay").addEventListener('click', () => {
	resetGame();
});


//function that makes sure that what was clicked on was a valid card, not the same card, and an unopened card
function isClickValid(clickTarget) {
	return( clickTarget.classList.contains('card') && 
		toggledCards.length < 2 && 
		!clickTarget.classList.contains('match') && 
		!clickTarget.classList.contains('open') && 
		!clickTarget.classList.contains('show') &&
		!toggledCards.includes(clickTarget)
		);
}


//function that checks if the stars list needs to be updated
function checkStars() {
   

	if (movesCounter === 16) {
		
		starCounter --;
	} else if (movesCounter === 26) {
		stars.innerHTML = "<li><i class='fa fa-star'</i></li>";
		starCounter --;
	} else if (movesCounter === 36) {
		stars.innerHTML = "";
		starCounter --;
	}

}

//increases move counter after the user clicks on a pair of cards
function incrementMoves() {
	movesCounter++;
	moves.innerHTML = movesCounter;

}

//increases matchedPairs counter
function incrementMatchedPairs() {
	matchedPairs ++;
}

//toggles the css to open or close a card.
function toggleCard(clickTarget) {
	clickTarget.classList.toggle('open')
	clickTarget.classList.toggle('show')
}

//if a match is found between a pair
function toggleMatch(toggledCards)
{
	toggledCards.forEach( function(element) {

		element.classList.toggle('open')
		element.classList.toggle('show')
		element.classList.toggle('match')
	} );
}


//if a pair doesnt match this function turns both cards back over
function toggleIncorrectCards(toggledCards)
{
	toggledCards.forEach(function(element) {
			element.classList.toggle('open')
			element.classList.toggle('show')	
	}
	);
}

//if a card is opened it adds it to the toggledCards array.
function addToggleCard(clickTarget)  {
	toggledCards.push(clickTarget);
}

//increases moves counter by 1
function incrementMovesCounter() {
	moves ++;
}

//starts the timer on the game
function startTimer() {
	clockId = setInterval(function () {
		time++
		displayTimer();
	}, 1000);
}

//updates the timer on the DOM each second
function displayTimer() {

	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	if (seconds < 10) {
	clock.innerHTML = `${minutes}:0${seconds}`;
} else {
	clock.innerHTML = `${minutes}:${seconds}`;
}
}

//checks for win each time a pair is clicked
function checkForWin () {

if ((cards.length / 2) === matchedPairs) {
	clearInterval(clockId);
	toggleModal();
	displayScore();
	}
}


//turns modal on and off
function toggleModal() {

	const modal = document.querySelector('.modal_background');
	modal.classList.toggle('hide');
}


//displays score and blocks out game with modal
function displayScore() {

	modalTime.innerHTML = `Time: ${clock.innerHTML}`;
	modalStars.innerHTML = `Stars: ${starCounter}`;
	modalMoves.innerHTML = `Moves: ${moves.innerHTML}`;

}


//resets game
function resetGame() {
	location.reload();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//generates the card html text that will be added into the deck html
function generateCard(card) {
	return `<li class="card"><i class="fa ${card}"></i></li>`;
}


//when a game is started this function loads the cards on the deck
function startGame() {

	shuffle(cards);

	var cardHTML = cards.map(function(card) {
		return generateCard(card);
	});
	deck.innerHTML += cardHTML.join('');
}

//loads the game
startGame();
