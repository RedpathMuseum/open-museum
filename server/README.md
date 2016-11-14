## Development

### Migrate the database for dev
Run the migrate script using Flask-Migrate
```
python app.py db upgrade
```

### Run the server
Use the dev.sh script
```
./dev.sh
```

## File not found config.py
FileNotFoundError: [Errno 2] Unable to load configuration file (No such file or directory): '/home/fxleblanc/Repositories/open-museum/server/instance/config.py'

### Solution
Copy instance/config.py.skel as instance/config.py
```
cp instance/config.py.skel instance/config.py
```
