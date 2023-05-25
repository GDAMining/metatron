import sys
sys.path.insert(1, '../pdf_parser/utils/')
import urllib3

from RelAnno_App.pdf_parser.utils.utils_parser_general import *
from RelAnno_App.pdf_parser.utils.utils_parser_captions_footnotes import *
# from RelAnno_App.pdf_parser.utils.utils_title_abstract import *
# from .utils.utils_parser_captions_footnotes import *
# from .utils.utils_new_references import *
# from .utils.utils_entire_content import *
import unicodedata
import fitz
import re
import string
import os

class PdfParser:
    def __init__(self,doc):
        self.doc = doc

    # def __init__(self,pdf_url = None, pdf_path = None, pdf_id = None):
    #     pdf_file = ''
    #     self.path = pdf_path
    #     if pdf_path is not None:
    #         pdf_file = pdf_path
    #         self.doc = fitz.open(pdf_file)
    #     elif pdf_id is not None:
    #         url = './download_pdf/'
    #         for file in os.listdir(url):
    #             name = file.split('.pdf')[0]
    #             if name == pdf_id.split('::')[1]:
    #                 final_url = url+name+'.pdf'
    #                 self.doc = fitz.open(final_url)
    #                 break
    #
    #
    #
    #     elif pdf_url is not None:
    #         pdf_file = pdf_url
    #         urllib3.disable_warnings()
    #         fileName = r"./download_pdf/file.pdf"
    #         with urllib3.PoolManager() as http:
    #             r = http.request('GET', pdf_file)
    #             with open(fileName, 'wb') as fout:
    #                 fout.write(r.data)
    #         self.doc = fitz.open(fileName)

        # self.doc = fitz.open(pdf_file)


    # def get_entire_content(self):
    #     return self.get_content(self.doc)
    #
    # def get_entire_content_nornalized(self):
    #     content = self.get_content(self.doc)
    #     return self.normalize_pdf(content)
    #
    # def get_pdf_title(self):
    #     abstract,title = get_abstract_and_title(self.doc)
    #     return title[1]
    #
    # def get_pdf_abstract_and_title(self):
    #     start, end, to_keep,title,abstract_dict = get_abstract_and_title(self.doc)
    #     return start, end, to_keep,title,abstract_dict
    #
    # def get_pdf_authors(self,start, end, to_keep, title, abstract):
    #     authors = get_authors_new(self.doc,start, end, to_keep, title, abstract)
    #     return authors[0]
    # #
    # def get_pdf_abstract(self):
    #     abstract,title = get_abstract_and_title(self.doc)
    #     return abstract
    #
    # def get_pdf_keywords(self,start, end, to_keep, title, abstract):
    #     keywords = get_keywords(self.doc,start, end, to_keep, title, abstract)
    #     return keywords
    #
    # def get_urls_references(self,references):
    #     # urls_list = extract_urls_from_references(self.doc)
    #     urls_list = extract_urls_from_references(references)[0]
    #     return urls_list
    #
    # def get_footnotes_urls(self):
    #     footnotes = self.get_pdf_footnotes()
    #     return extract_urls_from_footnote_captions(footnotes)[0]
    # def get_footnotes_dois(self):
    #     footnotes = self.get_pdf_footnotes()
    #     return extract_dois_from_footnote_captions(footnotes)
    #
    # def get_image_captions_urls(self,figure_captions):
    #     return extract_urls_from_footnote_captions(figure_captions)[0]
    #
    # def get_table_captions_urls(self,tables):
    #     return extract_urls_from_footnote_captions(tables)[0]
    #
    # def get_image_captions_dois(self,figure_captions):
    #     return extract_dois_from_footnote_captions(figure_captions)
    #
    # def get_table_captions_dois(self,tables):
    #     return extract_dois_from_footnote_captions(tables)
    #
    # def get_urls_content(self,urls_to_exclude):
    #     # urls_list = extract_urls_from_references(self.doc)
    #     urls_list = extract_urls_from_text(self.doc,urls_to_exclude)[0]
    #     return urls_list
    #
    # def get_doi_references(self,references):
    #     doi_list = extract_doi_from_references(references)
    #     return doi_list
    #
    # # def get_urls_text(self,ref_urls,capt_urls,foot_urls):
    # #     # urls_list = extract_urls_from_text(self.doc)
    # #     urls_list = extract_urls_from_text(self.doc,ref_urls,capt_urls,foot_urls)
    # #     return urls_list
    #
    # def get_doi_text(self,dois_to_exclude):
    #     # doi_list = extract_doi_from_text(self.doc)
    #     doi_list = extract_dois_from_text(self.doc,dois_to_exclude)
    #     return doi_list
    #
    # def get_sections(self):
    #     return get_sections(self.doc)
    #
    # def get_pdf_references(self):
    #     r = extract_references(self.doc,self.path)
    #     # st = time.time()
    #     # references = extract_references_from_file(self.path)
    #     # r = []
    #     # for ref in references:
    #     #     r.append(ref['raw_ref'])
    #     # end = time.time()
    #     # print(end-st)
    #     return r

    def get_pdf_footnotes(self):
        footnotes = find_footnotes(self.doc)
        return footnotes

    def get_pdf_captions(self):
        captions_images, captions_tables = [],[]

        captions_tables,captions_images = extract_caption(self.doc)

        return captions_tables,captions_images

    def create_final_publication_obj(self):
        obj = get_splitted_content(self.doc)
        # obj = {}
        # references = []
        # start, end, to_keep, title, abstract = self.get_pdf_abstract_and_title()
        #
        # obj['title'] = '' if not title else title[1]
        # # print('TITLE',obj['title'])
        # abs = re.split("abstract", abstract['text'], flags=re.IGNORECASE)
        #
        #
        # if len(abs) > 1:
        #     abs = abs[1]
        #     for i in abs:
        #         if i.isalnum():
        #             ind = abs.index(i)
        #             obj['abstract'] = abs[ind:]
        #             break
        #
        # else:
        #     abs = abs[0]
        #     obj['abstract'] = abs
        #
        # obj['authors'] = self.get_pdf_authors()
        tb,fig = self.get_pdf_captions()
        footnotes =  self.get_pdf_footnotes()
        tb = [el[0] for el in tb]
        fig = [el[0] for el in fig]
        for r in tb:
            for k,v in obj.items():
                if r in v:
                    v = v.replace(r,'')
                    obj[k] = v
        for r in fig:
            for k,v in obj.items():
                if r in v:
                    v = v.replace(r,'')
                    obj[k] = v
        for r in footnotes:
            for k,v in obj.items():
                if r in v:
                    v = v.replace(r,'')
                    obj[k] = v
        obj['tables_captions'] = tb
        obj['image_captions'] = fig
        obj['footnotes'] = footnotes
        #     sections = self.get_sections()
        #     obj['sections'] = sections

        return obj


    @staticmethod
    def get_content(doc):
        content = ''
        content_for_urls = ''
        for p in range(len(doc)):
            page = doc.load_page(p)
            blocks = page.get_text('blocks')
            for b in blocks:
                block_text = b[4].replace('\n', ' ')
                content = block_text if content == '' else content + '\n' + block_text

                block_text = b[4].replace('\n', '')
                content_for_urls = block_text if content_for_urls == '' else content_for_urls + '\n' + block_text

        return content,content_for_urls

    @staticmethod
    def normalize_pdf(pdf_text):
        pdf_text = unicodedata.normalize('NFKD', pdf_text)
        pdf_text = pdf_text.lower()
        # tolgo tutto ciò che non è tra 0 e 9 e tra aA e zZ
        pdf_text = re.sub(r'[\W_]+', ' ', pdf_text)
        # it removes only at the end of the string
        # tengo gli ascii
        pdf_text = re.sub(r'[^\x00-\x7F]+', ' ', pdf_text)
        # tolgo accenti
        pdf_text = u"".join([c for c in pdf_text if not unicodedata.combining(c)])
        # tolgo punctuation
        pdf_text = ' '.join(word.strip(string.punctuation) for word in pdf_text.split())
        # tolgo digits
        pdf_text = re.sub('\d', ' ', pdf_text)
        # tolgo newline
        pdf_text = pdf_text.replace('\n+', ' ')
        pdf_text = pdf_text.strip()
        pdf_text = pdf_text.split()
        # pdf_text.sort()
        pdf_text = ' '.join(pdf_text)
        return pdf_text


import fitz
if __name__ == '__main__':
    doc = fitz.open('./utils/50-doi___________0bc2e6393cd31b6fbead331d0f88d4e9.pdf')
    parser = PdfParser(doc)
    parser.create_final_publication_obj()

# if __name__ == '__main__':
#     # doc = 'prova.pdf'
#     mem_area = 'https://www.nature.com/articles/ncomms11539.pdf'
#     url = mem_area
    # name = 'myfile.pdf'
    #
    # os.system('wget {} -O {}'.format(url, name))

    # s = time.time()
    # urllib3.disable_warnings()
    #
    # fileName = r"./download_pdf/file.pdf"
    # with urllib3.PoolManager() as http:
    #     r = http.request('GET', url)
    #     with open(fileName, 'wb') as fout:
    #         fout.write(r.data)
    # e = time.time()
    # print(e-s)
    # my_raw_data = response.content
    # parser = PdfParser(pdf_url=my_raw_data)
    # title = parser.get_pdf_title()
    # print(title)

