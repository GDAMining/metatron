
from RelAnno_App.models import *
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
from RelAnno_App.upload.configure import *

from django.db import transaction
from django.http import JsonResponse
from datetime import datetime, timezone
from django.db import connection
import json
import os
from RelAnno_App.models import *
from django.http import HttpResponse

def compute_relationship_area_global(distinct_areas,documents,docs,name_space):

    json_doc = {}
    json_doc['subject'] = {}
    json_doc['predicate'] = {}
    json_doc['object'] = {}
    json_doc['global'] = {}
    for area in distinct_areas:
        json_doc['global'][area] = {}
        json_doc['subject'][area] = {}
        json_doc['predicate'][area] = {}
        json_doc['object'][area] = {}
        json_doc['global'][area]['count'] = 0
        json_doc['subject'][area]['count'] = 0
        json_doc['predicate'][area]['count'] = 0
        json_doc['object'][area]['count'] = 0
        area_obj = SemanticArea.objects.get(name=area)
        links = Link.objects.filter(subject_document_id__in=docs, name_space=name_space)
        rels1 = RelationshipSubjMention.objects.filter(document_id__in=documents, name_space=name_space)
        rels2 = RelationshipPredMention.objects.filter(document_id__in=documents, name_space=name_space)
        rels3 = RelationshipObjMention.objects.filter(document_id__in=documents, name_space=name_space)
        rels4 = RelationshipSubjConcept.objects.filter(object_document_id__in=docs, name_space=name_space)
        rels5 = RelationshipPredConcept.objects.filter(subject_document_id__in=docs, name_space=name_space)
        rels6 = RelationshipObjConcept.objects.filter(subject_document_id__in=docs, name_space=name_space)
        rels7= CreateFact.objects.filter(document_id__in=documents, name_space=name_space)
        for link in rels7:
            concept_s = Concept.objects.get(concept_url = link.subject_concept_url)
            concept_o = Concept.objects.get(concept_url = link.object_concept_url)
            concept_p = Concept.objects.get(concept_url = link.predicate_concept_url)
            if HasArea.objects.filter(concept_url = concept_p, name= area_obj).exists():
                json_doc['predicate'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1
                if concept_p.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept_p.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept_p.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_o, name= area_obj).exists():
                json_doc['global'][area]['count'] += 1
                json_doc['object'][area]['count'] += 1
                if concept_o.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept_o.concept_name] += 1
                else:
                    json_doc['object'][area][concept_o.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_s, name= area_obj).exists():
                json_doc['global'][area]['count'] += 1
                json_doc['subject'][area]['count'] += 1
                if concept_s.concept_name in json_doc['subject'][area].keys() :
                    json_doc['subject'][area][concept_s.concept_name] += 1
                else:
                    json_doc['subject'][area][concept_s.concept_name] = 1

        for link in rels6:
            d = Document.objects.get(document_id=link.subject_document_id)
            mp = Mention.objects.get(document_id=d, start=link.predicate_start, stop=link.predicate_stop)
            ms = Mention.objects.get(document_id=d, start=link.subject_start, stop=link.subject_stop)
            concept = link.concept_url
            ass_s = Associate.objects.filter(document_id=d, start=ms, stop=ms.stop, name=area_obj,username = link.username)
            ass_p = Associate.objects.filter(document_id=d, start=mp, stop=mp.stop, name=area_obj,username = link.username)
            json_doc['predicate'][area]['count'] += ass_p.count()
            json_doc['subject'][area]['count'] += ass_s.count()
            for a in ass_p:
                concepto = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concepto.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concepto.concept_name] += 1
                else:
                    json_doc['predicate'][area][concepto.concept_name] = 1
            for a in ass_s:
                concepts = a.concept_url
                json_doc['global'][area]['count'] += 1
                if concepts.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concepts.concept_name] += 1
                else:
                    json_doc['subject'][area][concepts.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept, name= area_obj).exists():
                json_doc['object'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1
                if concept.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept.concept_name] += 1
                else:
                    json_doc['object'][area][concept.concept_name] = 1

        for link in rels5:
            d = Document.objects.get(document_id=link.object_document_id)
            mo = Mention.objects.get(document_id=d, start=link.object_start, stop=link.object_stop)
            ms = Mention.objects.get(document_id=d, start=link.subject_start, stop=link.subject_stop)
            concept = link.concept_url
            ass_s = Associate.objects.filter(document_id=d, start=ms, stop=ms.stop, name=area_obj,username = link.username)
            ass_o = Associate.objects.filter(document_id=d, start=mo, stop=mo.stop, name=area_obj,username = link.username)
            json_doc['object'][area]['count'] += ass_o.count()
            json_doc['subject'][area]['count'] += ass_s.count()
            for a in ass_o:
                concepto = a.concept_url
                json_doc['global'][area]['count'] += 1
                if concepto.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concepto.concept_name] += 1
                else:
                    json_doc['object'][area][concepto.concept_name] = 1
            for a in ass_s:
                concepts = a.concept_url
                json_doc['global'][area]['count'] += 1
                if concepts.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concepts.concept_name] += 1
                else:
                    json_doc['subject'][area][concepts.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept, name= area_obj).exists():
                json_doc['predicate'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1
                if concept.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept.concept_name] = 1
        for link in rels4:
            d = Document.objects.get(document_id=link.object_document_id)
            mo = Mention.objects.get(document_id=d, start=link.object_start, stop=link.object_stop)
            mp = Mention.objects.get(document_id=d, start=link.predicate_start, stop=link.predicate_stop)
            concept = link.concept_url
            ass_p = Associate.objects.filter(document_id=d, start=mp, stop=mp.stop, name=area_obj,username = link.username)
            ass_o = Associate.objects.filter(document_id=d, start=mo, stop=mo.stop, name=area_obj,username = link.username)
            json_doc['object'][area]['count'] += ass_o.count()
            json_doc['predicate'][area]['count'] += ass_p.count()
            for a in ass_o:
                concepto = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concepto.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concepto.concept_name] += 1
                else:
                    json_doc['object'][area][concepto.concept_name] = 1
            for a in ass_p:
                conceptp = a.concept_url
                json_doc['global'][area]['count'] += 1
                if conceptp.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][conceptp.concept_name] += 1
                else:
                    json_doc['predicate'][area][conceptp.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept, name= area_obj).exists():
                json_doc['subject'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1
                if concept.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept.concept_name] += 1
                else:
                    json_doc['subject'][area][concept.concept_name] = 1

        for link in rels3:
            d = Document.objects.get(document_id=link.document_id_id)
            m = Mention.objects.get(document_id=d, start=link.start_id, stop=link.stop)
            concept_s = Concept.objects.get(concept_url=link.subject_concept_url)
            concept_p = Concept.objects.get(concept_url=link.predicate_concept_url)
            ass = Associate.objects.filter(document_id=d, start=m, stop=m.stop, name=area_obj,username = link.username)
            json_doc['object'][area]['count'] += ass.count()
            for a in ass:
                concept = a.concept_url
                json_doc['global'][area]['count'] += 1
                if concept.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept.concept_name] += 1
                else:
                    json_doc['object'][area][concept.concept_name] = 1
            if HasArea.objects.filter(concept_url=concept_p, name=area_obj).exists():
                json_doc['global'][area]['count'] += 1
                json_doc['subject'][area]['count'] += 1
                if concept_s.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept_s.concept_name] += 1
                else:
                    json_doc['subject'][area][concept_s.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_p, name= area_obj).exists():
                json_doc['global'][area]['count'] += 1
                json_doc['predicate'][area]['count'] += 1
                if concept_p.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept_p.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept_p.concept_name] = 1
        for link in rels2:
            d = Document.objects.get(document_id=link.document_id_id)
            m = Mention.objects.get(document_id=d, start=link.start_id, stop=link.stop)
            concept_s = Concept.objects.get(concept_url=link.subject_concept_url)
            concept_o = Concept.objects.get(concept_url=link.object_concept_url)
            ass = Associate.objects.filter(document_id=d, start=m, stop=m.stop, name=area_obj,username = link.username)
            json_doc['predicate'][area]['count'] += ass.count()
            for a in ass:
                json_doc['global'][area]['count'] += 1
                concept = a.concept_url
                if concept.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_s, name= area_obj).exists():
                json_doc['global'][area]['count'] += 1

                json_doc['subject'][area]['count'] += 1
                if concept_s.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept_s.concept_name] += 1
                else:
                    json_doc['subject'][area][concept_s.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_o, name= area_obj).exists():
                json_doc['global'][area]['count'] += 1

                json_doc['object'][area]['count'] += 1
                if concept_o.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept_o.concept_name] += 1
                else:
                    json_doc['object'][area][concept_o.concept_name] = 1
        for link in rels1:
            d = Document.objects.get(document_id=link.document_id_id)
            m = Mention.objects.get(document_id=d, start=link.start_id, stop=link.stop)
            concept_p = Concept.objects.get(concept_url=link.predicate_concept_url)
            concept_o = Concept.objects.get(concept_url=link.object_concept_url)
            ass = Associate.objects.filter(document_id=d, start=m, stop=m.stop, name=area_obj,username = link.username)
            json_doc['subject'][area]['count'] += ass.count()
            for a in ass:
                json_doc['global'][area]['count'] += 1

                concept = a.concept_url
                if concept.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept.concept_name] += 1
                else:
                    json_doc['subject'][area][concept.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_p, name= area_obj).exists():
                json_doc['global'][area]['count'] += 1
                json_doc['predicate'][area]['count'] += 1
                if concept_p.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept_p.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept_p.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_o, name= area_obj).exists():
                json_doc['global'][area]['count'] += 1
                json_doc['object'][area]['count'] += 1
                if concept_o.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept_o.concept_name] += 1
                else:
                    json_doc['object'][area][concept_o.concept_name] = 1

        for link in links:
            d = Document.objects.get(document_id=link.subject_document_id)
            sm = Mention.objects.get(document_id=d, start=link.subject_start, stop=link.subject_stop)
            pm = Mention.objects.get(document_id=d, start=link.predicate_start, stop=link.predicate_stop)
            om = Mention.objects.get(document_id=d, start=link.object_start, stop=link.object_stop)
            ass_s = Associate.objects.filter(document_id=d, start=sm, stop=sm.stop, name=area_obj,username = link.username)
            ass_o = Associate.objects.filter(document_id=d, start=om, stop=om.stop, name=area_obj,username = link.username)
            ass_p = Associate.objects.filter(document_id=d, start=pm, stop=pm.stop, name=area_obj,username = link.username)
            json_doc['subject'][area]['count'] += ass_s.count()
            json_doc['object'][area]['count'] += ass_o.count()
            json_doc['predicate'][area]['count'] += ass_p.count()

            for a in ass_s:
                json_doc['global'][area]['count'] += 1
                concept = a.concept_url
                if concept.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept.concept_name] += 1
                else:
                    json_doc['subject'][area][concept.concept_name] = 1
            for a in ass_p:
                json_doc['global'][area]['count'] += 1
                concept = a.concept_url
                if concept.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept.concept_name] = 1
            for a in ass_o:
                json_doc['global'][area]['count'] += 1
                concept = a.concept_url
                if concept.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept.concept_name] += 1
                else:
                    json_doc['object'][area][concept.concept_name] = 1
    return json_doc



