/* ==========================================================================
   Scraper for E-Selver and Rimi
   This script uses Puppeteer to scrape product information from E-Selver and Rimi's websites.
   It extracts product names, prices, images, and ingredients from the product pages.
   The scraped data is then returned as an array of Drink objects.
   The script also includes a function to analyze the ingredients and categorize them using a predefined mapping.
   ========================================================================== */

import * as puppeteer from 'puppeteer';
import type { Drink } from "@/lib/types"
import { analyzeDrinkIngredients } from '../lib/tag-utils';


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

       // Create a new page for ingredient extraction to avoid navigation issues on main page
        const ingredientPage = await browser.newPage();
        await ingredientPage.setDefaultNavigationTimeout(30000);
        
        // Extract ingredients
        const ingredients = await extractIngredients(ingredientPage, productUrl);
        const tags = analyzeDrinkIngredients(ingredients);
        console.log("Tags:", tags);
        
        // Close the ingredient page to free up resources
        await ingredientPage.close();


      drinks.push({
        name,
        price,
        image: imageUrl,
        store: "E-Selver",
        ingredients,
        url: `https://www.selver.ee${productUrl}`,
        tags
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

  // Return all drinks for so the API can insert them in to the database
  return allDrinks

}

// Uncomment to run the scraper
if (require.main === module) {
  scrapeAllStores()
}
