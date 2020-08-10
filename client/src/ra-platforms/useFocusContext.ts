import { useContext } from 'react'
import { FocusContext } from './focusContext'

export const useFocusContext = () => {
  return useContext(FocusContext)
}
