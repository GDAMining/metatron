import React, {useState, useEffect, useContext, createContext, useRef} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../RightsSideMenu/rightsidestyles.css'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import {AppContext} from "../../App";
import Chip from "@mui/material/Chip";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


export default function RelationshipComponent(props){
    const { concepts,inarel,source,target,predicate,sourcetext,sourceconcepts,targettext,targetconcepts,predicatetext,predicateconcepts,labels,mentions,relationship } = useContext(AppContext);

    const [Labels,SetLabels] = labels
    const [Relationship,SetRelationship] = relationship
    const [InARel,SetInARel] = inarel
    const [Source,SetSource] = source;
    const [SourceConcepts,SetSourceConcepts] = useState(false);
    const [PredicateConcepts,SetPredicateConcepts] = useState(false);
    const [TargetConcepts,SetTargetConcepts] = useState(false);
    const [SourceText,SetSourceText] = useState(false);
    const [PredicateText,SetPredicateText] = useState(false);
    const [TargetText,SetTargetText] = useState(false);
    const [Target,SetTarget] = target;
    const [Predicate,SetPredicate] = predicate;
    const [MentionsList,SetMentionsList] = mentions;
    const [ConceptsList,SetConceptsList] = concepts;

    useEffect(()=>{
        let source_concepts = []
        if(Source && ConceptsList && MentionsList){
            ConceptsList.map(c=>{
                if(c.mentions === Source){
                    let concetto = {}
                    concetto['concept_url'] = c.concept.concept_url
                    concetto['concept_name'] = c.concept.concept_name
                    concetto['concept_area'] = c.concept.area
                    source_concepts.push(concetto)
                }
            })
        }
        SetSourceConcepts(source_concepts)
        let mention = MentionsList.filter(x=>x.mentions === Source)
        if(mention.length>0){
            SetSourceText(mention[0].mention_text)

        }
    },[Source])

    useEffect(()=>{
        let source_concepts = []
        if(Predicate && ConceptsList && MentionsList){
            ConceptsList.map(c=>{
                if(c.mentions === Predicate){
                    let concetto = {}
                    concetto['concept_url'] = c.concept.concept_url
                    concetto['concept_name'] = c.concept.concept_name
                    concetto['concept_area'] = c.concept.area

                    source_concepts.push(concetto)
                }
            })
        }
        SetPredicateConcepts(source_concepts)
        let mention = MentionsList.filter(x=>x.mentions === Predicate)
        if(mention.length > 0){
            SetPredicateText(mention[0].mention_text)

        }
    },[Predicate])

    useEffect(()=>{
        let source_concepts = []
        if(Target && ConceptsList && MentionsList){
            ConceptsList.map(c=>{
                if(c.mentions === Target){
                    let concetto = {}
                    concetto['concept_url'] = c.concept.concept_url
                    concetto['concept_name'] = c.concept.concept_name
                    concetto['concept_area'] = c.concept.area

                    source_concepts.push(concetto)
                }
            })
        }
        SetTargetConcepts(source_concepts)
        let mention = MentionsList.filter(x=>x.mentions === Target)
        if(mention.length > 0){
            SetTargetText(mention[0].mention_text)

        }
    },[Target])


    function handleClick(e,nodetype){
        e.preventDefault()
        e.stopPropagation()
        console.log('clicked',nodetype)
    }


    return(
        <div>
            <div>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        disabled={!Source && !SourceConcepts}
                    >
                        <div>
                            <Typography variant={'h5'}>Source</Typography>
                            {(!Source && (!SourceConcepts || SourceConcepts.length === 0)) && <>
                                {/*<Typography sx={{ width: '10%', flexShrink: 0,color: 'text.secondary'  }}>*/}

                                {/*</Typography>*/}
                                <Typography >
                                    <Chip color="primary" onClick={(e)=>handleClick(e,'source')} label={'Add source'} />
                                </Typography>

                            </> }
                            {(!Source && SourceConcepts && SourceConcepts.length > 0) &&    <>

                                <Typography >
                                    <b>Concept:</b> {SourceConcepts[0].concept_name}
                                </Typography>

                            </>

                            }


                            {(((Source && !SourceConcepts)||(Source && SourceConcepts)) && SourceText) &&    <>

                                <Typography >
                                    <b>Mention:</b> {SourceText}
                                </Typography>

                            </>

                            }
                        </div>


                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography>
                            {(Source && (SourceConcepts && SourceConcepts.length > 0)) ? <>
                                    <b>Concepts</b>
                                    {SourceConcepts.map(concept=>
                                            <Card variant="outlined">
                                                <CardContent>

                                                    <Typography variant="h6" component="div">
                                                        {concept.concept_name}
                                                    </Typography>
                                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                        {concept.concept_area}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <a href={concept.concept_url}>{concept.concept_url}</a>
                                                    </Typography>
                                                </CardContent>

                                            </Card>




                                        // <><div>{concept.concept_name}</div>
                                        //     <div><a href={concept.concept_url}>{concept.concept_url}</a>
                                        //     </div>
                                        // </>

                                    )}

                                </>

                                : <>
                                    Setting a <b>source</b> is mandatory.
                                </>}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <br/>








            </div>


        </div>
    );
}