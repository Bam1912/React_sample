import { createSlice } from "@reduxjs/toolkit";


const alertSlice = createSlice({
    name: "alert",
    initialState: {
        alerts: [
            //   { 
            //      text:'',
            //      id : 0,
            //      timeout:0
            //   }
        ]
    },
    reducers: {
        AlertAdd(state, action){
            state.alerts.push(action.payload)
        },
        
        AlertRemove(state,action){
            state.alerts = state.alerts.filter(alert=>alert.id !== action.payload.id)
        },
    },
})


export const {AlertAdd, AlertRemove} = alertSlice.actions
export default alertSlice.reducer