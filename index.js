import dotenv from "dotenv";
import axios from "axios";
import table from "text-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import emoji from "node-emoji";
import { Octokit } from "@octokit/rest";

// Load environment variables from .env file
dotenv.config();

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const gutter = (rows) =>
  rows.map((row) => {
    row[1] = " ".repeat(5) + row[1];
    return row;
  });

(async () => {
  const { GIST_ID, GH_PAT, COUNTRY } = process.env;

  try {
    // Fetch COVID-19 stats
    console.log(`Getting COVID stats for ${COUNTRY || "Global"}`);
    const apiUrl = COUNTRY
      ? `https://disease.sh/v3/covid-19/countries/${COUNTRY}`
      : "https://disease.sh/v3/covid-19/all";
    const response = await axios.get(apiUrl);
    const data = response.data;
    console.log(
      `Successfully fetched ${data.country || "Global"} data from the API.`
    );

    // Prepare content for Gist
    const content = table(
      gutter([
        [
          data.country
            ? `${emoji.get(`flag-${data.countryInfo.iso2.toLowerCase()}`)} ${
                data.country
              }`
            : "🌍 Global",
          dayjs(data.updated).fromNow(),
        ],
        ["🤒 Active:", `${data.active.toLocaleString()}`],
        ["😌 Recovered:", `${data.recovered.toLocaleString()}`],
        ["💀 Deaths:", `${data.deaths.toLocaleString()}`],
        ["💉 Tests:", `${data.tests.toLocaleString()}`],
      ]),
      { align: ["l", "r"] }
    );

    // Update Gist
    const octokit = new Octokit({ auth: GH_PAT });
    await octokit.gists.update({
      gist_id: GIST_ID,
      files: {
        "COVID-19 Stats.md": {
          content: content,
        },
      },
    });

    console.log(`Successfully updated Gist ${GIST_ID}!`);
  } catch (error) {
    console.error(`Failed to update Gist: ${error.message}`);
    process.exit(1);
  }
})();
