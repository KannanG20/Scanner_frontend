import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

function AuthContextProvider({ children }) {

  const [storedData, setStoredData] = useState([])
  const [update, setUpdate] = useState(false)
  const user_info = JSON.parse(localStorage.getItem('user_info'));

  
  useEffect(()=> {
    if (user_info){
      axios.get(`${import.meta.env.VITE_API}/qrcodes?userId=${user_info.id}`)
      .then((res)=> {
        setStoredData(res?.data)
        console.log(res?.data)
      }).catch((err)=> {
        console.log(err)
      })
    }
  }, [update])
  return (
    <AuthContext.Provider value={{ storedData, update, setUpdate }}>
      {children}
    </AuthContext.Provider> 
  )
}

export default AuthContextProvider