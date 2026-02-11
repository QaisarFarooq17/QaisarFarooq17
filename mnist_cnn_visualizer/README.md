# 🧠 MNIST CNN Visualizer

An interactive web application for drawing digits and visualizing how a Convolutional Neural Network (CNN) processes them in real-time with 3D layer visualizations.

![MNIST CNN Visualizer](https://img.shields.io/badge/Deep%20Learning-CNN-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13-orange)
![Flask](https://img.shields.io/badge/Flask-2.3-red)

## ✨ Features

- **Interactive Drawing Pad**: Draw digits 0-9 on a canvas with mouse or touch
- **Real-time Predictions**: Instant digit recognition using a trained CNN model
- **3D Layer Visualization**: See how each layer of the neural network activates
- **Neuron Activation Display**: Visualize which neurons and filters contribute most
- **Probability Distribution**: View confidence scores for all digit classes
- **Layer-by-Layer Analysis**: Explore convolutional, pooling, and dense layers
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Success Indicators**: Green checkmark animation for predictions

## 🎯 Inspired By

This project combines visualization techniques from:
- [@aharley/nn_vis](https://github.com/aharley/nn_vis) - Neural network visualization
- [@OValery16/Tutorial-about-3D-convolutional-network](https://github.com/OValery16/Tutorial-about-3D-convolutional-network) - 3D CNN tutorials

## 🏗️ Architecture

The CNN model consists of:

1. **Input Layer**: 28×28×1 (grayscale MNIST images)
2. **Conv2D Layer 1**: 32 filters, 3×3 kernel, ReLU activation
3. **MaxPooling2D Layer 1**: 2×2 pool size
4. **Conv2D Layer 2**: 64 filters, 3×3 kernel, ReLU activation
5. **MaxPooling2D Layer 2**: 2×2 pool size
6. **Conv2D Layer 3**: 64 filters, 3×3 kernel, ReLU activation
7. **Flatten Layer**: Converts 3D feature maps to 1D
8. **Dense Layer**: 64 neurons, ReLU activation
9. **Dropout Layer**: 0.5 dropout rate
10. **Output Layer**: 10 neurons (digits 0-9), Softmax activation

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or navigate to the repository**:
```bash
cd mnist_cnn_visualizer
```

2. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run the application**:
```bash
python app.py
```

4. **Open your browser**:
Navigate to `http://localhost:5000`

### First Run

On the first run, the application will:
1. Download the MNIST dataset (if not already cached)
2. Train the CNN model (takes ~5 minutes)
3. Save the model to `models/mnist_cnn_model.h5`

Subsequent runs will load the pre-trained model instantly.

## 📖 How to Use

1. **Draw a Digit**: 
   - Use your mouse or touch screen to draw a digit (0-9) on the black canvas
   - Try to draw clearly in the center of the canvas

2. **Get Prediction**:
   - Click the "🔍 Predict" button (or press Enter)
   - The CNN will analyze your drawing and display the predicted digit
   - A green checkmark ✓ confirms the prediction

3. **Explore Layers**:
   - Use the layer dropdown to select different CNN layers
   - Watch the 3D visualization update to show layer activations
   - Neurons/filters glow brighter when more activated
   - View detailed layer information in the info panel

4. **View Probabilities**:
   - See the confidence scores for all 10 digit classes
   - The probability chart shows how certain the model is

5. **Clear and Retry**:
   - Click "🗑️ Clear" (or press C) to start over
   - Draw a new digit and compare how different styles affect recognition

## 🎨 Visualization Features

### 3D Layer Representations

- **Convolutional Layers**: Displayed as colored boxes
  - Height represents activation strength
  - Color gradient from blue (low) to red (high)
  
- **Dense/Output Layers**: Displayed as spheres
  - Size represents activation value
  - Green gradient for positive activations
  - Output layer shows all 10 digit probabilities

- **Camera Animation**: Automatically rotates around the visualization for better viewing

### Layer Information Panel

Shows detailed statistics:
- Layer name and type
- Output shape
- Number of filters/neurons
- Top 5 most active filters
- Neuron activation values

## 🛠️ Technology Stack

### Backend
- **Flask**: Web framework for serving the application
- **TensorFlow/Keras**: Deep learning framework for CNN
- **NumPy**: Numerical computations
- **Pillow**: Image processing

### Frontend
- **HTML5 Canvas**: For drawing interface
- **Three.js**: 3D visualization library
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: No frameworks, lightweight and fast

## 📊 Model Performance

The CNN achieves approximately:
- **Training Accuracy**: ~99%
- **Test Accuracy**: ~98%
- **Inference Time**: <100ms per prediction

## 🔧 Configuration

### Model Training

To retrain the model with different parameters, modify `app.py`:

```python
# Adjust epochs, batch size, or architecture
model.fit(x_train, y_train, epochs=10, batch_size=64)
```

### Canvas Settings

Adjust drawing parameters in `static/js/canvas.js`:

```javascript
this.ctx.lineWidth = 20;  // Pen thickness
this.ctx.strokeStyle = 'white';  // Pen color
```

## 📁 Project Structure

```
mnist_cnn_visualizer/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── models/               # Trained model storage
│   └── mnist_cnn_model.h5
├── static/
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       ├── canvas.js     # Drawing functionality
│       ├── visualization.js  # 3D visualization
│       └── main.js       # Main application logic
└── templates/
    └── index.html        # Main HTML template
```

## 🎓 Educational Value

This project demonstrates:
- **CNN Architecture**: Real-world implementation of convolutional neural networks
- **Feature Extraction**: How CNNs learn hierarchical features
- **Activation Visualization**: Understanding what different layers detect
- **Full-Stack ML**: Integration of ML models with web interfaces
- **Interactive Learning**: Hands-on experimentation with neural networks

## 🤝 Contributing

Contributions are welcome! Some ideas for enhancements:
- Add more visualization modes (heatmaps, feature maps)
- Support for other datasets (Fashion MNIST, CIFAR-10)
- Export/save drawn digits
- Compare multiple models
- Add data augmentation visualization
- Implement GradCAM for attention visualization

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Qaisar Farooq**
- GitHub: [@QaisarFarooq17](https://github.com/QaisarFarooq17)
- Email: qaisar.farooq@unito.it
- LinkedIn: [Qaisar Farooq](https://www.linkedin.com/in/qaisar-farooq-2224791b5/)

## 🙏 Acknowledgments

- MNIST Dataset by Yann LeCun
- TensorFlow/Keras teams
- Three.js community
- Inspiration from neural network visualization pioneers

## 📚 References

- [MNIST Database](http://yann.lecun.com/exdb/mnist/)
- [Understanding CNNs](https://cs231n.github.io/convolutional-networks/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Neural Network Visualization](https://github.com/aharley/nn_vis)

---

**Made with ❤️ for AI Education and Visualization**
