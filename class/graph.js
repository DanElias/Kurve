/*
* Author: Daniel Elias
* Year: 2020
* Graph Class, creates vertices, edges and visualizes the graph
*/

class Graph{
    constructor(json_data, radius, position, rotation, parent_group){
        //Basics
        this.json_data = json_data;
        this.radius = radius;
        this.position = position;
        this.rotation = rotation;
        this.parent_group = parent_group;
        this.vertices = {}; //the dictionary of the graph's vertices, key = vertex id
        this.edges = {};//dictionary of the graph's edges, key = source vertex id

        //An icosahedron is used to give positions to each of the graph's vertices based on this geometry's vertices
        let approx_positions = 0
        let num_vertices = Object.keys(json_data.vertices).length
        //The icosahedron level of vertices is increased depending of the num of vertices
        if( num_vertices > 12) approx_positions += 1
        if( num_vertices > 42) approx_positions += 1
        if( num_vertices > 162) approx_positions += 1
        if( num_vertices > 462) approx_positions += 1
        if( num_vertices > 2562) approx_positions += 1
        if( num_vertices > 10242) approx_positions += 1
        if( num_vertices > 40952) approx_positions += 1
        //This means the app can handle 40952 vertices
        
        let icosahedron_geometry = new THREE.IcosahedronGeometry(30*(approx_positions+2), approx_positions);
        let pos = 0 //used to access each of the icosahedron's vertices

        //create a vertex object for each of the vertices in the data json
        for(let vertex of  this.json_data.vertices){
            let new_vertex = new Vertex(
                0.5, 
                icosahedron_geometry.vertices[pos], 
                {x: 0, y: 0, z: 0},  
                App.materials.emissive_yellow, 
                0.1, 
                this.parent_group, 
                vertex.id, 
                vertex.name
            );
            //save the new vertex object in the dictionary of vertices for later use
            this.vertices[vertex.id] = new_vertex
            pos += 1
        }

        //create the edges connecting the graph's vertices
        //json data already has the target and source id
        let edges_id = 0
        for(let edge of this.json_data.edges){
            //Saves in the target vertex the adjacent source vertex and viceversa
            this.vertices[edge.source].adjacent_vertices.push(edge.target);
            this.vertices[edge.target].adjacent_vertices.push(edge.source);
            //create the edge
            this.edges[edges_id] = new Edge(
                edges_id,
                edge.source, 
                edge.target, 
                this.vertices[edge.source].mesh.position,
                this.vertices[edge.target].mesh.position, 
                0x5900ff, 
                1, 
                this.parent_group
            );
            edges_id += 1;
        }

        //Saves the non-adjacent vertices for each vertex
        for (var id in this.vertices) {
            //get a copy of adjacent vertices and include self to do a difference between arrays
            let adj_vertices_self = this.vertices[id].adjacent_vertices.slice(0);
            adj_vertices_self.push(id)
            let nonadj = Object.keys(this.vertices).filter(x => adj_vertices_self.indexOf(x) === -1)
            for(let non_adj_vertex of nonadj){
                this.vertices[id].non_adjacent_vertices.push(non_adj_vertex);
            }
            //Add rotation to the vertex
            this.vertices[id].physicalBody.angularVelocity.y = 2
            //Increase the size of the vertices with more connections
            let connections = this.vertices[id].adjacent_vertices.length + 1;
            this.vertices[id].mesh.scale.set(
                (this.vertices[id].mesh.scale.x + connections) * 0.3,
                (this.vertices[id].mesh.scale.y + connections) * 0.3,
                (this.vertices[id].mesh.scale.z + connections) * 0.3
            );
        }

        //Give the graph's vertices a name tag with the Three.js TextGeometry
        //json data already has the name of each vertex
        var loader = new THREE.FontLoader();
        loader.load( 'fonts/Bebas_Regular.json', function ( font ) {
            for (var id in App.graph.vertices) {
                if (App.graph.vertices.hasOwnProperty(id)) {
                    if(App.graph.vertices[id].name != null)           
                        App.graph.vertices[id].addNameRender(App.graph.vertices[id].name, font, App.graph.vertices[id])
                }
            }
        });

    }
}