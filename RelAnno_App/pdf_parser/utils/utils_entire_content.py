import operator
from collections import Counter
from difflib import SequenceMatcher
import Levenshtein
from .utils_new_references import *

def get_entire_content(doc):
    # l1,l2 = lines_to_exclude(doc)
    content = ''
    content_for_urls = ''
    for p in range(len(doc)):
        page = doc.load_page(p)
        blocks = page.get_text('blocks')

        for b in blocks:
            # if (blocks.index(b),p) not in l2:
                block_text =  b[4].replace('\n',' ')
                content = block_text if content == '' else content + '\n' + block_text

                block_text = b[4].replace('\n', '')
                content_for_urls = block_text if content_for_urls == '' else content_for_urls + '\n' + block_text

    return content,content_for_urls


def extract_urls_from_text(doc,urls_to_exclude):
    l1, l2 = lines_to_exclude(doc)
    content_lines = []
    for p in range(len(doc)):
        page = doc.load_page(p)
        blocks = page.get_text('blocks')

        for b in blocks:
            if (blocks.index(b), p) not in l2:
                new_b4 = b[4].replace('\t',' ')
                content_lines.extend([new_b4.replace('\n',' ')])
    urls = []
    i = 0
    while i in range(len(content_lines)):
        el = content_lines[i]

        if 'http' in el:
            url = 'http' + el.split('http')[1]
            if len(url.split()) > 0:
                url = url.split()[0]
                if len(url) > 10:
                    urls.extend([url])
        i += 1


    for url in urls:
        j = len(url)-1
        ind = urls.index(url)
        while j >= 0 and not (url[-1].isalpha() or url[-1].isdigit()):
            url = url[:j]
            j -= 1
        urls[ind] =  url
    urls = [url.strip() for url in urls]
    for u in urls:
        if u.endswith('/'):
            urls[urls.index(u)] = u[:-1]
    urls_filtered = ['/'.join(url.split('/')[3:]) for url in urls]
    for url in urls_filtered:
        j = len(url)-1
        u = url
        ind = urls_filtered.index(url)
        while j >= 0 and (url[-1].isalpha() or url[-1].isdigit()):
            if not url[j].isalpha() and not url[j].isdigit():
                u = url[:j]
            else:
                break
            j -= 1
        urls_filtered[ind] = u

    urls_to_rem = []
    urls_filt_to_rem = []
    for u in urls_to_exclude:
        ul = u.lower()
        ul = '/'.join(ul.split('/')[3:])
        for uf in urls_filtered:
            ufl = uf.lower()
            if (ul in ufl or ufl in ul or ul == ufl) and u != '' and uf != '' :
                urls_to_rem.append(urls[urls_filtered.index(uf)])
                urls_filt_to_rem.append(uf)
                break
    urls = [u for u in urls if u not in urls_to_rem]
    urls_filtered = [u for u in urls_filtered if u not in urls_filt_to_rem]

    return urls, urls_filtered

def extract_dois_from_text(doc,dois_to_exclude):
    l1, l2 = lines_to_exclude(doc)
    content_lines = []
    for p in range(len(doc)):
        page = doc.load_page(p)
        blocks = page.get_text('blocks')

        for b in blocks:
            if (blocks.index(b), p) not in l2:
                new_b4 = b[4].replace('\t', ' ')
                content_lines.extend([new_b4.replace('\n', '')])
    dois = []
    for line in content_lines:
        # l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', line)
        l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', line)
        if l is not None:
            u = l.group()
            dois.extend([u])

    dois_to_rem = []
    for doi in dois:
        # print('\n')
        # print(doi)

        el = doi.lower()
        for d in dois_to_exclude:
            # print(d)
            dl = d.lower()

            if (el in dl or dl in el or dl == el) and len(el) > 15 and len(dl) > 15:
                dois_to_rem.append(doi)
                break
    dois = [el for el in dois if el not in dois_to_rem]
    return dois


