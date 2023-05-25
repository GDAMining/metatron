from RelAnno_App.pdf_parser.utils.utils_parser_general import *
import string
# from utils_p_references import *

def define_line_length_references(doc,page_num, block_num,lines_to_exclude1,lines_to_exclude2):

    start_end_lines = []
    last_block = False
    for p in range(page_num, len(doc)):
        page = doc.load_page(p)
        blocks = page.get_text('blocks')
        blocks_dict = page.get_text('dict')['blocks']

        end = len(blocks)
        if p == page_num:
            start = block_num
        else:
            start = 0
        line_text = ''
        line_size = []
        line_font = []

        x0, x1 = [], []
        # devo fare due linee separate se una stessa citazione è divisa tra più colonne
        for block in blocks_dict[start:end]:
            # if blocks_dict.index(block) == len(blocks) -2:
            #     breakpoint()

            if line_text != '':
                # print(blocks_dict.index(block), p)

                if ((blocks_dict.index(block)-1, p) not in lines_to_exclude2):
                    start_end_lines.append((min(x0), max(x1), line_text, blocks_dict.index(block)-1, p,line_size,line_font))

                line_text = ''
                line_size = []
                line_font = []

                x0, x1 = [], []

            lines = block.get('lines', [])
            if len(lines) > 0:
                current_bbox = lines[0]['bbox']
                for line in lines:
                    # print('current',current_bbox)
                    # print('current',line['bbox'])
                    if not (line['bbox'][1] == current_bbox[1] or line['bbox'][3] == current_bbox[3]):

                        if (blocks_dict.index(block), p) not in lines_to_exclude2:
                            start_end_lines.append(
                                (min(x0), max(x1), line_text, blocks_dict.index(block), p,line_size,line_font))
                        line_text = ''
                        line_size = []
                        line_font = []
                        x0,x1 = [],[]
                        current_bbox = line['bbox']


                    for span in line.get('spans',[]):

                        line_text = span['text'] if line_text == '' else line_text + ' ' + span['text']
                        line_size.append(span['size'])
                        line_font.append(span['font'])
                        x0.append(span['bbox'][0])
                        x1.append(span['bbox'][2])
                        # print(line_text)
        if line_text != '':
            last_block = block
            if ((blocks_dict.index(block), p) not in lines_to_exclude2):
                start_end_lines.append((min(x0), max(x1), line_text, len(blocks)-1, p,line_size,line_font))
    # for el in start_end_lines:
    #     print(el)
    new_lines = []
    for line in start_end_lines:
        el = line[2].strip()
        if el != '':
            line = list(line)
            line[2] = el
            new_lines.append(tuple(line))

    return new_lines

def get_references_block(doc):
    font_corpus, size_corpus = get_main_content_font_and_size(doc)
    start = len(doc) - 1
    block_list = []
    to_ret_page = ''
    to_ret_block = ''
    to_ret_end_block = ''
    to_ret_end_page = ''
    span_sizes = []
    for i in range(len(doc)):
        page = doc.load_page(start-i)
        blocks = page.get_text('dict')['blocks']
        for block in blocks:
            lines = block.get('lines',[])
            for line in lines:
                # line = lines[0]
                spans = line.get('spans',[])

                for span in spans:
                    span_punct = span['text'].translate(str.maketrans('', '', string.punctuation))
                    # if 'references' in span_punct.lower():
                    #     breakpoint()
                    span_punct = ''.join([x for x in span_punct if not x.isdigit()])
                    span_punct = span_punct.strip()
                    if len(span_punct.split()) <= 3 and (span_punct.lower().startswith('references') or span_punct.lower().startswith('literature cited') or span_punct.lower().endswith('references') or span_punct.lower().endswith('literature cited')) :
                        # start - i è la pagina
                        to_ret_page = start - i
                        to_ret_block = blocks.index(block)

                if to_ret_page != '':
                    break
        if to_ret_page != '':
            break

    page_num = to_ret_page
    block_num = to_ret_block
    end_page, end_block = '', ''
    return page_num, block_num


