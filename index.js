//grabbing elements for later use
const multiA = document.getElementById('optionA')
const multiB = document.getElementById('optionB')
const multiC = document.getElementById('optionC')
const multiD = document.getElementById('optionD')

const radioA = document.getElementById('radioA')
const radioB = document.getElementById('radioB')
const radioC = document.getElementById('radioC')
const radioD = document.getElementById('radioD')

const boolT = document.getElementById('optionT')
const boolF = document.getElementById('optionF')

const radioT = document.getElementById('radioT')
const radioF = document.getElementById('radioF')

const formMulti = document.getElementById('questionMulti')
const formBool = document.getElementById('questionTF')

//upon multiple choice submission, checks radio buttons one by one and checks the active one against the correct answer to give a result
document.querySelector('#questionMulti').addEventListener('submit', e => {
    e.preventDefault()
    const radioButtons = document.querySelectorAll('input[name="radioMulti"]')
    console.log('radio button collection: ', radioButtons)
    for (const btn of radioButtons) {
        console.log('current radio button: ', btn, btn.checked)
        if (btn.checked) {
            document.getElementById('submitMulti').classList.add('hidden')
            debugger
            console.log('siblings of the current button: ', btn.parentNode.childNodes)
            console.log('selected: ', btn.parentNode.children[0].innerText, 'answer: ', qCorrect )
            if (btn.parentNode.children[0].innerText === qCorrect) {
                return correctAnswer()
            }
            else {
                return wrongAnswer()
            }
        }
    }
    return errorMessage()
    // if (radioA.checked === 'true') {
    //     if (multiA.innerText === qCorrect) {
    //         correctAnswer()
    //     }
    //     else {
    //         wrongAnswer()
    //     }
    // }
    // else if (radioB.checked === 'true') {
    //     if (multiB.innerText === qCorrect) {
    //         correctAnswer()
    //     }
    //     else {
    //         wrongAnswer()
    //     }
    // }
    // else if (radioC.checked === 'true') {
    //     if (multiC.innerText === qCorrect) {
    //         correctAnswer()
    //     }
    //     else {
    //         wrongAnswer()
    //     }
    // }   
    // else if (radioD.checked === 'true') {
    //     if (multiD.innerText === qCorrect) {
    //         correctAnswer()
    //     }
    //     else {
    //         wrongAnswer()
    //     }
    // }
    // else {
    //     errorMessage()
    // }
})

document.querySelector('#questionTF').addEventListener('submit', e => {
    e.preventDefault()
    if (radioT.checked === 'true') {
        document.querySelector('#submitTF').classList.add('hidden')

        if (boolT.innerText === qCorrect) {
            correctAnswer()
        }
        else {
            wrongAnswer()
        }
    }   
    else if (radioF.checked === 'true') {
        document.querySelector('#submitTF').classList.add('hidden')

        if (boolF.innerText === qCorrect) {
            correctAnswer()
        }
        else {
            wrongAnswer()
        }
    }
    else {
        errorMessage()
    }
})

//TESTING button, will serve as quick-start for user
document.querySelector('#questionSkip').addEventListener('click', questionGetter)

//Next question button
document.getElementById('nextQuestion').addEventListener('click', e => {
    document.getElementById('nextQuestion').classList.add('hidden')
    document.getElementById('deleteMe').remove()
    quizGiver()
})
//initializing variable to track questions and remaining questions outside of function scopes
let questionArr, questionRem, qCorrect

//This function gets the questions from the API, no addl params for now
//this promise took too long to resolve without async functionality to hand to quizGiver
async function questionGetter(amount = 10) {
    await fetch('https://opentdb.com/api.php?amount=10')
    .then(resp => resp.json())
    .then(obj => {questionArr = obj.results})
    //this will be 10 for now, to avoid an event error later
    questionRem = 10
    quizGiver()
}

//This function will map an array question item onto the buttons
function quizGiver(questions = 10) {
    if (questionRem >= 0) {
        console.log(questionArr)
        let q = questionArr[questionRem-1]
        //getting the right answer out of the scope and setting the new question
        qCorrect = decodeHTML(q.correct_answer)
        document.getElementById('currentQuestion').innerText = decodeHTML(q.question)
        if (q.type === 'multiple') {
            const mixedArray = questionShuffle(q)
            multiA.innerText = decodeHTML(mixedArray[0])
            multiB.innerText = decodeHTML(mixedArray[1])
            multiC.innerText = decodeHTML(mixedArray[2])
            multiD.innerText = decodeHTML(mixedArray[3])

            formMulti.classList.remove('hidden')
            formBool.classList.add('hidden')

            document.getElementById('submitMulti').classList.remove('hidden')
        }
        else if (q.type === 'boolean') {
            formMulti.classList.add('hidden')
            formBool.classList.remove('hidden')

            document.getElementById('submitTF').classList.remove('hidden')
        }
    }
    //reducing question remainder upon exiting question creation
    questionRem--
}

//method i found on stackoverflow to shuffle array entries with each other
function questionShuffle(questionObject) {
    const newQArray = [questionObject.correct_answer, ...questionObject.incorrect_answers]
    // forgot i needed to destructure the first time lol^
    let currentIndex = newQArray.length, randomIndex
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [newQArray[currentIndex], newQArray[randomIndex]] = [newQArray[randomIndex], newQArray[currentIndex]]
    }
    return newQArray
}

//piece of code i found on stackoverflow to decode html from the API
function decodeHTML(string) {
    const text = document.createElement('textarea')
    text.innerHTML = string
    return text.value
}
//set of functions to handle correct/incorrect answer and move on to the next question
async function correctAnswer(source) {
    console.log('Correct Answer')
    const congrats = document.createElement('span')
    congrats.innerText = 'CORRECT!!!'
    congrats.style.color = 'green'
    congrats.id = 'deleteMe'
    console.log(congrats)
    document.querySelector('#answerMessage').append(congrats)
    document.getElementById('nextQuestion').classList.remove('hidden')
}
async function wrongAnswer() {
    console.log('Wrong Answer')
    const wahwah = document.createElement('span')
    wahwah.innerText = 'Wrong Answer'
    wahwah.style.color = 'red'
    wahwah.id = 'deleteMe'
    console.log(wahwah)
    document.querySelector('#answerMessage').appendChild(wahwah)
    document.getElementById('nextQuestion').classList.remove('hidden')
}
//error message, probably only goes off in case nothing's selected... for now
function errorMessage() {
    alert("Did you forget to select an answer?")
}