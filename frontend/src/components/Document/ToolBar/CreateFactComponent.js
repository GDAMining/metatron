import {Col, Row} from "react-bootstrap";

import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import DeleteIcon from '@mui/icons-material/Delete';

import axios from "axios";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {AppContext} from "../../../App";
import {DeleteRange} from "../../HelperFunctions/HelperFunctions";
import AddIcon from "@mui/icons-material/Add";


function CreateFact(){

    const { concepts,inarel,labels,newfact,sourcetext,expand,sourceconcepts,targettext,targetconcepts,predicatetext,predicateconcepts,relationship,predicate,source,target } = useContext(AppContext);

    const [Labels,SetLabels] = labels
    const [Relationship,SetRelationship] = relationship
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
    const [AssertionModal,SetShowAssertionModal] = useState(true)
    const [NewFact,SetNewFact] = newfact
    const [Expand,SetExpand] = expand






    return(
        <div className='inline'>

            <>
                <Tooltip title="New document assertion">
                    <Button startIcon={<AddIcon />} variant="outlined" color={'primary'} size="small" className={'bt'} onClick={()=> {

                    {/*<Button sx={{width:"150px",height:"30.75px",fontSize:"0.6rem"}} startIcon={<AddIcon />} variant="outlined" color={'primary'} size="small" className={'bt'} onClick={()=> {*/}
                        SetInARel(false);
                        SetSource(false)
                        SetPredicate(false)
                        SetTarget(false)
                        SetPredicateConcepts(false)
                        SetTargetConcepts(false)
                        SetSourceConcepts(false)
                        SetSourceText(false)
                        SetPredicateText(false)
                        SetTargetText(false)
                        SetRelationship(false)
                        // SetInARel(true)
                        // SetInARel(prev=>!prev)
                        SetNewFact(prev=>!prev)
                        SetExpand(false)



                    }} >ASSERTION
                        {/*New Document Assertion*/}
                    </Button>

                </Tooltip>
            </>


        </div>


    );

}
export default CreateFact

// {/*{ShowDeleteAnnotationModal &&*/}
// {/*<Dialog*/}
// {/*    open={ShowDeleteAnnotationModal}*/}
// {/*    onClose={()=>SetShowDeleteAnnotationModal(false)}*/}
//
// {/*    aria-labelledby="alert-dialog-title"*/}
// {/*    aria-describedby="alert-dialog-description"*/}
// {/*>*/}
// {/*    <DialogTitle id="alert-dialog-title">*/}
// {/*        Delete concept*/}
// {/*    </DialogTitle>*/}
// {/*    <DialogContent>*/}
// {/*        <DialogContentText id="alert-dialog-description">*/}
// {/*            Are you sure you want to remove all the annotations for this document?*/}
// {/*        </DialogContentText>*/}
// {/*    </DialogContent>*/}
// {/*    <DialogActions>*/}
// {/*        <Button onClick={()=> {*/}
// {/*            SetShowDeleteAnnotationModal(false);*/}
// {/*        }}>Disagree</Button>*/}
// {/*        <Button onClick={deleteAnnotation} autoFocus>*/}
// {/*            Delete*/}
// {/*        </Button>*/}
// {/*    </DialogActions>*/}
// {/*</Dialog>*/}
// {/*}*/}