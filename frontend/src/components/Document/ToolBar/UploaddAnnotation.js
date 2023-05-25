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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {AppContext} from "../../../App";


function UploadAnnotation(){

    const { inarel } = useContext(AppContext);

    // transitions
    // const [LoadingDoc, startTransition] = useTransition()

    const [InARel,SetInARel] = inarel




    const theme = createTheme({
        palette: {
            neutral: {
                main: '#134e43',
                contrastText: '#fff',
            },
        },
    });



    return(
        <div className='inline_1vw'>

            <>
                <Tooltip title="Download Annotation">
                    <ThemeProvider theme={theme}>
                        <Button variant="outlined" disabled={InARel} color={'neutral'} size="small" className={'bt'} >
                            Upload
                        </Button>
                    </ThemeProvider>
                </Tooltip>
            </>
        </div>



    );

}

export default UploadAnnotation

