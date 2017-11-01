import * as hyperx_ from 'hyperx';
import { Img, Picture, Source } from '../tree';

// Hack to support CommonJS in ES module export
const hyperx = hyperx_.default || hyperx_;

const makeImg = (renderer: any, obj: Img) => {
  return hyperx(renderer)`<img ${obj}>`;
};

const makeSource = (renderer: any, obj: Source) => {
  return hyperx(renderer)`<source ${obj}>`;
};

export const makePicture = (renderer: any, obj: Picture) => {
  const img = makeImg(renderer, obj.img);
  if (obj.sources) {
    return hyperx(renderer)`<picture>${obj.sources.map((s: Source) => makeSource(renderer, s))} ${img}</picture>`;
  }
  return hyperx(renderer)`<picture>${img}</picture>`;
};
