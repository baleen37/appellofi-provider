import os
import subprocess
import functools
from datetime import datetime

from django.conf import settings
from django.contrib import messages
from django.urls import reverse

from jinja2 import Environment


@functools.lru_cache()
def get_git_changeset():
    repo_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    git_log = subprocess.Popen(
        'git log --pretty=format:%ct --quiet -1 HEAD',
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        shell=True, cwd=repo_dir, universal_newlines=True,
    )
    timestamp = git_log.communicate()[0]
    print(timestamp)
    try:
        timestamp = datetime.utcfromtimestamp(int(timestamp))
    except ValueError:
        return None
    return timestamp.strftime('%Y%m%d%H%M%S')


def environment(**options):
    def static_cache_query(url):
        git_hash = get_git_changeset()

        return "%s%s?%s" % (settings.STATIC_URL, url, git_hash)

    env = Environment(**options)
    env.globals.update({
        'static': static_cache_query,
        'url': reverse,
        'get_messages': messages.get_messages,
    })
    return env
