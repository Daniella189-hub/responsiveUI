# responsiveUI
##Student Finance Tracker

**Theme:** Student Finance Tracker
**Live site (GitHub Pages):** https://daniella189-hub.github.io/responsiveUI/

**Repo:** https://github.com/Daniella189-hub/responsiveUI
**Demo video(unlisted):**
**Description:** A responive, accessible, and interactive web application for managing student expenses and building better financial habits

## About the Project
the Student finance Tracker is a web-based application designed to help students record, organize and monitor theri everyday spendning in one place

user can manage transactions, search and sort financial records, monito spending patterns through a dashboard, and set spending limits. The apllication also includes data import and export functionality, customizabe categories, and manual currency exchange rates.
The project emphasizes responsive design, inpit validation, accessibiblity and client-side data persistance, making it a practical tool for everyday student budgeting. 



## Features
   ### Transaction Management
    - Add, edit, and delete financial transactions.
    - Validate transaction inputs using regular expressions.
    - Organize expenses by description, date, amount, and category.
  ### Search and sorting
    - Search transactions using regular-expression patterns.
    - Toggle cas-sensitive search
    -Highlight matching text in search results.
    -Sort transactions by date, description, or amount
  ### Fincanical Dashboard
    - View the total number of transaction recoreds.
    - Tracks total spending
    -Identify financial records from JSON files.
    -Export data to JSON for backup or reuse
    - Valideta imported data before accepting it
  ### Accessibility and responsive Design
    - Semantic HTML landmarks and labelled form controls
    - Keyboard navigation with visible focus indicators.
    - A skip-to-main-content lin
    - Accessible status messages using ARIA live regions.
    - Support for reduced-motion preferences.
    - Responsive layouts for different screen sizes
  ### Technologies Used
    - HTML: application for sstructuring the webpage
    - CSS: styling and responsive layouts
    - JavaScript: transaction management, validation, search, sortung, dashboard calculations, and local storage
    - Regular Expression(REGEX): input validation and advanced searching.
    - JSON: importing adn exporting financial records
    -Browse Local Storage : Saving application data locally.
  ### Getting started
    You will need:
     - A modern web browser
     - Git installe on your computer
     - Acode editor, such a s VIsual Code(VS)
    
  #### Installation
    1. Clone the repository
       `git clone https://github.com/Daniella189-hub/responsiveUI.git`
    
    2. Navigate to the project directory
      `cd responsiveUI`

    3. Start a local development server
     Using Python:
      ` python3 =-m http.server 8000` or access it on my live demo in the upper head of this README
    
    4. Open the application
    Visit:
    `http://localhost:8000`

    To run the application without a local server, you can also visit the live demo.

  ### Running the Tests 

    the repository includes a tests.html file for running the project's test.
    With the local server running, open:
     `http://localhost;8000/tests.html`

     Review the test results to check the functionality covered byt th eprojects's test suite.

  ### Data and Privacy
      the application uses browser local storage to persist data on the users's device. JSON import and export provide additional ways to transfer or back up records.

      Exchange rates are entered manually rather than retrieved from a live finacnial data service.

      <b>Important</b>:Local Storgae is specific to the browser and website orignin. Clearing browser data may remove saved records. Export important data regularly and avoid entering sensitivr banking credentials or confidential financials information



  ## Regex catalog
  |purpose | Pattern | Example |
  |---|---|---|
  |description | `^\S(?:.*\S)?$` | "Lunch" is ok but " Lunch" is rejected(no space) |
  | Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | 12.50 ok, but 012 is rejected |
  | Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | "Fast-food" ok |
  |advanced: duplicate word (back-reference) | `b(\w+)\s+\1\b` |"tea tea rejected |
  | Date | `^\d{4}-(0[1-9]\|1[--2])-(0[1-9]\|[12]\d\|3[01]$` | 2025-09-29 ok |
  | Search examples | `\.d{2}\b`, `(coffee\|tea)` |cents present |
  | email | `^[A-Za-z0-9._%+-]+@alustudent\.com$/i,` | daniella@alustudent.com
  | githubUser | `^[A-Za-z0-9](?:[A-Za-z0-9]-(?=[A-Za-z0-9])){0,38}$` |
  | githubUrl | `^https:\/\/github\.com\/[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}(?:\/[\w._]+)?\/?$` |  

  ## Keyboard map 
  -`Tab` / `Shift+Tab`: move between controls; first stop is "Skip to main content"
  - `Enter` / `Space`:activate buttons and links
  - `Enter` in a form: submit
  - `ArrowDown`, `ArrowRight`,`Arrowleft`, `ArrowUp` in the form: help to hover into the different options available fo ra multiple choice

  ## Accessibility notes
  Semantic landmarks, labelled inputs, visible focus ring, skip link, `role="status"` and `aria-live` announcements, contrast of at least 4. 5:1, reduced-motion support.

  ## Project Objectives
  This project demonstrates the pratical appliction of fronted-end development concepts, including:
    -Building an interactive web applicaiton
    - creating responsive user interfaces
    - Validating user input with regular expressions.
    - manipulationand organizing data using Javascript
    - Persisting data in the browser
    - implement in search, sorting and data visualizatio.
    - applying accessiblity principles to interactive componets
    - Supporting JSON-based data exchange.
  ### Improvements 
    - Monthly budgtes and expense summaries
    - More detailed financial charts and spending comparisonss
    - Automatice recurring-transaction tracking
    - USAGE OF AN AI-TOOL(CODEPAUSE) THAT WORKS PROPERLY AND DON'T THROW MISTAKES BECAUSE OF ASSUMPTION BASED ON UNCHECKED FEATURES

  ### AUTHOR
    Daniella189-hub
    guthub: @Daniella189-hub
    

