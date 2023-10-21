import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Auth() {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [err, setErr] = useState(null)
    const [disable, setDisable] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = (e)=> {
        e.preventDefault()
        const data = {
            username: username,
            password: password
        }
        setErr(null)
        setDisable(true)
        axios.post(`${import.meta.env.VITE_API}/login`, data)
        .then((res)=> {
            const localData = {
                isAuth: true,
                id: res?.data?.data?.id,
                username: res?.data?.data?.username,
                token: res?.data?.token
            }
            localStorage.setItem('user_info', JSON.stringify(localData));
            navigate('/')
            enqueueSnackbar('Successfully logged in', {
                variant: 'success',
                autoHideDuration: 3000
            })
        }).catch((err)=> {
            if (err.response.status === 401){
                setErr(err.response.data.error)
            }else{
                enqueueSnackbar(err.response.data.error?? 'Something went wrong', {
                    variant: 'error',
                    autoHideDuration: 3000
                })
            }
        }).finally(()=> setDisable(false))
    }

  return (
    <div className='h-screen w-full flex justify-center bg-gray-50 items-center'>
        <div className=' w-[90%] h-72 px-3 bg-white rounded flex justify-center items-center md:w-[400px]'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full'>
                <h1 className='text-2xl font-semibold mb-5'>Login</h1>
                <input value={username?? ""} onChange={(e)=> setUsername(e.target.value)} placeholder='Username' type='text'  className='py-2 px-3 outline-none border border-gray-400 rounded'/>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Password' type='password' className='py-2 px-3 outline-none border border-gray-400 rounded'/>
                {err && <span className='text-sm text-red-500'>{err}</span>}
                <button disabled={disable} type='submit' className='w-full py-2 px-3 rounded disabled:bg-gray-500 bg-blue-500 text-white font-medium'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Auth