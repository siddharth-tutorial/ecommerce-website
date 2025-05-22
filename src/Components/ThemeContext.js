import React, { useContext, useState } from 'react'
import { createContext } from 'react'
const ThemeContext =createContext()

export const useTheme = ()=> useContext(ThemeContext)
export default function ThemeProvider({children }) {

    const [darkMode,setDarkMode] =useState(false)

    const toggleDarkMode =()=>setDarkMode(prev => !prev)
  return (
<ThemeContext.Provider value={{darkMode,toggleDarkMode}}>
    {children}
</ThemeContext.Provider>    
)
}
