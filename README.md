# Experimental News Website 

Used for the study "It Ain't Easy: Using Normatively Motivated News Diversification to Facilitate Policy Support, Tolerance, and Political Participation"
(for details on the study itself, please see https://osf.io/zqw6s/).

The app runs on a Python backend and can fetch articles either from a local database or from an external API. The
frontend is built on React and features several options for customisation. The default setting of the app includes a
homepage where articles are shown as a list and a reading page where users can read individual articles. 


## How to set it up

1. Clone the repository

```
git clone https://github.com/nickma101/NewsWebsite
```

2. Create a virtual environment and activate it:

```
python3 -m venv venv
source venv/bin/activate
```

3. Navigate to backend and install requirements with

```
cd backend
pip install -r requirements.txt
```

4. Edit (if necessary) and initialise database (see [add link] for default database models)

```
flask db init
flask db migrate
flask db upgrade
```

5. Start the backend

```
flask run
```

6. Install necessary react packages

```
cd frontend
npm i
```

7. Start the react frontend and python backend for local development

```
npm start
```

*Note for Mac-users: The backend runs on localhost:5000 by default. However, it may be that this port is blocked. If the
app is not running you may want to deactivate AirPlay or change the API endpoint for the backend

## Customisation

Both the front- and backend can be freely adapted.

