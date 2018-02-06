import { createElement } from 'bel';
import { makePictureTree, PictureOptions } from './tree';
import {
  TransformationOptions,
  EStyleType,
  EShapeType,
  ENoiseType,
  EFitOptions,
  EColorspaceType,
  EBlurMode,
  EAlignOptions,
  EAlignFacesOptions,
  ECropfacesType
} from './transformations';
import { makePicture } from './adapters/DOM';

/**
 * Helper that composes makePictureTree with the DOM adapter for generating
 * actual picture elements.
 */
export const picture = (handle?: string, opts?: PictureOptions, renderer?: any): any => {
  if (renderer) {
    return makePicture(renderer, makePictureTree(handle, opts));
  }
  return makePicture(createElement, makePictureTree(handle, opts));
};

export {
  makePictureTree,
  TransformationOptions,
  EStyleType,
  EShapeType,
  ENoiseType,
  EFitOptions,
  EColorspaceType,
  EBlurMode,
  EAlignOptions,
  EAlignFacesOptions,
  ECropfacesType,
};
