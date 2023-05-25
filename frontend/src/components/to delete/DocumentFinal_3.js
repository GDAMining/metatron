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
import NoMention from "../Annotation/NoMention";
import Chip from "@mui/material/Chip";

export default function Document(props){
    const { username,inarel,documentdescription,currentdiv,firstsel,secondsel,document_id,relationship,mentions,startrange,endrange,fields,fieldsToAnn } = useContext(AppContext);

    // transitions
    // const [LoadingDoc, startTransition] = useTransition()
    const [LoadingDoc, SetLoadingDoc] = useState(true)
    const [ParentSecondSelected,SetParentSecondSelected] = useState(false)
    const [ParentFirstSelected,SetParentFirstSelected] = useState(false)
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
            var position_full = range.startContainer.parentNode
            var first_sel_parent = (node.parentElement.id.split('_'))
            first_sel_parent.pop()
            console.log('first sel parent',first_sel_parent)
            first_sel_parent = first_sel_parent.join('_')
            console.log('first sel parent',first_sel_parent)


            var position = findAncestor(position_full,first_sel_parent)
            console.log('pos',position)
            var position_span_index = position_full.id.split('_')



            position_span_index = node.parentElement.id.split('_')[position_span_index.length - 1]
            // position = position.parentElement.id
            // console.log('pos',position)

            // if (position.tagName === 'DIV'){
            //
            //     position = position.parentElement.id
            //     // console.log('posiszione1',position)
            //
            // }
            // else{
            //     position = position.id
            //     if(getNumberAtEnd(position) !== null){
            //         var numb = getNumberAtEnd(position)
            //
            //         position = position.split('_'+numb.toString())
            //         position = position[0]
            //     }
            //     // console.log('posiszione12',position)
            //
            // }
            var elem_anc = document.getElementById(position.id)
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


            var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position.id}
            console.log('newment',new_mention)
            axios.post('add_mentions',{start:cur_start,stop:cur_stop,position:position.id,mention_text: range.toString()})
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

    function findAncestor (el, cls) {

        console.log('cls',cls)
        while(el.id !== cls){
            console.log('el',el.id)
            el = el.parentElement
        }
        // while ((el = el.parentElement) && !el.id === (cls));
        return el;
    }

    function AddMentionSelected(){
        console.log('CLICK SU WORD 3')

        console.log('chiamo add selected')

        // aggiungo tra i due span selected
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        console.log('firstword',FirstSelected)
        console.log('sectword',SecondSelected)

        var span_number_first = FirstSelected['container']
        var span_number_second = SecondSelected['container']
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
        var first_span_index = span_number_first.split('_')
        var second_span_index = span_number_second.split('_')
        first_span_index = first_span_index[first_span_index.length -1]
        second_span_index = second_span_index[second_span_index.length -1]
        var position = document.getElementById(first_word['container'])
        position = findAncestor(position,ParentFirstSelected)
        console.log('pos',position)

        // position = position.parentElement
        // console.log('pos',position)
        //
        // if (position.tagName === 'DIV'){
        //
        //     position = position.parentElement.id
        //     console.log('pos',position)
        //
        // }
        // else{
        //     position = position.id
        // }
        // var elem_anc = document.getElementById(position)

        var anc_children = Array.from(position.children)

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
        console.log(DocumentDescEmpty)
        if(position.id.endsWith('_value')){
            var new_pos = position.id.split('_value')[0]
        }
        else if(position.endsWith('_key')) {
            new_pos = position.id.split('_key')[0]
        }

        testo = DocumentDescEmpty[new_pos].substring(cur_start,cur_stop)
        console.log('testo between',testo)

        // qua capisco il nuovo start e stop perché quello qua identificato si riferisce al primo span ma non all'inizio
        // var new_val = FindNewRange(start,stop)
        // console.log('new',new_val[0],new_val[1],elem_anc.substring(new_val[0],new_val[1]))

        var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position.id}
        console.log('newment',new_mention)
        axios.post('add_mentions',{start:cur_start,stop:cur_stop,position:position.id,mention_text:testo})
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
        var target = e.target
        console.log('ClickOutsideWord',target.tagName)
        console.log('ClickOutsideWord',target.className)
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

    useEffect(()=>{
        console.log('document desc',DocumentDesc)
    },[DocumentDesc])


    function ClickOnWord_Test1(e) {
        e.stopPropagation()
        e.preventDefault()

        if(!InARel){ //NON VALE SE STO CREANDO UNA RELAZIONE
            SetClickedOnText(false)
            var s = window.getSelection();

            var range = s.getRangeAt(0);

            var node = s.anchorNode;

            console.log('CLICK SU WORD 2')
            console.log('range',range)
            let first_sel_parent = ''
            let second_sel_parent = ''
            // MEMORIZZO PARENT PRIMA E SECONDA PAROLA
            if(!FirstSelected){
                first_sel_parent = (node.parentElement.id.split('_'))
                first_sel_parent.pop()
                console.log('first sel parent',first_sel_parent)
                first_sel_parent = first_sel_parent.join('_')
                console.log('first sel parent',first_sel_parent)

                SetParentFirstSelected(first_sel_parent)
                console.log('first sel parent',first_sel_parent)
            }else if(!SecondSelected && FirstSelected && ParentFirstSelected){
                second_sel_parent = (node.parentElement.id.split('_'))
                second_sel_parent.pop()
                console.log('second sel parent',second_sel_parent)
                second_sel_parent = second_sel_parent.join('_')
                console.log('second sel parent',first_sel_parent)
                first_sel_parent = ParentFirstSelected
                SetParentSecondSelected(second_sel_parent)
                console.log('first sel parent, second',first_sel_parent,second_sel_parent)

            }

            // SetCurrentDiv(node.parentElement.id)
            console.log('parentelement',node.parentElement.id)
            var node_id = range.startContainer.parentNode.id
            console.log('startContainer',range.startContainer.parentNode.id)

            var child = document.getElementById(node_id)
            var parent = document.getElementById('paper_doc')

            if(parent.contains(child) || parent === child) {
                // if (range.commonAncestorContainer.tagName === 'DIV') {
                //     console.log('tagname div')
                //     DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                // } else {
                if (first_sel_parent === '' || (first_sel_parent !== '' && second_sel_parent === '') || first_sel_parent === second_sel_parent) {

                    // if (CurrentDiv === node.parentElement.id || !CurrentDiv || (CurrentDiv && CurrentDiv.split('_')[0] === node.parentElement.id.split('_')[0])) {
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
                        console.log('start', range.startOffset)
                        console.log('end', range.endOffset)
                        SetEnd(range.endOffset)
                        SetStart(range.startOffset)
                        SetTextSelected(range.toString())
                        var firstsel = {}

                        firstsel['start'] = range.startOffset
                        firstsel['stop'] = range.endOffset
                        firstsel['text'] = range.toString()
                        if (!FirstSelected) {
                            firstsel['container'] =range.startContainer.parentNode.id
                            SetFirstSelected(firstsel)

                        } else {
                            firstsel['container'] = range.startContainer.parentNode.id
                            SetSecondSelected(firstsel)
                        }


                    } else {
                        console.log('MENTION CONTINUA',ParentFirstSelected)
                        SetStart(range.startOffset)
                        SetEnd(range.endOffset)
                        SetTextSelected(range.toString())
                        AddMention()
                        DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                    }
                }
                    // else if (CurrentDiv && CurrentDiv.split('_')[0] === node.parentElement.id.split('_')[0]) {
                    //     console.log('ECCOMI QUA')
                    //     range = s.getRangeAt(0);
                    //     console.log('rt', range.toString())
                    //     console.log('finale', range.toString(), TextSelected, StartContainer, range.startContainer.parentNode.id)
                // }
                else {
                    console.log('PARENT DIVERSO')
                    DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                }
                // }
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
                                    {mention_key.endsWith('_value') && mention_key !== 'title_value' &&
                                    <div className='tab tab_value'>
                                    <span id={mention_key}  onClick={(e)=>{SetClickedOnText(true);ClickOnWord_Test1(e)}}>
                                        {DocumentDesc[mention_key].map((obj,i)=><>
                                            {
                                                mention_key.endsWith('_value') && <>

                                                    {obj['type'].startsWith('no_') ?

                                                        <span className='no_men' id = {mention_key+'_'+i.toString()}>{obj['text']}</span>
                                                        :

                                                        <span style={{display:'inline-block'}}>
                                                            {MentionsList && <Mention  id = {mention_key+'_'+i.toString()} start = {obj['start']} stop= {obj['stop']} loc = {mention_key} class = {obj['mentions']} mention_text = {obj['text']} mention={obj} concepts = {MentionsList.find(x=>x['start'] === obj['start'] && obj['stop'] === x['stop'])['concepts']} />}
                                                        </span>}

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



