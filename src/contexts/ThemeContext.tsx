import React, { createContext, useReducer, Dispatch } from 'react';

type StateType = {
  darkMode: boolean;
};

type ActionType = { type: 'LIGHTMODE' } | { type: 'DARKMODE' };

type ContextType = {
  state: StateType;
  dispatch: Dispatch<ActionType>;
};

const initialState: StateType = { darkMode: true };

export const ThemeContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => undefined,
});

const themeReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'LIGHTMODE':
      return { darkMode: false };
    case 'DARKMODE':
      return { darkMode: true };
    default:
      return state;
  }
};

export function ThemeProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>{props.children}</ThemeContext.Provider>
  );
}
