import React, { useEffect } from 'react';
import {useQuery, useMutation} from "@apollo/client"
import { GET_ALL_USERS } from '../Graphql/Queries/User'
import { DELETE_USER } from '../Graphql/Mutation/User'

function UserList() {

    const {loading, data} = useQuery(GET_ALL_USERS)

    const [deleteUser, {error}]  = useMutation(DELETE_USER)
    useEffect(() => {
        console.log('UPDATE');
    }, [])

    if(loading) return <><div>загрузка...</div></>
    else
    return <>
        <div>
            {data && data.getAllUsers.map((item)=>{
                return <div key={item.id}>{`${item.name} - ${item.username}`} <button onClick={()=>deleteUser({variables : {id: item.id}})}>Del</button></div>
                })
            }
        </div>
        
        </>
}

export default UserList
