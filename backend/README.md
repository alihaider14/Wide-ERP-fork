# wide-erp-pos

This is a Node.js application built using Express, TypeScript, MongoDB, and Mongoose.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/)
-   [MongoDB](https://www.mongodb.com/)
-   npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Wide-Dimension/wide-erp-pos.git
    cd wide-erp-pos
    ```
2. Install dependencies:

    ```sh
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the root directory and configure the following environment variables:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_url
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_refresh_jwt_secret
    ENCRYPTION_KEY=your_minimum_32_byte_encryption_key
    ```

### Running the Application

#### Development Mode

```sh
npm run dev
# or
yarn dev
```

#### Production Mode

```sh
npm run build
npm start
# or
yarn build
yarn start
```

## 🛠 API Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | `/auth/signup`     | Register a new user |
| POST   | `/auth/login`      | Authenticate user   |
| POST   | `/products/add`    | Add new product     |
| PUT    | `/products/update` | Update product      |

