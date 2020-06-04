import 'regenerator-runtime/runtime';
import { LitElement, property, customElement } from 'lit-element';
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
const picture = (
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

export const fsAdaptive = { picture };

@customElement('fs-adaptive')
export class FsAdaptiveWebComponent extends LitElement {
  @property({ type: String, reflect: true })
  src: string = '';

  @property({ type: String,  reflect: true })
  alt: any;

  @property({ type: String,  reflect: true })
  width: any;

  @property({ type: String,  reflect: true })
  cname: any;

  @property({ type: String,  reflect: true })
  signature: any;

  @property({ type: String,  reflect: true })
  policy: any;

  @property({ type: Boolean,  reflect: true })
  keys: any;

  @property({ type: Array,  reflect: true })
  resolutions: any;

  render() {
    let security;

    if (this.signature && this.policy) {
      security = { signature: this.signature, policy: this.policy };
    }

    const options = {
      security,
      resolutions: this.resolutions,
      alt: this.alt,
      width: this.width,
      cname: this.cname,
      keys: this.keys,
    };

    return fsAdaptive.picture(this.src, options);
  }
}

// resolutions?: (string | number)[];
// sizes?: Size;
