import * as R from 'ramda';
import { TransformOptions, Filelink } from 'filestack-js';

export interface FileHandleByStorageAlias {
  srcHandle: string;
  apiKey: string;
}

export type FileHandle = string | FileHandleByStorageAlias;

function isFileHandleByStorageAlias(handle: String | FileHandleByStorageAlias | undefined): handle is FileHandleByStorageAlias {
  return (handle as FileHandleByStorageAlias).srcHandle !== undefined;
}

export interface Img {
  alt?: string;
  sizes?: string;
  src: string;
  srcset?: string;
  width?: string;
}

export interface Source {
  media?: string;
  sizes?: string;
  srcset: string;
  type?: string;
  key?: string;
}

export interface Picture {
  img: Img;
  sources?: Source[];
}

export interface Size {
  [mediaquery: string]: string;
}

export interface Security {
  policy: string;
  signature: string;
}

export interface PictureOptions {
  /**
   * Alt name for image element.
   */
  alt?: string;
  /**
   * Array of image types, e.g. ['jpg', 'webp'].
   */
  formats?: string[];
  /**
   * Toggle setting key attribute on sources. Useful for React.
   * Defaults to true.
   */
  keys?: boolean;
  /**
   * Resolution descriptors. Defaults to a sensible range
   * between 180w and 3024w. Can also be numbers representing widths
   * or strings representing pixel densities, e.g. ['1x', '2x'].
   */
  resolutions?: string[] | number[];
  /**
   * Object containing Filestack security policy and signature.
   */
  security?: Security;
  /**
   * Object of sizes and their media query hints.
   * Note: A fallback for img sizes is highly recommended.
   * For example:
   * ```js
   * sizes: {
   *   '(min-width: 1280px)': '50vw',
   *   '(min-width: 640px)': '60vw',
   *   fallback: '100vw',
   * }
   * ```
   */
  sizes?: Size;
  /**
   * Static width to use for img with optional pixel density support.
   */
  width?: string;

  /**
   * Image transformations options
   *
   * @see https://www.filestack.com/docs/image-transformations
   */
  transforms?: TransformOptions;
}

const defaultResolutions = [
  180,
  360,
  540,
  720,
  900,
  1080,
  1296,
  1512,
  1728,
  1944,
  2160,
  2376,
  2592,
  2808,
  3024,
];

/**
 * Remove falsey values from object.
 */
const removeEmpty = R.pickBy((v: any) => !!v);

/**
 * Utility to get numbers from ambiguous types.
 */
const getN = R.ifElse(
  R.is(Number),
  R.identity,
  R.curry(R.flip(parseInt))(10),
);

/**
 * Utility to get unit of width or resolution
 */
const getUnit = (data: string) => {
  return data.replace ? data.replace(/\d*(\D+)$/gi, '$1') : 'px';
};

/**
 * Based on the provided transform options object create filestack filelink
 */
const createFileLink = (handle: FileHandle, transformOptions: TransformOptions = {}) => (width?: number, indexInSet?: number): string => {
  let fileLink: Filelink;
  // Use storage alias handle
  if (isFileHandleByStorageAlias(handle)) {
    fileLink = new Filelink(handle.srcHandle, handle.apiKey);
  } else {
    fileLink = new Filelink(handle);
  }

  if (width) {
    transformOptions.resize = { width };
  }
  Object.keys(transformOptions).forEach((key: keyof TransformOptions) => {
    fileLink = fileLink.addTask(key, transformOptions[key]);
  });
  console.log('###666', indexInSet, width, fileLink.toString());
  return fileLink.toString();
};

const getWidth = (width?: number | string) => (resolution: number | string) => {
  if (typeof resolution === 'number') {
    return resolution;
  }
  const unit = getUnit(resolution);
  if (unit === 'w') {
    return getN(resolution);
  }
  // Pixel density (2x == 2 * size)
  return R.multiply(getN(width), getN(resolution));
};

/**
 * Construct Filestack URL out of CDN base and handle, with optional security
 */
const getCdnUrl = (handle: FileHandle, options: PictureOptions) => {
  const transformOptions = Object.assign({}, options.transforms); // prevent overwritting original object
  return createFileLink(handle, transformOptions)();
};

/**
 * Constructs a srcset attribute for source and img elements.
 * Will use resolution descriptors or pixel densities to construct
 * the proper URLs based on the width of the image.
 */
