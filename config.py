import os

__author__ = 'an'


class Base(object):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    HOST = '0.0.0.0'
    UPLOAD_FOLDER = 'static/files/'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'mp4', 'webm'}
    MAX_CONTENT_LENGTH = 268435456  # 256 * 1024 * 1024


class Dev(Base):
    SECRET_KEY = 't\x9c\x93\x82\xdd6#\xd6\x0fk\x1c\xe6\x9d(&\xb9V\\[h\x01\xc3:`'
    PORT = 10003
    DEBUG = True
