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
    condition1 = ["1c", "2c", "3c", "4c", "11c", "12c", "5d", "10d"]
    condition2 = ["1a", "2a", "3b", "4c", "11c", "12c", "5c", "10d"]
    condition3 = ["1a", "2a", "3a", "4a", "11a", "12a", "5b", "10d"]
    condition4 = ["1c", "2c", "3d", "4d", "11d", "12d", "5d", "10d"]
    condition5 = ["1a", "2a", "3b", "4d", "11d", "12d", "5d", "10d"]
    condition6 = ["1a", "2a", "3b", "4b", "11b", "12b", "5b", "10d"]
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
