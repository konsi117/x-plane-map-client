/* globals L */
/* eslint class-methods-use-this: "off" */
import { GridLayer, withLeaflet } from 'react-leaflet';

require('leaflet.gridlayer.googlemutant');

class GoogleMapLayer extends GridLayer {
  createLeafletElement() {
    return L.gridLayer.googleMutant({
      type: 'roadmap',
    });
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
  }
}

export default withLeaflet(GoogleMapLayer);
