import React, { Component } from 'react';

import InformationPane from './components/information_pane';
import Graph from './components/graph';
import About from './components/about';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { find, map, pick, tap } from 'lodash/fp';
import groups from './services/groups';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isLoading: false,
      errorLoading: null,
      selectedNode: null
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch('transformed.json')
      .then(response => response.json())
      .then(tap(groups.init))
      .then(data => this.setState({ data: data, isLoading: false }))
      .catch(error => this.setState({ isLoading: false, errorLoading: error }));
  }

  selectNodeHandler(id) {
    if (!id || (this.state.selectedNode && id === this.state.selectedNode.id)) {
      this.setState({ selectedNode: null });
    } else {
      const selectedNode = find(node => node.id === id, this.state.data.nodes);

      this.setState({ selectedNode });
    }
  }

  createSearchOptions() {
    const extractOptions = map(pick(['id', 'label']));
    return this.state.data ? extractOptions(this.state.data.nodes) : [];
  }

  render() {
    const searchOptions = this.createSearchOptions();
    return (
      <Grid container direction="column" alignItems="center">
        {this.state.isLoading && (
          <Grid item>
            {' '}
            <LinearProgress />{' '}
          </Grid>
        )}
        {this.state.errorLoading && (
          <Grid
            item
            className="error_loading"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              Ooww snap, couldn't get my data. Have you tried reloading already?
              Sorry about that.
            </Grid>
          </Grid>
        )}
        <Grid item className="content">
          <Grid container direction="row" justify="center">
            <Grid item md={8} className="content__flex-item">
              {this.state.data && (
                <Graph
                  onNodeSelect={id => this.selectNodeHandler(id)}
                  selectedNode={this.state.selectedNode}
                  graph={this.state.data}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              className="content__flex-item content__information-pane__container"
            >
              <Grid container direction="column" justify="center">
                {this.state.selectedNode ? (
                  <div className="information_pane">
                    {' '}
                    <InformationPane
                      node={this.state.selectedNode}
                      onClose={() => this.selectNodeHandler(null)}
                      onSelect={id => this.selectNodeHandler(id)}
                    />{' '}
                  </div>
                ) : (
                  <About
                    searchOptions={searchOptions}
                    onSelection={id => this.selectNodeHandler(id)}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default App;



// WEBPACK FOOTER //
// ./src/App.js