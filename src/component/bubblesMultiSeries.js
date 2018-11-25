import * as d3 from "d3";
import dataTransform from "../dataTransform";
import componentBubbles from "./bubbles";

/**
 * Reusable 3D Multi Series Bubble Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["green", "red", "yellow", "steelblue", "orange"];
	let classed = "x3dBubblesMultiSeries";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeDomain = [0.5, 3.0];

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { rowKeys, maxCoordinates, maxValue } = dataTransform(data).summary();
		const extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(extent).range(sizeDomain);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bubblesMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each((data) => {
			init(data);

			// Construct Bars Component
			const bubbles = componentBubbles()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.sizeScale(sizeScale)
				.color((d) => colorScale(d.key));

			// Create Bar Groups
			const bubbleGroup = selection.selectAll(".bubbleGroup")
				.data(data);

			bubbleGroup.enter()
				.append("group")
				.classed("bubbleGroup", true)
				.each(function(d) {
					let color = colorScale(d.key);
					bubbles.color(color);
					d3.select(this).call(bubbles);
				})
				.merge(bubbleGroup);

			bubbleGroup.exit()
				.remove();

		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 Scale.
	 * @returns {*}
	 */
	my.xScale = function(_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 Scale.
	 * @returns {*}
	 */
	my.zScale = function(_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_x) {
		if (!arguments.length) return sizeScale;
		sizeScale = _x;
		return my;
	};

	/**
	 * Size Domain Getter / Setter
	 *
	 * @param {number[]} _x - Size min and max (e.g. [0.5, 3.0]).
	 * @returns {*}
	 */
	my.sizeDomain = function(_x) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _x;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _x - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	return my;
}
