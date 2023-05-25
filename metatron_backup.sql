--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

--This file contains the sql queries to create the types and the tables of metatron_db
-- Database: metatron_db
--DROP DATABASE metatron_db;

CREATE DATABASE metatron_db WITH OWNER = postgres ENCODING = 'UTF8' TABLESPACE = pg_default CONNECTION LIMIT = -1;
	
	
--DROP SCHEMA public CASCADE;
GRANT ALL PRIVILEGES ON DATABASE metatron_db TO postgres;
\connect metatron_db;


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: invitation_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invitation_enum AS ENUM (
    'Accepted',
    'Invited',
    'Creator'
);


ALTER TYPE public.invitation_enum OWNER TO postgres;

--
-- Name: name_space_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.name_space_enum AS ENUM (
    'Human',
    'Robot'
);


ALTER TYPE public.name_space_enum OWNER TO postgres;

--
-- Name: profile_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.profile_enum AS ENUM (
    'Tech',
    'Admin',
    'Expert',
    'Beginner',
    'Student',
    'Professor',
    'Revisor',
    'Default'
);


ALTER TYPE public.profile_enum OWNER TO postgres;

--
-- Name: provenance_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.provenance_enum AS ENUM (
    'pubmed',
    'openaire',
    'semantic scholar',
    'makg',
    'user'
);


ALTER TYPE public.provenance_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: add_concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.add_concept (
    collection_id character varying(64) NOT NULL,
    username character varying(64) NOT NULL,
    name text NOT NULL,
    concept_url text NOT NULL,
    name_space public.name_space_enum NOT NULL,
    insertion_time timestamp with time zone NOT NULL
);


ALTER TABLE public.add_concept OWNER TO postgres;

--
-- Name: annotate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annotate (
    start integer NOT NULL,
    stop integer NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    insertion_time timestamp with time zone
);


ALTER TABLE public.annotate OWNER TO postgres;

--
-- Name: annotate_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annotate_label (
    document_id character varying(64) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    username character varying(64) NOT NULL,
    name text NOT NULL,
    language character varying(64) NOT NULL,
    insertion_time timestamp with time zone NOT NULL
);


ALTER TABLE public.annotate_label OWNER TO postgres;

