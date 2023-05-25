from django.db import models

# Create your models here.
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Annotate(models.Model):
    document_id = models.ForeignKey('Document', models.DO_NOTHING, db_column='document_id')
    language = models.TextField()
    start = models.OneToOneField('Mention', models.DO_NOTHING, db_column='start',primary_key=True)
    stop = models.IntegerField()
    # collection_id = models.ForeignKey('Collection', models.DO_NOTHING, db_column='collection_id')
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space') # This field type is a guess.
    insertion_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'annotate'
        unique_together = (('start', 'stop', 'document_id', 'language', 'username', 'name_space'),)


class Associate(models.Model):

    document_id = models.ForeignKey('Document', models.DO_NOTHING, db_column='document_id')
    language = models.TextField()
    # collection_id = models.ForeignKey('Collection', models.DO_NOTHING, db_column='collection_id')
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')  # This field type is a guess.
    start = models.OneToOneField('Mention', models.DO_NOTHING, db_column='start',primary_key=True)
    stop = models.IntegerField()
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING, db_column='name')
    insertion_time = models.TimeField()
    concept_url = models.ForeignKey('Concept', models.DO_NOTHING, db_column='concept_url')

    class Meta:
        managed = False
        db_table = 'associate'
        unique_together = (('username', 'name_space', 'document_id', 'language', 'start', 'stop', 'concept_url','name'),)


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Collection(models.Model):
    collection_id = models.TextField(primary_key=True)
    name = models.TextField()
    description = models.TextField(blank=True, null=True)
    insertion_time = models.TimeField()
    username = models.TextField()
    name_space = models.TextField()

    class Meta:
        managed = False
        db_table = 'collection'


# class CollectionHasDocument(models.Model):
#     collection_id = models.OneToOneField(Collection, models.DO_NOTHING, db_column='collection_id', primary_key=True)
#     document_id = models.ForeignKey('Document', models.DO_NOTHING,db_column='document_id')
#     language = models.TextField()
#
#     class Meta:
#         managed = False
#         db_table = 'collection_has_document'
#         unique_together = (('collection_id', 'document_id', 'language'),)


class Concept(models.Model):
    concept_url = models.TextField(primary_key=True)
    concept_name = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'concept'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Document(models.Model):
    document_id = models.TextField(primary_key=True)
    language = models.TextField()
    provenance = models.TextField()
    document_content = models.JSONField()
    batch = models.IntegerField()
    insertion_time = models.TimeField()
    collection_id = models.ForeignKey('Collection', models.DO_NOTHING, db_column='collection_id')

    class Meta:
        managed = False
        db_table = 'document'
        unique_together = (('document_id', 'language'),)

class AddConcept(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    insertion_time = models.TimeField()
    collection_id = models.ForeignKey('Collection', models.DO_NOTHING, db_column='collection_id')
    concept_url = models.ForeignKey('Concept', models.DO_NOTHING, db_column='concept_url')
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING, db_column='name')

    class Meta:
        managed = False
        db_table = 'add_concept'
        unique_together = (('collection_id', 'username', 'concept_url','name'),)

class GroundTruthLogFile(models.Model):
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    document_id = models.OneToOneField('Document', models.DO_NOTHING,db_column='document_id',primary_key=True)
    # collection_id = models.ForeignKey('Collection', models.DO_NOTHING, db_column='collection_id')
    language = models.TextField()
    # gt_type = models.TextField()
    insertion_time = models.TimeField()
    gt_json = models.JSONField()
    revised = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'ground_truth_log_file'
        unique_together = (('username', 'name_space', 'document_id', 'language'),)


