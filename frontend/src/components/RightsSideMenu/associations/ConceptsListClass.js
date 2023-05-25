import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Collapse from '@mui/material/Collapse';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../rightsidestyles.css'
import LabelsSelect from '../labels/LabelsSelect'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import UploadIcon from '@mui/icons-material/Upload';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ArticleIcon from '@mui/icons-material/Article';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
import DocumentToolBar from "../../Document/ToolBar/DocumentToolBar";
import ToolBar from "../../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {AppContext} from "../../../App";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";
import RightSideMention from "../mentions/RightSideMention";
import RightSideConcept from "./RightSideConcept";
import {waitForElm,clearMentionsFromBorder} from "../../HelperFunctions/HelperFunctions";

export default function ConceptsListClass(props){
    const { collection,inarel,showconceptspannel,concepts,mentions,mentiontohighlight,areascolors } = useContext(AppContext);

    const [Concepts,SetConcepts] = useState(false)
    const [ConceptsList,SetConceptsList] = concepts
    const [ShowArea,SetShowArea] = useState(null)
    const [AreasColors,SetAreasColors] = areascolors
    const [ShowConcepts,SetShowConcepts] = showconceptspannel
    const [FullConceptsList,SetFullConceptsList] = useState([])
    const [MentionsList, SetMentionsList] = mentions



    useEffect(()=>{
        if(AreasColors && ShowConcepts){
            let areas = {}
            Object.keys(AreasColors).map(k=>areas[k] = false)
            SetShowArea(areas)
            console.log('areas',ShowArea)
            console.log('areas',AreasColors)
            Object.keys(AreasColors).map(a=>{
                waitForElm('#'+a+'_id').then((element) => {
                    element.style.color = AreasColors[a]
                })
            })
        }

    },[AreasColors,ShowConcepts])

    // useEffect(()=>{
    //     if(ShowArea){
    //         Object.keys(ShowArea).map(k => {
    //             if (ShowArea[k] === false) {
    //                 let elements = Array.from(document.getElementById('list_' + k.toString() + '_id').children)
    //                 elements.map(e => e.style.fontWeight = 'normal')
    //             }
    //         })
    //     }
    //
    // },[ShowArea])



    useEffect(()=>{
        console.log('update concepts',ConceptsList)
        if(ConceptsList){
            let conceptslist = {}
            conceptslist['total_list'] = []
            ConceptsList.map(m=>{
                let c = m.concept
                if(Array.from(Object.keys(conceptslist)).indexOf(c.area) === -1){
                    conceptslist[c.area] = []
                }
                console.log(concepts,conceptslist[c.area])
                if(conceptslist[c.area].map(x=>x.concept_url).indexOf(c.concept_url) === -1){
                    conceptslist[c.area].push(c)
                    conceptslist['total_list'].push(c.concept_url)

                }


            })

            console.log('concepts',conceptslist,Object.keys(conceptslist))
            SetConcepts(conceptslist)

        }


    },[ConceptsList])



    function showAreaList(e,area){
        e.preventDefault()
        e.stopPropagation()
        let areas = {}
        Object.keys(ShowArea).map(k=>{
            areas[k] = ShowArea[k]
        })
        if(ShowArea[area]){

            areas[area] = false
        }else{
            areas[area] = true
        }
        SetShowArea(areas)


    }
    // useEffect(()=>{
    //     if(ShowConcepts){
    //         if(MentionsList){
    //             // pulisco le mentions
    //             MentionsList.map(m=>{
    //                 console.log(m)
    //                 clearMentionsFromBorder(m.mentions)
    //
    //             })
    //         }
    //     }
    //
    //
    // },[ShowConcepts])

    useEffect(()=>{

        axios.get('concepts/full')
            .then(response=>{
                SetFullConceptsList(response.data)

            })
            .catch(error=>{
                console.log(error)
            })
    },[])

    return(
        <div>
            <h5>
                Concepts <i>({ConceptsList.length})</i>

            </h5>

            {/*{MentionsList && <div><i><b>{MentionsList.length}</b> mentions</i></div>}*/}
            {ConceptsList && FullConceptsList && <div>
                {(Object.keys(Concepts)).filter(x=>x !== 'total_list').map(a =>
                    <>

                        <h6 id={a+'_id'} className='areas_header' onClick={(e)=>showAreaList(e,a)}>{a} ({ConceptsList.filter(x=>x['concept']['area'] === a).length})</h6>
                        <Collapse in={ShowArea[a]}>
                            <div id={'list_' + a + '_id'}>
                                {Concepts[a].map((c,i) =>
                                    <RightSideConcept id ={a+'concept_'+i.toString()} ConceptsList = {FullConceptsList} c = {c} />

                                )}
                            </div><hr/><br/>
                        </Collapse>


                    </>)}
            </div>}


        </div>
    );
}