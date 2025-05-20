// This is a placeholder for the Puppeteer scraper
// You'll implement this script to scrape data from E-Selver and Rimi

import * as puppeteer from 'puppeteer';
import type { Drink } from "@/lib/types"

async function retry<T>(
  fn: () => Promise<T>, 
  retries = 3, 
  delay = 5000,
  errorMsg = "Operation failed"
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.log(`${errorMsg}, retrying in ${delay/1000}s... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay, errorMsg);
  }
}

async function extractIngredients(page: puppeteer.Page, productUrl: string): Promise<string[]> {
  try {
    console.log(`Visiting product page: ${productUrl}`);
    
    // Navigate to the product page
    await page.goto(`https://www.selver.ee${productUrl}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for accordion elements to load
    await page.waitForSelector('.AttributeAccordion__content', { timeout: 10000 });
    
    // Get all accordion contents
    const accordionContents = await page.$$('.AttributeAccordion__content');
    
    // Check if we have at least 2 accordion contents
    if (accordionContents.length >= 2) {
      // Extract text from the second accordion content
      const ingredientsText = await page.evaluate(el => el.textContent?.trim(), accordionContents[1]);
      
      if (ingredientsText) {
        // Split by commas, semicolons, or other common separators and trim each ingredient
        const ingredients = ingredientsText
          .split(/[,;.]/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
        
        console.log(`Found ${ingredients.length} ingredients`);
        return ingredients;
      }
    }
    
    console.log('No ingredients found on product page');
    return ['No ingredients found'];
  } catch (error) {
    console.error(`Error extracting ingredients from ${productUrl}:`, error);
    return ['Error extracting ingredients'];
  }
}

// Example scraper function for E-Selver
export async function scrapeESelver(): Promise<Drink[]> {
    // free proxy server URL
    const proxyURL = 'http://160.86.242.23:8080';

    // launch a browser instance with the
    // --proxy-server flag enabled
    const browser = await puppeteer.launch();


//   const browser = await puppeteer.launch()
  const page = await browser.newPage()
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36');
    
    // Set viewport to simulate a regular browser window
    await page.setViewport({ width: 1366, height: 768 });
    
    // Increase navigation timeout
    await page.setDefaultNavigationTimeout(60000); // 60 seconds
    
    // Disable browser features that might reveal we're automating
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

  const drinks: Drink[] = []

  try {
    // Navigate to E-Selver's functional drinks page
    await page.goto("https://www.selver.ee/joogid/spordijoogid-pulbrid-batoonid")
    
    // extract the IP the request comes from
    // and print it
    // const body = await page.waitForSelector('body');
    // if (body) {
    //     const ip = await body.getProperty('textContent');
    //     console.log(await ip.jsonValue());
    // }

    // Wait for the products to load
    await page.waitForSelector(".ProductCard")

    // Extract product information
    const products = await page.$$(".ProductCard")

    for (const product of products) {
      // Extract product details
      const name = await product.$eval(".ProductCard__title", (el) => el.textContent?.trim() || "")
      const priceText = await product.$eval(".ProductPrice", (el) => el.textContent?.trim() || "0")
      const price = Number.parseFloat(priceText.replace("€", "").replace(",", "."))
      const imageUrl = await product.$eval("img", (el) => el.getAttribute("src") || "")
      const productUrl = await product.$eval("a", (el) => el.getAttribute("href") || "")
      console.log("Product details:", { 
        name, 
        price, 
        imageUrl, 
        productUrl 
    })

       // Create a new page for ingredient extraction to avoid navigation issues on main page
        const ingredientPage = await browser.newPage();
        await ingredientPage.setDefaultNavigationTimeout(30000);
        
        // Extract ingredients
        const ingredients = await extractIngredients(ingredientPage, productUrl);
        console.log("Ingredients:", ingredients);
        
        // Close the ingredient page to free up resources
        await ingredientPage.close();

      drinks.push({
        name,
        price,
        image: imageUrl,
        store: "E-Selver",
        ingredients,
        url: `https://www.selver.ee${productUrl}`,
      })
    }
  } catch (error) {
    console.error("Error scraping E-Selver:", error)
  } finally {
    await browser.close()
  }

  return drinks
}

// Example scraper function for Rimi
export async function scrapeRimi(): Promise<Drink[]> {
  // You'll need to adapt the selectors and logic for Rimi's website
  console.log("Scraping Rimi...")
  return []
}

// Main function to run both scrapers
export async function scrapeAllStores() {
  const selverDrinks = await scrapeESelver()
  const rimiDrinks = await scrapeRimi()

  const allDrinks = [...selverDrinks, ...rimiDrinks]

  // Here you would save the data to Supabase or another storage
//   console.log(`Scraped ${allDrinks.length} drinks in total`)

  return allDrinks

}

// Uncomment to run the scraper
if (require.main === module) {
  scrapeAllStores()
}
