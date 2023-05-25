import React, {useContext, useEffect, useState} from 'react'
import Nav from "react-bootstrap/Nav";
import Figure from "react-bootstrap/Figure";
import './sidebar.css';
import {AppContext} from "../../App";
import {faLocationArrow, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';
import {ReactCSSTransitionGroup,TransitionGroup} from 'react-transition-group'; // ES6
import Slide from '@material-ui/core/Slide';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, Redirect
} from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import PeopleIcon from '@mui/icons-material/People';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import UploadIcon from '@mui/icons-material/Upload';
import ArticleIcon from '@mui/icons-material/Article';
import Badge from "react-bootstrap/Badge";
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import {FindInPage, HelpOutline} from "@material-ui/icons";
import GroupIcon from '@mui/icons-material/Group';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {Tooltip} from "@mui/material";
function SideBar(props){

    const { showbar,inarel,showview,profile,showupload,document_id,showautomaticannotation,collectiondocuments,showdocs,expand,showdownload,showmembers,showstats,showcollections,showfilter,showsettings } = useContext(AppContext);
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [Redir,SetRedir] = useState(false)
    const [RedirCredits,SetRedirCredits] = useState(false)
    const [ShowBar, SetShowBar] = showbar;
    const [ShowDocs,SetShowDocs] = showdocs
    const [ShowMembers,SetShowMembers] =showmembers
    const [ShowSettings,SetShowSettings] =showsettings
    const [Expand,SetExpand] = expand
    const [ShowStats,SetShowStats] = showstats
    const [ShowView,SetShowView] = showview
    const [ShowCollections,SetShowCollections] = showcollections
    const [ShowFilter,SetShowFilter] = showfilter
    const [InARel, SetInARel] = inarel;
    const [Profile, SetProfile] = profile;
    const [DocumentID, SetDocumentID] = document_id;
    const [ShowDownload,SetShowDownload] = showdownload
    const [ShowUpload,SetShowUpload] = showupload
    const [ShowAutoAnno,SetShowAutoAnno] = showautomaticannotation

    const height = document.documentElement.scrollHeight

    useEffect(()=>{
        const height = document.documentElement.scrollHeight
        console.log('height',height)
        // console.log('height123',ShowBar)

        if(document.getElementById('sidenav') !== null){
            document.getElementById('sidenav').style.height = height.toString() + 'px'

        }
    },[ShowBar])

    useEffect(()=>{

        SetExpand(false);
        SetShowStats(false)
        SetShowDocs(false)
        SetShowCollections(false)
        SetShowMembers(false)
        SetShowSettings(false)
        SetShowFilter(false)
        SetShowView(false)
        SetShowDownload(false)
        SetShowUpload(false)
        SetShowAutoAnno(false)


    },[InARel])

    useEffect(()=>{
        if(!ShowDocs){
            SetExpand(false);

        }
        SetShowStats(false)
        SetShowCollections(false)
        SetShowMembers(false)
        SetShowSettings(false)
        SetShowFilter(false)
        SetShowView(false)
        SetShowDownload(false)
        SetShowUpload(false)
        SetShowAutoAnno(false)


    },[DocumentID])

    // useEffect(()=>{
    //     if(ShowMentions || ShowLab)
    //     SetShowStats(false)
    //     SetShowDocs(false)
    //     SetShowCollections(false)
    //     SetShowMembers(false)
    //     SetShowSettings(false)
    //     SetShowFilter(false)
    //     SetShowView(false)
    //     SetShowDownload(false)
    //     SetShowUpload(false)
    //     SetExpand(false);
    //
    // },[ShowLabels,ShowMentions,ShowConcepts,ShowRels,ShowFacts])



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
        SetShowView(false)
        SetShowMembers(false)
        SetShowFilter(false)
        SetShowSettings(false)
        SetShowDownload(false)
        SetShowUpload(false)
        SetShowAutoAnno(false)


    }


    function OpenMenu(e,string){
        e.preventDefault()
        e.stopPropagation()



        if(string === 's' ) {
            if( ShowStats){
                Clear()

            }else{
                SetShowStats(true)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowSettings(false)
                SetShowView(false)
                SetExpand(true);
                SetShowUpload(false)
                SetShowAutoAnno(false)
                SetShowDownload(false)

                SetShowFilter(false)

            }
        }
        else if(string === 'd') {
            if(ShowDocs){
                Clear()
            }else{
                SetShowDocs(true)
                SetShowDownload(false)
                SetShowUpload(false)
                SetShowAutoAnno(false)

                SetShowStats(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowFilter(false)
                SetShowSettings(false)
                SetShowView(false)
                SetExpand(true);

            }

        }
        else if(string === 'c') {
            if(ShowCollections){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(true)
                SetShowMembers(false)
                SetShowFilter(false)
                SetShowSettings(false)
                SetShowView(false)
                SetShowDownload(false)
                SetShowUpload(false)
                SetShowAutoAnno(false)

                SetExpand(true);

            }
        }
        else if(string === 'm' ) {
            if(ShowMembers){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(true)
                SetShowFilter(false)
                SetShowSettings(false)
                SetShowView(false)
                SetShowDownload(false)
                SetShowUpload(false)
                SetShowAutoAnno(false)

                SetExpand(true);

            }

        }else if(string === 'f' ) {
            if(ShowFilter){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowFilter(true)
                SetShowSettings(false)
                SetShowView(false)
                SetShowDownload(false)
                SetShowUpload(false)
                SetShowAutoAnno(false)

                SetExpand(true);
            }

        }else if(string === 'color' ) {
            if(ShowSettings){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowSettings(true)
                SetShowFilter(false)
                SetShowView(false)
                SetShowDownload(false)
                SetShowUpload(false)
                SetShowAutoAnno(false)

                SetExpand(true);
            }

        }else if(string === 'view' ) {
            if(ShowView){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowSettings(false)
                SetShowFilter(false)
                SetShowDownload(false)
                SetShowView(true)
                SetShowUpload(false)
                SetShowAutoAnno(false)

                SetExpand(true);
            }

        }else if(string === 'download' ) {
            if(ShowDownload){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowSettings(false)
                SetShowFilter(false)
                SetShowDownload(false)
                SetShowView(false)
                SetShowDownload(true)
                SetShowUpload(false)
                SetShowAutoAnno(false)

                SetExpand(true);
            }

        }else if(string === 'upload' ) {
            if(ShowUpload){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowSettings(false)
                SetShowFilter(false)
                SetShowDownload(false)
                SetShowView(false)
                SetShowDownload(false)
                SetShowUpload(true)
                SetShowAutoAnno(false)

                SetExpand(true);
            }

        }else if(string === 'auto' ) {
            if(ShowAutoAnno){
                Clear()
            }
            else{
                SetShowStats(false)
                SetShowDocs(false)
                SetShowCollections(false)
                SetShowMembers(false)
                SetShowSettings(false)
                SetShowFilter(false)
                SetShowDownload(false)
                SetShowView(false)
                SetShowDownload(false)
                SetShowUpload(false)
                SetShowAutoAnno(true)

                SetExpand(true);
            }

        }



    }


    return (

        <div className="sidenav" id='sidenav' >
            {/*{Redir && <Redirect to={"/instructions"}/>}*/}
            {/*{RedirCredits && <Redirect to={"/credits"}/>}*/}

            {/*<div style={{'text-align':'center'}}>*/}
            <ThemeProvider theme={bottoni}>
                <Tooltip placement="right" title={'Documents'}>
                    <IconButton  color="buttons" disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0} component="div" onClick={(e)=> {OpenMenu(e,'d')}} >
                        <ArticleIcon sx={{ fontSize: '1.5rem'}}/>
                    </IconButton>
                </Tooltip>
                <Tooltip placement="right" title={'Collections'}>
                <IconButton color="buttons"  disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0}  aria-label="Collections" component="div" onClick={(e)=> {OpenMenu(e,'c')}} >
                    <CollectionsBookmarkIcon sx={{ fontSize: '1.5rem'}} />
                </IconButton></Tooltip>
                <Tooltip placement="right" title={'Members'}>
                <IconButton color="buttons"  disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0} aria-label="Members" component="div" onClick={(e)=> {OpenMenu(e,'m')}} >
                    <GroupIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton></Tooltip>
                <Tooltip placement="right" title={'Statistics'}>
                <IconButton color="buttons"  disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0} aria-label="Stats" component="div" onClick={(e)=> {OpenMenu(e,'s')}}>
                    <StackedBarChartIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton></Tooltip>
                {/*<IconButton color="buttons" disabled={InARel} aria-label="Members" component="div" onClick={(e)=> {OpenMenu(e,'f')}}>*/}
                {/*    <TuneSharpIcon sx={{ fontSize: '1.5rem'}}/>*/}
                {/*</IconButton>*/}

                <Tooltip placement="right" title={'Settings'}>
                <IconButton color="buttons"  aria-label="Settings" disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0} component="div" onClick={(e)=> {OpenMenu(e,'color')}}>
                    <SettingsIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton></Tooltip>
                <Tooltip placement="right" title={'Download'}>

                <IconButton color="buttons"  aria-label="Download" disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0} component="div" onClick={(e)=> {OpenMenu(e,'download')}}>
                    <DownloadIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton></Tooltip>
                <Tooltip placement="right" title={'Upload'}>

                <IconButton color="buttons"   aria-label="Upload" disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0} component="div" onClick={(e)=> {OpenMenu(e,'upload')}}>
                    <UploadIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton></Tooltip>
                <Tooltip placement="right" title={'View'}>

                <IconButton color="buttons" aria-label="View"  disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0} component="div" onClick={(e)=> {OpenMenu(e,'view')}}>
                    <RemoveRedEyeIcon sx={{ fontSize: '1.5rem'}}/>
                </IconButton></Tooltip>
                {window.location.hostname ==="metatron.dei.unipd.it" && <Tooltip placement="right" title={'Autotron - Automatic annotation'}>
                    <IconButton color="buttons" aria-label="Auto"
                                disabled={InARel || !CollectionDocuments || CollectionDocuments.length === 0}
                                component="div" onClick={(e) => {
                        OpenMenu(e, 'auto')
                    }}>
                        <SmartToySharpIcon sx={{fontSize: '1.5rem'}}/>
                    </IconButton></Tooltip>}
                <br/><br/>
                <Tooltip placement="right" title={'Instructions'}>
                    <IconButton className={'bottombutt'} color="buttons" aria-label="Auto"  component="a" target={'_blank'} href={'/instructions'}>

                    {/*<IconButton color="buttons" aria-label="Auto"  component="div" onClick={()=>SetRedir(curval => !curval)}>*/}
                        <HelpOutlineIcon sx={{ fontSize: '1.5rem'}}/>
                    </IconButton>
                </Tooltip>
                <Tooltip placement="right" title={'Credits'}>
                    <IconButton className={'bottombutt'} color="buttons" aria-label="Auto"  component="a" target={'_blank'} href={'/credits'}>
                        <EmailIcon sx={{ fontSize: '1.5rem'}}/>
                    </IconButton>
                </Tooltip>
            </ThemeProvider>
            </div>

    );
}

export default SideBar
