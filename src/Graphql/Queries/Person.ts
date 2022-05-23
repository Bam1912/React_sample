import { gql } from '@apollo/client'

export const GET_ALL_PERSONS = gql`
    query Persons {
        Persons {
            id
            name
            second_name
            email
            phone
            comments
            date_added
        }
    }
`

export const GET_PERSON = gql`
    query Person($id: ID!) {
        Person(person_id: $id){
            id
            name
            second_name
            email
            phone
            comments
            date_added
        }	
    }
`