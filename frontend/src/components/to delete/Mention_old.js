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
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import '../Annotation/annotation.css'
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import DraggableModal from "../to delete/ConceptModal";
import {DeleteRange} from "../HelperFunctions/HelperFunctions";
import DeleteModal from "./DeleteModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";

export default function Mention(props){
    const { username,users,inarel,documentdescription,document_id,currentdiv,firstsel,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
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

    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [ShowDeleteMetnionModal,SetShowDeleteMetnionModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    const Relationship = props.relationship
    const SetRelationship = props.setrelationship
    const mention_cur = props.mention
    // mention_cur['id'] = props.id
    // Relationship.map((men,ind)=>{
    //     if(men['id'] === props.id && Object.keys(men).contains('role')){
    //         mention_cur['role'] = men['role']
    //     }
    // })

    useEffect(()=>{
        Relationship.map((ment,ind)=>{
            if(ment.id === props.id && ment.role !== null){
                SetRole(ment.role)
            }
        })
    },[Relationship])





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

        ment['id'] = id
        ment['role'] = null
        console.log('mention json',ment)
        if(mention.className === 'rel'){
            mention.className = 'men'
            let rel = Relationship.filter(rel=>rel['id'] !== id)
            SetRelationship(rel)
        }
        else{
            mention.className = 'rel'
            SetRelationship([...Relationship,ment])

        }

    }


    useEffect(()=>{
        console.log('inarel',InARel)
        let mention = document.getElementById(props.id)
        if(!InARel){

            mention.className = 'men'
            mention.style.cursor = 'default'



            let body = document.body
            body.style.color = 'rgba(33,37,41,1.0)'
            SetRole(false)
            SetRelationship([])
        }
        else{
            let body = document.body
            body.style.color = 'rgba(33,37,41,0.3)'
            mention.style.cursor = 'pointer'

        }

    },[InARel])

    function setRole(e,role){
        e.preventDefault()
        e.stopPropagation()
        var mention = document.getElementById(props.id)
        mention.classList = [role.toLowerCase()]
        var new_mentions_list = []

        Relationship.map((ment,ind)=>{
            if(ment === mention_cur){
                ment['role'] = role
            }
            new_mentions_list.push(ment)

        })
        SetRelationship(new_mentions_list)


    }

    useEffect(()=>{
        SetStart(false)
        SetEnd(false)
        SetFirstSelected(false)
        SetSecondSelected(false)
        SetCurrentDiv(false)


    },[contextMenu])


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

    // function DeleteMention(e,mention,position){
    //     e.preventDefault()
    //     console.log('chiamo delete',mention)
    //     axios.post('delete_single_mention',{start:mention.start,stop:mention.stop,mention_text:mention.text,position:position})
    //         .then(response=>{
    //             SetMentionsList(response.data['mentions'])
    //             console.log('setto',response)
    //             SetDocumentDesc(response.data['document'])
    //         })
    // }

    useEffect(()=>{
        // console.log('mention high',MentionToHighlight)
        // inputEl.current.style.fontWeight = 'normal'
        // console.log('mention high',props.mention_text,props.start,props.stop)
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
            <DeleteModal show={ShowDeleteMetnionModal} setshow={SetShowDeleteMetnionModal} mention={props.mention} position={props.loc} />


            {/*<div>*/}
            {<div onContextMenu={handleContextMenu} >
                {(Role && InARel) &&<div>
                    <ThemeProvider theme={roletheme}>
                        <Chip sx={{height:'15px',fontSize:'0.6rem'}} label={Role} color={Role}   />
                    </ThemeProvider>
                </div>}

                <div id={props.id} ref={inputEl} className = {props.class  + ' ' +'men'} onClick={(e)=>{if(InARel){AddRelationship(e,props.id)}}} >
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

                        Info<ListItemIcon>
                        <InfoIcon fontSize="small" />
                    </ListItemIcon>
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


                <StyledMenu
                    open={contextMenu !== null && InARel}
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
                        setRole(e,'Source');
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        {Role === 'Source' ? <b>Source</b> : <>Source</>}

                        {/*Source*/}
                        {/*{Role === 'Source' && <ListItemIcon>*/}
                        {/*    <CheckIcon fontSize="small" />*/}
                        {/*</ListItemIcon>}*/}
                    </MenuItem>
                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        setRole(e,'Predicate');

                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);

                    }}>

                        {Role === 'Predicate' ? <b>Predicate</b> : <>Predicate</>}
                        {/*    {Role === 'Predicate' && <ListItemIcon>*/}
                        {/*    <CheckIcon fontSize="small" />*/}
                        {/*</ListItemIcon>}*/}
                    </MenuItem>
                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        setRole(e,'Target');

                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        {Role === 'Target' ? <b>Target</b> : <>Target</>}

                        {/*Target*/}
                        {/*    { Role === 'Target' && <ListItemIcon>*/}
                        {/*        <CheckIcon fontSize="small" />*/}
                        {/*    </ListItemIcon>}*/}
                    </MenuItem>

                </StyledMenu>







            </div>}

        </div>
    )
}