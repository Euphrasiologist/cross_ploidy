# generate all of the SVG's we want
for GRAPH in ./*.dot; do
    NAME=$(basename $GRAPH .dot)
    dot -Gfontname=Arial -Gdpi=400 -Nfontname=Arial -Efontname=Arial $GRAPH -Tpng:cairo > "../figures/${NAME}.png"
    dot -Gfontname=Arial -Nfontname=Arial -Efontname=Arial $GRAPH -Tsvg > "./${NAME}.svg"
    echo "Layout for ${NAME} done."
done