class Link(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space') # This field type is a guess.
    subject_document_id = models.TextField()
    object_document_id = models.TextField()
    predicate_document_id = models.TextField()
    object_language = models.TextField()
    predicate_language = models.TextField()
    subject_language = models.TextField()
    subject_start = models.IntegerField()
    subject_stop = models.IntegerField()
    predicate_start = models.IntegerField()
    predicate_stop = models.IntegerField()
    object_start = models.IntegerField()
    object_stop = models.IntegerField()
    insertion_time = models.TimeField()


    class Meta:
        managed = False
        db_table = 'link'
        unique_together = (('username', 'name_space', 'subject_document_id', 'subject_language', 'subject_start', 'subject_stop', 'predicate_start', 'predicate_language', 'predicate_document_id', 'predicate_stop', 'object_document_id', 'object_language', 'object_start', 'object_stop'),)


class Mention(models.Model):
    start = models.IntegerField(primary_key=True)
    stop = models.IntegerField()
    document_id = models.ForeignKey('Document', models.DO_NOTHING,db_column='document_id')
    # collection_id = models.ForeignKey('Collection', models.DO_NOTHING,db_column='collection_id')
    language = models.TextField()
    mention_text = models.TextField()

    class Meta:
        managed = False
        db_table = 'mention'
        unique_together = (('start', 'stop', 'document_id','language'),)


class NameSpace(models.Model):
    name_space = models.TextField(primary_key=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'name_space'

class SemanticArea(models.Model):
    name = models.TextField(primary_key=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'semantic_area'

class Nanpublication(models.Model):
    doi = models.TextField(primary_key=True)
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')  # This field type is a guess.
    document_id = models.ForeignKey('Document', models.DO_NOTHING,db_column='document_id')
    language = models.TextField()
    nanopub_content = models.TextField()
    insertion_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'nanpublication'


class RelationshipPredConcept(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    subject_document_id = models.TextField()
    subject_language = models.TextField()
    object_document_id = models.TextField()
    object_language = models.TextField()
    subject_start = models.IntegerField()
    subject_stop = models.IntegerField()
    object_start = models.IntegerField()
    object_stop = models.IntegerField()
    concept_url = models.ForeignKey('Concept', models.DO_NOTHING,db_column='concept_url')
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING,db_column='name')
    insertion_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'relationship_pred_concept'
        unique_together = (('username', 'name','name_space', 'subject_document_id', 'subject_language', 'object_document_id', 'object_language', 'subject_start', 'subject_stop', 'object_start', 'object_stop', 'concept_url'),)

class RelationshipObjConcept(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    subject_document_id = models.TextField()
    subject_language = models.TextField()
    predicate_document_id = models.TextField()
    predicate_language = models.TextField()
    subject_start = models.IntegerField()
    subject_stop = models.IntegerField()
    predicate_start = models.IntegerField()
    predicate_stop = models.IntegerField()
    concept_url = models.ForeignKey('Concept', models.DO_NOTHING,db_column='concept_url')
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING,db_column='name')
    insertion_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'relationship_obj_concept'
        unique_together = (('username','name', 'name_space', 'subject_document_id', 'subject_language', 'predicate_document_id', 'predicate_language', 'subject_start', 'subject_stop', 'predicate_start', 'predicate_stop', 'concept_url'),)

class RelationshipSubjConcept(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    predicate_document_id = models.TextField()
    predicate_language = models.TextField()
    object_document_id = models.TextField()
    object_language = models.TextField()
    predicate_start = models.IntegerField()
    predicate_stop = models.IntegerField()
    object_start = models.IntegerField()
    object_stop = models.IntegerField()
    concept_url = models.ForeignKey('Concept', models.DO_NOTHING,db_column='concept_url')
    insertion_time = models.TimeField()
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING,db_column='name')


    class Meta:
        managed = False
        db_table = 'relationship_subj_concept'
        unique_together = (('username','name', 'name_space', 'predicate_document_id', 'predicate_language', 'object_document_id', 'object_language', 'predicate_start', 'predicate_stop', 'object_start', 'object_stop', 'concept_url'),)

class RelationshipPredMention(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    document_id =  models.ForeignKey('Document', models.DO_NOTHING, db_column='document_id')
    language = models.TextField()
    start = models.ForeignKey('Mention', models.DO_NOTHING, db_column='start')
    stop = models.IntegerField()
    subject_concept_url = models.TextField()
    object_concept_url = models.TextField()
    insertion_time = models.TimeField()
    subject_name = models.TextField()
    object_name = models.TextField()

    class Meta:
        managed = False
        db_table = 'relationship_pred_mention'
        unique_together = (('username','subject_name','object_name', 'name_space', 'document_id', 'language',  'start', 'stop', 'object_concept_url', 'subject_concept_url'),)

class RelationshipSubjMention(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    document_id = models.ForeignKey('Document', models.DO_NOTHING, db_column='document_id')
    language = models.TextField()
    start =  models.ForeignKey('Mention', models.DO_NOTHING, db_column='start')
    stop = models.IntegerField()
    predicate_name = models.TextField()
    object_name = models.TextField()
    predicate_concept_url = models.TextField()
    object_concept_url = models.TextField()
    insertion_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'relationship_subj_mention'
        unique_together = (('username', 'name_space', 'document_id', 'language',  'start', 'stop', 'object_concept_url', 'predicate_concept_url'),)

class RelationshipObjMention(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    document_id =  models.ForeignKey('Document', models.DO_NOTHING, db_column='document_id')
    language = models.TextField()
    start = models.ForeignKey('Mention', models.DO_NOTHING, db_column='start')
    stop = models.IntegerField()
    predicate_concept_url = models.TextField()
    subject_concept_url = models.TextField()
    subject_name = models.TextField()
    predicate_name = models.TextField()
    insertion_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'relationship_obj_mention'
        unique_together = (('username','predicate_name','subject_name', 'name_space', 'document_id', 'language',  'start', 'stop', 'subject_concept_url', 'predicate_concept_url'),)

class CreateFact(models.Model):
    username = models.OneToOneField('User', models.DO_NOTHING, db_column='username',primary_key=True)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    document_id =  models.ForeignKey('Document', models.DO_NOTHING, db_column='document_id')
    language = models.TextField()
    predicate_concept_url = models.TextField()
    object_concept_url = models.TextField()
    subject_concept_url = models.TextField()
    subject_name = models.TextField()
    predicate_name = models.TextField()
    object_name = models.TextField()
    insertion_time = models.TimeField()
    class Meta:
        managed = False
        db_table = 'create_fact'
        unique_together = (('username','predicate_name','subject_name','object_name', 'name_space', 'document_id', 'language', 'subject_concept_url','object_concept_url', 'predicate_concept_url'),)

class ShareCollection(models.Model):
    collection_id = models.OneToOneField(Collection, models.DO_NOTHING, db_column='collection_id', primary_key=True)
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    status = models.TextField()

    class Meta:
        managed = False
        db_table = 'share_collection'
        unique_together = (('collection_id', 'username', 'name_space'),)

class HasArea(models.Model):
    concept_url = models.OneToOneField(Concept, models.DO_NOTHING, db_column='concept_url', primary_key=True)
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING, db_column='name')

    class Meta:
        managed = False
        db_table = 'has_area'
        unique_together = (('name', 'concept_url'),)

class User(models.Model):
    username = models.CharField(primary_key=True, max_length=32)
    password = models.CharField(max_length=32)
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')
    orcid = models.TextField(blank=True, null=True)
    ncbi_key = models.TextField(blank=True, null=True)
    profile = models.TextField()  # This field type is a guess.
    orcid_token = models.TextField()

    class Meta:
        managed = False
        db_table = 'user'
        unique_together = (('username', 'name_space'),)


class Vocabulary(models.Model):
    type = models.TextField()  # This field type is a guess.
    name = models.TextField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'vocabulary'


class VocabularyHasConcept(models.Model):
    concept_url = models.OneToOneField(Concept, models.DO_NOTHING, db_column='concept_url', primary_key=True)
    name = models.ForeignKey('Vocabulary', models.DO_NOTHING, db_column='name')
    type = models.TextField()
    class Meta:
        managed = False
        db_table = 'vocabulary_has_concept'
        unique_together = (('concept_url', 'name'),)

class Label(models.Model):
    name = models.TextField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'label'

class HasLabel(models.Model):
    name = models.OneToOneField(Label, models.DO_NOTHING, db_column='name', primary_key=True)
    collection_id = models.ForeignKey('Collection', models.DO_NOTHING, db_column='collection_id')
    class Meta:
        managed = False
        db_table = 'has_label'

class AnnotateLabel(models.Model):
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name_space = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='name_space')  # This field type is a guess.
    document_id = models.ForeignKey('Document', models.DO_NOTHING,db_column='document_id')
    language = models.TextField()
    name = models.OneToOneField(Label, models.DO_NOTHING, db_column='name', primary_key=True)
    insertion_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'annotate_label'