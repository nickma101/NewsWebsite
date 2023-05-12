###########################################################################
#          (C) Vrije Universiteit, Amsterdam (the Netherlands)            #
#                                                                         #
# This file is part of AmCAT - The Amsterdam Content Analysis Toolkit     #
#                                                                         #
# AmCAT is free software: you can redistribute it and/or modify it under  #
# the terms of the GNU Lesser General Public License as published by the  #
# Free Software Foundation, either version 3 of the License, or (at your  #
# option) any later version.                                              #
#                                                                         #
# AmCAT is distributed in the hope that it will be useful, but WITHOUT    #
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or   #
# FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public     #
# License for more details.                                               #
#                                                                         #
# You should have received a copy of the GNU Lesser General Public        #
# License along with AmCAT.  If not, see <http://www.gnu.org/licenses/>.  #
###########################################################################
from __future__ import unicode_literals, print_function, absolute_import

from collections import namedtuple
from itertools import islice
"""
Utility module for accessing the AmCAT API.

This module is designed to be used as an independent module, so you can copy
this file into your project. For that reason, this module is also licensed
under the GNU Lesser GPL rather than the Affero GPL, so feel free to use it
in non-GPL programs.
"""

import re
import requests
import json
import logging
import os
import os.path
import csv
import itertools
import tempfile

from six import string_types

log = logging.getLogger(__name__)

Version = namedtuple("Version", ["major", "minor", "build"])

def serialize(obj):
    """JSON serializer that accepts datetime & date"""
    from datetime import datetime, date, time
    if isinstance(obj, date) and not isinstance(obj, datetime):
        obj = datetime.combine(obj, time.min)
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, set):
        return sorted(obj)


class URL:
    articlesets = 'projects/{project}/articlesets/'
    articleset = articlesets + '{articleset}/'
    article = articleset + 'articles/'
    search = 'search'
    get_token = 'get_token'
    media = 'medium'
    aggregate = 'aggregate'
    projectmeta = articleset + "meta"
    meta = "meta"
    status = 'status'

AUTH_FILE = os.path.join("~", ".amcatauth")

class APIError(EnvironmentError):

    def __init__(self, http_status, message, url, response, description=None, details=None):
        super(APIError, self).__init__(http_status, message, url)
        self.http_status = http_status
        self.url = url
        self.response = response
        self.description = description
        self.details = details

    def __str__(self):
        return "{parent}: {description}; {details}".format(
            parent=super(APIError, self).__str__(), **self.__dict__
        )

class Unauthorized(APIError):
    pass

def _APIError(http_status, *args, **kargs):
    cls = Unauthorized if http_status == 401 else APIError
    return cls(http_status, *args, **kargs)

        
def check(response, expected_status=200, url=None):
    """
    Check whether the status code of the response equals expected_status and
    raise an APIError otherwise.
    @param url: The url of the response (for error messages).
                Defaults to response.url
    @param json: if True, return r.json(), otherwise return r.text
    """
    if response.status_code != expected_status:
        if url is None:
            url = response.url


        try:
            err = response.json()
        except:
            err = {} # force generic error

        if all(x in err for x in ("status", "message", "description", "details")):
            raise _APIError(err["status"], err['message'], url,
                           err, err["description"], err["details"])
        else: # generic error
            suffix = ".html" if "<html" in response.text else ".txt"
            msg = response.text
            if len(msg) > 200:
                with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
                    f.write(response.text.encode("utf-8"))
                msg = "{}...\n\n[snipped; full response written to {f.name}".format(msg[:100], **locals())
                
            msg = ("Request {url!r} returned code {response.status_code},"
                   " expected {expected_status}. \n{msg}".format(**locals()))
            raise _APIError(response.status_code, msg, url, response.text)
    if response.headers.get('Content-Type') == 'application/json':
        try:
            return response.json()
        except:
            raise Exception("Cannot decode json; text={response.text!r}"
                            .format(**locals()))
    else:
        return response.text


