import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// get the data from the repo
// TODO: eventually change this to the live data on GitHub
const raw_data = d3.csv("../data/British_plant_ploidies.csv").then((d) => {
  return d;
});

// await the data
const data_awaited = await raw_data;

// format the types properly.
let data = data_awaited.map((d) => {
  return {
    Species: d.Species,
    Genus: d.Genus,
    Family: d.Family,
    Order: d.Order,
    // two maps is probably inefficient?
    Ploidy: d.Ploidy.split(",")
      .map((d) => d.replace(/ \(.{1}[0-9].{1}/g, ""))
      .map(Number),
    Base: +d.Base,
    Chromosome_number: d.Chromosome_number.split(",").map(Number),
    No_Ploidies: +d.No_diff_ploidies,
  };
});

// plot globals
// margin
const m = { top: 50, right: 25, bottom: 50, left: 80 };
const h = 700;
const w = 1000;

// the svg element
// the plot itself
const svg = d3
  .select("#ploidy_distribution_plot")
  .append("svg")
  .attr("id", "alternativeChart")
  .attr("viewBox", [0, 0, w, h])
  .style("background", "white");

// scales and axes
// for all ploidies
const x1 = d3
  .scaleLinear()
  .domain([2, 23])
  .range([m.left, w - m.right]);

// histogram data itself.
let histogram_data = {};
histogram_data.Ploidy = d3
  .histogram()
  .domain(x1.domain())
  .thresholds(x1.ticks(22))(data.map((d) => d.Ploidy[0]));

histogram_data.No_ploidies = d3
  .histogram()
  .domain([1, d3.max(data.map((d) => d.No_Ploidies))])
  .thresholds(x1.ticks(22))(data.map((d) => d.No_Ploidies));

histogram_data.Family = "All";

let family_data = d3
  .groups(data, (d) => d.Family)
  // map and return ploidy as array and family
  // slot in d3.histogram   --ploidy levels across species
  .map(function(d, i) {
    return {
      Ploidy: d3
        .histogram()
        // 2 because diploid
        .domain([2, d3.max(d[1].map((d) => d.Ploidy[0]))])
        // 22 should be replaced?
        .thresholds(x1.ticks(22))(d[1].map((d) => d.Ploidy[0])),
      // --ploidy levels within species
      No_ploidies: d3
        .histogram()
        // 2 because diploid
        .domain([1, d3.max(d[1].map((d) => d.No_Ploidies))])
        // 22 should be replaced?
        .thresholds(x1.ticks(22))(d[1].map((d) => d.No_Ploidies)),
      Family: d[0],
    };
  });
family_data.unshift(histogram_data);

// x axis won't change for now.
const xAxisBottom1 = (g) =>
  g
    .attr("transform", `translate(0, ${h - m.bottom})`)
    .call(d3.axisBottom(x1).ticks(d3.max(data, (d) => d.Ploidy[0])));

// colours!
const colour = d3
  .scaleLinear()
  .domain([0, 180, 360])
  .range(["#28CC5F", "#F29D48", "#FF3232"]);

let y1, yAxisLeft1;

// add all the select options.
function setup(FAMILY_DATA) {
  d3.select("select.family_select")
    .on("change", () => update(FAMILY_DATA))
    .selectAll("option")
    .data(FAMILY_DATA.map((d) => d.Family).sort(d3.ascending))
    .join("option")
    .attr("value", (d) => d)
    .text((d) => d);

  let FAMILY = d3.select("select.family_select").property("value");

  y1 = d3
    .scaleLinear()
    .domain([
      d3.max(
        family_data.filter((d) => d.Family === FAMILY)[0].Ploidy,
        (d) => d.length
      ),
      0,
    ])
    .nice()
    .range([m.left, h - m.bottom]);

  yAxisLeft1 = (g) =>
    g.attr("transform", `translate(${m.left},0)`).call(
      d3
        .axisLeft(y1)
        // to make sure we are only plotting integer tick marks
        // see https://stackoverflow.com/a/56821215
        .tickValues(y1.ticks().filter((tick) => Number.isInteger(tick)))
        .tickFormat(d3.format("d"))
    );

  // add the axes
  svg
    .append("g")
    .call(xAxisBottom1)
    .selectAll("text")
    .attr("transform", "translate(22.5,0)")
    .attr("font-size", 16)
    .attr("font-family", "Helvetica")
    .text(function(d) {
      if (d < 23) {
        return d;
      }
    });

  svg
    .append("g")
    .call(yAxisLeft1)
    .attr("class", "y axis")
    .attr("font-size", 16)
    .attr("font-family", "Helvetica");

  // axis titles
  // x
  svg
    .append("text")
    .data(["Ploidy level"])
    .attr("font-size", 16)
    .attr("font-family", "Helvetica")
    .attr("font-weight", "bold")
    .attr("transform", (d) => `translate(${w / 2.2}, ${h - 10})`)
    .text((d) => d);

  // y
  svg
    .append("text")
    .data(["Count"])
    .attr("font-size", 16)
    .attr("font-family", "Helvetica")
    .attr("font-weight", "bold")
    .attr("transform", (d) => `translate(${m.left - 50}, ${h / 2})rotate(270)`)
    .style("text-anchor", "end")
    .text((d) => d);
}

function update(DATA) {
  // get value
  let FAMILY = d3.select("select.family_select").property("value");
  // update scales
  y1 = d3
    .scaleLinear()
    .domain([
      d3.max(
        family_data.filter((d) => d.Family === FAMILY)[0].Ploidy,
        (d) => d.length
      ),
      0,
    ])
    .nice()
    .range([m.left, h - m.bottom]);

  svg.select(".y.axis").transition().duration(1000).call(yAxisLeft1);

  // add the actual bars
  svg
    // .append("g")
    .selectAll("rect")
    .data(family_data.filter((d) => d.Family === FAMILY)[0].Ploidy)
    .join(
      (enter) =>
        enter
          .append("rect")
          .transition()
          .duration(1000)
          .attr("fill", (d) => colour(50))
          .attr("x", (d) => x1(d.x0) + 1)
          .attr("width", x1(1) + 4)
          .attr("y", (d) => y1(d.length))
          .attr("height", (d) => y1(0) - y1(d.length)),
      (update) =>
        update
          .transition()
          .duration(1000)
          .attr("x", (d) => x1(d.x0) + 1)
          .attr("width", x1(1) + 4)
          .attr("y", (d) => y1(d.length))
          .attr("height", (d) => y1(0) - y1(d.length)),
      (exit) =>
        exit
          .transition()
          .attr("x", (d) => x1(d.x0) + 1)
          .attr("width", x1(1) + 4)
          .attr("y", (d) => y1(0))
          .attr("height", (d) => 0)
          .duration(1000)
          .remove()
    );
}

setup(family_data);
update(family_data);
