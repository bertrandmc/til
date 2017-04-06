# Notes on Interactive £D Graphics Course from Udacity


<img src="images/yxz.png" width="200">


## Core Ideas

### Frames Per Second

Frames per Second
Films/TV: 24FPS and refresh rate 48 or 72 Hz
Video Games: 30-60FPS and refresh rate usually is 60 Hz

These numbers are tied to the hardware, most monitors nowadays refresh at 60 Hz, which means, display the image 60 times per second. This is called the refresh rate. This value gives an upper limit on the frame rate, the number of new images per second. An application can have fewer frames per second but that means when the monitor refreshes it will repeat some images.

Films have much smaller frames per second number because recording captures `motions blur`, When a camera creates an image, that image does not represents a single instant of time, but it represents the image over a period of time, that is why when trying to capture objects in movement they look blurry. See more info [here](https://en.wikipedia.org/wiki/Motion_blur).  


### View Frustum

<img src="images/frustum.png" width="400">

Frustum is the region of space in the modeled world that may appear on the screen; it is the field of view of the notional camera.

The view frustum is typically obtained by taking a frustum—that is a truncation with parallel planes—of the pyramid of vision, which is the adaptation of (idealized) cone of vision that a camera or eye would have to the rectangular viewports typically used in computer graphics.

<img src="images/view-frustum.svg" width="400">


### Scene

A scene consit of:

    1. Objects (usually described by geometry and material)
    2. Lights
    3. Camera


### Graphics Pipeline (rendering pipeline)
The sequence of steps used to create a 2D raster representation of a 3D scene. Plainly speaking, once a 3D model has been created, for instance in a video game or any other 3D computer animation, the graphics pipeline is the process of turning that 3D model into what the computer displays.

The 3D pipeline usually refers to the most common form of computer 3D rendering, 3D polygon rendering, distinct from raytracing, and raycasting. In particular, 3D polygon rendering is similar to raycasting. In raycasting, a ray originates at the point where the camera resides, if that ray hits a surface, then the color and lighting of the point on the surface where the ray hit is calculated. In 3D polygon rendering the reverse happens, the area that is in view of the camera is calculated, and then rays are created from every part of every surface in view of the camera and traced back to the camera.


1. **Application**:
First, the scene is created out of geometric primitives. Traditionally this is done using triangles, which are particularly well suited to this as they always exist on a single plane.

2. **Camera & Model Transform**:
Transform from the local coordinate system to the 3d world coordinate system.
Transform the 3d world coordinate system into the 3d camera coordinate system, with the camera as the origin.


3. **Rasterization**:
Rasterization is the process by which the 2D image space representation of the scene is converted into raster format and the correct resulting pixel values are determined. From now on, operations will be carried out on each single pixel. This stage is rather complex, involving multiple steps often referred as a group under the name of pixel pipeline.


### Algotithms

**Painters Algorithm**: Start painting the object which is must further away, the last painted object is the closest one. It has a flaw where it can't render a scene where objects interacts with each other independent of their position, imagine a cat at the back and a milk pot at the front but the cat's tail is wrapping around the milk pot, or 3 triangles where they stack on top of each other.

<img src="images/painter-algorithm-flaw.png" width="200">



**Z-Buffer**: Also known as **depth buffering**, is the management of image depth coordinates in 3D graphics, usually done in hardware, sometimes in software. It is one solution to the visibility problem, which is the problem of deciding which elements of a rendered scene are visible, and which are hidden. The painter's algorithm is another common solution which, though less efficient, can also handle non-opaque scene elements.

When an object is rendered, the depth of a generated pixel (z coordinate) is stored in a buffer (the z-buffer or depth buffer). This buffer is usually arranged as a two-dimensional array (x-y) with one element for each screen pixel. If another object of the scene must be rendered in the same pixel, the method compares the two depths and overrides the current pixel if the object is closer to the observer. The chosen depth is then saved to the z-buffer, replacing the old one. In the end, the z-buffer will allow the method to correctly reproduce the usual depth perception: a close object hides a farther one. This is called z-culling.

Because of Z-buffer, drawing object form front to back is what GPU's do to optimize rendering.

So we get the closest object and we spend the following cycles:

    1. 1 cycle to read the z-buffer (z-buffer here is empty so we can write to it as this object z position is the smallest).
    2. 1 cycle to write the z-buffer.
    3. 1 cycle to paint pixel color.

Then we get the second object, which is behind the first and we spend the following cycles:

    1. 1 cycle to read the z-buffer (we see that this object z value is higher than the actual in z-buffer, so we won't need to paint this pixel as the object is hidden).

If we started from the object further away we'd have to read, write and paint for every object.



### Geometric Objects

How geometric objects are defined for rendering:

3D point: defines a location in a 3D space.
3D vector: defines a direction in a 3D space.

In 3D computer graphics, we usually use a Cartesian Coordinate System. In this system we have an `origin` and three direction vectors called `x`, `y` and `z`.

<img src="images/cartesian-coordinates.png" width="200"/>

The `origin` is some fixed point in space whose location everyone agrees on


### Jargons

Spline: A fancy word for a type of curve. Spline curves are formed by carefully placing a few points, called control points.
