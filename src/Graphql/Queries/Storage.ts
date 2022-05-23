import { gql } from '@apollo/client'

export const GET_STORAGE = gql`
    query getStorage($id :ID){
        Storage(storage_id:$id){
        id
        files{
            id
            name
            path
            date_added
            date_updated
            date_deleted
        }
        filesCount
        }
    }
`