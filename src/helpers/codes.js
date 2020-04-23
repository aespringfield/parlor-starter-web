const LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

const generateDigits = () => {
    let timeString = Date.now().toString()
    return timeString
        .slice(-5, timeString.length)
        .split('')
        .map((str) => parseInt(str, 10))
}

const generateLetters = (possLetters, result=[]) => {
    const i = Math.floor(Math.random() * possLetters.length)
    result.push(possLetters[i]);
    if(result.length === 10) {
        return result
    } else {
        return generateLetters(possLetters.slice(0, i).concat(possLetters.slice(i + 1, possLetters.length)), result)
    }
}

export const generateCode = () => {
    return generateDigits().reduce((acc, int) => {
        return `${acc}${generateLetters(LETTERS)[int]}`},'')
}

console.log(generateCode())