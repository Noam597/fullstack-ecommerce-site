// import { ReactElement } from 'react'
// import { render } from '@testing-library/react'
// import { Provider } from 'react-redux'
// import { configureStore } from '@reduxjs/toolkit'
// import { store } from "./src/redux/store"

// type Options = {
//   preloadedState?: any
//   store?: ReturnType<typeof configureStore>
// }

// export function renderWithRedux(
//   ui: ReactElement,
//   {
//     preloadedState,
//     store = configureStore({ reducer: , preloadedState }),
//   }: Options = {}
// ) {
//   return {
//     store,
//     ...render(<Provider store={store}>{ui}</Provider>),
//   }
// }
// import { render } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createStore } from './src/redux/store'; // your store factory

// export function renderWithProviders(ui: React.ReactNode, preloadedState?: any) {
//   const store = createStore(preloadedState);
//   return {
//     store,
//     ...render(
//       <Provider store={store}>
//         <MemoryRouter>{ui}</MemoryRouter>
//       </Provider>
//     ),
//   };
// }