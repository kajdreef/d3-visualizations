function timeline() {
    let radius = 5,
        colorFunction = () => { return "#F0F" },
        space = 100,
        text_margin = 10 + radius;

    function sortDates(data) {
        return data.sort((d1, d2) => { return Date.parse(d2.date) - Date.parse(d1.date) });
    }

    function setLocation(data) {
        let x = 0,
            y = 0;

        for (let i = 0; i < data.length; i++) {
            data[i].x = x;
            data[i].y = y;
            y += space;
        }
        return data;
    }

    function mouseOver(d, i) {
        d3.select(this)
            .transition(1)
            .attr('r', radius + 0.3 * radius);
    }

    function mouseOut(d, i) {
        d3.select(this)
            .transition(1)
            .attr('r', radius);
    }
    function chart(selection) {
        let data = selection.datum();
        selection = selection;

        let nodes = setLocation(sortDates(data)),
            width = 400,
            height = nodes.length * space;

        const timeline = selection.append("svg")
            .attr("viewBox", [-50, -space / 2, width, height])
            .attr("width", width)
            .attr("height", height);


        timeline.append('line')
            .attr('y1', 0)
            .attr('y2', (height - space))
            .attr('x1', 0)
            .attr('x2', 0)
            .attr("style", "stroke:rgb(0,0,0);stroke-width:2");


        const node = timeline.selectAll("g")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node");

        node.append('circle')
            .attr('fill', (d) => colorFunction(d))
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('r', radius)
            .on('mouseover', mouseOver)
            .on('mouseout', mouseOut)

        node.append('text').text(d => d.title)
            .attr("x", (d) => d.x + text_margin)
            .attr("y", (d) => d.y);


        return timeline.node();
    }

    chart.radius = (r) => {
        radius = r;
        return chart;
    }

    chart.space = (s) => {
        space = s;
        return chart;
    }

    chart.color = function (color) {
        console.log("abc");
        if (!arguments.length == 0) {
            colorFunction = color;
        }
        return chart;
    }

    return chart;
}