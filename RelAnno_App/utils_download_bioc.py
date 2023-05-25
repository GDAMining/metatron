from RelAnno_App.utils import *
from RelAnno_App.upload.configure import *
import bioc
from datetime import date
import json
from RelAnno_App.models import *
from django.http import HttpResponse
from lxml import etree
from lxml.etree import tostring
from bioc import biocxml


def create_bioc_xml(annotation,annotators,batch,user,name_space,document,collection):
    print(annotation)
    try:
        collection_s = Collection.objects.get(collection_id=collection)
        name_space = NameSpace.objects.get(name_space=name_space)
        users_list = []
        if annotators != 'all':
            # solo utente login
            user = annotators

            users_list = User.objects.filter(username=user, name_space=name_space)
        else:


            users_list = ShareCollection.objects.filter(collection_id=collection_s, name_space=name_space)
            users_list = [u.username for u in users_list]

        if document != 'all':
            documents = Document.objects.filter(document_id=document)
        else:
            if batch == 'all':

                documents = Document.objects.filter(collection_id=collection_s)

            else:
                documents = Document.objects.filter(collection_id=collection_s, batch=batch)
        root = etree.Element("collection")
        source = etree.Element("source")
        source.text = "METATRON"

        root.append(source)
        infon_type = etree.Element("infon")
        infon_type.set("key", "collection_name")
        infon_type.text =collection_s.name
        root.append(infon_type)

        today = str(date.today())
        date_str = etree.Element("date")
        date_str.text = today
        root.append(date_str)

        key = etree.Element("key")
        root.append(key)
        for u in users_list:
            for document in documents:
                d = etree.Element("document")
                doc_id = etree.Element("id")

                user = etree.Element("infon")
                user.set('key','annotator')
                user.text = u.username
                d.append(user)
                doc_id.text = document.document_id
                d.append(doc_id)
                root.append(d)
                json_val = from_start_stop_foreach_key(document.document_content)
                id_count = 0
                if annotation == 'mentions':
                    annotations = Annotate.objects.filter(document_id=document, username__in=users_list)
                elif annotation == 'concepts':
                    annotations = Associate.objects.filter(document_id=document,username__in=users_list)
                elif annotation == 'relationships':
                    mentions = Annotate.objects.filter(document_id=document, username__in=users_list)
                    associations = Associate.objects.filter(document_id=document,username__in=users_list)
                    annotations = {}
                    annotations['link'] = Link.objects.filter(subject_document_id=document.document_id,username__in=users_list)
                    annotations['relationship_subj_mention'] = RelationshipSubjMention.objects.filter(document_id=document,username__in=users_list)
                    annotations['relationship_subj_concept'] = RelationshipSubjConcept.objects.filter(object_document_id=document.document_id,username__in=users_list)
                    annotations['relationship_pred_mention'] = RelationshipPredMention.objects.filter(document_id=document,username__in=users_list)
                    annotations['relationship_pred_concept'] = RelationshipPredConcept.objects.filter(subject_document_id=document.document_id,username__in=users_list)
                    annotations['relationship_obj_mention'] = RelationshipObjMention.objects.filter(document_id=document,username__in=users_list)
                    annotations['relationship_obj_concept'] = RelationshipObjConcept.objects.filter(subject_document_id=document.document_id,username__in=users_list)


                for k,v in document.document_content.items():
                    passage_k = etree.Element("passage")

                    d.append(passage_k)
                    offset = etree.Element("offset")
                    json_key = json_val['key'][k]
                    offset.text = str(json_key['start'])
                    text = etree.Element("text")
                    text.text = str(k)
                    passage_k.append(text)
                    passage_k.append(offset)
                    infon_type = etree.Element("infon")
                    infon_type.set("key","type")
                    infon_type.text = "key:"+str(k)
                    passage_k.append(infon_type)
                    relations = []
                    if annotation == 'mentions':
                        annotations_k, id_count = get_annotations(k, 'key', document.document_content, None,
                                                                  annotations, None, id_count)
                    elif annotation == 'concepts':
                        annotations_k, id_count = get_annotations(k, 'key', document.document_content,
                                                                  annotations,None, None, id_count)
                    elif annotation == 'relationships':
                        annotations_k, id_count = get_annotations(k, 'key', document.document_content, associations,mentions,
                                                                   annotations, id_count)
                    for a in annotations_k:
                        passage_k.append(a)

                    passage_v = etree.Element("passage")
                    d.append(passage_v)
                    if isinstance(v,list):
                        v = ','.join(v)
                    # user = etree.Element("annotator")
                    # user.text = u.username
                    # passage_k.append(user)
                    offset = etree.Element("offset")
                    json_key = json_val['value'][k]
                    offset.text = str(json_key['start'])
                    text = etree.Element("text")
                    text.text = str(v)
                    passage_v.append(text)
                    passage_v.append(offset)
                    relations = []

                    infon_type = etree.Element("infon")
                    infon_type.set("key","type")


                    infon_type.text = "value:"+str(v)
                    passage_v.append(infon_type)
                    if annotation == 'mentions':
                        annotations_v, id_count = get_annotations(k, 'value', document.document_content, None,
                                                                  annotations, None, id_count)
                    elif annotation == 'concepts':
                        annotations_v, id_count = get_annotations(k, 'value', document.document_content,
                                                                  annotations,None, None, id_count)
                    elif annotation == 'relationships':
                        annotations_v, id_count = get_annotations(k, 'value', document.document_content,
                                                                  associations,mentions, annotations, id_count)

                    for a in annotations_v:
                        passage_k.append(a)

            # root.append(d)
        return tostring(root,encoding='UTF-8',pretty_print=True,xml_declaration=True,doctype="<!DOCTYPE collection SYSTEM 'BioC.dtd'>")

    except Exception as e:
        print(e)


