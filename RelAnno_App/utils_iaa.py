from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import login as auth_login,authenticate,logout as auth_logout
from django.contrib.auth.models import User as User1
from django.contrib.auth.models import *
from django.contrib.auth.decorators import login_required
import hashlib
from django.db.models.functions import Now
from django.db.models import Count

# from RelAnno_App.upload.utils_upload import *
# from RelAnno_App.upload.utils_pubmed import *
from RelAnno_App.upload.configure import *
from collections import Counter

from django.db import transaction
from itertools import chain
from statsmodels.stats.inter_rater import fleiss_kappa
from statsmodels.stats.inter_rater import aggregate_raters
import numpy as np

from RelAnno_App.models import *
def global_mentions_agreement(collection,document=None):

    """This methods computes the agreement of the entire collection or of a single document"""

    collection = Collection.objects.get(collection_id = collection)
    documents = Document.objects.filter(collection_id=collection)
    name_space = NameSpace.objects.get(name_space='Human')
    user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)
    if document is None:
        annotations = Annotate.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('start','stop')
        users = Annotate.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('username')
        users = [x.username_id for x in users]
    else:
        document = Document.objects.get(document_id = document)
        annotations = Annotate.objects.filter(document_id=document).exclude(username = user_iaa).distinct('start','stop')
        users = Annotate.objects.filter(document_id=document).exclude(username = user_iaa).distinct('username')
        users = [x.username_id for x in users]
    table = []
    if len(users) > 1:
        for a in annotations:
            mention = Mention.objects.get(start=a.start_id,stop = a.stop, document_id = a.document_id)
            users_anno = Annotate.objects.filter(start=mention, stop = a.stop, document_id = a.document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)
        if table == []:
            return ''
        table = aggregate_raters(table)[0]
        fleiss_val = fleiss_kappa(table=table)
        return fleiss_val if not np.isnan(fleiss_val) else 1
    else:
        return ''
    # user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)
    # if document is None:
    #     annotations = Annotate.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('start','stop')
    #
    #     # annotations = Annotate.objects.filter(document_id__in=documents)
    #     users = GroundTruthLogFile.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('username')
    #     users = [x.username for x in users]
    # else:
    #     document = Document.objects.get(document_id = document)
    #
    #     annotations = Annotate.objects.filter(document_id=document).exclude(username = user_iaa).distinct('start','stop')
    #     users = GroundTruthLogFile.objects.filter(document_id=document).exclude(username = user_iaa).distinct('username')
    #     users = [x.username for x in users]
    #
    # table = []
    # if len(users) > 1:
    #     for anno in annotations:
    #         user_annotations = []
    #         # users in rows, mentions in columns
    #         for user in users:
    #             mention = Mention.objects.get(document_id=anno.document_id,start=anno.start_id,stop = anno.stop)
    #             if Annotate.objects.filter(start=mention,stop = mention.stop, document_id = mention.document_id, username = user, name_space = user.name_space).exists():
    #                 user_annotations.append(1)
    #             else:
    #                 user_annotations.append(0)
    #         table.append(user_annotations)
    #     if table == []:
    #         table = [[]]
    #         # fleiss_val = fleiss_kappa(table=table)
    #         return ''
    #     table = aggregate_raters(table)[0]
    #     fleiss_val = fleiss_kappa(table=table)
    #     return fleiss_val if not np.isnan(fleiss_val) else 1
    # else:
    #     return ''


# def update_mentions_agreement(document):
#
#     """This methods computes the agreement of the entire collection or of a single document"""
#
#     document = Document.objects.get(document_id = document)
#
#     annotations = Annotate.objects.filter(document_id=document)
#     name_space = NameSpace.objects.get(name_space='Human')
#
#     user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)
#
#     users = GroundTruthLogFile.objects.filter(document_id=document)
#     users = [x.username for x in users]
#     # delete tutte le annotate dell'iaa
#     with transaction.atomic():
#         Annotate.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#
#         table = []
#         values_to_ret = []
#         for anno in annotations:
#             user_annotations = []
#             for user in users:
#                 # users in rows, mentions in columns
#                 mention = Mention.objects.get(document_id=document, start=anno.start_id, stop=anno.stop)
#
#                 if Annotate.objects.filter(start=mention,stop = mention.stop, document_id = mention.document_id, username = user, name_space = user.name_space).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             count_annotations = dict(Counter(user_annotations))
#             if 1 not in count_annotations.keys():
#                 count_annotations[1] = 0
#             if 0 not in count_annotations.keys():
#                 count_annotations[0] = 0
#
#             table.append(user_annotations)
#             table = aggregate_raters(table)
#             fleiss_val = fleiss_kappa(table=table[0])
#             if fleiss_val > 0.6:
#                 Annotate.objects.create(document_id=document, username=user_iaa,insertion_time=Now(), name_space=name_space, start = mention, stop = mention.stop,
#                                         language = document.language)



