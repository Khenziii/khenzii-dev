## The database (called "blog") contains these things:
### tables
- **user**(**id** SERIAL PRIMARY KEY, **username** VARCHAR(20), **email** TEXT, **password** TEXT) -- the password is obviously hashed :)
- **profile_picture**(**id** SERIAL PRIMARY KEY, **user_id** INT, **image** BYTEA CHECK (octet_length(image) <= 5 * 1024 * 1024)) -- 5MB will be the maximum size of images (server-side will compress them before writing to the database tho)
- **bio**(**id** SERIAL PRIMARY KEY, **user_id** INT, **text_value** VARCHAR(300), **links** TEXT) -- 300 characters will be the limit in bio's
- **category**(**id** SERIAL PRIMARY KEY, **user_id** INT, **title** VARCHAR(30)) -- 30 characters will be the largest possible title
- **post**(**id** SERIAL PRIMARY KEY, **category_id** INT, **text_value** TEXT, **image** BYTEA CHECK (octet_length(image) <= 5 * 1024 * 1024))