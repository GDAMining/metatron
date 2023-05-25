from RelAnno_App.utils_copy_annotations import *
from RelAnno_App.utils_iaa import *
from django.contrib.auth.decorators import login_required
import hashlib
from django.db.models import Max
from RelAnno_App.upload.utils_upload import *
from RelAnno_App.utils_download import *
from RelAnno_App.upload.utils_pubmed import *
from RelAnno_App.upload.configure import *
from django.db.models import Count
from datetime import datetime
import time
from RelAnno_App.utils_stats import *
from django.contrib.sessions.backends.db import SessionStore
import secrets
from django.conf import settings

def link_orcid(request):
    # Save the user's session ID in the session store
    session_store = SessionStore()
    session_store['username'] = request.session['username']
    session_store['collection'] = request.session['collection']
    session_store['document'] = request.session['document']
    session_store['language'] = request.session['language']
    session_store['name_space'] = request.session['name_space']
    session_store['fields'] = request.session['fields']
    session_store['fields_to_ann'] = request.session['fields_to_ann']



    session_store['sessionid'] = request.session.session_key
    session_store.save()
    state = secrets.token_urlsafe(16)

    # Generate a random state parameter to prevent CSRF attacks
    orcid_url = f'https://orcid.org/oauth/authorize?client_id={settings.ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri={settings.ORCID_REDIRECT_LINK_URI}&state={state}'
    return redirect(orcid_url)




def login_with_orcid(request):
    # redirect_uri = request.build_absolute_uri(reverse('orcid_callback'))
    orcid_url = f'https://orcid.org/oauth/authorize?client_id={settings.ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri={settings.ORCID_REDIRECT_URI}'
    return redirect(orcid_url)

    # api = PublicAPI(settings.ORCID_CLIENT_ID,settings.ORCID_CLIENT_SECRET,sandbox=True)
    # url = api.get_login_url(scope=['/authenticate'],redirect_uri=settings.ORCID_REDIRECT_URI)
    # return redirect(url)

def signup_with_orcid(request):
    # redirect_uri = request.build_absolute_uri(reverse('orcid_callback'))
    final_url = settings.ORCID_REDIRECT_URI_REGISTER
    orcid_url = f'https://orcid.org/oauth/authorize?client_id={settings.ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri={final_url}'
    return redirect(orcid_url)

    # api = PublicAPI(settings.ORCID_CLIENT_ID,settings.ORCID_CLIENT_SECRET,sandbox=True)
    # url = api.get_login_url(scope=['/authenticate'],redirect_uri=settings.ORCID_REDIRECT_URI)
    # return redirect(url)


def loginorcidcallback(request,type=False):
    code = request.GET.get('code')
    if type == 'link':
        session_id = request.COOKIES.get('sessionid')

        session = SessionStore(session_key=session_id)
        session_data = session.load()
        username = session_data['username']
        if not username:
            return redirect('RelAnno_App:index')
        session.update(session_data)
        session.save()

    token_url = 'https://orcid.org/oauth/token'
    if type == 'register':
        redir_url = settings.ORCID_REDIRECT_URI_REGISTER
    elif type == 'link':
        redir_url = settings.ORCID_REDIRECT_LINK_URI
    else:
        redir_url = settings.ORCID_REDIRECT_URI

    data = {
        'client_id': settings.ORCID_CLIENT_ID,
        'client_secret': settings.ORCID_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'scope' : '/authenticate',
        'redirect_uri': redir_url
    }
    error = False
    response = requests.post(token_url, data=data)
    if response.status_code == 200:
        state = request.GET.get('state')
        print(state)

        resp = json.loads(response.text)
        name = resp['name']
        orcid = resp['orcid']
        orcid_token = resp['access_token']
        if orcid != 'null' and orcid is not None and orcid != '':
            params = {'orcid': orcid, 'orcid_token': orcid_token}
            url = get_baseurl() + 'login'
            if type == 'register':
                params = {'orcid': orcid, 'orcid_token': orcid_token,'username':name}
                url = get_baseurl()+'register'
            elif type == 'link':
                params = {'orcid': orcid, 'orcid_token': orcid_token, 'username': username}
                url = get_baseurl() + 'link'

            # elif type == 'link':
            #     params = {'orcid': orcid, 'orcid_token': orcid_token,'username':request.session['username']}
            #     url = get_baseurl()+'link'
            # Make the POST request to the other view
            response = requests.post(url, data=params)
            if response.status_code == 200:
                # return response
                print('tutto ok')
                resp = response.json()
                request.session['username'] = resp['username']
                request.session['name_space'] = 'Human'
                request.session['profile'] = resp['profile']
                if type == 'link':
                    return redirect('RelAnno_App:logout')
                return redirect('RelAnno_App:index')
            else:
                error = True

        else:
            error = True
    if error:
        return redirect('RelAnno_App:loginPage', orcid_error=True)

def link(request):
    """This view links an orcid to a user"""

    username = request.session.get('username', None)
    if username is None:
        username = request.POST.get('username')
    orcid_token = request.POST.get('orcid_token')
    orcid = request.POST.get('orcid')
    print(username,orcid,orcid_token)
    try:
        with connection.cursor() as cursor:
            cursor.execute("""UPDATE public.user SET orcid = %s, orcid_token = %s WHERE username = %s""",[orcid,orcid_token,username])
        user = User.objects.filter(username = username,orcid_token=orcid_token,orcid = orcid)
        resp = {'username': user.first().username, 'profile': user.first().profile}
        response = JsonResponse(resp, status=200)
        return response
    except Exception as e:
        print(e)
        return HttpResponse(status = 500)

def login(request):

    """Login page for app """

    # print('login')
    if request.method == 'POST':
        md5_pwd = ''
        admin = False
        username = request.POST.get('username', False)
        mode1 = 'Human'
        mode = NameSpace.objects.get(name_space=mode1)
        password = request.POST.get('password', False)
        orcid = request.POST.get("orcid",False)
        orcid_token = request.POST.get("orcid_token",False)
        if username:
            username = username.replace("\"", "").replace("'", "")
        if password:
            password = password.replace("\"", "").replace("'", "")
            md5_pwd = hashlib.md5(password.encode()).hexdigest()

        if ((username != False and password != False) or orcid != False):
            if (username != False and password != False):
                user = User.objects.filter(username = username,password = md5_pwd)
            else:
                user = User.objects.filter(orcid = orcid)

            if user.exists():
                request.session['username'] = user.first().username
                request.session['profile'] = user.first().profile

                if user.first().ncbi_key is not None:
                    os.environ['NCBI_API_KEY'] = user.first().ncbi_key
                # prima recupero la sessione dall'ultima annotazione
                if GroundTruthLogFile.objects.filter(username__in = user).exists():
                    gts = GroundTruthLogFile.objects.filter(username__in = user).order_by('-insertion_time')
                    last_gt = gts.first()
                    name_space = last_gt.name_space
                    # collection = last_gt.collection_id
                    document = last_gt.document_id
                    request.session['language'] = document.language
                    request.session['name_space'] = name_space.name_space
                    request.session['collection'] = document.collection_id_id
                    request.session['document'] = document.document_id
                    request.session['batch'] = document.batch
                    request.session['fields'] = request.session['fields_to_ann'] =  get_fields_list(request.session['document'],request.session['language'])

                # se non ho ultima annotazione ma ho collezioni, allora setto la collezione all'ultima aggiunta e al primo doc della prima batch
                elif ShareCollection.objects.filter(username = user.first()).exclude(status = 'Invited').exists(): # non importa il name space in questo caso
                    collections = ShareCollection.objects.filter(username = user.first()).values('collection_id').distinct()
                    collections_ids = [c['collection_id'] for c in collections]
                    collection = Collection.objects.filter(collection_id__in=collections_ids).order_by('-insertion_time').first()
                    request.session['collection'] = collection.collection_id
                    document = Document.objects.filter(collection_id = collection).order_by('insertion_time').first()
                    request.session['document'] = document.document_id
                    request.session['language'] = document.language
                    request.session['name_space'] = mode1
                    request.session['fields'] = request.session['fields_to_ann'] = get_fields_list(request.session['document'],
                                                                request.session['language'])

                else:
                    request.session['collection'] = None
                    request.session['document'] = None
                    request.session['language'] = None
                    request.session['name_space'] = 'Human'
                    request.session['fields'] = []
                    request.session['fields_to_ann'] = []

                # return JsonResponse({'msg':'ok'})
                if orcid:
                    resp = {'username': user.first().username, 'profile': user.first().profile}
                    response = JsonResponse(resp, status=200)
                    return response
                return redirect('RelAnno_App:index')

        # return render(request, 'RelAnno_App/index.html',status=500)
        if orcid:
            response = HttpResponse(status=500)
            return response
        return JsonResponse({'error':'errore'},status=500)

    else:
        username = request.session.get('username', False)
        profile = request.session.get('profile', False)
        name_space = request.session.get('name_space', False)

        if username and profile and name_space:
            # return JsonResponse({'msg': 'ok'})
            return redirect('RelAnno_App:index')
            # return render(request, 'RelAnno_App/index.html')

        # context = {'username': username, 'profile': user.profile}
        # return render(request, 'RelAnno_App/index.html')
        return redirect('RelAnno_App:loginPage')

def set_profile(request):
    profile = json.loads(request.body)
    profile = profile['profile']
    request.session['profile'] = profile
    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute("UPDATE public.user set profile = %s where username = %s",[profile,request.session['username']])
        return HttpResponse(status=200)

    except Exception as e:
        print(e)
        return HttpResponse(status=500)

def unlink_orcid(reuqest):

    """Unlink the orcid of the user"""

    username = reuqest.session.get('username',None)
    try:
        if username is not None:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("UPDATE public.user SET orcid = NULL, orcid_token = NULL where username = %s",[username])
            return HttpResponse(status=200)
        else:
            return HttpResponse(status = 500)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)

def password(request):

    """Get password of a user"""

    password = None
    if request.method == "GET":
        username = request.session.get('username',None)
        if username:
            user = User.objects.filter(username = username).first()
            password = user.password

        if password:
            return HttpResponse('ok',status=200)
        else:
            return HttpResponse('none',status = 200)
    elif request.method == "POST":
        password = json.loads(request.body)['password']
        username = request.session.get('username', None)
        if username and password:
            password = hashlib.md5(password.encode()).hexdigest()
            try:
                cursor = connection.cursor()
                cursor.execute("UPDATE public.user SET password = %s where username = %s",[password,username])
                return HttpResponse('ok', status=200)
            except Exception as e:
                return HttpResponse('error', status=200)



def register(request):

    """This view handles the registration of new users: username, password and profile are inserted in the database"""

    if request.method == 'POST':
        username = request.POST.get('username',None)
        password1 = request.POST.get('password',None)
        password_check = request.POST.get('password_check',None)
        profile = request.POST.get('profile','Default')
        orcid = request.POST.get('orcid',None)
        orcid_token = request.POST.get('orcid_token',None)
        ncbikey = request.POST.get('ncbikey',None)
        try:
            with transaction.atomic():
                ns_human = NameSpace.objects.get(name_space='Human')

                if not User.objects.filter(name_space=ns_human, username='IAA-Inter Annotator Agreement').exists():
                    User.objects.create(username='IAA-Inter Annotator Agreement', profile='Tech',
                                        password=hashlib.md5("iaa".encode()).hexdigest(), name_space=ns_human,
                                        orcid=None, ncbi_key=None)
                if not username or (not password1 and not orcid) or not profile:
                    return JsonResponse({'error': 'missing credentials'}, status=500)


                if User.objects.filter(username = username).exists() or username == 'global':
                    if orcid:
                        if User.objects.filter(orcid = orcid).exists():
                            return JsonResponse({'message': 'The orcid is already assigned'})

                        i = 0
                        found = True
                        while found:
                            username = username+'_'+str(i)
                            i+=1
                            if not User.objects.filter(username = username).exists():
                                found = False
                    else:
                        return JsonResponse({'message': 'The username you chose already exists'},status=500)

                if orcid:
                    User.objects.create(username=username, profile=profile, password=password1, name_space=ns_human,
                                        orcid=orcid, orcid_token=orcid_token ,ncbi_key=ncbikey)


                if password1 == password_check and password1 is not None:
                    password = hashlib.md5(password1.encode()).hexdigest()
                    User.objects.create(username = username,profile=profile,password = password,name_space=ns_human,orcid=orcid,ncbi_key=ncbikey)



        except (Exception) as error:
            print(error)
            # context = {: "Something went wrong, probably you did not set any profile"}
            return JsonResponse({'error': 'This username already exists'},status = 500)
        else:
            request.session['username'] = username
            request.session['name_space'] = 'Human'
            request.session['profile'] = profile
            if orcid:
                print(request.session.get('username',None))
                resp = {'username':username,'profile':profile}
                response = JsonResponse(resp,status=200)
                return response
            return redirect('RelAnno_App:index')
            # return JsonResponse({'response': 'ok'},status = 200)

    # return render(request, 'RelAnno_App/login.html')

def index(request):

    """Home page for app (and project)"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)

    baseurl = get_baseurl()
    if(username and baseurl != ''):
        orcid = User.objects.get(username = username)
        orcid = orcid.orcid
        if orcid == None:
            orcid = ''

        context = {'username': username,'profile':profile, 'baseurl':baseurl,'orcid':orcid}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')



def logout(request):

    """Logout: deletion of session's parameters"""

    try:
        for key in request.session.keys():
            del request.session[key]

        # return redirect('RelAnno_App:login')
    except KeyError:
        pass
    finally:
        request.session.flush()
        return redirect('RelAnno_App:login')


def registration(request):

    """This view handles the registration of new users: username, password and profile are inserted in the database"""

    if request.method == 'POST':
        username = request.POST.get('username',None)
        password1 = request.POST.get('password',None)
        profile = request.POST.get('profile',None)

        try:
            with transaction.atomic():

                password = hashlib.md5(password1.encode()).hexdigest()
                ns_robot = NameSpace.objects.get(ns_id = 'Robot')
                ns_human = NameSpace.objects.get(ns_id = 'Human')
                # User.objects.create(username = username,profile=profile,password = password,ns_id=ns_robot)
                User.objects.create(username = username,profile=profile,password = password,ns_id=ns_human)
                request.session['username'] = username
                request.session['name_space'] = 'Human'
                request.session['profile'] = profile

                # admin = User.objects.filter(profile='Admin')
                # admin = admin.first()
                #
                # admin_name = admin.username
                # request.session['team_member'] = admin_name

                return redirect('RelAnno_App:index')
        except (Exception) as error:
            print(error)
            return render(request, 'RelAnno_App/index.html')


def credits(request):

    """Credits page for app"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    baseurl = get_baseurl()
    if(username and baseurl != ''):
        context = {'username': username,'profile':profile, 'baseurl':baseurl}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')

def instructions(request):

    """Credits page for app"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    baseurl = get_baseurl()
    if(username and baseurl != ''):
        context = {'username': username,'profile':profile, 'baseurl':baseurl}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')

