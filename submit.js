const fs = require("fs");
const d3 = require("d3");
const snoowrap = require("snoowrap");

const config = require("./config");

const reddit = new snoowrap(config);

const week = 44;

const data = d3.csvParse(
  fs.readFileSync(`./output/week/2017-${week}.csv`, "utf-8")
);

data.forEach((d, i) => {
  d.rank = i + 1;
  d.views = d3.format(",")(d.views);
  d.score = d3.format(",")(d.score);
  d.num_comments = d3.format(",")(d.num_comments);
});
function submit() {
  const timestamp = d3.timeFormat("%m-%d-%Y %I:%M %p")(new Date());
  const title = "ICYMI: top 30 most viewed plays + moments on r/nba (week 3)";
  const intro = `##${title}\n\n`;
  const head = "Rank | Post | Video | Views | Upvotes | Comments \n";
  const def = "---: | --- | --- | ---: | ---: | ---:\n";
  const body = data
    .map(d => {
      return `${d.rank} | [${d.title}](https://www.reddit.com/r/nba/comments/${d.id}) | [watch](${d.url}) | ${d.views} | ${d.score} | ${d.num_comments}\n`;
    })
    .join("");
  const outro = `
	\n\n[Week 3](https://www.reddit.com/r/nba/comments/7b65kf/icymi_top_30_most_viewed_plays_moments_on_rnba/)
	\n[Week 2](https://www.reddit.com/r/nba/comments/79pfj8/top_30_most_viewed_plays_and_moments_on_rnba_week/)
	\n[Week 1](https://www.reddit.com/r/nba/comments/787z5h/week_1_recap_top_30_most_viewed_plays_and_moments/)
	\n\n*This post was auto-generated by looking at all r/nba links from streamable/gfycat in the past week, sorted by views. Figures are a snapshot as of ${timestamp}.*
	`;

  const text = `${intro}${head}${def}${body}${outro}`.trim();
  // console.log(text);
  reddit
    .getSubreddit("snoowrap")
    .submitSelfpost({ title, text })
    .then(console.log)
    .catch(console.error);
}

submit();
