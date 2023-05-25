import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";
import {CollectionsBookmarkOutlined} from "@material-ui/icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";


function AddMemberDialog(props){
    return(
        <Dialog
            fullWidth
            maxWidth='md'
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Share <i>{props.name}</i> collection with other members
            </DialogTitle>
            <DialogContent>
                <div style={{marginTop:'2%',marginBottom:'2%'}}>
                    <TextField
                        placeholder="Select a list of users"
                        variant='outlined'
                        id='members'
                        onChange={(e)=>{
                            props.setmembers(e.target.value)
                        }}
                        label="Members"
                        multiline
                        rows={3}

                        sx={{width: '100%',marginTop:'15px'}}
                        helperText="Insert here the usernames of the members you wnat to include \n separated"

                        // value={LabelsToAdd}
                    />
                {/*    <Autocomplete*/}
                {/*    multiple*/}
                {/*    // value = {MembersToAdd}*/}
                {/*    id="members"*/}
                {/*    sx={{width:'100%',marginTop:'2%'}}*/}
                {/*    getOptionLabel={(option) => option.username}*/}
                {/*    options={props.options.sort((a, b) => -b.username[0].localeCompare(a.username[0]))}*/}
                {/*    // options={options}*/}
                {/*    onChange={(event, newValue) => {*/}
                {/*        props.setmembers([...props.members, newValue]);*/}
                {/*    }}*/}
                {/*    groupBy={(option) => option.profile}*/}
                {/*    renderInput={(params) => (*/}
                {/*        <TextField*/}
                {/*            {...params}*/}
                {/*            placeholder="Select members this collection will be shared with"*/}
                {/*            variant='outlined'*/}
                {/*            label="Members"*/}

                {/*        />*/}
                {/*    )}*/}
                {/*/>*/}
                </div>
                {props.error &&  <Alert severity="error">Error - An error occurred</Alert>}


            </DialogContent>
            <DialogActions>
                <Button color='error' onClick={props.handleClose}>Close</Button>
                <Button onClick={props.addMember} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );

}
export default AddMemberDialog