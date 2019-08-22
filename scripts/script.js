// Define the guess the word app object (gtwApp)
const gtwApp = {};
const $secretWord = $('.secretWord');
const $alphaKeys = $('.alphaKeys');

// Create a secret word array. The array will hold objects (in preparation for the stretch goals)
gtwApp.secretWordArrayOfObjects = [
    {
        word: "javascript",
        hint: "This language is a bit weird"
    },
    {
        word: "jquery",
        hint: "A JavaScript library designed to simplify HTML DOM tree traversal and manipulation"
    },
    {
        word: "viewport",
        hint: "User's visible area of the page"
    },
    {
        word: "accessibility",
        hint: "WCAG, AA, AAA"
    },
    {
        word: "git push",
        hint: "Bring your code to the repository"
    }
]

// Function to get a random index from the secretWordArrayOfObjects array
gtwApp.randomIndex = () => {
    return Math.floor(Math.random() * gtwApp.secretWordArrayOfObjects.length)
}

// Function to get a word from the array based on the random index
gtwApp.getRandomWord = (arr, index) => {
    return arr[index].word;
}

// Get the word hint from the array based on the random index
gtwApp.getWordHint = (arr, index) => {
    return arr[index].hint;
}

// Function that will display the hint in the page
gtwApp.displayHint = (str) => {
    $('.hint').text(`${str}`);
}

gtwApp.generateGuessBoxes = (word) => {
    const wordLetterArray = word.split('');

    // Loop through the array
    wordLetterArray.forEach((arrayElement, index) => {
        // create new div for each letter and display the letter position. index + 1 because user does not understand js index starts with 0.
        $secretWord.append(`<div class="secretLetter secretLetter${index}">${index+1}</div>`);
        
        // Add space styling if space exists (gray background)
        if (wordLetterArray[index] === " " ){
            $(`.secretLetter${index}`).addClass("space");
        }
    });
}

// This function will render the secret word in the UI
gtwApp.renderGuessWord = (arr) => {
    // Get the random index
    const randomIndex = gtwApp.randomIndex(arr);

    // Get the random word
    // const randomWord = gtwApp.getRandomWord(arr, randomIndex);
    gtwApp.randomWord = gtwApp.getRandomWord(arr, randomIndex);

    // Get the hint of the random word
    const wordHint = gtwApp.getWordHint(arr, randomIndex);

    // Display the hint
    gtwApp.displayHint(wordHint);

    // Display the guess boxes
    // gtwApp.generateGuessBoxes(randomWord);
    gtwApp.generateGuessBoxes(gtwApp.randomWord);
}

// Render the Letter keys
gtwApp.renderAlphaKeys = () => {
    const alphabetArray = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

    alphabetArray.forEach((arrayElement, index) => {
        $alphaKeys.append(`<button type="button" class="letter letter${arrayElement}">${arrayElement}</button>`);
    });
}

// Listen to button click event
gtwApp.guessLetter = () => {
    $('.letter').on('click', function() {
        const guess = $(this).text().toLowerCase();

        // We can use the gtwApp.randomWord property here. Split the word to create an array of letters.
        const wordLetterArray = gtwApp.randomWord.split('');
        console.log(wordLetterArray);
        // Loop through the wordLetterArray and check if the clicked letter matches any letter in that array
        wordLetterArray.forEach((letter, index) => {
            if (guess === letter) {
                console.log(guess, letter, index);
                let letterIndex = `.secretLetter${index}`;
                // let divElement = `<div class="secretLetter secretLetter${index}">${letter}</div>`
                // $(letterIndex).html(divElement);

                $(letterIndex).text(`${letter.toUpperCase()}`).addClass('correctGuess');
            }
        });
    });
}

// Create gtwApp init function that will call the functions needed for the app
gtwApp.init = () => {
    gtwApp.renderGuessWord(gtwApp.secretWordArrayOfObjects);
    gtwApp.renderAlphaKeys();
    gtwApp.guessLetter();
}

$(function() {
    // Initialize gtwApp
    gtwApp.init();
})
