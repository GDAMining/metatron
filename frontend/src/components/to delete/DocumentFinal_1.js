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
import '../Document/document.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import { DeleteRange } from "../HelperFunctions/HelperFunctions";
import DocumentTable from "../Document/DocumentTable";
import Mention from "../Annotation/mentions/Mention";
import Association from "../Annotation/Association";

export default function Document(props){
    const { username,inarel,documentdescription,currentdiv,firstsel,secondsel,document_id,relationship,mentions,startrange,endrange,fields,fieldsToAnn } = useContext(AppContext);

    // transitions
    // const [LoadingDoc, startTransition] = useTransition()
    const [LoadingDoc, SetLoadingDoc] = useState(true)

    const [DocumentID,SetDocumentID] = document_id
    const [MentionsList,SetMentionsList] = mentions
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [InARel,SetInARel] = inarel
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel

    const [DocumentDesc,SetDocumentDesc] = documentdescription
    const [DocumentDescEmpty,SetDocumentDescEmpty] = useState(false)
    // const [LoadingDoc,SetLoadingDoc] = useState(true)

    const [StartContainer,SetStartContainer] = useState(false)
    const [TextSelected,SetTextSelected] = useState(false)
    const [UpdateMentions,SeUpdateMentions] = useState(false)
    const [ClickedOnText,SetClickedOnText] = useState(false)
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn
    const [Fields,SetFields] = fields
    const [Relationship,SetRelationship] = relationship


    //
    useEffect(()=>{
        if(DocumentID){

                SetLoadingDoc(true)
                axios.get('get_document_content',{params:{document_id:DocumentID}})
                    .then(response=>{

                        console.log('response',response.data)
                        SetDocumentDesc(response.data['mentions'])
                        SetDocumentDescEmpty(response.data['empty'])
                        SetLoadingDoc(false)

            })
        }

    },[DocumentID])



    useEffect(()=>{
        console.log('load',LoadingDoc)
    },[LoadingDoc])

    // useEffect(()=>{
    //     if(DocumentDesc && MentionsList){
    //         console.log('entro in loading')
    //         SetLoadingDoc(false)
    //     }
    // },[DocumentDesc,MentionsList])

    function endsWithNumber(str) {
        return /[0-9]+$/.test(str);
    }
    function getNumberAtEnd(str) {
        if (endsWithNumber(str)) {
            return Number(str.match(/[0-9]+$/)[0]);
        }

        return null;
    }





    function AddMention(){
        console.log('chiamo add')
        console.log('CLICK SU WORD 4')

        if (window.getSelection) {
            var s = window.getSelection();
            var cur_start = 0
            var cur_stop = 0
            var cur_len = 0
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            var start = range.startOffset
            // console.log('start',start)
            cur_len = start
            var stop = range.endOffset
            var testo = range.toString()
            var position = range.commonAncestorContainer.parentElement
            var position_span_index = position.id.split('_')
            position_span_index = position_span_index[position_span_index.length - 1]
            // position = position.parentElement.id
            // console.log('pos',position)

            if (position.tagName === 'DIV'){

                position = position.parentElement.id
                // console.log('posiszione1',position)

            }
            else{
                position = position.id
                if(getNumberAtEnd(position) !== null){
                    var numb = getNumberAtEnd(position)

                    position = position.split('_'+numb.toString())
                    position = position[0]
                }
                // console.log('posiszione12',position)

            }
            var elem_anc = document.getElementById(position)
            // console.log('testo',elem_anc.innerText)
            var anc_children = elem_anc.children
            // console.log('children',anc_children)
            //
            // console.log('children',position_span_index)
            if( anc_children.length > 1){
                // for(let index = 0; index < position_span_index; ++index){
                //     console.log('lung1',anc_children[index].innerText.length)
                //     cur_len += anc_children[index].innerText.length
                // }
                for(let index = 0; index < position_span_index; ++index){
                    var children = Array.from(anc_children[index].children)
                    // console.log('children',children)
                    if (children.length > 1){
                        for(let j = 0; j < children.length; ++j){
                            if (children[j].className !== 'concepts'){
                                cur_len += children[j].innerText.length
                                // console.log('children',children)
                                //
                                // console.log('first',children[j].innerText.length, children[j].innerText)
                                // console.log('first',cur_start,cur_len)
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


            var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position}
            console.log('newment',new_mention)
            axios.post('add_mentions',{start:cur_start,stop:cur_stop,position:position,mention_text: range.toString()})
                .then(response=>{
                    SetClickedOnText(false)
                    SetMentionsList(response.data['mentions'])
                    SetDocumentDesc(response.data['document'])
                }).catch(error=>{
                console.log('error in adding mention',error)
            })
            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        }
    }


    function AddMentionSelected(){
        console.log('CLICK SU WORD 3')

        console.log('chiamo add selected')

        // aggiungo tra i due span selected
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        console.log('firstword',FirstSelected)
        console.log('sectword',SecondSelected)

        var span_number_first = FirstSelected['container'].split('_')[FirstSelected['container'].split('_').length-1]
        var span_number_second = SecondSelected['container'].split('_')[SecondSelected['container'].split('_').length - 1]
        if(FirstSelected['container'] === SecondSelected['container']){
            var first_word = FirstSelected['start'] < SecondSelected['start'] ? FirstSelected : SecondSelected
            var second_word = first_word === FirstSelected ? SecondSelected : FirstSelected
        }
        else{

            var first_word = span_number_first < span_number_second ? FirstSelected : SecondSelected
            var second_word = first_word === FirstSelected ? SecondSelected : FirstSelected

        }
        console.log('firstword',span_number_first,first_word)
        console.log('sectword',span_number_second,second_word)
        var cur_start = first_word['start']
        var cur_stop = second_word['stop']
        var cur_len = cur_start
        console.log('first',cur_start)
        var first_span_index = span_number_first
        var second_span_index = span_number_second
        var position = document.getElementById(first_word['container']).parentElement
        console.log('pos',position)

        if (position.tagName === 'DIV'){

            position = position.parentElement.id
            console.log('pos',position)

        }
        else{
            position = position.id
        }
        var elem_anc = document.getElementById(position)

        var anc_children = Array.from(elem_anc.children)

        if( anc_children.length > 1){
            for(let index = 0; index < first_span_index; ++index){
                var children = Array.from(anc_children[index].children)
                console.log('children',children)
                if (children.length > 1){
                    for(let j = 0; j < children.length; ++j){
                        if (children[j].className !== 'concepts'){
                            cur_len += children[j].innerText.length
                        }
                    }
                }else{
                    cur_len += anc_children[index].innerText.length
                }
            }
            cur_start = cur_len
        }
        console.log('start',cur_start)


        var testo = second_word['text']
        var cur_len = second_word['start']
        if( anc_children.length > 1){
            for(let index = 0; index < second_span_index; ++index){
                var children = Array.from(anc_children[index].children)
                if (children.length > 0){
                    console.log('children',children)
                    for(let j = 0; j < children.length; ++j){
                        if (children[j].className !== 'concepts'){
                            cur_len += children[j].innerText.length
                        }


                    }
                }else{
                    cur_len += anc_children[index].innerText.length
                }

            }
            cur_stop = cur_len + testo.length
        }
        // console.log('stop',cur_stop)
        var new_pos = position.split('_value')[0]
        console.log(DocumentDescEmpty)
        if(position.endsWith('_key')) {
            new_pos = position.split('_key')[0]
        }
        testo = DocumentDescEmpty[new_pos].substring(cur_start,cur_stop)
        console.log('testo between',testo)

        // qua capisco il nuovo start e stop perché quello qua identificato si riferisce al primo span ma non all'inizio
        // var new_val = FindNewRange(start,stop)
        // console.log('new',new_val[0],new_val[1],elem_anc.substring(new_val[0],new_val[1]))

        var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position}
        console.log('newment',new_mention)
        axios.post('add_mentions',{start:cur_start,stop:cur_stop,position:position,mention_text:testo})
            .then(response=>{
                SetClickedOnText(false)
                SetMentionsList(response.data['mentions'])
                SetDocumentDesc(response.data['document'])
            }).catch(error=>{
            console.log('error in adding mention',error)
        })
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)

    }



    function ClickOutsideWord(e){
        e.preventDefault()
        console.log('CLICK SU WORD 1')

        var target = e.target
        console.log('target',target.tagName)
        console.log('target',target.className)
        if(!InARel && target.tagName === 'DIV' && target.className !== 'paper'){
            console.log('entro qua')
            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        }else if (InARel){
            console.log('set false')

            SetInARel(false)
        }

    }



    useEffect(()=>{
        if (FirstSelected && SecondSelected && !InARel) {
            console.log('first',FirstSelected)
            console.log('second',SecondSelected)
            AddMentionSelected()
            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
            SetFirstSelected(false)
            SetSecondSelected(false)
        }

    },[FirstSelected,SecondSelected])


    useEffect(()=>{
        if(Relationship.length >0){
            console.log('relationshup',Relationship)
    //         Relationship.map((rel,ind)=>{
    //             let mention = document.getElementById(rel['id'])
    //             mention.className = 'rel'
    //             // mention.style.color = 'rgba(197,0,106,1.0)'
    //             // mention.style.backgroundColor = 'rgba(197,0,106,0.1)'
    //         })
        }
    },[Relationship])

    function ClickOnWord_Test1(e) {
        e.stopPropagation()
        e.preventDefault()
        if(!InARel){ //NON VALE SE STO CREANDO UNA RELAZIONE
            SetClickedOnText(false)
            var s = window.getSelection();

            var range = s.getRangeAt(0);

            var node = s.anchorNode;

            console.log('CLICK SU WORD 2')
            SetCurrentDiv(node.parentElement.id)

            // console.log('currentid', node.id)
            // console.log('parent', node.parentElement.id)
            // console.log('RANGE', range.startOffset, range.endOffset)
            var node_id = range.startContainer.parentNode.id
            var child = document.getElementById(node_id)
            var parent = document.getElementById('paper_doc')
            // console.log('parent0',node_id)
            // console.log('parent1',parent)
            // console.log('parent2',child)
            if(parent.contains(child) || parent === child) {
                if (range.commonAncestorContainer.tagName === 'DIV') {
                    console.log('errore DIV!!!!')
                    DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                } else {
                    if (CurrentDiv === node.parentElement.id || !CurrentDiv || (CurrentDiv && CurrentDiv.split('_')[0] === node.parentElement.id.split('_')[0])) {
                        if (range.startOffset === range.endOffset) { // GESTISCO IL CASO DEL SINGOLO CLICK
                            try {
                                while (!range.toString().startsWith(' ')) {
                                    range.setStart(node, (range.startOffset - 1));
                                }
                                if (range.toString().startsWith(' ')) {
                                    range.setStart(node, range.startOffset + 1);
                                }
                            } catch {
                                range.setStart(node, range.startOffset);
                            }


                            try {
                                while (!range.toString().endsWith(' ')) {
                                    range.setEnd(node, (range.endOffset + 1));

                                }
                                if (range.toString().endsWith(' ')) {
                                    range.setEnd(node, range.endOffset - 1);
                                } else {
                                    range.setEnd(node, range.endOffset);
                                }

                            } catch {
                                range.setEnd(node, range.endOffset);
                            }
                            console.log('end', range.endOffset)
                            SetEnd(range.endOffset)
                            SetStart(range.startOffset)
                            // SetStartContainer(range.startContainer.parentNode.id)
                            console.log('node id', range.startContainer.parentNode.id)
                            SetTextSelected(range.toString())
                            var firstsel = {}
                            firstsel['container'] = range.startContainer.parentNode.id
                            firstsel['start'] = range.startOffset
                            firstsel['stop'] = range.endOffset
                            firstsel['text'] = range.toString()
                            if (!FirstSelected) {
                                SetFirstSelected(firstsel)

                            } else {
                                SetSecondSelected(firstsel)
                            }


                        } else {
                            console.log('MENTION CONTINUA')
                            SetStart(range.startOffset)
                            SetEnd(range.endOffset)
                            SetTextSelected(range.toString())
                            // alert(range.toString())
                            AddMention()
                            DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                        }
                    } else if (CurrentDiv && CurrentDiv.split('_')[0] === node.parentElement.id.split('_')[0]) {
                        console.log('ECCOMI QUA')
                        range = s.getRangeAt(0);
                        console.log('rt', range.toString())
                        // console.log('conta',range.startContainer.parentNode)
                        console.log('finale', range.toString(), TextSelected, StartContainer, range.startContainer.parentNode.id)
                    } else {
                        console.log('PARENT DIVERSO')
                        DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                    }
                }
            }
        }else{
            console.log('set false')
            SetInARel(false)
        }

    }


    return(
        <div>
            {/*{LoadingDoc ? <div>loading..</div> : <div>no</div>}*/}
            {(LoadingDoc || !MentionsList || !FieldsToAnn)? <div className='loading'>
                <CircularProgress />
            </div> :
                <div className='paper_doc' id='paper_doc' onClick={(e)=>ClickOutsideWord(e)}>
                {Object.keys(DocumentDesc).map((mention_key,i)=><>
                    {FieldsToAnn.indexOf(mention_key.slice(0, mention_key.lastIndexOf("_"))) !==-1 && <>
                    {(mention_key === 'title_value' ) ? <><h3 className='tab' id='title_value' onClick={(e)=>{SetClickedOnText(true);ClickOnWord_Test1(e)}}>
                            {DocumentDesc[mention_key].map((obj,i)=><>
                                {obj['type'].startsWith('no_') ? <span className='no_mention' id = {mention_key+'_'+i.toString()}>{obj['text']}</span> : <div style={{display:'inline-block'}}><Mention id = {mention_key+'_'+i.toString()} start = {obj['start']} stop= {obj['stop']}  class = {obj['mentions']} loc = {mention_key} mention={obj} mention_text = {obj['text']} concepts = {obj['concepts']} mention = {obj} /></div>}
                            </>)}</h3>

                        </> :
                        <>
                            {mention_key.endsWith('_key') && mention_key !== 'title_key'  && <div className='tab'>
                                <b id={mention_key}  onClick={(e)=>{SetClickedOnText(true);ClickOnWord_Test1(e)}}>
                                    {DocumentDesc[mention_key].map((obj,i)=><>{
                                        mention_key.endsWith('_key') && <>

                                            {obj['type'].startsWith('no_') ?  <span className='no_mention' id = {mention_key+'_'+i.toString()}> {obj['text']}</span> : <div style={{display:'inline-block'}}>
                                                <Mention id = {mention_key+'_'+i.toString()} start = {obj['start']} stop= {obj['stop']} loc = {mention_key} class = {obj['mentions']} mention_text = {obj['text']} mention={obj} concepts = {obj['concepts']} />
                                            </div>}

                                        </>

                                    }
                                    </>)}
                                </b>
                            </div>}
                            {mention_key.endsWith('_value') && mention_key !== 'title_value' && <div className='tab tab_value'>
                                    <span id={mention_key}  onClick={(e)=>{SetClickedOnText(true);ClickOnWord_Test1(e)}}>
                                        {DocumentDesc[mention_key].map((obj,i)=><>
                                            {
                                                mention_key.endsWith('_value') && <>

                                                    {obj['type'].startsWith('no_') ? <span className='no_mention' id = {mention_key+'_'+i.toString()}>{obj['text']}</span> : <div style={{display:'inline-block'}}>
                                                        <Mention id = {mention_key+'_'+i.toString()} start = {obj['start']} stop= {obj['stop']} loc = {mention_key} class = {obj['mentions']} mention_text = {obj['text']} mention={obj} concepts = {obj['concepts']} />{' '}
                                                    </div>}

                                                </>

                                            }</>)}

                                    </span>
                            </div>}
                        </>}
                        </>}
                </>)}

            </div> }


        </div>

    );
}



