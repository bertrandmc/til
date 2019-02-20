
# Mobx

## Observable
Observable values can be JS primitives, references, plain objects, class instances, arrays and maps. 

```javascript
const map = observable.map({ key: "value"});
map.set("key", "new value");

const list = observable([1, 2, 4]);
list[2] = 3;

const person = observable({
    firstName: "Clive Staples",
    lastName: "Lewis"
});
person.firstName = "C.S.";

const temperature = observable.box(20);
temperature.set(25);
```

Decorator that can be used on ES7- or TypeScript class properties to make them 
observable. The @observable can be used on instance fields and property getters. This offers fine-grained control on which parts of your object become observable.
   
```javascript
import { observable, computed } from "mobx";

class OrderLine {
    @observable price = 0;
    @observable amount = 1;

    @computed get total() {
        return this.price * this.amount;
    }
}
```

## Important Data Structures
1. Objects
If a plain JavaScript object is passed to observable all properties inside will be 
copied into a clone and made observable. (A plain object is an object that wasn't created 
using a constructor function / but has Object as its prototype, or no prototype at all.) 
observable is by default applied recursively, so if one of the encoutered values 
is an object or array, that value will be passed through observable as well.

2. Arrays
Similar to objects, arrays can be made observable using observable.array(values?) or 
by passing an array to observable. This works recursively as well, so all (future) 
values of the array will also be observable.

3. Maps
creates a dynamic keyed observable map. Observable maps are very useful if you don't 
want to react just to the change of a specific entry, but also to the addition or 
removal of entries. Optionally takes an object, entries array or string keyed ES6 
map with initial values.

4. Box
All primitive values in JavaScript are immutable and hence per definition not observable. 
Usually that is fine, as MobX usually can just make the property that contains the 
value observable. See also observable objects. In rare cases it can be convenient to 
have an observable "primitive" that is not owned by an object. For these cases it is 
possible to create an observable box that manages such a primitive.
```javascript
import {observable} from "mobx";

const cityName = observable.box("Vienna");

console.log(cityName.get());
// prints 'Vienna'

cityName.observe(function(change) {
    console.log(change.oldValue, "->", change.newValue);
});

cityName.set("Amsterdam");
// prints 'Vienna -> Amsterdam'
```

## Decorators
In MobX there is a set of decorators that defines how observable properties will behave.
    
1. `observable`: An alias for observable.deep.
2. `observable.deep`: This is the default modifier, used by any observable. It clones and converts any (not yet observable) array, Map or plain object into it's observable counterpart upon assignment to the given property
3. `observable.ref`: Disables automatic observable conversion, just creates an observable reference instead.
4. `observable.shallow`: Can only used in combination with collections. Turns any assigned collection into an observable, but the values of that collection will be treated as-is.
5. `observable.struct`: Like ref, but will ignore new values that are structurally equal to the current value
6. `computed`: Creates a derived property, see computed
7. `computed(options)`: Idem, sets additional options.
8. `computed.struct`: Same as computed, but will only notify any of it's observers when the value produced by the view is structurally different from the previous value
9. `action`: Creates an action, see action
10. `action(name)`: Creates an action, overrides the name
11. `action.bound`: Creates an action, and binds this to the instance




## Reacting to Observables

### 1. @computed
Computed values are values that can be derived from the existing state or other computed values. 
Conceptually, they are very similar to formulas in spreadsheets. Computed values can't be 
underestimated, as they help you to make your actual modifiable state as small as possible. 
Besides that they are highly optimized, so use them wherever possible.

Don't confuse `computed` with `autorun`. They are both reactively invoked expressions, 
but use @computed if you want to reactively produce a value that can be used by other 
observers and autorun if you don't want to produce a new value but rather want to 
achieve an effect. For example imperative side effects like logging, making network requests etc.

Computed values are automatically derived from your state if any value that affects 
them changes. Computed values can be optimized away in many cases by MobX as they 
are assumed to be pure. For example, a computed property won't re-run if none of the 
data used in the previous computation changed. Nor will a computed property re-run if 
is not in use by some other computed property or reaction. In such cases it will be suspended.


