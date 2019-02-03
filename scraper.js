const puppeteer = require('puppeteer');

(async  () => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const url = 'https://www.relaischateaux.com/us/destinations/europe/france';
    await page.goto(url);
    //await page.screenshot({ path: 'example.png' });
    await page.waitFor('h3.mainTitle3')
    const hotels = await page.evaluate(() => 
        Array.from(document.querySelectorAll('h3.mainTitle3')).map(partner =>
            partner.innerText.trim()
            )
    );
    
    console.log(hotels);
    await browser.close();
    
})
(); 