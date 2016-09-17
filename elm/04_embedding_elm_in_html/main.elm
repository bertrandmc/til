import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Html.App as App


main =
  App.beginnerProgram
  { model = model
  , update = update
  , view = view
  }


-- model
type alias Todo =
  { id: Int
  , text: String
  , done: Bool
  }

type alias Model =
  { newTodoText: String
  , todos: List Todo
  }

model : Model
model =
  { newTodoText = ""
  , todos = []
  }


-- update

type Msg
  = UpdateNewTodo String
  | AddNewTodo
  | ToggleTodo Todo

update : Msg -> Model -> Model
update msg model =
  case msg of
    UpdateNewTodo text ->
      { model | newTodoText = text }

    AddNewTodo ->
      let
        newTodoId =
          List.length model.todos

        newTodo =
          { id = newTodoId, text = model.newTodoText, done = False }
      in
      { model |
        todos = newTodo :: model.todos
      , newTodoText = ""
      }

    ToggleTodo todo ->
      let
        toggleTodo t =
          { t | done = not t.done }

        updateTodo t =
          if t.id == todo.id then toggleTodo t else t
      in
        { model | todos = List.map updateTodo model.todos }


-- view

todoItem : Todo -> Html Msg
todoItem todo =
  let
    buttonText =
      if todo.done == True then "undo" else "done"

    getTextDecoration =
      if todo.done == True then "line-through" else "none"
  in
  li [ style [("text-decoration", getTextDecoration )]]
    [ text todo.text
    , button [ onClick (ToggleTodo todo) ] [ text buttonText ]
    ]


todoList : List Todo -> Html Msg
todoList todos =
  let
    children = List.map todoItem todos
  in
    ul [] children


view : Model -> Html Msg
view model =
  div []
    [ input [ type' "text"
            , onInput UpdateNewTodo
            , value model.newTodoText
            ] []
    , button [ onClick AddNewTodo ] [ text "Add todo" ]
    , todoList model.todos
    ]
