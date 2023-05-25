from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import views as auth_views


app_name='RelAnno_App'
urlpatterns = [
    path('', views.login, name='login'),
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),
    path('register', views.register, name='register'),
    path('index', views.index, name='index'),
    path('loginPage/<str:orcid_error>', views.loginPage, name='loginPage'),
    path('loginPage', views.loginPage, name='loginPage'),
    path('registration', views.registration, name='registration'),
    path('logout', views.logout, name='logout'),
    path('tutorial', views.tutorial, name='tutorial'),
    path('my_stats', views.my_stats, name='my_stats'),
    path('documents', views.documents, name='documents'),
    path('statistics/<str:collection_id>', views.statistics, name='statistics'),
    path('statistics/<str:collection_id>/<str:type>', views.statistics, name='statistics'),
    path('statistics', views.statistics, name='statistics'),
    path('credits', views.credits, name='credits'),
    path('instructions', views.instructions, name='instructions'),
    path('uploadFile', views.uploadFile, name='uploadFile'),
    path('collections',views.collections,name='collections'),
    path('mentions',views.mentions,name='mentions'),
    path('relationships',views.relationships,name='relationships'),
    path('concepts',views.concepts,name='concepts'),
    path('labels',views.labels,name='labels'),
    path('get_fields',views.get_fields,name='get_fields'),
    path('get_annotators',views.get_annotators,name='get_annotators'),
    path('collections/<str:type>',views.collections,name='collections'),
    path('relationships/<str:type>',views.relationships,name='relationships'),
    path('mentions/<str:type>',views.mentions,name='mentions'),
    path('concepts/<str:type>',views.concepts,name='concepts'),
    path('labels/<str:type>',views.labels,name='labels'),
    path('get_collection_labels', views.get_collection_labels, name='get_collection_labels'),
    path('get_cur_collection_documents', views.get_cur_collection_documents, name='get_cur_collection_documents'),
    path('get_collection_concepts', views.get_collection_concepts, name='get_collection_concepts'),
    path('get_collection_areas', views.get_collection_areas, name='get_collection_areas'),
    path('set_new_fields', views.set_new_fields, name='set_new_fields'),
    path('get_batches', views.get_batches, name='get_batches'),
    path('update_document_id', views.update_document_id, name='update_document_id'),
    path('download_annotations', views.download_annotations, name='download_annotations'),
    path('get_mention_info', views.get_mention_info, name='get_mention_info'),
    path('generate_suggestion', views.generate_suggestion, name='generate_suggestion'),
    path('pending_invitations', views.pending_invitations, name='pending_invitations'),
    path('accept_invitation', views.accept_invitation, name='accept_invitation'),
    path('get_suggestion', views.get_suggestion, name='get_suggestion'),
    path('download_template_concepts', views.download_template_concepts, name='download_template_concepts'),
    path('change_collection_id', views.change_collection_id, name='change_collection_id'),
    path('upload', views.upload, name='upload'),
    path('annotate/<str:tyoe>', views.annotate, name='annotate'),
    path('signup_with_orcid', views.signup_with_orcid, name='signup_with_orcid'),
    path('login_with_orcid', views.login_with_orcid, name='login_with_orcid'),
    path('loginorcidcallback', views.loginorcidcallback, name='loginorcidcallback'),
    path('loginorcidcallback/<str:type>', views.loginorcidcallback, name='loginorcidcallback'),

    # annotat
    # ANNOTATIONS - GET
    path('get_mentions', views.get_mentions, name='get_mentions'),
    path('get_concepts', views.get_concepts, name='get_concepts'),
    path('get_concepts_full', views.get_concepts_full, name='get_concepts_full'),
    path('get_annotated_labels', views.get_annotated_labels, name='get_annotated_labels'),

    # ANNOTATIONS - POST
    path('add_mentions', views.add_mentions, name='add_mentions'),
    path('add_relationship', views.add_relationship, name='add_relationship'),
    path('update_relationship', views.update_relationship, name='update_relationship'),
    path('annotate_label', views.annotate_label, name='annotate_label'),
    path('set_concept', views.set_concept, name='set_concept'),
    path('set_profile', views.set_profile, name='set_profile'),
    path('password', views.password, name='password'),
    path('unlink_orcid', views.unlink_orcid, name='unlink_orcid'),
    path('link', views.link, name='link'),
    path('link_orcid', views.link_orcid, name='link_orcid'),


    # ANNOTATIONS - DELETE
    path('delete_single_mention', views.delete_single_mention, name='delete_single_mention'),
    path('delete_label', views.delete_label, name='delete_label'),
    path('delete_concept', views.delete_concept, name='delete_concept'),
    path('delete_relationship', views.delete_relationship, name='delete_relationship'),
    path('delete_annotation_all', views.delete_annotation_all, name='delete_annotation_all'),
    path('delete_single_document', views.delete_single_document, name='delete_single_document'),

    # ADD
    path('create_new_collection', views.create_new_collection, name='create_new_collection'),
    path('add_member', views.add_member, name='add_member'),
    path('add_labels', views.add_labels, name='add_labels'),
    path('transfer_annotations',views.transfer_annotations,name='transfer_annotations'),
    path('add_new_concepts_in_batch', views.add_new_concepts_in_batch, name='add_new_concepts_in_batch'),

    # GET
    path('get_annotation_mentions', views.get_annotation_mentions, name='get_annotation_mentions'),
    path('get_annotation_concepts', views.get_annotation_concepts, name='get_annotation_concepts'),
    path('get_annotation_labels', views.get_annotation_labels, name='get_annotation_labels'),
    path('get_annotation_relationships', views.get_annotation_relationships, name='get_annotation_relationships'),
    path('get_annotation_assertions', views.get_annotation_assertions, name='get_annotation_assertions'),
    path('get_session_params', views.get_session_params, name='get_session_params'),
    path('get_collections', views.get_collections, name='get_collections'),
    path('get_users_list', views.get_users_list, name='get_users_list'),
    path('get_labels_list', views.get_labels_list, name='get_labels_list'),
    path('get_members_list', views.get_members_list, name='get_members_list'),
    path('get_collection_documents', views.get_collection_documents, name='get_collection_documents'),
    path('get_documents_table', views.get_documents_table, name='get_documents_table'),
    path('get_count_per_label', views.get_count_per_label, name='get_count_per_label'),
    path('get_count_per_user', views.get_count_per_user, name='get_count_per_user'),
    path('get_document_content',views.get_document_content,name='get_document_content'),
    path('get_user_annotation_count_per_collection', views.get_user_annotation_count_per_collection, name='get_user_annotation_count_per_collection'),
    path('get_collection_languages', views.get_collection_languages, name='get_collection_languages'),
    # DELETE
    path('delete_member_from_collection', views.delete_member_from_collection, name='delete_member_from_collection'),
    path('delete_collection', views.delete_collection, name='delete_collection'),

    # COPY
    path('copy_label', views.copy_label, name='copy_label'),
    path('copy_mention', views.copy_mention, name='copy_mention'),
    path('copy_assertion', views.copy_assertion, name='copy_assertion'),
    path('copy_mention_concept', views.copy_mention_concept, name='copy_mention_concept'),
    path('copy_annotation', views.copy_annotation, name='copy_annotation'),

]


