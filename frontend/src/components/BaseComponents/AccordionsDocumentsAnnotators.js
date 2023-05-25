import * as React from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {AbcRounded} from "@mui/icons-material";
import { Container, Row, Col } from 'react-bootstrap';
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";



export default function MyAccordion(props) {


    return (
        <div>
            <Paper elevation={2} className='paper'>
                <div style={{padding:'2%'}}>

                    <h5>{props.title}</h5>
                    {props.subtitle &&
                        <i>
                            {props.subtitle}
                        </i>
                    }
                </div>

                {/*<div>*/}
                    <div style={{display:'inline-block',textAlign:'right'}}>
                        <IconButton aria-label="delete">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </div>
                {/*</Col>*/}
            </Paper>





            {/*<Accordion>*/}
            {/*    <AccordionSummary*/}
            {/*        expandIcon={<ExpandMoreIcon />}*/}
            {/*        aria-controls="panel1a-content"*/}
            {/*        id="panel1a-header"*/}
            {/*    >*/}
            {/*        <Typography>Accordion 1</Typography><br/>*/}
            {/*        <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>*/}
            {/*    </AccordionSummary>*/}
            {/*    <AccordionDetails>*/}
            {/*        <Typography>*/}
            {/*            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse*/}
            {/*            malesuada lacus ex, sit amet blandit leo lobortis eget.*/}
            {/*        </Typography>*/}
            {/*    </AccordionDetails>*/}
            {/*</Accordion>*/}
            {/*<Accordion>*/}
            {/*    <AccordionSummary*/}
            {/*        expandIcon={<ExpandMoreIcon />}*/}
            {/*        aria-controls="panel2a-content"*/}
            {/*        id="panel2a-header"*/}
            {/*    >*/}
            {/*        <Typography>Accordion 2</Typography><br/>*/}
            {/*        <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>*/}
            {/*    </AccordionSummary>*/}
            {/*    <AccordionDetails>*/}
            {/*        <Typography>*/}
            {/*            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse*/}
            {/*            malesuada lacus ex, sit amet blandit leo lobortis eget.*/}
            {/*        </Typography>*/}
            {/*    </AccordionDetails>*/}
            {/*</Accordion>*/}

        </div>
    );
}