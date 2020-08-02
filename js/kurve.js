/**
 * Sets the Physical World, Interactions and Force Directed Graph Algorithm operations
 * Author: Daniel Elias
 * Year: 2020
 * 
 */

 /**
  * Starts the Kurve application with its logic and physics
  */
App.init = function () {
    //Mouse and Raycast Collisions Setup 
    this.mouse = {x: 0, y: 0}; //mouse positions
    this.INTERSECTED = null; //intersected objects in group
    this.CLICKED = null; //clicked object
    this.SELECTED_VERTEX = null; //selected object
    this.collisionGroup = new THREE.Object3D(); //only objects in this group will be interactable
    this.root.add(this.collisionGroup);
    
    //To display in HTML the current selected vertex
    this.selected_vertex_div = document.getElementById('selected_vertex_div');
    
    //Eades' Force Directed Graph Algorithm Constants
    this.c1 = 2;//2 in Algorithm
    this.c2 = 1;//1 in Algorithm
    this.c3 = 1;//1 in Algorithm
    this.c4 = 0.1;//0.1 in Algorithm
    this.m = 100;//100 in Algorithm = recommended force calculation iterations
    this.ticks = 0//keep track of time
    this.tminusM = 0;//ticks to reach m

    //Graph Json to be displayed
    let json_name = document.getElementById('json').innerHTML;

    //Load the json data of the graph, most be loaded synchronously to continue
    this.json_data = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': json_name,
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })(); 

    //Animation variable
    this.timestamp = 0;

    // setup physic world
    this.initPhysicalWorld();

     //Create the graph Graph
    this.graph = new Graph(this.json_data, 1, {x:0, y:0, z:0}, {x:0, y:0, z:0}, this.root)
};

/**
 * Creates the Cannon Js Physical World
 */
App.initPhysicalWorld = function () {
    this.world = new CANNON.World();
    this.damping = 0.8;
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.defaultContactMaterial.contactEquationStiffness = 1e7;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;
    this.world.gravity.set(0, 9, 0);
    this.world.solver.iterations = 10;
    //For the animation of the physical world
    this.lastTime;
    this.fixedTimeStep = 1.0 / 60.0; //seconds
    this.maxSubSteps = 3;
};

/**
 * //Creates the Physical Bodies for the meshes required
 * @param {THREE Object3D} mesh 
 * @param {object} bodyOptions //includes mass
 * @param {number} radius 
 */
App.addPhysicalBody = function (mesh, bodyOptions, radius) {
    var shape = new CANNON.Sphere(radius);//at the moment only spheres are needed
    var body = new CANNON.Body(bodyOptions);
    body.position.copy(mesh.position)
    body.addShape(shape);
    body.linearDamping = this.damping;
    //body.computeAABB();
    //body.collisionResponse = true;
    this.world.add(body);
    return body;
};

/**
 * Animation - update the THREE Scene objects
 * @param {number} delta 
 */
App.update = function (delta) {
    this.timestamp += delta;
    this.ticks+=1
    //Change gravity approximately every second - levitation effect
    if(this.ticks == 60){
        this.world.gravity.y *= -1
        this.ticks = 0;
    }

    //Calculate the Forces between vertices with Eades' Algorithm
    if(this.tminusM < this.m){ //recommended to be repeated m times only
        for (var id in this.graph.vertices) {
            
            if (this.graph.vertices.hasOwnProperty(id)) {
                let vertex = this.graph.vertices[id]
                //Calculate the Attracting forces between adjacent vertices
                for(var adj_id of vertex.adjacent_vertices){
                    let target_vertex = this.graph.vertices[adj_id];
                    let separation = {x: 0, y:0, z:0}
                    separation.x = vertex.physicalBody.position.x - target_vertex.physicalBody.position.x;
                    separation.y = vertex.physicalBody.position.y - target_vertex.physicalBody.position.y;
                    separation.z = vertex.physicalBody.position.z - target_vertex.physicalBody.position.z;
                    //Magnitude of the separation vector between the ajacent vertices position vectors
                    let distance = Math.sqrt(Math.pow(separation.x,2) + Math.pow(separation.y,2) + Math.pow(separation.z,2));
                    //Logarithmic force - when distance = this.c2, the force will be 0
                    let force = this.c1 * Math.log10(distance / this.c2); 
                    //Force converted to a velocity vector using normalization
                    let new_velocity = {
                        x: separation.x * force / distance * this.c4, 
                        y: separation.y * force / distance * this.c4, 
                        z: separation.z * force / distance * this.c4
                    };
                    //Apply the new velocity to the ajdacent vertex
                    target_vertex.physicalBody.velocity.x += new_velocity.x ;
                    target_vertex.physicalBody.velocity.y += new_velocity.y ;
                    target_vertex.physicalBody.velocity.z += new_velocity.z ;
                }
                //Calculate the Repelling forces between non-adjacent vertices
                for(var non_adj_id of vertex.non_adjacent_vertices){
                    let target_vertex = this.graph.vertices[non_adj_id];
                    let separation = {x: 0, y:0, z:0}
                    separation.x = vertex.physicalBody.position.x - target_vertex.physicalBody.position.x;
                    separation.y = vertex.physicalBody.position.y - target_vertex.physicalBody.position.y;
                    separation.z = vertex.physicalBody.position.z - target_vertex.physicalBody.position.z;
                    //Magnitude of the separation vector between the ajacent vertices position vectors
                    let distance = Math.sqrt(Math.pow(separation.x,2) + Math.pow(separation.y,2) + Math.pow(separation.z,2));
                    // Inverse squared force for the non-adjacent vertices
                    let force = this.c3 / Math.pow(distance,2);
                    //Force converted to a velocity vector using normalization
                    let new_velocity = {
                        x: separation.x * force / distance * this.c4, 
                        y: separation.y * force / distance * this.c4, 
                        z: separation.z * force / distance * this.c4,
                    };
                    //Apply the new velocity to the current vertex
                    target_vertex.physicalBody.velocity.x += new_velocity.x ;
                    target_vertex.physicalBody.velocity.y += new_velocity.y ;
                    target_vertex.physicalBody.velocity.z += new_velocity.z ;
                }
            }
        }
    this.tminusM += 1;
    }
    
    //update vertices positions to their physics body positions
    for (var id in this.graph.vertices) {
        if (this.graph.vertices.hasOwnProperty(id)) {
            this.graph.vertices[id].mesh.position.copy(this.graph.vertices[id].physicalBody.position);
            this.graph.vertices[id].mesh.quaternion.copy(this.graph.vertices[id].physicalBody.quaternion);
        }
    }

    //update edges positions based on their vertices physics body positions
    //To update lines in Three js we need to dispose them and create new ones
    for (var id in this.graph.edges) {
        if (this.graph.edges.hasOwnProperty(id)) {
            let edge = this.graph.edges[id]

            let object = App.scene.getObjectByName("edge_"+id);
            object.geometry.dispose();
            object.material.dispose();
            this.root.remove(object);

            let edge_geometry = new THREE.Geometry();
            edge_geometry.vertices.push(new THREE.Vector3(
                this.graph.vertices[edge.source].physicalBody.position.x, 
                this.graph.vertices[edge.source].physicalBody.position.y, 
                this.graph.vertices[edge.source].physicalBody.position.z
            ));
            edge_geometry.vertices.push(new THREE.Vector3(
                this.graph.vertices[edge.target].physicalBody.position.x, 
                this.graph.vertices[edge.target].physicalBody.position.y, 
                this.graph.vertices[edge.target].physicalBody.position.z
            ));
            
            this.mesh = new THREE.Line(edge_geometry, edge.edge_material);
            this.mesh.name = "edge_"+id;
            this.root.add(this.mesh);
        }
    }

    this.updatePhysics(delta); //now udpate the physical world
};

