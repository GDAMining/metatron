import operator
# from utils_p_references import *
from RelAnno_App.pdf_parser.utils.utils_parser_general import *
import re
import fitz
import unidecode


def get_keywords(doc,start, end, to_keep, title, abstract):
    # start,end, to_keep,title,abstract = get_start_page(doc)
    keywords_list = []
    if start:
        page = doc.load_page(start)
    # for el in to_keep:
    #     if 'keywords' == el[1].lower() or 'keywords' in ''.join(el[1].split()):
    #         indice_k = to_keep.index(el)

        keyword = page.search_for("keywords")

        keywords_list = []
        # print(keyword)
        key_tmp = []
        if keyword != []:
            blocks = page.get_text('blocks')
            # print(blocks[2][4])
            keywords_block = ''
            for el in blocks:
                if el[0] <= keyword[0].x0 <= el[2] and el[0] <= keyword[0].x1 <= el[2] and el[1] <= keyword[0].y0 <= el[3] and el[1] <= keyword[0].y1 <= el[3]:
                    # print(blocks.index(el))
                    keywords_block = blocks.index(el)
                    break
            # print(blocks[keywords_block][4])

            if keywords_block != '':
                key_tmp.append(blocks[keywords_block][4].replace('\n','  ').strip())
            # print(key_tmp)
            k = key_tmp[0]

            res = re.sub(r'[^\w\s]', '  ', k)
            # print(res)

            if len(re.split('\s\s+',res)) > 0:
                keywords_list = re.split('\s\s+',res)
            else:
                keywords_list = re.split('\s{4}', res)
            # print(keywords_list)
            # keywords_list = re.split('\s\s+',res)


            if 'keywords' in keywords_list:
                keywords_list.remove('keywords')
            if 'Keywords' in keywords_list:
                keywords_list.remove('Keywords')
            if '' in keywords_list:
                keywords_list.remove('')
            # deletions = []
            # for el in range(1,len(keywords_list)):
            #     if keywords_list[el][0].islower():
            #         keywords_list[el-1] = keywords_list[el-1] + ' ' + keywords_list[el]
            #         deletions.append(keywords_list[el])
            # for el in deletions:
            #     keywords_list.remove(el)

    return keywords_list


# def define_lines_structure(doc,type,page = None):
#     lines = []
#     lines_to_exclude1,lines_to_exclude2 = lines_to_exclude(doc)
#     page_ref, block_ref, end_page, end_block = get_references_block(doc,lines_to_exclude1,lines_to_exclude2)
#     if type == 't':
#         start = 0
#         end = page_ref+1
#
#     elif type == 'r':
#         start = page_ref
#         end = end_page
#     else:
#         start = 0
#         end = len(doc)
#
#     if page is not None:
#         start = page
#         end = page + 1
#
#     for p in range(start,end):
#         page = doc.load_page(p)
#
#         blocks = page.get_text('blocks')
#         if p == page_ref:
#             if type == 't':
#                 end_b = block_ref
#                 start_b = 0
#             elif type == 'r':
#                 start_b = block_ref
#                 end_b = len(blocks)
#         else:
#             start_b = 0
#             end_b = len(blocks)
#
#         for b in blocks[start_b:end_b]:
#             testo = b[4]
#             lin = testo.split('\n')
#             lines.extend(lin)
#
#     new_lines = []
#     for line in lines:
#         if line != '':
#             new_lines.append(line)
#     i = 0
#     while i < len(new_lines) - 1:
#         line = new_lines[i]
#         line = re.sub('\t', '', line)
#         print(line)
#         next_line = new_lines[i+1]
#         next_line = re.sub('\t', '', next_line)
#         words = line.split()
#         words_next = next_line.split()
#
#         if len(words) > 1 and (words[-1].startswith('http') or words[-1].startswith('doi')):
#             new_lines[i] = line + words_next[0]
#         elif len(words) == 1 and ('http' in words[0] or 'doi:' in words[0]):
#             new_lines[i] = line + words_next[0]
#         i = i + 1
#
#     return new_lines


