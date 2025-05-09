# Employee Shift Tracker Web Application

A full-stack web application that allows employees to log their working hours, track break times, and record geolocation-based check-ins and check-outs. Includes a powerful admin panel to monitor all shift data.

# Tech Stack

- **Frontend**: React.js(Typescript), Axios,  React Router, Context API 
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB + Mongoose

---

## Features

## Employee Functionality
- Login & Registration
- Start, Pause, Resume, End shift with timestamps
- Real-time geolocation tracking 
- Daily total hours (excluding break time)
- Shift history overview
- Map preview of each location
- Responsive dashboard (mobile + desktop)
- Dark mode toggle


## Admin Panel
- View all employees’ shift logs
- Export shift data as CSV 
- Admin role assigned manually in DB

---

## Manual Admin Role Setup

To assign admin role manually:

1. Open your MongoDB database (Compass or Atlas).
2. Locate the user document under the `users` collection.
3. Set the `role` field to `"admin"`:

```json
{
  "_id": "...",
  "name": "Admin",
  "email": "admin@example.com",
  "role": "admin"
}
