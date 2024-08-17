require("dotenv").config();
import { Octokit } from "@octokit/rest";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import emoji from "node-emoji";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

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

    // Manually format content for Gist
    const content = [
      `${
        data.country
          ? `${emoji.get(`flag-${data.countryInfo.iso2.toLowerCase()}`)} ${
              data.country
            }`
          : "🌍 Global"
      } ${dayjs(data.updated).fromNow()}`,
      `🤒 Active: ${data.active.toLocaleString()}`,
      `😌 Recovered: ${data.recovered.toLocaleString()}`,
      `💀 Deaths: ${data.deaths.toLocaleString()}`,
      `💉 Tests: ${data.tests.toLocaleString()}`,
    ].join("\n");

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
