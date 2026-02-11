# 🧠 MNIST CNN Visualizer

An interactive web application for visualizing how Convolutional Neural Networks process handwritten digits in real-time.

## Overview

This project adds a comprehensive MNIST digit recognition and visualization tool to the repository. Draw digits on a canvas and watch as the CNN processes them through multiple layers, showing activations, weights, and predictions with a beautiful, intuitive interface.

## Features

✅ **Interactive Drawing Canvas** - Draw digits 0-9 with mouse or touch  
✅ **Real-Time Predictions** - Instant digit recognition with confidence scores  
✅ **Layer Visualization** - View activations across all CNN layers  
✅ **Green Checkmark Indicator** - Visual confirmation of predictions  
✅ **Probability Distribution** - See confidence for all 10 digits  
✅ **Network Architecture Display** - Visual representation of the CNN pipeline  
✅ **Layer Information Panel** - Detailed statistics for each layer  
✅ **Responsive Design** - Works on desktop and mobile devices  

## Screenshots

### Main Interface
![MNIST Visualizer Interface](https://github.com/user-attachments/assets/56c120ef-c6ad-46ab-923b-253d126801f7)

### Digit Drawing
![Drawing a Digit](https://github.com/user-attachments/assets/a2bd4670-ebb7-496d-948e-3216dddd1a45)

### Prediction Results
![Prediction with Visualization](https://github.com/user-attachments/assets/50791d42-92f3-453e-a4e3-c6b020513d9e)

### Convolutional Layer View
![Conv Layer Visualization](https://github.com/user-attachments/assets/b4d7cd0f-9074-4d9b-b780-525f81e9b85d)

## Quick Start

```bash
cd mnist_cnn_visualizer
pip install -r requirements.txt
python app.py
```

Then open http://localhost:5000 in your browser.

See [README.md](mnist_cnn_visualizer/README.md) and [QUICKSTART.md](mnist_cnn_visualizer/QUICKSTART.md) for detailed documentation.

## Technical Stack

- **Backend**: Flask, TensorFlow/Keras, NumPy
- **Frontend**: HTML5 Canvas, Vanilla JavaScript, CSS3
- **Visualization**: Custom Canvas-based rendering (no external 3D libraries)
- **Model**: CNN with 3 convolutional layers achieving ~99% accuracy

## Inspiration

This project was inspired by:
- [@aharley/nn_vis](https://github.com/aharley/nn_vis) - Neural network visualization
- [@OValery16/Tutorial-about-3D-convolutional-network](https://github.com/OValery16/Tutorial-about-3D-convolutional-network) - 3D CNN tutorials

## Project Structure

```
mnist_cnn_visualizer/
├── app.py                  # Flask backend + CNN model
├── train_model.py          # Model training script
├── requirements.txt        # Dependencies
├── README.md              # Full documentation
├── QUICKSTART.md          # Quick start guide
├── static/
│   ├── css/style.css      # Styling
│   └── js/
│       ├── canvas.js      # Drawing functionality
│       ├── visualization.js  # Layer visualization
│       └── main.js        # Main app logic
└── templates/
    └── index.html         # Main interface
```

## Author

**Qaisar Farooq**  
PhD Researcher in Computer Science  
University of Turin, Italy  
GitHub: [@QaisarFarooq17](https://github.com/QaisarFarooq17)

---

Made with ❤️ for AI Education and Visualization
