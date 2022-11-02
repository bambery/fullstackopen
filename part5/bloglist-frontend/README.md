# Part 5a: Login in frontend

Completed [exercises 5.1 - 5.4 of Part 5a](https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4) of [Full Stack Open's React tutorial](https://fullstackopen.com). The base repository for this section was cloned from https://github.com/fullstack-hy2020/bloglist-frontend.

## 5.1
clone base repo and implement functionality to log a user in.

## 5.2
Frontend should remember logged in users and allow them to log out.

## 5.3
Added login message (missed from 5.2). Allow logged in users to add new blogs. This is the first time I am unsure if I have chosen to do things in a "React" way with the Login and BlogForm components, where I am placing state related to the inputs of the components. After reading arguments on the internet, I am still unsure XD

## 5.4
Implement error/info notifications for user actions.

# Part 5b: Showing and hiding stuff
[Part b exercises: 5.5-5.10](https://fullstackopen.com/en/part5/props_children_and_proptypes#exercises-5-5-5-10)

Turns out I made good choices and have mostly or entirely already done the second set of exercises. Attempting to perform actions with an expired token will now log the user out. The tutorial doesn't handle it, but my tokens were expiring often enough that I needed it to be handled in some way.

I also want to give a shoutout to javascript for not reserving the word "type". There's really no perfect substitute for "type".

## 5.5
Implement show/hide functionality for the new blogs form. Form is hidden by default and logged in users can click a button to show it. The form will hide after submission.

## 5.6
Separate form for creating a new blog into a separate component (already done, likely in 5.3).

## 5.7
Show/hide blog details with a button.

## 5.8
Implement "like" button functionality for each post, so that a logged in user may "like" a blog and thereby increase its "like count". This part took extra work since I needed to reimplement the PUT on the backend to be more RESTful. Made a workitem for myself to suggest some minor changes to the earlier chapters to clarify implementing update actions in the API.

## 5.9
Display Blog posts by number of likes.

## 5.10
Allow users to delete the Blog posts they have created.

## 5.11
Define PropTypes for one component in application (I did several)

## 5.12
Add ESlint to the project and correct errors.

# Part 5c: front end testing
[Part c exercises: 5.13-5.16](https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16)

## 5.13
add test to check that Blogs are by default displayed with title and author displayed, and the other content hidden.

## 5.14
Make a test which checks that the blog's url and number of likes are shown when the button controlling the shown details has been clicked.

## 5.15
Make a test which ensures that if the like button is clicked twice, the event handler the component received as props is called twice.

## 5.16
Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.
** This test alone takes over 300s to run, due to using userEvent to fill in 3 fields with `userEvent.type()` and clicking one button to submit the form. userEvent.type() is a well known problem maker: https://github.com/testing-library/user-event/discussions/977?sort=top
There is apparently no way/interest to improve the incredible amount of time it takes to run tests, which seems to make this library completely useless. It took an incredible amount of time to try and debug minor issues with this test since it took FIVE MINUTES each run of the test, even failing runs. Unmanageable.

# Part 5d: End to end testing

## 5.17
Install cypress, add a /testing endpoint for the backend, and add a test for checking the login form appears for logged out users.

## 5.18
Add tests for successful and insuccessful logins.

## 5.19
Add test for logged in user creating a new Blog.