def get_first_line_ref(lines):
    # page = doc.load_page(page_num)
    # blocks = page.get_text('blocks')
    # lines = []
    # found_ref = False
    # for block in blocks[block_num:]:
    #     line_first_block = block[4].split('\n')
    #     for l in block[4].split('\n'):
    #         if not found_ref:
    #             if not (l.lower().startswith('references') or l.lower().startswith('literature cited') or '' == l):
    #                 line_first_block.remove(l)
    #             else:
    #                 line_first_block.remove(l)
    #                 found_ref = True
    #                 break
    #     if found_ref:
    #         lines.extend(line_first_block)


    lines = [el[2].strip() for el in lines if el[2] not in ['',' ','\n']]
    ref_found = False
    line = ''
    for l in lines:
        if ref_found:
            line = l
            break
        if (l.lower().startswith('references') or l.lower().startswith('literature cited')):
            ref_found = True




    words = line.split()
    words = [el.translate(str.maketrans('', '', string.punctuation)) for el in words]
    # print(words)
    first_word = words[0]
    if all(c.isdigit() for c in first_word):
        return True
    return False

def extract_ref_no_num(lines):
    index_ref = 0
    current_ref = ''
    refs = []
    for line in lines:
        line = list(line)
        if (line[2].lower().startswith('references') or line[2].lower().startswith('literature cited')) :
            index_ref = lines.index(tuple(line))
            break
    lines1 = lines[index_ref+1:]
    pages = [el[4] for el in lines1]
    pages = list(set(pages))
    pages.sort()
    lines = [el for el in lines1 if el[4] == pages[0]]
    lines = [line for line in lines if len(line[2])>0]

    s = [round(el[0]) for el in lines]
    e = [round(el[1]) for el in lines]
    line_length = round(e[0]) - round(s[0])
    for page in pages:

        lines = [el for el in lines1 if el[4] == page]
        start_f = [round(el[0]) for el in lines]
        end_f = [round(el[1]) for el in lines]
        # line_length = round(end_f[0]) - round(start_f[0])
        # co = [[round(el[0]),round(el[1])] for el in lines]
        start = []
        end = []
        for i in range(len(start_f)):
            if line_length - 30 < round(end_f[i]) - round(start_f[i]) < line_length + 30:
                start.append(start_f[i])
                end.append(end_f[i])

        start_count = Counter(start)
        end_count = Counter(end)

        # for k,v in start_count.items():
        #     if v == 1:
        #         start.remove(k)

        start1_prev = []
        end1_prev = []
        for el in start:
            ind = start.index(el)
            end_el = end[ind]
            if el not in start1_prev:
                start1_prev.append(el)
                end1_prev.append(end_el)
        start1 = []
        last = start1_prev[-1]
        if len(start1_prev) > 2:
            prev = start1_prev[0]

            next = start1_prev[1]
            last = start1_prev[-1]
            if abs(prev-next) < 30:
                start1.append(prev)

            for ind_start1 in range(1,len(start_count)-1):
                cur = start1_prev[ind_start1]
                next = start1_prev[ind_start1+1]
                prev = start1_prev[ind_start1-1]
                if  (abs(cur -prev) < 30 or abs(cur - next) < 30):
                    start1.append(start1_prev[ind_start1])
            start1.append(last)
        else:
            start1 = start1_prev


        starting_couples = []
        el = 0
        j = 1

        start1.sort()
        while el < len(start1):
            # print(start1[el])
            # print(start1[el + 1])
            cur = [start1[el]]
            el_indexes_start = [i for i in range(len(start)) if start[i] == start1[el]]
            end_selected = [end[i] for i in el_indexes_start]
            # mean end of line
            mean_len = sum(end_selected) / len(end_selected)
            while el < j < len(start1):
                if start1[el] < start1[j] < mean_len:
                    cur.append(start1[j])
                    j += 1
                else:
                    break
            starting_couples.append(cur)
            el += len(cur)
            j = el +1

        start_ref = []
        cont_ref = []
        for el in starting_couples:
            el.sort()
            if len(el) == 1:
                cont_ref.extend([el[0]])
            else:
                start_ref.append(el[0])
                cont_ref.append(el[-1])
                if len(el) > 2:
                    elements_remaining = el[1:-1]
                    for e in elements_remaining:
                        if e == el[0] + 1:
                            start_ref.append(e)
                        else:
                            cont_ref.append(e)








        # start_ref = [el[0] for el in starting_couples if len(el) > 1]
        # cont_ref = []
        # for el in starting_couples:
        #     if len(el) > 1:
        #         cont_ref.extend(el[1:])
        #     elif len(el) == 1:
        #         cont_ref.extend([el[0]])



        if len(start) != len(list(set(start))):


            for el in lines:
                # print(round(el[0]))
                # print(el[2])
                diff = round(el[1]) - round(el[0])
                if diff <= line_length + 30:
                    if round(el[0]) in start_ref:
                        if not (el[2][0].islower() or el[2][0].isdigit()):

                            if current_ref != '':
                                # print(current_ref)
                                refs.append(current_ref)
                            current_ref = el[2]
                    elif round(el[0]) in cont_ref:
                        current_ref = el[2] if current_ref == '' else current_ref + ' ' + el[2]
                        curr_len = len(current_ref)
                        if len(current_ref) > 1000:
                            #skip
                            current_ref = ''
                            # return refs


    if current_ref != '':
        refs.append(current_ref)


    index_to_stop = len(refs)
    for line in refs:
        # refs[refs.index(line)] = line.replace('\t',' ').replace('\r',' ').replace('\n',' ')
        if len(line) > 1000 :
            # print(line)
            # print(len(line))
            index_to_stop = refs.index(line)
            break
    return refs[:index_to_stop]

