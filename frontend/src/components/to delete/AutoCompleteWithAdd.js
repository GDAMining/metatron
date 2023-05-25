import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import React, {useContext, useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Mention from "../Annotation/mentions/Mention";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";

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
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import '../Annotation/annotation.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import Chip from '@mui/material/Chip';
import {ConceptContext} from "../Annotation/concepts/DraggableConceptModal";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

export default function AutoCompleteWithAdd(props){

    const {area,url,name,urlname,description,areas,conceptslist} =  useContext(ConceptContext);
    const [Areas,SetAreas] = areas
    const [ConceptsList,SetConceptsList] = conceptslist
    const [AddArea,SetAddArea] = useState(false)
    const [AddConcept,SetAddConcept] = useState(false)
    const [Options,SetOptions] = useState(false)
    let names = []
    ConceptsList.map(x=>{
        names.push(x.name)
    })
    let urls = []
    ConceptsList.map(x=>{
        urls.push(x.url)
    })
    const [AreaValue,SetAreaValue] = area
    const [ConceptValue,SetConceptValue] = name
    const [UrlValue,SetUrlValue] = url
    const [Value,SetValue] = useState(null)

    useEffect(()=>{
        if(props.to_add === 'Area'){
            SetValue(AreaValue)
        }else if(props.to_add === 'Concept Name'){
            SetValue(ConceptValue)
        }else if(props.to_add === 'Concept Url'){
            SetValue(UrlValue)
        }
    },[props.to_add,AreaValue,ConceptValue,UrlValue])


    // useEffect(()=>{
    //     if(AreaValue !== null){
    //         let filtered = []
    //         ConceptsList.map(opt=>{
    //             if(opt.area === AreaValue.area && filtered.indexOf(opt) ===-1){
    //                 filtered.push(opt)
    //             }
    //         })
    //         if(filtered.length === 1){
    //             SetUrlValue(filtered[0])
    //             SetConceptValue(filtered[0])
    //         }
    //         else{
    //             SetUrlValue(null)
    //             SetConceptValue(null)
    //         }
    //     }
    //         // else{
    //     //     SetUrlValue(null)
    //     //     SetConceptValue(null)
    //     // }
    // },[AreaValue])

    useEffect(()=>{
        if(AreaValue !== null){
            let filtered = []
            ConceptsList.map(opt=>{
                if(opt.area === AreaValue.area && filtered.indexOf(opt) ===-1){
                    filtered.push(opt)
                }
            })
            if(filtered.length === 1){
                SetUrlValue(filtered[0])
                SetConceptValue(filtered[0])
            }
            // else{
            //     SetUrlValue(null)
            //     SetConceptValue(null)
            // }
        }
    },[AreaValue])
    //
    useEffect(()=>{
        if(UrlValue !== null){
            let filtered = []
            ConceptsList.map(opt=>{
                if(opt.url === UrlValue.url && filtered.indexOf(opt) ===-1){
                    filtered.push(opt)
                }
            })
            if(filtered.length === 1){
                SetConceptValue(filtered[0])
                SetAreaValue(filtered[0])
            }
            else if (filtered.length > 1){
                SetConceptValue(null)

            }
            else if(ConceptValue !== null && names.indexOf(ConceptValue.name) !== -1 && urls.indexOf(UrlValue.url) === -1){
                SetConceptValue(null)
            }
        }
        //     else{
        //     SetConceptValue(null)
        //
        // }
    },[UrlValue])

    useEffect(()=>{
        if(ConceptValue !== null){
            let filtered = []
            ConceptsList.map(opt=>{
                if(opt.name === ConceptValue.name && filtered.indexOf(opt) ===-1){
                    filtered.push(opt)
                }
            })
            if(filtered.length === 1){
                SetUrlValue(filtered[0])
                SetAreaValue(filtered[0])

            }
            else if (filtered.length > 1){
                SetUrlValue(null)

            }
            else if(UrlValue !== null && urls.indexOf(UrlValue.url) !== -1 && names.indexOf(ConceptValue.name) === -1){
                SetUrlValue(null)
            }

        }
        // else{
        //     SetUrlValue(null)
        //
        // }
    },[ConceptValue])
    //




    // useEffect(()=>{
    //     if(AreaValue !== null){
    //         let filtered = []
    //         ConceptsList.map(opt=>{
    //             if(opt.area === AreaValue.area && filtered.indexOf(opt) ===-1){
    //                 filtered.push(opt)
    //             }
    //         })
    //         if(filtered.length === 1){
    //             SetUrlValue(filtered[0])
    //             SetConceptValue(filtered[0])
    //         }
    //     }
    //     if(ConceptValue !== null){
    //         let filtered = []
    //         ConceptsList.map(opt=>{
    //             if(opt.name === ConceptValue.name && filtered.indexOf(opt) ===-1){
    //                 filtered.push(opt)
    //             }
    //         })
    //         if(filtered.length === 1){
    //             SetUrlValue(filtered[0])
    //             SetAreaValue(filtered[0])
    //         }
    //     }
    //     if(UrlValue !== null){
    //         let filtered = []
    //         ConceptsList.map(opt=>{
    //             if(opt.url === ConceptValue.url && filtered.indexOf(opt) ===-1){
    //                 filtered.push(opt)
    //             }
    //         })
    //         if(filtered.length === 1){
    //             SetConceptValue(filtered[0])
    //             SetAreaValue(filtered[0])
    //         }
    //     }
    // },[AreaValue,ConceptValue,UrlValue])



    return(
            <div>
                <Autocomplete
                    value={Value}
                    sx={{ width: '100%' }}

                    onChange={(event, newValue) => {

                        if(props.to_add === 'Area'){
                            if (typeof newValue === 'string') {
                                SetAreaValue({
                                    area: newValue,
                                });
                            } else if (newValue && newValue.inputValue) {
                                SetAddArea(true)
                                // Create a new value from the user input
                                SetAreaValue({
                                    area: newValue.inputValue,
                                });
                            } else {
                                SetAddArea(true)
                                SetAreaValue(newValue);
                            }
                        }else if(props.to_add === 'Concept Name'){
                            if (typeof newValue === 'string') {
                                SetConceptValue({
                                    name: newValue,
                                });
                            } else if (newValue && newValue.inputValue) {
                                SetAddConcept(true)
                                // Create a new value from the user input
                                SetConceptValue({
                                    name: newValue.inputValue,
                                });
                            } else {
                                SetAddConcept(true)
                                SetConceptValue(newValue);
                            }
                        }else if(props.to_add === 'Concept Url'){
                            if (typeof newValue === 'string') {
                                SetUrlValue({
                                    url: newValue,
                                });
                            } else if (newValue && newValue.inputValue) {
                                SetAddConcept(true)
                                // Create a new value from the user input
                                SetUrlValue({
                                    url: newValue.inputValue,
                                });
                            } else {
                                SetAddConcept(true)
                                SetUrlValue(newValue);
                            }
                        }

                    }}

                    filterOptions={(options, params) => {
                        // const filtered = filter(options, params);
                        console.log('add',props.to_add)
                        let filtered = []
                        const { inputValue } = params;

                        ConceptsList.map((opt)=> {
                            console.log('filtered',opt,AreaValue,ConceptValue)

                            if (AreaValue === null || (opt.area === AreaValue.area)) {
                                if (ConceptValue !== null){
                                    if(filtered.indexOf(opt) === -1 && (opt.name === ConceptValue.name)){
                                        filtered.push(opt)
                                    }
                                }else{
                                    if(filtered.indexOf(opt) === -1){
                                        filtered.push(opt)

                                    }
                                }
                            }

                        })
                        console.log('filtered',filtered)

                        if(inputValue !== '') {
                            const {inputValue} = params;
                            // Suggest the creation of a new value

                            if(props.to_add === 'Area') {
                                const isExisting = Areas.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim())
                                filtered = filtered.filter(x => x.area.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))

                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        area: `Add "${inputValue}"`,
                                    });
                                }
                            } else if(props.to_add === 'Concept Name') {

                                const isExisting = names.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim())
                                filtered = filtered.filter(x => x.name.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        name: `Add "${inputValue}"`,
                                    });
                                }
                            }else if(props.to_add === 'Concept Url') {
                                const isExisting = urls.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim())
                                filtered = filtered.filter(x => x.url.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        url: `Add "${inputValue}"`,
                                    });
                                }
                            }

                        }
                        console.log('filtered',filtered)
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
                        if(props.to_add === 'Area') {
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option.area;

                        } else if(props.to_add === 'Concept Name') {
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option.name;

                        }else if(props.to_add === 'Concept Url') {
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option.url;
                        }
                    }}

                    renderOption={(props1, option, { inputValue }) => {

                        let parts = []

                        if(props.to_add === 'Area'){
                            const matches_area = match(option.area, inputValue, { insideWords: true });
                            let parts_area = parse(option.area, matches_area);
                            parts = parts_area
                        }
                        else if(props.to_add === 'Concept Name'){
                            const matches_concept = match(option.name, inputValue, { insideWords: true });
                            const parts_concept = parse(option.name, matches_concept);
                            parts = parts_concept

                        }else if(props.to_add === 'Concept Url'){
                            const matches_url = match(option.url, inputValue, { insideWords: true });
                            const parts_url = parse(option.url, matches_url);
                            parts = parts_url

                        }
                        return (
                            <li {...props1}>
                                <div>
                                    {parts.map((part, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                fontWeight: part.highlight ? 700 : 400,
                                                color: part.highlight ? 'royalblue' : 'black',
                                            }}
                                        >
                                              {part.text}
                                            </span>
                                    ))}
                                </div>
                            </li>
                        );



                    }}

                    freeSolo
                    renderInput={(params) => (
                        <TextField {...params} label={props.to_add} />
                    )}
                />
            </div>


    )

}
