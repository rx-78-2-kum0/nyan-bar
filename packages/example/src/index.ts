import { NyanMode } from './nyan';

window.onload = () => {
  const e = document.getElementById('div');
  const t = document.getElementById('box');

  NyanMode.New({
    width: 1000,
    height: 16,
    wavy: true,
  }).create(e!, t!);
};
