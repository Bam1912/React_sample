import { gql } from '@apollo/client'

export const GET_ALL_COMPANIES = gql`
    query Companies {
        Companies {
            id
            name
            address
            email
            phone
            description
            date_added
        }
    }
`

export const GET_COMPANY = gql`
    query Company($id: ID!) {
        Company(company_id: $id){
            id
            name
            address
            email
            phone
            description
            date_added
        }	
    }
`