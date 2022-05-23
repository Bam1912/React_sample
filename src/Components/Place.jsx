import React, { useState, useEffect } from 'react'
import {useQuery, useMutation, NetworkStatus } from "@apollo/client"
import { GET_PLACE } from '../Graphql/Queries/Place'
import { UPDATE_PLACE } from '../Graphql/Mutation/Place'
import { AlertAdd } from './../Redux/alertSlice'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';

//  import OMap from './OMap'
// import GMapView from './GMapView'
 import YMapView from './YMapView'
import PlacePhotos from './PlacePhotos'
import PlacePersons from './PlacePersons'

const Place = ({place_id}) => {
    // console.log('place',place_id);
    // let unsaved = false;
    // const { AlertAdd } = useActions()
    let location = useLocation()
// console.log('location',location.pathname)
    const dispatch = useDispatch()

    const [placeName, setPlaceName] = useState('')
    const [placeDescription, setPlaceDescription] = useState('')
    const [placeId, setPlaceId] = useState('')
    const [placeStorageId, setPlaceStorageId] = useState('')
    const [placeOriginal_name, setPlaceOriginal_name] = useState('')
    const [placeAddress, setPlaceAddress] = useState('')
    const [placeType_id, setPlaceType_id] = useState('')
    const [placeCity_id, setPlaceCity_id] = useState('')
    const [placePrice_category_id, setPlacePrice_category_id] = useState('')
    const [placeCoordinates, setPlaceCoordinates] = useState('')
    const [placeTags, setPlaceTags] = useState('')
    const [placeTeaser, setPlaceTeaser] = useState('')

    const [placeInternal_rating, setPlaceInternal_rating] = useState('')
    const [placeExternal_rating, setPlaceExternal_rating] = useState('')
    const [placeComments, setPlaceComments] = useState('')
    const [placePrepayment, setPlacePrepayment] = useState('')
    const [placePersonId, setPlacePersonId] = useState('')
    const [placePersonName, setPlacePersonName] = useState('')
    const [placeActivity, setPlaceActivity] = useState('')
    const [placePersonSecond_name, setPlacePersonSecond_name] = useState('')
    const [placePersonPhone, setPlacePersonPhone] = useState('')
    const [placePersonEmail, setPlacePersonEmail] = useState('')

    const [reload, setReload] = useState(false)
    
    const {loading:place_loading, data:place_data, error:place_error, refetch, networkStatus} = useQuery(GET_PLACE, {variables: {id: place_id}})
    const [updatePlace, {loading:update_place_loading, error:update_place_error, data:update_place_data}]  = useMutation(UPDATE_PLACE, {refetchQueries:[GET_PLACE]})
    
    // console.log('вывод достопримечательности');
    
    // const [addPlace, {loading:place_add_loading, error:place_add_error, data:place_add_data}]  = useMutation(ADD_PLACE)
    // const [deletePlace, {loading:place_delete_loading, error:place_delete_error, data:place_delete_data}]  = useMutation(DELETE_PLACE)
    // console.log("update_place_error>>", update_place_loading);
    useEffect(() => { 
        if(placeInternal_rating>5 ) setPlaceInternal_rating(5)
        if(placeInternal_rating<0 ) setPlaceInternal_rating(0)
    },[placeInternal_rating])

    useEffect(() => { 
        if(placePrepayment>100 ) setPlacePrepayment(100)
        if(placePrepayment<0 ) setPlacePrepayment(0)
    },[placePrepayment])
    
    useEffect(() => {
        if(place_loading == false && networkStatus===NetworkStatus.ready){
            if( place_data && place_data.Place ) {
                if(place_data.Place.id != placeId) setPlaceId(place_data.Place.id) 
                if(place_data.Place.storage_id != placeStorageId) setPlaceStorageId(place_data.Place.storage_id) 
                 if(place_data.Place.name != placeName) setPlaceName(place_data.Place.name)
                 if(place_data.Place.original_name != placeOriginal_name) setPlaceOriginal_name(place_data.Place.original_name)
                 if(place_data.Place.description != placeDescription) setPlaceDescription(place_data.Place.original_name)
                 if(place_data.Place.address != placeAddress) setPlaceAddress(place_data.Place.address)
                 if(place_data.Place.description != placeDescription) setPlaceDescription(place_data.Place.description)
                 if(place_data.Place.tags != placeTags) setPlaceTags(place_data.Place.tags)
                 if(place_data.Place.teaser != placeTeaser) setPlaceTeaser(place_data.Place.teaser)
                 if(place_data.Place.internal_rating != placeInternal_rating) setPlaceInternal_rating(place_data.Place.internal_rating)
                 if(place_data.Place.external_rating != placeExternal_rating) setPlaceExternal_rating(place_data.Place.external_rating)
                 if(place_data.Place.comments != placeComments) setPlaceComments(place_data.Place.comments)
                 if(place_data.Place.activity != placeActivity) setPlaceActivity(place_data.Place.activity)
                 if(place_data.Place.prepayment != placePrepayment) setPlacePrepayment(place_data.Place.prepayment)
                 if(place_data.Place.coordinates != placeCoordinates) setPlaceCoordinates(place_data.Place.coordinates)
            }
        }
    },[networkStatus]);

    useEffect(() => {
        //console.log("networkStatus>>",networkStatus);
        if(update_place_loading == false  && networkStatus===NetworkStatus.ready){
            if(update_place_error){
                dispatch(AlertAdd({text:update_place_error,id:new Date().valueOf(),timeout:10000}))
            }
        
            if(update_place_data && update_place_data.updatePlace && update_place_data.updatePlace.success == true){
                dispatch(AlertAdd({text:'сохранено',id:new Date().valueOf(),timeout:2000}))
            }
        }
        
    },[update_place_loading]);


    if(!place_data) { 
        return <><div className="place">загрузка...</div></>
    }
    else{
        if(place_data.Place==null) 
            return(<div>Выберите Место</div>)
        else
        return (
        <> 
        <div className="place">
                <div className="info">
                <div>Название:</div><div> <input className={(place_data && placeName!=place_data.Place.name)?'unsaved':''} value={placeName?placeName:''} onChange={(e)=>{setPlaceName(e.target.value)}}/></div>
                <div>Оригинальное&nbsp;название:</div><div> <input className={(place_data && placeOriginal_name!=place_data.Place.original_name)?'unsaved':''} value={placeOriginal_name?placeOriginal_name:''} onChange={(e)=>{setPlaceOriginal_name(e.target.value)}}/></div>
                <div>Адрес:</div><div> <textarea className={(place_data && placeAddress!=place_data.Place.address)?'unsaved':''} value={placeAddress?placeAddress:''} onChange={(e)=>{setPlaceAddress(e.target.value)}}/></div>
                <div>Координата:</div> <div>{placeId?<YMapView className="map" key={`map_${place_data.Place.id}`} place_id={placeId}/> :''}</div>
                <div>Тэги:</div><div> <textarea className={(place_data && placeTags!=place_data.Place.tags)?'unsaved':''} value={placeTags?placeTags:''} onChange={(e)=>{setPlaceTags(e.target.value)}}/></div>
                <div>Тизер:</div><div> <textarea className={(place_data && placeTeaser!=place_data.Place.teaser)?'unsaved':''} value={placeTeaser?placeTeaser:''} onChange={(e)=>{setPlaceTeaser(e.target.value)}}/></div>
                <div>Описание:</div><div> <textarea className={(place_data && placeDescription!=place_data.Place.description)?'unsaved':''} value={placeDescription?placeDescription:''} onChange={(e)=>{setPlaceDescription(e.target.value)}}/></div>
                <div>Внутренний&nbsp;рейтинг&nbsp;(0&#8209;5):</div> <div className={(place_data && placeInternal_rating!=place_data.Place.internal_rating)?'unsaved':''}>
                    {placeInternal_rating?placeInternal_rating:0}&nbsp;<input type="range" min="0" max="5" step="1" className={`slider`} value={placeInternal_rating?placeInternal_rating:0} onChange={(e)=>{setPlaceInternal_rating(e.target.value)}} /></div>
                <div>Уровень&nbsp;активности&nbsp;(0&#8209;5):</div> <div className={(place_data && placeActivity!=place_data.Place.activity)?'unsaved':''}>
                    {placeActivity?placeActivity:0}&nbsp;<input type="range" min="0" max="5" step="1" className={`slider`} value={placeActivity?placeActivity:0} onChange={(e)=>{setPlaceActivity(e.target.value)}} /></div>
                <div>Внешний&nbsp;рейтинг:</div> <div>{placeExternal_rating?placeExternal_rating:''}</div>
                <div>Примечание:</div><div> <textarea  className={(place_data && placeComments!=place_data.Place.comments)?'unsaved':''} value={placeComments?placeComments:''} onChange={(e)=>{setPlaceComments(e.target.value)}}/></div>
                <div>Предоплата&nbsp;(%):</div><div> <input className={(place_data && placePrepayment!=place_data.Place.prepayment)?'unsaved':''} type="number" value={placePrepayment?placePrepayment:''} onChange={(e)=>{setPlacePrepayment(e.target.value)}}/></div>
                
                <div><button onClick={()=>{updatePlace({variables:{ id : place_id, 
                                                                    name: placeName,
                                                                    original_name: placeOriginal_name,
                                                                    address: placeAddress,
                                                                    tags:placeTags,
                                                                    teaser:placeTeaser,
                                                                    description: placeDescription,
                                                                    internal_rating :parseInt(placeInternal_rating),
                                                                    activity: parseInt(placeActivity),
                                                                    comments:placeComments,
                                                                    prepayment:parseInt(placePrepayment),
                                                                }
                                                        }
                                                    )}}>Сохранить</button> <button  onClick={()=>setReload((prev)=>!prev)}>Отменить</button></div><div></div>
                <div>Каналы</div><div></div>
            </div>
         {place_id &&   
            <>
            <div className="photos">
                {/* {refetch()} */}
                {/* {console.log('placeStorageId>>>',placeStorageId)} */}
                <PlacePhotos key={`place_photos_${place_id}`} place_id={place_id}/>
            </div>
            <div  key={`place_persons_${place_id}`} className="persons">
                <PlacePersons  place_id={place_id}/>
            </div>
            </>
         }
        </div>
        </>
        )
    }
}


export default Place