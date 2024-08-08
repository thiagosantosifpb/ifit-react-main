import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lnvajrohqoobgbonfurp.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


let { data: exercicios, error } = await supabase
  .from('exercicios')
  .select('*')
