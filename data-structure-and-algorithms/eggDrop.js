// # Function to get minimum number of trials  
// # needed in worst case with n eggs and k floors  
// def eggDrop(n, k): 
  
// TODO

// so slow
function eggDropRecursive(eggs, floors) {
    if (floors <= 1 ) {
        return floors; 
    } 
  
    // We need k trials for one egg and k floors 
    if (eggs === 1) {
        return floors; 
    }
  
    let min = Infinity

    for (let i = 1; i <= floors; i++) { 
        const res = Math.max(
            eggDrop(eggs-1, i-1), 
            eggDrop(eggs, floors-i)
        ); 
        
        if (res < min) {
            min = res; 
        }
    } 
  
    return min + 1; 
}

// Dynamic Programming
function eggDropDP(eggs, floors) {
    // a row for each egg
    // [
    //      [], first egg
    //      [], second egg
    // ]
    const eggFloor = []

    // We need one trial for one  
    // floor and 0 trials for 0 floors 
    // initialize them
    for (let i = 1; i <= eggs; i += 1) { 
        eggFloor[i] = []
        eggFloor[i][1] = 1;
        eggFloor[i][0] = 0;
    }

    // for a single egg, we always need one trial per floor.
    // first floor 1 trial, 5 floor 5 trials etc.
    for (let j = 2; j <= floors; j += 1) {
        eggFloor[1][j] = j;
    }
        
    for (let i = 2; i <= eggs; i += 1) { // first egg row was set, start from second
        for (let j = 2; j <= floors; j += 1) { // each floor from second
            eggFloor[i][j] = Infinity;
            
            for (let x = 1; x <= j; x += 1) {
                const res = 1 + Math.max(
                            // previous egg row, previous row 
                    eggFloor[i - 1][x - 1],  
                            // actual egg row, next row
                    eggFloor[i][j - x]
                );

                if (res < eggFloor[i][j]) {
                    eggFloor[i][j] = res; 
                }
            } 
        } 
    } 
    
    return eggFloor[eggs][floors]
}

console.log(eggDropRecursive(2, 100))
console.log(eggDropDP(2, 100))