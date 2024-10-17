/* Style Dark Matter GL */
/* arcgis source */
const arcgis_hybrid = "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json";
/* openStreetMap source */
const openStreetMap = "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json";
/* cartocdn source */
const darkMatter = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const darkMatterNoLabels = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";
const positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const positronNoLabels = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
const voyager = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const voyagerNoLabels = "https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json";
/* icgc source */
const icgc = "https://geoserveis.icgc.cat/contextmaps/icgc.json";
const icgc_mapa_base_fosc = "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json";
const icgc_ombra_hipsometria_corbes = "https://geoserveis.icgc.cat/contextmaps/icgc_ombra_hipsometria_corbes.json";
const icgc_ombra_fosca = "https://geoserveis.icgc.cat/contextmaps/icgc_ombra_fosca.json";
const icgc_orto_estandard = "https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json";
const icgc_orto_estandard_gris = "https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard_gris.json";
const icgc_orto_hibrida = "https://geoserveis.icgc.cat/contextmaps/icgc_orto_hibrida.json";
const icgc_geologic_riscos = "https://geoserveis.icgc.cat/contextmaps/icgc_geologic_riscos.json";

//https://geoserveis.icgc.cat/contextmaps/icgc_geologic_riscos.json

var styles = [  
    { 
      label: 'OpenStreetMap', 
      source: openStreetMap
    },
    { 
      label: 'ArcGIS Hybrid', 
      source: arcgis_hybrid
    },
    { 
      label: 'Positron', 
      source: positron 
    },
    { 
      label: 'Positron No Labels', 
      source: positronNoLabels
    },
    { 
      label: 'Dark Matter', 
      source: darkMatter
    },
    { 
      label: 'Dark Matter No Labels', 
      source: darkMatterNoLabels
    },
    { 
      label: 'Voyager', 
      source: voyager 
    },
    { 
      label: 'Voyager No Labels', 
      source: voyagerNoLabels
    },
    { 
      label: 'icgc', 
      source: icgc
    },
    { 
      label: 'icgc_mapa_base_fosc', 
      source: icgc_mapa_base_fosc
    },
    { 
      label: 'icgc_ombra_hipsometria_corbes', 
      source: icgc_ombra_hipsometria_corbes
    },
    { 
      label: 'icgc_ombra_fosca', 
      source: icgc_ombra_fosca
    },
    { 
      label: 'icgc_orto_estandard', 
      source: icgc_orto_estandard
    },
    { 
      label: 'icgc_orto_estandard_gris', 
      source: icgc_orto_estandard_gris
    },
    { 
      label: 'icgc_orto_hibrida', 
      source: icgc_orto_hibrida
    },
    { 
      label: 'icgc_geologic_riscos', 
      source: icgc_geologic_riscos
    },
];

// Add Menu Options
const menu = document.getElementsByClassName('side-menu')[0];

let activeStyle = null;

styles.forEach(style => {
  let link = document.createElement('a');
  link.innerHTML = style.label;
  link.onclick = (e) => {
    map.setStyle(style.source);
    document.querySelector('.active')?.classList.remove('active');
    e.srcElement.classList.add('active');
  };
  menu.appendChild(link);
  
  // the first item will be active
  if (!activeStyle) {
    link.classList.add('active');
    activeStyle = {
      source: style.source
    };
  }
});

// Initialise the map
const map = new maplibregl.Map({
  container: 'map',
  style: activeStyle.source,
  center: [-100.2,38.1],
  zoom: 4
});

// Add the navigation control
map.addControl(new maplibregl.NavigationControl());

map.on('load', () => {
  // Add Map Sources
  // Add Map Layers
})