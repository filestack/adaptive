<p align="center">
  <a href="https://www.filestack.com"><img src="http://static.filestackapi.com/adaptive/adaptive.svg?refresh" align="center" width="230" /></a>  
</p>

<p align="center">
  Generate responsive HTML picture elements powered by  on-the-fly <a href="https://github.com/filestack/">Filestack</a> image conversions.
</p>

<p align="center">
  <a href="https://travis-ci.org/filestack/adaptive">
    <img src="https://travis-ci.org/filestack/adaptive.svg?branch=develop" />
  </a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/filestack-adaptive">
    <img src="https://img.shields.io/npm/v/filestack-adaptive.svg" />
  </a>
  <a href="https://static.filestackapi.com/adaptive/adaptive.min.js">
    <img src="http://img.badgesize.io/http://static.filestackapi.com/adaptive/adaptive.min.js?compression=gzip&color=green" />
  </a>
  <a href="https://static.filestackapi.com/adaptive/adaptive.min.js">
    <img src="http://img.badgesize.io/http://static.filestackapi.com/adaptive/adaptive.min.js?color=green" />
  </a>
  <img src="https://img.shields.io/badge/module%20formats-cjs%2C%20umd%2C%20esm-green.svg" />
  <br/>
  <img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=38&firefox=38&microsoftedge=13&safari=9.1&opera=25" />
</p>



<hr/>

**Table of Contents**

