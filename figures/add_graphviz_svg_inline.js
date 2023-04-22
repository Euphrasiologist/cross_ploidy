// these are the files and their class names
// I could have programmatically generated the classes
// but oh well!
const files = {
  "./crosses/business_as_usual.svg": "business_as_usual",
  "./crosses/diploid_tetraploid_hybridisation1.svg":
    "diploid_tetraploid_hybridisation1",
  "./crosses/diploid_tetraploid_hybridisation2.svg":
    "diploid_tetraploid_hybridisation2",
  "./crosses/diploid_tetraploid_hybridisation3.svg":
    "diploid_tetraploid_hybridisation3",
  "./crosses/diploid_tetraploid_hybridisation4.svg":
    "diploid_tetraploid_hybridisation4",
  // TODO: these last graphs
  // "./crosses/backcross_triploid1.svg": "",
  // "./crosses/backcross_triploid2.svg": "",
};

// add all the SVG inline
for (const key in files) {
  let file = key;
  let div_id = files[key];

  fetch(file)
    .then((r) => r.text())
    .then((text) => {
      let el = document.getElementById(div_id);
      el.innerHTML = text;
    })
    .then((d) => {
      // all the elements to iterate over
      const hybrid_outcome_elements =
        document.getElementsByClassName("hybrid_outcome");
      const endosperm_elements =
        document.getElementsByClassName("endosperm_outcome");

      function changeStyle(elements, arrow_color, ellipse_color) {
        let originalArrowColor, originalEllipseColor;
        for (var i = 0; i < elements.length; i++) {
          // because the nodes are in a <g> element.
          let el = elements[i].querySelector(":nth-child(2)");
          if (el.nodeName == "path") {
            originalArrowColor =
              elements[i].querySelector(":nth-child(2)").style.stroke;
            // path element
            elements[i].querySelector(":nth-child(2)").style.stroke =
              arrow_color;
            // arrowhead
            elements[i].querySelector(":nth-child(3)").style.fill = arrow_color;
            elements[i].querySelector(":nth-child(3)").style.stroke =
              arrow_color;
          } else {
            originalEllipseColor =
              elements[i].querySelector(":nth-child(2)").style.fill;
            elements[i].querySelector(":nth-child(2)").style.fill =
              ellipse_color;
          }
        }
        return [originalArrowColor, originalEllipseColor];
      }

      //
      function createMouseEvents(hover_elements, all_elements) {
        // get the length of the elements
        let n = hover_elements.length;
        // now iterate over the elements
        for (let i = 0; i < n; i++) {
          // find out what the current graph is by looking at the class name
          let curr_el = hover_elements[i];
          // [1] because [0] is always edge/node
          let curr_el_name = curr_el.className.baseVal.split(" ")[1];
          // filter the elements based on the current graph
          let current_graph = Array.from(all_elements).filter((d) =>
            d.className.baseVal.includes(curr_el_name)
          );

          // add the styling to the SVG
          let prev_arrow_color, prev_ellipse_color;
          hover_elements[i].onmouseover = function () {
            [prev_arrow_color, prev_ellipse_color] = changeStyle(
              current_graph,
              "#616469",
              "yellow"
            );
          };
          hover_elements[i].onmouseout = function () {
            changeStyle(current_graph, prev_arrow_color, prev_ellipse_color);
          };
        }
      }

      // now just select the element which we will hover over
      let hybrid_outcome_hover_elements = document.getElementsByClassName(
        "hybrid_outcome onhover"
      );
      let endosperm_hover_elements = document.getElementsByClassName(
        "endosperm_outcome onhover"
      );
      createMouseEvents(hybrid_outcome_hover_elements, hybrid_outcome_elements);
      createMouseEvents(endosperm_hover_elements, endosperm_elements);
    })
    .catch(console.error.bind(console));
}
