# Research to Commercialization (R2C.ai) - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

The official frontend for the R2C.ai platform, a web application designed to bridge the gap between academic research and commercial viability. This interface allows students, researchers, and industry professionals to upload, analyze, and discuss research papers.

**Live Demo:** **[https://r2c.iiitd.edu.in](https://r2c.iiitd.edu.in)**

---

## 🚀 Features

* **User Authentication:** Secure sign-up and login using email/password and Google Sign-In.
* **Document Upload & Analysis:** Upload research papers (PDFs) and receive an automated analysis, including extracted metadata and Q&A pairs.
* **Interactive Chatbot:** Engage in a conversation with an AI chatbot to ask questions about specific research papers.
* **Study Management:** Researchers can manage their uploaded studies, view their status, and edit details.
* **Search and Discovery:** Browse, search, and filter a public repository of approved research studies.

---

## 🛠️ Tech Stack

* **[React.js](https://reactjs.org/):** A JavaScript library for building user interfaces.
* **[React Router](https://reactrouter.com/):** For declarative routing in the application.
* **[Axios](https://axios-http.com/):** For making promise-based HTTP requests to the backend API.
* **CSS / UI Framework:** (e.g., Material-UI, Tailwind CSS - *you can specify which one you used*)

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### **Installation**

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/devan1shX/Research-to-Commercialization
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd [Research-to-Commercialization]
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Start the development server:**
    ```sh
    npm start
    ```
    Your application should now be running on [http://localhost:3000](http://localhost:3000).


## 📂 Project Structure

/
├── public/
│   └── index.html      # Main HTML file
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (Home, Login, Profile, etc.)
│   ├── App.js          # Main application component
│   └── index.js        # Entry point of the application
├── package.json        # Project dependencies and scripts
└── README.md           # This file

