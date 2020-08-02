//Code for sphere links - unused


 //radius, position, rotation, material, parent group, name
 this.link_sphere = new LinkSphere(0.1, {x: -5, y: 0, z: 0}, {x: 0, y: 0, z: 0},  Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere2 = new LinkSphere(0.1, {x: -4, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere3 = new LinkSphere(0.1, {x: -3, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere4 = new LinkSphere(0.1, {x: -2, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere5 = new LinkSphere(0.1, {x: -1, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere6 = new LinkSphere(0.1, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere7 = new LinkSphere(0.1, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere8 = new LinkSphere(0.1, {x: 2, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere9 = new LinkSphere(0.1, {x: 3, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere10 = new LinkSphere(0.1, {x: 4, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");
 this.link_sphere11 = new LinkSphere(0.1, {x: 5, y: 0, z: 0}, {x: 0, y: 0, z: 0}, Game.materials.emissive_yellow, this.root, "a");


    this.link_sphere.mesh.position.copy(this.link_sphereBody.position)
    this.link_sphere.mesh.quaternion.copy(this.link_sphereBody.quaternion)

    this.link_sphere2.mesh.position.copy(this.link_sphereBody2.position)
    this.link_sphere2.mesh.quaternion.copy(this.link_sphereBody2.quaternion)

    this.link_sphere3.mesh.position.copy(this.link_sphereBody3.position)
    this.link_sphere3.mesh.quaternion.copy(this.link_sphereBody3.quaternion)

    this.link_sphere4.mesh.position.copy(this.link_sphereBody4.position)
    this.link_sphere4.mesh.quaternion.copy(this.link_sphereBody4.quaternion)

    this.link_sphere5.mesh.position.copy(this.link_sphereBody5.position)
    this.link_sphere5.mesh.quaternion.copy(this.link_sphereBody5.quaternion)

    this.link_sphere6.mesh.position.copy(this.link_sphereBody6.position)
    this.link_sphere6.mesh.quaternion.copy(this.link_sphereBody6.quaternion)

    this.link_sphere7.mesh.position.copy(this.link_sphereBody7.position)
    this.link_sphere7.mesh.quaternion.copy(this.link_sphereBody7.quaternion)

    this.link_sphere8.mesh.position.copy(this.link_sphereBody8.position)
    this.link_sphere8.mesh.quaternion.copy(this.link_sphereBody8.quaternion)

    this.link_sphere9.mesh.position.copy(this.link_sphereBody9.position)
    this.link_sphere9.mesh.quaternion.copy(this.link_sphereBody9.quaternion)

    this.link_sphere10.mesh.position.copy(this.link_sphereBody10.position)
    this.link_sphere10.mesh.quaternion.copy(this.link_sphereBody10.quaternion)

    this.link_sphere11.mesh.position.copy(this.link_sphereBody11.position)
    this.link_sphere11.mesh.quaternion.copy(this.link_sphereBody11.quaternion)

    this.link_sphereBody = this.addPhysicalBody(this.link_sphere.mesh, {mass: 0}, this.link_sphere.radius);
    this.link_sphereBody2 = this.addPhysicalBody(this.link_sphere2.mesh, {mass: 1}, this.link_sphere2.radius);
    this.link_sphereBody3 = this.addPhysicalBody(this.link_sphere3.mesh, {mass: 2}, this.link_sphere3.radius);
    this.link_sphereBody4 = this.addPhysicalBody(this.link_sphere4.mesh, {mass: 5}, this.link_sphere4.radius);
    this.link_sphereBody5 = this.addPhysicalBody(this.link_sphere5.mesh, {mass: 5}, this.link_sphere5.radius);
    this.link_sphereBody6 = this.addPhysicalBody(this.link_sphere6.mesh, {mass: 5}, this.link_sphere6.radius);
    this.link_sphereBody7 = this.addPhysicalBody(this.link_sphere7.mesh, {mass: 5}, this.link_sphere7.radius);
    this.link_sphereBody8 = this.addPhysicalBody(this.link_sphere8.mesh, {mass: 5}, this.link_sphere8.radius);
    this.link_sphereBody9 = this.addPhysicalBody(this.link_sphere9.mesh, {mass: 5}, this.link_sphere9.radius);
    this.link_sphereBody10 = this.addPhysicalBody(this.link_sphere10.mesh, {mass: 1}, this.link_sphere10.radius);
    this.link_sphereBody11 = this.addPhysicalBody(this.link_sphere11.mesh, {mass: 0}, this.link_sphere11.radius);

    this.union = new CANNON.DistanceConstraint(this.link_sphereBody5, this.link_sphereBody6, 1);
    this.union2 = new CANNON.DistanceConstraint(this.link_sphereBody7, this.link_sphereBody6, 1);
    this.union3 = new CANNON.DistanceConstraint(this.link_sphereBody4, this.link_sphereBody5, 1);
    this.union4 = new CANNON.DistanceConstraint(this.link_sphereBody8, this.link_sphereBody7, 1);
    this.union5 = new CANNON.DistanceConstraint(this.link_sphereBody3, this.link_sphereBody4, 1);
    this.union6 = new CANNON.DistanceConstraint(this.link_sphereBody9, this.link_sphereBody8, 1);
    this.union7 = new CANNON.DistanceConstraint(this.link_sphereBody2, this.link_sphereBody3, 1);
    this.union8 = new CANNON.DistanceConstraint(this.link_sphereBody10, this.link_sphereBody9, 1);
    
    this.union9 = new CANNON.LockConstraint(this.link_sphereBody, this.link_sphereBody2);
    this.union10 = new CANNON.LockConstraint(this.link_sphereBody11, this.link_sphereBody10);

    this.world.addConstraint(this.union);
    this.world.addConstraint(this.union2);
    this.world.addConstraint(this.union3);
    this.world.addConstraint(this.union4);
    this.world.addConstraint(this.union5);
    this.world.addConstraint(this.union6);
    this.world.addConstraint(this.union7);
    this.world.addConstraint(this.union8);
    this.world.addConstraint(this.union9);
    this.world.addConstraint(this.union10);


     //Plane used as the floor for Cannon.js physics
     var planegeometry = new THREE.PlaneGeometry( 50, 50, 5);
     this.plane = new THREE.Mesh(planegeometry, this.materials.saturn_ring );
     this.plane.position.set(0,-5,0);
     this.plane.rotation.set(-Math.PI/2,0,0)
     //this.root.add(this.plane);