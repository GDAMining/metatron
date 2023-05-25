import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";
import {CollectionsBookmarkOutlined} from "@material-ui/icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";


function Bar(){
    return(
        <Row><Col md={3}></Col>
            <Col md={2} style={{textAlign:'center'}}><Button href="index"><BorderColorIcon style={{marginRight:'2px'}}></BorderColorIcon> Annotate</Button>
            </Col>
            <Col md={2} style={{textAlign:'center'}}><Button href="statistics"><BarChartIcon style={{marginRight:'2px'}}></BarChartIcon> Statistics</Button>
            </Col>
            {/*<Col md={2} style={{textAlign:'center'}}><Button href="index"><DownloadIcon style={{marginRight:'2px'}}></DownloadIcon> My Nanopublications</Button>*/}
            {/*</Col>*/}
            <Col md={2} style={{textAlign:'center'}}><Button href="collections"><CollectionsBookmarkOutlined style={{marginRight:'2px'}}></CollectionsBookmarkOutlined> Collections</Button>
            </Col>
            {/*<Col md={2} style={{textAlign:'center'}}><Button href="add_data"><AddCircleOutlineIcon style={{marginRight:'2px'}}></AddCircleOutlineIcon> Add data</Button>*/}
            {/*</Col>*/}
            <Col md={3}></Col>
        </Row>
    );

}
export default Bar