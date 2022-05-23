import { gql } from '@apollo/client'


export const GET_FORMS = gql`
        query getForms($landing_id:ID!){
            getForms(landing_id:$landing_id){
            id,
            landing_id,
            title
            subtitle
            confirmation
            popup
            inputs{
                id,
                name,
                placeholder,
                required,
                pattern,
                type
            }
        }
        }
`
export const GET_FORM = gql`
query getForm($form_id:ID!){
    getForm(form_id:$form_id){
    id
    title
    subtitle
    confirmation
    landing_id
    popup
    inputs{
        id,
        name,
        placeholder,
        required,
        pattern,
        type
    }
}
}
`