# def get_urls(doc,type = None,page = None):
#     new_lines = define_lines_structure(doc,type,page)
#
#     urls = []
#     for line in new_lines:
#         print(line)
#         print(''.join(line.split()))
#         l = re.search("(?P<url>https?://[^\s]+)", line)
#         if l is not None:
#             u = l.group("url")
#             urls.extend([u])
#     # print(urls)
#     return urls
#
#
# def get_doi_list(doc,type,page = None):
#     new_lines = define_lines_structure(doc,type,page)
#     # new_lines = ['10.1016.12.31/nature.S0735-1097(98)2000/12/31/34:7-7']
#     dois = []
#     for line in new_lines:
#         l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', line)
#         if l is not None:
#             u = l.group()
#             dois.extend([u])
#     for u in dois:
#         point_words =  u.split('.')
#         slash_words =  u.split('/')
#         if all(not char.isdigit() for char in point_words[-1]) and len(point_words[-1]) >= 3 and point_words[-1][0].isupper():
#             # print(urls[urls.index(u)])
#             # print(point_words[-1])
#             new_el = '.'.join(point_words[:-1])
#             # print(new_el)
#             # print('\n')
#             dois[dois.index(u)] = new_el
#         if all(not char.isdigit() for char in slash_words[-1]) and len(slash_words[-1]) >= 3 and slash_words[-1][0].isupper():
#             # print(urls[urls.index(u)])
#             # print(slash_words[-1])
#             new_el = '.'.join(slash_words[:-1])
#             # print(new_el)
#             # print('\n')
#             dois[dois.index(u)] = new_el
#     return dois

def get_abstract_and_title(doc):
    start, end, to_keep,title,abstract = get_start_page(doc)
    abstract_dict = {}
    if abstract and abstract != [] :
        abstract_dict['blocks'] = abstract[0]
        abstract_dict['page'] = abstract[-1]
        abstract_dict['size'] = abstract[2]
        abstract_dict['words_count'] = abstract[3]
        abstract_dict['text'] = abstract[1]
    else:
        abstract_dict['blocks'] = []
        abstract_dict['page'] = ''
        abstract_dict['size'] = ''
        abstract_dict['words_count'] =''
        abstract_dict['text'] = ''

    return start, end, to_keep,title,abstract_dict





def get_abstract(doc):

    start, end, to_keep = get_start_page(doc)
    page = doc.load_page(start)
    blocks_text = page.get_text('blocks')
    blocks_dict = page.get_text('dict')['blocks']
    blocks_dict = page.get_text('blocks')
    # to_keep = define_line_length_abs_page(doc,start,[len(blocks_dict)-1])
    # min_size = min([el[2] for el in to_keep])
    # abstract_possible = [el for el in to_keep if 80 <= el[3] <= 300]
    # if abstract_possible == []:
    #     abstract_possible = [el for el in to_keep if 80 <= el[3]]
    # abstract_possible = sorted(abstract_possible, key = lambda el: el[3], reverse=True)
    abstract = []
    font, size = get_main_content_font_and_size(doc)
    found_start = False
    while not found_start:
        for el in range(1, len(to_keep)):
            print(to_keep[el][2], size)
            print(to_keep[el][4], font)
            print(to_keep[el][1])

            if to_keep[el][2] == size and to_keep[el][4] == font:
                for element in reversed(to_keep[0:el]):
                    if element[3] >= 80:
                        found_start = True
                        abstract = element
                        break
                if found_start:
                    break

    # for el in to_keep:
    #     if el[3] >= 80:
    #         # print(el)
    #         abstract = el
    #         break

    abstract_dict = {}
    abstract_dict['blocks'] = abstract[0]
    abstract_dict['page'] = start
    abstract_dict['size'] = abstract[2]
    abstract_dict['words_count'] = abstract[3]
    abstract_dict['text'] = ''
    for i in abstract[0]:
        arr = abstract[0][abstract[0].index(i):]

        block = blocks_text[i]
        abstract_dict['text'] = block[4].replace('\n',' ') if abstract_dict['text'] == '' else abstract_dict['text'] + ' ' + block[4].replace('\n',' ')

        if block[4].replace('\n',' ').startswith('abstract'):
            abstract_dict['text'] = abstract_dict['text'].split('abstract')[1].strip()
            abstract_dict['blocks'] = arr
        if block[4].replace('\n', ' ').startswith('Abstract'):
            abstract_dict['text'] = abstract_dict['text'].split('Abstract')[1].strip()
            abstract_dict['blocks'] = arr

    # print(abstract_dict)
    return abstract_dict


