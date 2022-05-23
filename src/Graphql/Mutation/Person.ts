import { gql } from '@apollo/client'

export const ADD_PERSON = gql`
    mutation addPerson($name: String!, $second_name: String, $email: String,  $phone: String,  $comments: String) {
        addPerson(
            person: {
                name: $name, 
                second_name: $second_name, 
                email: $email,
                phone: $phone,
                comments: $comments
            }
            ) {
                id,
                name,
                second_name,
                email,
                phone,
                comments
            }
    }
`

export const DELETE_PERSON = gql`
    mutation deletePerson($id: ID!) {
        deletePerson(id: $id) {
                success
                message
            }
    }
`