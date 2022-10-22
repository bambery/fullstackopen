# Part 5a: Login in frontend

This repo is for the [exercises 5.1 - 5.4 of Part 5a](https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4) of [Full Stack Open's React tutorial](https://fullstackopen.com). The base repository for this section was cloned from https://github.com/fullstack-hy2020/bloglist-frontend.

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
