import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Draggable from 'react-draggable';

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";

import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, useMemo, useRef} from "react";
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
import DraggableModal from "./ConceptModal";
import {
    DeleteRange,
    waitForElm,
    updateRelMentionColor,
    updateMentionColor
} from "../HelperFunctions/HelperFunctions";
import DeleteModal from "./DeleteModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import {type} from "@testing-library/user-event/dist/type";
import Concept from "../Annotation/concepts/Concept";
import ChipRel from "../Annotation/relationship/ChipRelationship";
import ChooseMentionModal from "../Annotation/mentions/modals/ChooseMentionModal";

export default function RelMention(props){
    const { view,concepts,inarel,source,target,predicate,sourceid,targetid,predicateid,document_id,areascolors,currentdiv,firstsel,curmention,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [DocumentID,SetDocumentID] = document_id
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions
    const [View,SetView] = view
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [Source,SetSource] = source
    const [Target,SetTarget] = target
    const [Predicate,SetPredicate] = predicate
    const [SourceId,SetSourceId] = sourceid
    const [TargetId,SetTargetId] = targetid
    const [PredicateId,SetPredicateId] = predicateid
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [CurMention,SetCurMention] = curmention
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [Role,SetRole] = useState(false)
    const [AreasColors,SetAreasColors] = areascolors



    let key = props.loc
    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [ShowDeleteMetnionModal,SetShowDeleteMetnionModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    // const [Relationship,SetRelationship] = relationship
    const [Concepts,SetConcepts] = useState(null)
    const [ConceptsList,SetConceptsList] = concepts

    function updateClassesStandard(mention){
        let classes = props.mention.mentions.split(' ')
        if(classes.length>1){
            classes.push('underlined')
        }
        // console.log('class',classes)
        if(classes.indexOf('men') ===-1){
            classes.push('men')

        }

        // let element = document.getElementById(props.id)
        if (props.loc !== 'title_key' && props.loc.endsWith('key')){
            classes.push('key')
            mention.classList.add(...classes)
        }else if (props.loc === 'title_value' ){
            classes.push('title_value')

            mention.classList.add(...classes)
        }
        else if (props.loc.endsWith('_value' )){

            mention.classList.add(...classes)

        }
    }



    function updateClasses(mention){
        updateClassesStandard(mention)
        mention.classList.remove("source");
        mention.classList.remove("predicate");
        mention.classList.remove("target");
        let color_0 = 'rgba(65,105,225,1)'
        mention.style.color = color_0
        mention.style.backgroundColor = color_0.replace('1)','0.1)')



    }
    function RemoveClasses(mention){
        updateClassesStandard(mention)
        mention.classList.remove("source");
        mention.classList.remove("predicate");
        mention.classList.remove("target");
        let color_0 = 'rgba(65,105,225,1)'
        mention.style.color = color_0
        mention.style.backgroundColor = color_0.replace('1)','0.1)')
    }






    useEffect(()=>{


        var mention = props.mention

        mention['id'] = props.id
        console.log('curmentoon',props.mention)
        let classes = props.mention.mentions.split(' ')

        waitForElm('#'+props.id).then((mention) => {

            updateClassesStandard(mention)
            let found_source = false
            // if(Source === props.mention.mentions) {
            //     found_source = true
            //     // updateClassesStandard(props.mention)
            //     mention.classList.add('source')
            //     if (document.getElementById('source') === null) {
            //         var wrapper = document.createElement('div');
            //         wrapper.id = 'source'
            //         var el = Array.from(document.getElementsByClassName('source'));
            //         console.log(el)
            //         el.map(e => {
            //             if (e.parentElement.id !== 'source') {
            //                 e.parentNode.insertBefore(wrapper, e);
            //                 wrapper.appendChild(e);
            //             }
            //         })
            //     }
            //
            // }

        // questo è per colorare anche le overlapping ALL'INIZIO, APPENA PASSO DA NOT INAREL A INAREL
            props.mention.mentions.split(' ').map(m=> {

                if (m === Source) {
                    found_source = true
                    mention.classList.add('source')

                    let wrapper = document.getElementById('source')

                    if (wrapper === null) {
                        wrapper = document.createElement('div');
                        wrapper.id = 'source'
                    }
                    if (mention.parentElement.id !== 'source') {
                        mention.parentNode.insertBefore(wrapper, mention);
                        wrapper.appendChild(mention);
                    }
                    // if(!found_source){
                    //     updateClassesStandard(document.getElementById(props.mention.id))
                    //
                    // }
                }
            })


            if(props.concepts.length === 0 && !found_source){
                updateClasses(mention)

                    // console.log(props.mention.mentions.split(' '))
                    // props.mention.mentions.split(' ').map(e=>{
                    //     (updateMentionColor(e, props.mention.start, props.mention.stop, props.concepts,AreasColors))
                    // })



            }

        })





    },[props.mention])

    useEffect(()=>{
        // console.log('entro in concepts')

        // QUESTO FUNZIONA ALL'INIZIO!!!!!
        var mention = props.mention
        mention['id'] = props.id
        // console.log('curmentoon',props.mention)
        let classes = props.mention.mentions.split(' ')
        let concepts_filtered = ConceptsList.filter(c=>c['mentions'].split(' ').some(item => classes.includes(item)))

        let color_0 = 'rgba(65,105,225,1)'
        // if (concepts_filtered.length > 0) {

        //     ora cerco se c'è qualche mention con concetto associato nella lista di concetti
        concepts_filtered.map(c => {
            if (c['mentions'].split(' ').some(item => classes.includes(item))) {
                let area = c['concept']['area']
                color_0 = window.localStorage.getItem(area)
                if (color_0 === null) {
                    color_0 = 'rgba(65,105,225,1)'
                }
            }

        })

        waitForElm('#' + props.id).then((mention) => {
            updateClasses(mention)
            mention.style.color = color_0
            mention.style.backgroundColor = color_0.replace('1)', '0.1)')
        })
        // }
        // }
        // else{
        //
        //     }

    },[props.mention,ConceptsList])

    // useEffect(()=>{
    //     // console.log('entro in concepts')
    //
    //     // QUESTO FUNZIONA ALL'INIZIO!!!!!
    //     var mention = props.mention
    //     mention['id'] = props.id
    //     // console.log('curmentoon',props.mention)
    //     let classes = props.mention.mentions.split(' ')
    //     let concepts_filtered = ConceptsList.filter(c=>c['mentions'].split(' ').some(item => classes.includes(item)))
    //     if(props.concepts.length === 0){
    //
    //         let color_0 = 'rgba(65,105,225,1)'
    //         if(concepts_filtered.length > 0){
    //
    //             //     ora cerco se c'è qualche mention con concetto associato nella lista di concetti
    //             concepts_filtered.map(c=>{
    //                 if(c['mentions'].split(' ').some(item => classes.includes(item))){
    //                     let area = c['concept']['area']
    //                     color_0 = window.localStorage.getItem(area)
    //                     if(color_0 === null) {
    //                         color_0 = 'rgba(65,105,225,1)'
    //                     }
    //                 }
    //
    //             })
    //
    //             waitForElm('#'+props.id).then((mention) => {
    //                 updateClasses(mention)
    //                 mention.style.color = color_0
    //                 mention.style.backgroundColor = color_0.replace('1)','0.1)')})
    //         }
    //         else{
    //             waitForElm('#'+props.id).then((mention) => {
    //                 updateClasses(mention)
    //                 mention.style.color = color_0
    //                 mention.style.backgroundColor = color_0.replace('1)','0.1)')
    //             })
    //         }
    //
    //
    //
    //     }
    //
    //
    //
    // },[props.concepts])




    useEffect(()=>{
        if(!InARel){
            let mention = document.getElementById(props.id)
            RemoveClasses(mention)

        }
    },[InARel])


    function removeAllChildren(nodetype){
        let target = document.getElementById(nodetype)
        // let target ='';
        let sources = Array.from(document.getElementsByClassName(nodetype))
        if(target !== null){

            sources.map(el=>{
                el.classList.remove(nodetype)
                // target.removeChild(el)
                console.log('childre',target.children)


            })
            if(target.childNodes){
                console.log('node',target.childNodes)
                target.replaceWith(...target.childNodes)
            }else{
                target.remove()
            }

        }




    }

    function addChild(nodetype){
        var wrapper = document.getElementById(nodetype)
        if(! wrapper) {
            wrapper = Array.from(document.getElementsByClassName(nodetype))[0]
            wrapper = document.createElement('div');
            // wrapper = wrapper.parentElement
            wrapper.id = nodetype
        }

        var el = Array.from(document.getElementsByClassName(nodetype));
        console.log(el)
        el.map(e=>{
            if(e.parentElement.id !== nodetype){
                e.parentNode.insertBefore(wrapper, e);
                wrapper.appendChild(e);
            }
        })

    }


    function changeRole(e,role=null) {
        e.preventDefault();
        e.stopPropagation();
        let mention = document.getElementById(props.id)
        let source = document.getElementById('source')
        let predicate = document.getElementById('predicate')
        let target = document.getElementById('target')

        // CAOS 1: CLICCO E BASTA
        // SOTTOCASO 1: CLICCO E NON AVEVA RUOLO


        // SOTTOCAOS 2: CLICCO E AVEVA LO STESSO RUOLO
        // SOTTOCASO 3: CLICCO E AVEVA UN RUOLO DIVERSO
        if(Source === props.mention.mentions || Predicate === props.mention.mentions || Target === props.mention.mentions){

            // CASO1 : ERA GIà SOURCE E STO CAMBIANDO
            if(props.mention.mentions === Source){
                mention.classList.remove('source')
                // se role è null significa che ho cliccato dove già era source, per questo viene eliminato
                // se ho role == false significa che ho premuto delete
                if(role === null || !role || role === 'Source'){
                    SetSource(false)
                    SetSourceId(false)
                    updateRelMentionColor(false)
                    removeAllChildren('source')
                }else{
                    SetSource(false)
                    SetSourceId(false)
                    removeAllChildren('source')
                    // CAMBIO A TARGET
                    if(role === 'Target'){
                        removeAllChildren('target')
                        mention.classList.add('target')
                        SetTarget(props.mention.mentions)
                        SetTargetId(props.id)
                    }
                    // CAMBIO A TARGET
                    else if(role === 'Predicate'){
                        removeAllChildren('predicate')
                        mention.classList.add('predicate')

                        SetPredicate(props.mention.mentions)
                        SetPredicateId(props.id)
                    }
                    updateRelMentionColor(role.toLowerCase(),props.mention.mentions)
                    // addChild(role.toLowerCase())
                }


            }
            // CASO 2 : ERA GIà PREDICATE E STO CAMBIANDO
            else if(props.mention.mentions === Predicate){
                mention.classList.remove('predicate')
                // se role è null significa che ho cliccato dove già era source, per questo viene eliminato
                // se ho role == false significa che ho premuto delete
                if(role === null || !role || role === 'Predicate'){
                    SetPredicate(false)
                    SetPredicateId(false)
                    updateRelMentionColor(false)
                    removeAllChildren('predicate')
                }else{
                    SetPredicate(false)
                    SetPredicateId(false)
                    removeAllChildren('predicate')
                    // CAMBIO A TARGET
                    if(role === 'Target'){
                        removeAllChildren('target')
                        mention.classList.add('target')

                        SetTarget(props.mention.mentions)
                        SetTargetId(props.id)
                    }
                    // CAMBIO A source
                    else if(role === 'Source'){
                        removeAllChildren('source')
                        mention.classList.add('source')

                        SetSource(props.mention.mentions)
                        SetSourceId(props.id)
                    }
                    updateRelMentionColor(role.toLowerCase(),props.mention.mentions)
                    addChild(role.toLowerCase())
                }


            }
            else if(props.mention.mentions === Target){
                mention.classList.remove('target')
                // se role è null significa che ho cliccato dove già era source, per questo viene eliminato
                // se ho role == false significa che ho premuto delete
                if(role === null || !role || role === 'Target'){
                    SetTarget(false)
                    SetTargetId(false)
                    updateRelMentionColor(false)
                    removeAllChildren('target')
                }else{
                    SetTarget(false)
                    SetTargetId(false)
                    removeAllChildren('target')
                    // CAMBIO A TARGET
                    if(role === 'Predicate'){
                        removeAllChildren('predicate')
                        mention.classList.add('predicate')
                        SetPredicate(props.mention.mentions)
                        SetPredicateId(props.id)
                    }
                    // CAMBIO A TARGET
                    else if(role === 'Source'){
                        removeAllChildren('source')
                        mention.classList.add('source')
                        SetSource(props.mention.mentions)
                        SetSourceId(props.id)
                    }
                    updateRelMentionColor(role.toLowerCase(),props.mention.mentions)
                    addChild(role.toLowerCase())
                }


            }
        }else {
            if (role === null) {
                if (!Source || (Predicate && Target && Source) ) {
                    removeAllChildren('source')
                    mention.classList.add('source')
                    SetSource(props.mention.mentions)
                    SetSourceId(props.id)
                    updateRelMentionColor('source',props.mention.mentions)
                    addChild('source')


                } else if ((!Predicate && Target) || (!Predicate && !Target) ) {
                    removeAllChildren('predicate')
                    mention.classList.add('predicate')
                    SetPredicate(props.mention.mentions)
                    SetPredicateId(props.id)
                    updateRelMentionColor('predicate',props.mention.mentions)
                    addChild('predicate')

                } else if ((Predicate && !Target) ) {
                    removeAllChildren('target')
                    mention.classList.add('target')
                    SetTarget(props.mention.mentions)
                    SetTargetId(props.id)
                    updateRelMentionColor('target',props.mention.mentions)
                    addChild('target')

                }
            }else if (role){
                if (role === 'Source' ) {
                    removeAllChildren('source')
                    mention.classList.add('source')
                    SetSource(props.mention.mentions)
                    SetSourceId(props.id)
                    updateRelMentionColor('source',props.mention.mentions)
                    addChild('source')


                } else if (role === 'Predicate' ) {
                    removeAllChildren('predicate')
                    mention.classList.add('predicate')
                    SetPredicate(props.mention.mentions)
                    SetPredicateId(props.id)
                    updateRelMentionColor('predicate',props.mention.mentions)
                    addChild('predicate')

                } else if (role === 'Target' ) {
                    removeAllChildren('target')
                    mention.classList.add('target')
                    SetTarget(props.mention.mentions)
                    SetTargetId(props.id)
                    updateRelMentionColor('target',props.mention.mentions)
                    addChild('target')

                }
            }




        }

        // CASO 2: CLICCO SU MENU
        // SOTTOCASO 1: CLICCO E NON AVEVA RUOLO
        // SOTTOCAOS 2: CLICCO E AVEVA LO STESSO RUOLO
        // SOTTOCASO 3: CLICCO E AVEVA UN RUOLO DIVERSO


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



    // useEffect(()=>{
    //     if(MentionToHighlight){
    //         let found = false
    //         MentionToHighlight.map(m=>{
    //
    //             if(m.start === props.start && m.stop === props.stop){
    //                 found = true
    //
    //                 inputEl.current.style.fontWeight = 'bold';
    //             }
    //             // else {
    //             //     inputEl.current.style.fontWeight = 'normal';
    //             // }
    //
    //         })
    //         if(found === false){
    //             inputEl.current.style.fontWeight = 'normal';
    //
    //         }
    //
    //     }else{
    //         inputEl.current.style.fontWeight = 'normal';
    //     }
    //
    // },[MentionToHighlight])


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





    return (
        <div >


            {/*{ShowChooseRelationshipModal && <ChooseMentionModal show={ShowChooseRelationshipModal} setshow={SetShowChooseRelationshipModal} mention={props.mention}*/}
            {/*/>}*/}

            {View === 1 && props.concepts.length > 0 && props.mention.mentions !== Source &&props.mention.mentions !== Predicate &&props.mention.mentions !== Target && <Concept role={'neutro'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}
            {View === 1 && props.concepts.length > 0 && props.mention.mentions === Source && <Concept role={'Source'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}
            {View === 1 && props.concepts.length > 0 && props.mention.mentions === Predicate && <Concept role={'Predicate'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}
            {View === 1 && props.concepts.length > 0 && props.mention.mentions === Target && <Concept role={'Target'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}
            {<div className='upper' onContextMenu={handleContextMenu} >


                <div id={props.id} ref={inputEl}

                     onClick={(e)=>{
                         changeRole(e)
                         DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                         }

                     } >
                    {/*{props.mention.mentions === Source && <span><ChipRel role={'Source'} /></span>}*/}
                    {/*{props.mention.mentions === Target && <span><ChipRel role={'Target'} /></span>}*/}
                    {/*{props.mention.mentions === Predicate && <span><ChipRel role={'Predicate'} /></span>}*/}
                    <span>
                         {props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}
                        {props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}
                        {props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && props.mention_text !== ' ' && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}
                        {!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}
                        {props.mention_text === (' ') && <>&nbsp;</>}
                    </span>






                </div>

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

                    <MenuItem autoFocus ={false} onClick={(e)=>{

                        setContextMenu(null);
                        changeRole(e,'Source');
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        <ListItemIcon >
                            {Source === props.mention.mentions ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Source
                    </MenuItem>

                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        changeRole(e,'Predicate');
                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);

                    }}>
                        <ListItemIcon >
                            {Predicate === props.mention.mentions ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Predicate
                    </MenuItem>

                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        changeRole(e,'Target');

                        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
                    }}>
                        <ListItemIcon >
                            {Target === props.mention.mentions ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Target
                    </MenuItem>

                    <Divider />

                    <MenuItem style={{color:'#d00000'}} autoFocus ={false} onClick={(e)=>{
                        setContextMenu(null);
                        changeRole(e,false);
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