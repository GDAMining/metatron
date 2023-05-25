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


class MetatronClass:

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

    def cur_doc(self):
        element = self.driver.find_element(by=By.XPATH,value='//li[@class="MuiBreadcrumbs-li"]/a[@class="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineHover css-16exlzp"]')
        testo = element.text
        mentions_list = [x for x in self.mentions_list if x['document_id'] == testo]
        relationships_list = [x for x in self.relationships_list if x['document_id'] == testo]
        return mentions_list,relationships_list

    def full_pipeline(self,my_url,name_coll,off=False,min_range=39):
        # z = open('../output/teamtat/output_teamtat.txt','a')

        # time_list = []
        # try:
            for i in range(min_range,51):
                time.sleep(5)
                # f = open('../output/teamtat/output_teamtat_iter.txt', 'a')
                self.activate(my_url,name_coll)
                # if i == 0:
                self.driver.find_element(by=By.XPATH, value='//a[text()="Collections"]').click()
                time.sleep(0.5)
                if not off:
                    self.driver.find_element(by=By.XPATH, value='//div[@class="col-md-8"]/div/div[2]/div/div/div[2]/button[text()="Annotate"]').click()
                else:
                    self.driver.find_element(by=By.XPATH,
                                         value='//div[@class="col-md-8"]/div/div[2]/div/div/div[2]/button[text()="Annotate"]').click()
                time.sleep(0.8)
                total_time = 0
                print('ITERATION ',str(i))
                count = 0
                # ff = open('../output/output_teamtat_doc_'+str(i)+'.txt', 'a')
                while count <15:
                    time.sleep(0.5)
                    self.driver.execute_script("""window.scrollTo(0,0);""")

                    mentions_list_3 = []
                    if not off:
                        ff = open('../output/finali/metatron_on/mentions/output_new_metatron_doc_' + str(i) + '.txt', 'a')
                    else:
                        ff = open('../output/finali/metatron_off/mentions/output_new_metatron_doc_' + str(i) + '.txt', 'a')
                    self.clicks = 0

                    mentions_list,relationships_list = self.cur_doc()
                    doc = mentions_list[0]['document_id']
                    print('doc ', mentions_list[0]['document_id'])

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

                    time.sleep(0.8)
                    self.driver.find_element(by=By.XPATH,value='//button[text()="Delete"]').click()
                    time.sleep(0.3)
                    self.driver.find_element(by=By.XPATH,value='//button[text()="Yes"]').click()
                    time.sleep(0.3)

                    st_it = time.time()
                    self.annotate(mentions_list_3,relationships_list)
                    self.clicks += 1
                    end_it = time.time() - st_it
                    print(end_it)
                    total_time += end_it
                    print(total_time)
                    ff.write("iteration_" + str(i) + '\t' + doc + '\t' + str(end_it) + '\t' + str(
                        self.clicks)+'\n')
                    time.sleep(2)
                    self.driver.find_elements(by=By.XPATH,
                                              value='//button[@class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall bt css-1j7qk7u"]')[
                        1].click()
                    count+=1


                    # ff.write('\n')
                    # ff.close()
        # except Exception as e:
        #     print(e)
        #     print('ECCEZIONE')




    def full_pipeline1(self, my_url, name_coll):
        z = open('../output/output_metatron.txt', 'a')
        time_list = []
        for i in range(2):
            st = time.time()
            self.activate(my_url, name_coll)
            # if i == 0:
            # current_x, current_y = self.getcurclick()

            count = 0
            while count < 2:
                # mentions_list, relationships_list = self.cur_doc()
                relationships_list = []

                self.annotate(self.mentions_list, self.relationships_list)
                self.driver.find_elements(by=By.XPATH, value='//button[@class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall bt css-1j7qk7u"]')[1].click()
                self.clicks += 1

                count += 1

            elapsed = time.time() - st
            time_list.append(elapsed)
            z.write("iteration_" + str(i) + '\t' + str(elapsed))
            i += 1
        avg = sum(time_list) / len(time_list)
        standard = statistics.stdev(time_list)
        var = statistics.variance(time_list)
        z.write('\n\n\n')
        z.write('mean' + '\t' + str(avg))
        z.write('st dev' + '\t' + str(standard))
        z.write('variance' + '\t' + str(var))

    def activate(self, my_url, name_coll):
        self.driver.get(my_url)
        # logout and login
        time.sleep(1)

        self.driver.find_element(by=By.XPATH, value="//*[@name='username']").send_keys('***')
        self.driver.find_element(by=By.XPATH, value="//*[@name='password']").send_keys('***')
        time.sleep(1)
        ele = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[text()="Log In"]'))
        )
        ele.click()
        time.sleep(1)
        try:
            self.driver.maximize_window()
        except:
            pass

        time.sleep(1)

    def annotate(self, mentions_list, relationships_list):
        mapper = {}
        driver = self.driver
        elem = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//div[@class="tab tab_value"]/span[@id="abstract_value"]'))
        )
        mentions_list_1 = mentions_list
        st = time.time()
        action = ActionChains(driver)
        body1 = driver.find_element(by=By.XPATH, value='//body')
        window_size = driver.execute_script("return [window.innerWidth, window.innerHeight];")

        # calculate center position
        center_x = int(window_size[0] / 2)
        center_y = int(window_size[1] / 2)
        print(len(mentions_list_1))
        for m in mentions_list_1:
            mention = m['mention_text']
            time.sleep(0.2)
            # if mention.lower().startswith('stat'):
            #     breakpoint()
            clientRect = driver.execute_script(
                "function printMousePos(event){console.log('CLICK X',event.offsetX);console.log('CLICK Y',event.offsetY);}"
                "document.addEventListener('click', printMousePos);"
                "var elements = document.getElementById('abstract_value').getElementsByClassName('no_men');"
                "console.log('element',elements);"
                "window.getSelection().removeAllRanges();"

                "var element = elements.item(elements.length - 1);"
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

                "return clientRect", mention

            )
            time.sleep(0.3)
            # print(clientRect)
            # driver.find_element(by=By.XPATH,value='//span[@class="test"]').click()
            if clientRect['height'] < 30:
                action.move_to_element(body1).move_by_offset((-center_x + clientRect['x'] + 20),
                                                             (-center_y + clientRect['y'] + 20)).click().perform()
            else:
                action.move_to_element(body1).move_by_offset((-center_x + clientRect['x'] + clientRect['width']),
                                                             (-center_y + clientRect['y'] + 20)).click().perform()
            # action.move_to_element(body1).move_by_offset((-center_x+clientRect['x']+10),(-center_y+clientRect['y']+10)).click().perform()
            time.sleep(0.4)
            el = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//div[@class="mention_'+str(mentions_list_1.index(m))+' men"]'))
            )
            driver.execute_script("arguments[0].scrollIntoView();", el)

            time.sleep(0.2)
            last_mention = driver.find_element(by=By.XPATH,value='//div[@class="mention_'+str(mentions_list_1.index(m))+' men"]')
            self.clicks += 1
            # time.sleep(0.2)
            action.move_to_element(last_mention).key_down(Keys.CONTROL).click().key_up(Keys.CONTROL).perform()
            self.clicks +=1
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//input[@class="MuiOutlinedInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2"]'))
            )
            time.sleep(0.2)
            area = m['area']
            url = m['concept_name']
            areael = driver.find_elements(by=By.XPATH,value='//input[@class="MuiOutlinedInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2"]')

            driver.find_elements(by=By.XPATH,value='//input[@class="MuiOutlinedInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2"]')[1].send_keys(url)
            # time.sleep(0.2)
            action.move_to_element(areael[1]).send_keys(Keys.ARROW_DOWN,Keys.ENTER).perform()
            self.clicks += 2
            time.sleep(0.2)

            driver.find_elements(by=By.XPATH,value='//*[text()="Confirm"]')[0].click()
            self.clicks += 1
            time.sleep(0.5)

        ind = 1
        relationships_list = []
        for relation in relationships_list:
            time.sleep(0.8)
            subject_mention = [relation['subject_start'],relation['subject_stop'],relation['subject_mention_text']]
            object_mention = [relation['object_start'],relation['object_stop'],relation['object_mention_text']]
            subject_ind = -1
            object_id = -1
            subject_el = None
            object_el = None
            for concept in mentions_list_1:
                if concept['mention_text'] == subject_mention[2] and concept['start'] == subject_mention[0]:
                    subject_ind = mentions_list_1.index(concept)
                    subject_el = driver.find_element(by=By.XPATH, value='//div[@class="mention_' + str(
                        subject_ind) + ' men"]')
                if concept['mention_text'] == object_mention[2] and concept['start'] == object_mention[0]:
                    object_ind = mentions_list_1.index(concept)

                if subject_el is not None and object_el is not None:
                    break
            driver.execute_script("arguments[0].scrollIntoView();", subject_el)
            action.move_to_element(subject_el).key_down(Keys.SHIFT).click().key_up(Keys.SHIFT).perform()
            self.clicks += 1
            time.sleep(0.2)

            object_el = driver.find_element(by=By.XPATH,
                                            value='//span[@class="mention_span"]/div/div/div[@class="mention_' + str(
                                                object_ind) + ' men"]')
            # driver.execute_script("arguments[0].scrollIntoView();", object_el)

            action.move_to_element(object_el).context_click().perform()
            action.move_to_element(object_el).send_keys(Keys.ARROW_DOWN,Keys.ARROW_DOWN,Keys.ENTER).perform()
            time.sleep(0.3)
            self.clicks += 2
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH,
                     '//span[text()="Add predicate"]'))
            ).click()
            # driver.find_element(by=By.XPATH,value='//span[text()="Add predicate"]').click()
            self.clicks += 1
            area = relation['predicate_concepts'][0]['concept_area']
            url = relation['predicate_concepts'][0]['concept_name']
            # url = 'Oncogene'

            areael = driver.find_elements(by=By.XPATH,value='//input[@class="MuiOutlinedInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2"]')
            areael[0].send_keys(area)
            time.sleep(0.2)
            action.move_to_element(areael[0]).send_keys(Keys.ARROW_DOWN,Keys.ENTER).perform()
            self.clicks += 2
            time.sleep(0.2)

            driver.find_elements(by=By.XPATH,value='//input[@class="MuiOutlinedInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2"]')[1].send_keys(url)
            time.sleep(0.2)
            action.move_to_element(areael[1]).send_keys(Keys.ARROW_DOWN,Keys.ENTER).perform()
            self.clicks += 2
            time.sleep(0.2)

            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH,
                     '//div[@class="MuiDialogActions-root MuiDialogActions-spacing css-14b29qc"]/button[2]'))
            ).click()
            # driver.find_element(by=By.XPATH,value='//div[@class="MuiDialogActions-root MuiDialogActions-spacing css-14b29qc"]/button[2]').click()
            # time.sleep(0.3)

            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//button[@class="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root  css-1hw9j7s"]'))
            ).click()
            # driver.find_element(by=By.XPATH,value='//button[@class="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root  css-1hw9j7s"]').click()
            time.sleep(0.2)
            self.clicks += 2



if __name__ == '__main__':
    teamObj = MetatronClass('../annotations/concepts/concepts_all.json', '../annotations/relationships/relationships_all.json',
                        15, 1)
    teamObj.full_pipeline('https://metatron.dei.unipd.it/loginPage', 'TestProjectMeta')
