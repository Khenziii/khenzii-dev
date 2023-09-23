## The database (called "blog") contains these things:
### tables
- **user**(**id** SERIAL PRIMARY KEY, **username** VARCHAR(20), **email** TEXT, **password** TEXT, **joined_at** TEXT) -- the password is obviously hashed :)
- **profile_picture**(**id** SERIAL PRIMARY KEY, **user_id** INT, **default** VARCHAR(4)) -- If default parameter is set to "true", we won't store the image (use the deafult one)
- **bio**(**id** SERIAL PRIMARY KEY, **user_id** INT, **text_value** VARCHAR(300), **links** TEXT) -- 300 characters will be the limit in bio's
- **category**(**id** SERIAL PRIMARY KEY, **user_id** INT, **title** VARCHAR(30), **description** VARCHAR(200)) -- 30 characters will be the largest possible title
- **post**(**id** SERIAL PRIMARY KEY, **category_id** INT, **text_value** TEXT, **created_at** TEXT, **index_in_category** INT) -- didn't set the text_value character limit, because trusted id's will be able to bypass it (server-side will verify everything).