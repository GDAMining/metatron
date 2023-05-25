import operator
from collections import Counter
from difflib import SequenceMatcher
import Levenshtein
import string
import unidecode

import RelAnno_App.normalizers as norm
ABSTRACT_WORDS = 65
# def get_entire_content(doc):
#     content = ''
#     for p in range(len(doc)):
#         page = doc.load_page(p)
#         blocks = page.get_text('blocks')
#
#         for b in blocks:
#             block_text =  b[4].replace('\n',' ')
#             content = block_text if content == '' else content + '\n' + block_text
#
#     print(content)
#     return content


def compute_max_string(string1, string2):
    match = SequenceMatcher(None, string1, string2).find_longest_match(0, len(string1), 0, len(string2))
    return match.size, string1[match.a: match.a + match.size]


def get_sections(doc):
    font,size = get_main_content_font_and_size(doc)
    lines_final = []
    for i in range(len(doc)):
        page = doc.load_page(i)
        blocks = page.get_text('dict',flags=4)['blocks']
        linee = []
        # escludo tutte righe con size minore o uguale a size
        for block in blocks:
            c = 0
            for line in block.get('lines',[]):
                linea = []
                sizes = []
                fonts = []
                spans = line.get('spans',[])
                testo = []
                if len(spans) > 0:
                    span = spans[0]
                    size_s = span['size']
                    font_s = span['font']
                    last_span = spans[-1]
                    size_ls = last_span['size']
                    font_ls = last_span['font']
                    if not ((size_s <= size and font_s == font) and span['text'] != '\n') and not ((size_ls <= size and font_ls == font) and last_span['text'] != '\n'):
                        for span in line.get('spans',[]):
                            font_s = span['font']
                            size_s = span['size']
                            if not ((size_s < size) and span['text'] != '\n'):
                                linea.append(span['text'])
                                sizes.append(size_s)
                                fonts.append(font_s)

                if linea != [] and (len(linea) >= 1 and any(len(x.translate(str.maketrans('', '', string.punctuation))) > 4 for x in linea)) and all(x[0] != linea for x in lines_final):
                    size1 = Counter(sizes).most_common(1)[0][0]
                    font1 = Counter(fonts).most_common(1)[0][0]

                    linee.append([linea,c,blocks.index(block),i,size1,font1])
                elif not all(x[0] != linea for x in lines_final):
                    lines_final = [x for x in lines_final if x[0] != linea]


                c+=1

        lines_final.extend(linee)
        # print(linee)
    lines_final = [[''.join(x[0]),x[1:]] for x in lines_final]
    for el in lines_final:
        print(el)
    siz_f = [x[1][-2] for x in lines_final]
    size_line_common = Counter(siz_f).most_common(1)[0][0]
    lines_final = [x for x in lines_final if x[1][-2] == size_line_common]
    return lines_final

    # print(lines_final)


import re
def get_splitted_content(doc):
    sections = get_sections(doc)
    start, end, to_keep, title, abstract_list = get_start_page(doc)


    abstract = {}
    if abstract_list and abstract_list != []:
        abstract['blocks'] = abstract_list[0]
        abstract['page'] = abstract_list[-1]
        abstract['size'] = abstract_list[2]
        abstract['words_count'] = abstract_list[3]
        abstract['text'] = abstract_list[1]
    else:
        abstract['blocks'] = [0]
        abstract['page'] = [0]
        abstract['size'] = ''
        abstract['words_count'] = ''
        abstract['text'] = ''
    authors = get_authors_new(doc,start,end,to_keep,title,abstract)

    title = '' if not title else title[1]
    abs  = re.split("abstract", abstract['text'], flags=re.IGNORECASE)
    if len(abs) > 1:
        abs = abs[1]
        for i in abs:
            if i.isalnum():
                ind = abs.index(i)
                abstract = abs[ind:]
                break

    else:
        abs = abs[0]
        abstract = abs
    # for j in range(len(sections)-1):
    #     cur_sec = sections[j]
    #     next_sec = sections[j+1]
    json_doc = {}
    json_doc['pdf_title'] = title
    json_doc['pdf_abstarct'] = abstract
    json_doc['pdf_authors'] = authors
    final_block = []
    start_page = abstract_list[-1][-1] if abstract_list[-1][-1] < len(doc) else 0
    start_block = abstract_list[0][-1] if abstract_list[0][-1] < len(doc) - 1 else 0
    for i in range(start_page,len(doc)):
        page = doc.load_page(i)
        blocks = page.get_text('blocks',flags=4)
        for block in blocks[start_block+1:]:

            textual_blocks_start = block[4].split('\n')
            textual_blocks = block[4].split('\n')
            textual_blocks = [norm.normalize(t).strip() for t in textual_blocks]
            for t in textual_blocks:
                split_t = t.split()
                if not (all(len(x)<5 for x in split_t)):
                    final_block.append(textual_blocks_start[textual_blocks.index(t)])
        # print(final_block)
    final_block_merged = []
    txt = ''
    for f in final_block:
        if any(f == x[0] for x in sections):
            print(f)
            if txt != '':
                final_block_merged.append(txt)

                txt = ''
            final_block_merged.append(f)
        elif f.endswith('.'):
            txt = f if txt == '' else txt + ' '+ f+'\n'
        else:
            txt = f if txt == '' else txt + ' '+ f
    if txt != '':
        final_block_merged.append(txt)
        txt = ''


    txt = ''
    count = 0
    for f in final_block_merged:
        if not any(f == x[0] for x in sections):
            if f.endswith('.'):
                f = f+'\n'
            txt = f if txt == '' else ' ' + f
        else:
            par = 'paragraph_pdf_'+str(count)
            sect = 'section_pdf_'+str(count+1)
            if txt != '' :
                json_doc[par] = txt
            json_doc[sect] = f
            count = count+1
            txt = ''
    par = 'paragraph_pdf_' + str(count)
    json_doc[par] = txt
    for k,v in json_doc.items():
        if k not in ['pdf_title','pdf_abstract','pdf_authors']:
            if title in v:
                v = v.replace(title,'')
                json_doc[k] = v
            if abstract in v:
                v = v.replace(abstract,'')
                json_doc[k] = v
            if authors in v:
                v = v.replace(authors,'')
                json_doc[k] = v





    return json_doc

