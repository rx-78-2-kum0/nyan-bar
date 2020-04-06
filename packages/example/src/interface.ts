export interface NyanOption {
  width: number;
  height: number;
  wavy?: boolean;
}

export interface RenderCache {
  d: ImageData | null;
  i: number;
}
