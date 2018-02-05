import { TransformationOptions } from './transformations';
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

describe('ImageTransformations ', () => {

  it('should apply transforms to url', () => {
    let transforms: TransformationOptions = {
      crop: {
        dim: [1, 2, 3, 4],
      },
      partial_pixelate: {
        objects: [[92,53,214,207]],
      },
    };

    const options = {
      width: '768px',
      transforms,
    };

    const tree = makePictureTree(handle, options);
    const srcSet = `${result('crop=dim:[1,2,3,4]/partial_pixelate=objects:[[92,53,214,207]]/resize=width:768')} 1x, ${result('crop=dim:[1,2,3,4]/partial_pixelate=objects:[[92,53,214,207]]/resize=width:1536')} 2x`;
    const expected = {
      img: {
        width: 768,
        src: result('crop=dim:[1,2,3,4]/partial_pixelate=objects:[[92,53,214,207]]/resize=width:768'),
        srcSet,
      },
    };

    assert.deepEqual(tree, expected);
  });

  it('should overwrite transformOption.resize.width when width is provided', () => {
    let transforms: TransformationOptions = {
      blur_faces: {
        minsize: 0.1,
      },
      crop: {
        dim: [1, 2, 3, 4],
      },
      flip: true,
      resize: {
        width: 100,
      },
    };

    const options = {
      width: '768px',
      transforms,
    };

    const tree = makePictureTree(handle, options);
    const srcSet = `${result('blur_faces=minsize:0.1/crop=dim:[1,2,3,4]/flip/resize=width:768')} 1x, ${result('blur_faces=minsize:0.1/crop=dim:[1,2,3,4]/flip/resize=width:1536')} 2x`;
    const expected = {
      img: {
        width: 768,
        src: result('blur_faces=minsize:0.1/crop=dim:[1,2,3,4]/flip/resize=width:768'),
        srcSet,
      },
    };

    assert.deepEqual(tree, expected);
  });

  it('should throw exception when wrong option is provided maxRange', () => {
    let transforms: TransformationOptions = {
      crop: {
        dim: [1, 2, 3, 4],
      },
      blur: {
        amount: 100,
      },
    };

    const options = {
      width: '768px',
      transforms,
    };

    assert.throws(() => makePictureTree(handle, options));
  });

  it('should throw exception when wrong option is provided minRange', () => {
    let transforms: TransformationOptions = {
      crop: {
        dim: [1, 2, 3, 4],
      },
      blur: {
        amount: 1,
      },
    };

    const options = {
      width: '768px',
      transforms,
    };

    assert.throws(() => makePictureTree(handle, options));
  });
});