--
-- Name: associate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.associate (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL,
    concept_url text NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.associate OWNER TO postgres;


--
-- Name: collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collection (
    collection_id character varying(64) NOT NULL,
    name text NOT NULL,
    description text,
    username text NOT NULL,
    name_space text NOT NULL,
    insertion_time timestamp with time zone NOT NULL
);


ALTER TABLE public.collection OWNER TO postgres;

--
-- Name: concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concept (
    concept_url text NOT NULL,
    concept_name text,
    description text
);


ALTER TABLE public.concept OWNER TO postgres;

--
-- Name: create_fact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.create_fact (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    subject_concept_url text NOT NULL,
    object_concept_url text NOT NULL,
    predicate_concept_url text NOT NULL,
    subject_name text NOT NULL,
    object_name text NOT NULL,
    predicate_name text NOT NULL,
    insertion_time timestamp with time zone NOT NULL
);


ALTER TABLE public.create_fact OWNER TO postgres;


--
-- Name: document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document (
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    document_content jsonb NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    collection_id character varying(64) NOT NULL,
    batch integer NOT NULL,
    provenance public.provenance_enum
);


ALTER TABLE public.document OWNER TO postgres;

--
-- Name: ground_truth_log_file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ground_truth_log_file (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    gt_json jsonb NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    revised boolean
);


ALTER TABLE public.ground_truth_log_file OWNER TO postgres;

--
-- Name: has_area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.has_area (
    name text NOT NULL,
    concept_url text NOT NULL
);


ALTER TABLE public.has_area OWNER TO postgres;

--
-- Name: has_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.has_label (
    name text NOT NULL,
    collection_id character varying(64) NOT NULL
);


ALTER TABLE public.has_label OWNER TO postgres;

--
-- Name: label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.label (
    name text NOT NULL
);


ALTER TABLE public.label OWNER TO postgres;

--
-- Name: link; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.link (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    subject_document_id character varying(64) NOT NULL,
    subject_language character varying(64) NOT NULL,
    subject_start integer NOT NULL,
    subject_stop integer NOT NULL,
    predicate_document_id character varying(64) NOT NULL,
    predicate_language character varying(64) NOT NULL,
    predicate_start integer NOT NULL,
    predicate_stop integer NOT NULL,
    object_document_id character varying(64) NOT NULL,
    object_language character varying(64) NOT NULL,
    object_start integer NOT NULL,
    object_stop integer NOT NULL,
    insertion_time timestamp with time zone NOT NULL
);


ALTER TABLE public.link OWNER TO postgres;

--
-- Name: mention; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mention (
    start integer NOT NULL,
    stop integer NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    mention_text text NOT NULL
);


ALTER TABLE public.mention OWNER TO postgres;

--
-- Name: name_space; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.name_space (
    name_space public.name_space_enum NOT NULL
);


ALTER TABLE public.name_space OWNER TO postgres;

--
-- Name: relationship_obj_concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationship_obj_concept (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    subject_document_id character varying(64) NOT NULL,
    subject_language character varying(64) NOT NULL,
    predicate_document_id character varying(64) NOT NULL,
    predicate_language character varying(64) NOT NULL,
    subject_start integer NOT NULL,
    subject_stop integer NOT NULL,
    predicate_start integer NOT NULL,
    predicate_stop integer NOT NULL,
    concept_url text NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.relationship_obj_concept OWNER TO postgres;

--
-- Name: relationship_obj_mention; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationship_obj_mention (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL,
    predicate_concept_url text NOT NULL,
    subject_concept_url text NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    predicate_name text NOT NULL,
    subject_name text NOT NULL
);


ALTER TABLE public.relationship_obj_mention OWNER TO postgres;

--
-- Name: relationship_pred_concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationship_pred_concept (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    subject_document_id character varying(64) NOT NULL,
    subject_language character varying(64) NOT NULL,
    object_document_id character varying(64) NOT NULL,
    object_language character varying(64) NOT NULL,
    subject_start integer NOT NULL,
    subject_stop integer NOT NULL,
    object_start integer NOT NULL,
    object_stop integer NOT NULL,
    concept_url text NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.relationship_pred_concept OWNER TO postgres;

--
-- Name: relationship_pred_mention; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationship_pred_mention (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL,
    object_concept_url text NOT NULL,
    subject_concept_url text NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    object_name text NOT NULL,
    subject_name text NOT NULL
);


ALTER TABLE public.relationship_pred_mention OWNER TO postgres;

--
-- Name: relationship_subj_concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationship_subj_concept (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    object_document_id character varying(64) NOT NULL,
    object_language character varying(64) NOT NULL,
    predicate_document_id character varying(64) NOT NULL,
    predicate_language character varying(64) NOT NULL,
    object_start integer NOT NULL,
    object_stop integer NOT NULL,
    predicate_start integer NOT NULL,
    predicate_stop integer NOT NULL,
    concept_url text NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.relationship_subj_concept OWNER TO postgres;

--
-- Name: relationship_subj_mention; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationship_subj_mention (
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    document_id character varying(64) NOT NULL,
    language character varying(64) NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL,
    predicate_concept_url text NOT NULL,
    object_concept_url text NOT NULL,
    insertion_time timestamp with time zone NOT NULL,
    predicate_name text NOT NULL,
    object_name text NOT NULL
);


ALTER TABLE public.relationship_subj_mention OWNER TO postgres;

--
-- Name: semantic_area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semantic_area (
    name text NOT NULL
);


ALTER TABLE public.semantic_area OWNER TO postgres;

--
-- Name: share_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.share_collection (
    collection_id character varying(64) NOT NULL,
    username character varying(32) NOT NULL,
    name_space public.name_space_enum NOT NULL,
    status public.invitation_enum
);


ALTER TABLE public.share_collection OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    username character varying(32) NOT NULL,
    password character varying(32),
    name_space public.name_space_enum NOT NULL,
    orcid text,
    ncbi_key text,
    profile public.profile_enum NOT NULL,
    email text,
    orcid_token text
);


ALTER TABLE public."user" OWNER TO postgres;


--
-- Data for Name: add_concept; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.add_concept (collection_id, username, name, concept_url, name_space, insertion_time) FROM stdin;
\.


--
-- Data for Name: annotate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annotate (start, stop, document_id, language, username, name_space, insertion_time) FROM stdin;
\.


--
-- Data for Name: annotate_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annotate_label (document_id, name_space, username, name, language, insertion_time) FROM stdin;
\.


--
-- Data for Name: associate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.associate (username, name_space, document_id, language, start, stop, concept_url, insertion_time, name) FROM stdin;
\.





--
-- Data for Name: collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collection (collection_id, name, description, username, name_space, insertion_time) FROM stdin;
8c6b57ac171e8299acc34e4e25a87741	PubMed test Collection	This is an example of collection	demo	Human	2023-05-24 08:12:17.707679+02
\.


--
-- Data for Name: concept; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.concept (concept_url, concept_name, description) FROM stdin;
\.


--
-- Data for Name: create_fact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.create_fact (username, name_space, document_id, language, subject_concept_url, object_concept_url, predicate_concept_url, subject_name, object_name, predicate_name, insertion_time) FROM stdin;
\.




--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document (document_id, language, document_content, insertion_time, collection_id, batch, provenance) FROM stdin;
16e3a4d366df0fdc8f69907ed3b1d555	english	{"year": "2016", "title": "Signalling pathways in UHRF1-dependent regulation of tumor suppressor genes in cancer.", "authors": "Alhosin M, Omran Z, Zamzami MA, Al-Malki AL, Choudhry H, Mousli M, Bronner C", "journal": "J. Exp. Clin. Cancer Res.; 2016 11 14; 35(1) 174", "abstract": "Epigenetic silencing of tumor suppressor genes (TSGs) through DNA methylation and histone changes is a main hallmark of cancer. Ubiquitin-like with PHD and RING Finger domains 1 (UHRF1) is a potent oncogene overexpressed in various solid and haematological tumors and its high expression levels are associated with decreased expression of several TSGs including p16 INK4A , BRCA1, PPARG and KiSS1. Using its several functional domains, UHRF1 creates a strong coordinated dialogue between DNA methylation and histone post-translation modification changes causing the epigenetic silencing of TSGs which allows cancer cells to escape apoptosis. To ensure the silencing of TSGs during cell division, UHRF1 recruits several enzymes including histone deacetylase 1 (HDAC1), DNA methyltransferase 1 (DNMT1) and histone lysine methyltransferases G9a and Suv39H1 to the right place at the right moment. Several in vitro and in vivo works have reported the direct implication of the epigenetic player UHRF1 in tumorigenesis through the repression of TSGs expression and suggested UHRF1 as a promising target for cancer treatment. This review describes the molecular mechanisms underlying UHRF1 regulation in cancer and discusses its importance as a therapeutic target to induce the reactivation of TSGs and subsequent apoptosis.", "provenance": "pubmed", "document_id": "pubmed_27839516"}	2023-05-24 08:12:18.849486+02	8c6b57ac171e8299acc34e4e25a87741	1	pubmed
6da07eff09775e9dcee89ae03f592ef3	english	{"year": "2019", "title": "Metabolic enzymes expressed by cancer cells impact the immune infiltrate.", "authors": "Stoll G, Kremer M, Bloy N, Joseph A, Castedo M, Meurice G, Klein C, Galluzzi L, Michels J, Kroemer G", "journal": "Oncoimmunology. 2019 Mar 30;8(6):e1571389. doi: 10.1080/2162402X.2019.1571389.", "abstract": "The expression of two metabolic enzymes, i.e., aldehyde dehydrogenase 7 family, member A1 (ALDH7A1) and lipase C, hepatic type (LIPC) by malignant cells, has been measured by immunohistochemical methods in non-small cell lung carcinoma (NSCLC) biopsies, and has been attributed negative and positive prognostic value, respectively. Here, we demonstrate that the protein levels of ALDH7A1 and LIPC correlate with the levels of the corresponding mRNAs. Bioinformatic analyses of gene expression data from 4921 cancer patients revealed that the expression of LIPC positively correlates with abundant tumor infiltration by myeloid and lymphoid cells in NSCLC, breast carcinoma, colorectal cancer and melanoma samples. In contrast, high levels of ALDH7A1 were associated with a paucity of immune effectors within the tumor bed. These data reinforce the notion that the metabolism of cancer cells has a major impact on immune and inflammatory processes in the tumor microenvironment, pointing to hitherto unsuspected intersections between oncometabolism and immunometabolism.", "provenance": "pubmed", "document_id": "pubmed_31069148"}	2023-05-24 08:12:19.576319+02	8c6b57ac171e8299acc34e4e25a87741	1	pubmed
dc8223545071a0592c43e6dc17ae6cf3	english	{"year": "2018", "title": "Sprouty2 enhances the tumorigenic potential of glioblastoma cells.", "authors": "Park JW, Wollmann G, Urbiola C, Fogli B, Florio T, Geley S, Klimaschewski L", "journal": "Neuro-oncology; 2018 Feb 23. doi:10.1093/neuonc/noy028", "abstract": "Background: Sprouty2 (SPRY2), a feedback regulator of receptor tyrosine kinase (RTK) signaling, has been shown to be associated with drug resistance and cell proliferation in glioblastoma (GBM), but the underlying mechanisms are still poorly defined. Methods: SPRY2 expression and survival patterns of patients with gliomas were analyzed using publicly available databases. Effects of RNA interference targeting SPRY2 on cellular proliferation in established GBM or patient-derived GBM stemlike cells were examined. Loss- or gain-of-function of SPRY2 to regulate the tumorigenic capacity was assessed in both intracranial and subcutaneous xenografts. Results: SPRY2 was found to be upregulated in GBM, which correlated with reduced survival in GBM patients. SPRY2 knockdown significantly impaired proliferation of GBM cells but not of normal astrocytes. Silencing of SPRY2 increased epidermal growth factor-induced extracellular signal-regulated kinase (ERK) and Akt activation causing premature onset of DNA replication, increased DNA damage, and impaired proliferation, suggesting that SPRY2 suppresses DNA replication stress. Abrogating SPRY2 function strongly inhibited intracranial tumor growth and led to significantly prolonged survival of U87 xenograft-bearing mice. In contrast, SPRY2 overexpression promoted tumor propagation of low-tumorigenic U251 cells. Conclusions: The present study highlights an antitumoral effect of SPRY2 inhibition that is based on excessive activation of ERK signaling and DNA damage response, resulting in reduced cell proliferation and increased cytotoxicity, proposing SPRY2 as a promising pharmacological target in GBM patients.", "provenance": "pubmed", "document_id": "pubmed_29635363"}	2023-05-24 08:12:20.082131+02	8c6b57ac171e8299acc34e4e25a87741	1	pubmed
d5cd80fcf6a237f8229f52c0d5f48204	english	{"year": "2015", "title": "Therapeutic targeting of casein kinase 1delta in breast cancer.", "authors": "Rosenberg LH, Lafitte M, Quereda V, Grant W, Chen W, Bibian M, Noguchi Y, Fallahi M, Yang C, Chang JC, Roush WR, Cleveland JL, Duckett DR", "journal": "Sci Transl Med; 2015 Dec 16; 7(318) 318. doi:10.1126/scitranslmed.aac8773", "abstract": "Identification of specific drivers of human cancer is required to instruct the development of targeted therapeutics. We demonstrate that CSNK1D is amplified and/or overexpressed in human breast tumors and that casein kinase 1delta (CK1delta) is a vulnerability of human breast cancer subtypes overexpressing this kinase. Specifically, selective knockdown of CK1delta, or treatment with a highly selective and potent CK1delta inhibitor, triggers apoptosis of CK1delta-expressing breast tumor cells ex vivo, tumor regression in orthotopic models of triple-negative breast cancer, including patient-derived xenografts, and tumor growth inhibition in human epidermal growth factor receptor 2-positive (HER2(+)) breast cancer models. We also show that Wnt/beta-catenin signaling is a hallmark of human tumors overexpressing CK1delta, that disabling CK1delta blocks nuclear accumulation of beta-catenin and T cell factor transcriptional activity, and that constitutively active beta-catenin overrides the effects of inhibition or silencing of CK1delta. Thus, CK1delta inhibition represents a promising strategy for targeted treatment in human breast cancer with Wnt/beta-catenin involvement. ", "provenance": "pubmed", "document_id": "pubmed_26676609"}	2023-05-24 08:12:20.586637+02	8c6b57ac171e8299acc34e4e25a87741	1	pubmed
d65e7ae81074c5595a6203a152b697e2	english	{"year": "1992", "title": "Expression of histone H3 cell cycle-related gene, vimentin and MYC genes in pediatric brain tumors. A preliminary analysis showing the different malignant cell growth potential.", "authors": "Stenger AM, Garré ML, Andreussi L, Cama A, Callea F, Brisigotti M, Fabbretti G, Di Martino D, Tonini GP", "journal": "Brain Res. Mol. Brain Res.; 1992 Apr; 13(3) 273-5", "abstract": "Eleven pediatric brain tumors were studied for the histone H3, Vimentin and MYC gene expression. H3, an S phase cell cycle-related gene (ccr), was found prevalently expressed in tumors with a high mitotic index (MI). Vimentin gene, which contributes to maintaining the cell structure but is also demonstrated to be an early responder gene to growth stimulation was found variously expressed. The different expression of Vimentin gene in the examined samples suggests the active proliferation of the tumor cells. Analysis of MYC gene expression was found increased only in a mesenchymal chondrosarcoma while in other samples MYC mRNA was undetectable. Medulloblastoma, chondrosarcoma, and choroid plexus carcinoma have high S phase H3 gene expression associated with a high MI. Differently an astrocytoma shows a low MI associated with high H3 gene expression. This first preliminary report of H3, Vimentin and MYC gene expression in brain tumors demonstrates that malignant cells are characterized by a different gene expression and different growth potentials.", "provenance": "pubmed", "document_id": "pubmed_1317500"}	2023-05-24 08:12:21.091486+02	8c6b57ac171e8299acc34e4e25a87741	1	pubmed
\.


--
-- Data for Name: ground_truth_log_file; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ground_truth_log_file (username, name_space, document_id, language, gt_json, insertion_time, revised) FROM stdin;
\.


--
-- Data for Name: has_area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.has_area (name, concept_url) FROM stdin;
\.


--
-- Data for Name: has_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.has_label (name, collection_id) FROM stdin;
gene mutation	8c6b57ac171e8299acc34e4e25a87741
breast cancer	8c6b57ac171e8299acc34e4e25a87741
ovarian cancer	8c6b57ac171e8299acc34e4e25a87741
no cancer	8c6b57ac171e8299acc34e4e25a87741
cancer	8c6b57ac171e8299acc34e4e25a87741
\.


--
-- Data for Name: label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.label (name) FROM stdin;
breast cancer
no cancer
gene mutation
ovarian cancer
cancer
\.


--
-- Data for Name: link; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.link (username, name_space, subject_document_id, subject_language, subject_start, subject_stop, predicate_document_id, predicate_language, predicate_start, predicate_stop, object_document_id, object_language, object_start, object_stop, insertion_time) FROM stdin;
\.


--
-- Data for Name: mention; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mention (start, stop, document_id, language, mention_text) FROM stdin;
\.


--
-- Data for Name: name_space; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.name_space (name_space) FROM stdin;
Human
Robot
\.


--
-- Data for Name: relationship_obj_concept; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationship_obj_concept (username, name_space, subject_document_id, subject_language, predicate_document_id, predicate_language, subject_start, subject_stop, predicate_start, predicate_stop, concept_url, insertion_time, name) FROM stdin;
\.


--
-- Data for Name: relationship_obj_mention; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationship_obj_mention (username, name_space, document_id, language, start, stop, predicate_concept_url, subject_concept_url, insertion_time, predicate_name, subject_name) FROM stdin;
\.


--
-- Data for Name: relationship_pred_concept; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationship_pred_concept (username, name_space, subject_document_id, subject_language, object_document_id, object_language, subject_start, subject_stop, object_start, object_stop, concept_url, insertion_time, name) FROM stdin;
\.


--
-- Data for Name: relationship_pred_mention; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationship_pred_mention (username, name_space, document_id, language, start, stop, object_concept_url, subject_concept_url, insertion_time, object_name, subject_name) FROM stdin;
\.


--
-- Data for Name: relationship_subj_concept; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationship_subj_concept (username, name_space, object_document_id, object_language, predicate_document_id, predicate_language, object_start, object_stop, predicate_start, predicate_stop, concept_url, insertion_time, name) FROM stdin;
\.


--
-- Data for Name: relationship_subj_mention; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationship_subj_mention (username, name_space, document_id, language, start, stop, predicate_concept_url, object_concept_url, insertion_time, predicate_name, object_name) FROM stdin;
\.


--
-- Data for Name: semantic_area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semantic_area (name) FROM stdin;
Disease
Gene
GCA
GDA
Default
\.


--
-- Data for Name: share_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.share_collection (collection_id, username, name_space, status) FROM stdin;
8c6b57ac171e8299acc34e4e25a87741	demo	Human	Creator
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (username, password, name_space, orcid, ncbi_key, profile, email, orcid_token) FROM stdin;
IAA-Inter Annotator Agreement	b8d112988a4b5b72098e0dc3521dd10b	Human	\N	\N	Tech	\N	
demo	fe01ce2a7fbac8fafaed7c982a04e229	Human	\N	\N	Expert	\N	
\.



--
-- Name: add_concept add_concept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.add_concept
    ADD CONSTRAINT add_concept_pkey PRIMARY KEY (collection_id, username, name, concept_url, name_space);


--
-- Name: annotate_label annotate_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotate_label
    ADD CONSTRAINT annotate_label_pkey PRIMARY KEY (document_id, language, username, name_space, name);


--
-- Name: annotate annotate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotate
    ADD CONSTRAINT annotate_pkey PRIMARY KEY (document_id, language, username, name_space, start, stop);


--
-- Name: associate associate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associate
    ADD CONSTRAINT associate_pkey PRIMARY KEY (username, name_space, document_id, language, start, stop, concept_url, name);



--
-- Name: collection collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection
    ADD CONSTRAINT collection_pkey PRIMARY KEY (collection_id);


--
-- Name: concept concept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_pkey PRIMARY KEY (concept_url);


--
-- Name: create_fact createfact_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT createfact_pk PRIMARY KEY (username, name_space, document_id, language, subject_concept_url, object_concept_url, predicate_concept_url, subject_name, object_name, predicate_name);



--
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (document_id, language);


--
-- Name: ground_truth_log_file ground_truth_log_file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ground_truth_log_file
    ADD CONSTRAINT ground_truth_log_file_pkey PRIMARY KEY (username, name_space, document_id, language);


--
-- Name: has_area has_area_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.has_area
    ADD CONSTRAINT has_area_pk PRIMARY KEY (name, concept_url);


--
-- Name: has_label has_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.has_label
    ADD CONSTRAINT has_label_pkey PRIMARY KEY (name, collection_id);


--
-- Name: label label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_pkey PRIMARY KEY (name);


--
-- Name: link link_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link
    ADD CONSTRAINT link_pkey PRIMARY KEY (subject_document_id, predicate_document_id, object_document_id, subject_language, predicate_language, object_language, username, name_space, subject_start, subject_stop, object_start, object_stop, predicate_start, predicate_stop);


--
-- Name: mention mention_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mention
    ADD CONSTRAINT mention_pkey PRIMARY KEY (document_id, language, start, stop);


--
-- Name: name_space name_space_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.name_space
    ADD CONSTRAINT name_space_pkey PRIMARY KEY (name_space);


--
-- Name: relationship_obj_concept rel_obj_concept_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_concept
    ADD CONSTRAINT rel_obj_concept_pk PRIMARY KEY (username, name_space, subject_document_id, subject_language, predicate_document_id, predicate_language, subject_start, subject_stop, predicate_stop, predicate_start, concept_url, name);


--
-- Name: relationship_obj_mention relationship_obj_mention_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_mention
    ADD CONSTRAINT relationship_obj_mention_pk PRIMARY KEY (username, name_space, document_id, language, start, stop, subject_concept_url, predicate_concept_url, predicate_name, subject_name);


--
-- Name: relationship_pred_mention relationship_p_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_mention
    ADD CONSTRAINT relationship_p_pkey PRIMARY KEY (username, name_space, document_id, language, start, stop, object_concept_url, subject_concept_url, object_name, subject_name);


--
-- Name: relationship_pred_concept relationship_pc_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_concept
    ADD CONSTRAINT relationship_pc_pk PRIMARY KEY (username, name_space, subject_document_id, subject_language, object_language, object_document_id, subject_stop, subject_start, object_start, object_stop, concept_url, name);


--
-- Name: relationship_subj_concept relationship_pos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_concept
    ADD CONSTRAINT relationship_pos_pkey PRIMARY KEY (username, name_space, object_document_id, object_language, predicate_document_id, predicate_language, object_start, object_stop, predicate_start, predicate_stop, concept_url, name);


--
-- Name: relationship_subj_mention relationship_s_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_mention
    ADD CONSTRAINT relationship_s_pkey PRIMARY KEY (username, name_space, document_id, language, start, stop, predicate_concept_url, object_concept_url, predicate_name, object_name);


--
-- Name: semantic_area semantic_area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semantic_area
    ADD CONSTRAINT semantic_area_pkey PRIMARY KEY (name);


--
-- Name: share_collection share_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.share_collection
    ADD CONSTRAINT share_collection_pkey PRIMARY KEY (collection_id, username, name_space);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (username, name_space);



--
-- Name: add_concept area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.add_concept
    ADD CONSTRAINT area_fkey FOREIGN KEY (name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--



--
-- Name: document collection_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT collection_fkey FOREIGN KEY (collection_id) REFERENCES public.collection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: has_label collection_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.has_label
    ADD CONSTRAINT collection_fkey FOREIGN KEY (collection_id) REFERENCES public.collection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: add_concept collection_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.add_concept
    ADD CONSTRAINT collection_fkey FOREIGN KEY (collection_id) REFERENCES public.collection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: share_collection collection_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.share_collection
    ADD CONSTRAINT collection_fkey FOREIGN KEY (collection_id) REFERENCES public.collection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: has_area concept_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.has_area
    ADD CONSTRAINT concept_fk FOREIGN KEY (concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: add_concept concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.add_concept
    ADD CONSTRAINT concept_fkey FOREIGN KEY (concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: associate concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associate
    ADD CONSTRAINT concept_fkey FOREIGN KEY (concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_concept concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_concept
    ADD CONSTRAINT concept_fkey FOREIGN KEY (concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_concept concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_concept
    ADD CONSTRAINT concept_fkey FOREIGN KEY (concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_concept concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_concept
    ADD CONSTRAINT concept_fkey FOREIGN KEY (concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;




--
-- Name: create_fact document_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT document_fk FOREIGN KEY (language, document_id) REFERENCES public.document(language, document_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mention document_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mention
    ADD CONSTRAINT document_fkey FOREIGN KEY (language, document_id) REFERENCES public.document(language, document_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ground_truth_log_file document_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ground_truth_log_file
    ADD CONSTRAINT document_fkey FOREIGN KEY (language, document_id) REFERENCES public.document(language, document_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: annotate_label document_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotate_label
    ADD CONSTRAINT document_fkey FOREIGN KEY (document_id, language) REFERENCES public.document(document_id, language) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: has_label label_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.has_label
    ADD CONSTRAINT label_fkey FOREIGN KEY (name) REFERENCES public.label(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: annotate_label label_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotate_label
    ADD CONSTRAINT label_fkey FOREIGN KEY (name) REFERENCES public.label(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: annotate mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotate
    ADD CONSTRAINT mention_fkey FOREIGN KEY (language, stop, document_id, start) REFERENCES public.mention(language, stop, document_id, start) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: associate mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associate
    ADD CONSTRAINT mention_fkey FOREIGN KEY (document_id, start, language, stop) REFERENCES public.mention(document_id, start, language, stop) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_mention mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_mention
    ADD CONSTRAINT mention_fkey FOREIGN KEY (document_id, start, language, stop) REFERENCES public.mention(document_id, start, language, stop) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_concept name; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_concept
    ADD CONSTRAINT name FOREIGN KEY (name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: has_area name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.has_area
    ADD CONSTRAINT name_fk FOREIGN KEY (name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_concept name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_concept
    ADD CONSTRAINT name_fk FOREIGN KEY (name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_concept name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_concept
    ADD CONSTRAINT name_fk FOREIGN KEY (name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: associate name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associate
    ADD CONSTRAINT name_fkey FOREIGN KEY (name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user name_space_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT name_space_fkey FOREIGN KEY (name_space) REFERENCES public.name_space(name_space) ON UPDATE CASCADE;


--
-- Name: create_fact obj_concept_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT obj_concept_fk FOREIGN KEY (object_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: create_fact obj_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT obj_name_fk FOREIGN KEY (object_name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_mention obj_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_mention
    ADD CONSTRAINT obj_name_fk FOREIGN KEY (object_name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_mention obj_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_mention
    ADD CONSTRAINT obj_name_fkey FOREIGN KEY (object_name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_mention object_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_mention
    ADD CONSTRAINT object_concept_fkey FOREIGN KEY (object_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_mention object_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_mention
    ADD CONSTRAINT object_concept_fkey FOREIGN KEY (object_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_mention object_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_mention
    ADD CONSTRAINT object_concept_fkey FOREIGN KEY (subject_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: link object_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link
    ADD CONSTRAINT object_mention_fkey FOREIGN KEY (object_language, object_document_id, object_start, object_stop) REFERENCES public.mention(language, document_id, start, stop) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_concept object_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_concept
    ADD CONSTRAINT object_mention_fkey FOREIGN KEY (object_language, object_start, object_document_id, object_stop) REFERENCES public.mention(language, start, document_id, stop) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_concept object_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_concept
    ADD CONSTRAINT object_mention_fkey FOREIGN KEY (object_language, object_document_id, object_start, object_stop) REFERENCES public.mention(language, document_id, start, stop) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: create_fact pred_concept_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT pred_concept_fk FOREIGN KEY (predicate_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: create_fact pred_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT pred_name_fk FOREIGN KEY (predicate_name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_mention pred_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_mention
    ADD CONSTRAINT pred_name_fk FOREIGN KEY (predicate_name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_mention predicate_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_mention
    ADD CONSTRAINT predicate_concept_fkey FOREIGN KEY (predicate_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_mention predicate_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_mention
    ADD CONSTRAINT predicate_concept_fkey FOREIGN KEY (predicate_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: link predicate_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link
    ADD CONSTRAINT predicate_mention_fkey FOREIGN KEY (predicate_start, predicate_stop, predicate_document_id, predicate_language) REFERENCES public.mention(start, stop, document_id, language) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_concept predicate_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_concept
    ADD CONSTRAINT predicate_mention_fkey FOREIGN KEY (predicate_start, predicate_stop, predicate_document_id, predicate_language) REFERENCES public.mention(start, stop, document_id, language) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_concept predicate_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_concept
    ADD CONSTRAINT predicate_mention_fkey FOREIGN KEY (predicate_start, predicate_stop, predicate_document_id, predicate_language) REFERENCES public.mention(start, stop, document_id, language) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_mention sub_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_mention
    ADD CONSTRAINT sub_name_fkey FOREIGN KEY (subject_name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: create_fact subj_concept_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT subj_concept_fk FOREIGN KEY (subject_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: create_fact subj_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT subj_name_fk FOREIGN KEY (subject_name) REFERENCES public.semantic_area(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_mention subject_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_mention
    ADD CONSTRAINT subject_concept_fkey FOREIGN KEY (subject_concept_url) REFERENCES public.concept(concept_url) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: link subject_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link
    ADD CONSTRAINT subject_mention_fkey FOREIGN KEY (subject_document_id, subject_start, subject_stop, subject_language) REFERENCES public.mention(document_id, start, stop, language) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_mention subject_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_mention
    ADD CONSTRAINT subject_mention_fkey FOREIGN KEY (start, document_id, language, stop) REFERENCES public.mention(start, document_id, language, stop) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_concept subject_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_concept
    ADD CONSTRAINT subject_mention_fkey FOREIGN KEY (subject_stop, subject_language, subject_document_id, subject_start) REFERENCES public.mention(stop, language, document_id, start) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_mention subject_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_mention
    ADD CONSTRAINT subject_mention_fkey FOREIGN KEY (document_id, start, language, stop) REFERENCES public.mention(document_id, start, language, stop) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_concept subject_mention_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_concept
    ADD CONSTRAINT subject_mention_fkey FOREIGN KEY (subject_stop, subject_document_id, subject_language, subject_start) REFERENCES public.mention(stop, document_id, language, start) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ground_truth_log_file user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ground_truth_log_file
    ADD CONSTRAINT user_fkey FOREIGN KEY (name_space, username) REFERENCES public."user"(name_space, username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: add_concept user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.add_concept
    ADD CONSTRAINT user_fkey FOREIGN KEY (name_space, username) REFERENCES public."user"(name_space, username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: annotate user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotate
    ADD CONSTRAINT user_fkey FOREIGN KEY (name_space, username) REFERENCES public."user"(name_space, username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: annotate_label user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotate_label
    ADD CONSTRAINT user_fkey FOREIGN KEY (name_space, username) REFERENCES public."user"(name_space, username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: associate user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associate
    ADD CONSTRAINT user_fkey FOREIGN KEY (name_space, username) REFERENCES public."user"(name_space, username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: link user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link
    ADD CONSTRAINT user_fkey FOREIGN KEY (username, name_space) REFERENCES public."user"(username, name_space) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_mention user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_mention
    ADD CONSTRAINT user_fkey FOREIGN KEY (username, name_space) REFERENCES public."user"(username, name_space) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_subj_concept user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_subj_concept
    ADD CONSTRAINT user_fkey FOREIGN KEY (username, name_space) REFERENCES public."user"(username, name_space) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_mention user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_mention
    ADD CONSTRAINT user_fkey FOREIGN KEY (username, name_space) REFERENCES public."user"(username, name_space) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_pred_concept user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_pred_concept
    ADD CONSTRAINT user_fkey FOREIGN KEY (username, name_space) REFERENCES public."user"(username, name_space) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_mention user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_mention
    ADD CONSTRAINT user_fkey FOREIGN KEY (username, name_space) REFERENCES public."user"(username, name_space) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationship_obj_concept user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationship_obj_concept
    ADD CONSTRAINT user_fkey FOREIGN KEY (username, name_space) REFERENCES public."user"(username, name_space) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: share_collection user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.share_collection
    ADD CONSTRAINT user_fkey FOREIGN KEY (name_space, username) REFERENCES public."user"(name_space, username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: create_fact username_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.create_fact
    ADD CONSTRAINT username_fk FOREIGN KEY (name_space, username) REFERENCES public."user"(name_space, username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

