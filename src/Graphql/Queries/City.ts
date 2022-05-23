import { gql } from '@apollo/client'

export const GET_ALL_CITYS = gql`
    query Citys {
        Citys {
            id
            country_id
            name
            description
            placesCount
            storage_id
        }
    }
`

export const GET_CITY = gql`
    query City($id: ID!) {
        City(city_id: $id){
            id
            name
            storage_id
            placesCount
                places{
                    id
                    name
                    teaser
                }
        }	
    }
`