def get_authors_new(doc, start, end, to_keep, title, abstract):
    final_auth_str, new_auth = '', []

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
        while j + 1 < len(to_keep) and (count_words < 2 or all(len(x) < 3 for x in words) or (
                to_keep[j][0][-1] == block_t[-1] and j + 1 < len(to_keep))):
            j += 1
            count_words = len(to_keep[j][1].split())
            words = to_keep[j][1].split()
            size_auth = to_keep[j][2]
            font_auth = to_keep[j][-1]
            block_auth.extend(to_keep[j][0])

        for el in to_keep:
            block_num = len(blocks_dict)
            if abstract['blocks'] != []:
                block_num = abstract['blocks'][0]

            if title[0][-1] < el[0][0] and el[0][-1] < block_num:
                if el[2] == size_auth and font_auth == el[-1]:
                    block_auth.extend(el[0])
            elif el[0][-1] >= abstract['blocks'][0]:
                break

        block_auth = list(set(block_auth))
        block_auth.sort()
        final = to_keep[j][1].strip()
        return final
        # final_auth_str = ''
        # final_auth_str_raw = ''
        # for bl in block_auth:
        #     block_dict = blocks_dict[bl]
        #     lines = block_dict.get('lines', [])
        #     for line in lines:
        #         spans = line.get('spans', [])
        #         for span in spans:
        #             final_auth_str_raw = span['text'] if final_auth_str_raw == '' else final_auth_str_raw + ' ' + \
        #                                                                                span['text']
        #             if span['size'] >= size_auth and span['font'] == font_auth:
        #                 final_auth_str = span['text'] if final_auth_str == '' else final_auth_str + ' ' + span[
        #                     'text']
        # return final_auth_str_raw
    #     new_auth = []
    #
    #     if ',' in final_auth_str:
    #         auth_list = final_auth_str.split(',')
    #         auth_list = [el.strip() for el in auth_list]
    #         for el in auth_list:
    #             re.sub(' +', ' ', el)
    #             if 'and ' in el:
    #                 new_auth.extend([el.split('and ')[1]])
    #                 new_auth.extend([el.split('and ')[0]])
    #
    #
    #             elif '& ' in el:
    #                 new_auth.extend([el.split('& ')[0]])
    #                 new_auth.extend([el.split('& ')[1]])
    #             else:
    #                 new_auth.extend([el])
    #
    #         final_auth_str = ', '.join(new_auth)
    #
    #     if '|' in final_auth_str:
    #         auth_list = final_auth_str.split('|')
    #         auth_list = [el.strip() for el in auth_list]
    #         for el in auth_list:
    #             re.sub(' +', ' ', el)
    #             if 'and ' in el:
    #                 new_auth.extend([el.split('and ')[1]])
    #                 new_auth.extend([el.split('and ')[0]])
    #
    #
    #             elif '& ' in el:
    #                 new_auth.extend([el.split('& ')[0]])
    #                 new_auth.extend([el.split('& ')[1]])
    #             else:
    #                 new_auth.extend([el])
    #
    #         final_auth_str = ', '.join(new_auth)
    #     elif ';' in final_auth_str:
    #         auth_list = final_auth_str.split(';')
    #         auth_list = [el.strip() for el in auth_list]
    #         new_auth = []
    #         for el in auth_list:
    #             re.sub(' +', ' ', el)
    #             if 'and ' in el:
    #                 new_auth.extend([el.split('and ')[0]])
    #                 new_auth.extend([el.split('and ')[1]])
    #
    #             elif '& ' in el:
    #                 new_auth.extend([el.split('& ')[0]])
    #                 new_auth.extend([el.split('& ')[1]])
    #             else:
    #                 new_auth.extend([el])
    #         final_auth_str = ', '.join(new_auth)
    #
    #     elif ' & ' in final_auth_str:
    #         new_auth = final_auth_str.split(' & ')
    #         new_auth = [el.strip() for el in new_auth]
    #         final_auth_str = ', '.join(new_auth)
    #     elif ' and ' in final_auth_str:
    #         new_auth = final_auth_str.split(' and ')
    #         new_auth = [el.strip() for el in new_auth]
    #         final_auth_str = ', '.join(new_auth)
    #     elif final_auth_str != '' and new_auth == []:
    #         new_auth.append(final_auth_str)
    #
    #     new_auth = [el.strip() for el in new_auth if el != '']
    #
    # auth_to_ret = new_auth
    # if new_auth != []:
    #     auth_to_ret = []
    #     for author in new_auth:
    #         author = ''.join([i for i in author if not i.isdigit()])
    #         author = author.strip()
    #         auth_words = author.split()
    #         if len(auth_words) > 1 and len(auth_words) <= 6 and any(len(x) > 1 for x in auth_words):
    #             auth_to_ret.append(author)
    #
    #     # if auth_to_ret == []:
    #     #     auth_to_ret = new_auth
    #
    # auth_to_ret = [unidecode.unidecode(el) for el in auth_to_ret]
    # for author in auth_to_ret:
    #     author_new = ''.join([x for x in author if x.isalpha() or x == '.' or x == ' '])
    #     auth_to_ret[auth_to_ret.index(author)] = author_new
    #
    # return final_auth_str

    # count_sec = -1
    # txt = ''
    # for f in final_block:
    #     print(f)
    #     print( sections[count_sec+1][0])
    #     if any(f == x[0] for x in sections):
    #         indice = 0
    #         for i in sections:
    #             if f == i[0]:
    #                 indice = sections.index(i)
    #                 break
    #         if txt != '' and count_sec == -1:
    #             json_doc['first_pdf_section'] = txt
    #             txt = ''
    #         elif txt != '' and count_sec >= 0:
    #             json_doc[sections[indice]] = txt
    #             txt = ''
    #
    #     else:
    #         if f.endswith('.'):
    #             f = f+'\n'
    #         txt = txt + ' ' + f if txt != '' else f
    #         if title != '' and abstract != '':
    #             if txt.startswith(title):
    #                 txt = txt.split(title)[1]
    #             elif abstract in txt:
    #                 txt = txt.split(abstract)[1]








