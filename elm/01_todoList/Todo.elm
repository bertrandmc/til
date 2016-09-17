import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Html.App as Html


main =
  Html.beginnerProgram
  { model = model
  , update = update
  , view = view
  }


-- model

type alias Todo =
  { id: Int
  , text: String
  }

type alias Model =
  { newTodo: String
  , todos: List Todo
  }

model =
  { newTodo = ""
  , todos = []
  }


-- update

type Msg
  = UpdateText String
  | AddItem
  | RemoveItem Todo

update msg model =
  case msg of
    UpdateText text ->
      { model | newTodo = text }

    AddItem ->
      { model |
          todos = { id = (List.length model.todos), text = model.newTodo } :: model.todos
        , newTodo = ""
      }

    RemoveItem todo ->
      { model |
        todos =
          List.filter (\t -> t.id /= todo.id) model.todos
      }


-- view

todoItem todo =
  li []
    [ text todo.text
    , button [ onClick (RemoveItem todo) ] [ text "X" ]
    ]

todoList todos =
  let
    children = List.map todoItem todos
  in
    ul [] children

view model =
  div []
  [ input [ type' "text"
          , onInput UpdateText
          , value model.newTodo
          ] []
  , button [ onClick AddItem ] [ text "Add todo" ]
  , div [] [ text model.newTodo ]
  , todoList model.todos
  ]
