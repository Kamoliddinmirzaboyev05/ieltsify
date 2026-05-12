-- Seed Data for content tables

-- 1. Vocabulary Topics
insert into public.vocabulary_topics (id, title) values 
('travel', 'Travel & Transport'),
('health', 'Health & Body'),
('work', 'Work & Career'),
('education', 'Education'),
('technology', 'Technology & Internet'),
('food', 'Food & Cooking'),
('environment', 'Environment & Nature'),
('money', 'Money & Shopping'),
('relationships', 'Relationships & Feelings'),
('housing', 'Housing & Home')
on conflict (id) do nothing;

-- 2. Speaking Tests
insert into public.speaking_tests (id, title, description, part1_topics, part2, part3) values 
('test1', 'IELTS Speaking Full Mock Test #1', 'Home & Accommodation, Public Transport, Celebrities, Good News', 
'[{"topic": "Home & Accommodation", "questions": ["Do you live in a house or an apartment?", "Which is your favorite room in your home? Why?", "How long have you lived there?", "If you could change anything about your home, what would it be?"]}, {"topic": "Public Transport", "questions": ["What kind of public transport do you usually take?", "Is it expensive to travel by bus or train in your town?", "Did you take public transport when you were a child?", "How could public transport in your city be improved?"]}, {"topic": "Celebrities", "questions": ["Who is your favorite celebrity in your country?", "Would you like to be a celebrity? Why/why not?", "Do you think celebrities should have a private life?"]}]'::jsonb,
'{"topic": "A piece of good news", "cueCard": "Describe a time when you received a piece of good news.", "points": ["What the news was", "Who told you this news", "When and where it happened", "And explain how you felt when you heard this news"], "preparationTime": 60, "speakingTime": 120}'::jsonb,
'{"topic": "Communication & News", "questions": ["Is it better to deliver good news face-to-face or via a phone call?", "Why do some people prefer to share their good news on social media?", "Do you think the media focuses too much on negative news instead of positive stories?", "How has the way people receive news changed compared to several decades ago?", "Does the government have a responsibility to filter news for the public?"]}'::jsonb),
('test2', 'IELTS Speaking Full Mock Test #2', 'Work/Study, Weather, Robots, Historic Building',
'[{"topic": "Work or Study", "questions": ["Are you a student or do you work?", "Why did you choose that subject/job?", "Is it a popular subject/job in your country?"]}, {"topic": "Weather", "questions": ["What is the weather like in your town?", "What is your favorite season? Why?", "Does the weather ever affect your mood?", "Do you prefer a cold or a hot climate?"]}, {"topic": "Robots", "questions": ["Are you interested in robots?", "Would you like to have a robot at home to help with chores?", "Do you think robots will replace humans in many jobs in the future?"]}]'::jsonb,
'{"topic": "An interesting historic building", "cueCard": "Describe an interesting historic building you have visited.", "points": ["Where it is located", "What it looks like", "What you did there", "And explain why you think this building is important to your country''s history"], "preparationTime": 60, "speakingTime": 120}'::jsonb,
'{"topic": "History & Heritage", "questions": ["Why is it important to preserve old buildings?", "Should the government finance the restoration of historical sites or spend money on new infrastructure?", "How can teachers make history more interesting for students?", "Do you think children should visit museums as part of their school curriculum?", "Is it possible for a country to move forward without knowing its history?"]}'::jsonb)
on conflict (id) do nothing;

-- 3. Writing Tasks
insert into public.writing_tasks (title, task1_question, task2_question) values 
('Road Safety & Transport', 
 'The chart below shows the number of travelers using three different modes of transport in a specific city between 2010 and 2020. Summarize the information and make comparisons where relevant.',
 'Some people say that the best way to improve road safety is to increase the minimum legal age for driving cars or riding motorbikes. To what extent do you agree or disagree?'),
('Education & Language',
 'The table below shows the percentage of students who learned a foreign language in several countries in 2022. Summarize the information.',
 'Many people believe that it is better to learn a foreign language in the country where it is spoken. To what extent do you agree or disagree?')
on conflict do nothing;
