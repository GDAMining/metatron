import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import React, {useState, useEffect, useContext, useMemo, useRef} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import EditIcon from '@mui/icons-material/Edit';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import '../annotation.css'

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
import {ArrowContext} from "../../Document/DocumentFinal_2";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import DraggableModal from "../concepts/DraggableConceptModal";
import {
    DeleteRange,
    updateMentionColor,
    updateRelMentionColor,
    waitForElm
} from "../../HelperFunctions/HelperFunctions";
import DeleteMentionModal from "./modals/DeleteMentionModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import {type} from "@testing-library/user-event/dist/type";
import Concept from "../concepts/Concept";
import ChipRel from "../relationship/ChipRelationship";
import ChooseMentionModal from "./modals/ChooseMentionModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Radio from "@mui/material/Radio";
import DialogActions from "@mui/material/DialogActions";
import {ConceptContext} from "../../../BaseIndex";

export default function RelMention(props){
    const { view,concepts,inarel,relationship,curannotator,username,predicateconcepts,predicatetext,targetconcepts,targettext,sourcetext,sourceconcepts,relationshipslist,showrelspannel,modifyrel,predicate,source,target,currentdiv,readonlyrelation,firstsel,curmention,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const { startanchorsp,startanchorpt,endanchorsp,endanchorpt,endanchorst,selectedarrow,startanchorst,overlappingpt,overlappingsp,overlappingst } = useContext(ArrowContext);
    const { sparrow,ptarrow,starrow } = useContext(ConceptContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [Click,SetClick] = useState(false)
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions
    const [EndAnchorST,SetEndAnchorST] = endanchorst
    const [StartAnchorST,SetStartAnchorST] = startanchorst
    const [StartAnchorSP,SetStartAnchorSP] = startanchorsp
    const [StartAnchorPT,SetStartAnchorPT] = startanchorpt
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [Username,SetUsername] = username

    const [RelationshipsList,SetRelationshipsList] = relationshipslist
    const [SourceConcepts,SetSourceConcepts] = sourceconcepts
    const [PredicateConcepts,SetPredicateConcepts] = predicateconcepts
    const [TargetConcepts,SetTargetConcepts] = targetconcepts
    const [SourceText,SetSourceText] = sourcetext
    const [PredicateText,SetPredicateText] = predicatetext
    const [TargetText,SetTargetText] =targettext


    const [EndAnchorSP,SetEndAnchorSP] = endanchorsp
    const [EndAnchorPT,SetEndAnchorPT] = endanchorpt
    const [View,SetView] = view
    const [SelectedMention,SetSelectedMention] = useState(false)
    const [Role,SetRole] = useState(false)
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [Source,SetSource] = source
    const [SelectedArrow,SetSelectedArrow] = selectedarrow
    const [Target,SetTarget] = target
    const [Predicate,SetPredicate] = predicate
    // const [SourceId,SetSourceId] = sourceid
    // const [TargetId,SetTargetId] = targetid
    // const [PredicateId,SetPredicateId] = predicateid
    const [SPArrow,SetSPArrow] = sparrow
    const [PTArrow,SetPTArrow] = ptarrow
    const [STArrow,SetSTArrow] = starrow
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [CurMention,SetCurMention] = curmention
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [Mentions,SetMentions] = useState(false)
    const [ShowSelectMentionModal,SetShowSelectMentionModal] = useState(false)
    const [value,SetValue] = useState(0)
    const [ShowReadOnlyRelation,SetShowReadOnlyRelation] = readonlyrelation
    let key = props.loc
    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [ShowDeleteMetnionModal,SetShowDeleteMetnionModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    const [Relationship,SetRelationship] = relationship
    const [Concepts,SetConcepts] = useState(null)
    const [ConceptsList,SetConceptsList] = concepts
    // const [OverlappingPT,SetOverlappingPT] = overlappingpt
    // const [OverlappingST,SetOverlappingST] = overlappingst
    // const [OverlappingPS,SetOverlappingPS] = overlappingsp




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
        if(mention.classList.length>0){
            mention.classList.remove("source");
            mention.classList.remove("predicate");
            mention.classList.remove("target");
        }
        let color_0 = 'rgba(65,105,225,1)'
        mention.style.color = color_0
        mention.style.backgroundColor = color_0.replace('1)','0.1)')
    }

    function update(mention,color_0){
        // console.log('ATTENZIONE1',props.id)
        updateClasses(mention)
        mention.style.color = color_0
        mention.style.backgroundColor = color_0.replace('1)', '0.1)')


        let mentions = props.mention.mentions.split(' ')
        if (Source && mentions.indexOf(Source) !== -1) {

            let found_source = true
            mention.classList.add('source')
            if (document.getElementById('source') === null) {
                var wrapper = document.createElement('div');
                wrapper.id = 'source'
                addChild('source')

            }

            // questo è per colorare anche le overlapping ALL'INIZIO, APPENA PASSO DA NOT INAREL A INAREL
            mentions.map(m => {
                if (m === Source) {
                    found_source = true
                    mention.classList.add('source')

                    addChild('source')


                }
            })

            // updateArrows()

        }
        if (Predicate && mentions.indexOf(Predicate) !== -1) {
            let found_source = true
            mention.classList.add('predicate')
            if (document.getElementById('predicate') === null) {
                var wrapper = document.createElement('div');
                wrapper.id = 'predicate'
                addChild('predicate')

            }

            // questo è per colorare anche le overlapping ALL'INIZIO, APPENA PASSO DA NOT INAREL A INAREL
            mentions.map(m => {
                if (m === Predicate) {
                    found_source = true
                    mention.classList.add('predicate')

                    addChild('predicate')


                }
            })

            // updateArrows()
        } if (Target && mentions.indexOf(Target) !== -1) {
            let found_source = true
            mention.classList.add('target')
            if (document.getElementById('target') === null) {
                var wrapper = document.createElement('div');
                wrapper.id = 'target'
                addChild('target')
            }

            // questo è per colorare anche le overlapping ALL'INIZIO, APPENA PASSO DA NOT INAREL A INAREL
            mentions.map(m => {
                if (m === Target) {
                    found_source = true
                    mention.classList.add('target')

                    addChild('target')

                }
            })
            // updateArrows()
        }
    }




    useEffect(()=>{
        // console.log('entro in concepts')

        // QUESTO FUNZIONA ALL'INIZIO!!!!!
        // console.log('ATTENZIONE' ,props.id, Source,Predicate,Target)
        SetPTArrow(false)
        SetSPArrow(false)
        SetSTArrow(false)
        // console.log(ConceptsList,props.mention)
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
        mention = document.getElementById(props.id)
        // console.log(mention)
        if(mention!==undefined && mention !== null){
            update(mention,color_0)
            // updateArrows()
        }else{
            waitForElm('#' + props.id).then((mention) => {
                update(mention,color_0)
                // updateArrows()

            })
        }

    },[props.mention,Source,Predicate,Target])


    function updateArrows(){
        let source_el = document.getElementById('source')
        let predicate_el = document.getElementById('predicate')
        let target_el = document.getElementById('target')

    }





    function removeAllChildren(nodetype){
        let target = document.getElementById(nodetype)
        // let target ='';
        let sources = Array.from(document.getElementsByClassName(nodetype))
        if(target !== null){
            let els =Array.from(document.querySelectorAll('div[class^="bulls"]'))
            sources.map(el=>{
                el.classList.remove(nodetype)
            })

            if(target.childNodes){
                // console.log('node',target.childNodes)
                els.map(el=>{
                    if(el.parentElement.id.toLowerCase() === nodetype){
                        target.removeChild(el)

                    }
                })
                target.replaceWith(...target.childNodes)
            }
            else{

                target.remove()
            }

        }
    }



    function findAncestor (el, cls) {

        // console.log('cls',cls)
        while(el.className !== cls){
            // console.log('el',el.id)
            el = el.parentElement
        }
        return el;
    }



    function addChild(nodetype){
        var wrapper = document.getElementById(nodetype)
        if(! wrapper) {
            // wrapper = Array.from(document.getElementsByClassName(nodetype))[0]
            wrapper = document.createElement('div');
            let color = ''
            if(nodetype.toLowerCase() === 'source'){
               color = 'rgb(214, 28, 78)'

            }else if(nodetype.toLowerCase() === 'target'){
                color = 'rgb(241, 136, 103)'

            }else if(nodetype.toLowerCase() === 'predicate'){
                color = 'rgb(55, 125, 113)'

            }

            // Credo le palle ai vertici del div
            var bulls_left = document.createElement('div');
            bulls_left.addEventListener("click", function(e) {
                const elementClicked = e.target;
                // if(elementClicked.getAttribute('listener') !== 'true'){

                // console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
                let position = e.target.className.split('_')
                position = position[position.length -1]

                SetClick([position,elementClicked.parentElement.id])
                // }

            });
            bulls_left.className = 'bulls_left'
            bulls_left.style.backgroundColor = color
            wrapper.appendChild(bulls_left);
            var bulls_right = document.createElement('div');
            bulls_right.addEventListener("click", function(e) {
                const elementClicked = e.target;
                // if(elementClicked.getAttribute('listener') !== 'true'){

                // console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
                let position = e.target.className.split('_')
                position = position[position.length -1]

                SetClick([position,elementClicked.parentElement.id])
                // }

            });
            bulls_right.className = 'bulls_right'
            bulls_right.style.backgroundColor =  color
            wrapper.appendChild(bulls_right);
            var bulls_top = document.createElement('div');
            bulls_top.addEventListener("click", function(e) {
                const elementClicked = e.target;
                // if(elementClicked.getAttribute('listener') !== 'true'){

                // console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
                let position = e.target.className.split('_')
                position = position[position.length -1]

                SetClick([position,elementClicked.parentElement.id])
                // }

            });
            bulls_top.className = 'bulls_top'

            bulls_top.style.backgroundColor = color
            wrapper.appendChild(bulls_top);
            var bulls_bottom = document.createElement('div');
            bulls_bottom.className = 'bulls_bottom'
            bulls_bottom.addEventListener("click", function(e) {
                    const elementClicked = e.target;
                    // if(elementClicked.getAttribute('listener') !== 'true'){

                    // console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
                    let position = e.target.className.split('_')
                    position = position[position.length -1]

                    SetClick([position,elementClicked.parentElement.id])
                    // }

                });
            bulls_bottom.style.backgroundColor = color
            wrapper.appendChild(bulls_bottom);
            wrapper.id = nodetype


        }


        var el = Array.from(document.getElementsByClassName(nodetype));
        // console.log(el)
        el.map(e=>{
            let cur_el = e
            cur_el = findAncestor(cur_el,'mention_span')
            // console.log(cur_el.parentElement.id)
            if(cur_el.parentElement.id !== nodetype && ['predicate','source','target'].indexOf(cur_el.parentElement.id) !== -1){
                e.classList.remove(nodetype)
                if(cur_el.parentElement.id === 'source'){
                    e.classList.add('source')
                    // updateRelMentionColor('source')
                }else if(cur_el.parentElement.id === 'predicate'){
                    e.classList.add('predicate')
                    // updateRelMentionColor('predicate')
                }else if(cur_el.parentElement.id === 'target'){
                    e.classList.add('target')
                    // updateRelMentionColor('target')
                }
            }
            else if(cur_el.parentElement.id !== nodetype){
                cur_el.parentNode.insertBefore(wrapper, cur_el);
                wrapper.appendChild(cur_el);
            }

        })

    }


    useEffect(()=>{

        // qui ci entro per spostare la freccia
        if(Click){
            let position = Click[0]
            if(Click[1] === 'source'){
                if(SelectedArrow === 'sp'){
                    SetStartAnchorSP(position)
                }
                else if(SelectedArrow === 'st'){
                    SetStartAnchorST(position)
                }

            }
            else if(Click[1] === 'target'){

                if(SelectedArrow === 'st'){
                    SetEndAnchorST(position)
                }
                else if(SelectedArrow === 'pt'){
                    SetEndAnchorPT(position)
                }
            }
            else if(Click[1] === 'predicate'){
                if(SelectedArrow === 'sp'){
                    SetEndAnchorSP(position)
                }

                else if(SelectedArrow === 'pt'){
                    SetStartAnchorPT(position)
                }
            }
        }

    },[Click])

    // useEffect(()=>{
    //     if(SelectedMention){
    //         SetShowSelectMentionModal(false)
    //         let elements = Array.from(document.getElementsByClassName(SelectedMention.mentions))
    //         elements.map(e=>{
    //             let classes = Array.from(e.classList)
    //             if(classes.filter(x=>x.startsWith('mention_')).length === 1 && classes.filter(x=>x.startsWith('mention_'))[0] === SelectedMention.mentions){
    //                 let mention_cur_id = e.id
    //                 updateMentionSourcePredicateTarget(Role,SelectedMention.mentions,mention_cur_id)
    //
    //
    //             }
    //         })
    //     }
    // },[SelectedMention])
    //
    useEffect(()=>{
        let source = document.getElementById('source')
        let predicate = document.getElementById('predicate')
        let target = document.getElementById('target')
        if(!ShowReadOnlyRelation){
            if(!Source && source){
                removeAllChildren('source')
            }
            if(!Predicate && predicate){
                removeAllChildren('predicate')
            }
            if(!Target && target){
                removeAllChildren('target')
            }
        }

        // }

    },[Source,Predicate,Target])
    //
    //
    function changeRole(role=null) {




            let mention_cur_string = props.mention.mentions
            let mention_cur_id = props.id

            if (mention_cur_string.split(' ').length === 1) {
                if(role && role.toLowerCase() === 'source'){

                    SetSource(mention_cur_string)
                    updateRelMentionColor('source',mention_cur_string)
                    // updateSourceDiv()
                }else if(role && role.toLowerCase() === 'predicate'){
                    SetPredicate(mention_cur_string)
                    updateRelMentionColor('predicate',mention_cur_string)
                    // updatePredicateDiv()

                }else if(role && role.toLowerCase() === 'target'){
                    SetTarget(mention_cur_string)
                    updateRelMentionColor('target',mention_cur_string)
                    // updateTargetDiv()

                }
                // updateMentionSourcePredicateTarget(role, mention_cur_string, mention_cur_id)

            } else {
                let mentions = MentionsList.filter(m => mention_cur_string.split(' ').indexOf(m.mentions) !== -1)
                SetMentions(mentions)
                SetRole(role)
                SetSelectedMention(false)
                SetShowSelectMentionModal(true)


        }
    // }
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




    const handleClose = () => {
        setContextMenu(null);
    };

    function handleChangeRadio(e){
        e.preventDefault()
        e.stopPropagation()
        let v = e.target.value
        SetValue(parseInt(v))

        // let selected = MentionsInvolved[v]
        //
        // SetSetSelectedMention(selected)
    }

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
        <div className={'mentionpart_rel'}>
            {ShowSelectMentionModal &&

            <Dialog
                open={ShowSelectMentionModal}
                onClose={()=>{SetShowSelectMentionModal(false)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'sm'}
                fullWidth={'sm'}
            >

                {/*<div style={{padding:'2%',width:'500px'}}>*/}

                <div style={{padding:'3%'}}>
                    <DialogTitle style={{cursor: 'move'}} >
                        Select the mention
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Select the mention you want to associate a concept to
                            <div>
                                {Mentions.map((m,i)=><div>
                                    <Radio
                                        checked={value === i}
                                        onClick={handleChangeRadio}
                                        value={i}
                                        aria-label={m.mention_text}
                                    />{' '}{m.mention_text}
                                </div>)}
                            </div>
                        </DialogContentText>

                    </DialogContent>
                </div>

                <DialogActions>
                    <Button autoFocus onClick={()=>{SetShowSelectMentionModal(false)}}>
                        Cancel
                    </Button>
                    <Button onClick={()=>SetSelectedMention(Mentions[value])}>Confirm</Button>
                </DialogActions>
            </Dialog>
            }

            {View === 1 && props.concepts.length > 0 && props.mention.mentions !== Source && props.mention.mentions !== Predicate && props.mention.mentions !== Target && <Concept role={'neutro'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}
            {View === 1 && props.concepts.length > 0 && props.mention.mentions === Source && <Concept role={'Source'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}
            {View === 1 && props.concepts.length > 0 && props.mention.mentions === Predicate && <Concept role={'Predicate'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}
            {View === 1 && props.concepts.length > 0 && props.mention.mentions === Target && <Concept role={'Target'} concepts={ConceptsList.filter(x=>(x.start === props.mention.start && x.stop === props.mention.stop))} mention={props.mention} mention_id = {props.id} />}

            { <div  onContextMenu={handleContextMenu} >


                <div id={props.id} ref={inputEl}

                     onClick={(e)=>{
                         if(!ShowReadOnlyRelation && CurAnnotator === Username) {

                             e.preventDefault();
                             e.stopPropagation();

                             // if(props.mention.mentions !== Source && props.mention.mentions !== Predicate && props.mention.mentions !== Target){
                             //
                             // }

                             SetSPArrow(false)
                             SetSTArrow(false)
                             SetPTArrow(false)
                             if(!Source && !Predicate && !Target){
                                 removeAllChildren('source')
                                 changeRole('Source');
                                 // console.log('SOURCE')
                             }
                             else if(Source && Predicate && Target){
                                 if(props.mention.mentions === Source){
                                     removeAllChildren('source')
                                     SetSource(false)
                                     SetSourceText(false)
                                     SetSourceConcepts(false)
                                 }else if(props.mention.mentions === Predicate){
                                     removeAllChildren('predicate')
                                     SetPredicate(false)
                                     SetPredicateText(false)
                                     SetPredicateConcepts(false)
                                 }else if(props.mention.mentions === Target){
                                     removeAllChildren('target')
                                     SetTarget(false)
                                     SetTargetText(false)
                                     SetTargetConcepts(false)
                                 }else{
                                     removeAllChildren('source')
                                     changeRole('Source');
                                     // console.log('SOURCE')
                                 }

                             }
                             else if(Source && !Predicate && !Target){
                                 // console.log('predicate')
                                 if(props.mention.mentions === Source){
                                     removeAllChildren('source')
                                     SetSource(false)
                                     SetSourceText(false)
                                     SetSourceConcepts(false)
                                 }else{
                                     removeAllChildren('predicate')
                                     changeRole('Predicate');
                                     // console.log('SOURCE')
                                 }

                             }
                             else if(!Source && Predicate && !Target){
                                 if(props.mention.mentions === Predicate){
                                     removeAllChildren('predicate')
                                     SetPredicate(false)
                                     SetPredicateText(false)
                                     SetPredicateConcepts(false)
                                 }else{
                                     removeAllChildren('source')
                                     changeRole('Source');
                                     // console.log('SOURCE')
                                 }
                             }
                             else if(!Source && !Predicate && Target){
                                 if(props.mention.mentions === Target){
                                     removeAllChildren('target')
                                     SetTarget(false)
                                     SetTargetText(false)
                                     SetTargetConcepts(false)
                                 }else{
                                     removeAllChildren('source')
                                     changeRole('Source');
                                     // console.log('SOURCE')
                                 }

                             }
                             else if(!Source && Predicate && Target){
                                 if(props.mention.mentions === Target){
                                     removeAllChildren('target')
                                     SetTarget(false)
                                 }else if(props.mention.mentions === Predicate){
                                     removeAllChildren('predicate')
                                     SetPredicate(false)

                                     SetPredicateText(false)
                                     SetPredicateConcepts(false)
                                 }
                                 else{
                                     removeAllChildren('source')
                                     changeRole('Source');
                                     // console.log('SOURCE')
                                 }

                             }
                             else if(Source && !Predicate && Target){
                                 if(props.mention.mentions === Target){
                                     removeAllChildren('target')
                                     SetTarget(false)
                                     SetTargetText(false)
                                     SetTargetConcepts(false)
                                 }else if(props.mention.mentions === Source){
                                     removeAllChildren('source')
                                     SetSource(false)
                                     SetSourceText(false)
                                     SetSourceConcepts(false)
                                 }
                                 else{
                                     removeAllChildren('predicate')
                                     changeRole('Predicate');
                                 }
                                 // console.log('predicate')
                             }
                             else if(Source && Predicate && !Target){
                                 // console.log('target')
                                 if(props.mention.mentions === Predicate){
                                     removeAllChildren('predicate')
                                     SetPredicate(false)
                                     SetPredicateText(false)
                                     SetPredicateConcepts(false)
                                 }else if(props.mention.mentions === Source){
                                     removeAllChildren('source')
                                     SetSource(false)
                                     SetSourceText(false)
                                     SetSourceConcepts(false)
                                 }
                                 else{
                                     removeAllChildren('target')
                                     changeRole('Target');
                                 }

                             }


                             // changeRole()
                             DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                         }
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


                    {/*{!Source && SourceConcepts && (Predicate === props.mentions || Target === props.mentions) && <div className={'cover'}>ciao</div>}*/}
                    {/*{!Predicate && PredicateConcepts && (Source === props.mentions || Target === props.mentions) && <div className={'cover'}>ciao</div>}*/}
                    {/*{!Target && TargetConcepts && (Source === props.mentions || Predicate === props.mentions) && <div className={'cover'}>ciao</div>}*/}




                </div>

                {<StyledMenu
                    open={contextMenu !== null && ShowReadOnlyRelation === false && InARel && CurAnnotator === Username}
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

                            e.preventDefault()
                            e.stopPropagation()
                            setContextMenu(null);
                            removeAllChildren('source')
                            SetSPArrow(false)
                            SetSTArrow(false)
                            SetPTArrow(false)
                            if(props.mention.mentions === Source){
                                removeAllChildren('source')
                                SetSourceText(false)
                                SetSourceConcepts(false)
                                SetSource(false)

                            }else if(props.mention.mentions === Predicate){
                                removeAllChildren('predicate')
                                SetPredicateText(false)
                                SetPredicateConcepts(false)
                                SetPredicate(false)

                                changeRole('Source');
                            }
                            else if(props.mention.mentions === Target){
                                removeAllChildren('target')
                                SetTargetText(false)
                                SetTargetConcepts(false)
                                SetTarget(false)

                                changeRole('Source');

                            }
                            else{
                                changeRole('Source');

                            }

                            DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)

                    }}>
                        <ListItemIcon >
                            {Source === props.mention.mentions ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Subject
                    </MenuItem>

                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        if(!ShowReadOnlyRelation) {

                            e.preventDefault()
                            e.stopPropagation()
                            setContextMenu(null);
                            removeAllChildren('predicate')

                            if(props.mention.mentions === Predicate){
                                removeAllChildren('predicate')
                                SetPredicateText(false)
                                SetPredicateConcepts(false)
                                SetPredicate(false)



                            }else if(props.mention.mentions === Source){
                                removeAllChildren('source')
                                SetSourceConcepts(false)
                                SetSourceText(false)
                                SetSource(false)



                                changeRole('Predicate');
                            }
                            else if(props.mention.mentions === Target){
                                removeAllChildren('target')
                                SetTargetText(false)
                                SetTargetConcepts(false)
                                SetTarget(false)

                                changeRole('Predicate');

                            }
                            else{
                                changeRole('Predicate');

                            }

                            DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv);
                        }

                    }}>
                        <ListItemIcon >
                            {Predicate === props.mention.mentions ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Predicate
                    </MenuItem>

                    <MenuItem autoFocus ={false} onClick={(e)=>{
                        if(!ShowReadOnlyRelation) {

                            e.preventDefault()
                            e.stopPropagation()
                            setContextMenu(null);
                            removeAllChildren('target')

                            if(props.mention.mentions === Target){
                                removeAllChildren('target')
                                SetTargetText(false)
                                SetTargetConcepts(false)
                                SetTarget(false)

                            }else if(props.mention.mentions === Source){
                                SetSourceText(false)
                                SetSourceConcepts(false)
                                SetSource(false)

                                removeAllChildren('source')

                                changeRole('Target');
                            }
                            else if(props.mention.mentions === Predicate){
                                removeAllChildren('target')
                                SetPredicateText(false)
                                SetPredicateConcepts(false)
                                SetPredicate(false)

                                changeRole('Target');

                            }
                            else{
                                changeRole('Target');

                            }

                            DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                        }
                    }}>
                        <ListItemIcon >
                            {Target === props.mention.mentions ? <CheckIcon fontSize="small" /> : <></>}
                        </ListItemIcon>
                        Object
                    </MenuItem>

                    <Divider />

                    <MenuItem style={{color:'#d00000'}} autoFocus ={false} onClick={(e)=>{
                        if(!ShowReadOnlyRelation) {
                            e.preventDefault()
                            e.stopPropagation()
                            setContextMenu(null);
                            // console.log('DELETE')
                            if (props.mention.mentions === Source){
                                removeAllChildren('source')
                                SetSourceText(false)
                                SetSourceConcepts(false)
                                SetSource(false)

                            }else if (props.mention.mentions === Predicate){
                                removeAllChildren('predicate')
                                SetSourceText(false)
                                SetSourceConcepts(false)
                                SetPredicate(false)

                            }else if (props.mention.mentions === Target){
                                removeAllChildren('target')
                                SetTargetText(false)
                                SetTargetConcepts(false)
                                SetTarget(false)

                            }
                            DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                        }

                    }}>
                        <ListItemIcon >
                            <DeleteIcon color='error' fontSize="small" />
                        </ListItemIcon>
                        Delete

                    </MenuItem>

                </StyledMenu>}

            </div>}


        </div>
    )
}