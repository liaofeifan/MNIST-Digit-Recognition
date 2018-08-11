import tensorflow as tf
from tensorflow import keras
import pickle 

import numpy as np

import matplotlib.pyplot as plt

(train_data, train_labels), (test_data,test_labels) = keras.datasets.mnist.load_data()

class_names = [x for x in range(10)]

train_data = train_data / 255.0
test_data = test_data / 255.0

# plt.imshow(train_data[0], cmap='gray')
# plt.show()

model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation=tf.nn.relu),
    keras.layers.Dense(10, activation=tf.nn.softmax)
])

# model.summary()

model.compile(optimizer=tf.train.AdamOptimizer(),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_data, train_labels, epochs=5)

test_loss, test_acc = model.evaluate(test_data, test_labels)

# print('Test accuracy', test_acc)

# predictions = model.predict(test_data)

# plt.figure(figsize=(10, 10))
# for i in range(25):
#     plt.subplot(5, 5, i+1)
#     plt.xticks([])
#     plt.yticks([])
#     plt.grid('off')
#     plt.imshow(test_data[i], cmap=plt.cm.binary)
#     predicted_label = np.argmax(predictions[i])
#     true_label = test_labels[i]
#     if predicted_label == true_label:
#         color = 'green'
#     else:
#         color = 'red'
#     plt.xlabel("{} ({})".format(
#         class_names[predicted_label], class_names[true_label]), color=color)

# plt.show()

model.save("./ml_model.hdf5")

def loadmodel():
    return keras.models.load_model("./ml_model.hdf5")

def predict(imagedata):
    model._make_predict_function()
    graph = tf.get_default_graph()
    
    prediction = None

    with graph.as_default():
        prediction = model.predict(imagedata)
    return prediction
