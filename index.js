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
            debugger
            console.log('siblings of the current button: ', btn.parentNode.childNodes)
            console.log('selected: ', btn.parentNode.children[0].innerText, 'answer: ', qCorrect )
            
            document.getElementById('submitMulti').classList.remove('d-block')
            document.getElementById('submitMulti').classList.add('d-none')
            if (btn.parentNode.children[0].innerText === qCorrect) {
                return correctAnswer()
            }
            else {
                return wrongAnswer()
            }
        }
    }
    return errorMessage()
})

document.querySelector('#questionTF').addEventListener('submit', e => {
    e.preventDefault()
    if (radioT.checked) {
        document.getElementById('submitTF').classList.remove('d-block')
        document.getElementById('submitTF').classList.add('d-none')
        if (boolT.innerText === qCorrect) {
            correctAnswer()
        }
        else {
            wrongAnswer()
        }
    }   
    else if (radioF.checked) {
        document.getElementById('submitTF').classList.remove('d-block')
        document.getElementById('submitTF').classList.add('d-none')
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
    document.getElementById('nextQuestion').classList.remove('d-block')
    document.getElementById('nextQuestion').classList.add('d-none')
    document.getElementById('deleteMe').remove()
    quizGiver()
})
//Get Results button, replaces next question button at end
document.getElementById('getResults').addEventListener('click', e => {
    document.getElementById('getResults').classList.remove('d-block')
    document.getElementById('getResults').classList.add('d-none')
    document.getElementById('deleteMe').remove()
    quizGiver()
})
//initializing variables to track questions and associated data out of function scopes
let questionArr, questionRem, questionTot, qCorrect, qScore

//This function gets the questions from the API, no addl params for now
//this promise took too long to resolve without async functionality to hand to quizGiver
async function questionGetter(amount = 10) {
    await fetch('https://opentdb.com/api.php?amount=10')
    .then(resp => resp.json())
    .then(obj => {questionArr = obj.results})
    //this will be 10 for now, to avoid an event error later
    questionRem = 10
    questionTot = 10
    qScore = 0
    quizGiver()
}

//This function will map an array question item onto the buttons
function quizGiver(questions = 10) {
    formBool.reset()
    formMulti.reset()
    if (questionRem > 0) {
        document.getElementById('currentQuestion').classList.remove('d-none')
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

            formMulti.classList.remove('d-none')
            formBool.classList.add('d-none')
            //bootstrap CSS causes problems if both d-tags are left on
            document.getElementById('submitMulti').classList.add('d-block')
            document.getElementById('submitMulti').classList.remove('d-none')
        }
        else if (q.type === 'boolean') {
            formMulti.classList.add('d-none')
            formBool.classList.remove('d-none')

            document.getElementById('submitTF').classList.add('d-block')
            document.getElementById('submitTF').classList.remove('d-none')
        }
        document.querySelector('#numQuestion').innerText = `Trivia Question ${questionTot-questionRem+1} of ${questionTot}`
        //reducing question remainder upon exiting question creation
        questionRem--
        return
    }
    //hiding quiz elements after getting results
    formBool.classList.add('d-none')
    formMulti.classList.add('d-none')
    document.getElementById('currentQuestion').classList.add('d-none')

    if (qScore === questionTot) {
        document.querySelector('#numQuestion').innerText = `You got a perfect score! Awesome!`
    }
    else if (qScore/questions >= 0.7) {
        document.querySelector('#numQuestion').innerText = `You got a total of ${qScore} out of ${questionTot}!`
    }
    else {
        document.querySelector('#numQuestion').innerText = `You got a total of ${qScore} out of ${questionTot}.`
    }
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
function correctAnswer() {
    qScore++
    const congrats = document.createElement('p')
    congrats.innerText = 'CORRECT!!!'
    congrats.style.color = 'green'
    congrats.id = 'deleteMe'
    congrats.classList.add('d-block', 'w-25', 'text-center', 'm-auto')
    document.querySelector('#answerMessage').appendChild(congrats)
    endQButton()
}
function wrongAnswer() {
    const wahwah = document.createElement('p')
    wahwah.innerText = 'Sorry, not quite.'
    wahwah.style.color = 'red'
    wahwah.id = 'deleteMe'
    wahwah.classList.add('d-block', 'w-25', 'text-center', 'm-auto')
    document.querySelector('#answerMessage').appendChild(wahwah)
    endQButton()
}
//error message, probably only goes off in case nothing's selected... for now
function errorMessage() {
    alert("Did you forget to select an answer?")
}

//Function to handle what button should be displayed after a question
function endQButton() {
    if (questionRem > 0) {
        document.getElementById('nextQuestion').classList.add('d-block')
        document.getElementById('nextQuestion').classList.remove('d-none')
        return
    }
    document.getElementById('getResults').classList.add('d-block')
    document.getElementById('getResults').classList.remove('d-none')
}