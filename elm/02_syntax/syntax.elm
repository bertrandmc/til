-- Single line comment

{- a multi
  line comment
-}

{- a nested multi
  {- line comment -}
-}



-- Literals

  -- Boolean
  True  : Bool
  False : Bool

  -- number
  42  : number -- Int or Float depending on usage
  42  : Int
  3.14  : Float

  -- String
  'a' : Char
  "abc" : String

  -- multi-line String
  """
  This is useful for holding JSON or other
  content that has "quotation marks".
  """

  -- Typical manipulation of Literals
  True && not (True || False)
  (2 + 2) * (3^2 - 9)
  "abc" + "def"



-- Conditionals

  if expression then "something" else "something else"

  -- chain different conditions
  if key == 40 then
      n + 1

  else if key == 38 then
      n - 1

  else
      n

    --- Conditionals based on the structure of algebraic data types and Literals
    --- case matches the value's type agains the patterns defined after the keywork `of` (like MLs pattern matching)
    --- patterns are indentation sensitive, we must align them

    case maybe of
      Just xs -> xs
      Nothing -> []

    case result of
      hd::tl -> Just (hd,tl) -- get head and tail of list, (check hd tl?)
      []     -> Nothing

    case n of
      0 -> 1
      1 -> 1
      _ -> fib (n-1) + fib (n-2)  -- _ means anything else



-- Type Annotations

  name : String
  name = "Bema"

  sum: Int -> Int -> Int
  sum a b =
    a + b

  distance : { x : Float, y : Float } -> Float
  distance {x,y} =
    sqrt (x^2 + y^2)



-- Type Aliases

  type alias Name = String
  type alias Age = Int

  info : (Name,Age)
  info = ("Steve", 28)

  type alias Point = { x:Float, y:Float }

  origin : Point
  origin =
    { x = 0, y = 0 }



-- Union Types

  -- We can create custom types
  -- A custom union type can have multiple values (or tags)
  type Visibility = All | Active | Completed
  -- All, Active and Complete now have the following type signature
  -- All        : Visibility
  -- Active     : Visibility
  -- Completed  : Visibility

  filterList visibility tasks =
    case visibility of
      All ->
        -- return all tasks
      Active ->
        -- return list with active tasks
      Completed
        -- return list with completed tasks

    -- the signature of our filterList function would be
    filterList : Visibility -> List Task -> List Task  -- remember all function in elm are curried

  -- Tags can bring additional information about its types
    type S3Response
      = Success List
      | Error String

  -- Union Types can have type variables
    type User pass
      = Email String
      | Password pass



-- Lists

  [1..4]
  [1,2,3,4]
  1 :: [2,3,4]
  1 :: 2 :: 3 :: 4 :: []
    -- The four expressions above are equivalent
    -- To manipulate lists see core package List, eg: List.append ['a','b'] ['c'] == ['a','b','c']



-- Records

  -- records are a collection of key/value pairs

  -- creatre a record
  point =
    { x = 4, y = 10 }

  -- access record field
  point.x       -- 4
  .x point      -- 4


  -- records are immutable, updating a record return a new record
  updatedPoint = { point | x = 6 }  -- update one field
  updatedPoint = { point | x = 20, y = 16 } -- update multiple fields

  -- destructing a record
  { x, y } = updatedPoint



-- Tuples

  -- Tuples package two or more expressions into a single expression.
  (67, 2016, "Elm")
  -- The type of a tuple is based on each of its component's type
  (67, 2016, "Elm") : (number, number, String)


  -- There is a special function for creating tuples:
  (,) 1 2              == (1,2)
  (,,,) 1 True 'a' []  == (1,True,'a',[])

  -- destructing a tuple
  (position, year, language)



-- Functions

  square n =     --  define a square function
    n^2

  hypotenuse a b =
    sqrt (square a + square b)

  distance (a,b) (x,y) =
    hypotenuse (a-x) (b-y)


  -- partial application
  -- someFunction a b == ((someFunction a) b)
  <function> : number -> number -> number
  sum a b = a + b

  add10 n = sum 10  -- add10 is the the sum function curried with a being 10
  add10 5 -- 15

  -- Anonymous functions
    sum = \a b -> a + b

    squares =
      List.map (\n -> n^2) [1..100]


-- Infix Operators
  --
  -- infix operators are function which are put between arguments
  -- so instead of
  sum a b

  -- we can do
  a `sum` b -- function goes inside backticks

  -- You can create custom infix operators

  viewNames names =
    String.join ", " (List.sort names)  -- this function applies sort to names and after join

    -- the above using  <| and |> to reduce parentheses usage (this is awesome)
  viewNames names =
    names
      |> List.sort              --  first apply for to names parameter
      |> String.join ", "       --  then apply String.join to result of previous List.sort



-- Let expressions

  -- values declared inside let expressions are not available outside
  -- Let expressions are indentation sensitive
  let
    twentyFour =
      3 * 8

    sixteen =
      4 ^ 2
  in
    twentyFour + sixteen


  --  they are super useful to simplify complex expressions
  --  but "It is best to only do this on concrete types. Break generic functions into their own top-level definitions."
  let
    complexCalc = 1 + 2 + 4 ^ 2 -- very complex
  in
    { model |  price = complexCalc } -- simpler here


  -- You can use "destructuring assignment"
  let
    ( valueA, valueB ) =
      ( 3, 4 )

    hypotenuse a b =
      sqrt (a^2 + b^2)
  in
    hypotenuse valueA valueB


  --  You can add type annotations in let-expressions.
  let
    sum : Int -> Int -> Int
    sum a b =
      a + b
  in
    sum 10 3



-- Applying Functions

  -- alias for appending lists and two lists
  append xs ys = xs ++ ys
  xs = [1,2,3]
  ys = [4,5,6]

  -- All of the following expressions are equivalent:
  a1 = append xs ys --  this is more expressive in my opinion
  a2 = (++) xs ys   -- this is cool,

  b1 = xs `append` ys  -- infix
  b2 = xs ++ ys

  c1 = (append xs) ys  -- curry
  c2 = ((++) xs) ys

  {- notes:
    `append xs ys` is more expressive in my opinion because the expression says
    append arrays xs and ys, comparing to JS axs.concat(ys) which reads
    contact ys to xs but the result is actually a new array.
  -}

  {-The basic arithmetic infix operators
    all figure out what type they should have automatically.
  -}
  23 + 19    : number
  2.0 + 1    : Float

  6 * 7      : number
  10 * 4.2   : Float

  100 // 2  : Int
  1 / 2     : Float



-- Modules

  -- Import
    module MyModule exposing (..)

    -- qualified imports
    import List                    -- List.map, List.foldl
    import List as L               -- L.map, L.foldl

    -- open imports

    import List exposing (..)               -- expose all:  map, foldl, concat, ...
    import List exposing ( map, foldl )     -- expose specific identifier: smap, foldl

    import Maybe exposing ( Maybe )         -- Maybe
    import Maybe exposing ( Maybe(..) )     -- Maybe, Just, Nothing
    import Maybe exposing ( Maybe(Just) )   -- Maybe, Just


  -- Definition

    module MyModule where  -- default module definition
    module MyModule (..) where -- exporting everything
    module MyModule (SomeType, someFunction) where

    -- Export only specified entities
    module Mymodule (Type, value) where
