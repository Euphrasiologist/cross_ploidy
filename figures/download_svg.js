// thanks https://stackoverflow.com/questions/57798877/button-for-downloading-svg-in-javascript-html
function downloadSVG(elementID) {
  let svg_inner = document.getElementById(elementID);

  svg_inner.firstChild.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
  const svg = svg_inner.innerHTML;
  const blob = new Blob([svg.toString()]);
  const element = document.createElement("a");
  element.download = elementID + ".svg";
  element.href = window.URL.createObjectURL(blob);
  element.click();
  element.remove();
}
