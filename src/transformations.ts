import * as t from 'tcomb-validation';
import { ValidationError } from 'tcomb-validation';

export enum EAlignOptions {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
}

export enum EAlignFacesOptions {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
  faces = 'faces',
}

export enum EFitOptions {
  clip = 'clip',
  crop = 'crop',
  scale = 'scale',
  max = 'max',
}

export enum EBlurMode {
  linear = 'linear',
  gaussian = 'gaussian',
}

export enum EShapeType {
  oval = 'oval',
  rect = 'rect',
}

export enum ENoiseType {
  none = 'none',
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum EStyleType {
  artwork = 'artwork',
  photo = 'photo',
}

export enum EColorspaceType {
  RGB = 'RGB',
  CMYK = 'CMYK',
  Input = 'Input',
}

/**
 * @see https://www.filestack.com/docs/image-transformations
 */
export interface TransformationOptions {
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
    rotate?: number;
    color?: string;
    background?: string;
  };
  detect_faces?: {
    minsize?: number; // 0.01 - 10000
    maxsize?: number; // 0.01 - 10000
    color?: string;
    export?: boolean;
  };
  crop_faces?: {
    mode?: string; // todo
    width?: number;
    height?: number;
    faces?: number | string;
    buffer?: number; // 0 - 1000
  };
  pixelate_faces?: {
    faces?: number | string;
    minsize?: number; // 0.01 - 10000
    maxsize?: number; // 0.01 - 10000
    buffer?: number; // 0 - 1000
    amount?: number; // 2-100
    blur?: number; // 0-20
    type?: EShapeType;
  };
  blur_faces?: {
    faces?: number | string;
    minsize?: number; // 0.01 - 10000
    maxsize?: number; // 0.01 - 10000
    buffer?: number; // 0 - 1000
    amount?: number; // 2-100
    blur?: number; // 0-20
    type?: EShapeType;
  };
  rounded_corners?: {
    radius?: number;
    blur?: number;
    background?: string;
  };
  vignette?: {
    amount?: number;
    blurmode?: EBlurMode;
    background?: string;
  };
  polaroid?: {
    color?: string;
    rotate?: number;
    background?: string;
  };
  torn_edges?: {
    spread?: number;
    background?: number;
  };
  shadow?: {
    blur?: number;
    opacity?: number;
    vector?: [number, number];
    color?: string;
    background?: string;
  };
  circle?: {
    background?: string;
  };
  border?: {
    width?: number;
    color?: string;
    background?: string;
  };
  sharpen?: {
    amount: number;
  };
  blur?: {
    amount: number;
  };
  blackwhite?: {
    threshold: number;
  };
  sepia?: {
    tone: number;
  };
  pixelate?: {
    amount: number;
  };
  oil_paint?: {
    amount: number;
  };
  modulate?: {
    brightness?: number;
    hue?: number;
    saturation?: number;
  };
  partial_pixelate?: {
    amount?: number;
    blur?: number;
    type?: EShapeType;
    objects?: [[number, number, number, number]];
  };
  partial_blur?: {
    amount?: number;
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
    files?: [string];
  };
  upscale?: {
    upscale?: boolean;
    noise?: ENoiseType;
    style?: EStyleType;
  };
  ascii?: {
    background?: string;
    foreground?: string;
    colored?: boolean;
    size?: number;
    reverse?: boolean;
  };
  quality?: {
    value: number;
  };
  security?: {
    policy?: string;
    signature?: string;
  };
  output?: {
    format?: string;
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
    expiry?: number;
  };
}

// ===== Custom Validators =====

// Integer range type
const vRange = (start: number, end: number) => {
  const validator = t.refinement(t.Integer, (n: number) => n >= start && n <= end);
  validator['displayName'] = `Value is not in allowed range(${start}-${end})`;

  return validator;
};

const vFloat = () => {
  return t.refinement(t.Number, (n: number) => n > 0 && n < 1);
};

