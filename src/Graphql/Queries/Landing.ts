import { gql } from '@apollo/client'

export const GET_ALL_LANDINGS = gql`
    query landings {
        Landings {
            id
            name
            link
            is_active
        }
    }
`

export const GET_LANDING = gql`
    query Landing($id: ID!) {
        Landing(landing_id: $id){
            id
            name
            phone
            email
            social
            organization
            link
            is_active
          segments{
            id
            type
            title
            name
            titleEffect
            subtitle
            subtitleEffect
            color
            content
            contentEffect
            sort_order
            is_hidden
          }
        }	
    }
`