from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import login as auth_login,authenticate,logout as auth_logout
from django.contrib.auth.models import User as User1
from django.contrib.auth.models import *
from django.contrib.auth.decorators import login_required
import hashlib
from RelAnno_App.upload.utils_upload import *
from RelAnno_App.upload.utils_pubmed import *
from RelAnno_App.utils import *
from RelAnno_App.upload.configure import *

from django.db import transaction
from django.http import JsonResponse
from datetime import datetime, timezone
from django.db import connection
import json
import os
from RelAnno_App.models import *
from django.http import HttpResponse


def upload_json_files(file,name_space,annotation_type,username):
    json_resp = {'message': 'Ok'}
    name_space = NameSpace.objects.get(name_space=name_space)
    content = json.load(file)
    # user = User.objects.get(name_space=name_space, username=content['username'])
    user = User.objects.get(name_space=name_space, username=username)
    annotations = content[annotation_type]
    try:
        with transaction.atomic():
            for annotation in annotations:
                document = Document.objects.get(document_id=annotation['document_id'])

                if annotation_type == 'labels':
                    label = Label.objects.filter(name=annotation['label'])
                    if not label.exists():
                        Label.objects.create(name=annotation['label'])

                    label = Label.objects.get(name=annotation['label'])

                    a = AnnotateLabel.objects.filter(username=user, name_space=name_space, document_id=document,
                                                     name=label)
                    if not a.exists():
                        AnnotateLabel.objects.create(username=user, name_space=name_space, name=label,
                                                     document_id=document, language=document.language,
                                                     insertion_time=Now())

                if annotation_type == 'mentions':
                    mention = Mention.objects.filter(document_id=document, start=int(annotation['start']),
                                                     stop=int(annotation['stop']))
                    if not mention.exists():
                        Mention.objects.create(document_id=document, language=document.language, start=int(annotation['start']),
                                               stop=int(annotation['stop']), mention_text=str(annotation['mention_text']))
                    mention = Mention.objects.get(document_id=document, start=int(annotation['start']),
                                           stop=int(annotation['stop']), mention_text=str(annotation['mention_text']))

                    a = Annotate.objects.filter(username=user, name_space=name_space, document_id=document,
                                                start=mention, stop=mention.stop)
                    if not a.exists():
                        Annotate.objects.create(username=user, name_space=name_space, start=mention,
                                                stop=mention.stop, document_id=document,
                                                language=document.language, insertion_time=Now())

                if annotation_type == 'concepts':

                    mention = Mention.objects.filter(document_id=document, start=int(annotation['start']),
                                                     stop=int(annotation['stop']))
                    if not mention.exists():
                        Mention.objects.create(document_id=document, language=document.language, start=int(annotation['start']),
                                               stop=int(annotation['stop']), mention_text=str(annotation['mention_text']))
                    mention = Mention.objects.get(document_id=document, start=int(annotation['start']),
                                                  stop=int(annotation['stop']), mention_text=str(annotation['mention_text']))
                    concept_json = {}
                    collection = document.collection_id_id


                    concept_json['concept_url'] = annotation['concept_url']
                    concept_json['concept_name'] = annotation['concept_name']
                    concept_json['concept_description'] = None

                    area = annotation['area']
                    insert_if_missing(concept_json,area,user,collection)
                    concept = Concept.objects.get(concept_url=str(annotation['concept_url']))
                    area = SemanticArea.objects.get(name=str(annotation['area']))


                    a = Annotate.objects.filter(username=user, name_space=name_space, document_id=document,
                                                start=mention, stop=mention.stop)
                    if not a.exists():
                        Annotate.objects.create(username=user, name_space=name_space, start=mention,
                                                stop=mention.stop, document_id=document,
                                                language=document.language, insertion_time=Now())


                    a = Associate.objects.filter(username=user, name_space=name_space, document_id=document, start=mention,
                                                 stop=mention.stop, name=area, concept_url=concept)
                    if not a.exists():
                        Associate.objects.create(username=user, name_space=name_space, document_id=document, start=mention,language=document.language,
                                                 stop=mention.stop, name=area, insertion_time=Now(), concept_url=concept)

                if annotation_type == 'assertions':
                    subject_concepts = annotation['subject_concepts']
                    object_concepts = annotation['object_concepts']
                    predicate_concepts = annotation['predicate_concepts']
                    collection = document.collection_id_id

                    subjects_to_insert = subject_concepts + predicate_concepts + object_concepts
                    for x in subjects_to_insert:
                        concept = {}
                        concept['concept_url'] = x['concept_url']
                        concept['concept_name'] = x['concept_name']
                        concept['concept_description'] = None
                        area = x['concept_area']
                        insert_if_missing(concept,area,user,collection)

                    subject_concept = annotation['subject_concepts'][0]['concept_url']
                    predicate_concept = annotation['predicate_concepts'][0]['concept_url']
                    object_concept = annotation['object_concepts'][0]['concept_url']
                    subject_area = annotation['subject_concepts'][0]['concept_area']
                    predicate_area = annotation['predicate_concepts'][0]['concept_area']
                    object_area = annotation['object_concepts'][0]['concept_area']
                    subject_concept = Concept.objects.get(concept_url=str(subject_concept))
                    predicate_concept = Concept.objects.get(concept_url=str(predicate_concept))
                    object_concept = Concept.objects.get(concept_url=str(object_concept))


                    a = CreateFact.objects.filter(username=user, name_space=name_space, document_id=document, language=document.language,
                                                  subject_concept_url=subject_concept.concept_url,subject_name=subject_area,
                                                  predicate_concept_url=predicate_concept.concept_url,predicate_name=predicate_area,
                                                  object_concept_url=object_concept.concept_url,object_name=object_area,
                                                  )
                    if not a.exists():
                        CreateFact.objects.create(username=user, name_space=name_space, document_id=document,
                                                  language=document.language,
                                                  subject_concept_url=subject_concept.concept_url, subject_name=subject_area,
                                                  predicate_concept_url=predicate_concept.concept_url,
                                                  predicate_name=predicate_area,insertion_time=Now(),
                                                  object_concept_url=object_concept.concept_url, object_name=object_area,
                                                  )

                if annotation_type == 'relationships':
                    collection = document.collection_id_id
                    concept = None
                    subject_concept = None
                    predicate_concept = None
                    object_concept = None
                    mention = None
                    subject_mention = None
                    predicate_mention = None
                    object_mention = None

                    user_source = annotation['username']
                    user_source = User.objects.get(username = user_source, name_space = name_space)
                    total_concepts = annotation['subject_concepts'] + annotation['predicate_concepts'] + annotation['object_concepts']
                    for x in total_concepts:
                        concept = {}
                        concept['concept_url'] = x['concept_url']
                        concept['concept_name'] = x['concept_name']
                        concept['concept_description'] = None
                        area = x['concept_area']
                        insert_if_missing(concept, area, user, collection)

                    subject_start = annotation['subject_start'] if annotation['subject_start'] is not None else None
                    subject_stop = annotation['subject_stop'] if annotation['subject_stop'] is not None else None
                    predicate_start = annotation['predicate_start'] if annotation['predicate_start'] is not None else None
                    predicate_stop = annotation['predicate_stop'] if annotation['predicate_stop'] is not None else None
                    object_start = annotation['object_start'] if annotation['object_start'] is not None else None
                    object_stop = annotation['object_stop'] if annotation['object_stop'] is not None else None
                    starts = [subject_start,predicate_start,object_start]
                    stops = [subject_stop,predicate_stop,object_stop]

                    for start,stop in zip(starts,stops):
                        if start is not None:

                            mention = Mention.objects.get(document_id = document,language = document.language,
                                                          start = int(start), stop = int(stop))

                            if starts.index(start) == 0:
                                subject_mention = mention
                                concepts = annotation['subject_concepts']
                            elif starts.index(start) == 1:
                                predicate_mention = mention
                                concepts = annotation['predicate_concepts']


                            elif starts.index(start) == 2:
                                object_mention = mention
                                concepts = annotation['object_concepts']

                            # for a in annotations:
                            if not Annotate.objects.filter(username=user, start=mention, stop=mention.stop,
                                                           document_id=document).exists():
                                Annotate.objects.create(username=user, start=mention, stop=mention.stop, document_id=document,
                                                        language=document.language,
                                                        name_space=name_space, insertion_time=Now())
                            for con in concepts:
                                c = Concept.objects.get(concept_url = con['concept_url'])
                                area = SemanticArea.objects.get(name = con['concept_area'])
                                if not Associate.objects.filter(username=user, start=mention, stop=mention.stop,concept_url = c,name=area,
                                                               document_id=document).exists():
                                    Associate.objects.create(username=user, start=mention, stop=mention.stop, document_id=document,
                                                            language=document.language,concept_url = c,name=area,
                                                            name_space=name_space, insertion_time=Now())

                    if all(x is not None for x in [subject_mention,predicate_mention,object_mention]):
                        a = Link.objects.filter(username=user, name_space=name_space, subject_document_id=document.document_id,
                                                object_document_id=document.document_id,predicate_document_id=document.document_id,
                                                subject_language = document.language, predicate_language = document.language,
                                                object_language = document.language,
                                                  subject_start=subject_mention.start,
                                                  subject_stop=subject_mention.stop,
                                                object_start=object_mention.start,
                                                object_stop=object_mention.stop,
                                                predicate_start=predicate_mention.start,
                                                predicate_stop=predicate_mention.stop)
                        if not a.exists():
                            Link.objects.create(username=user, name_space=name_space,insertion_time=Now(), subject_document_id=document.document_id,
                                                object_document_id=document.document_id,
                                                predicate_document_id=document.document_id,
                                                subject_language=document.language, predicate_language=document.language,
                                                object_language=document.language,
                                                subject_start=subject_mention.start,
                                                subject_stop=subject_mention.stop,
                                                object_start=object_mention.start,
                                                object_stop=object_mention.stop,
                                                predicate_start=predicate_mention.start,
                                                predicate_stop=predicate_mention.stop)


                    if subject_mention is not None and all(x is None for x in [predicate_mention,object_mention]):
                        # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                        predicate_concept = Concept.objects.get(concept_url = annotation['predicate_concepts'][0]['concept_url'])
                        object_concept = Concept.objects.get(concept_url = annotation['object_concepts'][0]['concept_url'])

                        predicate_name = SemanticArea.objects.get(name = annotation['predicate_concepts'][0]['concept_area'])
                        object_name = SemanticArea.objects.get(name = annotation['object_concepts'][0]['concept_area'])

                        a = RelationshipSubjMention.objects.filter(username=user, name_space=name_space, document_id=document,
                                                language = document.language,
                                                start = subject_mention,stop = subject_mention.stop,
                                                predicate_concept_url = predicate_concept.concept_url,
                                                object_concept_url=object_concept.concept_url,
                                                predicate_name = predicate_name.name,object_name=object_name.name)
                        if not a.exists():
                            RelationshipSubjMention.objects.create(username=user, name_space=name_space, document_id=document,
                                                                   language=document.language,insertion_time=Now(),
                                                                   start=subject_mention, stop=subject_mention.stop,
                                                                   predicate_concept_url=predicate_concept.concept_url,
                                                                   object_concept_url=object_concept.concept_url,
                                                                   predicate_name=predicate_name.name,
                                                                   object_name=object_name.name)
                    if predicate_mention is not None and all(x is None for x in [subject_mention, object_mention]):
                        # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                        subject_concept = Concept.objects.get(concept_url=annotation['subject_concepts'][0]['concept_url'])
                        object_concept = Concept.objects.get(concept_url=annotation['object_concepts'][0]['concept_url'])

                        subject_name = SemanticArea.objects.get(name=annotation['subject_concepts'][0]['concept_area'])
                        object_name = SemanticArea.objects.get(name=annotation['object_concepts'][0]['concept_area'])

                        a = RelationshipPredMention.objects.filter(username=user, name_space=name_space,
                                                                   document_id=document,
                                                                   language=document.language,
                                                                   start=predicate_mention, stop=predicate_mention.stop,
                                                                   subject_concept_url=subject_concept.concept_url,
                                                                   object_concept_url=object_concept.concept_url,
                                                                   subject_name=subject_name.name,
                                                                   object_name=object_name.name)
                        if not a.exists():
                            RelationshipPredMention.objects.create(username=user, name_space=name_space,
                                                                   document_id=document,
                                                                   language=document.language, insertion_time=Now(),
                                                                   start=predicate_mention, stop=predicate_mention.stop,
                                                                   subject_concept_url=subject_concept.concept_url,
                                                                   object_concept_url=object_concept.concept_url,
                                                                   subject_name=subject_name.name,
                                                                   object_name=object_name.name)

                    if object_mention is not None and all(x is None for x in [subject_mention,predicate_mention]):
                        # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                        subject_concept = Concept.objects.get(concept_url = annotation['subject_concepts'][0]['concept_url'])
                        predicate_concept = Concept.objects.get(concept_url = annotation['predicate_concepts'][0]['concept_url'])

                        subject_name = SemanticArea.objects.get(name = annotation['subject_concepts'][0]['concept_area'])
                        predicate_name = SemanticArea.objects.get(name = annotation['predicate_concepts'][0]['concept_area'])

                        a = RelationshipObjMention.objects.filter(username=user, name_space=name_space, document_id=document,
                                                language = document.language,
                                                start = object_mention,stop = object_mention.stop,
                                                subject_concept_url = subject_concept.concept_url,
                                                predicate_concept_url=predicate_concept.concept_url,
                                                predicate_name = subject_name.name,subject_name=subject_name.name)
                        if not a.exists():
                            RelationshipObjMention.objects.create(username=user, name_space=name_space, document_id=document,
                                                                   language=document.language,insertion_time=Now(),
                                                                   start=object_mention, stop=object_mention.stop,
                                                                   predicate_concept_url=predicate_concept.concept_url,
                                                                   subject_concept_url=subject_concept.concept_url,
                                                                   predicate_name=predicate_name.name,
                                                                   subject_name=subject_name.name)



                    if object_mention is not None and subject_mention is not None and predicate_mention is None:
                        # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                        concept = Concept.objects.get(concept_url=annotation['predicate_concepts'][0]['concept_url'])
                        area = SemanticArea.objects.get(name=annotation['predicate_concepts'][0]['concept_area'])




                        a = RelationshipPredConcept.objects.filter(username=user, name_space=name_space, subject_document_id=document.document_id,
                                                subject_language = document.language,object_document_id=document.document_id,
                                                object_language = document.language,subject_start = subject_mention.start,subject_stop = subject_mention.stop,
                                                object_start = object_mention.start, object_stop = object_mention.stop,concept_url = concept,name=area)
                        if not a.exists():
                            RelationshipPredConcept.objects.create(username=user, name_space=name_space,
                                                                   subject_document_id=document.document_id,
                                                                   subject_language=document.language,insertion_time=Now(),
                                                                   object_document_id=document.document_id,
                                                                   object_language=document.language,
                                                                   subject_start=subject_mention.start,
                                                                   subject_stop=subject_mention.stop,
                                                                   object_start=object_mention.start,
                                                                   object_stop=object_mention.stop,
                                                                   concept_url=concept, name=area)
                    if object_mention is not None and predicate_mention is not None and subject_mention is None:
                        # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                        concept = Concept.objects.get(concept_url=annotation['subject_concepts'][0]['concept_url'])
                        area = SemanticArea.objects.get(name=annotation['subject_concepts'][0]['concept_area'])

                        a = RelationshipSubjConcept.objects.filter(username=user, name_space=name_space,
                                                                   predicate_document_id=document.document_id,
                                                                   predicate_language=document.language,
                                                                   object_document_id=document.document_id,
                                                                   object_language=document.language,
                                                                   predicate_start=predicate_mention.start,
                                                                   predicate_stop=predicate_mention.stop,
                                                                   object_start=object_mention.start,
                                                                   object_stop=object_mention.stop,
                                                                   concept_url=concept, name=area)
                        if not a.exists():
                            RelationshipSubjConcept.objects.create(username=user, name_space=name_space,
                                                                   predicate_document_id=document.document_id,
                                                                   predicate_language=document.language,
                                                                   insertion_time=Now(),
                                                                   object_document_id=document.document_id,
                                                                   object_language=document.language,
                                                                   predicate_start=predicate_mention.start,
                                                                   predicate_stop=predicate_mention.stop,
                                                                   object_start=object_mention.start,
                                                                   object_stop=object_mention.stop,
                                                                   concept_url=concept, name=area)
                    if subject_mention is not None and predicate_mention is not None and object_mention is None:
                        # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                        concept = Concept.objects.get(concept_url=annotation['subject_concepts'][0]['concept_url'])
                        area = SemanticArea.objects.get(name=annotation['subject_concepts'][0]['concept_area'])

                        a = RelationshipObjConcept.objects.filter(username=user, name_space=name_space,
                                                                   subject_document_id=document.document_id,
                                                                   subject_language=document.language,
                                                                   predicate_document_id=document.document_id,
                                                                   predicate_language=document.language,
                                                                   predicate_start=predicate_mention.start,
                                                                   predicate_stop=predicate_mention.stop,
                                                                   subject_start=subject_mention.start,
                                                                   subject_stop=subject_mention.stop,
                                                                   concept_url=concept, name=area)
                        if not a.exists():
                            RelationshipObjConcept.objects.create(username=user, name_space=name_space,
                                                                   subject_document_id=document.document_id,
                                                                   subject_language=document.language,
                                                                   insertion_time=Now(),
                                                                   predicate_document_id=document.document_id,
                                                                   predicate_language=document.language,
                                                                   predicate_start=predicate_mention.start,
                                                                   predicate_stop=predicate_mention.stop,
                                                                   subject_start=subject_mention.start,
                                                                   subject_stop=subject_mention.stop,
                                                                   concept_url=concept, name=area)


                    update_gt(user, name_space, document, document.language)

    except Exception as e:
        print(e)
        return False


