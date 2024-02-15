const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https'); // Import the 'https' module

class DataHtmlParser {
    constructor() {
        this.urlISOCodes = "https://www.cba.am/am/SitePages/ExchangeArchive.aspx";
        this.isoCodes = [];
        this.isoCodesClear = [];
        this.implodedIsoCodes = "";
        this.isoCodesCountries = [];
        this.arrContextOptions = {
            ssl: {
                verify_peer: false,
                verify_peer_name: false
            }
        };
    }

    async initialize() {
        try {
            const response = await axios.get(this.urlISOCodes, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            const html = response.data;
            const $ = cheerio.load(html);
            this.getIsoCodesOnly($);
            this.getImplodedIsoCodes();
            this.getIsoCodesWithCountries($);
        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    getIsoCodesWithCountries($) {
        $('.table_45 .gray_td').each((index, element) => {
            this.isoCodesCountries.push({
                isoCode: $(element).find('td:nth-child(1)').text().trim(),
                isoCodeCountry: $(element).find('td:nth-child(2)').text().trim()
            });
        });
    }

    getIsoCodesOnly($) {
        $('#ctl00_PlaceHolderMain_g_d6ca9d7a_5234_4ce8_87c4_a6f88cccb8e1_updatePanelctl00_PlaceHolderMain_g_d6ca9d7a_5234_4ce8_87c4_a6f88cccb8e1 table tr').each((index, element) => {
            if ($(element).find('td:nth-child(1)').text().trim() !== "ISO(code)") {
                const isoCode = $(element).find('td:nth-child(1) a').text().trim();
                this.isoCodes.push({ isoCode });
            }
        });
    }

    getImplodedIsoCodes() {
        this.isoCodesClear = this.isoCodes.map(isoCode => isoCode.isoCode);
        this.implodedIsoCodes = this.isoCodesClear.join(",");
    }

    async getFiltertDatesIsoData(dateFrom, dateTo) {
        try {
            const implodedIsoCodesUrl = `https://www.cba.am/am/SitePages/ExchangeArchive.aspx?DateFrom=${dateFrom}&DateTo=${dateTo}&ISOCodes=${this.implodedIsoCodes}`;
            const response = await axios.get(implodedIsoCodesUrl, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            const html = response.data;
            const $ = cheerio.load(html);
            const finalDataResponse = {};

            $('.table_46 > .gray_td, .table_46 > .gray_td_light').each((index, elements) => {
                const currDate = $(elements).children().first().text().trim();
                const currDateIsoValues = [];
                $(elements).children().slice(1).each((index, element) => {
                    const currIsoCode = this.isoCodesClear[index];
                    currDateIsoValues.push({ [currIsoCode]: $(element).text().trim() });
                });
                finalDataResponse[currDate] = currDateIsoValues;
            });

            return finalDataResponse;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
    async getAllIsoData() {
        try {
            
            const implodedIsoCodesUrl = `https://www.cba.am/am/SitePages/ExchangeArchive.aspx?ISOCodes=${this.implodedIsoCodes}`;
            const response = await axios.get(implodedIsoCodesUrl, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            const html = response.data;
            const $ = cheerio.load(html);
            const finalDataResponse = {};
            // console.log(html); return false;
            $('.table_46 > .gray_td, .table_46 > .gray_td_light').each((index, elements) => {
                console.log(index, elements);return false;
                const currDate = $(elements).children().first().text().trim();
                const currDateIsoValues = [];
                $(elements).children().slice(1).each((index, element) => {
                    const currIsoCode = this.isoCodesClear[index];
                    currDateIsoValues.push({ [currIsoCode]: $(element).text().trim() });
                });
                finalDataResponse[currDate] = currDateIsoValues;
            });



            return finalDataResponse;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}

module.exports = DataHtmlParser;
