import {Col, Row} from "react-bootstrap";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../../App";

function TransferAnnotationDialog(props){
    const [OptionsFrom,SetOptionsFrom] = useState(false)
    const { username,users } = useContext(AppContext);
    const [Username,SetUsername] = username
    const [DocAnno,SetDocAnno] = useState(false)

    useEffect(()=>{
        console.log('opt',props.options)
        var forbidden = ['All Tech', 'All Beginner', 'All Professor', 'All Expert', 'All Student', 'All Admin']
        var final_opt_from = []
        if(props.options !== false && props.options.length > 0){
            props.options.map((p,i)=>{
                if(forbidden.indexOf(p.username) < 0){
                    final_opt_from.push(p)
                }
            })
        }
        SetOptionsFrom(final_opt_from)


    },[props.options])

    useEffect(()=>{
        console.log('memberfrom',props.memberfrom)
        if (props.memberfrom){
            axios.get('get_user_annotation_count_per_collection',{params:{collection:props.collection.cid,user:props.memberfrom}})
                .then((response)=>{
                    SetDocAnno(response.data['count'])
                })
                .catch(error=>{
                    console.log('error')
                })
        }

    },[props.memberfrom])





    return(
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth='md'
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Transfer annotations
            </DialogTitle>
            <DialogContent>
                You can transfer the annotation of a user to one or more users the collection is shared with.<br/> If you decide to <b>overwrite</b> the annotations, the new annotations will replace yours, otherwise the new annotations will be added only for those documents not annotated yet.
                <div style={{marginTop:'5%'}}>
                {OptionsFrom.length > 0 && <div style={{marginTop:'2%',marginBottom:'2%'}}><Autocomplete
                    id="transferFrom"
                    sx={{width:'100%',marginTop:'2%'}}
                    // getOptionDisabled={(option) =>
                    //     props.memberto.indexOf(option.username) !== -1
                    // }

                    getOptionLabel={(option) => option.username}
                    options={OptionsFrom.sort((a, b) => -b.username[0].localeCompare(a.username[0]))}
                    // options={options}
                    onChange={(event, newValue) => {
                        props.setmemberfrom(newValue.username);
                    }}
                    groupBy={(option) => option.profile}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Select a member"
                            variant='outlined'
                            label="Member"

                        />
                    )}
                /></div>}
                    <div>
                        <span>Overwrite: </span><span><Checkbox onChange={()=>props.setoverwrite(prev=>!prev)}  /></span>
                    </div>
                    {props.memberfrom && <div>The user <b>{props.memberfrom}</b> annotated <b>{DocAnno}</b> documents of this collection.</div>}

                    {/*<Row>*/}
                {/*    <Col md={5}>*/}
                {/*        {OptionsFrom && <div style={{marginTop:'2%',marginBottom:'2%'}}><Autocomplete*/}
                {/*            id="transferFrom"*/}
                {/*            sx={{width:'100%',marginTop:'2%'}}*/}
                {/*            getOptionDisabled={(option) =>*/}
                {/*                props.memberto.indexOf(option.username) !== -1*/}
                {/*            }*/}
                {/*            */}
                {/*            getOptionLabel={(option) => option.username}*/}
                {/*            options={OptionsFrom.sort((a, b) => -b.username[0].localeCompare(a.username[0]))}*/}
                {/*            // options={options}*/}
                {/*            onChange={(event, newValue) => {*/}
                {/*                props.setmemberfrom(newValue);*/}
                {/*            }}*/}
                {/*            groupBy={(option) => option.profile}*/}
                {/*            renderInput={(params) => (*/}
                {/*                <TextField*/}
                {/*                    {...params}*/}
                {/*                    placeholder="Select the giver member"*/}
                {/*                    variant='outlined'*/}
                {/*                    label="From"*/}

                {/*                />*/}
                {/*            )}*/}
                {/*        /></div>}*/}
                {/*    </Col>*/}
                {/*    <Col md={1} className='center_elements'>*/}
                {/*        <FontAwesomeIcon icon={faArrowRight} size='2x'/>*/}
                {/*    </Col>*/}
                {/*    {Username !== props.collection.creator ? <Col md={5} className='center_elements'>*/}
                {/*        <div ><Autocomplete*/}
                {/*            id="transferTo"*/}
                {/*            sx={{width:'100%',marginTop:'2%'}}*/}
                {/*            getOptionDisabled={(option) =>*/}
                {/*                props.memberfrom === option.username*/}
                {/*            }*/}
                {/*            getOptionLabel={(option) => option.username}*/}
                {/*            options={props.options.sort((a, b) => -b.username[0].localeCompare(a.username[0]))}*/}
                {/*            // options={options}*/}
                {/*            onChange={(event, newValue) => {*/}
                {/*                props.setmemebeto(newValue);*/}
                {/*            }}*/}
                {/*            groupBy={(option) => option.profile}*/}
                {/*            renderInput={(params) => (*/}
                {/*                <TextField*/}
                {/*                    {...params}*/}
                {/*                    placeholder="Select the receiver members"*/}
                {/*                    variant='outlined'*/}
                {/*                    label="To"*/}

                {/*                />*/}
                {/*            )}*/}
                {/*        /></div></Col> : <Col md={5} className='center_elements new_size'><div>*/}
                {/*            <b><i>{Username}</i></b>*/}
                {/*        </div>                    </Col>*/}
                {/*    }*/}
                {/*    <Col md={1}>*/}

                {/*    </Col>*/}
                {/*</Row>*/}
                </div>


                {props.error &&  <Alert severity="error">Error - An error occurred</Alert>}

            </DialogContent>
            <DialogActions>
                <Button color='error' onClick={props.handleClose}>No</Button>
                <Button autoFocus disabled={!props.memberfrom} onClick={props.transfer}>
                    Transfer
                </Button>
            </DialogActions>
        </Dialog>
        );

}
export default TransferAnnotationDialog