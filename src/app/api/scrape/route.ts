import { NextRequest, NextResponse } from "next/server"
import { scrapeAllStores } from "@/scripts/scraper"
import { createSupabaseAdmin } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    // Get query params
     const { searchParams } = new URL(request.url);
    const options = {
      includeSelver: searchParams.get('selver') !== 'false',
      includeRimi: searchParams.get('rimi') !== 'false',
      includePrisma: searchParams.get('prisma') !== 'false'
    };
    console.log(options, "options in API")

    // 1. Run the scraper
    console.log("Starting scraper process...")
    const allDrinks = await scrapeAllStores(options)
    
    // Skip Supabase save if no drinks found
    if (allDrinks.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No drinks found during scraping",
      }, { status: 404 })
    }
    
    // 2. Save to Supabase
      const supabase = createSupabaseAdmin()

    //Filter out duplicates before inserting
    const uniqueDrinks = Array.from(new Map(allDrinks.map(drink => [drink.url, drink])).values());

    // Insert/update the data in Supabase
    const { error } = await supabase
      .from('drinks')
      .upsert(uniqueDrinks, {
        onConflict: 'url',
        ignoreDuplicates: false
      })
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({
        success: false,
        message: `Failed to save to database: ${error.message}`,
      }, { status: 500 })
    }
    
    // 3. Return success response
    return NextResponse.json({
      success: true,
      message: `Successfully scraped and saved ${allDrinks.length} drinks`,
      count: allDrinks.length,
      stores: {
        selver: allDrinks.filter(d => d.store === "E-Selver").length,
        rimi: allDrinks.filter(d => d.store === "Rimi").length,
        prisma: allDrinks.filter(d => d.store === "E-Prisma").length
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error("Error running scraper:", error)
    return NextResponse.json({
      success: false,
      message: `Failed to run scraper: ${errorMessage}`,
    }, { status: 500 })
  }
}