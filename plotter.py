print('importing libraries')
import json
import extract
import time as t
print('imported libraries')

source_in = ['ndtv','ht','inexp','rw','abp','idto','news18','et','cnbc']
#source_in = ['et']

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

#zee news- infinite scroll
#times now- infinite scroll
# places = pd.DataFrame({'Longitude':[], 'Latitude':[],'Magnitude':[],'h':[]})
# #add calibration here if not aiming for channel selective plotting

# long = []
# lat =[]

# data_exp = json.load(open('source-data.json'))

# print('creating dataframe...')
# for source in source_in:
#     for place in data_exp[source]['data']:
#         cord = data_exp[source]['data'][place]['cordinates']
#         if(place not in places):
#             places.loc[place] = [cord[0],cord[1],data_exp[source]['data'][place]['count'],data_exp[source]['data'][place]['links']]
#         else:
#             places.loc[place][2] = places[place][2] + data_exp[source]['data'][place]['count']
#             places.loc[place][3] = places.loc[place][3].extend(data_exp[source]['data'][place]['links'])

# #calibrating delhi
# # for source in source_in:
# #     count_lis = []
# #     for place in data_exp[source]['data']:
# #         count_lis.append(data_exp[source]['data'][place]['count'])
# #     print(sorted(count_lis))
# #     data_exp[source]['data']['Delhi']['count'] = sorted(count_lis)[-2]

# print('dataframe created')

# print('Plotting...')
# fig = px.density_mapbox(places, lat='Latitude', lon='Longitude', z='Magnitude', radius=15,
#                         center=dict(lat=23.772182, lon=85.092516), zoom=4.75,
#                         mapbox_style="stamen-toner", width=3000, height=1500)
# fig.update_layout(
#     margin=dict(l=0,r=0,b=0,t=0),
#     )
# fig.update(layout_coloraxis_showscale=False)
# print('Plotted, writing')
# fig.write_image("./images/map_update.png")
# #ig.write_html("index1.html")
# print("plot complete")