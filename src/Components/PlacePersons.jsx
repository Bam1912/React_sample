import React, { useState, useEffect } from 'react'
import {useQuery, useMutation } from "@apollo/client"
import { GET_PLACE } from '../Graphql/Queries/Place'
import { UPDATE_PLACE } from '../Graphql/Mutation/Place'
import './css/PlacePersons.scss'
import { MdAddCircleOutline } from 'react-icons/md'

const PlacePersons = ({place_id}) => {
    const [person, setPerson] = useState(0)
    const [persons, setPersons] = useState([])
    const [addPerson, setAddPerson] = useState(false)

    const {data:place_data} = useQuery(GET_PLACE, {variables: {id: place_id}})
    const [updatePlace, {loading:update_place_loading, error:update_place_error, data:update_place_data}]  = useMutation(UPDATE_PLACE, {refetchQueries:[GET_PLACE]})
    
    const [currentPerson, setCurrentPerson] = useState('')
    
    useEffect(() => { 
    },[])

    const dragStart = (e,item)=>{
        e.dataTransfer.setData('text/plain',null)
        setCurrentPerson(item)
        // e.target.style.opacity = .1;
        e.dropEffect = 'linkMove';
        e.dataTransfer.effectAllowed = "move"
        console.log(e.dataTransfer)
    }
    const dragLive = (e,item)=>{
        e.preventDefault()
        // e.target.style.backgroundColor = '#000'
        
        console.log('live',item)
        if(currentPerson != item && persons){
            let tmp = [...persons]
            let tmp_el = tmp[item]
            tmp[item] = tmp[currentPerson]
            tmp[currentPerson] = tmp_el
            setPersons(tmp)
            setCurrentPerson(item)
        }
    }
    const dragOver = (e,item)=>{
        e.preventDefault()
    }

    const dragEnd = (e, item)=>{
        e.preventDefault()
    }

    if(place_data && place_data.Place && place_data.Place.persons.length>0 && persons.length==0){
        setPersons(place_data.Place.persons)
    }

    if(!place_data) { 
        return <><div className="place">загрузка...</div></>
    }
    else{
        return (
        <> 
        { addPerson &&
            <>
            Имя:<input type="text"/><br/>
            Фамилия:<input type="text"/><br/>
            Телефон:<input type="text"/><br/>
            Email:<input type="text"/><br/>
            <button>Соханить</button>
            <button onClick={()=>setAddPerson(false)}>Назад</button>
            </>
        }
        { !addPerson && persons &&(
            <>
            <MdAddCircleOutline className="addPerson" onClick={()=>setAddPerson(true)}/>
            {
                        persons.map((item, index)=>{
                            if(!person) setPerson(index)
                            return(
                                <>
                                <div draggable={true}
                                drag
                                                onDragStart={(e)=>dragStart(e,index)}
                                                onDragLeave={(e)=>dragLive(e,index)}
                                                onDragEnd={(e)=>dragEnd(e,index)} 
                                                onDragOver={(e)=>dragOver(e,index)}
                                                className={"person "+ (person==item.id?" current ":"")} onClick={()=>setPerson(item.id)}
                                                style={{border:currentPerson !== item.id?"none":"solid 1px #000"}}
                                                >
                                    
                                            {item.name?<div className="name">{item.name}</div>:""} 
                                            {item.seond_name?<div className="secondName">{item.seond_name}</div>:""} 
                                
                                
                                        {(person == item.id) && <div className="person-data">
                                        {item.phone?<div className="phone">{item.phone}</div>:""}
                                        {item.email?<div className="email">{item.email}</div>:""}
                                        </div>
                                    }
                                </div>
                                </>
                            )
                        }
                        )
            }
            </>
        )}
        </>
        )
    }
}


export default PlacePersons