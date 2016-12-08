import os
from datetime import datetime
from json import dumps
from uuid import uuid4

from flask import render_template, request, jsonify, Response
from werkzeug.utils import secure_filename

from wsgi import app

__author__ = 'an'


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    else:
        file = request.files.get('file')
        if file and allowed_file(file.filename):
            now = datetime.now()
            path = os.path.join(
                app.config['BASE_DIR'], app.config['UPLOAD_FOLDER'], '{}/{}/{}'.format(now.year, now.month, now.day))
            os.makedirs(path, exist_ok=True)  # make dir if not exists

            filename = secure_filename(file.filename)
            pre = str(uuid4())
            file.save(os.path.join(path, '{}-{}'.format(pre, filename)))
            return jsonify({'msg': 'ok'})

        data = {
            'msg': 'File not found or invalid'
        }
        return Response(dumps(data), 400, mimetype='application/json')
