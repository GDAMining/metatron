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
import DocumentTable from "../Document/DocumentTable";

export default function Documents(props){
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
    const [CollectionName, SetCollectionName] = useState(false)

    useEffect(()=>{
        console.log('c',CollectionsList)
        if(CollectionsList){
            CollectionsList.map((collection,index)=>{
                if(collection.cid === collection_id){
                    SetCollectionName(collection.name)
                }
            })
        }
    },[CollectionsList])


    useEffect(()=>{
        // console.log('coll',collection_id)
        // axios.get('http://127.0.0.1:8000/get_collection_documents',{params:{coll:collection_id}}).then(response=>{
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
        var hid_cols = []

        // col.push({name:'delete',width:100})
        // col.push({name:'download'})

        col.push({name:'document_id',title:'ID'})
        wd_col.push({columnName:'document_id',width:200})
        col.push({name:'language',title:'Language'})
        wd_col.push({columnName:'language',width:150})
        col.push({name:'name_space',title:'Source'})
        wd_col.push({columnName:'name_space',width:150})
        col.push({name:'batch',title:'Batch'})
        wd_col.push({columnName:'batch',width:100})
        col.push({name:'title',title:'Title'})
        wd_col.push({columnName:'title',width:200})

        col.push({name:'name_space',title:'Annotation mode'})
        wd_col.push({columnName:'name_space',width:200})

        col.push({name:'annotators_list',title:'Annotators'})
        wd_col.push({columnName:'annotators_list',width:150,align:'right'})
        col.push({name:'annotations',title:'Annotations'})
        wd_col.push({columnName:'annotations',width:150,align:'right'})


        // col.push({name:'document_level_annotations',title:'document_level_annotations'})
        // wd_col.push({columnName:'document_level_annotations',width:100,align:'right'})
        // col.push({name:'document_level_annotations',title:'document_level_annotations'})
        // wd_col.push({columnName:'document_level_annotations',width:100,align:'right'})

        col.push({name:'Mentions',title:'Mentions'})
        wd_col.push({columnName:'Mentions',width:150,align:'right'})
        col.push({name:'Linked concepts',title:'Linked concepts'})
        wd_col.push({columnName:'Linked concepts',width:150,align:'right'})
        col.push({name:'Relationships',title:'Relationships'})
        wd_col.push({columnName:'Relationships',width:150,align:'right'})
        col.push({name:'Labels',title:'Labels'})
        wd_col.push({columnName:'Labels',width:150,align:'right'})

        col.push({name:'last annotation',title:'Last annotation'})
        wd_col.push({columnName:'last annotation',width:150})

        col.push({name:'',title:''})
        wd_col.push({columnName:'',width:300})


        SetCols(col)
        setdefaultColumnWidths(wd_col)
        SetLoadingTable(true)
        axios.get('http://127.0.0.1:8000/get_documents_table',{params:{collection:collection_id}}).then(function (response){
            if(response.data['documents'].length > 0){
                response.data['documents'].map((elem,ind)=>{
                        arr_data.push(elem)
                            // {
                                // id:ind,annotations: elem['total'],
                                // ...elem['report']

                            // }
                        // )
                    // })

                    // SetCommitted(true)
                })
                setdata(arr_data)
                setRows(arr_data)
            }
            // else{
            //     SetEmpty(true)
            // }

            SetLoadingTable(false)


        })

    },[])




    useEffect(()=>{
        console.log('columns',Cols)
        console.log('rows',rows)
    },[Cols,rows])

    return(
        <div style={{padding:'2%'}}>

            <Breadcrumbs aria-label="breadcrumb">

                <Link
                    underline="hover"
                    color="inherit"

                    href="http://127.0.0.1:8000/collections"
                >
                    Collections list
                </Link>
                <Typography color="text.primary">{CollectionName}</Typography>
            </Breadcrumbs>

            {(Cols.length>0 && defaultColumnWidths.length>0 && rows.length>0 ) ? <div>
                {/*{(rows.length>0) ? <div>*/}

                <div>
                    <DocumentTable columns={Cols} righe={rows} hiddenColumns={HiddenCols} default_width={defaultColumnWidths}/>
                </div>
            </div> :
                <div className='loading'>
                <CircularProgress />
            </div>}
        </div>

    );
}