def get_title(doc):
    # to_keep = group_font_size_blocks(doc)
    abstract_dict = get_abstract(doc)

    p = abstract_dict['page']
    search_titles = define_line_length_abs_page(doc, abstract_dict['page'], abstract_dict['blocks'])


    search_titles = sorted(search_titles, key=lambda x: x[2], reverse=True)
    title_text = search_titles[0][1]
    title_blocks = search_titles[0][0]
    title_blocks = sorted(set(title_blocks), key=title_blocks.index)
    return title_text, title_blocks, p


def get_authors1(doc):
    title = get_title(doc)
    abstract_dict = get_abstract(doc)
    to_keep = define_line_length_abs_page(doc, abstract_dict['page'], abstract_dict['blocks'])
    p = abstract_dict['page']
    page = doc.load_page(p)

    block_t = title[1]
    blocks_dict = page.get_text('dict')['blocks']

    auth_index_to_keep = 0
    ind_tit = to_keep.index([item for item in to_keep if block_t == item[0]][0])

    # print(to_keep[ind_tit +1])

    size_auth = to_keep[ind_tit+1][2]
    font_auth = to_keep[ind_tit+1][-1]
    block_auth = to_keep[ind_tit+1][0]

    final = to_keep[ind_tit+1][1]
    final_auth_str = ''
    final_auth_str_raw = ''
    for bl in block_auth:
        block_dict = blocks_dict[bl]
        lines = block_dict.get('lines',[])
        for line in lines:
            spans = line.get('spans',[])
            for span in spans:
                final_auth_str_raw = span['text'] if final_auth_str_raw == '' else final_auth_str_raw + ' ' + span['text']
                if span['size'] == size_auth and span['text'] in final:
                    final_auth_str = span['text'] if final_auth_str == '' else final_auth_str + ' ' + span['text']
    new_auth = []

    if ',' in final_auth_str:
        auth_list = final_auth_str.split(',')
        auth_list = [el.strip() for el in auth_list]
        for el in auth_list:
            re.sub(' +', ' ',el)
            if ' and ' in el:
                new_auth.extend(el.split(' and '))

            elif ' & ' in el:
                new_auth.extend(el.split(' & '))
            else:
                new_auth.extend([el])

        final_auth_str = ', '.join(new_auth)
    elif ';' in final_auth_str:
        auth_list = final_auth_str.split(';')
        auth_list = [el.strip() for el in auth_list]
        new_auth = []
        for el in auth_list:
            re.sub(' +', ' ',el)
            if ' and ' in el:
                new_auth.extend(el.split(' and '))

            elif ' & ' in el:
                new_auth.extend(el.split(' & '))
            else:
                new_auth.extend([el])
        final_auth_str = ', '.join(new_auth)

    elif ' & ' in final_auth_str:
        new_auth = final_auth_str.split(' & ')
        new_auth = [el.strip() for el in new_auth]
        final_auth_str = ', '.join(new_auth)
    elif ' and ' in final_auth_str:
        new_auth = final_auth_str.split(' and ')
        new_auth = [el.strip() for el in new_auth]
        final_auth_str = ', '.join(new_auth)

    new_auth = [el.strip() for el in new_auth]
    return final_auth_str,new_auth


