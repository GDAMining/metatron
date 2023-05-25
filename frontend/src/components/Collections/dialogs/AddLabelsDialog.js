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


function AddLabelsDialog(props){
    return(
        <Dialog
            open={props.open}
            fullWidth
            maxWidth='md'
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Add new labels to this co collections.
            </DialogTitle>
            <DialogContent>
                Add one or more labels <b>\n separated</b>.
                <div className='labels_diag'>
                    <TextField
                        onChange={(e)=>{
                            props.setlabelstoadd(e.target.value)
                        }}
                        id="labels"
                        sx={{width: '100%'}}
                        variant="outlined"
                        label = 'Labels'
                        multiline
                        rows={2}
                        placeholder="Add new labels"
                        // value={LabelsToAdd}
                    />
                </div>
                {props.error &&  <Alert severity="error">Error - An error occurred</Alert>}
            </DialogContent>
            <DialogActions>
                <Button color='error' onClick={props.handleClose}>Delete</Button>
                <Button onClick={props.addlabels} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );

}
export default AddLabelsDialog