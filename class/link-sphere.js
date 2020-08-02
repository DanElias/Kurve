/*
* Class Body to create Planets, Stars, Asteroids, Moons
*/

class LinkSphere{
    constructor(radius, position, rotation, material, parent_group, name){
        //Basics
        this.radius = radius;
        this.material = material;
        this.name = name;

        //Groups
        this.orbit_group = new THREE.Object3D; //for the orbit
        this.body_group = new THREE.Object3D; //for the planet/star/moon/ring
        this.parent_group = parent_group;
        this.orbit_group.add(this.body_group);//orbit controls the body
       
        
        this.geometry =  new THREE.SphereGeometry(this.radius, 40, 40);
        
        //Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.body_group.add(this.mesh);
        this.orbit_group.add(this.body_group);

        //Position / Rotation
        this.position = position;
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
        this.rotation = rotation;
        this.mesh.rotation.x = this.rotation.x;
        this.mesh.rotation.y = this.rotation.y;
        this.mesh.rotation.z = this.rotation.z;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        //App.scene.add(this.orbit_group) //add to scene and not to parent
    }
   
}