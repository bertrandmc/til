/**
 * A monad is a design pattern that allows structuring programs generically while 
 * automating away bookkeeping code needed by the program logic. Monads achieve this by 
 * providing their own data type, which represents a specific form of computation, 
 * along with one procedure to wrap values of any basic type within the 
 * monad (.of method) (yielding a monadic value) and another to compose functions (.chain) that output 
 * monadic values (called monadic functions).
 * 
 * So far Box, Either, Task, List -- all these types are monads, they are because 
 * we have an .of function that places a value into the type and also the chain method. 
 * These two together create the monadic interface. 
 * 
 * You may have heard of chain called flatMap, or bind, or this funny little symbol here >>=
 * 
 * It's all the same thing though. .of might be called pure sometimes. By and large, 
 * if you look at any language, you'll see this combination to create a monad. 
 * Let's take a look at this chain method a little bit closer here. We'll use 
 * Task to demonstrate this. 
 * 
 * If we have some function httpGet, it gets the current '/user' here. We map over that 
 * to get the user out. Then we want to do another httpGet here to get the comments. 
 * Do another http call here. We'll get the comments of this user.
 * 
 *  httpGet('/user')
 *      .map(user => httpGet('/comments/${user.id}')) // Task(Task([Comments]))
 * 
 * Now, the problem here is that we'll end up with a Task of a Task of an array of comments. 
 * This isn't very useful to us. We'd have to map and map and map, and fork and fork and fork. 
 * It would be very difficult to work with.
 * 
 * The key point here is that .chain would flatten these two Tasks into one Task([Comments])
 * 
 * Laws of monads: 
 * join(m.map(join)) === join(join(m)) // m being any monad
 * join(Box.of(m)) === join(m.map(Box.of))
 * 
 * .of functionality is to wrap any basic value basic type within the monad to yield a monadic value
 * .chain main functionality is to join two types into one, so if you have a list of Box(Box(Box(3)))
 * they are joined as Box(3)
 */



 /**
  * References
  * [1]: https://egghead.io/lessons/javascript-you-ve-been-using-monads
  * [2]: https://medium.com/javascript-scene/javascript-monads-made-simple-7856be57bfe8
  */