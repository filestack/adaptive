import * as t from 'tcomb-validation';

/**
 * Align enum
 */
export enum EAlignOptions {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
}

/**
 * Align enum with faces option
 */
export enum EAlignFacesOptions {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
  faces = 'faces',
}

/**
 * Fit enum
 */
export enum EFitOptions {
  clip = 'clip',
  crop = 'crop',
  scale = 'scale',
  max = 'max',
}

/**
 * Blur enum
 */
export enum EBlurMode {
  linear = 'linear',
  gaussian = 'gaussian',
}

/**
 * Shapes enum
 */
export enum EShapeType {
  oval = 'oval',
  rect = 'rect',
}

/**
 * Noise type enum
 */
export enum ENoiseType {
  none = 'none',
  low = 'low',
  medium = 'medium',
  high = 'high',
}

/**
 * Style type enum
 */
export enum EStyleType {
  artwork = 'artwork',
  photo = 'photo',
}

/**
 * Color space enum
 */
export enum EColorspaceType {
  RGB = 'RGB',
  CMYK = 'CMYK',
  Input = 'Input',
}

/**
 * Crop faces options enum
 */
export enum ECropfacesType {
  thumb = 'thumb',
  crop = 'crop',
  fill = 'fill',
}

/**
 * @see https://www.filestack.com/docs/image-transformations
 */
export interface TransformationOptions {
  // [key: string]: string | number | boolean | object | undefined;
  flip?: boolean;
  flop?: boolean;
  monochrome?: boolean;
  enhance?: boolean;
  redeye?: boolean;
  negative?: boolean;
  resize?: {
    width?: number;
    height?: number;
    fit?: boolean;
    align?: EAlignFacesOptions;
  };
  crop?: {
    dim: [number, number, number, number]
  };
  rotate?: {
    deg: number;
    color?: string;
    background?: string;
  };
  detect_faces?: {
    minsize?: number;
    maxsize?: number;
    color?: string;
    export?: boolean;
  } | true;
  crop_faces?: {
    mode?: ECropfacesType;
    width?: number;
    height?: number;
    faces?: number | string;
    buffer?: number;
  };
  pixelate_faces?: {
    faces?: number | string;
    minsize?: number;
    maxsize?: number;
    buffer?: number;
    amount?: number;
    blur?: number;
    type?: EShapeType;
  };
  blur_faces?: {
    faces?: number | string;
    minsize?: number;
    maxsize?: number;
    buffer?: number;
    amount?: number;
    blur?: number;
    type?: EShapeType;
  };
  rounded_corners?: {
    radius?: number;
    blur?: number;
    background?: string;
  } | true;
  vignette?: {
    amount?: number;
    blurmode?: EBlurMode;
    background?: string;
  };
  polaroid?: {
    color?: string;
    rotate?: number;
    background?: string;
  } | true;
  torn_edges?: {
    spread?: number;
    background?: number;
  } | true;
  shadow?: {
    blur?: number;
    opacity?: number;
    vector?: [number, number];
    color?: string;
    background?: string;
  } | true;
  circle?: {
    background?: string;
  } | true;
  border?: {
    width?: number;
    color?: string;
    background?: string;
  } | true;
  sharpen?: {
    amount: number;
  } | true;
  blur?: {
    amount: number;
  } | true;
  blackwhite?: {
    threshold: number;
  } | true;
  sepia?: {
    tone: number;
  } | true;
  pixelate?: {
    amount: number;
  } | true;
  oil_paint?: {
    amount: number;
  } | true;
  modulate?: {
    brightness?: number;
    hue?: number;
    saturation?: number;
  } | true;
  partial_pixelate?: {
    amount?: number;
    blur?: number;
    type?: EShapeType;
    objects?: [[number, number, number, number]];
  };
  partial_blur?: {
    amount: number;
    blur?: number;
    type?: EShapeType;
    objects?: [[number, number, number, number]];
  };
  collage?: {
    margin?: number;
    width?: number;
    height?: number;
    color?: string;
    fit?: EFitOptions,
    files: [string];
  };
  upscale?: {
    upscale?: boolean;
    noise?: ENoiseType;
    style?: EStyleType;
  } | true;
  ascii?: {
    background?: string;
    foreground?: string;
    colored?: boolean;
    size?: number;
    reverse?: boolean;
  } | true;
  quality?: {
    value: number;
  };
  security?: {
    policy: string;
    signature?: string;
  };
  output?: {
    format: string;
    colorspace?: string;
    strip?: boolean;
    quality?: number;
    page?: number;
    compress?: boolean;
    density?: number;
    background?: string;
  };
  cache?: {
    cache?: boolean;
    expiry: number;
  };
}

// ===== Custom Validators =====

// Integer range type

/**
 * Custom schema interface for tcomb-validatio
 */
interface CustomSchemaInterface {
  name?: string;
  validator?: Function;
  props?: CustomSchemaInterface[];
  required?: boolean;
  canBeBoolean?: boolean;
  [index: string]: any;
}

// @todo use union dispatch
const applySchemaValidators = (validators: any, canBeBoolean: boolean = false, maybe: boolean = false) => {
  // single validator
  if (typeof validators === 'function') {
    return maybe ? t.maybe(validators) : validators;
  }

  const defaultValidators = t.struct(validators);

  if (!canBeBoolean) {
    return maybe ? t.maybe(defaultValidators) : defaultValidators;
  }

  const vBoolean = t.Boolean;

  const isValid = t.union([vBoolean, defaultValidators], 'canBeBoolean');
  isValid.dispatch = (x) => {
    return (typeof x === 'boolean') ? vBoolean : defaultValidators;
  };

  return maybe ? t.maybe(isValid) : isValid;
};

/**
 * Convert custom schema for tcomb-validation with maybe function (not required param)
 *
 * @param schema
 */
const toTcombSchema = (schema: CustomSchemaInterface) => {
  let result: any = {};
  if (!Array.isArray(schema) && typeof schema === 'object') {
    Object.keys(schema).map((key: string) => {
      result[key] = t.maybe(schema[key]);
    });

    return result;
  }

  schema.forEach((el: any) => {
    if (el.props) {
      result[el.name] = applySchemaValidators(toTcombSchema(el.props), el.canBeBoolean, !el.required);
      return;
    }

    result[el.name] = applySchemaValidators(el.validator, el.canBeBoolean, !el.required);
  });

  return t.struct(result);
};

/**
 * Converts nested arrays to string
 *
 * @example [1,2, [2,3]] => "[1,2, [2,3]]"
 * @param arr - any array
 */
const arrayToString = (arr: any[]): string => {
  const toReturn = arr.map((el) => {
    if (Array.isArray(el)) {
      return arrayToString(el);
    }

    return el;
  });

  return `[${toReturn}]`;
};


/**
 * Creates filestack transform url
 *
 * @example
 * console.log(transform({
 * collage: {
 *   files: ['0ZgN5BtJTfmI1O3Rxhce', '6a9QVg1LS4uoPN7B4HYA'],
 *   margin: 20,
 *   width: 100,
 *   fit: FitOptions.crop,
 *  },
 * }));
 * result => [collage=files:[0ZgN5BtJTfmI1O3Rxhce,6a9QVg1LS4uoPN7B4HYA],margin:20,width:100,fit:crop]
 *
 * @throws Error
 * @param options Transformation options
 */
