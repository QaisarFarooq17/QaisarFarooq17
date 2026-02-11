/**
 * Visualization.js - 3D visualization of CNN layers using Three.js
 */

class CNNVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.layerData = null;
        this.currentLayer = 7; // Start with output layer
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 15;
        this.camera.position.y = 5;
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
        
        // Add grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xeeeeee);
        this.scene.add(gridHelper);
        
        // Add axes helper
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation
        this.animate();
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    clearScene() {
        // Remove all meshes from scene except lights and helpers
        const objectsToRemove = [];
        this.scene.traverse((object) => {
            if (object.isMesh && !object.isHelper) {
                objectsToRemove.push(object);
            }
        });
        
        objectsToRemove.forEach((object) => {
            this.scene.remove(object);
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
    
    updateVisualization(layerData, layerIndex) {
        this.layerData = layerData;
        this.currentLayer = layerIndex;
        
        this.clearScene();
        
        const layer = layerData[layerIndex];
        
        if (layer.type === 'dense' || layerIndex === 7) {
            // Visualize dense/output layer as neurons
            this.visualizeDenseLayer(layer);
        } else if (layer.type === 'conv' || layer.type === 'pool') {
            // Visualize convolutional layer as feature maps
            this.visualizeConvLayer(layer);
        }
    }
    
    visualizeDenseLayer(layer) {
        const activations = layer.activations || [];
        const numNeurons = activations.length;
        
        if (numNeurons === 0) return;
        
        // Normalize activations for color mapping
        const maxActivation = Math.max(...activations);
        const minActivation = Math.min(...activations);
        
        // Create neurons in a grid or circular pattern
        if (numNeurons === 10) {
            // Output layer - arrange in a line
            const spacing = 1.5;
            activations.forEach((activation, i) => {
                const x = (i - 4.5) * spacing;
                const y = 0;
                const z = 0;
                
                // Normalize activation value
                const normalized = maxActivation > 0 ? 
                    (activation - minActivation) / (maxActivation - minActivation) : 0;
                
                // Create sphere for neuron
                const geometry = new THREE.SphereGeometry(0.5 + normalized * 0.5, 32, 32);
                
                // Color based on activation (green gradient)
                const color = new THREE.Color();
                color.setHSL(0.3, 0.8, 0.3 + normalized * 0.4);
                
                const material = new THREE.MeshPhongMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: normalized * 0.5,
                    shininess: 100
                });
                
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(x, y, z);
                this.scene.add(sphere);
                
                // Add label
                this.addLabel(i.toString(), x, y - 1.5, z);
                
                // Add activation value label
                const percentage = (activation * 100).toFixed(1);
                this.addLabel(`${percentage}%`, x, y + 1.5, z, 0.3);
            });
        } else {
            // Dense hidden layer - arrange in a grid
            const cols = Math.ceil(Math.sqrt(numNeurons));
            const rows = Math.ceil(numNeurons / cols);
            const spacing = 1.2;
            
            activations.forEach((activation, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                
                const x = (col - cols / 2) * spacing;
                const y = (row - rows / 2) * spacing;
                const z = 0;
                
                const normalized = maxActivation > 0 ? 
                    (activation - minActivation) / (maxActivation - minActivation) : 0;
                
                const geometry = new THREE.SphereGeometry(0.3 + normalized * 0.3, 16, 16);
                
                const color = new THREE.Color();
                color.setHSL(0.6, 0.8, 0.3 + normalized * 0.4);
                
                const material = new THREE.MeshPhongMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: normalized * 0.3
                });
                
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(x, y, z);
                this.scene.add(sphere);
            });
        }
    }
    
    visualizeConvLayer(layer) {
        const activations = layer.activations || [];
        const numFilters = activations.length;
        
        if (numFilters === 0) return;
        
        // Normalize activations
        const maxActivation = Math.max(...activations);
        const minActivation = Math.min(...activations);
        
        // Arrange filters in a grid
        const cols = Math.ceil(Math.sqrt(numFilters));
        const rows = Math.ceil(numFilters / cols);
        const spacing = 1.5;
        
        activations.forEach((activation, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            const x = (col - cols / 2) * spacing;
            const z = (row - rows / 2) * spacing;
            
            const normalized = maxActivation > 0 ? 
                (activation - minActivation) / (maxActivation - minActivation) : 0;
            
            // Create box for filter
            const height = 0.5 + normalized * 2;
            const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
            
            // Color based on activation (blue to red gradient)
            const color = new THREE.Color();
            color.setHSL(0.6 - normalized * 0.6, 0.8, 0.5);
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: normalized * 0.3
            });
            
            const box = new THREE.Mesh(geometry, material);
            box.position.set(x, height / 2, z);
            this.scene.add(box);
        });
    }
    
    addLabel(text, x, y, z, scale = 0.5) {
        // Note: Text rendering in Three.js requires TextGeometry
        // For simplicity, we'll skip text labels in the 3D view
        // They can be displayed in the layer info panel instead
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate camera around the scene
        const time = Date.now() * 0.0005;
        this.camera.position.x = Math.sin(time) * 15;
        this.camera.position.z = Math.cos(time) * 15;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Export for use in other scripts
window.CNNVisualizer = CNNVisualizer;
