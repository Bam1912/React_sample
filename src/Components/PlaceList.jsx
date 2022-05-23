import React, { useState, useEffect, useRef } from 'react';
import {useQuery, useMutation} from "@apollo/client"
import { GET_CITY } from '../Graphql/Queries/City'
import { ADD_PLACE, DELETE_PLACE } from '../Graphql/Mutation/Place'
import Place from './Place';
import useLocalStorage from '../Hooks/useLocalStorage'

const PlaceList = ({city_id,reload}) => {
    const cityId = useRef(city_id)
    const [placeName, setPlaceName] = useState('')
    const [placeId, setPlaceId] = useLocalStorage('','placeId')
    const {loading:city_loading, data:city_data, error:city_error, refetch} = useQuery(GET_CITY, {variables: {id: city_id}})
    
    const [addPlace, {loading:place_add_loading, error:place_add_error, data:place_add_data}]  = useMutation(ADD_PLACE)
    const [deletePlace, {loading:place_delete_loading, error:place_delete_error, data:place_delete_data}]  = useMutation(DELETE_PLACE)
    
    useEffect(() => {
        if(cityId.current != city_id) setPlaceId(0) 
    }, [city_id])

    useEffect(() => {
        if(!placeId) setPlaceId(0) 
    }, [placeId])

    useEffect(() => {
          if((city_data&& city_data.City && city_data.City.length && city_data.City[0].places && city_data.City[0].places.find(item=>item.id === placeId))){ setPlaceId(0); refetch()} 
    },[city_id])

    useEffect(() => {
        if(place_delete_data && place_delete_data.deletePlace.success == true)  setPlaceId('') 
        

        if(place_add_data && place_add_data.addPlace.id) setPlaceId(place_add_data.addPlace.id)
        
        refetch();
        reload();
        setPlaceName('')
    }, [place_delete_loading, place_add_loading])

    if(city_loading) return <><div className="placelist">загрузка...</div></>
    else{
    return( 
        <>
        <div className="placelist">
            {

            }
            {!!city_data && city_data.City && !!city_data.City.places && city_data.City.places.map((item)=>{
                return <div  key={`place_${item.id}`}  className={" item "+(placeId==item.id?"selected":"")} key={`place_${item.id}`}
                            onClick={()=>{setPlaceId((val)=>placeId!='' && val==item.id?'':item.id);}}>
                        {`${item.name}`}
                    <button onClick={()=>{ if (window.confirm('Удалить место?')){setPlaceId((val)=>0); deletePlace({variables : {id: item.id}})}}}>Удалить</button></div>
                })
            }
            <input type="text" placeholder="название достопримечательности" value={placeName} onChange={(e)=>{setPlaceName(e.target.value);}} /><button onClick={()=>{if(placeName) addPlace({variables : {name: placeName, city_id: city_id}})}}>Добавить</button>
        </div>
            {!!placeId&&<Place key={`place_detail_${placeId}`}  place_id={placeId} />}  
            {!placeId && <div>Выберите Место</div>}
            </>
    )
    }
}


export default PlaceList