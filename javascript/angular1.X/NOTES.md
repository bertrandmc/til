### Components


### Modular architecture

A module component is the definition of a specific module and it encapsulates all logic, templates, routing and child components.

In a modular architecture the folder structure is important to keep maintainability and predictability. Ideally an app should have three high-level modules:

  1. root: Base module that defines the app and corresponding templates, we import components and common modules into the root to include our dependencies.
  2. components: Higher level components, for example a contact page (which includes children components or common components)
  3. common: This are smaller and more generic components that will be used across the app by components listed above, think of them as small things that might repeat in several places.

#### Root module
The root module begins with a root component that defines the base element for the entire application (including our base view), bellow is an example using ui-router.

```javascript
// app.component.js
const AppComponent = {
  template: `
    <header>
        Hello world
    </header>
    <div>
        <div ui-view></div>
    </div>
    <footer>
        Copyright MyApp 2016.
    </footer>
  `
};

export default AppComponent;
```

We then create the root module importing the `AppComponent` and registering with `.component()`.
We also import the components and common submodules and inject them in our app.

```javascript
// app.js
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import AppComponent from './app.component';
import Components from './components';
import Common from './common';

const root = angular
  .module('app', [
    Components,
    Common,
    uiRouter
  ])
  .component('app', AppComponent)
  .name;

export default root;
```


### Component Module
The component module is a reference for all reusable components, this way we have a single point to import and inject in our above (see above).

```javascript
// components/index.js
import angular from 'angular';
import Nav from './nav';
import Footer from './footer';

const common = angular
  .module('app.common', [
    Nav,
    Footer
  ])
  .name;

export default common;
```

Above the have imported the components our app depends on and inject the into a module called `app.common`, based on the folder structure above our components folder would be

├── components
      ├── index.js
      ├── nav
         ├── index.js
         ├── nav.component.js
         ├── nav.controller.js
         ├── nac.controller.spec.js
         ├── nav.template.html
      ├── footer
         ├── index.js
         ├── footer.component.js
         ├── footer.controller.js
         ├── footer.controller.spec.js
         ├── footer.template.html


#### Low Lever Modules
Low-level modules are individual component modules that contain the logic for each feature block. These will each define a module, to be imported to a higher-level module, such as a component or common module.


#### File naming conventions
Keep it simple and lowercase, use the component_name.file_type.js. Use index.js for the module definition file, so you can import the module by directory name like `import Footer from './footer'` instead of `import Footer from './footer/footer.component';`.


#### Scalable file structure

├── app/
│   ├── components/
|   |  ├── index.js
│   │  ├── calendar/
│   │  │  ├── index.js
│   │  │  ├── calendar.controller.js
│   │  │  ├── calendar.component.js
│   │  │  ├── calendar.service.js
│   │  │  ├── calendar.spec.js
│   │  │  └── calendar-grid/
│   │  │     ├── index.js
│   │  │     ├── calendar-grid.controller.js
│   │  │     ├── calendar-grid.component.js
│   │  │     ├── calendar-grid.directive.js
│   │  │     ├── calendar-grid.filter.js
│   │  │     └── calendar-grid.spec.js
│   │  └── events/
|   |        ├──   // ...
|   |        ├──   // ...
|   |        ├──   // ...
│   ├── common/
│   │  ├── nav/
│   │  │     ├── index.js
│   │  │     ├── nav.controller.js
│   │  │     ├── nav.component.js
│   │  │     ├── nav.service.js
│   │  │     └── nav.spec.js
│   │  └── footer/
│   │        ├── index.js
│   │        ├── footer.controller.js
│   │        ├── footer.component.js
│   │        ├── footer.service.js
│   │        └── footer.spec.js
│   ├── app.js
│   └── app.component.js
└── index.html




### Components
Components are essentially templates with a controller, they are not Directives. Components contain bindings that define inputs and outputs for data and events, lifecycle hooks and the ability to use one-way data flow and event Objects to get data back up to a parent component. These are the new defacto standard in Angular 1.5 and above. Everything template and controller driven that we create will likely be a component, which may be a stateful, stateless or routed component. You can think of a "component" as a complete piece of code, not just the .component() definition Object.


#### Supported properties
Bellow are the supported properties for .component():