<!-- toc -->
- [What is Adaptive](#what-is-adaptive)
- [Installation](#installation)
- [Usage](#usage)
  - [CDN](#cdn)
  - [NPM (react example)](#npm-react-example)
    - [Use with JSX](#use-with-jsx)
  - [Transformations support](#transformations-support)
    - [Disable validator](#disable-validator)
  - [Storage aliases](#storage-aliases)
  - [Image width and pixel density](#image-width-and-pixel-density)
  - [Using width descriptors](#using-width-descriptors)
  - [WebP support](#webp-support)
- [Development](#development)
- [Documentation](#documentation)
- [Future](#future)

## What is Adaptive
Adaptive is a tool which allow [Filestack](https://github.com/filestack/filestack-js) users to combine the power of on-the-fly image processing with the latest standard for responsive web images.


This library ships with a built-in virtual DOM adapter powered by hyperx, which allows you to simply call `picture(source, options, renderer)`, where renderer can be any DOM builder supported by hyperx (e.g React.createElement). If renderer is not provided then picture will default to returning plain DOM. 


### Features
- Focus on usability and performance
- Works with Filestack [handles](https://www.filestack.com/docs/concepts/getting-started/#vocabulary) and [storage aliases](https://www.filestack.com/docs/concepts/storage/#storage-aliases)
- Support for different sizes and formats in srcSet
- Allows you to add some [image transformations](https://www.filestack.com/docs/api/processing/#image-transformations)
- Easily integrable with external virtual DOM renderers

## Usage

### CDN
You can find the newest version at https://static.filestackapi.com/adaptive/adaptive.min.js
<br>
or use fixed version
https://static.filestackapi.com/adaptive/0.2.7/adaptive.min.js
```html
    <script src="https://static.filestackapi.com/adaptive/adaptive.min.js"></script>
    <script>
        const options = {
            alt: 'windsurfer',
            sizes: {
                fallback: '60vw',
            }
        };
        const el = fsAdaptive.picture(FILESTACK_HANDLE, options);
        document.body.appendChild(el);
    </script>
```
Output:
```html
<picture>
    <img src="https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN"
         srcset="
            https://cdn.filestackcontent.com/resize=width:180/5aYkEQJSQCmYShsoCnZN 180w, 
            https://cdn.filestackcontent.com/resize=width:360/5aYkEQJSQCmYShsoCnZN 360w, 
            https://cdn.filestackcontent.com/resize=width:540/5aYkEQJSQCmYShsoCnZN 540w, 
            https://cdn.filestackcontent.com/resize=width:720/5aYkEQJSQCmYShsoCnZN 720w, 
            https://cdn.filestackcontent.com/resize=width:900/5aYkEQJSQCmYShsoCnZN 900w, 
            https://cdn.filestackcontent.com/resize=width:1080/5aYkEQJSQCmYShsoCnZN 1080w, 
            https://cdn.filestackcontent.com/resize=width:1296/5aYkEQJSQCmYShsoCnZN 1296w, 
            https://cdn.filestackcontent.com/resize=width:1512/5aYkEQJSQCmYShsoCnZN 1512w, 
            https://cdn.filestackcontent.com/resize=width:1728/5aYkEQJSQCmYShsoCnZN 1728w, 
            https://cdn.filestackcontent.com/resize=width:1944/5aYkEQJSQCmYShsoCnZN 1944w, 
            https://cdn.filestackcontent.com/resize=width:2160/5aYkEQJSQCmYShsoCnZN 2160w, 
            https://cdn.filestackcontent.com/resize=width:2376/5aYkEQJSQCmYShsoCnZN 2376w, 
            https://cdn.filestackcontent.com/resize=width:2592/5aYkEQJSQCmYShsoCnZN 2592w,
            https://cdn.filestackcontent.com/resize=width:2808/5aYkEQJSQCmYShsoCnZN 2808w, 
            https://cdn.filestackcontent.com/resize=width:3024/5aYkEQJSQCmYShsoCnZN 3024w"
         alt="photo_01" 
         sizes="60vw">
</picture>
```
### NPM (react example)
```bash
npm install filestack-adaptive
```
```js
import react from 'react';
import reactDOM from 'react-dom';
import { picture } from 'filestack-adaptive';

// Need to spread children parameter to prevent React key warnings
const createElement = (Component, props, children) => {
  return React.createElement(Component, props, ...children);
};

const options = { alt: 'windsurfer', sizes: { fallback: '100vw' } };
const tree = picture('5aYkEQJSQCmYShsoCnZN', options, createElement);
ReactDOM.render(tree, document.body);
```
#### Use with JSX
In a case of need to create your own `<picture/>` element you can call **makePictureTree** directly in your JSX
```js
import React, { Component } from 'react';
import { makePictureTree } from 'filestack-adaptive';

class Picture extends Component {
  renderSources(sources) {
    return sources.map((sourceObj) => {
      return <source {...sourceObj} />;
    });
  }
  renderImage(imageObj) {
    return <img {...imageObj} />;
  }
  render() {
    const tree = makePictureTree(this.props.handle, this.props);
    return (
      <picture>
        {tree.sources && this.renderSources(tree.sources)}
        {this.renderImage(tree.img)}
      </picture>
    );
  }
}

export default Picture;
```
### Storage aliases
You can also use Filestack storage alias as an image source:
```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="https://static.filestackapi.com/adaptive/adaptive.min.js"></script>
<script>
  const options = { 
    alt: 'windsurfer', 
    sizes: { 
      fallback: '100vw' 
    } 
  };
  const tree = fsAdaptive.picture('5aYkEQJSQCmYShsoCnZN', options, React.createElement);
  ReactDOM.render(tree, document.body);
</script>
```
### Image width and pixel density

When the image width is known it will generate a srcset for HiDPI screens at 2x. More densities can be specified 
by passing an array to the `resolutions` option, e.g. `resolutions: ['1x', '2x', '3x']`.

```js
const options = { 
  alt: 'windsurfer', 
  width: '768px',
};
picture('5aYkEQJSQCmYShsoCnZN', options);
```

Output:

```html
<picture>
  <img src="https://cdn.filestackcontent.com/resize=width:768/5aYkEQJSQCmYShsoCnZN" 
       srcset="https://cdn.filestackcontent.com/resize=width:768/5aYkEQJSQCmYShsoCnZN 1x, 
               https://cdn.filestackcontent.com/resize=width:1536/5aYkEQJSQCmYShsoCnZN 2x" 
       alt="windsurfer" 
       width="768">
</picture>
```

### Using width descriptors

You can specify generated widths by using `resolutions`, which takes an array 
of numbers or strings (e.g. `540` or `'540w'`).

```js
const options = { 
  alt: 'windsurfer', 
  sizes: {
    '(min-width: 1080px)': '100vw',
    fallback: '90vw',
  },
  resolutions: [540, 1080],
};
picture('5aYkEQJSQCmYShsoCnZN', options);
```

Output:

```html
<picture>
  <source media="(min-width: 1080px)" 
          sizes="100vw" 
          srcset="https://cdn.filestackcontent.com/resize=width:540/5aYkEQJSQCmYShsoCnZN 540w, 
          https://cdn.filestackcontent.com/resize=width:1080/5aYkEQJSQCmYShsoCnZN 1080w"> 
  <img src="https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN" 
       srcset="https://cdn.filestackcontent.com/resize=width:540/5aYkEQJSQCmYShsoCnZN 540w, 
               https://cdn.filestackcontent.com/resize=width:1080/5aYkEQJSQCmYShsoCnZN 1080w" 
       alt="windsurfer" 
       sizes="90vw">
</picture>
```

### WebP support

WebP can be used when it's supported by the browser. Filestack will take care of the image conversion 
and cache it on the delivery network for future requests.

```js
const options = { 
  alt: 'windsurfer', 
  formats: ['webp', 'jpg'], // order matters!
};
picture('5aYkEQJSQCmYShsoCnZN', options);
```

Output:

```html
<picture>
  <source srcset="https://cdn.filestackcontent.com/output=format:webp/5aYkEQJSQCmYShsoCnZN" 
          type="image/webp">
  <source srcset="https://cdn.filestackcontent.com/output=format:jpg/5aYkEQJSQCmYShsoCnZN" 
          type="image/jpg"> 
  <img src="https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN" alt="windsurfer">
</picture>
```

### Transformations support

Adaptive also supports Filestack transformations.
Available options are listed in doc:

https://www.filestack.com/docs/image-transformations

```js
const options = {
  alt: 'windsurfer', 
  width: 400,
  transforms: {
    blur: {
      amount: 5
    },
    border: true, // use default options of border transformation
  }
};
picture('5aYkEQJSQCmYShsoCnZN', options);
```

Output:

```html
<picture>
  <img src="https://cdn.filestackcontent.com/blur=amount:5/border/resize=width:400/5aYkEQJSQCmYShsoCnZN" srcset="https://cdn.filestackcontent.com/blur=amount:5/border/resize=width:400/5aYkEQJSQCmYShsoCnZN 1x, https://cdn.filestackcontent.com/blur=amount:5/border/resize=width:800/5aYkEQJSQCmYShsoCnZN 2x" alt="windsurfer" width="400">
</picture>

```
#### Disable validator
To speed up generating of final output (useful when you have a bunch of images on your site) you can optionally disable validation of transformation params by passing additional prop in options:
```js
const options = {
  ...
  useValidator: false,
  ...
}
```

## Development & contribution

## Documentation
For more info about available methods and options check browser documentation:
<br>
https://filestack.github.io/adaptive/

## Future
Adaptive is joining an ecosystem already populated with many utilities for responsive images.
We want to remain flexible while still having some opinions on how to implement picture elements using Filestack conversions, and we know it is hard to 
cover every use case. Contributions and ideas are welcome that would help improve the usefulness of this library.

Current ideas:

* LQIP using the Filestack blur transformation
* Compress HiDPI images using Filestack compress task
* Implement art direction with Filestack crop 
* Develop a PostHTML transform for post-processing HTML using `makePictureTree`
