import { gql } from '@apollo/client'

export const ADD_CITY = gql`
    mutation addCity($name: String!, $country_id: ID!, $description: String) {
        addCity(
            city: {
                name: $name, 
                country_id: $country_id,
                description: $description
            }
            ) {
                id,
                name
            }
    }
`

export const DELETE_CITY = gql`
    mutation deleteCity($id: ID!) {
        deleteCity(id: $id) {
                success
                message
            }
    }
`