def compute_relationship_area_personal(distinct_areas,documents,docs,user,name_space):
    json_doc = {}
    json_doc['subject'] = {}
    json_doc['global'] = {}
    json_doc['predicate'] = {}
    json_doc['object'] = {}
    for area in distinct_areas:
        json_doc['global'][area] = {}
        json_doc['subject'][area] = {}
        json_doc['predicate'][area] = {}
        json_doc['object'][area] = {}
        json_doc['global'][area]['count'] = 0
        json_doc['subject'][area]['count'] = 0
        json_doc['predicate'][area]['count'] = 0
        json_doc['object'][area]['count'] = 0
        area_obj = SemanticArea.objects.get(name=area)
        links = Link.objects.filter(subject_document_id__in=docs, name_space=name_space, username=user,
                                    )
        rels1 = RelationshipSubjMention.objects.filter(document_id__in=documents, name_space=name_space,
                                                       username=user)
        rels2 = RelationshipPredMention.objects.filter(document_id__in=documents, name_space=name_space,
                                                       username=user)
        rels3 = RelationshipObjMention.objects.filter(document_id__in=documents, name_space=name_space,
                                                      username=user)
        rels4 = RelationshipSubjConcept.objects.filter(object_document_id__in=docs, name_space=name_space,
                                                       username=user)
        rels5 = RelationshipPredConcept.objects.filter(subject_document_id__in=docs, name_space=name_space,
                                                       username=user)
        rels6 = RelationshipObjConcept.objects.filter(subject_document_id__in=docs, name_space=name_space,
                                                      username=user)
        rels7 = CreateFact.objects.filter(document_id__in=documents, name_space=name_space,username=user)
        for link in rels7:
            concept_s = Concept.objects.get(concept_url=link.subject_concept_url)
            concept_o = Concept.objects.get(concept_url=link.object_concept_url)
            concept_p = Concept.objects.get(concept_url=link.predicate_concept_url)

            if HasArea.objects.filter(concept_url=concept_p, name=area_obj).exists():
                json_doc['predicate'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_p.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept_p.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept_p.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_o, name= area_obj).exists():
                json_doc['object'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_o.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept_o.concept_name] += 1
                else:
                    json_doc['object'][area][concept_o.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_s, name= area_obj).exists():
                json_doc['subject'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_s.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept_s.concept_name] += 1
                else:
                    json_doc['subject'][area][concept_s.concept_name] = 1

        for link in rels6:
            d = Document.objects.get(document_id=link.subject_document_id)
            mp = Mention.objects.get(document_id=d, start=link.predicate_start, stop=link.predicate_stop)
            ms = Mention.objects.get(document_id=d, start=link.subject_start, stop=link.subject_stop)
            concept = link.concept_url
            ass_s = Associate.objects.filter(document_id=d, start=ms, stop=ms.stop, name=area_obj,username = link.username)
            ass_p = Associate.objects.filter(document_id=d, start=mp, stop=mp.stop, name=area_obj,username = link.username)
            json_doc['subject'][area]['count'] += ass_s.count()
            json_doc['predicate'][area]['count'] += ass_p.count()

            for a in ass_p:
                concepto = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concepto.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concepto.concept_name] += 1
                else:
                    json_doc['predicate'][area][concepto.concept_name] = 1
            for a in ass_s:
                json_doc['global'][area]['count'] += 1

                concepts = a.concept_url
                if concepts.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concepts.concept_name] += 1
                else:
                    json_doc['subject'][area][concepts.concept_name] = 1

            if HasArea.objects.filter(concept_url = concept, name= area_obj).exists():
                json_doc['object'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept.concept_name] += 1
                else:
                    json_doc['object'][area][concept.concept_name] = 1

        for link in rels5:
            d = Document.objects.get(document_id=link.object_document_id)
            mo = Mention.objects.get(document_id=d, start=link.object_start, stop=link.object_stop)
            ms = Mention.objects.get(document_id=d, start=link.subject_start, stop=link.subject_stop)
            concept = link.concept_url
            ass_s = Associate.objects.filter(document_id=d, start=ms, username=user, stop=ms.stop, name=area_obj)
            ass_o = Associate.objects.filter(document_id=d, start=mo, username=user, stop=mo.stop, name=area_obj)
            json_doc['object'][area]['count'] += ass_o.count()
            json_doc['subject'][area]['count'] += ass_s.count()
            for a in ass_o:
                json_doc['global'][area]['count'] += 1

                concepto = a.concept_url
                if concepto.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concepto.concept_name] += 1
                else:
                    json_doc['object'][area][concepto.concept_name] = 1
            for a in ass_s:
                concepts = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concepts.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concepts.concept_name] += 1
                else:
                    json_doc['subject'][area][concepts.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept, name= area_obj).exists():
                json_doc['predicate'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept.concept_name] = 1
        for link in rels4:
            d = Document.objects.get(document_id=link.object_document_id)
            mo = Mention.objects.get(document_id=d, start=link.object_start, stop=link.object_stop)
            mp = Mention.objects.get(document_id=d, start=link.predicate_start, stop=link.predicate_stop)
            concept = link.concept_url
            ass_p = Associate.objects.filter(document_id=d, start=mp, username=user, stop=mp.stop, name=area_obj)
            ass_o = Associate.objects.filter(document_id=d, start=mo, username=user, stop=mo.stop, name=area_obj)
            json_doc['object'][area]['count'] += ass_o.count()
            json_doc['predicate'][area]['count'] += ass_p.count()
            for a in ass_o:
                concepto = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concepto.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concepto.concept_name] += 1
                else:
                    json_doc['object'][area][concepto.concept_name] = 1
            for a in ass_p:
                conceptp = a.concept_url
                json_doc['global'][area]['count'] += 1

                if conceptp.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][conceptp.concept_name] += 1
                else:
                    json_doc['predicate'][area][conceptp.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept, name= area_obj).exists():
                json_doc['subject'][area]['count'] += 1
                if concept.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept.concept_name] += 1
                else:
                    json_doc['subject'][area][concept.concept_name] = 1

        for link in rels3:
            d = Document.objects.get(document_id=link.document_id_id)
            m = Mention.objects.get(document_id=d, start=link.start_id, stop=link.stop)
            concept_s = Concept.objects.get(concept_url=link.subject_concept_url)
            concept_p = Concept.objects.get(concept_url=link.predicate_concept_url)
            ass = Associate.objects.filter(document_id=d, username=user, start=m, stop=m.stop, name=area_obj)
            json_doc['object'][area]['count'] += ass.count()
            for a in ass:
                concept = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concept.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept.concept_name] += 1
                else:
                    json_doc['object'][area][concept.concept_name] = 1

            if HasArea.objects.filter(concept_url = concept_s, name= area_obj).exists():
                json_doc['subject'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_s.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept_s.concept_name] += 1
                else:
                    json_doc['subject'][area][concept_s.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_p, name= area_obj).exists():
                json_doc['predicate'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_p.concept_name in json_doc['predicate'][area].keys() :
                    json_doc['predicate'][area][concept_p.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept_p.concept_name] = 1
        for link in rels2:
            d = Document.objects.get(document_id=link.document_id_id)
            m = Mention.objects.get(document_id=d, start=link.start_id, stop=link.stop)
            concept_s = Concept.objects.get(concept_url=link.subject_concept_url)
            concept_o = Concept.objects.get(concept_url=link.object_concept_url)
            ass = Associate.objects.filter(document_id=d, username=user, start=m, stop=m.stop, name=area_obj)
            json_doc['predicate'][area]['count'] += ass.count()
            for a in ass:
                concept = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concept.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_s, name= area_obj).exists():
                json_doc['subject'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_s.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept_s.concept_name] += 1
                else:
                    json_doc['subject'][area][concept_s.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_o, name= area_obj).exists():
                json_doc['object'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_o.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept_o.concept_name] += 1
                else:
                    json_doc['object'][area][concept_o.concept_name] = 1
        for link in rels1:
            d = Document.objects.get(document_id=link.document_id_id)
            m = Mention.objects.get(document_id=d, start=link.start_id, stop=link.stop)
            concept_p = Concept.objects.get(concept_url=link.predicate_concept_url)
            concept_o = Concept.objects.get(concept_url=link.object_concept_url)
            ass = Associate.objects.filter(document_id=d, username=user, start=m, stop=m.stop, name=area_obj)
            json_doc['subject'][area]['count'] += ass.count()
            for a in ass:
                json_doc['global'][area]['count'] += 1

                concept = a.concept_url
                if concept.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept.concept_name] += 1
                else:
                    json_doc['subject'][area][concept.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_p, name= area_obj).exists():
                json_doc['predicate'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_p.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept_p.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept_p.concept_name] = 1
            if HasArea.objects.filter(concept_url = concept_o, name= area_obj).exists():
                json_doc['object'][area]['count'] += 1
                json_doc['global'][area]['count'] += 1

                if concept_o.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept_o.concept_name] += 1
                else:
                    json_doc['object'][area][concept_o.concept_name] = 1

        for link in links:
            d = Document.objects.get(document_id=link.subject_document_id)
            sm = Mention.objects.get(document_id=d, start=link.subject_start, stop=link.subject_stop)
            pm = Mention.objects.get(document_id=d, start=link.predicate_start, stop=link.predicate_stop)
            om = Mention.objects.get(document_id=d, start=link.object_start, stop=link.object_stop)
            ass_s = Associate.objects.filter(document_id=d, username=user, start=sm, stop=sm.stop, name=area_obj)
            ass_o = Associate.objects.filter(document_id=d, username=user, start=om, stop=om.stop, name=area_obj)
            ass_p = Associate.objects.filter(document_id=d, username=user, start=pm, stop=pm.stop, name=area_obj)
            json_doc['subject'][area]['count'] += ass_s.count()
            json_doc['object'][area]['count'] += ass_o.count()
            json_doc['predicate'][area]['count'] += ass_p.count()

            for a in ass_s:
                concept = a.concept_url
                json_doc['global'][area]['count'] += 1
                if concept.concept_name in json_doc['subject'][area].keys():
                    json_doc['subject'][area][concept.concept_name] += 1
                else:
                    json_doc['subject'][area][concept.concept_name] = 1
            for a in ass_p:
                concept = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concept.concept_name in json_doc['predicate'][area].keys():
                    json_doc['predicate'][area][concept.concept_name] += 1
                else:
                    json_doc['predicate'][area][concept.concept_name] = 1
            for a in ass_o:
                concept = a.concept_url
                json_doc['global'][area]['count'] += 1

                if concept.concept_name in json_doc['object'][area].keys():
                    json_doc['object'][area][concept.concept_name] += 1
                else:
                    json_doc['object'][area][concept.concept_name] = 1
    return json_doc