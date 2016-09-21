// function* declaration defines a generator function

function* myGen() {
  // yield returns an iterator
  const one = yield 1;
  const two = yield 2;
  const three = yield 3;
  console.log(one, two, three); // undefined undefined undefined
}

const gen = myGen();  // get the generator set

console.log(gen.next());    // { value: 1, done: false }
console.log(gen.next('A')); // { value: 2, done: false }
console.log(gen.next('B')); // { value: 3, done: false }
console.log(gen.next('C')); // { value: undefined, done: true }

// with generators we can pause and resume actions

// calling the next() method with an argument will resume
// the generator function execution, replacing the yield
// statement where execution was paused with the argument from next()


// CO is a library to help with generators control flow, it
// abstract all the .next() calls and adds some extra goodies like promises
// With CO non-blocking code is much nicer to write
const co = require('co');
const fetch = require('node-fetch');

// fetch returns a promise
function getPost(id) {
  const URI = `http://jsonplaceholder.typicode.com/posts/${id}`;
  return fetch(URI).then( response => response.json() );
}

//
co(function* getJson() {
  const result = yield getPost(1);
  console.log(`Title: ${result.title}`); // Title: sunt aut facere ...
}).catch(onerror)

// using promises
co(function* getJson() {
  return yield getPost(1);
}).then(function (result) {
  console.log(`Title: ${result.title}`);  // Title: sunt aut facere ...
}).catch(onerror)


// multiple promises in parallel
co(function* getPosts(){
  // resolve multiple promises in parallel
  var a = getPost(1);
  var b = getPost(2);
  var c = getPost(3);

  var res = yield [a, b, c];
  console.log(res);// => [{id: 1, ...}, {id: 2, ...}, {id: 3, ...}]
}).catch(onerror);


function onerror(err) {
  // deal with error
  console.log(err);
}
