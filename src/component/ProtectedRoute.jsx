import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {

    const isAuth = localStorage.getItem('user_info')
    if(isAuth){
        return children
    }else {
        return <Navigate to={'/login'}/>
    }
}

export default ProtectedRoute