def get_main_content_font_and_size(doc):

    """This method returns the font and the size of the main content of the page"""

    fonts, sizes = [],[]
    couples = []
    end = len(doc) if len(doc) < 11 else 10
    for i in range(end):
        page = doc.load_page(i)
        blocks = page.get_text('dict',flags=4)['blocks']

        for block in blocks:
            for line in block.get('lines',[]):
                for span in line.get('spans',[]):
                    font = span['font']
                    size = span['size']
                    # print(font,size,span['text'])
                    couples.extend([(size,font)]*len(span['text'].split()))
                    fonts.extend([font]*len(span['text'].split()))
                    sizes.extend([size]*len(span['text'].split()))
    if sizes != [] and sizes != []:
        size = Counter(sizes).most_common(1)[0][0]
        font = Counter(fonts).most_common(1)[0][0]
        couple = Counter(couples).most_common(1)[0][0]
        return couple[1],couple[0]
    return False,False


def lines_to_exclude(doc):
    lines = []
    common_tuple_list = []

    for p in range(len(doc)):
        page = doc.load_page(p)
        blocks = page.get_text('blocks',flags=4)
        if len(blocks) <= 5 or p == 0 or p == 1:
            for b in blocks:
                if len(b[4].replace('\n','')) > 5:
                    # lines.append(b[4].replace('\n',' '))
                    lines.append((b[4].replace('\n', ' '),blocks.index(b),p))
        else:
            for b in blocks[0:3]:
                if len(b[4].replace('\n', '')) > 5:
                    lines.append((b[4].replace('\n', ' '),blocks.index(b),p))
            for b in blocks[-3:]:
                if len(b[4].replace('\n', '')) > 5:
                    lines.append((b[4].replace('\n', ' '),blocks.index(b),p))
    # for el in lines:
    #     print(el)
    for index in range(0,len(lines)-1):
        for index_1 in range(0,len(lines)):
            string_1 = lines[index][0].strip()
            string_2 = lines[index_1][0].strip()
            if string_2 != '' and string_1 != '':
                comparable = False
                if index != index_1 and 15 > len(string_1) - len(string_2) >= 0 or 15 > len(string_2) - len(string_1) >= 0:
                    comparable = True
                if comparable:
                    maximum_sub_common_string_size, max_common_substring = compute_max_string(string_1, string_2)
                    dist = Levenshtein.distance(string_1,string_2)
                    dist1 = maximum_sub_common_string_size
                    if Levenshtein.distance(string_1,string_2) < maximum_sub_common_string_size or string_1.strip() in string_2.strip() or string_2.strip() in string_1.strip():
                        common_tuple_list.append((lines[index],lines[index_1],maximum_sub_common_string_size,Levenshtein.distance(string_1,string_2)))

    common_tuple_list = sorted(common_tuple_list, key=lambda tup: tup[2], reverse=True)
    common_tuple_first = [e[0] for e in common_tuple_list]
    counter_first = Counter(common_tuple_first)

    to_del = []

    for k,v in counter_first.items():
        if not (v < int(len(doc)*1/4) or v == 1):
            # print(k,v)
            to_del.append(k)
        # else:
        #     print(k,v)

    to_del = list(set(to_del))

    elements = []
    for e in common_tuple_list:
        if e[0] in to_del:
            if e[0] not in elements:
                elements.append(e[0])
            if e[1] not in elements:
                elements.append(e[1])

    elements = sorted(elements, key=lambda tup: len(tup), reverse=True)
    elements_1 = []
    for el in elements:
        elements_1.append((el[1],el[2]))
    return elements,elements_1





