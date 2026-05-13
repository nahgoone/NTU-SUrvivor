# GPA Audit Calculator

NTU recently released its new and updated FGO system, I've created this project to help me manage my 'S/U' allocations accordingly

The app helps students track completed modules, calculate CGPA, monitor AU progress, manage degree requirements, and import/export module data using Excel files.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app at:

```txt
http://localhost:3000
```

## Running with Docker

This project includes Docker support so the app can run in a consistent production-like environment.

### Method 1: Build and Run Manually

Build the Docker image:

```bash
docker build -t gpa-tracker .
```

Run the container:

```bash
docker run -p 3000:3000 gpa-tracker
```

Open the app at:

```txt
http://localhost:3000
```

### Method 2: Run with Docker Compose

If `docker-compose.yml` is available, you can build and run the app with:

```bash
docker compose up --build
```

Open the app at:

```txt
http://localhost:3000
```

To stop the container:

```bash
docker compose down
```

## Features

- Track modules by code, name, AU, type, grade, and semester
- Calculate cumulative GPA on a 5.0 scale
- View total AUs completed and remaining
- Configure total degree AU requirements
- Configure required AUs by module type
- Group modules by semester
- View semester GPA and AUs earned for each semester
- Filter modules by semester, module level, and module type
- Edit module grades directly in the app
- Import module data from Excel
- Export module data and degree requirements to Excel
- Download a sample Excel template
- Persist data locally using browser `localStorage`
- Containerise and run the app using Docker
- Run CI checks using GitHub Actions

## Tech Stack

| Area                | Technology         |
| ------------------- | ------------------ |
| Framework           | Next.js App Router |
| Language            | TypeScript         |
| Styling             | Tailwind CSS v4    |
| State Management    | Zustand            |
| Data Persistence    | localStorage       |
| Excel Import/Export | xlsx               |
| Containerisation    | Docker             |
| CI/CD               | GitHub Actions     |

## How It Works

The app stores module and degree requirement data in Zustand. The Zustand store is persisted to browser `localStorage`, so the user’s data remains available even after refreshing the page.

The main data flow is:

```txt
User input / Excel import
→ Zustand store
→ Dashboard calculations
→ Module manager display
→ Excel export
```

## GPA Calculation

The app calculates CGPA using a 5.0 scale.

| Grade  | Grade Point |
| ------ | ----------: |
| A+ / A |         5.0 |
| A-     |         4.5 |
| B+     |         4.0 |
| B      |         3.5 |
| B-     |         3.0 |
| C+     |         2.5 |
| C      |         2.0 |
| D+     |         1.5 |
| D      |         1.0 |
| F      |         0.0 |

Grades such as `S/U`, `EX`, and blank grades do not count towards GPA.

## Excel Import

You can import module data using an Excel file (`.xlsx` or `.xls`).

The first row of the sheet must contain the correct column headers.

### Required Columns

| Column | Description                           | Example              |
| ------ | ------------------------------------- | -------------------- |
| Code   | Module code                           | SC2006               |
| Name   | Module name                           | Software Engineering |
| AU     | Academic Units                        | 3                    |
| Type   | Module type/category                  | Core                 |
| Grade  | Final grade or blank if not completed | A-                   |

### Optional Columns

| Column   | Description    | Example |
| -------- | -------------- | ------- |
| Semester | Semester taken | Y2S2    |

### Example Excel Format

| Code   | Name                  |  AU | Type | Grade | Semester |
| ------ | --------------------- | --: | ---- | ----- | -------- |
| SC2006 | Software Engineering  |   3 | Core | A-    | Y2S2     |
| SC1006 | Computer Architecture |   3 | Core |       | Y1S2     |
| BDE001 | Design Thinking       |   3 | BDE  | S/U   | Y2S1     |

### Import Notes

- The required columns are `Code`, `Name`, `AU`, `Type`, and `Grade`.
- `Semester` is optional.
- `AU` must be a positive number.
- A blank `Grade` means the module has not been completed yet.
- Rows with missing required fields will not be imported.
- A sample Excel template can be downloaded from the app.

## Excel Export

The exported Excel file contains:

```txt
Modules sheet
→ Code, Name, AU, Type, Grade, Semester

Requirements sheet
→ Total AU requirement and required AUs by module type
```

Modules are exported from the most recent semester to the least recent semester.

Example order:

```txt
Y4S2
Y4S1
Y3S2
Y3S1
Y2S2
Y2S1
Y1S2
Y1S1
No Semester
```

## Project Structure

```txt
app/
  components/
    dashboard/
    modules/

  constants/

  hooks/
    dashboard/
    modules/

  models/
    module/
    degree/

  stores/

  types/

  utils/
    excel/
```

### Architecture Notes

The app is organised into separate layers:

```txt
models/
→ domain rules and data shapes

stores/
→ Zustand state and localStorage persistence

components/
→ UI rendering

hooks/
→ React state and derived UI logic

utils/
→ reusable helper functions

types/
→ shared TypeScript types

constants/
→ app-level constants
```

The module and degree requirement logic are kept in `models/` because they represent the core domain data of the app.

## Future Improvements

- Add charts for GPA trends across semesters
- Add support for custom grading schemes
- Add module editing beyond grade updates
- Add automated tests
- Add deployment workflow
- Improve mobile layout for large module tables
