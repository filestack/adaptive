<p align="center">
  <a href="https://www.filestack.com"><img src="http://static.filestackapi.com/adaptive/adaptive.svg" align="center" width="230" /></a>  
</p>
<p align="center">
  <p align="center">Generate responsive HTML picture elements powered by on-the-fly Filestack image conversions.</p>
</p>
<p align="center">
  <a href="https://npmjs.com/package/filestack-adaptive"><img src="https://img.shields.io/npm/v/filestack-adaptive.svg" /></a>
  <a href="https://static.filestackapi.com/adaptive/adaptive.min.js"><img src="http://img.badgesize.io/http://static.filestackapi.com/adaptive/adaptive.min.js?compression=gzip&color=green" /></a>
  <a href="https://static.filestackapi.com/adaptive/adaptive.min.js"><img src="http://img.badgesize.io/http://static.filestackapi.com/adaptive/adaptive.min.js?color=green" /></a>
  <img src="https://img.shields.io/badge/module%20formats-cjs%2C%20umd%2C%20esm-green.svg" />
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" /></a>
<hr/>

You will need a Filestack developer account to use this library. Get a free one [here](https://dev.filestack.com/register/free).

If you're looking for a self-initializing Javascript solution please see the powerful [lazysizes](https://github.com/aFarkas/lazysizes) library.
It can integrate easily with Filestack conversions by using the [RIAS plugin](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/rias).

## Install

```bash
npm install filestack-adaptive
```

The `package.json` specifies three separate modules: 

* `main` for the CommonJS module
* `module` for the ES Module (suitable for bundlers like Webpack and Rollup)
* `browser` for the UMD module (usable in HTML script tags)

You can find a minified UMD module on the Filestack CDN [here](https://static.filestackapi.com/adaptive/adaptive.min.js).

## API Documentation

[https://filestack.github.io/adaptive/](https://filestack.github.io/adaptive/)

## What can this do?

Adaptive at its core is a generator for objects representing the structure of HTML picture tags. These in turn can be consumed by different interpreters. 

This library ships with a built-in virtual DOM adapter powered by [hyperx](https://github.com/choojs/hyperx), which allows you to simply call `picture(handle, options, renderer)`, where `renderer` can be any DOM builder supported by hyperx. If `renderer` is not provided then `picture` will default to returning plain DOM. For example it can support React components:

Browser (using umd):

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="https://static.filestackapi.com/adaptive/adaptive.min.js"></script>
<script>
  const options = { alt: 'downtown', sizes: { fallback: '100vw' } };
  const tree = fsAdaptive.picture('5aYkEQJSQCmYShsoCnZN', options, React.createElement);
  ReactDOM.render(tree, document.body);
</script>
```

Browser (using bundler):

```js
import react from 'react';
import reactDOM from 'react-dom';
import { picture } from 'filestack-adaptive';

// Need to spread children parameter to prevent React key warnings
const createElement = (Component, props, children) => {
  return React.createElement(Component, props, ...children);
};

const options = { alt: 'downtown', sizes: { fallback: '100vw' } };
const tree = picture('5aYkEQJSQCmYShsoCnZN', options, createElement);
ReactDOM.render(tree, document.body);
```

Server:

```js
import react from 'react';
import reactDOM from 'react-dom/server';
import { picture } from 'filestack-adaptive';

const toString = reactDOM.renderToString;
// Need to spread children parameter to prevent React key warnings
const createElement = (Component, props, children) => {
  return React.createElement(Component, props, ...children);
};

const options = { alt: 'downtown', sizes: { fallback: '100vw' } };
const tree = picture('5aYkEQJSQCmYShsoCnZN', options, createElement);
console.log(toString(tree));
```

The attribute structure returned from `makePictureTree` can be used in JSX directly, if for example you would prefer writing your own adapter (not using the `picture` helper).

JSX:

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

## Usage

Most cases can be covered with the `picture` function for generating plain DOM elements. Support for art direction (distinct/cropped images per media query) is not yet implemented.

```js
import { picture } from 'filestack-adaptive';

const options = { 
  alt: 'downtown', 
  sizes: { 
    fallback: '60vw',
  }, 
};
const el = picture('seW1thvcR1aQBfOCF8bX', options);
document.body.appendChild(el);
```

This will generate a DOM node with the following structure:

```html
<picture>
  <img alt="downtown" 
       sizes="60vw"
       src="https://cdn.filestackcontent.com/seW1thvcR1aQBfOCF8bX" 
       srcset="https://cdn.filestackcontent.com/resize=width:180/seW1thvcR1aQBfOCF8bX 180w, 
               https://cdn.filestackcontent.com/resize=width:360/seW1thvcR1aQBfOCF8bX 360w, 
               https://cdn.filestackcontent.com/resize=width:540/seW1thvcR1aQBfOCF8bX 540w, 
               https://cdn.filestackcontent.com/resize=width:720/seW1thvcR1aQBfOCF8bX 720w, 
               https://cdn.filestackcontent.com/resize=width:900/seW1thvcR1aQBfOCF8bX 900w, 
               https://cdn.filestackcontent.com/resize=width:1080/seW1thvcR1aQBfOCF8bX 1080w, 
               https://cdn.filestackcontent.com/resize=width:1296/seW1thvcR1aQBfOCF8bX 1296w, 
               https://cdn.filestackcontent.com/resize=width:1512/seW1thvcR1aQBfOCF8bX 1512w, 
               https://cdn.filestackcontent.com/resize=width:1728/seW1thvcR1aQBfOCF8bX 1728w, 
               https://cdn.filestackcontent.com/resize=width:1944/seW1thvcR1aQBfOCF8bX 1944w, 
               https://cdn.filestackcontent.com/resize=width:2160/seW1thvcR1aQBfOCF8bX 2160w, 
               https://cdn.filestackcontent.com/resize=width:2376/seW1thvcR1aQBfOCF8bX 2376w, 
               https://cdn.filestackcontent.com/resize=width:2592/seW1thvcR1aQBfOCF8bX 2592w, 
               https://cdn.filestackcontent.com/resize=width:2808/seW1thvcR1aQBfOCF8bX 2808w, 
               https://cdn.filestackcontent.com/resize=width:3024/seW1thvcR1aQBfOCF8bX 3024w">
</picture>
```

The srcset here is using a list of default resolutions that apply whenever `sizes` is specified, but these can be overridden. The alt is not required but it is strongly recommended to comply
with the HTML5 + ARIA specification. 

## Browser support

[Current state of picture support](http://caniuse.com/#search=picture).

For unsupported browsers we recommend the [picturefill](https://github.com/scottjehl/picturefill) polyfill.

## Examples

### Image width and pixel density

When the image width is known it will generate a srcset for HiDPI screens at 2x. More densities can be specified 
by passing an array to the `resolutions` option, e.g. `resolutions: ['1x', '2x', '3x']`.

```js
const options = { 
  alt: 'downtown', 
  width: '768px',
};
picture('seW1thvcR1aQBfOCF8bX', options);
```

Output:

```html
<picture>
  <img src="https://cdn.filestackcontent.com/resize=width:768/5aYkEQJSQCmYShsoCnZN" 
       srcset="https://cdn.filestackcontent.com/resize=width:768/5aYkEQJSQCmYShsoCnZN 1x, 
               https://cdn.filestackcontent.com/resize=width:1536/5aYkEQJSQCmYShsoCnZN 2x" 
       alt="downtown" 
       width="768">
</picture>
```

### Using width descriptors

You can specify generated widths by using `resolutions`, which takes an array 
of numbers or strings (e.g. `540` or `'540w'`).

```js
const options = { 
  alt: 'downtown', 
  sizes: {
    '(min-width: 1080px)': '100vw',
    fallback: '90vw',
  },
  resolutions: [540, 1080],
};
picture('seW1thvcR1aQBfOCF8bX', options);
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
       alt="downtown" 
       sizes="90vw">
</picture>
```

### WebP support

WebP can be used when it's supported by the browser. Filestack will take care of the image conversion 
and cache it on the delivery network for future requests.

```js
const options = { 
  alt: 'downtown', 
  formats: ['webp', 'jpg'], // order matters!
};
picture('seW1thvcR1aQBfOCF8bX', options);
```

Output:

```html
<picture>
  <source srcset="https://cdn.filestackcontent.com/output=format:webp/5aYkEQJSQCmYShsoCnZN" 
          type="image/webp">
  <source srcset="https://cdn.filestackcontent.com/output=format:jpg/5aYkEQJSQCmYShsoCnZN" 
          type="image/jpg"> 
  <img src="https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN" alt="downtown">
</picture>
```

## Future

Adaptive is joining an ecosystem already populated with many utilities for responsive images.
We want to remain flexible while still having some opinions on how to implement picture elements using Filestack conversions, and we know it is hard to 
cover every use case. Contributions and ideas are welcome that would help improve the usefulness of this library.

Current ideas:

* LQIP using the Filestack blur transformation
* Compress HiDPI images using Filestack compress task
* Implement art direction with Filestack crop 
* Develop a PostHTML transform for post-processing HTML using `makePictureTree`

