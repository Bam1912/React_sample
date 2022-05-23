// import React, { useState, useEffect } from 'react'
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import { UPDATE_SIGHT } from './../Graphql/Mutation/Sight'
// import { useMutation } from '@apollo/client'


// function OMap({sight_id, coords, name , refetch}) {
//   const [coordinates, setCoordinates] = useState(coords);
//   const position = [coordinates[0]?coordinates[0]:55.75, coordinates[1]?coordinates[1]:37.57]
//   const [mapLoading, setMapLoading] = useState(false);
//   const [updateSight, {/*loading:update_sight_loading, error:update_sight_error, data:update_sight_data*/}]  = useMutation(UPDATE_SIGHT)
  
//   useEffect(() => {
//       setCoordinates(coords)
//   }, [coords])
          
//   return(
//     <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
//       <TileLayer
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker position={position}>
//         <Popup>
//           A pretty CSS3 popup. <br /> Easily customizable.
//         </Popup>
//       </Marker>
//     </MapContainer>
//   )
// }
// export default OMap