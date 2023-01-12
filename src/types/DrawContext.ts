import { Shapes } from './Shapes'

export type RGBA = [number, number, number, number]

const t: RGBA = [1, 2, 3, 4]

//TODO: add more settings as I think about them
export type DrawContext = {
  selectedOption: Shapes
  strokeColor?: string | RGBA
  fillColor?: string | RGBA
  fontSize?: string
  fontType?: string
  fontColor?: string | RGBA
  fontStrokeColor?: string | RGBA
}