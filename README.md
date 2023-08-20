# myTodos

Learning node, express and mongo with creating Todos APIs

# v1

Added:

1. Created Todos App using node, express, REST Api and CRUD operations in MongoDB
2. Created REST APIs for Todo Schema
3. User signup
4. User login
5. Login works via JWT token

# v2

Added :

1. Integrated Slack notification - when new Todo is added user will get notified on slack
2. Todos data is now separated per user.
3. Added more API validations

# v3

Added:

1. Rate limiter backed by Redis (10 req/min for todos APIs and 5 req/min for login/signup/user APIs)
2. Batch API for inserting task
