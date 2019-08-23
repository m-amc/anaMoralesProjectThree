// Define the guess the word app object (gtwApp)
const gtwApp = {};

const $secretWord = $('.secretWord');
const $alphaKeys = $('.alphaKeys');
const $gameMain = $('#gameMain');
const $playNow = $('.playNow');
const $playAgain = $('.replay');
const $result = $('.result p');

// Create a secret word array. The array will hold objects (in preparation for the stretch goals)
gtwApp.secretWordArrayOfObjects = [
    {
        word: "Javascript",
        hint: "This language is a bit weird"
    },
    {
        word: "JQuery",
        hint: "A JavaScript library designed to simplify HTML DOM tree traversal and manipulation"
    },
    {
        word: "Viewport",
        hint: "User's visible area of the page"
    },
    {
        word: "Aria",
        hint: "Set of attributes used to make web accessible"
    },
    {
    word: "git push",
    hint: "Bring your code to the repository"
    },
    {
        word: "Cascading",
        hint: "C in css"
    },
    {
        word: "Regex",
        hint: "An expression that uses / /"
    },
    {
        word: "Callback",
        hint: "A function called in a function"
    }
]

// Create lives variable
gtwApp.lives = 5;

gtwApp.wrongAttemptCounter = 0;
gtwApp.correctGuessCounter = 0;

// Function to get a random index from the secretWordArrayOfObjects array
gtwApp.randomIndex = function() {
    return Math.floor(Math.random() * gtwApp.secretWordArrayOfObjects.length)
}

// Function to get a word from the array based on the random index
gtwApp.getRandomWord = function(arr, index) {
    return arr[index].word.toLowerCase();
}

// Get the word hint from the array based on the random index
gtwApp.getWordHint = function(arr, index) {
    return arr[index].hint;
}

// Function that will display the hint in the page
gtwApp.displayHint = function(str) {
    $('.hint').text(`${str}`);
}

// Render the Letter keys
gtwApp.renderAlphaKeys = function() {
    const alphabetArray = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

    alphabetArray.forEach((arrayElement, index) => {
        $alphaKeys.append(`<button aria-label="Press ${arrayElement}" class="letter letter${arrayElement}">${arrayElement}</button>`);
    });
}

// This function will render the secret word in the UI
gtwApp.renderGuessWord = function(arr) {
    // Get the random index
    const randomIndex = gtwApp.randomIndex(arr);
    console.log('RANDOM INDEX', randomIndex);

    // Get the random word and store this to gtwApp.randomWord
    gtwApp.randomWord = gtwApp.getRandomWord(arr, randomIndex);

    // Get the hint of the random word
    const wordHint = gtwApp.getWordHint(arr, randomIndex);

    // Display the hint
    gtwApp.displayHint(wordHint);

    // Display the guess boxes
    gtwApp.generateGuessBoxes(gtwApp.randomWord);
}

// Function to generate secret word boxes
gtwApp.generateGuessBoxes = function(word) {
    const wordLetterArray = word.split('');

    // Loop through the array
    wordLetterArray.forEach((arrayElement, index) => {
        // create new div for each letter and display the letter position. index + 1 because user does not understand js index starts with 0.
        $secretWord.append(`<div class="secretLetter secretLetter${index}">${index + 1}</div>`);

        // Add space styling if space exists (gray background)
        if (wordLetterArray[index] === " ") {
            $(`.secretLetter${index}`).addClass("space");
        }
    });
}

// Listen to button click event
gtwApp.guessLetter = function() {
    let randomWord = gtwApp.randomWord;
    let randomWordLetterCount = randomWord.replace(/ /, '').length;

    console.log("LOG RANDOM WORD" ,randomWord);
    console.log("=====================================");

    $('.letter').off('click').on('click', function () {
        const guess = $(this).text().toLowerCase();

        // We can use the gtwApp.randomWord property (randomWord variable) here. Split the word to create an array of letters that we can use to loop through later.
        const wordLetterArray = randomWord.split('');
        console.log("WORDLETTERARRAY", wordLetterArray);

        // Let's check if the guess is incorrect. If it is, increment the wrongAttemptCounter by 1 and keep track of the count
        if (randomWord.indexOf(guess) < 0) {
            gtwApp.wrongAttemptCounter += 1;
        }

        // If the wrongAttemptCounter reaches the maximum lives.  If it's equal, display "Game Over!" else, loop through the random array word and check if the guess matches any of the letter.
        if (gtwApp.wrongAttemptCounter === gtwApp.lives) {
            console.log("LOSER!");
            $result.text('Game over!');
        } else {
            $(this).attr('disabled', 'disabled');
            
            // Since we still have lives left, we can loop through the wordLetterArray, check the guess if it matches the array element and if it does, reveal the matching letter in the boxes.
            wordLetterArray.forEach((letter, index) => {
                // We still have to compare guess and letter here since we want to make sure that the letter will be revealed in the correct position.
                if (guess === letter) {
                    let letterIndex = `.secretLetter${index}`;
                    console.log("letterIndex", letterIndex);

                    $(letterIndex).text(`${letter.toUpperCase()}`).addClass('correctGuess');

                    gtwApp.correctGuessCounter += 1; 
                }
            });

            // If the correctGuessCount matches the total count of letters (excluding spaces), display Winner!
            if (gtwApp.correctGuessCounter === randomWordLetterCount) {
                console.log("----WINNER-----");
                $result.text('You win!');
            }
        }
    });
}

gtwApp.startGame = function() {
    $playNow.off('click').on('click', function (e) {
        $gameMain.show();
        $(this).toggleClass('playClicked');
        $(this).attr('disabled', 'disabled');

        $('html, body').animate({
            scrollTop: $gameMain.offset().top
        }, 500);

        gtwApp.renderGuessWord(gtwApp.secretWordArrayOfObjects);
        gtwApp.renderAlphaKeys();
        gtwApp.guessLetter();
    });
}

// Function to reset counters back to zero
gtwApp.resetCounters = function() {
    gtwApp.wrongAttemptCounter = 0;
    gtwApp.correctGuessCounter = 0;

    console.log("RESET COUNTERS", gtwApp.wrongAttemptCounter, gtwApp.correctGuessCounter);
}

// Function to reset the game
gtwApp.resetGame = function() {
    $playAgain.off('click').on('click', function() {
        // Reset all counters
        gtwApp.resetCounters();
        
        // Remove disabled attribute of the alpha keys
        $('.letter').removeAttr('disabled');

        // Remove generated secret word elements
        $('.secretLetter').remove();
        
        gtwApp.renderGuessWord(gtwApp.secretWordArrayOfObjects);

        gtwApp.guessLetter();
    });
}

// Create gtwApp init function that will call the functions needed for the app
gtwApp.init = function() {
    $gameMain.hide();
    gtwApp.startGame();
    gtwApp.resetGame();
}

$(function () {
    // Initialize gtwApp
    gtwApp.init();
})
