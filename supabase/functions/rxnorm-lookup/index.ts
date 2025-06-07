
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { medicineName } = await req.json()
    
    if (!medicineName) {
      return new Response(
        JSON.stringify({ error: 'Medicine name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Search for medicines using RxNorm API
    const searchUrl = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(medicineName)}`
    const response = await fetch(searchUrl)
    const data = await response.json()

    let rxnormCode = null
    let normalizedName = medicineName

    if (data.drugGroup?.conceptGroup) {
      // Find the best match from RxNorm results
      const concepts = data.drugGroup.conceptGroup
        .filter((group: any) => group.tty === 'SCD' || group.tty === 'SBD') // Semantic Clinical Drug or Semantic Branded Drug
        .flatMap((group: any) => group.conceptProperties || [])

      if (concepts.length > 0) {
        const bestMatch = concepts[0]
        rxnormCode = bestMatch.rxcui
        normalizedName = bestMatch.name
      }
    }

    return new Response(
      JSON.stringify({
        rxnormCode,
        normalizedName,
        originalName: medicineName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('RxNorm lookup error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to lookup medicine in RxNorm' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