def statistics(request,collection_id = None, type = None):

    """Credits page for app"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    baseurl = get_baseurl()
    # name_space = NameSpace.objects.get(name_space='Human')


    name_space = request.session['name_space']
    name_space = NameSpace.objects.get(name_space=name_space)
    user_iaa = User.objects.get(username="IAA-Inter Annotator Agreement", name_space=name_space)
    if request.method == 'GET':
        if (type is None and Collection.objects.filter(collection_id = collection_id).exists()) or (type is None and collection_id is None):
            # in questi due casi faccio un render
            if (username and baseurl != ''):
                context = {'username': username, 'profile': profile, 'baseurl': baseurl}
                return render(request, 'RelAnno_App/index.html', context)
            else:
                return redirect('RelAnno_App:login')

        elif type == 'general' and collection_id == 'personal':
            document = request.GET.get('document')
            collection = request.GET.get('collection')
            json_doc = {}
            name_space = NameSpace.objects.get(name_space = request.session.get('name_space'))
            # user = User.objects.get(username=username,name_space = name_space)
            username_req = request.GET.get('user', None)
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))

            if username_req is None:
                user = User.objects.get(username=username, name_space=name_space)
            else:
                user = User.objects.get(username=username_req, name_space=name_space)
            collection = Collection.objects.get(collection_id = collection)
            if document == '':
                documents = Document.objects.filter(collection_id = collection)
                json_doc['annotated_documents'] = GroundTruthLogFile.objects.filter(document_id__in=documents,name_space=name_space,
                                                           username=user).count()
            else:
                documents = Document.objects.filter(collection_id = collection,document_id = document)
            json_doc['mentions'] = Annotate.objects.filter(document_id__in=documents, name_space=name_space,
                                                           username=user).count()
            json_doc['concepts'] = Associate.objects.filter(document_id__in=documents, name_space=name_space,
                                                            username=user).count()
            json_doc['labels'] = AnnotateLabel.objects.filter(document_id__in=documents, name_space=name_space,
                                                              username=user).count()
            json_doc['assertions'] = CreateFact.objects.filter(document_id__in=documents, name_space=name_space,
                                                               username=user).count()
            documents_list_ids = [x.document_id for x in documents]
            json_doc['relationships'] = Link.objects.filter(subject_document_id__in=documents_list_ids,name_space=name_space,
                                                            username=user).count() + RelationshipPredConcept.objects.filter(subject_document_id__in=documents_list_ids, name_space=name_space,username=user).count() + \
                                        RelationshipObjConcept.objects.filter(subject_document_id__in=documents_list_ids, name_space=name_space, username=user).count() + RelationshipSubjConcept.objects.filter(object_document_id__in=documents_list_ids, name_space=name_space,
                username=user).count() + RelationshipSubjMention.objects.filter(document_id__in=documents,
                                                                                name_space=name_space,
                                                                                username=user).count() + RelationshipObjMention.objects.filter(
                document_id__in=documents, name_space=name_space,
                username=user).count() + RelationshipPredMention.objects.filter(document_id__in=documents,
                                                                                name_space=name_space,
                                                                                username=user).count()
            return JsonResponse(json_doc)

        elif type == 'general' and collection_id == 'global':
            document = request.GET.get('document')
            collection = request.GET.get('collection')
            json_doc = {}
            # name_space = NameSpace.objects.get(name_space = request.session.get('name_space'))
            # user = User.objects.get(username=username,name_space = name_space)
            username_req = request.GET.get('user', None)
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))

            if username_req is None:
                user = User.objects.get(username=username, name_space=name_space)
            else:
                user = User.objects.get(username=username_req, name_space=name_space)
            collection = Collection.objects.get(collection_id = collection)
            if document == '':
                documents = Document.objects.filter(collection_id = collection)
                json_doc['annotated_documents'] = GroundTruthLogFile.objects.filter(document_id__in=documents,name_space=name_space).count()
            else:
                documents = Document.objects.filter(collection_id = collection,document_id = document)

            json_doc['annotators_count'] = GroundTruthLogFile.objects.filter(document_id__in=documents, name_space=name_space).distinct('username').count()
            json_doc['mentions'] = Annotate.objects.filter(document_id__in=documents, name_space=name_space).count()
            json_doc['concepts'] = Associate.objects.filter(document_id__in=documents, name_space=name_space).count()
            json_doc['labels'] = AnnotateLabel.objects.filter(document_id__in=documents, name_space=name_space).count()
            json_doc['assertions'] = CreateFact.objects.filter(document_id__in=documents, name_space=name_space).count()
            documents_list_ids = [x.document_id for x in documents]
            json_doc['relationships'] = Link.objects.filter(subject_document_id__in=documents_list_ids,name_space=name_space,
                                                            username=user).count() + RelationshipPredConcept.objects.filter(subject_document_id__in=documents_list_ids, name_space=name_space).count() + \
                                        RelationshipObjConcept.objects.filter(subject_document_id__in=documents_list_ids, name_space=name_space).count() + RelationshipSubjConcept.objects.filter(object_document_id__in=documents_list_ids, name_space=name_space,
                username=user).count() + RelationshipSubjMention.objects.filter(document_id__in=documents,
                                                                                name_space=name_space).count() + RelationshipObjMention.objects.filter(
                document_id__in=documents, name_space=name_space).count() + RelationshipPredMention.objects.filter(document_id__in=documents,
                                                                                name_space=name_space).count()
            json_doc['iaa'] = {}
            st = time.time()
            mention_agreement = global_mentions_agreement(collection.collection_id)
            print('mentions',str(time.time()-st))
            st = time.time()
            concepts_agreement = global_concepts_agreement(collection.collection_id)
            print(time.time()-st)

            st = time.time()
            rels_agreement = global_relationships_agreement(collection.collection_id)
            print(time.time()-st)

            st = time.time()
            ass_agreement = global_createfact_agreement(collection.collection_id)
            print(time.time()-st)

            st = time.time()
            labels_agreement = global_labels_agreement(collection.collection_id)
            print(time.time()-st)

            json_doc['iaa']['mentions'] = round(mention_agreement, 3) if mention_agreement != '' else ''
            json_doc['iaa']['concepts'] = round(concepts_agreement, 3) if concepts_agreement != '' else ''
            json_doc['iaa']['labels'] = round(labels_agreement, 3) if labels_agreement != '' else ''
            json_doc['iaa']['assertions'] = round(ass_agreement, 3) if ass_agreement != '' else ''
            json_doc['iaa']['relationships'] = round(rels_agreement, 3) if rels_agreement != '' else ''
            return JsonResponse(json_doc)

        elif type == 'relationship_area'and collection_id == 'personal':
            document = request.GET.get('document')
            collection = request.GET.get('collection')
            username_req = request.GET.get('user', None)
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))

            if username_req is None:
                user = User.objects.get(username=username, name_space=name_space)
            else:
                user = User.objects.get(username=username_req, name_space=name_space)
            # name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))
            # user = User.objects.get(username=username, name_space=name_space)
            collection = Collection.objects.get(collection_id=collection)
            distinct_areas = AddConcept.objects.filter(collection_id=collection).distinct('name')
            distinct_areas = [x.name_id for x in distinct_areas]
            if document == '':
                documents = Document.objects.filter(collection_id=collection)
            else:
                documents = Document.objects.filter(collection_id=collection, document_id=document)
            docs = [x.document_id for x in documents]
            # json_doc = {}
            # json_doc['subject'] = {}
            # json_doc['predicate'] = {}
            # json_doc['object'] = {}
            json_doc = compute_relationship_area_personal(distinct_areas,documents,docs,user,name_space)
            return JsonResponse(json_doc)

        elif type == 'relationship_area' and collection_id == 'global':
            document = request.GET.get('document')
            collection = request.GET.get('collection')
            username_req = request.GET.get('user', None)
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))

            if username_req is None:
                user = User.objects.get(username=username, name_space=name_space)
            else:
                user = User.objects.get(username=username_req, name_space=name_space)
            # name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))
            # user = User.objects.get(username=username, name_space=name_space)
            collection = Collection.objects.get(collection_id=collection)
            distinct_areas = AddConcept.objects.filter(collection_id=collection).distinct('name')
            distinct_areas = [x.name_id for x in distinct_areas]
            if document == '':
                documents = Document.objects.filter(collection_id=collection)
            else:
                documents = Document.objects.filter(collection_id=collection, document_id=document)
            docs = [x.document_id for x in documents]
            # json_doc = {}
            # json_doc['subject'] = {}
            # json_doc['predicate'] = {}
            # json_doc['object'] = {}
            json_doc = compute_relationship_area_global(distinct_areas,documents,docs,name_space)
            return JsonResponse(json_doc)


        elif type == 'concept_area' and collection_id == 'personal':
            document = request.GET.get('document')
            collection = request.GET.get('collection')
            username_req = request.GET.get('user', None)
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))

            if username_req is None:
                user = User.objects.get(username=username, name_space=name_space)
            else:
                user = User.objects.get(username=username_req, name_space=name_space)
            # name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))
            # user = User.objects.get(username=username, name_space=name_space)
            collection = Collection.objects.get(collection_id=collection)
            distinct_areas = AddConcept.objects.filter(collection_id=collection).distinct('name')
            distinct_areas = [x.name_id for x in distinct_areas]
            if document == '':
                documents = Document.objects.filter(collection_id=collection)
            else:
                documents = Document.objects.filter(collection_id=collection, document_id=document)
            json_doc = {}
            json_doc['concepts_per_area'] = {}
            json_doc['count_per_area'] = {}
            for area in distinct_areas:
                area_obj = SemanticArea.objects.get(name=area)
                json_doc['concepts_per_area'][area] = {}
                json_doc['count_per_area'][area] = Associate.objects.filter(document_id__in=documents,
                                                                            name_space=name_space, username=user,
                                                                            name=area_obj).count()
                concepts = Associate.objects.filter(document_id__in=documents, name_space=name_space, username=user,name=area_obj).values('concept_url').order_by(
                    'concept_url').annotate(count=Count('concept_url'))
                for concept in concepts:
                    con = Concept.objects.get(concept_url=concept['concept_url'])
                    json_doc['concepts_per_area'][area][con.concept_name] = concept['count']

            return JsonResponse(json_doc)

        elif type == 'concept_area' and collection_id == 'global':
            document = request.GET.get('document')
            collection = request.GET.get('collection')
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))
            collection = Collection.objects.get(collection_id=collection)
            distinct_areas = AddConcept.objects.filter(collection_id=collection).distinct('name')
            distinct_areas = [x.name_id for x in distinct_areas]
            if document == '':
                documents = Document.objects.filter(collection_id = collection)
            else:
                documents = Document.objects.filter(collection_id = collection,document_id = document)
            json_doc = {}
            json_doc['concepts_per_area'] = {}
            json_doc['count_per_area'] = {}
            for area in distinct_areas:
                area_obj = SemanticArea.objects.get(name=area)
                json_doc['concepts_per_area'][area] = {}
                json_doc['count_per_area'][area] = Associate.objects.filter(document_id__in=documents,
                                                                            name_space=name_space,
                                                                            name=area_obj).count()
                concepts = Associate.objects.filter(document_id__in=documents, name_space=name_space,
                                                    name=area_obj).values('concept_url').order_by('concept_url').annotate(count=Count('concept_url'))

                for concept in concepts:
                    con = Concept.objects.get(concept_url = concept['concept_url'])
                    json_doc['concepts_per_area'][area][con.concept_name] = concept['count']
            return JsonResponse(json_doc)

        elif type == 'general' and collection_id == 'personal':
            document = request.GET.get('document')
            collection = request.GET.get('collection')
            json_doc = {}
            username_req = request.GET.get('user', None)
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))

            if username_req is None:
                user = User.objects.get(username=username, name_space=name_space)
            else:
                user = User.objects.get(username=username_req, name_space=name_space)
            # name_space = NameSpace.objects.get(name_space = request.session.get('name_space'))
            # user = User.objects.get(username=username,name_space = name_space)
            collection = Collection.objects.get(collection_id = collection)
            if document == '':
                documents = Document.objects.filter(collection_id = collection)
                json_doc['annotated_documents'] = GroundTruthLogFile.objects.filter(document_id__in=documents,name_space=name_space,
                                                           username=user).count()
            else:
                documents = Document.objects.filter(collection_id = collection,document_id = document)
            json_doc['mentions'] = Annotate.objects.filter(document_id__in=documents, name_space=name_space,
                                                           username=user).count()
            json_doc['concepts'] = Associate.objects.filter(document_id__in=documents, name_space=name_space,
                                                            username=user).count()
            json_doc['labels'] = AnnotateLabel.objects.filter(document_id__in=documents, name_space=name_space,
                                                              username=user).count()
            json_doc['assertions'] = CreateFact.objects.filter(document_id__in=documents, name_space=name_space,
                                                               username=user).count()
            documents_list_ids = [x.document_id for x in documents]
            json_doc['relationships'] = Link.objects.filter(subject_document_id__in=documents_list_ids,name_space=name_space,
                                                            username=user).count() + RelationshipPredConcept.objects.filter(subject_document_id__in=documents_list_ids, name_space=name_space,username=user).count() + \
                                        RelationshipObjConcept.objects.filter(subject_document_id__in=documents_list_ids, name_space=name_space, username=user).count() + RelationshipSubjConcept.objects.filter(object_document_id__in=documents_list_ids, name_space=name_space,
                username=user).count() + RelationshipSubjMention.objects.filter(document_id__in=documents,
                                                                                name_space=name_space,
                                                                                username=user).count() + RelationshipObjMention.objects.filter(
                document_id__in=documents, name_space=name_space,
                username=user).count() + RelationshipPredMention.objects.filter(document_id__in=documents,
                                                                                name_space=name_space,
                                                                                username=user).count()
            return JsonResponse(json_doc)


        elif type == 'annotators_per_document' and collection_id is not None:
            collection = Collection.objects.get(collection_id = collection_id)
            documents = Document.objects.filter(collection_id = collection)
            # documents = GroundTruthLogFile.objects.filter(document_id__in=documents).annotate(count=Count('document_id')).order_by('count')

            json_resp = {}
            dict_docs = []
            for document in documents:
                json_resp[document.document_id] = {}
                json_resp[document.document_id]['count'] = GroundTruthLogFile.objects.filter(document_id = document).exclude(username = user_iaa).count()
                annotators_list = GroundTruthLogFile.objects.filter(document_id = document).exclude(username = user_iaa).distinct('username')
                json_resp[document.document_id]['annotators'] = [x.username_id for x in annotators_list]
            return JsonResponse(json_resp)


        elif type == 'annotation_per_document' and collection_id is not None:
            user = request.session['username']
            username_req = request.GET.get('user', None)
            name_space = NameSpace.objects.get(name_space=request.session.get('name_space'))

            if username_req is None:
                user = User.objects.get(username=username, name_space=name_space)
            else:
                user = User.objects.get(username=username_req, name_space=name_space)
            # user = User.objects.get(username=user, name_space = name_space)
            collection = Collection.objects.get(collection_id = collection_id)
            documents = Document.objects.filter(collection_id = collection)
            json_resp = {}
            dict_docs = []

            for document in documents:
                json_resp[document.document_id] = {}
                json_resp[document.document_id]['count'] = 0
                json_resp[document.document_id]['mentions'] = Annotate.objects.filter(document_id = document, username = user, name_space = name_space).exclude(username = user_iaa).count()
                json_resp[document.document_id]['concepts'] = Associate.objects.filter(document_id = document, username = user, name_space = name_space).exclude(username = user_iaa).count()
                json_resp[document.document_id]['labels'] = AnnotateLabel.objects.filter(document_id = document, username = user, name_space = name_space).exclude(username = user_iaa).count()
                json_resp[document.document_id]['assertions'] = CreateFact.objects.filter(document_id = document, username = user, name_space = name_space).exclude(username = user_iaa).count()
                json_resp[document.document_id]['relationships'] = Link.objects.filter(subject_document_id = document.document_id, username = user, name_space = name_space).exclude(username = user_iaa).count() + RelationshipPredConcept.objects.filter(subject_document_id = document.document_id, username = user, name_space = name_space).exclude(username = user_iaa).count() + RelationshipSubjConcept.objects.filter(object_document_id = document.document_id, username = user, name_space = name_space).exclude(username = user_iaa).count() + RelationshipObjConcept.objects.filter(subject_document_id = document.document_id, username = user, name_space = name_space).exclude(username = user_iaa).count() + RelationshipPredMention.objects.filter(document_id = document, username = user, name_space = name_space).exclude(username = user_iaa).count() + RelationshipSubjMention.objects.filter(document_id = document, username = user, name_space = name_space).exclude(username = user_iaa).count() + RelationshipObjMention.objects.filter(document_id = document, username = user, name_space = name_space).exclude(username = user_iaa).count()
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['mentions']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['concepts']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['relationships']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['assertions']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['labels']
                dict_docs.append([document.document_id,json_resp[document.document_id]['count']])
            #prima vedo quello con più annotazioni.
            json_to_ret = {}
            json_to_ret['mentions'] = []
            json_to_ret['concepts'] = []
            json_to_ret['relationships'] = []
            json_to_ret['assertions'] = []
            json_to_ret['documents'] = []
            json_to_ret['labels'] = []
            dict_docs = sorted(dict_docs, key=lambda x: x[1],reverse=True)
            for k in dict_docs:
                json_to_ret['documents'].append(k[0])
                json_to_ret['mentions'].append(json_resp[k[0]]['mentions'])
                json_to_ret['concepts'].append(json_resp[k[0]]['concepts'])
                json_to_ret['labels'].append(json_resp[k[0]]['labels'])
                json_to_ret['assertions'].append(json_resp[k[0]]['assertions'])
                json_to_ret['relationships'].append(json_resp[k[0]]['relationships'])



            return JsonResponse(json_to_ret)

        elif type == 'annotation_per_document_global' and collection_id is not None:
            st = time.time()
            user = request.session['username']
            name_space = request.session['name_space']
            name_space = NameSpace.objects.get(name_space = name_space)
            user = User.objects.get(username=user, name_space = name_space)
            collection = Collection.objects.get(collection_id = collection_id)
            documents = Document.objects.filter(collection_id = collection)
            json_resp = {}
            dict_docs = []

            for document in documents:
                json_resp[document.document_id] = {}
                json_resp[document.document_id]['count'] = 0
                json_resp[document.document_id]['mentions'] = Annotate.objects.filter(document_id = document).exclude(username = user_iaa).count()
                json_resp[document.document_id]['concepts'] = Associate.objects.filter(document_id = document).exclude(username = user_iaa).count()
                json_resp[document.document_id]['labels'] = AnnotateLabel.objects.filter(document_id = document).exclude(username = user_iaa).count()
                json_resp[document.document_id]['assertions'] = CreateFact.objects.filter(document_id = document).exclude(username = user_iaa).count()
                json_resp[document.document_id]['relationships'] = Link.objects.filter(subject_document_id = document.document_id).exclude(username = user_iaa).count() + RelationshipPredConcept.objects.filter(subject_document_id = document.document_id).exclude(username = user_iaa).count() + RelationshipSubjConcept.objects.filter(object_document_id = document.document_id).exclude(username = user_iaa).count() + RelationshipObjConcept.objects.filter(subject_document_id = document.document_id).exclude(username = user_iaa).count() + RelationshipPredMention.objects.filter(document_id = document).exclude(username = user_iaa).count() + RelationshipSubjMention.objects.filter(document_id = document).exclude(username = user_iaa).count() + RelationshipObjMention.objects.filter(document_id = document).exclude(username = user_iaa).count()
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['mentions']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['concepts']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['relationships']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['assertions']
                json_resp[document.document_id]['count'] += json_resp[document.document_id]['labels']
                dict_docs.append([document.document_id,json_resp[document.document_id]['count']])
            #prima vedo quello con più annotazioni.
            json_to_ret = {}

            json_to_ret['iaa'] = {}
            json_to_ret['mentions'] = []
            json_to_ret['concepts'] = []
            json_to_ret['relationships'] = []
            json_to_ret['assertions'] = []
            json_to_ret['documents'] = []
            json_to_ret['labels'] = []
            json_to_ret['iaa']['mentions'] = []
            json_to_ret['iaa']['concepts'] = []
            json_to_ret['iaa']['relationships'] = []
            json_to_ret['iaa']['assertions'] = []
            json_to_ret['iaa']['documents'] = []
            json_to_ret['iaa']['labels'] = []

            dict_docs = sorted(dict_docs, key=lambda x: x[1],reverse=True)
            for k in dict_docs:
                # print(k[0])
                json_to_ret['documents'].append(k[0])
                json_to_ret['mentions'].append(json_resp[k[0]]['mentions'])
                json_to_ret['concepts'].append(json_resp[k[0]]['concepts'])
                json_to_ret['labels'].append(json_resp[k[0]]['labels'])
                json_to_ret['assertions'].append(json_resp[k[0]]['assertions'])
                json_to_ret['relationships'].append(json_resp[k[0]]['relationships'])

                mention_agreement = global_mentions_agreement(collection.collection_id,k[0])
                concepts_agreement = global_concepts_agreement(collection.collection_id,k[0])
                rels_agreement = global_relationships_agreement(collection.collection_id,k[0])
                ass_agreement = global_createfact_agreement(collection.collection_id,k[0])
                labels_agreement = global_labels_agreement(collection.collection_id,k[0])
                json_to_ret['iaa']['mentions'] = round(mention_agreement, 3) if mention_agreement != '' else ''
                json_to_ret['iaa']['concepts'] = round(concepts_agreement, 3) if concepts_agreement != '' else ''
                json_to_ret['iaa']['labels'] = round(labels_agreement, 3) if labels_agreement != '' else ''
                json_to_ret['iaa']['assertions'] = round(ass_agreement, 3) if ass_agreement != '' else ''
                json_to_ret['iaa']['relationships'] = round(rels_agreement, 3) if rels_agreement != '' else ''
            end = time.time()
            print(end-st)
            return JsonResponse(json_to_ret)

        #
        # elif type == username or type == 'global':
        #     if type == username:
        #         name_space = NameSpace.objects.get(name_space = request.session['name_space'])
        #         user = User.objects.get(username = username,name_space=name_space)
        #     collection = collection_id
        #     collection = Collection.objects.get(collection_id = collection)
        #     documents = Document.objects.filter(collection_id = collection)
        #     json_doc = {}
        #     json_doc['iaa'] = {}
        #     # get the statistics of the user related to the collection, or to a specific document of the collection
        #     document = request.GET.get('document',None)
        #     # print(document)
        #     # print(isinstance(document,str))
        #     distinct_areas = AddConcept.objects.filter(collection_id=collection).distinct('name')
        #     distinct_areas = [x.name_id for x in distinct_areas]
        #
        #     # solo quelle generali dell'utente!
        #     if document is not None and document != False and document != '':
        #         document_id = Document.objects.get(document_id = document)
        #
        #         if type == username:
        #             json_doc['mentions'] = Annotate.objects.filter(document_id=document_id,name_space = name_space, username = user).count()
        #             json_doc['concepts'] = Associate.objects.filter(document_id=document_id,name_space = name_space, username = user).count()
        #             json_doc['labels'] = AnnotateLabel.objects.filter(document_id=document_id,name_space = name_space, username = user).count()
        #             json_doc['assertions'] = CreateFact.objects.filter(document_id=document_id,name_space = name_space, username = user).count()
        #             json_doc['relationships'] = Link.objects.filter(subject_document_id=document_id.document_id,name_space = name_space, username = user).count() + RelationshipPredConcept.objects.filter(subject_document_id=document_id.document_id,name_space = name_space, username = user).count()+ RelationshipObjConcept.objects.filter(subject_document_id=document_id.document_id, name_space=name_space, username=user).count() + RelationshipSubjConcept.objects.filter(object_document_id=document_id.document_id, name_space=name_space, username=user).count() + RelationshipSubjMention.objects.filter(document_id=document_id, name_space=name_space, username=user).count() + RelationshipObjMention.objects.filter(document_id=document_id, name_space=name_space, username=user).count() + RelationshipPredMention.objects.filter(document_id=document_id, name_space=name_space, username=user).count()
        #
        #
        #         elif type == 'global':
        #             mention_agreement = global_mentions_agreement(collection.collection_id,document_id.document_id)
        #             concepts_agreement = global_concepts_agreement(collection.collection_id,document_id.document_id)
        #             rels_agreement = global_relationships_agreement(collection.collection_id,document_id.document_id)
        #             ass_agreement = global_createfact_agreement(collection.collection_id,document_id.document_id)
        #             labels_agreement = global_labels_agreement(collection.collection_id,document_id.document_id)
        #
        #             json_doc['iaa']['mentions'] = round(mention_agreement,3) if mention_agreement != '' else ''
        #             json_doc['iaa']['concepts'] = round(concepts_agreement,3) if concepts_agreement != '' else ''
        #             json_doc['iaa']['labels'] = round(labels_agreement,3)  if labels_agreement != '' else ''
        #             json_doc['iaa']['assertions'] = round(ass_agreement,3) if ass_agreement != '' else ''
        #             json_doc['iaa']['relationships'] = round(rels_agreement,3) if rels_agreement != '' else ''
        #             annotators = GroundTruthLogFile.objects.filter(document_id=document).distinct('username')
        #             annos = [x.username_id for x in annotators]
        #             json_doc['annotators'] = len(annos)
        #             json_doc['annotators_list'] = annos
        #             # json_doc['iaa']['mentions'] = round(global_mentions_agreement(collection.collection_id,document_id.document_id),3)
        #             # json_doc['iaa']['concepts'] = round(global_concepts_agreement(collection.collection_id,document_id.document_id),3)
        #             # json_doc['iaa']['labels'] = round(global_labels_agreement(collection.collection_id,document_id.document_id),3)
        #             # json_doc['iaa']['assertions'] = round(global_createfact_agreement(collection.collection_id,document_id.document_id),3)
        #             # json_doc['iaa']['relationships'] = round(global_relationships_agreement(collection.collection_id,document_id.document_id),3)
        #
        #             json_doc['mentions'] = Annotate.objects.filter(document_id=document_id).exclude(username = user_iaa).count()
        #             json_doc['concepts'] = Associate.objects.filter(document_id=document_id).exclude(username = user_iaa).count()
        #             json_doc['labels'] = AnnotateLabel.objects.filter(document_id=document_id).exclude(username = user_iaa).count()
        #             json_doc['assertions'] = CreateFact.objects.filter(document_id=document_id).exclude(username = user_iaa).count()
        #             json_doc['relationships'] = Link.objects.filter(subject_document_id=document_id.document_id).exclude(username = user_iaa).count() + RelationshipPredConcept.objects.filter(
        #                 subject_document_id=document_id.document_id).exclude(username = user_iaa).count() + RelationshipObjConcept.objects.filter(
        #                 subject_document_id=document_id.document_id).exclude(username = user_iaa).count() + RelationshipSubjConcept.objects.filter(
        #                 object_document_id=document_id.document_id).exclude(username = user_iaa).count() + RelationshipSubjMention.objects.filter(document_id=document_id).count() + RelationshipObjMention.objects.filter(
        #                 document_id=document_id).exclude(username = user_iaa).count() + RelationshipPredMention.objects.filter(document_id=document_id).exclude(username = user_iaa).count()
        #
        #
        #
        #     else:
        #         if type == username:
        #             json_doc['annotated_documents'] = GroundTruthLogFile.objects.filter(document_id__in=documents,name_space = name_space, username = user).count()
        #
        #             json_doc['mentions'] = Annotate.objects.filter(document_id__in=documents, name_space=name_space,
        #                                                            username=user).count()
        #             json_doc['concepts'] = Associate.objects.filter(document_id__in=documents, name_space=name_space,
        #                                                             username=user).count()
        #             json_doc['labels'] = AnnotateLabel.objects.filter(document_id__in=documents, name_space=name_space,
        #                                                               username=user).count()
        #             json_doc['assertions'] = CreateFact.objects.filter(document_id__in=documents, name_space=name_space,
        #                                                                username=user).count()
        #             documents_list_ids = [x.document_id for x in documents]
        #             json_doc['relationships'] = Link.objects.filter(subject_document_id__in=documents_list_ids,
        #                                                             name_space=name_space,
        #                                                             username=user).count() + RelationshipPredConcept.objects.filter(
        #                 subject_document_id__in=documents_list_ids, name_space=name_space,
        #                 username=user).count() + RelationshipObjConcept.objects.filter(
        #                 subject_document_id__in=documents_list_ids, name_space=name_space,
        #                 username=user).count() + RelationshipSubjConcept.objects.filter(
        #                 object_document_id__in=documents_list_ids, name_space=name_space,
        #                 username=user).count() + RelationshipSubjMention.objects.filter(document_id__in=documents,
        #                                                                                 name_space=name_space,
        #                                                                                 username=user).count() + RelationshipObjMention.objects.filter(
        #                 document_id__in=documents, name_space=name_space,
        #                 username=user).count() + RelationshipPredMention.objects.filter(document_id__in=documents,
        #                                                                                 name_space=name_space,
        #                                                                                 username=user).count()
        #         elif type == 'global':
        #             st = time.time()
        #             mention_agreement = global_mentions_agreement(collection.collection_id)
        #             concepts_agreement = global_concepts_agreement(collection.collection_id)
        #             rels_agreement = global_relationships_agreement(collection.collection_id)
        #             ass_agreement = global_createfact_agreement(collection.collection_id)
        #             labels_agreement = global_labels_agreement(collection.collection_id)
        #             json_doc['iaa']['mentions'] = round(mention_agreement,3) if mention_agreement != '' else ''
        #             json_doc['iaa']['concepts'] = round(concepts_agreement,3) if concepts_agreement != '' else ''
        #             json_doc['iaa']['labels'] = round(labels_agreement,3)  if labels_agreement != '' else ''
        #             json_doc['iaa']['assertions'] = round(ass_agreement,3) if ass_agreement != '' else ''
        #             json_doc['iaa']['relationships'] = round(rels_agreement,3) if rels_agreement != '' else ''
        #             end = time.time()
        #             print('time_taken first: ',str(end-st))
        #             json_doc['annotated_documents'] = GroundTruthLogFile.objects.filter(document_id__in=documents).distinct('document_id').count()
        #             annotators = GroundTruthLogFile.objects.filter(document_id__in=documents).distinct('username')
        #             annos = [x.username_id for x in annotators]
        #             json_doc['annotators'] = len(annos)
        #             json_doc['annotators_list'] = annos
        #             json_doc['mentions'] = Annotate.objects.filter(document_id__in=documents).exclude(username = user_iaa).count()
        #             json_doc['concepts'] = Associate.objects.filter(document_id__in=documents).exclude(username = user_iaa).count()
        #             json_doc['labels'] = AnnotateLabel.objects.filter(document_id__in=documents).exclude(username = user_iaa).count()
        #             json_doc['assertions'] = CreateFact.objects.filter(document_id__in=documents).exclude(username = user_iaa).count()
        #             documents_list_ids = [x.document_id for x in documents]
        #             json_doc['relationships'] = Link.objects.filter(subject_document_id__in=documents_list_ids).exclude(username = user_iaa).count() + RelationshipPredConcept.objects.filter(
        #                 subject_document_id__in=documents_list_ids).exclude(username = user_iaa).count() + RelationshipObjConcept.objects.filter(
        #                 subject_document_id__in=documents_list_ids).exclude(username = user_iaa).count() + RelationshipSubjConcept.objects.filter(
        #                 object_document_id__in=documents_list_ids).exclude(username = user_iaa).count() + RelationshipSubjMention.objects.filter(document_id__in=documents).exclude(username = user_iaa).count() + RelationshipObjMention.objects.filter(
        #                 document_id__in=documents).exclude(username = user_iaa).count() + RelationshipPredMention.objects.filter(document_id__in=documents).exclude(username = user_iaa).count()
        #
        #
        #     # trovo concetti associati a ciascuna area dati come associazione mention-concetto dall'utente loggato
        #     json_doc['count_per_area'] = {}
        #     json_doc['concepts_per_area'] = {}
        #     json_doc['concepts_relationships_per_area'] = {}
        #     json_doc['global'] = {}
        #     json_doc['predicate'] = {}
        #     json_doc['subject'] = {}
        #     json_doc['object'] = {}
        #     st = time.time()
        #     for area in distinct_areas:
        #         area_obj = SemanticArea.objects.get(name=area)
        #         json_doc['predicate'][area] = {}
        #         json_doc['predicate'][area]['count'] = 0
        #         json_doc['subject'][area] = {}
        #         json_doc['subject'][area]['count'] = 0
        #         json_doc['object'][area] = {}
        #         json_doc['object'][area]['count'] = 0
        #         json_doc['concepts_per_area'][area] = {}
        #         # qui colleziono le mentions trovate il cui concetto collegato è della relativa area
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 json_doc['count_per_area'][area] = Associate.objects.filter(document_id=document_id,
        #                                                                             name_space=name_space, username=user,
        #                                                                             name=area_obj).count()
        #                 concepts = Associate.objects.filter(document_id=document_id, name_space=name_space, username=user,
        #                                                     name=area_obj).values('concept_url').order_by(
        #                     'concept_url').annotate(count=Count('concept_url'))
        #             elif type == 'global':
        #                 json_doc['count_per_area'][area] = Associate.objects.filter(document_id=document_id,
        #                                                                            name=area_obj).exclude(username = user_iaa).count()
        #                 concepts = Associate.objects.filter(document_id=document_id,
        #                                                     name=area_obj).exclude(username = user_iaa).values('concept_url').order_by(
        #                     'concept_url').annotate(count=Count('concept_url'))
        #
        #         else:
        #             if type == username:
        #
        #                 json_doc['count_per_area'][area] = Associate.objects.filter(document_id__in=documents,
        #                                                                             name_space=name_space, username=user,
        #                                                                             name=area_obj).count()
        #                 concepts = Associate.objects.filter(document_id__in=documents, name_space=name_space, username=user,
        #                                                 name=area_obj).values('concept_url').order_by('concept_url').annotate(count=Count('concept_url'))
        #             elif type == 'global':
        #                 json_doc['count_per_area'][area] = Associate.objects.filter(document_id__in=documents,
        #                                                                             name=area_obj).exclude(username = user_iaa).count()
        #                 concepts = Associate.objects.filter(document_id__in=documents,
        #                                                     name=area_obj).exclude(username = user_iaa).values('concept_url').order_by(
        #                     'concept_url').annotate(count=Count('concept_url'))
        #
        #         # json_doc['count_concetps_per_area'][area] = Associate.objects.filter(document_id__in=documents,name_space = name_space, username = user,name=area_obj).count()
        #
        #
        #         for concept in concepts:
        #             con = Concept.objects.get(concept_url = concept['concept_url'])
        #             json_doc['concepts_per_area'][area][con.concept_name] = concept['count']
        #
        #         # IN GLOBAL PIE METTO TUTTI I CONCETTI INDISTINTAMENTE
        #         if not (document is not None and document != False and document != ''):
        #             if type == username:
        #                 json_doc['global'][area] = Associate.objects.filter(document_id__in=documents,name_space = name_space, username = user,name=area_obj).count()
        #                 json_doc['global'][area] += RelationshipPredConcept.objects.filter(subject_document_id__in=documents_list_ids,name_space = name_space, username = user,name=area_obj).count()
        #                 json_doc['global'][area] += RelationshipObjConcept.objects.filter(subject_document_id__in=documents_list_ids,name_space = name_space, username = user,name=area_obj).count()
        #                 json_doc['global'][area] += RelationshipSubjConcept.objects.filter(object_document_id__in=documents_list_ids,name_space = name_space, username = user,name=area_obj).count()
        #                 json_doc['global'][area] += CreateFact.objects.filter(document_id__in=documents,name_space = name_space, username = user,subject_name=area_obj.name).count()
        #                 json_doc['global'][area] += CreateFact.objects.filter(document_id__in=documents,name_space = name_space, username = user,object_name=area_obj.name).count()
        #                 json_doc['global'][area] += CreateFact.objects.filter(document_id__in=documents,name_space = name_space, username = user,predicate_name=area_obj.name).count()
        #                 json_doc['global'][area] += RelationshipObjMention.objects.filter(document_id__in=documents,name_space = name_space, username = user,subject_name=area_obj.name).count()
        #                 json_doc['global'][area] += RelationshipObjMention.objects.filter(document_id__in=documents,name_space = name_space, username = user,predicate_name=area_obj.name).count()
        #                 json_doc['global'][area] += RelationshipSubjMention.objects.filter(document_id__in=documents,name_space = name_space, username = user,object_name=area_obj.name).count()
        #                 json_doc['global'][area] += RelationshipSubjMention.objects.filter(document_id__in=documents,name_space = name_space, username = user,predicate_name=area_obj.name).count()
        #                 json_doc['global'][area] += RelationshipPredMention.objects.filter(document_id__in=documents,name_space = name_space, username = user,object_name=area_obj.name).count()
        #                 json_doc['global'][area] += RelationshipPredMention.objects.filter(document_id__in=documents,name_space = name_space, username = user,subject_name=area_obj.name).count()
        #             elif type == 'global':
        #                 json_doc['global'][area] = Associate.objects.filter(document_id__in=documents,
        #                                                                     name=area_obj).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipPredConcept.objects.filter(
        #                     subject_document_id__in=documents_list_ids,name=area_obj).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipObjConcept.objects.filter(
        #                     subject_document_id__in=documents_list_ids, name=area_obj).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipSubjConcept.objects.filter(
        #                     object_document_id__in=documents_list_ids, name=area_obj).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += CreateFact.objects.filter(document_id__in=documents,
        #                                                                       subject_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += CreateFact.objects.filter(document_id__in=documents,
        #                                                                       object_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += CreateFact.objects.filter(document_id__in=documents,
        #                                                                       predicate_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipObjMention.objects.filter(document_id__in=documents,
        #                                                                                   subject_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipObjMention.objects.filter(document_id__in=documents,
        #                                                                                   predicate_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipSubjMention.objects.filter(document_id__in=documents,
        #                                                                                    object_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipSubjMention.objects.filter(document_id__in=documents,
        #                                                                                    predicate_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipPredMention.objects.filter(document_id__in=documents,
        #                                                                                    object_name=area_obj.name).exclude(username = user_iaa).count()
        #                 json_doc['global'][area] += RelationshipPredMention.objects.filter(document_id__in=documents,
        #                                                                                    subject_name=area_obj.name).exclude(username = user_iaa).count()
        #
        #         # prima vedo se le mentions che partecipano a una relazione rispettano vincolo su sermantic area
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 associations = Associate.objects.filter(document_id=document_id,name_space = name_space, username = user,name=area_obj)
        #             elif type == 'global':
        #                 associations = Associate.objects.filter(document_id=document_id, name=area_obj).exclude(username = user_iaa)
        #
        #         else:
        #             if type == username:
        #                 associations = Associate.objects.filter(document_id__in=documents,name_space = name_space, username = user,name=area_obj)
        #             elif type == 'global':
        #                 associations = Associate.objects.filter(document_id__in=documents, name=area_obj).exclude(username = user_iaa)
        #
        #         for asso in associations:
        #             concept = asso.concept_url
        #             mention = Mention.objects.get(document_id = asso.document_id, start = asso.start_id, stop = asso.stop)
        #             if type == username:
        #                 links_subj = Link.objects.filter(username = user, name_space = name_space,subject_document_id = asso.document_id.document_id, subject_start = asso.start_id, subject_stop = asso.stop)
        #             elif type == 'global':
        #                 links_subj = Link.objects.filter(subject_document_id = asso.document_id.document_id, subject_start = asso.start_id, subject_stop = asso.stop).exclude(username = user_iaa)
        #
        #             if links_subj.exists():
        #                 json_doc['subject'][area]['count'] += links_subj.count()
        #                 if concept.concept_name in json_doc['subject'][area].keys():
        #                     json_doc['subject'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['subject'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 links_obj = Link.objects.filter(username=user,name_space=name_space,object_document_id = asso.document_id.document_id, object_start = asso.start_id, object_stop = asso.stop)
        #             elif type == 'global':
        #                 links_obj = Link.objects.filter(object_document_id=asso.document_id.document_id,
        #                                             object_start=asso.start_id, object_stop=asso.stop).exclude(username = user_iaa)
        #             if links_obj.exists():
        #                 json_doc['object'][area]['count'] += links_obj.count()
        #                 if concept.concept_name in json_doc['object'][area].keys():
        #                     json_doc['object'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['object'][area][concept.concept_name] = 1
        #
        #
        #             if type == username:
        #                 links_pred = Link.objects.filter(username=user,name_space=name_space,predicate_document_id = asso.document_id.document_id, predicate_start = asso.start_id, predicate_stop = asso.stop)
        #             elif type == 'global':
        #                 links_pred = Link.objects.filter(predicate_document_id = asso.document_id.document_id, predicate_start = asso.start_id, predicate_stop = asso.stop).exclude(username = user_iaa)
        #
        #             if links_pred.exists():
        #                 json_doc['predicate'][area]['count'] += links_pred.count()
        #                 if concept.concept_name in json_doc['predicate'][area].keys():
        #                     json_doc['predicate'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['predicate'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 subj_mention = RelationshipSubjMention.objects.filter(username = user,name_space = name_space,document_id = asso.document_id, start = mention, stop = asso.stop)
        #             elif type == 'global':
        #                 subj_mention = RelationshipSubjMention.objects.filter(document_id = asso.document_id, start = mention, stop = asso.stop).exclude(username = user_iaa)
        #             if subj_mention.exists():
        #                 json_doc['subject'][area]['count'] += subj_mention.count()
        #                 if concept.concept_name in json_doc['subject'][area].keys():
        #                     json_doc['subject'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['subject'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 obj_mention = RelationshipObjMention.objects.filter(username=user,name_space = name_space,document_id=asso.document_id, start=mention,
        #                                                                   stop=asso.stop)
        #             elif type == 'global':
        #                 obj_mention = RelationshipObjMention.objects.filter(document_id=asso.document_id, start=mention,
        #                                                                     stop=asso.stop).exclude(username = user_iaa)
        #
        #             if obj_mention.exists():
        #                 json_doc['object'][area]['count'] += obj_mention.count()
        #                 if concept.concept_name in json_doc['object'][area].keys():
        #                     json_doc['object'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['object'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #
        #                 pred_mention = RelationshipPredMention.objects.filter(username=user,name_space=name_space,document_id=asso.document_id,
        #                                                                   start=mention,
        #                                                                   stop=asso.stop)
        #             elif type == 'global':
        #                 pred_mention = RelationshipPredMention.objects.filter(document_id=asso.document_id,
        #                                                                       start=mention,
        #                                                                       stop=asso.stop).exclude(username = user_iaa)
        #             if pred_mention.exists():
        #                 json_doc['predicate'][area]['count'] += pred_mention.count()
        #                 if concept.concept_name in json_doc['predicate'][area].keys():
        #                     json_doc['predicate'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['predicate'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 subj_concept_1 = RelationshipSubjConcept.objects.filter(username=user,name_space = name_space,object_document_id=asso.document_id, object_start=mention.start,
        #                                                                   object_stop=asso.stop)
        #             elif type == 'global':
        #                 subj_concept_1 = RelationshipSubjConcept.objects.filter(
        #                                                                         object_document_id=asso.document_id,
        #                                                                         object_start=mention.start,
        #                                                                         object_stop=asso.stop).exclude(username = user_iaa)
        #             if subj_concept_1.exists():
        #                 json_doc['object'][area]['count'] += subj_concept_1.count()
        #                 if concept.concept_name in json_doc['object'][area].keys():
        #                     json_doc['object'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['object'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 subj_concept_2 = RelationshipSubjConcept.objects.filter(username = user, name_space = name_space,predicate_document_id=asso.document_id, predicate_start=mention.start,
        #                                                                   predicate_stop=asso.stop)
        #             elif type == 'global':
        #                 subj_concept_2 = RelationshipSubjConcept.objects.filter(predicate_document_id=asso.document_id, predicate_start=mention.start,
        #                                                                   predicate_stop=asso.stop).exclude(username = user_iaa)
        #             if subj_concept_2.exists():
        #                 json_doc['predicate'][area]['count'] += subj_concept_2.count()
        #                 if concept.concept_name in json_doc['predicate'][area].keys():
        #                     json_doc['predicate'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['predicate'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 obj_concept_1 = RelationshipObjConcept.objects.filter(username=user,name_space=name_space,subject_document_id=asso.document_id,
        #                                                                     subject_start=mention.start,
        #                                                                     subject_stop=asso.stop)
        #             elif type == 'global':
        #                 obj_concept_1 = RelationshipObjConcept.objects.filter(subject_document_id=asso.document_id,
        #                                                                       subject_start=mention.start,
        #                                                                       subject_stop=asso.stop).exclude(username = user_iaa)
        #             if obj_concept_1.exists():
        #                 json_doc['subject'][area]['count'] += obj_concept_1.count()
        #                 if concept.concept_name in json_doc['subject'][area].keys():
        #                     json_doc['subject'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['subject'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 obj_concept_2 = RelationshipObjConcept.objects.filter(username=user,name_space=name_space,predicate_document_id=asso.document_id,
        #                                                                     predicate_start=mention.start,
        #                                                                     predicate_stop=asso.stop)
        #             elif type == 'global':
        #                 obj_concept_2 = RelationshipObjConcept.objects.filter(predicate_document_id=asso.document_id,
        #                                                                       predicate_start=mention.start,
        #                                                                       predicate_stop=asso.stop).exclude(username = user_iaa)
        #             if obj_concept_2.exists():
        #                 json_doc['predicate'][area]['count'] += obj_concept_2.count()
        #                 if concept.concept_name in json_doc['predicate'][area].keys():
        #                     json_doc['predicate'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['predicate'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 pred_concept_1 = RelationshipPredConcept.objects.filter(username=user,name_space=name_space,subject_document_id=asso.document_id,
        #                                                                     subject_start=mention.start,
        #                                                                     subject_stop=asso.stop)
        #             elif type == 'global':
        #                 pred_concept_1 = RelationshipPredConcept.objects.filter(subject_document_id=asso.document_id,
        #                                                                     subject_start=mention.start,
        #                                                                     subject_stop=asso.stop).exclude(username = user_iaa)
        #             if pred_concept_1.exists():
        #                 json_doc['subject'][area]['count'] += pred_concept_1.count()
        #                 if concept.concept_name in json_doc['subject'][area].keys():
        #                     json_doc['subject'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['subject'][area][concept.concept_name] = 1
        #
        #             if type == username:
        #                 pred_concept_2 = RelationshipPredConcept.objects.filter(username=user,name_space=name_space,object_document_id=asso.document_id,
        #                                                                     object_start=mention.start,
        #                                                                     object_stop=asso.stop)
        #             elif type == 'global':
        #                 pred_concept_2 = RelationshipPredConcept.objects.filter(object_document_id=asso.document_id,
        #                                                                         object_start=mention.start,
        #                                                                         object_stop=asso.stop).exclude(username = user_iaa)
        #             if pred_concept_2.exists():
        #                 json_doc['object'][area]['count'] += pred_concept_2.count()
        #                 if concept.concept_name in json_doc['object'][area].keys():
        #                     json_doc['object'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['object'][area][concept.concept_name] = 1
        #
        #
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 subj_all = CreateFact.objects.filter(username=user,name_space=name_space,document_id=document_id.document_id,subject_name=area_obj.name)
        #             elif type == 'global':
        #                 subj_all = CreateFact.objects.filter(document_id=document_id.document_id,subject_name=area_obj.name).exclude(username = user_iaa)
        #         else:
        #             if type == username:
        #
        #                 subj_all = CreateFact.objects.filter(document_id__in=documents_list_ids,
        #                                                               username=user, name_space=name_space,subject_name=area_obj.name)
        #             elif type == 'global':
        #                 subj_all = CreateFact.objects.filter(document_id__in=documents_list_ids,subject_name=area_obj.name).exclude(username = user_iaa)
        #
        #         if subj_all.exists():
        #             json_doc['subject'][area]['count'] += subj_all.count()
        #             for e in subj_all:
        #                 concept = Concept.objects.get(concept_url = e.subject_concept_url)
        #                 if concept.concept_name in json_doc['subject'][area].keys():
        #                     json_doc['subject'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['subject'][area][concept.concept_name] = 1
        #
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 subj_all = CreateFact.objects.filter(username=user, name_space=name_space,
        #                                                      document_id=document_id.document_id,
        #                                                      object_name=area_obj.name)
        #             elif type == 'global':
        #                 subj_all = CreateFact.objects.filter(document_id=document_id.document_id,
        #                                                      object_name=area_obj.name).exclude(username = user_iaa)
        #         else:
        #             if type == username:
        #
        #                 subj_all = CreateFact.objects.filter(document_id__in=documents_list_ids,
        #                                                      username=user, name_space=name_space,
        #                                                      object_name=area_obj.name)
        #             elif type == 'global':
        #                 subj_all = CreateFact.objects.filter(document_id__in=documents_list_ids,
        #                                                      object_name=area_obj.name).exclude(username = user_iaa)
        #
        #         if subj_all.exists():
        #             json_doc['object'][area]['count'] += subj_all.count()
        #             for e in subj_all:
        #                 concept = Concept.objects.get(concept_url = e.object_concept_url)
        #                 if concept.concept_name in json_doc['object'][area].keys():
        #                     json_doc['object'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['object'][area][concept.concept_name] = 1
        #
        #
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 subj_all = CreateFact.objects.filter(username=user, name_space=name_space,
        #                                                      document_id=document_id.document_id,
        #                                                      predicate_name=area_obj.name)
        #             elif type == 'global':
        #                 subj_all = CreateFact.objects.filter(document_id=document_id.document_id,
        #                                                      predicate_name=area_obj.name).exclude(username = user_iaa)
        #         else:
        #             if type == username:
        #
        #                 subj_all = CreateFact.objects.filter(document_id__in=documents_list_ids,
        #                                                      username=user, name_space=name_space,
        #                                                      predicate_name=area_obj.name)
        #             elif type == 'global':
        #                 subj_all = CreateFact.objects.filter(document_id__in=documents_list_ids,
        #                                                      predicate_name=area_obj.name).exclude(username = user_iaa)
        #
        #         if subj_all.exists():
        #             json_doc['predicate'][area]['count'] += subj_all.count()
        #             for e in subj_all:
        #                 concept = Concept.objects.get(concept_url = e.predicate_concept_url)
        #                 if concept.concept_name in json_doc['predicate'][area].keys():
        #                     json_doc['predicate'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['predicate'][area][concept.concept_name] = 1
        #
        #
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 subj_all = RelationshipSubjConcept.objects.filter(username=user,name_space=name_space,object_document_id=document_id.document_id,name=area_obj)
        #             elif type == 'global':
        #                 subj_all = RelationshipSubjConcept.objects.filter(object_document_id=document_id.document_id,name=area_obj).exclude(username = user_iaa)
        #         else:
        #             if type == username:
        #
        #                 subj_all = RelationshipSubjConcept.objects.filter(object_document_id__in=documents_list_ids,
        #                                                               username=user, name_space=name_space, name=area_obj)
        #             elif type == 'global':
        #                 subj_all = RelationshipSubjConcept.objects.filter(object_document_id__in=documents_list_ids,name=area_obj).exclude(username = user_iaa)
        #
        #         if subj_all.exists():
        #             json_doc['subject'][area]['count'] += subj_all.count()
        #             for e in subj_all:
        #                 concept = e.concept_url
        #                 if concept.concept_name in json_doc['subject'][area].keys():
        #                     json_doc['subject'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['subject'][area][concept.concept_name] = 1
        #
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 obj_all = RelationshipObjConcept.objects.filter(subject_document_id=document_id.document_id,
        #                                                                 username=user, name_space=name_space, name=area_obj)
        #             elif type == 'global':
        #                 obj_all = RelationshipObjConcept.objects.filter(subject_document_id=document_id.document_id, name=area_obj).exclude(username = user_iaa)
        #         else:
        #             if type == username:
        #                 obj_all = RelationshipObjConcept.objects.filter(subject_document_id__in=documents_list_ids,
        #                                                              username=user, name_space=name_space, name=area_obj)
        #             elif type == 'global':
        #                 obj_all = RelationshipObjConcept.objects.filter(subject_document_id__in=documents_list_ids,
        #                                                                 name=area_obj).exclude(username = user_iaa)
        #         if obj_all.exists():
        #             json_doc['object'][area]['count'] += obj_all.count()
        #             for e in obj_all:
        #                 concept = e.concept_url
        #                 if concept.concept_name in json_doc['object'][area].keys():
        #                     json_doc['object'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['object'][area][concept.concept_name] = 1
        #
        #
        #         if document is not None and document != False and document != '':
        #             if type == username:
        #                 pred_all = RelationshipPredConcept.objects.filter(subject_document_id=document_id.document_id, username=user,
        #                                                                 name_space=name_space, name=area_obj)
        #             elif type == 'global':
        #                 pred_all = RelationshipPredConcept.objects.filter(subject_document_id=document_id.document_id, name=area_obj).exclude(username = user_iaa)
        #         else:
        #             if type == username:
        #                 pred_all = RelationshipPredConcept.objects.filter(subject_document_id__in=documents_list_ids,
        #                                                               username=user,
        #                                                               name_space=name_space,
        #                                                                name=area_obj)
        #             elif type == 'global':
        #                 pred_all = RelationshipPredConcept.objects.filter(subject_document_id__in=documents_list_ids,name=area_obj).exclude(username = user_iaa)
        #         if pred_all.exists():
        #             json_doc['predicate'][area]['count'] += pred_all.count()
        #             for e in pred_all:
        #                 concept = e.concept_url
        #                 if concept.concept_name in json_doc['predicate'][area].keys():
        #                     json_doc['predicate'][area][concept.concept_name] += 1
        #                 else:
        #                     json_doc['predicate'][area][concept.concept_name] = 1
        #
        #     end = time.time()
        #     print('time_taken second: ',str(end-st))
        #     return JsonResponse(json_doc)



def annotate(request,type=None):
    username = request.session['username']
    if type is not None:
        name_space = NameSpace.objects.get(name_space = request.session['name_space'])
        user = User.objects.filter(username = request.session['username'],name_space = name_space)
        request.session['collection'] = type
        collection = Collection.objects.get(collection_id = type)
        documents = Document.objects.filter(collection_id = collection)
        gts = GroundTruthLogFile.objects.filter(document_id__in=documents,username = user).order_by('-insertion_time')
        if gts.exists():
            last_doc = gts.first().document_id
            request.session['document'] = last_doc.document_id
        else:
            request.session['document'] = documents.first().document_id

        if (not username):
            return redirect('RelAnno_App:login')

        baseurl = get_baseurl()
        if (username and baseurl != ''):
            profile = request.session.get('profile', False)

            context = {'username': username, 'profile': profile, 'baseurl': baseurl}
            return render(request, 'RelAnno_App/index.html', context)
        else:
            return redirect('RelAnno_App:login')



def collections(request,type = None):

    """Credits page for app"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)

    if (not username):
        return redirect('RelAnno_App:login')


    baseurl = get_baseurl()
    if(username and baseurl != ''):
        context = {'username': username,'profile':profile, 'baseurl':baseurl}

    if request.method == 'GET':

        if type is None:
            # username = request.session.get('username', False)
            # profile = request.session.get('profile', False)
            # if(username):
            # context = {'username': username,'profile':profile, 'baseurl':}
            return render(request, 'RelAnno_App/index.html', context)
            # else:
            #     return redirect('RelAnno_App:login')
        elif type=='name':
            collection = Collection.objects.get(collection_id=request.GET.get('collection',None))
            json_resp = {'name':collection.name}
            return JsonResponse(json_resp)

        elif Collection.objects.filter(collection_id = type).exists() or type == 'list':
            collection_param = type
            name_space = NameSpace.objects.get(name_space=request.session['name_space'])
            user = User.objects.get(username=request.session['username'], name_space=name_space)
            collections = ShareCollection.objects.filter(username=user)
            json_collections = {}
            json_collections['collections'] = []
            for c in collections:
                cid = c.collection_id_id
                json_boj = {}
                json_boj['status'] = c.status

                c = Collection.objects.get(collection_id=cid)
                batches = Document.objects.filter(collection_id=c).values('batch').annotate(
                    total=Count('batch')).order_by('total')

                json_boj['batch'] = []
                for b in batches:
                    j_b = {}
                    batch = 'batch ' + str(b['batch'])
                    j_b[batch] = b['total']
                    json_boj['batch'].append(j_b)

                json_boj['name'] = c.name
                json_boj['id'] = cid
                json_boj['description'] = c.description
                json_boj['creator'] = c.username
                json_boj['name_space'] = c.name_space
                json_boj['members'] = []
                time = str(c.insertion_time)
                before_p = time.split('+')
                first_split = before_p[0].split('.')[0]
                time = first_split + '+' + before_p[1]
                json_boj['insertion_time'] = time
                json_boj['date'] = time.split(' ')[0]
                json_boj['labels'] = []
                json_boj['documents_count'] = (Document.objects.filter(collection_id=cid).count())
                docs = Document.objects.filter(collection_id=cid)
                json_boj['annotations_count'] = (GroundTruthLogFile.objects.filter(document_id__in=docs).count())
                document_distinct_annotated = GroundTruthLogFile.objects.filter(document_id__in=docs).distinct('document_id').count()
                json_boj['annotated_documents'] = document_distinct_annotated
                json_boj['perc_annotations_all'] = float(
                    round((document_distinct_annotated / json_boj['documents_count']) * 100, 2))
                json_boj['user_annotations_count'] = (
                    GroundTruthLogFile.objects.filter(username=user, name_space=name_space,
                                                      document_id__in=docs).count())
                json_boj['perc_annotations_user'] = float(
                    round((json_boj['user_annotations_count'] / json_boj['documents_count']) * 100, 2))

                shared_with = ShareCollection.objects.filter(collection_id=c.collection_id)
                for el in shared_with:
                    us = User.objects.get(name_space=request.session['name_space'], username=el.username_id)
                    # if us.username != c.username:
                    json_boj['members'].append({'username': us.username, 'profile': us.profile, 'status':el.status})

                # controllo se sono tutti gli utenti appartengono a un profile esatto
                profiles = User.objects.all().values('profile')
                profiles = [p['profile'] for p in profiles]
                for p in profiles:
                    users = User.objects.filter(profile=p)
                    new_json_members = [j for j in json_boj['members'] if j['profile'] == p]

                    if len(users) == len(new_json_members):
                        json_boj['members'] = [j for j in json_boj['members'] if j['profile'] != p]
                        # json_boj['members'].append({'username': 'All' + p, 'profile': p})

                has_label = HasLabel.objects.filter(collection_id=c.collection_id)
                for el in has_label:
                    # label = Label.objects.get(name=el.name_id)
                    json_boj['labels'].append(el.name_id)
                json_boj['labels'] = list(set(json_boj['labels']))
                json_collections['collections'].append(json_boj)

                if collection_param is not None and collection_param == cid:  # in this case it was reqeusted a specific collection
                    # context = {'username': username, 'profile': profile}
                    return render(request, 'RelAnno_App/index.html', context)
                    # return redirect('RelAnno_App:documents')
            # return JsonResponse(json_boj)
            if type == 'list':
                json_collections['collections'] = sorted(json_collections['collections'], key=lambda x: x['insertion_time'])
                return JsonResponse(json_collections)

        elif type == 'concepts':
            concepts = create_concepts_list(collection=request.session['collection'])
            # print(concepts)
            return JsonResponse(concepts, safe=False)

        elif type == 'areas':
            collection = request.session.get('collection', None)
            if collection is not None:
                collection = Collection.objects.get(collection_id=collection)
                tuples = AddConcept.objects.filter(collection_id=collection).values('name').distinct()
                areas = [concept['name'] for concept in tuples]
                json_dict = {}
                json_dict['areas'] = areas
                return JsonResponse(json_dict)

        elif type == 'documents':
            collection = Collection.objects.get(collection_id=request.session['collection'])
            name_space = NameSpace.objects.get(name_space=request.session['name_space'])
            user = User.objects.get(username=request.session['username'], name_space=name_space)
            docs = Document.objects.filter(collection_id=collection)
            gts = GroundTruthLogFile.objects.filter(document_id__in=docs, username=user,
                                                       name_space=name_space).order_by("-insertion_time")
            annotated_docs = [x.document_id for x in gts]
            annotated_docs_id = [x.document_id for x in annotated_docs]
            not_annotated_docs = [x for x in docs if x.document_id not in annotated_docs_id]
            docs_list = []

            for document in annotated_docs:
                # gt = GroundTruthLogFile.objects.filter(document_id=document, username=user,
                #                                        name_space=name_space).exists()
                json_doc = {'id': document.document_content['document_id'],'hashed_id':document.document_id, 'annotated': True,'batch':document.batch}

                docs_list.append(json_doc)

            for document in not_annotated_docs:
                # gt = GroundTruthLogFile.objects.filter(document_id=document, username=user,
                #                                        name_space=name_space).exists()
                json_doc = {'id': document.document_content['document_id'],'hashed_id':document.document_id, 'annotated': False,'batch':document.batch}

                docs_list.append(json_doc)

            # print(docs_list)

            docs_list = sorted(docs_list, key=lambda x: x['id'])
            # print(docs_list)
            return JsonResponse(docs_list, safe=False)


        elif type == 'labels':
            collection = request.session.get('collection', None)
            collection = Collection.objects.get(collection_id=collection)
            labels = HasLabel.objects.filter(collection_id=collection)
            labels = [l.name_id for l in labels]
            return JsonResponse(labels, safe=False)

        elif type == 'users':
            collection = request.GET.get('collection', None)
            collection = Collection.objects.get(collection_id=collection)
            shared = ShareCollection.objects.filter(collection_id=collection)
            json_boj = {}
            json_boj['members'] = []
            for us in shared:
                print(us.username_id)
                name_space = NameSpace.objects.get(name_space = request.session['name_space'])
                us1 = User.objects.get(name_space=name_space, username=us.username_id)
                if us1.username != request.session['username']:
                    json_boj['members'].append({'username': us1.username, 'profile': us1.profile, 'status': us.status})

            # controllo se sono tutti gli utenti appartengono a un profile esatto
            profiles = User.objects.all().values('profile')
            return JsonResponse(json_boj)


    elif request.method == 'POST':
        if type == 'add_member':
            try:
                with transaction.atomic():
                    json_resp = {'msg': 'ok'}
                    # name_space = NameSpace.objects.get(name_space=request.session['name_space'])
                    request_body_json = json.loads(request.body)
                    members = request_body_json['members']
                    # for m in members:
                    # if m in ['All Professor','All Student','All Tech','All Beginner','All Expert','All Admin'] :
                    #     members_all = User.objects.filter(profile = m['username'].split('All')[1].strip()).exclude(username = request.session['username'])
                    #     members_all = [{'username':m.username} for m in members_all if m['username'] != request.session['username']]
                    #     members = members + members_all
                    collection = request_body_json['collection']
                    collection = Collection.objects.get(collection_id=collection)
                    # members = list(set(members))
                    members = members.split('\n')
                    for member in members:
                        # if member not in ['All Professor','All Student','All Tech','All Beginner','All Expert','All Admin']:
                        name_space = NameSpace.objects.get(name_space=request.session['name_space'])
                        users = User.objects.filter(username=member, name_space=name_space)
                        for user in users:
                            if not ShareCollection.objects.filter(collection_id=collection, username=user,
                                                                  name_space=user.name_space).exists():
                                ShareCollection.objects.create(collection_id=collection, username=user,
                                                               name_space=user.name_space, status='Invited')
            except Exception as e:
                print(e)
                json_resp = {'error': e}
            finally:
                return JsonResponse(json_resp)
        elif type == 'add_labels':
            try:
                with transaction.atomic():
                    json_resp = {'msg': 'ok'}

                    request_body_json = json.loads(request.body)
                    labels = request_body_json['labels'].split('\n')
                    collection = request_body_json['collection']
                    collection = Collection.objects.get(collection_id=collection)
                    for label in labels:
                        if len(label) > 0:
                            if not Label.objects.filter(name=label).exists():
                                label_to_add = Label.objects.create(name=label)
                            else:
                                label_to_add = Label.objects.get(name=label)
                            if not HasLabel.objects.filter(collection_id=collection, name=label_to_add).exists():
                                HasLabel.objects.create(collection_id=collection, name=label_to_add)


            except Exception as e:
                print(e)
                json_resp = {'error': e}
            finally:
                return JsonResponse(json_resp)
        else:
            try:
                with transaction.atomic():

                    name = request.POST.get('name', None)
                    labels = request.POST.get('labels', None)
                    description = request.POST.get('description', None)

                    to_enc = name + request.session['username']
                    collection_id = hashlib.md5(to_enc.encode()).hexdigest()
                    share_with = request.POST.get('members', None)
                    # if share_with in ['All Professor', 'All Student', 'All Beginner', 'All Expert', 'All Tech',
                    #                   'All Admin']:
                    #     members = User.objects.filter(profile=share_with.split('All')[1].strip())
                    #     share_with = [m.username for m in members]
                    # else:
                    if share_with == '' or share_with is None:
                        share_with = []
                    else:
                        share_with = share_with.split('\n')
                        share_with = [x.replace('\r','') for x in share_with]
                    if labels == '' or labels is None:
                        labels = []
                    else:

                        labels = labels.split('\n')
                        labels = [x.replace('\r','') for x in labels]


                    collection = Collection.objects.create(collection_id=collection_id, description=description, name=name,
                                                           insertion_time=Now(), username=request.session['username'],
                                                           name_space=request.session['name_space'])

                    name_space = NameSpace.objects.get(name_space=request.session['name_space'])
                    creator = User.objects.filter(username=request.session['username'], name_space=name_space)
                    for c in creator:  # gestisco i vari name space
                        ShareCollection.objects.create(collection_id=collection, username=c,
                                                       name_space=c.name_space, status='Creator')
                    for user in share_with:
                        print(user)
                        if user != request.session['username']:
                            us = User.objects.filter(username=user, name_space=name_space)
                            print(us.exists())
                            if us.exists():
                                us = us.first()
                                ShareCollection.objects.create(collection_id=collection, username=us, name_space=us.name_space,
                                                               status='Invited')

                    for label in labels:
                        if not Label.objects.filter(name=label).exists():
                            label = Label.objects.create(name=label)
                        else:
                            label = Label.objects.get(name=label)
                        if not HasLabel.objects.filter(collection_id=collection, name=label).exists():
                            HasLabel.objects.create(collection_id=collection, name=label)

                    files = request.FILES.items()
                    for filename, file in files:
                        if filename.startswith('concept'):

                            if file.name.endswith('json'):
                                upload_json_concepts(file, name_space.name_space, username, collection)
                            elif file.name.endswith('csv'):
                                upload_csv_concepts(file, name_space.name_space, username, collection)

                        elif filename.startswith('document'):
                            json_contents = create_json_content_from_file(file)
                            for json_content in json_contents:
                                pid = ''
                                language = 'english'
                                # if 'document_id' in list(json_content.keys()):
                                #     pid = json_content['document_id']
                                # else:
                                to_enc_id = request.session['username'] + str(datetime.now())
                                pid = hashlib.md5(to_enc_id.encode()).hexdigest()

                                if 'language' in list(json_content.keys()) and not json_content['language'].lower() == 'english':
                                    language = json_content['language']

                                if not Document.objects.filter(document_id=pid).exists():
                                    # for k, v in json_content.items():
                                    #     json_content[k] = re.sub('\s+', ' ', v)
                                    Document.objects.create(batch=1, collection_id=collection,provenance='user', document_id=pid, language=language,
                                                        document_content=json_content, insertion_time=Now())

                    pubmed_ids = request.POST.get('pubmed_ids', None)
                    if pubmed_ids is not None and pubmed_ids != '':
                        pubmed_ids = pubmed_ids.split()
                        for pid in pubmed_ids:
                            json_val = insert_articles_of_PUBMED(pid)
                            if json_val:
                                print(str(datetime.now()))
                                to_enc_id = request.session['username'] + str(datetime.now())

                                pid = hashlib.md5(to_enc_id.encode()).hexdigest()

                                if not Document.objects.filter(document_id=pid).exists():

                                    Document.objects.create(batch=1,  document_id=pid,
                                                            provenance='pubmed', language='english',
                                                            document_content=json_val,
                                                            insertion_time=Now(), collection_id=collection)

                    openaire_ids = request.POST.get('openaire_ids', None)
                    if openaire_ids is not None and openaire_ids != '':
                        openaire_ids = openaire_ids.split()
                        # for pid in openaire_ids:
                        openaire_ids = [x for x in openaire_ids if len(x) > 0]
                        json_val = insert_articles_of_OpenAIRE(openaire_ids)
                        if json_val:
                            for document in json_val['documents']:
                                to_enc_id = request.session['username'] + str(datetime.now())
                                pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                                if not Document.objects.filter(document_id=pid).exists():
                                    Document.objects.create(batch=1, document_id=pid,
                                                            provenance='openaire', language='english',
                                                            document_content=json_val,
                                                            insertion_time=Now(), collection_id=collection)

                    semantic_ids = request.POST.get('semantic_ids', None)
                    if semantic_ids is not None and semantic_ids != '':
                        semantic_ids = semantic_ids.split()
                        # for pid in openaire_ids:
                        json_val = insert_articles_of_semantic(semantic_ids)
                        if json_val:
                            for document in json_val['documents']:
                                to_enc_id = request.session['username'] + str(datetime.now())
                                pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                                if not Document.objects.filter(document_id=pid).exists():
                                    Document.objects.create(batch=1,  document_id=pid,
                                                        provenance='openaire', language='english',
                                                        document_content=json_val,
                                                        insertion_time=Now(), collection_id=collection)
                    # files = request.FILES.items()
                    # for file, filename in files:
                        # json_contents = create_json_content_from_file(file)
                        # for json_content in json_contents:
                        #     pid = ''
                        #     language = 'english'
                        #     if 'document_id' in list(json_content.keys()):
                        #         pid = json_content['document_id']
                        #     else:
                        #         to_enc_id = collection_id + str(json_contents.index(json_content))
                        #         pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                        #
                        #     if 'language' in list(json_content.keys()) and not json_content[
                        #                                                            'language'].lower() == 'english':
                        #         language = json_content['language']
                        #
                        #     Document.objects.create(batch=1, collection=collection, document_id=pid, langauge=language,
                        #                             document_content=json_content, insertion_time=Now())



            except Exception as e:
                print(e)
                json_resp = {'error': e}

            else:
                json_resp = {'message': 'ok'}
            finally:
                return JsonResponse(json_resp)

    elif request.method == 'DELETE' and type == None:
        request_body_json = json.loads(request.body)
        try:

            with transaction.atomic():
                lista = []
                json_resp = {'msg': 'ok'}
                collection = request_body_json['collection']
                # cursor = connection.cursor()
                documents = Document.objects.filter(collection_id=collection)
                Annotate.objects.filter(document_id__in=documents).delete()
                Associate.objects.filter(document_id__in=documents).delete()
                AnnotateLabel.objects.filter(document_id__in=documents).delete()
                CreateFact.objects.filter(document_id__in=documents).delete()

                RelationshipObjMention.objects.filter(document_id__in=documents).delete()
                RelationshipPredMention.objects.filter(document_id__in=documents).delete()
                RelationshipSubjMention.objects.filter(document_id__in=documents).delete()

                documents_ids_list = [x.document_id for x in documents]
                RelationshipObjConcept.objects.filter(predicate_document_id__in=documents_ids_list).delete()
                RelationshipPredConcept.objects.filter(object_document_id__in=documents_ids_list).delete()
                RelationshipSubjConcept.objects.filter(object_document_id__in=documents_ids_list).delete()
                Link.objects.filter(predicate_document_id__in=documents_ids_list).delete()

                ShareCollection.objects.filter(collection_id=collection).delete()
                GroundTruthLogFile.objects.filter(document_id__in=documents).delete()
                Mention.objects.filter(document_id__in=documents).delete()

                HasLabel.objects.filter(collection_id=collection).delete()
                AddConcept.objects.filter(collection_id=collection).delete()
                Document.objects.filter(collection_id=collection).delete()
                Collection.objects.filter(collection_id=collection).delete()

                # cursor.execute('DELETE FROM collection WHERE collection_id = %s',[collection])
                # delete the annotation of that member for that collection first
        except Exception as e:
            json_resp = {'error': 'an error occurred'}
            return JsonResponse(json_resp)
        else:
            return JsonResponse(json_resp)

    elif request.method == 'DELETE' and type == 'delete_member':
        request_body_json = json.loads(request.body)
        try:
            with transaction.atomic():
                json_resp = {'msg': 'ok'}
                members = []
                member = request_body_json['member']
                collection = request_body_json['collection']
                members.append(member)
                # delete the annotation of that member for that collection first
                for member in members:
                    name_space = NameSpace.objects.get(name_space=request.session['name_space'])
                    users = User.objects.filter(username=member, name_space=name_space)
                    collection = Collection.objects.get(collection_id=collection)
                    for user in users:
                        documents = Document.objects.filter(collection_id=collection)
                        Annotate.objects.filter(document_id__in=documents, username=user,
                                                name_space=name_space).delete()
                        Associate.objects.filter(document_id__in=documents, username=user,
                                                 name_space=name_space).delete()
                        AnnotateLabel.objects.filter(document_id__in=documents, username=user,
                                                     name_space=name_space).delete()
                        CreateFact.objects.filter(document_id__in=documents, username=user,
                                                  name_space=name_space).delete()

                        RelationshipObjMention.objects.filter(document_id__in=documents, username=user,
                                                              name_space=name_space).delete()
                        RelationshipPredMention.objects.filter(document_id__in=documents, username=user,
                                                               name_space=name_space).delete()
                        RelationshipSubjMention.objects.filter(document_id__in=documents, username=user,
                                                               name_space=name_space).delete()

                        documents_ids_list = [x.document_id for x in documents]
                        RelationshipObjConcept.objects.filter(predicate_document_id__in=documents_ids_list,
                                                              username=user, name_space=name_space).delete()
                        RelationshipPredConcept.objects.filter(object_document_id__in=documents_ids_list, username=user,
                                                               name_space=name_space).delete()
                        RelationshipSubjConcept.objects.filter(object_document_id__in=documents_ids_list, username=user,
                                                               name_space=name_space).delete()
                        Link.objects.filter(predicate_document_id__in=documents_ids_list, username=user,
                                            name_space=name_space).delete()

                        ShareCollection.objects.filter(collection_id=collection, username=user,
                                                       name_space=name_space).delete()
                        GroundTruthLogFile.objects.filter(document_id__in=documents, username=user,
                                                          name_space=name_space).delete()
                    # restore session
                    if GroundTruthLogFile.objects.filter(username__in=user).exists():
                        gts = GroundTruthLogFile.objects.filter(username__in=user).order_by('-insertion_time')
                        last_gt = gts.first()
                        name_space = last_gt.name_space
                        # collection = last_gt.collection_id
                        document = last_gt.document_id
                        request.session['language'] = document.language
                        request.session['name_space'] = name_space.name_space
                        request.session['collection'] = document.collection_id_id
                        request.session['document'] = document.document_id
                        request.session['batch'] = document.batch
                        request.session['fields'] = request.session['fields_to_ann'] = get_fields_list(
                            request.session['document'], request.session['language'])

                    # se non ho ultima annotazione ma ho collezioni, allora setto la collezione all'ultima aggiunta e al primo doc della prima batch
                    elif ShareCollection.objects.filter(username=user.first()).exclude(
                            status='Invited').exists():  # non importa il name space in questo caso
                        collections = ShareCollection.objects.filter(username=user.first()).values(
                            'collection_id').distinct()
                        collections_ids = [c['collection_id'] for c in collections]
                        collection = Collection.objects.filter(collection_id__in=collections_ids).order_by(
                            '-insertion_time').first()
                        request.session['collection'] = collection.collection_id
                        document = Document.objects.filter(collection_id=collection).order_by('insertion_time').first()
                        request.session['document'] = document.document_id
                        request.session['language'] = document.language
                        request.session['name_space'] = mode1
                        request.session['fields'] = request.session['fields_to_ann'] = get_fields_list(
                            request.session['document'],
                            request.session['language'])
                    else:
                        request.session['collection'] = None
                        request.session['document'] = None
                        request.session['language'] = None
                        request.session['name_space'] = 'Human'
                        request.session['fields'] = []
                        request.session['fields_to_ann'] = []
                    # Collection.objects.filter(collection_id=collection).delete()
        except Exception as e:
            print(e)
            json_resp = {'error': 'an error occurred'}
            return JsonResponse(json_resp)
        else:
            return JsonResponse(json_resp)




