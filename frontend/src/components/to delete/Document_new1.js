import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import '../Document/document.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import DocumentTable from "../Document/DocumentTable";
import Mention from "./Mention";

export default function Document(props){
    const { username,users,collectionslist,document_id,collection,mentions,startrange,endrange } = useContext(AppContext);

    const [DocumentID,SetDocumentID] = document_id
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [FirstWordSelection,SetFirstWordSelection] = useState(false)
    const [SecondWordSelection,SetSecondWordSelection] = useState(false)
    const [DocumentDesc,SetDocumentDesc] = useState(false)
    const [rows, setRows] = useState([])
    const [defaultColumnWidths,setdefaultColumnWidths] = useState([]);
    const [Username, SetUsername] = username
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [LoadingTable,SetLoadingTable] = useState(false)
    const [CollectionName, SetCollectionName] = useState(false)
    const [LoadingDoc,SetLoadingDoc] = useState(true)
    const [MentionsToUpdate,SetMentionsToUpdate] = useState(false)
    const [SpanIndexToUpdate,SetSpanIndexToUpdate] = useState(false)
    const [SectionToUpdate,SetSectionIndexToUpdate] = useState(false)
    // offset delle parole selezionate
    // const [Start,SetStart] = useState(false)
    // const [End,SetEnd] = useState(false)
    const [StartContainer,SetStartContainer] = useState(false)
    const [TextSelected,SetTextSelected] = useState(false)
    const [UpdateMentions,SeUpdateMentions] = useState(false)
    const [MentionOnClick,SetMentionOnClick] = useState(false)
    const [CurrentDiv,SetCurrentDiv] = useState(false)
    const [ShowModalErrorMention,SetShowModalErrorMention] = useState(false)

    useEffect(()=>{

        if(DocumentID){
            console.log('doc_id',DocumentID)
            console.log('doc_id',window.location.host)

            axios.get('http://127.0.0.1:8000/get_mentions').then(response=>{
                SetMentionsList(response.data['mentions'])
                // SetMentionsToUpdate(response.data['mentions'])
                SeUpdateMentions(true)
            }).catch(error=>{
                console.log('error',error)
            })

            axios.get('http://127.0.0.1:8000/get_document_content',{params:{document_id:DocumentID}})
                .then(response=>{
                    console.log('response',response.data)
                    SetDocumentDesc(response.data)
                })
        }

    },[DocumentID])

    useEffect(()=>{
        if(DocumentDesc && MentionsList){
            SetLoadingDoc(false)
        }
    },[DocumentDesc,MentionsList])




    useEffect(()=>{
        if(UpdateMentions && !LoadingDoc){
            MentionsList.map((mention,index)=>{
                // HighlightText(mention)
                // // CreateSelection(mention)
                // AddSpans(index)
            })
            SeUpdateMentions(false)
        }
    },[UpdateMentions,LoadingDoc])


    function DeleteRange(){
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }

        SetStart(false)
        SetEnd(false)
        SetStartContainer(false)

        SetTextSelected(false)
        SetCurrentDiv(false)
    }

    function AddSpans(index){
        var text = ''
        SetMentionOnClick(false)
        if (window.getSelection) {

            // var element = document.createElement('span');
            // element.className = 'mention_'+index.toString()

            var sel = window.getSelection();
            if (sel.rangeCount) {
                var range = sel.getRangeAt(0)
                range = range.cloneRange();
                // range.surroundContents(element);
                sel.removeAllRanges();
                sel.addRange(range);
            }



        }

        DeleteRange()
    }

    function sortByProperty(){
        return function(a,b){
            if(a['start'] > b['start'])
                return 1;
            else if(a['start'] < b['start'])
                return -1;

            return 0;
        }
    }

    function FindNewRange(start,stop){
        var items_list = MentionsList.sort(sortByProperty())

        var to_ret_mention = {}
        items_list.map((mention,ind)=>{

            if(mention['stop'] <= stop) {
                to_ret_mention = mention
            }
        })
        return [to_ret_mention['stop']+start,to_ret_mention['stop']+stop]
        // items_list.map((mention,ind)=>{
        //     if(mention['stop'] <= stop) {
        //         to_ret_mention = mention
        //     }
        //
        // )}
        // return [start+to_ret_mention['start'],start+to_ret_mention['stop']]
    }

    function AddMention(){
        if (window.getSelection) {
            var s = window.getSelection();
            var cur_start = 0
            var cur_stop = 0
            var cur_len = 0
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            var start = range.startOffset
            cur_len = start
            var stop = range.endOffset
            var testo = range.toString()
            var position = range.commonAncestorContainer.parentElement
            var position_span_index = position.id.split('_')
            position_span_index = position_span_index[position_span_index.length - 1]
            position = position.parentElement.id
            var elem_anc = document.getElementById(position)
            var anc_children = elem_anc.children
            console.log('chiòdren',anc_children)
            console.log('chiòdren',position_span_index)
            if( anc_children.length > 1){
                for(let index = 0; index < position_span_index; ++index){
                    console.log('lung1',anc_children[index].innerText.length)
                    cur_len += anc_children[index].innerText.length
                }
                cur_start = cur_len
                cur_stop = cur_len + testo.length
            }
            else{
                cur_start = start
                cur_stop = stop
            }


            console.log('resume',cur_start,cur_stop,testo)
            console.log('node',node)
            console.log('range',range)
            console.log('range_sib',elem_anc)
            console.log('anc',position)

            // qua capisco il nuovo start e stop perché quello qua identificato si riferisce al primo span ma non all'inizio
            // var new_val = FindNewRange(start,stop)
            // console.log('new',new_val[0],new_val[1],elem_anc.substring(new_val[0],new_val[1]))

            var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position}
            console.log('newment',new_mention)
            axios.post('http://127.0.0.1:8000/add_mentions',{start:cur_start,stop:cur_stop,position:position,mention_text: range.toString()})
                .then(response=>{
                    SetMentionsList([...MentionsList,new_mention])
                    SetDocumentDesc(response.data)
                }).catch(error=>{
                    console.log('error in adding mention',error)
            })
            // DeleteRange()
        }
    }

    function AddMentionSelected(){
        // aggiungo tra i due span selected
        var selected_spans = Array.from(document.getElementsByClassName('selected'))
        var start_span = selected_spans[0].id < selected_spans[1].id ? selected_spans[0] : selected_spans[1]
        var end_span = selected_spans[0].id > selected_spans[1].id ? selected_spans[0] : selected_spans[1]

        // idnividuo span genitori
        var parent_first_span = start_span.parentElement.id
        var position_span_index = parent_first_span.split('_')
        position_span_index = position_span_index[position_span_index.length - 1]
        var start = start_span.id
        var cur_len = start

        var parent_second_span = end_span.parentElement.id


        // individuo testo tra genitore e selection


        // per cercare lo start devo prima sommare la lunghezza di tutti i fratelli del padre




            var s = window.getSelection();
            var cur_start = 0
            var cur_stop = 0
            var cur_len = 0
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            var start = range.startOffset
            cur_len = start
            var stop = range.endOffset
            var testo = range.toString()
            var position = range.commonAncestorContainer.parentElement
            var position_span_index = position.id.split('_')
            position_span_index = position_span_index[position_span_index.length - 1]
            position = position.parentElement.id
            var elem_anc = document.getElementById(position)
            var anc_children = elem_anc.children
            console.log('chiòdren',anc_children)
            console.log('chiòdren',position_span_index)
            if( anc_children.length > 1){
                for(let index = 0; index < position_span_index; ++index){
                    console.log('lung1',anc_children[index].innerText.length)
                    cur_len += anc_children[index].innerText.length
                }
                cur_start = cur_len
                cur_stop = cur_len + testo.length
            }
            else{
                cur_start = start
                cur_stop = stop
            }


            console.log('resume',cur_start,cur_stop,testo)
            console.log('node',node)
            console.log('range',range)
            console.log('range_sib',elem_anc)
            console.log('anc',position)

            // qua capisco il nuovo start e stop perché quello qua identificato si riferisce al primo span ma non all'inizio
            // var new_val = FindNewRange(start,stop)
            // console.log('new',new_val[0],new_val[1],elem_anc.substring(new_val[0],new_val[1]))

            var new_mention = {'start':cur_start,'stop':cur_stop,'mention_text':testo,'position':position}
            console.log('newment',new_mention)
            axios.post('http://127.0.0.1:8000/add_mentions',{start:cur_start,stop:cur_stop,position:position,mention_text: range.toString()})
                .then(response=>{
                    SetMentionsList([...MentionsList,new_mention])
                    SetDocumentDesc(response.data)
                }).catch(error=>{
                console.log('error in adding mention',error)
            })
            // DeleteRange()

    }



    function ClickOutsideWord(e){
        e.preventDefault()
        // console.log('clickoustide')
        var target = e.target
        console.log('target',target.tagName)
        console.log('target',target.className)
        if(target.tagName === 'DIV' && target.className !== 'paper'){
            console.log('entro qua')
            DeleteRange()
        }

    }

    function ClickOnWord(e){

        e.preventDefault()
        var s = window.getSelection();

        var range = s.getRangeAt(0);

        var node = s.anchorNode;

        console.log('node',node)
        SetCurrentDiv(node.parentElement.id)

        // console.log('s',s)
        console.log('currentid',node.parentElement.id)
        console.log('parent',node.parentElement.id)
        console.log('RANGE',range.startOffset, range.endOffset)
        // console.log('ancestor',range.commonAncestorContainer.tagName)
        // console.log('curr',node.id)
        var double_click = false
        // SetMentionOnClick(true)

        // try{
        if(range.commonAncestorContainer.tagName === 'DIV'){
            console.log('errore DIV!!!!')
            DeleteRange()
        }else
        {
            if(CurrentDiv === node.parentElement.id || !CurrentDiv) {
                if (range.startOffset === range.endOffset) { // GESTISCO IL CASO DEL SINGOLO CLICK
                    if (Start !== false && Start < range.startOffset) {
                        // console.log('entro')
                        range.setStart(node, Start);
                        double_click = true
                    } else {
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
                    }

                    console.log('start', range.startOffset, range.toString())
                    if (End !== false && End > range.endOffset) {
                        // console.log('entro')
                        range.setEnd(node, End);
                        double_click = true
                    } else {
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
                        SetStartContainer(range.startContainer.parentNode.id)
                        console.log('node id',range.startContainer.parentNode.id)
                        SetTextSelected(range.toString())
                        // SetMentionOnClick(true)
                        // alert(range.toString())
                        // range = range.toString().trim()
                        // SetTextSelected(range.toString())
                    }
                    if (double_click) {
                        AddMention()
                        DeleteRange()
                        // AddSpans(MentionsList.length)
                    }


                } else {
                    console.log('MENTION CONTINUA')
                    // SetMentionOnClick(false)
                    SetStart(range.startOffset)
                    SetEnd(range.endOffset)
                    SetTextSelected(range.toString())
                    // alert(range.toString())
                    AddMention()
                    DeleteRange()
                    // AddSpans(MentionsList.length)
                }
            }
            else if(CurrentDiv && CurrentDiv.split('_')[0] === node.parentElement.id.split('_')[0]){
                console.log('ECCOMI QUA')
                range = s.getRangeAt(0);
                console.log('rt',range.toString())
                // console.log('conta',range.startContainer.parentNode)
                console.log('finale',range.toString(),TextSelected,StartContainer,range.startContainer.parentNode.id)
            }else{
                console.log('PARENT DIVERSO')
                DeleteRange()
                // throw 'Error, different nodes';
            }
        }

        // DeleteRange()
        // console.log('selection',Selection)

        // }catch{
        //     console.log('catch errore!!!!')
        //     DeleteRange()
        // }

    }
    function ClickOnWord_Test1(e){

        e.preventDefault()
        var s = window.getSelection();

        var range = s.getRangeAt(0);

        var node = s.anchorNode;

        console.log('node',node)
        SetCurrentDiv(node.parentElement.id)

        // console.log('s',s)
        console.log('currentid',node.parentElement.id)
        console.log('parent',node.parentElement.id)
        console.log('RANGE',range.startOffset, range.endOffset)
        // console.log('ancestor',range.commonAncestorContainer.tagName)
        // console.log('curr',node.id)
        var double_click = false
        // SetMentionOnClick(true)

        // try{
        if(range.commonAncestorContainer.tagName === 'DIV'){
            console.log('errore DIV!!!!')
            DeleteRange()
        }else
        {
            if(CurrentDiv === node.parentElement.id || !CurrentDiv) {
                if (range.startOffset === range.endOffset) { // GESTISCO IL CASO DEL SINGOLO CLICK
                    if (Start !== false && Start < range.startOffset) {
                        // console.log('entro')
                        range.setStart(node, Start);
                        double_click = true
                    } else {
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
                    }

                    console.log('start', range.startOffset, range.toString())
                    if (End !== false && End > range.endOffset) {
                        // console.log('entro')
                        range.setEnd(node, End);
                        double_click = true
                    } else {
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
                        SetStartContainer(range.startContainer.parentNode.id)
                        console.log('node id',range.startContainer.parentNode.id)
                        SetTextSelected(range.toString())


                        var element = document.createElement('span');
                        element.className = 'selected'
                        element.id = range.startOffset

                        var sel = window.getSelection();
                        if (sel.rangeCount) {
                            var range = sel.getRangeAt(0)
                            range = range.cloneRange();
                            range.surroundContents(element);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                        // DeleteRange()
                        // SetMentionOnClick(true)
                        // alert(range.toString())
                        // range = range.toString().trim()
                        // SetTextSelected(range.toString())
                    }
                    var selected_elems = Array.from(document.getElementsByClassName('selected'))
                    if (selected_elems.length === 2) {
                        AddMentionSelected()
                        DeleteRange()
                        // AddSpans(MentionsList.length)
                    }


                } else {
                    console.log('MENTION CONTINUA')
                    // SetMentionOnClick(false)
                    SetStart(range.startOffset)
                    SetEnd(range.endOffset)
                    SetTextSelected(range.toString())
                    // alert(range.toString())
                    AddMention()
                    DeleteRange()
                    // AddSpans(MentionsList.length)
                }
            }
            else if(CurrentDiv && CurrentDiv.split('_')[0] === node.parentElement.id.split('_')[0]){
                console.log('ECCOMI QUA')
                range = s.getRangeAt(0);
                console.log('rt',range.toString())
                // console.log('conta',range.startContainer.parentNode)
                console.log('finale',range.toString(),TextSelected,StartContainer,range.startContainer.parentNode.id)
            }else{
                console.log('PARENT DIVERSO')
                DeleteRange()
                // throw 'Error, different nodes';
            }
        }

        // DeleteRange()
        // console.log('selection',Selection)

        // }catch{
        //     console.log('catch errore!!!!')
        //     DeleteRange()
        // }

    }


    function HighlightText(mention) {
        console.log('mention',mention)
        var node = document.getElementById(mention['position'])
        console.log('mention',node)

        console.log('nodo',node.firstChild)
        var range = document.createRange();
        range.setStart(node.firstChild,mention['start']);
        range.setEnd(node.firstChild,mention['stop']);
        // console.log('r',range.toString())
        var sel = window.getSelection();
        sel.addRange(range)


    }












    useEffect(()=>{
        console.log('nodo',document.getElementById('abstract_value'))
    },[LoadingDoc])

    return(
        <div>
            {(LoadingDoc && !MentionsList )? <div className='loading'>
                <CircularProgress />
            </div> : <div className='paper_doc' onClick={ClickOutsideWord}>

                {Object.keys(DocumentDesc).map((k,i)=>
                    <div >
                        {k === 'title' ? <><h3 className='tab' id='title_value' onClick={ClickOnWord}>{DocumentDesc[k]}</h3>

                        </> :
                            <>
                                <div className='tab'>
                                    <b id={k.toString()+'_key'}  onClick={ClickOnWord}>{k}</b>
                                </div>
                                <div className='tab tab_value'>
                                    <span id={k.toString()+'_value'}  onClick={ClickOnWord}>{DocumentDesc[k]}</span>
                                </div>
                            </>}
                    </div>


                )}

                {/*{Object.keys(DocumentDesc).map((k,i)=>*/}
                {/*    <div >*/}
                {/*        {k === 'title' ? <><h3 className='tab' id='title_value' onClick={ClickOnWord}>{DocumentDesc[k]}</h3>*/}

                {/*        </> :*/}
                {/*            <>*/}
                {/*                <div className='tab'>*/}
                {/*                    <b id={k.toString()+'_key'}  onClick={ClickOnWord}>{k}</b>*/}
                {/*                </div>*/}
                {/*                <div className='tab tab_value'>*/}
                {/*                    <span id={k.toString()+'_value'}  onClick={ClickOnWord}>{DocumentDesc[k]}</span>*/}
                {/*                </div>*/}
                {/*            </>}*/}
                {/*    </div>*/}


                {/*)}*/}
            </div> }


        </div>

    );
}



