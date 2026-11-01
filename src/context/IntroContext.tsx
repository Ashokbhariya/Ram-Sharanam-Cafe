import { createContext, useContext } from 'react';
export interface IntroCtx { active: boolean; replay: () => void }
export const IntroContext = createContext<IntroCtx>({ active: false, replay: () => {} });
export const useIntro = () => useContext(IntroContext);
