from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.action_chains import ActionChains
import statistics
import json
import statistics



class TeamClass:

    def __init__(self,pos,rels,num_docs,iterations):


        self.driver = webdriver.Chrome(executable_path='/chromedriver2.exe')
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


    def full_pipeline(self,my_url,name_coll):
        # z = open('../output/teamtat/output_teamtat.txt','a')

        # time_list = []
        # try:
            self.activate(my_url, name_coll)
            for i in range(183,200):
                # if i > 0:
                #     time.sleep(20)
                f = open('../output/output_teamtat_iter.txt', 'a')

                # if i == 0:
                try:
                    self.getcurclick()
                except:
                    pass
                print('ITERATION ',str(i))
                count = 0
                time.sleep(2)
                while count <15:
                    time.sleep(2)
                    ff = open('../output/output_teamtat_mentions_doc_' + str(i) + '.txt', 'a')
                    self.clicks = 0
                    mentions_list,relationships_list,doc = self.cur_doc()
                    if mentions_list[0]['document_id'] != '':
                        mentions_list_2 = []
                        for relationship in relationships_list:
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
                            mentions_list_2.append(subject)
                            mentions_list_2.append(object)

                        mentions_list_2 = sorted(mentions_list_2, key=lambda x: x['start'])
                        mentions_list_3 = []
                        #remove duplicates from 2
                        for x in mentions_list_2:
                            if not any(y['start'] == x['start'] for y in mentions_list_3):
                                mentions_list_3.append(x)

                        try:
                            st_it = time.time()
                            self.annotate(mentions_list_3,relationships_list)
                            end_it = time.time() - st_it
                        except Exception as e:
                            print(e)
                        else:
                            self.clicks += 1
                            ff.write("iteration_" + str(i) + '\t' + str(doc) + '\t' + str(end_it) + '\t' + str(
                                self.clicks)+'\n')
                        # ff.write('\n')
                    time.sleep(0.5)
                    count += 1
                    self.driver.get("https://www.teamtat.org/projects/3165/documents")
                    time.sleep(0.8)
                    if count < 15:
                        self.driver.find_element(by=By.XPATH, value="//tr[@class='documents-list']["+str(int(count+1))+"]/td/a").click()
                    else:

                        elem1 = WebDriverWait(self.driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, '//i[@class="settings icon"]'))
                        )
                        elem1.click()
                        time.sleep(0.5)
                        elem = WebDriverWait(self.driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, '//a[text()="Delete All Annotations"]'))
                        )
                        elem.click()
                        WebDriverWait(self.driver, 10).until(EC.alert_is_present())
                        self.driver.switch_to.alert.accept()
                        self.driver.find_element(by=By.XPATH, value="//tr[@class='documents-list'][" + str(
                            int(1)) + "]/td/a").click()
                        break

                i += 1


                ff.write('\n')
                ff.close()






    def activate(self,my_url,name_coll):
        self.driver.get(my_url)

        self.driver.find_element(by=By.XPATH, value="//a[text()='Projects']").click()
        time.sleep(1)
        ele = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//a[text()="' + name_coll + '"]'))
        )
        ele.click()
        time.sleep(1)
        self.driver.maximize_window()

        elem1 = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//i[@class="settings icon"]'))
        )
        elem1.click()
        time.sleep(0.5)
        elem = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//a[text()="Delete All Annotations"]'))
        )
        elem.click()
        WebDriverWait(self.driver, 10).until(EC.alert_is_present())
        self.driver.switch_to.alert.accept()
        # elem = WebDriverWait(self.driver, 10).until(
        #     EC.presence_of_element_located((By.XPATH, '//a[@href="/projects/3165/documents?direction=asc&sort=updated_at"]'))
        # )
        # elem.click()
        time.sleep(0.6)
        self.url1 = self.driver.current_url
        self.driver.find_element(by=By.XPATH, value="//tr[@class='documents-list']/td/a").click()
        # self.driver.find_element(by=By.XPATH, value='//a[text()="30075157"]').click()
        time.sleep(0.5)


    def getcurclick(self):
        time.sleep(1)
        driver = self.driver
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH,
                                            '//img[@src="/assets/demo-83ede5c705c395bd49e1d9a9554985edb668154d22710241055b4843300aab22.gif"]'))
        )

        ele2 = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//div[@class="ui red deny button"]'))
        )

        ele2.click()



    def cur_doc(self):
        driver = self.driver
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//button[@class="ui button small doc-info-btn"]'))
            ).click()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//div[@class="ui modal doc-info transition visible active"]'))
            )
        except:
            pass
        elems = driver.find_elements(by=By.XPATH, value='//div[@class="header"]')
        id = ''
        for el in elems:
            if 'Document - ' in el.text:
                testo = el.text
                id = testo.split(' - ')[1]
                print(id)
                break
        driver.find_element(by=By.XPATH, value="//div[@class='ui cancel button']").click()
        mentions_list = [x for x in self.mentions_list if x['document_id'] == 'pubmed_' + id]
        relationships_list = [x for x in self.relationships_list if x['document_id'] == 'pubmed_' + id]
        return mentions_list,relationships_list,'pubmed_' + id

    def annotate(self,mentions_list,relationships_list):
        driver = self.driver
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//div[@class="text abstract passage-text"]'))
        )
        mentions_list_1 = mentions_list

        action = ActionChains(driver)
        body1 = driver.find_element(by=By.XPATH, value='//body')
        window_size = driver.execute_script("return [window.innerWidth, window.innerHeight];")

        # calculate center position
        center_x = int(window_size[0] / 2)
        center_y = int(window_size[1] / 2)
        print(len(mentions_list_1))
        c = 0
        mentions_list_2 = []

        for m in mentions_list:
            mention = m['mention_text']
            time.sleep(0.5)
            clientRect = driver.execute_script(
                "function printMousePos(event){console.log('CLICK X',event.offsetX);console.log('CLICK Y',event.offsetY);}"
                "document.addEventListener('click', printMousePos);"
                "var elements = document.getElementsByClassName('phrase  ');"
                "var element = elements.item(elements.length - 1);"
                "var testo = element.innerHTML;"
                "var textNode = element.childNodes[0];"
                "var ind = testo.indexOf(arguments[0]);"
                "var range = document.createRange();"
                "range.setStart(textNode, ind);"
                "range.setEnd(textNode, (ind + (arguments[0]).length));"
                "const clientRect = range.getBoundingClientRect();"
                "                window.getSelection().addRange(range);"
                "console.log('INDICE',window.getSelection().toString());"
            
                "return clientRect", mention

            )
            time.sleep(0.5)
            body1 = driver.find_element(by=By.XPATH, value='//body')
            if clientRect['height'] < 30:
                action.move_to_element(body1).move_by_offset((-center_x + clientRect['x'] + 10),
                                                             (-center_y + clientRect['y'] + 10)).click().perform()
            else:
                action.move_to_element(body1).move_by_offset((-center_x + clientRect['x'] + 10),
                                                             (-center_y + clientRect['y'] + 30)).click().perform()

            # action.move_to_element(body1).move_by_offset(to_ins_x + 10, to_ins_y + 10).click().perform()
            time.sleep(0.5)
            driver.execute_script("window.getSelection().removeAllRanges();")
            self.clicks += 1


            # find the concepts
            area = m['area'].lower()
            url = m['concept_url']
            #
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//table[@id="annotationTable"]/tbody[@id="annotationList"]/tr[1]/td[1]'))
            ).click()
            self.clicks += 1
            time.sleep(0.5)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//span[@class="type-edit"]/select/option[text()="'+area+'"]'))
            ).click()
            self.clicks += 1

            time.sleep(0.7)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//table[@id="annotationTable"]/tbody[@id="annotationList"]/tr[1]/td[2]'))
            ).click()
            # action.click(driver.find_element(by=By.XPATH,value='//table[@id="annotationTable"]/tbody[@id="annotationList"]/tr[1]/td[2]')).perform()
            self.clicks += 1
            time.sleep(0.3)

            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//span[@class="concept-edit"]/input[@name="concept"]'))
            ).send_keys(url)
            self.clicks += 1

            time.sleep(0.3)
            driver.find_element(by=By.XPATH,value='//span[@class="phrase  "]').click()
            time.sleep(0.5)

        # relationships
        driver.find_element(by=By.XPATH, value='//div[@class="ui top attached tabular menu"]/a[text()="Relations"]').click()
        self.clicks += 1

        ind = 1
        relationships_list = []
        for relation in relationships_list:
            time.sleep(0.8)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//a[@id="addRelationButton"]'))
            ).click()
            self.clicks += 1

            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//table[@id="relationTable"]/tbody[@id="relationList"]/tr[@data-id="R'+str(ind)+'"]/td[3]/i[@class="icon show-popup search"]'))).click()
            self.clicks += 1

            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//a[@class="add-node action-button"]'))).click()
            self.clicks += 1

            time.sleep(0.5)

            subject_ment = relation['subject_mention_text']
            object_ment = relation['object_mention_text']
            subject_start = relation['subject_start']
            object_start = relation['object_start']
            subject_stop = relation['subject_stop']
            object_stop = relation['object_stop']
            object_ind,subject_ind = -1,-1
            for c in mentions_list_1:
                if c['start'] == subject_start and c['stop'] == subject_stop and c['mention_text'] == subject_ment:
                    subject_ind = mentions_list_1.index(c)
                if c['start'] == object_start and c['stop'] == object_stop and c['mention_text'] == object_ment:
                    object_ind = mentions_list_1.index(c)
                if subject_ind != -1 and object_ind != -1:
                    break
            if subject_ind != -1 and object_ind != -1:
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//div[contains(@class,"ui selection dropdown")]'))).click()
                time.sleep(0.5)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//div[@data-value="'+str(subject_ind+1)+'"]'))).click()
                time.sleep(0.3)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//button[@class="ui button primary"][text()="Add"]'))).click()
                time.sleep(0.2)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//table[@class="ui very compact table ref-nodes"]/tbody[@class="ui-sortable"]/tr[1]/td[6]/input'))).click()
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//table[@class="ui very compact table ref-nodes"]/tbody[@class="ui-sortable"]/tr[1]/td[6]/input'))).send_keys('subject')
                time.sleep(0.3)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//a[@class="add-node action-button"]'))).click()
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//div[starts-with(@class, "ui selection dropdown")]'))).click()
                time.sleep(0.5)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//div[@data-value="'+str(object_ind+1)+'"]'))).click()
                time.sleep(0.2)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//button[@class="ui button primary"][text()="Add"]'))).click()
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//table[@class="ui very compact table ref-nodes"]/tbody[@class="ui-sortable"]/tr[2]/td[6]/input'))).click()
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//table[@class="ui very compact table ref-nodes"]/tbody[@class="ui-sortable"]/tr[2]/td[6]/input'))).send_keys('object')
                # WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,'//table[@class="ui very compact table ref-nodes"]/tbody[@class="ui-sortable"]/tr[2]/td[6]/input'))).click()
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//a[@class="add-node action-button"]'))).click()
                time.sleep(0.3)
                action.click(driver.find_element(by=By.XPATH,value='//div[@class="ui dimmer modals page transition visible active"]/div[@class="ui small modal transition visible active"]/div[@class="actions"]/div[@class="ui blue button positive action-button hide-for-add"]')).perform()

                self.clicks += 10
                time.sleep(0.3)
                ind+=1






if __name__ == '__main__':
    teamObj = TeamClass('../annotations/concepts/concepts_all.json','../annotations/relationships/relationships_all.json',15,1)
    teamObj.full_pipeline('***','TestProjectMeta')