# YelpChamp: A Comprehensive Campground Review Platform

## About
YelpChamp is a web application for campers to share and discover camping locations.

## Features

1. **Campground Exploration**: 
   - Browse campgrounds with images and reviews.
2. **Content Creation**:
   - Registered users can add new campgrounds with images and location specifics.
3. **Reviews**:
   - Detailed feedback on campgrounds by users.
4. **User Authentication**:
   - Registration and login functionalities. Users can modify only their own content.
5. **Data Security**:
   - Data sanitization and input validation ensure platform security.


## Tech Stack

- **Backend**: 
  - Node.js and Express.js for route handling and server setup.
- **Database**: 
  - MongoDB for NoSQL storage; Mongoose for object modeling.
- **Authentication**: 
  - Passport.js for user authentication and session management.
- **Frontend**: 
  - EJS for dynamic content rendering. Design and layout achieved with Bootstrap.
- **Storage & Media**: 
  - Cloudinary for image upload and storage.
- **Location Services**: 
  - Mapbox SDK for geocoordinate fetching.
- **Middleware & Utilities**: 
  - Connect-flash for flash messages, helmet for security, Joi for input validation, multer for image uploads, and other utilities.

## Deployment
- **Website Hosting**: The application is hosted on [Render](https://render.com/).
- **Database**: YelpChamp uses MongoDB as its primary database, which is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

https://yelp-camp-jlsn.onrender.com/ It might take awhile to load since i'm using a free plan for render and when servers inactive it "spins down"


