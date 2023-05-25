import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Mention from "../mentions/Mention";
import RemoveIcon from '@mui/icons-material/Remove';
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import IconButton from '@mui/material/IconButton';

import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Fade from '@mui/material/Fade';
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
import DocumentToolBar from "../../Document/ToolBar/DocumentToolBar";
import ToolBar from "../../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import '../annotation.css'
import {CircularProgress, useColorScheme} from "@mui/material";
import {AppContext} from "../../../App";
import Chip from '@mui/material/Chip';
import CollectionsComponent from "../../SideBar/ChangeCollections";
import {ConceptContext} from "../../../BaseIndex";

export default function AddNewConcept(props){
    const {area,url,name,conceptslist,description,areas} =  useContext(ConceptContext);
    const [Area,SetArea] = area
    const [AreaValue,SetAreaValue] = useState(null)
    const [Areas,SetAreas] = areas
    const [ConceptsList,SetConceptsList] = conceptslist

    const [Name,SetName] = name
    const [Url,SetUrl] = url
    const [Description,SetDescription] = description
    const [AddSem,SetAddSem] = useState(false)


    useEffect(()=>{
        console.log('areavalue',AreaValue)
    },[AreaValue])

    return(
        <div>
            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Add a new Concept
            </DialogTitle>
            <DialogContent>
                <div style={{paddingBottom:'8%'}}>
                    <i>Select a Concept URL, a Concept Name, a Concept Description (optional), and a Concept Type</i>

                </div>

                <div>
                    {/*<i>Select the URL or the name of a concept</i>*/}
                    <div>
                        <TextField
                               sx={{ width: '100%' }}
                               onChange={(e)=>SetUrl(e.target.value)}
                               label="Concept URL" />

                    </div>
                </div>
                <br/>
                <div>
                    {/*<i>Select the URL of a concept</i>*/}
                    <div>


                                <TextField sx={{ width: '100%' }}
                                                                onChange={(e)=>SetName(e.target.value)}
                                                                label="Concept Name" />
                         {/*    }*/}
                         {/*/>*/}
                    </div><br/>
                    <div>
                        {/*<i>Select the URL of a concept</i>*/}
                        <div>
                            <TextField sx={{ width: '100%' }}
                                       onChange={(e)=>SetDescription(e.target.value)}
                                       label="Concept Description" />
                            {/*    }*/}
                            {/*/>*/}
                        </div>

                        <br/>


                        {Areas.length > 0 ? <div>
                                <Autocomplete
                                    value={AreaValue}
                                    sx={{ width: '100%' }}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            SetAreaValue({
                                                area: newValue,
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            SetAreaValue({
                                                area: newValue.inputValue,
                                            });
                                        } else {
                                            SetAreaValue(newValue);
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        // const filtered = filter(options, params);
                                        let filtered = []
                                        const { inputValue } = params;

                                        if(inputValue === ''){
                                            ConceptsList.map((opt)=>{
                                                filtered.push(opt)
                                            })
                                        }else {
                                            const {inputValue} = params;
                                            // Suggest the creation of a new value
                                            const isExisting = Areas.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim())
                                            filtered = ConceptsList.filter(x => x.area.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push({
                                                    inputValue,
                                                    area: `Add "${inputValue}"`,
                                                });
                                            }

                                        }

                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    id="free-solo-with-text-demo"
                                    options={ConceptsList}
                                    getOptionLabel={(option) => {
                                        // Value selected with enter, right from the input
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        // Add "xxx" option created dynamically
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        }
                                        // Regular option
                                        return option.area;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.area}</li>}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} label="Concept type" />
                                    )}
                                />

                        {/*  <Autocomplete*/}
                        {/*    options={ConceptsList}*/}
                        {/*    // options={ConceptsList.map((opt)=>{*/}
                        {/*    //     opt['label'] = opt.area*/}
                        {/*    // })}*/}

                        {/*    value={AreaValue !== null ? AreaValue.area :null}*/}

                        {/*    getOptionLabel={(option) => {*/}
                        {/*        // Value selected with enter, right from the input*/}
                        {/*        if (typeof option === 'string') {*/}
                        {/*            return option;*/}
                        {/*        }*/}
                        {/*        // // Add "xxx" option created dynamically*/}
                        {/*        if (option.inputValue) {*/}
                        {/*            return option.label;*/}
                        {/*            //*/}
                        {/*            // return "Add" + '"'+option.inputValue+'"';*/}
                        {/*        }*/}
                        {/*        // Regular option*/}
                        {/*        else{*/}
                        {/*            return option.area;*/}

                        {/*        }*/}
                        {/*    }}*/}

                        {/*    // getOptionLabel={(option)=>option.label}*/}
                        {/*    onChange={(event, newValue) => {*/}
                        {/*        event.preventDefault()*/}
                        {/*        console.log('change')*/}

                        {/*        if (typeof newValue === 'string') {*/}
                        {/*            SetAreaValue({*/}
                        {/*                area: newValue,*/}
                        {/*            });*/}
                        {/*        }*/}
                        {/*            // else*/}

                        {/*        if (newValue && newValue.inputValue) {*/}
                        {/*            // Create a new value from the user input*/}
                        {/*            SetAreaValue({area:newValue.inputValue});*/}
                        {/*        } else {*/}
                        {/*            SetAreaValue(newValue);*/}
                        {/*        }*/}
                        {/*    }}*/}

                        {/*    filterOptions={(options, params) => {*/}
                        {/*        var filtered = [];*/}
                        {/*        const { inputValue } = params;*/}

                        {/*        if(inputValue === ''){*/}
                        {/*            ConceptsList.map((opt)=>{*/}
                        {/*                filtered.push(opt)*/}
                        {/*            })*/}
                        {/*        }else{*/}
                        {/*            const isExisting = Areas.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim());*/}
                        {/*            if (inputValue !== '' && !isExisting) {*/}
                        {/*                filtered = ConceptsList.filter(x => x.area.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))*/}
                        {/*                filtered.push({*/}
                        {/*                    inputValue,*/}
                        {/*                    area:inputValue,*/}
                        {/*                    label: `Add "${inputValue}"`,*/}
                        {/*                    // area: `Add "${inputValue}"`,*/}
                        {/*                });*/}
                        {/*            }else{*/}
                        {/*                filtered = ConceptsList.filter(x => x.area.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))*/}
                        {/*            }*/}
                        {/*        }*/}


                        {/*        // Suggest the creation of a new value*/}

                        {/*        console.log('filtered',filtered)*/}
                        {/*        return filtered;*/}
                        {/*    }}*/}

                        {/*    sx={{ width: '100%' }}*/}


                        {/*    renderInput={(params) => <TextField {...params} label="Area" />}*/}
                        {/*/>*/}
                            <div>
                                <spna>
                                    Not found the Concept Type? Add a new one
                                </spna>
                                <span>

                                <IconButton color="primary" aria-label="upload picture" component="label" onClick={()=>SetAddSem(prev=>!prev)}>
                                    {AddSem ? <RemoveIcon /> :<AddIcon />}
                                </IconButton>
                                </span>
                            </div>
                            <Collapse in={AddSem}>
                                <TextField sx={{ width: '100%' }}
                                           onChange={(e)=>SetArea(e.target.value)}
                                           label="New Concept Type" />
                            </Collapse>
                        </div> :
                            <div>
                                Add a Concept Type
                            <div>

                            </div>
                            <TextField sx={{ width: '100%' , paddingBottom:'2%'}}
                            onChange={(e)=>SetArea(e.target.value)}
                            label="New Concept Type" />


                            </div>

                            }
                    </div>


                </div>


            </DialogContent>
        </div>
    )
}
