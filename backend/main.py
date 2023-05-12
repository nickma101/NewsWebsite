from app import newsapp, db
from app.database import Exposures, Selections, Reads, Users, Positions


@newsapp.shell_context_processor
def make_shell_context():
    return {'db': db, 'Users': Users, 'Reads': Reads, 'Exposures': Exposures, 'Selections': Selections,
            'Positions': Positions}
