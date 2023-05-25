import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import ActualPosition from "../BaseComponents/ActualPosition";



function DocumentToolBar(){
    return(
        <div style={{marginBottom:'1.5vh'}}>
            <ActualPosition />
            {/*<Row>*/}
            {/*    <Col md={2}>*/}
            {/*        <Badge pill variant="secondary" style={{fontSize:'85%'}}>change&nbsp;&nbsp;*/}
            {/*            <FontAwesomeIcon color='white' icon={faFileInvoice}/>*/}
            {/*        </Badge>&nbsp;&nbsp;*/}
            {/*    </Col>*/}
            {/*    <Col md={2}>*/}
            {/*</Col>*/}
            {/*    <Col md={3}>*/}
            {/*        <Badge pill variant="outlined-primary" style={{fontSize:'85%'}}>*/}
            {/*            <FontAwesomeIcon color='white' icon={faArrowLeft}/>&nbsp;&nbsp;prev*/}
            {/*        </Badge>&nbsp;&nbsp;*/}
            {/*        <Badge pill variant="primary" style={{fontSize:'85%'}}>*/}
            {/*            next&nbsp;&nbsp;<FontAwesomeIcon color='white' icon={faArrowRight}/>*/}
            {/*        </Badge>*/}
            {/*    </Col>*/}
            {/*    <Col md={2}></Col>*/}
            {/*    <Col md={3}>*/}
            {/*        <Badge pill variant="success" style={{fontSize:'85%'}}>*/}
            {/*            save&nbsp;&nbsp;<FontAwesomeIcon color='white' icon={faSave}/>*/}
            {/*        </Badge>&nbsp;&nbsp;*/}
            {/*        <Badge pill variant="danger" style={{fontSize:'85%'}}>*/}
            {/*            clear&nbsp;&nbsp;<FontAwesomeIcon color='white' icon={faTrash}/>*/}
            {/*        </Badge>*/}
            {/*    </Col>*/}


            {/*</Row>*/}
        </div>
    );

}
export default DocumentToolBar