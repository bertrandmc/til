// Given a string of numbers and a value, print all possible simple mathematical equations (+, -, *, /) 
// that evaluate to value. 

// V1

function validEquations(string, value) {
    const numbers = string.split(',')
    const operations = ['+', '-', '*', '/']
    const equations = equationsList(numbers, operations)
    return equations.filter(equation => eval(equation) === value)
}

function equationsList(numbers, operations, index = 0) {
    const numbersLastIndex = numbers.length - 1
    const nextIndex = index + 1

    if (nextIndex > numbersLastIndex) {
        return [numbers[numbersLastIndex]]
    }
    
    return operations.reduce((acc, operation) => (
        [
            ...acc,
            ...equationsList(numbers, operations, nextIndex).map(val =>
                `${numbers[index]}${operation}${val}`
            )
        ]
    ), [])
}

console.log(validEquations('1,2,3', 6)) // [ '1+2+3', '1*2*3' ]
console.log(validEquations('1,1,2,2,0', 6)) // [ '1+1+2+2+0', '1+1+2+2-0', '1+1+2*2+0', '1+1+2*2-0' ]


