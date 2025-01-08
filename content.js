function addClassIcon() {
  const articleTitle = window.location.pathname.split("/")[2];
  const api = `https://en.wikipedia.org/w/api.php?action=query&prop=pageassessments&format=json&titles=${articleTitle}&maxLag=5`;
  const imageUrls = {
    A: "//upload.wikimedia.org/wikipedia/commons/thumb/7/75/Symbol_a_class.svg/35px-Symbol_a_class.svg.png",
    B: "//upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Symbol_b_class.svg/35px-Symbol_b_class.svg.png",
    C: "//upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Symbol_c_class.svg/35px-Symbol_c_class.svg.png",
    Start:
      "//upload.wikimedia.org/wikipedia/en/thumb/a/a4/Symbol_start_class.svg/35px-Symbol_start_class.svg.png",
    Stub: "//upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Symbol_stub_class.svg/35px-Symbol_stub_class.svg.png",
    List: "//upload.wikimedia.org/wikipedia/en/thumb/d/db/Symbol_list_class.svg/35px-Symbol_list_class.svg.png",
  };

  fetch(api, {
    headers: new Headers({
      "Api-User-Agent": "WikipediaAddClassIcon/1.0",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const pageId = Object.keys(data.query.pages)[0];
      const assessment = data.query.pages[pageId].pageassessments;
      const grade = assessment && Object.values(assessment)[0]?.class;

      if (grade && !["FA", "GA", "FL"].includes(grade) && imageUrls[grade]) {
        const imageUrl = imageUrls[grade];

        const img = document.createElement("img");

        img.src = imageUrl;
        img.width = 19;
        img.height = 20;
        img.alt = `This is a ${grade}-class article.`;
        img.title = img.alt;

        const indicatorsDiv = document.querySelector(".mw-indicators");
        if (indicatorsDiv) {
          indicatorsDiv.insertBefore(img, indicatorsDiv.firstChild);
        }
      }
    });
}

addClassIcon();