def get_authors(doc,start, end, to_keep, title, abstract):
    final_auth_str, new_auth = '',[]

    if end != False and to_keep != False and title != False and abstract != False:
        page = doc.load_page(start)

        block_t = title[0]
        blocks_dict = page.get_text('dict')['blocks']

        auth_index_to_keep = 0
        title1 = [item for item in to_keep if block_t == item[0]][0]
        title = title[:-1]
        ind_tit = to_keep.index(tuple(title))

        # print(to_keep[ind_tit +1])
        count_words = 0
        j = ind_tit
        words = ['']
        while count_words < 2 or all(len(x) < 3 for x in words):
            j += 1
            count_words = len(to_keep[j][1].split())
            words = to_keep[j][1].split()
            size_auth = to_keep[j][2]
            font_auth = to_keep[j][-1]
            block_auth = to_keep[j][0]


        final = to_keep[j][1].strip()
        final_auth_str = ''
        final_auth_str_raw = ''
        for bl in block_auth:
            block_dict = blocks_dict[bl]
            lines = block_dict.get('lines',[])
            for line in lines:
                spans = line.get('spans',[])
                for span in spans:
                    final_auth_str_raw = span['text'] if final_auth_str_raw == '' else final_auth_str_raw + ' ' + span['text']
                    if span['size'] == size_auth and span['text'].strip() in final:
                        final_auth_str = span['text'] if final_auth_str == '' else final_auth_str + ' ' + span['text']
        new_auth = []

        if ',' in final_auth_str:
            auth_list = final_auth_str.split(',')
            auth_list = [el.strip() for el in auth_list]
            for el in auth_list:
                re.sub(' +', ' ',el)
                if 'and ' in el:
                    new_auth.extend([el.split('and ')[1]])
                    new_auth.extend([el.split('and ')[0]])


                elif '& ' in el:
                    new_auth.extend([el.split('& ')[0]])
                    new_auth.extend([el.split('& ')[1]])
                else:
                    new_auth.extend([el])

            final_auth_str = ', '.join(new_auth)
        elif ';' in final_auth_str:
            auth_list = final_auth_str.split(';')
            auth_list = [el.strip() for el in auth_list]
            new_auth = []
            for el in auth_list:
                re.sub(' +', ' ',el)
                if 'and ' in el:
                    new_auth.extend([el.split('and ')[0]])
                    new_auth.extend([el.split('and ')[1]])

                elif '& ' in el:
                    new_auth.extend([el.split('& ')[0]])
                    new_auth.extend([el.split('& ')[1]])
                else:
                    new_auth.extend([el])
            final_auth_str = ', '.join(new_auth)

        elif ' & ' in final_auth_str:
            new_auth = final_auth_str.split(' & ')
            new_auth = [el.strip() for el in new_auth]
            final_auth_str = ', '.join(new_auth)
        elif ' and ' in final_auth_str:
            new_auth = final_auth_str.split(' and ')
            new_auth = [el.strip() for el in new_auth]
            final_auth_str = ', '.join(new_auth)
        elif final_auth_str != '' and new_auth == []:
            new_auth.append(final_auth_str)

        new_auth = [el.strip() for el in new_auth if el != '']

    auth_to_ret = new_auth
    if new_auth != []:
        auth_to_ret = []
        for author in new_auth:
            author = ''.join([i for i in author if not i.isdigit()])
            author = author.strip()
            auth_words = author.split()
            if len(auth_words) > 1  :
                auth_to_ret.append(author)

        if auth_to_ret == []:
            auth_to_ret = new_auth
    return final_auth_str,auth_to_ret



