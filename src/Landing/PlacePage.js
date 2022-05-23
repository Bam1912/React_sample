import React, {useEffect, useState} from 'react'
import {useQuery, NetworkStatus} from "@apollo/client"
// import { Slide } from 'react-slideshow-image';

// import Menu from './Menu'
import Block from './Block'
import './LandingPage.scss'
// import { Link } from 'react-router-dom';
import { GET_PLACE } from '../Graphql/Queries/Place';
import { GET_STORAGE } from '../Graphql/Queries/Storage';


function PlacePage({place_id}) {
    // const slideImages = [
    //     {
    //       url: './images/slide_1.jpg',
    //       caption: 'Slide 1'
    //     },
    //     // {
    //     //   url: './images/slide_2.jpg',
    //     //   caption: 'Slide 2'
    //     // },
    //     {
    //       url: './images/slide_3.jpg',
    //       caption: 'Slide 3'
    //     },
    //   ];
    //   const style = {
    //     textAlign: 'center',
    //     // background: 'teal',
    //     backgroundSize: 'cover',
    //     backgroundRepeat: 'no-repeat',
    //     backgroundPosition: 'center',
    //     padding: '150px 0',
    //     margin:'20px 15px',
    //     fontSize: '30px',
    //     width:'250px !important'
    //   };

    //   const properties = {
    //     duration: 3000,
    //     slidesToShow: 2,
    //     slidesToScroll: 1,
    //     autoplay: false,
    //     indicators: false,
    //   };
      
      const {loading:place_loading, data:place_data, error:place_error, refetch:reload_place_data, networkStatus: place_networkStatus} = useQuery(GET_PLACE, {notifyOnNetworkStatusChange:true, variables: {id: place_id}})
      const {loading:storage_load, data: storage_data, error, refetch:reload_storage_data, networkStatus: storage_networkStatus} =  useQuery(GET_STORAGE, {notifyOnNetworkStatusChange:true, variables: {id: place_data&&place_data.Place&&place_data.Place.storage_id?place_data.Place.storage_id:0}})
      const [files, setFiles] = useState([])

      useEffect(()=>{
        if(storage_load==false && storage_networkStatus == NetworkStatus.ready){
          if(storage_data && storage_data.Storage && storage_data.Storage .filesCount > 0){
            const f_arr = storage_data.Storage.files.map((file)=>{return({'id':file.id, 'name':file.name, 'path':file.path})})
            setFiles(f_arr)
          }
        }
      },[storage_load])

     return <>
        { (place_loading || storage_load) && <div>загрузка...</div>}
        { place_data && storage_data && console.log('data',place_data, storage_data)}
        {/* {files && console.log('files',files)} */}

        { place_data && place_data.Place && place_data.Place.id &&
            storage_data &&
        
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
            <Block color={0} key={'block_2'} id={`place_${place_id}`}>
                <div className='type2'>
                    {place_data.Place?<>
                        <header className='c'>
                            <br/>
                            {!!place_data.Place.name&& <h2>{place_data.Place.name}</h2>}
                            <br/>
                        </header>
                                                    
                        { !!files[0] && <picture><div><img src={`/${files[0].path}${files[0].name}`}/></div><br/><br /></picture>}

                        <data>
                        {!! place_data.Place.address && <div dangerouslySetInnerHTML={{__html:`<strong>Местоположение: </strong>${place_data.Place.address}<br/><br/>`}}/>}
                        {!!place_data.Place.description && <div dangerouslySetInnerHTML={{__html: place_data.Place.description.replace(/\r\n|\r|\n/g,"<br><br>")}}/>}
                        {/* <div>{place_data.Place.description.replace(/\r\n|\r|\n/g,"<br><br>")}</div> } */}
                        
                        {!!files.length>=1 && <>
                            {files.map((image,index)=>index>0?<div className='images' key={`place_image_${index}`}><br/><img src={`/${image.path}${image.name}`}/><br/></div>:false)}
                        </>}
                        </data>
                        
                        
                    </>:""}
                </div>
            </Block>

            <Block popup={0} color={'1'} landing_id={place_data.Place.name} form_id={4} key={'block_form_4'} />                  
            {/* <Block color={'#EEEEEE'} key={'block_projects'} id="block_1">
                
                <div className="defade">
                    {!!place_data.Place.name &&
                        <div className='c'><h1>{place_data.Place.name}</h1></div>
                    }
                    {
                    !!files[0] &&
                     <div style={{'backgroundImage': `url('https://levelfive.ru/${files[0].path}${files[0].name}')`, ...style}}>{`https://levelfive.ru/${files[0].path}${files[0].name}`}</div>
                    }
                    {!!place_data.Place.teaser &&
                        <data>
                            {place_data.Place.teaser }
                        </data>
                        }
                </div>
            </Block> */}
         </div>
        </>
        }
    </>
    

}

export default PlacePage
