import {Col, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LockIcon from '@mui/icons-material/Lock';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Tooltip from '@mui/material/Tooltip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteMemberDialog from "./dialogs/DeleteMemberDialog"; './dialogs/DeleteMemberDialog'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DownloadIcon from '@mui/icons-material/Download';
import AppsIcon from '@mui/icons-material/Apps';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import Collapse from "@material-ui/core/Collapse";
import {
    faChevronLeft, faPalette,
    faChevronRight, faExclamationTriangle,
    faGlasses,
    faInfoCircle,
    faList, faPlusCircle,
    faProjectDiagram, faArrowLeft, faArrowRight, faTrash, faSave, faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {AppContext} from "../../App";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {keyboard} from "@testing-library/user-event/dist/keyboard";
import Alert from "@mui/material/Alert";
import AddMemberDialog from "./dialogs/AddMemberDialog";
import AddLabelsDialog from "./dialogs/AddLabelsDialog";
import DeleteCollectionDialog from "./dialogs/DeleteCollectionDialog";
import TransferAnnotationDialog from "./dialogs/TransferAnnotationDialog";
import {dom} from "@fortawesome/fontawesome-svg-core";

export default function Collection(props){
    const { username,users,collectionslist,collection,document_id } = useContext(AppContext);
    const [ShowTransfer,SetShowTransfer] = useState(false)
    const [ShowCollectionDetails,SetShowCollectionDetails] = useState(false)
    const [Username,SetUsername] = username
    const [Collection,SetCollection] = collection

    const [DocumentID,SetDocumentID] = document_id

    const [Users,SetUsers] = users
    const [MemberFrom,SetMemberFrom] = useState(false)
    const [MemberTo,SetMemberTo] = useState(false)
    const [Profiles,SetProfiles] = useState( [])
    const [LabelsToAdd,SetLabelsToAdd] = useState(false)
    const [OpenDeleteCollDialog,SetOpenDeleteCollDialog] = useState(false)
    const [OpenMemberDialog,SetOpenMemberDialog] = useState(false)
    const [OpenAddMemberDialog,SetOpenAddMemberDialog] = useState(false)
    const [OpenAddLabelsDialog,SetOpenAddLabelsDialog] = useState(false)
    const [Members,SetMembers] = useState(props.collection.members)
    const [Labels,SetLabels] = useState(props.collection.labels)
    const [MembersToAdd,SetMembersToAdd] = useState([])
    const [MemberToDel,SetMemberToDel] = useState(false)
    const [options,SetOptions] = useState([])
    const [AllOptions,SetAllOptions] = useState([])
    const [UpdateMembers,SetUpdateMembers] = useState(false)
    const [UpdateLabels,SetUpdateLabels] = useState(false)
    const [Beginner,SetBeginner] = useState([])
    const [Expert,SetExpert] = useState([])
    const [Admin,SetAdmin] = useState([])
    const [Tech,SetTech] = useState([])
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [Redir,SetRedir] = useState(false)
    const [OverWrite,SetOverWrite] = useState(false)
    const [ShowNew,SetShowNew] = useState({
        'Professor':false,
        'Expert':false,
        'Beginner':false,
        'Tech':false,
        'Student':false,
        'Admin':false
    })
    const [Student,SetStudent] = useState([])
    const [Professor,SetProfessor] = useState([])
    const [JsonMembers,SetJsonMembers] = useState({})
    const [JsonMembersPlus10,SetJsonMembersPlus10] = useState({})
    const [Error, SetError] = useState(false)
    const [Languages, SetLanguages] = useState([])
    const [Invitation,SetInvitation] = useState(false)

    useEffect(()=>{
        SetInvitation(props.collection.status)
    },[props.collection])

    useEffect(()=>{

        if(Users){
            var opt = Users.filter(a=>a.username !== Username)
            var profiles = []
            for (let ind = 0; ind < Users.length; ind++) {
                if(profiles.indexOf(Users[ind].profile) === -1){
                    profiles.push(Users[ind].profile)
                    // var str_name = 'All' +' '+ Users[ind].profile
                    // opt.push({'username':str_name,'profile':Users[ind].profile})
                }
            }
            for (let i = 0; i < profiles.length; i++) {
                var count_p = 0
                for (let ind = 0; ind < opt.length; ind++) {
                    if(opt[ind].profile === profiles[i]){
                        count_p = count_p + 1

                    }
                }
                if(count_p <= 1){
                    opt = opt.filter(o => o.profile !== profiles[i])
                }

            }
            var members_usernames = []
            for (let i = 0; i < props.collection.members.length; i++) {
                members_usernames.push(props.collection.members[i].username)
            }
            SetAllOptions(opt)
            opt = opt.filter(o => members_usernames.indexOf(o.username) === -1)
            console.log('opt',opt)
            SetOptions(opt)
            var profiles = get_profiles()
            SetProfiles(profiles)
        }

    },[Users])


    useEffect(()=>{
        // if (Members.length > 0){
            var profiles = get_profiles()
            SetProfiles(profiles)

            var beg = Members.filter(u => u.profile === 'Beginner')
            var bep = []
            if(beg.length > 10){
                bep = beg.slice(10, beg.length)
                beg = beg.slice(0, 10);
            }

            var exp = Members.filter(u => u.profile === 'Expert')
            var exp_p = []
            if(exp.length > 10){
                exp_p = exp.slice(10, exp.length)
                exp = exp.slice(0, 10);
            }
            var tec = Members.filter(u => u.profile === 'Tech')
            var tec_p = []
            if(tec.length > 10){
                tec_p = tec.slice(10, tec.length)
                tec = tec.slice(0, 10);
            }
            var stud = Members.filter(u => u.profile === 'Student')
            var stud_p = []
            if(stud.length > 10){
                stud_p = stud.slice(10, stud.length)
                stud = stud.slice(0, 10);
            }

            var prof = Members.filter(u => u.profile === 'Professor')
            var prof_p = []
            if(prof.length > 10){
                prof_p = prof.slice(10, prof.length)
                prof = prof.slice(0, 10);
            }
            var ad = Members.filter(u => u.profile === 'Admin')
            var ad_p = []
            if(ad.length > 10){
                ad_p = ad.slice(10, ad.length)
                ad = ad.slice(0, 10);
            }
            SetAdmin(ad)
            var mem = {
                'Professor':prof,
                'Student': stud,
                'Beginner':beg,
                'Expert':exp,
                'Admin': ad,
                'Tech':tec
            }
            var memplus = {
                'Professor':prof_p,
                'Student': stud_p,
                'Beginner':bep,
                'Expert':exp_p,
                'Admin': ad_p,
                'Tech':tec_p
            }
            SetJsonMembers(mem)
            SetJsonMembersPlus10(memplus)


        // }
        // else{
        //     SetJsonMembers({})
        //     SetJsonMembersPlus10({})
        // }

    },[Members])


    function deleteMember(e){
        var coll = Members.filter(e => e !== MemberToDel)

        if(MemberToDel !== Username){
            axios.delete('collections/delete_member',
                {data:{
                        member:MemberToDel,
                        collection:props.collection.id
                    }}
            )
                .then(response=>{
                    console.log(response.data)
                    SetMembers(coll)
                    SetUpdateMembers(true)
                    handleCloseMemberDialog()
                })
                .catch(error=>{
                    SetError(true)
                    console.log(error)
                })
        }


    }

    function get_profiles(){
        var profiles = []
        Members.map((u,i)=>{
            if (profiles.indexOf(u.profile) === -1 ){
                profiles.push(u.profile)
            }
        })
        return profiles
    }


    function deleteCollection(e){
        var coll = Members.filter(e => e !== MemberToDel)


        axios.delete('collections',{ data:{collection:props.collection['id'] }})

            .then(response=>{
                console.log(response.data)
                let collections = CollectionsList.map(x=>x)
                collections = collections.filter(x=>x.id !== props.collection['id'])
                SetCollectionsList(collections)
                handleCloseCollectionDialog()
            })
            .catch(error=>{
                SetError(true)
                console.log(error)
            })
        axios.get("get_session_params").then(response => {
            console.log('params',response.data)
            SetCollection(response.data['collection']);
            SetDocumentID(response.data['document']);

        })

    }
    function AddMember(e){
        axios.post('collections/add_member',
            {
                members:MembersToAdd,
                collection:props.collection.id
            }
        )
            .then(response=>{
                console.log(response.data)
                SetUpdateMembers(true)
                handleCloseAddMemberDialog()

            })
            .catch(error=>{
                SetError(true)
                console.log(error)
            })

    }

    function TransferAnnotations(e){
        if (MemberFrom){
            axios.post('transfer_annotations',
                {
                    member:MemberFrom,
                    collection:props.collection.id,
                    overwrite:OverWrite
                }
            )
                .then(response=>{
                    console.log(response.data)
                    handleCloseTransferDialog()

                })
                .catch(error=>{
                    SetError(true)
                    console.log(error)
                })
        }

    }

    function AddLabels(e){
        axios.post('collections/add_labels',
            {
                labels:LabelsToAdd,
                collection:props.collection.id
            }
        )
            .then(response=>{
                console.log(response.data)
                handleCloseAddlabelsDialog()
                SetUpdateLabels(true)

            })
            .catch(error=>{
                SetError(true)
                console.log(error)
            })

    }
    useEffect(()=>{
        if(UpdateLabels){
            axios.get('get_labels_list',{params:{collection:props.collection.id}})
                .then(response=>{
                    SetLabels(response.data['labels'])
                })
                .catch(error=>{
                    console.log('error',error)

                })
        }
        SetUpdateLabels(false)
    },[UpdateLabels])

    useEffect(()=>{
        if(UpdateMembers){
            axios.get('collections/users',{params:{collection:props.collection.id}})
                .then(response=>{
                    SetMembers(response.data['members'])
                })
                .catch(error=>{
                    console.log('error',error)

                })
        }
        SetUpdateMembers(false)
    },[UpdateMembers])


    const handleCloseCollectionDialog = () =>{
        SetError(false)
        SetOpenDeleteCollDialog(false);

    }
    const handleCloseTransferDialog = () =>{
        SetError(false)
        SetShowTransfer(false);
        SetMemberFrom(false)
        SetMemberTo(false)

    }
    const handleCloseAddlabelsDialog = () =>{
        SetError(false)
        SetOpenAddLabelsDialog(false);
        SetLabelsToAdd(false)
        SetUpdateLabels(false)

    }
    const handleCloseMemberDialog = () =>{
        SetError(false)
        SetOpenMemberDialog(false);
        SetMemberToDel(false)
        SetUpdateMembers(false)
    }
    const handleCloseAddMemberDialog = () =>{
        SetError(false)
        SetOpenAddMemberDialog(false);
        SetMembersToAdd([])
        SetUpdateMemebrs(false)
    }
    const handleChangeLabels = (event) => {
        SetError(false)
        SetLabelsToAdd(event.target.value);

    };

    useEffect(()=>{
        if(OpenMemberDialog || OpenAddMemberDialog || OpenAddLabelsDialog || OpenDeleteCollDialog ){
            SetError(false)
        }
    },[OpenAddLabelsDialog,OpenDeleteCollDialog,OpenMemberDialog,OpenAddMemberDialog])

    const theme = createTheme({

        palette: {
            Professor: {
                main: 'red',
                contrastText: '#fff',
            },
            Expert: {
                main: '#28a745',
                contrastText: '#fff',

            },
            Student: {
                main: '#1976d2',
                contrastText: '#fff',

            },
            Beginner: {
                main: '#fc9900',
                contrastText: '#fff',

            },
            Tech: {
                main: '#343a40',
                contrastText: '#fff',

            },
            Label:{
                main: '#17a2b8',
                contrastText: '#fff',
            },
        },
    });

    function ShowNew10UsersFunc(e,profile){
        e.preventDefault()
        var json_o = {}
        console.log('k',ShowNew)

        Object.keys(ShowNew).map((p)=>{
            json_o[p] = ShowNew[p]
        })
        json_o[profile] = !ShowNew[profile]
        SetShowNew(json_o)


    }
    function acceptInvitation(e,id){
        e.preventDefault()
        e.stopPropagation()
        axios.post('accept_invitation',{collection:id})
            .then(r=>SetInvitation('Accepted'))
            .catch(error=>console.log(error))
    }

    function redirToAnnotation(e){
        e.preventDefault()
        e.stopPropagation()
        axios.get("change_collection_id",{params:{collection:props.collection.id}})
            .then(rs=> {
                SetCollection(props.collection.id);
                SetDocumentID(rs.data['document_id'])
                SetRedir(true)

            })
    }

    return(
        <div style={{marginBottom:'30px'}}>
            {Redir && <Redirect to={"/index"}/>}
            <TransferAnnotationDialog setoverwrite={SetOverWrite} options={AllOptions} collection={props.collection} memberfrom={MemberFrom} memberto={MemberTo} setmemberfrom={SetMemberFrom} setmemebeto={SetMemberTo} transfer={TransferAnnotations} open={ShowTransfer} handleClose={handleCloseTransferDialog} error={Error} />
            <DeleteMemberDialog todel={MemberToDel} open={OpenMemberDialog} deleteMember={deleteMember} error={Error} handleClose={handleCloseMemberDialog}/>
            <AddMemberDialog addMember={AddMember} setmembers={SetMembersToAdd} members={MembersToAdd} options={options} error={Error} name={props.collection.name} open={OpenAddMemberDialog} handleClose={handleCloseAddMemberDialog} />
            <AddLabelsDialog addlabels={AddLabels} error={Error} setlabelstoadd={SetLabelsToAdd} open={OpenAddLabelsDialog} handleClose={handleCloseAddlabelsDialog}/>
            <DeleteCollectionDialog open={OpenDeleteCollDialog} handleClose={handleCloseCollectionDialog} name={props.collection.name} error={Error} deletecollection={deleteCollection}/>




            <Card sx={{ minWidth: 275 , maxHeight:'30%', backgroundColor:'#dddddd40'}} elevation={3}>

                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        <div>
                            Creator: {props.collection.creator}
                        </div>

                    </Typography>
                    <Typography variant="h5" component="div">
                        {props.collection.name}&nbsp;&nbsp;
                        {/*<Chip size="small" label="Private" icon={<LockIcon/>} color='error'/>*/}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Date of creation: {props.collection.date}
                        <br/>

                        {/*{props.documents_count}*/}
                    </Typography>
                    <hr/>
                    <Typography variant="body2">
                        <h6>Documents: {props.collection.documents_count}</h6>
                        <h6>Annotations: {props.collection.annotations_count}</h6>
                        {props.collection.batch.length > 0 && <>
                            {props.collection.batch.map((b, i) =>
                                <>
                                    <p>{Object.keys(b)[0]}: {b[Object.keys(b)[0]]} documents</p>
                                </>
                            )}
                        </>}
                        <br/>
                        {/*<br />*/}
                        {/*<Typography variant="body2">*/}
                        {/*<hr/>*/}
                        <h6 style={{marginBottom:'1%'}}>Description:</h6>
                        <div>{props.collection.description}</div>

                    </Typography>
                    <Collapse in={ShowCollectionDetails}>
                        <Typography variant="body2">
                            <hr/>

                            <h6 style={{marginBottom:'1%',marginTop:'1%'}}>Members: </h6>
                            <div>
                                {JsonMembers !== {} && <div>
                                    {Object.keys(JsonMembers).map((k,o)=>
                                        <div>
                                            {JsonMembers[k].length > 0 &&
                                                <div style={{marginTop:'10px',marginBottom:'10px'}}>
                                                     <span style={{marginRight:'2%'}}>
                                                        <i>{k}:</i>
                                                    </span>
                                                    <ThemeProvider theme={theme}>
                                                    <span>
                                                        {JsonMembers[k].map((m, i) =>
                                                            <>{m.profile === k && i < 10 &&
                                                                <span style={{margin: '1%'}}>{Username === props.collection.creator ?
                                                                    <Chip variant={m.status === 'Invited' ? 'outlined' : 'filled'} label={m.username} color = {k} size="small" onDelete={(e) => {
                                                                        SetMemberToDel(m.username);
                                                                        SetOpenMemberDialog(true)
                                                                    }}/>
                                                                    : <Chip variant={m.status === 'Invited' ? 'outlined' : 'filled'} color = {k} label={m.username} size='small' />}
                                                                    </span>}
                                                                {/*{i >= 10 && <Chip onClick={()=>ShowMoreUsers(k)} label='Show more' size='small' color='primary' variant='outlined'/>}*/}
                                                                {/*<Collapse in={OpenMoreUsers[k]}>*/}

                                                                {/*</Collapse>*/}

                                                            </>

                                                        )}
                                                    </span>
                                                        {JsonMembersPlus10[k].length > 0 && <><span style={{margin: '1%'}}><Chip onClick={(e)=>ShowNew10UsersFunc(e,k)} color = {k} variant='outlined' label='Show more' size='small' /></span>
                                                            <div style={{marginTop: '10px',marginBottom:'10px'}}>
                                                                <Collapse in={ShowNew[k]===true}>
                                                                    {JsonMembersPlus10[k].map((m, i) =>
                                                                            <>{m.profile === k && i < 10 &&
                                                                                <span style={{margin: '1%'}}>{Username === props.collection.creator ?
                                                                                    <Chip variant={m.status === 'Invited' ? 'outlined' : 'filled'} label={m.username} color = {k} size="small" onDelete={(e) => {
                                                                                        SetMemberToDel(m.username);
                                                                                        SetOpenMemberDialog(true)
                                                                                    }}/>
                                                                                    : <Chip variant={m.status === 'Invited' ? 'outlined' : 'filled'} color = {k} label={m.username} size='small' />}
                                                                    </span>}

                                                                            </>

                                                                    )}
                                                                </Collapse>

                                                            </div>
                                                        </>}

                                                    </ThemeProvider>

                                                </div>}
                                        </div>
                                    )}
                                    <div>

                                        {Username === props.collection.creator && <>

                                            <Tooltip title="Add members" placement="top">
                                                <>Add new annotators
                                                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>SetOpenAddMemberDialog(true)}>
                                                        <AddCircleOutlineIcon />
                                                    </IconButton></></Tooltip>
                                            {/*<div style={{fontSize:'0.8rem'}}>You will be able to see the added annotators once they accepted the invitation.</div>*/}
                                        </>
                                            }
                                    </div>
                                </div>}
                            </div>

                            <hr/>
                            <ThemeProvider theme={theme}>
                                <h6 style={{marginBottom:'1%'}}>Labels: </h6>
                                <div>
                                    {Labels.map((m,i)=>
                                            <div style={{margin:'10px',display:"inline-block"}}><Chip label={m}  size = 'small' color='Label'   />
                                </div>

                                    )}
                                    {Username === props.collection.creator &&
                                        <Tooltip title="Add labels" placement="top">
                                            <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>SetOpenAddLabelsDialog(true)}>
                                                <AddCircleOutlineIcon />
                                            </IconButton></Tooltip>}
                                </div></ThemeProvider>

                        {/*    <h6 style={{marginTop:'2%',marginBottom:'1%'}}>Description:</h6>*/}
                        {/*     <div>{props.collection.description}</div>*/}

                        </Typography>
                    </Collapse>
                </CardContent>
                <CardActions>
                    {Invitation !== 'Invited' ? <>
                        <Button size="small" style={{marginRight:'1%'}} onClick={()=>SetShowCollectionDetails(prev=>!prev)}>Learn More</Button>
                        <Button href={'collections/'+props.collection.id} size="small" style={{marginRight:'1%'}}>Documents</Button>
                        <Button  onClick={redirToAnnotation} size="small" style={{marginRight:'1%'}}>Annotate</Button>
                        {/*<Button size="small" style={{marginRight:'1%'}}>Download</Button>*/}
                        {/*<Button size="small" style={{marginRight:'1%'}}>Stats</Button>*/}
                        {/*<Button onClick={()=>SetShowTransfer(prev=>!prev)} size="small" style={{marginRight:'1%'}}>Transfer</Button>*/}
                        {Username === props.collection.creator && <>
                            {/*<Button size="small" style={{marginRight:'1%'}}>Add documents</Button>*/}
                            <Button color="error" onClick={()=>SetOpenDeleteCollDialog(true)} size="small" style={{marginRight:'1%'}}>Delete</Button></>}
                    </> : <>
                        <Button variant = 'contained' color={'error'} size="small" style={{marginRight:'1%'}} onClick={(e)=>{acceptInvitation(e,props.collection.id)}}>Accept Invitation</Button>

                    </>
                        }


                </CardActions>
            </Card>
        </div>
    );
}