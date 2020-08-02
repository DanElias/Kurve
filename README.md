# **Kurve - Graph Visualizer**
### **_For business, science and creators_**

*Kurve Graph Visualizer is an open source project that lets users visualize their graph data in 3D space.*

Graph visualizations ideas include: 
- LAN and WAN networks
- User connections in social networks
- Vector Space Model for relations between words or images
- Artificial Intelligence Neural Networks
- Relations between characters in a play or novel
- Transport infrastructure between cities.
- Etc.

## Author
- Daniel Elias Becerra - daniel.eliasbecerra98@gmail.com

## Version:
- 1.0.0

## Technologies:
- HTML
- JQuery
- Materialize CSS
- WebGL
- Three.js
- Cannon.js

## User Features:
- Visualize graphs in 3D space
- Customize your graph's vertices with colors and icons
- 3 options of graph visualizations: Simple Graph, Les Miserables Character Connections, Networks.

## Technical Features:
- Implementation of the [Eades Force Directed Graph algorithm](http://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf) which treats the graph as a mechanical system with springs or electrical forces.
- Connected vertices attract each other, while disconnected ones repell one another. All these using the Cannon js physics engine.
- The app accepts any kind of json in the format described later on. At the moment the app has only 3 data visualizations.
- Light, Shadows and Post-processing effects in scene for more beautiful graphics.
- Marker Obj Model loaded for each vertex.
- Interactions with vertices using Three js raycaster.

## Files
#### js/app.js
- Sets the THREE.js scene: camera, lights, groups, renderer, post-processing, textures, materials, animations.
#### js/sceneHandler.js
- Sets the click events for the icons, colors buttons and interactions with the canvas.
#### js/kurve.js
- Sets the physical world, interactions and force directed graph algorithm operations.

## Classes
#### class/vertex.js
- Represents each vertex of the graph. Called by graph.js when creating the graph
- This class also includes methods for adding a name TextRender to the vertex and a marker icon
#### class/edge.js
- Represents each edge of the graph. Called by graph.js when creating the graph
#### class/graph.js
- Represents the entire graph. This class parses the json data of the graph, creates the vertices, edges.
- It also saves the adjacent and non-adjacent vertices of each vertex to be used by the forced directed algorithm

## JSON Format 
- for Graph Data in ./data folder
```json
{
    "vertices": [
        {
            "id": "A",
            "name": "A"
        },
        {
            "id": "B",
            "name": "B"
        },
    ],
    "edges": [
        {
            "source": "A",
            "target": "B"
        },
    ]
}
```

