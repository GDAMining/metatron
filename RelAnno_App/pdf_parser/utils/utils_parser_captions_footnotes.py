from .utils_new_references import *

def extract_caption(doc,pages=None): #ok
    captions_table = []
    captions_image = []
    f,s = get_main_content_font_and_size(doc)
    if pages is None:
        end = len(doc)
    else:
        end = pages
    for p in range(end):
        page = doc.load_page(p)
        blocks = page.get_text('dict',flags=4)['blocks']
        blocks2 = page.get_text('blocks')
        table_found = False
        image_found = False

        caption_table = ''
        caption_image = ''
        caption_blocks_img = []
        caption_blocks_tab = []
        for block in blocks:
            # print(blocks.index(block))
            # if blocks.index(block) == 7:
            #     breakpoint()
            lines = block.get('lines', [])

            if len(lines) > 0:
                line = lines[0]
                while len(lines) > 0 and line.get('spans',[]) == []:
                    lines.remove(line)
                    if len(lines) > 0:
                        line = lines[0]
                if len(lines) > 0:
                    first_span = lines[0]['spans'][0]
                    first_span_text = first_span['text']
                    first_span_word = ''.join(first_span_text.split())
                    first_span_font = first_span['font']
                    first_span_size = first_span['size']
                    if (first_span_word.lower().startswith('tab') or first_span_word.lower().startswith('table')):

                    # if ('tab' in first_span_text.lower() or 'table' in first_span_text.lower()) and first_span_font != f and any(char.isdigit() for char in first_span_text):
                        table_found = True
                        image_found = False
                        if caption_image != '' and caption_blocks_img != []:
                            captions_image.append((' '.join(caption_image.strip().split()),list(set(caption_blocks_img))))

                        if caption_table != '' and caption_blocks_tab != []:
                            captions_table.append((' '.join(caption_table.strip().split()),list(set(caption_blocks_tab))))
                        caption_table = ''
                        caption_image = ''
                        caption_blocks_img = []
                        caption_blocks_tab = []
                        font_size_tab_caption = first_span_size
                    if (first_span_word.lower().startswith('fig') or first_span_word.lower().startswith('figure') or  first_span_word.lower().startswith('img') or  first_span_word.lower().startswith('image')) and any(char.isdigit() for char in first_span_text):

                    # if ('fig' in first_span_text.lower() or 'figure' in first_span_text.lower() or 'img' in first_span_text.lower() or 'image' in first_span_text.lower()) and first_span_font != f and any(char.isdigit() for char in first_span_text):
                        image_found = True
                        table_found = False
                        if caption_image != '' and caption_blocks_img != []:
                            captions_image.append((' '.join(caption_image.strip().split()), list(set(caption_blocks_img))))

                        if caption_table != '' and caption_blocks_tab != []:
                            captions_table.append((' '.join(caption_table.strip().split()), list(set(caption_blocks_tab))))
                        caption_table = ''
                        caption_image = ''
                        caption_blocks_img = []
                        caption_blocks_tab = []
                        font_size_fig_caption = first_span_size

            if table_found:
                lines = block.get('lines', [])
                if len(lines) > 0:
                    span_size = lines[0]['spans'][0]['size']
                    if span_size == font_size_tab_caption:
                        for line in block.get('lines', []):
                            for span in line.get('spans',[]):
                                if span['size'] == font_size_tab_caption:
                                    if caption_table == '':
                                        caption_table = span['text']
                                    else:
                                        caption_table = caption_table + ' ' + span['text']
                                    caption_blocks_tab.append(blocks.index(block))

                    else:
                        table_found = False
                else:
                    table_found = False


            if image_found:
                lines = block.get('lines', [])
                if len(lines) > 0:
                    span_size = lines[0]['spans'][0]['size']
                    if span_size == font_size_fig_caption:
                        for line in block.get('lines', []):
                            for span in line.get('spans',[]):
                                if caption_image == '':
                                    caption_image = span['text']
                                else:
                                    caption_image = caption_image + ' ' + span['text']
                                caption_blocks_img.append(blocks.index(block))
                    else:
                        image_found = False
                else:
                    image_found = False

        if caption_image != '':
            captions_image.append((' '.join(caption_image.strip().split()), caption_blocks_img))

        if caption_table != '':
            captions_table.append((' '.join(caption_table.strip().split()), caption_blocks_tab))

    # print(captions_image)
    # print(captions_table)
    # for el in captions_image:
    #     print(el)
    # for el in captions_table:
    #     print(el)
    return captions_table,captions_image

def extract_urls_from_footnote_captions(list_capt):
    urls = []
    i = 0
    while i in range(len(list_capt)):
        el = list_capt[i]
        # el = el.replace('\t', '').replace('\r', '').replace('\n', '')
        # el = ''.join(el.split())
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
        urls[ind] = url
    urls = [url.strip() for url in urls]
    for url in urls:
        if url.endswith('/'):
            urls[urls.index(url)] = url[:-1]
    urls_filtered = ['/'.join(url.split('/')[3:]) for url in urls]
    for url in urls_filtered:
        j = len(url)-1
        ind = urls_filtered.index(url)

        u = url
        while j >= 0 and not (url[-1].isalpha() or url[-1].isdigit()):
            u = url[:j]

            j -= 1
        urls_filtered[ind] = u
    urls_filtered = [url.strip() for url in urls_filtered]

    return urls, urls_filtered

def extract_dois_from_footnote_captions(list_ref):
    dois = []
    for line in list_ref:
        l = re.search(r'\b(10[.]\d+(?:[.][0-9]+)*/(?:(?!["&\'<>])\S)+)\b', line)
        if l is not None:
            u = l.group()
            dois.extend([u])
    return dois


