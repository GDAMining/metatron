import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import UploadIcon from '@mui/icons-material/Upload';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ArticleIcon from '@mui/icons-material/Article';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Fade from '@mui/material/Fade';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronLeft, faPalette,
    faChevronRight, faExclamationTriangle,
    faGlasses,
    faInfoCircle,
    faList, faPlusCircle,
    faProjectDiagram, faArrowLeft, faArrowRight, faTrash, faSave, faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {AppContext} from "../../App";

export default function CreditsPage(props){
    useEffect(() => {
        document.title = 'Credits';
    }, []);
    return(
        <div style={{textAlign:"center",padding:"5% 10%"}}>
            <h1>Credits</h1>
            <Row style={{margin:'5% 0'}}>
                <Col md={4}>
                    <img style={{borderRadius:'50%',height:'30vh'}}  alt={'irrera'} src={'https://www.dei.unipd.it/~irreraorne/img/personal/personal-image.jpg'}/>
                    <div style={{margin:"2vh 0"}}>
                       <h4>Ornella Irrera</h4><hr/>
                       <div>
                           ornella.irrera@unipd.it
                       </div>
                    </div>
                </Col>
                <Col md={4}>
                    <img style={{borderRadius:'50%',height:'30vh'}}  alt={'marchesin'} src={'http://metatron.dei.unipd.it/static/img/stefano_480x480.png'}/>
                    <div style={{margin:"2vh 0"}}>
                        <h4>Stefano Marchesin</h4><hr/>
                        <div>
                            stefano.marchesin@unipd.it
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <img style={{borderRadius:'50%',height:'30vh'}}  alt={'silvello'} src={'http://www.dei.unipd.it/~silvello/img/personal/personal-image.jpg'}/>
                    <div style={{margin:"2vh 0"}}>
                        <h4>Gianmaria Silvello</h4><hr/>
                        <div>
                            gianmaria.silvello@unipd.it
                        </div>
                    </div>
                </Col>
                <hr/>

            </Row>
            <Row>
                <Col md={12}>
                    <h3>Acknowledgements</h3>
                    <div>
                        This work is supported by the <a target={'_blank'} href={"https://www.examode.eu/"}>ExaMode</a> project, as part of the European Union Horizon 2020 program under Grant Agreement no. 825292.


                    </div>
                </Col>
            </Row>

        </div>
    );
}