const ax = require('axios');
const cheerio = require('cheerio');

const fundamental = async ticker => {
  try {
    const finbiz = await ax.get(`https://finviz.com/quote.ashx?t=${ticker}`);
    const finbiz_res = finbiz.data;
    const $ = cheerio.load(finbiz_res);
    const keysTables = [];
    const valuesTables = [];
    const data = {};
  
    $('.snapshot-td2-cp').each(function(i, elem) {
      keysTables.push($(this).text());
    });
  
    $('.snapshot-td2').each((i, elem) => {
      if (elem.children[0].children[0].data) {
        valuesTables.push(elem.children[0].children[0].data);
      } else {
        valuesTables.push(elem.children[0].children[0].children[0].data);
      }
    });
  
    keysTables.map((key, index) => {
      data[key] = valuesTables[index];
    });
  
    const result = {
      statusCode: 200,
      body: JSON.stringify({
        data,
      })
    };

    console.log(result);
    return result;

  } catch(e) {
    return {
      statusCode: 500,
      body: {
        status: e.response.status,
        data: e.response.statusText,
      },
      error: e,
    }
  }


}

fundamental('NKE.MEX')
