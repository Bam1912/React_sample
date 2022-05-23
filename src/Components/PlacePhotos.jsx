import React, { useState, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
// import { useActions } from '../Hooks/useActions'
import {useQuery, useMutation, NetworkStatus} from "@apollo/client"
import { GET_STORAGE } from '../Graphql/Queries/Storage'
import { ADD_STORAGE, ADD_TO_STORAGE, DEL_FROM_STORAGE } from '../Graphql/Mutation/Storage'
import { UPDATE_PLACE } from '../Graphql/Mutation/Place'
import { GET_PLACE } from '../Graphql/Queries/Place'
import { IoIosEye, IoIosCloseCircle } from 'react-icons/io'
import { AlertAdd } from './../Redux/alertSlice'
import { useDispatch } from 'react-redux'

function PlacePhotos({ place_id }) {
  const DOMAIN = 'https://levelfive.ru'
  const dispatch = useDispatch()
  const { getRootProps, getInputProps,isDragActive,/*isDragAccept, isDragReject*/ } = useDropzone({
          accept: "image/*",
          onDrop: (acceptedFiles, fileRejections) => fileFactory(acceptedFiles, fileRejections)
          });

  var submenu_timer
  const [selectedImage, setSelectedImage] = useState('');
  const [dropedFiles, setDropedFiles] = useState([])
  const [files, setFiles] = useState([])
  const stor = useRef();

  const addStorageCompleted = (data) => {
    if(data && data.addStorage){
      stor.current = data.addStorage.id;
      updatePlace({variables:{id:place_id, storage_id: data.addStorage.id}})
      }
  }

  const deleteFile = ({storage_id, file_id, file_name}) =>{
    const body = new FormData()
    body.append('storage_id', place_data.Place.storage_id);
    body.append('action','/DeleteFile');
    body.append('storage_id',storage_id);
    body.append('file_name',file_name);
    fetch(DOMAIN+'/api/filefactory.php', {
      method: 'POST',
      body
    })
    .then(json => json.json())
    .then(data => { 
        if(data.success == true ) {
            deleteFromStorage({variables:{storage_id, file_id}})
            const itemIndex =  files.findIndex(file=>file.id === file_id)
            setFiles([...files.slice(0,itemIndex),...files.slice(itemIndex+1)])
            dispatch(AlertAdd( { data:`Файл ${data.file.name?data.file.name:''} успешно удален`,id:new Date().valueOf(),timeout:3000 }))
        }
          else 
          dispatch(AlertAdd(`Ошибка удаления файла ${data.file.name?data.file.name:''}`,new Date().valueOf(),10000))
    })
    
  }

  const {loading:place_loading, data:place_data, error:place_error, refetch:reload_place_data, networkStatus: place_networkStatus} = useQuery(GET_PLACE, {notifyOnNetworkStatusChange:true, variables: {id: place_id}})
  const {loading:storage_load, data: storage_data, error, refetch:reload_storage_data, networkStatus: storage_networkStatus} =  useQuery(GET_STORAGE, {notifyOnNetworkStatusChange:true, variables: {id: place_data&&place_data.Place&&place_data.Place.storage_id?place_data.Place.storage_id:0}})
  const [addStorage, {loading:addStorage_loading, error:addStorage_error, data:addStorage_data}]  = useMutation(ADD_STORAGE , {onCompleted: addStorageCompleted, refetchQueries:[GET_PLACE] })
  const [addToStorage, {loading:addToStorage_loading, error:addToStorage_error, data:addToStorage_data}] = useMutation(ADD_TO_STORAGE, {/*onCompleted: addToStorageCompleted,*/ refetchQueries:[GET_STORAGE]})
  const [updatePlace, {loading:updatePlace_loading, error:updatePlace_error, data:updatePlace_data}] = useMutation(UPDATE_PLACE, {/*onCompleted: updatePlaceCompleted,*/ refetchQueries:[GET_PLACE]})
  const [deleteFromStorage, {loading:deleteFromStorage_loading, error:deleteFromStorage_error, data:deleteFromStorage_data}]  = useMutation(DEL_FROM_STORAGE , { /*onCompleted: deleteFromStorageCompleted, */ refetchQueries:[GET_STORAGE] })

  useEffect(()=>{
    if(storage_load==false && storage_networkStatus == NetworkStatus.ready){
      if(storage_data && storage_data.Storage && storage_data.Storage .filesCount > 0){
        const f_arr = storage_data.Storage.files.map((file)=>{return({'id':file.id, 'name':file.name, 'path':file.path})})
        setFiles(f_arr)
      }
    }
  },[storage_load])

  const fileFactory = (files, rejectedFiles) =>{
    
    rejectedFiles && rejectedFiles.forEach((item) =>{dispatch(AlertAdd({text:`файл ${item.file.name} не является поддреживаемым типом изображений`,id:new Date().valueOf(),timeout:10000})) } )

    files && files.forEach((file) => {
        const body = new FormData()
        body.append('storage_id', place_data.Place.storage_id);
        body.append('action','/SaveFiles');
        body.append('images[]',file);
        
        fetch(DOMAIN+'/api/filefactory.php', {
           method: 'POST',
           body
        })
        .then(json => {return json.json()})
        .then(data => { 
           if(data.success == true ) data.data.forEach((file)=>{ 
                                              addToStorage({variables:{
                                                                "storage_id": place_data.Place.storage_id,
                                                                "file": {
                                                                  "name": file.name,
                                                                  "path": file.path
                                                                }    
                                                              }}
                                              )
                                              dispatch(AlertAdd(`Файл ${file.name} добавлен`,new Date().valueOf(),3000))
                                               setDropedFiles(arr=>{
                                                  const itemIndex =  arr.findIndex(res=>res.name === file.name)
                                                  return [...arr.slice(0,itemIndex),...arr.slice(itemIndex+1)]
                                               })
                                          })
             else { dispatch(AlertAdd(data.message,new Date().valueOf(),10000)) }

       }); 
       
       setDropedFiles((prev)=>[...prev, {'name':file.name, 'progress':'загружаем'}])
     })
  }

  
  useEffect( () => {
    if(place_networkStatus === NetworkStatus.ready){
      if(place_loading==false && place_data && place_data.Place && !place_data.Place.storage_id) 
        if(!stor.current) addStorage();
    }
  }, [place_loading])


  return (
    <div>
        
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div /*onDragOver={()=>{setDropOver(true)}} onDragLeave={()=>{setDropOver(false);}}*/ className={`file_target ${isDragActive?'hovered':''}`}>
                  Поместите файл(ы) сюда<br/>или<br/>нажимте чтобы выбрать файл(ы)
                  {/* {isDragAccept&& <div>идет загрузка</div>} */}
                  <div className="progress">
                    {dropedFiles&&dropedFiles.map((e)=><div className="item" key={`file_${e.name}_${e.progress}`}>{`${e.name} - ${e.progress}`}</div>)}
                  </div>
                </div>
              </div>
              
            </section>
          
        {
          <div className='fileList'>
            { storage_networkStatus == NetworkStatus.loading &&
            <div>загружаю...</div>}
            {  files && files.length>0 &&
                  files.map((file)=><div key={`file_${file.id}`} className="fileItem" 
                                        onMouseOver={()=>{if(submenu_timer) clearTimeout(submenu_timer); setSelectedImage(`file_${file.id}`)}} 
                                        onMouseLeave={()=>{submenu_timer = setTimeout(() => {
                                                            setSelectedImage('')
                                                          }, 1000); }}>
                                        <div>
                                            <img src={DOMAIN+`/imagepreview/${place_data.Place.storage_id}/${file.name}`} />
                                        </div>
                                        {selectedImage == `file_${file.id}` && 
                                            (
                                            <div className="submenu">
                                              <div className="item"><IoIosCloseCircle onClick={()=>{ 
                                                if (window.confirm('Удалить изображение?')) 
                                                    deleteFile({storage_id:place_data.Place.storage_id, file_id:file.id, file_name:file.name }) 
                                                  }}/> </div>
                                              <div className="item"><IoIosEye /></div>
                                              {/* <div className="item"><IoIosHeart /></div> */}
                                            </div>
                                            )
                                        }
                                    </div>)
            }
            {
              !files || files.length==0 &&
                <div>нет файлов</div>
            }
          </div>
        }
    </div>
  )
}

export default PlacePhotos

