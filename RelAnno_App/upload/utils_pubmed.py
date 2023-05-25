from metapub import *
import os
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import login as auth_login,authenticate,logout as auth_logout
from django.contrib.auth.models import User as User1
from django.contrib.auth.models import *
from RelAnno_App.utils import *
from django.contrib.auth.decorators import login_required
import hashlib
from django.db import transaction
from django.http import JsonResponse
from datetime import datetime, timezone
from django.db import connection
import json
import os
from RelAnno_App.models import *
from django.db.models.functions import Now
import requests
from requests.models import PreparedRequest
import xml.etree.ElementTree as ET
from django.http import HttpResponse



def insert_articles_of_PUBMED(document_id):
    # fetch = PubMedFetcher()
    # json_val = {}
    # try:
    #     # article = fetch.article_by_pmid(document_id)
    #     article = fetch.article_by_pmid(document_id)
    # except Exception as e:
    #     # json_val = {'error':'an error occurred, the PMID is: ' +str(document_id)+'. Maybe it is invalid. '}
    #     json_val = False
    # else:
    #     title = article.title
    #     abstract = article.abstract
    #     journal = article.journal
    #     volume = article.volume
    #     year = article.year
    #     authors = article.authors
        json_val = {}
        json_val['document_id'] = 'pubmed_' + document_id


        # find title and abstract for autotron
        params = {'pmids': [document_id]}
        # set PubTator required URL
        url = 'https://www.ncbi.nlm.nih.gov/research/pubtator-api/publications/export/biocjson'

        # issue PubTator request
        req = requests.post(url, json=params)

        if req.status_code == 200:  # HTTP POST request completed -- get annotated text
            pubData = json.loads(req.text)
        else:  # HTTP Exception
            print('[Error]: HTTP code ' + str(req.status_code))
            raise Exception

        # set output var
        annotData = {}
        passages = []

        # iterate over pubData and store annotated data
        for passage in pubData['passages']:  # passages can be title or abstract
            # get passage type
            ptype = passage['infons']['type']
            # get passage offset

            # set passage data
            if ptype == 'title':
                year = passage['infons']['year']
                authors = passage['infons']['authors']
                journal = passage['infons']['journal']
                title = passage['text']
            elif ptype == 'abstract':
                abstract = passage['text']




        # json_val['title'] = min(passages, key=len) if len(passages) == 2 else passages[0]
        # json_val['abstract'] = max(passages, key=len) if len(passages) == 2 else ''
        json_val['abstract'] = abstract
        json_val['title'] = title
        json_val['authors'] = authors
        json_val['journal'] = journal
        # json_val['volume'] = volume
        json_val['year'] = year
        json_val['provenance'] = 'pubmed'
        return json_val


def upload_pubmed_articles(json_val):
    document_id = json_val['id']
    Document.objects.create(document_id = document_id,provenance='pubmed',language='english',document_content=json_val,insertion_time=Now())


def insert_articles_of_OpenAIRE(documents):

    json_val = {}
    try:
        params = {'doi': documents}
        url = 'https://api.openaire.eu/search/publications/'
        json_val = {'documents':[]}


        response = requests.get(url, params=params)
        tree = (ET.fromstring(response.text))
        print(response.text)
        targets = tree.find("results")
        results = targets.findall('result')
        for result in results:
            title = result.find('.//title[@classid="main title"]').text
            description = result.find('.//description').text
            creators = result.findall('.//creator')
            year = result.find('.//dateofacceptance').text
            pid = result.find('.//pid[@classid="doi"]').text
            creators = [x.text for x in creators]
            json_obj = {}
            json_obj['document_id'] = pid
            json_obj['title'] = title
            json_obj['authors'] = ', '.join(creators)
            json_obj['abstract'] = description
            json_obj['year'] = year
            json_obj['journal'] = year
            json_obj['provenance'] = 'OpenAIRE'
            json_val['documents'].append(json_obj)

    except Exception as e:
        # json_val = {'error':'an error occurred, the PMID is: ' +str(document_id)+'. Maybe it is invalid. '}
        json_val = False

    finally:
        return json_val

from semanticscholar import SemanticScholar
def insert_articles_of_semantic(documents):

    json_val = {'documents': []}

    try:
        sch = SemanticScholar()
        results = sch.get_papers(documents)
        for item in results:
            json_obj = {}
            json_obj['provenance'] = 'semantic scholar'
            json_obj['document_id'] = item.externalIds.get('DOI')
            if item.title is not None:
                json_obj['title'] = item.title
            if item.authors is not None:
                json_obj['authors'] = ', '.join([x.name for x in item.authors])
            if item.abstract is not None:
                json_obj['abstract'] = item.abstract
            if item.publicationDate is not None:
                json_obj['year'] = str(item.publicationDate)
            if item.journal is not None:
                json_obj['journal'] = str(item.journal)
            json_val['documents'].append(json_obj)
        # dois = {"ids":["649def34f8be52c8b66281af98ae884c09aef38b", "ARXIV:2106.15928"]}
        # # dois = ['DOI:'+str(x) for x in documents]
        # # params = {'ids': dois}
        # # url = 'https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,abstract,year,authors'
        # url = 'https://api.semanticscholar.org/graph/v1/paper/batch/'
        # json_docs = {}
        # json_docs['documents'] = []
        # response = requests.post(url, data=dois)
        # tree = (ET.fromstring(response.text))
        #
        # targets = tree.find("results")
        # results = targets.findall('result')
        # for result in results:
        #     title = result.find('.//title[@classid="main title"]').text
        #     description = result.find('.//description').text
        #     creators = result.findall('.//creator')
        #     year = result.find('.//dateofacceptance')
        #     creators = [x.text for x in creators]
        #     json_obj = {}
        #     json_obj['title'] = title
        #     json_obj['abstract'] = description
        #     json_obj['year'] = year
        #     json_obj['authors'] = ', '.join(creators)
        #     json_obj['provenance'] = 'semantic_scholar'
    except Exception as e:
        # json_val = {'error':'an error occurred, the PMID is: ' +str(document_id)+'. Maybe it is invalid. '}
        print(e)

    finally:
        return json_val
def upload_openaire_articles(json_val):
    document_id = json_val['id']
    Document.objects.create(document_id = document_id,provenance='openaire',language='english',document_content=json_val,insertion_time=Now())

