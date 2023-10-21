import { SnackbarContent, SnackbarProvider, enqueueSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import {QrReader} from 'react-qr-reader'; // Corrected import
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Scanner = (props) => {
  const [data, setData] = useState(null);
  const [on, setOn] = useState(false)
  const [deviceSize, setDeviceSize] = useState()
  const [disable, setDisable] = useState(false)

  const { storedData, setUpdate } = useContext(AuthContext)

  const user_info = JSON.parse(localStorage.getItem('user_info'));
  const navigate = useNavigate()

  useEffect(() => {
    function updateDeviceSize() {
      const windowWidth = window.innerWidth;
      if (windowWidth < 767) {
        setDeviceSize('small');
      } else if (windowWidth >= 768 && windowWidth < 1024) {
        setDeviceSize('tablet');
      } else {
        setDeviceSize('large');
      }
    }
      updateDeviceSize();
      window.addEventListener('resize', updateDeviceSize);
      return () => {
      window.removeEventListener('resize', updateDeviceSize);
    };
  }, []);


    const handleSaveData = async () => {
        const options = {
            data: data
        }
        setDisable(true);
        axios.post(`${import.meta.env.VITE_API}/qrcodes?userId=${user_info.id}`, options)
        .then(res => {
            setData(null);
            setUpdate(prev => !prev);
            enqueueSnackbar('Successfully saved the data', {
                variant: 'success',
                autoHideDuration: 3000
            });
        })
        .catch(error => {
            console.log(error);
            enqueueSnackbar('Something went wrong', {
            variant: 'error',
            autoHideDuration: 3000
            });
        }).finally(()=> {
            setDisable(false)
        });
    }

    const handleLogout = () => {
        localStorage.clear('user_info')
        navigate('/login')
    }

    const handleDeleteData = async (data) => {
        axios.delete(`${import.meta.env.VITE_API}/qrcodes/${data.id}`)
        .then((res)=> {
            setData(null)
            setUpdate(prev=>!prev)
            enqueueSnackbar('Successfully deleted the data', {
                variant: 'success',
                autoHideDuration: 3000
            })
        }).catch((err)=> {
            console.log(error)
            enqueueSnackbar('Something went wrong', {
                variant: 'error',
                autoHideDuration: 3000
            })
        })
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

                    constraints={{ facingMode: deviceSize === 'small' ? 'environment' : 'user' }}

                    // style={{ width: '300px', height: '100px' }}
                    className='w-full h-full'
                />
            </div>
            }
            {on && <div className='p-2 w-full md:max-w-sm rounded bg-white '>
                <span className='w-max'>{data?? 'NO DATA CAPTURED'}</span> 
            </div>}
            {data && <div className='flex w-full md:max-w-sm justify-end items-end mt-3'>
                <button onClick={()=> handleSaveData()} disabled={disable} className='py-2 px-3 disabled:bg-gray-500 bg-blue-500 text-white rounded-md w-full'>Save</button>
            </div>}
        </div>
        <div className='md:flex-1 w-full md:mr-5 bg-white rounded  max-h-72 relative overflow-y-auto'>
            <div className='font-medium text-xl sticky p-2 top-0 left-0 w-full bg-gray-200'>Saved Data</div>
            <div className='p-2 flex flex-col gap-2 overflow-y-auto h-full w-full'>
            {storedData?.data?.length > 0 ? 
            <>
            {storedData?.data?.map((item)=> (
                <div key={item.id} className=' w-full flex '>
                <p className='flex-1'>{item?.code}</p>
                <div className='flex justify-end text-red-500'>
                    <TrashIcon onClick={() => handleDeleteData(item)} className='h-5 w-5'/>
                </div>
                </div>
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