/*  Author: Daniel Elias
*   Year: 2020
*   Main js that creates the App Singleton: scene, camera, animation, lights, shadows, main functions, etc.
*/

let App = {};//The Graph Visualizer App

/**
 * //Change lights in scene
 * @param {THREE Light} light 
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 */
App.setLightColor = function (light, r, g, b) {
    //Changes the Light colors (point and ambient)
    r /= 255;
    g /= 255;
    b /= 255;
    light.color.setRGB(r, g, b);
}

/**
 * For the post-processing effects
 */
App.addEffects = function (){
    let params = {
        exposure: 1,
        bloomStrength: 0.5,
        bloomRadius: 0.1
    };

    // First, we need to create an effect composer: instead of rendering to the WebGLRenderer, we render using the composer.
    this.composer = new THREE.EffectComposer(this.renderer);

    // The effect composer works as a chain of post-processing passes. These are responsible for applying all the visual effects to a scene. They are processed in order of their addition. The first pass is usually a Render pass, so that the first element of the chain is the rendered scene.
    const renderPass = new THREE.RenderPass(this.scene, this.camera);

    // There are several passes available. Here we are using the UnrealBloomPass.
    this.bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.5, 0.2, 1 );
    this.bloomPass.threshold = 0.7;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;

    this.renderer.toneMappingExposure = Math.pow( params.exposure, 1.0 );

    // After the passes are configured, we add them in the order we want them.
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);

    this.composer.render();
}

/**
 * 
 * @param {THREE OBJLoader} loader 
 * @param {*} onProgress 
 */
App.promisifyLoader = function( loader, onProgress ){
    function promiseLoader ( url ) {
      return new Promise( ( resolve, reject ) => {
        loader.load( url, resolve, onProgress, reject );
      });
    }
  
    return {
      originalLoader: loader,
      load: promiseLoader,
    };
}

/**
 * //Load OBJ Model
 * @param {Object} objModel
 * @param {THREE Object3D} parent 
 */
App.loadObj = async function(objModel, parent)
{
    const objPromiseLoader = promisifyLoader(new THREE.OBJLoader());

    try {
        let object = await objPromiseLoader.load(objModel.obj);
        //let texture1 = objModel.hasOwnProperty('map') ? new THREE.TextureLoader().load(objModel.map) : null;
        //let texture2 = objModel.hasOwnProperty('map2') ? new THREE.TextureLoader().load(objModel.map2) : null;
        //let normalMap = objModel.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModel.normalMap) : null;
        //let specularMap = objModel.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModel.specularMap) : null;

        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //Threre are two meshes inside the obj: Location marker and icon
        //So that is why two positions are used, set their materials and positions
        let material1 =  App.materials.plastic_red;
        let material2 =  App.materials.plastic_red;
        object.children[0].material = material1;
        object.children[1].material = material2;
        object.scale.set(0.1, 0.1, 0.1);
        object.children[0].position.y = 15
        object.children[1].position.y = 15
        object.name = parent.name;
        object.children[0].name = parent.name;
        object.children[1].name = parent.name;
        parent.add(object);
    }
    catch (err) {
        return onError(err);
    }
}

/**
 * Runs the app for the first time setting the THREE Scene
 */
App.run = function () {

    //for animation
    this._previousElapsed = 0;

    /*************************************Renderer************************************* */
    // Create the Three.js renderer and attach it to our canvas
    let canvas = document.getElementById('webglcanvas');
    this.canvas = canvas; 
    this.canvas_div = document.getElementById('canvas_col');

    canvas.width = this.canvas_div.offsetWidth;
    canvas.height = this.canvas_div.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({canvas: canvas});

    // Set the viewport size
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.alpha = true
    this.renderer.antialias = true
    this.renderer.setClearAlpha(0.0) 
    this.renderer.setViewport(0, 0, canvas.width, canvas.height);

    /************************************Shadows*************************************** */
    // Turn on shadows
    this.renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

    /*************************************Scene************************************* */
    // Create a new Three.js scene
    this.scene = new THREE.Scene();

    /*************************************Camera************************************* */
    // Add  a camera so we can view the scene
    this.camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 40000 );
    this.camera.position.set(0, 300, 180);
    this.camera.rotation.set(Math.PI/2, 0, 0);
    this.camera.far = 100000;
    this.scene.add(this.camera);
    //Resize canvas
    this.onWindowResize();
    window.addEventListener( 'resize', this.onWindowResize);

    /*********************************Orbit Controls********************************* */
    this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    /***********************************Root Group*********************************** */
    // Create a group to hold all the objects
    this.root = new THREE.Object3D;
    this.scene.add(this.root);

    /***********************************Sun Light*********************************** */
    //color, intensity, distance, decay, correct
    this.pointLight = new THREE.PointLight( 0xffffff, 2, 0, 2);
    this.pointLight.position.set( 0, 10, 0 );
    this.root.add( this.pointLight );
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.near = 1;
    this.pointLight.shadow. camera.far = 10000;
    this.pointLight.shadow.camera.fov = 45;
    this.pointLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    this.pointLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    let sphereSize = 1;
    let pointLightHelper = new THREE.PointLightHelper( this.pointLight, sphereSize );
    //this.root.add( pointLightHelper );

    /*********************************Ambient Light********************************* */
    this.ambientLight = new THREE.AmbientLight ( 0xffffff, 1);
    this.root.add(this.ambientLight);

    /*********************************Post-processing********************************* */
    this.addEffects();

    /*********************************Interaction********************************* */
    this.raycaster = new THREE.Raycaster();


    //Skybox Cubemap - not used
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        'images/sky/SkyboxesRT.png',
        'images/sky/SkyboxesLF.png',
        'images/sky/SkyboxesUP.png',        
        'images/sky/SkyboxesDN.png',
        'images/sky/SkyboxesFT.png',
        'images/sky/SkyboxesBK.png',
        ]);
    
    //this.scene.background = texture;

    // start up game
    this.init();
    window.requestAnimationFrame(this.tick);
};

