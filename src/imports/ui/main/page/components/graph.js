import React from 'react';
import * as d3 from 'd3';

import groups from '../services/groups';

import './graph.css';

import { cloneDeep, find, flatMap, fromPairs, map, range } from 'lodash/fp';

class Graph extends React.Component {
  componentDidMount() {
    // D3's forces mutate the nodes and links so
    // clone the input
    this.updaters = this.drawGraph(cloneDeep(this.props.graph));
  }

  shouldComponentUpdate(nextProps) {
    this.updaters.updateSelected(
      nextProps.selectedNode && nextProps.selectedNode.id
    );

    // Prevents component re-rendering
    return false;
  }

  render() {
    return <div className="graph_container" />;
  }

  /**
   * D3 world
   **/
  drawGraph(graph) {
    const WIDTH = 700;
    const HEIGHT = 700;
    const LEFT_RIGHT_PADDING = 34;
    const TOP_BOTTOM_PADDING = 12;
    const FORCE_STRENGTH = -25;
    const FORCE_LINK_STRENGTH = 2;
    const MAX_DISTANCE = 100;

    const LABEL_ANCHOR_FORCE_STRENGTH = -20;
    const LABEL_ANCHOR_MAX_DISTANCE = 60;
    const LABEL_ANCHOR_LINK_DISTANCE = 2;
    const LABEL_ANCHOR_LINK_STRENGTH = 2;

    const MIN_RADIUS = 4;
    const MAX_RADIUS = 18;

    const FADED_OPACITY = 0.2;

    const sizeScale = d3
      .scaleLinear()
      .domain([0, 20])
      .range([MIN_RADIUS, MAX_RADIUS]);

    const svg = d3
      .select('div.graph_container')
      .append('svg')
      .attr('width', WIDTH + 2 * LEFT_RIGHT_PADDING)
      .attr('height', HEIGHT + 2 * TOP_BOTTOM_PADDING);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const chargeForce = d3
      .forceManyBody()
      .strength(FORCE_STRENGTH)
      .distanceMax(MAX_DISTANCE);

    const linkForce = d3
      .forceLink()
      .id(d => d.id)
      .strength(FORCE_LINK_STRENGTH);

    const simulation = d3
      .forceSimulation()
      .force('link', linkForce)
      .force('charge', chargeForce)
      .force('center', d3.forceCenter(width / 2, height / 2));

    const labelAnchorChargeForce = d3
      .forceManyBody()
      .strength(LABEL_ANCHOR_FORCE_STRENGTH)
      .distanceMax(LABEL_ANCHOR_MAX_DISTANCE);

    const labelAnchorLinkForce = d3
      .forceLink()
      .distance(LABEL_ANCHOR_LINK_DISTANCE)
      .strength(LABEL_ANCHOR_LINK_STRENGTH);

    const simulationLabels = d3
      .forceSimulation()
      .force('charge', labelAnchorChargeForce)
      .force('link', labelAnchorLinkForce);

    const labelAnchors = flatMap(
      node => [{ node: node }, { node: node }],
      graph.nodes
    );

    const labelAnchorLinks = map(
      i => ({
        source: i * 2,
        target: i * 2 + 1,
        weight: 1
      }),
      range(0, labelAnchors.length / 2)
    );

    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line.nodeLink')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('class', 'nodeLink')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', d => sizeScale(d.connections.length))
      .style('fill', d => groups.getGroupColor(d.group))
      .on(
        'mouseover',
        d => (this.props.selectedNode ? '' : highlightNeighbours(d))
      )
      .on('mouseout', () => (this.props.selectedNode ? '' : removeHighlight()))
      .on('click', d => this.props.onNodeSelect(d.id))
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    const anchorLink = svg
      .append('g')
      .selectAll('line.anchorLink')
      .data(labelAnchorLinks)
      .enter()
      .append('line')
      .attr('class', 'anchorLink');

    const anchorNode = svg
      .append('g')
      .selectAll('g.anchorNode')
      .data(labelAnchors)
      .enter()
      .append('g')
      .attr('class', 'anchorNode')
      .attr('i', (d, i) => i);

