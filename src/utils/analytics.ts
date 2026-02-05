// utils/analytics.ts
import { supabase } from '@/utils/supabaseClient';

export const logCareerSearch = async (math: string, science: string, career: string) => {
  const { error } = await supabase
    .from('career_searches')
    .insert([
      { 
        math_grade: math, 
        science_grade: science, 
        recommended_career: career 
      },
    ]);

  if (error) console.error('Error logging search:', error);
};