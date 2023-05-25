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
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

import '../../App.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import PieCollection from "./utils/RadialChart";
import AddIcon from "@mui/icons-material/Add";
import StatisticsCollection from "./StatisticsCollection";

export const CollectionContext = createContext('')
export default function StatisticsPage(props){
    const { username,users,collectionslist } = useContext(AppContext);
    const [Username, SetUsername] = username
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [CollectionToShow,SetCollectionToShow] = useState(false)
    const [AddCollection,SetAddCollection] = useState(false)
    const [UpdateCollection,SetUpdateCollection] = useState(false)
    const [Details,SetDetails] = useState(false)
    const [UsersList,SetUsersList] = users
    const [HighlightElement,SetHighlightElement] = useState(false)

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
        <div className={'baseindex container-stats'}>

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


                </Col>
                <Col md={1}></Col>

            </Row>
            <Row style={{marginTop:'1%'}}>
                <Col md={2}></Col>
                <Col md={3} >

                </Col>
                <Col md={5} style={{textAlign:'right'}}>
                    <Button size="small" className='collectionButt' style={{marginRight:'2%'}} onClick={(e)=>FilterCollection(e,0)}>All</Button>
                    <Button size="small" className='collectionButt' style={{marginRight:'1%'}} onClick={(e)=>FilterCollection(e,1)}>Created</Button>
                    <Button size="small" className='collectionButt' style={{marginRight:'1%'}} onClick={(e)=>FilterCollection(e,2)}>Shared</Button>
                    {/*<Button size="small" className='collectionButt' style={{marginRight:'1%'}} onClick={(e)=>FilterCollection(e,3)}>Invited</Button>*/}
                    {/*<Button size="small" className='collectionButt' style={{marginRight:'1%'}}>Private</Button>*/}
                    {/*<Button size="small" className='collectionButt' style={{marginRight:'1%'}}>Public</Button>*/}

                </Col>
                <Col md={2}></Col>
            </Row>

            {CollectionToShow ?
                //
                // <Row>
                //     <Col md={Details ? 2 : 12}>
                //         <div style={{display:"flex"}}>
                    <>
                        <div id={'radial-container'} className={'normal'}>

                            {CollectionToShow.map((c,i) => <PieCollection id={i} collection={c} />)}
                        </div>

                    </>



                 :  <div className='loading'><CircularProgress />
            </div>}

        </div>
    );
}


