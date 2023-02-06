import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, test } from 'vitest';
import { MenuSelectionProvider, useMenuSelection, useMenuSelectionActions } from './MenuSelectionProvider';

const RenderProvider = (props: { children: React.ReactNode }) => {
  return (
    <MenuSelectionProvider>
      {props.children}
    </MenuSelectionProvider>
  );
};

describe('Menu Selection', () => {
  test('Should load default menu selection', () => {
    const TestComponent = () => {
      const menuContext = useMenuSelection();
      return <div>Selected: {menuContext.selectedOption}</div>;
    };

    render(<TestComponent />, { wrapper: RenderProvider });
    screen.getByText('Selected: select');
  });

  test('Should set menu selection', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const menuContext = useMenuSelection();
      const actions = useMenuSelectionActions();

      return (
        <>
          <div>Selected: {menuContext.selectedOption}</div>
          <button onClick={() => { actions?.setSelection({ selectedOption: 'box' }); }}>Select Div</button>
          <button onClick={() => { actions?.setSelection({ selectedOption: 'sphere' }); }}>Select Node</button>
        </>
      );
    };

    render(
      <MenuSelectionProvider>
        <TestComponent />
      </MenuSelectionProvider>
    );
    const button = screen.getByText<HTMLButtonElement>('Select Div');
    await user.click(button);
    await screen.findByText('Selected: box');
    const node = screen.getByText('Select Node');
    await user.click(node);
    await screen.findByText('Selected: sphere');
  });
});
