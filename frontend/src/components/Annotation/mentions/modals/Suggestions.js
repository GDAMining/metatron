import {Col, Row} from "react-bootstrap";

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
import DocumentToolBar from "../../../Document/ToolBar/DocumentToolBar";
import ToolBar from "../../../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import '../../annotation.css'
import './modals.css'
// import './documents.css'
import {CircularProgress, Tooltip} from "@mui/material";
import {AppContext} from "../../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {DeleteRange} from "../../../HelperFunctions/HelperFunctions";
import Radio from "@mui/material/Radio";
import Chip from "@mui/material/Chip";



export default function Suggestions(props) {

    const {
        username,
        users,
        collectionslist,
        document_id,
        concepts,
        collection,
        mentions,relationshipslist,
        mentiontohighlight,
        startrange,
        endrange
    } = useContext(AppContext);
    const [Associations, SetAssociations] = useState(false)
    const [Relations, SetRelations] = useState(false)
    const [RelationsAcc,SetRelationsAcc] = useState(false)
    const [AssociationsAcc,SetAssociationsAcc] = useState(false)
    const [MentionsList,SetMentionsList] = mentions
    const [RelationshipsList,SetRelationshipsList] = relationshipslist
    const [ConceptsList,SetConceptsList] = concepts


    useEffect(()=>{
        let mention = props.mention
        mention['id'] = props.id
        axios.get('get_suggestion',{params:{mention:mention}})
            .then(response=>{
                SetAssociations(response['data']['associations'])
                SetRelations(response['data']['relations'])
                SetRelationsAcc(new Array(response['data']['relations'].length).fill(false))
                SetAssociationsAcc(new Array(response['data']['associations'].length).fill(false))
            })
    },[])

    function acceptRelationSuggestion(e,rel){
        e.preventDefault()
        e.stopPropagation()
        axios.post('get_suggestion',{relation:rel})
            .then(r=>{
                console.log(r)
                SetRelationshipsList(r['data']['relationships'])
                SetConceptsList(r['data']['concepts'])
            })
            .catch(e=>console.log(e))
    }
    function acceptAssociationSuggestion(e,rel){
        e.preventDefault()
        e.stopPropagation()
        axios.post('get_suggestion',{association:rel})
            .then(r=> {
                console.log(r)
                SetRelationshipsList(r['data']['relationships'])
                SetConceptsList(r['data']['concepts'])


            })
            .catch(e=>console.log(e))
    }

    const roletheme = createTheme({
        palette: {
            Source: {
                main: 'rgb(214, 28, 78)',
                contrastText: '#fff',
            },
            Predicate: {
                main: 'rgb(55, 125, 113)',
                contrastText: '#fff',
            },
            Target: {
                main: 'rgb(241, 136, 103)',
                contrastText: '#fff',
            },
            neutro: {
                main: props.color,
                contrastText: '#fff',
            },
            Concept: {
                main: '#2156a5ed',
                contrastText: '#fff',
            },

            Mention: {
                main: '#d78117ed',
                contrastText: '#fff',
            },
        },
    });

    return (
        <div>

            {Associations && Associations.length === 0 && Relations && Relations.length === 0 && <div> No suggestions available.</div>}
            {Associations && Associations.length > 0 && <h5>Suggested Concepts</h5>}
            {Associations && Associations.length > 0 &&  Associations.map((ass,i)=>
                <div>

                    <div style={{marginTop:'10px'}}>
                        <h6>
                            <b><i>{ass.concept_area}</i></b>:{ass.concept_name}
                        </h6>{' '}
                        <a href={ass.concept_url}>{ass.concept_url}</a>
                        <div>
                            Annotators: {ass.count}
                        </div>
                    </div>
                    <div>
                        <Button variant={'contained'} size={'small'} color={'primary'} disabled={AssociationsAcc[i]} onClick={(e)=> {
                            acceptAssociationSuggestion(e, ass);
                            let rels = AssociationsAcc.map(x=>x)
                            rels[i] = true
                            SetAssociationsAcc(rels)
                        }}>{AssociationsAcc[i] ? 'Added' : 'Accept'}</Button>
                    </div>
                    <hr/>
                </div>

            )}
            {Relations && Relations.length > 0 && <h5>Suggested Relationships</h5>}
            <ThemeProvider theme={roletheme}>

            {Relations && Relations.length > 0 && Relations.map((ass,i)=>
                <div className={'parentdiv'}  style={{marginTop:'20px'}}>
                    <div>


                        <div style={{marginTop:'10px'}}>
                        <span><Chip size='small'  variant={'filled'} color={'Source'} label={'Subject'}
                                    />{'  '}</span>
                        {Object.keys(ass['subject']['mention']).length > 0 ? <span><span><Chip size='small' variant={'filled'} color={'Mention'} label={'Mention'}
                            /></span>{'  '}<span>{ass['subject']['mention']['mention_text']}</span></span> :
                            <span><span><Chip size='small' variant={'filled'} color={'Concept'} label={'Concpet'}
                                        /></span>{'  '}<span>{ass['subject']['concept']['concept_name']}</span></span>

                        }
                    </div>
                        <div style={{marginTop:'10px'}}>
                        <span><Chip size='small'  variant={'filled'} color={'Predicate'} label={'Predicate'}
                        />{'  '}</span>
                        {Object.keys(ass['predicate']['mention']).length > 0 ? <span><span><Chip size='small' variant={'filled'} color={'Mention'} label={'Mention'}
                            /></span>{'  '}<span>{ass['predicate']['mention']['mention_text']}</span></span> :
                            <span><span><Chip size='small' variant={'filled'} color={'Concept'} label={'Concpet'}
                            /></span>{'  '}<span>{ass['predicate']['concept']['concept_name']}</span></span>

                        }
                    </div>
                    <div style={{marginTop:'10px'}}>
                        <span><Chip size='small'  variant={'filled'} color={'Target'} label={'Object'}
                        />{'  '}</span>
                        {Object.keys(ass['object']['mention']).length > 0 ? <span><span><Chip size='small' variant={'filled'} color={'Mention'} label={'Mention'}
                            /></span>{'  '}<span>{ass['object']['mention']['mention_text']}</span></span> :
                            <span><span><Chip size='small' variant={'filled'} color={'Concept'} label={'Concpet'}
                            /></span>{'  '}<span>{ass['object']['concept']['concept_name']}</span></span>

                        }
                    </div>
                    <div style={{marginTop:'10px'}}>Annotators: {ass.count}</div>
                    </div>
                    <div style={{marginTop:'20px'}}>
                        <Tooltip title={"Add as your annotation"}>
                            <Button variant={'contained'} size={'small'} color={'primary'} disabled={RelationsAcc[i]} onClick={(e)=> {
                                acceptRelationSuggestion(e, ass);
                                let rels = RelationsAcc.map(x=>x)
                                rels[i] = true
                                SetRelationsAcc(rels)
                            }}>{RelationsAcc[i] ? 'Added' : 'Accept'}</Button>
                        </Tooltip>

                    </div>
                    <hr/>
                </div>

            )}</ThemeProvider>
        </div>
    );
}