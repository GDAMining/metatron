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
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, styled} from "@mui/material/styles";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import {DeleteRange, updateRelMentionColor} from "../../../HelperFunctions/HelperFunctions";
import Radio from "@mui/material/Radio";



export default function ChooseMentionModal(props) {

    const {
        source,curannotator,
        inarel,snackmessage,opensnack,
        mentions
    } = useContext(AppContext);

    const [MentionsList, SetMentionsList] = mentions
    const [Source, SetSource] = source
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    const [MentionsInvolved,SetMentionsInvolved] = useState([])
    const [value,SetValue] = useState(0)
    const [SelectedMention,SetSelectedMention] = useState(false)
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [SnackMessage,SetSnackMessage] = snackmessage;
    const [OpenSnack,SetOpenSnack] = opensnack

    function handleChangeRadio(e){
        e.preventDefault()
        e.stopPropagation()
        let v = e.target.value
        SetValue(parseInt(v))

        // let selected = MentionsInvolved[v]
        //
        // SetSetSelectedMention(selected)
    }
    useEffect(()=>{

        let selected = MentionsInvolved[value]
        SetSelectedMention(selected)

    },[value])


    useEffect(()=>{
        let mentions = []

        props.mention.mentions.split(' ').map(m=>{
            // let mentions_involved = document.getElementsByClassName('.'+m)
            console.log(m,MentionsList)
            mentions.push(MentionsList.filter(x=>x['mentions'] === m)[0])
        })
        SetMentionsInvolved(mentions)
        SetSelectedMention(mentions[0])

        // console.log(mentions)
        // if(mentions.length === 1){
        //     SetSetSelectedMention(mentions[0])
        // }

    },[])


    function handleClose(e){
        e.stopPropagation()
        e.preventDefault()
        props.setshow(false)
    }


    return (
        <Dialog
            open={props.show}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Mention selection
            </DialogTitle>
            <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Select the mention to include in the relationship.
                        <div>
                            {MentionsInvolved.map((m,i)=>
                                <div>

                                <Radio
                                    checked={value === i}
                                    onClick={handleChangeRadio}
                                    value={i}
                                    aria-label={m.mention_text}
                                />{' '}{m.mention_text}</div>
                                    )
                                    }

                        </div>

                    </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e)=>{handleClose(e)}} color={'error'}>No</Button>
                <Button onClick={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    if(props.type === 'relationship'){
                        SetInARel(true)
                        SetSource(SelectedMention.mentions)

                        updateRelMentionColor('source',SelectedMention.mentions)
                    }else if(props.type === 'concept'){
                        let m = SelectedMention
                        m['id'] = props.id
                        SetOpenSnack(true)
                        SetSnackMessage({'message':'Saving...'})
                        axios.post('concepts/copy',{mention:m,user:CurAnnotator}).then(response=> {
                            // console.log('response')
                            SetSnackMessage({'message':'Saved'})
                            handleClose(e)
                        }).catch(error=> {
                            console.log('error', error)
                            SetSnackMessage({'message':'ERROR'})

                        })

                    }else if(props.type === 'mention'){
                        let m = SelectedMention
                        m['id'] = props.id
                        SetSnackMessage({'message':'Saving...'})
                        SetOpenSnack(true)

                        // mi serve l'utente perché devo cercare i concetti che ha inserito, è più facile farlo lato backend
                        axios.post('mentions/copy', {mention: m,user:CurAnnotator}).then(response => {
                            // console.log('response');
                            SetSnackMessage({'message':'Saved'})
                            handleClose(e)
                        }).catch(error => {
                            console.log('error', error)
                            SetSnackMessage({'message':'ERROR'})

                        })

                    }


                }}>Yes</Button>

            </DialogActions>
        </Dialog>
    );
}