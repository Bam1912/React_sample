import React from 'react'
import { useParams } from 'react-router'
import {useQuery} from "@apollo/client"
import { GET_ALL_LANDINGS } from './../Graphql/Queries/Landing';
import LandingPage from '../Landing/LandingPage';
import { Link } from 'react-router-dom';
import { GET_ALL_PLACES_WITH_LINKS } from '../Graphql/Queries/Place';
import PlacePage from '../Landing/PlacePage';

function ExternalLink() {
    let params = useParams()
    const {loading, data:landings_data, error, refetch, networkStatus} = useQuery(GET_ALL_LANDINGS)
    const {loading:places_loading, data:places_data, error:places_error, networkStatus:places_networkStatus} = useQuery(GET_ALL_PLACES_WITH_LINKS)
    
  if(landings_data && places_data)  {
    const item = landings_data.Landings.find(el=>el.link==params.link)
    if(item && item.id){
        return (
            <div className="landing"><LandingPage landing_id={item.id} /></div>
        )
    }
    else
    {
        const place = places_data.Places_links.find(place=>place.links.find(item=>item.link===params.link))                                                           
                                                                
        if(place && place.id){
            return (
                <div className="landing"><PlacePage place_id={place.id}/></div>
            )   
        }
        else
   
     return (
        <div style={{ padding: "1rem", textAlign: "center"}} className='error'>Страница не существует.<br/>Error 404<br/>Перейти на главную страницу <Link to="/">LevelFive.ru</Link></div>
     )
    }
  }
  else return(
      <></>
  )

}
export default ExternalLink