def extract_ref_num(lines):
    index_ref = -1
    for line in lines:
        line = list(line)
        if (line[2].lower().startswith('references') or line[2].lower().startswith('literature cited')) :
            index_ref = lines.index(tuple(line))
            break
    lines = lines[index_ref+1:]
    lines = [el for el in lines if el[2].strip() != '' and el[2].strip() != '\n']

    cur_ref = ''
    refs = []
    line_text = lines[0][2]
    words = line_text.split()
    words = [el.translate(str.maketrans('', '', string.punctuation)) for el in words]
    words = [el for el in words if el.strip() != '' and el.strip() != '\n']
    cur_ref_num = int(words[0])
    for el in lines[0:]:
        # if lines.index(el) == 89:
        #     breakpoint()
        # print(lines.index(el),el)
        # print(lines.index(el))
        line_text = el[2]
        words = line_text.split()
        words = [el.translate(str.maketrans('', '', string.punctuation)) for el in words]
        words = [el for el in words if el.strip() != '' and el.strip() != '\n']
        if words != [] and  all(c.isdigit() for c in words[0]) and len(words[0]) < 4 :
            cur = int(words[0])
            cur = int(cur)
            # print(cur,type(cur))
            if int(cur_ref_num) <= cur < int(cur_ref_num) + 5:
                # print(words[0])
                if cur_ref != '':
                    # print(cur_ref)
                    # print(len(cur_ref))
                    cur_ref_num = int(words[0])
                    refs.append(cur_ref)
                cur_ref = line_text

        else:
            cur_ref = line_text if cur_ref == '' else cur_ref + '' + line_text
        if len(cur_ref) > 700:
            refs.append(cur_ref)
            break


    if cur_ref != '':
        # print(len(cur_ref))
        refs.append(cur_ref)


    return refs

# from refextract import extract_references_from_file


def extract_references(doc,path = None):
    l, ll = lines_to_exclude(doc)
    page_num, block_num = get_references_block(doc)
    # ref = extract_references_from_file(path)
    try:
        if page_num == '' :
            print('ref paragraph not found, library refs')
            # references =  extract_references_from_file(path)
            r = []
            # for ref in references:
            #     r.append(ref['raw_ref'][0])

            return r

        lines = define_line_length_references(doc,page_num, block_num, l, ll)
        if get_first_line_ref(lines):
            print('my ref num')
            ref = extract_ref_num(lines)
            return ref
        else:
            try:
                print('my ref without num')
                ref = extract_ref_no_num(lines)
                return ref
            except:
                print('exception in my ref no num')
                # references = extract_references_from_file(path)
                r = []
                references = []
                for ref in references:
                    r.append(ref['raw_ref'][0])
                return r
    except:
        refs = ''

        if page_num != '':
            print('ref exception, guess on references')

            for p in range(page_num,len(doc)):
                p = doc.load_page(p)
                blocks = p.get_text('blocks')
                for b in blocks:
                    refs = refs + '\n' + b[4]
            return refs.split('\n')
        print('ref exception, empty references')
        return []

def extract_urls_from_references1(doc):
    ref = extract_references(doc)
    urls = []
    for line in ref:
        url = ''
        for el in line.split():
            if 'http' in el:
                index_http = line.split().index(el)
                for el in line.split()[index_http:]:
                    url = url + el

                    urls.append(url)
    return urls

