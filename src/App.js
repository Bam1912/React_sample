import React from 'react';
import {useQuery} from "@apollo/client"
import CountryList from './Components/CountryList';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css'
import Notifications from './Components/Notifications';
import LandingPage from './Landing/LandingPage';
import { GET_ALL_LANDINGS } from './Graphql/Queries/Landing';
import { IoMdRemove } from 'react-icons/io';
import ExternalLink from './Components/ExternalLink';



function App() {

   const {loading, data:landings_data, error, refetch, networkStatus} = useQuery(GET_ALL_LANDINGS)

    

  return (
    <Router basename={process.env.REACT_APP_PUBLIC_URL}>
    <Notifications/>
        <Routes>
          <Route path='/' element={<div className="landing"><LandingPage landing_id={1}/></div>} />
          <Route path='/directory' element={
                                              <div className="page"><div className="directory">
                                              <CountryList />
                                              </div></div>
                                            }/>
          
          
          <Route path=':link' element={<ExternalLink />} />  
          <Route path='*' element={<ExternalLink />} /> 
        </Routes>
    </Router>
  );
}

export default App;
