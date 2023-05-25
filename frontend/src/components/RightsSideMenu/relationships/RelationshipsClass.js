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
import { cloneDeep } from 'lodash';
const checkedIcon = <CheckBoxIcon fontSize="small" />;

import {AppContext} from "../../../App";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";
import RightSideConcept from "../associations/RightSideConcept";
import ChipRel from "../../Annotation/relationship/ChipRelationship";
import RightSideRelation from "./RightSideRelation";
import SearchIcon from "@material-ui/icons/Search";
import SearchRelationComponent from "./SearchRelationComponent";
import {RelationConceptContext} from "../../Annotation/concepts/RelationshipConceptModal";
import {ConceptContext} from "../../../BaseIndex";
import {RelSearchContext} from "../../../BaseIndex";
import EditIcon from '@mui/icons-material/Edit';
import {ClickOnBaseIndex, updateRelMentionColor, waitForElm} from "../../HelperFunctions/HelperFunctions";
import RelationshipComponent from "./RelationshipComponent";
// import * as URL from "url";
import AddIcon from '@mui/icons-material/Add';

export default function RelationshipsClass(props){
    const { collection,inarel,document_id,username,curannotator,snackmessage,opensnack,mentions,showrelspannel,readonlyrelation,modifyrel,targettext,predicatetext,sourcetext,targetconcepts,predicateconcepts,predicate,target,source,relationship,relationshipslist,sourceconcepts } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [MentionsList, SetMentionsList] = mentions
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [Username,SetUsername] = username
    const [RelationshipsList, SetRelationshipsList] = relationshipslist
    const [RelationshipsListFiltered, SetRelationshipsListFiltered] = useState(false)
    const [LoadingRel,SetLoadingRel] = useState(false)
    // const [RelationshipsList, SetRelationshipsList] = useState(false)
    const [OpenSubject,SetOpenSubject] = useState(false)
    const [OpenPredicate,SetOpenPredicate] = useState(false)
    const [OpenObject,SetOpenObject] = useState(false)
    const [OpenOther,SetOpenOther] = useState(false)
    const {areaSearch,urlSearch,nameSearch,areasSearch,searchsubject,searchpredicate,searchobject} =  useContext(ConceptContext);

    const [OpenRelation,SetOpenRelation] = useState(false)
    // const {searchsubj,searchobj,searchpredicate} =  useContext(RelSearchContext);
    const [SearchSubject, SetSearchSubject] = searchsubject
    const [SearchPredicate, SetSearchPredicate] = searchpredicate
    const [SearchObject, SetSearchObject] = searchobject
    // const [SearchSubject, SetSearchSubject] = useState(false)
    // const [SearchPredicate, SetSearchPredicate] = useState(false)
    // const [SearchObject, SetSearchObject] = useState(false)
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
    const [SnackMessage,SetSnackMessage] = snackmessage;
    const [OpenSnack,SetOpenSnack] = opensnack
    const {area,url,name,urlname,description,areas,conceptslist} =  useContext(ConceptContext);
    const [Areas,SetAreas] = areas
    const [RelCount,SetRelCount] = useState(0)
    const [ConceptsList,SetConceptsList] = conceptslist
    const [Relationship,SetRelationship] = relationship
    const [SourceFilteredRelations,SetSourceFilteredRelations] = useState(false)
    const [PredicateFilteredRelations,SetPredicateFilteredRelations] = useState(false)
    const [TargetFilteredRelations,SetTargetFilteredRelations] = useState(false)
    const [OtherFilteredRelations,SetOtherFilteredRelations] = useState(false)
    const [ShowRels,SetShowRels] = showrelspannel

    const [AddArea,SetAddArea] = useState(false)
    const [AddConcept,SetAddConcept] = useState(false)
    const [Options,SetOptions] = useState(false)

    const [AreaToFilter,SetAreaToFilter] = useState(false)
    const [UrlToFilter,SetUrlToFIlter] = useState(false)
    const [ConceptToFilter,SetConceptToFIlter] = useState(false)
    const [ShowReadOnlyRelation,SetShowReadOnlyRelation] = readonlyrelation
    const [Modify,SetModify] = modifyrel
    let names = []
    ConceptsList.map(x=>{
        names.push(x.name)
    })
    let urls = []
    ConceptsList.map(x=>{
        urls.push(x.url)
    })
    // const [AreaValue,SetAreaValue] = area
    // const [ConceptValue,SetConceptValue] =  name
    // const [UrlValue,SetUrlValue] = url

    const [AreaValue,SetAreaValue] = areaSearch
    const [ConceptValue,SetConceptValue] = nameSearch
    const [UrlValue,SetUrlValue] = urlSearch
    const [Value,SetValue] = useState(null)
    // const sorted_mentions = RelationshipsList.sort(function(a, b) { return a.start - b.start; })
    // const sorted_mentions_10 = sorted_mentions.slice(0,5)
    // const sorted_mentions_last = sorted_mentions.slice(5,sorted_mentions.length)


    useEffect(()=>{
        async function fetchRelationships(){
            const response = await axios.get('relationships',{params:{user:CurAnnotator}});
            // console.log('request',response)
            SetRelationshipsList(response.data)
            return response
        }
        fetchRelationships()

    },[])

    useEffect(()=>{
        if(!InARel){
            SetOpenRelation(false)
        }

    },[InARel])

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
    function copyRelation(e,relation){
        e.preventDefault();
        e.stopPropagation();
        let source = relation['subject']
        let predicate = relation['predicate']
        let target = relation['object']
        SetOpenSnack(true)
        SetSnackMessage({'message':'Saving...'})

        axios.post('relationships/copy',{subject:source,predicate:predicate,object:target,user:CurAnnotator}).then(response=>{
            console.log(response)
            SetSnackMessage({'message':'Saved'})
        }).catch(error=> {
            SetSnackMessage({'message': 'ERROR'})

            console.log(source, predicate, target)
        })


    }

    function deleteRelation(e,relation){
        e.preventDefault();
        e.stopPropagation();
        let source = relation['subject']
        let predicate = relation['predicate']
        let target = relation['object']
        SetOpenSnack(true)
        SetSnackMessage({'message':'Deleting...'})
        axios.delete('relationships',{data:{source:source,predicate:predicate,target:target}}).then(response=>{
            SetRelationshipsList(response.data)
            SetSource(false)
            SetPredicate(false)
            SetTarget(false)
            SetTargetText(false)
            SetPredicateText(false)
            SetSourceText(false)
            SetTargetConcepts(false)
            SetPredicateConcepts(false)
            SetSourceConcepts(false)
            SetLoadingRel(false)
            SetInARel(false)
            SetSnackMessage({'message':'Deleted'})

        }).catch(error=>
        console.log(source,predicate,target))
    }

    useEffect(()=>{
        if(RelationshipsListFiltered && (RelationshipsListFiltered['subject'] || RelationshipsListFiltered['object'] || RelationshipsListFiltered['all_mentions'] || RelationshipsListFiltered['predicate'])){
            SetSourceFilteredRelations(RelationshipsListFiltered['subject'])
            SetPredicateFilteredRelations(RelationshipsListFiltered['predicate'])
            SetTargetFilteredRelations(RelationshipsListFiltered['object'])
            SetOtherFilteredRelations(RelationshipsListFiltered['all_mentions'])
            // if (RelationshipsListFiltered['subject'].length > 0){
            let found = false;
            Object.keys(RelationshipsListFiltered['subject']).map(area=>{
                if(RelationshipsListFiltered['subject'][area].length > 0){
                    SetInARel(true)

                    SetOpenSubject(true)
                    SetRelationship(RelationshipsListFiltered['subject'][area][0])
                    found = true
                    SetOpenRelation('subject' + '_' + area + '_0' )
                }
            })
            Object.keys(RelationshipsListFiltered['object'] && !found).map(area => {
                if (RelationshipsListFiltered['object'][area].length > 0) {
                    SetInARel(true)

                    SetRelationship(RelationshipsListFiltered['object'][area][0])
                    found = true
                    SetOpenObject(true)
                    SetOpenRelation('object' + '_' + area + '_0' )

                }
            })

            // }else if(RelationshipsListFiltered['object'].length > 0){
            Object.keys(RelationshipsListFiltered['predicate'] && !found).map(area=>{
                if(RelationshipsListFiltered['predicate'][area].length > 0){
                    SetInARel(true)

                    SetRelationship(RelationshipsListFiltered['predicate'][area][0])
                    SetOpenPredicate(true)
                    found = true
                    SetOpenRelation('predicate' + '_' + area + '_0')

                }
            })

            Object.keys(RelationshipsListFiltered['all_mentions']).map(area=>{
                if(RelationshipsListFiltered['all_mentions'][area].length > 0 && !found){
                    SetInARel(true)

                    SetRelationship(RelationshipsListFiltered['all_mentions'][area][0])
                    SetOpenOther(true)
                    found = true
                    SetOpenRelation('other' + '_' + area + '_0' )


                }
            })
        }
        else if(!RelationshipsListFiltered){
            SetRelationshipsListFiltered(RelationshipsList)
        }
    },[RelationshipsListFiltered])

    useEffect(()=>{

            SetRelationshipsListFiltered(RelationshipsList)
            SetRelCount(RelationshipsList['counttotal'])
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
        console.log('relationship',Relationship)
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

                waitForElm(".source").then(r=>{
                    r.scrollIntoView({ behavior: "smooth"})
                })

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







    useEffect(()=>{
        console.log(AreaValue,ConceptValue,UrlValue)

        let url = null
        let name = null
        let area = null
        let relations_area = []
        let relations_name = []
        let relations_url = []
        let pos = null
        if(SearchPredicate === true){
            pos = 'predicate'
        }
        else if(SearchObject){
            pos = 'object'
        }
        else if(SearchSubject){
            pos = 'subject'
        }


        // let relationships = RelationshipsList
        let relationships = _.cloneDeep(RelationshipsList)
        console.log('relationships',relationships)
        if(RelationshipsList && ShowRels ) {


            if (ConceptValue !== null && UrlValue !== null && AreaValue !== null) {
                Object.keys(RelationshipsList[pos]).map(k => {
                    // relationships[pos][k] = RelationshipsList[pos][k]
                    let relationships_copy = _.cloneDeep(relationships)
                    let index_to_del = []
                    relationships_copy[pos][k].map((relation, i) => {
                        if (relation['anchor'] !== ConceptValue.name || relation['anchor_url'] !== UrlValue.url || relation['anchor_area'] !== AreaValue.area) {
                            // relationships[pos][k].splice(i, 1)
                            relationships[pos][k].splice(i, 1, null);
                        }
                    })
                    relationships[pos][k] = relationships[pos][k].filter(function (el) {
                        return el !== null;
                    });


                })
            } else if (ConceptValue !== null && UrlValue !== null) {
                Object.keys(RelationshipsList[pos]).map(k => {
                    // relationships[pos][k] = RelationshipsList[pos][k]
                    let relationships_copy = _.cloneDeep(relationships)
                    relationships_copy[pos][k].map((relation, i) => {
                        if (relation['anchor'] !== ConceptValue.name || relation['anchor_url'] !== UrlValue.url) {
                            // relationships[pos][k].splice(i, 1)
                            relationships[pos][k].splice(i, 1, null);

                        }
                    })
                    relationships[pos][k] = relationships[pos][k].filter(function (el) {
                        return el !== null;
                    });


                })
            } else if (UrlValue !== null && AreaValue !== null) {
                Object.keys(RelationshipsList[pos]).map(k => {
                    // relationships[pos][k] = RelationshipsList[pos][k]

                    let relationships_copy = _.cloneDeep(relationships)
                    relationships_copy[pos][k].map((relation, i) => {
                        if (relation['anchor_area'] !== AreaValue.area || relation['anchor_url'] !== UrlValue.url) {
                            // relationships[pos][k].splice(i, 1)
                            relationships[pos][k].splice(i, 1, null);

                        }
                    })
                    relationships[pos][k] = relationships[pos][k].filter(function (el) {
                        return el !== null;
                    });


                })
            } else if (ConceptValue !== null && AreaValue !== null) {
                Object.keys(RelationshipsList[pos]).map(k => {
                    // relationships[pos][k] = RelationshipsList[pos][k]
                    let relationships_copy = _.cloneDeep(relationships)
                    relationships_copy[pos][k].map((relation, i) => {
                        if (relation['anchor'] !== ConceptValue.name || relation['anchor_area'] !== AreaValue.area) {
                            // relationships[pos][k].splice(i, 1)
                            relationships[pos][k].splice(i, 1, null);

                        }
                    })
                    relationships[pos][k] = relationships[pos][k].filter(function (el) {
                        return el !== null;
                    });


                })
            } else if (ConceptValue !== null) {
                Object.keys(RelationshipsList[pos]).map(k => {
                    // relationships[pos][k] = RelationshipsList[pos][k]
                    let relationships_copy = _.cloneDeep(relationships)
                    relationships_copy[pos][k].map((relation, i) => {
                        if (relation['anchor'] !== ConceptValue.name) {
                            // relationships[pos][k].splice(i, 1)
                            relationships[pos][k].splice(i, 1, null);

                        }
                    })
                    relationships[pos][k] = relationships[pos][k].filter(function (el) {
                        return el !== null;
                    });


                })
            } else if (AreaValue !== null) {
                Object.keys(RelationshipsList[pos]).map(k => {
                    if (k === AreaValue.area) {
                        relationships[pos][k] = RelationshipsList[pos][k]
                    }

                })
            } else if (UrlValue !== null) {
                Object.keys(RelationshipsList[pos]).map(k => {
                    // relationships[pos][k] = RelationshipsList[pos][k]
                    let relationships_copy = _.cloneDeep(relationships)
                    relationships_copy[pos][k].map((relation, i) => {
                        if (relation['anchor_url'] !== UrlValue.url) {
                            // relationships[pos][k].splice(i, 1)
                            relationships[pos][k].splice(i, 1, null);

                        }
                    })
                    relationships[pos][k] = relationships[pos][k].filter(function (el) {
                        return el !== null;
                    });


                })
            }
            // else if(AreaValue === null || ConceptValue === null || UrlValue === null){
            //     relationships = Re
            // }
            console.log('relationships filtered',relationships)
            SetRelationshipsListFiltered(relationships)
        }


    },[ConceptValue,UrlValue,AreaValue])


    function clearParams(){
        SetAreaValue(null)
        SetConceptValue(null)
        SetUrlValue(null)
        SetOpenRelation(false)
        SetInARel(false)
        SetModify(false)
        SetShowReadOnlyRelation(false)
    }




    useEffect(()=>{
        if(SearchObject){
            SetSearchPredicate(false)
            SetSearchSubject(false)
        }
    },[SearchObject])

    useEffect(()=>{
        if(SearchPredicate){
            SetSearchObject(false)
            SetSearchSubject(false)
        }

    },[SearchPredicate])

    useEffect(()=>{
        if(SearchSubject){
            SetSearchPredicate(false)
            SetSearchObject(false)
        }
    },[SearchSubject])

    return(
        <div id='rightsiderelationshipsclass'>
            <h5>
                Relationships
                {/*<i>({RelationshipsList.length.toString()})</i>*/}
            </h5>
            {/*<div><b>{RelationshipsList}</b> distinct relationships found</div>*/}
            {/*{MentionsList && <div><i><b>{MentionsList.length}</b> mentions</i></div>}*/}

            {(RelationshipsList.length === 0 || !RelationshipsList) && <div>No relationships found</div>}


            {(Modify && InARel) ? <RelationshipComponent /> :
            <div>
                {(RelationshipsList && SourceFilteredRelations && PredicateFilteredRelations && TargetFilteredRelations) ? <>
                        <h6 className='areas_header inlineblock' onClick={(e)=> {
                            clearParams()

                            if(OpenSubject){
                                SetOpenSubject(false)
                                SetSearchSubject(false)


                            }else{
                                SetOpenSubject(true)
                            }
                        }}>Subject</h6>
                        <div className={"inlineblock"}><IconButton color="primary" aria-label="upload picture" component="label" onClick={(e)=> {
                            e.preventDefault()
                            e.stopPropagation()
                            clearParams()
                            if(SearchSubject === false){
                                SetOpenSubject(true);
                            }
                            SetSearchSubject(prev => !prev);
                            // SetSearchSubject(prev => !prev);
                            // if(OpenSubject){
                            //     SetSearchSubject(prev => !prev);
                            //
                            // }


                        }}>
                            <SearchIcon />
                        </IconButton></div>
                        <Collapse in={SearchSubject}>
                            <div className={'search_container'}>
                                <SearchRelationComponent closeSearch={closeSearch}/>
                            </div>

                        </Collapse>
                        <Collapse in={OpenSubject}>
                            <>
                                {Object.keys(SourceFilteredRelations).length > 0 && Object.keys(SourceFilteredRelations).map(area=>
                                    <div style={{marginTop:'15px',paddingLeft:'5%'}}>
                                        {SourceFilteredRelations[area] && SourceFilteredRelations[area].length > 0 && <i><h6>{area} ({SourceFilteredRelations[area].length})</h6></i>}
                                        {SourceFilteredRelations[area].map((rel,i)=>
                                            <>
                                                <div className='areas_header_instance' ><span onClick={(e)=> {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    if(OpenRelation === false || OpenRelation !== 'subject' + '_' + area + '_' + i.toString()){
                                                        SetOpenRelation('subject' + '_' + area + '_' + i.toString())
                                                        SetShowReadOnlyRelation(true)
                                                        SetSource(false)
                                                        SetPredicate(false)
                                                        SetTarget(false)
                                                        SetInARel(true)
                                                        SetRelationship(rel)
                                                    }else{
                                                        SetOpenRelation(false)
                                                        SetModify(false)
                                                        SetShowReadOnlyRelation(false)
                                                        SetInARel(false)
                                                        SetRelationship(false)
                                                        SetSource(false)
                                                        SetPredicate(false)
                                                        SetTarget(false)
                                                        ClickOnBaseIndex(e,InARel,SetInARel)
                                                    }

                                                }} className={OpenRelation === 'subject' + '_' + area + '_' + i.toString() ? 'selected_item':''}>{rel['anchor']}</span>
                                                    {CurAnnotator === Username ? <><div style={{display:"inline-block",marginLeft:'10px'}}>
                                                        {OpenRelation === 'subject' + '_' + area + '_' + i.toString() &&                                                             <div style={{display:"inline-block"}}>
                                                            <IconButton onClick={(e)=> {
                                                        // SetInARel(true);
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                        SetShowReadOnlyRelation(false);
                                                        SetModify(true)
                                                    }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                            <IconButton onClick={(e)=>deleteRelation(e,rel)}>
                                                            <DeleteIcon />
                                                            </IconButton>

                                                            </div>

                                                        }

                                                </div>
                                                    </> : <>
                                                        <div style={{display:"inline-block"}}>
                                                            <IconButton onClick={(e)=>copyRelation(e,rel)}>
                                                                <AddIcon />
                                                            </IconButton>

                                                        </div>

                                                    </>}
                                                </div>

                                                {OpenRelation === 'subject'+'_'+area+'_'+i.toString() && <Collapse in={OpenRelation === 'subject'+'_'+area+'_'+i.toString()}><RightSideRelation time={rel.time} count={rel.count}/>
                                                </Collapse> }

                                            </>)}




                                    </div>

                                )}
                            </>

                        </Collapse>

                    <hr/>
                        <h6 className='areas_header inlineblock' onClick={(e)=> {
                            clearParams()

                            if(OpenPredicate){
                                SetOpenPredicate(false)
                                SetSearchPredicate(false)
                            }else{
                                SetOpenPredicate(true)
                            }
                        }}>Predicate</h6>
                        <div className={"inlineblock"}><IconButton color="primary" aria-label="upload picture" component="label" onClick={(e)=> {
                            e.preventDefault()
                            e.stopPropagation()
                            clearParams()
                            if(SearchPredicate === false){
                                SetOpenPredicate(true);
                            }
                            SetSearchPredicate(prev => !prev);
                            // SetSearchPredicate(prev => !prev);

                        }}>
                            <SearchIcon />
                        </IconButton></div>
                        <Collapse in={SearchPredicate}>
                            <div className={'search_container'}>
                                <SearchRelationComponent closeSearch={closeSearch}/>
                            </div>

                        </Collapse>
                        <Collapse in={OpenPredicate}>
                        {Object.keys(PredicateFilteredRelations).length > 0 && Object.keys(PredicateFilteredRelations).map(area=>
                            <div style={{marginTop:'15px',paddingLeft:'5%'}}>
                                {PredicateFilteredRelations[area] && PredicateFilteredRelations[area].length > 0 &&<i> <h6>{area} ({PredicateFilteredRelations[area].length})</h6></i>}
                                {PredicateFilteredRelations[area].map((rel,i)=>
                                    <>
                                        <div className='areas_header_instance' ><span onClick={(e)=> {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if(OpenRelation === false || OpenRelation !== 'predicate' + '_' + area + '_' + i.toString()){
                                                SetShowReadOnlyRelation(true)
                                                SetOpenRelation('predicate' + '_' + area + '_' + i.toString())

                                                SetSource(false)
                                                SetPredicate(false)
                                                SetTarget(false)
                                                SetInARel(true)
                                                SetRelationship(rel)

                                            }else{
                                                SetOpenRelation(false)
                                                SetShowReadOnlyRelation(false)
                                                SetInARel(false)
                                                SetModify(false)
                                                SetRelationship(false)
                                                SetSource(false)
                                                SetPredicate(false)
                                                SetTarget(false)
                                                ClickOnBaseIndex(e, InARel, SetInARel)


                                            }
                                        }} className={OpenRelation === 'predicate' + '_' + area + '_' + i.toString() ? 'selected_item':''}>{rel['anchor']}</span>

                                            {CurAnnotator === Username ? <><div style={{display:"inline-block",marginLeft:'10px'}}>
                                                {OpenRelation === 'predicate' + '_' + area + '_' + i.toString() &&
                                                <div style={{display:"inline-block"}}>
                                                    <IconButton onClick={(e)=> {
                                                    // SetInARel(true);
                                                    e.preventDefault()
                                                    e.stopPropagation()

                                                    SetShowReadOnlyRelation(false);
                                                    SetModify(true)
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                                    <IconButton onClick={(e)=>deleteRelation(e,rel)}>
                                                    <DeleteIcon />
                                                    </IconButton>

                                                    </div>

                                                }

                                            </div>
                                            </> : <>
                                            <div style={{display:"inline-block"}}>
                                                <IconButton onClick={(e)=>copyRelation(e,rel)}>
                                                    <AddIcon />
                                                </IconButton>

                                            </div>

                                            </>}
                                        </div>
                                        {OpenRelation === 'predicate'+'_'+area+'_'+i.toString() && <Collapse in={OpenRelation === 'predicate'+'_'+area+'_'+i.toString()}><RightSideRelation time={rel.time} count={rel.count}/>
                                        </Collapse> }

                                    </>)}




                            </div>
                        )}
                    </Collapse>

                    <hr/>
                        <h6 className='areas_header inlineblock' onClick={(e)=> {
                            clearParams()

                            if(OpenObject){
                                SetOpenObject(false)
                                SetSearchObject(false)
                            }else{
                                SetOpenObject(true)
                            }
                        }}>Object</h6>
                        <div className={"inlineblock"}><IconButton color="primary" aria-label="upload picture" component="label" onClick={(e)=> {
                            e.preventDefault()
                            e.stopPropagation()
                            clearParams()
                            if(SearchObject === false){
                                SetOpenObject(true);
                            }
                            SetSearchObject(prev => !prev);
                            // if(OpenObject){
                            //     SetSearchObject(prev => !prev);
                            //
                            // }


                        }}>
                            <SearchIcon />
                        </IconButton></div>
                        <Collapse in={SearchObject}>
                            <div className={'search_container'}>
                                <SearchRelationComponent closeSearch={closeSearch}/>
                            </div>

                        </Collapse>
                        <Collapse in={OpenObject}><>
                            {Object.keys(TargetFilteredRelations).length > 0 && Object.keys(TargetFilteredRelations).map(area=>
                                <div style={{marginTop:'15px',paddingLeft:'5%'}}>
                                    {TargetFilteredRelations[area] && TargetFilteredRelations[area].length > 0 && <i><h6>{area} ({TargetFilteredRelations[area].length})</h6></i>}
                                    {TargetFilteredRelations[area].map((rel,i)=>
                                        <>
                                            <div className='areas_header_instance' ><span onClick={(e)=> {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                if(OpenRelation === false || OpenRelation !== 'object' + '_' + area + '_' + i.toString()){
                                                    SetOpenRelation('object' + '_' + area + '_' + i.toString())
                                                    SetShowReadOnlyRelation(true)
                                                    SetSource(false)
                                                    SetPredicate(false)
                                                    SetTarget(false)
                                                    SetInARel(true)
                                                    SetRelationship(rel)

                                                }else{
                                                    SetOpenRelation(false)
                                                    SetShowReadOnlyRelation(false)
                                                    SetInARel(false)
                                                    SetRelationship(false)
                                                    SetSource(false)
                                                    SetPredicate(false)
                                                    SetTarget(false)
                                                    SetModify(false)
                                                    ClickOnBaseIndex(e, InARel, SetInARel)



                                                }
                                            }}  className={OpenRelation === 'object' + '_' + area + '_' + i.toString() ? 'selected_item':''}>{rel['anchor']}</span>
                                                {Username === CurAnnotator ? <><div style={{display:"inline-block",marginLeft:'10px'}}>
                                                    {OpenRelation === 'object' + '_' + area + '_' + i.toString() &&
                                                    <div style={{display:"inline-block"}}>
                                                        <IconButton onClick={(e) => {
                                                        // SetInARel(true);
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        SetShowReadOnlyRelation(false);
                                                        SetModify(true);


                                                    }}>
                                                        <EditIcon/>
                                                    </IconButton>
                                                        <IconButton onClick={(e)=>deleteRelation(e,rel)}>
                                                        <DeleteIcon />
                                                        </IconButton>

                                                        </div>}

                                                </div>
                                                </> : <>
                                                <div style={{display:"inline-block"}}>
                                                    <IconButton onClick={(e)=>copyRelation(e,rel)}>
                                                        <AddIcon />
                                                    </IconButton>

                                                </div>

                                            </>}
                                            </div>
                                            {OpenRelation === 'object'+'_'+area+'_'+i.toString() && <Collapse in={OpenRelation === 'object'+'_'+area+'_'+i.toString()}><RightSideRelation time={rel.time} count={rel.count} />
                                            </Collapse> }

                                        </>)}




                                </div>
                            )}
                        </>

                        </Collapse>
                        <hr/>





                        <h6 className='areas_header inlineblock' onClick={(e)=> {
                            clearParams()

                            SetOpenOther(prev=>!prev)
                        }}>Other</h6>

                        <Collapse in={OpenOther}><>
                                <div style={{marginTop:'15px',paddingLeft:'5%'}}>
                                    {OtherFilteredRelations.map((rel,i)=>
                                        <>
                                            <div className='areas_header_instance' ><span onClick={(e)=> {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                if(OpenRelation === false || OpenRelation !== 'other' + '_' + area + '_' + i.toString()){
                                                    SetOpenRelation('other' + '_' + area + '_' + i.toString())
                                                    SetShowReadOnlyRelation(true)
                                                    SetSource(false)
                                                    SetPredicate(false)
                                                    SetTarget(false)
                                                    SetInARel(true)
                                                    SetRelationship(rel)

                                                }else{
                                                    SetOpenRelation(false)
                                                    SetShowReadOnlyRelation(false)
                                                    SetInARel(false)
                                                    SetRelationship(false)
                                                    SetSource(false)
                                                    SetPredicate(false)
                                                    SetTarget(false)
                                                    SetModify(false)
                                                    ClickOnBaseIndex(e, InARel, SetInARel)



                                                }
                                            }}  className={OpenRelation === 'other' + '_' + area + '_' + i.toString() ? 'selected_item':''}>Relation {(i+1).toString()}</span>
                                                <div style={{display:"inline-block",marginLeft:'10px'}}>
                                                    {OpenRelation === 'other' + '_' + area + '_' + i.toString() &&
                                                    <div style={{display:"inline-block"}}>

                                                        <IconButton onClick={(e) => {
                                                        // SetInARel(true);
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        SetShowReadOnlyRelation(false);
                                                        SetModify(true);


                                                    }}>
                                                        <EditIcon/>
                                                    </IconButton>
                                                        <IconButton onClick={(e)=>deleteRelation(e,rel)}>
                                                        <DeleteIcon />
                                                        </IconButton>

                                                        </div>}

                                                </div>

                                            </div>
                                            {OpenRelation === 'other'+'_'+area+'_'+i.toString() && <Collapse in={OpenRelation === 'other'+'_'+area+'_'+i.toString()}><RightSideRelation time={rel.time} count={rel.count} />
                                            </Collapse> }

                                        </>)}




                                </div>
                            {/*)}*/}
                        </>

                        </Collapse>
                    </>
                    : <CircularProgress />}
            </div>}


        </div>
    );
}