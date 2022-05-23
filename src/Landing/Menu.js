import React, { useEffect, useState } from 'react'
import './LandingPage.scss'


function Menu({data, data_forms}) {

    useEffect(() => {
        const handleScroll = window.addEventListener('scroll', () => {if(window.pageYOffset< document.body.scrollHeight) setOffset(window.pageYOffset)})
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
      }, []);
    
    const [offset, setOffset] = useState(0)
    const percent = 100-offset*100/(document.body.scrollHeight - window.innerHeight);
    
    
    return (
        <div className="menu">
            {data&&data.Landing&&data.Landing.phone&&<div className='phone' onClick={(e)=>{window.location = 'tel:'+data.Landing.phone;e.preventDefault();}}>{data.Landing.phone}</div>}
            {data&&data.Landing&&data.Landing.email&&<div className='email' onClick={(e)=>{window.location = 'mailto:'+data.Landing.email;e.preventDefault();}}>{data.Landing.email}</div>}
            {data&&data.Landing&&data.Landing.segments&&data.Landing.segments.length>0&&
            data.Landing.segments.map((item,index)=>{
                if(item.name) return <div className={'item'}  onClick={()=>document.getElementById('block_'+index)&&document.getElementById('block_'+index).scrollIntoView({block: "center", behavior: "smooth"})}>{item.name}</div>
                    else return <></>
            })}

            {document.getElementById('block_projects')&&<div className='item' onClick={()=>document.getElementById('block_projects')&&document.getElementById('block_projects').scrollIntoView({block: "center", behavior: "smooth"})}>Наши проекты</div>}

            {data_forms&&data_forms.getForms && data_forms.getForms.length>0&&
            data_forms.getForms.map( (item)=>{
                if(!item.popup) 
                    return <div className={'item'}  onClick={()=>document.getElementById('form_'+item.id)&&document.getElementById('form_'+item.id).scrollIntoView({block: "center", behavior: "smooth"})}>Связаться</div>
                else return <></>
            }
            )}
            <div className="progress" style={{'right': percent<0?0:percent+'%' }} ></div>
        </div>
    )
}

export default Menu