### 2. Autorun
can be used in those cases where you want to create a reactive function that will never 
have observers itself. This is usually the case when you need to bridge from reactive to 
imperative code, for example for logging, persistence, or UI-updating code. When autorun 
is used, the provided function will always be triggered once immediately and then again 
each time one of its dependencies changes. In contrast, computed(function) creates functions 
that only re-evaluate if it has observers on its own, otherwise its value is considered to be 
irrelevant. As a rule of thumb: use autorun if you have a function that should run 
automatically but that doesn't result in a new value. Use computed for everything else. 
Autoruns are about initiating effects, not about producing new values. If a string is 
passed as first argument to autorun, it will be used as debug name.

```javascript
var numbers = observable([1,2,3]);
var sum = computed(() => numbers.reduce((a, b) => a + b, 0));

var disposer = autorun(() => console.log(sum.get()));
// prints '6'
numbers.push(4);
// prints '10'

disposer();
numbers.push(5);
// won't print anything, nor is `sum` re-evaluated
```

### 3. When
when observes & runs the given predicate until it returns true. Once that 
happens, the given effect is executed and the autorunner is disposed. 
The function returns a disposer to cancel the autorunner prematurely.

```javascript
class MyResource {
    constructor() {
        this.dispose = when(
            // once...
            () => !this.isVisible,
            () => {
                // do something
            }
        );
    }

    @computed get isVisible() {
        // indicate whether this item is visible
    }
}
```

### 4. Reaction
A variation on autorun that gives more fine grained control on which observables will 
be tracked. It takes two functions, the first one (the data function) is tracked and 
returns data that is used as input for the second one, the effect function. Unlike 
`autorun` the side effect won't be run directly when created, but only after the data 
expression returns a new value for the first time. Any observables that are accessed 
while executing the side effect will not be tracked. reaction returns a disposer function.
```javascript
const todos = observable([
    {
        title: "Make coffee",
        done: true,
    },
    {
        title: "Find biscuit",
        done: false
    }
]);

// wrong use of reaction: reacts to length changes, but not to title changes!
const reaction1 = reaction(
    () => todos.length,
    length => console.log(`Total todos ${length}`)
);
```

### 5. @observer
The observer function / decorator can be used to turn ReactJS components into reactive 
components. It wraps the component's render function in mobx.autorun to make sure that any 
data that is used during the rendering of a component forces a re-rendering upon change. 
It is available through the separate mobx-react package.
```javascript
import {observer} from "mobx-react";

var timerData = observable({
    secondsPassed: 0
});

setInterval(() => {
    timerData.secondsPassed++;
}, 1000);

@observer class Timer extends React.Component {
    render() {
        return (<span>Seconds passed: { this.props.timerData.secondsPassed } </span> )
    }
};

ReactDOM.render(<Timer timerData={timerData} />, document.body);
```

***Gotcha: dereference values inside your components***
MobX can do a lot, but it cannot make primitive values observable (although it can wrap 
them in an object see boxed observables). So not the values that are observable, but the 
properties of an object. This means that @observer actually reacts to the fact that 
you dereference a value. So in our above example, the Timer component would not react 
if it was initialized as follows:
```javascript
React.render(<Timer timerData={timerData.secondsPassed} />, document.body)
```
In this snippet just the current value of secondsPassed is passed to the Timer, which is 
the immutable value 0 (all primitives are immutable in JS). That number won't change anymore 
in the future, so Timer will never update. It is the property secondsPassed that will 
change in the future, so we need to access it in the component. Or in other words: values 
need to be passed by reference and not by value.

***Stateless function components***
```javascript
import {observer} from "mobx-react";

const Timer = observer(({ timerData }) =>
    <span>Seconds passed: { timerData.secondsPassed } </span>
);
```

***Observable local component state***
```javascript
import {observer} from "mobx-react"
import {observable} from "mobx"

@observer class Timer extends React.Component {
    @observable secondsPassed = 0

    componentWillMount() {
        setInterval(() => {
            this.secondsPassed++
        }, 1000)
    }

    render() {
        return (<span>Seconds passed: { this.secondsPassed } </span> )
    }
}

ReactDOM.render(<Timer />, document.body)
```

