import { gql } from '@apollo/client'

export const GET_ALL_PLACES = gql`
    query getAllPlaces {
        Places {
            id
            name
            city_id
            address
            description
        }
    }
`
export const GET_ALL_PLACES_WITH_LINKS = gql`
    query getPlacesWithLinks {
        Places_links {
            id
            name
            city_id
            address
            description
            links{
            id
            link
            channel
            is_active
            }
        }
    }
`

export const GET_PLACE = gql`
    query Place($id: ID!) {
        Place(place_id: $id){
            id
            name
            original_name
            address
            type_id
            city_id
            price_category_id
            coordinates
            tags
            teaser
            description
            internal_rating
            external_rating
            activity
            comments
            prepayment
            storage_id
            persons {
                id
                name
                second_name
                phone
                email
            }
            links{
                id
                link
                channel
                is_active
                }
        }	
    }
`

export const GET_PLACE_COORDINATES = gql`
    query Place_coorditates($id: ID!) {
        Place(place_id: $id){
            id
            name
            address
            coordinates
        }	
    }
`