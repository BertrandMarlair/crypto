import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Widget from '../main/page/widget/widget';

class AllRouter extends Component {
  render() {
    return (
        <React.Fragment>
            <Router>
                <Route path="/" exact component={Widget} />
            </Router>
        </React.Fragment>
    );
  }
}

export default AllRouter;
