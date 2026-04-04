/**
 * Visualization.js - 2D/Canvas visualization of CNN layers
 * Lightweight alternative to Three.js for better compatibility
 */

class CNNVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.layerData = null;
        this.currentLayer = 7; // Start with output layer
        
        this.init();
    }
    
    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Draw initial state
        this.drawEmptyState();
    }
    
    onWindowResize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        
        if (this.layerData) {
            this.updateVisualization(this.layerData, this.currentLayer);
        } else {
            this.drawEmptyState();
        }
    }
    
    clearCanvas() {
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawEmptyState() {
        this.clearCanvas();
        
        // Draw placeholder text
        this.ctx.fillStyle = '#999';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Draw a digit and click Predict', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('to see layer activations', this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
    
    updateVisualization(layerData, layerIndex) {
        this.layerData = layerData;
        this.currentLayer = layerIndex;
        
        this.clearCanvas();
        
        const layer = layerData[layerIndex];
        
        if (layer.type === 'dense' || layerIndex === 7) {
            // Visualize dense/output layer as bars
            this.visualizeDenseLayer(layer);
        } else if (layer.type === 'conv' || layer.type === 'pool') {
            // Visualize convolutional layer as grid
            this.visualizeConvLayer(layer);
        }
    }
    
    visualizeDenseLayer(layer) {
        const activations = layer.activations || [];
        const numNeurons = activations.length;
        
        if (numNeurons === 0) return;
        
        // Normalize activations
        const maxActivation = Math.max(...activations);
        const minActivation = Math.min(...activations);
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        if (numNeurons === 10) {
            // Output layer - show as vertical bars with labels
            const barWidth = Math.min(60, width / 12);
            const maxBarHeight = height * 0.6;
            const startX = (width - (barWidth * 10 + 9 * 10)) / 2;
            const baseY = height * 0.8;
            
            activations.forEach((activation, i) => {
                const x = startX + i * (barWidth + 10);
                const normalized = maxActivation > 0 ? 
                    (activation - minActivation) / (maxActivation - minActivation) : 0;
                const barHeight = normalized * maxBarHeight;
                
                // Draw bar with gradient
                const gradient = this.ctx.createLinearGradient(x, baseY - barHeight, x, baseY);
                const hue = 120 * normalized; // Green for high, red for low
                gradient.addColorStop(0, `hsl(${hue}, 80%, 60%)`);
                gradient.addColorStop(1, `hsl(${hue}, 80%, 40%)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, baseY - barHeight, barWidth, barHeight);
                
                // Draw border
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, baseY - barHeight, barWidth, barHeight);
                
                // Draw digit label
                this.ctx.fillStyle = '#333';
                this.ctx.font = 'bold 18px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(i.toString(), x + barWidth / 2, baseY + 25);
                
                // Draw percentage
                const percentage = (activation * 100).toFixed(1);
                this.ctx.font = '12px Arial';
                this.ctx.fillText(`${percentage}%`, x + barWidth / 2, baseY - barHeight - 10);
                
                // Highlight max activation with glow
                if (activation === maxActivation) {
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeRect(x - 2, baseY - barHeight - 2, barWidth + 4, barHeight + 4);
                    
                    // Add star/checkmark
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.fillText('✓', x + barWidth / 2, baseY - barHeight - 25);
                }
            });
            
            // Draw title
            this.ctx.fillStyle = '#667eea';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Output Layer - Digit Probabilities', width / 2, 30);
            
        } else {
            // Dense hidden layer - show as circles in grid
            const cols = Math.min(8, numNeurons);
            const rows = Math.ceil(numNeurons / cols);
            const cellWidth = width / (cols + 1);
            const cellHeight = height / (rows + 1);
            const radius = Math.min(cellWidth, cellHeight) / 3;
            
            activations.forEach((activation, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                
                const x = (col + 1) * cellWidth;
                const y = (row + 1) * cellHeight;
                
                const normalized = maxActivation > 0 ? 
                    (activation - minActivation) / (maxActivation - minActivation) : 0;
                
                // Draw circle
                const hue = 240 - normalized * 120; // Blue to red gradient
                this.ctx.fillStyle = `hsl(${hue}, 80%, ${40 + normalized * 30}%)`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius * (0.5 + normalized * 0.5), 0, Math.PI * 2);
                this.ctx.fill();
                
                // Draw border
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            });
            
            // Draw title
            this.ctx.fillStyle = '#667eea';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Dense Layer - ${numNeurons} Neurons`, width / 2, 30);
        }
    }
    
    visualizeConvLayer(layer) {
        const activations = layer.activations || [];
        const numFilters = activations.length;
        
        if (numFilters === 0) return;
        
        // Normalize activations
        const maxActivation = Math.max(...activations);
        const minActivation = Math.min(...activations);
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Arrange filters in a grid
        const cols = Math.ceil(Math.sqrt(numFilters));
        const rows = Math.ceil(numFilters / cols);
        const cellWidth = width / (cols + 1);
        const cellHeight = (height - 60) / (rows + 1);
        const boxSize = Math.min(cellWidth, cellHeight) * 0.8;
        
        activations.forEach((activation, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            const x = (col + 0.5) * cellWidth + cellWidth / 4;
            const y = (row + 0.5) * cellHeight + 50;
            
            const normalized = maxActivation > 0 ? 
                (activation - minActivation) / (maxActivation - minActivation) : 0;
            
            // Draw 3D-like box
            const depth = normalized * 30;
            
            // Draw shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(x + 5, y + 5, boxSize, boxSize);
            
            // Draw main box with gradient
            const gradient = this.ctx.createLinearGradient(x, y, x + boxSize, y + boxSize);
            const hue = 200 - normalized * 100; // Blue to orange
            gradient.addColorStop(0, `hsl(${hue}, 70%, ${30 + normalized * 40}%)`);
            gradient.addColorStop(1, `hsl(${hue}, 70%, ${20 + normalized * 30}%)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, boxSize, boxSize);
            
            // Draw 3D effect
            if (normalized > 0.3) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${normalized * 0.3})`;
                this.ctx.fillRect(x, y - depth, boxSize, depth);
                this.ctx.fillRect(x + boxSize, y, depth, boxSize);
            }
            
            // Draw border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, boxSize, boxSize);
            
            // Draw filter number for highly active filters
            if (normalized > 0.5) {
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(i.toString(), x + boxSize / 2, y + boxSize / 2 + 4);
            }
        });
        
        // Draw title
        this.ctx.fillStyle = '#667eea';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${layer.name.toUpperCase()} - ${numFilters} Filters`, width / 2, 30);
    }
}

// Export for use in other scripts
window.CNNVisualizer = CNNVisualizer;
