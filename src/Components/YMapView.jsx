import { useMutation, useQuery, NetworkStatus  } from '@apollo/client';
import React, { useState, useEffect, useRef } from 'react'
import { YMaps, Map, Placemark, SearchControl, ObjectManager   } from 'react-yandex-maps';
import { UPDATE_PLACE } from './../Graphql/Mutation/Place'
import { GET_PLACE_COORDINATES } from '../Graphql/Queries/Place';
import { AlertAdd } from './../Redux/alertSlice'
import { useDispatch } from 'react-redux'

const modules = ["layout.ImageWithContent", "GeoObjectCollection", "Placemark"];

const routes = [
  {
    routeId: "0116ЕАПКИР",
    coordinates: [55.613278, 98.568893]
  },
  {
    routeId: "0306ОТКК",
    coordinates: [59.988772, 78.242669]
  },
  {
    routeId: "0506ЕКТМОМНБ-1",
    coordinates: [54.988772, 73.242669]
  },
  {
    routeId: "3005ВК02ХБЧТИР",
    coordinates: [50.987747, 111.51267]
  },
  {
    routeId: "0506ПНКЕОТ",
    coordinates: [53.203076, 45.078721]
  },
  {
    routeId: "0506СПАРСД",
    coordinates: [62.554239, 42.803836]
  },
  {
    routeId: "0306СОСПНБ-1",
    coordinates: [54.664566, 55.862206]
  },
  {
    routeId: "0306МВОМ-2",
    coordinates: [55.12085, 38.818627]
  },
  {
    routeId: "0206ОТТК",
    coordinates: [55.331206, 78.44999]
  }
];

const iconContent = (routeId) =>
  `<div style='color:black;
     display: inline-block;
     font-size: 11px;
     font-weight: bold;
     line-height: 20px;
     padding: 0 5px;
     background: #FFF;
     margin-top: 1px;
     margin-left: 30px;
     opacity: 0.8;
     border-radius: 5px;
     -moz-border-radius: 5px;
     -webkit-border-radius: 5px;'>` +
  routeId +
  `</div>`;


