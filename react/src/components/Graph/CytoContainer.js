import React from 'react';
import cytoscape from 'cytoscape';
import { Helmet } from "react-helmet";

import { cytoParamsFromContainer } from '../../utils/cytoParams';
import getCytoData from '../../utils/getCytoData';
import InfoBoxEntityUI from './InfoBox/InfoBoxEntityUI';
import SideButtons from './SideButtons/SideButtons';
// import SearchBar from '../Search/SearchBar';
import ShiftToScroll from './SideButtons/ShiftToScroll';


let defaultStyle = {
  margin: 'auto',
  width: '70%',
  height: parseInt(window.screen.availHeight / 2, 10) + 'px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center'
};

const cyStyles = {
  'browser': {
    ...defaultStyle,
  },
  'extension': {
    ...defaultStyle,
    height: '400px',
    width: '700px',
    padding: '0px',
    // float: 'right'
  },
  'mobile': {
    ...defaultStyle,
    width: '98%',
    minHeight: '300px'
  }
};

class CytoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.updateEntityInfoBox(this.props.match.params.entityId);

    if (this.props.clientType === 'mobile' && this.props.show.sideButtons) {
      this.props.toggle('sideButtons');
    }

    let scroll = false;
    if (this.props.clientType === 'mobile') {
      scroll = true;
    }

    this.state = {
      update: false,
      changeWiki: false,
      focus: 0,
      scroll: scroll,
      shiftToScroll: false
    };
  }

  showShiftToScroll = (event) => {
    if (event.target.tagName === "CANVAS") {
      if (this.state.scroll) {
        this.setState({
          shiftToScroll: false
        });
        clearTimeout(this.timeout)
      } else {
        this.setState({
          shiftToScroll: true
        });
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.setState({
            shiftToScroll: false
          });
        }, 1500);
      }
    }
  }

  allowScroll = (event) => {
    if (event.keyCode === 16) {
      this.setState({
        scroll: true
      });
      this.cy.userPanningEnabled(true);
      this.cy.userZoomingEnabled(true);
    }
  }

  preventScroll = (event) => {
    if (event.keyCode === 16) {
      this.setState({
        scroll: false
      })
      this.cy.userPanningEnabled(false);
      this.cy.userZoomingEnabled(false);
    }
  }

  focusSearchBar = () => {
    this.setState({
      focus: this.state.focus + 1
    })
  }


  componentWillMount() {
    const location = parseInt(this.props.match.params.entityId, 10);
    if (this.props.clientType !== 'mobile') {
      document.addEventListener("keydown", this.allowScroll, false);
      document.addEventListener("keyup", this.preventScroll, false);
      document.addEventListener("wheel", this.showShiftToScroll, false)
    }
    if (location !== this.props.currentDisplay) {
      this.props.displayEntity(location);
      this.props.updateEntityInfoBox(location);
    }
  }

  componentWillUnmount() {
    if (this.props.clientType !== 'mobile') {
      document.removeEventListener("keydown", this.allowScroll, false);
      document.removeEventListener("keyup", this.preventScroll, false);
      document.removeEventListener("wheel", this.showShiftToScroll, false)
    }
    this.props.show.ftux && this.props.toggleFtux();
    this.timeout !== undefined && clearTimeout(this.timeout);
  }



  renderCytoscapeElement = () => {

    const time = false;
    if (time) {
      console.time('Full Cyto');
      console.time('      Data Cyto');
    }
    const container = this;
    const data = this.props.data;
    const id = this.props.match.params.entityId;
    const entity = data.entities.ids[id];
    let cytoData = getCytoData(data, entity);

    const graphHistory = sessionStorage.getItem('graphHistory');
    if (!graphHistory) {
      sessionStorage.setItem('graphHistory', JSON.stringify(
        [id]
      ));
      sessionStorage.setItem('location', JSON.stringify(
        0
      ));
    }

    if (time) {
      console.timeEnd('      Data Cyto');
      console.time('      Render Cyto');
    }
    var cyElement = document.getElementById('cy');
    const cy = cytoscape(cytoParamsFromContainer(cyElement, cytoData, entity.id));
    cy.ready(() => {
      cy.elements('node[category != "s"]').on(
        'tap',
        (event) => {
          this.setState({
            changeWiki: true
          });
          container.props.updateEntityInfoBox(event.target.id());
        },
      );
      cy.elements('node').on(
        'drag',
        (event) => {
          console.log('drag');
          event.preventDefault();
          return false
        },
      );
      if (time) {
        console.timeEnd('      Render Cyto');
        console.timeEnd('Full Cyto');
      }
    });
    cy.userZoomingEnabled(this.state.scroll);
    cy.on('mouseover', 'node', function (evt) {
      document.body.style.cursor = 'pointer';
    });
    cy.on('mouseout', 'node', function (evt) {
      document.body.style.cursor = 'default';
    });
    this.cy = cy;
  }

  componentDidMount() {
    this.setState({
      update: true
    });
    this.renderCytoscapeElement()
    if (this.props.clientType === 'mobile') {
      this.cy.panningEnabled(true);
      this.cy.userZoomingEnabled(true);
      this.cy.zoomingEnabled(true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const location = parseInt(this.props.match.params.entityId, 10);
    if (location !== this.props.currentDisplay) {
      this.props.displayEntity(location);
      this.props.updateEntityInfoBox(location);
      this.renderCytoscapeElement();
    }
  }

  render() {

    if (!this.props.show.searchBar) {
      defaultStyle.marginTop = '20px'
    }

    this.cy && console.log(this.cy.userPanningEnabled());
    this.cy && console.log(this.cy.userZoomingEnabled());

    const id = this.props.match.params.entityId;
    const entity = this.props.data.entities.ids[id];

    return (
      <div>
        <Helmet>
          <title>Metada - {entity.name}</title>
        </Helmet>
        <div id="cy" style={cyStyles[this.props.clientType]} onContextMenu={this.handleContextMenu} >
          {this.props.clientType !== 'mobile' && this.state.shiftToScroll && <ShiftToScroll {...this.props} />}
        </div>
        <SideButtons
          {...this.props}
          focusSearchBar={this.focusSearchBar}
          reRenderGraph={this.renderCytoscapeElement}
          shiftToScroll={this.state.shiftToScroll}
        />
        <InfoBoxEntityUI {...this.props} changeWiki={this.state.changeWiki} cytoScroll={this.state.scroll} />
      </div>
    );
  }
}


export default CytoContainer;