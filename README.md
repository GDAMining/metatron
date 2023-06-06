# MetaTron version 1.0.0
![logo.png](./metatron img/logo.png)

MetaTron is an open-source, collaborative, web-based annotation targeting the biomedical domain. 
All the source code, the installation guidelines, and instructions to use the tool are availanle in this repository.

## Requirements
MetaTron is available online at http://metatron.dei.unipd.it. In order to locally deploy MetaTron in your computer or in a remote server you need Docker and docker-compose. To install them, you can follow the instructions available at: https://docs.docker.com/get-docker/ (Docker) and https://docs.docker.com/compose/install/ (docker-compose). 

Clone or donwload this repository. Open the **metatron** folder and, replace the url provided in the url.txt file with the url of the server where MetaTron will be deployed. Your url must replace the default one: http://0.0.0.0:8000. 

Run a new terminal session and run ```docker-compose up```. This procedure will take some minutes depending on your hardware and you internet connection. When the procedure is finished you can open a new browser winodw (chrome is recommended) and you can start uploading new documents.

## Annotation
### Mention-level
MetaTron provides three types of mention-level annotation. Mention-level annotations concern specific text-spans inside the document's textual content, hence, they do not consider the entire document. Mention-level annotations are: (i) mentions annotation, (ii) concepts linking, and (iii) relationship annotation.

**Mentions annotation**
Mentions are text-spans in a textual document which can be linked to an entity in a knowledge base. There are three possible mention annotation procedures:

1. if the mention includes a single word, intended as a sequence of characters between two white-spaces, you can double-click on the word;
2. If the mention includes two or more words, just click on the first and last words and the sequence of adjacent words will be automatically annotated;
3. If the mention is a substring of one or more words (hence it is not comprised within two white spaces), drag and drop from the first to the last character you want to annotate

When a mention is selected, it will be highlighted in blue color.

**The mention panel**
When a new mention is selected, it is possible to open a mention panel by right-clicking on the mention. A menu with a set of options is displayed, in particular, from the mention panel it is possible to:

1. Get more information about the mention -- i.e., the time of annotation and the number of annotators who annotated the mention;
2. Receive some suggestions about the concepts that can be associated to the mention;
3. Link a new concept;
4. Add a relationship;

![panel.png](./metatron img/2jpg)

**Concepts linking**
It is possible to link a concept to a mention. Concepts are named entitied belonging to an ontology. 

To associate a new concept to a mention, right-click on the mention and select the option 

## Customizability
## Collections and collaboration
The main functionalities of MetaTron are the listed below, in particular it supports:

  - three mention-level and two document-level annotations types
  - support for click-away mention annotation 
  - support for drag and drop mention annotation
  -  
