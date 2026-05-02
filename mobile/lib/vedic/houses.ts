import { SIGNS, type SignName } from './types';

export function signIndex(siderealDeg: number): number {
  return Math.floor(((siderealDeg % 360) + 360) % 360 / 30);
}

export function signName(siderealDeg: number): SignName {
  return SIGNS[signIndex(siderealDeg)];
}

export function wholeSignHouse(planetSignIndex: number, lagnaSignIndex: number): number {
  return ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;
}
