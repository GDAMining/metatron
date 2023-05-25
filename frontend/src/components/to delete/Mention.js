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
import '../Annotation/annotation.css'

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
import {DeleteRange,waitForElm} from "../HelperFunctions/HelperFunctions";
import DeleteModal from "./DeleteModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import {type} from "@testing-library/user-event/dist/type";
import Concept from "./Concept";

export default function Mention(props){
    const { username,concepts,inarel,documentdescription,curconcept,document_id,relationship,currentdiv,firstsel,curmention,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [DocumentID,SetDocumentID] = document_id
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions

    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [CurMention,SetCurMention] = curmention
    const [CurConcept,SetCurConcept] = curconcept
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [Role,SetRole] = useState(false)


    const [DocumentDesc,SetDocumentDesc] = documentdescription
    const [SourceLabel,SetSourceLabel] = useState(false)
    const [PredicateLabel,SetPredicateLabel] = useState(false)
    const [TargetLabel,SetTargetLabel] = useState(false)
    let key = props.loc
    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [ShowDeleteMetnionModal,SetShowDeleteMetnionModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    const [Relationship,SetRelationship] = relationship
    const [Concepts,SetConcepts] = useState(null)
    const [ConceptsList,SetConceptsList] = concepts

        // const [Mention,SetMention] = useState(false)
    waitForElm('#'+props.id).then(element=>{
        // let element = document.getElementById(props.id)
        if (props.loc !== 'title_key' && props.loc.endsWith('key')){
            element.classList.add(...['men','key'])
        }else if (props.loc === 'title_value' ){
            element.classList.add(...['men', 'title_value'])
        }
        else if (props.loc.endsWith('_value' )){

            element.classList.add(...['men'])

        }
    })


    // let mention = props.mention
    // mention['id'] = props.id
    // mention['loc'] = props.loc
    // const [Mention,SetMention] = useState(mention)
    // const props.mention = props.mention

    // console.log('m',props.mention)
    // props.mention['id'] = props.id
    // Relationship.map((men,ind)=>{
    //     if(men['id'] === props.id && Object.keys(men).contains('role')){
    //         props.mention['role'] = men['role']
    //     }
    // })

    useEffect(()=>{
        var mention = props.mention

        mention['id'] = props.id
        console.log('curmentoon',props.mention,Concepts,ConceptsList)
        if(ConceptsList.filter(x=>x.start === props.mention.start && x.stop === props.mention.stop).length === 0){
            waitForElm('#'+props.id).then((mention) => {
                mention.style.color = 'rgb(65,105,225)'
                mention.style.backgroundColor = 'rgba(65,105,225,0.1)';
            })
        }



        // SetConcepts(false)
        // let concepts = []
        //
        // if(ConceptsList){
        //     ConceptsList.map(m=>{
        //         if(m.start === props.mention.start && m.stop === props.mention.stop){
        //             console.log('mention cur',m)
        //             concepts.push(m)
        //
        //
        //         }
        //     })
        //     SetConcepts(concepts)
        // }
        // if(MentionsList){
        //     MentionsList.map(m=>{
        //         if(m.start === props.mention.start && m.stop === props.mention.stop){
        //             console.log('mention cur',m)
        //             SetConcepts(m.concepts)
        //
        //         }
        //     })
        // }
        // SetMention(mention)
        // if (CurConcept && CurMention.start === props.start && CurMention.stop === props.stop){
        //     let concepts = []
        //     ConceptsList.map(x=>{
        //         if(CurMention.start === x.start && CurMention.stop === x.stop){
        //             console.log('mention cur',x)
        //             concepts.push(x)                }
        //     })
        //     //
        //     SetConcepts(concepts)
        // }
        // if (CurConcept && CurMention.start === props.start && CurMention.stop === props.stop){
        //     MentionsList.map(x=>{
        //         if(CurMention.start === x.start && CurMention.stop === x.stop){
        //             SetConcepts(x.concepts)
        //         }
        //     })
        // //
        // }

    },[props.mention])




    // useEffect(()=>{
    //     if(Concepts === false){
    //         if(MentionsList){
    //             MentionsList.map(m=>{
    //                 if(m.start === props.mention.start && m.stop === props.mention.stop){
    //                     console.log('mention cur',m)
    //                     SetConcepts(m.concepts)
    //
    //                 }
    //             })
    //         }
    //     }
    // },[Concepts])

    // useEffect(()=>{
    //     console.log('ccc',CurMention,MentionsList)
    //     if(MentionsList){
    //         MentionsList.map(m=>{
    //             if(m.start === props.mention.start && m.stop === props.mention.stop){
    //                 console.log('mention cur',m)
    //                 SetConcepts(m.concepts)
    //
    //             }
    //         })
    //     }
    //     if (CurConcept && CurMention.start === props.start && CurMention.stop === props.stop){
    //         MentionsList.map(x=>{
    //             if(CurMention.start === x.start && CurMention.stop === x.stop){
    //                 SetConcepts(x.concepts)
    //             }
    //         })
    //
    //     }
    //
    // },[MentionsList])

    // useEffect(()=>{
    //     console.log('current mention',CurMention,CurMention.start === props.start,CurMention.start === props.start,CurConcept,props.concepts)
    //     if (CurConcept && CurMention.start === props.start && CurMention.stop === props.stop){
    //         var con = props.concepts
    //         con.push(CurConcept)
    //         console.log('curcon',CurConcept)
    //         console.log('cincin',con)
    //         SetConcepts(con)
    //     }
    //
    //
    // },[CurMention,CurConcept])
    //
    // useEffect(()=>{
    //     console.log('upd conc',Concepts)
    // },[Concepts])

    // useEffect(()=>{
    //     console.log('final_m',StartM,StopM,Loc,TextM)
    //     // MentionsList.map(m=>{
    //     //
    //     //     console.log('final_m',Mention,m)
    //     //     if(m.start === Mention.start && m.stop === Mention.stop && m.position === Mention.loc){
    //     //         SetConcepts(m['concepts'])
    //     //         console.log('pos trovato',m['concepts'])
    //     //     }
    //     // })
    // },[StartM,StopM,Loc])


    // useEffect(()=>{
    //     const concepts_cur = []
    //     if(MentionsList){
    //         console.log('cur',props.mention)
    //
    //         MentionsList.map(m=>{
    //
    //             console.log('cur',m)
    //             if(m.start === props.start && m.stop === props.stop && m.position === props.loc){
    //
    //                 SetConcepts(m['concepts'])
    //                 console.log('pos trovato',m['concepts'])
    //             }
    //         })
    //     }
    //
    // },[MentionsList])




    useEffect(()=>{
        let mention = document.getElementById(props.id)
        let found = false

        Relationship.map((ment,id)=>{
            if(ment['id'] === props.mention['id']){
                found = true
            }
        })
        if (!found){
            console.log('relationship list not found')
            mention.classList = ['men']
            SetSourceLabel(false)
            SetPredicateLabel(false)
            SetTargetLabel(false)
            SetRole(false)
        }
    },[Relationship])


    useEffect(()=>{
        if(!InARel){
            SetSourceLabel(false)
            SetPredicateLabel(false)
            SetTargetLabel(false)

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
        SetSourceLabel('Source')
        ment['id'] = id
        ment['role'] = 'Source'
        SetRelationship([...Relationship,ment])



    }


    useEffect(()=>{
        // console.log('inarel',InARel)
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

        var roles = []
        Relationship.map(ment=>{
            roles.push(ment['role'])
        })

        if(role === 0){
            role = 'Source'
        }
        else if(role === 1){
            role = 'Predicate'
        }
        else if(role === 2){
            if (roles.indexOf('Source') !== -1 && roles.indexOf('Predicate') !== -1){
                role = 'Target'
            }
            else if(roles.indexOf('Predicate') !== -1 && roles.indexOf('Target') !== -1){
                role = 'Source'
            }
            else if(roles.indexOf('Source') !== -1 && roles.indexOf('Target') !== -1){
                role = 'Predicate'
            }
        }

        var mention = document.getElementById(props.id)
        if(role !== false){
             // console.log('ruolo',role)
            if(role === 1){
                mention.classList = ['predicate']
            }
            else if(role === 2){
                mention.classList = ['target']
            }
            else if(role === 0){
                mention.classList = ['source']
            }
            else if(role === 3){
                mention.classList = ['source']
            }
            else{
                mention.classList = [role.toLowerCase()]

            }

        }
        var new_mentions_list = []

        if(role === 'Source' || role === 0){
            SetTargetLabel(false)
            SetPredicateLabel(false)
            SourceLabel === false ? SetSourceLabel('Source') : SetSourceLabel(false)

        }
        else if(role === 'Predicate' || role === 1){
            SetTargetLabel(false)
            SetSourceLabel(false)
            PredicateLabel === false ? SetPredicateLabel('Predicate') : SetPredicateLabel(false)

        }
        else if(role === 'Target' || role === 2){
            SetPredicateLabel(false)
            SetSourceLabel(false)
            TargetLabel === false ? SetTargetLabel('Target') : SetTargetLabel(false)
        }

        if(Role === role || role === false || (Role === 'Predicate' && typeof role === "number")  || (Role === 'Source' && typeof role === "number") || (Role === 'Target' && typeof role === "number")){
            SetRole(false)
            mention.classList = ['men']
            Relationship.map((ment,ind)=>{
                if(ment['id'] !== props.mention['id']){
                    new_mentions_list.push(ment)
                }

            })
        }
        else{
            SetRole(role)
            if(role === 0 || role === 3){
                SetRole('Source')
                role = 'Source'
            }else if (role === 1){
                SetRole('Predicate')
                role = 'Predicate'
            }else if(role === 2){
                SetRole('Target')
                role = 'Target'
            }
            let found = false
            // console.log('new cur',props.mention)
            props.mention['role'] = role
            new_mentions_list.push(props.mention)
            // console.log('new_m',new_mentions_list)

            Relationship.map((ment,ind)=>{
                if(ment['id'] === props.mention['id']){
                    // console.log('new',ment)
                    ment['role'] = role
                    new_mentions_list.push(ment)
                }else if(ment['id'] !== props.mention['id'] && ment['role'] !== role){
                    // console.log('new',ment)
                    new_mentions_list.push(ment)
                }
            })

        }
        // console.log('new_m',new_mentions_list)
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
        event.stopPropagation();
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
        if(MentionToHighlight){
            let found = false
            MentionToHighlight.map(m=>{

                if(m.start === props.start && m.stop === props.stop){
                    found = true

                    inputEl.current.style.fontWeight = 'bold';
                }
                // else {
                //     inputEl.current.style.fontWeight = 'normal';
                // }

            })
            if(found === false){
                inputEl.current.style.fontWeight = 'normal';

            }

        }else{
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

    function setRoleAuto(e){
        e.preventDefault()
        e.stopPropagation()
        var mention = document.getElementById(props.id)

        // console.log('rolw change')
        if(Relationship.length === 1){
            SetRole('Predicate')
            SetPredicateLabel('Predicate')
            mention.classList = ['predicate']

        }
        else if(Relationship.length === 2) {
            SetRole('Target')
            SetTargetLabel('Target')
            mention.classList = ['target']

        }

    }

    function handleInfo(e){
        e.stopPropagation();
        e.preventDefault();
        setContextMenu(null);
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
    }

    function handleSuggestion(e){
        e.stopPropagation();
        e.preventDefault();
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
    }

    function handleConcept(e){
        e.stopPropagation();
        e.preventDefault();
        SetShowAddConceptModal(prev => !prev);
        setContextMenu(null);
        var ment = props.mention
        ment['id'] = props.id
        SetCurMention(ment)
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
    }

    function handleRelationship(e){
        SetInARel(true)
        e.stopPropagation();
        e.preventDefault();
        AddRelationship(e,props.id)
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
    }

    function handleDelete(e){
        // DeleteMention(e,props.mention,props.loc);
        e.stopPropagation();
        e.preventDefault();
        SetShowDeleteMetnionModal(true)
        setContextMenu(null);
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
    }



    return (
        <div>
            {ShowDeleteMetnionModal && <DeleteModal show={ShowDeleteMetnionModal} setshow={SetShowDeleteMetnionModal} mention={props.mention}
                          position={props.loc}/>}

            {/*<div>ciao {Concepts.length}</div>*/}
            {/*{((Concepts && Concepts !== null)) &&*/}
            {ConceptsList && !InARel &&
            <Concept concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id}/>}
            {/*{((Concepts && Concepts !== null)) &&*/}
            {/*    <Concept concepts={Concepts} setconcepts={SetConcepts} mention={props.mention}/>}*/}



                 {/*<div className='concepts' style={{color:'pink'}}>*/}
                 {/*    <Chip sx={{height:'15px',fontSize:'0.6rem'}} label={props.concepts[0].concept_name} color="primary"   />*/}
                 {/*</div>}*/}
            {/*{props.concepts && props.concepts.length > 1 &&*/}
            {/*<Concept length={props.concepts.length} />}*/}
            {/*    // <div className='concepts' style={{color:'pink'}}>*/}
            {/*//     <Chip sx={{height:'15px',fontSize:'0.6rem'}} label={props.concepts.length} color="primary"   />*/}
            {/*// </div>}*/}
            {<div onContextMenu={handleContextMenu} >
                <ThemeProvider theme={roletheme}>
                {InARel && Role !== false && <Chip sx={{height:'15px',fontSize:'0.6rem'}} label={Role} color={Role} />}
                </ThemeProvider>

                    <div id={props.id} ref={inputEl}

                         onClick={(e)=>{
                        if(InARel){
                            setRole(e,Relationship.length);
                            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                        }
                    }
                    } >

                        {/*{(props.loc).endsWith('_key') && props.loc !== 'title_key' && <b>*/}
                            {props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}
                            {props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}
                            {props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}
                            {!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}

                        {/*</b>}*/}

                        {/*{(props.loc) === 'title_value' && <h3>*/}
                        {/*{props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}*/}
                        {/*{props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}*/}
                        {/*{props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}*/}
                        {/*{!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}*/}
                        {/*    </h3>}*/}

                        {/*{(props.loc) !== 'title_value' && (props.loc).endsWith('value')  &&*/}
                        {/*<>*/}
                        {/*    {props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}*/}
                        {/*    {props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}*/}
                        {/*    {props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}*/}
                        {/*    {!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}*/}
                        {/*</>*/}
                        {/*}*/}




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
                        handleInfo(e)
                    }}>
                        <ListItemIcon>
                            <InfoIcon fontSize="small" />
                        </ListItemIcon>
                        Info
                    </MenuItem>
                    <MenuItem onClick={(e)=>{
                        handleSuggestion(e)
                    }}>
                        <ListItemIcon>
                            <AssistantIcon fontSize="small" />
                        </ListItemIcon>
                        Suggestion</MenuItem>

                    <Divider />

                    <MenuItem onClick={(e)=> {
                        handleConcept(e)
                    }}>
                        <ListItemIcon>
                            <AddIcon fontSize="small" />
                        </ListItemIcon>
                        Add Concept</MenuItem>

                    <MenuItem onClick={(e)=>{
                        handleRelationship(e)
                    }}>
                        <ListItemIcon>
                            <HubIcon fontSize="small" />
                        </ListItemIcon>
                        Add Relationship</MenuItem>
                    <Divider />

                    <MenuItem style={{color:'#d00000'}} onClick={(e)=>{
                        handleDelete(e)
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
                        <ListItemIcon >
                            {Role === 'Source' ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Source
                    </MenuItem>

                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        setRole(e,'Predicate');
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);

                    }}>
                        <ListItemIcon >
                            {Role === 'Predicate' ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Predicate
                    </MenuItem>

                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        setRole(e,'Target');

                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        <ListItemIcon >
                            {Role === 'Target' ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Target
                    </MenuItem>

                    <Divider />

                    <MenuItem style={{color:'#d00000'}} autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        setRole(e,false);
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        <ListItemIcon >
                            <DeleteIcon color='error' fontSize="small" />
                        </ListItemIcon>
                    Delete

                    </MenuItem>

                </StyledMenu>







            </div>}

    </div>
    )
}