#!/usr/bin/env python
import sys

from appellofi.app import app

if __name__ == "__main__":
    print(sys.argv)
    if sys.argv[1] == 'runserver':
        app.run('0.0.0.0', debug=True)