def uploadFile(request):

    """Credits page for app"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')


def configure(request):

    """Configuration page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')

def signup(request):

    """Configuration page for app """

    # username = request.session.get('username', False)
    # profile = request.session.get('profile', False)
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    with open((os.path.join(workpath, '../url.txt')), 'r', encoding='utf-8') as f:
        baseurl = f.read()
        if not baseurl.endswith('/'):
            baseurl = baseurl + '/'
    # if (username and baseurl != ''):
    #     context = {'username': username, 'profile': profile, 'baseurl': baseurl}
    #
    #
    # else:
    context = {'baseurl':baseurl}
    # return render(request, 'RelAnno_App/index.html', context)
    return render(request, 'RelAnno_App/index.html',context)
    # return render(request, 'RelAnno_App/index.html')


# def register(request):
#
#     """This view handles the registration of new users: username, password and profile are inserted in the database"""
#
#     if request.method == 'POST':
#         username = request.POST.get('username',None)
#         password1 = request.POST.get('password',None)
#
#         profile = request.POST.get('profile',None)
#         orcid = request.POST.get('orcid',None)
#         email = request.POST.get('email',None)
#         ncbikey = request.POST.get('ncbikey',None)
#         # mode1 = request.POST.get('mode',None)
#         # mode = NameSpace.objects.get(ns_id=mode1)
#
#         try:
#             with transaction.atomic():
#
#                 password = hashlib.md5(password1.encode()).hexdigest()
#                 ns_robot = NameSpace.objects.get(name_space = 'Robot')
#                 ns_human = NameSpace.objects.get(name_space = 'Human')
#                 if User.objects.filter(username = username).exists() or username == 'global':
#                     return JsonResponse({'message': 'The username you chose already exists'})
#
#                 # User.objects.create(username = username,profile=profile,password = password,name_space=ns_robot,orcid=orcid,ncbikey=ncbikey)
#                 User.objects.create(username = username,profile=profile,password = password,name_space=ns_human,orcid=orcid,ncbi_key=ncbikey)
#
#                 if not User.objects.filter(name_space=ns_human,username='IAA-Inter Annotator Agreement').exists():
#                     User.objects.create(username='IAA-Inter Annotator Agreement', profile='Tech', password=hashlib.md5("iaa".encode()).hexdigest(), name_space=ns_human,
#                                         orcid=None, ncbi_key=None)
#                     # User.objects.create(username='IAA-Inter Annotator Agreement', profile='Tech', password=hashlib.md5("iaa".encode()).hexdigest(), name_space=ns_robot,
#                     #                     orcid=None, ncbikey=None)
#
#         except (Exception) as error:
#             print(error)
#             # context = {: "Something went wrong, probably you did not set any profile"}
#             return JsonResponse({'error': 'This username already exists'},status = 500)
#         else:
#             request.session['username'] = username
#             request.session['name_space'] = 'Human'
#             request.session['profile'] = profile
#             return JsonResponse({'response': 'ok'},status = 200)
#
#     return render(request, 'RelAnno_App/login.html')



def team_members_stats(request):
    """Team members' stats page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if (username):
        context = {'username': username, 'profile': profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')


def updateConfiguration(request):

    """Update Configuration page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')

def loginPage(request,orcid_error=False):

    """Update Configuration page for app """

    # username = request.session.get('username', False)
    # profile = request.session.get('profile', False)
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    with open((os.path.join(workpath, '../url.txt')), 'r', encoding='utf-8') as f:
        baseurl = f.read()
        if not baseurl.endswith('/'):
            baseurl = baseurl + '/'

    if orcid_error:
        context = {'baseurl':baseurl,'orcid_error':'user not found'}
    else:
        context = {'baseurl':baseurl}
    # return render(request, 'RelAnno_App/index.html', context)
    return render(request, 'RelAnno_App/index.html',context)



def infoAboutConfiguration(request):

    """Information about Configuration page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')


def tutorial(request):

    """Tutorial page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')


def my_stats(request):

    """User's reports stats page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')

def documents(request):

    """Reports' stats page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'RelAnno_App/index.html', context)
    else:
        return redirect('RelAnno_App:login')


# def set_fields_params(request):
#     body_json = json.loads(request.body)
#     fields = body_json['fields']
#     request.session['fields'] = list(set(request.session['fields'] + fields))
#     return JsonResponse({'msg':'ok'})



def get_session_params(request):

    """This view returns the current session parameters """

    json_resp = {}
    # questo lo devo fare perché mi uccide la sessione l'autenticazione con oauth
    orcid = request.GET.get('orcid', '')
    if orcid != '':
        mode1 = 'Human'
        user = User.objects.filter(orcid=orcid)

        if user.exists():
            request.session['username'] = user.first().username
            request.session['profile'] = user.first().profile

            if user.first().ncbi_key is not None:
                os.environ['NCBI_API_KEY'] = user.first().ncbi_key
            # prima recupero la sessione dall'ultima annotazione
            if GroundTruthLogFile.objects.filter(username__in=user).exists():
                gts = GroundTruthLogFile.objects.filter(username__in=user).order_by('-insertion_time')
                last_gt = gts.first()
                name_space = last_gt.name_space
                # collection = last_gt.collection_id
                document = last_gt.document_id
                request.session['language'] = document.language
                request.session['name_space'] = name_space.name_space
                request.session['collection'] = document.collection_id_id
                request.session['document'] = document.document_id
                request.session['batch'] = document.batch
                request.session['fields'] = request.session['fields_to_ann'] = get_fields_list(
                    request.session['document'], request.session['language'])

            # se non ho ultima annotazione ma ho collezioni, allora setto la collezione all'ultima aggiunta e al primo doc della prima batch
            elif ShareCollection.objects.filter(username=user.first()).exclude(
                    status='Invited').exists():  # non importa il name space in questo caso
                collections = ShareCollection.objects.filter(username=user.first()).values('collection_id').distinct()
                collections_ids = [c['collection_id'] for c in collections]
                collection = Collection.objects.filter(collection_id__in=collections_ids).order_by(
                    '-insertion_time').first()
                request.session['collection'] = collection.collection_id
                document = Document.objects.filter(collection_id=collection).order_by('insertion_time').first()
                request.session['document'] = document.document_id
                request.session['language'] = document.language
                request.session['name_space'] = mode1
                request.session['fields'] = request.session['fields_to_ann'] = get_fields_list(
                    request.session['document'],
                    request.session['language'])

            else:
                request.session['collection'] = None
                request.session['document'] = None
                request.session['language'] = None
                request.session['name_space'] = 'Human'
                request.session['fields'] = []
                request.session['fields_to_ann'] = []

    # usecase = request.session.get('usecase',None)
    # language = request.session.get('language',None)
    # institute = request.session.get('institute',None)
    username = request.session.get('username',None)
    annotation = request.session.get('name_space',None)

    if username is None or annotation is None:
        return redirect('RelAnno_App:login')


    name_space = NameSpace.objects.get(name_space = annotation)
    user = User.objects.get(username = username, name_space = name_space)


    collection = request.session.get('collection',None)
    document = request.session.get('document',None)
    language = request.session.get('language',None)
    fields_to_ann = request.session.get('fields_to_ann',[])
    fields = request.session.get('fields',[])
    json_resp['username'] = username
    json_resp['name_space'] = name_space.name_space


    if annotation is not None:
        if annotation == 'Human':
            json_resp['annotation'] = 'Manual'
        elif annotation == 'Robot':
            json_resp['annotation'] = 'Automatic'
    else:
        json_resp['annotation'] = 'Manual'

    if collection is not None:
        json_resp['collection'] = collection
        if document is not None:
            json_resp['document'] = document
            json_resp['language'] = language

        else:
            collection = Collection.objects.get(collection_id = collection)
            document = Document.objects.filter(collection_id=collection).order_by('insertion_time').first()
            json_resp['document'] = document.document_id
            json_resp['language'] = document.language
            request.session['document'] = document.document_id
            request.session['language'] = document.language
            if fields_to_ann == []:
                fields_to_ann = get_fields_list(document, language)
            json_resp['fields_to_ann'] = request.session['fields_to_ann'] = fields_to_ann
            json_resp['fields'] = request.session['fields'] = fields

    else:
        if ShareCollection.objects.filter(username = user, name_space = name_space).exclude(status = 'Invited').exists():
            # collections = ShareCollection.objects.filter(username=user, name_space=name_space).exclude(status='Invited')
            # collections = [c.collection_id for c in collections]
            # collections = sorted(collections, key=lambda x: x.insertion_time,reverse=True)
            # collection = collections[0]
            # json_resp['collection'] = collection.collection_id
            # json_resp['document'] = Document.objects.filter(collection_id = collection).first().document_id
            collections = ShareCollection.objects.filter(username=user).values('collection_id').distinct()
            collections_ids = [c['collection_id'] for c in collections]
            collection = Collection.objects.filter(collection_id__in=collections_ids).order_by(
                '-insertion_time').first()
            request.session['collection'] = collection.collection_id
            document = Document.objects.filter(collection_id=collection).order_by('insertion_time').first()
            request.session['document'] = document.document_id
            request.session['language'] = document.language
            request.session['fields'] = request.session['fields_to_ann'] = get_fields_list(request.session['document'],
                                                                                           request.session['language'])
            json_resp['collection'] =request.session['collection']
            json_resp['document'] = request.session['document']
            json_resp['language'] = request.session['language']

        else:


            json_resp['collection'] = None
            json_resp['document'] = None
            json_resp['language'] = None
            json_resp['fields'] = None
            json_resp['fields_to_ann'] = None


    return JsonResponse(json_resp)



# def login(request):
#
#     """Login page for app """
#
#     # print('login')
#     if request.method == 'POST':
#         md5_pwd = ''
#         admin = False
#
#         username = request.POST.get('username', False)
#         mode1 = 'Human'
#         mode = NameSpace.objects.get(name_space=mode1)
#         password = request.POST.get('password', False)
#         if username:
#             username = username.replace("\"", "").replace("'", "")
#         if password:
#             password = password.replace("\"", "").replace("'", "")
#             md5_pwd = hashlib.md5(password.encode()).hexdigest()
#         if (username != False and password != False):
#             user = User.objects.filter(username = username,password = md5_pwd)
#
#
#             if user.exists():
#                 request.session['username'] = user.first().username
#                 request.session['profile'] = user.first().profile
#
#                 if user.first().ncbi_key is not None:
#                     os.environ['NCBI_API_KEY'] = user.first().ncbi_key
#                 print("username: " + username)
#                 # prima recupero la sessione dall'ultima annotazione
#                 if GroundTruthLogFile.objects.filter(username__in = user).exists():
#                     gts = GroundTruthLogFile.objects.filter(username__in = user).order_by('-insertion_time')
#                     last_gt = gts.first()
#                     name_space = last_gt.name_space
#                     # collection = last_gt.collection_id
#                     document = last_gt.document_id
#                     request.session['language'] = document.language
#                     request.session['name_space'] = name_space.name_space
#                     request.session['collection'] = document.collection_id_id
#                     request.session['document'] = document.document_id
#                     request.session['batch'] = document.batch
#                     request.session['fields'] = request.session['fields_to_ann'] =  get_fields_list(request.session['document'],request.session['language'])
#
#                 # se non ho ultima annotazione ma ho collezioni, allora setto la collezione all'ultima aggiunta e al primo doc della prima batch
#                 elif ShareCollection.objects.filter(username = user.first()).exclude(status = 'Invited').exists(): # non importa il name space in questo caso
#                     collections = ShareCollection.objects.filter(username = user.first()).values('collection_id').distinct()
#                     collections_ids = [c['collection_id'] for c in collections]
#                     collection = Collection.objects.filter(collection_id__in=collections_ids).order_by('-insertion_time').first()
#                     request.session['collection'] = collection.collection_id
#                     document = Document.objects.filter(collection_id = collection).order_by('insertion_time').first()
#                     request.session['document'] = document.document_id
#                     request.session['language'] = document.language
#                     request.session['name_space'] = mode1
#                     request.session['fields'] = request.session['fields_to_ann'] = get_fields_list(request.session['document'],
#                                                                 request.session['language'])
#
#                 else:
#                     request.session['collection'] = None
#                     request.session['document'] = None
#                     request.session['language'] = None
#                     request.session['name_space'] = 'Human'
#                     request.session['fields'] = []
#                     request.session['fields_to_ann'] = []
#
#                 # return JsonResponse({'msg':'ok'})
#                 return redirect('RelAnno_App:index')
#
#         # return render(request, 'RelAnno_App/index.html',status=500)
#         return JsonResponse({'error':'errore'},status=500)
#
#     else:
#         username = request.session.get('username', False)
#         profile = request.session.get('profile', False)
#         name_space = request.session.get('name_space', False)
#
#         if username and profile and name_space:
#             # return JsonResponse({'msg': 'ok'})
#             return redirect('RelAnno_App:index')
#             # return render(request, 'RelAnno_App/index.html')
#
#         # context = {'username': username, 'profile': user.profile}
#         # return render(request, 'RelAnno_App/index.html')
#         return redirect('RelAnno_App:loginPage')


def set_new_fields(request):

    """Set new fields to ann parameter session"""

    body = json.loads(request.body)
    fields_to_ann = body['fields_to_ann']
    request.session['fields_to_ann'] = fields_to_ann
    return JsonResponse({'msg':'ok'})


