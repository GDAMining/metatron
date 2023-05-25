import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import SaveIcon from '@mui/icons-material/Save';
import HubIcon from '@mui/icons-material/Hub';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import EditIcon from '@mui/icons-material/Edit';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';

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
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import '../annotation.css'
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import DraggableModal from "../concepts/DraggableConceptModal";
import {DeleteRange} from "../../HelperFunctions/HelperFunctions";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import {ArrowContext} from "../../Document/DocumentFinal_2";
import RelationshipModal from "../concepts/RelationshipConceptModal";
import {ConceptContext} from "../../../BaseIndex";
import DescriptionDialog from "../concepts/DescriptionDialog";
export default function OverlayConceptComponent(props){
    const { username,inarel,predicate,source,target,sourcetext,sourceconcepts,targettext,targetconcepts,predicatetext,predicateconcepts,firstsel,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    // const { showconceptmodalrel } = useContext(ArrowContext);


    const [Content,SetContent] = useState(false)
    const [ShowModal,SetShowModal] = useState(false)
    const [Source,SetSource] = source;
    const [SourceConcepts,SetSourceConcepts] = sourceconcepts
    const [PredicateConcepts,SetPredicateConcepts] = predicateconcepts
    const [TargetConcepts,SetTargetConcepts] = targetconcepts
    const [SourceText,SetSourceText] = sourcetext
    const [PredicateText,SetPredicateText] = predicatetext
    const [TargetText,SetTargetText] =targettext
    const [InARel,SetInARel] = inarel;
    const [Predicate,SetPredicate] = predicate;
    const [ShowDescription,SetShowDescription] = useState(false)


    return (
        <>{InARel &&
    <div>


        {props.type === 'source' && SourceConcepts[0] && SourceConcepts[0] !== undefined && SourceConcepts[0]['concept_name'] && SourceConcepts[0]['concept_name'] !== undefined && <>
            {ShowDescription && <DescriptionDialog show={ShowDescription} setshow={SetShowDescription}
                                                   area={SourceConcepts[0]['concept_area']}
                                                   name={SourceConcepts[0]['concept_name']}
                                                   url={SourceConcepts[0]['concept_url']}
                                                   description={SourceConcepts[0]['concept_description']}/>}
            <Button
                 color='error' variant={"contained"} size={'small'} endIcon={<InfoIcon onClick={() => {
                SetShowDescription(prev => !prev)
            }}/>}>
                {SourceConcepts[0]['concept_name']}</Button>
        </>}

        {props.type === 'predicate'  && PredicateConcepts[0] && PredicateConcepts[0] !== undefined && PredicateConcepts[0]['concept_name'] && PredicateConcepts[0]['concept_name'] !== undefined && <>
            {ShowDescription && <DescriptionDialog show={ShowDescription} setshow={SetShowDescription}
                                                   area={PredicateConcepts[0]['concept_area']}
                                                   name={PredicateConcepts[0]['concept_name']}
                                                   url={PredicateConcepts[0]['concept_url']}
                                                   description={PredicateConcepts[0]['concept_description']}/>}
            <Button
                 color='success' variant={"contained"} size={'small'} endIcon={<InfoIcon onClick={() => {
                SetShowDescription(prev => !prev)
            }}/>}>
                {PredicateConcepts[0]['concept_name']} </Button>
        </>}

        {props.type === 'target' && TargetConcepts[0] && TargetConcepts[0] !== undefined && TargetConcepts[0]['concept_name'] && TargetConcepts[0]['concept_name'] !== undefined && <>
            {ShowDescription && <DescriptionDialog show={TargetConcepts} setshow={SetShowDescription}
                                                   area={TargetConcepts[0]['concept_area']}
                                                   name={TargetConcepts[0]['concept_name']}
                                                   url={TargetConcepts[0]['concept_url']}
                                                   description={TargetConcepts[0]['concept_description']}/>}
            <Button
                 color='warning' variant={"contained"} size={'small'}
                 endIcon={<InfoIcon onClick={() => {
                SetShowDescription(prev => !prev)
            }} />}>{TargetConcepts[0]['concept_name']}</Button>
        </>}



    </div>
}</>
    )
}