
# RizonTec - Car Dealership Application

This is a React application for car dealership management built with Vite, React, and Supabase.

## Setup Instructions

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the example environment file:
   ```
   cp .env.example .env
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Supabase Setup

This application can work with local storage only, but for full functionality including real-time updates and multi-device synchronization, you need to set up Supabase:

1. Create a Supabase account and project at [https://supabase.com](https://supabase.com)
2. Get your Supabase URL and anon key from the project settings
3. Add them to your `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Execute the SQL in `src/supabase/schema.sql` in the Supabase SQL editor to create the necessary tables and functions
5. Restart your application

### Required Supabase Resources

The application requires:

1. Two tables: `cars` and `transactions`
2. Two RPC functions:
   - `create_cars_table_if_not_exists()`
   - `create_transactions_table_if_not_exists()`

These resources will be created automatically when you run the SQL script provided in `src/supabase/schema.sql`.

## Features

- Car inventory management
- Sales and exchanges tracking
- Financial reporting
- Image uploads (up to 10 images per car)
- Real-time updates with Supabase
