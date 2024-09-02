import {  createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ThemeEnum } from "../types/global.types";
interface ThemeProviderProps {
  children: ReactNode;
}


export const ThemeContext = createContext<{
  theme: ThemeEnum,
    setTheme: (theme:ThemeEnum) => void
}>({
    theme: ThemeEnum.light, 
    setTheme: () => {
        return
    }
});
const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [themes, setThemes] = useState<ThemeEnum>(
        (localStorage.getItem('theme') as ThemeEnum || ThemeEnum.light)
    )
    useEffect(() => {
    localStorage.setItem('theme', themes);
    }, [themes])
    
    return (
        <ThemeContext.Provider value={{ theme: themes, setTheme: setThemes }}>
            {children}
        </ThemeContext.Provider>
    )

}


export default ThemeProvider;