# def extract_urls_from_references(references):
#
#     urls = []
#     for line in references:
#         url = ''
#         # print(type(line))
#         for el in line.split():
#             if 'http' in el:
#                 index_http = line.split().index(el)
#                 for el in line.split()[index_http:]:
#                     url = url + el
#
#                 urls.append(url)
#     return urls

def extract_urls_from_references(list_ref):
    urls = []
    i = 0
    while i < len(list_ref):
        el =  list_ref[i]
        el = el.replace('\t','').replace('\r','').replace('\n','')
        el = ''.join(el.split())
        if 'http' in el:
            url ='http'+el.split('http')[1]
            # if len(url.split()) > 0:
            #     url = url.split()[0]
            urls.extend([url])
        i += 1

    for url in urls:
        j = len(url)-1
        ind = urls.index(url)
        while j >= 0 and not (url[-1].isalpha() or url[-1].isdigit()):
            url = url[:j]
            j -= 1

        urls[ind] = url

    urls = [url.strip() for url in urls]
    # urls = [url[:-1] for url in urls if not url[-1].isalpha() and not url[-1].isdigit()]
    for url in urls:
        if url.endswith('/'):
            urls[urls.index(url)] = url[:-1]
    urls_filtered = ['/'.join(url.split('/')[2:]) for url in urls]
    for url in urls_filtered:
        j = len(url)-1
        u = url
        ind = urls_filtered.index(url)

        while j >= 0 and not (url[-1].isalpha() or url[-1].isdigit()):
            u = url[:j]

            j -= 1
        urls_filtered[ind] = u
    urls_filtered = [url.strip() for url in urls_filtered]

    # urls_filtered = [url[-1] for url in urls_filtered if not url[-1].isalpha() and not url[-1].isdigit()]
    return urls, urls_filtered


def extract_dois_from_references(list_ref):
    dois = []
    for line in list_ref:
        el = line.replace('\t', '').replace('\r', '').replace('\n', '')
        el = ''.join(el.split())
        l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', el)
        if l is not None:
            u = l.group()
            dois.extend([u])
    return dois

import re
def extract_doi_from_references1(doc):
    ref = extract_references(doc)
    dois = []
    for line in ref:
        l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', line)
        if l is not None:
            u = l.group()
            dois.extend([u])
    for u in dois:
        point_words = u.split('.')
        slash_words = u.split('/')
        if all(not char.isdigit() for char in point_words[-1]) and len(point_words[-1]) >= 3 and point_words[-1][
            0].isupper():
            # print(urls[urls.index(u)])
            # print(point_words[-1])
            new_el = '.'.join(point_words[:-1])
            # print(new_el)
            # print('\n')
            dois[dois.index(u)] = new_el
        if all(not char.isdigit() for char in slash_words[-1]) and len(slash_words[-1]) >= 3 and slash_words[-1][
            0].isupper():
            # print(urls[urls.index(u)])
            # print(slash_words[-1])
            new_el = '.'.join(slash_words[:-1])
            # print(new_el)
            # print('\n')
            dois[dois.index(u)] = new_el
    # print(dois)
    return dois

def extract_doi_from_references(references):
    # ref = extract_references(doc)
    dois = []
    for line in references:
        l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', line)
        if l is not None:
            u = l.group()
            dois.extend([u])
    for u in dois:
        point_words = u.split('.')
        slash_words = u.split('/')
        if all(not char.isdigit() for char in point_words[-1]) and len(point_words[-1]) >= 3 and point_words[-1][
            0].isupper() and u in dois:
            # print(urls[urls.index(u)])
            # print(point_words[-1])
            new_el = '.'.join(point_words[:-1])
            # print(new_el)
            # print('\n')
            dois[dois.index(u)] = new_el
        if all(not char.isdigit() for char in slash_words[-1]) and len(slash_words[-1]) >= 3 and slash_words[-1][
            0].isupper() and u in dois:
            # print(urls[urls.index(u)])
            # print(slash_words[-1])
            new_el = '.'.join(slash_words[:-1])
            # print(new_el)
            # print('\n')
            dois[dois.index(u)] = new_el
    # print(dois)
    return dois


import fitz
if __name__ == '__main__':
    # file = '../../download_pdf/file.pdf'
    file = '../test/prova.pdf'
    doc = fitz.open(file)


    a = extract_doi_from_references(doc)

    for el in a:
        print(el)
        print('\n')


