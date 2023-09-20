# generate all of the SVG's we want
for GRAPH in ./*.dot; do
    NAME=$(basename $GRAPH .dot)
    dot $GRAPH -Tsvg > "./${NAME}.svg"
done