def upload_csv_files(file,name_space,annotation,username):

    """This method handles the upload of csv files to copy th annotations from"""

    json_resp = {'message':'Ok'}
    name_space = NameSpace.objects.get(name_space=name_space)
    try:
        with transaction.atomic():
            # for i in range(len(files)):
                df = pd.read_csv(file)
                df = df.where(pd.notnull(df), None)
                df = df.reset_index(drop=True)  # Useful if the csv includes only commas
                df.sort_values(['document_id','username'])
                cols = list(df.columns)
                for j, g in df.groupby(['document_id','username']):
                    count_rows = g.shape[0]

                    document = Document.objects.get(document_id=str(g.document_id.unique()[0]))

                    g = g.reset_index()
                    # user = User.objects.get(username=str(g.username.unique()[0]), name_space=name_space)
                    user = User.objects.get(username=str(username), name_space=name_space)
                    if annotation == 'labels':
                        for i in range(count_rows):
                            document = Document.objects.get(document_id=str(g.loc[i, 'document_id']))
                            label = Label.objects.filter(name=str(g.loc[i, 'label']))
                            if not label.exists():
                                Label.objects.create(name=str(g.loc[i, 'label']))

                            label = Label.objects.get(name=str(g.loc[i, 'label']))

                            a = AnnotateLabel.objects.filter(username=user, name_space=name_space, document_id=document,
                                                             name=label)
                            if not a.exists():
                                AnnotateLabel.objects.create(username=user, name_space=name_space, name=label,
                                                             document_id=document, language=document.language,
                                                             insertion_time=Now())
                    if annotation == 'mentions':
                        for i in range(count_rows):

                            document = Document.objects.get(document_id=str(g.loc[i, 'document_id']))
                            mention = Mention.objects.filter(document_id=document, start=int(g.loc[i, 'start']),
                                                          stop=int(g.loc[i, 'stop']))
                            if not mention.exists():
                                Mention.objects.create(document_id=document,language = document.language, start=int(g.loc[i, 'start']),
                                                       stop=int(g.loc[i, 'stop']),mention_text=int(g.loc[i, 'mention_text']))
                            mention = Mention.objects.get(document_id=document, start=int(g.loc[i, 'start']),
                                                             stop=int(g.loc[i, 'stop']))


                            a = Annotate.objects.filter(username=user, name_space=name_space, document_id=document,
                                                        start=mention, stop=mention.stop)
                            if not a.exists():
                                Annotate.objects.create(username=user, name_space=name_space, start=mention,
                                                        stop=mention.stop, document_id=document,
                                                        language=document.language, insertion_time=Now())

                    if annotation == 'concepts':
                        for i in range(count_rows):

                            document = Document.objects.get(document_id = str(g.loc[i, 'document_id']))
                            mention = Mention.objects.filter(document_id=document, start=int(g.loc[i, 'start']),
                                                          stop=int(g.loc[i, 'stop']))
                            if not mention.exists():
                                Mention.objects.create(document_id=document,language = document.language, start=int(g.loc[i, 'start']),
                                                       stop=int(g.loc[i, 'stop']),mention_text=int(g.loc[i, 'mention_text']))
                            mention = Mention.objects.get(document_id=document, start=int(g.loc[i, 'start']),
                                                             stop=int(g.loc[i, 'stop']))
                            a = Annotate.objects.filter(username=user, name_space=name_space, document_id=document,language=document.language,
                                                        start=mention, stop=mention.stop)
                            if not a.exists():
                                Annotate.objects.create(username=user, name_space=name_space, start=mention,
                                                        stop=mention.stop, document_id=document,
                                                        language=document.language, insertion_time=Now())

                            concept_json = {}
                            concept_json['concept_url'] = str(g.loc[i, 'concept_url'])
                            concept_json['concept_name'] = str(g.loc[i, 'concept_name'])
                            concept_json['concept_description'] = None
                            collection = document.collection_id_id
                            insert_if_missing(concept_json, area, user, collection)
                            concept = Concept.objects.get(concept_url=str(g.loc[i, 'concept_url']))
                            area = SemanticArea.objects.get(name=str(g.loc[i, 'area']))

                            a = Associate.objects.filter(username = user,name_space=name_space,document_id = document,start=mention,stop = mention.stop,name=area,concept_url = concept)
                            if not a.exists():
                                Associate.objects.create(username = user,language = document.language,name_space=name_space,document_id = document,start=mention,stop = mention.stop,name=area,insertion_time = Now(),concept_url = concept)

                if annotation == 'assertions' :
                    for i in range(count_rows):

                        subject_concepts_urls = str(g.loc[i, 'subject_concept_url']).split(",")
                        subject_concepts_names = str(g.loc[i, 'subject_concept_name']).split(",")
                        subject_concepts_areas = str(g.loc[i, 'subject_area']).split(",")

                        predicate_concepts_urls = str(g.loc[i, 'predicate_concept_url']).split(",")
                        predicate_concepts_names = str(g.loc[i, 'predicate_concept_name']).split(",")
                        predicate_concepts_areas = str(g.loc[i, 'predicate_area']).split(",")

                        object_concepts_urls = str(g.loc[i, 'object_concept_url']).split(",")
                        object_concepts_names = str(g.loc[i, 'object_concept_name']).split(",")
                        object_concepts_areas = str(g.loc[i, 'object_area']).split(",")

                        final_concepts_urls = subject_concepts_urls + predicate_concepts_urls + object_concepts_urls
                        final_concepts_names = subject_concepts_names + predicate_concepts_names + object_concepts_names
                        final_concepts_areas = subject_concepts_areas + predicate_concepts_areas + object_concepts_areas

                        for url,name,area in zip(final_concepts_urls,final_concepts_names,final_concepts_areas):
                            concept_json = {}
                            concept_json['concept_url'] = url
                            concept_json['concept_name'] = name
                            concept_json['concept_area'] = area
                            concept_json['concept_description'] = None
                            collection = document.collection_id_id
                            insert_if_missing(concept_json, concept_json['concept_area'], user, collection)

                        subject_concept = Concept.objects.get(concept_url=subject_concepts_urls[0])
                        predicate_concept = Concept.objects.get(concept_url=predicate_concepts_urls[0])
                        object_concept = Concept.objects.get(concept_url=object_concepts_urls[0])
                        subject_area = SemanticArea.objects.get(name=subject_concepts_areas[0])
                        predicate_area = SemanticArea.objects.get(name=predicate_concepts_areas[0])
                        object_area = SemanticArea.objects.get(name=object_concepts_areas[0])

                        a = CreateFact.objects.filter(username=user, name_space=name_space, document_id=document,
                                                      language=document.language,
                                                      subject_concept_url=subject_concept.concept_url,
                                                      subject_name=subject_area.name,
                                                      predicate_concept_url=predicate_concept.concept_url,
                                                      predicate_name=predicate_area.name,
                                                      object_concept_url=object_concept.concept_url,
                                                      object_name=object_area.name,
                                                      )
                        if not a.exists():
                            CreateFact.objects.create(username=user, name_space=name_space, document_id=document,
                                                      language=document.language,
                                                      subject_concept_url=subject_concept.concept_url,
                                                      subject_name=subject_area.name,
                                                      predicate_concept_url=predicate_concept.concept_url,
                                                      predicate_name=predicate_area.name, insertion_time=Now(),
                                                      object_concept_url=object_concept.concept_url,
                                                      object_name=object_area.name,
                                                      )




                if annotation == 'relationships':
                    for i in range(count_rows):
                        if str(g.loc[i, 'subject_concept_url']) == '' or str(g.loc[i, 'subject_concept_url']) == None:
                            subject_concepts_urls = []
                            subject_concepts_names = []
                            subject_concepts_areas = []
                        else:
                            subject_concepts_urls = str(g.loc[i, 'subject_concept_url']).split(",")
                            subject_concepts_names = str(g.loc[i, 'subject_concept_name']).split(",")
                            subject_concepts_areas = str(g.loc[i, 'subject_area']).split(",")
                        if str(g.loc[i, 'predicate_concept_url']) == '' or str(g.loc[i, 'predicate_concept_url']) == None:
                            predicate_concepts_urls = []
                            predicate_concepts_names = []
                            predicate_concepts_areas = []
                        else:
                            predicate_concepts_urls = str(g.loc[i, 'predicate_concept_url']).split(",")
                            predicate_concepts_names = str(g.loc[i, 'predicate_concept_name']).split(",")
                            predicate_concepts_areas = str(g.loc[i, 'predicate_area']).split(",")
                        if str(g.loc[i, 'object_concept_url']) == '' or str(g.loc[i, 'object_concept_url']) == None:
                            object_concepts_urls = []
                            object_concepts_names = []
                            object_concepts_areas = []
                        else:
                            object_concepts_urls = str(g.loc[i, 'object_concept_url']).split(",")
                            object_concepts_names = str(g.loc[i, 'object_concept_name']).split(",")
                            object_concepts_areas = str(g.loc[i, 'object_area']).split(",")


                        final_concepts_urls = subject_concepts_urls + predicate_concepts_urls + object_concepts_urls
                        final_concepts_names = subject_concepts_names + predicate_concepts_names + object_concepts_names
                        final_concepts_areas = subject_concepts_areas + predicate_concepts_areas + object_concepts_areas

                        for url, name, area in zip(final_concepts_urls, final_concepts_names, final_concepts_areas):
                            concept_json = {}
                            concept_json['concept_url'] = url
                            concept_json['concept_name'] = name
                            concept_json['concept_area'] = area
                            concept_json['concept_description'] = None
                            collection = document.collection_id_id
                            insert_if_missing(concept_json, concept_json['concept_area'], user, collection)

                        # subject_concept = Concept.objects.get(concept_url=subject_concepts_urls[0])
                        # predicate_concept = Concept.objects.get(concept_url=predicate_concepts_urls[0])
                        # object_concept = Concept.objects.get(concept_url=object_concepts_urls[0])
                        # subject_area = SemanticArea.objects.get(name=subject_concepts_areas[0])
                        # predicate_area = SemanticArea.objects.get(name=predicate_concepts_areas[0])
                        # object_area = SemanticArea.objects.get(name=object_concepts_areas[0])


                        subject_start = (g.loc[i, 'subject_start']) if not np.isnan(g.loc[i, 'subject_start']) else None
                        subject_stop = (g.loc[i, 'subject_stop']) if not np.isnan(g.loc[i, 'subject_stop']) else None
                        predicate_start = (g.loc[i, 'predicate_start'])  if not np.isnan(g.loc[i, 'predicate_start']) else None
                        predicate_stop = (g.loc[i, 'predicate_stop'])if not np.isnan(g.loc[i, 'predicate_stop']) else None
                        object_start = (g.loc[i, 'object_start']) if not np.isnan(g.loc[i, 'object_start']) else None
                        object_stop = (g.loc[i, 'object_stop']) if not np.isnan(g.loc[i, 'object_stop']) else None

                        if subject_start is not None and subject_start != '':
                            subject_mention = Mention.objects.get(document_id=document, language=document.language,
                                                                  start=subject_start, stop=subject_stop)
                            if not Annotate.objects.filter(document_id=document, username=user,
                                                           name_space=user.name_space, language=document.language,
                                                           start=subject_mention, stop=subject_mention.stop).exists():
                                Annotate.objects.create(document_id=document, language=document.language, username=user,
                                                        name_space=user.name_space,
                                                        start=subject_mention, stop=subject_mention.stop,
                                                        insertion_time=Now())
                            for c, n, a in zip(subject_concepts_urls, subject_concepts_names, subject_concepts_areas):
                                concept = Concept.objects.get(concept_url=c)
                                area = SemanticArea.objects.get(name=a)
                                if not Associate.objects.filter(username=user, name_space=user.name_space,document_id=document, language=document.language,
                                                                concept_url=concept, name=area, start=subject_mention,
                                                                stop=subject_mention.stop).exists():
                                    Associate.objects.create(username=user, name_space=user.name_space,document_id=document, language=document.language,
                                                             concept_url=concept, name=area, start=subject_mention,
                                                             stop=subject_mention.stop, insertion_time=Now())

                        else:
                            subject_mention = None

                        if predicate_start is not None and predicate_start != '':
                            predicate_mention = Mention.objects.get(document_id=document, language=document.language,
                                                                  start=predicate_start, stop=predicate_stop)
                            if not Annotate.objects.filter(document_id=document, username=user,
                                                           name_space=user.name_space, language=document.language,
                                                           start=predicate_mention, stop=predicate_stop).exists():
                                Annotate.objects.create(document_id=document, language=document.language, username=user,
                                                        name_space=user.name_space,
                                                        start=predicate_mention, stop=predicate_mention.stop,
                                                        insertion_time=Now())
                            for c, n, a in zip(predicate_concepts_urls, predicate_concepts_names, predicate_concepts_areas):
                                concept = Concept.objects.get(concept_url=c)
                                area = SemanticArea.objects.get(name=a)
                                if not Associate.objects.filter(username=user, name_space=user.name_space,document_id=document, language=document.language,
                                                                concept_url=concept, name=area, start=predicate_mention,
                                                                stop=predicate_mention.stop).exists():
                                    Associate.objects.create(username=user, name_space=user.name_space,document_id=document, language=document.language,
                                                             concept_url=concept, name=area, start=predicate_mention,
                                                             stop=predicate_mention.stop, insertion_time=Now())

                        else:
                            predicate_mention = None

                        if object_start is not None and object_start != '':
                            object_mention = Mention.objects.get(document_id=document, language=document.language,
                                                                  start=object_start, stop=object_stop)
                            if not Annotate.objects.filter(document_id=document, username=user,
                                                           name_space=user.name_space, language=document.language,
                                                           start=object_mention, stop=object_mention.stop).exists():
                                Annotate.objects.create(document_id=document, language=document.language, username=user,
                                                        name_space=user.name_space,
                                                        start=object_mention, stop=object_mention.stop,
                                                        insertion_time=Now())
                            for c,n,a in zip(object_concepts_urls,object_concepts_names,object_concepts_areas):
                                concept = Concept.objects.get(concept_url = c)
                                area = SemanticArea.objects.get(name=a)
                                if not Associate.objects.filter(username=user,document_id=document, language=document.language, name_space=user.name_space,concept_url = concept,name=area,start = object_mention,stop = object_mention.stop).exists():
                                    Associate.objects.create(username=user,document_id=document, language=document.language, name_space=user.name_space,concept_url = concept,name=area,start = object_mention,stop = object_mention.stop,insertion_time=Now())


                        else:
                            object_mention = None

                        if all(x is not None for x in [subject_mention, predicate_mention, object_mention]):
                            a = Link.objects.filter(username=user, name_space=name_space,
                                                    subject_document_id=document.document_id,
                                                    object_document_id=document.document_id,
                                                    predicate_document_id=document.document_id,
                                                    subject_language=document.language,
                                                    predicate_language=document.language,
                                                    object_language=document.language,
                                                    subject_start=subject_mention.start,
                                                    subject_stop=subject_mention.stop,
                                                    object_start=object_mention.start,
                                                    object_stop=object_mention.stop,
                                                    predicate_start=predicate_mention.start,
                                                    predicate_stop=predicate_mention.stop)
                            if not a.exists():
                                Link.objects.create(username=user, name_space=name_space, insertion_time=Now(),
                                                    subject_document_id=document.document_id,
                                                    object_document_id=document.document_id,
                                                    predicate_document_id=document.document_id,
                                                    subject_language=document.language,
                                                    predicate_language=document.language,
                                                    object_language=document.language,
                                                    subject_start=subject_mention.start,
                                                    subject_stop=subject_mention.stop,
                                                    object_start=object_mention.start,
                                                    object_stop=object_mention.stop,
                                                    predicate_start=predicate_mention.start,
                                                    predicate_stop=predicate_mention.stop)

                        if subject_mention is not None and all(x is None for x in [predicate_mention,object_mention]):
                            # subject mention
                            predicate_concept = predicate_concepts_urls[0]
                            object_concept = object_concepts_urls[0]
                            predicate_area = predicate_concepts_areas[0]
                            object_area = object_concepts_areas[0]

                            predicate_concept = Concept.objects.get(concept_url = predicate_concept)
                            object_concept = Concept.objects.get(concept_url = object_concept)

                            predicate_area = SemanticArea.objects.get(name = predicate_area)
                            object_area = SemanticArea.objects.get(name = object_area)

                            a = RelationshipSubjMention.objects.filter(username=user, name_space=name_space,
                                                    document_id=document,language = document.language,
                                                    start=subject_mention,
                                                    stop=subject_mention.stop,
                                                    predicate_concept_url=predicate_concept.concept_url,
                                                    object_concept_url=object_concept.concept_url,
                                                    predicate_name=predicate_area.name,
                                                    object_name=object_area.name
                                                    )
                            if not a.exists():
                                RelationshipSubjMention.objects.create(username=user, name_space=name_space,
                                                    document_id=document,language = document.language,
                                                    start=subject_mention,
                                                    stop=subject_mention.stop,
                                                    predicate_concept_url=predicate_concept.concept_url,
                                                    object_concept_url=object_concept.concept_url,
                                                    predicate_name=predicate_area.name,
                                                    object_name=object_area.name,insertion_time=Now())

                        if predicate_mention is not None and all(x is None for x in [subject_mention,object_mention]):
                            # subject mention
                            subject_concept = subject_concepts_urls[0]
                            object_concept = object_concepts_urls[0]
                            subject_area = subject_concepts_areas[0]
                            object_area = object_concepts_areas[0]

                            subject_concept = Concept.objects.get(concept_url = subject_concept)
                            object_concept = Concept.objects.get(concept_url = object_concept)

                            subject_area = SemanticArea.objects.get(name = subject_area)
                            object_area = SemanticArea.objects.get(name = object_area)

                            a = RelationshipPredMention.objects.filter(username=user, name_space=name_space,
                                                    document_id=document,language = document.language,
                                                    start=predicate_mention,
                                                    stop=predicate_mention.stop,
                                                    subject_concept_url=subject_concept.concept_url,
                                                    object_concept_url=object_concept.concept_url,
                                                    subject_name=subject_area.name,
                                                    object_name=object_area.name
                                                    )
                            if not a.exists():
                                RelationshipPredMention.objects.create(username=user, name_space=name_space,
                                                    document_id=document,language = document.language,
                                                    start=predicate_mention,
                                                    stop=predicate_mention.stop,
                                                    subject_concept_url=subject_concept.concept_url,
                                                    object_concept_url=object_concept.concept_url,
                                                    subject_name=subject_area.name,
                                                    object_name=object_area.name,insertion_time=Now())

                        if object_mention is not None and all(x is None for x in [subject_mention,predicate_mention]):
                            # subject mention
                            subject_concept = subject_concepts_urls[0]
                            predicate_concept = predicate_concepts_urls[0]
                            subject_area = subject_concepts_areas[0]
                            predicate_area = predicate_concepts_areas[0]

                            subject_concept = Concept.objects.get(concept_url = subject_concept)
                            predicate_concept = Concept.objects.get(concept_url = predicate_concept)

                            subject_area = SemanticArea.objects.get(name = subject_area)
                            predicate_area = SemanticArea.objects.get(name = predicate_area)

                            a = RelationshipObjMention.objects.filter(username=user, name_space=name_space,
                                                    document_id=document,language = document.language,
                                                    start=object_mention,
                                                    stop=object_mention.stop,
                                                    subject_concept_url=subject_concept.concept_url,
                                                    predicate_concept_url=predicate_concept.concept_url,
                                                    subject_name=subject_area.name,
                                                    predicate_name=predicate_area.name
                                                    )
                            if not a.exists():
                                RelationshipObjMention.objects.create(username=user, name_space=name_space,
                                                    document_id=document,language = document.language,
                                                    start=object_mention,
                                                    stop=object_mention.stop,
                                                    subject_concept_url=subject_concept.concept_url,
                                                    predicate_concept_url=predicate_concept.concept_url,
                                                    subject_name=subject_area.name,
                                                    predicate_name=predicate_area.name,insertion_time=Now())
                        if object_mention is not None and subject_mention is not None and predicate_mention is None:
                            # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                            concept = Concept.objects.get(concept_url=predicate_concepts_urls[0])
                            area = SemanticArea.objects.get(name=predicate_concepts_areas[0])

                            a = RelationshipPredConcept.objects.filter(username=user, name_space=name_space,
                                                                       subject_document_id=document.document_id,
                                                                       subject_language=document.language,
                                                                       object_document_id=document.document_id,
                                                                       object_language=document.language,
                                                                       subject_start=subject_mention.start,
                                                                       subject_stop=subject_mention.stop,
                                                                       object_start=object_mention.start,
                                                                       object_stop=object_mention.stop, concept_url=concept,
                                                                       name=area)
                            if not a.exists():
                                RelationshipPredConcept.objects.create(username=user, name_space=name_space,
                                                                       subject_document_id=document.document_id,
                                                                       subject_language=document.language, insertion_time=Now(),
                                                                       object_document_id=document.document_id,
                                                                       object_language=document.language,
                                                                       subject_start=subject_mention.start,
                                                                       subject_stop=subject_mention.stop,
                                                                       object_start=object_mention.start,
                                                                       object_stop=object_mention.stop,
                                                                       concept_url=concept, name=area)
                        if object_mention is not None and predicate_mention is not None and subject_mention is None:
                            # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                            concept = Concept.objects.get(concept_url=subject_concepts_urls[0])
                            area = SemanticArea.objects.get(name=subject_concepts_areas[0])

                            a = RelationshipSubjConcept.objects.filter(username=user, name_space=name_space,
                                                                       predicate_document_id=document.document_id,
                                                                       predicate_language=document.language,
                                                                       object_document_id=document.document_id,
                                                                       object_language=document.language,
                                                                       predicate_start=predicate_mention.start,
                                                                       predicate_stop=predicate_mention.stop,
                                                                       object_start=object_mention.start,
                                                                       object_stop=object_mention.stop,
                                                                       concept_url=concept, name=area)
                            if not a.exists():
                                RelationshipSubjConcept.objects.create(username=user, name_space=name_space,
                                                                       predicate_document_id=document.document_id,
                                                                       predicate_language=document.language,
                                                                       insertion_time=Now(),
                                                                       object_document_id=document.document_id,
                                                                       object_language=document.language,
                                                                       predicate_start=predicate_mention.start,
                                                                       predicate_stop=predicate_mention.stop,
                                                                       object_start=object_mention.start,
                                                                       object_stop=object_mention.stop,
                                                                       concept_url=concept, name=area)
                        if subject_mention is not None and predicate_mention is not None and object_mention is None:
                            # subject mention, in questo caso ho un solo concetto sia per predicate che per object
                            concept = Concept.objects.get(concept_url=object_concepts_urls[0])
                            area = SemanticArea.objects.get(name=object_concepts_areas[0])

                            a = RelationshipObjConcept.objects.filter(username=user, name_space=name_space,
                                                                      subject_document_id=document.document_id,
                                                                      subject_language=document.language,
                                                                      predicate_document_id=document.document_id,
                                                                      predicate_language=document.language,
                                                                      predicate_start=predicate_mention.start,
                                                                      predicate_stop=predicate_mention.stop,
                                                                      subject_start=subject_mention.start,
                                                                      subject_stop=subject_mention.stop,
                                                                      concept_url=concept, name=area)
                            if not a.exists():
                                RelationshipObjConcept.objects.create(username=user, name_space=name_space,
                                                                      subject_document_id=document.document_id,
                                                                      subject_language=document.language,
                                                                      insertion_time=Now(),
                                                                      predicate_document_id=document.document_id,
                                                                      predicate_language=document.language,
                                                                      predicate_start=predicate_mention.start,
                                                                      predicate_stop=predicate_mention.stop,
                                                                      subject_start=subject_mention.start,
                                                                      subject_stop=subject_mention.stop,
                                                                      concept_url=concept, name=area)

                update_gt(user, name_space, document, document.language)



    except Exception as e:
        print(e)
        return False


