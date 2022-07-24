var json_data
var loc = [];
var pins = {};
var news_sources = {}
var source_index = {}
async function fetchData() {

  const response = await fetch('./data.json');
  json_data = await response.json();
  var index = 0
  json_data.forEach(source => {
      news_sources[source.source_tag] = {'source-tag':source['source_tag'], 'image-url':source['image']};
      source_index[source.source_tag] = index;
      index += 1;
  });
}


fetchData();

const sources = ['ht','ndtv','rw','idto']
var map
var hiddenCityLabels = {
  "version": "1.0",
  "elements": {
      "point": {
          "labelVisible": false,
          "visible":false,
      },
      "transportation": {
        "visible": false
      },
      "river": {
        "visible": false
      },
      "vegetation": {
        "visible":false
      },
  }
};
window.onload = function() {
  map = new window.Microsoft.Maps.Map('#plotMap', {
    credentials: 'Asmd15OlhpdjArghMT1ycEvtCYiXMkL2Syp3DO0xxafdxG5JyWEURj2hCxmLNy3s',
    center: new window.Microsoft.Maps.Location(23.5, 83),
    maxZoom: 6,
    minZoom: 4,
    zoom: 5,
    enableDrag:false,
    showMapTypeSelector: false,
    enableSearchLogo: false,
    enableClickableLogo: false,
    showMapTypeSelector: false,
    showDashboard: false,
    disableUserInput: false,
    showMapLabels: false,
    customMapStyle: hiddenCityLabels
  });

  map.setOptions({
    maxBounds: map.getBounds(),
  });

  json_data.forEach(source => {
    for(const [place, data] of Object.entries(source.data)){
      if(!(place in pins)){
        pins[place] = {}
        pins[place]['cordinates'] = [data.cordinates[1], data.cordinates[0]]
        pins[place]['data'] = {}
        pins[place]['data'][source.source_tag] = data.links
      }
      else{ 
        pins[place]['data'][source.source_tag] = data.links
      }
      for(let i = 0; i < data.count; i++){
        loc.push(new Microsoft.Maps.Location(data.cordinates[1], data.cordinates[0]))
      }
    }
  });

  const infobox_html_template = `<div id="infoboxText" style="background-color:rgba(208,208,205,0.8); border-radius:15px; width:400px; height:400px; padding: 10px;">
  <div id="source-list" style = "overflow-y: auto;"></div>
  {source-list}
</div>`;

  for(const [place, data] of Object.entries(pins)){
    var infobox_source_html = '{source-logo}'
    for(const [source, links] of Object.entries(data.data)){
      infobox_source_html = infobox_source_html.replace('{source-logo}',source_logo_template).replace('{image-url}',news_sources[source]['image-url'])
    }
    var info_html = infobox_html_template
    info_html = info_html.replace('{source-list}', infobox_source_html.replace('{source-logo}',''))
    var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(15,83), 
          { htmlContent: info_html,
            visible: false 
        });
    var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(data.cordinates[0], data.cordinates[1]),{
      icon: createNullPoint()
    });
    pushpin.metadata = {
      title: place,
      cordinates: data.cordinates,
      info: data.data
    }
    map.entities.push(pushpin);
    Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', updateMenu);
    Microsoft.Maps.Events.addHandler(pushpin, 'click', updateMenu);
  }

  Microsoft.Maps.loadModule('Microsoft.Maps.HeatMap', function () {
    var heatmap = new Microsoft.Maps.HeatMapLayer(loc, {
        intensity: 0.1,
        radius: 50000,
        unit: 'meters', 
        colorGradient: {
            '0': 'Black',
            '0.4': 'Purple',
            '0.6': 'Red',
            '0.8': 'Yellow',
            '1': 'White'
        }
    });
    map.layers.insert(heatmap);
});
}

const source_logo_template = `<div onclick="updateLinkMenu(this,{onclick-data-ref})" style="background-image: url({image-url});" class="source-logo"></div>`
const news_item_template = `<div class="news-item">
<div>
    <a href="{news-url}" target="_blank"}>
      <img target="_blank" src="{image-url}">
    </a>
</div>
<a href="{news-url}" target="_blank">{title}</a>
</div>`
function updateMenu(e){
  if(e.target.metadata){
    updateLinkMenu()
    var source_list_item = document.getElementById('source_list');
    const place_text = document.getElementById('place_name');
    const cords_text = document.getElementById('cordinates');

    place_text.textContent = e.target.metadata.title;
    cordinates.textContent = e.target.metadata.cordinates[0] + ", " + e.target.metadata.cordinates[1];
    source_list_item.innerHTML = '' 
    for(const [source, links] of Object.entries(e.target.metadata.info)){
      source_list_item.innerHTML += source_logo_template.replace('{image-url}',news_sources[source]['image-url'])
      .replace('{onclick-data-ref}',"'" + e.target.metadata.title + '-' + source + "'") 
    }
  }
}

function updateLinkMenu(self,data_ref){
  const link_list_item = document.getElementById('news_list');
  link_list_item.innerHTML = "";
  if(!data_ref){return;}
  source = data_ref.split('-')[1]
  place = data_ref.split('-')[0]
  json_data[source_index[source]].data[place].links.forEach(link_data => {
    var link = link_data.title
    if (link.length > 65){
      link = link.substring(0,65) + ". . ."
    }
    link_list_item.innerHTML += news_item_template
    .replace('{news-url}',link_data.url)
    .replace('{news-url}',link_data.url)
    .replace('{image-url}',link_data.img)
    .replace('{title}',link)
  })
}

function createNullPoint() {
  var c = document.createElement('canvas');
  c.width = 24;
  c.height = 24;
  var ctx = c.getContext('2d');
  ctx.fillStyle = '#f00';
  // Draw a path in the shape of an arrow.
  // Generate the base64 image URL from the canvas.
  return c.toDataURL();
}
