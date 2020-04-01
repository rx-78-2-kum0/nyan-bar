export interface NyanOption {
  width: number;
  height: number;
  wavy?: boolean;
}

export interface RenderCache {
  data: ImageData;
  i: number;
}
