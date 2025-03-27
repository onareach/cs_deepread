# DeepRead

The purpose of this application is to use artificial intelligence to store and discover insights found in the writings of Mary Baker Eddy. The application is intended to be a successor to the Concord application, which supports textual search capacities, but has no semantic search functionality.

The technical architecture of the application is a three-tier application (database, back-end server, and webpage), which makes API calls from the backend to OpenAI API endpoints. The back-end is currently written in Python using Flask and hosted on Heroku (https://www.heroku.com/). The front-end is written in JavaScript using Next.js (https://nextjs.org/docs) hosted by Vercel (https://vercel.com/).

### Project Phases

#### Phase 1: Basic Application with Image Upload and AI-Powered Parsing

- [ ] **Drag & Drop / File Selection for Text Image Upload**
  - [ ] Implement upload component in Next.js
  - [ ] Allow users to drag and drop images or browse files

- [ ] **Call OpenAI API for Parsing**
  - [ ] Send an image of text to OpenAI's API (via OCR and custom rules)
  - [ ] Allow for customizable parsing rules

- [ ] **Preview Parsed Text**
  - [ ] Show parsed text in a clean, editable interface before saving

---

#### Phase 2: Database Storage and Retrieval

- [ ] **Design PostgreSQL Schema**
  - [ ] Store parsed text
  - [ ] Store page numbers, line numbers, and other metadata
  - [ ] Store marginal headings, footnotes, etc.

- [ ] **Search and Lookup**
  - [ ] Build a search API to pull full sentences containing search terms
  - [ ] Use PostgreSQL full-text search (TSVector/TSQuery) for fast lookups

---

#### Phase 3: Full-Book Navigation and Refinement

- [ ] **Scrollable Full-Book View**
  - [ ] Allow users to scroll through the entire book
  - [ ] Create safeguards for copyright protection
  - [ ] Support pagination & infinite scroll

- [ ] **Dynamic Configuration of Parsing Rules**
  - [ ] Add pages to modify parsing rules and other configurations dynamically

---

#### Phase 4: Use AI to Perform Semantic Searches

- [ ] **Deep Learning & Semantic Discovery**
  - [ ] Train an LLM on the text (perhaps using DeepSeek to maintain privacy)
  - [ ] Enable semantic searches



#### Target Phase 1 Folder and File Structure

    cs_deepread/  (found in CS_DeepRead/frontend/ folder)
    ├── public/
    │   └── uploads/                 ← stores uploaded images (browser-accessible)
    │
    ├── src/
    │   ├── app/
    │   │   ├── api/
    │   │   │    └── preview/
    │   │   │        └── route.ts     ← API route for free tree in Settings
    │   │   │    └── upload/
    │   │   │        └── route.ts     ← API route for file upload
    │   │   ├── layout.tsx           ← app-wide layout (imports Header)
    │   │   ├── page.tsx             ← homepage (default route)
    │   │   ├── search/
    │   │   │   └── page.tsx         ← /search page
    │   │   ├── settings/
    │   │   │   └── page.tsx         ← /settings page
    │   │   ├── upload/
    │   │       └── page.tsx         ← /upload page (uses ImageUpload)
    │   │
    │   ├── components/
    │   │   ├── FileTree.tsx         ← Search current program file structure
    │   │   ├── Header.tsx           ← Top nav bar with tabs, profile menu
    │   │   └── ImageUpload.tsx      ← Drag/drop UI + preview + uploads via API
    │
    ├── next-env.d.ts                ← Enables TypeScript support for Next.js
    ├── package.json                 ← Project metadata and dependencies
    ├── postcss.config.js            ← Tailwind CSS config for PostCSS
    ├── tailwind.config.js           ← Tailwind scan paths + extensions
    ├── tsconfig.json                ← TypeScript project settings


#### Notes on certain files:

**frontend/cs_deepread/next-env.d.ts**

The `frontend/cs_deepread/next-env.d.ts` file enables TypeScript support for Next.js-specific types and features. (A *type* in this context defines the structure and behavior that a variable or function is allowed to have. In simple terms, a *type* is a label with rules that tells the TypeScript compiler, "This variable/function should look or behave like this." For example, the code **let name: string = "Alice";** ensures the variable **name** only holds text.)

The `next-env.d.ts` file makes these Next.js types – like `NextPage`, `NextApiRequest`, and `NextApiResponse` – available globally, so you don’t need to import them in every file. It’s automatically referenced during compilation, allowing TypeScript to recognize and use these types throughout the app. This improves type-checking and editor features like autocomplete, suggestions, and error checking (e.g., in VS Code).

In short, `next-env.d.ts` acts as a TypeScript "bootstrapper," telling the compiler: “This is a Next.js app – load the right types so everything works.”

The reason that *types* matter in Next.js is that Next.js uses *custom types* to describe special objects and behaviors, like:

- **NextPage** : the type for a *page* component
- **NextApiRequest** : the type for the *request object* in an API route
- **NextApiResponse** : the type for the *response object*

Example:

    import { NextApiRequest, NextApiResponse } from 'next'
    
    export default function handler(req: NextApiRequest, res: NextApiResponse) {
      res.status(200).json({ message: "Hello!" });
    }





### Step 1: Set Up Project

#### 1. Create a Next.js app and Install Dependencies

On a Mac, in a terminal window, run the following commands and select the following options:

    cd ~/CS_DeepRead/frontend
    sudo chown -R $(whoami) ~/.npm
    npx create-next-app@latest cs_deepread \
      --use-npm \
      --typescript \
      --eslint \
      --tailwind \
      --src-dir \
      --app \
      --no-turbo \
      --import-alias "@/*" \
      --legacy-peer-deps


The output is:

    Creating a new Next.js app in ~/CS_DeepRead/frontend/cs_deepread.
    
    Using npm.
    
    Initializing project with template: default 



#### 2. Install the Core Packages

If you're starting from fresh, run the following commands to install all of the runtime packages and development dependencies:

    npm install next react react-dom tailwindcss postcss autoprefixer lucide-react react-dropzone
    npm install --save-dev typescript @types/react @types/react-dom @types/node @radix-ui/react-tooltip

If you ever need to re-install from scratch:

    rm -rf node_modules package-lock.json
    npm install



Here is a list of the core packages that need to be installed, along with a brief description of their purpose:

| Package          | Purpose                                 |
| ---------------- | --------------------------------------- |
| `next`           | The Next.js framework (App Router)      |
| `react`          | Core React library                      |
| `react-dom`      | React DOM rendering                     |
| `typescript`     | TypeScript support                      |
| `tailwindcss`    | Tailwind CSS framework                  |
| `postcss`        | PostCSS processor (used by Tailwind)    |
| `autoprefixer`   | Adds vendor prefixes (used by Tailwind) |
| `lucide-react`   | Icon set (used for Bell, User, etc.)    |
| `react-dropzone` | Drag-and-drop file upload               |

   

#### 3. Install devDependencies (set by `tailwindcss init -p`)

| Dev Package               | Purpose                                |
| ------------------------- | -------------------------------------- |
| `@radix-ui/react-tooptip` | Enable pop-up previews on hyperlinks   |
| `@types/react`            | Type definitions for React             |
| `@types/react-dom`        | Type definitions for ReactDOM          |
| `@types/node`             | Node.js types (for backend API routes) |



#### 4.  Check Your `package.json`

The installed Packages and devDependencies should match what is found in `package.json`. You should see something like:

```
"dependencies": {
  "next": "15.x",
  "react": "18.x",
  "react-dom": "18.x",
  "tailwindcss": "^3.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x",
  "lucide-react": "^0.x",
  "react-dropzone": "^14.x"
},
"devDependencies": {
  "typescript": "^5.x",
  "@types/react": "^18.x",
  "@types/react-dom": "^18.x",
  "@types/node": "^18.x"
}
```



### Appendix

#### Technologies Used

**Heroku** (https://www.heroku.com/). 

**Vercel** (https://vercel.com/).

**Node.js** is a JavaScript runtime environment that allows you to run JavaScript code outside the browser. It is used to build backend servers, run scripts, and execute JavaScript on the server side. It is required to run Next.js because Next.js uses Node.js to handle server-side rendering (SSR), API routes, and builds. Node.js runs the Next.js development server. You can think of Node.js as the engine that powers JavaScript outside the browser.

**Next.js** (https://nextjs.org/docs) is a *React* framework for building full-stack applications. Next.js is built on top of React and provides features like server-side rendering (SSR), static site generation (SSG), and API routes. You can think of Next.js as a framework that makes React more powerful, using Node.js to enable server-side functionality. If you're only using Next.js for front-end development, you don't need extensive Node.js knowledge. But if you're using API routes, server-side rendering, or custom backend logic, knowing Node.js is likely essential.

**Node Package Manager** (npm) plays the same role for JavaScript that pip (Preferred Installer Program) plays for Python. It is used to install, manage, and update JavaScript libraries (called packages or modules) for both backend and frontend development. It comes automatically installed when you install Node.js. A tool called `npx` comes with `npm` and allows you to run a package without installing it globally. For example, the command used below  `npx create-next-app` fetches and runs the Next.js setup script without installing it globally.

**React** (https://react.dev/) is a JavaScript library for building user interfaces (UIs), primarily for single-page applications (SPAs). It was developed by Facebook (now Meta) and is open-source. It enables fast, interactive, and reusable UI components. React is commonly used for building dynamic web apps, creating reusable UI components, and making frontend development more structured and scalable.

The reasons for using React:

- React is **Component-Based**. UIs are built from independent, reusable components.
- **Fast Updates with Virtual DOM** (document object model). React efficiently updates only the necessary parts of the page.
- **Declarative Syntax**. Instead of manually manipulating DOM, you describe how the UI should look, and React updates it.
- **Great for Large-Scale Applications**. Used by companies like Netflix, Facebook, and Uber.
- **Huge Ecosystem**. Works well with Next.js, React Native (for mobile apps), and many UI libraries.



**DOM (Document Object Model)** is a programming interface that represents a web page as a tree-like structure. It allows JavaScript to dynamically update, add, and remove elements on a webpage. In the DOM tree, every HTML element is a node. 

To give an example of how the DOM represents an HTML page, consider the following HTML code:

    html
    
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Page</title>
      </head>
      <body>
        <h1>Hello, World!</h1>
        <p>This is a paragraph.</p>
      </body>
    </html>


The DOM representation (tree structure) is as follows:

    Document
     ├── <html>
     │    ├── <head>
     │    │    ├── <title>My Page</title>
     │    ├── <body>
     │         ├── <h1>Hello, World!</h1>
     │         ├── <p>This is a paragraph.</p>


Every element (&lt;html&gt;, &lt;head&gt;, &lt;body&gt;, &lt;h1&gt;, etc.) is a node in this tree.

JavaScript can access and modify the DOM using the  `document` object. Here's an example of changing text:

 

    js
    
    document.querySelector("h1").textContent = "Hello, React!";

This changes the content of a heading (&lt;h1&gt; Hello, World&lt;/h1&gt; ) to a new value of (&lt;h1&gt; Hello, React&lt;/h1&gt;).

