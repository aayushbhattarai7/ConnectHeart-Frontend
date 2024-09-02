import { useContext } from "react"
import { ThemeContext } from "../contexts/ThemeContext"
import { ThemeType } from "../types/global.types";
export const useTheme = () => {
    const contextValue = useContext(ThemeContext);

    const themeType: ThemeType = {
        theme: contextValue?.theme,
        setTheme: contextValue.setTheme
    };
    return themeType
}