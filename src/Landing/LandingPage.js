import React from 'react'
import {useQuery} from "@apollo/client"
import { GET_LANDING } from './../Graphql/Queries/Landing'
import { GET_FORMS } from '../Graphql/Queries/Form';
import { Slide } from 'react-slideshow-image';

import Menu from './Menu'
import Block from './Block'
import './LandingPage.scss'
import { Link } from 'react-router-dom';


function LandingPage({landing_id}) {
    const slideImages = [
        {
          url: './images/slide_1.jpg',
          caption: 'Slide 1'
        },
        // {
        //   url: './images/slide_2.jpg',
        //   caption: 'Slide 2'
        // },
        {
          url: './images/slide_3.jpg',
          caption: 'Slide 3'
        },
      ];
      const style = {
        textAlign: 'center',
        // background: 'teal',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        padding: '150px 0',
        margin:'20px 15px',
        fontSize: '30px',
        width:'250px !important'
      };

      const properties = {
        duration: 3000,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        indicators: false,
      };

    const {loading, data } = useQuery(GET_LANDING, {variables: {id: landing_id}})
    const {data:data_forms} = useQuery(GET_FORMS, {variables: {landing_id: landing_id}})
   
    return <>
        { loading  && <div>загрузка...</div>}
        { data && data.Landing && 
        <>
        
         <div className="fixed-bg" style={{
            //  backgroundImage:`url(./images/pic1.png)`, 
            backgroundColor:"#0002",
            backgroundSize:"cover",
            backgroungOrigin:"border-box",
            backgroundPosition:"center"
         }} ></div>
         <div className="landing-contaner"  > {/*onScroll={()=>console.log('scroll1')}*/ }
            <div id='canva' className='canva'></div>
            {data&&<Menu key="menu" data={data} data_forms={data_forms}/>}

             {/*------------блоки лендинга--------------------*/}
             {data.Landing.segments.length > 0 && data.Landing.segments.map((segment,index)=>{
                                // grey!=grey
                                return <Block color={segment.color?segment.color:''} key={'block_'+index} id={'block_'+index}>
                                            <>
                                                {segment.title?<div className={segment.titleEffect?segment.titleEffect:""}><h1>{segment.title}</h1></div>:""}
                                                {segment.subtitle?<div className={segment.subtitleEffect?segment.subtitleEffect:""}><h2>{segment.subtitle}</h2></div>:""}
                                                {segment.content?<div dangerouslySetInnerHTML={{ __html: segment.content.replace(/<button ([0-9]+)>/ig, `<button onclick=form_$1.scrollIntoView({block:"center",behavior:"smooth"})>`) }} className={(segment.contentEffect?segment.contentEffect:"")+(" type"+(segment.type?segment.type:0))}/>:""}
                                            </>
                                </Block>
                                }
              )
             }

             {/*---------Наши проекты----------*/}
            <Block color={'#EEEEEE'} key={'block_projects'} id="block_projects">
                <div className="defade">
                <div className='c'><h1>Наши проекты</h1></div>
                <div >
                    <Slide {...properties}> 
                        {slideImages.map((slide,index)=>{
                            return <div key={"block_projects_slide"+index} style={{'backgroundImage': `url(${slide.url})`, ...style}}></div>
                        })}
                    </Slide>
                </div>
                </div>
            </Block>
            
            { /*-----------вывод форм---------------*/
             data_forms && data_forms.getForms && data_forms.getForms.length>0 && ( 
                data_forms.getForms.map( (form)=>{ 
                    // console.log('form',form);
                    return <Block popup={form.popup} color={''} landing_id={!!data&&!!data.Landing&&data.Landing.id} form_id={form.id} key={'block_form_'+form.id} />
                })
             )
            }
            
            <Block color={'#EEEEEE'} key={'block_slider'} >
                <div className="type0">
                <div>
                <h2>Навигация</h2>
                    {data&&data.Landing&&data.Landing.segments&&data.Landing.segments.length>0&&
                    data.Landing.segments.map((item,index)=>{
                        if(item.name) return <div className={'item'}  onClick={()=>document.getElementById('block_'+index)&&document.getElementById('block_'+index).scrollIntoView({block: "center", behavior: "smooth"})}>{item.name}</div>
                            else return <></>
                    })}
                    {document.getElementById('block_projects')&&<div className='item' onClick={()=>document.getElementById('block_projects')&&document.getElementById('block_projects').scrollIntoView({block: "center", behavior: "smooth"})}>Наши проекты</div>}
                    
                    {data_forms&&data_forms.getForms && data_forms.getForms.length>0&&
                    data_forms.getForms.map( (item)=>{
                        // console.log('data_forms_item',item, document.getElementById('form_'+item.id))
                        if(!item.popup) return <div className={'item'}  onClick={()=>document.getElementById('form_'+item.id)&&document.getElementById('form_'+item.id).scrollIntoView({block: "center", behavior: "smooth"})}>Связаться</div>
                            else return <></>
                    }
                    )}
                </div>
                
                {data&&data.Landing&&data.Landing.social&&
                    <div>
                    <h2>Социальные сети</h2>
                    {
                        Object.keys(JSON.parse(data.Landing.social)).map((key)=><Link to='' onClick={(e)=>{e.preventDefault();window.open(JSON.parse(data.Landing.social)[key])}} target="_blank"><div className='item'>{key}</div></Link>)
                    }
                    </div>
                }
                
                {data&&data.Landing&&data.Landing.organization&&
                <div>
                <h2>Наши реквизиты</h2>
                    <div className='text' dangerouslySetInnerHTML={{ __html: data.Landing.organization.replace(/\r\n/ig,'<br>')}}/>
                </div>
                }

                <div>
                    <h2>Контакты</h2>
                    {data&&data.Landing&&data.Landing.phone&&<div className='phone' onClick={(e)=>{window.location = 'tel:'+data.Landing.phone;e.preventDefault();}}>{data.Landing.phone}</div>}
                    {data&&data.Landing&&data.Landing.email&&<div className='email' onClick={(e)=>{window.location = 'mailto:'+data.Landing.email;e.preventDefault();}}>{data.Landing.email}</div>}
                </div>
                </div>
            </Block>
         </div>
        </>
        }
    </>
    

}

export default LandingPage
