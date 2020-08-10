import React, { useEffect, useState } from 'react'

interface IFocusContext {
  currentFocus: boolean
  setFocus: Function
}

export const FocusContext = React.createContext<IFocusContext>({
  currentFocus: false,
  setFocus: (focus: boolean) => null
})

export const FocusProvider: React.FC = ({children}) => {
  const [currentFocus, setFocusState] = useState<boolean>(false)

  useEffect(() => {
    setFocusState(currentFocus)
  }, [currentFocus])

  // const setFocus: (newFocusState: boolean) = (newFocusState) => {
  const setFocus: Function = (newFocusState: boolean) => {
    console.log('setFocus', newFocusState )
    setFocusState(newFocusState)
  }

  return <FocusContext.Provider value={{ currentFocus, setFocus }}>{children}</FocusContext.Provider>
}
