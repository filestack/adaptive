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
  <a href="https://static.filestackapi.com/adaptive/1.4.0/adaptive.min.js">
    <img src="http://img.badgesize.io/http://static.filestackapi.com/adaptive/1.4.0/adaptive.min.js?compression=gzip&color=green" />
  </a>
  <a href="https://static.filestackapi.com/adaptive/1.4.0/adaptive.min.js">
    <img src="http://img.badgesize.io/http://static.filestackapi.com/adaptive/1.4.0/adaptive.min.js?color=green" />
  </a>
  <img src="https://img.shields.io/badge/module%20formats-cjs%2C%20umd%2C%20esm-green.svg" />
  <br/>
  <img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=38&firefox=38&microsoftedge=13&safari=9.1&opera=25" />
</p>

<hr/>

**Table of Contents**

<!-- toc -->
- [What is Adaptive](#what-is-adaptive)
  - [Features](#features)
- [Usage](#usage)
  - [Browser](#browser)
    - [SRI](#sri)
  - [Node (react example)](#node-react-example)
    - [Use with JSX](#use-with-jsx)
  - [Storage aliases and external urls](#storage-aliases-and-external-urls)
  - [Image width and pixel density](#image-width-and-pixel-density)
  - [Webcomponent](#webcomponent)
  - [Using width descriptors](#using-width-descriptors)
  - [WebP support](#webp-support)
  - [Custom CNAME](#custom-cname)
  - [Transformations support](#transformations-support)
    - [Disable validator](#disable-validator)
- [Development](#development)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Future](#future)

## What is Adaptive
Adaptive is a tool which allow [Filestack](https://github.com/filestack/filestack-js) users to combine the power of on-the-fly image processing with the latest standard for responsive web images.


This library ships with a built-in virtual DOM adapter powered by hyperx, which allows you to simply call `picture(source, options, renderer)`, where renderer can be any DOM builder supported by hyperx (e.g React.createElement). If renderer is not provided then picture will default to returning plain DOM. 


### Features
- Focus on usability and performance
- Works with Filestack [handles](https://www.filestack.com/docs/concepts/getting-started/#vocabulary), [storage aliases](https://www.filestack.com/docs/concepts/storage/#storage-aliases) and external urls
- Support for different sizes and formats in srcSet
- Allows you to add some [image transformations](https://www.filestack.com/docs/api/processing/#image-transformations)
- Easily integrable with external virtual DOM renderers

## Usage

### Browser
You can find the newest version at https://static.filestackapi.com/adaptive/1.4.0/adaptive.min.js
<br>
```html
    <script src="https://static.filestackapi.com/adaptive/1.4.0/adaptive.min.js" crossorigin="anonymous"></script>
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
#### SRI
Subresource Integrity (SRI) is a security feature that enables browsers to verify that files they fetch (for example, from a CDN) are delivered without unexpected manipulation. It works by allowing you to provide a cryptographic hash that a fetched file must match

To obtain sri hashes for adaptive library check manifest.json file on CDN:

```
https://static.filestackapi.com/adaptive/{LIBRARY_VERSION}/manifest.json
```

```HTML
<script src="//static.filestackapi.com/adaptive/{LIBRARY_VERSION}/adaptive.min.js" integrity="{FILE_HASH}" crossorigin="anonymous"></script>
```

Where ```{LIBRARY_VERSION}``` is currently used library version and ```{FILE_HASH}``` is one of the hashes from integrity field in manifest.json file


### Node (react example)
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
const tree = picture(FILESTACK_HANDLE, options, createElement);
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
### Storage aliases and external urls
You can also use [Filestack storage alias](https://www.filestack.com/docs/concepts/storage/#storage-aliases) or external urls as an image source:
```html
  <script src="https://static.filestackapi.com/adaptive/1.4.0/adaptive.min.js"></script>
  <script>
      const options = {
          alt: 'windsurfer',
          sizes: {
              fallback: '60vw',
          }
      };
      const srcHandle1 = {
        srcHandle: 'src://your_storage_alias_name/example.jpg',
        apiKey: 'YOUR_FILESTACK_API_KEY'
      };
      const el1 = fsAdaptive.picture(srcHandle1, options);
      document.body.appendChild(el1);


      const srcHandle2 = {
        srcHandle: 'https://yourdomain.com/photo1.jpg,
        apiKey: 'YOUR_FILESTACK_API_KEY'
      };
      const el2 = fsAdaptive.picture(srcHandle2, options);
      document.body.appendChild(el2);
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
picture(FILESTACK_HANDLE, options);
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

### Webcomponent
Adaptive now supports webcomponent. Supported options: src, width, alt, cname, policy, signature, keys, resolutions
```HTML
<fs-adaptive src="NxW2v528S9W6K1l5LnFS" width="769px" alt="windsurfer" ></fs-adaptive>
```

Output:

```html
<picture>
  <img src="https://cdn.filestackcontent.com/resize=width:768/NxW2v528S9W6K1l5LnFS" 
       srcset="https://cdn.filestackcontent.com/resize=width:768/NxW2v528S9W6K1l5LnFS 1x, 
               https://cdn.filestackcontent.com/resize=width:1536/NxW2v528S9W6K1l5LnFS 2x" 
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
picture(FILESTACK_HANDLE, options);
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
picture(FILESTACK_HANDLE, options);
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
### Custom CNAME

In order to use custom cname for generated file links just use cname option: 
```js
const options = { 
  cname: 'fs.test123.com'
};
picture(FILESTACK_HANDLE, options);
```

Output:
```html
<picture>
  <img src="https://cdn.fs.test123.com/5aYkEQJSQCmYShsoCnZN">
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
picture(FILESTACK_HANDLE, options);
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

## Development
To install and work on Adaptiv locally:
```bash
git clone git@github.com:filestack/adaptive.git
cd adaptive
npm install
```
To create build directory:
```
npm run build
```
This newly created directory contains
```text
build/
├── browser/                # for the UMD module (usable in HTML script tags)
   └── index.umd.js         #
├── main/                   # for the CommonJS module
   ├── ...                  #
   └── index.js             # 
└── module/                 # for the ES Module (suitable for bundlers like Webpack and Rollup)
   ├── ...                  #
   └── index.js             #
```

## Documentation
For more info about available methods and options check browser documentation:
<br>
https://filestack.github.io/adaptive/

## Contributing
We follow the [conventional commits](https://conventionalcommits.org/) specification to ensure consistent commit messages and changelog formatting.

## Future
Adaptive is joining an ecosystem already populated with many utilities for responsive images.
We want to remain flexible while still having some opinions on how to implement picture elements using Filestack conversions, and we know it is hard to 
cover every use case. Contributions and ideas are welcome that would help improve the usefulness of this library.

Current ideas:

* LQIP using the Filestack blur transformation
* Compress HiDPI images using Filestack compress task
* Implement art direction with Filestack crop 
* Develop a PostHTML transform for post-processing HTML using `makePictureTree`
