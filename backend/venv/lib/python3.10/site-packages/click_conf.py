#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import yaml
import click


def conf(*param_decls, **attrs):
    def decorator(f):
        def callback(ctx, param, value):
            if os.path.exists(value):
                ctx.default_map = yaml.load(open(value))
        attrs.setdefault('callback', callback)
        attrs.setdefault('is_eager', True)
        attrs.setdefault('type', str)
        attrs.setdefault('default', 'click.yml')
        attrs.setdefault('help', 'Load default configuration file from {default}'.format(**attrs))
        attrs.setdefault('expose_value', False)
        attrs.pop('config_file', None)
        return click.option(*(param_decls or ('-c', '--config-file')), **attrs)(f)
    return decorator
