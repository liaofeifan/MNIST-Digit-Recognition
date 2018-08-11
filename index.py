from flask import Flask, request, render_template, url_for
from keras import optimizers
from PIL import Image
import numpy as np
import ml_mnist
import base64
import os

app = Flask(__name__, static_folder='static')  

model = ml_mnist.loadmodel()
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')

# img = Image.open("drawings/currentdrawing.png")
# imgarray = list(img.getdata())
# imgarray = [imgarray[x][y]for x in range(len(imgarray)) for y in range(4) if y == 0]
# imgarray = (np.expand_dims(np.asarray([imgarray[x*28:(x+1)*28] for x in range(len(imgarray) // 28)]), 0))
# print(imgarray)
# prediction = model.predict(imgarray)
# print(prediction)   

class_list = [0,1,2,3,4,5,6,7,8,9]


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST', 'GET'])
def submit():
    data = request.values['imgBase64']
    data = data.split(',')[1]
    imgdata = base64.b64decode(data)

    file = open('drawings/currentdrawing.png', 'wb')
    file.write(imgdata)
    file.close() 

    image = Image.open('drawings/currentdrawing.png')
    data = get_image_data(image) 
    prediction = model.predict(data)

    prediction = np.argmax(prediction)
    print(prediction)
    return str(prediction)

def get_image_data(image):
    imgarray = list(image.getdata())
    data = [imgarray[x][y] for x in range(len(imgarray)) for y in range(4) if y == 0]

    data = [data[x*28:(x+1)*28] for x in range(len(data) // 28)]
    data = (np.expand_dims(np.asarray(data), 0))
    return data

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == 'templates':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)

app.run(debug=False)


