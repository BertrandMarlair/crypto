import React, { Component } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import EmailIcon from '@material-ui/icons/Email';
import LocationIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import groups from '../services/groups';
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { sortBy } from 'lodash/fp';

class InformationPane extends Component {
  constructWebLink = link => {
    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          website
        </a>
      );
    } else {
      return 'N/A';
    }
  };

  buildConnectionsList = connections => (
    <List dense={true} className="connections_list">
      {sortBy('label', connections).map(connection => (
        <ListItem
          key={connection.id}
          button
          onClick={() => this.props.onSelect(connection.id)}
        >
          <div
            className="legend_color"
            style={{ backgroundColor: groups.getGroupColor(connection.group) }}
          />
          <ListItemText primary={connection.label} />
        </ListItem>
      ))}
    </List>
  );

  render() {
    const label = this.props.node.label;
    const group = this.props.node.group;
    const description =
      this.props.node.attributes['one-liner description'] ||
      'No description available';
    const webLink = this.constructWebLink(
      this.props.node.attributes['web link']
    );
    const email = this.props.node.attributes['contact'] || 'N/A';
    const location = this.props.node.attributes['location'] || 'N/A';
    const close = this.props.onClose;
    const connectionsCount = this.props.node.connections.length;
    const connectionsList = this.buildConnectionsList(
      this.props.node.connections
    );

    return (
      <Paper className="information_pane__paper">
        <Grid container direction="column">
          <Grid item>
            <Grid container>
              <Grid item xs={11}>
                <Typography variant="headline" gutterBottom>
                  {label}
                </Typography>
              </Grid>
              <Grid item xs={1} className="information_pane__close_button">
                <IconButton onClick={close} aria-label="Close">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Typography variant="caption" gutterBottom>
              {group}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" paragraph gutterBottom>
              {description}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item xs={2} className="icon-container">
                <LanguageIcon />
              </Grid>
              <Grid item xs={10}>
                <Typography>{webLink}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item xs={2} className="icon-container">
                <EmailIcon />
              </Grid>
              <Grid item xs={10}>
                <Typography>{email}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item xs={2} className="icon-container">
                <LocationIcon />
              </Grid>
              <Grid item xs={10}>
                <Typography>{location}</Typography> 
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subheading" gutterBottom>
              {connectionsCount} connection{connectionsCount > 1 ? 's' : ''}
            </Typography>
            {connectionsList}
          </Grid>
          <Grid item>
            <Typography variant="caption">
              See anything missing or outdated? Want to have your LinkedIn
              profile referenced? Click{' '}
              <a
                href="https://eightytwentylab.typeform.com/to/T70a1n"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>{' '}
              to give your input.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default InformationPane;



// WEBPACK FOOTER //
// ./src/components/information_pane.js