def update_mentions_agreement_majority(document):

    """This methods computes the agreement of the entire collection or of a single document"""

    document = Document.objects.get(document_id = document)
    # il totale di annotatori è pari al numero di annotatori che hanno trovato almeno una mention/concetto/label/assertion
    # annotations = Annotate.objects.filter(document_id=document)
    name_space = NameSpace.objects.get(name_space='Human')

    user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)

    users = GroundTruthLogFile.objects.filter(document_id=document).exclude(username = user_iaa).distinct('username')
    users = [x.username for x in users]
    total_count_users = len(users)
    # delete tutte le annotate dell'iaa
    if len(users)> 1:
        with transaction.atomic():
            Annotate.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
            half = int(total_count_users/2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = Annotate.objects.filter(document_id=document).exclude(username=user_iaa).values('start', 'stop').annotate(count=Count('insertion_time')).order_by('start', 'stop').filter(count__gt=half)
            table = []
            values_to_ret = []
            for anno in annot:
                start = anno['start']
                stop = anno['stop']
                mention = Mention.objects.get(document_id = document, start = start, stop = stop)
                Annotate.objects.create(document_id=document, username=user_iaa,insertion_time=Now(), name_space=name_space, start = mention, stop = mention.stop,
                                        language = document.language)


def update_concepts_agreement_majority(document):

    """This methods computes the agreement of the entire collection or of a single document"""

    document = Document.objects.get(document_id = document)
    # il totale di annotatori è pari al numero di annotatori che hanno trovato almeno una mention/concetto/label/assertion
    # annotations = Annotate.objects.filter(document_id=document)
    name_space = NameSpace.objects.get(name_space='Human')

    user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)

    users = GroundTruthLogFile.objects.filter(document_id=document).exclude(username=user_iaa).distinct('username')
    users = [x.username for x in users]
    total_count_users = len(users)
    # delete tutte le annotate dell'iaa
    if len(users)> 1:
        with transaction.atomic():
            Associate.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
            half = int(total_count_users/2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = Associate.objects.filter(document_id=document).exclude(username=user_iaa).values('start', 'stop','name','concept_url').annotate(count=Count('insertion_time')).order_by('start', 'stop','name','concept_url').filter(count__gt=half)
            table = []
            values_to_ret = []
            for anno in annot:
                start = anno['start']
                stop = anno['stop']
                mention = Mention.objects.get(document_id = document, start = start, stop = stop)
                concept = Concept.objects.get(concept_url = anno['concept_url'])
                area = SemanticArea.objects.get(name = anno['name'])
                Associate.objects.create(document_id=document, username=user_iaa,insertion_time=Now(), name_space=name_space, start = mention, stop = mention.stop,concept_url = concept,name=area,
                                        language = document.language)


def update_labels_agreement_majority(document):

    """This methods computes the agreement of the entire collection or of a single document"""

    document = Document.objects.get(document_id = document)
    # il totale di annotatori è pari al numero di annotatori che hanno trovato almeno una mention/concetto/label/assertion
    # annotations = Annotate.objects.filter(document_id=document)
    name_space = NameSpace.objects.get(name_space='Human')

    user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)

    users = GroundTruthLogFile.objects.filter(document_id=document).exclude(username=user_iaa).distinct('username')
    users = [x.username for x in users]
    total_count_users = len(users)
    # delete tutte le annotate dell'iaa
    if len(users)> 1:
        with transaction.atomic():
            AnnotateLabel.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
            half = int(total_count_users/2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = AnnotateLabel.objects.filter(document_id=document).exclude(username=user_iaa).values('name').annotate(count=Count('insertion_time')).order_by('name').filter(count__gt=half)

            for anno in annot:

                label = Label.objects.get(name = anno['name'])

                AnnotateLabel.objects.create(document_id=document,insertion_time=Now(), username=user_iaa, name_space=name_space,name=label,language = document.language)





def update_assertions_agreement_majority(document):

    """This methods computes the agreement of the entire collection or of a single document"""

    document = Document.objects.get(document_id = document)
    # il totale di annotatori è pari al numero di annotatori che hanno trovato almeno una mention/concetto/label/assertion
    # annotations = Annotate.objects.filter(document_id=document)
    name_space = NameSpace.objects.get(name_space='Human')

    user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)

    users = GroundTruthLogFile.objects.filter(document_id=document).exclude(username = user_iaa).distinct('username')
    users = [x.username for x in users]
    total_count_users = len(users)
    # delete tutte le annotate dell'iaa
    if len(users)> 1:
        with transaction.atomic():
            CreateFact.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
            half = int(total_count_users/2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = CreateFact.objects.filter(document_id=document).filter(document_id=document).exclude(username=user_iaa).values('subject_concept_url','predicate_concept_url','object_concept_url','subject_name','predicate_name','object_name').annotate(count=Count('insertion_time')).order_by('subject_concept_url','predicate_concept_url','object_concept_url','subject_name','predicate_name','object_name').filter(count__gt=half)
            table = []
            values_to_ret = []
            for anno in annot:
                subject_concept_url = anno['subject_concept_url']
                predicate_concept_url = anno['predicate_concept_url']
                object_concept_url = anno['object_concept_url']
                subject_name = anno['subject_name']
                predicate_name = anno['predicate_name']
                object_name = anno['object_name']

                CreateFact.objects.create(document_id=document, username=user_iaa,insertion_time=Now(), name_space=name_space, language = document.language,
                                          subject_concept_url = subject_concept_url,predicate_concept_url=predicate_concept_url,object_concept_url=object_concept_url,
                                          subject_name=subject_name,predicate_name=predicate_name,object_name=object_name
                                        )


def update_relationships_agreement_majority(document):
    """This methods computes the agreement of the entire collection or of a single document"""

    document = Document.objects.get(document_id=document)
    # il totale di annotatori è pari al numero di annotatori che hanno trovato almeno una mention/concetto/label/assertion
    # annotations = Annotate.objects.filter(document_id=document)
    name_space = NameSpace.objects.get(name_space='Human')

    user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)

    users = GroundTruthLogFile.objects.filter(document_id=document).exclude(username = user_iaa).distinct('username')
    users = [x.username for x in users]
    total_count_users = len(users)
    # delete tutte le annotate dell'iaa
    if len(users) > 1:
        with transaction.atomic():
            Link.objects.filter(subject_document_id=document.document_id, username=user_iaa, name_space=name_space).delete()
            half = int(total_count_users / 2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = Link.objects.filter(subject_document_id=document.document_id).exclude(username = user_iaa).values('subject_start', 'subject_stop', 'predicate_start',
                                              'predicate_stop', 'object_start', 'object_stop').annotate(
                count=Count('insertion_time')).order_by('subject_start', 'subject_stop',
                                                        'predicate_start', 'predicate_stop', 'object_start',
                                                        'object_stop').filter(count__gt=half)
            table = []
            values_to_ret = []
            for anno in annot:
                subject_start = anno['subject_start']
                subject_stop = anno['subject_stop']
                predicate_start = anno['predicate_start']
                object_start = anno['object_start']
                predicate_stop = anno['predicate_stop']
                object_stop = anno['object_stop']

                Link.objects.create(subject_document_id=document.document_id,object_document_id=document.document_id,predicate_document_id=document.document_id, username=user_iaa, insertion_time=Now(),
                                          name_space=name_space, subject_language=document.language,object_language=document.language,predicate_language=document.language,
                                          subject_start=subject_start,
                                          subject_stop=subject_stop,
                                          predicate_start=predicate_start,
                                          predicate_stop=predicate_stop, object_start=object_start,
                                          object_stop=object_stop
                                          )

            RelationshipSubjMention.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
            half = int(total_count_users / 2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = RelationshipSubjMention.objects.filter(document_id=document).exclude(username = user_iaa).values('start', 'stop', 'predicate_concept_url','object_concept_url','predicate_name','object_name').annotate(
                count=Count('insertion_time')).order_by('start', 'stop', 'predicate_concept_url','object_concept_url','predicate_name','object_name').filter(count__gt=half)

            for anno in annot:
                start = anno['start']
                stop = anno['stop']
                mention = Mention.objects.get(document_id = document, language = document.language, start = start, stop = stop)
                predicate_concept_url = anno['predicate_concept_url']
                object_concept_url = anno['object_concept_url']
                predicate_name = anno['predicate_name']
                object_name = anno['object_name']

                RelationshipSubjMention.objects.create(document_id=document, username=user_iaa, insertion_time=Now(),
                                    name_space=name_space, language=document.language,

                                    start=mention,stop = mention.stop,
                                    predicate_concept_url=predicate_concept_url,
                                    object_concept_url=object_concept_url,
                                    predicate_name=predicate_name,
                                    object_name=object_name
                                    )

            RelationshipPredMention.objects.filter(document_id=document, username=user_iaa,
                                                   name_space=name_space).delete()
            half = int(total_count_users / 2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = RelationshipPredMention.objects.filter(document_id=document).exclude(username = user_iaa).values('start', 'stop',
                                                                                                'subject_concept_url',
                                                                                                'object_concept_url',
                                                                                                'subject_name',
                                                                                                'object_name').annotate(
                count=Count('insertion_time')).order_by('start', 'stop', 'subject_concept_url', 'object_concept_url',
                                                        'subject_name', 'object_name').filter(count__gt=half)

            for anno in annot:
                start = anno['start']
                stop = anno['stop']
                mention = Mention.objects.get(document_id=document, language=document.language, start=start, stop=stop)
                subject_concept_url = anno['subject_concept_url']
                object_concept_url = anno['object_concept_url']
                subject_name = anno['subject_name']
                object_name = anno['object_name']

                RelationshipPredMention.objects.create(document_id=document, username=user_iaa, insertion_time=Now(),
                                                       name_space=name_space, language=document.language,

                                                       start=mention, stop=mention.stop,
                                                       subject_concept_url=subject_concept_url,
                                                       object_concept_url=object_concept_url,
                                                       subject_name=subject_name,
                                                       object_name=object_name
                                                       )

            RelationshipObjMention.objects.filter(document_id=document, username=user_iaa,
                                                   name_space=name_space).delete()
            half = int(total_count_users / 2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = RelationshipObjMention.objects.filter(document_id=document).exclude(username = user_iaa).values('start', 'stop',
                                                                                                'subject_concept_url',
                                                                                                'predicate_concept_url',
                                                                                                'subject_name',
                                                                                                'predicate_name').annotate(
                count=Count('insertion_time')).order_by('start', 'stop', 'subject_concept_url', 'predicate_concept_url',
                                                        'subject_name', 'predicate_name').filter(count__gt=half)

            for anno in annot:
                start = anno['start']
                stop = anno['stop']
                mention = Mention.objects.get(document_id=document, language=document.language, start=start, stop=stop)
                subject_concept_url = anno['subject_concept_url']
                predicate_concept_url = anno['predicate_concept_url']
                subject_name = anno['subject_name']
                predicate_name = anno['predicate_name']

                RelationshipObjMention.objects.create(document_id=document, username=user_iaa, insertion_time=Now(),
                                                       name_space=name_space, language=document.language,

                                                       start=mention, stop=mention.stop,
                                                       subject_concept_url=subject_concept_url,
                                                       predicate_concept_url=predicate_concept_url,
                                                       subject_name=subject_name,
                                                       predicate_name=predicate_name
                                                       )


            RelationshipSubjConcept.objects.filter(predicate_document_id=document.document_id, username=user_iaa,
                                                   name_space=name_space).delete()
            half = int(total_count_users / 2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = RelationshipSubjConcept.objects.filter(predicate_document_id=document.document_id).exclude(username = user_iaa).values('concept_url', 'name',
                                                                                                'predicate_start',
                                                                                                'predicate_stop',
                                                                                                'object_start',
                                                                                                'object_stop').annotate(
                count=Count('insertion_time')).order_by('concept_url', 'name', 'predicate_start', 'predicate_stop',
                                                        'object_start', 'object_stop').filter(count__gt=half)

            for anno in annot:
                concept_url = Concept.objects.get(concept_url = anno['concept_url'])
                area = SemanticArea.objects.get(name=anno['name'])
                predicate_start = anno['predicate_start']
                predicate_stop = anno['predicate_stop']
                object_start = anno['object_start']
                object_stop = anno['object_stop']



                RelationshipSubjConcept.objects.create(predicate_document_id=document.document_id,object_document_id = document.document_id, username=user_iaa, insertion_time=Now(),
                                                       name_space=name_space, predicate_language=document.language,object_language=document.language,
                                                       concept_url = concept_url,name=area, predicate_start=predicate_start,predicate_stop=predicate_stop,
                                                       object_start=object_start,object_stop=object_stop
                                                       )


            RelationshipObjConcept.objects.filter(predicate_document_id=document, username=user_iaa,
                                                   name_space=name_space).delete()
            half = int(total_count_users / 2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = RelationshipObjConcept.objects.filter(predicate_document_id=document.document_id).exclude(username = user_iaa).values('concept_url', 'name',
                                                                                                'predicate_start',
                                                                                                'predicate_stop',
                                                                                                'subject_start',
                                                                                                'subject_stop').annotate(
                count=Count('insertion_time')).order_by('concept_url', 'name', 'predicate_start', 'predicate_stop',
                                                        'subject_start', 'subject_stop').filter(count__gt=half)

            for anno in annot:
                concept_url = Concept.objects.get(concept_url=anno['concept_url'])
                area = SemanticArea.objects.get(name=anno['name'])
                predicate_start = anno['predicate_start']
                predicate_stop = anno['predicate_stop']
                subject_start = anno['subject_start']
                subject_stop = anno['subject_stop']

                RelationshipObjConcept.objects.create(predicate_document_id=document.document_id,
                                                       subject_document_id=document.document_id, username=user_iaa,
                                                       insertion_time=Now(),
                                                       name_space=name_space, predicate_language=document.language,
                                                       subject_language=document.language,
                                                       concept_url=concept_url, name=area,
                                                       predicate_start=predicate_start, predicate_stop=predicate_stop,
                                                       subject_start=subject_start, subject_stop=subject_stop
                                                       )

            RelationshipPredConcept.objects.filter(subject_document_id=document, username=user_iaa,
                                                   name_space=name_space).delete()
            half = int(total_count_users / 2)
            # ann  = Annotate.objects.values('start','stop').annotate(start_count=Count('start'),stop_count = Count('stop')).filter(start_count__gt=total_count_users/2,stop_count__gt=total_count_users/2)
            annot = RelationshipPredConcept.objects.filter(subject_document_id=document.document_id).exclude(username = user_iaa).values('concept_url', 'name',
                                                                                                'object_start',
                                                                                                'object_stop',
                                                                                                'subject_start',
                                                                                                'subject_stop').annotate(
                count=Count('insertion_time')).order_by('concept_url', 'name', 'object_start', 'object_stop',
                                                        'subject_start', 'subject_stop').filter(count__gt=half)

            for anno in annot:
                concept_url = Concept.objects.get(concept_url=anno['concept_url'])
                area = SemanticArea.objects.get(name=anno['name'])
                object_start = anno['object_start']
                object_stop = anno['object_stop']
                subject_start = anno['subject_start']
                subject_stop = anno['subject_stop']

                RelationshipObjConcept.objects.create(object_document_id=document.document_id,
                                                       subject_document_id=document.document_id, username=user_iaa,
                                                       insertion_time=Now(),
                                                       name_space=name_space, object_language=document.language,
                                                       subject_language=document.language,
                                                       concept_url=concept_url, name=area,
                                                       object_start=object_start, object_stop=object_stop,
                                                       subject_start=subject_start, subject_stop=subject_stop
                                                       )

def global_concepts_agreement(collection, document=None):

    """This methods computes the agreement of the entire collection or of a single document"""

    collection = Collection.objects.get(collection_id=collection)
    documents = Document.objects.filter(collection_id=collection)
    name_space = NameSpace.objects.get(name_space = "Human")
    user_iaa = User.objects.get(username = "IAA-Inter Annotator Agreement",name_space = name_space)
    if document is None:
        annotations = Associate.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('start','stop','concept_url','name')
        users = Associate.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('username')
        users = [x.username_id for x in users]
    else:
        document = Document.objects.get(document_id = document)
        users = Associate.objects.filter(document_id=document).exclude(username = user_iaa).distinct('username')
        users = [x.username_id for x in users]
        annotations = Associate.objects.filter(document_id=document).exclude(username = user_iaa).distinct('start','stop','concept_url','name')

    table = []
    if len(users) > 1:
        for a in annotations:
            mention = Mention.objects.get(start=a.start_id,stop = a.stop, document_id = a.document_id)
            users_anno = Associate.objects.filter(start=mention,concept_url = a.concept_url,name=a.name, stop = a.stop, document_id = a.document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)
        if table == []:
            return ''
        table = aggregate_raters(table)[0]
        fleiss_val = fleiss_kappa(table=table)
        return fleiss_val if not np.isnan(fleiss_val) else 1
    else:
        return ''

    # table = []
    # if len(users) > 1:
    #     for association in mentions:
    #         mention = Mention.objects.get(document_id = association.document_id,start = association.start_id, stop = association.stop)
    #         user_annotations = []
    #         # users in rows, mentions in columns
    #         for user in users:
    #
    #             if Associate.objects.filter(start=mention, stop=mention.stop, document_id=association.document_id, username=user,concept_url = association.concept_url, name=association.name,
    #                                        name_space=user.name_space).exists():
    #                 user_annotations.append(1)
    #             else:
    #                 user_annotations.append(0)
    #         table.append(user_annotations)
    #     if table == []:
    #
    #         return ''
    #     table = aggregate_raters(table)[0]
    #     fleiss_val = fleiss_kappa(table=table)
    #     return fleiss_val if not np.isnan(fleiss_val) else 1
    # else:
    #     return ''


# def update_concepts_agreement(document):
#     """This methods computes the agreement of the entire collection or of a single document"""
#
#     document = Document.objects.get(document_id=document)
#     users = GroundTruthLogFile.objects.filter(document_id=document)
#     users = [x.username for x in users]
#     associations = Associate.objects.filter(document_id=document)
#     name_space = NameSpace.objects.get(name_space='Human')
#
#     user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)
#     # delete tutte le annotate dell'iaa
#     with transaction.atomic():
#         Associate.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         table = []
#         values_to_ret = []
#         for association in associations:
#             user_annotations = []
#             mention = Mention.objects.get(document_id=association.document_id,start=association.start_id,stop=association.stop)
#             for user in users:
#                 # users in rows, mentions in columns
#
#                 if Associate.objects.filter(start=mention.start, stop=mention.stop, document_id=mention.document_id,concept_url = mention.concept_url,name=mention.name,
#                                            username=user, name_space=user.name_space).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             table = aggregate_raters(table)
#             fleiss_val = fleiss_kappa(table=table[0])
#             # fleiss_val = fleiss_kappa(table=table)
#
#             if fleiss_val > 0.6:
#                 Associate.objects.create(document_id=document, username=user_iaa, name_space=name_space,insertion_time = Now(),
#                                             start=mention.start, stop=mention.stop,concept_url = mention.concept_url,name = mention.name,
#                                             language=document.language)




def global_labels_agreement(collection, document=None):

    """This methods computes the agreement of the entire collection or of a single document"""

    collection = Collection.objects.get(collection_id=collection)
    documents = Document.objects.filter(collection_id=collection)
    name_space = NameSpace.objects.get(name_space = "Human")
    user_iaa = User.objects.get(username = "IAA-Inter Annotator Agreement",name_space = name_space)
    if document is None:
        annotations = AnnotateLabel.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('name')
        users = AnnotateLabel.objects.filter(document_id__in=documents).exclude(username = user_iaa)
        users = [x.username for x in users]
    else:
        document = Document.objects.get(document_id = document)
        users = AnnotateLabel.objects.filter(document_id=document).exclude(username = user_iaa)
        users = [x.username for x in users]
        annotations = AnnotateLabel.objects.filter(document_id=document).exclude(username = user_iaa).distinct('name')

    table = []
    if len(users) > 1:
        for a in annotations:
            users_anno = AnnotateLabel.objects.filter(document_id=document,name=a.name).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)
        if table == []:
            return ''
        table = aggregate_raters(table)[0]
        fleiss_val = fleiss_kappa(table=table)
        return fleiss_val if not np.isnan(fleiss_val) else 1
    else:
        return ''

# def update_labels_agreement(document):
#     """This methods computes the agreement of the entire collection or of a single document"""
#
#     document = Document.objects.get(document_id=document)
#
#     mentions = AnnotateLabel.objects.filter(document_id=document)
#     name_space = NameSpace.objects.get(name_space='Human')
#     users = GroundTruthLogFile.objects.filter(document_id=document)
#     users = [x.username for x in users]
#     user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)
#     # delete tutte le annotate dell'iaa
#     with transaction.atomic():
#         AnnotateLabel.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         table = []
#         table = []
#         values_to_ret = []
#         for mention in mentions:
#             user_annotations = []
#             for user in users:
#                 # users in rows, mentions in columns
#
#                 if AnnotateLabel.objects.filter(document_id=mention.document_id,name=mention.name,
#                                            username=user, name_space=user.name_space).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             table = aggregate_raters(table)
#             fleiss_val = fleiss_kappa(table=table[0])
#             if fleiss_val > 0.6:
#                 AnnotateLabel.objects.create(document_id=document, username=user_iaa, name_space=name_space,insertion_time = Now(),
#                                             name=mention.name,
#                                             language=document.language)


def global_createfact_agreement(collection, document=None):
    """This methods computes the agreement of the entire collection or of a single document"""

    collection = Collection.objects.get(collection_id=collection)
    documents = Document.objects.filter(collection_id=collection)
    name_space = NameSpace.objects.get(name_space = "Human")
    user_iaa = User.objects.get(username = "IAA-Inter Annotator Agreement",name_space = name_space)
    if document is None:
        annotations = CreateFact.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('subject_concept_url','subject_name','object_name','object_concept_url','predicate_name','predicate_concept_url')
        users = CreateFact.objects.filter(document_id__in=documents).exclude(username = user_iaa)
        users = [x.username_id for x in users]
    else:
        document = Document.objects.get(document_id = document)
        annotations = CreateFact.objects.filter(document_id=document).exclude(username = user_iaa).distinct('subject_concept_url','subject_name','object_name','object_concept_url','predicate_name','predicate_concept_url')
        users = CreateFact.objects.filter(document_id=document).exclude(username = user_iaa)
        users = [x.username_id for x in users]

    table = []
    if len(users) > 1:
        for a in annotations:
            users_anno = CreateFact.objects.filter(subject_concept_url = a.subject_concept_url,object_concept_url = a.object_concept_url,predicate_concept_url = a.predicate_concept_url,subject_name=a.subject_name,object_name=a.object_name,predicate_name=a.predicate_name, document_id = a.document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)
        if table == []:
            return ''
        table = aggregate_raters(table)[0]
        fleiss_val = fleiss_kappa(table=table)
        return fleiss_val if not np.isnan(fleiss_val) else 1
    else:
        return ''
    # table = []
    # if len(users) > 1:
    #     for association in mentions:
    #
    #         user_annotations = []
    #         # users in rows, mentions in columns
    #         for user in users:
    #
    #             if CreateFact.objects.filter(document_id=association.document_id, username=user,name_space=user.name_space,
    #                                          subject_concept_url=association.subject_concept_url,object_concept_url = association.object_concept_url,predicate_concept_url = association.predicate_concept_url,
    #                                          subject_name=association.subject_name,object_name=association.object_name,predicate_name=association.predicate_name).exists():
    #                 user_annotations.append(1)
    #             else:
    #                 user_annotations.append(0)
    #         table.append(user_annotations)
    #     if table == []:
    #         table = [[]]
    #         # fleiss_val = fleiss_kappa(table=table)
    #         return ''
    #     table = aggregate_raters(table)
    #     fleiss_val = fleiss_kappa(table=table[0])
    #     return fleiss_val
    # else:
    #     return ''

# def update_fact_agreement(document):
#
#     """This methods computes the agreement of the entire collection or of a single document"""
#
#     document = Document.objects.get(document_id=document)
#
#     mentions = CreateFact.objects.filter(document_id=document)
#     name_space = NameSpace.objects.get(name_space='Human')
#     users = GroundTruthLogFile.objects.filter(document_id=document).exclude(username = user_iaa)
#     users = [x.username for x in users]
#     user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)
#     table = []
#     values_to_ret = []
#     with transaction.atomic():
#         CreateFact.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         for mention in mentions:
#             user_annotations = []
#             for user in users:
#                 # users in rows, mentions in columns
#
#                 if CreateFact.objects.filter(document_id=mention.document_id,subject_concept_url = mention.subject_concept_url,
#                     object_concept_url = mention.object_concept_url, predicate_concept_url = mention.predicate_concept_url,
#                     subject_name = mention.subject_name,predicate_name = mention.predicate_name,object_name = mention.object_name,
#                                            username=user, name_space=user.name_space).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             table = aggregate_raters(table)
#             fleiss_val = fleiss_kappa(table=table[0])
#             if fleiss_val > 0.6:
#                 CreateFact.objects.objects.create(document_id=mention.document_id,subject_concept_url = mention.subject_concept_url,
#                     object_concept_url = mention.object_concept_url, predicate_concept_url = mention.predicate_concept_url,
#                     subject_name = mention.subject_name,predicate_name = mention.predicate_name,object_name = mention.object_name,
#                                            username=user_iaa, name_space=name_space)


def global_relationships_agreement(collection, document=None):
    """This methods computes the agreement of the entire collection or of a single document"""

    collection = Collection.objects.get(collection_id=collection)
    documents = Document.objects.filter(collection_id=collection)
    doc_lsit = [x.document_id for x in documents]
    name_space = NameSpace.objects.get(name_space = "Human")
    user_iaa = User.objects.get(username = "IAA-Inter Annotator Agreement",name_space = name_space)
    if document is None:
        relations1 = Link.objects.filter(subject_document_id__in=doc_lsit).exclude(username = user_iaa).distinct('subject_start','subject_stop','object_start','object_stop','predicate_start','predicate_stop')
        relations2 = RelationshipSubjConcept.objects.filter(predicate_document_id__in=doc_lsit).exclude(username = user_iaa).distinct('concept_url','name','object_start','object_stop','predicate_start','predicate_stop')
        relations3 = RelationshipPredConcept.objects.filter(object_document_id__in=doc_lsit).exclude(username = user_iaa).distinct('concept_url','name','object_start','object_stop','subject_start','subject_stop')
        relations4 = RelationshipObjConcept.objects.filter(predicate_document_id__in=doc_lsit).exclude(username = user_iaa).distinct('concept_url','name','predicate_start','predicate_stop','subject_start','subject_stop')
        relations5 = RelationshipSubjMention.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('object_concept_url','object_name','predicate_concept_url','predicate_name','start','stop')
        relations6 = RelationshipObjMention.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('subject_concept_url','subject_name','predicate_concept_url','predicate_name','start','stop')
        relations7 = RelationshipPredMention.objects.filter(document_id__in=documents).exclude(username = user_iaa).distinct('subject_concept_url','subject_name','object_concept_url','object_name','start','stop')


        users = list(chain(Link.objects.filter(subject_document_id__in=doc_lsit).exclude(username = user_iaa) , RelationshipSubjConcept.objects.filter(predicate_document_id__in=doc_lsit).exclude(username = user_iaa) , RelationshipPredConcept.objects.filter(object_document_id__in=doc_lsit).exclude(username = user_iaa) , RelationshipObjConcept.objects.filter(predicate_document_id__in=doc_lsit).exclude(username = user_iaa) , RelationshipSubjMention.objects.filter(document_id__in=documents).exclude(username = user_iaa) ,RelationshipObjMention.objects.filter(document_id__in=documents).exclude(username = user_iaa) , RelationshipPredMention.objects.filter(document_id__in=documents).exclude(username = user_iaa)))
        users = [x.username_id for x in users]
    else:
        document = Document.objects.get(document_id = document)
        relations1 = Link.objects.filter(subject_document_id=document.document_id).exclude(username = user_iaa).distinct('subject_start','subject_stop','object_start','object_stop','predicate_start','predicate_stop')
        relations2 = RelationshipSubjConcept.objects.filter(predicate_document_id=document.document_id).exclude(username = user_iaa).distinct('concept_url','name','object_start','object_stop','predicate_start','predicate_stop')
        relations3 = RelationshipPredConcept.objects.filter(object_document_id=document.document_id).exclude(username = user_iaa).distinct('concept_url','name','object_start','object_stop','subject_start','subject_stop')
        relations4 = RelationshipObjConcept.objects.filter(predicate_document_id=document.document_id).exclude(username = user_iaa).distinct('concept_url','name','predicate_start','predicate_stop','subject_start','subject_stop')
        relations5 = RelationshipSubjMention.objects.filter(document_id=document).exclude(username = user_iaa).distinct('object_concept_url','object_name','predicate_concept_url','predicate_name','start','stop')
        relations6 = RelationshipObjMention.objects.filter(document_id=document).exclude(username = user_iaa).distinct('subject_concept_url','subject_name','predicate_concept_url','predicate_name','start','stop')
        relations7 = RelationshipPredMention.objects.filter(document_id=document).exclude(username = user_iaa).distinct('subject_concept_url','subject_name','object_concept_url','object_name','start','stop')


        users = list(chain(Link.objects.filter(subject_document_id=document.document_id).exclude(username = user_iaa) , RelationshipSubjConcept.objects.filter(predicate_document_id=document.document_id).exclude(username = user_iaa) , RelationshipPredConcept.objects.filter(object_document_id=document.document_id).exclude(username = user_iaa) , RelationshipObjConcept.objects.filter(predicate_document_id=document.document_id).exclude(username = user_iaa) , RelationshipSubjMention.objects.filter(document_id=document.document_id).exclude(username = user_iaa) ,RelationshipObjMention.objects.filter(document_id=document.document_id).exclude(username = user_iaa), RelationshipPredMention.objects.filter(document_id=document.document_id).exclude(username = user_iaa)))
        users = [x.username_id for x in users]
    user_annotations = []

    table = []
    if len(users) > 1:
        for a in relations1:
            users_anno = Link.objects.filter(subject_start = a.subject_start,subject_stop = a.subject_stop,predicate_start = a.predicate_start,predicate_stop=a.predicate_stop,object_start=a.object_start,object_stop=a.object_stop, subject_document_id = a.subject_document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)



        for a in relations2:
            users_anno = RelationshipSubjConcept.objects.filter(concept_url = a.concept_url,name=a.name,predicate_start = a.predicate_start,predicate_stop = a.predicate_stop,object_start = a.object_start,object_stop = a.object_stop, object_document_id = a.object_document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)


        for a in relations3:
            users_anno = RelationshipPredConcept.objects.filter(concept_url = a.concept_url,name=a.name,subject_start = a.subject_start,subject_stop = a.subject_stop,object_start = a.object_start,object_stop = a.object_stop, subject_document_id = a.subject_document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)


        for a in relations4:
            users_anno = RelationshipObjConcept.objects.filter(concept_url = a.concept_url,name=a.name,subject_start = a.subject_start,subject_stop = a.subject_stop,predicate_start = a.predicate_start,predicate_stop = a.predicate_stop, subject_document_id = a.subject_document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)


        for a in relations5:
            users_anno = RelationshipSubjMention.objects.filter(object_concept_url = a.object_concept_url,object_name=a.object_name,predicate_concept_url = a.predicate_concept_url,predicate_name=a.predicate_name,start = a.start,stop = a.stop, document_id = a.document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)



        for a in relations6:
            users_anno = RelationshipObjMention.objects.filter(subject_concept_url = a.subject_concept_url,subject_name=a.subject_name,predicate_concept_url = a.predicate_concept_url,predicate_name=a.predicate_name,start = a.start,stop = a.stop, document_id = a.document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)


        for a in relations7:
            users_anno = RelationshipPredMention.objects.filter(subject_concept_url = a.object_concept_url,subject_name=a.object_name,object_concept_url = a.object_concept_url,object_name=a.object_name,start = a.start,stop = a.stop, document_id = a.document_id).exclude(username = user_iaa).values('username')
            users_f = [0 for x in users]
            user_a = [ann['username'] for ann in users_anno]
            for u in user_a:
                users_f[users.index(u)] = 1
            table.append(users_f)
        if table == []:
            return ''


        table = aggregate_raters(table)[0]
        fleiss_val = fleiss_kappa(table=table)
        return fleiss_val if not np.isnan(fleiss_val) else 1


    else:
        return ''



    # for association in relations1:
    #
    #     # users in rows, mentions in columns
    #     for user in users:
    #         if Link.objects.filter(subject_document_id=association.subject_document_id, username=user,
    #                                name_space=user.name_space,
    #                                subject_start=association.subject_start, subject_stop=association.subject_stop,
    #                                predicate_start=association.predicate_start,
    #                                predicate_stop=association.predicate_stop,
    #                                object_start=association.object_start, object_stop=association.object_stop).exists():
    #             user_annotations.append(1)
    #         else:
    #             user_annotations.append(0)
    #
    # for association in relations2:
    #     for user in users:
    #
    #         if RelationshipSubjConcept.objects.filter(object_document_id=association.object_document_id, username=user,
    #                                name_space=user.name_space,
    #                                object_start=association.object_start, object_stop=association.object_stop,
    #                                predicate_start=association.predicate_start,
    #                                predicate_stop=association.predicate_stop,
    #                                concept_url = association.concept_url,name=association.name).exists():
    #             user_annotations.append(1)
    #         else:
    #             user_annotations.append(0)
    #
    # for association in relations3:
    #     for user in users:
    #
    #         if RelationshipPredConcept.objects.filter(object_document_id=association.object_document_id, username=user,
    #                                name_space=user.name_space,
    #                                object_start=association.object_start, object_stop=association.object_stop,
    #                                subject_start=association.subject_start,
    #                                subject_stop=association.subject_stop,
    #                                concept_url = association.concept_url,name=association.name).exists():
    #             user_annotations.append(1)
    #         else:
    #             user_annotations.append(0)
    #
    # for association in relations4:
    #     for user in users:
    #
    #         if RelationshipObjConcept.objects.filter(subject_document_id=association.subject_document_id, username=user,
    #                                name_space=user.name_space,
    #                                predicate_start=association.predicate_start, predicate_stop=association.predicate_stop,
    #                                subject_start=association.subject_start,
    #                                subject_stop=association.subject_stop,
    #                                concept_url = association.concept_url,name=association.name).exists():
    #             user_annotations.append(1)
    #         else:
    #             user_annotations.append(0)
    #
    # for association in relations5:
    #     for user in users:
    #         mention = Mention.objects.get(document_id = association.document_id, start = association.start_id, stop = association.stop)
    #
    #         if RelationshipSubjMention.objects.filter(document_id=association.document_id, username=user,
    #                                name_space=user.name_space,
    #                                start=mention.start, stop=mention.stop,
    #                                predicate_concept_url=association.predicate_concept_url,predicate_name = association.predicate_name,
    #                                object_concept_url=association.object_concept_url,object_name = association.object_name,
    #                         ).exists():
    #             user_annotations.append(1)
    #         else:
    #             user_annotations.append(0)
    #
    # for association in relations6:
    #     for user in users:
    #         mention = Mention.objects.get(document_id = association.document_id, start = association.start_id, stop = association.stop)
    #
    #         if RelationshipObjMention.objects.filter(document_id=association.document_id, username=user,
    #                                name_space=user.name_space,
    #                                start=mention.start, stop=mention.stop,
    #                                predicate_concept_url=association.predicate_concept_url,predicate_name = association.predicate_name,
    #                                subject_concept_url=association.subject_concept_url,subject_name = association.subject_name,
    #                         ).exists():
    #             user_annotations.append(1)
    #         else:
    #             user_annotations.append(0)
    #
    # for association in relations7:
    #     for user in users:
    #         mention = Mention.objects.get(document_id = association.document_id, start = association.start_id, stop = association.stop)
    #         if RelationshipPredMention.objects.filter(document_id=association.document_id, username=user,
    #                                name_space=user.name_space,
    #                                start=mention.start, stop=mention.stop,
    #                                object_concept_url=association.object_concept_url,object_name = association.object_name,
    #                                subject_concept_url=association.subject_concept_url,subject_name = association.subject_name,
    #                         ).exists():
    #             user_annotations.append(1)
    #         else:
    #             user_annotations.append(0)
    #
    #     table.append(user_annotations)
    # if table == []:
    #     table = [[]]
    #     # fleiss_val = fleiss_kappa(table=table)
    #     return ''
    # table = aggregate_raters(table)
    # fleiss_val = fleiss_kappa(table=table[0])
    # return fleiss_val



# def update_relationships_agreement(document):
#
#     """This methods computes the agreement of the entire collection or of a single document"""
#
#     document = Document.objects.filter(document_id = document)
#     users = GroundTruthLogFile.objects.filter(document_id=document)
#     users = [x.username for x in users]
#
#     relations1 = Link.objects.filter(subject_document_id=document.document_id)
#     relations2 = RelationshipSubjConcept.objects.filter(predicate_document_id=document.document_id)
#     relations3 = RelationshipPredConcept.objects.filter(object_document_id=document.document_id)
#     relations4 = RelationshipObjConcept.objects.filter(predicate_document_id=document.document_id)
#     relations5 = RelationshipSubjMention.objects.filter(document_id=document)
#     relations6 = RelationshipObjMention.objects.filter(document_id=document)
#     relations7 = RelationshipPredMention.objects.filter(document_id=document)
#
#     table = []
#     name_space = NameSpace.objects.get(name_space='Human')
#     user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)
#
#     values_to_ret = []
#     with transaction.atomic():
#
#         Link.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         RelationshipSubjConcept.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         RelationshipPredConcept.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         RelationshipObjConcept.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         RelationshipSubjMention.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         RelationshipObjMention.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#         RelationshipPredMention.objects.filter(document_id=document, username=user_iaa, name_space=name_space).delete()
#
#         for association in relations1:
#             table = []
#             for user in users:
#                 user_annotations = []
#             # users in rows, mentions in columns
#                 if Link.objects.filter(subject_document_id=association.subject_document_id, username=user,
#                                        name_space=user.name_space,
#                                        subject_start=association.subject_start, subject_stop=association.subject_stop,
#                                        predicate_start=association.predicate_start,
#                                        predicate_stop=association.predicate_stop,
#                                        object_start=association.object_start, object_stop=association.object_stop).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#
#             table.append(user_annotations)
#             fleiss_val = fleiss_kappa(table=table)
#             if fleiss_val > 0.6:
#                 Link.objects.objects.create(subject_document_id=association.subject_document_id, username=user_iaa,
#                                        name_space=user_iaa.name_space,insertion_time=Now(),
#                                        subject_start=association.subject_start, subject_stop=association.subject_stop,
#                                        predicate_start=association.predicate_start,
#                                        predicate_stop=association.predicate_stop,
#                                        object_start=association.object_start, object_stop=association.object_stop)
#
#
#         for association in relations2:
#             table = []
#             for user in users:
#                 user_annotations = []
#
#                 if RelationshipSubjConcept.objects.filter(object_document_id=association.object_document_id, username=user,
#                                    name_space=user.name_space,
#                                    object_start=association.object_start, object_stop=association.object_stop,
#                                    predicate_start=association.predicate_start,
#                                    predicate_stop=association.predicate_stop,
#                                    concept_url = association.concept_url,name=association.name).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             fleiss_val = fleiss_kappa(table=table)
#             if fleiss_val > 0.6:
#                 RelationshipSubjConcept.objects.create(object_document_id=association.object_document_id, username=user_iaa,
#                                    name_space=user_iaa.name_space,
#                                    object_start=association.object_start, object_stop=association.object_stop,
#                                    predicate_start=association.predicate_start,
#                                    predicate_stop=association.predicate_stop,insertion_time=Now(),
#                                    concept_url = association.concept_url,name=association.name)
#
#         for association in relations3:
#             table = []
#             for user in users:
#                 user_annotations = []
#                 if RelationshipPredConcept.objects.filter(object_document_id=association.object_document_id, username=user,
#                                        name_space=user.name_space,
#                                        object_start=association.object_start, object_stop=association.object_stop,
#                                        subject_start=association.subject_start,
#                                        subject_stop=association.subject_stop,
#                                        concept_url = association.concept_url,name=association.name).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             fleiss_val = fleiss_kappa(table=table)
#             if fleiss_val > 0.6:
#                 RelationshipPredConcept.objects.create(object_document_id=association.object_document_id, username=user_iaa,
#                                        name_space=user_iaa.name_space,
#                                        object_start=association.object_start, object_stop=association.object_stop,
#                                        subject_start=association.subject_start,
#                                        subject_stop=association.subject_stop,insertion_time=Now(),
#                                        concept_url = association.concept_url,name=association.name)
#
#         for association in relations4:
#             table = []
#             for user in users:
#                 user_annotations = []
#                 if RelationshipObjConcept.objects.filter(subject_document_id=association.subject_document_id, username=user,
#                                        name_space=user.name_space,
#                                        predicate_start=association.predicate_start, predicate_stop=association.predicate_stop,
#                                        subject_start=association.subject_start,
#                                        subject_stop=association.subject_stop,
#                                        concept_url = association.concept_url,name=association.name).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             fleiss_val = fleiss_kappa(table=table)
#             if fleiss_val > 0.6:
#                 RelationshipObjConcept.objects.create(subject_document_id=association.subject_document_id, username=user_iaa,
#                                        name_space=user_iaa.name_space,
#                                        predicate_start=association.predicate_start, predicate_stop=association.predicate_stop,
#                                        subject_start=association.subject_start,
#                                        subject_stop=association.subject_stop,insertion_time=Now(),
#                                        concept_url = association.concept_url,name=association.name)
#
#         for association in relations5:
#             table = []
#             for user in users:
#                 user_annotations = []
#                 if RelationshipSubjMention.objects.filter(document_id=association.document_id, username=user,
#                                        name_space=user.name_space,
#                                        start=association.start, stop=association.stop,
#                                        predicate_concept_url=association.predicate_concept_url,predicate_name = association.predicate_name,
#                                        object_concept_url=association.object_concept_url,object_name = association.object_name,
#                                 ).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#
#             table.append(user_annotations)
#             fleiss_val = fleiss_kappa(table=table)
#             if fleiss_val > 0.6:
#                 RelationshipSubjMention.objects.create(document_id=association.document_id, username=user_iaa,
#                                        name_space=user_iaa.name_space,insertion_time=Now(),
#                                        start=association.start, stop=association.stop,
#                                        predicate_concept_url=association.predicate_concept_url,predicate_name = association.predicate_name,
#                                        object_concept_url=association.object_concept_url,object_name = association.object_name)
#
#
#
#         for association in relations6:
#             table = []
#             for user in users:
#                 user_annotations = []
#                 if RelationshipObjMention.objects.filter(document_id=association.document_id, username=user,
#                                        name_space=user.name_space,
#                                        start=association.start, stop=association.stop,
#                                        predicate_concept_url=association.predicate_concept_url,predicate_name = association.predicate_name,
#                                        subject_concept_url=association.subject_concept_url,subject_name = association.subject_name).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             fleiss_val = fleiss_kappa(table=table)
#             if fleiss_val > 0.6:
#                 RelationshipObjMention.objects.create(document_id=association.document_id, username=user_iaa,
#                                        name_space=user_iaa.name_space,insertion_time=Now(),
#                                        start=association.start, stop=association.stop,
#                                        predicate_concept_url=association.predicate_concept_url,predicate_name = association.predicate_name,
#                                        subject_concept_url=association.subject_concept_url,subject_name = association.subject_name)
#
#         for association in relations7:
#             table = []
#             for user in users:
#                 user_annotations = []
#                 if RelationshipPredMention.objects.filter(document_id=association.document_id, username=user,
#                                        name_space=user.name_space,
#                                        start=association.start, stop=association.stop,
#                                        object_concept_url=association.object_concept_url,object_name = association.object_name,
#                                        subject_concept_url=association.subject_concept_url,subject_name = association.subject_name
#                                 ).exists():
#                     user_annotations.append(1)
#                 else:
#                     user_annotations.append(0)
#             table.append(user_annotations)
#             fleiss_val = fleiss_kappa(table=table)
#             if fleiss_val > 0.6:
#                 RelationshipPredMention.objects.create(document_id=association.document_id, username=user_iaa,
#                                        name_space=user_iaa.name_space,
#                                        start=association.start, stop=association.stop,insertion_time=Now(),
#                                        object_concept_url=association.object_concept_url,object_name = association.object_name,
#                                        subject_concept_url=association.subject_concept_url,subject_name = association.subject_name)


def update_iaa_agreement(document):

    name_space = NameSpace.objects.get(name_space='Human')
    user_iaa = User.objects.get(username='IAA-Inter Annotator Agreement', name_space=name_space)

    update_relationships_agreement_majority(document)
    update_assertions_agreement_majority(document)
    update_concepts_agreement_majority(document)
    update_labels_agreement_majority(document)
    update_mentions_agreement_majority(document)



