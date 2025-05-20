import { NextResponse } from "next/server"
import { scrapeAllStores } from "@/scripts/scraper"
import { createSupabaseAdmin } from "@/lib/supabase-client"

export async function GET() {
  try {
    // 1. Run the scraper
    console.log("Starting scraper process...")
    const allDrinks = await scrapeAllStores()
    
    // Skip Supabase save if no drinks found
    if (allDrinks.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No drinks found during scraping",
      }, { status: 404 })
    }
    
    // 2. Save to Supabase
      const supabase = createSupabaseAdmin()

    
    // Insert/update the data in Supabase
    const { data, error } = await supabase
      .from('drinks')
      .upsert(allDrinks, {
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
        rimi: allDrinks.filter(d => d.store === "Rimi").length
      }
    })
  } catch (error: any) {
    console.error("Error running scraper:", error)
    return NextResponse.json({
      success: false,
      message: `Failed to run scraper: ${error.message}`,
    }, { status: 500 })
  }
}