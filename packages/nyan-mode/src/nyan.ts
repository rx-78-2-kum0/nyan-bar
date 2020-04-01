import { NyanOption, RenderCache } from './interface';
import nyanImg from './assets/nyan.png';

export class NyanMode {
  static New(opt: NyanOption): NyanMode {
    return new NyanMode(opt);
  }

  private readonly _imgRate = 623 / 320;
  private _rainDiff = 0;
  private _option: NyanOption = {
    width: 1000,
    height: 64
  };
  private _imgWH = { w: 0, h: 0 };
  private _img: HTMLImageElement = {} as HTMLImageElement;
  private _cvs: HTMLCanvasElement = {} as HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
  private _rainbowW = 0;
  private _rainbowData: ImageData = {} as ImageData;
  private _catData: ImageData = {} as ImageData;
  private _i = 0;
  private _total = 0;
  private _renderCache: RenderCache = {
    data: {} as ImageData,
    i: 0
  };

  constructor(opt: NyanOption) {
    this._option = opt;
    this._img = new Image();
    this._img.src = nyanImg;
  }

  create(e: HTMLElement, target: HTMLElement) {
    this._img.onload = () => {
      this._cvs = document.createElement('canvas');
      this._ctx = this._cvs.getContext('2d')!;

      this._cvs.width = this._option.width;
      this._cvs.height = this._option.height;

      this._imgWH = { w: this._option.height * this._imgRate, h: this._option.height };
      e.appendChild(this._cvs);

      this._parseImg();

      // target.onscroll = this._debounce(
      //   e => () => {
      //     if (e.target) {
      //       const { scrollTop, scrollHeight, clientHeight } = e.target as Element;
      //       let count = scrollTop / (scrollHeight - clientHeight);
      //       count = Math.round(this._total * count);

      //       if (this._i !== count) {
      //         this._i = count;
      //         this._draw();
      //       }
      //     }
      //   },
      //   0
      // );

      target.onscroll = e => {
        if (e.target) {
          const { scrollTop, scrollHeight, clientHeight } = e.target as Element;
          let count = scrollTop / (scrollHeight - clientHeight);
          count = Math.round(this._total * count);

          if (this._i !== count) {
            this._i = count;
            this._draw();
          }
        }
      };
    };
  }

  // private _debounce(fn: (e: Event) => () => void, delay: number) {
  //   let timer: null | number = null;
  //   return function(e: Event) {
  //     if (timer) {
  //       clearTimeout(timer);
  //       timer = setTimeout(fn(e), delay);
  //     } else {
  //       timer = setTimeout(fn(e), delay);
  //     }
  //   };
  // }

  private _parseImg() {
    this._ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, 0, 0, this._imgWH.w, this._imgWH.h);

    const imgData = this._ctx.getImageData(0, 0, this._imgWH.w, this._imgWH.h);
    this._rainbowW = this._rainbowWidth(imgData);

    this._rainbowData = this._ctx.getImageData(0, 0, this._rainbowW, this._imgWH.h);

    this._rainDiff = this._rainbowDiff(this._rainbowData);
    this._catData = this._ctx.getImageData(this._rainbowW + 1, 0, this._imgWH.w, this._imgWH.h);

    this._total = ((this._option.width - (this._imgWH.w - this._rainbowW)) / this._rainbowW) >> 0;

    this._draw();
  }

  private _rainbowWidth(img: ImageData): number {
    for (let i = 0; i < img.data.length; i++) {
      if (img.data[i] > 0) {
        return (i / 4) >> 0;
      }
    }
    return 0;
  }

  private _rainbowDiff(img: ImageData): number {
    const r = img.width * 4;
    let i = 0,
      idx = 0;
    while (img.data[idx] === 0) {
      i++;
      idx = r * i;
    }

    return i;
  }

  private _draw() {
    if (this._i < 0) {
      this._i = 0;
      return;
    }
    this._ctx.clearRect(0, 0, this._cvs.width, this._cvs.height);

    if (this._renderCache.i > this._i) {
    } else {
    }

    this._ctx.putImageData(this._catData, this._rainbowW * this._i, 0);

    if (this._option.wavy) {
      this._wavyRender();
    } else {
      this._straightRender();
    }

    this._renderCache = {
      data: this._ctx.getImageData(0, 0, this._rainbowW * this._i, this._imgWH.h),
      i: this._i
    };

    this._ctx.translate(0.5, 0.5);

    if (this._i * this._rainbowW + this._imgWH.w >= this._cvs.width) {
      this._i = -1;
    }
  }

  private _straightRender() {
    let x = this._i;

    while (x--) {
      this._ctx.putImageData(this._rainbowData, x * this._rainbowW, -this._rainDiff);
    }
  }

  private _wavyRender() {
    let x = this._i;

    if ((this._i & 1) === 0) {
      while (x--) {
        this._ctx.putImageData(this._rainbowData, x * this._rainbowW, x % 2 === 0 ? -this._rainDiff : 0);
      }
    } else {
      while (x--) {
        this._ctx.putImageData(this._rainbowData, x * this._rainbowW, x % 2 === 0 ? 0 : -this._rainDiff);
      }
    }
  }
}
