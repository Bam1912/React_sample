import React, { useEffect, useState } from 'react'
import { AlertRemove } from './../Redux/alertSlice'
import { useDispatch } from 'react-redux'

function Alert({id, text, timeout=300}) {
    const dispatch = useDispatch()
    const [ fade, setFade ] = useState('')
    
    useEffect(() => {
        setTimeout(() => {
            setFade(' invisible ')
            setTimeout(() => {
                dispatch(AlertRemove({id}))
            }, 290);
        }, timeout-300);
    }, [])
    
    return <div className={"alert "+fade }>{text}</div>
}

export default Alert


