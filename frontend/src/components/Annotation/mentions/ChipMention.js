import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Draggable from 'react-draggable';

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
import DeleteMentionModal from "./modals/DeleteMentionModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";

export default function Mention(props){
    const { username,users,inarel,documentdescription,document_id,relationship,currentdiv,firstsel,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [DocumentID,SetDocumentID] = document_id
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions

    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [CurrentDiv,SetCurrentDiv] = currentdiv

    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [Role,SetRole] = useState(false)


    const [DocumentDesc,SetDocumentDesc] = documentdescription
    const [SourceLabel,SetSourceLabel] = useState('S')
    const [PredicateLabel,SetPredicateLabel] = useState('P')
    const [TargetLabel,SetTargetLabel] = useState('T')

    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [ShowDeleteMetnionModal,SetShowDeleteMetnionModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    const [Relationship,SetRelationship] = relationship

    const mention_cur = props.mention
    mention_cur['id'] = props.id
    // Relationship.map((men,ind)=>{
    //     if(men['id'] === props.id && Object.keys(men).contains('role')){
    //         mention_cur['role'] = men['role']
    //     }
    // })

    useEffect(()=>{
        let mention = document.getElementById(props.id)
        let found = false

        console.log('relationship list',Relationship)
        console.log('relationship list',mention_cur)
        Relationship.map((ment,id)=>{
            if(ment['id'] === mention_cur['id']){
                found = true
            }
        })
        if (!found){
            console.log('relationship list not found')
            mention.classList = ['men']
            SetSourceLabel('S')
            SetPredicateLabel('P')
            SetTargetLabel('T')
            SetRole(false)
        }
    },[Relationship])


    useEffect(()=>{
        if(!InARel){
            SetSourceLabel('S')
            SetPredicateLabel('P')
            SetTargetLabel('T')

        }
    },[InARel])





    // function AddRelationshipElement(e){
    //     e.preventDefault();
    //     e.stopPropagation()
    //     console.log('add rel')
    // }

    function AddRelationship(e,id){
        e.preventDefault()
        e.stopPropagation()
        setContextMenu(null);


        let mention = document.getElementById(id)
        let ment = props.mention

        if(Relationship.length === 0){
            SetRole('Source')
            mention.classList = ['source']
            SetSourceLabel('Source')
        }

        ment['id'] = id
        ment['role'] = 'Source'
        SetRelationship([...Relationship,ment])



    }


    useEffect(()=>{
        console.log('inarel',InARel)
        let mention = document.getElementById(props.id)
        if(!InARel){

            mention.className = 'men'
            // mention.style.cursor = 'default'



            let body = document.body
            body.style.color = 'rgba(33,37,41,1.0)'
            SetRole(false)
            SetRelationship([])
        }
        else{
            let body = document.body
            body.style.color = 'rgba(33,37,41,0.3)'
            // mention.style.cursor = 'pointer'

        }

    },[InARel])


    // useEffect(()=>{
    //     console.log('source',SourceLabel)
    //     console.log('predicate',PredicateLabel)
    //     console.log('target',TargetLabel)
    // },[SourceLabel,TargetLabel,PredicateLabel])


    function setRole(e,role){
        e.preventDefault()
        e.stopPropagation()

        var mention = document.getElementById(props.id)
        mention.classList = [role.toLowerCase()]
        var new_mentions_list = []
        console.log('ruolo',role,SourceLabel)

        if(role === 'Source'){
            SetTargetLabel('T')
            SetPredicateLabel('P')
            SourceLabel === 'S' ? SetSourceLabel('Source') : SetSourceLabel('S')

        }
        else if(role === 'Predicate'){
            SetTargetLabel('T')
            SetSourceLabel('S')
            PredicateLabel === 'P' ? SetPredicateLabel('Predicate') : SetPredicateLabel('P')

        }
        else if(role === 'Target'){
            SetPredicateLabel('P')
            SetSourceLabel('S')
            TargetLabel === 'T' ? SetTargetLabel('Target') : SetTargetLabel('T')

        }
        if(Role === role){


            SetRole(false)
            mention.classList = ['men']
            Relationship.map((ment,ind)=>{
                if(ment['id'] !== mention_cur['id']){
                    new_mentions_list.push(ment)
                }


            })

        }
        else{
            SetRole(role)
            let found = false
            console.log('new cur',mention_cur)
            mention_cur['role'] = role
            new_mentions_list.push(mention_cur)
            console.log('new_m',new_mentions_list)

            Relationship.map((ment,ind)=>{
                if(ment['id'] === mention_cur['id']){
                    console.log('new',ment)
                    ment['role'] = role
                    new_mentions_list.push(ment)
                }else if(ment['id'] !== mention_cur['id'] && ment['role'] !== role){
                    console.log('new',ment)

                    new_mentions_list.push(ment)
                }

            })

        }
        console.log('new_m',new_mentions_list)

        SetRelationship(new_mentions_list)

    }

    useEffect(()=>{
        SetStart(false)
        SetEnd(false)
        SetFirstSelected(false)
        SetSecondSelected(false)
        SetCurrentDiv(false)


    },[contextMenu])

    // useEffect(()=>{
    //     console.log('role',Role)
    //
    // },[Role])

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };



    useEffect(()=>{

        if(MentionToHighlight.start === props.start && MentionToHighlight.stop === props.stop){


            inputEl.current.style.fontWeight = 'bold';
        }
        else {
            inputEl.current.style.fontWeight = 'normal';
        }

    },[MentionToHighlight])

    const handleClose = () => {
        setContextMenu(null);
    };
    const StyledMenu = styled((props) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            fontSize: 10,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',

            },
            '& .MuiMenuItem-root': {
                fontSize:'0.8rem !important',
                padding: '2px 16px',
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    // color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));


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
        },
    });




    return (
        <div>
            <DeleteMentionModal show={ShowDeleteMetnionModal} setshow={SetShowDeleteMetnionModal} mention={props.mention} position={props.loc} />


            {/*<div>*/}
            {<div onContextMenu={handleContextMenu} >
                {(InARel) &&<div style={{textAlign:'center'}}>
                    <ThemeProvider theme={roletheme}>
                        <Chip sx={{height:'15px',fontSize:'0.6rem',cursor:'pointer'}} label={SourceLabel} color='Source'  onClick={(e)=>setRole(e,'Source')} />{' '}
                        <Chip sx={{height:'15px',fontSize:'0.6rem',cursor:'pointer'}} label={PredicateLabel} color='Predicate' onClick={(e)=>setRole(e,'Predicate')}   />{' '}
                        <Chip sx={{height:'15px',fontSize:'0.6rem',cursor:'pointer'}} label={TargetLabel} color='Target' onClick={(e)=>setRole(e,'Target')}   />
                    </ThemeProvider>
                </div>}

                <div id={props.id} ref={inputEl} className = {props.class  + ' ' +'men'}  >
                    {props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}
                    {props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}
                    {props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}
                    {!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}

                </div>


                <StyledMenu
                    open={contextMenu !== null && !InARel}
                    onClose={handleClose}
                    // elevation={0}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >

                    <div />
                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        <ListItemIcon>
                            <InfoIcon fontSize="small" />
                        </ListItemIcon>
                        Info
                    </MenuItem>
                    <MenuItem onClick={(e)=>{

                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
                    }}>
                        <ListItemIcon>
                            <AssistantIcon fontSize="small" />
                        </ListItemIcon>
                        Suggestion</MenuItem>

                    <Divider />
                    {/*<MenuItem onClick={(e)=>{*/}
                    {/*    setContextMenu(null);*/}
                    {/*    DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);*/}
                    {/*    ModifyMention(e,props.id)*/}
                    {/*}}>*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <EditIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    Edit</MenuItem>*/}

                    <MenuItem onClick={()=> {
                        SetShowAddConceptModal(prev => !prev);
                        setContextMenu(null);
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        <ListItemIcon>
                            <AddIcon fontSize="small" />
                        </ListItemIcon>
                        Add Concept</MenuItem>

                    <MenuItem onClick={(e)=>{
                        SetInARel(true)
                        AddRelationship(e,props.id)
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
                    }}>
                        <ListItemIcon>
                            <HubIcon fontSize="small" />
                        </ListItemIcon>
                        Add Relationship</MenuItem>
                    <Divider />

                    <MenuItem style={{color:'#d00000'}} onClick={(e)=>{
                        // DeleteMention(e,props.mention,props.loc);
                        SetShowDeleteMetnionModal(true)
                        setContextMenu(null);
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);



                    }
                    }>
                        <ListItemIcon >
                            <DeleteIcon color='error' fontSize="small" />
                        </ListItemIcon>
                        Delete</MenuItem>
                </StyledMenu>


                {/*<StyledMenu*/}
                {/*    open={contextMenu !== null && InARel}*/}
                {/*    onClose={handleClose}*/}
                {/*    // elevation={0}*/}
                {/*    anchorReference="anchorPosition"*/}
                {/*    anchorPosition={*/}
                {/*        contextMenu !== null*/}
                {/*            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }*/}
                {/*            : undefined*/}
                {/*    }*/}
                {/*>*/}

                {/*    <div />*/}
                {/*    <MenuItem autoFocus ={false} onClick={(e)=>{*/}
                {/*        setContextMenu(null);*/}
                {/*        setRole(e,'Source');*/}
                {/*        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)*/}
                {/*    }}>*/}
                {/*        {Role === 'Source' ? <b>Source</b> : <>Source</>}*/}

                {/*        /!*Source*!/*/}
                {/*        /!*{Role === 'Source' && <ListItemIcon>*!/*/}
                {/*        /!*    <CheckIcon fontSize="small" />*!/*/}
                {/*        /!*</ListItemIcon>}*!/*/}
                {/*    </MenuItem>*/}
                {/*    <MenuItem autoFocus ={false} onClick={(e)=>{*/}
                {/*        setContextMenu(null);*/}
                {/*        setRole(e,'Predicate');*/}

                {/*        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);*/}

                {/*    }}>*/}

                {/*        {Role === 'Predicate' ? <b>Predicate</b> : <>Predicate</>}*/}
                {/*    /!*    {Role === 'Predicate' && <ListItemIcon>*!/*/}
                {/*    /!*    <CheckIcon fontSize="small" />*!/*/}
                {/*    /!*</ListItemIcon>}*!/*/}
                {/*    </MenuItem>*/}
                {/*    <MenuItem autoFocus ={false} onClick={(e)=>{*/}
                {/*        setContextMenu(null);*/}
                {/*        setRole(e,'Target');*/}

                {/*        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)*/}
                {/*    }}>*/}
                {/*        {Role === 'Target' ? <b>Target</b> : <>Target</>}*/}

                {/*    /!*Target*!/*/}
                {/*    /!*    { Role === 'Target' && <ListItemIcon>*!/*/}
                {/*    /!*        <CheckIcon fontSize="small" />*!/*/}
                {/*    /!*    </ListItemIcon>}*!/*/}
                {/*</MenuItem>*/}

                {/*</StyledMenu>*/}







            </div>}

        </div>
    )
}