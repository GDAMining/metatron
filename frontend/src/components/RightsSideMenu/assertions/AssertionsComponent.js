import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Collapse from '@mui/material/Collapse';

import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../rightsidestyles.css'
import LabelsSelect from '../labels/LabelsSelect'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import axios from "axios";

const checkedIcon = <CheckBoxIcon fontSize="small" />;

import {AppContext} from "../../../App";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";
import RightSideConcept from "../associations/RightSideConcept";
import ChipRel from "../../Annotation/relationship/ChipRelationship";
import RightSideRelation from "../relationships/RightSideRelation";
import SearchIcon from "@material-ui/icons/Search";
import SearchRelationComponent from "../relationships/SearchRelationComponent";
import {RelationConceptContext} from "../../Annotation/concepts/RelationshipConceptModal";
import {ConceptContext} from "../../../BaseIndex";
import EditIcon from '@mui/icons-material/Edit';
import {ClickOnBaseIndex, updateRelMentionColor} from "../../HelperFunctions/HelperFunctions";
import SingleAssertion from "./SingleAssertion";
import RelationshipComponent from "../relationships/RelationshipComponent";
import AddIcon from "@mui/icons-material/Add";
export default function AssertionsList(props){
    const { collection,inarel,document_id,newfact,snackmessage,opensnack,curannotator,username,mentions,newfactin,modifyrel,targettext,predicatetext,sourcetext,targetconcepts,predicateconcepts,predicate,target,source,relationship,relationshipslist,sourceconcepts } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [MentionsList, SetMentionsList] = mentions
    const [NewFact,SetNewFact] = newfact
    const [RelationshipsList, SetRelationshipsList] = relationshipslist
    // const [RelationshipsList, SetRelationshipsList] = useState(false)
    const [OpenSubject,SetOpenSubject] = useState(false)
    const [OpenPredicate,SetOpenPredicate] = useState(false)
    const [OpenObject,SetOpenObject] = useState(false)
    const [OpenAssertions,SetOpenAssertions] = useState(false)
    const [OpenRelation,SetOpenRelation] = useState(false)
    const [SearchSubject, SetSearchSubject] = useState(false)
    const [SearchPredicate, SetSearchPredicate] = useState(false)
    const [SearchObject, SetSearchObject] = useState(false)
    const [InARel,SetInARel] = inarel
    const [Source,SetSource] = source;
    const [SourceConcepts,SetSourceConcepts] = sourceconcepts
    const [PredicateConcepts,SetPredicateConcepts] = predicateconcepts
    const [TargetConcepts,SetTargetConcepts] = targetconcepts
    const [SourceText,SetSourceText] = sourcetext
    const [PredicateText,SetPredicateText] = predicatetext
    const [TargetText,SetTargetText] =targettext
    const [Target,SetTarget] = target;
    const [Predicate,SetPredicate] = predicate;
    const {area,url,name,urlname,description,areas,conceptslist} =  useContext(ConceptContext);
    const [Areas,SetAreas] = areas
    const [ConceptsList,SetConceptsList] = conceptslist
    const [Relationship,SetRelationship] = relationship
    const [SourceFilteredRelations,SetSourceFilteredRelations] = useState(false)
    const [PredicateFilteredRelations,SetPredicateFilteredRelations] = useState(false)
    const [TargetFilteredRelations,SetTargetFilteredRelations] = useState(false)
    const [NewFactInterno,SetNewFactInterno] = newfactin

    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [Username,SetUsername] = username
    const [AddConcept,SetAddConcept] = useState(false)
    const [Options,SetOptions] = useState(false)

    const [AreaToFilter,SetAreaToFilter] = useState(false)
    const [UrlToFilter,SetUrlToFIlter] = useState(false)
    const [ConceptToFilter,SetConceptToFIlter] = useState(false)
    const [ShowReadOnlyRelation,SetShowReadOnlyRelation] = useState(0)
    const [Modify,SetModify] = modifyrel
    const [Assertions,SetAssertions] = useState(false)
    const [SnackMessage,SetSnackMessage] = snackmessage;
    const [OpenSnack,SetOpenSnack] = opensnack


    function closeSearch(e){
        e.preventDefault()
        e.stopPropagation()
        console.log('premo')
        SetSearchObject(false)
        SetSearchPredicate(false)
        SetSearchObject(false)
        if(AreaValue){
            SetAreaToFilter(AreaValue.area)
        }
        if(ConceptValue){
            SetConceptToFIlter(ConceptValue.name)

        }
        if(UrlValue){
            SetUrlToFIlter(UrlValue.url)

        }
    }
    function copyAssertion(e,rel){
        e.preventDefault()
        e.stopPropagation()
        SetOpenSnack(true)
        SetSnackMessage({'message':'Saving...'})
        console.log('premo')
        axios.post('relationships/copy_assertion',{assertion:rel}).then(r=>console.log(r))
            .then(r=> {
                SetSnackMessage({'message':'Saved'})

            }).catch(error=>                SetSnackMessage({'message':'ERROR'})
        )
    }

    function deleteRelation(e,relation){
        e.preventDefault();
        e.stopPropagation();
        let source = relation['subject']
        let predicate = relation['predicate']
        let target = relation['object']
        SetOpenSnack(true)
        axios.delete('relationships/delete',{data:{source:source,predicate:predicate,target:target}}).then(response=>{
            SetRelationshipsList(response.data)
            SetOpenRelation(false)
            SetSource(false)
            SetPredicate(false)
            SetTarget(false)
            SetTargetText(false)
            SetPredicateText(false)
            SetSourceText(false)
            SetTargetConcepts(false)
            SetPredicateConcepts(false)
            SetSourceConcepts(false)
            SetInARel(false)
            SetSnackMessage({'message':'Saved'})

        }).catch(error=>{
            SetSnackMessage({'message':'ERROR'})
            console.log(source,predicate,target)

        })
    }



    let names = []
    ConceptsList.map(x=>{
        names.push(x.name)
    })
    let urls = []
    ConceptsList.map(x=>{
        urls.push(x.url)
    })
    const [AreaValue,SetAreaValue] = area
    const [ConceptValue,SetConceptValue] =  name
    const [UrlValue,SetUrlValue] = url
    const [Value,SetValue] = useState(null)
    // const sorted_mentions = RelationshipsList.sort(function(a, b) { return a.start - b.start; })
    // const sorted_mentions_10 = sorted_mentions.slice(0,5)
    // const sorted_mentions_last = sorted_mentions.slice(5,sorted_mentions.length)



    useEffect(()=>{
        if(RelationshipsList && RelationshipsList['all_concepts']){
            SetAssertions(RelationshipsList['all_concepts'])
        }
    },[RelationshipsList])



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

    useEffect(()=>{
        // let mentions = props.mention.mentions.split(' ')
        removeAllChildren('source')
        removeAllChildren('predicate')
        removeAllChildren('target')
        if(Relationship ){


            let source = Relationship['subject']
            if(Object.keys(source['mention']).length > 0) {
                let start_source = source['mention']['start']
                let stop_source = source['mention']['stop']
                let mention_source = MentionsList.find(x=>x['start'] === start_source && x['stop'] === stop_source)
                let mentions_source = mention_source.mentions
                console.log(mention_source,mentions_source)
                SetSource(mentions_source)
                updateRelMentionColor('source',mentions_source)

            }else if (Object.keys(source['concept']).length > 0){
                SetSourceConcepts([source['concept']])
                SetSource(false)
                SetSourceText(source['concept']['concept_name'])
            }


            let predicate = Relationship['predicate']
            console.log(predicate['mention'])
            if(Object.keys(predicate['mention']).length > 0) {
                let start_predicate = predicate['mention']['start']
                let stop_predicate = predicate['mention']['stop']
                let mention_predciate = MentionsList.find(x => x['start'] === start_predicate && x['stop'] === stop_predicate)
                let mentions_predciate = mention_predciate.mentions
                console.log(mention_predciate,mentions_predciate)
                SetPredicate(mentions_predciate)
                updateRelMentionColor('predicate',mentions_predciate)

                // if(mentions.indexOf(mentions_predciate) !== -1){
                //     // questa è la source
                //     changeRole('Predicate')
                // }
            }else if (Object.keys(predicate['concept']).length > 0){
                SetPredicateConcepts([predicate['concept']])
                SetPredicate(false)
                SetPredicateText(source['concept']['concept_name'])
            }

            let target = Relationship['object']
            if(Object.keys(target['mention']).length > 0) {
                let start_target = target['mention']['start']
                let stop_target = target['mention']['stop']
                let mention_target = MentionsList.find(x=>x['start'] === start_target && x['stop'] === stop_target)
                let mentions_target = mention_target.mentions
                console.log(mention_target,mentions_target)
                SetTarget(mentions_target)

                updateRelMentionColor('target',mentions_target)

            }else if (Object.keys(target['concept']).length > 0){
                SetTargetConcepts([target['concept']])
                SetTarget(false)
                SetTargetText(source['concept']['concept_name'])
            }

        }
    },[Relationship])






    return(
        <div id='rightsiderelationshipsclass'>
            <h5>
                Document Assertions
            </h5>
            {(NewFactInterno) ? <><RelationshipComponent /></> :
            <div>
                {(Assertions && RelationshipsList) ? <>
                            <div style={{marginTop:'15px'}}>
                                {Assertions.map((rel,i)=>
                                    <>
                                        <div className='areas_header' ><span onClick={(e)=> {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if(OpenRelation === false || OpenRelation !== 'assertion' + '_' + area + '_' + i.toString()){
                                                SetOpenRelation('assertion' + '_' + area + '_' + i.toString())
                                                SetRelationship(rel)

                                            }else{
                                                SetOpenRelation(false)
                                                SetRelationship(false)

                                                ClickOnBaseIndex(e, InARel, SetInARel)



                                            }
                                        }}  className={OpenRelation === 'assertion' + '_' + area + '_' + i.toString() ? 'selected_item':''}>Assertion {(i+1).toString()}</span>
                                            {CurAnnotator === Username ? <><div style={{display:"inline-block",marginLeft:'10px'}}>
                                                {OpenRelation === 'assertion' + '_' + area + '_' + i.toString() &&
                                                <div style={{display:"inline-block"}}>
                                                    <IconButton onClick={(e) => {
                                                    // SetInARel(true);
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    SetNewFactInterno(true)
                                                    SetModify(true)
                                                    SetOpenRelation(false)



                                                }}>
                                                    <EditIcon/>
                                                </IconButton>


                                                    <IconButton onClick={(e)=>deleteRelation(e,rel)}>
                                                    <DeleteIcon />
                                                    </IconButton>

                                                    </div>


                                                }

                                            </div>
                                           </> : <>
                                                <div style={{display:"inline-block"}}>
                                                    <IconButton onClick={(e)=>copyAssertion(e,rel)}>
                                                        <AddIcon />
                                                    </IconButton>

                                                </div>
                                            </>}

                                        </div>
                                        {OpenRelation === 'assertion'+'_'+area+'_'+i.toString() &&
                                            <SingleAssertion open={OpenRelation === 'assertion'+'_'+area+'_'+i.toString()} time={rel.time} count={rel.count} />
                                         }

                                    </>)}




                            </div>
                            {/*)}*/}
                        {/*</>*/}

                        {/*// </Collapse>*/}


                    </>
                    : <CircularProgress />}
            </div>}


        </div>
    );
}