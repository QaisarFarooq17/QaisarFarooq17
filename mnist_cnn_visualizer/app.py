"""
MNIST CNN Visualizer Backend
Flask server for handling MNIST digit predictions and layer visualizations
"""

from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow import keras
import base64
import io
from PIL import Image
import json

app = Flask(__name__)

# Load or create CNN model
def create_cnn_model():
    """Create a CNN model for MNIST digit recognition"""
    model = keras.Sequential([
        # Input layer
        keras.layers.Input(shape=(28, 28, 1)),
        
        # First convolutional block
        keras.layers.Conv2D(32, (3, 3), activation='relu', name='conv1'),
        keras.layers.MaxPooling2D((2, 2), name='pool1'),
        
        # Second convolutional block
        keras.layers.Conv2D(64, (3, 3), activation='relu', name='conv2'),
        keras.layers.MaxPooling2D((2, 2), name='pool2'),
        
        # Third convolutional block
        keras.layers.Conv2D(64, (3, 3), activation='relu', name='conv3'),
        
        # Flatten and dense layers
        keras.layers.Flatten(name='flatten'),
        keras.layers.Dense(64, activation='relu', name='dense1'),
        keras.layers.Dropout(0.5, name='dropout'),
        keras.layers.Dense(10, activation='softmax', name='output')
    ])
    
    return model

# Load model
try:
    model = keras.models.load_model('models/mnist_cnn_model.h5')
    print("Loaded existing model")
except FileNotFoundError:
    print("Creating and training new model...")
    model = create_cnn_model()
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Try to train the model, but handle network issues gracefully
    try:
        (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
        x_train = x_train.reshape(-1, 28, 28, 1).astype('float32') / 255
        x_test = x_test.reshape(-1, 28, 28, 1).astype('float32') / 255
        
        model.fit(x_train, y_train, epochs=5, batch_size=128, 
                  validation_split=0.1, verbose=1)
        
        # Save the model
        model.save('models/mnist_cnn_model.h5')
        print("Model trained and saved")
    except Exception as e:
        print(f"Could not download MNIST dataset: {e}")
        print("Creating a demo model with random weights (for visualization only)")
        # Initialize with random weights for demo purposes
        # The model architecture is ready, just not trained
        model.save('models/mnist_cnn_model.h5')
        print("Demo model saved - predictions will be random until properly trained")

# Create a model that outputs intermediate layers
layer_names = ['conv1', 'pool1', 'conv2', 'pool2', 'conv3', 'flatten', 'dense1', 'output']
layer_outputs = [model.get_layer(name).output for name in layer_names]

# Build the model first with a dummy input
dummy_input = np.zeros((1, 28, 28, 1), dtype=np.float32)
_ = model.predict(dummy_input, verbose=0)

activation_model = keras.Model(inputs=model.inputs, outputs=layer_outputs)

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    try:
        # Get image data from request
        data = request.json
        image_data = data['image']
        
        # Decode base64 image
        image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('L')
        
        # Resize to 28x28
        image = image.resize((28, 28))
        
        # Convert to numpy array and normalize
        img_array = np.array(image).reshape(1, 28, 28, 1).astype('float32') / 255
        
        # Get predictions
        predictions = model.predict(img_array, verbose=0)
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_class])
        
        # Get all class probabilities
        probabilities = [float(p) for p in predictions[0]]
        
        # Get layer activations
        activations = activation_model.predict(img_array, verbose=0)
        
        # Process activations for visualization
        layer_data = []
        for i, (name, activation) in enumerate(zip(layer_names, activations)):
            layer_info = {
                'name': name,
                'shape': list(activation.shape),
                'type': 'conv' if 'conv' in name else ('pool' if 'pool' in name else 'dense')
            }
            
            # For convolutional layers, send statistics
            if len(activation.shape) == 4:  # Conv layer
                # Get mean activation per filter
                mean_activations = np.mean(activation[0], axis=(0, 1))
                layer_info['activations'] = mean_activations.tolist()
                layer_info['num_filters'] = activation.shape[3]
            elif len(activation.shape) == 2:  # Dense layer
                layer_info['activations'] = activation[0].tolist()
                layer_info['num_neurons'] = activation.shape[1]
            
            layer_data.append(layer_info)
        
        return jsonify({
            'success': True,
            'prediction': predicted_class,
            'confidence': confidence,
            'probabilities': probabilities,
            'layers': layer_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/model_info')
def model_info():
    """Get model architecture information"""
    try:
        layers_info = []
        for layer in model.layers:
            layer_dict = {
                'name': layer.name,
                'type': layer.__class__.__name__,
                'output_shape': str(layer.output_shape),
            }
            
            # Add weights info if available
            if hasattr(layer, 'get_weights') and len(layer.get_weights()) > 0:
                weights = layer.get_weights()
                layer_dict['num_parameters'] = sum([w.size for w in weights])
            
            layers_info.append(layer_dict)
        
        return jsonify({
            'success': True,
            'layers': layers_info,
            'total_params': model.count_params()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
