import { gql } from '@apollo/client'

export const ADD_COUNTRY = gql`
    mutation addCountry($name: String!, $description: String) {
        addCountry(
            country:{
                name: $name, 
                description: $description
            }
            ) {
                id,
                name
            }
    }
`

export const DELETE_COUNTRY = gql`
    mutation deleteCountry($id: ID!) {
        deleteCountry(id: $id) {
                success
                message
            }
    }
`