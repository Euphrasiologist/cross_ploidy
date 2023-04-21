import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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

      function changeStyle(elements, color) {
        for (var i = 0; i < elements.length; i++) {
          // because the nodes are in a <g> element.
          elements[i].querySelector(":nth-child(2)").style.fill = color;
        }
      }
      // now just select the element which we will hover over
      let hybrid_outcome_hover_elements = document.getElementsByClassName(
        "hybrid_outcome onhover"
      );
      let n = hybrid_outcome_hover_elements.length;

      for (let i = 0; i < n; i++) {
        let curr_el = hybrid_outcome_hover_elements[i];
        let curr_el_name = curr_el.className.baseVal.split(" ")[1];
        let current_graph = Array.from(hybrid_outcome_elements).filter((d) =>
          d.className.baseVal.includes(curr_el_name)
        );

        hybrid_outcome_hover_elements[i].onmouseover = function () {
          changeStyle(current_graph, "yellow");
        };
        hybrid_outcome_hover_elements[i].onmouseout = function () {
          changeStyle(current_graph, "none");
        };
      }
    })
    .catch(console.error.bind(console));
}
