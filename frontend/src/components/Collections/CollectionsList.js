import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddCollectionForm from "./AddCollectionForm";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Fade from '@mui/material/Fade';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronLeft, faPalette,
    faChevronRight, faExclamationTriangle,
    faGlasses,
    faInfoCircle,
    faList, faPlusCircle,
    faProjectDiagram, faArrowLeft, faArrowRight, faTrash, faSave, faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Collection from "./Collection";
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import './collection.css'
import '../../App.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";

export const CollectionContext = createContext('')
export default function CollectionsList(props){
    const { username,users,collectionslist } = useContext(AppContext);
    const [Username, SetUsername] = username
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [CollectionToShow,SetCollectionToShow] = useState(false)
    const [AddCollection,SetAddCollection] = useState(false)
    const [UpdateCollection,SetUpdateCollection] = useState(false)
    const [Counter,SetCounter] = useState(0)
    const [UsersList,SetUsersList] = users



    useEffect(()=>{
        // if(UpdateCollection){
            axios.get('pending_invitations').then(response=>SetCounter(response.data['count']))
            if(UpdateCollection){
                axios.get('collections/list').then(response=>{
                    console.log('coll1',response.data)
                    SetCollectionsList(response.data['collections'])
                })
            }

        // })
        // }

    },[UpdateCollection])

    useEffect(()=>{
        if(CollectionsList){
            var colltoshow = []
            CollectionsList.map((o,i)=>{
                colltoshow.push(o)
            })
            SetCollectionToShow(colltoshow)
        }
    },[CollectionsList])


    function FilterCollection(e,code){
        e.preventDefault()
        var coll = []
        if(code === 0){
            SetCollectionToShow(CollectionsList)
        }
        else if(code === 1){
            coll = CollectionsList.filter(c => c.creator === Username)
            SetCollectionToShow(coll)
        }
        else if(code === 2){
            coll = CollectionsList.filter(c => c.creator !== Username)
            SetCollectionToShow(coll)
        }
        else if(code === 3){
            coll = CollectionsList.filter(c => c.status === 'Invited')
            SetCollectionToShow(coll)
        }
    }

    function handleChangeTextFilter(e){
        console.log('targ',e.target.value)
        console.log('targ',CollectionsList)
        var coll = CollectionsList.filter(collection=>collection.name.toLowerCase().includes(e.target.value.toLowerCase()))
        SetCollectionToShow(coll)

    }



    return(
        <div className={'baseindex'}>

            <CollectionContext.Provider value={{
                addcollection:[AddCollection,SetAddCollection],collectionlist:[CollectionsList,SetCollectionsList],updatecollection:[UpdateCollection,SetUpdateCollection]
            }}>

            {/*{!CollectionToShow ?
            <div className='loading'>*/}

            {/*        <CircularProgress />*/}
            {/*    </div> :*/}
                <div>
            <Row>
                <Col md={1}></Col>

                <Col md={10} style={{textAlign:'-webkit-right'}}>

                            <TextField
                                id="size-small-standard"
                                size="small"
                                sx={{ width: '30%' }}
                                onChange={(e)=>handleChangeTextFilter(e)}
                                variant="standard"
                                label="Search"
                                placeholder="Search"
                            />
                        {/*)}*/}
                    {/*/>*/}

                </Col>
                <Col md={1}></Col>

            </Row>
            <Row style={{marginTop:'1%'}}>
                <Col md={2}></Col>
                <Col md={3} >
                    <div>
                        <Button onClick={()=>SetAddCollection(prev=>!prev)} variant="contained" startIcon={<AddIcon />}>
                            Add a collection
                        </Button>
                    </div>
                </Col>
                <Col md={5} style={{textAlign:'right'}}>
                    <Button size="small" className='collectionButt' style={{marginRight:'2%'}} onClick={(e)=>FilterCollection(e,0)}>All</Button>
                    <Button size="small" className='collectionButt' style={{marginRight:'1%'}} onClick={(e)=>FilterCollection(e,1)}>Created</Button>
                    <Button size="small" className='collectionButt' style={{marginRight:'1%'}} onClick={(e)=>FilterCollection(e,2)}>Shared</Button>
                    <Button size="small" className='collectionButt' style={{marginRight:'1%'}} onClick={(e)=>FilterCollection(e,3)}>Invited</Button>
                    {/*<Button size="small" className='collectionButt' style={{marginRight:'1%'}}>Private</Button>*/}
                    {/*<Button size="small" className='collectionButt' style={{marginRight:'1%'}}>Public</Button>*/}

                </Col>
                <Col md={2}></Col>
            </Row>
            <Collapse in={AddCollection}>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                    <Paper elevation={3} style={{marginTop:'2%'}}>
                        <AddCollectionForm/>


                    </Paper></Col>
                    <Col md={2}></Col>
                </Row>

            </Collapse>

            <Row>
                <Col md={2}></Col>
                <Col md={8}>

                    <>
                    {CollectionToShow.length>0 && <div>{CollectionToShow.map((c,i)=>
                        <div style={{marginTop:'2%'}}>
                            <Collection collection ={c} />
                        </div>
                    )}

                    </div>}
                    </>
                    <>

                        {CollectionToShow.length === 0 && <div style={{display:'flex',justifyContent:'center',marginTop:'5vh'}}>
                            {!AddCollection && <h2>No collection found.</h2>}
                        </div>}
                    </>

                    <>

                        {CollectionToShow === false &&
                        <div className='loading'>
                                    <CircularProgress />
                        </div>}
                    </>




                </Col>
                <Col md={2}></Col>

            </Row></div>


            </CollectionContext.Provider>
        </div>
    );
}