def concepts(request,type=None):

    """Concepts requests"""

    username = request.session['username']
    name_space = request.session['name_space']
    language = request.session['language']
    document = request.session['document']
    collection = request.session['collection']
    name_space = NameSpace.objects.get(name_space=name_space)
    document = Document.objects.get(document_id=request.session['document'])
    collection = Collection.objects.get(collection_id=collection)
    user = User.objects.get(username=username, name_space=name_space)

    if request.method == 'GET':

        if request.GET.get('user', None) is not None:
            username = request.GET.get('user', None)
        if request.GET.get('name_space', None) is not None:
            name_space = request.GET.get('name_space', None)

        # json_mentions1 = generate_associations_list(username, name_space, document, language)
        if type == 'full':
            json_mentions = generate_associations_list(username, name_space.name_space, document.document_id, language)

        else:
            json_mentions = generate_associations_list_splitted(username, name_space.name_space, document.document_id, language)

        # print(json_mentions)
        return JsonResponse(json_mentions, safe=False)



    if request.method == 'POST' and type == 'copy':

        json_body = json.loads(request.body)
        json_resp = copy_concepts_aux(username, name_space.name_space, document.document_id, language, json_body)
        return JsonResponse(json_resp)



    elif request.method == 'POST' and type == 'insert':

        body_json = json.loads(request.body)
        area = body_json['area']
        user = request.session['username']
        name_space = request.session['name_space']
        name_space = NameSpace.objects.get(name_space=name_space)
        document = Document.objects.get(document_id=request.session['document'])
        collection = request.session['collection']
        collection = Collection.objects.get(collection_id=collection)
        user = User.objects.get(username=user, name_space=name_space)
        url = body_json['url']
        name = body_json['name']
        description = body_json['description']
        mention = body_json['mention']
        start = mention['start']
        stop = mention['stop']
        # dict_keys = from_start_stop_foreach_key(document_content=document.document_content)
        # keys = dict_keys['key']
        # for k in list(keys.keys()):
        #     if start >= k.start and stop <= k.stop:
        #         position = ''
        # val = dict_keys['value']
        # position = '_'.join(mention['id'].split('_')[:-1])
        position = mention['position']
        start_recomp, stop_recomp = return_start_stop_for_backend(start, stop, position, document.document_content)
        mention = Mention.objects.get(start=start_recomp, stop=stop_recomp, document_id=document)
        json_resp = {'msg': 'ok'}

        try:
            with transaction.atomic():
                if not SemanticArea.objects.filter(name=area).exists():
                    SemanticArea.objects.create(name=area)

                area = SemanticArea.objects.get(name=area)
                if not Concept.objects.filter(concept_url=url).exists():
                    Concept.objects.create(concept_url=url, concept_name=name, description=description)

                concept = Concept.objects.get(concept_url=url)
                if not AddConcept.objects.filter(username=user, name_space=name_space, concept_url=concept, name=area,
                                                 collection_id=collection).exists():
                    AddConcept.objects.create(username=user, name_space=name_space, insertion_time=Now(),
                                              concept_url=concept, name=area, collection_id=collection)
                if not Associate.objects.filter(username=user, name_space=name_space, name=area, concept_url=concept,
                                                document_id=document, start=mention, stop=mention.stop).exists():
                    Associate.objects.create(username=user, name_space=name_space, language=request.session['language'],
                                             insertion_time=Now(), concept_url=concept, name=area, start=mention,
                                             stop=mention.stop, document_id=document)

                    update_gt(user, name_space, document, request.session['language'])
            json_resp['concepts'] = generate_associations_list_splitted(request.session['username'],
                                                                        request.session['name_space'],
                                                                        request.session['document'],
                                                                        request.session['language'])
            json_mentions = generate_relationships_list(request.session['username'], request.session['name_space'], request.session['document'], request.session['language'])
            # suddivido per semantic areas
            json_ment_areas = transform_relationships_list(json_mentions, request.session['document'], request.session['username'], request.session['name_space'])
            json_resp['relationships'] = json_ment_areas
            json_resp['concepts_list'] = create_concepts_list(request.session['collection'])
            # json_resp['concepts'] = generate_associations_list(request.session['username'],request.session['name_space'],request.session['document'],request.session['language'])


        except Exception as e:
            print(e)
            json_resp = {'error': e}

        return JsonResponse(json_resp)

    elif request.method == 'DELETE':
        body_json = json.loads(request.body)
        json_resp = {'msg': 'ok'}

        mentions_list = generate_mentions_list(username, name_space.name_space, document.document_id, request.session['language'])

        # name_space = NameSpace.objects.get(name_space=name_space)
        # document = Document.objects.get(document_id=document, language=language)
        # user = User.objects.get(username=username, name_space=name_space)
        mention_js = body_json['mention']
        start = mention_js['start']
        stop = mention_js['stop']
        position = mention_js['id']
        position = '_'.join(position.split('_')[:-1])
        start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)
        language = document.language
        mentions_classes = mention_js['mentions'].split()

        start_stop_list = []
        found = False
        # questo pezzo è per l'overlapping: se ho una mention totalmente dentro un'altra, solo in questo caso avrò un concetto associato, se no è associato sempre alla parte non overlapping
        for m in mentions_list:
            pos = m['mentions']
            start = m['start']
            stop = m['stop']
            start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)
            if pos in mentions_classes:
                start_stop_list.append([start, stop])

        start_stop_list = sorted(start_stop_list, key=lambda x: x[1] - x[0])
        for i in range(len(start_stop_list) - 1):
            item_i = start_stop_list[i]
            for j in range(i + 1, len(start_stop_list)):
                item_j = start_stop_list[j]
                if item_j[0] <= item_i[0] <= item_j[1] and item_j[0] <= item_i[1] <= item_j[1]:
                    start = item_i[0]
                    stop = item_i[1]
                    found = True
                    break
            if found:
                break
        if len(start_stop_list) == 1:
            start = start_stop_list[0][0]
            stop = start_stop_list[0][1]

        mention = Mention.objects.get(start=start, stop=stop, document_id=document)
        url = body_json['url']
        concept = Concept.objects.get(concept_url=url)
        name = SemanticArea.objects.get(name = body_json['area'])
        try:
            with transaction.atomic():
                ass = Associate.objects.filter(concept_url=concept, start=mention,stop=mention.stop, username=user, name_space=name_space,name = name,
                                         document_id=document)
                Associate.objects.filter(concept_url=concept, start=mention,stop=mention.stop, username=user, name_space=name_space,name = name,
                                         document_id=document).delete()
                update_gt(user, name_space, document, language)
                json_mentions = generate_relationships_list(request.session['username'], request.session['name_space'],
                                                            request.session['document'], request.session['language'])
                # suddivido per semantic areas
                json_ment_areas = transform_relationships_list(json_mentions, request.session['document'],
                                                               request.session['username'],
                                                               request.session['name_space'])
                json_resp['relationships'] = json_ment_areas
        except Exception as e:
            json_resp = {'error': e}

        return JsonResponse(json_resp)




def set_concept(request):

    """This view adds a new concept; rapid insertion from the modal"""

    body_json = json.loads(request.body)
    area = body_json['area']
    user = request.session['username']
    name_space = request.session['name_space']
    name_space = NameSpace.objects.get(name_space = name_space)
    document = Document.objects.get(document_id=request.session['document'])
    collection = request.session['collection']
    collection = Collection.objects.get(collection_id=collection)
    user = User.objects.get(username = user,name_space = name_space)
    url = body_json['url']
    name = body_json['name']
    description = body_json['description']
    mention = body_json['mention']
    start = mention['start']
    stop = mention['stop']
    # dict_keys = from_start_stop_foreach_key(document_content=document.document_content)
    # keys = dict_keys['key']
    # for k in list(keys.keys()):
    #     if start >= k.start and stop <= k.stop:
    #         position = ''
    # val = dict_keys['value']
    # position = '_'.join(mention['id'].split('_')[:-1])
    position = mention['position']
    start_recomp,stop_recomp = return_start_stop_for_backend(start,stop,position,document.document_content)
    mention = Mention.objects.get(start=start_recomp,stop = stop_recomp,document_id = document)
    json_resp = {'msg': 'ok'}

    try:
        with transaction.atomic():
            if not SemanticArea.objects.filter(name=area).exists():
                SemanticArea.objects.create(name=area)

            area = SemanticArea.objects.get(name=area)
            if not Concept.objects.filter(concept_url=url).exists():
                Concept.objects.create(concept_url=url,concept_name=name,description=description)

            concept = Concept.objects.get(concept_url=url)
            if not AddConcept.objects.filter(username=user, name_space=name_space, concept_url=concept, name=area,
                                             collection_id=collection).exists():
                AddConcept.objects.create(username=user, name_space=name_space, insertion_time=Now(),
                                          concept_url=concept, name=area, collection_id=collection)
            if not Associate.objects.filter(username = user,name_space = name_space,name = area, concept_url = concept,document_id=document,start=mention,stop=mention.stop).exists():
                Associate.objects.create(username = user,name_space = name_space, language=request.session['language'], insertion_time = Now(), concept_url = concept, name = area,start=mention,stop=mention.stop,document_id=document)

                update_gt(user,name_space,document,request.session['language'])
        json_resp['concepts'] = generate_associations_list_splitted(request.session['username'],request.session['name_space'],request.session['document'],request.session['language'])
        json_resp['concepts_list'] = create_concepts_list(request.session['collection'])
        # json_resp['concepts'] = generate_associations_list(request.session['username'],request.session['name_space'],request.session['document'],request.session['language'])

    except Exception as e:
        print(e)
        json_resp = {'error':e}

    return JsonResponse(json_resp)


def change_collection_id(request):

    """This view changes collection"""

    collection = request.GET.get('collection',None)
    name_space = NameSpace.objects.get(name_space = request.session['name_space'])
    user = User.objects.get(username = request.session['username'],name_space = name_space)
    if collection is not None:
        request.session['collection'] = collection
        documents = Document.objects.filter(collection_id = collection)
        gts = GroundTruthLogFile.objects.filter(username = user, name_space = name_space, document_id__in = documents).order_by('-insertion_time')
        if gts.exists():
            request.session['document'] = gts.first().document_id_id
        else:
            request.session['document'] = documents.first().document_id

        json_resp = {'document_id':request.session['document']}
        return JsonResponse(json_resp)








def get_batches(request):

    """This view returns the batches of a collection"""

    collection = Collection.objects.get(collection_id = request.session['collection'])
    batch = (Document.objects.filter(collection_id = collection).aggregate(Max('batch')))
    json_resp = {}
    json_resp['max_batch'] = batch["batch__max"]
    # print(batch["batch__max"])
    return JsonResponse(json_resp)



def get_collection_concepts(request):

    """ This view returns the list of concepts found for a collection"""

    collection = Collection.objects.get(collection_id=request.session['collection'])
    coll_conc = AddConcept.objects.filter(collection_id = collection)
    concepts = []
    for concept in coll_conc:
        json_l = {}
        c = concept.concept_url
        area = concept.name
        json_l['url'] = c.concept_url
        json_l['name'] = c.concept_name
        json_l['description'] = c.description
        area = area.name
        json_l['area'] = area
        concepts.append(json_l)

    return JsonResponse(concepts,safe=False)



def get_collection_labels(request):

    """This view returns the labels of a collection"""

    collection = request.session.get('collection',None)
    collection = Collection.objects.get(collection_id = collection)
    labels = HasLabel.objects.filter(collection_id = collection)
    labels = [l.name_id for l in labels]
    print(labels)
    return JsonResponse(labels,safe = False)


def get_annotators(request):

    """This view returns the list of annotators of a document"""

    document = Document.objects.get(document_id = request.session['document'],language = request.session['language'])
    gts = GroundTruthLogFile.objects.filter(document_id = document)
    if gts.count() > 0 :
        users = list(gts.order_by('username').values_list('username', flat=True).distinct())
    else:
        users = []

    if request.session['username'] in users:
        users.remove(request.session['username'])

    users.insert(0,request.session['username'])
    users.append("IAA-Inter Annotator Agreement")
    return JsonResponse(users,safe = False)



# ANNOTATIONS
def get_annotated_labels(request):

    """This view returns the labels annotated by the logged in user"""

    username = request.session['username']
    name_space = request.session['name_space']
    if request.GET.get('user', None) is not None:
        username = request.GET.get('user', None)
    if request.GET.get('name_space', None) is not None:
        name_space = request.GET.get('name_space', None)

    language = request.session['language']

    doc_id = request.session.get('document',None)
    json_error = {'error':'an error occurred'}
    if name_space and username and doc_id and language:
        ns = NameSpace.objects.get(name_space = name_space)
        user = User.objects.get(username = username,name_space = ns)
        document = Document.objects.get(document_id = doc_id,language = language)
        labels = AnnotateLabel.objects.filter(username=user,name_space=ns,document_id = document)
        labels = [l.name.name for l in labels]
        # labels = [l.name for l in labels]
        return JsonResponse(labels,safe = False)
    else:
        return JsonResponse(json_error)


def labels(request,type=None):

    name_space = request.session['name_space']
    username = request.session['username']
    document = request.session['document']
    language = request.session['language']


    if request.method == 'GET':
        username = request.session['username']
        name_space = request.session['name_space']
        if request.GET.get('user', None) is not None:
            username = request.GET.get('user', None)
        if request.GET.get('name_space', None) is not None:
            name_space = request.GET.get('name_space', None)

        language = request.session['language']
        doc_id = request.session['document']

        doc_id = request.session.get('document', None)
        json_error = {'error': 'an error occurred'}
        if name_space and username and doc_id and language:
            ns = NameSpace.objects.get(name_space=name_space)
            user = User.objects.get(username=username, name_space=ns)
            document = Document.objects.get(document_id=doc_id, language=language)
            labels = AnnotateLabel.objects.filter(username=user, name_space=ns, document_id=document)
            labels = [l.name.name for l in labels]
            # labels = [l.name for l in labels]
            return JsonResponse(labels, safe=False)
        else:
            return JsonResponse(json_error)

    elif request.method == 'POST' and type == 'copy':
        json_body = json.loads(request.body)
        label = json_body['label']
        json_resp = copy_labels(username, name_space, label, document, language)
        return JsonResponse(json_resp)

    elif request.method == 'POST' and type == 'insert':

        name_space = NameSpace.objects.get(name_space=name_space)
        document = Document.objects.get(document_id=document, language=language)
        user = User.objects.get(username=username, name_space=name_space)
        body_json = json.loads(request.body)
        language = document.language
        label = body_json['label']
        label = Label.objects.get(name=label)
        try:
            with transaction.atomic():
                AnnotateLabel.objects.create(username=user, document_id=document, language=language, name=label,
                                             insertion_time=Now(), name_space=name_space)
                update_gt(user, name_space, document, language)

                return JsonResponse({'msg': 'ok'})

        except Exception as e:
            print(e)
            return JsonResponse({'error': e})

    elif request.method == 'DELETE':
        name_space = NameSpace.objects.get(name_space=name_space)
        document = Document.objects.get(document_id=document, language=language)
        user = User.objects.get(username=username, name_space=name_space)
        body_json = json.loads(request.body)
        language = document.language
        label = body_json['label']
        label = Label.objects.get(name=label)
        try:
            with transaction.atomic():
                AnnotateLabel.objects.filter(username=user, document_id=document, language=language,
                                             name=label).delete()

                update_gt(user, name_space, document, language)

                return JsonResponse({'msg': 'ok'})

        except Exception as e:
            print(e)
            return JsonResponse({'error': e})


def update_document_id(request):

    """This view updates the document id of the session"""

    body_json = json.loads(request.body)
    request.session['document'] = body_json['document']
    return JsonResponse({'msg':'ok'})


def accept_invitation(request):

    """This view allows a user to accept the invitation to share a new collection"""


    username = request.session.get('username', None)
    name_space = request.session.get('name_space', None)
    doc_id = request.session.get('document', None)
    name_space = NameSpace.objects.get(name_space = name_space)
    username = User.objects.get(username = username,name_space = name_space)
    body_json = json.loads(request.body)
    collection = body_json['collection']
    collection = Collection.objects.get(collection_id = collection)
    sharecoll = ShareCollection.objects.filter(username = username,name_space = name_space, collection_id = collection)
    try:
        with transaction.atomic():
            if sharecoll.exists():
                # sharecoll.delete()
                sharecoll.update(status='Accepted')
                # ShareCollection.objects.create(username = username,name_space = name_space, collection_id = collection,invitation= 'Accepted')
        return JsonResponse({'msg':'ok'})
    except Exception as e:
        return JsonResponse({'error':e})



def get_mention_info(request):

    """This view returns the information about the mention (or the mention + concept)"""

    json_to_ret = {}
    json_to_ret['concepts'] = []

    mention_requested = request.GET.get('mention',None)
    username = request.session.get('username', None)
    name_space = request.session.get('name_space', None)
    doc_id = request.session.get('document', None)
    document = Document.objects.get(document_id=doc_id,language=request.session['language'])
    language = request.session.get('language', None)
    name_space = NameSpace.objects.get(name_space = name_space)
    username = User.objects.get(username = username,name_space = name_space)
    if mention_requested:
        mention_requested = json.loads(mention_requested)
        start, stop = return_start_stop_for_backend( mention_requested['start'], mention_requested['stop'], mention_requested['position'],document.document_content)
        mention = Mention.objects.get(document_id = document,language = request.session['language'],start = start, stop=stop)
        json_to_ret['text'] = mention.mention_text
        annotation_all = Annotate.objects.filter(start=mention, stop=stop, document_id=document, language=language)
        json_to_ret['annotators_count'] = annotation_all.count()

        annotation_user = Annotate.objects.filter(username=username, name_space=name_space, start=mention, stop=stop,
                                                  document_id=document, language=language)
        json_to_ret['last_update'] = '.'.join(str(annotation_user.first().insertion_time).split('.')[:-1])


        association_user = Associate.objects.filter(start=mention, username=username, name_space=name_space,
                                                    stop=stop, document_id=document, language=language).order_by('-insertion_time')
        for a in association_user:
            json_c = {}
            concept = a.concept_url
            json_c['concept_url'] = concept.concept_url
            area = a.name
            json_c['concept_area'] = area.name

            name = concept.concept_name
            json_c['concept_name'] = name
            json_c['last_update'] = '.'.join(str(a.insertion_time).split('.')[:-1])
            association_all = Associate.objects.filter(start=mention, stop=stop, document_id=document,
                                                       language=language,concept_url = concept)
            json_c['annotators_count'] = association_all.count()
            json_to_ret['concepts'].append(json_c)
        return JsonResponse(json_to_ret)


# def get_assertions(request):
#
#     """This view returns a list of assertions"""
#
#     username = request.session['username']
#     name_space = request.session['name_space']
#     if request.GET.get('user', None) is not None:
#         username = request.GET.get('user', None)
#     if request.GET.get('name_space', None) is not None:
#         name_space = request.GET.get('name_space', None)
#
#     language = request.session['language']
#     document = request.session['document']
#     json_mentions = {}
#
#     json_ment_areas = {}
#     json_assertions = generate_assertions_list(username,name_space,document,language)
#     return JsonResponse(json_ment_areas,safe=False)





# def get_relationships(request):
#
#     """This view returns the mentions a user annotated in a document"""
#
#     if request.method == 'GET':
#         username = request.session['username']
#         name_space = request.session['name_space']
#         if request.GET.get('user', None) is not None:
#             username = request.GET.get('user', None)
#         if request.GET.get('name_space', None) is not None:
#             name_space = request.GET.get('name_space', None)
#
#         language = request.session['language']
#         document = request.session['document']
#         json_mentions = {}
#
#         json_mentions = generate_relationships_list(username,name_space,document,language)
#         # suddivido per semantic areas
#         json_ment_areas = transform_relationships_list(json_mentions)
#
#         json_ment_areas['total'] = len(json_mentions)
#         # print(json_mentions)
#         return JsonResponse(json_ment_areas,safe=False)


import math
def mentions(request, type=None):
    name_space = request.session['name_space']
    username = request.session['username']
    document = request.session['document']
    language = request.session['language']
    if request.method == 'GET' and type == None:
        username = request.session['username']
        name_space = request.session['name_space']
        if request.GET.get('user', None) is not None:
            username = request.GET.get('user', None)
        if request.GET.get('name_space', None) is not None:
            name_space = request.GET.get('name_space', None)

        language = request.session['language']
        document = request.session['document']
        json_mentions = {}

        json_mentions['mentions'] = generate_mentions_list(username, name_space, document, language)
        json_mentions['mentions_splitted'] = generate_mentions_list(username, name_space, document, language)

        # print(json_mentions)
        return JsonResponse(json_mentions, safe=False)

    elif request.method == 'GET' and type == 'info':
        json_to_ret = {}
        json_to_ret['concepts'] = []

        mention_requested = request.GET.get('mention', None)
        username = request.session.get('username', None)
        name_space = request.session.get('name_space', None)
        doc_id = request.session.get('document', None)
        document = Document.objects.get(document_id=doc_id, language=request.session['language'])
        language = request.session.get('language', None)
        name_space = NameSpace.objects.get(name_space=name_space)
        username = User.objects.get(username=username, name_space=name_space)
        if mention_requested:
            mention_requested = json.loads(mention_requested)
            start, stop = return_start_stop_for_backend(mention_requested['start'], mention_requested['stop'],
                                                        mention_requested['position'], document.document_content)
            mention = Mention.objects.get(document_id=document, language=request.session['language'], start=start,
                                          stop=stop)
            json_to_ret['text'] = mention.mention_text
            annotation_all = Annotate.objects.filter(start=mention, stop=stop, document_id=document, language=language)
            json_to_ret['annotators_count'] = annotation_all.count()

            annotation_user = Annotate.objects.filter(username=username, name_space=name_space, start=mention,
                                                      stop=stop,
                                                      document_id=document, language=language)
            json_to_ret['last_update'] = '.'.join(str(annotation_user.first().insertion_time).split('.')[:-1])

            association_user = Associate.objects.filter(start=mention, username=username, name_space=name_space,
                                                        stop=stop, document_id=document, language=language).order_by(
                '-insertion_time')
            for a in association_user:
                json_c = {}
                concept = a.concept_url
                json_c['concept_url'] = concept.concept_url
                area = a.name
                json_c['concept_area'] = area.name

                name = concept.concept_name
                json_c['concept_name'] = name
                json_c['last_update'] = '.'.join(str(a.insertion_time).split('.')[:-1])
                association_all = Associate.objects.filter(start=mention, stop=stop, document_id=document,
                                                           language=language, concept_url=concept)
                json_c['annotators_count'] = association_all.count()
                json_to_ret['concepts'].append(json_c)
            return JsonResponse(json_to_ret)

    elif request.method == 'POST' and type == 'copy':
        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username=username, name_space=name_space)
        document = Document.objects.get(document_id=document, language=language)
        json_body = json.loads(request.body)
        mention = json_body['mention']
        json_resp = copy_mention_aux(user, name_space, document, language, mention)
        return JsonResponse(json_resp)

    elif request.method == 'POST' and type == 'insert':
        username = request.session['username']
        name_space = request.session['name_space']
        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username=request.session['username'], name_space=name_space)
        try:
            with transaction.atomic():
                document = Document.objects.get(document_id=request.session['document'],
                                                language=request.session['language'])
                json_start_stop = from_start_stop_foreach_key(document.document_content)
                body_json = json.loads(request.body)
                language = document.language
                start = body_json['start']
                stop = body_json['stop'] - 1  # il frontend mi ritorna un indice di troppo
                # print(start, stop)
                mention_text = body_json['mention_text']
                position = body_json['position']
                chiave = 'value' if position.endswith('value') else 'key'
                portion = ''
                for k in json_start_stop[chiave].keys():
                    if k+"_"+chiave == position:
                        portion = json_start_stop[chiave][k]['text']
                        break


                # first: check if the start and the stops from the frontend are correct, otherwise recompute them
                # first check if in that part of text there are other portions with the same text

                occurrences = portion.count(mention_text)
                # se è 1 allora mi fermo
                if occurrences == 1:
                    start = portion.index(mention_text)
                    stop = start + len(mention_text) - 1
                else:
                    # qua gestisco eventuali errori di formattazione del testo
                    matches = re.finditer(mention_text, portion)
                    indices = [match.start() for match in matches]
                    closest_number_start = None
                    closest_distance_from_start = None
                    for number in indices:
                        distance = math.fabs(number - start)
                        if closest_distance_from_start is None or distance < closest_distance_from_start:
                            closest_number_start = number
                            closest_distance_from_start = distance

                    start = closest_number_start
                    stop = start + len(mention_text) - 1



                start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)
                # print(start,stop)
                m = Mention.objects.filter(start=start, stop=stop, document_id=document, language=language).first()

                if not Mention.objects.filter(start=start, stop=stop, document_id=document, language=language).exists():
                    Mention.objects.create(start=start, stop=stop, document_id=document, mention_text=mention_text,
                                           language=language)

                mention = Mention.objects.get(start=start, stop=stop, document_id=document, language=language)

                if not Annotate.objects.filter(start=mention, stop=stop, username=user, name_space=name_space,
                                               document_id=document, language=language).exists():
                    Annotate.objects.create(start=mention, stop=stop, username=user, name_space=name_space,
                                            document_id=document,
                                            language=language, insertion_time=Now())
                    update_gt(user, name_space, document, language)

                json_to_return = {}
                json_to_return['document'] = create_new_content(document, user)
                json_to_return['mentions'] = generate_mentions_list(username, name_space.name_space,
                                                                    document.document_id, language)
                json_to_return['concepts'] = generate_associations_list_splitted(request.session['username'],
                                                                                 request.session['name_space'],
                                                                                 request.session['document'],
                                                                                 request.session['language'])

                json_to_return['mentions_splitted'] = generate_mentions_list_splitted(username, name_space.name_space,
                                                                                      document.document_id, language)

            return JsonResponse(json_to_return)
        except Exception as e:
            print('add mention rollback', e)
            return JsonResponse({'error': e}, status=500)


    elif request.method == 'DELETE':

        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username=username, name_space=name_space)
        try:
            with transaction.atomic():
                document = Document.objects.get(document_id=document, language=language)
                # json_start_stop = from_start_stop_foreach_key(document.document_content)
                body_json = json.loads(request.body)
                language = document.language
                start = body_json['start']
                stop = body_json['stop']
                # print(start, stop)
                mention_text = body_json['mention_text']
                position = body_json['position']
                start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)
                # print(start,stop)
                mention = Mention.objects.get(start=start, stop=stop, document_id=document, language=language)
                Annotate.objects.filter(start=mention, stop=stop, username=user, name_space=name_space,
                                        document_id=document,
                                        language=language).delete()
                Associate.objects.filter(start=mention, stop=stop, username=user, name_space=name_space,
                                         document_id=document,
                                         language=language).delete()

                # relationships
                Link.objects.filter(subject_start=mention.start, subject_stop=mention.stop, username=user,
                                    name_space=name_space,
                                    subject_document_id=document.document_id,
                                    subject_language=language).delete()
                Link.objects.filter(predicate_start=mention.start, predicate_stop=mention.stop, username=user,
                                    name_space=name_space,
                                    subject_document_id=document.document_id,
                                    subject_language=language).delete()
                Link.objects.filter(object_start=mention.start, object_stop=mention.stop, username=user,
                                    name_space=name_space,
                                    subject_document_id=document.document_id,
                                    subject_language=language).delete()

                RelationshipObjMention.objects.filter(start=mention.start, stop=mention.stop, username=user,
                                                      name_space=name_space,
                                                      document_id=document,
                                                      language=language).delete()

                RelationshipSubjMention.objects.filter(start=mention.start, stop=mention.stop, username=user,
                                                       name_space=name_space,
                                                       document_id=document,
                                                       language=language).delete()

                RelationshipPredMention.objects.filter(start=mention.start, stop=mention.stop, username=user,
                                                       name_space=name_space,
                                                       document_id=document,
                                                       language=language).delete()

                RelationshipPredConcept.objects.filter(object_start=mention.start, object_stop=mention.stop,
                                                       username=user, name_space=name_space,
                                                       subject_document_id=document.document_id,
                                                       subject_language=language).delete()
                RelationshipPredConcept.objects.filter(subject_start=mention.start, subject_stop=mention.stop,
                                                       username=user, name_space=name_space,
                                                       subject_document_id=document.document_id,
                                                       subject_language=language).delete()

                RelationshipSubjConcept.objects.filter(object_start=mention.start, object_stop=mention.stop,
                                                       username=user, name_space=name_space,
                                                       object_document_id=document.document_id,
                                                       object_language=language).delete()
                RelationshipSubjConcept.objects.filter(predicate_start=mention.start, predicate_stop=mention.stop,
                                                       username=user, name_space=name_space,
                                                       object_document_id=document.document_id,
                                                       object_language=language).delete()

                RelationshipObjConcept.objects.filter(subject_start=mention.start, subject_stop=mention.stop,
                                                      username=user, name_space=name_space,
                                                      subject_document_id=document.document_id,
                                                      subject_language=language).delete()
                RelationshipObjConcept.objects.filter(predicate_start=mention.start, predicate_stop=mention.stop,
                                                      username=user, name_space=name_space,
                                                      subject_document_id=document.document_id,
                                                      subject_language=language).delete()

                # if Annotate.objects.filter(start=mention, stop=stop,document_id=document,language=language).count() == 0:
                #     Mention.objects.filter(start=start, stop=stop, document_id=document,
                #                            language=language).delete()
                update_gt(user, name_space, document, language)
                new_content = create_new_content(document, user)
                json_resp = {}
                json_resp['document'] = new_content
                json_resp['mentions'] = generate_mentions_list(username, name_space.name_space, document.document_id,
                                                               language)
                json_resp['mentions_splitted'] = generate_mentions_list_splitted(username, name_space.name_space,
                                                                                 document.document_id, language)
                json_resp['concepts'] = generate_associations_list_splitted(username, name_space.name_space,
                                                                            document.document_id, language)
                # print(new_content)
            return JsonResponse(json_resp)
        except Exception as e:
            print('add mention rollback', e)
            return JsonResponse({'error': e}, status=500)





def relationships(request,type=None):

    """This view returns the mentions a user annotated in a document"""

    username = request.session['username']
    name_space = request.session['name_space']
    document = request.session['document']
    collection = request.session['collection']
    language = request.session['language']

    if request.method == 'GET':
        if request.GET.get('user', None) is not None:
            username = request.GET.get('user', None)
        if request.GET.get('name_space', None) is not None:
            name_space = request.GET.get('name_space', None)

        language = request.session['language']
        document = request.session['document']
        json_mentions = {}

        json_mentions = generate_relationships_list(username, name_space, document, language)
        # suddivido per semantic areas
        json_ment_areas = transform_relationships_list(json_mentions,document,username,name_space)

        json_ment_areas['total'] = len(json_mentions)
        # print(json_mentions)
        return JsonResponse(json_ment_areas, safe=False)

    elif request.method == 'GET' and type == 'assertions':
        if request.GET.get('user', None) is not None:
            username = request.GET.get('user', None)
        if request.GET.get('name_space', None) is not None:
            name_space = request.GET.get('name_space', None)

        language = request.session['language']
        document = request.session['document']
        json_mentions = {}

        json_ment_areas = {}
        json_assertions = generate_assertions_list(username, name_space, document, language)
        return JsonResponse(json_assertions, safe=False)

    elif request.method == 'POST' and type == 'copy':
        json_body = json.loads(request.body)
        relation = json_body

        subject = relation['subject']
        predicate = relation['predicate']
        object = relation['object']
        user_source = relation['user']

        json_resp = copy_relation_aux(username, name_space, document, language, subject, predicate, object,user_source)
        return JsonResponse(json_resp)

    if request.method == 'POST' and type == 'copy_assertion':

        json_body = json.loads(request.body)
        json_resp = copy_assertion_aux(username, name_space, document, language, json_body)
        return JsonResponse(json_resp)

    elif request.method == 'POST' and type == 'insert':
        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username=username, name_space=name_space)
        document = Document.objects.get(document_id=document, language=language)
        # collection = Collection.objects.get(collection_id = collection)
        json_body = json.loads(request.body)
        to_up = False
        source = json_body['source']
        source_mention = source['mention']
        predicate = json_body['predicate']
        predicate_mention = predicate['mention']
        target = json_body['target']
        target_mention = target['mention']
        try:
            with transaction.atomic():
                insert_new_relationship_if_exists(source_mention, predicate_mention, target_mention, source, target,
                                                  predicate, collection, document, language, user, name_space)

                update_gt(user, name_space, document, language)

            new_rel = generate_relationships_list(user.username, name_space.name_space, document.document_id,
                                                  document.language)
            new_rel = transform_relationships_list(new_rel,document.document_id,username,name_space.name_space)
            return JsonResponse(new_rel, safe=False)

        except Exception as e:
            return JsonResponse({'error': e})

    elif request.method == 'POST' and type == 'update':
        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username=username, name_space=name_space)
        document = Document.objects.get(document_id=document, language=language)
        json_body = json.loads(request.body)
        to_up = False
        source_prev = json_body['prev_subject']
        source_mention_prev = source_prev['mention']
        predicate_prev = json_body['prev_predicate']
        predicate_mention_prev = predicate_prev['mention']
        target_prev = json_body['prev_object']
        target_mention_prev = target_prev['mention']

        source = json_body['source']
        source_mention = source['mention']
        predicate = json_body['predicate']
        predicate_mention = predicate['mention']
        target = json_body['target']
        target_mention = target['mention']

        try:
            with transaction.atomic():
                delete_old_relationship(source_mention_prev, predicate_mention_prev, target_mention_prev, source_prev,
                                        target_prev, predicate_prev, collection, document, language, user, name_space)
                insert_new_relationship_if_exists(source_mention, predicate_mention, target_mention, source, target,
                                                  predicate, collection, document, language, user, name_space)

            update_gt(user, name_space, document, language)

            new_rel = generate_relationships_list(user.username, name_space.name_space, document.document_id,
                                                  document.language)
            new_rel = transform_relationships_list(new_rel,document.document_id,username,name_space.name_space)
            return JsonResponse(new_rel, safe=False)

        except Exception as e:
            print(e)
            return JsonResponse({'error': e})



    elif request.method == 'DELETE':
        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username=username, name_space=name_space)
        document = Document.objects.get(document_id=document, language=language)
        # collection = Collection.objects.get(collection_id = collection)
        json_body = json.loads(request.body)
        to_up = False
        source = json_body['source']
        source_mention = source['mention']
        predicate = json_body['predicate']
        predicate_mention = predicate['mention']
        target = json_body['target']
        target_mention = target['mention']
        try:
            with transaction.atomic():
                delete_old_relationship(source_mention, predicate_mention, target_mention, source, target, predicate,
                                        collection, document, language, user, name_space.name_space)
            update_gt(user, name_space, document, language)

            new_rel = generate_relationships_list(user.username, name_space.name_space, document.document_id,
                                                  document.language)
            new_rel = transform_relationships_list(new_rel,document.document_id,username,name_space.name_space)
            return JsonResponse(new_rel, safe=False)
        except Exception as e:
            return JsonResponse({'error': e})


def get_mentions(request):

    """This view returns the mentions a user annotated in a document"""

    username = request.session['username']
    name_space = request.session['name_space']
    if request.GET.get('user', None) is not None:
        username = request.GET.get('user', None)
    if request.GET.get('name_space', None) is not None:
        name_space = request.GET.get('name_space', None)

    language = request.session['language']
    document = request.session['document']
    json_mentions = {}


    json_mentions['mentions'] = generate_mentions_list(username,name_space,document,language)
    json_mentions['mentions_splitted'] = generate_mentions_list(username,name_space,document,language)

    # print(json_mentions)
    return JsonResponse(json_mentions,safe=False)







