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


function DeleteCollectionDialog(props){
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
                Delete <i>{props.name}</i> collection?
            </DialogTitle>
            <DialogContent>
                This action will remove the collection and all the annotations of the collection's documents.
                {props.error &&  <Alert severity="error">Error - An error occurred</Alert>}

            </DialogContent>
            <DialogActions>
                <Button color='error' onClick={props.handleClose}>No</Button>
                <Button onClick={props.deletecollection} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );

}
export default DeleteCollectionDialog