// thanks https://stackoverflow.com/questions/57798877/button-for-downloading-svg-in-javascript-html
function downloadSVG(elementID) {
  const svg = document.getElementById(elementID).innerHTML;
  const blob = new Blob([svg.toString()]);
  const element = document.createElement("a");
  element.download = elementID + ".svg";
  element.href = window.URL.createObjectURL(blob);
  element.click();
  element.remove();
}
