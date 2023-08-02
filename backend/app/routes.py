"""
Handles the different routes that are necessary for the experiment: Backend API retrieval & database updates
(the frontend is determined by the React app)
- homepage (currently no purpose)
- recommendation page for the different article_sets from which users choose
- single article page where users can read and rate an article
- Finish page that re-directs users back to Qualtrics (work in progress)
"""
from flask import request, jsonify
from flask_cors import cross_origin
from . import newsapp, db, recommender
from .database import Exposures, Selections, Reads, Users, Positions
from datetime import datetime

"""
Homepage
"""


@newsapp.route('/')
def home():
    return "does this work?"


"""
Recommendation page where article selection takes place

    function that retrieves articles from the backend and logs them in the db "Exposures"
    Input: retrieves user_id and experimental condition from url
    Output: json of articles
"""


@newsapp.route('/recommendations', methods=["GET"])
@cross_origin()
def get_recommendations():
    timestamp = datetime.utcnow()
    user_id = request.args.get('user_id')
    experimental_condition = request.args.get('condition')
    exposure_id = "{}/{}".format(user_id,
                                 str(timestamp))
    users = [user.user_id for user in Users.query.all()]
    # check if user exists in db; if not:
    if user_id not in users:
        # add user to db
        user = Users(user_id=user_id,
                     timestamp_start=timestamp,
                     experimental_condition=experimental_condition,
                     )
        db.session.add(user)
        # retrieve articles from backend
        articles = recommender.get_articles_from_backend(experimental_condition)
        # log article positions
        counter = 0
        for article in articles:
            article_id = article['id']
            position = counter
            counter += 1
            user_id = user_id
            article_position = Positions(article_id=article_id,
                                         user_id=user_id,
                                         position=position,
                                         primary="{}/{}/{}".format(user_id,
                                                                   article_id,
                                                                   position)
                                         )
            db.session.add(article_position)
        # log first exposure
        exposure = Exposures(user_id=user_id,
                             timestamp_exposures=timestamp,
                             exposure_id=exposure_id,
                             exposure_number=1,
                             )
        db.session.add(exposure)
        print("!!!!! First EXPOSURE was logged")
        db.session.commit()
    # if user already exists in db
    else:
        # log this exposure
        exposure_number = [exposure.exposure_number for exposure in Exposures.query.filter_by(user_id=user_id)][
                              -1] + 1
        exposure = Exposures(user_id=user_id,
                             timestamp_exposures=timestamp,
                             exposure_id=exposure_id,
                             exposure_number=exposure_number,
                             )
        db.session.add(exposure)
        print("!!!!! EXPOSURE was logged")
        # retrieve articles in original positions
        articles = []
        ids = [positions.article_id for positions in Positions.query.filter_by(user_id=user_id)]
        all_articles = recommender.get_articles_from_backend(experimental_condition)
        for item_id in ids:
            for article in all_articles:
                if article['id'] == item_id:
                    article = article
                    break
            articles.append(article)
        db.session.commit()
    return jsonify(articles)


"""
Article page where users can read and rate articles

    function that retrieves a selected article from the backend and logs it in the db "Selections"
    Input: retrieves user_id, article_id, title, and condition from url
    Output: json of single article
"""


@newsapp.route('/article', methods=["GET"])
@cross_origin()
def show_article():
    # request article id and throw warning if none is given
    article_id = request.args.get('article_id')
    if not article_id:
        raise Exception("No article id given")
    # request user id and throw warning if none is given
    user_id = request.args.get('user_id')
    if not user_id:
        raise Exception("No user id given")
    # retrieve article from backend
    return jsonify(recommender.get_article_from_backend(user_id, article_id))


@newsapp.route('/timer', methods=["GET"])
@cross_origin()
def check_timer():
    user_id = request.args.get('user_id')
    start_time = [user.timestamp_start for user in Users.query.filter_by(user_id=user_id)][0]
    timestamp = datetime.utcnow()
    usage_time = timestamp - start_time
    if usage_time.total_seconds() >= 120:
        return "ok"
    else:
        return "not ok"


@newsapp.route('/logRead', methods=["GET"])
@cross_origin()
def log_read():
    # process frontend input
    timestamp = datetime.utcnow()
    user_id = request.args.get('id')
    article_id = request.args.get('article_id')
    title = request.args.get('title')
    max_scroll = request.args.get('maxScroll')
    condition = request.args.get('condition')
    primary = "{}/{}/{}/{}".format(user_id,
                                   article_id,
                                   condition,
                                   str(timestamp))
    # retrieve last exposure id from database
    last_exposure_id = [exposure.exposure_id for exposure in Exposures.query.filter_by(user_id=user_id)][-1]
    # log read
    read = Reads(article_id=article_id,
                 user_id=user_id,
                 timestamp_reads=timestamp,
                 read_title=title,
                 max_scroll=max_scroll,
                 read_condition=condition,
                 exposure_id=last_exposure_id,
                 primary=primary)
    print("!!!!!!!!!!! read was logged", article_id)
    db.session.add(read)
    db.session.commit()
    return 'done'


@newsapp.route('/logSelection', methods=["GET"])
@cross_origin()
def log_selection():
    # process frontend input
    timestamp = datetime.utcnow()
    user_id = request.args.get('id')
    article_id = request.args.get('article_id')
    title = request.args.get('title')
    previous_scroll_rate = request.args.get('previous_scroll_rate')
    condition = request.args.get('condition')
    pop_state = request.args.get('pop_state')
    # retrieve last exposure id from database
    last_exposure_id = [exposure.exposure_id for exposure in Exposures.query.filter_by(user_id=user_id)][-1]
    # determine article positions
    positions = [position.__dict__ for position in Positions.query.filter_by(user_id=user_id)]
    position = 101
    for position in positions:
        if position['article_id'] == article_id:
            position = position['position']
            break
    # log read
    selection = Selections(article_id=article_id,
                           position=position,
                           user_id=user_id,
                           timestamp_selections=timestamp,
                           previous_scroll_rate=previous_scroll_rate,
                           title=title,
                           exposure_id=last_exposure_id,
                           condition=condition,
                           popstate=pop_state,
                           primary="{}/{}/{}/{}".format(user_id,
                                                        article_id,
                                                        position,
                                                        str(timestamp)))
    print("!!!!!!!!!!! SELECTIOn was logged", article_id, last_exposure_id, 'handle pop', pop_state)
    db.session.add(selection)
    db.session.commit()
    return 'done'