***Connect components to provided stores using inject***
The mobx-react package also provides the Provider component that can be used to pass 
down stores using React's context mechanism. To connect to those stores, pass a 
list of store names to inject, which will make the stores available as props.
```javascript
const colors = observable({
   foreground: '#000',
   background: '#fff'
});

const App = () =>
  <Provider colors={colors}>
     <app stuff... />
  </Provider>;

const Button = inject("colors")(observer(({ colors, label, onClick }) =>
  <button style={{
      color: colors.foreground,
      backgroundColor: colors.background
    }}
    onClick={onClick}
  >{label}</button>
));

// later..
colors.foreground = 'blue';
// all buttons updated
```

***When to apply observer?***
The simple rule of thumb is: all components that render observable data. If you 
don't want to mark a component as observer, for example to reduce the dependencies 
of a generic component package, make sure you only pass it plain data.

***observer and PureComponent***
observer also prevents re-renderings when the props of the component have only 
shallowly changed, which makes a lot of sense if the data passed into the component is 
reactive. This behavior is similar to React PureComponent, except that state changes are 
still always processed. If a component provides its own shouldComponentUpdate, that one 
takes precedence.

***componentWillReact (lifecycle hook)***
React components usually render on a fresh stack, so that makes it often hard to figure 
out what caused a component to re-render. When using mobx-react you can define a new 
life cycle hook, componentWillReact (pun intended) that will be triggered when a component 
will be scheduled to re-render because data it observes has changed. This makes it easy to 
trace renders back to the action that caused the rendering.
```javascript
import {observer} from "mobx-react";

@observer class TodoView extends React.Component {
    componentWillReact() {
        console.log("I will re-render, since the todo has changed!");
    }

    render() {
        return <div>this.props.todo.title</div>;
    }
}
```
`componentWillReact` doesn't take arguments
`componentWillReact` won't fire before the initial render (use componentWillMount instead)
`componentWillReact` for mobx-react@4+, the hook will fire when receiving new props and after setState calls


## Changing Observables

### @Action
Any application has actions. Actions are anything that modify the state. With MobX you 
can make it explicit in your code where your actions live by marking them. Actions help you to structure your code better.
It is advised to use (@)action on any function that modifies observables or has side effects. 
action also provides useful debugging information in combination with the devtools.
Usage:
```javascript
action(fn)
action(name, fn)
@action classMethod() {}
@action(name) classMethod () {}
@action boundClassMethod = (args) => { body }
@action(name) boundClassMethod = (args) => { body }
@action.bound classMethod() {}
```

*** action.bound ***
The action decorator / function follows the normal rules for binding in javascript. 
However, action.bound can be used to automatically bind actions to the targeted object. 
Note that unlike action, (@)action.bound does not take a name parameter, so the name 
will always be based on the property name to which the action is bound. Actions wrap
function execution in a transaction (see below)
```javascript
class Ticker {
    @observable tick = 0

    @action.bound
    increment() {
        this.tick++ // 'this' will always be correct
    }
}

const ticker = new Ticker()
setInterval(ticker.increment, 1000)
```

### transaction
All actions changes are synchronous, meaning the bellow code would trigger recalculation twice

```javascript
const weather = observable({
    temperature: 20,
    unit: 'C'
})

autorun(() => console.log(weather.temperature, weather.unit))
weather.temperature = 68 // logs 21
weather.unit = 'F' // logs 22
```

It is very common to a single function invocation to change multiple properties, so an action will 
wrap the function execution with a transaction so reactions can be invoked once after all changes are performed

```javascript
transaction(() => {
    weather.temperature = 23 // won't log
    weather.temperature = 24 // logs 24
})
```

### enforceActions
With `configure` you can set Mobx to `enforceActions`, this will  force changes 
to state to be performed only from inside actions


```javascript
import { observable, configure } from 'mobx'
configure({ enforceActions: 'always' })

const weather = observable({
    temperature: 20,
    unit: 'C'
})

weather.unit = 'F' // ERROR

transaction(() => {
    weather.unit = 'F' // OK
})


```