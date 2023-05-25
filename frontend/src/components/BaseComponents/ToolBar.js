import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";
import {CollectionsBookmarkOutlined} from "@material-ui/icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import './toolbar.css'
import HubIcon from '@mui/icons-material/Hub';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

function ToolBar(){
    return(
        <div className='tool_bar'>
            <Row><Col md={1}></Col>
                <Col md={2} style={{textAlign:'center'}}><Button href="index"><BorderColorIcon style={{marginRight:'2px'}}></BorderColorIcon> Annotate</Button>
                </Col>
                <Col md={2} style={{textAlign:'center'}}><Button href="statistics"><BarChartIcon style={{marginRight:'2px'}}></BarChartIcon> Statistics</Button>
                </Col>
                {/*<Col md={2} style={{textAlign:'center'}}><Button href="index"><DownloadIcon style={{marginRight:'2px'}}></DownloadIcon> My Nanopublications</Button>*/}
                {/*</Col>*/}
                <Col md={2} style={{textAlign:'center'}}><Button href="collections"><CollectionsBookmarkOutlined style={{marginRight:'2px'}}></CollectionsBookmarkOutlined> Collections</Button>
                </Col>
                {/*<Col md={2} style={{textAlign:'center'}}><Button href="collections"><HubIcon style={{marginRight:'2px'}}></HubIcon> Ontologies</Button>*/}
                {/*</Col>*/}
                <Col md={2} style={{textAlign:'center'}}><Button href="collections"><ReceiptLongIcon style={{marginRight:'2px'}}></ReceiptLongIcon> Nanopublications</Button>
                </Col>
                {/*<Col md={2} style={{textAlign:'center'}}><Button href="add_data"><AddCircleOutlineIcon style={{marginRight:'2px'}}></AddCircleOutlineIcon> Add data</Button>*/}
                {/*</Col>*/}
                <Col md={1}></Col>
            </Row>
        </div>

        );

}
export default ToolBar