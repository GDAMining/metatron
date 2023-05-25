import React, {useContext, useEffect, useState} from 'react'
import Nav from "react-bootstrap/Nav";
import Figure from "react-bootstrap/Figure";
import './sidebar.css';
import {AppContext} from "../../App";
import {faLocationArrow, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactCSSTransitionGroup,TransitionGroup} from 'react-transition-group'; // ES6
import Slide from '@material-ui/core/Slide';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ArticleIcon from '@mui/icons-material/Article';
import Badge from "react-bootstrap/Badge";
import IconButton from '@mui/material/IconButton';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import {FindInPage} from "@material-ui/icons";
import GroupIcon from '@mui/icons-material/Group';
import {createTheme, ThemeProvider} from "@mui/material/styles";
function SideBar(props){

    const { showbar,username,admin,profile,showdocs,expand,showmembers,showstats,showcollections } = useContext(AppContext);
    const [Username, SetUsername] = username;
    const [Admin, SetAdmin] = admin;
    const [ShowBar, SetShowBar] = showbar;
    const [ShowDocs,SetShowDocs] = showdocs
    const [ShowMembers,SetShowMembers] =showmembers
    const [Expand,SetExpand] = expand
    const [ShowStats,SetShowStats] = showstats
    const [ShowCollections,SetShowCollections] = showcollections
    const [Profile, SetProfile] = profile;
    const height = document.documentElement.scrollHeight

    useEffect(()=>{
        const height = document.documentElement.scrollHeight
        // console.log('height',height)
        // console.log('height123',ShowBar)

        if(document.getElementById('sidenav') !== null){
            document.getElementById('sidenav').style.height = height.toString() + 'px'

        }
    },[ShowBar])

    const bottoni = createTheme({
        palette: {
            buttons: {
                main: '#fff',
                contrastText: '#fff',
            },


        },
    });
    function Clear(){
        // e.preventDefault()
        SetExpand(false);
        SetShowStats(false)
        SetShowDocs(false)
        SetShowCollections(false)
        SetShowMembers(false)

    }
    function OpenMenu(e,string){
        e.preventDefault()

        var el = document.getElementById('trans')
        el.classList = ['open']
        // if(el.classList.contains('open')){
        //     el.classList = []
        // }else{
        //     el.classList = ['open']
        // }

        if(string === 's' ) {
            if( ShowStats){
                Clear()
                el.classList = []
            }else{
                SetShowStats(true)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetExpand(true);
            }
        }
        else if(string === 'd') {
            if(ShowDocs){
                Clear()
                el.classList = []
            }else{
                SetShowDocs(true)
                SetShowStats(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetExpand(true);
            }

        }
        else if(string === 'c') {
            if(ShowCollections){
                Clear()
                el.classList = []
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(true)
                SetShowMembers(false)
                SetExpand(true);
            }
        }
        else if(string === 'm' ) {
            if(ShowMembers){
                Clear()
                el.classList = []
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(true)
                SetExpand(true);
            }

        }



    }

    return (

        <div className="sidenav" id='sidenav' >
            {/*<div style={{'text-align':'center'}}>*/}
            <ThemeProvider theme={bottoni}>
                <IconButton color="buttons"  component="div" onClick={(e)=> {OpenMenu(e,'d')}}>
                    <ArticleIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton>
                {/*<IconButton color="buttons"   aria-label="Find" component="div">*/}
                {/*    <FindInPageIcon sx={{ fontSize: '1.5rem'}}/>*/}
                {/*</IconButton>*/}
                <IconButton color="buttons"  aria-label="Collections" component="div" onClick={(e)=> {OpenMenu(e,'c')}}>
                    <CollectionsBookmarkIcon sx={{ fontSize: '1.5rem'}} />
                </IconButton>

                <IconButton color="buttons" aria-label="Members" component="div" onClick={(e)=> {OpenMenu(e,'m')}}>
                    <GroupIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton>
                <IconButton color="buttons" aria-label="Members" component="div" onClick={(e)=> {OpenMenu(e,'s')}}>
                    <StackedBarChartIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton>

            </ThemeProvider>
            </div>

    );
}

export default SideBar