class AmcatAPI(object):

    def __init__(self, host, user=None, password=None, token=None):
        """
        Connection to an AmCAT server.

        :param host: AmCAT server address, including http(s)://
        :param user: Username. If not given, taken from AMCAT_USER or USER environment
        :param password: Password. If not given, taken from AMCAT_PASSWORD environment, or read from ~/.amcatauth
        :param token: Token to use (requires amcat >= 3.5)
        """
        self.host = host
        if token:
            try:
                self.token, self.version = self.renew_token(token)
            except APIError as e:
                logging.warning("Cannot renew token (requires amcat>3.5), trying normal authentication: {e}"
                                .format(**locals()))
                token = None
        if token is None:
            self.token, self.version = self.get_token(user, password)
        logging.info("Connected to {self.host} (AmCAT version {self.version})".format(**locals()))

    def has_version(self, major=3, minor=None):
        v = self.get_version()
        if v.major < major:
            return False
        return (minor is None) or (v.minor >= minor)

    def get_version(self):
        m = re.match(r"(\d+)\.(\d+)(.*)", self.version)
        if not m:
            raise Exception("Cannot parse version string: {self.version}".format(**locals()))
        return Version(int(m.group(1)), int(m.group(2)), m.group(3))

    def _get_auth(self, user=None, password=None):
        """
        Get the authentication info for the current user, from
        1) a ~/.amcatauth file, which should be a csv file
          containing host, username, password entries
        2) the AMCAT_USER (or USER) and AMCAT_PASSWORD environment variables
        """
        fn = os.path.expanduser(AUTH_FILE)
        if os.path.exists(fn):
            for i, line in enumerate(csv.reader(open(fn))):
                if len(line) != 3:
                    log.warning("Cannot parse line {i} in {fn}".format(**locals()))
                    continue
                hostname, username, pwd = line
                if (hostname in ("", "*", self.host)
                    and (user is None or username == user)):
                    return (username, pwd)
        if user is None:
            user = os.environ.get("AMCAT_USER", os.environ.get("USER"))
        if password is None:
            password = os.environ.get("AMCAT_PASSWORD")
        if user is None or password is None:
            raise Exception("No authentication info for {user}@{self.host} "
                            "from {fn} or AMCAT_USER / AMCAT_PASSWORD "
                            "variables".format(**locals()))
        return user, password

    def renew_token(self, token):
        self.token = token
        resp = self.request(URL.get_token, method='post', expected_status=200)
        return resp['token'], resp['version']

    def get_token(self, user=None, password=None):
        if user is None or password is None:
            user, password = self._get_auth()
        url = "{self.host}/api/v4/{url}".format(url=URL.get_token, **locals())
        r = requests.post(url, data={'username': user, 'password': password})
        try:
            r.raise_for_status()
        except:
            log.error(f"Error on getting token:\n\n{r.content}\n\n")
            raise
        r = r.json()
        return r['token'], r.get('version', '3.3 (or older)')

    def request(self, url, method="get", format="json", data=None,
                expected_status=None, headers=None, use_xpost=True, **options):
        """
        Make an HTTP request to the given relative URL with the host,
        user, and password information. Returns the deserialized json
        if successful, and raises an exception otherwise
        """
        if expected_status is None:
            if method == "get":
                expected_status = 200
            elif method == "post":
                expected_status = 201
            else:
                raise ValueError("No expected status supplied and method unknown.")

        if not url.startswith("http"):
            url = "{self.host}/api/v4/{url}".format(**locals())

        if format is not None:
            options = dict({'format': format}, **options)
        options = {field: value for field, value in options.items() if value is not None}
        headers = dict(headers or {}, Authorization="Token {}".format(self.token))
        #headers['Accept-encoding'] = 'gzip'

        if method == "get" and use_xpost:
            # If method is purely GET, we can use X-HTTP-METHOD-OVERRIDE to send our
            # query via POST. This allows for a large number of parameters to be supplied
            assert(data is None)

            headers.update({"X-HTTP-METHOD-OVERRIDE": method})
            data = options
            options = None
            method = "post"

        r = requests.request(method, url, data=data, params=options, headers=headers)

        log.debug(
            "HTTP {method} {url} (options={options!r}, data={data!r},"
            "headers={headers}) -> {r.status_code}".format(**locals())
        )
        return check(r, expected_status=expected_status)



    def get_pages(self, url, page=1, page_size=100, yield_pages=False, **filters):
        """
        Get all pages at url, yielding individual results
        :param url: the url to fetch
        :param page: start from this page
        :param page_size: results per page
        :param yield_pages: yield whole pages rather than individual results
        :param filters: additional filters
        :return: a generator of objects (dicts) from the API
        """
        n = 0
        for page in itertools.count(page):
            r = self.request(url, page=page, page_size=page_size, **filters)
            n += len(r['results'])
            log.debug("Got {url} page {page} / {pages}".format(url=url, **r))
            if yield_pages:
                yield r
            else:
                for row in r['results']:
                    yield row
            if r['next'] is None:
                break

    def get_scroll(self, url, page_size=100, yield_pages=False, **filters):
        """
        Scroll through the resource at url and yield the individual results
        :param url: url to scroll through
        :param page_size: results per page
        :param yield_pages: yield whole pages rather than individual results
        :param filters: Additional filters
        :return: a generator of objects (dicts) from the API
        """
        n = 0
        options = dict(page_size=page_size, **filters)
        format = filters.get('format')
        while True:
            r = self.request(url, use_xpost=False, **options)
            n += len(r['results'])
            log.debug("Got {} {n}/{total}".format(url.split("?")[0], total=r['total'], **locals()))
            if yield_pages:
                yield r
            else:
                for row in r['results']:
                    yield row
            if r['next'] is None:
                break
            url = r['next']
            options = {'format': None}
            
    def get_status(self):
        """Get the AmCAT status page"""
        url = URL.status.format(**locals())
        return self.get_request(url)
    
    def aggregate(self, **filters):
        """Conduct an aggregate query"""
        url = URL.aggregate.format(**locals())
        return self.get_pages(url, **filters)

    def list_sets(self, project, **filters):
        """List the articlesets in a project"""
        url = URL.articlesets.format(**locals())
        return self.get_pages(url, **filters)

    def get_set(self, project, articleset, **filters):
        """List the articlesets in a project"""
        url = URL.articleset.format(**locals())
        return self.request(url, **filters)

    def list_articles(self, project, articleset, page=1, **filters):
        """List the articles in a set"""
        url = URL.article.format(**locals())
        return self.get_pages(url, page=page, **filters)

    def get_media(self, medium_ids):
        query = "&".join("pk={}".format(mid) for mid in medium_ids)
        url = "{}?{}".format(URL.media, query)
        return self.request(url, page_size=len(medium_ids))

    def create_set(self, project, json_data=None, **options):
        """
        Create a new article set. Provide the needed arguments using
        post_data or with key-value pairs
        """
        url = URL.articlesets.format(**locals())
        if json_data is None:
            # form encoded request
            return self.request(url, method="post", data=options)
        else:
            if not isinstance(json_data, (string_types)):
                json_data = json.dumps(json_data,default = serialize)
            headers = {'content-type': 'application/json'}
            return self.request(
                url, method='post', data=json_data, headers=headers)

    def create_articles(self, project, articleset, json_data=None, batch_size=100, **options):
        """
        Create one or more articles in the set. Provide the needed arguments
        using the json_data or with key-value pairs.
        If json_data is a list, it will be split into batch_size chunks and uploaded per chunk
        @param json_data: A dictionary or list of dictionaries. Each dict
                          can contain a 'children' attribute which
                          is another list of dictionaries.
        @param batch_size: Upload batch size. Set to None to disable batching
        """
        if isinstance(json_data, list) and batch_size:
            result = []
            for chunk in get_chunks(json_data, batch_size):
                logging.info(f"Uploading {len(chunk)} articles to AmCAT")
                result += self._create_articles(project, articleset, chunk, **options)
            return result
        else: # don't chunk single article or json string
            return self._create_articles(project, articleset, json_data, **options)

    def _create_articles(self, project, articleset, json_data=None, **options):
        url = URL.article.format(**locals())
        # TODO duplicated from create_set, move into requests
        # (or separate post method?)
        if json_data is None:
            # form encoded request
            return self.request(url, method="post", data=options)
        else:
            if not isinstance(json_data, string_types):
                json_data = json.dumps(json_data, default=serialize)
            headers = {'content-type': 'application/json'}
            return self.request(url, method='post', data=json_data, headers=headers)

    def get_articles(self, project, articleset=None, format='json',
                     columns=['date', 'headline', 'medium'], page_size=1000, page=1, **filters):
        if self.has_version(3, 4):
            url = URL.projectmeta.format(**locals())
            return self.get_scroll(url, page=page, page_size=page_size, format=format, columns=",".join(columns),
                                   filters=json.dumps(filters))
        else:
            return self.list_articles(project, articleset, page, page_size=page_size, **filters)

    def get_articles_by_id(self, articles=None, format='json',
                     columns=['date', 'headline', 'medium'], page_size=100, **options):
        url = URL.meta.format(**locals())
        # we cannot use POST here, so need to limit number of ids per request
        it = iter(articles)
        while True:
            ids = list(islice(it, page_size))
            if not ids:
                break
            options['id'] = ids
            for a in self.get_scroll(url, page_size=page_size, format=format, columns=columns, **options):
                yield a

    def get_articles_by_uuid(self, articles=None, format='json',
                     columns=['date', 'headline', 'medium'], page_size=1000, page=1, **options):
        url = URL.meta.format(**locals())
        options['uuid'] = articles
        return self.get_scroll(url, page=page, page_size=page_size, format=format, columns=columns, **options)

    def search(self, articleset, query, columns=['hits'], minimal=True, **filters):
        return self.get_pages(URL.search, q=query, col=columns, minimal=minimal, sets=articleset, **filters)


