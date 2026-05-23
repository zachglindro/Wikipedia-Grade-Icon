function addClassIcon() {
  const articleTitle = decodeURIComponent(
    window.location.pathname.split("/")[2] || ""
  );

  const apiUrl = new URL("https://en.wikipedia.org/w/api.php");
  apiUrl.searchParams.append("action", "query");
  apiUrl.searchParams.append("prop", "pageassessments");
  apiUrl.searchParams.append("format", "json");
  apiUrl.searchParams.append("titles", articleTitle);
  apiUrl.searchParams.append("maxLag", "5");
  apiUrl.searchParams.append("origin", "*");

  const imageUrls = {
    FA: "//upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Featured_article_star.svg/250px-Featured_article_star.svg.png",
    FL: "//upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Featured_article_star.svg/250px-Featured_article_star.svg.png",
    GA: "https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/250px-Symbol_support_vote.svg.png",
    A: "//upload.wikimedia.org/wikipedia/commons/thumb/2/25/Symbol_a_class.svg/250px-Symbol_a_class.svg.png",
    B: "//upload.wikimedia.org/wikipedia/en/thumb/5/5f/Symbol_b_class.svg/250px-Symbol_b_class.svg.png",
    C: "//upload.wikimedia.org/wikipedia/en/thumb/e/e6/Symbol_c_class.svg/250px-Symbol_c_class.svg.png",
    Start: "//upload.wikimedia.org/wikipedia/en/thumb/a/a4/Symbol_start_class.svg/250px-Symbol_start_class.svg.png",
    Stub: "//upload.wikimedia.org/wikipedia/en/thumb/f/f5/Symbol_stub_class.svg/250px-Symbol_stub_class.svg.png",
    List: "//upload.wikimedia.org/wikipedia/en/thumb/d/db/Symbol_list_class.svg/250px-Symbol_list_class.svg.png",
  };

  fetch(apiUrl, {
    headers: new Headers({
      "Api-User-Agent": "WikipediaAddClassIcon/1.0",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const pageId = Object.keys(data.query.pages)[0];
      const assessment = data.query.pages[pageId].pageassessments;
      const grade = assessment && Object.values(assessment)[0]?.class;

      const talkPageUrl = `${
        window.location.origin
      }/wiki/Talk:${encodeURIComponent(articleTitle)}`;

      if (grade && !["FA", "GA", "FL"].includes(grade) && imageUrls[grade]) {
        const imageUrl = imageUrls[grade];

        const img = document.createElement("img");
        img.src = imageUrl;
        img.width = 19;
        img.height = 20;
        img.alt = `This is a ${grade}-class article. Click here for more information.`;
        img.title = img.alt;
        img.style.marginLeft = "5px";
        img.style.verticalAlign = "middle";

        const link = document.createElement("a");
        link.href = talkPageUrl;
        link.appendChild(img);

        const indicatorsDiv = document.querySelector(".mw-indicators");
        if (indicatorsDiv) {
          indicatorsDiv.insertBefore(link, indicatorsDiv.firstChild);
          return;
        }

        const firstHeading = document.querySelector("#firstHeading");
        if (firstHeading) {
          const iconContainer = document.createElement("span");
          iconContainer.style.display = "inline-block";
          iconContainer.style.verticalAlign = "middle";
          iconContainer.appendChild(link);
          firstHeading.appendChild(iconContainer);
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching assessment data:", error);
    });
}

addClassIcon();