def get_annotations(key, type, content, annotations=None, mentions=None, relations=None, id_count = 0):
    if annotations is None:
        annotations = []
    json_val = from_start_stop_foreach_key(content)
    json_v = json_val[type][key]
    start,stop = json_v['start'],json_v['stop']
    annotations_to_ret = []
    rel_count = 0
    # if key == 'abstract' and type == 'value':
    #     breakpoint()
    if annotations is not None:
        annotations = [a for a in annotations if a.start_id >=start and a.stop <= stop]

        for a in annotations:
            mention = Mention.objects.get(document_id = a.document_id,start = a.start_id, stop = a.stop)

            annotation = etree.Element("annotation")
            annotation.set("id", str(id_count))
            id_count += 1
            concept_url = a.concept_url_id
            area = a.name_id
            offset = etree.Element("location")
            offset.set("offset",str(a.start_id))
            offset.set("length",str(a.stop - a.start_id +1))

            infon_type_area = etree.Element("infon")
            infon_type_area.set('key',area)
            infon_type_area.text = concept_url
            infon_type = etree.Element("infon")
            infon_type.set('key',"type")
            infon_type.text = area
            text = etree.Element("text")
            text.text = mention.mention_text
            annotation.append(infon_type_area)
            annotation.append(infon_type)
            annotation.append(offset)
            annotation.append(text)
            annotations_to_ret.append(annotation)

    if mentions is not None:
        mentions = [a for a in mentions if a.start_id >=start and a.stop <= stop]

        for a in mentions:
            mention = Mention.objects.get(document_id=a.document_id, start=a.start_id, stop=a.stop)

            annotation = etree.Element("annotation")
            annotation.set("id", str(id_count))
            id_count += 1
            offset = etree.Element("location")
            offset.set("offset", str(a.start_id))
            offset.set("length", str(a.stop - a.start_id + 1))


            text = etree.Element("text")
            text.text = mention.mention_text
            annotation.append(offset)
            annotation.append(text)
            annotations_to_ret.append(annotation)

    if relations is not None:
        # costruisco una mappa

        map = {}
        map_count = 0
        mentions = [a for a in mentions if a.start_id >= start and a.stop <= stop]
        annotations = [a for a in annotations if a.start_id >=start and a.stop <= stop]
        for annotation in annotations:
            sta = annotation.start_id
            sto = annotation.stop
            key = str(sta)+':'+str(sto)
            if key not in list(map.keys()):
                map[key] = map_count
                map[str(map_count)] = [annotation.name_id,annotation.concept_url_id]
                map_count += 1

        for annotation in mentions:
            sta = annotation.start_id
            sto = annotation.stop
            # qui ci entro se c'è solo mention, quindi senza associazione con concetto
            key = str(sta) + ':' + str(sto)
            if key not in list(map.keys()):
                map[key] = map_count
                map[str(map_count)] = ['mention']
                map_count += 1



        link_rel = relations['link']
        rel_subj_ment = relations['relationship_subj_mention']
        rel_subj_concept = relations['relationship_subj_concept']
        rel_pred_ment = relations['relationship_pred_mention']
        rel_pred_concept = relations['relationship_pred_concept']
        rel_obj_ment = relations['relationship_obj_mention']
        rel_obj_concept = relations['relationship_obj_concept']
        # for a in link_rel:
        #     print(a.subject_start, a.subject_stop)
        #     print(a.predicate_start, a.predicate_stop)
        #     print(a.object_start, a.object_stop)
        link_rel = [a for a in link_rel if a.subject_start >=start and a.subject_stop <= stop and a.object_start >=start and a.object_stop <= stop and a.predicate_start >=start and a.predicate_stop <= stop]
        rel_subj_concept = [a for a in rel_subj_concept if  a.object_start >=start and a.object_stop <= stop and a.predicate_start >=start and a.predicate_stop <= stop]
        rel_obj_concept = [a for a in rel_obj_concept if a.subject_start >=start and a.subject_stop <= stop  and a.predicate_start >=start and a.predicate_stop <= stop]
        rel_pred_concept = [a for a in rel_pred_concept if a.subject_start >=start and a.subject_stop <= stop and a.object_start >=start and a.object_stop <= stop]
        rel_subj_ment = [a for a in rel_subj_ment if a.start_id >=start and a.stop <= stop]
        rel_pred_ment = [a for a in rel_pred_ment if a.start_id >=start and a.stop <= stop]
        rel_obj_ment = [a for a in rel_obj_ment if a.start_id >=start and a.stop <= stop]

        for a in link_rel:
            annotation = etree.Element("relation")
            annotation.set("id", str(rel_count))
            rel_count += 1

            skey=str(a.subject_start)+':'+str(a.subject_stop)
            annotation_id_subj = map[skey]


            pkey=str(a.predicate_start)+':'+str(a.predicate_stop)
            annotation_id_pred = map[pkey]
            okey=str(a.object_start)+':'+str(a.object_stop)
            annotation_id_obj = map[okey]

            subject = etree.Element("node")
            annotation.append(subject)

            s_role = map[str(annotation_id_subj)][0] if map[str(annotation_id_subj)][1] != 'mention' else 'subject'
            subject.set("role",s_role)
            subject.set("refid",str(annotation_id_subj))

            if s_role != 'subject':
                infon_type = etree.Element("infon")
                infon_type.set('key',s_role)
                infon_type.text = map[str(annotation_id_subj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', s_role)
                infon_type.text = 'mention:subject'
                annotation.append(infon_type)

            predicate = etree.Element("node")
            annotation.append(predicate)

            p_role = map[str(annotation_id_pred)][0] if map[str(annotation_id_pred)][0] != 'mention' else 'predicate'
            predicate.set("role",p_role)
            predicate.set("refid",str(annotation_id_pred))
            if p_role != 'predicate':
                infon_type = etree.Element("infon")
                infon_type.set('key',p_role)
                infon_type.text = map[str(annotation_id_pred)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', p_role)
                infon_type.text = 'mention:predicate'
                annotation.append(infon_type)

            object = etree.Element("node")
            annotation.append(object)
            o_role = map[str(annotation_id_obj)][0] if map[str(annotation_id_obj)][0] != 'mention' else 'object'

            object.set("role",o_role)
            object.set("refid",str(annotation_id_obj))
            if o_role != 'object':
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = map[str(annotation_id_obj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = 'mention:object'
                annotation.append(infon_type)


            annotations_to_ret.append(annotation)


        for a in rel_subj_concept:
            annotation = etree.Element("relation")
            annotation.set("id", str(rel_count))
            rel_count += 1

            # skey=str(a.subject_start)+':'+str(a.subject_stop)
            # annotation_id_subj = map[skey]


            pkey=str(a.predicate_start)+':'+str(a.predicate_stop)
            annotation_id_pred = map[pkey]
            okey=str(a.object_start)+':'+str(a.object_stop)
            annotation_id_obj = map[okey]

            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "subject"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.name_id
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.name_id)
            infon_url.text = a.concept_url_id
            annotation.append(infon_url)

            # subject = etree.Element("node")
            # annotation.append(subject)
            #
            # s_role = map[str(annotation_id_subj)][0] if map[str(annotation_id_subj)][1] != 'mention' else 'subject'
            # subject.set("role",s_role)
            # subject.set("refid",str(annotation_id_subj))
            #
            # if s_role != 'subject':
            #     infon_type = etree.Element("infon")
            #     infon_type.set('key',s_role)
            #     infon_type.text = map[str(annotation_id_subj)][1]
            #     annotation.append(infon_type)
            # else:
            #     infon_type = etree.Element("infon")
            #     infon_type.set('key', s_role)
            #     infon_type.text = 'mention:subject'
            #     annotation.append(infon_type)

            predicate = etree.Element("node")
            annotation.append(predicate)

            p_role = map[str(annotation_id_pred)][0] if map[str(annotation_id_pred)][0] != 'mention' else 'predicate'
            predicate.set("role",p_role)
            predicate.set("refid",str(annotation_id_pred))
            if p_role != 'predicate':
                infon_type = etree.Element("infon")
                infon_type.set('key',p_role)
                infon_type.text = map[str(annotation_id_pred)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', p_role)
                infon_type.text = 'mention:predicate'
                annotation.append(infon_type)

            object = etree.Element("node")
            annotation.append(object)
            o_role = map[str(annotation_id_obj)][0] if map[str(annotation_id_obj)][0] != 'mention' else 'object'

            object.set("role",o_role)
            object.set("refid",str(annotation_id_obj))
            if o_role != 'object':
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = map[str(annotation_id_obj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = 'mention:object'
                annotation.append(infon_type)


            annotations_to_ret.append(annotation)


        for a in rel_obj_concept:
            annotation = etree.Element("relation")
            annotation.set("id", str(rel_count))
            rel_count += 1

            skey=str(a.subject_start)+':'+str(a.subject_stop)
            annotation_id_subj = map[skey]
            pkey=str(a.predicate_start)+':'+str(a.predicate_stop)
            annotation_id_pred = map[pkey]
            # okey=str(a.object_start)+':'+str(a.object_stop)
            # annotation_id_obj = map[okey]



            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "object"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.name_id
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.name_id)
            infon_url.text = a.concept_url_id
            annotation.append(infon_url)


            subject = etree.Element("node")
            annotation.append(subject)

            s_role = map[str(annotation_id_subj)][0] if map[str(annotation_id_subj)][1] != 'mention' else 'subject'
            subject.set("role",s_role)
            subject.set("refid",str(annotation_id_subj))

            if s_role != 'subject':
                infon_type = etree.Element("infon")
                infon_type.set('key',s_role)
                infon_type.text = map[str(annotation_id_subj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', s_role)
                infon_type.text = 'mention:subject'
                annotation.append(infon_type)

            predicate = etree.Element("node")
            annotation.append(predicate)

            p_role = map[str(annotation_id_pred)][0] if map[str(annotation_id_pred)][0] != 'mention' else 'predicate'
            predicate.set("role",p_role)
            predicate.set("refid",str(annotation_id_pred))
            if p_role != 'predicate':
                infon_type = etree.Element("infon")
                infon_type.set('key',p_role)
                infon_type.text = map[str(annotation_id_pred)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', p_role)
                infon_type.text = 'mention:predicate'
                annotation.append(infon_type)

            # object = etree.Element("node")
            # annotation.append(object)
            # o_role = map[str(annotation_id_obj)][0] if map[str(annotation_id_obj)][0] != 'mention' else 'object'
            #
            # object.set("role",o_role)
            # object.set("refid",str(annotation_id_obj))
            # if o_role != 'object':
            #     infon_type = etree.Element("infon")
            #     infon_type.set('key', o_role)
            #     infon_type.text = map[str(annotation_id_obj)][1]
            #     annotation.append(infon_type)
            # else:
            #     infon_type = etree.Element("infon")
            #     infon_type.set('key', o_role)
            #     infon_type.text = 'mention:object'
            #     annotation.append(infon_type)


            annotations_to_ret.append(annotation)

        for a in rel_pred_concept:
            annotation = etree.Element("relation")
            annotation.set("id", str(rel_count))
            rel_count += 1

            skey=str(a.subject_start)+':'+str(a.subject_stop)
            annotation_id_subj = map[skey]
            # pkey=str(a.predicate_start)+':'+str(a.predicate_stop)
            # annotation_id_pred = map[pkey]
            okey=str(a.object_start)+':'+str(a.object_stop)
            annotation_id_obj = map[okey]



            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "predicate"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.name_id
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.name_id)
            infon_url.text = a.concept_url_id
            annotation.append(infon_url)


            subject = etree.Element("node")
            annotation.append(subject)

            s_role = map[str(annotation_id_subj)][0] if map[str(annotation_id_subj)][1] != 'mention' else 'subject'
            subject.set("role",s_role)
            subject.set("refid",str(annotation_id_subj))

            if s_role != 'subject':
                infon_type = etree.Element("infon")
                infon_type.set('key',s_role)
                infon_type.text = map[str(annotation_id_subj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', s_role)
                infon_type.text = 'mention:subject'
                annotation.append(infon_type)

            # predicate = etree.Element("node")
            # annotation.append(predicate)
            #
            # p_role = map[str(annotation_id_pred)][0] if map[str(annotation_id_pred)][0] != 'mention' else 'predicate'
            # predicate.set("role",p_role)
            # predicate.set("refid",str(annotation_id_pred))
            # if p_role != 'predicate':
            #     infon_type = etree.Element("infon")
            #     infon_type.set('key',p_role)
            #     infon_type.text = map[str(annotation_id_pred)][1]
            #     annotation.append(infon_type)
            # else:
            #     infon_type = etree.Element("infon")
            #     infon_type.set('key', p_role)
            #     infon_type.text = 'mention:predicate'
            #     annotation.append(infon_type)

            object = etree.Element("node")
            annotation.append(object)
            o_role = map[str(annotation_id_obj)][0] if map[str(annotation_id_obj)][0] != 'mention' else 'object'

            object.set("role",o_role)
            object.set("refid",str(annotation_id_obj))
            if o_role != 'object':
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = map[str(annotation_id_obj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = 'mention:object'
                annotation.append(infon_type)


            annotations_to_ret.append(annotation)

        for a in rel_subj_ment:
            annotation = etree.Element("relation")
            annotation.set("id", str(rel_count))
            rel_count += 1

            skey = str(a.start_id) + ':' + str(a.stop)
            annotation_id_subj = map[skey]
            subject = etree.Element("node")
            annotation.append(subject)

            s_role = map[str(annotation_id_subj)][0] if map[str(annotation_id_subj)][1] != 'mention' else 'subject'
            subject.set("role", s_role)
            subject.set("refid", str(annotation_id_subj))

            if s_role != 'subject':
                infon_type = etree.Element("infon")
                infon_type.set('key', s_role)
                infon_type.text = map[str(annotation_id_subj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', s_role)
                infon_type.text = 'mention:subject'
                annotation.append(infon_type)

            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "predicate"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.predicate_name
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.predicate_name)
            infon_url.text = a.predicate_concept_url
            annotation.append(infon_url)

            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "object"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.object_name
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.object_name)
            infon_url.text = a.object_concept_url
            annotation.append(infon_url)


            annotations_to_ret.append(annotation)

        for a in rel_obj_ment:
            annotation = etree.Element("relation")
            annotation.set("id", str(rel_count))
            rel_count += 1

            okey=str(a.start_id)+':'+str(a.stop)
            annotation_id_obj = map[okey]

            subject = etree.Element("node")
            annotation.append(subject)


            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "subject"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.subject_name
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.subject_name)
            infon_url.text = a.subject_concept_url
            annotation.append(infon_url)

            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "predicate"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.predicate_name
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.predicate_name)
            infon_url.text = a.predicate_concept_url
            annotation.append(infon_url)

            object = etree.Element("node")
            annotation.append(object)
            o_role = map[str(annotation_id_obj)][0] if map[str(annotation_id_obj)][0] != 'mention' else 'object'

            object.set("role",o_role)
            object.set("refid",str(annotation_id_obj))
            if o_role != 'object':
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = map[str(annotation_id_obj)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', o_role)
                infon_type.text = 'mention:object'
                annotation.append(infon_type)

            annotations_to_ret.append(annotation)

        for a in rel_pred_ment:
            annotation = etree.Element("relation")
            annotation.set("id", str(rel_count))
            rel_count += 1

            # skey = str(a.start_id) + ':' + str(a.stop)
            # annotation_id_subj = map[skey]
            pkey=str(a.start_id)+':'+str(a.stop)
            annotation_id_pred = map[pkey]
            # okey=str(a.object_start)+':'+str(a.object_stop)
            # annotation_id_obj = map[okey]



            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "subject"
            annotation.append(role)
            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.subject_name
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.subject_name)
            infon_url.text = a.subject_concept_url
            annotation.append(infon_url)


            predicate = etree.Element("node")
            annotation.append(predicate)

            p_role = map[str(annotation_id_pred)][0] if map[str(annotation_id_pred)][0] != 'mention' else 'predicate'
            predicate.set("role",p_role)
            predicate.set("refid",str(annotation_id_pred))
            if p_role != 'predicate':
                infon_type = etree.Element("infon")
                infon_type.set('key',p_role)
                infon_type.text = map[str(annotation_id_pred)][1]
                annotation.append(infon_type)
            else:
                infon_type = etree.Element("infon")
                infon_type.set('key', p_role)
                infon_type.text = 'mention:predicate'
                annotation.append(infon_type)



            role = etree.Element("infon")
            role.set('key', "type")
            role.text = "object"
            annotation.append(role)

            infon_type = etree.Element("infon")
            infon_type.set('key', "role")
            infon_type.text = a.object_name
            annotation.append(infon_type)

            infon_url = etree.Element("infon")
            infon_url.set('key', a.object_name)
            infon_url.text = a.object_concept_url
            annotation.append(infon_url)



            annotations_to_ret.append(annotation)

    return annotations_to_ret,id_count








def create_mentions_bioc_to_download(annotators,document_number,batch,user,name_space,document,collection_start,form='xml'):
    try:
        collection_start = Collection.objects.get(collection_id = collection_start)

        if annotators != 'all':
            # solo utente login
            users_list = User.objects.filter(username=user, name_space=name_space)
        else:


            users_list = ShareCollection.objects.filter(collection_id=collection_start, name_space=name_space)
            users_list = [u.username for u in users_list]

        if document_number == '0':
            documents = Document.objects.filter(document_id=document)
        else:
            if batch == 'all':

                documents = Document.objects.filter(collection_id=collection_start)

            else:
                documents = Document.objects.filter(collection_id=collection_start, batch=batch)

        writer = BioCXMLWriter()
        json_writer = BioCJSONWriter()
        writer.collection = BioCCollection()
        json_writer.collection = BioCCollection()
        collection = writer.collection
        collection1 = json_writer.collection
        today = str(date.today())
        collection.date = today
        collection1.date = today
        collection.source = collection_start.name

        # collection1.source = collection
        for u in users_list:
            for d in documents:

                document = BioCDocument()

                document.id = str(d.document_id)  # pubmed id
                document.put_infon('provenance', d.provenance)
                document.put_infon('language', d.language)
                document.put_infon('username', u.username)
                document.put_infon('batch', str(d.batch))
                positions = []
                count = 0
                mentions = Mention.objects.filter(language=d.language, document_id=d)
                bioc_annotations = []
                for mention in mentions:
                    annotations_objs = Annotate.objects.filter(username=u, start=mention, stop=mention.stop,
                                                               name_space=u.name_space, document_id=d)

                    for annotation_single in annotations_objs:
                        mention = Mention.objects.get(start=annotation_single.start_id, stop=annotation_single.stop,
                                                      document_id=d,
                                                      language=d.language)
                        bioc_ann = BioCAnnotation()
                        bioc_ann.id = 'mention_' + str(mention.start) + '_' + str(mention.stop)
                        json_start_stop_pos = return_start_stop_for_frontend(mention.start, mention.stop,
                                                                             d.document_content)
                        count = count + 1
                        loc_ann = BioCLocation()
                        loc_ann.offset = str(json_start_stop_pos['start'])
                        loc_ann.length = str(json_start_stop_pos['stop'] - json_start_stop_pos['start'] + 1)
                        positions.append(json_start_stop_pos['position'])
                        bioc_ann.add_location(loc_ann)
                        mention_text = mention.mention_text
                        mtext = re.sub('[^a-zA-Z0-9n\-_/\' ]+', '', mention_text)

                        bioc_ann.text = mtext
                        couple = (bioc_ann, json_start_stop_pos)
                        bioc_annotations.append(couple)
                for position in list(set(positions)):
                    passage = BioCPassage()
                    passage.put_infon('section', position)
                    # passage.text = d.document_content[position]

                    for bioc_annotation in bioc_annotations:
                        if bioc_annotation[1]['position'] == position:
                            passage.add_annotation(bioc_annotation[0])
                    document.add_passage(passage)
                    collection.add_document(document)
                    collection1.add_document(document)
                    print(writer)


    except Exception as e:
        print(e)
        return False

    else:
        print(writer)
        #
        # #os.remove(path1)
        if form == 'json':
            # os.remove(path1)
            return json_writer
        # # return True
        return writer

def create_concepts_bioc_to_download(annotators,document_number,batch,user,name_space,document,collection_start,form='xml'):
    try:
        collection_start = Collection.objects.get(collection_id = collection_start)

        if annotators != 'all':
            # solo utente login
            users_list = User.objects.filter(username=user, name_space=name_space)
        else:


            users_list = ShareCollection.objects.filter(collection_id=collection_start, name_space=name_space)
            users_list = [u.username for u in users_list]

        if document_number == '0':
            documents = Document.objects.filter(document_id=document)
        else:
            if batch == 'all':

                documents = Document.objects.filter(collection_id=collection_start)

            else:
                documents = Document.objects.filter(collection_id=collection_start, batch=batch)

        writer = BioCXMLWriter()
        json_writer = BioCJSONWriter()
        writer.collection = BioCCollection()
        json_writer.collection = BioCCollection()
        collection = writer.collection
        collection1 = json_writer.collection
        today = str(date.today())
        collection.date = today
        collection1.date = today
        collection.source = collection_start.name

        # collection1.source = collection
        for u in users_list:
            for d in documents:

                document = BioCDocument()

                document.id = str(d.document_id)  # pubmed id
                document.put_infon('provenance', d.provenance)
                document.put_infon('language', d.language)
                document.put_infon('username', u.username)
                document.put_infon('batch', str(d.batch))
                bioc_annotations = []
                positions = []
                mentions = Mention.objects.filter(language=d.language, document_id=d)
                for mention in mentions:
                    annotations_objs = Annotate.objects.filter(username=u, start=mention, stop=mention.stop,
                                                               name_space=u.name_space, document_id=d)

                    for annotation_single in annotations_objs:
                        associations = Associate.objects.filter(username=u, start=mention, stop=mention.stop,
                                                                name_space=u.name_space,
                                                                document_id=d)
                        mention = Mention.objects.get(start=annotation_single.start_id, stop=annotation_single.stop,
                                                      document_id=d,
                                                      language=d.language)

                        bioc_ann = BioCAnnotation()
                        bioc_ann.id = 'mention_' + str(mention.start) + '_' + str(mention.stop)
                        json_start_stop_pos = return_start_stop_for_frontend(mention.start, mention.stop,
                                                                             d.document_content)

                        loc_ann = BioCLocation()
                        loc_ann.offset = str(json_start_stop_pos['start'])
                        loc_ann.length = str(json_start_stop_pos['stop'] - json_start_stop_pos['start'] + 1)
                        positions.append(json_start_stop_pos['position'])
                        bioc_ann.add_location(loc_ann)
                        mention_text = mention.mention_text
                        mtext = re.sub('[^a-zA-Z0-9n\-_/\' ]+', '', mention_text)
                        count = 0
                        for association in associations:
                            concept = association.concept_url
                            area = association.name
                            bioc_ann.put_infon('concpet_url_' + str(count), concept.concept_url)
                            bioc_ann.put_infon('concpet_name_' + str(count), concept.concept_name)
                            bioc_ann.put_infon('concpet_area_' + str(count), area.name)

                        bioc_ann.text = mtext
                        couple = (bioc_ann, json_start_stop_pos)
                        bioc_annotations.append(couple)
                for position in list(set(positions)):
                    passage = BioCPassage()
                    passage.put_infon('section', position)
                    # passage.text = d.document_content[position]

                    for bioc_annotation in bioc_annotations:
                        if bioc_annotation[1]['position'] == position:
                            passage.add_annotation(bioc_annotation[0])
                    document.add_passage(passage)
                    collection.add_document(document)
                    collection1.add_document(document)
                    print(writer)


    except Exception as e:
        print(e)
        return False

    else:
        print(writer)
        #
        # #os.remove(path1)
        if form == 'json':
            # os.remove(path1)
            return json_writer
        # # return True
        return writer

def create_relationships_bioc_to_download(annotators,document_number,batch,user,name_space,document,collection_start,form='xml'):
    try:
        collection_start = Collection.objects.get(collection_id = collection_start)

        if annotators != 'all':
            # solo utente login
            users_list = User.objects.filter(username=user, name_space=name_space)
        else:


            users_list = ShareCollection.objects.filter(collection_id=collection_start, name_space=name_space)
            users_list = [u.username for u in users_list]

        if document_number == '0':
            documents = Document.objects.filter(document_id=document)
        else:
            if batch == 'all':

                documents = Document.objects.filter(collection_id=collection_start)

            else:
                documents = Document.objects.filter(collection_id=collection_start, batch=batch)

        writer = BioCXMLWriter()
        json_writer = BioCJSONWriter()
        writer.collection = BioCCollection()
        json_writer.collection = BioCCollection()
        collection = writer.collection
        collection1 = json_writer.collection
        today = str(date.today())
        collection.date = today
        collection1.date = today
        collection.source = collection_start.name

        # collection1.source = collection
        for u in users_list:
            for d in documents:

                document = BioCDocument()

                document.id = str(d.document_id)  # pubmed id
                document.put_infon('provenance', d.provenance)
                document.put_infon('language', d.language)
                document.put_infon('username', u.username)
                document.put_infon('batch', str(d.batch))
                bioc_annotations = []
                positions = []
                mentions = Mention.objects.filter(language=d.language, document_id=d)
                for mention in mentions:
                    annotations_objs = Annotate.objects.filter(username=u, start=mention, stop=mention.stop,
                                                               name_space=u.name_space, document_id=d)

                    for annotation_single in annotations_objs:
                        associations = Associate.objects.filter(username=u, start=mention, stop=mention.stop,
                                                                name_space=u.name_space,
                                                                document_id=d)
                        mention = Mention.objects.get(start=annotation_single.start_id, stop=annotation_single.stop,
                                                      document_id=d,
                                                      language=d.language)

                        bioc_ann = BioCAnnotation()
                        bioc_ann.id = 'mention_' + str(mention.start) + '_' + str(mention.stop)
                        json_start_stop_pos = return_start_stop_for_frontend(mention.start, mention.stop,
                                                                             d.document_content)

                        loc_ann = BioCLocation()
                        loc_ann.offset = str(json_start_stop_pos['start'])
                        loc_ann.length = str(json_start_stop_pos['stop'] - json_start_stop_pos['start'] + 1)
                        positions.append(json_start_stop_pos['position'])
                        bioc_ann.add_location(loc_ann)
                        mention_text = mention.mention_text
                        mtext = re.sub('[^a-zA-Z0-9n\-_/\' ]+', '', mention_text)
                        count = 0
                        for association in associations:
                            concept = association.concept_url
                            area = association.name
                            bioc_ann.put_infon('concpet_url_' + str(count), concept.concept_url)
                            bioc_ann.put_infon('concpet_name_' + str(count), concept.concept_name)
                            bioc_ann.put_infon('concpet_area_' + str(count), area.name)

                        bioc_ann.text = mtext
                        couple = (bioc_ann, json_start_stop_pos)
                        bioc_annotations.append(couple)


                annotations_links = Link.objects.filter(username=u, name_space=u.name_space,
                                                       subject_document_id=d.document_id)
                bioc_annotations_links = []
                count = 0
                positions_links = []
                for annotation_single in annotations_links:
                    subject_mention = Mention.objects.get(start=annotation_single.subject_start,
                                                          stop=annotation_single.subject_stop, document_id=d,
                                                          language=d.language)

                    predicate_mention = Mention.objects.get(start=annotation_single.predicate_start,
                                                            stop=annotation_single.predicate_stop, document_id=d,
                                                            language=d.language)
                    object_mention = Mention.objects.get(start=annotation_single.object_start,
                                                         stop=annotation_single.object_stop, document_id=d,
                                                         language=d.language)
                    subject_json_start_stop_pos = return_start_stop_for_frontend(subject_mention.start,
                                                                                 subject_mention.stop,
                                                                                 d.document_content)


                    refid_subj = 'mention_' + str(subject_mention.start) + '_' + str(subject_mention.stop)
                    refid_pred = 'mention_' + str(predicate_mention.start) + '_' + str(predicate_mention.stop)
                    refid_obj = 'mention_' + str(object_mention.start) + '_' + str(object_mention.stop)
                    positions_links.append(subject_json_start_stop_pos['position'])
                    bioc_rel = BioCRelation()
                    bioc_rel.id = 'rel_' + str(count)
                    bioc_node_subj = BioCNode()
                    bioc_node_subj.refid = refid_subj
                    bioc_node_subj.role = 'subject'
                    bioc_node_pred = BioCNode()
                    bioc_node_pred.refid = refid_pred
                    bioc_node_pred.role = 'predicate'
                    bioc_node_obj = BioCNode()
                    bioc_node_obj.refid = refid_obj
                    bioc_node_obj.role = 'object'
                    bioc_rel.add_node(node=bioc_node_subj)
                    bioc_rel.add_node(node=bioc_node_pred)
                    bioc_rel.add_node(node=bioc_node_obj)
                    count += 1
                    couple = (bioc_rel, subject_json_start_stop_pos)
                    bioc_annotations_links.append(couple)

                # annotations_objs_conc = RelationshipObjConcept.objects.filter(username=u, name_space=u.name_space,
                #                                                          subject_document_id=d.document_id)
                # bioc_annotations_obj_conc = []
                # count = 0
                # positions_obj_conc = []
                # for annotation_single in annotations_objs_conc:
                #     concept = annotation_single.concept_url
                #     area = annotation_single.name
                #
                #     predicate_mention = Mention.objects.get(start=annotation_single.predicate_start,
                #                                             stop=annotation_single.predicate_stop, document_id=d,
                #                                             language=d.language)
                #     subject_mention = Mention.objects.get(start=annotation_single.subject_start,
                #                                           stop=annotation_single.subject_stop, document_id=d,
                #                                           language=d.language)
                #     predicate_json_start_stop_pos = return_start_stop_for_frontend(predicate_mention.start,
                #                                                                    predicate_mention.stop,
                #                                                                    d.document_content)
                #     subject_json_start_stop_pos = return_start_stop_for_frontend(subject_mention.start,
                #                                                                  subject_mention.stop,
                #                                                                  d.document_content)
                #
                #     refid_pred = 'mention_' + str(predicate_mention.start) + '_' + str(predicate_mention.stop)
                #     refid_subj = 'mention_' + str(subject_mention.start) + '_' + str(subject_mention.stop)
                #     positions_obj_conc.append(predicate_json_start_stop_pos['position'])
                #     bioc_rel_1 = BioCRelation()
                #     bioc_rel_1.id = 'rel_' + str(count)
                #     bioc_node_pred = BioCNode()
                #     bioc_node_pred.refid = refid_pred
                #     bioc_node_pred.role = 'predicate'
                #     bioc_node_obj = BioCNode()
                #     bioc_node_obj.refid = refid_subj
                #     bioc_node_obj.role = 'subject'
                #
                #     bioc_rel_1.add_node(node=bioc_node_pred)
                #     bioc_rel_1.add_node(node=bioc_node_obj)
                #     bioc_rel_1.put_infon('object_concept_url', concept.concept_url)
                #     bioc_rel_1.put_infon('object_concept_name', concept.concept_name)
                #     bioc_rel_1.put_infon('object_concept_area', area.name)
                #     count += 1
                #     couple = (bioc_rel_1, predicate_json_start_stop_pos)
                #     bioc_annotations_obj_conc.append(couple)



                for position in list(set(positions)):
                    passage = BioCPassage()
                    passage.put_infon('section', position)

                    for bioc_annotation in bioc_annotations:
                        if bioc_annotation[1]['position'] == position:
                            passage.add_annotation(bioc_annotation[0])
                    # print(writer)
                    # for bioc_annotation in bioc_annotations_obj_conc:
                    #     if bioc_annotation[1]['position'] == position:
                    #         passage.add_relation(bioc_annotation[0])
                    # print(writer)
                    # for bioc_annotation in bioc_annotations_links:
                    #     if bioc_annotation[1]['position'] == position:
                    #         passage.add_relation(bioc_annotation[0])
                    # print(writer)
                    document.add_passage(passage)


                    collection.add_document(document)
                    collection1.add_document(document)
                    print(writer)


    except Exception as e:
        print(e)
        return False

    else:
        print(writer)
        #
        # #os.remove(path1)
        if form == 'json':
            # os.remove(path1)
            return json_writer
        # # return True
        return writer

def mentions_bioc(d,u):
    count = 0
    bioc_annotations = []
    positions = []
    mentions = Mention.objects.filter(language = d.language,document_id=d)
    for mention in mentions:
        annotations_objs = Annotate.objects.filter(username=u,start=mention, stop = mention.stop,name_space=u.name_space, document_id=d)

        for annotation_single in annotations_objs:
            mention = Mention.objects.get(start=annotation_single.start_id, stop=annotation_single.stop, document_id=d,
                                          language=d.language)
            bioc_ann = BioCAnnotation()
            bioc_ann.id = 'mention_'+str(mention.start)+'_'+str(mention.stop)
            json_start_stop_pos = return_start_stop_for_frontend(mention.start, mention.stop, d.document_content)
            count = count + 1
            loc_ann = BioCLocation()
            loc_ann.offset = str(json_start_stop_pos['start'])
            loc_ann.length = str(json_start_stop_pos['stop'] - json_start_stop_pos['start'] + 1)
            positions.append(json_start_stop_pos['position'])
            bioc_ann.add_location(loc_ann)
            mention_text = mention.mention_text
            mtext = re.sub('[^a-zA-Z0-9n\-_/\' ]+', '', mention_text)

            bioc_ann.text = mtext
            couple = (bioc_ann, json_start_stop_pos)
            bioc_annotations.append(couple)
    return positions,bioc_annotations


def concepts_bioc(d,u):
    count = 0
    bioc_annotations = []
    positions = []
    mentions = Mention.objects.filter(language = d.language,document_id=d)
    for mention in mentions:
        annotations_objs = Annotate.objects.filter(username=u,start=mention, stop = mention.stop,name_space=u.name_space, document_id=d)

        for annotation_single in annotations_objs:
            associations = Associate.objects.filter(username=u, start=mention, stop=mention.stop, name_space=u.name_space,
                                    document_id=d)
            mention = Mention.objects.get(start=annotation_single.start_id, stop=annotation_single.stop, document_id=d,
                                          language=d.language)

            bioc_ann = BioCAnnotation()
            bioc_ann.id = 'mention_'+str(mention.start)+'_'+str(mention.stop)
            json_start_stop_pos = return_start_stop_for_frontend(mention.start, mention.stop, d.document_content)

            loc_ann = BioCLocation()
            loc_ann.offset = str(json_start_stop_pos['start'])
            loc_ann.length = str(json_start_stop_pos['stop'] - json_start_stop_pos['start'] + 1)
            positions.append(json_start_stop_pos['position'])
            bioc_ann.add_location(loc_ann)
            mention_text = mention.mention_text
            mtext = re.sub('[^a-zA-Z0-9n\-_/\' ]+', '', mention_text)
            count = 0
            for association in associations:
                concept = association.concept_url
                area = association.name
                bioc_ann.put_infon('concpet_url_'+str(count),concept.concept_url)
                bioc_ann.put_infon('concpet_name_'+str(count),concept.concept_name)
                bioc_ann.put_infon('concpet_area_'+str(count),area.name)

            bioc_ann.text = mtext
            couple = (bioc_ann, json_start_stop_pos)
            bioc_annotations.append(couple)
    return positions,bioc_annotations


def links_bioc(d,u):

    # pos,bioc_concepts = concepts_bioc(d,u)
    annotations_objs = Link.objects.filter(username=u, name_space=u.name_space, subject_document_id=d.document_id)
    bioc_annotations = []
    count = 0
    positions = []
    for annotation_single in annotations_objs:
        subject_mention = Mention.objects.get(start=annotation_single.subject_start, stop=annotation_single.subject_stop, document_id=d,
                                      language=d.language)

        predicate_mention = Mention.objects.get(start=annotation_single.predicate_start,
                                                stop=annotation_single.predicate_stop, document_id=d,
                                                language=d.language)
        object_mention = Mention.objects.get(start=annotation_single.object_start,
                                                stop=annotation_single.object_stop, document_id=d,
                                                language=d.language)
        subject_json_start_stop_pos = return_start_stop_for_frontend(subject_mention.start, subject_mention.stop, d.document_content)
        predicate_json_start_stop_pos = return_start_stop_for_frontend(predicate_mention.start, predicate_mention.stop, d.document_content)
        object_json_start_stop_pos = return_start_stop_for_frontend(object_mention.start, object_mention.stop, d.document_content)

        refid_subj = 'mention_'+str(subject_mention.start)+'_'+str(subject_mention.stop)
        refid_pred = 'mention_'+str(predicate_mention.start)+'_'+str(predicate_mention.stop)
        refid_obj = 'mention_'+str(object_mention.start)+'_'+str(object_mention.stop)
        positions.append(subject_json_start_stop_pos['position'])
        bioc_ann = BioCRelation()
        bioc_ann.id = 'rel_'+str(count)
        bioc_node_subj = BioCNode()
        bioc_node_subj.refid = refid_subj
        bioc_node_subj.role = 'subject'
        bioc_node_pred = BioCNode()
        bioc_node_pred.refid = refid_pred
        bioc_node_pred.role = 'predicate'
        bioc_node_obj = BioCNode()
        bioc_node_obj.refid = refid_obj
        bioc_node_obj.role = 'object'
        bioc_ann.add_node(node=bioc_node_subj)
        bioc_ann.add_node(node=bioc_node_pred)
        bioc_ann.add_node(node=bioc_node_obj)
        count += 1
        couple = (bioc_ann,subject_json_start_stop_pos)
        bioc_annotations.append(couple)
    return positions,bioc_annotations


def rels_subj_conc_bioc(d, u):
    # pos,bioc_concepts = concepts_bioc(d,u)
    # annotations_objs = RelationshipSubjConcept.objects.filter(username=u, name_space=u.name_space,
    #                                                           object_document_id=d.document_id)
    bioc_annotations = []
    count = 0
    positions = []
    # for annotation_single in annotations_objs:
    #     concept = annotation_single.concept_url
    #     area = annotation_single.name
    #
    #     predicate_mention = Mention.objects.get(start=annotation_single.predicate_start,
    #                                             stop=annotation_single.predicate_stop, document_id=d,
    #                                             language=d.language)
    #     object_mention = Mention.objects.get(start=annotation_single.object_start,
    #                                          stop=annotation_single.object_stop, document_id=d,
    #                                          language=d.language)
    #     predicate_json_start_stop_pos = return_start_stop_for_frontend(predicate_mention.start, predicate_mention.stop,
    #                                                                    d.document_content)
    #
    #
    #     refid_pred = 'mention_' + str(predicate_mention.start) + '_' + str(predicate_mention.stop)
    #     refid_subj = 'mention_' + str(object_mention.start) + '_' + str(object_mention.stop)
    #     positions.append(predicate_json_start_stop_pos['position'])
    #     bioc_ann = BioCRelation()
    #     bioc_ann.id = 'rel_' + str(count)
    #     bioc_node_pred = BioCNode()
    #     bioc_node_pred.refid = refid_pred
    #     bioc_node_pred.role = 'predicate'
    #     bioc_node_obj = BioCNode()
    #     bioc_node_obj.refid = refid_subj
    #     bioc_node_obj.role = 'object'
    #
    #     bioc_ann.add_node(node=bioc_node_pred)
    #     bioc_ann.add_node(node=bioc_node_obj)
    #     bioc_ann.put_infon('subject_concept_url', concept.concept_url)
    #     bioc_ann.put_infon('subject_concept_name', concept.concept_name)
    #     bioc_ann.put_infon('subject_concept_area', area.name)
    #     count += 1
    #     couple = (bioc_ann, predicate_json_start_stop_pos)
    #     bioc_annotations.append(couple)
    return [], []



def rels_obj_conc_bioc(d, u):
    # pos,bioc_concepts = concepts_bioc(d,u)
    annotations_objs = RelationshipObjConcept.objects.filter(username=u, name_space=u.name_space,
                                                              subject_document_id=d.document_id)
    bioc_annotations = []
    count = 0
    positions = []
    for annotation_single in annotations_objs:
        concept = annotation_single.concept_url
        area = annotation_single.name

        predicate_mention = Mention.objects.get(start=annotation_single.predicate_start,
                                                stop=annotation_single.predicate_stop, document_id=d,
                                                language=d.language)
        subject_mention = Mention.objects.get(start=annotation_single.subject_start,
                                             stop=annotation_single.subject_stop, document_id=d,
                                             language=d.language)
        predicate_json_start_stop_pos = return_start_stop_for_frontend(predicate_mention.start, predicate_mention.stop,
                                                                       d.document_content)
        subject_json_start_stop_pos = return_start_stop_for_frontend(subject_mention.start, subject_mention.stop,
                                                                    d.document_content)

        refid_pred = 'mention_' + str(predicate_mention.start) + '_' + str(predicate_mention.stop)
        refid_subj = 'mention_' + str(subject_mention.start) + '_' + str(subject_mention.stop)
        positions.append(predicate_json_start_stop_pos['position'])
        bioc_ann = BioCRelation()
        bioc_ann.id = 'rel_' + str(count)
        bioc_node_pred = BioCNode()
        bioc_node_pred.refid = refid_pred
        bioc_node_pred.role = 'predicate'
        bioc_node_obj = BioCNode()
        bioc_node_obj.refid = refid_subj
        bioc_node_obj.role = 'subject'

        bioc_ann.add_node(node=bioc_node_pred)
        bioc_ann.add_node(node=bioc_node_obj)
        bioc_ann.put_infon('object_concept_url', concept.concept_url)
        bioc_ann.put_infon('object_concept_name', concept.concept_name)
        bioc_ann.put_infon('object_concept_area', area.name)
        count += 1
        couple = (bioc_ann, predicate_json_start_stop_pos)
        bioc_annotations.append(couple)
    return positions, bioc_annotations


def rels_pred_conc_bioc(d, u):
    # pos,bioc_concepts = concepts_bioc(d,u)
    annotations_objs = RelationshipPredConcept.objects.filter(username=u, name_space=u.name_space,
                                                              subject_document_id=d.document_id)
    bioc_annotations = []
    count = 0
    positions = []
    for annotation_single in annotations_objs:
        concept = annotation_single.concept_url
        area = annotation_single.name

        object_mention = Mention.objects.get(start=annotation_single.object_start,
                                                stop=annotation_single.object_stop, document_id=d,
                                                language=d.language)
        subject_mention = Mention.objects.get(start=annotation_single.subject_start,
                                             stop=annotation_single.subject_stop, document_id=d,
                                             language=d.language)
        object_json_start_stop_pos = return_start_stop_for_frontend(object_mention.start, object_mention.stop,
                                                                       d.document_content)
        subject_json_start_stop_pos = return_start_stop_for_frontend(subject_mention.start, subject_mention.stop,
                                                                    d.document_content)

        refid_object = 'mention_' + str(object_mention.start) + '_' + str(object_mention.stop)
        refid_subj = 'mention_' + str(subject_mention.start) + '_' + str(subject_mention.stop)
        positions.append(object_json_start_stop_pos['position'])
        bioc_ann = BioCRelation()
        bioc_ann.id = 'rel_' + str(count)
        bioc_node_pred = BioCNode()
        bioc_node_pred.refid = refid_object
        bioc_node_pred.role = 'object'
        bioc_node_obj = BioCNode()
        bioc_node_obj.refid = refid_subj
        bioc_node_obj.role = 'subject'

        bioc_ann.add_node(node=bioc_node_pred)
        bioc_ann.add_node(node=bioc_node_obj)
        bioc_ann.put_infon('predicate_concept_url', concept.concept_url)
        bioc_ann.put_infon('predicate_concept_name', concept.concept_name)
        bioc_ann.put_infon('predicate_concept_area', area.name)
        count += 1
        couple = (bioc_ann, object_json_start_stop_pos)
        bioc_annotations.append(couple)
    return positions, bioc_annotations





