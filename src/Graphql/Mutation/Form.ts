import { gql } from '@apollo/client'


export const SAVE_FORM_DATA = gql`
    mutation saveFormData($landing_id: String, $form_id: ID!, $data: String) {
        saveFormData(
            landing_id: $landing_id,
            form_id: $form_id, 
            data: $data
            ) {
                id,
                landing_id,
                form_id,
                data,
                date_added
            }
    }
`
