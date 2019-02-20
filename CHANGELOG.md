# ChangeLog for Google Analytics - Bulk View Editor (Google Sheets Extension)

Here is a list of changes

## 20190218 - Preferences & account(s) restriction

Author: Georges Arnould, georges.arnould@iprospect.com, iProspect France

- Added a new Preferences pane
- Added a feature to limit retrieved/patched accounts
    - A comma-separated list of account ID's can be provided to filter the extension to just these accounts.
    - If a comma-separated list is provided, only these account IDs will be available for retrieval and only these accounts will have data patched to Google Analytics on submit.
    - **Note:** If no account ID's are defined in the preferences tab then there are no restrictions in place.