def get_start_page(doc):

    # number_of_words = get_page_with_title_and_abstract(doc, 0)
    page_abs = False
    block_abs = False
    l,ll = lines_to_exclude(doc)
    if len(doc) > 1:
        st = 1
    else:
        st = len(doc)-1
    inizio = st
    start, end, to_keep, title, abstract = False,False,False,False,False
    p = doc.load_page(st)
    font,size = get_main_content_font_and_size(doc)
    if font is not False and size is not False:
        blocks = p.get_text('blocks')
        # testo = p.get_text()
        # print(testo)

        while len(blocks) == 0 and st >= 0:
            st = st -1
            inizio = inizio -1
            p = doc.load_page(st)
            blocks = p.get_text('blocks')
        to_keep = define_line_length_abs_page(doc,st,[len(blocks)],with_font=True)
        to_keep = remove_trash_lines_hidden(to_keep)
        max_sizes_lines = []
        for ind in range(len(doc)):
            # print(ind)
            # if ind == 16:
            #     breakpoint()
            pag = doc.load_page(ind)
            # testo = pag.get_text()
            # print(testo)
            bl = pag.get_text('blocks')
            # for b in bl:
            #     print(b[4])
            if len(bl) > 0:
                tmp = define_line_length_abs_page(doc,ind,[len(bl)],with_font=None)
                tmp = remove_trash_lines_hidden(tmp)
                sizes = [el[2] for el in tmp]

                size_to_exclude = Counter(sizes)
                for k, v in size_to_exclude.items():
                    if v > 1:
                        sizes.remove(k)

                sizes = list(set(sizes))


                tmp = [el for el in tmp if el[3] > 4 and el[2] > size+2] # prima era size +1 vediamo come va

                if ind <= 1:
                    tmp_sorted = sorted(tmp,key=lambda x: x[2], reverse=True)
                    tmp_sorted = [list(el) for el in tmp_sorted]
                    for j in range(len(tmp_sorted)):
                        # print(type(tmp_sorted[j]))
                        el = [x for x in tmp_sorted[j]]
                        el.append(ind)
                        # print(el)

                        tmp_sorted[j] = el
                    if len(tmp_sorted) >1:
                        max_sizes_lines.extend(tmp_sorted[0:2])
                    elif len(tmp_sorted) == 1:
                        max_sizes_lines.extend(tmp_sorted[0:1])

                else:
                    max_sizes_lines = [el for el in max_sizes_lines if el[2] not in sizes]
                    break

                # else:
                #     max_sizes_lines = [el for el in max_sizes_lines if el[2] not in sizes]

        found_start = False

        if len(doc) > 1:
            i = 2
        else:
            i = len(doc)

        title = False
        abstract = False
        max_sizes_lines = remove_trash_lines_hidden(max_sizes_lines,True)


        # forse tolgo!!!!--------
        if len(max_sizes_lines)>0:
            max_all = []
            page_tit = [el[-1] for el in max_sizes_lines]
            page_tit = sorted(list(set(page_tit)))
            for p in page_tit:
                max_page_lines = [el for el in max_sizes_lines if el[-1] == p]
                max_size = max([el[2] for el in max_page_lines])
                exit = False
                for el in max_page_lines:
                    # print(abs(max_size - el[2]))
                    if abs(max_size - el[2]) >= 1:
                        exit = True
                        break
                if (exit and len(max_page_lines) > 0) or len(max_page_lines) == 1:
                    max_all.extend([max(max_page_lines,key=lambda el: el[2])])
            max_sizes_lines = max_all

        to_keep_abs = []
        for p in range(0, len(doc)):
            page_a = doc.load_page(p)
            bl = page_a.get_text('blocks')
            to_keep_tmp = define_line_length_abs_page(doc, p, [len(bl)], with_font=True)
            for row in to_keep_tmp:
                foundrow = False
                for b in row[0]:
                    if (b, page_a) in ll:
                        foundrow = True
                        break
                if not foundrow:
                    to_keep_abs.append(row)
        to_keep_abs = uniform_to_keep(to_keep_abs)
        to_keep_abs = [el for el in to_keep_abs if el[0] != []]

        #------------------------
        found_abs = False
        # max_sizes_lines = [sorted(max_sizes_lines, key= lambda x:x[2], reverse=True)[0]]

        while not found_start and i >= 0:
            # print(i)
            if not abstract:
                for pind in range(0,3):
                    if pind == len(doc):
                        break
                    else:
                        pagina = doc.load_page(pind)
                        blocchi = pagina.get_text('blocks')
                        words = []
                        for b in blocchi:
                            words.extend(b[4].split()[0:3])


                        if len(blocchi) > 0:
                            tk = define_line_length_abs_page(doc, pind, [len(blocchi)], with_font=True)
                            tk = remove_trash_lines_hidden(tk)
                            ind = 0
                            while ind < len(tk):
                                el = tk[ind]
                                exit = False
                                end = 15 if len(el[1]) > 15 else len(el[1])
                                if ('Abstract' in el[1][0:end] or 'abstract' in el[1][0:end] or 'ABSTRACT' in el[1][0:end] or 'abstract' in ''.join(el[1][0:end].split())) or found_abs:

                                    if not found_abs and any('abstract' in w.lower() for w in words):
                                        if tk[ind][3] < 3:
                                            ind += 1

                                        found_abs = True
                                        abstract = list(tk[ind])
                                        abstract[1] = abstract[1].replace('\t',' ')
                                        page_abs = pind
                                        block_abs = ind
                                        font_abs = abstract[4]
                                        size_abs = abstract[2]
                                        abstract.append([pind])
                                    elif found_abs and (abstract[3] < 150 or (el[2] == size_abs and el[4] == font_abs and abstract[3] < 250 and not abstract[1].endswith('.') and not 'keywords:' in abstract[1].lower())):
                                        abstract[0] = abstract[0] + el[0]
                                        abstract[1] = abstract[1] + ' ' + el[1]
                                        abstract[1] = abstract[1].replace('\t',' ')
                                        # print(abstract[1])
                                        abstract[3] = len(abstract[1].split())
                                        abstract[-1].extend([pind])
                                    else:
                                        break
                                    # elif abstract:
                                    #     break


                                ind += 1





            to_keep_sort_by_size = sorted(to_keep, key=lambda x: x[2], reverse=True)
            max_per_page = [el[2] for el in to_keep_sort_by_size]
            max_sizes_lines_filtered_all = [elem for elem in max_sizes_lines if elem[-1] == i and len(elem[1].split()) > 1 ]
            max_sizes_lines_filtered = [el[2] for el in max_sizes_lines_filtered_all]
            if len(max_sizes_lines_filtered) > 0 and len(list(set(max_per_page) & set(max_sizes_lines_filtered))) > 0:
                end = len(to_keep)
                if block_abs and page_abs == i:
                    end = block_abs
                # for element1 in to_keep[:block_abs]:
                indice_to_keep = 0
                while indice_to_keep < len(to_keep[:end]):
                    element1 = to_keep[indice_to_keep]
                    list_element1 = list(element1)
                    list_element1.append(i)
                    max_size_text = [el[1] for el in max_sizes_lines]
                    if element1[2] in max_sizes_lines_filtered and element1[1] != '' and any(element1[1] in el for el in max_size_text) and len(element1[1].split()) > 1 and not title: # primo blocco titolo, secondo autori
                        title = list(element1)
                        for t in max_size_text:
                            if element1[1] in t:
                                title[1] = t
                                break
                        title_blocks = title[0]
                        title.append(i)
                        found_start = True
                        pagina = doc.load_page(i)
                        # testo = pagina.get_text('blocks')
                        # for b in testo:
                        #     print(b[4])

                        if len(to_keep) > title_blocks[-1]+1:
                            starting_abstract_search = to_keep.index(element1) + 1

                        else:
                            starting_abstract_search = to_keep.index(element1) + 1
                        if not abstract:
                            index_to_start = 0
                            for el in to_keep_abs:
                                if title[1] in el[1]:
                                    index_to_start = to_keep_abs.index(el)+1
                            # for elem in to_keep_abs[index_to_start:]:

                            for elem in to_keep[starting_abstract_search:]:
                                p = doc.load_page(i)
                                blocks_abs = elem[0]
                                count_most_common_aux = []
                                first_letter_size = 0
                                block = p.get_text('dict')['blocks'][blocks_abs[0]]
                                d = get_block_font_size_distribution(block)
                                for b in blocks_abs:
                                    block = p.get_text('dict')['blocks'][b]
                                    dd = get_block_font_size_distribution(block)
                                    if len(dd) > 0:
                                        for el in dd:
                                            count_most_common_aux.extend([el[1]]*len(el[2].split()))
                                most_common_size = 0
                                if count_most_common_aux != []:
                                    most_common_size = Counter(count_most_common_aux).most_common(1)[0][0]
                                if d == []:
                                    d = [[0,0,'']]


                                # questo è per capire dove è l'abstract. A volte succede che le affiliazioni sono lunghissime e venogno scambiate per abs, per questo controllo il primo carattere
                                # il problema è che a volte l'abstract comincia con [1]

                                # if ('abstract' in elem[1] or (elem[1][0] in ['[','('] and elem[3] > ABSTRACT_WORDS) or (not (d[0][1] < most_common_size and len(d[0][2]) < 3) and not elem[1][0].isdigit() and not elem[1][0].islower() and elem[3] > ABSTRACT_WORDS)) and not abstract:
                                # if elem[3] > ABSTRACT_WORDS and not abstract and  (elem[1][0].isupper() or 'abstract' in elem[1] or (elem[1][0] in ['[', '('] and d[0][1] <= most_common_size and len(d[0][2].strip()) <= 3)) :
                                # if elem[3] > ABSTRACT_WORDS and not abstract and (not len([e for e in elem[1].split() if e.isupper()])>(len(elem[1].split())/2)) and  (elem[1][0].isupper() or elem[1].lower().startswith('abstract') or ''.join(elem[1].split()).lower().startswith('abstract') or (elem[1][0] in ['[', '('] and d[0][1] <= most_common_size ) or (elem[1][0].isdigit() and d[0][1] >= most_common_size)) :

                                el1_words = elem[1].split()
                                el1_words = (' '.join(word.strip(string.punctuation) for word in elem[1].split())).split()
                                el1_words = [el for el in el1_words if all(x.isalpha() for x in el)]
                                if elem[3] > ABSTRACT_WORDS and not abstract and (not len([e for e in el1_words if e[0].isupper()])>(len(el1_words)/2)) and  (elem[1][0].isupper() or  elem[1].lower().startswith('abstract') or ''.join(elem[1].split()).lower().startswith('abstract') or (elem[1][0] in ['[', '('] and d[0][1] <= most_common_size ) or (elem[1][0].isdigit())) :
                                # if ('abstract' in elem[1] or (elem[1][0] in ['[', '('] and elem[3] > ABSTRACT_WORDS and d[0][1] <= most_common_size and len(d[0][2]) <= 3 and not elem[1][0].isdigit() and not elem[1][0].islower() and elem[3] > ABSTRACT_WORDS)) and not abstract:

                                    # print('abstract assigned')
                                    abstract = list(elem)
                                    abstract.append([i])
                                    break
                        if abstract != [] and abstract != False:
                            if abstract and not abstract[1].strip().endswith('.') and len(abstract[1].split()) < 250:
                                index_in_abs_blocks = 0
                                for ii in to_keep_abs:
                                    if ii[1] == abstract[1]:
                                        index_in_abs_blocks = to_keep_abs.index(ii)
                                        for ii in to_keep_abs[index_in_abs_blocks + 1:]:
                                            if ii[2] > abstract[2]:
                                                break
                                            if ii[2] == abstract[2] and ii[4] == abstract[4]:
                                                abstract[0] = abstract[0] + ii[0]
                                                abstract[1] = abstract[1] + ' ' + ii[1]
                                                abstract[3] = abstract[3] + ii[3]
                                                break
                                        break
                                    elif abstract[1] in ii[1]:
                                        index_in_abs_blocks = to_keep_abs.index(ii) - 1
                                        abstract[0] = ii[0]
                                        abstract[1] = ii[1]
                                        abstract[3] = ii[3]
                                        break
                            break
                    indice_to_keep += 1


            if not found_start:
                # number_of_words = get_page_with_title_and_abstract(doc, 0)
                i = i - 1
                p = doc.load_page(i)

                blocks = p.get_text('blocks')
                while len(blocks) == 0:
                    i = i - 1
                    p = doc.load_page(i)

                    blocks = p.get_text('blocks')
                to_keep = define_line_length_abs_page(doc, i, [len(blocks)], with_font=True)
                to_keep = remove_trash_lines_hidden(to_keep)

        if abstract != [] and abstract != False:
            abstract[-1] = list(set(abstract[-1]))
            paginaabs = abstract[-1]
            if len(paginaabs) == 1:
                pp = doc.load_page(paginaabs[0])
                blocchi = pp.get_text('blocks')
                blocco = abstract[0]
                ab = ' '.join(blocchi[b][4] for b in blocco)
                ab = ab.replace('\n', ' ')
                if len(abstract[1]) < len(ab) and not abstract[1].endswith('.'):
                    abstract[1] = ab


        if abstract  and title:
            start, end = i, i + 1
        elif title:
            start,end = title[-1],title[-1]+1
            p = doc.load_page(start)
            blocks = p.get_text('blocks')
            to_keep = define_line_length_abs_page(doc, start, [len(blocks)], with_font=True)
            to_keep = remove_trash_lines_hidden(to_keep)

        else:
            start,end = 0,1
            st = 0
            p = doc.load_page(st)
            blocks = p.get_text('blocks')
            to_keep = define_line_length_abs_page(doc, 0, [len(blocks)], with_font=True)
            to_keep = remove_trash_lines_hidden(to_keep)

    if to_keep and len(to_keep) > 0:
        to_keep = [el for el in to_keep if el[0] != []]
    return start,end,to_keep,title,abstract

