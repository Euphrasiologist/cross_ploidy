// the imports

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as lw from "https://cdn.jsdelivr.net/gh/euphrasiologist/lwPhylo@1.0.4/dist/lwPhylo.min_mod.js";

// get the data from the repo
// TODO: eventually change this to the live data on GitHub
const data = d3.csv("../data/Cross_ploidy_families_update.csv").then((d) => {
  return d;
});

// await the data
const data_awaited = await data;

// format the types properly.
let assoc_data = data_awaited.map((d) => {
  return {
    Family: d.Family,
    N_cross: +d.N_cross,
    N_same: +d.N_same,
    N_ploidies: +d.No_Ploidies,
    p: d["P-value from Chi-Square test"]
  };
});

//
let series = d3
  .stack()
  .keys(["N_cross", "N_same"])(assoc_data)
  .map((d) => (d.forEach((v) => (v.key = d.key)), d));

// hardcode the tree
let tree =
  "(((((((((((((Sapindaceae:0.512517477,((Brassicaceae:0.319687113,Resedaceae:0.319687113):0.192830364,((Malvaceae:0.4168029131,Cistaceae:0.4168029131):0,Thymelaeaceae:0.4168029131):0.09571456392):0):0.05900829978,((Onagraceae:0.2726759793,Lythraceae:0.2726759793):0.2988497975,Geraniaceae:0.5715257768):0):0,((((Rosaceae:0.3227752449,((Rhamnaceae:0.2979102525,Elaeagnaceae:0.2979102525):0.01981776832,((Cannabaceae:0.2733699339,Urticaceae:0.2733699339):0,Ulmaceae:0.2733699339):0.04435808692):0.005047224053):0.05779345783,(((Betulaceae:0.1263707401,Myricaceae:0.1263707401):0.06582920227,Fagaceae:0.1921999423):0.1425213354,Cucurbitaceae:0.3347212777):0.04584742499):0.1103535927,(Fabaceae:0.4406623861,Polygalaceae:0.4406623861):0.05025990932):0.02774897744,(Celastraceae:0.4802019258,(((Euphorbiaceae:0.4623804543,Hypericaceae:0.4623804543):0.01782147146,(Linaceae:0.4802019258,((Salicaceae:0.3109663616,Violaceae:0.3109663616):0,Elatinaceae:0.3109663616):0.1692355642):0):0,Oxalidaceae:0.4802019258):-5.551115123e-17):0.03846934705):0.05285450394):0,((Saxifragaceae:0.2933586506,Grossulariaceae:0.2933586506):0.1476019093,(Crassulaceae:0.4202534882,Haloragaceae:0.4202534882):0.02070707167):0.1305652169):0.04717421881,(((((((((Asteraceae:0.313490588,Menyanthaceae:0.313490588):0.07078486703,Campanulaceae:0.3842754551):0,((Adoxaceae:0.3385721637,Caprifoliaceae:0.3385721637):0,(Apiaceae:0.1673850599,Araliaceae:0.1673850599):0.1711871039):0.04570329133):0,Aquifoliaceae:0.3842754551):0.1057197331,((((((((Lamiaceae:0.2701710695,Orobanchaceae:0.2701710695):0.03110773607,(Lentibulariaceae:0.3012788055,Verbenaceae:0.3012788055):0):0,Scrophulariaceae:0.3012788055):0.046167995,Plantaginaceae:0.3474468005):0,Oleaceae:0.3474468005):0.09667673741,(Solanaceae:0.3319730912,Convolvulaceae:0.3319730912):0.1121504468):0.03885013056,((Gentianaceae:0.2835122296,Apocynaceae:0.2835122296):0.138662695,Rubiaceae:0.4221749246):0.06079874389):0.0070215197,Boraginaceae:0.4899951882):0):0,(((Primulaceae:0.3300396193,(Ericaceae:0.2865165289,Diapensiaceae:0.2865165289):0.04352309038):0,Polemoniaceae:0.3300396193):0.08371643222,Balsaminaceae:0.4137560515):0.07623913669):0,Cornaceae:0.4899951882):0.1275782913,((((Caryophyllaceae:0.2403372738,Molluginaceae:0.2403372738):0.09510630715,Amaranthaceae:0.3354435809):0.01593798628,Montiaceae:0.3513815672):0.1867171191,((Plumbaginaceae:0.4024690798,Polygonaceae:0.4024690798):0.1356296066,Droseraceae:0.5380986864):0):0.07947479318):0,Santalaceae:0.6175734795):0.001126516074):0,Buxaceae:0.6186999956):0.006222176316,(Ranunculaceae:0.4289256915,Papaveraceae:0.4289256915):0.1959964805):0.02029259788,Ceratophyllaceae:0.6452147698):0.1558779814,((((((Poaceae:0.5464188036,((Cyperaceae:0.4834120725,Juncaceae:0.4834120725):0.06300673111,Eriocaulaceae:0.5464188036):0):0,Typhaceae:0.5464188036):-1.110223025e-16,(((Amaryllidaceae:0.2910656155,Asparagaceae:0.2910656155):0.01266751952,Iridaceae:0.3037331351):0.1615556336,Orchidaceae:0.4652887687):0.08113003488):0,((Colchicaceae:0.3313109173,Melanthiaceae:0.3313109173):0.05168532225,Liliaceae:0.3829962395):0.163422564):0,(Nartheciaceae:0.3047652207,Dioscoreaceae:0.3047652207):0.2416535829):0.05350093571,((((Alismataceae:0.2435358409,(Hydrocharitaceae:0.1187999982,Butomaceae:0.1187999982):0.1247358427):0.1115111116,((((Potamogetonaceae:0.2973639872,Zosteraceae:0.2973639872):0.04328644087,Ruppiaceae:0.340650428):0.005877444346,Juncaginaceae:0.3465278724):-5.551115123e-17,Scheuchzeriaceae:0.3465278724):0.008519080172):0.01297584198,Tofieldiaceae:0.3680227945):0.1348159822,Araceae:0.5028387767):0.09708096255):0.2011730119):0,Nymphaeaceae:0.8010927512):0.3862850814,Pinaceae:1.187377833):0.1613232782,Cupressaceae:1.348701111):0,Taxaceae:1.348701111);";