def upload_json_concepts(file, name_space, username, collection):
    json_resp = {'message': 'Ok'}
    name_space = NameSpace.objects.get(name_space=name_space)
    content = json.load(file)
    username = User.objects.get(name_space=name_space, username=username)
    try:
        with transaction.atomic():
            for concept in content['concepts']:
                url = concept['concept_url']
                name = concept['concept_name']
                description = concept['concept_description']
                area_str = concept['concept_area']
                elaborate_concept(url, name, description, area_str, collection, username)


    except Exception as e:
        print(e)
        return False



def upload_csv_concepts(file, name_space, username, collection):
    json_resp = {'message': 'Ok'}
    name_space = NameSpace.objects.get(name_space=name_space)
    # content = json.load(file)
    username = User.objects.get(name_space=name_space, username=username)
    try:
        with transaction.atomic():
            df = pd.read_csv(file)
            df = df.where(pd.notnull(df), None)
            df = df.reset_index(drop=True)  # Useful if the csv includes only commas
            for index, concept in df.iterrows():
                url = concept['concept_url']
                name = concept['concept_name']
                description = concept['concept_description']
                area_str = concept['concept_area']
                elaborate_concept(url, name, description, area_str, collection, username)



    except Exception as e:
        print(e)
        return False


def elaborate_concept(concept_url, concept_name, concept_description, area, collection, username):
    """Auxiliary to concept insertion"""

    concept_url = str(concept_url)
    concept_name = str(concept_name)
    concept_description = str(concept_description)
    area = str(area)

    concept = Concept.objects.filter(concept_url=concept_url)
    if not concept.exists():
        Concept.objects.create(concept_url=concept_url, concept_name=concept_name, description=concept_description)

    area_obj = SemanticArea.objects.filter(name=area)
    if not area_obj.exists():
        SemanticArea.objects.create(name=area)
    area = SemanticArea.objects.get(name=area)
    concept = Concept.objects.get(concept_url=concept_url)

    has_area = HasArea.objects.filter(name=area, concept_url=concept)
    if not has_area.exists():
        HasArea.objects.create(name=area, concept_url=concept)

    # collection = Collection.objects.get(collection_id=collection.collection_id)
    addconcept = AddConcept.objects.filter(collection_id=collection, username=username, name_space=username.name_space,
                                           concept_url=concept, name=area)
    if not addconcept.exists():
        AddConcept.objects.create(collection_id=collection, username=username, name_space=username.name_space,
                                  concept_url=concept, insertion_time=Now(), name=area)