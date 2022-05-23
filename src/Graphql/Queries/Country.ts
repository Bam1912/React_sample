import { gql } from '@apollo/client'

export const GET_COUNTRIES = gql`
    query Countries {
        Countries {
            id
            name
            description
            citysCount
            storage_id
            citys{
                id
                name
                placesCount
            }
        }
    }
`

export const GET_COUNTRY = gql`
    query Country($id: ID!) {
        Country(country_id: $id){
            name
                citys{
                    id
                    name
                    description
                    storage_id
                    placesCount
                    places{
                        id
                        name
                        description
                    }
                }
        }	
    }
`