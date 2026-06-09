import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, amount, description, type, referralCode } = await req.json()

    if (action === 'deduct_coins') {
      // 1. Check balance
      const { data: coinData, error: balanceError } = await supabaseClient
        .from('user_coins')
        .select('balance')
        .eq('user_id', userId)
        .single()

      if (balanceError || !coinData) {
        throw new Error('Balance not found')
      }

      if (coinData.balance < amount) {
        throw new Error('Insufficient coins')
      }

      // 2. Deduct coins and log transaction in a transaction-like way
      const { error: updateError } = await supabaseClient.rpc('deduct_coins_and_log', {
        p_user_id: userId,
        p_amount: amount,
        p_type: type,
        p_description: description
      })

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'approve_payment') {
      const { requestId, adminId } = await req.json()

      // 1. Get request details
      const { data: request, error: requestError } = await supabaseClient
        .from('payment_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (requestError || !request) throw new Error('Payment request not found')
      if (request.status !== 'pending') throw new Error('Request already processed')

      // 2. Activate based on type
      if (request.type === 'subscription') {
        const durations: Record<string, number> = {
          'weekly': 7,
          'monthly': 30,
          '3months': 90,
          'yearly': 365
        }
        const days = durations[request.plan_type] || 30
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + days)

        await supabaseClient.from('user_subscriptions').upsert({
          user_id: request.user_id,
          plan_type: request.plan_type,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: expiryDate.toISOString(),
          admin_approved_by: adminId
        })
        
        // Check for referral bonus if subscription is activated
        const { data: referral } = await supabaseClient
          .from('referral_history')
          .select('referrer_id')
          .eq('referred_id', request.user_id)
          .single()
        
        if (referral) {
          const bonusMap: Record<string, number> = {
            'weekly': 150,
            'monthly': 300,
            'yearly': 800
          }
          const bonus = bonusMap[request.plan_type]
          if (bonus) {
            await supabaseClient.rpc('add_coins_and_log', {
              p_user_id: referral.referrer_id,
              p_amount: bonus,
              p_type: 'referral_bonus',
              p_description: `Bonus for referral's ${request.plan_type} subscription`
            })
          }
        }

      } else if (request.type === 'coins') {
        await supabaseClient.rpc('add_coins_and_log', {
          p_user_id: request.user_id,
          p_amount: request.coin_amount,
          p_type: 'purchase',
          p_description: 'Coin package purchase'
        })
      }

      // 3. Update request status
      await supabaseClient
        .from('payment_requests')
        .update({
          status: 'approved',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'onboard_user') {
      // 1. Give signup bonus
      await supabaseClient.rpc('add_coins_and_log', {
        p_user_id: userId,
        p_amount: 150,
        p_type: 'signup_bonus',
        p_description: 'Xush kelibsiz bonusi!'
      })

      // 2. Create referral link
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      await supabaseClient.from('referral_links').insert({
        user_id: userId,
        referral_code: code
      })

      // 3. Handle referral code if provided
      if (referralCode) {
        const { data: link } = await supabaseClient
          .from('referral_links')
          .select('user_id')
          .eq('referral_code', referralCode)
          .single()

        if (link && link.user_id !== userId) {
          // Add 100 to new user
          await supabaseClient.rpc('add_coins_and_log', {
            p_user_id: userId,
            p_amount: 100,
            p_type: 'referral_reward',
            p_description: 'Referral orqali qo\'shilganingiz uchun bonus'
          })

          // Add 50 to referrer
          await supabaseClient.rpc('add_coins_and_log', {
            p_user_id: link.user_id,
            p_amount: 50,
            p_type: 'referral_reward',
            p_description: 'Yangi do\'st taklif qilganingiz uchun bonus'
          })

          // Log referral history
          await supabaseClient.from('referral_history').insert({
            referrer_id: link.user_id,
            referred_id: userId,
            reward_amount: 50
          })
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
