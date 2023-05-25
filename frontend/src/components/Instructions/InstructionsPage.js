import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {AppContext} from "../../App";

export default function InstructionsPage(props){
    const [AnnotationInterface,SetAnnotationInterface] = useState(false)
    const [CollectionInterface,SetCollectionInterface] = useState(false)
    const [StatisticsInterface,SetStatisticsInterface] = useState(false)


    useEffect(() => {
        document.title = 'Instructions';
    }, []);

    function scroll(e,elem){
        e.preventDefault()
        document.getElementsByClassName(elem).item(0).scrollIntoView({ behavior: "smooth"})
    }


    return(
        <div style={{padding:"5% 10%"}}>
            <h1 style={{textAlign:"center"}}>Instructions</h1>
            <Row>
                <Col md={3}>
                    <div style={{position:"fixed"}}>
                        <h4 className={'menu'} onClick={(e)=>scroll(e,"annotationint")}>Annotation Interface</h4>
                        <h4 className={'menu'} onClick={(e)=>scroll(e,"collections")}>Collections</h4>
                        <h4 className={'menu'} onClick={(e)=>scroll(e,"stats")}>Statistics</h4>
                    </div>
                </Col>
                <Col md={9}>



            <div>

            <div className={'annotationint'}>
                <h2>Annotation interface</h2>
                The annotation interface allows the annotator to read a document and annotate it. Through the vertical toolbar the annotator can
                perform several actions directly from the interface without interrupting the annotation process. <br/>
                It is possible to change the document to annotate via the two arrows placed above the main text. Alternatively, it is possible to
                move between the documents by pressing simultaneously the <kbd>ctrl</kbd> and the <kbd>&rarr</kbd> keys to switch to the next document,
                or <kbd>ctrl</kbd> + <kbd>&larr</kbd> to move to the previous document. Next to the arrows, it is possible to get the current collection and
                the current document annotated. By clicking on the collection it is possible to be redirected to tbe collection web page. By clicking on the
                document instead, the annotator is redirected to the list of the documents of the collection. A <kbd>DELETE</kbd> button allows the annotator to delete
                all the annotations performed by the annotator to the document, while an <kbd>+ ASSERTION</kbd> button allows the annotator to add a new assertion. Finally,
                the <kbd>ANNOTATION</kbd> button allows the annotator to select one or more annotation types; the list of the annotations performed by the annotator to
                the current document for the selected types will be listed at the right of the textual document to annotate.
                <br/>
                <h4>Create a new annotation</h4>
                Metatron provides the following five annotation types: <b>mentions, linking, relationships</b> annotations are <i>mention-level</i>
                types, hence they are related to a mention (a textual span in the document to annotate); <b>assertions</b> and <b>labels</b> annotations
                instead, are <i>document-level</i> annotation types, hence they are related to the entire textual document, and not to a part of it.<br/>
                To perform Linking, relationship, and assertion annotations, the presence of <b>concepts</b> is required. A concept usually belong to an ontology and it
                is uploaded by an annotator. A concept is characterized by a <i>URI/ID</i>, a <i>name</i>, and a <i>type</i>: an URI is the identifier of the concept, the
                type is a category which characterizes the concept -- e.g., gene, disease; the name of the concept describes the concept together with the ID and allows
                the suers to recognize what the concept represents. <br/>
                Metatron does not require that all the concepts belong to an already defined available on the web ontology.
                <br/>
                <h5>Mentions</h5>
                A annotator can select a new mention in two different ways:
                <ul>
                    <li>if the mention is composed of at least two words (intended as a sequence of characters between two spaces), it is possible
                    to click on the first and on the last word of the mention: this will select all the text comprised between the two selected words;</li>
                    <li>if the mention is composed of a single word, it is possible to double-click on the desired word;</li>
                    <li>To select a sequence of characters independent of the single space separation, hence to select specific substrings, it is possible
                     to drag and drop the mouse from the first character to the last one</li>

                </ul>
                Metatron supports the overlapping mentions. The annotator can rely on the aformentioned methods to select overlapping mentions. <br/>
                Each mention, if correctly saved in the database, will be highlighted with a blue background and blue text.
                <br/>
                <h6>Mention panel</h6>
                Each mention has an associated panel which can be accessed by a right click on the desired mention. This panel allows the annotator to perform
                the following actions:
                <ul>
                    <li>get the information about the mention such as the annotation time and the number of annotators who annotated that mention</li>
                    <li>provide suggestions about the concepts to associate to the mention: this feature provides the annotator with allo the concepts the other annotators
                    associated to that mention. Given a suggested concept, the logged in annotator can add it directly from the mention panel</li>
                    <li>Annotate a new concept</li>
                    <li>Annotate a new relationship</li>
                    <li>Delete the mention. This action will remove all the concepts associated to the mention and relationships that mention is involved into.</li>
                </ul>
                To check all the mentions annotated so far, it is possible to click on the <kbd>Annotations</kbd> button and all the mentions annotated will be
                listed at the right of the document. By clicking on a specific mention of the list, it is possible to highlight the corresponding textual span on the
                document.
                <br/>
                <h5>Concepts Linking</h5>
                    Linking consists in associating a concept to a specific mention. To link a concept to a mention a annotator has to:
                    <ul>
                        <li>open the mention panel an go to <kbd>Add concept</kbd></li>
                        <li> simultanously press <kbd>ctrl</kbd> and click on the desired mention</li>

                    </ul>
                Then, a concept form will be shown: the annotator is asked to select the concept type, and the concept name. The selection is
                facilitated thanks to the autocomplete facilities, in addition to this, by selecting the concept type it is possible to filter
                the possible associated names and vice versa. <br/>
                Once selected the concept, it will appear on the top of the mention. Different concept types can be associated to
                different colors customizable by the annotator. To remove the concept, it is possible to click on the <kbd>X</kbd> button
                near the concept name. By clicking on the concept name the annotator is provided with the concept information such as the URI, the type and the description.
                To check all the mentions and the related linked concepts annotated so far, it is possible to click on the <kbd>Annotations</kbd> on the <kbd>linking</kbd> options and
                all the concepts annotated will be
                listed at the right of the document. By clicking on a specific concept of the list, it is possible to highlight the corresponding textual span on the
                document.

                <br/>
                <h5>Relationship</h5>
                A relationship is composed of a subject, a predicate, an object which define the direction of the relationship -- i.e., the relationship starts from the subject and ends in the object.
                In a relationship, at least one between the subject, the predicate, and the object elements must be a mention (not necessary linked to one or more concepts). Hence, the following types of relationships
                are supported: (i) subject, predicate and object are all mentions (with or without concepts); the subject (or predicate, or object) is an ontology concept not tied to a mention, while the other elements of the relationship are mentions in text; the subject (or predicate, or object)
                is a mention in the text (with or without linked conceopts) and the other relationship components are concepts without associated mentions. Relationship exclusively composed by concepts (without any mention associated) are assertions (see the section below).<br/>

                To annotate a new mention, open the mention panel, and click on <kbd>Add relationship</kbd>. Metatron will enter on <i>relationship mode</i>: in this mode the annotator can select the components of the relationship. Mentions can be selected directly from the textual document, while concepts can be selected from the relationship panel at the right of the document. The selected mention
                will automatically be the subject of the mention. To annotate the predicate mention, just click on another mention in text and it will be automatically marked as predicate. To select the object, just click on the
                third mention of the relationship to automatically assign to it the object role. In order to change the role of the mention -- i.e., change from predicate to object, or to assign a specific role to a mention in the textual document, right click on the mention and select
                the desired role from the drop-down menu. A mention cannot have two or more subjects, predicates, objects, just one mention for each role.<br/>

                The relationship panel allows the annotator to select the concepts composing the relationship and not tied to a specific mention. To delete or modify a relationship, click on the relationship type on the <kbd>Annotation</kbd> button: the annotator will be provided with the list of the
                relationships that can be visualized, modified or deleted.

                <br/>
                <h5>Assertions</h5>
                    An assertion is composed of three concepts independent of the mentions, hence, in this, concepts are associated to the entire document and
                not tied to a single mention. One concept is the subject, one is the predicate, and one is the object. A new assertion can be added by clicking on
                the <kbd>+ Assertion</kbd> button. As for the relationship annotation, if the desired concept is not present in the concepts list of the collection,
                the annotator can add directly from the interface. To list all the assertions of the annotator, the annotator should go the <kbd>Annotations</kbd> button
                and select the corresponding type. For each assertion, the annotator can decide to modify and remove it.
                <br/>
                <h5>Labels</h5>
                    To associate one or more labels to the document, the annotator has to select the concept type <i>labels</i> on the <kbd>Annotation</kbd> buttons:
                    this will automatically show a set of labels selectable on click. Each label will have the white background if it has not been associated to the document yet; it will
                    have a green background if it is already associated to the document instead.<br/>
                    Labels are associated to the collection and are defined at the moment of the creation of the collection

                <br/>
                <h4>Vertical Toolbar</h4>
                On the left of the annotation interface, a vertical toolbar allows the annotator to perform several actions directly from the interface without
                the need to interrupt the annotation process. The actions a annotator can perform are listed below.
                <ul className="fa-ul">
                    <li><span className="fa-li"><i className="fa-solid fa-check-square"></i></span>The annotator can choose a specific document to
                        annotate searching it by its ID, or filtering the list of documents of the collection by selecting the documents which have or
                        have not been annotated by the annotator
                    </li>
                    <li><span className="fa-li"><i className="fa-solid fa-check-square"></i></span>The annotator can change the collection to annotate. For each collection
                    it is provided the percentage of document the annotator annotated so far for that collection. </li>
                    <li><span className="fa-li"><i className="fa-solid fa-spinner fa-pulse"></i></span>The annotator can download the annotations for the current document. In particular
                        the annotator has to select the format -- i.e., JSON, CSV, BioC XML (not available for labels and assertions annotation types), the annotation type, the annotator -- i.e., the annotator to annotate the annotations of, the documents
                        -- i.e., the current document, or the entire collection (in this case only JSON format is available).
                    </li>
                    <li><span className="fa-li"><i className="fa-regular fa-square"></i></span>The annotator can see all the annotators of that document. By clicking on each annotator, the related annotations will be
                    loaded so that the logged in annotator can check the annotations of the other members for the current document. The annotator can intercat with the mates' annotations,
                    in particular, if the annotator agrees with an annotator, he can copy one or more annotations, or the enitre set of annotations for the document. One of the selectable is the one
                    corresponding to the majority vote based annotations: this is not a real annotator, it is the set of annotations selected via majority vote among the document's annotators.</li>
                    <li><span className="fa-li"><i className="fa-regular fa-square"></i></span>All the annotators of the collection can upload a set of annotations for the one or more collection's documents. In this case, the required format is the same
                    that is provided by downloading the annotations in Metatron. The creator of the collection instead, can upload a new set of concepts, a new batch of documents, or upload publications' abstracts
                    directly via PubMed, Semantic Scholar, and OpenAIRE APIs. Annotators' documents ion Metatron can be uploaded in several formats: PDF, txt, json, csv. For each
                    of these formats, only the textual content will be considered and displayed to be annotated. </li>
                    <li><span className="fa-li"><i className="fa-solid fa-spinner fa-pulse"></i></span>The annotator can change the annotation setup in particular he can select the
                        font size, the line height, and a color for each concept type. In addition, the annotator can select which sections of the documents should be hidden or shown for the annotation.
                    </li>
                    <li><span className="fa-li"><i className="fa-solid fa-spinner fa-pulse"></i></span>The annotator can select to visualize only the mentions or the mentions together with the associated concepts.</li>
                    <li><span className="fa-li"><i className="fa-solid fa-spinner fa-pulse"></i></span>The annotator can automatically annotate the current document. <i>GCA - Gene Cancer Associations</i> finds all the
                    relationships in the document where the subject is the gene and the object is a cancer concept. The subject and the object are mentions linked with one or more ontology concept, while the predicate is a concept without any mention associated.
                    <i>GDA -- Gene Disease Association</i> allows the annotator to annotate the assertions whose subject, predicate, and concept highlight an association between a gene and a disease.</li>
                    <li><span className="fa-li"><i className="fa-solid fa-spinner fa-pulse"></i></span>Opens a new Credits page tab</li>
                    <li><span className="fa-li"><i className="fa-solid fa-spinner fa-pulse"></i></span>Opens a new Instructions page tab</li>


                </ul>

                </div>
            </div>
                    <br/>   <hr/>                 <br/>

                    <div className={"collections"}>
            <h2>Collections</h2>
                A collection contains a list of documents to be annotated. A annotator can create multiple collections of documents. In the collection page the annotator
                is provided with all the collections he can annotate. For each collection the annotator can see: (i) the creator, (ii) the date of creation, (iii) the number of documents,
                (iv) the number of batches, (v) the number of documents annotated, (vi) the team members the collection is shared with, (vii) the labels of the collection.<br/>
                For each collection the annotator can download the annotations, delete the collection (only if the annotator is also the creator of the collection), access to the documents page where he can visualize the entire list of documents where it is possible to delete, visualize, download the annotations for each document; in addition,
                for each document it is possible to check all the annotations for each annotation type, and for each annotation it is also provided the number of annotators.<br/>
                        <br/>
            <h5>Create a new collection</h5>
                 A new collection can be created in the collections web page. To create a new collection the annotator must add the following information:
                 <ul>
                     <li>The documents. Documents can be uoloaded in the following formats: CSV, JSON, TXT. Metatron supports the upload of PDFs since it
                     relies on Grobid for the sections parsing. Only the related textual content will be uploaded, the information concerning images and tables is lost
                     except for the captions. The annotator can search new documents in OpenAIRE and Semantic Scholar by providing one or more DOIs, or in PubMed by providing one or more PMIDs. These APIs will
                     automatically save the following information about a publication: title, abstract, authors, venue, date of publications;</li>
                     <li>A list of concepts;</li>
                     <li>The title and the description;</li>
                     <li>The other annotators who can annotate the collection (if any);</li>
                     <li>The labels;</li>
                 </ul>
                New annotators, labels, documents and concepts can be added at any time.<br/>
                When a creator of a collection adds new members, these members are not automatically considered members of the collection: they have to accept an ùinvitation which is
                generated at the moment of collection creation. This allows the annotators to keep track of the collections he is added into.
            </div>
                    <br/>   <hr/>                 <br/>

            <div className={"stats"}>


            <h2>Statistics</h2>
                In the statistics web page the annotator can check the annotations of the collections.<br/>
            <h5>Personal Statistics</h5>
                Personal statistics concern exclusively the logged in annotator. Personal statistics include: the total number of mentions, linked concepts,
                relationships, assertions, labels annotated for the entire collection (or for a specific document), the number of linked concepts subdivided per concept tupe for the
                entire collection (or for a specific document), the number of
                subject, predicate, object concepts subdivided per concept tupe for the entire collection (or for a specific document), the number of labels, mentions, concepts, relationships, assertions annotated for each document,
                and four pie charts which sums up for each concept tupe how many concepts are subject, predicate or objects.
                <br/>
            <h5>Global Statistics</h5>
                Global statistics include the same statistics seen in the personal ones. The only difference in this case is that the entire set of annotators is considered. In this case, it is also provided for each document the number of annotators.
                In addition, together with the number of mentions, linked concepts, relationships, assertions and labels is also provided the fleiss-kappa value which identifies the agreement between the annotators of the collection.
            </div>

            </Col>
        </Row>

        </div>
    );
}