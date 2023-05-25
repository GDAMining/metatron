import Levenshtein as lev
from gensim.utils import tokenize
from gensim.parsing.preprocessing import strip_tags
import html
import re

CLEANR = re.compile('<.*?>')

def clean(el):
    description = ' '.join(el.split())
    description = html.unescape(description)
    description = re.sub(CLEANR, '', description)
    return description

def normalize(stringa):
    stringa = strip_tags(stringa)
    tokens = tokenize(stringa, deacc=True, lower=True,encoding = 'utf8')
    # tokens.sort()
    stringa = ' '.join(tokens)
    return stringa


def normalize_authors(stringa):
    tokens = list(tokenize(stringa, deacc=True, lower=True,encoding='utf8'))
    tokens.sort()
    stringa = ' '.join(tokens)
    return stringa


def check_string(string1, string2):
    distance = lev.distance(string1, string2)
    if string1 == '' or string2 == '':
        return False

    if string1 == string2 or string1 in string2 or string2 in string1 or distance < 5:
        return True

    return False

def overlap_coefficient(string1, string2):
    string1_list = list(string1.split())
    string2_list = list(string2.split())

    intersection = list(filter(lambda x: x in string1_list, string2_list))
    coeff = len(intersection) / min(len(string1_list), len(string2_list))

    return coeff

def overlap_surname(string1, string2):
    string1_list = list(string1.split())
    string2_list = list(string2.split())
    string1_list = [el for el in string1_list if len(el) > 1]
    string2_list = [el for el in string2_list if len(el) > 1]
    intersection = list(filter(lambda x: x in string1_list, string2_list))
    coeff_surname = 0.0
    if len(string2_list) > 0 and len(string1_list) > 0:
        coeff_surname = len(intersection) / min(len(string1_list), len(string2_list))
    if coeff_surname > 0:
        return True
    return False

def check_string_description(string1, string2):
    string1_list = list(string1.split())
    string2_list = list(string2.split())

    intersection = list(filter(lambda x: x in string1_list, string2_list))
    coeff = len(intersection) / max(len(string1_list), len(string2_list))

    distance = lev.distance(string1, string2)
    if string1 == '' or string2 == '':
        return False

    if string1 == string2 or distance < 20 or coeff >= 0.85:
        return True
    return False

def unicode_to_char(text):
    text = text.replace("\\u00e0", "à")
    text = text.replace("\\u00e4", "ä")
    text = text.replace("\\u00e2", "â")
    text = text.replace("\\u00e7", "ç")
    text = text.replace("\\u00e8", "è")
    text = text.replace("\\u00e9", "é")
    text = text.replace("\\u00ea", "ê")
    text = text.replace("\\u00eb", "ë")
    text = text.replace("\\u00ee", "î")
    text = text.replace("\\u00ef", "ï")
    text = text.replace("\\u00f4", "ô")
    text = text.replace("\\u00f6", "ö")
    text = text.replace("\\u00f9", "ù")
    text = text.replace("\\u00fb", "û")
    text = text.replace("\\u00fc", "ü")
    text = text.replace("\\u00b0", "°")
    text = text.replace("\\u00e3", "ã")
    text = text.replace("\\u2044", "/")


    text = text.replace("\u00e0", "à")
    text = text.replace("\u00e4", "ä")
    text = text.replace("\u00e2", "â")
    text = text.replace("\u00e7", "ç")
    text = text.replace("\u00e8", "è")
    text = text.replace("\u00e3", "ã")

    text = text.replace("\u00e9", "é")
    text = text.replace("\u00ea", "ê")
    text = text.replace("\u00eb", "ë")
    text = text.replace("\u00ee", "î")
    text = text.replace("\u00ef", "ï")
    text = text.replace("\u00f4", "ô")
    text = text.replace("\u00f6", "ö")
    text = text.replace("\u00f9", "ù")
    text = text.replace("\u00fb", "û")
    text = text.replace("\u00fc", "ü")
    text = text.replace("\u00b0", "°")
    text = text.replace("\u00e31", "°")
    text = text.replace("\u2044", "/")

    return text

import jaro
def check_authors(string1,string2):
    distance = jaro.jaro_winkler_metric(string1, string2)
    inits_a = ' '.join([el[0].lower() for el in string1.split()])
    inits_ap = ' '.join([el[0].lower() for el in string2.split()])
    coeff_initials = overlap_coefficient(inits_a, inits_ap)
    coeff = overlap_coefficient(string1, string2)
    if distance >= 0.95 and (coeff >= 0.5 and (all(el in inits_ap for el in inits_a) or all(el in inits_a for el in inits_ap)) and overlap_surname(string1, string2)):
        return True
    else:
        return False
