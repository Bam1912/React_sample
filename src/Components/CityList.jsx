import React, { useState, useEffect, useRef } from 'react';
import {useQuery, useMutation} from "@apollo/client"
import { GET_COUNTRY } from './../Graphql/Queries/Country'
import { DELETE_CITY, ADD_CITY } from './../Graphql/Mutation/City'
import PlaceList from './PlaceList';
import useLocalStorage from '../Hooks/useLocalStorage'

const CityList = ({country_id, reload}) => {
    const countryId = useRef(country_id)
    //console.log(cId, country_id);
    const [cityName, setCityName] = useState('')
    // const [cityId, setCityId] = useState('')
    const [cityId, setCityId] = useLocalStorage(0,'cityId');
    const {loading, data, error, refetch} = useQuery(GET_COUNTRY, {variables: {id: country_id}})
    
//  console.log("cityId>>",cityId)
    const [deleteCity, {loading:delete_loading, error:delete_error, data:delete_data}]  = useMutation(DELETE_CITY)
    const [addCity, {loading:create_loading, error:create_error, data:create_data}]  = useMutation(ADD_CITY)
    
    useEffect(() => {
        if(countryId.current != country_id) setCityId(0) 
    }, [country_id])

    const reload_city  = () =>{ 
                        refetch();
                        reload();
                    }

    // const reload  = () =>{ console.log('REFETCH>>>>') 
    // refetch();}
    
    useEffect(() => {
        // console.log(create_data);
        if(create_data && create_data.addCity.id) setCityId(create_data.addCity.id)
            setCityName('')
            refetch();
            reload();
    }, [ create_loading ,delete_loading ])

    if(loading) return <><div className="citylist">загрузка...</div></>
    else{
        //  console.log('sight_delete_data>>>',sight_delete_data)
    return <>
        <div className="citylist">
            {!!data && data.Country.length && data.Country[0].citys && data.Country[0].citys.map((item)=>{
                return      <div  key={`city_${item.id}`}  className={" item "+(cityId==item.id?"selected":"")}
                                 onClick={()=>{setCityId((val)=>cityId!='' && val==item.id?'':item.id);}}>
                                {`${item.name} - ${item.description} (${item.placesCount})`}
                                {item.placesCount==0?
                                <button onClick={()=>{if (window.confirm('Удалить город?')){
                                        setCityId((val)=>0);
                                        deleteCity({variables : {id: item.id}})
                                        }}
                                }>Удалить</button>
                                :
                                ''}
                                
                            </div>
                })
            }
            <input type="text" placeholder="название города" value={cityName} onChange={(e)=>{setCityName(e.target.value)}} />
            <button onClick={()=>{if(cityName) addCity({variables : {name: cityName, country_id: country_id}})}}>Добавить</button>
        </div>
        {!!cityId&&<PlaceList reload={()=>reload_city()} city_id={cityId} />} 
        {!countryId && <div>Выберите город</div>}
        </>
    }
}


export default CityList