def get_concepts(request):

    """This view returns the concepts a user annotated in a document"""

    username = request.session['username']
    name_space = request.session['name_space']
    if request.GET.get('user', None) is not None:
        username = request.GET.get('user', None)
    if request.GET.get('name_space', None) is not None:
        name_space = request.GET.get('name_space', None)

    language = request.session['language']
    document = request.session['document']

    # json_mentions1 = generate_associations_list(username, name_space, document, language)
    json_mentions = generate_associations_list_splitted(username, name_space, document, language)

    # print(json_mentions)
    return JsonResponse(json_mentions, safe=False)

def get_concepts_full(request):

    """This view returns the concepts a user annotated in a document. NOT SPLITTED"""

    username = request.session['username']
    name_space = request.session['name_space']
    if request.GET.get('user', None) is not None:
        username = request.GET.get('user', None)
    if request.GET.get('name_space', None) is not None:
        name_space = request.GET.get('name_space', None)

    language = request.session['language']
    document = request.session['document']

    json_mentions = generate_associations_list(username, name_space, document, language)
    # json_mentions = generate_associations_list_splitted(username, name_space, document, language)

    # print(json_mentions)
    return JsonResponse(json_mentions, safe=False)


def pending_invitations(request):

    """This view returns the number of pending invitations of collections: those such that a user has not accepted yet"""

    username = request.session['username']
    name_space = request.session['name_space']
    name_space = NameSpace.objects.get(name_space=name_space)
    user = User.objects.get(username=username, name_space=name_space)

    sharecollpending = ShareCollection.objects.filter(username=user,name_space=name_space,status = 'Invited')
    json_r = {}
    json_r['count'] = sharecollpending.count()
    json_r['id'] = [x.collection_id_id for x in sharecollpending]
    return JsonResponse(json_r)


def delete_relationship(request):

    """This view deletes a single relationship"""

    username = request.session['username']
    name_space = request.session['name_space']
    document = request.session['document']
    collection = request.session['collection']
    language = request.session['language']

    name_space = NameSpace.objects.get(name_space = name_space)
    user = User.objects.get(username = username, name_space = name_space)
    document = Document.objects.get(document_id = document,language = language)
    # collection = Collection.objects.get(collection_id = collection)
    json_body = json.loads(request.body)
    to_up = False
    source = json_body['source']
    source_mention = source['mention']
    predicate = json_body['predicate']
    predicate_mention = predicate['mention']
    target = json_body['target']
    target_mention = target['mention']
    try:
        with transaction.atomic():
            delete_old_relationship(source_mention,predicate_mention,target_mention,source,target,predicate,collection,document,language,user,name_space)
        update_gt(user,name_space,document,language)


        new_rel = generate_relationships_list(user.username,name_space.name_space,document.document_id,document.language)
        new_rel = transform_relationships_list(new_rel,document.document_id,username,name_space)
        return JsonResponse(new_rel,safe=False)
    except Exception as e:
        return JsonResponse({'error':e})


def update_relationship(request):

    """Update a relationship"""

    username = request.session['username']
    name_space = request.session['name_space']
    document = request.session['document']
    collection = request.session['collection']
    language = request.session['language']

    name_space = NameSpace.objects.get(name_space = name_space)
    user = User.objects.get(username = username, name_space = name_space)
    document = Document.objects.get(document_id = document,language = language)
    # collection = Collection.objects.get(collection_id = collection)
    json_body = json.loads(request.body)
    to_up = False
    source_prev = json_body['prev_subject']
    source_mention_prev = source_prev['mention']
    predicate_prev = json_body['prev_predicate']
    predicate_mention_prev = predicate_prev['mention']
    target_prev = json_body['prev_object']
    target_mention_prev = target_prev['mention']



    source = json_body['source']
    source_mention = source['mention']
    predicate = json_body['predicate']
    predicate_mention = predicate['mention']
    target = json_body['target']
    target_mention = target['mention']



    try:
        with transaction.atomic():
            delete_old_relationship(source_mention_prev,predicate_mention_prev,target_mention_prev,source_prev,target_prev,predicate_prev,collection,document,language,user,name_space)
            insert_new_relationship_if_exists(source_mention,predicate_mention,target_mention,source,target,predicate,collection,document,language,user,name_space)

        update_gt(user,name_space,document,language)


        new_rel = generate_relationships_list(user.username,name_space.name_space,document.document_id,document.language)
        new_rel = transform_relationships_list(new_rel,document.document_id,username,name_space)
        return JsonResponse(new_rel,safe=False)

    except Exception as e:
        print(e)
        return JsonResponse({'error':e})




def add_relationship(request):

    """This view allows to add a relationship in the database"""

    username = request.session['username']
    name_space = request.session['name_space']
    document = request.session['document']
    collection = request.session['collection']
    language = request.session['language']

    name_space = NameSpace.objects.get(name_space = name_space)
    user = User.objects.get(username = username, name_space = name_space)
    document = Document.objects.get(document_id = document,language = language)
    # collection = Collection.objects.get(collection_id = collection)
    json_body = json.loads(request.body)
    to_up = False
    source = json_body['source']
    source_mention = source['mention']
    predicate = json_body['predicate']
    predicate_mention = predicate['mention']
    target = json_body['target']
    target_mention = target['mention']
    try:
        with transaction.atomic():
            insert_new_relationship_if_exists(source_mention,predicate_mention,target_mention,source,target,predicate,collection,document,language,user,name_space)


        if to_up:
            update_gt(user,name_space,document,language)


        new_rel_list = generate_relationships_list(user.username,name_space.name_space,document.document_id,document.language)
        new_rel = transform_relationships_list(new_rel_list,document.document_id,username,name_space)
        return JsonResponse(new_rel,safe=False)

    except Exception as e:
        return JsonResponse({'error':e})



def add_new_concepts_in_batch(request):

    """This view allows to upload a file with a set of new concepts"""

    username = request.session['username']
    name_space = request.session['name_space']
    collection = request.session['collection']

    files = request.FILES.items()
    json_resp = {'msg': 'ok'}
    try:
        for file, filename in files:
            if filename.endswith('json'):
                upload_json_concepts(file, name_space, username, collection)
            elif filename.endswith('csv'):
                upload_csv_concepts(file, name_space, username, collection)
        return JsonResponse(json_resp)
    except Exception as e:
        json_resp = {'error': e}
        JsonResponse(json_resp)





def add_mentions(request):

    """This view allows to add a mention in the database"""

    username = request.session['username']
    name_space = request.session['name_space']
    name_space = NameSpace.objects.get(name_space = name_space)
    user = User.objects.get(username = request.session['username'], name_space = name_space)
    try:
        with transaction.atomic():
            document = Document.objects.get(document_id = request.session['document'],language = request.session['language'])
            json_start_stop = from_start_stop_foreach_key(document.document_content)
            body_json = json.loads(request.body)
            language = document.language
            start = body_json['start']
            stop = body_json['stop'] - 1 # il frontend mi ritorna un indice di troppo
            # print(start, stop)
            mention_text = body_json['mention_text']
            position = body_json['position']

            start,stop = return_start_stop_for_backend(start, stop, position, document.document_content)
            # print(start,stop)
            m = Mention.objects.filter(start = start, stop = stop, document_id = document, language = language).first()

            if not Mention.objects.filter(start = start, stop = stop, document_id = document, language = language).exists():
                Mention.objects.create(start = start, stop = stop, document_id = document,mention_text = mention_text, language = language)

            mention = Mention.objects.get(start = start, stop = stop, document_id = document, language = language)

            if not Annotate.objects.filter(start = mention, stop = stop, username = user, name_space = name_space, document_id = document, language = language).exists():
                Annotate.objects.create(start=mention, stop=stop, username=user, name_space=name_space,document_id=document,
                                        language=language, insertion_time=Now())
                update_gt(user,name_space,document,language)

            json_to_return = {}
            json_to_return['document'] = create_new_content(document, user)
            json_to_return['mentions'] = generate_mentions_list(username, name_space.name_space, document.document_id, language)
            json_to_return['concepts'] = generate_associations_list_splitted(request.session['username'],
                                                                        request.session['name_space'],
                                                                        request.session['document'],
                                                                        request.session['language'])

            json_to_return['mentions_splitted'] = generate_mentions_list_splitted(username, name_space.name_space, document.document_id, language)

        return JsonResponse(json_to_return)
    except Exception as e:
        print('add mention rollback',e)
        return JsonResponse({'error': e}, status = 500)


def delete_label(request):

    """This view removed a label"""

    name_space = request.session['name_space']
    username = request.session['username']
    document = request.session['document']
    language = request.session['language']
    name_space = NameSpace.objects.get(name_space = name_space)
    document = Document.objects.get(document_id=document, language=language)
    user = User.objects.get(username = username, name_space = name_space)
    body_json = json.loads(request.body)
    language = document.language
    label = body_json['label']
    label = Label.objects.get(name=label)
    try:
        with transaction.atomic():
            AnnotateLabel.objects.filter(username=user,document_id=document,language=language,name=label).delete()

            update_gt(user, name_space, document, language)

            return JsonResponse({'msg': 'ok'})

    except Exception as e:
        print(e)
        return JsonResponse({'error':e})


def delete_concept(request):

    """Delete a single concept associated to a mention"""

    body_json = json.loads(request.body)
    json_resp = {'msg': 'ok'}

    name_space = request.session['name_space']
    username = request.session['username']
    document = request.session['document']
    language = request.session['language']
    mentions_list = generate_mentions_list(username,name_space,document,request.session['language'])

    name_space = NameSpace.objects.get(name_space=name_space)
    document = Document.objects.get(document_id=document, language=language)
    user = User.objects.get(username=username, name_space=name_space)
    mention_js = body_json['mention']
    start = mention_js['start']
    stop = mention_js['stop']
    position = mention_js['id']
    position = '_'.join(position.split('_')[:-1])
    start, stop = return_start_stop_for_backend(start, stop, position,document.document_content)
    language = document.language
    mentions_classes = mention_js['mentions'].split()


    start_list = []
    stop_list = []
    start_stop_list = []
    found = False
    # questo pezzo è per l'overlapping: se ho una mention totalmente dentro un'altra, solo in questo caso avrò un concetto associato, se no è associato sempre alla parte non overlapping
    for m in mentions_list:
        pos = m['mentions']
        start = m['start']
        stop = m['stop']
        start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)
        if pos in mentions_classes:
            # for ss in start_stop_list:
            #     if ss[0] <= start <= ss[1] and ss[0] <= stop <= ss[1]:
            #         found = True
            #         break
            start_stop_list.append([start, stop])

        # if found:
        #     break
    start_stop_list = sorted(start_stop_list,key=lambda x: x[1]-x[0])
    start = start_stop_list[0][0]
    stop = start_stop_list[0][1]
    for i in range(len(start_stop_list)-1):
        item_i = start_stop_list[i]
        for j in range(i+1,len(start_stop_list)):
            item_j = start_stop_list[j]
            if item_j[0] <= item_i[0] <= item_j[1] and item_j[0] <= item_i[1]<=item_j[1]:
                start = item_i[0]
                stop = item_i[1]
                found=True
                break
        if found:
            break


    # start = min(start_list)
    # stop = max(stop_list)
    # start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)

    mention = Mention.objects.get(start = start, stop = stop, document_id = document)
    url = body_json['url']
    concept = Concept.objects.get(concept_url = url)
    try:
        with transaction.atomic():
            Associate.objects.filter(concept_url = concept, start = mention, username = user, name_space = name_space, document_id = document).delete()
            update_gt(user, name_space, document, language)
    except Exception as e:
        json_resp = {'error':e}

    return JsonResponse(json_resp)



def annotate_label(request):

    """This view removed a label"""

    name_space = request.session['name_space']
    username = request.session['username']
    document = request.session['document']
    language = request.session['language']
    name_space = NameSpace.objects.get(name_space = name_space)
    document = Document.objects.get(document_id=document, language=language)
    user = User.objects.get(username = username, name_space = name_space)
    body_json = json.loads(request.body)
    language = document.language
    label = body_json['label']
    label = Label.objects.get(name=label)
    try:
        with transaction.atomic():
            AnnotateLabel.objects.create(username=user,document_id=document,language=language,name=label,insertion_time=Now(),name_space=name_space)
            update_gt(user, name_space, document, language)

            return JsonResponse({'msg': 'ok'})

    except Exception as e:
        print(e)
        return JsonResponse({'error':e})





def delete_single_mention(request):

    """This view allows to add a mention in the database"""

    name_space = request.session['name_space']
    username = request.session['username']
    document = request.session['document']
    language = request.session['language']
    name_space = NameSpace.objects.get(name_space = name_space)
    user = User.objects.get(username = username, name_space = name_space)
    try:
        with transaction.atomic():
            document = Document.objects.get(document_id = document,language = language)
            # json_start_stop = from_start_stop_foreach_key(document.document_content)
            body_json = json.loads(request.body)
            language = document.language
            start = body_json['start']
            stop = body_json['stop']
            # print(start, stop)
            mention_text = body_json['mention_text']
            position = body_json['position']
            start,stop = return_start_stop_for_backend(start, stop, position, document.document_content)
            # print(start,stop)
            mention = Mention.objects.get(start = start, stop = stop, document_id = document, language = language)
            Annotate.objects.filter(start=mention, stop=stop, username=user, name_space=name_space,
                                    document_id=document,
                                    language=language).delete()
            Associate.objects.filter(start=mention, stop=stop, username=user, name_space=name_space,
                                    document_id=document,
                                    language=language).delete()

            # relationships
            Link.objects.filter(subject_start=mention.start, subject_stop=mention.stop, username=user, name_space=name_space,
                                     subject_document_id=document.document_id,
                                     subject_language=language).delete()
            Link.objects.filter(predicate_start=mention.start, predicate_stop=mention.stop, username=user, name_space=name_space,
                                     subject_document_id=document.document_id,
                                     subject_language=language).delete()
            Link.objects.filter(object_start=mention.start, object_stop=mention.stop, username=user, name_space=name_space,
                                     subject_document_id=document.document_id,
                                     subject_language=language).delete()

            RelationshipObjMention.objects.filter(start=mention.start, stop=mention.stop, username=user, name_space=name_space,
                                     document_id=document,
                                     language=language).delete()

            RelationshipSubjMention.objects.filter(start=mention.start, stop=mention.stop, username=user, name_space=name_space,
                                     document_id=document,
                                     language=language).delete()

            RelationshipPredMention.objects.filter(start=mention.start, stop=mention.stop, username=user, name_space=name_space,
                                     document_id=document,
                                     language=language).delete()


            RelationshipPredConcept.objects.filter(object_start=mention.start, object_stop=mention.stop, username=user, name_space=name_space,
                                     subject_document_id=document.document_id,
                                     subject_language=language).delete()
            RelationshipPredConcept.objects.filter(subject_start=mention.start, subject_stop=mention.stop, username=user, name_space=name_space,
                                     subject_document_id=document.document_id,
                                     subject_language=language).delete()

            RelationshipSubjConcept.objects.filter(object_start=mention.start, object_stop=mention.stop, username=user, name_space=name_space,
                                     object_document_id=document.document_id,
                                     object_language=language).delete()
            RelationshipSubjConcept.objects.filter(predicate_start=mention.start, predicate_stop=mention.stop, username=user, name_space=name_space,
                                     object_document_id=document.document_id,
                                     object_language=language).delete()

            RelationshipObjConcept.objects.filter(subject_start=mention.start, subject_stop=mention.stop, username=user, name_space=name_space,
                                     subject_document_id=document.document_id,
                                     subject_language=language).delete()
            RelationshipObjConcept.objects.filter(predicate_start=mention.start, predicate_stop=mention.stop, username=user, name_space=name_space,
                                     subject_document_id=document.document_id,
                                     subject_language=language).delete()



            # if Annotate.objects.filter(start=mention, stop=stop,document_id=document,language=language).count() == 0:
            #     Mention.objects.filter(start=start, stop=stop, document_id=document,
            #                            language=language).delete()
            update_gt(user,name_space,document,language)
            new_content = create_new_content(document, user)
            json_resp = {}
            json_resp['document'] = new_content
            json_resp['mentions'] = generate_mentions_list(username,name_space.name_space,document.document_id,language)
            json_resp['mentions_splitted'] = generate_mentions_list_splitted(username,name_space.name_space,document.document_id,language)
            json_resp['concepts'] = generate_associations_list_splitted(username,name_space.name_space,document.document_id,language)
            # print(new_content)
        return JsonResponse(json_resp)
    except Exception as e:
        print('add mention rollback',e)
        return JsonResponse({'error': e}, status = 500)



# UTILITIES

def get_collection_languages(request):
    collection = request.GET.get('collection',None)
    if collection is not None:
        collection = Collection.objects.get(collection_id = collection)
        documents = Document.objects.filter(collection_id = collection).values('language').distinct()
        languages = [document['language'] for document in documents]
        json_dict = {}
        json_dict['languages'] = languages
        return JsonResponse(json_dict)


def get_collection_areas(request):

    """This view return the semantics areas associated to the collection"""

    collection = request.session.get('collection',None)
    if collection is not None:
        collection = Collection.objects.get(collection_id = collection)
        tuples = AddConcept.objects.filter(collection_id = collection).values('name').distinct()
        areas = [concept['name'] for concept in tuples]
        json_dict = {}
        json_dict['areas'] = areas
        return JsonResponse(json_dict)


def get_document_content(request):

    """This view returns the content of the document in json."""

    doc_id = request.GET.get('document_id',None)
    name_space = NameSpace.objects.get(name_space = request.session['name_space'])
    username = request.session['username']
    if(request.GET.get('user') is not None):
        username = request.GET.get('user')
    user = User.objects.get(username = username,name_space = name_space)
    if doc_id is not None:
        document = Document.objects.get(document_id = doc_id,language = request.session['language'])
        content = document.document_content
        new_content = {}

        # for k,v in content.items():
        #     new_content[k] = {}
        #     new_content[k]['no_mention'] = v
        #     # new_content[k] = v
        #     if isinstance(v,list):
        #         # new_content[k] = ', '.join(v)
        #         new_content[k]['no_mention'] = ', '.join(v)

        new_mentions = {}
        new_empty = {}
        new_content['mentions'] = create_new_content(document,user)
        new_content['empty'] = content

        return JsonResponse(new_content)


def get_cur_collection_documents(request):

    """This view returns a list of ids of the documents stored in the current collection. A json is returned where for each id is returned if the document has been annotated by the current user"""

    collection = Collection.objects.get(collection_id = request.session['collection'])
    name_space = NameSpace.objects.get(name_space=request.session['name_space'])
    user = User.objects.get(username=request.session['username'], name_space=name_space)
    docs = Document.objects.filter(collection_id = collection)

    docs_list = []

    for document in docs:
        gt = GroundTruthLogFile.objects.filter(document_id = document,username = user,name_space = name_space).exists()
        json_doc = {'id': document.document_content['document_id'],'hashed_id':document.document_id,'annotated':gt}
        docs_list.append(json_doc)

    # print(docs_list)

    

    docs_list = sorted(docs_list, key=lambda x: x['id'])
    # print(docs_list)
    return JsonResponse(docs_list,safe=False)



def get_collections(request):

    """This method returns the list of collections in the database shared by the user. if the GET request contains a parameter collection, it is returned the description of the requested collection"""

    collection_param = request.GET.get('collection',None)

    name_space = NameSpace.objects.get(name_space=request.session['name_space'])
    user = User.objects.get(username=request.session['username'],name_space=name_space)
    collections = ShareCollection.objects.filter(username=user)
    json_collections = {}
    json_collections['collections'] = []
    for c in collections:
        cid = c.collection_id_id
        json_boj = {}
        json_boj['type'] = c.status

        c = Collection.objects.get(collection_id = cid)
        batches = Document.objects.filter(collection_id = c).values('batch').annotate(total=Count('batch')).order_by('total')

        json_boj['batch'] = []
        for b in batches:
            j_b = {}
            batch = 'batch '+ str(b['batch'])
            j_b[batch] = b['total']
            json_boj['batch'].append(j_b)

        json_boj['name'] = c.name
        json_boj['id'] = cid
        json_boj['description'] = c.description
        json_boj['creator'] = c.username
        json_boj['name_space'] = c.name_space
        json_boj['members'] = []
        time = str(c.insertion_time)
        before_p = time.split('+')
        first_split = before_p[0].split('.')[0]
        time = first_split + '+' + before_p[1]
        json_boj['insertion_time'] = time
        json_boj['date'] = time.split()[0]
        json_boj['labels'] = []
        json_boj['documents_count'] = (Document.objects.filter(collection_id=cid).count())
        docs = Document.objects.filter(collection_id=cid)
        json_boj['annotations_count'] = (GroundTruthLogFile.objects.filter(document_id__in = docs).count())
        json_boj['perc_annotations_all'] = float(round((json_boj['annotations_count']/json_boj['documents_count'])*100,2))
        json_boj['user_annotations_count'] = (GroundTruthLogFile.objects.filter(username=user,name_space=name_space,document_id__in = docs).count())
        json_boj['perc_annotations_user'] = float(round((json_boj['user_annotations_count']/json_boj['documents_count'])*100,2))

        shared_with = ShareCollection.objects.filter(collection_id=c.collection_id)
        for el in shared_with:
            us = User.objects.get(name_space = request.session['name_space'],username = el.username_id)
            if us.username != c.username:
                json_boj['members'].append({'username':us.username,'profile':us.profile})

        # controllo se sono tutti gli utenti appartengono a un profile esatto
        profiles = User.objects.all().values('profile')
        profiles = [p['profile'] for p in profiles]
        for p in profiles:
            users = User.objects.filter(profile = p)
            new_json_members = [j for j in json_boj['members'] if j['profile'] == p]

            if len(users) == len(new_json_members):
                json_boj['members'] = [j for j in json_boj['members'] if j['profile'] != p]
                # json_boj['members'].append({'username': 'All' + p, 'profile':p})

        has_label = HasLabel.objects.filter(collection_id=c.collection_id)
        for el in has_label:
            # label = Label.objects.get(name=el.name_id)
            json_boj['labels'].append(el.name_id)
        json_boj['labels'] = list(set(json_boj['labels']))
        json_collections['collections'].append(json_boj)

        if collection_param is not None and collection_param == cid: # in this case it was reqeusted a specific collection
            return JsonResponse(json_boj)

    json_collections['collections'] = sorted(json_collections['collections'],key=lambda x: x['insertion_time'])
    return JsonResponse(json_collections)




def get_documents_table(request):
    collection = request.GET.get('collection',None)
    collection = Collection.objects.get(collection_id = collection)
    documents = Document.objects.filter(collection_id = collection)
    # mode = NameSpace.objects.get(name_space = request.session['name_space'])
    json_resp = {'documents':[]}
    cursor = connection.cursor()

    for document in documents:
        ns = NameSpace.objects.filter(name_space = 'Human')
        # ns = [namespace.name_space for name_space in ns]
        for name in ns:
            json_doc = {}
            # json_doc[name.name_space] = {}
            json_doc['name_space'] = name.name_space
            if "document_id" in list(document.document_content.keys()):
                json_doc['document_id'] = document.document_content['document_id']
            else:
                json_doc['document_id'] = document.document_id
            json_doc['document_id_hashed'] = document.document_id
            json_doc['language'] = document.language
            json_doc['batch'] = document.batch
            # content = document.document_content
            # json_doc['title'] = document.document_content['title']
            json_doc['content'] = document.document_content
            json_doc['annotators_list'] = []
            json_doc['annotations'] = GroundTruthLogFile.objects.filter(name_space = name, document_id = document).count()
            gt = GroundTruthLogFile.objects.filter(name_space = name, document_id = document).values('username').distinct()
            for g in gt:
                user = User.objects.get(name_space = name, username = g['username'])
                json_doc['annotators_list'].append(user.username)

            json_doc['annotations'] = GroundTruthLogFile.objects.filter(document_id = document,name_space = name).count()
            json_doc['annotators_list_names'] = (json_doc['annotators_list'])
            json_doc['annotators_list'] = len(json_doc['annotators_list'])
            gts = GroundTruthLogFile.objects.filter(name_space = name, document_id = document).order_by('-insertion_time')
            if(gts.exists()):
                json_doc['last_annotation'] = str(gts.first().insertion_time)
            # json_doc['document_level_annotations_count'] = 0
            # json_doc['mention_level_annotations_count'] = 0
            json_doc['mentions_count'] = Annotate.objects.filter(document_id = document, name_space = name).count()
            json_doc['concepts_count'] = Associate.objects.filter(document_id = document, name_space = name).count()
            json_doc['labels_count'] = AnnotateLabel.objects.filter(document_id = document, name_space = name).count()
            json_doc['relationships_count'] = RelationshipPredConcept.objects.filter(subject_document_id = document.document_id, name_space = name).count() + RelationshipObjConcept.objects.filter(subject_document_id = document.document_id, name_space = name).count() + RelationshipSubjConcept.objects.filter(object_document_id = document.document_id, name_space = name).count() + RelationshipObjMention.objects.filter(document_id = document, name_space = name).count() + RelationshipSubjMention.objects.filter(document_id = document, name_space = name).count() + RelationshipPredMention.objects.filter(document_id = document, name_space = name).count() + Link.objects.filter(subject_document_id = document.document_id, name_space = name).count()
            json_doc['assertions_count'] = CreateFact.objects.filter(document_id = document, name_space = name).count()
            json_resp['documents'].append(json_doc)

    return JsonResponse(json_resp)

def get_annotation_mentions(request):

    """returns the distinct mentions for the desired document"""

    document = request.GET.get("document",None)
    document = Document.objects.get(document_id = document)
    ns = NameSpace.objects.filter(name_space='Human')
    json_doc = {}

    for name in ns:
        json_doc['name_space'] = name.name_space
        json_doc['mentions'] = []
        annotations = Annotate.objects.filter(document_id=document, name_space=name).order_by('start').values('start','stop').distinct('start', 'stop')
        for annotation in annotations:
            mention = Mention.objects.get(document_id=document, start=annotation['start'], stop=annotation['stop'])
            text = mention.mention_text
            location_in_text = return_start_stop_for_frontend(mention.start,mention.stop,document.document_content)
            if location_in_text['position'].endswith('value'):
                location_in_text=location_in_text['position'].replace('_value','') + ' - ['+str(location_in_text['start'])+':'+str(location_in_text['stop'])+']'
            else:
                location_in_text=location_in_text['position'].replace('_key','') + '(key) - ['+str(location_in_text['start'])+':'+str(location_in_text['stop'])+']'

            count = Annotate.objects.filter(document_id=document, name_space=name, start=mention, stop=mention.stop).count()
            users = Annotate.objects.filter(document_id=document, name_space=name, start=mention, stop=mention.stop).values('username').distinct('username')
            users = [u['username'] for u in users]
            json_doc['mentions'].append(
                {'start': annotation['start'], 'stop': annotation['stop'],'location_in_text': location_in_text,'annotators':users, 'mention_text': text, 'count': count})
    return JsonResponse(json_doc)


def get_annotation_concepts(request):
    """returns the distinct concepts for the desired document"""

    document = request.GET.get("document", None)
    document = Document.objects.get(document_id=document)
    ns = NameSpace.objects.filter(name_space='Human')
    json_doc = {}

    for name in ns:
        json_doc['name_space'] = name.name_space
        json_doc['concepts'] = []
        annotations = Associate.objects.filter(document_id=document, name_space=name).order_by('start','stop').values('start','concept_url','name',
                                                                                                              'stop').distinct(
            'start', 'stop','concept_url','name')
        for annotation in annotations:
            mention = Mention.objects.get(document_id=document, start=annotation['start'], stop=annotation['stop'])
            location_in_text = return_start_stop_for_frontend(mention.start, mention.stop, document.document_content)
            if location_in_text['position'].endswith('value'):
                location_in_text = location_in_text['position'].replace('_value', '')+ '- ['+str(location_in_text['start'])+':'+str(location_in_text['stop'])+']'
            else:
                location_in_text = location_in_text['position'].replace('_key', '') + '(key) - ['+str(location_in_text['start'])+':'+str(location_in_text['stop'])+']'

            concept = annotation['concept_url']
            concept = Concept.objects.get(concept_url = concept)
            area = annotation['name']
            area = SemanticArea.objects.get(name=area)
            text = mention.mention_text
            count = Associate.objects.filter(document_id=document, concept_url=concept, name=area, name_space=name,
                                             start=mention, stop=mention.stop).count()
            users = Associate.objects.filter(document_id=document, concept_url=concept, name=area, name_space=name,
                                             start=mention, stop=mention.stop).values('username').distinct('username')
            users = [u['username'] for u in users]
            json_doc['concepts'].append(
                {'start': annotation['start'], 'stop': annotation['stop'], 'mention_text': text,'concept_url': concept.concept_url,
                 'concept_name': concept.concept_name,'location_in_text' :location_in_text,'annotators':users,'concept_area': area.name, 'count': count})
    return JsonResponse(json_doc)


def get_annotation_labels(request):
    """returns the distinct mentions for the desired document"""

    document = request.GET.get("document", None)
    document = Document.objects.get(document_id=document)
    ns = NameSpace.objects.filter(name_space='Human')
    json_doc = {}

    for name in ns:
        json_doc['name_space'] = name.name_space
        json_doc['labels'] = []
        labels = AnnotateLabel.objects.filter(document_id=document, name_space=name).distinct('name')
        for l in labels:
            count = AnnotateLabel.objects.filter(name=l.name, document_id=document, name_space=name).count()
            label = l.name_id
            json_doc['labels'].append({'label': label, 'count': count})


    return JsonResponse(json_doc)