const makeSrcSet = (
  handle: FileHandle,
  options: any,
  width?: number | string,
  format?: string,
) => {
  const mapIndexed = R.addIndex(R.map);
  // prevent overwritting original object
  const transformOptions = Object.assign({}, options.transforms);

  if (format) {
    transformOptions.output = { format };
  }

  if (!width && format) {
    return createFileLink(handle, transformOptions)();
  }

  const resolutions: any[] = R.map(R.ifElse(
    R.is(Number),
    (n: number) => `${n}w`,
    R.identity,
  ), options.resolutions);

  const widths = R.map(getWidth(width), options.resolutions);

  const urls: any[] = mapIndexed((width: number, index: number) => {
    return createFileLink(handle, transformOptions)(width, index);
  }, widths);

  return R.join(', ', R.map(R.join(' '), R.zip(urls, resolutions)));
};

/**
 * Construct src attribute for img element.
 * This may contain a resized URL if a fallback size is provided.
 */
const makeSrc = (handle: FileHandle, fallback: string, options: PictureOptions) => {
  const unit = getUnit(fallback);
  if (unit === 'vw') {
    return getCdnUrl(handle, options);
  }

  const width: number = getN(fallback);
  return createFileLink(handle, options.transforms)(width);
};

/**
 * A source element contains many possible hints for the browser.
 * For each media query + size pair we can construct a source
 * with the proper srcset using the size as the width parameter.
 * For each format a source element can be constructed as well.
 * This means there are (sizes × formats) sources.
 *
 * R.xprod lets us compute the Cartesian product of two lists.
 */
const makeSourcesTree = (handle: FileHandle, options: any): Source[] => {
  const makeSource = (media: any, width: any, format: any): Source | undefined => {
    if (!format && media === 'fallback') {
      return undefined;
    }
    return removeEmpty({
      media: media === 'fallback' ? undefined : media,
      sizes: width,
      srcSet: makeSrcSet(handle, options, width, format),
      type: format ? `image/${format}` : undefined,
      key: options.keys
        ? `${handle}-${media || 'fallback'}-${width || 'auto'}-${format || 'auto'}`
        : undefined,
    });
  };
  // Handle three cases -- sizes + type, just sizes, just type
  if (!options.sizes && options.formats) {
    return R.reject(R.isNil, R.map((f: string) => makeSource(null, null, f), options.formats));
  }
  let sources: any[] = R.toPairs(options.sizes);
  if (options.formats) {
    sources = R.compose(
      R.splitEvery(3),
      R.flatten,
      R.xprod(sources),
    )(options.formats);
  }
  return R.filter((v: any) => !!v, R.map(R.apply(makeSource), sources));
};

/**
 * Just your basic HTML img element. However we can let the user specify
 * a specific width which will incorporate pixel resolutions options in a srcset.
 */
const makeImgTree = (handle: FileHandle, options: PictureOptions): Img => {
  if (options.width) {
    return removeEmpty({
      src: makeSrc(handle, options.width, options),
      srcSet: makeSrcSet(handle, options, options.width),
      alt: options.alt,
      width: getN(options.width),
    });
  }
  const fallback = options.sizes && options.sizes.fallback;
  return removeEmpty({
    src: fallback ? makeSrc(handle, fallback, options) : getCdnUrl(handle, options),
    srcSet: options.sizes ? makeSrcSet(handle, options, fallback) : undefined,
    alt: options.alt,
    width: options.width,
    sizes: fallback || undefined,
  });
};

/**
 * Represent a picture element as a tree where leaf nodes are attributes
 * of one img element and zero or more source elements.
 *
 * This allows passing the structure into hyperscript-like virtual DOM generators.
 * For example see https://github.com/choojs/hyperx
 */
export const makePictureTree = (handle?: FileHandle, opts?: PictureOptions): Picture => {
  if (typeof handle !== 'string' && !isFileHandleByStorageAlias(handle)) {
    throw new TypeError('Filestack handle must be a string');
  }
  if (opts && opts.resolutions && opts.resolutions.length) {
    const rUnits: string[] = R.map(getUnit, R.filter(R.is(String), opts.resolutions));
    if (!opts.sizes && (R.any(R.is(Number), opts.resolutions) || R.contains('w', rUnits))) {
      throw new Error('You must specify at least one size to use width descriptors');
    }
    if (!opts.width && R.contains('x', rUnits)) {
      throw new Error('You must specify a width to use pixel densities.');
    }
  }
  const options: PictureOptions = {
    resolutions: opts && opts.width ? ['1x', '2x'] : defaultResolutions,
    keys: true,
    ...opts,
  };

  options.transforms = options.transforms || {}; // ensure transforms are defined

  if (options.security) {
    options.transforms.security = options.security;
  }

  const img: Img = makeImgTree(handle, options);
  const tree: Picture = { img };
  if (options.sizes || options.formats) {
    const sources: Source[] = makeSourcesTree(handle, options);
    tree.sources = sources && sources.length ? sources : undefined;
  }
  return removeEmpty(tree);
};
