document.querySelector('#questionMulti').addEventListener('submit', e => {
    e.preventDefault()
})

document.querySelector('#questionTF').addEventListener('submit', e => {
    e.preventDefault()
})

document.querySelector('#questionSkip').addEventListener('click', questionGetter)

let questionArr = []
function questionGetter(amount = 10) {
    fetch('https://opentdb.com/api.php?amount=10')
    .then(resp => resp.json())
    .then(obj => {questionArr = obj.results})
}