import { useState, useEffect } from 'react'

const useFocus = (newFocus: boolean) => {
  const [ focus, setFocus ] = useState(false)

  useEffect(() => {
    updateFocus(newFocus);
  }, [newFocus])

  const updateFocus = (focus: boolean) => {
    setFocus(focus)
  };

  return [focus, updateFocus];

};

export default useFocus;
