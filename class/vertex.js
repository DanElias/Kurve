/*
* Author: Daniel Elias
* Year: 2020
* Class Vertex called by class Graph to create each vertex for the graph
*/

class Vertex{
    constructor(radius, position, rotation, material, mass, parent_group, id, name){
        //Basics
        this.radius = radius;
        this.material = material;
        this.id = id
        this.name = name;
        this.nameRender = null;
        this.font = null;
        this.name_text_mesh = null;
        this.mass = mass;
       
        //Edges
        this.adjacent_vertices = [];
        this.non_adjacent_vertices = [];

        //Groups
        this.vertex_group = new THREE.Object3D; //for the planet/star/moon/ring
        this.parent_group = parent_group;

        //Geometry
        this.geometry =  new THREE.SphereGeometry(this.radius, 40, 40);
        
        //Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.vertex_group.add(this.mesh);

        //Position / Rotation
        this.position = position;
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
        this.rotation = rotation;
        this.mesh.rotation.x = this.rotation.x;
        this.mesh.rotation.y = this.rotation.y;
        this.mesh.rotation.z = this.rotation.z;

        //Physical Body
        this.physicalBody = App.addPhysicalBody(this.mesh, {mass: this.mass}, this.radius);
        this.physicalBody.collisionResponse = 0;

        //Shadows
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        //Name for collisions
        this.mesh.name = this.id;

        //Adds marker icon
        this.mark = this.addMark();
        
        //Add to the interactables group
        App.collisionGroup.add(this.mesh);

        //Add to parent
        this.parent_group.add(this.vertex_group) 
    }

    /**
     * Adds the name of the vertex on top of it, in case the vertex has a name
     * @param {string} text 
     * @param {THREE Font} font 
     * @param {Vertex} vertex 
     */
    addNameRender(text, font, vertex){
        this.font = font
        //Text will be a TextGeometry
        var text_geometry = new THREE.TextGeometry( text, {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
        } );
        let color = new THREE.Color();
        color.setHex(0x5f00c4); //purple
        let textMaterial = new THREE.MeshBasicMaterial({ color: color });
        this.name_text_mesh = new THREE.Mesh(text_geometry , textMaterial);
        this.name_text_mesh.scale.set(0.01, 0.01, 0.01)
        this.name_text_mesh.position.x = - this.radius / 2
        this.name_text_mesh.position.y = + this.radius * 5.5 //center text
        this.name_text_mesh.position.z = 0
        this.name_text_mesh.name = vertex.mesh.name
        vertex.mesh.add(this.name_text_mesh); //add to the vertex mesh group
    }

    /**
     * Adds a mark icon obj model on top of the vertex
     */
    addMark(){
        let objModel = {obj:'models/obj/location/LocationMarkIcon.obj', map:'images/emojis/wink.png', map2:'images/emojis/red.png' };
        this.mark = App.loadObj(objModel, this.mesh);
    }

}