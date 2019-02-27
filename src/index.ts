import { createElement } from 'nanohtml';
import { makePictureTree, PictureOptions, FileIdentifier } from './tree';
import {
  TransformOptions,
  EFitOptions,
  EAlignFacesOptions,
  ECropfacesType,
  EShapeType,
  EBlurMode,
  ENoiseType,
  EStyleType,
  EColorspaceType,
  EAlignOptions,
  EVideoAccessMode,
  EVideoTypes,
  EVideoLocations,
  EVideoAccess,
  EUrlscreenshotAgent,
  EUrlscreenshotMode,
  EUrlscreenshotOrientation
} from 'filestack-js';
import { makePicture } from './adapters/DOM';

/**
 * Helper that composes makePictureTree with the DOM adapter for generating
 * actual picture elements.
 */
export const picture = (handle?: FileIdentifier, opts?: PictureOptions, renderer?: any): any => {
  if (renderer) {
    return makePicture(renderer, makePictureTree(handle, opts));
  }
  return makePicture(createElement, makePictureTree(handle, opts));
};

export {
  makePictureTree,
  TransformOptions,
  EStyleType,
  EShapeType,
  ENoiseType,
  EFitOptions,
  EColorspaceType,
  EBlurMode,
  EAlignOptions,
  EAlignFacesOptions,
  ECropfacesType,
  EVideoAccessMode,
  EVideoTypes,
  EVideoLocations,
  EVideoAccess,
  EUrlscreenshotAgent,
  EUrlscreenshotMode,
  EUrlscreenshotOrientation
};