/**
 * //Updates the Physical Bodies on the CANNON World
 * @param {number} delta 
 */
App.updatePhysics = function (delta) {
    //step updates the Physics World of Cannon js
    this.world.step(this.fixedTimeStep, this.delta, this.maxSubSteps);
    //now render the THREE scene
    this.renderer.render(this.scene, this.camera);
};

/**
 * Interaction with the ojects in the THREE Scene with mouse left button
 * @param {object} event 
 */
App.onDocumentMouseDown = function(event){
    event.preventDefault();
    //only get left button event
    if(event.button == 0){
        //recalculate the mouse coordinates
        if(window.scrollY == 0){
            App.mouse.x = ( event.clientX / App.canvas.clientWidth ) * 2 - 1 ;
            App.mouse.y = ( event.clientY / App.canvas.clientHeight ) * 2 - 1;
            
        } else {
            App.mouse.x = ( event.clientX / App.canvas.clientWidth ) * 2 - 1;
            App.mouse.y = - ( event.clientY / App.canvas.clientHeight ) * 2 + 1;
        }
        
        // find intersections
        App.raycaster.setFromCamera( App.mouse, App.camera );
        let intersects = App.raycaster.intersectObjects( App.collisionGroup.children, true);

        if ( intersects.length > 0 ) 
        {
            App.CLICKED = intersects[ intersects.length - 1 ].object;
            if(App.CLICKED){
                if(App.graph.vertices.hasOwnProperty(App.CLICKED.name)){//check if the intersect has a name
                    if(App.SELECTED_VERTEX != null){ // check if there has already been a previous selectec vertex
                        if(App.CLICKED.name != App.SELECTED_VERTEX.mesh.name){ 
                            App.SELECTED_VERTEX.mesh.material = App.materials.emissive_yellow;
                            //change color material
                        }
                    }
                    App.SELECTED_VERTEX = App.graph.vertices[App.CLICKED.name]; //set new selected vertex
                    App.SELECTED_VERTEX.mesh.material = App.materials.emissive_yellow_selected;
                    App.selected_vertex_div.innerHTML = App.CLICKED.name;
                } 
            }
        } 
        else 
        {   if(App.SELECTED_VERTEX != null){
             //if a vertex was not selected return to its original material the last selected vertex
                App.SELECTED_VERTEX.mesh.material = App.materials.emissive_yellow;
            }
            App.selected_vertex_div.innerHTML = "no selection"
            App.CLICKED = null;
            App.SELECTED_VERTEX = null;
        }
    }
}

/**
 * Change the icon of the vertex's marker
 * @param {object} event 
 */
App.changeIcon = function(event){
    event.preventDefault();
    if(App.SELECTED_VERTEX){
        let material_icon = null;
        //HTML has already the name of the image selected
        let texture_icon = new THREE.TextureLoader().load("images/emojis/"+this.id+".png");
        material_icon =  new THREE.MeshPhongMaterial({map: texture_icon});
        //dispose old material
        App.scene.dispose(App.SELECTED_VERTEX.mesh.children[0].children[0].material);
        App.SELECTED_VERTEX.mesh.children[0].children[0].material = material_icon; 
    }
}

/**
 * Change the material of the vertex's marker
 * @param {object} event 
 */
App.changeColor = function(event){
    event.preventDefault();
    if(App.SELECTED_VERTEX){
        let color = this.id;
        //HTML Already has the color as id
        let color_material = new THREE.MeshPhongMaterial({color: parseInt(color, 16)});
        App.scene.dispose(App.SELECTED_VERTEX.mesh.children[0].children[1].material);
        App.SELECTED_VERTEX.mesh.children[0].children[1].material = color_material;
    }
}
