# Personal Finance Tracker

A full-stack web application for tracking personal finances, built with the MERN stack (MongoDB, Express.js, React, Node.js) and Vite.

## Features

- User authentication (register, login, profile management)
- Track income and expenses
- Categorize transactions
- Set and track savings goals
- Visualize spending patterns with charts
- Role-based access (User and Admin)
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:

For frontend only:
```bash
npm run dev
```

For backend only:
```bash
npm run server
```

For both frontend and backend:
```bash
npm run dev:full
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Project Structure

```
personal-finance-tracker/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── Components/
│       ├── backend/
│       │   ├── server.js
│       │   ├── models/
│       │   ├── routes/
│       │   ├── middleware/
│       │   └── config/
│       └── frontend/
│           ├── Home/
│           ├── Transaction/
│           ├── Categories/
│           ├── Goals/
│           ├── Profile/
│           ├── Admin/
│           ├── Context/
│           └── ...
├── public/
├── package.json
└── ...
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### User
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- PUT `/api/users/change-password` - Change password

### Transactions
- GET `/api/transactions` - Get all transactions
- POST `/api/transactions` - Create transaction
- PUT `/api/transactions/:id` - Update transaction
- DELETE `/api/transactions/:id` - Delete transaction

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

### Goals
- GET `/api/goals` - Get all goals
- POST `/api/goals` - Create goal
- PUT `/api/goals/:id` - Update goal
- DELETE `/api/goals/:id` - Delete goal

## Technologies Used

- Frontend:
  - React
  - Vite
  - React Router
  - Tailwind CSS
  - Chart.js
  - Axios

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT
  - bcryptjs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 