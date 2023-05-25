FROM python:3.8-buster
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m pip install --no-cache-dir git+https://github.com/OntoGene/PyBioC.git
RUN python -m pip install --no-cache-dir git+https://github.com/kermitt2/grobid_client_python

# Change the working directory to the cloned repository
WORKDIR /code/grobid_client_python

# Run the setup.py script
WORKDIR /code
COPY . /code/
