# CORONA_BOX 🦠

CORONA_BOX is a GitHub Action that automatically updates a Gist with the latest COVID-19 statistics, either globally or for a specific country. This project uses Node.js and several APIs to gather and display real-time data in a formatted manner.

## Features

- 🌍 Supports global and country-specific COVID-19 statistics.
- 📈 Displays key statistics such as active cases, recoveries, deaths, tests, and more.
- 🕒 Automatically updates at specified intervals.
- 🎨 Easy customization of displayed data and formatting.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (LTS version recommended).
- **GitHub Personal Access Token (PAT)**: Required to update your Gist.
- **Gist ID**: The ID of the Gist you want to update with the COVID-19 statistics.

## Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/corona_box.git
   cd corona_box
   ```

2. **Install**

   ```bash
   npm install
   ```

3. Create a `.env` file

   ```bash
   GIST_ID=your_gist_id
   GH_PAT=your_github_personal_access_token
   COUNTRY=your_country_code  # Optional: Leave empty for global stats
   ```

- GIST_ID: The ID of the Gist you want to update.
- GH_PAT: Your GitHub Personal Access Token with gist scope.
- COUNTRY: (Optional) ISO 3166-1 alpha-2 country code (e.g., US for the United States). Leave blank for global statistics.
