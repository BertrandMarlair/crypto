import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { find, map, pick, tap } from 'lodash/fp';

import InformationPane from '../components/information_pane';
import About from '../components/about';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Widget extends Component {
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
        const { classes } = this.props; 
        const searchOptions = this.createSearchOptions();

        return (
            <React.Fragment>
                <Grid container direction="column" justify="center">
                    {this.state.selectedNode ?
                        <div className="information_pane">
                            {' '}
                            <InformationPane
                                node={this.state.selectedNode}
                                onClose={() => this.selectNodeHandler(null)}
                                onSelect={id => this.selectNodeHandler(id)}
                            />
                            {' '}
                        </div>
                    :
                        <About
                            searchOptions={searchOptions}
                            onSelection={id => this.selectNodeHandler(id)}
                        />
                    }
                </Grid>
            </React.Fragment>
        );
    }
}

Widget.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Widget);
