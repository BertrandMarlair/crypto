import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Widget extends Component {
    render() {
        const { classes } = this.props; 
        return (
            <React.Fragment>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="h3">
                        Cryptospace.be - The State of the Belgian Blockchain ecosystem
                    </Typography>
                    <Typography variant="h6">
                        Aims to support greater publicity around Blockchain projects in the Plat Pays, fostering entrepreneurship and connections between individuals and ventures. Based on publicly available data.
                        If you want to have your project listed, to correct some data (which might be outdated), or simply contribute, click here.
                        Click on a node or search to get more information.
                    </Typography>
                    <Divider/>
                    <Typography variant="headline">
                        Maintained by Thomas Vanderstraeten from Cryptizens.io, developed with Guillaume Vankeerberghen, with friendly input from folks at Hive, Hey, The BAB, TheLedger, KeyRock, and others. Thanks to all
                    </Typography>
                </Paper>
            </React.Fragment>
        );
    }
}

Widget.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Widget);
