import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import React, {useContext, useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Mention from "../mentions/Mention";

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

import '../annotation.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../../App";

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {RelationConceptContext} from "./RelationshipConceptModal";
import {ConceptContext, RelSearchContext} from "../../../BaseIndex";
import {isElementOfType} from "react-dom/test-utils";

export default function AutoCompleteWithAdd(props) {
    const {inarel, showrelspannel, newfact, newfactin} = useContext(AppContext);

    const [InARel, SetInARel] = inarel
    const [NewFact, SetNewFact] = newfact
    const [NewFactInterno, SetNewFactInterno] = newfactin

    const [ShowRels, SetShowRels] = showrelspannel

    const {
        area,
        url,
        name,
        areas,
        conceptslist,
        areaSearch,
        urlSearch,
        nameSearch,
        areasSearch,
        searchsubject,
        searchpredicate,
        searchobject
    } = useContext(ConceptContext);
    const {area1, url1, name1, urlname1, description1, areas1, conceptslist1} = useContext(RelationConceptContext);
    // const {areaSearch,urlSearch,nameSearch,areasSearch,searchsubject,searchpredicate,searchobject} =  useContext(RelSearchContext);
    // const [Areas,SetAreas] = InARel ? areas1 : areas
    // const [ConceptsList,SetConceptsList] = InARel ? conceptslist1 : conceptslist
    // const [AreaValue,SetAreaValue] = InARel? area1 : area
    // const [ConceptValue,SetConceptValue] =InARel ? name1 : name
    // const [UrlValue,SetUrlValue] = InARel ? url1 : url
    const [SearchSubject, SetSearchSubject] = searchsubject
    const [SearchPredicate, SetSearchPredicate] = searchpredicate
    const [SearchObject, SetSearchObject] = searchobject


    const [Areas, SetAreas] = areas
    const [ConceptsList, SetConceptsList] = conceptslist

    const [AreaValue, SetAreaValue] = area
    const [ConceptValue, SetConceptValue] = name
    const [UrlValue, SetUrlValue] = url

    const [AreaValueRel, SetAreaValueRel] = (InARel || NewFact || NewFactInterno) ? area1 : useState(null)
    const [ConceptValueRel, SetConceptValueRel] = (InARel || NewFact || NewFactInterno) ? name1 : useState(null)
    const [UrlValueRel, SetUrlValueRel] = (InARel || NewFact || NewFactInterno) ? url1 : useState(null)


    const [ConceptValueSearch, SetConceptValueSearch] = (SearchObject || SearchPredicate || SearchSubject) ? nameSearch : useState(null)
    const [UrlValueSearch, SetUrlValueSearch] = (SearchObject || SearchPredicate || SearchSubject) ? urlSearch : useState(null)
    const [AreaValueSearch, SetAreaValueSearch] = (SearchObject || SearchPredicate || SearchSubject) ? areaSearch : useState(null)


    const [AddArea, SetAddArea] = useState(false)
    const [AddConcept, SetAddConcept] = useState(false)
    const [Options, SetOptions] = useState(false)
    const [AreaOptions, SetAreaOptions] = useState(false)
    const [NameOptions, SetNameOptions] = useState(false)
    const [UrlOptions, SetUrlOptions] = useState(false)
    const [ShowUrlComplete, SetShowUrlComplete] = useState(false)
    const [ConceptValueFinal, SetConceptValueFinal] = useState(null)
    const [UrlValueFinal, SetUrlValueFinal] = useState(null)
    const [AreaValueFinal, SetAreaValueFinal] = useState(null)

    const [NewConcept,SetNewConcept] = useState(false)

    let names = []
    ConceptsList.map(x => {
        names.push(x.name)
    })
    let urls = []
    ConceptsList.map(x => {
        urls.push(x.url)
    })

    let areas_list = []
    ConceptsList.map(x => {
        areas_list.push(x.area)
    })


    const [Value, SetValue] = useState(null)


    function resetOptions() {
        let options = []
        ConceptsList.map(x => {
            let obj = {}
            obj['area'] = x['area']
            // console.log('opt1', obj, options, options.indexOf(obj))
            const filtered = options.filter(ele => ele.area === x['area']);
            if (filtered.length === 0) {
                options.push(obj)
            }

        })
        SetAreaOptions(options)
        options = []
        // SetValue(AreaValue)
        ConceptsList.map(x => {
            let obj = {}
            // obj['url'] = x['url']
            obj['name'] = x['name']
            // obj['area'] = x['area']

            const filtered = options.filter(ele => ele.name === x['name']);
            if (filtered.length === 0) {
                options.push(obj)
            }

        })
        SetNameOptions(options)
        // if(options.length === 1){
        //     SetConceptValue(options[0])
        // }
        options = []

        ConceptsList.map(x => {
            let obj = {}
            obj['url'] = x['url']
            // obj['name'] = x['name']
            // obj['area'] = x['area']
            const filtered = options.filter(ele => ele.url === x['url']);
            if (filtered.length === 0) {
                options.push(obj)
            }
        })
        // if(options.length === 1){
        //     SetUrlValue(options[0])
        // }
        SetUrlOptions(options)
        SetNewConcept(false)
    }


    function updateConceptsListsArea(newValue) {
        let options_c = []
        // SetValue(AreaValue)
        ConceptsList.map(x => {
            let obj = {}
            // obj['url'] = x['url']
            if (x.area.trim() === newValue.area.trim()) {

                // if (x.area.toLowerCase().trim() === newValue.area.toLowerCase().trim()) {
                obj['name'] = x['name']
                // obj['area'] = x['area']
                let filtered = [];
                if(UrlValueFinal !== undefined && UrlValueFinal !== null){
                    if (x.url === UrlValueFinal.url){
                        filtered = options_c.filter(ele => ele.name === x['name']);
                        if (filtered.length === 0) {
                            options_c.push(obj)
                        }
                    }
                }else{
                    filtered = options_c.filter(ele => ele.name === x['name']);
                    if (filtered.length === 0) {
                        options_c.push(obj)
                    }
                }

            }


        })
        if (options_c.length === 1) {
            SetConceptValueFinal(options_c[0])

            if (props.type === 'search') {
                SetConceptValueSearch(options_c[0])
            } else if (props.type === 'concept') {
                SetConceptValue(options_c[0])

            } else if (props.type === 'relationship') {
                SetConceptValueRel(options_c[0])

            }
        } else if(NewConcept === false){
            if((!(ConceptValueFinal && options_c.map(x=>x.name).indexOf(ConceptValueFinal.name) !== -1))){
                SetConceptValueFinal(null)
                SetConceptValueSearch(null)
                SetConceptValue(null)
                SetConceptValueRel(null)
            }


        }
        SetNameOptions(options_c)


        let options = []
        ConceptsList.map(x => {
            let obj = {}
            obj['url'] = x['url']
            // obj['name'] = x['name']
            // obj['area'] = x['area']
            if (x.area === newValue.area) {
                let filtered = [];
                if(ConceptValueFinal !== undefined && ConceptValueFinal !== null){
                    if(x.name === ConceptValueFinal.name){
                        filtered = options.filter(ele => ele.url === x['url']);
                        if (filtered.length === 0) {
                            options.push(obj)
                        }
                    }

                }else{
                    filtered = options.filter(ele => ele.url === x['url']);
                    if (filtered.length === 0) {
                        options.push(obj)
                    }
                }


            }
        })
        if (options.length === 1) {
            SetUrlValueFinal(options[0])
            if (props.type === 'search') {
                SetUrlValueSearch(options[0])
            } else if (props.type === 'concept') {
                SetUrlValue(options[0])

            } else if (props.type === 'relationship') {
                SetUrlValueRel(options[0])

            }

        }

        else if(NewConcept === false){
            if(!(UrlValueFinal && options.map(x=>x.url).indexOf(UrlValueFinal.url) !== -1)){
                SetUrlValueFinal(null)
                SetUrlValueSearch(null)
                SetUrlValueRel(null)
                SetUrlValue(null)
            }


        }
        SetUrlOptions(options)
    }

    function updateoptions(type) {
        if(!NewConcept){
            let filtered = []
            let filtered_area = []
            let filtered_name = []
            let filtered_urls = []
            ConceptsList.map(x => {
                filtered.push(x)
            })

            if (AreaValueFinal !== null && type !== 'area') {
                ConceptsList.map((x, i) => {
                    if (x.area !== AreaValueFinal.area) {
                        filtered.splice(i, 1)
                    }
                })

            }
            if (UrlValueFinal !== null && type !== 'url') {
                ConceptsList.map(x => {
                    if (x.url !== UrlValueFinal.url) {
                        // let fil = filtered.filter(c=>c['url'] === x.url)[0]
                        let index = -1
                        filtered.map((j, i) => {
                            if (j['url'] === x.url) {
                                index = i
                            }

                        })
                        // let index = filtered.indexOf(fil)
                        filtered.splice(index, 1)
                    }
                })
            }
            if (ConceptValueFinal !== null && type !== 'name') {
                ConceptsList.map(x => {
                    if (x.name !== ConceptValueFinal.name) {
                        let index = []
                        filtered.map((j, i) => {
                            if (j['name'] === x.name) {
                                index.push(i)
                            }

                        })
                        index.map(c => filtered.splice(c, 1))
                        // let fil = filtered.filter(c=>c['name'] === x.name)[0]
                        // let index = filtered.indexOf(fil)
                        // filtered.splice(index,1)
                    }
                })
            }

            let areas = []
            let names = []
            let urls = []
            filtered.map(x => {
                // if(areas.indexOf(x['area'])){
                let json = {}
                json['area'] = x['area']
                let fil = areas.map(c => c['area'] === x['area'])
                if (fil.length === 0) {
                    areas.push(json)

                }
                // }
                // if(names.indexOf(x['name'])){
                json = {}
                json['name'] = x['name']
                fil = names.map(c => c['name'] === x['name'])
                if (fil.length === 0) {
                    names.push(json)

                }
                // }
                // if(urls.indexOf(x['url'])){
                json = {}
                json['url'] = x['url']
                fil = urls.map(c => c['url'] === x['url'])
                if (fil.length === 0) {
                    urls.push(json)

                }
                // }

            })

            if (type !== 'area') {
                SetAreaOptions(areas)

            }
            if (type !== 'name') {
                SetNameOptions(names)

            }
            if (type !== 'url') {
                if (urls.length === 1) {
                    SetUrlValueFinal(urls[0])

                    if (props.type === 'concept') {
                        SetUrlValue(urls[0])
                    } else if (props.type === 'relationship') {
                        SetUrlValueRel(urls[0])
                    } else if (props.type === 'search') {
                        SetUrlValueSearch(urls[0])
                    }

                } else {
                    SetUrlValueFinal(null)
                    SetUrlValueSearch(null)
                    SetUrlValueRel(null)
                    SetUrlValue(null)
                }
                SetUrlOptions(urls)

            }
        }



    }

    // useEffect(()=>{
    //
    //     resetOptions()
    //
    // },[ConceptsList])


    function updateConceptsListsConcepts(newValue) {
        let options_area = []
        // SetValue(AreaValue)
        ConceptsList.map(x => {
            let obj = {}
            // obj['url'] = x['url']
            if (x.name.trim() === newValue.name.trim()) {

                // if (x.name.toLowerCase().trim() === newValue.name.toLowerCase().trim()) {
                obj['area'] = x['area']
                let filtered = [];

                if(UrlValueFinal !== undefined && UrlValueFinal !== null){
                    if(x.url === UrlValueFinal.url){
                        filtered = options_area.filter(ele => ele.area === x['area']);
                        if (filtered.length === 0) {
                            options_area.push(obj)
                        }
                    }

                }else{
                    filtered = options_area.filter(ele => ele.area === x['area']);
                    if (filtered.length === 0) {
                        options_area.push(obj)
                    }
                }

                // obj['area'] = x['area']
                // controlla doppioni
                // const filtered = options_area.filter(ele => ele.area === x['area']);

            }


        })
        if (options_area.length === 1) {
            SetAreaValueFinal(options_area[0])

            if (props.type === 'search') {
                SetAreaValueSearch(options_area[0])
            } else if (props.type === 'concept') {
                SetAreaValue(options_area[0])

            } else if (props.type === 'relationship') {
                SetAreaValueRel(options_area[0])

            }

        }
        // else if(new_concept === false){
        //     // SetAreaValueFinal(null)
        // }
        SetAreaOptions(options_area)


        let options = []
        ConceptsList.map(x => {
            let obj = {}
            obj['url'] = x['url']
            // obj['name'] = x['name']
            // obj['area'] = x['area']
            if(AreaValueFinal !== null && AreaValueFinal !== undefined){
                if (x.name.trim() === newValue.name.trim() && x.area.trim() === AreaValueFinal.area) {
                    let filtered = options.filter(ele => ele.url === x['url']);

                    if (filtered.length === 0) {
                        options.push(obj)
                    }
                }
            }
            else{
                if (x.name.trim() === newValue.name.trim()) {
                    let filtered = options.filter(ele => ele.url === x['url']);

                    if (filtered.length === 0) {
                        options.push(obj)
                    }
                }
            }

        })
        if (options.length === 1) {
            SetUrlValueFinal(options[0])

            if (props.type === 'search') {
                SetUrlValueSearch(options[0])
            } else if (props.type === 'concept') {
                SetUrlValue(options[0])

            } else if (props.type === 'relationship') {
                SetUrlValueRel(options[0])

            }
        }
        else if(NewConcept === false){
            if(!(UrlValueFinal && options.map(x=>x.url).indexOf(UrlValueFinal.url) !== -1)) {

                SetUrlValueFinal(null)
                SetUrlValueSearch(null)
                SetUrlValueRel(null)
                SetUrlValue(null)
            }

        }
        SetUrlOptions(options)
    }

    function updateConceptsListsUrls(newValue) {
        let options_area = []
        // SetValue(AreaValue)
        ConceptsList.map(x => {
            let obj = {}
            // obj['url'] = x['url']
            if (x.url === newValue.url) {
                obj['area'] = x['area']
                // obj['area'] = x['area']

                let filtered = [];

                if(ConceptValueFinal !== undefined && ConceptValueFinal !== null){
                    if(x.name === ConceptValueFinal.name){
                        filtered = options_area.filter(ele => ele.area === x['area']);
                        if (filtered.length === 0) {
                            options_area.push(obj)
                        }
                    }

                }else{
                    filtered = options_area.filter(ele => ele.area === x['area']);
                    if (filtered.length === 0) {
                        options_area.push(obj)
                    }
                }
                // const filtered = options_area.filter(ele => ele.area === x['area']);

            }


        })
        if (options_area.length === 1) {
            SetAreaValueFinal(options_area[0])

            if (props.type === 'search') {
                SetAreaValueSearch(options_area[0])
            } else if (props.type === 'concept') {
                SetAreaValue(options_area[0])

            } else if (props.type === 'relationship') {
                SetAreaValueRel(options_area[0])

            }

        } else if(NewConcept === false){
            // SetAreaValueFinal(null)
            // SetAreaValueSearch(null)
            // SetAreaValueRel(null)
            // SetAreaValue(null)
        }
        SetAreaOptions(options_area)


        let options = []
        ConceptsList.map(x => {
            let obj = {}
            obj['name'] = x['name']
            // obj['name'] = x['name']
            // obj['area'] = x['area']
            if (x.url === newValue.url) {
                let filtered = [];

                if(ConceptValueFinal !== undefined && ConceptValueFinal !== null){
                    if(x.name === ConceptValueFinal.name){
                        filtered = options_area.filter(ele => ele.area === x['area'] );
                        if (filtered.length === 0) {
                            options.push(obj)
                        }
                    }

                }else{
                    filtered = options_area.filter(ele => ele.area === x['area']);
                    if (filtered.length === 0) {
                        options.push(obj)
                    }
                }
                // const filtered = options.filter(ele => ele.name === x['name']);

            }
        })
        if (options.length === 1) {
            SetConceptValueFinal(options[0])
            if (props.type === 'search') {
                SetConceptValueSearch(options[0])
            } else if (props.type === 'concept') {
                SetConceptValue(options[0])

            } else if (props.type === 'relationship') {
                SetConceptValueRel(options[0])

            }

        } else if(NewConcept === false){
            SetConceptValueFinal(null)
            SetConceptValue(null)
            SetConceptValueSearch(null)
            SetConceptValueRel(null)
        }
        SetNameOptions(options)
    }

    useEffect(() => {
        if (ConceptsList) {
            resetOptions()

        }
    }, [ConceptsList])

    return (
        <div>
            <Autocomplete
                value={AreaValueFinal}
                sx={{width: '100%'}}
                size={props.no_add_new_concept === true ? "small" : "medium"}
                onChange={(event, newValue) => {

                    if (newValue && newValue.inputValue) {
                        SetAddArea(true)
                        SetNewConcept(true)
                        SetAreaValueFinal({
                            area: newValue.inputValue,
                        })

                        // Create a new value from the user input

                        if (props.type === 'search') {
                            SetAreaValueSearch({
                                area: newValue.inputValue,
                            });
                        } else if (props.type === 'concept') {
                            SetAreaValue({
                                area: newValue.inputValue,
                            });

                        } else if (props.type === 'relationship') {
                            SetAreaValueRel({
                                area: newValue.inputValue,
                            });


                        }
                        updateConceptsListsArea({area: newValue.inputValue})

                        // SetAreaValue({
                        //     area: newValue.inputValue,
                        // });
                    } else if (newValue !== null) {
                        SetAddArea(true)
                        SetAreaValueFinal(newValue)

                        if (props.type === 'search') {
                            SetAreaValueSearch(newValue);


                        } else if (props.type === 'concept') {
                            SetAreaValue(newValue);


                        } else if (props.type === 'relationship') {
                            SetAreaValueRel(newValue);


                        }
                        // SetAreaValue(newValue);
                        if(newValue.area !== undefined){
                            updateConceptsListsArea(newValue)

                        }
                        // else{
                        //     updateConceptsListsArea({area:newValue})
                        //
                        // }
                    } else if (newValue === null) {

                        SetAddConcept(true)
                        SetConceptValueFinal(newValue)
                        SetAreaValueFinal(newValue)
                        SetUrlValueFinal(newValue)

                        // SetAreaValue(newValue)
                        if (props.type === 'search') {
                            SetAreaValueSearch(newValue);
                            SetUrlValueSearch(newValue)
                            SetConceptValueSearch(newValue)

                        } else if (props.type === 'concept') {
                            SetAreaValue(newValue);
                            SetConceptValue(newValue)
                            SetUrlValue(newValue)


                        } else if (props.type === 'relationship') {
                            SetAreaValueRel(newValue);
                            SetConceptValueRel(newValue)
                            SetUrlValueRel(newValue)

                        }

                        resetOptions()


                    }


                }}

                filterOptions={(options, params) => {
                    // const filtered = filter(options, params);
                    // console.log('add',props.to_add,Options)
                    let filtered = []
                    const {inputValue} = params;

                    AreaOptions.map((opt) => {
                        // console.log('add',opt,AreaValue)

                        if (AreaValueFinal === null || (opt.area === AreaValueFinal.area)) {

                            if (ConceptValueFinal !== null && ConceptValueFinal) {
                                // filtered.push(opt)
                                // console.log('')
                                // if(props.to_add === 'Area' || (props.to_add !== 'Area'  && opt.name === ConceptValue.name)){
                                    filtered.push(opt)
                                // }
                            } else {
                                filtered.push(opt)
                            }
                        } else {
                            filtered.push(opt)
                        }

                    })
                    // console.log('filtered', filtered)

                    if (inputValue !== '') {
                        const {inputValue} = params;
                        // Suggest the creation of a new value

                        // const isExisting = areas_list.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim())
                        const isExisting = areas_list.some((option) => inputValue.trim() === option.trim())
                        // filtered = filtered.filter(x => x.area.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))
                        filtered = filtered.filter(x => x.area.trim().includes(inputValue.trim()))

                        if (inputValue !== '' && !isExisting && !props.no_add_new_concept) {
                            filtered.push({
                                inputValue,
                                area: `Add "${inputValue}"`,
                            });
                        }


                    }
                    // console.log('filtered', filtered)
                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={AreaOptions}

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

                renderOption={(props1, option, {inputValue}) => {

                    let parts = []

                    const matches_area = match(option.area, inputValue, {insideWords: true});
                    let parts_area = parse(option.area, matches_area);
                    parts = parts_area

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

                // freeSolo
                renderInput={(params) => (
                    <TextField {...params} label={"Concept type"}/>
                )}
            />
            <br/>
            <Autocomplete
                value={ConceptValueFinal}
                sx={{width: '100%'}}
                size={props.no_add_new_concept === true ? "small" : "medium"}
                onChange={(event, newValue) => {


                    if (newValue && newValue.inputValue) {
                        SetAddConcept(true)
                        SetNewConcept(true)
                        SetConceptValueFinal({name: newValue.inputValue,})

                        // Create a new value from the user input
                        // SetConceptValue({name: newValue.inputValue,});
                        if (props.type === 'search') {
                            SetConceptValueSearch({name: newValue.inputValue,})

                        } else if (props.type === 'concept') {
                            SetConceptValue({name: newValue.inputValue,})


                        } else if (props.type === 'relationship') {
                            SetConceptValueRel({name: newValue.inputValue,})

                        }
                        updateConceptsListsConcepts({name: newValue.inputValue})

                    } else if (newValue !== null) {
                        SetAddConcept(true)
                        SetConceptValueFinal(newValue)

                        // SetConceptValue(newValue);
                        if (props.type === 'search') {
                            SetConceptValueSearch(newValue)

                        } else if (props.type === 'concept') {
                            SetConceptValue(newValue)


                        } else if (props.type === 'relationship') {
                            SetConceptValueRel(newValue)

                        }
                        if(newValue.name !== undefined){
                            updateConceptsListsConcepts(newValue)

                        }


                    } else if (newValue === null) {
                        SetAddConcept(true)
                        SetUrlValueFinal(newValue)
                        SetConceptValueFinal(newValue)

                        if (props.type === 'search') {
                            SetUrlValueSearch(newValue)
                            SetConceptValueSearch(newValue)

                        } else if (props.type === 'concept') {
                            SetConceptValue(newValue)
                            SetUrlValue(newValue)


                        } else if (props.type === 'relationship') {
                            SetConceptValueRel(newValue)
                            SetUrlValueRel(newValue)

                        }
                        // SetConceptValue(newValue);
                        // SetUrlValue(newValue)
                        // in questo caso un concetto è associato a più di un url, se il nome è null annullo concept
                        // if(UrlValue !== null && NameOptions.length === 1){
                        //     // SetUrlValue(newValue)
                        if (AreaValueFinal !== null && AreaOptions.length === 1) {
                            // SetAreaValue(null)
                            SetAreaValueFinal(newValue)

                            if (props.type === 'search') {
                                SetAreaValueSearch(newValue);


                            } else if (props.type === 'concept') {
                                SetAreaValue(newValue);


                            } else if (props.type === 'relationship') {
                                SetAreaValueRel(newValue);


                            }
                            resetOptions()
                        } else {
                            updateoptions('name')

                        }
                        // }


                    }


                }}

                filterOptions={(options, params) => {
                    // const filtered = filter(options, params);
                    // console.log('add',props.to_add,Options)
                    let filtered = NameOptions
                    const {inputValue} = params;

                    // console.log('filtered', filtered)

                    if (inputValue !== '') {
                        const {inputValue} = params;
                        // Suggest the creation of a new value

                        const isExisting = names.some((option) => inputValue.trim() === option.trim())
                        filtered = filtered.filter(x => x.name.trim().includes(inputValue.trim()))
                        //
                        // const isExisting = names.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim())
                        // filtered = filtered.filter(x => x.name.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))
                        if (inputValue !== '' && !isExisting && !props.no_add_new_concept) {
                            filtered.push({
                                inputValue,
                                name: `Add "${inputValue}"`,
                            });
                        }


                    }
                    // console.log('filtered', filtered)
                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={NameOptions}

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
                    return option.name;


                }}

                renderOption={(props1, option, {inputValue}) => {

                    let parts = []


                    const matches_concept = match(option.name, inputValue, {insideWords: true});
                    const parts_concept = parse(option.name, matches_concept);
                    parts = parts_concept

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

                // freeSolo
                renderInput={(params) => (
                    <TextField {...params} label={"Concept Name"}/>
                )}
            />
            <br/>
            <div style={{marginBottom: '10px'}}><span className={'urlnotmand'}
                                                      onClick={() => SetShowUrlComplete(prev => !prev)}>Select the URL</span>
            </div>
            {((UrlOptions.length > 1 && ConceptValueFinal !== null) || ShowUrlComplete || NewConcept) && <Autocomplete
                value={UrlValueFinal}
                sx={{width: '100%'}}
                size={props.no_add_new_concept === true ? "small" : "medium"}
                onChange={(event, newValue) => {


                    if (newValue && newValue.inputValue) {
                        SetAddConcept(true)
                        SetUrlValueFinal({url: newValue.inputValue,})

                        // Create a new value from the user input
                        // SetUrlValue({url: newValue.inputValue,});
                        if (props.type === 'search') {
                            SetUrlValueSearch({url: newValue.inputValue,})

                        } else if (props.type === 'concept') {

                            SetUrlValue({url: newValue.inputValue,})


                        } else if (props.type === 'relationship') {

                            SetUrlValueRel({url: newValue.inputValue,})

                        }
                        updateConceptsListsUrls({url: newValue.inputValue})
                    } else if (newValue !== null) {
                        SetAddConcept(true)
                        // SetUrlValue(newValue);
                        SetUrlValueFinal(newValue)
                        if (props.type === 'search') {
                            SetUrlValueSearch(newValue)

                        } else if (props.type === 'concept') {

                            SetUrlValue(newValue)


                        } else if (props.type === 'relationship') {

                            SetUrlValueRel(newValue)

                        }
                        updateConceptsListsUrls(newValue)

                    } else if (newValue === null) {
                        SetAddConcept(true)
                        // SetUrlValue(newValue);
                        SetUrlValueFinal(newValue)

                        if (props.type === 'search') {
                            SetUrlValueSearch(newValue)

                        } else if (props.type === 'concept') {

                            SetUrlValue(newValue)


                        } else if (props.type === 'relationship') {

                            SetUrlValueRel(newValue)

                        }
                        // in questo caso un concetto è associato a più di un url, se l'url è null non annullo il concetto
                        if (ConceptValueFinal !== null && NameOptions.length === 1 && UrlOptions.length > 1) {
                            console.log('')
                        } else {
                            // SetConceptValue(newValue)
                            SetConceptValueFinal(newValue)

                            if (props.type === 'search') {
                                SetConceptValueSearch(newValue)

                            } else if (props.type === 'concept') {
                                SetConceptValue(newValue)


                            } else if (props.type === 'relationship') {
                                SetConceptValueRel(newValue)

                            }

                            if (AreaValueFinal !== null && AreaOptions.length === 1) {
                                SetAreaValueFinal(newValue)

                                // SetAreaValue(null)
                                if (props.type === 'search') {
                                    SetAreaValueSearch(newValue);


                                } else if (props.type === 'concept') {
                                    SetAreaValue(newValue);


                                } else if (props.type === 'relationship') {
                                    SetAreaValueRel(newValue);


                                }
                                resetOptions()
                            } else {
                                updateoptions('url')
                            }
                        }


                    }


                }}

                filterOptions={(options, params) => {
                    // const filtered = filter(options, params);
                    // console.log('add', props.to_add, Options)
                    let filtered = UrlOptions
                    const {inputValue} = params;


                    console.log('filtered', filtered)

                    if (inputValue !== '') {
                        const {inputValue} = params;
                        // Suggest the creation of a new value

                        const isExisting = urls.some((option) => inputValue.trim() === option.trim())
                        filtered = filtered.filter(x => x.url.trim().includes(inputValue.trim()))
                        // const isExisting = urls.some((option) => inputValue.toLowerCase().trim() === option.toLowerCase().trim())
                        // filtered = filtered.filter(x => x.url.toLowerCase().trim().includes(inputValue.toLowerCase().trim()))
                        if (inputValue !== '' && !isExisting && !props.no_add_new_concept) {
                            filtered.push({
                                inputValue,
                                url: `Add "${inputValue}"`,
                            });
                        }


                    }
                    // console.log('filtered', filtered)
                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={UrlOptions}

                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }

                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.url;

                }}

                renderOption={(props1, option, {inputValue}) => {

                    let parts = []


                    const matches_url = match(option.url, inputValue, {insideWords: true});
                    const parts_url = parse(option.url, matches_url);
                    parts = parts_url


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

                // freeSolo
                renderInput={(params) => (
                    <TextField {...params} label={"Concept Url or Concept ID"}/>
                )}
            />}
        </div>


    )
}



