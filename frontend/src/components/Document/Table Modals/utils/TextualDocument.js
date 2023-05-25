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

export default function TextualDocument(props){
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



