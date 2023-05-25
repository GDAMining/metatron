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

FINAL_ORDER = ['pubmed_26989024','pubmed_24662820','pubmed_27839516','pubmed_14516936','pubmed_19444644','pubmed_31704862',
               'pubmed_31069148','pubmed_30858172','pubmed_30075157','pubmed_29992839','pubmed_29635363','pubmed_26717044',
               'pubmed_26676609','pubmed_21170045','pubmed_1317500']


class LightClass:

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

    def add_jobs(self):
        self.activate(self,"https://ornellair.lighttag.io/manage/job/add")
        job = self.driver.find_element(by=By.XPATH,value="//div[@class='MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-padding MuiListItem-divider MuiListItem-button css-1w1cq38']")
        job.find_element(by=By.XPATH,value="//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary MuiIconButton-edgeEnd MuiIconButton-sizeLarge css-1526mn4']").click()
        for i in range(300,500):
            time.sleep(2)
            self.driver.find_element(by=By.XPATH,value="//input[@id='Job Name']").send_keys(str(i))
            time.sleep(0.5)

            self.driver.find_element(by=By.XPATH,value="//input[@class='MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-10p2j7j'][1]").send_keys('data1')
            self.driver.find_element(by=By.XPATH,value="//input[@class='MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-10p2j7j'][1]").send_keys(Keys.ARROW_DOWN)
            time.sleep(0.5)
            self.driver.find_element(by=By.XPATH,value="//input[@class='MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-10p2j7j'][1]").send_keys(Keys.ENTER)
            self.driver.find_element(by=By.XPATH,value="//h1[1]").click()
            time.sleep(0.5)

            els = self.driver.find_elements(by=By.XPATH,value="//input")
            els[2].send_keys('schema')
            els[2].send_keys(Keys.ARROW_DOWN)
            els[2].send_keys(Keys.ENTER)
            self.driver.find_element(by=By.XPATH,value="//button[text()='Save Job']").click()



    def full_pipeline(self,my_url,name_coll):

            self.activate(my_url,name_coll)
            # if i == 0:
            time.sleep(0.8)

            e = self.driver.find_element(by=By.XPATH, value="//button[@aria-label='Next Page']")
            self.driver.execute_script("""arguments[0].scrollTop += arguments[1];""", e, 100)

            try:
                for i in range(57,100):
                    print('iteration ',str(i))
                    total_amount = 0
                    self.driver.refresh()
                    time.sleep(13)
                    count = 0
                    cur_ind = 0
                    # self.driver.find_element(by=By.XPATH, value="//p[text()='Manage']").click()
                    self.driver.find_element(by=By.XPATH,
                                             value='//div[@class="MuiSelect-select MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall css-c6nqkf"][text()="All"]').click()
                    time.sleep(2)
                    self.driver.find_element(by=By.XPATH,
                                             value='//li[text()="Active"]').click()
                    time.sleep(1)

                    time.sleep(0.5)

                    while count <15:
                        time.sleep(5)
                        el = self.driver.find_elements(by=By.XPATH,
                                                 value="//button[@aria-label='Annotate Now']")
                        el[0].click()

                        time.sleep(0.5)
                        self.driver.execute_script("""window.scrollTo(0,0);""")
                        mentions_list_3 = []
                        ff = open('../output/new_output_lighttag_doc_' + str(i) + '.txt', 'a')

                        self.clicks = 0
                        # ind = count
                        # if count > 14:
                        #     ind = int(count%15)

                        time.sleep(1)

                        ele = WebDriverWait(self.driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, '//div[@class="MuiGrid-root MuiGrid-container css-1pzw31e"]/div[2]/span/button'))
                        # EC.presence_of_element_located((By.XPATH,
                        #                                 '//div/span[@class="MuiBadge-root-414"]/button[@class="MuiButtonBase-root-301 MuiIconButton-root-308 MuiIconButton-colorPrimary-312"]'))
                        )
                        action = ActionChains(self.driver)
                        ekem = ele.get_property('disabled')
                        if ekem is None or ekem == False:
                            action.move_to_element(ele).context_click().perform()
                            time.sleep(1)
                            ele = WebDriverWait(self.driver, 10).until(
                                EC.presence_of_element_located((By.XPATH,
                                                                '//h4'))
                                # EC.presence_of_element_located((By.XPATH,
                                #                                 '//div/span[@class="MuiBadge-root-414"]/button[@class="MuiButtonBase-root-301 MuiIconButton-root-308 MuiIconButton-colorPrimary-312"]'))
                            )
                            time.sleep(1)
                            action.move_to_element(ele).click().perform()
                        testo = self.driver.find_element(by=By.XPATH,value="//h4/span/span/span")
                        testo = testo.text

                        g = open('../output/data1.json','r')
                        splitted_text = testo.split()
                        data = json.load(g)
                        for j in data[:15]:
                            if splitted_text[0:4] == j['content'].split()[0:4]:
                                ind = data[:15].index(j)
                                break
                        ind_ID = FINAL_ORDER[int(ind)]
                        print(ind_ID)
                        relationships_list = [x for x in self.relationships_list if x['document_id'] == ind_ID]
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

                        #remove duplicates from 2
                        for x in mentions_list_2:
                            if not any(y['start'] == x['start'] for y in mentions_list_3):
                                mentions_list_3.append(x)


                        st_it = time.time()
                        self.annotate(mentions_list_3,relationships_list)
                        # time.sleep(1)
                        end_it = time.time() - st_it
                        total_amount += end_it
                        print('current_total ',str(total_amount))
                        ff.write("document_" + str(count) + '\t'+ str(ind_ID)+ '\t' + str(end_it) + '\t' + str(
                            self.clicks))
                        if count < 14:
                            self.driver.find_element(by=By.XPATH,
                                                 value="//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorSecondary MuiIconButton-edgeStart MuiIconButton-sizeLarge css-1r6l244']").click()
                        self.clicks += 1
                        time.sleep(0.6)

                        count+=1
                        ff.write('\n')
                        ff.close()
                        # self.driver.close()
                        # self.activate(my_url, name_coll)

                    i+=1
            except Exception as e:
                print(e)
                print('ECCEZIONE')
                ff.write('ECCEZIONE \n')






    def activate(self, my_url, name_coll):
        self.driver.get('https://ornellair.lighttag.io/manage/job')
        time.sleep(1)


        ele = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//input[@name="password"]'))
        )
        ele.send_keys("****")
        time.sleep(0.8)

        ele = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//input[@name="username"]'))
        )
        ele.send_keys("****")
        time.sleep(0.5)
        self.driver.maximize_window()

        ele = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//button[text()="Sign In"]'))
        )
        ele.click()
        # ele = self.driver.find_element(by=By.XPATH,value="//body")

        time.sleep(1)


    def getcurclick(self):
        driver = self.driver
        action = ActionChains(driver)
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH,
                                            "//h4[@class='MuiTypography-root-183 MuiTypography-h4-191']"))
        )
        # element = driver.find_element(by=By.XPATH,value='//body')
        # element.click()
        # action.move_to_element(element).perform()


        loc = element.location
        siz = element.size
        current_x = loc['x'] + (siz['width'] / 2)
        current_y = loc['y'] + (siz['height'] / 2)

        return current_x, current_y


    def annotate(self, mentions_list, relationships_list):
        mapper = {}
        driver = self.driver
        elem = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//h4[@class="MuiTypography-root MuiTypography-h4 css-ghfc2d"]'))
        )

        driver.find_element(by=By.XPATH, value="//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth  css-1hsxxhh']").click()
        # driver.find_element(by=By.XPATH, value="//li[text()='Relation Types']").click()
        driver.find_element(by=By.XPATH, value="//li[text()='Pseudo Nodes']").click()
        self.clicks +=2
        mentions_list_1 = mentions_list
        st = time.time()
        action = ActionChains(driver)
        body1 = driver.find_element(by=By.XPATH, value='//body')
        window_size = driver.execute_script("return [window.innerWidth, window.innerHeight];")
        e = driver.find_element(by=By.XPATH, value="//div[@class='css-1acrx85-content']")
        driver.execute_script("""arguments[0].scrollTop += arguments[1];""", e, 40)
        # calculate center position
        center_x = int(window_size[0] / 2)
        center_y = int(window_size[1] / 2)
        # mentions_list_1 = []
        for m in mentions_list_1:
            mention = m['mention_text']

            clientRect = driver.execute_script(
                "function printMousePos(event){console.log('CLICK X',event.offsetX);console.log('CLICK Y',event.offsetY);}"
                "document.addEventListener('click', printMousePos);"
                "var elements = document.getElementsByClassName('MuiTypography-root MuiTypography-h4 css-ghfc2d').item(0).children;"
                "console.log('element',elements);"
                "window.getSelection().removeAllRanges();"

                "var element = elements.item(elements.length - 1).children.item(0).children.item(0);"
                # "element.click();"
                "console.log('element',element);"
                "var testo = element.innerHTML;"
                "console.log('element',testo);"

                "var textNode = element.childNodes[0];"
                "console.log('element',textNode);"

                "var ind = testo.indexOf(arguments[0]);"
                "console.log('element',ind);"

                "var range = document.createRange();"
                "range.setStart(textNode, ind);"
                "range.setEnd(textNode, (ind + (arguments[0]).length));"
                "console.log('start',range.startOffset,range.endOffset);"
                "console.log('start',range.toString());"
                "const clientRect = range.getBoundingClientRect();"
                "window.getSelection().addRange(range);"
                "console.log('INDICE',window.getSelection().toString());"
                "window.scrollTo(clientRect['x'], clientRect['y']);"
                "return clientRect", mention

            )
            time.sleep(0.5)

            if clientRect['height'] < 30:
                action.move_to_element(body1).move_by_offset((-center_x+clientRect['x']+20),(-center_y+clientRect['y']+20)).click().perform()
            else:
                action.move_to_element(body1).move_by_offset((-center_x+clientRect['x']+20),(-center_y+clientRect['y']+40)).click().perform()

            self.clicks += 1
            # spanel = driver.find_element(by=By.XPATH,value="//div[@class='jss510 jss515']/div[@class='jss511']/span")
            spanels = driver.find_elements(by=By.XPATH, value="//span[text()='" + mention + "']")

            if (mention == 'ERdj3'):
                wrong_err = driver.find_elements(by=By.XPATH, value="//span[text()='3 and']")
                spanels.extend(wrong_err)
            locations = [x.location for x in spanels]
            y_loc = [x['y'] for x in locations]
            x_loc = [x['x'] for x in locations]
            y_max = max(y_loc)
            x_max = max(x_loc)
            y_loc_max = [x for x in y_loc if x == y_max]
            if len(y_loc_max) == 1:
                spanel = spanels[y_loc.index(y_loc_max[0])]
            else:
                max_x = None
                spanel = None
                for i in range(len(y_loc)):
                    if y_loc[i] == y_max:
                        if max_x is None:
                            max_x = x_loc[i]
                        else:
                            if x_loc[i] > max_x:
                                max_x = x_loc[i]
                if max_x is not None and spanel is None:
                    spanel = spanels[x_loc.index(max_x)]


            # spanel = driver.find_elements(by=By.XPATH,value="//span[text()='"+mention+"']")[-1]
            idspan = spanel.find_element(by=By.XPATH,value='../../..').get_attribute('id')
            mapper[idspan] = m
            action.move_to_element(spanel).perform()
            time.sleep(0.8)
            # divel = driver.find_element(by=By.XPATH,value="//div[@class='jss510 jss515']/div[@class='jss512 jss516']")
            divel = spanel.find_element(by=By.XPATH,value='../../div[1]/div')
            driver.execute_script("arguments[0].scrollIntoView();", spanel)

            action.move_to_element(divel).click().perform()
            time.sleep(0.5)
            action.move_to_element(divel).send_keys(Keys.DOWN).perform()
            self.clicks += 1
            # driver.execute_script("arguments[0].scrollIntoView();", spanel)
            area = m['area'].lower()
            if area == 'gene':
                action.move_to_element(divel).send_keys(Keys.DOWN).perform()
            action.move_to_element(divel).send_keys(Keys.ENTER).perform()

            # time.sleep(0.5)
            action.move_to_element(spanel).click().perform()
            self.clicks += 1

            # time.sleep(0.5)
        # relationships
        ind = 1
        # relationships_list = []
        reltrees = driver.find_element(by=By.ID,value='relations-tree')
        relationships_list = []
        for relation in relationships_list:
            subject_mention = [relation['subject_start'],relation['subject_stop'],relation['subject_mention_text']]
            object_mention = [relation['object_start'],relation['object_stop'],relation['object_mention_text']]
            subject_id = ''
            object_id = ''
            for key,value in mapper.items():
                if value['start'] == subject_mention[0] and value['stop'] == subject_mention[1]:
                    subject_id = key

                if value['start'] == object_mention[0] and value['stop'] == object_mention[1]:
                    object_id = key
                if object_id != '' and subject_id != '':
                    break

            subjectel = driver.find_element(by=By.ID, value=subject_id)
            action.move_to_element(subjectel).perform()
            time.sleep(0.5)
            subel =subjectel.find_element(by=By.XPATH,value='./div[1]/div[1]')
            action.move_to_element(subel).perform()

            subelid =subel.get_attribute('class')
            driver.execute_script("arguments[0].scrollIntoView();", subel)

            arr = driver.execute_script(
                "var source = document.getElementsByClassName(arguments[0]).item(0);"
                "var target = document.getElementById(arguments[1]); "
                "return [source,target];  "
                ,subelid,"relations-tree")

            driver.execute_script(
                "function createEvent(typeOfEvent) {\n" + "var event =document.createEvent(\"CustomEvent\");\n"
                + "event.initCustomEvent(typeOfEvent,true, true, null);\n" + "event.dataTransfer = {\n" + "data: {},\n"
                + "setData: function (key, value) {\n" + "this.data[key] = value;\n" + "},\n"
                + "getData: function (key) {\n" + "return this.data[key];\n" + "}\n" + "};\n" + "return event;\n"
                + "}\n" + "\n" + "function dispatchEvent(element, event,transferData) {\n"
                + "if (transferData !== undefined) {\n" + "event.dataTransfer = transferData;\n" + "}\n"
                + "if (element.dispatchEvent) {\n" + "element.dispatchEvent(event);\n"
                + "} else if (element.fireEvent) {\n" + "element.fireEvent(\"on\" + event.type, event);\n" + "}\n"
                + "}\n" + "\n" + "function simulateHTML5DragAndDrop(element, destination) {\n"
                + "var dragStartEvent =createEvent('dragstart');\n" + "dispatchEvent(element, dragStartEvent);\n"
                + "var dropEvent = createEvent('drop');\n"
                + "dispatchEvent(destination, dropEvent,dragStartEvent.dataTransfer);\n"
                + "var dragEndEvent = createEvent('dragend');\n"
                + "dispatchEvent(element, dragEndEvent,dropEvent.dataTransfer);\n" + "}\n" + "\n"
                + "var source = arguments[0];\n" + "var destination = arguments[1];\n"
                + "simulateHTML5DragAndDrop(source,destination);", subel, arr[1])
            self.clicks += 1
            time.sleep(0.3)
            elem_foot = driver.find_element(by=By.XPATH,value="//div[@class='tree']["+str(relationships_list.index(relation)+1)+"]//div[@class='css-1vp7zg-footerDropTarget']")
            predicate_elem = driver.find_elements(by=By.XPATH,value="//div[@class='MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-true css-9l09js']")
            pred = None
            for p in predicate_elem:
                if p.text.lower() == relation['predicate_concepts'][0]['concept_name'].lower():
                    p.click()
                    pred = p
                    self.clicks += 1
                    break
            if pred is not None:
                driver.execute_script("arguments[0].scrollIntoView();", pred)

                driver.execute_script(
                    "function createEvent(typeOfEvent) {\n" + "var event =document.createEvent(\"CustomEvent\");\n"
                    + "event.initCustomEvent(typeOfEvent,true, true, null);\n" + "event.dataTransfer = {\n" + "data: {},\n"
                    + "setData: function (key, value) {\n" + "this.data[key] = value;\n" + "},\n"
                    + "getData: function (key) {\n" + "return this.data[key];\n" + "}\n" + "};\n" + "return event;\n"
                    + "}\n" + "\n" + "function dispatchEvent(element, event,transferData) {\n"
                    + "if (transferData !== undefined) {\n" + "event.dataTransfer = transferData;\n" + "}\n"
                    + "if (element.dispatchEvent) {\n" + "element.dispatchEvent(event);\n"
                    + "} else if (element.fireEvent) {\n" + "element.fireEvent(\"on\" + event.type, event);\n" + "}\n"
                    + "}\n" + "\n" + "function simulateHTML5DragAndDrop(element, destination) {\n"
                    + "var dragStartEvent =createEvent('dragstart');\n" + "dispatchEvent(element, dragStartEvent);\n"
                    + "var dropEvent = createEvent('drop');\n"
                    + "dispatchEvent(destination, dropEvent,dragStartEvent.dataTransfer);\n"
                    + "var dragEndEvent = createEvent('dragend');\n"
                    + "dispatchEvent(element, dragEndEvent,dropEvent.dataTransfer);\n" + "}\n" + "\n"
                    + "var source = arguments[0];\n" + "var destination = arguments[1];\n"
                    + "simulateHTML5DragAndDrop(source,destination);", pred, elem_foot)
                self.clicks += 1
            time.sleep(0.3)
            subjectel = driver.find_element(by=By.ID, value=object_id)
            action.move_to_element(subjectel).perform()

            subel = subjectel.find_element(by=By.XPATH, value='./div[1]/div[1]')
            action.move_to_element(subel).perform()
            elem_foot = driver.find_elements(by=By.XPATH,value="//div[@class='tree']["+str(relationships_list.index(relation)+1)+"]//div[@class='css-1vp7zg-footerDropTarget']")
            elem_foot = elem_foot[-1]
            driver.execute_script("arguments[0].scrollIntoView();", elem_foot)

            driver.execute_script(
                "function createEvent(typeOfEvent) {\n" + "var event =document.createEvent(\"CustomEvent\");\n"
                + "event.initCustomEvent(typeOfEvent,true, true, null);\n" + "event.dataTransfer = {\n" + "data: {},\n"
                + "setData: function (key, value) {\n" + "this.data[key] = value;\n" + "},\n"
                + "getData: function (key) {\n" + "return this.data[key];\n" + "}\n" + "};\n" + "return event;\n"
                + "}\n" + "\n" + "function dispatchEvent(element, event,transferData) {\n"
                + "if (transferData !== undefined) {\n" + "event.dataTransfer = transferData;\n" + "}\n"
                + "if (element.dispatchEvent) {\n" + "element.dispatchEvent(event);\n"
                + "} else if (element.fireEvent) {\n" + "element.fireEvent(\"on\" + event.type, event);\n" + "}\n"
                + "}\n" + "\n" + "function simulateHTML5DragAndDrop(element, destination) {\n"
                + "var dragStartEvent =createEvent('dragstart');\n" + "dispatchEvent(element, dragStartEvent);\n"
                + "var dropEvent = createEvent('drop');\n"
                + "dispatchEvent(destination, dropEvent,dragStartEvent.dataTransfer);\n"
                + "var dragEndEvent = createEvent('dragend');\n"
                + "dispatchEvent(element, dragEndEvent,dropEvent.dataTransfer);\n" + "}\n" + "\n"
                + "var source = arguments[0];\n" + "var destination = arguments[1];\n"
                + "simulateHTML5DragAndDrop(source,destination);", subel, elem_foot)
            self.clicks += 1
            time.sleep(0.3)
            driver.find_element(by=By.XPATH,value="//div[@class='MuiBox-root css-8jm638'][1]").click()

            time.sleep(0.5)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[text()="Submit"]'))
        ).click()
        time.sleep(1)


if __name__ == '__main__':
    teamObj = LightClass('../annotations/concepts/concepts_all.json', '../annotations/relationships/relationships_all.json',
                        15, 1)
    teamObj.full_pipeline('***', 'TestProjectMeta')
