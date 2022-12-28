import { ReactElement } from 'react'
import { describe, test } from 'vitest'
import { useCanvasItems, useCanvasItemsActions, CanvasItemsProvider } from './CanvasItems'
import {render, RenderOptions} from '@testing-library/react'

const Test = () => {
    const { addItem } = useCanvasItemsActions()
    const state = useCanvasItems()

    return (
        <div>
            { state.components.map(component => (<div>{component.componentId}</div>)) }
            <button onClick={() => addItem({ componentId: 'test-component-id', position: { x: 1, y: 2}})}>Add Item</button>
        </div>
    )
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
  ) => render(ui, {wrapper: CanvasItemsProvider, ...options})

describe('Should load canvas', () => {
    test('Should add item', () => {
        customRender(<Test />)
    })
})