# Part 4d exercises

[These are the solutions for Part exercises 4.15-4.23.](https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23)


## 4.18
Implement token-based authentication according to part 4 chapter [Token authentication](https://fullstackopen.com/en/part4/token_authentication).

## 4.19
Modify adding new blogs so that it is only possible if a valid token is sent with the HTTP POST request. The user identified by the token is designated as the creator of the blog.

### 4.18 & 4.19 notes
Since 4.18 and 4.19 are closely linked, I have completed them together in the same branch.
The descriptions do not mention tests except sparingly, so much like 4c and 4d of the lesson, I am fending for myself regarding handling auth, as well as what test cases to write and how to arrange them. I am not introducing any mocking libraries or novel techniques as I expect the lesson will touch on these topics in the future.

As with normal development, fixing the tests takes 4x as long as writing the code XD. It is a bit unfair to say since there's no preexisting test infrastructure to rely on, and I likely would not have used Mongoose in this manner. The tests take about a minute and a half to run right now, totally unacceptable.

## 4.20
Refactor token extraction to middleware and place token in request

## 4.21
Blogs can only be deleted by the User who added them

## 4.22
Create middleware to find and extract the User for routes requiring authentication

## 4.23
Fix tests (I fixed tests during each exercise, so nothing to do here)

### 4.20 - 4.23
Refactored tests a little, otherwise no issues.

## 5.8
[Part 5b exercises: 5.5-5.10](https://fullstackopen.com/en/part5/props_children_and_proptypes#exercises-5-5-5-10)
The backend needed to be updated again for part 5. I got to discover that I had misunderstood some unclear sections of the lesson, where the "put" action is not actually a true put and isn't enforced and so acts as a patch. I took it down in my notes to submit corrections for to clarify the lesson intention. Fixed the backend to be more RESTful. Glad, in retrospect, that I am not submitting the exercises as I go and I had an opportunity to discover my misunderstanding.

# 5.10
Added user.id to response when logging a user in.
