import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link';
import React, {useState, useEffect, useContext, createContext, useRef, useTransition} from "react";
import Badge from 'react-bootstrap/Badge'
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import './document.css'
import {useXarrow, Xwrapper} from 'react-xarrows';
import Draggable from 'react-draggable';
import {CircularProgress, linearProgressClasses} from "@mui/material";
import {AppContext} from "../../App";
import {
    clearConceptsFromBorder,
    clearMentionsFromBorder,
    DeleteRange,
    waitForElm
} from "../HelperFunctions/HelperFunctions";
import DocumentTable from "./DocumentTable";
import Mention from "../Annotation/mentions/Mention";
import Association from "../Annotation/Association";
import NoMention from "../Annotation/NoMention";
import Chip from "@mui/material/Chip";
import ParagraphDoc from "./DocumentContent/ParagraphDoc";
import RelMention from "../Annotation/mentions/RelationshipMention";
import Xarrow from "react-xarrows";
import ChooseMentionModal from "../Annotation/mentions/modals/ChooseMentionModal";
import ArrowLabelComponent from "../Annotation/relationship/ArrowLabelComponent";
import SelectArrowComponent from "../Annotation/relationship/SelectArrowComponent";
import {ConceptContext} from "../../BaseIndex";
import OverlayConceptComponent from "../Annotation/relationship/OverlayConceptComponent";

export const ArrowContext = createContext('')

const DraggableBoxPredicate = ({id}) => {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div style={boxStyle} id={id} className={'cover-right'}><OverlayConceptComponent type={'predicate'} /></div>

        </Draggable>
    );
};
const DraggableBoxSource = ({id}) => {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div style={boxStyle} id={id} className={'cover-left'}><OverlayConceptComponent type={'source'} /></div>

        </Draggable>
    );
};
const DraggableBoxTarget = ({id}) => {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div style={boxStyle} id={id} className={'cover-right-more'}><OverlayConceptComponent type={'target'} /></div>

        </Draggable>
    );
};
const boxStyle = {padding: '5px'};

