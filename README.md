# Node.js API with Rate Limiting and Task Queuing

## Setup

1. **unzip the project in your UBUNTU OS**
    ```
    open it in a terminal
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Start the server**
    ```bash
    npm start 
    ```
    3.1 **if you got error after running npm start press 'ctrl+c' then go to step 4, then come back**
    
4. **Run Redis  (if following command not works go to step 4.1 then come back)**
    Ensure that you have Redis running if not go to step 4.1.
    
    ```bash
    redis-server
    ```

    ```bash
     redis-cli ping  
    ```
4.1 **if redis not installed on your machine follow the steps to install redis**
     ```bash
      sudo apt update
      ```
      ```bash
      sudo apt install redis-server
     ```

## Usage

- **POST /task**
    - **Request Body:**
      ```json
      {
          "user_id": "123"
      }
      ```

    - **Response:**
      ```json
      {
          "message": "Task queued successfully"
      }
      ```

## Testing

You can use tools like Postman to send POST requests to `http://localhost:3000/task`.

## Notes

- The API enforces a rate limit of 1 task per second and 20 tasks per minute per user.
- Tasks exceeding the rate limit are queued and processed in order.
- Logs are stored in `task_log.txt`.

## Troubleshooting

Ensure Redis is running and accessible. Check the log file and console output for errors.

## License

This project is licensed under the MIT License.
