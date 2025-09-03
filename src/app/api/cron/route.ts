import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
    try { 
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // query to keep project active in Supabase
        const { data, error } = await supabase
        .from('keep_alive')
        .select('id')
        .limit(1)

         if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { 
                success: false, 
                error: error.message,
                timestamp: new Date().toISOString()
                },
                { status: 500 }
            )
         }
           return NextResponse.json({
                success: true,
                message: 'Database pinged successfully',
                timestamp: new Date().toISOString(),
                recordsFound: data?.length || 0
            })

     }
     catch(error) {
         console.error('Keep-alive error:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
            )

     }
}