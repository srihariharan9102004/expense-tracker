import { useState, useEffect } from 'react'
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initialValue : JSON.parse(saved)
    } catch {
      return initialValue // storage blocked, or the saved text is broken
    }
  })

  // save again every time the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
