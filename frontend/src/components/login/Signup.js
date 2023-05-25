import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import '../General/first_row.css';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FormGroup from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';

import {

    Redirect
} from "react-router-dom";
import Alert from "@mui/material/Alert";
import './login.css'
import img from "../../logo/img_1.png";

function SignUp() {


    const { username,curannotator} = useContext(AppContext);


    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [PasswordVal,SetPasswordVal] = useState(false)
    const [PasswordValUp,SetPasswordValUp] = useState(false)
    const [passwordErrorUp, setPasswordErrorUp] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [Email,SetEmail] = useState('')
    const [Redir,SetRedir] = useState(0)
    const [Username,SetUsername] = useState('')
    const [Password,SetPassword] = useState('')
    const [Error,SetError] = useState('')
    const [User,SetUser] = username
    const [Profile,SetProfile] = useState('')

    function handleChangeprofile(e){
        var option = e.target.value
        console.log('option',option)
        SetProfile(option)
    }

    function handleChangeEmail(e){
        var option = e.target.value
        console.log('option',option)
        SetEmail(option)
    }

    function handleSubmit(event){
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password'),
            profile: data.get('profile'),
            ncbi: data.get('ncbikey'),
            orcid: data.get('orcid'),
            // email: data.get('email'),
        });
        if(data.get('username','') !== '' && data.get('password','') !== '' && data.get('password_check','') !== '' && data.get('profile','') !== ''){
            axios({
                method: "post",
                url: "register",
                data: data,
                headers: { "Content-Type": "multipart/foncbirm-data" },
            })
                .then(function (response) {
                    //handle success
                    if(response.status === 500){
                        SetError( 'The username you chose already exists')
                    }else{
                        SetUser(data.get('username'))
                        SetCurAnnotator(data.get('username'))
                        // return <Redirect to='/index'/>
                        // SetUser(username)
                        SetRedir(true)
                        // }

                    }
                })
                .catch(function (response) {

                    SetError('Something went wrong')
                    SetUsername('')
                    SetPassword('')
                    SetProfile('')
                    SetRedir(0)
                });
        }
        else{
            SetError('In order to sign up you need to insert a username, a password and a profile')
        }


    }
    function handleChangeUsername(e){
        e.preventDefault()
        SetError('')
        console.log('target',e.currentTarget.value)
        SetUsername(e.currentTarget.value)


    }
    // function isValid(password){
    //     if(password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)){
    //         return true
    //
    //     }
    //     return false
    // }
    // function handleChangePsw(e){
    //     e.preventDefault()
    //     SetError('')
    //     console.log('target',e.currentTarget.value)
    //     SetPassword(e.currentTarget.value)
    //
    //
    // }

    const handlePasswordChange = (event) => {
        const passwordValue = event.target.value;
        SetPasswordVal(passwordValue);
        console.log( /[0-9]/.test(passwordValue))
        console.log( /[A-Z]/.test(passwordValue))
        if (passwordValue.length < 8 || /[0-9]/.test(passwordValue) === false || /[A-Z]/.test(passwordValue) === false) {
            setPasswordError("Password must contain 8 chars, one number, one uppercase letter");
        } else {
            setPasswordError("");
        }
    };

    const handlePasswordUpChange = (event) => {
        const passwordValue = event.target.value;
        SetPasswordValUp(passwordValue);
        console.log( /[0-9]/.test(passwordValue))
        console.log( /[A-Z]/.test(passwordValue))
        if (passwordValue.length < 8 || /[0-9]/.test(passwordValue) === false || /[A-Z]/.test(passwordValue) === false) {
            setPasswordErrorUp("Password not compliant");
        } else {
            setPasswordErrorUp("");
        }
    };


    return (
        <div className="App">

           <div >
                <Container fluid>
                    {Redir === true&& <Redirect to='/index'/>}
                    {/*{Redir === false && <Redirect to='/signup'/>}*/}
                    {/*<Row>*/}
                    {/*    <Col md={2}></Col>*/}
                    {/*    <Col md={4}>      <div><img className={'login'} src={"http://metatron.dei.unipd.it/static/img/logo.png"} />*/}
                    {/*    </div></Col>*/}
                    {/*    <Col md={4}>*/}


                        <div>

                            <div className={'reglog'}>
                                <div><img className={'login'} src={"http://metatron.dei.unipd.it/static/img/logo.png"} />
                                </div>

                            {Error !== '' && <div style={{width:'30vw',display:"inline-block"}}><Alert severity="error">{Error}</Alert></div>}

                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <FormControl>


                                    <div style={{marginTop:'3vh'}}>
                                        <TextField sx={{ width:'20vw' }}   size="small"
                                                    value={Username} onChange={(e)=>handleChangeUsername(e)}
                                                   name="username" required id="standard-basic" label="Username" variant="outlined" />
                                    </div>
                                    <div style={{marginTop:'3vh'}}>
                                        <div style={{fontSize:'0.8rem',textAlign:'left'}}>Password must contain: at least 8 chars, one uppercase letter and one number.</div>
                                        <TextField
                                            id="password"
                                            label="Password"
                                            type="password"
                                            size={'small'}
                                            sx={{ width:'20vw' }}
                                            onChange={handlePasswordChange}
                                            error={passwordError !== ""}
                                            helperText={passwordError}
                                        />
                                        <br/>
                                        {/*<div>Insert your password again</div>*/}
                                        <div style={{marginTop:'3vh'}}>
                                            <TextField
                                                id="password_check"
                                                label="Insert password again"
                                                type="password"
                                                size={'small'}
                                                sx={{ width:'20vw' }}
                                                onChange={handlePasswordUpChange}
                                                error={passwordErrorUp !== ""}
                                                helperText={passwordErrorUp}
                                            />
                                        </div>
                                    <div style={{marginTop:'3vh'}}>
                                        <FormControl variant="outlined" size="small" >
                                            <InputLabel id="demo-simple-select-standard-label">Profile</InputLabel>
                                            <Select
                                                name="profile"
                                                required
                                                labelId="simple-select-label"
                                                id="simple-select"

                                                value={Profile}
                                                label="Profile"
                                                sx={{ width:'20vw' }}
                                                onChange={(option)=>handleChangeprofile(option)}
                                            >
                                                {/*<MenuItem value='Tech'>Tech</MenuItem>*/}
                                                <MenuItem value='Expert'>Expert</MenuItem>
                                                <MenuItem value='Beginner'>Beginner</MenuItem>
                                                <MenuItem value='Professor'>Professor</MenuItem>
                                                <MenuItem value='Student'>Student</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </div>
                                     <Button type="submit"  sx={{ '& > :not(style)': { m: 1 },background:"linear-gradient(90deg, rgb(126 42 148) 0%, rgb(45 83 141) 100%)" }} size={'large'}
                                             variant="contained" style={{marginTop:'5vh',width:'20vw'}}>Sign up</Button></div>
                                </FormControl>

                                {window.location.hostname === "metatron.dei.unipd.it" && <div style={{marginTop: '2vh'}}>
                                    <a href={"https://metatron.dei.unipd.it/signup_with_orcid"}>
                                        <img className={'orcid'}
                                             src="https://metatron.dei.unipd.it/static/img/ORCID.png"
                                             alt="ORCID ID logo"/> Sign up with ORCID ID
                                    </a>
                                </div>}



                            </Box>
                            <br/>
                            <div style={{marginTop:'2vh'}}>
                                <Link href="http://localhost:8000/loginPage" variant="body2">
                                    {"Already have an account? Log in"}
                                </Link>
                            </div>

                        </div>
                    </div>
                    {/*    </Col>*/}
                    {/*    <col md={2}></col>*/}
                    {/*</Row>*/}
                </Container>
            </div>

        </div>
    );
}


export default SignUp;