// some plot globals
const margin = { top: 0, right: 10, bottom: 10, left: 10 };
const scale = 600;
const width = 890;
const height = 1200 - margin.top - margin.bottom;

// scales
const xScale = d3
  .scaleLinear()
  .domain([-scale * 0.00005, scale * 0.0055])
  .range([0, width]);

const yScale = d3
  .scaleLinear()
  .domain([-scale * 0.008, scale * 0.178])
  .range([height, 0]);

// scales for assoc data
const yScale2 = d3
  .scaleBand()
  .domain(
    assoc_data
      .map((d) => d.Family)
      .map((val, index, array) => array[array.length - 1 - index])
  )
  .range([margin.bottom + 57, height - 57])
  .padding(0.2);

const xScale2 = d3
  .scaleLinear()
  // was d.N before
  .domain([0, 80])
  // range here will need fixing
  .range([490, width - 10]);

const xAxis = (g) =>
  g
    .attr("transform", `translate(0, ${height - 57})`)
    .call(d3.axisBottom(xScale2));

const yAxis = (g) =>
  g
    .attr("transform", `translate(${margin.left + 480},0)`)
    .call(d3.axisLeft(yScale2));

const color = d3
  .scaleOrdinal()
  .domain(series.map((d) => d.key))
  .range(["#a1d99b", "#e5f5e0"])
  .unknown("#ccc");

// the tree!
const tree_df = lw.rectangleLayout(lw.readTree(tree));

// the legend
const legend_ = ["Cross ploidy hybrids", "Same ploidy hybrids"];
const colors = d3.scaleOrdinal(["#a1d99b", "#e5f5e0"]).domain(legend_);

// y axis colour modifications
const more_than_5 = assoc_data.map((d) => d.N_ploidies > 5);
const more_than_5_families = assoc_data
  .map((d) => d.Family)
  .filter((d, i) => more_than_5[i]);

// if there is missing data from this family.
const missing = assoc_data.map((d) => d.N_ploidies === -1);
const missing_families = assoc_data
  .map((d) => d.Family)
  .filter((d, i) => missing[i]);

// now the actual plot
// we target the phylogeny_family_plot div

const svg = d3
  .select("#phylogeny_family_plot")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("font-family", "sans-serif")
  .attr("font-size", 10);

// create a grouping variable

const group = svg.append("g");

