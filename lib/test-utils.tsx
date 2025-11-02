import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store/store';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore;
}

/**
 * Custom render function that includes Redux Provider
 */
function AllTheProviders({
  children,
  store,
}: {
  children: React.ReactNode;
  store?: AppStore;
}) {
  const testStore = store || makeStore();
  return <Provider store={testStore}>{children}</Provider>;
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof render> => {
  const { store, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} store={store} />,
    ...renderOptions,
  });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };

