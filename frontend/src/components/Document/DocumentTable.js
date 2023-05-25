import {useParams} from "react-router-dom";
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link';
import Badge from 'react-bootstrap/Badge'
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import Paper from '@material-ui/core/Paper';
import { SelectionState } from '@devexpress/dx-react-grid';

import './table.css'
// import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';

import {
    SearchState,
    FilteringState,
    IntegratedFiltering,
    PagingState,
    IntegratedPaging,
    SortingState,
    IntegratedSorting,
    IntegratedSelection,
    DataTypeProvider,


} from '@devexpress/dx-react-grid';
import Select from '@material-ui/core/Select';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import Collapse from "@material-ui/core/Collapse";
import SearchIcon from '@material-ui/icons/Search';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { RowDetailState } from '@devexpress/dx-react-grid';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Plugin, Template, TemplateConnector } from "@devexpress/dx-react-core";
import Button from "@mui/material/Button";
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import InfoIcon from '@material-ui/icons/Info';
import {
    Grid,
    Table,
    SearchPanel,
    TableHeaderRow,
    TableRowDetail,
    TableFilterRow,
    VirtualTable,
    DragDropProvider,
    TableColumnReordering,
    Toolbar,
    PagingPanel,
    TableEditColumn,
    ColumnChooser,
    TableSelection,
    TableColumnVisibility,
    TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import PeopleIcon from '@material-ui/icons/People';
// import Button from "@material-ui/core/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faProjectDiagram, faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {GridToolbarContainer} from "@material-ui/data-grid";
import Spinner from "react-bootstrap/Spinner";
import {AppContext} from "../../App";
import Modal from "react-bootstrap/Modal";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "react-bootstrap/Tooltip";

import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import './Table Modals/modal.css'
// import {Col} from "react-bootstrap";
import {CircularProgress} from "@mui/material";
import InfoModal from "./Table Modals/InfoModal";
import ContentModal from "./Table Modals/DocumentContentModal";
import DeleteDocumentModal from "./Table Modals/DeleteDocumentModal";
import DownloadModal from "./Table Modals/DownloadModal";
import {TableContext} from "./DocumentsPage";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons/faInfoCircle";


export default function DocumentTable(props) {
    const {username, users, collectiondocuments} = useContext(AppContext);
    const {openinfomodal,curid,opencontentmodal,idtodel,content,confirmdelete,idtodownload,opendeletemodal,curannotation,opendownloadmodal } = useContext(TableContext);

    const [OpenInfoModal,SetOpenInfoModal] = openinfomodal
    const [deleteCols] = useState(['']);
    const [defaultColumnWidths, setdefaultColumnWidths] = useState([]);

    const [OpenDeleteModal,SetOpenDeleteModal] = opendeletemodal

    const [tableColumnVisibilityColumnExtensions] = useState([
        { columnName: 'document_id', togglingEnabled: false },{ columnName: '', showInColumnChooser: false },{ columnName: 'document_id_hashed', hidden: true },
    ]);
    const [IdToDel,SetIdToDel] = idtodel
    const [OpenContentModal,SetOpenContentModal] = opencontentmodal
    const [Content,SetContent] = content
    const [CurID,SetCurID] = curid
    const [CurAnnotation, SetCurAnnotation] = curannotation
    // const [defaultNotChooseColumnNames] = useState([
    //     { columnName: '', showInColumnChooser: false },
    // ])
    const [OpenDownloadModal,SetOpenDownloadModal] = opendownloadmodal
    const [IdToDownload,SetIdToDownload] = idtodownload

    const [FilterExt] = useState([{columnName:'', filteringEnabled:false,SortingEnabled:false}])
    const [ResizeExt] = useState([{columnName:'', minWidth:400,maxWidth:400}])
    const [sortingStateColumnExtensions] = useState([
        { columnName: '', sortingEnabled: false },
    ]);
    const [ConfirmDelete,SetConfirmDelete] = confirmdelete
    const [pageSizes] = useState([5, 10, 25, 50, 0]);
    const [updateData,SetUpdateData] = useState(false)
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments

    useEffect(()=>{
        if(ConfirmDelete && IdToDel){
                axios.post('delete_single_document',{document:IdToDel})
                    .then(r=>{
                        let new_set = []
                        props.righe.map(x=>{
                            if(x.document_id_hashed !== IdToDel){
                                new_set.push(x)
                            }
                        })
                        props.setrighe(new_set)
                        SetIdToDel(false)
                        SetConfirmDelete(false)
                        SetOpenDeleteModal(false)
                        SetUpdateData(true)
                    })

        }
    },[ConfirmDelete,IdToDel])

    useEffect(()=>{
        if(updateData){
            axios.get('collections/documents')
                .then(response=>{
                    SetCollectionDocuments(response.data)
                })
        }
    },[updateData])

    function downloadAnnotations(e,d){
        SetOpenDownloadModal(true)
        SetIdToDownload(d)
    }

    useEffect(()=>{
        if(!OpenInfoModal){
            SetCurAnnotation(false)
            SetCurID(false)
        }
        if(!OpenContentModal){
            SetContent(false)
        }
        if(!OpenDownloadModal){
            SetIdToDownload(false)
        }

    },[OpenInfoModal,OpenContentModal,OpenDownloadModal])
    const DeleteDownloadTypeProvider = props => (
        <DataTypeProvider
            formatterComponent={DeleteDownloadFormatter}
            {...props}
        />
    );
    const AnnotationStatsProvider = props => (
        <DataTypeProvider
            formatterComponent={AnnotationsFormatter}
            {...props}
        />
    );

    function deleteDocument(e,d){
        SetIdToDel(d)
        SetOpenDeleteModal(true)
    }


    function showDocument(e,content){
        SetOpenContentModal(true)
        SetContent(content)
    }

    const DeleteDownloadFormatter = ({row}) =>
        <div>
            <Button className='opt_but' size='sm'  onClick={(e)=>downloadAnnotations(e,row)}><FontAwesomeIcon icon={faDownload} color='#757575'/></Button>
            <Button className='opt_but' size='sm' onClick={(e)=>showDocument(e,row.content)} ><FontAwesomeIcon icon={faEye} color='#757575'/></Button>
            <Button className='opt_but' size='sm' onClick={(e)=>deleteDocument(e,row.document_id_hashed)}><FontAwesomeIcon icon={faTrash} color='#757575'/></Button>

        </div>

    const AnnotationsFormatter = ({ value,row,column }) => (
        <div style={{'text-align':'center'}}>
            {/*{row.annotations}&nbsp;&nbsp;*/}
            {/*{row.annotations >= 0 &&*/}

            {value}
            {value > 0 &&
            <Button color="primary" onClick={()=>{
                console.log(column.name)
                SetCurID(row.document_id_hashed)
                SetCurAnnotation(column.name)
                SetOpenInfoModal(true)
            }
            }
                className='opt_but'><FontAwesomeIcon icon={faInfoCircle} color='#757575'/>
                {/*<InfoIcon color="action"/>*/}
            </Button>
            }
        </div>

    );
    const FilterCell = (props) => {
        const { column } = props;
        if(column.name !== ''){
            return <TableFilterRow.Cell {...props} />;

        }
        else
        {

            return <th className="MuiTableCell-root MuiTableCell-head" style={{borderBottom:'1px solid rgb(224, 224, 224)'}}> </th>
        }

    };
    const ButtonToggle = (props) => {
        const { onToggle,buttonRef } = props;
        return <Button onClick={onToggle} buttonRef={buttonRef}><ViewColumnIcon color="primary"/>&nbsp;&nbsp;columns</Button>

    };
    // const CellTooltipProvider = props => (
    //     <DataTypeProvider
    //         for={ColumnsTooltip.map(({ name }) => name)}
    //         formatterComponent={TooltipFormatter}
    //         {...props}
    //     />
    // );
    //
    // const TooltipFormatter = ({ row: {}, value }) => (
    //     <OverlayTrigger
    //         key='left'
    //         placement='top'
    //         overlay={
    //             <Tooltip id={`tooltip-top'`}>
    //                 {value}
    //             </Tooltip>
    //         }
    //     >
    //         {/*<div style={{'white-space':'normal'}}>{value}</div>*/}
    //         <div style={{overflow:'hidden','text-overflow':'ellipsis'}}>{value}</div>
    //     </OverlayTrigger>
    //
    // );




    return(
        <div>
            {/*{OpenInfoModal && CurID && CurAnnotation && <InfoModal show={OpenInfoModal} setshow={SetOpenInfoModal} curid={CurID} annotation={CurAnnotation}  row={props.righe} />}*/}
            {/*{OpenContentModal && Content && <ContentModal show={OpenContentModal} setshow={SetOpenContentModal} content={Content} />}*/}
            {/*{OpenDeleteModal && IdToDel && <DeleteDocumentModal show={OpenDeleteModal} setshow={SetOpenDeleteModal} doc={IdToDel} setconfirm={SetConfirmDelete}/>}*/}
            {/*{OpenDownloadModal && IdToDownload && <DownloadModal show={OpenDownloadModal} setshow={SetOpenDownloadModal} doc={IdToDownload}/>}*/}
            <Grid
                rows={props.righe}
                columns={props.columns}
            >

                <DeleteDownloadTypeProvider for={deleteCols} />
                <AnnotationStatsProvider for={['mentions_count','concepts_count','relationships_count','labels_count','assertions_count','annotators_list']} />
                {/*<AnnotationStatsProvider for={['mentions_count']} />*/}
                {/*<AnnotationStatsProvider for={['concepts_count']} />*/}
                {/*<AnnotationStatsProvider for={['relationships_count']} />*/}
                {/*<AnnotationStatsProvider for={['labels_count']} />*/}
                {/*<AnnotationStatsProvider for={['assertions_count']} />*/}
                {/*<AnnotationStatsProvider for={['annotators_list']} />*/}
                <SearchState />
                <PagingState
                    defaultCurrentPage={0}
                    defaultPageSize={25}
                />
                {/*<SelectionState*/}
                {/*    selection={selection}*/}
                {/*    onSelectionChange={setSelection}*/}
                {/*/>*/}
                {/*<IntegratedSelection />*/}
                <FilteringState columnExtensions={FilterExt} defaultFilters={[]} />
                <IntegratedFiltering />
                <SortingState defaultSorting={[{ columnName: 'annotations', direction: 'desc' },]}
                              columnExtensions={sortingStateColumnExtensions}
                />
                <IntegratedSorting />
                <IntegratedPaging />
                <Table   />
                <TableColumnResizing defaultColumnWidths={props.default_width}
                                     columnExtensions={ResizeExt} />
                <TableHeaderRow  />

                {/*<TableSelection showSelectAll />*/}
                <TableFilterRow
                    cellComponent={FilterCell}
                />
                <PagingPanel
                    pageSizes={pageSizes}
                />
                <TableColumnVisibility
                    columnExtensions={tableColumnVisibilityColumnExtensions}
                />
                <Toolbar
                />
                <ColumnChooser
                    toggleButtonComponent={ButtonToggle}
                />
            </Grid>
        </div>

    );
}
