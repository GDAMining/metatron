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

    const [DocumentDesc,SetDocumentDesc] = useState(false)
    const [rows, setRows] = useState([])
    const [defaultColumnWidths,setdefaultColumnWidths] = useState([]);
    const [Username, SetUsername] = username
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [LoadingTable,SetLoadingTable] = useState(false)
    const [CollectionName, SetCollectionName] = useState(false)
    const [LoadingDoc,SetLoadingDoc] = useState(true)
    const [MentionsToUpdate,SetMentionsToUpdate] = useState(false)

    // offset delle parole selezionate
    // const [Start,SetStart] = useState(false)
    // const [End,SetEnd] = useState(false)
    const [TextSelected,SetTextSelected] = useState(false)
    const [UpdateMentions,SeUpdateMentions] = useState(false)
    const [MentionOnClick,SetMentionOnClick] = useState(false)
    const [CurrentDiv,SetCurrentDiv] = useState(false)
    const [ShowModalErrorMention,SetShowModalErrorMention] = useState(false)

    useEffect(()=>{
        console.log('doc_id eccomgi')
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
                HighlightText(mention)
                // CreateSelection(mention)
                AddSpans(index)
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
        SetTextSelected(false)
        SetCurrentDiv(false)
    }

    function AddSpans(index){
        var text = ''
        SetMentionOnClick(false)
        if (window.getSelection) {

            var element = document.createElement('span');
            element.className = 'mention_'+index.toString()

            var sel = window.getSelection();
            if (sel.rangeCount) {
                var range = sel.getRangeAt(0).cloneRange();
                range.surroundContents(element);
                sel.removeAllRanges();
                sel.addRange(range);
            }

            // var e = document.createElement('button');
            // e.innerHTML = 'ciao'
            // element.appendChild(e)
            // var elem = <Mention/>

            // element.appendChild(elem)

            // var icon = document.createElement('i');
            // icon.className="fa fa-users"
            // icon.ariaHidden = "true"
            //
            // var button = document.createElement('button')
            // button.appendChild(icon)
            // button.innerText = text
            // element.appendChild(button)


        }

        DeleteRange()
    }

    function AddMention(){
        if (window.getSelection) {
            var s = window.getSelection();
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            var start = range.startOffset
            var stop = range.endOffset
            var testo = range.toString()
            var position = range.commonAncestorContainer.parentElement.id
            console.log('resume',start,stop,testo)
            console.log('node',node)
            console.log('range',range)
            console.log('anc',position)
            var new_mention = {'start':start,'stop':stop,'mention_text':testo,'position':position}
            axios.post('http://127.0.0.1:8000/add_mentions',{start:start,stop:stop,position:position,mention_text: range.toString()})
                .then(response=>{
                    SetMentionsList([...MentionsList,new_mention])
                }).catch(error=>{
                    console.log('error in adding mention',error)
            })
            // DeleteRange()
        }
    }

    function CreateSelection(mention){
        console.log('mention',mention)
        let range = document.createRange();
        let node = document.getElementById(mention['position'])
        console.log('adding node',node)
        range.setStart(node, mention['start']);
        SetStart(mention['start'])
        SetEnd(mention['stop'])
        range.setEnd(node, mention['stop']);
        range.select()

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
        // console.log('node',node)
        // console.log('parent',node.parentElement.id)
        console.log(range.startOffset, range.endOffset)
        console.log('ancestor',range.commonAncestorContainer.tagName)
        console.log('curr',node.id)
        var double_click = false
        // SetMentionOnClick(true)

        try{
            if(range.commonAncestorContainer.tagName === 'DIV'){
                console.log('errore DIV!!!!')
                DeleteRange()
            }else
            {
                if(CurrentDiv === node.parentElement.id || !CurrentDiv){
                    if (range.startOffset === range.endOffset){ // GESTISCO IL CASO DEL SINGOLO CLICK
                        if(Start !== false && Start < range.startOffset){
                            // console.log('entro')
                            range.setStart(node, Start);
                            double_click = true
                        }
                        else {
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

                        console.log('start',range.startOffset,range.toString())
                        if(End !== false && End > range.endOffset){
                            // console.log('entro')
                            range.setEnd(node, End);
                            double_click = true
                        }else{
                            try{
                                while(!range.toString().endsWith(' ')) {
                                    range.setEnd(node,(range.endOffset + 1));

                                }
                                if(range.toString().endsWith(' ')){
                                    range.setEnd(node, range.endOffset -1);
                                }else{
                                    range.setEnd(node, range.endOffset);
                                }

                            }catch{
                                range.setEnd(node, range.endOffset);
                            }
                            console.log('end',range.endOffset)
                            SetEnd(range.endOffset)
                            SetStart(range.startOffset)
                            SetTextSelected(range.toString())
                            // SetMentionOnClick(true)
                            // alert(range.toString())
                            // range = range.toString().trim()
                            // SetTextSelected(range.toString())
                        }
                        if(double_click){
                            AddMention()
                            AddSpans(MentionsList.length)
                        }



                    }else{
                        console.log('entro',range.endOffset,range.startOffset)
                        // SetMentionOnClick(false)
                        SetStart(range.startOffset)
                        SetEnd(range.endOffset)
                        SetTextSelected(range.toString())
                        // alert(range.toString())
                        AddMention()
                        AddSpans(MentionsList.length)
                    }
                }else{
                    console.log('PARENT DIVERSO')
                    DeleteRange()
                    // throw 'Error, different nodes';
                }
            }



        }catch{
            // console.log('catch errore!!!!')
            DeleteRange()
        }

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
                {/*{Object.keys(DocumentDesc).map((k,i)=>*/}
                {/*    <div >*/}
                {/*        {k === 'title' ? <><h3 className='tab' id='title_value' onClick={ClickOnWord}>{DocumentDesc[k]}</h3>*/}

                {/*            </> :*/}
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
                {Object.keys(DocumentDesc).map((mention_key,i)=><>

                {mention_key === 'title_key' ? <><h3 className='tab' id='title_value' onClick={ClickOnWord}>
                        {Object.keys(DocumentDesc[mention_key]).map((k,i)=><>
                            {k.startsWith('no_') ? <>{DocumentDesc[mention_key][k]}</> : <Mention mention_text = {DocumentDesc[mention_key][k]}  />}
                        </>)}</h3>

                    </> :
                    <>
                        {mention_key.endsWith('_key') && <div className='tab'>
                            <b id={mention_key}  onClick={ClickOnWord}>
                                {Object.keys(DocumentDesc[mention_key]).map((k,i)=><>{
                                    mention_key.endsWith('_key') && <>

                                        {k.startsWith('no_') ? <>{DocumentDesc[mention_key][k]}</> : <Mention mention_text = {DocumentDesc[mention_key][k]}  />}

                                    </>

                                }
                                </>)}
                            </b>
                        </div>}
                        {mention_key.endsWith('_value') && <div className='tab tab_value'>
                                    <span id={mention_key}  onClick={ClickOnWord}>
                                        {Object.keys(DocumentDesc[mention_key]).map((k,i)=><>
                                            {
                                                mention_key.endsWith('_value') && <>

                                                    {k.startsWith('no_') ? <>{DocumentDesc[mention_key][k]}</> : <Mention mention_text = {DocumentDesc[mention_key][k]}  />}

                                                </>

                                            }</>)}

                                    </span>
                        </div>}
                    </>}
                </>)}

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



