import { makePictureTree } from '../tree';
import { makePicture } from './DOM';

const React = require('react');
const reactDOM = require('react-dom/server');
const toString = reactDOM.renderToString;
const createElement = (Component: any, props: any, children: any[]) => {
  return React.createElement(Component, props, ...children);
};

const validator = require('html-validator');
const handle = 'seW1thvcR1aQBfOCF8bX';

const makeHTML = (el: any) => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <title>Test</title>
      </head>
      <body>
        ${toString(el)}
      </body>
    </html>
  `;
};

const isInvalid = (json: any) => {
  const data = JSON.parse(json);
  const types: string[] = data.messages.map((m: any) => m.type);
  return types.indexOf('error') !== -1;
};

describe('DOM adapter', () => {
  it('sanity - should invalidate an img without alt', (done) => {
    const options = {
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done();
        } else {
          done('HTML was valid :(');
        }
      })
      .catch((err: Error) => {
        done(err);
      });
  });

  it('should generate a valid picture element with width and pixel density', (done) => {
    const options = {
      alt: 'downtown',
      width: '768px',
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done('HTML invalid');
        } else {
          done();
        }
      })
      .catch((err: Error) => {
        done(err);
      });
  });

  it('should generate a valid picture element with 1 size and width descriptors', (done) => {
    const options = {
      alt: 'downtown',
      sizes: {
        '(min-width: 640px)': '80vw',
        fallback: '100vw',
      },
      resolutions: [540, 670, 1080],
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done('HTML invalid');
        } else {
          done();
        }
      })
      .catch((err: Error) => {
        done(err);
      });
  });

  it('should generate a valid picture element with 2 formats and 2 sizes', (done) => {
    const options = {
      alt: 'downtown',
      sizes: {
        '(min-width: 640px)': '80vw',
        '(min-width: 320px)': '700px',
        fallback: '100vw',
      },
      formats: ['webp', 'jpg'],
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done('HTML invalid');
        } else {
          done();
        }
      })
      .catch((err: Error) => {
        console.log('###11111111');
        done(err);
      });
  });

  it('should generate a valid picture element with 1 format and fallback', (done) => {
    const options = {
      alt: 'downtown',
      sizes: {
        fallback: '100vw',
      },
      formats: ['webp', 'jpg'],
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done('HTML invalid');
        } else {
          done();
        }
      })
      .catch((err: Error) => {
        done(err);
      });
  });

  it('should generate a valid picture element with 1 format', (done) => {
    const options = {
      alt: 'downtown',
      formats: ['webp'],
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done('HTML invalid');
        } else {
          done();
        }
      })
      .catch((err: Error) => {
        done(err);
      });
  });

  it('should generate a valid picture element with img fallback size and 2 width descriptors', (done) => {
    const options = {
      alt: 'downtown',
      sizes: {
        fallback: '100vw',
      },
      resolutions: ['320w', '640w'],
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done('HTML invalid');
        } else {
          done();
        }
      })
      .catch((err: Error) => {
        done(err);
      });
  });

  it('should generate a valid picture element with 1 fallback size and 1 format', (done) => {
    const options = {
      alt: 'downtown',
      formats: ['webp'],
      resolutions: [640],
      sizes: {
        fallback: '700px',
      },
    };
    const picture = makePicture(createElement, makePictureTree(handle, options));
    validator({ data: makeHTML(picture) })
      .then((data: any) => {
        if (isInvalid(data)) {
          done('HTML invalid');
        } else {
          done();
        }
      })
      .catch((err: Error) => {
        done(err);
      });
  });
});
