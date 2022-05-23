import { gql } from '@apollo/client'

export const ADD_STORAGE = gql`
    mutation addStorage{
        addStorage{
        id
        }
    }
`

export const ADD_TO_STORAGE = gql`
    mutation addToStorage($storage_id: ID!, $file: InputFile! ) {
        addToStorage(storage_id: $storage_id, file: $file) {
                success
                message
            }
    }
`

export const DEL_FROM_STORAGE = gql`
    mutation deleteFromStorage($storage_id: ID!, $file_id: ID! ) {
        deleteFromStorage(storage_id: $storage_id, file_id: $file_id) {
                success
                message
            }
    }
`
