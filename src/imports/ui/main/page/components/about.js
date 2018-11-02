import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Legend from './legend';
import Search from './search';

class About extends Component {
  render() {
    const searchOptions = this.props.searchOptions;
    const onSelection = this.props.onSelection;

    return (
      <Paper className="about__paper">
        <Typography variant="headline" gutterBottom>
          Cryptospace.be - The State of the Belgian Blockchain ecosystem
        </Typography>
        <Typography gutterBottom>
          Aims to support greater publicity around Blockchain projects in the
          Plat Pays, fostering entrepreneurship and connections between
          individuals and ventures. Based on publicly available data.
        </Typography>
        <Typography gutterBottom>
          If you want to have your project listed, to correct some data (which
          might be outdated), or simply contribute, click{' '}
          <a
            href="https://eightytwentylab.typeform.com/to/T70a1n"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </Typography>
        <Typography gutterBottom>
          Click on a node or search to get more information.
        </Typography>
        <Search options={searchOptions} onSelection={onSelection} />
        <Typography gutterBottom variant="subheading">
          Node types
        </Typography>
        <div className="about_paper__legend_container">
          <Legend />
        </div>
        <Divider />
        <Typography variant="caption" gutterBottom>
          Maintained by Thomas Vanderstraeten from{' '}
          <a
            href="https://cryptizens.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cryptizens.io
          </a>, developed with Guillaume Vankeerberghen, with friendly input
          from folks at Hive, Hey, The BAB, TheLedger, KeyRock, and others.
          Thanks to all!
        </Typography>
      </Paper>
    );
  }
}

export default About;