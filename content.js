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
    FA: "//upload.wikimedia.org/wikipedia/commons/c/cf/Cscr-featured.png",
    GA: "//upload.wikimedia.org/wikipedia/en/9/94/Symbol_support_vote.svg",
    FL: "//upload.wikimedia.org/wikipedia/commons/c/cf/Cscr-featured.png",
    A: "//upload.wikimedia.org/wikipedia/commons/thumb/7/75/Symbol_a_class.svg/35px-Symbol_a_class.svg.png",
    B: "//upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Symbol_b_class.svg/35px-Symbol_b_class.svg.png",
    C: "//upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Symbol_c_class.svg/35px-Symbol_c_class.svg.png",
    Start:
      "//upload.wikimedia.org/wikipedia/en/thumb/a/a4/Symbol_start_class.svg/35px-Symbol_start_class.svg.png",
    Stub: "//upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Symbol_stub_class.svg/35px-Symbol_stub_class.svg.png",
    List: "//upload.wikimedia.org/wikipedia/en/thumb/d/db/Symbol_list_class.svg/35px-Symbol_list_class.svg.png",
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
      const isMobile = window.location.host.includes("m.wikipedia.org");

      if (
        isMobile ||
        (grade && !["FA", "GA", "FL"].includes(grade) && imageUrls[grade])
      ) {
        const imageUrl = imageUrls[grade];

        const img = document.createElement("img");

        img.src = imageUrl;
        img.width = 19;
        img.height = 20;
        img.alt = `This is a ${grade}-class article. Click here for more information.`;
        img.title = img.alt;
        img.style.marginLeft = "5px";
        img.style.verticalAlign = "middle";

        if (isMobile) {
          const firstHeading = document.querySelector("#firstHeading");
          if (firstHeading) {
            const iconContainer = document.createElement("span");

            iconContainer.style.display = "inline-block";
            iconContainer.style.verticalAlign = "middle";

            iconContainer.appendChild(img);
            firstHeading.appendChild(iconContainer);
          }
        } else {
          const indicatorsDiv = document.querySelector(".mw-indicators");

          if (indicatorsDiv) {
            indicatorsDiv.insertBefore(img, indicatorsDiv.firstChild);
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching assessment data:", error);
    });
}

addClassIcon();
