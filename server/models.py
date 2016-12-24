from database import db_session, Base, Column, Integer, String

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String(128))