export default function Document(props){
    const { concepts,areascolors,inarel,autoannotation,saving,loadingann,annotatedlabels,username,modifyrel,curannotator,sourceconcepts,predicateconcepts,targetconcepts,predicatetext,sourcetext,targettext,relationshipslist,predicate,source,target,documentdescription,currentdiv,firstsel,mentions_splitted,secondsel,document_id,relationship,mentions,startrange,endrange,fields,fieldsToAnn } = useContext(AppContext);
    const { sparrow,ptarrow,starrow,starrowfloat,ptarrowfloat,sparrowfloat } = useContext(ConceptContext);
    const [LoadingNewAnn, SetLoadingNewAnn] = loadingann
    const [Modify,SetModify] = modifyrel
    const [ShowConceptModal,SetShowConceptModal] = useState(false)
    const [RelationshipsList,SetRelationshipsList] = relationshipslist
    const [StartAnchorSP,SetStartAnchorSP] = useState("auto")
    const [StartAnchorPT,SetStartAnchorPT] = useState("auto")
    const [StartAnchorST,SetStartAnchorST] = useState("auto")
    const [EndAnchorSP,SetEndAnchorSP] = useState("auto")
    const [EndAnchorST,SetEndAnchorST] = useState("auto")
    const [EndAnchorPT,SetEndAnchorPT] = useState("auto")

    const [ChangeSTOff,SetChangeSTOff] = useState(false)
    const [ChangePTOff,SetChangePTOff] = useState(false)
    const [ChangeSPOff,SetChangeSPOff] = useState(false)
    const [Username,SetUsername] = username
    const [AutoAnnotate,SetAutoAnnotate] = autoannotation
    const [ColorArrowSP,SetColorArrowSP] = useState('#495057')
    const [ColorArrowPT,SetColorArrowPT] = useState('#495057')
    const [ColorArrowST,SetColorArrowST] = useState('#495057')
    const [WidthArrowSP,SetWidthArrowSP] = useState('1.8')
    const [WidthArrowST,SetWidthArrowST] = useState('1.8')
    const [WidthArrowPT,SetWidthArrowPT] = useState('1.8')
    const [SelectedArrow,SetSelectedArrow] = useState(false)

    const [OverlappingSP,SetOverlappingSP] = useState(false)
    const [OverlappingST,SetOverlappingST] = useState(false)
    const [OverlappingPT,SetOverlappingPT] = useState(false)

    const [SourceElem, SetSourceElem] = useState(false)
    const [PredicateElem, SetPredicateElem] = useState(false)
    const [TargetElem, SetTargetElem] = useState(false)
    const [LoadingDoc, SetLoadingDoc] = useState(false)
    const [ParentSecondSelected,SetParentSecondSelected] = useState(false)
    const [ParentFirstSelected,SetParentFirstSelected] = useState(false)
    const [DocumentID,SetDocumentID] = document_id
    const [MentionsList,SetMentionsList] = mentions
    const [MentionsListSplitted,SetMentionsListSplitted] = mentions_splitted
    const [ConceptsList,SetConceptsList] = concepts
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [InARel,SetInARel] = inarel
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [Source,SetSource] = source;
    const [SourceConcepts,SetSourceConcepts] = sourceconcepts
    const [PredicateConcepts,SetPredicateConcepts] = predicateconcepts
    const [TargetConcepts,SetTargetConcepts] = targetconcepts
    const [SourceText,SetSourceText] = sourcetext
    const [PredicateText,SetPredicateText] = predicatetext
    const [TargetText,SetTargetText] =targettext
    const [Target,SetTarget] = target;
    const [Predicate,SetPredicate] = predicate;
    const [DocumentDesc,SetDocumentDesc] = documentdescription
    const [DocumentDescEmpty,SetDocumentDescEmpty] = useState(false)
    const [Saving,SetSaving] = saving
    // const [Interlines,SetInterlines] = linea
    // const [FontSize,SetFontSize] = fontsize
    const [FontAndInter,SetFontAndInter] = useState(true)
    const [StartContainer,SetStartContainer] = useState(false)
    const [TextSelected,SetTextSelected] = useState(false)
    const [UpdateMentions,SeUpdateMentions] = useState(false)
    const [ClickedOnText,SetClickedOnText] = useState(false)
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn
    const [Fields,SetFields] = fields
    const [Relationship,SetRelationship] = relationship
    const [AreasColors,SetAreasColors] = areascolors
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [AnnotatedLabels, SetAnnotatedLabels] = annotatedlabels

    const [SPArrow,SetSPArrow] = sparrow
    const [PTArrow,SetPTArrow] = ptarrow
    const [STArrow,SetSTArrow] = starrow

    const [STArrowFloat,SetSTArrowFloat] = starrowfloat
    const [SPArrowFloat,SetSPArrowFloat] = ptarrowfloat
    const [PTArrowFloat,SetPTArrowFloat] = ptarrowfloat

    const [LoadMen,SetLoadMen] = useState(false)
    const [LoadRel,SetLoadRel] = useState(false)
    const [LoadConc,SetLoadConc] = useState(false)
    const [LoadLab,SetLoadLab] = useState(false)

    let font = window.localStorage.getItem('fontsize')
    let inter = window.localStorage.getItem('interlines')
    if(font === null){
        window.localStorage.setItem('fontsize','1.0rem')
        font = '1.0rem'
    }else if (font === '1.0'){
        window.localStorage.setItem('fontsize',font +'rem')
    }
    if(inter === null){
        window.localStorage.setItem('interlines','2')
        inter = '2'
    }

    // useEffect(()=>{
    //     if(LoadLab && LoadConc && LoadMen && LoadRel){
    //         SetLoadingNewAnn(false)
    //         SetLoadMen(false)
    //         SetLoadConc(false)
    //         SetLoadRel(false)
    //         SetLoadLab(false)
    //     }
    // },[LoadRel,LoadLab,LoadMen,LoadConc])

    useEffect(()=>{
        SetPTArrow(false)
        SetSPArrow(false)
        SetSTArrow(false)
        SetPTArrowFloat(false)
        SetSPArrowFloat(false)
        SetSTArrowFloat(false)
    },[Source,Predicate,Target])

    useEffect(()=>{
        // if(!PTArrow && !STArrow && !SPArrow)
        if(Source && Predicate && Target){

            SetPTArrow(true)
            SetSPArrow(true)
            SetSTArrow(false)

        }

        else if(Source && Target && !Predicate){
            SetPTArrow(false)
            SetSPArrow(false)
            SetSTArrow(true)

        }
        else if(Source && Predicate && !Target){
            SetPTArrow(false)
            SetSPArrow(true)
            SetSTArrow(false)

        }
        else if(!Source && Predicate && Target){
            SetPTArrow(true)
            SetSPArrow(false)
            SetSTArrow(false)

        }
        if(!Source || !Predicate){
            SetSPArrow(false)
        }
        if(!Source || !Target){
            SetSTArrow(false)
        }
        if(!Predicate || !Target){
            SetPTArrow(false)
        }
    },[Source,Predicate,Target])




    useEffect(()=>{
        if(ConceptsList){
            let areas = {}
            ConceptsList.map(c=>{
                if(Object.keys(areas).indexOf(c.area) === -1){
                    let color = window.localStorage.getItem(c['concept'].area)
                    if(color === null){
                        color = 'rgba(65,105,225,1)'
                    }
                    areas[c['concept'].area] = color
                }
            })
            SetAreasColors(areas)
        }

    },[ConceptsList])

    useEffect(()=>{
        if(LoadingNewAnn && MentionsList && ConceptsList && AnnotatedLabels){
            SetLoadingNewAnn(false)
        }
    },[MentionsList,ConceptsList,AnnotatedLabels])

    // useEffect(()=>{
    //     if(LoadingNewAnn && MentionsList && ConceptsList && RelationshipsList && AnnotatedLabels){
    //         SetLoadingNewAnn(false)
    //     }
    // },[MentionsList,ConceptsList,RelationshipsList,AnnotatedLabels])


    useEffect(()=>{
        if((DocumentID && CurAnnotator) || LoadingNewAnn){
            axios.get('get_document_content',{params:{document_id:DocumentID,user:CurAnnotator}})
                .then(response=>{

                    // console.log('response',response.data)
                    SetDocumentDesc(response.data['mentions'])
                    console.log('keys',response.data['mentions'])
                    console.log('keys',Object.keys(response.data['mentions']))
                    SetDocumentDescEmpty(response.data['empty'])
                })
            // GET FIELDS OF A DOCUMENT
            axios.get("get_fields").then(response => {
                var fields = response.data['fields']
                var fields_to_ann = response.data['fields_to_ann']
                if(FieldsToAnn === []){
                    SetFieldsToAnn(fields)
                }
                else{
                    SetFieldsToAnn(fields_to_ann)
                }
                if(!Fields|| Fields.length === 0 || (Fields.length > 0 && Fields.some(r=>fields.indexOf(r) === -1))){
                    SetFields(fields)

                }

            })


            // GET MENTIONS OF A DOCUMENT
            async function fetchMentions(){
                const response = await axios.get('mentions',{params:{user:CurAnnotator}});
                // console.log('request',response)
                SetMentionsList(response.data['mentions'])
                SetMentionsListSplitted(response.data['mentions_splitted'])
                SetLoadMen(true)
                return response
            }
            fetchMentions()

            async function fetchConcepts(){
                const response = await axios.get('concepts',{params:{user:CurAnnotator}});
                // console.log('request',response)
                SetConceptsList(response.data)
                SetLoadConc(true)
                return response
            }
            fetchConcepts()

            // async function fetchRelationships(){
            //     const response = await axios.get('relationships',{params:{user:CurAnnotator}});
            //     // console.log('request',response)
            //     SetRelationshipsList(response.data)
            //     SetLoadRel(true)
            //     return response
            // }
            // fetchRelationships()
            async function fetchLabels(){
                const response = await axios.get('get_annotated_labels',{params:{user:CurAnnotator}});
                // console.log('request',response)
                SetAnnotatedLabels(response.data)
                SetLoadLab(true)
                // if(LoadingNewAnno){
                //     SetLoadingNewAnno(false)
                // }
                return response
            }
            fetchLabels()


        }
    },[DocumentID,CurAnnotator,AutoAnnotate,LoadingNewAnn])





    function AddMention(){
        SetSaving(true)
        // console.log('chiamo add')
        // console.log('CLICK SU WORD 4')

        if (window.getSelection) {
            var s = window.getSelection();
            var cur_start = 0
            var cur_stop = 0
            var cur_len = 0
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            var start = range.startOffset
            var stop = range.endOffset
            var first_span_index = range.startContainer.parentElement.id.split('_')
            var second_span_index = range.endContainer.parentElement.id.split('_')
            first_span_index = parseInt(first_span_index[first_span_index.length -1])
            second_span_index = parseInt(second_span_index[second_span_index.length -1])
            let total_length = range.toString().length

            // mi basta lo start!!
            let span_index = first_span_index < second_span_index ? first_span_index : second_span_index


            if(node.parentElement.textContent.indexOf(node.nodeValue) !== 0){
                // node.nodeValue !== node.parentElement.innerText && node.nodeValue.trim() === node.parentElement.innerText.trim() && node.parentElement.innerText[0] === ' ' && node.nodeValue[0] !== ' '){
                // console.log(node.parentElement.innerText.indexOf(node.nodeValue))
                firstsel['start'] = start = node.parentElement.textContent.indexOf(node.nodeValue) + range.startOffset
                firstsel['stop'] = stop= range.endOffset + node.parentElement.textContent.indexOf(node.nodeValue)
            }

            cur_len = start
            var testo = range.toString()
            var position_full = first_span_index < second_span_index ? range.startContainer.parentNode : range.endContainer.parentNode
            var position_end = range.endContainer.parentNode
            var first_sel_parent = (node.parentElement.id.split('_'))
            var index = parseInt(first_sel_parent[first_sel_parent.length -1]) + 1
            first_sel_parent.pop()
            // console.log('first sel parent',first_sel_parent)
            first_sel_parent = first_sel_parent.join('_')
            // console.log('first sel parent',first_sel_parent)





            if(start < stop || testo.length + 1 > stop - start + 1){
                firstsel['stop'] = stop = range.endOffset
            }

            var position = findAncestor(position_full,first_sel_parent)
            // console.log('pos',position)
            var position_span_index = position_full.id.split('_')



            position_span_index = parseInt(node.parentElement.id.split('_')[position_span_index.length - 1])

            var elem_anc = document.getElementById(position.id)
            var anc_children = elem_anc.children

            if( anc_children.length > 1){

                for(let index = 0; index < span_index; ++index){
                    // Array.from(theElement.querySelectorAll("*"));
                    var children = Array.from(anc_children[index].querySelectorAll("*"))
                    // console.log('children',children)
                    if (children.length > 0){
                        for(let j = 0; j < children.length; ++j){
                            if(children[j].classList.contains('men') || children[j].classList.contains('no_men')){
                                // console.log('testo sommato',children[j].innerText)
                                cur_len += children[j].innerText.length
                            }

                        }
                    }else{
                        cur_len += anc_children[index].innerText.length
                    }


                }
                cur_start = cur_len
                cur_stop = cur_len + testo.length
            }
            else{
                cur_start = start
                cur_stop = stop
            }

            var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position.id}
            // console.log('newment',new_mention)
            axios.post('mentions/insert',{start:cur_start,stop:cur_stop,position:position.id,mention_text: range.toString()})
                .then(response=>{
                    SetClickedOnText(false)
                    SetMentionsList(response.data['mentions'])
                    SetConceptsList(response.data['concepts'])
                    SetDocumentDesc(response.data['document'])
                    SetSaving(false)
                }).catch(error=>{
                console.log('error in adding mention',error)
            })
            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        }
    }






    function findAncestor (el, cls) {

        // console.log('cls',cls)
        while(el.id !== cls){
            // console.log('el',el.id)
            el = el.parentElement
        }
        return el;
    }

    function AddMentionSelected(){
        // console.log('CLICK SU WORD 3')
        SetSaving(true)
        // console.log('chiamo add selected')

        // aggiungo tra i due span selected
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        // console.log('firstword',FirstSelected)
        // console.log('sectword',SecondSelected)

        var span_number_first = FirstSelected['container']
        var span_number_second = SecondSelected['container']

        var first_span_index = span_number_first.split('_')
        var second_span_index = span_number_second.split('_')
        first_span_index = parseInt(first_span_index[first_span_index.length -1])
        second_span_index = parseInt(second_span_index[second_span_index.length -1])


        if(FirstSelected['container'] === SecondSelected['container']){
            var first_word = FirstSelected['start'] < SecondSelected['start'] ? FirstSelected : SecondSelected
            var second_word = first_word === FirstSelected ? SecondSelected : FirstSelected
        }
        else{
            var first_word = first_span_index < second_span_index ? FirstSelected : SecondSelected
            var second_word = first_word === FirstSelected ? SecondSelected : FirstSelected

        }
        if(first_span_index > second_span_index){
            span_number_first = first_word['container']
            span_number_second = second_word['container']
        }
        // console.log('firstword',span_number_first,first_word)
        // console.log('sectword',span_number_second,second_word)
        var cur_start = first_word['start']
        var cur_stop = second_word['stop']
        var cur_len = cur_start
        // var cur_len = 0
        // console.log('first',cur_start)
        var first_span_index = span_number_first.split('_')
        var second_span_index = span_number_second.split('_')
        first_span_index = parseInt(first_span_index[first_span_index.length -1])
        second_span_index = parseInt(second_span_index[second_span_index.length -1])
        var position_start = document.getElementById(first_word['container'])
        let position = findAncestor(position_start,ParentFirstSelected)
        // console.log('pos',position)

        var anc_children = Array.from(position.children)

        if( anc_children.length > 1){
            for(let index = 0; index < first_span_index; ++index){
                // Array.from(theElement.querySelectorAll("*"));
                var chil = Array.from(anc_children[index].querySelectorAll("*"))
                // console.log('children',chil)
                if (chil.length > 0){
                    for(let j = 0; j < chil.length; ++j){
                        // console.log(chil[j].classList,chil[j].classList.contains('no_men'),chil[j].classList.contains('men'))
                        if((chil[j].classList.contains('men') || chil[j].classList.contains('no_men'))){
                            // console.log('testo sommato', chil[j].innerText)
                            cur_len += chil[j].innerText.length
                        }
                      }
                }else{
                    cur_len += anc_children[index].innerText.length
                }
            }
            cur_start = cur_len
        }
        // console.log('start',cur_start)


        var testo = second_word['text']
        var cur_len = second_word['start']
        if( anc_children.length > 0){
            for(let index = 0; index < second_span_index; ++index){
                var chil = Array.from(anc_children[index].querySelectorAll("*"))
                // console.log('children',chil)
                if (chil.length > 0){
                    for(let j = 0; j < chil.length; ++j){
                        if(chil[j].classList.contains('men') || chil[j].classList.contains('no_men')){
                            // console.log('testo sommato', chil[j].innerText)
                            // console.log('testo sommato', chil[j].innerText)
                            cur_len += chil[j].innerText.length
                        }
                    // for(let j = 0; j < chil.length; ++j){
                    //     let concepts =chil[j].closest('.concepts')
                    //     console.log('conc',concepts)
                    //     if (concepts === null && chil[j].children.length === 0 ){
                    //         console.log('testo sommato', chil[j].innerText)
                    //
                    //         cur_len += chil[j].innerText.length
                    //
                    //     }
                    //
                    //
                    }
                }else{
                    cur_len += anc_children[index].innerText.length
                }

            }
            cur_stop = cur_len + testo.length
        }
        // console.log('stop',cur_stop)
        // console.log(DocumentDescEmpty)
        if(position.id.endsWith('_value')){
            var new_pos = position.id.split('_value')[0]
        }
        else if(position.endsWith('_key')) {
            new_pos = position.id.split('_key')[0]
        }

        testo = DocumentDescEmpty[new_pos].substring(cur_start,cur_stop)
        // console.log('testo between',testo)

        // qua capisco il nuovo start e stop perché quello qua identificato si riferisce al primo span ma non all'inizio
        // var new_val = FindNewRange(start,stop)
        // console.log('new',new_val[0],new_val[1],elem_anc.substring(new_val[0],new_val[1]))

        var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position.id}
        // console.log('newment',new_mention)
        axios.post('mentions/insert',{start:cur_start,stop:cur_stop,position:position.id,mention_text:testo})
            .then(response=>{
                SetClickedOnText(false)
                SetMentionsList(response.data['mentions'])
                SetMentionsListSplitted(response.data['mentions_splitted'])
                SetConceptsList(response.data['concepts'])
                SetDocumentDesc(response.data['document'])
                SetSaving(false)
            }).catch(error=>{
            console.log('error in adding mention',error)
        })
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)

    }



    function ClickOutsideWord(e){
        e.preventDefault()
        var target = e.target
        // console.log('ClickOutsideWord',target.tagName)
        // console.log('ClickOutsideWord',target.className)
        if(!InARel && target.tagName === 'DIV' && target.className !== 'paper'){
            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        }else if (InARel){
            SetInARel(false)
        }

    }

    useEffect(()=>{
        if (FirstSelected && SecondSelected && !InARel) {
            // console.log('first',FirstSelected)
            // console.log('second',SecondSelected)
            AddMentionSelected()
            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
            SetFirstSelected(false)
            SetSecondSelected(false)
        }

    },[FirstSelected,SecondSelected])

    function clearAll(){
        SetFirstSelected(false)
        SetSecondSelected(false)
        SetParentFirstSelected(false)
        SetParentSecondSelected(false)
    }

    function ClickOnWord_Test1(e) {
        e.preventDefault()
        MentionsList.map(mention=>{
            clearMentionsFromBorder(mention.mentions)
        })
        clearConceptsFromBorder()
        if(!InARel){ //NON VALE SE STO CREANDO UNA RELAZIONE
            clearMentionsFromBorder()
            SetClickedOnText(false)
            var s = window.getSelection();

            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            // console.log('parent:',node)
            // console.log('parent',node.parentElement.tagName)
            // node.nodeValue = node.parentElement.innerText

            // if(node.parentElement.tagName === 'H3'){
            //     node = node.parentElement
            // }else if(node.parentElement.tagName === 'B'){
            //     node = node.parentElement
            // }

            // console.log('CLICK SU WORD 2')
            // console.log('range',range)
            let first_sel_parent = ''
            let second_sel_parent = ''
            // MEMORIZZO PARENT PRIMA E SECONDA PAROLA
            var testo_dentro = node.parentElement.innerText

            if(!FirstSelected){
                first_sel_parent = (node.parentElement.id.split('_'))
                // console.log('first sel parent',first_sel_parent)
                var node_id = node.parentElement.id
                var child = document.getElementById(node_id)
                // let node_id = first_sel_parent
                // var child = document.getElementById(node_id)
                first_sel_parent.pop()
                // console.log('first sel parent',first_sel_parent)
                first_sel_parent = first_sel_parent.join('_')
                // console.log('first sel parent',first_sel_parent)

                SetParentFirstSelected(first_sel_parent)
                // console.log('first sel parent',first_sel_parent)
            }else if(!SecondSelected && FirstSelected && ParentFirstSelected){
                second_sel_parent = (node.parentElement.id.split('_'))
                // console.log('second sel parent',second_sel_parent)
                var node_id = node.parentElement.id
                var child = document.getElementById(node_id)
                // let node_id = second_sel_parent
                // var child = document.getElementById(node_id)
                second_sel_parent.pop()
                // console.log('second sel parent',second_sel_parent)
                second_sel_parent = second_sel_parent.join('_')
                // console.log('second sel parent',first_sel_parent)
                first_sel_parent = ParentFirstSelected
                SetParentSecondSelected(second_sel_parent)
                // console.log('first sel parent, second',first_sel_parent,second_sel_parent)

            }

            SetCurrentDiv(node.parentElement.id)
            // console.log('parentelement',node.parentElement.id)
            var start_id = range.startContainer.parentNode.id
            // console.log('parentelement',node_id)

            var end_id = range.endContainer.parentNode.id
            // console.log('parentelement',node_id)

            // var child = document.getElementById(node_id)
            // console.log('startContainer',range.startContainer)
            // console.log('startContainer',range.startContainer.parentNode)
            // console.log('startContainer',range.startContainer.parentNode.id)


            var parent = document.getElementById('paper_doc')

            if(parent.contains(child) || parent === child) {
                    if (first_sel_parent === '' || (first_sel_parent !== '' && second_sel_parent === '') || first_sel_parent === second_sel_parent) {

                        if (range.startOffset === range.endOffset && start_id === end_id) { // GESTISCO IL CASO DEL SINGOLO CLICK
                            try {
                                while (!range.toString().startsWith(' ')) {
                                    range.setStart(node, (range.startOffset - 1));
                                    // console.log('range',range.toString())

                                }
                                // if (range.toString().startsWith(' ')) {
                                //     range.setStart(node, range.startOffset + 1);
                                // }
                            } catch {
                                console.log('range',range.toString())

                                console.log('start', range.startOffset,testo_dentro[range.startOffset])
                                console.log('end', range.endOffset)
                                // range.setStart(node, range.startOffset);
                            }

                            if (range.toString().startsWith(' ')) {
                                // console.log('range',range.toString())
                                range.setStart(node, range.startOffset + 1);
                            }
                            try {
                                while (!range.toString().endsWith(' ')) {
                                    range.setEnd(node, (range.endOffset + 1));

                                }

                            } catch {
                                console.log('start', range.startOffset,testo_dentro[range.startOffset])

                                console.log('end', range.endOffset)
                                // range.setEnd(node, range.endOffset);
                            }
                            if (range.toString().endsWith(' ')) {
                                range.setEnd(node, range.endOffset - 1);
                            } else {
                                range.setEnd(node, range.endOffset);
                            }

                            // console.log('start', range.startOffset)
                            // console.log('end', range.endOffset)
                            SetEnd(range.endOffset)
                            SetStart(range.startOffset)
                            SetTextSelected(range.toString())
                            var firstsel = {}
                            firstsel['start'] = range.startOffset
                            // console.log(node.parentElement.innerText.indexOf(node.nodeValue))
                            firstsel['stop'] = range.endOffset

                            if(node.parentElement.textContent.indexOf(node.nodeValue) !== 0){
                                // node.nodeValue !== node.parentElement.innerText && node.nodeValue.trim() === node.parentElement.innerText.trim() && node.parentElement.innerText[0] === ' ' && node.nodeValue[0] !== ' '){
                                // console.log(node.parentElement.innerText.indexOf(node.nodeValue))
                                firstsel['start'] = node.parentElement.textContent.indexOf(node.nodeValue) + range.startOffset
                                firstsel['stop'] = node.parentElement.textContent.indexOf(node.nodeValue) + range.endOffset
                            }

                            firstsel['text'] = range.toString()
                            if (!FirstSelected) {
                                firstsel['container'] =range.startContainer.parentNode.id
                                // console.log('parent text', range.startContainer.parentElement.innerText)
                                // console.log('parent text', range.startContainer.parentNode.textContent)

                                SetFirstSelected(firstsel)

                            } else {
                                firstsel['container'] = range.startContainer.parentNode.id
                                SetSecondSelected(firstsel)
                            }


                        } else {
                            // console.log('MENTION CONTINUA',ParentFirstSelected)
                            SetStart(range.startOffset)
                            SetEnd(range.endOffset)
                            SetTextSelected(range.toString())
                            AddMention()
                            DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                        }
                    }

                    else {
                        // console.log('PARENT DIVERSO')
                        DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                    }
                // }
            }
        }else{
            // console.log('set false')
            SetInARel(false)
        }

    }

    useEffect(()=>{
        // console.log('inarel',InARel)
        let mention = document.getElementById(props.id)
        if(!InARel){

            // mention.className = 'men'
            // // mention.style.cursor = 'default'

            SetSource(false)
            SetTarget(false)
            SetPredicate(false)
            SetSelectedArrow(false)



            let body = document.body
            body.style.color = 'rgba(33,37,41,1.0)'
            SetRelationship(false)
        }
        else{
            let body = document.body
            body.style.color = 'rgba(33,37,41,0.2)'


            // mention.style.cursor = 'pointer'

        }

    },[InARel])


    useEffect(()=>{
        if(SelectedArrow === 'sp'){
            SetWidthArrowPT(1.8)
            SetWidthArrowST(1.8)
        }
        if(SelectedArrow === 'st'){
            SetWidthArrowPT(1.8)
            SetWidthArrowSP(1.8)
        }
        if(SelectedArrow === 'pt'){
            SetWidthArrowSP(1.8)
            SetWidthArrowST(1.8)
        }
    },[SelectedArrow])

    useEffect(()=>{
        if(SPArrow){

            let source = Array.from(document.getElementsByClassName('source'))
            let predicate = Array.from(document.getElementsByClassName('predicate'))
            let sources_class = source.map(x=>Array.from(x.classList).filter(c=>c.startsWith('mention_')))
            let predicate_class = predicate.map(x=>Array.from(x.classList).filter(c=>c.startsWith('mention_')))
            let source_leading = sources_class.filter(x=>x.length === 1)[0][0]
            let predicate_leading = predicate_class.filter(x=>x.length === 1)[0][0]
            sources_class.map(s=>{
                if(s.length > 1 && s.indexOf(predicate_leading) !== -1){
                    SetOverlappingSP(true)
                }
            })
            predicate_class.map(s=>{
                if(s.length > 1 && s.indexOf(source_leading) !== -1){
                    SetOverlappingSP(true)
                }
            })

        }



    },[SPArrow])
    useEffect(()=>{

        if(STArrow){

            let source = Array.from(document.getElementsByClassName('source'))
            let predicate = Array.from(document.getElementsByClassName('target'))
            let sources_class = source.map(x=>Array.from(x.classList).filter(c=>c.startsWith('mention_')))
            let predicate_class = predicate.map(x=>Array.from(x.classList).filter(c=>c.startsWith('mention_')))
            let source_leading = sources_class.filter(x=>x.length === 1)[0][0]
            let predicate_leading = predicate_class.filter(x=>x.length === 1)[0][0]
            sources_class.map(s=>{
                if(s.length > 1 && s.indexOf(predicate_leading) !== -1){
                    SetOverlappingST(true)
                }
            })
            predicate_class.map(s=>{
                if(s.length > 1 && s.indexOf(source_leading) !== -1){
                    SetOverlappingSP(true)
                }
            })



        }

    },[STArrow])


    useEffect(()=>{

        if(PTArrow){

            let source = Array.from(document.getElementsByClassName('target'))
            let predicate = Array.from(document.getElementsByClassName('predicate'))
            let sources_class = source.map(x=>Array.from(x.classList).filter(c=>c.startsWith('mention_')))
            let predicate_class = predicate.map(x=>Array.from(x.classList).filter(c=>c.startsWith('mention_')))
            let source_leading = sources_class.filter(x=>x.length === 1)[0][0]
            let predicate_leading = predicate_class.filter(x=>x.length === 1)[0][0]
            sources_class.map(s=>{
                if(s.length > 1 && s.indexOf(predicate_leading) !== -1){
                    SetOverlappingPT(true)
                }
            })
            predicate_class.map(s=>{
                if(s.length > 1 && s.indexOf(source_leading) !== -1){
                    SetOverlappingSP(true)
                }
            })



        }
    },[PTArrow])






    useEffect(()=>{
        if(Source){
            waitForElm('#source').then(r=>{
                SetSourceElem(true)

            })
        }else{
            SetSourceElem(false)
        }


    },[Source])


    useEffect(()=>{
        // predicato stabile, source e target floating
        if(PredicateElem && Predicate && !Source && SourceConcepts && !Target && TargetConcepts){
            waitForElm('#targetbox').then(r=>{
                SetPTArrowFloat(true)
            })
            waitForElm('#sourcebox').then(r=>{
                SetSPArrowFloat(true)
            })
        }
        // source stabile, predicato e target floating
        else if(SourceElem && Source && !Predicate && PredicateConcepts && !Target && TargetConcepts){
            waitForElm('#targetbox').then(r=>{
                SetSTArrowFloat(true)
            })

        }
        // target stabile, source predicate floating
        else if(TargetElem && Target && !Source && SourceConcepts && !Predicate && PredicateConcepts){
            waitForElm('#sourcebox').then(r=>{
                SetSTArrowFloat(true)
            })
        }
        // target e predicato stabile, source floating
        else if(TargetElem && Target && PredicateElem && Predicate && !Source && SourceConcepts){
            waitForElm('#sourcebox').then(r=>{
                SetSPArrowFloat(true)
            })
        }
        // source e predicato stabile, target floating
        else if(SourceElem && Source && PredicateElem && Predicate && !Target && TargetConcepts){
            waitForElm('#targetbox').then(r=>{
                SetPTArrowFloat(true)
            })
        }
        // ho solo source, predicate è floating, non ho target
        else if(SourceElem && Source && PredicateConcepts && !Predicate && !Target && !TargetConcepts){
            waitForElm('#predicatebox').then(r=>{
                SetSPArrowFloat(true)
            })
        }
        // ho soloo source, tatget è floating, no predicate
        else if(SourceElem && Source && TargetConcepts && !Target && !Predicate && !PredicateConcepts){
            waitForElm('#targetbox').then(r=>{
                SetSTArrowFloat(true)
            })
        }
        // ho solo predicate, source è floating, non ho target
        else if(PredicateElem && Predicate && !Source && SourceConcepts && !TargetConcepts && !Target){
            waitForElm('#sourcebox').then(r=>{
                SetSPArrowFloat(true)
            })
        }
        // ho solo predicate, target è floating, non ho source
        else if(PredicateElem && Predicate && !Target && TargetConcepts && !Source && !SourceConcepts){
            waitForElm('#targetbox').then(r=>{
                SetPTArrowFloat(true)
            })
        }
        // ho solo target, predicato è floating, non ho source
        else if(TargetElem && Target && !Predicate && PredicateConcepts && !Source && !SourceConcepts){
            waitForElm('#predicatebox').then(r=>{
                SetPTArrowFloat(true)
            })
        }
        // ho solo target, source è floating, non ho predicate
        else if(TargetElem && Target && !Source && SourceConcepts && !Predicate && !PredicateConcepts){
            waitForElm('#predicatebox').then(r=>{
                SetSTArrowFloat(true)
            })
        }

    },[SourceElem,TargetElem,PredicateElem, Target, Source, Predicate, PredicateConcepts, SourceConcepts, TargetConcepts])




    useEffect(()=>{
        if(Predicate){
            waitForElm('#predicate').then(r=>{
                SetPredicateElem(true)
            })
        }else{
            SetPredicateElem(false)
        }


    },[Predicate])
    useEffect(()=>{
        if(Target){
            waitForElm('#target').then(r=>{
                SetTargetElem(true)
            })
        }else{
            SetTargetElem(false)
        }


    },[Target])



    return(
        <div>
            {/*{LoadingDoc ? <div>loading..</div> : <div>no</div>}*/}
            <ArrowContext.Provider value={{changestoff:[ChangeSTOff,SetChangeSTOff],changeptoff:[ChangePTOff,SetChangePTOff],changespoff:[ChangeSPOff,SetChangeSPOff],showconceptmodalrel:[ShowConceptModal,SetShowConceptModal],
                startanchorsp:[StartAnchorSP,SetStartAnchorSP],endanchorsp:[EndAnchorSP,SetEndAnchorSP],endanchorst:[EndAnchorST,SetEndAnchorST],startanchorst:[StartAnchorST,SetStartAnchorST],
                startanchorpt:[StartAnchorPT,SetStartAnchorPT],selectedarrow:[SelectedArrow,SetSelectedArrow],endanchorpt:[EndAnchorPT,SetEndAnchorPT],
                overlappingst:[OverlappingST,SetOverlappingST],overlappingpt:[OverlappingPT,SetOverlappingPT],overlappingsp:[OverlappingSP,SetOverlappingSP]}}>

            {(!DocumentID || LoadingNewAnn || !ConceptsList || !MentionsList || !DocumentDesc || AutoAnnotate || !FieldsToAnn)? <div className='loading'>
                <CircularProgress />
            </div> :
                <div className='paper_doc' id='paper_doc' style={{fontSize:font,paddingBottom:'2.5%',position:'relative', lineHeight:inter}}>

                {Object.keys(DocumentDesc).map((mention_key,i)=><>
                    {FieldsToAnn.indexOf(mention_key.slice(0, mention_key.lastIndexOf("_"))) !==-1 && <>


                            <div className='tab tab_value' onClick={(e)=>{
                                e.preventDefault()
                                e.stopPropagation()
                                console.log('baseind')
                                // clearAll()
                                DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)

                            }
                            }>
                                    <span id={mention_key}  onClick={(e)=>{

                                        if(!InARel && CurAnnotator === Username) {
                                            if (!e.ctrlKey && !(e.ctrlKey && e.shiftKey)&& !(e.ctrlKey && 'z')) {
                                                e.stopPropagation()
                                                ClickOnWord_Test1(e)
                                            }
                                        }
                                    }}>
                                        {DocumentDesc[mention_key].map((obj,i)=><>
                                            {
                                                <>

                                                    {obj['type'].startsWith('no_') ?

                                                        <span>
                                                            <ParagraphDoc chiave = {mention_key} id = {mention_key+'_'+i.toString()}  testo={obj['text']}/>
                                                        </span>

                                                                 :


                                                        <span style={{display:'inline-block'}} className={'mention_span'}>
                                                            {!InARel && <Mention id={mention_key + '_' + i.toString()}

                                                                      start={obj['start']} stop={obj['stop']}
                                                                      loc={mention_key} class={obj['mentions']}
                                                                      mention_text={obj['text']} mention={obj}
                                                                      concepts={ConceptsList.filter(x => x.start === obj['start'] && x.stop === obj['stop'])}/> }

                                                            {InARel  && <><RelMention id={mention_key + '_' + i.toString()}

                                                                       start={obj['start']} stop={obj['stop']}
                                                                       loc={mention_key} class={obj['mentions']}
                                                                       mention_text={obj['text']} mention={obj}
                                                                       concepts={ConceptsList.filter(x => x.start === obj['start'] && x.stop === obj['stop'])}/>

                                                                {/*COLLEGO A OGGETI NON DRAGGABLE*/}
                                                                {/*{!Source && !SourceConcepts && !Target && !TargetConcepts &&  !Predicate && PredicateConcepts  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>*/}

                                                                {/*    <Xwrapper>*/}
                                                                {/*        <DraggableBoxSource id={'predicatebox'}/>*/}
                                                                {/*    </Xwrapper>*/}

                                                                {/*</div>}*/}
                                                                {/*{!Source && SourceConcepts && !Target && !TargetConcepts &&  !Predicate && !PredicateConcepts  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>*/}

                                                                {/*    <Xwrapper>*/}
                                                                {/*        <DraggableBoxSource id={'sourcebox'}/>*/}
                                                                {/*    </Xwrapper>*/}

                                                                {/*</div>}*/}
                                                                {/*{!Source && !SourceConcepts && !Target && TargetConcepts &&  !Predicate && !PredicateConcepts  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>*/}

                                                                {/*    <Xwrapper>*/}
                                                                {/*        <DraggableBoxSource id={'targetbox'}/>*/}
                                                                {/*    </Xwrapper>*/}

                                                                {/*</div>}*/}
                                                                {/*predicato stabile, source e target no*/}
                                                                {!Source && SourceConcepts && !Target && TargetConcepts &&  (Predicate === obj['mentions']) && PredicateElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxSource id={'sourcebox'}/>
                                                                        {SPArrowFloat && <Xarrow start={'sourcebox'} end={"predicate"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}/>}

                                                                    </Xwrapper>
                                                                    <Xwrapper>
                                                                        <DraggableBoxTarget id={'targetbox'}/>
                                                                        {PTArrowFloat && <Xarrow start={'predicate'} end={"targetbox"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}/>}

                                                                    </Xwrapper>
                                                                </div>}
                                                                {/*source stabile, e predicate target no*/}
                                                                {!Target && TargetConcepts &&!Predicate && PredicateConcepts &&  (Source === obj['mentions']) && SourceElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
                                                                    {/*<DraggableBoxTarget id={'targetbox'}/>*/}
                                                                    <Xwrapper>
                                                                        <DraggableBoxTarget id={'targetbox'}/>

                                                                        {STArrowFloat && <Xarrow start={'source'} end={"targetbox"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}

                                                                                 labels={{
                                                                                     middle: <ArrowLabelComponent/>
                                                                                 }}
                                                                        />}

                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*target stabile, e source, predicate no*/}
                                                                {!Source && SourceConcepts &&!Predicate && PredicateConcepts &&  (Target === obj['mentions']) && TargetElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>

                                                                        <DraggableBoxSource id={'sourcebox'}/>
                                                                        {STArrowFloat && <Xarrow start={'sourcebox'} end={"target"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}
                                                                                 labels={{
                                                                                     middle: <ArrowLabelComponent/>
                                                                                 }}
                                                                        />}
                                                                        {/*</Xwrapper>*/}
                                                                    </Xwrapper>

                                                                </div>}


                                                                {/*target pred stabile, e source no*/}
                                                                {!Source && SourceConcepts && Target && TargetElem && (Predicate === obj['mentions']) && PredicateElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxSource id={'sourcebox'}/>
                                                                        {SPArrowFloat && <Xarrow start={'sourcebox'} end={"predicate"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}/>}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*source pred stabile, e target no*/}
                                                                {!Target && TargetConcepts && Source && SourceElem && (Predicate === obj['mentions']) && PredicateElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxTarget id={'targetbox'}/>
                                                                        {PTArrowFloat && <Xarrow start={'predicate'} end={"targetbox"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}/>}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*ho solo source, predicate floating, no target*/}
                                                                {!Predicate && PredicateConcepts && !Target && !TargetConcepts && (Source === obj['mentions']) && SourceElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxPredicate id={'predicatebox'}/>
                                                                        {SPArrowFloat && <Xarrow start={'source'} end={"predicatebox"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}/>}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*ho solo source, target floating, no predicate*/}
                                                                {!Target && TargetConcepts && !Predicate && !PredicateConcepts && (Source === obj['mentions']) && SourceElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxTarget id={'targetbox'}/>
                                                                        {STArrowFloat && <Xarrow start={'source'} end={"targetbox"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}
                                                                                 labels={{
                                                                                     middle: <ArrowLabelComponent/>
                                                                                 }}
                                                                        />}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*ho solo predicate, source floating, no target*/}
                                                                {!Source && SourceConcepts && !Target && !TargetConcepts && (Predicate === obj['mentions']) && PredicateElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxSource id={'sourcebox'}/>
                                                                        {SPArrowFloat && <Xarrow start={'sourcebox'} end={"predicate"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}
                                                                            // labels={{ middle:<ArrowLabelComponent />}}
                                                                        />}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*ho solo predicate, target floating, no source*/}
                                                                {!Target && TargetConcepts && !Source && !SourceConcepts && (Predicate === obj['mentions']) && PredicateElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxTarget id={'targetbox'}/>
                                                                        {PTArrowFloat && <Xarrow start={'predicate'} end={"targetbox"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}
                                                                            // labels={{ middle:<ArrowLabelComponent />}}
                                                                        />}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*ho solo target, predicate floating, no source*/}
                                                                {!Predicate && PredicateConcepts && !Source && !SourceConcepts && (Target === obj['mentions']) && TargetElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxPredicate id={'predicatebox'}/>
                                                                        {PTArrowFloat && <Xarrow start={'predicatebox'} end={"target"}
                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}
                                                                            // labels={{ middle:<ArrowLabelComponent />}}
                                                                        />}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*ho solo target, source floating, no predicate*/}
                                                                {!Source && SourceConcepts && !Predicate && !PredicateConcepts && (Target === obj['mentions']) && TargetElem  &&<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>

                                                                    <Xwrapper>
                                                                        <DraggableBoxSource id={'sourcebox'}/>
                                                                        {STArrowFloat && <Xarrow start={'sourcebox'} end={"target"}

                                                                                 color={'#495057'}
                                                                                 strokeWidth={1.8}
                                                                                 headSize={7}
                                                                                 curveness={1}
                                                                                 zIndex={20}
                                                                                 animateDrawing={0.2}
                                                                                 labels={{
                                                                                     middle: <ArrowLabelComponent/>
                                                                                 }}
                                                                        />}
                                                                    </Xwrapper>

                                                                </div>}
                                                                {/*{!Source && SourceConcepts &&  (Predicate === obj['mentions'] || Target === obj['mentions']) && <div  className={'cover-left'}><OverlayConceptComponent type={'source'} /></div>}*/}
                                                                {/*{!Predicate && PredicateConcepts && (Source === obj['mentions'] || Target === obj['mentions']) && <div  className={!Source?'cover-right' : 'cover-left'}><OverlayConceptComponent type={'predicate'}/></div>}*/}
                                                                {/*{!Target && TargetConcepts && (Source === obj['mentions'] || Predicate === obj['mentions']) && <div  className={'cover-right'}><OverlayConceptComponent type={'target'}/></div>}*/}

                                                                {/* */}
                                                                       </>}
                                                        </span>}

                                                </>

                                            }</>)}
                                        {STArrow && InARel && document.getElementById('source') && document.getElementById('target') &&
                                        <Xarrow
                                            passProps= {{onClick: () => {
                                                    // console.log("xarrow clicked!");
                                                    if(SelectedArrow === 'st'){

                                                        SetWidthArrowST(1.8)
                                                        // SetColorArrowST('#495057')
                                                        SetSelectedArrow(false)
                                                    }else{
                                                        SetSelectedArrow('st')
                                                        // SetColorArrowST('royalblue')
                                                        SetWidthArrowST(3)

                                                    }

                                                },
                                                onMouseOver: () => {
                                                    // SetColorArrowST('royalblue')
                                                    SetWidthArrowST(3)

                                                },
                                                onMouseOut: () => {
                                                    // console.log("xarrow hover!");
                                                    if(SelectedArrow !== 'st') {
                                                        SetWidthArrowST(1.8)
                                                        // SetColorArrowST('#495057')
                                                    }

                                                    }}}
                                            start={'source'} //can be react ref
                                            end={'target'} //or an id
                                            path='straight'
                                            curveness={1}
                                            // startAnchor= {OverlappingSP ? "top" : StartAnchorSP}
                                            // endAnchor= {OverlappingSP ? "top" : EndAnchorSP}
                                            startAnchor= {OverlappingST ? "top" : StartAnchorST}
                                            endAnchor= {OverlappingST ? "top" : EndAnchorST}
                                            strokeWidth={WidthArrowST}
                                            headSize={7}
                                            color={SelectedArrow === 'st'? '#326a1b': '#495057'}

                                            _cpy2Offset={ChangeSTOff ? 0 : 0}
                                            _cpy1Offset={ChangeSTOff ? 20 : -20}
                                            _cpx1Offset={ChangeSTOff ? 0 : 0}
                                            _cpx2Offset={ChangeSTOff ? -50 : 50}
                                            // // path={"grid"}
                                            animateDrawing={0.2}
                                            labels={{ start: <SelectArrowComponent request={'st'}/>, middle:<ArrowLabelComponent />}}


                                        />
                                        }
                                    {SPArrow && InARel && document.getElementById('source') && document.getElementById('predicate') &&
                                    <Xarrow
                                        passProps= {{onClick: () => {
                                                console.log("xarrow clicked!");
                                                if(SelectedArrow === 'sp'){

                                                    SetWidthArrowSP(1.8)
                                                    // SetColorArrowSP('#495057')
                                                    SetSelectedArrow(false)
                                                }else{
                                                    SetSelectedArrow('sp')
                                                    // SetColorArrowSP('royalblue')
                                                    SetWidthArrowSP(3)

                                                }

                                            },
                                            onMouseOver: () => {
                                                console.log("xarrow hover!");
                                                // SetColorArrowSP('royalblue')
                                                SetWidthArrowSP(3)

                                            },
                                            onMouseOut: () => {
                                                console.log("xarrow hover!");
                                                if(SelectedArrow !== 'sp') {
                                                    SetWidthArrowSP(1.8)
                                                    // SetColorArrowSP('#495057')
                                                }

                                            }}}
                                        start={'source'} //can be react ref
                                        end={'predicate'} //or an id
                                        path='straight'
                                        curveness={1}
                                        startAnchor= {OverlappingSP ? "top" : StartAnchorSP}
                                        endAnchor= {OverlappingSP ? "top" : EndAnchorSP}
                                        strokeWidth={WidthArrowSP}
                                        headSize={7}
                                        color={SelectedArrow === 'sp'? 'royalblue': '#495057'}
                                        _cpy2Offset={ChangeSPOff ? 0 : 0}
                                        _cpy1Offset={ChangeSPOff ? 20 : -20}
                                        _cpx1Offset={ChangeSPOff ? 0 : 0}
                                        _cpx2Offset={ChangeSPOff ? -50 : 50}
                                        // // path={"grid"}
                                        animateDrawing={0.2}
                                        labels={{ start: <SelectArrowComponent request={'sp'}/>}}

                                        />}
                                    {PTArrow && InARel && document.getElementById('predicate') && document.getElementById('target') &&
                                        <Xarrow
                                            passProps= {{onClick: () => {
                                                    console.log("xarrow clicked!");
                                                    if(SelectedArrow === 'pt'){

                                                        SetWidthArrowPT(1.8)
                                                        // SetColorArrowPT('#495057')
                                                        SetSelectedArrow(false)
                                                    }else{
                                                        SetSelectedArrow('pt')
                                                        // SetColorArrowPT('royalblue')
                                                        SetWidthArrowPT(3)

                                                    }

                                                },
                                                onMouseOver: () => {
                                                    console.log("xarrow hover!");
                                                    // SetColorArrowPT('royalblue')
                                                    SetWidthArrowPT(3)

                                                },
                                                onMouseOut: () => {
                                                    console.log("xarrow hover!");
                                                    if(SelectedArrow !== 'pt') {
                                                        SetWidthArrowPT(1.8)
                                                        // SetColorArrowPT('#495057')
                                                    }
                                                }}}
                                            start={'predicate'} //can be react ref
                                            end={'target'} //or an id
                                            startAnchor= {OverlappingPT ? "top" : StartAnchorPT}
                                            endAnchor= {OverlappingPT ? "top" : EndAnchorPT}
                                            strokeWidth={WidthArrowPT}
                                            headSize={7}
                                            path='straight'
                                            curveness={1}
                                            tailShape='circle'
                                            color={SelectedArrow === 'pt'? 'royalblue': '#495057'}

                                            _cpy2Offset={ChangePTOff ? 0 : 0}
                                            _cpy1Offset={ChangePTOff ? 20 : -20}
                                            _cpx1Offset={ChangePTOff ? 0 : 0}
                                            _cpx2Offset={ChangePTOff ? -50 : 50}
                                            // // path={"grid"}
                                            animateDrawing={0.2}
                                            labels={{start: <SelectArrowComponent request={'pt'}/>}}

                                        />


                                    }

                                    </span>
                            </div>
                        </>}
                </>)}

            </div> }

            </ArrowContext.Provider>
        </div>

    );
}



