Tails calls were invented with Scheme

It occurs when a function F makes a final call to a function (which could be itself - known as recursive call, or another function).
Once the function F makes its final call it will have no more work to do and that means F has no more meaning
to exist, this opens the possibility of a tail call optimization (TCO).

Lets visualize the following code:
```
function f(value) {
  ... do some calculation with value
  if(value === something) {
    return value;
  }

  return f(calculatedValue);
}
```
Each function call have no idea about the previous state, they can't encapsulate the whole call state, they don't know they are part of a much bigger structure, instead they are only concerned with their own calculations, they know they have called some other function and have to wait for this functions result to be able to return a value for its own caller, that is all they are concerned.

But if they don't know the big picture, what is keeping track of how the function calls relate to each other?

The Call Stack
A call stack is a dynamic data structure which purpose is to control how function/procedures call each other (their parameters, thread and other things), so if we try, in a very simplistic way, to represent the resulting stack of the above code we'd see something live this.

  f returns f() -> f returns f() -> f returns f() -> f returns value  (a call stack formed by several stack frames)

Without a tail call optimization the above stack would be kept in memory and whenever the last F call returns its result, the previous function would also continue execution and return the value that was returned and so on, within this scene all f execution context are kept in memory eventually finishing their execution.

With tail call optimization there is no more need to write and keep all this information in the Call Stack until the last return statement of each call is executed, the compiler is now able to know that the first F call has no more work to do and discards it without need to create the related stack frame, the same goes for the second F call, and so on, with the optimization the previous stack looks like this:

    F returns value

It frees memory because the stack is smaller and it also frees procedures calls and stack frame creation (memory writing) making the execution of that program much faster.

One important thing to consider is that a tails calls don't necessarily need to be recursive, see the following code

```

function someCalc(value) {
  return double(number);
}
function double (number) {
  return multi(number, 2)
}

function multi (x, y) {
  return x * y;
}
```

  someCalc calls -> double calls -> multi returns result

We see 3 different functions, and making a tail call to another function (passing some parameters). So again, the resulting stack would be:

  multi returns result


When its not a tail call?

So lets analyze the code bellow:

```
function factorial(n) {
  if (n === 1) {
    return 1;
  }

  return n * factorial(n - 1);
}
```

Is the result of `return n * factorial(n - 1);` a tail call?
It is not because to be able to calculate the final result, the factorial(n) call has to wait for the result of `factorial(n - 1)`, which nested in the expression `n * factorial(n - 1)`, so in this case the compiler cannot optimize it and instead it needs to keep a chain of deferred operations, this is know as **recursive process**.

One important thing is not to confuse **recursive process** with **recursive procedure**. A recursive procedure is basically a function that calls itself, while a recursive process is an explanation of how the process evolves, so a recursive process builds up a chain of deferred operations.

factorial(5)
(5 * factorial(4))
(5 * 4 * factorial(3))
(5 * 4 * 3 * factorial(2))
(5 * 4 * 3 * 2 * factorial(1))
(5 * 4 * 3 * 2 * 1)
(5 * 4 * 3 * 2 * 1)
(5 * 4 * 3 * 2)
(5 * 4 * 6)
(5 * 24)
120

Now lets re-write our factorial to allow for Tail Call Optimization:

```
function factorial(n, product = 1, counter = 1) {
  if(counter > n) {
    return product;
  }

  return factorial(n, (counter * product), (counter + 1))
}
```

In the case above there is no need to keep reference of the previous calls, there are no deferred operations because the result of previous calculations are passed along to the next function call, the compiler is then able to keep only the last function call and its parameter, which is enough to reach our result. This process is known as **iteractive process**.

  > "In the iterative case, the program variables provide a complete description of the state of the process at any point. - SICP"

Like we did before, lets use the substitution model to see how this calculation evolves:

factorial(5, 1, 1) // 1, 1 are default values
factorial(5, 1, 2)
factorial(5, 2, 3)
factorial(5, 6, 4)
factorial(5, 24, 5)
factorial(5, 120, 6)
120

We can see that the compiler won't need to keep a reference of the previous calls/parameters to be able to calculate `factorial(5, 120, 6)` because the call provides everything needed that is needed and this allows for TCO.

Now think of a very large factorial calculation, TCO is a huge benefit. (see SICP page 34)

Check this [link](https://kangax.github.io/compat-table/es6/) to see browser compatibility with TCO.
