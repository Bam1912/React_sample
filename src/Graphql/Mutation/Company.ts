import { gql } from '@apollo/client'

export const ADD_COMPANY = gql`
    mutation addCompany($name: String!, $address: String, $email: String,  $phone: String,  $description: String) {
        addCompany(
            company: {
                name: $name, 
                address: $address, 
                email: $email,
                phone: $phone,
                description: $description
            }
            ) {
                id,
                name,
                address,
                email,
                phone,
                description
            }
    }
`

export const DELETE_PERSON = gql`
    mutation deleteCompany($id: ID!) {
        deleteCompany(id: $id) {
                success
                message
            }
    }
`