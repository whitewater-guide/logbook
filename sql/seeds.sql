TRUNCATE descents, sections;

INSERT INTO sections (
    id,
    parent_id,
    user_id,
    difficulty,
    region,
    river,
    section,
    upstream_id,
    upstream_data,
    created_at,
    updated_at
  )
VALUES
  (
    '45e70501-5d20-449f-b854-52b06b138831', -- section 1
    NULL,
    'ad808d80-7d1d-4bee-8276-0b9204e46b2f', -- user 1
    7,
    'Norway',
    'Sjoa',
    'Amot',
    'd749dbc1-166f-41d1-91ac-e4658d30d90f',
    '{"upstream": "upstream section 1 data"}',
    '2020-01-01',
    '2020-01-01'
  ),
  (
    'e7d03e01-4927-4ae1-82bf-a9e195e59db6', -- section 2
    NULL,
    'ad808d80-7d1d-4bee-8276-0b9204e46b2f', -- user 1
    6,
    'Norway',
    'Sjoa',
    'Playrun',
    NULL,
    NULL,
    '2020-01-02',
    '2020-01-02'
  ),
  (
    '7565d9ee-0fc0-4b49-be34-a62d59223067', -- section 3
    NULL,
    'ad808d80-7d1d-4bee-8276-0b9204e46b2f', -- user 1
    5,
    'Norway',
    'Sjoa',
    'Asengjuvet',
    NULL,
    NULL,
    '2020-01-03',
    '2020-01-03'
  ),
  (
    'f9035355-0499-4d1c-9ccd-c9909dbad49a', -- section 4
    '45e70501-5d20-449f-b854-52b06b138831', -- section 1
    '60d37885-4d41-4ce2-9ae6-e413eaa28ed3', -- user 2
    8, -- modified
    'Norway',
    'Sjoa',
    'Amot',
    'd749dbc1-166f-41d1-91ac-e4658d30d90f',
    '{"upstream": "upstream section 1 data"}',
    '2020-01-04',
    '2020-01-04'
  ),
  (
    'eae06053-a542-46d7-9708-6d08f1284d7f', -- section 5
    NULL,
    '60d37885-4d41-4ce2-9ae6-e413eaa28ed3', -- user 2
    7,
    'Mexico',
    'Alseseca',
    'Roadside',
    NULL,
    NULL,
    '2020-01-05',
    '2020-01-05'
  ),
  (
    '7336271e-120c-4c31-9aee-685704e41b2b', -- section 6
    NULL,
    '60d37885-4d41-4ce2-9ae6-e413eaa28ed3', -- user 2
    9,
    'Mexico',
    'Alseseca',
    'Big Banana',
    NULL,
    NULL,
    '2020-01-06',
    '2020-01-06'
  ),
  (
    '2186e9bf-19f8-4a26-a9a1-80de877c4084', -- section 7
    NULL,
    '8e295235-d6aa-4fbf-bf64-1f9c9decba5c', -- user 3
    5,
    'Georgia',
    'Bzhuzha',
    'Lower',
    NULL,
    NULL,
    '2020-01-07',
    '2020-01-07'
  ),
  (
    '8f43c474-72a5-4575-b51e-ccf3823d8014', -- section 8
    NULL,
    '8e295235-d6aa-4fbf-bf64-1f9c9decba5c', -- user 3
    6,
    'Georgia',
    'Bzhuzha',
    'Long race',
    NULL,
    NULL,
    '2020-01-08',
    '2020-01-08'
  ),
  (
    '720f5a61-a272-4552-a731-1d1d9848f9b7', -- section 9
    '45e70501-5d20-449f-b854-52b06b138831', -- section 1
    '8e295235-d6aa-4fbf-bf64-1f9c9decba5c', -- user 3
    7,
    'Norway',
    'Sjoa',
    'Amot',
    'd749dbc1-166f-41d1-91ac-e4658d30d90f',
    '{"upstream": "upstream section 1 data"}',
    '2020-01-09',
    '2020-01-09'
  );

INSERT INTO descents (
    id,
    user_id,
    section_id,
    parent_id,
    public,
    comment,
    duration,
    level_unit,
    level_value,
    upstream_data,
    started_at,
    created_at,
    updated_at
  )
