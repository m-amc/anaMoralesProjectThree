// Define the guess the word app object (app)
const app = {};

// Element variables
app.$secretWord = $('.secretWord');
app.$alphaKeys = $('.alphaKeys');
app.$playAgain = $('.replay');
app.$result = $('.result');
app.$resultContent = $('.result p.winLose');
app.$answer = $('.result p.answer')
app.$wrongSound = $('#wrongSound');
app.$correctSound = $('#correctSound');
app.$winSound = $('#winSound');
app.$gameOverSound = $('#gameOverSound');

// Create a secret word array. The array will hold objects (in preparation for the stretch goals)
app.secretWordArrayOfObjects = [
    {
        word: "Javascript",
        hint: "A scripting language used in web development"
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
    },
    {
        word: "git diff",
        hint: "A git command used to compare changes"
    },
    {
        word: "Arrow",
        hint: "An ES6 syntax for creating a function"
    }
]

// Create lives variable, wrong and correct counters
app.lives = 5;
app.wrongAttemptCounter = 0;
app.correctGuessCounter = 0;

// Render the Letter keys
app.renderAlphaKeys = () => {
    const alphabetArray = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

    alphabetArray.forEach((arrayElement) => {
        app.$alphaKeys.append(`<button aria-label="Press ${arrayElement}" class="letter letter${arrayElement}">${arrayElement}</button>`);
    });
}

// Function to get a random index from the secretWordArrayOfObjects array
app.randomIndex = () => {
    return Math.floor(Math.random() * app.secretWordArrayOfObjects.length)
}

// Function to get a word from the array based on the random index
app.getRandomWord = (arr, index) => {
    return arr[index].word.toLowerCase();
}

// Get the word hint from the array based on the random index
app.getWordHint = (arr, index) => {
    return arr[index].hint;
}

// Function that will display the hint in the page
app.displayHint = (str) => {
    $('.hint').text(`${str}`);
}

// This function will render the secret word in the UI
app.renderGuessWord = (arr) => {
    // Get the random index
    const randomIndex = app.randomIndex(arr);

    // Get the random word and store this to app.randomWord
    app.randomWord = app.getRandomWord(arr, randomIndex);

    // Get the hint of the random word
    const wordHint = app.getWordHint(arr, randomIndex);

    // Display the hint
    app.displayHint(wordHint);

    // Display the guess boxes
    app.generateGuessBoxes(app.randomWord);
}

// Function to generate secret word boxes
app.generateGuessBoxes = (word) => {
    const wordLetterArray = word.split('');

    // Loop through the array
    wordLetterArray.forEach((arrayElement, index) => {
        // create new div for each letter and display the letter position. index + 1 because user does not understand js index starts with 0.

        // Add space styling if space exists (gray background)
        if (arrayElement === " ") {
            app.$secretWord.append(`
            <div class="card">
                <div class="secretLetter back back${index}"></div>
                <div class="secretLetter front front${index}"></div>
            </div>`);

            $(`.back${index}`).addClass("space");
            $(`.front${index}`).addClass("space");

        } else {
            app.$secretWord.append(`
            <div class="card">
                <div class="secretLetter back back${index}"></div>
                <div class="secretLetter front front${index}"></div>
            </div>`);
        }
    });
}

