// 1. Given a string of numbers, you can interpolate basic 
// operations (+, -, * and /) to create an equation that can be evaluated 
// using simple math. Given a string of numbers and a value, write a 
// method that prints all of the equations that can be generated using 
// that string that evaluate to the given value. f("323",3) will print out "3 * 2 - 3"   

// V1 (slowwww)
// O(n5^n)
function findPossibleEquations(numbersString, target) {
    const operations = ['+', '-', '*', '/']
    const totalNumbers = numbersString.length
    const ans = []

    function calculate(index = 0, prevOperand = 0, accValue = 0, accString = '', prevOperation) {
        let currOperand = Number(numbersString[index])
        
        // break clause
        if (index >= totalNumbers) {
            if (accValue === target) {
                ans.push([accString, accValue]) 
            }
            return
        }

        // NO OP
        // check prevOperand > 0 to avoid cases where we have 1 + 05 or 1 * 05
        if (index > 0 && prevOperand > 0) {
            const noOp = prevOperand * 10 + currOperand

            calculate(
                index + 1, 
                noOp, // prevOperand
                noOp, // accValue
                `${accString}${currOperand}` // accString
            )
        }

        if (index === 0) {
            // no need to process operators
            // assuming we don't care for -
            return calculate(
                index + 1, 
                currOperand, // prevOperand
                currOperand, // accValue
                `${currOperand}` // accString
            )
        }

        operations.forEach(operation => {
            const newAccString = `${accString}${operation}${currOperand}`
            let newValue
            
            switch(operation) {
                case '+':
                    newValue = accValue + currOperand
                    break;        
                case '-':
                    // currOperand will be passed as negative so * and / operations 
                    // can assume prevOperand can be subtracted from accValue
                    // accValue - (-prevOperand) 
                    currOperand = -Math.abs(currOperand)
                    newValue = accValue - currOperand
                    break;
                case '*':
                    // undo previous and apply precedence 
                    newValue = accValue - prevOperand + (prevOperand * currOperand)
                    break;
                case '/':
                    // undo previous and apply precedence 
                    newValue = accValue - prevOperand + (prevOperand / currOperand)
                    break;
            }

            calculate(
                index + 1,
                currOperand,
                newValue,
                newAccString, 
                operation
            )
        })
    }

    calculate()    
    return ans
}

console.log(findPossibleEquations('323', 3) ) // [ [ '3*2-3', 3 ] ]
console.log(findPossibleEquations('105', 5) ) // [ [ '10-5', 5 ], [ '1*0+5', 5 ] ]
console.log(findPossibleEquations('134', 8) ) // [ [ '1+3+4', 8 ] ]
console.log(findPossibleEquations('323', 35) ) // [ [ '32+3', 35 ] 
console.log(findPossibleEquations('159', 45) ) // [ [ '1*5*9', 45 ] ]
// console.log(findPossibleEquations('14159 26535 89793', 45) ) // This takes veeeery long
