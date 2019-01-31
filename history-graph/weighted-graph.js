weightedGraph = function () {
    let width = 400,
    height = 400,
    node_radius = 5,
    selection,
    svg;
    

    function chart(selection) {
        let data = selection.datum();
        selection = selection;
        
        let links = data.links,
        nodes = data.nodes;

        svg = selection.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height]);

        let linkStrengthScale = d3.scaleLinear()
            .range([0, 0.5])
            .domain(d3.extent(links, d => d.weight));

        let color = () => {
            const scale = d3.scaleOrdinal(d3.schemeCategory10);
            return d => scale(d.group);
        };


        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).strength(d => Math.sqrt(linkStrengthScale(d.weight))))
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide().radius(30))
            .force("center", d3.forceCenter())
            .on("tick", ticked);

        function ticked(e) {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        };

        const g = svg.append("g")
            .attr("class", "everything");

        const link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", d => Math.sqrt(Math.sqrt(d.weight)));

        link.append("title")
            .text(d => d.weight);

        const node = g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter().append("g")

        const labels = node.append("text")
            .text(d => d.name)
            .attr('x', 6)
            .attr('y', 3)
            .style('fill', 'black')
            .style("font-size", "10px");

        var circles = node.append("circle")
            .attr("r", node_radius)
            .attr("fill", color);
        
        d3.select(selection.node())
            .call(d3.drag()
                .container(selection.node())
                .subject(dragsubject)
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y);
        }

        function dragstarted() {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        }
    }

    chart.width = function(w) {
        if(!arguments.length) {
            return width;
        }
        else {
            width = w;
        }
        return chart;
    };

    chart.height = function (h) {
        if (!arguments.length) {
            return height;
        }
        else {
            height = h;
        }
        return chart;
    };

    chart.nodeRadius = function (radius) {
        if (!arguments.length) {
            return node_radius;
        }
        else {
            node_radius = radius;
        }
        return chart;
    };

    return chart;
}