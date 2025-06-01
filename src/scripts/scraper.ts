/* ==========================================================================
   Scraper for E-Selver and Rimi
   This script uses Puppeteer to scrape product information from E-Selver and Rimi's websites.
   It extracts product names, prices, images, and ingredients from the product pages.
   The scraped data is then returned as an array of Drink objects.
   The script also includes a function to analyze the ingredients and categorize them using a predefined mapping.
   ========================================================================== */

import * as puppeteer from 'puppeteer';
import type { ScrapedDrink } from "@/lib/types"
import { analyzeDrinkIngredients } from '../lib/tag-utils';

// Extract ingredients from Selver product page
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


// Function to extract ingredients from Rimi product page
async function extractRimiIngredients(page: puppeteer.Page, productUrl: string): Promise<string[]> {
  try {
    console.log(`Visiting Rimi product page: ${productUrl}`);
    
    // Navigate to the product page with correct URL handling
    const fullUrl = productUrl.startsWith('http') ? productUrl : `https://www.rimi.ee${productUrl}`;
    
    // Set user agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(fullUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('Page loaded, waiting for Vue to render...');
    
    // Wait for Vue.js to mount and render content
    await page.waitForFunction(() => {
      return document.querySelector('[data-v-]') || 
             document.querySelector('.product-details') ||
             document.body.innerHTML.includes('Koostisosad');
    }, { timeout: 15000 });
    
    // Additional wait for Vue components to fully render
    await new Promise(res => setTimeout(res, 3000));
    
    // Wait for ingredient content specifically
    try {
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return text.includes('karboniseeritud vesi') || text.includes('Koostisosad');
      }, { timeout: 10000 });
      console.log('Ingredient content detected');
    } catch (error) {
      console.error(error)
    }
    
    // Extract ingredients based on the HTML structure from your screenshot
    const ingredientsText = await page.evaluate(() => {
      // Strategy 1: Look for the exact structure from screenshot
      // Find all .product__list-wrapper elements
      const listWrappers = document.querySelectorAll('.product__list-wrapper');
      
      for (const wrapper of listWrappers) {
        // Check if this wrapper has "Koostisosad" heading
        const heading = wrapper.querySelector('.heading');
        if (heading && heading.textContent?.trim() === 'Koostisosad') {
          // Look for the text content in the structure: .list > .item > .text > p
          const textElement = wrapper.querySelector('.list .item .text p');
          if (textElement && textElement.textContent) {
            return textElement.textContent.trim();
          }
        }
      }
      
      // Strategy 2: Broader search for "Koostisosad" and following content
      const allElements = Array.from(document.querySelectorAll('*'));
      const koostisosadElement = allElements.find(el => 
        el.textContent?.trim() === 'Koostisosad'
      );
      
      if (koostisosadElement) {
        // Look in the parent container for ingredient text
        const parent = koostisosadElement.closest('.product__list-wrapper');
        if (parent) {
          const textElement = parent.querySelector('.text p, .text, p');
          if (textElement && textElement.textContent && textElement.textContent.includes('karboniseeritud')) {
            return textElement.textContent.trim();
          }
        }
      }
      
      return null;
    });
    
    if (ingredientsText) {
      console.log(`Raw ingredients found: ${ingredientsText.substring(0, 100)}...`);
      
      // Parse ingredients according to the structure seen in screenshot
      const ingredients = ingredientsText
        .replace(/\*keskmine täiskasvanu võrdluskogus.*$/, '') // Remove nutritional reference
        .split(/[,;]/)
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0)
        .map((item: string) => {
          // Clean up percentage indicators but keep the ingredient name
          return item.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
        })
        .filter((item: string) => item.length > 0);
      
      console.log(`Successfully extracted ${ingredients.length} ingredients from Rimi`);
      return ingredients;
    }
    
    // Debugging: Check what content is actually available
    const debugInfo = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      return {
        hasKoostisosad: bodyText.includes('Koostisosad'),
        hasKarboniseeritud: bodyText.includes('karboniseeritud'),
        hasProductWrapper: !!document.querySelector('.product__list-wrapper'),
        wrapperCount: document.querySelectorAll('.product__list-wrapper').length,
        textElementCount: document.querySelectorAll('.text').length
      };
    });
    
    console.log('Debug info:', debugInfo);
    console.log('No ingredients found on Rimi product page');
    return ['No ingredients found'];
    
  } catch (error) {
    console.error(`Error extracting ingredients from Rimi: ${error}`);
    return ['Error extracting ingredients'];
  }
}

