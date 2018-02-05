import { makePictureTree } from './tree';
import * as assert from 'assert';

const handle = 'seW1thvcR1aQBfOCF8bX';
const baseURL = 'https://cdn.filestackcontent.com';
const result = (opts?: any) => {
  if (opts) {
    return `${baseURL}/${opts}/${handle}`;
  }
  return `${baseURL}/${handle}`;
};

describe('makePictureTree', () => {

  it('should throw if handle is not a string', () => {
    assert.throws(() => makePictureTree());
  });

  it('should not let a user use width descriptors without at least one size (numbers)', () => {
    const options = {
      resolutions: [320, 420],
    };
    assert.throws(() => makePictureTree(handle, options));
  });

  it('should not let a user use width descriptors without at least one size (strings)', () => {
    const options = {
      resolutions: ['320w', '420w'],
    };
    assert.throws(() => makePictureTree(handle, options));
  });

  it('should not let a user pass sizes with pixel densities', () => {
    const options = {
      sizes: {
        '(min-width: 1080px)': '100vw',
        fallback: '90vw',
      },
      resolutions: ['1x', '2x'],
    };
    assert.throws(() => makePictureTree(handle, options));
  });

  it('should not let a user specify resolutions if no width is set', () => {
    const options = {
      resolutions: ['1x', '2x'],
    };
    assert.throws(() => makePictureTree(handle, options));
  });

  it('should generate a picture object with no sources', () => {
    const obj = makePictureTree(handle, { keys: false });
    const url = result();
    const expected = {
      img: {
        src: url,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with no sources (no resolutions) with security', () => {
    const obj = makePictureTree(handle, {
      resolutions: [],
      security: {
        policy: 'abc',
        signature: 'xyz',
      },
      keys: false,
    });
    const url = result(`security=policy:abc,signature:xyz`);
    const expected = {
      img: {
        src: url,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 1 source', () => {
    const testSize1 = { '(min-width: 640px)': '50vw' };
    const resolutions = [320, 640];
    const obj = makePictureTree(handle, { sizes: testSize1, resolutions, keys: false });
    const srcSet = `${result('resize=width:320')} 320w, ${result('resize=width:640')} 640w`;
    const expected = {
      sources: [
        {
          media: '(min-width: 640px)',
          sizes: '50vw',
          srcSet,
        },
      ],
      img: {
        src: result(),
        srcSet,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 1 source and img fallback size', () => {
    const testSize1 = {
      '(min-width: 640px)': '50vw',
      fallback: '300px',
    };
    const resolutions = [320, 640];
    const obj = makePictureTree(handle, { sizes: testSize1, resolutions, keys: false });
    const srcSet = `${result('resize=width:320')} 320w, ${result('resize=width:640')} 640w`;
    const expected = {
      sources: [
        {
          media: '(min-width: 640px)',
          sizes: '50vw',
          srcSet,
        },
      ],
      img: {
        sizes: '300px',
        src: result('resize=width:300'),
        srcSet,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 1 source with security', () => {
    const testSize1 = { '(min-width: 640px)': '50vw' };
    const resolutions = [320, 640];
    const obj = makePictureTree(handle, {
      sizes: testSize1,
      resolutions,
      security: {
        policy: 'abc',
        signature: 'xyz',
      },
      keys: false,
    });
    const srcSet = `${result('security=policy:abc,signature:xyz/resize=width:320')} 320w, ${result('security=policy:abc,signature:xyz/resize=width:640')} 640w`;
    const expected = {
      sources: [
        {
          media: '(min-width: 640px)',
          sizes: '50vw',
          srcSet,
        },
      ],
      img: {
        src: result('security=policy:abc,signature:xyz'),
        srcSet,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 1 source and 1 format', () => {
    const testSize1 = { '(min-width: 640px)': '50vw' };
    const resolutions = [320, 640];
    const obj = makePictureTree(handle, {
      sizes: testSize1,
      resolutions,
      formats: ['webp'],
      keys: false,
    });
    const imgSrcset = `${result('resize=width:320')} 320w, ${result('resize=width:640')} 640w`;
    const url = `${result('output=format:webp/resize=width:320')} 320w, ${result('output=format:webp/resize=width:640')} 640w`;
    const expected = {
      sources: [
        {
          media: '(min-width: 640px)',
          sizes: '50vw',
          srcSet: url,
          type: 'image/webp',
        },
      ],
      img: {
        src: result(),
        srcSet: imgSrcset,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 1 format', () => {
    const obj = makePictureTree(handle, { formats: ['webp'], keys: false });
    const url = result('output=format:webp');
    const expected = {
      sources: [
        {
          srcSet: url,
          type: 'image/webp',
        },
      ],
      img: {
        src: result(),
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 2 formats and 1 size with fallback size', () => {
    const obj = makePictureTree(handle, {
      formats: ['webp', 'jpg'],
      resolutions: [640],
      sizes: {
        '(min-width: 640px)': '90vw',
        fallback: '80vw',
      },
      keys: false,
    });
    const expected = {
      sources: [
        {
          media: '(min-width: 640px)',
          sizes: '90vw',
          srcSet: `${result('output=format:webp/resize=width:640')} 640w`,
          type: 'image/webp',
        },
        {
          media: '(min-width: 640px)',
          sizes: '90vw',
          srcSet: `${result('output=format:jpg/resize=width:640')} 640w`,
          type: 'image/jpg',
        },
        {
          sizes: '80vw',
          srcSet: `${result('output=format:webp/resize=width:640')} 640w`,
          type: 'image/webp',
        },
        {
          sizes: '80vw',
          srcSet: `${result('output=format:jpg/resize=width:640')} 640w`,
          type: 'image/jpg',
        },
      ],
      img: {
        sizes: '80vw',
        src: result(),
        srcSet: `${result('resize=width:640')} 640w`,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 1 format with fallback size', () => {
    const obj = makePictureTree(handle, {
      formats: ['webp'],
      resolutions: [640],
      sizes: {
        fallback: '700px',
      },
      keys: false,
    });
    const expected = {
      sources: [
        {
          sizes: '700px',
          srcSet: `${result('resize=width:640/output=format:webp')} 640w`,
          type: 'image/webp',
        },
      ],
      img: {
        sizes: '700px',
        src: result('resize=width:700'),
        srcSet: `${result('resize=width:640')} 640w`,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with 2 sources and 2 formats in order', () => {
    const testSize1 = {
      '(min-width: 640px)': '50vw',
      '(min-width: 340px)': '33vw',
    };
    const resolutions = ['320w', '640w'];
    const obj = makePictureTree(handle, {
      sizes: testSize1,
      formats: ['jpg', 'webp'],
      resolutions,
      keys: false,
    });
    const imgSrcset = `${result('resize=width:320')} 320w, ${result('resize=width:640')} 640w`;
    const srcSet1 = `${result('output=format:jpg/resize=width:320')} 320w, ${result('output=format:jpg/resize=width:640')} 640w`;
    const srcSet2 = `${result('output=format:webp/resize=width:320')} 320w, ${result('output=format:webp/resize=width:640')} 640w`;
    const srcSet3 = `${result('output=format:jpg/resize=width:320')} 320w, ${result('output=format:jpg/resize=width:640')} 640w`;
    const srcSet4 = `${result('output=format:webp/resize=width:320')} 320w, ${result('output=format:webp/resize=width:640')} 640w`;
    const expected = {
      sources: [
        {
          media: '(min-width: 640px)',
          sizes: '50vw',
          srcSet: srcSet3,
          type: 'image/jpg',
        },
        {
          media: '(min-width: 640px)',
          sizes: '50vw',
          srcSet: srcSet4,
          type: 'image/webp',
        },
        {
          media: '(min-width: 340px)',
          sizes: '33vw',
          srcSet: srcSet1,
          type: 'image/jpg',
        },
        {
          media: '(min-width: 340px)',
          sizes: '33vw',
          srcSet: srcSet2,
          type: 'image/webp',
        },
      ],
      img: {
        src: result(),
        srcSet: imgSrcset,
      },
    };
    assert.deepEqual(obj, expected);
  });

  it('should generate a picture object with a fallback size (no resolutions)', () => {
    const options = {
      sizes: {
        fallback: '100vw',
      },
      resolutions: [],
      keys: false,
    };
    const tree = makePictureTree(handle, options);
    const expected = {
      img: {
        src: result(),
        sizes: '100vw',
      },
    };
    assert.deepEqual(tree, expected);
  });

  it('should generate a picture object with a fallback size (resolutions)', () => {
    const options = {
      sizes: {
        fallback: '100vw',
      },
      resolutions: [320, 640],
      keys: false,
    };
    const srcSet = `${result('resize=width:320')} 320w, ${result('resize=width:640')} 640w`;
    const tree = makePictureTree(handle, options);
    const expected = {
      img: {
        src: result(),
        sizes: '100vw',
        srcSet,
      },
    };
    assert.deepEqual(tree, expected);
  });

  it('should generate a picture object with a fallback img and 1 source (1 resolution)', () => {
    const options = {
      sizes: {
        '(min-width: 1080px)': '100vw',
        fallback: '300px',
      },
      resolutions: [320, 640],
      keys: false,
    };
    const srcSet = `${result('resize=width:320')} 320w, ${result('resize=width:640')} 640w`;
    const tree = makePictureTree(handle, options);
    const expected = {
      img: {
        src: result('resize=width:300'),
        sizes: '300px',
        srcSet,
      },
      sources: [
        {
          media: '(min-width: 1080px)',
          sizes: '100vw',
          srcSet,
        },
      ],
    };
    assert.deepEqual(tree, expected);
  });

  it('should generate a single img element using width and pixel densities', () => {
    const options = {
      width: '768px',
      keys: false,
    };
    const srcSet = `${result('resize=width:768')} 1x, ${result('resize=width:1536')} 2x`;
    const expected = {
      img: {
        width: 768,
        src: result('resize=width:768'),
        srcSet,
      },
    };
    const tree = makePictureTree(handle, options);
    assert.deepEqual(tree, expected);
  });
});