const vFloatOrRange = (start: number, end: number) => {
  return t.union([vFloat(), vRange(start, end)]);
};

const vNumberOrAll = () => {
  return t.union([t.Integer, t.enums.of('all')]);
};

// Special type for resize align
const vAlignment = t.enums.of('top left right bottom center');
const vBlurMode = t.enums.of('linear gaussian');

// custom predefined validators
const vColor = t.String;
const vRotate = vRange(1, 359);
const vShapeType = t.enums.of('rect oval');
const vFit = t.enums.of('clip crop scale max');
const vColorspace = t.enums.of('RGB, CMYK, Input');

/**
 * Custom schema interface for tcomb-validatio
 */
interface CustomSchemaInterface {
  name?: string;
  validator?: Function;
  props?: CustomSchemaInterface[];
  required?: boolean;
  [index: string]: any;
}

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

    return t.maybe(t.struct(result));
  }

  schema.forEach((el: any) => {
    if (el.props) {
      result[el.name] = toTcombSchema(el.props);
      return;
    }

    if (!el.required) {
      result[el.name] = t.maybe(el.validator);
      return;
    }

    result[el.name] = el.validator;
  });

  return t.maybe(t.struct(result));
};

const validationSchema: any[] = [{
  name: 'flip',
  validator: t.Boolean,
}, {
  name: 'flop',
  validator: t.Boolean,
}, {
  name: 'monochrome',
  validator: t.Boolean,
}, {
  name: 'enhance',
  validator: t.Boolean,
}, {
  name: 'redeye',
  validator: t.Boolean,
}, {
  name: 'negative',
  validator: t.Boolean,
}, {
  name: 'resize',
  props: {
    width: t.Integer,
    height: t.Integer,
    fit: vFit,
    align: vAlignment,
  },
}, {
  name: 'crop',
  props: {
    dim: t.tuple([t.Integer, t.Integer, t.Integer, t.Integer]),
  },
}, {
  name: 'resize',
  props: {
    width: t.Integer,
    height: t.Integer,
    fit: vFit,
    align: vAlignment,
  },
}, {
  name: 'rotate',
  props: {
    rotate: vRotate,
    colour: vColor,
    background: vColor,
  },
}, {
  name: 'rounded_corners',
  props: {
    radius: vRange(1, 10000),
    blur: vRange(0, 20),
    background: vColor,
  },
}, {
  name: 'vignette',
  props: {
    amount: vRange(0, 100),
    blurmode: vBlurMode,
    background: t.Boolean,
  },
}, {
  name: 'polaroid',
  props: {
    color: vColor,
    rotate: vRotate,
    background: vColor,
  },
}, {
  name: 'torn_edges',
  props: {
    spread: vRange(1, 10000),
    background: vColor,
  },
}, {
  name: 'shadow',
  props: {
    blur: vRange(0, 20),
    opacity: vRange(0, 100),
    vector: t.tuple([vRange(-1000, 1000), vRange(-1000, 1000)]),
    color: vColor,
    background: vColor,
  },
}, {
  name: 'circle',
  props: {
    background: vColor,
  },
}, {
  name: 'border',
  props: {
    width: vRange(1, 1000),
    color: vColor,
    background: vColor,
  },
}, {
  name: 'sharpen',
  props: {
    amount: vRange(1, 20),
  },
}, {
  name: 'blackwhite',
  props: {
    threshold: vRange(0, 100),
  },
}, {
  name: 'blur',
  props: [{
    name: 'amount',
    validator: vRange(2, 20),
    required: true,
  }],
}, {
  name: 'sepia',
  props: {
    tone: vRange(1, 100),
  },
}, {
  name: 'pixelate',
  props: [{
    name: 'amount',
    validator: vRange(2, 100),
    required: true,
  }],
}, {
  name: 'oil_paint',
  props: {
    amount: vRange(1, 10),
  },
}, {
  name: 'modulate',
  props: {
    brightness: vRange(0, 10000),
    hue: vRange(0, 359),
    saturate: vRange(0, 10000),
  },
}, {
  name: 'partial_pixelate',
  props: {
    amount: vRange(2, 100),
    blur: vRange(0, 20),
    type: vShapeType,
    objects: t.list(t.tuple([t.Integer, t.Integer, t.Integer, t.Integer])),
  },
}, {
  name: 'partial_blur',
  props: {
    amount: vRange(2, 100),
    blur: vRange(0, 20),
    type: vShapeType,
    objects: t.list(t.tuple([t.Integer, t.Integer, t.Integer, t.Integer])),
  },
}, {
  name: 'collage',
  props: {
    files: t.list(t.String),
    margin: t.Integer,
    width: t.Integer,
    height: t.Integer,
    color: vColor,
    fit: vFit,
    autorotate: t.Boolean,
  },
}, {
  name: 'upscale',
  props: {
    upscale: t.Boolean,
    noise: t.enums.of('none low medium high'),
    style: t.enums.of('artwork photo'),
  },
}, {
  name: 'asci',
  props: {
    background: vColor,
    foreground: vColor,
    colored: t.Boolean,
    size: vRange(10, 100),
    reverse: t.Boolean,
  },
}, {
  name: 'quality',
  props: {
    value: t.Number,
  },
}, {
  name: 'security',
  props: {
    policy: t.String,
    signature: t.String,
  },
}, {
  name: 'cache',
  props: {
    cache: t.Boolean,
    expiry: t.Integer,
  },
}, {
  name: 'output',
  props: {
    format: t.String,
    colorspace: vColorspace,
    strip: t.Boolean,
    quality: vRange(1, 100),
    page: vRange(1, 10000),
    compress: t.Boolean,
    density: vRange(1, 500),
    background: vColor,
  },
}, {
  name: 'detect_faces',
  props: {
    minsize: vFloatOrRange(0, 10000),
    maxsize: vFloatOrRange(0, 10000),
    color: vColor,
    export: t.Boolean,
  },
}, {
  name: 'pixelate_faces',
  props: {
    faces: vNumberOrAll(),
    minsize: vFloatOrRange(0, 10000),
    maxsize: vFloatOrRange(0, 10000),
    buffer: vRange(0, 1000),
    amount: vRange(2, 100),
    blur: vRange(0,20),
    type: vShapeType,
  },
}, {
  name: 'blur_faces',
  props: {
    faces: vNumberOrAll(),
    minsize: vFloatOrRange(0, 10000),
    maxsize: vFloatOrRange(0, 10000),
    buffer: vRange(0, 1000),
    amount: vRange(2, 100),
    blur: vRange(0,20),
    type: vShapeType,
  },
}];

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
 * Flatten transformation option to string
 *
 * @example {resize:{width: 100,height: 200}} => resize=width:100,height:200
 * @param key - option key
 * @param values - option params
 */
const optionToString = (key: string, values: any): string => {
  let optionsString: string[] = [];

  // if we just want to enable feature
  if (typeof values === 'boolean') {
    return key;
  }

  Object.keys(values).forEach((i) => {
    if (Array.isArray(values[i])) {
      optionsString.push(`${i}:${arrayToString(values[i])}`);
      return;
    }

    optionsString.push(`${i}:${values[i]}`);
  });

  return `${key}=${optionsString.join(',')}`;
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
export const transform = (options: TransformationOptions): string[] => {

  // strict will not allow additional params
  const validate = t.validate(options, toTcombSchema(validationSchema), { strict: true });

  if (!validate.isValid()) {
    const firstError: ValidationError | null = validate.firstError();
    throw new Error(`Wrong options provided: ${firstError ? firstError.message : 'unknown'}`);
  }

  let url: string[] = [];

  Object.keys(options).forEach((key: keyof TransformationOptions) => {
    url.push(optionToString(key, options[key]));
  });

  return url;
};
