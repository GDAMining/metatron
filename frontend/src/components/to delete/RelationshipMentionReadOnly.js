import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
// import Draggable from 'react-draggable';

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
import {ArrowContext} from "../Document/DocumentFinal_2";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import DraggableModal from "../Annotation/concepts/DraggableConceptModal";
import {
    DeleteRange,
    updateMentionColor,
    updateRelMentionColor,
    waitForElm
} from "../HelperFunctions/HelperFunctions";
import DeleteMentionModal from "../Annotation/mentions/modals/DeleteMentionModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import {type} from "@testing-library/user-event/dist/type";
import Concept from "../Annotation/concepts/Concept";
import ChipRel from "../Annotation/relationship/ChipRelationship";
import ChooseMentionModal from "../Annotation/mentions/modals/ChooseMentionModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Radio from "@mui/material/Radio";
import DialogActions from "@mui/material/DialogActions";
import {ConceptContext} from "../../BaseIndex";

export default function RelMentionReadOnly(props){
    const { view,concepts,inarel,document_id,predicate,source,target,currentdiv,firstsel,curmention,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const { startanchorsp,startanchorpt,endanchorsp,endanchorpt,endanchorst,selectedarrow,startanchorst } = useContext(ArrowContext);
    const { sparrow,ptarrow,starrow,targetconcepts,predicatetext,predicateconcepts } = useContext(ConceptContext);

    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [DocumentID,SetDocumentID] = document_id
    const [Click,SetClick] = useState(false)
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions
    const [EndAnchorST,SetEndAnchorST] = endanchorst
    const [StartAnchorST,SetStartAnchorST] = startanchorst
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
    const [EndAnchorSP,SetEndAnchorSP] = endanchorsp
    const [StartAnchorPT,SetStartAnchorPT] = startanchorpt
    const [EndAnchorPT,SetEndAnchorPT] = endanchorpt
    const [Mentions,SetMentions] = useState(false)
    const [StartAnchorSP,SetStartAnchorSP] = startanchorsp
    const [ShowSelectMentionModal,SetShowSelectMentionModal] = useState(false)
    const [value,SetValue] = useState(0)

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




    // function updateClasses(mention){
    //     updateClassesStandard(mention)
    //     mention.classList.remove("source");
    //     mention.classList.remove("predicate");
    //     mention.classList.remove("target");
    //     let color_0 = 'rgba(65,105,225,1)'
    //     mention.style.color = color_0
    //     mention.style.backgroundColor = color_0.replace('1)','0.1)')
    //
    //
    //
    // }
    // function RemoveClasses(mention){
    //     updateClassesStandard(mention)
    //     mention.classList.remove("source");
    //     mention.classList.remove("predicate");
    //     mention.classList.remove("target");
    //     let color_0 = 'rgba(65,105,225,1)'
    //     mention.style.color = color_0
    //     mention.style.backgroundColor = color_0.replace('1)','0.1)')
    // }






    useEffect(()=>{


        var mention = props.mention

        mention['id'] = props.id
        console.log('curmentoon',props.mention)
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

        waitForElm('#'+props.id).then((mention) => {
            if(Source !== props.mention.mentions){
                updateClassesStandard(mention)

            }
            mention.style.color = color_0
            mention.style.backgroundColor = color_0.replace('1)', '0.1)')

            let found_source = false

            if(Source === props.mention.mentions) {
                found_source = true

                mention.classList.add('source')
                if (document.getElementById('source') === null) {
                    var wrapper = document.createElement('div');
                    wrapper.id = 'source'
                    addChild('source')

                    let els = document.querySelectorAll('div[class^="bulls"]');
                    console.log('els',els)
                }

            }

            // questo è per colorare anche le overlapping ALL'INIZIO, APPENA PASSO DA NOT INAREL A INAREL
            props.mention.mentions.split(' ').map(m=> {

                if (m === Source) {
                    found_source = true
                    mention.classList.add('source')

                    addChild('source')


                }
            })
            updateClassesStandard(mention)
            if(!found_source){
                updateClassesStandard(document.getElementById(props.mention.id))

            }

        })




    },[Source])





    function removeAllChildren(nodetype){
        let target = document.getElementById(nodetype)
        // let target ='';
        let sources = Array.from(document.getElementsByClassName(nodetype))
        if(target !== null){
            let els =Array.from(document.querySelectorAll('div[class^="bulls"]'))
            sources.map(el=>{
                el.classList.remove(nodetype)
                console.log('childre',target.children)


            })

            if(target.childNodes){
                console.log('node',target.childNodes)
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

        console.log('cls',cls)
        while(el.className !== cls){
            console.log('el',el.id)
            el = el.parentElement
        }
        return el;
    }

    function update_bulls(nodetype){

        // mette a posto bulls su overlapping mentions
        var wrapper = document.getElementById(nodetype)
        if(wrapper){
            let bulls = Array.from(wrapper.children)
            let bulls_list = []
            bulls.map(x=>{
                if(x.className.startsWith('bull')){
                    wrapper.removeChild(x)
                }
            })

            let color = ''
            if(nodetype.toLowerCase() === 'source'){
                color = 'rgb(214, 28, 78)'

            }else if(nodetype.toLowerCase() === 'target'){
                color = 'rgb(241, 136, 103)'

            }else if(nodetype.toLowerCase() === 'predicate'){
                color = 'rgb(55, 125, 113)'

            }
            var bulls_left = document.createElement('div');
            bulls_left.className = 'bulls_left'
            bulls_left.style.backgroundColor = color
            wrapper.appendChild(bulls_left);
            var bulls_right = document.createElement('div');
            bulls_right.className = 'bulls_right'
            bulls_right.style.backgroundColor =  color
            wrapper.appendChild(bulls_right);
            var bulls_top = document.createElement('div');
            bulls_top.className = 'bulls_top'
            bulls_top.style.backgroundColor = color
            wrapper.appendChild(bulls_top);
            var bulls_bottom = document.createElement('div');
            bulls_bottom.className = 'bulls_bottom'
            bulls_bottom.style.backgroundColor = color
            wrapper.appendChild(bulls_bottom);



            var elements = document.querySelectorAll('div[class^="bulls"]')
            elements.forEach(element => {
                element.addEventListener("click", function(e) {
                    const elementClicked = e.target;
                    // if(elementClicked.getAttribute('listener') !== 'true'){

                    console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
                    let position = e.target.className.split('_')
                    position = position[position.length -1]

                    SetClick([position,elementClicked.parentElement.id])
                    // }

                });
            });
        }

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
            var bulls_left = document.createElement('div');
            bulls_left.addEventListener("click", function(e) {
                const elementClicked = e.target;
                // if(elementClicked.getAttribute('listener') !== 'true'){

                console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
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

                console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
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

                console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
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

                    console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
                    let position = e.target.className.split('_')
                    position = position[position.length -1]

                    SetClick([position,elementClicked.parentElement.id])
                    // }

                });
            bulls_bottom.style.backgroundColor = color
            wrapper.appendChild(bulls_bottom);
            wrapper.id = nodetype


        }
        // var elements = document.querySelectorAll('div[class^="bulls"]')
        // elements.forEach(element => {
        //     element.addEventListener("click", function(e) {
        //         const elementClicked = e.target;
        //         // if(elementClicked.getAttribute('listener') !== 'true'){
        //
        //         console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
        //         let position = e.target.className.split('_')
        //         position = position[position.length -1]
        //
        //         SetClick([position,elementClicked.parentElement.id])
        //         // }
        //
        //     });
        // });

        var el = Array.from(document.getElementsByClassName(nodetype));
        console.log(el)
        el.map(e=>{
            let cur_el = e
            let cloned = cur_el.cloneNode(true)
            cur_el = findAncestor(cur_el,'mention_span')
            let removed = false
            console.log(cur_el.parentElement.id)
            if(cur_el.parentElement.id !== nodetype && ['predicate','source','target'].indexOf(cur_el.parentElement.id) !== -1){
                // wrapper.appendChild(cloned);
                // let nonno = cur_el.parentElement.parentElement
                // nonno.insertBefore(wrapper, cur_el);
                // cur_el.parentElement.removeChild(cur_el)
                e.classList.remove(nodetype)
                if(cur_el.parentElement.id === 'source'){
                    e.classList.add('source')
                    updateRelMentionColor('source')
                }else if(cur_el.parentElement.id === 'predicate'){
                    e.classList.add('predicate')
                    updateRelMentionColor('predicate')
                }else if(cur_el.parentElement.id === 'target'){
                    e.classList.add('target')
                    updateRelMentionColor('target')
                }
            }
            else if(cur_el.parentElement.id !== nodetype){
                cur_el.parentNode.insertBefore(wrapper, cur_el);
                wrapper.appendChild(cur_el);
            }

        })



    }
    useEffect(()=>{
        if(Click){
            console.log('eccomi clickbut')
            console.log('predicate',Predicate)
            console.log('predicate',SelectedArrow)
            // const elementClicked = e.target;
            // // if(elementClicked.getAttribute('listener') !== 'true'){
            //
            // console.log(e.target.class,e.target.className,e.target.classList,SelectedArrow,Source,Target,Predicate)
            // let position = e.target.className.split('_')
            // position = position[position.length -1]
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



    function updateMentionSourcePredicateTarget(role,mention_cur_string,mention_cur_id){

        let mention = document.getElementById(mention_cur_id)
        SetSTArrow(false)
        SetPTArrow(false)
        SetSPArrow(false)

        if(Source === mention_cur_string || Predicate === mention_cur_string || Target === mention_cur_string){

            // CASO1 : ERA GIà SOURCE E STO CAMBIANDO
            if(mention_cur_string === Source){
                mention.classList.remove('source')
                // se role è null significa che ho cliccato dove già era source, per questo viene eliminato
                // se ho role == false significa che ho premuto delete
                if(role === null || !role || role === 'Source'){
                    SetSource(false)
                    // SetSourceId(false)
                    updateRelMentionColor(false)
                    removeAllChildren('source')
                    // addChild('predicate')
                    // addChild('target')
                }else{
                    SetSource(false)
                    // SetSourceId(false)
                    removeAllChildren('source')
                    // CAMBIO A TARGET
                    if(role === 'Target'){
                        removeAllChildren('target')
                        mention.classList.add('target')
                        SetTarget(mention_cur_string)
                        // SetTargetId(mention_cur_id)
                    }
                    // CAMBIO A TARGET
                    else if(role === 'Predicate'){
                        removeAllChildren('predicate')
                        mention.classList.add('predicate')

                        SetPredicate(mention_cur_string)
                        // SetPredicateId(mention_cur_id)
                    }
                    updateRelMentionColor(role.toLowerCase(),mention_cur_string)
                    // addChild(role.toLowerCase())
                }


            }
            // CASO 2 : ERA GIà PREDICATE E STO CAMBIANDO
            else if(mention_cur_string === Predicate){
                mention.classList.remove('predicate')
                // se role è null significa che ho cliccato dove già era source, per questo viene eliminato
                // se ho role == false significa che ho premuto delete
                if(role === null || !role || role === 'Predicate'){
                    SetPredicate(false)
                    // SetPredicateId(false)
                    updateRelMentionColor(false)
                    removeAllChildren('predicate')
                }else{
                    SetPredicate(false)
                    // SetPredicateId(false)
                    removeAllChildren('predicate')
                    // CAMBIO A TARGET
                    if(role === 'Target'){
                        removeAllChildren('target')
                        mention.classList.add('target')

                        SetTarget(mention_cur_string)
                        // SetTargetId(mention_cur_id)
                    }
                    // CAMBIO A source
                    else if(role === 'Source'){
                        removeAllChildren('source')
                        mention.classList.add('source')

                        SetSource(mention_cur_string)
                        // SetSourceId(mention_cur_id)
                    }
                    updateRelMentionColor(role.toLowerCase(),mention_cur_string)
                    addChild(role.toLowerCase())
                }


            }
            else if(mention_cur_string === Target){
                mention.classList.remove('target')
                // se role è null significa che ho cliccato dove già era source, per questo viene eliminato
                // se ho role == false significa che ho premuto delete
                if(role === null || !role || role === 'Target'){
                    SetTarget(false)
                    // SetTargetId(false)
                    updateRelMentionColor(false)
                    removeAllChildren('target')
                    // addChild('source')
                    // addChild('predicate')
                }else{
                    SetTarget(false)
                    // SetTargetId(false)
                    removeAllChildren('target')
                    // CAMBIO A TARGET
                    if(role === 'Predicate'){
                        removeAllChildren('predicate')
                        mention.classList.add('predicate')
                        SetPredicate(mention_cur_string)
                        // SetPredicateId(mention_cur_id)
                    }
                    // CAMBIO A TARGET
                    else if(role === 'Source'){
                        removeAllChildren('source')
                        mention.classList.add('source')
                        SetSource(mention_cur_string)
                        // SetSourceId(mention_cur_id)
                    }
                    updateRelMentionColor(role.toLowerCase(),mention_cur_string)
                    addChild(role.toLowerCase())
                }


            }
        }else {
            if (role === null) {
                if (!Source || (Predicate && Target && Source) ) {
                    removeAllChildren('source')
                    mention.classList.add('source')
                    SetSource(mention_cur_string)
                    // SetSourceId(mention_cur_id)
                    updateRelMentionColor('source',mention_cur_string)
                    addChild('source')


                } else if ((!Predicate && Target) || (!Predicate && !Target) ) {
                    removeAllChildren('predicate')
                    mention.classList.add('predicate')
                    SetPredicate(mention_cur_string)
                    // SetPredicateId(mention_cur_id)
                    updateRelMentionColor('predicate',mention_cur_string)
                    addChild('predicate')

                } else if ((Predicate && !Target) ) {
                    removeAllChildren('target')
                    mention.classList.add('target')
                    SetTarget(mention_cur_string)
                    // SetTargetId(mention_cur_id)
                    updateRelMentionColor('target',mention_cur_string)
                    addChild('target')

                }
            }else if (role){
                if (role === 'Source' ) {
                    SetSTArrow(false)
                    SetSPArrow(false)
                    SetPTArrow(false)
                    removeAllChildren('source')
                    mention.classList.add('source')
                    SetSource(mention_cur_string)
                    // SetSourceId(mention_cur_id)
                    updateRelMentionColor('source',mention_cur_string)
                    addChild('source')



                } else if (role === 'Predicate' ) {
                    SetPTArrow(false)
                    SetSPArrow(false)
                    SetSTArrow(false)
                    removeAllChildren('predicate')
                    mention.classList.add('predicate')
                    SetPredicate(mention_cur_string)
                    // SetPredicateId(mention_cur_id)
                    updateRelMentionColor('predicate',mention_cur_string)
                    addChild('predicate')

                } else if (role === 'Target' ) {
                    SetSTArrow(false)
                    SetPTArrow(false)
                    SetSPArrow(false)
                    removeAllChildren('target')
                    mention.classList.add('target')
                    SetTarget(mention_cur_string)
                    // SetTargetId(mention_cur_id)
                    updateRelMentionColor('target',mention_cur_string)
                    addChild('target')

                }
            }




        }
    }

    useEffect(()=>{
        if(SelectedMention){
            SetShowSelectMentionModal(false)
            let elements = Array.from(document.getElementsByClassName(SelectedMention.mentions))
            elements.map(e=>{
                let classes = Array.from(e.classList)
                if(classes.filter(x=>x.startsWith('mention_')).length === 1 && classes.filter(x=>x.startsWith('mention_'))[0] === SelectedMention.mentions){
                    let mention_cur_id = e.id
                    updateMentionSourcePredicateTarget(Role,SelectedMention.mentions,mention_cur_id)


                }
            })
        }
    },[SelectedMention])

    useEffect(()=>{
        let source = document.getElementById('source')
        let predicate = document.getElementById('predicate')
        let target = document.getElementById('target')
        if(!Source && source){
            removeAllChildren('source')
        }
        if(!Predicate && predicate){
            removeAllChildren('predicate')
        }
        if(!Target && target){
            removeAllChildren('target')
        }
    },[Source,Predicate,Target])


    function changeRole(e,role=null) {
        e.preventDefault();
        e.stopPropagation();
        let mention_cur_string = props.mention.mentions
        let mention_cur_id = props.id

        if(mention_cur_string.split(' ').length === 1){
            updateMentionSourcePredicateTarget(role,mention_cur_string,mention_cur_id)

        }

        else{
            let found_spt = []
            let found_mentions = ''
            let elements =  []
            let found_elms = {}
             let mentions = MentionsList.filter(m=>mention_cur_string.split(' ').indexOf(m.mentions) !== -1)
            SetMentions(mentions)
            SetRole(role)
            SetSelectedMention(false)
            SetShowSelectMentionModal(true)


        }
        // CAOS 1: CLICCO E BASTA
        // SOTTOCASO 1: CLICCO E NON AVEVA RUOLO


        // SOTTOCAOS 2: CLICCO E AVEVA LO STESSO RUOLO
        // SOTTOCASO 3: CLICCO E AVEVA UN RUOLO DIVERSO


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

            {<div  onContextMenu={handleContextMenu} >


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
                        if(props.mention.mentions === Source || props.mention.mentions === Predicate || props.mention.mentions === Target){
                            changeRole(e,false);
                        }
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