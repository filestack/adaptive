import { makePictureTree, PictureOptions, FileHandle } from './tree';
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
  EUrlscreenshotOrientation,
} from 'filestack-js';

import { makePicture } from './adapters/DOM';

const createElement = (tag: string, attributes: any) => {
  const element = document.createElement(tag);
  for (const attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  return document.body.appendChild(element);
};

/**
 * Helper that composes makePictureTree with the DOM adapter for generating
 * actual picture elements.
 */
export const picture = (
  handle: FileHandle,
  opts?: PictureOptions,
  renderer?: any
): any => {
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
  EUrlscreenshotOrientation,
};
