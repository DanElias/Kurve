/*
* Author: Daniel Elias
* Year: 2020
* Class Edge called by Graph class to create the edges of the graph
*/

class Edge{
    constructor(id, source, target, source_position, target_position, color, line_width, parent_group){
        //Basics
        this.id = id;
        this.source = source;
        this.target = target;
        this.source_position = source_position;
        this.target_position = target_position
        this.color = color;
        this.line_width = line_width;
        this.parent_group = parent_group;

        this.edge_material = new THREE.LineBasicMaterial( { color: this.color, linewidth: this.line_width } ); 
        let edge_geometry = new THREE.Geometry();
        edge_geometry.dynamic = true;
        //these target and sources ids are used to place the positions of the edge's line
        edge_geometry.vertices.push(new THREE.Vector3(
            this.source_position.x, 
            this.source_position.y, 
            this.source_position.z
        ));
        edge_geometry.vertices.push(new THREE.Vector3(
            this.target_position.x, 
            this.target_position.y, 
            this.target_position.z
        ));
        
        this.mesh = new THREE.Line(edge_geometry, this.edge_material);
        this.mesh.name = "edge_"+this.id; //give a name to the line, to be updated in animation
        this.parent_group.add(this.mesh);

    }
}