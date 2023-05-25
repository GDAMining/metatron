import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import DocumentTable from "./DocumentTable";
import InfoModal from "./Table Modals/InfoModal";
import ContentModal from "./Table Modals/DocumentContentModal";
import DeleteDocumentModal from "./Table Modals/DeleteDocumentModal";
import DownloadModal from "./Table Modals/DownloadModal";
import {ConceptContext} from "../../BaseIndex";
import DraggableModal from "../Annotation/concepts/DraggableConceptModal";
axios.defaults.baseURL = window.baseurl;
export const TableContext = createContext('')

export default function DocumentsPage(props){
    const { username,users,collectionslist } = useContext(AppContext);

    const [Cols,SetCols] = useState([])
    const [data,setdata] = useState([])
    const [HiddenCols,SetHiddenCols] = useState([])
    const [rows, setRows] = useState([])
    const [defaultColumnWidths,setdefaultColumnWidths] = useState([]);
    const [Username, SetUsername] = username
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [LoadingTable,SetLoadingTable] = useState(false)
    const { collection_id } = useParams();

    const [OpenInfoModal,SetOpenInfoModal] = useState(false)
    const [CurID,SetCurID] = useState(false)
    const [CurAnnotation,SetCurAnnotation] = useState(false)
    const [Content,SetContent] = useState(false)
    const [OpenContentModal,SetOpenContentModal] = useState(false)
    const [IdToDel,SetIdToDel] = useState(false)
    const [OpenDownloadModal,SetOpenDownloadModal] = useState(false)
    const [IdToDownload,SetIdToDownload] = useState(false)
    const [OpenDeleteModal,SetOpenDeleteModal] = useState(false)
    const [ConfirmDelete,SetConfirmDelete] = useState(false)

    const [CollectionName, SetCollectionName] = useState(false)

    useEffect(()=>{
        console.log('c',CollectionsList)
        if(CollectionsList){
            CollectionsList.map((collection,index)=>{
                if(collection.id === collection_id){
                    SetCollectionName(collection.name)
                }
            })
        }
    },[CollectionsList])


    useEffect(()=>{
        // axios.get('get_collection_documents',{params:{coll:collection_id}}).then(response=>{
        //
        //     console.log('coll doc',response.data)
        // })


        var opt_ord = []
        var wd_col = []
        opt_ord.push(<option value='ID'>ID</option>)
        opt_ord.push(<option value='ASC'>Number of annotations (ASC)</option>)
        opt_ord.push(<option value='DESC'>Number of annotations (DESC)</option>)
        // SetOptions_order(opt_ord)
        // var username = window.username
        // // console.log('username', username)
        // SetUsername(username)
        var arr_data = []
        var col = []

        // col.push({name:'delete',width:100})
        // col.push({name:'download'})

        col.push({name:'document_id',title:'ID'})
        wd_col.push({columnName:'document_id',width:200})
        // col.push({name:'language',title:'Language'})
        // wd_col.push({columnName:'language',width:150})
        // col.push({name:'name_space',title:'Source'})
        // wd_col.push({columnName:'name_space',width:150})
        col.push({name:'batch',title:'Batch'})
        wd_col.push({columnName:'batch',width:100})
        // col.push({name:'title',title:'Title'})
        // wd_col.push({columnName:'title',width:200})

        // col.push({name:'name_space',title:'Annotation mode'})
        // wd_col.push({columnName:'name_space',width:200})
        col.push({name:'last_annotation',title:'Last annotation'})
        wd_col.push({columnName:'last_annotation',width:150})
        col.push({name:'annotators_list',title:'Annotators'})
        wd_col.push({columnName:'annotators_list',width:150,align:'right'})

        col.push({name:'document_id_hashed',title:'DocIdHashed'})
        wd_col.push({columnName:'document_id_hashed',width:0,align:'right'})
        // col.push({name:'annotations',title:'Annotations'})
        // wd_col.push({columnName:'annotations',width:150,align:'right'})




        col.push({name:'mentions_count',title:'Mentions'})
        wd_col.push({columnName:'mentions_count',width:150,align:'right'})
        col.push({name:'concepts_count',title:'Concepts'})
        wd_col.push({columnName:'concepts_count',width:150,align:'right'})
        col.push({name:'relationships_count',title:'Relationships'})
        wd_col.push({columnName:'relationships_count',width:150,align:'right'})
        col.push({name:'assertions_count',title:'Assertions'})
        wd_col.push({columnName:'assertions_count',width:150,align:'right'})
        col.push({name:'labels_count',title:'Labels'})
        wd_col.push({columnName:'labels_count',width:150,align:'right'})


        col.push({name:'',title:''})
        wd_col.push({columnName:'',width:300})


        SetCols(col)
        setdefaultColumnWidths(wd_col)
        SetLoadingTable(true)
        axios.get('get_documents_table',{params:{collection:collection_id}}).then(function (response){
            if(response.data['documents'].length > 0){
                response.data['documents'].map((elem,ind)=>{
                        arr_data.push(elem)

                })
                setdata(arr_data)
                setRows(arr_data)
            }


            SetLoadingTable(false)


        })

    },[])




    useEffect(()=>{
        console.log('columns',Cols)
        console.log('rows',rows)
    },[Cols,rows])

    return(
        <div style={{padding:'2%'}}>
            <TableContext.Provider value={{
                openinfomodal:[OpenInfoModal,SetOpenInfoModal],curid:[CurID,SetCurID],curannotation:[CurAnnotation,SetCurAnnotation],opencontentmodal:[OpenContentModal,SetOpenContentModal],
                content:[Content,SetContent],idtodel:[IdToDel,SetIdToDel],opendeletemodal:[OpenDeleteModal,SetOpenDeleteModal],opendownloadmodal:[OpenDownloadModal,SetOpenDownloadModal],
                confirmdelete:[ConfirmDelete,SetConfirmDelete],idtodownload:[IdToDownload,SetIdToDownload]
            }}>
            {OpenInfoModal && CurID && CurAnnotation && <InfoModal show={OpenInfoModal} setshow={SetOpenInfoModal} content={Content} curid={CurID} annotation={CurAnnotation}  row={rows} />}
            {OpenContentModal && Content && <ContentModal show={OpenContentModal} setshow={SetOpenContentModal} content={Content} />}
            {OpenDeleteModal && IdToDel && <DeleteDocumentModal show={OpenDeleteModal} setshow={SetOpenDeleteModal} doc={IdToDel} setconfirm={SetConfirmDelete}/>}
                {OpenDownloadModal && IdToDownload && <DownloadModal show={OpenDownloadModal} setshow={SetOpenDownloadModal} doc={IdToDownload}/>}
                {/*{OpenDownloadModal && IdToDownload && <DraggableModal />}*/}

            {(Cols.length>0 ) ? <div>
                {/*{(rows.length>0) ? <div>*/}
                <h2>Collection <i>{CollectionName}</i> - Documents</h2>
                <div>
                    <DocumentTable columns={Cols} righe={rows} setrighe={setRows} hiddenColumns={HiddenCols} default_width={defaultColumnWidths}/>
                </div>
            </div> :
                <div className='loading'>
                <CircularProgress />
                </div>}</TableContext.Provider>
        </div>

    );
}



