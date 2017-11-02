import * as R from 'ramda';

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
  resolutions?: string[]|number[];
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
  return data.replace(/\d*(\D+)$/gi, '$1');
};

/**
 * Injects a task string into a Filestack URL
 */
const injectTask = (base: string[]) => (task: string) => {
  const url = R.head(base);
  const handle = R.last(base);
  const rest = R.dropLast(1, R.tail(base));
  return [url, ...rest, task, handle];
};

const injectFormat = (format?: string) => (arr: string[]) => {
  if (format) {
    const str = `output=format:${format}`;
    return injectTask(arr)(str);
  }
  return arr;
};

const injectSecurity = (security?: Security) => (arr: string[]) => {
  if (security) {
    const str = `security=p:${security.policy},s:${security.signature}`;
    return injectTask(arr)(str);
  }
  return arr;
};

const injectResize = (arr: string[]) => (width: number) => {
  const str = `resize=width:${width}`;
  return injectTask(arr)(str);
};

const getWidth = (width?: number|string) => (resolution: number|string) => {
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
const getCdnUrl = (base: string[], options: PictureOptions) => {
  if (options.security) {
    const newBase = injectSecurity(options.security)(base);
    return R.join('/', newBase);
  }
  return R.join('/', base);
};

/**
 * Constructs a srcset attribute for source and img elements.
 * Will use resolution descriptors or pixel densities to construct
 * the proper URLs based on the width of the image.
 */
const makeSrcSet = (
  base: string[],
  options: any,
  width?: number|string,
  format?: string,
) => {
  if (!width && format) {
    return R.join('/', injectFormat(format)(base));
  }
  const resolutions: any[] = R.map(R.ifElse(
    R.is(Number),
    (n: number) => `${n}w`,
    R.identity,
  ), options.resolutions);
  const urls: any[] = R.map(R.compose(
    R.join('/'),
    injectSecurity(options.security),
    injectFormat(format),
    injectResize(base),
    getWidth(width)), options.resolutions);
  return R.join(', ', R.map(R.join(' '), R.zip(urls, resolutions)));
};

/**
 * Construct src attribute for img element.
 * This may contain a resized URL if a fallback size is provided.
 */
const makeSrc = (base: string[], fallback: string, options: PictureOptions) => {
  const unit = getUnit(fallback);
  if (unit === 'vw') {
    return getCdnUrl(base, options);
  }
  const width: number = getN(fallback);
  return R.join('/', injectResize(base)(width));
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
const makeSourcesTree = (base: string[], options: any): Source[] => {
  const makeSource = (media: any, width: any, format: any): Source|undefined => {
    if (!format && media === 'fallback') {
      return undefined;
    }
    return removeEmpty({
      media: media === 'fallback' ? undefined : media,
      sizes: width,
      srcSet: makeSrcSet(base, options, width, format),
      type: format ? `image/${format}` : undefined,
      key: options.keys
        ? `${base[1]}-${media || 'fallback'}-${width || 'auto'}-${format || 'auto'}`
        : undefined,
    });
  };
  // Handle three cases -- sizes + type, just sizes, just type
  if (!options.sizes && options.formats) {
    return R.map((f: string) => makeSource(null, null, f), options.formats);
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
const makeImgTree = (base: string[], options: PictureOptions): Img => {
  if (options.width) {
    return removeEmpty({
      src: makeSrc(base, options.width, options),
      srcSet: makeSrcSet(base, options, options.width),
      alt: options.alt,
      width: getN(options.width),
    });
  }
  const fallback = options.sizes && options.sizes.fallback;
  return removeEmpty({
    src: fallback ? makeSrc(base, fallback, options) : getCdnUrl(base, options),
    srcSet: options.sizes ? makeSrcSet(base, options, fallback) : undefined,
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
export const makePictureTree = (handle?: string, opts?: PictureOptions): Picture => {
  if (typeof handle !== 'string') {
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
  const base: [string, string] = ['https://cdn.filestackcontent.com', handle];
  const img: Img = makeImgTree(base, options);
  const tree: Picture = { img };
  if (options.sizes || options.formats) {
    const sources: Source[] = makeSourcesTree(base, options);
    tree.sources = sources && sources.length ? sources : undefined;
  }
  return removeEmpty(tree);
};
