import React from 'react';

import Grid from '@material-ui/core/Grid';

import groups from '../services/groups';

function Legend() {
  return (
    <Grid container>
      {groups.getGroupList().map(g => (
        <Grid item key={g}>
          <Grid container alignItems="center">
            <div
              className="legend_color"
              style={{ backgroundColor: groups.getGroupColor(g) }}
            />
            <span className="legend_label"> {g} </span>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default Legend;



// WEBPACK FOOTER //
// ./src/components/legend.js