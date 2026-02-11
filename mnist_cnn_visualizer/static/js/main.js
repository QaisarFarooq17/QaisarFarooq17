/**
 * Main.js - Main application logic for MNIST CNN Visualizer
 */

// Initialize components
let drawingCanvas;
let visualizer;
let currentPredictionData = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize drawing canvas
    drawingCanvas = new DrawingCanvas('drawCanvas');
    
    // Initialize 3D visualizer
    visualizer = new CNNVisualizer('visualizationContainer');
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('MNIST CNN Visualizer initialized');
});

function setupEventListeners() {
    // Clear button
    document.getElementById('clearBtn').addEventListener('click', () => {
        drawingCanvas.clear();
        hidePredictionResults();
    });
    
    // Predict button
    document.getElementById('predictBtn').addEventListener('click', () => {
        makePrediction();
    });
    
    // Layer selection
    document.getElementById('layerSelect').addEventListener('change', (e) => {
        if (currentPredictionData) {
            updateLayerVisualization(parseInt(e.target.value));
        }
    });
}

async function makePrediction() {
    // Check if canvas is empty
    if (drawingCanvas.isEmpty()) {
        alert('Please draw a digit first!');
        return;
    }
    
    // Get image data
    const imageData = drawingCanvas.getImageData();
    
    try {
        // Show loading state
        document.getElementById('predictBtn').textContent = '🔄 Processing...';
        document.getElementById('predictBtn').disabled = true;
        
        // Send request to backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentPredictionData = data;
            displayPredictionResults(data);
            updateLayerVisualization(7); // Show output layer by default
        } else {
            alert('Prediction failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to make prediction. Please try again.');
    } finally {
        // Reset button state
        document.getElementById('predictBtn').textContent = '🔍 Predict';
        document.getElementById('predictBtn').disabled = false;
    }
}

function displayPredictionResults(data) {
    // Display predicted digit with confidence
    const resultDiv = document.getElementById('predictionResult');
    const predictedNumber = document.getElementById('predictedNumber');
    const confidenceValue = document.getElementById('confidenceValue');
    
    predictedNumber.textContent = data.prediction;
    confidenceValue.textContent = (data.confidence * 100).toFixed(1) + '%';
    
    resultDiv.classList.remove('hidden');
    
    // Trigger animation for success check
    const successCheck = document.getElementById('successCheck');
    successCheck.style.animation = 'none';
    setTimeout(() => {
        successCheck.style.animation = 'checkmark 0.5s ease-in-out';
    }, 10);
    
    // Display probability chart
    displayProbabilityChart(data.probabilities);
}

function displayProbabilityChart(probabilities) {
    const chartDiv = document.getElementById('probabilityChart');
    const chartBars = document.getElementById('chartBars');
    
    chartBars.innerHTML = '';
    
    probabilities.forEach((prob, index) => {
        const barItem = document.createElement('div');
        barItem.className = 'bar-item';
        
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = index;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        const barFill = document.createElement('div');
        barFill.className = 'bar-fill';
        barFill.style.width = (prob * 100) + '%';
        barFill.textContent = (prob * 100).toFixed(1) + '%';
        
        barContainer.appendChild(barFill);
        barItem.appendChild(barLabel);
        barItem.appendChild(barContainer);
        chartBars.appendChild(barItem);
    });
    
    chartDiv.classList.remove('hidden');
}

function updateLayerVisualization(layerIndex) {
    if (!currentPredictionData || !currentPredictionData.layers) {
        return;
    }
    
    const layers = currentPredictionData.layers;
    const layer = layers[layerIndex];
    
    // Update 3D visualization
    visualizer.updateVisualization(layers, layerIndex);
    
    // Update layer info panel
    displayLayerInfo(layer, layerIndex);
}

function displayLayerInfo(layer, layerIndex) {
    const layerInfo = document.getElementById('layerInfo');
    const layerDetails = document.getElementById('layerDetails');
    
    let infoHTML = '<p><strong>Layer:</strong> ' + layer.name + '</p>';
    infoHTML += '<p><strong>Type:</strong> ' + layer.type + '</p>';
    infoHTML += '<p><strong>Shape:</strong> ' + layer.shape.join(' × ') + '</p>';
    
    if (layer.num_filters) {
        infoHTML += '<p><strong>Filters:</strong> ' + layer.num_filters + '</p>';
        
        // Find most active filters
        if (layer.activations) {
            const topFilters = layer.activations
                .map((val, idx) => ({ idx, val }))
                .sort((a, b) => b.val - a.val)
                .slice(0, 5);
            
            infoHTML += '<p><strong>Top 5 Active Filters:</strong></p>';
            infoHTML += '<ul>';
            topFilters.forEach(filter => {
                infoHTML += `<li>Filter ${filter.idx}: ${filter.val.toFixed(4)}</li>`;
            });
            infoHTML += '</ul>';
        }
    } else if (layer.num_neurons) {
        infoHTML += '<p><strong>Neurons:</strong> ' + layer.num_neurons + '</p>';
        
        // Show neuron activations
        if (layer.activations && layer.activations.length === 10) {
            infoHTML += '<p><strong>Output Probabilities:</strong></p>';
            infoHTML += '<ul>';
            layer.activations.forEach((val, idx) => {
                const percentage = (val * 100).toFixed(1);
                infoHTML += `<li>Digit ${idx}: ${percentage}%</li>`;
            });
            infoHTML += '</ul>';
        }
    }
    
    layerDetails.innerHTML = infoHTML;
    layerInfo.classList.remove('hidden');
}

function hidePredictionResults() {
    document.getElementById('predictionResult').classList.add('hidden');
    document.getElementById('probabilityChart').classList.add('hidden');
    document.getElementById('layerInfo').classList.add('hidden');
    currentPredictionData = null;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
        drawingCanvas.clear();
        hidePredictionResults();
    } else if (e.key === 'Enter') {
        makePrediction();
    }
});

console.log('Keyboard shortcuts: C = Clear, Enter = Predict');
