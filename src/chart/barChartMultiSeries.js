import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as component } from "../component";

/**
 * Reusable 3D Bar Chart
 *
 * @module
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["green", "red", "yellow", "steelblue", "orange"];
	let classed = "x3dBarChart";
	let debug = false;

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let categoryNames = dataSummary.rowKeys;
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).rangeRound([0, dimensions.x]).padding(0.5) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]).nice() :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleBand().domain(categoryNames).range([0, dimensions.z]).padding(0.7) :
			zScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
	 */
	function my(selection) {
		let x3d = selection.append("x3d")
			.attr("width", width + "px")
			.attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true")
		}

		let scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		let layers = ["axis", "chart"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		let viewpoint = component.viewpoint();
		scene.call(viewpoint);

		scene.append("directionallight")
			.attr("direction", "1 0 -1")
			.attr("on", "true")
			.attr("intensity", "0.4")
			.attr("shadowintensity", "0");

		scene.each(function(data) {
			init(data);

			// Construct Axis Component
			let axis = component.axisThreePlane()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Bars Component
			let chart = component.barsMultiSeries()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colors(colors);

			scene.select(".axis")
				.call(axis);

			scene.select(".chart")
				.datum(data)
				.call(chart);
		});
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _ - X3D Canvas Height in px.
	 * @returns {*}
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _ - X3D Canvas Height in px.
	 * @returns {*}
	 */
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {Object} _ - D3 Scale.
	 * @returns {*}
	 */
	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.zScale = function(_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Color Scale.
	 * @returns {*}
	 */
	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _ - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	/**
	 * Debug Getter / Setter
	 *
	 * @param {Boolean} _ - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function(_) {
		if (!arguments.length) return debug;
		debug = _;
		return my;
	};

	return my;
}