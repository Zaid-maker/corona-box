import "dotenv/config";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import table from "text-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import emoji from "node-emoji";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const gutter = (rows) =>
  rows.map((row) => {
    row[0] = row[0].padEnd(20, " "); // Adjust padding for alignment
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

    // Prepare the rows for the table
    let rows = [
      [
        `${
          data.country
            ? `${emoji.get(`flag-${data.countryInfo.iso2.toLowerCase()}`)} ${
                data.country
              }`
            : "🌍 Global"
        }`,
        dayjs(data.updated).fromNow(),
      ],
      ["🤒 Active:", `${data.active.toLocaleString()}`],
      ["😌 Recovered:", `${data.recovered.toLocaleString()}`],
      ["💀 Deaths:", `${data.deaths.toLocaleString()}`],
      ["💉 Tests:", `${data.tests.toLocaleString()}`],
      ["📈 Today's Cases:", `${data.todayCases.toLocaleString()}`],
      ["📉 Today's Deaths:", `${data.todayDeaths.toLocaleString()}`],
      ["🔄 Today's Recovered:", `${data.todayRecovered.toLocaleString()}`],
      ["⚠️ Critical Cases:", `${data.critical.toLocaleString()}`],
      ["📊 Cases Per Million:", `${data.casesPerOneMillion.toLocaleString()}`],
      [
        "📊 Deaths Per Million:",
        `${data.deathsPerOneMillion.toLocaleString()}`,
      ],
      ["👥 Population:", `${data.population.toLocaleString()}`],
    ];

    // Optional: Sort rows by a specific column (e.g., by label name alphabetically)
    // rows.sort((a, b) => a[0].localeCompare(b[0]));

    // Format the content using text-table with alignment
    const content = table(gutter(rows), { align: ["l", "r"] });

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
