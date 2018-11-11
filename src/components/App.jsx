/* global window, Event, PLATFORM */
/* eslint no-underscore-dangle: ["error", { "allow": ["_map"] }] */

import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PlaneReplayControls from '../containers/PlaneReplayControls';
import '../stylesheets/map.less';

const PlanesPanel = React.lazy(() => import('../containers/PlanesPanel'));
const PlanesMap = React.lazy(() => import('../containers/PlanesMap'));

let MobileOverlay = null;
if (PLATFORM === 'electron') {
  MobileOverlay = React.lazy(() => import('./MobileOverlay'));
}

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      isPanelOpen: false,
      isMobileOverlayVisible: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeys);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown');
  }

  handleMapLoad = (map) => {
    if (!map) return;
    this._map = map.getWrappedInstance();
  }

  togglePanel = () => {
    this.setState(({ isPanelOpen }) => ({ isPanelOpen: !isPanelOpen }));
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  handleKeys = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      this.togglePanel();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="map-canvas-wrapper" className={this.state.isPanelOpen ? 'shrinked' : ''}>
          <React.Suspense fallback={<div />}>
            <PlanesMap
              ref={this.handleMapLoad}
              containerElement={<div style={{ height: '100%' }} />}
              mapElement={<div style={{ height: '100%' }} />}
            />
          </React.Suspense>
          <PlaneReplayControls />
          <div className="buttons">
            {PLATFORM === 'electron' && (
              <Tooltip title="Open map elsewhere">
                <Button
                  size="small"
                  variant="raised"
                  onClick={() => this.setState({ isMobileOverlayVisible: true })}
                >
                  <OpenInNewIcon />
                </Button>
              </Tooltip>
            )}
            <Tooltip title={this.state.isPanelOpen ? 'Hide panel' : 'Show panel'}>
              <Button size="small" variant="raised" color="primary" onClick={this.togglePanel}>
                <MenuIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
        <Drawer variant="persistent" anchor="right" open={this.state.isPanelOpen}>
          <React.Suspense fallback={<div id="panel" />}>
            <PlanesPanel />
          </React.Suspense>
        </Drawer>
        {PLATFORM === 'electron' && (
          <React.Suspense>
            <MobileOverlay
              visible={this.state.isMobileOverlayVisible}
              onClose={() => this.setState({ isMobileOverlayVisible: false })}
            />
          </React.Suspense>
        )}
      </React.Fragment>
    );
  }
}
