import { gql } from '@apollo/client'

export const GET_ALL_CHANNELS = gql`
    query getAllChannels {
        Channels {
            id
            name
            is_active
        }
    }
`