def find_footnotes(doc,references=None): #ok
    f,s = get_main_content_font_and_size(doc)
    # print(f,s)
    lines_to_exclude1, lines_to_exclude2 = lines_to_exclude(doc)
    page_num, block_num = get_references_block(doc)
    final_footnotes = []
    is_footnote = []
    if page_num == '' and block_num == '' and references is not None:
        ref = references[0]
        for pag in range(len(doc)-1, -1, -1):
            p = doc.load_page(pag)
            blocks_p = p.get_text('blocks')
            for b in blocks_p:
                if ref in b[4]:
                    page_num = pag
                    break
            if page_num != '':
                break

    elif references is None:
        page_num = len(doc)


    page_rect = doc.load_page(0).bound()
    middle = abs(page_rect.y0 - page_rect.y1) / 2
    footnote_index_size = ''
    footnote_corpus_size = ''
    for i in range(page_num):
    # for i in range(len(doc)):
        page = doc.load_page(i)
        blocks = page.get_text('dict')['blocks']

        start = len(blocks) - 1

        footnote_found = False
        for block_index in range(len(blocks)):

            cur_ind = start - block_index
            b = blocks[cur_ind]
            if b['bbox'][1] > middle:
                for line in b.get('lines',[]):
                    testo_span = ' '.join(span['text'] for span in line.get('spans', []))
                    if len(line.get('spans',[])) > 0:
                        is_capt = (line.get('spans',[])[0]['text'].lower().startswith('tab') or line.get('spans',[])[0]['text'].lower().startswith('table')
                                or line.get('spans',[])[0]['text'].lower().startswith('fig') or line.get('spans',[])[0]['text'].lower().startswith('figure') or
                                line.get('spans',[])[0]['text'].lower().startswith('img') or line.get('spans',[])[0]['text'].lower().startswith('image'))

                        # if line['dir'] == (1.0, 0.0) and len(line.get('spans',[])) > 0 and (line.get('spans',[])[0]['size'] < s) and not is_capt:
                        if line['dir'] == (1.0, 0.0) and len(line.get('spans',[])) > 1 and (line.get('spans',[])[0]['size'] < s and  line.get('spans',[])[0]['size'] <= line.get('spans',[])[1]['size'] < s) and not is_capt:
                            # if start - block_index not in is_footnote:

                                footnote_found = True
                                if footnote_index_size == '' or footnote_index_size > line.get('spans',[])[0]['size']:
                                    footnote_index_size = line.get('spans',[])[0]['size']
                                if footnote_corpus_size == '' :
                                    footnote_corpus_size = line.get('spans',[])[1]['size']
                                is_footnote.append((start-block_index,footnote_corpus_size,footnote_index_size,b.get('lines',[]).index(line),i,testo_span))

                        elif footnote_found and line.get('spans',[])[0]['size'] == footnote_corpus_size and not is_capt:
                            is_footnote.append(
                                (start - block_index, footnote_corpus_size,0, b.get('lines', []).index(line), i,testo_span))

                        else:
                            # skippo perchè se ho una delle condizioni precedenti non avro una footnote
                            footnote_found = False
                            break
            # if skip:
            #     break
        # if skip:
        #     break

    # ora unisco se parti di footnote appartengono a blocchi differenti
    pages = list(set(([el[4] for el in is_footnote])))
    for p in pages:
        page = doc.load_page(p)
        blocks_all = page.get_text('blocks')
        tmp_footnotes = []
        current_note = ''
        current_size = ''
        foot_per_page = []
        for el in is_footnote:
            if el[4] == p and (el[0],el[4]) not in lines_to_exclude2:
                foot_per_page.append(el)
        # foot_per_page = sorted(foot_per_page, key=lambda tup: tup[0])
        # print(p,foot_per_page)
        i = 0

        blocks = list(set([el[0] for el in foot_per_page]))
        for b in blocks:
            foot_per_b = [el for el in foot_per_page if el[0] == b]
            footnote = ''
            for line in foot_per_b:
                footnote = line[-1] if footnote == '' else footnote + ' ' + line[-1]
            final_footnotes.append(footnote)
    final_footnotes_normed = [norm.normalize(t) for t in final_footnotes]
    footnotes_to_ret = []
    for f in final_footnotes_normed:
        if not(f == '' or all(len(x)<=3 for x in f.split())):
            footnotes_to_ret.append(final_footnotes[final_footnotes_normed.index(f)])


    return footnotes_to_ret

CLEANR = re.compile('<.*?>')
import unicodedata
def normalize(stringa):
    # rimuovo tags

    stringa = re.sub(CLEANR, '', stringa)
    stringa = unicodedata.normalize('NFKD', stringa)
    stringa = stringa.lower()
    # tolgo tutto ciò che non è tra 0 e 9 e tra aA e zZ
    # stringa = re.sub(r'[\W_]+', ' ', stringa)
    stringa = re.sub(r'[^a-z0-9 ]+', '', stringa)
    # it removes only at the end of the string
    # tengo gli ascii
    stringa = re.sub(r'[^\x00-\x7F]+', ' ', stringa)
    # tolgo accenti
    stringa = u"".join([c for c in stringa if not unicodedata.combining(c)])
    # tolgo punctuation
    stringa = ' '.join(word.strip(string.punctuation) for word in stringa.split())
    # tolgo digits
    # stringa = re.sub('\d', '', stringa)
    # tolgo newline
    stringa = stringa.replace('\n+', ' ')
    stringa = stringa.strip()
    stringa = stringa.split()

    # stringa.sort()
    stringa = ' '.join(stringa)
    return stringa

if __name__ == '__main__':
    mem_area = 'prova9.pdf'
    doc = fitz.open('../test/prova9.pdf')
    # page = doc.load_page(7)
    a = extract_caption(doc)
