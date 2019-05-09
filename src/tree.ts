import { TransformOptions, Filelink } from 'filestack-js';
import utils from './utils';

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
   * Set if should use validator for params task
   */
  useValidator?: boolean;
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
  resolutions?: (string | number)[];
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
 * Based on the provided transform options object create filestack filelink
 */
const createFileLink = (handle: FileHandle, transformOptions: TransformOptions = {}, useValidator: boolean, indexInSet?: number) => (width?: number): string => {
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

  // If validator is enabled use only for the first filelink in set
  if (!useValidator || (indexInSet && indexInSet > 0)) {
    fileLink.setUseValidator(false);
  }
  Object.keys(transformOptions).forEach((key: keyof TransformOptions) => {
    fileLink = fileLink.addTask(key, transformOptions[key]);
  });
  return fileLink.toString();
};

const getWidth = (width?: number | string) => (resolution: number | string) => {
  if (typeof resolution === 'number') {
    return resolution;
  }
  const unit = utils.getUnit(resolution);
  if (unit === 'w') {
    return utils.getNumber(resolution);
  }
  // Pixel density (2x == 2 * size)
  return utils.getNumber(width) * utils.getNumber(resolution);
};

/**
 * Construct Filestack URL out of CDN base and handle, with optional security
 */
const getCdnUrl = (handle: FileHandle, options: PictureOptions) => {
  if (options.useValidator === undefined) {
    options.useValidator = true;
  }
  const transformOptions = Object.assign({}, options.transforms); // prevent overwritting original object
  return createFileLink(handle, transformOptions, options.useValidator)();
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
  // prevent overwritting original object
  const transformOptions = Object.assign({}, options.transforms);

  if (format) {
    transformOptions.output = { format };
  }

  if (!width && format) {
    return createFileLink(handle, transformOptions, options.useValidator)();
  }

  const resolutions = options.resolutions.map((val: any) => {
    let resString = typeof val === 'number' ? `${val}w` : val;
    return resString;
  });

  const widths = options.resolutions.map((val: any) => {
    return getWidth(width)(val);
  });

  const urls: any[] = widths.map((width: number, index: number) => {
    return createFileLink(handle, transformOptions, options.useValidator, index)(width);
  }, widths);

  const urlWithReso = urls.map((url, index) => {
    return `${url} ${resolutions[index]}`;
  });

  return urlWithReso.join(', ');
};

/**
 * Construct src attribute for img element.
 * This may contain a resized URL if a fallback size is provided.
 */
const makeSrc = (handle: FileHandle, fallback: string, options: PictureOptions) => {
  if (options.useValidator === undefined) {
    options.useValidator = true;
  }
  const unit = utils.getUnit(fallback);
  if (unit === 'vw') {
    return getCdnUrl(handle, options);
  }
  const width: number = utils.getNumber(fallback);
  return createFileLink(handle, options.transforms, options.useValidator)(width);
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
    return utils.removeEmpty({
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
    const sources = options.formats.map((format: string) => {
      return makeSource(null, null, format);
    }).filter((source: string) => {
      return source;
    });
    return sources;
  }

  let sources: any[] = Object.entries(options.sizes);

  if (options.formats) {
    let cartesian = utils.cartesian([sources, options.formats]);
    let cartesianFlattened = utils.flat(cartesian, 2);
    sources = utils.arrToChunks(cartesianFlattened, 3);
  }

  const sourcesTree = sources.map((source: any) => {
    return makeSource.apply(null, source);
  }).filter(source => !!source);
  return sourcesTree;
};

/**
 * Just your basic HTML img element. However we can let the user specify
 * a specific width which will incorporate pixel resolutions options in a srcset.
 */
const makeImgTree = (handle: FileHandle, options: PictureOptions): Img => {
  if (options.useValidator === undefined) {
    options.useValidator = true;
  }
  if (options.width) {
    return utils.removeEmpty({
      src: makeSrc(handle, options.width, options),
      srcSet: makeSrcSet(handle, options, options.width),
      alt: options.alt,
      width: utils.getNumber(options.width),
    });
  }
  const fallback = options.sizes && options.sizes.fallback;
  return utils.removeEmpty({
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
  if (opts && opts.useValidator === undefined) {
    opts.useValidator = true;
  }
  if (typeof handle !== 'string' && !isFileHandleByStorageAlias(handle)) {
    throw new TypeError('Filestack handle must be a string');
  }
  if (opts && opts.resolutions && opts.resolutions.length) {
    const rUnits: string[] = opts.resolutions.filter((resolution: any) => {
      return typeof resolution === 'string';
    }).map((resolution: string) => {
      return utils.getUnit(resolution);
    });
    if (!opts.sizes && (opts.resolutions.some((resolution) => typeof resolution === 'number') || rUnits.indexOf('w') > -1)) {
      throw new Error('You must specify at least one size to use width descriptors');
    }
    if (!opts.width && rUnits.indexOf('x') > -1) {
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
  return utils.removeEmpty(tree);
};
