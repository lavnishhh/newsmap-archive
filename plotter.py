print('importing libraries')
import json
import extract
import time as t
print('imported libraries')

source_in = ['ndtv','ht','inexp','rw','abp','idto','news18','et','cnbc','zee']

with open('data.json', 'r') as j:
     json_inp = json.loads(j.read())

def update_data(sources):
    source_index = {}
    ind = 0
    for source in json_inp:
        source_index[source['source_tag']] = ind
        ind+=1
    for source_id in sources:
        print('started '+source_id)
        if(source_id in source_index):
            json_inp[source_index[source_id]] = getattr(extract, source_id)()
        else:
            json_inp.append(getattr(extract, source_id)())
        print('finished '+source_id)

    with open('./data.json', 'w') as jso:
            json.dump(json_inp,jso,indent=3)

update_data(source_in)