/**
 * Animation
 */
App.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.renderer.render(this.scene, this.camera);
    this.composer.render(); //post
}.bind(App);

//Textures
App.textures = {
     //Color - texture maps
     texture_url_sun: "images/sunmap2.jpg",
     texture_url_mercury: "images/mercurymap.jpg",
     texture_url_venus: "images/venusmap.jpg",
     texture_url_earth: "images/earth_atmos_2048.jpg",
     texture_url_moon: "images/moonmap.jpg",
     texture_url_mars: "images/marsmap.jpg",
     texture_url_jupiter: "images/jupitermap.jpg",
     texture_url_saturn: "images/saturnmap.jpg",
     texture_url_uranus: "images/uranusmap.jpg",
     texture_url_neptune: "images/neptunemap.jpg",
     texture_url_pluto: "images/plutomap.jpg",
     texture_url_saturn_ring: "images/saturnringcolor2.jpg",
     texture_url_uranus_ring: "images/uranusringcolour.jpg",
     texture_url_nebula: "images/nebula-2.jpg",
     texture_url_smiley: "images/smiley.jpg",
     //Bump maps
     bump_url_mercury: "images/mercurybump.jpg",
     bump_url_venus: "images/venusbump.jpg",
     bump_url_earth: "images/earthbump1k.jpg",
     bump_url_moon: "images/moonbump1k.jpg",
     bump_url_phobos: "images/phobosbump.jpg",
     bump_url_deimos: "images/deimosbump.jpg",
     bump_url_pluto: "images/plutobump1k.jpg",
     //Normal maps
     normal_url_earth: "images/earth_normal_2048.jpg",
     normal_url_mars: "images/mars_1k_normal.jpg",
     //Specular maps
     specular_url_earth: "images/earthspec1k.jpg",
     //Cloud maps
     cloud_url_earth: "images/earthcloudmap.jpg",
     //Transparency maps
     transparency_url_earth: "images/earthcloudmap.jpg",
     transparency_url_saturn_ring: "images/saturnringpattern2.jpg",
     //Shader Material
     glow_texture: "images/sunmap2.jpg",
     noise_texture: "images/noisy-texture.png"
};

// collection of materials used
App.materials = {

    shadow: new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5
    }),

    solid: new THREE.MeshNormalMaterial({}),

    colliding: new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5
    }),

    dot: new THREE.MeshBasicMaterial({
        color: 0x0000ff
    }),

    emoji_smiley: new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(App.textures.texture_url_smiley), 
    }),

    emissive_yellow: new THREE.MeshPhongMaterial({
        color: 0xff9008, 
        emissive: 0xff9008,
        emissiveIntensity: 0.4,
    }),

    emissive_yellow_selected: new THREE.MeshPhongMaterial({
        color: 0xffa32b, 
        emissive: 0xffa32b,
        emissiveIntensity: 0.4,
    }),

    emissive_blue: new THREE.MeshPhongMaterial({
        color: 0x2eb7d9, 
        emissive: 0x2eb7d9,
        emissiveIntensity: 0.4,
    }),

    plastic_red: new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("images/emojis/red.png"), 
    }),
};

/**
 * Resizes the canvas on window resize
 */
App.onWindowResize =  function() {
    //resized to the canvas div and not to the entire of the screen
    this.canvas.width = this.canvas_div.clientWidth;
    this.canvas.height = this.canvas_div.clientHeight;
    this.camera.aspect = this.canvas.width / this.canvas.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.canvas.width, this.canvas.height );
}

// override these methods to create the App
App.init = function () {};
App.update = function (delta) {};
App.toggleDebug = function () {};