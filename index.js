//grabbing elements for later use
const multiA = document.getElementById('optionA')
const multiB = document.getElementById('optionB')
const multiC = document.getElementById('optionC')
const multiD = document.getElementById('optionD')

const formMulti = document.getElementById('questionMulti')
const formBool = document.getElementById('questionTF')

const qCat = document.getElementById('category')
const qDiff = document.getElementById('difficulty')
const qType = document.getElementById('qType')
const qNum = document.getElementById('numQuestions')

//initializing variables to track questions and associated data out of function scopes
let questionArr, questionRem, questionTot, qCorrect, qScore

//Upon page loading, we will populate the categories field in the form using a special API request
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://opentdb.com/api_category.php')
    .then(resp => resp.json())
    .then(list => {
        for (const category of list.trivia_categories) {
            let newCat = document.createElement('option')
            newCat.textContent = category.name
            newCat.value = category.id
            qCat.appendChild(newCat)
        }
    })
})

//TESTING button, will serve as quick-start for user
document.querySelector('#questionSkip').addEventListener('click', () => questionGetter())
//Full submit form conversion to request URL for API
document.querySelector('#quizmaker').addEventListener('submit', event => {
    event.preventDefault()
    debugger
    let urlString = ''
    urlString += 'amount=' + qNum.value
    questionRem = parseInt(qNum.value) 
    questionTot = parseInt(qNum.value)

    urlString += '&category=' + qCat.value
    urlString += '&difficulty=' + qDiff.value
    urlString += '&type=' + qType.value
    questionGetter(urlString)
})

//this promise took too long to resolve without async functionality to hand to quizGiver
async function questionGetter(urlString = 'amount=10') {
    // console.log(urlString)
    await fetch(`https://opentdb.com/api.php?${urlString}`)
    .then(resp => resp.json())
    .then(obj => {
        if (obj.response_code === 1) {
            return alert('Not enough questions found, try choosing less questions.')
        }
        questionArr = obj.results})
    qScore = 0
    //this section will work with the quick-start feature
    if (urlString === 'amount=10') {
        questionRem = 10
        questionTot = 10
    }
    document.querySelector('header').classList.toggle('d-none')
    quizGiver()
}

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


//This function will map an array question item onto the buttons
function quizGiver() {
    formBool.reset()
    formMulti.reset()
    if (questionRem > 0) {
        document.getElementById('currentQuestion').classList.remove('d-none')
        // console.log(questionArr)
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
    //different messages for score thresholds
    if (qScore === questionTot) {
        document.querySelector('#numQuestion').innerText = `You got a perfect score! Awesome!`
    }
    else if (qScore/questionTot >= 0.7) {
        document.querySelector('#numQuestion').innerText = `You got a total of ${qScore} out of ${questionTot}!`
    }
    else {
        document.querySelector('#numQuestion').innerText = `You got a total of ${qScore} out of ${questionTot}.`
    }
    document.querySelector('header').classList.toggle('d-none')
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

//upon multiple choice submission, checks radio buttons one by one and checks the active one against the correct answer to give a result
document.querySelector('#questionMulti').addEventListener('submit', e => {
    e.preventDefault()
    const radioButtons = document.querySelectorAll('input[name="radioMulti"]')

    for (const btn of radioButtons) {
        if (btn.checked) {
            //upon finding a checked button, the submit button will disappear to prevent glitches
            document.getElementById('submitMulti').classList.remove('d-block')
            document.getElementById('submitMulti').classList.add('d-none')
            if (btn.parentNode.children[0].innerText === qCorrect) {
                //upon correct answer confirmation, the selection will flash green for a second
                btn.parentNode.classList.remove('nice-yellow')
                btn.parentNode.classList.add('green-correct')
                setTimeout(() => {
                    btn.parentNode.classList.remove('green-correct')
                    btn.parentNode.classList.add('nice-yellow')
                }, 1000)
                return correctAnswer()
            }
            else {
                //upon incorrect answer, the selection will flash red for a second
                btn.parentNode.classList.remove('nice-yellow')
                btn.parentNode.classList.add('red-incorrect')
                setTimeout(() => {
                    btn.parentNode.classList.remove('red-incorrect')
                    btn.parentNode.classList.add('nice-yellow')
                }, 1000)
                return wrongAnswer()
            }
        }
    }
    //should trigger this return if no button was selected
    return errorMessage()
})
//listener for corresponding True/False question submission, same method as Multi
document.querySelector('#questionTF').addEventListener('submit', e => {
    e.preventDefault()
    const radioButtons = document.querySelectorAll('input[name="radioTF"]')

    for (const btn of radioButtons) {
        if (btn.checked) {            
            document.getElementById('submitTF').classList.remove('d-block')
            document.getElementById('submitTF').classList.add('d-none')
            if (btn.parentNode.children[0].innerText === qCorrect) {
                btn.parentNode.classList.remove('nice-yellow')
                btn.parentNode.classList.add('green-correct')
                setTimeout(() => {
                    btn.parentNode.classList.remove('green-correct')
                    btn.parentNode.classList.add('nice-yellow')
                }, 1000)
                return correctAnswer()
            }
            else {
                btn.parentNode.classList.remove('nice-yellow')
                btn.parentNode.classList.add('red-incorrect')
                setTimeout(() => {
                    btn.parentNode.classList.remove('red-incorrect')
                    btn.parentNode.classList.add('nice-yellow')
                }, 1000)
                return wrongAnswer()
            }
        }
    }
    return errorMessage()
})

//set of functions to handle correct/incorrect answer and move on to the next question
function correctAnswer() {
    qScore++
    const congrats = document.createElement('div')
    congrats.innerText = 'CORRECT!!!'
    congrats.id = 'deleteMe'
    congrats.classList.add('d-block', 'w-25', 'text-center', 'm-auto', 'green-correct')
    document.querySelector('#answerMessage').appendChild(congrats)
    endQButton()
}
function wrongAnswer() {
    const wahwah = document.createElement('div')
    wahwah.innerText = 'Sorry, not quite.'
    wahwah.id = 'deleteMe'
    wahwah.classList.add('d-block', 'w-25', 'text-center', 'm-auto', 'red-incorrect')
    document.querySelector('#answerMessage').appendChild(wahwah)
    endQButton()
}
//error message, probably only goes off in case nothing's selected... for now
function errorMessage() {
    alert("Did you forget to select an answer?")
}
