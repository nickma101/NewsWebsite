# NewsWebsite - WORK IN PROGRESS

A flexible Application that allows designing different kinds of experimental news websites for academic research. Feel
free to use and adapt it to your needs.

The app runs on a Python backend and can fetch articles either from a local database or from an external API. The
frontend is built on React and features several options for customisation. The default setting of the app includes a
homepage where articles are shown as a list and a reading page where users can read individual articles. In addition,
the app also features several alternative ways of displaying content (overall homepage and individual articles). See
below for images.

### Default Frontend

### Alternative homepage

### Alternative article cards

## Installation

1. Clone the repository

```
git clone https://github.com/nickma101/NewsWebsite
```

2. Create a virtual environment and activate it:

```
python3 -m venv venv
source venv/bin/activate
```

3. Install requirements with

```
pip install -r requirements.txt
```

4. Edit (if necessary) and initialise database (see [add link] for default database models)

```
flask db init
flask db migrate
flask db upgrade
```

## Customisation

Both the front- and backend can be freely adapted.

### Frontend

Available display options include a number of different article cards as well as either a news homepage or a one- or
two-column grid (see above).

## Backend

Depending on your setup you might want to change the source of the articles (e.g. access via API or from local
database), the database model, or the recommendation logic. See here for a conceptual model of the app: [add link].
Changes to the different elements can be made in the respective python scripts (e.g. algorithms.py for the
recommendation logic or routes.py for which data is being logged and when)