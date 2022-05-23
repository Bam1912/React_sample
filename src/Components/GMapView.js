import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function GMapView({lat,lng}) {
    const containerStyle = {
        width: '400px',
        height: '400px'
      };
      
      const center = {
        lat: lat?lat:0,
        lng: lng?lng:0
      };

    const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA6qt-g3X2qYC0wpyTgAM2A8RSZm629FOg"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
    console.log('onload')
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
    console.log('unmount')
  }, [])

  const onCenterChanged = React.useCallback(function callback(map) {
    console.log('onCenterChanged')
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onCenterChanged={onCenterChanged}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <React.Fragment>
        <Marker position={center} draggable={true}></Marker>
        </React.Fragment>
      </GoogleMap>
  ) : <React.Fragment></React.Fragment>
}

export default GMapView//React.memo(MapView)