def group_font_size_blocks(doc,p):
    page = doc.load_page(p)
    blocks_text = page.get_text('blocks')
    blocks_dict = page.get_text('dict')['blocks']
    obj = {}
    all = []
    missing = []
    for block in blocks_dict:
        tup_f_s = get_block_font_size_distribution(block)
        if tup_f_s != {}:
            k_tup = max(tup_f_s.items(), key=operator.itemgetter(1))
            # print(k_tup)
            # print(blocks_text[blocks_dict.index(block)][4])
            obj[blocks_dict.index(block)] = k_tup
            all.append([blocks_dict.index(block),k_tup[0][0],k_tup[0][1],k_tup[1]])
        else:
            # print(blocks_dict.index(block))
            missing.append(blocks_dict.index(block))



    cur_el = [[all[0][0]],all[0][1],all[0][2],all[0][3]]
    to_keep = []

    # for el in all:
    #     print(el)
    for el in range(1,len(all)):
        if all[el][1] != cur_el[1] or all[el][2] != cur_el[2]:
            to_keep.append(cur_el)
            cur_el = [[all[el][0]],all[el][1],all[el][2],all[el][3]]

        else:
            # if not caratteri vietati non nel blocco

            cur_el[0].append(all[el][0])
            cur_el[3] = cur_el[3] + all[el][3]

        if el == len(all)-1:
            to_keep.append(cur_el)
    return to_keep