# def extract_urls_from_text1(doc):
#     content = get_entire_content(doc)
#     urls1 = extract_urls_from_references(doc)
#     urls = []
#     content = content.split('\n')
#     new_lines = []
#     c = ''
#
#     i = 0
#     while i < len(content):
#         line = content[i].strip()
#         if 'http' in line.split()[-1]:
#
#             if not line.split()[-1][-1].isdigit() and not line.split()[-1][-1].isalpha():
#                 c = content[i] + content[i+1]
#                 new_lines.append(c)
#                 i += 2
#             else:
#                 c = content[i]
#                 new_lines.append(c)
#                 i = i + 1
#             c = ''
#
#         else:
#             if c != '':
#                 new_lines.append(c)
#             i+= 1
#     if c != '':
#         new_lines.append(c)
#
#
#
#     for line in new_lines:
#         words = line.split()
#         url = ''
#         for el in words:
#             if 'http' in el:
#                 index_http = line.split().index(el)
#                 for i in line.split()[index_http:]:
#                     url = url + i
#                     if url not in urls1:
#                         urls.append(url)
#     print(urls)
#     return urls
#
# def extract_urls_from_text(doc,references):
#     content = get_entire_content(doc)
#     urls1 = extract_urls_from_references(references)
#     urls = []
#     content = content.split('\n')
#     content = [el.strip() for el in content]
#     content = list(filter(lambda x: len(x) > 0, content))
#     new_lines = []
#     c = ''
#
#     i = 0
#     while i < len(content):
#         line = content[i].strip()
#         # if line.startswith('33.'):
#         #     breakpoint()
#         # print(line)
#         if 'http' in line.split()[-1]:
#
#             if not line.split()[-1][-1].isdigit() and not line.split()[-1][-1].isalpha():
#                 if i < len(content) - 1:
#                     c = content[i] + content[i+1]
#                 else:
#                     c = content[i]
#                 new_lines.append(c)
#                 i += 2
#             else:
#                 c = content[i]
#                 new_lines.append(c)
#                 i = i + 1
#             c = ''
#
#         else:
#             if c != '':
#                 new_lines.append(c)
#             i+= 1
#     if c != '':
#         new_lines.append(c)
#
#
#
#     for line in new_lines:
#         words = line.split()
#         url = ''
#         for el in words:
#             if 'http' in el:
#                 index_http = line.split().index(el)
#                 for i in line.split()[index_http:]:
#                     url = url + i
#         if all(url not in el for el in urls1):
#             urls.append(url)
# # print(urls)
#     return urls

import re
def extract_doi_from_text1(doc):
    content = get_entire_content(doc)
    dois_ref = extract_doi_from_references(doc)
    dois = []
    i = 0
    content = content.split('\n')
    content = [el.strip() for el in content]
    content = list(filter(lambda x: len(x) > 0, content))

    new_lines = []
    c = ''
    while i < len(content):
        line = content[i]
        if 'doi::' in line.split()[-1]:
            if not line.split()[-1][-1].isdigit() and not line.split()[-1][-1].isalpha():
                c = content[i] + content[i + 1]
                new_lines.append(c)
                i += 2
            else:
                c = content[i]
                new_lines.append(c)
                i = i + 1
            c = ''
        else:
            if c != '':
                new_lines.append(c)
            i += 1
    if c != '':
        new_lines.append(c)

    for line in content:
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

    new_dois = []

    for el in dois:
        if el not in dois_ref:
            new_dois.append(el)

    # print(new_dois)
    return new_dois


import re
def extract_doi_from_text(doc,references):
    content = get_entire_content(doc)
    dois_ref = extract_doi_from_references(references)
    dois = []
    i = 0
    content = content.split('\n')
    content = [el.strip() for el in content]
    content = list(filter(lambda x: len(x) > 0, content))

    new_lines = []
    c = ''
    while i < len(content):
        line = content[i]
        if 'doi::' in line.split()[-1]:
            if not line.split()[-1][-1].isdigit() and not line.split()[-1][-1].isalpha():
                if i < len(content) - 1:
                    c = content[i] + content[i + 1]
                else:
                    c = content[i]
                new_lines.append(c)
                i += 2
            else:
                c = content[i]
                new_lines.append(c)
                i = i + 1
            c = ''
        else:
            if c != '':
                new_lines.append(c)
            i += 1
    if c != '':
        new_lines.append(c)

    for line in content:
        l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', line)
        if l is not None:
            u = l.group()
            dois.extend([u])
    for u in dois:
        ind = (dois.index(u))
        if u == '10.3334/CDIAC/OTG.CLIVAR_FICARAM_XV':
            breakpoint()
        point_words = u.split('.')
        slash_words = u.split('/')
        if all(not char.isdigit() for char in point_words[-1]) and len(point_words[-1]) >= 3 and point_words[-1][0].isupper():
            # print(urls[urls.index(u)])
            # print(point_words[-1])
            new_el = '.'.join(point_words[:-1])
            # print(new_el)
            # print('\n')
            dois[ind] = new_el
        if all(not char.isdigit() for char in slash_words[-1]) and len(slash_words[-1]) >= 3 and slash_words[-1][0].isupper():
            # print(urls[urls.index(u)])
            # print(slash_words[-1])
            new_el = '.'.join(slash_words[:-1])
            # print(new_el)
            # print('\n')
            dois[ind] = new_el

    new_dois = []

    for el in dois:
        if el not in dois_ref:
            new_dois.append(el)

    # print(new_dois)
    return new_dois



import fitz
if __name__ == '__main__':
    # file = '../../download_pdf/file.pdf'
    file = '../test/prova.pdf'
    doc = fitz.open(file)

    a = extract_doi_from_text(doc)

    # for el in a:
    #     print(el)
    #     print('\n')