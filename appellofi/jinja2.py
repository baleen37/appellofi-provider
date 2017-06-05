import subprocess

from django.conf import settings
from django.contrib import messages
from django.urls import reverse

from jinja2 import Environment


def environment(**options):
    def static_cache_query(url):

        out = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'])

        try:
            git_hash = out.strip().decode('ascii')
        except OSError:
            git_hash = "f9e9a0"

        return "%s%s?%s" % (settings.STATIC_URL, url, git_hash)

    env = Environment(**options)
    env.globals.update({
        'static': static_cache_query,
        'url': reverse,
        'get_messages': messages.get_messages,
    })
    return env