const stroke_width = 3;
// draw horizontal lines
group
  .append("g")
  .attr("class", "phylo_lines")
  .selectAll("lines")
  .data(tree_df.horizontal_lines)
  .join("line")
  .attr("class", "lines")
  .attr("x1", (d) => xScale(d.x0) - stroke_width / 2)
  .attr("y1", (d) => yScale(d.y0))
  .attr("x2", (d) => xScale(d.x1) - stroke_width / 2)
  .attr("y2", (d) => yScale(d.y1))
  .attr("stroke-width", stroke_width)
  .attr("stroke", "#777");

// draw vertical lines
group
  .append("g")
  .attr("class", "phylo_lines")
  .selectAll("lines")
  .data(tree_df.vertical_lines)
  .join("line")
  .attr("class", "lines")
  .attr("x1", (d) => xScale(d.x0))
  .attr("y1", (d) => yScale(d.y0))
  .attr("x2", (d) => xScale(d.x1))
  .attr("y2", (d) => yScale(d.y1))
  .attr("stroke-width", stroke_width)
  .attr("stroke", "#777");

// draw nodes
group
  .append("g")
  .attr("class", "phylo_points")
  .selectAll(".dot")
  // remove rogue dot.
  .data(tree_df.horizontal_lines.filter((d) => d.x1 > 0))
  .join("circle")
  .attr("class", "dot")
  .attr("r", function (d) {
    if (d.isTip) {
      return 2.5;
    } else {
      return 2;
    }
  })
  .attr("cx", (d) => xScale(d.x1))
  .attr("cy", (d) => yScale(d.y1))
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("fill", function (d) {
    if (d.isTip) {
      return "black";
    } else {
      return "white";
    }
  });

// add associated data

const group2 = svg.append("g");

group2
  .selectAll("rect")
  .data(series)
  .join("g")
  .attr("fill", (d) => color(d.key))
  .selectAll("rect")
  .data((d) => d)
  .join("rect")
  .attr("x", (d) => xScale2(d[0]))
  .attr("y", (d, i) => yScale2(d.data.Family))
  .attr("width", (d) => xScale2(d[1]) - xScale2(d[0]))
  .attr("height", yScale2.bandwidth());

// draw the significance text

console.log(series);

// console.log(series[1].map((d) => d[1]))

group2
  .selectAll("text")
  .data(series)
  .join("g")
  .selectAll("text")
  .data((d) => d)
  .join("text")
  .text(d => {
    return d.data.p === "" ? "" : +d.data.p > 0.05 ? "ns" : "⁎";
  })
  .attr("x", (d) => xScale2(d.data.N_cross + d.data.N_same + 1))
  .attr("y", (d, i) => yScale2(d.data.Family) + yScale2.bandwidth() - 1)
  .attr("font-family", "sans-serif")
  .attr("font-size", d => {
    return d.data.p === "" ? "" : +d.data.p > 0.05 ? "10" : "15";
});

// add a group for the y-axis
group2
  .append("g")
  .call(yAxis)
  .selectAll("text")
  .text(
    (d, i) => d + " (" + assoc_data.map((d) => d.N_cross).reverse()[i] + ")"
  )
  .style("fill-opacity", (d) =>
    RegExp(missing_families.join("|")).test(d) ? 0.2 : 1
  )
  .style("fill", (d) =>
    RegExp(more_than_5_families.join("|")).test(d) ? "red" : "black"
  );

// add a group for the x-axis
group2
  .append("g")
  // we have to move this group down to the bottom of the vis
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis)
  //add a label for the x-axis
  .append("text")
  .attr("fill", "black")
  .attr("font-family", "sans-serif")
  .attr("x", 700)
  .attr("y", 40)
  .attr("font-size", 20)
  .text("Number of hybrids");

// LEGEND

// Legend as a group
const legend = svg
  .append("g")
  // Apply a translation to the entire group
  .attr("transform", `translate(${height / 1.8}, ${width / 18})`);

const size = 30;
const border_padding = 12;
const item_padding = 5;
const text_offset = 8;

// Boxes
legend
  .selectAll("boxes")
  .data(legend_)
  .enter()
  .append("rect")
  .attr("x", border_padding)
  .attr("y", (d, i) => border_padding + i * (size + item_padding))
  .attr("width", size)
  .attr("height", size)
  .style("fill", (d) => colors(d));

// Labels
legend
  .selectAll("labels")
  .data(legend_)
  .enter()
  .append("text")
  .attr("x", border_padding + size + item_padding)
  .attr(
    "y",
    (d, i) =>
      border_padding + i * (size + item_padding) + size / 2 + text_offset
  )
  .text((d) => d)
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
  .style("font-family", "sans-serif")
  .attr("font-size", 20);
