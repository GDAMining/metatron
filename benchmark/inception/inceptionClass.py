from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.keys import Keys

from selenium.webdriver.common.action_chains import ActionChains
import statistics
import json
import statistics
from selenium.webdriver.chrome.options import Options


class InceptionClass:

    def __init__(self, pos, rels, num_docs, iterations):


        self.driver = webdriver.Chrome(
            executable_path='/path/to/your/driver')
        self.num_docs = num_docs
        self.iterations = iterations
        self.clicks = 0
        f = open(pos)
        g = open(rels)
        mentions_json = json.load(f)
        rels_json = json.load(g)
        # mentions_list = mentions_json['relationships']
        self.mentions_list = mentions_json['concepts']
        self.relationships_list = rels_json['relationships']

    def full_pipeline(self, my_url, name_coll):
        self.activate(my_url, name_coll)

        for doc in ['pubmed_26676609.txt',
                    'pubmed_26717044.txt',
                    'pubmed_26989024.txt',
                    'pubmed_27839516.txt',
                    'pubmed_29992839.txt',
                    'pubmed_29635363.txt',
                    'pubmed_30075157.txt',
                    'pubmed_30858172.txt',
                    'pubmed_31069148.txt',
                    'pubmed_31704862.txt',
                    'pubmed_1317500.txt',
                    'pubmed_14516936.txt',
                    'pubmed_19444644.txt',
                    'pubmed_21170045.txt',
                  ]:
            time.sleep(1)
            # doc = 'pubmed_14516936'
            self.driver.find_element(by=By.XPATH, value="//a[@href='../benchamrk']").click()
            time.sleep(0.5)
            self.driver.find_element(by=By.XPATH, value='//a[@href="./benchamrk/annotate"]').click()
            time.sleep(0.5)

            self.driver.find_element(by=By.XPATH, value="//span[text()='"+doc+"']").click()
            for i in range(0,50):
                time.sleep(2)
                print('\n\n\n ITERATION '+str(i))
                count = 0
                total_time = 0


                while count < 1:
                    self.clicks = 0
                    z = open('../output/output_inception_' + str(i) + '.txt', 'a')
                    doc = self.driver.find_element(by=By.XPATH,value="//span[@class='badge border border-secondary text-secondary'][2]").text.split('.txt')[0]
                    self.driver.find_element(by=By.XPATH,value="//button[@title='Reset document']").click()
                    time.sleep(0.8)
                    self.driver.find_element(by=By.XPATH,value="//input[@placeholder='Enter value here...']").send_keys(doc+str('.txt'))
                    time.sleep(0.7)
                    self.driver.find_element(by=By.XPATH,value="//button[@class='btn btn-danger']").click()
                    time.sleep(2)
                    self.end_mention = 0
                    relations = [m for m in self.relationships_list if m['document_id'] == doc]
                    mentions_list = []
                    for relationship in relations:
                        subject = {
                            "concept_url": relationship['subject_concepts'][0]['concept_url'],
                            "concept_name": relationship['subject_concepts'][0]['concept_name'],
                            "area": relationship['subject_concepts'][0]['concept_area'],
                            "start": relationship['subject_start'],
                            "stop": relationship['subject_stop'],
                            "mention_text": relationship['subject_mention_text']

                        }
                        object = {
                            "concept_url": relationship['object_concepts'][0]['concept_url'],
                            "concept_name": relationship['object_concepts'][0]['concept_name'],
                            "area": relationship['object_concepts'][0]['concept_area'],
                            "start": relationship['object_start'],
                            "stop": relationship['object_stop'],
                            "mention_text": relationship['object_mention_text']

                        }
                        mentions_list.append(subject)
                        mentions_list.append(object)
                    # mentions = []
                    # relations = []
                    mentions_list = sorted(mentions_list,key=lambda x: int(x['start']))
                    mentions_list = sorted(mentions_list, key=lambda x: x['start'])
                    mentions_list_3 = []
                    # remove duplicates from 2
                    for x in mentions_list:
                        if not any(y['start'] == x['start'] for y in mentions_list_3):
                            mentions_list_3.append(x)
                    print(doc)
                    exc = False
                    time.sleep(1)
                    # if doc.startswith("pubmed_31704862"): #pubmed_31069148
                    st = time.time()
                    try:
                        self.annotate(mentions_list_3, relations)
                    except Exception as e:
                        exc = True
                        print(e)
                        print('eccezione ',doc)
                    else:
                        doc_exec = True
                        exc = False
                    # btn = self.driver.find_elements(by=By.XPATH, value='//button[@title="Next document (Shift+page-down)"]')[0]

                    self.clicks += 1
                    end_time = time.time()
                    print(end_time-st)
                    total_time += (end_time-st)
                    print(total_time)
                    count += 1
                    if not exc:

                        z.write("iteration_" + str(i) + '\t' + doc +'\t' + str(end_time - st)+'\t'+str(self.clicks)+'\n')
                    # z.write(
                    #     "iteration_" + str(i) + '\t' + doc + '\t' + str(end_time - st) + '\t' + str(self.clicks) + '\n')
                    time.sleep(1)

                time.sleep(1)


    def activate(self, my_url, name_coll):
        self.driver.get(my_url)
        # logout and login
        time.sleep(1)

        self.driver.find_element(by=By.XPATH, value="//*[@name='username']").send_keys('admin')
        self.driver.find_element(by=By.XPATH, value="//*[@name='password']").send_keys('admin')
        time.sleep(0.5)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@value="SIGN IN"]'))
        ).click()
        time.sleep(1)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//a[@href="./p/benchamrk"]'))
        ).click()
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//a[@href="./benchamrk/annotate"]'))
        ).click()
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//tbody/tr/td[2]'))
        ).click()
        time.sleep(0.5)



        self.driver.maximize_window()



    def annotate(self, mentions_list, relationships_list):
        set_seen = []
        mapper = {}
        driver = self.driver

        mentions_list_1 = mentions_list
        st = time.time()
        action = ActionChains(driver)


        # calculate center position
        last_ind = 0
        start_ind = 0

        mention_time = time.time()
        for m in mentions_list_1:
            time.sleep(0.5)
            mention = m['mention_text']
            if mention == 'HER-2':
                mention = 'HER'
            elif mention == 'c-erbB-2':
                mention = 'c-erbB'
            elif mention == 'TTF-1':
                mention = 'TTF'
            words = mention.split()

            possible_words = driver.find_elements(by=By.XPATH,value='//*[text()="'+words[0]+'"]')
            possible_words = [w for w in possible_words if (w.get_attribute("class") != 'spacing' and w.get_attribute("class") != 'row-initial-spacing' and
                                                            (int(w.get_attribute("data-chunk-id"))>start_ind))]
            data_id = int(possible_words[0].get_attribute("data-chunk-id"))
            # print(data_id,mention)
            start_el = driver.find_elements(by=By.XPATH, value='//*[@data-chunk-id="' + str(data_id) + '"]')
            start_el = [w for w in start_el if (w.get_attribute("class") != 'spacing' and w.get_attribute("class") != 'row-initial-spacing' and
                                                            ((int(w.get_attribute("data-chunk-id"))>start_ind) and w.text == words[0]))][0]
            last_ind = data_id
            start_ind = int(data_id)
            if len(words)>1:
                found = True
                for w in possible_words:
                    found = False
                    data_id = int(w.get_attribute("data-chunk-id"))

                    start_el = driver.find_elements(by=By.XPATH, value='//*[@data-chunk-id="' + str(data_id) + '"]')

                    start_el = [s for s in start_el if (w.get_attribute("class") != 'spacing' and w.get_attribute("class") != 'row-initial-spacing' and w.text == words[0])][0]
                    key = start_el.get_attribute("data-chunk-id")


                    driver.execute_script("arguments[0].scrollIntoView(true);", start_el)
                    for word in words[1:]:
                        next_elems = driver.find_elements(by=By.XPATH,value='//*[@data-chunk-id="' + str(data_id+1) + '"]')
                        next_elems = [e for e in next_elems if e.text == word]

                        for el in next_elems:
                            if el.text == word:

                                if words.index(word) == len(words) - 1:
                                    action.drag_and_drop(el, start_el).perform()
                                    self.clicks += 1
                                    found = True
                                data_id += 1
                                break

                            if found:
                                break
                    if found:
                        mapper[str(key)] = m
                        start_ind = int(key)

                        break

            else:
                driver.execute_script("arguments[0].scrollIntoView(true);", start_el)
                key = start_el.get_attribute("data-chunk-id")
                mapper[str(key)] = m
                start_ind = int(key)
                action.move_to_element(start_el).double_click().perform()
                self.clicks += 1

            time.sleep(0.7)
            url = m['concept_name']
            area = m['area']
            driver.find_element(by=By.XPATH,
                                value="//input[@class='k-input-inner k-input k-input-md k-input-solid k-rounded-md']").send_keys(area)
            self.clicks+=2
            time.sleep(0.5)
            driver.find_element(by=By.XPATH,
                                value="//input[@class='flex-content k-input k-input-md k-input-solid k-rounded-md k-textbox']").send_keys(url)
            driver.find_element(by=By.XPATH,value='//body').click()
            self.clicks+=1
            time.sleep(0.7)


        end_mention = time.time() - mention_time
        self.end_mention = end_mention

        c = 0
        for relation in relationships_list[0:]:
            time.sleep(0.8)
            subject_mention = [relation['subject_start'],relation['subject_stop'],relation['subject_mention_text']]
            object_mention = [relation['object_start'],relation['object_stop'],relation['object_mention_text']]
            subject_el = None
            object_el = None
            for key, value in mapper.items():
                if value['start'] == subject_mention[0] and value['mention_text'] == subject_mention[2]:
                    subj_mention = subject_mention[2]
                    if subj_mention == 'HER-2':
                        subj_mention = 'HER'
                    elif subj_mention == 'c-erbB-2':
                        subj_mention = 'c-erbB'
                    elif subj_mention == 'TTF-1':
                        subj_mention = 'TTF'
                    elif subj_mention == 'epidermal growth factor receptor 2':
                        subj_mention = 'epidermal growth factor receptor'
                    elif subj_mention == 'Ubiquitin-like with PHD and RING Finger domains 1':
                        subj_mention = 'Ubiquitin-like with PHD and RING Finger domains'
                    subject_el = driver.find_element(by=By.XPATH,value='//*[@data-chunk-id="'+str(key)+'"][text()="'+subj_mention+'"]')
                    # driver.execute_script("arguments[0].scrollIntoView();", subject_el)
                    time.sleep(0.2)
                    action.move_to_element(subject_el).move_by_offset(0,-25).click().perform()
                    if c == 0:
                        try:
                            action.move_to_element(subject_el).move_by_offset(0,-25).click().perform()
                            action.move_to_element(subject_el).move_by_offset(0,-25).click().perform()
                        except:
                            pass
                    c+=1
                    time.sleep(0.5)
                    self.clicks += 1
                    break
            if subject_el:
                for key, value in mapper.items():

                    if value['start'] == object_mention[0] and value['mention_text'] == object_mention[2]:
                        obj_mention = object_mention[2]
                        if obj_mention == 'HER-2':
                            obj_mention = 'HER'
                        elif obj_mention == 'c-erbB-2':
                            obj_mention = 'c-erbB'
                        elif obj_mention == 'TTF-1':
                            obj_mention = 'TTF'
                        elif obj_mention == 'Ubiquitin-like with PHD and RING Finger domains 1':
                            obj_mention = 'Ubiquitin-like with PHD and RING Finger domains'
                        time.sleep(0.3)
                        object_el = driver.find_element(by=By.XPATH,value='//*[@data-chunk-id="'+str(key)+'"][text()="'+obj_mention+'"]')
                        time.sleep(0.2)

                        driver.execute_script("arguments[0].scrollIntoView(true);", object_el)
                        time.sleep(0.5)
                        action.move_to_element(object_el).move_by_offset(0, -20).context_click().perform()
                        time.sleep(0.4)
                        self.clicks += 1

                        driver.find_element(by=By.XPATH, value='//span[text()="Link to ..."]').click()
                        time.sleep(0.5)
                        self.clicks += 1
                        el = driver.find_element(by=By.XPATH, value='//input[@id="featureEditorHead20"]')
                        el.send_keys(relation['predicate_concepts'][0]['concept_area'])
                        time.sleep(0.5)
                        self.clicks += 1

                        driver.find_element(by=By.XPATH, value='//input[@id="featureEditorHead23"]').send_keys(
                            relation['predicate_concepts'][0]['concept_name'])
                        self.clicks += 1
                        break











if __name__ == '__main__':
    teamObj = InceptionClass('../annotations/concepts/concepts_all.json', '../annotations/relationships/relationships_all.json',
                        15, 1)
    teamObj.full_pipeline('http://localhost:8080/', 'TestProjectMeta')