VALUES
  (
    '97998f67-74f2-43db-a4e4-198c2ca540a7', -- descent 1
    'ad808d80-7d1d-4bee-8276-0b9204e46b2f', -- user 1
    '45e70501-5d20-449f-b854-52b06b138831', -- section 1
    NULL,
    TRUE,
    'descent 1 comment',
    3600,
    'm3/s',
    99.9,
    '{"upstream": "descent 1 upstream data"}',
    '2020-01-01',
    '2020-01-01',
    '2020-01-01'
  ),
  (
    '3fb2b1da-6649-429e-8b0e-0cbbda055da7', -- descent 2
    'ad808d80-7d1d-4bee-8276-0b9204e46b2f', -- user 1
    'e7d03e01-4927-4ae1-82bf-a9e195e59db6', -- section 2
    NULL,
    FALSE,
    'descent 2 comment',
    3000,
    'm',
    0.9,
    NULL,
    '2020-01-02',
    '2020-01-02',
    '2020-01-02'
  ),
  (
    '7deddd48-9f7f-4a76-9ff9-811f694f52a4', -- descent 3
    'ad808d80-7d1d-4bee-8276-0b9204e46b2f', -- user 1
    '7565d9ee-0fc0-4b49-be34-a62d59223067', -- section 3
    NULL,
    TRUE,
    'descent 3 comment',
    NULL,
    NULL,
    NULL,
    NULL,
    '2020-01-03',
    '2020-01-03',
    '2020-01-03'
  ),
    (
    'ffd6ba41-d7e5-4fbf-8347-2481d583674e', -- descent 4
    '60d37885-4d41-4ce2-9ae6-e413eaa28ed3', -- user 2
    'f9035355-0499-4d1c-9ccd-c9909dbad49a', -- section 4, parent section 1
    '97998f67-74f2-43db-a4e4-198c2ca540a7', -- descent 1
    TRUE,
    'descent 4, parent descent 1 comment',
    3600,
    'm3/s',
    99.9,
    '{"upstream": "descent 1 upstream data"}',
    '2020-01-01',
    '2020-01-04',
    '2020-01-04'
  ),
  (
    '3a12cd33-2ccd-4fcd-9da5-7ce14006aa15', -- descent 5
    '60d37885-4d41-4ce2-9ae6-e413eaa28ed3', -- user 2
    'eae06053-a542-46d7-9708-6d08f1284d7f', -- section 5
    NULL,
    TRUE,
    'descent 5 comment',
    1000,
    NULL,
    4,
    NULL,
    '2020-01-05',
    '2020-01-05',
    '2020-01-05'
  ),
  (
    'f56a3887-34ba-493e-b681-43b0b4547df7', -- descent 6
    '60d37885-4d41-4ce2-9ae6-e413eaa28ed3', -- user 2
    '7336271e-120c-4c31-9aee-685704e41b2b', -- section 6
    NULL,
    FALSE,
    'descent 6 comment',
    7200,
    'cm',
    320,
    NULL,
    '2020-01-06',
    '2020-01-06',
    '2020-01-06'
  ),
  (
    'ac323bc5-47e7-43cf-b3dd-e029cf96fcf4', -- descent 7
    '8e295235-d6aa-4fbf-bf64-1f9c9decba5c', -- user 3
    '2186e9bf-19f8-4a26-a9a1-80de877c4084', -- section 7
    NULL,
    TRUE,
    'descent 7 comment',
    NULL,
    'cm',
    211,
    NULL,
    '2020-01-07',
    '2020-01-07',
    '2020-01-07'
  ),
  (
    '902c52f3-5165-443b-b4a7-2e9c27b48538', -- descent 8
    '8e295235-d6aa-4fbf-bf64-1f9c9decba5c', -- user 3
    '8f43c474-72a5-4575-b51e-ccf3823d8014', -- section 8
    NULL,
    FALSE,
    'descent 8 comment',
    600,
    'cfs',
    100,
    NULL,
    '2020-01-08',
    '2020-01-08',
    '2020-01-08'
  ),
  (
    '900ede8f-b605-4dd6-a9b2-9b2628f79254', -- descent 9
    '8e295235-d6aa-4fbf-bf64-1f9c9decba5c', -- user 3
    '8f43c474-72a5-4575-b51e-ccf3823d8014', -- section 8
    NULL,
    FALSE,
    'descent 9 comment',
    500,
    'cfs',
    100,
    NULL,
    '2020-01-09',
    '2020-01-09',
    '2020-01-09'
  ),
  (
    '7f712c8a-45a9-4fd5-966a-c8b4d07f36df', -- descent 10
    '8e295235-d6aa-4fbf-bf64-1f9c9decba5c', -- user 3
    '720f5a61-a272-4552-a731-1d1d9848f9b7', -- section 9, parent section 1
    '97998f67-74f2-43db-a4e4-198c2ca540a7', -- descent 1
    TRUE,
    'descent 10, parent descent 1 comment',
    3600,
    'm3/s',
    99.9,
    '{"upstream": "descent 1 upstream data"}',
    '2020-01-01',
    '2020-01-10',
    '2020-01-10'
  )
