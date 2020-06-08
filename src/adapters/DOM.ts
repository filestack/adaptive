import nanohtml from 'nanohtml';
import { Img, Picture, Source } from '../tree';

const makeImg = (obj: Img) => {
  return nanohtml`<img ${obj}>`;
};

const makeSource = (obj: Source) => {
  return nanohtml`<source ${obj}>`;
};

export const makePicture = (obj: Picture) => {
  const img = makeImg(obj.img);

  if (obj.sources) {
    return nanohtml`<picture>${obj.sources.map((s: Source) => makeSource(s))} ${img}</picture>`;
  }

  return nanohtml`<picture>${img}</picture>`;
};
