
import React, {useState, useEffect, useContext, useMemo, useRef} from "react";

import HubIcon from '@mui/icons-material/Hub';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import '../annotation.css'

import AddIcon from '@mui/icons-material/Add';

import '../annotation.css'
import {AppContext} from "../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import {
    DeleteRange,
    updateMentionColor,
    updateRelMentionColor,
    waitForElm
} from "../../HelperFunctions/HelperFunctions";
import DeleteMentionModal from "./modals/DeleteMentionModal";
import AssistantIcon from '@mui/icons-material/Assistant';

import Concept from "../concepts/Concept";
import ChooseMentionModal from "./modals/ChooseMentionModal";
import InfoModal from "./modals/InfoModal";
import {RelationConceptContext} from "../concepts/RelationshipConceptModal";
import {ConceptContext} from "../../../BaseIndex";
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ShareIcon from '@mui/icons-material/Share';
import axios from "axios";
import SuggestionModal from "./modals/SuggestionModal";


export default function Mention(props){
    const { areascolors,concepts,inarel,curannotator,opensnack,sourcetext,predicatetext,targettext,targetconcepts,predicateconcepts,sourceconcepts,snackmessage,username,showrelspannel,predicate,target,newrelation,readonlyrelation,view,source,document_id,relationship,currentdiv,firstsel,curmention,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);

    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [DocumentID,SetDocumentID] = document_id
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions
    const [View,SetView] = view
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [Source,SetSource] = source
    const [Predicate,SetPredicate] = predicate
    const [Target,SetTarget] = target
    const [SourceConcepts,SetSourceConcepts] = sourceconcepts
    const [PredicateConcepts,SetPredicateConcepts] = predicateconcepts
    const [TargetConcepts,SetTargetConcepts] = targetconcepts
    const [SourceText,SetSourceText] = sourcetext
    const [PredicateText,SetPredicateText] = predicatetext
    const [TargetText,SetTargetText] =targettext
    // const [SourceId,SetSourceId] = sourceid
    // const [Target,SetTarget] = target
    // const [Predictae,SetPredicate] = predicate
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [CurMention,SetCurMention] = curmention
    // const [CurConcept,SetCurConcept] = curconcept
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [Role,SetRole] = useState(false)
    const [ShowReadOnlyRelation,SetShowReadOnlyRelation] = readonlyrelation
    const [ShowRels,SetShowRels] = showrelspannel
    const [NewRelation,SetNewRelation] = newrelation
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [Username,SetUsername] = username
    const [SnackMessage,SetSnackMessage] = snackmessage;
    const [OpenSnack,SetOpenSnack] = opensnack
    const [ShowChooseRelationshipModal,SetShowChooseRelationshipModal] = useState(false)
    // const [SourceLabel,SetSourceLabel] = useState(false)
    // const [PredicateLabel,SetPredicateLabel] = useState(false)
    // const [TargetLabel,SetTargetLabel] = useState(false)
    let key = props.loc
    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [ShowDeleteMetnionModal,SetShowDeleteMetnionModal] = useState(false)
    const [ShowInfoModal,SetShowInfoModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    const [AreasColors,SetAreasColors] = areascolors
    const [ShowSuggestionModal,SetShowSuggestionModal] = useState(false)
    const [Relationship,SetRelationship] = relationship
    const [Concepts,SetConcepts] = useState(null)
    const [ConceptsList,SetConceptsList] = concepts
    const [anchorEl, setAnchorEl] = useState(null);
    const [ShowCopyModal,SetShowCopyModal] = useState(false)
    const [ShowCopyConceptModal,SetShowCopyConceptModal] = useState(false)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        // console.log('
        // click')
        event.preventDefault()
        event.stopPropagation()
        if(CurAnnotator !== Username){
            setAnchorEl(event.currentTarget);

        }
        // setOpen(prev=>prev)
    };

    useEffect(()=>{
        if(Username !== CurAnnotator){
            document.getElementById(props.id).addEventListener('click',handleClick)
        }
    },[CurAnnotator,Username])


    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    function copyMention(e){
        e.stopPropagation()
        e.preventDefault()

        let mentions = props.mention.mentions.split(' ')
        if(mentions.length > 1){
            SetShowCopyModal(true)
        }else {
            SetOpenSnack(true)
            let m = MentionsList.filter(x=>x.mentions === props.mention.mentions)[0]
            m['id'] = props.id
            SetSnackMessage({'message':'Saving...'})
            axios.post('mentions/copy', {mention: m}).then(response => SetSnackMessage({'message':'Saved'})).catch(error => SetSnackMessage({'message':'ERROR'}))
        }
        handleCloseMenu()

    }
    function copyMentionConcept(e){
        e.stopPropagation()
        e.preventDefault()
        let mentions = props.mention.mentions.split(' ')
        if(mentions.length > 1){
            SetShowCopyConceptModal(true)
        }else{
            SetOpenSnack(true)
            let m = MentionsList.filter(x=>x.mentions === props.mention.mentions)[0]
            m['id'] = props.id
            SetSnackMessage({'message':'Saving...'})

            axios.post('concepts/copy',{mention:m,user:CurAnnotator}).then(response=>SetSnackMessage({'message':'Saved'})).catch(error=>SetSnackMessage({'message':'ERROR'}))

        }
        handleCloseMenu()
    }


    function updateClassesStandard(mention){
        let classes = props.mention.mentions.split(' ')
        mention.className = "";
        mention.classList.add(...classes)
        // console.log('classes',classes,classes.length>1,props.mention.mentions)
        if(classes.length>1){
            mention.classList.add('underlined')
        }
        // console.log('class',classes)
        if(classes.indexOf('men') ===-1){
            mention.classList.add('men')

        }

        // let element = document.getElementById(props.id)
        if (props.loc !== 'title_key' && props.loc.endsWith('key')){
            mention.classList.add('key')
        }else if (props.loc === 'title_value' ){
            mention.classList.add('title_value')

        }
        if(CurAnnotator !== Username){
            mention.classList.add('annotatorhover')
        }

    }

    function updateClasses(mention){
        updateClassesStandard(mention)
        if(mention.classList.length>0){
            mention.classList.remove("source");
            mention.classList.remove("predicate");
            mention.classList.remove("target");
        }
        let color_0 = 'rgba(65,105,225,1)'
        mention.style.color = color_0
        mention.style.backgroundColor = color_0.replace('1)','0.1)')
    }


    // useEffect(()=>{
    //     // console.log('entro in mention')
    //
    //     var mention = props.mention
    //     console.log('click mention')
    //     mention['id'] = props.id
    //     // console.log('curmentoon',props.mention)
    //     // let classes = props.mention.mentions.split(' ')
    //     // let classes = props.mention.mentions.split(' ')
    //     // let concepts_filtered = ConceptsList.filter(c=>c['mentions'].split(' ').some(item => classes.includes(item)))
    //     //
    //     // let color_0 = 'rgba(65,105,225,1)'
    //     // // if (concepts_filtered.length > 0) {
    //     //
    //     // //     ora cerco se c'è qualche mention con concetto associato nella lista di concetti
    //     // concepts_filtered.map(c => {
    //     //     if (c['mentions'].split(' ').some(item => classes.includes(item))) {
    //     //         let area = c['concept']['area']
    //     //         color_0 = window.localStorage.getItem(area)
    //     //         if (color_0 === null) {
    //     //             color_0 = 'rgba(65,105,225,1)'
    //     //         }
    //     //     }
    //     //
    //     // })
    //
    //     waitForElm('#'+props.id).then((mention) => {
    //         updateClasses(mention)
    //         // mention.style.color = color_0
    //         // mention.style.backgroundColor = color_0.replace('1)', '0.1)')
    //
    //     })
    //
    //
    //
    // },[props.mention])


    // useEffect(()=>{
    //     // console.log('entro in concepts')
    //
    //     // QUESTO FUNZIONA ALL'INIZIO!!!!!
    //
    //
    //     waitForElm('#' + props.id).then((mention) => {
    //         updateClasses(mention)
    //
    //     })
    //     // }
    //     // }
    //     // else{
    //     //
    //     //     }
    //
    // },[props.mention,ConceptsList])

    useEffect(()=>{
        // console.log('entro in concepts')

        // QUESTO FUNZIONA ALL'INIZIO!!!!!
        //         console.log(ConceptsList,props.mention)
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
                if(concepts_filtered.length > 1){
                    color_0 = 'rgba(50,50,50,1)'
                }

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

    },[props.mention,ConceptsList,MentionsList,AreasColors])



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
        if(!InARel){
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
        }

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






    function handleInfo(e){
        e.stopPropagation();
        e.preventDefault();
        setContextMenu(null);
        SetShowInfoModal(true)
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
    }

    function handleSuggestion(e){
        e.stopPropagation();
        e.preventDefault();

        SetShowSuggestionModal(true)

        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
        setContextMenu(null);


    }

    function handleConcept(e){
        e.stopPropagation();
        e.preventDefault();
        SetShowAddConceptModal(prev => !prev);
        setContextMenu(null);
        let mentions_list_cur = []
        var ment = props.mention
        ment['id'] = props.id
        let classes = Array.from(document.getElementById(props.id).classList)
        classes = classes.filter(x=>x.startsWith('mention_'))
        if(classes.length === 1){
            let ment = MentionsList.find(x=>x.mentions === classes[0])
            SetCurMention([ment])
        }else if(classes.length > 1){
            let ment = []
            classes.map(c=>{
                ment.push(MentionsList.find(x=>x.mentions ===  c))
            })
            SetCurMention(ment)

        }


        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
    }

    function handleRelationship(e){
        e.stopPropagation();
        e.preventDefault();
        SetShowRels(false)
        SetShowReadOnlyRelation(false)
        SetNewRelation(true)
        SetSource(false)
        SetPredicate(false)
        SetTarget(false)
        SetPredicateText(false)
        SetSourceText(false)
        SetTargetText(false)
        SetPredicateConcepts(false)
        SetSourceConcepts(false)
        SetTargetConcepts(false)
        if(props.mention.mentions.split(' ').length>1){
            SetShowChooseRelationshipModal(true)
            setContextMenu(null);
            // DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);

        }else{
            SetInARel(true)
            SetSource(props.mention.mentions)
            // SetSourceId(props.id)
            updateRelMentionColor('source',props.mention.mentions)

            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
            setContextMenu(null);
        }

    }

    function handleDelete(e){
        // DeleteMention(e,props.mention,props.loc);
        e.stopPropagation();
        e.preventDefault();
        SetShowDeleteMetnionModal(true)
        setContextMenu(null);
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv);
    }


    // useEffect(()=>{
    //     if(CurAnnotator !== Username){
    //         waitForElm('#'+props.id).then(mention=>{
    //             mention.classList.add('annotatorhover')
    //         })
    //
    //     }
    // },[CurAnnotator])

    return (
        <div className={'mentionpart'}>
            {ShowDeleteMetnionModal && <DeleteMentionModal show={ShowDeleteMetnionModal} setshow={SetShowDeleteMetnionModal} mention={props.mention}
                                                           position={props.loc}/>}
            {ShowInfoModal && <InfoModal show={ShowInfoModal} setshow={SetShowInfoModal} mention={props.mention}
                                                           />}
            {ShowChooseRelationshipModal && <ChooseMentionModal type={'relationship'} show={ShowChooseRelationshipModal} setshow={SetShowChooseRelationshipModal} mention={props.mention} mention_id={props.id}
                                                         />}
            {ShowCopyModal && <ChooseMentionModal type={'mention'} show={ShowCopyModal} setshow={SetShowCopyModal} mention={props.mention} mention_id={props.id}
            />}
            {ShowCopyConceptModal && <ChooseMentionModal type={'concept'} show={ShowCopyConceptModal} setshow={SetShowCopyConceptModal} mention={props.mention} mention_id={props.id}
            />}
            {ShowSuggestionModal && <SuggestionModal  show={ShowSuggestionModal} setshow={SetShowSuggestionModal} mention={props.mention} mention_id={props.id}
            />}

            {ConceptsList && View === 1 && !InARel && ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop)).length > 0 &&
            <Concept concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id}/>}

            {CurAnnotator !== Username ? <div onClick={(e)=>{
                    if((e.altKey)) {
                        handleDelete(e)
                    }else if((e.shiftKey)){
                        console.log('relationships')
                        handleRelationship(e)
                    }else if (e.ctrlKey ) {
                        handleConcept(e)
                    }

                }
                }>
                <div id={props.id} ref={inputEl} >

                    {props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}
                    {props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}
                    {props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && props.mention_text !== ' ' && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}
                    {!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}
                    {props.mention_text === (' ') && <>&nbsp;</>}
                </div>
            </div> :
                <div onContextMenu={handleContextMenu} onClick={(e)=>{
                    if((e.altKey)) {
                        handleDelete(e)
                    }else if((e.shiftKey)){
                        console.log('relationships')
                        handleRelationship(e)
                    }else if (e.ctrlKey ) {
                        handleConcept(e)
                    }

                }
                }>

                    <div id={props.id} ref={inputEl} >

                            {props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}
                            {props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}
                            {props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && props.mention_text !== ' ' && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}
                            {!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}
                            {props.mention_text === (' ') && <>&nbsp;</>}





                    </div>

                    <StyledMenu
                    open={contextMenu !== null}
                    onClose={handleClose}
                    // elevation={0}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >
                        <div></div>
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


            </div>}
                <Menu
                id="fade-menu"
                MenuListProps={{
                'aria-labelledby': 'fade-button',
            }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                >
                <div></div>
                <MenuItem autoFocus ={false} onClick={(e)=>{
                copyMention(e)
            }}>
                <ListItemIcon>
                <TextFieldsIcon fontSize="small" />
                </ListItemIcon>
                Copy mention
                </MenuItem>
                <MenuItem onClick={(e)=>{
                copyMentionConcept(e)
            }}>
                <ListItemIcon>
                <ShareIcon fontSize="small" />
                </ListItemIcon>
                Copy mention and concept(s)</MenuItem>
                </Menu>


    </div>
    )
}