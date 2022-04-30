import { questionsStorage, showResults } from './quizApp.js';

const questionTitle = document.querySelector('#question-title');
const questionFirstAnswer = document.querySelector('#first-answer-title');
const questionSecondAnswer = document.querySelector('#second-answer-title');
const questionThirdAnswer = document.querySelector('#third-answer-title');
const questionFourthAnswer = document.querySelector('#fourth-answer-title');

class SubmitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SubmitError';
    }
}

function showSubmitError() {
    const errorTitle = document.querySelector('#error-title');

    let errorOpacity = 2;

    errorTitle.style.display = 'initial';
    const timedId = setInterval(() => {
        if (errorOpacity <= 0) {
            clearInterval(timedId);
        }
        errorOpacity -= 0.05;
        errorTitle.style.opacity = errorOpacity;
    }, 100);
}

function questionContentHandler(questionNumber, totalQuestionsValue) {
    if (questionNumber <= totalQuestionsValue - 1) {
        questionTitle.innerHTML = questionsStorage[questionNumber].title;
        questionFirstAnswer.innerHTML = questionsStorage[questionNumber].firstAnswer;
        questionSecondAnswer.innerHTML = questionsStorage[questionNumber].secondAnswer;
        questionThirdAnswer.innerHTML = questionsStorage[questionNumber].thirdAnswer;
        questionFourthAnswer.innerHTML = questionsStorage[questionNumber].fourthAnswer;
    } else if (questionNumber === totalQuestionsValue) {
        showResults();
    }
}

export { showSubmitError, questionContentHandler, SubmitError };