def get_authors_new(doc,start, end, to_keep, title, abstract):
    final_auth_str, new_auth = '',[]

    if end != False and to_keep != False and title != False and abstract != False and abstract['blocks'] != []:
        page = doc.load_page(start)

        block_t = title[0]
        blocks_dict = page.get_text('dict')['blocks']

        auth_index_to_keep = 0
        title1 = [item for item in to_keep if block_t == item[0]][0]
        title = title[:-1]
        ind_tit = 0
        for e in to_keep:
            if e[0] == title[0] and e[1] in title[1] and e[2] == title[2] and e[3] == title[3] and e[4] == title[4]:
                ind_tit = to_keep.index(e)
        # ind_tit = to_keep.index(tuple(title))
        block_auth = []
        # print(to_keep[ind_tit +1])
        count_words = 0
        j = ind_tit
        words = ['']
        while j+1 < len(to_keep) and (count_words < 2 or all(len(x) < 3 for x in words) or (to_keep[j][0][-1] == block_t[-1] and j+1 < len(to_keep))):
            j += 1
            count_words = len(to_keep[j][1].split())
            words = to_keep[j][1].split()
            size_auth = to_keep[j][2]
            font_auth = to_keep[j][-1]
            block_auth.extend(to_keep[j][0])

        for el in to_keep:
            block_num = len(blocks_dict)
            if abstract['blocks'] != [] :
                block_num = abstract['blocks'][0]

            if title[0][-1] < el[0][0] and el[0][-1] < block_num:
                if el[2] == size_auth and font_auth == el[-1]:
                    block_auth.extend(el[0])
            elif el[0][-1] >= abstract['blocks'][0]:
                break

        block_auth = list(set(block_auth))
        block_auth.sort()
        final = to_keep[j][1].strip()
        final_auth_str = ''
        final_auth_str_raw = ''
        for bl in block_auth:
            block_dict = blocks_dict[bl]
            lines = block_dict.get('lines',[])
            for line in lines:
                spans = line.get('spans',[])
                for span in spans:
                    final_auth_str_raw = span['text'] if final_auth_str_raw == '' else final_auth_str_raw + ' ' + span['text']
                    if span['size'] >= size_auth and span['font'] == font_auth:
                        final_auth_str = span['text'] if final_auth_str == '' else final_auth_str + ' ' + span['text']
        new_auth = []

        if ',' in final_auth_str:
            auth_list = final_auth_str.split(',')
            auth_list = [el.strip() for el in auth_list]
            for el in auth_list:
                re.sub(' +', ' ',el)
                if 'and ' in el:
                    new_auth.extend([el.split('and ')[1]])
                    new_auth.extend([el.split('and ')[0]])


                elif '& ' in el:
                    new_auth.extend([el.split('& ')[0]])
                    new_auth.extend([el.split('& ')[1]])
                else:
                    new_auth.extend([el])

            final_auth_str = ', '.join(new_auth)

        if '|' in final_auth_str:
            auth_list = final_auth_str.split('|')
            auth_list = [el.strip() for el in auth_list]
            for el in auth_list:
                re.sub(' +', ' ',el)
                if 'and ' in el:
                    new_auth.extend([el.split('and ')[1]])
                    new_auth.extend([el.split('and ')[0]])


                elif '& ' in el:
                    new_auth.extend([el.split('& ')[0]])
                    new_auth.extend([el.split('& ')[1]])
                else:
                    new_auth.extend([el])

            final_auth_str = ', '.join(new_auth)
        elif ';' in final_auth_str:
            auth_list = final_auth_str.split(';')
            auth_list = [el.strip() for el in auth_list]
            new_auth = []
            for el in auth_list:
                re.sub(' +', ' ',el)
                if 'and ' in el:
                    new_auth.extend([el.split('and ')[0]])
                    new_auth.extend([el.split('and ')[1]])

                elif '& ' in el:
                    new_auth.extend([el.split('& ')[0]])
                    new_auth.extend([el.split('& ')[1]])
                else:
                    new_auth.extend([el])
            final_auth_str = ', '.join(new_auth)

        elif ' & ' in final_auth_str:
            new_auth = final_auth_str.split(' & ')
            new_auth = [el.strip() for el in new_auth]
            final_auth_str = ', '.join(new_auth)
        elif ' and ' in final_auth_str:
            new_auth = final_auth_str.split(' and ')
            new_auth = [el.strip() for el in new_auth]
            final_auth_str = ', '.join(new_auth)
        elif final_auth_str != '' and new_auth == []:
            new_auth.append(final_auth_str)

        new_auth = [el.strip() for el in new_auth if el != '']



    auth_to_ret = new_auth
    if new_auth != []:
        auth_to_ret = []
        for author in new_auth:
            author = ''.join([i for i in author if not i.isdigit()])
            author = author.strip()
            auth_words = author.split()
            if len(auth_words) > 1 and len(auth_words) <= 6 and any(len(x)>1 for x in auth_words):
                auth_to_ret.append(author)


        # if auth_to_ret == []:
        #     auth_to_ret = new_auth

    auth_to_ret = [unidecode.unidecode(el) for el in auth_to_ret]
    for author in auth_to_ret:
        author_new = ''.join([x for x in author if x.isalpha() or x == '.' or x == ' '])
        auth_to_ret[auth_to_ret.index(author)] = author_new

    return final_auth_str,auth_to_ret






if __name__ == '__main__':
    mem_area = '../../pdf_publication/50-doi_dedup_____98ead840b2c35e04b9c9c144fc5c1674.pdf'
    # mem_area = '../test/prova3.pdf'
    doc = fitz.open('../../pdf_publications/50-doi_dedup_____98ead840b2c35e04b9c9c144fc5c1674.pdf')

    abs,tit = get_authors(doc)
    print(abs)
    print(tit)
