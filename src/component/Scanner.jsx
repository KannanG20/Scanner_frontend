import { SnackbarContent, SnackbarProvider, enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {QrReader} from 'react-qr-reader'; // Corrected import
import { useNavigate } from 'react-router-dom';

const Scanner = (props) => {
  const [data, setData] = useState(null);
  const [storedData, setStoredData] = useState([])
  const [on, setOn] = useState(false)
  const [update, setUpdate] = useState(false)
  const user_info = JSON.parse(localStorage.getItem('user_info'));

  const navigate = useNavigate()
  useEffect(()=> {
    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:3000/qrcodes?userId=${user_info.id}`)
            const Resdata = await res.json()
            setStoredData(Resdata)
            console.log('data', Resdata)
        } catch (error) {
            console.log(error)
        }
    }
        fetchData()
  }, [update])

  const handleSaveData = async () => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: data,
                }),
            }
            const res = await fetch(`http://localhost:3000/qrcodes?userId=${user_info.id}`, options)
            const responseData = await res.json()
            if (!res.ok){
                enqueueSnackbar(responseData?.error?? 'Something went wrong', {
                    variant: 'error',
                    autoHideDuration: 3000
                })
            }else {
                setData(null)
                setUpdate(prev=>!prev)
                enqueueSnackbar('Successfully saved the data', {
                    variant: 'success',
                    autoHideDuration: 3000
                })
            }
           
        } catch (error) {
            console.log(error)
            enqueueSnackbar('Something went wrong', {
                variant: 'error',
                autoHideDuration: 3000
            })
        }
    }

    const handleLogout = () => {
        localStorage.clear('user_info')
        navigate('/login')
    }
  
  return (
    <div className='flex flex-col gap-5 justify-center md:gap-0 px-3 relative md:px-0 md:flex-row md:justify-between items-center h-screen w-full bg-gray-50'>
        {/* <h1>QR Scanner</h1> */}
        <button onClick={handleLogout} className='absolute right-0 top-0 m-5 bg-blue-500 text-white font-medium py-2 px-3 rounded'>Logout</button>
        <div className='md:flex-1 flex justify-center items-center flex-col'>
            {on && <span className='font-semibold text-xl sm:text-2xl'>Scan QR Code</span>}
            {!on && <div className='flex w-full md:w-80 justify-end items-end mt-3'>
                <button onClick={()=> setOn(true)} className='py-2 px-3 bg-blue-500 text-white rounded-md w-full'>Start Scanner</button>
            </div>}

            {on && 
            <div className=' w-[250px] md:w-[380px] '>
                <QrReader
                    onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info('error', error);
                    }
                    }}
                    // style={{ width: '300px', height: '100px' }}
                    className='w-full h-full'
                />
            </div>
            }
            {on && <div className='p-2 w-full md:max-w-sm rounded bg-white '>
                <span className='w-max'>{data?? 'NO DATA CAPTURED'}</span> 
            </div>}
            {data && <div className='flex w-full md:max-w-sm justify-end items-end mt-3'>
                <button onClick={()=> handleSaveData()} className='py-2 px-3 bg-blue-500 text-white rounded-md w-full'>Save</button>
            </div>}
        </div>
        <div className='md:flex-1 w-full md:mr-5 bg-white rounded  max-h-72 relative overflow-y-auto'>
            <div className='font-medium text-xl sticky p-2 top-0 left-0 w-full bg-gray-200'>Saved Data</div>
            <div className='p-2 flex flex-col gap-2 overflow-y-auto h-full w-full'>
            {storedData?.data?.length > 0 ? 
            <>
            {storedData?.data?.map((item)=> (
                <p>{item?.code}</p>
            ))}
            </>
            : <span className='flex justify-center items-center'>NO DATA</span>

        }
            </div>
        </div>
    </div>
  );
};

export default Scanner;