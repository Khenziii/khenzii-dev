## The database (called "blog") contains these things:
### tables
- **user**(**id** SERIAL PRIMARY KEY, **username** VARCHAR(20), **email** TEXT, **password** TEXT, **joined_at** TEXT) -- the password is obviously hashed :)
- **profile_picture**(**id** SERIAL PRIMARY KEY, **user_id** INT, **default** VARCHAR(4)) -- If default parameter is set to "true", we won't store the image (use the deafult one)
- **bio**(**id** SERIAL PRIMARY KEY, **user_id** INT, **text_value** TEXT, **links** TEXT) -- 300 characters will be the limit in bio's
- **category**(**id** SERIAL PRIMARY KEY, **user_id** INT, **title** TEXT, **description** TEXT, **index_in_user** INT) -- 30 characters will be the largest possible title
- **post**(**id** SERIAL PRIMARY KEY, **category_id** INT, **text_value** TEXT, **created_at** TEXT, **index_in_category** INT) -- didn't set the text_value character limit, because trusted id's will be able to bypass it (server-side will verify everything). The index_in_category variable is used for sending posts to the client.
- **blacklisted_token**(**id** SERIAL PRIMARY KEY, **user_id** INT, **token** TEXT) -- after the user changes their's username, i'm never 100% sure that the client-side in fact removed the jwt_access_cookie, this is why we write the old tokens here in order to ignore them in the future.