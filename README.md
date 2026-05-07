# whatsmygpa

Calculates and displays your weighted GPA on the Studentweb results page (`fsweb.no/studentweb/resultater`). The GPA row appears at the top of the grades table and shows your weighted average, letter grade, number of courses, and total credits. Hover over the row to see a breakdown per course.

---

## Firefox

**Folder:** `studentweb-gpa/`

Quick steps to load this project as a temporary Firefox add-on:

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file inside the `studentweb-gpa/` folder.
4. The extension will be active until Firefox is closed.

Notes:

<<<<<<< HEAD
- Temporary add-ons are not installed permanently — you need to reload after restarting Firefox.
- If you make changes to the code, reload the add-on from the same page.

---

## Chrome

**Folder:** `studentweb-gpa-chrome/`

Quick steps to load this project as an unpacked Chrome extension:

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the `studentweb-gpa-chrome/` folder (not a single file — the whole folder).
5. The extension is now active and will persist across restarts.

Notes:

- Unlike Firefox, Chrome keeps the extension loaded after you restart the browser.
- If you make changes to the code, go back to `chrome://extensions` and click the reload icon (↺) on the extension card.
- You can disable or remove the extension at any time from `chrome://extensions`.
=======
- Temporary add-ons are not installed permanently.
- If you make changes, reload the add-on from the same page.
- Pass/Fail only classes are not yet accounted for in the total amount of credits
>>>>>>> baa43905ae0f9535f512edbd28b01a2800629c0a