// Example scraper function for E-Selver
export async function scrapeESelver(): Promise<ScrapedDrink[]> {

  const browser = await puppeteer.launch();

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

  const drinks: ScrapedDrink[] = []

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
export async function scrapeRimi(): Promise<ScrapedDrink[]> {
    const browser = await puppeteer.launch();

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

  const drinks: ScrapedDrink[] = []

   try {
    // Navigate to Rimi's sports drinks page
    await page.goto("https://www.rimi.ee/epood/ee/tooted/joogid/karastusjoogid/spordijoogid/c/SH-3-10")

    // Wait for the products to load
    await page.waitForSelector(".product-grid__item")

    // Extract product information
    const products = await page.$$(".product-grid__item")

    for (const product of products) {
      // Extract product details
      const name = await product.$eval(".card__name", (el) => el.textContent?.trim() || "")

      // const price = Number.parseFloat(priceText.replace("€", "").replace(",", "."))
      
      // Extract and parse price
      let price;
      try {
        // Get all text from the price container, including child elements
        const priceText = await product.$eval(".card__price-tag", el => el.textContent?.trim() || "0");
        
        // Clean and parse the price
        price = parseFloat(priceText.replace(/[^\d,\.]/g, '').replace(',', '.'));
        
      } catch {
        // First fallback: try ProductPrice selector
        try {
          const fallbackText = await product.$eval(".card__price-tag", el => el.textContent?.trim() || "0");
          price = parseFloat(fallbackText.replace(/[^\d,\.]/g, '').replace(',', '.'));
        } catch {
          // Second fallback: try extracting price components
          try {
            const wholePart = await product.$eval(".card__price-tag span, .price-tag span", 
              el => el.textContent?.trim() || "0");
            const decimalPart = await product.$eval(".card__price-tag sup, .price-tag sup",
              el => el.textContent?.trim().replace(/\D/g, '') || "0");
            price = parseFloat(`${wholePart}.${decimalPart}`);
          } catch {
            price = 0; // Last resort default
          }
        }
      }
      const imageUrl = await product.$eval("img", (el) => el.getAttribute("src") || "")
      const productUrl = await product.$eval("a", (el) => el.getAttribute("href") || "")
      console.log("Product URL for rimi prod:", productUrl)

       // Create a new page for ingredient extraction to avoid navigation issues on main page
        const ingredientPage = await browser.newPage();
        await ingredientPage.setDefaultNavigationTimeout(30000);
        
        // Extract ingredients
        const ingredients = await extractRimiIngredients(ingredientPage, productUrl);
          if (ingredients.includes('Error extracting ingredients') || 
            ingredients.includes('No ingredients found')) {
          console.log(`Skipping product ${name} due to ingredient extraction failure`);
          continue; // Skip this product and move to the next one
        }
        const tags = analyzeDrinkIngredients(ingredients);
        console.log("Tags:", tags);
        
        // Close the ingredient page to free up resources
        await ingredientPage.close();


      drinks.push({
        name,
        price,
        image: imageUrl,
        store: "Rimi",
        ingredients,
        url: productUrl.startsWith('http') ? productUrl : `https://www.rimi.ee${productUrl}`,
        tags
      })
    }
  } catch (error) {
    console.error("Error scraping Rimi:", error)
  } finally {
    await browser.close()
  }

  return drinks

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
