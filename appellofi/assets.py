from django_assets import Bundle, register

lesses = [
    'common'
]

for less in lesses:
    bundle = Bundle('appellofi/static/css/{}.less'.format(less),
                    filters='less',
                    output='appellofi/static/gen/{}.min.css'.format(less))
    register('{}_css'.format(less), bundle)

# Javascript
js_files = [
    'player',
]

for js in js_files:
    print("hi")
    bundle = Bundle('appellofi/static/js/{}.js'.format(js),
                    filters='uglifyjs',
                    output='appellofi/static/gen/{}.min.js'.format(js))
    register('{}_js'.format(js), bundle)
