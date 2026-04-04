"""
Simple script to create a demo model with synthetic MNIST-like data
This allows the visualization to work even without internet access
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras

def create_cnn_model():
    """Create a CNN model for MNIST digit recognition"""
    model = keras.Sequential([
        keras.layers.Input(shape=(28, 28, 1)),
        keras.layers.Conv2D(32, (3, 3), activation='relu', name='conv1'),
        keras.layers.MaxPooling2D((2, 2), name='pool1'),
        keras.layers.Conv2D(64, (3, 3), activation='relu', name='conv2'),
        keras.layers.MaxPooling2D((2, 2), name='pool2'),
        keras.layers.Conv2D(64, (3, 3), activation='relu', name='conv3'),
        keras.layers.Flatten(name='flatten'),
        keras.layers.Dense(64, activation='relu', name='dense1'),
        keras.layers.Dropout(0.5, name='dropout'),
        keras.layers.Dense(10, activation='softmax', name='output')
    ])
    return model

def generate_synthetic_mnist():
    """Generate synthetic MNIST-like data for demonstration"""
    print("Generating synthetic training data...")
    
    # Create simple synthetic digits
    num_samples = 1000
    x_train = np.zeros((num_samples, 28, 28, 1), dtype=np.float32)
    y_train = np.zeros(num_samples, dtype=np.int32)
    
    for i in range(num_samples):
        digit = i % 10
        y_train[i] = digit
        
        # Create simple patterns for each digit
        img = np.zeros((28, 28), dtype=np.float32)
        
        if digit == 0:  # Circle
            for r in range(28):
                for c in range(28):
                    if 8 < np.sqrt((r-14)**2 + (c-14)**2) < 12:
                        img[r, c] = 1.0
        elif digit == 1:  # Vertical line
            img[4:24, 13:15] = 1.0
        elif digit == 2:  # Curved 2
            img[6:9, 8:20] = 1.0
            img[8:13, 17:20] = 1.0
            img[12:15, 8:20] = 1.0
            img[18:21, 8:11] = 1.0
            img[20:23, 8:20] = 1.0
        elif digit == 3:  # Two curves
            img[6:9, 10:20] = 1.0
            img[13:16, 10:20] = 1.0
            img[20:23, 10:20] = 1.0
            img[8:14, 17:20] = 1.0
            img[15:21, 17:20] = 1.0
        elif digit == 4:  # Right angle
            img[5:15, 8:11] = 1.0
            img[12:15, 8:20] = 1.0
            img[5:23, 17:20] = 1.0
        elif digit == 5:  # S shape
            img[6:9, 8:20] = 1.0
            img[8:14, 8:11] = 1.0
            img[13:16, 8:20] = 1.0
            img[15:21, 17:20] = 1.0
            img[20:23, 8:20] = 1.0
        elif digit == 6:  # Circle with top
            img[6:9, 10:18] = 1.0
            img[8:21, 8:11] = 1.0
            img[13:21, 17:20] = 1.0
            img[18:21, 10:18] = 1.0
            img[13:16, 10:18] = 1.0
        elif digit == 7:  # Angled line
            img[6:9, 8:20] = 1.0
            img[9:23, 15:18] = 1.0
        elif digit == 8:  # Two circles
            img[6:12, 10:18] = 1.0
            img[6:12, 10:13] = 1.0
            img[6:12, 15:18] = 1.0
            img[16:22, 10:18] = 1.0
            img[16:22, 10:13] = 1.0
            img[16:22, 15:18] = 1.0
            img[11:17, 8:11] = 1.0
            img[11:17, 17:20] = 1.0
        else:  # 9 - Circle with bottom
            img[6:16, 8:11] = 1.0
            img[6:16, 17:20] = 1.0
            img[6:9, 10:18] = 1.0
            img[13:16, 10:18] = 1.0
            img[15:23, 17:20] = 1.0
        
        # Add some noise
        noise = np.random.rand(28, 28) * 0.1
        img = np.clip(img + noise, 0, 1)
        
        x_train[i, :, :, 0] = img
    
    return x_train, y_train

if __name__ == '__main__':
    print("Creating CNN model...")
    model = create_cnn_model()
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("Generating training data...")
    x_train, y_train = generate_synthetic_mnist()
    
    print("Training model...")
    model.fit(x_train, y_train, epochs=10, batch_size=32, validation_split=0.2, verbose=1)
    
    print("Saving model...")
    model.save('models/mnist_cnn_model.h5')
    
    print("Model created and saved successfully!")
    print("You can now run: python app.py")
