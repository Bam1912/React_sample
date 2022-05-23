import React, { useEffect, useRef, useState } from 'react'
import {useQuery, useMutation} from "@apollo/client"
import { GET_FORM } from '../Graphql/Queries/Form';
import { SAVE_FORM_DATA } from '../Graphql/Mutation/Form'
import { useForm } from "react-hook-form";

function Block({id, transparent, color, popup, form_id, landing_id, children}) {
    const el = useRef();
    const [animate, setAnimate] = useState(false)
    
    const {data:data_form } = useQuery(GET_FORM, {variables: {form_id: form_id}})
    const [saveFormData, {loading:save_form_loading, data:save_form_data}]  = useMutation(SAVE_FORM_DATA)
    const { register, handleSubmit, formState: { errors }} = useForm();   
    const submitForm = (data) =>{ 
        if(/*data.landing_id && */data.form_id){
            if(!form_saved){
                saveFormData({variables:{ landing_id : data.landing_id,  form_id:data.form_id, data: JSON.stringify(data)}})
            } 
        }
    } 
    const [form_saved, setForm_saved] = useState(false)

    const run_animate = () => {
        if(el.current && !popup){
            const rect = el.current.getBoundingClientRect();
            if((rect.y >-100  && rect.y < window.innerHeight-100) || (rect.height+rect.y>100 && rect.height+rect.y<window.innerHeight+100)){
                setAnimate(true)
            } 
        }
    }

    useEffect(() => {
        if(save_form_data && save_form_data.saveFormData && save_form_data.saveFormData.id){
            setForm_saved(true);
        }
    }, [save_form_loading])

    useEffect(() => {
        run_animate()
        const handleScroll = window.addEventListener('scroll', run_animate)
        const hide_canva = ()=>{
            let canva = document.getElementById('canva')
            canva.style.display = 'none';
            el.current.style.display='none'
            setAnimate(false)    
        }

        const show_canva = ()=>{
            let canva = document.getElementById('canva')
            canva.style.display = 'block'
            el.current.style.display='block'
            setAnimate(true)
        }
        if(form_id){
        let btns = document.querySelectorAll('button')
        btns.forEach( (item)=>{
                if(item.dataset.form!== undefined && item.dataset.form === form_id){
                    if(!popup) 
                        item.addEventListener('click',()=>el.current.scrollIntoView({block: "center", behavior: "smooth"}))
                    else{
                        item.addEventListener('click',()=>{
                            let canva = document.getElementById('canva')                            
                            if(canva) {
                                canva.addEventListener('click',hide_canva)
                                show_canva()    
                            }
                        })

                        document.addEventListener('keydown', (event) => {
                            const keyName = event.key;
                            if (keyName === 'Escape') {
                                hide_canva()
                            }
                          }, false);
                    }
                }
                })
        }
        return () => {
            if(handleScroll)
                window.removeEventListener('scroll', handleScroll)
        }
    }, [])

   
            return <>
                <div id={id?id:''}>
                    <div ref={el} style={{backgroundColor:color?color:'', backgroundImage: popup?"linear-gradient(90deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(./images/bg1.jpg)":""}} className={" block "+ (!!popup&&" popup ")+(animate?" animate ":"")+(transparent?" transparent-bg ":"")} >
                    {!!popup&&<div className='close' 
                                        onClick={()=>{
                                            let canva = document.getElementById('canva')
                                            if(canva) {
                                                        canva.style.display = 'none';
                                                        el.current.style.display='none'
                                                        setAnimate(false)    
                                            }
                                        }}></div>}

                                    {form_id&&
                                            data_form && data_form.getForm && ( 
                                             
                                                    <div className={"defade type3"}>
                                                    <header className='c'>
                                                        {data_form.getForm.title&&<h1>{data_form.getForm.title}</h1>}
                                                        {data_form.getForm.subtitle&&<h2>{data_form.getForm.subtitle}</h2>}
                                                    </header>
                                                    <data className='c'>
                                                        <form onSubmit={handleSubmit(submitForm)} id={'form_'+data_form.getForm.id}>
                                                            <input defaultValue={landing_id} {...register("landing_id")} hidden />
                                                            <input defaultValue={data_form.getForm.id} {...register("form_id")} hidden />
                                                            {!!data_form.getForm.inputs.length&&data_form.getForm.inputs.map((item,index)=>{
                                                                switch(item.type){
                                                                    case "input": 
                                                                        return  <>
                                                                                <input defaultValue="" {...register(item.name, {required: item.required, pattern: item.pattern?new RegExp(item.pattern, 'i'):""})} placeholder={item.placeholder?item.placeholder+"...":""} disabled={form_saved} />
                                                                                {errors[item.name]?.type === 'required' && <div className="error">обязательно для заполнения</div>} 
                                                                                {errors[item.name]?.type === "pattern" && (
                                                                                    <div className="error">не верный формат</div>
                                                                                )}
                                                                                </>
                                                                    // break;
                                                                    case "textarea": 
                                                                    return  <>
                                                                            <textarea {...register(item.name, {required: item.required, pattern: item.pattern?new RegExp(item.pattern, 'i'):""})} placeholder={item.placeholder?item.placeholder+"...":""} disabled={form_saved}/>
                                                                            {errors[item.name]?.type === 'required' && <div className="error">обязательно для заполнения</div>} 
                                                                                {errors[item.name]?.type === "pattern" && (
                                                                                    <div className="error">не верный формат</div>
                                                                                )}
                                                                            </>
                                                                    // break;
                                                                    default: return <></>
                                                                        // return <input defaultValue="" {...register(item.name, {required: item.required, pattern: item.pattern?item.pattern:/[.]+$/i})} disabled={form_saved} />
                                                                }
                                                            })
                                                        }
                                                        {form_saved&&data_form.getForm.confirmation&&<h2>{data_form.getForm.confirmation}</h2>}
                                                        {<button type="submit" className={form_saved?"hidden":""}>Отправить</button>}
                                                        {<button type="button" className={!form_saved?"hidden":""} onClick={()=>{setForm_saved(false);}}>Заполнить заново</button>}
                                                        </form>
                                                    </data>
                                                    </div>
                                        
                                            )
                                        }
                    {children?children:''}
                    </div>
                </div>
            </>
    
}

export default Block
