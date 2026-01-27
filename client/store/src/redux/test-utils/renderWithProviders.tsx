import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { createTestStore } from "./test-store";

export function renderWithProviders(
  ui: React.ReactElement,
  { store = createTestStore() }: { store?: ReturnType<typeof createTestStore> } = {}
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    ),
  };
}
