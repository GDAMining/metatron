import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Collapse from '@mui/material/Collapse';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../rightsidestyles.css'
import LabelsSelect from '../labels/LabelsSelect'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import UploadIcon from '@mui/icons-material/Upload';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ArticleIcon from '@mui/icons-material/Article';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {AppContext} from "../../../App";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";
import RightSideMention from "./RightSideMention";
import {RemovehighlightMention} from "../../HelperFunctions/HelperFunctions";

export default function MentionsListClass(props){
    const { collection,inarel,document_id,labels,mentions,mentiontohighlight,showmentionsspannel } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [MentionsList, SetMentionsList] = mentions
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState(false)
    const [ShowSelect,SetShowSelect] = useState(false)
    const [InARel,SetInARel] = inarel

    const [OpenMentions, SetOpenMentions] = useState(false)
    const [CollectionDescription,SetCollectionDescription] = useState(false)
    const sorted_mentions = MentionsList.sort(function(a, b) { return a.start - b.start; })
    const sorted_mentions_10 = sorted_mentions.slice(0,5)
    const sorted_mentions_last = sorted_mentions.slice(5,sorted_mentions.length)
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [ShowMentions,SetShowMentions] = showmentionsspannel





    return(
        <div id='rightsidementionsclass'>
            <h5>
                Mentions (<i>{MentionsList.length}</i>)
            </h5>
            {/*{MentionsList && <div><i><b>{MentionsList.length}</b> mentions</i></div>}*/}
            <div>
                {MentionsList ? <>

                {sorted_mentions_10.map((mention,index)=>
                        <div id={mention.mentions}>

                            <RightSideMention testo={mention.mention_text} mention={mention} index={index} />

                        </div>


                        )}

                 {OpenMentions && <>{sorted_mentions_last.map((mention,index)=>
                    <div id={mention.mentions}>

                        <RightSideMention testo={mention.mention_text} mention={mention} index={index+5} />

                    </div>


                )}</>}
                {MentionsList.length > 5 && <a role="button"  className='view_more' onClick={()=>SetOpenMentions(prev=>!prev)}>{OpenMentions ? <>View less</> : <>View more</>}</a>}
                </>
                    : <CircularProgress />}
            </div>


        </div>
    );
}