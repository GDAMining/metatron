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
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {AppContext} from "../../../App";
import {CheckBox} from "@material-ui/icons";
import CheckIcon from '@mui/icons-material/Check';
import {RemovehighlightMention} from "../../HelperFunctions/HelperFunctions";

function AnnotationPanel(){
    const [anchorEl, setAnchorEl] = useState(null);
    const { showlabelspannel,showmentionsspannel,showrelspannel,showfactspannel, showconceptspannel,inarel,mentions } = useContext(AppContext);
    // console.log('show panel')
    const [InARel,SetInARel] = inarel
    const [MentionsList, SetMentionsList] = mentions

    const [ShowLabels,SetShowLabels] = showlabelspannel
    const [ShowFacts,SetShowFacts] = showfactspannel
    const [ShowMentions,SetShowMentions] = showmentionsspannel
    const [ShowConcepts,SetShowConcepts] = showconceptspannel
    const [ShowRels,SetShowRels] = showrelspannel
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        // console.log('
        // click')
        event.preventDefault()
        event.stopPropagation()
        // setOpen(prev=>prev)
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        if(!ShowMentions && MentionsList){
            MentionsList.map(el=>{
                RemovehighlightMention(el)
            })
        }
    },[ShowMentions])



    return (
        <div className={'inline del'}>
            <Button
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                disabled={InARel}
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                // id="demo-customized-button"
                // aria-controls={open ? 'demo-customized-menu' : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                // variant="filled"
                // // disableElevation
                // onClick={()=>SetShowLabels(prev=>!prev)}
                endIcon={<KeyboardArrowDownIcon />}
            >
                Annotation
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={(e)=> {
                    SetShowLabels(prev => !prev);
                    handleClose()
                }}>
                    <div className='icon-menu'>
                        {ShowLabels && <CheckIcon />}

                    </div>
                    Labels</MenuItem>
                <MenuItem onClick={()=> {
                    SetShowMentions(prev => !prev)
                    handleClose()
                }
                }>
                    <div className='icon-menu'>
                        {ShowMentions && <CheckIcon />}

                    </div>
                    Mentions</MenuItem>
                <MenuItem onClick={()=> {
                    SetShowConcepts(prev => !prev)
                    handleClose()
                }}>
                    <div className='icon-menu'>
                        {ShowConcepts && <CheckIcon />}

                    </div>
                    Linked Concepts</MenuItem>
                <MenuItem onClick={()=> {
                    SetShowRels(prev => !prev)
                    handleClose()
                }}>
                    <div className='icon-menu'>
                        {ShowRels && <CheckIcon />}
                    </div>
                    Relationships</MenuItem>
                <MenuItem onClick={()=> {
                    SetShowFacts(prev => !prev)
                    handleClose()
                }}>
                    <div className='icon-menu'>
                        {ShowFacts && <CheckIcon />}
                    </div>
                    Assertions</MenuItem>
                <MenuItem onClick={()=>{
                    if(ShowRels && ShowConcepts && ShowMentions && ShowLabels){
                        SetShowRels(false)
                        SetShowConcepts(false)
                        SetShowMentions(false)
                        SetShowLabels(false)
                        SetShowFacts(false)
                        handleClose()
                    }else{
                        SetShowRels(true)
                        SetShowConcepts(true)
                        SetShowMentions(true)
                        SetShowLabels(true)
                        SetShowFacts(true)
                        handleClose()
                    }

                }}>All</MenuItem>

            </Menu>


        </div>



    );

}

export default AnnotationPanel