const YMapView = ({ place_id }) => {
  const def_coordinates = [55.75,37.57]
  const [coordinates, setCoordinates] = useState(def_coordinates);
   const ymaps = useRef(null);
  //const [map, setMap] = useState(null);
  const [updatePlace, {loading:update_place_loading, error:update_place_error, data:update_place_data}]  = useMutation(UPDATE_PLACE, {refetchQueries:[GET_PLACE_COORDINATES, 'Place_coorditates']})
  const {loading:place_loading, data:place_data, error:place_error, networkStatus } = useQuery(GET_PLACE_COORDINATES, 
                                                                                                        {variables: {id: place_id},  notifyOnNetworkStatusChange: true, })
  const dispatch = useDispatch()
  function CustomSearchProvider(points) {
    this.points = points;
  }

  CustomSearchProvider.prototype.geocode = function (request, options) {
    let deferred = ymaps.current && ymaps.current.vow.defer();
    let geoObjects = ymaps.current && new ymaps.current.GeoObjectCollection();

    let offset = options.skip || 0;
    let limit = options.results || 20;
// console.log('searchprovider');
    let points = [];
    for (let i = 0, l = this.points.length; i < l; i++) {
      let point = this.points[i];

      if (point.routeId.toLowerCase().indexOf(request.toLowerCase()) !== -1) {
        points.push(point);
      }
    }

    // При формировании ответа можно учитывать offset и limit.
    points = points.splice(offset, limit);

    // Добавляем точки в результирующую коллекцию.
    for (let i = 0, l = points.length; i < l; i++) {
      let point = points[i],
        coordinates = point.coordinates,
        routeId = point.routeId;

      geoObjects.add(
        new ymaps.current.Placemark(coordinates, {
          name: routeId + " name",
          description: routeId + " description",
          balloonContentBody: "<p>" + routeId + "</p>",
          boundedBy: [coordinates, coordinates]
        })
      );
    }

    deferred.resolve({
      // Геообъекты поисковой выдачи.
      geoObjects,
      // Метаинформация ответа.
      metaData: {
        geocoder: {
          // Строка обработанного запроса.
          request,
          // Количество найденных результатов.
          found: geoObjects.getLength(),
          // Количество возвращенных результатов.
          results: limit,
          // Количество пропущенных результатов.
          skip: offset
        }
      }
    });
    // Возвращаем объект-обещание.
    return deferred.promise();
  };

  const dataConvert = (routes) => {
    let features = [];
    routes &&
      routes.map((route, i) => {
        const lat = route.coordinates[0];
        const lon = route.coordinates[1];
        let tmpObj = {
          type: "Feature",
          id: route.routeId,
          route: route,
          geometry: {
            type: "Point",
            coordinates: [lat, lon]
          },
          properties: {
            iconContent: iconContent(route.routeId)
          }
        };
        return features.push(tmpObj);
      });
    return features;
  };

  useEffect(() => {
    
    if(place_loading == false && networkStatus===NetworkStatus.ready){
      // if (networkStatus === NetworkStatus.ready) {
        //  console.log('данные занружены',place_data); 
        if(place_data && place_data.Place.coordinates) {
              setCoordinates(place_data.Place.coordinates.split(','));
              // console.log('установлены координаты',place_data.Place.coordinates.split(',')); 
        }
      // }
    }

    if(update_place_loading == false  && networkStatus===NetworkStatus.ready){
      if(update_place_error){
        dispatch(AlertAdd({text:"Ошибка сохранения",id:new Date().valueOf(),timeout:10000}))
        // console.log("update_place_error>>",update_place_error);
      }

      if(update_place_data && update_place_data.updatePlace && update_place_data.updatePlace.success == true){
        dispatch(AlertAdd({text:'позиция сохранена',id:new Date().valueOf(),timeout:2000}))
        // refetch()
      }
    }

  }, [update_place_loading, place_loading])

  if (networkStatus === NetworkStatus.loading) return(<div>загрузка</div>)
  else
  return (
      <>
      <YMaps enterprise={false} query={{csp:true}} preload={false}>
        <Map           
          modules={modules}
            onLoad={(api) => {
              // console.log('YMap api>>>>',api);
              ymaps.current = api;
            }}
              defaultState={{ center: coordinates, zoom: 15 }}
              width={'100%'}
              height={'300px'}
          >
          {/* <SearchControl
          options={{
            float: "right",
            maxWidth: 190,
            noPlacemark: true,
            provider: new CustomSearchProvider(routes),
            
            resultsPerPage: 5
          }}
        /> */}
       
        <Placemark 
          key={'yandex-map-widget'}
          geometry={coordinates} // координаты метки
          properties={{iconCaption: place_data.Place.name?place_data.Place.name:'Метка'}} //place_data && place_data.Place.name
          onLoad={()=>{ 
                    // console.log('onLoad',coordinates);
                    }}
          options={{
              // iconLayout: 'default#image',
              // iconImageHref: pin, //установили в качестве метки свою картинку
              iconImageSize: [30, 30], // размер нашей картинки
              hideIconOnBalloonOpen: false, //запрет на скрытие метки по клику на балун
              balloonOffset: [3, -40],
              draggable:true,
              
          }}
          // modules={[ //чтобы видеть хинты и балуны подключаем данные модули
          //     'objectManager.addon.objectsBalloon',
          //     'objectManager.addon.objectsHint',
          // ]}
          // properties={{
          //     balloonContentHeader: "Balloon3",
          //     balloonContent: "<p style='color: red'>Balloon3 <strong>Test</strong></p>"
          // }}
          onDragEnd={(e) => {setCoordinates(e.get('target').geometry.getCoordinates())}} //console.log(e.get('target').geometry.getCoordinates())
        />
       
        </Map>
        </YMaps>
      { ( (place_data && place_data.Place.coordinates && coordinates && coordinates[0]!='' && coordinates[1]!='' && (place_data.Place.coordinates.split(',')[0] != coordinates[0] || place_data.Place.coordinates.split(',')[1] != coordinates[1]))
           || (!place_data.Place.coordinates && coordinates)
        ) &&
          <div><br /><button onClick={()=>{updatePlace({variables:{ id : place_id, 
                                                          coordinates:coordinates.join(','),
                                                      }
                                              })
                                }
                          }>сохранить позицию</button>
                          </div>
      } 
      
      </>
    )
  
};

export default YMapView