def get_block_font_size_distribution(block):
    tups_arr = []
    lines = block.get('lines',[])

    for line in lines:
        if line['dir'] == (1.0, 0.0):
            spans = line.get('spans',[])
            for span in spans:
                # print(span['text'])
                tups_arr.append([span['font'],span['size'],span['text']])
    return tups_arr
    # tups_count = Counter(tups_arr)
    # # print(dict(tups_count))
    # tups_count = dict(tups_count)
    #
    # return dict(tups_count)

def sections_font_size(doc):

    # QUESTO è PRELIMINARE, MI SERVE PER TROVARE L'ABSTRACT, UNA VOLTA TROVATO DIVIDO IN PARAGRAFI E LO FACCIO + ACCURATO

    font_corpus, size_corpus = get_main_content_font_and_size(doc)
    font_size = []
    if len(doc) > 4:
        start = 2
    else:
        start = 1
    for p in range(start,len(doc)):
        page = doc.load_page(p)
        blocks = page.get_text('dict')['blocks']
        for b in blocks:
            lines = b.get('lines',[])
            for line in lines:
                if line['dir'] == (1.0, 0.0):
                    found_corpus = False
                    spans = line.get('spans',[])

                    line_size = ''
                    line_fonts = []
                    for span in spans:

                        if span['font'] == font_corpus and span['size'] == size_corpus:
                            found_corpus = True
                            break
                        else:
                            line_size = span['size']
                            line_font = span['font']
                            if line_font not in line_fonts:
                                line_fonts.append(line_font)
                            # line_text = span['text'] if line_text == '' else line_text + ' ' + span['text']
                    if not found_corpus:
                        for font in line_fonts:
                            if not found_corpus and (font,line_size) not in font_size and line_size >= size_corpus:
                                font_size.append((font,line_size))

    # for el in font_size:
    #     print(el)
    return font_size

