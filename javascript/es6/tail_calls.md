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
function f(n) {
  if (n === 0) {
    return 1;
  }

  const nextValue = f(n - 1);
  return n * nextValue;
}
```

Is the result of `const nextValue = factorial(n-1);` a tail call?
It is not because the function have more work to do after the nextValue is computed, so the compiler cannot optimize it. Lets re-write out factorial to allow for tail call optimization:

```
function f(n, acc = 1) {
  if (n === 0) {
    return acc;
  }

  return f(n - 1, n * acc);
}
```

And with the above, if we want to know the factorial of 4, a non-optimized stack would look like this:

  f(4) -> f(3, 4) -> f(2, 12) -> f(1, 24) -> f(0, 24)

The optimized version looks like this:
  f(0, 24)

Check this [link](https://kangax.github.io/compat-table/es6/) to see browser compatibility with TCO.
