import { gql } from '@apollo/client'

export const ADD_PLACE = gql`
    mutation addPlace($name: String!, $city_id: ID!) {
        addPlace(
            place:{
                name: $name, 
                city_id: $city_id
            }
            ) {
                id,
                name
            }
    }
`
export const UPDATE_PLACE = gql`
    mutation updatePlace($id: ID!, 
                         $name: String, 
                         $original_name:String, 
                         $address: String, 
                         $tags: String, 
                         $teaser: String, 
                         $description: String,
                         $internal_rating: Int,
                         $activity: Int,
                         $comments: String, 
                         $prepayment: Int, 
                         $coordinates: String,
                         $storage_id: ID,
                         ) {
        updatePlace(
            id: $id,
            place:{ 
                name: $name, 
                original_name: $original_name, 
                address: $address, 
                tags: $tags,
                teaser: $teaser,
                description: $description
                internal_rating: $internal_rating,
                activity: $activity
                comments: $comments
                prepayment: $prepayment
                coordinates: $coordinates
                storage_id: $storage_id
            }
            ) {
                success,
                message
            }
    }
`

export const DELETE_PLACE = gql`
    mutation deletePlace($id: ID!) {
        deletePlace(id: $id) {
                success
                message
            }
    }
`