import { map, uniq } from 'lodash/fp';
import { scaleOrdinal } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';

let groupList = [];
let groupColors;

const init = data => {
  groupList = uniq(map(d => d.group, data.nodes));
  groupColors = scaleOrdinal(schemeSet3).domain(groupList);
};

const getGroupList = () => groupList;

const getGroupColor = g => groupColors(g);

export default { init, getGroupList, getGroupColor };



// WEBPACK FOOTER //
// ./src/services/groups.js