// Listen to button click event
app.guessLetter = () => {
    let randomWord = app.randomWord;
    let randomWordLetterCount = randomWord.replace(/ /, '').length;

    $('.letter').off('click').on('click', function () {
        const guess = $(this).text().toLowerCase();

        // We can use the app.randomWord property (randomWord variable) here. Split the word to create an array of letters that we can use to loop through later.
        const wordLetterArray = randomWord.split('');

        // Let's check if the guess is incorrect. If it is, increment the wrongAttemptCounter by 1 and keep track of the count
        if (randomWord.indexOf(guess) < 0) {
            app.wrongAttemptCounter += 1;
            $(`.emoji li:nth-child(${app.wrongAttemptCounter}) i`).attr("class", "fas fa-skull-crossbones").css("color", "#FC4445");;

            app.$wrongSound[0].play();
        }

        // Check if the wrongAttemptCounter reaches the maximum lives.  If it's equal, display "Game Over!" else, loop through the random array word and check if the guess matches any of the letter.
        if (app.wrongAttemptCounter === app.lives) {
            app.$result.toggleClass('showResult');
            app.$gameOverSound[0].play();
            app.disableKeyPad();
            app.$resultContent.text('Game over!');
            app.$answer.text(app.randomWord);
            app.$playAgain.toggleClass('pulseReplay');
            app.$playAgain.focus();

        } else {

            $(this).attr('disabled', 'disabled');
            
            // Since we still have lives left, we can loop through the wordLetterArray, check the guess if it matches the array element and if it does, reveal the matching letter in the boxes.
            wordLetterArray.forEach((letter, index) => {
                // We still have to compare guess and letter here since we want to make sure that the letter will be revealed in the correct position.
                if (guess === letter) {
                    let frontIndex = `.front${index}`;
                    let backIndex = `.back${index}`;

                    $(backIndex).addClass('flipBack');
                    $(frontIndex).addClass('flipFront');

                    $(frontIndex).text(`${letter.toUpperCase()}`).addClass('correctGuess');

                    app.correctGuessCounter += 1; 

                    app.$correctSound[0].play();
                }
            });

            // If the correctGuessCount matches the total count of letters (excluding spaces), display Winner!
            if (app.correctGuessCounter === randomWordLetterCount) {
                app.$result.toggleClass('showResult');
                app.$winSound[0].play();
                app.disableKeyPad();
                app.$resultContent.text('You win!');
                app.$answer.text(app.randomWord);

                app.$playAgain.toggleClass('pulseReplay');
                app.$playAgain.focus();
            }
        }
    });
}

app.startGame = function() {
    $(this).toggleClass('playClicked');
    $(this).attr('disabled', 'disabled');
    app.renderGuessWord(app.secretWordArrayOfObjects);
    app.renderAlphaKeys();
    app.guessLetter();
}

app.disableKeyPad = () => {
    $('.letter').attr('disabled', 'disabled');
}

// Function to reset counters back to zero
app.resetCounters = function() {
    app.wrongAttemptCounter = 0;
    app.correctGuessCounter = 0;
}

app.resetEmoji = () => {
    for (let i = 1; i <= app.lives; i++) {
        $(`.emoji li:nth-child(${i}) i`).attr("class", "far fa-smile").css("color", "lightGreen");
    }
}

// Function to reset the game
app.resetGame = () => {
    app.$playAgain.off('click').on('click', function() {
        // Remove the pulseReplay css
        $(this).removeClass('pulseReplay');

        app.$playAgain.blur();

        // Reset the result text
        if (app.wrongAttemptCounter > 0 || app.correctGuessCounter > 0) {
            app.$result.addClass('showResult');
            app.$resultContent.text('');
            app.$answer.text('');
        }

        // Reset all counters
        app.resetCounters();
        app.resetEmoji();
        
        // Remove disabled attribute of the alpha keys
        $('.letter').removeAttr('disabled');

        // Remove generated secret word elements
        $('.secretLetter').remove();
        $('.card').remove();
        
        // Render the guess word in the UI
        app.renderGuessWord(app.secretWordArrayOfObjects);

        // Start listening on user's guess
        app.guessLetter();
    });
}

// Function to decode keypresses (using keyup). only allow letters!
app.decodeKey = () => {
    // Call guessLetter() to start listening.  Click event will be triggered when a key is pressed
    app.guessLetter();

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

// Create app init function that will call the functions needed for the app
app.init = function() {
    // Start the game
    app.startGame();

    // Listen if user resets the game
    app.resetGame();

    // Listen if user uses keyboard
    app.decodeKey();

    app.$result.toggleClass('showResult');
}

$(function () {
    // Initialize app
    app.init();
})
