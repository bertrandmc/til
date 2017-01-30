### The CSS box model

In a document, each element is represented as a rectangular box. Determining the size, properties — like its color, background, borders aspect — and the position of these boxes is the goal of the rendering engine.

In CSS, each of these rectangular boxes is described using the standard box model. This model describes the content of the space taken by an element. Each box has four edges: the margin edge, border edge, padding edge, and content edge.

![Box Model](boxmodel.png)



The CSS box model is rather complicated when it comes to content dimensions. The browser uses the values from your CSS to draw boxes and many factors can determine object dimensions.

Because of that each DOM element has six properties that can be used to determine element dimensions:

  - **offsetWidth**, **offsetHeight**: The size of the visual box including all borders. Can be calculated by adding width/height and paddings and borders, if the element has display: block.

  - **clientWidth**, **clientHeight**: The visual portion of the box content, not including borders or scroll bars, but includes padding. Can not be calculated directly from CSS, depends on the system's scroll bar size.

  - **scrollWidth**, **scrollHeight**: The size of all of the box's content, including the parts that are currently hidden outside the scrolling area. Can not be calculated directly from CSS, depends on the content.
