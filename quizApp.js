import { htmlQuestions, cssQuestions, javaScriptQuestions, reactQuestions } from './data.js';
import { showSubmitError, questionContentHandler, SubmitError } from './utilities.js';
export { questionsStorage, showResults };

const startTestDivElement = document.querySelector('#start-test-block');
const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');
const totalQuestionsTitle = document.querySelector('#total-test-questions-title');
const currentQuestionTitle = document.querySelector('#current-question-title');

const htmlTestButton = document.querySelector('#html-test-button');
const cssTestButton = document.querySelector('#css-test-button');
const javaScriptTestButton = document.querySelector('#javaScript-test-button');
const reactTestButton = document.querySelector('#react-test-button');

const questionsFormElement = document.querySelector('#questions-form');
const answerLiElements = document.querySelectorAll('.answer');
const answerInputs = document.querySelectorAll('.answer_input');
const correctAnswerIcons = document.querySelectorAll('[class ="fa-regular fa-circle-check"]');
const incorrectAnswerIcons = document.querySelectorAll('[class = "fa-regular fa-circle-xmark"]');

const submitAnswerButton = document.querySelector('#submit-answer-button');
const nextQuestionButton = document.querySelector('#next-question-button');
const returnToStartButton = document.querySelector('#return-to-start-button');

const testResultsDivElement = document.querySelector('#test-results-block');
const resultsTitle = document.querySelector('#results-title');
const resultsCommentary = document.querySelector('#results-commentary');

let questionsStorage;
let totalQuestionsValue;
const checkboxQuestions = [];
const answersResults = [];
const questionState = questionStateHandler(0, totalQuestionsValue);

const testStarter = {
    startHtmlTest() {
        questionsStorage = htmlQuestions;
        totalQuestionsTitle.innerHTML = '6';
        totalQuestionsValue = 6;
        checkboxQuestions.push(3, 4);
        questionsSlider();
    },

    startCssTest() {
        questionsStorage = cssQuestions;
        totalQuestionsTitle.innerHTML = '10';
        totalQuestionsValue = 10;
        checkboxQuestions.push(4, 8);
        questionsSlider();
    },

    startJavaScriptTest() {
        questionsStorage = javaScriptQuestions;
        totalQuestionsTitle.innerHTML = '15';
        totalQuestionsValue = 15;
        checkboxQuestions.push(1, 7, 14);
        questionsSlider();
    },

    startReactTest() {
        questionsStorage = reactQuestions;
        totalQuestionsTitle.innerHTML = '10';
        totalQuestionsValue = 10;
        checkboxQuestions.push(2, 4, 8);
        questionsSlider();
    },
};

const interfaceStateHandler = {
    startTest() {
        startTestDivElement.style.display = 'none';
        headerElement.style.display = 'flex';
        footerElement.style.display = 'flex';
        questionsFormElement.style.display = 'flex';
        currentQuestionTitle.innerHTML = '1';
    },

    endTest() {
        testResultsDivElement.style.display = 'flex';
        headerElement.style.display = 'none';
        footerElement.style.display = 'none';
        questionsFormElement.style.display = 'none';
    },

    freeze() {
        nextQuestionButton.disabled = false;
        submitAnswerButton.disabled = true;
        answerInputs.forEach(answerInput => (answerInput.disabled = true));
    },

    unfreeze() {
        submitAnswerButton.disabled = false;
        answerInputs.forEach(answerInput => {
            answerInput.disabled = false;
            answerInput.checked = false;
        });
    },

    resetTest() {
        startTestDivElement.style.display = 'flex';
        testResultsDivElement.style.display = 'none';
        resultsTitle.innerHTML = '';
        resultsCommentary.innerHTML = '';
        totalQuestionsTitle.innerHTML = '';

        questionsStorage = null;
        totalQuestionsValue = null;
        answersResults.length = 0;
        checkboxQuestions.length = 0;
    },
};

function questionStateHandler(initialQuestion) {
    let currentQuestion = initialQuestion;

    return {
        increaseQuestionNumber() {
            currentQuestion === totalQuestionsValue ? (currentQuestion = totalQuestionsValue) : currentQuestion++;

            answerLiElements.forEach(answerLiElement => {
                answerLiElement.classList.remove('correct', 'incorrect', 'unselected_correct')
            });
            correctAnswerIcons.forEach(correctAnswerIcon => (correctAnswerIcon.style.display = 'none'));
            incorrectAnswerIcons.forEach(incorrectAnswerIcon => (incorrectAnswerIcon.style.display = 'none'));
            currentQuestionTitle.innerHTML = currentQuestion + 1;

            interfaceStateHandler.unfreeze();
        },

        getQuestionNumber() {
            return currentQuestion;
        },

        resetQuestions() {
            currentQuestion = 0;
        },
    };
}

function questionTypeHandler() {
    answerInputs.forEach(answerInput => {
        if (checkboxQuestions.includes(questionState.getQuestionNumber())) {
            answerInput.type = 'checkbox';
            answerInput.name = 'checkbox';
        } else {
            answerInput.type = 'radio';
            answerInput.name = 'radio';
        }
    });
}

function questionsSlider() {
    questionContentHandler(questionState.getQuestionNumber(), totalQuestionsValue);
    questionTypeHandler();
    nextQuestionButton.disabled = true;
}

