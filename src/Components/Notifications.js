import React from 'react'
import { useSelector } from 'react-redux'
import Alert from './Alert'

function Notifications() {
    const alerts  = useSelector( state => state.alertSlice.alerts)    
    return (
        <div className="notifications-container">
            {!!alerts.length && alerts.map((item)=>{
                    return <Alert key={item.id} id={item.id} text={item.text} timeout={item.timeout}/>
                })}
        </div>
    )
}

export default Notifications


