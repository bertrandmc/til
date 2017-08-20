# React

## React VDOM
In React the five most important types are:
  . ReactElement / ReactElement Factory
  . ReactNode
  .ReactComponent / ReactComponent Class

### React DOM Elements
This is the primary type and is specified as follow:
```
type ReactDOMElement = {
  type : string,
  props : {
    children : ReactNodeList,
    className : string,
    etc.
  },
  key : string | boolean | number | null,
  ref : string | null
};
```

You can create a ReactDOMElement with `React.createElement`
```
const paragraph = React.createElement('p')
```


### Factories
A ReactDomElement factory is a function that generates a ReactDomElement of a specific type
```javascript

const p = React.createFactory('p');
const greeting = p({className: 'greeting'}, 'Hello there');


// React.createFactory is basically this
function createFactory(type){
  return React.createElement.bind(null, type);
}

// React already has built-in factories for common HTML tags, for example:
const greeting = React.DOM.p({className: 'greeting'}, 'Hello there')
const wrapper = React.DOM.div({className: 'app'}, greeting)

```


### React Node
A React Node can be either:
  .ReactDomElement
  .string (aka ReactText)
  .number (aka ReactText)
  .array of ReactNodes (aka ReactFragment)

```
type ReactNode = ReactElement | ReactFragment | ReactText;
type ReactFragment = Array<ReactNode | ReactEmpty>;
```

They can be used as children property of other ReactDOMElements to create a tree of ReactElements.


### React Components
React components are ReactElements encapsulated with state and functionalities. It is represented with a Javascript class or constructor function.

```javascript
class Greeting extends React.Component {
  render () {
    return (<p>Hello there</p>)
  }  
}

// the above could also be create using React.createClass helper
const Greeting = React.createClass({
  render () {
    return (<p>Hello there</p>)
  }
})

// then we pass our class or constructor function to React.createElement
const saluto = React.createElement(Greeting);

// or with JSX
const saluto = <Greeting />

React.render(saluto, document.body);
```

The render method of a React component is expected to return another ReactElement, these eventually will be resolved into DOM Elements instances that will be inserted into the document.


## Rendering
To render elements in the DOM  we create `ReactDOMElements` and pass them to `React.render` with a regular DOM element where the elements should be rendered.
```javascript
const paragraph = React.createElement('p', { className: 'greeting' }, 'Hello there!')
React.render(paragraph, document.body)

```

We can use JSX and in that case the ReactDOMElements will be created for us:
```javascript
const greeting = (
  <div className="app">
    <p className="greeting">Hello There</p>
  </div>
)

// The above JSX will translate to
React.createElement(
  "div",
  { className: "app" },
  React.createElement(
    "p",
    { className: "greeting" },
    "Hello There"
  )
)
```


If we keep calling React.render with the same ReactElement and same DOM container it will always return the same instance:
```javascript
var greetingA = React.render(<Greeting />, document.body);
var greetingB = React.render(<Greeting />, document.body);
greetingA === greetingB; // true
```


### React Types


```javascript
type ReactNode = ReactElement | ReactFragment | ReactText;

type ReactElement = ReactComponentElement | ReactDOMElement;

type ReactDOMElement = {
  type : string,
  props : {
    children : ReactNodeList,
    className : string,
    etc.
  },
  key : string | boolean | number | null,
  ref : string | null
};

type ReactComponentElement<TProps> = {
  type : ReactClass<TProps>,
  props : TProps,
  key : string | boolean | number | null,
  ref : string | null
};

type ReactFragment = Array<ReactNode | ReactEmpty>;

type ReactNodeList = ReactNode | ReactEmpty;

type ReactText = string | number;

type ReactEmpty = null | undefined | boolean;

```


# React Patterns

### Stateless function

```javascript
const Greeting = props => <div>{props.name}</div>;

// use
<Greeting name="John" />
```


### Destructuring arguments
```javascript
const Greeting = ({name}) => <div>{name}</div>;

// use
<Greeting name="John" />

```


### JSX spread attributes
Spread is very useful to control what props are passed to child components.
```javascript
const Greeting = ({name, ...props}) => <div {...props}>{name}</div>;

// use
<Greeting className="color-main" name="John" {...props} />
```


### Conditional rendering
#### if

```javascript
{ isLoggedIn && <Greeting name={name} /> }
```


#### unless
```javascript
{ condition || <div>This is rendered when condition is falsy</div> }
```


#### if-else
```javascript
{ isLoggedIn
  ? <Greeting name={name} />
  : <Loading />
}

```


#### if-else complex blocks

```javascript
{ isLoggedIn ? (
  <div>
    <Greeting name={name} />
  </div>
) : (
  <div>
    <Loading />
  </div>
) }
```

### Children types
React can render children of several kinds:

**String**
```javascript
<div>
  Hello World!
</div>
```

**Array**

```javascript
<div>
  {[<Greeting name="John" />, "We hope you have a lovely day!"]}
</div>

<ul>
  {["Red", "Blue", "Green"].map(color => <li>{color}</li>)}
</ul>
```



**Functions**

IIFE functions are very useful to conditionally render components and other more advanced techniques like the `Render Callback` and `Higher Order Components` (more on these in a bit).
```javascript
<div>
  {() => { return "IIFE also works!"}()}
</div>

```


### Render callback
First lets create a not so useful component just to help understand the render callback pattern.

```javascript
const SayHi = ({children}) => children('Hi')
const SayHello = ({children}) => children('Hello')

<SayHi>
  { greeting => <p>{greeting} there!</p>}
</SayHi>

<SayHello>
  { greeting => <p>{greeting} there!</p>}
</SayHello>

```

Both `SayHi` and `SayHello` expect a function as children that is invoked with the respective greeting parameter.
This pattern is most useful when we want to extract functionality of a component and use it in other components, a good example is a data fetching parent component.

```javascript
class UserFetch extends Component {
  state: {
    user: null,
    error: null,
    fetching: true
  }

  componentDidMount() {
    fetch(`/users/${this.props.id}`)
      .then(user => this.setState({user, fetching: false}))
      .catch(error => this.setState({error, fetching: false}))
  }

  render () {
    const {user, error, loading} = this.state

    if (loading) return <Loading />;
    if (error) return <Error error={error} />

    return this.children(user)
  }
}

<UserFetch id="123"}>
  { user => <Profile user={user}> }
</UserFetch>

<UserFetch id="345"}>
  { user => <Profile user={user}> }
</UserFetch>

```
UserFetch is wrapping not only the logic to make the API call and fetch the user data but also the displaying of the Loading and Error components.


### Higher-order component (HOC)

How Render callback compares to HOC?


•	Children pass-through
•	Proxy component
•	Style component
•	Event switch
•	Layout component
•	Container component

•	State hoisting
•	Controlled input





## References
https://facebook.github.io/react/blog/2014/10/14/introducing-react-elements.html
https://gist.github.com/sebmarkbage/fcb1b6ab493b0c77d589#react-elements
https://gcanti.github.io/2014/11/24/understanding-react-and-reimplementing-it-from-scratch-part-2.html

https://facebook.github.io/reason/index.html