function radioInputsHandler(correctAnswer) {
    let selectedAnswer = null;
    answerInputs.forEach(answerInput => {
        answerInput.checked ? (selectedAnswer = answerInput.value) : selectedAnswer;
    });

    if (selectedAnswer === null) {
        throw new Error();
    } else if (selectedAnswer === correctAnswer) {
        answersResults.push(true);

        answerLiElements[selectedAnswer - 1].classList.add('correct');
        correctAnswerIcons[correctAnswer - 1].style.display = 'initial';
    } else {
        answersResults.push(false);

        answerLiElements[selectedAnswer - 1].classList.add('incorrect');
        answerLiElements[correctAnswer - 1].classList.add('correct');
        incorrectAnswerIcons[selectedAnswer - 1].style.display = 'initial';
        correctAnswerIcons[correctAnswer - 1].style.display = 'initial';
    }
}

function checkboxInputsHandler(correctAnswers) {
    const selectedAnswersStorage = [];
    const selectedCheckboxes = document.querySelectorAll('input[name="checkbox"]:checked');
    selectedCheckboxes.forEach(checkboxAnswer => selectedAnswersStorage.push(checkboxAnswer.value));

    if (selectedAnswersStorage.length === 0) {
        throw new Error();
    } else if (selectedAnswersStorage.join('') === correctAnswers.join('')) {
        answersResults.push(true);

        for (let i = 0; i < selectedAnswersStorage.length; i++) {
            answerLiElements[selectedAnswersStorage[i] - 1].classList.add('correct');
            correctAnswerIcons[selectedAnswersStorage[i] - 1].style.display = 'initial';
        }
    } else {
        answersResults.push(false);

        const selectedIncorrectAnswers = selectedAnswersStorage.filter(
            selectedAnswer => !correctAnswers.includes(Number(selectedAnswer))
        );

        if (selectedIncorrectAnswers.length !== 0) {
            selectedIncorrectAnswers.forEach(selectedIncorrectAnswer => {
                answerLiElements[selectedIncorrectAnswer - 1].classList.add('incorrect');
                incorrectAnswerIcons[selectedIncorrectAnswer - 1].style.display = 'initial';
            });
        }

        correctAnswers.forEach(correctAnswer => {
            switch (selectedAnswersStorage.includes(correctAnswer.toString())) {
                case true:
                    answerLiElements[correctAnswer - 1].classList.add('correct');
                    correctAnswerIcons[correctAnswer - 1].style.display = 'initial';
                    break;
                case false:
                    answerLiElements[correctAnswer - 1].classList.add('unselected_correct');
                    correctAnswerIcons[correctAnswer - 1].style.display = 'initial';
                    break;
            }
        });
    }
}

function submitAnswer(questionNumber) {
    const correctAnswer = questionsStorage[questionNumber].correctAnswer;

    new Promise((resolve, reject) => {
        switch (questionsStorage[questionNumber].type) {
            case 'radio':
                try {
                    resolve(radioInputsHandler(correctAnswer));
                } catch {
                    reject(new SubmitError('No answer selected!'));
                }
                break;
            case 'checkbox':
                try {
                    resolve(checkboxInputsHandler(correctAnswer));
                } catch {
                    reject(new SubmitError('No answer selected!'));
                }
                break;
        }
    })
        .then(interfaceStateHandler.freeze)
        .catch(showSubmitError);
}

function showResults() {
    const correctAnswersCounter = answersResults.filter(answer => answer === true).length;
    let commentary;

    if (correctAnswersCounter < Math.floor(totalQuestionsValue / 3)) {
        commentary = 'Of course, it`s not tall, but it`s okay! Everything is ahead!';
    } else if (correctAnswersCounter < Math.floor(totalQuestionsValue / 2)) {
        commentary = `This is a satisfactory result. But don't worry, keep learning!`;
    } else if (correctAnswersCounter <= Math.ceil(totalQuestionsValue / 1.5)) {
        commentary = 'This is a good result! But something else is worth learning. Good luck!';
    } else if (correctAnswersCounter <= totalQuestionsValue) {
        commentary = 'This is a great result! But do not relax, there is no limit to perfection!';
    }

    resultsTitle.innerHTML = `Your result: ${correctAnswersCounter} / ${totalQuestionsValue}.`;
    resultsCommentary.innerHTML = commentary;
    testResultsDivElement.append(resultsTitle, resultsCommentary);

    interfaceStateHandler.endTest();
}

function eventListenersAddition() {
    htmlTestButton.addEventListener('click', () => {
        interfaceStateHandler.startTest();
        testStarter.startHtmlTest();
    });

    cssTestButton.addEventListener('click', () => {
        interfaceStateHandler.startTest();
        testStarter.startCssTest();
    });

    javaScriptTestButton.addEventListener('click', () => {
        interfaceStateHandler.startTest();
        testStarter.startJavaScriptTest();
    });

    reactTestButton.addEventListener('click', () => {
        interfaceStateHandler.startTest();
        testStarter.startReactTest();
    });

    submitAnswerButton.addEventListener('click', () => submitAnswer(questionState.getQuestionNumber()));

    nextQuestionButton.addEventListener('click', () => {
        questionState.increaseQuestionNumber();
        questionsSlider();
    });

    returnToStartButton.addEventListener('click', () => {
        interfaceStateHandler.resetTest();
        questionState.resetQuestions();
    });
}

eventListenersAddition();
