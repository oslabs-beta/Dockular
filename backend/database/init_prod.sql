CREATE TABLE IF NOT EXISTS public.user_info (
    pk_user_id BIGSERIAL NOT NULL PRIMARY KEY,
    user_name VARCHAR(55) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO public.user_info (user_name, password) VALUES
('hello', 'goodbye')