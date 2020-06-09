import 'regenerator-runtime/runtime';
import { LitElement, property, html, customElement } from 'lit-element';
import { makePicture } from './adapters/DOM';
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
import { makePictureTree, PictureOptions, FileHandle } from './tree';

/**
 * Helper that composes makePictureTree with the DOM adapter for generating
 * actual picture elements.
 */
const picture = (
  handle: FileHandle,
  opts?: PictureOptions
): any => {
  return makePicture(makePictureTree(handle, opts));
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
  alt: string;

  @property({ type: String,  reflect: true })
  width: string;

  @property({ type: String,  reflect: true })
  cname: string;

  @property({ type: String,  reflect: true })
  signature: string;

  @property({ type: String,  reflect: true })
  policy: string;

  @property({ type: Array,  reflect: true })
  resolutions: string[];

  @property({ type: Array,  reflect: true })
  formats: string[];

  @property({ type: Object,  reflect: true })
  sizes: any;

  @property({ type: String,  reflect: true })
  class: string;

  @property({ type: String,  reflect: true })
  id: string;

  render() {
    let security;

    if (this.signature && this.policy) {
      security = { signature: this.signature, policy: this.policy };
    }

    const options: any = {
      security,
      alt: this.alt,
      width: this.width,
      cname: this.cname,
      sizes: this.sizes,
      formats: this.formats,
    };

    if (this.resolutions) {
      options.resolutions = this.resolutions;
    }

    const el = fsAdaptive.picture(this.src, options);

    if (el && this.class) {
      el.setAttribute('class', this.class);
    }

    if (el && this.id) {
      el.setAttribute('id', this.id);
    }

    return html`${el}`;
  }
}
