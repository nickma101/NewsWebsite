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
    print('initial exposure id', exposure_id)
    users = [user.user_id for user in Users.query.all()]
    # check if user exists in db; if not:
    if user_id not in users:
        # add user to db
        user = Users(user_id=user_id,
                     timestamp_start=timestamp,
                     experimental_condition=experimental_condition,
                     )
        db.session.add(user)
        print("logging initial user")
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
        print("logging initial article positions")
        # log first exposure
        exposure = Exposures(user_id=user_id,
                             timestamp_exposures=timestamp,
                             exposure_id=exposure_id,
                             exposure_number=1,
                             )
        db.session.add(exposure)
        print("logging first exposure")
        db.session.commit()
        print('new user: exposures, positions, user committed')
    # if user already exists in db
    else:
        # check if last read was logged
        reads = [read.__dict__ for read in Reads.query.filter_by(user_id=user_id)]
        try:
            last_read = reads[-1]
            print('last read exposure id', last_read['exposure_id'])
            # if last read has not been logged
            last_exposure_id = last_read['exposure_id']
            last_article_id = last_read['article_id']
            last_condition = last_read['read_condition']
            print(last_read['primary'])
            print("{}/{}/{}/{}".format(user_id,
                                       last_article_id,
                                       last_condition,
                                       last_exposure_id))
            if last_read['primary'] != "{}/{}/{}/{}".format(user_id,
                                                            last_article_id,
                                                            last_condition,
                                                            last_exposure_id):
                # log last read
                selections = [selection.__dict__ for selection in Selections.query.filter_by(user_id=user_id)]
                last_selection = selections[-1]
                article_id = last_selection['article_id']
                title = last_selection['title']
                max_scroll = request.args.get('maxScroll')
                condition = last_selection['condition']
                last_exposure_id = last_selection['exposure_id']
                read = Reads(article_id=article_id,
                             user_id=user_id,
                             timestamp_reads=timestamp,
                             read_title=title,
                             max_scroll=max_scroll,
                             read_condition=condition,
                             exposure_id=last_exposure_id,
                             primary="{}/{}/{}/{}".format(user_id,
                                                          article_id,
                                                          condition,
                                                          last_exposure_id))
                db.session.add(read)
                print('logging last read')
                # log this exposure
                exposure_number = [exposure.exposure_number for exposure in Exposures.query.filter_by(user_id=user_id)][
                                      -1] + 1
                exposure = Exposures(user_id=user_id,
                                     timestamp_exposures=timestamp,
                                     exposure_id=exposure_id,
                                     exposure_number=exposure_number,
                                     )
                db.session.add(exposure)
                print("logging exposure number:", exposure_number)
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
                print('old user: exposures, last read committed')
        except:
            # log last read
            selections = [selection.__dict__ for selection in Selections.query.filter_by(user_id=user_id)]
            last_selection = selections[-1]
            article_id = last_selection['article_id']
            title = last_selection['title']
            max_scroll = request.args.get('maxScroll')
            condition = last_selection['condition']
            last_exposure_id = last_selection['exposure_id']
            read = Reads(article_id=article_id,
                         user_id=user_id,
                         timestamp_reads=timestamp,
                         read_title=title,
                         max_scroll=max_scroll,
                         read_condition=condition,
                         exposure_id=last_exposure_id,
                         primary="{}/{}/{}/{}".format(user_id,
                                                      article_id,
                                                      condition,
                                                      last_exposure_id))
            db.session.add(read)
            print('logging last read')
            # log this exposure
            exposure_number = [exposure.exposure_number for exposure in Exposures.query.filter_by(user_id=user_id)][
                                  -1] + 1
            exposure = Exposures(user_id=user_id,
                                 timestamp_exposures=timestamp,
                                 exposure_id=exposure_id,
                                 exposure_number=exposure_number,
                                 )
            db.session.add(exposure)
            print("logging exposure number:", exposure_number)
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
            print('old user: exposures, last read committed')
        # if last read has been logged (meaning someone refreshed the page)
        else:
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
            print('old user: no db updates')
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
    # determine article positions
    positions = [position.__dict__ for position in Positions.query.filter_by(user_id=user_id)]
    position = 101
    for position in positions:
        if position['article_id'] == article_id:
            position = position['position']
            break
    # request title, condition, previous scroll rate and determine timestamp
    previous_scroll_rate = request.args.get('previous_scroll_rate')
    title = request.args.get('title')
    condition = request.args.get('condition')
    exposure_id = str([exposure.exposure_id for exposure in Exposures.query.filter_by(user_id=user_id)][-1])
    timestamp = datetime.utcnow()
    # check if article selection has already been logged
    try:
        last_article_logged = [article.__dict__ for article in Selections.query.filter_by(user_id=user_id)][-1]
        if last_article_logged['exposure_id'] != exposure_id:
            # log article selection
            article_seen = Selections(article_id=article_id,
                                      position=position,
                                      user_id=user_id,
                                      timestamp_selections=timestamp,
                                      previous_scroll_rate=previous_scroll_rate,
                                      title=title,
                                      exposure_id=exposure_id,
                                      condition=condition,
                                      primary="{}/{}/{}/{}".format(user_id,
                                                                   article_id,
                                                                   position,
                                                                   str(timestamp)))
            db.session.add(article_seen)
            db.session.commit()
            print('selection committed, new article or at least new exposure id')
    except:
        # log article selection
        article_seen = Selections(article_id=article_id,
                                  position=position,
                                  user_id=user_id,
                                  timestamp_selections=timestamp,
                                  previous_scroll_rate=previous_scroll_rate,
                                  title=title,
                                  exposure_id=exposure_id,
                                  condition=condition,
                                  primary="{}/{}/{}/{}".format(user_id,
                                                               article_id,
                                                               position,
                                                               str(timestamp)))
        db.session.add(article_seen)
        db.session.commit()
        print('selection committed, new user with no previously read articles')
    else:
        print('selection not commited, it has already been logged so this was just a page refresh')
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