def get_page_with_title_and_abstract(doc,p):
    page = doc.load_page(p)
    words = page.get_text('words')
    return len(words)

def get_blocks(page):
    # txt = page.get_textpage_ocr(flags=3, language="eng", dpi=72, full=False)
    full_tp = page.get_textpage_ocr(flags=16, dpi=200, full=False)
    # now look at what we have got
    blocks = (page.get_text("dict",textpage=full_tp)['blocks'])
    for b in blocks:
        print(b)
    return 1

def remove_trash_lines_hidden(to_keep,strict=None):
    to_keep_filtered = []
    dups = []
    never_seen = []

    lines = [el[1:5] for el in to_keep]
    for line in lines:
        if line in never_seen:
            dups.append(line)
            never_seen.remove(line)
        elif line not in dups:
            never_seen.append(line)

    for el in to_keep:
        if isinstance(el,list):
            if [el[1],el[2],el[3],el[4]] in never_seen:
                to_keep_filtered.append(el)
        elif isinstance(el,tuple):
            if (el[1],el[2],el[3],el[4]) in never_seen:
                to_keep_filtered.append(el)
    return to_keep_filtered


def define_line_length_abs_page(doc, page_num, page_block,with_font=None):
    start_end_lines = []
    page = doc.load_page(page_num)
    blocks1 = page.get_text('blocks')
    blocks_dict = page.get_text('dict')['blocks']
    # lines_to_exclude1,lines_to_exclude2 = lines_to_exclude(doc)

    line_text = ''
    line_size = []
    line_font = []
    # devo fare due linee separate se una stessa citazione è divisa tra più colonne
    for block in blocks_dict:
        # if ((blocks_dict.index(block), page_num) not in lines_to_exclude2):
            if line_text != '' and len(line_font)>0 and len(line_size) > 0:
                size_most_common = Counter(line_size).most_common(1)[0][0]
                font = Counter(line_font).most_common(1)[0][0]
                # start_end_lines.append((blocks_dict.index(block)-1, line_text, max(line_size), len(line_text.split()),font))
                start_end_lines.append((blocks_dict.index(block)-1, line_text, size_most_common, len(line_text.split()),font))
                line_size = []
                line_font = []
                line_text = ''

            lines = block.get('lines', [])
            if len(lines) > 0:
                current_bbox = lines[0]['bbox']
                for line in lines:
                    if len(line_size) > 0 and len(line_font) and not (line['bbox'][1] == current_bbox[1] or line['bbox'][3] == current_bbox[3]):
                        font = Counter(line_font).most_common(1)[0][0]
                        size_most_common = Counter(line_size).most_common(1)[0][0]
                        # start_end_lines.append((blocks_dict.index(block), line_text, max(line_size), len(line_text.split()),font))
                        start_end_lines.append(
                            (blocks_dict.index(block) , line_text, size_most_common, len(line_text.split()), font))

                        line_text = ''
                        line_size = []
                        line_font = []
                        current_bbox = line['bbox']

                    for span in line.get('spans', []):

                        line_text = span['text'] if line_text == '' else line_text + '' + span['text']
                        line_size.extend([span['size']] * len(span['text']))
                        line_font.extend([span['font']] * len(span['text']))
                        # line_size.extend([span['size']]*len(span['text'].split()))
                        # line_font.extend([span['font']]*len(span['text'].split()))


    if line_text != '' and len(line_font)>0 and len(line_size) > 0:

        # if ((page_block[0]-1), page_num) not in lines_to_exclude2:
            font = Counter(line_font).most_common(1)[0][0]
            #
            size_most_common = Counter(line_size).most_common(1)[0][0]
            #
            # start_end_lines.append((page_block[0]-1, line_text, max(line_size), len(line_text.split()),font))
            start_end_lines.append((page_block[0] - 1, line_text, size_most_common, len(line_text.split()), font))

    search_titles = []
    line_txt = ''
    if len(start_end_lines)>0:
        font_text = start_end_lines[0][-1]
        size_text = start_end_lines[0][2]
        blocks = []
        start_end_lines = remove_trash_lines_hidden(start_end_lines)
        numbers_titles = []
        for el in start_end_lines:
            e = ''.join(el[1].split())
            if all(x.isdigit() for x in e):
                numbers_titles.append(el)
        for el in numbers_titles:
            start_end_lines.remove(el)

        if with_font is None:
            for i in range(len(start_end_lines)):
                el = start_end_lines[i]
                if size_text == el[2]:
                    line_txt = el[1] if line_txt == '' else line_txt + ' ' + el[1]
                    blocks.append(el[0])

                else:
                    blocks = sorted(set(blocks), key=blocks.index)
                    search_titles.append((blocks, line_txt.strip(), size_text, len(line_txt.split()),el[-1]))
                    line_txt = el[1]
                    size_text = el[2]
                    blocks = [el[0]]
            if line_txt != '':
                blocks = sorted(set(blocks), key=blocks.index)
            search_titles.append((blocks, line_txt.strip(), size_text, len(line_txt.split()),el[-1]))

        else:
            # search_titles = uniform_to_keep(start_end_lines)
            for i in range(len(start_end_lines)):
                el = start_end_lines[i]
                # print(el)
                if size_text == el[2] and font_text == el[-1]:
                    line_txt = el[1] if line_txt == '' else line_txt + ' ' + el[1]
                    if el[0] not in blocks:
                        if len(blocks) == 0 or (len(blocks) > 0 and el[0] == blocks[-1]+1):
                            blocks.append(el[0])

                        else:
                            blocks = sorted(set(blocks), key=blocks.index)
                            search_titles.append((blocks, line_txt.strip().replace('\t',' '), size_text, len(line_txt.split()), font_text))
                            line_txt = el[1]
                            size_text = el[2]
                            font_text = el[-1]
                            blocks = [el[0]]

                else:
                    blocks = sorted(set(blocks), key=blocks.index)
                    search_titles.append((blocks, line_txt.strip().replace('\t',' '), size_text, len(line_txt.split()),font_text))
                    line_txt = el[1]
                    size_text = el[2]
                    font_text = el[-1]
                    blocks = [el[0]]
            if line_txt != '':
                blocks = sorted(set(blocks), key=blocks.index)

            search_titles.append((blocks, line_txt, size_text, len(line_txt.split()),font_text))



    return search_titles

def uniform_to_keep(start_end_lines):
    search_titles = []
    line_txt = ''
    start = start_end_lines[0]
    font_text = start[-1]
    size_text = start[2]
    blocks = []
    for i in range(len(start_end_lines)):
        el = start_end_lines[i]
        # print(el)
        if size_text == el[2] and font_text == el[-1]:
            line_txt = el[1] if line_txt == '' else line_txt + ' ' + el[1]
            blocks.extend(el[0])

        else:
            blocks = sorted(set(blocks), key=blocks.index)
            search_titles.append((blocks, line_txt.strip(), size_text, len(line_txt.split()), font_text))
            line_txt = el[1]
            size_text = el[2]
            font_text = el[-1]
            blocks = el[0]
    if line_txt != '':
        blocks = sorted(set(blocks), key=blocks.index)

    search_titles.append((blocks, line_txt, size_text, len(line_txt.split()), font_text))
    return search_titles

import fitz
if __name__ == '__main__':
    doc = fitz.open('50-doi___________0bc2e6393cd31b6fbead331d0f88d4e9.pdf')
    get_splitted_content(doc)