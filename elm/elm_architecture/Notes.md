### The Elm Architecture


The Elm architecture is a pattern which is great for modularity, code reuse and testing.

The architecture emerged naturally with Elm as a consequence of the design of the language itself.


### The Basic Pattern

The logic of an Elm program breaks up into three separated parts:

**Model** - the state of the application
**Update** - a way to update the state
**View** - a way to represent the state with HTML

Bellow is the basic skeleton of the pattern:


```elm
import Html exposing (..)


-- MODEL

type alias Model = { ... }


-- UPDATE

type Msg = Reset | ...

update : Msg -> Model -> Model
update msg model =
  case msg of
    Reset -> ...
    ...


-- VIEW

view : Model -> Html Msg
view model =
  ...

```



### Building a Counter App


```elm
import Html exposing (Html, button, div, text)
import Html.App as App
import Html.Events exposing (onClick)


main =
  App.begginnerProgram { model = model, view = view, update = update }


-- MODEL

type alias Model = Int

model : Model
model =
  0


-- UPDATE

type Msg = Increment | Decrement

update Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1


--- VIEW

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]

```

Above is the whole counter application, lets understand its parts:

```elm
import Html exposing (Html, button, div, text)
import Html.App as App
import Html.Events exposing (onClick)
```

The first thing is to import the modules the application needs, in our case we'll need the HTML module and its submodules App and Events. The keyword `exposing` allows us to define which parts of the modules should became available, this way, instead of writing `Html.button` we can just use `button` and avoid a lot of redundancy, also, `import Html.App as App` is a way to define the alias `App` for `Html.App`, again to improve our code.

The modules in a nutshell:
1. Html: The core HTML library for Elm, it contains loads of helper functions useful to generate HTML.
2. Html.App: A submodule of HTML with a bunch of functions to help setup an Elm program that follows **The Elm Architecture**.
3. Html.Events: Also a submodule of HTML with many functions to help dealing with DOM events.


```elm
main =
  App.begginnerProgram { model = model, view = view, update = update }
```

Every Elm app must define a main value that is what is going to be shown on screen. Here we use the `begginnerProgram` function to help us specify how the app should work.



```elm
-- MODEL

type alias Model = Int

model : Model
model =
  0
```

Its a good practice to start the app development by reasoning about the model, remember the model represents the state of the application and the view just translates it into HTML. For a counter application we just need a simple model to track a number that goes up and down and for that we create our own type `Model`, which is nothing more than an integer value.

`model : Model` is the signature of our model and if we had not declared our own alias, the signature would have been `model : Int`. Type aliasing makes much more sense when things get more complex, here is an example:

Lets say we have a model that represents a user:

```elm
user =
  { username: "bema", password: "<|elm|>" }
```

The signature for that model would be:
```elm
user : { username : String, password: String }
```

A function that validates the user's password would have the following signature:
```elm
logUser : { username : String, password: String } -> String -> Bool
logUser user password =
  user.password == password  
```

Now if we declare a type alias for user the signature would be much simpler (improving code readability, debugging etc):

```elm
type alias User =
  { username : String
  , password: String
  }

logUser : User -> String -> Bool  -- this is way better!
logUser user password =
  user.password == password  
```

Going back to our Elm counter app, the next part is the UPDATE section:

```elm
-- UPDATE

type Msg = Increment | Decrement

update Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1
```

Best practice here is to always start the update section by defining the messages it will get from the UI.
In the counter app we know the user is going to click "+" to Increment the counter, and also click "-" to Decrement it, so our simple app has just two messages.


```elm
type Msg = Increment | Decrement
```

After that we define our update function to describe how the messages are going to affect our model.

```elm
update Msg -> Model -> Model -- the signature of the update function
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1
```

The update function is describing the following:
Whenever a Msg arrives check its type and:
  if Increment: return a new Model (its value is going to be the previous model + 1)
  if Decrement: return a new Model (its value is going to be the previous model - 1)

Delicious pattern matching!!!

Note: How the update function receives the model and messages might feel like black magic at this stage, but no worries because there is no need to go much deeper there, the important part to understand is that events happening in the UI generates messages, these messages are passed to the update function along with the model and the result model from the update function is fed again into the view, which updates itself, everything is being managed by the Html package.


Now lets look at the last part, our VIEW.

```elm
--- VIEW

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]

```

The View is just another function that receives a model and returns a `Html Msg` value. A `Html Msg` is HTML that can produce Msg values.

So the counter app UI consists of a div element with three child nodes, the first is the decrement button, the second is another div with the model's value as text, and last is the Increment button.
In both "-" and "+" buttons we declared what messages should be produced whenever a click event occurs, `Decrement` for "-" and `Increment` for "+".

Notice that `div` and `button` are normal Elm functions that take two parameters, a list of attributes (the first `[]`) and also a list of child nodes (the second `[]`).

Elm abstracts all the heavy work needed to work with the DOM, which allows for great optimizations and testability.


This is the essence of **The Elm Architecture**.
