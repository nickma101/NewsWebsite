"""
Handles the articles that are displayed to users
- Retrieves list of articles for the newsfeed with get_articles()
- Retrieves single articles with get_article()
- Two possible ways to retrieve articles:
    - from backend with get_article(s)_from_backend() depending on experimental condition
    - from API with get_article(s)_from_api() depending on experimental condition

The get_article(s) functions are called (and should be edited if necessary) in the routes file
"""

import json
import os
from . import algorithms

"""
Function that retrieves articles from Backend and returns them in randomised order

    Input: experimental_condition
    Output: Randomised list of articles that matches the condition that the user has been assigned to
"""


def get_articles_from_backend(experimental_condition):
    filename = os.path.join(os.getcwd(), 'app/static', 'stimulus_material.json')
    f = open(filename)
    data = json.load(f)
    return algorithms.tolerance_study_recommender(experimental_condition, data)


"""
Function that retrieves articles from an external API a- currently The Guardian API but can be edited in any way

    Input: experimental_condition
    Output: Randomised list of articles that matches the condition that the user has been assigned to
"""


def get_articles_from_api(experimental_condition):
    filename = os.path.join(os.getcwd(), 'app/static', 'stimulus_material.json')
    f = open(filename)
    data = json.load(f)
    return algorithms.tolerance_study_recommender(experimental_condition, data)


""""
Function that retrieves a single article

    Input: User Id, Article Id
    Output: A specific article
"""


def get_article_from_backend(user_id, article_id):
    user_id = user_id
    article_id = article_id
    filename = os.path.join(os.getcwd(), 'app/static', 'stimulus_material.json')
    f = open(filename)
    data = json.load(f)
    articles = []
    for article in data:
        articles.append(article)
    article = [a for a in articles if a['id'] == article_id]
    if article:
        return article
    else:
        return "No article was found"


""""
Function that retrieves a single article

    Input: User Id, Article Id
    Output: A specific article
"""


def get_article_from_api(user_id, article_id):
    user_id = user_id
    article_id = article_id
    filename = os.path.join(os.getcwd(), 'app/static', 'stimulus_material.json')
    f = open(filename)
    data = json.load(f)
    articles = []
    for article in data:
        articles.append(article)
    article = [a for a in articles if a['id'] == article_id]
    if article:
        return article
    else:
        return "No article was found"
