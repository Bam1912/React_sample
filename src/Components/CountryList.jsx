import React, { useState, useEffect, useRef } from 'react'
import {useQuery, useMutation} from "@apollo/client"
import { GET_COUNTRIES } from './../Graphql/Queries/Country'
import { ADD_COUNTRY, DELETE_COUNTRY } from './../Graphql/Mutation/Country'
import { DELETE_CITY, ADD_CITY } from './../Graphql/Mutation/City'
import PlaceList from './PlaceList';
import { AlertAdd } from './../Redux/alertSlice'
import { useDispatch } from 'react-redux'
import useLocalStorage from '../Hooks/useLocalStorage'

const CountryList = () => {
    const [countryName, setCountryName] = useState('')
    const [cityName, setCityName] = useState('')
    const [countryId, setCountryId] = useLocalStorage(0,'countryId')
    const [cityId, setCityId] = useLocalStorage(0,'cityId')
    const [placeId, setPlaceId] = useLocalStorage('','placeId')
    const {loading, data, error, refetch } = useQuery(GET_COUNTRIES) //{pollInterval: 500,}

    const [deleteCountry, {loading:delete_loading,error:delete_error, data:delete_data }]  = useMutation(DELETE_COUNTRY)
    const [addCountry, {loading:create_loading, error:create_error, data:create_data}]  = useMutation(ADD_COUNTRY)
    const [deleteCity, {loading:delete_city_loading, error:delete_city_error, data:delete_city_data}]  = useMutation(DELETE_CITY)
    const [addCity, {loading:create_city_loading, error:create_city_error, data:create_city_data}]  = useMutation(ADD_CITY)

    const reload  = () => refetch();
    
    const dispatch = useDispatch()

    useEffect(() => {
        if(error){
            dispatch(AlertAdd({text:'Ошибка',id:new Date().valueOf(),timeout:10000}))
            console.log('ERROR>>>',error);
        }
    },[loading]);

    useEffect(() => {
        if(create_data && create_data.addCountry.id) setCountryId(create_data.addCountry.id)
        if(create_city_data && create_city_data.addCity.id) setCityId(create_city_data.addCity.id)
            setCountryName('')
            setCityName('')
            refetch();
    }, [create_loading ,delete_loading, create_city_loading, delete_city_loading])

    if(loading || create_loading) return (<><div>загрузка...</div></>)
    else{
        let cl ='';
    return (<>
        <div className="countrylist">
            {data && data.Countries.map((item)=>{
                return <ul key={`country_${item.id}`}>
                        <li className={" item " + (countryId==item.id?" selected ":"")}
                            onClick={()=>setCountryId((val)=>{
                                                        if(countryId && val==item.id) {
                                                            setPlaceId(0)
                                                            setCityId(0)
                                                            return 0;
                                                        } 
                                                        else {
                                                            if(val!=item.id){
                                                                setPlaceId(0)
                                                                setCityId(0)
                                                            }
                                                            return item.id
                                                        }
                                                    })}>
                            {`${item.name} - ${item.description} (${item.citysCount})`} 
                        </li>
                            {!!countryId && countryId == item.id && item.citys &&
                                <ul>
                                    {item.citys.map((city)=>
                                                <li  key={`city_${city.id}`}  className={" item "+(cityId==city.id?"selected":"")}
                                                    onClick={()=>{
                                                                setCityId((val)=>{
                                                                    if(cityId && val==city.id) {
                                                                        setPlaceId(0)
                                                                        return 0;
                                                                    } 
                                                                    else {
                                                                        setPlaceId(0)
                                                                        return city.id
                                                                    }
                                                                })
                                                            }
                                                            }>
                                                    {`${city.name} (${city.placesCount})`}
                                                    {city.placesCount==0?
                                                    <button onClick={()=>{if (window.confirm('Удалить город?')){
                                                            setCityId((val)=>0);
                                                            deleteCity({variables : {id: city.id}})
                                                            }}
                                                    }>Удалить</button>
                                                    :
                                                    ''}
                                                </li>)
                                    }
                                    <input type="text" placeholder="название города/края" value={cityName} onChange={(e)=>{setCityName(e.target.value)}} />
                                    <button onClick={()=>{if(cityName) addCity({variables : {name: cityName, country_id: countryId}})}}>Добавить</button>
                                </ul>
                            }
                        {item.citysCount==0?
                            <button onClick={()=>{if(item.id) if (window.confirm('Удалить страну?')){setCountryId((val)=>0); deleteCountry({variables : {id: item.id}})}}}>Удалить</button>
                            :
                            ""
                        }
                       
                    </ul>
                })
            }
            <input type="text" placeholder="название страны" value={countryName}  onChange={(e)=>{setCountryName(e.target.value)}} /> <button onClick={()=>{if(countryName) addCountry({variables : {name: countryName}})}}>Добавить</button>
        </div>
        {
            countryId && cityId && <PlaceList key={"places_"+cityId} reload={()=>reload()} city_id={cityId} />
        }
        {
            !countryId && <div>Выберите страну</div>
        }
        {
            countryId && !cityId && <div>Выберите город</div>
        }
        </>)
    }
}

export default CountryList

