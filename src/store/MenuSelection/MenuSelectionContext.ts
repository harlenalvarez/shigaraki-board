import { Action, ReducerActions, RGBA, ShapeTypeKeys } from '@/types'

export type MenuSelectionContext = {
  selectedOption: ShapeTypeKeys
  strokeColor?: string | RGBA
  fillColor?: string | RGBA
  fontSize?: string
  fontType?: string
  fontColor?: string | RGBA
  fontStrokeColor?: string | RGBA
}

export const menuSelectionInitialState: MenuSelectionContext = {
  selectedOption: 'select'
}

export const menuSelectionActions = {
  'setSelection': (state: MenuSelectionContext, { payload }: Action<MenuSelectionContext>) => {
    if (!payload) return state;
    return { ...payload };
  }
} satisfies ReducerActions<MenuSelectionContext>
