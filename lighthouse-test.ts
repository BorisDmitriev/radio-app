import puppeteer from 'puppeteer';
import fs from 'fs';
import pathModule from 'path';
import type {RunnerResult} from 'lighthouse';

(async () => {
    const baseUrl = 'http://localhost:4200';
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const lighthouse = (await import('lighthouse')).default;

    type User = {
        id: string;
        name: string;
        role: string;
    }

    async function setLogin(user: User) {
        await page.evaluate((userObj) => {
            localStorage.setItem('sessionUser', JSON.stringify(userObj));
        }, user);
        await page.reload({waitUntil: 'networkidle2'});
    }

    async function audit(route: string): Promise<{ lhr: RunnerResult['lhr'], report: string }> {
        const url = baseUrl + route;
        const wsUrl = browser.wsEndpoint();
        const port = Number(new URL(wsUrl).port); 

        const result = await lighthouse(url, {
            port, 
            disableStorageReset: true,
            onlyCategories: ['performance'],
            output: 'html'
        });

        const reportDir = 'lhci-reports';

        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir);
        }

        const {lhr, report} = result as RunnerResult;
        
        const fileName = pathModule.join(reportDir, route.replace(/\//g, '_') + '.html');
        fs.writeFileSync(fileName, report as string);

        const lcp = lhr.audits['largest-contentful-paint'].numericValue ?? 0;
        const cls = lhr.audits['cumulative-layout-shift'].numericValue ?? 0;
        console.log(`${route} LCP: ${lcp}, CLS: ${cls}`);

        if (lcp > 2500) console.error(`LCP überschritten: ${route}`);
        if (cls > 0.1) console.error(`CLS überschritten: ${route}`);

        return {lhr, report: report as string}
    }

    await page.goto(baseUrl, {waitUntil: 'networkidle2'});

    await audit('/');

    await setLogin({id: 'test1', name: 'Max', role: 'listener'});
    
    await audit('/now-playing');
    await audit('/playlist-rating');
    await audit('/song-request');
    await audit('/moderator-rating');

    await setLogin({id: 'test2', name: 'Jessica', role: 'moderator'});

    await audit('/moderator-dashboard');

    await browser.close();
})();