def get_annotation_assertions(request):

    document = request.GET.get("document", None)
    document = Document.objects.get(document_id=document)
    ns = NameSpace.objects.filter(name_space='Human')
    json_doc = {}
    for name in ns:
        json_doc['name_space'] = name.name_space
        json_doc['assertions'] = []
        annotations = CreateFact.objects.filter(document_id=document, name_space=name.name_space).values('subject_concept_url','object_concept_url','predicate_concept_url','subject_name','object_name','predicate_name').distinct('subject_concept_url','object_concept_url','predicate_concept_url','subject_name','object_name','predicate_name')

        for annotation in annotations:
            subject_concept = Concept.objects.get(concept_url=annotation['subject_concept_url'])
            predicate_concept = Concept.objects.get(concept_url=annotation['predicate_concept_url'])
            object_concept = Concept.objects.get(concept_url=annotation['object_concept_url'])
            subject_area = SemanticArea.objects.get(name=annotation['subject_name'])
            object_area = SemanticArea.objects.get(name=annotation['object_name'])
            predicate_area = SemanticArea.objects.get(name=annotation['predicate_name'])

            count = CreateFact.objects.filter(document_id=document,
                                              subject_concept_url=annotation['subject_concept_url'],
                                              subject_name=annotation['subject_name'],
                                              object_concept_url=annotation['object_concept_url'],
                                              object_name=annotation['object_name'],
                                              predicate_concept_url=annotation['predicate_concept_url'],
                                              predicate_name=annotation['predicate_name']
                                              ).count()
            users = CreateFact.objects.filter(document_id=document,
                                              subject_concept_url=annotation['subject_concept_url'],
                                              subject_name=annotation['subject_name'],
                                              object_concept_url=annotation['object_concept_url'],
                                              object_name=annotation['object_name'],
                                              predicate_concept_url=annotation['predicate_concept_url'],
                                              predicate_name=annotation['predicate_name']
                                              ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['assertions'].append({'count': count,
                                           'annotators_count': len(users),
                                           'subject_concept_url': subject_concept.concept_url,
                                           'subject_concept_name': subject_concept.concept_name,
                                           'subject_concept_area': subject_area.name,
                                           'object_concept_url': object_concept.concept_url,
                                           'object_concept_name': object_concept.concept_name,
                                           'object_concept_area': object_area.name,
                                           'predicate_concept_url': predicate_concept.concept_url,
                                           'predicate_concept_name': predicate_concept.concept_name,
                                           'predicate_concept_area': predicate_area.name
                                           })
    return JsonResponse(json_doc)


def get_annotation_relationships(request):
    document = request.GET.get("document", None)
    document = Document.objects.get(document_id=document)
    ns = NameSpace.objects.filter(name_space='Human')
    json_doc = {}
    for name in ns:
        json_doc['name_space'] = name.name_space
        json_doc['relationships'] = []
        annotations = Link.objects.filter(subject_document_id=document.document_id, name_space=name).values('object_start','object_stop','subject_start','subject_stop','predicate_start','predicate_stop').distinct('object_start','object_stop','subject_start','subject_stop','predicate_start','predicate_stop')

        for annotation in annotations:
            subject_mention = Mention.objects.get(document_id = document,start=annotation['subject_start'],stop=annotation['subject_stop'])
            js_sub_ret = return_start_stop_for_frontend(subject_mention.start,subject_mention.stop,document.document_content)
            subject_location_in_text = js_sub_ret['position']
            if subject_location_in_text.endswith('_value'):
                subject_location_in_text = subject_location_in_text.replace('_value','')
            else:
                subject_location_in_text = subject_location_in_text.replace('_key',' (key)')
            predicate_mention = Mention.objects.get(document_id = document,start=annotation['predicate_start'],stop=annotation['predicate_stop'])
            js_pred_ret = return_start_stop_for_frontend(predicate_mention.start,predicate_mention.stop,document.document_content)
            predicate_location_in_text = js_pred_ret['position']
            if predicate_location_in_text.endswith('_value'):
                predicate_location_in_text = predicate_location_in_text.replace('_value','')
            else:
                predicate_location_in_text = predicate_location_in_text.replace('_key',' (key)')
            object_mention = Mention.objects.get(document_id = document,start=annotation['object_start'],stop=annotation['object_stop'])
            js_obj_ret = return_start_stop_for_frontend(object_mention.start,object_mention.stop,document.document_content)
            object_location_in_text = js_obj_ret['position']
            if object_location_in_text.endswith('_value'):
                object_location_in_text = object_location_in_text.replace('_value','')
            else:
                object_location_in_text = object_location_in_text.replace('_key',' (key)')

            count = Link.objects.filter(subject_document_id=document.document_id, name_space=name,
                                        subject_start=annotation['subject_start'],
                                        subject_stop=annotation['subject_stop'],
                                        object_start=annotation['object_start'],
                                        object_stop=annotation['object_stop'],
                                        predicate_start=annotation['predicate_start'],
                                        predicate_stop=annotation['predicate_stop'],
                                        ).count()
            users = Link.objects.filter(subject_document_id=document.document_id, name_space=name,
                                        subject_start=annotation['subject_start'],
                                        subject_stop=annotation['subject_stop'],
                                        object_start=annotation['object_start'],
                                        object_stop=annotation['object_stop'],
                                        predicate_start=annotation['predicate_start'],
                                        predicate_stop=annotation['predicate_stop'],
                                        ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['relationships'].append({'count': count,
                                              'annotators':users,
                                              'annotators_count':len(users),
                                              'subject_location_in_text': subject_location_in_text,
                                              'subject_start': js_sub_ret['start'],
                                              'subject_stop': js_sub_ret['stop'],
                                              'subject_mention_text': subject_mention.mention_text,
                                              'object_start': js_obj_ret['start'],
                                              'object_stop': js_obj_ret['stop'],
                                              'object_location_in_text': object_location_in_text,
                                              'predicate_location_in_text': predicate_location_in_text,
                                              'object_mention_text': object_mention.mention_text,
                                              'predicate_start': js_pred_ret['start'],
                                              'predicate_stop': js_pred_ret['stop'],
                                              'predicate_mention_text': predicate_mention.mention_text
                                              })

        annotations = RelationshipSubjConcept.objects.filter(object_document_id=document.document_id, name_space=name).values('name','concept_url','object_start','object_stop','predicate_start','predicate_stop').distinct('name','concept_url','object_start','object_stop','predicate_start','predicate_stop')

        for annotation in annotations:
            concept = Concept.objects.get(concept_url = annotation['concept_url'])
            area = SemanticArea.objects.get(name=annotation['name'])
            predicate_mention = Mention.objects.get(document_id=document, start=annotation['predicate_start'],
                                                    stop=annotation['predicate_stop'])
            object_mention = Mention.objects.get(document_id=document, start=annotation['object_start'],
                                                 stop=annotation['object_stop'])
            js_pred_ret = return_start_stop_for_frontend(predicate_mention.start,predicate_mention.stop,document.document_content)
            js_obj_ret = return_start_stop_for_frontend(object_mention.start,object_mention.stop,document.document_content)
            object_location_in_text = js_obj_ret['position']
            if object_location_in_text.endswith('_value'):
                object_location_in_text = object_location_in_text.replace('_value','')
            else:
                object_location_in_text = object_location_in_text.replace('_key',' (key)')
            predicate_location_in_text = js_pred_ret['position']
            if predicate_location_in_text.endswith('_value'):
                predicate_location_in_text = predicate_location_in_text.replace('_value', '')
            else:
                predicate_location_in_text = predicate_location_in_text.replace('_key', ' (key)')
            count = RelationshipSubjConcept.objects.filter(object_document_id=document.document_id,
                                                           name_space=name,
                                                           concept_url=concept,
                                                           name=annotation['name'],
                                                           object_start=annotation['object_start'],
                                                           object_stop=annotation['object_stop'],
                                                           predicate_start=annotation['predicate_start'],
                                                           predicate_stop=annotation['predicate_stop'],
                                                           ).count()
            users = RelationshipSubjConcept.objects.filter(object_document_id=document.document_id,
                                                           name_space=name,
                                                           concept_url=concept,
                                                           name=annotation['name'],
                                                           object_start=annotation['object_start'],
                                                           object_stop=annotation['object_stop'],
                                                           predicate_start=annotation['predicate_start'],
                                                           predicate_stop=annotation['predicate_stop'],
                                                           ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['relationships'].append({'count': count,'annotators':users,                                              'annotators_count':len(users),

                                              'subject_concept_url': concept.concept_url,
                                              'subject_concept_area': area.name,
                                              'subject_concept_name': concept.concept_name,
                                              'object_start': js_obj_ret['start'],
                                              'object_stop': js_obj_ret['stop'],
                                              'object_mention_text': object_mention.mention_text,
                                              'predicate_start': js_pred_ret['start'],
                                              'predicate_stop': js_pred_ret['stop'],
                                              'predicate_mention_text': predicate_mention.mention_text,
                                              'predicate_location_in_text': predicate_location_in_text,
                                              'object_location_in_text': object_location_in_text

                                              })

        annotations = RelationshipObjConcept.objects.filter(subject_document_id=document.document_id, name_space=name).values('name','concept_url','subject_start','subject_stop','predicate_start','predicate_stop').distinct('name','concept_url','subject_start','subject_stop','predicate_start','predicate_stop')

        for annotation in annotations:
            concept = Concept.objects.get(concept_url=annotation['concept_url'])
            area = SemanticArea.objects.get(name=annotation['name'])
            predicate_mention = Mention.objects.get(document_id=document, start=annotation['predicate_start'],
                                                    stop=annotation['predicate_stop'])
            subject_mention = Mention.objects.get(document_id=document, start=annotation['subject_start'],
                                                  stop=annotation['subject_stop'])
            js_pred_ret = return_start_stop_for_frontend(predicate_mention.start,predicate_mention.stop,document.document_content)
            js_subj_ret = return_start_stop_for_frontend(subject_mention.start,subject_mention.stop,document.document_content)
            predicate_location_in_text = js_pred_ret['position']
            if predicate_location_in_text.endswith('_value'):
                predicate_location_in_text = predicate_location_in_text.replace('_value', '')
            else:
                predicate_location_in_text = predicate_location_in_text.replace('_key', ' (key)')
            subject_location_in_text = js_subj_ret['position']
            if subject_location_in_text.endswith('_value'):
                subject_location_in_text = subject_location_in_text.replace('_value', '')
            else:
                subject_location_in_text = subject_location_in_text.replace('_key', ' (key)')
            count = RelationshipObjConcept.objects.filter(subject_document_id=document.document_id,
                                                          name_space=name,
                                                          concept_url=concept,
                                                          name=annotation['name'],
                                                          subject_start=annotation['subject_start'],
                                                          subject_stop=annotation['subject_stop'],
                                                          predicate_start=annotation['predicate_start'],
                                                          predicate_stop=annotation['predicate_stop'],
                                                          ).count()
            users = RelationshipObjConcept.objects.filter(subject_document_id=document.document_id,
                                                          name_space=name,
                                                          concept_url=concept,
                                                          name=annotation['name'],
                                                          subject_start=annotation['subject_start'],
                                                          subject_stop=annotation['subject_stop'],
                                                          predicate_start=annotation['predicate_start'],
                                                          predicate_stop=annotation['predicate_stop'],
                                                          ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['relationships'].append({'count': count,
                                              'annotators':users,
                                              'annotators_count': len(users),

                                              'object_concept_url': concept.concept_url,
                                              'object_concept_area': area.name,
                                              'object_concept_name': concept.concept_name,
                                              'subject_start': js_subj_ret['start'],
                                              'subject_stop': js_subj_ret['stop'],
                                              'subject_mention_text': subject_mention.mention_text,
                                              'predicate_start': js_pred_ret['start'],
                                              'predicate_stop': js_pred_ret['stop'],
                                              'predicate_mention_text': predicate_mention.mention_text,
                                              'predicate_location_in_text': predicate_location_in_text,
                                              'subject_location_in_text': subject_location_in_text
                                              })

        annotations = RelationshipPredConcept.objects.filter(subject_document_id=document.document_id, name_space=name).values('name','concept_url','subject_start','subject_stop','object_start','object_stop').distinct('name','concept_url','subject_start','subject_stop','object_start','object_stop')
        for annotation in annotations:
            concept = Concept.objects.get(concept_url = annotation['concept_url'])
            area = SemanticArea.objects.get(name=annotation['name'])
            object_mention = Mention.objects.get(document_id=document, start=annotation['object_start'],
                                                 stop=annotation['object_stop'])
            subject_mention = Mention.objects.get(document_id=document, start=annotation['subject_start'],
                                                  stop=annotation['subject_stop'])



            js_obj_ret = return_start_stop_for_frontend(object_mention.start,object_mention.stop,document.document_content)
            js_subj_ret = return_start_stop_for_frontend(subject_mention.start,subject_mention.stop,document.document_content)



            object_location_in_text = js_obj_ret['position']
            if object_location_in_text.endswith('_value'):
                object_location_in_text = object_location_in_text.replace('_value', '')
            else:
                object_location_in_text = object_location_in_text.replace('_key', ' (key)')
            subject_location_in_text = js_subj_ret['position']
            if subject_location_in_text.endswith('_value'):
                subject_location_in_text = subject_location_in_text.replace('_value', '')
            else:
                subject_location_in_text = subject_location_in_text.replace('_key', ' (key)')
            count = RelationshipPredConcept.objects.filter(subject_document_id=document.document_id,
                                                           name_space=name,
                                                           concept_url=concept,
                                                           name=annotation['name'],
                                                           subject_start=annotation['subject_start'],
                                                           subject_stop=annotation['subject_stop'],
                                                           object_start=annotation['object_start'],
                                                           object_stop=annotation['object_stop'],
                                                           ).count()

            users =RelationshipPredConcept.objects.filter(subject_document_id=document.document_id,
                                                           name_space=name,
                                                           concept_url=concept,
                                                           name=annotation['name'],
                                                           subject_start=annotation['subject_start'],
                                                           subject_stop=annotation['subject_stop'],
                                                           object_start=annotation['object_start'],
                                                           object_stop=annotation['object_stop'],
                                                           ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['relationships'].append({'count': count,'annotators':users,'annotators_count': len(users),

                                              'predicate_concept_url': concept.concept_url,
                                              'predicate_concept_area': area.name,
                                              'predicate_concept_name': concept.concept_name,
                                              'subject_start': js_subj_ret['start'],
                                              'subject_stop': js_subj_ret['stop'],
                                              'subject_mention_text': subject_mention.mention_text,
                                              'object_start': js_obj_ret['start'],
                                              'object_stop': js_obj_ret['stop'],
                                              'object_mention_text': object_mention.mention_text,
                                              'subject_location_in_text': subject_location_in_text,
                                              'object_location_in_text': object_location_in_text
                                              })

        annotations = RelationshipSubjMention.objects.filter(document_id=document, name_space=name).values('object_concept_url','start','stop','predicate_concept_url','object_name','predicate_name').distinct('object_concept_url','start','stop','predicate_concept_url','object_name','predicate_name')

        for annotation in annotations:
            mention = Mention.objects.get(document_id=document, start=annotation['start'], stop=annotation['stop'])
            js_ret = return_start_stop_for_frontend(mention.start,mention.stop,document.document_content)
            predicate_concept = Concept.objects.get(concept_url=annotation['predicate_concept_url'])
            object_concept = Concept.objects.get(concept_url=annotation['object_concept_url'])
            object_area = SemanticArea.objects.get(name=annotation['object_name'])
            predicate_area = SemanticArea.objects.get(name=annotation['predicate_name'])
            subject_location_in_text = js_ret['position']
            if subject_location_in_text.endswith('_value'):
                subject_location_in_text = subject_location_in_text.replace('_value', '')
            else:
                subject_location_in_text = subject_location_in_text.replace('_key', ' (key)')
            count = RelationshipSubjMention.objects.filter(document_id=document,
                                                           start=mention, stop=mention.stop,
                                                           object_concept_url=annotation['object_concept_url'],
                                                           object_name=annotation['object_name'],
                                                           predicate_concept_url=annotation['predicate_concept_url'],
                                                           predicate_name=annotation['predicate_name']
                                                           ).count()
            users =RelationshipSubjMention.objects.filter(document_id=document,
                                                           start=mention, stop=mention.stop,
                                                           object_concept_url=annotation['object_concept_url'],
                                                           object_name=annotation['object_name'],
                                                           predicate_concept_url=annotation['predicate_concept_url'],
                                                           predicate_name=annotation['predicate_name']
                                                           ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['relationships'].append({'count': count,'annotators':users,
                                              'annotators_count': len(users),

                                              'subject_start': js_ret['start'],
                                              'subject_stop': js_ret['stop'],
                                              'subject_location_in_text':subject_location_in_text,
                                              'subject_mention_text': mention.mention_text,
                                              'object_concept_url': object_concept.concept_url,
                                              'object_concept_name': object_concept.concept_name,
                                              'object_concept_area': object_area.name,
                                              'predicate_concept_url': predicate_concept.concept_url,
                                              'predicate_concept_name': predicate_concept.concept_name,
                                              'predicate_concept_area': predicate_area.name
                                              })

        annotations = RelationshipObjMention.objects.filter(document_id=document, name_space=name).values('subject_concept_url','start','stop','predicate_concept_url','subject_name','predicate_name').distinct('subject_concept_url','start','stop','predicate_concept_url','subject_name','predicate_name')
        for annotation in annotations:
            mention = Mention.objects.get(document_id=document, start=annotation['start'], stop=annotation['stop'])

            predicate_concept = Concept.objects.get(concept_url=annotation['predicate_concept_url'])
            subject_concept = Concept.objects.get(concept_url=annotation['subject_concept_url'])
            subject_area = SemanticArea.objects.get(name=annotation['subject_name'])
            predicate_area = SemanticArea.objects.get(name=annotation['predicate_name'])
            js_ret = return_start_stop_for_frontend(mention.start,mention.stop,document.document_content)
            object_location_in_text = js_ret['position']
            if object_location_in_text.endswith('_value'):
                object_location_in_text = object_location_in_text.replace('_value', '')
            else:
                object_location_in_text = object_location_in_text.replace('_key', ' (key)')
            count = RelationshipObjMention.objects.filter(document_id=document,
                                                          subject_concept_url=subject_concept.concept_url,
                                                          subject_name=subject_area.name,
                                                          predicate_concept_url=predicate_concept.concept_url,
                                                          predicate_name=predicate_area.name,
                                                          start=mention, stop=mention.stop
                                                          ).count()
            users = RelationshipObjMention.objects.filter(document_id=document,
                                                          subject_concept_url=subject_concept.concept_url,
                                                          subject_name=subject_area.name,
                                                          predicate_concept_url=predicate_concept.concept_url,
                                                          predicate_name=predicate_area.name,
                                                          start=mention, stop=mention.stop
                                                          ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['relationships'].append({'count': count,'annotators':users,
                                              'annotators_count': len(users),

                                              'object_start': js_ret['start'],
                                              'object_stop': js_ret['stop'],
                                              'object_location_in_text':object_location_in_text,
                                              'object_mention_text': mention.mention_text,
                                              'subject_concept_url': subject_concept.concept_url,
                                              'subject_concept_name': subject_concept.concept_name,
                                              'subject_concept_area': subject_area.name,
                                              'predicate_concept_url': predicate_concept.concept_url,
                                              'predicate_concept_name': predicate_concept.concept_name,
                                              'predicate_concept_area': predicate_area.name
                                              })

        annotations = RelationshipPredMention.objects.filter(document_id=document, name_space=name).values('subject_concept_url','start','stop','object_concept_url','subject_name','object_name').distinct('subject_concept_url','start','stop','object_concept_url','subject_name','object_name')
        for annotation in annotations:
            mention = Mention.objects.get(document_id=document, start=annotation['start'], stop=annotation['stop'])
            js_ret = return_start_stop_for_frontend(mention.start,mention.stop,document.document_content)
            location_in_text = js_ret['position']
            predicate_location_in_text = js_ret['position']
            if predicate_location_in_text.endswith('_value'):
                predicate_location_in_text = predicate_location_in_text.replace('_value', '')
            else:
                predicate_location_in_text = predicate_location_in_text.replace('_key', ' (key)')
            object_concept = Concept.objects.get(concept_url=annotation['object_concept_url'])
            subject_concept = Concept.objects.get(concept_url=annotation['subject_concept_url'])
            subject_area = SemanticArea.objects.get(name=annotation['subject_name'])
            object_area = SemanticArea.objects.get(name=annotation['object_name'])

            count = RelationshipPredMention.objects.filter(document_id=document,
                                                           subject_concept_url=subject_concept.concept_url,
                                                           subject_name=subject_area.name,
                                                           object_concept_url=object_concept.concept_url,
                                                           object_name=object_area.name,
                                                           start=mention, stop=mention.stop
                                                           ).count()
            users = RelationshipPredMention.objects.filter(document_id=document,
                                                           subject_concept_url=subject_concept.concept_url,
                                                           subject_name=subject_area.name,
                                                           object_concept_url=object_concept.concept_url,
                                                           object_name=object_area.name,
                                                           start=mention, stop=mention.stop
                                                           ).values('username').distinct('username')
            users = [x['username'] for x in users]
            json_doc['relationships'].append({'count': count,'annotators':users,
                                              'annotators_count': len(users),

                                              'predicate_start': js_ret['start'],
                                              'predicate_stop': js_ret['stop'],
                                              'predicate_location_in_text': predicate_location_in_text,
                                              'predicate_mention_text': mention.mention_text,
                                              'subject_concept_url': subject_concept.concept_url,
                                              'subject_concept_name': subject_concept.concept_name,
                                              'subject_concept_area': subject_area.name,
                                              'object_concept_url': object_concept.concept_url,
                                              'object_concept_name': object_concept.concept_name,
                                              'object_concept_area': object_area.name
                                              })

    return JsonResponse(json_doc)

def delete_single_document(request):

    """This view removes a document from a collection"""

    document = json.loads(request.body)
    document = Document.objects.get(document_id = document['document'])
    collection = document.collection_id
    try:
        with transaction.atomic():
            Annotate.objects.filter(document_id = document).delete()

            CreateFact.objects.filter(document_id=document).delete()
            RelationshipPredMention.objects.filter(document_id=document).delete()
            RelationshipObjMention.objects.filter(document_id=document).delete()
            RelationshipSubjMention.objects.filter(document_id=document).delete()
            RelationshipSubjConcept.objects.filter(object_document_id=document.document_id).delete()
            RelationshipObjConcept.objects.filter(subject_document_id=document.document_id).delete()
            RelationshipPredConcept.objects.filter(object_document_id=document.document_id).delete()
            Link.objects.filter(object_document_id=document.document_id).delete()

            Associate.objects.filter(document_id=document).delete()
            AnnotateLabel.objects.filter(document_id=document).delete()
            GroundTruthLogFile.objects.filter(document_id=document).delete()
            Mention.objects.filter(document_id = document.document_id).delete()
            if document.document_id == request.session['document']:
                name_space = NameSpace.objects.get(name_space = request.session['name_space'])
                user = User.objects.filter(username = request.session['username'],name_space = name_space)
                gts = GroundTruthLogFile.objects.filter(username__in=user).order_by('-insertion_time')
                for g in gts:
                    document = g.document_id
                    if document.collection_id_id == request.session['collection']:
                        request.session['document'] = document.document_id
                        break
                if gts.count() == 0:
                    doc = Document.objects.filter(collection_id = collection).first()
                    request.session['document'] = doc.document_id
            Document.objects.filter(document_id = document.document_id).delete()


            return JsonResponse({'msg':'ok'})
    except Exception as e:
        print(e)
        return JsonResponse({'error':e})


def get_users_list(request):

    """This method returns the list of users"""

    name_space = NameSpace.objects.get(name_space=request.session['name_space'])
    users = User.objects.filter(name_space = name_space).all()
    users_list = {}
    users_list['users'] = []
    for u in users:
        json_user = {}
        json_user['username'] = u.username
        json_user['profile'] = u.profile
        json_user['name_space'] = u.name_space_id
        json_user['orcid'] = u.orcid
        json_user['ncbi_key'] = u.ncbi_key
        if json_user not in users_list['users']:
            users_list['users'].append(json_user)
    return JsonResponse(users_list)


def get_count_per_label(request):

    """This view returns for each label the number of documents it has been associated to"""

    collection = request.GET.get('collection',None)
    json_resp = {}
    collection = Collection.objects.get(collection_id = collection)
    labels = HasLabel.objects.filter(collection_id = collection)
    for label in labels:
        json_resp[label.name] = 0

    labels_with_count = AnnotateLabel.objects.filter(collection_id = collection).values('name').annotate(total=Count('name')).order_by('total')
    for label in labels_with_count:
        json_resp[label['name']] = label['total']

    return json_resp


def get_count_per_user(request):

    """This view returns for each user the number of documents she annotated (given a collection)"""

    collection = request.GET.get('collection', None)
    json_resp = {}
    collection = Collection.objects.get(collection_id=collection)
    users = ShareCollection.objects.filter(collection_id = collection)
    for user in users:
        gt = GroundTruthLogFile.objects.filter(collection_id=collection,username = user).values('document_id').distinct().count()
        json_resp[user.username] = gt

    return json_resp


def get_labels_list(request):

    """This view returns the list of labels associated to a collection"""

    collection = request.GET.get('collection',None)
    collection = Collection.objects.get(collection_id = collection)
    labels = HasLabel.objects.filter(collection_id = collection)
    json_labels = {}
    json_labels['labels'] = []
    for label in labels:
        json_labels['labels'].append(label.name_id)
    return JsonResponse(json_labels)


def get_members_list(request):

    """This view returns the list of memebrs associated to a collection"""

    collection = request.GET.get('collection',None)
    collection = Collection.objects.get(collection_id = collection)
    shared = ShareCollection.objects.filter(collection_id = collection)
    json_boj = {}
    json_boj['members'] = []
    for us in shared:
        us1 = User.objects.get(name_space=request.session['name_space'], username=us.username_id)
        if us1.username != request.session['username']:
            json_boj['members'].append({'username': us.username, 'profile': us.profile, 'status':us.status})

    # controllo se sono tutti gli utenti appartengono a un profile esatto
    profiles = User.objects.all().values('profile')
    profiles = [p['profile'] for p in profiles]
    # creator = collection.username
    # profile_creator = User.objects.filter(username = creator).first()
    # profile_creator = profile_creator.profile

    for p in profiles:
        users = User.objects.filter(profile=p)
        new_json_members = [j for j in json_boj['members'] if j['profile'] == p]


        if len(users) == len(new_json_members) :
            json_boj['members'] = [j for j in json_boj['members'] if j['profile'] != p]
            # json_boj['members'].append({'username': 'All' + p, 'profile': p})

    return JsonResponse(json_boj)


def get_collection_documents(request):

    """This view returns the list of documents associated to a collection"""

    docs_to_ret = {}
    docs_to_ret['documents'] = []
    collection = request.GET.get('coll',None)
    # collection_to_find = request.session['collection']
    collection = Collection.objects.get(collection_id = collection)
    documents = Document.objects.filter(collection_id = collection)
    for doc in documents:
        json_obj = doc.document_content
        # pid = json_obj.get('document_id', '')
        #
        # if pid == '':
        #     json_obj['document_id'] = doc.document_id

        language = json_obj.get('language', '')
        if language == '':
            json_obj['language'] = doc.language

        docs_to_ret['documents'].append(json_obj)

    return JsonResponse(docs_to_ret)


def get_user_annotation_count_per_collection(request):

    """This view returns the total count of documents a user annotated in a collection"""

    collection = request.GET.get('collection',None)
    mode = NameSpace.objects.get(name_space = request.session['name_space'])
    user = request.GET.get('user',None)
    if collection is not None and user is not None:
        collection = Collection.objects.get(collection_id=collection)
        user = User.objects.get(name_space = mode, username = user)
        gt = GroundTruthLogFile.objects.filter(username = user,  collection_id=collection).exclude(revised = False).values('document_id').distinct()
        return JsonResponse({'count':gt.count()})
    return JsonResponse({'error': 'error'})



def download_template_concepts(request):
    if request.method == 'GET':
        format = request.GET.get('type', None)



        if format == 'json':
            workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
            path = os.path.join(workpath, './static/templates_to_download/template_concepts.json')
            with open(path,'r') as f:
                json_resp = json.load(f)
                return JsonResponse(json_resp)
        elif format == 'doc_json':
            workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
            path = os.path.join(workpath, './static/templates_to_download/template_documents.json')
            with open(path,'r') as f:
                json_resp = json.load(f)
                return JsonResponse(json_resp)

        elif format == 'csv':
            workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
            path = os.path.join(workpath, './static/templates_to_download/template_concepts.csv')



            content = open(path, 'r')
            return HttpResponse(content, content_type='text/csv')



# ADD DATA
from django.core.mail import send_mail
def create_new_collection(request):

    """This method allows to create a new collection. The uploaded documents are inserted in the database"""

    try:
        with transaction.atomic():

            name = request.POST.get('name', None)
            labels = request.POST.get('labels', None)
            description = request.POST.get('description', None)
            to_enc = name + request.session['username']
            username = request.session['username']
            collection_id = hashlib.md5(to_enc.encode()).hexdigest()
            share_with = request.POST.get('members', None)
            # if share_with in ['All Professor', 'All Student', 'All Beginner','All Expert', 'All Tech','All Admin']:
            #     members = User.objects.filter(profile = share_with.split('All')[1].strip())
            #     share_with = [m.username for m in members]
            # else:
            if share_with == '' or share_with is None:
                share_with = []
            else:
                share_with = share_with.split(',')


            if labels == '' or labels is None:
                labels = []
            else:
                labels = labels.split(',')

            collection = Collection.objects.create(collection_id=collection_id,description=description,name=name,insertion_time=Now(),username = request.session['username'],name_space=request.session['name_space'])

            name_space = NameSpace.objects.get(name_space = request.session['name_space'])
            creator = User.objects.filter(username = request.session['username'],name_space = name_space)
            for c in creator: # gestisco i vari name space
                ShareCollection.objects.create(collection_id=collection, username=c.username, name_space=c.name_space,status='Creator')
            for user in share_with:
                if user != request.session['username']:
                # checked_all_profiles = []
                # if user in ['All Tech', 'All Student', 'All Admin', 'All Expert', 'All Beginner',
                #                      'All Professor']:
                #     checked_all_profiles.append(user.profile)
                #     users = User.objects.filter(profile = user.profile).exclude(username = request.session['username'])
                #     for u in users:
                    us = User.objects.get(username=user,name_space=name_space)
                    ShareCollection.objects.create(collection_id=collection, username=us,name_space=us.name_space,status='Invited')


            for label in labels:
                if not Label.objects.filter(name=label).exists():
                    label = Label.objects.create(name=label)
                else:
                    label = Label.objects.get(name=label)
                if not HasLabel.objects.filter(collection_id=collection, name = label).exists():
                    HasLabel.objects.create(collection_id=collection,name = label)

            files = request.FILES.items()
            for file, filename in files:
                if filename.endswith('json'):
                    upload_json_concepts(file, name_space, username, collection)
                elif filename.endswith('csv'):
                    upload_csv_concepts(file, name_space, username, collection)

            pubmed_ids = request.POST.get('pubmed_ids', None)
            if pubmed_ids is not None:
                pubmed_ids = pubmed_ids.split()
                for pid in pubmed_ids:
                    json_val = insert_articles_of_PUBMED(pid)
                    if json_val:
                        to_enc_id = request.session['username'] + str(datetime.now())
                        pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                        if not Document.objects.filter(document_id=pid).exists():
                            Document.objects.create(batch=1, document_id=pid,
                                                    provenance='pubmed', language='english', document_content=json_val,
                                                    insertion_time=Now(), collection_id=collection)

            openaire_ids = request.POST.get('openaire_ids', None)
            if openaire_ids is not None:
                openaire_ids = openaire_ids.split()
                # for pid in openaire_ids:
                json_val = insert_articles_of_OpenAIRE(openaire_ids)
                if json_val:
                    for doc in json_val['documents']:
                        # pid = doc['document_id']
                        to_enc_id = request.session['username'] + str(datetime.now())
                        pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                        if not Document.objects.filter(document_id=pid).exists():
                            Document.objects.create(batch=1, document_id=pid,
                                                    provenance='openaire', language='english', document_content=json_val,
                                                    insertion_time=Now(), collection_id=collection)

            semantic_ids = request.POST.get('semantic_ids', None)
            if semantic_ids is not None:
                semantic_ids = semantic_ids.split()
                # for pid in openaire_ids:
                json_val = insert_articles_of_semantic(semantic_ids)
                if json_val:
                    for doc in json_val['documents']:
                        # pid = doc['document_id']
                        to_enc_id = request.session['username'] + str(datetime.now())
                        pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                        if not Document.objects.filter(document_id=pid).exists():
                            Document.objects.create(batch=1,  document_id=pid,
                                                    provenance='semantic scholar', language='english', document_content=json_val,
                                                    insertion_time=Now(), collection_id=collection)
            files = request.FILES.items()
            for file,filename in files:
                json_contents = create_json_content_from_file(file)
                for json_content in json_contents:
                    # pid = ''
                    language = 'english'
                    # if 'document_id' in list(json_content.keys()):
                    #     pid = json_content['document_id']
                    # else:
                    #     to_enc_id = collection_id + str(json_contents.index(json_content))
                    #     pid = hashlib.md5(to_enc_id.encode()).hexdigest()

                    if 'language' in list(json_content.keys()) and not json_content['language'].lower() == 'english':
                        language = json_content['language']

                    # for k,v in json_content.items():
                    #     json_content[k] = re.sub('\s+', ' ', v)
                    to_enc_id = request.session['username'] + str(datetime.now())
                    pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                    Document.objects.create(batch = 1,collection_id=collection,document_id=pid,language=language, document_content=json_content,insertion_time=Now())



    except Exception as e:
        print(e)
        json_resp = {'error':e}

    else:
        json_resp = {'message':'ok'}
    finally:
        return JsonResponse(json_resp)


def add_member(request):

    """This view adds new members to a collection: once added they can have access to the collection's documents"""

    try:
        with transaction.atomic():
            json_resp = {'msg':'ok'}
            # name_space = NameSpace.objects.get(name_space=request.session['name_space'])
            request_body_json = json.loads(request.body)
            members = request_body_json['members']
            # for m in members:
                # if m in ['All Professor','All Student','All Tech','All Beginner','All Expert','All Admin'] :
                #     members_all = User.objects.filter(profile = m['username'].split('All')[1].strip()).exclude(username = request.session['username'])
                #     members_all = [{'username':m.username} for m in members_all if m['username'] != request.session['username']]
                #     members = members + members_all
            collection = request_body_json['collection']
            collection = Collection.objects.get(collection_id = collection)
            # members = list(set(members))

            for member in members:
                # if member not in ['All Professor','All Student','All Tech','All Beginner','All Expert','All Admin']:
                name_space = NameSpace.objects.get(name_space = request.session['name_space'])
                users = User.objects.filter(username = member, name_space = name_space)
                for user in users:
                    if not ShareCollection.objects.filter(collection_id=collection, username = user, name_space = user.name_space).exists():
                        ShareCollection.objects.create(collection_id = collection, username = user, name_space=user.name_space,status='Invited')
    except Exception as e:
        print(e)
        json_resp = {'error':e}
    finally:
        return JsonResponse(json_resp)


def add_labels(request):

    """This view adds new labels to a collection"""

    try:
        with transaction.atomic():
            json_resp = {'msg':'ok'}

            request_body_json = json.loads(request.body)
            labels = request_body_json['labels'].split('\n')
            collection = request_body_json['collection']
            collection = Collection.objects.get(collection_id = collection)
            for label in labels:
                if not Label.objects.filter(name=label).exists():
                    label_to_add = Label.objects.create(name=label)
                else:
                    label_to_add = Label.objects.get(name=label)
                if not HasLabel.objects.filter(collection_id=collection, name=label_to_add).exists():
                    HasLabel.objects.create(collection_id = collection, name = label_to_add)


    except Exception as e:
        print(e)
        json_resp = {'error':e}
    finally:
        return JsonResponse(json_resp)




def transfer_annotations(request):

    """This view transfer the annotations of a predefined user to the logged in user. If overwrite is true the
    annotations of the new user will overwrite the one of the current logged in user."""

    collection = request.POST.get('collection',None)
    user_from = request.POST.get('user',None)
    user_to = request.session['username']
    overwrite = request.POST.get('overwrite',None)
    json_resp = {'msg':'ok'}
    try:
        with transaction.atomic():
            collection = Collection.objects.get(collection_id = collection)
            modes = NameSpace.objects.all()
            for mode in modes:
                user_from = User.objects.get(username = user_from, name_space = mode)
                user_to = User.objects.get(username = user_to, name_space = mode)
                annotate_rows = Annotate.objects.filter(username = user_from, name_space = mode, collection_id = collection)
                associate_rows = Associate.objects.filter(username = user_from, name_space = mode, collection_id = collection)
                link_rows = Link.objects.filter(username = user_from, name_space = mode, object_collection_id = collection)
                # relationship_rows = Relationship.objects.filter(username = user_from, name_space = mode, object_collection_id = collection)
                annotate_label_rows = AnnotateLabel.objects.filter(username = user_from, name_space = mode, collection_id = collection)

                if not overwrite:
                    AnnotateLabel.objects.filter(username = user_to, name_space = mode, collection_id = collection).delete()
                    Annotate.objects.filter(username=user_to, name_space=mode, collection_id=collection).delete()
                    Associate.objects.filter(username=user_to, name_space=mode, collection_id=collection).delete()
                    # Relationship.objects.filter(username=user_to, name_space=mode, collection_id=collection).delete()
                    Link.objects.filter(username=user_to, name_space=mode, collection_id=collection).delete()
                    GroundTruthLogFile.objects.filter(username=user_to, name_space=mode, collection_id=collection).delete()
                #
                #
                # copy annotate
                for annotation in annotate_rows:
                    # se sovrascrivo
                    if overwrite:
                        # Annotate.objects.filter(username=user_to, name_space=mode, collection_id=collection).delete()
                        Annotate.objects.create(username = user_to, name_space = mode, collection_id = collection,document_id = annotation.document_id,
                                            language = annotation.language, start = annotation.start, stop = annotation.stop, insertion_time = annotation.insertion_time)
                    elif not overwrite and not Annotate.objects.filter(username=user_to, document_to=annotation.document_id,name_space=mode, collection_id=collection).exists():
                        Annotate.objects.create(username=user_to, name_space=mode, collection_id=collection,
                                                document_id=annotation.document_id,
                                                language=annotation.language, start=annotation.start, stop=annotation.stop,
                                                insertion_time=annotation.insertion_time)
                # copy associate
                for annotation in associate_rows:
                    if overwrite:
                        Associate.objects.create(username=user_to, name_space=mode, collection_id=collection,
                                            document_id=annotation.document_id,
                                            language=annotation.language, start=annotation.start, stop=annotation.stop,
                                            insertion_time=annotation.insertion_time,concept_url = annotation.concept_url)
                    elif not overwrite and not Associate.objects.filter(username=user_to, document_to=annotation.document_id,name_space=mode, collection_id=collection).exists():
                        Associate.objects.create(username=user_to, name_space=mode, collection_id=collection,
                                                 document_id=annotation.document_id,
                                                 language=annotation.language, start=annotation.start, stop=annotation.stop,
                                                 insertion_time=annotation.insertion_time, concept_url=annotation.concept_url)
                # copy link

                # copy relationship


                # copy annotate_label
                for annotation in annotate_label_rows:
                    if overwrite:
                        AnnotateLabel.objects.create(username=user_to, name_space=mode, collection_id=collection,
                                            document_id=annotation.document_id,
                                            language=annotation.language,
                                            insertion_time=annotation.insertion_time,name = annotation.name)
                    elif not overwrite and not AnnotateLabel.objects.filter(username = user_to,document_to=annotation.document_id, name_space = mode, collection_id = collection).exists():
                        AnnotateLabel.objects.create(username=user_to, name_space=mode, collection_id=collection,
                                                     document_id=annotation.document_id,
                                                     language=annotation.language,
                                                     insertion_time=annotation.insertion_time, name=annotation.name)

                # copy ground_truth_log_file
                ground_truth_log_file_rows = GroundTruthLogFile.objects.filter(username = user_from, name_space = mode, collection_id = collection)
                for annotation in ground_truth_log_file_rows:
                    if overwrite:
                        GroundTruthLogFile.objects.create(username=user_to, name_space=mode, collection_id=collection,
                                            document_id=annotation.document_id,gt_type=annotation.gt_type, gt_json = annotation.gt_json,
                                            language=annotation.language, revised = False,
                                            insertion_time=annotation.insertion_time)
                    elif not overwrite and not GroundTruthLogFile.objects.filter(username=user_to, document_to=annotation.document_id, name_space=mode, collection_id=collection).exists():
                        GroundTruthLogFile.objects.create(username=user_to, name_space=mode, collection_id=collection,
                                                          document_id=annotation.document_id, gt_type=annotation.gt_type,
                                                          gt_json=annotation.gt_json,
                                                          language=annotation.language, revised=False,
                                                          insertion_time=annotation.insertion_time)
    except Exception as e:
        json_resp = {'error':e}
    finally:
        return JsonResponse(json_resp)


def check_json_csv_fields(request):

    """This method detects new fields in csv and json uploaded documents"""

    fields = {'csv':[],'json':[]}
    csv_files = []
    json_files = []

    for filename, file in request.FILES.items():
        if filename.endswith('csv'):
            csv_files.append(file)
        if filename.startswith('json'):
            json_files.append(file)

    csv_fields = get_csv_fields(csv_files)
    json_fields = get_json_fields(csv_files)

    if len(csv_fields) > 1:
        fields['csv'] = csv_fields
    if len(json_fields) > 1:
        fields['json'] = json_fields

    # fields['fields'] = list(set(fields['csv'] + fields['json']))

    return JsonResponse(fields)

def get_fields(request):

    """This view returns the list of keys of the document"""

    document_id = request.session['document']
    language = request.session['language']
    keys = get_fields_list(document_id, language)
    json_resp = {}
    json_resp['fields'] = keys
    # json_resp['fields_to_ann'] = request.session.get('fields_to_anm',[])
    #
    # if not all(x in keys for x in request.session['fields_to_ann']):
    #
    #     json_resp['fields_to_ann'] = keys
    #     request.session['fields_to_ann'] = keys
    #
    # json_resp['fields'] = keys
    # request.session['fields'] = keys
    if all(x in keys for x in request.session['fields_to_ann']):
        request.session['fields'] = keys
        json_resp['fields_to_ann'] = request.session['fields_to_ann']
    else:
        json_resp['fields'] = keys
        json_resp['fields_to_ann'] = keys
    # if all(x not in keys for x in request.session['fields_to_ann']):
    #     request.session['fields'] = keys
    #     request.session['fields_to_ann'] = list(set(request.session.get('fields_to_ann',[]) + keys))
    #     json_resp['fields_to_ann'] = list(set(request.session.get('fields_to_ann',[]) + keys))
    # else:
    #     json_resp['fields'] = request.session.get('fields', [])
    #     json_resp['fields_to_ann'] = request.session.get('fields_to_ann', [])
    return JsonResponse(json_resp)



# DELETE

def delete_member_from_collection(request):

    """This method delete a member from ShareCollection: this means that that member won't see that collection anymore hence she won't be able to annotate its documents."""

    request_body_json = json.loads(request.body)
    try:
        with transaction.atomic():
            json_resp = {'msg':'ok'}
            members = []
            member = request_body_json['member']
            collection = request_body_json['collection']
            members.append(member)
            # if member in ['All Professor','All Student','All Tech','All Beginner','All Expert','All Admin']:
            #     # escludo già lo username della sessione perché se sono in questo metodo vuole dire che è entrato l'owenr
            #     members = User.objects.filter(profile = member.split('All')[1].strip()).exclude(username = request.session['username'])
            #     members = [m.username for m in members if m.username != request.session['username']]
            #     # members = list(set(members))

            # delete the annotation of that member for that collection first
            for member in members:
                name_space = NameSpace.objects.get(name_space = request.session['name_space'])
                users = User.objects.filter(username = member,name_space = name_space)
                collection = Collection.objects.get(collection_id=collection)
                for user in users:
                    documents = Document.objects.filter(collection_id=collection)
                    Annotate.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()
                    Associate.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()
                    AnnotateLabel.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()
                    CreateFact.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()

                    RelationshipObjMention.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()
                    RelationshipPredMention.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()
                    RelationshipSubjMention.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()

                    documents_ids_list = [x.document_id for x in documents]
                    RelationshipObjConcept.objects.filter(predicate_document_id__in=documents_ids_list,username = user, name_space = name_space).delete()
                    RelationshipPredConcept.objects.filter(object_document_id__in=documents_ids_list,username = user, name_space = name_space).delete()
                    RelationshipSubjConcept.objects.filter(object_document_id__in=documents_ids_list,username = user, name_space = name_space).delete()
                    Link.objects.filter(predicate_document_id__in=documents_ids_list,username = user, name_space = name_space).delete()

                    ShareCollection.objects.filter(collection_id=collection,username = user, name_space = name_space).delete()
                    GroundTruthLogFile.objects.filter(document_id__in=documents,username = user, name_space = name_space).delete()

                # Collection.objects.filter(collection_id=collection).delete()
    except Exception as e:
        print(e)
        json_resp = {'error':'an error occurred'}
        return JsonResponse(json_resp)
    else:
        return JsonResponse(json_resp)


def delete_annotation_all(request):

    """This view removed all the annotations for the document of the session"""


    user = request.session['username']
    name_space = request.session['name_space']
    language = request.session['language']
    document = request.session['document']
    name_space = NameSpace.objects.get(name_space=name_space)
    user = User.objects.get(username=user, name_space=name_space)
    user_iaa = User.objects.get(username="IAA-Inter Annotator Agreement", name_space=name_space)

    language = request.session['language']
    document = Document.objects.get(document_id = request.session['document'],language = language)
    json_resp = {'msg':'ok'}
    try:
        with transaction.atomic():
            Annotate.objects.filter(username = user, name_space = name_space,document_id = document).delete()
            Associate.objects.filter(username=user, name_space=name_space, document_id=document).delete()
            AnnotateLabel.objects.filter(username=user, name_space=name_space, document_id=document).delete()
            Link.objects.filter(username=user, name_space=name_space, subject_document_id=document.document_id).delete()
            CreateFact.objects.filter(username=user, name_space=name_space, document_id=document).delete()
            RelationshipObjMention.objects.filter(username=user, name_space=name_space, document_id=document).delete()
            RelationshipObjConcept.objects.filter(username=user, name_space=name_space, subject_document_id=document.document_id).delete()
            RelationshipSubjConcept.objects.filter(username=user, name_space=name_space, object_document_id=document.document_id).delete()
            RelationshipSubjMention.objects.filter(username=user, name_space=name_space, document_id=document).delete()
            RelationshipPredConcept.objects.filter(username=user, name_space=name_space, subject_document_id=document.document_id).delete()
            RelationshipPredMention.objects.filter(username=user, name_space=name_space, document_id=document).delete()
            GroundTruthLogFile.objects.filter(username=user, name_space=name_space, document_id=document).delete()
            json_resp['document'] = create_new_content(document, user)

            Annotate.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()
            Associate.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()
            AnnotateLabel.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()
            Link.objects.filter(username=user_iaa, name_space=name_space, subject_document_id=document.document_id).delete()
            CreateFact.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()
            RelationshipObjMention.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()
            RelationshipObjConcept.objects.filter(username=user_iaa, name_space=name_space,
                                                  subject_document_id=document.document_id).delete()
            RelationshipSubjConcept.objects.filter(username=user_iaa, name_space=name_space,
                                                   object_document_id=document.document_id).delete()
            RelationshipSubjMention.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()
            RelationshipPredConcept.objects.filter(username=user_iaa, name_space=name_space,
                                                   subject_document_id=document.document_id).delete()
            RelationshipPredMention.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()
            GroundTruthLogFile.objects.filter(username=user_iaa, name_space=name_space, document_id=document).delete()

    except Exception as e:
        json_resp = {'error':e}

    return JsonResponse(json_resp)


def delete_collection(request):

    """This method delete a member from ShareCollection: this means that that member won't see that collection anymore hence she won't be able to annotate its documents."""

    request_body_json = json.loads(request.body)
    try:
        with transaction.atomic():
            lista = []
            json_resp = {'msg':'ok'}
            collection = request_body_json['collection']
            # cursor = connection.cursor()
            documents = Document.objects.filter(collection_id = collection)
            Annotate.objects.filter(document_id__in=documents).delete()
            Associate.objects.filter(document_id__in=documents).delete()
            AnnotateLabel.objects.filter(document_id__in=documents).delete()
            CreateFact.objects.filter(document_id__in=documents).delete()

            RelationshipObjMention.objects.filter(document_id__in=documents).delete()
            RelationshipPredMention.objects.filter(document_id__in=documents).delete()
            RelationshipSubjMention.objects.filter(document_id__in=documents).delete()

            documents_ids_list = [x.document_id for x in documents]
            RelationshipObjConcept.objects.filter(predicate_document_id__in=documents_ids_list).delete()
            RelationshipPredConcept.objects.filter(object_document_id__in=documents_ids_list).delete()
            RelationshipSubjConcept.objects.filter(object_document_id__in=documents_ids_list).delete()
            Link.objects.filter(predicate_document_id__in=documents_ids_list).delete()

            ShareCollection.objects.filter(collection_id = collection).delete()
            Document.objects.filter(collection_id = collection).delete()
            GroundTruthLogFile.objects.filter(document_id__in=documents).delete()

            HasLabel.objects.filter(collection_id = collection).delete()
            AddConcept.objects.filter(collection_id = collection).delete()
            Collection.objects.filter(collection_id = collection).delete()
            Document.objects.filter(collection_id = collection).delete()


            # cursor.execute('DELETE FROM collection WHERE collection_id = %s',[collection])
            # delete the annotation of that member for that collection first
    except Exception as e:
        json_resp = {'error':'an error occurred'}
        return JsonResponse(json_resp)
    else:
        return JsonResponse(json_resp)



def generate_suggestion(request):

    """This view returns a suggestion"""

    user = request.session['username']
    name_space = request.session['name_space']
    language = request.session['language']
    document = request.session['document']
    name_space = NameSpace.objects.get(name_space=name_space)
    user = User.objects.get(username = user,name_space = name_space)

    document = Document.objects.get(document_id = document,language = language)

    start = request.GET.get('start',None)
    stop = request.GET.get('stop',None)
    position = request.GET.get('position',None)
    position = '_'.join(position.split('_')[:-1])
    start,stop = return_start_stop_for_backend(start, stop, position, document.document_content)

    mention = Mention.objects.get(document_id = document,language = language, start = start, stop = stop)
    associations = Associate.objects.filter(start = mention, stop = mention.stop, document_id = document).values('concept_url').order_by('concept_url').annotate(count=Count('concept_url'))


    json_resp = {}
    return JsonResponse(json_resp)

def upload(request):
    username = request.session['username']
    name_space = request.session['name_space']
    collection = request.session['collection']
    collection_obj = Collection.objects.get(collection_id = collection)
    json_resp = {'msg': 'ok'}
    try:
        if request.method == 'POST':
            with transaction.atomic():
                new_batch = request.POST.get('new_batch')
                max_batch = Document.objects.filter(collection_id=collection_obj).order_by('-batch').first()
                batch = max_batch.batch
                if new_batch != 'false':

                    batch = batch +1


                files = request.FILES.items()
                annotation = request.POST.get("type_annotation")
                for filename, file in files:
                    if filename.startswith('concept'):

                        if file.name.endswith('json'):
                            upload_json_concepts(file, name_space, username, collection_obj)
                        elif file.name.endswith('csv'):
                            upload_csv_concepts(file, name_space, username, collection_obj)
                    elif filename.startswith('annotation'):

                        # for file, filename in files:
                            if file.name.endswith('json'):
                                upload_json_files(file, name_space, annotation,username)
                            elif file.name.endswith('csv'):
                                upload_csv_files(file, name_space, annotation,username)

                    elif filename.startswith('document'):
                        print('document')
                        json_contents = create_json_content_from_file(file)
                        print(len(json_contents))
                        for json_content in json_contents:
                            pid = ''

                            language = 'english'
                            # if 'document_id' in list(json_content.keys()):
                            #     pid = json_content['document_id']
                            # else:
                            #     to_enc_id = collection + request.session['username']
                            #     pid = hashlib.md5(to_enc_id.encode()).hexdigest()

                            if 'language' in list(json_content.keys()) and not json_content['language'].lower() == 'english':
                                language = json_content['language']
                            to_enc_id = request.session['username'] + str(datetime.now())
                            pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                            if not Document.objects.filter(document_id=pid).exists():
                                print("adding",pid)
                                # collection = Collection.objects.get(collection_id=collection)
                                # for k,v in json_content.items():
                                #     json_content[k] = re.sub('\s+', ' ', v)

                                Document.objects.create(batch=batch, collection_id=collection_obj, provenance='user', document_id=pid,
                                                        language=language,
                                                        document_content=json_content, insertion_time=Now())
                pubmed_ids = request.POST.get('pubmed_ids', '')
                if pubmed_ids == '':
                    pubmed_ids = None
                collection = Collection.objects.get(collection_id=collection)
                if pubmed_ids is not None:

                    pubmed_ids = pubmed_ids.split()
                    for pid in pubmed_ids:
                        try:
                            json_val = insert_articles_of_PUBMED(pid)
                        except Exception as e:
                            json_resp = {'error':'Not found'}
                            json_val = None
                            return JsonResponse(json_resp, status=500)
                        if json_val:

                            to_enc_id = request.session['username'] + str(datetime.now())
                            pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                            if not Document.objects.filter(document_id=pid, language='english',
                                                           collection_id=collection).exists():
                                Document.objects.create(batch=batch,  document_id=pid,
                                                        provenance='pubmed', language='english', document_content=json_val,
                                                        insertion_time=Now(), collection_id=collection)

                openaire_ids = request.POST.get('openaire_ids', '')
                if openaire_ids == '':
                    openaire_ids = None
                if openaire_ids is not None:
                    openaire_ids = openaire_ids.split()
                    json_val = insert_articles_of_OpenAIRE(openaire_ids)
                    if json_val['documents'] == []:
                        json_resp = {'error':'Not found'}
                        raise Exception
                    if json_val:
                        for doc in json_val['documents']:
                            pid = doc['document_id']
                            to_enc_id = request.session['username'] + str(datetime.now())
                            pid = hashlib.md5(to_enc_id.encode()).hexdigest()

                            if not Document.objects.filter(document_id=pid, language='english',
                                                           collection_id=collection).exists():
                                Document.objects.create(batch=batch,  document_id=pid,
                                                        provenance='openaire', language='english', document_content=doc,
                                                        insertion_time=Now(), collection_id=collection)


                semantic_ids = request.POST.get('semantic_ids', '')
                if semantic_ids == '':
                    semantic_ids = None

                if semantic_ids is not None:
                    semantic_ids = semantic_ids.split()
                    json_val = insert_articles_of_semantic(semantic_ids)
                    if json_val['documents'] == []:
                        json_resp = {'error':'Not found'}
                        raise Exception
                    if json_val:
                        for doc in json_val['documents']:
                            pid = doc['document_id']
                            to_enc_id = request.session['username'] + str(datetime.now())
                            pid = hashlib.md5(to_enc_id.encode()).hexdigest()
                            if not Document.objects.filter(document_id=pid, language='english',
                                                           collection_id=collection).exists():
                                Document.objects.create(batch=batch,  document_id=pid,
                                                        provenance='semantic scholar', language='english', document_content=doc,
                                                        insertion_time=Now(), collection_id=collection)
        return JsonResponse(json_resp)
    except Exception as e:
        print(e)
        if(json_resp['error']):
            return JsonResponse(json_resp,status=500)
        return JsonResponse({'error':e},status = 500)



from RelAnno_App.utils_download_bioc import *
def download_annotations(request):

    """This view allows to download the annotations of one or more users related to a collection"""

    user = request.session['username']
    name_space = request.session['name_space']
    # document = request.session['document']
    collection = request.session['collection']
    format = request.GET.get('format',None)
    annotation = request.GET.get('annotation',None)
    annotators = request.GET.get('annotators',None)
    document = request.GET.get('document',None)

    batch = request.GET.get('batch',None)
    json_resp = {}
    json_resp['annotations'] = []
    if format == 'json':
        json_resp = create_json_to_download(annotation,annotators,batch,name_space,document,collection)
        return JsonResponse(json_resp)

    elif format == 'csv':
        resp = create_csv_to_download(annotation,annotators,batch,name_space,document,collection)
        return resp
    elif format == 'xml':
        resp = create_bioc_xml(annotation,annotators,batch,user,name_space,document,collection)
        return HttpResponse(resp, content_type='application/xml')


from RelAnno_App.utils_upload_documents import *
def upload_annotations(request):

    """This view allows to upload the annotations of one or more users related to a collection"""

    user = request.session['username']
    name_space = request.session['name_space']
    document = request.session['document']
    collection = request.session['collection']
    format = ''
    annotation = request.GET.get('annotation', None)
    files = request.FILES.items()
    json_resp = {'msg':'ok'}
    try:
        for file, filename in files:
            if filename.endswith('json'):
                upload_json_files(file,name_space,annotation,user)
            elif filename.endswith('csv'):
                upload_csv_files(file,name_space,annotation,user)
        return JsonResponse(json_resp)
    except Exception as e:
        json_resp = {'error': e}

        return JsonResponse(json_resp)


def copy_mention(request):

    """This view copies in the table annotate the annotation of a user in the logged in user annotation"""

    username = request.session['username']
    name_space = request.session['name_space']
    language = request.session['language']
    document = request.session['document']
    collection = request.session['collection']

    name_space = NameSpace.objects.get(name_space = name_space)
    user = User.objects.get(username = username, name_space= name_space)
    document = Document.objects.get(document_id = document,language = language)
    json_body = json.loads(request.body)
    mention = json_body['mention']
    json_resp = copy_mention_aux(user,name_space,document,language,mention)
    return JsonResponse(json_resp)


def copy_mention_concept(request):

    """This view copies in the table annotate the annotation of a user in the logged in user annotation"""

    username = request.session['username']
    name_space = request.session['name_space']
    language = request.session['language']
    document = request.session['document']
    collection = request.session['collection']
    json_body = json.loads(request.body)
    json_resp = copy_concepts_aux(username,name_space,document,language,json_body)
    return JsonResponse(json_resp)


def copy_assertion(request):

    """This view copies in the table createfact the assertion of a user in the logged in user annotation"""


    username = request.session['username']
    name_space = request.session['name_space']
    language = request.session['language']
    document = request.session['document']
    json_body = json.loads(request.body)
    assertion = json_body['assertion']
    json_resp = {}
    # json_resp = copy_assertion(username,name_space,document,language,assertion)
    return JsonResponse(json_resp)


def copy_label(request):

    """This view adds a copied label to the logged in user"""

    username = request.session['username']
    language = request.session['language']
    document = request.session['document']
    name_space = request.session['name_space']

    json_body = json.loads(request.body)
    label = json_body['label']
    json_resp = copy_labels(username,name_space,label,document,language)
    return JsonResponse(json_resp)


def copy_relation(request):

    """This view adds a copied relation to the logged in user"""

    username = request.session['username']
    language = request.session['language']
    document = request.session['document']
    name_space = request.session['name_space']

    json_body = json.loads(request.body)
    relation = json_body['relation']

    subject = relation['subject']
    predicate = relation['predicate']
    object = relation['object']

    json_resp = copy_relation(username, name_space,document, language, subject, predicate, object)
    return JsonResponse(json_resp)

def copy_annotation(request):

    """This view copies all the annotation of a user"""

    username = request.session['username']
    language = request.session['language']
    document = request.session['document']
    name_space = request.session['name_space']
    body_json = json.loads(request.body)
    username_source = body_json['user']
    name_space = NameSpace.objects.get(name_space = name_space)
    document = Document.objects.get(document_id = document,language = language)
    user = User.objects.get(username = username,name_space = name_space)
    user_source = User.objects.get(username = username_source,name_space = name_space)
    try:
        with transaction.atomic():
            if username_source is not None:
                # copy mentions
                for annotation in Annotate.objects.filter(document_id = document, username = user_source, name_space = name_space,language = language):
                    mention = Mention.objects.get(start = annotation.start_id, stop = annotation.stop, document_id = document, language = language)
                    annotation = Annotate.objects.filter(document_id = document, username = user, name_space = name_space,language = language,start = mention,
                                                         stop = mention.stop)
                    if not annotation.exists():
                        Annotate.objects.create(document_id=document, username=user, name_space=name_space, language=language,
                                                start=mention,insertion_time=Now(),
                                                stop=mention.stop)

                for annotation in Associate.objects.filter(document_id=document, username=user_source, name_space=name_space,
                                                           language=language):
                    mention = Mention.objects.get(start=annotation.start_id, stop=annotation.stop, document_id=document,
                                                  language=language)
                    concept = Concept.objects.get(concept_url=annotation.concept_url_id)
                    name = SemanticArea.objects.get(name=annotation.name_id)
                    annotation = Associate.objects.filter(document_id=document, username=user, name_space=name_space,
                                                          language=language, start=mention,
                                                          stop=mention.stop, concept_url=concept, name=name)
                    if not annotation.exists():
                        Associate.objects.create(document_id=document, username=user, name_space=name_space, language=language,
                                                start=mention, insertion_time=Now(),
                                                stop=mention.stop, concept_url=concept, name=name)

                for annotation in AnnotateLabel.objects.filter(document_id=document, username=user_source, name_space=name_space,
                                                           language=language):
                    label = Label.objects.get(name = annotation.name_id)
                    annotation = AnnotateLabel.objects.filter(document_id=document, username=user, name_space=name_space,
                                                          language=language, name= label)
                    if not annotation.exists():
                        AnnotateLabel.objects.create(document_id=document, username=user, name_space=name_space, language=language,
                                                insertion_time=Now(),name = label)

                for annotation in CreateFact.objects.filter(document_id=document, username=user_source, name_space=name_space,
                                                            language=language):

                    facts = CreateFact.objects.filter(document_id=document, username=user, name_space=name_space,
                                                           language=language,
                                                           subject_concept_url=annotation.subject_concept_url,
                                                           subject_name=annotation.subject_name,
                                                           object_concept_url=annotation.object_concept_url,
                                                           object_name=annotation.object_name,
                                                           predicate_concept_url=annotation.predicate_concept_url,
                                                           predicate_name=annotation.predicate_name)
                    if not facts.exists():
                        CreateFact.objects.create(document_id=document, username=user, name_space=name_space,
                                                  insertion_time=Now(),
                                                  language=language,
                                                  subject_concept_url=annotation.subject_concept_url,
                                                  subject_name=annotation.subject_name,
                                                  object_concept_url=annotation.object_concept_url,
                                                  object_name=annotation.object_name,
                                                  predicate_concept_url=annotation.predicate_concept_url,
                                                  predicate_name=annotation.predicate_name)

                for annotation in RelationshipObjMention.objects.filter(document_id=document, username=user_source,
                                                                        name_space=name_space,
                                                                        language=language):
                    mention = Mention.objects.get(document_id=document, language=language, start=annotation.start_id,
                                                  stop=annotation.stop)
                    rels = RelationshipObjMention.objects.filter(document_id=document, username=user,
                                                                       name_space=name_space,
                                                                       language=language, start=mention,
                                                                       stop=mention.stop,
                                                                       subject_concept_url=annotation.subject_concept_url,
                                                                       subject_name=annotation.subject_name,
                                                                       predicate_concept_url=annotation.predicate_concept_url,
                                                                       predicate_name=annotation.predicate_name)
                    if not rels.exists():
                        RelationshipObjMention.objects.create(document_id=document, username=user, name_space=name_space,
                                                              language=language, start=mention, stop=mention.stop,
                                                              subject_concept_url=annotation.subject_concept_url,
                                                              insertion_time=Now(),
                                                              subject_name=annotation.subject_name,
                                                              predicate_concept_url=annotation.predicate_concept_url,
                                                              predicate_name=annotation.predicate_name)

                for annotation in RelationshipSubjMention.objects.filter(document_id=document, username=user_source,
                                                                         name_space=name_space,
                                                                         language=language):
                    mention = Mention.objects.get(document_id=document, language=language, start=annotation.start_id,
                                                  stop=annotation.stop)
                    rels = RelationshipSubjMention.objects.filter(document_id=document, username=user,
                                                                        name_space=name_space,
                                                                        language=language, start=mention,
                                                                        stop=mention.stop,
                                                                        object_concept_url=annotation.object_concept_url,
                                                                        object_name=annotation.object_name,
                                                                        predicate_concept_url=annotation.predicate_concept_url,
                                                                        predicate_name=annotation.predicate_name)
                    if not rels.exists():
                        RelationshipSubjMention.objects.filter(document_id=document, username=user,
                                                               name_space=name_space,
                                                               language=language, start=mention,
                                                               stop=mention.stop, insertion_time=Now(),
                                                               object_concept_url=annotation.object_concept_url,
                                                               object_name=annotation.object_name,
                                                               predicate_concept_url=annotation.predicate_concept_url,
                                                               predicate_name=annotation.predicate_name)


                for annotation in RelationshipPredMention.objects.filter(document_id=document, username=user_source,
                                                                        name_space=name_space,
                                                                        language=language):
                    mention = Mention.objects.get(document_id=document, language=language, start=annotation.start_id,
                                                  stop=annotation.stop)
                    rels = RelationshipPredMention.objects.filter(document_id=document, username=user,
                                                                       name_space=name_space,
                                                                       language=language, start=mention,
                                                                       stop=mention.stop,
                                                                       object_concept_url=annotation.object_concept_url,
                                                                       object_name=annotation.object_name,
                                                                       subject_concept_url=annotation.subject_concept_url,
                                                                       subject_name=annotation.subject_name)
                    if not rels.exists():
                        RelationshipPredMention.objects.create(document_id=document, username=user,
                                                               name_space=name_space,insertion_time = Now(),
                                                               language=language, start=mention,
                                                               stop=mention.stop,
                                                               object_concept_url=annotation.object_concept_url,
                                                               object_name=annotation.object_name,
                                                               subject_concept_url=annotation.subject_concept_url,
                                                               subject_name=annotation.subject_name)

                for annotation in RelationshipPredConcept.objects.filter(subject_document_id=document.document_id, username=user_source,
                                                                        name_space=name_space,
                                                                        subject_language=language):
                    concept = annotation.concept_url
                    area = annotation.name

                    rels = RelationshipPredConcept.objects.filter(subject_document_id = annotation.subject_document_id, subject_language = annotation.subject_language,
                                                                        object_document_id = annotation.object_document_id,object_language = annotation.object_language,
                                                                        username = user,name_space = name_space, concept_url = concept, name=area,subject_start = annotation.subject_start,
                                                                        subject_stop = annotation.subject_stop, object_start = annotation.object_start, object_stop = annotation.object_stop)
                    if not rels.exists():
                        RelationshipPredConcept.objects.create(subject_document_id = annotation.subject_document_id, subject_language = annotation.subject_language,insertion_time = Now(),
                                                                        object_document_id = annotation.object_document_id,object_language = annotation.object_language,
                                                                        username = user,name_space = name_space, concept_url = concept, name=area,subject_start = annotation.subject_start,
                                                                        subject_stop = annotation.subject_stop, object_start = annotation.object_start, object_stop = annotation.object_stop)

                for annotation in RelationshipSubjConcept.objects.filter(object_document_id=document.document_id,
                                                                         username=user_source,
                                                                         name_space=name_space,
                                                                         object_language=language):
                    concept = annotation.concept_url
                    area = annotation.name

                    rels = RelationshipSubjConcept.objects.filter(object_document_id=annotation.object_document_id,
                                                                        object_language=annotation.object_language,
                                                                        predicate_document_id=annotation.predicate_document_id,
                                                                        predicate_language=annotation.predicate_language,
                                                                        username=user, name_space=name_space,
                                                                        concept_url=concept, name=area,
                                                                        predicate_start=annotation.predicate_start,
                                                                        predicate_stop=annotation.predicate_stop,
                                                                        object_start=annotation.object_start,
                                                                        object_stop=annotation.object_stop)
                    if not rels.exists():
                        RelationshipSubjConcept.objects.create(object_document_id=annotation.object_document_id,
                                                               object_language=annotation.object_language,
                                                               insertion_time=Now(),
                                                               predicate_document_id=annotation.predicate_document_id,
                                                               predicate_language=annotation.predicate_language,
                                                               username=user, name_space=name_space, concept_url=concept,
                                                               name=area, predicate_start=annotation.predicate_start,
                                                               predicate_stop=annotation.predicate_stop,
                                                               object_start=annotation.object_start,
                                                               object_stop=annotation.object_stop)

                for annotation in RelationshipObjConcept.objects.filter(subject_document_id=document.document_id,
                                                                         username=user_source,
                                                                         name_space=name_space,
                                                                         subject_language=language):
                    concept = annotation.concept_url
                    area = annotation.name

                    rels = RelationshipObjConcept.objects.filter(subject_document_id=annotation.subject_document_id,
                                                                        subject_language=annotation.subject_language,
                                                                        predicate_document_id=annotation.predicate_document_id,
                                                                        predicate_language=annotation.predicate_language,
                                                                        username=user, name_space=name_space,
                                                                        concept_url=concept, name=area,
                                                                        predicate_start=annotation.predicate_start,
                                                                        predicate_stop=annotation.predicate_stop,
                                                                        subject_start=annotation.subject_start,
                                                                        subject_stop=annotation.subject_stop)
                    if not rels.exists():
                        RelationshipObjConcept.objects.create(subject_document_id=annotation.subject_document_id,
                                                              subject_language=annotation.subject_language,insertion_time = Now(),
                                                              predicate_document_id=annotation.predicate_document_id,
                                                              predicate_language=annotation.predicate_language,
                                                              username=user, name_space=name_space,
                                                              concept_url=concept, name=area,
                                                              predicate_start=annotation.predicate_start,
                                                              predicate_stop=annotation.predicate_stop,
                                                              subject_start=annotation.subject_start,
                                                              subject_stop=annotation.subject_stop)

                for annotation in Link.objects.filter(subject_document_id=document.document_id,
                                                                         username=user_source,
                                                                         name_space=name_space,
                                                                         subject_language=language):


                    rels = Link.objects.filter(subject_document_id=annotation.subject_document_id,
                                                subject_language=annotation.subject_language,
                                                predicate_document_id=annotation.predicate_document_id,
                                                predicate_language=annotation.predicate_language,
                                               object_document_id=annotation.object_document_id,
                                               object_language=annotation.object_language,
                                                                        username=user, name_space=name_space,
                                               subject_start=annotation.subject_start,
                                               subject_stop=annotation.subject_stop,predicate_start=annotation.predicate_start,
                                                                        predicate_stop=annotation.predicate_stop,
                                                                        object_start=annotation.object_start,
                                                                        object_stop=annotation.object_stop)
                    if not rels.exists():
                        Link.objects.filter(subject_document_id=annotation.subject_document_id,
                                            subject_language=annotation.subject_language,
                                            predicate_document_id=annotation.predicate_document_id,
                                            predicate_language=annotation.predicate_language,
                                            object_document_id=annotation.object_document_id,
                                            object_language=annotation.object_language,
                                            username=user, name_space=name_space,
                                            subject_start=annotation.subject_start,insertion_time = Now(),
                                            subject_stop=annotation.subject_stop,
                                            predicate_start=annotation.predicate_start,
                                            predicate_stop=annotation.predicate_stop,
                                            object_start=annotation.object_start,
                                            object_stop=annotation.object_stop)


        update_gt(user, name_space, document, language)
        return JsonResponse({'msg':'ok'})
    except Exception as e:
        json_resp = {'error': e}

        print(e)
        return JsonResponse(json_resp)




def get_suggestion(request):

    """This view given a mention provides suggestions"""

    username = request.session['username']
    name_space = request.session['name_space']
    document = request.session['document']
    language = request.session['language']
    if request.method == 'POST':
        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username=username, name_space=name_space)
        document = Document.objects.get(document_id=document, language=language)
        json_body = json.loads(request.body)
        association = json_body.get('association',None)
        relation = json_body.get('relation',None)
        try:
            with transaction.atomic():
                if association is not None:
                    start = association['start']
                    stop = association['stop']
                    position = association['position']
                    start,stop = return_start_stop_for_backend(start,stop,position,document.document_content)
                    concept = association['concept_url']
                    name = association['concept_area']
                    mention = Mention.objects.get(document_id = document, language = language, start = start, stop = stop)
                    concept = Concept.objects.get(concept_url = concept)
                    area = SemanticArea.objects.get(name=name)

                    if not Associate.objects.filter(username = user, name_space = name_space, document_id = document, language = language,
                                                    start = mention, stop = mention.stop, concept_url = concept, name= area).exists():
                        Associate.objects.create(username=user, name_space=name_space, document_id=document, language=language,insertion_time=Now(),
                                                 start=mention, stop=mention.stop, concept_url=concept, name=area)
                    update_gt(user, name_space, document, language)
                    json_to_ret = {}
                    json_to_ret['concepts'] = generate_associations_list_splitted(username, name_space.name_space,
                                                                                  document.document_id, language)
                    rels = generate_relationships_list(user.username,name_space.name_space,document.document_id,document.language)
                    json_to_ret['relationships'] = transform_relationships_list(rels,document.document_id,username,name_space.name_space)

                    return JsonResponse(json_to_ret)
                elif relation is not None:
                    subject = relation['subject']
                    predicate = relation['predicate']
                    object = relation['object']
                    if subject['mention'] != {} and predicate['mention'] != {} and object['mention'] != {}:
                        mention_s = subject['mention']
                        mention_p = predicate['mention']
                        mention_o = object['mention']
                        mention_s_start,mention_s_stop = return_start_stop_for_backend(mention_s['start'],mention_s['stop'],mention_s['position'],document.document_content)
                        mention_p_start,mention_p_stop = return_start_stop_for_backend(mention_p['start'],mention_p['stop'],mention_p['position'],document.document_content)
                        mention_o_start,mention_o_stop = return_start_stop_for_backend(mention_o['start'],mention_o['stop'],mention_o['position'],document.document_content)

                        mention_s_obj = Mention.objects.get(document_id = document, language = language, start= mention_s_start, stop = mention_s_stop)
                        if not Annotate.objects.filter(start = mention_s_obj,stop = mention_s_stop,document_id = document, language = language, username = user, name_space = name_space).exists():
                            Annotate.objects.create(start=mention_s_obj, stop=mention_s_stop, document_id=document,insertion_time = Now(),
                                                    language=language, username=user, name_space=name_space)

                        mention_p_obj = Mention.objects.get(document_id = document, language = language, start= mention_p_start, stop = mention_p_stop)
                        if not Annotate.objects.filter(start = mention_p_obj,stop = mention_p_stop,document_id = document, language = language, username = user, name_space = name_space).exists():
                            Annotate.objects.create(start=mention_p_obj, stop=mention_p_stop, document_id=document,insertion_time = Now(),
                                                    language=language, username=user, name_space=name_space)

                        mention_o_obj = Mention.objects.get(document_id = document, language = language, start= mention_o_start, stop = mention_o_stop)
                        if not Annotate.objects.filter(start = mention_s_obj,stop = mention_o_stop,document_id = document, language = language, username = user, name_space = name_space).exists():
                            Annotate.objects.create(start=mention_o_obj, stop=mention_o_stop, document_id=document,insertion_time = Now(),
                                                    language=language, username=user, name_space=name_space)



                        if not Link.objects.filter(username = user, name_space = name_space, subject_document_id = document.document_id,
                                               subject_language = document.language, subject_start =mention_s_start,subject_stop = mention_s_stop,
                                               predicate_start = mention_p_start,predicate_stop = mention_p_stop,object_start = mention_o_start,
                                               object_stop = mention_o_stop).exists():
                            Link.objects.create(username=user, name_space=name_space, subject_document_id=document.document_id,object_document_id=document.document_id,predicate_document_id=document.document_id,
                                                subject_language=document.language,object_language=document.language, predicate_language=document.language,subject_start=mention_s_start, subject_stop=mention_s_stop,
                                                predicate_start=mention_p_start, predicate_stop=mention_p_stop,
                                                object_start=mention_o_start,insertion_time = Now(),
                                                object_stop=mention_o_stop)

                    if subject['mention'] != {} and predicate['mention'] != {} and object['concept'] != {}:
                        mention_s = subject['mention']
                        mention_p = predicate['mention']

                        mention_s_start, mention_s_stop = return_start_stop_for_backend(mention_s['start'],
                                                                                        mention_s['stop'],
                                                                                        mention_s['position'],
                                                                                        document.document_content)
                        mention_p_start, mention_p_stop = return_start_stop_for_backend(mention_p['start'],
                                                                                        mention_p['stop'],
                                                                                        mention_p['position'],
                                                                                        document.document_content)

                        mention_s_obj = Mention.objects.get(document_id=document, language=language,
                                                            start=mention_s_start, stop=mention_s_stop)
                        if not Annotate.objects.filter(start=mention_s_obj, stop=mention_s_stop, document_id=document,
                                                       language=language, username=user,
                                                       name_space=name_space).exists():
                            Annotate.objects.create(start=mention_s_obj, stop=mention_s_stop, document_id=document,
                                                    insertion_time=Now(),
                                                    language=language, username=user, name_space=name_space)

                        mention_p_obj = Mention.objects.get(document_id=document, language=language,
                                                            start=mention_p_start, stop=mention_p_stop)
                        if not Annotate.objects.filter(start=mention_p_obj, stop=mention_p_stop, document_id=document,
                                                       language=language, username=user,
                                                       name_space=name_space).exists():
                            Annotate.objects.create(start=mention_p_obj, stop=mention_p_stop, document_id=document,
                                                    insertion_time=Now(),
                                                    language=language, username=user, name_space=name_space)


                        concept = Concept.objects.get(concept_url = object['concept']['concept_url'])
                        area = SemanticArea.objects.get(name=object['concept']['concept_area'])
                        if not RelationshipObjConcept.objects.filte(username = user, name_space = name_space, subject_document_id = document.document_id,
                                               subject_language = document.language, subject_start = mention_s_start,subject_stop = mention_s_stop,
                                               predicate_start = mention_p_start,predicate_stop = mention_p_stop,concept_url = concept, name=area).exists():
                            RelationshipObjConcept.objects.create(username=user, name_space=name_space, subject_document_id=document.document_id,
                                                predicate_document_id=document.document_id,
                                                subject_language=document.language, insertion_time =Now(),
                                                predicate_language=document.language, subject_start=mention_s_start,
                                                subject_stop=mention_s_stop,
                                                predicate_start=mention_p_start, predicate_stop=mention_p_stop,
                                                concept_url = concept, name=area)

                    if subject['mention'] == {} and predicate['concept'] != {} and object['mention'] != {}:
                        mention_s = subject['mention']
                        mention_o = object['mention']
                        mention_s_start, mention_s_stop = return_start_stop_for_backend(mention_s['start'],
                                                                                        mention_s['stop'],
                                                                                        mention_s['position'],
                                                                                        document.document_content)

                        mention_o_start, mention_o_stop = return_start_stop_for_backend(mention_o['start'],
                                                                                        mention_o['stop'],
                                                                                        mention_o['position'],
                                                                                        document.document_content)

                        mention_s_obj = Mention.objects.get(document_id=document, language=language,
                                                            start=mention_s_start, stop=mention_s_stop)
                        if not Annotate.objects.filter(start=mention_s_obj, stop=mention_s_stop, document_id=document,
                                                       language=language, username=user,
                                                       name_space=name_space).exists():
                            Annotate.objects.create(start=mention_s_obj, stop=mention_s_stop, document_id=document,
                                                    insertion_time=Now(),
                                                    language=language, username=user, name_space=name_space)



                        mention_o_obj = Mention.objects.get(document_id=document, language=language,
                                                            start=mention_o_start, stop=mention_o_stop)
                        if not Annotate.objects.filter(start=mention_s_obj, stop=mention_o_stop, document_id=document,
                                                       language=language, username=user,
                                                       name_space=name_space).exists():
                            Annotate.objects.create(start=mention_o_obj, stop=mention_o_stop, document_id=document,
                                                    insertion_time=Now(),
                                                    language=language, username=user, name_space=name_space)
                        concept = Concept.objects.get(concept_url=predicate['concept']['concept_url'])
                        area = SemanticArea.objects.get(name=predicate['concept']['concept_area'])
                        if not RelationshipPredConcept.objects.filte(username=user, name_space=name_space,
                                                                    subject_document_id=document.document_id,
                                                                    subject_language=document.language,
                                                                    subject_start=mention_s_start,
                                                                    subject_stop=mention_s_stop,
                                                                    object_start=mention_o_start,
                                                                    object_stop=mention_o_stop,
                                                                     concept_url=concept,
                                                                    name=area).exists():
                            RelationshipPredConcept.objects.create(username=user, name_space=name_space,
                                                                  subject_document_id=document.document_id,
                                                                  object_document_id=document.document_id,
                                                                  subject_language=document.language, insertion_time=Now(),
                                                                  object_language=document.language,
                                                                   subject_start=mention_s_start,
                                                                   subject_stop=mention_s_stop,
                                                                   object_start=mention_o_start,
                                                                   object_stop=mention_o_stop,
                                                                   concept_url=concept, name=area)
                    if subject['concept'] != {} and predicate['mention'] != {} and object['mention'] != {}:
                        mention_p = predicate['mention']
                        mention_o = object['mention']


                        mention_p_start, mention_p_stop = return_start_stop_for_backend(mention_p['start'],
                                                                                        mention_p['stop'],
                                                                                        mention_p['position'],
                                                                                        document.document_content)
                        mention_o_start, mention_o_stop = return_start_stop_for_backend(mention_o['start'],
                                                                                        mention_o['stop'],
                                                                                        mention_o['position'],
                                                                                        document.document_content)



                        mention_p_obj = Mention.objects.get(document_id=document, language=language,
                                                            start=mention_p_start, stop=mention_p_stop)
                        if not Annotate.objects.filter(start=mention_p_obj, stop=mention_p_stop, document_id=document,
                                                       language=language, username=user,
                                                       name_space=name_space).exists():
                            Annotate.objects.create(start=mention_p_obj, stop=mention_p_stop, document_id=document,
                                                    insertion_time=Now(),
                                                    language=language, username=user, name_space=name_space)

                        mention_o_obj = Mention.objects.get(document_id=document, language=language,
                                                            start=mention_o_start, stop=mention_o_stop)
                        if not Annotate.objects.filter(start=mention_s_obj, stop=mention_o_stop, document_id=document,
                                                       language=language, username=user,
                                                       name_space=name_space).exists():
                            Annotate.objects.create(start=mention_o_obj, stop=mention_o_stop, document_id=document,
                                                    insertion_time=Now(),
                                                    language=language, username=user, name_space=name_space)

                        concept = Concept.objects.get(concept_url=subject['concept']['concept_url'])
                        area = SemanticArea.objects.get(name=subject['concept']['concept_area'])

                        if not RelationshipSubjConcept.objects.filte(username=user, name_space=name_space,
                                                                     predicate_document_id=document.document_id,
                                                                     predicate_language=document.language,
                                                                     predicate_start=mention_p_start,
                                                                     predicate_stop=mention_p_stop,
                                                                     object_start=mention_o_start,
                                                                     object_stop=mention_o_stop,
                                                                     concept_url=concept,
                                                                     name=area).exists():
                            RelationshipSubjConcept.objects.create(username=user, name_space=name_space,
                                                                   predicate_document_id=document.document_id,
                                                                   object_document_id=document.document_id,
                                                                   predicate_language=document.language, insertion_time=Now(),
                                                                   object_language=document.language,
                                                                   predicate_start=mention_p_start,
                                                                   predicate_stop=mention_p_stop,
                                                                   object_start=mention_o_start,
                                                                   object_stop=mention_o_stop,
                                                                   concept_url=concept,
                                                                     name=area)
                    if subject['concept'] != {} and predicate['concept'] != {} and object['mention'] != {}:
                        start,stop = object['mention']['start'],object['mention']['stop']
                        position = object['mention']['position']
                        start, stop = return_start_stop_for_backend(start,stop,position,document.document_content)
                        mention = Mention.objects.get(start=start, stop = stop, document_id = document, language = language)
                        if not Annotate.objects.filter(username = user,name_space = name_space,start = mention, stop = mention.stop).exists():
                                Annotate.objects.create(username=user, name_space=name_space, start=mention,insertion_time = Now(),
                                                    stop=mention.stop)
                        concept_su = subject['concept']
                        concept_pr = predicate['concept']

                        if not RelationshipObjMention.objects.filter(username=user, name_space=name_space,
                                                                     document_id = document, language = language, start = mention, stop = mention.stop,
                                                                     subject_concept_url = concept_su['concept_url'],subject_name = concept_su['concept_area'],
                                                                     predicate_concept_url = concept_pr['concept_url'],predicate_name = concept_pr['concept_area']
                                                                     ).exists():
                            RelationshipObjMention.objects.create(username=user, name_space=name_space,insertion_time = Now(),
                                                                     document_id = document, language = language, start = mention, stop = mention.stop,
                                                                     subject_concept_url = concept_su['concept_url'],subject_name = concept_su['concept_area'],
                                                                     predicate_concept_url = concept_pr['concept_url'],predicate_name = concept_pr['concept_area']
                                                                     )
                    if subject['mention'] != {} and predicate['concept'] != {} and object['concept'] != {}:
                        start, stop = subject['mention']['start'], subject['mention']['stop']
                        position = subject['mention']['position']
                        start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)
                        mention = Mention.objects.get(start=start, stop=stop, document_id=document, language=language)
                        if not Annotate.objects.filter(username = user,name_space = name_space,start = mention, stop = mention.stop).exists():
                                Annotate.objects.create(username=user, name_space=name_space, start=mention,insertion_time = Now(),
                                                    stop=mention.stop)
                        concept_obj = object['concept']
                        concept_pr = predicate['concept']

                        if not RelationshipSubjMention.objects.filter(username=user, name_space=name_space,
                                                                     document_id=document, language=language, start=mention,
                                                                     stop=mention.stop,
                                                                     object_concept_url=concept_obj['concept_url'],
                                                                     object_name=concept_obj['concept_area'],
                                                                     predicate_concept_url=concept_pr['concept_url'],
                                                                     predicate_name=concept_pr['concept_area']
                                                                     ).exists():
                            RelationshipSubjMention.objects.create(username=user, name_space=name_space, insertion_time=Now(),
                                                                  document_id=document, language=language, start=mention,
                                                                  stop=mention.stop,
                                                                  object_concept_url=concept_obj['concept_url'],
                                                                  object_name=concept_obj['concept_area'],
                                                                  predicate_concept_url=concept_pr['concept_url'],
                                                                  predicate_name=concept_pr['concept_area']
                                                                  )
                    if subject['concept'] != {} and predicate['mention'] != {} and object['concept'] != {}:
                        start, stop = predicate['mention']['start'], predicate['mention']['stop']
                        position = predicate['mention']['position']
                        start, stop = return_start_stop_for_backend(start, stop, position, document.document_content)
                        mention = Mention.objects.get(start=start, stop=stop, document_id=document, language=language)
                        if not Annotate.objects.filter(username = user,name_space = name_space,start = mention, stop = mention.stop).exists():
                                Annotate.objects.create(username=user, name_space=name_space, start=mention,insertion_time = Now(),
                                                    stop=mention.stop)
                        concept_obj = object['concept']
                        concept_s = subject['concept']

                        if not RelationshipPredMention.objects.filter(username=user, name_space=name_space,
                                                                      document_id=document, language=language, start=mention,
                                                                      stop=mention.stop,
                                                                      object_concept_url=concept_obj['concept_url'],
                                                                      object_name=concept_obj['concept_area'],
                                                                      subject_concept_url=concept_s['concept_url'],
                                                                      subject_name=concept_s['concept_area']
                                                                      ).exists():
                            RelationshipPredMention.objects.create(username=user, name_space=name_space, insertion_time=Now(),
                                                                   document_id=document, language=language, start=mention,
                                                                   stop=mention.stop,
                                                                   object_concept_url=concept_obj['concept_url'],
                                                                   object_name=concept_obj['concept_area'],
                                                                   subject_concept_url=concept_s['concept_url'],
                                                                   subject_name=concept_s['concept_area']
                                                                   )

                    update_gt(user, name_space, document, language)
                    json_to_ret = {}
                    json_to_ret['concepts'] = generate_associations_list_splitted(username, name_space.name_space,
                                                                                document.document_id, language)
                    rels = generate_relationships_list(user.username,name_space.name_space,document.document_id,document.language)
                    json_to_ret['relationships'] = transform_relationships_list(rels,document.document_id,username,name_space)

                    return JsonResponse(json_to_ret)
        except Exception as e:
            print(e)
            return JsonResponse({'error':e})


    elif request.method == 'GET':
        name_space = NameSpace.objects.get(name_space=name_space)
        user = User.objects.get(username = username, name_space = name_space)
        document = Document.objects.get(document_id = document, language = language)
        mention = request.GET.get('mention')
        mention1 = json.loads(mention)
        position =  '_'.join(mention1['id'].split('_')[:-1])
        start, stop = return_start_stop_for_backend(mention1['start'],mention1['stop'],position,document.document_content)
        mention = Mention.objects.get(start = start, stop = stop, document_id = document, language = language)

        suggested_annotations = {}
        suggested_annotations['associations'] = []
        associations_user = Associate.objects.filter(name_space = name_space, start = mention, stop = mention.stop,username = user)
        # if associations.count() == 0:
        associations = Associate.objects.filter(name_space = name_space, start = mention, stop = mention.stop).distinct('start','stop','concept_url','name')


        for association in associations:
            concept = association.concept_url
            area = association.name
            count = Associate.objects.filter(name_space = name_space, start = mention, stop = mention.stop,concept_url = concept, name = area).exclude(username = user).count()
            json_obj = {}
            json_obj['concept_url'] = concept.concept_url
            json_obj['concept_name'] = concept.concept_name
            json_obj['concept_area'] = area.name
            json_obj['start'] = mention1['start']
            json_obj['stop'] = mention1['stop']
            json_obj['position'] = position
            json_obj['concept_area'] = area.name
            json_obj['count'] = count
            if not Associate.objects.filter(name_space = name_space, start = mention, stop = mention.stop,username = user,name=area,concept_url = concept).exists():
                suggested_annotations['associations'].append(json_obj)

        suggested_annotations['relations'] = []
        # MAGARI IN FUTURO
        # links_s = Link.objects.filter(name_space = name_space,subject_document_id = document.document_id,subject_language = document.language).exclude(username = user)
        # for link in links_s:
        #     if(link.subject_start == start and link.subject_stop == stop) or (link.object_start == start and link.object_stop == stop) or (link.predicate_start == start and link.predicate_stop == stop):
        #         mention_s = Mention.objects.get(document_id = document, language = language, start = link.subject_start,stop = link.subject_stop)
        #         mention_p = Mention.objects.get(document_id = document, language = language, start = link.predicate_start,stop = link.predicate_stop)
        #         mention_o = Mention.objects.get(document_id = document, language = language, start = link.object_start,stop = link.object_stop)
        #         json_obj = {}
        #         json_obj['count'] = Link.objects.filter(name_space = name_space,subject_document_id = document.document_id,subject_language = document.language, subject_start = mention.start, subject_stop = mention.stop,
        #                                                 predicate_start = link.predicate_start,predicate_stop = link.predicate_stop,
        #                                                 object_start = link.object_start, object_stop = link.object_stop).exclude(username = user).count()
        #
        #         json_obj['subject'] = {}
        #         json_obj['subject']['mention'] = {}
        #         json_obj['subject']['concept'] = {}
        #         json_obj['predicate'] = {}
        #         json_obj['predicate']['mention'] = {}
        #         json_obj['predicate']['concept'] = {}
        #         json_obj['object'] = {}
        #         json_obj['object']['mention'] = {}
        #         json_obj['object']['concept'] = {}
        #         json_mention_source = return_start_stop_for_frontend(mention_s.start, mention_s.stop,
        #                                                              document.document_content)
        #         json_obj['subject']['mention']['start'] = json_mention_source['start']
        #         json_obj['subject']['mention']['stop'] = json_mention_source['stop']
        #         json_obj['subject']['mention']['position'] = json_mention_source['position']
        #         json_obj['subject']['mention']['mention_text'] = mention_s.mention_text
        #
        #         json_mention_p = return_start_stop_for_frontend(mention_p.start, mention_p.stop,
        #                                                              document.document_content)
        #         json_obj['predicate']['mention']['start'] = json_mention_p['start']
        #         json_obj['predicate']['mention']['stop'] = json_mention_p['stop']
        #         json_obj['predicate']['mention']['position'] = json_mention_p['position']
        #
        #         json_obj['predicate']['mention']['mention_text'] = mention_p.mention_text
        #
        #         json_mention_tar = return_start_stop_for_frontend(mention_o.start, mention_o.stop,
        #                                                              document.document_content)
        #         json_obj['object']['mention']['start'] = json_mention_tar['start']
        #         json_obj['object']['mention']['stop'] = json_mention_tar['stop']
        #         json_obj['object']['mention']['position'] = json_mention_tar['position']
        #         json_obj['object']['mention']['mention_text'] = mention_o.mention_text
        #         if not Link.objects.filter(name_space = name_space,subject_document_id = document.document_id,subject_language = document.language, subject_start = mention.start, subject_stop = mention.stop,
        #                                                 predicate_start = link.predicate_start,predicate_stop = link.predicate_stop,
        #                                                 object_start = link.object_start, object_stop = link.object_stop,username = user).exists():
        #             suggested_annotations['relations'].append(json_obj)
        #
        #
        # rel_sub_men = RelationshipSubjMention.objects.filter(document_id = document, name_space = name_space, start = mention, stop = mention.stop)
        # for link in rel_sub_men:
        #     mention_s = Mention.objects.get(document_id=document, language=language, start=link.start_id,
        #                                     stop=link.stop)
        #     concept = Concept.objects.get(concept_url = link.predicate_concept_url)
        #     name = SemanticArea.objects.get(name = link.predicate_name)
        #     concept_o = Concept.objects.get(concept_url = link.object_concept_url)
        #     name_o = SemanticArea.objects.get(name = link.object_name)
        #     json_obj = {}
        #     json_obj['count'] = RelationshipSubjMention.objects.filter(name_space=name_space,
        #                                                              document_id=document, language=language, start=mention_s,
        #                                                              stop=mention_s.stop,
        #                                                              object_concept_url=concept_o.concept_url,
        #                                                              object_name=name_o.name,
        #                                                              predicate_concept_url=concept.concept_url,
        #                                                              predicate_name=name.name
        #                                                              ).exclude(username = user).count()
        #     json_obj['subject'] = {}
        #     json_obj['subject']['mention'] = {}
        #     json_obj['subject']['concept'] = {}
        #     json_obj['predicate'] = {}
        #     json_obj['predicate']['mention'] = {}
        #     json_obj['predicate']['concept'] = {}
        #     json_obj['object'] = {}
        #     json_obj['object']['mention'] = {}
        #     json_obj['object']['concept'] = {}
        #
        #     json_mention_source = return_start_stop_for_frontend(mention_s.start, mention_s.stop,
        #                                                          document.document_content)
        #     json_obj['subject']['mention']['start'] = json_mention_source['start']
        #     json_obj['subject']['mention']['stop'] = json_mention_source['stop']
        #     json_obj['subject']['mention']['position'] = json_mention_source['position']
        #     json_obj['subject']['mention']['mention_text'] = mention_s.mention_text
        #
        #     json_obj['predicate']['concept']['concept_url'] = concept.concept_url
        #     json_obj['predicate']['concept']['concept_name'] = concept.concept_name
        #     json_obj['predicate']['concept']['concept_area'] = name.name
        #
        #     json_obj['object']['concept']['concept_url'] = concept_o.concept_url
        #     json_obj['object']['concept']['concept_name'] = concept_o.concept_name
        #     json_obj['object']['concept']['concept_area'] = name_o.name
        #
        #     if not RelationshipSubjMention.objects.filter(username=user, name_space=name_space,
        #                                                              document_id=document, language=language, start=mention_s,
        #                                                              stop=mention_s.stop,
        #                                                              object_concept_url=concept_o.concept_url,
        #                                                              object_name=name_o.name,
        #                                                              predicate_concept_url=concept.concept_url,
        #                                                              predicate_name=name.name
        #                                                              ).exists():
        #
        #         suggested_annotations['relations'].append(json_obj)
        #
        #
        #
        #
        #
        #
        #
        #
        #
        # rel_obj_men = RelationshipObjMention.objects.filter(document_id = document, name_space = name_space, start = mention, stop = mention.stop).exclude(username = user)
        # for link in rel_obj_men:
        #     mention_s = Mention.objects.get(document_id=document, language=language, start=link.start,
        #                                     stop=link.stop)
        #     concept = Concept.objects.get(concept_url=link.predicate_concept_url)
        #     name = SemanticArea.objects.get(name=link.predicate_name)
        #     concept_o = Concept.objects.get(concept_url=link.subject_concept_url)
        #     name_o = SemanticArea.objects.get(name=link.subject_name)
        #     json_obj = {}
        #     json_obj['count'] = RelationshipObjMention.objects.filter(name_space=name_space,
        #                                                              document_id = document, language = language, start = mention, stop = mention.stop,
        #                                                              subject_concept_url = concept_o.concept_url,subject_name = name_o.name,
        #                                                              predicate_concept_url = concept.concept_url,predicate_name = name.name
        #                                                              ).exclude(username = user).count()
        #     json_obj['subject'] = {}
        #     json_obj['subject']['mention'] = {}
        #     json_obj['subject']['concept'] = {}
        #     json_obj['predicate'] = {}
        #     json_obj['predicate']['mention'] = {}
        #     json_obj['predicate']['concept'] = {}
        #     json_obj['object'] = {}
        #     json_obj['object']['mention'] = {}
        #     json_obj['object']['concept'] = {}
        #
        #     json_mention_source = return_start_stop_for_frontend(mention_s.start, mention_s.stop,
        #                                                          document.document_content)
        #     json_obj['object']['mention']['start'] = json_mention_source['start']
        #     json_obj['object']['mention']['stop'] = json_mention_source['stop']
        #     json_obj['object']['mention']['stop'] = json_mention_source['position']
        #     json_obj['object']['mention']['mention_text'] = mention_s.mention_text
        #
        #     json_obj['predicate']['concept']['concept_url'] = concept.concept_url
        #     json_obj['predicate']['concept']['concept_name'] = concept.concept_name
        #     json_obj['predicate']['concept']['concept_area'] = name.name
        #
        #     json_obj['subject']['concept']['concept_url'] = concept_o.concept_url
        #     json_obj['subject']['concept']['concept_name'] = concept_o.concept_name
        #     json_obj['subject']['concept']['concept_area'] = name_o.name
        #     if not RelationshipObjMention.objects.filter(username=user, name_space=name_space,
        #                                                              document_id = document, language = language, start = mention, stop = mention.stop,
        #                                                              subject_concept_url = concept_o.concept_url,subject_name = name_o.name,
        #                                                              predicate_concept_url = concept.concept_url,predicate_name = name.name
        #                                                              ).exists():
        #         suggested_annotations['relations'].append(json_obj)
        #
        #
        #
        #
        #
        # rel_pred_men = RelationshipPredMention.objects.filter(document_id = document, name_space = name_space, start = mention, stop = mention.stop).exclude(username = user)
        # for link in rel_pred_men:
        #     mention_s = Mention.objects.get(document_id=document, language=language, start=link.start,
        #                                     stop=link.stop)
        #     concept = Concept.objects.get(concept_url=link.object_concept_url)
        #     name = SemanticArea.objects.get(name=link.object_name)
        #     concept_o = Concept.objects.get(concept_url=link.subject_concept_url)
        #     name_o = SemanticArea.objects.get(name=link.subject_name)
        #     json_obj = {}
        #     json_obj['subject'] = {}
        #     json_obj['subject']['mention'] = {}
        #     json_obj['subject']['concept'] = {}
        #     json_obj['predicate'] = {}
        #     json_obj['predicate']['mention'] = {}
        #     json_obj['predicate']['concept'] = {}
        #     json_obj['object'] = {}
        #     json_obj['object']['mention'] = {}
        #     json_obj['object']['concept'] = {}
        #
        #     json_mention_source = return_start_stop_for_frontend(mention_s.start, mention_s.stop,
        #                                                          document.document_content)
        #     json_obj['predicate']['mention']['start'] = json_mention_source['start']
        #     json_obj['predicate']['mention']['stop'] = json_mention_source['stop']
        #     json_obj['predicate']['mention']['position'] = json_mention_source['position']
        #     json_obj['predicate']['mention']['mention_text'] = mention_s.mention_text
        #
        #     json_obj['object']['concept']['concept_url'] = concept.concept_url
        #     json_obj['object']['concept']['concept_name'] = concept.concept_name
        #     json_obj['object']['concept']['concept_area'] = name.name
        #
        #     json_obj['subject']['concept']['concept_url'] = concept_o.concept_url
        #     json_obj['subject']['concept']['concept_name'] = concept_o.concept_name
        #     json_obj['subject']['concept']['concept_area'] = name_o.name
        #     if not RelationshipPredMention.objects.filter(username=user, name_space=name_space,
        #                                                               document_id=document, language=language, start=mention,
        #                                                               stop=mention.stop,
        #                                                               object_concept_url=concept.concept_url,
        #                                                               object_name=name.name,
        #                                                               subject_concept_url=concept_o.concept_url,
        #                                                               subject_name=name_o.name
        #                                                               ).exists():
        #         suggested_annotations['relations'].append(json_obj)
        #
        #
        #
        #
        #
        #
        # rel_subj_con = RelationshipSubjConcept.objects.filter(predicate_document_id = document,predicate_language = document.language, name_space = name_space).exclude(username = user)
        # for link in rel_subj_con:
        #     if (link.object_start == mention.start and link.object_stop == mention.stop) or (link.predicate_start == mention.start and link.predicate_stop == mention.stop):
        #         mention_o = Mention.objects.get(object_document_id=document, object_language=language,
        #                                         start=link.object_start,
        #                                         stop=link.object_stop)
        #         mention_p = Mention.objects.get(predicate_document_id=document, predicate_language=language,
        #                                         start=link.predicate_start,
        #                                         stop=link.predicate_stop)
        #         concept = link.concept_url
        #         name = link.name
        #
        #         json_obj = {}
        #         json_obj['subject'] = {}
        #         json_obj['subject']['mention'] = {}
        #         json_obj['subject']['concept'] = {}
        #         json_obj['predicate'] = {}
        #         json_obj['predicate']['mention'] = {}
        #         json_obj['predicate']['concept'] = {}
        #         json_obj['object'] = {}
        #         json_obj['object']['mention'] = {}
        #         json_obj['object']['concept'] = {}
        #
        #         json_mention_source = return_start_stop_for_frontend(mention_p.start, mention_p.stop,
        #                                                              document.document_content)
        #         json_obj['predicate']['mention']['start'] = json_mention_source['start']
        #         json_obj['predicate']['mention']['stop'] = json_mention_source['stop']
        #         json_obj['predicate']['mention']['position'] = json_mention_source['position']
        #         json_obj['predicate']['mention']['mention_text'] = mention_p.mention_text
        #
        #         json_mention_t = return_start_stop_for_frontend(mention_o.start, mention_o.stop,
        #                                                              document.document_content)
        #         json_obj['object']['mention']['start'] = json_mention_t['start']
        #         json_obj['object']['mention']['stop'] = json_mention_t['stop']
        #         json_obj['object']['mention']['position'] = json_mention_t['position']
        #         json_obj['object']['mention']['mention_text'] = mention_o.mention_text
        #
        #         json_obj['subject']['concept']['concept_url'] = concept.concept_url
        #         json_obj['subject']['concept']['concept_name'] = concept.concept_name
        #         json_obj['subject']['concept']['concept_area'] = name.name
        #         if not RelationshipSubjConcept.objects.filter(username=user, name_space=name_space,
        #                                                              predicate_document_id=document.document_id,
        #                                                              predicate_language=document.language,
        #                                                              predicate_start=mention_p.start,
        #                                                              predicate_stop=mention_p.stop,
        #                                                              object_start=mention_o.start,
        #                                                              object_stop= mention_o.stop,
        #                                                              concept_url=concept,
        #                                                              name=name).exists():
        #             suggested_annotations['relations'].append(json_obj)
        #
        #
        #
        #
        #
        #
        # rel_obj_con = RelationshipObjConcept.objects.filter(predicate_document_id = document,predicate_language = document.language, name_space = name_space).exclude(username = user)
        # for link in rel_obj_con:
        #     if (link.subject_start == mention.start and link.subject_stop == mention.stop) or (link.predicate_start == mention.start and link.predicate_stop == mention.stop):
        #         mention_o = Mention.objects.get(object_document_id=document, object_language=language,
        #                                         start=link.subject_start,
        #                                         stop=link.subject_stop)
        #         mention_p = Mention.objects.get(predicate_document_id=document, predicate_language=language,
        #                                         start=link.predicate_start,
        #                                         stop=link.predicate_stop)
        #         concept = link.concept_url
        #         name = link.name
        #
        #         json_obj = {}
        #         json_obj['subject'] = {}
        #         json_obj['subject']['mention'] = {}
        #         json_obj['subject']['concept'] = {}
        #         json_obj['predicate'] = {}
        #         json_obj['predicate']['mention'] = {}
        #         json_obj['predicate']['concept'] = {}
        #         json_obj['object'] = {}
        #         json_obj['object']['mention'] = {}
        #         json_obj['object']['concept'] = {}
        #
        #         json_mention_s = return_start_stop_for_frontend(mention_p.start, mention_p.stop,
        #                                                         document.document_content)
        #         json_obj['predicate']['mention']['start'] = json_mention_s['start']
        #         json_obj['predicate']['mention']['stop'] = json_mention_s['stop']
        #         json_obj['predicate']['mention']['position'] = json_mention_s['position']
        #         json_obj['predicate']['mention']['mention_text'] = mention_p.mention_text
        #
        #         json_mention_t = return_start_stop_for_frontend(mention_o.start, mention_o.stop,
        #                                                         document.document_content)
        #         json_obj['subject']['mention']['start'] = json_mention_t['start']
        #         json_obj['subject']['mention']['stop'] = json_mention_t['stop']
        #         json_obj['subject']['mention']['position'] = json_mention_t['position']
        #         json_obj['subject']['mention']['mention_text'] = mention_o.mention_text
        #
        #         json_obj['object']['concept']['concept_url'] = concept.concept_url
        #         json_obj['object']['concept']['concept_name'] = concept.concept_name
        #         json_obj['object']['concept']['concept_area'] = name.name
        #         if not RelationshipObjConcept.objects.filte(username = user, name_space = name_space, subject_document_id = document.document_id,
        #                                        subject_language = document.language, subject_start = mention_o.start,subject_stop = mention_o.stop,
        #                                        predicate_start = mention_p.start,predicate_stop = mention_p.stop,concept_url = concept, name=name).exists():
        #             suggested_annotations['relations'].append(json_obj)
        #
        #
        #
        #
        # rel_pred_con = RelationshipPredConcept.objects.filter(subject_document_id = document,subject_language = document.language, name_space = name_space).exclude(username = user)
        # for link in rel_pred_con:
        #     if (link.subject_start == mention.start and link.subject_stop == mention.stop) or (
        #             link.object_start == mention.start and link.object_stop == mention.stop):
        #         mention_s = Mention.objects.get(object_document_id=document, object_language=language,
        #                                         start=link.subject_start,
        #                                         stop=link.subject_stop)
        #         mention_o = Mention.objects.get(predicate_document_id=document, predicate_language=language,
        #                                         start=link.object_start,
        #                                         stop=link.object_stop)
        #         concept = link.concept_url
        #         name = link.name
        #
        #         json_obj = {}
        #         json_obj['subject'] = {}
        #         json_obj['subject']['mention'] = {}
        #         json_obj['subject']['concept'] = {}
        #         json_obj['predicate'] = {}
        #         json_obj['predicate']['mention'] = {}
        #         json_obj['predicate']['concept'] = {}
        #         json_obj['object'] = {}
        #         json_obj['object']['mention'] = {}
        #         json_obj['object']['concept'] = {}
        #
        #         json_mention_t = return_start_stop_for_frontend(mention_s.start, mention_s.stop,
        #                                                         document.document_content)
        #         json_obj['subject']['mention']['start'] = json_mention_t['start']
        #         json_obj['subject']['mention']['stop'] = json_mention_t['stop']
        #         json_obj['subject']['mention']['position'] = json_mention_t['position']
        #         json_obj['subject']['mention']['mention_text'] = mention_s.mention_text
        #
        #         json_mention_o = return_start_stop_for_frontend(mention_o.start, mention_o.stop,
        #                                                         document.document_content)
        #         json_obj['object']['mention']['start'] = json_mention_o['start']
        #         json_obj['object']['mention']['stop'] = json_mention_o['stop']
        #         json_obj['object']['mention']['position'] = json_mention_o['position']
        #         json_obj['object']['mention']['mention_text'] = mention_o.mention_text
        #
        #         json_obj['predicate']['concept']['concept_url'] = concept.concept_url
        #         json_obj['predicate']['concept']['concept_name'] = concept.concept_name
        #         json_obj['predicate']['concept']['concept_area'] = name.name
        #         if not RelationshipPredConcept.objects.filte(username=user, name_space=name_space,
        #                                                             subject_document_id=document.document_id,
        #                                                             subject_language=document.language,
        #                                                             subject_start=mention_s.start,
        #                                                             subject_stop=mention_s.stop,
        #                                                             object_start=mention_o.start,
        #                                                             object_stop=mention_o.stop,
        #                                                              concept_url=concept,
        #                                                             name=area).exists():
        #             suggested_annotations['relations'].append(json_obj)

        return JsonResponse(suggested_annotations)
