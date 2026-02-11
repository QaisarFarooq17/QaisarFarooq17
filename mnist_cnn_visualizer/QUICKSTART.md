# MNIST CNN Visualizer - Quick Start Guide

## 🚀 Quick Start

1. **Navigate to the visualizer directory**:
```bash
cd mnist_cnn_visualizer
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Start the application**:
```bash
python app.py
```

4. **Open your browser**:
Navigate to `http://localhost:5000`

## ✨ Features Implemented

### ✅ Core Functionality
- **Interactive Drawing Pad**: Draw digits 0-9 using mouse or touch
- **Real-time CNN Predictions**: Instant digit recognition
- **Green Checkmark Indicator**: Visual confirmation of successful prediction
- **Confidence Display**: Shows prediction certainty (%)

### ✅ Visualizations
- **Layer-by-Layer Visualization**: Switch between all CNN layers
- **Output Layer**: Bar chart showing probabilities for all 10 digits
- **Convolutional Layers**: Grid of filters with activation intensity
- **Color-Coded Activations**: Brighter colors = higher activation
- **Top Active Filters**: Lists the most contributing filters

### ✅ Layer Information Panel
- Layer name and type
- Output shape
- Number of filters/neurons
- Top 5 most active filters
- Detailed activation statistics

### ✅ Network Architecture Display
- Visual representation of the complete CNN pipeline
- Input → Conv → Pool → Conv → Pool → Conv → Dense → Output

## 📊 Model Architecture

- **Input**: 28×28×1 grayscale images
- **Conv2D Layer 1**: 32 filters, 3×3 kernel
- **MaxPooling2D**: 2×2 pool size
- **Conv2D Layer 2**: 64 filters, 3×3 kernel
- **MaxPooling2D**: 2×2 pool size
- **Conv2D Layer 3**: 64 filters, 3×3 kernel
- **Flatten Layer**: Converts to 1D
- **Dense Layer**: 64 neurons
- **Dropout**: 50% rate
- **Output Layer**: 10 neurons (Softmax)

## 🎮 How to Use

1. **Draw**: Use your mouse/finger to draw a digit on the black canvas
2. **Predict**: Click the "🔍 Predict" button or press Enter
3. **View Results**: See the predicted digit with green ✓ and confidence score
4. **Explore Layers**: Use the dropdown to switch between different CNN layers
5. **Analyze**: Review the layer information panel for detailed statistics
6. **Clear**: Click "🗑️ Clear" or press 'C' to start over

## 🔧 Technical Stack

### Backend
- Flask 3.0.0
- TensorFlow 2.18.0
- NumPy 1.26.0
- Pillow 10.0.0

### Frontend
- HTML5 Canvas API
- Vanilla JavaScript (no frameworks)
- CSS3 with gradients and animations
- Canvas-based 2D visualization (no external 3D libraries)

## 📈 Performance

- **Model Accuracy**: ~99% on training data
- **Inference Time**: <100ms per prediction
- **Model Size**: ~1.2MB
- **Prediction Confidence**: Typically >95% for clear digits

## 🎨 Design Highlights

- **Responsive Design**: Works on desktop and mobile
- **Beautiful Gradients**: Modern UI with color-coded elements
- **Smooth Animations**: Checkmark animation on successful prediction
- **Real-time Updates**: Instant visualization updates
- **Keyboard Shortcuts**: C for Clear, Enter for Predict

## 📁 File Structure

```
mnist_cnn_visualizer/
├── app.py                      # Flask backend with CNN model
├── train_model.py              # Script to train the model
├── requirements.txt            # Python dependencies
├── README.md                   # Full documentation
├── .gitignore                  # Ignore models and cache
├── models/
│   └── mnist_cnn_model.h5     # Trained CNN model (created on first run)
├── static/
│   ├── css/
│   │   └── style.css          # Styling
│   └── js/
│       ├── canvas.js          # Drawing functionality
│       ├── visualization.js   # Layer visualization
│       └── main.js            # Main application logic
└── templates/
    └── index.html             # Main HTML page
```

## 🐛 Troubleshooting

### Model not found
If you see a FileNotFoundError for the model:
```bash
python train_model.py
```
This will create and train a new model.

### Port already in use
If port 5000 is busy, modify `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=8080)
```

### Dependencies issues
Make sure you have Python 3.8+ installed:
```bash
python --version
pip install --upgrade pip
pip install -r requirements.txt
```

## 🎓 Educational Value

This project demonstrates:
- CNN architecture and how layers process information
- Feature extraction in convolutional layers
- How pooling reduces dimensionality
- Activation patterns in neural networks
- Full-stack ML application development
- Interactive data visualization techniques

## 🌟 Future Enhancements

Potential improvements:
- Add more datasets (Fashion MNIST, CIFAR-10)
- Implement GradCAM for attention visualization
- Add model comparison features
- Export drawn digits as dataset
- Include more visualization modes
- Add training progress visualization
- Support for custom model architectures

## 📝 License

Open source - MIT License

## 👤 Author

**Qaisar Farooq**
- PhD Researcher in Computer Science
- University of Turin, Italy
- GitHub: [@QaisarFarooq17](https://github.com/QaisarFarooq17)
- Email: qaisar.farooq@unito.it

---

**Made with ❤️ for AI Education and CNN Visualization**
