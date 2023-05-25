import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert'
import img from '../../logo/img_1.png'
import './login.css'

// import '../General/first_row.css';
import AccountCircle from '@mui/icons-material/AccountCircle';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Redirect} from "react-router-dom";


function Login() {


    const { showbar,username,usecaseList,reports,languageList,curannotator,redir } = useContext(AppContext);


    const [Username,SetUsername] = useState('')
    const [User,SetUser] = username
    const [Password,SetPassword] = useState('')
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [Error,SetError] = useState('')
    const [Redir,SetRedir] = redir
    const [Login,SetLogin] = useState(false)
    const [Orcid,SetOrcid] = useState(false)
    console.log('login')
    const orcid_error = window.error;
    useEffect(()=>{
        if(orcid_error !== null && orcid_error !== false && orcid_error !== undefined && orcid_error !== ''){
            SetError('The user does not exist, or has not linked the account to the ORCID ID yet')
        }
    },[orcid_error])

    const handleSubmit1 = (event) =>{
        console.log('us')
        event.preventDefault();
        event.stopPropagation();
        const data = new FormData(event.currentTarget);
        // console.log({
        //     username: data.get('username'),
        //     password: data.get('password'),
        // });
        var username = data.get('username')
        // SetUser(username)
        console.log('uu',username)
        if (data.get('username','') !== '' && data.get('password','') !== '' ){
            axios({
                method: "post",
                url: "login",
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((response) =>{
                    //handle success
                    console.log('resp',response)

                    SetUser(username)
                    SetCurAnnotator(username)

                    // return <Redirect to='/index'/>
                        // SetUser(username)
                    SetRedir(true)
                    // }

                })
                .catch((response) =>{
                    //handle error
                    console.log(response);
                    SetError('The password or the username are not valid')
                    SetRedir(0)
                    SetUsername('')
                    SetPassword('')
                });
        }
        else {
            SetError('The password or the username are missing')
        }

    }
    function handleChangeUsername(e){
        e.preventDefault()
        SetError('')
        // console.log('target',e.currentTarget.value)
        SetUsername(e.currentTarget.value)


    }
    function handleChangePsw(e){
        e.preventDefault()
        SetError('')
        // console.log('target',e.currentTarget.value)
        SetPassword(e.currentTarget.value)


    }

    function LoginOrcid(e){
        e.preventDefault()
        axios.get("login_with_orcid")
        //     .then(response=>{
        //     SetLogin(true)
        //     SetOrcid(response.data['orcid'])
        // }).catch(error=>{
        //     console.log(error)
        // })
    }
    useEffect(()=>{
        if(Login && Orcid){
            const formData = new FormData();
            formData.append('orcid', Orcid);

            axios({
                method: "post",
                url: "login",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((response) =>{
                    //handle success
                    console.log('resp',response)

                    SetUser(username)
                    SetCurAnnotator(username)

                    // return <Redirect to='/index'/>
                    // SetUser(username)
                    SetRedir(true)
                    // }

                })
                .catch((response) =>{
                    //handle error
                    console.log(response);
                    SetError('An error occurred')
                    SetRedir(0)
                    SetUsername('')
                    SetPassword('')
                });
        }
    },[Login,Orcid])




    return (
        <div className="App">




            <div >
                <Container fluid>
                    {(Redir === true  && (User && User !== '' && User !== undefined)) && <Redirect to='/index'/>}
                <div>

                    <div className={'reglog'}>
                        <div><img className={'login'} src={"http://metatron.dei.unipd.it/static/img/logo.png"} /></div>
                        {/*<h2>*/}
                        {/*    Log in*/}
                        {/*</h2>*/}
                        {/*<hr style={{width:'30vw'}}/>*/}
                        {Error !== '' && <div style={{width:'30vw',display:"inline-block"}}><Alert severity="error">{Error}</Alert></div>}
                        <Box component="form" onSubmit={(e)=>{handleSubmit1(e)}} noValidate sx={{ mt: 1 }}>
                            <FormControl>
                                <div style={{marginTop:'3vh'}}>
                                    <TextField sx={{ width:'20vw' }}   size="small"

                                        // value={Username}
                                               // onChange={(e)=>{handleChangeUsername(e)}}
                                               name="username" required id="standard-basic" label="Username" variant="outlined" />
                                </div>
                                <div style={{marginTop:'3vh'}}>
                                    <TextField
                                        // onChange={(e)=>{handleChangePsw(e)}}
                                        required
                                        sx={{ width:'20vw' }}
                                        id="standard-password-input"
                                        label="Password"
                                        type="password"
                                        name="password"
                                        size="small"

                                        autoComplete="current-password"
                                        // value={Password}
                                        variant="outlined"
                                    />
                                </div>





                                <Button type="submit"  sx={{ '& > :not(style)': { m: 1 },background:"linear-gradient(90deg, rgb(126 42 148) 0%, rgb(45 83 141) 100%)" }} size={'large'}
                                        variant="contained" style={{marginTop:'5vh',width:'20vw'}}>Log In</Button>
                            </FormControl>
                            {window.location.hostname === "metatron.dei.unipd.it" &&<div style={{marginTop: '2vh'}}><a href={'https://metatron.dei.unipd.it/login_with_orcid'}>
                                {/*<Button onClick={(e)=>LoginOrcid(e)}>*/}
                                <img className={'orcid'} height='4vh'
                                     src="https://metatron.dei.unipd.it/static/img/ORCID.png" alt="ORCID ID logo"/> Log
                                in with ORCID ID
                            </a>
                            </div>}

                        </Box>

                        <br/>
                        <div style={{marginTop:'2vh'}}>
                            <Link href="https://metatron.dei.unipd.it/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </div>

                    </div>
                </div>
                </Container>
            </div>

        </div>
    );
}


export default Login;
