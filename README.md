# responsiveUI
##Student Finance Tracker

**Theme:** Student Finance Tracker
**Live site (GitHub Pages):** https://daniella189-hub.github.io/responsiveUI/

**Repo:** https://github.com/Daniella189-hub/responsiveUI
**Demo video(unlisted):**


## Features
  - Add, edit, delete transactions(validated with regex)
  - Live regex search with case toggle and `mark` highlighting
  - Sort by date, description, amount
  - Dashboard: total records, total spent, top category, 7-day chart, spending cap with ARIA live messages
  - Settings: cap, manual exchange rates (USD, EUR, RWF), editable categories
  - Local storage auto-save, JSON import/exporting with validation


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

  ## Run tests
  To run the main code open the  code in Vs and right click on open in file explorer which opens the location of the 'responsiveUI' folders and the files inside and then you can run it from there. 

  Start a server(`python3 -m http.sever 8000`) and open `http://localhost:8000/tests.html`

  or click on the live link in the upper head
