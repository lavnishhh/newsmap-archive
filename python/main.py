print('importing libraries')
import json
import extract as extract
import time as t
print('imported libraries')

source_in = ['ndtv','ht','inexp','rw','abp','idto','news18','et','zee','timnow']
#source_in = ['inexp']
#rw time
with open('data/data.json', 'r') as j:
     json_inp = json.loads(j.read())

def update_data(sources):
    source_index = {}
    ind = 0
    for source in json_inp:
        source_index[source['source_tag']] = ind
        ind+=1
    for source_id in sources:
        so_t = t.time()
        print('started '+source_id)
        if(source_id in source_index):
            json_inp[source_index[source_id]] = getattr(extract, source_id)()
        else:
            json_inp.append(getattr(extract, source_id)())
        print('finished '+source_id)
        print(t.time() - so_t)

        with open('data/data.json', 'w') as jso:
                json.dump(json_inp,jso,indent=3)

ti = t.time()

update_data(source_in)

print(t.time()-ti)
