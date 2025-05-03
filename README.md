# MongoDB CRUD Tutorial Application

This is an educational application that demonstrates MongoDB CRUD (Create, Read, Update, Delete) operations with practical examples. The application provides a user-friendly interface to learn and practice MongoDB operations.

##Deployed link -[ mongodb-crud.netlify.app ]

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the source code
2. Install dependencies:
   ```bash
   npm install
   ```

## Setup MongoDB

1. Make sure MongoDB is installed and running on your system
2. The application will connect to MongoDB at `mongodb://localhost:27017/crud_tutorial`

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Features

- **Create (POST)**: Add new student records to the database
- **Read (GET)**: View all students or specific student details
- **Update (PUT)**: Modify existing student records
- **Delete (DELETE)**: Remove student records from the database

## Learning Resources

The application includes detailed explanations of each CRUD operation with code examples. Use the interface to:

1. Create new student records
2. View all students in the database
3. Update student information
4. Delete student records
5. Learn about MongoDB operations through the explanatory section

## API Endpoints

- `POST /api/students` - Create a new student
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the MIT License. 
