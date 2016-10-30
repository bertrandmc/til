### Notes on Browser Rendering Optimization by Google
https://www.udacity.com/course/browser-rendering-optimization--ud860



# 60 FPS for smooth experience
Frames must be constructed in less than 12ms (considering browser housekeeping time).

Here is the journey:

1. HTTP request.
2. Browser Parses the HTML and creates the DOM tree.
3. Browser Parses the CSS.
4. Browser Combines DOM and CSS and creates the Render Tree
    - Render tree only have elements that are going to be displayed.
    - it removes element with `display:none` and adds any pseudo elements like `:after`.

5. Browser calculates the layout
    At this stage elements styles affect each other, so calculation is complex and iterates, this is called `reflow`.
6. Rasterization (The process of drawing layout elements with pixels) `DevTools:Paint`
7. Image Decode + Resize, when the browser paints pixels to reproduce images `DevTools: Image Decode + Resize`
8. Composite Layers is the process of painting elements in different layers `DevTools: Composite Layers`

![frame joruney](frame.png)

All previous occurs in CPU, the result is uploaded to the GPU which puts the picture the result on screen.

This is how a typical frame pipeline looks for us in DevTools (See Frame.png)

There are several forms to trigger a frame pipeline (see https://csstriggers.com/):

  1 - You make a visual change either with CSS or Javascript.
    - Browser must recalculate styles.
    - If you change any layout property (like width, heigh, or positioning relative to other elements top/left/right...) the browser will have to check all the other elements and reflow the page
    - Any affected areas will have to be repainted and re-composited.

  2 - If you change paint only properties like background images, text color or shadows.
    - Browser recalculate styles.
    - Layout doesn't have to reflow because changes wont affect it.
    - Repaints
    - Re-composites

  3 - When individual layers change (like transform).
    - Browser recalculates style.
    - No reflow in layout.
    - No re-painting.
    - Re-composites.



### The Four Major Areas of a Web App

*LIRA:*

  Load `1sec`
  Idle `50ms`
  Response `100ms`
  Animations `16ms`


*Load*: Whatever users want to load
  This is important to optimize for the Critical Rendering Path. Ideal loading time is <1sec

*Idle*: Its when app has loaded an waiting for user to interact, this is a good opportunity to do the work that was delayed to meet the ideal loading time. Usually idle blocks should last for 50ms, thinking that user might interact after 100ms since load finished.

*Response*: Good UX should respond to any user interaction in <100ms, giving some visual feedback confirming that user action has triggered something. This becomes more challenging when user interaction triggers animations, as we have to perform at 60fps.

*Animations*: These must perform at 60 fps, that gives us 16 ms per frame, in reality we have <12ms to perform because browser also has to perform some housekeeping work.



### Javascript Just In Time (JIT)
Javascript code is recompiled in optimized code so it runs faster.

  - Avoid code micro optimizations (eg.: using while loop instead of for) because we don't know how the JIT will optimize the code.


### How to optimize JS For Animations:

- Execute JS as early as possible every frame.


### requestAnimationFrame
It tells the browser that you wish to perform an animation and requests that the browser call a specific function to update an animation before the next repaint.

  `window.requestAnimationFrame(callback)`

  Ideally the Javascript code should run in less than 3ms so the browser has 7-8ms to perform Style calculations, layout, painting and Composite.

  **** Don't use setTimeout or setInterval ****
  * Except for IE9 all browser have requestAnimationFrame, for IE9 use a polyfill which fallsback to setTimeout.



### Webworkers
Provides an interface to run scripts on the background.

    <!--  -->                 polyfil
    Main thread               Worker thread

      postMessage(data) --->  onMessage(data)

      onMessage(data)   <---  postMessage(data)



### Javascript Memory Management
Javascript is Garbage Collected so we don't have to worry about pointers etc, this means the browser has to run the garbage collector and this can pause our app.

see: http://lab.aerotwist.com/webgl/undulating-monkey/

*Changes on Opacity and Transform only triggers Composite when they are on their on layers*.



### Improve Style Calculations Performance

  - Performance costs to recalculate style grows linearly with the number of elements affected by a style change. So recalculating 1000 elements costs 10x more than recalculating 100 elements.

  - Block Element Modifier (BEM)
    Uses single class names to style elements, its performs better because class matching is faster.

  - Avoid forced synchronous layout calculation.
    Every time we query the DOM for layout measures, for example the offsetWidth of an element, DOM has to calculate layout, so avoid doing this inside loops for example and keep an eye on DevTools `Forced reflow is a likely performance bottleneck.` warning.



### Optimize Painting and Composite Performance

  Painting is the most expensive part on the rendering path, we want to avoid it as much as possible, its specially expensive in mobile devices.

  - Try to change properties which only trigger Composite (see https://csstriggers.com/).

  - Check what part of the page is being re-painted (green) Use DevTools rendering-> painting tool to see where painting is happening (in timeline press esc and select rendering tab bellow).

  - Once you know what parts are being repainted, select the paint profiler (timeline top paint checkbox).

  - Elements that paint a lot should be promoted to their own layer. The browser should handle this but we can control if we want.
    ```css
    .element {
      will-change: transform; // chrome and firefox
      transform: translateZ(0); // all browsers
    }
    ```

    Use both will-change and transform together:
     `transform: translateZ` is a hack and its use should be avoid as much as possible, not all browsers support the `will-change`, and in that case apply the hack, but ideally the browser should handle it (if only will-change is used)

  - Ideally you are aiming for no more than 2ms in update layer tree and 2ms in compositing. If you hit over that but still on 60fps its acceptable.

  - Inspect Layers (enable layers feature)

      1. Go to chrome://flags and enable “Enable 2. Developer Tools experiments.”
      3. Restart Chrome
      4. Open Chrome DevTools
      5. Click “Settings” (the gear icon in the 6. upper right corner)
      7. Click on “Experiments” in the left menu
      8. Check the “Layers panel” option
      9. Close, then re-open Chrome DevTools
      10. Now you should see the “Layers” tab (top right)
