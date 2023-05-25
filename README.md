![logo](showcase/gastromia_logo.png)

This repository is part of a wider online ordering and kitchen management system that powers the day-to-day operations of Gastromia – a food-tech startup that operates in the realm of ghost kitchens and virtual food brands.

The core components that make up the system are:
- [web-gastromia](https://github.com/fredgrd/web-gastromia/) – Customer-facing mobile web-app
- [hub-gastromia](https://github.com/fredgrd/hub-gastromia/) – Internal dashboard (live orders, item editing, statistics)
- [api-gastromia](https://github.com/fredgrd/api-gastromia/) – Backend powering both web apps and connected services.

## What is api-gastromia?

The backend for both [web-gastromia](https://github.com/fredgrd/web-gastromia/) and [hub-gastromia](https://github.com/fredgrd/hub-gastromia/). Makes use of Express for client-to-server communication. The app integrates with a range of services to provide a smooth user experience to our customers, such as:

- Facebook's Business Platform for Whatsapp driven order status notifications
- Stripe's secure card payment service.
- Twilio's Verify SMS OTP.
- AWS
- MongoDB Atlas

## Tech Stack

Backend:

- Node.js
- Express
- AWS
- Mongoose
- Twilio Verify
- Stripe

Frontend:

- React
- React Router
- React Stripe (iframes for custom payment input)

Services:

- AWS S3 + CloudFront (Storage and delivery of media assets)
- Twilio Verify (OTP Authentication)
- Whatsapp Business Platform (Order updates)
- MongoDB Atlas (DB)