    anchorNode.append('circle').attr('r', 0);
    anchorNode
      .append('text')
      .attr('class', 'label')
      .attr('pointer-events', 'none')
      .text((d, i) => (i % 2 === 0 ? '' : d.node.label))
      .style(
        'visibility',
        d => (d.node.group === 'Individual' ? 'hidden' : 'visible')
      );

    simulation.nodes(graph.nodes);

    simulation.force('link').links(graph.links);

    // Has to happen after passing nodes and links to forces as they will
    // add index and replace source and target with the corresponding node object
    const linkedByIndex = fromPairs(
      map(
        link => [link.source.index + ',' + link.target.index, true],
        graph.links
      )
    );

    simulationLabels.nodes(labelAnchors);

    simulationLabels.force('link').links(labelAnchorLinks);

    simulation.on('tick', ticked);

    function ticked() {
      node
        .attr(
          'cx',
          d =>
            (d.x = Math.max(
              LEFT_RIGHT_PADDING,
              Math.min(width - LEFT_RIGHT_PADDING, d.x)
            ))
        )
        .attr(
          'cy',
          d =>
            (d.y = Math.max(
              TOP_BOTTOM_PADDING,
              Math.min(height - TOP_BOTTOM_PADDING, d.y)
            ))
        );

      anchorNode.each(function(d, i) {
        if (i % 2 === 0) {
          d.x = d.node.x;
          d.y = d.node.y;
        } else {
          const b = this.childNodes[1].getBBox();

          const diffX = d.x - d.node.x;
          const diffY = d.y - d.node.y;

          const dist = Math.sqrt(diffX * diffX + diffY * diffY);

          let shiftX = b.width * (diffX - dist) / (dist * 2);
          shiftX = Math.max(-b.width, Math.min(0, shiftX));
          const shiftY = 0;
          this.childNodes[1].setAttribute(
            'transform',
            'translate(' + shiftX + ',' + shiftY + ')'
          );
        }
      });

      anchorNode.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      anchorLink
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.2).restart();
        simulationLabels.alphaTarget(0.2).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      d.fx = null;
      d.fy = null;
      if (!d3.event.active) {
        simulation.alphaTarget(0);
        simulationLabels.alphaTarget(0);
      }
    }

    function isConnected(a, b) {
      return (
        linkedByIndex[a.index + ',' + b.index] ||
        linkedByIndex[b.index + ',' + a.index] ||
        a.index === b.index
      );
    }

    function highlightNeighbours(originNodeData) {
      node.each(function(nodeData, j) {
        const thisOpacity = isConnected(originNodeData, nodeData)
          ? 1
          : FADED_OPACITY;

        d3
          .select(this)
          .transition()
          .style('stroke-opacity', thisOpacity)
          .style('fill-opacity', thisOpacity);
      });

      link
        .transition()
        .style(
          'stroke-opacity',
          d =>
            d.source.index === originNodeData.index ||
            d.target.index === originNodeData.index
              ? 1
              : FADED_OPACITY
        );

      anchorNode
        .select('text')
        .transition()
        .style(
          'visibility',
          d => (isConnected(originNodeData, d.node) ? 'visible' : 'hidden')
        )
        .style(
          'font-weight',
          d => (originNodeData.index === d.node.index ? 'bold' : 'normal')
        );
    }

    function removeHighlight() {
      node
        .transition()
        .style('stroke-opacity', 1)
        .style('fill-opacity', 1);
      link.transition().style('stroke-opacity', 1);
      anchorNode
        .select('text')
        .transition()
        .style(
          'visibility',
          d => (d.node.group !== 'Individual' ? 'visible' : 'hidden')
        )
        .style('font-weight', 'normal');
    }

    function updateSelected(selectedNodeId) {
      if (!selectedNodeId) {
        removeHighlight();
      } else {
        const originNodeData = find({ id: selectedNodeId }, graph.nodes);
        highlightNeighbours(originNodeData);
      }
    }

    return { updateSelected };
  }
}

export default Graph;



// WEBPACK FOOTER //
// ./src/components/graph.js