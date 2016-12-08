import os

from flask import Flask

__author__ = 'an'

app = Flask(__name__)
conf = {
    'dev': 'config.Dev'
}

env = os.environ.get('ENV', 'dev')
app.config.from_object(conf[env])

if __name__ == '__main__':
    from view import *

    app.run(app.config['HOST'], app.config['PORT'])
