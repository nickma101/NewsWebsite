"""
All available recommendation algorithms - feel free to add your own one

Each recommendation algorithm creates a list of articles; potentially filtered dependent upon the experimental
condition a user is in
Articles can be retrieved either from the backend or from an API with recommender. This is defined in routes.py
- Retrieves articles from backend with get_articles() depending on experimental condition -
Retrieves single articles from backend with get_article()
"""

import random

"""
Randomised recommender

    recommendation algorithm that displays articles in randomised order
    Input: data
    Output: list of articles
"""


def random_recommender(experimental_condition, data):
    articles = []
    for article in data:
        articles.append(article)
    random.shuffle(articles)
    return articles


"""
Study-specific recommender

    recommendation algorithm that selects articles according to pre-defined experimental conditions and displays them
    in randomised order.
    Input: experimental_condition, data
    Output: list of articles
"""


def tolerance_study_recommender(experimental_condition, data):
    condition1 = ["11c", "2c", "3c", "9d"]
    condition2 = ["11a", "2a", "3c", "9d"]
    condition3 = ["11a", "2a", "3a", "9d"]
    condition4 = ["11c", "2d", "3d", "9d"]
    condition5 = ["11a", "2b", "3d", "9d"]
    condition6 = ["11a", "2b", "3b", "9d"]
    articles = []
    for article in data:
        if experimental_condition == "condition1":
            if article['id'] in condition1:
                articles.append(article)
        elif experimental_condition == "condition2":
            if article['id'] in condition2:
                articles.append(article)
        elif experimental_condition == "condition3":
            if article['id'] in condition3:
                articles.append(article)
        elif experimental_condition == "condition4":
            if article['id'] in condition4:
                articles.append(article)
        elif experimental_condition == "condition5":
            if article['id'] in condition5:
                articles.append(article)
        elif experimental_condition == "condition6":
            if article['id'] in condition6:
                articles.append(article)
    random.shuffle(articles)
    return articles