Property 	      Support
bindings 	      '@', '<', '&' (only)
controller 	    Yes
controllerAs 	  Yes, default is $ctrl
require 	      Yes (new Object syntax)
template 	      Yes
templateUrl 	  Yes
transclude 	    Yes


#### Controllers
Controllers should only be used alongside components, never anywhere else.
Some advisories for using Class for controllers:

  - Always use the constructor for dependency injection purposes
  - Don't export the Class directly, export its name to allow $inject annotations
  - If you need to access the lexical scope, use arrow functions
  - Alternatively to arrow functions, let ctrl = this; is also acceptable and may make more sense depending on the use case
  - Bind all public functions directly to the Class
  - Make use of the appropriate lifecycle hooks, $onInit, $onChanges, $postLink and $onDestroy
    Note: $onChanges is called before $onInit, see resources section for articles detailing this in more depth
  - Use require alongside $onInit to reference any inherited logic
  - Do not override the default $ctrl alias for the controllerAs syntax, therefore do not use controllerAs anywhere


#### One-way dataflow and Events
Introduced in Angular 1.5 to redefine component communication.
Some advisories for using one-way dataflow:

  - In components that receive data, always use one-way databinding syntax '<'
  - Do not use '=' two-way databinding syntax anymore, anywhere
  - Components that have bindings should use $onChanges to clone the one-way binding data to break Objects passing by reference and updating the parent data
  - Use $event as a function argument in the parent method (see stateful example below $ctrl.addTodo($event))
  - Pass an $event: {} Object back up from a stateless component (see stateless example below this.onAddTodo).
    Bonus: Use an EventEmitter wrapper with .value() to mirror Angular 2, avoids manual $event Object creation
- Why? This mirrors Angular 2 and keeps consistency inside every component. It also makes state predictable.


### Stateful components

- It fetches state communicating with backend API via service.
- Directly manipulate state
- Renders child component that mutate state
- Also known as smart/container component (think of a container in React, where state and methods are kept and are passed down to stateless components which are responsible for displaying and triggering events)

Here is an example:

```javascript
/* ----- todo/todo.component.js ----- */
import controller from './todo.controller';

const TodoComponent = {
  controller,
  template: `
    <div class="todo">
      <todo-form
        todo="$ctrl.newTodo"
        on-add-todo="$ctrl.addTodo($event);"></todo-form>
      <todo-list
        todos="$ctrl.todos"></todo-list>
    </div>
  `
};

export default TodoComponent;

/* ----- todo/todo.controller.js ----- */
class TodoController {
  constructor(TodoService) {
    this.todoService = TodoService;
  }
  $onInit() {
    this.newTodo = {
      title: '',
      selected: false
    };
    this.todos = [];
    this.todoService.getTodos().then(response => this.todos = response);
  }
  addTodo({ todo }) {
    if (!todo) return;
    this.todos.unshift(todo);
    this.newTodo = {
      title: '',
      selected: false
    };
  }
}

TodoController.$inject = ['TodoService'];

export default TodoController;

/* ----- todo/index.js ----- */
import angular from 'angular';
import TodoComponent from './todo.component';

const todo = angular
  .module('todo', [])
  .component('todo', TodoComponent)
  .name;

export default todo;

```
Above we have a statefull component, It communicates with API and holds methods and state data which is passed down to the stateless components `todo-form` and `todo-list`.

The beauty about this is that we separate concerns, our `TodoComponent` knows how to fetch and add todos, it knows nothing about how to display them or about the action that would trigger addTodo, the rendering concern is delegated to the stateless components, they know how to render and bind events.

One way data flow occurs because all state (and changes) are kept in the component root, if any child component trigger a change, or data arrives from server, all the children will be updated

---> TodoComponent (todos)  ├──> form-todo
   (changes here will)      ├──> todo-list
    (go be reflected)       ├──> important-todos
    (down the stream)       ├──> ...

#### Stateless components

1. Has defined inputs and outputs using bindings: {}
2. Does not directly mutate state
3. Data enters the component through attribute bindings (inputs)
4. Data leaves the component through events (outputs)
5. The only way to mutate state is events/data back on-demand (such as a click or submit event)
6. Doesn't care where data comes from - it's stateless
7. Are highly reusable components
8. Also referred to as dumb/presentational components


Here is an example:

```javascript
/* ----- todo/todo-form/todo-form.component.js ----- */
import controller from './todo-form.controller';

const TodoFormComponent = {
  bindings: {
    todo: '<',
    onAddTodo: '&'
  },
  controller,
  template: `
    <form name="todoForm" ng-submit="$ctrl.onSubmit();">
      <input type="text" ng-model="$ctrl.todo.title">
      <button type="submit">Submit</button>
    </form>
  `
};

export default TodoFormComponent;

/* ----- todo/todo-form/todo-form.controller.js ----- */
class TodoFormController {
  constructor(EventEmitter) {
      this.EventEmitter = EventEmitter;
  }
  $onChanges(changes) {
    if (changes.todo) {
      this.todo = Object.assign({}, this.todo);
    }
  }
  onSubmit() {
    if (!this.todo.title) return;
    // with EventEmitter wrapper
    this.onAddTodo(
      this.EventEmitter({
        todo: this.todo
      });
    );
    // without EventEmitter wrapper
    this.onAddTodo({
      $event: {
        todo: this.todo
      }
    });
  }
}

TodoFormController.$inject = ['EventEmitter'];

export default TodoFormController;

/* ----- todo/todo-form/index.js ----- */
import angular from 'angular';
import TodoFormComponent from './todo-form.component';

const todoForm = angular
  .module('todo.form', [])
  .component('todoForm', TodoFormComponent)
  .value('EventEmitter', payload => ({ $event: payload}))
  .name;

export default todoForm;
```

Remember when we included our `todo-form` in our `TodoComponent` template?

```
<todo-form
  todo="$ctrl.newTodo"
  on-add-todo="$ctrl.addTodo($event);"></todo-form>
```

The <todo-form> component fetches no state, it only receives it, mutates an Object via the controller logic associated with it, and passes it back to the parent component through the property bindings. In this example, the $onChanges lifecycle hook makes a clone of the initial this.todo binding Object and reassigns it, which means the parent data is not affected until we submit the form, alongside one-way data flow new binding syntax '<'.



### Routed components

- It's essentially a stateful component, with routing definitions
- No more router.js files
- We use Routed components to define their own routing logic
- Data "input" for the component is done via the route resolve (optional, still available in the controller with service calls)


The example bellow takes the existing `TodoComponent` refactoring it to use a route definition and bindings on the component which receives data (the secret here with ui-router is the resolve properties we create, in this case todoData directly map across to bindings for us). We treat it as a routed component because it's essentially a "view":


```javascript
/* ----- todo/todo.component.js ----- */
import controller from './todo.controller';

const TodoComponent = {
  bindings: {
    todoData: '<'
  },
  controller,
  template: `
    <div class="todo">
      <todo-form
        todo="$ctrl.newTodo"
        on-add-todo="$ctrl.addTodo($event);"></todo-form>
      <todo-list
        todos="$ctrl.todos"></todo-list>
    </div>
  `
};

export default TodoComponent;

/* ----- todo/todo.controller.js ----- */
class TodoController {
  constructor() {}
  $onInit() {
    this.newTodo = {
      title: '',
      selected: false
    };
  }
  $onChanges(changes) {
    if (changes.todoData) {
      this.todos = Object.assign({}, this.todoData);  // immutability
    }
  }
  addTodo({ todo }) {
    if (!todo) return;
    this.todos.unshift(todo); // with no immutability, bad
    this.newTodo = {
      title: '',
      selected: false
    };
  }
}

export default TodoController;

/* ----- todo/todo.service.js ----- */
class TodoService {
  constructor($http) {
    this.$http = $http;
  }
  getTodos() {
    return this.$http.get('/api/todos').then(response => response.data);
  }
}

TodoService.$inject = ['$http'];

export default TodoService;

/* ----- todo/index.js ----- */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import TodoComponent from './todo.component';
import TodoService from './todo.service';

const todo = angular
  .module('todo', [
    uiRouter
  ])
  .component('todo', TodoComponent)
  .service('TodoService', TodoService)
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('todos', {
        url: '/todos',
        component: 'todo',
        resolve: {
          todoData: TodoService => TodoService.getTodos();
        }
      });
    $urlRouterProvider.otherwise('/');
  })
  .name;

export default todo;
```

### Directives
Forget about it, Future is Components.

The above notes are base on [Todd's Angular Styleguide](https://github.com/toddmotto/angular-styleguide)
