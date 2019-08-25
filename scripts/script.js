// Define the guess the word app object (gtwApp)
const gtwApp = {};

const $secretWord = $('.secretWord');
const $alphaKeys = $('.alphaKeys');
const $gameMain = $('#gameMain');
const $playAgain = $('.replay');
const $result = $('.result');
const $resultContent = $('.result p');
const $emoji = $('.emoji');
const $emojiLi = $('.emoji li');

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
gtwApp.randomIndex = () => {
    return Math.floor(Math.random() * gtwApp.secretWordArrayOfObjects.length)
}

// Function to get a word from the array based on the random index
gtwApp.getRandomWord = (arr, index) => {
    return arr[index].word.toLowerCase();
}

// Get the word hint from the array based on the random index
gtwApp.getWordHint = (arr, index) => {
    return arr[index].hint;
}

// Function that will display the hint in the page
gtwApp.displayHint = (str) => {
    $('.hint').text(`${str}`);
}

// Render the Letter keys
gtwApp.renderAlphaKeys = () => {
    const alphabetArray = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

    alphabetArray.forEach((arrayElement, index) => {
        $alphaKeys.append(`<button aria-label="Press ${arrayElement}" class="letter letter${arrayElement}">${arrayElement}</button>`);
    });
}

// This function will render the secret word in the UI
gtwApp.renderGuessWord = (arr) => {
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
gtwApp.generateGuessBoxes = (word) => {
    const wordLetterArray = word.split('');

    // Loop through the array
    wordLetterArray.forEach((arrayElement, index) => {
        // create new div for each letter and display the letter position. index + 1 because user does not understand js index starts with 0.

        // Add space styling if space exists (gray background)
        if (wordLetterArray[index] === " ") {
            $secretWord.append(`<div class="secretLetter secretLetter${index}"></div>`);
            $(`.secretLetter${index}`).addClass("space");
        } else {
            $secretWord.append(`<div class="secretLetter secretLetter${index}">?</div>`);
        }
    });
}

// Listen to button click event
gtwApp.guessLetter = () => {
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
            $(`.emoji li:nth-child(${gtwApp.wrongAttemptCounter}) i`).attr("class", "fas fa-skull-crossbones").css("color", "#FC4445");;
        }

        // If the wrongAttemptCounter reaches the maximum lives.  If it's equal, display "Game Over!" else, loop through the random array word and check if the guess matches any of the letter.
        if (gtwApp.wrongAttemptCounter === gtwApp.lives) {
            console.log("LOSER!");
            $result.toggleClass('hideMe');
            $resultContent.text('Game over!');
            gtwApp.disableKeyPad();
            $playAgain.toggleClass('pulseReplay');
            $playAgain.focus();
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
                $result.toggleClass('hideMe');
                $resultContent.text('You win!');
                gtwApp.disableKeyPad();
                $playAgain.toggleClass('pulseReplay');
                $playAgain.focus();
            }
        }
    });
}

gtwApp.startGame = function() {
    $(this).toggleClass('playClicked');
    $(this).attr('disabled', 'disabled');
    gtwApp.renderGuessWord(gtwApp.secretWordArrayOfObjects);
    gtwApp.renderAlphaKeys();
    gtwApp.guessLetter();
}

gtwApp.disableKeyPad = () => {
    $('.letter').attr('disabled', 'disabled');
}

// Function to reset counters back to zero
gtwApp.resetCounters = function() {
    gtwApp.wrongAttemptCounter = 0;
    gtwApp.correctGuessCounter = 0;

    console.log("RESET COUNTERS", gtwApp.wrongAttemptCounter, gtwApp.correctGuessCounter);
}

gtwApp.resetEmoji = () => {
    for (let i = 1; i <= gtwApp.lives; i++) {
        $(`.emoji li:nth-child(${i}) i`).attr("class", "far fa-smile").css("color", "lightGreen");
    }
}

// Function to reset the game
gtwApp.resetGame = () => {
    $playAgain.off('click').on('click', function() {
        // Remove the pulseReplay css
        $(this).removeClass('pulseReplay');

        // Reset the result text
        if (gtwApp.wrongAttemptCounter > 0 || gtwApp.correctGuessCounter > 0) {
            $result.addClass('hideMe');
            $resultContent.text('');
        }

        // Reset all counters
        gtwApp.resetCounters();
        gtwApp.resetEmoji();
        
        // Remove disabled attribute of the alpha keys
        $('.letter').removeAttr('disabled');

        // Remove generated secret word elements
        $('.secretLetter').remove();
        
        // Render the guess word in the UI
        gtwApp.renderGuessWord(gtwApp.secretWordArrayOfObjects);

        // Start listening on user's guess
        gtwApp.guessLetter();
    });
}

// Function to decode keypresses (using keyup). only allow letters!
gtwApp.decodeKey = () => {
    // Call guessLetter() to start listening.  Click event will be triggered when a key is pressed
    gtwApp.guessLetter();

    $('body').on('keyup', function(e) {
        let letterTyped = String.fromCharCode(e.which).toUpperCase();
        let letterClass = `.letter${letterTyped}`;
        
        // IF the user presses the tab key, do not continue. user should use the tab key moving forward to navigate to letters
        if (e.keyCode === 9) {
            return;
        }

        // Check if the pressed key is within the allowable characters, preventDefault if otherwise.
        if(("abcdefghijklmnopqrstuvwxyz").indexOf(String.fromCharCode(e.keyCode).toLowerCase())===-1){
            e.preventDefault();
        } else {
            // Check if the element already has the disabled attribute.  We should not press the letter again.
            if ($(letterClass).attr('disabled') === undefined) {
                $(letterClass).trigger('click');
            }           
        } 
    });
}

// Create gtwApp init function that will call the functions needed for the app
gtwApp.init = function() {
    // Start the game
    gtwApp.startGame();

    // Listen if user resets the game
    gtwApp.resetGame();

    // Listen if user uses keyboard
    gtwApp.decodeKey();

    $result.toggleClass('hideMe');
}

$(function () {
    // Initialize gtwApp
    gtwApp.init();
})
