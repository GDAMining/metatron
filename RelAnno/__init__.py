from RelAnno_App.grobid_client_python.grobid_client.grobid_client import GrobidClient
import sys
import os
import requests

while True:
    print("trying to connecto....")
    try:
        response = requests.get("http://gro:8070/")
        if response.status_code == 200:
            print("Received a 200 response!")
            break  # Break the loop when a 200 response is received
        else:
            print("Response code:", response.status_code)
            time.sleep(1)
    except:
        pass
workpath = os.path.dirname(os.path.abspath(__file__)) 

config_path = os.path.join(workpath, '../config.json')
out_path = os.path.join(workpath, './pdf')

client = GrobidClient(config_path=config_path)
xml_file_found = False
files = os.listdir(out_path)
client.process("processFulltextDocument", out_path, output=out_path)
# Iterate through the files
while not xml_file_found:
    for file in files:
        if file.endswith(".xml"):
            xml_file_found = True
            break
    
    if not xml_file_found:
        # Wait or perform other actions while waiting for the XML file
        pass