def get_chunks(sequence, batch_size):
    # TODO can be made more efficient by not creating a new list every time
    buffer = []
    for a in sequence:
        buffer.append(a)
        if len(buffer) >= batch_size:
            yield buffer
            buffer = []
    if buffer:
        yield buffer


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("server", help="Server hostname (e.g. https://amcat.nl)")
    parser.add_argument("--username", help="Username")
    parser.add_argument("--password", nargs="?", help="Password (leave empty to prompt)")
    action_parser = parser.add_subparsers(dest='action', title='Actions',)

    p = action_parser.add_parser("get_articles")
    p.add_argument('project', help="Project ID")
    p.add_argument('articleset', help="Article Set ID")
    p.add_argument('--page-size', nargs=1, type=int, default=100, help="Number of items per page")
    p.add_argument('--columns', default='date,headline,medium', help="Columns to retrieve (e.g. headline,date)")
    p.add_argument('--format', default='json', help="Format (currently only json is supported)", choices=['json'])

    args = parser.parse_args()
    c = AmcatAPI(args.server, args.username, args.password)

    if args.action == "get_articles":
        kargs = dict(page_size=args.page_size, format=args.format, columns=args.columns.split(","))
        for a in c.get_articles(args.project, args.articleset, **kargs):
            print(json.dumps(a))
